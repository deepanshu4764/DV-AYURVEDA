'use client';

import { formatCurrency } from '@/lib/utils';
import type { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './providers/cart-provider';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="relative h-48 w-full bg-slate-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.id}`} className="text-lg font-semibold text-slate-900">
          {product.name}
        </Link>
        <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-slate-900">{formatCurrency(product.price)}</span>
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
                quantity: 1,
              })
            }
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
