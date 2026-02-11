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

For production deployment, you'll need to:

1. Set up a real database (PostgreSQL, MongoDB, etc.)
2. Configure email service (SendGrid, AWS SES, etc.)
3. Set environment variables for production
4. Deploy to Vercel, Netlify, or your preferred hosting

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## License

MIT
