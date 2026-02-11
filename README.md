# SuperRichie

NextGen Super Awesome Code Generator with magic link authentication.

## Features

- 🎨 Black & green terminal-inspired design
- ✉️ Magic link authentication (passwordless)
- 🚀 Built with Next.js 15 and TypeScript
- 💅 Styled with Tailwind CSS
- 📱 Fully responsive

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

## Project Structure

- `/app` - Next.js app directory
  - `/page.tsx` - Landing page
  - `/signup/page.tsx` - Signup page
  - `/dashboard/page.tsx` - User dashboard
  - `/api/auth` - Authentication API routes
- `/lib` - Utility functions
  - `db.ts` - Database operations (in-memory for demo)
  - `email.ts` - Email sending utilities
- `/public` - Static assets

## Magic Link Authentication Flow

1. User enters email on signup page
2. System generates unique token and sends magic link email
3. User clicks link in email
4. Token is verified and user is authenticated
5. User is redirected to dashboard

## Production Deployment

SuperRichie is integrated with **Mosaic Platform** for production deployment, providing:
- PostgreSQL 17 database with pgvector
- S3-compatible storage
- Redis (Pro+ plans)
- User authentication
- Git hosting and auto-deploy
- Container deployment

### Initial Setup

```bash
# Set your Mosaic API key in .env.local
MOSAIC_API_KEY=mk_your_api_key

# Run setup to create project and initialize database
npm run setup-mosaic
```

This will:
1. Create a Mosaic project with slug `superrichie`
2. Provision a dedicated PostgreSQL database
3. Initialize database schema (users, magic_link_tokens)
4. Configure Git repository
5. Set up deployment at `https://superrichie.mosaic.site`

### Deploy to Mosaic

Option 1 - Via Git (recommended):
```bash
git push https://git.mosaic.site/[your-username]/superrichie.git main
```

Option 2 - Via Vercel:
```bash
npm install -g vercel
vercel
```

## License

MIT
