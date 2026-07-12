export const DEFAULT_SHIPPING_SETTINGS = {
  shippingCost: 15000,
  freeShippingThreshold: 250000,
};

export type ShippingSettings = typeof DEFAULT_SHIPPING_SETTINGS;

export function calculateShippingCost(subtotal: number, settings: ShippingSettings) {
  return subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
}
