# SkoolFinder Ghana — School Owner & Proprietor Portal
## Phase 2B Requirements & Verification Checklist
**Baseline Blueprint:** `docs/blueprints/SkoolFinder_Ghana_School_Owner_Master_Blueprint_v2.0.pdf`  
**Governing Standard:** Section 12, 13, 26.4 (Institutional Marketplace, HR & Procurement)  
**Status:** COMPLETE & VERIFIED (16/16 Passed)

---

### 1. Teacher Vacancies & Recruiting Packages (`VAC-001` to `VAC-006`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **VAC-001** | Simultaneous Active Vacancy Quotas | §6.2, §12.1 | Free: 0, Growth: 3, Pro: 10, Ent: 30 simultaneous active vacancies enforced on server. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 1) ✅ |
| **VAC-002** | Add-on Vacancy Slot Purchase | §6.3, §12.1 | Purchase additional active slot for 30 days at approved GH₵25 via Paystack MoMo/Card. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 3) ✅ |
| **VAC-003** | Vacancy Publishing Lifecycle | §12.2, §23 | Draft -> Published -> Closed/Expired (30d default lifespan); releases quota on close. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 2) ✅ |
| **VAC-004** | Candidate Application Receipt | §12.2, §12.3 | Teachers apply with NTC licence number, CV link, qualification, experience years. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 5) ✅ |
| **VAC-005** | Candidate Review & Stage Machine | §12.3 | School reviews dossier: Applied -> Shortlisted -> Interview Scheduled -> Offered -> Rejected. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 6) ✅ |
| **VAC-006** | Cross-Portal Public Job Board Sync | §12.1, §23 | Published school vacancies immediately discoverable on `/jobs` and Teachers Portal. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 4) ✅ |

---

### 2. B2B Procurement RFQs & Tenders Packages (`TEN-001` to `TEN-006`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **TEN-001** | Included Monthly Tender Quotas | §6.2, §13.1 | Free: 0, Growth: 0, Pro: 3/mo, Ent: 10/mo included tenders per billing cycle. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 7) ✅ |
| **TEN-002** | Tender Credits Add-on Purchase | §6.3, §13.1 | Buy 1 credit at GH₵45 or 3-credit bundle at GH₵120 (save GH₵15) via Paystack MoMo/Card. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 8) ✅ |
| **TEN-003** | Tender Publishing Lifecycle | §13.2, §23 | Category, quantity, budget range, delivery deadline, submission deadline; consumes quota/credit. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 9) ✅ |
| **TEN-004** | Cross-Portal Suppliers Sync | §13.1, §23 | Published tenders automatically appear on `/suppliers` procurement board. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 10) ✅ |
| **TEN-005** | Competing Supplier Bid Submission | §13.2 | Verified suppliers submit itemized quote in GHS, delivery SLA, and specifications. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 11) ✅ |
| **TEN-006** | Side-by-Side Bid Review & Award | §13.2, §18 | School compares bids side-by-side with WhatsApp triggers; awards contract to winning vendor. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 12) ✅ |

---

### 3. Milestone MoMo Escrow & Audit Packages (`ESC-001` to `ESC-004`)

| Package ID | Module / Feature | Blueprint Section | Core Acceptance Criteria | Target Status | Verification Test |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **ESC-001** | 50% Mobilization Deposit Lock | §13.3, §25 | 50% contract value deposited into platform MoMo escrow upon award; holds funds securely. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 13) ✅ |
| **ESC-002** | Delivery Inspection & 50% Release | §13.3, §25 | School verifies physical goods delivery; signs off final 50% balance disbursement. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 14) ✅ |
| **ESC-003** | Dispute & Reversal Safeguards | §13.3, §18 | Super Admin escrow oversight; dispute freezing and resolution handling in `/admin`. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 15) ✅ |
| **ESC-004** | Tamper-Evident Escrow Audit Log | §17.1, §24 | Immutable logging of contract awards, deposit lock, delivery sign-off, and disbursements. | **VERIFIED** | `test-phase2b-marketplace.js` (Test 16) ✅ |

---

### Non-Negotiable Operating Constraints Verification
1. **Approved Pricing:** Vacancy slot GH₵25/30d; 1 Tender GH₵45; 3 Tenders bundle GH₵120. (VERIFIED)
2. **Quota Isolation:** Enforce tier limits strictly on backend; never rely on client state. (VERIFIED)
3. **Escrow Transparency:** 50/50 disbursement with school delivery confirmation before final release. (VERIFIED)
4. **Zero Regressions:** 
   - Phase 1 School Owner Suite: 10/10 Passed (VERIFIED)
   - Phase 2A Admissions & Subscriptions Suite: 27/27 Passed (VERIFIED)
   - Phase 2B Institutional Marketplace Suite: 16/16 Passed (VERIFIED)
   - Parents Portal v4.2 Blueprint Suite: 7/7 suites / 119 Passed (VERIFIED)
