import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { mpPayment } from "@/server/payments/mercadopago";

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

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
    let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    if (!paymentId) {
      const body = await req.json().catch(() => null);
      paymentId = body?.data?.id ?? null;
    }

    if (type !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = await mpPayment.get({ id: paymentId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
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

export async function GET(req: NextRequest) {
  return POST(req);
}
