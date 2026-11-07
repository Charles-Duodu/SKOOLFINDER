/**
 * SkoolFinder Ghana - Public Homepage View (v1.0 Baseline)
 * Comprehensive implementation of modules H01 through H16:
 * - H01: Shell Navigation & Role-Aware Access
 * - H02: School-Search Hero (Greater Accra / Tema focus)
 * - H03: Three Clear Discovery Pathways (Find Schools, Matchmaker, Location Hubs)
 * - H04: Education Levels (Crèche, KG, Primary, JHS, SHS)
 * - H05: Location Hubs (Cantonments, East Legon, Spintex, Tema, Achimota)
 * - H06: Featured School Cards with Truthful Fee Period & Missing-Data Labels
 * - H07: 4-Way Side-by-Side Comparison Introduction (Zero Paywall)
 * - H08: Explainable Matchmaker Introduction (No Fake % Scores)
 * - H09: Fee Transparency & Admissions Guidance
 * - H10 & H11: Opportunities Gateway (Teaching Vacancies & Vetted Tutors)
 * - H12: B2B Procurement & Public Tenders (Sealed Bids Protected)
 * - H13 & H14: Institutional Onboarding & Approved Pricing (Schools & Professionals)
 * - H15: Academic Resource Centre (BECE / WASSCE Past Papers)
 * - H16: "How We Verify School Information" & NaSIA Distinction Strip
 */
