import { NextResponse } from "next/server";
import { getStoreSettings } from "@/server/services/settings";

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}
