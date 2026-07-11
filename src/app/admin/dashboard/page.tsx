import { DollarSign, PackageCheck, ShoppingBag, Clock3 } from "lucide-react";
import { getDashboardSummary } from "@/server/services/analytics";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { TopProductsChart } from "@/components/admin/charts/TopProductsChart";
import { SizeDonutChart } from "@/components/admin/charts/SizeDonutChart";
import { PeakDaysChart, PeakHoursChart } from "@/components/admin/charts/PeakTimesChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { monthly, topProducts, sizeDemand, peakTimes, totalOrders, pendingOrders, totalRevenue } =
    await getDashboardSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Analíticas de ventas</h1>
        <p className="text-sm text-ink/60">Panorama en tiempo real del rendimiento de la tienda.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ingresos (12 meses)"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={monthly.growth}
        />
        <StatCard label="Pedidos pagados" value={String(totalOrders)} icon={PackageCheck} />
        <StatCard label="Pedidos pendientes" value={String(pendingOrders)} icon={Clock3} />
        <StatCard
          label="Producto más vendido"
          value={topProducts[0]?.title ?? "—"}
          icon={ShoppingBag}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-6 lg:col-span-2">
          <h2 className="mb-1 font-display text-lg italic text-english-800">
            Ingresos y ventas mensuales
          </h2>
          <p className="mb-4 text-xs text-ink/50">Histórico de los últimos 12 meses</p>
          <RevenueChart data={monthly.buckets} />
        </div>

        <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-6">
          <h2 className="mb-1 font-display text-lg italic text-english-800">
            Tallas con mayor demanda
          </h2>
          <p className="mb-4 text-xs text-ink/50">Unidades vendidas por talla</p>
          {sizeDemand.length > 0 ? (
            <SizeDonutChart data={sizeDemand} />
          ) : (
            <p className="py-16 text-center text-sm text-ink/50">Aún no hay ventas registradas.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-6">
          <h2 className="mb-1 font-display text-lg italic text-english-800">Productos estrella</h2>
          <p className="mb-4 text-xs text-ink/50">Unidades vendidas, ropa y camas</p>
          {topProducts.length > 0 ? (
            <>
              <TopProductsChart data={topProducts} />
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
                    <th className="py-2">#</th>
                    <th className="py-2">Producto</th>
                    <th className="py-2 text-right">Unidades</th>
                    <th className="py-2 text-right">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.title} className="border-b border-sage-100 last:border-0">
                      <td className="py-2 text-ink/50">{index + 1}</td>
                      <td className="py-2 font-medium text-ink">{product.title}</td>
                      <td className="py-2 text-right">{product.quantity}</td>
                      <td className="py-2 text-right text-english-800">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="py-16 text-center text-sm text-ink/50">Aún no hay ventas registradas.</p>
          )}
        </div>

        <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-6">
          <h2 className="mb-1 font-display text-lg italic text-english-800">
            Días y horas pico de compra
          </h2>
          <p className="mb-4 text-xs text-ink/50">
            Volumen de pagos completados por día de la semana y franja horaria
          </p>
          <PeakDaysChart data={peakTimes.dayTotals} />
          <div className="mt-4">
            <PeakHoursChart data={peakTimes.hourTotals} />
          </div>
        </div>
      </div>
    </div>
  );
}
