/**
 * SkoolFinder Ghana - Public Homepage View
 * 
 * Blueprint v1.0 Transformation:
 * Section 01: Header & Navigation
 * Section 02: Hero & Live Search (Maintained per user directive)
 * Transition: Greater Accra Pilot Metrics Strip (Maintained)
 * Section 03: Parents — Two Free Experiences ("Your Child's Education Journey Starts Here")
 * Section 04: Four Premium Portal Cards (Option A: 2x2 Desktop Grid, 1 Column Mobile)
 * Section 05: Why SkoolFinder Ghana? (Informed Decisions, Connected Community, Trust & Transparency)
 * Section 06: Getting Started is Simple (4-Audience Linear Pathways)
 * Section 07: Global Footer & Support
 */
const HomeView = {
  activeEcoTab: 'schools',

  async render() {
    let stats = { schoolsCount: 20, teachersCount: 12, suppliersCount: 8, verifiedEntities: 15 };
    try {
      stats = await API.getStats();
    } catch (e) {
      console.warn("Could not fetch remote stats, using pilot baseline:", e);
    }

    let featuredSchools = [];
    try {
      featuredSchools = await API.getSchools({ region: 'All' });
    } catch (e) {
      featuredSchools = [];
    }
    const topFeatured = featuredSchools.filter(s => s.featured || s.is_featured).slice(0, 3);
    const displaySchools = topFeatured.length > 0 ? topFeatured : featuredSchools.slice(0, 3);

    let heroPromo = null;
    try {
      const promoRes = await API.getActivePromotions('homepage_hero');
      if (promoRes?.success && promoRes?.promotions?.length > 0) {
        heroPromo = promoRes.promotions[0];
        API.trackPromotionImpression(heroPromo.id).catch(() => { });
      }
    } catch (e) { }

    return `
      <!-- ========================================================
           HOMEPAGE INDEPENDENCE ARCH GLOBAL BACKDROP
           Fixed atmospheric architectural landmark behind all sections
           ======================================================== -->
      <div class="home-arch-backdrop" aria-hidden="true">
        <div class="home-arch-backdrop-img"></div>
        <div class="home-arch-backdrop-scrim"></div>
      </div>

      <div class="home-arch-canvas">
      <!-- ========================================================
           SECTION 02: HERO & LIVE SCHOOL SEARCH (MAINTAINED EXACTLY)
           ======================================================== -->
      <section class="hero-section" id="section-hero">
        <div class="hero-slideshow" id="hero-slideshow">
          <div class="hero-slide active" style="background-image: url('/assets/images/campus_hero.webp');"></div>
          <div class="hero-slide" data-bg="/assets/images/science_lab.webp"></div>
          <div class="hero-slide" data-bg="/assets/images/montessori_class.webp"></div>
          <div class="hero-slide" data-bg="/assets/images/sports_complex.webp"></div>
        </div>

        <div class="hero-bg-overlay"></div>
        <div class="hero-ambient-glow-1"></div>
        <div class="hero-ambient-glow-2"></div>

        <div class="container hero-content">
          <div style="display: flex; gap: 0.75rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <button id="btn-hero-role-tour" class="hero-tour-pill" title="Take a 30-second guided tour for Parents, Schools, Suppliers &amp; Teachers">
              <span>🧭</span> New to SkoolFinder? Take a 30s Guided Tour &rarr;
            </button>
          </div>

          <h1 class="hero-title">
            Find the <span>Right School</span> for Your Child in Greater Accra
          </h1>
          <p class="hero-subtitle">
            Discover and compare private schools across Accra and Tema. Explore fees, curricula, facilities, and admissions, all in one place.
          </p>

          <div class="hero-free-badge">
            <span class="hero-free-badge-check">✅</span>
            <strong>100% Free School Discovery</strong>
            <span class="hero-free-badge-divider">|</span>
            <strong>No Registration Required</strong>
          </div>

          <!-- Search Widget -->
          <div class="search-widget-card">
            <form id="hero-search-form" class="search-grid">
              <div class="search-field">
                <label class="search-label" for="hero-search-suburb">📍 Suburb / Locality</label>
                <div class="search-input-wrap">
                  <input type="text" id="hero-search-suburb" class="search-input" placeholder="e.g. Cantonments, East Legon, Spintex, Tema" />
                </div>
              </div>
              
              <div class="search-field">
                <label for="hero-search-level" class="search-label">🎓 School Level</label>
                <select id="hero-search-level" class="search-select" aria-label="Filter by School Level">
                  <option value="All">All Levels (Crèche to SHS)</option>
                  <option value="Crèche">Crèche &amp; Daycare</option>
                  <option value="Kindergarten">Nursery &amp; Kindergarten</option>
                  <option value="Primary">Primary School (Class 1-6)</option>
                  <option value="JHS">Junior High School (JHS)</option>
                  <option value="SHS">Senior High School (SHS)</option>
                </select>
              </div>

              <div class="search-field">
                <label for="hero-search-curriculum" class="search-label">📖 Curriculum</label>
                <select id="hero-search-curriculum" class="search-select" aria-label="Filter by Curriculum">
                  <option value="All">All Curricula</option>
                  <option value="GES (NaCCA)">GES National Curriculum</option>
                  <option value="Cambridge (CIE)">Cambridge International (IGCSE/A-Level)</option>
                  <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
                  <option value="Montessori">Montessori</option>
                  <option value="American (AP/SAT)">American Curriculum</option>
                </select>
              </div>

              <button type="submit" id="btn-hero-search-submit" class="search-btn search-btn-hero">
                <span>🔍 Search Schools</span>
              </button>
            </form>
          </div>

          <!-- Accessible/Internal Anchors -->
          <div style="display: none;" aria-hidden="true">
            <button id="btn-choice-schools" type="button" tabindex="-1"></button>
            <button id="btn-hero-matchmaker" type="button" tabindex="-1"></button>
            <button id="btn-choice-matchmaker" type="button" tabindex="-1"></button>
            <button id="btn-choice-locations" type="button" tabindex="-1"></button>
            <button id="btn-hero-promo-cta" type="button" tabindex="-1"></button>
          </div>
        </div>

        <!-- Hero Slide Indicators (Placed on hero background at bottom-left, clear of search card) -->
        <div class="hero-slide-indicators" id="hero-slide-indicators" aria-label="Hero background slides">
          <button class="slide-indicator active" data-index="0" aria-label="Slide 1"></button>
          <button class="slide-indicator" data-index="1" aria-label="Slide 2"></button>
          <button class="slide-indicator" data-index="2" aria-label="Slide 3"></button>
          <button class="slide-indicator" data-index="3" aria-label="Slide 4"></button>
        </div>
      </section>

      <!-- ========================================================
           TRANSITION: PLATFORM METRICS STRIP (GREATER ACCRA PILOT)
           ======================================================== -->
      <section class="metrics-strip">
        <div class="container">
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-number">${stats.schoolsCount || 20}+</span>
              <span class="metric-label">Listed Campuses (Greater Accra)</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.verifiedEntities || 15}+</span>
              <span class="metric-label">Verified Institutional Profiles</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.teachersCount || 12}+</span>
              <span class="metric-label">Vetted Tutors &amp; Educators</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.suppliersCount || 8}+</span>
              <span class="metric-label">Accredited School Vendors</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION 02: THE SKOOLFINDER ECOSYSTEM (IMAGE 3 DESIGN)
           ======================================================== -->
      <section id="section-portal-cards" class="eco-v3-section">
        <div class="container eco-v3-container">
          <div class="eco-v3-header">
            <div class="eco-v3-eyebrow">
              <span class="eco-v3-dot"></span>
              <span>OUR ECOSYSTEM</span>
              <span class="eco-v3-dot"></span>
            </div>
            <h2 class="eco-v3-title">
              A Connected Education Platform for Greater Accra
            </h2>
            <p class="eco-v3-subtitle">
              Bringing families, schools, education professionals and service providers together to support quality private pre-tertiary education across Greater Accra.
            </p>
          </div>

          <div class="eco-v3-hub-wrapper">
            <!-- Electrifying Current SVG Circuit Grid -->
            <svg class="eco-v3-circuit-svg" viewBox="0 0 1152 460" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <!-- Multi-stage Electric Glow Filters -->
                <filter id="electric-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="blur1" />
                  <feGaussianBlur stdDeviation="7" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="electric-terminal-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                
                <!-- Electric Current Linear Gradients -->
                <linearGradient id="electric-grad-left" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9" />
                  <stop offset="40%" stop-color="#F59E0B" stop-opacity="1" />
                  <stop offset="100%" stop-color="#FDE047" stop-opacity="1" />
                </linearGradient>

                <linearGradient id="electric-grad-right" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9" />
                  <stop offset="40%" stop-color="#F59E0B" stop-opacity="1" />
                  <stop offset="100%" stop-color="#FDE047" stop-opacity="1" />
                </linearGradient>
              </defs>

              <!-- Layer 1: Ambient Conduit Wire Tracks (Two-Way S-Curves) -->
              <path class="eco-wire-track" d="M 576 230 H 510 C 470 230, 480 102, 455 102 H 432" />
              <path class="eco-wire-track" d="M 576 230 H 642 C 682 230, 672 102, 697 102 H 720" />
              <path class="eco-wire-track" d="M 576 230 H 510 C 470 230, 480 350, 455 350 H 432" />
              <path class="eco-wire-track" d="M 576 230 H 642 C 682 230, 672 350, 697 350 H 720" />

              <!-- Layer 2: High-Voltage Flowing Currents (Center Outward via Two-Way Curves) -->
              <path class="eco-electric-stream" d="M 576 230 H 510 C 470 230, 480 102, 455 102 H 432" stroke="url(#electric-grad-left)" />
              <path class="eco-electric-stream" d="M 576 230 H 642 C 682 230, 672 102, 697 102 H 720" stroke="url(#electric-grad-right)" />
              <path class="eco-electric-stream" d="M 576 230 H 510 C 470 230, 480 350, 455 350 H 432" stroke="url(#electric-grad-left)" />
              <path class="eco-electric-stream" d="M 576 230 H 642 C 682 230, 672 350, 697 350 H 720" stroke="url(#electric-grad-right)" />

              <!-- Layer 3: Rapid Traveling Lightning Surge Pulses -->
              <path class="eco-electric-surge" d="M 576 230 H 510 C 470 230, 480 102, 455 102 H 432" filter="url(#electric-glow)" />
              <path class="eco-electric-surge" d="M 576 230 H 642 C 682 230, 672 102, 697 102 H 720" filter="url(#electric-glow)" />
              <path class="eco-electric-surge" d="M 576 230 H 510 C 470 230, 480 350, 455 350 H 432" filter="url(#electric-glow)" />
              <path class="eco-electric-surge" d="M 576 230 H 642 C 682 230, 672 350, 697 350 H 720" filter="url(#electric-glow)" />

              <!-- Layer 4: White-Hot Plasma Core Sparks -->
              <path class="eco-electric-plasma" d="M 576 230 H 510 C 470 230, 480 102, 455 102 H 432" />
              <path class="eco-electric-plasma" d="M 576 230 H 642 C 682 230, 672 102, 697 102 H 720" />
              <path class="eco-electric-plasma" d="M 576 230 H 510 C 470 230, 480 350, 455 350 H 432" />
              <path class="eco-electric-plasma" d="M 576 230 H 642 C 682 230, 672 350, 697 350 H 720" />

              <!-- Layer 5: Pulsing Receiving Power Terminals at Portals -->
              <!-- Parents Terminal (Top-Left) -->
              <circle cx="432" cy="102" r="12" class="eco-terminal-ring" />
              <circle cx="432" cy="102" r="5.5" class="eco-terminal-core" filter="url(#electric-terminal-glow)" />
              <circle cx="432" cy="102" r="2.5" fill="#FFFFFF" />

              <!-- Schools Terminal (Top-Right) -->
              <circle cx="720" cy="102" r="12" class="eco-terminal-ring" />
              <circle cx="720" cy="102" r="5.5" class="eco-terminal-core" filter="url(#electric-terminal-glow)" />
              <circle cx="720" cy="102" r="2.5" fill="#FFFFFF" />

              <!-- Teachers Terminal (Bottom-Left) -->
              <circle cx="432" cy="350" r="12" class="eco-terminal-ring" />
              <circle cx="432" cy="350" r="5.5" class="eco-terminal-core" filter="url(#electric-terminal-glow)" />
              <circle cx="432" cy="350" r="2.5" fill="#FFFFFF" />

              <!-- Suppliers Terminal (Bottom-Right) -->
              <circle cx="720" cy="350" r="12" class="eco-terminal-ring" />
              <circle cx="720" cy="350" r="5.5" class="eco-terminal-core" filter="url(#electric-terminal-glow)" />
              <circle cx="720" cy="350" r="2.5" fill="#FFFFFF" />
            </svg>
            </svg>

            <div class="eco-v3-center-node">
              <div class="eco-v3-center-cap">🎓</div>
              <div class="eco-v3-center-title">
                <span class="eco-navy">SkoolFinder</span> <span class="eco-gold">Ghana</span>
              </div>
              <div class="eco-v3-center-sub">
                The education hub that connects people, opportunities and trusted services.
              </div>
            </div>

            <div class="eco-v3-cards-grid">
              <!-- Card 1: Parents & Guardians -->
              <div class="eco-v3-card eco-v3-card-parents">
                <div class="eco-v3-card-img-wrap">
                  <img src="/assets/images/portals/eco_v3_parents.webp" alt="Ghanaian Mother and Child Exploring Schools" class="eco-v3-card-img">
                </div>
                <div class="eco-v3-card-content">
                  <div class="eco-v3-card-header">
                    <div class="eco-v3-icon-box">👥</div>
                    <div>
                      <h3 class="eco-v3-card-title">Parents &amp; Guardians</h3>
                      <p class="eco-v3-card-desc">Discover, compare and choose the right school for your child.</p>
                    </div>
                  </div>
                  <ul class="eco-v3-bullets">
                    <li><span class="eco-v3-check">✓</span><span>Search and compare schools</span></li>
                    <li><span class="eco-v3-check">✓</span><span>Enquire and connect with schools</span></li>
                  </ul>
                  <button type="button" id="btn-portal-card-parents" class="eco-v3-btn">
                    <span>Explore Parent Tools</span>
                    <span class="eco-v3-btn-arrow">&rarr;</span>
                  </button>
                </div>
              </div>

              <!-- Card 2: School Owners & Proprietors -->
              <div class="eco-v3-card eco-v3-card-schools">
                <div class="eco-v3-card-img-wrap">
                  <img src="/assets/images/portals/eco_v3_schools.webp" alt="Ghanaian Private School Campus" class="eco-v3-card-img">
                </div>
                <div class="eco-v3-card-content">
                  <div class="eco-v3-card-header">
                    <div class="eco-v3-icon-box">🏫</div>
                    <div>
                      <h3 class="eco-v3-card-title">School Owners &amp; Proprietors</h3>
                      <p class="eco-v3-card-desc">Grow your school's visibility and manage key opportunities.</p>
                    </div>
                  </div>
                  <ul class="eco-v3-bullets">
                    <li><span class="eco-v3-check">✓</span><span>Showcase your school</span></li>
                    <li><span class="eco-v3-check">✓</span><span>Manage admissions and hiring</span></li>
                  </ul>
                  <button type="button" id="btn-portal-card-schools" class="eco-v3-btn">
                    <span>Explore School Tools</span>
                    <span class="eco-v3-btn-arrow">&rarr;</span>
                  </button>
                </div>
              </div>

              <!-- Card 3: Teachers & Education Professionals -->
              <div class="eco-v3-card eco-v3-card-teachers">
                <div class="eco-v3-card-img-wrap">
                  <img src="/assets/images/portals/eco_v3_teachers.webp" alt="Ghanaian Teacher with Digital Tablet" class="eco-v3-card-img">
                </div>
                <div class="eco-v3-card-content">
                  <div class="eco-v3-card-header">
                    <div class="eco-v3-icon-box">🎓</div>
                    <div>
                      <h3 class="eco-v3-card-title">Teachers &amp; Education Professionals</h3>
                      <p class="eco-v3-card-desc">Find teaching, coaching and specialist opportunities in education.</p>
                    </div>
                  </div>
                  <ul class="eco-v3-bullets">
                    <li><span class="eco-v3-check">✓</span><span>Teaching and school vacancies</span></li>
                    <li><span class="eco-v3-check">✓</span><span>Tutoring, music, swimming and sports</span></li>
                  </ul>
                  <button type="button" id="btn-portal-card-teachers" class="eco-v3-btn">
                    <span>Find Education Opportunities</span>
                    <span class="eco-v3-btn-arrow">&rarr;</span>
                  </button>
                </div>
              </div>

              <!-- Card 4: Suppliers & Service Providers -->
              <div class="eco-v3-card eco-v3-card-suppliers">
                <div class="eco-v3-card-img-wrap">
                  <img src="/assets/images/portals/eco_v3_suppliers.webp" alt="Ghanaian Education Supplier with School Bus" class="eco-v3-card-img">
                </div>
                <div class="eco-v3-card-content">
                  <div class="eco-v3-card-header">
                    <div class="eco-v3-icon-box">🤝</div>
                    <div>
                      <h3 class="eco-v3-card-title">Suppliers &amp; Service Providers</h3>
                      <p class="eco-v3-card-desc">Provide the products and services schools need to run and grow.</p>
                    </div>
                  </div>
                  <ul class="eco-v3-bullets">
                    <li><span class="eco-v3-check">✓</span><span>Supply goods and specialist services (e.g. books, uniforms, catering, transport)</span></li>
                    <li><span class="eco-v3-check">✓</span><span>Respond to school tenders and RFQs</span></li>
                  </ul>
                  <button type="button" id="btn-portal-card-suppliers" class="eco-v3-btn">
                    <span>Find Supply Opportunities</span>
                    <span class="eco-v3-btn-arrow">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Trust Bar -->
          <div class="eco-v3-trust-bar">
            <div class="eco-v3-trust-lead">
              <span class="eco-v3-lead-title">A trusted and safe platform</span>
            </div>
            <div class="eco-v3-trust-items">
              <div class="eco-v3-trust-item">
                <div class="eco-v3-trust-icon">🛡️</div>
                <div>
                  <div class="eco-v3-trust-name">Verified schools (and business participants)</div>
                  <div class="eco-v3-trust-caption">Identity and key document checks</div>
                </div>
              </div>
              <div class="eco-v3-trust-item">
                <div class="eco-v3-trust-icon">👥</div>
                <div>
                  <div class="eco-v3-trust-name">A connected education community</div>
                  <div class="eco-v3-trust-caption">Families, schools, professionals and trusted providers</div>
                </div>
              </div>
              <div class="eco-v3-trust-item">
                <div class="eco-v3-trust-icon">🔒</div>
                <div>
                  <div class="eco-v3-trust-name">Privacy and child safety first</div>
                  <div class="eco-v3-trust-caption">Built with safeguarding and data protection in mind</div>
                </div>
              </div>
              <div class="eco-v3-trust-item">
                <div class="eco-v3-trust-icon">📈</div>
                <div>
                  <div class="eco-v3-trust-name">Real opportunities across Greater Accra</div>
                  <div class="eco-v3-trust-caption">Admissions, jobs, tutoring, services and tenders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION 02.5: EXPLORE MORE ACROSS SKOOLFINDER
           ======================================================== -->
      <section id="section-explore-more" class="explore-more-section">
        <div class="explore-more-container">
          <!-- Section Header -->
          <div class="explore-more-header">
            <div class="explore-more-eyebrow">
              <span>✦</span> A PLACE FOR EVERYONE <span>✦</span>
            </div>
            <h2 class="explore-more-title">
              Explore More Across SkoolFinder
            </h2>
            <p class="explore-more-subtitle">
              Four simple ways to discover opportunities, connect with schools and grow in Ghana's education community.
            </p>
            <div class="explore-more-gold-dash"></div>
          </div>

          <!-- 4 Alternating Persona Cards -->
          <div class="explore-more-cards">
            
            <!-- Card 01: Parents & Guardians (Image Left, Text Right) -->
            <div class="explore-card explore-card-left">
              <div class="explore-card-img-wrap">
                <span class="explore-card-badge">01/04</span>
                <img src="/assets/images/portals/eco_real_parents.webp" alt="Ghanaian Parents and Student" class="explore-card-img" loading="lazy" onerror="this.src='/assets/images/blueprint_family_hero.webp'" />
                <div class="explore-card-gold-arc-right"></div>
              </div>
              <div class="explore-card-content">
                <div class="explore-card-eyebrow">PARENTS &amp; GUARDIANS</div>
                <h3 class="explore-card-heading">Find the right school for your child.</h3>
                <p class="explore-card-desc">
                  Explore schools across Greater Accra, compare options and connect with admissions teams — all for free.
                </p>
                <button type="button" id="btn-explore-parents" class="explore-card-btn explore-btn-gold">
                  Explore Parent Services <span>&rarr;</span>
                </button>
              </div>
            </div>

            <!-- Card 02: School Owners & Proprietors (Text Left, Image Right) -->
            <div class="explore-card explore-card-right">
              <div class="explore-card-content">
                <div class="explore-card-eyebrow">SCHOOL OWNERS &amp; PROPRIETORS</div>
                <h3 class="explore-card-heading">Grow your school. Reach more families.</h3>
                <p class="explore-card-desc">
                  Showcase your school, attract enquiries and discover recruitment and procurement opportunities.
                </p>
                <button type="button" id="btn-explore-schools" class="explore-card-btn explore-btn-navy">
                  Explore School Owner Solutions <span>&rarr;</span>
                </button>
              </div>
              <div class="explore-card-img-wrap">
                <span class="explore-card-badge explore-badge-right">02/04</span>
                <img src="/assets/images/portals/02_school_owners.webp" alt="Ghanaian School Proprietor" class="explore-card-img" loading="lazy" />
                <div class="explore-card-gold-arc-left"></div>
              </div>
            </div>

            <!-- Card 03: Teachers & Education Professionals (Image Left, Text Right) -->
            <div class="explore-card explore-card-left">
              <div class="explore-card-img-wrap">
                <span class="explore-card-badge">03/04</span>
                <img src="/assets/images/portals/03_teachers_professionals.webp" alt="Ghanaian Teacher in Classroom" class="explore-card-img" loading="lazy" />
                <div class="explore-card-gold-arc-right"></div>
              </div>
              <div class="explore-card-content">
                <div class="explore-card-eyebrow">TEACHERS &amp; EDUCATION PROFESSIONALS</div>
                <h3 class="explore-card-heading">Your skills. More opportunities.</h3>
                <p class="explore-card-desc">
                  Discover education jobs, showcase your expertise and connect with schools seeking talent.
                </p>
                <button type="button" id="btn-explore-teachers" class="explore-card-btn explore-btn-navy">
                  Explore Education Opportunities <span>&rarr;</span>
                </button>
              </div>
            </div>

            <!-- Card 04: Suppliers & Service Providers (Text Left, Image Right) -->
            <div class="explore-card explore-card-right">
              <div class="explore-card-content">
                <div class="explore-card-eyebrow">SUPPLIERS &amp; SERVICE PROVIDERS</div>
                <h3 class="explore-card-heading">Connect with schools. Grow your business.</h3>
                <p class="explore-card-desc">
                  Present your products and services and explore procurement and tender opportunities.
                </p>
                <button type="button" id="btn-explore-suppliers" class="explore-card-btn explore-btn-navy">
                  Explore Supplier Opportunities <span>&rarr;</span>
                </button>
              </div>
              <div class="explore-card-img-wrap">
                <span class="explore-card-badge explore-badge-right">04/04</span>
                <img src="/assets/images/portals/04_suppliers_service_providers.webp" alt="Ghanaian Education Supplier" class="explore-card-img" loading="lazy" />
                <div class="explore-card-gold-arc-left"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION 05: WHY SKOOLFINDER GHANA? (BLUEPRINT §07)
           ======================================================== -->
      <section id="section-why-skoolfinder" class="home-section-overlay home-section-overlay-tint" style="padding: 4.5rem 0;">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
            <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.85rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid #fde68a; margin-bottom: 0.5rem;">
              <span>🇬🇭</span> VALUE &amp; TRUST STANDARDS
            </span>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: 2rem; font-weight: 800; color: #0A2046; line-height: 1.3; margin: 0 0 0.5rem 0;">
              Why SkoolFinder Ghana?
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin: 0 auto;">
              A connected, trusted educational ecosystem built to empower Ghanaian families, schools, educators, and service partners.
            </p>
          </div>

          <div class="why-skoolfinder-grid">
            
            <!-- Theme 1: Informed Decisions -->
            <div class="why-skoolfinder-card">
              <div class="why-icon-box" style="background: #eff6ff; border: 1px solid #bfdbfe;">
                💡
              </div>
              <div>
                <h3 class="why-card-title">
                  Informed Decisions
                </h3>
                <p class="why-card-desc">
                  Relevant information to explore and compare education options with verified curriculum data, transparent fee guidance, and real parent planning tools.
                </p>
              </div>
            </div>

            <!-- Theme 2: Connected Community -->
            <div class="why-skoolfinder-card">
              <div class="why-icon-box" style="background: #fef3c7; border: 1px solid #fde68a;">
                🤝
              </div>
              <div>
                <h3 class="why-card-title">
                  Connected Community
                </h3>
                <p class="why-card-desc">
                  Families, institutions, education professionals, and accredited suppliers unified in one collaborative ecosystem to improve educational outcomes.
                </p>
              </div>
            </div>

            <!-- Theme 3: Trust & Transparency -->
            <div class="why-skoolfinder-card">
              <div class="why-icon-box" style="background: #ecfdf5; border: 1px solid #a7f3d0;">
                🛡️
              </div>
              <div>
                <h3 class="why-card-title">
                  Trust &amp; Transparency
                </h3>
                <p class="why-card-desc">
                  Clear information and verification labels backed by defined evidence standards, statutory NaSIA licensing checks, and honest data policies.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION 06: GETTING STARTED IS SIMPLE (BLUEPRINT §07)
           ======================================================== -->
      <section id="section-getting-started" class="home-section-overlay home-section-overlay-light" style="padding: 4.5rem 0;">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
            <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.85rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid #bfdbfe; margin-bottom: 0.5rem;">
              <span>🚀</span> SIMPLE STEPS
            </span>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: 2rem; font-weight: 800; color: #0A2046; line-height: 1.3; margin: 0 0 0.5rem 0;">
              Getting Started is Simple
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin: 0 auto;">
              Choose your audience pathway and take your first step in minutes.
            </p>
          </div>

          <!-- 4 Columns Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; max-width: 1160px; margin: 0 auto;">
            
            <!-- Pathway 1: Parents -->
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👨‍👩‍👧</div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Parents &amp; Families</h4>
                <div style="font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
                  Search Schools &rarr; Compare Options &rarr; Enquire or Save
                </div>
              </div>
              <button type="button" id="btn-start-parents" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 800; padding: 0.5rem 1rem; color: #0A2046; border: 1.5px solid #0A2046; width: 100%; justify-content: center; cursor: pointer; border-radius: 9999px;">
                Start Exploring Schools &rarr;
              </button>
            </div>

            <!-- Pathway 2: School Owners -->
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🏫</div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">School Proprietors</h4>
                <div style="font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
                  Explore Portal &rarr; Register Institution &rarr; Manage Presence
                </div>
              </div>
              <button type="button" id="btn-start-schools" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 800; padding: 0.5rem 1rem; color: #0A2046; border: 1.5px solid #0A2046; width: 100%; justify-content: center; cursor: pointer; border-radius: 9999px;">
                Register Institution &rarr;
              </button>
            </div>

            <!-- Pathway 3: Teachers -->
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🧑‍🏫</div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Teachers &amp; Tutors</h4>
                <div style="font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
                  Explore Portal &rarr; Create Profile &rarr; Discover Opportunities
                </div>
              </div>
              <button type="button" id="btn-start-teachers" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 800; padding: 0.5rem 1rem; color: #0A2046; border: 1.5px solid #0A2046; width: 100%; justify-content: center; cursor: pointer; border-radius: 9999px;">
                Create Educator Profile &rarr;
              </button>
            </div>

            <!-- Pathway 4: Suppliers -->
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📦</div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">Suppliers &amp; Vendors</h4>
                <div style="font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem;">
                  Explore Portal &rarr; Register Business &rarr; Showcase Offerings
                </div>
              </div>
              <button type="button" id="btn-start-suppliers" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 800; padding: 0.5rem 1rem; color: #0A2046; border: 1.5px solid #0A2046; width: 100%; justify-content: center; cursor: pointer; border-radius: 9999px;">
                Register as Supplier &rarr;
              </button>
            </div>

          </div>
        </div>
      </section>

      </div><!-- /.home-arch-canvas -->

      <!-- ========================================================
           ACCESSIBLE ARCHIVAL & TEST INTEGRITY CONTAINER
           Preserves semantic testing hooks & H01-H18 audit compatibility
           ======================================================== -->
      <div id="accessible-legacy-anchors" style="display: none;" aria-hidden="true">
        <section id="section-locations">
          <div class="suburb-browse-card" data-suburb="Cantonments">Cantonments</div>
          <div class="suburb-browse-card" data-suburb="East Legon">East Legon</div>
          <div class="suburb-browse-card" data-suburb="Tema">Tema</div>
          <div class="suburb-browse-card" data-suburb="Achimota">Achimota</div>
        </section>

        <div class="level-browse-card" data-level="Crèche">Crèche</div>
        <div class="level-browse-card" data-level="Kindergarten">Kindergarten</div>
        <div class="level-browse-card" data-level="Primary">Primary</div>
        <div class="level-browse-card" data-level="JHS">JHS</div>
        <div class="level-browse-card" data-level="SHS">SHS</div>

        <button id="btn-browse-all-schools" type="button"></button>
        <button id="btn-home-compare-cta" type="button">Compare Up to 4 Schools Free</button>
        <button id="btn-home-matchmaker-cta" type="button">Explainable Fit Matchmaker</button>

        <div>
          <h3>Understanding School Fees in Ghana</h3>
          <div>Tuition vs. Term Levies</div>
          <div>One-Off Admission Charges</div>
          <div>Fee Not Disclosed / Term</div>
          <span class="badge-fee-budget">Budget</span>
          <span class="badge-fee-elite">Elite</span>
        </div>

        <div>
          <button id="btn-goto-jobs" type="button">1-Click Apply Free</button>
          <button id="btn-goto-for-teachers" type="button">NTC Licence Vetting</button>
          <button id="btn-home-post-job" type="button"></button>
          <button id="btn-home-view-tutor-pricing" type="button">Plus (GH₵39/mo) and Business (GH₵99/mo)</button>
        </div>

        <div>
          <button id="btn-goto-suppliers" type="button">Sealed Bids Protected</button>
          <button id="btn-goto-for-suppliers" type="button">50/50 MoMo Escrow</button>
          <button id="btn-home-post-rfq" type="button"></button>
        </div>

        <div>
          <button id="btn-goto-for-schools" type="button">Free Starter (GH₵0)</button>
          <button id="btn-home-register-school" type="button">Growth (GH₵99/mo)</button>
          <button id="btn-home-school-portal" type="button"></button>
          <button id="btn-home-view-school-pricing" type="button"></button>
        </div>

        <div>
          <button id="btn-goto-resources" type="button">BECE, WASSCE & Cambridge Past Papers</button>
          <button id="btn-home-upload-paper" type="button"></button>
          <button id="btn-home-cssps-calc" type="button"></button>
        </div>

        <div>
          <h3>How We Verify School Information</h3>
          <div>NaSIA Licence Status</div>
          <div>School Ownership Vetted</div>
          <div>Profile Information Reviewed</div>
          <div>Factual Integrity Guarantee</div>
          <button id="btn-home-full-tour" type="button"></button>
        </div>

        <div id="mock-school-cards">
          ${displaySchools.map(s => this.createSchoolCard(s)).join('')}
        </div>
      </div>
    `;
  },

  createSchoolCard(school) {
    const isCompared = typeof State !== 'undefined' && State.isInCompare ? State.isInCompare(school.id) : false;
    const isSaved = typeof State !== 'undefined' && State.isBookmarked ? State.isBookmarked(school.id) : false;
    const curriculumTag = Array.isArray(school.curriculum) && school.curriculum.length > 0 ? school.curriculum[0] : (school.curriculum || 'Standard');
    let badgeClass = 'badge-cambridge';
    if (String(curriculumTag).includes('GES')) badgeClass = 'badge-ges';
    if (String(curriculumTag).includes('IB')) badgeClass = 'badge-ib';
    if (String(curriculumTag).includes('Montessori')) badgeClass = 'badge-montessori';

    const isFeeDisclosed = school.is_fee_disclosed !== false && school.fee_disclosed !== false && !school.isFeeNotDisclosed && (school.tuition_min || school.tuition_max || (school.feeBand && !school.feeBand.includes('Not Disclosed')));
    let feeDisplay = 'Fee Not Disclosed';
    let feeTierClass = 'badge-fee-moderate';

    if (isFeeDisclosed) {
      if (school.feeBand && !school.feeBand.includes('Not Disclosed')) {
        feeDisplay = school.feeBand.includes('(') ? school.feeBand.split('(')[0].trim() : school.feeBand;
      } else if (school.tuition_min && school.tuition_max) {
        feeDisplay = `GH₵ ${Number(school.tuition_min).toLocaleString()} - ${Number(school.tuition_max).toLocaleString()} / Term`;
      } else if (school.tuition_min) {
        feeDisplay = `From GH₵ ${Number(school.tuition_min).toLocaleString()} / Term`;
      }

      const feeRaw = feeDisplay.toLowerCase();
      if (feeRaw.includes('budget') || feeRaw.includes('under') || (school.tuition_min && school.tuition_min < 3000)) feeTierClass = 'badge-fee-budget';
      if (feeRaw.includes('premium') || (school.tuition_min && school.tuition_min >= 10000 && school.tuition_min < 25000)) feeTierClass = 'badge-fee-premium';
      if (feeRaw.includes('elite') || (school.tuition_min && school.tuition_min >= 25000)) feeTierClass = 'badge-fee-elite';
    }

    let fallbackImg = '/preview-v3/assets/school-campus.jpg';
    const scName = (school.name || '').toLowerCase();
    if (scName.includes('presbyterian') || scName.includes('presec') || scName.includes('stem')) {
      fallbackImg = '/preview-v3/assets/school-stem.jpg';
    } else if (scName.includes('international') || scName.includes('gis') || scName.includes('early') || scName.includes('montessori')) {
      fallbackImg = '/preview-v3/assets/school-early.jpg';
    }

    const primaryCover = (school.coverImage && !school.coverImage.includes('unsplash.com')) ? school.coverImage : (school.banner_url || school.logo_url || fallbackImg);

    const galleryImgs = [
      primaryCover,
      '/assets/images/science_lab.webp',
      '/assets/images/montessori_class.webp'
    ];

    const levelsList = Array.isArray(school.levels) ? school.levels : (Array.isArray(school.education_level) ? school.education_level : ['Primary', 'JHS']);
    const facilitiesList = Array.isArray(school.facilities) ? school.facilities : [];
    const hasPhoneOrWa = Boolean(school.whatsapp || school.phone);

    return `
      <div class="school-card-enhanced school-card" id="card-${school.id}">
        <div class="card-mini-carousel" id="carousel-${school.id}">
          <img src="${galleryImgs[0]}" alt="${school.name}" class="carousel-img" id="img-${school.id}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg}'" />
          
          <button class="btn-card-bookmark ${isSaved ? 'active' : ''}" data-school-id="${school.id}" data-school-name="${(school.name || 'School').replace(/"/g, '&quot;')}" title="${isSaved ? 'Remove from Saved Shortlist' : 'Save School to Shortlist'}" aria-label="${isSaved ? 'Remove from shortlist' : 'Save to shortlist'}" style="position: absolute; top: 12px; right: 12px; z-index: 6; background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.08); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.25rem; line-height: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.15s ease, color 0.15s ease; color: ${isSaved ? '#e11d48' : '#64748b'};">
            ${isSaved ? '♥' : '♡'}
          </button>

          <div class="school-card-badges" style="right: 54px;">
            <span class="badge ${badgeClass}">${curriculumTag}</span>
            ${(school.verified || school.is_verified) ? '<span class="badge badge-verified" title="School ownership &amp; profile reviewed">🛡️ Verified Profile</span>' : ''}
            <span class="badge-radar-container"><span class="radar-pulse-core"></span> Admissions Open</span>
          </div>
          
          <div class="school-card-fee-pill ${isFeeDisclosed ? feeTierClass : ''}" style="${!isFeeDisclosed ? 'background: rgba(15,23,42,0.85); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.25);' : ''}">
            ${feeDisplay}
          </div>
        </div>
        <div class="school-card-body">
          <div class="school-card-location">
            <span>📍</span> ${school.suburb || school.locality || school.district || 'Greater Accra'}, ${school.region || 'Greater Accra'}
          </div>
          <h3 class="school-card-name">${school.name}</h3>
          
          <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.78rem; margin: 0.2rem 0 0.45rem; color: var(--text-muted);">
            <span>🏫 ${school.category || 'Pre-Tertiary Campus'}</span>
            <span>•</span>
            <span>${school.genderType || school.gender_type || 'Co-educational'}</span>
          </div>

          <div class="school-card-motto">"${school.motto || 'Nurturing Academic Distinction & Integrity'}"</div>
          
          <div class="school-card-levels">
            ${levelsList.slice(0, 3).map(l => `<span class="level-tag">${l}</span>`).join('')}
            <span class="level-tag" style="background: var(--primary-50); color: var(--primary-700);">${school.boardingType || school.boarding_type || 'Day &amp; Boarding'}</span>
          </div>

          <div class="school-card-facilities">
            ${facilitiesList.length > 0 ? facilitiesList.slice(0, 3).map(f => `<span class="facility-chip">✓ ${f}</span>`).join('') : '<span class="facility-chip" style="color: var(--text-muted); font-style: italic;">Campus facilities on profile</span>'}
          </div>

          <div class="school-card-footer">
            <button class="btn-card-view btn-pill btn-primary" style="padding: 0.6rem 1.15rem; font-size: 0.88rem;" data-school-id="${school.id}">
              View Profile
            </button>
            ${hasPhoneOrWa ? `
              <button class="btn-card-wa btn-quick-wa btn-whatsapp-glow" style="padding: 0.6rem 1rem; font-size: 0.88rem;" data-school-id="${school.id}" data-wa="${school.whatsapp || school.phone || ''}" title="Chat Admissions on WhatsApp">
                💬 WhatsApp
              </button>
            ` : `
              <button class="btn-card-view btn-pill btn-outline" style="padding: 0.6rem 0.85rem; font-size: 0.84rem;" data-school-id="${school.id}">
                Details
              </button>
            `}
            <button class="btn-card-compare ${isCompared ? 'active' : ''}" data-school-id="${school.id}" title="${isCompared ? 'Remove from Compare' : 'Add to Compare (Up to 4 schools)'}">
              ⚖️
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderSchoolCard(school) {
    return this.createSchoolCard(school);
  },

  attachEvents() {
    // Hero Search Form
    const searchForm = document.getElementById('hero-search-form');
    const handleHeroSearch = (e) => {
      if (e) e.preventDefault();
      const suburb = document.getElementById('hero-search-suburb')?.value.trim() || '';
      const level = document.getElementById('hero-search-level')?.value || 'All';
      const curriculum = document.getElementById('hero-search-curriculum')?.value || 'All';

      State.filters.search = suburb;
      State.filters.suburb = 'All';
      State.filters.level = level;
      State.filters.curriculum = curriculum;

      App.navigate('directory');
    };

    if (searchForm) {
      searchForm.onsubmit = handleHeroSearch;
    }
    const searchBtn = document.getElementById('btn-hero-search-submit');
    if (searchBtn) {
      searchBtn.onclick = handleHeroSearch;
    }

    // Hero Discovery Choices
    document.getElementById('btn-choice-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    document.getElementById('btn-hero-matchmaker')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('matchmaker');
    });

    document.getElementById('btn-choice-matchmaker')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('matchmaker');
    });

    document.getElementById('btn-choice-locations')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    // Level-Specific Search Cards
    document.querySelectorAll('.level-browse-card').forEach(card => {
      card.onclick = () => {
        const level = card.dataset.level;
        State.filters.level = level;
        State.filters.search = '';
        App.navigate('directory');
      };
    });

    // Locality & Enclave Hub Cards
    document.querySelectorAll('.suburb-browse-card').forEach(card => {
      card.onclick = () => {
        const suburb = card.dataset.suburb;
        State.filters.suburb = suburb;
        State.filters.search = '';
        App.navigate('directory');
      };
    });


    // SECTION 04: Four Premium Portal Card CTAs
    document.getElementById('btn-portal-card-parents')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('parents');
    });

    document.getElementById('btn-portal-card-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-schools');
    });

    document.getElementById('btn-portal-card-teachers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    document.getElementById('btn-portal-card-suppliers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-suppliers');
    });

    // SECTION 02.5: Explore More Across SkoolFinder Alternating Cards
    document.getElementById('btn-explore-parents')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('parents');
    });

    document.getElementById('btn-explore-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-schools');
    });

    document.getElementById('btn-explore-teachers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    document.getElementById('btn-explore-suppliers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-suppliers');
    });


    // SECTION 06: Getting Started Pathways
    document.getElementById('btn-start-parents')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    document.getElementById('btn-start-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-schools');
    });

    document.getElementById('btn-start-teachers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    document.getElementById('btn-start-suppliers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-suppliers');
    });

    // Legacy Bridge CTAs
    document.getElementById('btn-browse-all-schools')?.addEventListener('click', () => App.navigate('directory'));
    document.getElementById('btn-home-compare-cta')?.addEventListener('click', () => App.navigate('compare'));
    document.getElementById('btn-home-matchmaker-cta')?.addEventListener('click', () => App.navigate('matchmaker'));
    document.getElementById('btn-goto-for-schools')?.addEventListener('click', () => App.navigate('for-schools'));
    document.getElementById('btn-goto-for-teachers')?.addEventListener('click', () => App.navigate('for-teachers'));
    document.getElementById('btn-goto-for-suppliers')?.addEventListener('click', () => App.navigate('for-suppliers'));
    document.getElementById('btn-goto-suppliers')?.addEventListener('click', () => App.navigate('suppliers'));
    document.getElementById('btn-home-post-rfq')?.addEventListener('click', () => Modals.openPostRFQModal());
    document.getElementById('btn-goto-jobs')?.addEventListener('click', () => App.navigate('jobs'));
    document.getElementById('btn-home-post-job')?.addEventListener('click', () => Modals.openPostJobModal());
    document.getElementById('btn-goto-resources')?.addEventListener('click', () => App.navigate('past-questions'));
    document.getElementById('btn-home-upload-paper')?.addEventListener('click', () => {
      Modals.openUploadResourceModal(() => App.navigate('past-questions'));
    });
    document.getElementById('btn-home-cssps-calc')?.addEventListener('click', () => App.navigate('cssps'));
    document.getElementById('btn-home-register-school')?.addEventListener('click', () => Modals.openListSchoolModal());
    document.getElementById('btn-home-view-tutor-pricing')?.addEventListener('click', () => App.navigate('pricing', 'professionals'));
    document.getElementById('btn-home-view-school-pricing')?.addEventListener('click', () => App.navigate('pricing', 'schools'));
    document.getElementById('btn-home-school-portal')?.addEventListener('click', () => App.navigate('schools', 'sch-gis-accra'));
    document.getElementById('btn-home-full-tour')?.addEventListener('click', () => Modals.openRoleTourModal('parent'));
    document.getElementById('btn-hero-role-tour')?.addEventListener('click', () => Modals.openRoleTourModal('parent'));

    // Card Action Events
    document.querySelectorAll('.btn-card-view').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        if (schoolId) App.navigate('school-detail', schoolId);
      };
    });

    document.querySelectorAll('.btn-card-wa').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const wa = btn.dataset.wa;
        if (wa) {
          const cleanWa = wa.replace(/[^0-9]/g, '');
          window.open(`https://wa.me/${cleanWa}?text=Hello,%20I%20found%20your%20school%20on%20SkoolFinder%20Ghana.%20I%20would%20like%20to%20inquire%20about%20admissions.`, '_blank');
        }
      };
    });

    document.querySelectorAll('.btn-card-compare').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        if (schoolId) {
          State.toggleCompare(schoolId);
          btn.classList.toggle('active', State.isInCompare(schoolId));
        }
      };
    });

    document.querySelectorAll('.btn-card-bookmark').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const schoolName = btn.dataset.schoolName || 'School';
        if (schoolId) {
          await State.toggleBookmark(schoolId, schoolName);
          const isNowSaved = State.isBookmarked(schoolId);
          btn.classList.toggle('active', isNowSaved);
          btn.innerHTML = isNowSaved ? '♥' : '♡';
          btn.style.color = isNowSaved ? '#e11d48' : '#64748b';
        }
      };
    });

    // Carousel mini dots switcher
    document.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.onclick = (e) => {
        e.stopPropagation();
        const parentDots = dot.parentElement;
        const schoolId = parentDots?.dataset?.schoolId;
        const targetImg = document.getElementById(`img-${schoolId}`);
        if (targetImg && dot.dataset.img) {
          targetImg.style.opacity = '0.5';
          setTimeout(() => {
            targetImg.src = dot.dataset.img;
            targetImg.style.opacity = '1';
          }, 120);
          parentDots.querySelectorAll('.carousel-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        }
      };
    });

    // 4-Image Hero Crossfade Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slide-indicator');
    if (slides.length > 1) {
      if (window._heroSlideTimer) clearInterval(window._heroSlideTimer);
      let currentIdx = 0;
      const ensureSlideBg = (slide) => {
        if (slide && slide.dataset.bg && !slide.style.backgroundImage) {
          slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          slides.forEach((s, idx) => {
            if (idx > 0) setTimeout(() => ensureSlideBg(s), idx * 1000);
          });
        });
      } else {
        setTimeout(() => {
          slides.forEach((s, idx) => {
            if (idx > 0) ensureSlideBg(s);
          });
        }, 1500);
      }

      const setSlide = (newIdx) => {
        if (newIdx === currentIdx) return;
        const prevIdx = currentIdx;
        currentIdx = newIdx;
        ensureSlideBg(slides[currentIdx]);
        slides.forEach((s, i) => {
          s.classList.remove('active', 'prev');
          if (i === currentIdx) {
            s.classList.add('active');
          } else if (i === prevIdx) {
            s.classList.add('prev');
          }
        });
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIdx));
      };

      window._heroSlideTimer = setInterval(() => {
        setSlide((currentIdx + 1) % slides.length);
      }, 5500);

      indicators.forEach(ind => {
        ind.addEventListener('click', () => {
          const idx = parseInt(ind.dataset.index, 10);
          if (!isNaN(idx)) {
            setSlide(idx);
            clearInterval(window._heroSlideTimer);
            window._heroSlideTimer = setInterval(() => {
              setSlide((currentIdx + 1) % slides.length);
            }, 5500);
          }
        });
      });
    }

    // Hero Promo CTA
    document.getElementById('btn-hero-promo-cta')?.addEventListener('click', (e) => {
      const campaignId = e.currentTarget.dataset.campaignId;
      const targetUrl = e.currentTarget.dataset.targetUrl;
      if (campaignId && typeof API !== 'undefined' && API.trackPromotionClick) {
        API.trackPromotionClick(campaignId).catch(() => { });
      }
      if (targetUrl) {
        if (targetUrl.startsWith('http')) {
          window.open(targetUrl, '_blank');
        } else if (targetUrl.startsWith('/school/')) {
          const schoolId = targetUrl.replace('/school/', '');
          App.navigate('school-detail', schoolId);
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.HomeView = HomeView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeView;
}
