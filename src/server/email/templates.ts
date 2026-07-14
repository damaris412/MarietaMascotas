const LOGO_URL = "https://marietamascotas.vercel.app/images/logo/logo-email.png";
const LOGO_IMG = `<img src="${LOGO_URL}" alt="Marieta Mascotas" width="40" height="40" style="display:block; margin:0 auto 14px; border-radius:50%;" />`;

// Todo texto que venga de un formulario público (nombre, mensaje, notas, etc.)
// pasa por acá antes de insertarse en el HTML del email — sin esto, alguien
// podría escribir HTML/links falsos en un campo de texto y que se rendericen
// como si fueran parte real del correo que recibe la dueña del negocio.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
        ${LOGO_IMG}
        <h1 style="font-size:20px; margin:0 0 16px;">¡Hola, ${escapeHtml(name)}!</h1>
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
        <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Área:</strong> ${escapeHtml(areaLabel(data.area))}</p>
        ${data.resumeUrl ? `<p><strong>CV / propuesta:</strong> <a href="${escapeHtml(data.resumeUrl)}">${escapeHtml(data.resumeUrl)}</a></p>` : ""}
        <p><strong>Mensaje:</strong></p>
        <p style="background:#f4f7ef; border-radius:12px; padding:12px 16px;">${escapeHtml(data.message)}</p>
      </div>
    </div>
  </div>`;
}

function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function orderConfirmationEmail(data: {
  customerName: string;
  orderId: string;
  items: { title: string; quantity: number; size: string | null; price: number }[];
  shippingCost: number;
  total: number;
}) {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 0; color:#2b2a25;">
            ${escapeHtml(item.title)}${item.size ? ` (talla ${escapeHtml(item.size)})` : ""} × ${item.quantity}
          </td>
          <td style="padding:6px 0; text-align:right; color:#2b2a25; white-space:nowrap;">
            ${formatARS(item.price * item.quantity)}
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ee; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #d3e0c3;">
      <div style="background:#26402f; padding:28px 32px;">
        <p style="margin:0; color:#faf6ee; font-size:20px; font-style:italic;">Marieta Mascotas</p>
      </div>
      <div style="padding:32px; color:#2b2a25;">
        ${LOGO_IMG}
        <h1 style="font-size:20px; margin:0 0 16px;">¡Gracias por tu compra, ${escapeHtml(data.customerName)}!</h1>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44;">
          Recibimos tu pago correctamente. En breve te vamos a contactar por WhatsApp con más
          detalles sobre el envío de tu pedido.
        </p>
        <p style="font-size:12px; color:#7a7a72; margin-top:20px;">Pedido #${data.orderId.slice(-8)}</p>
        <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:14px;">
          ${itemsHtml}
          <tr>
            <td style="padding:10px 0 0; border-top:1px solid #e2e2da; color:#4a4a44;">Envío</td>
            <td style="padding:10px 0 0; border-top:1px solid #e2e2da; text-align:right; color:#4a4a44;">
              ${data.shippingCost === 0 ? "Gratis" : formatARS(data.shippingCost)}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-weight:bold; color:#26402f;">Total</td>
            <td style="padding:6px 0; text-align:right; font-weight:bold; color:#26402f;">
              ${formatARS(data.total)}
            </td>
          </tr>
        </table>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44; margin-top:24px;">
          ¡Gracias por elegirnos! 🐾
        </p>
      </div>
    </div>
  </div>`;
}

export function customOrderConfirmationEmail(ownerName: string, petName: string) {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ee; padding:32px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #d3e0c3;">
      <div style="background:#26402f; padding:28px 32px;">
        <p style="margin:0; color:#faf6ee; font-size:20px; font-style:italic;">Marieta Mascotas</p>
      </div>
      <div style="padding:32px; color:#2b2a25;">
        ${LOGO_IMG}
        <h1 style="font-size:20px; margin:0 0 16px;">¡Hola, ${escapeHtml(ownerName)}!</h1>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44;">
          Recibimos tu pedido de prenda a medida para ${escapeHtml(petName)}. Vamos a revisar las medidas y
          las referencias que nos enviaste, y te vamos a contactar a la brevedad para avanzar con
          el diseño.
        </p>
        <p style="font-size:14px; line-height:1.6; color:#4a4a44; margin-top:24px;">
          ¡Gracias por confiar en nosotros! 🐾
        </p>
      </div>
    </div>
  </div>`;
}

export function customOrderNotificationEmail(data: {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  petName: string;
  petAge: string;
  petBreed: string;
  neckCm: number;
  chestCm: number;
  backLengthCm: number;
  eventName?: string;
  notes?: string;
  fabricMediaUrls: string[];
  petMediaUrls: string[];
}) {
  const mediaLinks = (urls: string[]) =>
    urls.length
      ? urls
          .map((url, i) => `<a href="${escapeHtml(url)}" style="display:block;">Archivo ${i + 1}</a>`)
          .join("")
      : "<span>—</span>";

  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background:#faf6ee; padding:32px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #d3e0c3;">
      <div style="background:#26402f; padding:24px 32px;">
        <p style="margin:0; color:#faf6ee; font-size:18px; font-style:italic;">Nuevo pedido de sastrería a medida</p>
      </div>
      <div style="padding:28px 32px; color:#2b2a25; font-size:14px; line-height:1.7;">
        <p><strong>Dueño:</strong> ${escapeHtml(data.ownerName)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(data.ownerEmail)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(data.ownerPhone)}</p>
        <p><strong>Mascota:</strong> ${escapeHtml(data.petName)} — ${escapeHtml(data.petBreed)}, ${escapeHtml(data.petAge)}</p>
        <p><strong>Medidas:</strong> cuello ${data.neckCm}cm · tórax ${data.chestCm}cm · lomo ${data.backLengthCm}cm</p>
        ${data.eventName ? `<p><strong>Evento:</strong> ${escapeHtml(data.eventName)}</p>` : ""}
        ${data.notes ? `<p><strong>Comentarios:</strong></p><p style="background:#f4f7ef; border-radius:12px; padding:12px 16px;">${escapeHtml(data.notes)}</p>` : ""}
        <p><strong>Referencias de tela:</strong></p>
        <div style="background:#f4f7ef; border-radius:12px; padding:12px 16px;">${mediaLinks(data.fabricMediaUrls)}</div>
        <p style="margin-top:12px;"><strong>Fotos/videos de la mascota:</strong></p>
        <div style="background:#f4f7ef; border-radius:12px; padding:12px 16px;">${mediaLinks(data.petMediaUrls)}</div>
      </div>
    </div>
  </div>`;
}
