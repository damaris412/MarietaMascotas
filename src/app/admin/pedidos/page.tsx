import { getAdminOrders } from "@/server/services/orders";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Gestor de pedidos</h1>
        <p className="text-sm text-ink/60">
          Información de entrega de clientes registrados e invitados, y control del estado del envío.
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
