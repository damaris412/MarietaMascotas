"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((order) => {
      const matchesSearch =
        !term ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.dni.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesLocality = localityFilter === "ALL" || order.locality === localityFilter;
      return matchesSearch && matchesStatus && matchesLocality;
    });
  }, [rows, search, statusFilter, localityFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o DNI..."
            className="w-full rounded-full border border-sage-300 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-english-600"
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
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">DNI</th>
              <th className="px-5 py-3">Localidad</th>
              <th className="px-5 py-3">Dirección de envío</th>
              <th className="px-5 py-3">Ítems</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((order) => (
              <tr key={order.id} className="border-b border-sage-100 last:border-0 hover:bg-sage-50/50">
                <td className="px-5 py-3 font-medium text-ink">
                  {order.customerName}
                  <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-700">
                    {order.isGuest ? "Invitado" : "Registrado"}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink/70">{order.customerEmail}</td>
                <td className="px-5 py-3 text-ink/70">{order.dni}</td>
                <td className="px-5 py-3 text-ink/70">
                  {order.locality ? LOCALITY_LABELS[order.locality] : "—"}
                </td>
                <td className="max-w-[220px] truncate px-5 py-3 text-ink/70" title={order.address}>
                  {order.address}
                </td>
                <td className="px-5 py-3 text-ink/70">{order.itemCount}</td>
                <td className="px-5 py-3 font-semibold text-english-800">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-5 py-3">
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
            ))}
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