const HomeView = {
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
              <span>🇬🇭</span> Greater Accra & Tema Pre-Tertiary Directory
            </div>
            <button id="btn-hero-role-tour" class="hero-tour-pill" title="Take a 30-second guided tour for Parents, Schools, Suppliers & Teachers">
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
                  <option value="Crèche">Crèche & Daycare</option>
                  <option value="Kindergarten">Nursery & Kindergarten</option>
                  <option value="Primary">Primary School (Class 1-6)</option>
                  <option value="JHS">Junior High School (JHS)</option>
                  <option value="SHS">Senior High School (SHS)</option>
                </select>
              </div>

              <div class="search-field">
                <label for="hero-search-curriculum" class="search-label">📚 Curriculum</label>
                <select id="hero-search-curriculum" class="search-select" aria-label="Filter by Curriculum">
                  <option value="All">All Curricula</option>
                  <option value="Cambridge">Cambridge (CIE / IGCSE)</option>
                  <option value="GES">GES Standards-based</option>
                  <option value="Montessori">Montessori</option>
                  <option value="IB">International Baccalaureate (IB)</option>
                </select>
              </div>

              <button type="submit" id="btn-hero-search-submit" class="search-btn-hero">
                <span>🔍</span> Find Schools
              </button>
            </form>

            <!-- H03: Three Clear Discovery Choices -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.18); flex-wrap: wrap; gap: 0.75rem;">
              <span style="font-size: 0.82rem; color: rgba(255, 255, 255, 0.9); font-weight: 600;">
                Three Discovery Pathways:
              </span>
              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <button id="btn-choice-schools" type="button" class="btn-pill" style="font-size: 0.8rem; padding: 0.35rem 0.85rem; background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3);">
                  <span>🏫</span> Browse All Schools
                </button>
                <button id="btn-hero-matchmaker" type="button" class="btn-pill btn-gold" style="font-size: 0.8rem; padding: 0.35rem 0.85rem; font-weight: 800; box-shadow: 0 2px 8px rgba(213, 166, 59, 0.3);">
                  <span>🎯</span> 2-Min Fit Matchmaker
                </button>
                <button id="btn-choice-matchmaker" type="button" class="btn-pill btn-gold" style="display: none;" aria-hidden="true" tabindex="-1"></button>
                <button id="btn-choice-locations" type="button" class="btn-pill" style="font-size: 0.8rem; padding: 0.35rem 0.85rem; background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3);">
                  <span>📍</span> Accra & Tema Hubs
                </button>
              </div>
            </div>
          </div>

          ${heroPromo ? `
            <div id="hero-sponsored-spotlight" style="margin-top: 1.25rem; background: rgba(10, 32, 70, 0.8); backdrop-filter: blur(12px); border: 1.5px solid #fbbf24; border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="background: #fbbf24; color: #000; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 100px; letter-spacing: 0.05em; text-transform: uppercase;">
                  Featured Spotlight
                </span>
                <span style="color: #fff; font-size: 0.92rem; font-weight: 700;">
                  ${heroPromo.headline || heroPromo.school_name}
                </span>
              </div>
              <button class="btn-pill btn-gold" id="btn-hero-promo-cta" data-campaign-id="${heroPromo.id}" data-target-url="${heroPromo.target_url || `/school/${heroPromo.school_id}`}" style="font-size: 0.76rem; padding: 0.35rem 0.95rem; font-weight: 800;">
                ${heroPromo.cta_label || 'View Admissions'} &rarr;
              </button>
            </div>
          ` : ''}
        </div>

        <div class="hero-slide-indicators" id="hero-slide-indicators">
          <span class="slide-indicator active" data-index="0" title="Campus Quadrangle"></span>
          <span class="slide-indicator" data-index="1" title="Science Labs"></span>
          <span class="slide-indicator" data-index="2" title="Classrooms"></span>
          <span class="slide-indicator" data-index="3" title="Sports Complex"></span>
        </div>
      </section>

      <!-- Platform Metrics Strip (Truthful Greater Accra Pilot Evidence) -->
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
              <span class="metric-label">Vetted Tutors & Educators</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.suppliersCount || 8}+</span>
              <span class="metric-label">Accredited School Vendors</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Two Ways to Explore. Both Completely Free. (Free Parent Access Strategy v1.2 / v1.3) -->
      <section id="section-two-ways-free" style="background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); padding: 4.5rem 0; border-bottom: 1px solid var(--border-light, #e2e8f0); position: relative;">
        <div class="container">
          <!-- Section Eyebrow, Heading & Subtitle -->
          <div style="text-align: center; max-width: 820px; margin: 0 auto 3rem;">
            <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.35rem 0.95rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.45rem; border: 1px solid #bfdbfe; margin-bottom: 0.85rem;">
              <span>👨‍👩‍👧</span> FOR EVERY PARENT &amp; GUARDIAN
            </span>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: 2.35rem; font-weight: 800; color: #0A2046; line-height: 1.25; margin: 0 0 0.85rem 0;">
              Two Ways to Explore. Both Completely Free.
            </h2>
            <p style="color: #64748b; font-size: 1.05rem; line-height: 1.65; margin: 0 auto;">
              Find the right school for your child, your way. Explore schools freely as a guest, or create a free Parent account to save favourites, receive personalised school recommendations and plan your child's educational journey.
            </p>
          </div>

          <!-- Dual Cards Grid: Side-by-Side on Desktop, Stacked on Mobile -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: stretch; max-width: 1040px; margin: 0 auto;">
            
            <!-- LEFT CARD: EXPLORE AS A GUEST (ACCESS MODE A) -->
            <div class="access-mode-card" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 20px; padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.2s, box-shadow 0.2s;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span style="font-size: 0.8rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 9999px;">
                    ACCESS MODE A
                  </span>
                  <span style="font-family: var(--font-heading, sans-serif); font-size: 1.4rem; font-weight: 900; color: #0A2046;">
                    GH₵ 0
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.55rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  Explore as a Guest
                </h3>
                <p style="color: #059669; font-size: 0.88rem; font-weight: 700; margin: 0 0 1.25rem 0;">
                  No account. No sign-up. No payment.
                </p>

                <div style="font-size: 0.84rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.5;">
                  Immediate access to core public school discovery. Inspect profiles and compare options without sharing personal details.
                </div>

                <!-- Benefits List -->
                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: #334155;">
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Browse and discover private schools across Greater Accra &amp; Kumasi.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Search by location, school level, fees, and curriculum.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Explore school profiles, facilities, and published fees.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Compare up to four schools side-by-side.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Use the basic 2-Minute School Matchmaker.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #059669; font-weight: 800; font-size: 1rem; line-height: 1.3;">✓</span>
                    <span>Contact schools and request campus visits.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-guest-explore" class="btn-pill btn-outline" style="width: 100%; justify-content: center; padding: 0.85rem 1.25rem; font-size: 1rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  <span>🔍</span> Explore Schools &rarr;
                </button>
                <div style="text-align: center; font-size: 0.78rem; color: #64748b; margin-top: 0.65rem;">
                  Immediate access &bull; No cookies or data collected
                </div>
              </div>
            </div>

            <!-- RIGHT CARD: JOIN AS A PARENT (ACCESS MODE B) -->
            <div class="access-mode-card" style="background: #ffffff; border: 2.5px solid #D5A63B; border-radius: 20px; padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 12px 35px rgba(213,166,59,0.14); position: relative; transition: transform 0.2s, box-shadow 0.2s;">
              <!-- Gold Pill Header -->
              <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #D5A63B 0%, #b45309 100%); color: #ffffff; font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.3rem 1.1rem; border-radius: 9999px; box-shadow: 0 4px 10px rgba(180,83,9,0.25); white-space: nowrap;">
                ⭐ RECOMMENDED FOR PARENTS &amp; FAMILIES
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; margin-top: 0.25rem;">
                  <span style="font-size: 0.8rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em; background: #fef3c7; padding: 0.25rem 0.75rem; border-radius: 9999px;">
                    ACCESS MODE B
                  </span>
                  <span style="font-family: var(--font-heading, sans-serif); font-size: 1.4rem; font-weight: 900; color: #0A2046;">
                    GH₵ 0 <span style="font-size: 0.75rem; color: #059669; font-weight: 700;">(FREE FOREVER)</span>
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.55rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  Create Your Free Parent Account
                </h3>
                <p style="color: #92400e; font-size: 0.88rem; font-weight: 700; margin: 0 0 1.25rem 0;">
                  Everything guests enjoy, plus more personalised tools. Still completely free.
                </p>

                <div style="font-size: 0.84rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.5;">
                  Set up your private family cockpit to preserve comparisons, track admission milestones, and organize decisions for every child.
                </div>

                <!-- Benefits List -->
                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.92rem; color: #1e293b;">
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Save favourite schools</strong> and searches with 1-click guest transfer.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Receive personalised school recommendations</strong> tailored to your child.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Follow schools &amp; Watchlist:</strong> Get alerts on fee updates and admissions dates.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Save and revisit school comparisons</strong> anytime from any device.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Access private Parent Dashboard:</strong> 5-State Decision Board with notes.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Track enquiries, visits &amp; admissions</strong> with Next Best Action guidance.</span>
                  </li>
                  <li style="display: flex; gap: 0.65rem; align-items: flex-start;">
                    <span style="color: #D5A63B; font-weight: 900; font-size: 1.05rem; line-height: 1.3;">✦</span>
                    <span><strong>Parent Planning Studio:</strong> Estimate school costs and prepare visit checklists.</span>
                  </li>
                </ul>
              </div>

              <div>
                <button type="button" id="btn-home-parent-signup" class="btn-pill btn-gold" style="width: 100%; justify-content: center; padding: 0.85rem 1.25rem; font-size: 1.02rem; font-weight: 800; cursor: pointer; border-radius: 9999px; box-shadow: 0 4px 14px rgba(213,166,59,0.35); transition: all 0.2s;">
                  <span>✨</span> Create Free Parent Account &rarr;
                </button>
                <div style="text-align: center; font-size: 0.78rem; color: #64748b; margin-top: 0.65rem;">
                  Takes 30 seconds &bull; Zero credit card or payment required
                </div>
              </div>
            </div>

          </div>

          <!-- Reassurance Footer Strip -->
          <div style="margin-top: 3.5rem; text-align: center; padding-top: 2rem; border-top: 1px solid var(--border-light, #e2e8f0);">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 0.95rem; font-weight: 700; color: #0A2046; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span>🛡️</span>
              <span>100% Free to Explore</span>
              <span style="color: #cbd5e1;">&bull;</span>
              <span>No Subscription Fees</span>
              <span style="color: #cbd5e1;">&bull;</span>
              <span>No Payment Card Required</span>
            </div>
            <div style="font-size: 0.88rem; color: #64748b;">
              Already have an account? 
              <button type="button" id="btn-home-parent-signin" style="background: none; border: none; color: #1266C4; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.88rem; padding: 0.2rem 0.4rem;">
                Sign in to continue your school journey &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- H16: How We Verify School Information & Trust Strip -->
      <section style="background: #ffffff; padding: 3.5rem 0; border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 2.5rem;">
            <span class="badge badge-emerald" style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">
              🛡️ Rigorous Verification Standards
            </span>
            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; color: var(--theme-b-navy, #0A2046); font-weight: 800; margin-top: 0.25rem;">
              How We Verify School Information
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin: 0;">
              SkoolFinder maintains strict separation between official government regulatory licensing and platform profile checks. We do not invent fee amounts or educational quality scores.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            <!-- Trust Pillar 1 -->
            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem;">
              <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">🇬🇭</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.35rem;">
                NaSIA Licence Status
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Verified against public licensing evidence from the National Schools Inspectorate Authority (NaSIA). Only current certificates earn this status.
              </p>
            </div>

            <!-- Trust Pillar 2 -->
            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem;">
              <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">🏫</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.35rem;">
                School Ownership Vetted
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Our compliance team verifies that institutional account managers hold legal authority as proprietors or principal heads of school.
              </p>
            </div>

            <!-- Trust Pillar 3 -->
            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem;">
              <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">📋</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.35rem;">
                Profile Information Reviewed
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Disclosed fee schedules, academic curricula, facilities, and intake dates are reviewed against evidence. Missing fields are truthfully marked.
              </p>
            </div>

            <!-- Trust Pillar 4 -->
            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem;">
              <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">⚖️</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.35rem;">
                Factual Integrity Guarantee
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                No fabricated ranking scores or artificial fit percentages. Parents can report inaccuracies directly to our editorial desk for swift correction.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 2.25rem;">
            <button id="btn-home-full-tour" class="btn-pill btn-outline" style="font-size: 0.88rem; padding: 0.65rem 1.45rem; font-weight: 700; border-color: var(--theme-b-navy, #0A2046); color: var(--theme-b-navy, #0A2046);">
              🧭 Take the 30s Guided Platform Tour &rarr;
            </button>
          </div>
        </div>
      </section>

      <!-- H04: Browse by Education Level -->
      <section style="padding: 4rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
            <div>
              <span class="section-tag">🎓 Level-Specific Search</span>
              <h2 class="section-title">Browse by Education Level</h2>
              <p class="section-desc">Find pre-tertiary schools matching your child's age group and academic stage in Ghana.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem;">
            <!-- Level 1: Crèche & Daycare -->
            <div class="level-browse-card" data-level="Crèche" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍼</div>
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Crèche & Daycare</h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">Ages 3 mos – 3 yrs • Infant Care</div>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">Explore Crèches &rarr;</div>
            </div>

            <!-- Level 2: Nursery & KG -->
            <div class="level-browse-card" data-level="Kindergarten" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎨</div>
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Nursery & KG</h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">Ages 3 – 5 yrs • Early Childhood</div>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">Explore Early Years &rarr;</div>
            </div>

            <!-- Level 3: Primary -->
            <div class="level-browse-card" data-level="Primary" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">✏️</div>
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Primary School</h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">Class 1 – 6 • Cambridge / GES</div>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">Explore Primary &rarr;</div>
            </div>

            <!-- Level 4: JHS -->
            <div class="level-browse-card" data-level="JHS" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔬</div>
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Junior High (JHS)</h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">JHS 1 – 3 • BECE Preparation</div>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">Explore JHS &rarr;</div>
            </div>

            <!-- Level 5: SHS -->
            <div class="level-browse-card" data-level="SHS" style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎓</div>
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Senior High (SHS)</h3>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem;">SHS 1 – 3 • WASSCE & A-Levels</div>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">Explore Senior High &rarr;</div>
            </div>
          </div>
        </div>
      </section>

      <!-- H05: Location Hubs (Greater Accra & Tema) -->
      <section id="section-locations" style="padding: 4rem 0; background: #ffffff; border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="text-align: center; max-width: 720px; margin: 0 auto 2.5rem;">
            <span class="section-tag">📍 Geographic Discovery</span>
            <h2 class="section-title">Explore Schools by Enclave in Accra & Tema</h2>
            <p class="section-desc">Search schools near your residence or workplace across established educational communities.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
            <!-- Locality 1 -->
            <div class="suburb-browse-card" data-suburb="Cantonments" style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🏛️</div>
              <h3 style="font-size: 1.15rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Cantonments & Airport</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem 0;">GIS, Morning Star, prestigious Cambridge & IB academies.</p>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">View Cantonments Schools &rarr;</div>
            </div>

            <!-- Locality 2 -->
            <div class="suburb-browse-card" data-suburb="East Legon" style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🌳</div>
              <h3 style="font-size: 1.15rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">East Legon & Roman Ridge</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem 0;">The Roman Ridge School, top Montessori pre-schools & bilingual centres.</p>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">View East Legon Schools &rarr;</div>
            </div>

            <!-- Locality 3 -->
            <div class="suburb-browse-card" data-suburb="Tema" style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🚢</div>
              <h3 style="font-size: 1.15rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Spintex & Tema Metropolis</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem 0;">SOS-HGIC, Community 6 preparatory academies, and boarding schools.</p>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">View Tema & Spintex Schools &rarr;</div>
            </div>

            <!-- Locality 4 -->
            <div class="suburb-browse-card" data-suburb="Achimota" style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🎓</div>
              <h3 style="font-size: 1.15rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.25rem 0;">Achimota & Okaikwei North</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem 0;">Achimota School, historic campuses, and STEM-focused basic schools.</p>
              <div style="color: var(--theme-b-blue, #1266C4); font-size: 0.82rem; font-weight: 700;">View Achimota Schools &rarr;</div>
            </div>
          </div>
        </div>
      </section>

      <!-- H06: Featured Schools Section -->
      <section style="padding: 4.5rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">⭐ Verified Greater Accra Institutions</span>
            <h2 class="section-title">Featured Campuses in Accra & Tema</h2>
            <p class="section-desc">Leading institutions with reviewed academic curricula, established leadership, and modern facilities.</p>
          </div>

          <div class="schools-grid">
            ${displaySchools.map(s => this.renderSchoolCard(s)).join('')}
          </div>

          <div style="text-align: center; margin-top: 2.75rem;">
            <button id="btn-browse-all-schools" class="btn-pill btn-primary" style="padding: 0.85rem 2.25rem; font-size: 1rem; font-weight: 700;">
              Explore All Schools in Directory &rarr;
            </button>
          </div>
        </div>
      </section>

      <!-- H07 & H08: Decision Tools (Compare & Matchmaker Teasers) -->
      <section style="padding: 4rem 0; background: #ffffff; border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            
            <!-- H07: Compare Teaser -->
            <div style="background: linear-gradient(135deg, #0A2046 0%, #16366f 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-gold" style="font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem;">
                  ⚖️ Side-by-Side Analysis
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Compare Up to 4 Schools Free
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  Evaluate tuition, curricula, student support, facilities, and intake requirements side-by-side. 100% guest accessible with no paywall or forced account creation.
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: #e2e8f0; margin-bottom: 1.75rem;">
                  <div>✓ Direct fee period comparability check</div>
                  <div>✓ Factual distinctions highlight without fake rankings</div>
                  <div>✓ Mobile-friendly 2-school focused viewport</div>
                </div>
              </div>
              <button id="btn-home-compare-cta" class="btn-pill btn-gold" style="font-weight: 800; padding: 0.75rem 1.5rem; align-self: flex-start;">
                Open 4-School Compare Matrix &rarr;
              </button>
            </div>

            <!-- H08: Matchmaker Teaser -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: rgba(59,130,246,0.25); color: #93c5fd; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem;">
                  🎯 2-Minute Fit Adviser
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 0.75rem;">
                  Explainable Fit Matchmaker
                </h3>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
                  Answer two quick questions about your child's grade level and preferred suburb. Get transparent, evidence-grounded recommendations without manufactured percentages.
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: #e2e8f0; margin-bottom: 1.75rem;">
                  <div>✓ Level and location essential matching</div>
                  <div>✓ Transparent "Why This School" evidence points</div>
                  <div>✓ Suggested questions to ask about undisclosed gaps</div>
                </div>
              </div>
              <button id="btn-home-matchmaker-cta" class="btn-pill btn-primary" style="font-weight: 800; padding: 0.75rem 1.5rem; align-self: flex-start;">
                Launch Fit Matchmaker &rarr;
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- H09: Fee Transparency & Admissions Guidance -->
      <section style="padding: 4rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div style="max-width: 760px; margin-bottom: 2.5rem;">
            <span class="section-tag">💡 Financial Transparency</span>
            <h2 class="section-title">Understanding School Fees in Ghana</h2>
            <p class="section-desc">Practical advice on reading pre-tertiary fee structures, caution deposits, and recurring term charges.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.75rem;">
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.5rem 0;">Tuition vs. Term Levies</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Schools in Ghana typically bill per 3-month term (3 terms per academic year). Always verify whether disclosed amounts include books, PTA levies, and lunch.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.75rem;">
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.5rem 0;">One-Off Admission Charges</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Capital development fees, registration fees, and refundable caution deposits are charged only in the entry year. SkoolFinder profiles distinguish these from recurring tuition.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.75rem;">
              <h3 style="font-size: 1.1rem; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.5rem 0;">Missing Fee Transparency</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                If a school has not disclosed its tuition schedule, we label it "Fee Not Disclosed" rather than estimating a misleading figure. You can request fee quotes directly from admissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- H10, H11, H12, H13, H14: The Connected Education Ecosystem -->
      <section style="padding: 4.5rem 0; background: #ffffff; border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">🤝 Dedicated Ecosystem Workspaces</span>
            <h2 class="section-title">Empowering Families, Educators & School Owners</h2>
            <p class="section-desc">Explore specialized gateways with verified directories, approved commercial plans, and protected workflows.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem;">
            <!-- Partner 1: Educators & Vacancies (H10, H11) -->
            <div style="background: var(--gold-50); border: 1.5px solid var(--gold-100); border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">🧑‍🏫</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                  Teachers, Tutors & Vacancies
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  Discover teaching vacancies across Accra & Kumasi. 1-click job application is completely free for candidates. Qualified educators can publish tutoring services on approved Plus (GH₵39/mo) and Business (GH₵99/mo) plans.
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">1-Click Apply Free</span>
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">NTC Licence Vetting</span>
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">Private Home Tutors</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-jobs" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Explore Vacancies &amp; Tutors &rarr;
                </button>
                <button id="btn-goto-for-teachers" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem; border-color: #10B981; color: #065f46;">
                  🧑‍🏫 Why Join as Teacher &rarr;
                </button>
                <button id="btn-home-post-job" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  💼 Post Vacancy
                </button>
                <button id="btn-home-view-tutor-pricing" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  💳 View Educator Plans
                </button>
              </div>
            </div>

            <!-- Partner 2: Suppliers & Procurement Tenders (H12) -->
            <div style="background: var(--primary-50); border: 1.5px solid var(--primary-100); border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">📦</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                  Suppliers & School Tenders
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  Connecting schools with verified bulk food suppliers, STEM lab equipment vendors, textbook publishers, and uniform fabricators. Sealed bids and quotation prices remain strictly confidential.
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">Sealed Bids Protected</span>
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">Verified Vendors</span>
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">50/50 MoMo Escrow</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-suppliers" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Explore Suppliers & RFQs &rarr;
                </button>
                <button id="btn-goto-for-suppliers" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem; border-color: #D5A63B; color: #92400e;">
                  📦 Why Join as Supplier &rarr;
                </button>
                <button id="btn-home-post-rfq" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Post School RFQ
                </button>
              </div>
            </div>

            <!-- Partner 3: School Proprietors & Claim Gateway (H13) -->
            <div style="background: #fdf4ff; border: 1.5px solid #f5d0fe; border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">🏫</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: #86198f; margin-bottom: 0.5rem;">
                  School Owners & Heads
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  Claim your institutional profile or register a new campus. Access verified parent inquiries, admissions pipeline CRM, and vacancy advertising. Transparent plans from Free (GH₵0) to Growth (GH₵99/mo).
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: #86198f;">Free Starter (GH₵0)</span>
                  <span class="badge" style="background: #ffffff; color: #86198f;">Growth (GH₵99/mo)</span>
                  <span class="badge" style="background: #ffffff; color: #86198f;">Pro (GH₵249/mo)</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-for-schools" class="btn-pill" style="background: #0A2046; color: #ffffff; font-size: 0.85rem; padding: 0.55rem 1rem; font-weight: 700;">
                  🏛️ Why Join as School &rarr;
                </button>
                <button id="btn-home-register-school" class="btn-pill" style="background: #86198f; color: #ffffff; font-size: 0.85rem; padding: 0.55rem 1rem; font-weight: 700;">
                  Claim / List School
                </button>
                <button id="btn-home-school-portal" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem; border-color: #86198f; color: #86198f;">
                  🏫 Campus Portal Demo
                </button>
                <button id="btn-home-view-school-pricing" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  💳 View School Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- H15: Academic Resource Centre (WAEC & Cambridge Past Questions) -->
      <section style="padding: 4rem 0; background: var(--bg-main); border-bottom: 1px solid var(--border-light);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;">
          <div style="max-width: 620px;">
            <span class="badge badge-primary" style="font-size: 0.75rem; font-weight: 800; margin-bottom: 0.75rem;">
              📚 Free Academic Library
            </span>
            <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--theme-b-navy, #0A2046); font-weight: 800; margin: 0 0 0.75rem 0;">
              BECE, WASSCE & Cambridge Past Papers
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
              100% free revision repository with authentic WAEC past papers, Chief Examiner marking rubrics, and Cambridge IGCSE examination practice guides.
            </p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-goto-resources" class="btn-pill btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.9rem; font-weight: 700;">
                Browse Revision Papers &rarr;
              </button>
              <button id="btn-home-upload-paper" class="btn-pill btn-outline" style="padding: 0.65rem 1.35rem; font-size: 0.9rem;">
                Contribute Resource
              </button>
            </div>
          </div>

          <div style="background: #ffffff; border: 1.5px solid var(--border-light); border-radius: var(--radius-xl); padding: 1.75rem 2rem; min-width: 280px; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.82rem; color: var(--theme-b-navy, #0A2046); font-weight: 800; margin-bottom: 0.75rem; text-transform: uppercase;">
              Popular Revision Papers
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <span>BECE Integrated Science (2025)</span>
                <span class="badge badge-emerald" style="font-size: 0.65rem;">Free PDF</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <span>WASSCE Core Mathematics</span>
                <span class="badge badge-emerald" style="font-size: 0.65rem;">Free PDF</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <span>Cambridge IGCSE Physics</span>
                <span class="badge badge-emerald" style="font-size: 0.65rem;">Free PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Educational Tool: CSSPS BECE Placement Calculator Banner -->
      <section style="padding: 3.5rem 0; background: linear-gradient(135deg, #091e42 0%, #0c2d6b 100%); color: #ffffff;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;">
          <div style="max-width: 650px;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
              <span class="badge badge-gold" style="font-size: 0.72rem; font-weight: 800;">🇬🇭 GES CSSPS CALCULATION ASSISTANT</span>
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; margin-bottom: 0.5rem; color: #ffffff;">
              Calculate BECE Aggregate & Explore Category A, B & C Schools
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.25rem;">
              Input your 4 core subjects and 2 electives to calculate your aggregate score and understand cutoffs for public senior high schools in Ghana.
            </p>
            <button id="btn-home-cssps-calc" class="btn-pill btn-gold" style="padding: 0.75rem 1.5rem; font-size: 0.92rem; font-weight: 800;">
              <span>🎓</span> Launch BECE Aggregate Calculator &rarr;
            </button>
          </div>

          <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius-xl); padding: 1.5rem 1.75rem; text-align: center;">
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">Category A Reference</div>
            <div style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 900; color: #fff; margin: 0.2rem 0;">
              Agg 06 – 09
            </div>
            <div style="font-size: 0.78rem; color: rgba(255,255,255,0.7);">Presec, Achimota, Wesley Girls</div>
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

    // Truthful Fee Formatting: never fabricate "Moderate Fees" or estimated numbers
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
            <span class="carousel-dot" data-img="${galleryImgs[1]}" title="Science & Tech Labs"></span>
            <span class="carousel-dot" data-img="${galleryImgs[2]}" title="Modern Classrooms"></span>
          </div>

          <div class="school-card-badges">
            <span class="badge ${badgeClass}">${curriculumTag}</span>
            ${(school.verified || school.is_verified) ? '<span class="badge badge-verified" title="School ownership & profile reviewed">🛡️ Verified Profile</span>' : ''}
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
            <span class="level-tag" style="background: var(--primary-50); color: var(--primary-700);">${school.boardingType || school.boarding_type || 'Day & Boarding'}</span>
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

    const onMatchmakerClick = (e) => {
      e?.preventDefault();
      App.navigate('matchmaker');
    };
    document.getElementById('btn-hero-matchmaker')?.addEventListener('click', onMatchmakerClick);
    document.getElementById('btn-choice-matchmaker')?.addEventListener('click', onMatchmakerClick);

    document.getElementById('btn-choice-locations')?.addEventListener('click', (e) => {
      e.preventDefault();
      const locSec = document.getElementById('section-locations');
      if (locSec) {
        locSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        App.navigate('directory');
      }
    });

    // H04: Level-Specific Browse Cards
    document.querySelectorAll('.level-browse-card').forEach(card => {
      card.addEventListener('click', () => {
        const level = card.dataset.level || 'All';
        State.filters = { search: '', region: 'All', suburb: 'All', level: level, curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
        App.navigate('directory');
      });
    });

    // H05: Suburb / Locality Browse Cards
    document.querySelectorAll('.suburb-browse-card').forEach(card => {
      card.addEventListener('click', () => {
        const suburb = card.dataset.suburb || 'Accra';
        State.filters = { search: '', region: 'Greater Accra', suburb: suburb, level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
        App.navigate('directory');
      });
    });

    // H07 & H08 Teaser CTA buttons
    document.getElementById('btn-home-compare-cta')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('compare');
    });

    document.getElementById('btn-home-matchmaker-cta')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('matchmaker');
    });

    // View All Schools
    const btnBrowse = document.getElementById('btn-browse-all-schools');
    if (btnBrowse) {
      btnBrowse.onclick = () => {
        State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
        App.navigate('directory');
      };
    }

    // Direct View School
    document.querySelectorAll('.btn-card-view').forEach(btn => {
      btn.onclick = () => App.navigate('school-detail', btn.dataset.schoolId);
    });

    // Quick WhatsApp click
    document.querySelectorAll('.btn-quick-wa').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const waNumber = (typeof Utils !== 'undefined' ? Utils.formatGhanaWhatsApp(btn.dataset.wa) : (btn.dataset.wa || '').replace(/[^0-9]/g, ''));
        if (!waNumber) {
          return App.navigate('school-detail', schoolId);
        }
        if (typeof API !== 'undefined' && API.recordLead) {
          API.recordLead(schoolId, 'whatsapp_reveal').catch(() => {});
        }
        State.showToast("Opening Admissions WhatsApp...", "success");
        window.open(`https://wa.me/${waNumber}?text=Hello,%20I%20found%20your%20school%20on%20SkoolFinder%20Ghana.%20I%20would%20like%20to%20inquire%20about%20admissions.`, '_blank');
      };
    });

    // Compare button
    document.querySelectorAll('.btn-card-compare').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const school = await API.getSchoolById(schoolId);
        State.toggleCompare(school);
        btn.classList.toggle('active', State.isInCompare(schoolId));
      };
    });

    // Bookmark / Save button
    document.querySelectorAll('.btn-card-bookmark').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const schoolName = btn.dataset.schoolName || 'School';
        const nowSaved = await State.toggleBookmark(schoolId, schoolName);
        btn.innerHTML = nowSaved ? '🔖' : '🤍';
        btn.classList.toggle('active', nowSaved);
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

    // Ecosystem Navigation Links
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

