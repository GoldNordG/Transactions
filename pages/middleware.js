import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production", // important pour l'edge
  });

  const { pathname } = req.nextUrl;

  // Routes publiques
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/forgot-password"
  ) {
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protéger les routes d'API
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: "Non authentifié",
          status: "session_expired",
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }
  }

  // Pour les routes normales, rediriger vers login si non connecté
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("session", "expired");
    return NextResponse.redirect(url);
  }

  // Routes réservées aux administrateurs
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
    token.role !== "admin" &&
    token.role !== "superadmin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Routes réservées aux superadmins
  if (
    (pathname.startsWith("/superadmin") ||
      pathname.startsWith("/api/superadmin") ||
      (pathname.startsWith("/api/transactions") &&
        pathname.includes("/fraud-status"))) &&
    token.role !== "superadmin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
  runtime: "experimental-edge", // important pour éviter les erreurs liées à l'environnement
};
