"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, Film, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomOrderRequestRow } from "@/server/services/customOrders";

const VIDEO_EXTENSION = /\.(mp4|webm|mov)(\?.*)?$/i;

function MediaThumb({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-sage-200 bg-sage-100"
    >
      {VIDEO_EXTENSION.test(url) ? (
        <div className="flex h-full w-full items-center justify-center">
          <Film className="h-5 w-5 text-sage-500" />
        </div>
      ) : (
        <Image src={url} alt="" fill className="object-cover" />
      )}
    </a>
  );
}

export function CustomOrdersTable({ requests }: { requests: CustomOrderRequestRow[] }) {
  const [rows, setRows] = useState(requests);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function toggleContacted(id: string, current: boolean) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, contacted: !current } : row)));
    await fetch(`/api/admin/sastreria/${id}/contacted`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted: !current }),
    });
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
            <th className="px-3 py-3" />
            <th className="px-3 py-3">Mascota</th>
            <th className="px-3 py-3">Dueño</th>
            <th className="px-3 py-3">Medidas (cm)</th>
            <th className="px-3 py-3">Fecha</th>
            <th className="px-3 py-3">Contacto</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((request) => {
            const isExpanded = expandedId === request.id;
            return (
              <Fragment key={request.id}>
                <tr
                  className="cursor-pointer border-b border-sage-100 last:border-0 hover:bg-sage-50/50"
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                >
                  <td className="px-3 py-3 text-ink/40">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{request.petName}</p>
                    <p className="text-xs text-ink/50">
                      {request.petBreed} · {request.petAge}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{request.ownerName}</p>
                    <p className="text-xs text-ink/50">{request.ownerPhone}</p>
                  </td>
                  <td className="px-3 py-3 text-ink/70">
                    cuello {request.neckCm} · tórax {request.chestCm} · lomo {request.backLengthCm}
                  </td>
                  <td className="px-3 py-3 text-ink/60">
                    {new Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(request.createdAt)}
                  </td>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleContacted(request.id, request.contacted)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                        request.contacted
                          ? "bg-sage-200 text-english-800"
                          : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                      )}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {request.contacted ? "Contactado" : "Marcar contacto"}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="border-b border-sage-100 bg-sage-50/40 last:border-0">
                    <td colSpan={6} className="px-6 py-5">
                      <div className="mb-4 flex flex-wrap gap-x-8 gap-y-1 text-xs text-ink/60">
                        <span>
                          <strong className="text-ink/80">Correo:</strong> {request.ownerEmail}
                        </span>
                        {request.eventName && (
                          <span>
                            <strong className="text-ink/80">Evento:</strong> {request.eventName}
                          </span>
                        )}
                      </div>
                      {request.notes && (
                        <p className="mb-4 rounded-xl bg-white p-3 text-xs text-ink/70">
                          <strong className="text-ink/80">Comentarios:</strong> {request.notes}
                        </p>
                      )}
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
                            Referencias de tela
                          </p>
                          {request.fabricMediaUrls.length === 0 ? (
                            <p className="text-xs text-ink/40">—</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {request.fabricMediaUrls.map((url) => (
                                <MediaThumb key={url} url={url} />
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
                            Fotos/video de la mascota
                          </p>
                          {request.petMediaUrls.length === 0 ? (
                            <p className="text-xs text-ink/40">—</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {request.petMediaUrls.map((url) => (
                                <MediaThumb key={url} url={url} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-ink/50">
          Aún no hay pedidos de sastrería a medida.
        </p>
      )}
    </div>
  );
}
