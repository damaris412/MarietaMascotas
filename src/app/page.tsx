import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getFeaturedProducts } from "@/server/services/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await getFeaturedProducts(8);

  return (
    <>
      <Hero featuredImage={featured[0]?.images[0] ?? null} />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl italic text-english-900 sm:text-3xl">
            Destacados de la temporada
          </h2>
          <Link href="/catalogo" className="text-sm font-medium text-english-700 hover:underline">
            Ver todo →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-2xl border border-sage-200 bg-white/60 p-10 text-center text-ink/60">
            Muy pronto verás aquí nuestros productos destacados.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
