# Portfolio Website + Admin Panel: PRD and TRD

**Owner:** Faraz Hassan
**Audience:** Antigravity (AI coding agent). Follow this document in order. Where it says MUST, do not skip it.
**Reference design:** `portfolio-v6.html` (attached alongside this file). It is the visual source of truth for the public site.

---

## 1. Goal

Convert the static `portfolio-v6.html` into a real website whose content is editable from a private admin panel. The owner must be able to change every piece of text, every project and every link without touching code, and see changes live within seconds.

### 1.1 Users
| User | Needs |
|---|---|
| Visitor / client | Fast, beautiful portfolio. Can read work and contact the owner. |
| Admin (one person, the owner) | Log in, edit all content, reorder items, preview, read contact messages. |

There is exactly **one admin account**. No public signup. No roles.

### 1.2 Out of scope (v1)
Multi-user roles, blog, comments, analytics dashboards, i18n, payments.

---

## 2. Tech stack (fixed, do not substitute)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript strict |
| Styling | Tailwind CSS plus CSS variables for design tokens (see section 4) |
| Admin UI | shadcn/ui components, restyled to match tokens |
| DB | PostgreSQL in production, SQLite allowed for local dev |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5), Credentials provider, JWT session, single admin |
| Validation | Zod on every server action and API route |
| Drag and drop | `@dnd-kit/core` and `@dnd-kit/sortable` |
| Code highlighting | `shiki`, run on the server at render time |
| Images (phase 2) | Vercel Blob or local `/public/uploads` behind an upload route |
| Hosting | Vercel (frontend and API), Neon or Supabase (Postgres) |
| Email (optional) | Resend, to notify the admin of new messages |

Use **Server Actions** for admin mutations. Use **ISR with on-demand revalidation** for the public site.

---

## 3. Information architecture

### 3.1 Public site (`/`)
One page, same sections and order as `portfolio-v6.html`:

1. Progress bar and sticky nav
2. Hero (badge, 3 headline lines, typing roles, lead text, 2 buttons, animated code card)
3. Tech marquee
4. About (heading, paragraphs, facts list)
5. Selected work (stacking project cards, each with a code snippet terminal)
6. How I work (process steps)
7. Numbers (count-up stats)
8. Contact (big email link, social buttons, **contact form**, footer)

Also: `/privacy` is not needed. Add `sitemap.xml`, `robots.txt`, Open Graph image from settings.

### 3.2 Admin panel (`/admin`, all routes protected)

| Route | Purpose |
|---|---|
| `/admin/login` | Email and password login |
| `/admin` | Dashboard: unread messages count, last edited items, quick links, "View site" button |
| `/admin/hero` | Edit hero content |
| `/admin/about` | Edit about heading, paragraphs, facts |
| `/admin/projects` | List, reorder (drag), show/hide, delete |
| `/admin/projects/new` and `/admin/projects/[id]` | Project editor |
| `/admin/tech` | Marquee technologies (add, remove, reorder) |
| `/admin/process` | Process steps (add, remove, reorder) |
| `/admin/stats` | Number stats |
| `/admin/contact` | Email, social links, footer text |
| `/admin/messages` | Inbox of contact form submissions |
| `/admin/settings` | Site title, meta description, OG image, accent color, account password change |

Admin layout: left sidebar with the routes above, top bar with "View site" and "Log out". Admin MUST be fully usable on mobile (sidebar becomes a drawer).

---

## 4. Design tokens (must match the reference)

Copy these exactly from `portfolio-v6.html`. Store them as CSS variables in `globals.css`.

```
Light:  --bg #F4F6FB  --panel #FFFFFF  --ink #0A1020  --mute #5B6680  --line #DCE1EE  --a #2457F5
Dark:   --bg #06080F  --panel #0D1220  --ink #F2F5FF  --mute #8D98B5  --line #1A2338  --a #4B7BFF
Code card: bg #0A1020 (light) / #090E1A (dark), text #DCE6FF
Font: Sora (400, 500, 600, 700, 800). Mono: system monospace stack.
```

