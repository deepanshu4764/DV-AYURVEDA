'use client';

import React from 'react';

export function SearchBar({
  defaultQuery,
  categories,
  selectedCategory,
  sort,
}: {
  defaultQuery?: string;
  categories: string[];
  selectedCategory?: string;
  sort?: string;
}) {
  const [q, setQ] = React.useState(defaultQuery ?? '');
  const [category, setCategory] = React.useState(selectedCategory ?? '');
  const [sortValue, setSortValue] = React.useState(sort ?? '');

  return (
    <form
      className="flex flex-col gap-2 md:flex-row md:items-center"
      action="/shop"
      method="get"
    >
      <input
        type="text"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products"
        className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none md:max-w-md"
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none md:w-auto"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        name="sort"
        value={sortValue}
        onChange={(e) => setSortValue(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none md:w-auto"
      >
        <option value="">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <button
        type="submit"
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 md:w-auto"
      >
        Search
      </button>
    </form>
  );
}
