import type { Locality, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      address: string | null;
      locality: Locality | null;
      phone: string | null;
    } & DefaultSession["user"];
  }
}
