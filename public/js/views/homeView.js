/**
 * SkoolFinder Ghana - Home View
 */
const HomeView = {
  async render() {
    const stats = await API.getStats();
    const featuredSchools = await API.getSchools({ region: 'All' });
    const topFeatured = featuredSchools.filter(s => s.featured).slice(0, 3);

    return `
      <!-- Hero Section with 4-Image Crossfade Slideshow -->
      <section class="hero-section">
        <!-- 4-Image Transition Background -->
        <div class="hero-slideshow" id="hero-slideshow">
          <div class="hero-slide active" style="background-image: url('/assets/images/campus_hero.jpg');"></div>
          <div class="hero-slide" style="background-image: url('/assets/images/science_lab.jpg');"></div>
          <div class="hero-slide" style="background-image: url('/assets/images/montessori_class.jpg');"></div>
          <div class="hero-slide" style="background-image: url('/assets/images/sports_complex.jpg');"></div>
        </div>

        <!-- Lighter Glassmorphic Navy Overlay -->
        <div class="hero-bg-overlay"></div>
        <div class="hero-ambient-glow-1"></div>
        <div class="hero-ambient-glow-2"></div>



        <div class="container hero-content">
          <div style="display: flex; gap: 0.75rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <div class="hero-pill" style="margin: 0;">
              <span>🇬🇭</span> Ghana's Verified Education Directory & Network
            </div>
            <button id="btn-hero-role-tour" class="hero-tour-pill" title="Take a 30-second guided tour for Parents, Schools, Suppliers & Teachers">
              <span>🧭</span> New to SkoolFinder? Take a 30s Guided Tour &rarr;
            </button>
          </div>
          <h1 class="hero-title">
            Find the <span>Right School</span> for Your Child in Ghana
          </h1>
          <p class="hero-subtitle">
            Explore accredited pre-schools, basic schools, and senior high schools across Greater Accra and Kumasi. Compare curricula, fees, and connect directly with admissions offices.
          </p>

          <!-- Search Widget -->
          <div class="search-widget-card">
            <form id="hero-search-form" class="search-grid">
              <div class="search-field">
                <label class="search-label">📍 Location / Suburb</label>
                <div class="search-input-wrap">
                  <input type="text" id="hero-search-suburb" class="search-input" placeholder="e.g. East Legon, Spintex, Ahodwo" />
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


          </div>
        </div>

        <!-- Slide Switcher Indicators -->
        <div class="hero-slide-indicators" id="hero-slide-indicators">
          <span class="slide-indicator active" data-index="0" title="Campus Quadrangle"></span>
          <span class="slide-indicator" data-index="1" title="Science Labs"></span>
          <span class="slide-indicator" data-index="2" title="Classrooms"></span>
          <span class="slide-indicator" data-index="3" title="Sports Complex"></span>
        </div>
      </section>

      <!-- Platform Metrics Strip -->
      <section class="metrics-strip">
        <div class="container">
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-number">${stats.totalSchools}+</span>
              <span class="metric-label">Accredited Schools</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.totalLeadsLogged}+</span>
              <span class="metric-label">Parent Inquiries & Leads</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.totalSuppliers}</span>
              <span class="metric-label">Verified School Suppliers</span>
            </div>
            <div class="metric-item">
              <span class="metric-number">${stats.totalAcademicResources || 9}+</span>
              <span class="metric-label">WAEC & Cambridge Papers</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5 Dedicated SaaS Portals Grid -->
      <section style="background: linear-gradient(135deg, #091e42 0%, #0f172a 100%); padding: 3rem 0; color: #ffffff; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 0.78rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem;">
                <span>🇬🇭</span> Dedicated Educational Ecosystem
              </div>
              <h3 style="color: #ffffff; font-size: 1.6rem; font-family: var(--font-heading); margin-top: 0.2rem; margin-bottom: 0.25rem;">
                Enter Your SkoolFinder Portal
              </h3>
              <p style="color: #cbd5e1; font-size: 0.88rem; margin: 0; max-width: 650px;">
                Access your specialized workspace with live Mobile Money payments, verified directories, and administration tools.
              </p>
            </div>
            <button id="btn-home-full-tour" class="btn-pill btn-gold" style="font-size: 0.88rem; padding: 0.6rem 1.25rem;">
              <span>🧭</span> Guided Role Tour
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem;">
            <!-- Portal 1: Parents -->
            <div class="home-portal-card" data-portal="parents" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(59,130,246,0.3); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">👨‍👩‍👧</span>
                <span style="font-size: 0.68rem; font-weight: 800; background: rgba(59,130,246,0.25); color: #93c5fd; padding: 0.2rem 0.5rem; border-radius: 100px;">/parents</span>
              </div>
              <h4 style="color: #ffffff; font-size: 1.05rem; margin: 0 0 0.35rem 0;">Parents Portal</h4>
              <p style="color: #94a3b8; font-size: 0.78rem; line-height: 1.4; margin: 0 0 0.85rem 0;">
                Pay fees via MoMo, track school bus live GPS, view student ID & hire home tutors.
              </p>
              <div style="color: #60a5fa; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                Open Portal &rarr;
              </div>
            </div>

            <!-- Portal 2: Teachers -->
            <div class="home-portal-card" data-portal="teachers" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(16,185,129,0.3); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">🧑‍🏫</span>
                <span style="font-size: 0.68rem; font-weight: 800; background: rgba(16,185,129,0.25); color: #6ee7b7; padding: 0.2rem 0.5rem; border-radius: 100px;">/teachers</span>
              </div>
              <h4 style="color: #ffffff; font-size: 1.05rem; margin: 0 0 0.35rem 0;">Teachers Portal</h4>
              <p style="color: #94a3b8; font-size: 0.78rem; line-height: 1.4; margin: 0 0 0.85rem 0;">
                Educator marketplace: advertise home tuition, NTC vetting & school job openings.
              </p>
              <div style="color: #34d399; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                Open Marketplace &rarr;
              </div>
            </div>

            <!-- Portal 3: Suppliers -->
            <div class="home-portal-card" data-portal="suppliers" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(245,158,11,0.3); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">📦</span>
                <span style="font-size: 0.68rem; font-weight: 800; background: rgba(245,158,11,0.25); color: #fde68a; padding: 0.2rem 0.5rem; border-radius: 100px;">/suppliers</span>
              </div>
              <h4 style="color: #ffffff; font-size: 1.05rem; margin: 0 0 0.35rem 0;">Suppliers Portal</h4>
              <p style="color: #94a3b8; font-size: 0.78rem; line-height: 1.4; margin: 0 0 0.85rem 0;">
                B2B procurement: bid on school RFQs for textbooks, uniforms, ICT gear & lab items.
              </p>
              <div style="color: #fbbf24; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                Open Procurement &rarr;
              </div>
            </div>

            <!-- Portal 4: Schools -->
            <div class="home-portal-card" data-portal="schools" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.3); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">🏫</span>
                <span style="font-size: 0.68rem; font-weight: 800; background: rgba(139,92,246,0.25); color: #c4b5fd; padding: 0.2rem 0.5rem; border-radius: 100px;">/schools</span>
              </div>
              <h4 style="color: #ffffff; font-size: 1.05rem; margin: 0 0 0.35rem 0;">Schools Portal</h4>
              <p style="color: #94a3b8; font-size: 0.78rem; line-height: 1.4; margin: 0 0 0.85rem 0;">
                School Management OS: admissions pipeline, bursar MoMo ledger & bus fleet dispatch.
              </p>
              <div style="color: #a78bfa; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                Open School OS &rarr;
              </div>
            </div>

            <!-- Portal 5: Super Admin -->
            <div class="home-portal-card" data-portal="admin" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(148,163,184,0.3); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="font-size: 1.75rem;">🛡️</span>
                <span style="font-size: 0.68rem; font-weight: 800; background: rgba(148,163,184,0.25); color: #cbd5e1; padding: 0.2rem 0.5rem; border-radius: 100px;">/admin</span>
              </div>
              <h4 style="color: #ffffff; font-size: 1.05rem; margin: 0 0 0.35rem 0;">Admin Console</h4>
              <p style="color: #94a3b8; font-size: 0.78rem; line-height: 1.4; margin: 0 0 0.85rem 0;">
                Platform governance: NaSIA accreditation audits, teacher NTC vetting & SaaS plans.
              </p>
              <div style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                Open Admin HQ &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Schools Section -->
      <section style="padding: 4.5rem 0; background: var(--bg-main);">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">⭐ Premier Institutions</span>
            <h2 class="section-title">Featured Schools in Accra & Kumasi</h2>
            <p class="section-desc">Top-ranked campuses known for academic distinction, modern facilities, and disciplined leadership.</p>
          </div>

          <div class="schools-grid">
            ${topFeatured.map(s => this.renderSchoolCard(s)).join('')}
          </div>

          <div style="text-align: center; margin-top: 2.75rem;">
            <button id="btn-browse-all-schools" class="btn-pill btn-primary" style="padding: 0.8rem 2rem; font-size: 1rem;">
              Explore All Schools in Directory &rarr;
            </button>
          </div>
        </div>
      </section>

      <!-- Phase 2 Ecosystem Pillars: Suppliers & Teachers -->
      <section style="padding: 4.5rem 0; background: #ffffff; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">🤝 The Education Ecosystem</span>
            <h2 class="section-title">Empowering Schools, Suppliers & Educators</h2>
            <p class="section-desc">SkoolFinder connects educational institutions with certified procurement vendors and top teaching talent.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem;">
            <!-- Supplier B2B Card -->
            <div style="background: var(--primary-50); border: 1.5px solid var(--primary-100); border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">📦</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                  Educational Suppliers & B2B RFQs
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  Schools in Ghana spend heavily on food, textbooks, desks, and ICT. Post procurement requests (RFQs) and receive wholesale bids from verified suppliers.
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">Food & Catering</span>
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">Desks & Furniture</span>
                  <span class="badge" style="background: #ffffff; color: var(--primary-700);">Textbooks</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-suppliers" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Explore Suppliers
                </button>
                <button id="btn-home-post-rfq" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Post School RFQ
                </button>
              </div>
            </div>

            <!-- Teacher & Talent Card -->
            <div style="background: var(--gold-50); border: 1.5px solid var(--gold-100); border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">👨‍🏫</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                  Educator Recruitment & Tutors
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  Schools hire certified Cambridge, GES, and Montessori teachers. Parents can book vetted private subject tutors across Accra & Kumasi.
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">Private Tutors</span>
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">Cambridge IGCSE</span>
                  <span class="badge" style="background: #ffffff; color: var(--gold-700);">School Vacancies</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-jobs" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Find Tutors & Jobs
                </button>
                <button id="btn-home-post-job" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Post Vacancy
                </button>
              </div>
            </div>

            <!-- Academic Resources & Past Questions Card -->
            <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: var(--radius-xl); padding: 2.25rem 2rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; margin-bottom: 0.75rem;">📚</div>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                  WAEC & Cambridge Past Questions
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem; line-height: 1.5;">
                  100% free revision library with authentic BECE, WASSCE, and Cambridge past papers, step-by-step marking rubrics (M1, A1), and Chief Examiner warnings.
                </p>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  <span class="badge" style="background: #ffffff; color: #0369a1; border: 1px solid #bfdbfe;">WAEC BECE</span>
                  <span class="badge" style="background: #ffffff; color: #92400e; border: 1px solid #fde68a;">WAEC WASSCE</span>
                  <span class="badge" style="background: #ffffff; color: #15803d; border: 1px solid #bbf7d0;">Timed Mock Exams</span>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button id="btn-goto-resources" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Browse Past Questions &rarr;
                </button>
                <button id="btn-home-upload-paper" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.55rem 1rem;">
                  Contribute Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- High-Impact CSSPS Placement Predictor Banner -->
      <section style="padding: 4rem 0; background: linear-gradient(135deg, #091e42 0%, #0c2d6b 100%); color: #ffffff; border-top: 1px solid rgba(255,255,255,0.1);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;">
          <div style="max-width: 650px;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
              <span class="badge badge-gold" style="font-size: 0.75rem; font-weight: 800;">🇬🇭 OFFICIAL GES 2026 ENGINE</span>
              <span style="font-size: 0.8rem; color: var(--gold-400); font-weight: 700;">FOR JHS GRADUATES & PARENTS</span>
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 2.1rem; font-weight: 800; line-height: 1.25; margin-bottom: 0.75rem;">
              Calculate BECE Aggregate & Predict SHS Placement
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
              Input your 4 core subjects and 2 best electives. The system instantly generates your official aggregate, calculates your admission probability for Category A, B, and C schools, and formats your official GES 6-school selection plan.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button id="btn-home-cssps-calc" class="btn-pill btn-gold" style="padding: 0.85rem 1.75rem; font-size: 1rem; font-weight: 800;">
                <span>🎓</span> Launch BECE Placement Predictor &rarr;
              </button>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.08); border: 1.5px solid var(--gold-500); border-radius: var(--radius-xl); padding: 1.75rem 2rem; min-width: 280px; text-align: center; backdrop-filter: blur(10px);">
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase; margin-bottom: 0.35rem;">Distinction Target</div>
            <div style="font-family: var(--font-heading); font-size: 2.75rem; font-weight: 900; line-height: 1; color: #fff; margin-bottom: 0.35rem;">
              Aggregate 06
            </div>
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 1rem;">Category A Cutoff: 06 – 09</div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem; text-align: left;">
              <div>✓ Presec, Achimota & Wesley Girls</div>
              <div>✓ Official 6-School Selection Matrix</div>
              <div>✓ Printable Placement Strategy Card</div>
            </div>
          </div>
        </div>
      </section>

      <!-- School Admin Conversion Banner -->
      <section style="background: var(--gradient-navy); color: #ffffff; padding: 4.5rem 0; position: relative; overflow: hidden;">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 3rem; flex-wrap: wrap;">
          <div style="max-width: 600px;">
            <span class="badge" style="background: rgba(251, 191, 36, 0.2); color: var(--gold-400); margin-bottom: 1rem;">
              School Proprietors & Heads
            </span>
            <h2 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; line-height: 1.25; margin-bottom: 1rem;">
              Put Your School in Front of Thousands of Ghanaian Parents
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 1.05rem; margin-bottom: 1.5rem;">
              Claim your pre-populated school listing or register a new campus. Access verified lead analytics tracking parent views, WhatsApp inquiries, and calls.
            </p>
            <div style="display: flex; gap: 1rem;">
              <button id="btn-home-register-school" class="btn-pill btn-gold" style="padding: 0.75rem 1.75rem; font-size: 1rem;">
                Register Your School Now
              </button>
              <button id="btn-home-school-portal" class="btn-pill btn-outline" style="color: #ffffff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1);">
                View Lead Portal Demo
              </button>
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xl); padding: 1.75rem; min-width: 300px; backdrop-filter: blur(10px);">
            <div style="font-size: 0.85rem; color: var(--gold-400); font-weight: 700; margin-bottom: 0.5rem;">LEAD TRACKING PREVIEW</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.25rem;">+68 Inquiries</div>
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 1.25rem;">Average WhatsApp clicks per term for verified schools</div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
              <div>🛡️ Verified School Badge</div>
              <div>💬 Direct WhatsApp Click-to-Chat</div>
              <div>📊 Lead Conversion Analytics</div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderSchoolCard(school) {
    const isCompared = State.isInCompare(school.id);
    const curriculumTag = Array.isArray(school.curriculum) && school.curriculum.length > 0 ? school.curriculum[0] : (school.curriculum || 'GES');
    let badgeClass = 'badge-ges';
    if (String(curriculumTag).includes('Cambridge')) badgeClass = 'badge-cambridge';
    if (String(curriculumTag).includes('IB')) badgeClass = 'badge-ib';
    if (String(curriculumTag).includes('Montessori')) badgeClass = 'badge-montessori';

    // Fee Tier Metallic Badges
    const feeRaw = (school.feeBand || '').toLowerCase();
    let feeTierClass = 'badge-fee-moderate';
    if (feeRaw.includes('budget') || feeRaw.includes('under')) feeTierClass = 'badge-fee-budget';
    if (feeRaw.includes('premium')) feeTierClass = 'badge-fee-premium';
    if (feeRaw.includes('elite') || feeRaw.includes('international') || feeRaw.includes('10,000+')) feeTierClass = 'badge-fee-elite';

    const feeStr = school.feeBand || (school.tuition_min ? `GH₵ ${Number(school.tuition_min).toLocaleString()} - ${Number(school.tuition_max).toLocaleString()} / Term` : 'Moderate Fees');
    const feeDisplay = feeStr.includes('(') ? feeStr.split('(')[0].trim() : feeStr;

    const galleryImgs = [
      school.coverImage || school.banner_url || school.logo_url || '/assets/images/campus_hero.jpg',
      '/assets/images/science_lab.jpg',
      '/assets/images/montessori_class.jpg'
    ];

    const levelsList = Array.isArray(school.levels) ? school.levels : (Array.isArray(school.education_level) ? school.education_level : ['Primary', 'JHS']);
    const facilitiesList = Array.isArray(school.facilities) ? school.facilities : [];

    return `
      <div class="school-card-enhanced school-card" id="card-${school.id}">
        <div class="card-mini-carousel" id="carousel-${school.id}">
          <img src="${galleryImgs[0]}" alt="${school.name}" class="carousel-img" id="img-${school.id}" />
          
          <div class="carousel-nav-dots" data-school-id="${school.id}">
            <span class="carousel-dot active" data-img="${galleryImgs[0]}" title="Campus Front"></span>
            <span class="carousel-dot" data-img="${galleryImgs[1]}" title="Science & Tech Labs"></span>
            <span class="carousel-dot" data-img="${galleryImgs[2]}" title="Modern Classrooms"></span>
          </div>

          <div class="school-card-badges">
            <span class="badge ${badgeClass}">${curriculumTag}</span>
            ${(school.verified || school.is_verified) ? '<span class="badge badge-verified">🛡️ Verified</span>' : ''}
            <span class="badge-radar-container"><span class="radar-pulse-core"></span> Admissions Open</span>
          </div>
          <div class="school-card-fee-pill ${feeTierClass}">
            ${feeDisplay}
          </div>
        </div>
        <div class="school-card-body">
          <div class="school-card-location">
            <span>📍</span> ${school.suburb || school.locality || school.district || 'Accra'}, ${school.region || 'Greater Accra'}
          </div>
          <h3 class="school-card-name">${school.name}</h3>
          <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; margin: 0.2rem 0 0.4rem;">
            <span style="color: #b45309; font-weight: 800;">★ ${school.rating || '4.8'}</span>
            <span style="color: var(--text-muted); font-size: 0.75rem;">(Verified Parent Reviews)</span>
          </div>
          <div class="school-card-motto">"${school.motto || 'Excellence in Education'}"</div>
          
          <div class="school-card-levels">
            ${levelsList.map(l => `<span class="level-tag">${l}</span>`).join('')}
            <span class="level-tag" style="background: var(--primary-50); color: var(--primary-700);">${school.boardingType || school.boarding_type || 'Day & Boarding'}</span>
          </div>

          <div class="school-card-facilities">
            ${facilitiesList.slice(0, 3).map(f => `<span class="facility-chip">✓ ${f}</span>`).join('')}
          </div>

          <div class="school-card-footer">
            <button class="btn-card-view btn-pill btn-primary" style="padding: 0.6rem 1.15rem; font-size: 0.88rem;" data-school-id="${school.id}">
              View Profile
            </button>
            <button class="btn-card-wa btn-quick-wa btn-whatsapp-glow" style="padding: 0.6rem 1rem; font-size: 0.88rem;" data-school-id="${school.id}" data-wa="${school.whatsapp || school.phone || ''}" title="Chat Admissions on WhatsApp">
              💬 WhatsApp
            </button>
            <button class="btn-card-compare ${isCompared ? 'active' : ''}" data-school-id="${school.id}" title="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">
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
        const suburb = document.getElementById('hero-search-suburb').value.trim();
        const level = document.getElementById('hero-search-level').value;
        const curriculum = document.getElementById('hero-search-curriculum').value;

        State.filters.search = suburb;
        State.filters.suburb = 'All';
        State.filters.level = level;
        State.filters.curriculum = curriculum;

        App.navigate('directory');
      };
    }

    // Quick tag pills
    document.querySelectorAll('.quick-tag-pill').forEach(btn => {
      btn.onclick = () => {
        if (btn.dataset.suburb) {
          State.filters.suburb = btn.dataset.suburb;
          State.filters.search = '';
        }
        if (btn.dataset.boarding) {
          State.filters.boarding = btn.dataset.boarding;
        }
        App.navigate('directory');
      };
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
        const waNumber = btn.dataset.wa.replace(/[^0-9]/g, '');
        // Record lead
        await API.recordLead(schoolId, 'whatsapp_reveal');
        State.showToast("Direct WhatsApp connect recorded!", "success");
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
    document.getElementById('btn-home-school-portal')?.addEventListener('click', () => App.navigate('dashboard', 'sch-gis-accra'));

    // Role Tour Banner Events
    document.getElementById('btn-home-full-tour')?.addEventListener('click', () => {
      Modals.openRoleTourModal('parent');
    });

    // Hero Role Tour Pill & Track Status
    document.getElementById('btn-hero-role-tour')?.addEventListener('click', () => {
      Modals.openRoleTourModal('parent');
    });

    // 4-Image Hero Crossfade Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.slide-indicator');
    if (slides.length > 1) {
      if (window._heroSlideTimer) clearInterval(window._heroSlideTimer);
      let currentIdx = 0;
      const setSlide = (newIdx) => {
        if (newIdx === currentIdx) return;
        const prevIdx = currentIdx;
        currentIdx = newIdx;
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



    document.querySelectorAll('.home-portal-card').forEach(card => {
      card.addEventListener('click', () => {
        const portal = card.dataset.portal || 'parents';
        App.navigate(portal);
      });
    });

    document.querySelectorAll('.home-role-tour-card').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.dataset.role || 'parent';
        Modals.openRoleTourModal(role);
      });
    });
  }
};
