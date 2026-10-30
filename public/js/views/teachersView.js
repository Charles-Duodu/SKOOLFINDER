/**
 * SkoolFinder Teach - Educator & Private Tutor Marketplace Portal (/teachers)
 */
const TeachersView = {
  activeTab: 'directory', // 'directory' | 'profile' | 'bookings' | 'vacancies' | 'verification'

  filters: {
    search: '',
    subject: 'All',
    region: 'All',
    level: 'All',
    curriculum: 'All',
    maxRate: 500
  },

  async render() {
    let teachers = [];
    let jobs = [];
    let bookings = [];

    try {
      teachers = await API.getTeachers(this.filters);
    } catch (e) {
      teachers = [];
    }

    try {
      jobs = await API.getJobs();
    } catch (e) {
      jobs = [];
    }

    try {
      bookings = await API.getTutorBookings();
    } catch (e) {
      bookings = [];
    }

    const isTeacherUser = State.isAuthenticated() && State.isTeacher();
    const currentTeacher = isTeacherUser ? (teachers.find(t => t.id === State.currentUser.teacherProfileId) || teachers[0]) : null;

    return `
      <!-- Portal Sub-Header Navigation Bar -->
      <section style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); color: #fff; padding: 2.5rem 0 1.5rem; border-bottom: 3px solid #10b981;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                <span>🧑‍🏫</span> SkoolFinder Teach • Educator Marketplace
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 0.5rem 0; line-height: 1.2;">
                Ghana Certified Teachers & Private Tutors
              </h1>
              <p style="color: #a7f3d0; font-size: 0.95rem; max-width: 680px; margin: 0; line-height: 1.5;">
                Hire vetted NTC-licensed home tutors for Cambridge & BECE/WASSCE exam prep, or enroll as an independent educator to receive tutoring bookings and school employment offers.
              </p>
            </div>

            <!-- Top Portal Switcher & Action -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
              ${!State.isAuthenticated() || !State.isTeacher() ? `
                <button id="btn-portal-enroll-teacher" class="btn-pill btn-gold" style="box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
                  <span>➕</span> Enroll as an Educator
                </button>
              ` : `
                <div style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 0.5rem 1rem; color: #fff; display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.4rem;">🧑‍🏫</span>
                  <div>
                    <div style="font-size: 0.72rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700;">Active Educator</div>
                    <div style="font-weight: 700; font-size: 0.9rem;">${State.currentUser.name}</div>
                  </div>
                </div>
              `}
              <button id="btn-teacher-past-papers" class="btn-pill" style="border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(0,0,0,0.25); font-size: 0.85rem;" onclick="App.navigate('past-questions')">
                <span>📚</span> Past Papers & Marking Schemes
              </button>
              <button id="btn-switch-to-parents" class="btn-pill btn-outline" style="border-color: rgba(255,255,255,0.4); color: #fff; background: rgba(0,0,0,0.2);">
                <span>👨‍👩‍👧</span> For Parents &rarr;
              </button>
            </div>
          </div>

          <!-- Quick Stat KPIs -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.75rem;">
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 700; text-transform: uppercase;">Verified Educators</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">${teachers.length}+</div>
              <div style="font-size: 0.72rem; color: #d1fae5;">NTC & Degree Certified</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 700; text-transform: uppercase;">Curricula Covered</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">4</div>
              <div style="font-size: 0.72rem; color: #d1fae5;">GES, Cambridge, IB, Montessori</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 700; text-transform: uppercase;">Avg Hourly Rate</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">GH₵ 115</div>
              <div style="font-size: 0.72rem; color: #d1fae5;">Home & Online Tuition</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.85rem 1rem;">
              <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 700; text-transform: uppercase;">School Vacancies</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #fff;">${jobs.length}</div>
              <div style="font-size: 0.72rem; color: #d1fae5;">Private & Int'l Openings</div>
            </div>
          </div>

          <!-- Portal Navigation Tabs -->
          <div style="display: flex; gap: 0.5rem; overflow-x: auto; margin-top: 2rem; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 0;">
            <button class="portal-tab-btn ${this.activeTab === 'directory' ? 'active' : ''}" data-tab="directory">
              <span>🔍</span> Find Tutors & Exam Prep (${teachers.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
              <span>👤</span> Educator Profile & Rates
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">
              <span>📅</span> Bookings & Requests (${bookings.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'vacancies' ? 'active' : ''}" data-tab="vacancies">
              <span>💼</span> School Teaching Vacancies (${jobs.length})
            </button>
            <button class="portal-tab-btn ${this.activeTab === 'verification' ? 'active' : ''}" data-tab="verification">
              <span>🛡️</span> NTC Verification Desk
            </button>
          </div>
        </div>
      </section>

      <!-- Main Portal Content -->
      <section style="background: var(--bg-main); min-height: 70vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          ${this.renderActiveTab(teachers, jobs, bookings, currentTeacher)}
        </div>
      </section>
    `;
  },

  renderActiveTab(teachers, jobs, bookings, currentTeacher) {
    switch (this.activeTab) {
      case 'directory':
        return this.renderDirectoryTab(teachers);
      case 'profile':
        return this.renderProfileTab(currentTeacher);
      case 'bookings':
        return this.renderBookingsTab(bookings);
      case 'vacancies':
        return this.renderVacanciesTab(jobs);
      case 'verification':
        return this.renderVerificationTab(currentTeacher);
      default:
        return this.renderDirectoryTab(teachers);
    }
  },

  renderDirectoryTab(teachers) {
    return `
      <!-- Filter Bar -->
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <div style="flex: 2; min-width: 260px;">
            <label class="form-label" style="font-size: 0.78rem;">Search by Subject, Name or Suburb</label>
            <input type="text" id="tch-search-input" class="form-input" placeholder="e.g. Mathematics, French, Physics, East Legon, Ahodwo..." value="${this.filters.search || ''}" />
          </div>
          <div style="flex: 1; min-width: 180px;">
            <label class="form-label" style="font-size: 0.78rem;">Subject Specialization</label>
            <select id="tch-filter-subject" class="form-select">
              <option value="All" ${this.filters.subject === 'All' ? 'selected' : ''}>All Subjects</option>
              <option value="Mathematics" ${this.filters.subject === 'Mathematics' ? 'selected' : ''}>Mathematics & Further Maths</option>
              <option value="Physics" ${this.filters.subject === 'Physics' ? 'selected' : ''}>Physics & Chemistry</option>
              <option value="Science" ${this.filters.subject === 'Science' ? 'selected' : ''}>Integrated Science & Biology</option>
              <option value="English" ${this.filters.subject === 'English' ? 'selected' : ''}>English Language & Literature</option>
              <option value="Phonics" ${this.filters.subject === 'Phonics' ? 'selected' : ''}>Early Literacy & Phonics</option>
              <option value="French" ${this.filters.subject === 'French' ? 'selected' : ''}>French & Foreign Languages</option>
              <option value="Coding" ${this.filters.subject === 'Coding' ? 'selected' : ''}>Coding, Robotics & STEM</option>
            </select>
          </div>
          <div style="flex: 1; min-width: 160px;">
            <label class="form-label" style="font-size: 0.78rem;">Region / Hub</label>
            <select id="tch-filter-region" class="form-select">
              <option value="All" ${this.filters.region === 'All' ? 'selected' : ''}>All Regions</option>
              <option value="Greater Accra" ${this.filters.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
              <option value="Ashanti" ${this.filters.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <select id="tch-filter-curriculum" class="form-select" style="font-size: 0.85rem; width: auto;">
              <option value="All" ${this.filters.curriculum === 'All' ? 'selected' : ''}>All Curricula</option>
              <option value="GES" ${this.filters.curriculum === 'GES' ? 'selected' : ''}>GES Standards-Based</option>
              <option value="Cambridge" ${this.filters.curriculum === 'Cambridge' ? 'selected' : ''}>Cambridge Assessment (CIE)</option>
              <option value="IB" ${this.filters.curriculum === 'IB' ? 'selected' : ''}>International Baccalaureate (IB)</option>
              <option value="Montessori" ${this.filters.curriculum === 'Montessori' ? 'selected' : ''}>Montessori / EYFS</option>
            </select>

            <select id="tch-filter-level" class="form-select" style="font-size: 0.85rem; width: auto;">
              <option value="All" ${this.filters.level === 'All' ? 'selected' : ''}>All Levels</option>
              <option value="Primary" ${this.filters.level === 'Primary' ? 'selected' : ''}>Primary / Basic School</option>
              <option value="JHS" ${this.filters.level === 'JHS' ? 'selected' : ''}>JHS (BECE Candidates)</option>
              <option value="SHS" ${this.filters.level === 'SHS' ? 'selected' : ''}>SHS (WASSCE / IGCSE)</option>
            </select>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
            Showing <strong>${teachers.length}</strong> vetted educators
          </div>
        </div>
      </div>

      <!-- Teachers Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
        ${teachers.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🧑‍🏫</div>
            <h3 style="font-family: var(--font-heading); color: var(--text-main);">No teachers match your search</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your subject or location filters.</p>
            <button class="btn-pill btn-primary" id="btn-reset-tch-filters">Reset All Filters</button>
          </div>
        ` : teachers.map(t => `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-xl); transition: transform 0.2s, box-shadow 0.2s; background: #fff;">
            <div>
              <!-- Top Row: Avatar & Trust Badges -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div style="display: flex; gap: 0.85rem; align-items: center;">
                  <div style="width: 54px; height: 54px; border-radius: 50%; background: #ecfdf5; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
                    ${t.avatar || '👨‍🏫'}
                  </div>
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.15rem 0;">
                      ${t.fullName}
                    </h3>
                    <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
                      <span>📍 ${t.suburb}, ${t.region}</span>
                    </div>
                  </div>
                </div>

                <span class="badge ${t.verified ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.7rem; font-weight: 700;">
                  ${t.verified ? '🛡️ NTC Verified' : 'Pending Review'}
                </span>
              </div>

              <!-- Headline -->
              <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.45; margin-bottom: 1rem; font-weight: 500;">
                "${t.headline || 'Dedicated educational specialist providing structured home tuition.'}"
              </p>

              <!-- Subjects Tags -->
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem;">
                ${(t.subjects || []).map(s => `
                  <span style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 600;">
                    ${s}
                  </span>
                `).join('')}
                ${(t.curricula || []).map(c => `
                  <span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 600;">
                    ${c}
                  </span>
                `).join('')}
              </div>

              <!-- Details Grid -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div>
                  <span style="color: var(--text-muted);">Experience:</span>
                  <strong style="color: var(--text-main); display: block;">${t.experienceYears || '7+'} Years</strong>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Qualification:</span>
                  <strong style="color: var(--text-main); display: block;">${t.qualification || 'B.Ed (Hons)'}</strong>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Format:</span>
                  <strong style="color: var(--text-main); display: block;">Home & Online</strong>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Hourly Rate:</span>
                  <strong style="color: #047857; display: block; font-size: 0.92rem;">GH₵ ${t.hourlyRateGHS || 120}/hr</strong>
                </div>
              </div>
            </div>

            <!-- Card Action Footer -->
            <div style="display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
              <button class="btn-pill btn-emerald btn-book-tutor" data-teacher-id="${t.id}" data-teacher-name="${t.fullName}" data-rate="${t.hourlyRateGHS || 120}" style="flex: 2; justify-content: center; font-size: 0.85rem; padding: 0.55rem;">
                <span>📅</span> Book Tuition
              </button>
              <a href="https://wa.me/233244000000?text=Hello%20${encodeURIComponent(t.fullName)},%20I%20found%20your%20educator%20profile%20on%20SkoolFinder%20Teach." target="_blank" class="btn-pill btn-outline" style="flex: 1; justify-content: center; font-size: 0.85rem; padding: 0.55rem; color: #059669; border-color: #10b981;">
                WhatsApp
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderProfileTab(currentTeacher) {
    const t = currentTeacher || {
      fullName: State.currentUser ? State.currentUser.name : "Mr. Emmanuel Addo",
      email: State.currentUser ? State.currentUser.email : "tutor@skoolfinder.com",
      phone: "+233 24 455 6677",
      headline: "Senior Cambridge Physics & WASSCE Mathematics Specialist",
      suburb: "East Legon",
      region: "Greater Accra",
      qualification: "B.Sc Physics (Legon), PGDE (UEW)",
      licenseNumber: "NTC/LIC/GH/819203",
      hourlyRateGHS: 120,
      subjects: "Physics, Further Mathematics, Integrated Science",
      curricula: "Cambridge IGCSE, GES Standards-Based",
      bio: "10+ years helping students achieve Grade 1 / A* in BECE, WASSCE, and Cambridge exams."
    };

    return `
      <div style="max-width: 800px; margin: 0 auto; background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
          <div>
            <span style="font-size: 0.78rem; font-weight: 700; color: #047857; text-transform: uppercase;">Educator Commercial Workspace</span>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0 0;">
              Your Public Teacher Profile & Tuition Rates
            </h2>
          </div>
          <span class="badge badge-emerald" style="font-size: 0.8rem;">🌟 Live on Portal</span>
        </div>

        <form id="form-teacher-profile">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Full Name & Title *</label>
              <input type="text" id="tch-prof-name" class="form-input" value="${t.fullName}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Professional Headline *</label>
              <input type="text" id="tch-prof-headline" class="form-input" value="${t.headline}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Primary Suburb *</label>
              <input type="text" id="tch-prof-suburb" class="form-input" value="${t.suburb}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Region *</label>
              <select id="tch-prof-region" class="form-select">
                <option value="Greater Accra" ${t.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                <option value="Ashanti" ${t.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Hourly Tuition Rate (GH₵) *</label>
              <input type="number" id="tch-prof-rate" class="form-input" value="${t.hourlyRateGHS || 120}" min="40" max="600" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Subjects Taught (comma separated)</label>
              <input type="text" id="tch-prof-subjects" class="form-input" value="${Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects}" />
            </div>
            <div class="form-group">
              <label class="form-label">NTC License Number</label>
              <input type="text" id="tch-prof-license" class="form-input" value="${t.licenseNumber || ''}" placeholder="e.g. NTC/LIC/GH/819203" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label">Teacher Bio & Proven Track Record</label>
            <textarea id="tch-prof-bio" class="form-textarea" rows="4">${t.bio || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              Changes reflect immediately on the public tutor search directory.
            </div>
            <button type="submit" class="btn-pill btn-emerald" style="padding: 0.75rem 2rem; font-weight: 700;">
              Save & Update Profile
            </button>
          </div>
        </form>
      </div>
    `;
  },

  renderBookingsTab(bookings) {
    return `
      <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;">
              Parent Tutoring Inquiries & Confirmed Sessions
            </h2>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Track bookings submitted by families from East Legon, Cantonments, Airport, and Kumasi.
            </p>
          </div>
          <button id="btn-mock-new-booking" class="btn-pill btn-outline" style="font-size: 0.82rem;">
            <span>➕</span> Test New Booking Entry
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid var(--border-light); text-align: left;">
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">STUDENT & PARENT</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">SUBJECT & CURRICULUM</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">LOCATION & SCHEDULE</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">AGREED RATE</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">STATUS</th>
                <th style="padding: 0.85rem 1rem; color: var(--text-muted); font-weight: 700;">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length === 0 ? `
                <tr>
                  <td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                    No active tutoring bookings yet. Parents will contact you through your public profile!
                  </td>
                </tr>
              ` : bookings.map(b => `
                <tr style="border-bottom: 1px solid var(--border-light);">
                  <td style="padding: 1rem;">
                    <div style="font-weight: 700; color: var(--text-main);">${b.studentName} (${b.studentGrade})</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">Parent: ${b.parentName} • ${b.parentPhone}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <div style="font-weight: 600; color: #047857;">${b.subject}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${b.curriculum}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <div>📍 ${b.suburb} (${b.mode})</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">⏰ ${b.preferredDays}</div>
                  </td>
                  <td style="padding: 1rem;">
                    <strong style="color: var(--text-main);">GH₵ ${b.rateAgreedGHS || 120}/hr</strong>
                  </td>
                  <td style="padding: 1rem;">
                    <span class="badge badge-emerald" style="font-size: 0.75rem;">
                      ✅ ${b.status}
                    </span>
                  </td>
                  <td style="padding: 1rem;">
                    <button class="btn-pill btn-outline btn-send-lesson-note" data-id="${b.id}" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                      Send Lesson Report
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderVacanciesTab(jobs) {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin: 0;">
              School Teaching Vacancies in Accra & Kumasi
            </h2>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Private and international schools recruit directly from the SkoolFinder verified talent pool.
            </p>
          </div>
          <button id="btn-post-job-as-school" class="btn-pill btn-gold">
            <span>➕</span> School Admin: Post Vacancy
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${jobs.map(j => `
            <div style="background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="flex: 2; min-width: 280px;">
                <div style="font-size: 0.78rem; font-weight: 700; color: #b45309; text-transform: uppercase;">
                  🏫 ${j.schoolName || 'International School'} • ${j.region}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0.25rem 0 0.5rem 0;">
                  ${j.title}
                </h3>
                <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0 0 0.75rem 0; line-height: 1.4;">
                  ${j.description || 'Seeking experienced educator with track record of high achievement.'}
                </p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="badge badge-cambridge">${j.curriculum || 'Cambridge CIE'}</span>
                  <span class="badge" style="background: #f3f4f6; color: #374151;">${j.level || 'Secondary'}</span>
                  <span class="badge badge-emerald">${j.salaryRange || 'GH₵ 3,500 - 6,000 / mo'}</span>
                </div>
              </div>

              <div style="text-align: right; min-width: 160px;">
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  Deadline: <strong>${j.deadline || 'Rolling Admissions'}</strong>
                </div>
                <button class="btn-pill btn-primary btn-apply-vacancy" data-job-id="${j.id}" data-job-title="${j.title}" style="width: 100%; justify-content: center;">
                  Apply with 1-Click &rarr;
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderVerificationTab(currentTeacher) {
    return `
      <div style="max-width: 750px; margin: 0 auto; background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2.25rem; box-shadow: var(--shadow-sm);">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛡️</div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem 0;">
            NTC & Degree Verification Desk
          </h2>
          <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 550px; margin: 0 auto;">
            Ghanaian parents and top international schools prioritize teachers holding an official <strong>National Teaching Council (NTC)</strong> license and verified university credentials.
          </p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.75rem; display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2rem;">🏅</div>
          <div>
            <strong style="color: #166534; font-size: 0.95rem;">Benefits of the Gold Verified Badge:</strong>
            <ul style="margin: 0.25rem 0 0 1.2rem; font-size: 0.85rem; color: #15803d; line-height: 1.5;">
              <li>Ranked at the top of parent tutor searches across Accra & Kumasi.</li>
              <li>Official "NTC Certified" gold shield displayed on your public profile.</li>
              <li>Priority recommendations when schools post high-salary teaching jobs.</li>
            </ul>
          </div>
        </div>

        <form id="form-ntc-verification">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Teacher's Full Name *</label>
            <input type="text" id="verif-teacher-name" class="form-input" value="${State.currentUser ? State.currentUser.name : 'Mr. Emmanuel Addo'}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">NTC License Number *</label>
              <input type="text" id="verif-ntc-number" class="form-input" placeholder="e.g. NTC/LIC/GH/819203" value="NTC/LIC/GH/819203" required />
            </div>
            <div class="form-group">
              <label class="form-label">Graduating Institution *</label>
              <select id="verif-institution" class="form-select">
                <option value="University of Cape Coast (UCC)">University of Cape Coast (UCC)</option>
                <option value="University of Education, Winneba (UEW)">University of Education, Winneba (UEW)</option>
                <option value="University of Ghana (Legon)">University of Ghana (Legon)</option>
                <option value="KNUST Kumasi">KNUST Kumasi</option>
                <option value="Other / International">Other / International Institution</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label">Upload Certificate / License Copy (PDF or Image)</label>
            <input type="file" class="form-input" id="verif-file-upload" accept=".pdf,.png,.jpg" />
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
              Simulated verification vault powered by encrypted Supabase storage.
            </div>
          </div>

          <button type="submit" id="btn-submit-ntc-verif" class="btn-pill btn-emerald" style="width: 100%; justify-content: center; padding: 0.8rem; font-size: 1rem; font-weight: 700;">
            <span>🛡️</span> Submit Credentials for Gold Seal Verification
          </button>
        </form>
      </div>
    `;
  },

  openBookingModal(teacherId, teacherName, hourlyRate) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'modal-book-tutor-backdrop';
    backdrop.innerHTML = `
      <div class="modal-dialog" style="max-width: 520px; border-radius: var(--radius-xl); overflow: hidden;">
        <div class="modal-header" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color: #fff; padding: 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #a7f3d0; text-transform: uppercase;">Private Home Tuition Booking</div>
            <h3 class="modal-title" style="color: #fff; font-size: 1.3rem; margin-top: 0.2rem;">Book ${teacherName}</h3>
          </div>
          <button class="modal-close-btn" id="modal-book-close" style="color: #d1fae5;">&times;</button>
        </div>

        <form id="form-submit-tutor-booking" class="modal-body" style="padding: 1.5rem;">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Parent / Guardian Name *</label>
            <input type="text" id="book-parent-name" class="form-input" value="${State.currentUser ? State.currentUser.name : 'Mrs. Nana Aba Mensah'}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Phone / WhatsApp *</label>
              <input type="tel" id="book-parent-phone" class="form-input" value="${State.currentUser && State.currentUser.phone ? State.currentUser.phone : '+233 24 498 7654'}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Student Name & Grade *</label>
              <input type="text" id="book-student-name" class="form-input" placeholder="e.g. Kwame (JHS 2)" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label">Subject Needed *</label>
              <input type="text" id="book-subject" class="form-input" placeholder="e.g. Mathematics" required />
            </div>
            <div class="form-group">
              <label class="form-label">Your Suburb *</label>
              <input type="text" id="book-suburb" class="form-input" placeholder="e.g. East Legon" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Preferred Days & Time</label>
            <input type="text" id="book-schedule" class="form-input" placeholder="e.g. Mondays & Wednesdays (4:30 PM)" />
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.85rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: #166534;">Estimated Session Rate:</span>
            <strong style="font-size: 1.1rem; color: #047857;">GH₵ ${hourlyRate}/hr</strong>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-book">Cancel</button>
            <button type="submit" class="btn-pill btn-emerald">Confirm & Request Booking</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById('modal-book-close').onclick = () => backdrop.remove();
    document.getElementById('btn-cancel-book').onclick = () => backdrop.remove();

    document.getElementById('form-submit-tutor-booking').onsubmit = async (e) => {
      e.preventDefault();
      try {
        await API.bookTutor({
          teacherId,
          teacherName,
          parentName: document.getElementById('book-parent-name').value,
          parentPhone: document.getElementById('book-parent-phone').value,
          parentEmail: State.currentUser ? State.currentUser.email : 'parent@gmail.com',
          studentName: document.getElementById('book-student-name').value,
          subject: document.getElementById('book-subject').value,
          suburb: document.getElementById('book-suburb').value,
          preferredDays: document.getElementById('book-schedule').value,
          rateAgreedGHS: hourlyRate
        });
        backdrop.remove();
        State.showToast(`Booking requested with ${teacherName}! The educator will contact you via WhatsApp.`, 'success');
        this.activeTab = 'bookings';
        App.refreshCurrentView();
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  attachEvents() {
    // Portal Tab switching
    document.querySelectorAll('.portal-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;
        App.refreshCurrentView();
      });
    });

    // Switch to parents
    document.getElementById('btn-switch-to-parents')?.addEventListener('click', () => {
      App.navigate('parents');
    });

    // Enroll as teacher button
    document.getElementById('btn-portal-enroll-teacher')?.addEventListener('click', () => {
      Modals.openTeacherSubscribeModal();
    });

    // Reset filters
    document.getElementById('btn-reset-tch-filters')?.addEventListener('click', () => {
      this.filters = { search: '', subject: 'All', region: 'All', level: 'All', curriculum: 'All', maxRate: 500 };
      App.refreshCurrentView();
    });

    // Filter changes
    document.getElementById('tch-search-input')?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      App.debounce(() => App.refreshCurrentView(), 350);
    });

    document.getElementById('tch-filter-subject')?.addEventListener('change', (e) => {
      this.filters.subject = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('tch-filter-region')?.addEventListener('change', (e) => {
      this.filters.region = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('tch-filter-curriculum')?.addEventListener('change', (e) => {
      this.filters.curriculum = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('tch-filter-level')?.addEventListener('change', (e) => {
      this.filters.level = e.target.value;
      App.refreshCurrentView();
    });

    // Book tutor buttons
    document.querySelectorAll('.btn-book-tutor').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-teacher-id');
        const name = btn.getAttribute('data-teacher-name');
        const rate = btn.getAttribute('data-rate');
        this.openBookingModal(id, name, rate);
      });
    });

    // Profile form submit
    document.getElementById('form-teacher-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      State.showToast("Teacher Profile & Tuition Rates updated successfully!", "success");
    });

    // NTC Verification form submit
    document.getElementById('form-ntc-verification')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const ntc = document.getElementById('verif-ntc-number').value;
      State.showToast(`NTC Credentials (${ntc}) submitted for verification. Gold Badge active in demo mode!`, "success");
    });

    // Vacancy application
    document.querySelectorAll('.btn-apply-vacancy').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-job-title');
        State.showToast(`Application submitted for "${title}" using your verified SkoolFinder profile!`, "success");
      });
    });

    // Mock new booking
    document.getElementById('btn-mock-new-booking')?.addEventListener('click', async () => {
      try {
        await API.bookTutor({
          teacherId: "tch-1",
          teacherName: "Mr. Emmanuel Addo",
          parentName: "Mrs. Vivian Arthur",
          parentPhone: "+233 24 102 3345",
          parentEmail: "vivian.arthur@gmail.com",
          studentName: "Naa Arthur",
          studentGrade: "Class 6",
          subject: "Cambridge Primary Science",
          suburb: "Cantonments",
          preferredDays: "Saturdays (10:00 AM)",
          rateAgreedGHS: 140
        });
        State.showToast("New booking created!", "success");
        App.refreshCurrentView();
      } catch (err) {
        State.showToast(err.message, "error");
      }
    });
  }
};
