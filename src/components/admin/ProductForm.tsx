"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { ProductDTO } from "@/types/catalog";

const SIZE_OPTIONS = ["S", "M", "L"] as const;

export function ProductForm({
  product,
  onDone,
}: {
  product?: ProductDTO | null;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { category: "ROPA", sizes: ["S", "M", "L"], stock: 10, featured: false },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        previousPrice: product.previousPrice,
        stock: product.stock,
        sizes: product.sizes,
        featured: product.featured,
      });
    } else {
      reset({ category: "ROPA", sizes: ["S", "M", "L"], stock: 10, featured: false });
    }
  }, [product, reset]);

  async function onSubmit(data: ProductInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch(
        isEditing ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar el producto.");
      reset({ category: "ROPA", sizes: ["S", "M", "L"], stock: 10, featured: false });
      onDone?.();
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-sage-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-english-600";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-3xl border border-sage-200/70 bg-white/80 p-6 md:grid-cols-2">
      <div className="flex items-center justify-between md:col-span-2">
        <h2 className="font-display text-lg italic text-english-800">
          {isEditing ? `Editando: ${product.title}` : "Crear producto"}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onDone}
            className="flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" /> Cancelar edición
          </button>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Título</label>
        <input {...register("title")} className={inputClass} placeholder="Abrigo acolchado Eucalipto" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Descripción</label>
        <textarea {...register("description")} rows={3} className={inputClass} />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Categoría</label>
        <select {...register("category")} className={inputClass}>
          <option value="ROPA">Ropa</option>
          <option value="CAMAS">Camas</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Stock</label>
        <input type="number" {...register("stock", { valueAsNumber: true })} className={inputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Precio</label>
        <input type="number" {...register("price", { valueAsNumber: true })} className={inputClass} />
        {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Precio anterior (opcional)
        </label>
        <input
          type="number"
          {...register("previousPrice", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Tallas disponibles
        </label>
        <Controller
          control={control}
          name="sizes"
          render={({ field }) => (
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    field.onChange(
                      field.value.includes(size)
                        ? field.value.filter((s) => s !== size)
                        : [...field.value, size]
                    )
                  }
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                    field.value.includes(size)
                      ? "border-english-700 bg-english-700 text-linen"
                      : "border-sage-300 text-ink/70"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70 md:col-span-2">
        <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-english-700" />
        Mostrar en destacados de la portada
      </label>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 md:col-span-2">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-english-700 py-3 text-sm font-semibold text-linen hover:bg-english-800 disabled:opacity-50 md:col-span-2"
      >
        {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
