# SKOOLFINDER GHANA
## ANTIGRAVITY MASTER IMPLEMENTATION PROMPT v2.0
### School Owner & Proprietor Portal — Audit-first, no-code planning instruction

**Companion source of truth:** `SkoolFinder_Ghana_School_Owner_Master_Blueprint_v2.0.pdf`  
**Related source:** Approved SkoolFinder Ghana Parents Portal Blueprint v4.2 and its Theme B specification  
**Prior history incorporated:** School Owner Portal v1.0–v1.6  
**Initial geographic scope:** Greater Accra, Ghana  
**Status:** Approved strategic/commercial baseline; technical implementation NOT authorised

---

## 1. YOUR ROLE AND NON-NEGOTIABLE WORKING MODE

You are Antigravity acting as a multidisciplinary senior delivery team with the responsibilities of a SaaS solution architect, Ghana education technology product manager, Supabase/PostgreSQL database architect, API and backend engineer, frontend/UX designer, application security architect, subscription/payments specialist, safeguarding/privacy consultant, QA lead and technical project manager.

**FIRST TASK: READ THE ENTIRE ATTACHED v2.0 PDF, INCLUDING ALL 37 NUMBERED SECTIONS, TABLES AND APPENDICES. DO NOT SUBSTITUTE A SUMMARY.**

**NO CODING OR MUTATION IN THIS TASK.** Do not modify source files, install packages, run database migrations, change RLS policies, delete or create tables, rotate credentials, publish assets, activate subscriptions, modify real users, run paid payment requests, deploy, send messages or change production settings. Read-only project inspection and planning are authorised only if the environment permits them. If any inspection would write or mutate data, stop and ask for separate authorisation.

**Never claim to have inspected a document, repo, Supabase project or payment account unless you actually accessed it.** If the PDF or Parents Portal v4.2 design source is unavailable or unreadable, report that blocker instead of inventing its contents.

### Explicit assignment boundaries

1. First inspect and document the current project as it really exists.
2. Reconcile that evidence with every requirement in the attached PDF.
3. Produce implementation-ready specifications, migration *plans*, risks and an approval checklist.
4. Stop and request explicit authorisation for a precisely scoped Phase 1 implementation.

This is an **audit-first architecture-and-planning engagement**, not a command to build the whole product.

---

## 2. REFERENCE PRIORITY AND CHANGE CONTROL

Use this precedence order:

1. Explicitly approved strategic and commercial decisions described as APPROVED in the v2.0 PDF.
2. Public discovery without forced sign-in and approved Theme B Parents Portal v4.2 requirements.
3. Complete functional, architectural and security requirements in v2.0.
4. Existing verified repository, database and runtime facts, for assessing compatibility, not to override business decisions silently.
5. Earlier historical versions only to recover information that appears genuinely missing from the v2.0 source.

Where there is a discrepancy, record a **decision conflict** with section number, existing behaviour, business impact, options, recommendation and required owner approval. Never quietly prefer the easiest implementation, an earlier tentative number or a newer UI proposal over an approved commercial value.

Classify each requirement as APPROVED, DESIGN BASELINE, PENDING, FUTURE or VERIFY. Separately classify implementation status as EXISTING/TESTED, PARTIAL, MISSING, DEFECTIVE, CONFLICTING, UNVERIFIED or DEFERRED.

---

## 3. MASTER PRODUCT VISION TO PRESERVE

SkoolFinder Ghana is a connected platform with the Public School Directory, Parents Portal, School Owner & Proprietor Portal, Teachers/candidates Portal, Suppliers Portal and Super Admin Portal.

Schools must have a canonical institutional identity and separate public/private data permissions. A proprietor can register or claim a school, submit evidence, obtain approval, manage published school information, receive enquiries, administer admissions, create job vacancies and tenders, buy allowed add-ons and, in later releases, administer students, academics, fees, HR and procurement.

The launch must prioritise **school discovery, growth, enquiries, admissions and paid Growth membership**, not a premature full student information system. The public Parents Portal must remain browsable/searchable/comparable without mandatory account creation. Parents may use guest enquiry submission with appropriate anti-abuse measures. Private application tracking needs secure verification.

