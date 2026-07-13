import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { sendMail } from "@/server/email/mailer";
import { orderConfirmationEmail } from "@/server/email/templates";

export async function POST() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const to = process.env.ADMIN_EMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "No hay ADMIN_EMAIL configurado para enviar la prueba." },
      { status: 400 }
    );
  }

  const sent = await sendMail({
    to,
    subject: "[Prueba] ¡Tu compra fue confirmada! — Marieta Mascotas",
    html: orderConfirmationEmail({
      customerName: "Cliente de Ejemplo",
      orderId: "test-0000000000",
      items: [
        { title: "Buzo azul de polar", quantity: 1, size: "M", price: 8000 },
        { title: "Petit Bijou Baby", quantity: 2, size: "S", price: 15000 },
      ],
      shippingCost: 15000,
      total: 53000,
    }),
  });

  if (!sent) {
    return NextResponse.json(
      { error: "No se pudo enviar. Revisá GMAIL_USER/GMAIL_APP_PASSWORD en las variables de entorno." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, to });
}