**Hard design rules**
- NO gradients anywhere (public site or admin). Solid colors only.
- Dark mode follows `prefers-color-scheme`. Admin also offers a manual theme toggle.
- Respect `prefers-reduced-motion`: disable every animation.
- Keep all animations from the reference: headline line reveal, typing roles, typing code card, marquee, scroll reveal, count-up, scroll progress bar, stacking project cards, hover effects. Port the JS to a client component with the same behavior.
- Admin panel uses the same tokens, same font, same 12 to 26px radii, so it feels like the same product.

### 4.1 Pixel-match contract (public site)

The public site MUST look and behave exactly like `portfolio-v6.html`. Copy `portfolio-v6.html` into the repo as `/reference/portfolio-v6.html` and never edit it. If anything below disagrees with the reference file, the reference file wins.

**Layout measurements**
| Item | Value |
|---|---|
| Container | max-width 1180px, horizontal padding 28px |
| Nav | sticky, height 68px, bottom border 1px `--line` |
| Hero | min-height `calc(100vh - 68px)`, padding 96px 0 72px, 2 columns `1.2fr 1fr`, gap 56px |
| H1 | `clamp(44px, 6.6vw, 88px)`, weight 800, letter-spacing -0.035em, line-height 1.05 |
| Role line | `clamp(20px, 2.4vw, 28px)`, weight 600, accent color, blinking caret |
| Section padding | 112px top and bottom (work and process sections use 40px top) |
| Section headings (h2) | `clamp(34px, 4.6vw, 58px)`, weight 700 |
| Buttons | padding 14px 26px, radius 12px, weight 600, 15px text |
| Project card | radius 26px, padding 40px, 2 columns `1fr 1.1fr`, gap 40px, bottom margin 36px, sticky at `top: calc(88px + index * 18px)` |
| Code card | radius 18px, title bar with 3 dots, 13 to 13.5px monospace, line-height 1.75 |
| Process cards | radius 20px, padding 32px, 3 columns, gap 20px |
| Numbers band | full-width block with solid accent background, white text, 4 columns |
| Mobile breakpoint | 900px. Below it: nav menu hidden, hero and project cards become 1 column, project cards stop being sticky, process becomes 1 column, stats become 2 columns |

**Animation timings (must match)**
| Animation | Behavior |
|---|---|
| Headline lines | each line slides up from `translateY(110%)` inside an overflow-hidden wrapper, 0.9s, `cubic-bezier(.2,.8,.2,1)`, delays 0s, 0.12s, 0.24s |
| Hero fades | badge, role, buttons and code card fade in after 0.55s. Lead text, buttons and code card use 0.75s |
| Typing roles | 75ms per character typing, 35ms per character deleting, 1400ms hold, 350ms pause before next role, blinking caret |
| Code card typing | 18ms per character, HTML tags and entities are written instantly |
| Marquee | list duplicated once, `translateX(-50%)` loop, 28s linear infinite |
| Scroll reveal | `opacity 0 and translateY(32px)` to visible, 0.8s, same easing, IntersectionObserver threshold 0.15, reveals once, stagger `(index % 3) * 90ms` |
| Count-up | triggers at 50% visibility, 1400ms, ease-out cubic, suffix appears at the end |
| Progress bar | 3px fixed bar at top, `scaleX` from scroll position, accent color |
| Hover | buttons lift 3px and border turns accent, arrow moves 4px right, fact rows shift 6px right, process cards lift 6px, project card border turns accent |
| Reduced motion | every animation and transition disabled, final state shown immediately |

**Visual regression test (required)**
1. Add Playwright and `pixelmatch` as dev dependencies.
2. Add `npm run visual-diff`. The script opens `/reference/portfolio-v6.html` and the running Next.js public page with the same viewport, with `prefers-reduced-motion: reduce` emulated so animations are in their final state.
3. Compare full-page screenshots at 375px, 768px and 1440px, in both light and dark color schemes (6 comparisons).
4. A comparison passes when fewer than 2% of pixels differ. Save diff images to `/visual-diff-output/` and fix every failure.
5. Text that the owner has changed in the database must not be used for this test. Run it right after seeding.