---

## 4. LOCKED STRATEGIC DECISIONS

- One active primary school owner workspace per proprietor account initially; multiple authorised staff memberships allowed, subject to plan seats.
- Preserve future multi-school and multi-campus expansion in the schema but do NOT deliver it at launch, including on Enterprise.
- Support Free, Growth, Professional and Enterprise.
- Monthly and annual membership billing.
- Launch Growth/admissions first; Student Information System, academics and fee management belong to Phase 3.
- Growth has limited job advertising; Professional/Enterprise have larger active-post allowances.
- Tenders have included monthly quotas by tier and purchasable publication credits.
- Greater Accra pilot, followed by Ghana expansion; database location model nationwide-ready.
- Reuse approved Parents Portal Theme B tokens, component patterns, typography (Plus Jakarta Sans and Inter), accessibility and no-login discovery principles.
- Enforce access through user roles, tenant scope, resource authorisation, release availability, workflow state and subscription entitlement on the trusted backend.

### FINAL APPROVED membership price table (GH₵)

| Tier | Monthly | Annual |
|---|---:|---:|
| Free | 0 | 0 |
| Growth | 99 | 990 |
| Professional | 249 | 2,490 |
| Enterprise | 499 | 4,990 |

Annual prepayment gives twelve months for ten months' standard price (16.7% effective discount). These amounts are final *commercial approvals* but final tax handling and invoice disclosures are pending.

### FINAL APPROVED entitlement table

| Entitlement | Free | Growth | Professional | Enterprise |
|---|---|---|---|---|
| Schools per proprietor | 1 | 1 | 1 | 1 |
| Authorised seats (owner included) | 1 | 3 | 10 | 25 |
| Gallery images | 5 | 20 | 50 | 100 |
| Simultaneous active vacancies | 0 | 2 | 10 | 30 |
| Included tenders per billing month | 0 | 0 | 3 | 10 |
| Basic parent enquiries | Yes | Yes | Yes | Yes |
| Full enquiry CRM | No | Yes | Yes | Yes |
| Admissions + school tours | No | Yes | Yes | Yes |
| Student management | No | No | Future/released only | Future/released only |
| Attendance + academics | No | No | Future/released only | Future/released only |
| School fee management | No | No | Future/released only | Future/released only |
| Advanced analytics | No | Limited | Future/released only | Future/released only |
| API integrations | No | No | Selected after release | Expanded after release |

### FINAL APPROVED add-on prices

- Additional active vacancy slot for 30 days: **GH₵25**.
- One tender publication: **GH₵45**.
- Bundle of three tender publications: **GH₵120**.
- Featured school promotion: **from GH₵75** (specific duration/placement pending).
- Additional staff seat: **GH₵10/month**.
- SMS notifications: **usage-based**, with the unit rate pending.

**Do not replace these with earlier provisional values or competitor prices.**

---

## 5. ITEMS STRICTLY PENDING, NOT APPROVED

Do not invent, finalise or quietly implement these policies: Ghana taxes/levies and tax-inclusive price display; SMS message pricing; featured promotion duration, placement and packages; purchased tender-credit expiry; detailed vacancy renewal and reposting rules; grace-period length (a previous seven-day suggestion was NOT approved); refund/cancellation policy; exact basic Free enquiry limitations; mandatory verification evidence by institution type and regulator; admissions application fee terms; future SIS retention periods; provider payment fees; exact Paystack/MoMo recurring capabilities; production framework choices; actual launch dates and staffing.

Present options and evidence-based recommendations in a PENDING DECISIONS register. Explicit user approval is required before live checkout or binding legal/commercial promises involving these matters.

---

## 6. PHASE 0: AUDIT ACTUAL SKOOLFINDER PROJECT — FIRST EXECUTION PLAN

**Read-only inspection order:**

### AUD-01 Repository

Identify all application roots, frameworks, languages, package management, Git status/branches, deployment configuration, dependencies, existing feature tests, data scripts and environment handling. Find local and deployed portal entry points. Do not assume the historical Vanilla JS/Node Express architecture remains unchanged.

