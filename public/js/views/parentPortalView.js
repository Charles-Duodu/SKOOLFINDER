/**
 * SkoolFinder Ghana - Parent Admissions & Tracking Portal View
 */
const ParentPortalView = {
  activeTab: 'applications',
  overviewData: null,

  async render() {
    // 1. If not authenticated or not logged in as a parent, render Parent Sign Up & Auth Gateway
    if (!State.isAuthenticated() || !State.isParent()) {
      return this.renderAuthGateway();
    }

    const user = State.currentUser;
    // Fetch parent overview from API (with fallback if offline or demo)
    try {
      this.overviewData = await API.getParentOverview();
    } catch (e) {
      console.warn("Could not fetch remote parent overview, falling back to cached state", e);
      this.overviewData = {
        user: user || { name: "Mrs. Nana Aba Mensah", email: "parent@gmail.com", phone: "+233 24 412 9845" },
        stats: { totalApplications: 1, totalInquiries: 1, totalSavedSchools: 2, totalInvoices: 1, totalOutstanding: 4400 },
        applications: [],
        inquiries: [],
        savedSchools: [],
        invoices: [],
        reportCards: []
      };
    }

    // Hydrate local bookmarks if backend list is empty
    if ((!this.overviewData.savedSchools || this.overviewData.savedSchools.length === 0) && State.bookmarkedSchoolIds?.length > 0) {
      try {
        const allSchools = await API.getSchools();
        this.overviewData.savedSchools = allSchools.filter(s => State.bookmarkedSchoolIds.includes(s.id));
      } catch (err) {
        console.warn("Hydrating local bookmarks:", err);
      }
    }

    const { user: profile, stats, applications = [], inquiries = [], savedSchools = [], invoices = [], reportCards = [], smsNotifications = [] } = this.overviewData;
    const parentName = profile?.name || user?.name || "Parent / Guardian";
    const parentEmail = profile?.email || user?.email || "parent@gmail.com";
    const parentPhone = profile?.phone || user?.phone || "+233 24 412 9845";

    const totalOutstanding = invoices.reduce((acc, inv) => acc + (Number(inv.balanceDue) || 0), 0);

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Active Parent Account Status Banner -->
          <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 0.9rem 1.4rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <span style="font-size: 1.8rem; background: var(--primary-50); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">👨‍👩‍👧</span>
              <div>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary-900);">
                  ${parentName}
                  <span class="badge" style="background: var(--emerald-50); color: var(--emerald-800); border: 1px solid var(--emerald-200); font-weight: 700; font-size: 0.72rem; margin-left: 0.5rem;">
                    🟢 ACTIVE PARENT SESSION
                  </span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">
                  ✉️ ${parentEmail} &bull; 📞 ${parentPhone} &bull; 📍 ${profile?.suburb || 'Ghana Basic / SHS'}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button id="btn-parent-logout" class="btn-pill" style="font-size: 0.82rem; padding: 0.45rem 1rem; background: #fee2e2; color: #991b1b; border: 1.5px solid #fecaca; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>

          <!-- Parent Portal Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span class="badge" style="background: var(--emerald-50); color: var(--emerald-800); border: 1px solid var(--emerald-200); font-weight: 700;">
                  👨‍👩‍👧 VERIFIED PARENT ACCOUNT
                </span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                  Active Admissions & Academic Year 2026/2027
                </span>
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.4rem 0;">
                Welcome, ${parentName}
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">
                ✉️ ${parentEmail} &nbsp;•&nbsp; 📞 ${parentPhone} &nbsp;•&nbsp; 
                <span style="color: var(--primary-700); font-weight: 600;">Ghana Ministry of Education / GES Unified Admissions & Fee Portal</span>
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-parent-cssps" class="btn-pill" style="font-size: 0.85rem; background: #eff6ff; color: #1d4ed8; border: 1.5px solid #3b82f6; font-weight: 700;" onclick="App.navigate('cssps')">
                🎓 BECE CSSPS Predictor
              </button>
              <button id="btn-parent-past-questions" class="btn-pill" style="font-size: 0.85rem; background: #fdf2f8; color: #9d174d; border: 1.5px solid #ec4899; font-weight: 700;" onclick="App.navigate('past-questions')">
                📚 Past Questions & Schemes
              </button>
              <button id="btn-parent-digital-id" class="btn-pill" style="font-size: 0.85rem; background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 100%); color: #ffffff; border: 1.5px solid #f59e0b; box-shadow: 0 4px 12px rgba(10,17,40,0.25); font-weight: 700;">
                🪪 Digital Student ID
              </button>
              <button id="btn-open-link-student" class="btn-pill btn-gold" style="font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);">
                <span>➕</span> Link Child by Student ID
              </button>
              <button id="btn-browse-schools" class="btn-pill btn-outline" style="font-size: 0.85rem;" onclick="App.navigate('directory')">
                🔍 Find Schools
              </button>
              <button id="btn-parent-switch-demo" class="btn-pill btn-secondary" style="font-size: 0.85rem;">
                🔄 Switch Demo Role
              </button>
            </div>
          </div>

          <!-- Top Analytics / Status Ribbon -->
          <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
            <!-- Metric 1: Applications -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: var(--primary-50); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                📝
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Active Applications
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: var(--primary-900);">
                  ${applications.length}
                </div>
                <div style="font-size: 0.75rem; color: var(--emerald-600); font-weight: 600;">
                  ${applications.length > 0 ? '🟢 Under official review' : 'No active apps'}
                </div>
              </div>
            </div>

            <!-- Metric 2: School Fees & MoMo Bills -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: #ecfdf5; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                💳
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Fees Outstanding
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: ${totalOutstanding > 0 ? 'var(--rose-600)' : 'var(--emerald-600)'};">
                  GH₵ ${totalOutstanding.toLocaleString()}
                </div>
                <div style="font-size: 0.75rem; color: var(--emerald-700); font-weight: 600;">
                  Instant MoMo settlement
                </div>
              </div>
            </div>

            <!-- Metric 3: Academic Report Cards -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: #eff6ff; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                📊
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Terminal Report Cards
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: var(--primary-900);">
                  ${reportCards.length}
                </div>
                <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">
                  Certified NaSIA / GES Sheets
                </div>
              </div>
            </div>

            <!-- Metric 4: Bookmarked Campuses -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: #fdf2f8; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                🔖
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Shortlisted Schools
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: var(--primary-900);">
                  ${savedSchools.length}
                </div>
                <div style="font-size: 0.75rem; color: var(--rose-600); font-weight: 600;">
                  Saved for quick comparison
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; gap: 0.75rem; border-bottom: 2px solid var(--border-color); margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.25rem;">
            <button class="parent-tab-btn ${this.activeTab === 'applications' ? 'active' : ''}" data-tab="applications" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'applications' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'applications' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              📝 My Admission Applications
              <span class="badge" style="background: var(--primary-100); color: var(--primary-800);">${applications.length}</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'invoices' ? 'active' : ''}" data-tab="invoices" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'invoices' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'invoices' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              💳 School Fees & MoMo Invoices
              <span class="badge" style="background: ${totalOutstanding > 0 ? '#fee2e2' : '#dcfce7'}; color: ${totalOutstanding > 0 ? '#991b1b' : '#166534'};">${invoices.length}</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'reports' ? 'active' : ''}" data-tab="reports" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'reports' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'reports' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              📊 Terminal Report Cards & Academic Performance
              <span class="badge" style="background: #ecfdf5; color: #065f46;">${reportCards.length}</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'transport' ? 'active' : ''}" data-tab="transport" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'transport' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'transport' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🚌 School Bus & Transit Pass
              <span class="badge" style="background: #fef3c7; color: #92400e;">Route 01</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'alumni' ? 'active' : ''}" data-tab="alumni" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'alumni' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'alumni' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🎓 Alumni & Career Guidance
              <span class="badge" style="background: #eff6ff; color: #1e40af;">${(this.overviewData?.alumniBookings || []).length} Booked</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'clubs' ? 'active' : ''}" data-tab="clubs" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'clubs' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'clubs' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🥋 Co-Curricular & Clubs
              <span class="badge" style="background: #ecfdf5; color: #065f46;">${(this.overviewData?.clubMemberships || []).length} Active</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'health' ? 'active' : ''}" data-tab="health" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'health' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'health' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🩺 Sickbay & Medical Passport
              <span class="badge" style="background: #fee2e2; color: #991b1b; font-weight: 800;">Allergy Alert O+</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'library' ? 'active' : ''}" data-tab="library" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'library' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'library' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              📚 Library & Textbooks
              <span class="badge" style="background: #eef2ff; color: #3730a3; font-weight: 800;">${(this.overviewData?.borrowedBooks || []).length} Issued</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'digital-id' ? 'active' : ''}" data-tab="digital-id" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'digital-id' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'digital-id' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🪪 Digital ID Badge
              <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 800;">GIS-0842</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'inquiries' ? 'active' : ''}" data-tab="inquiries" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'inquiries' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'inquiries' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              📅 Campus Tour & Direct Inquiries
              <span class="badge" style="background: var(--gold-100); color: var(--gold-800);">${inquiries.length}</span>
            </button>
            <button class="parent-tab-btn ${this.activeTab === 'bookmarks' ? 'active' : ''}" data-tab="bookmarks" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'bookmarks' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'bookmarks' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🔖 Shortlisted Campuses
              <span class="badge" style="background: #f1f5f9; color: var(--text-dark);">${savedSchools.length}</span>
            </button>

            <button class="parent-tab-btn ${this.activeTab === 'tutors' ? 'active' : ''}" data-tab="tutors" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'tutors' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'tutors' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              🧑‍🏫 Hired Private Tutors
              <span class="badge" style="background: #ecfdf5; color: #065f46;">1 Active</span>
            </button>

            <button class="parent-tab-btn ${this.activeTab === 'sms' ? 'active' : ''}" data-tab="sms" style="padding: 0.85rem 1.5rem; background: none; border: none; font-size: 0.95rem; font-weight: 700; color: ${this.activeTab === 'sms' ? 'var(--primary-900)' : 'var(--text-muted)'}; border-bottom: 3px solid ${this.activeTab === 'sms' ? 'var(--gold-500)' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: all 0.2s;">
              📲 SMS & WhatsApp Alerts
              <span class="badge" style="background: #eff6ff; color: #1e40af;">${smsNotifications.length}</span>
            </button>
          </div>

          <!-- Dynamic Tab Content Root -->
          <div id="parent-portal-tab-content">
            ${this.renderTabContent()}
          </div>
        </div>
      </section>
    `;
  },

  renderTabContent() {
    if (this.activeTab === 'applications') {
      return this.renderApplicationsTab();
    } else if (this.activeTab === 'invoices') {
      return this.renderInvoicesTab();
    } else if (this.activeTab === 'reports') {
      return this.renderReportCardsTab();
    } else if (this.activeTab === 'transport') {
      return this.renderTransportTab();
    } else if (this.activeTab === 'clubs') {
      return this.renderClubsTab();
    } else if (this.activeTab === 'alumni') {
      return this.renderAlumniTab();
    } else if (this.activeTab === 'health') {
      return this.renderHealthTab();
    } else if (this.activeTab === 'library') {
      return this.renderLibraryTab();
    } else if (this.activeTab === 'digital-id') {
      return this.renderDigitalIDTab();
    } else if (this.activeTab === 'tutors') {
      return this.renderTutorsTab();
    } else if (this.activeTab === 'sms') {
      return this.renderSMSTab();
    } else if (this.activeTab === 'inquiries') {
      return this.renderInquiriesTab();
    } else {
      return this.renderBookmarksTab();
    }
  },

  renderTutorsTab() {
    return `
      <div style="background: #fff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-size: 0.78rem; font-weight: 700; color: #047857; text-transform: uppercase;">Portal Integration</span>
            <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0 0;">
              Your Active Private Home Tutors & Exam Coaches
            </h2>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.25rem 0 0 0;">
              Verified educators hired from the <strong>SkoolFinder Teach (/teachers)</strong> marketplace.
            </p>
          </div>
          <button class="btn-pill btn-emerald" onclick="App.navigate('teachers')">
            <span>🔍</span> Browse & Hire More Tutors on /teachers &rarr;
          </button>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #fff; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.8rem;">
              👨‍🏫
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #065f46; margin: 0;">Mr. Emmanuel Addo</h3>
                <span class="badge badge-emerald" style="font-size: 0.7rem;">🛡️ NTC Certified</span>
              </div>
              <div style="font-size: 0.82rem; color: #166534; margin-top: 0.2rem;">
                Assigned Student: <strong>Kwame Mensah (JHS 1)</strong> • Subject: <strong>Physics & Core Mathematics</strong>
              </div>
              <div style="font-size: 0.78rem; color: #047857; margin-top: 0.2rem;">
                ⏰ Schedule: <strong>Tuesdays & Thursdays (4:30 PM)</strong> • Location: <strong>In-Person at East Legon Home</strong>
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: #065f46;">GH₵ 120 / hr</div>
            <div style="font-size: 0.75rem; color: #047857; margin-bottom: 0.5rem;">Settled via Paystack MoMo</div>
            <a href="https://wa.me/233244556677?text=Hello%20Mr.%20Emmanuel,%20confirming%20Kwame's%20maths%20session%20today." target="_blank" class="btn-pill btn-emerald" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
              WhatsApp Tutor &rarr;
            </a>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center;">
          <p style="font-size: 0.9rem; color: #475569; margin: 0 0 1rem 0;">
            Need help with Cambridge IGCSE, French, Phonics, or Coding? Hire verified educators directly.
          </p>
          <button class="btn-pill btn-outline" onclick="App.navigate('teachers')">
            <span>🧑‍🏫</span> Open Teachers Portal (/teachers)
          </button>
        </div>
      </div>
    `;
  },

  renderReportCardsTab() {
    const reportCards = this.overviewData?.reportCards || [];

    if (reportCards.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); margin-bottom: 0.5rem;">No Published Terminal Reports Yet</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            When your wards' teachers complete continuous assessment calculations and headmasters certify terminal exam scores, stamped PDF report cards will appear here.
          </p>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Banner Intro -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; box-shadow: var(--shadow-md);">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">
              Ghana MoE & Cambridge Assessment Engine
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              Student Terminal Report Cards & Academic Analytics
            </h2>
            <p style="color: #cbd5e1; font-size: 0.9rem; margin: 0; max-width: 600px; line-height: 1.5;">
              Continuous assessment tracking (30% Classwork/Projects + 70% Terminal Examination), official headmaster remarks, conduct evaluation matrix, and verified PDF download with official Ghana certification stamps.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius-lg); padding: 0.85rem 1.25rem; text-align: center;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--gold-400);">${reportCards.length}</div>
              <div style="font-size: 0.72rem; color: #e2e8f0; text-transform: uppercase; font-weight: 700;">Certified Terms</div>
            </div>
          </div>
        </div>

        <!-- Report Card Items -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.75rem;">
          ${reportCards.map(rc => {
            const topSubjects = (rc.subjects || []).slice(0, 4);
            const attendancePct = Math.round(((rc.attendance?.timesPresent || 59) / (rc.attendance?.timesSchoolOpened || 60)) * 100);

            return `
              <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid var(--border-color); padding: 2rem; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
                <!-- Decorative Top Strip -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #059669, #3b82f6, #f59e0b);"></div>

                <!-- Top Header Row -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                  <div style="display: flex; gap: 1.25rem; align-items: center;">
                    <div style="font-size: 2.8rem; background: var(--bg-main); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--border-color);">
                      🎓
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
                        <h3 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                          ${rc.studentName}
                        </h3>
                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 700; border: 1px solid #a7f3d0;">
                          ${rc.studentId}
                        </span>
                      </div>
                      <div style="font-size: 0.88rem; color: var(--text-muted);">
                        🏫 <strong>${rc.schoolName}</strong> &nbsp;•&nbsp; ${rc.studentGrade}
                      </div>
                      <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
                        📅 ${rc.term} (${rc.academicYear}) &nbsp;•&nbsp; Class Tutor: ${rc.classTeacher}
                      </div>
                    </div>
                  </div>

                  <!-- Rank & Classification Pill -->
                  <div style="text-align: right;">
                    <div style="display: inline-block; background: #fef3c7; border: 1px solid #fde68a; border-radius: var(--radius-lg); padding: 0.5rem 1rem; margin-bottom: 0.5rem;">
                      <div style="font-size: 0.72rem; font-weight: 800; color: #92400e; text-transform: uppercase;">Class Rank / Position</div>
                      <div style="font-size: 1.25rem; font-weight: 900; color: #b45309;">
                        ⭐ ${rc.positionInClass} <small style="font-size: 0.8rem; font-weight: 600;">(${rc.positionSuffix || 'in class'})</small>
                      </div>
                    </div>
                    <div>
                      <span class="badge" style="background: #059669; color: #ffffff; font-weight: 700;">
                        ✓ Stamped & Certified by Principal
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 4 Performance Summary Blocks -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Overall Average</div>
                    <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 900; color: #1e3a8a; margin: 0.2rem 0;">
                      ${rc.overallAverage}%
                    </div>
                    <div style="font-size: 0.75rem; font-weight: 700; color: #059669;">Grade ${rc.overallGrade} (Distinction)</div>
                  </div>

                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Aggregate Marks</div>
                    <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 900; color: #0f172a; margin: 0.2rem 0;">
                      ${rc.overallTotalMarks} <span style="font-size: 0.95rem; color: #94a3b8; font-weight: 600;">/ ${rc.overallMaxMarks}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #64748b;">${rc.subjects?.length || 9} Subjects Tested</div>
                  </div>

                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Attendance Record</div>
                    <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 900; color: #059669; margin: 0.2rem 0;">
                      ${rc.attendance?.timesPresent || 59} <span style="font-size: 0.95rem; color: #94a3b8; font-weight: 600;">/ ${rc.attendance?.timesSchoolOpened || 60}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #059669; font-weight: 700;">${attendancePct}% Punctuality Rating</div>
                  </div>

                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Next Term Resumes</div>
                    <div style="font-size: 1.05rem; font-weight: 800; color: #b45309; margin: 0.4rem 0 0.2rem 0;">
                      ${rc.nextTermBegins}
                    </div>
                    <div style="font-size: 0.72rem; color: #64748b;">Term 2 (Second Term)</div>
                  </div>
                </div>

                <!-- Key Subject Mastery Bars -->
                <div style="margin-bottom: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                  <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--gold-600); margin-bottom: 0.85rem; letter-spacing: 0.05em;">
                    Subject Mastery & Continuous Assessment:
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                    ${topSubjects.map(sub => `
                      <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 10px; padding: 0.75rem 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-size: 0.82rem;">
                          <span style="font-weight: 700; color: var(--primary-900);">${sub.name}</span>
                          <strong style="color: #059669;">${sub.totalScore}% (${sub.grade})</strong>
                        </div>
                        <div style="height: 6px; background: var(--border-light); border-radius: 3px; overflow: hidden;">
                          <div style="width: ${sub.totalScore}%; height: 100%; background: ${sub.totalScore >= 80 ? 'var(--gradient-emerald)' : 'var(--gradient-gold)'}; border-radius: 3px; transition: width 0.8s ease;"></div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Headmaster & Class Teacher Remarks Preview -->
                <div style="border-left: 3px solid #059669; background: #f0fdf4; border-radius: 0 var(--radius-md) var(--radius-md) 0; padding: 0.85rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.88rem; line-height: 1.5; color: #166534;">
                  <strong>Head of School's Remark:</strong> "${rc.headTeacherRemark}"
                  <div style="font-size: 0.75rem; color: #15803d; margin-top: 0.25rem;">
                    — ${rc.headTeacher} (${rc.headTeacherRole || 'Principal'})
                  </div>
                </div>

                <!-- Actions Bar -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
                    <span>🔒 Digital Hash:</span>
                    <span style="font-family: monospace; font-size: 0.75rem; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px;">
                      ${rc.verificationHash}
                    </span>
                  </div>

                  <div style="display: flex; gap: 0.75rem;">
                    <button class="btn-pill btn-primary btn-view-report-card" data-rcid="${rc.id}" style="font-size: 0.88rem; padding: 0.6rem 1.4rem;">
                      📄 View & Download Certified Terminal Report Card &rarr;
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderInvoicesTab() {
    const invoices = this.overviewData?.invoices || [];

    if (invoices.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); margin-bottom: 0.5rem;">No Outstanding Fee Invoices Found</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            Your school bills will automatically appear here when issued by your school bursar, complete with MoMo installment options and digital receipting.
          </p>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        ${invoices.map(inv => {
          const total = Number(inv.totalAmount) || 0;
          const paid = Number(inv.amountPaid) || 0;
          const balance = Number(inv.balanceDue) || 0;
          const percentPaid = total > 0 ? Math.round((paid / total) * 100) : 0;
          const statusBadge = this.getInvoiceStatusBadge(inv.status);

          return `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 1.75rem; box-shadow: var(--shadow-sm);">
              <!-- Top Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
                      🏫 ${inv.schoolName}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">• Term Bill: <code>${inv.invoiceNumber}</code></span>
                  </div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                    ${inv.studentName} &nbsp;<span style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">(${inv.studentGrade})</span>
                  </h3>
                  <div style="font-size: 0.85rem; color: var(--text-dark); margin-top: 0.25rem;">
                    Academic Term: <strong>${inv.term}</strong> &nbsp;|&nbsp; Due Date: <strong style="color: var(--rose-600);">${inv.dueDate}</strong>
                  </div>
                </div>

                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                  ${statusBadge}
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    BoG & MoE Certified E-Billing
                  </div>
                </div>
              </div>

              <!-- Financial Status & Progress Bar -->
              <div style="background: #f8fafc; border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem; border: 1px solid var(--border-color);">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1rem; text-align: center;">
                  <div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Billed</div>
                    <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900);">
                      GH₵ ${total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Paid to Date</div>
                    <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--emerald-600);">
                      GH₵ ${paid.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Balance Outstanding</div>
                    <div style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: ${balance > 0 ? 'var(--rose-600)' : 'var(--emerald-600)'};">
                      GH₵ ${balance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <!-- Settlement Progress Bar -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <span style="color: var(--text-muted);">Fee Clearance Progress</span>
                    <span style="color: ${percentPaid === 100 ? 'var(--emerald-600)' : 'var(--primary-800)'};">${percentPaid}% Settled</span>
                  </div>
                  <div style="height: 10px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                    <div style="width: ${percentPaid}%; height: 100%; background: ${percentPaid === 100 ? 'var(--emerald-500)' : 'linear-gradient(90deg, var(--gold-500), var(--emerald-500))'}; transition: width 0.5s ease;"></div>
                  </div>
                </div>
              </div>

              <!-- Itemized Breakdown (Accordion / Collapsible) -->
              <details style="margin-bottom: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                <summary style="padding: 0.75rem 1rem; background: #ffffff; cursor: pointer; font-size: 0.85rem; font-weight: 700; color: var(--primary-900); display: flex; justify-content: space-between; align-items: center;">
                  <span>📋 View Itemized Fee Schedule (${inv.lineItems?.length || 0} line items)</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Click to expand</span>
                </summary>
                <div style="padding: 0.75rem 1rem; background: #fdfdfd; border-top: 1px solid var(--border-color);">
                  ${(inv.lineItems || []).map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.82rem; border-bottom: 1px dashed #f1f5f9;">
                      <span style="color: var(--text-dark);">${item.description}</span>
                      <span style="font-weight: 700; color: var(--primary-900);">GH₵ ${Number(item.amount).toLocaleString()}</span>
                    </div>
                  `).join('')}
                </div>
              </details>

              <!-- Payment History & Verified Receipts -->
              ${inv.paymentHistory && inv.paymentHistory.length > 0 ? `
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                    <span>✓</span> CONFIRMED PAYMENTS & OFFICIAL DIGITAL RECEIPTS
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${inv.paymentHistory.map(pay => `
                      <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid #dcfce7; font-size: 0.82rem;">
                        <div>
                          <strong>GH₵ ${Number(pay.amount).toLocaleString()}</strong> paid via <strong>${pay.method}</strong> 
                          <span style="color: var(--text-muted); font-size: 0.75rem;">(${pay.date ? new Date(pay.date).toLocaleDateString() : 'Recent'})</span>
                          <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">Receipt: ${pay.receiptNumber} | Ref: ${pay.transactionRef}</div>
                        </div>
                        <button class="btn-pill btn-outline btn-view-momo-receipt" data-invid="${inv.id}" data-payid="${pay.id}" style="font-size: 0.75rem; padding: 0.3rem 0.75rem; border-color: #86efac; color: #166534;">
                          🧾 View Receipt
                        </button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Actions Bar -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 0.5rem;">
                <div style="font-size: 0.82rem; color: var(--text-muted);">
                  💡 Supports MTN Mobile Money, Telecel Cash, AT Money, and Bank Card.
                </div>
                <div style="display: flex; gap: 0.75rem;">
                  ${balance > 0 ? `
                    <button class="btn-pill btn-primary btn-pay-momo" data-invid="${inv.id}" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
                      <span>📱</span> Pay Balance via MoMo (GH₵ ${balance.toLocaleString()})
                    </button>
                  ` : `
                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 800;">
                      ✓ All Fees Cleared for this Term
                    </span>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderApplicationsTab() {
    const { applications } = this.overviewData;

    if (!applications || applications.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); margin-bottom: 0.5rem;">No Active Admission Applications Found</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            You have not submitted an online admission application yet. You can apply directly to verified partner schools with zero paperwork friction.
          </p>
          <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btn-submit-new-admission-empty" class="btn-pill btn-gold" style="font-weight: 700;">
              <span>➕</span> Submit New Admission Application
            </button>
            <button class="btn-pill btn-primary" onclick="App.navigate('directory')">
              Browse Schools & Apply Now
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Top Action Dossier Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: #ffffff; padding: 1.25rem 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--gold-600); text-transform: uppercase;">
              Ghana MoE & GES Unified Admissions
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0.2rem 0 0 0;">
              Candidate Admission Dossiers (${applications.length})
            </h3>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="btn-add-secondary-ward" class="btn-pill btn-outline" style="font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
              <span>👶</span> Add Another Child / Ward
            </button>
            <button id="btn-submit-new-admission" class="btn-pill btn-gold" style="font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);">
              <span>➕</span> Submit New School Admission
            </button>
          </div>
        </div>
        ${applications.map(app => {
          const statusBadge = this.getStatusBadge(app.status);
          const studentName = `${app.student?.firstName || ''} ${app.student?.lastName || ''}`.trim() || 'Student Applicant';
          const grade = app.gradeApplying || 'Class 4';
          const schoolName = app.schoolName || 'Ghana International School (GIS)';
          const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '22 Oct 2026';

          return `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 1.75rem; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
                      🏛️ ${schoolName}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">• Submitted on ${submittedDate}</span>
                  </div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                    ${studentName}
                  </h3>
                  <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Applying for: <strong style="color: var(--primary-800);">${grade}</strong> &nbsp;•&nbsp; 
                    Tracking Ref: <code style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: 700; color: var(--primary-900);">${app.applicationNumber || app.id}</code>
                  </div>
                </div>

                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                  ${statusBadge}
                  <span style="font-size: 0.78rem; color: var(--text-muted);">
                    Payment Status: <strong style="color: var(--emerald-600);">✓ Application Fee Paid</strong>
                  </span>
                </div>
              </div>

              <!-- Application Progress Stepper -->
              <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                  <span>ADMISSION LIFECYCLE PROGRESS</span>
                  <span style="color: var(--primary-700);">Step 3 of 4: Assessment & Interview</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center;">
                  <div style="border-top: 3px solid var(--emerald-500); padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--emerald-700);">✓ 1. Form & Fee</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Completed</div>
                  </div>
                  <div style="border-top: 3px solid var(--emerald-500); padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--emerald-700);">✓ 2. Doc Verification</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Verified</div>
                  </div>
                  <div style="border-top: 3px solid var(--gold-500); padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-700);">⚡ 3. Assessment</div>
                    <div style="font-size: 0.7rem; color: var(--gold-800); font-weight: 600;">Sat 15 Nov, 9:00 AM</div>
                  </div>
                  <div style="border-top: 3px solid #cbd5e1; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">4. Official Offer</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Awaiting Results</div>
                  </div>
                </div>
              </div>

              <!-- Important Notes or Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="font-size: 0.85rem; color: var(--text-dark); max-width: 600px;">
                  💡 <strong>Admissions Office Instructions:</strong> Entrance assessment for ${studentName} covers English Reading Comprehension, Quantitative Reasoning, and an informal oral interaction.
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <button class="btn-pill btn-outline btn-view-slip" data-appid="${app.id}" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                    📄 View Application Slip
                  </button>
                  <button class="btn-pill btn-primary btn-parent-contact" data-schoolid="${app.schoolId || 'sch-gis-accra'}" data-schoolname="${schoolName}" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                    💬 Contact Admissions Officer
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },


  renderSMSTab() {
    const smsList = this.overviewData?.smsNotifications || [];

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase;">
              📲 REAL-TIME CARRIER DELIVERY FEED
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0.25rem 0; color: #ffffff;">
              School Messages Dispatched to Your Mobile Phone
            </h3>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.88rem; margin: 0;">
              All official admission slips, assessment passes, MoMo payment receipts, and weather notices sent via Hubtel/MTN Ghana.
            </p>
          </div>
          <button id="btn-trigger-test-sms" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.5rem 1rem;">
            ⚡ Send Test SMS to My Mobile
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${smsList.map(sms => {
            const timeStr = sms.deliveryTime ? new Date(sms.deliveryTime).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
            const isWA = sms.channel.includes('WhatsApp');
            return `
              <div class="card" style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; gap: 1.25rem; align-items: flex-start;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: ${isWA ? '#ecfdf5' : '#eff6ff'}; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0;">
                  ${isWA ? '💬' : '📱'}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <strong style="color: var(--primary-900); font-size: 0.95rem;">${sms.senderId || 'GIS-ACCRA'}</strong>
                      <span class="badge" style="background: #f1f5f9; color: var(--text-dark); font-size: 0.72rem;">${sms.category}</span>
                      <span style="font-size: 0.75rem; color: var(--emerald-600); font-weight: 700;">${sms.network}</span>
                    </div>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${timeStr}</span>
                  </div>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.85rem 1rem; font-size: 0.88rem; color: var(--text-dark); line-height: 1.5;">
                    ${sms.messageText}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted);">
                    <span>Channel: <strong>${sms.channel}</strong></span>
                    <span style="color: var(--emerald-600); font-weight: 700;">✓ Delivered to ${sms.recipientPhone}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderInquiriesTab() {
    const { inquiries } = this.overviewData;

    if (!inquiries || inquiries.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); margin-bottom: 0.5rem;">No Tour or Direct Inquiries Logged</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            When you request campus visits, book school open-days, or send admissions inquiries to school heads, they will appear here with instant live status updates.
          </p>
          <button class="btn-pill btn-primary" onclick="App.navigate('directory')">
            Find Campuses to Visit
          </button>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${inquiries.map(inq => {
          const inqDate = inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '23 Oct 2026';
          return `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
                      🏫 ${inq.schoolName || 'Ghana International School'}
                    </span>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">• ${inqDate}</span>
                  </div>
                  <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--primary-900); margin: 0 0 0.5rem 0;">
                    ${inq.type === 'tour' ? '🚶 In-Person Campus Tour & Facility Inspection' : '❓ Direct Admission & Fee Structure Inquiry'}
                  </h4>
                  <p style="color: var(--text-dark); font-size: 0.9rem; margin: 0 0 0.75rem 0; line-height: 1.5; background: #f8fafc; padding: 0.75rem 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary-500);">
                    "${inq.message || 'We would like to book an appointment to tour the Cantonments primary science laboratory and sports complex ahead of Term 2 registration.'}"
                  </p>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">
                    Scheduled Time: <strong style="color: var(--primary-900);">${inq.tourDate || 'Friday, 31 October 2026 at 10:30 AM'}</strong>
                  </div>
                </div>

                <div style="text-align: right;">
                  <span class="badge" style="background: var(--emerald-50); color: var(--emerald-700); border: 1px solid var(--emerald-200); font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">
                    ✓ Confirmed by Admissions
                  </span>
                  <div style="margin-top: 0.75rem;">
                    <button class="btn-pill btn-outline btn-tour-details" data-schoolid="${inq.schoolId || 'sch-gis-accra'}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
                      📍 View Campus Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderBookmarksTab() {
    const { savedSchools } = this.overviewData;

    if (!savedSchools || savedSchools.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔖</div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); margin-bottom: 0.5rem;">No Shortlisted Campuses Yet</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
            Click the bookmark icon on any school in the directory to save them here for side-by-side fee comparisons, curricula evaluation, and quick application.
          </p>
          <button class="btn-pill btn-primary" onclick="App.navigate('directory')">
            Explore School Directory
          </button>
        </div>
      `;
    }

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
            Showing ${savedSchools.length} shortlisted schools for Kwame Mensah
          </span>
          <button class="btn-pill btn-secondary" onclick="App.navigate('compare')" style="font-size: 0.82rem;">
            ⚖️ Open Detailed Side-by-Side Comparison
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
          ${savedSchools.map(school => `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
              <div style="height: 140px; background-size: cover; background-position: center; position: relative; background-image: url('${school.coverImage || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'}');">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%);"></div>
                <div style="position: absolute; top: 0.75rem; right: 0.75rem;">
                  <button class="btn-bookmark-remove" data-schoolid="${school.id}" title="Remove Bookmark" style="background: rgba(255,255,255,0.9); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--rose-600); font-weight: 700; box-shadow: var(--shadow-sm);">
                    ✕
                  </button>
                </div>
                <div style="position: absolute; bottom: 0.75rem; left: 1rem; color: #ffffff;">
                  <span class="badge" style="background: var(--gold-500); color: #000; font-weight: 700; font-size: 0.72rem;">
                    ${school.curriculum}
                  </span>
                </div>
              </div>

              <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.25rem 0;">
                    ${school.name}
                  </h4>
                  <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                    📍 ${school.suburb}, ${school.region} &nbsp;•&nbsp; ⭐ ${school.rating} / 5.0
                  </div>
                  <div style="font-size: 0.85rem; color: var(--text-dark); margin-bottom: 1rem;">
                    Estimated Fee: <strong style="color: var(--primary-900);">${school.feeStructure?.tuitionPerTerm || 'GH₵ 8,500 - 14,000 / term'}</strong>
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                  <button class="btn-pill btn-outline" style="flex: 1; font-size: 0.8rem; padding: 0.4rem;" onclick="App.navigate('school-detail', '${school.id}')">
                    View Profile
                  </button>
                  <button class="btn-pill btn-primary" style="flex: 1; font-size: 0.8rem; padding: 0.4rem;" onclick="Modals.openAdmissionModal('${school.id}', '${school.name.replace(/'/g, "\\'")}', '${school.admissionFee || 'GH₵ 250'}')">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },


  renderTransportTab() {
    const busPass = this.overviewData?.busPass || {
      studentName: "Kwame Mensah",
      studentGrade: "Primary Class 5",
      seatNumber: "14",
      routeNumber: "Route 01",
      routeName: "East Legon & Airport Residential Shuttle",
      busPlate: "GN-4921-26",
      busModel: "Toyota Coaster AC Luxury",
      pickupLandmark: "East Legon - Underbridge Shell Forecourt & Canopy",
      morningPickupTime: "06:55 AM",
      afternoonDropoffTime: "04:15 PM",
      status: "Active",
      driver: { name: "Daniel Boateng", phone: "+233 24 883 1029", licenseClass: "DVLA Commercial Class F" },
      chaperone: { name: "Grace Mensah (Auntie Grace)", phone: "+233 50 491 8820", role: "Certified Bus Matron" },
      liveRoute: { status: "In Transit", currentStopName: "East Legon (Underbridge Shell)" }
    };

    const routes = this.overviewData?.transportRoutes || [
      {
        id: "rte-gis-01",
        routeNumber: "Route 01",
        name: "East Legon & Airport Residential Shuttle",
        busPlate: "GN-4921-26",
        driver: { name: "Daniel Boateng", phone: "+233 24 883 1029" },
        status: "In Transit",
        stops: [
          { name: "Cantonments Depot", scheduledTime: "06:15 AM", status: "completed" },
          { name: "Airport Residential", scheduledTime: "06:35 AM", status: "completed" },
          { name: "East Legon Shell (Kwame Stop)", scheduledTime: "06:55 AM", status: "in_transit" },
          { name: "American House Roundabout", scheduledTime: "07:10 AM", status: "scheduled" },
          { name: "GIS Junior Campus Arrival", scheduledTime: "07:30 AM", status: "scheduled" }
        ]
      },
      {
        id: "rte-gis-02",
        routeNumber: "Route 02",
        name: "Spintex Coastal & Batsonaa Express",
        busPlate: "GT-3882-25",
        driver: { name: "Emmanuel Tetteh", phone: "+233 20 719 3341" },
        status: "Delayed (15 mins)",
        delayReason: "Gridlock at Spintex Underbridge bypass",
        stops: [
          { name: "GIS Depot", scheduledTime: "06:20 AM", status: "completed" },
          { name: "Manet Junction", scheduledTime: "06:45 AM", status: "in_transit" },
          { name: "Texpo Total", scheduledTime: "07:05 AM", status: "scheduled" },
          { name: "Batsonaa Railway", scheduledTime: "07:20 AM", status: "scheduled" },
          { name: "GIS Campus Arrival", scheduledTime: "07:45 AM", status: "scheduled" }
        ]
      }
    ];

    const isDelayed = (busPass.liveRoute?.status || '').includes('Delayed');

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Fleet Banner Intro -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; box-shadow: var(--shadow-md); border-bottom: 3px solid #f59e0b;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">
              Ghana MoT & GES Certified School Fleet System
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              🚌 School Bus & Live Transit Hub
            </h2>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.92rem; max-width: 620px;">
              Live tracking, assigned seat verification, driver & chaperone DVLA credentials, and automated traffic delay broadcasts for your enrolled children.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-pill btn-parent-open-bus-pass" style="background: #f59e0b; color: #0f172a; font-weight: 800; border: none; padding: 0.75rem 1.4rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
              <span>🎫</span> View Digital Boarding Pass
            </button>
            <button class="btn-pill btn-parent-track-bus" style="background: rgba(255,255,255,0.15); color: #ffffff; font-weight: 700; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <span>📍</span> Live Route Timeline
            </button>
          </div>
        </div>

        <!-- Student Transit Pass Showcase Card -->
        <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden;">
          <div style="background: #f8fafc; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="font-size: 2rem;">🪪</div>
              <div>
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">
                  Enrolled Ward Shuttle Pass
                </div>
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900);">
                  ${busPass.studentName} (${busPass.studentGrade})
                </div>
              </div>
            </div>

            <!-- Seat & Live Status -->
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="badge" style="background: ${isDelayed ? '#fef2f2' : '#ecfdf5'}; color: ${isDelayed ? '#991b1b' : '#065f46'}; border: 1px solid ${isDelayed ? '#fecaca' : '#a7f3d0'}; font-weight: 800; padding: 0.45rem 0.95rem; font-size: 0.85rem; border-radius: 9999px;">
                ● ${busPass.liveRoute?.status || 'In Transit'}
              </span>
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 0.4rem 0.85rem; border-radius: 10px; font-weight: 900; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);">
                Seat #${busPass.seatNumber}
              </div>
            </div>
          </div>

          <div style="padding: 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Assigned Route & Vehicle</div>
                <div style="font-size: 1rem; font-weight: 800; color: var(--primary-900); margin-top: 0.25rem;">
                  ${busPass.routeNumber}: ${busPass.routeName}
                </div>
                <div style="font-size: 0.82rem; color: #475569; margin-top: 0.35rem;">
                  Plate: <strong style="color: #0f172a;">${busPass.busPlate}</strong> (${busPass.busModel})
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Designated Pickup Stop</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--primary-900); margin-top: 0.25rem;">
                  📍 ${busPass.pickupLandmark}
                </div>
                <div style="font-size: 0.82rem; color: #475569; margin-top: 0.35rem;">
                  Morning: <strong style="color: #059669;">${busPass.morningPickupTime}</strong> • Afternoon: <strong style="color: #1e40af;">${busPass.afternoonDropoffTime}</strong>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Personnel on Board</div>
                <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.35rem; font-size: 0.85rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>👨🏿‍✈️ <strong>${busPass.driver?.name}</strong> (Driver)</span>
                    <a href="tel:${busPass.driver?.phone}" style="color: #2563eb; font-weight: 700; font-size: 0.78rem; text-decoration: none;">📞 Call</a>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>👩🏿‍⚕️ <strong>${busPass.chaperone?.name}</strong> (Matron)</span>
                    <a href="tel:${busPass.chaperone?.phone}" style="color: #2563eb; font-weight: 700; font-size: 0.78rem; text-decoration: none;">📞 Call</a>
                  </div>
                </div>
              </div>

            </div>

            <!-- Bus Route Tracker Interactive Timeline -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 1.5rem 1.25rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-900); display: flex; align-items: center; gap: 0.5rem;">
                  <span>📍</span> Live Bus Route Stations & Telematics
                </div>
                <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; font-size: 0.72rem;">
                  ● Current: ${busPass.liveRoute?.currentStopName || 'East Legon Shell'}
                </span>
              </div>

              <div class="bus-timeline-container">
                <div class="bus-timeline-track">
                  <div class="bus-timeline-track-progress" style="width: 55%;"></div>
                </div>

                <div class="bus-station-node">
                  <div class="bus-node-circle passed">✓</div>
                  <div style="font-weight: 700; font-size: 0.75rem; color: var(--primary-900); margin-top: 0.4rem;">Cantonments</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">06:15 AM</div>
                </div>

                <div class="bus-station-node">
                  <div class="bus-node-circle passed">✓</div>
                  <div style="font-weight: 700; font-size: 0.75rem; color: var(--primary-900); margin-top: 0.4rem;">Airport Res.</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">06:35 AM</div>
                </div>

                <div class="bus-station-node">
                  <div class="bus-node-circle active">🚌</div>
                  <div style="font-weight: 800; font-size: 0.75rem; color: var(--gold-600); margin-top: 0.4rem;">East Legon</div>
                  <div style="font-size: 0.65rem; color: var(--emerald-600); font-weight: 700;">Boarding Now</div>
                </div>

                <div class="bus-station-node">
                  <div class="bus-node-circle">⏳</div>
                  <div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">American House</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">07:10 AM ETA</div>
                </div>

                <div class="bus-station-node">
                  <div class="bus-node-circle">🏫</div>
                  <div style="font-weight: 700; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">GIS Campus</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">07:30 AM ETA</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- All School Shuttle Routes Directory -->
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--primary-900); margin: 0 0 1rem 0;">
            All Ghana International School Shuttle Routes
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            ${routes.map(r => `
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div>
                      <span class="badge" style="background: #f1f5f9; color: #1e293b; font-weight: 800; font-size: 0.75rem;">
                        ${r.routeNumber}
                      </span>
                      <h4 style="margin: 0.35rem 0 0 0; font-size: 1rem; font-weight: 800; color: var(--primary-900);">
                        ${r.name}
                      </h4>
                    </div>
                    <span class="badge" style="background: ${r.status.includes('Delayed') ? '#fee2e2' : '#dcfce7'}; color: ${r.status.includes('Delayed') ? '#991b1b' : '#166534'}; font-weight: 700; font-size: 0.72rem;">
                      ${r.status}
                    </span>
                  </div>

                  <div style="font-size: 0.82rem; color: #475569; margin-bottom: 0.75rem;">
                    <div>🚐 Plate: <strong>${r.busPlate}</strong></div>
                    <div>👨🏿‍✈️ Driver: <strong>${r.driver?.name}</strong> (${r.driver?.phone})</div>
                    <div>🛑 Stops: <strong>${r.stops?.length || 5} Major Landmarks</strong></div>
                  </div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.85rem; display: flex; justify-content: flex-end;">
                  <button class="btn-pill btn-outline btn-inspect-route" data-routeid="${r.id}" style="font-size: 0.78rem; padding: 0.4rem 0.85rem;">
                    📍 View Route Timeline
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },


  renderClubsTab() {
    const memberships = this.overviewData?.clubMemberships || [];
    const availableClubs = this.overviewData?.availableClubs || [];
    const enrolledIds = memberships.map(m => m.clubId);

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Academy Banner Intro -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; box-shadow: var(--shadow-md); border-bottom: 3px solid #10b981;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #6ee7b7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">
              Ghana Co-Curricular & Enrichment Academy
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              🥋 Co-Curricular & After-School Clubs
            </h2>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.92rem; max-width: 620px;">
              Empower your children through competitive robotics, national debate, Olympic aquatics, cadet corps leadership, and performing arts.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.6rem 1.25rem; border-radius: 12px; text-align: center;">
              <div style="font-size: 0.7rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700;">Enrolled Clubs</div>
              <div style="font-size: 1.4rem; font-weight: 900; color: #ffffff;">${memberships.length} Activities</div>
            </div>
          </div>
        </div>

        <!-- Section 1: Enrolled Clubs for Kwame Mensah -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                ⭐ Kwame Mensah's Active Club Memberships
              </h3>
              <p style="margin: 0.2rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                Term 1 2026/2027 confirmed enrollments with verified merit badges and national tournament fixtures.
              </p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
            ${memberships.map(m => `
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="width: 48px; height: 48px; background: #ecfdf5; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid #a7f3d0;">
                        ${m.icon}
                      </div>
                      <div>
                        <span class="badge" style="background: #eff6ff; color: #1e40af; font-size: 0.72rem; font-weight: 700;">
                          ${m.category}
                        </span>
                        <h4 style="margin: 0.25rem 0 0 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">
                          ${m.clubName}
                        </h4>
                      </div>
                    </div>

                    <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.6rem; border-radius: 9999px;">
                      ✓ Dues Paid
                    </span>
                  </div>

                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem;">
                    <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Assigned Pupil Role</div>
                    <div style="font-size: 0.95rem; font-weight: 800; color: #065f46; margin-top: 0.15rem;">
                      ${m.studentDetails.role}
                    </div>
                    <div style="font-size: 0.75rem; color: #475569; margin-top: 0.25rem;">
                      🗓️ ${m.meetingSchedule} • 📍 ${m.venue}
                    </div>
                  </div>

                  <!-- Milestone Badges -->
                  <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 0.35rem;">Awarded Badges:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                      ${(m.studentDetails.meritBadges || []).map(b => `
                        <span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.55rem;">
                          ${b}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                  <button class="btn-pill btn-outline btn-parent-club-fixtures" data-clubid="${m.clubId}" style="font-size: 0.78rem; padding: 0.4rem 0.75rem;">
                    🏆 Fixtures (${m.competitions?.length || 0})
                  </button>
                  <button class="btn-pill btn-primary btn-parent-open-club-details" data-clubid="${m.clubId}" style="font-size: 0.78rem; padding: 0.4rem 0.85rem;">
                    View Pass & Details &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 2: Available Term 1 Clubs Directory -->
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.4rem 0;">
            🏫 Explore All GIS After-School Clubs
          </h3>
          <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-muted);">
            Enroll additional activities with instant Mobile Money checkout (MTN MoMo, Telecel Cash, AT Money).
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            ${availableClubs.map(club => {
              const isEnrolled = enrolledIds.includes(club.id);

              return `
                <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <span style="font-size: 1.75rem;">${club.icon}</span>
                        <div>
                          <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 700;">
                            ${club.category}
                          </span>
                          <h4 style="margin: 0.2rem 0 0 0; font-size: 1rem; font-weight: 800; color: var(--primary-900);">
                            ${club.name}
                          </h4>
                        </div>
                      </div>
                      ${isEnrolled ? `
                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; font-size: 0.7rem;">
                          Enrolled
                        </span>
                      ` : `
                        <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.72rem;">
                          GH₵ ${club.termFeeGHS}
                        </span>
                      `}
                    </div>

                    <p style="font-size: 0.82rem; color: #475569; margin: 0.5rem 0 0.75rem 0; line-height: 1.4;">
                      ${club.tagline}
                    </p>

                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem;">
                      <div>🗓️ ${club.meetingSchedule}</div>
                      <div>👨🏿‍🏫 Patron: <strong>${club.patron?.name}</strong></div>
                      <div>👥 Enrolled: <strong>${club.enrolledCount} / ${club.capacity} Students</strong></div>
                    </div>
                  </div>

                  <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <button class="btn-pill btn-outline btn-parent-open-club-details" data-clubid="${club.id}" style="font-size: 0.78rem; padding: 0.4rem 0.75rem;">
                      Details
                    </button>
                    ${!isEnrolled ? `
                      <button class="btn-pill btn-gold btn-parent-enroll-club" data-clubid="${club.id}" style="font-size: 0.78rem; padding: 0.4rem 0.95rem; font-weight: 800;">
                        ➕ Enroll (GH₵ ${club.termFeeGHS})
                      </button>
                    ` : `
                      <button class="btn-pill btn-primary btn-parent-open-club-details" data-clubid="${club.id}" style="font-size: 0.78rem; padding: 0.4rem 0.85rem;">
                        View Pass
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  },


  renderAlumniTab() {
    const bookings = this.overviewData?.alumniBookings || [];
    const mentors = this.overviewData?.featuredMentors || [];

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Alumni Academy Banner -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; box-shadow: var(--shadow-md); border-bottom: 3px solid #f59e0b;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">
              Ghana Global Alumni & Tertiary Pathway Network
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              🎓 Alumni Mentorship & Career Guidance
            </h2>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.92rem; max-width: 650px;">
              Connect your wards directly with distinguished GIS & Ghanaian alumni excelling globally across FinTech, Medicine, Investment Banking, AI, and Law.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.6rem 1.25rem; border-radius: 12px; text-align: center;">
              <div style="font-size: 0.68rem; color: #fef3c7; text-transform: uppercase; font-weight: 700;">Scheduled Sessions</div>
              <div style="font-size: 1.35rem; font-weight: 900; color: #ffffff;">${bookings.length} Booked</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.6rem 1.25rem; border-radius: 12px; text-align: center;">
              <div style="font-size: 0.68rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700;">Active Mentors</div>
              <div style="font-size: 1.35rem; font-weight: 900; color: #ffffff;">${mentors.length}+ Available</div>
            </div>
          </div>
        </div>

        <!-- Section 1: Booked Virtual Mentorship Sessions -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                ⭐ Confirmed 1-on-1 Guidance Sessions
              </h3>
              <p style="margin: 0.2rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                Scheduled virtual mentoring calls with verified Google Meet links and prep guides.
              </p>
            </div>
          </div>

          ${bookings.length === 0 ? `
            <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); padding: 2.5rem 1.5rem; text-align: center;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📅</div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-900); margin: 0 0 0.35rem 0;">No Upcoming Sessions Booked</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0;">Select a distinguished alumni mentor below to book a free 45-minute virtual guidance session.</p>
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
              ${bookings.map(b => `
                <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid #2563eb;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 48px; height: 48px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid #bfdbfe;">
                          ${b.mentorAvatar || '🎓'}
                        </div>
                        <div>
                          <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">
                            ${b.mentorName}
                          </h4>
                          <div style="font-size: 0.78rem; color: #0369a1; font-weight: 700;">
                            ${b.mentorRole}
                          </div>
                        </div>
                      </div>

                      <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.6rem; border-radius: 9999px;">
                        ✓ ${b.status}
                      </span>
                    </div>

                    <!-- Session Metadata -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem; font-size: 0.82rem;">
                      <div style="margin-bottom: 0.35rem; color: #475569;">
                        Candidate: <strong>${b.studentName}</strong> (${b.gradeLevel})
                      </div>
                      <div style="margin-bottom: 0.35rem; color: #0284c7; font-weight: 700;">
                        🗓️ ${b.scheduledDate} • ⏰ ${b.scheduledTime}
                      </div>
                      <div style="color: #0f172a; font-weight: 700; line-height: 1.4;">
                        🎯 ${b.topic}
                      </div>
                    </div>
                  </div>

                  <div style="border-top: 1px solid #f1f5f9; padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <button class="btn-pill btn-outline btn-parent-view-session" data-bookingid="${b.id}" style="font-size: 0.78rem; padding: 0.4rem 0.85rem;">
                      Session Details & Prep
                    </button>
                    <a href="${b.meetingLink}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-primary" style="font-size: 0.78rem; padding: 0.45rem 1rem; text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; gap: 0.35rem; background: #2563eb;">
                      <span>🎥</span> Join Google Meet
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Section 2: Explore Distinguished Alumni Directory -->
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.4rem 0;">
            🌍 Explore GIS & Partner Alumni Mentors
          </h3>
          <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-muted);">
            Book complimentary 45-minute virtual career advisory sessions with verified Ghanaian leaders worldwide.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
            ${mentors.map(mentor => `
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.35rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="width: 50px; height: 50px; border-radius: 50%; background: #f8fafc; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                        ${mentor.avatar || '🎓'}
                      </div>
                      <div>
                        <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 700;">
                          ${mentor.industry}
                        </span>
                        <h4 style="margin: 0.2rem 0 0 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">
                          ${mentor.name}
                        </h4>
                      </div>
                    </div>

                    <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.7rem;">
                      ${mentor.classYear}
                    </span>
                  </div>

                  <div style="font-size: 0.82rem; color: #334155; margin-bottom: 0.6rem; font-weight: 700;">
                    💼 ${mentor.currentRole} • ${mentor.company}
                  </div>

                  <div style="font-size: 0.78rem; color: #0284c7; margin-bottom: 0.75rem; background: #f0f9ff; padding: 0.45rem 0.65rem; border-radius: 6px; border: 1px solid #bae6fd;">
                    🏛️ ${mentor.tertiaryUniversity}
                  </div>

                  <p style="font-size: 0.82rem; color: #475569; line-height: 1.45; margin: 0 0 0.85rem 0;">
                    ${mentor.bio.slice(0, 140)}...
                  </p>

                  <div style="font-size: 0.74rem; color: #64748b; margin-bottom: 0.75rem;">
                    🗓️ ${mentor.mentoringAvailability}
                  </div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                  <button class="btn-pill btn-outline btn-parent-alumni-profile" data-mentorid="${mentor.id}" style="font-size: 0.78rem; padding: 0.4rem 0.75rem;">
                    View Journey
                  </button>
                  <button class="btn-pill btn-primary btn-parent-book-mentorship" data-mentorid="${mentor.id}" style="font-size: 0.78rem; padding: 0.4rem 0.95rem; font-weight: 800; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);">
                    📅 Book Session
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  renderHealthTab() {
    const rawRecord = this.overviewData?.medicalRecord || {};
    const medRecord = {
      studentName: rawRecord.studentName || 'Kwame Mensah',
      gradeLevel: rawRecord.gradeLevel || rawRecord.grade || 'Grade 8 Gold',
      bloodGroup: rawRecord.bloodGroup || 'O+',
      genotype: rawRecord.genotype || 'AA',
      nhisNumber: rawRecord.nhisNumber || 'GH-NHIS-2026-9021-O',
      allergies: (rawRecord.allergies || ['Severe Groundnut / Peanut Anaphylaxis']).map(a => typeof a === 'object' ? `${a.allergen} (${a.severity})` : a),
      dietaryRestrictions: rawRecord.dietaryRestrictions || rawRecord.dietaryPlan || rawRecord.canteenSpecialInstructions || 'STRICT GROUNDNUT-FREE TRAY. No groundnut soup, peanut oil, or nkate cake.',
      chronicConditions: Array.isArray(rawRecord.chronicConditions) ? rawRecord.chronicConditions.join(', ') : (rawRecord.chronicConditions || 'Mild Exercise-Induced Asthma'),
      prescriptions: rawRecord.prescriptions || 'Ventolin Inhaler 100mcg — 2 puffs with spacer before sports or acute wheezing',
      medicationStorage: rawRecord.medicationStorage || 'Infirmary Emergency Cabinet #4 (Matron Custody)',
      emergencyContactName: rawRecord.emergencyContactName || rawRecord.emergencyContact?.primaryGuardian || 'Mrs. Nana Aba Mensah (Mother)',
      emergencyContactPhone: rawRecord.emergencyContactPhone || rawRecord.emergencyContact?.primaryPhone || '+233 24 431 8900',
      pediatricianName: rawRecord.pediatricianName || rawRecord.emergencyContact?.familyPediatrician || 'Dr. K. Boateng (Korle-Bu Pediatric OPD)',
      pediatricianPhone: rawRecord.pediatricianPhone || '+233 24 499 1200',
      immunizationStatus: rawRecord.immunizationStatus || (Array.isArray(rawRecord.immunizations) ? `${rawRecord.immunizations.length} Vaccines Certified` : '100% GHS Compliant')
    };

        const rawVisits = (this.overviewData?.sickbayVisits && this.overviewData.sickbayVisits.length > 0) 
      ? this.overviewData.sickbayVisits 
      : [
          {
            id: 'sb-log-01',
            studentName: 'Kwame Mensah',
            gradeLevel: 'Grade 8 Gold',
            date: 'Today',
            time: '10:15 AM',
            complaint: 'Mild Exercise-Induced Wheezing (Post 400m PE Sprint)',
            vitals: { temp: '36.8°C', pulse: '84 bpm', spo2: '98%' },
            treatment: 'Ventolin Inhaler 2 puffs with spacer chamber, rested on cot for 20 mins',
            outcome: 'Returned to Class (Fit)',
            notes: 'Lungs clear upon auscultation. Peak flow returned to baseline.',
            matronName: 'Matron Grace Agyemang, SRN'
          }
        ];

    const visits = rawVisits.map(v => ({
      id: v.id,
      studentName: v.studentName,
      gradeLevel: v.gradeLevel || v.grade || 'Primary Class 5',
      date: v.date || v.visitDate || 'Today',
      time: v.time || v.visitTime || '10:15 AM',
      complaint: v.complaint || v.presentingComplaint || 'Infirmary Consultation',
      treatment: v.treatment || v.treatmentGiven || 'Rest & clinical observation',
      outcome: v.outcome || v.outcomeCategory || 'Returned to Class',
      notes: v.notes || v.notificationMessage || '',
      matronName: v.matronName || v.treatingNurse || 'Matron Grace Agyemang, SRN',
      vitals: {
        temp: v.vitals?.temp || v.vitals?.temperature || '36.8°C',
        pulse: v.vitals?.pulse || '84 bpm',
        spo2: v.vitals?.spo2 || v.vitals?.spO2 || '98%'
      }
    }));

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); border-radius: var(--radius-lg); padding: 2rem; color: #ffffff; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
          <div style="position: absolute; right: -20px; top: -20px; font-size: 8rem; opacity: 0.08; pointer-events: none;">
            🩺
          </div>
          
          <div style="position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <span class="badge" style="background: #a7f3d0; color: #064e3b; font-weight: 800; font-size: 0.75rem;">
                🇬🇭 GHANA HEALTH SERVICE (GHS) COMPLIANT
              </span>
              <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #ffffff; font-weight: 700; font-size: 0.75rem;">
                Full-Time Registered Matron on Campus
              </span>
              <span class="badge" style="background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 0.75rem;">
                🚨 CANTEEN ALLERGY ALERT ACTIVE
              </span>
            </div>

            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #ffffff;">
              Student Medical Passport & Sickbay Infirmary Hub
            </h2>

            <p style="margin: 0 0 1.25rem 0; max-width: 680px; font-size: 0.95rem; color: #d1fae5; line-height: 1.5;">
              SkoolFinder Ghana integrates directly with certified school sickbays. Monitor your ward's pediatric vital signs, acute dietary red flags for school canteen chefs, and official GHS immunization records.
            </p>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-pill btn-parent-open-med-profile" style="background: #ffffff; color: #064e3b; font-weight: 800; font-size: 0.85rem; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>📋</span> View Full Pediatric Health Passport &rarr;
              </button>
              <button class="btn-pill" onclick="window.print()" style="background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>🖨️</span> Print GHS Health Card
              </button>
            </div>
          </div>
        </div>

        <!-- Section 1: Health Passport Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <!-- Card A: Kwame Mensah's Vital Bio Card -->
          <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                  <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                    Student Health Profile
                  </span>
                  <h3 style="margin: 0.35rem 0 0.15rem 0; font-size: 1.25rem; font-weight: 800; color: var(--primary-900);">
                    ${medRecord.studentName}
                  </h3>
                  <div style="font-size: 0.8rem; color: #64748b;">
                    ${medRecord.gradeLevel} • NHIS: ${medRecord.nhisNumber}
                  </div>
                </div>

                <div style="display: flex; gap: 0.4rem;">
                  <span style="background: #fee2e2; border: 1.5px solid #ef4444; color: #b91c1c; font-weight: 900; font-size: 0.9rem; padding: 0.25rem 0.6rem; border-radius: 8px;">
                    ${medRecord.bloodGroup}
                  </span>
                  <span style="background: #fef3c7; border: 1.5px solid #f59e0b; color: #b45309; font-weight: 900; font-size: 0.9rem; padding: 0.25rem 0.6rem; border-radius: 8px;">
                    ${medRecord.genotype}
                  </span>
                </div>
              </div>

              <!-- Key Attributes -->
              <div style="background: #f8fafc; border-radius: 10px; padding: 0.9rem; margin-bottom: 1rem; font-size: 0.83rem; display: flex; flex-direction: column; gap: 0.45rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">GHS Immunization:</span>
                  <span style="font-weight: 800; color: #059669;">✓ ${medRecord.immunizationStatus}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">Chronic Care:</span>
                  <span style="font-weight: 700; color: #0f172a;">${medRecord.chronicConditions}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">Emergency Meds:</span>
                  <span style="font-weight: 700; color: #0f172a;">Sickbay Cabinet #2</span>
                </div>
              </div>

              <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; font-size: 0.82rem; color: #475569;">
                <div><strong>Attending Pediatrician:</strong> ${medRecord.pediatricianName} (${medRecord.pediatricianPhone})</div>
                <div style="margin-top: 0.25rem;"><strong>Parent Phone:</strong> ${medRecord.emergencyContactPhone}</div>
              </div>
            </div>

            <div style="margin-top: 1.25rem;">
              <button class="btn-pill btn-outline btn-parent-open-med-profile" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                View Complete Health Passport
              </button>
            </div>
          </div>

          <!-- Card B: Canteen Allergy & Kitchen Safeguards Red Flag -->
          <div style="background: #fff; border-radius: var(--radius-lg); border: 2px solid #ef4444; padding: 1.5rem; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.08); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <span class="badge" style="background: #fee2e2; color: #991b1b; font-size: 0.72rem; font-weight: 900; text-transform: uppercase;">
                    ⚠️ Canteen Kitchen Alert
                  </span>
                  <h3 style="margin: 0.35rem 0 0.15rem 0; font-size: 1.25rem; font-weight: 800; color: #b91c1c;">
                    Acute Allergy Red Flags
                  </h3>
                  <div style="font-size: 0.8rem; color: #7f1d1d; font-weight: 600;">
                    Broadcasted to Campus Canteen Chefs & Vendors
                  </div>
                </div>
                <div style="font-size: 2rem;">🥜</div>
              </div>

              <!-- Severe Allergy Pill -->
              <div style="margin-bottom: 1rem;">
                ${(medRecord.allergies || []).map(a => `
                  <div style="background: #fee2e2; border: 1.5px solid #f87171; border-radius: 8px; padding: 0.65rem 0.85rem; color: #7f1d1d; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span>🚨</span> ${a}
                  </div>
                `).join('')}
              </div>

              <div style="background: #fff5f5; border-radius: 8px; padding: 0.85rem; border-left: 3px solid #ef4444; font-size: 0.82rem; color: #450a0a; line-height: 1.5; margin-bottom: 1rem;">
                <strong>Kitchen Instructions:</strong> ${medRecord.dietaryRestrictions}
              </div>

              <div style="font-size: 0.78rem; color: #64748b; line-height: 1.4;">
                Ghana culinary safeguards: Nut-free food tray served first with sterilized cutlery. All kitchen supervisors trained in anaphylaxis emergency protocol.
              </div>
            </div>

            <div style="margin-top: 1.25rem; background: #fef2f2; border-radius: 8px; padding: 0.65rem; text-align: center; font-size: 0.78rem; font-weight: 700; color: #991b1b;">
              EpiPen Auto-Injector available at Sickbay Station #1
            </div>
          </div>

        </div>

        <!-- Section 2: Recent Sickbay Clinic Visits & Infirmary Log -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.25rem 0;">
                🏥 Recent Infirmary Clinic Encounters & Nursing Triage
              </h3>
              <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">
                Real-time treatment logs recorded by the school registered nurse (Matron) during the academic term.
              </p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${visits.map(v => `
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
                
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                  <div style="width: 48px; height: 48px; border-radius: 10px; background: #ecfdf5; border: 1.5px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
                    🩺
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
                      <span class="badge" style="background: #d1fae5; color: #065f46; font-weight: 800; font-size: 0.72rem;">
                        ${v.outcome}
                      </span>
                      <span style="font-size: 0.8rem; color: #64748b;">
                        🗓️ ${v.date} at ${v.time}
                      </span>
                    </div>

                    <h4 style="margin: 0 0 0.25rem 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">
                      ${v.complaint}
                    </h4>

                    <div style="font-size: 0.83rem; color: #334155; margin-bottom: 0.35rem;">
                      <strong>Treatment:</strong> ${v.treatment}
                    </div>

                    <div style="font-size: 0.78rem; color: #64748b;">
                      Attending: ${v.matronName} • Vitals: Temp ${v.vitals?.temp || '36.8°C'} | Pulse ${v.vitals?.pulse || '84 bpm'} | SpO2 ${v.vitals?.spo2 || '98%'}
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn-pill btn-primary btn-parent-view-sickbay-visit" data-visitid="${v.id}" style="font-size: 0.8rem; padding: 0.45rem 1rem; font-weight: 800; background: #047857; display: inline-flex; align-items: center; gap: 0.35rem;">
                    <span>📋</span> View Clinical Triage Notes &rarr;
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  renderLibraryTab() {
    const loans = (this.overviewData?.borrowedBooks && this.overviewData.borrowedBooks.length > 0)
      ? this.overviewData.borrowedBooks
      : [
          {
            id: 'loan-01',
            bookTitle: 'Things Fall Apart (African Trilogy)',
            bookAuthor: 'Chinua Achebe',
            studentName: 'Kwame Mensah',
            gradeLevel: 'Primary Class 5',
            borrowDate: '2026-10-14',
            dueDate: '2026-10-28',
            status: 'Active Loan',
            fineDueGHS: 0,
            barcode: 'GIS-LIB-BK-005-02'
          },
          {
            id: 'loan-02',
            bookTitle: 'Cambridge IGCSE Complete Mathematics: Extended (5th Edition)',
            bookAuthor: 'David Rayner & Ian Bettison',
            studentName: 'Kwame Mensah',
            gradeLevel: 'Primary Class 5',
            borrowDate: '2026-10-05',
            dueDate: '2026-10-19',
            status: 'Overdue',
            fineDueGHS: 12,
            barcode: 'GIS-LIB-BK-002-14'
          }
        ];

    const catalog = this.overviewData?.libraryCatalog || [
      {
        id: 'lib-bk-01',
        title: 'Aki-Ola Core Mathematics for Senior High Schools',
        author: 'Peter Asiedu',
        subject: 'Mathematics',
        curriculum: 'Ghana GES & WASSCE',
        gradeLevel: 'SHS 1 - 3',
        availableCopies: 72,
        totalCopies: 85,
        shelfLocation: 'Aisle 2 • STEM Bay',
        coverIcon: '📐'
      },
      {
        id: 'lib-bk-04',
        title: 'The Dilemma of a Ghost & Anowa',
        author: 'Ama Ata Aidoo',
        subject: 'English Literature',
        curriculum: 'Ghana GES & Cambridge Literature',
        gradeLevel: 'JHS 3 - SHS 2',
        availableCopies: 41,
        totalCopies: 50,
        shelfLocation: 'Aisle 4 • African Literature',
        coverIcon: '🎭'
      },
      {
        id: 'lib-bk-07',
        title: 'The Cockcrow: An Anthology of Literature for Junior High',
        author: 'K. A. Ackah',
        subject: 'English Literature',
        curriculum: 'Ghana GES (BECE Core)',
        gradeLevel: 'JHS 1 - 3',
        availableCopies: 82,
        totalCopies: 90,
        shelfLocation: 'Aisle 4 • BECE Literature',
        coverIcon: '🐓'
      }
    ];

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%); border-radius: var(--radius-lg); padding: 2rem; color: #ffffff; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
          <div style="position: absolute; right: -20px; top: -20px; font-size: 8rem; opacity: 0.08; pointer-events: none;">
            📚
          </div>
          
          <div style="position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 0.75rem;">
                🇬🇭 ACCREDITED SCHOOL LIBRARY & TEXTBOOK HUB
              </span>
              <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #ffffff; font-weight: 700; font-size: 0.75rem;">
                Aki-Ola • Cambridge • African Classics
              </span>
            </div>

            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #ffffff;">
              Student Textbook Loans & Digital E-Library
            </h2>

            <p style="margin: 0 0 1.25rem 0; max-width: 680px; font-size: 0.95rem; color: #c7d2fe; line-height: 1.5;">
              Monitor active school textbook loans, return due dates, and explore the school's licensed library catalog for Cambridge IGCSE, WASSCE, and BECE required texts.
            </p>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-pill" style="background: #ffffff; color: #312e81; font-weight: 800; font-size: 0.85rem; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-flex; align-items: center; gap: 0.4rem;" onclick="State.showToast('All textbook loan barcodes verified with campus desk', 'info')">
                <span>🛡️</span> Digital Library Card Active
              </button>
            </div>
          </div>
        </div>

        <!-- Section 1: Active Borrowed Books Cards -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0;">
              📖 Kwame's Currently Issued Textbooks (${loans.length})
            </h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Standard 14-day checkout window
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
            ${loans.map(loan => {
              const isOverdue = loan.status === 'Overdue' || (loan.fineDueGHS && loan.fineDueGHS > 0);
              return `
                <div style="background: #ffffff; border-radius: var(--radius-lg); border: ${isOverdue ? '2px solid #ef4444' : '1px solid var(--border-color)'}; padding: 1.35rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <div>
                        <span class="badge" style="background: ${isOverdue ? '#fee2e2' : '#ecfdf5'}; color: ${isOverdue ? '#991b1b' : '#065f46'}; font-weight: 800; font-size: 0.72rem;">
                          ${isOverdue ? '⚠️ ' + loan.status : '● ' + loan.status}
                        </span>
                        <h4 style="margin: 0.35rem 0 0.15rem 0; font-size: 1.1rem; font-weight: 800; color: var(--primary-900);">
                          ${loan.bookTitle}
                        </h4>
                        <div style="font-size: 0.8rem; color: #64748b;">
                          By ${loan.bookAuthor}
                        </div>
                      </div>
                      <div style="font-size: 1.8rem;">📚</div>
                    </div>

                    <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem 0.9rem; font-size: 0.82rem; margin-bottom: 0.85rem; display: flex; flex-direction: column; gap: 0.35rem;">
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Date Borrowed:</span>
                        <span style="font-weight: 600;">${loan.borrowDate}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Scheduled Due Date:</span>
                        <span style="font-weight: 800; color: ${isOverdue ? '#b91c1c' : '#312e81'};">${loan.dueDate}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Asset Barcode:</span>
                        <span style="font-family: monospace; font-weight: 700;">${loan.barcode}</span>
                      </div>
                      ${isOverdue ? `
                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed #fca5a5; padding-top: 0.35rem; color: #b91c1c; font-weight: 800;">
                          <span>Overdue Late Fee:</span>
                          <span>GH₵ ${(loan.fineDueGHS || 12).toFixed(2)}</span>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <div style="border-top: 1px solid #f1f5f9; padding-top: 0.85rem; display: flex; gap: 0.5rem;">
                    <button class="btn-pill btn-outline btn-parent-book-details" data-bookid="${loan.bookId}" style="flex: 1; font-size: 0.78rem; padding: 0.4rem 0.75rem; justify-content: center;">
                      Book Details
                    </button>
                    <button class="btn-pill btn-emerald btn-parent-return-book" data-loanid="${loan.id}" style="flex: 1; font-size: 0.78rem; padding: 0.4rem 0.75rem; justify-content: center; font-weight: 800;">
                      ✓ Return Book
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 2: Explore School Library Catalog -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.25rem 0;">
                🏛️ Explore Campus Library Catalog
              </h3>
              <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">
                Reserve physical copies or read verified digital syllabus study guides.
              </p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            ${catalog.map(b => `
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <span class="badge" style="background: #e0e7ff; color: #3730a3; font-size: 0.7rem; font-weight: 700;">
                      ${b.curriculum}
                    </span>
                    <span style="font-size: 1.5rem;">${b.coverIcon || '📖'}</span>
                  </div>

                  <h4 style="margin: 0.2rem 0 0.15rem 0; font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">
                    ${b.title}
                  </h4>
                  <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">
                    By ${b.author} • ${b.gradeLevel}
                  </div>

                  <div style="background: #f8fafc; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.78rem; color: #334155; margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                    <span>📍 ${b.shelfLocation}</span>
                    <strong style="color: ${b.availableCopies > 0 ? '#059669' : '#dc2626'};">${b.availableCopies} Copies Available</strong>
                  </div>
                </div>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                  <button class="btn-pill btn-outline btn-parent-book-details" data-bookid="${b.id}" style="font-size: 0.76rem; padding: 0.35rem 0.75rem;">
                    View Book
                  </button>
                  <button class="btn-pill btn-primary btn-parent-borrow-catalog" data-bookid="${b.id}" style="font-size: 0.76rem; padding: 0.35rem 0.85rem; font-weight: 800; background: #312e81;">
                    📖 Borrow Book
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  renderDigitalIDTab() {
    const idData = this.overviewData?.digitalID || {
      id: "id-gis-kwame-mensah",
      studentName: "Kwame Mensah",
      indexNumber: "GIS-2026-0842",
      schoolName: "Ghana International School (GIS)",
      schoolMotto: "Understanding of Each Other",
      gradeLevel: "Grade 8 (JHS 2)",
      academicYear: "2025/2026 Academic Session",
      house: "Gold Coast House",
      dob: "18 Apr 2012",
      bloodGroup: "O+",
      genotype: "AA",
      emergencyContactPhone: "+233 24 431 8900",
      medicalAlert: "Mild Penicillin Allergy • Asthma Inhaler Registered",
      busPassRoute: "Route 1: East Legon / Adjiringanor Shuttle",
      busPassStatus: "Active",
      status: "ACTIVE",
      verificationHash: "GH-GIS-SECURE-842-VERIFIED",
      expiryDate: "31/08/2026"
    };

    return `
      <div>
        <!-- Banner -->
        <div style="background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 2rem; margin-bottom: 2rem; border-left: 6px solid #f59e0b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span class="badge" style="background: rgba(245, 158, 11, 0.25); color: #fef08a; border: 1px solid rgba(245, 158, 11, 0.5); margin-bottom: 0.5rem;">
              🪪 Biometric & QR Credential
            </span>
            <h2 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0;">
              Official Digital Student ID & Gate Pass
            </h2>
            <p style="margin: 0; font-size: 0.95rem; color: #cbd5e1; max-width: 600px;">
              Verifiable institutional digital identity card for ${idData.studentName}. Validated across school gates, shuttle buses, infirmaries, and examination halls.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn-pill btn-gold btn-parent-open-id-modal" style="font-weight: 800; font-size: 0.88rem; padding: 0.65rem 1.25rem;">
              🪪 Open Full PVC Card View
            </button>
            <button class="btn-pill btn-outline btn-parent-test-scanner" style="color: #ffffff; border-color: rgba(255,255,255,0.4); font-size: 0.88rem; padding: 0.65rem 1.25rem;">
              🔍 Test Gate Scanner
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem;">
          
          <!-- Column 1: Live Interactive ID Badge Card Preview -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 1.75rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                🪪 Active Credential Preview
              </h3>
              <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800;">
                ● ${idData.status}
              </span>
            </div>

            <!-- 3D Holographic ID Badge Preview -->
            <div class="student-id-perspective-wrap" style="max-width: 100%; margin-bottom: 1.25rem;">
              <div class="student-id-card-3d" style="padding: 1.25rem; aspect-ratio: auto; min-height: 220px;">
                <div class="id-card-hologram-sheen"></div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; position: relative; z-index: 2;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="id-chip-gold"></div>
                    <div>
                      <div style="font-size: 0.82rem; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; color: #ffffff;">
                        🎓 ${idData.schoolName}
                      </div>
                      <div style="font-size: 0.62rem; color: #fbbf24; font-weight: 600;">
                        OFFICIAL SECURE DIGITAL CREDENTIAL
                      </div>
                    </div>
                  </div>
                  <span class="badge" style="background: rgba(245,158,11,0.25); color: #fef08a; font-size: 0.6rem; border: 1px solid rgba(245,158,11,0.5);">
                    ● ${idData.status}
                  </span>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center; position: relative; z-index: 2;">
                  <div style="width: 76px; height: 95px; border-radius: 8px; background: #ffffff; border: 2px solid #fbbf24; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80" alt="${idData.studentName}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div>
                    <div style="font-size: 1.25rem; font-weight: 900; color: #ffffff; line-height: 1.2; letter-spacing: -0.01em;">
                      ${idData.studentName}
                    </div>
                    <div style="font-family: monospace; font-size: 0.8rem; color: #fbbf24; font-weight: 800; margin-top: 0.25rem;">
                      INDEX: ${idData.indexNumber}
                    </div>
                    <div style="font-size: 0.75rem; color: #e2e8f0; margin-top: 0.2rem;">
                      ${idData.gradeLevel} • ${idData.house}
                    </div>
                    <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 0.2rem;">
                      Valid Thru: <strong style="color: #ffffff;">${idData.expiryDate}</strong>
                    </div>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.6rem; border-top: 1px solid rgba(255,255,255,0.15); font-size: 0.68rem; color: #cbd5e1; position: relative; z-index: 2;">
                  <span>🩸 Blood Group: <strong style="color: #fbbf24;">${idData.bloodGroup} (${idData.genotype})</strong></span>
                  <span>🚌 Shuttle Pass: <strong style="color: #10b981;">Active</strong></span>
                </div>
              </div>
            </div>

            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem;">
              <button class="btn-pill btn-primary btn-parent-open-id-modal" style="flex: 1; font-size: 0.82rem; justify-content: center;">
                🪪 Open PVC Card & Flip
              </button>
              <button class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.82rem; padding: 0.5rem 1rem;">
                🖨️ Print Card
              </button>
            </div>
          </div>

          <!-- Column 2: Access & Gate Clearance Log -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 1.75rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                🛡️ Live Security Gate Log
              </h3>
              <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700;">
                Real-Time Telemetry
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: #0a1128;">
                    🏫 Morning Campus Entry (Gate 2)
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b;">
                    Cantonments Security Terminal • Optical QR Scan
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.65rem;">
                    ✓ 07:15 AM
                  </span>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: #0a1128;">
                    🚌 Route 1 Bus Boarding Check
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b;">
                    Driver Emmanuel Quaye Telematics • Bus Pass Verified
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.65rem;">
                    ✓ 07:38 AM
                  </span>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: #0a1128;">
                    🩺 Sickbay Nurse Clearance
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b;">
                    Sister Mercy Baah • Routine Vitals Checked
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-size: 0.65rem;">
                    ✓ 11:20 AM
                  </span>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: #0a1128;">
                    📚 Library Checkout Desk
                  </div>
                  <div style="font-size: 0.72rem; color: #64748b;">
                    Barcoded Textbook Borrowing: Things Fall Apart
                  </div>
                </div>
                <div style="text-align: right;">
                  <span class="badge" style="background: #fefce8; color: #a16207; font-size: 0.65rem;">
                    ✓ 01:10 PM
                  </span>
                </div>
              </div>
            </div>

            <div style="margin-top: 1rem; text-align: center;">
              <button class="btn-pill btn-secondary btn-parent-test-scanner" style="width: 100%; font-size: 0.82rem; justify-content: center;">
                🛡️ Open Gate Security Scanner Simulator
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  getStatusBadge(status) {
    switch (status) {
      case 'Exam Scheduled':
        return `<span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">⚡ Exam Scheduled</span>`;
      case 'Admitted':
        return `<span class="badge" style="background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">🎉 Admitted</span>`;
      case 'Under Review':
        return `<span class="badge" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">🔍 Under Review</span>`;
      case 'Enrolled':
        return `<span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">🎓 Enrolled</span>`;
      default:
        return `<span class="badge" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: 700; padding: 0.4rem 0.85rem; border-radius: 9999px;">📝 Received</span>`;
    }
  },

  getInvoiceStatusBadge(status) {
    switch (status) {
      case 'Paid':
        return `<span class="badge" style="background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">✓ Fully Settled</span>`;
      case 'Partially Paid':
        return `<span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">⚡ Partially Paid</span>`;
      case 'Overdue':
        return `<span class="badge" style="background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">⚠️ Overdue</span>`;
      default:
        return `<span class="badge" style="background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">❗ Unpaid</span>`;
    }
  },

  attachEvents() {
    if (!State.isAuthenticated() || !State.isParent()) {
      this.attachAuthGatewayEvents();
      return;
    }

    // Logout button
    document.getElementById('btn-parent-logout')?.addEventListener('click', () => {
      State.logout();
      State.showToast("Signed out of Parent Portal", "info");
      App.navigate('parents');
    });

    // Tab switching
    document.querySelectorAll('.parent-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (tab && tab !== this.activeTab) {
          this.activeTab = tab;
          const container = document.getElementById('parent-portal-tab-content');
          if (container) {
            container.innerHTML = this.renderTabContent();
            this.attachTabChildEvents();
          }
          // Update tab styles
          document.querySelectorAll('.parent-tab-btn').forEach(b => {
            const isActive = b.dataset.tab === tab;
            b.style.color = isActive ? 'var(--primary-900)' : 'var(--text-muted)';
            b.style.borderBottom = isActive ? '3px solid var(--gold-500)' : 'transparent';
          });
        }
      });
    });

    // Link Child / Student Modal Trigger
    document.getElementById('btn-open-link-student')?.addEventListener('click', () => {
      Modals.openLinkStudentModal();
    });

    // Switch Demo Role
    const btnSwitch = document.getElementById('btn-parent-switch-demo');
    if (btnSwitch) {
      btnSwitch.addEventListener('click', () => {
        Modals.openLoginModal({
          notice: "Select any demo role to test School Administrator, Parent, or Teacher capabilities."
        });
      });
    }

    this.attachTabChildEvents();
  },

  attachTabChildEvents() {
    // Add Secondary Ward
    document.getElementById('btn-add-secondary-ward')?.addEventListener('click', () => {
      Modals.openAddWardModal(() => {
        App.refreshCurrentView();
      });
    });

    // Submit New Admission Application
    const openNewAdmission = () => {
      Modals.openOnlineAdmissionModal();
    };
    document.getElementById('btn-submit-new-admission')?.addEventListener('click', openNewAdmission);
    document.getElementById('btn-submit-new-admission-empty')?.addEventListener('click', openNewAdmission);

    // Pay via MoMo
    document.querySelectorAll('.btn-pay-momo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const invId = e.currentTarget.dataset.invid;
        const inv = (this.overviewData?.invoices || []).find(i => i.id === invId);
        if (inv) {
          Modals.openFeePaymentModal(inv, () => {
            App.refreshCurrentView();
          });
        } else {
          State.showToast("Invoice loaded.", "info");
        }
      });
    });

    // View MoMo Receipt
    document.querySelectorAll('.btn-view-momo-receipt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const invId = e.currentTarget.dataset.invid;
        const payId = e.currentTarget.dataset.payid;
        const inv = (this.overviewData?.invoices || []).find(i => i.id === invId);
        if (inv) {
          const pay = (inv.paymentHistory || []).find(p => p.id === payId);
          if (pay) {
            Modals.openFeeReceiptModal(inv, pay);
          }
        }
      });
    });

    // View Application Slip
    document.querySelectorAll('.btn-view-slip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const appId = e.currentTarget.dataset.appid;
        const app = (this.overviewData?.applications || []).find(a => a.id === appId);
        if (app) {
          this.showApplicationSlipModal(app);
        } else {
          State.showToast("Application details retrieved.", "info");
        }
      });
    });

    // Contact Admissions Officer
    document.querySelectorAll('.btn-parent-contact').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const schoolId = e.currentTarget.dataset.schoolid;
        const schoolName = e.currentTarget.dataset.schoolname;
        Modals.openInquiryModal(schoolId, schoolName);
      });
    });

    // Remove Bookmark
    document.querySelectorAll('.btn-bookmark-remove').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const schoolId = e.currentTarget.dataset.schoolid;
        try {
          await State.toggleBookmark(schoolId);
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, "error");
        }
      });
    });

    // Campus location
    document.querySelectorAll('.btn-tour-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const schoolId = e.currentTarget.dataset.schoolid;
        App.navigate('school-detail', schoolId);
      });
    });

    // View Terminal Report Card
    document.querySelectorAll('.btn-view-report-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rcId = e.currentTarget.dataset.rcid;
        const rc = (this.overviewData?.reportCards || []).find(r => r.id === rcId);
        if (rc) {
          Modals.openReportCardModal(rc);
        } else {
          State.showToast("Report card details loading...", "info");
        }
      });
    });

    // Feature 12: View Mentorship Session Details Modal
    document.querySelectorAll('.btn-parent-view-session').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookingId = e.currentTarget.dataset.bookingid;
        const booking = (this.overviewData?.alumniBookings || []).find(b => b.id === bookingId);
        if (booking) {
          Modals.openMentorshipSessionDetailsModal(booking);
        } else {
          State.showToast("Session details loading...", "info");
        }
      });
    });

    // Feature 13: View Student Medical Profile Modal
    document.querySelectorAll('.btn-parent-open-med-profile').forEach(btn => {
      btn.addEventListener('click', () => {
        const medRecord = this.overviewData?.medicalRecord;
        if (medRecord) {
          Modals.openStudentMedicalProfileModal(medRecord);
        } else {
          State.showToast("Medical record loading...", "info");
        }
      });
    });

    // Feature 13: View Sickbay Clinic Visit Details Modal
    document.querySelectorAll('.btn-parent-view-sickbay-visit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const visitId = e.currentTarget.dataset.visitid;
        const visits = this.overviewData?.sickbayVisits || [];
        const visit = visits.find(v => v.id === visitId) || visits[0];
        if (visit) {
          Modals.openSickbayVisitDetailsModal(visit);
        } else {
          State.showToast("Encounter record details loading...", "info");
        }
      });
    });

    // Feature 12: View Alumni Full Profile Modal
    document.querySelectorAll('.btn-parent-alumni-profile').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const mentorId = e.currentTarget.dataset.mentorid;
        try {
          const mentor = await API.getAlumnusById(mentorId);
          Modals.openAlumniProfileModal(mentor);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 12: Book Mentorship Modal
    document.querySelectorAll('.btn-parent-book-mentorship').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const mentorId = e.currentTarget.dataset.mentorid;
        try {
          const mentor = await API.getAlumnusById(mentorId);
          Modals.openBookMentorshipModal(mentor, () => {
            App.refreshCurrentView();
          });
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 11: Club Details Modal
    document.querySelectorAll('.btn-parent-open-club-details').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const clubId = e.currentTarget.dataset.clubid;
        try {
          const club = await API.getClubById(clubId);
          Modals.openClubDetailsModal(club, false, () => {
            App.refreshCurrentView();
          });
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 11: Club MoMo Enrollment Modal
    document.querySelectorAll('.btn-parent-enroll-club').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const clubId = e.currentTarget.dataset.clubid;
        try {
          const club = await API.getClubById(clubId);
          Modals.openClubEnrollmentModal(club, () => {
            App.refreshCurrentView();
          });
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 11: Club Competition Fixtures Modal
    document.querySelectorAll('.btn-parent-club-fixtures').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const clubId = e.currentTarget.dataset.clubid;
        try {
          const club = await API.getClubById(clubId);
          Modals.openClubCompetitionModal(club);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 10: Open Student Bus Pass Modal
    document.querySelectorAll('.btn-parent-open-bus-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const busPass = this.overviewData?.busPass;
        if (busPass) {
          Modals.openStudentBusPassModal(busPass);
        } else {
          State.showToast("Bus pass loading...", "info");
        }
      });
    });

    // Feature 10: Track Live Bus Route Modal
    document.querySelectorAll('.btn-parent-track-bus').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const route = await API.getTransportRouteById('rte-gis-01');
          Modals.openBusRouteTrackerModal(route);
        } catch (e) {
          State.showToast(e.message, 'error');
        }
      });
    });

    // Feature 10: Inspect any route timeline
    document.querySelectorAll('.btn-inspect-route').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const rId = e.currentTarget.dataset.routeid;
        try {
          const route = await API.getTransportRouteById(rId);
          Modals.openBusRouteTrackerModal(route);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 16: Open Digital Student ID Card Modal
    const openDigitalIdHandler = () => {
      const idData = this.overviewData?.digitalID;
      Modals.openDigitalIDCardModal(idData);
    };

    document.getElementById('btn-parent-digital-id')?.addEventListener('click', openDigitalIdHandler);
    document.querySelectorAll('.btn-parent-open-id-modal').forEach(btn => {
      btn.addEventListener('click', openDigitalIdHandler);
    });

    // Feature 16: Test Gate Scanner
    document.querySelectorAll('.btn-parent-test-scanner').forEach(btn => {
      btn.addEventListener('click', () => {
        const idData = this.overviewData?.digitalID;
        Modals.openVerifyIDScannerModal(idData?.indexNumber || 'GIS-2026-0842');
      });
    });
  },

  showApplicationSlipModal(app) {
    const student = app.student || {};
    const parent = app.parentGuardian || {};
    const ref = app.applicationNumber || app.id || 'GIS-ADM-2026-0842';

    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(10, 17, 40, 0.7); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1rem;';

    overlay.innerHTML = `
      <div class="modal-card" style="background: #ffffff; border-radius: var(--radius-xl); max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; box-shadow: var(--shadow-xl); position: relative;">
        <button id="btn-close-slip" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        
        <!-- Header with Ghana Crest & Official Seal -->
        <div style="text-align: center; border-bottom: 2px dashed var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🇬🇭</div>
          <div style="font-size: 0.75rem; font-weight: 800; color: var(--gold-600); text-transform: uppercase; letter-spacing: 1px;">
            OFFICIAL ADMISSIONS TRACKING RECORD & SLIP
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary-900); margin: 0.25rem 0;">
            ${app.schoolName || 'Ghana International School (GIS)'}
          </h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Reference No: <strong style="color: var(--primary-900); font-family: monospace;">${ref}</strong>
          </div>
        </div>

        <!-- Student & Parent Information -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.88rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Student Applicant</div>
            <div style="font-weight: 700; color: var(--primary-900); font-size: 1.05rem;">${student.firstName || 'Kwame'} ${student.lastName || 'Mensah'}</div>
            <div>DOB: ${student.dob || '14 May 2014'} (${student.gender || 'Male'})</div>
            <div>Class Applying: <strong>${app.gradeApplying || 'Class 4'}</strong></div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Parent / Guardian</div>
            <div style="font-weight: 700; color: var(--primary-900); font-size: 1.05rem;">${parent.name || 'Mrs. Nana Aba Mensah'}</div>
            <div>Phone: ${parent.phone || '+233 24 412 9845'}</div>
            <div>Email: ${parent.email || 'parent@gmail.com'}</div>
          </div>
        </div>

        <!-- Assessment Confirmation Details -->
        <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📅</span> ASSESSMENT & INTERVIEW APPOINTMENT PASS
          </div>
          <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-dark);">
            <div><strong>Date:</strong> Saturday, 15 November 2026</div>
            <div><strong>Time:</strong> 09:00 AM (Check-in 08:30 AM)</div>
            <div><strong>Location:</strong> Junior School Academic Block, Room J-12, Cantonments Campus</div>
            <div><strong>Required Items:</strong> Passport photo (2 copies), original birth certificate, recent terminal report card, HB pencils, and this printout slip.</div>
          </div>
        </div>

        <!-- Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <span style="font-size: 0.78rem; color: var(--emerald-600); font-weight: 600;">
            ✓ Digital verification signature valid
          </span>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.85rem;">
              🖨️ Print Slip
            </button>
            <button class="btn-pill btn-primary" id="btn-close-slip-2" style="font-size: 0.85rem;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };

    overlay.querySelector('#btn-close-slip').addEventListener('click', close);
    overlay.querySelector('#btn-close-slip-2').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  },

  renderAuthGateway() {
    return `
      <section style="background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); min-height: 85vh; padding: 3rem 1.5rem 5rem;">
        <div class="container" style="max-width: 920px; margin: 0 auto;">
          
          <!-- Header Banner -->
          <div style="text-align: center; margin-bottom: 2.25rem;">
            <span class="badge" style="background: #eff6ff; color: #1e40af; border: 1.5px solid #bfdbfe; padding: 6px 16px; font-weight: 700; font-size: 0.85rem; border-radius: 9999px;">
              🇬🇭 SkoolFinder Ghana • Unified Admissions & Student Life
            </span>
            <h1 style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 800; color: #0f172a; margin: 0.85rem 0 0.5rem 0;">
              Parent Admissions & Student Portal
            </h1>
            <p style="color: #64748b; font-size: 1.05rem; max-width: 680px; margin: 0 auto; line-height: 1.6;">
              Sign up as a new parent or log in to submit admissions applications to accredited Ghanaian schools, verify digital student ID cards, settle school fees via Mobile Money, and track school bus routes.
            </p>
          </div>

          <!-- Auth Card -->
          <div style="background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 3rem;">
            <!-- Tab Switcher -->
            <div style="display: flex; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
              <button id="tab-btn-parent-signup" class="parent-auth-tab" style="flex: 1; padding: 1.25rem 1rem; border: none; background: #ffffff; font-weight: 800; font-size: 1.05rem; color: #1e3a8a; border-bottom: 3px solid #f59e0b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s;">
                <span>✨</span> Create New Parent Account
              </button>
              <button id="tab-btn-parent-signin" class="parent-auth-tab" style="flex: 1; padding: 1.25rem 1rem; border: none; background: transparent; font-weight: 600; font-size: 1.05rem; color: #64748b; border-bottom: 3px solid transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s;">
                <span>🔑</span> Sign In (Existing Parent)
              </button>
            </div>

            <!-- Tab 1: SIGN UP FORM -->
            <div id="parent-signup-panel" style="padding: 2.5rem 2rem;">
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.75rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <span style="font-size: 1.3rem;">ℹ️</span>
                <div style="font-size: 0.88rem; color: #1e3a8a; line-height: 1.5;">
                  <strong>New Parent Registration:</strong> Fill in your details below to create your parent profile. You can register your child now so your admissions dashboard is set up immediately.
                </div>
              </div>

              <form id="form-parent-signup">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Parent / Guardian Full Name <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="text" id="parent-reg-name" required placeholder="e.g. Mrs. Elizabeth Quaye" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Ghana Mobile Number <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="tel" id="parent-reg-phone" required placeholder="e.g. 024 412 3456" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                    <div style="color: #64748b; font-size: 0.72rem; margin-top: 0.25rem;">Used for instant SMS admissions alerts & MoMo fee invoices.</div>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Email Address <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="email" id="parent-reg-email" required placeholder="e.g. elizabeth.quaye@gmail.com" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Create Password <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="password" id="parent-reg-password" required minlength="6" placeholder="Minimum 6 characters" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Child / Ward Full Name <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="text" id="parent-reg-child-name" required placeholder="e.g. David Quaye" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Class / Grade Level Applying For <span style="color: #ef4444;">*</span>
                    </label>
                    <select id="parent-reg-child-level" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; background: #fff;">
                      <option value="Daycare / Crèche">Daycare / Crèche (Age 6m - 2 yrs)</option>
                      <option value="Nursery / KG">Nursery & Kindergarten (KG 1 - 2)</option>
                      <option value="Lower Primary (Class 1-3)" selected>Lower Primary (Class 1 - 3)</option>
                      <option value="Upper Primary (Class 4-6)">Upper Primary (Class 4 - 6)</option>
                      <option value="Junior High (JHS 1-3 / BECE)">Junior High School (JHS 1 - 3 / BECE)</option>
                      <option value="Senior High (SHS 1-3 / WASSCE)">Senior High School (SHS 1 - 3 / WASSCE)</option>
                      <option value="Cambridge Primary / Checkpoint">Cambridge Primary / Checkpoint</option>
                      <option value="Cambridge IGCSE / A-Levels">Cambridge IGCSE / A-Levels</option>
                    </select>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Residential Region / Suburb
                    </label>
                    <select id="parent-reg-suburb" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; background: #fff;">
                      <option value="East Legon, Greater Accra">Greater Accra - East Legon / Adjiringanor</option>
                      <option value="Cantonments, Greater Accra">Greater Accra - Cantonments / Labone / Airport</option>
                      <option value="Tema, Greater Accra">Greater Accra - Tema / Community 1-25</option>
                      <option value="Spintex, Greater Accra">Greater Accra - Spintex / Sakumono</option>
                      <option value="Achimota, Greater Accra">Greater Accra - Achimota / Dome / West Legon</option>
                      <option value="Kumasi, Ashanti">Ashanti - Kumasi / Ahodwo / Nhyiaeso</option>
                      <option value="Cape Coast, Central">Central - Cape Coast / Elmina</option>
                    </select>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Preferred School for Initial Admission
                    </label>
                    <select id="parent-reg-school" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; background: #fff;">
                      <option value="sch-gis-accra">Ghana International School (GIS) - Cantonments</option>
                      <option value="sch-sos-tema">SOS-Hermann Gmeiner College - Tema</option>
                      <option value="sch-morning-star-cantonments">Morning Star School - Cantonments</option>
                      <option value="sch-roman-ridge-accra">The Roman Ridge School - Accra</option>
                      <option value="sch-ridge-school-kumasi">The Ridge School - Kumasi</option>
                      <option value="sch-east-legon-montessori">East Legon Montessori - Accra</option>
                      <option value="sch-galaxy-international-accra">Galaxy International School - Accra</option>
                    </select>
                  </div>
                </div>

                <button type="submit" id="btn-parent-submit-signup" class="btn-pill btn-gold" style="width: 100%; padding: 1.05rem; font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(245,158,11,0.35); cursor: pointer; border: none;">
                  <span>🚀</span> Create Parent Account & Enter Portal
                </button>
              </form>

              <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #64748b;">
                Already have an account? 
                <a href="javascript:void(0)" id="link-switch-to-signin" style="color: #1e3a8a; font-weight: 700; text-decoration: underline; margin-left: 0.25rem;">
                  Sign In to Parent Portal
                </a>
              </div>
            </div>

            <!-- Tab 2: SIGN IN FORM -->
            <div id="parent-signin-panel" style="padding: 2.5rem 2rem; display: none;">
              <!-- Sub-tabs: Email Password vs SMS OTP -->
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                <button type="button" id="subtab-btn-email" style="flex: 1; padding: 0.65rem; border-radius: 8px; border: 1.5px solid #3b82f6; background: #eff6ff; color: #1e40af; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
                  ✉️ Email & Password
                </button>
                <button type="button" id="subtab-btn-otp" style="flex: 1; padding: 0.65rem; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #ffffff; color: #64748b; font-weight: 600; font-size: 0.88rem; cursor: pointer;">
                  📲 Ghana Phone SMS OTP
                </button>
              </div>

              <!-- Form A: Email & Password -->
              <form id="form-parent-signin-email">
                <div style="margin-bottom: 1.25rem;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Parent Email Address
                  </label>
                  <input type="email" id="parent-login-email" required placeholder="e.g. parent@gmail.com" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Password
                  </label>
                  <input type="password" id="parent-login-password" required placeholder="Enter your password" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                </div>
                <button type="submit" id="btn-parent-submit-login" class="btn-pill btn-primary" style="width: 100%; padding: 0.95rem; font-size: 1rem; font-weight: 800; cursor: pointer; border: none;">
                  Sign In to Parent Portal
                </button>
              </form>

              <!-- Form B: Phone SMS OTP -->
              <form id="form-parent-signin-otp" style="display: none;">
                <div style="margin-bottom: 1.25rem;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Ghanaian Phone Number
                  </label>
                  <div style="display: flex; gap: 0.5rem;">
                    <input type="tel" id="parent-otp-phone" placeholder="024 412 3456" class="form-input" style="flex: 1; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                    <button type="button" id="btn-parent-send-otp" class="btn-pill btn-outline" style="padding: 0.8rem 1.25rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; white-space: nowrap;">
                      📲 Send OTP
                    </button>
                  </div>
                </div>
                <div id="parent-otp-box" style="margin-bottom: 1.5rem; display: none;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Enter 6-Digit Hubtel SMS Code
                  </label>
                  <input type="text" id="parent-otp-code" maxlength="6" placeholder="e.g. 457133" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 1.1rem; letter-spacing: 4px; text-align: center; font-weight: 700;">
                  <button type="button" id="btn-parent-verify-otp" class="btn-pill btn-gold" style="width: 100%; margin-top: 0.75rem; padding: 0.9rem; font-size: 1rem; font-weight: 800; cursor: pointer; border: none;">
                    Verify & Sign In
                  </button>
                </div>
              </form>

              <!-- Quick Demo Access Button -->
              <div style="margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px dashed #cbd5e1; text-align: center;">
                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.6rem;">Testing the platform?</div>
                <button type="button" id="btn-parent-quick-demo" class="btn-pill" style="width: 100%; padding: 0.75rem; background: #f8fafc; color: #1e3a8a; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                  <span>⚡</span> Quick Demo Access (Mrs. Nana Aba Mensah)
                </button>
              </div>

              <div style="text-align: center; margin-top: 1.25rem; font-size: 0.9rem; color: #64748b;">
                Need an account? 
                <a href="javascript:void(0)" id="link-switch-to-signup" style="color: #1e3a8a; font-weight: 700; text-decoration: underline; margin-left: 0.25rem;">
                  Register as new parent
                </a>
              </div>
            </div>
          </div>

          <!-- 4 Pillars Feature Ribbon -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; text-align: center;">
            <div style="background: #ffffff; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🏫</div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">NaSIA Accreditation</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">Direct access to vetted Ghanaian schools</div>
            </div>
            <div style="background: #ffffff; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">📲</div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">MoMo Fee Settlements</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">MTN, Telecel Cash & AT Money receipts</div>
            </div>
            <div style="background: #ffffff; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🪪</div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">Digital Student ID</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">Optical QR scanner & medical passports</div>
            </div>
            <div style="background: #ffffff; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🚌</div>
              <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">Live Bus Route GPS</div>
              <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">Real-time boarding & delay alerts</div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachAuthGatewayEvents() {
    const tabSignup = document.getElementById('tab-btn-parent-signup');
    const tabSignin = document.getElementById('tab-btn-parent-signin');
    const panelSignup = document.getElementById('parent-signup-panel');
    const panelSignin = document.getElementById('parent-signin-panel');

    const showSignup = () => {
      if (!tabSignup || !tabSignin || !panelSignup || !panelSignin) return;
      tabSignup.style.background = '#ffffff';
      tabSignup.style.color = '#1e3a8a';
      tabSignup.style.borderBottom = '3px solid #f59e0b';
      tabSignin.style.background = 'transparent';
      tabSignin.style.color = '#64748b';
      tabSignin.style.borderBottom = '3px solid transparent';
      panelSignup.style.display = 'block';
      panelSignin.style.display = 'none';
    };

    const showSignin = () => {
      if (!tabSignup || !tabSignin || !panelSignup || !panelSignin) return;
      tabSignin.style.background = '#ffffff';
      tabSignin.style.color = '#1e3a8a';
      tabSignin.style.borderBottom = '3px solid #f59e0b';
      tabSignup.style.background = 'transparent';
      tabSignup.style.color = '#64748b';
      tabSignup.style.borderBottom = '3px solid transparent';
      panelSignin.style.display = 'block';
      panelSignup.style.display = 'none';
    };

    tabSignup?.addEventListener('click', showSignup);
    tabSignin?.addEventListener('click', showSignin);
    document.getElementById('link-switch-to-signin')?.addEventListener('click', showSignin);
    document.getElementById('link-switch-to-signup')?.addEventListener('click', showSignup);

    // Sub-tabs in Signin: Email vs Phone OTP
    const btnSubEmail = document.getElementById('subtab-btn-email');
    const btnSubOtp = document.getElementById('subtab-btn-otp');
    const formEmail = document.getElementById('form-parent-signin-email');
    const formOtp = document.getElementById('form-parent-signin-otp');

    btnSubEmail?.addEventListener('click', () => {
      btnSubEmail.style.background = '#eff6ff';
      btnSubEmail.style.borderColor = '#3b82f6';
      btnSubEmail.style.color = '#1e40af';
      btnSubOtp.style.background = '#ffffff';
      btnSubOtp.style.borderColor = '#cbd5e1';
      btnSubOtp.style.color = '#64748b';
      formEmail.style.display = 'block';
      formOtp.style.display = 'none';
    });

    btnSubOtp?.addEventListener('click', () => {
      btnSubOtp.style.background = '#eff6ff';
      btnSubOtp.style.borderColor = '#3b82f6';
      btnSubOtp.style.color = '#1e40af';
      btnSubEmail.style.background = '#ffffff';
      btnSubEmail.style.borderColor = '#cbd5e1';
      btnSubEmail.style.color = '#64748b';
      formOtp.style.display = 'block';
      formEmail.style.display = 'none';
    });

    // 1. Submit Sign Up Form
    const formSignup = document.getElementById('form-parent-signup');
    formSignup?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-parent-submit-signup');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Creating Parent Account...';

      try {
        const payload = {
          name: document.getElementById('parent-reg-name').value.trim(),
          phone: document.getElementById('parent-reg-phone').value.trim(),
          email: document.getElementById('parent-reg-email').value.trim(),
          password: document.getElementById('parent-reg-password').value,
          childName: document.getElementById('parent-reg-child-name').value.trim(),
          childLevel: document.getElementById('parent-reg-child-level').value,
          suburb: document.getElementById('parent-reg-suburb').value,
          targetSchoolId: document.getElementById('parent-reg-school').value,
          role: 'parent'
        };

        const res = await API.register(payload);
        if (res.token && res.user) {
          State.setCurrentUser(res.user, res.token);
          State.showToast(`🎉 Welcome to SkoolFinder, ${res.user.name}! Your parent account is active.`, 'success');
          App.navigate('parents');
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀</span> Create Parent Account & Enter Portal';
        State.showToast(err.message || 'Registration failed. Please check your details.', 'error');
      }
    });

    // 2. Submit Email Sign In Form
    formEmail?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-parent-submit-login');
      btn.disabled = true;
      btn.textContent = 'Signing in...';

      try {
        const email = document.getElementById('parent-login-email').value.trim();
        const password = document.getElementById('parent-login-password').value;
        const res = await API.login(email, password);
        if (res.token && res.user) {
          State.setCurrentUser(res.user, res.token);
          State.showToast(`Welcome back, ${res.user.name}!`, 'success');
          App.navigate('parents');
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Sign In to Parent Portal';
        State.showToast(err.message || 'Invalid email or password', 'error');
      }
    });

    // 3. Phone OTP Send & Verify
    let currentOtpPhone = '';
    document.getElementById('btn-parent-send-otp')?.addEventListener('click', async () => {
      const phone = document.getElementById('parent-otp-phone').value.trim();
      if (!phone) return State.showToast('Please enter your Ghanaian mobile number', 'error');
      currentOtpPhone = phone;
      const btn = document.getElementById('btn-parent-send-otp');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const res = await API.sendOTP(phone, 'parent_login');
        State.showToast(`OTP Code dispatched via Hubtel SMS to ${phone}! (Code: ${res.debugCode || 'sent'})`, 'info');
        document.getElementById('parent-otp-box').style.display = 'block';
        if (res.debugCode) {
          document.getElementById('parent-otp-code').value = res.debugCode;
        }
        btn.textContent = 'Resend OTP';
        btn.disabled = false;
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Send OTP';
        State.showToast(err.message || 'Failed to send OTP SMS', 'error');
      }
    });

    document.getElementById('btn-parent-verify-otp')?.addEventListener('click', async () => {
      const code = document.getElementById('parent-otp-code').value.trim();
      if (!code) return State.showToast('Please enter the 6-digit SMS code', 'error');

      try {
        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: currentOtpPhone, code })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');

        State.setCurrentUser(data.user, data.token);
        State.showToast(`Verified! Welcome, ${data.user.name}`, 'success');
        App.navigate('parents');
      } catch (err) {
        State.showToast(err.message || 'Invalid OTP code', 'error');
      }
    });

    // 4. Quick Demo Button
    document.getElementById('btn-parent-quick-demo')?.addEventListener('click', async () => {
      try {
        const res = await API.login('parent@gmail.com', 'ParentPass2026!');
        if (res.token && res.user) {
          State.setCurrentUser(res.user, res.token);
          State.showToast("Loaded Demo Parent Account (Mrs. Nana Aba Mensah)", "info");
          App.navigate('parents');
        }
      } catch (err) {
        State.showToast("Could not load demo account: " + err.message, "error");
      }
    });
  }
};
