'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:w-64">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              pathname === link.href
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