---

## 5. Data model (Prisma)

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

// Singleton rows (always id = 1)
model SiteSettings {
  id              Int     @id @default(1)
  siteTitle       String
  metaDescription String
  ogImageUrl      String?
  accentLight     String  @default("#2457F5")
  accentDark      String  @default("#4B7BFF")
  availableBadge  String  @default("Available for new projects")
  showBadge       Boolean @default(true)
  updatedAt       DateTime @updatedAt
}

model Hero {
  id        Int      @id @default(1)
  line1     String
  line2     String
  line3     String
  roles     Json     // string[]
  lead      String
  cta1Label String
  cta1Href  String
  cta2Label String
  cta2Href  String
  codeFile  String   // e.g. ride_provider.dart
  codeText  String   // plain text, NOT html
  codeLang  String   @default("dart")
  updatedAt DateTime @updatedAt
}

model About {
  id         Int      @id @default(1)
  tag        String
  heading    String
  paragraphs Json     // string[] (supports **bold** inline)
  updatedAt  DateTime @updatedAt
}

model Fact {
  id    String @id @default(cuid())
  label String
  value String
  order Int
}

model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  features    Json     // string[]
  tags        Json     // string[]
  codeFile    String?
  codeText    String?  // plain text
  codeLang    String?  @default("dart")
  liveUrl     String?
  coverUrl    String?  // phase 2
  visible     Boolean  @default(true)
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tech {
  id    String @id @default(cuid())
  name  String
  order Int
}

model ProcessStep {
  id          String @id @default(cuid())
  title       String
  description String
  order       Int
}

model Stat {
  id     String @id @default(cuid())
  value  Int
  suffix String @default("")   // "+" or ""
  label  String
  order  Int
}

model ContactInfo {
  id          Int    @id @default(1)
  email       String
  heading     String
  footerLeft  String
  footerRight String
}

model SocialLink {
  id      String  @id @default(cuid())
  label   String  // GitHub, LinkedIn, X
  url     String
  visible Boolean @default(true)
  order   Int
}

model Message {
  id        String   @id @default(cuid())
  name      String
  email     String
  body      String
  read      Boolean  @default(false)
  ip        String?
  createdAt DateTime @default(now())
}
```

Rules:
- `order` is 0-based and is rewritten in one transaction whenever the list is reordered.
- Code is stored as **plain text**. Never store or render HTML from the admin. Highlight on the server with Shiki using the theme colors from the reference (keywords `#7FA1FF`, strings `#F3B65B`, comments `#6376A0`).
- Inline bold in about paragraphs uses `**text**` and is converted safely to `<strong>` by a small parser. No other markup allowed.

---

## 6. Functional requirements

### 6.1 Auth
- FR-A1: Login with email and password. Passwords hashed with bcrypt (cost 12).
- FR-A2: All `/admin/*` routes and all admin server actions MUST check the session server-side. Middleware alone is not enough.
- FR-A3: Rate limit login to 5 failed attempts per 15 minutes per IP. Show a generic error ("Incorrect email or password").
- FR-A4: Session expires after 7 days. Logout clears it.
- FR-A5: Change password in `/admin/settings` (requires current password, min 10 chars).
- FR-A6: Admin account is created by the seed script from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars. No signup route exists.

### 6.2 Content editing
- FR-C1: Every editor form uses Zod validation with inline field errors and a Save button that shows a loading state and a success toast.
- FR-C2: Forms warn before leaving with unsaved changes.
- FR-C3: Lists (facts, projects, tech, process, stats, social links) support add, edit, delete (with confirm dialog) and drag-to-reorder. Keyboard-accessible reorder (up and down buttons) is also required.
- FR-C4: Project editor fields: name, slug (auto from name, editable, unique), description, features (repeatable rows), tags (chip input), code file name, code language (select: dart, php, ts, js, json, bash), code text (monospace textarea with live highlighted preview), visible toggle.
- FR-C5: Hero roles are a repeatable list (add, remove, reorder).
- FR-C6: "Live preview" panel on hero, about and project editors: shows the section rendered with current (unsaved) form values using the same public components.
- FR-C7: After any save, call `revalidatePath('/')` (and `/sitemap.xml` where relevant) so the public site updates immediately.
- FR-C8: Hidden projects (`visible = false`) do not appear on the public site but stay in the admin list with a "Hidden" badge.

