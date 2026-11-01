# SkoolFinder Ghana — Project Technology Inventory & Architecture Audit

**Document ID:** `AUDIT-01`  
**Date:** 2026-11-01  
**Auditors:** Principal Frontend Engineer & Senior Full-Stack Architect  
**Branch:** `audit/frontend-review`  
**Environment:** Node.js v20.x, Express v4.21.2, Supabase PostgreSQL, Vercel Serverless

---

## 1. Executive Summary of Tech Stack

SkoolFinder Ghana is structured as a **Vanilla JavaScript Single-Page Application (SPA)** on the frontend, served by an **Express.js API server** and deployed serverlessly to **Vercel** via `@vercel/node`. The persistence layer is powered by **Supabase PostgreSQL** with 13 core relational tables and active Row-Level Security (RLS) policies.

```
                           +-----------------------------------------------+
                           |               Vercel Edge / CDN               |
                           +-----------------------------------------------+
                                      |                         |
                               (Static Assets)            (API Requests)
                                      v                         v
                           +--------------------+    +---------------------+
                           |  public/           |    |  api/index.js       |
                           |  - index.html      |    |  (Express Serverless|
                           |  - js/ (18 scripts)|    |   Bridge)           |
                           |  - css/ (2 sheets) |    +---------------------+
                           |  - assets/ (images)|               |
                           +--------------------+               v
                                                     +---------------------+
                                                     |  src/routes/*.js    |
                                                     |  - auth, schools,   |
                                                     |    teachers, etc.   |
                                                     +---------------------+
                                                                |
                                                                v
                                                     +---------------------+
                                                     | Supabase PostgreSQL |
                                                     | (13 Tables, RLS)    |
                                                     +---------------------+
```

---

## 2. Frontend Technology Stack Breakdown

| Layer | Implementation | File / Directory | Observations / Architectural Assessment |
| :--- | :--- | :--- | :--- |
| **Framework** | Vanilla JavaScript (ES6+ Classes & Object Modules) | `public/js/` | Zero build-step / bundling. Directly loaded via HTML script tags. Fast local editing but suffers from high HTTP request overhead and no tree-shaking. |
| **Routing** | Custom Client-Side Router | `public/js/app.js` (`App.navigate`) | Hybrid routing: path-based for 5 portals (`/parents`, `/teachers`, `/suppliers`, `/schools`, `/admin`) and hash-based for secondary views (`#/directory`, `#/cssps`). Employs `window.history.pushState` and `window.addEventListener('popstate')`. |
| **State Management** | Central Reactive Singleton | `public/js/state.js` (`State`) | Custom observable singleton synchronised with browser `localStorage` (`skoolfinder_user`, `skoolfinder_token`, `skoolfinder_bookmarks`, `skoolfinder_theme`). Max 3 comparison schools. |
| **Styling Solution** | Vanilla CSS with Custom Properties | `public/css/style.css`<br>`public/css/components.css` | Comprehensive CSS variables (`--primary-900`, `--gold-500`, etc.) and full Dark Mode (`data-theme="dark"`). However, lacks CSS scoping and contains scattered inline style overrides. |
| **Mapping & GIS** | Leaflet 1.9.4 & OpenStreetMap | `public/js/views/directoryView.js` | Loaded via unpkg CDN. Custom pins for Greater Accra and Kumasi. Fallback GPS coordinates provided. |
| **Typography** | Google Fonts | `@import` in `public/css/style.css` | Plus Jakarta Sans (body) and Outfit (headings). Render-blocking CSS `@import` cascade. |
| **PWA / Service Worker** | Custom Cache-First SW | `public/manifest.json`<br>`public/sw.js` | Manifest references heavy JPEG hero photo rather than vector icons. Service Worker activates but caches zero files upfront. |
| **Icons & Media** | SVG Inline & Raw JPEGs | `public/assets/images/` | 5 high-resolution photography files total >5MB. Served as raw JPEGs without responsive WebP/AVIF alternates. |

---

## 3. Frontend Entry Points & View Architecture

The application loads via a single HTML entry point: `public/index.html`. It mounts views into three structural containers:
1. `#header-root` — Handled dynamically by `Navbar.render()` and `Navbar.attachEvents()`.
2. `#main-root` — Dynamically updated on every route transition by `App.navigate()`.
3. `#footer-root` — Rendered by `Footer.render()` and `Footer.attachEvents()`.

