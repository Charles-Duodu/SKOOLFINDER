/**
 * SkoolFinder Ghana - Dedicated Platform Pricing & Plans Comparison View
 * Master Guide v1.0 Sections 9, 10, 11 & Combined Roadmap v1.1
 */
const PricingView = {
  activePersona: 'schools', // 'schools' | 'professionals' | 'suppliers'
  billingInterval: 'monthly', // 'monthly' | 'annual'

  async render(initialPersona = 'schools') {
    if (['schools', 'professionals', 'suppliers'].includes(initialPersona)) {
      this.activePersona = initialPersona;
    }

    const isAnnual = this.billingInterval === 'annual';

    return `
      <section style="background: linear-gradient(180deg, var(--bg-main) 0%, #ffffff 100%); min-height: 85vh; padding: 3rem 0 5rem;">
        <div class="container">
          
          <!-- Header Hero -->
          <div style="text-align: center; max-width: 820px; margin: 0 auto 2.5rem;">
            <span class="section-tag" style="display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🇬🇭</span> Approved Ghana Cedis Pricing & Monetization Catalogue
            </span>
            <h1 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0.75rem 0 0.5rem 0; line-height: 1.2;">
              Transparent, Value-Driven Plans for Every Education Partner
            </h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0 auto;">
              No hidden fees, no forced commitments. Direct local settlements via MTN MoMo, Telecel Cash, AT Money, and bank cards with instant automated receipts.
            </p>
          </div>

          <!-- Persona Selector Tabs -->
          <div role="tablist" aria-label="Pricing Category Tabs" style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2.5rem; flex-wrap: wrap;">
            <button role="tab" id="tab-pricing-schools" class="btn-pill ${this.activePersona === 'schools' ? 'btn-primary' : 'btn-outline'}" aria-selected="${this.activePersona === 'schools'}" style="font-size: 0.92rem; padding: 0.6rem 1.35rem; font-weight: 700;">
              <span>🏫</span> Schools &amp; Proprietors
            </button>
            <button role="tab" id="tab-pricing-professionals" class="btn-pill ${this.activePersona === 'professionals' ? 'btn-primary' : 'btn-outline'}" aria-selected="${this.activePersona === 'professionals'}" style="font-size: 0.92rem; padding: 0.6rem 1.35rem; font-weight: 700;">
              <span>👨‍🏫</span> Teachers &amp; Tutors
            </button>
            <button role="tab" id="tab-pricing-suppliers" class="btn-pill ${this.activePersona === 'suppliers' ? 'btn-primary' : 'btn-outline'}" aria-selected="${this.activePersona === 'suppliers'}" style="font-size: 0.92rem; padding: 0.6rem 1.35rem; font-weight: 700;">
              <span>📦</span> Educational Suppliers
            </button>
          </div>

          <!-- Dynamic Active View Panel -->
          <div id="pricing-persona-container">
            ${this.renderActivePersona()}
          </div>

          <!-- Regulatory & Trust Assurance Strip -->
          <div style="margin-top: 4rem; background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: flex-start; gap: 1.25rem; flex-wrap: wrap;">
              <div style="font-size: 2.2rem; background: var(--emerald-50); color: var(--emerald-700); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                🛡️
              </div>
              <div style="flex: 1; min-width: 280px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.4rem 0;">
                  Our Commercial Integrity &amp; Safeguarding Pledge
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 0.85rem 0;">
                  <strong>1. Zero Paid Verification Bypasses:</strong> A paid subscription unlocks digital workflow capacity, seats, and marketing reach. It never purchases regulatory approval, NaSIA licensing, or verified owner credentials.<br/>
                  <strong>2. Child Safeguarding Boundary:</strong> Home tutoring sessions and campus activities require verified qualifications, police clearance, and parental consent before operational activation.<br/>
                  <strong>3. Non-Destructive Downgrades:</strong> When switching plans, your published school profile, historical parent enquiries, and verified records remain completely safe.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--primary-800); font-weight: 700;">
                  <span>✓ Bank-Grade Paystack MoMo Gateway</span>
                  <span>✓ Ghana Data Protection Act 2012 (Act 843)</span>
                  <span>✓ Instant Sequential VAT Tax Invoices</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Frequently Asked Questions Accordion -->
          <div style="margin-top: 4rem; max-width: 840px; margin-left: auto; margin-right: auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <span class="section-tag">💡 Clear Answers</span>
              <h2 style="font-family: var(--font-heading); font-size: 1.85rem; color: var(--theme-b-navy, #0A2046); margin-top: 0.25rem;">
                Frequently Asked Billing Questions
              </h2>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <details style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; cursor: pointer;">
                <summary style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 1rem;">
                  How do Mobile Money (MoMo) payments work for subscriptions?
                </summary>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                  We process payments securely via Paystack. You can subscribe using MTN Mobile Money, Telecel Cash, AT Money, or any Visa/Mastercard. You will receive an instant prompt on your Ghanaian mobile phone to approve the transaction with your MoMo PIN.
                </p>
              </details>

              <details style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; cursor: pointer;">
                <summary style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 1rem;">
                  Can I purchase add-on credits without changing my monthly plan?
                </summary>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                  Yes! School owners can purchase single vacancy slots for GH₵ 25 (active for 30 days), tender publications for GH₵ 45 (or 3 for GH₵ 120), and extra staff seats for GH₵ 10/month at any time directly from the school dashboard.
                </p>
              </details>

              <details style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; cursor: pointer;">
                <summary style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 1rem;">
                  What happens when my subscription renewal date arrives?
                </summary>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                  We provide a generous 7-day grace window if an automated renewal attempt fails. During this grace period, all your services remain fully active while you settle the invoice via MoMo or card.
                </p>
              </details>

              <details style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; cursor: pointer;">
                <summary style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 1rem;">
                  Are ordinary job applications free for teachers?
                </summary>
                <p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
                  Yes! Applying for teaching and administrative vacancies at accredited Ghanaian schools is 100% free forever. Tutors only pay if they wish to publish private tutoring packages and accept direct parent bookings on the platform.
                </p>
              </details>
            </div>
          </div>

        </div>
      </section>
    `;
  },

  renderActivePersona() {
    if (this.activePersona === 'schools') return this.renderSchoolsPricing();
    if (this.activePersona === 'professionals') return this.renderProfessionalsPricing();
    if (this.activePersona === 'suppliers') return this.renderSuppliersPricing();
    return this.renderSchoolsPricing();
  },

  // 1. SCHOOLS & PROPRIETORS PRICING
  renderSchoolsPricing() {
    const isAnnual = this.billingInterval === 'annual';

    return `
      <div>
        <!-- Billing Interval Switcher -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 2.5rem;">
          <span style="font-size: 0.95rem; font-weight: ${!isAnnual ? '800' : '600'}; color: ${!isAnnual ? 'var(--theme-b-navy, #0A2046)' : 'var(--text-muted)'};">
            Monthly Billing
          </span>
          <button id="btn-toggle-interval" aria-label="Toggle Annual Billing" style="width: 58px; height: 32px; background: ${isAnnual ? 'var(--theme-b-blue, #1266C4)' : '#cbd5e1'}; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s ease;">
            <span style="position: absolute; top: 3px; left: ${isAnnual ? '29px' : '4px'}; width: 26px; height: 26px; background: #ffffff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: left 0.2s ease;"></span>
          </button>
          <span style="font-size: 0.95rem; font-weight: ${isAnnual ? '800' : '600'}; color: ${isAnnual ? 'var(--theme-b-navy, #0A2046)' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.4rem;">
            Annual Billing
            <span class="badge badge-emerald" style="font-size: 0.72rem; padding: 0.15rem 0.5rem; font-weight: 800;">
              Save 16.67% (2 Mos Free!)
            </span>
          </span>
        </div>

        <!-- 4-Tier Pricing Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; align-items: stretch; margin-bottom: 3.5rem;">
          
          <!-- Tier 1: Free Starter -->
          <div class="pricing-card" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                Starter Profile
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Free Basic
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Claim your school's official listing and maintain factual profile information.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ 0
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  Forever Free for Accredited Schools
                </div>
              </div>

              <!-- Quotas & Entitlements -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>1</strong> Administrator Seat
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>5</strong> Campus Gallery Images
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Basic Inbound Enquiries
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> NaSIA Licence Status Badge
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center; color: #94a3b8;">
                  <span>✕</span> 0 Active Vacancy Posts
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center; color: #94a3b8;">
                  <span>✕</span> 0 B2B Tender Posts
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center; color: #94a3b8;">
                  <span>✕</span> No Tour Scheduling CRM
                </li>
              </ul>
            </div>

            <button id="btn-pricing-free-school" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-weight: 800;">
              Claim / Register School
            </button>
          </div>

          <!-- Tier 2: Growth (Highlighted) -->
          <div class="pricing-card" style="background: #ffffff; border: 2.5px solid var(--theme-b-blue, #1266C4); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 12px 30px rgba(18,102,196,0.12);">
            <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--theme-b-blue, #1266C4); color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 0.3rem 0.9rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">
              ⭐ Most Popular for Basic Schools
            </div>

            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); text-transform: uppercase;">
                Admissions Accelerator
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Growth
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Full enquiry messaging CRM, tour bookings, and vacancy recruitment.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ ${isAnnual ? '990' : '99'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${isAnnual ? 'per year (Save GH₵ 198)' : 'per month + VAT'}
                </div>
              </div>

              <!-- Quotas & Entitlements -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>3</strong> Staff / Admissions Seats
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>20</strong> Gallery Images &amp; Video
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>2</strong> Simultaneous Active Vacancies
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Full Parent Enquiry Messaging CRM
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Campus Tour &amp; Walkthrough Booking
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Inbound Leads CSV Export
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center; color: #94a3b8;">
                  <span>✕</span> 0 Included Tender Posts
                </li>
              </ul>
            </div>

            <button id="btn-pricing-growth-school" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-weight: 800;">
              Get Growth Plan
            </button>
          </div>

          <!-- Tier 3: Professional -->
          <div class="pricing-card" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #9333ea; text-transform: uppercase;">
                Admissions Engine
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Professional
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Online admissions workflows, digital offer letters, and procurement tenders.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ ${isAnnual ? '2,490' : '249'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${isAnnual ? 'per year (Save GH₵ 498)' : 'per month + VAT'}
                </div>
              </div>

              <!-- Quotas & Entitlements -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>10</strong> Staff / Admissions Seats
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>50</strong> Gallery Images &amp; Virtual Tour
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>10</strong> Active Vacancy Posts
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>3</strong> New Tender Publications / month
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Digital Admissions Application Form Builder
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Official Offer Letter Generator &amp; MoMo Invoicing
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Priority Labelled Search Ranking
                </li>
              </ul>
            </div>

            <button id="btn-pricing-pro-school" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-weight: 800;">
              Get Pro Plan
            </button>
          </div>

          <!-- Tier 4: Enterprise -->
          <div class="pricing-card" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #b45309; text-transform: uppercase;">
                Multi-Campus Network
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Enterprise
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Complete multi-branch oversight for school trusts and high school groups.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ ${isAnnual ? '4,990' : '499'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${isAnnual ? 'per year (Save GH₵ 998)' : 'per month + VAT'}
                </div>
              </div>

              <!-- Quotas & Entitlements -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>25</strong> Staff / Campus Seats
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>100</strong> Gallery Images &amp; Media
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>30</strong> Active Vacancy Posts
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>10</strong> Tender Publications / month
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Multi-Branch Trust Dashboard
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Dedicated Relationship Manager
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> Custom SIS &amp; API Webhooks
                </li>
              </ul>
            </div>

            <button id="btn-pricing-enterprise-school" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-weight: 800;">
              Contact Enterprise
            </button>
          </div>

        </div>

        <!-- Approved School Add-Ons Catalogue -->
        <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 2.25rem 2rem;">
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.35rem 0;">
              Approved On-Demand Add-Ons &amp; Usage Credits
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
              Expand your capabilities whenever seasonal admissions peaks require additional capacity.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
              <div style="font-size: 1.4rem; margin-bottom: 0.25rem;">📢</div>
              <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Additional Vacancy Slot</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">Active for 30 consecutive days</div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); margin-top: 0.5rem;">
                GH₵ 25
              </div>
            </div>

            <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
              <div style="font-size: 1.4rem; margin-bottom: 0.25rem;">📋</div>
              <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Single Tender Post</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">One public RFQ procurement listing</div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); margin-top: 0.5rem;">
                GH₵ 45
              </div>
            </div>

            <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
              <div style="font-size: 1.4rem; margin-bottom: 0.25rem;">📦</div>
              <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Tender Bundle (3 Posts)</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">Pack of 3 competitive procurement RFQs</div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); margin-top: 0.5rem;">
                GH₵ 120
              </div>
            </div>

            <div style="background: #ffffff; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
              <div style="font-size: 1.4rem; margin-bottom: 0.25rem;">👥</div>
              <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Additional Staff Seat</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">Extra bursar or admissions manager</div>
              <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); margin-top: 0.5rem;">
                GH₵ 10 / mo
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 2. TEACHERS & EDUCATION PROFESSIONALS PRICING
  renderProfessionalsPricing() {
    const isAnnual = this.billingInterval === 'annual';

    return `
      <div>
        <!-- Billing Interval Switcher -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 2.5rem;">
          <span style="font-size: 0.95rem; font-weight: ${!isAnnual ? '800' : '600'}; color: ${!isAnnual ? 'var(--theme-b-navy, #0A2046)' : 'var(--text-muted)'};">
            Monthly Billing
          </span>
          <button id="btn-toggle-interval" aria-label="Toggle Annual Billing" style="width: 58px; height: 32px; background: ${isAnnual ? 'var(--theme-b-blue, #1266C4)' : '#cbd5e1'}; border-radius: 999px; border: none; cursor: pointer; position: relative; transition: background 0.2s ease;">
            <span style="position: absolute; top: 3px; left: ${isAnnual ? '29px' : '4px'}; width: 26px; height: 26px; background: #ffffff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: left 0.2s ease;"></span>
          </button>
          <span style="font-size: 0.95rem; font-weight: ${isAnnual ? '800' : '600'}; color: ${isAnnual ? 'var(--theme-b-navy, #0A2046)' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.4rem;">
            Annual Billing
            <span class="badge badge-emerald" style="font-size: 0.72rem; padding: 0.15rem 0.5rem; font-weight: 800;">
              Save 16.67% (2 Mos Free!)
            </span>
          </span>
        </div>

        <!-- 3-Tier Professionals Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.75rem; align-items: stretch; margin-bottom: 3rem;">
          
          <!-- Free Plan -->
          <div class="pricing-card" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                Job Seeker &amp; Starter
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Free
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Apply to verified school vacancies for free and maintain your educational CV.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ 0
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  100% Free Forever for Candidates
                </div>
              </div>

              <!-- Quotas -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>Free</strong> School Job Applications (Always!)
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>2</strong> Editable CV Versions
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>1</strong> Published Tutoring Service
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>5</strong> Portfolio Items &amp; Certificates
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>5</strong> Tutoring Requests / month
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center; color: #94a3b8;">
                  <span>✕</span> 0 Recurring Series Packages
                </li>
              </ul>
            </div>

            <button id="btn-pricing-free-teacher" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-weight: 800;">
              Create Free Teacher Profile
            </button>
          </div>

          <!-- Plus Plan -->
          <div class="pricing-card" style="background: #ffffff; border: 2.5px solid var(--theme-b-blue, #1266C4); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 12px 30px rgba(18,102,196,0.12);">
            <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--theme-b-blue, #1266C4); color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 0.3rem 0.9rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">
              ⭐ Ideal for Private Home Tutors
            </div>

            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--theme-b-blue, #1266C4); text-transform: uppercase;">
                Independent Practice
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Plus
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Accept verified tutoring requests from parents across Accra and Tema.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ ${isAnnual ? '390' : '39'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${isAnnual ? 'per year (Save GH₵ 78)' : 'per month'}
                </div>
              </div>

              <!-- Quotas -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>5</strong> Editable CV Versions
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>5</strong> Published Tutoring Services
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>20</strong> Portfolio Work Artifacts
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>30</strong> Parent Tutoring Responses / month
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>10</strong> Recurring Student Study Series
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>100</strong> Active Student Client Roster
                </li>
              </ul>
            </div>

            <button id="btn-pricing-plus-teacher" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-weight: 800;">
              Get Plus Plan
            </button>
          </div>

          <!-- Business Plan -->
          <div class="pricing-card" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #d97706; text-transform: uppercase;">
                Educator Agencies &amp; Academies
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--theme-b-navy, #0A2046); margin: 0.25rem 0 0.5rem 0;">
                Business
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; min-height: 42px;">
                Multi-tutor agencies, prep academies, and master educational consultants.
              </p>
              
              <div style="margin: 1.5rem 0; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                <div style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 900; color: var(--theme-b-navy, #0A2046);">
                  GH₵ ${isAnnual ? '990' : '99'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  ${isAnnual ? 'per year (Save GH₵ 198)' : 'per month'}
                </div>
              </div>

              <!-- Quotas -->
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #334155;">
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>15</strong> Editable CV Versions
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>15</strong> Published Services &amp; Masterclasses
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>60</strong> Portfolio Artifacts &amp; Testimonials
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>100</strong> Tutoring Requests / month
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>50</strong> Recurring Student Study Series
                </li>
                <li style="display: flex; gap: 0.5rem; align-items: center;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span> <strong>500</strong> Active Student Client Roster
                </li>
              </ul>
            </div>

            <button id="btn-pricing-biz-teacher" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-weight: 800;">
              Get Business Plan
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // 3. SUPPLIERS COMMERCIAL STATUS (Pending Product Owner Decision)
  renderSuppliersPricing() {
    return `
      <div style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 3rem 2.5rem; text-align: center; max-width: 820px; margin: 0 auto;">
        <span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #f59e0b; font-weight: 800; font-size: 0.85rem; padding: 0.35rem 1rem; border-radius: 999px; margin-bottom: 1.25rem; display: inline-block;">
          ⚠️ Master Guide v1.0 §11 &bull; Commercial Terms Pending
        </span>
        <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--theme-b-navy, #0A2046); margin: 0.5rem 0 1rem 0;">
          Educational Supplier Marketplace Plans
        </h2>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; max-width: 650px; margin: 0 auto 2rem;">
          In strict compliance with our platform boundaries, commercial subscription tiers for suppliers are currently <strong>pending final product owner decision</strong>. During this launch phase, vetted Ghanaian suppliers enjoy the following verified capabilities:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; text-align: left; margin-bottom: 2.5rem;">
          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🔍</div>
            <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Free Public RFQ Browsing</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
              Browse all approved institutional tender notices across Greater Accra with zero paywall.
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🔒</div>
            <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">Sealed Bid Submission</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
              Submit confidential price quotations directly to verified schools. Competitors cannot inspect your bids.
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🤝</div>
            <div style="font-weight: 800; color: var(--theme-b-navy, #0A2046); font-size: 0.95rem;">MoMo Milestone Escrow</div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
              Receive 50% mobilization deposits held securely in escrow prior to physical delivery.
            </div>
          </div>
        </div>

        <button id="btn-pricing-supplier-cta" class="btn-pill btn-primary" style="font-size: 1rem; padding: 0.8rem 2rem; font-weight: 800;">
          Register as Verified Vendor
        </button>
      </div>
    `;
  },

  attachEvents(currentPersona = 'schools') {
    // Persona Switcher Tabs
    const setPersona = (persona) => {
      this.activePersona = persona;
      App.navigate('pricing', persona, true);
    };

    document.getElementById('tab-pricing-schools')?.addEventListener('click', () => setPersona('schools'));
    document.getElementById('tab-pricing-professionals')?.addEventListener('click', () => setPersona('professionals'));
    document.getElementById('tab-pricing-suppliers')?.addEventListener('click', () => setPersona('suppliers'));

    // Billing Interval Toggle
    document.getElementById('btn-toggle-interval')?.addEventListener('click', () => {
      this.billingInterval = this.billingInterval === 'monthly' ? 'annual' : 'monthly';
      const container = document.getElementById('pricing-persona-container');
      if (container) {
        container.innerHTML = this.renderActivePersona();
        this.attachCardActions();
      }
    });

    this.attachCardActions();
  },

  attachCardActions() {
    // Schools CTAs
    document.getElementById('btn-pricing-free-school')?.addEventListener('click', () => {
      if (State.isAuthenticated() && State.isSchoolAdmin()) {
        App.navigate('schools', State.currentSchoolId || 'sch-gis-accra');
      } else {
        Modals.openLoginModal({
          initialTab: 'register_school',
          notice: "Claim your verified school profile or register your campus."
        });
      }
    });

    const triggerSchoolUpgrade = (tierName) => {
      if (typeof Modals !== 'undefined' && Modals.openSchoolSubscriptionModal) {
        Modals.openSchoolSubscriptionModal({ defaultTier: tierName });
      } else if (State.isAuthenticated() && State.isSchoolAdmin()) {
        App.navigate('schools', State.currentSchoolId || 'sch-gis-accra');
      } else {
        Modals.openLoginModal({
          notice: `Sign in with your institutional credentials to subscribe to the ${tierName} plan.`,
          redirectView: 'pricing',
          redirectParam: 'schools'
        });
      }
    };

    document.getElementById('btn-pricing-growth-school')?.addEventListener('click', () => triggerSchoolUpgrade('growth'));
    document.getElementById('btn-pricing-pro-school')?.addEventListener('click', () => triggerSchoolUpgrade('pro'));
    document.getElementById('btn-pricing-enterprise-school')?.addEventListener('click', () => triggerSchoolUpgrade('enterprise'));

    // Teachers CTAs
    document.getElementById('btn-pricing-free-teacher')?.addEventListener('click', () => {
      App.navigate('teachers');
    });

    const triggerTutorUpgrade = (tierName) => {
      if (typeof Modals !== 'undefined' && Modals.openTutorSubscriptionModal) {
        Modals.openTutorSubscriptionModal(tierName);
      } else {
        App.navigate('teachers');
      }
    };

    document.getElementById('btn-pricing-plus-teacher')?.addEventListener('click', () => triggerTutorUpgrade('plus'));
    document.getElementById('btn-pricing-biz-teacher')?.addEventListener('click', () => triggerTutorUpgrade('business'));

    // Suppliers CTA
    document.getElementById('btn-pricing-supplier-cta')?.addEventListener('click', () => {
      App.navigate('suppliers');
    });
  }
};

