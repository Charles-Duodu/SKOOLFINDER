# 🇬🇭 SchoolDirect Ghana Enterprise Platform

[![Node.js CI](https://github.com/schooldirect-gh/school-directory-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/schooldirect-gh/school-directory-platform/actions/workflows/ci.yml)
[![Node Version](https://img.shields.io/badge/Node.js-v20.x%20LTS-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Alpine%203.19-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-purple.svg)](LICENSE)
[![Accreditation](https://img.shields.io/badge/Standards-NaSIA%20%7C%20GES%20%7C%20CSSPS-gold.svg)](https://nasia.gov.gh/)

**SchoolDirect Ghana** is a full-stack educational platform purpose-built for the Ghanaian basic, junior high, and senior high school ecosystem. It unifies **Parent Discovery**, **Digital Admissions Desk**, **Fee Invoicing with Mobile Money (MoMo)**, **Live School Bus Fleet Tracking**, **Student Sickbay Medical Passports**, **Library Circulation & SMS Notices**, **AI Admissions Guidance ("Akosua")**, **Laminated Digital Student ID Cards with Optical QR Verification**, and **B2B Educational Procurement**.

---

## 🚀 Key Platform Capabilities (17 Operational Features)

### 1. Parent Discovery & Commercial Engines
* **Multi-Facet School Directory:** Filter by Region (*Greater Accra, Ashanti*), Suburb (*East Legon, Cantonments, Spintex, Airport Residential, Ahodwo, Nhyiaeso*), Level (*Crèche to SHS*), Curricula (*GES, Cambridge CIE, IB, Montessori*), and Attendance (*Day vs Boarding*).
* **Side-by-Side School Comparison:** Compare 3 schools on fees, student-teacher ratios, amenities, and curricula.
* **Interactive Geolocation & Leaflet Maps:** Campus map view with regional Accra/Kumasi focal points.
* **Interactive School Fee Calculator:** Termly and annual fee projections with bus routes and lunch plans.
* **Mobile Money Payment Engine:** Integrated MTN MoMo (`*170#`), Telecel Cash (`*110#`), AT Money, and Visa/Mastercard flow with official electronic receipts (`SD-REC-XXXXXXXX`).
* **Official BECE CSSPS Predictor:** Computes dynamic raw aggregates (4 core + 2 best electives) and matches Category A, B, and C/TVET schools to minimize self-placement risks.

### 2. Operational School Management Modules
* **Digital Admissions Desk & Pipeline:** Parent application multi-step wizard, printable admission slips, and school admin CSV roster export.
* **Continuous Assessment & Terminal Report Cards:** GES/NaSIA compliant stamped PDF terminal report cards.
* **School Transport & Live Bus Fleet Tracker:** Bus routes (East Legon, Airport, Spintex corridors), DVLA Class F chaperone credentials, live GPS progression, and emergency delay SMS broadcaster.
* **Co-Curricular & Clubs Management:** 5 societies (Robotics Lab, Debate, Swimming, Cadet Corps, Chess) with dues invoicing and merit badge rolls.
* **Alumni Mentorship Network:** Global alumni network across FinTech, Medicine, Investment Banking, and Law with Google Meet scheduling.
* **Health Sickbay & Student Dietary Passports:** Ghana Health Service (GHS) compliant medical passports, Blood/Genotype (O+, AA) tracking, acute peanut/groundnut allergy red flags, and nurse triage logs.

### 3. Advanced Expansion Modules
* **Digital School Library & Textbook Lending:** Circulation engine for Aki-Ola series, Cambridge past papers, and automated overdue parent SMS dispatches.
* **AI Admissions Chatbot ("Akosua"):** Intelligent floating assistant answering CSSPS raw score cut-offs, Cambridge vs GES comparisons, fee structures, and bus routes.
* **Digital Student ID Cards with QR Verification:** CR80 portrait laminated badges with vector SVG QR codes, blood group, bus pass badge, and simulated optical turnstile scanner.
* **Production Cloud Packaging:** Docker containerization, Compose orchestration, Nginx reverse proxy template, and SHA-256 automated backup engines.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Runtime** | Node.js 20 LTS, Express 5, CORS |
| **Database** | Hydrated relational in-memory database with persistent JSON storage (`data/database.json`) |
| **Frontend UI** | Modern Vanilla CSS (Custom Design System, Zero Tailwind dependency), Semantic HTML5 |
| **Client Routing** | Single Page Application (SPA) Hash Router with browser history push state |
| **Mapping & QR** | Leaflet.js interactive maps, Pure Vector SVG QR Matrix Engine |
| **PWA & Offline** | Web App Manifest, Service Worker (`sw.js`) with cache-first and stale-while-revalidate strategies |
| **DevOps & Cloud** | Docker (Alpine Node 20), Docker Compose, Nginx (SSL/TLS + Gzip), GitHub Actions CI/CD |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
* Node.js v20.x or higher
* npm v10.x or higher

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/schooldirect-gh/school-directory-platform.git
cd school-directory-platform

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env

# 4. Start the server
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Quick Start with Docker

```bash
# Build and run containers in detached mode
docker compose up -d --build

# Inspect container healthcheck
docker compose ps

# Check application health
curl -i http://localhost:3000/health
```

---

## 🧪 Automated Testing & Database Backups

```bash
# Run automated API & Digital ID verification tests
npm test

# Run manual database backup snapshot with SHA-256 verification
npm run backup

# Restore database from snapshot
node scripts/backup_db.js --restore backups/db_backup_YYYY-MM-DD_HHmmss.json
```

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Application healthcheck & container uptime |
| `GET` | `/api/stats` | Aggregated directory statistics |
| `GET` | `/api/schools` | Search and filter schools |
| `GET` | `/api/schools/:id` | Detailed school profile & lead logger |
| `POST` | `/api/admissions/apply` | Submit student admission application |
| `POST` | `/api/payments/momo/initialize` | Initialize Mobile Money payment |
| `POST` | `/api/ai/chat` | Query Akosua AI admissions assistant |
| `GET` | `/api/students/digital-ids` | List student digital ID credentials |
| `POST` | `/api/students/verify-id` | Optical turnstile gate verification |
| `GET` | `/api/library/books` | Catalogue of library books |
| `POST` | `/api/library/loans/:id/return` | Process library book return |

For complete deployment and Nginx instructions, refer to [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 📜 License & Compliance
* Licensed under the **ISC License**.
* Compliant with Ghana Data Protection Act, 2012 (Act 843) and National Schools Inspectorate Authority (NaSIA) school data standards.
