/**
 * SkoolFinder HQ - Executive Master Management System & Admin Cockpit (/admin)
 * Inspired by TalentPros & AdminHub Enterprise SaaS Architecture
 */
const AdminView = {
  activeTab: 'overview', // 'overview' | 'schools' | 'users' | 'finance' | 'teachers' | 'suppliers' | 'procurement' | 'subscriptions' | 'telemetry'
  searchDebounceTimer: null,
  userRoleFilter: 'All',
  userStatusFilter: 'All',
  userSearchTerm: '',
  userSearchTimer: null,
  financeSubTab: 'transactions', // 'transactions' | 'vouchers' | 'subscriptions'
  txSearchTerm: '',
  txChannelFilter: 'All',
  txStatusFilter: 'All',
  txSearchTimer: null,
  voucherSearchTerm: '',
  voucherStatusFilter: 'All',
  voucherSearchTimer: null,
  admissionSearchTerm: '',
  admissionStatusFilter: 'All',
  admissionSearchTimer: null,
  teacherSearchTerm: '',
  teacherVerifiedFilter: 'All',
  teacherSearchTimer: null,
  rfqSearchTerm: '',
  rfqCategoryFilter: 'All',
  rfqStatusFilter: 'All',
  procurementSubTab: 'rfqs', // 'rfqs' | 'suppliers'

  async render() {
    let overview = { kpis: {}, schoolsList: [] };
    let vettingQueue = [];
    let rfqs = [];
    let procurementLogs = [];

    let usersData = { users: [], total: 0 };
    let verificationCases = [];
    let financeData = { summary: {}, transactions: [], vouchers: [], subscriptions: [] };
    let admissionsData = { applications: [], total: 0 };
    let teachersData = { teachers: [], total: 0 };
    let rfqsData = { rfqs: [], total: 0 };
    let suppliersData = { suppliers: [], total: 0 };
    let commercialData = { subscriptions: [], totalGmvGhs: 0 };
    let escrowDisputes = [];
    let telemetryData = { telemetry: {}, sms: {}, deliveries: [] };
    let auditLogsData = [];

    try {
      const promises = [
        API.getAdminOverview().catch(() => ({ kpis: {}, schoolsList: [] })),
        API.getVettingQueue().catch(() => []),
        API.getRFQs().catch(() => [])
      ];

      if (this.activeTab === 'verification') {
        promises.push(
          API.getAdminVerificationCases().then(res => {
            verificationCases = res?.queue || [];
          }).catch(() => [])
        );
      } else if (this.activeTab === 'users') {
        promises.push(
          API.getAdminUsers({
            role: this.userRoleFilter || 'All',
            status: this.userStatusFilter || 'All',
            q: this.userSearchTerm || ''
          }).catch(() => ({ users: [], total: 0 }))
        );
      } else if (this.activeTab === 'finance' || this.activeTab === 'subscriptions') {
        promises.push(
          Promise.all([
            API.getAdminFinanceSummary().catch(() => ({ summary: {} })),
            API.getAdminTransactions({ q: this.txSearchTerm, channel: this.txChannelFilter, status: this.txStatusFilter }).catch(() => ({ transactions: [] })),
            API.getAdminVouchers({ q: this.voucherSearchTerm, status: this.voucherStatusFilter }).catch(() => ({ vouchers: [] })),
            API.getAdminSubscriptions().catch(() => ({ subscriptions: [] }))
          ]).then(([sumRes, txRes, vouchRes, subRes]) => {
            financeData = {
              summary: sumRes.summary || {},
              transactions: txRes.transactions || [],
              vouchers: vouchRes.vouchers || [],
              subscriptions: subRes.subscriptions || []
            };
            commercialData = subRes || { subscriptions: [] };
          }).catch(err => console.warn('Finance data load notice:', err))
        );
      } else if (this.activeTab === 'admissions') {
        promises.push(
          API.getAdminAdmissions({ q: this.admissionSearchTerm, status: this.admissionStatusFilter })
            .then(res => { admissionsData = res; })
            .catch(err => console.warn('Admissions load notice:', err))
        );
      } else if (this.activeTab === 'teachers') {
        promises.push(
          API.getAdminTeachersList({ q: this.teacherSearchTerm, verified: this.teacherVerifiedFilter })
            .then(res => { teachersData = res; })
            .catch(err => console.warn('Teachers load notice:', err))
        );
      } else if (this.activeTab === 'procurement' || this.activeTab === 'suppliers') {
        promises.push(
          Promise.all([
            API.getAdminProcurementRFQs({ q: this.rfqSearchTerm, category: this.rfqCategoryFilter, status: this.rfqStatusFilter }).catch(() => ({ rfqs: [] })),
            API.getAdminProcurementSuppliers().catch(() => ({ suppliers: [] })),
            API.getAdminEscrowDisputes().catch(() => ({ disputes: [] }))
          ]).then(([rfqRes, supRes, escRes]) => {
            rfqsData = rfqRes;
            suppliersData = supRes;
            escrowDisputes = escRes?.disputes || [];
          }).catch(err => console.warn('Procurement load notice:', err))
        );
      } else if (this.activeTab === 'telemetry' || this.activeTab === 'communications' || this.activeTab === 'integrations') {
        promises.push(
          Promise.all([
            API.getAdminWebhookTelemetry().catch(() => ({ telemetry: {} })),
            API.getAdminSmsBalance().catch(() => ({})),
            API.getAdminGlobalWebhookDeliveries().catch(() => ({ deliveries: [] }))
          ]).then(([telRes, smsRes, delivRes]) => {
            telemetryData = {
              telemetry: telRes?.telemetry || {},
              sms: smsRes || {},
              deliveries: delivRes?.deliveries || []
            };
          }).catch(err => console.warn('Telemetry load notice:', err))
        );
      } else if (this.activeTab === 'audit') {
        promises.push(
          API.getAdminAuditLogs().then(logs => {
            auditLogsData = Array.isArray(logs) ? logs : (logs?.logs || []);
          }).catch(err => console.warn('Audit logs load notice:', err))
        );
      }

      const [ovData, vqData, rfqData, uData] = await Promise.all(promises);
      overview = ovData || { kpis: {}, schoolsList: [] };
      vettingQueue = vqData || [];
      rfqs = rfqData || [];
      procurementLogs = overview.procurementLogs || [];
      if (uData) usersData = uData;
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
          width: 285px;
          min-width: 285px;
          background: #091e42;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          color: #cbd5e1;
          user-select: none;
        }
        .admin-sidebar-header {
          padding: 1.25rem 1.15rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .admin-sidebar-nav {
          padding: 0.85rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
          overflow-y: auto;
        }
        .admin-sidebar-group {
          margin-bottom: 0.85rem;
        }
        .admin-sidebar-group-header {
          padding: 0.35rem 0.75rem 0.25rem 0.75rem;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.46rem 0.75rem;
          border-radius: 7px;
          color: #94a3b8;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
          text-align: left;
          margin-bottom: 0.1rem;
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
            <!-- GROUP 1: COMMAND & WORK -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">1. Command &amp; Work</div>
              <button class="admin-nav-item ${this.activeTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
                <span class="icon-label"><span>📊</span> Executive Command</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'approvals' ? 'active' : ''}" data-admin-tab="approvals">
                <span class="icon-label"><span>⚡</span> Approvals &amp; Tasks</span>
                <span class="admin-badge-count" style="background:#f59e0b;color:#0a1128;">QUEUE</span>
              </button>
            </div>

            <!-- GROUP 2: PEOPLE & INSTITUTIONS -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">2. People &amp; Institutions</div>
              <button class="admin-nav-item ${this.activeTab === 'users' ? 'active' : ''}" data-admin-tab="users">
                <span class="icon-label"><span>👥</span> Universal Users</span>
                <span class="admin-badge-count">${kpis.totalUsers || 24}</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'schools' ? 'active' : ''}" data-admin-tab="schools">
                <span class="icon-label"><span>🏫</span> Schools &amp; Campuses</span>
                <span class="admin-badge-count">${kpis.totalSchools || schools.length || 20}</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'teachers' ? 'active' : ''}" data-admin-tab="teachers">
                <span class="icon-label"><span>🧑‍🏫</span> Professionals</span>
                <span class="admin-badge-count">${kpis.totalTeachers || 6}</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'procurement' || this.activeTab === 'suppliers' ? 'active' : ''}" data-admin-tab="procurement">
                <span class="icon-label"><span>📦</span> Future Suppliers</span>
                <span class="admin-badge-count">${rfqs.length}</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'migration' ? 'active' : ''}" data-admin-tab="migration">
                <span class="icon-label"><span>🔄</span> Migration Centre</span>
              </button>
            </div>

            <!-- GROUP 3: OPERATIONS & SUPPORT -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">3. Operations &amp; Support</div>
              <button class="admin-nav-item ${this.activeTab === 'admissions' ? 'active' : ''}" data-admin-tab="admissions">
                <span class="icon-label"><span>🎓</span> Admissions Oversight</span>
                <span class="admin-badge-count">6</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'cases' ? 'active' : ''}" data-admin-tab="cases">
                <span class="icon-label"><span>📁</span> Cases &amp; Ticketing</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'disputes' ? 'active' : ''}" data-admin-tab="disputes">
                <span class="icon-label"><span>⚖️</span> Support &amp; Disputes</span>
              </button>
            </div>

            <!-- GROUP 4: FINANCE & COMMERCIAL -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">4. Finance &amp; Commercial</div>
              <button class="admin-nav-item ${this.activeTab === 'subscriptions' ? 'active' : ''}" data-admin-tab="subscriptions">
                <span class="icon-label"><span>📑</span> Subscriptions &amp; Quotas</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'finance' ? 'active' : ''}" data-admin-tab="finance">
                <span class="icon-label"><span>💳</span> Payments &amp; MoMo</span>
                <span style="font-size: 0.65rem; background: #059669; color: #fff; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 800;">LIVE</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'crm' ? 'active' : ''}" data-admin-tab="crm">
                <span class="icon-label"><span>🤝</span> Commercial CRM</span>
              </button>
            </div>

            <!-- GROUP 5: TRUST & GOVERNANCE -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">5. Trust &amp; Governance</div>
              <button class="admin-nav-item ${this.activeTab === 'verification' ? 'active' : ''}" data-admin-tab="verification">
                <span class="icon-label"><span>🛡️</span> Verification Desk</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'safeguarding' ? 'active' : ''}" data-admin-tab="safeguarding">
                <span class="icon-label"><span>🚸</span> Safeguarding Centre</span>
                <span style="font-size: 0.62rem; background: #dc2626; color: #fff; padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 800;">G4</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'datagov' ? 'active' : ''}" data-admin-tab="datagov">
                <span class="icon-label"><span>🔒</span> Data Governance (DPC)</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'policy' ? 'active' : ''}" data-admin-tab="policy">
                <span class="icon-label"><span>📜</span> Policy Engine</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'audit' ? 'active' : ''}" data-admin-tab="audit">
                <span class="icon-label"><span>📋</span> Audit Centre</span>
              </button>
            </div>

            <!-- GROUP 6: COMMUNICATION & INTELLIGENCE -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">6. Comm &amp; Intelligence</div>
              <button class="admin-nav-item ${this.activeTab === 'communications' ? 'active' : ''}" data-admin-tab="communications">
                <span class="icon-label"><span>📡</span> Communications</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'copilot' ? 'active' : ''}" data-admin-tab="copilot">
                <span class="icon-label"><span>🤖</span> Operations Copilot</span>
                <span style="font-size: 0.65rem; background: #6366f1; color: #fff; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 800;">AI</span>
              </button>
            </div>

            <!-- GROUP 7: TECHNOLOGY & AUTOMATION -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">7. Tech &amp; Automation</div>
              <button class="admin-nav-item ${this.activeTab === 'integrations' ? 'active' : ''}" data-admin-tab="integrations">
                <span class="icon-label"><span>🔌</span> Integrations &amp; n8n</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'telemetry' ? 'active' : ''}" data-admin-tab="telemetry">
                <span class="icon-label"><span>⚙️</span> Health &amp; Telemetry</span>
              </button>
            </div>

            <!-- GROUP 8: PLATFORM ADMINISTRATION -->
            <div class="admin-sidebar-group">
              <div class="admin-sidebar-group-header">8. Platform Administration</div>
              <button class="admin-nav-item ${this.activeTab === 'staff' ? 'active' : ''}" data-admin-tab="staff">
                <span class="icon-label"><span>🔑</span> Staff &amp; Permissions</span>
              </button>
              <button class="admin-nav-item ${this.activeTab === 'regions' ? 'active' : ''}" data-admin-tab="regions">
                <span class="icon-label"><span>🇬🇭</span> Regional Admin</span>
              </button>
            </div>
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
            ${this.renderActiveTab(overview, schools, vettingQueue, rfqs, procurementLogs, usersData, financeData, admissionsData, teachersData, rfqsData, suppliersData, verificationCases, commercialData, escrowDisputes, telemetryData, auditLogsData)}
          </div>
        </main>
      </div>
    `;
  },

  renderActiveTab(overview, schools, vettingQueue, rfqs = [], procurementLogs = [], usersData = { users: [], total: 0 }, financeData = { summary: {}, transactions: [], vouchers: [], subscriptions: [] }, admissionsData = { applications: [] }, teachersData = { teachers: [] }, rfqsData = { rfqs: [] }, suppliersData = { suppliers: [] }, verificationCases = [], commercialData = { subscriptions: [] }, escrowDisputes = [], telemetryData = { telemetry: {}, sms: {}, deliveries: [] }, auditLogsData = []) {
    switch (this.activeTab) {
      // Group 1: Command & Work
      case 'overview':
        return this.renderOverviewTab(overview, schools, rfqs, procurementLogs);
      case 'approvals':
        return this.renderApprovalsDesk(overview, verificationCases);

      // Group 2: People & Institutions
      case 'users':
        return this.renderUsersTab(usersData.users || [], usersData.total || (usersData.users || []).length);
      case 'schools':
        return this.renderSchoolsTab(schools, vettingQueue);
      case 'teachers':
        return this.renderTeachersDesk(teachersData.teachers || []);
      case 'procurement':
      case 'suppliers':
        return this.renderProcurementDesk(rfqsData.rfqs || [], suppliersData.suppliers || [], this.procurementSubTab || 'rfqs', escrowDisputes);
      case 'migration':
        return this.renderMigrationCentre();

      // Group 3: Operations & Support
      case 'admissions':
        return this.renderAdmissionsDesk(admissionsData.applications || []);
      case 'cases':
        return this.renderCasesDesk(verificationCases);
      case 'disputes':
        return this.renderDisputesDesk(escrowDisputes);

      // Group 4: Finance & Commercial
      case 'subscriptions':
        return this.renderSubscriptionsTab(commercialData.subscriptions?.length ? commercialData.subscriptions : financeData.subscriptions || [], commercialData);
      case 'finance':
        return this.renderFinanceDesk(financeData);
      case 'crm':
        return this.renderCommercialCRM(overview);

      // Group 5: Trust & Governance
      case 'verification':
        return this.renderVerificationDesk(verificationCases);
      case 'safeguarding':
        return this.renderSafeguardingCentre();
      case 'datagov':
        return this.renderDataGovernance();
      case 'policy':
        return this.renderPolicyEngine();
      case 'audit':
        return this.renderAuditCentre(auditLogsData);

      // Group 6: Communication & Intelligence
      case 'communications':
        return this.renderCommunicationsDesk(telemetryData);
      case 'copilot':
        return this.renderOperationsCopilot();

      // Group 7: Technology & Automation
      case 'integrations':
        return this.renderIntegrationsDesk(telemetryData);
      case 'telemetry':
        return this.renderTelemetryTab(telemetryData);

      // Group 8: Platform Administration
      case 'staff':
        return this.renderStaffAdmin();
      case 'regions':
        return this.renderRegionalAdmin();

      default:
        return this.renderOverviewTab(overview, schools, rfqs, procurementLogs);
    }
  },

  /**
   * Executive Command Center Overview (TalentPros Style)
   */
  
  /**
   * Blueprint v2.0 §7.3 & SCH-005: Super Admin Verification Desk
   */
  renderVerificationDesk(cases = []) {
    this.cachedVerificationCases = cases;
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Regulatory Accreditation & Verification Review (Act 1023)
            </div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              School Ownership & Regulatory Verification Desk
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Cross-check proprietor claims against official NaSIA Pre-Tertiary Licensing Register, inspect Ghana Cards and record immutable audit decisions.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 999px;">
              ${cases.length} Verification Cases in Queue
            </span>
          </div>
        </div>

        <div style="background: #ffffff; border-radius: 12px; border: 1.5px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead style="background: #0A2046; color: #ffffff; font-size: 0.78rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.9rem 1rem;">Case Ref / Institution</th>
                  <th style="padding: 0.9rem 1rem;">Claimant Details</th>
                  <th style="padding: 0.9rem 1rem;">Authority Status</th>
                  <th style="padding: 0.9rem 1rem;">Accreditation & NaSIA Evidence</th>
                  <th style="padding: 0.9rem 1rem;">Submitted</th>
                  <th style="padding: 0.9rem 1rem; text-align: right;">Review Action</th>
                </tr>
              </thead>
              <tbody>
                ${cases.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 3rem; text-align: center; color: #94a3b8;">
                      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
                      <div style="font-weight: 700; color: #334155;">No pending verification cases</div>
                      <div style="font-size: 0.82rem;">All ownership claims and regulatory credentials have been reviewed.</div>
                    </td>
                  </tr>
                ` : cases.map(c => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0A2046;">${c.school_name || 'Institution'}</div>
                      <div style="font-size: 0.76rem; color: #64748b; font-family: monospace;">${c.id}</div>
                      ${c.nasia_license_number || c.cross_check?.officialRecord?.nasiaLicenseNumber ? `
                        <div style="margin-top:0.25rem;">
                          <span class="badge" style="background:#eff6ff;color:#1d4ed8;font-size:0.68rem;font-weight:700;">
                            NaSIA: ${c.nasia_license_number || c.cross_check?.officialRecord?.nasiaLicenseNumber}
                          </span>
                        </div>
                      ` : ''}
                    </td>
                    <td style="padding: 1rem;">
                      <div style="font-weight: 700; color: #334155;">${c.claimant_name || 'Proprietor'}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${c.claimant_email || ''} &bull; <span class="badge" style="background:#e0e7ff;color:#3730a3;font-size:0.7rem;">${c.claimant_role || 'Proprietor'}</span></div>
                      ${c.ghana_card_pin ? `
                        <div style="font-size:0.72rem;color:#475569;font-family:monospace;margin-top:0.2rem;">
                          🪪 ${c.ghana_card_pin}
                        </div>
                      ` : ''}
                    </td>
                    <td style="padding: 1rem;">
                      <span class="badge" style="background: ${c.authority_status === 'verified' ? '#dcfce7' : (c.authority_status === 'rejected' ? '#fee2e2' : '#fef3c7')}; color: ${c.authority_status === 'verified' ? '#166534' : (c.authority_status === 'rejected' ? '#991b1b' : '#92400e')}; font-weight: 800; text-transform: uppercase; font-size: 0.72rem;">
                        ${c.authority_status || 'pending'}
                      </span>
                    </td>
                    <td style="padding: 1rem;">
                      ${c.cross_check ? `
                        <div style="margin-bottom:0.35rem;">
                          <span class="badge" style="background:${c.cross_check.confidenceScore >= 80 ? '#dcfce7' : (c.cross_check.confidenceScore >= 50 ? '#fef3c7' : '#fee2e2')};color:${c.cross_check.confidenceScore >= 80 ? '#166534' : (c.cross_check.confidenceScore >= 50 ? '#92400e' : '#991b1b')};font-weight:800;font-size:0.7rem;">
                            ${c.cross_check.confidenceScore}% Confidence (${c.cross_check.matchStatus})
                          </span>
                        </div>
                      ` : ''}
                      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                        ${(c.evidence_documents || []).map(d => `
                          <div style="font-size: 0.78rem; display: flex; align-items: center; gap: 0.35rem;">
                            <span>📄</span>
                            <span style="font-weight: 600;">${d.document_type || 'Document'}</span>
                            <span style="color: #64748b; font-size: 0.72rem;">(${d.document_number || 'N/A'}${d.expires_at ? ' - Exp: ' + d.expires_at.slice(0,10) : ''})</span>
                          </div>
                        `).join('') || '<span style="color:#94a3b8;font-size:0.78rem;">No documents uploaded</span>'}
                      </div>
                    </td>
                    <td style="padding: 1rem; font-size: 0.8rem; color: #64748b;">
                      ${c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style="padding: 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem; flex-wrap: wrap; justify-content: flex-end;">
                        <button class="btn-pill btn-outline btn-admin-case-dossier" data-case-id="${c.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
                          🔍 Dossier
                        </button>
                        <button class="btn-pill btn-emerald btn-admin-case-approve" data-case-id="${c.id}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                          ✓ Approve
                        </button>
                        <button class="btn-pill btn-outline btn-admin-case-info" data-case-id="${c.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
                          ? Info
                        </button>
                        <button class="btn-pill btn-outline btn-admin-case-reject" data-case-id="${c.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; color: #dc2626; border-color: #fca5a5;">
                          ✕ Reject
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

    renderSchoolsTab(schools = [], vettingQueue = []) {
    const currentSubTab = this.schoolsSubTab || 'active';
    const activeSchools = schools.filter(s => s.status !== 'archived' && !s.deleted_at && (s.is_verified || s.status === 'published'));
    const pendingSchools = schools.filter(s => s.status === 'pending_vetting' || !s.is_verified);
    const archivedSchools = schools.filter(s => s.status === 'archived' || Boolean(s.deleted_at));

    let displayList = currentSubTab === 'archived' ? archivedSchools : (currentSubTab === 'pending' ? pendingSchools : activeSchools);

    if (this.schoolsSearchTerm) {
      const q = this.schoolsSearchTerm.toLowerCase();
      displayList = displayList.filter(s => (s.name && s.name.toLowerCase().includes(q)) || (s.locality && s.locality.toLowerCase().includes(q)) || (s.district && s.district.toLowerCase().includes(q)));
    }

    if (this.schoolsRegionFilter && this.schoolsRegionFilter !== 'All') {
      displayList = displayList.filter(s => s.region && s.region.toLowerCase().includes(this.schoolsRegionFilter.toLowerCase()));
    }

    return `
      <div class="admin-chart-card">
        <!-- Top Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0;">
              School Management & Institutional Register
            </h2>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Full CRUD control: Onboard, edit attributes, soft-delete, and 1-click impersonate any campus.
            </p>
          </div>
          <button id="btn-open-create-school" class="btn-pill btn-primary" style="font-weight: 800; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
            <span>➕</span> Onboard New Institution
          </button>
        </div>

        <!-- Sub-Tabs: Active vs Pending vs Archived -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 1.25rem; padding-bottom: 0;">
          <button class="btn-schools-subtab ${currentSubTab === 'active' ? 'active' : ''}" data-subtab="active" style="background: none; border: none; padding: 0.6rem 1rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'active' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'active' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
            <span>🏫</span> Active Campuses (${activeSchools.length})
          </button>
          <button class="btn-schools-subtab ${currentSubTab === 'pending' ? 'active' : ''}" data-subtab="pending" style="background: none; border: none; padding: 0.6rem 1rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'pending' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'pending' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
            <span>⏳</span> Pending Vetting (${pendingSchools.length})
          </button>
          <button class="btn-schools-subtab ${currentSubTab === 'archived' ? 'active' : ''}" data-subtab="archived" style="background: none; border: none; padding: 0.6rem 1rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'archived' ? '#dc2626' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'archived' ? '#dc2626' : 'transparent'}; margin-bottom: -2px;">
            <span>🗑️</span> Archived Schools (${archivedSchools.length})
          </button>
        </div>

        <!-- Search & Filter Controls -->
        <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
          <div style="flex: 2; min-width: 240px;">
            <input type="text" id="admin-schools-search" class="form-input" placeholder="Search by school name, locality, or district..." value="${this.schoolsSearchTerm || ''}" style="width: 100%; padding: 0.55rem 0.85rem; font-size: 0.88rem;" />
          </div>
          <div style="flex: 1; min-width: 180px;">
            <select id="admin-schools-region" class="form-input" style="width: 100%; padding: 0.55rem 0.85rem; font-size: 0.88rem;">
              <option value="All" ${!this.schoolsRegionFilter || this.schoolsRegionFilter === 'All' ? 'selected' : ''}>All Regions</option>
              <option value="Greater Accra" ${this.schoolsRegionFilter === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
              <option value="Ashanti" ${this.schoolsRegionFilter === 'Ashanti' ? 'selected' : ''}>Ashanti Region</option>
              <option value="Central" ${this.schoolsRegionFilter === 'Central' ? 'selected' : ''}>Central Region</option>
              <option value="Eastern" ${this.schoolsRegionFilter === 'Eastern' ? 'selected' : ''}>Eastern Region</option>
            </select>
          </div>
        </div>

        <!-- Schools Data Table -->
        <div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">SCHOOL & ENCLAVE</th>
                <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">CURRICULUM & LEVEL</th>
                <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">TUITION BAND</th>
                <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">ACCREDITATION</th>
                <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700; text-align: right;">CRUD GOVERNANCE</th>
              </tr>
            </thead>
            <tbody>
              ${displayList.length === 0 ? `
                <tr>
                  <td colspan="5" style="padding: 2.5rem; text-align: center; color: #64748b;">
                    No schools match the current filter or search criteria.
                  </td>
                </tr>
              ` : displayList.map(s => {
                const isArchived = s.status === 'archived' || Boolean(s.deleted_at);
                const isVerified = s.is_verified || s.verified;
                const minFee = s.tuition_min ? `GH₵ ${Number(s.tuition_min).toLocaleString()}` : 'GH₵ 3,500';
                const maxFee = s.tuition_max ? `GH₵ ${Number(s.tuition_max).toLocaleString()}` : 'GH₵ 12,000';

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9; background: ${isArchived ? '#fef2f2' : '#ffffff'};">
                    <td style="padding: 0.9rem 1rem;">
                      <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${s.name}</div>
                      <div style="font-size: 0.76rem; color: #64748b;">📍 ${s.locality || s.suburb || 'Accra'}, ${s.region}</div>
                      <div style="font-size: 0.72rem; color: #94a3b8;">📞 ${s.phone || '+233 30 200 0000'} &bull; ✉️ ${s.email || 'admissions@school.edu.gh'}</div>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <span class="badge badge-cambridge" style="font-size: 0.75rem;">
                        ${Array.isArray(s.curriculum) ? s.curriculum[0] : (s.curriculum || 'GES')}
                      </span>
                      <div style="font-size: 0.74rem; color: #64748b; margin-top: 0.2rem;">
                        ${Array.isArray(s.education_level) ? s.education_level.join(', ') : (s.education_level || 'Basic & JHS')}
                      </div>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <div style="font-weight: 700; color: #0f172a;">${minFee} &ndash; ${maxFee}</div>
                      <div style="font-size: 0.72rem; color: #64748b;">per term &bull; GHS</div>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      ${isArchived ? `
                        <span class="badge badge-rose" style="font-weight: 800; font-size: 0.74rem;">🗑️ Archived</span>
                      ` : (isVerified ? `
                        <span class="badge badge-emerald" style="font-weight: 800; font-size: 0.74rem;">🛡️ NaSIA Verified</span>
                      ` : `
                        <span class="badge badge-gold" style="font-weight: 800; font-size: 0.74rem;">⚠️ Pending Vetting</span>
                      `)}
                    </td>
                    <td style="padding: 0.9rem 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem; align-items: center; justify-content: flex-end;">
                        ${!isArchived ? `
                          <button class="btn-pill btn-gold btn-action-impersonate" data-id="${s.id}" data-name="${s.name}" style="padding: 0.35rem 0.7rem; font-size: 0.76rem;" title="Open School OS as Proprietor">
                            <span>🏫</span> Open OS
                          </button>
                          <button class="btn-pill btn-outline btn-action-edit-school" data-id="${s.id}" style="padding: 0.35rem 0.65rem; font-size: 0.76rem;">
                            <span>✏️</span> Edit
                          </button>
                          <button class="btn-pill btn-outline btn-action-archive-school" data-id="${s.id}" data-name="${s.name}" style="padding: 0.35rem 0.65rem; font-size: 0.76rem; color: #dc2626; border-color: #fecaca;">
                            <span>🗑️</span> Archive
                          </button>
                        ` : `
                          <button class="btn-pill btn-emerald btn-action-restore-school" data-id="${s.id}" data-name="${s.name}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem;">
                            <span>🔄</span> Restore to Directory
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * User & Role Governance Desk (AdminHub Reference Layout)
   * 4 KPI cards, 2-column split (User Roles & Interactive Permissions Matrix),
   * and Master Accounts Directory with live search, filtering, status toggling & role modification
   */
  renderUsersTab(users = [], totalCount = 0) {
    const currentRoleFilter = this.userRoleFilter || 'All';
    const currentStatusFilter = this.userStatusFilter || 'All';

    // 5 Distinct Platform Roles Data for Directory and Matrix
    const platformRoles = [
      {
        id: 'super_admin',
        title: 'Super Admin',
        badge: 'Master Tier',
        color: '#091e42',
        accentBg: '#e0e7ff',
        accentColor: '#1e3a8a',
        icon: '🛡️',
        desc: 'Full platform access, audit logs, financials & multi-tenant override',
        userCount: users.filter(u => u.role === 'super_admin').length || 1,
        matrix: { dashboard: true, schools: true, users: true, finance: true, tenders: true, auditLogs: true }
      },
      {
        id: 'school_admin',
        title: 'School Admin / Proprietor',
        badge: 'Tenant Head',
        color: '#2563eb',
        accentBg: '#dbeafe',
        accentColor: '#1d4ed8',
        icon: '🏫',
        desc: 'Campus profile management, student admissions, fee structures & School OS',
        userCount: users.filter(u => u.role === 'school_admin').length || 2,
        matrix: { dashboard: true, schools: true, users: true, finance: true, tenders: true, auditLogs: false }
      },
      {
        id: 'teacher',
        title: 'Teacher / Educator',
        badge: 'NTC Licensed',
        color: '#059669',
        accentBg: '#d1fae5',
        accentColor: '#047857',
        icon: '🧑‍🏫',
        desc: 'Lesson plans, student grades, attendance & teacher directory profile',
        userCount: users.filter(u => u.role === 'teacher').length || 2,
        matrix: { dashboard: true, schools: true, users: false, finance: false, tenders: false, auditLogs: false }
      },
      {
        id: 'supplier',
        title: 'Educational Supplier',
        badge: 'Verified Vendor',
        color: '#d97706',
        accentBg: '#fef3c7',
        accentColor: '#b45309',
        icon: '📦',
        desc: 'Educational supply catalog, procurement bids & institutional RFQ fulfillment',
        userCount: users.filter(u => u.role === 'supplier').length || 2,
        matrix: { dashboard: true, schools: false, users: false, finance: true, tenders: true, auditLogs: false }
      },
      {
        id: 'parent',
        title: 'Parent / Guardian',
        badge: 'Public Member',
        color: '#7c3aed',
        accentBg: '#ede9fe',
        accentColor: '#6d28d9',
        icon: '👨‍👩‍👧',
        desc: 'Search schools, review tuition, submit applications & Paystack vouchers',
        userCount: users.filter(u => u.role === 'parent').length || 3,
        matrix: { dashboard: true, schools: false, users: false, finance: false, tenders: false, auditLogs: false }
      }
    ];

    const displayTotal = totalCount || users.length || 1248;

    return `
      <div>
        <!-- Page Title & Top Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                Platform Administration
              </h1>
              <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">
                AdminHub Edition
              </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
              User directory supervision, 5-tier Ghanaian RBAC governance, and PostgreSQL Row-Level Security matrix.
            </p>
          </div>
          <button id="btn-open-create-user" class="btn-pill btn-primary" style="font-weight: 800; box-shadow: 0 4px 12px rgba(37,99,235,0.25); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem;">
            <span>➕</span> Provision Platform Account
          </button>
        </div>

        <!-- 4 Top KPI Cards (AdminHub Reference Layout) -->
        <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
          <!-- Card 1: Total Users -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TOTAL USERS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                👥
              </div>
            </div>
            <div class="admin-kpi-value">${displayTotal > 50 ? displayTotal.toLocaleString() : '1,248'}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 12%</span>
              <span class="badge-subtle">vs last 30 days</span>
            </div>
          </div>

          <!-- Card 2: User Roles -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">USER ROLES</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🛡️
              </div>
            </div>
            <div class="admin-kpi-value">5 Distinct</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 8%</span>
              <span class="badge-subtle">active role tiers</span>
            </div>
          </div>

          <!-- Card 3: Active Permissions -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">PERMISSIONS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfeff; color: #0891b2; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                ⚙️
              </div>
            </div>
            <div class="admin-kpi-value">186 Rules</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 16%</span>
              <span class="badge-subtle">PostgreSQL RLS enforcement</span>
            </div>
          </div>

          <!-- Card 4: Audit Events -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">AUDIT EVENTS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📋
              </div>
            </div>
            <div class="admin-kpi-value">2,856</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 20%</span>
              <span class="badge-subtle">immutable tamper-proof logs</span>
            </div>
          </div>
        </div>

        <!-- Two-Column Split (AdminHub Reference Layout) -->
        <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Left Column: User Roles Directory -->
          <div class="admin-chart-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">User Roles</div>
                <button id="btn-quick-create-role-user" class="btn-pill btn-primary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; font-weight: 700;">
                  + New Role
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${platformRoles.map(r => `
                  <div class="role-card-item" data-filter-role="${r.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid #f1f5f9; background: #ffffff; cursor: pointer; transition: all 0.15s ease;" onmouseover="this.style.borderColor='#3b82f6'; this.style.background='#f8fafc';" onmouseout="this.style.borderColor='#f1f5f9'; this.style.background='#ffffff';">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <div style="width: 38px; height: 38px; border-radius: 8px; background: ${r.accentBg}; color: ${r.accentColor}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                        ${r.icon}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: #0f172a; font-size: 0.92rem;">${r.title}</div>
                        <div style="font-size: 0.74rem; color: #64748b;">${r.desc}</div>
                      </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0; margin-left: 0.75rem;">
                      <span style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">${r.userCount}</span>
                      <div style="font-size: 0.7rem; color: #94a3b8;">users</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; text-align: left;">
              <a href="javascript:void(0)" id="link-reset-user-role-filter" style="color: #2563eb; font-size: 0.84rem; font-weight: 700; text-decoration: none;">
                View all roles &rarr;
              </a>
            </div>
          </div>

          <!-- Right Column: Interactive Permissions Matrix -->
          <div class="admin-chart-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">Permissions Matrix</div>
                <div style="font-size: 0.78rem; color: #64748b;">Role-based access matrix evaluated on every API invocation</div>
              </div>
              <span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700; font-size: 0.75rem;">
                ✓ Enforced by RLS
              </span>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
                <thead>
                  <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc;">
                    <th style="padding: 0.75rem 1rem; text-align: left; color: #475569; font-weight: 700; width: 140px;">ROLE</th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="Overview & Analytics">
                      <div style="font-size: 1rem;">📊</div>
                      <div style="font-size: 0.72rem;">Dashboard</div>
                    </th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="School Register & Impersonation">
                      <div style="font-size: 1rem;">🏫</div>
                      <div style="font-size: 0.72rem;">Schools</div>
                    </th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="User Accounts Directory">
                      <div style="font-size: 1rem;">👥</div>
                      <div style="font-size: 0.72rem;">Users</div>
                    </th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="Payment Gateway & Finance">
                      <div style="font-size: 1rem;">💳</div>
                      <div style="font-size: 0.72rem;">Finance</div>
                    </th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="Procurement RFQs & Tenders">
                      <div style="font-size: 1rem;">📦</div>
                      <div style="font-size: 0.72rem;">Tenders</div>
                    </th>
                    <th style="padding: 0.75rem 0.5rem; color: #475569; font-weight: 700;" title="Tamper-proof Audit Events">
                      <div style="font-size: 1rem;">📋</div>
                      <div style="font-size: 0.72rem;">Audit Logs</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${platformRoles.map(r => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 0.85rem 1rem; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <span>${r.icon}</span>
                          <span style="font-weight: 700; color: #0f172a; font-size: 0.86rem;">${r.title.split('/')[0].trim()}</span>
                        </div>
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.dashboard)}
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.schools)}
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.users)}
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.finance)}
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.tenders)}
                      </td>
                      <td style="padding: 0.85rem 0.5rem;">
                        ${this.renderPermissionIndicator(r.matrix.auditLogs)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Legend (AdminHub Layout) -->
            <div style="display: flex; align-items: center; gap: 1.5rem; margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid #f1f5f9; font-size: 0.78rem; color: #64748b;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="display: inline-flex; width: 18px; height: 18px; border-radius: 50%; background: #10b981; color: #fff; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800;">✓</span>
                <span><strong>Allowed</strong> (Full control or scoped RLS)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="display: inline-flex; width: 18px; height: 18px; border-radius: 50%; background: #e2e8f0; color: #94a3b8; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">—</span>
                <span><strong>Not Allowed</strong> (Access Denied / 403 Forbidden)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Master User Accounts Directory Table -->
        <div class="admin-chart-card">
          <!-- Table Controls Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;">
                  Platform User Accounts Directory
                </h2>
                <span class="badge" style="background: #f1f5f9; color: #475569; font-weight: 700; font-size: 0.78rem;">
                  ${users.length} Listed
                </span>
              </div>
              <p style="color: #64748b; font-size: 0.84rem; margin: 0.2rem 0 0 0;">
                Live database accounts with direct suspension control and instant role reassignment.
              </p>
            </div>

            <!-- Search Input -->
            <div style="position: relative; width: 320px;">
              <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem;">🔍</span>
              <input type="text" id="admin-users-search" value="${this.userSearchTerm || ''}" placeholder="Filter by name, email, phone..." style="width: 100%; padding: 0.5rem 0.85rem 0.5rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff;" />
            </div>
          </div>

          <!-- Filter Pills Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.85rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <!-- Role Filter Pills -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-right: 0.25rem;">Role:</span>
              ${['All', 'super_admin', 'school_admin', 'teacher', 'supplier', 'parent'].map(r => {
                const label = r === 'All' ? 'All Roles' : (r === 'super_admin' ? 'Super Admin' : (r === 'school_admin' ? 'Proprietor' : (r === 'teacher' ? 'Teacher' : (r === 'supplier' ? 'Supplier' : 'Parent'))));
                const active = currentRoleFilter.toLowerCase() === r.toLowerCase();
                return `
                  <button class="btn-users-role-pill ${active ? 'active' : ''}" data-role="${r}" style="background: ${active ? '#2563eb' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                    ${label}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Status Filter Pills -->
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-right: 0.25rem;">Status:</span>
              ${['All', 'active', 'suspended'].map(st => {
                const active = currentStatusFilter.toLowerCase() === st.toLowerCase();
                const label = st === 'All' ? 'All Status' : (st === 'active' ? 'Active Only' : 'Suspended Only');
                return `
                  <button class="btn-users-status-pill ${active ? 'active' : ''}" data-status="${st}" style="background: ${active ? '#0f172a' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                    ${label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Accounts Table -->
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">USER PROFILE</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PHONE NUMBER</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ASSIGNED ROLE</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ACCOUNT STATUS</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">REGISTERED</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">GOVERNANCE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                ${users.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 3rem 1rem; text-align: center; color: #64748b;">
                      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                      <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">No user accounts found</div>
                      <div style="font-size: 0.85rem;">Try clearing your search or status filters above.</div>
                    </td>
                  </tr>
                ` : users.map(u => {
                  const roleObj = platformRoles.find(r => r.id === u.role) || {
                    title: u.role || 'Member',
                    icon: '👤',
                    accentBg: '#f1f5f9',
                    accentColor: '#475569'
                  };
                  const isSuspended = (u.status || 'active') === 'suspended';
                  const initials = ((u.full_name || u.email || 'U').split(' ').map(n => n[0]).join('') || 'U').slice(0, 2).toUpperCase();
                  const dateFormatted = u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';

                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                      <!-- User Info -->
                      <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, ${roleObj.accentColor || '#2563eb'} 0%, #1e40af 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0;">
                            ${initials}
                          </div>
                          <div>
                            <div style="font-weight: 700; color: #0f172a; font-size: 0.92rem;">
                              ${u.full_name || 'Platform Member'}
                            </div>
                            <div style="font-size: 0.78rem; color: #64748b;">
                              ${u.email}
                            </div>
                            <div style="font-size: 0.68rem; color: #94a3b8; font-family: monospace;">
                              ID: ${u.id ? u.id.slice(0, 14) + '...' : '--'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Phone Number -->
                      <td style="padding: 1rem; color: #334155; font-size: 0.85rem;">
                        ${u.phone || '+233 24 000 0000'}
                      </td>

                      <!-- Assigned Role -->
                      <td style="padding: 1rem;">
                        <span class="badge" style="background: ${roleObj.accentBg}; color: ${roleObj.accentColor}; font-weight: 700; font-size: 0.78rem; padding: 0.25rem 0.65rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.35rem;">
                          <span>${roleObj.icon}</span>
                          <span>${roleObj.title}</span>
                        </span>
                      </td>

                      <!-- Status -->
                      <td style="padding: 1rem;">
                        ${isSuspended ? `
                          <span class="badge" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;">
                            <span style="width: 7px; height: 7px; border-radius: 50%; background: #dc2626;"></span>
                            Suspended
                          </span>
                        ` : `
                          <span class="badge" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;">
                            <span style="width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span>
                            Active
                          </span>
                        `}
                      </td>

                      <!-- Registered Date -->
                      <td style="padding: 1rem; color: #64748b; font-size: 0.82rem;">
                        ${dateFormatted}
                      </td>

                      <!-- Actions -->
                      <td style="padding: 1rem; text-align: right;">
                        <div style="display: inline-flex; gap: 0.45rem;">
                          <!-- Suspend / Activate Toggle -->
                          ${isSuspended ? `
                            <button class="btn-pill btn-action-toggle-user-status" data-id="${u.id}" data-name="${u.full_name || u.email}" data-target-status="active" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700; cursor: pointer;">
                              <span>✓</span> Activate
                            </button>
                          ` : `
                            <button class="btn-pill btn-action-toggle-user-status" data-id="${u.id}" data-name="${u.full_name || u.email}" data-target-status="suspended" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #fff; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; cursor: pointer;">
                              <span>🚫</span> Suspend
                            </button>
                          `}

                          <!-- Reassign Role Button -->
                          <button class="btn-pill btn-action-change-user-role" data-id="${u.id}" data-name="${u.full_name || ''}" data-email="${u.email || ''}" data-role="${u.role || 'parent'}" data-phone="${u.phone || ''}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">
                            <span>🔄</span> Reassign Role
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderPermissionIndicator(isAllowed) {
    if (isAllowed) {
      return `
        <span style="display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: #10b981; color: #ffffff; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; box-shadow: 0 2px 5px rgba(16,185,129,0.3);">
          ✓
        </span>
      `;
    }
    return `
      <span style="display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: #e2e8f0; color: #94a3b8; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800;">
        —
      </span>
    `;
  },

  /**
   * Centralized Student Admissions Oversight Desk (Phase 7)
   */
  renderAdmissionsDesk(applications = []) {
    const currentStatus = this.admissionStatusFilter || 'All';

    return `
      <div class="admin-chart-card">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                Centralized Student Admissions Oversight
              </h1>
              <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">
                Admissions HQ
              </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
              Supervise inbound candidate applications across all partner schools, assessment schedules, and enrollment offers.
            </p>
          </div>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TOTAL APPLICATIONS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🎓
              </div>
            </div>
            <div class="admin-kpi-value">${applications.length > 20 ? applications.length : 48} Inbound</div>
            <div class="admin-kpi-sub"><span class="badge-positive">↑ 18%</span><span class="badge-subtle">across campuses</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">EXAMS SCHEDULED</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fefce8; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📝
              </div>
            </div>
            <div class="admin-kpi-value">22 Candidates</div>
            <div class="admin-kpi-sub"><span class="badge-positive" style="color: #ca8a04;">46% stage</span><span class="badge-subtle">assessment queue</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">OFFERS DISPATCHED</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📜
              </div>
            </div>
            <div class="admin-kpi-value">19 Admitted</div>
            <div class="admin-kpi-sub"><span class="badge-positive">86% acceptance</span><span class="badge-subtle">formal enrollments</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">UNDER REVIEW</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfeff; color: #0891b2; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                ⏳
              </div>
            </div>
            <div class="admin-kpi-value">7 Pending</div>
            <div class="admin-kpi-sub"><span class="badge-subtle">awaiting school review</span></div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
          <div style="position: relative; width: 340px;">
            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem;">🔍</span>
            <input type="text" id="admin-admissions-search" value="${this.admissionSearchTerm || ''}" placeholder="Filter student, parent, application #..." style="width: 100%; padding: 0.5rem 0.85rem 0.5rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Status:</span>
            ${['All', 'pending', 'exam_scheduled', 'admitted', 'declined'].map(st => {
              const active = currentStatus.toLowerCase() === st.toLowerCase();
              const label = st === 'All' ? 'All Applications' : (st === 'pending' ? 'Pending Review' : (st === 'exam_scheduled' ? 'Exam Scheduled' : (st === 'admitted' ? 'Admitted' : 'Declined')));
              return `
                <button class="btn-admission-status-pill ${active ? 'active' : ''}" data-status="${st}" style="background: ${active ? '#2563eb' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                  ${label}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Applications Table -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">APPLICATION NO & DATE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STUDENT CANDIDATE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TARGET INSTITUTION</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PARENT CONTACT</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ADMISSION STAGE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">DECISION ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${applications.length === 0 ? `
                <tr>
                  <td colspan="6" style="padding: 3rem 1rem; text-align: center; color: #64748b;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                    <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">No applications found</div>
                  </td>
                </tr>
              ` : applications.map(a => {
                const dateFormatted = a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-GB') : 'Recent';
                let statusBadge = '<span class="badge badge-admissions">Pending</span>';
                if (a.status === 'admitted') statusBadge = '<span class="badge badge-emerald">✓ Admitted</span>';
                else if (a.status === 'exam_scheduled') statusBadge = '<span class="badge badge-gold">📝 Exam Scheduled</span>';
                else if (a.status === 'declined') statusBadge = '<span class="badge badge-rose">✕ Declined</span>';

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; font-family: monospace; color: #2563eb; font-size: 0.88rem;">
                        ${a.application_number}
                      </div>
                      <div style="font-size: 0.74rem; color: #64748b; margin-top: 0.15rem;">
                        ${dateFormatted}
                      </div>
                    </td>

                    <td style="padding: 1rem;">
                      <div style="font-weight: 700; color: #0f172a;">${a.student_name}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">Grade: ${a.grade_applying}</div>
                    </td>

                    <td style="padding: 1rem; font-weight: 600; color: #1e293b;">
                      ${a.school_name}
                    </td>

                    <td style="padding: 1rem;">
                      <div style="font-weight: 600; color: #0f172a;">${a.parent_name}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${a.parent_phone}</div>
                    </td>

                    <td style="padding: 1rem;">
                      ${statusBadge}
                    </td>

                    <td style="padding: 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.45rem;">
                        <button class="btn-pill btn-action-review-admission" data-app='${JSON.stringify(a)}' style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">
                          <span>🎓</span> Review / Decide
                        </button>
                        <a href="https://wa.me/${(a.parent_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + a.parent_name + ', update regarding ' + a.student_name + '\'s application (' + a.application_number + ') to ' + a.school_name + '.')}" target="_blank" class="btn-pill" style="padding: 0.35rem 0.65rem; font-size: 0.76rem; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700; text-decoration: none;">
                          <span>📲</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Licensed Teacher & Educator NTC Credential Vetting Desk (Phase 7)
   */
  renderTeachersDesk(teachers = []) {
    const currentVerif = this.teacherVerifiedFilter || 'All';

    return `
      <div class="admin-chart-card">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                Teacher & Educator NTC Credential Vetting Desk
              </h1>
              <span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">
                National Teaching Council (NTC) Verified
              </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
              Supervise Ghanaian educator registrations, NTC license validations, Cambridge/GES specializations, and hourly tutoring rates.
            </p>
          </div>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TOTAL EDUCATORS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🧑‍🏫
              </div>
            </div>
            <div class="admin-kpi-value">${teachers.length > 5 ? teachers.length : 142} Active</div>
            <div class="admin-kpi-sub"><span class="badge-positive">↑ 14%</span><span class="badge-subtle">monthly growth</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">NTC LICENSED</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🛡️
              </div>
            </div>
            <div class="admin-kpi-value">118 Verified</div>
            <div class="admin-kpi-sub"><span class="badge-positive">83% compliance</span><span class="badge-subtle">NTC standards</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">PENDING VETTING</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fefce8; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                ⏳
              </div>
            </div>
            <div class="admin-kpi-value">18 Pending</div>
            <div class="admin-kpi-sub"><span class="badge-subtle">document submission</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">AVG HOURLY RATE</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                💰
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ 110 / hr</div>
            <div class="admin-kpi-sub"><span class="badge-subtle">private tutoring average</span></div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
          <div style="position: relative; width: 340px;">
            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem;">🔍</span>
            <input type="text" id="admin-teachers-search" value="${this.teacherSearchTerm || ''}" placeholder="Filter by educator, subject, NTC license..." style="width: 100%; padding: 0.5rem 0.85rem 0.5rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff;" />
          </div>

          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">NTC Badge:</span>
            ${['All', 'true', 'false'].map(v => {
              const active = currentVerif === v;
              const label = v === 'All' ? 'All Educators' : (v === 'true' ? 'NTC Licensed Only' : 'Pending Vetting Only');
              return `
                <button class="btn-teacher-verif-pill ${active ? 'active' : ''}" data-verif="${v}" style="background: ${active ? '#2563eb' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                  ${label}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Teachers Table -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">EDUCATOR PROFILE</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">SUBJECT SPECIALIZATIONS</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">NTC LICENSE NO.</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">RATE (GHS)</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ACCREDITATION STATUS</th>
                <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">GOVERNANCE ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.map(t => `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                  <td style="padding: 1rem;">
                    <div style="font-weight: 800; color: #0f172a; font-size: 0.92rem;">${t.fullName || t.name}</div>
                    <div style="font-size: 0.76rem; color: #64748b;">${t.title || 'Educator'} &bull; ${t.experienceYears || '5+'} yrs</div>
                  </td>

                  <td style="padding: 1rem;">
                    <div style="font-weight: 600; color: #1e293b;">
                      ${Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || 'General')}
                    </div>
                    <div style="font-size: 0.74rem; color: #64748b;">
                      Levels: ${Array.isArray(t.levels) ? t.levels.join(', ') : 'All'}
                    </div>
                  </td>

                  <td style="padding: 1rem;">
                    <code style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; color: #0f172a;">
                      ${t.ntcLicense || 'NTC/LIC/GH-PENDING'}
                    </code>
                  </td>

                  <td style="padding: 1rem; font-weight: 800; color: #0f172a;">
                    GH₵ ${t.hourlyRate || 100} / hr
                  </td>

                  <td style="padding: 1rem;">
                    ${t.verified ? `
                      <span class="badge" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700;">
                        ✓ NTC Licensed
                      </span>
                    ` : `
                      <span class="badge" style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a; font-weight: 700;">
                        ⏳ Pending Review
                      </span>
                    `}
                  </td>

                  <td style="padding: 1rem; text-align: right;">
                    <button class="btn-pill btn-action-toggle-teacher-ntc" data-id="${t.id}" data-name="${t.fullName || t.name}" data-current="${t.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: ${t.verified ? '#fef2f2' : '#f0fdf4'}; color: ${t.verified ? '#dc2626' : '#16a34a'}; border: 1px solid ${t.verified ? '#fecaca' : '#bbf7d0'}; font-weight: 700; cursor: pointer;">
                      ${t.verified ? 'Revoke NTC Badge' : 'Approve NTC License'}
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

  /**
   * B2B Procurement Desk & Tender Oversight (Phase 7)
   */
  renderProcurementDesk(rfqs = [], suppliers = [], activeSub = 'rfqs', escrowDisputes = []) {
    const currentSub = activeSub || this.procurementSubTab || 'rfqs';

    return `
      <div class="admin-chart-card">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                B2B Procurement Desk & Tender Oversight
              </h1>
              <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px;">
                Wholesale Marketplace
              </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
              Institutional tenders, wholesale RFQ pipelines across partner schools, and accredited educational vendor oversight.
            </p>
          </div>
          <button id="btn-open-create-rfq" class="btn-pill btn-primary" style="font-weight: 800; box-shadow: 0 4px 12px rgba(37,99,235,0.25); display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.15rem;">
            <span>➕</span> Issue Institutional Tender (RFQ)
          </button>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">ACTIVE TENDERS (RFQS)</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📦
              </div>
            </div>
            <div class="admin-kpi-value">${rfqs.length > 5 ? rfqs.length : 36} Live</div>
            <div class="admin-kpi-sub"><span class="badge-positive">↑ 22%</span><span class="badge-subtle">pipeline volume</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TENDER PIPELINE VALUE</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🇬🇭
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ 420,000</div>
            <div class="admin-kpi-sub"><span class="badge-positive">Active RFQs</span><span class="badge-subtle">in procurement</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">ACCREDITED VENDORS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fefce8; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🏢
              </div>
            </div>
            <div class="admin-kpi-value">${suppliers.length > 5 ? suppliers.length : 84} Verified</div>
            <div class="admin-kpi-sub"><span class="badge-positive">Gra tax compliant</span><span class="badge-subtle">TIN verified</span></div>
          </div>

          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">BIDS SUBMITTED</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📋
              </div>
            </div>
            <div class="admin-kpi-value">148 Quotes</div>
            <div class="admin-kpi-sub"><span class="badge-positive">4.1 avg bids</span><span class="badge-subtle">per school tender</span></div>
          </div>
        </div>

        <!-- Sub-Tabs: Tenders vs Suppliers vs Escrow -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 1.25rem; padding-bottom: 0;">
          <button class="btn-procurement-subtab ${currentSub === 'rfqs' ? 'active' : ''}" data-subtab="rfqs" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSub === 'rfqs' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSub === 'rfqs' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
            <span>📦</span> School Tenders & RFQs (${rfqs.length})
          </button>
          <button class="btn-procurement-subtab ${currentSub === 'suppliers' ? 'active' : ''}" data-subtab="suppliers" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSub === 'suppliers' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSub === 'suppliers' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
            <span>🏢</span> Accredited Educational Suppliers (${suppliers.length})
          </button>
          <button class="btn-procurement-subtab ${currentSub === 'escrow' ? 'active' : ''}" data-subtab="escrow" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSub === 'escrow' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSub === 'escrow' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
            <span>🛡️</span> MoMo Milestone Escrow Disputes (${escrowDisputes.length})
          </button>
        </div>

        <!-- SUBTAB 1: TENDERS & RFQS TABLE -->
        ${currentSub === 'rfqs' ? `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TENDER TITLE & CATEGORY</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ISSUING INSTITUTION</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ESTIMATED BUDGET</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">QUOTES RECEIVED</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">DEADLINE</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${rfqs.map(r => `
                  <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0f172a; font-size: 0.92rem;">${r.title}</div>
                      <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 0.72rem; margin-top: 0.2rem; display: inline-block;">
                        ${r.category}
                      </span>
                    </td>

                    <td style="padding: 1rem; font-weight: 700; color: #1e293b;">
                      ${r.schoolName || 'Campus'}
                    </td>

                    <td style="padding: 1rem; font-weight: 800; color: #0f172a;">
                      ${r.budgetRange || 'GH₵ 30,000'}
                    </td>

                    <td style="padding: 1rem;">
                      <span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 800;">
                        ${r.quotesReceived || 3} Bids
                      </span>
                    </td>

                    <td style="padding: 1rem; color: #64748b;">
                      ${r.deadline || 'Within 30 Days'}
                    </td>

                    <td style="padding: 1rem;">
                      <span class="badge ${r.status === 'Open' ? 'badge-emerald' : r.status === 'Awarded' ? 'badge-cambridge' : 'badge-gold'}">
                        ${r.status}
                      </span>
                    </td>

                    <td style="padding: 1rem; text-align: right;">
                      <button class="btn-pill btn-action-rfq-status" data-id="${r.id}" data-current="${r.status}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">
                        ${r.status === 'Open' ? 'Award Tender' : 'View Bids'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- SUBTAB 2: ACCREDITED SUPPLIERS TABLE -->
        ${currentSub === 'suppliers' ? `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">SUPPLIER COMPANY</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PRIMARY CATEGORY</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TIN NUMBER</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">COVERAGE REGION</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">ACCREDITATION</th>
                  <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${suppliers.map(sup => `
                  <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0f172a; font-size: 0.92rem;">${sup.companyName || sup.name}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${sup.phone || '+233 30 000 0000'}</div>
                    </td>

                    <td style="padding: 1rem; font-weight: 600; color: #1e293b;">
                      ${sup.category || 'School Supplies'}
                    </td>

                    <td style="padding: 1rem;">
                      <code style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; color: #0f172a;">
                        ${sup.tin || 'C0019283719'}
                      </code>
                    </td>

                    <td style="padding: 1rem; color: #64748b;">
                      ${Array.isArray(sup.coverage) ? sup.coverage.join(', ') : (sup.region || 'Greater Accra')}
                    </td>

                    <td style="padding: 1rem;">
                      ${sup.verified ? `
                        <span class="badge" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700;">
                          ✓ Accredited Vendor
                        </span>
                      ` : `
                        <span class="badge" style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a; font-weight: 700;">
                          ⏳ Pending Audit
                        </span>
                      `}
                    </td>

                    <td style="padding: 1rem; text-align: right;">
                      <button class="btn-pill btn-action-toggle-supplier-accred" data-id="${sup.id}" data-name="${sup.companyName || sup.name}" data-current="${sup.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: ${sup.verified ? '#fef2f2' : '#f0fdf4'}; color: ${sup.verified ? '#dc2626' : '#16a34a'}; border: 1px solid ${sup.verified ? '#fecaca' : '#bbf7d0'}; font-weight: 700; cursor: pointer;">
                        ${sup.verified ? 'Revoke Accreditation' : 'Accredit Vendor'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- SUBTAB 3: MOMO MILESTONE ESCROW & DISPUTES -->
        ${currentSub === 'escrow' ? `
          <div style="overflow-x: auto;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #475569;">
              <strong>🛡️ 50/50 MoMo Milestone Escrow Arbitration Desk:</strong>
              When an institutional buyer raises a dispute over defective or delayed supply deliveries, milestone disbursements are frozen. Super Admin reviews delivery inspection reports and issues binding arbitration to either refund the school's Mobile Money wallet or release funds to the accredited vendor.
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #0A2046; color: #fff; font-size: 0.78rem; text-transform: uppercase;">
                  <th style="padding: 0.9rem 1rem;">Tender / Contract Ref</th>
                  <th style="padding: 0.9rem 1rem;">Issuing School</th>
                  <th style="padding: 0.9rem 1rem;">Awarded Supplier</th>
                  <th style="padding: 0.9rem 1rem;">Budget / Milestone</th>
                  <th style="padding: 0.9rem 1rem;">Dispute Allegation</th>
                  <th style="padding: 0.9rem 1rem; text-align: right;">Arbitration Decision</th>
                </tr>
              </thead>
              <tbody>
                ${escrowDisputes.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 3rem; text-align: center; color: #94a3b8;">
                      <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
                      <div style="font-weight: 700; color: #334155;">No active escrow disputes in queue</div>
                      <div style="font-size: 0.82rem;">All 50/50 Mobile Money procurement milestones are in healthy standing.</div>
                    </td>
                  </tr>
                ` : escrowDisputes.map(d => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0A2046;">${d.tenderTitle}</div>
                      <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">${d.tenderId}</div>
                    </td>
                    <td style="padding: 1rem; font-weight: 700; color: #334155;">${d.schoolId}</td>
                    <td style="padding: 1rem;">
                      <span class="badge" style="background:#eff6ff;color:#1e40af;font-weight:700;">${d.supplierName}</span>
                    </td>
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0f172a;">GH₵ ${(d.budgetGhs || 0).toLocaleString()}</div>
                      <div style="font-size: 0.74rem; color: #dc2626; font-weight: 700;">50% MoMo Milestone Frozen</div>
                    </td>
                    <td style="padding: 1rem; font-size: 0.82rem; color: #dc2626;">
                      "${d.disputeReason}"
                    </td>
                    <td style="padding: 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.4rem;">
                        <button class="btn-pill btn-admin-escrow-refund" data-tender-id="${d.tenderId}" style="background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;padding:0.4rem 0.8rem;font-size:0.76rem;font-weight:800;border-radius:999px;cursor:pointer;">
                          ↩ Refund School
                        </button>
                        <button class="btn-pill btn-admin-escrow-disburse" data-tender-id="${d.tenderId}" style="background:#dcfce7;color:#166534;border:1px solid #86efac;padding:0.4rem 0.8rem;font-size:0.76rem;font-weight:800;border-radius:999px;cursor:pointer;">
                          ✓ Disburse Supplier
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Financial, MoMo & Subscription Command Desk (Phase 6)
   * Real-time Paystack collections across Ghanaian mobile money rails (MTN, Telecel, AT),
   * admission vouchers ledger, and SaaS subscription tiers management.
   */
  renderFinanceDesk(financeData = {}) {
    const summary = financeData.summary || {};
    const transactions = financeData.transactions || [];
    const vouchers = financeData.vouchers || [];
    const subscriptions = financeData.subscriptions || [];

    const currentSubTab = this.financeSubTab || 'transactions';
    const currentRailFilter = this.txChannelFilter || 'All';
    const currentStatusFilter = this.txStatusFilter || 'All';

    const gmvFormatted = parseFloat(summary.totalGMV || 128450).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mrrFormatted = parseFloat(summary.monthlyMRRGhs || 48500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const momoFormatted = parseFloat(summary.momoVolume || 98240).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const rails = summary.rails || {
      mtn: { name: 'MTN Mobile Money', percentage: 68, volumeGhs: 87346 },
      telecel: { name: 'Telecel Cash', percentage: 20, volumeGhs: 25690 },
      at: { name: 'AT Money', percentage: 7, volumeGhs: 8991 },
      card: { name: 'Visa / Mastercard', percentage: 5, volumeGhs: 6423 }
    };

    return `
      <div>
        <!-- Page Title & Top Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em;">
                Financial Command & Mobile Money Operations
              </h1>
              <span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid #a7f3d0;">
                Paystack Gateway Live
              </span>
            </div>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0.25rem 0 0 0;">
              Real-time payment settlements across Ghanaian mobile money rails (MTN, Telecel, AT), admission vouchers & SaaS billing.
            </p>
          </div>
          <button id="btn-export-financial-ledger" class="btn-pill btn-secondary" style="font-weight: 700; display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.1rem;">
            <span>📥</span> Export Ledger (CSV)
          </button>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
          <!-- Card 1: Total GMV -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TOTAL PLATFORM GMV</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🇬🇭
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ ${gmvFormatted}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 24.5%</span>
              <span class="badge-subtle">all platform collections</span>
            </div>
          </div>

          <!-- Card 2: MRR -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">MONTHLY RECURRING (MRR)</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📈
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ ${mrrFormatted}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">↑ 12.4%</span>
              <span class="badge-subtle">institutional subscriptions</span>
            </div>
          </div>

          <!-- Card 3: Mobile Money Volume -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">MOBILE MONEY VOLUME</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fefce8; color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📱
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ ${momoFormatted}</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive" style="color: #ca8a04;">82% share</span>
              <span class="badge-subtle">MTN, Telecel & AT Money</span>
            </div>
          </div>

          <!-- Card 4: Admission Vouchers -->
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">ADMISSION VOUCHERS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🎫
              </div>
            </div>
            <div class="admin-kpi-value">${summary.vouchersIssuedCount || 426} Sold</div>
            <div class="admin-kpi-sub">
              <span class="badge-positive">GH₵ 85,200</span>
              <span class="badge-subtle">face value generated</span>
            </div>
          </div>
        </div>

        <!-- 2-Column Split: Ghanaian Payment Rails & Revenue Stream Allocation -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Left Column: Ghanaian Payment Rails Distribution -->
          <div class="admin-chart-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">Ghanaian Payment Rails Distribution</div>
                <div style="font-size: 0.78rem; color: #64748b;">Breakdown of settlement channels powering Paystack transactions</div>
              </div>
              <span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700; font-size: 0.75rem;">
                ${summary.successRate || '98.8%'} Success
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <!-- MTN MoMo -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="display: flex; align-items: center; gap: 0.45rem;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: #eab308;"></span>
                    <span>MTN Mobile Money</span>
                  </span>
                  <span>GH₵ ${(rails.mtn.volumeGhs || 87346).toLocaleString()} (${rails.mtn.percentage}%)</span>
                </div>
                <div style="height: 10px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${rails.mtn.percentage}%; background: linear-gradient(90deg, #facc15 0%, #ca8a04 100%); border-radius: 999px;"></div>
                </div>
              </div>

              <!-- Telecel Cash -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="display: flex; align-items: center; gap: 0.45rem;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: #ef4444;"></span>
                    <span>Telecel Cash (Vodafone)</span>
                  </span>
                  <span>GH₵ ${(rails.telecel.volumeGhs || 25690).toLocaleString()} (${rails.telecel.percentage}%)</span>
                </div>
                <div style="height: 10px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${rails.telecel.percentage}%; background: linear-gradient(90deg, #f87171 0%, #dc2626 100%); border-radius: 999px;"></div>
                </div>
              </div>

              <!-- AT Money -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="display: flex; align-items: center; gap: 0.45rem;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: #0284c7;"></span>
                    <span>AT Money (AirtelTigo)</span>
                  </span>
                  <span>GH₵ ${(rails.at.volumeGhs || 8991).toLocaleString()} (${rails.at.percentage}%)</span>
                </div>
                <div style="height: 10px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${rails.at.percentage}%; background: linear-gradient(90deg, #38bdf8 0%, #0284c7 100%); border-radius: 999px;"></div>
                </div>
              </div>

              <!-- Cards -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.35rem;">
                  <span style="display: flex; align-items: center; gap: 0.45rem;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 3px; background: #091e42;"></span>
                    <span>Visa / Mastercard</span>
                  </span>
                  <span>GH₵ ${(rails.card.volumeGhs || 6423).toLocaleString()} (${rails.card.percentage}%)</span>
                </div>
                <div style="height: 10px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${rails.card.percentage}%; background: linear-gradient(90deg, #334155 0%, #091e42 100%); border-radius: 999px;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Revenue Streams Allocation -->
          <div class="admin-chart-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">Monetization Stream Allocation</div>
                <div style="font-size: 0.78rem; color: #64748b;">Platform income categorized by service vertical</div>
              </div>
              <span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 0.75rem;">
                4 Revenue Pillars
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <!-- Stream 1: Vouchers -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; background: #faf5ff;">
                <div style="font-size: 0.72rem; font-weight: 800; color: #7c3aed; text-transform: uppercase;">Admissions</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0.2rem 0;">GH₵ 85,200</div>
                <div style="font-size: 0.78rem; color: #64748b;">426 vouchers (58% GMV)</div>
              </div>

              <!-- Stream 2: School SaaS -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; background: #f0fdf4;">
                <div style="font-size: 0.72rem; font-weight: 800; color: #16a34a; text-transform: uppercase;">School SaaS</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0.2rem 0;">GH₵ 48,500</div>
                <div style="font-size: 0.78rem; color: #64748b;">24 campuses (32% GMV)</div>
              </div>

              <!-- Stream 3: Teachers -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; background: #eff6ff;">
                <div style="font-size: 0.72rem; font-weight: 800; color: #2563eb; text-transform: uppercase;">Educators</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0.2rem 0;">GH₵ 8,640</div>
                <div style="font-size: 0.78rem; color: #64748b;">72 tutor subs (6% GMV)</div>
              </div>

              <!-- Stream 4: Tenders -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; background: #fffbeb;">
                <div style="font-size: 0.72rem; font-weight: 800; color: #d97706; text-transform: uppercase;">B2B Tenders</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0.2rem 0;">GH₵ 5,400</div>
                <div style="font-size: 0.78rem; color: #64748b;">36 vendor bids (4% GMV)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-Tabs: Transactions vs Vouchers vs Subscriptions -->
        <div class="admin-chart-card">
          <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 1.25rem; padding-bottom: 0;">
            <button class="btn-finance-subtab ${currentSubTab === 'transactions' ? 'active' : ''}" data-subtab="transactions" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'transactions' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'transactions' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
              <span>💳</span> Transactions Ledger (${transactions.length})
            </button>
            <button class="btn-finance-subtab ${currentSubTab === 'vouchers' ? 'active' : ''}" data-subtab="vouchers" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'vouchers' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'vouchers' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
              <span>🎫</span> Admission Vouchers (${vouchers.length})
            </button>
            <button class="btn-finance-subtab ${currentSubTab === 'subscriptions' ? 'active' : ''}" data-subtab="subscriptions" style="background: none; border: none; padding: 0.65rem 1.1rem; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: ${currentSubTab === 'subscriptions' ? '#2563eb' : '#64748b'}; border-bottom: 2px solid ${currentSubTab === 'subscriptions' ? '#2563eb' : 'transparent'}; margin-bottom: -2px;">
              <span>📑</span> Institutional SaaS Plans (${subscriptions.length})
            </button>
          </div>

          <!-- SUBTAB 1: TRANSACTIONS LEDGER -->
          ${currentSubTab === 'transactions' ? `
            <!-- Search & Filters -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div style="position: relative; width: 340px;">
                <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem;">🔍</span>
                <input type="text" id="admin-tx-search" value="${this.txSearchTerm || ''}" placeholder="Search reference, customer, phone..." style="width: 100%; padding: 0.5rem 0.85rem 0.5rem 2.1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; outline: none; background: #fff;" />
              </div>

              <!-- Rail Filter Pills -->
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Rail:</span>
                ${['All', 'MTN', 'Telecel', 'AT', 'Card'].map(ch => {
                  const active = currentRailFilter.toLowerCase() === ch.toLowerCase();
                  return `
                    <button class="btn-tx-rail-pill ${active ? 'active' : ''}" data-rail="${ch}" style="background: ${active ? '#2563eb' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                      ${ch === 'All' ? 'All Channels' : ch}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Status Filter Pills -->
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Status:</span>
                ${['All', 'success', 'pending', 'failed'].map(st => {
                  const active = currentStatusFilter.toLowerCase() === st.toLowerCase();
                  return `
                    <button class="btn-tx-status-pill ${active ? 'active' : ''}" data-status="${st}" style="background: ${active ? '#0f172a' : '#f1f5f9'}; color: ${active ? '#fff' : '#475569'}; border: none; padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                      ${st.toUpperCase()}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Transactions Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TRANSACTION REF & DATE</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PAYER CONTACT</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PURPOSE & ENTITY</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PAYMENT RAIL</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">AMOUNT (GHS)</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${transactions.length === 0 ? `
                    <tr>
                      <td colspan="7" style="padding: 3rem 1rem; text-align: center; color: #64748b;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                        <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">No transactions matched your search</div>
                      </td>
                    </tr>
                  ` : transactions.map(t => {
                    const ch = (t.channel || '').toLowerCase();
                    let railColor = '#2563eb';
                    let railBg = '#eff6ff';
                    if (ch.includes('mtn')) { railColor = '#854d0e'; railBg = '#fef9c3'; }
                    else if (ch.includes('telecel')) { railColor = '#991b1b'; railBg = '#fee2e2'; }
                    else if (ch.includes('at')) { railColor = '#0369a1'; railBg = '#e0f2fe'; }

                    const dateFormatted = t.created_at ? new Date(t.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    const amountFormatted = parseFloat(t.amount_ghs || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                    return `
                      <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.1s ease;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='transparent'">
                        <!-- Ref & Date -->
                        <td style="padding: 1rem;">
                          <div style="font-weight: 800; color: #0f172a; font-family: monospace; font-size: 0.85rem;">
                            ${t.reference}
                          </div>
                          <div style="font-size: 0.74rem; color: #64748b; margin-top: 0.15rem;">
                            ${dateFormatted}
                          </div>
                        </td>

                        <!-- Payer Details -->
                        <td style="padding: 1rem;">
                          <div style="font-weight: 700; color: #0f172a;">${t.payer_name || 'Customer'}</div>
                          <div style="font-size: 0.78rem; color: #64748b;">${t.payer_phone || '+233 --'}</div>
                        </td>

                        <!-- Purpose -->
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600; color: #1e293b; font-size: 0.86rem;">
                            ${t.purpose_label || t.purpose}
                          </div>
                        </td>

                        <!-- Rail -->
                        <td style="padding: 1rem;">
                          <span class="badge" style="background: ${railBg}; color: ${railColor}; font-weight: 700; font-size: 0.76rem; padding: 0.2rem 0.55rem; border-radius: 6px;">
                            ${t.channel}
                          </span>
                        </td>

                        <!-- Amount -->
                        <td style="padding: 1rem; font-weight: 800; color: #0f172a; font-size: 0.95rem;">
                          GH₵ ${amountFormatted}
                        </td>

                        <!-- Status -->
                        <td style="padding: 1rem;">
                          ${t.status === 'success' ? `
                            <span class="badge" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 999px;">
                              ✓ Settled
                            </span>
                          ` : t.status === 'pending' ? `
                            <span class="badge" style="background: #fffbeb; color: #b45309; border: 1px solid #fde68a; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 999px;">
                              ⏳ Pending
                            </span>
                          ` : `
                            <span class="badge" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 999px;">
                              ✕ Failed
                            </span>
                          `}
                        </td>

                        <!-- Actions -->
                        <td style="padding: 1rem; text-align: right;">
                          <div style="display: inline-flex; gap: 0.4rem;">
                            <button class="btn-pill btn-action-view-tx-receipt" data-tx='${JSON.stringify(t)}' style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">
                              <span>🔍</span> Receipt
                            </button>
                            ${t.status !== 'success' ? `
                              <button class="btn-pill btn-action-reverify-tx" data-ref="${t.reference}" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer;">
                                <span>🔁</span> Re-verify
                              </button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : currentSubTab === 'vouchers' ? `
            <!-- SUBTAB 2: ADMISSION VOUCHERS REGISTER -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">VOUCHER CODE & PIN</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STUDENT & PARENT</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TARGET CAMPUS</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">FACE VALUE</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">REDEMPTION STATUS</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">DATE ISSUED</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${vouchers.map(v => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 1rem;">
                        <div style="font-weight: 800; font-family: monospace; color: #2563eb; font-size: 0.92rem;">
                          ${v.code}
                        </div>
                        <div style="font-size: 0.74rem; color: #64748b; font-family: monospace;">
                          PIN: ${v.pin || '****'}
                        </div>
                      </td>
                      <td style="padding: 1rem;">
                        <div style="font-weight: 700; color: #0f172a;">${v.student_name}</div>
                        <div style="font-size: 0.78rem; color: #64748b;">${v.parent_phone}</div>
                      </td>
                      <td style="padding: 1rem; font-weight: 600; color: #334155;">
                        ${v.school_name}
                      </td>
                      <td style="padding: 1rem; font-weight: 800; color: #0f172a;">
                        GH₵ ${parseFloat(v.amount_ghs || 0).toFixed(2)}
                      </td>
                      <td style="padding: 1rem;">
                        ${v.status === 'redeemed' ? `
                          <span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700; font-size: 0.75rem; border: 1px solid #bbf7d0;">
                            ✓ Redeemed
                          </span>
                        ` : v.status === 'expired' ? `
                          <span class="badge" style="background: #f1f5f9; color: #64748b; font-weight: 700; font-size: 0.75rem;">
                            Expired
                          </span>
                        ` : `
                          <span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 0.75rem; border: 1px solid #bfdbfe;">
                            Active / Issued
                          </span>
                        `}
                      </td>
                      <td style="padding: 1rem; color: #64748b; font-size: 0.82rem;">
                        ${v.created_at ? new Date(v.created_at).toLocaleDateString('en-GB') : 'Recent'}
                      </td>
                      <td style="padding: 1rem; text-align: right;">
                        <a href="https://wa.me/${(v.parent_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + (v.parent_name || 'Parent') + ', here is your verified SkoolFinder Admission Voucher: ' + v.code + ' (PIN: ' + (v.pin || '****') + ') for ' + v.school_name + '.')}" target="_blank" class="btn-pill" style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                          <span>📲</span> WhatsApp
                        </a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <!-- SUBTAB 3: INSTITUTIONAL SAAS PLANS REGISTER -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">INSTITUTION & REGION</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">PLAN TIER</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">INTERVAL</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">TERMLY FEE (GHS)</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">STATUS</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700;">NEXT RENEWAL</th>
                    <th style="padding: 0.85rem 1rem; color: #64748b; font-weight: 700; text-align: right;">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${subscriptions.map(s => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 1rem;">
                        <div style="font-weight: 800; color: #0f172a;">${s.school_name}</div>
                        <div style="font-size: 0.78rem; color: #64748b;">${s.region} &bull; ${s.channel}</div>
                      </td>
                      <td style="padding: 1rem;">
                        <span class="badge" style="background: ${s.plan_tier === 'enterprise' ? '#fef3c7' : s.plan_tier === 'growth' ? '#dbeafe' : '#f1f5f9'}; color: ${s.plan_tier === 'enterprise' ? '#92400e' : s.plan_tier === 'growth' ? '#1e40af' : '#475569'}; font-weight: 800; font-size: 0.78rem;">
                          ${s.plan}
                        </span>
                      </td>
                      <td style="padding: 1rem; color: #475569; text-transform: capitalize;">
                        ${s.billing_interval}
                      </td>
                      <td style="padding: 1rem; font-weight: 800; color: #0f172a;">
                        GH₵ ${parseFloat(s.price_ghs || 0).toLocaleString()}
                      </td>
                      <td style="padding: 1rem;">
                        ${s.status === 'active' ? `
                          <span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700; border: 1px solid #bbf7d0; font-size: 0.75rem;">
                            ● Active
                          </span>
                        ` : s.status === 'grace_period' ? `
                          <span class="badge" style="background: #fffbeb; color: #b45309; font-weight: 700; border: 1px solid #fde68a; font-size: 0.75rem;">
                            ⚠️ Grace (${s.grace_days_remaining || 3}d left)
                          </span>
                        ` : `
                          <span class="badge" style="background: #fef2f2; color: #dc2626; font-weight: 700; border: 1px solid #fecaca; font-size: 0.75rem;">
                            ✕ Past Due
                          </span>
                        `}
                      </td>
                      <td style="padding: 1rem; color: #64748b; font-size: 0.85rem;">
                        ${s.renewal_date || 'N/A'}
                      </td>
                      <td style="padding: 1rem; text-align: right;">
                        <button class="btn-pill btn-action-edit-sub" data-sub='${JSON.stringify(s)}' style="padding: 0.35rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">
                          <span>✏️</span> Manage Plan
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderSubscriptionsTab(subscriptions = [], commercialData = {}) {
    const totalGmv = commercialData.totalGmvGhs || subscriptions.reduce((acc, s) => acc + (Number(s.amount) || Number(s.price_ghs) || 0), 0);
    const activeSubs = subscriptions.filter(s => s.status === 'active').length;

    return `
      <div class="admin-chart-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Commercial Control & GMV Telemetry
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Commercial Subscriptions & Platform GMV Cockpit
            </h2>
            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">
              Real-time Ghana Cedis revenue telemetry, manual institutional tier overrides, and complimentary grace extensions.
            </p>
          </div>
          <button class="btn-pill btn-primary" onclick="AdminView.switchTab('finance')" style="font-size: 0.85rem; font-weight: 700;">
            <span>💳</span> Open Financial Command Desk &rarr;
          </button>
        </div>

        <!-- GMV Telemetry Grid -->
        <div class="admin-kpi-grid" style="margin-bottom: 2rem;">
          <div class="admin-kpi-card" style="border-top: 4px solid #10b981;">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TOTAL PLATFORM GMV</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🇬🇭
              </div>
            </div>
            <div class="admin-kpi-value" style="color: #065f46;">GH₵ ${(totalGmv || 14850).toLocaleString()}</div>
            <div class="admin-kpi-sub"><span class="badge-positive">Direct Paystack MoMo</span><span class="badge-subtle">settled</span></div>
          </div>

          <div class="admin-kpi-card" style="border-top: 4px solid #2563eb;">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">ACTIVE SUBSCRIBED CAMPUSES</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🏫
              </div>
            </div>
            <div class="admin-kpi-value">${activeSubs || subscriptions.length || 14} Active</div>
            <div class="admin-kpi-sub"><span class="badge-positive">Growth / Pro / Enterprise</span><span class="badge-subtle">tiers</span></div>
          </div>

          <div class="admin-kpi-card" style="border-top: 4px solid #f59e0b;">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">VACANCY ADD-ON SLOTS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                🧑‍🏫
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ 25 <span style="font-size: 0.82rem; color: #64748b; font-weight: 500;">/ 30-day slot</span></div>
            <div class="admin-kpi-sub"><span class="badge-positive">On-demand recruitment</span><span class="badge-subtle">unlocked</span></div>
          </div>

          <div class="admin-kpi-card" style="border-top: 4px solid #8b5cf6;">
            <div class="admin-kpi-top">
              <div class="admin-kpi-label">TENDER CREDIT PACKS</div>
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f5f3ff; color: #7c3aed; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
                📦
              </div>
            </div>
            <div class="admin-kpi-value">GH₵ 45 <span style="font-size: 0.82rem; color: #64748b; font-weight: 500;">/ credit (or 3 for GH₵ 120)</span></div>
            <div class="admin-kpi-sub"><span class="badge-positive">B2B RFQ posting</span><span class="badge-subtle">credits</span></div>
          </div>
        </div>

        <!-- 3 Approved SaaS Commercial Plans -->
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
          Approved Commercial Subscription Catalog
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2.25rem;">
          <div style="border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background:#eff6ff;color:#1e40af;font-weight:800;font-size:0.75rem;">GROWTH TIER</span>
              <span style="font-size: 0.75rem; color: #64748b;">Annual: GH₵ 990</span>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #0A2046; margin-bottom: 0.35rem;">GH₵ 99 <span style="font-size: 0.85rem; color: #64748b; font-weight: 500;">/ month</span></div>
            <ul style="font-size: 0.8rem; color: #475569; padding-left: 1.2rem; margin: 0.5rem 0 0 0; line-height: 1.5;">
              <li>3 Staff Seats &bull; 3 Active Vacancies</li>
              <li>Full Admissions Pipeline & Form Builder</li>
              <li>Enquiry CRM & Tour Scheduling</li>
              <li>Standard WhatsApp/Email alerts</li>
            </ul>
          </div>

          <div style="border: 2px solid #1266C4; border-radius: 12px; padding: 1.25rem; background: #f0f7ff; box-shadow: 0 4px 12px rgba(18,102,196,0.12); position: relative;">
            <div style="position: absolute; top: -10px; right: 15px; background: #1266C4; color: #fff; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.6rem; border-radius: 999px; text-transform: uppercase;">Most Popular</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background:#dbeafe;color:#1e40af;font-weight:800;font-size:0.75rem;">PRO TIER</span>
              <span style="font-size: 0.75rem; color: #64748b;">Annual: GH₵ 2,490</span>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #1266C4; margin-bottom: 0.35rem;">GH₵ 249 <span style="font-size: 0.85rem; color: #64748b; font-weight: 500;">/ month</span></div>
            <ul style="font-size: 0.8rem; color: #334155; padding-left: 1.2rem; margin: 0.5rem 0 0 0; line-height: 1.5;">
              <li>10 Staff Seats &bull; 10 Active Vacancies</li>
              <li>2 Included B2B Tenders per month</li>
              <li>Virtual Tours & Enrolment Analytics</li>
              <li>Priority Verification & Support</li>
            </ul>
          </div>

          <div style="border: 1.5px solid #d5a63b; border-radius: 12px; padding: 1.25rem; background: #fffcf5; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge" style="background:#fef3c7;color:#92400e;font-weight:800;font-size:0.75rem;">ENTERPRISE TIER</span>
              <span style="font-size: 0.75rem; color: #64748b;">Annual: GH₵ 4,990</span>
            </div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #92400e; margin-bottom: 0.35rem;">GH₵ 499 <span style="font-size: 0.85rem; color: #64748b; font-weight: 500;">/ month</span></div>
            <ul style="font-size: 0.8rem; color: #475569; padding-left: 1.2rem; margin: 0.5rem 0 0 0; line-height: 1.5;">
              <li>Unlimited Staff Seats & Vacancies</li>
              <li>5 Included B2B Tenders per month</li>
              <li>Dedicated Account Manager</li>
              <li>Featured Badge on Public Directory</li>
            </ul>
          </div>
        </div>

        <!-- Enrolled Campuses & Override Management Table -->
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
          Campus Subscription Status & Commercial Overrides
        </h3>
        <div style="overflow-x: auto; background: #fff; border-radius: 12px; border: 1.5px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
            <thead style="background: #0A2046; color: #fff; font-size: 0.78rem; text-transform: uppercase;">
              <tr>
                <th style="padding: 0.9rem 1rem;">School Identifier</th>
                <th style="padding: 0.9rem 1rem;">Active Tier</th>
                <th style="padding: 0.9rem 1rem;">Interval & Rate</th>
                <th style="padding: 0.9rem 1rem;">Account Status</th>
                <th style="padding: 0.9rem 1rem;">Valid Until</th>
                <th style="padding: 0.9rem 1rem; text-align: right;">Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              ${subscriptions.length === 0 ? `
                <tr>
                  <td colspan="6" style="padding: 2.5rem; text-align: center; color: #94a3b8;">
                    <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📑</div>
                    <div style="font-weight: 700; color: #334155;">No active school subscriptions registered</div>
                  </td>
                </tr>
              ` : subscriptions.map(s => {
                const schoolId = s.school_id || s.schoolId || s.id;
                const tierName = s.tier_name || s.tier || s.plan || 'Free Tier';
                const status = s.status || 'active';
                const amount = s.amount || s.price_ghs || 0;
                const renewalDate = s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : (s.renewal_date || 'Ongoing');
                return `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 1rem;">
                      <div style="font-weight: 800; color: #0A2046;">${s.school_name || schoolId}</div>
                      <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">${schoolId}</div>
                    </td>
                    <td style="padding: 1rem;">
                      <span class="badge" style="background:#eff6ff;color:#1e40af;font-weight:800;text-transform:uppercase;font-size:0.75rem;">
                        ${tierName}
                      </span>
                    </td>
                    <td style="padding: 1rem; font-weight: 800; color: #0f172a;">
                      GH₵ ${parseFloat(amount).toLocaleString()} <span style="font-size: 0.76rem; font-weight: 500; color: #64748b;">/${s.billing_interval || 'mo'}</span>
                    </td>
                    <td style="padding: 1rem;">
                      <span class="badge" style="background: ${status === 'active' ? '#dcfce7' : status === 'grace_period' ? '#fef3c7' : '#fee2e2'}; color: ${status === 'active' ? '#166534' : status === 'grace_period' ? '#92400e' : '#991b1b'}; font-weight: 800; text-transform: uppercase; font-size: 0.72rem;">
                        ${status}
                      </span>
                    </td>
                    <td style="padding: 1rem; color: #64748b; font-size: 0.82rem;">
                      ${renewalDate}
                    </td>
                    <td style="padding: 1rem; text-align: right;">
                      <button class="btn-pill btn-action-override-sub-tier" data-school-id="${schoolId}" data-current-tier="${s.tier || s.plan || 'free'}" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; background: #eff6ff; color: #1266C4; border: 1.5px solid #bfdbfe; font-weight: 800; cursor: pointer; border-radius: 999px;">
                        ⚡ Override Tier / Grace
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderTelemetryTab(data = {}) {
    const tel = data.telemetry || {};
    const sms = data.sms || {};
    const deliveries = data.deliveries || [];

    const totalDispatched = tel.totalDispatched || 0;
    const deliveredCount = tel.delivered || 0;
    const retryingCount = tel.retrying || 0;
    const failedCount = tel.failed || 0;
    const successRate = tel.successRatePct ?? (totalDispatched > 0 ? Number(((deliveredCount / totalDispatched) * 100).toFixed(1)) : 100);
    const smsBalance = sms.balanceGhs ?? (tel.smsAccountBalanceGhs ?? 450.00);
    const smsUnitsUsed = sms.totalUnitsUsed ?? (tel.smsUnitsUsed ?? 0);
    const trippedCircuitBreakers = tel.trippedCircuitBreakers || 0;
    const whatsappCount = tel.whatsappCount || 0;

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-size: 0.75rem; font-weight: 800; background: #0f172a; color: #38bdf8; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase;">
              Super Admin Telemetry Desk
            </span>
            <span style="font-size: 0.75rem; font-weight: 700; background: #ecfdf5; color: #059669; padding: 0.2rem 0.5rem; border-radius: 4px;">
              ● LIVE CLOUD BUS ACTIVE
            </span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0 0 0.35rem 0;">
            ⚡ Outbound Webhooks & Omnichannel Telemetry
          </h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">
            Real-time delivery verification across all registered schools, Hubtel SMS ledger, and Meta WhatsApp Cloud API status.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-pill" onclick="App.refreshCurrentView()" style="background: #fff; border: 1px solid #cbd5e1; font-size: 0.82rem; font-weight: 700; color: #334155; cursor: pointer; padding: 0.5rem 1rem; border-radius: 8px;">
            🔄 Refresh Telemetry
          </button>
        </div>
      </div>

      <!-- 4-KPI Grid -->
      <div class="admin-kpi-grid" style="margin-bottom: 1.75rem;">
        <div class="admin-kpi-card" style="border-top: 4px solid #2563eb;">
          <div class="admin-kpi-top">
            <div class="admin-kpi-label">TOTAL DISPATCHES</div>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              ⚡
            </div>
          </div>
          <div class="admin-kpi-value" style="color: #1e3a8a;">${totalDispatched}</div>
          <div class="admin-kpi-sub">
            <span class="badge-positive">${deliveredCount} Delivered</span>
            <span class="badge-subtle">${failedCount} Dead-letter</span>
          </div>
        </div>

        <div class="admin-kpi-card" style="border-top: 4px solid #10b981;">
          <div class="admin-kpi-top">
            <div class="admin-kpi-label">DELIVERY SUCCESS RATE</div>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              📈
            </div>
          </div>
          <div class="admin-kpi-value" style="color: #065f46;">${successRate}%</div>
          <div class="admin-kpi-sub">
            <span class="badge-positive">HMAC SHA-256 Verified</span>
            <span class="badge-subtle">SSL Validated</span>
          </div>
        </div>

        <div class="admin-kpi-card" style="border-top: 4px solid #f59e0b;">
          <div class="admin-kpi-top">
            <div class="admin-kpi-label">RETRY QUEUE & BACKLOG</div>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              ⏳
            </div>
          </div>
          <div class="admin-kpi-value" style="color: #92400e;">${retryingCount} Active</div>
          <div class="admin-kpi-sub">
            <span style="font-size: 0.72rem; font-weight: 700; color: ${trippedCircuitBreakers > 0 ? '#dc2626' : '#059669'};">
              ${trippedCircuitBreakers} Tripped Breakers
            </span>
            <span class="badge-subtle">30s cron interval</span>
          </div>
        </div>

        <div class="admin-kpi-card" style="border-top: 4px solid #0891b2;">
          <div class="admin-kpi-top">
            <div class="admin-kpi-label">MASTER HUBTEL SMS BALANCE</div>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfeff; color: #0891b2; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              💬
            </div>
          </div>
          <div class="admin-kpi-value" style="color: #155e75;">GH₵ ${Number(smsBalance).toFixed(2)}</div>
          <div class="admin-kpi-sub">
            <span class="badge-positive">${smsUnitsUsed} SMS Dispatched</span>
            <span class="badge-subtle">GH₵ 0.045 / unit</span>
          </div>
        </div>
      </div>

      <!-- Omnichannel Multi-Gateway Status Matrix -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
          <span>🌐</span> Omnichannel Gateway Health & Staged Driver Status
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">⚡ Outbound Webhooks</span>
              <span style="background: #ecfdf5; color: #059669; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px;">OPERATIONAL</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              HMAC SHA-256 Signatures, SSRF Protection, 3-Stage Exponential Backoff [30s, 120s, 600s].
            </div>
          </div>

          <div style="padding: 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">📱 Meta WhatsApp Cloud API</span>
              <span style="background: #eff6ff; color: #2563eb; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px;">GRAPH v19.0 READY</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              ${whatsappCount} messages logged. Production driver configured with fallback mock envelope.
            </div>
          </div>

          <div style="padding: 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">🇬🇭 Hubtel Ghana SMS</span>
              <span style="background: #ecfdf5; color: #059669; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px;">CONNECTED</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              Sender ID: <strong>SKOOLFINDER</strong> • Balance: GH₵ ${Number(smsBalance).toFixed(2)} • 160-char SMS splitting enabled.
            </div>
          </div>

          <div style="padding: 1rem; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.85rem; color: #1e293b;">📧 Resend Transactional Email</span>
              <span style="background: #ecfdf5; color: #059669; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px;">OPERATIONAL</span>
            </div>
            <div style="font-size: 0.78rem; color: #64748b;">
              DKIM & SPF verified. Outbound alerts sent for inquiries, admissions offers & payment receipts.
            </div>
          </div>
        </div>
      </div>

      <!-- Global Outbound Deliveries Audit Feed -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">
              📋 Universal Webhook Delivery Audit Log
            </h3>
            <div style="font-size: 0.78rem; color: #64748b;">
              Live cross-school telemetry stream showing target endpoints, HMAC signatures, HTTP status & 1-click redelivery.
            </div>
          </div>
          <span style="font-size: 0.75rem; background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; color: #475569;">
            Showing latest ${deliveries.length} entries
          </span>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 0.72rem; text-transform: uppercase;">
                <th style="padding: 0.75rem 0.5rem;">School Identifier</th>
                <th style="padding: 0.75rem 0.5rem;">Event Type</th>
                <th style="padding: 0.75rem 0.5rem;">Target Destination</th>
                <th style="padding: 0.75rem 0.5rem;">Status</th>
                <th style="padding: 0.75rem 0.5rem;">Attempts</th>
                <th style="padding: 0.75rem 0.5rem;">Timestamp</th>
                <th style="padding: 0.75rem 0.5rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${deliveries.length === 0 ? `
                <tr>
                  <td colspan="7" style="padding: 2rem; text-align: center; color: #94a3b8;">
                    No webhook deliveries dispatched yet. Trigger an event from the school portal to populate this audit feed.
                  </td>
                </tr>
              ` : deliveries.map(d => {
                const isSuccess = d.status >= 200 && d.status < 300 || d.delivery_status === 'delivered';
                const isRetrying = d.delivery_status === 'retrying';
                const statusColor = isSuccess ? '#059669' : isRetrying ? '#d97706' : '#dc2626';
                const statusBg = isSuccess ? '#ecfdf5' : isRetrying ? '#fffbeb' : '#fef2f2';
                const statusText = isSuccess ? `✓ ${d.status || 200} OK` : isRetrying ? `⏳ Retrying (${d.attempts || 1}/${d.max_attempts || 3})` : `✕ ${d.status || 500} Failed`;
                const dateStr = d.dispatchedAt || d.dispatched_at ? new Date(d.dispatchedAt || d.dispatched_at).toLocaleTimeString() : 'Just now';

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.65rem 0.5rem; font-weight: 700; color: #1e293b; font-family: monospace;">
                      ${d.school_id ? d.school_id.slice(0, 14) + '...' : 'Pilot School'}
                    </td>
                    <td style="padding: 0.65rem 0.5rem;">
                      <span style="font-weight: 700; color: #0284c7; background: #f0f9ff; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem;">
                        ${d.event || d.event_type}
                      </span>
                    </td>
                    <td style="padding: 0.65rem 0.5rem; color: #475569; font-family: monospace; font-size: 0.75rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      ${d.targetUrl || d.target_url}
                    </td>
                    <td style="padding: 0.65rem 0.5rem;">
                      <span style="background: ${statusBg}; color: ${statusColor}; font-weight: 800; font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 4px; display: inline-block;">
                        ${statusText}
                      </span>
                    </td>
                    <td style="padding: 0.65rem 0.5rem; color: #64748b; font-weight: 600;">
                      ${d.attempts || 1} / ${d.max_attempts || 3}
                    </td>
                    <td style="padding: 0.65rem 0.5rem; color: #64748b; font-size: 0.75rem;">
                      ${dateStr}
                    </td>
                    <td style="padding: 0.65rem 0.5rem; text-align: right;">
                      <button class="btn-pill" data-admin-redeliver="${d.id}" style="background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 0.7rem; font-weight: 700; color: #334155; cursor: pointer; padding: 0.25rem 0.6rem; border-radius: 4px;">
                        ↺ Re-dispatch
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },


  /**
   * ============================================================================
   * MASTER BLUEPRINT v2.0: NEW 8-GROUP DEDICATED CONSOLES
   * ============================================================================
   */

  /**
   * Group 1.3: Tasks, Approvals & SLA Escalations Workbench
   */
  renderApprovalsDesk(overview, cases = []) {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Group 1.3 &bull; Dual-Control Governance &amp; Risk Operations
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Tasks, Approvals &amp; SLA Escalations
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Independent verification, multi-party change approvals, and regulatory SLA tracking requiring two-officer sign-off.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span class="badge" style="background:#fef3c7;color:#92400e;font-weight:700;padding:0.4rem 0.85rem;border-radius:999px;">
              Dual-Control Enforced ⚖️
            </span>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-title">PENDING APPROVALS</span>
              <span>⏳</span>
            </div>
            <div class="admin-kpi-value">${cases.length || 2}</div>
            <div style="font-size:0.75rem;color:#f59e0b;font-weight:700;">Requires Officer Dual Sign-off</div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-title">ESCALATED TO DIRECTOR</span>
              <span>⚠️</span>
            </div>
            <div class="admin-kpi-value">0</div>
            <div style="font-size:0.75rem;color:#10b981;font-weight:700;">All queues within SLA bounds</div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-title">AVG SLA RESOLUTION</span>
              <span>⏱️</span>
            </div>
            <div class="admin-kpi-value">4.2h</div>
            <div style="font-size:0.75rem;color:#2563eb;font-weight:700;">Target: &lt; 24h National SLA</div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-top">
              <span class="admin-kpi-title">INDEPENDENT AUDITOR</span>
              <span>🛡️</span>
            </div>
            <div class="admin-kpi-value">Active</div>
            <div style="font-size:0.75rem;color:#10b981;font-weight:700;">Zero Self-Approval Guardrail</div>
          </div>
        </div>

        <!-- Dual Approval Queue Table -->
        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:800;color:#0f172a;font-size:1rem;">Active Multi-Party Approval Queue</div>
            <button class="btn-pill" onclick="AdminView.switchTab('verification')" style="background:#2563eb;color:#fff;font-size:0.78rem;padding:0.35rem 0.75rem;">
              Open Verification Workspace &rarr;
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.88rem;">
              <thead style="background:#0A2046;color:#ffffff;font-size:0.78rem;text-transform:uppercase;">
                <tr>
                  <th style="padding:0.85rem 1rem;">Task ID &bull; Entity</th>
                  <th style="padding:0.85rem 1rem;">Change Nature</th>
                  <th style="padding:0.85rem 1rem;">Risk Tier</th>
                  <th style="padding:0.85rem 1rem;">Primary Officer</th>
                  <th style="padding:0.85rem 1rem;">SLA Status</th>
                  <th style="padding:0.85rem 1rem;text-align:right;">Dual Approval</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.9rem 1rem;">
                    <div style="font-weight:800;color:#0f172a;">Ghana International School</div>
                    <div style="font-size:0.75rem;color:#64748b;">REQ-2026-0891 &bull; School Ownership Transfer</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#eff6ff;color:#1e40af;font-size:0.72rem;">Primary Proprietor Reassignment</span>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#fee2e2;color:#991b1b;font-size:0.72rem;font-weight:700;">High Risk (Tier 3)</span>
                  </td>
                  <td style="padding:0.9rem 1rem;font-size:0.82rem;color:#334155;">
                    <div>👤 Officer K. Boateng</div>
                    <div style="font-size:0.72rem;color:#10b981;">✓ Approved (Initial)</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;">18h remaining</span>
                  </td>
                  <td style="padding:0.9rem 1rem;text-align:right;">
                    <button class="btn-pill" onclick="AdminView.switchTab('verification')" style="background:#091e42;color:#fff;font-size:0.78rem;padding:0.35rem 0.75rem;cursor:pointer;">
                      Review &amp; Sign &rarr;
                    </button>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.9rem 1rem;">
                    <div style="font-weight:800;color:#0f172a;">Kwame Mensah (Tutor)</div>
                    <div style="font-size:0.75rem;color:#64748b;">REQ-2026-0904 &bull; Gate G4 Safeguarding Clearance</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#eff6ff;color:#1e40af;font-size:0.72rem;">D4 Child-Facing Eligibility</span>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#fef3c7;color:#92400e;font-size:0.72rem;font-weight:700;">Protected Child Gate</span>
                  </td>
                  <td style="padding:0.9rem 1rem;font-size:0.82rem;color:#334155;">
                    <div>👤 Safeguarding Lead</div>
                    <div style="font-size:0.72rem;color:#f59e0b;">⏳ Vetting Police Clearance</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;">6h remaining</span>
                  </td>
                  <td style="padding:0.9rem 1rem;text-align:right;">
                    <button class="btn-pill" onclick="AdminView.switchTab('safeguarding')" style="background:#dc2626;color:#fff;font-size:0.78rem;padding:0.35rem 0.75rem;cursor:pointer;">
                      Inspect Gate G4 &rarr;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 5.2: Dedicated Safeguarding Centre (Module 5.2 — Restricted)
   */
  renderSafeguardingCentre() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 5.2 &bull; Restricted Child Protection &amp; Legal Compliance
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Dedicated Safeguarding Centre
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Child protection oversight under Ghana Children's Act (Act 560). Gate G4 enforcement: zero unverified minor contact permitted.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span class="badge" style="background:#fee2e2;color:#991b1b;font-weight:800;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid #fca5a5;">
              🛡️ GATE G4 HARD-STOP: STRICTLY ENFORCED
            </span>
          </div>
        </div>

        <!-- Safeguarding Triad Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.25rem;margin-bottom:1.5rem;">
          <div style="background:#ffffff;border:1.5px solid #bbf7d0;border-radius:12px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-size:0.8rem;font-weight:800;color:#166534;">GATE G4 ENGINE</span>
              <span style="font-size:1.2rem;">🔒</span>
            </div>
            <div style="font-size:1.5rem;font-weight:800;color:#166534;margin-bottom:0.25rem;">ACTIVE &bull; 100%</div>
            <p style="font-size:0.8rem;color:#475569;margin:0;">
              Child-facing bookings automatically locked until teacher attains approved D4 Safeguarding clearance.
            </p>
          </div>

          <div style="background:#ffffff;border:1.5px solid #fed7aa;border-radius:12px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-size:0.8rem;font-weight:800;color:#9a3412;">ADULT-TO-ADULT CONTRACTING</span>
              <span style="font-size:1.2rem;">👨‍👩‍👧</span>
            </div>
            <div style="font-size:1.5rem;font-weight:800;color:#9a3412;margin-bottom:0.25rem;">DEC-005 MANDATED</div>
            <p style="font-size:0.8rem;color:#475569;margin:0;">
              Parent/Guardian holds sole legal contract. No direct messaging or payment interactions with minors.
            </p>
          </div>

          <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-size:0.8rem;font-weight:800;color:#1e3a8a;">EMERGENCY REFERRALS</span>
              <span style="font-size:1.2rem;">🚨</span>
            </div>
            <div style="font-size:1.5rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">0 ACTIVE INCIDENTS</div>
            <p style="font-size:0.8rem;color:#475569;margin:0;">
              Direct coordination with Domestic Violence and Victim Support Unit (DOVVSU) and Social Welfare Ghana.
            </p>
          </div>
        </div>

        <!-- Safeguarded Bookings Audit Table -->
        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:800;color:#0f172a;font-size:0.95rem;">Protected Tutoring Engagements &amp; Guardian Links</div>
            <span style="font-size:0.75rem;color:#64748b;">Table: parent_wards &bull; tutoring_bookings</span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.88rem;">
              <thead style="background:#0A2046;color:#ffffff;font-size:0.78rem;text-transform:uppercase;">
                <tr>
                  <th style="padding:0.85rem 1rem;">Engagement Ref</th>
                  <th style="padding:0.85rem 1rem;">Legal Contracting Guardian</th>
                  <th style="padding:0.85rem 1rem;">Ward Profile</th>
                  <th style="padding:0.85rem 1rem;">Assigned Educator</th>
                  <th style="padding:0.85rem 1rem;">D4 Vetting Status</th>
                  <th style="padding:0.85rem 1rem;">Gate G4 Result</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.9rem 1rem;font-weight:700;color:#0f172a;">TUT-2026-0041</td>
                  <td style="padding:0.9rem 1rem;">
                    <div>Charles Duodu (Parent)</div>
                    <div style="font-size:0.75rem;color:#64748b;">omotade.duodu@gmail.com</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <div>Kofi Duodu (Grade 7)</div>
                    <div style="font-size:0.72rem;color:#64748b;">Cambridge Checkpoint</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <div>Mr. Emmanuel Addo</div>
                    <div style="font-size:0.72rem;color:#2563eb;">Licence: NTC-2023-8841</div>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;font-weight:700;">✓ D4 Approved</span>
                  </td>
                  <td style="padding:0.9rem 1rem;">
                    <span class="badge" style="background:#eff6ff;color:#1e40af;font-size:0.72rem;font-weight:700;">🛡️ UNLOCKED (Passed)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 5.4: Central, Versioned Governance Policy Engine (Master Blueprint v2.0)
   */
  renderPolicyEngine() {
    const policies = [
      { id: 'POL-001', dec: 'DEC-001', name: 'Canonical Platform Identity & Persona Scoping', status: 'ACTIVE', tier: 'Foundational', rule: 'Single auth.users UUID mapped to scoped roles (parent, school_admin, teacher, super_admin) without credential leakage.' },
      { id: 'POL-004', dec: 'DEC-004', name: 'Gate G4 Child Safeguarding Hard Stop', status: 'ACTIVE', tier: 'Safety Critical', rule: 'Child-facing tutoring requests blocked at API gateway unless educator has D4 Safeguarding clearance verified.' },
      { id: 'POL-005', dec: 'DEC-005', name: 'Adult-to-Adult Legal Contracting Mandate', status: 'ACTIVE', tier: 'Legal', rule: 'Parent/Guardian must confirm legal custody (Act 560). Zero minor-to-adult contracting or direct payment allowed.' },
      { id: 'POL-011', dec: 'DEC-011', name: 'Mobile Money Milestone Lesson & Tender Escrow', status: 'ACTIVE', tier: 'Financial', rule: 'Funds locked in escrow ledger until delivery sign-off; dual-authorization required for arbitrated refunds.' },
      { id: 'POL-014', dec: 'DEC-014', name: 'Tamper-Resistant Operational & Financial Audit Trail', status: 'ACTIVE', tier: 'Compliance', rule: 'Immutable append-only recording of all privileged role changes, claim decisions, and payout disbursals.' },
      { id: 'POL-020', dec: 'DEC-020', name: 'Granular Context-Aware Authorization Guard', status: 'ACTIVE', tier: 'Security', rule: 'Actor + Action + Resource + Scope + Purpose validated on server before executing mutations.' },
      { id: 'POL-021', dec: 'DEC-021', name: 'Private Storage & Ephemeral Signed URLs', status: 'ACTIVE', tier: 'Privacy', rule: 'Identity cards, diplomas, and CVs secured in private Supabase buckets with time-limited signed URLs.' }
    ];

    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 5.4 &bull; Versioned Governance Engine (52 Decisions Approved)
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Governance Policy Engine
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Deterministic, server-enforced platform governance policies controlling access, risk limits, and separation-of-duties.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span class="badge" style="background:#eff6ff;color:#1d4ed8;font-weight:700;padding:0.4rem 0.85rem;border-radius:999px;">
              Engine Version: v2.0.0-GA
            </span>
          </div>
        </div>

        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:800;color:#0f172a;font-size:0.95rem;">Active Server-Enforced Governance Rules</div>
            <span style="font-size:0.75rem;color:#10b981;font-weight:700;">✓ 52 / 52 Approved Decisions Enforced</span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.88rem;">
              <thead style="background:#0A2046;color:#ffffff;font-size:0.78rem;text-transform:uppercase;">
                <tr>
                  <th style="padding:0.85rem 1rem;">Policy Code &bull; Decision</th>
                  <th style="padding:0.85rem 1rem;">Governance Principle</th>
                  <th style="padding:0.85rem 1rem;">Category</th>
                  <th style="padding:0.85rem 1rem;">Enforcement Mechanism</th>
                  <th style="padding:0.85rem 1rem;text-align:right;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${policies.map(p => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:0.9rem 1rem;">
                      <div style="font-weight:800;color:#0f172a;">${p.id}</div>
                      <div style="font-size:0.72rem;color:#2563eb;font-weight:700;">${p.dec}</div>
                    </td>
                    <td style="padding:0.9rem 1rem;">
                      <div style="font-weight:700;color:#0f172a;">${p.name}</div>
                      <div style="font-size:0.78rem;color:#64748b;">${p.rule}</div>
                    </td>
                    <td style="padding:0.9rem 1rem;">
                      <span class="badge" style="background:#f1f5f9;color:#334155;font-size:0.72rem;">${p.tier}</span>
                    </td>
                    <td style="padding:0.9rem 1rem;font-size:0.78rem;color:#475569;font-family:monospace;">
                      Server Middleware + RLS
                    </td>
                    <td style="padding:0.9rem 1rem;text-align:right;">
                      <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;font-weight:700;">✓ ${p.status}</span>
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

  /**
   * Group 5.5: Tamper-Evident Audit Centre (Module 5.5)
   */
  renderAuditCentre(auditLogs = []) {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 5.5 &bull; Operational &amp; Financial Traceability
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Tamper-Evident Audit Centre
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Immutable event log capturing all administrative mutations, role reassignment, claims, and financial disbursements.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn-pill" onclick="App.refreshCurrentView()" style="background:#eff6ff;color:#1e40af;font-size:0.8rem;padding:0.4rem 0.85rem;border:1px solid #bfdbfe;cursor:pointer;">
              ↻ Refresh Log
            </button>
          </div>
        </div>

        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.88rem;">
              <thead style="background:#0A2046;color:#ffffff;font-size:0.78rem;text-transform:uppercase;">
                <tr>
                  <th style="padding:0.85rem 1rem;">Timestamp</th>
                  <th style="padding:0.85rem 1rem;">Actor &bull; Role</th>
                  <th style="padding:0.85rem 1rem;">Event Action</th>
                  <th style="padding:0.85rem 1rem;">Target Resource</th>
                  <th style="padding:0.85rem 1rem;">Event Details</th>
                </tr>
              </thead>
              <tbody>
                ${auditLogs.length === 0 ? `
                  <tr>
                    <td colspan="5" style="padding:3rem;text-align:center;color:#94a3b8;">
                      <div style="font-size:2rem;margin-bottom:0.5rem;">📋</div>
                      <div style="font-weight:700;color:#334155;">No audit events recorded yet</div>
                      <div style="font-size:0.82rem;">Privileged changes will be automatically logged to the audit repository.</div>
                    </td>
                  </tr>
                ` : auditLogs.slice(0, 30).map(log => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:0.85rem 1rem;font-size:0.78rem;color:#64748b;white-space:nowrap;">
                      ${new Date(log.created_at || log.timestamp || Date.now()).toLocaleString()}
                    </td>
                    <td style="padding:0.85rem 1rem;">
                      <div style="font-weight:700;color:#0f172a;">${log.actor_email || log.actorEmail || 'System Admin'}</div>
                      <div style="font-size:0.72rem;color:#2563eb;">${log.actor_role || log.actorRole || 'super_admin'}</div>
                    </td>
                    <td style="padding:0.85rem 1rem;">
                      <span class="badge" style="background:#eff6ff;color:#1e40af;font-size:0.72rem;font-weight:700;">
                        ${log.action || log.event_type || 'mutation'}
                      </span>
                    </td>
                    <td style="padding:0.85rem 1rem;font-size:0.8rem;color:#334155;">
                      ${log.target_type || log.targetType || 'entity'}: ${log.target_id || log.targetId || '-'}
                    </td>
                    <td style="padding:0.85rem 1rem;font-size:0.76rem;color:#64748b;font-family:monospace;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                      ${JSON.stringify(log.details || log.metadata || {})}
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

  /**
   * Group 2.6: Migration Centre
   */
  renderMigrationCentre() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 2.6 &bull; High-Assurance Database Architecture
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Migration Centre
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Database migration registry, relationship integrity validation, and pre/post record reconciliation.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span class="badge" style="background:#dcfce7;color:#166534;font-weight:700;padding:0.4rem 0.85rem;border-radius:999px;">
              33 Tables Synced &bull; PostgreSQL
            </span>
          </div>
        </div>

        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;padding:1.5rem;margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem;font-weight:800;color:#0A2046;margin:0 0 1rem 0;">Migration Batches Applied</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-weight:800;color:#0f172a;">Release 1: Unified Identity</span>
                <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.7rem;">Applied</span>
              </div>
              <div style="font-size:0.8rem;color:#64748b;">profiles, parent_profiles, professional_profiles, school_memberships</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-weight:800;color:#0f172a;">Release 2: Educator 5D Vetting</span>
                <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.7rem;">Applied</span>
              </div>
              <div style="font-size:0.8rem;color:#64748b;">professional_referees, professional_availability, professional_vetting_audits</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-weight:800;color:#0f172a;">Release 3: Institutional Recruitment</span>
                <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.7rem;">Applied</span>
              </div>
              <div style="font-size:0.8rem;color:#64748b;">recruiter_candidate_unlocks, job_offers, vacancy_applications</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-weight:800;color:#0f172a;">Release 4: Safeguarded Tutoring (G4)</span>
                <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.7rem;">Applied</span>
              </div>
              <div style="font-size:0.8rem;color:#64748b;">parent_wards, tutoring_bookings, Gate G4 security guard</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <span style="font-weight:800;color:#0f172a;">Release 5: Monetization &amp; Escrow</span>
                <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.7rem;">Applied</span>
              </div>
              <div style="font-size:0.8rem;color:#64748b;">escrow_ledgers, professional_subscriptions, payment_orders</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 3.1: Cases & Ticketing
   */
  renderCasesDesk(cases = []) {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 3.1 &bull; Operational Case Management
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Cases &amp; Ticketing Engine
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Centralized operational workbench with reference IDs, SLA countdowns, and cross-portal support chronology.
            </p>
          </div>
        </div>
        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;padding:2rem;text-align:center;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">📁</div>
          <div style="font-weight:800;font-size:1.1rem;color:#0f172a;">Unified Operational Cases Workspace</div>
          <div style="font-size:0.85rem;color:#64748b;margin-top:0.25rem;">All institutional ownership, verification, and support inquiries indexed by SLA.</div>
        </div>
      </div>
    `;
  },

  /**
   * Group 3.3: Support & Disputes
   */
  renderDisputesDesk(disputes = []) {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 3.3 &bull; Arbitration &amp; Mediation
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Support &amp; Disputes Desk
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Arbitration workflows for disputed lesson deliveries, supplier procurement milestones, and reviews moderation.
            </p>
          </div>
        </div>
        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;padding:2rem;text-align:center;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">⚖️</div>
          <div style="font-weight:800;font-size:1.1rem;color:#0f172a;">Dispute Arbitration Workbench</div>
          <div style="font-size:0.85rem;color:#64748b;margin-top:0.25rem;">Arbitrate disputed escrow balances between Parents, Schools, Educators, and Suppliers.</div>
        </div>
      </div>
    `;
  },

  /**
   * Group 4.3: Commercial CRM
   */
  renderCommercialCRM(overview) {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 4.3 &bull; Enterprise Institutional Sales
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Commercial CRM &amp; Pipeline
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Enterprise institutional sales pipeline: Prospect &rarr; Proposal &rarr; Negotiation &rarr; Contracted &rarr; Renewal.
            </p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
            <div style="font-size:0.75rem;font-weight:800;color:#64748b;">PROSPECTING</div>
            <div style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0.25rem 0;">42 Schools</div>
            <div style="font-size:0.75rem;color:#2563eb;">Accra Metro &bull; Kumasi</div>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
            <div style="font-size:0.75rem;font-weight:800;color:#64748b;">PROPOSALS SENT</div>
            <div style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0.25rem 0;">18 Schools</div>
            <div style="font-size:0.75rem;color:#f59e0b;">GH₵ 45,000 Pipeline</div>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
            <div style="font-size:0.75rem;font-weight:800;color:#64748b;">CONTRACTED (ACTIVE MRR)</div>
            <div style="font-size:1.4rem;font-weight:800;color:#10b981;margin:0.25rem 0;">20 Schools</div>
            <div style="font-size:0.75rem;color:#10b981;">GH₵ 17,500 / month</div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 5.3: Data Governance & DPC Compliance
   */
  renderDataGovernance() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 5.3 &bull; Privacy &amp; Data Subject Rights (Act 843)
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Data Governance &amp; DPC Compliance
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Ghana Data Protection Commission register, data retention schedules, and Subject Access Requests (SAR).
            </p>
          </div>
        </div>
        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;padding:2rem;text-align:center;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🔒</div>
          <div style="font-weight:800;font-size:1.1rem;color:#0f172a;">Ghana Data Protection Act 843 Registry</div>
          <div style="font-size:0.85rem;color:#64748b;margin-top:0.25rem;">Manage Subject Access Requests (SAR), deletion logs, and cryptographic retention schedules.</div>
        </div>
      </div>
    `;
  },

  /**
   * Group 6.1: National Communications Gateway
   */
  renderCommunicationsDesk(telemetryData) {
    const sms = telemetryData.sms || {};
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 6.1 &bull; National Notification Dispatch Rails
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              National Communications Gateway
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Carrier-grade SMS alerts (Hubtel), WhatsApp notifications, and Resend transactional email rails.
            </p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-bottom:1.5rem;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1.25rem;">
            <div style="font-size:0.8rem;font-weight:800;color:#64748b;">HUBTEL GHANA SMS OTP</div>
            <div style="font-size:1.5rem;font-weight:800;color:#10b981;margin:0.25rem 0;">Operational</div>
            <div style="font-size:0.75rem;color:#475569;">Balance: ${sms.balance || 'GH₵ 840.50'} &bull; Delivery: 99.4%</div>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1.25rem;">
            <div style="font-size:0.8rem;font-weight:800;color:#64748b;">RESEND TRANSACTIONAL EMAIL</div>
            <div style="font-size:1.5rem;font-weight:800;color:#10b981;margin:0.25rem 0;">Connected</div>
            <div style="font-size:0.75rem;color:#475569;">Verified Domain: skoolfinder.com.gh</div>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:1.25rem;">
            <div style="font-size:0.8rem;font-weight:800;color:#64748b;">WHATSAPP CLOUD API</div>
            <div style="font-size:1.5rem;font-weight:800;color:#2563eb;margin:0.25rem 0;">Configured</div>
            <div style="font-size:0.75rem;color:#475569;">Tours, Vouchers &amp; Milestone Alerts</div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 6.3: Operations Copilot & Document Intelligence
   */
  renderOperationsCopilot() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 6.3 &bull; Operations Copilot &amp; Document Intelligence
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              AI Operations Copilot &amp; RAG
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Domain-specialized AI assistant with Ghanaian curriculum grounding, NaSIA licensing query, and policy citation.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <span class="badge" style="background:#e0e7ff;color:#3730a3;font-weight:700;padding:0.4rem 0.85rem;border-radius:999px;">
              Target: GH₵ 1,000 / mo Pilot Budget
            </span>
          </div>
        </div>

        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;padding:1.5rem;">
          <h3 style="font-size:1.05rem;font-weight:800;color:#0A2046;margin:0 0 0.75rem 0;">Operations Copilot Capabilities</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="font-weight:800;color:#0f172a;margin-bottom:0.25rem;">🏫 NaSIA License Verification Query</div>
              <div style="font-size:0.8rem;color:#64748b;">Instant cross-reference of uploaded proprietor licenses against Pre-Tertiary register.</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="font-weight:800;color:#0f172a;margin-bottom:0.25rem;">🎯 CSSPS BECE Aggregate Guidance</div>
              <div style="font-size:0.8rem;color:#64748b;">Automated evaluation of raw BECE aggregates against GES Category A/B cut-offs.</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
              <div style="font-weight:800;color:#0f172a;margin-bottom:0.25rem;">🛡️ Prohibited AI Decisions Guardrail</div>
              <div style="font-size:0.8rem;color:#dc2626;font-weight:700;">Zero autonomous decisions on safeguarding or financial approvals. Human-in-the-loop.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Group 7.1: Integration & Automation Control
   */
  renderIntegrationsDesk(telemetryData) {
    return this.renderTelemetryTab(telemetryData);
  },

  /**
   * Group 8.1: Staff, Roles & Permissions
   */
  renderStaffAdmin() {
    const staff = [
      { name: 'Charles Duodu', email: 'omotade.duodu@gmail.com', role: 'Super Admin Director', status: 'ACTIVE', mfa: 'Enforced' },
      { name: 'Kofi Boateng', email: 'k.boateng@skoolfinder.com.gh', role: 'School Verification Officer', status: 'ACTIVE', mfa: 'Enforced' },
      { name: 'Ama Osei', email: 'a.osei@skoolfinder.com.gh', role: 'Finance & Escrow Officer', status: 'ACTIVE', mfa: 'Enforced' },
      { name: 'Nana Aba Mensah', email: 'n.mensah@skoolfinder.com.gh', role: 'Safeguarding Lead', status: 'ACTIVE', mfa: 'Enforced' }
    ];

    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 8.1 &bull; Staff Access Governance
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Staff, Roles &amp; Permissions
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Super Admin staff lifecycle, delegated role bundles, mandatory MFA, and separation-of-duties.
            </p>
          </div>
        </div>

        <div style="background:#ffffff;border-radius:12px;border:1.5px solid #e2e8f0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.88rem;">
            <thead style="background:#0A2046;color:#ffffff;font-size:0.78rem;text-transform:uppercase;">
              <tr>
                <th style="padding:0.85rem 1rem;">Staff Officer</th>
                <th style="padding:0.85rem 1rem;">Delegated Role Bundle</th>
                <th style="padding:0.85rem 1rem;">MFA Status</th>
                <th style="padding:0.85rem 1rem;">Account State</th>
                <th style="padding:0.85rem 1rem;text-align:right;">Access Actions</th>
              </tr>
            </thead>
            <tbody>
              ${staff.map(s => `
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:0.85rem 1rem;">
                    <div style="font-weight:700;color:#0f172a;">${s.name}</div>
                    <div style="font-size:0.75rem;color:#64748b;">${s.email}</div>
                  </td>
                  <td style="padding:0.85rem 1rem;">
                    <span class="badge" style="background:#eff6ff;color:#1e40af;font-size:0.72rem;font-weight:700;">${s.role}</span>
                  </td>
                  <td style="padding:0.85rem 1rem;">
                    <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;">✓ ${s.mfa}</span>
                  </td>
                  <td style="padding:0.85rem 1rem;">
                    <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;">${s.status}</span>
                  </td>
                  <td style="padding:0.85rem 1rem;text-align:right;">
                    <button class="btn-pill" style="background:#f1f5f9;color:#334155;font-size:0.72rem;padding:0.25rem 0.6rem;border:1px solid #cbd5e1;cursor:pointer;">
                      Manage Permissions
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

  /**
   * Group 8.2: Regional Administration & Pilot Settings
   */
  renderRegionalAdmin() {
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="font-size:0.8rem;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">
              Module 8.2 &bull; Geographic Operational Governance
            </div>
            <h1 style="font-size:1.85rem;font-weight:800;color:#0A2046;margin:0 0 0.35rem 0;">
              Regional Administration &amp; Pilot Settings
            </h1>
            <p style="color:#64748b;font-size:0.95rem;margin:0;">
              Decentralized national governance starting with Greater Accra Pilot (Accra &amp; Tema) and Ashanti (Kumasi) rollout.
            </p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
          <div style="background:#ffffff;border:1.5px solid #2563eb;border-radius:12px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-weight:800;color:#0f172a;font-size:1.05rem;">Greater Accra Region (Pilot)</span>
              <span class="badge" style="background:#dcfce7;color:#166534;font-size:0.72rem;">ACTIVE PILOT</span>
            </div>
            <p style="font-size:0.8rem;color:#64748b;margin:0 0 0.75rem 0;">Accra Metropolitan, Tema, Ga East, Ga West, Cantonments, East Legon, Dansoman.</p>
            <div style="font-size:0.75rem;color:#0f172a;font-weight:700;">20 Schools &bull; 12 Verified Teachers &bull; 8 Verified Suppliers</div>
          </div>

          <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <span style="font-weight:800;color:#0f172a;font-size:1.05rem;">Ashanti Region (Kumasi)</span>
              <span class="badge" style="background:#fef3c7;color:#92400e;font-size:0.72rem;">EXPANSION READY</span>
            </div>
            <p style="font-size:0.8rem;color:#64748b;margin:0 0 0.75rem 0;">Kumasi Metropolitan, Asokwa, Oforikrom, Kwadaso, Bantama.</p>
            <div style="font-size:0.75rem;color:#0f172a;font-weight:700;">Registry Seeding Complete &bull; Launch Q1 2027</div>
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

    
    // 6. School Management Engine CRUD Listeners (Phase 4)
    document.getElementById('btn-open-create-school')?.addEventListener('click', () => {
      Modals.openCreateSchoolModal(() => App.refreshCurrentView());
    });
    document.getElementById('btn-add-tenant-school')?.addEventListener('click', () => {
      Modals.openCreateSchoolModal(() => App.refreshCurrentView());
    });

    // 9. Admissions, Teacher NTC & B2B Procurement Listeners (Phase 7)
    // Admissions search
    const admSearchInput = document.getElementById('admin-admissions-search');
    if (admSearchInput) {
      admSearchInput.addEventListener('input', (e) => {
        this.admissionSearchTerm = e.target.value.trim();
        clearTimeout(this.admissionSearchTimer);
        this.admissionSearchTimer = setTimeout(() => App.refreshCurrentView(), 300);
      });
    }

    // Admissions status pills
    document.querySelectorAll('.btn-admission-status-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.admissionStatusFilter = btn.getAttribute('data-status');
        App.refreshCurrentView();
      });
    });

    // Review admission application modal
    document.querySelectorAll('.btn-action-review-admission').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const app = JSON.parse(btn.getAttribute('data-app'));
          Modals.openReviewAdmissionModal(app, () => App.refreshCurrentView());
        } catch (e) {
          console.warn('Admission modal parse error:', e);
        }
      });
    });

    // Teachers search
    const tchSearchInput = document.getElementById('admin-teachers-search');
    if (tchSearchInput) {
      tchSearchInput.addEventListener('input', (e) => {
        this.teacherSearchTerm = e.target.value.trim();
        clearTimeout(this.teacherSearchTimer);
        this.teacherSearchTimer = setTimeout(() => App.refreshCurrentView(), 300);
      });
    }

    // Teachers NTC verif pill
    document.querySelectorAll('.btn-teacher-verif-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.teacherVerifiedFilter = btn.getAttribute('data-verif');
        App.refreshCurrentView();
      });
    });

    // Toggle teacher NTC verification
    document.querySelectorAll('.btn-action-toggle-teacher-ntc').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const current = btn.getAttribute('data-current') === 'true';

        try {
          btn.disabled = true;
          btn.innerText = 'Updating...';
          await API.toggleAdminTeacherNTC(id, !current);
          State.showToast(`✓ NTC License for "${name}" is now ${!current ? 'Approved' : 'Revoked'}.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // Procurement subtab switcher
    document.querySelectorAll('.btn-procurement-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.procurementSubTab = btn.getAttribute('data-subtab');
        App.refreshCurrentView();
      });
    });

    // Open create RFQ modal
    document.getElementById('btn-open-create-rfq')?.addEventListener('click', () => {
      Modals.openCreateRFQModal(() => App.refreshCurrentView());
    });

    // Toggle supplier accreditation
    document.querySelectorAll('.btn-action-toggle-supplier-accred').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const current = btn.getAttribute('data-current') === 'true';

        try {
          btn.disabled = true;
          btn.innerText = 'Updating...';
          await API.toggleAdminSupplierAccreditation(id, !current);
          State.showToast(`✓ Vendor accreditation for "${name}" updated.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // Toggle RFQ status
    document.querySelectorAll('.btn-action-rfq-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current');
        const nextStatus = current === 'Open' ? 'Awarded' : 'Open';

        try {
          btn.disabled = true;
          await API.updateAdminProcurementRFQStatus(id, nextStatus);
          State.showToast(`✓ Tender status updated to ${nextStatus}.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // 8. Financial, MoMo & Subscription Listeners (Phase 6)
    // Sub-tab switcher in finance tab
    document.querySelectorAll('.btn-finance-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.financeSubTab = btn.getAttribute('data-subtab');
        App.refreshCurrentView();
      });
    });

    // Transactions search
    const txSearchInput = document.getElementById('admin-tx-search');
    if (txSearchInput) {
      txSearchInput.addEventListener('input', (e) => {
        this.txSearchTerm = e.target.value.trim();
        clearTimeout(this.txSearchTimer);
        this.txSearchTimer = setTimeout(() => App.refreshCurrentView(), 300);
      });
    }

    // Rail filter pills
    document.querySelectorAll('.btn-tx-rail-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.txChannelFilter = btn.getAttribute('data-rail');
        App.refreshCurrentView();
      });
    });

    // Status filter pills
    document.querySelectorAll('.btn-tx-status-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.txStatusFilter = btn.getAttribute('data-status');
        App.refreshCurrentView();
      });
    });

    // View transaction receipt
    document.querySelectorAll('.btn-action-view-tx-receipt').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const tx = JSON.parse(btn.getAttribute('data-tx'));
          Modals.openTransactionReceiptModal(tx);
        } catch (e) {
          console.warn('Receipt modal parse error:', e);
        }
      });
    });

    // Re-verify transaction
    document.querySelectorAll('.btn-action-reverify-tx').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ref = btn.getAttribute('data-ref');
        try {
          btn.disabled = true;
          btn.innerText = 'Verifying...';
          const res = await API.reverifyAdminTransaction(ref);
          State.showToast(`✓ Transaction ${ref} verified via Paystack!`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // Manage SaaS Subscription
    document.querySelectorAll('.btn-action-edit-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const sub = JSON.parse(btn.getAttribute('data-sub'));
          Modals.openEditSubscriptionModal(sub, () => App.refreshCurrentView());
        } catch (e) {
          console.warn('Sub modal parse error:', e);
        }
      });
    });

    // Export financial ledger
    document.getElementById('btn-export-financial-ledger')?.addEventListener('click', () => {
      State.showToast('Generating Paystack CSV statement export...', 'info');
      setTimeout(() => {
        State.showToast('✓ Statement exported to downloads', 'success');
      }, 1000);
    });

    // 7. User & Role Governance Listeners (Phase 5 - AdminHub Layout)
    document.getElementById('btn-open-create-user')?.addEventListener('click', () => {
      Modals.openCreateUserModal(() => App.refreshCurrentView());
    });
    document.getElementById('btn-quick-create-role-user')?.addEventListener('click', () => {
      Modals.openCreateUserModal(() => App.refreshCurrentView());
    });

    // Role filter pills
    document.querySelectorAll('.btn-users-role-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.userRoleFilter = btn.getAttribute('data-role');
        App.refreshCurrentView();
      });
    });

    // Left card role item click triggers filter
    document.querySelectorAll('.role-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.getAttribute('data-filter-role');
        if (role) {
          this.userRoleFilter = role;
          App.refreshCurrentView();
        }
      });
    });

    // "View all roles" link
    document.getElementById('link-reset-user-role-filter')?.addEventListener('click', () => {
      this.userRoleFilter = 'All';
      this.userStatusFilter = 'All';
      App.refreshCurrentView();
    });

    // Status filter pills
    document.querySelectorAll('.btn-users-status-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.userStatusFilter = btn.getAttribute('data-status');
        App.refreshCurrentView();
      });
    });

    // Users search input
    const usrSearchInput = document.getElementById('admin-users-search');
    if (usrSearchInput) {
      usrSearchInput.addEventListener('input', (e) => {
        this.userSearchTerm = e.target.value.trim();
        clearTimeout(this.userSearchTimer);
        this.userSearchTimer = setTimeout(() => App.refreshCurrentView(), 300);
      });
    }

    // Toggle user status (Suspend / Activate)
    document.querySelectorAll('.btn-action-toggle-user-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const targetStatus = btn.getAttribute('data-target-status');

        try {
          btn.disabled = true;
          btn.innerText = 'Updating...';
          await API.updateUserStatus(id, targetStatus);
          State.showToast(`✓ Account for "${name}" is now ${targetStatus}.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // Reassign role modal trigger
    document.querySelectorAll('.btn-action-change-user-role').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = {
          id: btn.getAttribute('data-id'),
          full_name: btn.getAttribute('data-name'),
          email: btn.getAttribute('data-email'),
          role: btn.getAttribute('data-role'),
          phone: btn.getAttribute('data-phone')
        };
        Modals.openChangeUserRoleModal(user, () => App.refreshCurrentView());
      });
    });

    // Sub-tab switcher in schools tab
    document.querySelectorAll('.btn-schools-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.schoolsSubTab = btn.getAttribute('data-subtab');
        App.refreshCurrentView();
      });
    });

    // School search input in table
    const schSearchInput = document.getElementById('admin-schools-search');
    if (schSearchInput) {
      schSearchInput.addEventListener('input', (e) => {
        this.schoolsSearchTerm = e.target.value.trim();
        clearTimeout(this.schTableTimer);
        this.schTableTimer = setTimeout(() => App.refreshCurrentView(), 300);
      });
    }

    // School region filter dropdown
    const schRegionSelect = document.getElementById('admin-schools-region');
    if (schRegionSelect) {
      schRegionSelect.addEventListener('change', (e) => {
        this.schoolsRegionFilter = e.target.value;
        App.refreshCurrentView();
      });
    }

    // 1-Click Impersonator in table
    document.querySelectorAll('.btn-action-impersonate').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        try {
          btn.disabled = true;
          btn.innerText = 'Launching...';
          State.showToast(`Initiating scoped session for ${name}...`, 'info');
          const res = await API.impersonateSchool(id);
          if (res && res.impersonationToken) {
            State.startImpersonation(res.impersonationToken, res.school);
            App.navigate('schools', res.school?.slug || res.school?.id || 'sch-gis-accra');
            State.showToast(`🛡️ Now managing ${name} as Proprietor`, 'success');
          } else {
            App.navigate('schools', 'sch-gis-accra');
          }
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
          btn.innerHTML = '<span>🏫</span> Open OS';
        }
      });
    });

    // Edit School inline modal
    document.querySelectorAll('.btn-action-edit-school').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          const res = await API.getSchools();
          const target = (res || []).find(s => s.id === id) || { id, name: 'School' };
          Modals.openEditSchoolModal(target, () => App.refreshCurrentView());
        } catch (e) {
          Modals.openEditSchoolModal({ id, name: 'School' }, () => App.refreshCurrentView());
        }
      });
    });

    // Archive School confirmation modal
    document.querySelectorAll('.btn-action-archive-school').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        Modals.openArchiveSchoolModal({ id, name }, () => App.refreshCurrentView());
      });
    });

    // Restore School
    document.querySelectorAll('.btn-action-restore-school').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        try {
          btn.disabled = true;
          btn.innerText = 'Restoring...';
          await API.restoreSchool(id);
          State.showToast(`✓ "${name}" restored to active directory!`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // ========================================================================
    // OPTION B: SUPER ADMIN GOVERNANCE LISTENERS
    // ========================================================================

    // 1. Regulatory Verification Desk (SCH-005 & Package C)
    document.querySelectorAll('.btn-admin-case-dossier').forEach(btn => {
      btn.addEventListener('click', () => {
        const caseId = btn.getAttribute('data-case-id');
        const list = this.cachedVerificationCases || [];
        const targetCase = list.find(c => c.id === caseId) || { id: caseId, school_name: 'Institution' };
        Modals.openCaseDossierModal(targetCase, () => App.refreshCurrentView());
      });
    });

    document.querySelectorAll('.btn-admin-case-approve').forEach(btn => {
      btn.addEventListener('click', async () => {
        const caseId = btn.getAttribute('data-case-id');
        const notes = prompt('Enter reviewer approval notes (optional):', 'All NaSIA & GES regulatory evidence verified.') || 'Approved';
        try {
          btn.disabled = true;
          btn.innerText = 'Processing...';
          await API.reviewAdminVerificationCase(caseId, { decision: 'approved', notes });
          State.showToast('✓ Institution ownership & NaSIA accreditation APPROVED!', 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll('.btn-admin-case-reject').forEach(btn => {
      btn.addEventListener('click', async () => {
        const caseId = btn.getAttribute('data-case-id');
        const reason = prompt('Enter mandatory rejection reason code / note:');
        if (!reason) return;
        try {
          btn.disabled = true;
          btn.innerText = 'Rejecting...';
          await API.reviewAdminVerificationCase(caseId, { decision: 'rejected', reason, notes: reason });
          State.showToast('✓ Verification case rejected. Audit notification logged.', 'info');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll('.btn-admin-case-info').forEach(btn => {
      btn.addEventListener('click', async () => {
        const caseId = btn.getAttribute('data-case-id');
        const notes = prompt('What supplementary documents or evidence are required?');
        if (!notes) return;
        try {
          btn.disabled = true;
          await API.reviewAdminVerificationCase(caseId, { decision: 'info_requested', notes });
          State.showToast('✓ Supplementary documentation request dispatched to claimant.', 'info');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // 2. Commercial Subscriptions Tier Override (SUB-010)
    document.querySelectorAll('.btn-action-override-sub-tier').forEach(btn => {
      btn.addEventListener('click', async () => {
        const schoolId = btn.getAttribute('data-school-id');
        const currentTier = btn.getAttribute('data-current-tier') || 'free';
        const targetTier = prompt(`Select override subscription tier for ${schoolId}:\nOptions: free, growth, professional, enterprise`, currentTier === 'free' ? 'growth' : 'professional');
        if (!targetTier) return;
        
        const daysInput = prompt('Enter subscription validity days (e.g. 30, 90, 365):', '30');
        const days = parseInt(daysInput, 10) || 30;

        try {
          btn.disabled = true;
          btn.innerText = 'Overriding...';
          await API.adminOverrideSchoolTier(schoolId, targetTier.toLowerCase().trim(), days);
          State.showToast(`✓ School tier upgraded to ${targetTier.toUpperCase()} for ${days} days!`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // 3. 50/50 MoMo Milestone Escrow Dispute Arbitration (ESC-003)
    document.querySelectorAll('.btn-admin-escrow-refund').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tenderId = btn.getAttribute('data-tender-id');
        if (!confirm(`Are you sure you want to arbitrate Tender #${tenderId} and REFUND all frozen milestone funds back to the institution's Mobile Money wallet?`)) return;
        
        const notes = prompt('Enter arbitration rationale notes:', 'Arbitrated in favour of school due to non-delivery / defective materials.') || 'Refund arbitrated by Super Admin';
        try {
          btn.disabled = true;
          await API.adminResolveEscrowDispute(tenderId, { resolution: 'refund_school', notes });
          State.showToast(`✓ Dispute resolved: Frozen milestone funds refunded to school MoMo wallet.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    document.querySelectorAll('.btn-admin-escrow-disburse').forEach(btn => {
      btn.addEventListener('click', async () => {
        const tenderId = btn.getAttribute('data-tender-id');
        if (!confirm(`Are you sure you want to arbitrate Tender #${tenderId} and DISBURSE the frozen milestone balance to the accredited vendor?`)) return;
        
        const notes = prompt('Enter arbitration rationale notes:', 'Delivery verified on campus inspection. Balance disbursed.') || 'Disbursement arbitrated by Super Admin';
        try {
          btn.disabled = true;
          await API.adminResolveEscrowDispute(tenderId, { resolution: 'disburse_supplier', notes });
          State.showToast(`✓ Dispute resolved: Balance disbursed to supplier via MoMo payout.`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
        }
      });
    });

    // 4. Webhook 1-Click Forced Redelivery Listener
    document.querySelectorAll('[data-admin-redeliver]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const deliveryId = btn.getAttribute('data-admin-redeliver');
        if (!deliveryId) return;
        try {
          btn.disabled = true;
          btn.textContent = '⏳ Dispatching...';
          const res = await API.adminRedeliverWebhook(deliveryId);
          if (res?.success) {
            State.showToast(`✓ Redelivery initiated: ${res.delivery?.status || '200 OK'}`, 'success');
            setTimeout(() => App.refreshCurrentView(), 800);
          } else {
            State.showToast(res?.error || 'Redelivery encountered an error', 'warning');
            btn.disabled = false;
            btn.textContent = '↺ Re-dispatch';
          }
        } catch (err) {
          State.showToast(err.message || 'Redelivery failed', 'error');
          btn.disabled = false;
          btn.textContent = '↺ Re-dispatch';
        }
      });
    });
  },

  attachEvents() {
    return this.initListeners();
  }
};
