import { prisma } from "@/server/db/prisma";
import { DEFAULT_SHIPPING_SETTINGS, type ShippingSettings } from "@/lib/shipping";

const SETTINGS_ID = "singleton";

export async function getStoreSettings(): Promise<ShippingSettings> {
  const row = await prisma.storeSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!row) return DEFAULT_SHIPPING_SETTINGS;
  return {
    shippingCost: Number(row.shippingCost),
    freeShippingThreshold: Number(row.freeShippingThreshold),
  };
}

export async function updateStoreSettings(data: ShippingSettings): Promise<ShippingSettings> {
  const row = await prisma.storeSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
  return {
    shippingCost: Number(row.shippingCost),
    freeShippingThreshold: Number(row.freeShippingThreshold),
  };
}
