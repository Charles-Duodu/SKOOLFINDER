# 🇬🇭 SkoolFinder Ghana — Complete Guide: Setting Gateways to Live Mode

This guide provides step-by-step instructions to switch your SkoolFinder platform from **Sandbox Simulation** to **100% Live Production Mode** for real Mobile Money payments, card billing, and SMS dispatch across Ghana.

---

## 📑 Table of Contents
1. [Overview: Simulation vs. Live Mode](#1-overview-simulation-vs-live-mode)
2. [Step 1: Set Up Live Paystack (MTN MoMo, Telecel Cash, AT Money & Cards)](#step-1-set-up-live-paystack)
3. [Step 2: Set Up Live Hubtel SMS (Ghana Telecom SMS Dispatch)](#step-2-set-up-live-hubtel-sms)
4. [Step 3: Cloud Database (Neon PostgreSQL) — Active](#step-3-cloud-database-neon-postgresql)
5. [Step 4: Verify Live Status](#step-4-verify-live-status)
6. [Summary of Production `.env` File](#summary-of-production-env-file)

---

## 1. Overview: Simulation vs. Live Mode

| Feature | 🟡 Sandbox Simulation Mode (Current) | 🟢 Live Production Mode |
| :--- | :--- | :--- |
| **MoMo Prompts** | Instant mock approval for risk-free testing | Real USSD prompts on user's phone (MTN, Telecel, AT) |
| **Card Payments** | Test card authorization flow | Real Visa/Mastercard processing |
| **SMS Notifications**| Instant audit-logged in JSON telemetry | Real SMS delivered to Ghanaian phone numbers via telcos |
| **Cost** | Free (no real funds deducted) | Real funds processed into school/merchant bank account |

SkoolFinder automatically inspects your keys:
- If keys contain `mock` or start with `sk_test_`, sandbox simulation is active.
- The moment `sk_live_` is supplied in `.env`, the system automatically engages real banking & MoMo rails.

---

## Step 1: Set Up Live Paystack

To accept real Mobile Money (MTN, Telecel, AT) and Debit Card payments in Ghana:

### 1.1 Complete Paystack Business Compliance
1. Go to **[https://dashboard.paystack.com](https://dashboard.paystack.com)** and log in.
2. Complete your **Compliance / Activation** (submit your Ghana Card, Business Registration Certificate from Registrar General's Department, and settlement bank account).

### 1.2 Switch to Live Mode
1. In the top corner of your Paystack dashboard, click the toggle to switch from **Test Mode** to **Live Mode**.

### 1.3 Obtain Live API Keys
1. Navigate to **Settings** ➔ **API Keys & Webhooks** ([dashboard.paystack.com/#/settings/developer](https://dashboard.paystack.com/#/settings/developer)).
2. Under **Live Keys**, copy:
   - **Live Public Key** (`pk_live_...`)
   - **Live Secret Key** (`sk_live_...`)

### 1.4 Configure Webhook URL (For instant auto-confirmation)
In the same settings page, set your **Live Webhook URL**:
- For local testing via tunnel: `https://your-domain.com/api/webhooks/paystack`
- Copy your **Webhook Secret Hash** if provided.

### 1.5 Update `.env`
Open your `.env` file and replace the test values:

```ini
# --- Paystack Ghana Mobile Money & Card Gateway (Production Keys) ---
PAYSTACK_PUBLIC_KEY=pk_live_<YOUR_LIVE_PUBLIC_KEY_FROM_DASHBOARD>
PAYSTACK_SECRET_KEY=sk_live_<YOUR_LIVE_SECRET_KEY_FROM_DASHBOARD>
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Step 2: Set Up Live Hubtel SMS

To send authentic SMS notifications for admission updates, fee invoices, and student ID alerts:

### 2.1 Register on Hubtel Developer Portal
1. Visit **[https://unity.hubtel.com](https://unity.hubtel.com)** and log in.
2. Ensure you have SMS credits in your account balance.

### 2.2 Register Sender ID
1. In Hubtel Unity, go to **SMS** ➔ **Sender IDs**.
2. Register your official Sender ID: `SkoolFinder` (or your school's brand name).
3. Wait for approval from the National Communications Authority (NCA) / Hubtel team.

### 2.3 Generate API Credentials
1. Go to **API Keys & Integrations**.
2. Copy your **Client ID** and **Client Secret**.

### 2.4 Update `.env`
In your `.env` file, replace the mock credentials:

```ini
# --- Hubtel Ghana SMS Gateway (Production Credentials) ---
HUBTEL_CLIENT_ID=your_real_hubtel_client_id
HUBTEL_CLIENT_SECRET=your_real_hubtel_client_secret
HUBTEL_SENDER_ID=SkoolFinder
```

---

## Step 3: Cloud Database (Neon PostgreSQL)

Your database is **already connected and migrated** to Neon Cloud PostgreSQL:
- **Engine**: `Postgres.database (PostgreSQL 16.15)`
- **Host**: `ep-tiny-violet-b4m7ip56-pooler.c-6.us-east-2.aws.neon.tech`
- **Tables**: All 11 core relational tables migrated with 100% data integrity.

### If you ever add new records and need to re-sync:
```powershell
npm run db:migrate
```

---

## Step 4: Verify Live Status

After updating your `.env` file:

### 4.1 Run the Terminal Gateway Diagnostic Suite
```powershell
node scripts/verify_gateways.js
```

You will see:
```text
💳 1. Paystack Mobile Money & Card Gateway
   Status:       🟢 LIVE PRODUCTION
   Public Key:   pk_live_<YOUR_PUBLIC_KEY>...
   Secret Key:   sk_live_<YOUR_SECRET_KEY>...
   Ping:         ✅ Verified with Paystack Live API

📱 2. Hubtel Ghana Telecom SMS Gateway
   Status:       🟢 LIVE PRODUCTION
   Sender ID:    SkoolFinder
   Delivery:     MTN, Telecel, AT Ghana
```

### 4.2 Check In-Browser Live Telemetry
Open these URLs in your browser:
- **Gateway Diagnostics**: [http://localhost:3000/api/admin/gateway-diagnostics](http://localhost:3000/api/admin/gateway-diagnostics)
  - Verify `"isLive": true` and `mode: "live_production"`.
- **Database Diagnostics**: [http://localhost:3000/api/admin/db-diagnostics](http://localhost:3000/api/admin/db-diagnostics)
  - Verify `activeEngine: "postgresql_enterprise"` and `connected: true`.

---

## Summary of Production `.env` File

Here is what your complete production `.env` should look like:

```ini
# --- Server & Security ---
PORT=3000
NODE_ENV=production
APP_URL=https://your-live-domain.com
TZ=Africa/Accra
JWT_SECRET=your_secure_random_jwt_secret_here

# --- Enterprise Cloud Database (Neon PostgreSQL) ---
DATABASE_URL=postgresql://Postgres.database_owner:npg_VjG87PxJERsq@ep-tiny-violet-b4m7ip56-pooler.c-6.us-east-2.aws.neon.tech/Postgres.database?sslmode=require&channel_binding=require
PG_POOL_MAX=20

# --- Paystack Ghana (Live Production Keys) ---
PAYSTACK_PUBLIC_KEY=pk_live_<YOUR_LIVE_PUBLIC_KEY_FROM_DASHBOARD>
PAYSTACK_SECRET_KEY=sk_live_<YOUR_LIVE_SECRET_KEY_FROM_DASHBOARD>
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_if_configured

# --- Hubtel Ghana SMS (Live Production Credentials) ---
HUBTEL_CLIENT_ID=your_hubtel_client_id
HUBTEL_CLIENT_SECRET=your_hubtel_client_secret
HUBTEL_SENDER_ID=SkoolFinder

# --- Telemetry & Backups ---
MAX_BACKUPS=30
```
