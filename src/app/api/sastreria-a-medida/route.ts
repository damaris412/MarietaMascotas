import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { customOrderSchema } from "@/lib/validation";
import { sendMail } from "@/server/email/mailer";
import {
  customOrderConfirmationEmail,
  customOrderNotificationEmail,
} from "@/server/email/templates";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = customOrderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const request = await prisma.customOrderRequest.create({
    data: {
      ...data,
      fabricMediaUrls: data.fabricMediaUrls ?? [],
      petMediaUrls: data.petMediaUrls ?? [],
    },
  });

  const ownerSent = await sendMail({
    to: data.ownerEmail,
    subject: "Recibimos tu pedido a medida — Marieta Mascotas",
    html: customOrderConfirmationEmail(data.ownerName, data.petName),
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `Nuevo pedido a medida: ${data.petName} (${data.ownerName})`,
      html: customOrderNotificationEmail({
        ...request,
        neckCm: Number(request.neckCm),
        chestCm: Number(request.chestCm),
        backLengthCm: Number(request.backLengthCm),
        eventName: request.eventName ?? undefined,
        notes: request.notes ?? undefined,
      }),
    });
  }

  if (ownerSent) {
    await prisma.customOrderRequest.update({
      where: { id: request.id },
      data: { emailSent: true },
    });
  }

  return NextResponse.json({ ok: true, emailSent: ownerSent });
}