### 6.3 Contact form and messages
- FR-M1: Public contact form: name, email, message. Zod validated, max 2000 chars.
- FR-M2: Spam protection: honeypot field plus rate limit of 3 submissions per hour per IP. (Cloudflare Turnstile is an optional upgrade.)
- FR-M3: Save to `Message`. If `RESEND_API_KEY` is set, email the admin.
- FR-M4: `/admin/messages` shows a list with unread highlight, detail view, mark read or unread, delete, and a "Reply by email" mailto button.
- FR-M5: Dashboard shows the unread count.

### 6.4 Settings and SEO
- FR-S1: `generateMetadata` uses `SiteSettings` (title, description, OG image).
- FR-S2: Accent color pickers for light and dark. Output them into CSS variables at render time. Validate as 6-digit hex. Show a contrast warning if the accent on white or navy is below 4.5:1.
- FR-S3: Generate `sitemap.xml` and `robots.txt`.

### 6.5 Public site
- FR-P1: Render entirely from the database. No hardcoded content in components.
- FR-P2: Pixel-faithful to `portfolio-v6.html` at 375px, 768px and 1440px.
- FR-P3: Lighthouse targets on the production build: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.
- FR-P4: Sections with no data (for example zero visible projects) hide gracefully.

---

## 7. Non-functional requirements

- **Security:** Zod on all inputs. Prisma only (no raw SQL). Security headers (CSP, X-Frame-Options, Referrer-Policy) in `next.config`. Never expose `passwordHash`. Env secrets only in environment variables. All admin actions are server-side authorized.
- **Accessibility:** WCAG 2.1 AA. Visible keyboard focus everywhere. Forms have labels. Dialogs trap focus. Animations respect reduced motion.
- **Performance:** Public page is statically generated and revalidated on demand. Fonts via `next/font` (Sora). Images via `next/image`.
- **Reliability:** All multi-row writes (reorder, seed) use Prisma transactions.
- **Code quality:** TypeScript strict, ESLint and Prettier clean, no `any`, no unused code.

---

## 8. Project structure

```
/app
  /(public)/page.tsx
  /(public)/sitemap.ts
  /admin
    /layout.tsx            (auth guard, sidebar)
    /login/page.tsx
    /page.tsx              (dashboard)
    /hero /about /projects /tech /process /stats /contact /messages /settings
  /api/contact/route.ts    (public contact form)
  /api/auth/[...nextauth]/route.ts
/components
  /public  (Hero, Marquee, About, Projects, Process, Stats, Contact, CodeCard, Reveal, ProgressBar)
  /admin   (Sidebar, SortableList, ChipInput, CodeEditor, PreviewPane, ConfirmDialog, Toast)
  /ui      (shadcn primitives)
/lib  (db.ts, auth.ts, validators.ts, highlight.ts, revalidate.ts, rateLimit.ts, markdown-lite.ts)
/prisma (schema.prisma, seed.ts)
```

---

## 9. Seed data

`prisma/seed.ts` MUST create the admin user from env vars and fill the database with the current content so the site looks identical on first run. Extract the content from `portfolio-v6.html`. Summary:

