# 🇬🇭 SchoolDirect Ghana - Live Payment & SMS Gateway Integration Guide

This guide walks you through activating real-world **Mobile Money (MTN MoMo, Telecel Cash, AT Money)** payments via **Paystack Ghana** and **SMS Parental Broadcasts** via **Hubtel Ghana**.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Paystack Ghana Setup (Mobile Money & Cards)](#2-paystack-ghana-setup-mobile-money--cards)
3. [Hubtel Ghana Setup (Bulk SMS Gateway)](#3-hubtel-ghana-setup-bulk-sms-gateway)
4. [Configuring Environment Variables (`.env`)](#4-configuring-environment-variables-env)
5. [Testing & Verifying Live Connection](#5-testing--verifying-live-connection)

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |   SchoolDirect Application  |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v (Payment Requests)                          v (Parent SMS Alerts)
+-----------------------------+               +-----------------------------+
|        Paystack Ghana       |               |         Hubtel Ghana        |
|  - MTN Mobile Money (*170#) |               |  - NCA Registered Sender ID |
|  - Telecel Cash (*110#)     |               |  - MTN, Telecel, AT Delivery|
|  - AT Money (*110#)         |               |  - Overdue Book Notices     |
|  - Visa / Mastercard        |               |  - Sickbay Medical Alerts   |
+--------------+--------------+               +-----------------------------+
               | Webhook
               v
+-----------------------------+
| /api/payments/paystack-webhook
| - Auto-settles fee invoice  |
| - Sends instant Hubtel SMS  |
+-----------------------------+
```

---

## 2. Paystack Ghana Setup (Mobile Money & Cards)

Paystack is licensed by the Bank of Ghana to process domestic Mobile Money and card transactions.

### Step 1: Create a Paystack Account
1. Visit **[https://dashboard.paystack.com/#/signup](https://dashboard.paystack.com/#/signup)**.
2. Select **Ghana** as your country and **Ghana Cedi (GHS)** as your settlement currency.
3. Choose **Starter Business** (for immediate testing/unregistered ventures) or **Registered Business** (for schools and registered companies).

### Step 2: KYC & Compliance Documents (Ghana Requirements)
To activate **Live Mode** and receive real funds into your school or corporate bank/MoMo account:
* **Identification:** Ghana Card (ECOWAS Identity Card) for proprietors/directors.
* **Business Registration:** Registrar General's Department (RGD) Certificate of Incorporation or Form A / Form 3.
* **Tax Identification:** GRA TIN (Taxpayer Identification Number).
* **Settlement Account:** Ghanaian Bank Account (Ecobank, GCB, Stanbic, etc.) or Official Corporate MoMo Merchant Account.

### Step 3: Enable Mobile Money Channels
1. In your Paystack Dashboard, navigate to **Settings** &rarr; **Preferences**.
2. Under **Accepted Payment Methods**, check:
   * ✅ **Mobile Money** (MTN MoMo, Telecel Cash, AT Money)
   * ✅ **Card** (Local and international Visa & Mastercard)

### Step 4: Retrieve API Keys
1. In your Paystack Dashboard, go to **Settings** &rarr; **API Keys & Webhooks**.
2. For testing, copy your **Test Secret Key** (`sk_test_...`) and **Test Public Key** (`pk_test_...`).
3. For live production, copy your **Live Secret Key** (`sk_live_...`) and **Live Public Key** (`pk_live_...`).

### Step 5: Configure Webhook URL
In **Settings** &rarr; **API Keys & Webhooks**, enter your live Webhook URL:
```
https://your-domain.com/api/payments/paystack-webhook
```
*(When testing locally on localhost, you can use [ngrok](https://ngrok.com) or the built-in sandbox simulator).*

---

## 3. Hubtel Ghana Setup (Bulk SMS Gateway)

Hubtel is the leading SMS and messaging gateway in Ghana, connecting directly to MTN, Telecel, and AT Ghana networks.

### Step 1: Create a Hubtel Developer Account
1. Visit **[https://hubtel.com/developers](https://hubtel.com/developers)**.
2. Click **Sign Up** and complete mobile number verification.

### Step 2: Apply for an Official Sender ID
By regulation of the National Communications Authority (NCA) of Ghana, all SMS messages must be sent from a pre-approved alphanumeric Sender ID:
1. In your Hubtel Console, navigate to **SMS** &rarr; **Sender IDs**.
2. Click **Add Sender ID** (e.g. `SchoolDirect` or your school's abbreviated name, maximum **11 characters**).
3. Upload a brief authorization letter on your school's official letterhead.
4. Approval typically takes **24–48 hours** by the NCA.

### Step 3: Retrieve API Credentials
1. In your Hubtel Developer Console, navigate to **API Accounts**.
2. Copy your **Client ID** (e.g. `gh_hubtel_live_client_id`).
3. Copy your **Client Secret** (e.g. `gh_hubtel_live_secret_key`).

### Step 4: Top Up SMS Credits
1. In the Hubtel Console, go to **Billing & Top-up**.
2. Purchase SMS units using MTN MoMo or Telecel Cash (~**GH₵ 0.045 per SMS**).

---

## 4. Configuring Environment Variables (`.env`)

Open your `.env` file in the project root:

```ini
# ==============================================================================
# Live Ghanaian Payment & SMS Gateway Credentials
# ==============================================================================

# Hubtel Ghana SMS Gateway
HUBTEL_CLIENT_ID=your_hubtel_client_id_here
HUBTEL_CLIENT_SECRET=your_hubtel_client_secret_here
HUBTEL_SENDER_ID=SchoolDirect

# Paystack Ghana Mobile Money & Card Gateway
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key_here
```

> [!NOTE]
> If keys are left empty or set to `mock`, SchoolDirect automatically operates in **Safe Sandbox Simulation Mode**, generating realistic MoMo prompts and simulated SMS delivery reports without crashing or making network calls.

---

## 5. Testing & Verifying Live Connection

You can check whether your live gateways are active at any time:

### Check Gateway Telemetry Status
Open your browser or run in terminal:
```bash
curl http://localhost:3000/api/gateways/status
```

Expected response when live keys are configured:
```json
{
  "hubtel": {
    "isConfigured": true,
    "senderId": "SchoolDirect",
    "mode": "live"
  },
  "paystack": {
    "isConfigured": true,
    "publicKey": "pk_live_...",
    "mode": "live"
  }
}
```

### Test Real SMS Dispatch
```bash
curl -X POST http://localhost:3000/api/notifications/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipientPhone": "0244318900",
    "recipientName": "Parent Name",
    "messageText": "SchoolDirect Ghana Test Alert"
  }'
```

### Test Paystack MoMo Initialization
```bash
curl -X POST http://localhost:3000/api/payments/momo/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "amountGHS": 150,
    "channels": ["mobile_money", "card"]
  }'
```
The response returns a secure `authorizationUrl` where parents enter their MTN MoMo or Telecel Cash phone number to authorize the prompt on their phone (`*170#` or `*110#`).
