import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

export const mpClient = new MercadoPagoConfig({
  accessToken: accessToken ?? "TEST-ACCESS-TOKEN-PLACEHOLDER",
  options: { timeout: 8000 },
});

export const mpPreference = new Preference(mpClient);
export const mpPayment = new Payment(mpClient);

type PreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
};

export async function createCheckoutPreference({
  orderId,
  items,
  shippingCost,
  payerEmail,
}: {
  orderId: string;
  items: PreferenceItem[];
  shippingCost: number;
  payerEmail?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const preferenceItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    currency_id: "ARS",
  }));

  if (shippingCost > 0) {
    preferenceItems.push({
      id: "envio",
      title: "Costo de envío",
      quantity: 1,
      unit_price: shippingCost,
      currency_id: "ARS",
    });
  }

  const response = await mpPreference.create({
    body: {
      items: preferenceItems,
      payer: payerEmail ? { email: payerEmail } : undefined,
      external_reference: orderId,
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failure`,
        pending: `${siteUrl}/checkout/pending`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhooks/mercado-pago`,
      statement_descriptor: "MARIETA MASCOTAS",
      // No excluimos ningún medio de pago: al no listar nada en
      // excluded_payment_types/excluded_payment_methods, el Checkout Pro
      // muestra todo lo habilitado para la cuenta y el país (AR): tarjeta de
      // crédito, tarjeta de débito, transferencia bancaria, dinero en cuenta
      // / QR de la billetera Mercado Pago, y efectivo (Rapipago y Pago
      // Fácil vía "ticket") — este último genera automáticamente, del lado
      // de Mercado Pago, el cupón con código de barras para pagar en el
      // local; no hace falta generarlo nosotros.
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12,
        default_installments: 1,
      },
    },
  });

  return response;
}
