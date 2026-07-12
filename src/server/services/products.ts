import { prisma } from "@/server/db/prisma";
import type { ProductDTO } from "@/types/catalog";
import type { Prisma } from "@prisma/client";

export type CatalogFilters = {
  categorySlug?: string;
  size?: "S" | "M" | "L";
  minPrice?: number;
  maxPrice?: number;
};

function toDTO(product: {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: { id: string; name: string; slug: string };
  price: Prisma.Decimal;
  previousPrice: Prisma.Decimal | null;
  images: string[];
  stock: number;
  sizes: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
}): ProductDTO {
  return {
    ...product,
    sizes: product.sizes as ProductDTO["sizes"],
    price: Number(product.price),
    previousPrice: product.previousPrice ? Number(product.previousPrice) : null,
  };
}

const withCategory = { category: { select: { id: true, name: true, slug: true } } };

export async function getProducts(filters: CatalogFilters = {}): Promise<ProductDTO[]> {
  const where: Prisma.ProductWhereInput = { active: true };
  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.size) where.sizes = { has: filters.size };
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      gte: filters.minPrice ?? undefined,
      lte: filters.maxPrice ?? undefined,
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: withCategory,
    orderBy: { createdAt: "desc" },
  });

  return products.map(toDTO);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: withCategory,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toDTO);
}

export async function getAllProductsForAdmin(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    include: withCategory,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include: withCategory });
  return product ? toDTO(product) : null;
}

export async function getProductsByIds(ids: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: withCategory,
  });
  return products.map(toDTO);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
