"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ProductDTO } from "@/types/catalog";

export function ProductsList({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
            <th className="px-5 py-3">Producto</th>
            <th className="px-5 py-3">Categoría</th>
            <th className="px-5 py-3">Precio</th>
            <th className="px-5 py-3">Stock</th>
            <th className="px-5 py-3">Tallas</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-sage-100 last:border-0 hover:bg-sage-50/50">
              <td className="px-5 py-3 font-medium text-ink">{product.title}</td>
              <td className="px-5 py-3 text-ink/70">
                {product.category === "ROPA" ? "Ropa" : "Camas"}
              </td>
              <td className="px-5 py-3 text-english-800">{formatCurrency(product.price)}</td>
              <td className="px-5 py-3 text-ink/70">{product.stock}</td>
              <td className="px-5 py-3 text-ink/70">{product.sizes.join(", ") || "—"}</td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="text-ink/40 hover:text-red-500"
                  aria-label="Desactivar producto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-ink/50">Aún no hay productos creados.</p>
      )}
    </div>
  );
}
