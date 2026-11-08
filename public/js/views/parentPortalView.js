/**
 * SkoolFinder Ghana - Parent Admissions & Tracking Portal View
 */
const ParentPortalView = {
  activeTab: 'overview',
  shortlistsData: null,
  shortlistFilter: 'all',
  overviewData: null,
  activeChildId: 'child-kwame',
  watchlistData: [
    {
      schoolId: 'sch-gis-accra',
      name: 'Ghana International School (GIS)',
      region: 'Greater Accra (Cantonments)',
      crest: '🏛️',
      accreditation: 'NaSIA Certified Gold',
      curriculum: 'Cambridge International (Primary to A-Level)',
      vacancyStatus: '2 Spots Open in Class 4 (2026/2027)',
      vacancyColor: '#059669',
      vacancyBg: '#ecfdf5',
      vacancyBorder: '#a7f3d0',
      lastChange: 'Updated 2026/2027 fee schedule (PTA Levy GH₵ 150) on 1 Nov 2026',
      alerts: { vacancies: true, fees: true, openDays: true, deadlines: true },
      channels: { sms: true, whatsapp: true, email: true }
    },
    {
      schoolId: 'sch-sos-tema',
      name: 'SOS Hermann Gmeiner International College',
      region: 'Greater Accra (Tema Community 6)',
      crest: '🎓',
      accreditation: 'NaSIA Certified Gold',
      curriculum: 'IB Middle Years & Diploma',
      vacancyStatus: 'Waitlist Open (Grade 7 & IB DP1)',
      vacancyColor: '#b45309',
      vacancyBg: '#fefce8',
      vacancyBorder: '#fde047',
      lastChange: 'Announced 2026 entrance exam dates on 28 Oct 2026',
      alerts: { vacancies: true, fees: false, openDays: true, deadlines: true },
      channels: { sms: true, whatsapp: true, email: false }
    },
    {
      schoolId: 'sch-achi-accra',
      name: 'Achimota Basic School',
      region: 'Greater Accra (Achimota)',
      crest: '🌳',
      accreditation: 'NaSIA Certified A+',
      curriculum: 'GES Standards-Based (Primary & JHS)',
      vacancyStatus: 'Open Day: 15 Dec 2026 at 10:00 AM',
      vacancyColor: '#059669',
      vacancyBg: '#ecfdf5',
      vacancyBorder: '#a7f3d0',
      lastChange: 'NaSIA Gold Institutional License renewed on 14 Oct 2026',
      alerts: { vacancies: false, fees: true, openDays: true, deadlines: false },
      channels: { sms: true, whatsapp: false, email: false }
    },
    {
      schoolId: 'sch-lcs-accra',
      name: 'Lincoln Community School',
      region: 'Greater Accra (Dzorwulu)',
      crest: '🌐',
      accreditation: 'International Baccalaureate (IB)',
      curriculum: 'IB Primary Years (PYP)',
      vacancyStatus: 'Admissions Closed for Term 1 (Term 2 Waitlist)',
      vacancyColor: '#dc2626',
      vacancyBg: '#fef2f2',
      vacancyBorder: '#fecaca',
      lastChange: 'Inaugurated AI & Robotics Wing on 5 Oct 2026',
      alerts: { vacancies: true, fees: true, openDays: false, deadlines: true },
      channels: { sms: false, whatsapp: true, email: true }
    }
  ],
  savedSearchesData: [
    {
      id: 'srch-01',
      title: 'Cambridge Primary with Swimming Pool & STEM Labs',
      querySummary: 'Cambridge Primary • Greater Accra (East Legon / Airport) • Pool & STEM • Max GH₵ 8,000/term',
      urlParams: '?curriculum=cambridge&location=East+Legon&facilities=pool,stem&maxFee=8000',
      frequency: 'instant',
      matchCount: 6,
      createdDate: '12 Oct 2026'
    },
    {
      id: 'srch-02',
      title: 'GES Standards-Based JHS with Full Boarding under GH₵ 4,500',
      querySummary: 'GES Standards-Based • Central Region (Cape Coast / Winneba) • Full Boarding • Max GH₵ 4,500/term',
      urlParams: '?curriculum=ges&region=Central&type=boarding&maxFee=4500',
      frequency: 'weekly',
      matchCount: 11,
      createdDate: '24 Oct 2026'
    },
    {
      id: 'srch-03',
      title: 'Montessori Early Years with Full-Time Nurse Sickbay',
      querySummary: 'Montessori / EYFS • Age 2–5 • Tema & Spintex • Verified Sickbay Nurse',
      urlParams: '?curriculum=montessori&age=early-years&location=Tema,Spintex&facilities=sickbay',
      frequency: 'daily',
      matchCount: 4,
      createdDate: '02 Nov 2026'
    }
  ],
  notificationsData: [
    {
      id: 'notif-01',
      category: 'admissions',
      unread: true,
      timestamp: 'Today at 09:15 AM',
      channelBadge: '📱 Hubtel SMS & In-App',
      channelColor: '#0A2046',
      title: 'Provisional Admission Offer Issued: Ghana International School',
      body: 'Official Offer Letter Ref: GIS/ADM/2026/OFF-0842 for Kwame Mensah has been dispatched. Review the formal terms and fee schedule.',
      actionType: 'offer_letter',
      actionLabel: '📄 View Formal Offer Letter',
      appId: 'adm-gis-2026-0842'
    },
    {
      id: 'notif-02',
      category: 'watchlist',
      unread: true,
      timestamp: 'Yesterday at 04:30 PM',
      channelBadge: '💬 WhatsApp Verified',
      channelColor: '#059669',
      title: 'SOS Hermann Gmeiner College: Vacancy Alert in Grade 7',
      body: '1 mid-year vacancy has opened following enrolment rebalancing. Admissions registry accepts vouchers until 30 November.',
      actionType: 'navigate',
      actionTarget: 'school-detail/sch-sos-tema',
      actionLabel: '🔍 Inspect School Profile'
    },
    {
      id: 'notif-03',
      category: 'admissions',
      unread: false,
      timestamp: '03 Nov 2026 at 10:00 AM',
      channelBadge: '📱 Hubtel SMS',
      channelColor: '#0A2046',
      title: 'Campus Tour Confirmed: Achimota Basic School',
      body: 'Your scheduled campus walkthrough with the Admissions Registrar is confirmed for 15 November 2026 at 10:00 AM.',
      actionType: 'tab',
      actionTarget: 'journey',
      actionLabel: '🛣️ View School Journey'
    },
    {
      id: 'notif-04',
      category: 'receipts',
      unread: false,
      timestamp: '15 Oct 2026 at 02:45 PM',
      channelBadge: '💳 MTN Mobile Money',
      channelColor: '#b45309',
      title: 'Admission Voucher Receipt #VOUCH-GIS-0842 Confirmed',
      body: 'Payment of GH₵ 150.00 via MTN MoMo successful. Digital voucher token dispatched to admissions desk.',
      actionType: 'tab',
      actionTarget: 'applications',
      actionLabel: '💳 View Voucher in Wallet'
    },
    {
      id: 'notif-05',
      category: 'safeguarding',
      unread: false,
      timestamp: '10 Oct 2026 at 08:00 AM',
      channelBadge: '🛡️ Act 843 DPC Privacy',
      channelColor: '#4338ca',
      title: 'Statutory Data Protection & Safeguarding Statement',
      body: 'Your Ghana Data Protection Act (Act 843) preferences were successfully recorded. Zero commercial third-party marketing authorized.',
      actionType: 'tab',
      actionTarget: 'privacy',
      actionLabel: '🛡️ Manage DPA Controls'
    }
  ],
  familyWards: [
    {
      id: 'child-kwame',
      firstName: 'Kwame',
      lastName: 'Mensah',
      dob: '2017-08-14',
      age: 9,
      gender: 'Male',
      currentGrade: 'Primary Class 4',
      applyingFor: 'Class 4 (Key Stage 2)',
      curriculumPreference: 'Cambridge Primary / GES Standards-Based',
      interests: ['STEM & Robotics', 'Competitive Swimming', 'Chess Club', 'French'],
      targetSchools: ['Ghana International School', 'Lincoln Community School', 'SOS Hermann Gmeiner'],
      activeApplicationsCount: 1,
      admissionStatus: 'Offer Extended ⭐'
    },
    {
      id: 'child-efua',
      firstName: 'Efua',
      lastName: 'Mensah',
      dob: '2022-02-22',
      age: 4,
      gender: 'Female',
      currentGrade: 'Nursery 2',
      applyingFor: 'Kindergarten 1 (KG1)',
      curriculumPreference: 'Montessori / Early Years Foundation Stage (EYFS)',
      interests: ['Creative Arts', 'Phonics & Reading', 'Music & Movement', 'Outdoor Discovery'],
      targetSchools: ['Roman Ridge Nursery', 'Little Explorers Montessori'],
      activeApplicationsCount: 0,
      admissionStatus: 'Shortlisting Phase 📌'
    }
  ],
  householdMembers: [
    {
      id: 'parent-primary',
      name: 'Dr. Elizabeth Mensah',
      role: 'Mother & Primary Account Holder',
      phone: '+233 24 111 2222',
      status: 'Active (Primary Controller)',
      permissions: ['Full Account Control', 'Admission Submissions', 'MoMo Fee Authorizations', 'SAR Export']
    },
    {
      id: 'parent-secondary',
      name: 'Kwesi Mensah',
      role: 'Father & Authorized Co-Guardian',
      phone: '+233 24 412 3456',
      status: 'Verified (Ghana Card GHA-729103841-2)',
      permissions: ['View Academic Reports', 'Receive Hubtel SMS Alerts', 'Authorize Campus Pick-up']
    }
  ],

  async render() {
    // 1. If not authenticated or not logged in as a parent, render Parent Sign Up & Auth Gateway
    if (!State.isAuthenticated() || !State.isParent()) {
      return this.renderAuthGateway();
    }

    const user = State.currentUser;
    // Fetch parent overview and 5-state shortlists from API
    try {
      const [overview, shortlistsRes, compsRes] = await Promise.all([
        API.getParentOverview().catch(err => {
          console.warn("Could not fetch remote parent overview:", err.message);
          return null;
        }),
        API.getParentShortlists ? API.getParentShortlists().catch(err => {
          console.warn("Could not fetch parent shortlists:", err.message);
          return null;
        }) : Promise.resolve(null),
        API.getParentSavedComparisons ? API.getParentSavedComparisons().catch(err => {
          console.warn("Could not fetch parent saved comparisons:", err.message);
          return null;
        }) : Promise.resolve(null)
      ]);
      this.overviewData = overview || {
        user: user || {},
        stats: { totalApplications: 0, totalInquiries: 0, totalSavedSchools: 0, totalInvoices: 0, totalOutstanding: 0 },
        applications: [],
        inquiries: [],
        savedSchools: [],
        invoices: [],
        reportCards: []
      };
      this.shortlistsData = shortlistsRes?.shortlists || [];
      this.savedComparisonsData = compsRes?.comparisons || [];
      try {
        const vRes = await API.getParentVouchers({ phone: user?.phone, email: user?.email });
        this.vouchersData = vRes?.vouchers || [];
      } catch (e) {
        this.vouchersData = [];
      }
    } catch (e) {
      console.warn("Could not fetch remote parent overview, falling back to clean state", e);
      this.overviewData = {
        user: user || {},
        stats: { totalApplications: 0, totalInquiries: 0, totalSavedSchools: 0, totalInvoices: 0, totalOutstanding: 0 },
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

    const { user: profile, stats = {}, inquiries = [], savedSchools = [], invoices = [], reportCards = [], smsNotifications = [] } = this.overviewData || {};
    const parentName = profile?.name || user?.name || (user?.email ? user.email.split('@')[0] : "Parent / Guardian");
    const parentEmail = profile?.email || user?.email || "";
    const parentPhone = profile?.phone || user?.phone || "";

    // Ensure interactive application dossier exists for parent admissions tracking (Module 05)
    if (!this.overviewData.applications || this.overviewData.applications.length === 0) {
      this.overviewData.applications = [
        {
          id: 'adm-gis-2026-0842',
          applicationNumber: 'GIS-ADM-2026-0842',
          schoolId: 'sch-gis-accra',
          schoolName: 'Ghana International School (GIS)',
          student: { firstName: 'Kwame', lastName: 'Mensah', dob: '14 May 2014', gender: 'Male' },
          parentGuardian: { name: parentName, phone: parentPhone || '+233 24 412 3456', email: parentEmail || 'parent@gmail.com' },
          gradeApplying: 'Primary Class 4 (Key Stage 2)',
          curriculum: 'Cambridge Primary',
          status: 'Offer Extended',
          stage: 5,
          submittedAt: '2026-10-15T10:00:00Z',
          examDate: 'Saturday, 15 November 2026',
          examTime: '09:00 AM',
          examVenue: 'Junior School Academic Block, Room J-12, Cantonments Campus',
          offerDetails: {
            offeredGrade: 'Class 4 (Key Stage 2)',
            termCommencing: 'Term 1 (September 2026)',
            termlyTuition: 4500,
            acceptanceDeadline: '30 November 2026',
            letterRef: 'GIS/ADM/2026/OFF-0842'
          },
          documents: [
            { id: 'doc-birth', name: "Child's Certified Birth Certificate", status: 'verified', label: 'Verified ✓' },
            { id: 'doc-reports', name: "Terminal Report Cards (Previous 2 Terms)", status: 'verified', label: 'Verified ✓' },
            { id: 'doc-health', name: "Immunization & Sickbay Health Record", status: 'verified', label: 'Verified ✓' },
            { id: 'doc-photos', name: "Passport-Size Photographs (2 Copies)", status: 'uploaded', label: 'Uploaded ✓' }
          ]
        }
      ];
    }
    const applications = this.overviewData.applications;

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

            <!-- Metric 2: Shortlisted Schools -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: #eff6ff; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                📌
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Shortlisted Schools
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: var(--primary-900);">
                  ${(this.shortlistsData || savedSchools || []).length}
                </div>
                <div style="font-size: 0.75rem; color: #1266C4; font-weight: 600;">
                  5-Stage Decision Board
                </div>
              </div>
            </div>

            <!-- Metric 3: Saved Comparisons -->
            <div class="analytics-stat-card" style="background: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.25rem;">
              <div style="font-size: 2.2rem; background: #fefce8; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                ⚖️
              </div>
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Saved Comparisons
                </div>
                <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: var(--primary-900);">
                  ${(this.savedComparisonsData || []).length}
                </div>
                <div style="font-size: 0.75rem; color: #b45309; font-weight: 600;">
                  20 Max Boards (100% Free)
                </div>
              </div>
            </div>

            <!-- Metric 4: School Fees & MoMo Bills -->
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
          </div>

          <!-- Blueprint v4.2 Decision Engine Navigation Tabs -->
          <div role="tablist" aria-label="Parent Portal Navigation Tabs" style="display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.35rem; scrollbar-width: thin;">
            <button role="tab" aria-selected="${this.activeTab === 'overview'}" class="parent-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'overview' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'overview' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🧭 Command Centre
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'shortlists'}" class="parent-tab-btn ${this.activeTab === 'shortlists' ? 'active' : ''}" data-tab="shortlists" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'shortlists' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'shortlists' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              📌 5-State Decision Board
              <span class="badge" style="background: #eff6ff; color: #1266C4; font-weight: 700;">${(this.shortlistsData || savedSchools || []).length}</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'comparisons'}" class="parent-tab-btn ${this.activeTab === 'comparisons' ? 'active' : ''}" data-tab="comparisons" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'comparisons' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'comparisons' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              ⚖️ Saved Comparisons
              <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">${(this.savedComparisonsData || []).length}</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'journey'}" class="parent-tab-btn ${this.activeTab === 'journey' ? 'active' : ''}" data-tab="journey" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'journey' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'journey' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🛣️ My School Journey
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'planning'}" class="parent-tab-btn ${this.activeTab === 'planning' ? 'active' : ''}" data-tab="planning" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'planning' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'planning' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              📋 Planning Studio
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'toolkit'}" class="parent-tab-btn ${this.activeTab === 'toolkit' ? 'active' : ''}" data-tab="toolkit" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'toolkit' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'toolkit' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🧰 Parent Toolkit
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'applications'}" class="parent-tab-btn ${this.activeTab === 'applications' ? 'active' : ''}" data-tab="applications" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'applications' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'applications' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              📝 Admissions &amp; Apps
              <span class="badge" style="background: var(--primary-100); color: var(--primary-800); font-weight: 700;">${applications.length}</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'watchlist'}" class="parent-tab-btn ${this.activeTab === 'watchlist' ? 'active' : ''}" data-tab="watchlist" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'watchlist' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'watchlist' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🔔 Watchlist &amp; Searches
              <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700;">4</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'notifications'}" class="parent-tab-btn ${this.activeTab === 'notifications' ? 'active' : ''}" data-tab="notifications" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'notifications' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'notifications' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              📬 Notifications
              <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 700;">2 new</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'family'}" class="parent-tab-btn ${this.activeTab === 'family' ? 'active' : ''}" data-tab="family" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'family' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'family' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              👶 Family &amp; Children
              <span class="badge" style="background: #f3e8ff; color: #7e22ce; font-weight: 700;">2 wards</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'privacy'}" class="parent-tab-btn ${this.activeTab === 'privacy' ? 'active' : ''}" data-tab="privacy" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'privacy' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'privacy' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🛡️ DPA 843 &amp; Security
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'support'}" class="parent-tab-btn ${this.activeTab === 'support' ? 'active' : ''}" data-tab="support" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'support' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'support' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              💡 Help &amp; Support
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'invoices'}" class="parent-tab-btn ${this.activeTab === 'invoices' ? 'active' : ''}" data-tab="invoices" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'invoices' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'invoices' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              💳 Fees &amp; MoMo Invoices
              <span class="badge" style="background: ${totalOutstanding > 0 ? '#fee2e2' : '#dcfce7'}; color: ${totalOutstanding > 0 ? '#991b1b' : '#166534'}; font-weight: 700;">${invoices.length}</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'inquiries'}" class="parent-tab-btn ${this.activeTab === 'inquiries' ? 'active' : ''}" data-tab="inquiries" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'inquiries' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'inquiries' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              💬 Direct Messages
              <span class="badge" style="background: var(--gold-100); color: var(--gold-800); font-weight: 700;">${inquiries.length}</span>
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'tutors'}" class="parent-tab-btn ${this.activeTab === 'tutors' ? 'active' : ''}" data-tab="tutors" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'tutors' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'tutors' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🧑‍🏫 Tutors
            </button>
            <button role="tab" aria-selected="${this.activeTab === 'enrolled'}" class="parent-tab-btn ${this.activeTab === 'enrolled' ? 'active' : ''}" data-tab="enrolled" style="padding: 0.75rem 1.25rem; background: none; border: none; font-size: 0.92rem; font-weight: 800; color: ${this.activeTab === 'enrolled' ? '#0A2046' : '#64748b'}; border-bottom: 3px solid ${this.activeTab === 'enrolled' ? '#D5A63B' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; transition: all 0.2s;">
              🎒 Enrolled Hub (SIS)
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
    if (this.activeTab === 'overview') {
      return this.renderOverviewTab();
    } else if (this.activeTab === 'shortlists') {
      return this.renderShortlistsTab();
    } else if (this.activeTab === 'comparisons') {
      return this.renderComparisonsTab();
    } else if (this.activeTab === 'journey') {
      return this.renderJourneyTab();
    } else if (this.activeTab === 'planning') {
      return this.renderPlanningTab();
    } else if (this.activeTab === 'toolkit') {
      return this.renderToolkitTab();
    } else if (this.activeTab === 'enrolled') {
      return this.renderEnrolledWardHubTab();
    } else if (this.activeTab === 'applications') {
      return this.renderApplicationsTab();
    } else if (this.activeTab === 'watchlist') {
      return this.renderWatchlistTab();
    } else if (this.activeTab === 'notifications') {
      return this.renderNotificationsTab();
    } else if (this.activeTab === 'family') {
      return this.renderFamilyTab();
    } else if (this.activeTab === 'privacy') {
      return this.renderPrivacyTab();
    } else if (this.activeTab === 'support') {
      return this.renderSupportTab();
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

  
  // Next Best Step rule calculation
  getNextBestStep(shortlists = [], applications = [], inquiries = []) {
    const considering = shortlists.filter(s => s.stage === 'considering');
    const interested = shortlists.filter(s => s.stage === 'interested');
    const preferred = shortlists.filter(s => s.stage === 'preferred');
    const visitPlanned = shortlists.filter(s => s.stage === 'visit_planned');

    if (shortlists.length === 0) {
      return {
        badge: "STEP 1: DISCOVER",
        badgeColor: "#1266C4",
        icon: "🧭",
        title: "Discover & Shortlist Your First Schools",
        description: "Search 40+ accredited Ghanaian institutions by curriculum (Cambridge, GES, IB), region, and boarding options.",
        ctaText: "Explore School Directory",
        ctaAction: "directory",
        actionType: "navigate"
      };
    }

    if (considering.length > 0 && interested.length === 0 && preferred.length === 0) {
      return {
        badge: "STEP 2: EVALUATE & COMPARE",
        badgeColor: "#D5A63B",
        icon: "⚖️",
        title: `Compare Your ${considering.length} Shortlisted School${considering.length > 1 ? 's' : ''}`,
        description: "Evaluate your choices side-by-side across 9 dimensions in the 4-Way Comparison Matrix or run the Fit Matchmaker.",
        ctaText: "Launch 4-Way Compare",
        ctaAction: "compare",
        actionType: "navigate"
      };
    }

    if ((interested.length > 0 || preferred.length > 0) && visitPlanned.length === 0) {
      const topSchool = preferred[0] || interested[0];
      return {
        badge: "STEP 3: CAMPUS EXPERIENCE",
        badgeColor: "#059669",
        icon: "🏫",
        title: `Plan a Campus Visit to ${topSchool.schoolName || 'Your Preferred School'}`,
        description: "Visiting in person is the most reliable way to evaluate teacher engagement, facilities, and school culture.",
        ctaText: "Open Planning Studio",
        ctaAction: "planning",
        actionType: "tab"
      };
    }

    if (visitPlanned.length > 0 && applications.length === 0) {
      return {
        badge: "STEP 4: ADMISSIONS PREPARATION",
        badgeColor: "#7c3aed",
        icon: "📝",
        title: "Prepare Your Admissions Checklist",
        description: "Gather previous terminal reports, certified birth certificates, and vaccination cards for submission.",
        ctaText: "View Admissions Desk",
        ctaAction: "applications",
        actionType: "tab"
      };
    }

    if (applications.length > 0) {
      return {
        badge: "STEP 5: TRACK JOURNEY",
        badgeColor: "#0284c7",
        icon: "🎯",
        title: "Track Entrance Exams & Admissions Decisions",
        description: "Monitor application review statuses and scheduled interview dates directly with school admissions officers.",
        ctaText: "Open My School Journey",
        ctaAction: "journey",
        actionType: "tab"
      };
    }

    return {
      badge: "ACTION RECOMMENDED",
      badgeColor: "#1266C4",
      icon: "✨",
      title: "Continue Your School Decision Process",
      description: "Review your 5-state shortlist board, update school notes, or compare candidate institutions.",
      ctaText: "View Decision Board",
      ctaAction: "shortlists",
      actionType: "tab"
    };
  },

  // 1. Command Centre Overview Tab
  renderOverviewTab() {
    const shortlists = this.shortlistsData || [];
    const applications = this.overviewData?.applications || [];
    const inquiries = this.overviewData?.inquiries || [];
    const nbs = this.getNextBestStep(shortlists, applications, inquiries);

    const counts = {
      considering: shortlists.filter(s => s.stage === 'considering').length,
      interested: shortlists.filter(s => s.stage === 'interested').length,
      preferred: shortlists.filter(s => s.stage === 'preferred').length,
      visit_planned: shortlists.filter(s => s.stage === 'visit_planned').length,
      not_suitable: shortlists.filter(s => s.stage === 'not_suitable').length
    };

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Next Best Step Guidance Card -->
        <div style="background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; border-bottom: 4px solid #D5A63B; box-shadow: 0 10px 25px -5px rgba(10,32,70,0.3); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div style="flex: 1; min-width: 280px;">
            <div style="display: inline-block; background: rgba(213, 166, 59, 0.2); border: 1px solid #D5A63B; color: #D5A63B; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 6px; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              ${nbs.badge}
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #ffffff; margin: 0 0 0.4rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>${nbs.icon}</span> ${nbs.title}
            </h2>
            <p style="color: #e2e8f0; font-size: 0.9rem; margin: 0; line-height: 1.5; max-width: 650px;">
              ${nbs.description}
            </p>
          </div>
          <div>
            <button type="button" class="btn-pill btn-gold btn-nbs-action" data-action-type="${nbs.actionType}" data-action="${nbs.ctaAction}" style="padding: 0.85rem 1.6rem; font-size: 0.95rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(213, 166, 59, 0.35);">
              <span>${nbs.icon}</span> ${nbs.ctaText} &rarr;
            </button>
          </div>
        </div>

        <!-- 5-State Decision Funnel Snapshot -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.2rem 0;">
                📌 5-State School Decision Funnel
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                Click any stage to filter candidate schools on your interactive decision board.
              </p>
            </div>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="shortlists" style="font-size: 0.84rem; font-weight: 700;">
              Open Full Decision Board &rarr;
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem;">
            <!-- Stage 1 -->
            <div class="funnel-metric-card btn-filter-stage" data-stage="considering" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">1. Considering</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #0A2046; margin: 0.25rem 0;">${counts.considering}</div>
              <div style="font-size: 0.75rem; color: #64748b;">Initial bookmarks</div>
            </div>

            <!-- Stage 2 -->
            <div class="funnel-metric-card btn-filter-stage" data-stage="interested" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #1e40af; text-transform: uppercase;">2. Interested</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #1266C4; margin: 0.25rem 0;">${counts.interested}</div>
              <div style="font-size: 0.75rem; color: #1e40af;">Evaluating fit</div>
            </div>

            <!-- Stage 3 -->
            <div class="funnel-metric-card btn-filter-stage" data-stage="preferred" style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #854d0e; text-transform: uppercase;">3. Preferred ⭐</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #b45309; margin: 0.25rem 0;">${counts.preferred}</div>
              <div style="font-size: 0.75rem; color: #854d0e;">Top admission choices</div>
            </div>

            <!-- Stage 4 -->
            <div class="funnel-metric-card btn-filter-stage" data-stage="visit_planned" style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase;">4. Visit Planned</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #15803d; margin: 0.25rem 0;">${counts.visit_planned}</div>
              <div style="font-size: 0.75rem; color: #166534;">Campus tour queued</div>
            </div>

            <!-- Stage 5 -->
            <div class="funnel-metric-card btn-filter-stage" data-stage="not_suitable" style="background: #f1f5f9; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">5. Not Suitable</div>
              <div style="font-size: 1.8rem; font-weight: 900; color: #64748b; margin: 0.25rem 0;">${counts.not_suitable}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">Archived choices</div>
            </div>
          </div>
        </div>

        <!-- Smart School Discovery Integration (Module 02) -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.2rem 0;">
                🔍 Smart School Discovery Presets
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                Curated 1-click filters tailored for Ghanaian parents &amp; guardians.
              </p>
            </div>
            <button type="button" class="btn-pill btn-outline" onclick="App.navigate('directory')" style="font-size: 0.84rem; font-weight: 700;">
              Browse All Schools &rarr;
            </button>
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button type="button" class="btn-parent-quick-filter" data-filter="cambridge" style="background: #f0fdf4; border: 1.5px solid #86efac; color: #166534; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <span>📚</span> Cambridge International (IGCSE)
            </button>
            <button type="button" class="btn-parent-quick-filter" data-filter="ges" style="background: #eff6ff; border: 1.5px solid #93c5fd; color: #1e40af; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <span>🇬🇭</span> GES Standards-Based Curriculum
            </button>
            <button type="button" class="btn-parent-quick-filter" data-filter="accra" style="background: #fefce8; border: 1.5px solid #fde047; color: #854d0e; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <span>📍</span> Greater Accra &amp; Tema Campuses
            </button>
            <button type="button" class="btn-parent-quick-filter" data-filter="boarding" style="background: #faf5ff; border: 1.5px solid #d8b4fe; color: #6b21a8; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <span>🛏️</span> Full Boarding Facilities
            </button>
            <button type="button" class="btn-parent-quick-filter" data-filter="montessori" style="background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <span>👶</span> Nursery &amp; Montessori Pre-Schools
            </button>
          </div>
        </div>

        <!-- Quick Decision Tools Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">⚖️</div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">4-Way School Comparison</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Place up to 4 shortlisted schools side-by-side across tuition tiers, student-teacher ratio, and WASSCE/Cambridge curricula.
              </p>
            </div>
            <button type="button" class="btn-pill btn-primary" onclick="App.navigate('compare')" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700;">
              Launch 4-Way Compare &rarr;
            </button>
          </div>

          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🎯</div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">School Fit Matchmaker</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Answer 2 quick steps on level, region, boarding, and priority to receive evidence-backed school recommendations.
              </p>
            </div>
            <button type="button" class="btn-pill btn-gold" onclick="App.navigate('matchmaker')" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700;">
              Run Fit Matchmaker &rarr;
            </button>
          </div>

          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📋</div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">Admissions Planning Studio</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Checklist of required documentation, headteacher interview questions, and official fee assumptions.
              </p>
            </div>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="planning" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700;">
              Open Planning Studio &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 2. 5-State Decision Board Tab
  renderShortlistsTab() {
    const shortlists = this.shortlistsData || [];
    const filter = this.shortlistFilter || 'all';

    const filtered = filter === 'all'
      ? shortlists
      : shortlists.filter(s => s.stage === filter);

    const counts = {
      all: shortlists.length,
      considering: shortlists.filter(s => s.stage === 'considering').length,
      interested: shortlists.filter(s => s.stage === 'interested').length,
      preferred: shortlists.filter(s => s.stage === 'preferred').length,
      visit_planned: shortlists.filter(s => s.stage === 'visit_planned').length,
      not_suitable: shortlists.filter(s => s.stage === 'not_suitable').length
    };

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header & Stage Filter Bar -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0 0 0.2rem 0;">
              📌 5-State School Shortlists &amp; Decision Board
            </h2>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Move candidate schools through decision stages and record private family notes.
            </p>
          </div>
          <button type="button" class="btn-pill btn-primary" onclick="App.navigate('directory')" style="font-size: 0.85rem; font-weight: 700;">
            <span>➕</span> Add More Schools
          </button>
        </div>

        <!-- Filter Stage Pills -->
        <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.25rem; flex-wrap: wrap;">
          <button type="button" class="btn-shortlist-filter ${filter === 'all' ? 'active' : ''}" data-stage="all" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'all' ? '#0A2046' : '#cbd5e1'}; background: ${filter === 'all' ? '#0A2046' : '#ffffff'}; color: ${filter === 'all' ? '#ffffff' : '#475569'};">
            All Schools (${counts.all})
          </button>
          <button type="button" class="btn-shortlist-filter ${filter === 'considering' ? 'active' : ''}" data-stage="considering" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'considering' ? '#64748b' : '#cbd5e1'}; background: ${filter === 'considering' ? '#64748b' : '#ffffff'}; color: ${filter === 'considering' ? '#ffffff' : '#475569'};">
            Considering (${counts.considering})
          </button>
          <button type="button" class="btn-shortlist-filter ${filter === 'interested' ? 'active' : ''}" data-stage="interested" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'interested' ? '#1266C4' : '#cbd5e1'}; background: ${filter === 'interested' ? '#1266C4' : '#ffffff'}; color: ${filter === 'interested' ? '#ffffff' : '#475569'};">
            Interested (${counts.interested})
          </button>
          <button type="button" class="btn-shortlist-filter ${filter === 'preferred' ? 'active' : ''}" data-stage="preferred" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'preferred' ? '#D5A63B' : '#cbd5e1'}; background: ${filter === 'preferred' ? '#D5A63B' : '#ffffff'}; color: ${filter === 'preferred' ? '#0A2046' : '#475569'};">
            Preferred ⭐ (${counts.preferred})
          </button>
          <button type="button" class="btn-shortlist-filter ${filter === 'visit_planned' ? 'active' : ''}" data-stage="visit_planned" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'visit_planned' ? '#059669' : '#cbd5e1'}; background: ${filter === 'visit_planned' ? '#059669' : '#ffffff'}; color: ${filter === 'visit_planned' ? '#ffffff' : '#475569'};">
            Visit Planned (${counts.visit_planned})
          </button>
          <button type="button" class="btn-shortlist-filter ${filter === 'not_suitable' ? 'active' : ''}" data-stage="not_suitable" style="padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: 1.5px solid ${filter === 'not_suitable' ? '#94a3b8' : '#cbd5e1'}; background: ${filter === 'not_suitable' ? '#94a3b8' : '#ffffff'}; color: ${filter === 'not_suitable' ? '#ffffff' : '#475569'};">
            Not Suitable (${counts.not_suitable})
          </button>
        </div>

        <!-- School Cards Container -->
        ${filtered.length === 0 ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px dashed #cbd5e1; padding: 3.5rem 1.5rem; text-align: center;">
            <div style="font-size: 2.8rem; margin-bottom: 0.75rem;">📌</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
              ${filter === 'all' ? 'No Shortlisted Schools Yet' : `No schools currently in "${filter.replace('_', ' ')}"`}
            </h3>
            <p style="font-size: 0.88rem; color: #64748b; margin: 0 auto 1.25rem auto; max-width: 440px;">
              Explore accredited schools across Ghana and bookmark them to organize your family admissions cockpit.
            </p>
            <button type="button" class="btn-pill btn-primary" onclick="App.navigate('directory')" style="font-size: 0.9rem; font-weight: 700;">
              Explore Schools Directory &rarr;
            </button>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 1.25rem;">
            ${filtered.map(s => `
              <div class="card shortlist-school-card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid ${s.priority ? '#D5A63B' : '#e2e8f0'}; padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                <div>
                  <!-- Top Row: Thumbnail + Title + Priority Star -->
                  <div style="display: flex; gap: 0.85rem; align-items: flex-start; margin-bottom: 0.85rem;">
                    <img src="${s.imageUrl}" alt="${s.schoolName}" style="width: 52px; height: 52px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0; flex-shrink: 0;" />
                    <div style="flex: 1; min-width: 0;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${s.schoolName}
                        </h4>
                        <button type="button" class="btn-toggle-priority" data-school-id="${s.schoolId}" data-priority="${s.priority ? 'true' : 'false'}" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0 0 0 0.4rem; color: ${s.priority ? '#D5A63B' : '#cbd5e1'};" title="${s.priority ? 'Top Choice Priority' : 'Mark as Top Choice'}">
                          ★
                        </button>
                      </div>
                      <div style="display: flex; gap: 0.35rem; align-items: center; margin-top: 0.3rem; flex-wrap: wrap;">
                        <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; background: #f1f5f9; border-radius: 4px; color: #475569; font-weight: 600;">📍 ${s.region}</span>
                        <span style="font-size: 0.72rem; padding: 0.1rem 0.45rem; background: #fef3c7; border-radius: 4px; color: #92400e; font-weight: 600;">📚 ${s.curriculum}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Stage Selector Dropdown -->
                  <div style="margin-bottom: 0.85rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem 0.75rem; display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase;">Stage:</span>
                    <select class="sel-shortlist-stage" data-school-id="${s.schoolId}" style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.3rem 0.5rem; font-size: 0.82rem; font-weight: 700; background: #ffffff; color: #0A2046; cursor: pointer;">
                      <option value="considering" ${s.stage === 'considering' ? 'selected' : ''}>1. Considering</option>
                      <option value="interested" ${s.stage === 'interested' ? 'selected' : ''}>2. Interested</option>
                      <option value="preferred" ${s.stage === 'preferred' ? 'selected' : ''}>3. Preferred ⭐</option>
                      <option value="visit_planned" ${s.stage === 'visit_planned' ? 'selected' : ''}>4. Visit Planned</option>
                      <option value="not_suitable" ${s.stage === 'not_suitable' ? 'selected' : ''}>5. Not Suitable</option>
                    </select>
                  </div>

                  <!-- Private Parent Notes Area -->
                  <div style="margin-bottom: 0.85rem;">
                    <label style="font-size: 0.74rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; display: flex; justify-content: space-between;">
                      <span>📝 Private Family Notes</span>
                      <span class="notes-status-hint" id="notes-status-${s.schoolId}" style="font-size: 0.7rem; color: #16a34a; font-weight: 600;"></span>
                    </label>
                    <textarea class="txt-shortlist-notes form-textarea" data-school-id="${s.schoolId}" rows="2" placeholder="Record admission impressions, tuition notes, or open day details..." style="width: 100%; font-size: 0.82rem; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; line-height: 1.4; resize: vertical;">${s.notes || ''}</textarea>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; margin-top: 0.5rem;">
                  <button type="button" class="btn-shortlist-compare" data-school-id="${s.schoolId}" style="background: none; border: none; font-size: 0.78rem; font-weight: 700; color: #1266C4; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                    <span>⚖️</span> Compare
                  </button>
                  <button type="button" onclick="App.navigate('schools', '${s.slug}')" style="background: none; border: none; font-size: 0.78rem; font-weight: 700; color: #475569; cursor: pointer;">
                    View Profile &rarr;
                  </button>
                  <button type="button" class="btn-remove-shortlist" data-school-id="${s.schoolId}" style="background: none; border: none; font-size: 0.78rem; font-weight: 700; color: #dc2626; cursor: pointer;">
                    Remove
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  // 4. Saved Comparisons Manager Tab (Module 04)
  renderComparisonsTab() {
    const comparisons = this.savedComparisonsData || [];
    const preferredSchools = (this.shortlistsData || []).filter(s => s.stage === 'preferred');

    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        <!-- Header & Quota Information -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem 1.75rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #0A2046; margin: 0;">
                ⚖️ Saved School Comparisons &amp; Matrices
              </h2>
              <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; border: 1px solid #fde68a;">
                ⭐ 20 Max Boards (100% Free Forever)
              </span>
            </div>
            <p style="font-size: 0.88rem; color: #64748b; margin: 0;">
              Revisit multi-school side-by-side matrices, compare fee structures, and evaluate academic curricula.
            </p>
          </div>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            ${preferredSchools.length >= 2 ? `
              <button type="button" id="btn-compare-all-preferred" class="btn-pill btn-gold" style="font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                <span>⭐</span> Compare Top Preferred (${preferredSchools.length})
              </button>
            ` : ''}
            <button type="button" class="btn-pill btn-primary" onclick="App.navigate('compare')" style="font-size: 0.85rem; font-weight: 700;">
              <span>➕</span> New 4-Way Comparison
            </button>
          </div>
        </div>

        <!-- Comparisons List / Cards -->
        ${comparisons.length === 0 ? `
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px dashed #cbd5e1; padding: 3.5rem 1.5rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">⚖️</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">
              No Saved Comparisons Yet
            </h3>
            <p style="font-size: 0.88rem; color: #64748b; margin: 0 auto 1.5rem auto; max-width: 480px; line-height: 1.5;">
              When browsing the school directory or reviewing your decision board, add schools to the 4-way comparison tool and click <strong>"Save Comparison to Account"</strong> to keep them here for family discussion.
            </p>
            <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="btn-pill btn-primary" onclick="App.navigate('compare')" style="font-size: 0.9rem; font-weight: 700;">
                Launch 4-Way Compare Matrix &rarr;
              </button>
              <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="shortlists" style="font-size: 0.9rem; font-weight: 700;">
                Select from Shortlists &rarr;
              </button>
            </div>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem;">
            ${comparisons.map((comp, idx) => `
              <div class="card comparison-board-card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div>
                      <span class="badge" style="background: #eff6ff; color: #1e40af; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                        Board #${idx + 1} &bull; ${(comp.schoolIds || []).length} Schools
                      </span>
                      <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.35rem 0 0 0;">
                        ${comp.title || 'Multi-School Comparison Board'}
                      </h4>
                    </div>
                    <button type="button" class="btn-delete-saved-comparison" data-comp-id="${comp.id}" style="background: none; border: none; font-size: 1.1rem; color: #94a3b8; cursor: pointer; padding: 0.2rem;" title="Delete this saved comparison">
                      🗑️
                    </button>
                  </div>

                  <p style="font-size: 0.8rem; color: #64748b; margin: 0 0 1rem 0;">
                    Saved on ${comp.created_at ? new Date(comp.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent session'}
                  </p>

                  <!-- School Badges / Pills in this set -->
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
                    ${(comp.schoolIds || []).map(id => {
                      const found = (this.shortlistsData || []).find(s => s.schoolId === id || s.slug === id);
                      const name = found ? found.schoolName : id.replace(/^sch-/, '').replace(/-/g, ' ').toUpperCase();
                      return `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.84rem;">
                          <span style="font-weight: 700; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">🏫 ${name}</span>
                          <span style="font-size: 0.75rem; color: #1266C4; font-weight: 600;">Inspect</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div style="display: flex; gap: 0.6rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                  <button type="button" class="btn-pill btn-primary btn-launch-saved-comparison" data-school-ids="${(comp.schoolIds || []).join(',')}" style="flex: 1; justify-content: center; font-size: 0.88rem; font-weight: 700;">
                    Launch 4-Way Matrix &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  // 3. My School Journey Timeline Tab (Module 05)
  renderJourneyTab() {
    const shortlists = this.shortlistsData || [];
    const applications = this.overviewData?.applications || [];
    const inquiries = this.overviewData?.inquiries || [];
    const hasOffer = applications.some(a => (a.status || '').toLowerCase().includes('offer') || a.stage >= 5);
    const hasAccepted = applications.some(a => (a.status || '').toLowerCase().includes('accept') || a.stage >= 6);

    return `
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #0A2046; margin: 0;">
                🛣️ My School Admissions Journey
              </h2>
              <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; border: 1px solid #bfdbfe;">
                6-Stage Interactive Roadmap
              </span>
            </div>
            <p style="font-size: 0.88rem; color: #64748b; margin: 0;">
              Chronological progress tracking from initial discovery to final student induction across Ghanaian institutions.
            </p>
          </div>
          <button type="button" class="btn-pill btn-primary btn-switch-tab" data-target-tab="applications" style="font-size: 0.85rem; font-weight: 700;">
            View Detailed Dossiers (${applications.length}) &rarr;
          </button>
        </div>

        <div class="journey-timeline" style="display: flex; flex-direction: column; gap: 2rem; position: relative; padding-left: 2rem; border-left: 3px solid #e2e8f0; margin-left: 1rem;">
          <!-- Milestone 1: Discovery & Shortlisting -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: #1266C4; border: 3px solid #ffffff; box-shadow: 0 0 0 2px #1266C4; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">✓</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">
                Stage 1 &bull; Exploration &amp; 5-State Shortlists
              </div>
              <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 700;">Completed</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              ${shortlists.length} Candidate School(s) Evaluated
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              ${shortlists.length > 0 ? `Active candidates on your decision board: <strong>${shortlists.slice(0, 3).map(s => s.schoolName).join(', ')}</strong>` : 'Explore accredited Ghanaian institutions by location, fees, and curriculum.'}
            </p>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="shortlists" style="font-size: 0.8rem; font-weight: 700; padding: 0.35rem 0.85rem;">
              Open Decision Board &rarr;
            </button>
          </div>

          <!-- Milestone 2: Enquiries & Direct Messaging -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: ${inquiries.length > 0 ? '#10b981' : '#cbd5e1'}; border: 3px solid #ffffff; box-shadow: 0 0 0 2px ${inquiries.length > 0 ? '#10b981' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">${inquiries.length > 0 ? '✓' : '2'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: ${inquiries.length > 0 ? '#059669' : '#64748b'}; text-transform: uppercase;">
                Stage 2 &bull; Direct School Admissions Inquiries
              </div>
              <span class="badge" style="background: ${inquiries.length > 0 ? '#ecfdf5' : '#f1f5f9'}; color: ${inquiries.length > 0 ? '#065f46' : '#64748b'}; font-size: 0.72rem; font-weight: 700;">
                ${inquiries.length > 0 ? 'Active Queue' : 'Open'}
              </span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              ${inquiries.length} Inquiries &amp; Prospectus Requests
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              Communicate directly with school admissions bursars, request official fee schedules, and ask questions.
            </p>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="inquiries" style="font-size: 0.8rem; font-weight: 700; padding: 0.35rem 0.85rem;">
              Open Direct Messages &rarr;
            </button>
          </div>

          <!-- Milestone 3: Campus Visits & Tours -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: ${shortlists.some(s => s.stage === 'visit_planned') ? '#059669' : '#cbd5e1'}; border: 3px solid #ffffff; box-shadow: 0 0 0 2px ${shortlists.some(s => s.stage === 'visit_planned') ? '#059669' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">${shortlists.some(s => s.stage === 'visit_planned') ? '✓' : '3'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #059669; text-transform: uppercase;">
                Stage 3 &bull; Campus Open Days &amp; Walkthroughs
              </div>
              <span class="badge" style="background: ${shortlists.some(s => s.stage === 'visit_planned') ? '#f0fdf4' : '#f1f5f9'}; color: ${shortlists.some(s => s.stage === 'visit_planned') ? '#166534' : '#64748b'}; font-size: 0.72rem; font-weight: 700;">
                ${shortlists.some(s => s.stage === 'visit_planned') ? 'Scheduled' : 'Next Step'}
              </span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              ${shortlists.filter(s => s.stage === 'visit_planned').length} Campus Tour(s) Queued
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              Tour early-years classrooms, science laboratories, ICT suites, dining halls, and sports complexes.
            </p>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="planning" style="font-size: 0.8rem; font-weight: 700; padding: 0.35rem 0.85rem;">
              View Visit Checklist &rarr;
            </button>
          </div>

          <!-- Milestone 4: Formal Applications & Vouchers -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: ${applications.length > 0 ? '#10b981' : '#cbd5e1'}; border: 3px solid #ffffff; box-shadow: 0 0 0 2px ${applications.length > 0 ? '#10b981' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">${applications.length > 0 ? '✓' : '4'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #1e40af; text-transform: uppercase;">
                Stage 4 &bull; Formal Application Dossier &amp; Vouchers
              </div>
              <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-size: 0.72rem; font-weight: 700;">
                ${applications.length > 0 ? 'Submitted' : 'Pending'}
              </span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              ${applications.length} Official Application(s) on File
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              Birth certificates, immunization records, and academic report cards submitted under Act 843 encryption.
            </p>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="applications" style="font-size: 0.8rem; font-weight: 700; padding: 0.35rem 0.85rem;">
              View Applications &rarr;
            </button>
          </div>

          <!-- Milestone 5: Diagnostic Assessment & Interview -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: #f59e0b; border: 3px solid #ffffff; box-shadow: 0 0 0 2px #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">⚡</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #b45309; text-transform: uppercase;">
                Stage 5 &bull; Diagnostic Assessment &amp; Oral Interview
              </div>
              <span class="badge" style="background: #fefce8; color: #854d0e; font-size: 0.72rem; font-weight: 700;">
                Completed (Passed)
              </span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              Entrance Assessment Clearance
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              English comprehension, quantitative numeracy, and oral presentation evaluation completed at Junior School Cantonments campus.
            </p>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="applications" style="font-size: 0.8rem; font-weight: 700; padding: 0.35rem 0.85rem;">
              View Assessment Pass &rarr;
            </button>
          </div>

          <!-- Milestone 6: Official Offer & Enrolment -->
          <div style="position: relative;">
            <div style="position: absolute; left: -2.75rem; top: 0; width: 24px; height: 24px; border-radius: 50%; background: ${hasAccepted ? '#059669' : '#D5A63B'}; border: 3px solid #ffffff; box-shadow: 0 0 0 2px ${hasAccepted ? '#059669' : '#D5A63B'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #fff;">${hasAccepted ? '✓' : '🎉'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #854d0e; text-transform: uppercase;">
                Stage 6 &bull; Official Offer Letter &amp; Enrolment
              </div>
              <span class="badge" style="background: ${hasAccepted ? '#dcfce7' : '#fef3c7'}; color: ${hasAccepted ? '#166534' : '#92400e'}; font-size: 0.72rem; font-weight: 800;">
                ${hasAccepted ? '✓ Enrolment Confirmed' : '🎉 Offer Ready for Review'}
              </span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
              Provisional Placement &amp; MoMo Fee Settlement
            </h4>
            <p style="font-size: 0.86rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.5;">
              Official offer letter extended for Class 4. Accept the placement and settle your termly tuition deposit to unlock your ward's Digital Student ID.
            </p>
            <button type="button" class="btn-pill btn-gold btn-switch-tab" data-target-tab="applications" style="font-size: 0.8rem; font-weight: 800; padding: 0.35rem 0.85rem;">
              Review Formal Offer Letter &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Parent Planning Studio Tab (Module 06)
  renderPlanningTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Banner -->
        <div style="background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; border-bottom: 3px solid #D5A63B; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              Family Admissions Readiness &amp; Strategy
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              Parent Admissions Planning Studio
            </h2>
            <p style="color: #e2e8f0; font-size: 0.9rem; margin: 0; max-width: 650px; line-height: 1.5;">
              Plan academic curricula, calculate annual tuition commitments, evaluate school fit criteria, and organize required documents.
            </p>
          </div>
          <button type="button" class="btn-pill btn-gold btn-switch-tab" data-target-tab="toolkit" style="font-size: 0.85rem; font-weight: 800;">
            <span>🧰</span> Open Parent Toolkit &rarr;
          </button>
        </div>

        <!-- Section 1: Curriculum Pathways Comparison -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">Curriculum Strategic Planning</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.35rem 0;">
              📚 Ghanaian &amp; International Curriculum Pathways
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Compare learning methodologies, assessment frameworks, and secondary progression routes.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.25rem;">
            <!-- Pathway 1: GES -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; font-size: 0.72rem;">🇬🇭 GES Standards-Based</span>
                  <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Ministry of Education</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">Ghana Education Service Pathway</h4>
                <p style="font-size: 0.82rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.45;">
                  Focuses on inquiry-based learning, Ghanaian cultural identity, Ghanaian languages, and STEM basics. Transitions through BECE into public or private Senior High Schools (CSSPS).
                </p>
                <div style="font-size: 0.78rem; color: #334155; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;">
                  <div><strong>Primary Assessment:</strong> National Standardised Test (NST)</div>
                  <div><strong>Exit Qualification:</strong> BECE &bull; WASSCE</div>
                  <div><strong>Tuition Cost Tier:</strong> Moderate to Budget-Friendly</div>
                </div>
              </div>
              <button type="button" class="btn-parent-quick-filter btn-pill btn-outline" data-filter="ges" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Find GES Accredited Schools &rarr;
              </button>
            </div>

            <!-- Pathway 2: Cambridge -->
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.72rem;">📚 Cambridge Assessment</span>
                  <span style="font-size: 0.75rem; color: #166534; font-weight: 600;">International UK</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">Cambridge International Pathway</h4>
                <p style="font-size: 0.82rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.45;">
                  Global gold standard recognized across worldwide universities. Emphasizes critical thinking, analytical problem solving, and global perspectives from Primary to A-Levels.
                </p>
                <div style="font-size: 0.78rem; color: #334155; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;">
                  <div><strong>Primary Assessment:</strong> Cambridge Primary Checkpoint</div>
                  <div><strong>Exit Qualification:</strong> IGCSE &bull; Cambridge AS / A-Levels</div>
                  <div><strong>Tuition Cost Tier:</strong> Premium to High-End</div>
                </div>
              </div>
              <button type="button" class="btn-parent-quick-filter btn-pill btn-primary" data-filter="cambridge" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Find Cambridge Schools &rarr;
              </button>
            </div>

            <!-- Pathway 3: IB / Dual -->
            <div style="background: #fefce8; border: 1.5px solid #fde047; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.72rem;">🌍 International Baccalaureate</span>
                  <span style="font-size: 0.75rem; color: #854d0e; font-weight: 600;">IB World Schools</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">IB PYP / MYP &amp; Diploma</h4>
                <p style="font-size: 0.82rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.45;">
                  Holistic student-centered framework cultivating international-mindedness, community action (CAS), Theory of Knowledge (TOK), and extended academic research.
                </p>
                <div style="font-size: 0.78rem; color: #334155; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem;">
                  <div><strong>Primary Assessment:</strong> PYP Exhibition &bull; MYP eAssessment</div>
                  <div><strong>Exit Qualification:</strong> International Baccalaureate Diploma</div>
                  <div><strong>Tuition Cost Tier:</strong> Tier 1 International</div>
                </div>
              </div>
              <button type="button" class="btn-parent-quick-filter btn-pill btn-gold" data-filter="cambridge" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Find IB World Campuses &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- Section 2: Interactive Termly & Annual School Fee Budget Calculator -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">Financial Planning &amp; Budgeting</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
                💳 Interactive Ghanaian School Fee Calculator
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                Project your comprehensive educational expenditure per term and calculate monthly savings targets.
              </p>
            </div>
            <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; border: 1px solid #a7f3d0;">
              🇬🇭 Ghana Cedis (GH₵)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.75rem; align-items: start;">
            <!-- Inputs Column -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem 0;">
                Cost Assumptions (Per Term / Annual)
              </h4>

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.25rem;">
                    Tuition Fee Per Term (GH₵)
                  </label>
                  <input type="number" id="calc-input-tuition" class="form-input" value="3500" min="0" step="100" style="width: 100%; font-weight: 700;" />
                </div>

                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.25rem;">
                    Feeding / Hot Lunch Meal Plan Per Term (GH₵)
                  </label>
                  <input type="number" id="calc-input-feeding" class="form-input" value="800" min="0" step="50" style="width: 100%;" />
                </div>

                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.25rem;">
                    School Bus / Shuttle Transit Per Term (GH₵)
                  </label>
                  <input type="number" id="calc-input-transit" class="form-input" value="600" min="0" step="50" style="width: 100%;" />
                </div>

                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.25rem;">
                    Books, PTA Levy &amp; Technology Fee Per Term (GH₵)
                  </label>
                  <input type="number" id="calc-input-levies" class="form-input" value="250" min="0" step="25" style="width: 100%;" />
                </div>

                <div>
                  <label style="font-size: 0.78rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.25rem;">
                    School Uniforms, Kits &amp; Books (Annual One-Off GH₵)
                  </label>
                  <input type="number" id="calc-input-uniforms" class="form-input" value="450" min="0" step="50" style="width: 100%;" />
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button type="button" id="btn-recalc-budget" class="btn-pill btn-primary" style="flex: 1; justify-content: center; font-size: 0.85rem; font-weight: 800;">
                    Recalculate Budget &rarr;
                  </button>
                  <button type="button" id="btn-reset-budget" class="btn-pill btn-outline" style="font-size: 0.85rem;">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- Real-Time Projection Output Cards -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); color: #ffffff; border-radius: 12px; padding: 1.5rem; border-left: 5px solid #D5A63B; box-shadow: 0 4px 12px rgba(10,32,70,0.15);">
                <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase;">
                  Estimated Termly Expenditure
                </div>
                <div id="calc-termly-total" style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; margin: 0.35rem 0 0.25rem 0;">
                  GH₵ 5,150.00
                </div>
                <div style="font-size: 0.82rem; color: #cbd5e1;">
                  Total cost due at the start of each of the 3 terms.
                </div>
              </div>

              <div style="background: #ffffff; border: 2px solid #059669; border-radius: 12px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">
                    Annual Total Educational Commitment
                  </div>
                  <div id="calc-annual-total" style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 900; color: #0A2046; margin-top: 0.2rem;">
                    GH₵ 15,900.00
                  </div>
                  <div style="font-size: 0.78rem; color: #64748b;">
                    Includes 3 full terms plus annual uniforms &amp; materials.
                  </div>
                </div>
                <div style="font-size: 2rem;">📊</div>
              </div>

              <div style="background: #fefce8; border: 1.5px solid #fde047; border-radius: 12px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #854d0e; text-transform: uppercase;">
                    Target Monthly Family Savings
                  </div>
                  <div id="calc-monthly-savings" style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 900; color: #b45309; margin-top: 0.2rem;">
                    GH₵ 1,325.00 / mo
                  </div>
                  <div style="font-size: 0.78rem; color: #854d0e;">
                    Save this amount monthly to settle school invoices seamlessly via MoMo.
                  </div>
                </div>
                <div style="font-size: 2rem;">💰</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: School Fit Criteria Scorer -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase;">Objective Decision Scoring</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
                🎯 5-Dimension School Fit Criteria Scorer
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                Rate your candidate school across key criteria to calculate an evidence-based match percentage.
              </p>
            </div>
            <div id="fit-score-badge" class="badge" style="background: #f0fdf4; color: #166534; font-size: 0.95rem; font-weight: 800; padding: 0.45rem 1rem; border: 1.5px solid #86efac; border-radius: 999px;">
              Fit Score: 23 / 25 (92% Exceptional Match ⭐)
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0A2046; display: block; margin-bottom: 0.35rem;">
                1. Curriculum &amp; Academic Track
              </label>
              <select class="fit-score-select form-input" data-dimension="curriculum" style="width: 100%; font-weight: 700;">
                <option value="5" selected>5 - Perfect Match (e.g. Cambridge / Preferred)</option>
                <option value="4">4 - Strong Academic Standard</option>
                <option value="3">3 - Acceptable / Adequate</option>
                <option value="2">2 - Needs Improvement</option>
                <option value="1">1 - Poor Fit</option>
              </select>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0A2046; display: block; margin-bottom: 0.35rem;">
                2. Commute &amp; Traffic Proximity
              </label>
              <select class="fit-score-select form-input" data-dimension="commute" style="width: 100%; font-weight: 700;">
                <option value="5">5 - Under 15 mins (Walkable / Easy)</option>
                <option value="4" selected>4 - 15 to 30 mins (Direct route)</option>
                <option value="3">3 - 30 to 45 mins (Heavy traffic)</option>
                <option value="2">2 - Over 1 hour commute</option>
                <option value="1">1 - Unmanageable daily distance</option>
              </select>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0A2046; display: block; margin-bottom: 0.35rem;">
                3. Campus Safety &amp; Sickbay
              </label>
              <select class="fit-score-select form-input" data-dimension="safety" style="width: 100%; font-weight: 700;">
                <option value="5" selected>5 - Resident nurse, CCTV, locked gate</option>
                <option value="4">4 - Verified secure campus</option>
                <option value="3">3 - Standard basic safety</option>
                <option value="2">2 - Limited supervision</option>
                <option value="1">1 - Inadequate safeguarding</option>
              </select>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0A2046; display: block; margin-bottom: 0.35rem;">
                4. Sports &amp; Extracurriculars
              </label>
              <select class="fit-score-select form-input" data-dimension="sports" style="width: 100%; font-weight: 700;">
                <option value="5" selected>5 - Swimming pool, robotics, music &amp; arts</option>
                <option value="4">4 - Multiple active student clubs</option>
                <option value="3">3 - Basic sports pitch</option>
                <option value="2">2 - Minimal activities</option>
                <option value="1">1 - No extracurriculars</option>
              </select>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;">
              <label style="font-size: 0.78rem; font-weight: 800; color: #0A2046; display: block; margin-bottom: 0.35rem;">
                5. Fee Budget &amp; MoMo Terms
              </label>
              <select class="fit-score-select form-input" data-dimension="budget" style="width: 100%; font-weight: 700;">
                <option value="5">5 - Completely within family budget</option>
                <option value="4" selected>4 - Comfortable with instalment terms</option>
                <option value="3">3 - Stretching family finances</option>
                <option value="2">2 - High financial strain</option>
                <option value="1">1 - Beyond affordability</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 4: Admissions Document Readiness & Visit Questions -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <!-- Document Checklist -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.85rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>📁</span> Admissions Document Readiness
            </h3>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0;">
              Tick off documents you have prepared to streamline school application submissions:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: #334155; cursor: pointer;">
                <input type="checkbox" class="chk-plan-doc" data-doc="birth_cert" style="width: 1.1rem; height: 1.1rem; accent-color: #1266C4;" />
                Certified Copy of Child's Birth Certificate
              </label>
              <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: #334155; cursor: pointer;">
                <input type="checkbox" class="chk-plan-doc" data-doc="terminal_reports" style="width: 1.1rem; height: 1.1rem; accent-color: #1266C4;" />
                Terminal Report Cards from Previous 2 Terms
              </label>
              <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: #334155; cursor: pointer;">
                <input type="checkbox" class="chk-plan-doc" data-doc="immunisation" style="width: 1.1rem; height: 1.1rem; accent-color: #1266C4;" />
                Updated Child Health &amp; Immunisation Record
              </label>
              <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: #334155; cursor: pointer;">
                <input type="checkbox" class="chk-plan-doc" data-doc="photos" style="width: 1.1rem; height: 1.1rem; accent-color: #1266C4;" />
                Passport-Size Student Photographs (White Background)
              </label>
              <label style="display: flex; align-items: center; gap: 0.65rem; font-size: 0.88rem; color: #334155; cursor: pointer;">
                <input type="checkbox" class="chk-plan-doc" data-doc="ghana_card" style="width: 1.1rem; height: 1.1rem; accent-color: #1266C4;" />
                Ghana Card / National ID of Parent or Guardian
              </label>
            </div>
          </div>

          <!-- Questions for Campus Visits -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.85rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>❓</span> Open Day Questions for Headmasters
            </h3>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0;">
              High-impact questions to assess school quality during campus visits:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; color: #475569; line-height: 1.45;">
              <div style="padding: 0.65rem 0.85rem; background: #f8fafc; border-left: 3px solid #1266C4; border-radius: 6px;">
                <strong>Academic Support:</strong> "What is your average student-to-teacher ratio in early years and JHS classes?"
              </div>
              <div style="padding: 0.65rem 0.85rem; background: #f8fafc; border-left: 3px solid #D5A63B; border-radius: 6px;">
                <strong>Fee Structure:</strong> "Are feeding, textbooks, uniforms, and extracurricular clubs included or billed separately?"
              </div>
              <div style="padding: 0.65rem 0.85rem; background: #f8fafc; border-left: 3px solid #059669; border-radius: 6px;">
                <strong>Safety &amp; Health:</strong> "Is there a resident nurse in the sickbay, and how is campus access controlled during school hours?"
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 4B. Parent Educational Toolkit Tab (Module 07)
  renderToolkitTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Banner -->
        <div style="background: linear-gradient(135deg, #0A2046 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-xl); padding: 1.75rem 2rem; border-bottom: 3px solid #D5A63B; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              Ghana MoE &amp; GES Authoritative Resources
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin: 0 0 0.4rem 0;">
              🧰 Parent Educational Toolkit &amp; Guides
            </h2>
            <p style="color: #e2e8f0; font-size: 0.9rem; margin: 0; max-width: 650px; line-height: 1.5;">
              Access official BECE CSSPS placement tools, past examination papers, statutory academic calendars, and expert parent advisories.
            </p>
          </div>
          <button type="button" class="btn-pill btn-gold" onclick="App.navigate('cssps')" style="font-size: 0.85rem; font-weight: 800;">
            <span>🎓</span> BECE CSSPS Predictor &rarr;
          </button>
        </div>

        <!-- Row 1: Core Tools Shortcuts -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <!-- Tool 1: CSSPS Predictor -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎓</div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">SHS Admissions Engine</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.4rem 0;">
                BECE CSSPS Placement Predictor
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Calculate BECE aggregates (Core 4 + Best 2), predict placement chances across Category A, B, and C Senior High Schools, and understand the 30% public feeder school quota.
              </p>
            </div>
            <button type="button" class="btn-pill btn-primary" onclick="App.navigate('cssps')" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700;">
              Launch CSSPS Predictor &rarr;
            </button>
          </div>

          <!-- Tool 2: Past Questions Library -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📚</div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #9d174d; text-transform: uppercase;">Examination Mastery</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.4rem 0;">
                WAEC / BECE Past Questions &amp; Schemes
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Access official past exam papers with examiner marking schemes for Mathematics, Integrated Science, English Language, and Social Studies.
              </p>
            </div>
            <button type="button" class="btn-pill btn-outline" onclick="App.navigate('past-questions')" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700; color: #9d174d; border-color: #ec4899;">
              Access Past Questions &rarr;
            </button>
          </div>

          <!-- Tool 3: Matchmaker -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase;">Smart Recommendations</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.4rem 0;">
                AI-Powered School Fit Matchmaker
              </h3>
              <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                Answer 4 guided questions on your preferred location, curriculum preference, boarding status, and budget to find ideal matching schools.
              </p>
            </div>
            <button type="button" class="btn-pill btn-gold" onclick="App.navigate('matchmaker')" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700;">
              Run School Matchmaker &rarr;
            </button>
          </div>
        </div>

        <!-- Row 2: Official 2026/2027 Ghanaian Academic Year Calendar -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">Ghana Ministry of Education &amp; GES</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              🗓️ Official 2026 / 2027 Academic Year Term Dates
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Harmonized term dates and examination windows for Basic Schools and Senior High Schools across Ghana.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            <!-- Term 1 -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem;">
              <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; margin-bottom: 0.5rem; display: inline-block;">
                Term 1 (First Term) &bull; 15 Weeks
              </span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">
                8 September 2026 &ndash; 18 December 2026
              </h4>
              <ul style="font-size: 0.82rem; color: #475569; padding-left: 1.2rem; margin: 0; line-height: 1.6;">
                <li><strong>Mid-Term Break:</strong> 22 Oct &ndash; 26 Oct 2026</li>
                <li><strong>Christmas Vacation:</strong> 19 Dec 2026 &ndash; 11 Jan 2027</li>
                <li><strong>Public Holiday:</strong> Kwame Nkrumah Memorial Day (21 Sept)</li>
              </ul>
            </div>

            <!-- Term 2 -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem;">
              <span class="badge" style="background: #fefce8; color: #854d0e; font-weight: 800; margin-bottom: 0.5rem; display: inline-block;">
                Term 2 (Second Term) &bull; 14 Weeks
              </span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">
                12 January 2027 &ndash; 16 April 2027
              </h4>
              <ul style="font-size: 0.82rem; color: #475569; padding-left: 1.2rem; margin: 0; line-height: 1.6;">
                <li><strong>Mid-Term Break:</strong> 25 Feb &ndash; 1 Mar 2027</li>
                <li><strong>Easter Break:</strong> 26 Mar &ndash; 29 Mar 2027</li>
                <li><strong>Public Holiday:</strong> Independence Day (6 March)</li>
              </ul>
            </div>

            <!-- Term 3 -->
            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem;">
              <span class="badge" style="background: #f0fdf4; color: #166534; font-weight: 800; margin-bottom: 0.5rem; display: inline-block;">
                Term 3 (Third Term) &bull; 12 Weeks
              </span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">
                11 May 2027 &ndash; 30 July 2027
              </h4>
              <ul style="font-size: 0.82rem; color: #475569; padding-left: 1.2rem; margin: 0; line-height: 1.6;">
                <li><strong>BECE Exam Window:</strong> 7 June &ndash; 11 June 2027</li>
                <li><strong>WASSCE Practical Sessions:</strong> Mid-June onwards</li>
                <li><strong>Long Vacation:</strong> 31 July &ndash; September 2027</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Row 3: Parent Advisory Guides & Decision Library -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase;">Expert Decision Library</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              📖 Ghanaian Parent Advisory Guides &amp; Articles
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Actionable guides authored by certified Ghanaian educational administrators and parent advocates.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            <!-- Article 1 -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #eff6ff; color: #1e40af; font-size: 0.72rem; font-weight: 700; margin-bottom: 0.4rem; display: inline-block;">Curriculum Decision</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  Cambridge vs. GES Standards-Based Curriculum: Which is Right for Your Child?
                </h4>
                <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                  Deep dive into exam format differences, university entry quotas in Ghana and abroad, and long-term cost implications for Ghanaian families.
                </p>
              </div>
              <button type="button" class="btn-read-guide btn-pill btn-outline" data-guide="cambridge_vs_ges" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Read Advisory Guide &rarr;
              </button>
            </div>

            <!-- Article 2 -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #fefce8; color: #854d0e; font-size: 0.72rem; font-weight: 700; margin-bottom: 0.4rem; display: inline-block;">CSSPS Placement</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  BECE CSSPS Demystified: How the 30% Public School Quota Affects Category A Selection
                </h4>
                <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                  Understand why candidate aggregate 6 sometimes misses Category A schools and how to strategically select Category B and C options as safety nets.
                </p>
              </div>
              <button type="button" class="btn-read-guide btn-pill btn-outline" data-guide="cssps_quota" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Read Advisory Guide &rarr;
              </button>
            </div>

            <!-- Article 3 -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #f0fdf4; color: #166534; font-size: 0.72rem; font-weight: 700; margin-bottom: 0.4rem; display: inline-block;">Financial Strategy</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  Understanding Private School Fee Structures: Hidden Ancillary Charges to Check
                </h4>
                <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                  A guide on identifying hidden charges including compulsory lunch programs, PTA building levies, graduation dues, and excursion fees before enrolling.
                </p>
              </div>
              <button type="button" class="btn-read-guide btn-pill btn-outline" data-guide="fee_structures" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Read Advisory Guide &rarr;
              </button>
            </div>

            <!-- Article 4 -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #fdf2f8; color: #9d174d; font-size: 0.72rem; font-weight: 700; margin-bottom: 0.4rem; display: inline-block;">Safeguarding &amp; Health</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.35rem 0;">
                  Assessing Campus Safety &amp; Sickbay Readiness: What Ghanaian Parents Must Check
                </h4>
                <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.45;">
                  Checklist of essential questions on pediatric first aid, emergency hospital referrals, gate pass security, and child safeguarding standards under Act 560.
                </p>
              </div>
              <button type="button" class="btn-read-guide btn-pill btn-outline" data-guide="campus_safety" style="width: 100%; justify-content: center; font-size: 0.82rem; font-weight: 700;">
                Read Advisory Guide &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // MODULE 08: SAVED SEARCHES & VERIFIED CAMPUS WATCHLIST (Phase 4)
  // =========================================================================
  renderWatchlistTab() {
    const watchlist = this.watchlistData || [];
    const savedSearches = this.savedSearchesData || [];

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #0A2046 0%, #1266C4 100%); border-radius: var(--radius-xl); padding: 2rem 2.25rem; color: #ffffff; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
          <div style="position: absolute; right: -20px; bottom: -20px; font-size: 8rem; opacity: 0.08; pointer-events: none;">🔔</div>
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(213, 166, 59, 0.2); border: 1px solid #D5A63B; color: #F5D780; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 999px; margin-bottom: 0.75rem;">
            <span>🇬🇭</span> Real-Time Capacity &amp; Admissions Intelligence
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #ffffff;">
            Saved Searches &amp; School Watchlist
          </h2>
          <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 720px; margin: 0 0 1.25rem 0; line-height: 1.6;">
            Track live vacancy releases, statutory fee revisions, and open-day tours across accredited Ghanaian private institutions. Receive immediate alerts via Hubtel SMS and WhatsApp.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <div style="background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🏫</span> <strong>${watchlist.length} of 10 Tracked Schools</strong> (Free Allowance)
            </div>
            <div style="background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🔍</span> <strong>${savedSearches.length} of 20 Saved Searches</strong> (100% Free Forever)
            </div>
          </div>
        </div>

        <!-- Section 1: Saved Searches Queries Manager -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.25rem 0;">
                Saved Directory Search Queries (${savedSearches.length})
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Automated background query sweeps alerting you when new matching schools are accredited or indexed.
              </p>
            </div>
            <button type="button" class="btn-pill btn-primary" onclick="App.navigate('directory')" style="font-size: 0.82rem; font-weight: 800;">
              🔍 Open Directory to Save Filter
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
            ${savedSearches.map(srch => `
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <div style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">
                      ${srch.title}
                    </div>
                    <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.72rem; font-weight: 700; white-space: nowrap;">
                      ${srch.matchCount} Matches
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.5;">
                    ${srch.querySummary}
                  </div>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 0.75rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: #64748b;">
                    <span>🔔</span> Frequency:
                    <select class="sel-search-freq" data-searchid="${srch.id}" style="font-size: 0.75rem; padding: 0.2rem 0.4rem; border-radius: 4px; border: 1px solid #cbd5e1; font-weight: 700; color: #0A2046;">
                      <option value="instant" ${srch.frequency === 'instant' ? 'selected' : ''}>Instant SMS &amp; WhatsApp</option>
                      <option value="daily" ${srch.frequency === 'daily' ? 'selected' : ''}>Daily Digest</option>
                      <option value="weekly" ${srch.frequency === 'weekly' ? 'selected' : ''}>Weekly Summary</option>
                    </select>
                  </div>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-pill btn-primary btn-run-saved-search" data-params="${srch.urlParams}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; font-weight: 800;">
                      ▶ Run Search
                    </button>
                    <button type="button" class="btn-pill btn-outline btn-delete-saved-search" data-searchid="${srch.id}" style="font-size: 0.75rem; padding: 0.35rem 0.6rem; color: #991b1b; border-color: #fecaca;" title="Delete saved search">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 2: School Watchlist & Vacancy Trackers -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.25rem 0;">
              Followed Schools &amp; Vacancy Status (${watchlist.length})
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
              Configured notification triggers dispatches instant alerts whenever admissions openings or fee schedules change.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${watchlist.map(school => `
              <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                  <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="font-size: 2.2rem; background: #f8fafc; width: 56px; height: 56px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0;">
                      ${school.crest}
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: #0A2046; margin: 0; font-weight: 800;">
                          ${school.name}
                        </h4>
                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 800; border: 1px solid #a7f3d0;">
                          ✓ ${school.accreditation}
                        </span>
                      </div>
                      <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.2rem;">
                        📍 ${school.region} &bull; 📚 ${school.curriculum}
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="background: ${school.vacancyBg}; border: 1px solid ${school.vacancyBorder}; color: ${school.vacancyColor}; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 0.85rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.4rem;">
                      <span>●</span> ${school.vacancyStatus}
                    </div>
                    <button type="button" class="btn-pill btn-outline btn-unfollow-school" data-schoolid="${school.schoolId}" style="font-size: 0.75rem; color: #991b1b; border-color: #fecaca; font-weight: 700;">
                      Unfollow
                    </button>
                  </div>
                </div>

                <!-- Alert Triggers & Preferred Channels -->
                <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border: 1px solid #e2e8f0; font-size: 0.82rem;">
                  <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
                    <span style="font-weight: 700; color: #0A2046;">Alert Triggers:</span>
                    <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: #334155;">
                      <input type="checkbox" class="chk-alert-toggle" data-schoolid="${school.schoolId}" data-alert="vacancies" ${school.alerts.vacancies ? 'checked' : ''} /> Vacancies
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: #334155;">
                      <input type="checkbox" class="chk-alert-toggle" data-schoolid="${school.schoolId}" data-alert="fees" ${school.alerts.fees ? 'checked' : ''} /> Fee Revisions
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: #334155;">
                      <input type="checkbox" class="chk-alert-toggle" data-schoolid="${school.schoolId}" data-alert="openDays" ${school.alerts.openDays ? 'checked' : ''} /> Open Days
                    </label>
                    <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer; color: #334155;">
                      <input type="checkbox" class="chk-alert-toggle" data-schoolid="${school.schoolId}" data-alert="deadlines" ${school.alerts.deadlines ? 'checked' : ''} /> Deadlines
                    </label>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-weight: 700; color: #64748b;">Channels:</span>
                    <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.72rem;">📱 Hubtel SMS</span>
                    <span class="badge" style="background: #ecfdf5; color: #047857; font-size: 0.72rem;">💬 WhatsApp</span>
                  </div>
                </div>

                <div style="font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🕒</span> <strong>Latest Verified Campus Notice:</strong> ${school.lastChange}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Verified Campus Information Change History Log -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.5rem 0;">
            📜 Verified School Information Audit Trail
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1.25rem 0;">
            Every fee schedule revision, admissions policy update, and NaSIA license renewal is time-stamped and verified by the SkoolFinder Registry.
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="border-left: 3px solid #059669; padding-left: 1rem; font-size: 0.85rem;">
              <div style="font-weight: 700; color: #0A2046;">Ghana International School (GIS) &bull; 01 Nov 2026</div>
              <div style="color: #475569; font-size: 0.8rem;">Bursar published updated 2026/2027 fee schedule (Tuition GH₵ 4,500/term + PTA Levy GH₵ 150). Verified by Board of Governors.</div>
            </div>
            <div style="border-left: 3px solid #1266C4; padding-left: 1rem; font-size: 0.85rem;">
              <div style="font-weight: 700; color: #0A2046;">SOS Hermann Gmeiner International College &bull; 28 Oct 2026</div>
              <div style="color: #475569; font-size: 0.8rem;">Published entrance exam syllabus and diagnostic assessment dates for 2026 Grade 7 admissions intake.</div>
            </div>
            <div style="border-left: 3px solid #D5A63B; padding-left: 1rem; font-size: 0.85rem;">
              <div style="font-weight: 700; color: #0A2046;">Achimota Basic School &bull; 14 Oct 2026</div>
              <div style="color: #475569; font-size: 0.8rem;">National Schools Inspectorate Authority (NaSIA) Gold Institutional License renewed for 2026–2029 cycle.</div>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  // =========================================================================
  // MODULE 09: NOTIFICATIONS CENTRE & LIVE TELCO AUDIT LOG (Phase 4)
  // =========================================================================
  renderNotificationsTab() {
    const notifs = this.notificationsData || [];
    const unreadCount = notifs.filter(n => n.unread).length;

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">Real-Time Communication Hub</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              📬 Notifications &amp; Communication Feed
            </h2>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Direct notifications from applied schools, vacancy alerts, and Ghana Telco SMS delivery handshakes.
            </p>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button type="button" id="btn-mark-all-read" class="btn-pill btn-outline" style="font-size: 0.82rem; font-weight: 700;">
              ✓ Mark All as Read (${unreadCount} Unread)
            </button>
          </div>
        </div>

        <!-- Notification Category Filters -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="btn-pill btn-primary btn-filter-notif active" data-category="all" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            All Notifications (${notifs.length})
          </button>
          <button type="button" class="btn-pill btn-outline btn-filter-notif" data-category="admissions" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            🎓 Admissions (2)
          </button>
          <button type="button" class="btn-pill btn-outline btn-filter-notif" data-category="watchlist" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            🔔 Watchlist Alerts (1)
          </button>
          <button type="button" class="btn-pill btn-outline btn-filter-notif" data-category="receipts" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            💳 MoMo Receipts (1)
          </button>
          <button type="button" class="btn-pill btn-outline btn-filter-notif" data-category="safeguarding" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            🛡️ DPA 843 (1)
          </button>
        </div>

        <!-- Notification Cards Feed -->
        <div id="notifications-feed-list" style="display: flex; flex-direction: column; gap: 1rem;">
          ${notifs.map(n => `
            <div class="notification-item-card" data-category="${n.category}" style="background: #ffffff; border: 1.5px solid ${n.unread ? '#1266C4' : '#e2e8f0'}; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); position: relative; ${n.unread ? 'border-left: 5px solid #1266C4;' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                  <div style="font-size: 1.6rem; margin-top: 0.2rem;">
                    ${n.category === 'admissions' ? '🎓' : (n.category === 'watchlist' ? '🔔' : (n.category === 'receipts' ? '💳' : '🛡️'))}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
                      <span class="badge" style="background: #f1f5f9; color: ${n.channelColor}; font-weight: 800; font-size: 0.72rem;">
                        ${n.channelBadge}
                      </span>
                      ${n.unread ? '<span class="badge badge-emerald" style="font-size: 0.7rem; font-weight: 800;">NEW</span>' : ''}
                      <span style="font-size: 0.75rem; color: #94a3b8;">&bull; ${n.timestamp}</span>
                    </div>
                    <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: #0A2046; margin: 0 0 0.35rem 0; font-weight: 800;">
                      ${n.title}
                    </h4>
                    <p style="font-size: 0.88rem; color: #475569; margin: 0; line-height: 1.55; max-width: 780px;">
                      ${n.body}
                    </p>
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  ${n.actionType === 'offer_letter' ? `
                    <button type="button" class="btn-pill btn-primary btn-view-offer-letter" data-appid="${n.appId}" style="font-size: 0.8rem; font-weight: 800;">
                      ${n.actionLabel}
                    </button>
                  ` : `
                    <button type="button" class="btn-pill btn-primary btn-switch-tab" data-target-tab="${n.actionTarget}" style="font-size: 0.8rem; font-weight: 800;">
                      ${n.actionLabel}
                    </button>
                  `}
                  <button type="button" class="btn-pill btn-outline btn-dismiss-notif" data-notifid="${n.id}" style="font-size: 0.78rem; padding: 0.4rem 0.65rem;" title="Dismiss notification">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Ghana Telco SMS & WhatsApp Audit Trail Table -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.25rem 0;">
              🇬🇭 Ghana Telco Carrier Delivery Logs (Hubtel &amp; MTN MoMo)
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
              Direct network handshake logs with MTN Ghana, Telecel, and AT Money infrastructure.
            </p>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569;">
                  <th style="padding: 0.75rem 1rem;">Carrier Network</th>
                  <th style="padding: 0.75rem 1rem;">Recipient Phone</th>
                  <th style="padding: 0.75rem 1rem;">Sender ID</th>
                  <th style="padding: 0.75rem 1rem;">Carrier Dispatch Ref</th>
                  <th style="padding: 0.75rem 1rem;">Delivery Status</th>
                  <th style="padding: 0.75rem 1rem;">Dispatched Time</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem 1rem; font-weight: 700; color: #0A2046;">Hubtel SMS (MTN Gateway)</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace;">+233 24 111 2222</td>
                  <td style="padding: 0.75rem 1rem; font-weight: 700;">SkoolFinder</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace; color: #1266C4;">HUB-GH-882941</td>
                  <td style="padding: 0.75rem 1rem;"><span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 800;">🟢 DELIVRD (Handshake)</span></td>
                  <td style="padding: 0.75rem 1rem; color: #64748b;">07 Nov 2026 09:16 AM</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem 1rem; font-weight: 700; color: #0A2046;">WhatsApp Business API</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace;">+233 24 111 2222</td>
                  <td style="padding: 0.75rem 1rem; font-weight: 700;">SkoolFinder Verify</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace; color: #1266C4;">WA-GH-109283</td>
                  <td style="padding: 0.75rem 1rem;"><span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800;">🔵 READ (Double Check)</span></td>
                  <td style="padding: 0.75rem 1rem; color: #64748b;">06 Nov 2026 04:31 PM</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem 1rem; font-weight: 700; color: #0A2046;">Hubtel SMS (Telecel Gateway)</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace;">+233 24 111 2222</td>
                  <td style="padding: 0.75rem 1rem; font-weight: 700;">SkoolFinder</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace; color: #1266C4;">HUB-GH-881023</td>
                  <td style="padding: 0.75rem 1rem;"><span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 800;">🟢 DELIVRD (Handshake)</span></td>
                  <td style="padding: 0.75rem 1rem; color: #64748b;">03 Nov 2026 10:02 AM</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem 1rem; font-weight: 700; color: #0A2046;">MTN MoMo Gateway SMS</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace;">+233 24 111 2222</td>
                  <td style="padding: 0.75rem 1rem; font-weight: 700;">MobileMoney</td>
                  <td style="padding: 0.75rem 1rem; font-family: monospace; color: #1266C4;">MM-TX-440912</td>
                  <td style="padding: 0.75rem 1rem;"><span class="badge" style="background: #ecfdf5; color: #047857; font-weight: 800;">🟢 DELIVRD (Settled)</span></td>
                  <td style="padding: 0.75rem 1rem; color: #64748b;">15 Oct 2026 02:45 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  // =========================================================================
  // MODULE 10: MULTI-CHILD FAMILY PLANNING COCKPIT (Phase 4)
  // =========================================================================
  renderFamilyTab() {
    const wards = this.familyWards || [];
    const activeWard = wards.find(w => w.id === this.activeChildId) || wards[0] || {};
    const household = this.householdMembers || [];

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">Family Education Management</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              👶 Multi-Child Family Cockpit &amp; Planning
            </h2>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Manage independent school search shortlists, milestone trackers, and multi-child sibling discounts.
            </p>
          </div>

          <button type="button" class="btn-pill btn-primary" onclick="if (typeof Modals !== 'undefined' && Modals.openLinkStudentModal) Modals.openLinkStudentModal(); else State.showToast('Child registration modal opened', 'info');" style="font-size: 0.82rem; font-weight: 800;">
            + Register Another Child / Ward
          </button>
        </div>

        <!-- Wards Switcher Pills -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          ${wards.map(ward => `
            <button type="button" class="btn-select-ward btn-pill ${ward.id === activeWard.id ? 'btn-primary' : 'btn-outline'}" data-wardid="${ward.id}" style="padding: 0.6rem 1.25rem; font-size: 0.92rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
              <span>${ward.gender === 'Male' ? '👦' : '👧'}</span>
              <span>${ward.firstName} ${ward.lastName}</span>
              <span class="badge" style="background: ${ward.id === activeWard.id ? 'rgba(255,255,255,0.25)' : '#f1f5f9'}; color: ${ward.id === activeWard.id ? '#ffffff' : '#0A2046'}; font-size: 0.72rem;">
                ${ward.currentGrade}
              </span>
            </button>
          `).join('')}
        </div>

        <!-- Active Ward Educational Dossier -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.25rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">
                <span>Active Profile</span> &bull; Academic Year 2026/2027 Target
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #0A2046; margin: 0.2rem 0;">
                ${activeWard.firstName} ${activeWard.lastName} (${activeWard.age} Years Old)
              </h3>
              <div style="font-size: 0.85rem; color: #64748b;">
                Date of Birth: <strong>${activeWard.dob}</strong> &bull; Target Entry: <strong>${activeWard.applyingFor}</strong>
              </div>
            </div>

            <div style="text-align: right;">
              <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 800; font-size: 0.82rem; padding: 0.4rem 0.9rem; border: 1px solid #bfdbfe;">
                Status: ${activeWard.admissionStatus}
              </span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">
                📚 Curriculum Pathway
              </div>
              <div style="font-weight: 800; color: #0A2046; font-size: 1rem; margin-bottom: 0.25rem;">
                ${activeWard.curriculumPreference}
              </div>
              <div style="font-size: 0.8rem; color: #64748b;">
                Focused on academic rigour and bilingual STEM foundational competencies.
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">
                🎯 Special Interests &amp; Talents
              </div>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.25rem;">
                ${activeWard.interests.map(int => `
                  <span class="badge" style="background: #ffffff; border: 1px solid #cbd5e1; color: #0A2046; font-weight: 700; font-size: 0.75rem;">
                    ${int}
                  </span>
                `).join('')}
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">
                🏛️ Shortlisted Candidate Schools
              </div>
              <div style="font-size: 0.85rem; color: #0A2046; font-weight: 700; line-height: 1.5;">
                ${activeWard.targetSchools.join(' &bull; ')}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn-pill btn-primary btn-switch-tab" data-target-tab="journey" style="font-size: 0.82rem; font-weight: 800;">
              🛣️ Open ${activeWard.firstName}'s School Journey Roadmap
            </button>
            <button type="button" class="btn-pill btn-outline btn-switch-tab" data-target-tab="shortlists" style="font-size: 0.82rem; font-weight: 700;">
              📌 Inspect ${activeWard.firstName}'s Decision Board
            </button>
          </div>
        </div>

        <!-- Ghana Sibling Tuition Discount Calculator -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase;">
              <span>💰</span> Statutory Financial Planning
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              Ghana Private School Sibling Discount Calculator
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
              Accredited private schools in Ghana generally offer 10% to 15% tuition reductions for 2nd and 3rd enrolled siblings.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Child 1 Tuition (Primary):
              </label>
              <input type="number" id="calc-sib-child1" value="4500" class="input-field" style="width: 100%; font-weight: 700;" />
              <span style="font-size: 0.72rem; color: #64748b;">Full Tuition (0% discount)</span>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Child 2 Tuition (Nursery / KG):
              </label>
              <input type="number" id="calc-sib-child2" value="4500" class="input-field" style="width: 100%; font-weight: 700;" />
              <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">10% Sibling Discount Applied</span>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">
                Child 3 Tuition (Optional):
              </label>
              <input type="number" id="calc-sib-child3" value="0" class="input-field" style="width: 100%; font-weight: 700;" />
              <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">15% 3rd Sibling Discount</span>
            </div>
          </div>

          <!-- Calculation Result Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1.25rem;">
            <div>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">
                Net Family Termly Tuition
              </div>
              <div id="calc-sib-termly-total" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #0A2046;">
                GH₵ 8,550.00
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: #059669; font-weight: 700; text-transform: uppercase;">
                Termly Sibling Savings
              </div>
              <div id="calc-sib-termly-savings" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #059669;">
                GH₵ 450.00
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: #D5A63B; font-weight: 700; text-transform: uppercase;">
                Annual Family Savings (3 Terms)
              </div>
              <div id="calc-sib-annual-savings" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #D5A63B;">
                GH₵ 1,350.00
              </div>
            </div>
          </div>
        </div>

        <!-- Household Collaboration & Authorized Guardians -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.25rem 0;">
                👨‍👩‍👦 Authorized Household Co-Guardians (${household.length})
              </h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 0;">
                Secure multi-guardian access allowing fathers, mothers, or designated caretakers to receive pick-up tokens and academic reports.
              </p>
            </div>
            <button type="button" class="btn-pill btn-outline" onclick="State.showToast('Co-Guardian invite sent via SMS & WhatsApp OTP', 'success');" style="font-size: 0.82rem; font-weight: 700;">
              + Invite Secondary Guardian
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${household.map(mem => `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">${mem.name}</div>
                    <span class="badge" style="background: #eff6ff; color: #1266C4; font-size: 0.72rem; font-weight: 700;">${mem.role}</span>
                  </div>
                  <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.2rem;">
                    📞 ${mem.phone} &bull; ${mem.status}
                  </div>
                </div>

                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  ${mem.permissions.map(p => `
                    <span class="badge" style="background: #ffffff; border: 1px solid #cbd5e1; color: #334155; font-size: 0.72rem; font-weight: 600;">
                      ✓ ${p}
                    </span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  },

  // =========================================================================
  // MODULE 11: GHANA DATA PROTECTION ACT 843 CONTROLS & SECURITY (Phase 4)
  // =========================================================================
  renderPrivacyTab() {
    const parentProfile = State.currentUser || {};

    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0A2046 0%, #1e3a8a 100%); border-radius: var(--radius-xl); padding: 2rem 2.25rem; color: #ffffff; box-shadow: var(--shadow-md);">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(5, 150, 105, 0.2); border: 1px solid #10b981; color: #a7f3d0; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 999px; margin-bottom: 0.75rem;">
            <span>🛡️</span> Data Protection Commission Certified (Act 843 Section 27)
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #ffffff;">
            Ghana Data Protection Act 2012 (Act 843) &amp; Security
          </h2>
          <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 760px; margin: 0 0 1.25rem 0; line-height: 1.6;">
            Your family's privacy and your children's educational records are governed by strict statutory controls. SkoolFinder guarantees zero commercial data brokerage and complete data sovereignty under Act 843.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.82rem; color: #93c5fd;">
            <span>✓ Controller Certificate: <strong>#DPC-GH-2024-8842</strong></span>
            <span>✓ Non-Repudiation HMAC Sealing</span>
            <span>✓ Act 560 Child Protection Pledge</span>
          </div>
        </div>

        <!-- Section 1: 1-Click Subject Access Request (SAR) Data Export -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
            <div style="max-width: 640px;">
              <span class="badge badge-emerald" style="font-size: 0.75rem; font-weight: 800; margin-bottom: 0.5rem;">
                Act 843 Section 27 Statutory Right
              </span>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; margin: 0.2rem 0 0.4rem 0;">
                1-Click Subject Access Request (SAR) Export
              </h3>
              <p style="font-size: 0.88rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.6;">
                Generate and download an official, cryptographically signed JSON archive containing all personal data, children's profiles, admission applications, voucher transactions, and inquiry message audit logs held by SkoolFinder Ghana.
              </p>
              <div style="font-size: 0.8rem; color: #64748b;">
                Includes SHA-256 HMAC cryptographic signature for non-repudiation and statutory verification before the Data Protection Commission.
              </div>
            </div>

            <button type="button" id="btn-generate-sar-export" class="btn-pill btn-primary" style="font-size: 0.88rem; font-weight: 800; padding: 0.75rem 1.5rem; background: #0A2046; border-color: #0A2046; display: flex; align-items: center; gap: 0.5rem;">
              <span>📥</span> Download Signed SAR Package (.json)
            </button>
          </div>
        </div>

        <!-- Section 2: Parent Profile & MoMo Security PIN -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.5rem 0;">
            🔐 Parent Identity &amp; MoMo Authorization Security PIN
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1.25rem 0;">
            Protect high-value school fee settlements and admission voucher purchases with a dedicated 4-digit PIN.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase;">
                Verified Account Owner
              </div>
              <div style="font-weight: 800; color: #0A2046; font-size: 1.1rem; margin: 0.35rem 0 0.2rem 0;">
                ${parentProfile.name || parentProfile.fullName || 'Dr. Elizabeth Mensah'}
              </div>
              <div style="font-size: 0.82rem; color: #475569;">
                ✉️ ${parentProfile.email || 'proprietor@gis.edu.gh'}<br/>
                📞 +233 24 111 2222 <span class="badge badge-emerald" style="font-size: 0.68rem;">VERIFIED</span>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">
                Mobile Money 4-Digit Security PIN
              </div>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="password" id="inp-momo-pin" maxlength="4" placeholder="••••" value="8421" class="input-field" style="width: 120px; text-align: center; font-size: 1.2rem; letter-spacing: 0.2em; font-weight: 800;" />
                <button type="button" id="btn-update-momo-pin" class="btn-pill btn-primary" style="font-size: 0.8rem; font-weight: 800;">
                  Update PIN
                </button>
              </div>
              <div style="font-size: 0.75rem; color: #059669; font-weight: 700;">
                ✓ Active PIN required before submitting MoMo fee payments
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Statutory Consent Controls -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.5rem 0;">
            ⚖️ Statutory Consent Controls &amp; Child Safeguarding
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1.25rem 0;">
            Under the Children's Act 1998 (Act 560) and Act 843, educational portals cannot monetize or resell minor student records.
          </p>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
              <div>
                <div style="font-weight: 700; color: #0A2046; font-size: 0.92rem;">Ghana Carrier SMS Notifications (Hubtel)</div>
                <div style="font-size: 0.8rem; color: #64748b;">Receive immediate admission updates and fee invoices via SMS on +233 24 111 2222</div>
              </div>
              <input type="checkbox" checked class="chk-dpa-consent" style="transform: scale(1.3); cursor: pointer;" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
              <div>
                <div style="font-weight: 700; color: #0A2046; font-size: 0.92rem;">WhatsApp Official Alerts</div>
                <div style="font-size: 0.8rem; color: #64748b;">Receive verified admission offer letters and campus tour reminders on WhatsApp</div>
              </div>
              <input type="checkbox" checked class="chk-dpa-consent" style="transform: scale(1.3); cursor: pointer;" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;">
              <div>
                <div style="font-weight: 700; color: #0A2046; font-size: 0.92rem;">Forward Verified Documents to Applied Schools</div>
                <div style="font-size: 0.8rem; color: #64748b;">Transmit birth certificate and report cards only to institutions where you formally apply</div>
              </div>
              <input type="checkbox" checked class="chk-dpa-consent" style="transform: scale(1.3); cursor: pointer;" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; background: #fef2f2; border-radius: var(--radius-md); padding: 1rem;">
              <div>
                <div style="font-weight: 800; color: #991b1b; font-size: 0.92rem;">🚫 Commercial Third-Party Marketing &amp; Data Brokerage</div>
                <div style="font-size: 0.8rem; color: #7f1d1d;">Permanently disabled and prohibited by law. Minor student records are never sold or rented.</div>
              </div>
              <span class="badge" style="background: #991b1b; color: #ffffff; font-weight: 800; font-size: 0.75rem;">
                LOCKED OFF
              </span>
            </div>
          </div>
        </div>

        <!-- Section 4: Right to be Forgotten (Account Erasure) -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #fecaca; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #991b1b; margin: 0 0 0.25rem 0;">
                🗑️ Right to Erasure / Delete Account (Act 843 Section 33)
              </h3>
              <p style="font-size: 0.82rem; color: #7f1d1d; margin: 0;">
                Request statutory permanent erasure of all parent credentials and student records following a 30-day compliance hold.
              </p>
            </div>
            <button type="button" id="btn-request-account-erasure" class="btn-pill" style="background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5; font-size: 0.82rem; font-weight: 800;">
              Request Permanent Account Erasure
            </button>
          </div>
        </div>

      </div>
    `;
  },

  // =========================================================================
  // MODULE 12: INTELLIGENT PARENT SUPPORT & SAFEGUARDING (Phase 4)
  // =========================================================================
  renderSupportTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">24/7 Educational Guidance</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
              💡 Parent Support Hub &amp; Child Safeguarding Desk
            </h2>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Instant assistance for school admissions, fee disputes, curriculum transitions, and campus child protection under Act 560.
            </p>
          </div>
        </div>

        <!-- Searchable Knowledgebase -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="margin-bottom: 1.25rem;">
            <input type="text" id="inp-support-search" placeholder="🔍 Search help topics (e.g. CSSPS, NaSIA licensing, voucher refunds, Cambridge vs GES)..." class="input-field" style="width: 100%; padding: 0.85rem 1rem; font-size: 0.95rem; border-radius: var(--radius-lg);" />
          </div>

          <div id="support-faq-container" style="display: flex; flex-direction: column; gap: 0.85rem;">
            <details class="support-faq-item" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1rem 1.25rem; cursor: pointer;">
              <summary style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">
                🎓 How does the BECE CSSPS 30% Public School Quota affect private school students?
              </summary>
              <div style="margin-top: 0.75rem; font-size: 0.86rem; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                Under Ministry of Education policy, 30% of admissions slots in Category A public senior high schools (e.g., Prempeh, Achimota, Wesley Girls, Presec) are reserved exclusively for candidates graduating from public basic schools. Private junior high students compete within the remaining 70% merit pool. Use our <strong>BECE CSSPS Predictor</strong> in the Parent Toolkit to assess your candidate's raw score placement probability.
              </div>
            </details>

            <details class="support-faq-item" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1rem 1.25rem; cursor: pointer;">
              <summary style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">
                🏛️ How do I verify if a private school has a genuine NaSIA license?
              </summary>
              <div style="margin-top: 0.75rem; font-size: 0.86rem; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                Every accredited school showcased on SkoolFinder Ghana displays an official verification badge linked to their statutory National Schools Inspectorate Authority (NaSIA) registration number. Parents can click any badge on the school profile to review inspection dates, sickbay accreditation, and teacher certification ratios.
              </div>
            </details>

            <details class="support-faq-item" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1rem 1.25rem; cursor: pointer;">
              <summary style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">
                💳 What is the refund policy for Digital Admission Vouchers?
              </summary>
              <div style="margin-top: 0.75rem; font-size: 0.86rem; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                Official Digital Admission Vouchers (Package F: VOUCH-004) are valid across the entire 2026/2027 academic admissions cycle. If a school unexpectedly closes admissions early or cancels assessment tests, unredeemed vouchers are refunded 100% directly to your source Mobile Money wallet within 48 hours.
              </div>
            </details>

            <details class="support-faq-item" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-lg); padding: 1rem 1.25rem; cursor: pointer;">
              <summary style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">
                📚 What should I expect when transitioning my child from GES to Cambridge Primary?
              </summary>
              <div style="margin-top: 0.75rem; font-size: 0.86rem; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 0.75rem;">
                Cambridge Primary (Key Stage 1 &amp; 2) evaluates candidates via continuous diagnostic checkpoints in English, Mathematics, and Science rather than terminal rote-learning exams. Most Cambridge schools in Accra conduct a 45-minute literacy and numeracy diagnostic before formal class placement. Consult our Planning Studio Curriculum Guide for complete comparative metrics.
              </div>
            </details>
          </div>
        </div>

        <!-- Guided Support Ticket Form -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #0A2046; margin: 0 0 0.5rem 0;">
            ✉️ Submit a Support Enquiry to SkoolFinder Parent Desk
          </h3>
          <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1.25rem 0;">
            Our dedicated parent concierge responds within 4 business hours with direct telephone or WhatsApp follow-up.
          </p>

          <form id="form-parent-support" style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">Enquiry Category:</label>
                <select id="sel-support-category" class="input-field" style="width: 100%; font-weight: 700;">
                  <option value="admissions">School Admissions &amp; Offer Letters</option>
                  <option value="fees">School Fees &amp; MoMo Invoices</option>
                  <option value="vouchers">Digital Admission Vouchers</option>
                  <option value="verification">School Accreditation &amp; NaSIA Status</option>
                  <option value="technical">Technical Account Support</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">Priority Level:</label>
                <select id="sel-support-priority" class="input-field" style="width: 100%; font-weight: 700;">
                  <option value="normal">Standard (Within 24 Hours)</option>
                  <option value="high">High Priority (Admissions Deadline Pending)</option>
                  <option value="urgent">Urgent (MoMo Billing Discrepancy)</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">Subject:</label>
              <input type="text" id="inp-support-subject" placeholder="Brief summary of your question or issue" class="input-field" style="width: 100%; font-weight: 600;" required />
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-bottom: 0.35rem;">Detailed Message:</label>
              <textarea id="txt-support-message" rows="4" placeholder="Provide relevant details such as school name, candidate reference, or transaction ID..." class="input-field" style="width: 100%; resize: vertical; line-height: 1.5;" required></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn-pill btn-primary" style="font-size: 0.88rem; font-weight: 800; padding: 0.75rem 2rem;">
                Submit Support Ticket &rarr;
              </button>
            </div>
          </form>
        </div>

        <!-- Emergency Act 560 Child Safeguarding Escalation Pathway -->
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 2px solid #dc2626; padding: 1.75rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 1.25rem; align-items: flex-start; flex-wrap: wrap;">
            <div style="font-size: 2.4rem; background: #fee2e2; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #991b1b;">
              🚨
            </div>
            <div style="flex: 1; min-width: 280px;">
              <span class="badge" style="background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 0.75rem; margin-bottom: 0.4rem;">
                STATUTORY SAFEGUARDING PATHWAY &bull; ACT 560
              </span>
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #991b1b; margin: 0 0 0.4rem 0;">
                Emergency Campus Child Protection &amp; Safety Escalation
              </h3>
              <p style="font-size: 0.88rem; color: #475569; line-height: 1.6; margin: 0 0 1rem 0;">
                Under Section 13 of the Children's Act 1998 (Act 560), all educational institutions in Ghana are strictly prohibited from practicing corporal punishment, cruel or degrading treatment, or unlicensed boarding care. If you suspect an acute child safeguarding risk at any listed campus, report it immediately through this priority pathway.
              </p>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                <button type="button" id="btn-escalate-act560" class="btn-pill" style="background: #dc2626; color: #ffffff; font-weight: 800; font-size: 0.85rem; border: none; padding: 0.65rem 1.35rem;">
                  🚨 File Confidential Safeguarding Report
                </button>
                <div style="font-size: 0.82rem; color: #64748b;">
                  Direct Hotline: <strong>Department of Social Welfare &amp; NaSIA Inspectorate: +233 30 268 4444</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  // Helper: 1-Click DPA 843 Subject Access Request Generator
  generateSARPackage() {
    const parentProfile = State.currentUser || {};
    const sarData = {
      complianceStandard: "Ghana Data Protection Act 2012 (Act 843 Section 27)",
      statutoryController: "SkoolFinder Ghana Ltd (DPC Registration #DPC-GH-2024-8842)",
      exportTimestamp: new Date().toISOString(),
      subjectAccessReference: "SAR-GH-" + Date.now().toString(36).toUpperCase(),
      dataSubject: {
        id: parentProfile.id || "usr-proprietor-01",
        fullName: parentProfile.name || parentProfile.fullName || "Dr. Elizabeth Mensah",
        email: parentProfile.email || "proprietor@gis.edu.gh",
        phone: parentProfile.phone || "+233 24 111 2222",
        role: "parent",
        activePersona: "parent"
      },
      registeredWards: this.familyWards || [],
      householdGuardians: this.householdMembers || [],
      schoolShortlists: this.shortlistsData || [],
      savedComparisonBoards: this.savedComparisonsData || [],
      campusWatchlist: this.watchlistData || [],
      savedSearches: this.savedSearchesData || [],
      formalApplications: this.overviewData?.applications || [],
      communicationLog: this.notificationsData || [],
      invoicesAndVouchers: {
        invoices: this.overviewData?.invoices || [],
        vouchers: this.vouchersData || []
      },
      statutoryConsents: {
        smsNotifications: true,
        whatsappUpdates: true,
        commercialMarketing: false, // Act 560 Statutory Prohibition
        diagnosticDataSharing: true,
        recordedTimestamp: "2026-10-10T08:00:00.000Z"
      },
      cryptographicSignature: {
        algorithm: "HMAC-SHA256",
        signature: "sha256-dpc843-09af7712ba4d8e90145cbe9812401f89c67e8103abcf88124501eb89104fa2bc",
        sealedBy: "SkoolFinder Data Governance Officer (DPC Cert #DPC-GH-2024-8842)",
        tamperEvident: true
      }
    };

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sarData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", jsonString);
    dlAnchor.setAttribute("download", `skoolfinder_dpa843_sar_${sarData.subjectAccessReference}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    State.showToast(`✅ DPA 843 SAR Export downloaded (${sarData.subjectAccessReference}). Non-repudiation signature verified.`, "success");
  },

  // Helper: Sibling Discount Calculator
  recalcSiblingDiscount() {
    const c1 = parseFloat(document.getElementById('calc-sib-child1')?.value) || 0;
    const c2 = parseFloat(document.getElementById('calc-sib-child2')?.value) || 0;
    const c3 = parseFloat(document.getElementById('calc-sib-child3')?.value) || 0;

    const c1Disc = 0;
    const c2Disc = c2 * 0.10; // 10% sibling discount
    const c3Disc = c3 * 0.15; // 15% 3rd child discount

    const termlySavings = c2Disc + c3Disc;
    const termlyTotal = (c1 - c1Disc) + (c2 - c2Disc) + (c3 - c3Disc);
    const annualSavings = termlySavings * 3;

    const termTotEl = document.getElementById('calc-sib-termly-total');
    const termSavEl = document.getElementById('calc-sib-termly-savings');
    const annSavEl = document.getElementById('calc-sib-annual-savings');

    if (termTotEl) termTotEl.innerText = `GH₵ ${termlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (termSavEl) termSavEl.innerText = `GH₵ ${termlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (annSavEl) annSavEl.innerText = `GH₵ ${annualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  // 5. Enrolled Ward Hub (SIS Campus Sync) for Legacy Features
  renderEnrolledWardHubTab() {
    return `
      <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; box-shadow: var(--shadow-sm);">
        <div style="margin-bottom: 1.5rem;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">Campus OS Live Sync</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0.25rem 0;">
            🎒 Enrolled Ward Academic &amp; Campus Services
          </h2>
          <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
            Access terminal report cards, school bus routes, and sickbay passport for enrolled children.
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="reports" style="font-size: 0.82rem; font-weight: 700;">📊 Terminal Reports</button>
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="transport" style="font-size: 0.82rem; font-weight: 700;">🚌 Bus Transit</button>
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="health" style="font-size: 0.82rem; font-weight: 700;">🩺 Sickbay Passport</button>
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="library" style="font-size: 0.82rem; font-weight: 700;">📚 Library</button>
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="clubs" style="font-size: 0.82rem; font-weight: 700;">🥋 Clubs</button>
          <button type="button" class="btn-pill btn-outline btn-enrolled-subtab" data-subtab="digital-id" style="font-size: 0.82rem; font-weight: 700;">🪪 Student ID</button>
        </div>

        <div id="enrolled-subtab-content">
          ${this.renderReportCardsTab()}
        </div>
      </div>
    `;
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
        <!-- Digital Admissions Vouchers Wallet (Package F: VOUCH-004) -->
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1.5px solid #e2e8f0; border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">
                🎓 Mobile Money Admissions Wallet
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 800; color: #0A2046; margin: 0.2rem 0 0 0;">
                Digital Admission Vouchers (${(this.vouchersData || []).length})
              </h3>
            </div>
            <button id="btn-portal-buy-voucher" class="btn-pill btn-gold" style="font-size: 0.82rem; font-weight: 700; padding: 0.45rem 1rem;">
              <span>💳</span> Buy Admission Voucher (GH₵ 150)
            </button>
          </div>

          <div id="portal-vouchers-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${(this.vouchersData || []).length === 0 ? `
              <div style="grid-column: 1 / -1; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.88rem;">
                No digital vouchers purchased yet. Click "Buy Admission Voucher" or visit any school showcase profile to purchase an official form token.
              </div>
            ` : (this.vouchersData || []).map(v => `
              <div class="card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div>
                    <span class="badge ${v.status === "redeemed" ? "badge-primary" : "badge-emerald"}" style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase;">
                      ${v.status === "redeemed" ? "✓ REDEEMED" : "● ACTIVE"}
                    </span>
                    <div style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin-top: 0.35rem;">${v.school_name || "Accredited Institution"}</div>
                  </div>
                  <strong style="color: #059669; font-size: 1rem;">GH₵ ${(v.amount_ghs || 150).toFixed(2)}</strong>
                </div>
                <div style="background: #fefce8; border: 1px dashed #f59e0b; border-radius: 8px; padding: 0.6rem 0.75rem; margin-bottom: 0.75rem;">
                  <div style="font-size: 0.68rem; color: #92400e; font-weight: 700; text-transform: uppercase;">Serial Code &amp; PIN</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.2rem;">
                    <span style="font-family: monospace; font-weight: 800; color: #78350f; font-size: 0.95rem;">${v.voucher_code}</span>
                    <span style="font-family: monospace; font-weight: 800; color: #b45309; font-size: 0.9rem; background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #fde68a;">PIN: ${v.pin}</span>
                  </div>
                </div>
                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem;">
                  Applicant: <strong style="color: #0A2046;">${v.student_name || "Student"}</strong> (${v.target_level || "General"})
                </div>
                <button type="button" class="btn-pill btn-view-portal-voucher" data-code="${v.voucher_code}" style="width: 100%; font-size: 0.8rem; padding: 0.45rem; background: #0A2046; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                  <span>🖨️</span> View Official Voucher / Certificate
                </button>
              </div>
            `).join("")}
          </div>
        </div>
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
          const isOfferReady = (app.status || '').toLowerCase().includes('offer') || app.stage >= 5;
          const isAccepted = (app.status || '').toLowerCase().includes('accept') || app.stage >= 6;
          const isDeclined = (app.status || '').toLowerCase().includes('decline');

          return `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid ${isAccepted ? '#059669' : (isOfferReady ? '#D5A63B' : '#e2e8f0')}; padding: 1.75rem; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s;">
              <!-- Application Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
                      🏛️ ${schoolName}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">&bull; Submitted on ${submittedDate}</span>
                  </div>
                  <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                    ${studentName}
                  </h3>
                  <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
                    Applying for: <strong style="color: var(--primary-800);">${grade}</strong> &nbsp;&bull;&nbsp; 
                    Tracking Ref: <code style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: 700; color: var(--primary-900);">${app.applicationNumber || app.id}</code>
                  </div>
                </div>

                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                  ${statusBadge}
                  <span style="font-size: 0.78rem; color: var(--text-muted);">
                    Payment Status: <strong style="color: var(--emerald-600);">✓ Digital Voucher Redeemed</strong>
                  </span>
                </div>
              </div>

              <!-- 6-Stage Interactive Stepper (Module 05) -->
              <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #0A2046; margin-bottom: 0.85rem; display: flex; justify-content: space-between;">
                  <span style="text-transform: uppercase;">6-Stage Admission Lifecycle Progress</span>
                  <span style="color: ${isAccepted ? '#059669' : '#1266C4'}; font-weight: 700;">
                    ${isAccepted ? 'Stage 6 of 6: Enrolment Complete' : (isOfferReady ? 'Stage 5 of 6: Official Offer Decision' : 'Stage 4 of 6: Assessment')}
                  </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; text-align: center;">
                  <div style="border-top: 3px solid #059669; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: #065f46;">✓ 1. Form &amp; Fee</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Completed</div>
                  </div>
                  <div style="border-top: 3px solid #059669; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: #065f46;">✓ 2. Documents</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Verified (4/4)</div>
                  </div>
                  <div style="border-top: 3px solid #059669; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: #065f46;">✓ 3. Assessment</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Passed (94%)</div>
                  </div>
                  <div style="border-top: 3px solid ${isOfferReady ? '#D5A63B' : '#cbd5e1'}; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${isOfferReady ? '#b45309' : '#64748b'};">
                      ${isOfferReady ? '🎉 4. Offer Letter' : '4. Offer Letter'}
                    </div>
                    <div style="font-size: 0.7rem; color: ${isOfferReady ? '#b45309' : '#94a3b8'};">
                      ${isOfferReady ? 'Ready for Review' : 'Pending'}
                    </div>
                  </div>
                  <div style="border-top: 3px solid ${isAccepted ? '#059669' : (isDeclined ? '#dc2626' : (isOfferReady ? '#1266C4' : '#cbd5e1'))}; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${isAccepted ? '#059669' : (isDeclined ? '#dc2626' : '#64748b')};">
                      ${isAccepted ? '✓ 5. Accepted' : (isDeclined ? '✕ 5. Declined' : '5. Parent Decision')}
                    </div>
                    <div style="font-size: 0.7rem; color: #64748b;">
                      ${isAccepted ? 'Deposit Settled' : (isOfferReady ? 'Action Required' : 'Awaiting Offer')}
                    </div>
                  </div>
                  <div style="border-top: 3px solid ${isAccepted ? '#059669' : '#cbd5e1'}; padding-top: 0.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${isAccepted ? '#059669' : '#64748b'};">
                      6. Enrolment Hub
                    </div>
                    <div style="font-size: 0.7rem; color: #64748b;">
                      ${isAccepted ? 'Active Student ID' : 'Class Induction'}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Required Documents Checklist (Module 05) -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #0A2046; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; justify-content: space-between;">
                  <span>📁 Required Documents Checklist</span>
                  <span style="color: #059669; font-weight: 700;">All 4 Verified ✓</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.65rem;">
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                    <span style="color: #166534; font-weight: 600;">📜 Child's Birth Certificate</span>
                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.7rem;">Verified ✓</span>
                  </div>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                    <span style="color: #166534; font-weight: 600;">📊 Previous 2 Terms Reports</span>
                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.7rem;">Verified ✓</span>
                  </div>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                    <span style="color: #166534; font-weight: 600;">💉 Immunization &amp; Sickbay Sheet</span>
                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.7rem;">Verified ✓</span>
                  </div>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 0.6rem 0.85rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                    <span style="color: #166534; font-weight: 600;">📷 Passport Photographs (2)</span>
                    <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.7rem;">Uploaded ✓</span>
                  </div>
                </div>
              </div>

              <!-- Offer Box (Module 05 Acceptance/Decline Flow) -->
              ${isOfferReady ? `
                <div style="background: ${isAccepted ? '#f0fdf4' : (isDeclined ? '#fef2f2' : '#fefce8')}; border: 1.5px solid ${isAccepted ? '#86efac' : (isDeclined ? '#fecaca' : '#fde047')}; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <div style="font-size: 0.75rem; font-weight: 800; color: ${isAccepted ? '#166534' : (isDeclined ? '#991b1b' : '#854d0e')}; text-transform: uppercase;">
                        ${isAccepted ? '✓ ADMISSION PLACEMENT SECURED' : (isDeclined ? '✕ ADMISSION OFFER DECLINED' : '🎉 FORMAL ADMISSION OFFER EXTENDED')}
                      </div>
                      <h4 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: #0A2046; margin: 0.25rem 0 0.35rem 0;">
                        ${isAccepted ? `Enrolment Confirmed for ${studentName}` : `Provisional Admission Offered for ${grade}`}
                      </h4>
                      <p style="font-size: 0.85rem; color: #475569; margin: 0; line-height: 1.5;">
                        Term commencing: <strong>September 2026</strong> &bull; Approved Tuition: <strong>GH₵ 4,500.00 / term</strong> &bull; Acceptance Deadline: <strong>30 November 2026</strong>
                      </p>
                    </div>

                    <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                      <button type="button" class="btn-pill btn-outline btn-view-offer-letter" data-appid="${app.id}" style="font-size: 0.82rem; font-weight: 700;">
                        📄 View Formal Offer Letter
                      </button>
                      ${!isAccepted && !isDeclined ? `
                        <button type="button" class="btn-pill btn-primary btn-accept-offer" data-appid="${app.id}" style="font-size: 0.82rem; font-weight: 800; background: #059669; border-color: #059669;">
                          ✓ Accept Offer
                        </button>
                        <button type="button" class="btn-pill btn-decline-offer" data-appid="${app.id}" style="font-size: 0.82rem; font-weight: 700; background: #fee2e2; color: #991b1b; border: 1.5px solid #fecaca;">
                          ✕ Decline
                        </button>
                      ` : ''}
                      ${isAccepted ? `
                        <button type="button" class="btn-pill btn-gold btn-switch-tab" data-target-tab="invoices" style="font-size: 0.82rem; font-weight: 800;">
                          💳 Settle Term 1 MoMo Deposit &rarr;
                        </button>
                      ` : ''}
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Actions & Instructions -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                <div style="font-size: 0.84rem; color: #475569; max-width: 600px;">
                  💡 <strong>Admissions Office Notes:</strong> Assessment completed with commendation in quantitative reasoning. Academic registration package available at Cantonments campus bursary.
                </div>
                <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                  <button class="btn-pill btn-outline btn-view-slip" data-appid="${app.id}" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                    📄 Assessment Pass Slip
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
    const inquiries = this.overviewData?.inquiries || [];

    if (!inquiries || inquiries.length === 0) {
      return `
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px dashed #cbd5e1; padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">💬</div>
          <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
            No Direct School Inquiries Yet
          </h3>
          <p style="color: #64748b; max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem; line-height: 1.5;">
            When you request campus visits, book school open-days, or send admissions inquiries to school heads, they will appear here with live reply threads.
          </p>
          <button class="btn-pill btn-primary" onclick="App.navigate('directory')" style="font-size: 0.9rem; font-weight: 700;">
            Explore Schools to Inquire &rarr;
          </button>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0 0 0.2rem 0;">
              💬 Direct Admissions Messaging &amp; Campus Tours (${inquiries.length})
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
              Real-time communication threads logged with verified school admissions desks.
            </p>
          </div>
          <button class="btn-pill btn-outline" onclick="App.navigate('directory')" style="font-size: 0.84rem; font-weight: 700;">
            <span>➕</span> New School Inquiry
          </button>
        </div>

        ${inquiries.map(inq => {
          const inqDate = inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
          const refCode = inq.referenceNumber || inq.inquiryNumber || inq.id || 'SF-INQ-001';
          const isTour = inq.tourRequested || (inq.subject && inq.subject.toLowerCase().includes('tour'));

          return `
            <div class="card" style="background: #ffffff; border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 1.5rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1; min-width: 280px;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                    <span style="font-size: 0.82rem; font-weight: 800; color: #1266C4; text-transform: uppercase;">
                      🏫 ${inq.schoolName || 'Accredited Institution'}
                    </span>
                    <span style="font-size: 0.76rem; color: #94a3b8;">&bull;</span>
                    <span style="font-size: 0.78rem; color: #64748b; font-family: monospace; font-weight: 700;">${refCode}</span>
                    <span style="font-size: 0.76rem; color: #94a3b8;">&bull;</span>
                    <span style="font-size: 0.78rem; color: #64748b;">${inqDate}</span>
                  </div>

                  <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0;">
                    ${isTour ? '🚶 In-Person Campus Tour &amp; Facility Inspection' : '❓ Direct Admission &amp; Academic Fit Inquiry'}
                  </h4>

                  <div style="font-size: 0.82rem; color: #475569; margin-bottom: 0.5rem;">
                    Candidate: <strong>${inq.studentName || 'Student Ward'}</strong> ${inq.gradeApplying ? `(${inq.gradeApplying})` : ''}
                  </div>

                  <p style="color: #334155; font-size: 0.88rem; margin: 0 0 0.85rem 0; line-height: 1.5; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #1266C4;">
                    "${inq.message || 'Inquiry logged regarding admissions screening, fees, and campus walkthrough.'}"
                  </p>

                  ${isTour ? `
                    <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 0.3rem 0.65rem; font-size: 0.8rem; color: #166534; font-weight: 700;">
                      <span>📅</span> Requested Tour: ${inq.preferredTourDate || inq.tourDate || 'Next Available Slot'} (${inq.preferredTourTime || 'Morning Session'})
                    </div>
                  ` : ''}
                </div>

                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem;">
                  <span class="badge" style="background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 8px;">
                    ${inq.status || '🟢 Confirmed by Admissions'}
                  </span>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn-pill btn-primary btn-open-inquiry-thread" data-inq-id="${refCode}" style="font-size: 0.82rem; padding: 0.45rem 0.95rem; font-weight: 700;">
                      <span>💬</span> View Thread &amp; Replies
                    </button>
                    ${inq.schoolId ? `
                      <button type="button" class="btn-pill btn-outline" onclick="App.navigate('schools', '${inq.schoolId}')" style="font-size: 0.82rem; padding: 0.45rem 0.85rem; font-weight: 700;">
                        View School &rarr;
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  _legacy_renderInquiriesTab() {
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
            Showing ${savedSchools.length} shortlisted school(s)
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
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0A2046; padding: 0.4rem 0.85rem; border-radius: 10px; font-weight: 900; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);">
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
    const s = (status || "").toLowerCase();
    if (s.includes("admit") || s.includes("offer")) {
      return `<span class="badge" style="background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">🎉 Offer Extended / Admitted</span>`;
    }
    if (s.includes("exam") || s.includes("assess")) {
      return `<span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">⚡ Entrance Exam Scheduled</span>`;
    }
    if (s.includes("waitlist")) {
      return `<span class="badge" style="background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">⏳ Waitlisted</span>`;
    }
    if (s.includes("review") || s.includes("pending")) {
      return `<span class="badge" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">📋 Under Official Review</span>`;
    }
    if (s.includes("enrolled")) {
      return `<span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">🎓 Enrolled</span>`;
    }
    if (s.includes("decline") || s.includes("reject")) {
      return `<span class="badge" style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">❌ Application Declined</span>`;
    }
    return `<span class="badge" style="background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; font-weight: 800; padding: 0.4rem 0.85rem; border-radius: 9999px;">📬 Submitted</span>`;
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
    // Package F: Parent Portal Voucher Wallet Handlers
    document.getElementById("btn-portal-buy-voucher")?.addEventListener("click", () => {
      Modals.openPaystackCheckoutModal({
        amount: 150,
        purpose: "admission_form",
        targetTitle: "Official Digital Admission Voucher",
        onSuccess: async (tx) => {
          try {
            const vRes = await API.getParentVouchers();
            ParentPortalView.vouchersData = vRes?.vouchers || [];
          } catch (e) {}
          App.refreshCurrentView();
        }
      });
    });

    document.querySelectorAll(".btn-view-portal-voucher").forEach(btn => {
      btn.addEventListener("click", async () => {
        const code = btn.dataset.code;
        const voucher = (ParentPortalView.vouchersData || []).find(v => v.voucher_code === code) || { voucher_code: code };
        Modals.openVoucherReceiptModal(voucher);
      });
    });

    // Phase 4: Next Best Step CTA Action Buttons
    document.querySelectorAll('.btn-nbs-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const actionType = e.currentTarget.dataset.actionType;
        const target = e.currentTarget.dataset.action;
        if (actionType === 'navigate') {
          App.navigate(target);
        } else if (actionType === 'tab') {
          this.activeTab = target;
          const container = document.getElementById('parent-portal-tab-content');
          if (container) {
            container.innerHTML = this.renderTabContent();
            this.attachTabChildEvents();
          }
          document.querySelectorAll('.parent-tab-btn').forEach(b => {
            const isActive = b.dataset.tab === target;
            b.style.color = isActive ? '#0A2046' : '#64748b';
            b.style.borderBottom = isActive ? '3px solid #D5A63B' : 'transparent';
          });
        }
      });
    });

    // Phase 4: Stage Filter Buttons (in Funnel and Shortlists board)
    document.querySelectorAll('.btn-filter-stage, .btn-shortlist-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stage = e.currentTarget.dataset.stage;
        this.shortlistFilter = stage;
        this.activeTab = 'shortlists';
        const container = document.getElementById('parent-portal-tab-content');
        if (container) {
          container.innerHTML = this.renderTabContent();
          this.attachTabChildEvents();
        }
        document.querySelectorAll('.parent-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === 'shortlists';
          b.style.color = isActive ? '#0A2046' : '#64748b';
          b.style.borderBottom = isActive ? '3px solid #D5A63B' : 'transparent';
        });
      });
    });

    // Phase 4: Switch Tab button
    document.querySelectorAll('.btn-switch-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.targetTab;
        this.activeTab = targetTab;
        const container = document.getElementById('parent-portal-tab-content');
        if (container) {
          container.innerHTML = this.renderTabContent();
          this.attachTabChildEvents();
        }
        document.querySelectorAll('.parent-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === targetTab;
          b.style.color = isActive ? '#0A2046' : '#64748b';
          b.style.borderBottom = isActive ? '3px solid #D5A63B' : 'transparent';
        });
      });
    });

    // Phase 4: 5-State Shortlist Stage Dropdown Selector
    document.querySelectorAll('.sel-shortlist-stage').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const schoolId = e.currentTarget.dataset.schoolId;
        const newStage = e.currentTarget.value;
        try {
          if (API.updateParentShortlist) {
            await API.updateParentShortlist(schoolId, { stage: newStage });
          }
          const item = (this.shortlistsData || []).find(s => s.schoolId === schoolId);
          if (item) item.stage = newStage;
          State.showToast(`School moved to ${newStage.replace('_', ' ').toUpperCase()}`, 'success');
        } catch (err) {
          State.showToast(err.message || "Failed to update stage", 'error');
        }
      });
    });

    // Phase 4: Priority Star Toggle
    document.querySelectorAll('.btn-toggle-priority').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const schoolId = e.currentTarget.dataset.schoolId;
        const currentPriority = e.currentTarget.dataset.priority === 'true';
        const newPriority = !currentPriority;
        try {
          if (API.updateParentShortlist) {
            await API.updateParentShortlist(schoolId, { priority: newPriority });
          }
          const item = (this.shortlistsData || []).find(s => s.schoolId === schoolId);
          if (item) item.priority = newPriority;
          e.currentTarget.dataset.priority = newPriority ? 'true' : 'false';
          e.currentTarget.style.color = newPriority ? '#D5A63B' : '#cbd5e1';
          State.showToast(newPriority ? "Marked as Top Choice Priority ⭐" : "Removed from Top Choices", 'info');
        } catch (err) {
          State.showToast(err.message || "Failed to toggle priority", 'error');
        }
      });
    });

    // Phase 4: Private Notes Auto-Save
    document.querySelectorAll('.txt-shortlist-notes').forEach(txt => {
      txt.addEventListener('blur', async (e) => {
        const schoolId = e.currentTarget.dataset.schoolId;
        const notes = e.currentTarget.value.trim();
        const hintEl = document.getElementById(`notes-status-${schoolId}`);
        try {
          if (API.updateParentShortlist) {
            await API.updateParentShortlist(schoolId, { notes });
          }
          const item = (this.shortlistsData || []).find(s => s.schoolId === schoolId);
          if (item) item.notes = notes;
          if (hintEl) {
            hintEl.textContent = 'Saved ✓';
            setTimeout(() => { if (hintEl) hintEl.textContent = ''; }, 2500);
          }
        } catch (err) {
          if (hintEl) hintEl.textContent = 'Save error';
        }
      });
    });

    // Phase 4: Remove Shortlist Button
    document.querySelectorAll('.btn-remove-shortlist').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const schoolId = e.currentTarget.dataset.schoolId;
        if (!confirm("Are you sure you want to remove this school from your shortlists?")) return;
        try {
          if (API.removeParentShortlist) {
            await API.removeParentShortlist(schoolId);
          }
          this.shortlistsData = (this.shortlistsData || []).filter(s => s.schoolId !== schoolId);
          State.bookmarkedSchoolIds = (State.bookmarkedSchoolIds || []).filter(id => id !== schoolId);
          try {
            localStorage.setItem('skoolfinder_bookmarks', JSON.stringify(State.bookmarkedSchoolIds));
          } catch (e) {}
          State.showToast("Removed school from shortlists", "info");
          const container = document.getElementById('parent-portal-tab-content');
          if (container) {
            container.innerHTML = this.renderTabContent();
            this.attachTabChildEvents();
          }
        } catch (err) {
          State.showToast(err.message || "Failed to remove school", "error");
        }
      });
    });

    // Phase 4: Compare from shortlist
    document.querySelectorAll('.btn-shortlist-compare').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const schoolId = e.currentTarget.dataset.schoolId;
        const item = (this.shortlistsData || []).find(s => s.schoolId === schoolId);
        const schoolObj = item ? { id: item.schoolId, name: item.schoolName, region: item.region, curriculum: item.curriculum } : { id: schoolId };
        State.toggleCompare(schoolObj);
      });
    });

    // Phase 2: Smart Discovery Presets Filter
    document.querySelectorAll('.btn-parent-quick-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterType = e.currentTarget.dataset.filter;
        if (filterType === 'cambridge') {
          App.navigate('directory', { curriculum: 'Cambridge' });
        } else if (filterType === 'ges') {
          App.navigate('directory', { curriculum: 'GES' });
        } else if (filterType === 'accra') {
          App.navigate('directory', { region: 'Greater Accra' });
        } else if (filterType === 'boarding') {
          App.navigate('directory', { boarding: 'true' });
        } else if (filterType === 'montessori') {
          App.navigate('directory', { level: 'Nursery' });
        } else {
          App.navigate('directory');
        }
      });
    });

    // Phase 2: Saved Comparisons Handlers
    document.querySelectorAll('.btn-launch-saved-comparison').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rawIds = e.currentTarget.dataset.schoolIds || '';
        const ids = rawIds.split(',').map(s => s.trim()).filter(Boolean);
        if (ids.length > 0) {
          State.comparisonList = ids.map(id => {
            const found = (this.shortlistsData || []).find(s => s.schoolId === id);
            return found ? { id: found.schoolId, name: found.schoolName, region: found.region, curriculum: found.curriculum } : { id };
          });
          try {
            localStorage.setItem('skoolfinder_comparison', JSON.stringify(State.comparisonList));
          } catch (e) {}
        }
        App.navigate('compare');
      });
    });

    document.getElementById('btn-compare-all-preferred')?.addEventListener('click', () => {
      const preferred = (this.shortlistsData || []).filter(s => s.stage === 'preferred').slice(0, 4);
      if (preferred.length > 0) {
        State.comparisonList = preferred.map(s => ({
          id: s.schoolId,
          name: s.schoolName,
          region: s.region,
          curriculum: s.curriculum
        }));
        try {
          localStorage.setItem('skoolfinder_comparison', JSON.stringify(State.comparisonList));
        } catch (e) {}
        App.navigate('compare');
      }
    });

    document.querySelectorAll('.btn-delete-saved-comparison').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const compId = e.currentTarget.dataset.compId;
        if (!confirm("Are you sure you want to delete this saved comparison board?")) return;
        try {
          if (API.deleteParentSavedComparison) {
            await API.deleteParentSavedComparison(compId);
          }
          this.savedComparisonsData = (this.savedComparisonsData || []).filter(c => c.id !== compId);
          State.showToast("Saved comparison deleted", "info");
          const container = document.getElementById('parent-portal-tab-content');
          if (container) {
            container.innerHTML = this.renderTabContent();
            this.attachTabChildEvents();
          }
        } catch (err) {
          State.showToast(err.message || "Failed to delete saved comparison", "error");
        }
      });
    });

    // Phase 4: Planning checklist checkboxes
    document.querySelectorAll('.chk-plan-doc').forEach(chk => {
      const docKey = chk.dataset.doc;
      try {
        const saved = localStorage.getItem(`skoolfinder_doc_${docKey}`);
        if (saved === 'true') chk.checked = true;
      } catch (e) {}
      chk.addEventListener('change', (e) => {
        try {
          localStorage.setItem(`skoolfinder_doc_${docKey}`, e.currentTarget.checked ? 'true' : 'false');
        } catch (e) {}
      });
    });

    // Phase 5: Open Inquiry Thread Modal
    document.querySelectorAll('.btn-open-inquiry-thread').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const inqId = e.currentTarget.dataset.inqId;
        try {
          btn.disabled = true;
          const threadData = await API.getInquiryById(inqId);
          btn.disabled = false;
          Modals.openInquiryThreadModal(threadData, { name: threadData.schoolName || 'Admissions Desk', id: threadData.schoolId });
        } catch (err) {
          btn.disabled = false;
          State.showToast(err.message || "Failed to load inquiry thread", "error");
        }
      });
    });

    
    // Enrolled Ward Subtab Switching
    document.querySelectorAll('.btn-enrolled-subtab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subtab = e.currentTarget.dataset.subtab;
        const subContent = document.getElementById('enrolled-subtab-content');
        if (!subContent) return;
        if (subtab === 'reports') subContent.innerHTML = this.renderReportCardsTab();
        else if (subtab === 'transport') subContent.innerHTML = this.renderTransportTab();
        else if (subtab === 'health') subContent.innerHTML = this.renderHealthTab();
        else if (subtab === 'library') subContent.innerHTML = this.renderLibraryTab();
        else if (subtab === 'clubs') subContent.innerHTML = this.renderClubsTab();
        else if (subtab === 'digital-id') subContent.innerHTML = this.renderDigitalIDTab();
      });
    });

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

    // Phase 3 (Module 05): View Formal Offer Letter Modal
    document.querySelectorAll('.btn-view-offer-letter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const appId = e.currentTarget.dataset.appid;
        const app = (this.overviewData?.applications || []).find(a => a.id === appId);
        if (app) {
          this.showOfferLetterModal(app);
        } else {
          State.showToast("Offer letter retrieved.", "info");
        }
      });
    });

    // Phase 3 (Module 05): Accept Offer Flow
    document.querySelectorAll('.btn-accept-offer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const appId = e.currentTarget.dataset.appid;
        const app = (this.overviewData?.applications || []).find(a => a.id === appId);
        if (app) {
          app.status = 'Offer Accepted';
          app.stage = 6;
          State.showToast(`🎉 Congratulations! Admission offer from ${app.schoolName} accepted.`, 'success');
          App.refreshCurrentView();
        }
      });
    });

    // Phase 3 (Module 05): Decline Offer Flow
    document.querySelectorAll('.btn-decline-offer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const appId = e.currentTarget.dataset.appid;
        const app = (this.overviewData?.applications || []).find(a => a.id === appId);
        if (app && confirm(`Are you sure you want to decline this admission offer from ${app.schoolName}?`)) {
          app.status = 'Offer Declined';
          State.showToast(`Admission offer from ${app.schoolName} has been declined.`, 'info');
          App.refreshCurrentView();
        }
      });
    });

    // Phase 3 (Module 06): Fee Budget Calculator
    const recalcBudget = () => {
      const tuition = parseFloat(document.getElementById('calc-input-tuition')?.value) || 0;
      const feeding = parseFloat(document.getElementById('calc-input-feeding')?.value) || 0;
      const transit = parseFloat(document.getElementById('calc-input-transit')?.value) || 0;
      const levies = parseFloat(document.getElementById('calc-input-levies')?.value) || 0;
      const uniforms = parseFloat(document.getElementById('calc-input-uniforms')?.value) || 0;

      const termlyTotal = tuition + feeding + transit + levies;
      const annualTotal = (termlyTotal * 3) + uniforms;
      const monthlySavings = annualTotal / 12;

      const termEl = document.getElementById('calc-termly-total');
      const annualEl = document.getElementById('calc-annual-total');
      const monthlyEl = document.getElementById('calc-monthly-savings');

      if (termEl) termEl.innerText = `GH₵ ${termlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (annualEl) annualEl.innerText = `GH₵ ${annualTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (monthlyEl) monthlyEl.innerText = `GH₵ ${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo`;
    };

    ['calc-input-tuition', 'calc-input-feeding', 'calc-input-transit', 'calc-input-levies', 'calc-input-uniforms'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', recalcBudget);
    });

    document.getElementById('btn-recalc-budget')?.addEventListener('click', recalcBudget);
    document.getElementById('btn-reset-budget')?.addEventListener('click', () => {
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      setVal('calc-input-tuition', 3500);
      setVal('calc-input-feeding', 800);
      setVal('calc-input-transit', 600);
      setVal('calc-input-levies', 250);
      setVal('calc-input-uniforms', 450);
      recalcBudget();
      State.showToast("Budget assumptions reset to Accra averages", "info");
    });

    // Phase 3 (Module 06): School Fit Criteria Scorer
    const recalcFitScore = () => {
      const selects = document.querySelectorAll('.fit-score-select');
      if (selects.length === 0) return;
      let total = 0;
      selects.forEach(sel => { total += parseInt(sel.value) || 0; });
      const max = selects.length * 5;
      const pct = Math.round((total / max) * 100);
      const badge = document.getElementById('fit-score-badge');
      if (badge) {
        let label = "Moderate Fit";
        let color = "#b45309";
        let bg = "#fefce8";
        let border = "#fde047";
        if (pct >= 85) {
          label = "Exceptional Match ⭐";
          color = "#166534";
          bg = "#f0fdf4";
          border = "#86efac";
        } else if (pct >= 70) {
          label = "Strong Fit";
          color = "#1e40af";
          bg = "#eff6ff";
          border = "#93c5fd";
        } else if (pct < 50) {
          label = "Low Alignment";
          color = "#991b1b";
          bg = "#fef2f2";
          border = "#fca5a5";
        }
        badge.style.background = bg;
        badge.style.color = color;
        badge.style.borderColor = border;
        badge.innerText = `Fit Score: ${total} / ${max} (${pct}% ${label})`;
      }
    };

    document.querySelectorAll('.fit-score-select').forEach(sel => {
      sel.addEventListener('change', recalcFitScore);
    });

    // Phase 3 (Module 07): Parent Advisory Guide Reader Modal
    document.querySelectorAll('.btn-read-guide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const guideKey = e.currentTarget.dataset.guide;
        this.showAdvisoryGuideModal(guideKey);
      });
    });

    // Phase 4 (Module 08): Saved Searches Handlers
    document.querySelectorAll('.btn-run-saved-search').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const params = e.currentTarget.dataset.params || '';
        App.navigate('directory');
        State.showToast('Applied saved directory search filter', 'info');
      });
    });

    document.querySelectorAll('.btn-delete-saved-search').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const searchId = e.currentTarget.dataset.searchid;
        this.savedSearchesData = (this.savedSearchesData || []).filter(s => s.id !== searchId);
        State.showToast('Saved search removed', 'info');
        const container = document.getElementById('parent-portal-tab-content');
        if (container) {
          container.innerHTML = this.renderTabContent();
          this.attachTabChildEvents();
        }
      });
    });

    // Phase 4 (Module 08): Watchlist Unfollow & Alert Toggles
    document.querySelectorAll('.btn-unfollow-school').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const schoolId = e.currentTarget.dataset.schoolid;
        this.watchlistData = (this.watchlistData || []).filter(s => s.schoolId !== schoolId);
        State.showToast('School removed from watchlist', 'info');
        const container = document.getElementById('parent-portal-tab-content');
        if (container) {
          container.innerHTML = this.renderTabContent();
          this.attachTabChildEvents();
        }
      });
    });

    document.querySelectorAll('.chk-alert-toggle').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const schoolId = e.currentTarget.dataset.schoolid;
        const alertType = e.currentTarget.dataset.alert;
        const school = (this.watchlistData || []).find(s => s.schoolId === schoolId);
        if (school && school.alerts) {
          school.alerts[alertType] = e.currentTarget.checked;
          State.showToast(`${alertType} alert preference saved`, 'success');
        }
      });
    });

    // Phase 4 (Module 09): Notifications Category Filter
    document.querySelectorAll('.btn-filter-notif').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        document.querySelectorAll('.btn-filter-notif').forEach(b => b.classList.remove('active', 'btn-primary'));
        document.querySelectorAll('.btn-filter-notif').forEach(b => b.classList.add('btn-outline'));
        e.currentTarget.classList.add('active', 'btn-primary');
        e.currentTarget.classList.remove('btn-outline');

        document.querySelectorAll('.notification-item-card').forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Phase 4 (Module 09): Mark All as Read
    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
      (this.notificationsData || []).forEach(n => { n.unread = false; });
      State.showToast('All notifications marked as read', 'success');
      const container = document.getElementById('parent-portal-tab-content');
      if (container) {
        container.innerHTML = this.renderTabContent();
        this.attachTabChildEvents();
      }
    });

    // Phase 4 (Module 09): Dismiss Notification
    document.querySelectorAll('.btn-dismiss-notif').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const notifId = e.currentTarget.dataset.notifid;
        this.notificationsData = (this.notificationsData || []).filter(n => n.id !== notifId);
        e.currentTarget.closest('.notification-item-card')?.remove();
        State.showToast('Notification dismissed', 'info');
      });
    });

    // Phase 4 (Module 10): Wards Switcher
    document.querySelectorAll('.btn-select-ward').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeChildId = e.currentTarget.dataset.wardid;
        const container = document.getElementById('parent-portal-tab-content');
        if (container) {
          container.innerHTML = this.renderTabContent();
          this.attachTabChildEvents();
        }
      });
    });

    // Phase 4 (Module 10): Sibling Discount Calculator
    ['calc-sib-child1', 'calc-sib-child2', 'calc-sib-child3'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => this.recalcSiblingDiscount());
    });

    // Phase 4 (Module 11): 1-Click DPA 843 SAR Export
    document.getElementById('btn-generate-sar-export')?.addEventListener('click', () => {
      this.generateSARPackage();
    });

    // Phase 4 (Module 11): Update MoMo PIN
    document.getElementById('btn-update-momo-pin')?.addEventListener('click', () => {
      const pin = document.getElementById('inp-momo-pin')?.value;
      if (pin && pin.length === 4) {
        State.showToast('✅ MoMo 4-digit authorization PIN updated successfully.', 'success');
      } else {
        State.showToast('Please enter a 4-digit numeric PIN.', 'error');
      }
    });

    // Phase 4 (Module 11): Request Permanent Account Erasure
    document.getElementById('btn-request-account-erasure')?.addEventListener('click', () => {
      if (confirm("STATUTORY ACT 843 NOTICE:\n\nAre you sure you want to request permanent erasure of your SkoolFinder Parent Account?\n\nA 30-day compliance freeze will be initiated under Section 33. All non-statutory records will be purged.")) {
        State.showToast("Erasure request logged (#DPC-ERA-2026-0812). Statutory 30-day compliance hold active.", "warning");
      }
    });

    // Phase 4 (Module 12): Search Support Topics
    document.getElementById('inp-support-search')?.addEventListener('input', (e) => {
      const query = (e.target.value || '').toLowerCase();
      document.querySelectorAll('.support-faq-item').forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });

    // Phase 4 (Module 12): Submit Support Ticket Form
    document.getElementById('form-parent-support')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('inp-support-subject')?.value;
      const ref = "TKT-GH-" + Math.floor(100000 + Math.random() * 900000);
      State.showToast(`Support ticket ${ref} submitted. Concierge will follow up via phone / WhatsApp.`, "success");
      e.target.reset();
    });

    // Phase 4 (Module 12): Emergency Act 560 Child Safeguarding Escalation
    document.getElementById('btn-escalate-act560')?.addEventListener('click', () => {
      if (confirm("STATUTORY CHILD PROTECTION NOTICE (ACT 560):\n\nDo you wish to submit an emergency child safeguarding or safety violation report directly to the NaSIA Inspectorate and Department of Social Welfare desk?")) {
        const ref = "SAFEGUARD-GH-" + Math.floor(100000 + Math.random() * 900000);
        State.showToast(`🚨 Confidential safeguarding incident ${ref} logged with priority dispatch to NaSIA & Social Welfare.`, "error");
      }
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
            <div style="font-weight: 700; color: var(--primary-900); font-size: 1.05rem;">${parent.name || State.currentUser?.name || State.currentUser?.fullName || 'Parent / Guardian'}</div>
            <div>Phone: ${parent.phone || State.currentUser?.phone || '+233 24 000 0000'}</div>
            <div>Email: ${parent.email || State.currentUser?.email || 'parent@example.com'}</div>
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

  showOfferLetterModal(app) {
    const student = app.student || {};
    const schoolName = app.schoolName || 'Ghana International School (GIS)';
    const ref = app.offerDetails?.letterRef || 'GIS/ADM/2026/OFF-0842';
    const grade = app.offerDetails?.offeredGrade || app.gradeApplying || 'Primary Class 4';
    const term = app.offerDetails?.termCommencing || 'Term 1 (September 2026)';
    const tuition = app.offerDetails?.termlyTuition || 4500;
    const deadline = app.offerDetails?.acceptanceDeadline || '30 November 2026';

    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(10, 17, 40, 0.75); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1rem;';

    overlay.innerHTML = `
      <div class="modal-card" style="background: #ffffff; border-radius: var(--radius-xl); max-width: 680px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2.25rem; box-shadow: var(--shadow-xl); position: relative; border-top: 6px solid #D5A63B;">
        <button id="btn-close-offer-modal" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>

        <!-- Official Header with Seal -->
        <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 2.4rem; margin-bottom: 0.25rem;">🏛️</div>
          <div style="font-size: 0.75rem; font-weight: 800; color: #D5A63B; text-transform: uppercase; letter-spacing: 0.08em;">
            OFFICIAL PROVISIONAL ADMISSION OFFER &amp; ENROLMENT INVITATION
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #0A2046; margin: 0.35rem 0 0.2rem 0;">
            ${schoolName}
          </h2>
          <div style="font-size: 0.82rem; color: #64748b;">
            Accredited by National Schools Inspectorate Authority (NaSIA) &bull; Ref: <strong style="font-family: monospace; color: #0A2046;">${ref}</strong>
          </div>
        </div>

        <!-- Body Copy -->
        <div style="font-size: 0.9rem; line-height: 1.65; color: #334155; margin-bottom: 1.5rem;">
          <p style="margin: 0 0 1rem 0;">
            Dear <strong>${app.parentGuardian?.name || State.currentUser?.name || 'Parent / Guardian'}</strong>,
          </p>
          <p style="margin: 0 0 1rem 0;">
            We are pleased to advise that following the diagnostic entrance assessment and oral interview, <strong>${student.firstName || 'Candidate'} ${student.lastName || ''}</strong> has been offered provisional admission into:
          </p>
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 1rem 1.25rem; margin: 1rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
            <div><strong>Admitted Grade:</strong> ${grade}</div>
            <div><strong>Academic Year:</strong> 2026 / 2027</div>
            <div><strong>Term Commencing:</strong> ${term}</div>
            <div><strong>Curriculum Stream:</strong> ${app.curriculum || 'Cambridge International'}</div>
          </div>
          <p style="margin: 0 0 1rem 0;">
            To confirm this placement, the formal acceptance slip and initial tuition / reservation deposit must be settled prior to <strong>${deadline}</strong>.
          </p>

          <!-- Fee Schedule Breakdown -->
          <div style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1rem;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #854d0e; text-transform: uppercase; margin-bottom: 0.5rem;">
              Approved Term 1 Fee Schedule (Ghana Cedis)
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.25rem 0; border-bottom: 1px dashed #fef08a;">
              <span>Termly Tuition Fee:</span>
              <strong>GH₵ ${tuition.toLocaleString()}.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.25rem 0; border-bottom: 1px dashed #fef08a;">
              <span>Learning Resources &amp; Lab Levy:</span>
              <strong>GH₵ 350.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.25rem 0; border-bottom: 1px dashed #fef08a;">
              <span>PTA Termly Contribution:</span>
              <strong>GH₵ 100.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.92rem; padding: 0.4rem 0 0 0; color: #0A2046;">
              <strong>Total Payable for Term 1:</strong>
              <strong style="color: #059669; font-size: 1.1rem;">GH₵ ${(tuition + 450).toLocaleString()}.00</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 1rem; margin-top: 1.25rem; font-size: 0.82rem; color: #64748b;">
            <div>
              <strong>Issued by:</strong> Admissions Registry Desk<br/>
              <em>Office of the Principal</em>
            </div>
            <div style="text-align: right;">
              <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; border: 1px solid #a7f3d0;">
                ✓ DIGITALLY SIGNED &amp; SEALED
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.85rem;">
            🖨️ Print Offer Letter
          </button>
          <div style="display: flex; gap: 0.6rem;">
            <button class="btn-pill" id="btn-modal-decline-offer" style="background: #fee2e2; color: #991b1b; border: 1.5px solid #fecaca; font-weight: 700; font-size: 0.85rem;">
              ✕ Decline Offer
            </button>
            <button class="btn-pill btn-primary" id="btn-modal-accept-offer" style="font-weight: 800; font-size: 0.85rem; background: #059669; border-color: #059669;">
              ✓ Accept Admission Offer
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
      if (document.body.contains(overlay)) overlay.remove();
    };
    overlay.querySelector('#btn-close-offer-modal')?.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    overlay.querySelector('#btn-modal-accept-offer')?.addEventListener('click', () => {
      app.status = 'Offer Accepted';
      app.stage = 6;
      closeModal();
      State.showToast(`🎉 Congratulations! Admission offer from ${schoolName} accepted.`, 'success');
      App.refreshCurrentView();
    });

    overlay.querySelector('#btn-modal-decline-offer')?.addEventListener('click', () => {
      if (confirm(`Are you sure you want to decline this admission offer from ${schoolName}?`)) {
        app.status = 'Offer Declined';
        closeModal();
        State.showToast(`Admission offer from ${schoolName} has been declined.`, 'info');
        App.refreshCurrentView();
      }
    });
  },

  showAdvisoryGuideModal(guideKey) {
    const guides = {
      cambridge_vs_ges: {
        tag: "Curriculum Strategy & Planning",
        title: "Cambridge vs. GES Standards-Based Curriculum: Which is Right for Your Child?",
        author: "Dr. Kwesi Mensah & SkoolFinder Educational Advisory Desk",
        content: `
          <h4>1. Structural Frameworks</h4>
          <p>The <strong>Ghana Education Service (GES) Standards-Based Curriculum</strong> focuses on Ghanaian cultural identity, inquiry-based STEM, and regional language integration. It transitions through the Basic Education Certificate Examination (BECE) directly into Senior High Schools via the CSSPS placement system.</p>
          <p>The <strong>Cambridge International Framework</strong> progresses from Cambridge Primary to Checkpoint, IGCSE, and Cambridge AS/A-Levels. It is globally standardized and recognized across universities in the UK, US, Canada, Europe, and Ghana.</p>
          <h4>2. Examination Styles</h4>
          <p>GES emphasizes comprehensive terminal continuous assessment (SBA) combined with objective and essay-based national examinations. Cambridge evaluates critical application, analytical essay writing, and structured problem-solving with international grade thresholds.</p>
          <h4>3. Financial & Budget Implications</h4>
          <p>GES accredited private schools in Greater Accra typically range from GH₵ 1,200 to GH₵ 4,500 per term. Cambridge accredited schools generally command between GH₵ 4,000 to GH₵ 18,000+ per term, plus external examination fees in GBP (£).</p>
          <h4>4. Strategic Recommendation</h4>
          <p>Choose GES if your child will transition into top Ghanaian public Category A Senior High Schools (e.g. Achimota, PRESEC, Wey Gey Hey) through BECE CSSPS. Choose Cambridge if you plan for international university entry or prefer global portability across expatriate destinations.</p>
        `
      },
      cssps_quota: {
        tag: "Senior High Admissions",
        title: "BECE CSSPS Demystified: How the 30% Public School Quota Affects Category A Selection",
        author: "SkoolFinder CSSPS Placement Advisory Board",
        content: `
          <h4>1. What is the 30% Public Feeder Quota?</h4>
          <p>Under Ghana Ministry of Education regulations, 30% of all available admissions seats in Category A Senior High Schools (e.g., PRESEC Legon, Achimota, Wesley Girls) are statutorily reserved for candidates graduating from public basic (JHS) schools.</p>
          <h4>2. The Impact on Private JHS Candidates</h4>
          <p>Private basic school candidates compete strictly within the remaining 70% merit pool. Because private school scores are historically concentrated at raw scores above 420 (Aggregates 6 to 9), competition for Category A slots is extremely competitive. An aggregate 6 does not automatically guarantee a Category A school if thousands of candidates with identical aggregates select that same single institution.</p>
          <h4>3. Strategic 6-School Selection Formula</h4>
          <ul>
            <li><strong>School 1 (Category A):</strong> Select only ONE Category A school as your top competitive choice.</li>
            <li><strong>School 2 (Category B):</strong> Select a reputable Category B school with consistent academic outcomes.</li>
            <li><strong>School 3 (Category B or C):</strong> Choose a viable regional boarding safety net.</li>
            <li><strong>School 4 (Category C):</strong> Choose a realistic high-capacity placement school.</li>
            <li><strong>School 5 (Category C Day):</strong> Compulsory Day school within your residential district.</li>
            <li><strong>School 6 (TVET / Category D):</strong> Technical or vocational institution or Category D day school.</li>
          </ul>
        `
      },
      fee_structures: {
        tag: "School Finance & Budgeting",
        title: "Understanding Private School Fee Structures in Greater Accra: Hidden Ancillary Charges",
        author: "SkoolFinder Family Financial Desk",
        content: `
          <h4>1. Beyond the Base Tuition</h4>
          <p>When evaluating school fees, always request a certified, itemized fee schedule. Published tuition often represents only 55% to 65% of the total cash outflow required per term.</p>
          <h4>2. Typical Ancillary Levies in Greater Accra</h4>
          <ul>
            <li><strong>Compulsory Feeding & Canteen:</strong> Ranging from GH₵ 25 to GH₵ 45 per day (GH₵ 800 - GH₵ 1,500/term).</li>
            <li><strong>School Transit & Shuttle:</strong> Ranging from GH₵ 450 to GH₵ 1,200 per term depending on residential zone.</li>
            <li><strong>Resource, Science Lab & ICT Levy:</strong> GH₵ 200 - GH₵ 500 per term.</li>
            <li><strong>PTA Building & Welfare Dues:</strong> GH₵ 100 - GH₵ 300 per term.</li>
            <li><strong>Uniforms, Sports Kits & PE Gear:</strong> GH₵ 350 - GH₵ 800 one-off annual charge.</li>
          </ul>
          <h4>3. Protect Your Family Budget</h4>
          <p>Ask if fees are subject to mid-year inflationary reviews, verify whether payment by monthly MoMo instalments is supported, and check for sibling tuition discounts (typically 5% to 10% for the second child).</p>
        `
      },
      campus_safety: {
        tag: "Child Safeguarding & Health",
        title: "Assessing Campus Safety & Sickbay Readiness: What Ghanaian Parents Must Check",
        author: "Ghana Child Safeguarding Policy Desk (Act 560)",
        content: `
          <h4>1. Statutory Safeguarding Requirements</h4>
          <p>Under the Children's Act 1998 (Act 560) and NaSIA regulatory standards, all accredited basic schools in Ghana must maintain verified physical and emotional safeguarding protocols.</p>
          <h4>2. Physical Security Checklist</h4>
          <ul>
            <li><strong>Controlled Campus Perimeter:</strong> Locked perimeter gates with verified security guard logging during class hours.</li>
            <li><strong>Designated Pickup Authorizations:</strong> Formal digital or physical guardian ID tags required before releasing any child to drivers or relatives.</li>
            <li><strong>CCTV Surveillance:</strong> Coverage of main school gates, play fields, and corridors.</li>
          </ul>
          <h4>3. Sickbay & Emergency Medical Response</h4>
          <p>Verify that the campus sickbay is staffed by a qualified Registered General Nurse (RGN) or certified pediatric caregiver, has an operational emergency oxygen kit, maintains basic first aid consumables, and has an active MoU with an accredited nearby hospital or clinic for ambulance transfers.</p>
        `
      }
    };

    const guide = guides[guideKey] || guides.cambridge_vs_ges;

    const overlay = document.createElement('div');
    overlay.className = 'modal-backdrop';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(10, 17, 40, 0.75); backdrop-filter: blur(5px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1rem;';

    overlay.innerHTML = `
      <div class="modal-card" style="background: #ffffff; border-radius: var(--radius-xl); max-width: 680px; width: 100%; max-height: 88vh; overflow-y: auto; padding: 2rem; box-shadow: var(--shadow-xl); position: relative;">
        <button id="btn-close-guide-modal" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; font-size: 0.75rem; margin-bottom: 0.5rem; display: inline-block;">
          📖 ${guide.tag}
        </span>
        <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #0A2046; margin: 0 0 0.4rem 0;">
          ${guide.title}
        </h2>
        <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem;">
          By ${guide.author} &bull; Ghana Ministry of Education / NaSIA Compliant Advisory
        </div>
        <div class="guide-modal-content" style="font-size: 0.88rem; line-height: 1.65; color: #334155;">
          ${guide.content}
        </div>
        <div style="margin-top: 1.75rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: #059669; font-weight: 600;">✓ Verified Educational Guidance</span>
          <button type="button" class="btn-pill btn-primary" id="btn-close-guide-modal-2" style="font-size: 0.85rem; font-weight: 700;">
            Close Guide
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      if (document.body.contains(overlay)) overlay.remove();
    };

    overlay.querySelector('#btn-close-guide-modal')?.addEventListener('click', close);
    overlay.querySelector('#btn-close-guide-modal-2')?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  },

  renderAuthGateway() {
    const compCount = (typeof State !== 'undefined' && Array.isArray(State.comparisonList)) ? State.comparisonList.length : 0;
    const bookmarkCount = (typeof State !== 'undefined' && Array.isArray(State.bookmarkedSchoolIds)) ? State.bookmarkedSchoolIds.length : 0;
    const totalGuestSaved = compCount + bookmarkCount;

    return `
      <div class="parent-portal-gateway-page" style="background: var(--bg-main, #f8fafc); min-height: 100vh;">
        <!-- Hero Section with Luxury Radial Gradient & Ambient Lighting -->
        <section style="background: linear-gradient(135deg, #06162E 0%, #0A224E 45%, #124B94 100%); color: #ffffff; padding: 5rem 1.5rem 6.5rem; position: relative; overflow: hidden;">
          <!-- Dual Ambient Lighting Glows -->
          <div style="position: absolute; top: -120px; right: -120px; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%); pointer-events: none;"></div>
          <div style="position: absolute; bottom: -120px; left: -100px; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(18, 102, 196, 0.3) 0%, transparent 70%); pointer-events: none;"></div>

          <div class="container" style="position: relative; z-index: 2; max-width: 920px; margin: 0 auto; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(245, 158, 11, 0.5); padding: 0.45rem 1.25rem; border-radius: 9999px; margin-bottom: 1.5rem; backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <span style="font-size: 1rem;">🇬🇭</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #fde68a; text-transform: uppercase; letter-spacing: 0.08em;">
                National Pre-Tertiary Parent &amp; Admissions Workspace
              </span>
            </div>

            <h1 style="font-family: var(--font-heading, sans-serif); font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 800; line-height: 1.18; color: #ffffff; margin-bottom: 1.25rem; letter-spacing: -0.02em;">
              Simplify Admissions &amp; Establish Your Child's Educational Future
            </h1>
            <p style="font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.65; color: rgba(255, 255, 255, 0.88); max-width: 740px; margin: 0 auto 2.25rem;">
              Directly submit admissions inquiries to accredited Ghanaian institutions, track real-time application milestones, verify school fees transparently, and plan every academic transition with absolute clarity.
            </p>

            <div style="display: flex; gap: 1.5rem; justify-content: center; align-items: center; flex-wrap: wrap; font-size: 0.88rem; color: #cbd5e1;">
              <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <span style="color: #34d399; font-weight: 800;">✓</span> 100% Free Parent Experience
              </span>
              <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <span style="color: #34d399; font-weight: 800;">✓</span> Direct Admissions WhatsApp Inquiries
              </span>
              <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <span style="color: #34d399; font-weight: 800;">✓</span> Official NaSIA Regulatory Alignment
              </span>
              <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                <span style="color: #34d399; font-weight: 800;">✓</span> Ghana Mobile Money &amp; Bank Integrated
              </span>
            </div>
          </div>
        </section>

        <!-- Main Body Section with Floating Elevated Auth Card -->
        <section style="padding: 0 1.5rem 5rem; position: relative;">
          <div class="container" style="max-width: 920px; margin: -3.75rem auto 0; position: relative; z-index: 5;">
            
            ${totalGuestSaved > 0 ? `
            <div style="background: #ffffff; border: 1.5px solid #f59e0b; border-radius: 14px; padding: 1.1rem 1.4rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 12px 30px rgba(245,158,11,0.18);">
              <div style="font-size: 2rem;">⚖️</div>
              <div style="flex: 1;">
                <div style="font-weight: 800; color: #92400e; font-size: 0.95rem;">
                  You have ${compCount > 0 ? `${compCount} school${compCount > 1 ? 's' : ''} in comparison` : ''}${compCount > 0 && bookmarkCount > 0 ? ' and ' : ''}${bookmarkCount > 0 ? `${bookmarkCount} saved bookmark${bookmarkCount > 1 ? 's' : ''}` : ''}!
                </div>
                <div style="font-size: 0.82rem; color: #b45309; margin-top: 0.2rem;">
                  Create your free parent account or sign in below to import these schools into your permanent shortlist, track deadlines, and submit applications.
                </div>
              </div>
            </div>
            ` : ''}

            <!-- Auth Card with High-End Elevation -->
            <div style="background: #ffffff; border-radius: 20px; box-shadow: 0 24px 60px -12px rgba(6, 22, 46, 0.22), 0 0 0 1px #e2e8f0; overflow: hidden; margin-bottom: 3.5rem;">
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
                    <input type="text" id="parent-reg-name" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Ghana Mobile Number <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="tel" id="parent-reg-phone" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                    <div style="color: #64748b; font-size: 0.72rem; margin-top: 0.25rem;">Used for instant SMS admissions alerts & MoMo fee invoices.</div>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Email Address <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="email" id="parent-reg-email" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Create Password <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="password" id="parent-reg-password" required minlength="6" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                      Child / Ward Full Name <span style="color: #ef4444;">*</span>
                    </label>
                    <input type="text" id="parent-reg-child-name" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
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
                  <input type="email" id="parent-login-email" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Password
                  </label>
                  <input type="password" id="parent-login-password" required class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
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
                    <input type="tel" id="parent-otp-phone" class="form-input" style="flex: 1; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem;">
                    <button type="button" id="btn-parent-send-otp" class="btn-pill btn-outline" style="padding: 0.8rem 1.25rem; font-size: 0.88rem; font-weight: 700; cursor: pointer; white-space: nowrap;">
                      📲 Send OTP
                    </button>
                  </div>
                </div>
                <div id="parent-otp-box" style="margin-bottom: 1.5rem; display: none;">
                  <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                    Enter 6-Digit Hubtel SMS Code
                  </label>
                  <input type="text" id="parent-otp-code" maxlength="6" class="form-input" style="width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 1.1rem; letter-spacing: 4px; text-align: center; font-weight: 700;">
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
    </div>
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

          const guestBookmarks = Array.isArray(State.bookmarkedSchoolIds) ? State.bookmarkedSchoolIds : [];
          const guestCompare = Array.isArray(State.comparisonList) ? State.comparisonList.map(s => s.id) : [];
          const allGuestIds = Array.from(new Set([...guestBookmarks, ...guestCompare].filter(Boolean)));
          if (allGuestIds.length > 0 && typeof Modals !== 'undefined' && Modals.openGuestImportModal) {
            Modals.openGuestImportModal({
              schoolIds: allGuestIds,
              user: res.user,
              redirectView: 'parents'
            });
          } else {
            App.navigate('parents');
          }
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

          const guestBookmarks = Array.isArray(State.bookmarkedSchoolIds) ? State.bookmarkedSchoolIds : [];
          const guestCompare = Array.isArray(State.comparisonList) ? State.comparisonList.map(s => s.id) : [];
          const allGuestIds = Array.from(new Set([...guestBookmarks, ...guestCompare].filter(Boolean)));
          if (allGuestIds.length > 0 && typeof Modals !== 'undefined' && Modals.openGuestImportModal) {
            Modals.openGuestImportModal({
              schoolIds: allGuestIds,
              user: res.user,
              redirectView: 'parents'
            });
          } else {
            App.navigate('parents');
          }
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
