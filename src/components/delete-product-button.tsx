'use client';

import { deleteProduct } from '@/actions/productActions';
import React from 'react';

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    if (!confirm('Delete this product?')) return;
    startTransition(async () => {
      await deleteProduct(productId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:cursor-not-allowed disabled:text-rose-300"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
