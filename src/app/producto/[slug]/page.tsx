import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { getProductBySlug } from "@/server/services/products";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
