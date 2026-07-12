import { getCustomOrderRequests } from "@/server/services/customOrders";
import { CustomOrdersTable } from "@/components/admin/CustomOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminSastreriaPage() {
  const requests = await getCustomOrderRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Sastrería a medida</h1>
        <p className="text-sm text-ink/60">
          Pedidos de prendas a medida: medidas, referencias de tela y fotos/video de cada mascota.
        </p>
      </div>
      <CustomOrdersTable requests={requests} />
    </div>
  );
}
