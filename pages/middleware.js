import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Autoriser l'accès aux pages publiques (comme /login ou /api/auth)
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Rediriger vers /login si l'utilisateur n'est pas authentifié
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Autoriser l'accès si l'utilisateur est authentifié
  return NextResponse.next();
}
