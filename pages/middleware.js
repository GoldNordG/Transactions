import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Dans middleware.js
export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Routes publiques
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/forgot-password" // Si vous avez une page de récupération de mot de passe
  ) {
    // Si l'utilisateur est déjà connecté et essaie d'accéder à /login
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protéger les routes d'API
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    if (!token) {
      return new NextResponse(JSON.stringify({ message: "Non authentifié" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // Pour les autres routes, rediriger vers login si non connecté
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Routes réservées aux administrateurs
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
    token.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configurer le middleware pour qu'il s'applique à certaines routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
