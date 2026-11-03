# বাজার দর (BazarDor)

A responsive Bengali market-price explorer for everyday essentials in Bangladesh. Browse product prices, compare market estimates, explore categories, and sign in to access protected product details.

## Technologies

- **Next.js App Router** — routes, server rendering, API proxy routes
- **React + TypeScript** — interactive UI and typed product models
- **Tailwind CSS v4** — responsive design system
- **Better Auth** — email/password and Google/GitHub OAuth
- **react-hot-toast** — authentication, validation, and redirect notifications
- **Lucide React** — icons
- **BazarDor API** — product and category data

## Key features

1. Responsive Bengali UI for mobile, tablet, laptop, and desktop.
2. Infinite market-price ticker and hero CTA that scrolls to `#সব-পণ্য`.
3. Price-riser and price-faller sections plus product cards with Bengali-formatted numbers.
4. Category routes with numeric low-to-high/high-to-low sorting.
5. Protected product details with minimum, maximum, average, and market-by-market prices.
6. Better Auth email/password registration and sign-in, with Google/GitHub OAuth hooks.
7. Profile view and profile-name update using Better Auth's `updateUser`.
8. Skeleton loading, toast notifications, and friendly 404 pages.

## Requirements

- Node.js 20+
- npm
- OAuth app credentials only if you want Google/GitHub login enabled

## Setup

```bash
npm install
cp .env.example .env.local
```

Set a strong `BETTER_AUTH_SECRET` and keep `BETTER_AUTH_URL=http://localhost:3000` for local development. Fill Google/GitHub OAuth credentials in `.env.local` if using social login. The OAuth callback URL is:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Then start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## API configuration

The app tries these APIs in order:

1. `https://openapi.programming-hero.com/api/bazardor`
2. `https://api.api-store.workers.dev/api/bazardor`
3. `https://api.abcz.workers.dev/api/bazardor`

Override them with `BAZARDOR_API_URL`, `BAZARDOR_API_FALLBACK_1`, and `BAZARDOR_API_FALLBACK_2`. Product payloads can vary, so the normalization layer in `lib/utils.ts` maps common field names into the UI model. If your assigned API uses different response field names, adjust `normalizeProducts` / `normalizeCategories` there.

## Better Auth database

This starter config uses the LibSQL/SQLite Drizzle adapter. Install the schema tooling and generate/apply the schema before using auth:

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

The project includes `drizzle.config.ts`. Generate and apply migrations for the schema in `lib/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

For Vercel production, use a persistent hosted LibSQL/Turso database and set `DATABASE_URL` to its URL. Do not rely on local SQLite storage on Vercel because the deployment filesystem is ephemeral.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add all required environment variables. Set `BETTER_AUTH_URL` to the deployed origin and `NEXT_PUBLIC_BETTER_AUTH_URL` to the same URL.
4. Use a hosted LibSQL/Turso database and run migrations.
5. Add the deployed callback URLs to Google/GitHub OAuth settings.
6. Deploy, then test home, category, product details after sign-in, sign-up, profile update, and refresh on dynamic routes.

## Suggested Git commit plan (make at least 8 commits)

This project folder is delivered without a Git history. Use these meaningful commits while building/submitting:

```bash
git init
git add package.json tsconfig.json next.config.ts postcss.config.mjs
git commit -m "chore: initialize Next.js TypeScript project"
git add app/globals.css components
git commit -m "feat: build responsive shared layout and navigation"
git add lib/api.ts lib/utils.ts types app/api
git commit -m "feat: integrate BazarDor products and categories API"
git add components/HomeClient.tsx components/ProductCard.tsx components/ProductGrid.tsx app/page.tsx
git commit -m "feat: add home hero and market price sections"
git add app/category
git commit -m "feat: add category browsing and price sorting"
git add app/product
git commit -m "feat: add protected product details and market comparison"
git add lib/auth.ts lib/auth-client.ts lib/schema.ts app/api/auth app/signin app/signup
git commit -m "feat: configure Better Auth and authentication pages"
git add app/profile
git commit -m "feat: add profile page and update user information"
git add README.md .env.example public
git commit -m "docs: add setup guide and deployment instructions"
```

## Design assets

The supplied `bazar-hero.png` and `logo-icon.png` are included in `public/`. The original `.fig` file is retained in the project archive as a reference.
