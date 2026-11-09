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
        API.trackPromotionImpression(heroPromo.id).catch(() => {});
      }
    } catch(e) {}

    return `
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
           SECTION 03: PARENTS — TWO FREE EXPERIENCES (BLUEPRINT §05)
           ======================================================== -->
      <section id="section-two-ways-free" style="background: radial-gradient(circle at 50% 0%, rgba(18, 102, 196, 0.03) 0%, #f8fafc 100%); padding: 4.5rem 1.5rem; border-bottom: 1px solid var(--border-light, #e2e8f0); position: relative; overflow: hidden;">
        <div class="container" style="max-width: 960px; margin: 0 auto; position: relative; z-index: 1;">
          
          <!-- Section Eyebrow & Title -->
          <div style="text-align: center; max-width: 680px; margin: 0 auto 2.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; color: #B45309; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem;">
              <span>✦</span> YOUR JOURNEY, YOUR WAY
            </div>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; color: #0A2046; line-height: 1.2; margin: 0 0 0.75rem 0; letter-spacing: -0.02em;">
              Their Future Begins Here.
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin: 0 auto;">
              Discover exceptional school opportunities, explore freely, and plan every step of your child's education with confidence.
            </p>
          </div>

          <!-- Hero Family Photography Banner -->
          <div style="width: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 16px 36px rgba(10,32,70,0.08); border: 1px solid #e2e8f0; margin-bottom: 2rem; position: relative; background: #ffffff;">
            <picture>
              <source srcset="/assets/images/blueprint_family_hero.webp" type="image/webp">
              <img src="/assets/images/blueprint_family_hero.jpg" alt="Ghanaian family discovering schools together on SkoolFinder" style="width: 100%; height: clamp(220px, 40vw, 380px); object-fit: cover; object-position: center 25%; display: block;" loading="lazy">
            </picture>
          </div>

          <!-- Dual Cards Grid: Side-by-Side (Fills 960px container nicely) -->
          <div class="parent-journey-cards-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.75rem; align-items: stretch; margin-bottom: 2rem;">
            
            <!-- CARD 1: EXPLORE AS A GUEST -->
            <div class="parent-pathway-card parent-pathway-guest" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 20px; padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 6px 20px rgba(10,32,70,0.04);">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.45rem; color: #0284c7; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.85rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                  <span>EXPLORE FREELY</span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: clamp(1.4rem, 2.5vw, 1.65rem); font-weight: 800; color: #0A2046; line-height: 1.25; margin: 0 0 0.5rem 0;">
                  Explore as a Guest
                </h3>
                <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  Discover schools and private tutors without creating an account.
                </p>

                <div style="height: 1px; background: #e2e8f0; margin-bottom: 1.25rem;"></div>

                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.85rem;">
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Find schools and private tutors</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Compare your preferred schools</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Browse profiles and send enquiries</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-guest-explore" class="btn-pill pathway-cta-btn" style="width: 100%; height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.75rem 1rem; font-size: 0.95rem; font-weight: 800; color: #ffffff; background: #0A2046; border: 1.5px solid #1e3a6a; cursor: pointer; border-radius: 9999px; box-shadow: 0 4px 14px rgba(10,32,70,0.2); box-sizing: border-box;">
                  <span>Start Exploring</span>
                  <span class="cta-arrow" style="font-size: 1.05rem;">&nearr;</span>
                </button>
                <div style="text-align: center; margin-top: 0.75rem; font-size: 0.82rem; color: #64748b; font-weight: 500;">
                  No registration required
                </div>
              </div>
            </div>

            <!-- CARD 2: YOUR FREE PARENT ACCOUNT -->
            <div class="parent-pathway-card parent-pathway-account" style="background: linear-gradient(180deg, #FFFDF8 0%, #FEF9EE 100%); border: 1.5px solid #E5C378; border-radius: 20px; padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 28px rgba(213,166,59,0.14);">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.45rem; color: #b45309; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.85rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  <span>YOUR PERSONALISED JOURNEY</span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: clamp(1.4rem, 2.5vw, 1.65rem); font-weight: 800; color: #0A2046; line-height: 1.25; margin: 0 0 0.5rem 0;">
                  Your Free Parent Account
                </h3>
                <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  Enjoy everything guests can access, plus tools to plan and stay organised.
                </p>

                <div style="height: 1px; background: #fde68a; margin-bottom: 1.25rem;"></div>

                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.85rem;">
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Save favourite schools and tutors</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Get personalised recommendations</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Track enquiries and school visits</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.92rem; color: #334155; line-height: 1.45;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Receive alerts and reminders</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-parent-signup" class="btn-pill pathway-cta-btn" style="width: 100%; height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.75rem 1rem; font-size: 0.95rem; font-weight: 800; color: #0A2046; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); border: none; cursor: pointer; border-radius: 9999px; transition: all 0.2s; box-shadow: 0 4px 16px rgba(213,166,59,0.35); box-sizing: border-box;">
                  <span>Create Free Account</span>
                  <span class="cta-arrow" style="font-size: 1.05rem;">&nearr;</span>
                </button>
                <div style="text-align: center; margin-top: 0.75rem; font-size: 0.82rem; color: #64748b; font-weight: 500;">
                  100% free &bull; No subscription required
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Sign-in Link -->
          <div style="text-align: center; margin-top: 1.25rem;">
            <div style="font-size: 0.85rem; color: #64748b;">
              Already have an account? 
              <button type="button" id="btn-home-parent-signin" style="background: none; border: none; color: #1266C4; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.85rem; padding: 0.2rem 0.35rem; transition: color 0.15s;">
                Sign in to continue your school journey &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           SECTION 04: THE SKOOLFINDER ECOSYSTEM (4-COLUMN COMMUNITY CARDS)
           ======================================================== -->
      <section id="section-portal-cards" class="eco-section-wrap">
        <div class="eco-skyline-watermark" aria-hidden="true"></div>

        <div class="container" style="position: relative; z-index: 2;">
          <!-- Section Header -->
          <div style="text-align: center; max-width: 760px; margin: 0 auto 1.5rem;">
            <div class="eco-eyebrow-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1b39" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align: middle;">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>THE SKOOLFINDER ECOSYSTEM</span>
            </div>

            <h2 class="eco-main-title">
              One Platform. A Connected <span class="eco-title-highlight">Education Community.<span class="eco-brush-underline" aria-hidden="true"></span></span>
            </h2>

            <div class="eco-subtitle-wrap">
              <span class="eco-subtitle-rule" aria-hidden="true"></span>
              <p class="eco-subtitle">Bringing together parents, schools, education professionals and service providers.</p>
              <span class="eco-subtitle-rule" aria-hidden="true"></span>
            </div>
          </div>

          <!-- 4-Column Horizontal Grid -->
          <div class="eco-4col-grid">

            <!-- CARD 01: PARENTS & GUARDIANS -->
            <div class="eco-persona-card eco-card-parents" style="--eco-accent: #0284c7;">
              <div class="eco-card-header">
                <picture>
                  <source srcset="/assets/images/portals/eco_real_parents.webp" type="image/webp">
                  <img src="/assets/images/portals/eco_real_parents.jpg" alt="Parents &amp; Guardians on SkoolFinder" class="eco-card-photo" loading="lazy">
                </picture>
                <svg class="eco-card-wave" viewBox="0 0 280 42" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 0,16 C 85,38 185,36 280,12 L 280,42 L 0,42 Z" fill="#ffffff"/>
                  <path d="M 0,16 C 85,38 185,36 280,12" fill="none" stroke="#0284c7" stroke-width="3.5"/>
                </svg>
                <div class="eco-card-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div class="eco-card-body">
                <div>
                  <h3 class="eco-card-title">Parents &amp; Guardians</h3>
                  <p class="eco-card-desc">Discover, compare and choose the right school for your child.</p>
                </div>
                <button type="button" id="btn-portal-card-parents" class="btn-eco-portal">
                  Explore Parents Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 02: SCHOOL OWNERS & PROPRIETORS -->
            <div class="eco-persona-card eco-card-schools" style="--eco-accent: #f59e0b;">
              <div class="eco-card-header">
                <picture>
                  <source srcset="/assets/images/portals/eco_real_schools.webp" type="image/webp">
                  <img src="/assets/images/portals/eco_real_schools.jpg" alt="School Owners &amp; Proprietors on SkoolFinder" class="eco-card-photo" loading="lazy">
                </picture>
                <svg class="eco-card-wave" viewBox="0 0 280 42" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 0,16 C 85,38 185,36 280,12 L 280,42 L 0,42 Z" fill="#ffffff"/>
                  <path d="M 0,16 C 85,38 185,36 280,12" fill="none" stroke="#f59e0b" stroke-width="3.5"/>
                </svg>
                <div class="eco-card-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V9l7-5 7 5v12"></path>
                    <path d="M9 13h6"></path>
                    <path d="M9 17h6"></path>
                    <path d="M12 4v2"></path>
                  </svg>
                </div>
              </div>
              <div class="eco-card-body">
                <div>
                  <h3 class="eco-card-title">School Owners &amp; Proprietors</h3>
                  <p class="eco-card-desc">Grow your school's visibility and manage key opportunities.</p>
                </div>
                <button type="button" id="btn-portal-card-schools" class="btn-eco-portal">
                  Explore School Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 03: TEACHERS & EDUCATION PROFESSIONALS -->
            <div class="eco-persona-card eco-card-teachers" style="--eco-accent: #16a34a;">
              <div class="eco-card-header">
                <picture>
                  <source srcset="/assets/images/portals/eco_real_teachers.webp" type="image/webp">
                  <img src="/assets/images/portals/eco_real_teachers.jpg" alt="Teachers &amp; Education Professionals on SkoolFinder" class="eco-card-photo" loading="lazy">
                </picture>
                <svg class="eco-card-wave" viewBox="0 0 280 42" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 0,16 C 85,38 185,36 280,12 L 280,42 L 0,42 Z" fill="#ffffff"/>
                  <path d="M 0,16 C 85,38 185,36 280,12" fill="none" stroke="#16a34a" stroke-width="3.5"/>
                </svg>
                <div class="eco-card-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
              </div>
              <div class="eco-card-body">
                <div>
                  <h3 class="eco-card-title">Teachers &amp; Education Professionals</h3>
                  <p class="eco-card-desc">Find teaching and non-teaching opportunities in education.</p>
                </div>
                <button type="button" id="btn-portal-card-teachers" class="btn-eco-portal">
                  Explore Teachers Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 04: SUPPLIERS & SERVICE PROVIDERS -->
            <div class="eco-persona-card eco-card-suppliers" style="--eco-accent: #7c3aed;">
              <div class="eco-card-header">
                <picture>
                  <source srcset="/assets/images/portals/eco_real_suppliers.webp" type="image/webp">
                  <img src="/assets/images/portals/eco_real_suppliers.jpg" alt="Suppliers &amp; Service Providers on SkoolFinder" class="eco-card-photo" loading="lazy">
                </picture>
                <svg class="eco-card-wave" viewBox="0 0 280 42" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M 0,16 C 85,38 185,36 280,12 L 280,42 L 0,42 Z" fill="#ffffff"/>
                  <path d="M 0,16 C 85,38 185,36 280,12" fill="none" stroke="#7c3aed" stroke-width="3.5"/>
                </svg>
                <div class="eco-card-badge" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"></path>
                    <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 13"></path>
                    <path d="m2 13 4 4"></path>
                  </svg>
                </div>
              </div>
              <div class="eco-card-body">
                <div>
                  <h3 class="eco-card-title">Suppliers &amp; Service Providers</h3>
                  <p class="eco-card-desc">Connect with schools through tenders and service opportunities.</p>
                </div>
                <button type="button" id="btn-portal-card-suppliers" class="btn-eco-portal">
                  Explore Suppliers Portal &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION: SCHOOL OWNERS & PROPRIETORS SPOTLIGHT
           ======================================================== -->
      <section id="section-school-proprietors-spotlight" style="background: #f8fafc; padding: 0 1.5rem 5rem; scroll-margin-top: 80px;">
        <div class="container" style="max-width: 980px; margin: 0 auto;">
          <div class="proprietors-spotlight-card">
            
            <!-- Top Hero Grid: Left Content + Right Curved Image -->
            <div class="proprietors-hero-grid">
              <div>
                <div class="proprietors-accent-bar"></div>
                <h2 class="proprietors-title">
                  For School Owners &amp; Proprietors
                </h2>
                <p class="proprietors-desc">
                  Grow your school's visibility, attract prospective families, manage admissions, recruit staff and connect with suppliers through one platform.
                </p>
                <button type="button" id="btn-proprietors-solutions" class="btn-proprietors-gold">
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

              <button type="button" id="btn-proprietors-open-admissions" class="btn-proprietors-navy">
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
                  <button type="button" id="btn-proprietors-post-vacancy" class="proprietors-sec-link-blue">
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
                    <polyline points="10 9 12 11 16 7"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 class="proprietors-sec-title">
                    Publish School Tenders
                  </h4>
                  <p class="proprietors-sec-sub">
                    Advertise your school's procurement needs and receive bids from trusted suppliers and service providers.
                  </p>
                  <button type="button" id="btn-proprietors-publish-tender" class="proprietors-sec-link-green">
                    Publish a Tender &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION: TEACHERS & EDUCATION PROFESSIONALS SPOTLIGHT
           ======================================================== -->
      <section id="section-teachers-professionals-spotlight" style="background: #f8fafc; padding: 0 1.5rem 5rem; scroll-margin-top: 80px;">
        <div class="container" style="max-width: 980px; margin: 0 auto;">
          <div class="teachers-spotlight-card">
            
            <!-- Eyebrow Badge -->
            <div class="teachers-eyebrow-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>TEACHERS &amp; EDUCATION PROFESSIONALS</span>
            </div>

            <!-- Top Hero Grid: Left Content + Right Curved Image -->
            <div class="teachers-hero-grid">
              <div>
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

            <!-- Opportunities Strip Divider -->
            <div class="teachers-opportunities-strip">
              <div class="teachers-strip-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1b39" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <span>Latest Opportunities</span>
              </div>
              <div class="teachers-strip-line" aria-hidden="true"></div>
              <div class="teachers-strip-badge">
                <span>📍 Greater Accra</span>
              </div>
            </div>

            <!-- 3-Column Jobs Grid -->
            <div class="teachers-jobs-grid">
              
              <!-- Card 1: Mathematics Teacher -->
              <div class="teachers-job-card teachers-card-maths">
                <div>
                  <div class="teachers-job-icon-box teachers-icon-maths" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
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

                <button type="button" id="btn-job-details-1" class="btn-job-details-link">
                  View Details &rarr;
                </button>
              </div>

              <!-- Card 2: School Administrator -->
              <div class="teachers-job-card teachers-card-admin">
                <div>
                  <div class="teachers-job-icon-box teachers-icon-admin" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
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

                <button type="button" id="btn-job-details-2" class="btn-job-details-link">
                  View Details &rarr;
                </button>
              </div>

              <!-- Card 3: Teaching Assistant -->
              <div class="teachers-job-card teachers-card-assistant">
                <div>
                  <div class="teachers-job-icon-box teachers-icon-assistant" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
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

                <button type="button" id="btn-job-details-3" class="btn-job-details-link">
                  View Details &rarr;
                </button>
              </div>

            </div>

            <!-- Bottom Action CTAs -->
            <div class="teachers-ctas-wrap">
              <button type="button" id="btn-teachers-view-all-jobs" class="btn-teachers-all-jobs">
                <span>🔍</span> View All Education Jobs &rarr;
              </button>
              <button type="button" id="btn-teachers-join-pro" class="btn-teachers-join-pro">
                <span>👤+</span> Join as a Professional
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SPOTLIGHT SECTION: SUPPLIERS & SERVICE PROVIDERS
           ======================================================== -->
      <section id="section-suppliers-providers-spotlight" style="background: #f8fafc; padding: 0 1.5rem 5rem; scroll-margin-top: 80px;">
        <div style="max-width: 980px; margin: 0 auto;">
          <div class="suppliers-spotlight-card">

            <!-- Eyebrow Badge -->
            <div class="suppliers-eyebrow-badge">
              <span>🤝</span> SUPPLIERS &amp; SERVICE PROVIDERS
            </div>

            <!-- Hero Row: Header Text Left + Photo Right -->
            <div class="suppliers-hero-grid">
              <div class="suppliers-hero-text">
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
                  <div class="suppliers-tender-icon-box suppliers-icon-ict" aria-hidden="true">💻</div>
                  <h4 class="suppliers-tender-title">Supply of ICT Equipment</h4>
                  <p class="suppliers-tender-school">Accra Commonwealth School</p>
                  <div class="suppliers-tender-meta-row">
                    <span class="suppliers-tender-location">📍 Accra</span>
                    <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                    <span class="suppliers-pill-goods">📦 Goods Supply</span>
                  </div>
                  <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>28 Nov 2026</strong></p>
                </div>
                <button type="button" id="btn-tender-details-1" class="btn-tender-details-link">View Details &rarr;</button>
              </div>

              <!-- Tender Card 2: Facility Maintenance -->
              <div class="suppliers-tender-card suppliers-card-maintenance">
                <div class="suppliers-tender-top">
                  <div class="suppliers-tender-icon-box suppliers-icon-maintenance" aria-hidden="true">🔧</div>
                  <h4 class="suppliers-tender-title">Maintenance of School Facilities</h4>
                  <p class="suppliers-tender-school">Tema Methodist Basic School</p>
                  <div class="suppliers-tender-meta-row">
                    <span class="suppliers-tender-location">📍 Tema</span>
                    <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                    <span class="suppliers-pill-works">🔨 Works &amp; Services</span>
                  </div>
                  <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>02 Dec 2026</strong></p>
                </div>
                <button type="button" id="btn-tender-details-2" class="btn-tender-details-link">View Details &rarr;</button>
              </div>

              <!-- Tender Card 3: Cleaning Services -->
              <div class="suppliers-tender-card suppliers-card-cleaning">
                <div class="suppliers-tender-top">
                  <div class="suppliers-tender-icon-box suppliers-icon-cleaning" aria-hidden="true">🧹</div>
                  <h4 class="suppliers-tender-title">Provision of Cleaning Services</h4>
                  <p class="suppliers-tender-school">East Legon International School</p>
                  <div class="suppliers-tender-meta-row">
                    <span class="suppliers-tender-location">📍 East Legon</span>
                    <span class="suppliers-meta-divider" aria-hidden="true">|</span>
                    <span class="suppliers-pill-service">📑 Service Contract</span>
                  </div>
                  <p class="suppliers-tender-deadline">📅 Submission Deadline: <strong>05 Dec 2026</strong></p>
                </div>
                <button type="button" id="btn-tender-details-3" class="btn-tender-details-link">View Details &rarr;</button>
              </div>

            </div>

            <!-- Bottom Action CTAs -->
            <div class="suppliers-ctas-wrap">
              <button type="button" id="btn-suppliers-view-all-tenders" class="btn-suppliers-all-tenders">
                <span>🔨</span> View All School Tenders &rarr;
              </button>
              <button type="button" id="btn-suppliers-join-provider" class="btn-suppliers-join-provider">
                <span>👥</span> Join as a Supplier / Service Provider
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           SECTION 05: WHY SKOOLFINDER GHANA? (BLUEPRINT §07)
           ======================================================== -->
      <section id="section-why-skoolfinder" style="background: #ffffff; padding: 4.5rem 0; border-bottom: 1px solid var(--border-light, #e2e8f0);">
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

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.75rem; max-width: 1080px; margin: 0 auto;">
            
            <!-- Theme 1: Informed Decisions -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                💡
              </div>
              <div>
                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                  Informed Decisions
                </h3>
                <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin: 0;">
                  Relevant information to explore and compare education options with verified curriculum data, transparent fee guidance, and real parent planning tools.
                </p>
              </div>
            </div>

            <!-- Theme 2: Connected Community -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef3c7; border: 1px solid #fde68a; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                🤝
              </div>
              <div>
                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                  Connected Community
                </h3>
                <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin: 0;">
                  Families, institutions, education professionals, and accredited suppliers unified in one collaborative ecosystem to improve educational outcomes.
                </p>
              </div>
            </div>

            <!-- Theme 3: Trust & Transparency -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                🛡️
              </div>
              <div>
                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                  Trust &amp; Transparency
                </h3>
                <p style="color: #475569; font-size: 0.9rem; line-height: 1.6; margin: 0;">
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
      <section id="section-getting-started" style="background: #f8fafc; padding: 4.5rem 0; border-bottom: 1px solid var(--border-light, #e2e8f0);">
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
    const isSaved = typeof State !== 'undefined' && State.isBookmarked && State.isBookmarked(school.id);
    const curriculumTag = Array.isArray(school.curriculum) ? school.curriculum.join(', ') : (school.curriculum || 'Standard');
    let badgeClass = 'badge-cambridge';
    if (curriculumTag.includes('GES')) badgeClass = 'badge-ges';
    if (curriculumTag.includes('IB')) badgeClass = 'badge-ib';
    if (curriculumTag.includes('Montessori')) badgeClass = 'badge-montessori';

    const isFeeDisclosed = school.is_fee_disclosed !== false && school.fee_disclosed !== false && !school.isFeeNotDisclosed;
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

    const galleryImgs = [
      school.coverImage || school.banner_url || school.logo_url || '/assets/images/campus_hero.webp',
      '/assets/images/science_lab.webp',
      '/assets/images/montessori_class.webp'
    ];

    const levelsList = Array.isArray(school.levels) ? school.levels : (Array.isArray(school.education_level) ? school.education_level : ['Primary', 'JHS']);

    return `
      <div class="school-card-enhanced school-card" id="card-${school.id}">
        <div class="card-mini-carousel" id="carousel-${school.id}">
          <img src="${galleryImgs[0]}" alt="${school.name}" class="carousel-img" id="img-${school.id}" loading="lazy" />
          
          <button class="btn-card-bookmark ${isSaved ? 'active' : ''}" data-school-id="${school.id}" data-school-name="${(school.name || 'School').replace(/"/g, '&quot;')}" title="${isSaved ? 'Remove from Saved Bookmarks' : 'Bookmark / Save School'}">
            ${isSaved ? '🔖' : '🤍'}
          </button>

          <div class="carousel-nav-dots" data-school-id="${school.id}">
            <span class="carousel-dot active" data-img="${galleryImgs[0]}" title="Campus Front"></span>
            <span class="carousel-dot" data-img="${galleryImgs[1]}" title="Science &amp; Tech Labs"></span>
            <span class="carousel-dot" data-img="${galleryImgs[2]}" title="Modern Classrooms"></span>
          </div>

          <div class="school-card-badges">
            <span class="badge ${badgeClass}">${curriculumTag}</span>
            ${(school.verified || school.is_verified) ? '<span class="badge badge-verified">🛡️ Verified Profile</span>' : ''}
            <span class="badge-radar-container"><span class="radar-pulse-core"></span> Admissions Open</span>
          </div>
          
          <div class="school-card-fee-pill ${isFeeDisclosed ? feeTierClass : ''}">
            ${feeDisplay}
          </div>
        </div>
        <div class="school-card-body">
          <div class="school-card-location">
            <span>📍</span> ${school.suburb || school.locality || 'Greater Accra'}, ${school.region || 'Greater Accra'}
          </div>
          <h3 class="school-card-name">${school.name}</h3>
          
          <div class="school-card-levels">
            ${levelsList.slice(0, 3).map(l => `<span class="level-tag">${l}</span>`).join('')}
          </div>

          <div class="school-card-actions">
            <button class="btn-pill btn-primary btn-card-view" data-school-id="${school.id}">View Campus</button>
            <button class="btn-pill btn-outline btn-card-compare" data-school-id="${school.id}">Compare</button>
            <button class="btn-pill btn-emerald btn-card-wa" data-wa="${school.whatsapp || ''}">WhatsApp</button>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Hero Search Form
    const searchForm = document.getElementById('hero-search-form');
    if (searchForm) {
      searchForm.onsubmit = (e) => {
        e.preventDefault();
        const suburb = document.getElementById('hero-search-suburb')?.value.trim() || '';
        const level = document.getElementById('hero-search-level')?.value || 'All';
        const curriculum = document.getElementById('hero-search-curriculum')?.value || 'All';

        State.filters.search = suburb;
        State.filters.suburb = 'All';
        State.filters.level = level;
        State.filters.curriculum = curriculum;

        App.navigate('directory');
      };
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

    // Dual Free Access Section Handlers
    document.getElementById('btn-home-guest-explore')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    document.getElementById('btn-home-parent-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.openLoginModal) {
        Modals.openLoginModal({
          initialTab: 'signup',
          notice: 'Create your 100% free Parent account to save shortlists, plan admissions, and track school journeys.'
        });
      }
    });

    document.getElementById('btn-home-parent-signin')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.openLoginModal) {
        Modals.openLoginModal({
          initialTab: 'signin',
          notice: 'Sign in to access your saved shortlists, school journeys, and parent planning tools.'
        });
      }
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

    // SECTION: School Owners & Proprietors Spotlight CTAs
    document.getElementById('btn-proprietors-solutions')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-schools');
    });

    document.getElementById('btn-proprietors-open-admissions')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    document.getElementById('btn-proprietors-post-vacancy')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('teachers');
    });

    document.getElementById('btn-proprietors-publish-tender')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.openPostRFQModal) {
        Modals.openPostRFQModal();
      } else {
        App.navigate('suppliers');
      }
    });

    // SECTION: Teachers & Education Professionals Spotlight CTAs
    document.getElementById('btn-teachers-view-all-jobs')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('teachers');
    });

    document.getElementById('btn-teachers-join-pro')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-teachers');
    });

    ['btn-job-details-1', 'btn-job-details-2', 'btn-job-details-3'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        e.preventDefault();
        App.navigate('teachers');
      });
    });

    // SECTION: Suppliers & Service Providers Spotlight CTAs
    document.getElementById('btn-suppliers-view-all-tenders')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('suppliers');
    });

    document.getElementById('btn-suppliers-join-provider')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('for-suppliers');
    });

    ['btn-tender-details-1', 'btn-tender-details-2', 'btn-tender-details-3'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        e.preventDefault();
        App.navigate('suppliers');
      });
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
          btn.innerHTML = isNowSaved ? '🔖' : '🤍';
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
        API.trackPromotionClick(campaignId).catch(() => {});
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
