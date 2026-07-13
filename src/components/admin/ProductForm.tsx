"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Move, Plus, X } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ImagePositionPicker } from "@/components/admin/ImagePositionPicker";
import { useToast } from "@/components/providers/ToastProvider";
import type { CategoryDTO, FocalPoint, ProductDTO } from "@/types/catalog";

const VIDEO_EXTENSION = /\.(mp4|webm|mov)(\?.*)?$/i;

const SIZE_OPTIONS = ["S", "M", "L"] as const;

export function ProductForm({
  product,
  onDone,
}: {
  product?: ProductDTO | null;
  onDone?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { sizes: ["S", "M", "L"], stock: 10, featured: false, images: [] },
  });

  function loadCategories(selectId?: string) {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) {
          setCategories(data.categories);
          if (selectId) setValue("categoryId", selectId);
          else if (!isEditing && data.categories[0]) setValue("categoryId", data.categories[0].id);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [imagesText, setImagesText] = useState<string[]>([]);
  const [imageFocalPoints, setImageFocalPoints] = useState<Record<string, FocalPoint>>({});
  const [adjustingUrl, setAdjustingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        categoryId: product.category.id,
        price: product.price,
        previousPrice: product.previousPrice,
        stock: product.stock,
        sizes: product.sizes,
        featured: product.featured,
        images: product.images,
      });
      // Sincroniza el uploader (fuera de react-hook-form) con el producto
      // seleccionado para editar, igual que "reset" arriba.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImagesText(product.images);
      setImageFocalPoints(product.imageFocalPoints ?? {});
    } else {
      reset({ sizes: ["S", "M", "L"], stock: 10, featured: false, images: [] });
      setImagesText([]);
      setImageFocalPoints({});
    }
  }, [product, reset]);

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    setCategoryError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo crear la categoría.");
      loadCategories(json.category.id);
      setNewCategoryName("");
      setAddingCategory(false);
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
    }
  }

  async function onSubmit(data: ProductInput) {
    setServerError(null);
    setLoading(true);
    showToast(isEditing ? "Guardando cambios..." : "Subiendo producto...", "loading");
    try {
      const res = await fetch(
        isEditing ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, images: imagesText, imageFocalPoints }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar el producto.");
      showToast(isEditing ? "Producto editado" : "Producto subido", "success");
      reset({ sizes: ["S", "M", "L"], stock: 10, featured: false, images: [] });
      setImagesText([]);
      setImageFocalPoints({});
      onDone?.();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      showToast(message, "error", 3000);
      setServerError(message);
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
        <select {...register("categoryId")} className={inputClass}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}

        {addingCategory ? (
          <div className="mt-2 flex items-center gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ej. Juguetes"
              className="flex-1 rounded-lg border border-sage-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-english-600"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-lg bg-english-700 px-3 py-1.5 text-xs font-semibold text-linen hover:bg-english-800"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingCategory(false);
                setNewCategoryName("");
                setCategoryError(null);
              }}
              className="text-xs text-ink/50 hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingCategory(true)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-english-700 hover:text-english-800"
          >
            <Plus className="h-3 w-3" /> Nueva categoría
          </button>
        )}
        {categoryError && <p className="mt-1 text-xs text-red-500">{categoryError}</p>}
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
        <p className="mt-1 text-xs text-ink/40">
          Cargalo para mostrar el precio tachado y el % OFF — así se marca una oferta.
        </p>
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

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">
          Fotos / video del producto
        </label>
        <MediaUploader value={imagesText} onChange={setImagesText} />

        {imagesText.filter((url) => !VIDEO_EXTENSION.test(url)).length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-ink/40">
              Ajustá cómo se recorta cada foto en las tarjetas cuadradas del catálogo:
            </p>
            <div className="flex flex-wrap gap-3">
              {imagesText
                .filter((url) => !VIDEO_EXTENSION.test(url))
                .map((url) => {
                  const point = imageFocalPoints[url] ?? { x: 50, y: 50 };
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setAdjustingUrl(url)}
                      className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-sage-200"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: `${point.x}% ${point.y}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                        <Move className="h-4 w-4 text-white" />
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {adjustingUrl && (
        <ImagePositionPicker
          imageUrl={adjustingUrl}
          value={imageFocalPoints[adjustingUrl] ?? { x: 50, y: 50 }}
          onChange={(pos) => setImageFocalPoints((prev) => ({ ...prev, [adjustingUrl]: pos }))}
          onClose={() => setAdjustingUrl(null)}
        />
      )}

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
        className="rounded-full bg-english-700 py-3 text-sm font-semibold text-linen transition-all hover:-translate-y-0.5 hover:bg-english-800 hover:shadow-lg hover:shadow-english-800/30 disabled:opacity-50 md:col-span-2"
      >
        {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
