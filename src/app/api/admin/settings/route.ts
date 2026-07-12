import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { storeSettingsSchema } from "@/lib/validation";
import { getStoreSettings, updateStoreSettings } from "@/server/services/settings";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const json = await req.json();
  const parsed = storeSettingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const settings = await updateStoreSettings(parsed.data);
  return NextResponse.json(settings);
}