- **Settings:** title "Faraz Hassan | Full Stack Developer", badge "Available for new projects".
- **Hero:** lines "Hi, I'm Faraz." / "I build apps" / "people love."; roles: Flutter developer, Full stack developer, Mobile app builder, Problem solver; lead text and CTAs as in the HTML; code card `ride_provider.dart` (Riverpod and Pusher snippet).
- **About:** tag "About me", heading "I care about how it works and how it feels.", two paragraphs, five facts (Role, Mobile, Web, Real-time, Based in).
- **Projects (in order):** EasyGo, Washhouse, ZenVPN, Hex Headwear, each with description, four or three features, tags and its code snippet from the HTML.
- **Tech:** Flutter, Next.js, WordPress, Android, Riverpod, Laravel, Firebase, GetX, WooCommerce, Pusher.
- **Process:** Understand, Build, Ship and support.
- **Stats:** 4+ Major projects, 2+ Years of experience, 3 Stacks, 6 Core technologies.
- **Contact:** heading "Let's build something great.", email `faraz.hassan@example.com` (placeholder, owner will change in admin), social links GitHub, LinkedIn (placeholder URLs), footer texts.

The seed must be idempotent (safe to run twice).

---

## 10. Environment variables

```
DATABASE_URL=
AUTH_SECRET=            # openssl rand -base64 32
AUTH_URL=               # site URL
ADMIN_EMAIL=
ADMIN_PASSWORD=         # used only by the seed script
RESEND_API_KEY=         # optional
CONTACT_NOTIFY_EMAIL=   # optional
```

Provide `.env.example` with these keys and no real values.

---

## 11. Build order (milestones)

Complete and verify each milestone before starting the next.

1. **M1 Foundation:** Next.js + TS + Tailwind + Prisma, schema, migrations, seed, design tokens, Sora font.
2. **M2 Public site:** port the full `portfolio-v6.html` into components reading from the DB. Include all animations. Verify it matches the reference visually.
3. **M3 Auth:** login page, Auth.js config, session checks, admin layout and sidebar, rate limit.
4. **M4 Admin CRUD:** hero, about, tech, process, stats, contact and social links, settings. Revalidation on save.
5. **M5 Projects manager:** list with drag reorder and visibility toggle, editor with live code preview, Shiki highlighting.
6. **M6 Contact and messages:** public form, spam protection, inbox, dashboard counts, optional email.
7. **M7 Polish and QA:** SEO (metadata, sitemap, robots), live preview panes, accessibility pass, mobile admin, Lighthouse, README.

---

## 12. Acceptance criteria (definition of done)

- [ ] `npm run dev` after `npm i`, migrate and seed shows a public site visually identical to `portfolio-v6.html`.
- [ ] `npm run visual-diff` passes all 6 comparisons (375, 768, 1440 px, light and dark) with under 2% pixel difference.
- [ ] All animation timings in section 4.1 match, verified by watching both pages side by side.
- [ ] Logging in at `/admin/login` works. A wrong password shows a generic error. Six fast failures are rate limited.
- [ ] Visiting `/admin` logged out redirects to login. Calling an admin server action without a session fails.
- [ ] Editing hero text and saving updates the public site within 2 seconds on refresh.
- [ ] Adding, reordering, hiding and deleting a project works and is reflected publicly.
- [ ] Code snippets render highlighted on the public site and are never rendered as raw HTML.
- [ ] Contact form stores a message, it appears in `/admin/messages`, the unread count shows on the dashboard.
- [ ] Changing the accent color in settings changes the public site in both themes.
- [ ] No gradients exist anywhere in the CSS.
- [ ] Admin works at 375px width. Keyboard-only use is possible for every form and list.
- [ ] `npm run build`, `npm run lint` and `tsc --noEmit` pass with zero errors.
- [ ] README explains local setup, env vars, seeding, and deploying to Vercel with Neon.

---

## 13. Instructions to the agent

1. Read this whole file and `portfolio-v6.html` before writing code.
2. Do not add features, libraries or sections that are not listed here. If something is ambiguous, choose the simplest option that satisfies the acceptance criteria and note the decision in `DECISIONS.md`.
3. Never hardcode content in public components. Everything comes from the database.
4. After each milestone, run build, lint and type-check, and fix errors before continuing.
5. Finish with a short report: what was built, how to run it, and any placeholders the owner must replace (email, social URLs).
