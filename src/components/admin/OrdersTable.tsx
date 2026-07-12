"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, ExternalLink, MessageCircle, PawPrint } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { AdminOrderRow } from "@/server/services/orders";

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

const STATUS_LABELS: Record<(typeof STATUS_OPTIONS)[number], string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<(typeof STATUS_OPTIONS)[number], string> = {
  PENDING: "bg-beige-200 text-english-800",
  PAID: "bg-sage-200 text-english-800",
  SHIPPED: "bg-english-700 text-linen",
  CANCELLED: "bg-red-100 text-red-600",
};

const LOCALITY_LABELS: Record<string, string> = {
  VILLA_MARIA: "Villa María",
  VILLA_NUEVA: "Villa Nueva",
  OTRA: "Otra",
};

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [rows, setRows] = useState(orders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | (typeof STATUS_OPTIONS)[number]>("ALL");
  const [localityFilter, setLocalityFilter] = useState<"ALL" | string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function updateStatus(id: string, status: (typeof STATUS_OPTIONS)[number]) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleWhatsapp(id: string, current: boolean) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, whatsappContacted: !current } : row))
    );
    await fetch(`/api/admin/orders/${id}/whatsapp`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsappContacted: !current }),
    });
  }

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((order) => {
      const matchesSearch =
        !term ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.dni.toLowerCase().includes(term) ||
        order.phone.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesLocality = localityFilter === "ALL" || order.locality === localityFilter;
      return matchesSearch && matchesStatus && matchesLocality;
    });
  }, [rows, search, statusFilter, localityFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo, DNI o teléfono..."
            className="w-full rounded-full border border-sage-300 bg-white py-2 pl-4 pr-4 text-sm outline-none focus:border-english-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-full border border-sage-300 bg-white px-3 py-2 text-sm outline-none focus:border-english-600"
        >
          <option value="ALL">Todos los estados</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>
        <select
          value={localityFilter}
          onChange={(e) => setLocalityFilter(e.target.value)}
          className="rounded-full border border-sage-300 bg-white px-3 py-2 text-sm outline-none focus:border-english-600"
        >
          <option value="ALL">Todas las localidades</option>
          {Object.entries(LOCALITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-3 py-3" />
              <th className="px-3 py-3">Cliente</th>
              <th className="px-3 py-3">Teléfono</th>
              <th className="px-3 py-3">Envío</th>
              <th className="px-3 py-3">Ítems</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Pago</th>
              <th className="px-3 py-3">WhatsApp</th>
              <th className="px-3 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((order) => {
              const isExpanded = expandedId === order.id;
              return (
                <Fragment key={order.id}>
                  <tr
                    className="cursor-pointer border-b border-sage-100 last:border-0 hover:bg-sage-50/50"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <td className="px-3 py-3 text-ink/40">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-ink">
                        {order.customerName}
                        <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-700">
                          {order.isGuest ? "Invitado" : "Registrado"}
                        </span>
                      </p>
                      <p className="text-xs text-ink/50">{order.customerEmail}</p>
                    </td>
                    <td className="px-3 py-3 text-ink/70">{order.phone}</td>
                    <td className="max-w-[200px] px-3 py-3 text-ink/70">
                      <p className="font-medium text-ink/80">
                        {order.locality ? LOCALITY_LABELS[order.locality] : "—"}
                      </p>
                      <p className="truncate text-xs text-ink/50" title={order.address}>
                        {order.address}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-ink/70">{order.itemCount}</td>
                    <td className="px-3 py-3 font-semibold text-english-800">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          order.isPaid ? "bg-sage-200 text-english-800" : "bg-beige-200 text-english-800"
                        )}
                      >
                        {order.isPaid ? "Pagado" : "Sin pagar"}
                      </span>
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWhatsapp(order.id, order.whatsappContacted)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                          order.whatsappContacted
                            ? "bg-sage-200 text-english-800"
                            : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                        )}
                      >
                        <MessageCircle className="h-3 w-3" />
                        {order.whatsappContacted ? "Contactado" : "Marcar contacto"}
                      </button>
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value as (typeof STATUS_OPTIONS)[number])}
                        className={cn(
                          "rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none",
                          STATUS_STYLES[order.status]
                        )}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {STATUS_LABELS[option]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-sage-100 bg-sage-50/40 last:border-0">
                      <td colSpan={9} className="px-6 py-5">
                        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-1 text-xs text-ink/60">
                          <span>
                            <strong className="text-ink/80">DNI:</strong> {order.dni}
                          </span>
                          <span>
                            <strong className="text-ink/80">Dirección completa:</strong> {order.address}
                          </span>
                          <span>
                            <strong className="text-ink/80">Envío:</strong>{" "}
                            {order.shippingCost === 0 ? "Gratis" : formatCurrency(order.shippingCost)}
                          </span>
                        </div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Productos del pedido — hacé clic en uno para verlo en grande
                        </p>
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              <Link
                                href={`/producto/${item.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-2xl border border-sage-200/70 bg-white p-3 transition-colors hover:border-english-600"
                              >
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sage-100">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.title}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <PawPrint className="h-7 w-7 text-sage-400/60" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="flex items-center gap-1 truncate text-sm font-medium text-ink group-hover:text-english-700">
                                    {item.title}
                                    <ExternalLink className="h-3 w-3 shrink-0 text-ink/30" />
                                  </p>
                                  <p className="text-xs text-ink/60">
                                    {item.size ? `Talla ${item.size} · ` : ""}
                                    Cant. {item.quantity} · {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink/50">
            {rows.length === 0
              ? "Aún no hay pedidos registrados."
              : "Ningún pedido coincide con la búsqueda/filtros."}
          </p>
        )}
      </div>
    </div>
  );
}
