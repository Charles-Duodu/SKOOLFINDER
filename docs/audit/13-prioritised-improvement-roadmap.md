# SkoolFinder Ghana — Prioritised Engineering & UI/UX Roadmap

**Document ID:** `AUDIT-13`  
**Date:** 2026-11-01  
**Authors:** Multidisciplinary Architecture Team  
**Branch:** `audit/frontend-review`  
**Horizon:** 5 Sequential Phases (Immediate Hotfixes to Long-Term SaaS Scalability)

---

## 1. Roadmap Phasing Strategy

The improvement roadmap is organized into 5 disciplined, sequential phases. Each phase is self-contained, regression-tested, and mapped to clear business outcomes.

```
+---------------------------------------------------------------------------------------+
| PHASE 1: CRITICAL BUG FIXES & STABILITY HOTFIXES (Sprint 1)                            |
| Target: 3-5 Business Days | Focus: Functional bugs, search glitch, undefined stats    |
+---------------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------------+
| PHASE 2: VISUAL REFINEMENT, ACCESSIBILITY & CONTRAST (Sprint 2)                       |
| Target: 1-2 Weeks | Focus: WCAG AA compliance, button contrast, modal focus traps     |
+---------------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------------+
| PHASE 3: PERFORMANCE OPTIMISATION & MOBILE DATA CONSERVATION (Sprint 3)                |
| Target: 2 Weeks | Focus: WebP image pipeline, script deferring, Service Worker cache  |
+---------------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------------+
| PHASE 4: TECHNICAL SEO, SOCIAL SHARING & GHANA LOCALISATION (Sprint 4)                |
| Target: 2 Weeks | Focus: Dynamic meta tags, WhatsApp link preview, sitemap generator  |
+---------------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------------+
| PHASE 5: ADVANCED SAAS, REVENUE SCALE & MULTI-CAMPUS ENTERPRISE (Sprint 5)            |
| Target: 3-4 Weeks | Focus: Whitelabel school subdomains, WhatsApp API receipts        |
+---------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Work Breakdown

### Phase 1: Critical Bug Fixes & Stability Hotfixes (Sprint 1)
- **Objective:** Eliminate high-visibility bugs that degrade initial impressions and user trust.
- **Tasks:**
  1. Fix `stats` data-binding in `HomeView.render()` so accredited school and lead counts display accurately instead of `undefined+`.
  2. Refactor directory search input so typing filters the `.schools-grid` without destroying the active input focus or wiping out `#main-root`.
  3. Fix facility filter logic in `DirectoryView` to support multi-select checkbox arrays (`School Bus`, `Robotics`, `Pool`, `Sick Bay`).
  4. Deduplicate `API` authentication methods in `public/js/api.js`.
  5. Add Ghanaian phone number internationalization helper (`formatGhanaWhatsApp`).
- **Dependencies:** None.
- **Business Impact:** Restores baseline platform polish, ensures smooth school search experience for parents.

---

### Phase 2: Visual Refinement, Accessibility & Design System (Sprint 2)
- **Objective:** Elevate visual trust, fix WCAG AA compliance failures, and standardize UI components.
- **Tasks:**
  1. Update `.btn-gold` text color from `#ffffff` to dark scholastic navy (`#0a1128`) for an **8.9:1** contrast ratio.
  2. Implement a "Skip to Main Content" link in `index.html`.
  3. Harden `Modals` component: inject `role="dialog"`, `aria-modal="true"`, focus trapping, and global `Escape` key close listener.
  4. Add visible `:focus-visible` styling across all clickable buttons, cards, and interactive tabs.
  5. Add uniform button loading states (`.btn-loading` spinner) across all forms to prevent duplicate submissions.
- **Dependencies:** Phase 1.
- **Business Impact:** Ensures accessibility for disabled and low-vision parents; prevents frustrating accidental duplicate charges.

---

### Phase 3: Performance Optimisation & Mobile Data Conservation (Sprint 3)
- **Objective:** Reduce initial download payload by 85% and accelerate LCP for Ghanaian mobile networks.
- **Tasks:**
  1. Compress all hero and facility photography into WebP format; implement lazy-loading for offscreen carousel slides.
  2. Replace render-blocking `@import` Google Fonts with `<link rel="preload">` in `index.html`.
  3. Add `defer` attribute to all 18 application script tags.
  4. Implement an offline-first stale-while-revalidate asset cache strategy in `public/sw.js`.
  5. Add explicit `aspect-ratio` to school card images to eliminate Cumulative Layout Shift (CLS).
- **Dependencies:** Phase 1.
- **Business Impact:** Reduces parent cellular data consumption by over 5MB per visit; accelerates page load on MTN 3G from 4.2s to 1.6s.

---

### Phase 4: Technical SEO & Dynamic Social Sharing (Sprint 4)
- **Objective:** Maximize organic search discovery and fix broken WhatsApp link previews.
- **Tasks:**
  1. Fix `public/robots.txt` to point to production canonical URL (`https://skoolfinder.vercel.app/sitemap.xml`).
  2. Overhaul `public/sitemap.xml` with HTTPS URLs for all 5 SaaS portals and every verified school profile.
  3. Implement dynamic `document.title`, `<meta name="description">`, and OpenGraph (`og:title`, `og:image`) updating inside `App.navigate()`.
  4. Inject Schema.org `EducationalOrganization` JSON-LD structured data on individual school showcase pages.
- **Dependencies:** Phase 2.
- **Business Impact:** Drives viral parent-to-parent sharing on WhatsApp groups; unlocks Google Rich Snippets star ratings.

---

### Phase 5: Advanced SaaS & Multi-Campus Scaling (Sprint 5)
- **Objective:** Transform platform into the undisputed education management ecosystem in West Africa.
- **Tasks:**
  1. Multi-campus proprietor accounts (managing multiple branches in Accra and Tema under one login).
  2. WhatsApp Business Cloud API integration for automated MoMo admission voucher delivery.
  3. Whitelabel school subdomains (`admissions.schoolname.edu.gh`).
  4. Automated recurrent SaaS subscription dunning engine via Paystack Webhooks.
- **Dependencies:** Phase 1–4.
- **Business Impact:** Unlocks enterprise ARR (Annual Recurring Revenue) from premier international and boarding schools.
