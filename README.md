# Faraz Hassan Portfolio & Admin Studio

Full-stack portfolio web application with a private management Admin Panel built according to the complete specification in `PORTFOLIO_ADMIN_PRD_TRD.md`.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Styling:** Tailwind CSS + CSS Variables (Exact tokens from `reference/portfolio-v6.html`)
- **Database:** SQLite (local development in `dev.db`) / PostgreSQL (production)
- **ORM:** Prisma Client
- **Authentication:** Custom secure JWT session cookies with `jose` & `bcryptjs` (Password cost factor 12)
- **Code Highlighting:** Shiki syntax highlighting
- **Validation:** Zod schemas for all actions and forms

---

## Getting Started

### 1. Environment Variables
Ensure `.env` exists with the following values:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="f8a129d5b4e7c30981a620d4f57291ec72b49081a29384756102938475610293"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="faraz.hassan@example.com"
ADMIN_PASSWORD="AdminPassword123!"
RESEND_API_KEY=""
CONTACT_NOTIFY_EMAIL=""
```

### 2. Database Sync & Seed
```bash
npm run seed
```
This synchronizes Prisma with `dev.db` and seeds all content from `reference/portfolio-v6.html`.

### 3. Run Dev Server
```bash
npm run dev
```
The site will be live at:
- **Public Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Admin Credentials
- **Email:** `faraz.hassan@example.com`
- **Password:** `AdminPassword123!`

*(You can update this password anytime in `/admin/settings`)*

---

## Features
- **Public Site (`/`):**
  - Statically generated and on-demand revalidated upon any admin edits
  - Pixel-faithful layout matching reference design
  - Typing role animation & interactive terminal code typing
  - Running technology marquee ticker
  - Stacking project cards with Shiki highlighted code terminals
  - Animated count-up numbers and scroll progress bar
  - Interactive contact form with honeypot spam protection & rate limiting
- **Admin Panel (`/admin`):**
  - **Dashboard:** Unread inquiry counters, quick action shortcuts, recent message inbox
  - **Hero:** Edit headline lines, typing roles list, lead copy, CTAs, and live code snippet preview
  - **About:** Edit bio paragraphs (supports `**bold**` text formatting) & key highlight facts
  - **Projects:** List, add, edit, reorder, and toggle visibility of projects with live card preview
  - **Tech:** Add, reorder, or remove technology marquee skills
  - **Process:** Edit development workflow steps
  - **Stats:** Custom number counters and suffixes
  - **Contact:** Edit direct email, heading, social links, and footer copy
  - **Messages:** Review inquiries, mark read/unread, reply directly by email
  - **Settings:** Manage SEO metadata, accent colors (light & dark theme), and change admin password
