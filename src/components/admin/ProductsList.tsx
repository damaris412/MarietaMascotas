"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, PawPrint, RotateCcw, XCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import type { ProductDTO } from "@/types/catalog";

type StockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function ProductsList({
  products,
  onEdit,
}: {
  products: ProductDTO[];
  onEdit: (product: ProductDTO) => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  async function setActive(id: string, active: boolean) {
    if (!active) {
      const confirmed = window.confirm(
        "Esto oculta el producto del catálogo y bloquea nuevas compras. ¿Confirmás que querés desactivarlo?"
      );
      if (!confirmed) return;
    }
    setPendingId(id);
    showToast(active ? "Reactivando producto..." : "Desactivando producto...", "loading");
    try {
      await fetch(`/api/admin/products/${id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      showToast(active ? "Producto reactivado" : "Producto desactivado", "success");
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Esto borra el producto de forma DEFINITIVA de la base de datos, no se puede deshacer. ¿Confirmás?"
    );
    if (!confirmed) return;
    setPendingId(id);
    showToast("Eliminando producto...", "loading");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        showToast(json?.error ?? "No se pudo eliminar el producto.", "error", 3000);
        return;
      }
      showToast("Producto eliminado definitivamente", "success");
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !term || product.title.toLowerCase().includes(term);
      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && product.stock > 0) ||
        (stockFilter === "OUT_OF_STOCK" && product.stock === 0);
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && product.active) ||
        (statusFilter === "INACTIVE" && !product.active);
      return matchesSearch && matchesStock && matchesStatus;
    });
  }, [products, search, stockFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="min-w-[220px] flex-1 rounded-full border border-sage-300 bg-white px-4 py-2 text-sm outline-none focus:border-english-600"
        />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          className="rounded-full border border-sage-300 bg-white px-3 py-2 text-sm outline-none focus:border-english-600"
        >
          <option value="ALL">Todo el stock</option>
          <option value="IN_STOCK">Con stock</option>
          <option value="OUT_OF_STOCK">Sin stock</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-full border border-sage-300 bg-white px-3 py-2 text-sm outline-none focus:border-english-600"
        >
          <option value="ALL">Activos e inactivos</option>
          <option value="ACTIVE">Solo activos</option>
          <option value="INACTIVE">Solo inactivos</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3" />
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3">Precio</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className={cn(
                  "border-b border-sage-100 last:border-0 hover:bg-sage-50/50",
                  !product.active && "opacity-60"
                )}
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/producto/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sage-100 transition-opacity hover:opacity-80"
                    title="Ver publicación en grande"
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        style={
                          product.imageFocalPoints?.[product.images[0]]
                            ? {
                                objectPosition: `${product.imageFocalPoints[product.images[0]].x}% ${product.imageFocalPoints[product.images[0]].y}%`,
                              }
                            : undefined
                        }
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PawPrint className="h-6 w-6 text-sage-400/60" />
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-5 py-3 font-medium text-ink">{product.title}</td>
                <td className="px-5 py-3 text-ink/70">
                  {product.category.name}
                </td>
                <td className="px-5 py-3 text-english-800">{formatCurrency(product.price)}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : product.stock <= 3
                          ? "bg-beige-200 text-english-800"
                          : "bg-sage-100 text-english-800"
                    )}
                  >
                    {product.stock === 0 ? "Sin stock" : product.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      product.active ? "bg-sage-100 text-english-800" : "bg-red-100 text-red-600"
                    )}
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-ink/40 hover:text-english-700"
                      aria-label="Editar producto"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {product.active ? (
                      <button
                        onClick={() => setActive(product.id, false)}
                        disabled={pendingId === product.id}
                        className="text-ink/40 hover:text-red-500"
                        aria-label="Desactivar producto"
                        title="Desactivar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setActive(product.id, true)}
                          disabled={pendingId === product.id}
                          className="flex items-center gap-1 text-xs font-semibold text-english-700 hover:text-english-800"
                          aria-label="Reactivar producto"
                          title="Reactivar producto"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reactivar
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={pendingId === product.id}
                          className="text-ink/40 hover:text-red-600"
                          aria-label="Eliminar producto definitivamente"
                          title="Eliminar producto definitivamente"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink/50">
            {products.length === 0
              ? "Aún no hay productos creados."
              : "Ningún producto coincide con la búsqueda/filtro."}
          </p>
        )}
      </div>
    </div>
  );
}
