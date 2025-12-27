import { OrderStatusBadge } from "@/components/order-status-badge";
import { OrderStatusSelect } from "@/components/order-status-select";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@/types";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-600">Manage order statuses and review details.</p>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order.user?.name || order.user?.email} •{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="space-y-1 text-slate-700">
                  <p>
                    Ship to: {order.shippingName}, {order.addressLine1}, {order.city},{" "}
                    {order.state} {order.pincode} • {order.phone}
                  </p>
                  <p>
                    Items:{" "}
                    {order.items
                      .map((item) => `${item.nameSnapshot} x${item.quantity}`)
                      .join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