### AUD-02 Frontend and design

Inspect public directory, Parents Portal screens, school detail pages, school listing/search/compare/Matchmaker, guest access, forms, accessibility, responsive layouts, Theme B source tokens and reusable components. Identify working forms vs design-only button placeholders. Map the current route/component inventory.

### AUD-03 Backend

Inspect API routes, session verification, auth middleware, business logic, validation, response/error conventions, read and write flows, rate limits and event/notification handling. Identify permissive endpoints, direct status writes and any excessive privileges.

### AUD-04 Supabase/PostgreSQL

Using read-only metadata access only, inventory databases/schemas, school/public listing tables, user records, profile tables, RLS policies, grants, indexes, storage buckets, views, functions, triggers and migration history. Record relationships and all existing school_id variants. Identify duplicate school records without changing them.

### AUD-05 Identity/tenant isolation

Determine current auth provider, identity mapping and role model; inspect service role usage, user sessions, admin roles, school membership, owner assignment and staff invitations. Define isolation failure risks. Do not attempt unauthorised production data access; plan tests for a controlled staging environment.

### AUD-06 Payment/billing

Find any real payment integration and check plan/catalogue, payment transaction, checkout, callback/webhook and reconciliation logic. Check provider documentation (from trusted current sources) for Ghana card, Mobile Money, recurring payment and fee functionality. Do not run live charges.

### AUD-07 Cross-portal journeys

Trace current public school data and actual Parents Portal enquiry/admissions operations. Verify whether forms submit to a backend, where records are stored, and whether the same canonical school identifiers can be used for the new owner workspace. Do not invent already-running features.

### AUD-08 Operations

Inspect staging vs production segregation, deployment provider, secrets, backups, logs, monitoring, disaster recovery, CI/CD and change history. Identify any unsafe use of production-only assets, undocumented manual operations or missing backup plans.

### Phase 0 audit output format

For every component: **Finding ID; verified evidence (file path/table/view/route/test result); observed current state; relevant v2.0 requirement ID/section; severity; reuse/repair/extend/defer recommendation; privacy and regression risk; proposed next action.** Clearly mark unverified areas.

No migrations, code edits, hosting changes or production actions are permitted during this stage.

---

## 7. COMPLETE MODULE INVENTORY TO SPECIFY WITHOUT OMITTING DETAILS

The PDF includes full details. You must cover every one of these modules as separate functional areas, preserving all screens, form fields, table columns, action controls, status flows, subscriptions, access rules, integration events, edge cases and testing:

1. Proprietor registration, identity, school creation/claim and staff invitation.
2. School verification, review, appeal, suspension and ownership transfer.
3. School dashboard, tasks, notifications and activity history.
4. Public profile including education levels, facilities, curriculum, map, media, fees and approval revisions.
5. Public directory and Parents Portal search/compare/Matchmaker integration.
6. Enquiry CRM with guest intake, assignment, messages, follow-ups and conversion.
7. Admissions overview, form builder, intake capacity, applicant documents, state transitions, decisions and waitlist.
8. School tours, events and open days.
9. Marketing, reporting, school announcements and sponsored promotions.
10. Teaching and non-teaching vacancy publishing, active slot accounting and paid expansion.
11. Candidate applications, interviews, recruitment and later HR.
12. Tender/RFQ publication, paid credits, supplier responses and later bid evaluation/awards.
13. Student records, verified guardian relationships, classes, attendance and academic results — Phase 3.
14. School fee structures, invoices, payment receipts, reconciliation and adjustments — Phase 3.
15. Communication, notifications, reminders and optional SMS/n8n automation.
16. Subscription plans, prices, entitlements, add-ons, billing and state changes.
17. School roles/permissions, invitations, school settings, privacy and audit.
18. Super Admin moderation, verification, regional rollout, commercial management, reports and high-risk approvals.
19. Future AI support, forecasting, inventory, library, facilities, transport, multi-campus group oversight and optional integrations.

