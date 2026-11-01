# SkoolFinder Ghana — Web Performance & Core Web Vitals Audit

**Document ID:** `AUDIT-08`  
**Date:** 2026-11-01  
**Auditor:** Performance Optimisation Engineer  
**Branch:** `audit/frontend-review`  
**Network Profiles Tested:** Fast 4G, Slow 4G, Simulated 3G (Ghanaian MTN / Telecel Cellular Baseline)

---

## 1. Executive Performance Overview

The platform exhibits rapid execution once scripts are cached due to its lightweight Vanilla JS architecture. However, the initial unprimed load suffers from **heavy image payloads**, **render-blocking CDN scripts**, and **unbundled JavaScript script requests**, creating latency on mobile networks across Greater Accra and Kumasi.

### Core Web Vitals Snapshot (Simulated 4G Mobile):
- **Largest Contentful Paint (LCP):** **4.2s** (Poor — Threshold: <2.5s)
- **First Input Delay (FID) / INP:** **85ms** (Good — Threshold: <200ms)
- **Cumulative Layout Shift (CLS):** **0.28** (Poor — Threshold: <0.10)
- **Total Blocking Time (TBT):** **380ms** (Needs Improvement — Threshold: <200ms)
- **Speed Index:** **3.8s** (Needs Improvement)

**Overall Performance Score:** **68 / 100**

---

## 2. Resource Payload & Waterfall Analysis

```
[HTML]       index.html (5.4 KB)
  |-- [CSS]  Leaflet CSS (unpkg CDN - 14.8 KB) ............................ [Render Blocking]
  |-- [CSS]  style.css (23.7 KB) .......................................... [Render Blocking]
  |    |-- [@import] Google Fonts (Fonts API - 2.1 KB) ..................... [Cascade Delay]
  |-- [CSS]  components.css (50.8 KB) ..................................... [Render Blocking]
  |-- [JS]   Leaflet JS (unpkg CDN - 142 KB) .............................. [Blocks Parse]
  |-- [JS]   18 Application Scripts (api.js, state.js, views...) (~1.1 MB) . [18 HTTP Requests]
  |-- [IMG]  Hero Crossfade Slideshow (4 images) (~3.8 MB) ................ [Causes High LCP]
```

### Breakdown by Resource Type:
| Resource Type | Request Count | Uncompressed Size | Gzipped / Compressed Size | Impact on Initial Load |
| :--- | :--- | :--- | :--- | :--- |
| **Images (JPEGs)** | 5 | 5,019 KB | 5,019 KB | **Severe:** 5MB payload on initial homepage load. |
| **JavaScript** | 19 | 1,148 KB | ~290 KB | **Moderate:** 19 separate HTTP roundtrips; no bundle. |
| **CSS** | 3 | 89 KB | ~21 KB | **Low:** Manageable, but `@import` cascade blocks fonts. |
| **HTML** | 1 | 5.4 KB | ~1.8 KB | **Minimal:** Fast TTFB from Vercel Edge. |
| **Total Initial Payload** | **28** | **~6.26 MB** | **~5.33 MB** | **Exceeds recommended 1.5MB budget by 317%.** |

---

## 3. Deep-Dive Performance Bottlenecks

### 3.1 Uncompressed High-Resolution Hero Images (Primary LCP Culprit)
- **Root Cause:** Four 1920x1080 JPEG images (`campus_hero.jpg`, `science_lab.jpg`, `montessori_class.jpg`, `sports_complex.jpg`) are preloaded via inline CSS background properties in `HomeView.render()` lines 15–18.
- **Data Cost in Ghana:** For a parent on a 1GB/day MTN data bundle (GH₵ 15), loading the homepage once consumes ~5MB of mobile data.
- **Remediation:**
  1. Convert all hero and campus images to compressed **WebP format** (target size: 80–120 KB per image).
  2. Implement lazy-loading for slides 2, 3, and 4 so that only the first hero slide (`campus_hero.webp`) loads synchronously during initial paint.

### 3.2 Render-Blocking `@import` Font Cascade
- **Root Cause:** `public/css/style.css` begins with:
  `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans...&family=Outfit...');`
- **Waterfall Impact:** The browser downloads `style.css`, discovers `@import`, pauses CSS OM construction, contacts `fonts.googleapis.com`, downloads the font CSS, and then requests the `.woff2` font files.
- **Remediation:** Replace `@import` with preconnect links in `public/index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
  ```

### 3.3 Synchronous 18 Script Waterfall
- **Root Cause:** `public/index.html` loads 18 JavaScript files synchronously before the closing `</body>` tag without `defer`.
- **Remediation:** Add `defer` attribute to all `<script>` tags, or concatenate into three logical bundles (`core.min.js`, `views.min.js`, `portals.min.js`).

### 3.4 Cumulative Layout Shift (CLS: 0.28)
- **Root Cause:** School card banners and virtual tour images in `public/js/views/` lack explicit `aspect-ratio` or `width`/`height` dimensions in HTML. As images download, the container expands abruptly, pushing school information downward.
- **Remediation:** Add `aspect-ratio: 16 / 9;` and `width: 100%;` to `.school-card-banner` and `.card-mini-carousel` in CSS.

### 3.5 Service Worker Cache Strategy
- **Root Cause:** `public/sw.js` activates and claims clients, but contains no asset manifest or cache population logic (`caches.match()` always returns empty).
- **Remediation:** Implement a stale-while-revalidate strategy for CSS, JS, and font assets in `sw.js` to enable sub-second subsequent visits and offline browsing.

---

## 4. Projected Core Web Vitals After Remediation

| Metric | Current Value | Target Value | Improvement |
| :--- | :--- | :--- | :--- |
| **LCP** | 4.2s | **1.6s** | -62% |
| **CLS** | 0.28 | **0.02** | -93% |
| **Initial Payload** | 6.26 MB | **~850 KB** | -86% |
| **HTTP Requests** | 28 | **11** | -60% |
| **Performance Score**| 68 / 100 | **94 / 100** | +38% |
