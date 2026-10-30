/**
 * SkoolFinder Ghana - Phase 2: Educator Directory, Teacher Subscription & Job Board
 */
const JobsView = {
  activeTab: 'teachers', // 'teachers' | 'jobs'

  teacherFilters: {
    search: '',
    subject: 'All',
    region: 'All',
    level: 'All',
    curriculum: 'All',
    teachingMode: 'All'
  },

  jobFilters: {
    subject: 'All',
    region: 'All',
    level: 'All',
    curriculum: 'All'
  },

  async render() {
    const teachers = await API.getTeachers(this.teacherFilters);
    const jobs = await API.getJobs(this.jobFilters);

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Page Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / Educator & Talent Network
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900);">
                Ghana Educator Hub: Tutors, Teachers & Jobs
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 680px;">
                Find vetted private home tutors and subject teachers across Accra & Kumasi, or subscribe as an educator to be discovered by thousands of parents and hiring schools.
              </p>
            </div>

            <!-- Top Actions -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-subscribe-teacher-top" class="btn-pill btn-gold">
                <span>🎓</span> Subscribe as an Educator / Tutor
              </button>
              <button id="btn-post-job-top" class="btn-pill btn-outline">
                <span>➕</span> Post School Vacancy
              </button>
            </div>
          </div>

          <!-- Dual Tab Switcher -->
          <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-light); margin-bottom: 2rem;">
            <button id="tab-btn-teachers" class="nav-link ${this.activeTab === 'teachers' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              👨‍🏫 Search Educators & Tutors (${teachers.length})
            </button>
            <button id="tab-btn-jobs" class="nav-link ${this.activeTab === 'jobs' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              💼 School Teaching Vacancies (${jobs.length})
            </button>
          </div>

          <!-- TAB 1: TEACHERS & TUTORS DIRECTORY -->
          ${this.activeTab === 'teachers' ? `
            <div>
              <!-- Teacher Search & Multi-Criteria Filter Bar -->
              <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                  <div style="flex: 2; min-width: 260px;">
                    <label class="form-label" style="font-size: 0.78rem;">Search by Subject, Name or Suburb</label>
                    <input type="text" id="tch-search-input" class="form-input" placeholder="e.g. Mathematics, Phonics, French, Coding, East Legon..." value="${this.teacherFilters.search || ''}" />
                  </div>
                  <div style="flex: 1; min-width: 180px;">
                    <label class="form-label" style="font-size: 0.78rem;">Subject / Field</label>
                    <select id="tch-filter-subject" class="form-select">
                      <option value="All" ${this.teacherFilters.subject === 'All' ? 'selected' : ''}>All Fields & Subjects</option>
                      <option value="Mathematics" ${this.teacherFilters.subject === 'Mathematics' ? 'selected' : ''}>Mathematics & Further Maths</option>
                      <option value="Physics" ${this.teacherFilters.subject === 'Physics' ? 'selected' : ''}>Physics & Chemistry</option>
                      <option value="Science" ${this.teacherFilters.subject === 'Science' ? 'selected' : ''}>Integrated Science & Biology</option>
                      <option value="Phonics" ${this.teacherFilters.subject === 'Phonics' ? 'selected' : ''}>Early Literacy & Phonics</option>
                      <option value="French" ${this.teacherFilters.subject === 'French' ? 'selected' : ''}>French & Foreign Languages</option>
                      <option value="Coding" ${this.teacherFilters.subject === 'Coding' ? 'selected' : ''}>Coding, Robotics & STEM</option>
                      <option value="Special Needs" ${this.teacherFilters.subject === 'Special Needs' ? 'selected' : ''}>Special Education (SEN) & Speech</option>
                    </select>
                  </div>
                  <div style="flex: 1; min-width: 160px;">
                    <label class="form-label" style="font-size: 0.78rem;">Location</label>
                    <select id="tch-filter-region" class="form-select">
                      <option value="All" ${this.teacherFilters.region === 'All' ? 'selected' : ''}>All Locations</option>
                      <option value="Greater Accra" ${this.teacherFilters.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                      <option value="Ashanti" ${this.teacherFilters.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
                    </select>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                  <div>
                    <label class="form-label" style="font-size: 0.78rem;">Curriculum</label>
                    <select id="tch-filter-curriculum" class="form-select">
                      <option value="All" ${this.teacherFilters.curriculum === 'All' ? 'selected' : ''}>All Curricula</option>
                      <option value="Cambridge" ${this.teacherFilters.curriculum === 'Cambridge' ? 'selected' : ''}>Cambridge (CIE / IGCSE)</option>
                      <option value="GES" ${this.teacherFilters.curriculum === 'GES' ? 'selected' : ''}>GES Standards-based</option>
                      <option value="Montessori" ${this.teacherFilters.curriculum === 'Montessori' ? 'selected' : ''}>Montessori Early Years</option>
                      <option value="IB" ${this.teacherFilters.curriculum === 'IB' ? 'selected' : ''}>International Baccalaureate (IB)</option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label" style="font-size: 0.78rem;">Grade Level</label>
                    <select id="tch-filter-level" class="form-select">
                      <option value="All" ${this.teacherFilters.level === 'All' ? 'selected' : ''}>All Levels</option>
                      <option value="Kindergarten" ${this.teacherFilters.level === 'Kindergarten' ? 'selected' : ''}>Preschool / KG</option>
                      <option value="Primary" ${this.teacherFilters.level === 'Primary' ? 'selected' : ''}>Primary (Class 1-6)</option>
                      <option value="JHS" ${this.teacherFilters.level === 'JHS' ? 'selected' : ''}>JHS (BECE Prep)</option>
                      <option value="SHS" ${this.teacherFilters.level === 'SHS' ? 'selected' : ''}>SHS (IGCSE/WASSCE)</option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label" style="font-size: 0.78rem;">Service Mode</label>
                    <select id="tch-filter-mode" class="form-select">
                      <option value="All" ${this.teacherFilters.teachingMode === 'All' ? 'selected' : ''}>All Service Modes</option>
                      <option value="Home Tutoring" ${this.teacherFilters.teachingMode === 'Home Tutoring' ? 'selected' : ''}>Home Tutoring (In-Person)</option>
                      <option value="Online" ${this.teacherFilters.teachingMode === 'Online' ? 'selected' : ''}>Online Lessons</option>
                      <option value="School Contract" ${this.teacherFilters.teachingMode === 'School Contract' ? 'selected' : ''}>Full-Time School Hire</option>
                    </select>
                  </div>

                  <div style="display: flex; align-items: flex-end;">
                    <button id="btn-reset-tch-filters" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.85rem;">
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>

              <!-- Teacher Cards Grid -->
              <div class="teachers-grid">
                ${teachers.map(t => {
                  const initials = (t.fullName || t.full_name || t.name || 'Teacher').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');
                  const isFeatured = t.subscriptionTier === 'Featured Pro';

                  return `
                    <div class="teacher-card ${isFeatured ? 'teacher-card-featured' : ''}" id="card-${t.id}">
                      <div class="teacher-header">
                        <div class="teacher-avatar-circle">
                          ${initials}
                        </div>
                        <div style="flex-grow: 1;">
                          <h3 class="teacher-name">${t.fullName}</h3>
                          <div class="teacher-headline">${t.headline}</div>
                          <div class="teacher-location">
                            <span>📍</span> ${t.suburb}, ${t.region}
                          </div>
                        </div>
                      </div>

                      <div style="margin-bottom: 0.65rem;">
                        <span class="badge badge-verified" style="font-size: 0.72rem;">
                          🛡️ ${t.ratingBadge || 'Verified Educator'}
                        </span>
                        ${t.licenseNumber ? `
                          <span class="badge" style="background: var(--bg-alt); color: var(--text-muted); font-size: 0.7rem;">
                            Lic: ${t.licenseNumber}
                          </span>
                        ` : ''}
                      </div>

                      <!-- Subjects Handled -->
                      <div class="teacher-subjects-wrap">
                        ${t.subjects.map(s => `<span class="subject-chip">${s}</span>`).join('')}
                      </div>

                      <!-- Service Modes -->
                      <div class="teaching-modes-list">
                        ${t.teachingModes.map(m => `<span class="mode-badge">✓ ${m}</span>`).join('')}
                      </div>

                      <!-- Rate & Curricula -->
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <span class="teacher-rate-tag">
                          💰 ${t.rate}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--text-light); font-weight: 600;">
                          ${t.experienceYears} yrs experience
                        </span>
                      </div>

                      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem; flex-grow: 1;">
                        ${t.bio}
                      </p>

                      <div class="teacher-card-footer">
                        <button class="btn-card-wa btn-tch-wa" data-teacher-id="${t.id}" data-wa="${t.whatsapp}" data-name="${t.fullName}" style="flex: 1; justify-content: center;">
                          💬 WhatsApp
                        </button>
                        <button class="btn-card-view btn-tch-contact" data-teacher-id="${t.id}" style="flex: 1; justify-content: center;">
                          📞 Contact / Hire
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${teachers.length === 0 ? `
                <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px dashed var(--border-light); padding: 4rem 2rem; text-align: center;">
                  <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍🏫</div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                    No educators found matching your exact search
                  </h3>
                  <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                    Try clearing filters or search for broader subjects like "Maths", "Science", or "French".
                  </p>
                  <button id="btn-empty-tch-reset" class="btn-pill btn-primary">
                    Clear Educator Filters
                  </button>
                </div>
              ` : ''}
            </div>
          ` : `
            <!-- TAB 2: SCHOOL TEACHING VACANCIES (JOB BOARD) -->
            <div>
              <div style="background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <strong style="color: var(--primary-900);">Are you a school looking to recruit teachers?</strong>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Post your subject vacancies to reach verified teachers across Greater Accra and Kumasi.
                  </div>
                </div>
                <button id="btn-sub-post-job" class="btn-pill btn-primary" style="font-size: 0.85rem;">
                  Post New Teaching Vacancy
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${jobs.map(j => `
                  <div class="job-card">
                    <div style="flex-grow: 1;">
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; flex-wrap: wrap;">
                        <span class="badge" style="background: var(--primary-50); color: var(--primary-700);">${j.curriculum}</span>
                        <span class="badge" style="background: var(--bg-alt); color: var(--text-muted);">${j.level}</span>
                        <span class="badge badge-admissions">${j.employmentType}</span>
                      </div>

                      <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.35rem;">
                        ${j.title}
                      </h3>

                      <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                        🏛️ <strong>${j.schoolName}</strong> • 📍 ${j.suburb}, ${j.region}
                      </div>

                      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.85rem; max-width: 800px;">
                        ${j.description}
                      </p>

                      <div style="font-size: 0.82rem; color: var(--text-light); margin-bottom: 0.5rem;">
                        <strong>Requirements:</strong> ${j.requirements}
                      </div>

                      <span class="job-salary-tag">
                        💰 ${j.salaryRange}
                      </span>
                    </div>

                    <div style="min-width: 200px; text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 1rem;">
                      <div style="font-size: 0.82rem; color: var(--text-light);">
                        Deadline: ${j.deadline} <br/>
                        <span style="color: var(--emerald-600); font-weight: 700;">${j.applicantsCount || 0} applicants</span>
                      </div>

                      <button class="btn-pill btn-primary btn-apply-job" data-job-id="${j.id}" style="width: 100%; justify-content: center;">
                        1-Click Apply &rarr;
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  },

  attachEvents() {
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Top action buttons
    document.getElementById('btn-subscribe-teacher-top')?.addEventListener('click', () => {
      Modals.openTeacherSubscribeModal();
    });

    const openPostJob = () => {
      Modals.openApplyJobModal({
        id: 'job-new',
        schoolName: 'Your School Campus',
        title: 'New Teaching Vacancy',
        suburb: 'Accra / Kumasi',
        region: 'Greater Accra',
        curriculum: 'GES / Cambridge',
        salaryRange: 'Negotiable'
      });
    };
    document.getElementById('btn-post-job-top')?.addEventListener('click', openPostJob);
    document.getElementById('btn-sub-post-job')?.addEventListener('click', openPostJob);

    // Tab buttons
    document.getElementById('tab-btn-teachers')?.addEventListener('click', () => {
      this.activeTab = 'teachers';
      App.navigate('jobs');
    });
    document.getElementById('tab-btn-jobs')?.addEventListener('click', () => {
      this.activeTab = 'jobs';
      App.navigate('jobs');
    });

    // Teacher Search input
    const searchInput = document.getElementById('tch-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.teacherFilters.search = e.target.value.trim();
        App.debounce(() => App.navigate('jobs'), 350);
      };
    }

    // Teacher Filter Selects
    const selects = [
      { id: 'tch-filter-subject', key: 'subject' },
      { id: 'tch-filter-region', key: 'region' },
      { id: 'tch-filter-curriculum', key: 'curriculum' },
      { id: 'tch-filter-level', key: 'level' },
      { id: 'tch-filter-mode', key: 'teachingMode' }
    ];

    selects.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = (e) => {
          this.teacherFilters[key] = e.target.value;
          App.navigate('jobs');
        };
      }
    });

    // Reset teacher filters
    const resetTchFilters = () => {
      this.teacherFilters = {
        search: '',
        subject: 'All',
        region: 'All',
        level: 'All',
        curriculum: 'All',
        teachingMode: 'All'
      };
      App.navigate('jobs');
    };
    document.getElementById('btn-reset-tch-filters')?.addEventListener('click', resetTchFilters);
    document.getElementById('btn-empty-tch-reset')?.addEventListener('click', resetTchFilters);

    // Teacher WhatsApp click with lead logging
    document.querySelectorAll('.btn-tch-wa').forEach(btn => {
      btn.onclick = async () => {
        const teacherId = btn.dataset.teacherId;
        const name = btn.dataset.name;
        const rawWa = btn.dataset.wa;
        await API.recordTeacherLead(teacherId, 'whatsapp');
        const cleanWa = rawWa.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${cleanWa}?text=Hello%20${encodeURIComponent(name)},%20I%20found%20your%20educator%20profile%20on%20SkoolFinder%20Ghana.%20I%20would%20like%20to%20inquire%20about%20tutoring/teaching.`, '_blank');
        State.showToast(`Connecting to ${name} on WhatsApp...`, 'success');
      };
    });

    // Teacher Contact/Hire click
    document.querySelectorAll('.btn-tch-contact').forEach(btn => {
      btn.onclick = async () => {
        const teacherId = btn.dataset.teacherId;
        const teacher = await API.getTeacherById(teacherId);
        if (teacher) Modals.openContactTeacherModal(teacher);
      };
    });

    // Top Action Buttons
    document.getElementById('btn-subscribe-teacher-top')?.addEventListener('click', () => {
      Modals.openTeacherSubscribeModal();
    });

    document.getElementById('btn-post-job-top')?.addEventListener('click', () => {
      Modals.openPostJobModal();
    });

    document.getElementById('btn-sub-post-job')?.addEventListener('click', () => {
      Modals.openPostJobModal();
    });

    // Job Apply buttons
    document.querySelectorAll('.btn-apply-job').forEach(btn => {
      btn.onclick = async () => {
        const jobId = btn.dataset.jobId;
        const jobs = await API.getJobs();
        const job = jobs.find(j => j.id === jobId);
        if (job) Modals.openApplyJobModal(job);
      };
    });
  }
};
