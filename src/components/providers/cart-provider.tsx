'use client';

import { CartItem } from '@/types';
import React from 'react';

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
  isLoaded: boolean;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'ayurveda-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to read cart', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, quantity: Math.min(p.quantity + item.quantity, p.stock) }
            : p,
        );
      }
      return [...prev, { ...item, quantity: Math.min(item.quantity, item.stock) }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => {
          if (p.productId !== productId) return p;
          if (p.stock <= 0) return null;
          const clamped = Math.max(1, Math.min(quantity, p.stock));
          return { ...p, quantity: clamped };
        })
        .filter((p): p is CartItem => {
          if (!p) return false;
          return p.quantity > 0;
        }),
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, total, isLoaded }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
