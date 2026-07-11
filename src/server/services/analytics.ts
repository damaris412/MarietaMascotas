import { prisma } from "@/server/db/prisma";

const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

async function getPaidOrdersWithItems() {
  return prisma.order.findMany({
    where: { status: "PAID" },
    include: { items: true },
    orderBy: { paidAt: "asc" },
  });
}

export async function getMonthlyRevenue(monthsBack = 12) {
  const orders = await getPaidOrdersWithItems();
  const now = new Date();
  const buckets: { key: string; label: string; total: number }[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`,
      total: 0,
    });
  }

  for (const order of orders) {
    const paidAt = order.paidAt ?? order.createdAt;
    const key = `${paidAt.getFullYear()}-${paidAt.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.total += Number(order.total);
  }

  const growth =
    buckets.length >= 2 && buckets[buckets.length - 2].total > 0
      ? ((buckets[buckets.length - 1].total - buckets[buckets.length - 2].total) /
          buckets[buckets.length - 2].total) *
        100
      : 0;

  return { buckets, growth };
}

export async function getTopProducts(limit = 8) {
  const orders = await getPaidOrdersWithItems();
  const totals = new Map<string, { title: string; quantity: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const entry = totals.get(item.productId) ?? {
        title: item.title,
        quantity: 0,
        revenue: 0,
      };
      entry.quantity += item.quantity;
      entry.revenue += Number(item.price) * item.quantity;
      totals.set(item.productId, entry);
    }
  }

  return Array.from(totals.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export async function getSizeDemand() {
  const orders = await getPaidOrdersWithItems();
  const totals: Record<string, number> = { S: 0, M: 0, L: 0 };

  for (const order of orders) {
    for (const item of order.items) {
      if (item.size) totals[item.size] = (totals[item.size] ?? 0) + item.quantity;
    }
  }

  return Object.entries(totals)
    .map(([size, value]) => ({ size, value }))
    .filter((entry) => entry.value > 0);
}

export async function getPeakTimes() {
  const orders = await getPaidOrdersWithItems();
  const dayTotals = DAY_LABELS.map((label) => ({ day: label, count: 0 }));
  const hourTotals = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));

  for (const order of orders) {
    const paidAt = order.paidAt ?? order.createdAt;
    dayTotals[paidAt.getDay()].count += 1;
    hourTotals[paidAt.getHours()].count += 1;
  }

  return { dayTotals, hourTotals };
}

export async function getDashboardSummary() {
  const [monthly, topProducts, sizeDemand, peakTimes, totalOrders, pendingOrders] =
    await Promise.all([
      getMonthlyRevenue(),
      getTopProducts(),
      getSizeDemand(),
      getPeakTimes(),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

  const totalRevenue = monthly.buckets.reduce((sum, b) => sum + b.total, 0);

  return {
    monthly,
    topProducts,
    sizeDemand,
    peakTimes,
    totalOrders,
    pendingOrders,
    totalRevenue,
  };
}
