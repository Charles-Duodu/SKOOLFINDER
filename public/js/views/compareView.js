/**
 * SchoolDirect Ghana - Comparison View (Side-by-Side Matrix)
 */
const CompareView = {
  render() {
    const list = State.comparisonList;

    if (list.length === 0) {
      return `
        <section style="padding: 4rem 0; min-height: 75vh; background: var(--bg-main);">
          <div class="container" style="max-width: 600px; text-align: center;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚖️</div>
            <h2 style="font-family: var(--font-heading); font-size: 2rem; color: var(--primary-900); margin-bottom: 0.75rem;">
              No Schools Selected to Compare
            </h2>
            <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 2rem;">
              Browse the directory and click the ⚖️ button on any school card to compare curricula, fees, and amenities side-by-side.
            </p>
            <button id="btn-compare-goto-dir" class="btn-pill btn-primary" style="padding: 0.75rem 1.75rem;">
              Browse School Directory &rarr;
            </button>
          </div>
        </section>
      `;
    }

    return `
      <section style="padding: 3rem 0 5rem; background: var(--bg-main);">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / Side-by-Side School Comparison
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--primary-900);">
                Comparing ${list.length} School${list.length > 1 ? 's' : ''}
              </h1>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button id="btn-compare-add-more" class="btn-pill btn-outline">
                + Add Another School
              </button>
              <button id="btn-compare-clear-all" class="btn-pill btn-outline" style="color: var(--rose-600); border-color: rgba(225, 29, 72, 0.3);">
                Clear Comparison
              </button>
            </div>
          </div>

          <!-- Comparison Table Card -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); overflow-x: auto; box-shadow: var(--shadow-md);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 650px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-light); background: var(--bg-main);">
                  <th style="padding: 1.5rem; width: 220px; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
                    School Attribute
                  </th>
                  ${list.map(s => `
                    <th style="padding: 1.5rem; min-width: 250px; vertical-align: top;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                        <div>
                          <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.25rem;">
                            ${s.name}
                          </div>
                          <div style="font-size: 0.85rem; color: var(--text-muted);">
                            📍 ${s.suburb}, ${s.region}
                          </div>
                        </div>
                        <button class="btn-remove-comp" data-school-id="${s.id}" style="color: var(--text-light); font-size: 1.25rem;" title="Remove from comparison">&times;</button>
                      </div>
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <!-- Curriculum -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Curriculum Framework
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.92rem;">
                      <span class="badge badge-cambridge">${s.curriculum.join(', ')}</span>
                    </td>
                  `).join('')}
                </tr>

                <!-- Levels Offered -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Levels Offered
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.92rem;">
                      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                        ${s.levels.map(l => `<span class="level-tag">${l}</span>`).join('')}
                      </div>
                    </td>
                  `).join('')}
                </tr>

                <!-- Fee Range -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Estimated Term Fees
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.95rem; font-weight: 700; color: var(--gold-600);">
                      ${s.feeBand}
                    </td>
                  `).join('')}
                </tr>

                <!-- Attendance / Boarding -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Attendance Type
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.92rem; font-weight: 600;">
                      ${s.boardingType}
                    </td>
                  `).join('')}
                </tr>

                <!-- Student-Teacher Ratio -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Student-to-Teacher Ratio
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.92rem;">
                      ${s.studentTeacherRatio || '15:1'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Year Established -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Year Established
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.92rem;">
                      ${s.established || 'Established'}
                    </td>
                  `).join('')}
                </tr>

                <!-- Facilities -->
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1.25rem; font-weight: 700; color: var(--primary-900); font-size: 0.9rem; background: rgba(248, 250, 252, 0.5);">
                    Key Amenities
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.25rem; font-size: 0.85rem; vertical-align: top;">
                      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.35rem;">
                        ${s.facilities.map(f => `<li style="color: var(--text-muted);"><span style="color: var(--emerald-500); font-weight: 800;">✓</span> ${f}</li>`).join('')}
                      </ul>
                    </td>
                  `).join('')}
                </tr>

                <!-- Direct Actions -->
                <tr>
                  <td style="padding: 1.5rem; font-weight: 700; color: var(--primary-900); background: rgba(248, 250, 252, 0.5);">
                    Connect
                  </td>
                  ${list.map(s => `
                    <td style="padding: 1.5rem;">
                      <button class="btn-card-view" data-school-id="${s.id}" style="width: 100%; margin-bottom: 0.5rem;">
                        View Full Profile
                      </button>
                      <button class="btn-card-wa btn-quick-wa" data-school-id="${s.id}" data-wa="${s.whatsapp}" style="width: 100%; justify-content: center;">
                        💬 Chat Admissions
                      </button>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents() {
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    document.getElementById('btn-compare-goto-dir')?.addEventListener('click', () => {
      App.navigate('directory');
    });

    document.getElementById('btn-compare-add-more')?.addEventListener('click', () => {
      App.navigate('directory');
    });

    document.getElementById('btn-compare-clear-all')?.addEventListener('click', () => {
      State.clearCompare();
      App.navigate('compare');
    });

    document.querySelectorAll('.btn-remove-comp').forEach(btn => {
      btn.onclick = async () => {
        const schoolId = btn.dataset.schoolId;
        const school = await API.getSchoolById(schoolId);
        State.toggleCompare(school);
        App.navigate('compare');
      };
    });

    // Profile and WhatsApp buttons
    HomeView.attachEvents();
  }
};
