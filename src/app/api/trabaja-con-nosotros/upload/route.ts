import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { checkRateLimit, getClientIp, RATE_LIMIT_MESSAGE } from "@/server/utils/rateLimit";

export async function POST(request: Request): Promise<NextResponse> {
  const allowed = await checkRateLimit(`upload:trabaja-con-nosotros:${getClientIp(request)}`, 20);
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
          "application/pdf",
          "image/jpeg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[trabaja-con-nosotros/upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo subir el archivo." },
      { status: 400 }
    );
  }
}
