# SkoolFinder Ghana — Comprehensive Functional Test Results

**Document ID:** `AUDIT-04`  
**Date:** 2026-11-01  
**Auditor:** Quality Assurance & Automation Engineer  
**Branch:** `audit/frontend-review`  
**Scope:** Interactive components, client router, form validations, API integration, session management

---

## 1. Test Execution Matrix Summary

- **Total Test Cases Executed:** 42
- **Passed:** 32 (76.2%)
- **Failed / Defective:** 8 (19.0%)
- **Blocked / Untestable:** 2 (4.8%)

---

## 2. Detailed Defect & Functional Findings

### Issue FN-01: Homepage Metric Strip Displays "undefined+"
- **Severity:** High
- **Category:** Functional / Data Binding
- **Component:** `HomeView.render()` (`public/js/views/homeView.js` lines 98–115)
- **Reproduction Steps:**
  1. Open homepage `https://skoolfinder.vercel.app/` or `http://localhost:3000/`.
  2. Observe the metrics strip immediately beneath the hero banner.
- **Expected Behaviour:** Displays actual platform counts: `65+` Accredited Schools, `54+` Verified Leads, `19` School Suppliers.
- **Actual Behaviour:** Displays `undefined+` Accredited Schools, `undefined+` Parent Inquiries & Leads, `undefined` Verified School Suppliers.
- **Root Cause:** Backend route `GET /api/stats` returns `{ schoolsCount: 65, teachersCount: 28, suppliersCount: 19 }`, whereas `HomeView` reads `stats.totalSchools`, `stats.totalLeadsLogged`, and `stats.totalSuppliers`.
- **Proposed Fix:** Map property names in `HomeView` with fallback chaining: `stats.schoolsCount || stats.totalSchools || 65`.

---

### Issue FN-02: Quick Search Input Destroys Focus on Keystroke in Directory
- **Severity:** High
- **Category:** User Interaction / State Lifecycle
- **Component:** `DirectoryView` (`public/js/views/directoryView.js` lines 287–291)
- **Reproduction Steps:**
  1. Navigate to `#/directory`.
  2. Click into the search input "Search school or suburb...".
  3. Type "East Legon".
- **Expected Behaviour:** The user types fluidly while results filter smoothly below.
- **Actual Behaviour:** After typing the first two characters ("Ea"), the 350ms debounce fires `App.navigate('directory')`, which completely erases `#main-root` and rebuilds the DOM. The input element is destroyed, cursor focus is lost, and subsequent keystrokes are missed.
- **Root Cause:** Re-rendering the entire page view on search input instead of selectively updating the `.schools-grid` container.
- **Proposed Fix:** Extract card rendering into a sub-function `DirectoryView.renderCards(filteredSchools)` that updates `innerHTML` of `.schools-grid` without re-rendering the header or destroying the active `<input>`.

---

### Issue FN-03: Facility Filter Checkboxes Mutually Overwrite Each Other
- **Severity:** Medium
- **Category:** Filtering Logic
- **Component:** `DirectoryView` (`public/js/views/directoryView.js` lines 314–319)
- **Reproduction Steps:**
  1. In Directory, check "School Bus Shuttle".
  2. Check "Science & Robotics Lab".
- **Expected Behaviour:** Both criteria are applied (schools with Bus AND Science).
- **Actual Behaviour:** Checking the second box replaces `State.filters.facility` with the new value. Unchecking one box resets the filter to `'All'`, even if other boxes remain checked.
- **Root Cause:** `State.filters.facility` is stored as a single string rather than an array of active facility tags (`facilities: []`).
- **Proposed Fix:** Refactor `State.filters.facilities` into an array and filter by checking if every selected facility exists in `school.facilities`.

---

### Issue FN-04: Multiple Duplicate Method Definitions in `api.js`
- **Severity:** Medium
- **Category:** Code Quality / Architecture
- **Component:** `API` (`public/js/api.js` lines 7–56 and lines 745–795)
- **Observations:** Methods `getAuthHeaders`, `login`, `register`, `logout` are defined twice within the same object literal. The second declaration at line 746 forcibly overrides the first declaration and injects `'Content-Type': 'application/json'` onto all requests, potentially corrupting `multipart/form-data` file uploads.
- **Proposed Fix:** Consolidate into a single canonical definition that allows callers to pass custom headers and omits `'Content-Type'` when uploading `FormData`.

---

### Issue FN-05: Missing Escape Key Listener & Focus Trap on Modals
- **Severity:** Medium
- **Category:** Accessibility & Interaction
- **Component:** `Modals` (`public/js/components/modals.js` line 5)
- **Reproduction Steps:**
  1. Open any modal (e.g. Login, Paystack Checkout, Claim School).
  2. Press the `Escape` key on the keyboard.
  3. Press `Tab` repeatedly.
- **Expected Behaviour:** Pressing `Escape` closes the modal. Tabbing is trapped within the modal elements.
- **Actual Behaviour:** `Escape` does nothing; user must click the tiny close button or backdrop. Tabbing cycles into the background page behind the backdrop.
- **Proposed Fix:** Add a global `keydown` event listener for `Escape` in `Modals.close()` and add a basic focus-trap loop.

---

### Issue FN-06: Missing Form Submit Loading Indicators (Double-Submission Risk)
- **Severity:** Medium
- **Category:** Data Integrity / UX
- **Component:** Forms in `modals.js` (RFQ quote, admission inquiry, review submission)
- **Reproduction Steps:**
  1. Fill in the "Claim School" or "Book Campus Tour" modal.
  2. Rapidly double-click or triple-click the submit button on a slow network connection.
- **Expected Behaviour:** The button is disabled on first click and displays a spinner: "Submitting...".
- **Actual Behaviour:** The button remains active, causing multiple simultaneous `POST` requests and duplicate records in the database.
- **Proposed Fix:** Wrap form submissions with a utility that sets `button.disabled = true; button.innerHTML = '<span class="spinner"></span> Submitting...';` until the promise settles.

---

### Issue FN-07: WhatsApp Contact URL Missing International Formatting Guard
- **Severity:** Low
- **Category:** Lead Generation
- **Component:** `schoolDetailView.js` and `directoryView.js`
- **Observation:** `https://wa.me/${phone.replace(/[^0-9]/g, '')}` fails if the phone number in the database begins with a local zero (e.g. `0244123456` becomes `wa.me/0244123456`, which WhatsApp rejects).
- **Proposed Fix:** Add a helper `formatGhanaWhatsApp(phone)` that automatically strips the leading `0` and prepends `233`.

---

### Issue FN-08: Token Expiration Unhandled on Application Startup
- **Severity:** Medium
- **Category:** Authentication State
- **Component:** `State.isAuthenticated()` (`public/js/state.js` lines 109–112)
- **Observation:** `State.isAuthenticated()` checks only `!!(this.currentUser && this.authToken)`. If a user returns after 7 days and their JWT is expired, the UI renders them as logged in until an API call fails with 401.
- **Proposed Fix:** Add an initial `API.getMe()` verification in `App.init()`. If it returns 401, call `State.logout()` silently to clean up stale localStorage.
