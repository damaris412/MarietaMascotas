import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { mpPayment } from "@/server/payments/mercadopago";
import { sendMail } from "@/server/email/mailer";
import { orderConfirmationEmail } from "@/server/email/templates";

function mapPaymentMethod(paymentTypeId?: string) {
  switch (paymentTypeId) {
    case "credit_card":
    case "debit_card":
      return "MERCADO_PAGO_CARD" as const;
    case "bank_transfer":
    case "atm":
      return "MERCADO_PAGO_PSE" as const;
    case "ticket":
      return "MERCADO_PAGO_CASH" as const;
    default:
      return "OTHER" as const;
  }
}

function mapStatus(mpStatus: string) {
  if (mpStatus === "approved") return "PAID" as const;
  if (mpStatus === "rejected" || mpStatus === "cancelled") return "CANCELLED" as const;
  return "PENDING" as const;
}

/**
 * Verifica la firma HMAC-SHA256 que Mercado Pago envía en el header
 * "x-signature" (ts + v1), según el algoritmo oficial:
 * https://www.mercadopago.com.ar/developers/es/docs/checkout-api/webhooks#editor_5
 * manifest = "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
function isValidSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const signatureHeader = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");

  if (!secret) {
    if (process.env.NODE_ENV === "production") return false;
    console.warn(
      "[webhooks/mercado-pago] MERCADOPAGO_WEBHOOK_SECRET no configurado — se omite la verificación de firma (solo permitido fuera de producción)."
    );
    return true;
  }

  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    })
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(v1, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
    let dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    const body = await req.json().catch(() => null);
    dataId = dataId ?? body?.data?.id ?? null;

    if (type !== "payment" || !dataId) {
      return NextResponse.json({ received: true });
    }

    if (!isValidSignature(req, dataId)) {
      console.warn("[webhooks/mercado-pago] Firma inválida, notificación rechazada.");
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    // Nunca confiamos en el estado que venga en la notificación: siempre se
    // vuelve a consultar el pago a la API de Mercado Pago con nuestro access
    // token para confirmar el estado real antes de tocar la base de datos.
    const payment = await mpPayment.get({ id: dataId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { email: true, name: true } } },
    });
    if (!order) return NextResponse.json({ received: true });

    const nextStatus = mapStatus(payment.status ?? "pending");

    if (nextStatus === "PAID" && order.status !== "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
            mpPaymentId: String(payment.id),
            paymentMethod: mapPaymentMethod(payment.payment_type_id),
          },
        }),
        ...order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);

      const customerEmail = order.guestEmail ?? order.user?.email;
      if (customerEmail) {
        await sendMail({
          to: customerEmail,
          subject: "¡Tu compra fue confirmada! — Marieta Mascotas",
          html: orderConfirmationEmail({
            customerName: order.guestName ?? order.user?.name ?? "Cliente",
            orderId: order.id,
            items: order.items.map((item) => ({
              title: item.title,
              quantity: item.quantity,
              size: item.size,
              price: Number(item.price),
            })),
            shippingCost: Number(order.shippingCost),
            total: Number(order.total),
          }),
        });
      }
    } else if (nextStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus,
          mpPaymentId: String(payment.id),
          paymentMethod: mapPaymentMethod(payment.payment_type_id),
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhooks/mercado-pago]", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
