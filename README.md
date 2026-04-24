# FitGenie AI

FitGenie is a Next.js 16 app for AI-assisted workouts, nutrition plans, progress tracking, and community features. It uses the App Router, Auth.js, Prisma, PostgreSQL, and Gemini.

## Stack

- Next.js 16.2.4
- React 19
- Prisma + PostgreSQL
- Auth.js v5 beta
- Gemini via `@google/genai`

## Requirements

- Node.js `20.9.0` or newer
- A PostgreSQL database
- A `NEXTAUTH_SECRET`
- A `GEMINI_API_KEY` for AI features

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

Required:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GEMINI_API_KEY`

Optional:

- `GITHUB_ID`
- `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Local Development

```bash
npm install
npm run prisma:migrate
npm run dev
```

## Deployment

This repo is configured for production builds with webpack because the default Turbopack build path was hitting Windows filesystem lock issues in this workspace. The build is verified with:

```bash
npm run deploy:check
```

Recommended production flow:

```bash
npm install
npm run prisma:deploy
npm run build
npm run start
```

## Production Checklist

1. Set production environment variables, especially:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` set to your real public origin
   - `GEMINI_API_KEY`
2. Run database migrations with `npm run prisma:deploy`.
3. Build with `npm run build`.
4. Start with `npm run start`.

## Notes

- `next.config.ts` uses `output: "standalone"` to make container and VM deployment easier.
- `postinstall` runs `prisma generate`, so fresh installs generate the Prisma client automatically.
- Social login providers are optional and only activate when their credentials are present.
