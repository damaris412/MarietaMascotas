import { prisma } from "@/server/db/prisma";

export async function getAdminOrders(limit = 200) {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.user?.name ?? order.guestName ?? "Sin nombre",
    customerEmail: order.user?.email ?? order.guestEmail ?? "—",
    dni: order.guestDni ?? "—",
    address: order.guestAddress ?? "—",
    isGuest: !order.userId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    total: Number(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  }));
}

export type AdminOrderRow = Awaited<ReturnType<typeof getAdminOrders>>[number];
