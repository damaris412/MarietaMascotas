"use client";

import { useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductsList } from "@/components/admin/ProductsList";
import type { ProductDTO } from "@/types/catalog";

export function ProductsManager({ products }: { products: ProductDTO[] }) {
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

  return (
    <div className="space-y-6">
      <ProductForm product={editingProduct} onDone={() => setEditingProduct(null)} />
      <ProductsList products={products} onEdit={setEditingProduct} />
    </div>
  );
}
