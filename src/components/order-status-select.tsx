'use client';

import { updateOrderStatus } from '@/actions/orderActions';
import { ORDER_STATUS_VALUES } from '@/lib/validators';
import React from 'react';

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [current, setCurrent] = React.useState(status);
  const [isPending, startTransition] = React.useTransition();

  const handleChange = (value: string) => {
    setCurrent(value);
    startTransition(async () => {
      await updateOrderStatus(orderId, value);
    });
  };

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-slate-400 focus:outline-none"
    >
      {ORDER_STATUS_VALUES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
