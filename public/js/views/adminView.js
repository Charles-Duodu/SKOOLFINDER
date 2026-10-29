/**
 * SkoolFinder HQ - Super Admin & Regulatory Console Portal (/admin)
 */
const AdminView = {
  activeTab: 'overview', // 'overview' | 'schools' | 'teachers' | 'suppliers' | 'subscriptions' | 'telemetry'

  async render() {
    let overview = {
      kpis: {},
      schoolsList: [],
      teachersList: [],
      suppliersList: [],
      telemetry: {}
    };

    let vettingQueue = [];

    try {
      overview = await API.getAdminOverview();
      vettingQueue = (await API.getVettingQueue()) || [];
    } catch (e) {
      console.warn("Admin overview error:", e);
    }

    const kpis = overview.kpis || {};
    const schools = overview.schoolsList || [];
    const teachers = overview.teachersList || [];
    const suppliers = overview.suppliersList || [];
    const telemetry = overview.telemetry || {};
    const rfqs = overview.rfqsList || [];
    const procurementLogs = overview.procurementLogs || [];

    return `
      <!-- Admin Portal Header Bar -->
      <section style="background: linear-gradient(135deg, #091e42 0%, #0f172a 100%); color: #fff; padding: 2.5rem 0 1.5rem; border-bottom: 3px solid #3b82f6;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #93c5fd; margin-bottom: 0.75rem;">
                <span>🛡️</span> SkoolFinder HQ • Platform Control & Regulatory Console
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 0.5rem 0; line-height: 1.2;">
                Executive Administration & NaSIA Oversight
              </h1>
              <p style="color: #94a3b8; font-size: 0.95rem; max-width: 680px; margin: 0; line-height: 1.5;">
                Master governance console for multi-tenant school onboarding, teacher NTC credential auditing, SaaS subscription billing, and gateway telemetry.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
              <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.5rem 1rem; color: #fff; display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🛡️</span>
                <div>
                  <div style="font-size: 0.72rem; color: #93c5fd; text-transform: uppercase; font-weight: 700;">Super Admin Mode</div>
                  <div style="font-weight: 700; font-size: 0.9rem;">${State.currentUser ? State.currentUser.name : 'Platform Lead'}</div>
                </div>
              </div>
              <button id="btn-admin-switch-school" class="btn-pill btn-gold">
                <span>🏫</span> Open School OS &rarr;
              </button>
            </div>
          </div>

          <!-- Top Executive Metrics -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.75rem;">
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Total GMV Volume</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #10b981;">GH₵ ${(kpis.totalGMV || 42800).toLocaleString()}</div>
              <div style="font-size: 0.72rem; color: #64748b;">Paystack MoMo Collections</div>
            </div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Schools Enrolled</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">${kpis.totalSchools || schools.length}</div>
              <div style="font-size: 0.72rem; color: #3b82f6;">${kpis.verifiedSchools || 0} NaSIA Accredited</div>
            </div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Verified Teachers</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">${kpis.totalTeachers || teachers.length}</div>
              <div style="font-size: 0.72rem; color: #10b981;">NTC Licensed Educators</div>
            </div>
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">SaaS Monthly MRR</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fbbf24;">GH₵ ${(kpis.monthlyRecurringRevenueGHS || 48500).toLocaleString()}</div>
              <div style="font-size: 0.72rem; color: #64748b;">Active School Subscriptions</div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; margin-top: 2rem; border-bottom: 2px solid rgba(255,255,255,0.15); padding-bottom: 0;">
            <button class="portal-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
              <span>📊</span> Global Analytics
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'procurement' ? 'active' : ''}" data-admin-tab="procurement">
              <span>📦</span> B2B Procurement Desk (${rfqs.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'schools' ? 'active' : ''}" data-admin-tab="schools">
              <span>🏫</span> School Tenants (${schools.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'teachers' ? 'active' : ''}" data-admin-tab="teachers">
              <span>🧑‍🏫</span> Teacher NTC Desk (${teachers.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'suppliers' ? 'active' : ''}" data-admin-tab="suppliers">
              <span>📦</span> Supplier Verification (${suppliers.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'subscriptions' ? 'active' : ''}" data-admin-tab="subscriptions">
              <span>💳</span> SaaS Subscriptions & Plans
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'telemetry' ? 'active' : ''}" data-admin-tab="telemetry">
              <span>⚙️</span> Gateway & Cloud Telemetry
            </button>
          </div>
        </div>
      </section>

      <!-- Main Admin Content Area -->
      <section style="background: var(--bg-main); min-height: 70vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          ${this.renderActiveTab(overview, schools, teachers, suppliers, telemetry, vettingQueue, rfqs, procurementLogs)}
        </div>
      </section>
    `;
  },

  renderActiveTab(overview, schools, teachers, suppliers, telemetry, vettingQueue, rfqs = [], procurementLogs = []) {
    switch (this.activeTab) {
      case 'overview':
        return this.renderOverviewTab(overview, rfqs, procurementLogs);
      case 'procurement':
        return this.renderProcurementDesk(rfqs, procurementLogs, suppliers);
      case 'schools':
        return this.renderSchoolsTab(schools, vettingQueue);
      case 'teachers':
        return this.renderTeachersTab(teachers);
      case 'suppliers':
        return this.renderSuppliersTab(suppliers);
      case 'subscriptions':
        return this.renderSubscriptionsTab();
      case 'telemetry':
        return this.renderTelemetryTab(telemetry);
      default:
        return this.renderOverviewTab(overview, rfqs, procurementLogs);
    }
  },

  renderOverviewTab(overview, rfqs = [], procurementLogs = []) {
    const kpis = overview.kpis || {};
    return `
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; align-items: flex-start;">
        <div>
          <!-- Revenue & Growth Card -->
          <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">Ghana Platform Transaction Volume</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">Gross Merchandise Volume across MoMo & Cards</p>
              </div>
              <span class="badge badge-emerald" style="font-size: 0.8rem;">Live Engine</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; background: #f8fafc; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <div>
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">School Tuition Fees:</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">GH₵ 34,200</div>
              </div>
              <div>
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Private Tutors Paid:</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: #047857;">GH₵ 5,800</div>
              </div>
              <div>
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Procurement RFQs:</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: #b45309;">GH₵ 2,800</div>
              </div>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
              💡 <strong>SaaS Monetization Split:</strong> SkoolFinder automatically deducts a <strong>1.5% processing fee</strong> on Parent MoMo settlements and retains <strong>GH₵ 950 - 2,200/term</strong> for School Management SaaS software licenses.
            </div>
          </div>

          <!-- Pending Regulatory Approvals Queue -->
          <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem; box-shadow: var(--shadow-sm);">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 1rem 0;">
              Urgent Regulatory Audits
            </h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;">
                <div>
                  <div style="font-weight: 700; color: #92400e;">🏫 Galaxy International School (Adenta Campus)</div>
                  <div style="font-size: 0.78rem; color: #b45309;">NaSIA License Renewal pending inspection confirmation</div>
                </div>
                <button class="btn-pill btn-gold btn-quick-verify-school" data-id="sch-galaxy-international-accra" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                  Approve NaSIA Seal
                </button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px;">
                <div>
                  <div style="font-weight: 700; color: #065f46;">🧑‍🏫 Mr. Emmanuel Addo (Physics Specialist)</div>
                  <div style="font-size: 0.78rem; color: #047857;">NTC License NTC/LIC/GH/819203 verified with UCC records</div>
                </div>
                <span class="badge badge-emerald">Verified Active</span>
              </div>
            </div>
          </div>

          <!-- Live Marketplace & B2B Procurement Audit Feed -->
          <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem; margin-top: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase;">
                  <span>🛡️</span> Real-Time B2B Oversight
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0 0;">
                  Live Marketplace & B2B Procurement Audit Feed
                </h3>
              </div>
              <button class="btn-pill btn-secondary btn-switch-to-procurement" style="font-size: 0.8rem; padding: 0.4rem 0.9rem;">
                Open Procurement Desk (${rfqs.length} Tenders) &rarr;
              </button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 1.25rem 0;">
              Full lifecycle tracking across all 3 stages: <strong>1. Tender Published (School)</strong> &bull; <strong>2. Supplier Bids Received</strong> &bull; <strong>3. Final Board Selection (Accepted or Rejected)</strong>.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${(procurementLogs && procurementLogs.length > 0) ? procurementLogs.slice(0, 6).map(log => {
                const isAwarded = log.stage === 'tender_awarded';
                const isDeclined = log.stage === 'bid_declined';
                const isQuote = log.stage === 'quote_submitted';
                const badgeColor = isAwarded ? '#059669' : isDeclined ? '#dc2626' : isQuote ? '#2563eb' : '#d97706';
                const bgLight = isAwarded ? '#ecfdf5' : isDeclined ? '#fef2f2' : isQuote ? '#eff6ff' : '#fffbeb';
                const borderColor = isAwarded ? '#a7f3d0' : isDeclined ? '#fecaca' : isQuote ? '#bfdbfe' : '#fde68a';
                const icon = isAwarded ? '🎉' : isDeclined ? '✕' : isQuote ? '📝' : '📢';
                const timeStr = log.timestamp ? (new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })) : 'Just now';

                return `
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0.9rem 1.1rem; background: ${bgLight}; border: 1px solid ${borderColor}; border-radius: 10px; gap: 1rem; flex-wrap: wrap;">
                    <div style="display: flex; gap: 0.85rem; align-items: flex-start; flex: 1; min-width: 260px;">
                      <div style="background: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid ${borderColor}; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        ${icon}
                      </div>
                      <div>
                        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                          <span style="font-weight: 800; color: ${badgeColor}; font-size: 0.82rem; text-transform: uppercase;">${log.stageLabel || log.stage}</span>
                          <span style="font-size: 0.75rem; color: #64748b;">• ${timeStr}</span>
                        </div>
                        <div style="font-size: 0.88rem; font-weight: 700; color: #0f172a; margin: 0.2rem 0;">
                          ${log.schoolName || 'School'} &mdash; <span style="font-weight: 500; color: #475569;">${log.rfqTitle || 'Tender'}</span>
                        </div>
                        <div style="font-size: 0.82rem; color: #334155; line-height: 1.4;">
                          ${log.summary || ''}
                        </div>
                        ${log.reason ? `
                          <div style="margin-top: 0.35rem; font-size: 0.78rem; color: #475569; font-style: italic; background: rgba(255,255,255,0.7); padding: 0.25rem 0.6rem; border-radius: 4px; display: inline-block;">
                            Note: "${log.reason}"
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    ${log.amount ? `
                      <div style="text-align: right; flex-shrink: 0;">
                        <span style="display: inline-block; background: #fff; border: 1px solid ${borderColor}; padding: 0.3rem 0.75rem; border-radius: 8px; font-weight: 800; font-size: 0.95rem; color: ${badgeColor};">
                          ${log.amount}
                        </span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('') : `
                <div style="text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.9rem;">
                  No procurement activities logged yet. New school RFQs and supplier bids will appear here automatically.
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Right Side: Ecosystem Distribution -->
        <div>
          <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.5rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin: 0 0 1rem 0;">
              5-Portal User Breakdown
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span>👨‍👩‍👧 Parents & Students</span>
                <strong>1,840 Users</strong>
              </div>
              <div style="height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                <div style="width: 75%; height: 100%; background: #3b82f6;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; margin-top: 0.5rem;">
                <span>🧑‍🏫 Certified Teachers & Tutors</span>
                <strong>${kpis.totalTeachers || 12} Educators</strong>
              </div>
              <div style="height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                <div style="width: 45%; height: 100%; background: #10b981;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; margin-top: 0.5rem;">
                <span>📦 Educational Suppliers</span>
                <strong>${kpis.totalSuppliers || 8} Merchants</strong>
              </div>
              <div style="height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                <div style="width: 30%; height: 100%; background: #f59e0b;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; margin-top: 0.5rem;">
                <span>🏫 School Management OS</span>
                <strong>${kpis.totalSchools || 10} Schools</strong>
              </div>
              <div style="height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden;">
                <div style="width: 60%; height: 100%; background: #8b5cf6;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderSchoolsTab(schools, vettingQueue = []) {
    const pendingVetting = vettingQueue.filter(s => s.status === 'pending_vetting' || !s.verified);

    return `
      ${pendingVetting.length > 0 ? `
        <!-- VETTING QUEUE: 14-DAY FREE TRIAL ACTIVATION -->
        <div style="background: #fffbeb; border: 2px solid #fde68a; border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 2rem; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase;">
                <span>🛡️</span> NaSIA & Ministry of Education Onboarding Desk
              </div>
              <h3 style="margin: 0.2rem 0 0 0; font-size: 1.25rem; font-weight: 800; color: #78350f;">
                Pending School Registrations Requiring Admin Vetting
              </h3>
            </div>
            <span class="badge badge-admissions" style="font-size: 0.8rem; padding: 0.35rem 0.8rem; background: #f59e0b; color: #fff;">
              ${pendingVetting.length} Awaiting Verification
            </span>
          </div>
          <p style="font-size: 0.85rem; color: #92400e; margin: 0 0 1.25rem 0; line-height: 1.5;">
            Institutions in this queue cannot log in until approved. Approving a school grants an official NaSIA badge, activates a <strong>14-day free SaaS trial</strong>, and automatically dispatches an SMS via Hubtel and welcome email via Resend.
          </p>

          <div style="overflow-x: auto; background: #fff; border-radius: 12px; border: 1px solid #fef08a;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem;">
              <thead>
                <tr style="background: #fefce8; border-bottom: 2px solid #fde68a; text-align: left;">
                  <th style="padding: 0.75rem 1rem; color: #78350f; font-weight: 700;">SCHOOL & ENCLAVE</th>
                  <th style="padding: 0.75rem 1rem; color: #78350f; font-weight: 700;">ACCREDITATION LICENSE</th>
                  <th style="padding: 0.75rem 1rem; color: #78350f; font-weight: 700;">CONTACT PERSON</th>
                  <th style="padding: 0.75rem 1rem; color: #78350f; font-weight: 700;">REQUESTED PLAN</th>
                  <th style="padding: 0.75rem 1rem; color: #78350f; font-weight: 700; text-align: right;">VETTING ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${pendingVetting.map(s => `
                  <tr style="border-bottom: 1px solid #fef08a;">
                    <td style="padding: 0.9rem 1rem;">
                      <div style="font-weight: 800; color: #0f172a;">${s.name}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">📍 ${s.suburb}, ${s.region}</div>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700;">
                        ${s.licenseNumber || 'GES/Pending'}
                      </span>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <div style="font-weight: 600; color: #334155;">${s.headOfSchool || 'Administrator'}</div>
                      <div style="font-size: 0.75rem; color: #64748b;">📞 ${s.phone || 'N/A'} • ✉️ ${s.email || 'N/A'}</div>
                    </td>
                    <td style="padding: 0.9rem 1rem;">
                      <span class="badge badge-gold" style="font-weight: 700;">
                        ${s.packageTier || 'SaaS Starter'}
                      </span>
                    </td>
                    <td style="padding: 0.9rem 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.4rem;">
                        <button class="btn-pill btn-emerald btn-approve-vetting" data-id="${s.id}" data-name="${s.name}" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;">
                          <span>✓</span> Approve & Launch 14-Day Trial
                        </button>
                        <button class="btn-pill btn-outline btn-reject-vetting" data-id="${s.id}" style="padding: 0.4rem 0.6rem; font-size: 0.78rem; color: #dc2626;">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;">
              School Tenants & NaSIA Accreditation Register
            </h2>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Manage participating institutions across Greater Accra and Kumasi.
            </p>
          </div>
          <button id="btn-add-tenant-school" class="btn-pill btn-primary">
            <span>➕</span> Onboard New Institution
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid var(--border-light); text-align: left;">
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">SCHOOL NAME & LOCATION</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">CURRICULUM</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">SAAS PLAN</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">NaSIA LICENSE STATUS</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">GOVERNANCE ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${schools.map(s => `
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1rem;">
                    <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${s.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">📍 ${s.suburb}, ${s.region}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <span class="badge badge-cambridge">${s.curriculum}</span>
                  </td>
                  <td style="padding: 1rem;">
                    <span class="badge ${s.plan === 'Enterprise' ? 'badge-gold' : 'badge-admissions'}">
                      ${s.plan} Plan
                    </span>
                  </td>
                  <td style="padding: 1rem;">
                    ${s.verified ? `
                      <span class="badge badge-emerald" style="font-weight: 700;">
                        🛡️ Accredited (${s.nasiaLicense})
                      </span>
                    ` : `
                      <span class="badge badge-rose" style="font-weight: 700;">
                        ⚠️ Pending Verification
                      </span>
                    `}
                  </td>
                  <td style="padding: 1rem;">
                    <button class="btn-pill btn-outline btn-toggle-school-verif" data-id="${s.id}" data-current="${s.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      ${s.verified ? 'Revoke Seal' : 'Grant NaSIA Seal'}
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

  renderTeachersTab(teachers) {
    return `
      <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;">
              Teacher & Educator NTC Credential Vetting Desk
            </h2>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Audit National Teaching Council (NTC) license numbers and degree certificates.
            </p>
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid var(--border-light); text-align: left;">
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">EDUCATOR NAME</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">SPECIALIZATION</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">NTC LICENSE</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">STATUS BADGE</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">VETTING ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${teachers.map(t => `
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1rem;">
                    <div style="font-weight: 700; color: var(--text-main);">${t.fullName}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${t.suburb}, ${t.region}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <div style="font-size: 0.82rem; color: var(--text-main);">${Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <code style="background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.78rem;">${t.ntcLicense}</code>
                  </td>
                  <td style="padding: 1rem;">
                    <span class="badge ${t.verified ? 'badge-emerald' : 'badge-gold'}">
                      ${t.verified ? '🛡️ NTC Verified' : 'Under Review'}
                    </span>
                  </td>
                  <td style="padding: 1rem;">
                    <button class="btn-pill btn-outline btn-toggle-teacher-verif" data-id="${t.id}" data-current="${t.verified}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      ${t.verified ? 'Revoke Badge' : 'Approve Gold Badge'}
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

  renderSuppliersTab(suppliers) {
    return `
      <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0 0 1.5rem 0;">
          Educational Supplier & Vendor Accreditation Register
        </h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid var(--border-light); text-align: left;">
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">VENDOR COMPANY</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">PRODUCT CATEGORY</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">LOCATION</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">ACCREDITATION</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${suppliers.map(sup => `
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1rem; font-weight: 700; color: var(--text-main);">${sup.name}</td>
                  <td style="padding: 1rem;">${sup.category}</td>
                  <td style="padding: 1rem;">📍 ${sup.region}</td>
                  <td style="padding: 1rem;">
                    <span class="badge ${sup.verified ? 'badge-emerald' : 'badge-gold'}">
                      ${sup.verified ? 'Verified Supplier' : 'Pending Review'}
                    </span>
                  </td>
                  <td style="padding: 1rem;">
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

  renderSubscriptionsTab() {
    const plans = [
      { name: "Starter Tier", price: "GH₵ 450 / term", target: "Crèches & Community Basic Schools", features: ["Up to 250 Students", "Admissions Pipeline", "Parent MoMo Fee Collection", "Basic Report Cards"] },
      { name: "Pro Tier", price: "GH₵ 950 / term", target: "Standard Basic & Preparatory Schools", features: ["Up to 600 Students", "Full SIS & Continuous Assessment", "Live Bus Fleet Tracker", "Teacher Recruitment Desk"] },
      { name: "Enterprise Tier", price: "GH₵ 2,200 / term", target: "Leading International & Boarding High Schools", features: ["Unlimited Students", "Cambridge & GES Exam Engines", "Full Sickbay Passports & Library", "Digital QR Badges & Priority Support"] }
    ];

    return `
      <div>
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem 0;">
            SkoolFinder Campus — SaaS Software Subscription Plans
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 600px; margin: 0 auto;">
            Annual and termly recurring revenue packages billed to participating private and international schools in Ghana.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${plans.map(p => `
            <div style="background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: #3b82f6; text-transform: uppercase;">${p.target}</div>
                <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0.25rem 0;">${p.name}</h3>
                <div style="font-size: 1.6rem; font-weight: 800; color: #10b981; margin-bottom: 1.25rem;">${p.price}</div>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: #4b5563; line-height: 1.8;">
                  ${p.features.map(f => `<li>✅ ${f}</li>`).join('')}
                </ul>
              </div>
              <button class="btn-pill btn-primary" style="margin-top: 1.5rem; justify-content: center;">
                Configure Tier & Quotas
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderTelemetryTab(telemetry) {
    return `
      <div style="max-width: 800px; margin: 0 auto; background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0 0 1.5rem 0;">
          Live Cloud & Gateway Telemetry
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">🔐 Ghanaian Dual Multi-Tenant Auth (Phone OTP + Credentials)</div>
              <div style="font-size: 0.78rem; color: #64748b;">Active sessions across Parents, Teachers, Schools, Suppliers, Super Admin</div>
            </div>
            <span class="badge badge-emerald">Operational (99.99%)</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">🐘 Neon Cloud PostgreSQL 16 & Relational Persistence</div>
              <div style="font-size: 0.78rem; color: #64748b;">Row-Level Security & High-Performance Connection Pooling active • Latency: 14ms</div>
            </div>
            <span class="badge badge-emerald">Healthy Cloud Engine</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">✉️ Resend Transactional Email Engine</div>
              <div style="font-size: 0.78rem; color: #64748b;">Parent fee receipts, admission letters, RFQ quote dispatches</div>
            </div>
            <span class="badge badge-emerald">99.4% Delivery</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">🇬🇭 Paystack Mobile Money & Card Gateway</div>
              <div style="font-size: 0.78rem; color: #64748b;">MTN MoMo (*170#), Telecel Cash (*110#), AT Money, Visa/Mastercard</div>
            </div>
            <span class="badge badge-emerald">Live Processing</span>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #1e293b;">📲 Hubtel Bulk SMS Alert Gateway</div>
              <div style="font-size: 0.78rem; color: #64748b;">Emergency sickbay dispatches, bus delay broadcasts, fee notices</div>
            </div>
            <span class="badge badge-emerald">10,550 Credits</span>
          </div>
        </div>
      </div>
    `;
  },

  renderProcurementDesk(rfqs = [], procurementLogs = [], suppliers = []) {
    const awardedCount = rfqs.filter(r => r.status === 'Tender Awarded').length;
    const activeContests = rfqs.filter(r => r.status !== 'Tender Awarded').length;

    return `
      <div>
        <!-- Procurement Executive Banner & Metric Cards -->
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); border-radius: var(--radius-xl); padding: 2rem; color: #fff; margin-bottom: 2rem; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(59, 130, 246, 0.25); border: 1px solid rgba(59, 130, 246, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #93c5fd; margin-bottom: 0.75rem;">
                <span>🛡️</span> Institutional Procurement Oversight Desk
              </div>
              <h2 style="font-size: 1.8rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #fff;">
                Ghana Educational B2B Procurement Master Console
              </h2>
              <p style="font-size: 0.92rem; color: #cbd5e1; max-width: 650px; margin: 0; line-height: 1.5;">
                Real-time oversight across all institutional tenders. Monitor competing bids, review awarded contracts vs. declined quotes, and ensure regulatory transparency.
              </p>
            </div>
          </div>

          <!-- Desk KPI Counters -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin-top: 1.75rem;">
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 1rem 1.25rem;">
              <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Total Tenders</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #fff;">${rfqs.length}</div>
              <div style="font-size: 0.72rem; color: #93c5fd;">Active School RFQs</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 1rem 1.25rem;">
              <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Open Contests</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #fbbf24;">${activeContests}</div>
              <div style="font-size: 0.72rem; color: #fde68a;">Accepting Bids</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 1rem 1.25rem;">
              <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Awarded Contracts</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #34d399;">${awardedCount}</div>
              <div style="font-size: 0.72rem; color: #a7f3d0;">Board Approved</div>
            </div>
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 1rem 1.25rem;">
              <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Supplier Merchants</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #fff;">${suppliers.length}</div>
              <div style="font-size: 0.72rem; color: #94a3b8;">Verified Vendors</div>
            </div>
          </div>
        </div>

        <!-- Section 1: Institutional Tenders Master Register -->
        <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.25rem 0;">
                🏫 Master Institutional Tenders Register
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                Click "Audit Quotes & Bids" on any tender to inspect all supplier proposals, lead times, warranties, or review decisions.
              </p>
            </div>
            <span class="badge badge-indigo" style="font-size: 0.82rem; padding: 0.35rem 0.8rem;">
              ${rfqs.length} Active Records
            </span>
          </div>

          <div style="overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">TENDER & ID</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">SCHOOL INSTITUTION</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">CATEGORY & QUANTITY</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">BUDGET / DEADLINE</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">BIDS RECEIVED</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700;">STATUS / WINNER</th>
                  <th style="padding: 0.9rem 1rem; color: #475569; font-weight: 700; text-align: right;">SUPER ADMIN AUDIT</th>
                </tr>
              </thead>
              <tbody>
                ${rfqs.map(r => {
                  const isAwarded = r.status === 'Tender Awarded';
                  const quotesCount = r.quotesReceived || (r.quotes ? r.quotes.length : 0);

                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 1rem;">
                        <div style="font-weight: 800; color: #0f172a;">${r.title}</div>
                        <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">Ref: ${r.id}</div>
                      </td>
                      <td style="padding: 1rem;">
                        <div style="font-weight: 700; color: #1e3a8a;">${r.schoolName || 'Partner School'}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">${r.suburb || 'Accra'}, Ghana</div>
                      </td>
                      <td style="padding: 1rem;">
                        <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 700;">${r.category || 'Supplies'}</span>
                        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.2rem;">Qty: ${r.quantity || '1 lot'}</div>
                      </td>
                      <td style="padding: 1rem;">
                        <div style="font-weight: 700; color: #0f172a;">${r.budgetRange || 'Negotiable'}</div>
                        <div style="font-size: 0.75rem; color: #64748b;">Deadline: ${r.deadline || 'Ongoing'}</div>
                      </td>
                      <td style="padding: 1rem;">
                        <span class="badge" style="background: ${quotesCount > 0 ? '#dbeafe' : '#f1f5f9'}; color: ${quotesCount > 0 ? '#1e40af' : '#64748b'}; font-weight: 700; font-size: 0.85rem;">
                          ${quotesCount} ${quotesCount === 1 ? 'Bid' : 'Bids'}
                        </span>
                      </td>
                      <td style="padding: 1rem;">
                        ${isAwarded ? `
                          <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3rem;">
                            <span>✓</span> Awarded
                          </span>
                          <div style="font-size: 0.75rem; color: #065f46; font-weight: 700; margin-top: 0.25rem;">
                            ${r.awardedSupplier || 'Selected Supplier'} (${r.awardedPrice || ''})
                          </div>
                        ` : `
                          <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800;">
                            Open for Bids
                          </span>
                        `}
                      </td>
                      <td style="padding: 1rem; text-align: right;">
                        <div style="display: flex; gap: 0.4rem; justify-content: flex-end; align-items: center;">
                          ${(isAwarded && r.awardedQuoteId) ? `
                            <button class="btn-pill btn-gold btn-admin-view-lpo" data-quote-id="${r.awardedQuoteId}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; white-space: nowrap;">
                              <span>📄</span> LPO
                            </button>
                          ` : ''}
                          <button class="btn-pill btn-outline btn-admin-audit-rfq" data-rfq-id="${r.id}" style="font-size: 0.78rem; padding: 0.35rem 0.8rem; white-space: nowrap;">
                            <span>📋</span> Audit Quotes & Bids
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

        <!-- Section 2: End-to-End Chronological Procurement Audit Trail -->
        <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.25rem 0;">
                📜 End-to-End Procurement Audit Trail (Stages 1 &rarr; 2 &rarr; 3)
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                Every event is permanently timestamped: Tender Published &bull; Quotation Submitted &bull; Tender Awarded &bull; Bid Declined.
              </p>
            </div>
            <span class="badge badge-emerald" style="font-size: 0.82rem; padding: 0.35rem 0.8rem;">
              ${procurementLogs.length} Events Recorded
            </span>
          </div>

          <div style="overflow-x: auto; border-radius: 12px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">TIMESTAMP</th>
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">STAGE & STATUS</th>
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">SCHOOL INSTITUTION</th>
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">SUPPLIER / VENDOR</th>
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">AMOUNT</th>
                  <th style="padding: 0.85rem 1rem; color: #475569; font-weight: 700;">AUDIT NARRATIVE & FEEDBACK</th>
                </tr>
              </thead>
              <tbody>
                ${(procurementLogs && procurementLogs.length > 0) ? procurementLogs.map(log => {
                  const isAwarded = log.stage === 'tender_awarded';
                  const isDeclined = log.stage === 'bid_declined';
                  const isQuote = log.stage === 'quote_submitted';
                  const badgeColor = isAwarded ? '#166534' : isDeclined ? '#991b1b' : isQuote ? '#1e40af' : '#92400e';
                  const bgLight = isAwarded ? '#dcfce7' : isDeclined ? '#fee2e2' : isQuote ? '#dbeafe' : '#fef3c7';
                  const timeFormatted = log.timestamp ? (new Date(log.timestamp).toLocaleString()) : 'N/A';

                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 0.85rem 1rem; color: #64748b; font-size: 0.8rem; white-space: nowrap;">
                        ${timeFormatted}
                      </td>
                      <td style="padding: 0.85rem 1rem;">
                        <span class="badge" style="background: ${bgLight}; color: ${badgeColor}; font-weight: 800;">
                          ${log.stageLabel || log.stage}
                        </span>
                      </td>
                      <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0f172a;">
                        ${log.schoolName || 'School'}
                      </td>
                      <td style="padding: 0.85rem 1rem; color: #334155; font-weight: 600;">
                        ${log.supplierName || 'N/A'}
                      </td>
                      <td style="padding: 0.85rem 1rem; font-weight: 800; color: ${isAwarded ? '#059669' : isDeclined ? '#dc2626' : '#0f172a'};">
                        ${log.amount || '-'}
                      </td>
                      <td style="padding: 0.85rem 1rem; color: #475569; font-size: 0.82rem; line-height: 1.4;">
                        ${log.summary || ''}
                        ${log.reason ? `<div style="font-style: italic; color: #64748b; margin-top: 0.2rem;">Board Feedback: "${log.reason}"</div>` : ''}
                      </td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">No audit trail events yet.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Admin tab switching
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-admin-tab');
        this.activeTab = tab;
        App.refreshCurrentView();
      });
    });

    // Switch to Procurement Desk shortcut button
    document.querySelectorAll('.btn-switch-to-procurement').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = 'procurement';
        App.refreshCurrentView();
      });
    });

    // Audit RFQ Quotes & Bids Modal from Admin Desk
    document.querySelectorAll('.btn-admin-audit-rfq').forEach(btn => {
      btn.addEventListener('click', async () => {
        const rfqId = btn.getAttribute('data-rfq-id');
        try {
          const rfqs = await API.getRFQs();
          const rfq = (rfqs || []).find(r => r.id === rfqId);
          if (rfq) {
            Modals.openRFQQuotesModal(rfq);
          } else {
            State.showToast('RFQ details not found', 'error');
          }
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // View LPO from Admin Master Register
    document.querySelectorAll('.btn-admin-view-lpo').forEach(btn => {
      btn.addEventListener('click', async () => {
        const quoteId = btn.getAttribute('data-quote-id');
        try {
          const res = await API.generateLPO(quoteId);
          if (res && res.lpo) {
            Modals.openLPOModal(res.lpo);
          } else {
            State.showToast('LPO not found', 'error');
          }
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Switch to school dashboard
    document.getElementById('btn-admin-switch-school')?.addEventListener('click', () => {
      App.navigate('schools', 'sch-gis-accra');
    });

    // Toggle school verification
    document.querySelectorAll('.btn-toggle-school-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'school', !current);
          State.showToast(`Updated NaSIA verification status for school!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // Toggle teacher verification
    document.querySelectorAll('.btn-toggle-teacher-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'teacher', !current);
          State.showToast(`Updated NTC License verification status!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // Toggle supplier verification
    document.querySelectorAll('.btn-toggle-supplier-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = btn.getAttribute('data-current') === 'true';
        try {
          await API.verifyEntity(id, 'supplier', !current);
          State.showToast(`Updated supplier accreditation status!`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // Quick verify school button
    document.querySelector('.btn-quick-verify-school')?.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      try {
        await API.verifyEntity(id, 'school', true);
        State.showToast(`NaSIA Accreditation Gold Seal awarded to Galaxy International!`, 'success');
        App.refreshCurrentView();
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    });

    // Onboard school
    document.getElementById('btn-add-tenant-school')?.addEventListener('click', () => {
      Modals.openClaimSchoolModal({ id: 'sch-new', name: 'New School Institution' });
    });

    // Approve School Vetting & Launch 14-Day Free SaaS Trial
    document.querySelectorAll('.btn-approve-vetting').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        if (!confirm(`Confirm NaSIA accreditation and activate 14-Day Free Trial for ${name}?\n\nThis will dispatch an SMS notification via Hubtel and a welcome email via Resend.`)) return;

        btn.disabled = true;
        btn.innerText = 'Approving...';
        try {
          const res = await API.approveSchoolVetting(id, { trialDays: 14 });
          State.showToast(`✓ ${name} approved! 14-day trial active, SMS and Email dispatched.`, 'success');
          App.refreshCurrentView();
        } catch (e) {
          btn.disabled = false;
          btn.innerText = '✓ Approve & Launch 14-Day Trial';
          State.showToast(e.message, 'error');
        }
      });
    });

    // Reject School Vetting
    document.querySelectorAll('.btn-reject-vetting').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const reason = prompt('Please enter reason for rejection (this will be sent to the school contact via SMS):');
        if (!reason) return;
        try {
          await API.rejectSchoolVetting(id, { reason });
          State.showToast('School registration rejected.', 'info');
          App.refreshCurrentView();
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });
  }
};
