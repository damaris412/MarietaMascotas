import nodemailer from "nodemailer";

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendMail(options: { to: string; subject: string; html: string }) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[mailer] GMAIL_USER/GMAIL_APP_PASSWORD no configurados, se omite el envío.");
    return false;
  }

  try {
    await transport.sendMail({
      from: `"Marieta Mascotas" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error("[mailer] Error enviando correo:", error);
    return false;
  }
}
