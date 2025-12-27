'use client';

import React from 'react';

type ProductFormValues = {
  name: string;
  price: number;
  description?: string | null;
  category: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
};

type Props = {
  initialData?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (values: Record<string, unknown>) => Promise<{ error?: string; success?: string } | void>;
  onSuccess?: () => void;
};

export function ProductForm({ initialData, submitLabel, onSubmit, onSuccess }: Props) {
  const [form, setForm] = React.useState({
    name: initialData?.name ?? '',
    price: initialData?.price ? initialData.price / 100 : 0,
    description: initialData?.description ?? '',
    category: initialData?.category ?? '',
    stock: initialData?.stock ?? 0,
    imageUrl: initialData?.imageUrl ?? '',
    isActive: initialData?.isActive ?? true,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleChange = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload: Record<string, unknown> = {
      ...form,
      price: Math.round(Number(form.price) * 100),
      stock: Number(form.stock),
      isActive: Boolean(form.isActive),
    };

    startTransition(async () => {
      const result = await onSubmit(payload);
      if (result && 'error' in result && result.error) {
        setError(result.error);
        return;
      }
      setSuccess(result && 'success' in result ? result.success ?? 'Saved' : 'Saved');
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {success && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Price (INR)
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Category
          <input
            required
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Stock
          <input
            type="number"
            min={0}
            required
            value={form.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-700">
        Image URL
        <input
          value={form.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          placeholder="https://..."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-700">
        Description
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="h-4 w-4"
        />
        Active product
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
