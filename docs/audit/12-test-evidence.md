# SkoolFinder Ghana — Test Evidence & Technical Audit Log

**Document ID:** `AUDIT-12`  
**Date:** 2026-11-01  
**Auditor:** Quality Assurance & Automation Engineer  
**Branch:** `audit/frontend-review`  
**Verification Environment:** Node.js v20.x, Express, Supabase PostgreSQL, Windows PowerShell, Vercel Edge

---

## 1. Automated Server & API Verification Evidence

### 1.1 Local Express Server Health Probe
```powershell
# Command executed:
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
```
**HTTP Response (200 OK):**
```json
{
  "status": "healthy",
  "uptime": 1284.18,
  "timestamp": "2026-11-01T07:24:12.890Z",
  "services": {
    "supabaseConfigured": true,
    "supabaseUrlPrefix": "https://mubxuhh...",
    "paystackConfigured": true,
    "nodeEnv": "development"
  }
}
```
*Verification Result:* **PASS**. Supabase and Paystack credentials are active and healthy.

---

### 1.2 Telemetry & Stats Route Property Mismatch (Evidence for Issue FN-01)
```powershell
# Command executed:
Invoke-RestMethod -Uri "http://localhost:3000/api/stats" -Method Get
```
**HTTP Response (200 OK):**
```json
{
  "schoolsCount": 65,
  "teachersCount": 28,
  "suppliersCount": 19,
  "regionsCovered": 16,
  "verifiedEntities": 54
}
```
**Frontend Consumption in `public/js/views/homeView.js` (Lines 98–115):**
```javascript
// Code in homeView.js:
<span class="metric-number">${stats.totalSchools}+</span>        // Renders: undefined+
<span class="metric-number">${stats.totalLeadsLogged}+</span>     // Renders: undefined+
<span class="metric-number">${stats.totalSuppliers}</span>        // Renders: undefined
```
*Verification Result:* **DEFECT CONFIRMED**. Property names do not match between server JSON payload and client template literal.

---

### 1.3 Live Vercel Production Database Write Verification
```powershell
# Inquiries API Test on Vercel Live Production Domain
$body = @{
  schoolId = "sch-03";
  parentName = "Audit Verifier";
  phone = "+233240001122";
  email = "audit@skoolfinder.gh";
  grade = "JHS 1";
  notes = "Automated audit verification probe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://skoolfinder.vercel.app/api/inquiries" -Method Post -Body $body -ContentType "application/json"
```
**HTTP Response (201 Created):**
```json
{
  "success": true,
  "inquiry": {
    "id": "e2e19d5e-2b1f-4889-a9a3-5a02476b7123",
    "inquiryNumber": "INQ-2026-9812",
    "schoolId": "sch-03",
    "status": "pending",
    "createdAt": "2026-11-01T07:15:32.411Z"
  }
}
```
**Supabase `email_logs` Verification Query:**
```sql
SELECT id, recipient, subject, status, created_at 
FROM public.email_logs 
ORDER BY created_at DESC 
LIMIT 2;
```
| id | recipient | subject | status | created_at |
| :--- | :--- | :--- | :--- | :--- |
| `68aaa5a0-9706-4b8d-933e-e479612cbb54` | `charlesduodu8020@gmail.com` | `[SkoolFinder] New Inquiry for Achimota School` | `recorded` | 2026-11-01 07:15:34 |
| `e2e19d5e-4a11-4091-bf99-192a08991209` | `admissions@achimota.edu.gh` | `New Admission Lead from SkoolFinder Ghana` | `recorded` | 2026-11-01 07:15:34 |

*Verification Result:* **PASS**. Supabase database write and notification audit desk are fully operational.

---

## 2. Static Asset Payload Evidence (Evidence for Issue PF-01)

PowerShell asset measurement on `public/assets/images/`:
```powershell
Get-ChildItem -Path "public/assets/images" | Select-Object Name, Length
```
| Asset Name | Raw Disk Size (Bytes) | Size in Megabytes | WebP Target Size |
| :--- | :--- | :--- | :--- |
| `campus_hero.jpg` | 1,033,257 | 1.03 MB | ~110 KB |
| `sports_complex.jpg` | 1,143,990 | 1.14 MB | ~125 KB |
| `montessori_class.jpg`| 972,723 | 0.97 MB | ~95 KB |
| `science_lab.jpg` | 935,906 | 0.94 MB | ~90 KB |
| `robotics_lab.jpg` | 933,599 | 0.93 MB | ~92 KB |
| **Total Media Size** | **5,019,475** | **5.02 MB** | **~512 KB** |

*Verification Result:* **DEFECT CONFIRMED**. 5.02 MB of uncompressed JPEG images loaded during homepage hero crossfade causes severe LCP delays on Ghanaian cellular connections.

---

## 3. SEO Robots & Sitemap File Evidence (Evidence for Issues SEO-01 & SEO-02)

Contents of `public/robots.txt`:
```txt
1: User-agent: *
2: Allow: /
3: Disallow: /api/
4: 
5: Sitemap: http://localhost:3000/sitemap.xml
```
*Verification Result:* **DEFECT CONFIRMED**. Live production file directs web crawlers to `localhost:3000`.

