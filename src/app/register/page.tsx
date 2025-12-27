'use client';

import { registerUser } from '@/actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await registerUser({ name, email, password });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSuccess(result?.success ?? 'Account created. Redirecting...');
      router.push('/login');
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="text-sm text-slate-600">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-slate-900 hover:underline">
          Login
        </Link>
        .
      </p>

      {error && <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {success && (
        <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Name
          <input
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:outline-none"
          />
        </label>
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
          {isPending ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
