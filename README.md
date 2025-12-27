# DV Ayurveda – Simple eCommerce (Next.js)

Production-clean eCommerce starter built with Next.js App Router, Tailwind, Prisma, and NextAuth. Features browsing/search, cart + checkout (COD), order history, and an admin panel for products/orders.

## Stack
- Next.js 16 (App Router, TypeScript) + Tailwind CSS v4
- Prisma ORM + SQLite (swap to Postgres by updating `prisma/schema.prisma` provider + `DATABASE_URL`)
- NextAuth (credentials email/password + optional Google OAuth) with bcrypt hashing
- LocalStorage cart, server actions for mutations

## Quickstart
```bash
npm install
cp .env.example .env             # set NEXTAUTH_SECRET, optional ADMIN_* overrides
npm run prisma:migrate           # prisma migrate dev (uses prisma/migrations/0001_init)
npm run db:seed                  # seeds admin + sample products
npm run dev
```

Build & start:
```bash
npm run build    # requires DATABASE_URL to be set
npm start
```

## Auth & Roles
- Register/login with email + password.
- Optional Google OAuth: set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` to enable “Continue with Google” on the login page.
- Roles: `USER` (default) and `ADMIN`.
- Admin-only routes are guarded via middleware and server actions.
- NextAuth credentials provider with JWT sessions; passwords hashed via bcrypt.

### Seeded Admin
- Default credentials (change in `.env` or after first login):  
  - Email: `admin@example.com`  
  - Password: `Admin123!`
- Script: `npm run db:seed`

## Project Structure (key parts)
- `src/app` – routes (home, shop, product detail, cart, checkout, account/orders, admin/*)
- `src/actions` – server actions for auth, products, orders
- `src/components` – UI pieces (navbar, cards, admin sidebar, cart provider, etc.)
- `prisma/schema.prisma` – data model; migrations live in `prisma/migrations/0001_init`
- `prisma/seed.js` – seeds admin + sample products (includes Organic Shilajit)

## Data Model (SQLite defaults)
- User: id, email, name, password (hashed), role, timestamps
- Product: name, slug, price (paise), description, category, stock, imageUrl, isActive
- Order: userId, items, totalAmount (paise), status (`PENDING` …), shipping info, timestamps
- OrderItem: orderId, productId, nameSnapshot, priceSnapshot, quantity

## Flows
- Shop/search: `/shop?q=` with category filter + price sort.
- Cart: stored in `localStorage`, update qty/remove, subtotal.
- Checkout: COD only; creates `Order` with `PENDING` status and snapshots current prices.
- Orders: `/account/orders` for users; `/admin/orders` for admins (status updates).
- Admin products: list/create/edit/archive (delete with confirmation; products tied to past orders are hidden instead of hard-deleted).

## Switching to Postgres (already configured)
1) `prisma/schema.prisma` now uses `provider = "postgresql"`.
2) Set `DATABASE_URL` in `.env` to your Postgres connection string (e.g., from Neon/Supabase/Railway).
3) Run migrations against that DB: `npx prisma migrate deploy`.
4) Seed: `npm run db:seed`.
5) Update `NEXTAUTH_URL` to your production domain and keep Google OAuth redirect/origin in sync.

## Notes
- Provide `DATABASE_URL` when running `npm run build` to avoid Prisma env errors.
- Next.js may warn about the deprecated `middleware` naming; functionality remains intact.
- Remote images are allowed via `next.config.ts` remote patterns; admin inputs image URLs directly.
