import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db/prisma";
import type { Locality, Role } from "@prisma/client";

type AdapterUserWithProfile = {
  role: Role;
  address: string | null;
  locality: Locality | null;
  phone: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/checkout",
  },
  events: {
    // La primera vez que este email inicia sesión, queda como ADMIN
    // automáticamente — reemplaza tener que hacer un UPDATE manual en SQL.
    async createUser({ user }) {
      if (user.email && process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const profile = user as unknown as AdapterUserWithProfile;
        session.user.id = user.id;
        session.user.role = profile.role;
        session.user.address = profile.address;
        session.user.locality = profile.locality;
        session.user.phone = profile.phone;
      }
      return session;
    },
  },
});
