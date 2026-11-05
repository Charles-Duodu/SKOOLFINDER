/**
 * SkoolFinder Ghana — Dedicated Public Persona Landing: For Schools & Proprietors
 * ==============================================================================
 * Route: #/for-schools or /for-schools
 * Blueprint & Master Guide v1.0 Section 4, 5, 6 (H13), 7, 9, 13
 *
 * Explains:
 * 1. NaSIA Licensing & Verification Process (4 independent pillars)
 * 2. School Profile Claiming & Pre-populated Directory Listing
 * 3. Direct WhatsApp Admissions Desk & Lead Attribution
 * 4. Digital Admissions Voucher Engine (95% MoMo settlement)
 * 5. Self-Service Campus Walkthrough & Tour Queuing
 * 6. Transparent Subscription Comparison (Free Starter vs Growth vs Pro)
 * 7. Verified Proprietor FAQ
 * ==============================================================================
 */

const ForSchoolsView = {
  async render() {
    return `
      <div class="for-schools-page" style="background: var(--bg-main); min-height: 100vh;">
        
        <!-- Hero Section -->
        <section style="background: linear-gradient(135deg, #0A2046 0%, #102a5c 50%, #1266C4 100%); color: #ffffff; padding: 5rem 0 4.5rem; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(213, 166, 59, 0.15) 0%, transparent 70%); pointer-events: none;"></div>
          
          <div class="container" style="position: relative; z-index: 2;">
            <div style="max-width: 820px; margin: 0 auto; text-align: center;">
              
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(213, 166, 59, 0.4); padding: 0.4rem 1.1rem; border-radius: 9999px; margin-bottom: 1.5rem; backdrop-filter: blur(8px);">
                <span style="font-size: 1rem;">🇬🇭</span>
                <span style="font-size: 0.8rem; font-weight: 800; color: #fde68a; text-transform: uppercase; letter-spacing: 0.06em;">
                  National Pre-Tertiary School Command Hub
                </span>
              </div>

              <h1 style="font-family: var(--font-heading); font-size: 2.75rem; font-weight: 900; line-height: 1.2; margin: 0 0 1.25rem 0; color: #ffffff;">
                Accelerate Admissions & Establish Unrivaled Institutional Prestige
              </h1>

              <p style="font-size: 1.15rem; line-height: 1.6; color: #cbd5e1; margin: 0 auto 2.25rem; max-width: 700px;">
                Claim your institution's verified profile on Ghana’s premier pre-tertiary directory. Cross-check your official NaSIA regulatory credentials, capture high-intent parent WhatsApp inquiries, and automate mobile money admission voucher collections.
              </p>

              <!-- Primary CTAs -->
              <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                <button type="button" id="btn-hero-claim-school" class="btn-pill btn-gold" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; box-shadow: 0 4px 16px rgba(213, 166, 59, 0.35); display: flex; align-items: center; gap: 0.5rem;">
                  <span>🏛️</span> Claim Your School Profile
                </button>
                <button type="button" id="btn-hero-register-school" class="btn-pill" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); display: flex; align-items: center; gap: 0.5rem;">
                  <span>➕</span> Register New Campus
                </button>
                <button type="button" id="btn-hero-view-plans" class="btn-pill btn-outline" style="font-size: 0.95rem; font-weight: 700; padding: 0.85rem 1.5rem; color: #ffffff; border-color: rgba(255,255,255,0.4);">
                  <span>💳</span> View Pricing Plans
                </button>
              </div>

              <!-- Quick Trust Pillars -->
              <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; font-size: 0.85rem; color: #94a3b8;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #10b981;">✓</span> Official NaSIA Licensing Vetting
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #10b981;">✓</span> Ghana Mobile Money Integrated (MTN, Telecel, AT)
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #10b981;">✓</span> 95% Voucher Settlement Disbursement
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Search & Claim Fast-Finder Bar -->
        <section style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 1.75rem 0; box-shadow: var(--shadow-sm);">
          <div class="container">
            <div style="max-width: 780px; margin: 0 auto; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 260px;">
                <label for="input-search-claim-target" style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; display: block;">
                  Find Your School to Claim Ownership:
                </label>
                <input type="text" id="input-search-claim-target" class="form-input" placeholder="Type school name e.g. Ghana International School, SOS Hermann..." style="font-size: 0.95rem; padding: 0.65rem 1rem;" />
              </div>
              <button type="button" id="btn-quick-find-claim" class="btn-pill btn-primary" style="margin-top: 1.25rem; padding: 0.65rem 1.25rem; font-weight: 700; font-size: 0.9rem;">
                Search Directory &rarr;
              </button>
            </div>
            <div id="claim-search-results" style="max-width: 780px; margin: 0.75rem auto 0; display: none;"></div>
          </div>
        </section>

        <!-- 4 Core Value Pillars (Why Leading Schools Choose SkoolFinder) -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Built For Ghanaian Campus Leaders
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                Four Operating Pillars That Transform Your Admissions
              </h2>
              <p style="color: #64748b; font-size: 1rem; line-height: 1.6;">
                Eliminate administrative bottleneck, verify your accreditation, and turn prospective parent inquiries into registered students.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
              
              <!-- Pillar 1: NaSIA Cross-Check & Regulatory Badging -->
              <div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s;">
                <div>
                  <div style="width: 56px; height: 56px; border-radius: 12px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.25rem;">
                    🛡️
                  </div>
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                    1. Official NaSIA Credential Cross-Check
                  </h3>
                  <p style="color: #64748b; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.25rem;">
                    Distinguish your school from unaccredited operations. Submit your National Schools Inspectorate Authority (NaSIA) registration number or license code. Our regulatory vetting console validates your credentials and awards the permanent <strong>NaSIA Trust Badge</strong> on your public profile.
                  </p>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 1rem; font-size: 0.82rem; color: #059669; font-weight: 700;">
                  ✓ Decoupled accreditation &amp; fraud protection
                </div>
              </div>

              <!-- Pillar 2: Direct WhatsApp Desk & Attribution Intelligence -->
              <div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="width: 56px; height: 56px; border-radius: 12px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.25rem;">
                    💬
                  </div>
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                    2. Direct WhatsApp Admissions Desk
                  </h3>
                  <p style="color: #64748b; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.25rem;">
                    Parents in Ghana prefer messaging directly. Our smart WhatsApp Desk pre-populates the prospective student's target grade, curriculum preference, and discovery source. In the School Dashboard, track inquiries with conversion velocity analytics and response SLA metrics.
                  </p>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 1rem; font-size: 0.82rem; color: #16a34a; font-weight: 700;">
                  ✓ 4x faster parent engagement turnaround
                </div>
              </div>

              <!-- Pillar 3: Digital Admissions Voucher Purchasing -->
              <div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="width: 56px; height: 56px; border-radius: 12px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.25rem;">
                    🎫
                  </div>
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                    3. MoMo Admissions Voucher Engine
                  </h3>
                  <p style="color: #64748b; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.25rem;">
                    Parents buy official admission forms online using MTN MoMo, Telecel Cash, or AT Money. The platform instantly generates a serial token, 4-digit security PIN, and QR certificate. Your bursar validates the code in the School Dashboard, and your school receives 95% net revenue disbursement.
                  </p>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 1rem; font-size: 0.82rem; color: #b45309; font-weight: 700;">
                  ✓ Automated 95% bank / MoMo payout split
                </div>
              </div>

              <!-- Pillar 4: Walkthrough & Campus Tour Queuing -->
              <div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="width: 56px; height: 56px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.25rem;">
                    📅
                  </div>
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                    4. Campus Tour Queuing & Open Days
                  </h3>
                  <p style="color: #64748b; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.25rem;">
                    No more impromptu campus drop-ins. Define guided walkthrough slots and entrance exam dates. Parents select available calendar slots with instant automated Hubtel SMS and email confirmation receipts. Assign staff hosts with zero calendar overlap.
                  </p>
                </div>
                <div style="border-top: 1px dashed #cbd5e1; padding-top: 1rem; font-size: 0.82rem; color: #2563eb; font-weight: 700;">
                  ✓ Capacity-capped walkthroughs &amp; SMS alerts
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Step-by-Step Institutional Onboarding Process -->
        <section style="padding: 5rem 0; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <div class="container">
            <div style="text-align: center; max-width: 650px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Seamless 3-Step Setup
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading);">
                How School Ownership Claiming Works
              </h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
              <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.75rem; position: relative;">
                <div style="font-size: 2rem; font-weight: 900; color: #1266C4; margin-bottom: 0.5rem;">01</div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">Find & Claim Your Profile</h4>
                <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                  Search our pre-populated registry of Greater Accra and Tema institutions. If your school is listed, click "Claim Profile". If unlisted, register your campus from scratch.
                </p>
              </div>

              <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.75rem; position: relative;">
                <div style="font-size: 2rem; font-weight: 900; color: #1266C4; margin-bottom: 0.5rem;">02</div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">Submit NaSIA & Head Identity</h4>
                <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                  Provide your official school registration number, head of school name, and Ghana Card reference. Our accreditation desk cross-checks official registries within 24–48 hours.
                </p>
              </div>

              <div style="background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.75rem; position: relative;">
                <div style="font-size: 2rem; font-weight: 900; color: #1266C4; margin-bottom: 0.5rem;">03</div>
                <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">Unlock School Command Center</h4>
                <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5;">
                  Access your full proprietor workspace. Invite admissions deans and bursars with role-based permissions, configure WhatsApp desks, and launch campus walkthrough schedules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Plan Comparison Snippet & Pricing CTA -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="background: linear-gradient(135deg, #0A2046 0%, #1e3a8a 100%); color: #ffffff; border-radius: 20px; padding: 3rem 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;">
              <div style="max-width: 600px;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
                  Transparent Commercial Plans (DEC-02)
                </div>
                <h3 style="font-size: 2rem; font-weight: 800; margin: 0 0 0.75rem 0; color: #ffffff; font-family: var(--font-heading);">
                  Start Free, Upgrade as Your Enrolment Expands
                </h3>
                <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin: 0;">
                  From our 100% Free Starter tier to Growth Partner (GH₵ 99/mo) and Featured Spotlight (GH₵ 250/mo), every tier guarantees verified prestige and zero hidden commissions.
                </p>
              </div>
              <div>
                <button type="button" id="btn-cta-compare-pricing" class="btn-pill btn-gold" style="font-size: 1.05rem; font-weight: 800; padding: 0.9rem 2rem; box-shadow: 0 6px 20px rgba(213, 166, 59, 0.4);">
                  Compare School Plans &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- School Proprietor FAQs -->
        <section style="padding: 5rem 0; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <div class="container" style="max-width: 800px;">
            <div style="text-align: center; margin-bottom: 3rem;">
              <h2 style="font-size: 2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Frequently Asked Questions for School Owners
              </h2>
              <p style="color: #64748b; font-size: 0.95rem;">Everything you need to know about claiming, verification, and admissions.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              
              <details style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;">
                <summary style="font-weight: 700; color: #0A2046; cursor: pointer; font-size: 1rem;">
                  How does SkoolFinder verify our school's NaSIA registration?
                </summary>
                <div style="color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-top: 0.75rem;">
                  When you submit your claim, our regulatory desk matches your registration number with the National Schools Inspectorate Authority (NaSIA) registry. Once confirmed, a green "NaSIA Accredited" badge is placed on your profile. If your renewal is in progress, an honest "Vetting in Progress" badge appears.
                </div>
              </details>

              <details style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;">
                <summary style="font-weight: 700; color: #0A2046; cursor: pointer; font-size: 1rem;">
                  How do admissions voucher disbursements reach our bank or MoMo account?
                </summary>
                <div style="color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-top: 0.75rem;">
                  Parents pay for admission tokens via MTN MoMo, Telecel Cash, or AT Money on Paystack. 95% of the fee goes directly to your institution's designated bank account or corporate MoMo wallet, while 5% covers payment gateway fees and platform infrastructure. Full reconciliation ledgers can be exported as CSV anytime.
                </div>
              </details>

              <details style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;">
                <summary style="font-weight: 700; color: #0A2046; cursor: pointer; font-size: 1rem;">
                  Can my Admissions Dean, Bursar, and Principal have separate seats?
                </summary>
                <div style="color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-top: 0.75rem;">
                  Yes! Under the Growth plan (3 seats) or Pro plan (10 seats), you can assign dedicated workspace roles: Admissions Officer, Bursar/Finance Officer, or Administrator. Each staff member logs in securely with their own credentials and strict audit trails.
                </div>
              </details>

              <details style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;">
                <summary style="font-weight: 700; color: #0A2046; cursor: pointer; font-size: 1rem;">
                  Is our school's fee schedule required to be public?
                </summary>
                <div style="color: #64748b; font-size: 0.9rem; line-height: 1.6; margin-top: 0.75rem;">
                  No. We believe in factual transparency: if your school chooses not to publish tuition figures, your listing displays a neutral "Fee Not Disclosed" badge. We never fabricate fee ranges or force unverified disclosures.
                </div>
              </details>

            </div>
          </div>
        </section>

        <!-- Final Bottom Action Strip -->
        <section style="background: #0A2046; color: #ffffff; padding: 4rem 0; text-align: center;">
          <div class="container">
            <h2 style="font-size: 2rem; font-weight: 800; font-family: var(--font-heading); margin-bottom: 0.75rem;">
              Ready to Claim Your School's Digital Profile?
            </h2>
            <p style="color: #cbd5e1; font-size: 1rem; max-width: 600px; margin: 0 auto 2rem;">
              Join Ghana International School, SOS-HGIC, and over 65 accredited campuses setting the benchmark for education excellence.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button type="button" id="btn-footer-claim-action" class="btn-pill btn-gold" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 2rem;">
                Claim Your School Profile Now &rarr;
              </button>
              <button type="button" id="btn-footer-browse-schools" class="btn-pill btn-outline" style="font-size: 0.95rem; color: #fff; border-color: rgba(255,255,255,0.4); padding: 0.85rem 1.5rem;">
                Browse Directory
              </button>
            </div>
          </div>
        </section>

      </div>
    `;
  },

  afterRender() {
    this.attachEvents();
  },

  attachEvents() {
    // 1. Claim School CTAs
    const triggerClaimFlow = () => {
      // If user has a specific school in mind, launch claim wizard with GIS canonical or prompt search
      const gisSchool = {
        id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
        name: 'Ghana International School (GIS)',
        slug: 'ghana-international-school',
        locality: 'Cantonments',
        region: 'Greater Accra',
        curriculum: 'Cambridge International'
      };
      if (typeof Modals !== 'undefined' && Modals.openClaimWizard) {
        Modals.openClaimWizard(gisSchool);
      } else {
        App.navigate('schools');
      }
    };

    document.getElementById('btn-hero-claim-school')?.addEventListener('click', triggerClaimFlow);
    document.getElementById('btn-footer-claim-action')?.addEventListener('click', triggerClaimFlow);

    // 2. Register New School
    document.getElementById('btn-hero-register-school')?.addEventListener('click', () => {
      App.navigate('schools');
      setTimeout(() => {
        if (typeof DashboardView !== 'undefined' && DashboardView.wizardStep) {
          DashboardView.wizardStep = 1;
        }
      }, 100);
    });

    // 3. Pricing Plans CTAs
    document.getElementById('btn-hero-view-plans')?.addEventListener('click', () => {
      App.navigate('pricing', 'schools');
    });
    document.getElementById('btn-cta-compare-pricing')?.addEventListener('click', () => {
      App.navigate('pricing', 'schools');
    });

    // 4. Browse Directory
    document.getElementById('btn-footer-browse-schools')?.addEventListener('click', () => {
      App.navigate('directory');
    });

    // 5. Fast Finder Claim Search
    const searchInput = document.getElementById('input-search-claim-target');
    const searchBtn = document.getElementById('btn-quick-find-claim');
    const resultsContainer = document.getElementById('claim-search-results');

    const executeSearch = async () => {
      const q = searchInput?.value?.trim().toLowerCase();
      if (!q) {
        State.showToast('Please type a school name to find your profile.', 'info');
        return;
      }

      if (resultsContainer) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: #64748b;">Searching directory...</div>';
      }

      try {
        const schools = await API.getSchools();
        const matches = schools.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) || 
          (s.locality && s.locality.toLowerCase().includes(q))
        );

        if (matches.length === 0) {
          resultsContainer.innerHTML = `
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.88rem; color: #92400e;">No matching school profile found. You can register your campus from scratch.</span>
              <button class="btn-pill btn-primary" id="btn-register-not-found" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Register Campus</button>
            </div>
          `;
          document.getElementById('btn-register-not-found')?.addEventListener('click', () => App.navigate('schools'));
          return;
        }

        resultsContainer.innerHTML = `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-md);">
            ${matches.slice(0, 4).map(s => `
              <div style="padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <strong style="color: #0A2046; font-size: 0.92rem; display: block;">${s.name}</strong>
                  <span style="font-size: 0.78rem; color: #64748b;">${s.locality || s.district || 'Accra'}, ${s.region || 'Greater Accra'} • ${s.curriculum || 'Accredited'}</span>
                </div>
                <button type="button" class="btn-pill btn-claim-row" data-id="${s.id}" data-name="${s.name}" style="font-size: 0.78rem; font-weight: 700; padding: 0.4rem 0.85rem; background: #0A2046; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
                  Claim This Profile &rarr;
                </button>
              </div>
            `).join('')}
          </div>
        `;

        document.querySelectorAll('.btn-claim-row').forEach(btn => {
          btn.addEventListener('click', () => {
            const schId = btn.dataset.id;
            const schName = btn.dataset.name;
            const foundSchool = matches.find(m => m.id === schId) || { id: schId, name: schName };
            if (typeof Modals !== 'undefined' && Modals.openClaimWizard) {
              Modals.openClaimWizard(foundSchool);
            } else {
              App.navigate('schools');
            }
          });
        });

      } catch (err) {
        resultsContainer.innerHTML = `<div style="color: var(--rose-600); padding: 0.5rem;">Error searching: ${err.message}</div>`;
      }
    };

    searchBtn?.addEventListener('click', executeSearch);
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.ForSchoolsView = ForSchoolsView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForSchoolsView;
}
