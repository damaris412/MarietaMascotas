import { prisma } from "@/server/db/prisma";
import type { ProductDTO } from "@/types/catalog";
import type { Prisma } from "@prisma/client";

export type CatalogFilters = {
  category?: "ROPA" | "CAMAS";
  size?: "S" | "M" | "L";
  minPrice?: number;
  maxPrice?: number;
};

function toDTO(product: {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: Prisma.Decimal;
  previousPrice: Prisma.Decimal | null;
  images: string[];
  stock: number;
  sizes: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
}): ProductDTO {
  return {
    ...product,
    category: product.category as ProductDTO["category"],
    sizes: product.sizes as ProductDTO["sizes"],
    price: Number(product.price),
    previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
  };
}

export async function getProducts(filters: CatalogFilters = {}): Promise<ProductDTO[]> {
  const where: Prisma.ProductWhereInput = { active: true };
  if (filters.category) where.category = filters.category;
  if (filters.size) where.sizes = { has: filters.size };
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      gte: filters.minPrice ?? undefined,
      lte: filters.maxPrice ?? undefined,
    };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return products.map(toDTO);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? toDTO(product) : null;
}

export async function getProductsByIds(ids: string[]) {
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  return products.map(toDTO);
}
