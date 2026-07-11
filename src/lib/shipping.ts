export const FLAT_SHIPPING_COST = 15000;
export const FREE_SHIPPING_THRESHOLD = 250000;

export function calculateShippingCost(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
}
