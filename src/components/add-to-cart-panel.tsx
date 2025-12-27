'use client';

import type { Product } from '@prisma/client';
import React from 'react';
import { useCart } from './providers/cart-provider';

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = React.useState(1);

  const increase = () => setQty((q) => Math.min(q + 1, product.stock));
  const decrease = () => setQty((q) => Math.max(1, q - 1));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={decrease}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-lg"
          type="button"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))}
          className="w-16 rounded-md border border-slate-200 px-2 py-1 text-center"
        />
        <button
          onClick={increase}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-lg"
          type="button"
        >
          +
        </button>
      </div>
      <button
        disabled={product.stock <= 0 || !product.isActive}
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
            quantity: qty,
          })
        }
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
      </button>
      <p className="text-xs text-slate-500">Cash on delivery at checkout. Prices inclusive of taxes.</p>
    </div>
  );
}
