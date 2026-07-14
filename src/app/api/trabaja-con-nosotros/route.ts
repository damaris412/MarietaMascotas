import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { jobApplicationSchema } from "@/lib/validation";
import { sendMail } from "@/server/email/mailer";
import { applicantConfirmationEmail, ownerNotificationEmail } from "@/server/email/templates";
import { checkRateLimit, getClientIp, RATE_LIMIT_MESSAGE } from "@/server/utils/rateLimit";

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(`job-application:${getClientIp(req)}`, 5);
  if (!allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const json = await req.json();
  const parsed = jobApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const application = await prisma.jobApplication.create({ data });

  const applicantSent = await sendMail({
    to: data.email,
    subject: "Recibimos tu postulación — Marieta Mascotas",
    html: applicantConfirmationEmail(data.name),
  });

  const ownerEmail = process.env.ADMIN_EMAIL;
  if (ownerEmail) {
    await sendMail({
      to: ownerEmail,
      subject: `Nueva postulación: ${data.name}`,
      html: ownerNotificationEmail(data),
    });
  }

  if (applicantSent) {
    await prisma.jobApplication.update({
      where: { id: application.id },
      data: { emailSent: true },
    });
  }

  return NextResponse.json({ ok: true, emailSent: applicantSent });
}
