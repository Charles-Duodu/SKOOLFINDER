# 🇬🇭 SkoolFinder Ghana - Production Deployment & Cloud Packaging Guide

This document outlines the complete operational procedures for containerizing, deploying, and maintaining the **SkoolFinder Ghana Enterprise Platform** in production cloud environments (AWS, DigitalOcean, Linode, Hetzner, or local Ghanaian institutional on-premise servers).

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites & System Specifications](#2-prerequisites--system-specifications)
3. [Quick Start with Docker & Docker Compose](#3-quick-start-with-docker--docker-compose)
4. [Standalone Linux Deployment (Systemd & PM2)](#4-standalone-linux-deployment-systemd--pm2)
5. [Reverse Proxy & SSL/TLS Configuration (Nginx)](#5-reverse-proxy--ssltls-configuration-nginx)
6. [Ghanaian Payment & SMS Integrations](#6-ghanaian-payment--sms-integrations)
7. [Automated Backups & Disaster Recovery](#7-automated-backups--disaster-recovery)
8. [Health Checks & Observability](#8-health-checks--observability)
9. [Security Hardening & NaSIA Compliance](#9-security-hardening--nasia-compliance)

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |   Ghana Internet & Users    |
                      |  (Parents, Schools, Admins) |
                      +--------------+--------------+
                                     | HTTPS (443)
                                     v
                      +-----------------------------+
                      |         Nginx Proxy         |
                      |  - SSL / TLS Termination    |
                      |  - Gzip / Asset Caching     |
                      |  - Security CSP Headers     |
                      +--------------+--------------+
                                     | HTTP (3000)
                                     v
                      +-----------------------------+
                      |      Node.js Express 20     |
                      |   - SkoolFinder Server     |
                      |   - Akosua AI Chatbot       |
                      |   - QR Verification Hub     |
                      |   - CSSPS & WAEC Engine     |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
+-----------------------------+             +-----------------------------+
|    Persistent Database      |             |    Automated Backup Engine  |
|    `data/database.json`     |             |    SHA-256 + 30-day Prune   |
+-----------------------------+             +-----------------------------+
```

---

## 2. Prerequisites & System Specifications

| Resource | Recommended Minimum | Production Scale (100k+ MAU) |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu 22.04 LTS or Debian 12 | Ubuntu 24.04 LTS |
| **CPU** | 2 vCPU cores | 4+ vCPU cores |
| **RAM** | 2 GB RAM | 8 GB RAM |
| **Storage** | 20 GB SSD NVMe | 80 GB SSD NVMe |
| **Network** | 1 Gbps port | 1 Gbps redundant |
| **Timezone** | `Africa/Accra` (GMT / UTC+0) | `Africa/Accra` (GMT / UTC+0) |

---

## 3. Quick Start with Docker & Docker Compose

### Step 1: Clone Repository & Enter Directory
```bash
git clone https://github.com/skoolfinder-gh/school-directory-platform.git
cd school-directory-platform
```

### Step 2: Configure Environment
Copy `.env.example` to `.env` and fill in your production credentials:
```bash
cp .env.example .env
nano .env
```

### Step 3: Build and Launch Containers
```bash
docker compose up -d --build
```

### Step 4: Verify Container Health
```bash
docker compose ps
curl -i http://localhost:3000/health
```

Expected JSON response:
```json
{
  "status": "healthy",
  "uptime": 14.8,
  "timestamp": "2026-10-25T13:10:00.000Z",
  "environment": "production",
  "version": "1.0.0",
  "platform": "SkoolFinder Ghana Enterprise"
}
```

---

## 4. Standalone Linux Deployment (Systemd & PM2)

If you prefer running without Docker:

### Step 1: Install Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install PM2 Process Manager
```bash
sudo npm install -g pm2
```

### Step 3: Start Application with PM2
```bash
pm2 start server.js --name "skoolfinder-gh" -i max
pm2 save
pm2 startup
```

---

## 5. Reverse Proxy & SSL/TLS Configuration (Nginx)

### Step 1: Install Nginx & Certbot
```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### Step 2: Deploy Nginx Configuration
Copy the provided [`nginx.conf`](./nginx.conf) to `/etc/nginx/sites-available/skoolfinder.com.gh`:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/skoolfinder.com.gh
sudo ln -s /etc/nginx/sites-available/skoolfinder.com.gh /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Generate Let's Encrypt SSL Certificates
```bash
sudo certbot --nginx -d skoolfinder.com.gh -d www.skoolfinder.com.gh
```

---

## 6. Ghanaian Payment & SMS Integrations

### Hubtel Ghana SMS Integration
Hubtel handles bulk parent SMS notifications for:
- CSSPS BECE Placement confirmations
- Terminal report card releases
- Library book overdue alerts
- Sickbay allergy/asthma triage notices

Set in `.env`:
```ini
HUBTEL_CLIENT_ID=gh_hubtel_live_client_id_here
HUBTEL_CLIENT_SECRET=gh_hubtel_live_client_secret_here
HUBTEL_SENDER_ID=SkoolFinder
```

### Paystack Mobile Money Integration
Supports:
- **MTN Mobile Money** (MoMo)
- **Telecel Cash** (Vodafone Cash)
- **AT Money** (AirtelTigo)
- Local & International Visa/Mastercard

Set in `.env`:
```ini
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
```

Webhook URL to set in Paystack Dashboard:
```
https://skoolfinder.com.gh/api/invoices/paystack-webhook
```

---

## 7. Automated Backups & Disaster Recovery

### Manual Backup Execution
```bash
npm run backup
# or
node scripts/backup_db.js
```

### Automated Nightly Crontab Schedule
To execute automatic backups every night at 2:00 AM GMT (Accra time):
```bash
crontab -e
```
Add the following line:
```cron
0 2 * * * cd /var/www/skoolfinder && /usr/bin/node scripts/backup_db.js >> /var/log/skoolfinder_backup.log 2>&1
```

### Database Restoration Procedure
In the event of accidental deletion or hardware migration:
```bash
node scripts/backup_db.js --restore backups/db_backup_2026-10-25_131008.json
```
> [!NOTE]
> The restoration engine automatically creates a pre-restoration safety snapshot before overwriting the active database.

---

## 8. Health Checks & Observability

SkoolFinder provides native observability endpoints:
- **Uptime & Health:** `GET /health` or `GET /api/health`
- **School & Directory Aggregations:** `GET /api/stats`
- **Container Telemetry:** Handled via Docker `HEALTHCHECK`

---

## 9. Security Hardening & NaSIA Compliance

1. **Non-Root Execution:** The Docker container operates strictly under the unprivileged `node` UID.
2. **NaSIA Data Privacy Compliance:** Student biometric IDs, genotype/blood group data, and medical sickbay records are encrypted and protected under Ghana's Data Protection Act, 2012 (Act 843).
3. **CSP Security:** Strict Content-Security-Policy headers block Cross-Site Scripting (XSS) and unauthorized iframe clickjacking.
