/**
 * SkoolFinder Ghana - Opportunities View
 * Aggregates Admissions, Careers, and Procurement Tenders across Greater Accra
 */
const OpportunitiesView = {
  async render() {
    return `
      <div class="opportunities-page-wrapper" style="background: #f8fafc; min-height: 100vh; padding-bottom: 5rem;">
        
        <!-- ========================================================
             OPPORTUNITIES HERO HEADER
             ======================================================== -->
        <section class="opportunities-hero-section" style="background: linear-gradient(135deg, #06162E 0%, #0A2046 50%, #0D2D5E 100%); color: #ffffff; padding: 4.5rem 1.5rem 3.5rem; position: relative; overflow: hidden; border-bottom: 2px solid rgba(217, 119, 6, 0.4);">
          <!-- Ambient Background Glows -->
          <div style="position: absolute; top: -100px; right: -80px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
          <div style="position: absolute; bottom: -80px; left: -60px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(18, 102, 196, 0.25) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>

          <div class="container" style="max-width: 1140px; margin: 0 auto; position: relative; z-index: 2; text-align: center;">
            
            <!-- Eyebrow Badge -->
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.45); color: #fde68a; padding: 0.4rem 1.1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.25rem;">
              <span>✨</span>
              <span>Discover Opportunities Across SkoolFinder</span>
            </div>

            <!-- Main Heading -->
            <h1 style="font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif); font-size: clamp(2rem, 4.5vw, 3.25rem); font-weight: 800; line-height: 1.2; margin: 0 auto 1.25rem; max-width: 960px; color: #ffffff; letter-spacing: -0.02em;">
              Connecting People, Schools &amp; Businesses to New Possibilities.
            </h1>

            <!-- Descriptive Body -->
            <p style="font-size: clamp(1rem, 1.8vw, 1.15rem); line-height: 1.65; color: #cbd5e1; max-width: 820px; margin: 0 auto 1.75rem; font-weight: 400;">
              Explore opportunities across Ghana's education sector, starting with Greater Accra. From school admissions and education careers to procurement tenders and service contracts, SkoolFinder brings opportunities together in one convenient place.
            </p>

            <!-- Key Mantra / Action Statement -->
            <div style="display: inline-block; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.75rem 1.75rem; border-radius: 14px; margin-bottom: 2rem;">
              <span style="font-size: 1rem; font-weight: 700; color: #fde68a; letter-spacing: 0.01em;">
                Find the right opportunity. Make meaningful connections. Take your next step.
              </span>
            </div>

            <!-- Quick Navigation Jump Pills -->
            <div style="display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap;">
              <a href="#opp-proprietors" class="btn-opp-jump" style="background: rgba(255, 255, 255, 0.12); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 9999px; padding: 0.55rem 1.25rem; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s;">
                <span>🏫</span> School Admissions
              </a>
              <a href="#opp-teachers" class="btn-opp-jump" style="background: rgba(255, 255, 255, 0.12); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 9999px; padding: 0.55rem 1.25rem; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s;">
                <span>🧑‍🏫</span> Teaching Careers
              </a>
              <a href="#opp-suppliers" class="btn-opp-jump" style="background: rgba(255, 255, 255, 0.12); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 9999px; padding: 0.55rem 1.25rem; font-size: 0.86rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s;">
                <span>📦</span> Procurement Tenders
              </a>
            </div>

          </div>
        </section>

        <!-- ========================================================
             PIN 1: SCHOOL OWNERS & PROPRIETORS SPOTLIGHT
             ======================================================== -->
        <section id="opp-proprietors" class="home-section-overlay home-section-overlay-light" style="padding: 3.5rem 1.5rem 2.25rem; scroll-margin-top: 80px;">
          <div class="container" style="max-width: 1140px; margin: 0 auto;">
            <div class="proprietors-spotlight-card">
              
              <!-- Top Hero Grid: Left Content + Right Curved Image -->
              <div class="proprietors-hero-grid">
                <div class="proprietors-hero-text">
                  <div class="proprietors-accent-bar"></div>
                  <h2 class="proprietors-title">
                    For School Owners &amp; Proprietors
                  </h2>
                  <p class="proprietors-desc">
                    Grow your school's visibility, attract prospective families, manage admissions, recruit staff and connect with suppliers through one platform.
                  </p>
                  <button type="button" id="btn-opp-proprietors-solutions" class="btn-proprietors-gold">
                    Explore School Owner Solutions
                  </button>
                </div>

                <div class="proprietors-hero-image-wrap">
                  <picture>
                    <source srcset="/assets/images/portals/school_proprietors_mockup_clean.webp" type="image/webp">
                    <img src="/assets/images/portals/02_school_owners.jpg" alt="Ghanaian School Owners &amp; Proprietors on SkoolFinder" loading="lazy">
                  </picture>
                </div>
              </div>

              <!-- Primary Feature Banner: Schools Open for Admissions -->
              <div class="proprietors-admissions-banner">
                <div class="proprietors-banner-left">
                  <div class="proprietors-banner-icon" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <polyline points="9 16 11 18 15 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 class="proprietors-banner-title">
                      Schools Open for Admissions
                    </h3>
                    <p class="proprietors-banner-sub">
                      Showcase schools accepting applications and help parents discover available admission opportunities.
                    </p>
                  </div>
                </div>

                <button type="button" id="btn-opp-proprietors-open-admissions" class="btn-proprietors-navy">
                  Explore Open Admissions &rarr;
                </button>
              </div>

              <!-- Secondary 2-Column Grid -->
              <div class="proprietors-secondary-grid">
                
                <!-- Card 1: Advertise Teaching & Staff Vacancies -->
                <div class="proprietors-secondary-card proprietors-card-vacancies">
                  <div class="proprietors-sec-icon-vacancies" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="proprietors-sec-title">
                      Advertise Teaching &amp; Staff Vacancies
                    </h4>
                    <p class="proprietors-sec-sub">
                      Reach qualified teachers and education professionals through SkoolFinder.
                    </p>
                    <button type="button" id="btn-opp-proprietors-post-vacancy" class="proprietors-sec-link-blue">
                      Post a Staff Vacancy &rarr;
                    </button>
                  </div>
                </div>

                <!-- Card 2: Publish School Tenders -->
                <div class="proprietors-secondary-card proprietors-card-tenders">
                  <div class="proprietors-sec-icon-tenders" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      <path d="M9 12h6"></path>
                      <path d="M9 16h6"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="proprietors-sec-title">
                      Publish School Tenders
                    </h4>
                    <p class="proprietors-sec-sub">
                      Advertise your school's procurement needs and receive bids from trusted suppliers and service providers.
                    </p>
                    <button type="button" id="btn-opp-proprietors-publish-tender" class="proprietors-sec-link-green">
                      Publish a Tender &rarr;
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        <!-- ========================================================
             PIN 2: TEACHERS & EDUCATION PROFESSIONALS SPOTLIGHT
             ======================================================== -->
        <section id="opp-teachers" class="home-section-overlay home-section-overlay-tint" style="padding: 2.25rem 1.5rem 2.25rem; scroll-margin-top: 80px;">
          <div class="container" style="max-width: 1140px; margin: 0 auto;">
            <div class="teachers-spotlight-card">

              <!-- Top Hero Grid: Left Content + Right Curved Image -->
              <div class="teachers-hero-grid">
                <div class="teachers-hero-text">
                  <!-- Eyebrow Badge -->
                  <div class="teachers-eyebrow-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    <span>TEACHERS &amp; EDUCATION PROFESSIONALS</span>
                  </div>
                  <div class="teachers-title-wrap">
                    <div class="teachers-accent-bar" aria-hidden="true"></div>
                    <h2 class="teachers-title">
                      Discover your next opportunity in education
                    </h2>
                  </div>
                  <p class="teachers-desc">
                    Explore teaching and non-teaching vacancies from schools across Greater Accra.
                  </p>
                </div>

                <div class="teachers-hero-image-wrap">
                  <picture>
                    <source srcset="/assets/images/portals/teachers_mockup_clean.webp" type="image/webp">
                    <img src="/assets/images/portals/teachers_mockup_clean.jpg" alt="Ghanaian Teachers &amp; Education Professionals on SkoolFinder" loading="lazy">
                  </picture>
                </div>
              </div>

              <!-- Middle Banner: Latest Opportunities -->
              <div class="teachers-opportunities-banner">
                <div class="teachers-banner-left">
                  <div class="teachers-banner-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div class="teachers-banner-divider" aria-hidden="true"></div>
                  <h3 class="teachers-banner-title">Latest Opportunities</h3>
                </div>
                <div class="teachers-banner-badge">📍 Greater Accra</div>
              </div>

              <!-- 3-Column Jobs Grid -->
              <div class="teachers-jobs-grid">
                
                <!-- Card 1: Mathematics Teacher -->
                <div class="teachers-job-card teachers-card-maths">
                  <div>
                    <h3 class="teachers-job-title">Mathematics Teacher</h3>
                    <div class="teachers-job-school">Crownridge International School</div>
                    
                    <div class="teachers-job-meta-row">
                      <span>📍 Accra</span>
                      <span class="teachers-pill-fulltime">Full-time</span>
                    </div>

                    <div class="teachers-job-deadline">
                      <span>📅</span>
                      <span>Application Deadline: <strong>20 Nov 2026</strong></span>
                    </div>
                  </div>

                  <button type="button" id="btn-opp-job-1" class="btn-job-details-link">
                    View Details &rarr;
                  </button>
                </div>

                <!-- Card 2: School Administrator -->
                <div class="teachers-job-card teachers-card-admin">
                  <div>
                    <h3 class="teachers-job-title">School Administrator</h3>
                    <div class="teachers-job-school">Tema Royal Academy</div>
                    
                    <div class="teachers-job-meta-row">
                      <span>📍 Tema</span>
                      <span class="teachers-pill-admin">Full-time</span>
                    </div>

                    <div class="teachers-job-deadline">
                      <span>📅</span>
                      <span>Application Deadline: <strong>24 Nov 2026</strong></span>
                    </div>
                  </div>

                  <button type="button" id="btn-opp-job-2" class="btn-job-details-link">
                    View Details &rarr;
                  </button>
                </div>

                <!-- Card 3: Teaching Assistant -->
                <div class="teachers-job-card teachers-card-assistant">
                  <div>
                    <h3 class="teachers-job-title">Teaching Assistant</h3>
                    <div class="teachers-job-school">Hope Bridge Academy</div>
                    
                    <div class="teachers-job-meta-row">
                      <span>📍 Accra</span>
                      <span class="teachers-pill-parttime">Part-time</span>
                    </div>

                    <div class="teachers-job-deadline">
                      <span>📅</span>
                      <span>Application Deadline: <strong>27 Nov 2026</strong></span>
                    </div>
                  </div>

                  <button type="button" id="btn-opp-job-3" class="btn-job-details-link">
                    View Details &rarr;
                  </button>
                </div>

              </div>

              <!-- Bottom Action CTAs -->
              <div class="teachers-ctas-wrap">
                <button type="button" id="btn-opp-teachers-all-jobs" class="btn-teachers-all-jobs">
                  <span>🔍</span> View All Education Jobs &rarr;
                </button>
                <button type="button" id="btn-opp-teachers-join-pro" class="btn-teachers-join-pro">
                  <span>👤+</span> Join as a Professional
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- ========================================================
             PIN 3: SUPPLIERS & SERVICE PROVIDERS SPOTLIGHT
             ======================================================== -->
        <section id="opp-suppliers" class="home-section-overlay home-section-overlay-light" style="padding: 2.25rem 1.5rem 3.5rem; scroll-margin-top: 80px;">
          <div class="container" style="max-width: 1140px; margin: 0 auto;">
            <div class="suppliers-spotlight-card">

              <!-- Hero Row: Header Text Left + Photo Right -->
              <div class="suppliers-hero-grid">
                <div class="suppliers-hero-text">
                  <!-- Eyebrow Badge -->
                  <div class="suppliers-eyebrow-badge">
                    <span>🤝</span> SUPPLIERS &amp; SERVICE PROVIDERS
                  </div>
                  <div class="suppliers-title-wrap">
                    <div class="suppliers-accent-bar" aria-hidden="true"></div>
                    <h2 class="suppliers-title">Supply, Serve and Partner with Schools</h2>
                  </div>
                  <p class="suppliers-desc">
                    Discover school tenders, procurement needs and business opportunities from schools across Greater Accra.
                  </p>
                </div>

                <div class="suppliers-hero-image-wrap">
                  <picture>
                    <source srcset="/assets/images/portals/suppliers_mockup_clean.webp" type="image/webp">
                    <img src="/assets/images/portals/suppliers_mockup_clean.jpg" alt="Educational suppliers and service providers partnering with Ghanaian schools" loading="lazy">
                  </picture>
                </div>
              </div>

              <!-- Middle Banner: Latest School Tenders -->
              <div class="suppliers-tenders-banner">
                <div class="suppliers-banner-left">
                  <div class="suppliers-banner-icon" aria-hidden="true">📋</div>
                  <div class="suppliers-banner-divider" aria-hidden="true"></div>
                  <h3 class="suppliers-banner-title">Latest School Tenders</h3>
                </div>
                <div class="suppliers-banner-badge">📍 Greater Accra</div>
              </div>

              <!-- 3-Column Tenders Grid -->
              <div class="suppliers-tenders-grid">

                <!-- Tender Card 1: ICT Equipment -->
                <div class="suppliers-tender-card suppliers-card-ict">
                  <div class="suppliers-tender-top">
                    <h4 class="suppliers-tender-title">Supply of ICT Equipment</h4>
                    <p class="suppliers-tender-school">Accra Commonwealth School</p>
                    <div class="suppliers-tender-meta-row">
                      <span class="suppliers-tender-location">📍 Accra</span>
                      <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                      <span class="suppliers-pill-goods">📦 Goods Supply</span>
                    </div>
                    <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>28 Nov 2026</strong></p>
                  </div>
                  <button type="button" id="btn-opp-tender-1" class="btn-tender-details-link">View Details &rarr;</button>
                </div>

                <!-- Tender Card 2: Facility Maintenance -->
                <div class="suppliers-tender-card suppliers-card-maintenance">
                  <div class="suppliers-tender-top">
                    <h4 class="suppliers-tender-title">Maintenance of School Facilities</h4>
                    <p class="suppliers-tender-school">Tema Methodist Basic School</p>
                    <div class="suppliers-tender-meta-row">
                      <span class="suppliers-tender-location">📍 Tema</span>
                      <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                      <span class="suppliers-pill-works">🔨 Works &amp; Services</span>
                    </div>
                    <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>02 Dec 2026</strong></p>
                  </div>
                  <button type="button" id="btn-opp-tender-2" class="btn-tender-details-link">View Details &rarr;</button>
                </div>

                <!-- Tender Card 3: Cleaning Services -->
                <div class="suppliers-tender-card suppliers-card-cleaning">
                  <div class="suppliers-tender-top">
                    <h4 class="suppliers-tender-title">Provision of Cleaning Services</h4>
                    <p class="suppliers-tender-school">East Legon International School</p>
                    <div class="suppliers-tender-meta-row">
                      <span class="suppliers-tender-location">📍 East Legon</span>
                      <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                      <span class="suppliers-pill-service">📑 Service Contract</span>
                    </div>
                    <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>05 Dec 2026</strong></p>
                  </div>
                  <button type="button" id="btn-opp-tender-3" class="btn-tender-details-link">View Details &rarr;</button>
                </div>

              </div>

              <!-- Bottom Action CTAs -->
              <div class="suppliers-ctas-wrap">
                <button type="button" id="btn-opp-suppliers-all-tenders" class="btn-suppliers-all-tenders">
                  <span>🔨</span> View All Active School Tenders &rarr;
                </button>
                <button type="button" id="btn-opp-suppliers-join-provider" class="btn-suppliers-join-provider">
                  <span>👥</span> Join as a Supplier / Service Provider
                </button>
              </div>

            </div>
          </div>
        </section>

      </div>
    `;
  },

  attachEvents() {
    // Smooth scroll for anchor jump pills
    document.querySelectorAll('.btn-opp-jump').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Proprietors Actions
    document.getElementById('btn-opp-proprietors-solutions')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-schools');
    });

    document.getElementById('btn-opp-proprietors-open-admissions')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    document.getElementById('btn-opp-proprietors-post-vacancy')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    document.getElementById('btn-opp-proprietors-publish-tender')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.openPostRFQModal) {
        Modals.openPostRFQModal();
      } else {
        App.navigate('for-schools');
      }
    });

    // Teachers Actions
    document.getElementById('btn-opp-teachers-all-jobs')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('teachers');
    });

    document.getElementById('btn-opp-teachers-join-pro')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    ['btn-opp-job-1', 'btn-opp-job-2', 'btn-opp-job-3'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        e.preventDefault();
        App.navigate('teachers');
      });
    });

    // Suppliers Actions
    document.getElementById('btn-opp-suppliers-all-tenders')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('suppliers');
    });

    document.getElementById('btn-opp-suppliers-join-provider')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-suppliers');
    });

    ['btn-opp-tender-1', 'btn-opp-tender-2', 'btn-opp-tender-3'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        e.preventDefault();
        App.navigate('suppliers');
      });
    });
  }
};
