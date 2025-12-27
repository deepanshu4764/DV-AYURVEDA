import { OrderStatus } from '@/types';

const statusColor: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-sky-100 text-sky-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const color = statusColor[status] ?? statusColor.PENDING;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
