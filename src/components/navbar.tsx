'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useCart } from './providers/cart-provider';

type LinkItemProps = {
  href: string;
  label: string;
  activePath: string;
  onClick?: () => void;
};

function NavLinkItem({ href, label, activePath, onClick }: LinkItemProps) {
  const isActive = activePath === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const { items, isLoaded } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const cartCount = isLoaded ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden rounded-md border border-slate-200 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="h-0.5 w-5 bg-slate-800 mb-1" />
            <div className="h-0.5 w-5 bg-slate-800 mb-1" />
            <div className="h-0.5 w-5 bg-slate-800" />
          </button>
          <Link href="/" className="text-lg font-semibold text-slate-900">
            DV Ayurveda
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NavLinkItem href="/" label="Home" activePath={pathname} onClick={() => setOpen(false)} />
          <NavLinkItem
            href="/shop"
            label="Shop"
            activePath={pathname}
            onClick={() => setOpen(false)}
          />
          <NavLinkItem
            href="/cart"
            label={`Cart (${cartCount})`}
            activePath={pathname}
            onClick={() => setOpen(false)}
          />
          {session?.user ? (
            <>
              <NavLinkItem
                href="/account/orders"
                label="Orders"
                activePath={pathname}
                onClick={() => setOpen(false)}
              />
              {isAdmin && (
                <NavLinkItem
                  href="/admin"
                  label="Admin"
                  activePath={pathname}
                  onClick={() => setOpen(false)}
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLinkItem
              href="/"
              label="Home"
              activePath={pathname}
              onClick={() => setOpen(false)}
            />
            <NavLinkItem
              href="/shop"
              label="Shop"
              activePath={pathname}
              onClick={() => setOpen(false)}
            />
            <NavLinkItem
              href="/cart"
              label={`Cart (${cartCount})`}
              activePath={pathname}
              onClick={() => setOpen(false)}
            />
            {session?.user ? (
              <>
                <NavLinkItem
                  href="/account/orders"
                  label="Orders"
                  activePath={pathname}
                  onClick={() => setOpen(false)}
                />
                {isAdmin && (
                  <NavLinkItem
                    href="/admin"
                    label="Admin"
                    activePath={pathname}
                    onClick={() => setOpen(false)}
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