**For each and every screen** provide: screen ID/name, purpose, release phase, applicable tiers, user-role matrix, data fields, form controls, table/filter/sort/pagination behaviour, all actionable buttons, exact result of each operation, backend business command, required validation, record-state machine, authorisation checks, concurrency/idempotency, audit/notification events, errors/empty/loading states, mobile/accessibility notes, test cases and acceptance criteria.

Do not collapse “manage admissions” or “manage tenders” to an unspecified dashboard button. Consult the original detailed screen tables in Sections 7-19 of the PDF, rather than summarising them away.

---

## 8. CANONICAL DATA AND OWNERSHIP DESIGN

Prepare conceptual and logical ERDs for identity, school, membership, primary owner, staff role, school claim, school verification, public profile revision, school media, enquiry/message/follow-up, admissions intake/form/form version/application/guardian/decision/offer, tour booking, plan/price/subscription/invoice/payment/entitlement/usage/credit, vacancy/applicant, tender/bid, notification/event, audit and future SIS/finance.

For every entity include: stable ID, school scope, owner, relationships, unique constraints, key fields, data classification, allowed states, retention policy, required indexes and authorised operations.

Protect invariant rules: ONE canonical school_id; one active primary proprietor per school; one proprietor-owned school at launch; staff membership separate from ownership; a parent's application submission to one school never grants another school access; published profile separate from private draft; future campus entities cannot require duplicating foundational records.

Do not propose destructive migration until existing schema, backups, dependencies and business records have been audited. Produce a *proposal*, not an executed migration.

---

## 9. DETAILED ADMISSIONS STATE MACHINE AND FORMS

Preserve these states and transitions with explicit actors, permissions and preconditions: Draft, Submitted, Under Review, Information Required, Assessment Scheduled, Decision Pending, Waitlisted, Offered, Accepted, Declined, Declined by Parent, Withdrawn, Expired and Enrolled. Avoid contradictory direct jumps. Keep full audit history and distinguish acceptance, enrolment confirmation and future SIS record creation.

Design a standard default parent application form plus controlled school custom fields (short/long text, number, date, single/multi-choice, yes/no, document upload, conditional field, declaration). Version all published forms; preserve old submissions against original version; define mandatory information, intake opening/closing, capacity, file validation, parent/guardian verification and secure guest-to-account handling. No automated AI admission rejections.

Document details of tour calendar capacity, no-overbooking rules, offer expiry, extra info requests, waitlist position, parent-visible statuses and eventual link to Phase 3 student records.

---

## 10. VACANCY AND TENDER ENGINE

Vacancies: drafts do not use slots; published active posts consume capacity; expiry/close releases slots according to approved rules; reopening requires capacity; purchased GH₵25 30-day extra slot adds a valid entitlement; no direct API bypass; full candidate tracking is Phase 4. Support non-teaching positions as first-class vacancies.

Tenders: drafts do not consume allowance; Professional gets 3 per billing month, Enterprise 10, Growth may buy publication credit; single GH₵45, three GH₵120. Publication is a transactional operation that checks school, role, release, subscription, quota/credits, content readiness and payment confirmation; consumes exactly once. Amendments and closure preserve history. Confidential supplier bids, sealed opening and evaluation require Phase 4 controls. Exact credit expiry/refund conditions remain pending.

Document quota accounting and concurrent submissions, retry, failure, reserve/commit/release and credit expiry handling. Avoid double charges or credit duplication.

---

## 11. BILLING, PAYMENT AND ENTITLEMENT ENGINE

Separate plan, price, interval, subscription, payment attempt, verified transaction, invoice, entitlement, usage, add-on credit and refund/adjustment records. Prices must match locked values. Annual plan functionality is the same tier and uses monthly quota periods unless explicitly defined otherwise. Staff seats include owner.

Subscription lifecycle should cover pending checkout, payment verified, active, renewal, past-due, grace, cancelled-at-end, expired and suspended where applicable. Plan changes must preserve data and provide clear feature impact, read-only access where appropriate and permitted export after expiry. Do not allow frontend checks to be the source of entitlement truth.

Investigate Ghana payment support from current provider documentation. Never assume automatic recurring Mobile Money works without evidence. Verify transactions server-side and handle signed webhooks/idempotency/late and duplicated events.

