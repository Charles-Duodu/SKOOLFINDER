/**
 * SkoolFinder Ghana - School Owner & Proprietor Portal (Blueprint v2.0)
 * Implements 12-Group Sidebar Shell (DASH-001, SCH-001 - SCH-010)
 */
const DashboardView = {
  activeTab: 'overview', // 'overview' | 'myschool' | 'regulatory' | 'staff' | 'admissions' | 'inquiries' | 'audit' | 'subscription' | 'operations'
  wizardStep: 1,
  wizardData: {
    name: '',
    slug: '',
    category: 'Private',
    levels: ['Primary', 'JHS'],
    curricula: ['GES (NaCCA)'],
    boarding_type: 'Day',
    gender_type: 'Mixed',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    suburb: '',
    phone: '',
    email: '',
    proprietor_name: '',
    proprietor_phone: '',
    proprietor_email: '',
    document_type: 'NaSIA School License',
    document_number: '',
    expires_at: ''
  },
  isDemoMode: false,

  /**
   * Unauthenticated / New Proprietor Landing & 4-Step Onboarding Wizard
   */
  renderProprietorLanding() {
    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          
          <!-- Hero Section -->
          <div style="background: linear-gradient(135deg, #0A2046 0%, #0f172a 100%); border-radius: 20px; padding: 3rem 2.5rem; color: #ffffff; margin-bottom: 2.5rem; box-shadow: 0 10px 30px rgba(10,32,70,0.15); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div style="max-width: 780px; position: relative; z-index: 2;">
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #fbbf24; margin-bottom: 1.25rem;">
                <span>🏫</span> School Owner & Proprietor Master Workspace &bull; Blueprint v2.0
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; color: #ffffff;">
                Power Your School Administration & Growth in Ghana
              </h1>
              <p style="font-size: 1.05rem; line-height: 1.6; color: #cbd5e1; margin-bottom: 2rem;">
                Claim your pre-populated school profile, submit verified NaSIA and GES regulatory credentials, recruit top educator talent, and manage the complete admissions lifecycle.
              </p>

              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button id="btn-start-wizard" class="btn-pill btn-gold" style="font-size: 0.95rem; padding: 0.8rem 1.6rem; font-weight: 800;">
                  <span>✨</span> Register Institution (4-Step Wizard)
                </button>
                <button id="btn-launch-demo-os" class="btn-pill btn-emerald" style="font-size: 0.95rem; padding: 0.8rem 1.6rem; font-weight: 800;">
                  <span>🚀</span> Open Interactive Demo School OS
                </button>
                <button id="btn-landing-signin" class="btn-pill btn-outline" style="font-size: 0.95rem; padding: 0.8rem 1.5rem; color: #ffffff; border-color: rgba(255,255,255,0.4);" onclick="Modals.openParentAuthModal('login')">
                  <span>🔑</span> Sign In to Your Workspace
                </button>
              </div>
            </div>
          </div>

          <!-- 4-STEP ONBOARDING WIZARD CONTAINER (SCH-002, SCH-003, SCH-004) -->
          <div id="school-onboarding-wizard-section" class="owner-card" style="margin-bottom: 2.5rem; border: 2px solid #1266C4;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 1rem;">
              <div>
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800; font-size: 0.75rem;">
                  SCH-001 &bull; SCH-003 ONBOARDING
                </span>
                <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; font-weight: 800; margin: 0.25rem 0 0 0;">
                  Institution Registration & Ownership Verification Wizard
                </h2>
              </div>
              
              <!-- Stepper Navigation Indicators -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <div class="wizard-step-pill ${this.wizardStep === 1 ? 'active' : (this.wizardStep > 1 ? 'completed' : '')}">
                  <span>1</span> Lookup / Claim
                </div>
                <div class="wizard-step-pill ${this.wizardStep === 2 ? 'active' : (this.wizardStep > 2 ? 'completed' : '')}">
                  <span>2</span> Institutional Details
                </div>
                <div class="wizard-step-pill ${this.wizardStep === 3 ? 'active' : (this.wizardStep > 3 ? 'completed' : '')}">
                  <span>3</span> Location & Contacts
                </div>
                <div class="wizard-step-pill ${this.wizardStep === 4 ? 'active' : ''}">
                  <span>4</span> Evidence & NaSIA
                </div>
              </div>
            </div>

            <!-- STEP 1: Search Canonical Directory & Claim Conflict (SCH-002) -->
            ${this.wizardStep === 1 ? `
              <div>
                <h3 style="font-size: 1.15rem; color: #0A2046; font-weight: 700; margin-bottom: 0.5rem;">
                  Step 1: Check If Your School is Already Listed in the Canonical Directory
                </h3>
                <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.25rem;">
                  SkoolFinder pre-indexes accredited campuses across Ghana. Search below to claim an existing listing without creating duplicates.
                </p>

                <div style="display: flex; gap: 0.75rem; max-width: 650px; margin-bottom: 1.5rem;">
                  <input type="text" id="wizard-school-search" class="form-input" placeholder="e.g. Ghana International School, SOS-HGIC, Morning Star..." style="font-size: 0.95rem; padding: 0.75rem 1rem;" />
                  <button id="btn-wizard-search-school" class="btn-pill btn-primary" style="padding: 0.75rem 1.5rem; white-space: nowrap;">
                    <span>🔍</span> Check Directory
                  </button>
                </div>

                <div id="wizard-search-results" style="display: none; margin-bottom: 1.5rem;"></div>

                <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <div style="font-weight: 700; color: #0A2046;">School not found in directory?</div>
                    <div style="font-size: 0.84rem; color: #64748b;">Register your brand new or unlisted institution from scratch.</div>
                  </div>
                  <button id="btn-wizard-step1-new" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.6rem 1.25rem;">
                    Register New Institution &rarr;
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- STEP 2: Institutional Setup (SCH-003) -->
            ${this.wizardStep === 2 ? `
              <div>
                <h3 style="font-size: 1.15rem; color: #0A2046; font-weight: 700; margin-bottom: 0.5rem;">
                  Step 2: Core Institutional Characteristics & Curricula
                </h3>
                <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">
                  Specify your school's operating profile, levels offered, and accredited curriculum frameworks.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                  <div>
                    <label class="form-label" style="font-weight: 700;">Official School / Operating Name *</label>
                    <input type="text" id="wizard-school-name" class="form-input" value="${this.wizardData.name || ''}" placeholder="e.g. Ridge Church School" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Institutional Category</label>
                    <select id="wizard-school-category" class="form-input">
                      <option value="Private" ${this.wizardData.category === 'Private' ? 'selected' : ''}>Private Independent</option>
                      <option value="International" ${this.wizardData.category === 'International' ? 'selected' : ''}>International Preparatory</option>
                      <option value="Mission / Religious" ${this.wizardData.category === 'Mission / Religious' ? 'selected' : ''}>Mission / Religious</option>
                      <option value="Public" ${this.wizardData.category === 'Public' ? 'selected' : ''}>Public / Assisted</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Boarding Status</label>
                    <select id="wizard-boarding" class="form-input">
                      <option value="Day">Day School Only</option>
                      <option value="Boarding">Boarding Only</option>
                      <option value="Day & Boarding">Day & Boarding Options</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Gender Policy</label>
                    <select id="wizard-gender" class="form-input">
                      <option value="Mixed">Co-Educational (Mixed)</option>
                      <option value="Boys Only">Boys Only</option>
                      <option value="Girls Only">Girls Only</option>
                    </select>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
                  <button id="btn-wizard-back-1" class="btn-pill btn-outline">&larr; Back</button>
                  <button id="btn-wizard-step2-next" class="btn-pill btn-primary">Continue to Location &rarr;</button>
                </div>
              </div>
            ` : ''}

            <!-- STEP 3: Campus Location & Proprietor Coordinates -->
            ${this.wizardStep === 3 ? `
              <div>
                <h3 style="font-size: 1.15rem; color: #0A2046; font-weight: 700; margin-bottom: 0.5rem;">
                  Step 3: Campus Location, GPS & Proprietor Identity
                </h3>
                <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">
                  Provide accurate district information and primary proprietor verification coordinates (enforcing DEC-01).
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                  <div>
                    <label class="form-label" style="font-weight: 700;">Region *</label>
                    <select id="wizard-region" class="form-input">
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Western">Western</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">District / Municipality *</label>
                    <input type="text" id="wizard-district" class="form-input" value="${this.wizardData.district || 'Accra Metropolitan'}" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Locality / Suburb *</label>
                    <input type="text" id="wizard-suburb" class="form-input" value="${this.wizardData.suburb || ''}" placeholder="e.g. Cantonments, East Legon, Ahodwo" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Proprietor Full Name *</label>
                    <input type="text" id="wizard-proprietor-name" class="form-input" value="${this.wizardData.proprietor_name || (State.currentUser?.fullName || '')}" placeholder="Full Legal Name" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Proprietor Phone (WhatsApp active) *</label>
                    <input type="tel" id="wizard-proprietor-phone" class="form-input" value="${this.wizardData.proprietor_phone || ''}" placeholder="+233 24 000 0000" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Proprietor Work Email *</label>
                    <input type="email" id="wizard-proprietor-email" class="form-input" value="${this.wizardData.proprietor_email || (State.currentUser?.email || '')}" placeholder="proprietor@school.edu.gh" required />
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
                  <button id="btn-wizard-back-2" class="btn-pill btn-outline">&larr; Back</button>
                  <button id="btn-wizard-step3-next" class="btn-pill btn-primary">Continue to Evidence &rarr;</button>
                </div>
              </div>
            ` : ''}

            <!-- STEP 4: Evidence & NaSIA Submission (SCH-004) -->
            ${this.wizardStep === 4 ? `
              <div>
                <h3 style="font-size: 1.15rem; color: #0A2046; font-weight: 700; margin-bottom: 0.5rem;">
                  Step 4: Private Regulatory Compliance Credentials
                </h3>
                <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">
                  Upload your NaSIA license, GES Certificate of Registration, or Registrar General's Department cert. Stored securely and privately.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                  <div>
                    <label class="form-label" style="font-weight: 700;">Document Classification *</label>
                    <select id="wizard-doc-type" class="form-input">
                      <option value="NaSIA School License">NaSIA School License</option>
                      <option value="GES Certificate of Registration">GES Certificate of Registration</option>
                      <option value="Registrar General Business Registration">Registrar General Business Certificate</option>
                      <option value="Fire / Environmental Sanitation Permit">EPA / Fire Safety Clearance</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Document Reference Number *</label>
                    <input type="text" id="wizard-doc-num" class="form-input" placeholder="e.g. NaSIA/REG/2026/0842" required />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Document Expiration Date</label>
                    <input type="date" id="wizard-doc-exp" class="form-input" />
                  </div>
                  <div>
                    <label class="form-label" style="font-weight: 700;">Upload Private PDF / Image *</label>
                    <input type="file" id="wizard-doc-file" class="form-input" accept=".pdf,.png,.jpg,.jpeg" />
                  </div>
                </div>

                <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #92400e;">
                  🛡️ <strong>DEC-01 Notice:</strong> Under the SkoolFinder Launch Rules, exactly one primary school workspace is assigned per proprietor account. Disputed claims are locked pending Super Admin verification.
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
                  <button id="btn-wizard-back-3" class="btn-pill btn-outline">&larr; Back</button>
                  <button id="btn-wizard-submit" class="btn-pill btn-gold" style="font-weight: 800; padding: 0.75rem 1.75rem;">
                    🚀 Submit Application for Verification
                  </button>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- 4 Pillars Section -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.75rem;">
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">📈</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
                Admissions Pipeline
              </h3>
              <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                Track applicants through 5 clear stages: Received, Exam Scheduled, Admitted, Enrolled, and Offer Accepted.
              </p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.75rem;">
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
                Accreditation Credibility
              </h3>
              <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                Earn verified NaSIA accreditation status with badge validation, elevating trust for Ghanaian and diaspora families.
              </p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.75rem;">
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">👥</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
                Role-Based Seat Quotas
              </h3>
              <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                Collaborate safely with assigned team seats for Admissions Deans, Bursars, and Administrators with strict audit trails.
              </p>
            </div>

            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.75rem;">
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">📱</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
                Direct WhatsApp Leads
              </h3>
              <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                Connect instantly with verified parents searching for high-performing institutions in Greater Accra and Kumasi.
              </p>
            </div>
          </div>

        </div>
      </section>
    `;
  },

  /**
   * Master 12-Group School Owner & Proprietor Shell (Blueprint v2.0 §9.1)
   */
  async render(schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6') {
    // If not authenticated and not explicitly in demo mode, show the onboarding wizard
    const isAuthedStaff = State.isAuthenticated() && ['school_admin', 'super_admin'].includes(State.currentUser?.role);
    if (!isAuthedStaff && !this.isDemoMode) {
      return this.renderProprietorLanding();
    }

    let workspaceData = null;
    try {
      const res = await API.getSchoolWorkspace(schoolId);
      workspaceData = res?.workspace;
    } catch (e) {
      console.warn('Workspace load notice:', e.message);
    }

    const school = workspaceData?.school || {
      name: 'Ghana International School (GIS)',
      slug: 'ghana-international-school',
      suburb: 'Cantonments',
      region: 'Greater Accra',
      active_tier: 'growth',
      authority_status: 'verified',
      accreditation_status: 'verified',
      profile_completeness_score: 85
    };

    const kpis = workspaceData?.kpis || { totalApplications: 14, totalEnquiries: 28, tourBookings: 8, profileScore: 85 };
    const seatQuotas = workspaceData?.seatQuotas || { allocated: 2, total: 3, tier: 'growth' };
    const revisions = workspaceData?.profileRevisions || { published: { name: school.name, description: '' }, draft: null };
    const staffList = workspaceData?.staff || [];
    const verificationDocs = workspaceData?.verificationDocs || [];
    const tasks = workspaceData?.tasks || [];
    const auditLogs = workspaceData?.auditLogs || [];

    return `
      <div class="owner-shell">
        <!-- 12-GROUP SIDEBAR NAVIGATION (Blueprint v2.0 §9.1) -->
        <aside class="owner-sidebar">
          <div class="owner-sidebar-header">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: #1266C4; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
              🏫
            </div>
            <div style="overflow: hidden;">
              <div style="font-weight: 800; font-size: 0.95rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: #ffffff;" title="${school.name}">
                ${school.name}
              </div>
              <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
                <span class="owner-nav-badge" style="background: rgba(213, 166, 59, 0.25); color: #fbbf24; text-transform: uppercase;">
                  ${school.active_tier || 'Free'} Tier
                </span>
                <span class="owner-nav-badge" style="background: rgba(16, 185, 129, 0.25); color: #6ee7b7;">
                  ${school.authority_status === 'verified' ? '🛡️ Verified' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>

          <nav class="owner-sidebar-nav">
            <!-- Group 1: Command & Core -->
            <div class="owner-nav-group-title">Executive Command</div>
            <button class="owner-nav-item ${this.activeTab === 'overview' ? 'active' : ''}" data-owner-tab="overview">
              <span>📊 Dashboard Overview (DASH-001)</span>
            </button>

            <!-- Group 2: Institutional Identity -->
            <div class="owner-nav-group-title">Institutional Identity</div>
            <button class="owner-nav-item ${this.activeTab === 'myschool' ? 'active' : ''}" data-owner-tab="myschool">
              <span>🏫 My School & Revisions (SCH-008)</span>
            </button>
            <button class="owner-nav-item ${this.activeTab === 'regulatory' ? 'active' : ''}" data-owner-tab="regulatory">
              <span>🛡️ Regulatory & NaSIA (SCH-004)</span>
            </button>

            <!-- Group 3: Operations & Governance -->
            <div class="owner-nav-group-title">People & Governance</div>
            <button class="owner-nav-item ${this.activeTab === 'staff' ? 'active' : ''}" data-owner-tab="staff">
              <span>👥 Staff & Seat Quotas (SCH-009)</span>
              <span class="owner-nav-badge" style="background: rgba(255,255,255,0.15); color: #fff;">${seatQuotas.allocated}/${seatQuotas.total}</span>
            </button>
            <button class="owner-nav-item ${this.activeTab === 'audit' ? 'active' : ''}" data-owner-tab="audit">
              <span>📋 Compliance Audit (SCH-010)</span>
            </button>

            <!-- Group 4: Admissions & Growth (Active) -->
            <div class="owner-nav-group-title">Admissions & Growth</div>
            <button class="owner-nav-item ${this.activeTab === 'admissions' ? 'active' : ''}" data-owner-tab="admissions">
              <span>🎓 Admissions Pipeline</span>
              <span class="owner-nav-badge" style="background: #10b981; color: #fff;">${kpis.totalApplications || 14}</span>
            </button>
            <button class="owner-nav-item ${this.activeTab === 'inquiries' ? 'active' : ''}" data-owner-tab="inquiries">
              <span>📬 Enquiries & Tours</span>
              <span class="owner-nav-badge" style="background: #3b82f6; color: #fff;">${kpis.totalEnquiries || 28}</span>
            </button>

            <!-- Group 5: Commercial Subscriptions -->
            <div class="owner-nav-group-title">Subscription & Billing</div>
            <button class="owner-nav-item ${this.activeTab === 'subscription' ? 'active' : ''}" data-owner-tab="subscription">
              <span>💳 Plan Tier & Seats</span>
              <span class="owner-nav-badge" style="background: #f59e0b; color: #000; font-weight: 800;">ACTIVE</span>
            </button>

            <!-- Group 6: Ecosystem & Operations -->
            <div class="owner-nav-group-title">Campus Operations</div>
            <button class="owner-nav-item ${this.activeTab === 'operations' ? 'active' : ''}" data-owner-tab="operations">
              <span>🚌 Fleet, Clinic & IDs</span>
            </button>

            <!-- Group 7: Phase 2B & 3 Preview Badges -->
            <div class="owner-nav-group-title">Future Expansion</div>
            <div class="owner-nav-item" style="opacity: 0.55; cursor: not-allowed;">
              <span>📦 B2B Procurement</span>
              <span class="owner-nav-badge" style="background: #334155; color: #94a3b8;">Phase 2B</span>
            </div>
            <div class="owner-nav-item" style="opacity: 0.55; cursor: not-allowed;">
              <span>🧑‍🏫 Teacher Recruiting</span>
              <span class="owner-nav-badge" style="background: #334155; color: #94a3b8;">Phase 2B</span>
            </div>
            <div class="owner-nav-item" style="opacity: 0.55; cursor: not-allowed;">
              <span>📚 Student Academics & SIS</span>
              <span class="owner-nav-badge" style="background: #334155; color: #94a3b8;">Phase 3</span>
            </div>
          </nav>
        </aside>

        <!-- MAIN WORKSPACE CONTENT CONTAINER -->
        <main class="owner-main-content">
          ${this.renderActiveTabContent(school, kpis, seatQuotas, revisions, staffList, verificationDocs, tasks, auditLogs)}
        </main>
      </div>
    `;
  },

  /**
   * Renders tab content based on activeTab
   */
  renderActiveTabContent(school, kpis, seatQuotas, revisions, staffList, verificationDocs, tasks, auditLogs) {
    switch (this.activeTab) {
      case 'overview':
        return this.renderOverviewTab(school, kpis, seatQuotas, tasks);
      case 'myschool':
        return this.renderMySchoolTab(school, revisions);
      case 'regulatory':
        return this.renderRegulatoryTab(school, verificationDocs);
      case 'staff':
        return this.renderStaffTab(school, staffList, seatQuotas);
      case 'admissions':
        return this.renderAdmissionsTab(school);
      case 'inquiries':
        return this.renderInquiriesTab(school);
      case 'audit':
        return this.renderAuditTab(school, auditLogs);
      case 'subscription':
        return this.renderSubscriptionTab(school, seatQuotas);
      case 'operations':
        return this.renderOperationsTab(school);
      default:
        return this.renderOverviewTab(school, kpis, seatQuotas, tasks);
    }
  },

  /**
   * TAB 1: DASH-001 Executive Dashboard Overview
   */
  renderOverviewTab(school, kpis, seatQuotas, tasks) {
    return `
      <div>
        <!-- Overview Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §9.1 &bull; DASH-001 Institutional Command Center
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Executive Overview
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Real-time snapshot of admissions velocity, regulatory compliance, and allocated workspace seats.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-pill btn-outline" onclick="App.navigate('school-detail', '${school.slug || 'ghana-international-school'}')" style="font-size: 0.84rem;">
              <span>🌐</span> View Live Public Listing
            </button>
            <button class="btn-pill btn-gold" id="btn-quick-invite-staff" style="font-size: 0.84rem;">
              <span>+</span> Invite Staff Member
            </button>
          </div>
        </div>

        <!-- 3 Independent Status Badges Banner (DEC-02) -->
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b;">Authority to Manage</div>
              <div style="font-weight: 800; color: #0A2046; display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
                <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.76rem;">✓ Verified Proprietor</span>
              </div>
            </div>
            <div style="border-left: 1px solid #e2e8f0; padding-left: 1.5rem;">
              <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b;">Regulatory Accreditation</div>
              <div style="font-weight: 800; color: #0A2046; display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
                <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-size: 0.76rem;">🛡️ NaSIA & GES Audited</span>
              </div>
            </div>
            <div style="border-left: 1px solid #e2e8f0; padding-left: 1.5rem;">
              <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b;">Commercial Subscription</div>
              <div style="font-weight: 800; color: #0A2046; display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
                <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.76rem;">★ ${(school.active_tier || 'Growth').toUpperCase()} Plan</span>
              </div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: #64748b;">DEC-01 Single-Proprietor Rule Enforced</span>
          </div>
        </div>

        <!-- 4 KPI Telemetry Cards (DASH-001) -->
        <div class="owner-kpi-grid">
          <div class="owner-kpi-card">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Active Candidates</div>
            <div class="owner-kpi-val">${kpis.totalApplications || 14}</div>
            <div style="font-size: 0.78rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">In Admissions Pipeline</div>
          </div>
          <div class="owner-kpi-card">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Parent Inquiries</div>
            <div class="owner-kpi-val">${kpis.totalEnquiries || 28}</div>
            <div style="font-size: 0.78rem; color: #3b82f6; font-weight: 700; margin-top: 0.35rem;">WhatsApp & Direct Inbound</div>
          </div>
          <div class="owner-kpi-card">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Campus Walkthroughs</div>
            <div class="owner-kpi-val">${kpis.tourBookings || 8}</div>
            <div style="font-size: 0.78rem; color: #8b5cf6; font-weight: 700; margin-top: 0.35rem;">Tours Confirmed</div>
          </div>
          <div class="owner-kpi-card">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Profile Health</div>
            <div class="owner-kpi-val" style="color: #10b981;">${kpis.profileScore || 85}%</div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.35rem;">Completeness Score</div>
          </div>
        </div>

        <!-- Staff Seat Quota Bar & Task Queue -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Seat Quota Meter (SCH-009) -->
          <div class="owner-card" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0;">
                👥 Team Seat Allocations (${(seatQuotas.tier || 'Growth').toUpperCase()} Tier)
              </h3>
              <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800;">
                ${seatQuotas.allocated} of ${seatQuotas.total} Seats Used
              </span>
            </div>
            <p style="font-size: 0.84rem; color: #64748b; margin-bottom: 1rem;">
              Tier seat limits strictly enforced per Blueprint §6.2. Free: 1, Growth: 3, Professional: 10, Enterprise: 25.
            </p>
            <div style="height: 10px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-bottom: 1rem;">
              <div style="width: ${Math.min(100, Math.round((seatQuotas.allocated / seatQuotas.total) * 100))}%; height: 100%; background: #1266C4; border-radius: 999px;"></div>
            </div>
            <button class="btn-pill btn-outline" style="font-size: 0.8rem; width: 100%;" onclick="DashboardView.activeTab = 'staff'; App.navigate('schools');">
              Manage Staff & Seat Permissions &rarr;
            </button>
          </div>

          <!-- Actionable Task Queue -->
          <div class="owner-card" style="margin-bottom: 0;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
              ⚡ Actionable Task Queue
            </h3>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${tasks.length === 0 ? `
                <div style="font-size: 0.85rem; color: #10b981; font-weight: 700;">
                  ✓ All administrative tasks are up to date!
                </div>
              ` : tasks.map(t => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; background: #f8fafc; border-radius: 8px; border-left: 3px solid ${t.priority === 'high' ? '#ef4444' : '#1266C4'};">
                  <div>
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0A2046;">${t.title}</div>
                    <div style="font-size: 0.74rem; color: #64748b;">${t.category}</div>
                  </div>
                  <button class="btn-pill btn-outline" style="font-size: 0.74rem; padding: 0.25rem 0.65rem;" onclick="DashboardView.activeTab = '${t.action_tab || 'myschool'}'; App.navigate('schools');">
                    Resolve
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  /**
   * TAB 2: SCH-008 Public Profile Draft / Published Workflow
   */
  renderMySchoolTab(school, revisions) {
    const published = revisions?.published || {};
    const draft = revisions?.draft || published;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §8.1 &bull; Work Package SCH-008
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Public Profile & Revision Manager
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Draft changes privately. Public directory visitors only see your approved and published profile revisions.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button id="btn-save-profile-draft" class="btn-pill btn-outline" style="font-size: 0.85rem;">
              <span>💾</span> Save Draft
            </button>
            <button id="btn-publish-profile-revision" class="btn-pill btn-emerald" style="font-size: 0.85rem; font-weight: 800;">
              <span>🚀</span> Publish to Live Directory
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Live Edit Form -->
          <div class="owner-card">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1.25rem 0;">
              ✏️ Profile Draft Editor
            </h3>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label class="form-label" style="font-weight: 700;">Official School Name</label>
                <input type="text" id="edit-school-name" class="form-input" value="${draft.name || school.name || ''}" />
              </div>

              <div>
                <label class="form-label" style="font-weight: 700;">School Overview / Description</label>
                <textarea id="edit-school-desc" class="form-input" rows="4">${draft.description || school.description || ''}</textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label class="form-label" style="font-weight: 700;">Primary Phone</label>
                  <input type="text" id="edit-school-phone" class="form-input" value="${draft.phone || school.phone || ''}" />
                </div>
                <div>
                  <label class="form-label" style="font-weight: 700;">Admissions Email</label>
                  <input type="email" id="edit-school-email" class="form-input" value="${draft.email || school.email || ''}" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label class="form-label" style="font-weight: 700;">Min Tuition (GH₵ / Term)</label>
                  <input type="number" id="edit-school-minfee" class="form-input" value="${draft.tuition_min || 15000}" />
                </div>
                <div>
                  <label class="form-label" style="font-weight: 700;">Max Tuition (GH₵ / Term)</label>
                  <input type="number" id="edit-school-maxfee" class="form-input" value="${draft.tuition_max || 35000}" />
                </div>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700;">Campus Facilities (comma separated)</label>
                <input type="text" id="edit-school-facilities" class="form-input" value="${Array.isArray(draft.facilities) ? draft.facilities.join(', ') : 'Science Laboratories, Olympic Swimming Pool, STEM Centre, ICT Suites'}" />
              </div>
            </div>
          </div>

          <!-- Published vs Draft Status Card -->
          <div class="owner-card">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
              👁️ Revision Status Comparison
            </h3>

            <div style="background: #f8fafc; border-radius: 10px; border: 1.5px solid #e2e8f0; padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 800; color: #0A2046; font-size: 0.88rem;">Published Revision (Live)</span>
                <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800;">LIVE ON DIRECTORY</span>
              </div>
              <div style="font-size: 0.82rem; color: #64748b;">
                Visible to all parent searches, comparisons, and matchmaker recommendations.
              </div>
            </div>

            <div style="background: #eff6ff; border-radius: 10px; border: 1.5px solid #bfdbfe; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 800; color: #1e40af; font-size: 0.88rem;">Working Draft Revision</span>
                <span class="badge" style="background: #dbeafe; color: #1d4ed8; font-weight: 800;">UNPUBLISHED DRAFT</span>
              </div>
              <div style="font-size: 0.82rem; color: #1e40af;">
                Saved privately. Hit <strong>Publish to Live Directory</strong> to promote changes to the public school page.
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  /**
   * TAB 3: SCH-004 Regulatory & NaSIA Evidence Submission
   */
  renderRegulatoryTab(school, docs = []) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §7.2 &bull; Work Package SCH-004
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Regulatory Accreditation & Private Evidence
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Submit statutory compliance documents (NaSIA License, GES Certificate, Registrar General Certificate). Kept private and reviewed by Super Admins.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          
          <!-- Upload Form -->
          <div class="owner-card">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1.25rem 0;">
              📤 Submit Evidence Document
            </h3>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label class="form-label" style="font-weight: 700;">Document Classification *</label>
                <select id="doc-upload-type" class="form-input">
                  <option value="NaSIA School License">NaSIA School License</option>
                  <option value="GES Certificate of Registration">GES Certificate of Registration</option>
                  <option value="Registrar General Business Registration">Registrar General Business Certificate</option>
                  <option value="Fire / Sanitation Clearance">EPA / Fire Safety Clearance</option>
                </select>
              </div>

              <div>
                <label class="form-label" style="font-weight: 700;">Document / License Number *</label>
                <input type="text" id="doc-upload-num" class="form-input" placeholder="e.g. NaSIA/REG/2026/0842" required />
              </div>

              <div>
                <label class="form-label" style="font-weight: 700;">Document Expiry Date</label>
                <input type="date" id="doc-upload-exp" class="form-input" />
              </div>

              <div>
                <label class="form-label" style="font-weight: 700;">File Upload (PDF / Image)</label>
                <input type="file" id="doc-upload-file" class="form-input" accept=".pdf,.png,.jpg,.jpeg" />
              </div>

              <button id="btn-submit-verification-doc" class="btn-pill btn-primary" style="margin-top: 0.5rem; font-weight: 700;">
                Upload & Request Verification
              </button>
            </div>
          </div>

          <!-- Regulatory Trust Notice -->
          <div class="owner-card">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
              🛡️ Regulatory Safeguards & Trust
            </h3>
            <p style="font-size: 0.86rem; color: #64748b; line-height: 1.6; margin-bottom: 1rem;">
              SkoolFinder Ghana complies with the <strong>Education Regulatory Bodies Act, 2020 (Act 1023)</strong> and operates in consultation with the National Schools Inspectorate Authority (NaSIA).
            </p>
            <ul style="font-size: 0.84rem; color: #334155; line-height: 1.6; padding-left: 1.25rem;">
              <li>Evidence documents are strictly private and never exposed to parents.</li>
              <li>Only verified Super Admins may view licenses during accreditation review.</li>
              <li>Accreditation status is refreshed annually upon license renewal.</li>
            </ul>
          </div>
        </div>

        <!-- Verified Documents Registry Table -->
        <div class="owner-card">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1.25rem 0;">
            📑 Verified Credentials Registry
          </h3>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.78rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Document Type</th>
                  <th style="padding: 0.75rem 1rem;">Reference Number</th>
                  <th style="padding: 0.75rem 1rem;">Expiration</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${docs.length === 0 ? `
                  <tr>
                    <td colspan="5" style="padding: 2rem; text-align: center; color: #94a3b8;">
                      No compliance documents submitted yet. Use the form above to upload your NaSIA license.
                    </td>
                  </tr>
                ` : docs.map(d => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">${d.document_type}</td>
                    <td style="padding: 0.85rem 1rem; font-family: monospace;">${d.document_number || 'N/A'}</td>
                    <td style="padding: 0.85rem 1rem; color: #64748b;">${d.expires_at ? d.expires_at.slice(0, 10) : 'Permanent'}</td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge" style="background: ${d.status === 'verified' ? '#dcfce7' : '#fef3c7'}; color: ${d.status === 'verified' ? '#166534' : '#92400e'}; font-weight: 800; font-size: 0.72rem;">
                        ${d.status ? d.status.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <button class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;" onclick="State.showToast('Document securely archived in private vault.', 'info')">
                        View Dossier
                      </button>
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
   * TAB 4: SCH-009 Staff Invitations, Roles & Seat Quotas
   */
  renderStaffTab(school, staff = [], seatQuotas = {}) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §7.1, §17.1 &bull; Work Package SCH-009
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Staff Directory & Seat Permissions
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Assign team members to institutional roles while enforcing tier seat quotas (${(seatQuotas.tier || 'Growth').toUpperCase()} Tier: ${seatQuotas.allocated} of ${seatQuotas.total} seats used).
            </p>
          </div>

          <button id="btn-open-invite-modal" class="btn-pill btn-gold" style="font-weight: 800; font-size: 0.85rem;">
            <span>+</span> Invite Team Member
          </button>
        </div>

        <!-- Quota Meter Card -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="font-weight: 800; color: #0A2046;">Tier Seat Capacity</div>
            <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800;">
              ${seatQuotas.allocated} / ${seatQuotas.total} Seats Occupied
            </span>
          </div>
          <div style="height: 12px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="width: ${Math.min(100, Math.round((seatQuotas.allocated / seatQuotas.total) * 100))}%; height: 100%; background: #1266C4; border-radius: 999px;"></div>
          </div>
          <div style="font-size: 0.82rem; color: #64748b;">
            Tier seat limits: <strong>Free: 1</strong> &bull; <strong>Growth: 3</strong> &bull; <strong>Professional: 10</strong> &bull; <strong>Enterprise: 25</strong>. Extra seats require upgrading your plan.
          </div>
        </div>

        <!-- Staff Table -->
        <div class="owner-card">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1.25rem 0;">
            👥 Authorized Staff Members
          </h3>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.78rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Member Name</th>
                  <th style="padding: 0.75rem 1rem;">Email Address</th>
                  <th style="padding: 0.75rem 1rem;">Assigned Role</th>
                  <th style="padding: 0.75rem 1rem;">Seat Allocated</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${staff.map(s => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">${s.name || 'Staff Member'}</td>
                    <td style="padding: 0.85rem 1rem; color: #64748b;">${s.email}</td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 700; text-transform: uppercase; font-size: 0.72rem;">
                        ${s.role ? s.role.replace(/_/g, ' ') : 'Staff'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.72rem;">1 Seat Active</span>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      ${s.role === 'primary_proprietor' ? `
                        <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">Owner (Permanent)</span>
                      ` : `
                        <button class="btn-pill btn-outline btn-revoke-staff" data-mem-id="${s.id}" style="font-size: 0.75rem; padding: 0.25rem 0.65rem; color: #dc2626; border-color: #fca5a5;">
                          Revoke Seat
                        </button>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Single-Use Invite Modal Backdrop (Hidden by Default) -->
        <div id="modal-staff-invite" style="display: none; position: fixed; inset: 0; background: rgba(10,32,70,0.6); z-index: 2000; align-items: center; justify-content: center; padding: 1.5rem;">
          <div style="background: #ffffff; border-radius: 16px; max-width: 500px; width: 100%; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #0A2046; font-weight: 800; margin: 0 0 0.5rem 0;">
              Invite Staff Member
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem;">
              Dispatches an encrypted single-use onboarding token. Allocates 1 seat against your ${(seatQuotas.tier || 'Growth').toUpperCase()} tier.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <label class="form-label" style="font-weight: 700;">Staff Member Full Name *</label>
                <input type="text" id="invite-staff-name" class="form-input" placeholder="e.g. Samuel Annan" required />
              </div>
              <div>
                <label class="form-label" style="font-weight: 700;">Staff Email Address *</label>
                <input type="email" id="invite-staff-email" class="form-input" placeholder="s.annan@school.edu.gh" required />
              </div>
              <div>
                <label class="form-label" style="font-weight: 700;">Assign Role *</label>
                <select id="invite-staff-role" class="form-input">
                  <option value="admissions_officer">Admissions Officer</option>
                  <option value="bursar">Bursar / Financial Officer</option>
                  <option value="administrator">School Administrator</option>
                  <option value="academic_director">Academic Director</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button id="btn-cancel-invite-modal" class="btn-pill btn-outline">Cancel</button>
              <button id="btn-confirm-send-invite" class="btn-pill btn-gold" style="font-weight: 800;">Send Invitation Token</button>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  /**
   * TAB 5: Admissions Pipeline (Active 5-Stage Board)
   */
  renderAdmissionsTab(school) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §10 &bull; Admissions Pipeline
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Admissions Lifecycle Board
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Manage candidate submissions through 5 stages: Received, Exam Scheduled, Admitted, Enrolled, and Offer Extended.
            </p>
          </div>
          <button class="btn-pill btn-primary" onclick="App.navigate('parents')">
            <span>👨‍👩‍👧</span> Open Parents Portal
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
          <div class="owner-kpi-card" style="border-left: 3px solid #1266C4;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 1: RECEIVED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">4</div>
            <div style="font-size: 0.75rem; color: #64748b;">Pending Review</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #f59e0b;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 2: EXAM SET</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">3</div>
            <div style="font-size: 0.75rem; color: #64748b;">Assessment Scheduled</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #10b981;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 3: ADMITTED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">5</div>
            <div style="font-size: 0.75rem; color: #64748b;">Offer Letter Issued</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #8b5cf6;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 4: ENROLLED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">2</div>
            <div style="font-size: 0.75rem; color: #64748b;">Deposit Received</div>
          </div>
        </div>

        <div class="owner-card">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
            Candidates Roster
          </h3>
          <p style="font-size: 0.85rem; color: #64748b;">
            Integrated with the Parents Portal (Phase 2A full wiring scheduled next).
          </p>
        </div>
      </div>
    `;
  },

  /**
   * TAB 6: Inquiries & Campus Tours Desk
   */
  renderInquiriesTab(school) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §10.2 &bull; Direct Communications
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Inquiries & Campus Tours Center
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Respond to inbound admissions inquiries and confirm guided campus tours for prospective families.
            </p>
          </div>
        </div>

        <div class="owner-card">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
            📬 Recent Admissions Inquiries
          </h3>
          <p style="font-size: 0.85rem; color: #64748b;">
            Connects directly to prospective parents on WhatsApp and the verified parent portal messaging stream.
          </p>
        </div>
      </div>
    `;
  },

  /**
   * TAB 7: SCH-010 Audit History & Traceability
   */
  renderAuditTab(school, logs = []) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §17.1, §24 &bull; Work Package SCH-010
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Immutable Audit & Compliance History
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Tamper-evident system log tracking profile edits, regulatory document submissions, and staff invitations.
            </p>
          </div>
        </div>

        <div class="owner-card">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.78rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Timestamp</th>
                  <th style="padding: 0.75rem 1rem;">Actor</th>
                  <th style="padding: 0.75rem 1rem;">Action</th>
                  <th style="padding: 0.75rem 1rem;">Details</th>
                </tr>
              </thead>
              <tbody>
                ${logs.length === 0 ? `
                  <tr>
                    <td colspan="4" style="padding: 2rem; text-align: center; color: #94a3b8;">
                      Audit trail initialized. All future workspace mutations will be logged immutably.
                    </td>
                  </tr>
                ` : logs.map(l => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; color: #64748b; font-size: 0.8rem;">${new Date(l.created_at).toLocaleString()}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">${l.actor_email || 'System'}</td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge" style="background: #eff6ff; color: #1e40af; font-family: monospace; font-size: 0.74rem;">
                        ${l.action}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; font-size: 0.8rem; color: #64748b;">
                      ${JSON.stringify(l.details || {})}
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
   * TAB 8: Subscription Plans & Seats
   */
  renderSubscriptionTab(school, seatQuotas = {}) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Blueprint v2.0 §6 &bull; Commercial Subscription Plans
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Subscription & Seat Capacity
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Approved commercial tiers with Ghana Cedis pricing and Mobile Money / Card billing.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
          <!-- Free Tier -->
          <div class="owner-card" style="border: ${school.active_tier === 'free' ? '2px solid #1266C4' : '1px solid #e2e8f0'};">
            <div style="font-weight: 800; color: #0A2046; font-size: 1.1rem; margin-bottom: 0.5rem;">Free Tier</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">GH₵ 0 <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ month</span></div>
            <ul style="font-size: 0.84rem; color: #64748b; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li>1 Team Seat (Proprietor)</li>
              <li>Basic Directory Listing</li>
              <li>5 Gallery Photos</li>
            </ul>
            <button class="btn-pill btn-outline" style="width: 100%; font-size: 0.82rem;" disabled>Current Baseline</button>
          </div>

          <!-- Growth Tier -->
          <div class="owner-card" style="border: ${school.active_tier === 'growth' ? '2.5px solid #10b981' : '1px solid #e2e8f0'}; position: relative;">
            ${school.active_tier === 'growth' ? '<span class="badge" style="position: absolute; top: -12px; right: 16px; background: #10b981; color: #fff; font-weight: 800;">ACTIVE PLAN</span>' : ''}
            <div style="font-weight: 800; color: #0A2046; font-size: 1.1rem; margin-bottom: 0.5rem;">Growth Plan</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">GH₵ 450 <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ month</span></div>
            <ul style="font-size: 0.84rem; color: #64748b; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li>3 Team Seats</li>
              <li>Featured Placement in Suburb</li>
              <li>20 Gallery Photos</li>
              <li>Direct WhatsApp Click Analytics</li>
            </ul>
            <button class="btn-pill ${school.active_tier === 'growth' ? 'btn-emerald' : 'btn-primary'}" style="width: 100%; font-size: 0.82rem;">${school.active_tier === 'growth' ? '✓ Active Plan' : 'Select Plan'}</button>
          </div>

          <!-- Professional Tier -->
          <div class="owner-card">
            <div style="font-weight: 800; color: #0A2046; font-size: 1.1rem; margin-bottom: 0.5rem;">Professional</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">GH₵ 850 <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ month</span></div>
            <ul style="font-size: 0.84rem; color: #64748b; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li>10 Team Seats</li>
              <li>Full Admissions Lifecycle</li>
              <li>50 Gallery Photos</li>
              <li>SMS Notification Packs</li>
            </ul>
            <button class="btn-pill btn-primary" style="width: 100%; font-size: 0.82rem;">Upgrade to Pro</button>
          </div>

          <!-- Enterprise Tier -->
          <div class="owner-card">
            <div style="font-weight: 800; color: #0A2046; font-size: 1.1rem; margin-bottom: 0.5rem;">Enterprise</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">GH₵ 1,800 <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ month</span></div>
            <ul style="font-size: 0.84rem; color: #64748b; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li>25 Team Seats</li>
              <li>Multi-Campus Operations</li>
              <li>Custom Domain Integration</li>
              <li>Dedicated Account Manager</li>
            </ul>
            <button class="btn-pill btn-gold" style="width: 100%; font-size: 0.82rem;">Contact Enterprise</button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * TAB 9: Campus Operations
   */
  renderOperationsTab(school) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Campus Operations & Logistics
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Fleet, Clinic & Digital IDs
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Manage campus logistics, student GPS bus routes, sickbay medical tracking, and QR digital ID cards.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div class="owner-card">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚌</div>
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">School Bus GPS Fleet</h3>
            <p style="font-size: 0.84rem; color: #64748b; line-height: 1.5;">Track bus routes in real-time, dispatch live parent arrival alerts, and verify driver credentials.</p>
          </div>
          <div class="owner-card">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏥</div>
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Sickbay & Health Center</h3>
            <p style="font-size: 0.84rem; color: #64748b; line-height: 1.5;">Student allergy alerts, clinical visit logs, and emergency parent SMS broadcast triggers.</p>
          </div>
          <div class="owner-card">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🪪</div>
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Digital QR Student IDs</h3>
            <p style="font-size: 0.84rem; color: #64748b; line-height: 1.5;">Issue verified cryptographic student and staff digital ID passes with camera scan validation.</p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Attach Interactive Event Listeners
   */
  attachEvents(schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6') {
    // 1. Demo Mode Launcher
    document.getElementById('btn-launch-demo-os')?.addEventListener('click', () => {
      this.isDemoMode = true;
      App.navigate('schools');
    });

    // 2. Start Wizard Button
    document.getElementById('btn-start-wizard')?.addEventListener('click', () => {
      document.getElementById('school-onboarding-wizard-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // 3. Wizard Step 1: Directory Lookup
    document.getElementById('btn-wizard-search-school')?.addEventListener('click', async () => {
      const q = document.getElementById('wizard-school-search')?.value?.trim();
      if (!q) return;
      const resContainer = document.getElementById('wizard-search-results');
      if (!resContainer) return;

      resContainer.style.display = 'block';
      resContainer.innerHTML = '<div style="padding: 1rem; color: #64748b;">Searching canonical directory...</div>';

      try {
        const res = await API.lookupSchoolClaim(q);
        if (res.schools && res.schools.length > 0) {
          resContainer.innerHTML = `
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1rem;">
              <div style="font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">Matching Schools in Directory:</div>
              ${res.schools.map(s => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 0.5rem;">
                  <div>
                    <div style="font-weight: 700; color: #0A2046;">${s.name}</div>
                    <div style="font-size: 0.78rem; color: #64748b;">${s.suburb || ''}, ${s.region || ''} &bull; ${s.claimed ? '⚠️ Claimed' : 'Unclaimed'}</div>
                  </div>
                  ${s.claimed ? `
                    <span class="badge" style="background: #fee2e2; color: #991b1b; font-size: 0.75rem;">Already Claimed</span>
                  ` : `
                    <button class="btn-pill btn-emerald btn-select-canonical" data-slug="${s.slug}" data-name="${s.name}" style="font-size: 0.75rem; padding: 0.35rem 0.85rem;">
                      Claim This Listing &rarr;
                    </button>
                  `}
                </div>
              `).join('')}
            </div>
          `;

          document.querySelectorAll('.btn-select-canonical').forEach(btn => {
            btn.onclick = () => {
              this.wizardData.name = btn.dataset.name;
              this.wizardData.slug = btn.dataset.slug;
              this.wizardStep = 2;
              App.navigate('schools');
            };
          });
        } else {
          resContainer.innerHTML = `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 1rem; font-size: 0.85rem; color: #1e40af;">
              No matching institution found in directory. Proceed to register your institution as a new listing.
            </div>
          `;
        }
      } catch (err) {
        resContainer.innerHTML = `<div style="color: #ef4444; font-size: 0.85rem;">Lookup failed: ${err.message}</div>`;
      }
    });

    // Wizard Step 1 -> 2
    document.getElementById('btn-wizard-step1-new')?.addEventListener('click', () => {
      this.wizardStep = 2;
      App.navigate('schools');
    });

    // Wizard Step 2 -> 1 (Back)
    document.getElementById('btn-wizard-back-1')?.addEventListener('click', () => {
      this.wizardStep = 1;
      App.navigate('schools');
    });

    // Wizard Step 2 -> 3 (Next)
    document.getElementById('btn-wizard-step2-next')?.addEventListener('click', () => {
      const name = document.getElementById('wizard-school-name')?.value?.trim();
      if (!name) {
        State.showToast('Please enter the official school name', 'error');
        return;
      }
      this.wizardData.name = name;
      this.wizardData.category = document.getElementById('wizard-school-category')?.value;
      this.wizardData.boarding_type = document.getElementById('wizard-boarding')?.value;
      this.wizardData.gender_type = document.getElementById('wizard-gender')?.value;
      this.wizardStep = 3;
      App.navigate('schools');
    });

    // Wizard Step 3 -> 2 (Back)
    document.getElementById('btn-wizard-back-2')?.addEventListener('click', () => {
      this.wizardStep = 2;
      App.navigate('schools');
    });

    // Wizard Step 3 -> 4 (Next)
    document.getElementById('btn-wizard-step3-next')?.addEventListener('click', () => {
      const suburb = document.getElementById('wizard-suburb')?.value?.trim();
      const pName = document.getElementById('wizard-proprietor-name')?.value?.trim();
      const pPhone = document.getElementById('wizard-proprietor-phone')?.value?.trim();
      const pEmail = document.getElementById('wizard-proprietor-email')?.value?.trim();

      if (!suburb || !pName || !pPhone || !pEmail) {
        State.showToast('Please fill out all required contact coordinates', 'error');
        return;
      }

      this.wizardData.region = document.getElementById('wizard-region')?.value;
      this.wizardData.district = document.getElementById('wizard-district')?.value;
      this.wizardData.suburb = suburb;
      this.wizardData.proprietor_name = pName;
      this.wizardData.proprietor_phone = pPhone;
      this.wizardData.proprietor_email = pEmail;
      this.wizardStep = 4;
      App.navigate('schools');
    });

    // Wizard Step 4 -> 3 (Back)
    document.getElementById('btn-wizard-back-3')?.addEventListener('click', () => {
      this.wizardStep = 3;
      App.navigate('schools');
    });

    // Wizard Step 4: Final Submission
    document.getElementById('btn-wizard-submit')?.addEventListener('click', async () => {
      const docType = document.getElementById('wizard-doc-type')?.value;
      const docNum = document.getElementById('wizard-doc-num')?.value?.trim();
      const docExp = document.getElementById('wizard-doc-exp')?.value;

      if (!docNum) {
        State.showToast('Please enter your document / license reference number', 'error');
        return;
      }

      this.wizardData.document_type = docType;
      this.wizardData.document_number = docNum;
      this.wizardData.expires_at = docExp;

      try {
        const result = await API.registerSchoolWizard(this.wizardData);
        State.showToast('Application submitted! Verification case opened with Super Admin.', 'success');
        this.isDemoMode = true;
        this.wizardStep = 1;
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Submission failed', 'error');
      }
    });

    // 4. Tab Navigation Switches
    document.querySelectorAll('[data-owner-tab]').forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.ownerTab;
        App.navigate('schools');
      };
    });

    // 5. Save Draft Profile
    document.getElementById('btn-save-profile-draft')?.addEventListener('click', async () => {
      const name = document.getElementById('edit-school-name')?.value;
      const desc = document.getElementById('edit-school-desc')?.value;
      const phone = document.getElementById('edit-school-phone')?.value;
      const email = document.getElementById('edit-school-email')?.value;
      const minFee = Number(document.getElementById('edit-school-minfee')?.value);
      const maxFee = Number(document.getElementById('edit-school-maxfee')?.value);
      const facStr = document.getElementById('edit-school-facilities')?.value;
      const facilities = facStr ? facStr.split(',').map(s => s.trim()) : [];

      try {
        await API.saveSchoolProfileDraft(schoolId, {
          name, description: desc, phone, email, tuition_min: minFee, tuition_max: maxFee, facilities
        });
        State.showToast('Profile draft revision saved privately!', 'success');
      } catch (err) {
        State.showToast(err.message || 'Failed to save draft', 'error');
      }
    });

    // 6. Publish Profile Revision
    document.getElementById('btn-publish-profile-revision')?.addEventListener('click', async () => {
      if (!confirm('Promote this draft revision to the live public directory?')) return;
      try {
        await API.publishSchoolProfile(schoolId);
        State.showToast('Profile revision published to public directory!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Publishing failed', 'error');
      }
    });

    // 7. Submit Evidence Document
    document.getElementById('btn-submit-verification-doc')?.addEventListener('click', async () => {
      const docType = document.getElementById('doc-upload-type')?.value;
      const docNum = document.getElementById('doc-upload-num')?.value?.trim();
      const docExp = document.getElementById('doc-upload-exp')?.value;

      if (!docNum) {
        State.showToast('Please enter document reference number', 'error');
        return;
      }

      try {
        await API.submitSchoolVerificationDoc(schoolId, {
          document_type: docType,
          document_number: docNum,
          expires_at: docExp || null,
          file_url: 'https://storage.supabase.co/private/evidence_docs/doc-' + Date.now() + '.pdf'
        });
        State.showToast('Document uploaded and queued for Super Admin review!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Upload failed', 'error');
      }
    });

    // 8. Open Staff Invite Modal
    const modal = document.getElementById('modal-staff-invite');
    document.getElementById('btn-open-invite-modal')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
    });
    document.getElementById('btn-quick-invite-staff')?.addEventListener('click', () => {
      this.activeTab = 'staff';
      App.navigate('schools');
      setTimeout(() => {
        const m = document.getElementById('modal-staff-invite');
        if (m) m.style.display = 'flex';
      }, 100);
    });

    document.getElementById('btn-cancel-invite-modal')?.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });

    // 9. Confirm Send Staff Invite
    document.getElementById('btn-confirm-send-invite')?.addEventListener('click', async () => {
      const name = document.getElementById('invite-staff-name')?.value?.trim();
      const email = document.getElementById('invite-staff-email')?.value?.trim();
      const role = document.getElementById('invite-staff-role')?.value;

      if (!name || !email) {
        State.showToast('Please provide both staff name and email', 'error');
        return;
      }

      try {
        await API.inviteSchoolStaff(schoolId, { name, email, role });
        State.showToast('Invitation token generated and sent!', 'success');
        if (modal) modal.style.display = 'none';
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Invitation failed', 'error');
      }
    });

    // 10. Revoke Staff Member
    document.querySelectorAll('.btn-revoke-staff').forEach(btn => {
      btn.onclick = async () => {
        const memId = btn.dataset.memId;
        if (!confirm('Revoke this staff member membership and free their allocated seat?')) return;
        try {
          await API.revokeSchoolStaff(schoolId, memId);
          State.showToast('Staff member revoked. Seat returned to quota.', 'info');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Revocation failed', 'error');
        }
      };
    });
  }
};
