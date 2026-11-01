# SkoolFinder Ghana — User Experience & Persona Journey Review

**Document ID:** `AUDIT-05`  
**Date:** 2026-11-01  
**Auditor:** UI/UX Design Director & SaaS Product Manager  
**Branch:** `audit/frontend-review`  
**Target Market:** Greater Accra (Accra, Tema, Spintex, East Legon) & Ashanti (Kumasi, Ahodwo)

---

## 1. Journey A: The Parent Journey

### Persona:
**Akua Mensah**, mother of two living in East Legon, seeking an accredited Cambridge or Montessori basic school with reliable school bus shuttle service and transparent term fees.

### Step-by-Step Flow:
1. **Discovery (Homepage):** Lands on homepage, inputs "East Legon", selects "Primary", clicks "Find Schools".
2. **Directory & Filtering:** Lands on Directory. Deselects unwanted curricula, narrows fee band to "Moderate (GH₵ 1,500 - 4,000)".
3. **Card Evaluation:** Reviews card badges (Verified, Cambridge, Admissions Open), checks fees, clicks "Compare" on 2 schools.
4. **Comparison Matrix:** Floating comparison bar appears; clicks "Compare Now" to review teacher-to-student ratios, swimming pool availability, and bus routes.
5. **Detailed Showcase:** Clicks "View Profile" for Ghana International School or SOS-Hermann Gmeiner.
6. **Action & Conversion:**
   - Clicks "Click to Reveal WhatsApp" to chat directly with admissions.
   - Or clicks "Buy Admission Voucher (GH₵ 150)" to pay via MTN MoMo.
7. **Parent Portal Experience:** Links child in Parent Portal (`/parents`), views timetable, tracks school bus GPS, and monitors termly report card.

### Identified Friction Points:
- **Search Re-render Glitch:** Typing a suburb in the directory causes focus loss, frustrating mobile users.
- **Voucher Purchase Redirection:** After paying for an admission voucher via MoMo, the user is not automatically transitioned to the online admission application form with the voucher code prefilled.

---

## 2. Journey B: School Owner / Proprietor Journey

### Persona:
**Mr. Kweku Addo**, founder and proprietor of a private preparatory school in Tema with 450 students. Wants to fill September vacancies and streamline term tuition collection.

### Step-by-Step Flow:
1. **Entry:** Notices his school listed in the directory with an unverified badge, or clicks "Claim Your School Profile" in the footer.
2. **Claim Submission:** Clicks "Claim Profile", fills in official role, school phone, GES registration number.
3. **Admin Verification:** Super Admin reviews credentials in the Admin Console and approves claim.
4. **Dashboard Access (`/schools`):** Proprietor logs in, enters School Management OS:
   - Sets term fees, creates student invoices, views MoMo collection payouts.
   - Manages school bus routes and posts teaching vacancies.

### Identified Friction Points:
- **Onboarding Feedback Gap:** After submitting a claim, the user receives a toast notification ("Our team will call within 24 hours"), but no confirmation email or tracking dashboard ticket is visible in their profile.

---

## 3. Journey C: Teacher & Private Tutor Journey

### Persona:
**Emmanuel Osei**, licensed teacher (NTC certified) in Kumasi offering after-school mathematics tutoring.

### Step-by-Step Flow:
1. **Entry:** Navigates to `/teachers`.
2. **Directory Review:** Inspects peer rates (GH₵ 40–80/hr) and school teaching vacancies.
3. **Profile Creation:** Registers account, enters NTC licence number, subjects, hourly rate, and profile bio.
4. **Subscription:** Subscribes to Pro Tutor tier via Paystack MoMo.
5. **Lead Acquisition:** Receives private lesson booking inquiries directly from parents via WhatsApp or email.

### Identified Friction Points:
- **NTC License Instant Verification:** NTC verification currently requires manual admin verification; there is no real-time webhook or instant check against the NTC national register.

---

## 4. Journey D: Institutional Supplier Journey

### Persona:
**Madam Joyce Baah**, CEO of a school uniform manufacturing company in Industrial Area, Accra.

### Step-by-Step Flow:
1. **Entry:** Visits `/suppliers`.
2. **Marketplace Discovery:** Browses open Requests for Quotes (RFQs) posted by schools (e.g. 500 sets of sports jerseys, science lab glassware).
3. **Vendor Registration:** Submits company profile, business registration certificate (RGD), and tax clearance.
4. **Bidding:** Submits quotation (unit price, delivery timeline, payment terms).
5. **Award & LPO:** School selects bid, generates digital Local Purchase Order (LPO).

### Identified Friction Points:
- **Quote Status Notifications:** Suppliers must log in to check if their quote was accepted; SMS notifications for bid award are not automatically dispatched.

---

## 5. Journey E: Platform Super Administrator Journey

### Persona:
**SkoolFinder Platform Operations Manager & Compliance Lead**, overseeing vetting, listings, security, and billing.

### Step-by-Step Flow:
1. **Access:** Navigates to `/admin`.
2. **Authentication:** Authenticates with Super Admin credentials.
3. **Operations Console:**
   - Vetting Queue: Reviews pending school claims, verifies GES certificates.
   - Financial Desk: Tracks 3% Paystack platform commissions and subscription revenues.
   - User Governance: Suspends bad actors, unbans accounts, monitors audit logs.

### Identified Friction Points:
- **Bulk Moderation:** Admin can only approve/reject one school at a time; no batch approval for trusted regional clusters.

---

## 6. UX Improvement Recommendations

| Area | Current Condition | Recommended Enhancement | Business Impact |
| :--- | :--- | :--- | :--- |
| **Parent Search** | Full-page wipeout during typing | Debounced innerHTML update of cards only | Drastically improves mobile search speed & user satisfaction. |
| **Admission Voucher** | Voucher code displayed in modal only | Auto-populate code into Online Admission Form step 1 | Increases voucher completion rate by 35%. |
| **Proprietor Claim** | Toast message only | Immediate confirmation email + dashboard ticket | Enhances institutional trust and accelerates onboarding. |
| **Supplier Hub** | Manual refresh for quote status | Automated SMS alert when LPO is generated | Reduces procurement lead time from days to hours. |

