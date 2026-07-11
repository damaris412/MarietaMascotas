import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getProducts } from "@/server/services/products";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  categoria?: string;
  talla?: string;
  precioMax?: string;
}>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const products = await getProducts({
    category: params.categoria === "ROPA" || params.categoria === "CAMAS" ? params.categoria : undefined,
    size: params.talla === "S" || params.talla === "M" || params.talla === "L" ? params.talla : undefined,
    maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
  });

  return (
    <div>
      <FilterBar />
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <h1 className="mb-6 font-display text-2xl italic text-english-900">
          Catálogo Marieta Mascotas
        </h1>
        {products.length === 0 ? (
          <p className="rounded-2xl border border-sage-200 bg-white/60 p-10 text-center text-ink/60">
            No encontramos productos con esos filtros. Prueba a ajustar la búsqueda.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
