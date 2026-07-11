import { NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const role = req.auth?.user?.role;
  const isAdmin = !!req.auth && role === "ADMIN";

  if (!isAdmin) {
    if (isAdminApi) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const signInUrl = new URL("/acceso-admin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
