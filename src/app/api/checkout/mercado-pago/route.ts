import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";
import { createCheckoutPreference } from "@/server/payments/mercadopago";
import { checkoutRequestSchema } from "@/lib/validation";
import { calculateShippingCost } from "@/lib/shipping";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const json = await req.json();
    const parsed = checkoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    const { items, guest } = parsed.data;

    if (!session?.user && !guest) {
      return NextResponse.json(
        { error: "Debes iniciar sesión con Google o completar tus datos de invitado." },
        { status: 400 }
      );
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    if (products.length !== new Set(productIds).size) {
      return NextResponse.json(
        { error: "Alguno de los productos ya no está disponible." },
        { status: 400 }
      );
    }

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`Sin stock suficiente de "${product.title}"`);
      }
      return {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        size: item.size ?? undefined,
        unitPrice: Number(product.price),
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingCost = calculateShippingCost(subtotal);
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id,
        guestName: guest?.name,
        guestEmail: guest?.email,
        guestDni: guest?.dni,
        guestAddress: guest?.address,
        shippingCost,
        total,
        items: {
          create: orderItems.map(({ productId, title, price, quantity, size }) => ({
            productId,
            title,
            price,
            quantity,
            size,
          })),
        },
      },
    });

    const payerEmail = session?.user?.email ?? guest?.email;

    const preference = await createCheckoutPreference({
      orderId: order.id,
      items: orderItems.map((item) => ({
        id: item.productId,
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      shippingCost,
      payerEmail: payerEmail ?? undefined,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    return NextResponse.json({
      orderId: order.id,
      initPoint: preference.init_point,
    });
  } catch (error) {
    console.error("[checkout/mercado-pago]", error);
    const message = error instanceof Error ? error.message : "No se pudo iniciar el pago.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