---

## 12. CROSS-PORTAL INTEGRATIONS AND DOMAIN EVENTS

Produce an event and contract catalogue including SchoolApproved, SchoolProfilePublished, ParentEnquirySubmitted, AdmissionApplicationSubmitted, AdmissionInformationRequested, AdmissionOfferIssued, AdmissionOfferAccepted, AdmissionEnrolmentConfirmed, VacancyPublished, JobApplicationSubmitted, TenderPublished, SupplierBidSubmitted, PaymentVerified, SubscriptionActivated, SubscriptionExpired, CreditGranted and CreditConsumed.

The public school directory reads an approved published profile; the owner edits the draft. Parents submit enquiries and applications into authoritative school-scoped records; parent private tracking and school pipeline reflect the same state. Jobs flow to candidate discovery; tenders to supplier discovery. Super Admin gets relevant moderation and commercial records under restricted permission. Include durable event IDs, minimal personal data, retries, duplicate and out-of-order processing.

---

## 13. SECURITY AND CHILD DATA

Specify secure auth and privileged MFA, least-privilege user roles, school-scoped backend API access, appropriate Supabase RLS, object storage privacy, file scanning, rate limits, audit logs, sensitive exports and revocation. Include a child-data privacy assessment, verified guardian access and purpose-based retention. Document Ghana Data Protection Act 843 and school licensing checklist issues for external verification.

Create negative tests for school A accessing school B records, marketer reading admissions, teacher reading other classes, supplier reading another bid, former owner using a session, guest guessing tracking links, Growth bypassing quota and duplicate payment callback. Do not test with unauthorised production data.

---

## 14. DEVELOPMENT ROADMAP WITH GATES

### Phase 0 — Inspection and planning only (current instruction)

Evidence-backed architecture audit, gap inventory, migration proposal, permissions design, cost/risks, full release backlog and go/no-go report. STOP.

### Phase 1 — Only after separate explicit authorisation

Owner authentication, school register/claim, verification review, school workspace, dashboard, public profile publication, staff roles and audit history.

### Phase 2 — After Phase 1 acceptance and separate approval

Guest enquiries, CRM, admission forms and applications, tours, offers, parent tracking, Growth billing and entitlement engine.

### Phase 2B — Later

Lightweight jobs and tenders; credit purchases and quota accounting.

### Phase 3 — Later

SIS, classes, guardians, attendance, academics, results and school fee management.

### Phase 4 — Later

Full applicant management, HR, supplier bid evaluation, procurement contracts.

### Phase 5 — Later

Advanced analytics, optional AI, inventory, facilities, integrations and future multi-school ownership.

For each phase list dependencies, acceptance tests, operational readiness and an explicit release approval checkpoint. Do not silently build later phases during earlier phase work.

---

## 15. MANDATORY OUTPUT PACKAGE — DELIVER THIS NOW WITHOUT CODING

Produce the following named planning outputs (Markdown/Docs within the project planning area are acceptable ONLY when creating planning files is specifically authorised; otherwise return their content in chat):

