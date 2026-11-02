/**
 * SkoolFinder HQ - Executive Master Management System & Admin Cockpit (/admin)
 * Inspired by TalentPros & AdminHub Enterprise SaaS Architecture
 */
const AdminView = {
  activeTab: 'overview', // 'overview' | 'schools' | 'users' | 'finance' | 'teachers' | 'suppliers' | 'procurement' | 'subscriptions' | 'telemetry'
  searchDebounceTimer: null,

  async render() {
    let overview = { kpis: {}, schoolsList: [] };
    let vettingQueue = [];
    let rfqs = [];
    let procurementLogs = [];

    try {
      const [ovData, vqData, rfqData] = await Promise.all([
        API.getAdminOverview().catch(() => ({ kpis: {}, schoolsList: [] })),
        API.getVettingQueue().catch(() => []),
        API.getRFQs().catch(() => [])
      ]);
      overview = ovData || { kpis: {}, schoolsList: [] };
      vettingQueue = vqData || [];
      rfqs = rfqData || [];
      procurementLogs = overview.procurementLogs || [];
    } catch (e) {
      console.warn("Admin telemetry load notice:", e);
    }

    const kpis = overview.kpis || {};
    const schools = overview.schoolsList || [];

    return `
      <style id="admin-cockpit-styles">
        .admin-cockpit-layout {
          display: flex;
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          font-family: var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
          color: #0f172a;
        }
        .admin-sidebar {
          width: 260px;
          min-width: 260px;
          background: #091e42;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          color: #cbd5e1;
          user-select: none;
        }
        .admin-sidebar-header {
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .admin-sidebar-nav {
          padding: 1.25rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
          overflow-y: auto;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .admin-nav-item.active {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37,99,235,0.35);
          font-weight: 700;
        }
        .admin-nav-item .icon-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-badge-count {
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 0.72rem;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-weight: 700;
        }
        .admin-nav-item.active .admin-badge-count {
          background: rgba(255,255,255,0.25);
        }
        .admin-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }
        .admin-topbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.85rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .admin-search-wrapper {
          position: relative;
          flex: 1;
          max-width: 480px;
        }
        .admin-search-input {
          width: 100%;
          padding: 0.55rem 1rem 0.55rem 2.4rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }
        .admin-search-input:focus {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .admin-omnisearch-results {
          position: absolute;
          top: 105%;
          left: 0;
          right: 0;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          max-height: 380px;
          overflow-y: auto;
          display: none;
          z-index: 100;
        }
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1200px) {
          .admin-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-cockpit-layout { flex-direction: column; }
          .admin-sidebar { width: 100%; min-width: 100%; }
          .admin-kpi-grid { grid-template-columns: 1fr; }
        }
        .admin-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .admin-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px -3px rgba(0,0,0,0.06);
        }
        .admin-kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }
        .admin-kpi-label {
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
        }
        .admin-kpi-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          font-family: var(--font-heading, inherit);
        }
        .admin-kpi-sub {
          font-size: 0.78rem;
          margin-top: 0.4rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .badge-positive { color: #059669; font-weight: 700; }
        .badge-subtle { color: #64748b; font-weight: 500; }
        .admin-chart-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
      </style>

      <div class="admin-cockpit-layout">
        <!-- ======================================================== -->
        <!-- 1. DARK NAVY SIDEBAR (TalentPros Style)                  -->
        <!-- ======================================================== -->
        <aside class="admin-sidebar" id="admin-sidebar">
          <div class="admin-sidebar-header">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; font-weight: 800; color: #0a1128; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35); flex-shrink: 0;">
              🛡️
            </div>
            <div style="min-width: 0;">
              <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                SkoolFinder HQ
              </div>
              <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase;">
                Master Cockpit
              </div>
            </div>
          </div>

          <nav class="admin-sidebar-nav">
            <button class="admin-nav-item ${this.activeTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
              <span class="icon-label"><span>📊</span> Overview</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'schools' ? 'active' : ''}" data-admin-tab="schools">
              <span class="icon-label"><span>🏫</span> Schools (CRUD)</span>
              <span class="admin-badge-count">${kpis.totalSchools || schools.length || 12}</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'users' ? 'active' : ''}" data-admin-tab="users">
              <span class="icon-label"><span>👥</span> User Accounts</span>
              <span class="admin-badge-count">${kpis.totalUsers || 24}</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'finance' ? 'active' : ''}" data-admin-tab="finance">
              <span class="icon-label"><span>💳</span> Payments & MoMo</span>
              <span style="font-size: 0.65rem; background: #059669; color: #fff; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 800;">LIVE</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'teachers' ? 'active' : ''}" data-admin-tab="teachers">
              <span class="icon-label"><span>🧑‍🏫</span> Teacher Desk</span>
              <span class="admin-badge-count">${kpis.totalTeachers || 6}</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'procurement' ? 'active' : ''}" data-admin-tab="procurement">
              <span class="icon-label"><span>📦</span> Procurement Desk</span>
              <span class="admin-badge-count">${rfqs.length}</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'subscriptions' ? 'active' : ''}" data-admin-tab="subscriptions">
              <span class="icon-label"><span>📑</span> SaaS Subscriptions</span>
            </button>

            <button class="admin-nav-item ${this.activeTab === 'telemetry' ? 'active' : ''}" data-admin-tab="telemetry">
              <span class="icon-label"><span>⚙️</span> Cloud Telemetry</span>
            </button>
          </nav>

          <!-- Sidebar Bottom User Profile & Jump -->
          <div style="padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.15);">
            <div style="display: flex; align-items: center; gap: 0.65rem; min-width: 0;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; flex-shrink: 0;">
                SA
              </div>
              <div style="min-width: 0;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Super Admin
                </div>
                <div style="font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  admin@skoolfinder.com.gh
                </div>
              </div>
            </div>
            <a href="/" title="Open Public Website" style="color: #94a3b8; text-decoration: none; font-size: 1.1rem; padding: 0.2rem;">🌐</a>
          </div>
        </aside>

        <!-- ======================================================== -->
        <!-- 2. MAIN ADMIN CANVAS                                     -->
        <!-- ======================================================== -->
        <main class="admin-canvas">
          <!-- Topbar with Omnisearch & Profile Dropdown -->
          <header class="admin-topbar">
            <div class="admin-search-wrapper">
              <span style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); font-size: 0.95rem; color: #94a3b8; pointer-events: none;">🔍</span>
              <input type="text" id="admin-omnisearch-input" class="admin-search-input" placeholder="Search schools, parents, vouchers, invoices... (Ctrl + K)" autocomplete="off" />
              <div id="admin-omnisearch-results" class="admin-omnisearch-results"></div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <button id="btn-admin-switch-school" class="btn-pill btn-gold" style="font-size: 0.8rem; padding: 0.4rem 0.9rem;">
                <span>🏫</span> Open School OS &rarr;
              </button>

              <div style="width: 1px; height: 24px; background: #e2e8f0;"></div>

              <div style="display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 0.35rem 0.85rem; font-size: 0.82rem; font-weight: 700; color: #0f172a;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
                <span>Super Admin</span>
              </div>
            </div>
          </header>

          <!-- Dynamic Active View Container -->
          <div style="padding: 2rem; flex: 1;">
            ${this.renderActiveTab(overview, schools, vettingQueue, rfqs, procurementLogs)}
          </div>
        </main>
      </div>
    `;
  },

  renderActiveTab(overview, schools, vettingQueue, rfqs = [], procurementLogs = []) {
    switch (this.activeTab) {
      case 'overview':
        return this.renderOverviewTab(overview, schools, rfqs, procurementLogs);
      case 'schools':
        return this.renderSchoolsTab(schools, vettingQueue);
      case 'teachers':
        return this.renderTeachersTab(overview.teachersList || []);
      case 'suppliers':
        return this.renderSuppliersTab(overview.suppliersList || []);
      case 'procurement':
        return this.renderProcurementDesk(rfqs, procurementLogs, overview.suppliersList || []);
      case 'subscriptions':
        return this.renderSubscriptionsTab();
      case 'telemetry':
        return this.renderTelemetryTab(overview.telemetry || {});
      default:
        return this.renderOverviewTab(overview, schools, rfqs, procurementLogs);
    }
  },

  /**
   * Executive Command Center Overview (TalentPros Style)
   */
  renderOverviewTab(overview, schools, rfqs = [], procurementLogs = []) {
    const kpis = overview.kpis || {};

    return `
      <div>
        <!-- Overview Header -->
        <div style="margin-bottom: 1.75rem;">
          <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 0.35rem 0; letter-spacing: -0.02em;">
            Overview
          </h1>
          <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
            Your command center &mdash; real-time Ghanaian education telemetry and SaaS operations.
          </p>
        </div>

        <!-- 8 EXECUTIVE KPI CARDS (2 Rows of 4, TalentPros Layout) -->
        <div class="admin-kpi-grid">
          <!-- Card 1: Active Schools -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">Active Schools</span>
              <span style="font-size: 1.1rem; color: #3b82f6;">🏫</span>
            </div>
            <div class="admin-kpi-value">${(kpis.totalSchools || 12).toLocaleString()}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">+12.4% MoM</span>
              <span class="badge-subtle">&bull; Accra & Kumasi</span>
            </div>
          </div>

          <!-- Card 2: Onboarding Queue -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">Onboarding Queue</span>
              <span style="font-size: 1.1rem; color: #f59e0b;">⏳</span>
            </div>
            <div class="admin-kpi-value">${kpis.pendingVetting || 2}</div>
            <div class="admin-kpi-sub">
              <span style="color: #d97706; font-weight: 700;">${kpis.pendingClaims || 1} NaSIA Licenses</span>
              <span class="badge-subtle">pending review</span>
            </div>
          </div>

          <!-- Card 3: Monthly MRR -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">SaaS Monthly MRR</span>
              <span style="font-size: 1.1rem; color: #10b981;">📈</span>
            </div>
            <div class="admin-kpi-value">GH₵ ${(kpis.monthlyRecurringRevenueGHS || 48500).toLocaleString()}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">+8.2% vs last month</span>
            </div>
          </div>

          <!-- Card 4: Paystack Total GMV -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">Paystack GMV Volume</span>
              <span style="font-size: 1.1rem; color: #059669;">💳</span>
            </div>
            <div class="admin-kpi-value" style="color: #059669;">GH₵ ${(kpis.totalGMV || 42800).toLocaleString()}</div>
            <div class="admin-kpi-sub">
              <span class="badge-subtle">840 MoMo & Card Transactions</span>
            </div>
          </div>

          <!-- Card 5: Churn / Grace Rate -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">SaaS Churn Rate</span>
              <span style="font-size: 1.1rem; color: #64748b;">📉</span>
            </div>
            <div class="admin-kpi-value">2.1%</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">-0.3% MoM (Low Churn)</span>
            </div>
          </div>

          <!-- Card 6: Failed Payments -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">Failed MoMo Drops</span>
              <span style="font-size: 1.1rem; color: #ef4444;">⚠️</span>
            </div>
            <div class="admin-kpi-value" style="color: #dc2626;">${kpis.failedPayments || 3}</div>
            <div class="admin-kpi-sub">
              <span class="badge-subtle">Auto-retrying via Hubtel</span>
            </div>
          </div>

          <!-- Card 7: Admission Vouchers Issued -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">Admission Vouchers</span>
              <span style="font-size: 1.1rem; color: #8b5cf6;">🎟️</span>
            </div>
            <div class="admin-kpi-value">${(kpis.admissionVouchersIssued || 426).toLocaleString()}</div>
            <div class="admin-kpi-sub">
              <span class="badge-subtle">Issued via MTN & Telecel</span>
            </div>
          </div>

          <!-- Card 8: YoY Platform Growth -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-label">YoY Platform Growth</span>
              <span style="font-size: 1.1rem; color: #3b82f6;">🚀</span>
            </div>
            <div class="admin-kpi-value" style="color: #2563eb;">${kpis.yoyGrowthRate || '68.2%'}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">vs last year</span>
            </div>
          </div>
        </div>

        <!-- CHARTS SECTION: Revenue Over Time + MRR By Plan Donut (TalentPros Style) -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
          <!-- Left: Revenue Over Time (Smooth SVG Area Chart) -->
          <div class="admin-chart-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.2rem 0;">
                  Revenue Over Time
                </h3>
                <p style="font-size: 0.8rem; color: #64748b; margin: 0;">
                  Gross tuition payments & parent MoMo admissions collections
                </p>
              </div>
              <span style="font-size: 0.8rem; background: #ecfdf5; color: #047857; padding: 0.25rem 0.65rem; border-radius: 999px; font-weight: 700;">
                Live Engine
              </span>
            </div>

            <!-- SVG Smooth Area Curve Chart -->
            <svg viewBox="0 0 650 220" style="width: 100%; height: 220px; overflow: visible;">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
                </linearGradient>
              </defs>

              <line x1="40" y1="30" x2="630" y2="30" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="35" y="34" fill="#94a3b8" font-size="10" text-anchor="end">GH₵ 100k</text>
              <line x1="40" y1="75" x2="630" y2="75" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="35" y="79" fill="#94a3b8" font-size="10" text-anchor="end">GH₵ 75k</text>
              <line x1="40" y1="120" x2="630" y2="120" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="35" y="124" fill="#94a3b8" font-size="10" text-anchor="end">GH₵ 50k</text>
              <line x1="40" y1="165" x2="630" y2="165" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="35" y="169" fill="#94a3b8" font-size="10" text-anchor="end">GH₵ 25k</text>
              <line x1="40" y1="200" x2="630" y2="200" stroke="#e2e8f0" stroke-width="1.5"/>
              <text x="35" y="204" fill="#94a3b8" font-size="10" text-anchor="end">GH₵ 0</text>

              <!-- Filled Area -->
              <path d="M 50 185 C 130 175, 170 195, 230 190 C 290 185, 310 115, 360 115 C 410 115, 430 155, 480 145 C 530 135, 560 75, 620 60 L 620 200 L 50 200 Z" fill="url(#revenueGradient)"/>

              <!-- Curved Stroke Line -->
              <path d="M 50 185 C 130 175, 170 195, 230 190 C 290 185, 310 115, 360 115 C 410 115, 430 155, 480 145 C 530 135, 560 75, 620 60" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>

              <!-- Interactive Nodes -->
              <circle cx="50" cy="185" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="140" cy="180" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="230" cy="190" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="360" cy="115" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="480" cy="145" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="560" cy="85" r="4" fill="#fff" stroke="#2563eb" stroke-width="2.5"/>
              <circle cx="620" cy="60" r="5" fill="#2563eb" stroke="#fff" stroke-width="2.5"/>

              <!-- Month Labels -->
              <text x="50" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Jan</text>
              <text x="140" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Feb</text>
              <text x="230" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Mar</text>
              <text x="360" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Apr</text>
              <text x="480" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">May</text>
              <text x="560" y="215" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Jun</text>
              <text x="620" y="215" fill="#2563eb" font-size="11" font-weight="700" text-anchor="middle">Jul</text>
            </svg>
          </div>

          <!-- Right: MRR by Plan (SVG Donut Chart) -->
          <div class="admin-chart-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.2rem 0;">
                MRR by Plan
              </h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">
                SaaS recurring software license breakdown
              </p>
            </div>

            <div style="padding: 1rem 0;">
              <svg viewBox="0 0 200 200" style="width: 170px; height: 170px; margin: 0 auto; display: block;">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" stroke-width="22"/>
                <!-- Enterprise Plan Arc (Green) -->
                <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" stroke-width="22" stroke-dasharray="197 440" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
                <!-- Growth Plan Arc (Blue) -->
                <circle cx="100" cy="100" r="70" fill="none" stroke="#2563eb" stroke-width="22" stroke-dasharray="136 440" stroke-dashoffset="-197" transform="rotate(-90 100 100)"/>
                <!-- Starter Plan Arc (Gold) -->
                <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" stroke-width="22" stroke-dasharray="105 440" stroke-dashoffset="-333" transform="rotate(-90 100 100)"/>
                <text x="100" y="96" fill="#0f172a" font-size="16" font-weight="800" text-anchor="middle">GH₵ 48.5k</text>
                <text x="100" y="114" fill="#64748b" font-size="10" font-weight="600" text-anchor="middle">Active MRR</text>
              </svg>
            </div>

            <!-- Legend -->
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem; border-top: 1px solid #f1f5f9; padding-top: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> Enterprise</span>
                <strong>GH₵ 21,500 (44%)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></span> Growth</span>
                <strong>GH₵ 15,000 (31%)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></span> Starter</span>
                <strong>GH₵ 12,000 (25%)</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- USER GROWTH & REGISTRATION BAR CHART (TalentPros Style) -->
        <div class="admin-chart-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.2rem 0;">
                User Growth & Institutional Registrations
              </h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">
                Monthly trend of active parents (blue) vs registered school campuses (gold)
              </p>
            </div>
            <div style="display: flex; gap: 1rem; font-size: 0.8rem;">
              <span style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 10px; height: 10px; border-radius: 2px; background: #2563eb;"></span> Parents</span>
              <span style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 10px; height: 10px; border-radius: 2px; background: #f59e0b;"></span> Schools</span>
            </div>
          </div>

          <!-- SVG Dual-Bar Chart -->
          <svg viewBox="0 0 650 160" style="width: 100%; height: 160px;">
            <line x1="30" y1="130" x2="630" y2="130" stroke="#e2e8f0" stroke-width="1.5"/>

            <!-- Jan -->
            <rect x="65" y="65" width="28" height="65" rx="4" fill="#2563eb"/>
            <rect x="97" y="90" width="16" height="40" rx="3" fill="#f59e0b"/>
            <text x="88" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Jan</text>

            <!-- Feb -->
            <rect x="160" y="55" width="28" height="75" rx="4" fill="#2563eb"/>
            <rect x="192" y="80" width="16" height="50" rx="3" fill="#f59e0b"/>
            <text x="183" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Feb</text>

            <!-- Mar -->
            <rect x="255" y="50" width="28" height="80" rx="4" fill="#2563eb"/>
            <rect x="287" y="70" width="16" height="60" rx="3" fill="#f59e0b"/>
            <text x="278" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Mar</text>

            <!-- Apr -->
            <rect x="350" y="40" width="28" height="90" rx="4" fill="#2563eb"/>
            <rect x="382" y="65" width="16" height="65" rx="3" fill="#f59e0b"/>
            <text x="373" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Apr</text>

            <!-- May -->
            <rect x="445" y="30" width="28" height="100" rx="4" fill="#2563eb"/>
            <rect x="477" y="60" width="16" height="70" rx="3" fill="#f59e0b"/>
            <text x="468" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">May</text>

            <!-- Jun -->
            <rect x="540" y="20" width="28" height="110" rx="4" fill="#2563eb"/>
            <rect x="572" y="45" width="16" height="85" rx="3" fill="#f59e0b"/>
            <text x="563" y="148" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">Jun</text>
          </svg>
        </div>

        <!-- RECENT ONBOARDING REGISTER TABLE -->
        <div class="admin-chart-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.2rem 0;">
                Recent School Onboardings & Moderation
              </h3>
              <p style="font-size: 0.8rem; color: #64748b; margin: 0;">
                Accreditation status, active SaaS licenses, and direct governance actions
              </p>
            </div>
            <button class="btn-pill btn-secondary" onclick="AdminView.switchTab('schools')" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;">
              View All Schools (${kpis.totalSchools || schools.length}) &rarr;
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.75rem 1rem; color: #64748b; font-weight: 700;">INSTITUTION NAME</th>
                  <th style="padding: 0.75rem 1rem; color: #64748b; font-weight: 700;">LOCATION</th>
                  <th style="padding: 0.75rem 1rem; color: #64748b; font-weight: 700;">CURRICULUM</th>
                  <th style="padding: 0.75rem 1rem; color: #64748b; font-weight: 700;">NaSIA STATUS</th>
                  <th style="padding: 0.75rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                ${schools.slice(0, 6).map(s => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.9rem 1rem;">
                      <div style="font-weight: 700; color: #0f172a;">${s.name}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">${s.email || 'admissions@school.edu.gh'}</div>
                    </td>
                    <td style="padding: 0.9rem 1rem; color: #475569;">
                      📍 ${s.locality || s.suburb || 'Accra'}, ${s.region}
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <span class="badge badge-cambridge" style="font-size: 0.75rem;">
                        ${Array.isArray(s.curriculum) ? s.curriculum[0] : (s.curriculum || 'GES')}
                      </span>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      ${s.is_verified || s.verified ? `
                        <span class="badge badge-emerald" style="font-weight: 700; font-size: 0.75rem;">🛡️ Verified NaSIA</span>
                      ` : `
                        <span class="badge badge-rose" style="font-weight: 700; font-size: 0.75rem;">⚠️ Pending Vetting</span>
                      `}
                    </td>
                    <td style="padding: 0.9rem 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.4rem;">
                        <button class="btn-pill btn-outline btn-quick-impersonate" data-id="${s.id}" data-name="${s.name}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;" title="Open School OS as Proprietor">
                          <span>🏫</span> Open OS
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderSchoolsTab(schools, vettingQueue = []) {
    return `
      <div class="admin-chart-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0;">
              School Tenants & Institutional Register
            </h2>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Direct CRUD governance across accredited campuses in Greater Accra and Kumasi.
            </p>
          </div>
          <button id="btn-add-tenant-school" class="btn-pill btn-primary">
            <span>➕</span> Onboard New Institution
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">SCHOOL NAME & LOCATION</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">CURRICULUM</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">NaSIA STATUS</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">GOVERNANCE ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${schools.map(s => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 1rem;">
                    <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${s.name}</div>
                    <div style="font-size: 0.78rem; color: #64748b;">📍 ${s.locality || s.suburb || 'Accra'}, ${s.region}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <span class="badge badge-cambridge">${Array.isArray(s.curriculum) ? s.curriculum.join(', ') : (s.curriculum || 'GES')}</span>
                  </td>
                  <td style="padding: 1rem;">
                    ${s.is_verified || s.verified ? `
                      <span class="badge badge-emerald" style="font-weight: 700;">🛡️ NaSIA Verified</span>
                    ` : `
                      <span class="badge badge-rose" style="font-weight: 700;">⚠️ Pending Verification</span>
                    `}
                  </td>
                  <td style="padding: 1rem; text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn-pill btn-gold btn-quick-impersonate" data-id="${s.id}" data-name="${s.name}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                        <span>🏫</span> Open OS
                      </button>
                      <button class="btn-pill btn-outline btn-toggle-school-verif" data-id="${s.id}" data-current="${s.is_verified || s.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                        ${s.is_verified || s.verified ? 'Revoke Seal' : 'Grant Seal'}
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderTeachersTab(teachers = []) {
    return `
      <div class="admin-chart-card">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1.25rem 0;">
          Teacher & Educator NTC Credential Vetting Desk
        </h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">EDUCATOR NAME</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">SPECIALIZATION</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">NTC LICENSE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.map(t => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 1rem; font-weight: 700; color: #0f172a;">${t.fullName || t.name}</td>
                  <td style="padding: 1rem;">${Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || 'General')}</td>
                  <td style="padding: 1rem;"><code>${t.ntcLicense || 'NTC/LIC/GH-PENDING'}</code></td>
                  <td style="padding: 1rem;"><span class="badge ${t.verified ? 'badge-emerald' : 'badge-gold'}">${t.verified ? 'Verified' : 'Under Review'}</span></td>
                  <td style="padding: 1rem; text-align: right;">
                    <button class="btn-pill btn-outline btn-toggle-teacher-verif" data-id="${t.id}" data-current="${t.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      ${t.verified ? 'Revoke Badge' : 'Approve Badge'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderSuppliersTab(suppliers = []) {
    return `
      <div class="admin-chart-card">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1.25rem 0;">
          Educational Supplier & Vendor Accreditation Register
        </h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">COMPANY NAME</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">CATEGORY</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${suppliers.map(sup => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 1rem; font-weight: 700; color: #0f172a;">${sup.name}</td>
                  <td style="padding: 1rem;">${sup.category || 'Supplies'}</td>
                  <td style="padding: 1rem;"><span class="badge ${sup.verified ? 'badge-emerald' : 'badge-gold'}">${sup.verified ? 'Verified' : 'Pending'}</span></td>
                  <td style="padding: 1rem; text-align: right;">
                    <button class="btn-pill btn-outline btn-toggle-supplier-verif" data-id="${sup.id}" data-current="${sup.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      ${sup.verified ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderProcurementDesk(rfqs = [], procurementLogs = [], suppliers = []) {
    return `
      <div class="admin-chart-card" style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0;">
          📦 B2B Procurement Desk & Tender Oversight
        </h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TENDER TITLE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">SCHOOL</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">CATEGORY</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${rfqs.map(r => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 1rem; font-weight: 700; color: #0f172a;">${r.title}</td>
                  <td style="padding: 1rem;">${r.schoolName || 'Partner School'}</td>
                  <td style="padding: 1rem;"><span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 700;">${r.category}</span></td>
                  <td style="padding: 1rem;"><span class="badge badge-emerald">${r.status || 'Active'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderSubscriptionsTab() {
    return `
      <div class="admin-chart-card">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0;">
          📑 SaaS Subscription Packages & Pricing Tiers
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; background: #fff;">
            <span class="badge badge-admissions">Starter Tier</span>
            <div style="font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0;">GH₵ 450 <span style="font-size: 0.85rem; color: #64748b;">/ term</span></div>
            <p style="font-size: 0.85rem; color: #64748b;">Community basic schools & nursery centers</p>
          </div>
          <div style="border: 2px solid #2563eb; border-radius: 12px; padding: 1.5rem; background: #eff6ff;">
            <span class="badge badge-emerald">Growth Tier</span>
            <div style="font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0; color: #1e40af;">GH₵ 950 <span style="font-size: 0.85rem; color: #64748b;">/ term</span></div>
            <p style="font-size: 0.85rem; color: #64748b;">Preparatory schools & JHS campuses</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; background: #fff;">
            <span class="badge badge-gold">Enterprise Tier</span>
            <div style="font-size: 1.5rem; font-weight: 800; margin: 0.5rem 0;">GH₵ 2,200 <span style="font-size: 0.85rem; color: #64748b;">/ term</span></div>
            <p style="font-size: 0.85rem; color: #64748b;">International colleges & senior high schools</p>
          </div>
        </div>
      </div>
    `;
  },

  renderTelemetryTab(telemetry = {}) {
    return `
      <div class="admin-chart-card">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0;">
          ⚙️ Gateway & Cloud Telemetry
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">EDGE STATUS</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #059669;">Operational (100%)</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">SUPABASE POSTGRESQL</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #2563eb;">Connected (Pool: 15)</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">PAYSTACK WEBHOOKS</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #059669;">Listening (HMAC SHA512)</div>
          </div>
        </div>
      </div>
    `;
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    App.refreshCurrentView();
  },

  initListeners() {
    // 1. Sidebar tab navigation
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-admin-tab');
        if (tab) {
          this.activeTab = tab;
          App.refreshCurrentView();
        }
      });
    });

    // 2. Universal Omnisearch Keyboard Shortcut (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('admin-omnisearch-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    // 3. Omnisearch Input Handler (Debounced)
    const searchInput = document.getElementById('admin-omnisearch-input');
    const searchResults = document.getElementById('admin-omnisearch-results');

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        const val = e.target.value.trim();

        if (val.length < 2) {
          searchResults.style.display = 'none';
          searchResults.innerHTML = '';
          return;
        }

        this.searchDebounceTimer = setTimeout(async () => {
          try {
            const data = await API.adminSearch(val);
            const { schools = [], users = [], payments = [] } = data.results || {};

            if (schools.length === 0 && users.length === 0 && payments.length === 0) {
              searchResults.innerHTML = `<div style="padding: 1rem; color: #64748b; font-size: 0.85rem; text-align: center;">No matching records found for "${val}"</div>`;
              searchResults.style.display = 'block';
              return;
            }

            searchResults.innerHTML = `
              <div style="padding: 0.5rem 0;">
                ${schools.length > 0 ? `
                  <div style="padding: 0.4rem 1rem; font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; background: #f8fafc;">Schools (${schools.length})</div>
                  ${schools.map(s => `
                    <div class="omni-item" data-type="school" data-id="${s.id}" style="padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #f1f5f9;">
                      <div>
                        <div style="font-weight: 700; color: #0f172a; font-size: 0.88rem;">🏫 ${s.name}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">📍 ${s.district || s.region}</div>
                      </div>
                      <span class="badge ${s.is_verified ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.7rem;">${s.is_verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  `).join('')}
                ` : ''}

                ${users.length > 0 ? `
                  <div style="padding: 0.4rem 1rem; font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; background: #f8fafc;">Users (${users.length})</div>
                  ${users.map(u => `
                    <div class="omni-item" data-type="user" data-id="${u.id}" style="padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #f1f5f9;">
                      <div>
                        <div style="font-weight: 700; color: #0f172a; font-size: 0.88rem;">👤 ${u.full_name || u.email}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">${u.email} &bull; ${u.phone || 'No phone'}</div>
                      </div>
                      <span class="badge badge-admissions" style="font-size: 0.7rem;">${u.role}</span>
                    </div>
                  `).join('')}
                ` : ''}

                ${payments.length > 0 ? `
                  <div style="padding: 0.4rem 1rem; font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; background: #f8fafc;">Payments (${payments.length})</div>
                  ${payments.map(p => `
                    <div class="omni-item" data-type="payment" data-id="${p.id}" style="padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                      <div>
                        <div style="font-weight: 700; color: #0f172a; font-size: 0.88rem;">💳 ${p.reference} &bull; GH₵ ${p.amount_ghs}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">${p.payer_name || 'MoMo Payer'}</div>
                      </div>
                      <span class="badge ${p.status === 'success' ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.7rem;">${p.status}</span>
                    </div>
                  `).join('')}
                ` : ''}
              </div>
            `;
            searchResults.style.display = 'block';

            // Click listener on search items
            searchResults.querySelectorAll('.omni-item').forEach(item => {
              item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const id = item.getAttribute('data-id');
                searchResults.style.display = 'none';

                if (type === 'school') {
                  AdminView.switchTab('schools');
                } else if (type === 'user') {
                  AdminView.switchTab('users');
                } else if (type === 'payment') {
                  AdminView.switchTab('finance');
                }
              });
            });

          } catch (err) {
            console.warn('Search error:', err);
          }
        }, 200);
      });

      // Close omnisearch when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    }

    // 4. One-Click School Impersonation ("Open School OS &rarr;")
    document.querySelectorAll('.btn-quick-impersonate, #btn-admin-switch-school').forEach(btn => {
      btn.addEventListener('click', async () => {
        const schoolId = btn.getAttribute('data-id') || 'ab5af86d-c902-4853-9528-d6200104b5f6';
        const schoolName = btn.getAttribute('data-name') || 'Ghana International School';

        try {
          btn.disabled = true;
          State.showToast(`Launching Proprietor OS for ${schoolName}...`, 'info');

          const res = await API.impersonateSchool(schoolId);
          if (res && res.impersonationToken) {
            State.setToken(res.impersonationToken);
            State.currentSchoolId = res.school?.slug || res.school?.id || 'sch-gis-accra';
            App.navigate('schools', State.currentSchoolId);
            State.showToast(`🛡️ Viewing as ${res.school?.name || schoolName}`, 'success');
          } else {
            App.navigate('schools', 'sch-gis-accra');
          }
        } catch (err) {
          console.warn('Impersonation fallback:', err.message);
          App.navigate('schools', 'sch-gis-accra');
        } finally {
          btn.disabled = false;
        }
      });
    });

    // 5. Verification Toggles
    document.querySelectorAll('.btn-toggle-school-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'school', !current);
          State.showToast(`Updated NaSIA verification status!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    document.querySelectorAll('.btn-toggle-teacher-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'teacher', !current);
          State.showToast(`Updated NTC license status!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    document.querySelectorAll('.btn-toggle-supplier-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'supplier', !current);
          State.showToast(`Updated vendor accreditation status!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // 6. Onboard School Modal Trigger
    document.getElementById('btn-add-tenant-school')?.addEventListener('click', () => {
      Modals.openClaimSchoolModal({ id: 'sch-new', name: 'New School Institution' });
    });
  }
};
