"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createProduct(input: Record<string, unknown>) {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    return { error: message };
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  await prisma.product.create({
    data: {
      ...data,
      slug,
      imageUrl: data.imageUrl || undefined,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");

  return { success: "Product created" };
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    return { error: message };
  }

  const data = parsed.data;

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      slug: slugify(data.name),
      imageUrl: data.imageUrl || undefined,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  revalidatePath("/admin/products");

  return { success: "Product updated" };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const hasOrders = await prisma.orderItem.count({ where: { productId: id } });

  if (hasOrders > 0) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false, stock: 0 },
    });
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: "Product archived (existing orders retained)" };
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/admin/products");

  return { success: "Product removed" };
}
