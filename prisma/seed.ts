import { PrismaClient, type Size } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    title: "Abrigo Acolchado Eucalipto",
    slug: "abrigo-acolchado-eucalipto",
    description:
      "Abrigo acolchado impermeable en tono sage, forrado en polar suave. Ideal para paseos de invierno.",
    category: "ROPA" as const,
    price: 89000,
    previousPrice: 112000,
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
    sizes: ["S", "M"] as Size[],
    stock: 24,
    rating: 4.5,
    reviewCount: 21,
    featured: true,
  },
  {
    title: "Impermeable Verde Inglés",
    slug: "impermeable-verde-ingles",
    description: "Impermeable resistente al agua con capucha ajustable y costuras selladas.",
    category: "ROPA" as const,
    price: 98000,
    previousPrice: 130000,
    sizes: ["M", "L"] as Size[],
    stock: 12,
    rating: 4.8,
    reviewCount: 45,
    featured: true,
  },
  {
    title: "Chaleco Reflectante Nocturno",
    slug: "chaleco-reflectante-nocturno",
    description: "Chaleco ligero con bandas reflectantes para paseos seguros al atardecer.",
    category: "ROPA" as const,
    price: 52000,
    previousPrice: null,
    sizes: ["S", "M", "L"] as Size[],
    stock: 30,
    rating: 4.3,
    reviewCount: 14,
    featured: false,
  },
  {
    title: "Cama Ortopédica Memory Foam XL",
    slug: "cama-ortopedica-memory-foam-xl",
    description:
      "Cama ortopédica con espuma viscoelástica de alta densidad, funda desmontable y lavable.",
    category: "CAMAS" as const,
    price: 245000,
    previousPrice: 289000,
    sizes: [] as Size[],
    stock: 9,
    rating: 4.9,
    reviewCount: 58,
    featured: true,
  },
  {
    title: "Cama Nido Beige Cálido",
    slug: "cama-nido-beige-calido",
    description: "Cama tipo nido con bordes elevados que brindan seguridad y calidez.",
    category: "CAMAS" as const,
    price: 168000,
    previousPrice: null,
    sizes: [] as Size[],
    stock: 15,
    rating: 4.6,
    reviewCount: 27,
    featured: true,
  },
  {
    title: "Cama Refrescante Verano",
    slug: "cama-refrescante-verano",
    description: "Cama con tejido de gel refrescante, perfecta para climas cálidos.",
    category: "CAMAS" as const,
    price: 132000,
    previousPrice: 155000,
    sizes: [] as Size[],
    stock: 20,
    rating: 4.4,
    reviewCount: 19,
    featured: false,
  },
  {
    title: "Colchón Viajero Plegable",
    slug: "colchon-viajero-plegable",
    description: "Colchón plegable y portátil, ideal para viajes y visitas familiares.",
    category: "CAMAS" as const,
    price: 96000,
    previousPrice: null,
    sizes: [] as Size[],
    stock: 22,
    rating: 4.2,
    reviewCount: 11,
    featured: false,
  },
];

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, images: [] },
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
