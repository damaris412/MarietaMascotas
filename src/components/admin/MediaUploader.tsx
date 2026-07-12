"use client";

import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Film, Loader2, Upload, X } from "lucide-react";

const VIDEO_EXTENSION = /\.(mp4|webm|mov)(\?.*)?$/i;

export function MediaUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        uploaded.push(blob.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    onChange(value.filter((v) => v !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-sage-200 bg-sage-100"
          >
            {VIDEO_EXTENSION.test(url) ? (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-6 w-6 text-sage-500" />
              </div>
            ) : (
              <Image src={url} alt="" fill className="object-cover" />
            )}
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Quitar"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label
          className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sage-300 text-ink/50 transition-colors hover:border-english-500 hover:text-english-700"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="text-[10px] font-medium">{uploading ? "Subiendo..." : "Subir"}</span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-ink/40">
        Subí fotos o un video del producto desde tu computadora. La primera imagen es la que se
        usa como miniatura en el catálogo.
      </p>
    </div>
  );
}
