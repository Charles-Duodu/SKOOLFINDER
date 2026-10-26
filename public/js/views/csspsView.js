/**
 * SkoolFinder Ghana - CSSPS Senior High School Placement & BECE Aggregate Predictor (Feature 2)
 */
const CSSPSView = {
  activeTab: 'calculator', // 'calculator' | 'directory'

  gradeInputs: {
    english: 1,
    maths: 1,
    science: 1,
    social: 1,
    elective1Name: 'ICT',
    elective1: 2,
    elective2Name: 'BDT / Pre-Technical',
    elective2: 2,
    program: 'General Science',
    preferredRegion: 'All',
    gender: 'All'
  },

  directoryFilters: {
    category: 'All',
    region: 'All',
    program: 'All',
    gender: 'All',
    search: ''
  },

  lastResult: null,

  computeLiveAggregate() {
    const core = Number(this.gradeInputs.english) + Number(this.gradeInputs.maths) + Number(this.gradeInputs.science) + Number(this.gradeInputs.social);
    const electives = Number(this.gradeInputs.elective1) + Number(this.gradeInputs.elective2);
    return core + electives;
  },

  async render() {
    let directorySchools = [];
    if (this.activeTab === 'directory') {
      directorySchools = await API.getCSSPSSchools(this.directoryFilters);
    }

    const liveAgg = this.computeLiveAggregate();

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          
          <!-- Page Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / Secondary Education Advisory
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                <span class="badge badge-emerald" style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em;">
                  🇬🇭 OFFICIAL GES & WAEC CSSPS ENGINE 2026
                </span>
                <span class="badge badge-gold" style="font-size: 0.75rem;">
                  ⭐ Category A, B & C Selection Guide
                </span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900);">
                BECE Aggregate Predictor & CSSPS Placement
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 720px; line-height: 1.6; margin-bottom: 0.75rem;">
                Calculate your official Basic Education Certificate Examination (BECE) aggregate from the 4 core subjects and 2 best electives. Get matched with Category A, B, and C Senior High Schools in Greater Accra, Ashanti, Central, and Eastern regions.
              </p>
              <div>
                <a href="#/past-questions" id="link-cssps-past-questions" class="badge" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700; text-decoration: none; padding: 0.4rem 0.85rem; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <span>📚</span> Target Aggregate 06? Practice Official WAEC BECE Past Questions & Rubrics &rarr;
                </a>
              </div>
            </div>

            <!-- Header Quick Stats Pill -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Category A Cutoff</div>
                <div style="font-size: 1.35rem; font-weight: 900; color: var(--primary-900); font-family: var(--font-heading);">06 – 09</div>
              </div>
              <div style="width: 1px; height: 35px; background: var(--border-light);"></div>
              <div style="text-align: center;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Max Choices</div>
                <div style="font-size: 1.35rem; font-weight: 900; color: var(--gold-600); font-family: var(--font-heading);">6 Schools</div>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-light); margin-bottom: 2.25rem;">
            <button id="tab-btn-calc" class="nav-link ${this.activeTab === 'calculator' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              🎓 BECE Placement Predictor
            </button>
            <button id="tab-btn-shs-dir" class="nav-link ${this.activeTab === 'directory' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              🏫 Senior High Schools Directory (15 Institutions)
            </button>
          </div>

          <!-- TAB 1: CALCULATOR & PLACEMENT ENGINE -->
          ${this.activeTab === 'calculator' ? this.renderCalculatorTab(liveAgg) : ''}

          <!-- TAB 2: ALL SENIOR HIGH SCHOOLS DIRECTORY -->
          ${this.activeTab === 'directory' ? this.renderDirectoryTab(directorySchools) : ''}

        </div>
      </section>
    `;
  },

  renderCalculatorTab(liveAgg) {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 2rem; align-items: start;" class="cssps-layout-grid">
        
        <!-- Left Column: Input Form Card -->
        <div class="card" style="padding: 1.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); background: var(--bg-surface);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin-bottom: 0.2rem;">
                1. Enter BECE Mock Grades
              </h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Scale 1 (Highest) to 9 (Lowest)</p>
            </div>
            <!-- Live Aggregate Badge -->
            <div id="live-aggregate-badge" style="background: var(--primary-900); color: #fff; padding: 0.5rem 0.9rem; border-radius: 10px; text-align: center; border: 1px solid var(--gold-500);">
              <div style="font-size: 0.65rem; color: var(--gold-400); font-weight: 700; text-transform: uppercase;">Current Total</div>
              <div style="font-size: 1.25rem; font-weight: 900; font-family: var(--font-heading);">
                Aggregate <span id="live-agg-num">${liveAgg < 10 ? '0' + liveAgg : liveAgg}</span>
              </div>
            </div>
          </div>

          <form id="form-cssps-calculator">
            <!-- Core 4 Subjects (Mandatory in Ghana) -->
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-800); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>📚</span> Core 4 Subjects (Compulsory)
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0.5rem;">
                  <label class="form-label" style="font-size: 0.8rem;">English Language *</label>
                  <select id="grade-english" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.english == g ? 'selected' : ''}>Grade ${g} (${this.getGradeLabel(g)})</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0.5rem;">
                  <label class="form-label" style="font-size: 0.8rem;">Mathematics *</label>
                  <select id="grade-maths" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.maths == g ? 'selected' : ''}>Grade ${g} (${this.getGradeLabel(g)})</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0.5rem;">
                  <label class="form-label" style="font-size: 0.8rem;">Integrated Science *</label>
                  <select id="grade-science" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.science == g ? 'selected' : ''}>Grade ${g} (${this.getGradeLabel(g)})</option>`).join('')}
                  </select>
                </div>

                <div class="form-group" style="margin-bottom: 0.5rem;">
                  <label class="form-label" style="font-size: 0.8rem;">Social Studies *</label>
                  <select id="grade-social" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.social == g ? 'selected' : ''}>Grade ${g} (${this.getGradeLabel(g)})</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- 2 Best Electives -->
            <div style="margin-bottom: 1.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-light);">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-800); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>✨</span> 2 Best Elective Subjects
              </div>

              <!-- Elective 1 -->
              <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Elective 1 Subject</label>
                  <select id="elective-1-name" class="form-select" style="font-size: 0.85rem;">
                    <option value="ICT" ${this.gradeInputs.elective1Name === 'ICT' ? 'selected' : ''}>Information & Comm. Tech (ICT)</option>
                    <option value="BDT / Pre-Technical" ${this.gradeInputs.elective1Name === 'BDT / Pre-Technical' ? 'selected' : ''}>Basic Design & Tech (BDT)</option>
                    <option value="French" ${this.gradeInputs.elective1Name === 'French' ? 'selected' : ''}>French Language</option>
                    <option value="Ghanaian Language" ${this.gradeInputs.elective1Name === 'Ghanaian Language' ? 'selected' : ''}>Ghanaian Language (Twi/Ga/Ewe)</option>
                    <option value="RME" ${this.gradeInputs.elective1Name === 'RME' ? 'selected' : ''}>Rel. & Moral Education (RME)</option>
                    <option value="Home Economics" ${this.gradeInputs.elective1Name === 'Home Economics' ? 'selected' : ''}>Home Economics</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Grade</label>
                  <select id="grade-elective1" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.elective1 == g ? 'selected' : ''}>Grade ${g}</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Elective 2 -->
              <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 0.75rem;">
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Elective 2 Subject</label>
                  <select id="elective-2-name" class="form-select" style="font-size: 0.85rem;">
                    <option value="BDT / Pre-Technical" ${this.gradeInputs.elective2Name === 'BDT / Pre-Technical' ? 'selected' : ''}>Basic Design & Tech (BDT)</option>
                    <option value="ICT" ${this.gradeInputs.elective2Name === 'ICT' ? 'selected' : ''}>Information & Comm. Tech (ICT)</option>
                    <option value="French" ${this.gradeInputs.elective2Name === 'French' ? 'selected' : ''}>French Language</option>
                    <option value="Ghanaian Language" ${this.gradeInputs.elective2Name === 'Ghanaian Language' ? 'selected' : ''}>Ghanaian Language (Twi/Ga/Ewe)</option>
                    <option value="RME" ${this.gradeInputs.elective2Name === 'RME' ? 'selected' : ''}>Rel. & Moral Education (RME)</option>
                    <option value="Home Economics" ${this.gradeInputs.elective2Name === 'Home Economics' ? 'selected' : ''}>Home Economics</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Grade</label>
                  <select id="grade-elective2" class="form-select grade-select" required>
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${this.gradeInputs.elective2 == g ? 'selected' : ''}>Grade ${g}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div style="margin-bottom: 1.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-light);">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-800); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>🎯</span> Placement Preferences
              </div>

              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label" style="font-size: 0.8rem;">Desired High School Program</label>
                <select id="pref-program" class="form-select">
                  <option value="General Science" ${this.gradeInputs.program === 'General Science' ? 'selected' : ''}>General Science (Physics, Chem, Bio, Elect Maths)</option>
                  <option value="General Arts" ${this.gradeInputs.program === 'General Arts' ? 'selected' : ''}>General Arts (Gov, Lit, History, Econs, French)</option>
                  <option value="Business" ${this.gradeInputs.program === 'Business' ? 'selected' : ''}>Business (Accounting, Costing, Bus. Mgt)</option>
                  <option value="Visual Arts" ${this.gradeInputs.program === 'Visual Arts' ? 'selected' : ''}>Visual Arts (Graphic Design, Textiles, Sculpture)</option>
                  <option value="Home Economics" ${this.gradeInputs.program === 'Home Economics' ? 'selected' : ''}>Home Economics (Food & Nutrition, Clothing)</option>
                  <option value="Technical" ${this.gradeInputs.program === 'Technical' ? 'selected' : ''}>Technical / Applied Science (TVET Engineering)</option>
                  <option value="All" ${this.gradeInputs.program === 'All' ? 'selected' : ''}>All Programs</option>
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.8rem;">Preferred Region</label>
                  <select id="pref-region" class="form-select">
                    <option value="All" ${this.gradeInputs.preferredRegion === 'All' ? 'selected' : ''}>All Ghana</option>
                    <option value="Greater Accra" ${this.gradeInputs.preferredRegion === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                    <option value="Ashanti" ${this.gradeInputs.preferredRegion === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
                    <option value="Central" ${this.gradeInputs.preferredRegion === 'Central' ? 'selected' : ''}>Central (Cape Coast)</option>
                    <option value="Eastern" ${this.gradeInputs.preferredRegion === 'Eastern' ? 'selected' : ''}>Eastern</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.8rem;">Candidate Gender</label>
                  <select id="pref-gender" class="form-select">
                    <option value="All" ${this.gradeInputs.gender === 'All' ? 'selected' : ''}>Co-ed / Any</option>
                    <option value="Boys" ${this.gradeInputs.gender === 'Boys' ? 'selected' : ''}>Boys Only</option>
                    <option value="Girls" ${this.gradeInputs.gender === 'Girls' ? 'selected' : ''}>Girls Only</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="btn-calculate-placement" class="btn-pill btn-gold" style="width: 100%; padding: 0.9rem; font-size: 1rem; font-weight: 800; justify-content: center; box-shadow: var(--shadow-md);">
              <span>🎯</span> Predict Placement & Match Schools
            </button>
          </form>

        </div>

        <!-- Right Column: Results & Advisory Container -->
        <div id="cssps-results-container">
          ${this.lastResult ? this.renderResults(this.lastResult) : this.renderExplainerCard()}
        </div>

      </div>
    `;
  },

  renderExplainerCard() {
    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <div style="width: 44px; height: 44px; background: var(--primary-50); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--primary-800);">
            💡
          </div>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--primary-900); margin: 0;">
              Understanding CSSPS Placement in Ghana
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Official Rules established by Ghana Education Service (GES)</p>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
          The Computerized School Selection and Placement System (CSSPS) uses a candidate’s <strong>Total BECE Aggregate</strong> (sum of 4 core subjects + 2 best electives) to match candidates to their 6 secondary school choices.
        </p>

        <!-- 3 Feature Pillars -->
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.75rem;">
          <div style="display: flex; gap: 1rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--gold-500);">
            <div style="font-size: 1.25rem;">🥇</div>
            <div>
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary-900);">Category A: Maximum of 1 School Allowed</div>
              <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                Prestigious schools (PRESEC, Motown, Wey Gey Hey, Prempeh, OWASS). Cutoffs range strictly between Aggregate 06 and 09.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--primary-600);">
            <div style="font-size: 1.25rem;">🥈</div>
            <div>
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary-900);">Category B: Up to 2 Schools Allowed</div>
              <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                High-achieving secondary institutions (Aquinas, Aburi Girls, Accra Academy, Kumasi High, St. Louis). Typical cutoffs: 09 – 16.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--emerald-600);">
            <div style="font-size: 1.25rem;">🥉</div>
            <div>
              <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary-900);">Category C & Mandatory Day Catchment</div>
              <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                Must include 1 mandatory Day school within the student's home district or catchment area to guarantee placement.
              </div>
            </div>
          </div>
        </div>

        <div style="background: var(--gold-50); border: 1px solid var(--gold-400); border-radius: var(--radius-md); padding: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.25rem;">✨</span>
            <div style="font-size: 0.85rem; font-weight: 700; color: #78350f;">
              Ready to test your mock aggregates?
            </div>
          </div>
          <button type="button" class="btn-pill btn-gold" style="font-size: 0.82rem; padding: 0.45rem 1rem;" onclick="document.getElementById('form-cssps-calculator')?.dispatchEvent(new Event('submit'))">
            Calculate Mock Placement
          </button>
        </div>

      </div>
    `;
  },

  renderResults(res) {
    const { scores, evaluation, recommendations } = res;
    const aggFormatted = scores.totalAggregate < 10 ? '0' + scores.totalAggregate : scores.totalAggregate;

    return `
      <div class="cssps-results-wrapper" style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Result Summary Banner -->
        <div style="background: var(--gradient-navy); border-radius: var(--radius-xl); padding: 1.75rem 2rem; color: #ffffff; box-shadow: var(--shadow-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
              PREDICTION COMPLETED • GES PLACEMENT ANALYSIS
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 900; color: #fff; margin-bottom: 0.4rem;">
              ${evaluation.eligibilityGrade}
            </h2>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.85);">
              ${evaluation.remark}
            </div>
          </div>

          <!-- Aggregate Circle -->
          <div style="background: rgba(255,255,255,0.1); border: 2px solid var(--gold-500); border-radius: var(--radius-lg); padding: 0.85rem 1.5rem; text-align: center; backdrop-filter: blur(8px);">
            <div style="font-size: 0.72rem; color: var(--gold-400); font-weight: 700; text-transform: uppercase;">BECE Aggregate</div>
            <div style="font-size: 2.25rem; font-weight: 900; color: #fff; font-family: var(--font-heading); line-height: 1;">
              ${aggFormatted}
            </div>
            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7); margin-top: 0.2rem;">
              Core: ${scores.coreAggregate} + Elec: ${scores.electivesAggregate}
            </div>
          </div>
        </div>

        <!-- Advisory alerts if any -->
        ${evaluation.advisoryNotes.length > 0 ? `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-left: 4px solid var(--gold-500); border-radius: var(--radius-md); padding: 1rem 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-900); margin-bottom: 0.4rem;">
              Advisory Evaluation Notes:
            </div>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
              ${evaluation.advisoryNotes.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Strategic GES Official 6-School Selection Matrix -->
        <div class="card" style="padding: 1.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-xl); background: var(--bg-surface);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; color: var(--gold-600); text-transform: uppercase;">RECOMMENDED SELECTION STRATEGY</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                Official GES 6-School Placement Matrix
              </h3>
            </div>
            <button type="button" class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;" onclick="window.print()">
              🖨️ Print Strategy Card
            </button>
          </div>

          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
            Following this tiered formula ensures your ward does not miss automatic placement or fall into the stressful Self-Placement pool:
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${recommendations.selectionPlan.map(p => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); background: var(--bg-main); border: 1px solid var(--border-light); flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="background: var(--primary-900); color: #fff; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem;">
                    #${p.choiceNumber}
                  </span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">
                      ${p.recommendedSchool ? p.recommendedSchool.name : 'Select Category C School'}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">
                      ${p.allowedCategory} • ${p.description}
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  ${p.recommendedSchool ? `
                    <span class="badge ${p.recommendedSchool.badgeClass || 'badge-verified'}" style="font-size: 0.72rem;">
                      Cutoff: ${p.recommendedSchool.cutoffMin < 10 ? '0' + p.recommendedSchool.cutoffMin : p.recommendedSchool.cutoffMin} - ${p.recommendedSchool.cutoffMax < 10 ? '0' + p.recommendedSchool.cutoffMax : p.recommendedSchool.cutoffMax}
                    </span>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section: Category A Qualified Schools -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🏆</span> Category A Matched Schools (${recommendations.categoryA.length})
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">(Pick 1 Max)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${recommendations.categoryA.map(s => this.renderSchoolMatchCard(s, scores.totalAggregate)).join('')}
          </div>
        </div>

        <!-- Section: Category B Qualified Schools -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🏛️</span> Category B Matched Schools (${recommendations.categoryB.length})
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">(Pick Up to 2)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${recommendations.categoryB.map(s => this.renderSchoolMatchCard(s, scores.totalAggregate)).join('')}
          </div>
        </div>

        <!-- Section: Category C & TVET Qualified Schools -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🛠️</span> Category C & Technical Institutes (${recommendations.categoryC.length})
            </h3>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">(Safe Anchor Choices)</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${recommendations.categoryC.map(s => this.renderSchoolMatchCard(s, scores.totalAggregate)).join('')}
          </div>
        </div>

      </div>
    `;
  },

  renderSchoolMatchCard(s, userAgg) {
    return `
      <div class="card" style="padding: 1.25rem 1.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-lg); background: var(--bg-surface); transition: var(--transition-fast); box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
              <span class="badge ${s.category === 'Category A' ? 'badge-gold' : (s.category === 'Category B' ? 'badge-blue' : 'badge-emerald')}" style="font-size: 0.7rem; font-weight: 800;">
                ${s.category}
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
                GES Code: ${s.gesCode} • 📍 ${s.suburb}, ${s.region}
              </span>
              <span class="badge badge-curriculum" style="font-size: 0.7rem;">
                ${s.gender} • ${s.boardingType}
              </span>
            </div>
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.25rem 0;">
              ${s.name}
            </h4>
            <div style="font-size: 0.8rem; font-style: italic; color: var(--text-muted);">
              "${s.motto}"
            </div>
          </div>

          <!-- Probability Meter Badge -->
          <div style="text-align: right;">
            <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Admission Likelihood</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; margin-top: 0.2rem;">
              <div style="font-size: 1.1rem; font-weight: 900; color: ${s.probability >= 80 ? 'var(--emerald-600)' : (s.probability >= 50 ? 'var(--gold-600)' : 'var(--rose-600)')}; font-family: var(--font-heading);">
                ${s.probability}%
              </div>
              <span class="badge ${s.badgeClass}" style="font-size: 0.7rem;">
                ${s.feasibilityLabel}
              </span>
            </div>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.9rem;">
          ${s.overview}
        </p>

        <!-- Programs and Cutoff footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.75rem; font-size: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
            <strong style="color: var(--primary-900);">Programs:</strong>
            ${s.programs.map(p => `<span style="background: var(--bg-main); padding: 0.15rem 0.5rem; border-radius: 4px; border: 1px solid var(--border-light); font-size: 0.75rem; color: var(--text-muted);">${p}</span>`).join('')}
          </div>
          <div>
            <span style="color: var(--text-muted);">Historical Cutoff:</span>
            <strong style="color: var(--primary-900); font-family: var(--font-heading);">Agg ${s.cutoffMin < 10 ? '0' + s.cutoffMin : s.cutoffMin} – ${s.cutoffMax < 10 ? '0' + s.cutoffMax : s.cutoffMax}</strong>
          </div>
        </div>
      </div>
    `;
  },

  renderDirectoryTab(schools) {
    return `
      <div>
        <!-- Search & Filter Controls -->
        <div class="filter-controls-bar" style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-light); margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; align-items: center;" class="cssps-filter-grid">
            
            <div class="form-group" style="margin-bottom: 0;">
              <input type="text" id="shs-search-input" class="form-input" placeholder="Search by school name, suburb, motto..." value="${this.directoryFilters.search}" />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <select id="shs-filter-category" class="form-select">
                <option value="All" ${this.directoryFilters.category === 'All' ? 'selected' : ''}>All Categories</option>
                <option value="Category A" ${this.directoryFilters.category === 'Category A' ? 'selected' : ''}>Category A</option>
                <option value="Category B" ${this.directoryFilters.category === 'Category B' ? 'selected' : ''}>Category B</option>
                <option value="Category C" ${this.directoryFilters.category === 'Category C' ? 'selected' : ''}>Category C & TVET</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <select id="shs-filter-region" class="form-select">
                <option value="All" ${this.directoryFilters.region === 'All' ? 'selected' : ''}>All Regions</option>
                <option value="Greater Accra" ${this.directoryFilters.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                <option value="Ashanti" ${this.directoryFilters.region === 'Ashanti' ? 'selected' : ''}>Ashanti</option>
                <option value="Central" ${this.directoryFilters.region === 'Central' ? 'selected' : ''}>Central</option>
                <option value="Eastern" ${this.directoryFilters.region === 'Eastern' ? 'selected' : ''}>Eastern</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <select id="shs-filter-gender" class="form-select">
                <option value="All" ${this.directoryFilters.gender === 'All' ? 'selected' : ''}>All Genders</option>
                <option value="Boys" ${this.directoryFilters.gender === 'Boys' ? 'selected' : ''}>Boys Only</option>
                <option value="Girls" ${this.directoryFilters.gender === 'Girls' ? 'selected' : ''}>Girls Only</option>
                <option value="Co-educational" ${this.directoryFilters.gender === 'Co-educational' ? 'selected' : ''}>Co-educational</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Schools Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem;">
          ${schools.map(s => `
            <div class="card" style="padding: 1.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-xl); background: var(--bg-surface); display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
                  <span class="badge ${s.category === 'Category A' ? 'badge-gold' : (s.category === 'Category B' ? 'badge-blue' : 'badge-emerald')}" style="font-size: 0.72rem; font-weight: 800;">
                    ${s.category}
                  </span>
                  <span style="font-size: 0.75rem; color: var(--text-light); font-weight: 700;">
                    GES: ${s.gesCode}
                  </span>
                </div>

                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.25rem 0;">
                  ${s.name}
                </h3>
                <div style="font-size: 0.82rem; font-style: italic; color: var(--text-muted); margin-bottom: 0.75rem;">
                  "${s.motto}"
                </div>

                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem;">
                  <div>📍 <strong>${s.suburb}</strong>, ${s.region} (${s.district})</div>
                  <div>🏫 <strong>${s.gender}</strong> • ${s.boardingType} • Est. ${s.established}</div>
                  <div>⭐ Flagship: <strong>${s.flagshipProgram}</strong></div>
                </div>

                <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                  ${s.overview}
                </p>
              </div>

              <div style="border-top: 1px solid var(--border-light); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                  Cutoff: <strong style="color: var(--primary-900); font-family: var(--font-heading);">Agg ${s.cutoffMin < 10 ? '0' + s.cutoffMin : s.cutoffMin} – ${s.cutoffMax < 10 ? '0' + s.cutoffMax : s.cutoffMax}</strong>
                </div>
                <button type="button" class="btn-pill btn-outline" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;" onclick="CSSPSView.prefillAndSwitch('${s.programs[0] || 'General Science'}', '${s.region}')">
                  Check Eligibility
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  getGradeLabel(g) {
    if (g === 1) return 'Highest / Grade 1';
    if (g === 2) return 'Higher';
    if (g === 3) return 'High';
    if (g === 4) return 'Credit';
    if (g === 5) return 'Credit';
    if (g === 6) return 'Pass';
    if (g === 7) return 'Lower Pass';
    if (g === 8) return 'Weak Pass';
    return 'Fail';
  },

  prefillAndSwitch(prog, reg) {
    this.activeTab = 'calculator';
    if (prog) this.gradeInputs.program = prog;
    if (reg) this.gradeInputs.preferredRegion = reg;
    App.navigate('cssps');
  },

  attachEvents() {
    // Breadcrumb
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Tab buttons
    document.getElementById('tab-btn-calc')?.addEventListener('click', () => {
      this.activeTab = 'calculator';
      App.navigate('cssps');
    });

    document.getElementById('tab-btn-shs-dir')?.addEventListener('click', () => {
      this.activeTab = 'directory';
      App.navigate('cssps');
    });

    document.getElementById('link-cssps-past-questions')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof ResourcesView !== 'undefined') {
        ResourcesView.filters.examType = 'BECE';
      }
      App.navigate('past-questions');
    });

    // Grade dropdown live change listeners
    const gradeSelects = document.querySelectorAll('.grade-select');
    gradeSelects.forEach(select => {
      select.addEventListener('change', () => {
        const eng = Number(document.getElementById('grade-english')?.value) || 1;
        const mat = Number(document.getElementById('grade-maths')?.value) || 1;
        const sci = Number(document.getElementById('grade-science')?.value) || 1;
        const soc = Number(document.getElementById('grade-social')?.value) || 1;
        const e1 = Number(document.getElementById('grade-elective1')?.value) || 1;
        const e2 = Number(document.getElementById('grade-elective2')?.value) || 1;

        this.gradeInputs.english = eng;
        this.gradeInputs.maths = mat;
        this.gradeInputs.science = sci;
        this.gradeInputs.social = soc;
        this.gradeInputs.elective1 = e1;
        this.gradeInputs.elective2 = e2;

        const liveAgg = eng + mat + sci + soc + e1 + e2;
        const elNum = document.getElementById('live-agg-num');
        if (elNum) {
          elNum.innerText = liveAgg < 10 ? '0' + liveAgg : liveAgg;
        }
      });
    });

    // Form submission
    const form = document.getElementById('form-cssps-calculator');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();

        const inputs = {
          english: Number(document.getElementById('grade-english').value),
          maths: Number(document.getElementById('grade-maths').value),
          science: Number(document.getElementById('grade-science').value),
          social: Number(document.getElementById('grade-social').value),
          elective1Name: document.getElementById('elective-1-name').value,
          elective1: Number(document.getElementById('grade-elective1').value),
          elective2Name: document.getElementById('elective-2-name').value,
          elective2: Number(document.getElementById('grade-elective2').value),
          program: document.getElementById('pref-program').value,
          preferredRegion: document.getElementById('pref-region').value,
          gender: document.getElementById('pref-gender').value
        };

        this.gradeInputs = inputs;

        const container = document.getElementById('cssps-results-container');
        if (container) {
          container.innerHTML = `
            <div style="background: var(--bg-surface); padding: 3rem; border-radius: var(--radius-xl); text-align: center; border: 1px solid var(--border-light);">
              <div style="font-size: 2rem; animation: pulse-dot 1s infinite;">🎓</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--primary-900); margin-top: 0.5rem;">
                Analyzing CSSPS Placement & WAEC Mock Cutoffs...
              </div>
            </div>
          `;
        }

        try {
          const results = await API.calculateCSSPS(inputs);
          this.lastResult = results;
          if (container) {
            container.innerHTML = this.renderResults(results);
          }
          State.showToast(`Calculated BECE Aggregate ${results.scores.totalAggregate}! Placement matches updated.`, 'success');
        } catch (err) {
          State.showToast("Calculation error: " + err.message, "error");
        }
      };
    }

    // Directory Search & Filters
    const searchInput = document.getElementById('shs-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        App.debounce(async () => {
          this.directoryFilters.search = e.target.value;
          App.navigate('cssps');
        }, 350);
      });
    }

    const filterCategory = document.getElementById('shs-filter-category');
    if (filterCategory) {
      filterCategory.addEventListener('change', (e) => {
        this.directoryFilters.category = e.target.value;
        App.navigate('cssps');
      });
    }

    const filterRegion = document.getElementById('shs-filter-region');
    if (filterRegion) {
      filterRegion.addEventListener('change', (e) => {
        this.directoryFilters.region = e.target.value;
        App.navigate('cssps');
      });
    }

    const filterGender = document.getElementById('shs-filter-gender');
    if (filterGender) {
      filterGender.addEventListener('change', (e) => {
        this.directoryFilters.gender = e.target.value;
        App.navigate('cssps');
      });
    }
  }
};
