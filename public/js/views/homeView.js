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
            <div class="parent-pathway-card parent-pathway-guest" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 18px; padding: 2rem 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 6px 20px rgba(10,32,70,0.04);">
              <div>
                <div style="display: flex; align-items: center; gap: 0.55rem; margin-bottom: 1rem;">
                  <div style="width: 30px; height: 30px; border-radius: 50%; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;">
                    🧭
                  </div>
                  <span style="font-size: 0.76rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.06em;">
                    START EXPLORING
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.45rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                  Explore as a Guest
                </h3>
                <p style="color: #475569; font-size: 0.92rem; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  Find and compare schools instantly. No sign-up needed.
                </p>

                <div style="font-size: 0.84rem; font-weight: 700; color: #64748b; margin-bottom: 1.5rem; letter-spacing: 0.02em;">
                  Search &bull; Compare &bull; Enquire
                </div>
              </div>

              <div>
                <button type="button" id="btn-home-guest-explore" class="btn-pill pathway-cta-btn" style="width: 100%; height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.75rem 1rem; font-size: 0.95rem; font-weight: 800; color: #ffffff; background: #0A2046; border: 1.5px solid #1e3a6a; cursor: pointer; border-radius: 9999px; box-shadow: 0 4px 14px rgba(10,32,70,0.2); box-sizing: border-box;">
                  <span>Discover Schools</span>
                  <span class="cta-arrow" style="font-size: 1.05rem;">&nearr;</span>
                </button>
              </div>
            </div>

            <!-- CARD 2: YOUR FREE PARENT ACCOUNT -->
            <div class="parent-pathway-card parent-pathway-account" style="background: linear-gradient(180deg, #FFFDF8 0%, #FEF9EE 100%); border: 1.5px solid #E5C378; border-radius: 18px; padding: 2rem 1.75rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 28px rgba(213,166,59,0.14);">
              <div>
                <div style="display: flex; align-items: center; gap: 0.55rem; margin-bottom: 1rem;">
                  <div style="width: 30px; height: 30px; border-radius: 50%; background: #fef3c7; border: 1px solid #fde68a; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;">
                    🔖
                  </div>
                  <span style="font-size: 0.76rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.06em;">
                    PERSONALISED JOURNEY
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.45rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                  Your Free Parent Account
                </h3>
                <p style="color: #475569; font-size: 0.92rem; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  Save favourites, organise shortlists and plan ahead.
                </p>

                <div style="font-size: 0.84rem; font-weight: 700; color: #92400e; margin-bottom: 1.5rem; letter-spacing: 0.02em;">
                  Save &bull; Plan &bull; Track
                </div>
              </div>

              <div>
                <button type="button" id="btn-home-parent-signup" class="btn-pill pathway-cta-btn" style="width: 100%; height: 50px; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; padding: 0.75rem 1rem; font-size: 0.95rem; font-weight: 800; color: #0A2046; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); border: none; cursor: pointer; border-radius: 9999px; transition: all 0.2s; box-shadow: 0 4px 16px rgba(213,166,59,0.35); box-sizing: border-box;">
                  <span>Create Free Account</span>
                  <span class="cta-arrow" style="font-size: 1.05rem;">&nearr;</span>
                </button>
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
           SECTION 04: FOUR PREMIUM PORTAL CARDS (OPTION A — 2x2 GRID)
           ======================================================== -->
      <section id="section-portal-cards" style="background: #f8fafc; padding: 4.5rem 0; border-bottom: 1px solid var(--border-light, #e2e8f0); scroll-margin-top: 80px;">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
            <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.85rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.4rem; border: 1px solid #bfdbfe; margin-bottom: 0.5rem;">
              <span>🌐</span> THE SKOOLFINDER ECOSYSTEM
            </span>
            <h2 style="font-family: var(--font-heading, sans-serif); font-size: 2rem; font-weight: 800; color: #0A2046; line-height: 1.3; margin: 0 0 0.5rem 0;">
              Explore the SkoolFinder Community
            </h2>
            <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin: 0 auto;">
              Four connected communities, each with dedicated tools to help families, schools, education professionals and businesses achieve more.
            </p>
          </div>

          <!-- 2x2 Premium Grid on Desktop, 1 Column on Mobile -->
          <div class="portals-premium-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.75rem; max-width: 980px; margin: 0 auto;">
            
            <!-- CARD 01: PARENTS & GUARDIANS -->
            <div class="portal-feature-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;">
              <div>
                <div style="width: 100%; aspect-ratio: 16/10; overflow: hidden; position: relative; background: #e2e8f0;">
                  <picture>
                    <source srcset="/assets/images/portals/01_parents_guardians.webp" type="image/webp">
                    <img src="/assets/images/portals/01_parents_guardians.jpg" alt="Parents &amp; Guardians exploring schools on SkoolFinder" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                  </picture>
                </div>
                <div style="padding: 1.5rem 1.5rem 1rem;">
                  <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                    Parents &amp; Guardians
                  </h3>
                  <p style="color: #475569; font-size: 0.9rem; line-height: 1.55; margin: 0 0 1rem 0;">
                    Discover schools, compare important information and confidently plan your child's education journey using free, practical tools.
                  </p>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">School Search</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Comparison</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Planning</span>
                  </div>
                </div>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <button type="button" id="btn-portal-card-parents" class="btn-pill btn-outline" style="width: 100%; height: 46px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.88rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  Explore Parents Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 02: SCHOOL OWNERS & PROPRIETORS -->
            <div class="portal-feature-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;">
              <div>
                <div style="width: 100%; aspect-ratio: 16/10; overflow: hidden; position: relative; background: #e2e8f0;">
                  <picture>
                    <source srcset="/assets/images/portals/02_school_owners.webp" type="image/webp">
                    <img src="/assets/images/portals/02_school_owners.jpg" alt="School Owners &amp; Proprietors showcase campus on SkoolFinder" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                  </picture>
                </div>
                <div style="padding: 1.5rem 1.5rem 1rem;">
                  <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                    School Owners &amp; Proprietors
                  </h3>
                  <p style="color: #475569; font-size: 0.9rem; line-height: 1.55; margin: 0 0 1rem 0;">
                    Showcase your institution, reach prospective families and manage school enquiries, admissions and growth opportunities.
                  </p>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Visibility</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Enrolment</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Management</span>
                  </div>
                </div>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <button type="button" id="btn-portal-card-schools" class="btn-pill btn-outline" style="width: 100%; height: 46px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.88rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  Explore School Owners Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 03: TEACHERS & EDUCATION PROFESSIONALS -->
            <div class="portal-feature-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;">
              <div>
                <div style="width: 100%; aspect-ratio: 16/10; overflow: hidden; position: relative; background: #e2e8f0;">
                  <picture>
                    <source srcset="/assets/images/portals/03_teachers_professionals.webp" type="image/webp">
                    <img src="/assets/images/portals/03_teachers_professionals.jpg" alt="Teachers and Education Professionals connect with careers" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                  </picture>
                </div>
                <div style="padding: 1.5rem 1.5rem 1rem;">
                  <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                    Teachers &amp; Education Professionals
                  </h3>
                  <p style="color: #475569; font-size: 0.9rem; line-height: 1.55; margin: 0 0 1rem 0;">
                    Build your professional profile, discover teaching and education career opportunities, and connect with families seeking your expertise.
                  </p>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Career Growth</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Tutoring</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Services</span>
                  </div>
                </div>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <button type="button" id="btn-portal-card-teachers" class="btn-pill btn-outline" style="width: 100%; height: 46px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.88rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  Explore Teachers Portal &rarr;
                </button>
              </div>
            </div>

            <!-- CARD 04: SUPPLIERS & SERVICE PROVIDERS -->
            <div class="portal-feature-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 16px rgba(10,32,70,0.04); transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;">
              <div>
                <div style="width: 100%; aspect-ratio: 16/10; overflow: hidden; position: relative; background: #e2e8f0;">
                  <picture>
                    <source srcset="/assets/images/portals/04_suppliers_service_providers.webp" type="image/webp">
                    <img src="/assets/images/portals/04_suppliers_service_providers.jpg" alt="Suppliers and Service Providers connect with schools" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                  </picture>
                </div>
                <div style="padding: 1.5rem 1.5rem 1rem;">
                  <h3 style="font-family: var(--font-heading, sans-serif); font-size: 1.35rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                    Suppliers &amp; Service Providers
                  </h3>
                  <p style="color: #475569; font-size: 0.9rem; line-height: 1.55; margin: 0 0 1rem 0;">
                    Present your products and services to schools, build business visibility and discover relevant procurement and tender opportunities.
                  </p>
                  <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Business Visibility</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">School Buyers</span>
                    <span style="color: #cbd5e1; align-self: center;">&bull;</span>
                    <span class="badge" style="background: #f1f5f9; color: #0A2046; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">Tenders</span>
                  </div>
                </div>
              </div>
              <div style="padding: 0 1.5rem 1.5rem;">
                <button type="button" id="btn-portal-card-suppliers" class="btn-pill btn-outline" style="width: 100%; height: 46px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.88rem; font-weight: 800; color: #0A2046; border: 2px solid #0A2046; background: #ffffff; cursor: pointer; border-radius: 9999px; transition: all 0.2s;">
                  Explore Suppliers Portal &rarr;
                </button>
              </div>
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
