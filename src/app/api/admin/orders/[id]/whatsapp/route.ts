import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma";

const bodySchema = z.object({ whatsappContacted: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { whatsappContacted: parsed.data.whatsappContacted },
  });

  return NextResponse.json({ order });
}
