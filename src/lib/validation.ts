import { z } from "zod";

export const localitySchema = z.enum(["VILLA_MARIA", "VILLA_NUEVA", "OTRA"]);
export type LocalityValue = z.infer<typeof localitySchema>;

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  size: z.enum(["S", "M", "L"]).nullable(),
});

export const guestDetailsSchema = z.object({
  name: z.string().min(3, "Ingresa tu nombre completo"),
  email: z.string().email("Ingresa un correo válido"),
  dni: z
    .string()
    .min(5, "El DNI debe tener al menos 5 dígitos")
    .max(15, "El DNI no es válido")
    .regex(/^[0-9A-Za-z-]+$/, "El DNI solo puede tener números y letras"),
  phone: z
    .string()
    .min(6, "Ingresa un teléfono válido")
    .max(20, "El teléfono no es válido")
    .regex(/^[0-9+\s-]+$/, "El teléfono solo puede tener números, espacios, + y -"),
  address: z.string().min(10, "Ingresa la dirección completa de envío"),
});

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "El carrito está vacío"),
  guest: guestDetailsSchema.optional(),
  locality: localitySchema,
});

export type GuestDetails = z.infer<typeof guestDetailsSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const profileSchema = z.object({
  address: z.string().min(10, "Ingresa la dirección completa"),
  locality: localitySchema,
  phone: z
    .string()
    .min(6, "Ingresa un teléfono válido")
    .max(20, "El teléfono no es válido")
    .regex(/^[0-9+\s-]+$/, "El teléfono solo puede tener números, espacios, + y -"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const productSchema = z.object({
  title: z.string().min(3, "El título es muy corto"),
  description: z.string().min(10, "La descripción es muy corta"),
  categoryId: z.string().min(1, "Elegí una categoría"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  previousPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  sizes: z.array(z.enum(["S", "M", "L"])),
  featured: z.boolean().optional(),
  images: z.array(z.string().min(1)).optional(),
  imageFocalPoints: z.record(z.string(), z.object({ x: z.number(), y: z.number() })).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre es muy corto").max(40, "El nombre es muy largo"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const storeSettingsSchema = z.object({
  shippingCost: z.number().min(0, "El costo de envío no puede ser negativo"),
  freeShippingThreshold: z.number().min(0, "El umbral no puede ser negativo"),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

export const applicationAreaSchema = z.enum([
  "MARKETING",
  "CATALOGO_FOTOS",
  "IMAGENES_IA",
  "FLETE_ENVIOS",
  "COLABORACIONES",
  "EVENTOS",
  "PACKAGING",
  "OTRO",
]);

export const jobApplicationSchema = z.object({
  name: z.string().min(3, "Ingresá tu nombre completo"),
  email: z.string().email("Ingresá un correo válido"),
  phone: z
    .string()
    .min(6, "Ingresá un teléfono válido")
    .max(20, "El teléfono no es válido")
    .regex(/^[0-9+\s-]+$/, "El teléfono solo puede tener números, espacios, + y -"),
  area: applicationAreaSchema,
  resumeUrl: z.string().url().optional(),
  message: z.string().min(10, "Contanos un poco más (mínimo 10 caracteres)"),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;

const phoneSchema = z
  .string()
  .min(6, "Ingresá un teléfono válido")
  .max(20, "El teléfono no es válido")
  .regex(/^[0-9+\s-]+$/, "El teléfono solo puede tener números, espacios, + y -");

export const customOrderSchema = z.object({
  ownerName: z.string().min(3, "Ingresá tu nombre completo"),
  ownerEmail: z.string().email("Ingresá un correo válido"),
  ownerPhone: phoneSchema,
  petName: z.string().min(1, "Ingresá el nombre de tu mascota"),
  petAge: z.string().min(1, "Ingresá la edad de tu mascota"),
  petBreed: z.string().min(1, "Ingresá la raza de tu mascota"),
  neckCm: z.number().min(5, "Medida muy chica").max(150, "Medida muy grande"),
  chestCm: z.number().min(5, "Medida muy chica").max(150, "Medida muy grande"),
  backLengthCm: z.number().min(5, "Medida muy chica").max(150, "Medida muy grande"),
  eventName: z.string().optional(),
  notes: z.string().optional(),
  fabricMediaUrls: z.array(z.string().url()).max(5).optional(),
  petMediaUrls: z.array(z.string().url()).max(5).optional(),
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;
