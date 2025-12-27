import { z } from "zod";

export const ROLE_VALUES = ["USER", "ADMIN"] as const;
export type RoleValue = (typeof ROLE_VALUES)[number];

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().int().nonnegative("Price must be positive"),
  description: z.string().optional().default(""),
  category: z.string().min(1, "Category required"),
  stock: z.coerce.number().int().nonnegative("Stock must be positive"),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional()
    .or(z.literal("")),
  isActive: z.coerce.boolean().optional().default(true),
});

export const orderSchema = z.object({
  shippingName: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(4, "PIN code is required"),
});
