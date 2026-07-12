import { getAllProductsForAdmin } from "@/server/services/products";
import { ProductsManager } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Productos</h1>
        <p className="text-sm text-ink/60">Gestiona el catálogo de ropa y camas de la tienda.</p>
      </div>
      <ProductsManager products={products} />
    </div>
  );
}
