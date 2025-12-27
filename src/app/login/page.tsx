'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsPending(false);

    if (result?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push(result?.url ?? '/');
  };

  const handleGoogle = async () => {
    setError(null);
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
      <p className="text-sm text-slate-600">
        Access your account or{' '}
        <Link href="/register" className="font-semibold text-slate-900 hover:underline">
          create a new one
        </Link>
        .
      </p>

      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
          <div className="h-px flex-1 bg-slate-200" />
          <span>OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          onClick={handleGoogle}
          className="mt-3 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
