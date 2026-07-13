"use client";

import { useRef, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductsList } from "@/components/admin/ProductsList";
import type { ProductDTO } from "@/types/catalog";

export function ProductsManager({ products }: { products: ProductDTO[] }) {
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function handleEdit(product: ProductDTO) {
    setEditingProduct(product);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-6">
      <div ref={formRef} className="scroll-mt-24">
        <ProductForm product={editingProduct} onDone={() => setEditingProduct(null)} />
      </div>
      <ProductsList products={products} onEdit={handleEdit} />
    </div>
  );
}
