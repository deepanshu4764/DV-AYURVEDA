import { prisma } from "@/lib/prisma";
import type { Role } from "@/types";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user) return null;

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) return null;

      const safeUser: User = {
        id: user.id,
        email: user.email,
        name: user.name ?? user.email,
        role: (user.role as Role) ?? "USER",
      };

      return safeUser;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });

    if (existing) {
          (user as User & { role?: Role }).id = existing.id;
          (user as User & { role?: Role }).role = (existing.role as Role) ?? "USER";
        } else {
          const placeholderPassword = await bcrypt.hash(
            Math.random().toString(36).slice(2),
            10,
          );
          const created = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? user.email,
              password: placeholderPassword,
              role: "USER",
            },
          });
          (user as User & { role?: Role }).id = created.id;
          (user as User & { role?: Role }).role = (created.role as Role) ?? "USER";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User & { role?: Role }).id ?? token.sub ?? "";
        token.role = ((user as User & { role?: Role }).role as Role) ?? "USER";
        token.email = user.email;
      } else if (!token.role && token.sub) {
        const existing = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, role: true, email: true },
        });
        if (existing) {
          token.id = existing.id;
          token.role = (existing.role as Role) ?? "USER";
          token.email = existing.email;
        }
      } else if (!token.role && token.email) {
        const existing = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, email: true },
        });
        if (existing) {
          token.id = existing.id;
          token.role = (existing.role as Role) ?? "USER";
          token.email = existing.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || "";
        session.user.role = (token.role as Role) ?? "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
