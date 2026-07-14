import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkRateLimit, getClientIp, RATE_LIMIT_MESSAGE } from "@/server/utils/rateLimit";

export async function POST(request: Request): Promise<NextResponse> {
  const allowed = await checkRateLimit(`upload:sastreria:${getClientIp(request)}`, 20);
  if (!allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "video/mp4",
          "video/webm",
          "video/quicktime",
        ],
        maximumSizeInBytes: 80 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[sastreria-a-medida/upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir el archivo." },
      { status: 400 }
    );
  }
}
