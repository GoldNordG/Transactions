// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "../../../lib/prisma.js";

export const runtime = "nodejs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ Credentials received:", credentials);

        try {
          console.log("✅ Credentials received:", credentials);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("👤 User found in DB:", user);
          if (!user) return null;

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );
          console.log("🔒 Password valid:", isPasswordValid);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            location: user.location,
          };
        } catch (error) {
          console.error("❌ Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.location = user.location;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.location = token.location;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
