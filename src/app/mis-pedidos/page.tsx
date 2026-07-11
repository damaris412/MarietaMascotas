import { redirect } from "next/navigation";
import { auth } from "@/server/auth/auth";
import { getUserOrders } from "@/server/services/orders";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-beige-200 text-english-800",
  PAID: "bg-sage-200 text-english-800",
  SHIPPED: "bg-english-700 text-linen",
  CANCELLED: "bg-red-100 text-red-600",
};

export default async function MisPedidosPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/perfil/completar?callbackUrl=/mis-pedidos");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
      <h1 className="font-display text-2xl italic text-english-900">Mis pedidos</h1>
      <p className="mt-2 text-sm text-ink/60">Historial de compras asociado a tu cuenta.</p>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-sage-200 bg-white/60 p-10 text-center text-ink/60">
          Todavía no hiciste ningún pedido.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-3xl border border-sage-200/70 bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink/50">
                  {new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(order.createdAt)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-ink/70">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.title}
                    {item.size ? ` · Talla ${item.size}` : ""} × {item.quantity}
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t border-sage-100 pt-3 text-right text-sm font-semibold text-english-800">
                Total: {formatCurrency(order.total)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
