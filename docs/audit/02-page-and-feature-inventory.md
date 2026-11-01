# SkoolFinder Ghana — Complete Website & Feature Inventory

**Document ID:** `AUDIT-02`  
**Date:** 2026-11-01  
**Auditors:** Principal Frontend Engineer, Senior Full-Stack Architect & SaaS Product Manager  
**Branch:** `audit/frontend-review`  
**Target Market:** Ghana (Greater Accra: Accra, Tema, East Legon, Spintex; Ashanti: Kumasi, Ahodwo, Nhyiaeso)

---

## 1. Route & Page Inventory

Below is an exhaustive register of every route, page view, purpose, intended persona, implementation status, and observed technical characteristics.

| # | Route / Hash | View Component | Primary Persona | Implementation Status | Technical Observation & UX State | Source Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `/` or `#/home` | `HomeView` | All / Parents | **Implemented & Working** | Hero slideshow, suburb search form, 5-portal cards, metrics strip, featured schools. **Bug:** Metrics show `undefined+` due to API property mismatch (`schoolsCount` vs `totalSchools`). | `public/js/views/homeView.js`<br>`public/js/app.js` |
| **02** | `#/directory` | `DirectoryView` | Parents / Public | **Implemented & Working** | Dual view (Cards vs Leaflet Map). 6 facet filters. **Bug:** Live typing in quick search triggers full re-render, destroying input focus every 350ms. Facility checkbox filter overwrites single selection. | `public/js/views/directoryView.js` |
| **03** | `#/school-detail/:id` | `SchoolDetailView` | Parents / School Heads | **Implemented & Working** | Institutional profile, 360° virtual tour stage, termly fee estimator, online admission application modal, WhatsApp lead gate, reviews breakdown. Hardened with in-memory fallback. | `public/js/views/schoolDetailView.js` |
| **04** | `#/compare` | `CompareView` | Parents | **Implemented & Working** | Side-by-side comparison matrix for up to 3 schools across 12 dimensions (curriculum, fees, class sizes, boarding, facilities, etc.). Floating counter bar updates reactively. | `public/js/views/compareView.js` |
| **05** | `/parents` | `ParentPortalView` | Parents | **Implemented & Working** | Family Hub with 6 tabs: Ward management, fee payment via MoMo (Paystack), live bus route tracking beacon, student digital ID pass, academic report cards, tutor hiring desk. | `public/js/views/parentPortalView.js` |
| **06** | `/teachers` | `TeachersView` | Teachers & Tutors | **Implemented & Working** | Private tutor directory, NTC license verification badge, hourly rate filter, lesson booking modal, job vacancy board, professional profile registration. | `public/js/views/teachersView.js` |
| **07** | `/suppliers` | `SuppliersView` | Institutional B2B Vendors | **Implemented & Working** | Procurement catalog, category filtering (Uniforms, Lab Equipment, Desks, Books), live RFQ board, vendor registration modal, quote bidding form. | `public/js/views/suppliersView.js` |
| **08** | `/schools` | `DashboardView` | School Owners & Principals | **Implemented & Working** | Comprehensive School Management OS: Campus overview, Admissions inbox, Bursar fee invoices, Transport fleet tracker, Clinic / Sickbay log, Library loans, SMS broadcast engine. | `public/js/views/dashboardView.js` |
| **09** | `/admin` | `AdminView` | Super Administrators | **Implemented & Working** | Regulatory & platform console: NaSIA school claim verification, audit trail, user ban/unban toggles, subscription revenue metrics, platform telemetry. Route-guarded. | `public/js/views/adminView.js` |
| **10** | `#/cssps` | `CSSPSView` | JHS Parents & Students | **Implemented & Working** | Computerized School Selection & Placement System tool: BECE aggregate calculator, raw score converter, Category A/B/C school placement predictor. | `public/js/views/csspsView.js` |
| **11** | `#/resources` | `ResourcesView` | Students & Teachers | **Implemented & Working** | Academic past papers archive (BECE, WASSCE, Cambridge IGCSE), interactive mock examination engine with timer and instant automated score grading. | `public/js/views/resourcesView.js` |
| **12** | `#/jobs` | `JobsView` | Educators & Schools | **Partially Implemented** | Redirects / aliases to `/teachers` in `App.navigate()`. Standalone view exists in codebase but acts as duplicate of Teachers view. Recommend deprecating in favor of unified `/teachers`. | `public/js/views/jobsView.js` |
| **13** | (404 Fallback) | `App.navigate` Catch | All | **Implemented & Defective** | Catches unhandled routes and displays error card with "Return Home" button. Lacks proper HTTP 404 status header on client side and misses search recovery suggestions. | `public/js/app.js` (lines 130-138) |

