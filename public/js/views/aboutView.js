/**
 * SkoolFinder Ghana - About View
 * Official About SkoolFinder Ghana Page Blueprint
 * One Platform. Four Communities. Better Connections.
 */
const AboutView = {
  activeTab: 'parents',

  journeyData: {
    parents: {
      eyebrow: 'THE PARENT JOURNEY',
      title: 'From searching to finding the right fit.',
      subtitle: 'Helping families explore educational options and make better-informed decisions.',
      steps: [
        { num: '01', text: 'Discover schools that match your needs' },
        { num: '02', text: 'Compare useful school information' },
        { num: '03', text: 'Connect with admissions teams' }
      ],
      connectedWith: 'Schools & educational institutions',
      portalLink: '/parents',
      portalLabel: 'Explore Parent Services →'
    },
    schools: {
      eyebrow: 'THE SCHOOL OWNER JOURNEY',
      title: 'From listing to thriving institution.',
      subtitle: 'Equipping school leadership with visibility, verified enrolments and institutional procurement.',
      steps: [
        { num: '01', text: 'Showcase curriculum, fees & campus' },
        { num: '02', text: 'Engage prospective families & admissions' },
        { num: '03', text: 'Source verified teachers & supplier RFQs' }
      ],
      connectedWith: 'Families, verified educators & accredited suppliers',
      portalLink: '/for-schools',
      portalLabel: 'Explore School Solutions →'
    },
    teachers: {
      eyebrow: 'THE EDUCATOR JOURNEY',
      title: 'From searching to impactful teaching.',
      subtitle: 'Connecting qualified teachers and tutors with schools and families.',
      steps: [
        { num: '01', text: 'Verify NTC credentials & build profile' },
        { num: '02', text: 'Apply directly to accredited school vacancies' },
        { num: '03', text: 'Connect with parents for private tutoring' }
      ],
      connectedWith: 'Accredited schools & Ghanaian families',
      portalLink: '/for-teachers',
      portalLabel: 'Explore Educator Opportunities →'
    },
    suppliers: {
      eyebrow: 'THE SUPPLIER JOURNEY',
      title: 'From catalog to fulfilled contracts.',
      subtitle: 'Bridging reputable suppliers with school procurement desks.',
      steps: [
        { num: '01', text: 'Register business & list supplies or services' },
        { num: '02', text: 'Review active school tenders & submit bids' },
        { num: '03', text: 'Deliver orders with protected MoMo escrow' }
      ],
      connectedWith: 'School administrators & procurement heads',
      portalLink: '/for-suppliers',
      portalLabel: 'Explore Supplier Opportunities →'
    }
  },

  async render() {
    const journey = this.journeyData[this.activeTab] || this.journeyData.parents;

    return `
      <div class="about-page-wrapper">
        
        <!-- ========================================================
             00. ABOUT HERO SECTION
             ======================================================== -->
        <section id="about-hero" class="about-hero-section">
          <!-- Ambient Glow Blobs -->
          <div style="position: absolute; top: -120px; right: -80px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(213, 166, 59, 0.16) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
          <div style="position: absolute; bottom: -80px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(18, 102, 196, 0.22) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>

          <div class="about-hero-container">
            <!-- Left Hero Content -->
            <div class="about-hero-text">
              <div class="about-hero-eyebrow">
                <span>✦</span> ABOUT SKOOLFINDER GHANA <span>✦</span>
              </div>
              <h1 class="about-hero-title">
                One platform.<br>
                Four communities.<br>
                <span class="title-gold">Better connections.</span>
              </h1>
              <p class="about-hero-desc">
                We're building a connected education ecosystem that brings families, schools, education professionals and service providers together — creating better ways to discover, connect and grow.
              </p>
              <div class="about-hero-ctas">
                <a href="#about-ecosystem" id="btn-about-explore-eco" class="btn-about-gold">
                  Explore Our Ecosystem <span>↗</span>
                </a>
                <a href="#about-story" id="btn-about-our-story" class="btn-about-outline">
                  Our Story <span>↓</span>
                </a>
              </div>
            </div>

            <!-- Right Hero: Distinctive Central Ecosystem Orbit Illustration -->
            <div class="about-orbit-wrapper" aria-label="SkoolFinder Connected Ecosystem Illustration">
              <!-- SVG Concentric Orbital Rings -->
              <svg class="about-orbit-svg-rings" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer Dashed Ring -->
                <circle cx="240" cy="240" r="215" stroke="rgba(245, 158, 11, 0.22)" stroke-width="1.5" stroke-dasharray="6 6" />
                <!-- Middle Dashed Ring -->
                <circle cx="240" cy="240" r="150" stroke="rgba(18, 102, 196, 0.35)" stroke-width="1.5" stroke-dasharray="4 4" />
                <!-- Subtle Radial Connecting Lines -->
                <line x1="120" y1="120" x2="200" y2="200" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="360" y1="120" x2="280" y2="200" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="120" y1="360" x2="200" y2="280" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="360" y1="360" x2="280" y2="280" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
              </svg>

              <!-- Central Distinctive Core Hub -->
              <div class="about-orbit-center-hub">
                <div style="font-size: 1.25rem; margin-bottom: 0.15rem;">🇬🇭</div>
                <div class="about-orbit-brand-title">SkoolFinder</div>
                <div class="about-orbit-brand-flag">GHANA</div>
              </div>

              <!-- Node 1: Parents (Top-Left) -->
              <a href="/parents" class="about-orbit-node about-orbit-node-top-left" data-portal="parents" title="Go to Parents Portal">
                <div class="about-orbit-node-icon" style="background: #eff6ff; color: #1266C4;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <div class="about-orbit-node-name">Parents</div>
                  <div class="about-orbit-node-sub">Discover schools</div>
                </div>
              </a>

              <!-- Node 2: Schools (Top-Right) -->
              <a href="/for-schools" class="about-orbit-node about-orbit-node-top-right" data-portal="schools" title="Go to Schools Portal">
                <div class="about-orbit-node-icon" style="background: #fef3c7; color: #b45309;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V7l7-4 7 4v14"></path>
                    <path d="M9 10h1"></path>
                    <path d="M9 14h1"></path>
                    <path d="M14 10h1"></path>
                    <path d="M14 14h1"></path>
                    <path d="M10 21v-4h4v4"></path>
                  </svg>
                </div>
                <div>
                  <div class="about-orbit-node-name">Schools</div>
                  <div class="about-orbit-node-sub">Grow &amp; connect</div>
                </div>
              </a>

              <!-- Node 3: Educators (Bottom-Left) -->
              <a href="/for-teachers" class="about-orbit-node about-orbit-node-bottom-left" data-portal="teachers" title="Go to Educators Portal">
                <div class="about-orbit-node-icon" style="background: #ecfdf5; color: #059669;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div>
                  <div class="about-orbit-node-name">Educators</div>
                  <div class="about-orbit-node-sub">Find opportunities</div>
                </div>
              </a>

              <!-- Node 4: Providers (Bottom-Right) -->
              <a href="/for-suppliers" class="about-orbit-node about-orbit-node-bottom-right" data-portal="suppliers" title="Go to Suppliers Portal">
                <div class="about-orbit-node-icon" style="background: #f1f5f9; color: #0284c7;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div>
                  <div class="about-orbit-node-name">Providers</div>
                  <div class="about-orbit-node-sub">Serve education</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- Sub-hero Assurance Banner -->
        <div class="about-assurance-strip">
          <div class="about-assurance-inner">
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>Built around Ghana's education community</span>
            </div>
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>Beginning in Greater Accra</span>
            </div>
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>Free public school discovery</span>
            </div>
          </div>
        </div>

        <!-- ========================================================
             01. OUR STORY
             ======================================================== -->
        <section id="about-story" class="about-story-section">
          <div class="about-story-container">
            <div class="about-section-eyebrow">01 / OUR STORY</div>
            <h2 class="about-section-heading">Education works better when we're connected.</h2>
            
            <div class="about-story-grid">
              <!-- Left Story Copy -->
              <div class="about-story-copy">
                <p>
                  Choosing a school, growing an institution, finding a teaching opportunity or reaching schools as a supplier can all be challenging when information and opportunities are scattered.
                </p>
                <p>
                  <strong>SkoolFinder Ghana was conceived to bring these journeys closer together.</strong> Our vision goes beyond a school directory: a more connected digital space where everyone supporting education can find their place.
                </p>
                <p>
                  We're beginning in Greater Accra, with ambitions to expand access and opportunity across Ghana.
                </p>
                
                <!-- Authentic Campus Photography Highlight -->
                <div style="margin-top: 1.75rem; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
                  <img src="/assets/images/campus_hero.webp" alt="Ghanaian School Campus Environment" style="width: 100%; height: 180px; object-fit: cover; display: block;" onerror="this.src='/assets/images/blueprint_family_hero.webp'" />
                  <div style="background: #f8fafc; padding: 0.65rem 1rem; font-size: 0.78rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 0.4rem;">
                    <span>📍</span> Verified Accredited Campus Community in Greater Accra
                  </div>
                </div>
              </div>

              <!-- Right Quote Card -->
              <div>
                <div class="about-quote-card">
                  <div class="about-quote-mark">“</div>
                  <p class="about-quote-text">
                    We believe better connections can help create better educational opportunities for everyone.
                  </p>
                  <div class="about-quote-tag">WHAT DRIVES SKOOLFINDER</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================
             02. THE ECOSYSTEM (4 Communities)
             ======================================================== -->
        <section id="about-ecosystem" class="about-eco-section">
          <div class="about-eco-header">
            <div class="about-section-eyebrow">02 / THE ECOSYSTEM</div>
            <h2 class="about-section-heading">Four communities. One shared purpose.</h2>
            <p style="color: #64748b; font-size: 1.05rem; line-height: 1.6; margin: 0 auto;">
              Different needs. Shared opportunities. Discover how each community plays a part in the SkoolFinder ecosystem.
            </p>
          </div>

          <!-- 4 Persona Cards in 2x2 Grid -->
          <div class="about-eco-grid">
            
            <!-- Card 01: Parents & Guardians -->
            <div class="about-community-card">
              <div class="about-card-top-visual" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
                <div class="about-card-badge-icon" style="background: #ffffff; color: #1266C4;">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div class="about-card-photo-pill">
                  <img src="/assets/images/portals/01_parents_guardians.webp" alt="Ghanaian Parents &amp; Student" onerror="this.src='/assets/images/portals/eco_real_parents.webp'" />
                </div>
              </div>
              <div class="about-card-body">
                <h3 class="about-card-title">Parents &amp; Guardians</h3>
                <p class="about-card-desc">
                  Discover schools, explore educational choices and connect with institutions that suit your family.
                </p>
                <a href="/parents" class="about-card-link" data-portal="parents">
                  Explore connections <span>&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Card 02: School Owners & Proprietors -->
            <div class="about-community-card">
              <div class="about-card-top-visual" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);">
                <div class="about-card-badge-icon" style="background: #ffffff; color: #b45309;">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V7l7-4 7 4v14"></path>
                    <path d="M9 10h1"></path>
                    <path d="M9 14h1"></path>
                    <path d="M14 10h1"></path>
                    <path d="M14 14h1"></path>
                    <path d="M10 21v-4h4v4"></path>
                  </svg>
                </div>
                <div class="about-card-photo-pill">
                  <img src="/assets/images/portals/02_school_owners.webp" alt="Ghanaian School Proprietor" onerror="this.src='/assets/images/portals/eco_real_schools.webp'" />
                </div>
              </div>
              <div class="about-card-body">
                <h3 class="about-card-title">School Owners &amp; Proprietors</h3>
                <p class="about-card-desc">
                  Build school visibility, reach families and connect with the people and services that support growth.
                </p>
                <a href="/for-schools" class="about-card-link" data-portal="schools">
                  Explore connections <span>&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Card 03: Teachers & Education Professionals -->
            <div class="about-community-card">
              <div class="about-card-top-visual" style="background: linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%);">
                <div class="about-card-badge-icon" style="background: #ffffff; color: #059669;">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div class="about-card-photo-pill">
                  <img src="/assets/images/portals/03_teachers_professionals.webp" alt="Ghanaian Teacher in Classroom" onerror="this.src='/assets/images/portals/eco_real_teachers.webp'" />
                </div>
              </div>
              <div class="about-card-body">
                <h3 class="about-card-title">Teachers &amp; Education Professionals</h3>
                <p class="about-card-desc">
                  Discover career, tutoring and specialist service opportunities in the education community.
                </p>
                <a href="/for-teachers" class="about-card-link" data-portal="teachers">
                  Explore connections <span>&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Card 04: Suppliers & Service Providers -->
            <div class="about-community-card">
              <div class="about-card-top-visual" style="background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);">
                <div class="about-card-badge-icon" style="background: #ffffff; color: #0284c7;">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div class="about-card-photo-pill">
                  <img src="/assets/images/portals/04_suppliers_service_providers.webp" alt="Ghanaian Education Supplier" onerror="this.src='/assets/images/portals/eco_real_suppliers.webp'" />
                </div>
              </div>
              <div class="about-card-body">
                <h3 class="about-card-title">Suppliers &amp; Service Providers</h3>
                <p class="about-card-desc">
                  Connect your products and professional services with the schools and institutions that need them.
                </p>
                <a href="/for-suppliers" class="about-card-link" data-portal="suppliers">
                  Explore connections <span>&rarr;</span>
                </a>
              </div>
            </div>

          </div>

          <!-- Footer Divider Line -->
          <div class="about-eco-footer-divider">
            <span>One ecosystem designed to create meaningful connections</span>
          </div>
        </section>

        <!-- ========================================================
             03. HOW WE CONNECT (Interactive Tab Journey)
             ======================================================== -->
        <section id="about-connect" class="about-connect-section">
          <div class="about-connect-container">
            <!-- Left Tabs Column -->
            <div>
              <div class="about-section-eyebrow">03 / HOW WE CONNECT</div>
              <h2 class="about-section-heading">See how it all comes together.</h2>
              <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin: 0 0 1.5rem;">
                Select a community to explore the journey and the relationships that connect the ecosystem.
              </p>

              <!-- Interactive Tabs -->
              <div class="about-tabs-list" role="tablist">
                <button type="button" class="about-tab-btn ${this.activeTab === 'parents' ? 'active' : ''}" data-target-tab="parents" role="tab" aria-selected="${this.activeTab === 'parents'}">
                  <span style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-size: 1.25rem;">👨‍👩‍👧</span>
                    <span>Parents &amp; Guardians</span>
                  </span>
                  <span class="about-tab-arrow">&rarr;</span>
                </button>

                <button type="button" class="about-tab-btn ${this.activeTab === 'schools' ? 'active' : ''}" data-target-tab="schools" role="tab" aria-selected="${this.activeTab === 'schools'}">
                  <span style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-size: 1.25rem;">🏫</span>
                    <span>School Owners</span>
                  </span>
                  <span class="about-tab-arrow">&rarr;</span>
                </button>

                <button type="button" class="about-tab-btn ${this.activeTab === 'teachers' ? 'active' : ''}" data-target-tab="teachers" role="tab" aria-selected="${this.activeTab === 'teachers'}">
                  <span style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-size: 1.25rem;">🧑‍🏫</span>
                    <span>Education Professionals</span>
                  </span>
                  <span class="about-tab-arrow">&rarr;</span>
                </button>

                <button type="button" class="about-tab-btn ${this.activeTab === 'suppliers' ? 'active' : ''}" data-target-tab="suppliers" role="tab" aria-selected="${this.activeTab === 'suppliers'}">
                  <span style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-size: 1.25rem;">📦</span>
                    <span>Suppliers &amp; Providers</span>
                  </span>
                  <span class="about-tab-arrow">&rarr;</span>
                </button>
              </div>
            </div>

            <!-- Right Interactive Journey Preview Card -->
            <div id="about-journey-card-root">
              <div class="about-journey-card">
                <div>
                  <div class="about-journey-eyebrow">${journey.eyebrow}</div>
                  <h3 class="about-journey-title">${journey.title}</h3>
                  <p class="about-journey-subtitle">${journey.subtitle}</p>

                  <div class="about-journey-steps">
                    ${journey.steps.map(s => `
                      <div class="about-step-pill-card">
                        <div class="about-step-number">${s.num}</div>
                        <div class="about-step-text">${s.text}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="about-journey-footer">
                  <span>Connected with:</span>
                  <strong>${journey.connectedWith}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================
             04. OUR PURPOSE (Mission & Vision)
             ======================================================== -->
        <section id="about-purpose" class="about-purpose-section">
          <div class="about-purpose-container">
            <div class="about-purpose-header">
              <div class="about-section-eyebrow">04 / OUR PURPOSE</div>
              <h2 class="about-section-heading">Driven by purpose. Built for possibilities.</h2>
            </div>

            <div class="about-purpose-cards-grid">
              <!-- Mission Card -->
              <div class="about-purpose-card">
                <div class="about-purpose-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <h3 class="about-purpose-title">Our Mission</h3>
                <p class="about-purpose-desc">
                  To make education discovery, professional connections and institutional growth simpler and more accessible through one connected digital platform.
                </p>
              </div>

              <!-- Vision Card -->
              <div class="about-purpose-card">
                <div class="about-purpose-icon-box" style="background: #FEF3C7; color: #D97706;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <h3 class="about-purpose-title">Our Vision</h3>
                <p class="about-purpose-desc">
                  To become a leading digital ecosystem connecting families, schools, education professionals and businesses across Ghana.
                </p>
              </div>
            </div>

            <!-- Locality Badge Banner -->
            <div class="about-locality-banner">
              <span class="about-locality-pill">GREATER ACCRA &mdash; GHANA</span>
              <span class="about-locality-text">
                Our journey begins with communities in Greater Accra, with a longer-term vision of serving education across the country.
              </span>
            </div>
          </div>
        </section>

        <!-- ========================================================
             05. BE PART OF OUR STORY (CTA Banner)
             ======================================================== -->
        <section id="about-cta" class="about-cta-section">
          <div class="about-cta-container">
            <div class="about-cta-eyebrow">05 / BE PART OF OUR STORY</div>
            <h2 class="about-cta-title">There is a place for you in the SkoolFinder ecosystem.</h2>
            <p class="about-cta-desc">
              Whether you're exploring schools, running an institution, building your education career or offering valuable services, meaningful connections start here.
            </p>
            <div class="about-cta-btns">
              <button type="button" id="btn-about-visit-skoolfinder" class="btn-about-gold">
                Visit SkoolFinder <span>↗</span>
              </button>
              <a href="#about-ecosystem" id="btn-about-scroll-communities" class="btn-about-outline">
                Explore the Four Communities <span>↑</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    `;
  },

  updateJourneyCard(tabKey) {
    this.activeTab = tabKey;
    const journey = this.journeyData[tabKey] || this.journeyData.parents;
    const cardRoot = document.getElementById('about-journey-card-root');
    if (!cardRoot) return;

    cardRoot.innerHTML = `
      <div class="about-journey-card" style="animation: fadeIn 0.25s ease-in-out;">
        <div>
          <div class="about-journey-eyebrow">${journey.eyebrow}</div>
          <h3 class="about-journey-title">${journey.title}</h3>
          <p class="about-journey-subtitle">${journey.subtitle}</p>

          <div class="about-journey-steps">
            ${journey.steps.map(s => `
              <div class="about-step-pill-card">
                <div class="about-step-number">${s.num}</div>
                <div class="about-step-text">${s.text}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="about-journey-footer">
          <span>Connected with:</span>
          <strong>${journey.connectedWith}</strong>
        </div>
      </div>
    `;

    // Update active tab buttons
    document.querySelectorAll('.about-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-target-tab') === tabKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });
  },

  attachEvents() {
    // Interactive Tab Clicks
    document.querySelectorAll('.about-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabKey = btn.getAttribute('data-target-tab');
        if (tabKey) {
          this.updateJourneyCard(tabKey);
        }
      });
    });

    // Anchor Smooth Scrolling
    document.getElementById('btn-about-explore-eco')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#about-ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btn-about-our-story')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#about-story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btn-about-scroll-communities')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#about-ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btn-about-visit-skoolfinder')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Portal Links in Community Cards and Orbit Nodes
    document.querySelectorAll('[data-portal]').forEach(link => {
      link.addEventListener('click', (e) => {
        const portal = link.getAttribute('data-portal');
        if (!portal) return;
        e.preventDefault();
        if (portal === 'parents') App.navigate('parents');
        else if (portal === 'schools') App.navigate('for-schools');
        else if (portal === 'teachers') App.navigate('for-teachers');
        else if (portal === 'suppliers') App.navigate('for-suppliers');
      });
    });
  }
};
