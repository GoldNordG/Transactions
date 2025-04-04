import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  csrf: {
    // Laisser les valeurs par défaut de NextAuth
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Rechercher l'utilisateur dans la base de données
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error("Utilisateur introuvable :", credentials.email);
            return null;
          }

          // Comparer le mot de passe saisi avec le mot de passe haché
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.error("Mot de passe incorrect pour :", credentials.email);
            return null;
          }

          console.log("Connexion réussie pour :", user.email);

          // Retourner l'utilisateur si l'authentification réussit
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            location: user.location,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.location = user.location;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
          location: token.location,
        };
      }
      return session;
    },
  },
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
  pages: {
    signIn: "/login", // Page de connexion personnalisée
    signOut: "/login", // Redirection après déconnexion
    error: "/login", // En cas d'erreur d'authentification
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 heures
    updateAge: 24 * 60 * 60, // Rafraîchir la session tous les jours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
