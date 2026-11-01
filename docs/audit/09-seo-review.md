# SkoolFinder Ghana — Technical SEO & Discoverability Audit

**Document ID:** `AUDIT-09`  
**Date:** 2026-11-01  
**Auditor:** Technical SEO Specialist  
**Branch:** `audit/frontend-review`  
**Live Production URL:** `https://skoolfinder.vercel.app/`  
**Target Geographic Indexing:** Ghana (Accra, Tema, Kumasi) & Ghanaian Diaspora (UK, US, Canada)

---

## 1. Executive Summary & SEO Scorecard

SkoolFinder possesses strong educational keyword positioning, descriptive copywriting, and clean heading structures. However, its current architecture suffers from **critical technical SEO deficits**: `robots.txt` and `sitemap.xml` reference `localhost:3000`, client-side route transitions do not update dynamic meta tags or document titles, and rich schema markup (JSON-LD) is missing across individual school pages.

### SEO Health Metrics:
- **Indexability & Crawlability:** 42 / 100
- **On-Page Keyword Optimization:** 85 / 100
- **Dynamic Social Graph (Open Graph / WhatsApp):** 40 / 100
- **Structured Data (Schema.org):** 20 / 100
- **Mobile Usability & Search Experience:** 75 / 100

**Overall Technical SEO Score:** **52 / 100**

---

## 2. Critical SEO Deficiencies Identified

### Defect SEO-01: `robots.txt` References `http://localhost:3000`
- **Current File:** `public/robots.txt`
  ```txt
  User-agent: *
  Allow: /
  Disallow: /api/

  Sitemap: http://localhost:3000/sitemap.xml
  ```
- **SEO Impact:** Search engine bots (Googlebot, Bingbot) parsing `robots.txt` on the live domain `https://skoolfinder.vercel.app/` receive an invalid `localhost:3000` sitemap URL. This blocks automated sitemap discovery.
- **Remediation:** Update line 5 to the canonical production URL:
  `Sitemap: https://skoolfinder.vercel.app/sitemap.xml` (or custom apex domain).

---

### Defect SEO-02: `sitemap.xml` Uses `localhost:3000` and Hash Fragment URLs
- **Current File:** `public/sitemap.xml`
  ```xml
  <url>
    <loc>http://localhost:3000/#/directory</loc>
    <lastmod>2026-10-25</lastmod>
  </url>
  <url>
    <loc>http://localhost:3000/#/cssps</loc>
  </url>
  ```
- **SEO Impact:**
  1. All domain prefixes point to `localhost:3000`.
  2. Search engines **do not index fragment identifiers (hash bangs `#`)**. Googlebot crawls only the host path `/` and discards everything following `#`. As a result, `#/directory`, `#/cssps`, and `#/resources` are invisible in the sitemap index.
  3. Individual school profile URLs (e.g. `/schools/sch-gis-accra` or `/schools/sch-sos-hgics`) are completely absent from the sitemap.
- **Remediation:**
  Generate a clean XML sitemap with canonical HTTPS URLs for all static portal routes (`/parents`, `/teachers`, `/suppliers`, `/schools`, `/admin`) and dynamic URLs for every verified school profile (`/schools/ghana-international-school`, etc.).

---

### Defect SEO-03: Static Meta Tags & Document Title on Dynamic Route Changes
- **Current File:** `public/index.html` (lines 6–18) & `public/js/app.js` (`App.navigate`)
- **Observed Behavior:**
  When a parent visits `https://skoolfinder.vercel.app/` and clicks on "Ghana International School", the SPA renders the school's profile, but the browser tab title remains:
  `SkoolFinder Ghana | Verified School Directory & Educational Procurement`
  The meta description remains the generic homepage copy.
- **Social Sharing Impact (WhatsApp / Telegram / Facebook):**
  When a parent copies the link to share with their spouse or family WhatsApp group, WhatsApp scrapes the server's static HTML tags. Instead of displaying "Ghana International School — Cantonments, Accra | Admissions Open", it displays the generic homepage title and campus hero image.
- **Remediation:**
  In `SchoolDetailView.render()` and `App.navigate()`, dynamically update the DOM head tags:
  ```javascript
  document.title = `${school.name} (${school.suburb || 'Accra'}) — Fees, Admissions & Reviews | SkoolFinder Ghana`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${school.name} in ${school.suburb}, ${school.region}. Verified fees, curriculum (${school.curriculum.join(', ')}), admissions tour booking & reviews.`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${school.name} | SkoolFinder Ghana`);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', school.coverImage);
  ```

---

### Defect SEO-04: Missing Schema.org JSON-LD Structured Data
- **Current State:** Zero structured data is present on school profile pages.
- **Opportunity:** Education directory listings qualify for Google Rich Results (Star ratings, Address, Price Range, Educational Organization, FAQ).
- **Remediation:** Inject a JSON-LD script on each school detail page:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "Ghana International School",
    "description": "Excellence in Education since 1955. Leading Cambridge International school in Cantonments.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cantonments",
      "addressRegion": "Greater Accra",
      "addressCountry": "GH"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "18"
    },
    "priceRange": "GH₵ 15,000 - 35,000 / Term"
  }
  ```

---

## 3. SEO Keyword Matrix & Strategy

| Priority Keyword Target | Monthly Search Volume (Ghana) | Current Target Page | Strategic Keyword Optimization Recommendation |
| :--- | :--- | :--- | :--- |
| **"Best schools in Accra"** | High | `#/directory` | Create dedicated landing view: `schools-in-accra`. |
| **"Cambridge schools in Ghana"** | High | `#/directory?curriculum=Cambridge` | Add dedicated filter breadcrumb & canonical URL. |
| **"CSSPS school placement calculator"** | Very High (Annual peak Aug–Oct) | `#/cssps` | Add BECE cut-off point guides and FAQs. |
| **"International schools in Cantonments"** | Medium | `#/directory?suburb=Cantonments` | Surface suburb landing hubs. |
| **"Schools in Kumasi Ahodwo"** | Medium | `#/directory?region=Ashanti` | Create dedicated Ashanti regional hub. |
