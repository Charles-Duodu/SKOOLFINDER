# SkoolFinder Ghana — Web Accessibility (WCAG 2.2 AA) Audit

**Document ID:** `AUDIT-07`  
**Date:** 2026-11-01  
**Auditor:** Web Accessibility Specialist  
**Branch:** `audit/frontend-review`  
**Target Standard:** WCAG 2.2 Level AA Compliance

---

## 1. Compliance Summary Scorecard

| Principle | Guideline | Status | Pass Rate | Key Issues |
| :--- | :--- | :--- | :--- | :--- |
| **1. Perceivable** | Text Alternatives, Contrast, Adaptable | Needs Improvement | 64% | Missing alt tags on some dynamically generated cards; white text on gold button fails contrast. |
| **2. Operable** | Keyboard Access, Focus Visible, Input Modal | Critical Deficits | 48% | No skip-to-content link; no focus trap in modals; `Escape` key does not close dialogs; missing visible focus rings. |
| **3. Understandable** | Readable, Predictable, Input Assistance | Good | 82% | Clear form field labels; error messages are descriptive, but field-level error association is missing (`aria-describedby`). |
| **4. Robust** | Compatible with Assistive Tech, Valid ARIA | Critical Deficits | 35% | Only 7 ARIA attributes exist across 20,000+ lines of UI; modals lack `role="dialog"` and `aria-modal="true"`. |

**Overall WCAG 2.2 AA Accessibility Score:** **57 / 100**

---

## 2. Critical Accessibility Findings

### 2.1 Missing "Skip to Main Content" Bypass Mechanism (WCAG 2.4.1 - Level A)
- **Violation:** `public/index.html` has no skip link. Keyboard and screen reader users must navigate through 12+ navigation and portal links before reaching the main search or directory content on every page transition.
- **Remediation:** Add a skip link as the very first child of `<body>`:
  ```html
  <a href="#main-root" class="skip-link sr-only focus:not-sr-only">Skip to main content</a>
  ```

### 2.2 Contrast Ratio Failures on Primary Call-to-Action Buttons (WCAG 1.4.3 - Level AA)
- **Violation:**
  - Button `.btn-gold`: Text color `#ffffff` on background gradient `#f59e0b` to `#d97706`. Contrast ratio is **2.41:1** (Required: minimum 4.5:1 for normal text).
  - Status pill `.badge-pulse-dot` + text: `#10b981` text on `#ecfdf5` background has a contrast ratio of **3.12:1** (Fails 4.5:1).
- **Remediation:** Change `.btn-gold` text color to dark navy `#0a1128` (yielding **8.92:1** contrast). Darken green badge text to `#047857` (yielding **4.76:1** contrast).

### 2.3 Absence of ARIA Dialog Roles & Focus Trapping (WCAG 2.1.2, 4.1.2 - Level A)
- **Violation:** All 35+ modals in `public/js/components/modals.js` are injected as generic `<div>` containers without `role="dialog"`, `aria-modal="true"`, or `aria-labelledby`.
- **Assistive Technology Impact:** Screen readers (NVDA, JAWS, VoiceOver) do not announce that a modal has opened, nor do they restrict reading to the modal contents. Tabbing with the keyboard allows focus to escape behind the modal into hidden page content.
- **Remediation:**
  ```javascript
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-modal', 'true');
  div.setAttribute('aria-labelledby', 'modal-dialog-title');
  ```
  Implement a focus trap that catches `Tab` and `Shift+Tab` and constrains focus to the modal's focusable elements.

### 2.4 Unlabeled Interactive Controls & Icon-Only Buttons (WCAG 4.1.2 - Level A)
- **Violation:**
  - Close buttons: `<button class="modal-close-btn" id="modal-close">&times;</button>` lack `aria-label="Close dialog"`.
  - WhatsApp quick buttons: `<a class="btn-card-wa">💬</a>` lack `aria-label="Contact admissions on WhatsApp"`.
  - Dark mode switcher: `<button id="mob-btn-theme-toggle">🌙</button>` in mobile drawer lacks accessible name.
- **Remediation:** Provide descriptive `aria-label` attributes for all icon-only buttons.

### 2.5 Focus Visibility (:focus-visible) Across Interactive Elements (WCAG 2.4.7 - Level AA)
- **Violation:** `public/css/style.css` and `components.css` define focus outlines only on `.form-input:focus` and `.search-input:focus`. Buttons, school cards, tab links, and breadcrumbs do not have an explicit focus ring when navigated via keyboard.
- **Remediation:** Add a global focus-visible stylesheet rule:
  ```css
  *:focus-visible {
    outline: 2.5px solid #2563eb;
    outline-offset: 3px;
  }
  ```

---

## 3. Prioritized Remediation Plan

1. **Sprint 1 (Quick Wins):** Add the skip-to-content link, fix `.btn-gold` text contrast, and add `aria-label` to all icon buttons and modal close triggers.
2. **Sprint 2 (Modal Hardening):** Add `role="dialog"`, `aria-modal="true"`, focus-trap lifecycle, and `Escape` key listeners to `modals.js`.
3. **Sprint 3 (Form Accessibility):** Associate all form labels with inputs using matching `for` and `id` attributes, and bind error alerts via `aria-describedby` and `aria-invalid="true"`.

