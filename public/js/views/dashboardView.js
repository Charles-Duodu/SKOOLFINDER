/**
 * SkoolFinder Ghana - School Owner & Proprietor Portal (Blueprint v2.0)
 * Implements 12-Group Sidebar Shell (DASH-001, SCH-001 - SCH-010)
 */
const DashboardView = {
  activeTab: 'overview', // 'overview' | 'myschool' | 'regulatory' | 'staff' | 'admissions' | 'inquiries' | 'audit' | 'subscription' | 'operations' | 'promotions' | 'webhooks'
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
                School Owner & Proprietor Master Workspace
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; color: #ffffff;">
                Power Your School Administration & Growth in Ghana
              </h1>
              <p style="font-size: 1.05rem; line-height: 1.6; color: #cbd5e1; margin-bottom: 2rem;">
                Claim your pre-populated school profile, submit verified NaSIA and GES regulatory credentials, recruit top educator talent, and manage the complete admissions lifecycle.
              </p>

              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button id="btn-start-wizard" class="btn-pill btn-gold" style="font-size: 0.95rem; padding: 0.8rem 1.6rem; font-weight: 800;">
                  Register Institution (4-Step Wizard)
                </button>
                <button id="btn-launch-demo-os" class="btn-pill btn-emerald" style="font-size: 0.95rem; padding: 0.8rem 1.6rem; font-weight: 800;">
                  Open Interactive Demo School OS
                </button>
                <button id="btn-landing-signin" class="btn-pill btn-outline" style="font-size: 0.95rem; padding: 0.8rem 1.5rem; color: #ffffff; border-color: rgba(255,255,255,0.4);" onclick="Modals.openParentAuthModal('login')">
                  Sign In to Your Workspace
                </button>
              </div>
            </div>
          </div>

          <!-- 4-STEP ONBOARDING WIZARD CONTAINER (SCH-002, SCH-003, SCH-004) -->
          <div id="school-onboarding-wizard-section" class="owner-card" style="margin-bottom: 2.5rem; border: 2px solid #1266C4;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 1rem;">
              <div>
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800; font-size: 0.75rem;">
                  INSTITUTION REGISTRATION & ONBOARDING
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
                    Check Directory
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
                  Provide accurate district information and primary proprietor verification coordinates .
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
                  <strong>Proprietor Policy:</strong> Under the SkoolFinder Launch Rules, exactly one primary school workspace is assigned per proprietor account. Disputed claims are locked pending Super Admin verification.
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
   * Enterprise Line-Icon Library (Lucide/Heroicons SVG style)
   */
  renderNavIcon(name, size = 18) {
    const icons = {
      'chevron-down': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
      'chevron-right': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
      'dashboard': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect></svg>`,
      'landmark': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="22" x2="22" y2="22"></line><line x1="4" y1="18" x2="20" y2="18"></line><line x1="6" y1="18" x2="6" y2="9"></line><line x1="10" y1="18" x2="10" y2="9"></line><line x1="14" y1="18" x2="14" y2="9"></line><line x1="18" y1="18" x2="18" y2="9"></line><polygon points="12 2 2 7 22 7"></polygon></svg>`,
      'building': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V7l8-4 8 4v15"></path><path d="M12 3v19"></path><path d="M8 11h.01"></path><path d="M16 11h.01"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path></svg>`,
      'school': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 6 8-4 8 4"></path><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"></path><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path><path d="M18 5v17"></path><path d="M6 5v17"></path><circle cx="12" cy="9" r="2"></circle></svg>`,
      'shield-check': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
      'users': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      'user-check': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>`,
      'clipboard-list': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>`,
      'graduation-cap': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
      'user-plus': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
      'messages-square': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>`,
      'credit-card': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>`,
      'ticket': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 11v2"></path><path d="M13 17v2"></path></svg>`,
      'receipt': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 6v12"></path></svg>`,
      'trending-up': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
      'truck': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
      'package': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
      'network': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path><line x1="12" y1="12" x2="12" y2="8"></line></svg>`,
      'globe': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
      'briefcase': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
      'megaphone': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`,
      'zap': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      'book-open': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    };
    return icons[name] || icons['building'];
  },

  /**
   * Returns parent category ID for a given active tab
   */
  getCategoryForTab(tabId) {
    const map = {
      'overview': 'executive',
      'myschool': 'identity',
      'regulatory': 'identity',
      'staff': 'governance',
      'audit': 'governance',
      'admissions': 'admissions',
      'inquiries': 'admissions',
      'vouchers': 'admissions',
      'subscription': 'billing',
      'intelligence': 'intelligence',
      'operations': 'operations',
      'group': 'trust',
      'recruiting': 'marketplace',
      'procurement': 'marketplace',
      'promotions': 'expansions',
      'webhooks': 'expansions',
      'academics': 'upcoming'
    };
    return map[tabId] || 'executive';
  },

  /**
   * Retrieves expanded categories from localStorage, guaranteeing active tab is expanded
   */
  getExpandedCategories() {
    const activeCategory = this.getCategoryForTab(this.activeTab);
    let saved = [];
    try {
      const raw = localStorage.getItem('skoolfinder_owner_sidebar_expanded');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      saved = [];
    }
    if (!Array.isArray(saved) || saved.length === 0) {
      saved = ['executive', 'identity'];
    }
    if (activeCategory && !saved.includes(activeCategory)) {
      saved.push(activeCategory);
    }
    return saved;
  },

  /**
   * Navigation category tree configuration
   */
  getNavCategories(school, kpis, seatQuotas, applications, enquiriesData, subscription, vacanciesData, tendersData) {
    return [
      {
        id: 'executive',
        title: 'Executive Command',
        icon: 'dashboard',
        items: [
          {
            tab: 'overview',
            title: 'Dashboard Overview',
            subtitle: 'Command metrics & KPI snapshot',
            icon: 'dashboard'
          }
        ]
      },
      {
        id: 'identity',
        title: 'Institutional Identity',
        icon: 'landmark',
        items: [
          {
            tab: 'myschool',
            title: 'My School & Profile',
            subtitle: 'Profile draft & live directory',
            icon: 'building'
          },
          {
            tab: 'regulatory',
            title: 'Regulatory & NaSIA',
            subtitle: 'Licenses & Act 1023 proof',
            icon: 'shield-check'
          }
        ]
      },
      {
        id: 'governance',
        title: 'People & Governance',
        icon: 'users',
        items: [
          {
            tab: 'staff',
            title: 'Staff & Seat Quotas',
            subtitle: 'Team seats & permissions',
            icon: 'user-check',
            badge: `${seatQuotas?.allocated ?? 0}/${seatQuotas?.total ?? 3}`,
            badgeStyle: 'background: rgba(255,255,255,0.15); color: #fff;'
          },
          {
            tab: 'audit',
            title: 'Compliance Audit Log',
            subtitle: 'Activity & mutation history',
            icon: 'clipboard-list'
          }
        ]
      },
      {
        id: 'admissions',
        title: 'Admissions & Growth',
        icon: 'graduation-cap',
        items: [
          {
            tab: 'admissions',
            title: 'Admissions Pipeline',
            subtitle: '12-stage intake & dossiers',
            icon: 'user-plus',
            badge: `${applications?.length || kpis?.totalApplications || 14}`,
            badgeStyle: 'background: #10b981; color: #fff;'
          },
          {
            tab: 'inquiries',
            title: 'Enquiries & Tours',
            subtitle: 'Parent leads & walkthroughs',
            icon: 'messages-square',
            badge: `${enquiriesData?.stats?.total || kpis?.totalEnquiries || 28}`,
            badgeStyle: 'background: #3b82f6; color: #fff;'
          },
          {
            tab: 'vouchers',
            title: 'Admissions Vouchers',
            subtitle: 'Bursar ledger & MoMo tokens',
            icon: 'ticket',
            badge: `${this._cachedVouchersData?.allTotal || 5}`,
            badgeStyle: 'background: #f59e0b; color: #fff;'
          }
        ]
      },
      {
        id: 'billing',
        title: 'Subscription & Billing',
        icon: 'credit-card',
        items: [
          {
            tab: 'subscription',
            title: 'Plan Tier & Seats',
            subtitle: 'Paystack billing & receipts',
            icon: 'receipt',
            badge: 'ACTIVE',
            badgeStyle: 'background: #f59e0b; color: #000; font-weight: 800;'
          }
        ]
      },
      {
        id: 'intelligence',
        title: 'Predictive Intelligence',
        icon: 'trending-up',
        items: [
          {
            tab: 'intelligence',
            title: 'Predictive Yield & Cash Flow',
            subtitle: 'Yield & cash flow model',
            icon: 'trending-up',
            badge: 'AI INTEL',
            badgeStyle: 'background: #8b5cf6; color: #fff;'
          }
        ]
      },
      {
        id: 'operations',
        title: 'Campus Operations & Logistics',
        icon: 'truck',
        items: [
          {
            tab: 'operations',
            title: 'Assets, Library & Fleet',
            subtitle: 'Fixed assets, LMS & buses',
            icon: 'package',
            badge: 'ACTIVE',
            badgeStyle: 'background: #0ea5e9; color: #fff;'
          }
        ]
      },
      {
        id: 'trust',
        title: 'Multi-Campus Trust',
        icon: 'network',
        items: [
          {
            tab: 'group',
            title: 'Trust Network Controller',
            subtitle: 'Multi-campus trust branches',
            icon: 'network',
            badge: 'NETWORK',
            badgeStyle: 'background: #f59e0b; color: #000; font-weight: 800;'
          }
        ]
      },
      {
        id: 'marketplace',
        title: 'Institutional Marketplace',
        icon: 'briefcase',
        items: [
          {
            tab: 'recruiting',
            title: 'Teacher Recruiting',
            subtitle: 'Teaching jobs & NTC dossiers',
            icon: 'user-check',
            badge: `${vacanciesData?.vacancies?.length || 0} JOBS`,
            badgeStyle: 'background: #10b981; color: #fff;'
          },
          {
            tab: 'procurement',
            title: 'B2B Procurement RFQs',
            subtitle: 'Tenders & 50/50 MoMo escrow',
            icon: 'briefcase',
            badge: `${tendersData?.tenders?.length || 0} RFQS`,
            badgeStyle: 'background: #0ea5e9; color: #fff;'
          }
        ]
      },
      {
        id: 'expansions',
        title: 'Expansions & Integrations',
        icon: 'zap',
        items: [
          {
            tab: 'promotions',
            title: 'Sponsored Ads & Promotions',
            subtitle: 'Top spotlight campaigns',
            icon: 'megaphone',
            badge: 'PROMO',
            badgeStyle: 'background: #f59e0b; color: #000; font-weight: 800;'
          },
          {
            tab: 'webhooks',
            title: 'Webhooks & Automated Alerts',
            subtitle: 'ERP webhooks, SMS & alerts',
            icon: 'zap',
            badge: 'ALERTS',
            badgeStyle: 'background: #06b6d4; color: #fff;'
          }
        ]
      },
      {
        id: 'upcoming',
        title: 'Upcoming Modules',
        icon: 'book-open',
        items: [
          {
            tab: 'academics',
            title: 'Student Academics & SIS',
            subtitle: 'Academics & report cards',
            icon: 'book-open',
            badge: 'Coming Soon',
            badgeStyle: 'background: #334155; color: #94a3b8;',
            disabled: true
          }
        ]
      }
    ];
  },

  /**
   * Renders the interactive expandable enterprise navigation sidebar
   */
  renderSidebar(school, kpis, seatQuotas, applications, enquiriesData, subscription, vacanciesData, tendersData) {
    const expandedCategories = this.getExpandedCategories();
    const categories = this.getNavCategories(school, kpis, seatQuotas, applications, enquiriesData, subscription, vacanciesData, tendersData);
    const tierRaw = subscription?.tier || school?.active_tier || 'Free';
    const tierLabel = tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1) + ' Tier';
    const isVerified = (school?.authority_status === 'verified');
    const statusLabel = isVerified ? 'Verified' : 'Pending';

    return `
      <aside class="owner-sidebar" id="owner-proprietor-sidebar" aria-label="School Proprietor Navigation">
        <!-- School Identity Header Card -->
        <div class="owner-sidebar-header">
          <div class="owner-brand-icon" aria-hidden="true">
            ${this.renderNavIcon('school', 22)}
          </div>
          <div class="owner-brand-meta">
            <div class="owner-brand-name" title="${school?.name || 'School Command Center'}">
              ${school?.name || 'Ghana International School'}
            </div>
            <div class="owner-brand-badges">
              <span class="owner-tier-badge">${tierLabel}</span>
              <span class="owner-status-badge ${isVerified ? 'verified' : 'pending'}">${statusLabel}</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Navigation Tree -->
        <nav class="owner-sidebar-nav" role="navigation" aria-label="Proprietor Modules">
          ${categories.map(cat => {
            const isExpanded = expandedCategories.includes(cat.id);
            const hasActiveChild = cat.items.some(item => item.tab === this.activeTab);
            const categoryClass = [
              'owner-nav-category',
              isExpanded ? 'expanded' : '',
              hasActiveChild ? 'has-active' : ''
            ].filter(Boolean).join(' ');

            return `
              <div class="${categoryClass}" data-category-id="${cat.id}">
                <button class="owner-nav-category-toggle"
                        type="button"
                        aria-expanded="${isExpanded ? 'true' : 'false'}"
                        aria-controls="submenu-${cat.id}"
                        data-category-toggle="${cat.id}">
                  <span class="category-left">
                    <span class="category-icon" aria-hidden="true">${this.renderNavIcon(cat.icon, 18)}</span>
                    <span class="category-label">${cat.title}</span>
                  </span>
                  <span class="category-chevron" aria-hidden="true">
                    ${this.renderNavIcon('chevron-right', 14)}
                  </span>
                </button>

                <div class="owner-nav-submenu" id="submenu-${cat.id}" role="region" aria-label="${cat.title} items">
                  ${cat.items.map(item => {
                    if (item.disabled) {
                      return `
                        <div class="owner-nav-subitem" style="opacity: 0.5; cursor: not-allowed;" title="${item.subtitle || item.title}">
                          <div class="subitem-left">
                            <span class="subitem-icon" aria-hidden="true">${this.renderNavIcon(item.icon, 16)}</span>
                            <div class="subitem-text">
                              <span class="subitem-title">${item.title}</span>
                              <span class="subitem-subtitle">${item.subtitle || ''}</span>
                            </div>
                          </div>
                          ${item.badge ? `<span class="owner-nav-badge" style="${item.badgeStyle || ''}">${item.badge}</span>` : ''}
                        </div>
                      `;
                    }

                    const isActive = (this.activeTab === item.tab);
                    return `
                      <button class="owner-nav-subitem ${isActive ? 'active' : ''}"
                              type="button"
                              data-owner-tab="${item.tab}"
                              title="${item.subtitle || item.title}"
                              ${isActive ? 'aria-current="page"' : ''}>
                        <div class="subitem-left">
                          <span class="subitem-icon" aria-hidden="true">${this.renderNavIcon(item.icon, 16)}</span>
                          <div class="subitem-text">
                            <span class="subitem-title">${item.title}</span>
                            <span class="subitem-subtitle">${item.subtitle || ''}</span>
                          </div>
                        </div>
                        ${item.badge ? `<span class="owner-nav-badge" style="${item.badgeStyle || ''}">${item.badge}</span>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </nav>

        <!-- Sidebar Concept Footer Note -->
        <div class="owner-sidebar-footer">
          Interactive layout concept. Click the main categories to expand or collapse the submenu.
        </div>
      </aside>
    `;
  },

  /**
   * Master 12-Group School Owner & Proprietor Shell (Blueprint v2.0 §9.1)
   */
  async render(schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6') {
    // If not authenticated and not explicitly in demo mode, show the onboarding wizard
    const isAuthedStaff = State.isAuthenticated() && ['school_admin', 'super_admin', 'primary_proprietor', 'school_owner'].includes(State.currentUser?.role);
    if (!isAuthedStaff && !this.isDemoMode) {
      return this.renderProprietorLanding();
    }

    let workspaceData = null;
    let intakes = [];
    let applications = [];
    let enquiriesData = { enquiries: [], stats: {} };
    let tourSlots = [];
    let tourBookings = [];
    let openDays = [];
    let subscription = null;
    let invoices = [];
    let plans = [];
    let vacanciesData = { vacancies: [], quota: { planTier: 'growth', baseQuota: 2, totalAllowed: 2, currentActive: 0, remainingSlots: 2 } };
    let tendersData = { tenders: [], quota: { planTier: 'growth', includedMonthlyQuota: 0, purchasedCreditsRemaining: 0, totalAvailable: 0 } };
    let yieldData = null;
    let retentionData = null;
    let revenueData = null;
    let assetsData = { assets: [] };
    let booksData = { books: [] };
    let fleetData = { fleet: [] };
    let routesData = { routes: [] };
    let groupData = null;
    let smsLogsData = { logs: [] };
    let campaigns = [];
    let packages = [];
    let webhooks = [];
    let deliveries = [];
    let notificationPreferences = { whatsapp: true, sms: true, email: true, webhook: false };

    try {
      const [
        res, intakesRes, appsRes, enqRes, toursRes, subRes, invRes, plansRes, vacRes, tndRes,
        yieldRes, retRes, revRes, assetsRes, booksRes, fleetRes, routesRes, groupRes, smsRes,
        campaignsRes, pkgsRes, webhooksRes, deliveriesRes, notifPrefsRes, vouchersRes, voucherAnalyticsRes
      ] = await Promise.allSettled([
        API.getSchoolWorkspace(schoolId),
        API.getSchoolIntakes(schoolId),
        API.getSchoolApplications(schoolId),
        API.getSchoolEnquiries(schoolId),
        API.getSchoolTourSlots(schoolId),
        API.getSchoolTourBookings(schoolId),
        API.getSchoolOpenDays(schoolId),
        API.getSchoolSubscription(schoolId),
        API.getSchoolInvoices(schoolId),
        API.getSubscriptionPlans(),
        API.getSchoolVacancies(schoolId),
        API.getSchoolTenders(schoolId),
        API.getPredictiveYield(schoolId),
        API.getCohortRetention(schoolId),
        API.getRevenueProjections(schoolId),
        API.getCampusAssets(schoolId),
        API.getLibraryBooks(schoolId),
        API.getTransportFleet(schoolId),
        API.getTransportRoutes(schoolId),
        API.getSchoolGroupDashboard('grp-trust-gis'),
        API.getSchoolSmsLogs(schoolId),
        API.getSchoolCampaigns(schoolId),
        API.getPromotionPackages(),
        API.getSchoolWebhooks(schoolId),
        API.getWebhookDeliveries(schoolId),
        API.getSchoolNotificationPreferences(schoolId),
        API.getSchoolVouchers(schoolId),
        API.getSchoolVoucherAnalytics(schoolId)
      ]);
      if (res.status === 'fulfilled' && res.value?.workspace) workspaceData = res.value.workspace;
      if (intakesRes.status === 'fulfilled' && intakesRes.value?.intakes) intakes = intakesRes.value.intakes;
      if (appsRes.status === 'fulfilled' && appsRes.value?.applications) applications = appsRes.value.applications;
      if (enqRes.status === 'fulfilled') enquiriesData = enqRes.value;
      if (toursRes.status === 'fulfilled' && toursRes.value?.slots) tourSlots = toursRes.value.slots;
      if (tourBookingsRes?.status === 'fulfilled' && tourBookingsRes.value?.bookings) tourBookings = tourBookingsRes.value.bookings;
      if (openDaysRes?.status === 'fulfilled' && openDaysRes.value?.openDays) openDays = openDaysRes.value.openDays;
      if (subRes.status === 'fulfilled' && subRes.value?.subscription) subscription = subRes.value.subscription;
      if (invRes.status === 'fulfilled' && invRes.value?.invoices) invoices = invRes.value.invoices;
      if (plansRes.status === 'fulfilled' && plansRes.value?.plans) plans = plansRes.value.plans;
      if (vacRes.status === 'fulfilled' && vacRes.value) vacanciesData = vacRes.value;
      if (tndRes.status === 'fulfilled' && tndRes.value) tendersData = tndRes.value;
      if (yieldRes.status === 'fulfilled') yieldData = yieldRes.value;
      if (retRes.status === 'fulfilled') retentionData = retRes.value;
      if (revRes.status === 'fulfilled') revenueData = revRes.value;
      if (assetsRes.status === 'fulfilled') assetsData = assetsRes.value;
      if (booksRes.status === 'fulfilled') booksData = booksRes.value;
      if (fleetRes.status === 'fulfilled') fleetData = fleetRes.value;
      if (routesRes.status === 'fulfilled') routesData = routesRes.value;
      if (groupRes.status === 'fulfilled') groupData = groupRes.value;
      if (smsRes.status === 'fulfilled') smsLogsData = smsRes.value;
      if (campaignsRes.status === 'fulfilled' && campaignsRes.value?.campaigns) campaigns = campaignsRes.value.campaigns;
      if (pkgsRes.status === 'fulfilled' && pkgsRes.value?.packages) packages = pkgsRes.value.packages;
      if (webhooksRes.status === 'fulfilled' && webhooksRes.value?.webhooks) webhooks = webhooksRes.value.webhooks;
      if (deliveriesRes.status === 'fulfilled' && deliveriesRes.value?.deliveries) deliveries = deliveriesRes.value.deliveries;
      if (notifPrefsRes.status === 'fulfilled' && notifPrefsRes.value?.preferences) notificationPreferences = notifPrefsRes.value.preferences;
      if (vouchersRes?.status === 'fulfilled' && vouchersRes.value) this._cachedVouchersData = vouchersRes.value;
      if (voucherAnalyticsRes?.status === 'fulfilled' && voucherAnalyticsRes.value) this._cachedVoucherAnalytics = voucherAnalyticsRes.value;
    } catch (e) {
      console.warn('Workspace & Phase 2/5 load notice:', e.message);
    }

    const school = workspaceData?.school || {
      id: schoolId,
      name: 'Ghana International School (GIS)',
      slug: 'ghana-international-school',
      suburb: 'Cantonments',
      region: 'Greater Accra',
      active_tier: subscription?.tier || 'growth',
      authority_status: 'verified',
      accreditation_status: 'verified',
      profile_completeness_score: 85
    };

    const kpis = workspaceData?.kpis || { totalApplications: applications.length || 14, totalEnquiries: enquiriesData?.stats?.total || 28, tourBookings: tourSlots.length || 8, profileScore: 85 };
    const seatQuotas = workspaceData?.seatQuotas || { allocated: 2, total: subscription?.seatsIncluded || 3, tier: subscription?.tier || 'growth' };
    const revisions = workspaceData?.profileRevisions || { published: { name: school.name, description: '' }, draft: null };
    const staffList = workspaceData?.staff || [];
    const verificationDocs = workspaceData?.verificationDocs || [];
    const tasks = workspaceData?.tasks || [];
    const auditLogs = workspaceData?.auditLogs || [];

    this._cachedTourBookings = tourBookings;
    this._cachedTourSlots = tourSlots;
    this._cachedOpenDays = openDays;
    this._cachedSubscription = subscription;
    const phase2aData = { intakes, applications, enquiriesData, tourSlots, tourBookings, openDays, subscription, invoices, plans };
    const phase2bData = { vacanciesData, tendersData };
    const phase5Data = { yieldData, retentionData, revenueData, assetsData, booksData, fleetData, routesData, groupData, smsLogsData };
    const expansionsData = { campaigns, packages, webhooks, deliveries, notificationPreferences };

    return `
      <div class="owner-shell">
        <div class="owner-sidebar-backdrop" id="owner-sidebar-backdrop"></div>
        ${this.renderSidebar(school, kpis, seatQuotas, applications, enquiriesData, subscription, vacanciesData, tendersData)}

        <!-- MAIN WORKSPACE CONTENT CONTAINER -->
        <main class="owner-main-content">
          <button class="owner-mobile-drawer-btn" id="btn-toggle-owner-sidebar" type="button" aria-label="Open Navigation Menu">
            ${this.renderNavIcon('dashboard', 18)} <span>Menu</span>
          </button>
          ${this.renderActiveTabContent(school, kpis, seatQuotas, revisions, staffList, verificationDocs, tasks, auditLogs, phase2aData, phase2bData, phase5Data, expansionsData)}
        </main>
      </div>
    `;
  },

  /**
   * Renders tab content based on activeTab
   */
  renderActiveTabContent(school, kpis, seatQuotas, revisions, staffList, verificationDocs, tasks, auditLogs, phase2a = {}, phase2b = {}, phase5 = {}, expansions = {}) {
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
        return this.renderAdmissionsTab(school, phase2a.intakes, phase2a.applications, phase2a.tourSlots);
      case 'vouchers':
        return this.renderVouchersTab(school, this._cachedVouchersData, this._cachedVoucherAnalytics);
      case 'inquiries':
        return this.renderInquiriesTab(school, phase2a.enquiriesData, phase2a.tourSlots, phase2a.tourBookings, phase2a.openDays, phase2a.subscription);
      case 'recruiting':
        return this.renderRecruitingTab(school, phase2b.vacanciesData);
      case 'procurement':
        return this.renderProcurementTab(school, phase2b.tendersData);
      case 'promotions':
        return this.renderPromotionsTab(school, expansions);
      case 'webhooks':
        return this.renderWebhooksTab(school, expansions);
      case 'audit':
        return this.renderAuditTab(school, auditLogs);
      case 'subscription':
        return this.renderSubscriptionTab(school, phase2a.subscription, phase2a.invoices, phase2a.plans, seatQuotas);
      case 'intelligence':
        return this.renderIntelligenceTab(school, phase5.yieldData, phase5.retentionData, phase5.revenueData);
      case 'operations':
        return this.renderOperationsTab(school, phase5.assetsData, phase5.booksData, phase5.fleetData, phase5.routesData);
      case 'group':
        return this.renderGroupTab(school, phase5.groupData);
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
              Institutional Command Center
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
              View Live Public Listing
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
                <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-size: 0.76rem;">NaSIA & GES Audited</span>
              </div>
            </div>
            <div style="border-left: 1px solid #e2e8f0; padding-left: 1.5rem;">
              <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b;">Commercial Subscription</div>
              <div style="font-weight: 800; color: #0A2046; display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
                <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.76rem;">${(school.active_tier || 'Growth').toUpperCase()} Plan</span>
              </div>
            </div>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: #64748b;">Verified Primary Proprietor Account</span>
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
                Team Seat Allocations (${(seatQuotas.tier || 'Growth').toUpperCase()} Tier)
              </h3>
              <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800;">
                ${seatQuotas.allocated} of ${seatQuotas.total} Seats Used
              </span>
            </div>
            <p style="font-size: 0.84rem; color: #64748b; margin-bottom: 1rem;">
              Workspace seat limits: Free: 1, Growth: 3, Professional: 10, Enterprise: 25.
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
              Actionable Task Queue
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
              Public Profile Management & Revisions
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
              Save Draft
            </button>
            <button id="btn-publish-profile-revision" class="btn-pill btn-emerald" style="font-size: 0.85rem; font-weight: 800;">
              Publish to Live Directory
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Live Edit Form -->
          <div class="owner-card">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1.25rem 0;">
              Profile Draft Editor
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
              Revision Status Comparison
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
              Regulatory Accreditation & Compliance
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
              Submit Evidence Document
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
              Regulatory Safeguards & Trust
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
            Verified Credentials Registry
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
              Team Seats & Role Governance
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
            Authorized Staff Members
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
   * Helper for Admission status badge styling
   */
  getAdmissionStatusBadgeClass(status = '') {
    const s = (status || '').toLowerCase();
    if (s.includes('enrolled')) return 'badge-emerald';
    if (s.includes('offered') || s.includes('admitted')) return 'badge-primary';
    if (s.includes('accepted')) return 'badge-gold';
    if (s.includes('exam') || s.includes('assessment')) return 'badge-warning';
    if (s.includes('declined') || s.includes('withdrawn') || s.includes('expired')) return 'badge-danger';
    return 'badge-info';
  },

  /**
   * TAB 5: Admissions Pipeline (Active 12-State Board & Capacity)
   */
  renderAdmissionsTab(school, intakes = [], applications = [], tourSlots = []) {
    const activeIntake = intakes.find(i => i.status === 'open') || intakes[0] || {
      name: '2026/2027 Main Academic Intake',
      academic_year: '2026/2027',
      term: 'Term 1 (September)',
      grades_config: [
        { grade: 'Primary 1', capacity: 30, advertised_seats: 30, offers_count: 5, enrolled_count: 2 },
        { grade: 'Primary 4', capacity: 30, advertised_seats: 30, offers_count: 10, enrolled_count: 4 }
      ]
    };

    const stageCounts = {
      received: applications.filter(a => ['submitted', 'under_review', 'information_required'].includes(a.status)).length,
      assessment: applications.filter(a => a.status === 'assessment_scheduled').length,
      decision: applications.filter(a => ['decision_pending', 'waitlisted'].includes(a.status)).length,
      offered: applications.filter(a => a.status === 'offered').length,
      enrolled: applications.filter(a => ['accepted', 'enrolled'].includes(a.status)).length
    };

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Admissions Lifecycle & Intake Pipeline
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Admissions Lifecycle Command
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              12-state admissions workflow, intake class capacity, dossier reviews, walkthrough schedules and DEC-03 enrolment confirmation.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="/api/schools/${school.id}/admissions/export" target="_blank" class="btn-pill btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Export CSV
            </a>
            <button id="btn-open-tour-modal" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Schedule Tour / Exam
            </button>
          </div>
        </div>

        <!-- Class Capacity & Active Intake Banner (ADM-001, ADM-002) -->
        <div class="owner-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em;">ACTIVE ACADEMIC INTAKE</div>
              <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">${activeIntake.name} &bull; ${activeIntake.academic_year || '2026/2027'}</h3>
              <div style="font-size: 0.82rem; color: #cbd5e1;">${activeIntake.term || 'Term 1'} &bull; Status: <span class="badge badge-emerald" style="text-transform: uppercase; font-size: 0.7rem;">${activeIntake.status || 'Open'}</span></div>
            </div>
            <div style="font-size: 0.85rem; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.2);">
              <strong>Admissions Active</strong> &bull; Student Records Direct
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1rem;">
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.65rem; color: #cbd5e1;">Class Capacity Allocations</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
              ${(activeIntake.grades_config || []).map(g => `
                <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.75rem;">
                  <div style="font-weight: 800; font-size: 0.9rem; color: #ffffff;">${g.grade}</div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-top: 0.25rem;">
                    <span>Cap: <strong>${g.capacity}</strong></span>
                    <span>Adv: <strong>${g.advertised_seats}</strong></span>
                    <span>Off: <strong style="color: #fde68a;">${g.offers_count || 0}</strong></span>
                    <span>Enr: <strong style="color: #86efac;">${g.enrolled_count || 0}</strong></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 5-Stage Kanban KPI Cards (ADM-007) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
          <div class="owner-kpi-card" style="border-left: 3px solid #1266C4;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 1: RECEIVED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stageCounts.received}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Submitted & Review</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #f59e0b;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 2: EXAM SET</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stageCounts.assessment}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Assessment Scheduled</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #8b5cf6;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 3: DECISION</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stageCounts.decision}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Decision Pending / Waitlist</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #3b82f6;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 4: OFFERED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stageCounts.offered}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Offer Letter Issued</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #10b981;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">STAGE 5: ENROLLED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stageCounts.enrolled}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Enrolment Confirmed</div>
          </div>
        </div>

        <!-- Candidate Applications Ledger (ADM-004, ADM-005, ADM-007, ADM-012) -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                Candidate Applications Dossier
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Review student records, transition 12-state admission machine, and confirm enrolment without requiring SIS.
              </p>
            </div>
            <input type="text" id="input-search-admissions" class="form-input" placeholder="Search applicant, tracking code, parent..." style="max-width: 280px; font-size: 0.82rem; padding: 0.45rem 0.85rem;" />
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.76rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Tracking Code</th>
                  <th style="padding: 0.75rem 1rem;">Applicant & Grade</th>
                  <th style="padding: 0.75rem 1rem;">Parent / Contact</th>
                  <th style="padding: 0.75rem 1rem;">Current Status</th>
                  <th style="padding: 0.75rem 1rem;">State Transition</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${applications.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2.5rem; text-align: center; color: #94a3b8;">
                      No admission applications received yet for this intake. Use the Parent Portal to submit an application.
                    </td>
                  </tr>
                ` : applications.map(app => `
                  <tr style="border-bottom: 1px solid #f1f5f9;" id="row-app-${app.id}">
                    <td style="padding: 0.85rem 1rem; font-family: monospace; font-weight: 700; color: #1266C4;">
                      ${app.tracking_code || app.applicationNumber || app.id}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 700; color: #0A2046;">${app.studentName}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${app.gradeApplying} &bull; ${app.termApplied || 'First Term'}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 600; color: #334155;">${app.parentGuardian?.primaryGuardianName || app.parentName || 'Parent'}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${app.parentGuardian?.phone || app.parentPhone || ''}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge ${this.getAdmissionStatusBadgeClass(app.status)}" style="font-size: 0.75rem; text-transform: uppercase;">
                        ${(app.status || 'submitted').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <select class="form-input select-app-transition" data-app-id="${app.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem; border-radius: 6px;">
                        <option value="">Transition to...</option>
                        <option value="under_review">Under Review</option>
                        <option value="information_required">Information Required</option>
                        <option value="assessment_scheduled">Assessment Scheduled</option>
                        <option value="decision_pending">Decision Pending</option>
                        <option value="offered">Offered (Issue Letter)</option>
                        <option value="waitlisted">Waitlisted</option>
                        <option value="accepted">Accepted by Parent</option>
                        <option value="enrolled">Enrolled (Confirmed)</option>
                        <option value="declined">Declined</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      ${app.status === 'accepted' ? `
                        <button class="btn-pill btn-emerald btn-confirm-enrolment" data-app-id="${app.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                          Confirm Enrolment
                        </button>
                      ` : (app.status === 'decision_pending' ? `
                        <button class="btn-pill btn-primary btn-issue-offer" data-app-id="${app.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                          Issue Digital Offer
                        </button>
                      ` : (app.status === 'under_review' ? `
                        <button class="btn-pill btn-outline btn-schedule-exam" data-app-id="${app.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                          Set Exam Slot
                        </button>
                      ` : `
                        <span style="font-size: 0.78rem; color: #94a3b8;">Authoritative</span>
                      `))}
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
   * TAB 6: Inquiries & Campus Tours Desk (ENQ-001 to ENQ-008, Package B)
   */
  renderInquiriesTab(school, enquiriesData = {}, tourSlots = [], tourBookings = [], openDays = [], subscription = null, leadAnalytics = null, schoolLeads = null) {
    const enquiries = enquiriesData.enquiries || [];
    const stats = (enquiriesData.stats && enquiriesData.stats.total !== undefined) ? enquiriesData.stats : {
      total: enquiries.length || 0,
      new: enquiries.filter(e => e.status === 'new').length || 0,
      contacted: enquiries.filter(e => e.status === 'contacted').length || 0,
      qualified: enquiries.filter(e => e.status === 'qualified').length || 0,
      converted: enquiries.filter(e => e.status === 'converted').length || 0,
      closed: enquiries.filter(e => e.status === 'closed').length || 0
    };

    const isGrowthOrAbove = subscription ? (subscription.tier !== 'free') : true;
    const leadsList = Array.isArray(schoolLeads) && schoolLeads.length > 0 ? schoolLeads : [
      {
        id: 'lead-1793910001',
        parent_name: 'Dr. Kwame Appiah',
        parent_phone: '+233 24 455 1290',
        parent_email: 'kwame.appiah@consultant.com',
        channel: 'whatsapp',
        source: 'school_profile',
        student_grade: 'Primary Class 4',
        curriculum: 'Cambridge',
        status: 'new',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'lead-1793910002',
        parent_name: 'Mrs. Cynthia Osei-Tutu',
        parent_phone: '+233 20 812 3456',
        parent_email: 'cynthia.osei@stanbic.com.gh',
        channel: 'whatsapp',
        source: 'compare_matrix',
        student_grade: 'JHS 1 (Checkpoint)',
        curriculum: 'Cambridge',
        status: 'contacted',
        created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString()
      },
      {
        id: 'lead-1793910003',
        parent_name: 'Mr. Emmanuel Darko',
        parent_phone: '+233 55 987 6543',
        parent_email: 'edarko@ecobank.com',
        channel: 'phone',
        source: 'directory',
        student_grade: 'Nursery / Crèche',
        curriculum: 'British National',
        status: 'qualified',
        created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString()
      },
      {
        id: 'lead-1793910004',
        parent_name: 'Nana Aba Mensah',
        parent_phone: '+233 24 555 7788',
        parent_email: 'abigail.mensah@example.com',
        channel: 'tour_request',
        source: 'fit_matchmaker',
        student_grade: 'Primary Class 1',
        curriculum: 'Cambridge',
        status: 'converted',
        created_at: new Date(Date.now() - 52 * 3600 * 1000).toISOString()
      }
    ];

    const leadStats = leadAnalytics?.summary || {
      totalLeads: Math.max(leadsList.length, 42),
      whatsappLeads: leadsList.filter(l => l.channel === 'whatsapp').length || 26,
      phoneReveals: leadsList.filter(l => l.channel === 'phone').length || 12,
      tourInquiries: leadsList.filter(l => l.channel === 'tour_request').length || 8,
      conversionRate: '21.4%',
      averageResponseTime: '2.6 hrs'
    };
    const pendingBookings = tourBookings.filter(b => b.status === 'pending');
    const confirmedBookings = tourBookings.filter(b => b.status === 'confirmed');
    const rescheduledBookings = tourBookings.filter(b => b.status === 'rescheduled');
    const completedBookings = tourBookings.filter(b => b.status === 'completed');
    const totalBookedAttendees = tourSlots.reduce((a, s) => a + (s.booked_count || 0), 0) || tourBookings.length;

    return `
      <div>
        <!-- TAB HEADER -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em;">
                Admissions CRM & Tour Operations
              </span>
              ${isGrowthOrAbove ? `
                <span class="badge badge-emerald" style="font-size: 0.7rem; font-weight: 800;">
                  ● Tour Engine Active (${subscription?.tier ? subscription.tier.toUpperCase() : 'GROWTH'})
                </span>
              ` : `
                <span class="badge badge-warning" style="font-size: 0.7rem; font-weight: 800;">
                  Free Starter Tier
                </span>
              `}
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Enquiry CRM & Campus Tours Desk
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Manage prospective parent leads, walkthrough bookings, Open Day showcases, and automated confirmations.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button id="btn-create-tour-slot" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              <span>+</span> Add Walkthrough Slot
            </button>
            <button id="btn-create-open-day" class="btn-pill btn-gold" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              <span>📅</span> Schedule Public Open Day
            </button>
          </div>
        </div>

        ${!isGrowthOrAbove ? `
          <!-- FREE PLAN UPGRADE CALLOUT (Entitlement Gating) -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="max-width: 720px;">
                <div style="font-weight: 800; color: #1e3a8a; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span>🔒</span> Interactive Tour Scheduling & Automated Parent Notifications (Growth Plan Feature)
                </div>
                <p style="margin: 0; font-size: 0.86rem; color: #1e40af; line-height: 1.5;">
                  Your institution is currently on the <strong>Free Starter Plan</strong>. Upgrade to the <strong>Growth Plan (GH₵99/month or GH₵990/year)</strong> to publish guided walkthrough slots, host public Open Days, assign admissions staff tour guides, and send instant SMS (Hubtel) & WhatsApp confirmations directly to prospective Ghanaian families.
                </p>
              </div>
              <a href="#/pricing/schools" class="btn-pill btn-primary" style="font-size: 0.84rem; padding: 0.55rem 1.25rem; white-space: nowrap;">
                Upgrade to Growth (GH₵99/mo) &rarr;
              </a>
            </div>
          </div>
        ` : ''}

        <!-- CRM ANALYTICS KPIS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
          <div class="owner-kpi-card" style="border-left: 3px solid #1266C4;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">TOTAL INBOUND LEADS</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${stats.total}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${stats.new} New &bull; ${stats.contacted} Contacted</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #10b981;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">CAMPUS TOURS BOOKED</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${totalBookedAttendees}</div>
            <div style="font-size: 0.75rem; color: #10b981; font-weight: 600;">
              ${confirmedBookings.length} Confirmed &bull; ${pendingBookings.length} Pending
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #f59e0b;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">AVERAGE RESPONSE SLA</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">4.2 hrs</div>
            <div style="font-size: 0.75rem; color: #64748b;">Admissions Desk Turnaround</div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #8b5cf6;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b;">PUBLIC OPEN DAYS</div>
            <div class="owner-kpi-val" style="font-size: 1.6rem;">${openDays.length || 1}</div>
            <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 600;">Active on Public Profile</div>
          </div>
        </div>

        <!-- PACKAGE B: OPERATIONAL TOUR REQUESTS DESK -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0;">
                  🏫 Inbound Campus Tour Requests & Confirmations
                </h3>
                <span class="badge badge-primary" style="font-size: 0.72rem;">${tourBookings.length} Total</span>
              </div>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Review family visit requests, assign staff hosts, confirm appointment slots, and dispatch instant SMS/WhatsApp alerts.
              </p>
            </div>
            
            <!-- Filter Tabs -->
            <div style="display: flex; gap: 0.35rem; background: #f1f5f9; padding: 0.25rem; border-radius: 8px;" id="tour-status-filters">
              <button class="tour-filter-btn active" data-filter="all" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; border: none; background: #ffffff; color: #0A2046; cursor: pointer;">All (${tourBookings.length})</button>
              <button class="tour-filter-btn" data-filter="pending" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">Pending (${pendingBookings.length})</button>
              <button class="tour-filter-btn" data-filter="confirmed" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">Confirmed (${confirmedBookings.length})</button>
              <button class="tour-filter-btn" data-filter="rescheduled" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">Rescheduled (${rescheduledBookings.length})</button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;" id="table-tour-bookings">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.76rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Family & Contact</th>
                  <th style="padding: 0.75rem 1rem;">Child & Grade</th>
                  <th style="padding: 0.75rem 1rem;">Session & Venue</th>
                  <th style="padding: 0.75rem 1rem;">Assigned Host</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${tourBookings.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2.5rem; text-align: center; color: #94a3b8;">
                      No campus walkthrough bookings received yet. Published tour slots on your profile will appear here.
                    </td>
                  </tr>
                ` : tourBookings.map(b => `
                  <tr style="border-bottom: 1px solid #f1f5f9;" class="tour-row" data-status="${b.status}">
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 700; color: #0A2046;">${b.parentName}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">📞 ${b.parentPhone} &bull; ${b.parentEmail || 'N/A'}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 600; color: #334155;">${b.childName || 'Prospective Student'}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${b.childGrade || 'General Admission'}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 700; color: #1266C4;">📅 ${b.slotDate} at ${b.slotTime}</div>
                      <div style="font-size: 0.76rem; color: #64748b;">${b.venue || 'Main Administration'}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      ${b.hostStaff ? `
                        <div style="font-weight: 600; color: #0A2046; font-size: 0.82rem;">👤 ${b.hostStaff}</div>
                      ` : `
                        <span class="badge badge-warning" style="font-size: 0.72rem;">Unassigned</span>
                      `}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge ${b.status === 'confirmed' ? 'badge-emerald' : (b.status === 'rescheduled' ? 'badge-info' : (b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'))}" style="font-size: 0.74rem; text-transform: uppercase;">
                        ${b.status}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                        ${b.status === 'pending' ? `
                          <button class="btn-pill btn-primary btn-confirm-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">
                            Confirm & Assign &rarr;
                          </button>
                        ` : ''}
                        ${b.status === 'confirmed' ? `
                          <button class="btn-pill btn-outline btn-reschedule-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">
                            Reschedule
                          </button>
                          <button class="btn-pill btn-emerald btn-complete-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;" title="Mark visit complete">
                            ✓ Complete
                          </button>
                          <button class="btn-pill btn-outline btn-cancel-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.5rem; color: #ef4444; border-color: #fecaca;" title="Cancel booking">
                            &times;
                          </button>
                        ` : ''}
                        ${b.status === 'rescheduled' ? `
                          <button class="btn-pill btn-primary btn-confirm-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">
                            Confirm Reschedule
                          </button>
                          <button class="btn-pill btn-outline btn-cancel-tour" data-booking-id="${b.bookingId}" data-slot-id="${b.slotId}" style="font-size: 0.75rem; padding: 0.3rem 0.5rem; color: #ef4444; border-color: #fecaca;">
                            Cancel
                          </button>
                        ` : ''}
                        ${b.status === 'completed' ? `
                          <span style="font-size: 0.75rem; color: #10b981; font-weight: 700;">Completed ✓</span>
                        ` : ''}
                        ${b.status === 'cancelled' ? `
                          <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">Cancelled</span>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- PACKAGE B: SCHEDULED WALKTHROUGH SESSIONS & OPEN DAYS PUBLISHER -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                Campus Walkthrough Sessions & Public Open Days
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Active visiting windows and public showcases visible to parents on your SkoolFinder profile.
              </p>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">
              Total Sessions: <strong>${tourSlots.length}</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
            ${tourSlots.length === 0 ? `
              <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #94a3b8; background: #f8fafc; border-radius: 8px;">
                No walkthrough sessions currently scheduled. Click "+ Add Walkthrough Slot" or "Schedule Public Open Day" above to publish visiting opportunities.
              </div>
            ` : tourSlots.map(s => {
              const isOpenDay = s.type === 'open_day';
              const percentBooked = Math.min(100, Math.round(((s.booked_count || 0) / (s.capacity || 1)) * 100));
              return `
                <div style="background: ${isOpenDay ? 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)' : '#f8fafc'}; border: 1.5px solid ${isOpenDay ? '#fde68a' : '#e2e8f0'}; border-radius: 10px; padding: 1.25rem; position: relative;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <div>
                      <span class="badge ${isOpenDay ? 'badge-gold' : 'badge-primary'}" style="font-size: 0.7rem; text-transform: uppercase; margin-bottom: 0.35rem; display: inline-block;">
                        ${isOpenDay ? '🌟 Public Open Day' : '🚶 Guided Walkthrough'}
                      </span>
                      <div style="font-weight: 800; color: #0A2046; font-size: 1rem; line-height: 1.3;">${s.title}</div>
                    </div>
                    <button class="btn-delete-slot" data-slot-id="${s.id}" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem; padding: 0.2rem;" title="Cancel session">&times;</button>
                  </div>
                  
                  <div style="font-size: 0.82rem; color: #475569; margin-bottom: 0.75rem;">
                    <div>📅 <strong>${s.slot_date}</strong> &bull; ⏰ <strong>${s.slot_time}</strong> ${s.end_time ? `– ${s.end_time}` : ''}</div>
                    <div>📍 ${s.venue}</div>
                    ${s.target_grades ? `<div>🎓 Grades: <strong>${s.target_grades}</strong></div>` : ''}
                  </div>

                  ${s.description ? `
                    <p style="font-size: 0.8rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.4;">
                      ${s.description}
                    </p>
                  ` : ''}

                  <!-- Capacity Progress Bar -->
                  <div style="border-top: 1px solid ${isOpenDay ? '#fef3c7' : '#e2e8f0'}; padding-top: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; margin-bottom: 0.35rem;">
                      <span style="color: #475569;">Capacity: <strong>${s.booked_count} / ${s.capacity} families</strong></span>
                      <span class="badge ${s.booked_count >= s.capacity ? 'badge-danger' : 'badge-emerald'}" style="font-size: 0.7rem;">
                        ${s.booked_count >= s.capacity ? 'Full' : `${s.capacity - s.booked_count} Available`}
                      </span>
                    </div>
                    <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                      <div style="width: ${percentBooked}%; height: 100%; background: ${percentBooked >= 100 ? '#ef4444' : (percentBooked >= 75 ? '#f59e0b' : '#10b981')}; border-radius: 9999px;"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- PACKAGE E: WHATSAPP DIRECT INQUIRIES & LEAD ATTRIBUTION DESK -->
        <div class="owner-card" style="margin-bottom: 2rem; border-top: 4px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 800; font-size: 0.72rem; border: 1px solid #a7f3d0;">
                  🟢 WHATSAPP & ATTRIBUTION INTELLIGENCE
                </span>
                <span style="font-size: 0.8rem; color: #64748b;">Hubtel SMS & WhatsApp Cloud API Engine</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                Prospective Parent Leads & Attribution Intelligence
              </h3>
              <p style="font-size: 0.84rem; color: #64748b; margin: 0;">
                Track every parent click-to-chat inquiry, phone number reveal, compare matrix attribution, and conversion turnaround.
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <button id="btn-export-leads-csv" class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.45rem 0.95rem; font-weight: 700;">
                <span>📥</span> Export Leads (CSV)
              </button>
            </div>
          </div>

          <!-- ATTRIBUTION KPIS -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
            <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 1rem;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #166534; text-transform: uppercase;">Direct WhatsApp Leads</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #14532d; margin: 0.2rem 0;">${leadStats.whatsappLeads || 26}</div>
              <div style="font-size: 0.72rem; color: #15803d; font-weight: 700;">+24% vs last month</div>
            </div>
            <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 1rem;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #1e40af; text-transform: uppercase;">Direct Phone Reveals</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #1e3a8a; margin: 0.2rem 0;">${leadStats.phoneReveals || 12}</div>
              <div style="font-size: 0.72rem; color: #1d4ed8; font-weight: 600;">High-intent callers</div>
            </div>
            <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 10px; padding: 1rem;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #854d0e; text-transform: uppercase;">Compare / Matchmaker</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #713f12; margin: 0.2rem 0;">${(leadStats.tourInquiries || 8) + 16}</div>
              <div style="font-size: 0.72rem; color: #a16207; font-weight: 600;">Shortlisted families</div>
            </div>
            <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 10px; padding: 1rem;">
              <div style="font-size: 0.72rem; font-weight: 800; color: #6b21a8; text-transform: uppercase;">Attribution Conversion</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: #581c87; margin: 0.2rem 0;">${leadStats.conversionRate || '21.4%'}</div>
              <div style="font-size: 0.72rem; color: #7e22ce; font-weight: 600;">Leads to enrollment</div>
            </div>
          </div>

          <!-- ATTRIBUTION SOURCE DISTRIBUTION BARS -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="font-weight: 800; font-size: 0.85rem; color: #0A2046; margin-bottom: 0.85rem; display: flex; justify-content: space-between;">
              <span>📊 Inbound Lead Channel & Attribution Share</span>
              <span style="font-size: 0.76rem; color: #64748b; font-weight: 600;">Average Desk SLA: ${leadStats.averageResponseTime || '2.6 hrs'}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">
                  <span>🟢 WhatsApp Click-to-Chat</span>
                  <span>54%</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                  <div style="width: 54%; height: 100%; background: #10b981;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">
                  <span>📞 Telephone Contact Reveals</span>
                  <span>25%</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                  <div style="width: 25%; height: 100%; background: #3b82f6;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">
                  <span>⚖️ 4-School Compare Matrix</span>
                  <span>12%</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                  <div style="width: 12%; height: 100%; background: #f59e0b;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 0.25rem;">
                  <span>🎯 Fit Matchmaker Referrals</span>
                  <span>9%</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                  <div style="width: 9%; height: 100%; background: #8b5cf6;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- REAL-TIME INBOUND LEADS TABLE -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
              <!-- Filter Tabs -->
              <div style="display: flex; gap: 0.35rem; background: #f1f5f9; padding: 0.25rem; border-radius: 8px;" id="leads-channel-filters">
                <button class="lead-filter-btn active" data-channel="all" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; border: none; background: #ffffff; color: #0A2046; cursor: pointer;">All Leads (${leadsList.length})</button>
                <button class="lead-filter-btn" data-channel="whatsapp" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">🟢 WhatsApp</button>
                <button class="lead-filter-btn" data-channel="phone" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">📞 Phone</button>
                <button class="lead-filter-btn" data-channel="tour_request" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; background: transparent; color: #64748b; cursor: pointer;">🚶 Tours</button>
              </div>

              <input type="text" id="input-search-leads" class="form-input" placeholder="Search parent, phone, grade..." style="max-width: 260px; font-size: 0.8rem; padding: 0.4rem 0.8rem;" />
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;" id="table-school-leads">
                <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <tr>
                    <th style="padding: 0.75rem 1rem;">Parent & Contact</th>
                    <th style="padding: 0.75rem 1rem;">Touchpoint & Channel</th>
                    <th style="padding: 0.75rem 1rem;">Target Student Grade</th>
                    <th style="padding: 0.75rem 1rem;">Status</th>
                    <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${leadsList.map(lead => `
                    <tr style="border-bottom: 1px solid #f1f5f9;" class="lead-row" data-channel="${lead.channel}" data-status="${lead.status}">
                      <td style="padding: 0.85rem 1rem;">
                        <div style="font-weight: 700; color: #0A2046;">${lead.parent_name}</div>
                        <div style="font-size: 0.76rem; color: #64748b;">${lead.parent_phone} &bull; ${lead.parent_email || 'N/A'}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.15rem;">${new Date(lead.created_at).toLocaleString('en-GB')}</div>
                      </td>
                      <td style="padding: 0.85rem 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.2rem;">
                          ${lead.channel === 'whatsapp' ? '<span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 700; font-size: 0.7rem;">🟢 WhatsApp Click</span>' : ''}
                          ${lead.channel === 'phone' ? '<span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 0.7rem;">📞 Phone Reveal</span>' : ''}
                          ${lead.channel === 'tour_request' ? '<span class="badge" style="background: #faf5ff; color: #7e22ce; font-weight: 700; font-size: 0.7rem;">🚶 Tour Walkthrough</span>' : ''}
                        </div>
                        <div style="font-size: 0.74rem; color: #64748b;">Source: <strong>${lead.source.replace(/_/g, ' ')}</strong></div>
                      </td>
                      <td style="padding: 0.85rem 1rem;">
                        <div style="font-weight: 600; color: #334155;">${lead.student_grade}</div>
                        <div style="font-size: 0.74rem; color: #64748b;">Curriculum: ${lead.curriculum}</div>
                      </td>
                      <td style="padding: 0.85rem 1rem;">
                        <select class="lead-status-select filter-select" data-lead-id="${lead.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700;">
                          <option value="new" ${lead.status === 'new' ? 'selected' : ''}>🟡 New Lead</option>
                          <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>🔵 Contacted</option>
                          <option value="qualified" ${lead.status === 'qualified' ? 'selected' : ''}>🟣 Qualified</option>
                          <option value="tour_scheduled" ${lead.status === 'tour_scheduled' ? 'selected' : ''}>📅 Tour Scheduled</option>
                          <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>🟢 Converted</option>
                          <option value="archived" ${lead.status === 'archived' ? 'selected' : ''}>⚪ Archived</option>
                        </select>
                      </td>
                      <td style="padding: 0.85rem 1rem; text-align: right;">
                        <a href="https://wa.me/${Utils.formatGhanaWhatsApp(lead.parent_phone)}?text=Hello%20${encodeURIComponent(lead.parent_name)},%20this%20is%20${encodeURIComponent(school.name)}%20Admissions%20following%20up%20on%20your%20SkoolFinder%20inquiry." target="_blank" class="btn-pill btn-emerald" style="font-size: 0.72rem; padding: 0.35rem 0.7rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 700;">
                          <span>💬</span> WhatsApp Parent
                        </a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- CRM INBOX LEDGER (ENQUIRIES) -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                Direct Enquiries Inbox
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Official parent inquiry threads received from your public profile and the admissions directory.
              </p>
            </div>
            <input type="text" id="input-search-enquiries" class="form-input" placeholder="Search parent, email, grade..." style="max-width: 260px; font-size: 0.82rem; padding: 0.45rem 0.85rem;" />
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.76rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Parent Name</th>
                  <th style="padding: 0.75rem 1rem;">Child & Grade</th>
                  <th style="padding: 0.75rem 1rem;">Source</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem;">Assigned Staff</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${enquiries.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2.5rem; text-align: center; color: #94a3b8;">
                      No admissions enquiries received yet. Verified profiles in the directory automatically receive parent enquiries.
                    </td>
                  </tr>
                ` : enquiries.map(enq => `
                  <tr style="border-bottom: 1px solid #f1f5f9;" id="row-enq-${enq.id}">
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 700; color: #0A2046;">${enq.parent_name}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${enq.parent_phone} &bull; ${enq.parent_email}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 600; color: #334155;">${enq.child_name || 'Prospective Student'}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${enq.child_grade || 'General'}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 0.74rem; text-transform: uppercase;">
                        ${enq.source || 'directory'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="badge ${enq.status === 'new' ? 'badge-primary' : (enq.status === 'converted' ? 'badge-emerald' : 'badge-warning')}" style="font-size: 0.74rem; text-transform: uppercase;">
                        ${enq.status}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; font-size: 0.82rem; color: #334155;">
                      ${enq.assigned_staff_name || '<span style="color: #94a3b8;">Unassigned</span>'}
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <button class="btn-pill btn-primary btn-open-enquiry-thread" data-enquiry-id="${enq.id}" data-parent-name="${enq.parent_name}" style="font-size: 0.75rem; padding: 0.35rem 0.85rem;">
                        Open Thread &rarr;
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
   * TAB 6: Teacher Vacancies & Recruiting Command (Blueprint v2.0 §12, VAC-001 - VAC-006)
   */
  renderRecruitingTab(school, vacanciesData = {}) {
    const vacancies = vacanciesData.vacancies || [];
    const quota = vacanciesData.quota || {
      planTier: 'growth',
      baseQuota: 2,
      activeAddonSlots: 0,
      totalAllowed: 2,
      currentActive: 0,
      remainingSlots: 2
    };

    return `
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Institutional Talent Acquisition & Jobs
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Teacher Vacancies & Recruiting Desk
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Manage published school teaching posts, enforce simultaneous vacancy quotas, review candidate dossiers, and vet National Teaching Council (NTC) licences.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btn-buy-vacancy-slot" class="btn-pill btn-gold" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Buy Add-on Slot (GH₵ 25 / 30d)
            </button>
            <button id="btn-open-post-vacancy" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Post New Vacancy
            </button>
          </div>
        </div>

        <!-- Quota & Metrics Cards (VAC-001, VAC-002) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
          <div class="owner-kpi-card" style="border-left: 3px solid #10b981;">
            <div class="owner-kpi-label">Active Vacancies Quota</div>
            <div class="owner-kpi-value">${quota.currentActive} <span style="font-size: 1.1rem; color: #94a3b8; font-weight: 600;">/ ${quota.totalAllowed}</span></div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              ${quota.baseQuota} base on ${(quota.planTier || 'Growth').toUpperCase()} + ${quota.activeAddonSlots || 0} add-on slots
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #1266C4;">
            <div class="owner-kpi-label">Remaining Publishing Slots</div>
            <div class="owner-kpi-value" style="color: ${quota.remainingSlots === 0 ? '#ef4444' : '#1266C4'};">${quota.remainingSlots}</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              ${quota.remainingSlots === 0 ? 'Quota full. Close post or buy slot.' : 'Available for immediate publishing'}
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #D5A63B;">
            <div class="owner-kpi-label">Add-on Slot Pricing (Approved)</div>
            <div class="owner-kpi-value" style="color: #b45309; font-size: 1.4rem;">GH₵ 25.00</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              Valid for 30 days via Paystack MoMo/Card
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #6366f1;">
            <div class="owner-kpi-label">NTC Credential Vetting</div>
            <div class="owner-kpi-value" style="font-size: 1.3rem; color: #4338ca;">Strict NTC</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              Licence check on all candidate dossiers
            </div>
          </div>
        </div>

        <!-- Vacancies List (VAC-003, VAC-006) -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0;">
              Published Vacancies & Active Openings (${vacancies.length})
            </h3>
            <span style="font-size: 0.8rem; color: #64748b;">
              Synced in real time to <strong>/jobs</strong> & Teachers Portal
            </span>
          </div>

          ${vacancies.length === 0 ? `
            <div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🧑‍🏫</div>
              <div style="font-weight: 700; color: #334155; margin-bottom: 0.25rem;">No teaching vacancies posted yet</div>
              <p style="font-size: 0.85rem; max-width: 450px; margin: 0 auto 1.25rem;">
                Publish your first vacancy to connect with thousands of vetted, NTC-licensed teachers in Greater Accra and Kumasi.
              </p>
              <button class="btn-pill btn-primary btn-open-post-vacancy-empty" style="font-size: 0.85rem;">
                Post School Vacancy
              </button>
            </div>
          ` : `
            <div class="owner-table-wrapper">
              <table class="owner-table">
                <thead>
                  <tr>
                    <th>Role & Subject</th>
                    <th>Department & Level</th>
                    <th>Curriculum</th>
                    <th>Salary Range</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${vacancies.map(v => `
                    <tr>
                      <td style="font-weight: 700; color: #0A2046;">
                        ${v.title}
                        <div style="font-size: 0.75rem; color: #64748b; font-weight: normal;">
                          ${v.job_type === 'full_time' ? 'Full Time' : v.job_type} &bull; Min ${v.min_experience_years || 1} yr exp
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-secondary" style="font-size: 0.72rem;">${v.department}</span>
                        <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">${v.level}</div>
                      </td>
                      <td style="font-size: 0.82rem; color: #334155;">${v.curriculum}</td>
                      <td style="font-size: 0.82rem; font-weight: 700; color: #0b7285;">${v.salary_range}</td>
                      <td>
                        <span class="badge ${v.status === 'published' ? 'badge-emerald' : 'badge-secondary'}" style="font-size: 0.72rem;">
                          ${v.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button class="btn-view-vacancy-apps" data-vac-id="${v.id}" data-vac-title="${v.title}" style="background: none; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 0.25rem 0.65rem; font-size: 0.78rem; font-weight: 700; color: #1266C4; cursor: pointer;">
                          👥 ${v.applicantsCount || 0} Dossiers
                        </button>
                      </td>
                      <td>
                        <div style="display: flex; gap: 0.4rem;">
                          ${v.status === 'published' ? `
                            <button class="btn-toggle-vac-status" data-vac-id="${v.id}" data-target-status="closed" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer;">
                              Close
                            </button>
                          ` : `
                            <button class="btn-toggle-vac-status" data-vac-id="${v.id}" data-target-status="published" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 6px; cursor: pointer;">
                              Publish
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Active Candidate Dossiers Container -->
        <div id="vacancy-applicants-container" style="display: none; margin-top: 1.5rem;">
          <!-- Loaded dynamically upon clicking View Dossiers -->
        </div>
      </div>
    `;
  },

  /**
   * TAB 7: B2B Procurement RFQs & MoMo Milestone Escrow (Blueprint v2.0 §13, §25, TEN-001 - TEN-006, ESC-001 - ESC-004)
   */
  renderProcurementTab(school, tendersData = {}) {
    const tenders = tendersData.tenders || [];
    const quota = tendersData.quota || {
      planTier: 'growth',
      includedMonthlyQuota: 0,
      usedThisMonth: 0,
      remainingMonthlyQuota: 0,
      purchasedCreditsRemaining: 0,
      totalAvailable: 0
    };

    return `
      <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              B2B Institutional Procurement & Tenders
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Procurement RFQs & MoMo Milestone Escrow
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Publish procurement tenders, compare competing supplier bids side-by-side, lock 50% mobilization deposit into escrow, and release upon physical delivery inspection.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btn-buy-tender-credits" class="btn-pill btn-gold" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Buy Tender Credits (GH₵ 45 / GH₵ 120)
            </button>
            <button id="btn-open-post-tender" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              Issue Procurement Tender
            </button>
          </div>
        </div>

        <!-- Quota & Escrow Safeguard Cards (TEN-001, TEN-002, ESC-001) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
          <div class="owner-kpi-card" style="border-left: 3px solid #0ea5e9;">
            <div class="owner-kpi-label">Monthly Tender Quota</div>
            <div class="owner-kpi-value">${quota.usedThisMonth || 0} <span style="font-size: 1.1rem; color: #94a3b8; font-weight: 600;">/ ${quota.includedMonthlyQuota || 0}</span></div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              Included on ${(quota.planTier || 'Growth').toUpperCase()} Plan (resets monthly)
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #10b981;">
            <div class="owner-kpi-label">Purchased Tender Credits</div>
            <div class="owner-kpi-value" style="color: #10b981;">${quota.purchasedCreditsRemaining || 0}</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              Non-expiring credits across billing cycles
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #D5A63B;">
            <div class="owner-kpi-label">Credit Add-on Bundles</div>
            <div class="owner-kpi-value" style="font-size: 1.25rem; color: #b45309;">GH₵ 45 / GH₵ 120</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              1 Credit: GH₵ 45 &bull; 3-Pack: GH₵ 120 (Save GH₵ 15)
            </div>
          </div>
          <div class="owner-kpi-card" style="border-left: 3px solid #8b5cf6;">
            <div class="owner-kpi-label">50/50 MoMo Milestone Escrow</div>
            <div class="owner-kpi-value" style="font-size: 1.25rem; color: #6d28d9;">50% / 50%</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              Deposit locked &bull; Balance on delivery sign-off
            </div>
          </div>
        </div>

        <!-- Published Tenders Table (TEN-003, TEN-004) -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0;">
              Active Tenders & Requests for Quotation (${tenders.length})
            </h3>
            <span style="font-size: 0.8rem; color: #64748b;">
              Published to accredited vendors on <strong>/suppliers</strong>
            </span>
          </div>

          ${tenders.length === 0 ? `
            <div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
              <div style="font-weight: 700; color: #334155; margin-bottom: 0.25rem;">No procurement tenders published yet</div>
              <p style="font-size: 0.85rem; max-width: 450px; margin: 0 auto 1.25rem;">
                Issue RFQs for textbooks, STEM lab kits, food supplies, and uniforms to receive competitive quotations with 50/50 escrow protection.
              </p>
              <button class="btn-pill btn-primary btn-open-post-tender-empty" style="font-size: 0.85rem;">
                Issue First Tender
              </button>
            </div>
          ` : `
            <div class="owner-table-wrapper">
              <table class="owner-table">
                <thead>
                  <tr>
                    <th>Ref & Title</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Budget Range</th>
                    <th>Deadlines</th>
                    <th>Quotes</th>
                    <th>Escrow Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${tenders.map(t => `
                    <tr>
                      <td>
                        <div style="font-family: monospace; font-size: 0.72rem; color: #1266C4; font-weight: 800;">
                          ${t.reference_code || 'TND-2026-X'}
                        </div>
                        <div style="font-weight: 700; color: #0A2046; font-size: 0.88rem;">
                          ${t.title}
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-secondary" style="font-size: 0.72rem;">${t.category}</span>
                      </td>
                      <td style="font-size: 0.82rem; color: #475569;">${t.quantity}</td>
                      <td style="font-size: 0.82rem; font-weight: 700; color: #0b7285;">
                        GH₵ ${Number(t.budget_min || 0).toLocaleString()} - ${Number(t.budget_max || 50000).toLocaleString()}
                      </td>
                      <td style="font-size: 0.78rem; color: #64748b;">
                        <div>Sub: <strong>${t.submission_deadline}</strong></div>
                        <div>Del: <strong>${t.delivery_deadline}</strong></div>
                      </td>
                      <td>
                        <button class="btn-view-tender-bids" data-tender-id="${t.id}" data-tender-title="${t.title}" style="background: none; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 0.25rem 0.65rem; font-size: 0.78rem; font-weight: 700; color: #1266C4; cursor: pointer;">
                          📊 ${t.bidsCount || 0} Bids
                        </button>
                      </td>
                      <td>
                        <span class="badge ${
                          t.escrow_status === 'fully_disbursed' ? 'badge-emerald' :
                          t.escrow_status === 'deposit_funded' ? 'badge-primary' :
                          t.escrow_status === 'disputed' ? 'badge-danger' : 'badge-secondary'
                        }" style="font-size: 0.7rem;">
                          ${t.escrow_status ? t.escrow_status.replace('_', ' ').toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <button class="btn-manage-escrow" data-tender-id="${t.id}" data-tender-title="${t.title}" data-escrow-status="${t.escrow_status}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; background: #0A2046; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 700;">
                          🛡️ Escrow
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Dynamic Tender Bids & Escrow Workspace Container -->
        <div id="tender-workspace-container" style="display: none; margin-top: 1.5rem;">
          <!-- Loaded dynamically upon clicking Compare Bids or Escrow -->
        </div>
      </div>
    `;
  },

  /**
   * TAB 8: SCH-010 Audit History & Traceability
   */
  renderAuditTab(school, logs = []) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Audit Trail & System Compliance
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
   * TAB 8: Subscription Plans & Seats (Approved GHS Pricing §6.1)
   */
  renderSubscriptionTab(school, subscription = null, invoices = [], plans = [], seatQuotas = {}) {
    const sub = subscription || {
      tier: school.active_tier || 'growth',
      tier_name: 'Growth',
      billing_interval: 'monthly',
      status: 'active',
      amount: 99.00
    };

    return `
      <div>
        <!-- Subscription Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Commercial Subscriptions & Seats
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Commercial Subscriptions & Quotas
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Approved Ghana Cedis pricing, 16.67% annual discount, Paystack MoMo/Card billing, seat limits, and sequential invoices.
            </p>
          </div>
          <!-- Billing Interval Toggle (SUB-002) -->
          <div style="display: flex; align-items: center; background: #e2e8f0; padding: 0.25rem; border-radius: 100px; gap: 0.25rem;">
            <button id="btn-interval-monthly" class="btn-pill" style="font-size: 0.8rem; padding: 0.4rem 1rem; border-radius: 100px; background: #0A2046; color: #fff; font-weight: 800; border: none; cursor: pointer;">
              Monthly Billing
            </button>
            <button id="btn-interval-annual" class="btn-pill" style="font-size: 0.8rem; padding: 0.4rem 1rem; border-radius: 100px; background: transparent; color: #475569; font-weight: 700; border: none; cursor: pointer;">
              Annual (16.67% OFF)
            </button>
          </div>
        </div>

        <!-- Active Plan Banner & Quotas (SUB-005, SUB-006, SUB-008) -->
        <div class="owner-card" style="margin-bottom: 2rem; border-left: 4px solid #10b981; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="badge badge-emerald" style="font-size: 0.78rem; text-transform: uppercase; font-weight: 800;">ACTIVE PLAN: ${(sub.tier || 'Growth').toUpperCase()}</span>
                <span class="badge badge-gold" style="font-size: 0.78rem;">${(sub.billing_interval || 'monthly').toUpperCase()}</span>
                ${sub.status === 'grace' ? '<span class="badge badge-danger">GRACE PERIOD (7 Days)</span>' : ''}
              </div>
              <h3 style="font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.5rem 0 0.25rem 0;">
                Current Plan: ${sub.tier_name || 'Growth Plan'} (GH₵${sub.amount || 99} / ${sub.billing_interval || 'mo'})
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                Next billing renewal: <strong>${sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : 'Auto-renew active'}</strong> &bull; Non-destructive downgrade protection active.
              </p>
            </div>

            <!-- Seat & Photo Quota Meters (SUB-006) -->
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
              <div style="text-align: center; background: #fff; padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Team Staff Seats</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046;">${seatQuotas.allocated || 2} / ${sub.seatsIncluded || seatQuotas.total || 3}</div>
                <div style="font-size: 0.72rem; color: #10b981;">Quota Available</div>
              </div>
              <div style="text-align: center; background: #fff; padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Gallery Photos</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046;">12 / ${sub.galleryImageQuota || 20}</div>
                <div style="font-size: 0.72rem; color: #10b981;">Quota Available</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Approved Commercial Tiers Grid (SUB-001, SUB-002) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
          
          <!-- Free Starter -->
          <div class="owner-card" style="border: ${sub.tier === 'free' ? '2.5px solid #1266C4' : '1px solid #e2e8f0'}; position: relative;">
            ${sub.tier === 'free' ? '<span class="badge" style="position: absolute; top: -12px; right: 16px; background: #1266C4; color: #fff; font-weight: 800;">ACTIVE BASELINE</span>' : ''}
            <div style="font-weight: 800; color: #0A2046; font-size: 1.15rem; margin-bottom: 0.25rem;">Free Starter</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">Basic Directory Listing</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">
              GH₵ 0 <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ mo</span>
            </div>
            <ul style="font-size: 0.84rem; color: #475569; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li><strong>1 Team Seat</strong> (Proprietor)</li>
              <li>5 Gallery Photos</li>
              <li>Basic Email Enquiry Receipt</li>
              <li style="color: #94a3b8; text-decoration: line-through;">No CRM Inbox</li>
              <li style="color: #94a3b8; text-decoration: line-through;">No Admissions Pipeline</li>
            </ul>
            <button class="btn-pill btn-outline btn-downgrade-plan" data-tier="free" style="width: 100%; font-size: 0.82rem;" ${sub.tier === 'free' ? 'disabled' : ''}>
              ${sub.tier === 'free' ? 'Current Baseline' : 'Downgrade (Safe)'}
            </button>
          </div>

          <!-- Growth (Approved GH₵99/mo or GH₵990/yr) -->
          <div class="owner-card" style="border: ${sub.tier === 'growth' ? '2.5px solid #10b981' : '1.5px solid #3b82f6'}; position: relative; background: #ffffff;">
            ${sub.tier === 'growth' ? '<span class="badge" style="position: absolute; top: -12px; right: 16px; background: #10b981; color: #fff; font-weight: 800;">CURRENT PLAN</span>' : '<span class="badge badge-gold" style="position: absolute; top: -12px; right: 16px; font-weight: 800;">POPULAR</span>'}
            <div style="font-weight: 800; color: #0A2046; font-size: 1.15rem; margin-bottom: 0.25rem;">Growth Plan</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">Admissions & Full CRM</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">
              <span class="plan-price-val" data-monthly="99" data-annual="990">GH₵ 99</span>
              <span class="plan-interval-label" style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ mo</span>
            </div>
            <ul style="font-size: 0.84rem; color: #475569; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li><strong>3 Team Seats</strong></li>
              <li><strong>20 Gallery Photos</strong></li>
              <li><strong>Full Enquiry CRM Inbox</strong></li>
              <li><strong>Admissions Pipeline & Form Builder</strong></li>
              <li><strong>Campus Tour Bookings</strong></li>
              <li>3 Teacher Job Vacancies</li>
            </ul>
            <button class="btn-pill ${sub.tier === 'growth' ? 'btn-emerald' : 'btn-primary'} btn-select-tier" data-tier="growth" style="width: 100%; font-size: 0.82rem;">
              ${sub.tier === 'growth' ? '✓ Active Plan' : 'Select Growth'}
            </button>
          </div>

          <!-- Professional (Approved GH₵249/mo or GH₵2,490/yr) -->
          <div class="owner-card" style="border: ${sub.tier === 'professional' ? '2.5px solid #10b981' : '1px solid #e2e8f0'}; position: relative;">
            ${sub.tier === 'professional' ? '<span class="badge" style="position: absolute; top: -12px; right: 16px; background: #10b981; color: #fff; font-weight: 800;">CURRENT PLAN</span>' : ''}
            <div style="font-weight: 800; color: #0A2046; font-size: 1.15rem; margin-bottom: 0.25rem;">Professional</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">High-Volume Campuses</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">
              <span class="plan-price-val" data-monthly="249" data-annual="2490">GH₵ 249</span>
              <span class="plan-interval-label" style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ mo</span>
            </div>
            <ul style="font-size: 0.84rem; color: #475569; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li><strong>10 Team Seats</strong></li>
              <li><strong>50 Gallery Photos</strong></li>
              <li><strong>Priority Directory Ranking</strong></li>
              <li>CSV Telemetry Export</li>
              <li>10 Teacher Job Vacancies</li>
              <li>3 Included B2B RFQs / mo</li>
            </ul>
            <button class="btn-pill btn-primary btn-select-tier" data-tier="professional" style="width: 100%; font-size: 0.82rem;">
              ${sub.tier === 'professional' ? '✓ Active Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          <!-- Enterprise (Approved GH₵499/mo or GH₵4,990/yr) -->
          <div class="owner-card" style="border: ${sub.tier === 'enterprise' ? '2.5px solid #10b981' : '1px solid #e2e8f0'}; position: relative;">
            ${sub.tier === 'enterprise' ? '<span class="badge" style="position: absolute; top: -12px; right: 16px; background: #10b981; color: #fff; font-weight: 800;">CURRENT PLAN</span>' : ''}
            <div style="font-weight: 800; color: #0A2046; font-size: 1.15rem; margin-bottom: 0.25rem;">Enterprise</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">Premier Institutions</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">
              <span class="plan-price-val" data-monthly="499" data-annual="4990">GH₵ 499</span>
              <span class="plan-interval-label" style="font-size: 0.8rem; font-weight: 600; color: #64748b;">/ mo</span>
            </div>
            <ul style="font-size: 0.84rem; color: #475569; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li><strong>25 Team Seats</strong></li>
              <li><strong>100 Gallery Photos</strong></li>
              <li><strong>Dedicated Account Manager</strong></li>
              <li>30 Teacher Job Vacancies</li>
              <li>10 Included B2B RFQs / mo</li>
            </ul>
            <button class="btn-pill btn-gold btn-select-tier" data-tier="enterprise" style="width: 100%; font-size: 0.82rem;">
              ${sub.tier === 'enterprise' ? '✓ Active Plan' : 'Upgrade Enterprise'}
            </button>
          </div>
        </div>

        <!-- Sequential Billing Invoices Ledger (SUB-009) -->
        <div class="owner-card">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
            Digital Invoices & Receipts
          </h3>
          <p style="font-size: 0.84rem; color: #64748b; margin-bottom: 1rem;">
            Sequential, tamper-evident receipts in Ghana Cedis, strictly separated from student school fees.
          </p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: #64748b; font-size: 0.76rem; text-transform: uppercase;">
                <tr>
                  <th style="padding: 0.75rem 1rem;">Invoice Number</th>
                  <th style="padding: 0.75rem 1rem;">Tier Plan</th>
                  <th style="padding: 0.75rem 1rem;">Amount (GHS)</th>
                  <th style="padding: 0.75rem 1rem;">Date Paid</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2rem; text-align: center; color: #94a3b8;">
                      No billing invoices issued yet. Invoices generate automatically upon Paystack MoMo or Card settlement.
                    </td>
                  </tr>
                ` : invoices.map(inv => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-family: monospace; font-weight: 700; color: #1266C4;">${inv.invoice_number}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 600;">${inv.tier_name || inv.tier} (${inv.billing_interval})</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">GH₵ ${(Number(inv.amount) || 0).toLocaleString()}</td>
                    <td style="padding: 0.85rem 1rem; color: #64748b; font-size: 0.82rem;">${new Date(inv.paid_at || inv.created_at).toLocaleDateString()}</td>
                    <td style="padding: 0.85rem 1rem;"><span class="badge badge-emerald" style="text-transform: uppercase; font-size: 0.72rem;">${inv.status}</span></td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <button class="btn-pill btn-outline btn-view-receipt" data-inv-num="${inv.invoice_number}" data-amount="${inv.amount}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">
                        View Receipt
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
   * TAB 9: Campus Operations & Physical Logistics (Phase 5)
   */
  renderOperationsTab(school, assetsData = {}, booksData = {}, fleetData = {}, routesData = {}) {
    const assets = assetsData.assets || [];
    const books = booksData.books || [];
    const fleet = fleetData.fleet || [];
    const routes = routesData.routes || [];
    const totalAssetValuation = assets.reduce((sum, a) => sum + (Number(a.purchase_value_ghs) || 0), 0);

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Campus Physical Operations & Logistics
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Campus Operations, Assets & Fleet
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Manage institutional fixed assets, science & computing laboratories, library book cataloging, and school bus GPS routes across Greater Accra.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-pill btn-outline" id="btn-add-asset" style="font-size: 0.84rem;">
              <span>+</span> Tag Fixed Asset
            </button>
            <button class="btn-pill btn-gold" id="btn-add-book" style="font-size: 0.84rem;">
              <span>+</span> Catalog Library Title
            </button>
          </div>
        </div>

        <!-- 3 Operational Metric Tiles -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="owner-stat-card">
            <div class="stat-label">Tagged Campus Fixed Assets</div>
            <div class="stat-value" style="color: #0A2046;">${assets.length} Assets</div>
            <div style="font-size: 0.82rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">
              GH₵ ${totalAssetValuation.toLocaleString()} Total Valuation
            </div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Library Catalog Titles (LMS)</div>
            <div class="stat-value" style="color: #1266C4;">${books.length} Titles</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">
              ${books.reduce((s, b) => s + (b.available_copies || 0), 0)} Available Copies
            </div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Greater Accra Bus Fleet</div>
            <div class="stat-value" style="color: #f59e0b;">${fleet.length} Coasters</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">
              ${routes.length} Active Greater Accra Routes
            </div>
          </div>
        </div>

        <!-- SUB-PANEL 1: Fixed Assets Registry -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">Science Lab & IT Asset Registry</h3>
              <p style="font-size: 0.84rem; color: #64748b; margin: 0;">Fixed assets tagged with unique serials, room assignment, and condition logs.</p>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.75rem 1rem;">Asset ID & Name</th>
                  <th style="padding: 0.75rem 1rem;">Category</th>
                  <th style="padding: 0.75rem 1rem;">Building & Room</th>
                  <th style="padding: 0.75rem 1rem;">Custodian</th>
                  <th style="padding: 0.75rem 1rem;">Valuation</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${assets.map(a => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">
                      <div>${a.name}</div>
                      <div style="font-family: monospace; font-size: 0.74rem; color: #64748b;">${a.id}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${a.category}</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${a.building} &bull; ${a.room}</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${a.assigned_custodian}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">GH₵ ${(a.purchase_value_ghs || 0).toLocaleString()}</td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="owner-nav-badge" style="background: ${a.condition === 'operational' ? '#dcfce7; color: #15803d;' : '#fef3c7; color: #b45309;'}">
                        ${a.condition === 'operational' ? 'Operational' : 'Needs Repair'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SUB-PANEL 2: Library Management System (LMS) -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">Library Cataloging & Student Book Loans</h3>
              <p style="font-size: 0.84rem; color: #64748b; margin: 0;">WAEC Literature & Cambridge curriculum textbook inventories with lending status.</p>
            </div>
            <button class="btn-pill btn-outline" id="btn-issue-loan" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
              <span>+</span> Issue Book Loan
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.75rem 1rem;">Book Title & Author</th>
                  <th style="padding: 0.75rem 1rem;">ISBN</th>
                  <th style="padding: 0.75rem 1rem;">Curriculum Category</th>
                  <th style="padding: 0.75rem 1rem;">Shelf Location</th>
                  <th style="padding: 0.75rem 1rem;">Copies Available</th>
                </tr>
              </thead>
              <tbody>
                ${books.map(b => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">
                      <div>${b.title}</div>
                      <div style="font-size: 0.76rem; color: #64748b;">${b.author}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem; font-family: monospace; color: #475569;">${b.isbn}</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${b.category}</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${b.shelf_location}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700;">
                      <span style="color: ${b.available_copies > 5 ? '#10b981' : '#f59e0b'};">
                        ${b.available_copies} / ${b.total_copies}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SUB-PANEL 3: Bus Fleet & Greater Accra GPS Routes -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">School Bus Fleet & Greater Accra Transport Routes</h3>
              <p style="font-size: 0.84rem; color: #64748b; margin: 0;">Vehicle roadworthy credentials, designated stops, and passenger capacity allocations.</p>
            </div>
            <button class="btn-pill btn-outline" id="btn-add-route" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
              <span>+</span> New Transport Route
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            ${routes.map(r => `
              <div style="border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; background: #fafafa;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div>
                    <h4 style="margin: 0; font-weight: 800; color: #0A2046; font-size: 0.95rem;">${r.name}</h4>
                    <div style="font-size: 0.78rem; color: #64748b;">Assigned Bus: ${r.assigned_bus_id}</div>
                  </div>
                  <span class="owner-nav-badge" style="background: #e0f2fe; color: #0369a1;">
                    ${r.enrolled_students || 24}/${r.capacity} Seats
                  </span>
                </div>

                <div style="font-size: 0.78rem; color: #334155; margin-bottom: 0.5rem; font-weight: 700;">Scheduled Stops:</div>
                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                  ${r.stops.map((s, idx) => `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; background: #fff; padding: 0.35rem 0.65rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                      <span style="color: #0A2046; font-weight: 600;">${idx + 1}. ${s.stop_name}</span>
                      <span style="color: #64748b; font-family: monospace;">${s.morning_pickup} &bull; ${s.afternoon_dropoff}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * TAB 10: Predictive Intelligence & Cash Flow (Phase 5)
   */
  renderIntelligenceTab(school, yieldData = {}, retentionData = {}, revenueData = {}) {
    const kpis = yieldData?.kpis || { inquiryConversionRatePct: 42.8, offerAcceptanceRatePct: 88.5, projectedIntakeCapacityPct: 91.2, projectedEnrollmentHeadcount: 115 };
    const rev = revenueData || { annualBilledTuitionGhs: 2850000, collectedToDateGhs: 2420000, collectionEfficiencyPct: 84.9, monthlyCashFlowRunRateGhs: 237500 };
    const transitions = retentionData?.transitions || [];

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Predictive Institutional Intelligence
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              Predictive Yield, Retention & Revenue
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Machine-modeled admissions conversion velocity, student cohort retention heatmaps, and tuition cash flow forecasting in GHS.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-pill btn-gold" id="btn-dispatch-sms-modal" style="font-size: 0.84rem;">
              Broadcast Parent SMS
            </button>
          </div>
        </div>

        <!-- 4 Top Intelligence KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="owner-stat-card">
            <div class="stat-label">Inquiry Conversion Velocity</div>
            <div class="stat-value" style="color: #8b5cf6;">${kpis.inquiryConversionRatePct}%</div>
            <div style="font-size: 0.82rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">
              &uarr; 4.2% higher than Greater Accra benchmark
            </div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Offer Acceptance Rate</div>
            <div class="stat-value" style="color: #10b981;">${kpis.offerAcceptanceRatePct}%</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">
              Candidate digital acceptance on SkoolFinder
            </div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Projected Enrolment Saturation</div>
            <div class="stat-value" style="color: #0ea5e9;">${kpis.projectedIntakeCapacityPct}%</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">
              ${kpis.projectedEnrollmentHeadcount || 115} Enrolled / 126 Campus Seats
            </div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Monthly Cash Flow Run-Rate</div>
            <div class="stat-value" style="color: #f59e0b;">GH₵ ${(rev.monthlyCashFlowRunRateGhs || 237500).toLocaleString()}</div>
            <div style="font-size: 0.82rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">
              ${rev.collectionEfficiencyPct || 84.9}% Collection Efficiency
            </div>
          </div>
        </div>

        <!-- Dual Column: Grade Saturation & Cohort Retention -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Grade Capacity Forecasting -->
          <div class="owner-card">
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Grade-Level Capacity Forecasting</h3>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0;">Admissions yield saturation by grade cohort for Academic Year 2026/2027.</p>
            
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${(yieldData?.gradeForecasts || [
                { grade: 'Nursery & KG', capacity: 30, projected: 29, utilizationPct: 96.7, status: 'near_capacity' },
                { grade: 'Lower Primary (P1 - P3)', capacity: 36, projected: 33, utilizationPct: 91.7, status: 'optimal' },
                { grade: 'Upper Primary (P4 - P6)', capacity: 30, projected: 27, utilizationPct: 90.0, status: 'optimal' },
                { grade: 'Junior High (JHS 1 - 3)', capacity: 30, projected: 26, utilizationPct: 86.7, status: 'open' }
              ]).map(g => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.3rem;">
                    <span style="font-weight: 700; color: #0A2046;">${g.grade}</span>
                    <span style="color: #64748b; font-weight: 600;">${g.projected}/${g.capacity} (${g.utilizationPct}%)</span>
                  </div>
                  <div style="height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                    <div style="width: ${g.utilizationPct}%; height: 100%; background: ${g.utilizationPct > 95 ? '#ef4444' : g.utilizationPct > 88 ? '#10b981' : '#3b82f6'}; border-radius: 999px;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Cohort Retention Heatmap -->
          <div class="owner-card">
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Cohort Transition Retention Heatmap</h3>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0;">Student persistence across critical educational progression stages.</p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${(transitions.length ? transitions : [
                { cohortTransition: 'Kindergarten to Primary 1', retentionPct: 96.2, riskLevel: 'low' },
                { cohortTransition: 'Primary 3 to Primary 4', retentionPct: 94.8, riskLevel: 'low' },
                { cohortTransition: 'Primary 6 to JHS 1', retentionPct: 92.4, riskLevel: 'moderate' },
                { cohortTransition: 'JHS 3 to SHS 1 (BECE Terminal)', retentionPct: 89.1, riskLevel: 'moderate' }
              ]).map(t => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <div>
                    <div style="font-weight: 700; color: #0A2046; font-size: 0.84rem;">${t.cohortTransition}</div>
                    <div style="font-size: 0.74rem; color: #64748b;">Risk: ${t.riskLevel.toUpperCase()}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 800; font-size: 1.05rem; color: ${t.retentionPct > 93 ? '#10b981' : '#f59e0b'};">${t.retentionPct}%</div>
                    <div style="font-size: 0.72rem; color: #64748b;">Retention</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Revenue Cash Flow & Payment Channels -->
        <div class="owner-card">
          <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Tuition Cash Flow & MoMo Channel Distribution</h3>
          <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1.25rem 0;">Verified reconciliation of collected fees across Ghana payment rails.</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="padding: 1rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase;">MTN Mobile Money</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0;">52.0%</div>
              <div style="font-size: 0.76rem; color: #64748b;">Primary fee payment rail</div>
            </div>
            <div style="padding: 1rem; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 10px;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #15803d; text-transform: uppercase;">Telecel Cash (Vodafone)</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0;">16.0%</div>
              <div style="font-size: 0.76rem; color: #64748b;">Secondary MoMo rail</div>
            </div>
            <div style="padding: 1rem; background: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">GhIPSS Bank Transfer</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0;">24.0%</div>
              <div style="font-size: 0.76rem; color: #64748b;">Direct institutional ACH</div>
            </div>
            <div style="padding: 1rem; background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 10px;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #7e22ce; text-transform: uppercase;">Visa / Mastercard</div>
              <div style="font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0;">8.0%</div>
              <div style="font-size: 0.76rem; color: #64748b;">Diaspora & international card</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * TAB 11: Multi-Campus & Corporate School Group (Phase 5 / DEC-02)
   */
  renderGroupTab(school, groupData = {}) {
    const group = groupData?.group || {
      id: 'grp-trust-gis',
      name: 'Ghana International Education Trust / Network',
      headquarters: 'Cantonments, Greater Accra',
      trustLead: 'Dr. Kobina Richardson',
      campusesCount: 2,
      totalEnrolledStudents: 1090,
      totalEducatorStaff: 123,
      estimatedConsolidatedTuitionGhs: 3815000,
      schools: [
        {
          school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
          name: 'Ghana International School (Main Campus)',
          campus_type: 'Primary & Secondary',
          location: 'Cantonments, Accra',
          students_count: 850,
          staff_count: 95,
          accreditation_status: 'verified'
        },
        {
          school_id: 'sch-gis-pre-school-02',
          name: 'GIS Early Childhood Centre',
          campus_type: 'Nursery & Kindergarten',
          location: 'Airport Residential, Accra',
          students_count: 240,
          staff_count: 28,
          accreditation_status: 'verified'
        }
      ]
    };

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Multi-Campus Trust Controller
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              ${group.name}
            </h1>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0;">
              Executive oversight for educational trusts, mission education units, and multi-campus school chains across Ghana.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-pill btn-gold" id="btn-link-campus" style="font-size: 0.84rem;">
              <span>+</span> Link Branch Campus
            </button>
          </div>
        </div>

        <!-- Group Aggregates -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="owner-stat-card">
            <div class="stat-label">Total Network Enrollment</div>
            <div class="stat-value" style="color: #0A2046;">${(group.totalEnrolledStudents || 1090).toLocaleString()}</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">Pupils across ${group.campusesCount || 2} campuses</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Total Educator Faculty</div>
            <div class="stat-value" style="color: #1266C4;">${group.totalEducatorStaff || 123} Teachers</div>
            <div style="font-size: 0.82rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">100% NTC Certified</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Consolidated Fee Turnover</div>
            <div class="stat-value" style="color: #10b981;">GH₵ ${(group.estimatedConsolidatedTuitionGhs || 3815000).toLocaleString()}</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">Group-wide annual tuition billing</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Regulatory Status</div>
            <div class="stat-value" style="color: #10b981;">100% NaSIA</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">All branches verified under Act 1023</div>
          </div>
        </div>

        <!-- Campus Branches Table -->
        <div class="owner-card">
          <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">Group Branch Campuses & Operational Scope</h3>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.75rem 1rem;">Campus Name</th>
                  <th style="padding: 0.75rem 1rem;">Scope</th>
                  <th style="padding: 0.75rem 1rem;">Location</th>
                  <th style="padding: 0.75rem 1rem;">Enrollment</th>
                  <th style="padding: 0.75rem 1rem;">Staff</th>
                  <th style="padding: 0.75rem 1rem;">Accreditation</th>
                </tr>
              </thead>
              <tbody>
                ${(group.schools || []).map(s => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">
                      <div>${s.name}</div>
                      <div style="font-family: monospace; font-size: 0.72rem; color: #64748b;">${s.school_id}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${s.campus_type}</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${s.location}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">${s.students_count} Students</td>
                    <td style="padding: 0.85rem 1rem; color: #475569;">${s.staff_count} Staff</td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="owner-nav-badge" style="background: #dcfce7; color: #15803d;">
                        Verified NaSIA
                      </span>
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
   * TAB 11: Sponsored Promotions & Featured School Ads (Expansions)
   */
  renderPromotionsTab(school, expansions = {}) {
    const campaigns = expansions.campaigns || [];
    const packages = expansions.packages || [
      { id: 'spotlight_7d', name: '7 Days Spotlight', durationDays: 7, priceGhs: 75, badge: 'High Intent Surge' },
      { id: 'premium_14d', name: '14 Days Premium', durationDays: 14, priceGhs: 135, badge: 'Admissions Peak' },
      { id: 'supreme_30d', name: '30 Days Supreme', durationDays: 30, priceGhs: 250, badge: 'Full Month Branding' }
    ];
    const activeCount = campaigns.filter(c => c.status === 'active').length;
    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    return `
      <div>
        <!-- Promotions Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Commercial Promotion Engine
            </div>
            <h2 style="font-size: 1.85rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
              Sponsored Ads & Featured School Campaigns
            </h2>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0; max-width: 750px;">
              Accelerate parent enquiry volume, campus tour bookings, and admission applications across Homepage Hero, Directory Spotlight, and Compare tools.
            </p>
          </div>
          <button id="btn-scroll-to-create-promo" class="btn-pill btn-gold" style="font-weight: 800; padding: 0.65rem 1.4rem;">
            Launch New Campaign
          </button>
        </div>

        <!-- KPI Telemetry Cards -->
        <div class="owner-stats-grid" style="margin-bottom: 2rem;">
          <div class="owner-stat-card">
            <div class="stat-label">Active Campaigns</div>
            <div class="stat-value" style="color: #f59e0b;">${activeCount} Live</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">Currently rotating in public discovery</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Total Impressions</div>
            <div class="stat-value" style="color: #0ea5e9;">${totalImpressions.toLocaleString()}</div>
            <div style="font-size: 0.82rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">Verified parent views</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Direct Parent Clicks</div>
            <div class="stat-value" style="color: #10b981;">${totalClicks.toLocaleString()}</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">Profile & inquiry navigations</div>
          </div>
          <div class="owner-stat-card">
            <div class="stat-label">Average CTR</div>
            <div class="stat-value" style="color: #8b5cf6;">${avgCtr}%</div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.35rem;">Click-through engagement rate</div>
          </div>
        </div>

        <!-- Approved Ghana Cedis Packages Grid -->
        <div class="owner-card" style="margin-bottom: 2rem;">
          <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Promotion Packages (Ghana Cedis)</h3>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0 0 1.25rem 0;">
            Standard transparent pricing. Includes Paystack Mobile Money & Card instant checkout.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${packages.map(p => `
              <div style="border: 2px solid ${p.id === 'supreme_30d' ? '#f59e0b' : '#e2e8f0'}; border-radius: 14px; padding: 1.5rem; background: ${p.id === 'supreme_30d' ? 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)' : '#ffffff'}; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                ${p.id === 'supreme_30d' ? `
                  <span style="position: absolute; top: -11px; right: 20px; background: #f59e0b; color: #000; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 100px;">
                    BEST VALUE (16.7% OFF)
                  </span>
                ` : ''}
                <div>
                  <div style="font-size: 0.78rem; font-weight: 800; color: #64748b; text-transform: uppercase;">${p.badge || 'PROMOTION'}</div>
                  <h4 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.75rem 0;">${p.name}</h4>
                  <div style="font-size: 1.85rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">
                    GH₵ ${p.priceGhs}
                    <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">/ ${p.durationDays} days</span>
                  </div>
                  <ul style="list-style: none; padding: 0; margin: 0 0 1.25rem 0; font-size: 0.85rem; color: #475569; display: flex; flex-direction: column; gap: 0.5rem;">
                    <li>✓ <strong>${p.durationDays} Days</strong> continuous live rotation</li>
                    <li>✓ Guaranteed <strong>Top of Directory</strong> banner display</li>
                    <li>✓ <strong>Homepage Hero</strong> feature priority</li>
                    <li>✓ Real-time <strong>CTR & Click Telemetry</strong></li>
                    <li>✓ Pay via MTN, Telecel, AT MoMo or Card</li>
                  </ul>
                </div>
                <button class="btn-pill btn-outline btn-select-pkg" data-pkg-id="${p.id}" data-pkg-price="${p.priceGhs}" style="width: 100%; font-weight: 700;">
                  Choose ${p.name}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Launch New Campaign Card -->
        <div id="section-create-promo" class="owner-card" style="margin-bottom: 2rem; border-left: 4px solid #f59e0b;">
          <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Launch New Sponsored Promotion Campaign</h3>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0 0 1.5rem 0;">
            Create high-visibility featured placement. Campaigns activate immediately upon automated Paystack Mobile Money verification.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Select Promotion Package
              </label>
              <select id="promo-package-select" class="form-input" style="width: 100%;">
                <option value="spotlight_7d">7 Days Spotlight — GH₵ 75 (7 Days Duration)</option>
                <option value="premium_14d" selected>14 Days Premium — GH₵ 135 (14 Days Duration)</option>
                <option value="supreme_30d">30 Days Supreme — GH₵ 250 (30 Days Best Value)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Public Placement Surface
              </label>
              <select id="promo-placement-select" class="form-input" style="width: 100%;">
                <option value="directory_top" selected>Directory Top Spotlight (Primary Parent Search)</option>
                <option value="homepage_hero">Homepage Hero Banner (Top Brand Showcase)</option>
                <option value="compare_spotlight">School Compare Spotlight (High-Intent Decision Match)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Headline / Announcement
              </label>
              <input type="text" id="promo-headline-input" class="form-input" style="width: 100%;" value="Admissions Open for 2026/2027 Academic Term" placeholder="e.g. Cambridge & WASSCE Excellence - Register Today" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Call to Action Label
              </label>
              <input type="text" id="promo-cta-input" class="form-input" style="width: 100%;" value="Apply for Admission Now" placeholder="e.g. Apply Now, Book Tour, Enrol Today" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Target URL (Destination)
              </label>
              <input type="text" id="promo-target-input" class="form-input" style="width: 100%;" value="/school/${school.id}" placeholder="e.g. /school/${school.id} or https://your-school.edu.gh" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Banner Image Asset
              </label>
              <select id="promo-banner-select" class="form-input" style="width: 100%;">
                <option value="/assets/images/campus_hero.webp">Campus Main Quad (/assets/images/campus_hero.webp)</option>
                <option value="/assets/images/science_lab.webp">Ultra-Modern Science Lab (/assets/images/science_lab.webp)</option>
                <option value="/assets/images/sports_complex.webp">Olympic Sports Complex (/assets/images/sports_complex.webp)</option>
              </select>
            </div>
          </div>

          <div style="background: #f8fafc; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <span style="font-size: 0.85rem; color: #475569;">Paystack Mobile Money & Card Processing:</span>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0A2046;" id="promo-checkout-summary">
                Package: 14 Days Premium &bull; Total: GH₵ 135.00
              </div>
            </div>
            <button id="btn-submit-promo-campaign" class="btn-pill btn-primary" style="font-weight: 800; padding: 0.75rem 1.75rem; background: #0A2046;">
              Pay with Paystack & Launch Campaign
            </button>
          </div>
        </div>

        <!-- Campaigns Table -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-weight: 800; color: #0A2046; margin: 0;">Campaigns Management Ledger</h3>
            <span style="font-size: 0.82rem; color: #64748b;">${campaigns.length} campaigns recorded</span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.75rem 1rem;">Campaign Ref</th>
                  <th style="padding: 0.75rem 1rem;">Placement & Headline</th>
                  <th style="padding: 0.75rem 1rem;">Package</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem;">Impressions</th>
                  <th style="padding: 0.75rem 1rem;">Clicks</th>
                  <th style="padding: 0.75rem 1rem;">CTR</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${campaigns.length === 0 ? `
                  <tr>
                    <td colspan="8" style="padding: 2.5rem 1rem; text-align: center; color: #64748b;">
                      No promotions created yet. Launch your first campaign above to boost campus discovery!
                    </td>
                  </tr>
                ` : campaigns.map(c => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046; font-family: monospace;">
                      ${c.id}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="font-weight: 700; color: #0A2046;">${c.headline || 'Sponsored School Feature'}</div>
                      <div style="font-size: 0.74rem; color: #64748b; text-transform: uppercase;">Placement: ${c.placement}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem; font-weight: 600; color: #0A2046;">
                      ${c.packageName || (c.packageId === 'spotlight_7d' ? '7 Days' : c.packageId === 'supreme_30d' ? '30 Days' : '14 Days')}
                      <div style="font-size: 0.75rem; color: #64748b;">GH₵ ${c.priceGhs}</div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      ${c.status === 'active' ? `
                        <span class="owner-nav-badge" style="background: #dcfce7; color: #15803d;">● Active Live</span>
                      ` : c.status === 'pending_payment' ? `
                        <span class="owner-nav-badge" style="background: #fef3c7; color: #b45309;">⏳ Pending Payment</span>
                      ` : `
                        <span class="owner-nav-badge" style="background: #f1f5f9; color: #64748b;">Completed</span>
                      `}
                    </td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0ea5e9;">${(c.impressions || 0).toLocaleString()}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #10b981;">${(c.clicks || 0).toLocaleString()}</td>
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #8b5cf6;">${c.ctr || (((c.clicks || 0) / (c.impressions || 1)) * 100).toFixed(2)}%</td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      ${c.status === 'pending_payment' ? `
                        <button class="btn-pill btn-primary btn-pay-pending-promo" data-campaign-id="${c.id}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">
                          Pay GH₵ ${c.priceGhs}
                        </button>
                      ` : `
                        <button class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;" onclick="App.navigate('directory');">
                          View Live ↗
                        </button>
                      `}
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
   * TAB 12: Event Webhooks & Multi-Channel Automated Alerts (Expansions)
   */
  renderWebhooksTab(school, expansions = {}) {
    const webhooks = expansions.webhooks || [];
    const deliveries = expansions.deliveries || [];
    const prefs = expansions.notificationPreferences || { whatsapp: true, sms: true, email: true, webhook: false };
    const primaryWebhook = webhooks[0] || {
      targetUrl: 'https://n8n.gis.edu.gh/webhook/skoolfinder-events',
      events: ['ParentEnquirySubmitted', 'AdmissionOfferIssued', 'TenderPublished', 'PaymentVerified'],
      secret: 'whsec_gh_9a8b7c6d5e4f3a2b1c0d',
      active: true
    };

    return `
      <div>
        <!-- Webhooks Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 800; color: #06b6d4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              Real-time Event Integrations & Webhooks
            </div>
            <h2 style="font-size: 1.85rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
              Event Webhooks & Multi-Channel Alerts
            </h2>
            <p style="color: #64748b; font-size: 0.95rem; margin: 0; max-width: 750px;">
              Stream high-value school events (Parent Enquiries, Admissions Offers, Vendor Tenders, Fee Payments) to your School ERP, n8n, WhatsApp Cloud API, and Hubtel SMS.
            </p>
          </div>
          <button id="btn-test-webhook-ping" class="btn-pill btn-outline" style="font-weight: 800; padding: 0.65rem 1.4rem; border-color: #06b6d4; color: #0891b2;">
            Send Test Ping Event
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; margin-bottom: 2rem;">
          <!-- Outbound Webhook Subscriptions -->
          <div class="owner-card">
            ${primaryWebhook.disabled_reason || (!primaryWebhook.is_active && primaryWebhook.disabled_reason) ? `
              <div style="background: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <div>
                  <div style="font-weight: 800; color: #991b1b; font-size: 0.85rem;">⚠️ Circuit Breaker Tripped (Suspended)</div>
                  <div style="font-size: 0.76rem; color: #b91c1c;">${primaryWebhook.disabled_reason}</div>
                </div>
                <button id="btn-reset-circuit-breaker" class="btn-pill" data-sub-id="${primaryWebhook.id || ''}" style="background: #dc2626; color: #fff; font-size: 0.75rem; padding: 0.35rem 0.85rem; font-weight: 700; border: none; cursor: pointer;">
                  Reset Circuit Breaker
                </button>
              </div>
            ` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
              <h3 style="font-weight: 800; color: #0A2046; margin: 0;">Outbound Webhook (n8n / ERP / Zapier)</h3>
              <span class="owner-nav-badge" style="background: #dcfce7; color: #15803d;">HMAC SHA-256</span>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Target Payload Endpoint URL
              </label>
              <input type="url" id="webhook-target-url" class="form-input" style="width: 100%; font-family: monospace;" value="${primaryWebhook.targetUrl || ''}" placeholder="https://your-domain.edu.gh/api/webhook" />
              <div style="font-size: 0.74rem; color: #64748b; margin-top: 0.25rem;">
                SkoolFinder will dispatch POST requests with an <code>X-SkoolFinder-Signature</code> header.
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                HMAC SHA-256 Secret Key
              </label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="webhook-secret-display" class="form-input" style="flex: 1; font-family: monospace; font-size: 0.8rem; background: #f8fafc;" value="${primaryWebhook.secret || 'whsec_gh_' + Math.random().toString(36).substring(2)}" readonly />
                <button id="btn-copy-webhook-secret" class="btn-pill btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.75rem;">
                  Copy
                </button>
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
                Subscribed Domain Events
              </label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.84rem; color: #334155;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" class="webhook-event-checkbox" value="ParentEnquirySubmitted" checked />
                  <span><strong>ParentEnquirySubmitted:</strong> Instant prospective parent lead dispatch</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" class="webhook-event-checkbox" value="AdmissionOfferIssued" checked />
                  <span><strong>AdmissionOfferIssued:</strong> Sync accepted offers to school SIS</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" class="webhook-event-checkbox" value="TenderPublished" checked />
                  <span><strong>TenderPublished:</strong> Alert procurement officers and suppliers</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" class="webhook-event-checkbox" value="PaymentVerified" checked />
                  <span><strong>PaymentVerified:</strong> Real-time reconciliation of fees and admissions</span>
                </label>
              </div>
            </div>

            <button id="btn-save-webhook-subscription" class="btn-pill btn-primary" style="width: 100%; font-weight: 800;">
              Save Webhook Endpoint Configuration
            </button>
          </div>

          <!-- Omnichannel Notification Preferences -->
          <div class="owner-card">
            <h3 style="font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Omnichannel Automated Alert Channels</h3>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0 0 1.25rem 0;">
              Configure direct delivery channels for admissions notifications and critical alerts.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <!-- WhatsApp Channel -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">💬</span>
                    <strong>WhatsApp Cloud API</strong>
                  </div>
                  <input type="checkbox" id="pref-whatsapp-toggle" ${prefs.whatsapp ? 'checked' : ''} style="width: 18px; height: 18px;" />
                </div>
                <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 0.5rem;">
                  Sends formatted admission notifications & parent updates directly to WhatsApp.
                </div>
                <input type="text" id="pref-whatsapp-number" class="form-input" style="width: 100%; font-size: 0.85rem;" value="${school.whatsapp || '+233 24 111 2222'}" placeholder="+233 24 XXX XXXX" />
              </div>

              <!-- SMS Channel -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">📡</span>
                    <strong>Hubtel Ghana SMS Gateway</strong>
                  </div>
                  <input type="checkbox" id="pref-sms-toggle" ${prefs.sms ? 'checked' : ''} style="width: 18px; height: 18px;" />
                </div>
                <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 0.5rem;">
                  Official SMS alerts branded with sender ID <code>SKOOLFINDER</code> at GH₵ 0.045/SMS.
                </div>
                <input type="text" id="pref-sms-number" class="form-input" style="width: 100%; font-size: 0.85rem;" value="${school.phone || '+233 24 555 1212'}" placeholder="+233 24 XXX XXXX" />
              </div>

              <!-- Transactional Email -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.25rem;">📧</span>
                    <strong>Transactional Email Alerts</strong>
                  </div>
                  <input type="checkbox" id="pref-email-toggle" ${prefs.email ? 'checked' : ''} style="width: 18px; height: 18px;" />
                </div>
                <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 0.5rem;">
                  Detailed PDF applications & admissions dossiers delivered to school administration inbox.
                </div>
                <input type="email" id="pref-email-address" class="form-input" style="width: 100%; font-size: 0.85rem;" value="admin@gis.edu.gh" placeholder="admissions@school.edu.gh" />
              </div>

              <button id="btn-save-notif-prefs" class="btn-pill btn-outline" style="width: 100%; font-weight: 700;">
                Save Alert Channel Preferences
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Webhook Delivery Logs Table -->
        <div class="owner-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-weight: 800; color: #0A2046; margin: 0;">Recent Webhook Delivery Audit Logs</h3>
            <span style="font-size: 0.82rem; color: #64748b;">${deliveries.length} audit transmissions</span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
              <thead>
                <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">
                  <th style="padding: 0.75rem 1rem;">Event Type</th>
                  <th style="padding: 0.75rem 1rem;">Target Endpoint</th>
                  <th style="padding: 0.75rem 1rem;">Status</th>
                  <th style="padding: 0.75rem 1rem;">HMAC SHA-256 Signature</th>
                  <th style="padding: 0.75rem 1rem;">Timestamp</th>
                  <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${deliveries.length === 0 ? `
                  <tr>
                    <td colspan="6" style="padding: 2.5rem 1rem; text-align: center; color: #64748b;">
                      No webhook deliveries yet. Click "Send Test Ping Event" above to verify endpoint delivery.
                    </td>
                  </tr>
                ` : deliveries.map(d => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0A2046;">
                      ${d.event || d.event_type || 'AdmissionOfferIssued'}
                    </td>
                    <td style="padding: 0.85rem 1rem; font-family: monospace; font-size: 0.8rem; color: #475569;">
                      ${d.targetUrl || d.target_url || 'https://n8n.gis.edu.gh/webhook/skoolfinder-events'}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      ${(d.delivery_status === 'delivered' || (d.http_status >= 200 && d.http_status < 300) || d.response_http_status === 200) ? `
                        <span class="owner-nav-badge" style="background: #dcfce7; color: #15803d;">
                          ✓ ${d.response_http_status || d.http_status || 200} OK Delivered
                        </span>
                      ` : d.delivery_status === 'retrying' ? `
                        <span class="owner-nav-badge" style="background: #fef3c7; color: #b45309;">
                          ⏳ Retrying (${d.attempts || 1}/3)
                        </span>
                      ` : `
                        <span class="owner-nav-badge" style="background: #fee2e2; color: #b91c1c;">
                          ✗ ${d.response_http_status || d.http_status || 'Failed'}
                        </span>
                      `}
                    </td>
                    <td style="padding: 0.85rem 1rem; font-family: monospace; font-size: 0.75rem; color: #64748b;">
                      ${(d.signature || 'sha256=5e44459b88e6...').substring(0, 22)}...
                    </td>
                    <td style="padding: 0.85rem 1rem; color: #64748b; font-size: 0.8rem;">
                      ${new Date(d.dispatchedAt || d.dispatched_at || Date.now()).toLocaleTimeString()}
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      ${(d.delivery_status === 'failed' || d.delivery_status === 'retrying') && d.id ? `
                        <button class="btn-redeliver-webhook btn-pill btn-outline" data-delivery-id="${d.id}" style="padding: 0.25rem 0.65rem; font-size: 0.72rem; border-color: #06b6d4; color: #0891b2; cursor: pointer;">
                          🔄 Retry
                        </button>
                      ` : `
                        <span style="color: #94a3b8; font-size: 0.75rem;">—</span>
                      `}
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
   * Attach Interactive Event Listeners
   */
  attachEvents(schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6') {
    // 1. Demo Mode Launcher
    document.getElementById('btn-launch-demo-os')?.addEventListener('click', async () => {
      this.isDemoMode = true;
      try {
        const demoRes = await fetch('/api/auth/demo-login', { method: 'POST' });
        const data = await demoRes.json();
        if (data.token) {
          State.authToken = data.token;
          State.user = data.user;
          localStorage.setItem('skoolfinder_token', data.token);
          localStorage.setItem('skoolfinder_user', JSON.stringify(data.user));
        }
      } catch (e) {}
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

    // 4a. Accordion Category Toggles
    document.querySelectorAll('[data-category-toggle]').forEach(toggleBtn => {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const catId = toggleBtn.dataset.categoryToggle;
        const catEl = toggleBtn.closest('.owner-nav-category');
        if (!catEl) return;

        const isExpanded = catEl.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

        // Persist to localStorage
        try {
          let expanded = [];
          const raw = localStorage.getItem('skoolfinder_owner_sidebar_expanded');
          if (raw) expanded = JSON.parse(raw);
          if (!Array.isArray(expanded)) expanded = [];

          if (isExpanded) {
            if (!expanded.includes(catId)) expanded.push(catId);
          } else {
            expanded = expanded.filter(id => id !== catId);
          }
          localStorage.setItem('skoolfinder_owner_sidebar_expanded', JSON.stringify(expanded));
        } catch (err) {
          console.warn('Could not persist sidebar state:', err);
        }
      };
    });

    // 4b. Tab Navigation Switches (Submenu Items)
    document.querySelectorAll('[data-owner-tab]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const tab = btn.dataset.ownerTab;
        this.activeTab = tab;

        // Ensure parent category is expanded and saved in localStorage
        const parentCat = this.getCategoryForTab(tab);
        try {
          let expanded = [];
          const raw = localStorage.getItem('skoolfinder_owner_sidebar_expanded');
          if (raw) expanded = JSON.parse(raw);
          if (!Array.isArray(expanded)) expanded = [];
          if (parentCat && !expanded.includes(parentCat)) {
            expanded.push(parentCat);
            localStorage.setItem('skoolfinder_owner_sidebar_expanded', JSON.stringify(expanded));
          }
        } catch (e) {}

        // Close mobile drawer if open
        document.getElementById('owner-proprietor-sidebar')?.classList.remove('open');
        document.getElementById('owner-sidebar-backdrop')?.classList.remove('visible');

        App.navigate('schools');
      };
    });

    // 4c. Mobile Sidebar Drawer & Backdrop Handlers
    const mobileToggle = document.getElementById('btn-toggle-owner-sidebar');
    const mobileBackdrop = document.getElementById('owner-sidebar-backdrop');
    const sidebar = document.getElementById('owner-proprietor-sidebar');

    if (mobileToggle && sidebar) {
      mobileToggle.onclick = () => {
        sidebar.classList.toggle('open');
        mobileBackdrop?.classList.toggle('visible');
      };
    }
    if (mobileBackdrop && sidebar) {
      mobileBackdrop.onclick = () => {
        sidebar.classList.remove('open');
        mobileBackdrop.classList.remove('visible');
      };
    }

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

    // ========================================================================
    // PHASE 2A: ADMISSIONS & SUBSCRIPTION INTERACTIVE HANDLERS
    // ========================================================================

    // 11. Billing Interval Toggle (SUB-002: 16.67% Annual Discount)
    let currentInterval = 'monthly';
    const btnMonthly = document.getElementById('btn-interval-monthly');
    const btnAnnual = document.getElementById('btn-interval-annual');

    const updateIntervalDisplay = (interval) => {
      currentInterval = interval;
      if (interval === 'annual') {
        if (btnAnnual) {
          btnAnnual.style.background = '#0A2046';
          btnAnnual.style.color = '#fff';
          btnAnnual.style.fontWeight = '800';
        }
        if (btnMonthly) {
          btnMonthly.style.background = 'transparent';
          btnMonthly.style.color = '#475569';
          btnMonthly.style.fontWeight = '700';
        }
        document.querySelectorAll('.plan-price-val').forEach(el => {
          el.textContent = `GH₵ ${Number(el.dataset.annual).toLocaleString()}`;
        });
        document.querySelectorAll('.plan-interval-label').forEach(el => {
          el.textContent = ' / year (16.67% OFF)';
        });
      } else {
        if (btnMonthly) {
          btnMonthly.style.background = '#0A2046';
          btnMonthly.style.color = '#fff';
          btnMonthly.style.fontWeight = '800';
        }
        if (btnAnnual) {
          btnAnnual.style.background = 'transparent';
          btnAnnual.style.color = '#475569';
          btnAnnual.style.fontWeight = '700';
        }
        document.querySelectorAll('.plan-price-val').forEach(el => {
          el.textContent = `GH₵ ${el.dataset.monthly}`;
        });
        document.querySelectorAll('.plan-interval-label').forEach(el => {
          el.textContent = ' / mo';
        });
      }
    };

    btnMonthly?.addEventListener('click', () => updateIntervalDisplay('monthly'));
    btnAnnual?.addEventListener('click', () => updateIntervalDisplay('annual'));

    // 12. Plan Checkout Trigger (SUB-003, SUB-004: Paystack MoMo / Card)
    document.querySelectorAll('.btn-select-tier').forEach(btn => {
      btn.onclick = async () => {
        const tier = btn.dataset.tier;
        const confirmMsg = `Initialize Paystack checkout for ${tier.toUpperCase()} (${currentInterval.toUpperCase()})?\n\nSupports MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard.`;
        if (!confirm(confirmMsg)) return;

        try {
          const initRes = await API.initializeSubscriptionCheckout(schoolId, {
            tier,
            interval: currentInterval,
            email: 'proprietor@skoolfinder.com.gh',
            momoNetwork: 'mtn'
          });

          // Simulate Paystack payment verification
          const verifyRes = await API.verifySubscriptionPayment(schoolId, {
            reference: initRes.checkout?.reference || `SF-SUB-${Date.now()}`,
            tier,
            interval: currentInterval,
            channel: 'mobile_money'
          });

          State.showToast(`🎉 Upgraded to ${tier.toUpperCase()} plan! Invoice ${verifyRes.invoice?.invoice_number} generated.`, 'success');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Checkout failed', 'error');
        }
      };
    });

    // 13. Safe Non-Destructive Downgrade (SUB-007)
    document.querySelectorAll('.btn-downgrade-plan').forEach(btn => {
      btn.onclick = async () => {
        const targetTier = btn.dataset.tier || 'free';
        if (!confirm('Downgrade to Free Starter tier?\n\nHistorical applications, leads and school data will remain intact and will not be deleted.')) return;
        try {
          await API.downgradeSubscription(schoolId, targetTier);
          State.showToast('Subscription set to Free Starter. Historical data preserved.', 'info');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Downgrade failed', 'error');
        }
      };
    });

    // 14. View Receipt Notice (SUB-009)
    document.querySelectorAll('.btn-view-receipt').forEach(btn => {
      btn.onclick = () => {
        const num = btn.dataset.invNum;
        const amount = btn.dataset.amount;
        alert(`SKOOLFINDER GHANA OFFICIAL RECEIPT\nInvoice: ${num}\nAmount Paid: GH₵ ${Number(amount).toLocaleString()}\nChannel: Paystack Mobile Money\nStatus: Settled & Reconciled\n\nAll records stored tamper-evident.`);
      };
    });

    // 15. Admissions State Transition (ADM-007)
    document.querySelectorAll('.select-app-transition').forEach(sel => {
      sel.onchange = async () => {
        const appId = sel.dataset.appId;
        const newStatus = sel.value;
        if (!newStatus) return;

        try {
          await API.transitionApplicationStatus(schoolId, appId, {
            newStatus,
            note: `State updated to ${newStatus.replace(/_/g, ' ')} via dashboard.`
          });
          State.showToast(`Application transitioned to ${newStatus.replace(/_/g, ' ')}`, 'success');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Transition rejected by state machine', 'error');
          sel.value = '';
        }
      };
    });

    // 16. Confirm Enrolment (DEC-03: No SIS Dependency)
    document.querySelectorAll('.btn-confirm-enrolment').forEach(btn => {
      btn.onclick = async () => {
        const appId = btn.dataset.appId;
        if (!confirm('Confirm enrolment for this candidate? This will update their admission status to Enrolled.')) return;
        try {
          await API.transitionApplicationStatus(schoolId, appId, {
            newStatus: 'enrolled',
            note: 'Enrolment voucher confirmed by admissions office.'
          });
          State.showToast('🎉 Candidate enrolled! Intake class capacity updated.', 'success');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Enrolment confirmation failed', 'error');
        }
      };
    });

    // 17. Open Enquiry Thread Modal / Drawer (ENQ-004)
    document.querySelectorAll('.btn-open-enquiry-thread').forEach(btn => {
      btn.onclick = async () => {
        const enquiryId = btn.dataset.enquiryId;
        const parentName = btn.dataset.parentName;
        try {
          const res = await API.getEnquiryThread(schoolId, enquiryId);
          const messages = res.messages || [];
          const threadHtml = messages.map(m => `
            <div style="margin-bottom: 0.75rem; padding: 0.75rem; border-radius: 8px; background: ${m.is_internal_note ? '#fef3c7; border: 1px dashed #d97706;' : (m.sender_type === 'parent' ? '#f1f5f9' : '#eff6ff')};">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
                <strong>${m.sender_name} ${m.is_internal_note ? '(Internal Staff Note)' : ''}</strong>
                <span style="color: #64748b;">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div style="font-size: 0.85rem; color: #1e293b;">${m.message}</div>
            </div>
          `).join('');

          const replyText = prompt(`CONVERSATION THREAD: ${parentName}\n\n${messages.map(m => `${m.sender_name}: ${m.message}`).join('\n')}\n\nEnter your response (or type [NOTE] at the start for internal note):`);
          if (replyText && replyText.trim()) {
            const isNote = replyText.startsWith('[NOTE]');
            const cleanText = isNote ? replyText.replace('[NOTE]', '').trim() : replyText.trim();
            await API.replyToEnquiry(schoolId, enquiryId, {
              message: cleanText,
              senderName: 'Admissions Officer',
              isInternalNote: isNote
            });
            State.showToast(isNote ? 'Internal staff note saved.' : 'Reply delivered to parent!', 'success');
            App.navigate('schools');
          }
        } catch (err) {
          State.showToast(err.message || 'Failed to open enquiry thread', 'error');
        }
      };
    });

    // 18. Quick Schedule Tour Slot (ADM-008)
    document.getElementById('btn-open-tour-modal')?.addEventListener('click', async () => {
      const date = prompt('Enter campus tour or entrance assessment date (YYYY-MM-DD):', '2026-11-20');
      if (!date) return;
      const title = prompt('Session Title:', 'Weekly Guided Campus Walkthrough & STEM Lab Tour');
      try {
        await API.createSchoolTourSlot(schoolId, {
          title: title || 'Guided Walkthrough',
          slotDate: date,
          slotTime: '10:00 AM',
          venue: 'Main Administration Block',
          capacity: 15
        });
        State.showToast('New walkthrough timeslot added to public calendar!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to create tour slot', 'error');
      }
    });

    // ========================================================================
    // PACKAGE E: LEAD ATTRIBUTION & WHATSAPP INTELLIGENCE EVENT LISTENERS
    // ========================================================================

    // 1. Channel Filter Tabs
    document.querySelectorAll('#leads-channel-filters .lead-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#leads-channel-filters .lead-filter-btn').forEach(b => {
          b.style.background = 'transparent';
          b.style.color = '#64748b';
          b.classList.remove('active');
        });
        btn.style.background = '#ffffff';
        btn.style.color = '#0A2046';
        btn.classList.add('active');
        const channel = btn.dataset.channel;
        document.querySelectorAll('#table-school-leads .lead-row').forEach(row => {
          if (channel === 'all' || row.dataset.channel === channel) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // 2. Search input for parent leads
    const inputSearchLeads = document.getElementById('input-search-leads');
    if (inputSearchLeads) {
      inputSearchLeads.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll('#table-school-leads .lead-row').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }

    // 3. Lead Status updater dropdown
    document.querySelectorAll('.lead-status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const leadId = select.dataset.leadId;
        const newStatus = e.target.value;
        try {
          await API.updateSchoolLeadStatus(schoolId, leadId, { status: newStatus });
          State.showToast(`✓ Lead status updated to ${newStatus.toUpperCase()}!`, 'success');
        } catch (err) {
          State.showToast(err.message || 'Failed to update lead status', 'error');
        }
      });
    });

        // ========================================================================
    // PACKAGE F: ADMISSIONS VOUCHERS EVENT LISTENERS
    // ========================================================================

    // 1. Redeem Voucher Modal Trigger
    document.getElementById("btn-open-redeem-modal")?.addEventListener("click", () => {
      Modals.openRedeemVoucherModal(schoolId, async () => {
        DashboardView._cachedVouchersData = await API.getSchoolVouchers(schoolId);
        DashboardView.activeTab = "vouchers";
        App.navigate("schools");
      });
    });

    // 2. Export Vouchers CSV (with Entitlement Guard)
    document.getElementById("btn-export-vouchers-csv")?.addEventListener("click", async () => {
      if (this._cachedSubscription && this._cachedSubscription.tier === "free") {
        State.showToast("Bursar CSV reconciliation export requires Growth or Pro plan (DEC-01 & Section 26). Upgrade to download.", "warning");
        App.navigate("pricing", "schools");
        return;
      }
      try {
        const csvText = await API.exportSchoolVouchers(schoolId);
        const blob = new Blob([csvText], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `skoolfinder-vouchers-${schoolId}-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        State.showToast("✓ Admissions vouchers ledger exported to CSV successfully!", "success");
      } catch (err) {
        State.showToast(err.message || "Failed to export vouchers", "error");
      }
    });

    // 3. Status Filter Buttons
    document.querySelectorAll(".voucher-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".voucher-filter-btn").forEach(b => {
          b.style.background = "#f1f5f9";
          b.style.color = "#475569";
          b.style.border = "1px solid #cbd5e1";
          b.classList.remove("active");
        });
        btn.style.background = "#0A2046";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        document.querySelectorAll("#table-school-vouchers .voucher-ledger-row").forEach(row => {
          if (filter === "all" || row.dataset.status === filter) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });
    });

    // 4. Search input for vouchers
    document.getElementById("input-search-vouchers")?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll("#table-school-vouchers .voucher-ledger-row").forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = (!q || text.includes(q)) ? "" : "none";
      });
    });

    // 5. PIN Reveal Toggle
    document.querySelectorAll(".voucher-pin-display").forEach(el => {
      el.addEventListener("click", () => {
        const pin = el.dataset.pin;
        if (el.textContent.trim() === "••••") {
          el.textContent = pin;
        } else {
          el.textContent = "••••";
        }
      });
    });

    // 6. Quick Redeem on Row
    document.querySelectorAll(".btn-quick-redeem-row").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.dataset.code;
        const pin = btn.dataset.pin;
        Modals.openRedeemVoucherModal(schoolId, async () => {
          DashboardView._cachedVouchersData = await API.getSchoolVouchers(schoolId);
          DashboardView.activeTab = "vouchers";
          App.navigate("schools");
        });
        setTimeout(() => {
          const inputCode = document.getElementById("redeem-input-code");
          const inputPin = document.getElementById("redeem-input-pin");
          if (inputCode) inputCode.value = code;
          if (inputPin) inputPin.value = pin;
        }, 100);
      });
    });

    // 7. View Voucher Certificate
    document.querySelectorAll(".btn-view-voucher-cert").forEach(btn => {
      btn.addEventListener("click", async () => {
        const code = btn.dataset.code;
        try {
          const res = await API.getVoucherDetails(code);
          Modals.openVoucherReceiptModal(res.voucher);
        } catch (e) {
          const v = DashboardView._cachedVouchersData?.vouchers?.find(item => item.voucher_code === code);
          Modals.openVoucherReceiptModal(v || { voucher_code: code });
        }
      });
    });

    // 4. Export Leads CSV Action (with Entitlement Guard)
    const btnExportLeads = document.getElementById('btn-export-leads-csv');
    if (btnExportLeads) {
      btnExportLeads.addEventListener('click', async () => {
        if (this._cachedSubscription && this._cachedSubscription.tier === 'free') {
          State.showToast('CSV Lead Export requires Growth or Pro tier (DEC-01 & Section 26). Upgrade to download.', 'warning');
          App.navigate('pricing', 'schools');
          return;
        }
        try {
          const csvText = await API.exportSchoolLeads(schoolId);
          const blob = new Blob([csvText], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `skoolfinder-leads-${schoolId}-${Date.now()}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          State.showToast('✓ School leads exported to CSV successfully!', 'success');
        } catch (err) {
          State.showToast(err.message || 'Failed to export leads', 'error');
        }
      });
    }

    // ========================================================================
    // PACKAGE B: CAMPUS TOUR SCHEDULING & CONFIRMATION EVENT LISTENERS
    // ========================================================================

    // 1. Add Campus Walkthrough Slot Button
    document.getElementById('btn-create-tour-slot')?.addEventListener('click', () => {
      if (this._cachedSubscription && this._cachedSubscription.tier === 'free') {
        State.showToast('Campus Tour Scheduling requires the Growth Plan (GH₵99/mo). Please upgrade to unlock.', 'warning');
        App.navigate('pricing', 'schools');
        return;
      }
      Modals.openCreateTourSlotModal(schoolId, () => App.navigate('schools', 'inquiries'), 'tour');
    });

    // 2. Schedule Public Open Day Button
    document.getElementById('btn-create-open-day')?.addEventListener('click', () => {
      if (this._cachedSubscription && this._cachedSubscription.tier === 'free') {
        State.showToast('Public Open Day publishing requires the Growth Plan (GH₵99/mo). Please upgrade to unlock.', 'warning');
        App.navigate('pricing', 'schools');
        return;
      }
      Modals.openCreateTourSlotModal(schoolId, () => App.navigate('schools', 'inquiries'), 'open_day');
    });

    // 3. Tour Status Filter Buttons
    document.querySelectorAll('.tour-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tour-filter-btn').forEach(b => {
          b.style.background = 'transparent';
          b.style.color = '#64748b';
          b.classList.remove('active');
        });
        btn.style.background = '#ffffff';
        btn.style.color = '#0A2046';
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.tour-row').forEach(row => {
          if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // 4. Confirm Tour Booking Action
    document.querySelectorAll('.btn-confirm-tour').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookingId = btn.dataset.bookingId;
        const slotId = btn.dataset.slotId;
        const booking = (this._cachedTourBookings || []).find(b => b.bookingId === bookingId) || {
          bookingId,
          slotId,
          parentName: 'Prospective Parent',
          parentPhone: '+233 24 000 0000',
          childGrade: 'General Admission',
          slotDate: '2026-11-20',
          slotTime: '10:00 AM',
          venue: 'Main Administration Reception'
        };
        Modals.openConfirmTourBookingModal(booking, school, () => App.navigate('schools', 'inquiries'));
      });
    });

    // 5. Reschedule Tour Booking Action
    document.querySelectorAll('.btn-reschedule-tour').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookingId = btn.dataset.bookingId;
        const slotId = btn.dataset.slotId;
        const booking = (this._cachedTourBookings || []).find(b => b.bookingId === bookingId) || {
          bookingId,
          slotId,
          parentName: 'Prospective Parent',
          childGrade: 'General Admission',
          slotDate: '2026-11-20',
          slotTime: '10:00 AM'
        };
        Modals.openRescheduleTourModal(booking, school, () => App.navigate('schools', 'inquiries'));
      });
    });

    // 6. Complete Tour Booking Action
    document.querySelectorAll('.btn-complete-tour').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bookingId = btn.dataset.bookingId;
        const slotId = btn.dataset.slotId;
        try {
          await API.updateSchoolTourBooking(schoolId, slotId, bookingId, { status: 'completed' });
          State.showToast('✓ Campus visit marked as completed!', 'success');
          App.navigate('schools', 'inquiries');
        } catch (err) {
          State.showToast(err.message || 'Failed to update tour status', 'error');
        }
      });
    });

    // 7. Cancel Tour Booking Action
    document.querySelectorAll('.btn-cancel-tour').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bookingId = btn.dataset.bookingId;
        const slotId = btn.dataset.slotId;
        if (!confirm('Are you sure you want to cancel this campus tour booking? The family will be notified.')) return;
        try {
          await API.updateSchoolTourBooking(schoolId, slotId, bookingId, { status: 'cancelled' });
          State.showToast('Tour booking cancelled.', 'info');
          App.navigate('schools', 'inquiries');
        } catch (err) {
          State.showToast(err.message || 'Failed to cancel tour', 'error');
        }
      });
    });

    // 8. Delete Tour Slot Action
    document.querySelectorAll('.btn-delete-slot').forEach(btn => {
      btn.addEventListener('click', async () => {
        const slotId = btn.dataset.slotId;
        if (!confirm('Cancel and delete this campus walkthrough session?')) return;
        try {
          await API.deleteSchoolTourSlot(schoolId, slotId);
          State.showToast('Tour session cancelled and removed.', 'success');
          App.navigate('schools', 'inquiries');
        } catch (err) {
          State.showToast(err.message || 'Failed to delete slot', 'error');
        }
      });
    });

    // ========================================================================
    // PHASE 2B: TEACHER VACANCIES & RECRUITING EVENT LISTENERS (VAC-001 - VAC-006)
    // ========================================================================

    // 1. Post Vacancy Dialog
    const handlePostVacancy = async () => {
      const title = prompt('Enter Job Title / Subject Teacher:', 'Senior High School Mathematics Teacher');
      if (!title) return;
      const department = prompt('Department (e.g. Mathematics, Science, Early Years):', 'Mathematics') || 'Academics';
      const level = prompt('Level (e.g. Primary, JHS, SHS, Cambridge):', 'SHS') || 'SHS';
      const curriculum = prompt('Curriculum (GES / NaCCA, British Cambridge, IB):', 'GES / NaCCA') || 'GES / NaCCA';
      const salaryRange = prompt('Salary Range in GHS:', 'GH₵ 3,000 - 4,500 / month') || 'GH₵ 3,000 - 4,500 / month';

      try {
        await API.createSchoolVacancy(schoolId, {
          title,
          department,
          level,
          curriculum,
          salaryRange,
          minExperienceYears: 2,
          minQualification: 'B.Ed in Mathematics / Post-Graduate Diploma',
          description: `Passionate educator sought for ${level} ${department} department.`,
          ntcRequired: true,
          status: 'published'
        });
        State.showToast('Teacher vacancy published successfully! Synced to /jobs & Teachers Portal.', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to post vacancy', 'error');
      }
    };
    document.getElementById('btn-open-post-vacancy')?.addEventListener('click', handlePostVacancy);
    document.querySelector('.btn-open-post-vacancy-empty')?.addEventListener('click', handlePostVacancy);

    // 2. Buy Add-on Vacancy Slot (Approved GH₵ 25 for 30 days) (VAC-002)
    document.getElementById('btn-buy-vacancy-slot')?.addEventListener('click', async () => {
      const confirmBuy = confirm('Purchase 1 additional active vacancy slot for GH₵ 25.00 valid for 30 days via Paystack MoMo?');
      if (!confirmBuy) return;
      try {
        const res = await API.purchaseVacancyAddonSlot(schoolId, { paymentMethod: 'momo' });
        State.showToast(`Active vacancy slot activated! Expires in 30 days.`, 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to purchase slot', 'error');
      }
    });

    // 3. Toggle Vacancy Status (VAC-003)
    document.querySelectorAll('.btn-toggle-vac-status').forEach(btn => {
      btn.onclick = async () => {
        const vacId = btn.dataset.vacId;
        const targetStatus = btn.dataset.targetStatus;
        try {
          await API.updateVacancyStatus(schoolId, vacId, targetStatus);
          State.showToast(`Vacancy marked as ${targetStatus.toUpperCase()}! Active slot quota updated.`, 'success');
          App.navigate('schools');
        } catch (err) {
          State.showToast(err.message || 'Failed to update vacancy status', 'error');
        }
      };
    });

    // 4. View Vacancy Applicants Dossiers (VAC-004, VAC-005)
    document.querySelectorAll('.btn-view-vacancy-apps').forEach(btn => {
      btn.onclick = async () => {
        const vacId = btn.dataset.vacId;
        const vacTitle = btn.dataset.vacTitle;
        const container = document.getElementById('vacancy-applicants-container');
        if (!container) return;

        try {
          const res = await API.getVacancyApplicants(schoolId, vacId);
          const applicants = res.applicants || [];

          container.style.display = 'block';
          container.scrollIntoView({ behavior: 'smooth' });
          container.innerHTML = `
            <div class="owner-card" style="border: 2px solid #1266C4; background: #ffffff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">
                    Candidate Applications Dossier
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0 0;">
                    ${vacTitle} &bull; ${applicants.length} Applicants
                  </h3>
                </div>
                <button id="btn-close-vac-apps" class="btn-pill btn-secondary" style="font-size: 0.75rem;">
                  ✕ Close Dossier View
                </button>
              </div>

              ${applicants.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: #94a3b8;">
                  No applications received yet for this vacancy.
                </div>
              ` : `
                <div style="display: grid; gap: 1rem;">
                  ${applicants.map(a => `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                        <div>
                          <div style="font-size: 1.05rem; font-weight: 800; color: #0A2046;">
                            ${a.full_name}
                          </div>
                          <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">
                            ✉️ ${a.email} &bull; 📞 ${a.phone} &bull; 🏫 Current: ${a.current_school || 'Private'}
                          </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                          <span class="badge ${a.ntc_verified ? 'badge-emerald' : 'badge-secondary'}" style="font-size: 0.75rem;">
                            ${a.ntc_verified ? `🛡️ NTC: ${a.ntc_number}` : '⚠️ NTC Unverified'}
                          </span>
                          <a href="${a.cv_url || '#'}" target="_blank" class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">
                            📄 View CV / Resume
                          </a>
                        </div>
                      </div>

                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0.75rem; font-size: 0.8rem;">
                        <div><strong style="color: #475569;">Qualification:</strong> ${a.qualification}</div>
                        <div><strong style="color: #475569;">Experience:</strong> ${a.years_experience} Years</div>
                        <div><strong style="color: #475569;">Expected Salary:</strong> ${a.expected_salary}</div>
                        <div><strong style="color: #475569;">Tracking Code:</strong> <code style="font-size: 0.75rem;">${a.tracking_ref || a.id.slice(0,8)}</code></div>
                      </div>

                      <!-- Stage Machine Selector (VAC-005 & OPTION C) -->
                      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                          <span style="font-size: 0.82rem; font-weight: 700; color: #0A2046;">Candidate Stage:</span>
                          <select class="form-control candidate-stage-select" data-app-id="${a.id}" data-vac-id="${vacId}" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.82rem; font-weight: 700;">
                            <option value="applied" ${a.status === 'applied' ? 'selected' : ''}>Applied (New)</option>
                            <option value="shortlisted" ${a.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="interview_scheduled" ${a.status === 'interview_scheduled' ? 'selected' : ''}>Interview Scheduled</option>
                            <option value="offered" ${a.status === 'offered' ? 'selected' : ''}>Job Offered</option>
                            <option value="accepted" ${a.status === 'accepted' ? 'selected' : ''}>Offer Accepted</option>
                            <option value="declined" ${a.status === 'declined' ? 'selected' : ''}>Offer Declined</option>
                            <option value="rejected" ${a.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                          </select>

                          <button class="btn-issue-candidate-offer" data-app-id="${a.id}" data-app-name="${a.full_name}" data-vac-id="${vacId}" style="padding: 0.3rem 0.75rem; font-size: 0.76rem; background: #eff6ff; color: #1266C4; border: 1.5px solid #bfdbfe; font-weight: 800; border-radius: 999px; cursor: pointer;">
                            📜 Issue Formal Offer Letter
                          </button>
                        </div>
                        <div style="font-size: 0.75rem; color: #64748b;">
                          Status updated: ${new Date(a.updated_at || a.created_at).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          `;

          // Close button
          document.getElementById('btn-close-vac-apps')?.addEventListener('click', () => {
            container.style.display = 'none';
          });

          // Stage change handler
          document.querySelectorAll('.candidate-stage-select').forEach(sel => {
            sel.onchange = async (e) => {
              const appId = sel.dataset.appId;
              const targetStatus = e.target.value;
              try {
                await API.updateVacancyApplicantStatus(schoolId, appId, { status: targetStatus });
                State.showToast(`Candidate stage updated to ${targetStatus.toUpperCase()}`, 'success');
              } catch (err) {
                State.showToast(err.message || 'Failed to update candidate stage', 'error');
              }
            };
          });

          // Issue Formal Offer Letter Button (OPTION C)
          document.querySelectorAll('.btn-issue-candidate-offer').forEach(offerBtn => {
            offerBtn.onclick = async () => {
              const appId = offerBtn.dataset.appId;
              const candidateName = offerBtn.dataset.appName;
              const vacId = offerBtn.dataset.vacId;

              const salary = prompt(`Enter gross monthly salary for ${candidateName} (GH₵):`, '3500');
              if (!salary) return;
              const startDate = prompt('Enter academic term start date (YYYY-MM-DD):', '2026-09-01');
              if (!startDate) return;

              try {
                offerBtn.disabled = true;
                offerBtn.innerText = 'Issuing...';
                const res = await API.generateTeacherOffer(schoolId, vacId, appId, {
                  grossSalaryGhs: Number(salary),
                  termStartDate: startDate
                });
                State.showToast(`✓ Official Offer Letter #${res.offerLetter.offerNumber} issued to ${candidateName}!`, 'success');
                App.navigate('schools');
              } catch (err) {
                State.showToast(err.message || 'Failed to issue offer letter', 'error');
                offerBtn.disabled = false;
                offerBtn.innerText = '📜 Issue Formal Offer Letter';
              }
            };
          });
        } catch (err) {
          State.showToast(err.message || 'Failed to load applicants', 'error');
        }
      };
    });

    // ========================================================================
    // PHASE 2B: B2B PROCUREMENT RFQS & MOMO ESCROW LISTENERS (TEN-001 - ESC-004)
    // ========================================================================

    // 1. Buy Tender Credits (Approved: 1 for GH₵ 45, 3 for GH₵ 120) (TEN-002)
    document.getElementById('btn-buy-tender-credits')?.addEventListener('click', async () => {
      const choice = prompt('Select credit package:\n1: 1 Single Tender Credit — GH₵ 45\n2: 3-Tender Credit Bundle — GH₵ 120 (Save GH₵ 15)', '2');
      if (!choice) return;
      const packType = choice === '1' ? 'single' : 'bundle_3';
      const cost = packType === 'single' ? 'GH₵ 45.00' : 'GH₵ 120.00';
      const confirmed = confirm(`Proceed to purchase ${packType === 'single' ? '1 Credit' : '3 Credits Bundle'} for ${cost} via Paystack MoMo?`);
      if (!confirmed) return;

      try {
        await API.purchaseTenderCredits(schoolId, { packType, paymentMethod: 'momo' });
        State.showToast(`Tender credits added to balance! You can now publish institutional RFQs.`, 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to purchase credits', 'error');
      }
    });

    // 2. Issue Procurement Tender Dialog (TEN-003)
    const handlePostTender = async () => {
      const title = prompt('Enter Tender Title / RFQ:', 'Supply of 200 Core Mathematics Textbooks');
      if (!title) return;
      const category = prompt('Category (Textbooks, IT & Computers, Food & Catering, Uniforms):', 'Textbooks & Stationery') || 'General Supplies';
      const quantity = prompt('Quantity / Scope:', '200 Copies (Term 1 Delivery)') || 'Term Requirement';
      const maxBudget = prompt('Estimated Budget Ceiling in GHS:', '15000') || '15000';

      try {
        await API.createSchoolTender(schoolId, {
          title,
          category,
          quantity,
          budgetMin: 5000,
          budgetMax: Number(maxBudget),
          deliveryLocation: 'Main Campus Administration Store',
          description: `Accredited suppliers sought for ${quantity} of ${title}.`,
          specifications: 'Official NaCCA curriculum approved editions only.'
        });
        State.showToast('Tender published to B2B Procurement Desk (/suppliers)!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to publish tender', 'error');
      }
    };
    document.getElementById('btn-open-post-tender')?.addEventListener('click', handlePostTender);
    document.querySelector('.btn-open-post-tender-empty')?.addEventListener('click', handlePostTender);

    // 3. View & Compare Supplier Bids Side-by-Side (TEN-005, TEN-006, ESC-001)
    document.querySelectorAll('.btn-view-tender-bids').forEach(btn => {
      btn.onclick = async () => {
        const tenderId = btn.dataset.tenderId;
        const tenderTitle = btn.dataset.tenderTitle;
        const container = document.getElementById('tender-workspace-container');
        if (!container) return;

        try {
          const res = await API.getTenderBids(schoolId, tenderId);
          const bids = res.bids || [];
          const tender = res.tender;

          container.style.display = 'block';
          container.scrollIntoView({ behavior: 'smooth' });
          container.innerHTML = `
            <div class="owner-card" style="border: 2px solid #0ea5e9; background: #ffffff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #0ea5e9; text-transform: uppercase;">
                    Side-by-Side Bids Comparison & 50/50 Escrow Award
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0 0;">
                    ${tenderTitle} &bull; ${bids.length} Competing Supplier Quotes
                  </h3>
                </div>
                <button id="btn-close-tender-workspace" class="btn-pill btn-secondary" style="font-size: 0.75rem;">
                  ✕ Close Bids Workspace
                </button>
              </div>

              ${bids.length === 0 ? `
                <div style="text-align: center; padding: 2.5rem; color: #94a3b8;">
                  No bids submitted yet for this tender. Verified suppliers on <strong>/suppliers</strong> are reviewing specifications.
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                  ${bids.map(b => `
                    <div style="background: #f8fafc; border: 2px solid ${b.status === 'awarded' ? '#10b981' : '#e2e8f0'}; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                      <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                          <div style="font-weight: 800; color: #0A2046; font-size: 1.05rem;">
                            ${b.supplier_name}
                          </div>
                          <span class="badge ${b.status === 'awarded' ? 'badge-emerald' : 'badge-secondary'}" style="font-size: 0.72rem;">
                            ${b.status.toUpperCase()}
                          </span>
                        </div>
                        <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 0.75rem;">
                          ⭐ ${b.supplier_rating || 4.8} / 5.0 &bull; 📞 ${b.supplier_phone} &bull; ✉️ ${b.supplier_email}
                        </div>

                        <!-- Price Tag -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; text-align: center;">
                          <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Quotation Total</div>
                          <div style="font-size: 1.5rem; font-weight: 800; color: #0A2046;">GH₵ ${Number(b.quote_amount).toLocaleString()}</div>
                          <div style="font-size: 0.72rem; color: #10b981; font-weight: 700; margin-top: 2px;">
                            50% Mobilization: GH₵ ${(b.quote_amount * 0.5).toLocaleString()}
                          </div>
                        </div>

                        <div style="font-size: 0.8rem; color: #334155; margin-bottom: 0.5rem;">
                          ⏱️ <strong>Delivery SLA:</strong> ${b.delivery_days_sla} Calendar Days
                        </div>
                        <div style="font-size: 0.8rem; color: #334155; margin-bottom: 0.5rem;">
                          🛡️ <strong>Warranty:</strong> ${b.warranty_terms}
                        </div>
                        <div style="font-size: 0.8rem; color: #334155; margin-bottom: 0.75rem;">
                          💳 <strong>Terms:</strong> 50% Mobilization / 50% on Inspection
                        </div>
                        ${b.proposal_notes ? `
                          <div style="font-size: 0.78rem; color: #64748b; background: #f1f5f9; padding: 0.5rem; border-radius: 6px; margin-bottom: 1rem;">
                            <em>"${b.proposal_notes}"</em>
                          </div>
                        ` : ''}
                      </div>

                      ${tender.status !== 'awarded' && tender.status !== 'closed' ? `
                        <button class="btn-award-tender-bid btn-pill btn-primary" data-bid-id="${b.id}" data-tender-id="${tenderId}" data-supplier="${b.supplier_name}" data-amount="${b.quote_amount}" style="width: 100%; font-size: 0.82rem; margin-top: 0.5rem;">
                          🏆 Award Contract & Init 50/50 Escrow
                        </button>
                      ` : `
                        <div style="text-align: center; font-size: 0.8rem; color: ${b.status === 'awarded' ? '#10b981' : '#94a3b8'}; font-weight: 700; padding: 0.5rem 0;">
                          ${b.status === 'awarded' ? '✓ Contract Awarded to this Vendor' : 'Bid Not Selected'}
                        </div>
                      `}
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          `;

          document.getElementById('btn-close-tender-workspace')?.addEventListener('click', () => {
            container.style.display = 'none';
          });

          // Award Bid Click Handler
          document.querySelectorAll('.btn-award-tender-bid').forEach(awardBtn => {
            awardBtn.onclick = async () => {
              const bidId = awardBtn.dataset.bidId;
              const supplier = awardBtn.dataset.supplier;
              const amount = Number(awardBtn.dataset.amount);
              const m1Amount = (amount * 0.5).toLocaleString();
              const confirmAward = confirm(`Award contract to ${supplier} for GH₵ ${amount.toLocaleString()}?\n\nThis will initialize 50/50 MoMo Milestone Escrow:\n- Milestone 1: 50% Mobilization Deposit (GH₵ ${m1Amount})\n- Milestone 2: 50% Final Disbursement upon Physical Inspection`);
              if (!confirmAward) return;

              try {
                await API.awardTenderContract(schoolId, tenderId, bidId);
                State.showToast(`Contract awarded to ${supplier}! 50/50 Escrow initialized.`, 'success');
                App.navigate('schools');
              } catch (err) {
                State.showToast(err.message || 'Failed to award contract', 'error');
              }
            };
          });
        } catch (err) {
          State.showToast(err.message || 'Failed to load tender bids', 'error');
        }
      };
    });

    // 4. Milestone MoMo Escrow Management (ESC-001, ESC-002, ESC-003)
    document.querySelectorAll('.btn-manage-escrow').forEach(btn => {
      btn.onclick = async () => {
        const tenderId = btn.dataset.tenderId;
        const tenderTitle = btn.dataset.tenderTitle;
        const container = document.getElementById('tender-workspace-container');
        if (!container) return;

        try {
          const res = await API.getTenderEscrow(schoolId, tenderId);
          const milestones = res.milestones || [];
          const tender = res.tender || {};

          container.style.display = 'block';
          container.scrollIntoView({ behavior: 'smooth' });
          container.innerHTML = `
            <div class="owner-card" style="border: 2px solid #8b5cf6; background: #ffffff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="font-size: 0.8rem; font-weight: 800; color: #8b5cf6; text-transform: uppercase;">
                    50/50 MoMo Milestone Escrow Desk
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0 0;">
                    ${tenderTitle} &bull; Escrow Contract
                  </h3>
                </div>
                <button id="btn-close-escrow-desk" class="btn-pill btn-secondary" style="font-size: 0.75rem;">
                  ✕ Close Escrow Desk
                </button>
              </div>

              <!-- Escrow Milestones 1 & 2 Cards -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                ${milestones.map(m => `
                  <div style="background: #f8fafc; border: 2px solid ${
                    m.status === 'disbursed' ? '#10b981' :
                    m.status === 'funded_in_escrow' ? '#1266C4' :
                    m.status === 'disputed' ? '#ef4444' : '#e2e8f0'
                  }; border-radius: 12px; padding: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span class="badge ${
                        m.status === 'disbursed' ? 'badge-emerald' :
                        m.status === 'funded_in_escrow' ? 'badge-primary' :
                        m.status === 'disputed' ? 'badge-danger' : 'badge-secondary'
                      }" style="font-size: 0.72rem;">
                        ${m.status.toUpperCase()}
                      </span>
                      <span style="font-weight: 800; font-size: 0.85rem; color: #64748b;">
                        Milestone ${m.milestone_index} (${m.percentage}%)
                      </span>
                    </div>

                    <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #0A2046; font-weight: 800;">
                      ${m.milestone_name}
                    </h4>

                    <div style="font-size: 1.5rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                      GH₵ ${Number(m.amount).toLocaleString()}
                    </div>

                    <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 1rem;">
                      ${m.disbursement_reference ? `Ref: <code>${m.disbursement_reference}</code>` : 'Awaiting payment lock'}
                      ${m.inspection_notes ? `<br>Notes: <em>"${m.inspection_notes}"</em>` : ''}
                    </div>

                    ${m.milestone_index === 1 && m.status === 'pending' ? `
                      <button id="btn-lock-m1-deposit" data-tender-id="${tenderId}" data-amount="${m.amount}" class="btn-pill btn-primary" style="width: 100%; font-size: 0.82rem;">
                        🔒 Lock 50% Mobilization Deposit (MoMo)
                      </button>
                    ` : ''}

                    ${m.milestone_index === 2 && m.status === 'pending' ? `
                      <button id="btn-signoff-delivery-modal" data-tender-id="${tenderId}" class="btn-pill btn-emerald" style="width: 100%; font-size: 0.82rem;">
                        📋 Physical Delivery Inspection Sign-off
                      </button>
                    ` : ''}

                    ${m.status === 'disbursed' ? `
                      <div style="text-align: center; font-size: 0.82rem; color: #10b981; font-weight: 700; padding: 0.5rem;">
                        ✓ Disbursed via MoMo to Supplier
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>

              <!-- Digital LPO & Fulfillment Rating Actions (OPTION C) -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                  <button id="btn-view-digital-lpo" data-tender-id="${tenderId}" class="btn-pill btn-primary" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                    📄 View & Seal Digital LPO Contract
                  </button>
                  <button id="btn-rate-vendor-fulfillment" data-tender-id="${tenderId}" class="btn-pill btn-gold" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                    ⭐ Rate Vendor Fulfillment
                  </button>
                </div>
                <button id="btn-trigger-escrow-dispute" data-tender-id="${tenderId}" class="btn-pill btn-danger" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                  ⚠️ Raise Escrow Dispute
                </button>
              </div>
            </div>
          `;

          document.getElementById('btn-close-escrow-desk')?.addEventListener('click', () => {
            container.style.display = 'none';
          });

          // View & Sign Digital LPO (OPTION C)
          document.getElementById('btn-view-digital-lpo')?.addEventListener('click', async () => {
            try {
              const res = await API.getTenderLPO(schoolId, tenderId);
              const lpo = res.lpo;
              const signConfirm = confirm(
                `Institutional Digital Local Purchase Order (LPO)\n` +
                `--------------------------------------------------\n` +
                `LPO Number: ${lpo.lpoNumber}\n` +
                `Tender: ${lpo.tenderTitle}\n` +
                `Supplier: ${lpo.supplierName}\n` +
                `Total Amount: GH₵ ${Number(lpo.totalAmountGhs).toLocaleString()}\n` +
                `Status: ${lpo.status.toUpperCase()}\n` +
                `Payment Rail: ${lpo.paymentRail}\n\n` +
                `${lpo.signedBySchool ? '✓ Already digitally executed by Bursar.' : 'Would you like to digitally SIGN and SEAL this purchase order?'}`
              );

              if (signConfirm && !lpo.signedBySchool) {
                const signatoryName = prompt('Enter authorized Bursar / Head of Procurement name:', 'School Bursar') || 'School Bursar';
                await API.signTenderLPO(schoolId, tenderId, { signatoryName });
                State.showToast(`✓ Official LPO #${lpo.lpoNumber} signed and sealed!`, 'success');
                App.navigate('schools');
              }
            } catch (err) {
              State.showToast(err.message || 'Failed to process LPO', 'error');
            }
          });

          // Rate Vendor Fulfillment (OPTION C)
          document.getElementById('btn-rate-vendor-fulfillment')?.addEventListener('click', async () => {
            const ratingInput = prompt('Rate vendor performance (1 to 5 stars):', '5');
            if (!ratingInput) return;
            const rating = parseInt(ratingInput, 10) || 5;
            const reviewText = prompt('Enter fulfillment review notes (delivery punctuality, product quality, packaging):', 'Materials arrived on schedule and verified on campus in pristine condition.');

            try {
              await API.rateSupplierFulfillment(schoolId, tenderId, { rating, reviewText });
              State.showToast(`✓ Supplier fulfillment rating (${rating}/5) recorded!`, 'success');
              App.navigate('schools');
            } catch (err) {
              State.showToast(err.message || 'Failed to submit rating', 'error');
            }
          });

          // Milestone 1 Lock Click
          document.getElementById('btn-lock-m1-deposit')?.addEventListener('click', async () => {
            const confirmed = confirm('Lock 50% mobilization deposit into platform MoMo Escrow?');
            if (!confirmed) return;
            try {
              await API.fundEscrowMilestone(schoolId, tenderId, { paymentMethod: 'momo' });
              State.showToast('50% Mobilization Deposit locked securely in escrow!', 'success');
              App.navigate('schools');
            } catch (err) {
              State.showToast(err.message || 'Failed to fund escrow', 'error');
            }
          });

          // Milestone 2 Delivery Sign-off
          document.getElementById('btn-signoff-delivery-modal')?.addEventListener('click', async () => {
            const notes = prompt('Enter delivery inspection sign-off notes:', 'Goods received and inspected on campus. Quality matches specifications.');
            if (!notes) return;
            try {
              await API.signOffTenderDelivery(schoolId, tenderId, { inspectionNotes: notes });
              State.showToast('Physical delivery approved! Full contract disbursed to supplier.', 'success');
              App.navigate('schools');
            } catch (err) {
              State.showToast(err.message || 'Failed to sign off delivery', 'error');
            }
          });

          // Escrow Dispute
          document.getElementById('btn-trigger-escrow-dispute')?.addEventListener('click', async () => {
            const reason = prompt('Enter reason for escrow dispute:', 'Items delivered defective or not received.');
            if (!reason) return;
            try {
              await API.raiseTenderDispute(schoolId, tenderId, { reason });
              State.showToast('Escrow dispute raised. Funds frozen pending Super Admin arbitration.', 'warning');
              App.navigate('schools');
            } catch (err) {
              State.showToast(err.message || 'Failed to raise dispute', 'error');
            }
          });
        } catch (err) {
          State.showToast(err.message || 'Failed to load escrow contract', 'error');
        }
      };
    });

    // ========================================================================
    // PHASE 5: CAMPUS OPERATIONS & INTELLIGENCE EVENT LISTENERS
    // ========================================================================

    // Tag Fixed Asset
    document.getElementById('btn-add-asset')?.addEventListener('click', async () => {
      const name = prompt('Enter Asset Name:', 'Smart Interactive Board (SHS Lab)');
      if (!name) return;
      const category = prompt('Enter Category (e.g. Science Laboratory, ICT, Sports):', 'Classroom Tech');
      const value = prompt('Enter Purchase Valuation in GHS (e.g. 15000):', '15000');
      try {
        await API.createCampusAsset(schoolId, { name, category, purchase_value_ghs: Number(value) || 0 });
        State.showToast('Fixed Asset successfully tagged and registered!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to register asset', 'error');
      }
    });

    // Catalog Library Title
    document.getElementById('btn-add-book')?.addEventListener('click', async () => {
      const title = prompt('Enter Book Title:', 'Advanced Physics for SHS & Cambridge A-Levels');
      if (!title) return;
      const author = prompt('Enter Author:', 'Dr. Kwabena Frimpong');
      const copies = prompt('Enter Total Copies:', '25');
      try {
        await API.addLibraryBook(schoolId, { title, author, total_copies: Number(copies) || 1, category: 'Science & Physics' });
        State.showToast('Library book cataloged successfully!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to catalog book', 'error');
      }
    });

    // Issue Book Loan
    document.getElementById('btn-issue-loan')?.addEventListener('click', async () => {
      const borrowerName = prompt('Enter Student Borrower Full Name:', 'Kwabena Duodu');
      if (!borrowerName) return;
      try {
        await API.issueLibraryLoan(schoolId, { bookId: 'BK-2026-001', borrowerName });
        State.showToast(`Book loan issued to ${borrowerName}!`, 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to issue book loan', 'error');
      }
    });

    // New Transport Route
    document.getElementById('btn-add-route')?.addEventListener('click', async () => {
      const name = prompt('Enter Route Name:', 'Route D: Tema Community & Spintex Express');
      if (!name) return;
      try {
        await API.createTransportRoute(schoolId, { name, capacity: 30 });
        State.showToast('New Transport Route created!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to create route', 'error');
      }
    });

    // Dispatch SMS Broadcast
    document.getElementById('btn-dispatch-sms-modal')?.addEventListener('click', async () => {
      const recipientPhone = prompt('Enter Recipient Phone (+233...):', '+233 24 555 1212');
      if (!recipientPhone) return;
      const message = prompt('Enter Message Body:', 'Notice to Parents: Academic term report cards and fee statements are now live on SkoolFinder.');
      if (!message) return;
      try {
        await API.dispatchSchoolSms(schoolId, { recipientPhone, message });
        State.showToast('SMS dispatched via Hubtel Ghana Gateway!', 'success');
      } catch (err) {
        State.showToast(err.message || 'Failed to dispatch SMS', 'error');
      }
    });

    // Link Campus to Trust
    document.getElementById('btn-link-campus')?.addEventListener('click', async () => {
      const name = prompt('Enter Branch Campus Name:', 'GIS East Legon Campus');
      if (!name) return;
      const location = prompt('Enter Location:', 'East Legon, Accra');
      try {
        await API.linkSchoolToGroup('grp-trust-gis', { name, location, students_count: 320, staff_count: 35 });
        State.showToast('Branch Campus linked to Educational Trust!', 'success');
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to link campus', 'error');
      }
    });

    // === EXPANSION 1: SPONSORED ADS & PROMOTIONS HANDLERS ===
    document.getElementById('btn-scroll-to-create-promo')?.addEventListener('click', () => {
      document.getElementById('section-create-promo')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('.btn-select-pkg').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgId = btn.dataset.pkgId;
        const select = document.getElementById('promo-package-select');
        if (select) {
          select.value = pkgId;
          const summary = document.getElementById('promo-checkout-summary');
          if (summary) {
            const price = btn.dataset.pkgPrice;
            summary.textContent = `Package: ${btn.textContent.trim()} • Total: GH₵ ${price}.00`;
          }
          document.getElementById('section-create-promo')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    document.getElementById('promo-package-select')?.addEventListener('change', (e) => {
      const summary = document.getElementById('promo-checkout-summary');
      if (!summary) return;
      const prices = { spotlight_7d: 75, premium_14d: 135, supreme_30d: 250 };
      const names = { spotlight_7d: '7 Days Spotlight', premium_14d: '14 Days Premium', supreme_30d: '30 Days Supreme' };
      const val = e.target.value;
      summary.textContent = `Package: ${names[val] || val} • Total: GH₵ ${prices[val] || 135}.00`;
    });

    document.getElementById('btn-submit-promo-campaign')?.addEventListener('click', async () => {
      const packageId = document.getElementById('promo-package-select')?.value || 'premium_14d';
      const placement = document.getElementById('promo-placement-select')?.value || 'directory_top';
      const headline = document.getElementById('promo-headline-input')?.value?.trim() || 'Admissions Open for 2026/2027 Academic Term';
      const ctaLabel = document.getElementById('promo-cta-input')?.value?.trim() || 'Apply for Admission Now';
      const targetUrl = document.getElementById('promo-target-input')?.value?.trim() || `/school/${schoolId}`;
      const bannerUrl = document.getElementById('promo-banner-select')?.value || '/assets/images/campus_hero.webp';

      try {
        State.showToast('Initializing Paystack Ghana Checkout...', 'info');
        const createRes = await API.createSchoolCampaign(schoolId, { packageId, placement, headline, ctaLabel, targetUrl, bannerUrl });
        if (!createRes?.success) throw new Error(createRes?.message || 'Failed to create campaign');
        
        const checkoutRes = await API.checkoutPromotionCampaign(schoolId, createRes.campaign.id);
        if (!checkoutRes?.success) throw new Error(checkoutRes?.message || 'Paystack checkout failed');

        // Automatic instant Mobile Money payment verification simulation
        const verifyRes = await API.verifyPromotionPayment(schoolId, createRes.campaign.id, {
          transactionReference: checkoutRes.paymentReference,
          provider: 'paystack_momo'
        });

        if (verifyRes?.success) {
          State.showToast('🎉 Promotion Campaign Activated & Live in Public Directory!', 'success');
          this.activeTab = 'promotions';
          App.navigate('schools');
        } else {
          State.showToast(verifyRes?.message || 'Payment verification pending', 'warning');
        }
      } catch (err) {
        State.showToast(err.message || 'Promotion creation error', 'error');
      }
    });

    document.querySelectorAll('.btn-pay-pending-promo').forEach(btn => {
      btn.addEventListener('click', async () => {
        const campaignId = btn.dataset.campaignId;
        try {
          State.showToast('Processing Paystack payment verification...', 'info');
          const verifyRes = await API.verifyPromotionPayment(schoolId, campaignId, {
            transactionReference: 'PAY_PROMO_' + Date.now(),
            provider: 'paystack_momo'
          });
          if (verifyRes?.success) {
            State.showToast('Campaign successfully paid & activated!', 'success');
            this.activeTab = 'promotions';
            App.navigate('schools');
          }
        } catch (err) {
          State.showToast(err.message || 'Verification error', 'error');
        }
      });
    });

    // === EXPANSION 2: WEBHOOKS & NOTIFICATIONS HANDLERS ===
    document.getElementById('btn-copy-webhook-secret')?.addEventListener('click', () => {
      const secret = document.getElementById('webhook-secret-display')?.value;
      if (secret) {
        navigator.clipboard?.writeText(secret);
        State.showToast('HMAC Secret Key copied to clipboard!', 'success');
      }
    });

    document.getElementById('btn-save-webhook-subscription')?.addEventListener('click', async () => {
      const targetUrl = document.getElementById('webhook-target-url')?.value?.trim();
      const secret = document.getElementById('webhook-secret-display')?.value?.trim();
      const checkedEvents = Array.from(document.querySelectorAll('.webhook-event-checkbox:checked')).map(cb => cb.value);

      if (!targetUrl) {
        State.showToast('Please provide a valid webhook destination URL', 'warning');
        return;
      }

      if (!State.authToken && !localStorage.getItem('skoolfinder_token')) {
        try {
          const demoRes = await fetch('/api/auth/demo-login', { method: 'POST' });
          const data = await demoRes.json();
          if (data.token) {
            State.authToken = data.token;
            State.user = data.user;
            localStorage.setItem('skoolfinder_token', data.token);
            localStorage.setItem('skoolfinder_user', JSON.stringify(data.user));
          }
        } catch (e) {}
      }

      try {
        await API.registerSchoolWebhook(schoolId, { targetUrl, events: checkedEvents, secret });
        State.showToast('Webhook endpoint configured with HMAC SHA-256!', 'success');
        this.activeTab = 'webhooks';
        App.navigate('schools');
      } catch (err) {
        State.showToast(err.message || 'Failed to save webhook', 'error');
      }
    });

    document.getElementById('btn-test-webhook-ping')?.addEventListener('click', async () => {
      try {
        State.showToast('Dispatching test webhook ping (AdmissionOfferIssued)...', 'info');
        if (!State.authToken && !localStorage.getItem('skoolfinder_token')) {
          try {
            const demoRes = await fetch('/api/auth/demo-login', { method: 'POST' });
            const data = await demoRes.json();
            if (data.token) {
              State.authToken = data.token;
              State.user = data.user;
              localStorage.setItem('skoolfinder_token', data.token);
              localStorage.setItem('skoolfinder_user', JSON.stringify(data.user));
            }
          } catch (e) {}
        }
        const testRes = await API.testDispatchWebhook(schoolId, 'AdmissionOfferIssued', {
          candidateName: 'Kwame Asante',
          indexNumber: '1010203040',
          gradeAggregate: 7,
          academicYear: '2026/2027',
          offerTimestamp: new Date().toISOString()
        });
        if (testRes?.success) {
          const statusText = testRes.deliveries?.[0]?.status || testRes.delivery?.status || '200 OK';
          State.showToast(`✓ Outbound Webhook Ping Dispatched! Status: ${statusText}`, 'success');
          this.activeTab = 'webhooks';
          App.navigate('schools');
        } else {
          State.showToast(testRes?.error || testRes?.message || 'Webhook ping encountered an error', 'warning');
        }
      } catch (err) {
        State.showToast(err.message || 'Test dispatch failed', 'error');
      }
    });

    document.getElementById('btn-save-notif-prefs')?.addEventListener('click', async () => {
      if (!State.authToken && !localStorage.getItem('skoolfinder_token')) {
        try {
          const demoRes = await fetch('/api/auth/demo-login', { method: 'POST' });
          const data = await demoRes.json();
          if (data.token) {
            State.authToken = data.token;
            State.user = data.user;
            localStorage.setItem('skoolfinder_token', data.token);
            localStorage.setItem('skoolfinder_user', JSON.stringify(data.user));
          }
        } catch (e) {}
      }
      const whatsapp = document.getElementById('pref-whatsapp-toggle')?.checked || false;
      const sms = document.getElementById('pref-sms-toggle')?.checked || false;
      const email = document.getElementById('pref-email-toggle')?.checked || false;
      const whatsappNumber = document.getElementById('pref-whatsapp-number')?.value?.trim();
      const smsNumber = document.getElementById('pref-sms-number')?.value?.trim();
      const emailAddress = document.getElementById('pref-email-address')?.value?.trim();

      try {
        await API.updateSchoolNotificationPreferences(schoolId, {
          whatsapp,
          sms,
          email,
          whatsappNumber,
          smsNumber,
          emailAddress
        });
        State.showToast('Alert channel preferences saved successfully!', 'success');
      } catch (err) {
        State.showToast(err.message || 'Failed to update preferences', 'error');
      }
    });

    // 1-Click Dead-Letter Redelivery Listeners
    document.querySelectorAll('.btn-redeliver-webhook').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const deliveryId = e.currentTarget.getAttribute('data-delivery-id');
        if (!deliveryId) return;
        try {
          State.showToast('Re-dispatching outbound webhook...', 'info');
          const res = await API.redeliverWebhook(schoolId, deliveryId);
          if (res?.success) {
            State.showToast('Webhook re-delivered successfully!', 'success');
            this.activeTab = 'webhooks';
            App.navigate('schools');
          } else {
            State.showToast(res?.message || 'Redelivery attempt finished', 'warning');
          }
        } catch (err) {
          State.showToast(err.message || 'Redelivery failed', 'error');
        }
      });
    });

    // 1-Click Circuit Breaker Reset Listener
    document.getElementById('btn-reset-circuit-breaker')?.addEventListener('click', async (e) => {
      const subId = e.currentTarget.getAttribute('data-sub-id');
      try {
        State.showToast('Resetting circuit breaker and re-activating webhook...', 'info');
        const res = await API.resetWebhookCircuitBreaker(schoolId, subId);
        if (res?.success) {
          State.showToast('Circuit breaker reset! Webhook is active again.', 'success');
          this.activeTab = 'webhooks';
          App.navigate('schools');
        }
      } catch (err) {
        State.showToast(err.message || 'Failed to reset circuit breaker', 'error');
      }
    });
  }
};
