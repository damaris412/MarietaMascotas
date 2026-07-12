import { prisma } from "@/server/db/prisma";

export async function getAdminOrders(limit = 200) {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true, address: true } },
      items: { include: { product: { select: { images: true, slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.user?.name ?? order.guestName ?? "Sin nombre",
    customerEmail: order.user?.email ?? order.guestEmail ?? "—",
    phone: order.user?.phone ?? order.guestPhone ?? "—",
    dni: order.guestDni ?? "—",
    address: order.guestAddress ?? order.user?.address ?? "—",
    locality: order.locality,
    isGuest: !order.userId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    isPaid: !!order.paidAt,
    whatsappContacted: order.whatsappContacted,
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      size: item.size,
      price: Number(item.price),
      image: item.product.images[0] ?? null,
      slug: item.product.slug,
    })),
    createdAt: order.createdAt,
  }));
}

export type AdminOrderRow = Awaited<ReturnType<typeof getAdminOrders>>[number];

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: Number(order.total),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      size: item.size,
      price: Number(item.price),
    })),
  }));
}

export type UserOrderRow = Awaited<ReturnType<typeof getUserOrders>>[number];
