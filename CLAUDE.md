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

## Production Setup

1. Configure real database connection in `lib/db.ts`
2. Set up email service in `lib/email.ts`
3. Set environment variables (see `.env.example`)
4. Deploy to Vercel or preferred host
