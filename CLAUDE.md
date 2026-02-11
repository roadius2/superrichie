# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperRichie - A NextGen Super Awesome Code Generator with magic link authentication.
Terminal-inspired black and green design aesthetic.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Authentication: Magic link (passwordless)
- Database: In-memory (for demo) - ready for PostgreSQL/MongoDB integration

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Directory Structure
- `/app` - Next.js app router pages and API routes
- `/lib` - Shared utilities (database, email)
- `/public` - Static assets

### Authentication Flow
1. User submits email on `/signup`
2. API generates token and sends magic link email (`/api/auth/magic-link`)
3. User clicks email link → `/api/auth/verify?token=xxx`
4. Token validated, session created, redirect to `/dashboard`

### Database Layer (`lib/db.ts`)
- In-memory storage for demo (Map-based)
- Ready for migration to real database
- User and MagicLinkToken models defined

### Email System (`lib/email.ts`)
- Development: logs to console
- Production: configure SMTP or service (SendGrid, AWS SES)

## Design System

- Primary color: #00ff00 (green)
- Background: #000000 (black)
- Font: Courier New (monospace)
- Effects: text-shadow-glow, border-glow for terminal aesthetic

## Production Setup with Mosaic Platform

### Initial Setup
```bash
# Set Mosaic API key
MOSAIC_API_KEY=mk_xxxxx

# Initialize project
npm run setup-mosaic
```

### Database Layer
- Production: Uses Mosaic Platform PostgreSQL (`lib/db-mosaic.ts`)
- Development: Can use in-memory fallback (`lib/db.ts`)
- Mosaic client library: `lib/mosaic.ts`

### Deployment
1. Push to Mosaic Git: `git push [mosaic-git-url] main`
2. Or deploy to Vercel with env vars set
3. Live at: `https://superrichie.mosaic.site`

### Environment Variables
```
MOSAIC_API_KEY=mk_xxxxx
MOSAIC_PROJECT_SLUG=superrichie
NEXT_PUBLIC_BASE_URL=https://superrichie.mosaic.site
```
