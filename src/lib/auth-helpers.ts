import { authOptions } from "@/lib/auth";
import type { Role } from "@/types";
import { getServerSession } from "next-auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role as Role) !== "ADMIN") {
    throw new Error("Admin access only");
  }
  return session.user;
}
