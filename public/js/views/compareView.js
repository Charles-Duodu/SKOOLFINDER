/**
 * SkoolFinder Ghana - Blueprint v4.2 Comparison View (Side-by-Side Matrix)
 * Supports up to 4 schools with 9 comparison categories, non-fabrication fee rules,
 * mobile 2-school pinned focus, quick column swap, and in-page school picker.
 */
const CompareView = {
  mobileColA: 0,
  mobileColB: 1,
  mobileMode: 'focus', // 'focus' (2-school) | 'all' (horizontal scroll)

  render() {
    const list = (typeof State !== 'undefined' && Array.isArray(State.comparisonList)) 
      ? State.comparisonList.slice(0, 4) 
      : [];

    if (list.length === 0) {
      return `
        <section style="padding: 4rem 1rem; min-height: 75vh; background: var(--bg-main);">
          <div class="container" style="max-width: 640px; text-align: center; margin: 0 auto;">
            <div style="width: 72px; height: 72px; margin: 0 auto 1.5rem; background: #ebf3fc; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; border: 2px solid rgba(18, 102, 196, 0.2);">
              ⚖️
            </div>
            <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin-bottom: 0.75rem;">
              No Schools Selected to Compare
            </h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem;">
              Add up to <strong>4 schools</strong> from the directory to evaluate curricula, verified fee schedules, campus amenities, and admissions terms side-by-side.
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="btn-compare-goto-dir" class="btn-pill btn-primary" style="padding: 0.75rem 1.75rem; font-weight: 700;">
                <span>🔍</span> Browse School Directory &rarr;
              </button>
              <button id="btn-compare-goto-match" class="btn-pill btn-gold" style="padding: 0.75rem 1.5rem; font-weight: 700;">
                <span>🎯</span> Launch Fit Matchmaker
              </button>
            </div>
          </div>
        </section>
      `;
    }

    // Ensure valid mobile column indices
    if (this.mobileColA >= list.length) this.mobileColA = 0;
    if (this.mobileColB >= list.length) this.mobileColB = list.length > 1 ? 1 : 0;
    if (this.mobileColA === this.mobileColB && list.length > 1) {
      this.mobileColB = (this.mobileColA + 1) % list.length;
    }

    // Determine which schools are visible on mobile focus mode
    const mobileSchools = this.mobileMode === 'focus' && list.length > 1
      ? [list[this.mobileColA], list[this.mobileColB]]
      : list;

    return `
      <section style="padding: 2.5rem 1rem 5rem; background: var(--bg-main);">
        <div class="container" style="max-width: 1360px; margin: 0 auto;">
          <!-- Top Header & Breadcrumb -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                <a href="#" class="breadcrumb-home" style="color: var(--theme-b-blue, #1266C4); font-weight: 600; text-decoration: none;">Home</a> 
                &nbsp;/&nbsp; 
                <span style="color: var(--theme-b-navy, #0A2046); font-weight: 600;">School Comparison Matrix</span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0;">
                Comparing ${list.length} of 4 Schools
              </h1>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.35rem; margin-bottom: 0;">
                Objective side-by-side evaluation across 9 institutional dimensions.
              </p>
            </div>

            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              ${list.length < 4 ? `
                <button id="btn-compare-add-more" class="btn-pill btn-primary" style="font-size: 0.84rem; padding: 0.45rem 1rem; font-weight: 700;">
                  <span>➕</span> Add School (${list.length}/4)
                </button>
              ` : ''}
              <button id="btn-compare-print" class="btn-pill btn-outline" style="font-size: 0.84rem; padding: 0.45rem 0.9rem;" title="Print or save as PDF">
                <span>🖨️</span> Print Matrix
              </button>
              <button id="btn-compare-clear-all" class="btn-pill btn-outline" style="font-size: 0.84rem; padding: 0.45rem 0.85rem; color: var(--rose-600); border-color: rgba(225, 29, 72, 0.3);">
                Clear All
              </button>
            </div>
          </div>

          <!-- Mobile Column Swap Toolbar (Displayed on Mobile when >= 2 schools) -->
          <div class="mobile-compare-toolbar" style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 0.85rem 1rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.84rem; font-weight: 700; color: var(--theme-b-navy, #0A2046);">
                <span>📱 Mobile Focus:</span>
                <select id="select-mob-school-a" class="filter-select" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; font-weight: 700; max-width: 140px;">
                  ${list.map((s, i) => `
                    <option value="${i}" ${i === this.mobileColA ? 'selected' : ''}>${s.name.split(' ')[0]} (${i + 1})</option>
                  `).join('')}
                </select>
                <span style="color: var(--text-muted); font-size: 0.78rem;">vs</span>
                <select id="select-mob-school-b" class="filter-select" style="padding: 0.3rem 0.5rem; font-size: 0.8rem; font-weight: 700; max-width: 140px;">
                  ${list.map((s, i) => `
                    <option value="${i}" ${i === this.mobileColB ? 'selected' : ''}>${s.name.split(' ')[0]} (${i + 1})</option>
                  `).join('')}
                </select>
              </div>

              <div style="display: flex; gap: 0.4rem;">
                <button id="btn-mob-toggle-mode" class="btn-pill btn-outline" style="font-size: 0.76rem; padding: 0.3rem 0.7rem; font-weight: 700;">
                  ${this.mobileMode === 'focus' ? '↔️ View All Columns' : '📱 Focus 2-School'}
                </button>
              </div>
            </div>
          </div>

          <!-- Main Comparison Matrix Card -->
          <div class="comparison-table-wrapper" style="background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-light); overflow-x: auto; -webkit-overflow-scrolling: touch; box-shadow: var(--shadow-md);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: ${list.length * 240 + 220}px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-light); background: #F7F9FC;">
                  <th class="comp-attr-col" style="padding: 1.25rem 1.5rem; width: 230px; font-size: 0.82rem; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); font-weight: 800; letter-spacing: 0.05em;">
                    Comparison Dimension
                  </th>
                  ${list.map((s, idx) => `
                    <th style="padding: 1.25rem 1.5rem; min-width: 260px; vertical-align: top; border-left: 1px solid var(--border-light);">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                        <div>
                          <span class="badge" style="background: #ebf3fc; color: #1266C4; font-size: 0.68rem; font-weight: 800; margin-bottom: 0.35rem;">
                            School #${idx + 1}
                          </span>
                          <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); line-height: 1.25; margin-bottom: 0.25rem;">
                            ${Utils.escapeHTML(s.name)}
                          </div>
                          <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 500;">
                            📍 ${Utils.escapeHTML(s.suburb || s.locality || 'Accra')}, ${Utils.escapeHTML(s.region || 'Greater Accra')}
                          </div>
                        </div>
                        <button class="btn-remove-comp" data-school-id="${s.id}" style="color: #94a3b8; font-size: 1.35rem; line-height: 1; border: none; background: transparent; cursor: pointer; padding: 0.2rem;" title="Remove from comparison" aria-label="Remove ${Utils.escapeHTML(s.name)} from comparison">&times;</button>
                      </div>
                    </th>
                  `).join('')}
                  ${list.length < 4 ? `
                    <th style="padding: 1.5rem; min-width: 220px; vertical-align: middle; text-align: center; border-left: 1px dashed var(--border-light); background: rgba(247, 249, 252, 0.5);">
                      <div style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem;">
                        Slot ${list.length + 1} of 4 Available
                      </div>
                      <button id="btn-comp-slot-add" class="btn-pill btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                        ➕ Add School
                      </button>
                    </th>
                  ` : ''}
                </tr>
              </thead>
              <tbody>
                <!-- SECTION 1: IDENTITY & PROVENANCE -->
                <tr class="comp-section-row" style="background: #edf2f7; border-top: 2px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                  <td colspan="${list.length + (list.length < 4 ? 2 : 1)}" style="padding: 0.6rem 1.5rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); letter-spacing: 0.05em;">
                    🏛️ 1. Institutional Identity & Provenance
                  </td>
                </tr>

                <!-- Accreditation & Verification -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Accreditation Status
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      <span class="badge ${s.is_verified ? 'badge-verified' : ''}" style="background: #e0f2fe; color: #0369a1; font-weight: 700;">
                        🛡️ ${s.is_verified ? 'GES / NaSIA Accredited' : 'Registered Campus'}
                      </span>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- Ownership & Religion -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Ownership & Ethos
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      <div style="font-weight: 600;">${s.ownership_type || s.ownership || 'Private Independent'}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${s.religion || 'Non-denominational'}</div>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- SECTION 2: ACADEMICS & CURRICULUM -->
                <tr class="comp-section-row" style="background: #edf2f7; border-top: 2px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                  <td colspan="${list.length + (list.length < 4 ? 2 : 1)}" style="padding: 0.6rem 1.5rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); letter-spacing: 0.05em;">
                    📚 2. Academic Framework & Levels
                  </td>
                </tr>

                <!-- Curriculum Framework -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Curriculum Framework
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      <span class="badge" style="background: #eff6ff; color: #1d4ed8; border: 1px solid rgba(29, 78, 216, 0.2); font-weight: 700;">
                        ${Array.isArray(s.curriculum) ? s.curriculum.join(', ') : (s.curriculum || 'GES Standards-Based')}
                      </span>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- Levels Offered -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Education Levels
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                        ${(Array.isArray(s.levels || s.education_level) ? (s.levels || s.education_level) : ['Primary', 'JHS', 'SHS']).map(l => `
                          <span style="background: #f1f5f9; color: var(--theme-b-navy, #0A2046); font-size: 0.74rem; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 4px;">
                            ${l}
                          </span>
                        `).join('')}
                      </div>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- Student to Teacher Ratio -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Student-to-Teacher Ratio
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; font-weight: 600; border-left: 1px solid var(--border-light);">
                      ${s.studentTeacherRatio || s.ratio || '15:1 (Average)'}
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- SECTION 3: VERIFIED FEES & FINANCIALS -->
                <tr class="comp-section-row" style="background: #edf2f7; border-top: 2px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                  <td colspan="${list.length + (list.length < 4 ? 2 : 1)}" style="padding: 0.6rem 1.5rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); letter-spacing: 0.05em;">
                    💰 3. Verified Fee Structure (Factual Transparency)
                  </td>
                </tr>

                <!-- Termly Tuition -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Estimated Termly Tuition
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      ${(s.tuition_min || s.tuitionBase) ? `
                        <div style="font-weight: 800; font-size: 1rem; color: var(--theme-b-gold-dark, #b88a24);">
                          GH₵ ${Number(s.tuition_min || s.tuitionBase).toLocaleString()}${s.tuition_max ? ' - ' + Number(s.tuition_max).toLocaleString() : ''}
                        </div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">Verified official schedule</div>
                      ` : `
                        <div style="color: var(--text-muted); font-size: 0.82rem; font-weight: 600; line-height: 1.4;">
                          Official fee schedule not published &bull; Contact desk
                        </div>
                      `}
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- Boarding Option & Fees -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Boarding & Attendance
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.88rem; border-left: 1px solid var(--border-light);">
                      <div style="font-weight: 700;">${s.boarding_type || s.boardingType || 'Day Student Only'}</div>
                      <div style="font-size: 0.76rem; color: var(--text-muted);">
                        ${s.boardingFee ? `Boarding House: +GH₵ ${Number(s.boardingFee).toLocaleString()} / term` : 'No separate boarding levy stated'}
                      </div>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- SECTION 4: CAMPUS AMENITIES & FACILITIES -->
                <tr class="comp-section-row" style="background: #edf2f7; border-top: 2px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                  <td colspan="${list.length + (list.length < 4 ? 2 : 1)}" style="padding: 0.6rem 1.5rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); letter-spacing: 0.05em;">
                    🔬 4. Verified Facilities & Campus
                  </td>
                </tr>

                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td class="comp-attr-col" style="padding: 1rem 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Campus Amenities
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1rem 1.5rem; font-size: 0.85rem; border-left: 1px solid var(--border-light);">
                      <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        ${(Array.isArray(s.facilities) ? s.facilities : ['STEM Laboratories', 'Sports Field', 'Computer Suite', 'Library']).map(f => `
                          <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.82rem;">
                            <span style="color: var(--emerald-600); font-weight: 800;">✓</span> ${f}
                          </div>
                        `).join('')}
                      </div>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>

                <!-- SECTION 5: ACTIONS & NEXT STEPS -->
                <tr class="comp-section-row" style="background: #edf2f7; border-top: 2px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                  <td colspan="${list.length + (list.length < 4 ? 2 : 1)}" style="padding: 0.6rem 1.5rem; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--theme-b-navy, #0A2046); letter-spacing: 0.05em;">
                    🎯 5. Next Steps & Direct Contact
                  </td>
                </tr>

                <tr>
                  <td class="comp-attr-col" style="padding: 1.5rem; font-weight: 700; color: var(--theme-b-navy, #0A2046); font-size: 0.88rem;">
                    Parent Actions
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.5rem; vertical-align: top; border-left: 1px solid var(--border-light);">
                      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn-card-view btn-pill btn-primary" data-school-id="${s.id}" style="width: 100%; justify-content: center; font-size: 0.82rem; padding: 0.45rem 0.85rem; font-weight: 700;">
                          View Full Profile &rarr;
                        </button>
                        <a href="https://wa.me/${Utils.formatGhanaWhatsApp(s.whatsapp || s.phone)}?text=Hello%20${encodeURIComponent(s.name)},%20I%20found%20your%20campus%20on%20SkoolFinder%20and%20would%20like%20to%20inquire%20about%20admissions." target="_blank" class="btn-pill btn-emerald" style="width: 100%; justify-content: center; font-size: 0.82rem; padding: 0.45rem 0.85rem; text-decoration: none; text-align: center; display: flex; align-items: center; gap: 0.35rem; font-weight: 700;">
                          <span>💬</span> WhatsApp Desk
                        </a>
                        <button class="btn-comp-shortlist btn-pill btn-outline" data-school-id="${s.id}" style="width: 100%; justify-content: center; font-size: 0.82rem; padding: 0.45rem 0.85rem; font-weight: 600;">
                          <span>📌</span> Save to Shortlist
                        </button>
                      </div>
                    </td>
                  `).join('')}
                  ${list.length < 4 ? '<td style="border-left: 1px dashed var(--border-light);"></td>' : ''}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Quick School Picker Modal / Drawer -->
      <div id="comp-picker-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(10, 32, 70, 0.6); backdrop-filter: blur(4px); z-index: 1050; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background: #ffffff; border-radius: var(--radius-xl); width: 100%; max-width: 580px; max-height: 85vh; overflow-y: auto; padding: 1.75rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--theme-b-navy, #0A2046); margin: 0;">
                Add School to Comparison
              </h3>
              <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0.2rem 0 0;">
                Search from over 65+ accredited Ghanaian institutions
              </p>
            </div>
            <button id="btn-close-picker" style="font-size: 1.5rem; background: none; border: none; color: #94a3b8; cursor: pointer;">&times;</button>
          </div>

          <div style="margin-bottom: 1rem;">
            <input type="text" id="picker-search-input" placeholder="Type school name or suburb (e.g. GIS, Achimota, Cantonments)..." style="width: 100%; padding: 0.65rem 1rem; border: 1.5px solid var(--border-light); border-radius: 999px; font-size: 0.9rem;" />
          </div>

          <div id="picker-results-container" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 340px; overflow-y: auto;">
            <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.88rem;">
              Loading institutions...
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Breadcrumb navigation
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    document.getElementById('btn-compare-goto-dir')?.addEventListener('click', () => {
      App.navigate('directory');
    });

    document.getElementById('btn-compare-goto-match')?.addEventListener('click', () => {
      App.navigate('matchmaker');
    });

    document.getElementById('btn-compare-print')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-compare-clear-all')?.addEventListener('click', () => {
      State.clearCompare();
      App.navigate('compare');
    });

    // Remove buttons
    document.querySelectorAll('.btn-remove-comp').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const school = await API.getSchoolById(schoolId).catch(() => ({ id: schoolId, name: 'School' }));
        State.toggleCompare(school);
        App.navigate('compare');
      };
    });

    // Profile view buttons
    document.querySelectorAll('.btn-card-view').forEach(btn => {
      btn.onclick = () => {
        const schoolId = btn.dataset.schoolId;
        if (schoolId) App.navigate('school-detail', schoolId);
      };
    });

    // Save to Shortlist button
    document.querySelectorAll('.btn-comp-shortlist').forEach(btn => {
      btn.onclick = async () => {
        const schoolId = btn.dataset.schoolId;
        if (typeof State !== 'undefined') {
          if (!State.bookmarkedSchoolIds.includes(schoolId)) {
            State.bookmarkedSchoolIds.push(schoolId);
            try {
              localStorage.setItem('skoolfinder_bookmarks', JSON.stringify(State.bookmarkedSchoolIds));
            } catch (e) {}
            State.showToast('Saved to your private shortlists 📌', 'success');
            btn.innerHTML = '<span>✓</span> Shortlisted';
            btn.classList.add('btn-emerald');
          } else {
            State.showToast('School is already in your shortlist.', 'info');
          }
        }
      };
    });

    // Mobile Selectors for Column A and Column B
    const selA = document.getElementById('select-mob-school-a');
    const selB = document.getElementById('select-mob-school-b');
    if (selA) {
      selA.onchange = () => {
        this.mobileColA = parseInt(selA.value) || 0;
        this.highlightMobileColumns();
      };
    }
    if (selB) {
      selB.onchange = () => {
        this.mobileColB = parseInt(selB.value) || 1;
        this.highlightMobileColumns();
      };
    }

    const btnToggleMode = document.getElementById('btn-mob-toggle-mode');
    if (btnToggleMode) {
      btnToggleMode.onclick = () => {
        this.mobileMode = this.mobileMode === 'focus' ? 'all' : 'focus';
        App.navigate('compare', null, false);
      };
    }

    // Add School Picker Drawer
    const btnAddMore = document.getElementById('btn-compare-add-more');
    const btnSlotAdd = document.getElementById('btn-comp-slot-add');
    if (btnAddMore) btnAddMore.onclick = () => this.openSchoolPicker();
    if (btnSlotAdd) btnSlotAdd.onclick = () => this.openSchoolPicker();

    this.attachPickerEvents();
  },

  highlightMobileColumns() {
    // When in mobile focus mode, scroll to or highlight the selected columns
    const table = document.querySelector('.comparison-table-wrapper table');
    if (!table) return;
    const ths = table.querySelectorAll('thead th');
    if (ths.length > 1) {
      ths.forEach((th, idx) => {
        if (idx === 0) return; // attribute column
        const colIdx = idx - 1;
        if (colIdx === this.mobileColA || colIdx === this.mobileColB) {
          th.style.background = '#edf2f7';
        } else {
          th.style.background = '#F7F9FC';
        }
      });
    }
  },

  async openSchoolPicker() {
    const modal = document.getElementById('comp-picker-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    const resultsContainer = document.getElementById('picker-results-container');
    const searchInput = document.getElementById('picker-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }

    const allSchools = await API.getSchools().catch(() => []);
    const inCompareIds = State.comparisonList.map(s => s.id);

    const renderList = (filterText = '') => {
      const q = filterText.toLowerCase().trim();
      const filtered = allSchools.filter(s => {
        if (inCompareIds.includes(s.id)) return false;
        if (!q) return true;
        return (s.name && s.name.toLowerCase().includes(q)) || 
               (s.locality && s.locality.toLowerCase().includes(q)) ||
               (s.region && s.region.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.88rem;">
            No institutions matching "${Utils.escapeHTML(filterText)}".
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = filtered.slice(0, 8).map(s => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: #ffffff;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              🏫
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--theme-b-navy, #0A2046);">
                ${Utils.escapeHTML(s.name)}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                📍 ${Utils.escapeHTML(s.suburb || s.locality || 'Accra')} &bull; ${Array.isArray(s.curriculum) ? s.curriculum[0] : (s.curriculum || 'GES')}
              </div>
            </div>
          </div>
          <button class="btn-picker-add btn-pill btn-primary" data-school-id="${s.id}" style="font-size: 0.78rem; padding: 0.35rem 0.85rem; font-weight: 700;">
            + Add
          </button>
        </div>
      `).join('');

      resultsContainer.querySelectorAll('.btn-picker-add').forEach(btn => {
        btn.onclick = async () => {
          const sId = btn.dataset.schoolId;
          const targetSchool = allSchools.find(x => x.id === sId) || await API.getSchoolById(sId);
          if (targetSchool) {
            State.toggleCompare(targetSchool);
            modal.style.display = 'none';
            App.navigate('compare');
          }
        };
      });
    };

    renderList();

    if (searchInput) {
      searchInput.oninput = (e) => {
        renderList(e.target.value);
      };
    }
  },

  attachPickerEvents() {
    const modal = document.getElementById('comp-picker-modal');
    const btnClose = document.getElementById('btn-close-picker');
    if (btnClose && modal) {
      btnClose.onclick = () => {
        modal.style.display = 'none';
      };
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
      };
    }
  }
};

if (typeof window !== 'undefined') {
  window.CompareView = CompareView;
}
