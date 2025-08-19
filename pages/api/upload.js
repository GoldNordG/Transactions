// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import prisma from "../../../lib/prisma.js";

export const runtime = "nodejs";

export const authOptions = {
  providers: [
    // Votre système de credentials existant
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ Credentials received:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("👤 User found in DB:", user);

        if (!user) {
          console.log("❌ No user found with this email.");
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        console.log("🔒 Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("❌ Invalid password.");
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          location: user.location,
          authType: "credentials", // Marquer le type d'authentification
        };
      },
    }),

    // Nouveau provider Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.file",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Si c'est une connexion Google, vérifier si l'utilisateur existe dans la DB
      if (account.provider === "google") {
        console.log("🔍 Google sign-in attempt for:", profile.email);

        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          console.log("❌ Google user not found in database:", profile.email);
          // Rejeter la connexion si l'utilisateur n'existe pas dans votre DB
          return false;
        }

        console.log("✅ Google user found in DB:", existingUser.email);
        // Ajouter les infos de l'utilisateur DB au profil
        user.role = existingUser.role;
        user.location = existingUser.location;
        user.dbId = existingUser.id;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Première connexion
      if (user) {
        token.role = user.role;
        token.location = user.location;
        token.authType = user.authType || "google";

        // Pour les connexions credentials
        if (user.id) {
          token.id = user.id;
        }

        // Pour les connexions Google
        if (user.dbId) {
          token.id = user.dbId;
        }
      }

      // Stocker les tokens OAuth Google
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000;
        token.authType = "google";
      }

      // Rafraîchir le token Google si nécessaire
      if (
        token.authType === "google" &&
        Date.now() > token.accessTokenExpires
      ) {
        console.log("🔄 Refreshing Google token");
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      // Informations communes
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.location = token.location;
        session.user.authType = token.authType;
      }

      // Tokens Google pour l'API Drive
      if (token.authType === "google") {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: process.env.NODE_ENV === "development",
};

/**
 * Rafraîchir le token Google
 */
async function refreshAccessToken(token) {
  try {
    const url = "https://oauth2.googleapis.com/token";

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth(authOptions);
