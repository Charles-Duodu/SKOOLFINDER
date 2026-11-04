# SkoolFinder Ghana — School Owner & Proprietor Portal
## Phase 2A Requirements & Verification Checklist
**Baseline Blueprint:** `docs/blueprints/SkoolFinder_Ghana_School_Owner_Master_Blueprint_v2.0.pdf`  
**Governing Standard:** Section 26.3 (Phase 2 Detailed Build Packages)  
**Status:** ✅ Fully Built & Automated Verification 100% Passed (27/27 Tests)

---

### 1. Enquiry CRM Packages (`ENQ-001` to `ENQ-008`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **ENQ-001** | Guest Enquiry Form & Abuse Protection | §10.1 | Parents can submit enquiry without forced login; rate-limited, anti-spam honeypot trap, duplicate prevention. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 1) |
| **ENQ-002** | Authoritative School Routing | §10.1, §23 | Enquiry scoped strictly to target school ID; source attribution (directory, matchmaker, compare). | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 1 & 2) |
| **ENQ-003** | School Inbox & Scoped Lists | §10.1, §10.2 | Filter by status (New, Contacted, Qualified, Tour Scheduled, Converted, Closed); search by parent/grade. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 3) |
| **ENQ-004** | Conversation History & Threaded Reply | §10.2 | Multi-message conversation thread; official email/in-app notification delivery; internal notes separation. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 4) |
| **ENQ-005** | Staff Assignment & Follow-Up Tasks | §10.2 | Assign inquiry to authorized active staff member; schedule follow-up with due date and reminder. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 5) |
| **ENQ-006** | Enquiry Status & Closure/Reopening | §10.2 | Closed with reason (enrolled elsewhere, uninterested, duplicate); full history preserved; reopenable. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 6) |
| **ENQ-007** | Email & In-Platform Notifications | §16.2 | Transactional notification dispatched to parent and school admissions desk upon submission/reply. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 7) |
| **ENQ-008** | Enquiry Analytics & Conversion | §8.2, §10.2 | Source attribution breakdown, response time SLA metrics, and conversion-to-application funnel. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 8) |

---

### 2. Admissions Lifecycle Packages (`ADM-001` to `ADM-012`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **ADM-001** | Academic Year & Intake Setup | §11.1, §11.2 | Configure academic intakes (e.g. 2026/2027 Main Intake), opening/closing dates, grade levels. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 9) |
| **ADM-002** | Class Capacity Configuration | §11.4 | Specify total capacity, seats advertised, offers outstanding, and enrolled count per grade. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 9 & 10) |
| **ADM-003** | Versioned Form Builder & Questions | §11.1, §11.2 | Standard + custom fields (text, number, radio, upload); form versions immutable for existing entries. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 11) |
| **ADM-004** | Parent Application Submission | §11.2, §23 | Multi-section dossier submission; tracking reference generated; syncs to parent command center. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 12) |
| **ADM-005** | Application Review & Staff Assign | §11.1, §11.3 | Admissions officer reviews dossier, assigns reviewer, records assessment notes, logs timeline. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 13) |
| **ADM-006** | Secure Supporting Documents | §11.2, §24 | Child birth certificate, past report cards uploaded to private storage; signed URLs only. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 12) |
| **ADM-007** | Valid Admission State Transitions | §11.3 | Strict state machine: Draft -> Submitted -> Under Review -> Info Req -> Exam Scheduled -> Decision Pending -> Offered -> Accepted -> Enrolled. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 14) |
| **ADM-008** | Tours, Interviews & Assessments | §11.4 | Campus walkthrough & entrance exam timeslot bookings with slot capacity and attendance tracking. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 15) |
| **ADM-009** | Offers, Decline & Waitlist Queue | §11.1, §11.3 | Official offer generation with expiry date; waitlist management when class capacity is reached. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 14 & 17) |
| **ADM-010** | Private Parent Application Tracking | §11.2, §23 | Authenticated parent tracking showing real-time authoritative status, offer acceptance, and receipt. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 16 & 17) |
| **ADM-011** | Admissions Reporting & CSV Export | §11.1, §22 | Pipeline conversion telemetry, grade-by-grade applicant distribution, and role-protected export. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 18) |
| **ADM-012** | Enrolment Confirmation (DEC-03) | §5, §11.3 | Confirms admission enrolment without requiring premature SIS; transitions candidate to enrolled. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 19) |

---

### 3. Commercial Subscriptions Packages (`SUB-001` to `SUB-010`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **SUB-001** | Plan & Approved Price Catalogue | §6.1 | Free: GH₵0, Growth: GH₵99/mo, Professional: GH₵249/mo, Enterprise: GH₵499/mo in Ghana Cedis. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 20) |
| **SUB-002** | Monthly & Annual Billing Intervals | §6.1 | Annual pricing: 12 months for 10 months (16.67% discount): Growth GH₵990/yr, Pro GH₵2,490/yr, Ent GH₵4,990/yr. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 21) |
| **SUB-003** | Checkout & Authorisation Flow | §6.4, §25 | Paystack Mobile Money (MTN, Telecel, AT) and Card checkout initiation with payment reference. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 22) |
| **SUB-004** | Verified Transaction Reconciliation | §6.4, §23.1 | Idempotent transaction verification; never activate on unverified client callback. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 23) |
| **SUB-005** | Feature Entitlement Engine | §6.2, §6.4 | Server-side enforcement of tier features (CRM, admissions workflows, tour bookings, seat limits). | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 24) |
| **SUB-006** | Seat & Gallery Quota Accounting | §6.2 | Free: 1 seat/5 images; Growth: 3 seats/20 images; Pro: 10 seats/50 images; Ent: 25 seats/100 images. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 25) |
| **SUB-007** | Upgrade & Downgrade Integrity | §6.4 | Upgrades unlock seats/features; downgrades preserve historical records without silent deletion. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 26) |
| **SUB-008** | Renewal, Past-Due & Grace States | §6.4, §25 | States: active, past_due, grace (7-day non-destructive window), expired, cancelled_at_period_end. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 27) |
| **SUB-009** | Billing Receipts & Invoices | §6.4, §15 | Digital invoices & receipts with sequential numbers, separate from school fees; downloadable PDF/view. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 28) |
| **SUB-010** | Super Admin Commercial Control | §18 | Super Admin can inspect subscription statuses, adjust tiers, issue manual credits, and review GMV. | ✅ VERIFIED | `test-phase2a-admissions-subscriptions.js` (Test 29) |

---

### Non-Negotiable Operating Constraints Verification
1. **DEC-01:** One active primary proprietor-school workspace per user initially. (✅ Enforced & Verified)
2. **DEC-02:** Monthly and annual intervals with approved 10-month annual price discount. (✅ Enforced & Verified)
3. **DEC-03:** Admissions and Growth before SIS (No premature SIS/academics/tuition fee collection at launch). (✅ Enforced & Verified)
4. **Tenant Isolation:** Zero cross-school private data leaks (`school_id` isolation on every query). (✅ Enforced & Verified)
5. **Zero Regression:** Parents Portal v4.2 (119/119 tests passing) and Phase 1 (10/10 tests passing). (✅ Enforced & Verified)
