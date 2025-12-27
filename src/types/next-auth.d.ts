import "next-auth";
import "next-auth/jwt";
import { Role } from ".";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
