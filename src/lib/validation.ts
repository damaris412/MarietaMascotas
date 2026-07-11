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
  category: z.enum(["ROPA", "CAMAS"]),
  price: z.number().positive("El precio debe ser mayor a 0"),
  previousPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  sizes: z.array(z.enum(["S", "M", "L"])),
  featured: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
