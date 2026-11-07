/**
 * SkoolFinder Ghana - Public Homepage View (Modern 5-Chapter Architecture)
 * 
 * Chapter 1: The Modern Split-Stage Hero (Search Capsule + Living Campus Spotlight)
 * Chapter 2: Two Ways to Explore. Both Completely Free (Apple-Style Dual Master Cards)
 * Chapter 3: Curated Living Showcase & Enclave Locality Hubs
 * Chapter 4: Parent Power Tools & Statutory Trust Verification (Bento Grid)
 * Chapter 5: The Connected Education Ecosystem (Segmented Tabbed Experience)
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
      <!-- H01 & H02: Hero Section with 4-Image Crossfade Slideshow -->
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
            <div class="hero-pill" style="margin: 0;">
              <span>🇬🇭</span> Greater Accra &amp; Tema Pre-Tertiary Directory
            </div>
            <button id="btn-hero-role-tour" class="hero-tour-pill" title="Take a 30-second guided tour for Parents, Schools, Suppliers &amp; Teachers">
              <span>🧭</span> New to SkoolFinder? Take a 30s Guided Tour &rarr;
            </button>
          </div>

          <h1 class="hero-title">
            Find the <span>Right School</span> for Your Child in Greater Accra
          </h1>
          <p class="hero-subtitle">
            Explore accredited pre-schools, basic schools, and senior high schools across Accra and Tema. Compare curricula, verified fee schedules, and connect with admissions offices without forced registration.
          </p>

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

      <!-- Platform Metrics Strip (Truthful Greater Accra Evidence) -->
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
           CHAPTER 2: TWO WAYS TO EXPLORE. BOTH COMPLETELY FREE
           ======================================================== -->
      <section id="section-two-ways-free" style="background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); padding: 3rem 0; border-bottom: 1px solid var(--border-light, #e2e8f0); position: relative;">
        <div class="container">
          <div style="text-align: center; max-width: 540px; margin: 0 auto 1.75rem;">
            <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.75rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.35rem; border: 1px solid #bfdbfe; margin-bottom: 0.45rem;">
              <span>👨‍👩‍👧</span> FREE PARENT ACCESS
            </span>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: 1.45rem; font-weight: 800; color: #0A2046; line-height: 1.3; margin: 0 0 0.35rem 0;">
              Two Ways to Explore (Both Free)
            </h2>
            <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin: 0 auto;">
              Browse freely as a guest, or create a free account to save favourites and track admissions.
            </p>
          </div>

          <!-- Dual Master Cards: Compact 720px Width Side-by-Side -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; align-items: stretch; max-width: 720px; margin: 0 auto;">
            
            <!-- LEFT CARD: EXPLORE AS A GUEST (ACCESS MODE A) -->
            <div class="access-mode-card" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 16px; padding: 1.6rem 1.4rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.2s, box-shadow 0.2s;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <span style="font-size: 0.74rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; padding: 0.2rem 0.6rem; border-radius: 9999px;">
                    ACCESS MODE A
                  </span>
                  <span style="font-family: var(--font-heading, sans-serif); font-size: 1.25rem; font-weight: 900; color: #0A2046;">
                    GH₵ 0
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                  Explore as a Guest
                </h3>
                <p style="color: #059669; font-size: 0.82rem; font-weight: 700; margin: 0 0 1.15rem 0;">
                  No account or sign-up needed
                </p>

                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: #334155;">
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 0.95rem; line-height: 1.3;">✓</span>
                    <span>Browse all accredited private schools</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 0.95rem; line-height: 1.3;">✓</span>
                    <span>Filter by location, curriculum &amp; published fees</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 0.95rem; line-height: 1.3;">✓</span>
                    <span>Compare up to 4 schools side-by-side</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 0.95rem; line-height: 1.3;">✓</span>
                    <span>Contact schools &amp; request campus visits</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-guest-explore" class="btn-pill btn-outline" style="width: 100%; justify-content: center; padding: 0.75rem 1rem; font-size: 0.92rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  <span>🔍</span> Explore Schools &rarr;
                </button>
                <div style="text-align: center; font-size: 0.74rem; color: #64748b; margin-top: 0.5rem;">
                  Instant access &bull; 100% free
                </div>
              </div>
            </div>

            <!-- RIGHT CARD: JOIN AS A PARENT (ACCESS MODE B) -->
            <div class="access-mode-card" style="background: #ffffff; border: 2px solid #D5A63B; border-radius: 16px; padding: 1.6rem 1.4rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 28px rgba(213,166,59,0.12); position: relative; transition: transform 0.2s, box-shadow 0.2s;">
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #D5A63B 0%, #b45309 100%); color: #ffffff; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.25rem 0.9rem; border-radius: 9999px; box-shadow: 0 3px 8px rgba(180,83,9,0.25); white-space: nowrap;">
                ⭐ RECOMMENDED FOR FAMILIES
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; margin-top: 0.15rem;">
                  <span style="font-size: 0.74rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em; background: #fef3c7; padding: 0.2rem 0.6rem; border-radius: 9999px;">
                    ACCESS MODE B
                  </span>
                  <span style="font-family: var(--font-heading, sans-serif); font-size: 1.25rem; font-weight: 900; color: #0A2046;">
                    GH₵ 0 <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">(FREE)</span>
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">
                  Create Parent Account
                </h3>
                <p style="color: #92400e; font-size: 0.82rem; font-weight: 700; margin: 0 0 1.15rem 0;">
                  Everything in Guest, plus personalized tools
                </p>

                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: #1e293b;">
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 0.95rem; line-height: 1.3;">✦</span>
                    <span><strong>Save favourite schools</strong> &amp; searches</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 0.95rem; line-height: 1.3;">✦</span>
                    <span><strong>Personalised recommendations</strong> for your child</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 0.95rem; line-height: 1.3;">✦</span>
                    <span><strong>Track admissions, visits</strong> &amp; application dates</span>
                  </li>
                  <li style="display: flex; gap: 0.55rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 0.95rem; line-height: 1.3;">✦</span>
                    <span><strong>Parent Dashboard</strong> with fee planning tools</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-parent-signup" class="btn-pill btn-gold" style="width: 100%; justify-content: center; padding: 0.75rem 1rem; font-size: 0.94rem; font-weight: 800; cursor: pointer; border-radius: 9999px; box-shadow: 0 4px 12px rgba(213,166,59,0.3); transition: all 0.2s;">
                  <span>✨</span> Create Free Parent Account &rarr;
                </button>
                <div style="text-align: center; font-size: 0.74rem; color: #64748b; margin-top: 0.5rem;">
                  Takes 30 seconds &bull; No card required
                </div>
              </div>
            </div>

          </div>

          <!-- Reassurance statement integrated cleanly into parent access session -->
          <div style="margin-top: 1.5rem; text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span>🛡️</span>
              <span>100% Free to Explore</span>
              <span style="color: #cbd5e1;">&bull;</span>
              <span>No Subscription Fees</span>
              <span style="color: #cbd5e1;">&bull;</span>
              <span>No Payment Card Required</span>
            </div>
            <div style="font-size: 0.84rem; color: #64748b;">
              Already have an account? 
              <button type="button" id="btn-home-parent-signin" style="background: none; border: none; color: #1266C4; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.84rem; padding: 0.15rem 0.35rem;">
                Sign in to continue your school journey &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           CHAPTER 3: LIVING CAMPUS SHOWCASE & LOCALITY ENCLAVES
           ======================================================== -->
      <section style="padding: 5rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          
          <div class="section-header" style="text-align: center; max-width: 760px; margin: 0 auto 3rem;">
            <span class="section-tag">⭐ Verified Greater Accra Institutions</span>
            <h2 class="section-title" style="font-family: var(--font-heading); font-size: 2.2rem; color: #0A2046; font-weight: 800; margin-top: 0.35rem;">
              Featured Campuses in Accra &amp; Tema
            </h2>
            <p class="section-desc" style="color: #64748b; font-size: 1rem; line-height: 1.6;">
              Leading institutions with reviewed academic curricula, established leadership, and modern facilities.
            </p>
          </div>

          <div class="schools-grid">
            ${displaySchools.map(s => this.renderSchoolCard(s)).join('')}
          </div>

          <div style="text-align: center; margin-top: 2.75rem;">
            <button id="btn-browse-all-schools" class="btn-pill btn-primary" style="padding: 0.85rem 2.25rem; font-size: 1rem; font-weight: 800; cursor: pointer;">
              Explore All Schools in Directory &rarr;
            </button>
          </div>

          <!-- Decision Tools Teasers (Compare & Matchmaker) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 4rem;">
            <!-- H07: Compare Teaser -->
            <div style="background: linear-gradient(135deg, #0A2046 0%, #16366f 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-gold" style="font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem; display: inline-block;">
                  ⚖️ Side-by-Side Analysis
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Compare Up to 4 Schools Free
                </h3>
                <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  Evaluate tuition, curricula, student support, facilities, and intake requirements side-by-side. 100% guest accessible with no paywall or forced account creation.
                </p>
              </div>
              <button id="btn-home-compare-cta" class="btn-pill btn-gold" style="font-weight: 800; padding: 0.75rem 1.5rem; align-self: flex-start; cursor: pointer;">
                Open 4-School Compare Matrix &rarr;
              </button>
            </div>

            <!-- H08: Matchmaker Teaser -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: rgba(59,130,246,0.25); color: #93c5fd; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem; display: inline-block;">
                  🎯 2-Minute Fit Adviser
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Explainable Fit Matchmaker
                </h3>
                <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  Answer two quick questions about your child's grade level and preferred suburb. Get transparent, evidence-grounded recommendations without manufactured percentages.
                </p>
              </div>
              <button id="btn-home-matchmaker-cta" class="btn-pill btn-primary" style="font-weight: 800; padding: 0.75rem 1.5rem; align-self: flex-start; cursor: pointer;">
                Launch Fit Matchmaker &rarr;
              </button>
            </div>
          </div>

          <!-- Enclave Locality Hubs (H05) -->
          <div id="section-locations" style="margin-top: 4.5rem; padding-top: 3.5rem; border-top: 1px solid #e2e8f0;">
            <div style="text-align: center; max-width: 720px; margin: 0 auto 2.5rem;">
              <span class="section-tag">📍 Geographic Discovery</span>
              <h3 style="font-family: var(--font-heading); font-size: 1.85rem; color: #0A2046; font-weight: 800; margin-top: 0.25rem;">
                Explore Schools by Enclave in Accra &amp; Tema
              </h3>
              <p style="color: #64748b; font-size: 0.95rem; margin: 0;">Search schools near your residence or workplace across established educational communities.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
              <div class="suburb-browse-card" data-suburb="Cantonments" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🏛️</div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0 0 0.25rem 0; font-weight: 800;">Cantonments &amp; Airport</h4>
                <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 0.75rem 0;">GIS, Morning Star, prestigious Cambridge &amp; IB academies.</p>
                <div style="color: #1266C4; font-size: 0.82rem; font-weight: 700;">View Cantonments Schools &rarr;</div>
              </div>

              <div class="suburb-browse-card" data-suburb="East Legon" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🌳</div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0 0 0.25rem 0; font-weight: 800;">East Legon &amp; Roman Ridge</h4>
                <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 0.75rem 0;">The Roman Ridge School, top Montessori pre-schools &amp; bilingual centres.</p>
                <div style="color: #1266C4; font-size: 0.82rem; font-weight: 700;">View East Legon Schools &rarr;</div>
              </div>

              <div class="suburb-browse-card" data-suburb="Tema" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🚢</div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0 0 0.25rem 0; font-weight: 800;">Spintex &amp; Tema Metropolis</h4>
                <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 0.75rem 0;">SOS-HGIC, Community 6 preparatory academies, and boarding schools.</p>
                <div style="color: #1266C4; font-size: 0.82rem; font-weight: 700;">View Tema &amp; Spintex Schools &rarr;</div>
              </div>

              <div class="suburb-browse-card" data-suburb="Achimota" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🎓</div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0 0 0.25rem 0; font-weight: 800;">Achimota &amp; Okaikwei North</h4>
                <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 0.75rem 0;">Achimota School, historic campuses, and STEM-focused basic schools.</p>
                <div style="color: #1266C4; font-size: 0.82rem; font-weight: 700;">View Achimota Schools &rarr;</div>
              </div>
            </div>
          </div>

          <!-- Level-Specific Search Cards (H04) -->
          <div style="margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid #e2e8f0;">
            <div style="margin-bottom: 1.5rem;">
              <span class="section-tag">🎓 Level-Specific Search</span>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; font-weight: 800; margin: 0.25rem 0 0 0;">
                Browse by Education Level
              </h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem;">
              <div class="level-browse-card" data-level="Crèche" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🍼</div>
                <h4 style="font-size: 1rem; color: #0A2046; margin: 0 0 0.2rem 0; font-weight: 800;">Crèche &amp; Daycare</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">Ages 3 mos – 3 yrs</div>
                <div style="color: #1266C4; font-size: 0.78rem; font-weight: 700;">Explore Crèches &rarr;</div>
              </div>

              <div class="level-browse-card" data-level="Kindergarten" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🎨</div>
                <h4 style="font-size: 1rem; color: #0A2046; margin: 0 0 0.2rem 0; font-weight: 800;">Nursery &amp; KG</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">Ages 3 – 5 yrs</div>
                <div style="color: #1266C4; font-size: 0.78rem; font-weight: 700;">Explore Early Years &rarr;</div>
              </div>

              <div class="level-browse-card" data-level="Primary" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">✏️</div>
                <h4 style="font-size: 1rem; color: #0A2046; margin: 0 0 0.2rem 0; font-weight: 800;">Primary School</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">Class 1 – 6</div>
                <div style="color: #1266C4; font-size: 0.78rem; font-weight: 700;">Explore Primary &rarr;</div>
              </div>

              <div class="level-browse-card" data-level="JHS" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🔬</div>
                <h4 style="font-size: 1rem; color: #0A2046; margin: 0 0 0.2rem 0; font-weight: 800;">Junior High (JHS)</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">JHS 1 – 3</div>
                <div style="color: #1266C4; font-size: 0.78rem; font-weight: 700;">Explore JHS &rarr;</div>
              </div>

              <div class="level-browse-card" data-level="SHS" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
                <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🎓</div>
                <h4 style="font-size: 1rem; color: #0A2046; margin: 0 0 0.2rem 0; font-weight: 800;">Senior High (SHS)</h4>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">SHS 1 – 3</div>
                <div style="color: #1266C4; font-size: 0.78rem; font-weight: 700;">Explore Senior High &rarr;</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ========================================================
           CHAPTER 4: PARENT POWER TOOLS & STATUTORY TRUST (Bento Grid)
           ======================================================== -->
      <section style="padding: 5rem 0; background: #ffffff; border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="text-align: center; max-width: 780px; margin: 0 auto 3rem;">
            <span class="section-tag">💡 Financial Transparency &amp; Safeguards</span>
            <h2 style="font-family: var(--font-heading); font-size: 2.2rem; color: #0A2046; font-weight: 800; margin-top: 0.35rem;">
              Parent Educational Toolkit &amp; Statutory Safeguards
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6;">
              Independent fee clarity, BECE placement analytics, and statutory NaSIA licensing evidence.
            </p>
          </div>

          <!-- Modern Bento Grid -->
          <div class="modern-bento-grid">
            
            <!-- Bento 1: Understanding School Fees in Ghana (H09) -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 800; font-size: 0.75rem; margin-bottom: 0.75rem; display: inline-block;">
                  💰 Pre-Tertiary Fee Intelligence
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; margin: 0 0 0.75rem 0; font-weight: 800;">
                  Understanding School Fees in Ghana
                </h3>
                <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin-bottom: 1.25rem;">
                  Practical guidance on reading pre-tertiary Ghanaian fee structures, caution deposits, and recurring term billing.
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.84rem; color: #334155; margin-bottom: 1.25rem;">
                  <div style="background: #ffffff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <strong style="color: #0A2046;">Tuition vs. Term Levies:</strong> Schools bill per 3-month term (3 terms per academic year). Always verify PTA levies and lunch inclusions.
                  </div>
                  <div style="background: #ffffff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <strong style="color: #0A2046;">One-Off Admission Charges:</strong> Capital development fees and refundable caution deposits are charged only in entry year.
                  </div>
                  <div style="background: #ffffff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <strong style="color: #0A2046;">Missing Fee Transparency:</strong> Undisclosed fees are truthfully labeled "Fee Not Disclosed" with direct bursar inquiry pathways.
                  </div>
                </div>
              </div>

              <button type="button" class="btn-pill btn-outline" onclick="App.navigate('parents')" style="font-size: 0.82rem; font-weight: 800; border-color: #0A2046; color: #0A2046;">
                Calculate Termly Budget in Planning Studio &rarr;
              </button>
            </div>

            <!-- Bento 2: Academic Resources & CSSPS Calculator (H15) -->
            <div style="background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: rgba(255,255,255,0.18); color: #F5D780; font-weight: 800; font-size: 0.75rem; margin-bottom: 0.75rem; display: inline-block;">
                  📚 Free Academic Library
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800;">
                  BECE, WASSCE & Cambridge Past Papers
                </h3>
                <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 1.25rem;">
                  Official examination past papers, marking schemes, and senior high school admissions predictors.
                </p>

                <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;">
                  <div style="font-size: 0.72rem; color: #F5D780; font-weight: 800; text-transform: uppercase;">
                    GES CSSPS Placement Engine
                  </div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: #ffffff; margin: 0.2rem 0 0.35rem 0;">
                    Calculate BECE Aggregate &amp; Explore Category A, B &amp; C Schools
                  </div>
                  <div style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.5;">
                    Input your 4 core subjects and 2 electives to calculate cutoffs under the 30% public school quota.
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <button type="button" id="btn-home-cssps-calc" class="btn-pill btn-gold" style="font-size: 0.82rem; font-weight: 800; padding: 0.55rem 1rem;">
                  🎓 Launch BECE Calculator &rarr;
                </button>
                <button type="button" id="btn-goto-resources" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 700; border-color: rgba(255,255,255,0.4); color: #ffffff;">
                  Browse Past Papers
                </button>
                <button type="button" id="btn-home-upload-paper" style="display: none;" aria-hidden="true" tabindex="-1"></button>
              </div>
            </div>

            <!-- Bento 3: How We Verify School Information (H16) -->
            <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-xl); padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-emerald" style="font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem; display: inline-block;">
                  🛡️ 4 Trust Pillars
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; margin: 0 0 0.75rem 0; font-weight: 800;">
                  How We Verify School Information
                </h3>
                <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin-bottom: 1.25rem;">
                  Rigorous statutory verification separating regulatory government licensing from profile checks.
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.82rem; color: #334155; margin-bottom: 1.25rem;">
                  <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <span>🇬🇭</span> <div><strong>NaSIA Licence Status:</strong> Verified against public statutory inspection evidence.</div>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <span>🏫</span> <div><strong>School Ownership Vetted:</strong> Proprietors &amp; headmistresses legally verified.</div>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <span>📋</span> <div><strong>Profile Information Reviewed:</strong> Fee schedules and facilities verified.</div>
                  </div>
                  <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                    <span>⚖️</span> <div><strong>Factual Integrity Guarantee:</strong> Zero fabricated ranking percentages.</div>
                  </div>
                </div>
              </div>

              <button type="button" id="btn-home-full-tour" class="btn-pill btn-primary" style="font-size: 0.82rem; font-weight: 800; background: #0A2046; border-color: #0A2046;">
                🧭 Take the 30s Guided Platform Tour &rarr;
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- ========================================================
           CHAPTER 5: THE CONNECTED EDUCATION ECOSYSTEM (Tabbed)
           ======================================================== -->
      <section style="padding: 5rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          
          <div style="text-align: center; max-width: 760px; margin: 0 auto 2.5rem;">
            <span class="section-tag">🤝 Dedicated Ecosystem Workspaces</span>
            <h2 style="font-family: var(--font-heading); font-size: 2.2rem; color: #0A2046; font-weight: 800; margin-top: 0.35rem;">
              Empowering Families, Educators &amp; School Owners
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6;">
              Select your role to access dedicated workspaces, verified directories, and protected workflows.
            </p>
          </div>

          <!-- Segmented Role Switcher Tabs -->
          <div style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
            <button type="button" class="btn-eco-tab btn-pill btn-primary active" data-eco="schools" style="font-size: 0.92rem; padding: 0.65rem 1.4rem; font-weight: 800; cursor: pointer;">
              🏫 School Proprietors &amp; Heads
            </button>
            <button type="button" class="btn-eco-tab btn-pill btn-outline" data-eco="teachers" style="font-size: 0.92rem; padding: 0.65rem 1.4rem; font-weight: 800; cursor: pointer;">
              🧑‍🏫 Teachers &amp; Tutors
            </button>
            <button type="button" class="btn-eco-tab btn-pill btn-outline" data-eco="suppliers" style="font-size: 0.92rem; padding: 0.65rem 1.4rem; font-weight: 800; cursor: pointer;">
              📦 Educational Suppliers
            </button>
          </div>

          <!-- Tab Pane 1: School Proprietors (H13 & H14) -->
          <div class="eco-tab-pane" data-eco="schools" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏫</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; margin: 0 0 0.5rem 0; font-weight: 800;">
                School Owners &amp; Heads
              </h3>
              <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
                Claim your institutional profile or register a new campus. Access verified parent inquiries, admissions pipeline CRM, and vacancy advertising. Transparent plans from Free (GH₵0) to Growth (GH₵99/mo).
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 700;">Free Starter (GH₵0)</span>
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 700;">Growth (GH₵99/mo)</span>
                <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 700;">Pro (GH₵249/mo)</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;">
              <button type="button" id="btn-goto-for-schools" class="btn-pill btn-primary" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem;">
                🏛️ Why Join as School &rarr;
              </button>
              <button type="button" id="btn-home-register-school" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem; border-color: #0A2046; color: #0A2046;">
                Claim / List School
              </button>
              <button type="button" id="btn-home-school-portal" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 700; padding: 0.75rem 1.25rem;">
                🏫 Campus Portal Demo
              </button>
              <button type="button" id="btn-home-view-school-pricing" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.6rem 1.25rem;">
                💳 View School Plans
              </button>
            </div>
          </div>

          <!-- Tab Pane 2: Teachers & Tutors (H10 & H11) -->
          <div class="eco-tab-pane" data-eco="teachers" style="display: none; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🧑‍🏫</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; margin: 0 0 0.5rem 0; font-weight: 800;">
                Teachers, Tutors &amp; Vacancies
              </h3>
              <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
                Discover teaching vacancies across Accra &amp; Kumasi. 1-click job application is completely free for candidates. Qualified educators can publish tutoring services on approved Plus (GH₵39/mo) and Business (GH₵99/mo) plans.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">1-Click Apply Free</span>
                <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">NTC Licence Vetting</span>
                <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">Private Home Tutors</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;">
              <button type="button" id="btn-goto-jobs" class="btn-pill btn-gold" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem;">
                Explore Vacancies &amp; Tutors &rarr;
              </button>
              <button type="button" id="btn-goto-for-teachers" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem; border-color: #10B981; color: #065f46;">
                🧑‍🏫 Why Join as Teacher &rarr;
              </button>
              <button type="button" id="btn-home-post-job" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 700; padding: 0.75rem 1.25rem;">
                💼 Post Vacancy
              </button>
              <button type="button" id="btn-home-view-tutor-pricing" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.6rem 1.25rem;">
                💳 View Educator Plans
              </button>
            </div>
          </div>

          <!-- Tab Pane 3: Suppliers & School Tenders (H12) -->
          <div class="eco-tab-pane" data-eco="suppliers" style="display: none; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📦</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; margin: 0 0 0.5rem 0; font-weight: 800;">
                Suppliers &amp; School Tenders
              </h3>
              <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
                Connecting schools with verified bulk food suppliers, STEM lab equipment vendors, textbook publishers, and uniform fabricators. Sealed bids and quotation prices remain strictly confidential.
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 700;">Sealed Bids Protected</span>
                <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 700;">Verified Vendors</span>
                <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 700;">50/50 MoMo Escrow</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.75rem;">
              <button type="button" id="btn-goto-suppliers" class="btn-pill btn-primary" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem;">
                Explore Suppliers &amp; RFQs &rarr;
              </button>
              <button type="button" id="btn-goto-for-suppliers" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 800; padding: 0.75rem 1.25rem; border-color: #D5A63B; color: #92400e;">
                📦 Why Join as Supplier &rarr;
              </button>
              <button type="button" id="btn-home-post-rfq" class="btn-pill btn-outline" style="font-size: 0.9rem; font-weight: 700; padding: 0.75rem 1.25rem;">
                Post School RFQ
              </button>
            </div>
          </div>

        </div>
      </section>
    `;
  },

  renderSchoolCard(school) {
    const isCompared = typeof State !== 'undefined' && State.isInCompare ? State.isInCompare(school.id) : false;
    const isSaved = typeof State !== 'undefined' && State.isBookmarked ? State.isBookmarked(school.id) : false;
    const curriculumTag = Array.isArray(school.curriculum) && school.curriculum.length > 0 ? school.curriculum[0] : (school.curriculum || 'GES');
    let badgeClass = 'badge-ges';
    if (String(curriculumTag).includes('Cambridge')) badgeClass = 'badge-cambridge';
    if (String(curriculumTag).includes('IB')) badgeClass = 'badge-ib';
    if (String(curriculumTag).includes('Montessori')) badgeClass = 'badge-montessori';

    const isFeeDisclosed = school.fee_disclosed !== false && (school.tuition_min || school.tuition_max || (school.feeBand && !school.feeBand.includes('Not Disclosed')));
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
    const facilitiesList = Array.isArray(school.facilities) ? school.facilities : [];
    const hasPhoneOrWa = Boolean(school.whatsapp || school.phone);

    return `
      <div class="school-card-enhanced school-card" id="card-${school.id}">
        <div class="card-mini-carousel" id="carousel-${school.id}">
          <img src="${galleryImgs[0]}" alt="${school.name}" class="carousel-img" id="img-${school.id}" loading="lazy" />
          
          <button class="btn-card-bookmark ${isSaved ? 'active' : ''}" data-school-id="${school.id}" data-school-name="${(school.name || 'School').replace(/"/g, '&quot;')}" title="${isSaved ? 'Remove from Saved Bookmarks' : 'Bookmark / Save School'}" style="position: absolute; top: 12px; right: 12px; z-index: 6; background: rgba(255,255,255,0.92); border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.05rem; box-shadow: 0 2px 8px rgba(0,0,0,0.18); transition: transform 0.15s ease;">
            ${isSaved ? '🔖' : '🤍'}
          </button>

          <div class="carousel-nav-dots" data-school-id="${school.id}">
            <span class="carousel-dot active" data-img="${galleryImgs[0]}" title="Campus Front"></span>
            <span class="carousel-dot" data-img="${galleryImgs[1]}" title="Science &amp; Tech Labs"></span>
            <span class="carousel-dot" data-img="${galleryImgs[2]}" title="Modern Classrooms"></span>
          </div>

          <div class="school-card-badges">
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

    // H03: Three Clear Discovery Choices
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
      const locSection = document.getElementById('section-locations');
      if (locSection) {
        locSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        App.navigate('directory');
      }
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

    // Featured Schools Section CTAs
    document.getElementById('btn-browse-all-schools')?.addEventListener('click', () => {
      App.navigate('directory');
    });

    // H07 & H08: Compare & Matchmaker CTAs
    document.getElementById('btn-home-compare-cta')?.addEventListener('click', () => {
      App.navigate('compare');
    });

    document.getElementById('btn-home-matchmaker-cta')?.addEventListener('click', () => {
      App.navigate('matchmaker');
    });

    // School Card Action Events
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

    // Ecosystem Navigation Links (Chapter 5)
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

    // Chapter 5 Segmented Ecosystem Tabs Switcher
    document.querySelectorAll('.btn-eco-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        const targetEco = e.currentTarget.dataset.eco;
        document.querySelectorAll('.btn-eco-tab').forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-outline');
        });
        e.currentTarget.classList.add('btn-primary', 'active');
        e.currentTarget.classList.remove('btn-outline');
        
        document.querySelectorAll('.eco-tab-pane').forEach(pane => {
          pane.style.display = pane.dataset.eco === targetEco ? 'grid' : 'none';
        });
      });
    });

    // Role Tour Banner Events
    document.getElementById('btn-home-full-tour')?.addEventListener('click', () => {
      Modals.openRoleTourModal('parent');
    });

    document.getElementById('btn-hero-role-tour')?.addEventListener('click', () => {
      Modals.openRoleTourModal('parent');
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

    // Hero Sponsored Promotion Spotlight CTA
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

    // Dual Free Access Section Handlers (Free Parent Access Strategy v1.2 / v1.3)
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
  }
};

if (typeof window !== 'undefined') {
  window.HomeView = HomeView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeView;
}
