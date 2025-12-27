"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    return { error: message };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email is already registered" };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "USER",
    },
  });

  return { success: "Account created successfully. You can login now." };
}
