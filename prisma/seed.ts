import { PrismaClient, type Size } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  // --- Ropa (aún sin fotografía real: se muestran con marcador ilustrado) ---
  {
    title: "Abrigo Acolchado Eucalipto",
    slug: "abrigo-acolchado-eucalipto",
    description:
      "Abrigo acolchado impermeable en tono sage, forrado en polar suave. Ideal para paseos de invierno.",
    category: "ROPA" as const,
    price: 89000,
    previousPrice: 112000,
    images: [] as string[],
    sizes: ["S", "M", "L"] as Size[],
    stock: 18,
    rating: 4.7,
    reviewCount: 32,
    featured: true,
  },
  {
    title: "Suéter Trenzado Beige",
    slug: "sueter-trenzado-beige",
    description: "Suéter de punto grueso trenzado, cálido y liviano, con acabado premium.",
    category: "ROPA" as const,
    price: 64000,
    previousPrice: null,
    images: [] as string[],
    sizes: ["S", "M"] as Size[],
    stock: 24,
    rating: 4.5,
    reviewCount: 21,
    featured: false,
  },
  {
    title: "Impermeable Verde Inglés",
    slug: "impermeable-verde-ingles",
    description: "Impermeable resistente al agua con capucha ajustable y costuras selladas.",
    category: "ROPA" as const,
    price: 98000,
    previousPrice: 130000,
    images: [] as string[],
    sizes: ["M", "L"] as Size[],
    stock: 12,
    rating: 4.8,
    reviewCount: 45,
    featured: false,
  },
  {
    title: "Chaleco Reflectante Nocturno",
    slug: "chaleco-reflectante-nocturno",
    description: "Chaleco ligero con bandas reflectantes para paseos seguros al atardecer.",
    category: "ROPA" as const,
    price: 52000,
    previousPrice: null,
    images: [] as string[],
    sizes: ["S", "M", "L"] as Size[],
    stock: 30,
    rating: 4.3,
    reviewCount: 14,
    featured: false,
  },

  // --- Camas (fotografía real de catálogo) ---
  {
    title: "Petit Bijou Baby 30cm",
    slug: "petit-bijou-baby-30cm",
    description:
      "Cama redonda de rayas terracota, del tamaño justo para gatitos y cachorros recién llegados a casa. Relleno mullido y borde envolvente que da sensación de arrullo.",
    category: "CAMAS" as const,
    price: 79000,
    previousPrice: null,
    images: ["/images/productos/petit-bijou-baby-30cm.png"],
    sizes: [] as Size[],
    stock: 16,
    rating: 4.6,
    reviewCount: 12,
    featured: false,
  },
  {
    title: "Blue Velvet Mini 35cm",
    slug: "blue-velvet-mini-35cm",
    description:
      "Cama redonda en tono azul marino con textura afelpada, pensada para razas pequeñas. Paredes acolchadas que sirven de reposacabezas.",
    category: "CAMAS" as const,
    price: 89000,
    previousPrice: 105000,
    images: [
      "/images/productos/blue-velvet-mini-35cm-1.png",
      "/images/productos/blue-velvet-mini-35cm-2.png",
    ],
    sizes: [] as Size[],
    stock: 14,
    rating: 4.8,
    reviewCount: 27,
    featured: true,
  },
  {
    title: "Denim Royal 35cm",
    slug: "denim-royal-35cm",
    description:
      "Cama redonda con estampado camuflado en azules y panel de malla transpirable en los laterales. Ideal para gatos y perros pequeños.",
    category: "CAMAS" as const,
    price: 89000,
    previousPrice: null,
    images: ["/images/productos/denim-royal-35cm.png"],
    sizes: [] as Size[],
    stock: 18,
    rating: 4.5,
    reviewCount: 19,
    featured: false,
  },
  {
    title: "Mini Militar 35x25cm Bebés",
    slug: "mini-militar-35x25-bebes",
    description:
      "Cama rectangular compacta en camuflado oscuro con cojín interior en gris carbón, perfecta para gatitos o cachorros pequeños que recién empiezan a explorar.",
    category: "CAMAS" as const,
    price: 75000,
    previousPrice: null,
    images: ["/images/productos/mini-militar-35x25-bebes.png"],
    sizes: [] as Size[],
    stock: 20,
    rating: 4.4,
    reviewCount: 9,
    featured: false,
  },
  {
    title: "Camo Digital Pocket 35x37cm",
    slug: "camo-digital-pocket-35x37cm",
    description:
      "Cama rectangular con exterior en camuflado digital y acolchado interior beige. Base resistente que conserva su forma con el uso diario.",
    category: "CAMAS" as const,
    price: 92000,
    previousPrice: null,
    images: ["/images/productos/camo-digital-pocket-35x37.png"],
    sizes: [] as Size[],
    stock: 13,
    rating: 4.6,
    reviewCount: 15,
    featured: false,
  },
  {
    title: "Elephant Hello Mini 30x40cm",
    slug: "elephant-hello-mini-30x40cm",
    description:
      "Cama rectangular con estampado juguetón de elefantes, leones y trenes sobre fondo crudo, cojín ultra suave de pelo corto en gris. Pensada para cachorros.",
    category: "CAMAS" as const,
    price: 85000,
    previousPrice: 99000,
    images: ["/images/productos/elephant-hello-mini-30x40.png"],
    sizes: [] as Size[],
    stock: 17,
    rating: 4.7,
    reviewCount: 22,
    featured: true,
  },
  {
    title: "Lavander Mist 40cm",
    slug: "lavander-mist-40cm",
    description:
      "Cama redonda de rayas en tono lavanda, con relleno alto en el borde para mayor sensación de refugio. Un clásico suave para gatos y perros medianos.",
    category: "CAMAS" as const,
    price: 99000,
    previousPrice: null,
    images: ["/images/productos/lavander-mist-40cm.png"],
    sizes: [] as Size[],
    stock: 15,
    rating: 4.5,
    reviewCount: 18,
    featured: false,
  },
  {
    title: "Combat Chic Mediana 47cm",
    slug: "combat-chic-mediana-47cm",
    description:
      "Cama redonda con exterior verde oliva y cojín camuflado, con espacio suficiente para razas medianas como golden retriever o labrador.",
    category: "CAMAS" as const,
    price: 145000,
    previousPrice: null,
    images: ["/images/productos/combat-chic-mediana-47cm.png"],
    sizes: [] as Size[],
    stock: 10,
    rating: 4.7,
    reviewCount: 24,
    featured: false,
  },
  {
    title: "Savannah Glam 50cm",
    slug: "savannah-glam-50cm",
    description:
      "Cama redonda de estampado animal print con borde en negro, un statement premium para el rincón de descanso de razas medianas y grandes.",
    category: "CAMAS" as const,
    price: 155000,
    previousPrice: 179000,
    images: ["/images/productos/savannah-glam-50cm.png"],
    sizes: [] as Size[],
    stock: 8,
    rating: 4.9,
    reviewCount: 31,
    featured: true,
  },
  {
    title: "Commander Square 50x50cm",
    slug: "commander-square-50x50cm",
    description:
      "Cama cuadrada camuflada con banda inferior en verde oliva liso e interior negro. Estructura firme con buen soporte para razas medianas y grandes.",
    category: "CAMAS" as const,
    price: 178000,
    previousPrice: null,
    images: [
      "/images/productos/commander-square-50x50-1.png",
      "/images/productos/commander-square-50x50-2.png",
    ],
    sizes: [] as Size[],
    stock: 11,
    rating: 4.8,
    reviewCount: 28,
    featured: true,
  },
  {
    title: "Navy Mansion XL 55x50cm",
    slug: "navy-mansion-xl-55x50cm",
    description:
      "Cama rectangular XL en azul marino con borde de rayas verde oliva y crudo. Suficientemente amplia para razas grandes o para que dos mascotas pequeñas duerman juntas.",
    category: "CAMAS" as const,
    price: 219000,
    previousPrice: 249000,
    images: ["/images/productos/navy-mansion-xl-55x50.png"],
    sizes: [] as Size[],
    stock: 7,
    rating: 4.9,
    reviewCount: 20,
    featured: false,
  },
];

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: { ...product },
    });
  }
  console.log(`Seed completado: ${PRODUCTS.length} productos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
