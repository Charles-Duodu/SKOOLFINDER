/**
 * SKOOLFINDER GHANA - MY PARENTS DASHBOARD (STANDALONE PREVIEW)
 * 5-Item Hub Navigation Architecture
 */

(() => {
  'use strict';

  // Sample State for Interactive Demo
  const state = {
    activeHub: 'dashboard',
    savedSchools: [
      {
        id: 'sch-gis',
        name: 'Ghana International School (GIS)',
        suburb: 'Cantonments',
        level: 'Primary · JHS · SHS',
        curriculum: 'Cambridge (CIE)',
        status: 'Offer Extended',
        tuition: 'GH₵ 22,000 / Term',
        img: '/preview-v3/assets/school-campus.jpg'
      },
      {
        id: 'sch-sos',
        name: 'SOS-Hermann Gmeiner International College',
        suburb: 'Tema Community 6',
        level: 'JHS · SHS',
        curriculum: 'International Baccalaureate (IB)',
        status: 'Campus Visited',
        tuition: 'GH₵ 28,000 / Term',
        img: '/preview-v3/assets/school-stem.jpg'
      },
      {
        id: 'sch-achimota',
        name: 'Achimota Basic School',
        suburb: 'Achimota',
        level: 'Primary · JHS',
        curriculum: 'GES (NaCCA)',
        status: 'Tour Confirmed',
        tuition: 'GH₵ 2,400 / Term',
        img: '/preview-v3/assets/school-early.jpg'
      }
    ],
    allDiscoverySchools: [
      {
        id: 'sch-gis',
        name: 'Ghana International School (GIS)',
        suburb: 'Cantonments',
        level: 'Primary · JHS · SHS',
        curriculum: 'Cambridge (CIE)',
        status: 'Offer Extended',
        tuition: 'GH₵ 22,000 / Term',
        img: '/preview-v3/assets/school-campus.jpg'
      },
      {
        id: 'sch-sos',
        name: 'SOS-Hermann Gmeiner International College',
        suburb: 'Tema',
        level: 'JHS · SHS',
        curriculum: 'International Baccalaureate (IB)',
        status: 'Campus Visited',
        tuition: 'GH₵ 28,000 / Term',
        img: '/preview-v3/assets/school-stem.jpg'
      },
      {
        id: 'sch-achimota',
        name: 'Achimota Basic School',
        suburb: 'Achimota',
        level: 'Primary · JHS',
        curriculum: 'GES (NaCCA)',
        status: 'Tour Confirmed',
        tuition: 'GH₵ 2,400 / Term',
        img: '/preview-v3/assets/school-early.jpg'
      },
      {
        id: 'sch-roman-ridge',
        name: 'The Roman Ridge School',
        suburb: 'Airport',
        level: 'Primary · JHS · SHS',
        curriculum: 'Cambridge International',
        status: 'Curriculum Matched',
        tuition: 'GH₵ 19,500 / Term',
        img: '/preview-v3/assets/school-campus.jpg'
      },
      {
        id: 'sch-lincoln',
        name: 'Lincoln Community School',
        suburb: 'East Legon',
        level: 'Preschool · Primary · JHS · SHS',
        curriculum: 'International Baccalaureate (IB)',
        status: 'Open Day Available',
        tuition: 'GH₵ 45,000 / Term',
        img: '/preview-v3/assets/school-stem.jpg'
      },
      {
        id: 'sch-morning-star',
        name: 'Morning Star School',
        suburb: 'Cantonments',
        level: 'Preschool · Primary · JHS',
        curriculum: 'GES &amp; Cambridge Foundation',
        status: 'Application Open',
        tuition: 'GH₵ 8,500 / Term',
        img: '/preview-v3/assets/school-early.jpg'
      }
    ],
    enquiries: [
      {
        id: 'enq-01',
        school: 'Ghana International School',
        type: 'Formal Admission Application',
        ref: 'GIS/ADM/2026/OFF-0842',
        child: 'Kwame Mensah (Grade 4)',
        status: 'Offer Extended 🎉',
        date: '10 Nov 2026',
        badgeColor: '#059669',
        actionLabel: '📄 View Formal Offer Letter'
      },
      {
        id: 'enq-02',
        school: 'Achimota Basic School',
        type: 'Campus Tour Booking',
        ref: 'TOUR-ACHI-2026-11',
        child: 'Kwame Mensah',
        status: 'Tour Confirmed (15 Nov at 10:00 AM)',
        date: '08 Nov 2026',
        badgeColor: '#1d4ed8',
        actionLabel: '📅 View Tour Itinerary'
      },
      {
        id: 'enq-03',
        school: 'SOS-Hermann Gmeiner College',
        type: 'Admissions Desk WhatsApp Inquiry',
        ref: 'WA-SOS-9821',
        child: 'General Intake 2026',
        status: 'Desk Replied (Vouchers open)',
        date: '05 Nov 2026',
        badgeColor: '#d97706',
        actionLabel: '💬 View WhatsApp Thread'
      }
    ],
    wards: [
      {
        id: 'ward-01',
        name: 'Kwame Mensah',
        age: 9,
        dob: '14 May 2017',
        grade: 'Primary Class 4',
        applyingGrade: 'Class 4 (Key Stage 2)',
        preferredCurriculum: 'Cambridge Primary',
        interests: ['STEM Robotics', 'Competitive Swimming', 'Chess Club'],
        studentId: 'SF-GH-2026-KM842'
      },
      {
        id: 'ward-02',
        name: 'Ama Mensah',
        age: 5,
        dob: '22 Oct 2021',
        grade: 'Kindergarten 2 (KG 2)',
        applyingGrade: 'Primary Class 1',
        preferredCurriculum: 'Montessori / GES',
        interests: ['Early Literacy', 'Creative Arts', 'Music'],
        studentId: 'SF-GH-2026-AM109'
      }
    ]
  };

  // Helper to render school card
  const renderSchoolCard = (s) => `
    <article class="preview-school-card">
      <div class="preview-school-img">
        <img src="${s.img}" alt="${s.name}" style="height: 100%; object-fit: cover;">
        <span style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.95); padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; color: var(--navy);">NaSIA Verified</span>
        <span style="position: absolute; top: 10px; right: 10px; background: rgba(6,22,46,0.85); color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">${s.suburb}</span>
      </div>
      <div class="preview-school-body">
        <h4>${s.name}</h4>
        <div class="preview-school-loc">📍 ${s.suburb}, Greater Accra</div>
        <div class="preview-school-tags">
          <span>${s.level}</span>
          <span>${s.curriculum}</span>
        </div>
        <div style="font-size: 12px; font-weight: 800; color: var(--navy); margin-top: auto; padding-top: 8px;">
          ${s.tuition}
        </div>
      </div>
      <div class="preview-school-actions">
        <button class="btn-pill btn-primary" style="flex: 1; padding: 7px 10px; font-size: 11.5px;" onclick="alert('Navigating to full verified profile for ${s.name}')">View Profile ↗</button>
        <button class="btn-pill btn-outline" style="padding: 7px 12px; font-size: 11.5px;" onclick="alert('${s.name} added to comparison shortlist!')">↔ Compare</button>
      </div>
    </article>
  `;

  // Workspace Renderers
  const workspaces = {
    dashboard: () => `
      <div class="workspace-header">
        <div class="workspace-title-group">
          <div class="eyebrow">COMMAND CENTRE OVERVIEW</div>
          <h2 class="workspace-title">Welcome Back, Dr. Elizabeth Mensah</h2>
          <p class="workspace-desc">Here is the real-time status of your family's 2026/2027 admissions journey in Greater Accra.</p>
        </div>
        <button class="btn-pill btn-primary" onclick="window.switchHub('find')">
          <span>🔍</span> Browse More Schools
        </button>
      </div>

      <!-- Quick Metrics Row -->
      <div class="stat-cards-row">
        <div class="stat-card">
          <span>Admissions Offers</span>
          <strong>1 Offer</strong>
          <small>Ghana International School</small>
        </div>
        <div class="stat-card">
          <span>Upcoming Tour</span>
          <strong>15 Nov</strong>
          <small>Achimota Basic School</small>
        </div>
        <div class="stat-card">
          <span>Saved Shortlist</span>
          <strong>${state.savedSchools.length} Schools</strong>
          <small>Greater Accra Pilot</small>
        </div>
        <div class="stat-card">
          <span>Linked Wards</span>
          <strong>${state.wards.length} Children</strong>
          <small>Kwame &amp; Ama</small>
        </div>
      </div>

      <!-- High Priority Admissions Offer Card -->
      <div class="offer-banner">
        <div>
          <span class="offer-badge">ACTION REQUIRED · PROVISIONAL OFFER</span>
          <h3>Provisional Admission Offer Issued: Ghana International School</h3>
          <p>Official Offer Ref: GIS/ADM/2026/OFF-0842 for <strong>Kwame Mensah</strong> (Primary Class 4). Acceptance deadline: 30 November 2026.</p>
        </div>
        <div style="display: flex; gap: 10px; flex-shrink: 0;">
          <button class="btn-pill btn-gold" onclick="window.openModal('offer')">
            📄 View Formal Offer Letter
          </button>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div style="background: #f8fafc; border: 1px solid var(--line); border-radius: 16px; padding: 22px 24px;">
        <h4 style="font-size: 15px; font-weight: 800; color: var(--navy); margin-bottom: 14px;">Recent Admissions Milestones &amp; Hubtel SMS Alerts</h4>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #ffffff; border-radius: 10px; border: 1px solid var(--line);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">🎉</span>
              <div>
                <strong style="color: var(--navy); font-size: 13.5px;">Offer Letter Ref: GIS/ADM/2026/OFF-0842 Issued</strong>
                <div style="font-size: 12px; color: var(--muted);">Dispatched via Hubtel SMS to +233 24 111 2222 · Today at 09:15 AM</div>
              </div>
            </div>
            <button class="btn-pill btn-outline" style="padding: 6px 14px; font-size: 12px;" onclick="window.openModal('offer')">Inspect Offer</button>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #ffffff; border-radius: 10px; border: 1px solid var(--line);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">🏫</span>
              <div>
                <strong style="color: var(--navy); font-size: 13.5px;">Campus Walkthrough Confirmed: Achimota Basic School</strong>
                <div style="font-size: 12px; color: var(--muted);">Scheduled with Admissions Registrar for 15 Nov at 10:00 AM · Yesterday at 04:30 PM</div>
              </div>
            </div>
            <button class="btn-pill btn-outline" style="padding: 6px 14px; font-size: 12px;" onclick="window.switchHub('enquiries')">View Itinerary</button>
          </div>
        </div>
      </div>
    `,

    find: () => `
      <div class="workspace-header" style="align-items: flex-start; justify-content: space-between;">
        <div class="workspace-title-group">
          <div class="discovery-eyebrow">SCHOOL DISCOVERY</div>
          <h2 class="discovery-title">Find a school <em>that fits.</em></h2>
          <p class="workspace-desc" style="margin-top: 6px; color: #475569; font-size: 14.5px;">Use simple filters to explore illustrative school listings. Live search will reuse SkoolFinder's existing public directory.</p>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 4px; flex-shrink: 0;">
          <button class="btn-pill btn-outline" onclick="window.switchHub('saved')">
            View My Shortlist (${state.savedSchools.length})
          </button>
        </div>
      </div>

      <!-- 2x2 Discovery Filter Card (Pixel-Matched to Image 1) -->
      <div class="discovery-filter-card">
        <form onsubmit="event.preventDefault(); window.handleDiscoverySearch();" class="discovery-filter-grid">
          <div class="filter-field">
            <label class="filter-label" for="filter-school-loc">School or location</label>
            <input id="filter-school-loc" class="filter-control" type="text" placeholder="Search schools or areas" oninput="window.handleDiscoverySearch()">
          </div>

          <div class="filter-field">
            <label class="filter-label" for="filter-school-level">School level</label>
            <div class="filter-select-wrap">
              <select id="filter-school-level" class="filter-control" onchange="window.handleDiscoverySearch()">
                <option value="">All levels</option>
                <option value="Primary">Primary School</option>
                <option value="JHS">Junior High (JHS)</option>
                <option value="SHS">Senior High (SHS)</option>
                <option value="Preschool">Preschool &amp; Crèche</option>
              </select>
              <svg class="select-chevron" width="11" height="7" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="filter-field">
            <label class="filter-label" for="filter-area">Area</label>
            <div class="filter-select-wrap">
              <select id="filter-area" class="filter-control field-highlighted" onchange="window.handleDiscoverySearch()">
                <option value="">All areas</option>
                <option value="Cantonments">Cantonments</option>
                <option value="Airport">Airport Residential Area</option>
                <option value="East Legon">East Legon</option>
                <option value="Ridge">Ridge</option>
                <option value="Labone">Labone</option>
                <option value="Achimota">Achimota</option>
                <option value="Tema">Tema</option>
              </select>
              <svg class="select-chevron" width="11" height="7" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L6 6.5L10.5 1.5" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="filter-field">
            <button type="submit" class="btn-search-discovery">
              <span>Search</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Live Search Results Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div style="font-size: 13.5px; font-weight: 750; color: #334155;" id="discovery-results-count">
          Showing ${state.allDiscoverySchools.length} Featured Accredited Schools
        </div>
        <div style="font-size: 12px; color: #64748b; font-weight: 600;">
          NaSIA Licensing &bull; Fee Transparency Verified
        </div>
      </div>

      <!-- Demonstration Schools Grid -->
      <div class="preview-schools-grid" id="discovery-schools-grid">
        ${state.allDiscoverySchools.map(renderSchoolCard).join('')}
      </div>
    `,

    saved: () => `
      <div class="workspace-header">
        <div class="workspace-title-group">
          <div class="eyebrow">YOUR SHORTLIST &amp; COMPARISONS</div>
          <h2 class="workspace-title">Saved Schools &amp; 5-Stage Decision Board</h2>
          <p class="workspace-desc">Organise target institutions across Reach, Target, and Safety tiers with side-by-side comparison tables.</p>
        </div>
        <button class="btn-pill btn-primary" onclick="window.switchHub('find')">
          <span>➕</span> Add More Schools
        </button>
      </div>

      <!-- 5-Stage Board Pipeline Summary -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 28px;">
        <div style="background: #f8fafc; border: 1px solid var(--line); border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #64748b;">1. RESEARCH</div>
          <strong style="font-size: 18px; color: var(--navy);">3</strong>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #1e40af;">2. VISITED</div>
          <strong style="font-size: 18px; color: #1e40af;">1</strong>
        </div>
        <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #854d0e;">3. APPLIED</div>
          <strong style="font-size: 18px; color: #854d0e;">2</strong>
        </div>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #065f46;">4. OFFER EXTENDED</div>
          <strong style="font-size: 18px; color: #065f46;">1</strong>
        </div>
        <div style="background: #fdf4ff; border: 1px solid #f5d0fe; border-radius: 10px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #86198f;">5. ENROLLED</div>
          <strong style="font-size: 18px; color: #86198f;">0</strong>
        </div>
      </div>

      <!-- Saved Schools List with Quick Actions -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${state.savedSchools.map(s => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #ffffff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="${s.img}" alt="${s.name}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">
              <div>
                <h4 style="font-size: 16px; font-weight: 800; color: var(--navy);">${s.name}</h4>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">📍 ${s.suburb} &bull; ${s.curriculum} &bull; <strong>${s.tuition}</strong></div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; background: #eff6ff; color: #1e40af;">
                ${s.status}
              </span>
              <button class="btn-pill btn-gold" style="padding: 7px 14px; font-size: 12px;" onclick="alert('Opening application record for ${s.name}')">View Dossier</button>
            </div>
          </div>
        `).join('')}
      </div>
    `,

    enquiries: () => `
      <div class="workspace-header">
        <div class="workspace-title-group">
          <div class="eyebrow">COMMUNICATIONS &amp; APPLICATIONS</div>
          <h2 class="workspace-title">My Enquiries, Applications &amp; Visits</h2>
          <p class="workspace-desc">Track real-time responses from admissions desks, voucher tokens, and scheduled walkthroughs.</p>
        </div>
        <button class="btn-pill btn-primary" onclick="window.switchHub('find')">
          <span>💬</span> New School Inquiry
        </button>
      </div>

      <!-- Enquiries & Application Table -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${state.enquiries.map(enq => `
          <div style="background: #ffffff; border: 1px solid var(--line); border-radius: 14px; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 18px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 11px; font-weight: 800; color: ${enq.badgeColor}; background: #f8fafc; border: 1px solid ${enq.badgeColor}40; padding: 2px 8px; border-radius: 4px;">
                  ${enq.status}
                </span>
                <span style="font-size: 11.5px; color: #64748b;">Ref: ${enq.ref} &bull; ${enq.date}</span>
              </div>
              <h4 style="font-size: 17px; font-weight: 800; color: var(--navy);">${enq.school}</h4>
              <div style="font-size: 12.5px; color: #475569; margin-top: 2px;">
                Target: <strong>${enq.child}</strong> &bull; Channel: ${enq.type}
              </div>
            </div>
            <div>
              <button class="btn-pill btn-primary" style="padding: 8px 16px; font-size: 12.5px;" onclick="${enq.id === 'enq-01' ? 'window.openModal(\'offer\')' : 'alert(\'Opening: ' + enq.actionLabel + '\')'}">
                ${enq.actionLabel}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `,

    account: () => `
      <div class="workspace-header">
        <div class="workspace-title-group">
          <div class="eyebrow">FAMILY &amp; SECURITY SETTINGS</div>
          <h2 class="workspace-title">My Account &amp; Linked Children</h2>
          <p class="workspace-desc">Manage guardian contacts, linked student profiles, Ghana Card verification, and statutory Act 843 privacy controls.</p>
        </div>
        <button class="btn-pill btn-gold" onclick="window.openModal('add-child')">
          <span>➕</span> Link Another Child
        </button>
      </div>

      <!-- Account Summary Banner -->
      <div style="background: #f8fafc; border: 1px solid var(--line); border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--navy); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800;">
            EM
          </div>
          <div>
            <h4 style="font-size: 17px; font-weight: 800; color: var(--navy);">Dr. Elizabeth Mensah</h4>
            <div style="font-size: 12.5px; color: #64748b;">
              Primary Guardian &bull; ✉️ elizabeth.mensah@gmail.com &bull; 📞 +233 24 111 2222
            </div>
          </div>
        </div>
        <div>
          <span style="font-size: 11px; font-weight: 800; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px;">
            🛡️ Act 843 DPA Verified
          </span>
        </div>
      </div>

      <!-- Linked Wards / Children Section -->
      <div style="margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--navy);">Linked Children / Wards (${state.wards.length})</h3>
          <span style="font-size: 12px; color: #64748b;">Syncs across school applications &amp; term reports</span>
        </div>

        <div class="children-grid">
          ${state.wards.map(w => `
            <div class="child-card">
              <div class="child-avatar">👶</div>
              <div class="child-details" style="flex: 1;">
                <h4>${w.name}</h4>
                <div class="child-meta">
                  Age ${w.age} (${w.dob}) &bull; Current: <strong>${w.grade}</strong>
                </div>
                <div style="font-size: 11.5px; color: #475569; margin-bottom: 8px;">
                  Applying for: <strong>${w.applyingGrade}</strong> (${w.preferredCurriculum})
                </div>
                <div class="child-chips">
                  ${w.interests.map(i => `<span>${i}</span>`).join('')}
                </div>
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                  <button class="btn-pill btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="window.openModal('digital-id')">🪪 Digital ID</button>
                  <button class="btn-pill btn-outline" style="padding: 5px 12px; font-size: 11px;" onclick="alert('Viewing academic report cards for ${w.name}')">📊 Report Cards</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Statutory Data Protection Act 843 Controls -->
      <div style="background: #f8fafc; border: 1px solid var(--line); border-radius: 14px; padding: 20px;">
        <h4 style="font-size: 14px; font-weight: 800; color: var(--navy); margin-bottom: 6px;">Statutory Data Protection (Act 843) &amp; Consent Preferences</h4>
        <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin-bottom: 12px;">
          In accordance with the Data Protection Act 2012 (Act 843) and Children's Act 1998 (Act 560), your family's personal identifiers are restricted strictly to authorized admissions registries and never shared for commercial advertising.
        </p>
        <div style="display: flex; gap: 10px;">
          <button class="btn-pill btn-outline" style="font-size: 12px;" onclick="alert('Data Protection preferences saved: Zero 3rd party marketing authorized.')">✓ Manage Consent Controls</button>
          <button class="btn-pill btn-outline" style="font-size: 12px;" onclick="alert('Downloading Data Protection compliance certificate PDF...')">📄 Download SAR Export</button>
        </div>
      </div>
    `
  };

  // Switch Hub Function (Sidebar Navigation matching Image 2 & 3)
  window.switchHub = (hubId) => {
    if (!workspaces[hubId]) return;
    state.activeHub = hubId;

    // Update active class on sidebar items
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const match = item.dataset.hub === hubId;
      item.classList.toggle('active', match);
      item.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Update topbar breadcrumb
    const titles = {
      dashboard: 'Dashboard Overview',
      find: 'Find Schools (Accredited Discovery)',
      saved: 'Saved Schools & Shortlist',
      enquiries: 'My Enquiries & Applications',
      account: 'Family & Account Settings'
    };
    const topbarLabel = document.getElementById('topbarCurrentSection');
    if (topbarLabel) {
      topbarLabel.textContent = titles[hubId] || 'Workspace';
    }

    // Render workspace into workspaceRoot
    const root = document.getElementById('workspaceRoot');
    if (root) {
      root.innerHTML = workspaces[hubId]();
    }
  };

  // Live Discovery Search Handler
  window.handleDiscoverySearch = () => {
    const q = (document.getElementById('filter-school-loc')?.value || '').toLowerCase().trim();
    const lvl = (document.getElementById('filter-school-level')?.value || '').toLowerCase().trim();
    const area = (document.getElementById('filter-area')?.value || '').toLowerCase().trim();

    const filtered = state.allDiscoverySchools.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.suburb.toLowerCase().includes(q) || s.curriculum.toLowerCase().includes(q);
      const matchLvl = !lvl || s.level.toLowerCase().includes(lvl);
      const matchArea = !area || s.suburb.toLowerCase().includes(area);
      return matchQ && matchLvl && matchArea;
    });

    const grid = document.getElementById('discovery-schools-grid');
    const count = document.getElementById('discovery-results-count');
    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: #ffffff; border: 1px dashed var(--line); border-radius: 14px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
            <strong style="color: var(--navy); font-size: 16px;">No exact school matches found for these filters</strong>
            <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">Try searching by suburb ("Cantonments", "East Legon") or reset to "All areas".</p>
            <button class="btn-pill btn-outline" style="margin-top: 14px;" onclick="document.getElementById('filter-school-loc').value=''; document.getElementById('filter-school-level').value=''; document.getElementById('filter-area').value=''; window.handleDiscoverySearch();">Reset Filters</button>
          </div>
        `;
      } else {
        grid.innerHTML = filtered.map(renderSchoolCard).join('');
      }
    }
    if (count) {
      count.textContent = `Showing ${filtered.length} of ${state.allDiscoverySchools.length} Featured Accredited Schools`;
    }
  };

  // Modal Handlers
  window.openModal = (type) => {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    if (type === 'offer') {
      title.innerText = 'Official Provisional Admission Offer Letter';
      body.innerHTML = `
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 24px; font-family: serif; color: #0A2046;">
          <div style="text-align: center; border-bottom: 2px solid #0A2046; padding-bottom: 14px; margin-bottom: 18px;">
            <h3 style="font-size: 20px; font-weight: 800; margin: 0;">GHANA INTERNATIONAL SCHOOL</h3>
            <div style="font-size: 12px; color: #475569;">P.O. Box 2856, Cantonments, Accra &bull; admissions@gis.edu.gh</div>
            <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: #059669;">FORMAL ADMISSIONS DESK DISPATCH</div>
          </div>
          <div style="font-size: 13px; line-height: 1.7;">
            <p><strong>Offer Letter Reference:</strong> GIS/ADM/2026/OFF-0842<br>
            <strong>Date:</strong> 10 November 2026<br>
            <strong>Candidate:</strong> Kwame Mensah<br>
            <strong>Parent / Guardian:</strong> Dr. Elizabeth Mensah</p>
            <p>Dear Dr. Mensah,</p>
            <p>We are pleased to inform you that following the entrance assessment and interview, <strong>Kwame Mensah</strong> has been offered provisional admission into <strong>Primary Class 4 (Key Stage 2)</strong> for the 2026/2027 Academic Year.</p>
            <p>To confirm this placement, please complete the acceptance protocol and submit the commitment voucher by <strong>30 November 2026</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; margin: 14px 0; font-family: sans-serif; font-size: 12px;">
              <strong>Termly Tuition:</strong> GH₵ 22,000.00<br>
              <strong>Curriculum:</strong> Cambridge Primary (Checkpoint Assessment)<br>
              <strong>Orientation Date:</strong> 04 September 2026
            </div>
          </div>
          <div style="text-align: right; margin-top: 20px; font-size: 12px;">
            <strong>Admissions Registrar</strong><br>
            Ghana International School
          </div>
        </div>
      `;
    } else if (type === 'digital-id') {
      title.innerText = 'SkoolFinder Ghana Digital Student ID';
      body.innerHTML = `
        <div style="background: linear-gradient(135deg, #06162E 0%, #0A224E 100%); color: #ffffff; border-radius: 16px; padding: 24px; border: 1.5px solid var(--gold); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 12px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: var(--gold); letter-spacing: 0.08em;">PRE-TERTIARY VERIFIED STUDENT ID</div>
              <h4 style="font-size: 16px; margin: 0; color: #ffffff;">SkoolFinder Ghana Passport</h4>
            </div>
            <span style="font-size: 12px; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">2026/2027</span>
          </div>
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="width: 70px; height: 70px; border-radius: 12px; background: #ffffff; color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 32px; border: 2px solid var(--gold);">
              👦
            </div>
            <div>
              <h3 style="margin: 0; font-size: 18px; color: #ffffff;">Kwame Mensah</h3>
              <div style="font-size: 12px; color: #cbd5e1; margin-top: 2px;">ID: <strong>SF-GH-2026-KM842</strong></div>
              <div style="font-size: 11.5px; color: var(--gold); margin-top: 2px;">Class 4 &bull; Cambridge Primary Pathway</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Guardian: Dr. Elizabeth Mensah (+233 24 111 2222)</div>
            </div>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
            <span>Official Ghana Student Record Token</span>
            <span style="color: #34d399;">✓ Authenticated</span>
          </div>
        </div>
      `;
    } else {
      title.innerText = 'Link Another Child or Ward';
      body.innerHTML = `
        <div style="font-size: 13.5px; line-height: 1.6;">
          <p>Link your child's pre-tertiary profile to track admissions across multiple institutions simultaneously.</p>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
            <input type="text" placeholder="Child's Full Name (e.g. Kojo Mensah)" style="padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px;">
            <input type="date" placeholder="Date of Birth" style="padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px;">
            <select style="padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px;">
              <option>Primary Class 1</option>
              <option>Primary Class 2</option>
              <option>Primary Class 3</option>
              <option>Primary Class 4</option>
              <option>JHS 1</option>
              <option>SHS 1</option>
            </select>
            <button class="btn-pill btn-gold" style="margin-top: 10px;" onclick="alert('Child profile registered successfully!'); window.closeModal();">Save &amp; Link Child</button>
          </div>
        </div>
      `;
    }

    modal.classList.add('open');
  };

  window.closeModal = () => {
    document.getElementById('previewModal').classList.remove('open');
  };

  // Initial Boot - Find Schools by the side (matching Image 3)
  window.switchHub('find');
})();

