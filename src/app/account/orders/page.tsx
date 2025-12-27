import { OrderStatusBadge } from "@/components/order-status-badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My orders</h1>
        <p className="text-sm text-slate-600">Track your purchases and status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-3 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-500">
                    Placed {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.nameSnapshot} x {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(item.priceSnapshot * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <span>Shipping to: {order.addressLine1}</span>
                <span className="font-bold text-slate-900">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
