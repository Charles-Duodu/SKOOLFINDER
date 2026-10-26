/**
 * SchoolDirect Ghana - Home View
 */
const HomeView = {
  async render() {
    const stats = await API.getStats();
    const featuredSchools = await API.getSchools({ region: 'All' });
    const topFeatured = featuredSchools.filter(s => s.featured).slice(0, 3);

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-bg-overlay"></div>
        <div class="container hero-content">
          <div class="hero-pill">
            <span>🇬🇭</span> Ghana's Verified Education Directory & Network
          </div>
          <h1 class="hero-title">
            Find the <span>Right School</span> for Your Child in Ghana
          </h1>
          <p class="hero-subtitle">
            Explore accredited pre-schools, basic schools, and senior high schools across Greater Accra and Kumasi. Compare curricula, fees, and contact admissions directly.
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

            <div class="search-quick-tags">
              <span>Popular Enclaves:</span>
              <button class="quick-tag-pill" data-suburb="East Legon">East Legon</button>
              <button class="quick-tag-pill" data-suburb="Cantonments">Cantonments</button>
              <button class="quick-tag-pill" data-suburb="Tema">Tema</button>
              <button class="quick-tag-pill" data-suburb="Ahodwo">Ahodwo (Kumasi)</button>
              <button class="quick-tag-pill" data-suburb="Nhyiaeso">Nhyiaeso (Kumasi)</button>
              <button class="quick-tag-pill" data-boarding="Boarding">Boarding Schools</button>
            </div>
          </div>
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
            <p class="section-desc">SchoolDirect connects educational institutions with certified procurement vendors and top teaching talent.</p>
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
    const curriculumTag = school.curriculum[0] || 'GES';
    let badgeClass = 'badge-ges';
    if (curriculumTag.includes('Cambridge')) badgeClass = 'badge-cambridge';
    if (curriculumTag.includes('IB')) badgeClass = 'badge-ib';
    if (curriculumTag.includes('Montessori')) badgeClass = 'badge-montessori';

    return `
      <div class="school-card" id="card-${school.id}">
        <div class="school-card-media">
          <img src="${school.coverImage}" alt="${school.name}" class="school-card-img" />
          <div class="school-card-badges">
            <span class="badge ${badgeClass}">${curriculumTag}</span>
            ${school.verified ? '<span class="badge badge-verified">🛡️ Verified</span>' : ''}
            <span class="badge badge-admissions"><span class="badge-pulse-dot"></span> Admissions Open</span>
          </div>
          <div class="school-card-fee-pill">
            ${school.feeBand.split('(')[0].trim()}
          </div>
        </div>
        <div class="school-card-body">
          <div class="school-card-location">
            <span>📍</span> ${school.suburb}, ${school.region}
          </div>
          <h3 class="school-card-name">${school.name}</h3>
          <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; margin: 0.2rem 0 0.4rem;">
            <span style="color: #b45309; font-weight: 800;">★ 4.9</span>
            <span style="color: var(--text-muted); font-size: 0.75rem;">(Verified Parent Reviews)</span>
          </div>
          <div class="school-card-motto">"${school.motto || 'Excellence in Education'}"</div>
          
          <div class="school-card-levels">
            ${school.levels.map(l => `<span class="level-tag">${l}</span>`).join('')}
            <span class="level-tag" style="background: var(--primary-50); color: var(--primary-700);">${school.boardingType}</span>
          </div>

          <div class="school-card-facilities">
            ${school.facilities.slice(0, 3).map(f => `<span class="facility-chip">✓ ${f}</span>`).join('')}
          </div>

          <div class="school-card-footer">
            <button class="btn-card-view" data-school-id="${school.id}">
              View Profile
            </button>
            <button class="btn-card-wa btn-quick-wa" data-school-id="${school.id}" data-wa="${school.whatsapp}" title="Chat Admissions on WhatsApp">
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
        window.open(`https://wa.me/${waNumber}?text=Hello,%20I%20found%20your%20school%20on%20SchoolDirect%20Ghana.%20I%20would%20like%20to%20inquire%20about%20admissions.`, '_blank');
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
  }
};
