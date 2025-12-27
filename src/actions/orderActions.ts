"use server";

import { prisma } from "@/lib/prisma";
import { orderSchema, ORDER_STATUS_VALUES } from "@/lib/validators";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrder(input: {
  items: CartItem[];
  shippingName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const user = await requireUser();

  const parsed = orderSchema.safeParse({
    shippingName: input.shippingName,
    phone: input.phone,
    addressLine1: input.addressLine1,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid address";
    return { error: message };
  }

  if (!input.items || input.items.length === 0) {
    return { error: "Cart is empty" };
  }

  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { error: `Product ${item.name} is unavailable` };
    }
    if (product.stock < item.quantity) {
      return { error: `Insufficient stock for ${product.name}` };
    }
  }

  const totalAmount = input.items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    const price = product?.price ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: user.id,
        totalAmount,
        status: "PENDING",
        shippingName: parsed.data.shippingName,
        phone: parsed.data.phone,
        addressLine1: parsed.data.addressLine1,
        city: parsed.data.city,
        state: parsed.data.state,
        pincode: parsed.data.pincode,
        items: {
          create: input.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              nameSnapshot: product.name,
              priceSnapshot: product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });

  revalidatePath("/cart");
  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");

  return { success: "Order placed", orderId: createdOrder.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!ORDER_STATUS_VALUES.includes(status as (typeof ORDER_STATUS_VALUES)[number])) {
    return { error: "Invalid status" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");

  return { success: "Status updated" };
}
