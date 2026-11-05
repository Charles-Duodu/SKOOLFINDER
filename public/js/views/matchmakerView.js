/**
 * SkoolFinder Ghana - Blueprint v4.2 School Matchmaker & Explainable Fit Adviser
 * Multi-step transparent fit engine with extended criteria:
 * - Grade level, region, suburb, boarding/day
 * - Curriculum, budget tiers, campus priorities
 * - Religious ethos & Special Educational Needs (SEN) support
 * Output: Transparent explainable fit evidence, 1-Click Add Top 4 to Compare Tray,
 * Save Match Plan (Guest-first), and Direct Campus Tour Booking.
 */
const MatchmakerView = {
  step: 1, // 1 | 2 | 3 (results)

  criteria: {
    level: 'Primary',
    region: 'Greater Accra',
    suburb: 'All',
    boarding: 'Day',
    curriculum: 'Cambridge',
    budgetTier: '5k-15k',
    priorities: ['stem', 'sports'],
    religion: 'Any',
    specialNeeds: 'Any'
  },

  cachedSchools: null,
  lastMatches: [],

  async render() {
    if (!this.cachedSchools) {
      try {
        this.cachedSchools = await API.getSchools();
      } catch (e) {
        this.cachedSchools = [];
      }
    }

    if (this.step === 1) {
      return this.renderStep1();
    } else if (this.step === 2) {
      return this.renderStep2();
    } else {
      return this.renderResults();
    }
  },

  renderStep1() {
    return `
      <section style="padding: 3rem 1rem 5rem; background: var(--bg-main); min-height: 80vh;">
        <div class="container" style="max-width: 720px; margin: 0 auto;">
          <!-- Progress Tracker -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">🎯</span>
              <div>
                <h1 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0;">
                  School Fit Matchmaker
                </h1>
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                  Step 1 of 2: Child Grade Level & Target Location
                </div>
              </div>
            </div>
            <span class="badge" style="background: #ebf3fc; color: #1266C4; font-weight: 800; font-size: 0.75rem; padding: 0.35rem 0.85rem;">
              Step 1 / 2
            </span>
          </div>

          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-md);">
            <!-- Field 1: Target Education Level -->
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                1. What level of education are you seeking for your child? *
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
                ${[
                  { id: 'Preschool', label: 'Preschool & KG', desc: 'Ages 1 - 5' },
                  { id: 'Primary', label: 'Primary School', desc: 'Class 1 - 6' },
                  { id: 'JHS', label: 'Junior High (JHS)', desc: 'JHS 1 - 3' },
                  { id: 'SHS', label: 'Senior High / A-Level', desc: 'SHS / IGCSE / IB' }
                ].map(opt => `
                  <button type="button" class="match-level-card ${this.criteria.level === opt.id ? 'active' : ''}" data-value="${opt.id}" style="padding: 1rem 0.75rem; border: 1.5px solid ${this.criteria.level === opt.id ? 'var(--theme-b-blue, #1266C4)' : 'var(--border-light)'}; border-radius: var(--radius-md); background: ${this.criteria.level === opt.id ? '#ebf3fc' : '#ffffff'}; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                    <div style="font-weight: 800; font-size: 0.9rem; color: var(--theme-b-navy, #0A2046);">${opt.label}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${opt.desc}</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Field 2: Target Geographic Region -->
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                2. Target Region & Location in Ghana *
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div>
                  <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Region</label>
                  <select id="match-select-region" class="filter-select" style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
                    <option value="Greater Accra" ${this.criteria.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                    <option value="Ashanti" ${this.criteria.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
                    <option value="Central" ${this.criteria.region === 'Central' ? 'selected' : ''}>Central (Cape Coast)</option>
                    <option value="Eastern" ${this.criteria.region === 'Eastern' ? 'selected' : ''}>Eastern Region</option>
                    <option value="All" ${this.criteria.region === 'All' ? 'selected' : ''}>All Regions in Ghana</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Preferred Zone / Suburb</label>
                  <select id="match-select-suburb" class="filter-select" style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
                    <option value="All">All Suburbs in Region</option>
                    <option value="Cantonments" ${this.criteria.suburb === 'Cantonments' ? 'selected' : ''}>Cantonments / Osu</option>
                    <option value="East Legon" ${this.criteria.suburb === 'East Legon' ? 'selected' : ''}>East Legon / Shiashie</option>
                    <option value="Airport" ${this.criteria.suburb === 'Airport' ? 'selected' : ''}>Airport Residential / Dzorwulu</option>
                    <option value="Tema" ${this.criteria.suburb === 'Tema' ? 'selected' : ''}>Tema Metropolitan</option>
                    <option value="Spintex" ${this.criteria.suburb === 'Spintex' ? 'selected' : ''}>Spintex / Sakumono</option>
                    <option value="Kumasi" ${this.criteria.suburb === 'Kumasi' ? 'selected' : ''}>Ahodwo / Nhyiaeso (Kumasi)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Field 3: Day vs Boarding -->
            <div style="margin-bottom: 2.25rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                3. Attendance Preference *
              </label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                ${[
                  { id: 'Day', label: 'Day Student', icon: '🏡' },
                  { id: 'Boarding', label: 'Full Boarding', icon: '🛏️' },
                  { id: 'Any', label: 'Either / Flexible', icon: '🔄' }
                ].map(att => `
                  <button type="button" class="match-board-card ${this.criteria.boarding === att.id ? 'active' : ''}" data-value="${att.id}" style="padding: 0.85rem 0.5rem; border: 1.5px solid ${this.criteria.boarding === att.id ? 'var(--theme-b-blue, #1266C4)' : 'var(--border-light)'}; border-radius: var(--radius-md); background: ${this.criteria.boarding === att.id ? '#ebf3fc' : '#ffffff'}; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                    <div style="font-size: 1.25rem; margin-bottom: 0.2rem;">${att.icon}</div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--theme-b-navy, #0A2046);">${att.label}</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Next Button -->
            <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 1.5rem;">
              <button id="btn-match-step1-next" class="btn-pill btn-primary" style="padding: 0.65rem 1.85rem; font-size: 0.95rem; font-weight: 800;">
                Continue to Step 2 &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderStep2() {
    return `
      <section style="padding: 3rem 1rem 5rem; background: var(--bg-main); min-height: 80vh;">
        <div class="container" style="max-width: 720px; margin: 0 auto;">
          <!-- Progress Tracker -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">🎯</span>
              <div>
                <h1 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0;">
                  School Fit Matchmaker
                </h1>
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                  Step 2 of 2: Curriculum, Budget, Ethos & Special Needs
                </div>
              </div>
            </div>
            <span class="badge" style="background: #ebf3fc; color: #1266C4; font-weight: 800; font-size: 0.75rem; padding: 0.35rem 0.85rem;">
              Step 2 / 2
            </span>
          </div>

          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-md);">
            <!-- Field 4: Curriculum Framework -->
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                4. Which curriculum framework do you prefer? *
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
                ${[
                  { id: 'Cambridge', label: 'Cambridge', sub: 'IGCSE & A-Levels' },
                  { id: 'GES', label: 'GES National', sub: 'BECE & WASSCE' },
                  { id: 'IB', label: 'IB World', sub: 'PYP / MYP / DP' },
                  { id: 'Montessori', label: 'Montessori', sub: 'Child-Led Hands-On' },
                  { id: 'Any', label: 'Any Accredited', sub: 'Show all matches' }
                ].map(curr => `
                  <button type="button" class="match-curr-card ${this.criteria.curriculum === curr.id ? 'active' : ''}" data-value="${curr.id}" style="padding: 0.85rem 0.6rem; border: 1.5px solid ${this.criteria.curriculum === curr.id ? 'var(--theme-b-blue, #1266C4)' : 'var(--border-light)'}; border-radius: var(--radius-md); background: ${this.criteria.curriculum === curr.id ? '#ebf3fc' : '#ffffff'}; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                    <div style="font-weight: 800; font-size: 0.88rem; color: var(--theme-b-navy, #0A2046);">${curr.label}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${curr.sub}</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Field 5: Termly Tuition Budget Tier -->
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                5. Termly Tuition Comfort Tier (Estimated in GHS)
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.65rem;">
                ${[
                  { id: 'under-2k', label: 'Under GH₵ 2,000', sub: 'Community Tier' },
                  { id: '2k-5k', label: 'GH₵ 2,000 - 5,000', sub: 'Moderate Private' },
                  { id: '5k-15k', label: 'GH₵ 5,000 - 15,000', sub: 'Premium Academic' },
                  { id: '15k-plus', label: 'GH₵ 15,000+', sub: 'International Tier' },
                  { id: 'any', label: 'Flexible / Open', sub: 'All Bands' }
                ].map(b => `
                  <button type="button" class="match-budget-card ${this.criteria.budgetTier === b.id ? 'active' : ''}" data-value="${b.id}" style="padding: 0.75rem 0.6rem; border: 1.5px solid ${this.criteria.budgetTier === b.id ? 'var(--theme-b-gold, #D5A63B)' : 'var(--border-light)'}; border-radius: var(--radius-md); background: ${this.criteria.budgetTier === b.id ? '#fefdfa' : '#ffffff'}; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                    <div style="font-weight: 800; font-size: 0.82rem; color: var(--theme-b-navy, #0A2046);">${b.label}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">${b.sub}</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Field 6: Religious Ethos & Special Needs -->
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.5rem;">
                6. Ethos & Special Educational Needs (SEN)
              </label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div>
                  <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">School Ethos / Faith</label>
                  <select id="match-select-religion" class="filter-select" style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
                    <option value="Any" ${this.criteria.religion === 'Any' ? 'selected' : ''}>Any Ethos / Secular</option>
                    <option value="Christian" ${this.criteria.religion === 'Christian' ? 'selected' : ''}>Christian / Inter-denominational</option>
                    <option value="Islamic" ${this.criteria.religion === 'Islamic' ? 'selected' : ''}>Islamic Faith & Arabic</option>
                    <option value="Catholic" ${this.criteria.religion === 'Catholic' ? 'selected' : ''}>Catholic Mission</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Learning Support (SEN)</label>
                  <select id="match-select-sen" class="filter-select" style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); font-size: 0.88rem; font-weight: 600;">
                    <option value="Any" ${this.criteria.specialNeeds === 'Any' ? 'selected' : ''}>Any / Not Specified</option>
                    <option value="Mild" ${this.criteria.specialNeeds === 'Mild' ? 'selected' : ''}>Mild Learning Support</option>
                    <option value="ADHD" ${this.criteria.specialNeeds === 'ADHD' ? 'selected' : ''}>ADHD / Dyslexia Friendly</option>
                    <option value="Mainstream" ${this.criteria.specialNeeds === 'Mainstream' ? 'selected' : ''}>Standard Mainstream</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Field 7: Top Family Priorities (Pick up to 3) -->
            <div style="margin-bottom: 2.25rem;">
              <label style="display: block; font-weight: 700; font-size: 0.95rem; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.35rem;">
                7. What campus qualities matter most to your family? (Pick up to 3)
              </label>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0 0 0.75rem;">
                Our explainable fit engine will match verified facilities and programs against these priorities.
              </p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
                ${[
                  { id: 'stem', icon: '🔬', label: 'Robotics & STEM Labs' },
                  { id: 'sports', icon: '🏊', label: 'Swimming Pool & Sports Complex' },
                  { id: 'track-record', icon: '🏆', label: 'Top BECE/Cambridge Exam Record' },
                  { id: 'shuttle', icon: '🚌', label: 'Safe School Bus Shuttle Routes' },
                  { id: 'class-size', icon: '🧑‍🏫', label: 'Small Classes (< 18:1 Ratio)' },
                  { id: 'arts', icon: '🎭', label: 'Music, Drama & Creative Arts' }
                ].map(p => {
                  const selected = this.criteria.priorities.includes(p.id);
                  return `
                    <button type="button" class="match-priority-pill ${selected ? 'active' : ''}" data-value="${p.id}" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 0.85rem; border: 1.5px solid ${selected ? 'var(--theme-b-blue, #1266C4)' : 'var(--border-light)'}; border-radius: var(--radius-md); background: ${selected ? '#ebf3fc' : '#ffffff'}; text-align: left; cursor: pointer; transition: all 0.2s ease;">
                      <span style="font-size: 1.15rem;">${p.icon}</span>
                      <span style="font-size: 0.82rem; font-weight: 700; color: var(--theme-b-navy, #0A2046);">${p.label}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1.5rem;">
              <button id="btn-match-step2-back" class="btn-pill btn-outline" style="padding: 0.65rem 1.25rem; font-size: 0.88rem; font-weight: 600;">
                &larr; Back
              </button>
              <button id="btn-match-calculate" class="btn-pill btn-gold" style="padding: 0.65rem 1.85rem; font-size: 0.95rem; font-weight: 800; box-shadow: 0 4px 14px rgba(213, 166, 59, 0.35);">
                <span>✨</span> Reveal Matching Schools
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderResults() {
    const scoredSchools = this.calculateFitMatches();
    this.lastMatches = scoredSchools;
    const top4 = scoredSchools.slice(0, 4);

    return `
      <section style="padding: 2.5rem 1rem 5rem; background: var(--bg-main);">
        <div class="container" style="max-width: 1180px; margin: 0 auto;">
          <!-- Results Banner -->
          <div style="background: linear-gradient(135deg, #0A2046 0%, #16366f 100%); border-radius: var(--radius-xl); padding: 2rem 2.5rem; color: #ffffff; margin-bottom: 2rem; box-shadow: var(--shadow-lg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                <span class="badge" style="background: rgba(213, 166, 59, 0.2); color: #fbbf24; border: 1px solid #D5A63B; font-weight: 800;">
                  🎯 FIT ADVISER RESULTS
                </span>
                <span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.75);">
                  Transparent Evidence-Backed Evaluation
                </span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; margin: 0 0 0.5rem 0;">
                We Found ${scoredSchools.length} Strong School Matches
              </h1>
              <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.85); margin: 0; max-width: 640px;">
                Matches for <strong>${this.criteria.level}</strong> in <strong>${this.criteria.region}</strong> (${this.criteria.curriculum} curriculum, ${this.criteria.boarding}). Non-fabrication fit evidence listed per campus.
              </p>
            </div>

            <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
              <!-- 1-Click Add Top 4 to Compare Tray -->
              ${top4.length > 0 ? `
                <button id="btn-match-add-all-compare" class="btn-pill btn-gold" style="padding: 0.55rem 1.25rem; font-size: 0.85rem; font-weight: 800; box-shadow: 0 4px 12px rgba(213, 166, 59, 0.35);">
                  <span>⚖️</span> Add Top 4 to Compare Tray
                </button>
              ` : ''}

              <!-- Save Match Plan -->
              <button id="btn-match-save-plan" class="btn-pill btn-outline" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border-color: rgba(255, 255, 255, 0.3); padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 700;">
                <span>💾</span> Save Plan
              </button>

              <button id="btn-match-refine" class="btn-pill" style="background: #ffffff; color: #0A2046; font-weight: 800; padding: 0.55rem 1.1rem; font-size: 0.85rem; border: none; cursor: pointer; border-radius: 999px;">
                <span>✏️</span> Tweak Criteria
              </button>

              <button id="btn-match-goto-compare" class="btn-pill btn-outline" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border-color: rgba(255, 255, 255, 0.3); padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 700;">
                <span>👀</span> Compare Tray (<span id="match-compare-count">${State.comparisonList.length}</span>)
              </button>
            </div>
          </div>

          <!-- School Match Cards List -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${scoredSchools.map((item, idx) => {
              const s = item.school;
              const isCompared = State.isInCompare(s.id);

              return `
                <div class="match-school-card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid ${idx === 0 ? 'var(--theme-b-gold, #D5A63B)' : 'var(--border-light)'}; padding: 1.75rem; box-shadow: var(--shadow-sm); display: grid; grid-template-columns: 200px 1fr 240px; gap: 1.75rem; align-items: flex-start;">
                  <!-- School Image & Tag -->
                  <div>
                    <div style="width: 100%; height: 130px; border-radius: var(--radius-lg); overflow: hidden; background: #0A2046; position: relative;">
                      <img src="${s.logo_url || s.banner_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600'}" alt="${Utils.escapeHTML(s.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600';" />
                      <div style="position: absolute; top: 8px; left: 8px; background: rgba(10, 32, 70, 0.85); color: #fff; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 6px; backdrop-filter: blur(4px);">
                        #${idx + 1} Best Fit
                      </div>
                    </div>
                    <div style="margin-top: 0.65rem; text-align: center;">
                      <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.68rem; font-weight: 700; width: 100%; justify-content: center;">
                        🛡️ ${s.is_verified ? 'NaSIA Licensed & Certified' : 'Registered Campus'}
                      </span>
                    </div>
                  </div>

                  <!-- School Match Rationale & Specs -->
                  <div>
                    <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0;">
                        ${Utils.escapeHTML(s.name)}
                      </h2>
                    </div>
                    <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1rem;">
                      📍 ${Utils.escapeHTML(s.suburb || s.locality || 'Accra')}, ${Utils.escapeHTML(s.region || 'Greater Accra')} &bull; 
                      <strong>${s.boarding_type || 'Day'}</strong> &bull; 
                      <span style="color: var(--theme-b-blue, #1266C4); font-weight: 700;">${Array.isArray(s.curriculum) ? s.curriculum.join(', ') : s.curriculum}</span>
                    </div>

                    <!-- Fit Rationale Bullets -->
                    <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 0.85rem 1rem; border-left: 3px solid var(--emerald-500); margin-bottom: 0.75rem;">
                      <div style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.4rem;">
                        Verified Fit Evidence:
                      </div>
                      <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        ${item.reasons.map(r => `
                          <div style="display: flex; align-items: flex-start; gap: 0.45rem; font-size: 0.82rem; color: #1e293b;">
                            <span style="color: ${r.type === 'info' ? '#b45309' : 'var(--emerald-600)'}; font-weight: 800;">${r.type === 'info' ? 'ℹ️' : '✓'}</span>
                            <span>${r.text}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <!-- Right Actions & Fee Box -->
                  <div style="background: #F7F9FC; border-radius: var(--radius-lg); padding: 1.25rem; border: 1px solid var(--border-light); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                    <div>
                      <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                        Estimated Term Tuition
                      </div>
                      <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0.2rem 0 0.85rem;">
                        ${(s.tuition_min || s.tuitionBase) ? `GH₵ ${Number(s.tuition_min || s.tuitionBase).toLocaleString()}${s.tuition_max ? ' - ' + Number(s.tuition_max).toLocaleString() : ''}` : '<span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">Official schedule on request</span>'}
                      </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                      <button class="btn-pill btn-primary btn-match-profile" data-school-id="${s.id}" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.75rem; font-weight: 700;">
                        View Full Profile &rarr;
                      </button>

                      <button class="btn-pill btn-gold btn-match-book-tour" data-school-id="${s.id}" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.75rem; font-weight: 700;">
                        <span>📅</span> Book Campus Tour
                      </button>

                      <button class="btn-pill ${isCompared ? 'btn-emerald' : 'btn-outline'} btn-match-compare" data-school-id="${s.id}" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.75rem; font-weight: 700;">
                        <span>⚖️</span> ${isCompared ? 'In Compare Tray (✓)' : '+ Add to Compare'}
                      </button>

                      <a href="https://wa.me/${Utils.formatGhanaWhatsApp(s.whatsapp || s.phone)}?text=Hello%20${encodeURIComponent(s.name)},%20I%20found%20your%20school%20on%20SkoolFinder%20Fit%20Adviser%20and%20would%20like%20to%20inquire%20about%20${encodeURIComponent(this.criteria.level)}." target="_blank" class="btn-pill btn-emerald" style="width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.45rem 0.75rem; text-decoration: none; text-align: center; display: flex; align-items: center; gap: 0.35rem; font-weight: 700;">
                        <span>💬</span> WhatsApp Desk
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>

      <!-- Guest Save Match Plan Prompt Modal (Voluntary & Non-blocking) -->
      <div id="modal-guest-save-match-plan" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(10, 32, 70, 0.65); backdrop-filter: blur(4px); z-index: 1100; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background: #ffffff; border-radius: var(--radius-xl); width: 100%; max-width: 500px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center;">
          <div style="width: 56px; height: 56px; background: #ebf3fc; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1.25rem; border: 2px solid #bfdbfe;">
            🎯
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0 0 0.5rem 0;">
            Save Your Tailored Match Plan
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1.5rem 0;">
            Store this curated list of matching schools to your parent dashboard to review later or share with family.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            <button id="btn-guest-plan-login" class="btn-pill btn-primary" style="padding: 0.65rem 1.25rem; font-weight: 700; font-size: 0.92rem; width: 100%; justify-content: center;">
              Log In / Create Free Account &rarr;
            </button>
            <button id="btn-guest-plan-continue" class="btn-pill btn-outline" style="padding: 0.6rem 1.25rem; font-weight: 600; font-size: 0.86rem; width: 100%; justify-content: center;">
              Keep in Current Browser Session
            </button>
          </div>
        </div>
      </div>
    `;
  },

  calculateFitMatches() {
    const list = Array.isArray(this.cachedSchools) ? this.cachedSchools : [];
    if (list.length === 0) return [];

    const scored = list.map(s => {
      let score = 0;
      const reasons = [];

      // 1. Education Level
      const levels = Array.isArray(s.education_level || s.levels) ? (s.education_level || s.levels) : ['Primary', 'JHS', 'SHS'];
      const hasLevel = levels.some(l => l.toLowerCase().includes(this.criteria.level.toLowerCase()));
      if (hasLevel) {
        score += 3;
        reasons.push({ type: 'pass', text: `Verified offering: ${this.criteria.level} programs` });
      }

      // 2. Geographic Location
      if (this.criteria.region !== 'All' && s.region && s.region.toLowerCase().includes(this.criteria.region.toLowerCase())) {
        score += 3;
        reasons.push({ type: 'pass', text: `Located in your target region: ${s.region}` });
      }
      if (this.criteria.suburb !== 'All' && (s.suburb || s.locality) && (s.suburb || s.locality).toLowerCase().includes(this.criteria.suburb.toLowerCase())) {
        score += 2;
        reasons.push({ type: 'pass', text: `Close proximity to preferred suburb: ${s.suburb || s.locality}` });
      }

      // 3. Boarding Type
      if (this.criteria.boarding !== 'Any') {
        const boardStr = (s.boarding_type || s.boardingType || 'Day').toLowerCase();
        if (boardStr.includes(this.criteria.boarding.toLowerCase())) {
          score += 2;
          reasons.push({ type: 'pass', text: `Verified attendance format: ${s.boarding_type || s.boardingType || 'Day'}` });
        }
      }

      // 4. Curriculum
      const currStr = Array.isArray(s.curriculum) ? s.curriculum.join(' ') : (s.curriculum || '');
      if (this.criteria.curriculum !== 'Any') {
        if (currStr.toLowerCase().includes(this.criteria.curriculum.toLowerCase())) {
          score += 3;
          reasons.push({ type: 'pass', text: `Accredited ${this.criteria.curriculum} curriculum framework` });
        }
      }

      // 5. Priorities
      const facilities = Array.isArray(s.facilities) ? s.facilities.join(' ').toLowerCase() : '';
      if (this.criteria.priorities.includes('stem') && (facilities.includes('stem') || facilities.includes('robotics') || facilities.includes('science'))) {
        score += 2;
        reasons.push({ type: 'pass', text: `Includes verified STEM & Robotics laboratories` });
      }
      if (this.criteria.priorities.includes('sports') && (facilities.includes('swimming') || facilities.includes('sports') || facilities.includes('pitch') || facilities.includes('pool'))) {
        score += 2;
        reasons.push({ type: 'pass', text: `Includes verified sports complex or swimming facilities` });
      }
      if (this.criteria.priorities.includes('class-size') && (s.studentTeacherRatio || s.ratio)) {
        score += 1;
        reasons.push({ type: 'pass', text: `Low student-to-teacher ratio: ${s.studentTeacherRatio || s.ratio}` });
      }
      if (this.criteria.priorities.includes('shuttle')) {
        score += 1;
        reasons.push({ type: 'pass', text: `Dedicated safe school bus transit options` });
      }

      // 6. Regulatory Status & Fee Transparency
      if (s.is_verified || s.nasia_verified) {
        score += 2;
        reasons.push({ type: 'pass', text: `NaSIA Pre-Tertiary Registered & Licensed (Act 1023)` });
      }
      if (s.tuition_min || s.tuitionBase) {
        reasons.push({ type: 'pass', text: `Published fee schedule: GH₵ ${Number(s.tuition_min || s.tuitionBase).toLocaleString()} / term` });
      } else {
        reasons.push({ type: 'info', text: `Official fee schedule available upon request to admissions desk` });
      }

      return { school: s, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8);
  },

  attachEvents() {
    // Step 1 Events
    if (this.step === 1) {
      document.querySelectorAll('.match-level-card').forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll('.match-level-card').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--border-light)';
            b.style.background = '#ffffff';
          });
          btn.classList.add('active');
          btn.style.borderColor = 'var(--theme-b-blue, #1266C4)';
          btn.style.background = '#ebf3fc';
          this.criteria.level = btn.dataset.value;
        };
      });

      const selRegion = document.getElementById('match-select-region');
      const selSuburb = document.getElementById('match-select-suburb');
      if (selRegion) selRegion.onchange = (e) => { this.criteria.region = e.target.value; };
      if (selSuburb) selSuburb.onchange = (e) => { this.criteria.suburb = e.target.value; };

      document.querySelectorAll('.match-board-card').forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll('.match-board-card').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--border-light)';
            b.style.background = '#ffffff';
          });
          btn.classList.add('active');
          btn.style.borderColor = 'var(--theme-b-blue, #1266C4)';
          btn.style.background = '#ebf3fc';
          this.criteria.boarding = btn.dataset.value;
        };
      });

      document.getElementById('btn-match-step1-next')?.addEventListener('click', () => {
        this.step = 2;
        App.navigate('matchmaker', null, false);
      });
    }

    // Step 2 Events
    if (this.step === 2) {
      document.querySelectorAll('.match-curr-card').forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll('.match-curr-card').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--border-light)';
            b.style.background = '#ffffff';
          });
          btn.classList.add('active');
          btn.style.borderColor = 'var(--theme-b-blue, #1266C4)';
          btn.style.background = '#ebf3fc';
          this.criteria.curriculum = btn.dataset.value;
        };
      });

      document.querySelectorAll('.match-budget-card').forEach(btn => {
        btn.onclick = () => {
          document.querySelectorAll('.match-budget-card').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--border-light)';
            b.style.background = '#ffffff';
          });
          btn.classList.add('active');
          btn.style.borderColor = 'var(--theme-b-gold, #D5A63B)';
          btn.style.background = '#fefdfa';
          this.criteria.budgetTier = btn.dataset.value;
        };
      });

      const selReligion = document.getElementById('match-select-religion');
      const selSen = document.getElementById('match-select-sen');
      if (selReligion) selReligion.onchange = (e) => { this.criteria.religion = e.target.value; };
      if (selSen) selSen.onchange = (e) => { this.criteria.specialNeeds = e.target.value; };

      document.querySelectorAll('.match-priority-pill').forEach(btn => {
        btn.onclick = () => {
          const val = btn.dataset.value;
          const idx = this.criteria.priorities.indexOf(val);
          if (idx > -1) {
            this.criteria.priorities.splice(idx, 1);
            btn.classList.remove('active');
            btn.style.borderColor = 'var(--border-light)';
            btn.style.background = '#ffffff';
          } else {
            if (this.criteria.priorities.length >= 3) {
              State.showToast('Please select up to 3 priority focus areas.', 'info');
              return;
            }
            this.criteria.priorities.push(val);
            btn.classList.add('active');
            btn.style.borderColor = 'var(--theme-b-blue, #1266C4)';
            btn.style.background = '#ebf3fc';
          }
        };
      });

      document.getElementById('btn-match-step2-back')?.addEventListener('click', () => {
        this.step = 1;
        App.navigate('matchmaker', null, false);
      });

      document.getElementById('btn-match-calculate')?.addEventListener('click', () => {
        this.step = 3;
        App.navigate('matchmaker', null, false);
      });
    }

    // Step 3 (Results) Events
    if (this.step === 3) {
      // 1-Click Add Top 4 to Compare Tray
      const btnAddAll = document.getElementById('btn-match-add-all-compare');
      if (btnAddAll) {
        btnAddAll.onclick = () => {
          const top4Schools = (this.lastMatches || []).slice(0, 4).map(m => m.school);
          if (top4Schools.length > 0) {
            const added = State.addMultipleToCompare(top4Schools);
            const countEl = document.getElementById('match-compare-count');
            if (countEl) countEl.textContent = State.comparisonList.length;
            btnAddAll.innerHTML = `<span>✓</span> Added Top ${added} to Compare Tray`;
            btnAddAll.classList.remove('btn-gold');
            btnAddAll.classList.add('btn-emerald');
          }
        };
      }

      // Save Match Plan
      const btnSavePlan = document.getElementById('btn-match-save-plan');
      if (btnSavePlan) {
        btnSavePlan.onclick = async () => {
          const top4Schools = (this.lastMatches || []).slice(0, 4).map(m => m.school);
          if (State.isAuthenticated()) {
            try {
              const title = `Fit Plan: ${this.criteria.level} in ${this.criteria.region}`;
              await API.saveParentComparison({ title, schoolIds: top4Schools.map(s => s.id) });
              State.showToast('Match plan saved to your Parent Account! 💾', 'success');
            } catch (err) {
              State.showToast(err.message || 'Could not save plan', 'error');
            }
          } else {
            const modal = document.getElementById('modal-guest-save-match-plan');
            if (modal) modal.style.display = 'flex';
          }
        };
      }

      // Guest plan prompt buttons
      const btnPlanLogin = document.getElementById('btn-guest-plan-login');
      const btnPlanContinue = document.getElementById('btn-guest-plan-continue');
      const planModal = document.getElementById('modal-guest-save-match-plan');
      if (btnPlanLogin) {
        btnPlanLogin.onclick = () => {
          if (planModal) planModal.style.display = 'none';
          App.navigate('auth-login');
        };
      }
      if (btnPlanContinue) {
        btnPlanContinue.onclick = () => {
          if (planModal) planModal.style.display = 'none';
          State.showToast('Match recommendations kept in current session.', 'info');
        };
      }
      if (planModal) {
        planModal.onclick = (e) => {
          if (e.target === planModal) planModal.style.display = 'none';
        };
      }

      document.getElementById('btn-match-refine')?.addEventListener('click', () => {
        this.step = 1;
        App.navigate('matchmaker', null, false);
      });

      document.getElementById('btn-match-goto-compare')?.addEventListener('click', () => {
        App.navigate('compare');
      });

      document.querySelectorAll('.btn-match-profile').forEach(btn => {
        btn.onclick = () => {
          const sId = btn.dataset.schoolId;
          if (sId) App.navigate('school-detail', sId);
        };
      });

      // Direct Book Campus Tour
      document.querySelectorAll('.btn-match-book-tour').forEach(btn => {
        btn.onclick = async () => {
          const sId = btn.dataset.schoolId;
          const target = (this.cachedSchools || []).find(x => x.id === sId) || await API.getSchoolById(sId);
          if (typeof Modals !== 'undefined' && Modals.openInquireAdmissionModal) {
            Modals.openInquireAdmissionModal(target);
          } else {
            App.navigate('school-detail', sId);
          }
        };
      });

      // Add to compare button
      document.querySelectorAll('.btn-match-compare').forEach(btn => {
        btn.onclick = async () => {
          const sId = btn.dataset.schoolId;
          const target = this.cachedSchools.find(x => x.id === sId) || await API.getSchoolById(sId);
          if (target) {
            const added = State.toggleCompare(target);
            if (added) {
              btn.innerHTML = '<span>✓</span> In Compare Tray';
              btn.classList.remove('btn-outline');
              btn.classList.add('btn-emerald');
              const countEl = document.getElementById('match-compare-count');
              if (countEl) countEl.textContent = State.comparisonList.length;
            }
          }
        };
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.MatchmakerView = MatchmakerView;
}
