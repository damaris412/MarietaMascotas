const AREA_LABELS: Record<string, string> = {
  MARKETING: "Marketing",
  CATALOGO_FOTOS: "Fotos / subida de catálogo",
  IMAGENES_IA: "Generación de imágenes (IA)",
  FLETE_ENVIOS: "Flete / envíos",
  COLABORACIONES: "Colaboraciones entre empresas",
  EVENTOS: "Eventos",
  PACKAGING: "Packaging",
  OTRO: "Otro",
};

export function areaLabel(area: string) {
  return AREA_LABELS[area] ?? area;
}

export function applicantConfirmationEmail(name: string) {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ee; padding:32px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #d3e0c3;">
      <div style="background:#26402f; padding:28px 32px;">
        <p style="margin:0; color:#faf6ee; font-size:20px; font-style:italic;">Marieta Mascotas</p>
      </div>
      <div style="padding:32px; color:#2b2a25;">
        <h1 style="font-size:20px; margin:0 0 16px;">¡Hola, ${name}!</h1>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44;">
          Recibimos tu postulación para sumarte a Marieta Mascotas. Muchas gracias por tu interés
          en formar parte del equipo.
        </p>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44;">
          Vamos a revisar tu mensaje y, si tu perfil encaja con lo que estamos buscando, nos
          vamos a poner en contacto con vos a la brevedad.
        </p>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44; margin-top:24px;">
          ¡Gracias por escribirnos! 🐾
        </p>
      </div>
    </div>
  </div>`;
}

export function ownerNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  resumeUrl?: string;
}) {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ee; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #d3e0c3;">
      <div style="background:#26402f; padding:24px 32px;">
        <p style="margin:0; color:#faf6ee; font-size:18px; font-style:italic;">Nueva postulación</p>
      </div>
      <div style="padding:28px 32px; color:#2b2a25; font-size:14px; line-height:1.7;">
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Correo:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Área:</strong> ${areaLabel(data.area)}</p>
        ${data.resumeUrl ? `<p><strong>CV / propuesta:</strong> <a href="${data.resumeUrl}">${data.resumeUrl}</a></p>` : ""}
        <p><strong>Mensaje:</strong></p>
        <p style="background:#f4f7ef; border-radius:12px; padding:12px 16px;">${data.message}</p>
      </div>
    </div>
  </div>`;
}
