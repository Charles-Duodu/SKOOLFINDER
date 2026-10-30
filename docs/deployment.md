# SkoolFinder Ghana - Production Deployment & Domain Setup Guide

This guide details the procedure for deploying SkoolFinder Ghana to **Vercel** and configuring a custom production domain (e.g., `skoolfinder.com.gh` or `skoolfinder.com`).

---

## 1. Architecture Overview on Vercel

SkoolFinder Ghana runs on Vercel as a hybrid architecture:
- **Frontend SPA**: Vanilla JavaScript frontend served statically from `/public` with edge caching.
- **Backend API**: Node.js Express serverless API running from `/server.js` matching route `/api/*`.
- **Database & Storage**: Managed Supabase PostgreSQL with Row Level Security (RLS) and Supabase Storage for institutional document and photo uploads.
- **Payments**: Paystack Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Card processing with cryptographic webhook verification.
- **Emails**: Resend API / Nodemailer SMTP transactional engine with branded parent/school delivery.

---

## 2. Environment Variables Configuration

In your **Vercel Project Dashboard** (`Settings -> Environment Variables`), ensure the following variables are configured across **Production**, **Preview**, and **Development**:

| Variable Key | Required | Value / Description | Example |
|---|---|---|---|
| `NODE_ENV` | Yes | Runtime environment | `production` |
| `PORT` | Optional | Default server port (defaults to `3000`) | `3000` |
| `SUPABASE_URL` | Yes | Supabase Project API URL | `https://ngcuiochfazwuyemlkhn.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Public Supabase anon key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Service Role Secret Key (bypasses RLS for secure backend admin operations) | `eyJhbGciOi...` |
| `JWT_SECRET` | Yes | Platform authentication token signing secret | *(64-char random string)* |
| `PAYSTACK_SECRET_KEY` | Recommended | Live Paystack secret key (`sk_live_...` or `sk_test_...`) | `sk_test_...` |
| `PAYSTACK_PUBLIC_KEY` | Optional | Live Paystack public key | `pk_test_...` |
| `RESEND_API_KEY` | Optional | API key for transactional emails (`re_...`) | `re_...` |
| `EMAIL_FROM` | Optional | Verified sender email address | `admissions@skoolfinder.com.gh` |
| `APP_URL` | Optional | Canonical production URL | `https://skoolfinder.com.gh` |

> [!IMPORTANT]
> Whenever you add or edit environment variables in Vercel, you **must trigger a Redeploy** from the *Deployments* tab for the changes to take effect on the live website.

---

## 3. Redeploying on Vercel

If you recently saved environment variables:
1. Go to your **Vercel Dashboard**.
2. Select the **SKOOLFINDER** project.
3. Click on the **Deployments** tab.
4. Locate the most recent deployment (top of the list) and click the three dots (`...`) on the right.
5. Click **Redeploy**.
6. Wait 30–45 seconds until the status turns green (**Ready**).
7. Click the generated `.vercel.app` URL to verify the application.

---

## 4. Custom Domain Mapping (`skoolfinder.com.gh` / `skoolfinder.com`)

### Step 4.1: Add the Domain in Vercel
1. In the Vercel project, go to **Settings** > **Domains**.
2. Enter your custom domain (e.g. `skoolfinder.com.gh` or `www.skoolfinder.com.gh`).
3. Click **Add**.
4. Vercel will recommend adding both the apex (`skoolfinder.com.gh`) and the `www` subdomain with an automatic 301 redirect. Accept the recommendation.

### Step 4.2: Configure DNS Records at Your Registrar
Log into your DNS provider or registrar (e.g., Ghana Dot Com, Namecheap, GoDaddy, Cloudflare, Route 53):

#### For Apex Domain (`skoolfinder.com.gh`):
- **Type:** `A`
- **Name:** `@` (or leave blank)
- **Value:** `76.76.21.21`
- **TTL:** `Automatic` (or `3600`)

#### For Subdomain (`www.skoolfinder.com.gh`):
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com.`
- **TTL:** `Automatic` (or `3600`)

### Step 4.3: Automatic SSL Certificate
Once DNS propagates (typically 5 to 30 minutes), Vercel automatically requests and provisions a free **Let's Encrypt Wildcard SSL Certificate**. The padlock icon will appear green.

---

## 5. Paystack Webhook Configuration

To ensure Ghana Mobile Money and Card payments automatically grant verification badges without human intervention:

1. Log into your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer).
2. Go to **Settings** > **API Keys & Webhooks**.
3. Under **Live Webhook URL** (or Test Webhook URL during staging), paste:
   ```
   https://your-domain.vercel.app/api/payments/webhook
   ```
4. Click **Save Changes**.
5. Test a webhook event using Paystack's "Send Test Webhook" button. Your server responds with HTTP 200 `{ "received": true }`.

---

## 6. Production Health Check

Verify your live deployment by hitting the health check endpoint:
```bash
curl -I https://your-domain.vercel.app/api/health
```
**Expected Response:**
```http
HTTP/2 200 
content-type: application/json; charset=utf-8
```
```json
{
  "status": "online",
  "app": "SkoolFinder Ghana",
  "version": "2.0.0",
  "services": {
    "supabase": "connected",
    "paystack": "ready",
    "email": "resend (or simulated fallback)"
  }
}
```
