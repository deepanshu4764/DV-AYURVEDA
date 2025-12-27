'use client';

import { useCart } from '@/components/providers/cart-provider';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, isLoaded } = useCart();
  const router = useRouter();

  if (!isLoaded) {
    return <p className="text-sm text-slate-600">Loading cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Cart</h1>
        <span className="text-sm text-slate-600">{items.length} items</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-slate-50">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/product/${item.productId}`} className="font-semibold text-slate-900">
                  {item.name}
                </Link>
                <p className="text-sm text-slate-600">In stock: {item.stock}</p>
                <p className="font-semibold text-slate-900">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-lg"
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value) || item.quantity)
                  }
                  className="w-16 rounded-md border border-slate-200 px-2 py-1 text-center"
                />
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-lg"
                  type="button"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Cash on delivery. Shipping calculated at delivery.</p>
          <button
            onClick={() => router.push('/checkout')}
            className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