---

## 2. Interactive Dialog & Modal Register

All modals are dynamically injected into `#modal-backdrop` via `public/js/components/modals.js`:

| Modal ID / Function | Purpose | Implementation Status | Observations |
| :--- | :--- | :--- | :--- |
| `openLoginModal` | Authentication (Email/Password & Ghana SMS OTP) | Implemented & Working | Dual tabs (Sign In vs Sign Up). Role selection dropdown. SMS OTP mock/live switch. |
| `openClaimSchoolModal` | Head of School verification claim | Implemented & Working | Official role, phone, GES registration number verification form. |
| `openInquireAdmissionModal` | General admissions inquiry & tour booking | Implemented & Working | Logs lead directly to database; generates tracking ref code. |
| `openOnlineAdmissionModal` | Multi-step formal application dossier | Implemented & Working | Child bio, prior school records, medical declarations, parent identification. |
| `openPaystackCheckoutModal` | MoMo payment for vouchers, fees & subs | Implemented & Working | Mock/Live Paystack wrapper with MTN, Telecel, AT channels. |
| `openFeePaymentModal` | Parent tuition fee settlement | Implemented & Working | Displays invoice line items and triggers MoMo push prompt. |
| `openCreateInvoiceModal` | School Bursar invoicing | Implemented & Working | Term tuition, PTA dues, ICT levy, bus shuttle itemization. |
| `openDigitalIDCardModal` | Student biometric smart card pass | Implemented & Working | QR code scanner verification, blood group, emergency contact. |
| `openBusRouteTrackerModal` | Live school bus GPS & delay beacon | Implemented & Working | Leaflet route visualizer, simulated transit waypoints, parent SMS delay broadcast. |
| `openReportCardModal` | Terminal examination report sheet | Implemented & Working | Subject grades, teacher comments, conduct mark, printable `@media print` layout. |
| `openPostRFQModal` | School procurement request for quote | Implemented & Working | Item specification, delivery timeline, budget band, supplier category selector. |
| `openSubmitQuoteModal` | Supplier quotation submission | Implemented & Working | Unit pricing, tax, warranty, sample delivery checkbox. |
| `openTeacherSubscribeModal` | Tutor premium listing subscription | Implemented & Working | Tier selection (Free Basic vs Pro Tutor GH₵ 80/mo). |
| `openRoleTourModal` | 30-second guided onboarding | Implemented & Working | Interactive 4-step wizard explaining benefits for Parents, Schools, Teachers, Suppliers. |
| `openPolicyModal` | Privacy, Terms, and NaSIA Guidelines | Implemented & Working | Full legal disclaimers, data protection act compliance statement, NaSIA standards. |

---

## 3. Persistent Client Components

1. **Site Header (`Navbar`):**
   - Brand logo, directory discovery link, 5-portal dropdown panel, comparison counter pill, theme toggle (Light / Scholastic Midnight Dark Mode), responsive hamburger drawer.
2. **Site Footer (`Footer`):**
   - Brand mission statement, regional quick links (Accra / Kumasi), portal navigation, school proprietor onboarding links, copyright & policy modal triggers.
3. **Floating Comparison Bar (`State.renderComparisonBar`):**
   - Fixed bottom dock activated whenever 1 to 3 schools are selected for comparison. Provides instant access to `#/compare`.
4. **Admissions AI Chatbot (`AIChatbot` / Akosua AI):**
   - Floating Action Button (FAB) anchored bottom-right. Offers pre-programmed quick chips (Find Cambridge Schools, CSSPS Calculator, How to Pay Fees) and contextual query responses.

---

## 4. Unfinished & Placeholder Functionality Identified

1. **Homepage Metric Counts:** Shows `undefined+` because `HomeView` requests properties (`stats.totalSchools`, `stats.totalLeadsLogged`, `stats.totalSuppliers`) that do not match the backend API's response schema (`schoolsCount`, `teachersCount`, `suppliersCount`).
2. **Service Worker Offline Cache:** `public/sw.js` activates and claims clients, but contains no asset manifest or cache population logic; offline requests fail.
3. **PWA Mobile App Icons:** `public/manifest.json` points to `/assets/images/campus_hero.jpg` (a 1MB landscape photo) instead of dedicated square 192x192 and 512x512 app icons.
4. **Dynamic Title & OpenGraph Meta Tags:** Page transitions do not update `document.title` or `<meta property="og:title">`, causing WhatsApp social shares of specific school links to display generic homepage metadata.

