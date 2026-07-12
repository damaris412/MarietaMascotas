import { prisma } from "@/server/db/prisma";

export async function getCustomOrderRequests(limit = 200) {
  const requests = await prisma.customOrderRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return requests.map((request) => ({
    ...request,
    neckCm: Number(request.neckCm),
    chestCm: Number(request.chestCm),
    backLengthCm: Number(request.backLengthCm),
  }));
}

export type CustomOrderRequestRow = Awaited<ReturnType<typeof getCustomOrderRequests>>[number];