### Modular View Register:
- `HomeView` (`public/js/views/homeView.js` - 38.5 KB): Hero carousel, suburb search widget, metrics strip, 5-portal introduction cards, featured schools list.
- `DirectoryView` (`public/js/views/directoryView.js` - 17.5 KB): Dual-mode (Cards vs Leaflet Map), 6 facet filters (region, suburb, level, curriculum, boarding, fee band, amenities).
- `SchoolDetailView` (`public/js/views/schoolDetailView.js` - 55 KB): Institutional showcase, 360° virtual tour stage, termly fee calculator, WhatsApp lead gate, admissions voucher checkout.
- `CompareView` (`public/js/views/compareView.js` - 10.4 KB): Matrix comparing up to 3 institutions across 12 educational dimensions.
- `SuppliersView` (`public/js/views/suppliersView.js` - 12.5 KB): B2B institutional procurement directory, RFQ bidding board, quotation submission modal.
- `JobsView` (`public/js/views/jobsView.js` - 21.2 KB): Teacher job vacancies, NTC vetting submission, school hiring workflow.
- `DashboardView` (`public/js/views/dashboardView.js` - 201 KB): Complete School Management OS (Bursar, Admissions, Transport fleet, Sickbay clinic, Library loans, Report cards).
- `CSSPSView` (`public/js/views/csspsView.js` - 50.5 KB): BECE aggregate calculator, SHS Category A/B/C predictive placement algorithm.
- `ResourcesView` (`public/js/views/resourcesView.js` - 30.6 KB): Academic past papers, Cambridge CIE & BECE practice papers, interactive digital test mock engine.
- `ParentPortalView` (`public/js/views/parentPortalView.js` - 189.5 KB): Family hub, student digital ID pass, live school bus tracker, MoMo tuition fee settlement.
- `TeachersView` (`public/js/views/teachersView.js` - 42.8 KB): Verified private tutor marketplace, hourly lesson booking, NTC license directory.
- `AdminView` (`public/js/views/adminView.js` - 60.4 KB): Regulatory oversight console, NaSIA/GES school claim verification, audit trail logging.
- `Modals` (`public/js/components/modals.js` - ~320 KB / 10,368 lines): 35+ modal workflows including Paystack checkout, inquiry threads, and digital student passes.
- `AIChatbot` (`public/js/components/chatbot.js` - 17.5 KB): "Akosua AI" virtual admissions assistant with rule-based heuristics and backend fallback.

---

## 4. Backend APIs & Cloud Integrations

The Express backend connects the frontend to three major third-party services:

1. **Supabase PostgreSQL & Auth:**
   - URL: Configured via `SUPABASE_URL`
   - Key: Configured via `SUPABASE_SERVICE_ROLE_KEY` (hardened backend admin key)
   - Connection status: Verified active and writing to `public.email_logs`, `public.schools`, `public.inquiries`.
2. **Paystack Payment Gateway:**
   - Secret Key: Configured via `PAYSTACK_SECRET_KEY`
   - Currency: GH₵ (Ghanaian Cedi)
   - Channels: MTN Mobile Money, Telecel Cash, AT Money, Visa/Mastercard.
3. **Transactional Email (Resend / Nodemailer):**
   - Service: Dual-provider fallback in `src/services/emailService.js`.
   - Verified audit: Inquiries generate persistent confirmation logs.

---

## 5. Build, Test, and Quality Assurance Status

- **Build Pipeline:** None. The application operates in unbundled script mode. Changes to JS and CSS are served directly by Express static middleware.
- **Linting Rules:** No `.eslintrc` or Prettier configuration in the repository.
- **Automated Tests:** No unit or integration test runner (e.g. Jest, Vitest, Playwright, or Cypress) is configured in `package.json`.
- **Environment Handling:** Configured via `.env` with a sanitized reference template in `.env.example`. Secrets are kept out of source control.
- **Static Asset Caching:** Assets are served with version query strings (`?v=25`), but lack content-hash cache busting.

---

## 6. Architectural Risk Assessment

1. **High Script Overhead:** 18 `<script>` tags loaded synchronously on the initial HTML parse creates render blocking and 1.1MB+ uncompressed execution overhead.
2. **Missing Input Sanitization in Template Literals:** Direct string interpolation into `.innerHTML` throughout 147 UI locations presents XSS risks if malicious content is entered into reviews or inquiry notes.
3. **No Bundle Splitting:** Complex modules like the 201KB School Dashboard and 190KB Parent Portal are loaded on the public landing page even for first-time casual visitors.
4. **Missing Offline Cache Strategy:** Service Worker activates but precaches no shell assets, resulting in network errors when mobile data drops.
