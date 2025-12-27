import { ORDER_STATUS_VALUES, ROLE_VALUES } from "@/lib/validators";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  stock: number;
};

export type Role = (typeof ROLE_VALUES)[number];
export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
