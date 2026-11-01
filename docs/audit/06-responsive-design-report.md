# SkoolFinder Ghana — Responsive Design & Mobile Experience Audit

**Document ID:** `AUDIT-06`  
**Date:** 2026-11-01  
**Auditor:** Senior Frontend Engineer & UI/UX Design Director  
**Branch:** `audit/frontend-review`  
**Testing Viewports:** 320px, 375px, 390px, 430px, 768px, 1024px, 1440px, 1920px

---

## 1. Responsive Viewport Analysis Matrix

| Viewport Width | Representative Devices in Ghana | Primary Layout Behaviour | Identified Deficiencies / Overflow | Usability Score |
| :--- | :--- | :--- | :--- | :--- |
| **320px** | Ultra-budget Android (Tecno Pop, itel A-series) | Single column, stacked cards | Card action buttons stack vertically; fee badge overlaps school crest; table in comparison matrix horizontally clips. | **62 / 100** |
| **375px** | iPhone SE / Budget Samsung Galaxy A03 | Single column | Hamburger drawer functions well; search widget inputs stack cleanly; virtual tour tab bar requires horizontal scroll. | **76 / 100** |
| **390px** | iPhone 12/13/14/15 | Single column | Cards look balanced; bottom comparison bar sits cleanly above browser chrome; toast notifications properly centered. | **84 / 100** |
| **430px** | iPhone 15 Pro Max / Galaxy S24 Ultra | Single column | Excellent card presentation; spacious padding. | **88 / 100** |
| **768px** | iPad Mini / Standard Android Tablet | 2-column grid | Directory filter sidebar collapses into a top horizontal bar; awkward empty whitespace between filter and cards. | **74 / 100** |
| **1024px** | iPad Pro / Small Laptop | 2-column grid | Desktop navigation links activate; side-by-side directory sidebar reappears. | **90 / 100** |
| **1440px** | Standard Desktop / MacBook Pro | Max-width 1280px container | Clean typography, well-aligned hero banner, responsive 3-column school grid. | **95 / 100** |
| **1920px** | Ultra-wide Desktop | Centered container | No stretch distortion; hero crossfade background covers viewport gracefully. | **95 / 100** |

---

## 2. Detailed Responsive Deficiencies

### 2.1 Horizontal Overflow on School Comparison Table (`#/compare`)
- **Observed Behavior:** On viewports below 768px, comparing 3 schools forces the `<table>` to expand beyond the viewport width, introducing an awkward horizontal scroll that detaches header columns from data rows.
- **Root Cause:** Table container lacks `overflow-x: auto` with a sticky left header column.
- **Recommended Fix:** Implement a card-based accordion view or a scrollable swipe-container with sticky first-column labels on screens under 768px.

### 2.2 Touch Target Sizes on Mobile Navigation & Close Buttons
- **Observed Behavior:**
  - Modal close button `<button class="modal-close-btn">&times;</button>` measures approximately `28px x 28px`.
  - Filter checkbox items have a click target of `18px x 18px`.
- **WCAG Guideline:** WCAG 2.5.5 / 2.5.8 requires touch targets to be at least **44px x 44px** (or 24px with adequate spacing) to prevent mis-taps on handheld smartphones.
- **Recommended Fix:** Increase touch target padding on `.modal-close-btn` and wrap filter checkbox labels in full-width clickable touch targets (`padding: 0.65rem 0.5rem; min-height: 44px`).

### 2.3 Mobile Sticky Header & Floating Elements Clashing
- **Observed Behavior:** On mobile screens when both the AI Chatbot FAB (`.sd-chatbot-fab`) and the Floating Comparison Bar (`#comparison-floating-bar`) are active, the comparison bar covers the chatbot trigger button, preventing parents from opening the Akosua AI admissions advisor.
- **Root Cause:** Both elements use `position: fixed; bottom: 16px` without dynamic coordinate offset.
- **Recommended Fix:** Add a CSS rule or state observer: when `#comparison-floating-bar` is visible, lift `.sd-chatbot-fab` to `bottom: 84px`.

### 2.4 Virtual Tour Tabs Overflow on Small Displays
- **Observed Behavior:** On `SchoolDetailView`, the 5 facility selector tabs (Cambridge Science Lab, STEM Robotics, Swimming Pool, Montessori, Drone View) stretch past the screen edge without visual fade or scroll arrows.
- **Recommended Fix:** Add CSS horizontal scroll snapping (`scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch`) and a subtle right gradient fade mask to signal scrollability.

---

## 3. Responsive Scorecard

- **Mobile (<640px):** 78 / 100
- **Tablet (641px–1024px):** 82 / 100
- **Desktop (>1024px):** 95 / 100
- **Overall Responsive Design Rating:** **85 / 100**