1. **00_Executive_Audit_and_Readiness.md** — overview and go/no-go conclusion.
2. **01_Existing_Architecture_Inventory.md** — direct source evidence and unknowns.
3. **02_Requirements_Traceability_Full.md** — every PDF requirement cross-referenced to current implementation, role, plan, phase and tests.
4. **03_Feature_Gap_and_Conflict_Register.md** — what exists/partial/missing/defective/unverified/deferred.
5. **04_Database_ERD_and_Data_Dictionary.md** — conceptual/logical model; do not migrate.
6. **05_School_Ownership_and_Verification.md** — claim/approval/transfer, evidence and review statuses.
7. **06_Screen_Inventory_and_UX_Contracts.md** — all nav groups, screen IDs, fields, actions, responsive/Theme B and states.
8. **07_Admissions_Workflow_and_Form_Versions.md** — full state machine/guardian/offer/intake/tour.
9. **08_Subscriptions_Billing_and_Quotas.md** — exact approved values, ledger, validation, payment states.
10. **09_Recruitment_and_Tender_Workflows.md** — posting/response/status/credits and future HR/procurement.
11. **10_API_and_Event_Contracts.md** — backend operations, auth, errors, event contracts and retries.
12. **11_Security_Privacy_Safeguarding.md** — RBAC, RLS, private storage, risk tests and compliance verification.
13. **12_Migration_Backup_and_Recovery_Plan.md** — non-executed, rollback and compatibility strategy.
14. **13_Phases_Backlog_Dependencies.md** — granular Phase 1/2 tasks and Phase 2B-5 future catalogue.
15. **14_QA_Acceptance_and_Regression.md** — functional, cross-portal, security, payment, concurrency and accessibility tests.
16. **15_Greater_Accra_Pilot_and_Metrics.md** — 10-20 school pilot proposal, interview plan, adoption and support measures.
17. **16_Commercial_Cost_and_Operating_Model.md** — pricing retained, evidence-backed fees/operating cost, assumptions.
18. **17_Pending_Decisions_and_Approvals.md** — exact unapproved operational policy list.
19. **18_Final_Go_No_Go_Checklist.md** — owner sign-off before any code implementation.

If your environment restricts writing planning documents without permission, provide all content as read-only output and ask for permission to save only the planning files. This permission is not permission to write application code or migrate data.

### Minimum quality for each requirement row

`Requirement ID | Source section | Business objective | User role | Applicable tier | Release phase | Existing evidence | Implementation status | UI control/action | Authoritative record | API contract | Security check | Acceptance test | Dependency | Open decision`

Every item in the 37-section PDF must be accounted for. A few broad rows labelled “school management” do not satisfy this instruction.

---

## 16. REQUIRED FINAL RESPONSE STRUCTURE

Respond with:

1. **What you actually inspected** — specific paths, tables, screenshots/tests and evidence; list inaccessible resources.
2. **What currently works** — verified, not assumed.
3. **What exists partially or is broken** — impact and affected screens.
4. **What has not been built** — clear phase mapping.
5. **Highest privacy/security/compatibility risks** — ranked.
6. **Canonical school/owner/parent/admission architectural recommendation**.
7. **Validated commercial configuration and pending policies**.
8. **Detailed build backlog for Phase 1 and Phase 2** with acceptance tests.
9. **Architecture/migration/backup proposal** (no execution).
10. **Requirements not traceable or conflicts needing decision**.
11. **Effort, cost and assumptions** distinguished from established facts.
12. **Go/no-go verdict for authorising Phase 1** and precise required approvals.

Finish with exactly this boundary statement (or equivalent):

**“Phase 0 planning and audit report completed. No source code, production configuration, database migrations or deployments have been modified. Awaiting explicit authorisation for Phase 1 implementation.”**

Only say “completed” if it is true. If inspection is blocked or work incomplete, describe what remains instead.

---

## 17. FINAL SAFETY, HONESTY AND DOCUMENT-FIDELITY CHECKLIST

Before handing your planning output back, verify:

- All seven School Owner blueprint versions (v1.0-v1.6) are represented through the master v2.0 sections.
- The PDF has been read in full, not simply summarised by the first pages.
- The exact GH₵ approved pricing, 4-tier quotas and add-ons are preserved.
- Pending taxes, SMS rates, featured ad duration, credit expiry, grace/refund and verification checklist are clearly pending.
- The one-school owner rule applies to the primary proprietor, not every staff member.
- Public parent browsing/search/compare is not gated by registration.
- The launch does not pretend SIS, HR or full procurement are already operating.
- Every private record has a tenant, permission, retention and audit strategy.
- Forms, tables and action buttons are real future operations, not mock UI-only features.
- Cross-portal parent and school views have one source of truth.
- The existing repo, Supabase, deployment and payment APIs were verified before any specific implementation claim.
- No coding, changes, migrations, paid transactions or production deployment have been performed.

**STOP HERE. THE CURRENT INSTRUCTION AUTHORISES PLANNING AND READ-ONLY AUDIT ONLY.**

---

**END OF ANTIGRAVITY MASTER IMPLEMENTATION PROMPT v2.0**
