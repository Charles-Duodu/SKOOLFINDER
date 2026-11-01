# SkoolFinder Ghana — SaaS Readiness & Multi-Tenant Architecture Review

**Document ID:** `AUDIT-11`  
**Date:** 2026-11-01  
**Auditor:** Senior Full-Stack Architect & SaaS Product Manager  
**Branch:** `audit/frontend-review`  
**Target Architecture:** Multi-Tenant Education Operating System & B2B Marketplace

---

## 1. Executive Summary & SaaS Maturity Model

SkoolFinder is transitioning from a static school discovery directory into a **full-fledged B2B2C Educational SaaS Platform**. The platform currently exhibits Level 2.5 maturity on the SaaS capability model:

```
[Level 1: Static Directory]  --->  [Level 2: Lead Gen Marketplace]  --->  [Level 3: Multi-Tenant School OS]
       (COMPLETED)                           (ACTIVE & LIVE)                      (PARTIALLY COMPLETE)
- Basic listings                   - Admissions Vouchers (MoMo)         - Bursar Invoicing & MoMo
- Address & phone                  - Paystack Commission Engine         - Bus Fleet Tracker
- Map pins                         - Tutor & Supplier Bidding           - Report Card Generator
                                                                        - Sickbay & Library Logs
```

### SaaS Readiness Scorecard:
- **Multi-Tenancy & Data Isolation:** 82 / 100
- **Subscription Billing & Paystack Integration:** 88 / 100
- **Admissions Lead Management Funnel:** 85 / 100
- **Operational School Management Modules:** 80 / 100
- **Telemetry, Reporting & Analytics:** 75 / 100

**Overall SaaS Readiness Score:** **82 / 100**

---

## 2. Multi-Tenant Architecture & Data Isolation

### 2.1 Tenant Boundary Isolation
Each school operates as a distinct tenant identified by `schoolId` (e.g. `sch-gis-accra`, `sch-sos-hgics`, or UUIDs in PostgreSQL).
- **Database Layer:** All operational tables (`admissions_applications`, `fee_invoices`, `sms_logs`, `transport_routes`, `sickbay_logs`, `library_loans`) include a `school_id` foreign key with indexed lookups.
- **RLS Policies:** Supabase Row-Level Security restricts school administrators from viewing other schools' bursar ledgers or student dossiers.
- **Frontend Context:** When a school administrator logs in, `State.currentUser.schoolId` automatically scopes the School Management OS (`/schools`) to their campus.

### 2.2 Role-Based Access Control (RBAC) Matrix
The platform supports 5 distinct role profiles:

| Role Identifier | Description | Allowed Portals | Key SaaS Privileges |
| :--- | :--- | :--- | :--- |
| `parent` | Parent / Guardian | `/parents`, Discovery | Pay fees, track bus GPS, view report cards, hire tutors. |
| `school_admin` | Proprietor / Principal / Bursar | `/schools`, Discovery | Create invoices, broadcast SMS, manage admissions, review RFQ bids. |
| `teacher` | Private Tutor / Classroom Teacher | `/teachers`, Discovery | Advertise tutoring, receive bookings, apply to school vacancies. |
| `supplier` | Educational Vendor | `/suppliers`, Discovery | Browse school RFQs, submit quotes, receive digital LPOs. |
| `super_admin` | Platform Operator / NaSIA Liaison | All Portals + `/admin` | Moderate school claims, audit platform revenue, toggle account status. |

---

## 3. Monetization & Revenue Stream Architecture

The platform architecture accommodates four distinct revenue models:

```
                                  +------------------------------+
                                  |   SkoolFinder Revenue Hub    |
                                  +------------------------------+
                                                 |
             +--------------------+--------------+--------------+---------------------+
             |                    |                             |                     |
             v                    v                             v                     v
   [1. School SaaS Plans] [2. Admission Vouchers]      [3. Tutor Pro Subs]   [4. B2B RFQ Escrow]
   - Basic (Free)         - GH₵ 100 - 250 / form       - GH₵ 80 / month      - 1.5% fee on awarded
   - Pro (GH₵ 450/mo)     - 10% platform take-rate     - Featured listing      school procurement
   - Enterprise Campus    - Instant MoMo payout to       in Kumasi & Accra     purchase orders (LPO)
     (GH₵ 1,200/mo)         school bursar account
```

1. **School SaaS Subscriptions:**
   - Managed via Paystack subscription plans (`starter_monthly`, `pro_quarterly`, `campus_annual`).
   - Integrated into `Modals.openSaaSSubscriptionModal(school)`.
2. **Online Admission Form Vouchers:**
   - Parents purchase digital admission vouchers (`VOUCH-XXXXXX`) via Paystack MoMo.
   - Proceeds are split: 90% credited to the school, 10% retained by SkoolFinder as platform fee.
3. **Private Tutor Marketplace Subscriptions:**
   - Tutors pay GH₵ 80/month for verified NTC badge placement and top ranking in parent search results.
4. **Institutional B2B Procurement Commission:**
   - 1.5% escrow transaction fee on accepted Local Purchase Orders (LPOs) between schools and accredited uniform/lab equipment suppliers.

---

## 4. Operational Gaps for Full SaaS Production Readiness

1. **Automated Dunning & Inactive Subscription Handling:**
   - If a school's Paystack card/MoMo recurrent charge fails, the platform currently lacks an automatic grace-period workflow that gracefully downgrades the school to the Basic tier.
2. **Custom Domain Support for Elite Schools:**
   - Premium schools (e.g. Ghana International School) have requested whitelabel URLs (e.g. `admissions.gis.edu.gh`). The frontend client-side router needs multi-domain awareness.
3. **Parent WhatsApp Transaction Receipts:**
   - While email receipts are sent via Resend, parents in Ghana overwhelmingly prefer receiving PDF receipt confirmation via WhatsApp API (Infobip / Twilio).

