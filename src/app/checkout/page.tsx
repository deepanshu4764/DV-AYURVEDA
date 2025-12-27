'use client';

import { createOrder } from '@/actions/orderActions';
import { useCart } from '@/components/providers/cart-provider';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function CheckoutPage() {
  const { items, total, clear, isLoaded } = useCart();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  if (!isLoaded) {
    return <p className="text-sm text-slate-600">Loading checkout...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Shop products
        </Link>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setSuccess(null);

    const payload = {
      shippingName: String(formData.get('shippingName') || ''),
      phone: String(formData.get('phone') || ''),
      addressLine1: String(formData.get('addressLine1') || ''),
      city: String(formData.get('city') || ''),
      state: String(formData.get('state') || ''),
      pincode: String(formData.get('pincode') || ''),
    };

    startTransition(async () => {
      try {
        const result = await createOrder({
          ...payload,
          items,
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        setSuccess('Order placed. Redirecting to orders...');
        clear();
        router.push('/account/orders');
      } catch (err) {
        console.error(err);
        setError('Unable to place order. Please login again.');
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-600">
            Cash on delivery. Your order will be marked as pending payment.
          </p>
        </div>

        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {success && (
          <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Full name
            <input
              name="shippingName"
              required
              className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Phone
            <input
              name="phone"
              required
              className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Address line
          <input
            name="addressLine1"
            required
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            City
            <input
              name="city"
              required
              className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            State
            <input
              name="state"
              required
              className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            PIN code
            <input
              name="pincode"
              required
              className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? 'Placing order...' : 'Place order (COD)'}
        </button>
      </form>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="text-sm text-slate-600">Total</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
