# SkoolFinder Ghana — Visual Design & UI System Audit

**Document ID:** `AUDIT-03`  
**Date:** 2026-11-01  
**Auditor:** UI/UX Design Director  
**Branch:** `audit/frontend-review`  
**Target Audience:** Parents, Educators, Institutional Proprietors & Regulators in Ghana

---

## 1. Visual Identity & Brand System

### 1.1 Color Palette & Semantic Tokens
The visual identity is anchored on **"Scholastic Navy & Academic Amber"**, conveying institutional prestige and scholastic authority:

- **Primary Navy:** `#0a1128` (Primary-900), `#132959` (Primary-700), `#1b3a7a` (Primary-600)
- **Academic Amber / Gold:** `#f59e0b` (Gold-500), `#d97706` (Gold-600), `#b45309` (Gold-700)
- **Status Emerald:** `#10b981` (Emerald-500), `#059669` (Emerald-600)
- **Direct WhatsApp:** `#25d366` / `#128c7e`
- **Scholastic Midnight Dark Mode:** `--bg-main: #060b18`, `--bg-surface: #0b152d`, `--bg-surface-elevated: #111e3f`

### 1.2 Identified Visual Deficiencies
1. **White-on-Gold Contrast Failure:**  
   The primary call-to-action button `.btn-gold` employs white text (`#ffffff`) over a gold gradient (`#f59e0b` to `#d97706`). The resulting contrast ratio is **2.4:1**, significantly below the WCAG AA minimum requirement of 4.5:1. In bright Ghanaian sunlight on mobile screens, text like "New Parent Sign Up" or "Buy Admission Voucher" suffers from poor legibility.
2. **Dark Mode Text Clipping & Contrast in Subtle Badges:**  
   Some badges in dark mode utilize light backgrounds with faded colored text (e.g. `.badge-ges` with `#fefce8` background and `#a16207` text), causing glaring white boxes against dark backgrounds (`#060b18`).
3. **Favicon & Brand Icon Consistency:**  
   The browser favicon is rendered via a data URI graduation cap emoji (`🎓`), whereas the header logo uses an SVG mortarboard icon with custom path strokes. There is no high-resolution PNG/SVG brand logo file hosted in `public/assets/`.

---

## 2. Typography & Text Hierarchy

| Element | Font Family | Size | Weight | Line Height | Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero)** | Outfit | 2.75rem (Desktop) / 2.0rem (Mobile) | 800 | 1.15 | Strong, authoritative, excellent character spacing. |
| **H2 / H3 (Section)** | Outfit | 1.5rem – 2.0rem | 700 / 800 | 1.25 | Clear hierarchy; cleanly delineates content sections. |
| **Body Text** | Plus Jakarta Sans | 0.95rem – 1.0rem | 400 / 500 | 1.65 | Highly legible sans-serif for long-form school descriptions. |
| **Badges & Meta** | Plus Jakarta Sans | 0.72rem – 0.82rem | 600 / 700 | 1.0 | Compact, but some badges fall below the 12px readability threshold on low-DPI displays. |

### Typography Deficiencies:
- **Render-Blocking Font Loading:** Google Fonts are loaded via `@import url(...)` at the top of `public/css/style.css` rather than `<link rel="preload">` in `index.html`. This introduces an extra network roundtrip before typography renders, causing a noticeable Flash of Unstyled Text (FOUT) on slow 3G mobile connections.

---

## 3. Layout, Alignment & Spacing

### 3.1 Grid Structure
The site uses a responsive container with max-width `1280px` and standard padding `1.5rem`.
- **Homepage:** Hero crossfade banner -> metrics strip -> 5-portal introduction cards -> featured schools grid. Layout rhythm is well-balanced.
- **Directory:** 2-column layout (sidebar filter 280px, schools grid 1fr). On screens between 640px and 992px, the filter sidebar snaps to full-width above the grid, which creates vertical scroll fatigue before viewing schools.
- **School Detail:** 2-column showcase (2fr main profile, 1fr sticky contact box). The action box has 6 stacked vertical buttons, which looks cluttered on smaller laptop viewports.

---

## 4. Reusable Component Evaluation

### 4.1 Buttons & Interactive Controls
- `.btn-pill`: Modern rounded aesthetic (`border-radius: 9999px`), good hover transition (`0.2s cubic-bezier(0.4, 0, 0.2, 1)`).
- **Missing Disabled & Loading States:** When forms submit (e.g. Claim School, Submit RFQ, Post Review), buttons do not morph into a loading spinner or disable themselves, permitting rapid repeated clicks.

### 4.2 School Cards (`.school-card-enhanced`)
- **Card Design:** Luminous card design with hover elevation (`transform: translateY(-8px)`), rounded corners (`18px`), image carousel preview, verified badges, fee badge, and bottom action strip (View Profile, WhatsApp, Compare).
- **Inconsistency:** The price band badge is pinned top-right on the image, occasionally colliding with the admissions status pill on narrow card widths.

### 4.3 Modals & Drawers (`.modal-dialog`)
- **Visual Design:** Clean white surface, rounded header, drop shadow.
- **Deficiency:** Large modals (e.g. `openOnlineAdmissionModal` with 4 steps) lack a sticky progress indicator, so users cannot easily gauge how much of the form remains.

---

## 5. Visual Assets & Media Performance

1. **Asset Dimensions vs Display Size:**
   - `campus_hero.jpg`: 1920x1080 JPEG at **1,033 KB**.
   - `montessori_class.jpg`: 1920x1080 JPEG at **973 KB**.
   - `robotics_lab.jpg`: 1920x1080 JPEG at **934 KB**.
   - `science_lab.jpg`: 1920x1080 JPEG at **936 KB**.
   - `sports_complex.jpg`: 1920x1080 JPEG at **1,144 KB**.
   - **Total:** ~5.02 MB of photography assets loaded on homepage initialization.
2. **Missing Modern Formats:**
   - None of the assets are compressed into `.webp` or `.avif`. Compressed WebP versions could reduce the total payload to under **650 KB** (an 87% reduction).
3. **Cumulative Layout Shift (CLS):**
   - Images in the school cards and virtual tour lack explicit `width` and `height` attributes, leading to layout shifts while images stream across cellular connections.

---

## 6. Recommendations & Design System Improvements

1. **Fix Color Contrast:** Update `.btn-gold` text color from `#ffffff` to dark scholastic navy (`#0a1128`) with `font-weight: 800`. This increases contrast from 2.4:1 to **8.9:1**, exceeding WCAG AAA standards.
2. **WebP Image Pipeline:** Compress and convert all five photographic assets into `.webp` format and implement responsive `<picture>` tags with `srcset`.
3. **Preload Typography:** Move Google Fonts imports from CSS into `<link rel="preconnect">` and `<link rel="preload">` in `index.html`.
4. **Button Loading States:** Implement a uniform `.btn-loading` state across all modals and form submissions.

