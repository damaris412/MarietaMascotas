"use client";

import { useState } from "react";
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

export function OrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [rows, setRows] = useState(orders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  return (
    <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
            <th className="px-5 py-3">Cliente</th>
            <th className="px-5 py-3">Correo</th>
            <th className="px-5 py-3">DNI</th>
            <th className="px-5 py-3">Dirección de envío</th>
            <th className="px-5 py-3">Ítems</th>
            <th className="px-5 py-3">Total</th>
            <th className="px-5 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id} className="border-b border-sage-100 last:border-0 hover:bg-sage-50/50">
              <td className="px-5 py-3 font-medium text-ink">
                {order.customerName}
                <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-700">
                  {order.isGuest ? "Invitado" : "Registrado"}
                </span>
              </td>
              <td className="px-5 py-3 text-ink/70">{order.customerEmail}</td>
              <td className="px-5 py-3 text-ink/70">{order.dni}</td>
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
      {rows.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-ink/50">Aún no hay pedidos registrados.</p>
      )}
    </div>
  );
}
