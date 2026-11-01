# SkoolFinder Ghana — Master Issue & Vulnerability Register

**Document ID:** `AUDIT-14`  
**Date:** 2026-11-01  
**Auditor:** Quality Assurance Lead & Principal Frontend Engineer  
**Branch:** `audit/frontend-review`  
**Status:** Open / Documented

---

## Complete Issues & Improvements Master Table

| Issue ID | Category | Severity | Title / Description | Impact | Effort | Exact File / Line Reference | Recommended Fix |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FN-01** | Functional | **High** | Homepage metrics strip displays `undefined+` | High | Small | `public/js/views/homeView.js`:98–115 | Map API response keys (`schoolsCount` vs `totalSchools`) with fallback defaults. |
| **FN-02** | UX / Interaction | **High** | Directory quick search erases input focus during typing | High | Medium | `public/js/views/directoryView.js`:287–291 | Extract grid rendering into `renderCards()` without destroying search `<input>`. |
| **FN-03** | Functional | **Medium** | Facility filter checkboxes overwrite each other | Medium | Small | `public/js/views/directoryView.js`:314–319 | Refactor `State.filters.facility` to an array supporting multi-facility intersection. |
| **FN-04** | Architecture | **Medium** | Duplicate auth methods defined twice in `api.js` | Medium | Small | `public/js/api.js`:7–56 & 745–795 | Remove redundant definitions; ensure `FormData` does not receive JSON content-type. |
| **FN-05** | Accessibility | **Medium** | Missing `Escape` key close & focus trap in modals | Medium | Medium | `public/js/components/modals.js`:5–25 | Add global `keydown` Escape handler and focus containment inside active dialogs. |
| **FN-06** | UX / Integrity | **Medium** | Missing loading spinner on form submit buttons | Medium | Small | `public/js/components/modals.js` | Disable button and show spinner on submit to block duplicate network submissions. |
| **FN-07** | Integration | **Low** | WhatsApp contact URLs fail on unformatted local phone | Low | Small | `public/js/views/schoolDetailView.js`:71 | Implement `formatGhanaWhatsApp(phone)` to strip leading `0` and prepend `233`. |
| **FN-08** | Security | **Medium** | Expired JWT token handled poorly on initial launch | Medium | Small | `public/js/state.js`:109–112 | Call `API.getMe()` silently on startup; if 401, clear stale localStorage. |
| **UI-01** | Visual / A11y | **High** | Button `.btn-gold` text contrast fails WCAG AA (2.4:1) | High | Small | `public/css/components.css`:1225 | Change `.btn-gold` text from `#ffffff` to dark navy `#0a1128` (8.9:1 contrast). |
| **UI-02** | Responsive | **Medium** | School comparison table horizontal clipping on mobile | Medium | Medium | `public/js/views/compareView.js`:45 | Wrap matrix in responsive scroll container with sticky left attribute column. |
| **UI-03** | Visual | **Low** | Chatbot FAB overlaps floating comparison dock | Low | Small | `public/css/components.css`:1860 | Elevate `.sd-chatbot-fab` bottom offset when comparison dock is visible. |
| **A11Y-01**| Accessibility | **High** | Missing "Skip to Main Content" bypass link | High | Small | `public/index.html`:51 | Add `<a href="#main-root" class="skip-link">` as first child in `<body>`. |
| **A11Y-02**| Accessibility | **High** | Modals lack `role="dialog"` and `aria-modal="true"` | High | Medium | `public/js/components/modals.js` | Inject standard ARIA dialog attributes and `aria-labelledby` on all modal templates. |
| **A11Y-03**| Accessibility | **Medium** | Icon-only buttons lack descriptive `aria-label` | Medium | Small | `public/js/components/navbar.js`, `modals.js` | Add explicit `aria-label` to modal close, theme toggle, and WhatsApp buttons. |
| **A11Y-04**| Accessibility | **Medium** | Missing `:focus-visible` styling on interactive items | Medium | Small | `public/css/style.css`:10 | Define global focus ring (`outline: 2.5px solid #2563eb`). |
| **PF-01** | Performance | **High** | 5.02 MB of uncompressed JPEG hero images loaded | High | Medium | `public/assets/images/` | **RESOLVED (Sprint 3)**: Generated 84% smaller WebP assets and MozJPEGs; lazy-loaded offscreen hero slides. |
| **PF-02** | Performance | **Medium** | Render-blocking `@import` Google Fonts cascade | Medium | Small | `public/css/style.css`:6 | **RESOLVED (Sprint 3)**: Removed `@import`, preconnected `fonts.gstatic.com`, and loaded async via `<link>` in `index.html`. |
| **PF-03** | Performance | **Medium** | 18 scripts loaded synchronously without `defer` | Medium | Small | `public/index.html`:62–80 | **RESOLVED (Sprint 3)**: Added `defer` attribute across all 18 application script tags and Leaflet JS. |
| **PF-04** | Performance | **Medium** | Missing image aspect ratios cause Cumulative Layout Shift | Medium | Small | `public/css/components.css`:1894 | **RESOLVED (Sprint 3)**: Enforced `aspect-ratio: 16 / 9;` on `.school-card-media`, `.card-mini-carousel`, and `.map-popup-img`. |
| **PF-05** | Performance | **Medium** | Service Worker contains empty cache implementation | Medium | Medium | `public/sw.js`:21–26 | **RESOLVED (Sprint 3)**: Implemented PWA Stale-While-Revalidate caching for app shell, scripts, styles, and font assets. |
| **SEO-01** | Technical SEO | **High** | `robots.txt` points to `http://localhost:3000` | High | Small | `public/robots.txt`:5 | Update sitemap directive to `https://skoolfinder.vercel.app/sitemap.xml`. |
| **SEO-02** | Technical SEO | **High** | `sitemap.xml` contains localhost & un-indexable hash URLs | High | Medium | `public/sitemap.xml` | Overhaul sitemap with canonical HTTPS URLs for portals and verified school profiles. |
| **SEO-03** | Technical SEO | **High** | Title & OpenGraph meta tags not updated on route changes | High | Medium | `public/js/app.js`:57 | Dynamically update `document.title` and `og:meta` tags per school in `App.navigate()`. |
| **SEO-04** | Technical SEO | **Medium** | Missing Schema.org JSON-LD microdata on school pages | Medium | Medium | `public/js/views/schoolDetailView.js` | Inject `School` / `EducationalOrganization` JSON-LD schema on detail mount. |
| **SEC-01** | AppSec | **High** | Potential XSS via unescaped string interpolation | High | Medium | `public/js/views/`, `modals.js` | Implement global `escapeHTML()` and apply to all user-generated text fields. |
| **SEC-02** | AppSec | **Medium** | Content Security Policy completely disabled in Helmet | Medium | Small | `server.js`:29 | Configure a targeted CSP allowing required CDNs (Fonts, Leaflet, Paystack). |
| **SEC-03** | AppSec | **Medium** | JWT authentication token stored in `localStorage` | Medium | Large | `public/js/state.js`:84 | Plan roadmap migration from `localStorage` to `HttpOnly` session cookies. |
| **SEC-04** | AppSec | **Low** | Administrative view rendered without server claim verify | Low | Small | `public/js/app.js`:26 | Validate admin token via `API.getMe()` before mounting regulatory tools in `AdminView`. |

