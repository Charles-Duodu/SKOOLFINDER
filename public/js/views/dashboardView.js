/**
 * SkoolFinder Ghana - School Owner Lead Analytics Portal
 */
const DashboardView = {
  async render(schoolId = 'sch-gis-accra') {
    const school = (await API.getSchoolById(schoolId)) || {};
    const analytics = (await API.getSchoolAnalytics(schoolId)) || { views: 0, whatsappClicks: 0, phoneCalls: 0, applications: 0 };
    const allSchools = (await API.getSchools()) || [];
    const rawApps = await API.getSchoolApplications(schoolId);
    const applications = Array.isArray(rawApps) ? rawApps : [];
    const reviewsData = (await API.getSchoolReviews(schoolId)) || {};
    const reviews = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];
    const ratingSummary = reviewsData.summary || { averageOverall: 5.0, totalReviews: 0 };
    const inqStats = (await API.getInquiryStats(schoolId)) || { total: 0, pending: 0, replied: 0, tours: 0 };
    const schoolInvoices = (await API.getInvoices({ schoolId })) || [];
    const totalBilled = schoolInvoices.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);
    const totalCollected = schoolInvoices.reduce((acc, i) => acc + (Number(i.amountPaid) || 0), 0);
    const totalOutstandingFees = schoolInvoices.reduce((acc, i) => acc + (Number(i.balanceDue) || 0), 0);
    const feeCollectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
    const smsLogs = (await API.getSMSLogs({ schoolId })) || [];
    const creditsData = (await API.getSMSCredits(schoolId)) || {};
    const smsCredits = creditsData.credits || 4850;
    const reportCards = (await API.getReportCards({ schoolId })) || [];
    const totalReportCards = Array.isArray(reportCards) ? reportCards.length : 0;
    const classAvgOverall = (Array.isArray(reportCards) && reportCards.length > 0) ? (reportCards.reduce((acc, r) => acc + (r.overallAverage || 0), 0) / reportCards.length).toFixed(1) : '82.4';
    const transportRoutes = (await API.getTransportRoutes({ schoolId })) || [];
    const activeBusesEnRoute = transportRoutes.filter(r => (r.status || '').includes('Transit') || (r.status || '').includes('Delayed') || (r.status || '').includes('Schedule')).length;
    const totalTransportPupils = transportRoutes.reduce((acc, r) => acc + (r.enrolledStudents || 28), 0);
    const totalFleetCapacity = transportRoutes.reduce((acc, r) => acc + (r.busCapacity || 30), 0);
    const clubs = (await API.getClubs({ schoolId })) || [];
    const totalClubEnrollments = clubs.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
    const totalClubRevenue = clubs.reduce((acc, c) => acc + ((c.enrolledCount || 0) * (c.termFeeGHS || 0)), 0);
    const totalCompetitionsScheduled = clubs.reduce((acc, c) => acc + ((c.competitions || []).length), 0);
    const alumniList = (await API.getAlumni({ schoolId })) || [];
    const totalAlumniMentors = alumniList.length;
    const totalAlumniSessions = alumniList.reduce((acc, a) => acc + (a.sessionsCompleted || 0), 0);
    const alumniBookings = (await API.getAlumniBookings({})) || [];
    const medicalRecords = (await API.getMedicalRecords({ schoolId })) || [];
    const sickbayLogs = (await API.getSickbayLogs({ schoolId })) || [];
    const totalAllergyAlerts = medicalRecords.filter(m => (m.allergies || []).length > 0).length || 48;
    const totalVisitsToday = sickbayLogs.filter(l => (l.date || '').toLowerCase().includes('today')).length || sickbayLogs.length;
    const libraryBooks = (await API.getLibraryBooks({ schoolId })) || [];
    const libraryLoans = (await API.getLibraryLoans({ schoolId })) || [];
    const totalBooksCataloged = libraryBooks.reduce((acc, b) => acc + (b.totalCopies || 0), 0) || 580;
    const activeBorrowersCount = libraryLoans.filter(l => l.status === 'Active Loan' || l.status === 'Overdue').length || 12;
    const overdueLoansCount = libraryLoans.filter(l => l.status === 'Overdue' || (l.fineDueGHS && l.fineDueGHS > 0)).length;
    const digitalIDs = (await API.getStudentDigitalIDs(schoolId)) || [];
    const schoolRfqs = (await API.getRFQs(schoolId)) || [];
    const teacherApps = (await API.getTeacherApplications(schoolId)) || [];

    const totalApps = applications.length;
    const receivedApps = applications.filter(a => a.status === 'Received').length;
    const examScheduledApps = applications.filter(a => a.status === 'Exam Scheduled').length;
    const admittedApps = applications.filter(a => a.status === 'Admitted').length;
    const enrolledApps = applications.filter(a => a.status === 'Enrolled').length;

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Dashboard Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #f3e8ff; border: 1px solid #ddd6fe; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b21a8; margin-bottom: 0.75rem;">
                <span>🏫</span> SkoolFinder Campus • School Management OS (/schools)
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.4rem 0;">
                ${school.name}
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">
                📍 ${school.suburb}, ${school.region} &nbsp;|&nbsp; 
                <span class="badge badge-admissions">${school.packageTier} Partner Tier</span> &nbsp;|&nbsp;
                <span class="badge badge-emerald">NaSIA Verified 🛡️</span>
              </p>
            </div>

            <!-- Portal Cross-Actions & Switcher -->
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-pill btn-emerald" onclick="App.navigate('teachers')" style="font-size: 0.82rem;">
                <span>🧑‍🏫</span> Recruit Teachers (/teachers)
              </button>
              <button class="btn-pill btn-gold" onclick="App.navigate('suppliers')" style="font-size: 0.82rem;">
                <span>📦</span> Post RFQ (/suppliers)
              </button>
              <button class="btn-pill btn-outline" onclick="Modals.openListSchoolModal()" style="font-size: 0.82rem; background: #fff;">
                <span>➕</span> List New Campus
              </button>
              <div style="display: flex; align-items: center; gap: 0.5rem; background: #fff; padding: 0.35rem 0.65rem; border-radius: 999px; border: 1px solid var(--border-light);">
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">Campus:</span>
                <select id="dash-school-select" class="form-select" style="width: auto; padding: 0.2rem 1.5rem 0.2rem 0.5rem; font-size: 0.82rem; border: none; background-color: transparent;">
                  ${allSchools.map(s => `<option value="${s.id}" ${s.id === school.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          ${school.subscriptionStatus === 'active' || school.trialStatus === 'converted_to_paid' ? `
            <!-- Active SaaS License Banner -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: var(--radius-xl); padding: 1.25rem 1.75rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.12);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2.2rem; background: #ffffff; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                  🛡️
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 1.1rem; color: #166534;">
                    🟢 Active ${school.packageTier || 'SaaS Growth'} License (${school.billingCycle ? school.billingCycle.toUpperCase() : 'MONTHLY'})
                  </div>
                  <div style="font-size: 0.84rem; color: #15803d; margin-top: 0.2rem;">
                    Institutional tier active. Renews on <strong>${school.subscriptionExpiresAt ? new Date(school.subscriptionExpiresAt).toLocaleDateString('en-GB') : 'Active'}</strong> via Paystack Mobile Money.
                  </div>
                </div>
              </div>
              <button class="btn-pill btn-outline" id="btn-manage-subscription" style="font-weight: 700; font-size: 0.85rem; padding: 0.6rem 1.25rem; color: #166534; border-color: #22c55e; background: #ffffff;">
                <span>⚙️</span> Upgrade / Renewal Options
              </button>
            </div>
          ` : (school.status === 'active_trial' || school.trialEndsAt ? `
            <!-- 14-Day Free SaaS Trial Notification -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border: 2px solid #f59e0b; border-radius: var(--radius-xl); padding: 1.25rem 1.75rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2.2rem;">⏳</div>
                <div>
                  <div style="font-weight: 800; font-size: 1.05rem; color: #92400e;">
                    14-Day Free SaaS Trial Active (${Math.max(1, Math.ceil((new Date(school.trialEndsAt || Date.now() + 14 * 86400000) - new Date()) / 86400000))} Days Remaining)
                  </div>
                  <div style="font-size: 0.84rem; color: #b45309; margin-top: 0.2rem;">
                    Operating with <strong>${school.packageTier || 'SaaS Starter'}</strong>. Select your production tier below to lock in uninterrupted service.
                  </div>
                </div>
              </div>
              <button class="btn-pill btn-gold" id="btn-choose-plan" style="font-weight: 700; font-size: 0.85rem; padding: 0.6rem 1.2rem;">
                <span>⚡</span> Choose Plan (Starter / Growth / Enterprise)
              </button>
            </div>
          ` : '')}

          <!-- Value Proposition Banner (Why Lead Analytics Matter) -->
          <div style="background: var(--gradient-navy); border-radius: var(--radius-xl); padding: 2rem; color: #ffffff; margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
            <div style="max-width: 650px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase; margin-bottom: 0.25rem;">
                ADMISSIONS ROI & CONVERSIONS
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">
                Direct Parent Inquiries Logged in Real-Time
              </h3>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6;">
                Every time a prospective parent clicks "Reveal WhatsApp" or "Call Admissions", an event is tracked. This gives your school board exact transparency on your return on investment.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
              <span class="badge badge-tier-premium" style="padding: 0.6rem 1.25rem; font-size: 0.85rem;">
                ⭐ Premium Search Placement Active
              </span>
              <button id="btn-export-leads-csv" class="btn-pill btn-outline" style="color: #fff; border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1); font-size: 0.82rem;">
                📥 Export Leads (CSV)
              </button>
            </div>
          </div>

          <!-- 3-Column Analytics Grid -->
          <div class="dashboard-grid" style="margin-bottom: 2.5rem;">
            <!-- Metric 1: Total Views -->
            <div class="analytics-stat-card">
              <div class="stat-icon-wrap stat-icon-views">
                👁️
              </div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Parent Profile Views
                </div>
                <div style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900);">
                  ${analytics.totalViews}
                </div>
                <div style="font-size: 0.78rem; color: var(--emerald-600); font-weight: 600;">
                  ↑ 24% more than district average
                </div>
              </div>
            </div>

            <!-- Metric 2: WhatsApp Reveals -->
            <div class="analytics-stat-card">
              <div class="stat-icon-wrap stat-icon-wa">
                💬
              </div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  WhatsApp Inquiries
                </div>
                <div style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--whatsapp-green);">
                  ${analytics.whatsappReveals}
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  Direct chats to admissions desk
                </div>
              </div>
            </div>

            <!-- Metric 3: Calls Logged -->
            <div class="analytics-stat-card">
              <div class="stat-icon-wrap stat-icon-calls">
                📞
              </div>
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Phone Calls Initiated
                </div>
                <div style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--gold-600);">
                  ${analytics.callClicks}
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  Inbound admissions inquiries
                </div>
              </div>
            </div>
          </div>

          <!-- FEATURE 1: DIGITAL ADMISSIONS DESK & STUDENT ENROLLMENT PIPELINE -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <span class="badge" style="background: #e0f2fe; color: #0284c7; font-weight: 700; margin-bottom: 0.35rem;">
                  📝 Feature #1: Digital Admissions Management
                </span>
                <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--primary-900); font-weight: 800; margin-top: 0.25rem;">
                  Admissions Desk & Student Enrollment Pipeline
                </h2>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
                  Process inbound parent applications, schedule candidate entrance assessments, review dossiers, and issue official admission offer letters.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-pipeline-export-csv" class="btn-pill btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  <span>📥</span> Export Roster (CSV)
                </button>
                <button id="btn-dash-new-application" class="btn-pill" style="font-size: 0.85rem; padding: 0.5rem 1.15rem; background: var(--gradient-navy); color: #fff; font-weight: 700; border: none; cursor: pointer;">
                  <span>+</span> New Applicant Entry
                </button>
              </div>
            </div>

            <!-- Pipeline Metrics Strip -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
              <div class="pipeline-stat-card" data-filter="All" style="background: var(--bg-main); border: 1.5px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Applicants</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--primary-900);" id="stat-total-apps">${totalApps}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">All submissions</div>
              </div>

              <div class="pipeline-stat-card" data-filter="Received" style="background: #fefce8; border: 1.5px solid #fef08a; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #854d0e; text-transform: uppercase;">Pending Review</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #a16207;" id="stat-received-apps">${receivedApps}</div>
                <div style="font-size: 0.72rem; color: #854d0e;">Received files</div>
              </div>

              <div class="pipeline-stat-card" data-filter="Exam Scheduled" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #1e40af; text-transform: uppercase;">Exam Scheduled</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #2563eb;" id="stat-exam-apps">${examScheduledApps}</div>
                <div style="font-size: 0.72rem; color: #1e40af;">Testing queued</div>
              </div>

              <div class="pipeline-stat-card" data-filter="Admitted" style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #15803d; text-transform: uppercase;">Offer Extended</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #16a34a;" id="stat-admitted-apps">${admittedApps}</div>
                <div style="font-size: 0.72rem; color: #15803d;">Admitted status</div>
              </div>

              <div class="pipeline-stat-card" data-filter="Enrolled" style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #7e22ce; text-transform: uppercase;">Enrolled & Active</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #9333ea;" id="stat-enrolled-apps">${enrolledApps}</div>
                <div style="font-size: 0.72rem; color: #7e22ce;">Fees committed</div>
              </div>
            </div>

            <!-- Pipeline Filter Tabs & Search Controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="pipeline-filter-tabs">
                <button class="pipeline-tab active" data-status="All" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 700; border: 1px solid var(--border-light); background: var(--primary-900); color: #fff; cursor: pointer;">All (${totalApps})</button>
                <button class="pipeline-tab" data-status="Received" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">Received (${receivedApps})</button>
                <button class="pipeline-tab" data-status="Exam Scheduled" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">Exam Scheduled (${examScheduledApps})</button>
                <button class="pipeline-tab" data-status="Admitted" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">Admitted (${admittedApps})</button>
                <button class="pipeline-tab" data-status="Enrolled" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">Enrolled (${enrolledApps})</button>
              </div>

              <div style="position: relative; min-width: 260px;">
                <input type="text" id="pipeline-search-input" class="form-input" placeholder="🔍 Search applicant, code, parent..." style="font-size: 0.85rem; padding: 0.45rem 0.85rem 0.45rem 1rem; border-radius: var(--radius-full);" />
              </div>
            </div>

            <!-- Applications Table Container -->
            <div style="overflow-x: auto; border: 1px solid var(--border-light); border-radius: var(--radius-lg);">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                <thead style="background: var(--bg-main); border-bottom: 1.5px solid var(--border-light); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
                  <tr>
                    <th style="padding: 0.85rem 1rem;">Tracking Code</th>
                    <th style="padding: 0.85rem 1rem;">Student Candidate</th>
                    <th style="padding: 0.85rem 1rem;">Grade / Curriculum</th>
                    <th style="padding: 0.85rem 1rem;">Parent / Guardian</th>
                    <th style="padding: 0.85rem 1rem;">Status & Assessment</th>
                    <th style="padding: 0.85rem 1rem; text-align: right;">Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody id="pipeline-table-body">
                  <!-- Populated dynamically via JS -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- FEATURE 3: DIRECT ADMISSIONS INQUIRIES & PARENT MESSAGING CENTER -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);" id="inquiries-desk-section">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <span class="badge" style="background: #e0f2fe; color: #0284c7; font-weight: 700; margin-bottom: 0.35rem;">
                  📬 Feature #3: School-to-Parent Messaging
                </span>
                <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--primary-900); font-weight: 800; margin-top: 0.25rem;">
                  Admissions Inquiries & Parent Messaging Center
                </h2>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.25rem;">
                  Manage direct inquiries from prospective parents, confirm guided campus walkthroughs, provide fee schedules, and dispatch official replies.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-inquiries-export-csv" class="btn-pill btn-outline" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  <span>📥</span> Export Inquiries (CSV)
                </button>
                <button id="btn-dash-new-inquiry" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.5rem 1.15rem; font-weight: 700;">
                  <span>+</span> Log Inbound Inquiry
                </button>
              </div>
            </div>

            <!-- Inquiries Metric Counters Strip -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
              <div class="inquiry-stat-card" data-filter="All" style="background: var(--bg-main); border: 1.5px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Inquiries</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: var(--primary-900);" id="stat-inq-total">${inqStats.total}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">All inquiry threads</div>
              </div>

              <div class="inquiry-stat-card" data-filter="Unread" style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #991b1b; text-transform: uppercase;">🔴 Unread / Attention</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #dc2626;" id="stat-inq-unread">${inqStats.unread}</div>
                <div style="font-size: 0.72rem; color: #b91c1c;">Pending school reply</div>
              </div>

              <div class="inquiry-stat-card" data-filter="Tour Requested" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #1e40af; text-transform: uppercase;">📅 Tour Requests</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #2563eb;" id="stat-inq-tour">${inqStats.tourRequests}</div>
                <div style="font-size: 0.72rem; color: #3b82f6;">Campus visit bookings</div>
              </div>

              <div class="inquiry-stat-card" data-filter="Replied" style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase;">🟢 Replied / Scheduled</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #16a34a;" id="stat-inq-replied">${inqStats.replied}</div>
                <div style="font-size: 0.72rem; color: #15803d;">Active consultations</div>
              </div>

              <div class="inquiry-stat-card" data-filter="Resolved" style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: var(--radius-md); padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #6b21a8; text-transform: uppercase;">🟣 Resolved</div>
                <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; color: #9333ea;" id="stat-inq-resolved">${inqStats.resolved}</div>
                <div style="font-size: 0.72rem; color: #7e22ce;">Concluded discussions</div>
              </div>
            </div>

            <!-- Inquiries Search and Filter Tabs -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="inquiries-tabs-container">
                <button class="inquiry-tab active" data-status="All" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 700; border: 1px solid var(--border-light); background: var(--primary-900); color: #fff; cursor: pointer;">
                  All Inquiries
                </button>
                <button class="inquiry-tab" data-status="Unread" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">
                  Unread (${inqStats.unread})
                </button>
                <button class="inquiry-tab" data-status="Tour Requested" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">
                  Campus Tours (${inqStats.tourRequests})
                </button>
                <button class="inquiry-tab" data-status="Replied" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">
                  Replied / Scheduled
                </button>
                <button class="inquiry-tab" data-status="Resolved" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">
                  Resolved
                </button>
              </div>

              <!-- Search Filter Input -->
              <div style="position: relative; min-width: 260px;">
                <input type="text" id="inquiries-search-input" class="form-input" placeholder="Search parent, student, code..." style="padding-left: 2.2rem; font-size: 0.85rem; height: 38px;" />
                <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.9rem; color: var(--text-light);">🔍</span>
              </div>
            </div>

            <!-- Inquiries Roster Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: var(--bg-main); border-bottom: 2px solid var(--border-light); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em;">
                    <th style="padding: 0.85rem 1rem;">Reference Code</th>
                    <th style="padding: 0.85rem 1rem;">Inquiring Parent</th>
                    <th style="padding: 0.85rem 1rem;">Candidate & Grade</th>
                    <th style="padding: 0.85rem 1rem;">Subject & Category</th>
                    <th style="padding: 0.85rem 1rem;">Thread Status</th>
                    <th style="padding: 0.85rem 1rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody id="inquiries-table-body">
                  <!-- Populated dynamically via JS -->
                </tbody>
              </table>
            </div>
          </div>

          
          <!-- FEATURE 6: Digital School Fee Invoicing & MoMo Bursary Hub -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 800;">
                    🇬🇭 AUTOMATED BURSARY & MOMO GATEWAY
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Bank of Ghana / GhIPSS Compliant</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  Student Fee Invoicing & Mobile Money Collections
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                  Issue termly fee schedules, accept instant MTN MoMo & Telecel Cash deposits, and send automated SMS receipt passes.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-dash-issue-invoice" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
                  <span>➕</span> Issue Student Fee Bill
                </button>
              </div>
            </div>

            <!-- 4-Stat Ribbon for Bursary -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Term Billed</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--primary-900);">
                  GH₵ ${totalBilled.toLocaleString()}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${schoolInvoices.length} Active student accounts</div>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase;">Collected via MoMo/Bank</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #15803d;">
                  GH₵ ${totalCollected.toLocaleString()}
                </div>
                <div style="font-size: 0.75rem; color: #16a34a; font-weight: 600;">✓ Instant settlement to school account</div>
              </div>

              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #991b1b; text-transform: uppercase;">Outstanding Balances</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #dc2626;">
                  GH₵ ${totalOutstandingFees.toLocaleString()}
                </div>
                <div style="font-size: 0.75rem; color: #b91c1c; font-weight: 600;">Pending parent installments</div>
              </div>

              <div style="background: linear-gradient(135deg, var(--primary-900) 0%, #1e3a8a 100%); color: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase;">Collection Efficiency</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #ffffff;">
                  ${feeCollectionRate}%
                </div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.85);">Term 1 target: 85% by mid-term</div>
              </div>
            </div>

            <!-- Invoices Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: var(--bg-main); border-bottom: 2px solid var(--border-light); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em;">
                    <th style="padding: 0.85rem 1rem;">Invoice #</th>
                    <th style="padding: 0.85rem 1rem;">Student Candidate</th>
                    <th style="padding: 0.85rem 1rem;">Parent / Phone</th>
                    <th style="padding: 0.85rem 1rem;">Total Bill</th>
                    <th style="padding: 0.85rem 1rem;">Paid (GH₵)</th>
                    <th style="padding: 0.85rem 1rem;">Balance Due</th>
                    <th style="padding: 0.85rem 1rem;">Status</th>
                    <th style="padding: 0.85rem 1rem; text-align: right;">Bursary Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${schoolInvoices.map(inv => {
                    const statusClass = inv.status === 'Paid' ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : (inv.status === 'Partially Paid' ? 'background: #fef3c7; color: #92400e; border: 1px solid #fde68a;' : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;');
                    return `
                      <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 1rem; font-family: monospace; font-weight: 700; color: var(--primary-900);">
                          ${inv.invoiceNumber}
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 700; color: var(--primary-900);">${inv.studentName}</div>
                          <div style="font-size: 0.78rem; color: var(--text-muted);">${inv.studentGrade}</div>
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 600;">${inv.parentName}</div>
                          <div style="font-size: 0.78rem; color: var(--text-muted);">${inv.parentPhone}</div>
                        </td>
                        <td style="padding: 1rem; font-weight: 600;">
                          GH₵ ${Number(inv.totalAmount).toLocaleString()}
                        </td>
                        <td style="padding: 1rem; color: var(--emerald-600); font-weight: 700;">
                          GH₵ ${Number(inv.amountPaid).toLocaleString()}
                        </td>
                        <td style="padding: 1rem; font-weight: 800; color: ${inv.balanceDue > 0 ? 'var(--rose-600)' : 'var(--emerald-600)'};">
                          GH₵ ${Number(inv.balanceDue).toLocaleString()}
                        </td>
                        <td style="padding: 1rem;">
                          <span class="badge" style="${statusClass} font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 9999px;">
                            ${inv.status}
                          </span>
                        </td>
                        <td style="padding: 1rem; text-align: right;">
                          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
                            ${inv.balanceDue > 0 ? `
                              <button class="btn-pill btn-outline btn-dash-pay-fee" data-invid="${inv.id}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                                💳 Log Payment
                              </button>
                              <button class="btn-pill btn-secondary btn-dash-send-reminder" data-parent="${inv.parentName}" data-phone="${inv.parentPhone}" data-balance="${inv.balanceDue}" data-invnum="${inv.invoiceNumber}" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                                📱 SMS Reminder
                              </button>
                            ` : `
                              <span style="font-size: 0.8rem; color: var(--emerald-600); font-weight: 700; padding: 0.35rem 0.5rem;">
                                ✓ Fully Cleared
                              </span>
                            `}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          
          <!-- FEATURE 7: Automated SMS & WhatsApp Parent Communications Hub -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span class="badge" style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-weight: 800;">
                    📲 HUBTEL & ARKESEL GHANA SMS GATEWAY
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">High-Throughput Parent Dispatch</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  Automated SMS & WhatsApp Parent Communications
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                  Dispatch instant admissions notices, entrance assessment passes, MoMo fee receipts, and bulk school announcements across all Ghana mobile networks.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-dash-open-send-sms" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
                  <span>📨</span> Send Parent SMS
                </button>
                <button id="btn-dash-open-broadcast" class="btn-pill btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem; background: #be123c; color: #fff;">
                  <span>📢</span> Broadcast Announcement
                </button>
              </div>
            </div>

            <!-- 4-Stat Ribbon for Gateway -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase;">Gateway Balance</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #15803d;">
                  ${smsCredits.toLocaleString()} Units
                </div>
                <div style="font-size: 0.75rem; color: #16a34a; font-weight: 600;">🟢 Active (Auto-replenish enabled)</div>
              </div>

              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Delivery Success Rate</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--primary-900);">
                  99.8%
                </div>
                <div style="font-size: 0.75rem; color: var(--emerald-600); font-weight: 600;">MTN / Telecel / AT Ghana</div>
              </div>

              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Dispatched to Date</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--primary-900);">
                  ${smsLogs.length} Messages
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Admissions, receipts & alerts</div>
              </div>

              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase;">Alpha Sender ID</div>
                <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #ffffff;">
                  GIS-ACCRA
                </div>
                <div style="font-size: 0.75rem; color: var(--emerald-400); font-weight: 600;">✓ NCA Verified & Registered</div>
              </div>
            </div>

            <!-- SMS Logs Roster Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: var(--bg-main); border-bottom: 2px solid var(--border-light); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em;">
                    <th style="padding: 0.85rem 1rem;">Timestamp</th>
                    <th style="padding: 0.85rem 1rem;">Recipient & Mobile</th>
                    <th style="padding: 0.85rem 1rem;">Category</th>
                    <th style="padding: 0.85rem 1rem;">Network Gateway</th>
                    <th style="padding: 0.85rem 1rem;">Message Preview</th>
                    <th style="padding: 0.85rem 1rem; text-align: right;">Carrier Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${smsLogs.map(log => {
                    const timeStr = log.deliveryTime ? new Date(log.deliveryTime).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                      <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 1rem; font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">
                          ${timeStr}
                        </td>
                        <td style="padding: 1rem;">
                          <div style="font-weight: 700; color: var(--primary-900);">${log.recipientName}</div>
                          <div style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">${log.recipientPhone}</div>
                        </td>
                        <td style="padding: 1rem;">
                          <span class="badge" style="background: var(--primary-50); color: var(--primary-800); border: 1px solid var(--primary-200); font-size: 0.75rem; font-weight: 700;">
                            ${log.category}
                          </span>
                        </td>
                        <td style="padding: 1rem; font-size: 0.82rem; font-weight: 600;">
                          ${log.network}
                          <div style="font-size: 0.72rem; color: var(--text-muted);">${log.channel}</div>
                        </td>
                        <td style="padding: 1rem; max-width: 320px;">
                          <div style="font-size: 0.82rem; color: var(--text-dark); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${log.messageText}
                          </div>
                        </td>
                        <td style="padding: 1rem; text-align: right;">
                          <span class="badge" style="background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-weight: 800; font-size: 0.75rem; padding: 0.3rem 0.65rem; border-radius: 9999px;">
                            ✓ ${log.status}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- FEATURE 9: Academic Assessment & Digital Gradebook Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 800;">
                    📊 GES & CAMBRIDGE DIGITAL GRADEBOOK
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Terminal Reports & Continuous Assessment</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  Academic Assessment & Digital Gradebook Console
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                  Track 30% Continuous Assessment (classwork, projects) + 70% Terminal Exams, calculate class ranks, endorse official headmaster remarks, and dispatch instant certified PDF report cards to parents.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-dash-broadcast-reports-sms" class="btn-pill btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem; background: #059669; color: #fff;">
                  <span>📲</span> Alert Parents (Reports Ready SMS)
                </button>
              </div>
            </div>

            <!-- 4-Stat Ribbon for Gradebook -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #1e40af; text-transform: uppercase;">Certified Student Reports</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #1e3a8a;">
                  ${totalReportCards} Enrolled Pupils
                </div>
                <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Primary & Lower Secondary</div>
              </div>

              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Overall Cohort Average</div>
                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #059669;">
                  ${classAvgOverall}% Mean
                </div>
                <div style="font-size: 0.75rem; color: var(--emerald-600); font-weight: 600;">Grade A / Distinction Band</div>
              </div>

              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Assessment Formula</div>
                <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--primary-900);">
                  30% CA + 70% Exam
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">NaSIA / GES Standard Rubric</div>
              </div>

              <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--gold-300); text-transform: uppercase;">Principal Certification</div>
                <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #ffffff;">
                  100% Certified
                </div>
                <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 600;">✓ Official Seal & Watermark Stamped</div>
              </div>
            </div>

            <!-- Gradebook Student Roster Table -->
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: var(--bg-main); border-bottom: 2px solid var(--border-light); font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em;">
                    <th style="padding: 0.85rem 1rem;">Student Details</th>
                    <th style="padding: 0.85rem 1rem;">Class & Stream</th>
                    <th style="padding: 0.85rem 1rem; text-align: center;">Class Rank</th>
                    <th style="padding: 0.85rem 1rem; text-align: center;">Attendance</th>
                    <th style="padding: 0.85rem 1rem; text-align: center;">Aggregate Score</th>
                    <th style="padding: 0.85rem 1rem; text-align: center;">Average & Grade</th>
                    <th style="padding: 0.85rem 1rem; text-align: right;">Certification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportCards.map(rc => `
                    <tr style="border-bottom: 1px solid var(--border-light);">
                      <td style="padding: 1rem;">
                        <div style="font-weight: 700; color: var(--primary-900); font-size: 0.95rem;">${rc.studentName}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">${rc.studentId}</div>
                      </td>
                      <td style="padding: 1rem;">
                        <div style="font-weight: 600; color: var(--primary-900);">${rc.studentGrade}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${rc.term}</div>
                      </td>
                      <td style="padding: 1rem; text-align: center;">
                        <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; border: 1px solid #fde68a;">
                          ⭐ ${rc.positionInClass}
                        </span>
                      </td>
                      <td style="padding: 1rem; text-align: center; font-size: 0.85rem;">
                        <strong>${rc.attendance?.timesPresent || 59}</strong> / ${rc.attendance?.timesSchoolOpened || 60} Days
                      </td>
                      <td style="padding: 1rem; text-align: center; font-weight: 700; color: #1e3a8a;">
                        ${rc.overallTotalMarks} <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 400;">/ ${rc.overallMaxMarks}</span>
                      </td>
                      <td style="padding: 1rem; text-align: center;">
                        <div style="font-weight: 800; color: #059669; font-size: 1.05rem;">${rc.overallAverage}%</div>
                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; padding: 0.15rem 0.45rem;">
                          Grade ${rc.overallGrade}
                        </span>
                      </td>
                      <td style="padding: 1rem; text-align: right;">
                        <div style="display: flex; gap: 0.45rem; justify-content: flex-end;">
                          <button class="btn-pill btn-outline btn-dash-view-rc" data-rcid="${rc.id}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                            📄 View Stamped Report
                          </button>
                          <button class="btn-pill btn-gold btn-dash-edit-rc" data-rcid="${rc.id}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
                            ✏️ Edit Grades
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- FEATURE 10: School Fleet Transport & Live Bus Operations Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span class="badge" style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-weight: 800;">
                    🚌 GHANA MoT & DVLA CERTIFIED FLEET CONSOLE
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Real-Time School Bus Operations</span>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                  School Fleet Transport & Live Bus Operations Console
                </h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                  Monitor live school bus runs across Accra, Tema, and Kumasi, verify certified DVLA Class F drivers and chaperones, and dispatch 1-click emergency traffic delay broadcasts directly to parents.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="btn-dash-fleet-emergency-alert" class="btn-pill" style="background: #b91c1c; color: #ffffff; font-weight: 700; border: none; padding: 0.55rem 1.15rem; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 10px rgba(185, 28, 28, 0.25);">
                  <span>🚨</span> Broadcast Fleet Delay SMS
                </button>
              </div>
            </div>

            <!-- Fleet Metrics Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Active Routes</div>
                <div style="font-size: 1.65rem; font-weight: 800; color: var(--primary-900); line-height: 1.2;">
                  ${transportRoutes.length} Corridors
                </div>
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">East Legon, Airport, Spintex</div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Fleet Occupancy</div>
                <div style="font-size: 1.65rem; font-weight: 800; color: var(--primary-900); line-height: 1.2;">
                  ${totalTransportPupils} / ${totalFleetCapacity}
                </div>
                <div style="font-size: 0.72rem; color: #2563eb; font-weight: 600;">91.3% Bus Capacity Active</div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Live Vehicles En Route</div>
                <div style="font-size: 1.65rem; font-weight: 800; color: #059669; line-height: 1.2;">
                  ${activeBusesEnRoute} Shuttles
                </div>
                <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Morning Pickup Run Active</div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Certified Crew</div>
                <div style="font-size: 1.65rem; font-weight: 800; color: var(--primary-900); line-height: 1.2;">
                  ${transportRoutes.length * 2} Personnel
                </div>
                <div style="font-size: 0.72rem; color: #6366f1; font-weight: 600;">DVLA Drivers & Matrons</div>
              </div>
            </div>

            <!-- Fleet Route Operations Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
              ${transportRoutes.map(route => {
                const isDelayed = (route.status || '').includes('Delayed');
                const isTransit = (route.status || '').includes('Transit') || (route.status || '').includes('Schedule');
                const curStop = route.stops[route.currentStopIndex] || route.stops[0];

                return `
                  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem;">
                        <div>
                          <span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; font-size: 0.75rem;">
                            ${route.routeNumber}
                          </span>
                          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--primary-900); margin: 0.35rem 0 0 0;">
                            ${route.name}
                          </h4>
                          <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.15rem;">
                            Plate: <strong>${route.busPlate}</strong> • ${route.busModel}
                          </div>
                        </div>

                        <span class="badge" style="background: ${isDelayed ? '#fef2f2' : '#ecfdf5'}; color: ${isDelayed ? '#991b1b' : '#065f46'}; border: 1px solid ${isDelayed ? '#fecaca' : '#a7f3d0'}; font-weight: 800; font-size: 0.78rem; padding: 0.3rem 0.65rem;">
                          ● ${route.status}
                        </span>
                      </div>

                      <!-- Current Stop Highlight -->
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem;">
                        <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Current Active Landmark</div>
                        <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem; margin-top: 0.2rem;">
                          📍 ${curStop.name}
                        </div>
                        <div style="font-size: 0.75rem; color: #475569; margin-top: 0.15rem;">
                          Scheduled: <strong>${curStop.scheduledTime}</strong> • Landmark: ${curStop.landmark}
                        </div>
                        ${isDelayed ? `<div style="font-size: 0.75rem; color: #b91c1c; font-weight: 700; margin-top: 0.35rem;">⚠️ Delay: ${route.delayReason}</div>` : ''}
                      </div>

                      <!-- Driver & Crew Card -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.78rem; color: #475569; margin-bottom: 1.25rem;">
                        <div style="background: #f1f5f9; padding: 0.65rem; border-radius: 8px;">
                          <div style="font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Driver</div>
                          <div style="font-weight: 700; color: #0f172a;">👨🏿‍✈️ ${route.driver?.name}</div>
                          <div>${route.driver?.phone}</div>
                        </div>

                        <div style="background: #f1f5f9; padding: 0.65rem; border-radius: 8px;">
                          <div style="font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Matron</div>
                          <div style="font-weight: 700; color: #0f172a;">👩🏿‍⚕️ ${route.chaperone?.name}</div>
                          <div>${route.chaperone?.phone}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                      <button class="btn-pill btn-outline btn-dash-track-route" data-routeid="${route.id}" style="flex: 1; font-size: 0.78rem; padding: 0.45rem 0.65rem; justify-content: center;">
                        📍 Stop Tracker
                      </button>
                      <button class="btn-pill btn-outline btn-dash-advance-stop" data-routeid="${route.id}" data-currentidx="${route.currentStopIndex}" style="font-size: 0.78rem; padding: 0.45rem 0.65rem; justify-content: center; background: #f8fafc;">
                        🔄 Next Stop
                      </button>
                      <button class="btn-pill btn-dash-broadcast-delay" data-routeid="${route.id}" style="font-size: 0.78rem; padding: 0.45rem 0.85rem; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; font-weight: 700; cursor: pointer;">
                        🚨 Alert Delay SMS
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

          </div>

          <!-- FEATURE 11: Co-Curricular & After-School Clubs Management Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.25rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 1px;">
                  Co-Curricular Academy & Student Enrichment
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                  🥋 Co-Curricular Clubs & Competitive Societies
                </h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                  Oversee robotics lab, national debate society, swimming academy, cadet corps, chess grandmasters, termly club dues, and inter-school fixtures.
                </p>
              </div>

              <!-- Quick stats badges -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #065f46; text-transform: uppercase; font-weight: 700;">Active Societies</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #065f46;">${clubs.length} Clubs</div>
                </div>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #1e40af; text-transform: uppercase; font-weight: 700;">Enrolled Pupils</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #1e40af;">${totalClubEnrollments} Pupils</div>
                </div>
                <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #92400e; text-transform: uppercase; font-weight: 700;">Termly Dues</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #92400e;">GH₵ ${totalClubRevenue.toLocaleString()}</div>
                </div>
                <div style="background: #faf5ff; border: 1px solid #e9d5ff; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #6b21a8; text-transform: uppercase; font-weight: 700;">Fixtures</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #6b21a8;">${totalCompetitionsScheduled} Matches</div>
                </div>
              </div>
            </div>

            <!-- Clubs Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
              ${clubs.map(club => {
                const fillPct = Math.min(100, Math.round((club.enrolledCount / club.capacity) * 100));
                return `
                  <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <div style="width: 46px; height: 46px; border-radius: 12px; background: #ffffff; border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; box-shadow: var(--shadow-sm);">
                            ${club.icon}
                          </div>
                          <div>
                            <span class="badge" style="background: #e2e8f0; color: #334155; font-size: 0.7rem; font-weight: 700;">
                              ${club.category}
                            </span>
                            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--primary-900); margin: 0.2rem 0 0 0;">
                              ${club.name}
                            </h4>
                          </div>
                        </div>

                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.72rem; font-weight: 800;">
                          GH₵ ${club.termFeeGHS}/term
                        </span>
                      </div>

                      <p style="font-size: 0.84rem; color: #475569; margin: 0.5rem 0 0.85rem 0; line-height: 1.45;">
                        ${club.tagline}
                      </p>

                      <!-- Key Specs -->
                      <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 0.85rem; margin-bottom: 1rem; font-size: 0.78rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                          <span style="color: #64748b;">Patron:</span>
                          <span style="font-weight: 700; color: var(--primary-900);">${club.patron?.name}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                          <span style="color: #64748b;">Schedule:</span>
                          <span style="font-weight: 700; color: #0f766e;">🗓️ ${club.meetingSchedule}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                          <span style="color: #64748b;">Venue:</span>
                          <span style="font-weight: 700; color: #475569;">📍 ${club.venue}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem;">
                          <span style="color: #64748b;">Roster Fill:</span>
                          <span style="font-weight: 800; color: ${fillPct > 85 ? '#b91c1c' : '#047857'};">${club.enrolledCount} / ${club.capacity} (${fillPct}%)</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 9999px; margin-top: 0.4rem; overflow: hidden;">
                          <div style="width: ${fillPct}%; height: 100%; background: ${fillPct > 85 ? '#ef4444' : '#10b981'}; border-radius: 9999px;"></div>
                        </div>
                      </div>

                      <!-- Key Pupil Sample -->
                      <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 1rem;">
                        <div style="font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Sample Enrolled Pupils:</div>
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                          ${(club.roster || []).slice(0, 2).map(r => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                              <span style="font-weight: 700; color: var(--primary-900);">${r.studentName} <span style="font-size: 0.7rem; color: #64748b;">(${r.gradeLevel})</span></span>
                              <div style="display: flex; align-items: center; gap: 0.35rem;">
                                <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.68rem;">${r.role}</span>
                                <button class="btn-award-merit" data-clubid="${club.id}" data-studentid="${r.studentId}" data-studentname="${r.studentName}" title="Award Achievement Merit Badge" style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 4px; cursor: pointer; padding: 0.15rem 0.35rem; font-size: 0.7rem;">⭐ Award</button>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>

                    <div style="border-top: 1px solid var(--border-light); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                      <button class="btn-pill btn-outline btn-dash-club-fixtures" data-clubid="${club.id}" style="font-size: 0.78rem; padding: 0.45rem 0.85rem;">
                        🏆 Tournaments (${(club.competitions || []).length})
                      </button>
                      <button class="btn-pill btn-primary btn-dash-club-details" data-clubid="${club.id}" style="font-size: 0.78rem; padding: 0.45rem 0.95rem;">
                        Manage Roster &rarr;
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- FEATURE 12: Alumni Relations & Career Guidance Network Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.25rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 1px;">
                  Alumni Relations & Tertiary Pathways
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                  🎓 Alumni Mentorship & Career Guidance Network
                </h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                  Track graduate tertiary placements, coordinate 1-on-1 virtual mentoring sessions, and connect current upper secondary scholars with distinguished global leaders.
                </p>
              </div>

              <!-- Quick stats badges -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #3730a3; text-transform: uppercase; font-weight: 700;">Distinguished Mentors</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #312e81;">${totalAlumniMentors} Mentors</div>
                </div>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #166534; text-transform: uppercase; font-weight: 700;">Sessions Logged</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #15803d;">${totalAlumniSessions} Completed</div>
                </div>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #1e40af; text-transform: uppercase; font-weight: 700;">Global Universities</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #1d4ed8;">Ashesi • Stanford • LSE</div>
                </div>
                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #9d174d; text-transform: uppercase; font-weight: 700;">Active Bookings</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #be185d;">${alumniBookings.length} Scheduled</div>
                </div>
              </div>
            </div>

            <!-- Alumni Mentors Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
              ${alumniList.map(alumnus => `
                <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.35rem; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #ffffff; border: 1px solid var(--border-light); display: flex; align-items: center; justify-content: center; font-size: 1.85rem; box-shadow: var(--shadow-sm);">
                          ${alumnus.avatar || '🎓'}
                        </div>
                        <div>
                          <span class="badge" style="background: #e0e7ff; color: #3730a3; font-size: 0.7rem; font-weight: 700;">
                            ${alumnus.industry}
                          </span>
                          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--primary-900); margin: 0.2rem 0 0 0;">
                            ${alumnus.name}
                          </h4>
                        </div>
                      </div>

                      <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.72rem; font-weight: 800;">
                        ${alumnus.classYear}
                      </span>
                    </div>

                    <div style="font-size: 0.82rem; color: #334155; font-weight: 700; margin-bottom: 0.45rem;">
                      💼 ${alumnus.currentRole} • ${alumnus.company}
                    </div>

                    <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 8px; padding: 0.6rem 0.75rem; font-size: 0.78rem; color: #0284c7; font-weight: 700; margin-bottom: 0.75rem;">
                      🏛️ ${alumnus.tertiaryUniversity}
                    </div>

                    <p style="font-size: 0.82rem; color: #475569; margin: 0 0 0.85rem 0; line-height: 1.45;">
                      ${alumnus.bio.slice(0, 130)}...
                    </p>

                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; margin-bottom: 0.5rem;">
                      <span>⭐ ${alumnus.rating || '4.9'} (${alumnus.sessionsCompleted || 0} Sessions)</span>
                      <span style="color: #059669; font-weight: 700;">● Available</span>
                    </div>
                  </div>

                  <div style="border-top: 1px solid var(--border-light); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <button class="btn-pill btn-outline btn-dash-alumni-profile" data-mentorid="${alumnus.id}" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
                      Full Profile
                    </button>
                    <button class="btn-pill btn-primary btn-dash-alumni-book" data-mentorid="${alumnus.id}" style="font-size: 0.78rem; padding: 0.4rem 0.95rem; font-weight: 800; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);">
                      Schedule Session &rarr;
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Recent Bookings Strip -->
            ${alumniBookings.length > 0 ? `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 0.75rem;">
                  🗓️ Scheduled 1-on-1 Student Guidance Sessions (${alumniBookings.length})
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${alumniBookings.map(b => `
                    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                      <div>
                        <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary-900);">
                          ${b.studentName} <span style="font-size: 0.75rem; color: #64748b;">(${b.gradeLevel})</span> &harr; ${b.mentorName}
                        </div>
                        <div style="font-size: 0.78rem; color: #0284c7; margin-top: 0.15rem;">
                          🗓️ ${b.scheduledDate} at ${b.scheduledTime} • 🎯 ${b.topic}
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 700;">
                          ✓ ${b.status}
                        </span>
                        <a href="${b.meetingLink}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem;">
                          🎥 Meet Link
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- FEATURE 13: Health Sickbay Infirmary & Student Dietary Management Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.25rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🇬🇭</span> GHS & MoH Certified Campus Health Console
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                  🩺 Health Sickbay Infirmary & Student Dietary Safeguards
                </h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                  Manage pupil blood passports (ABO & Sickle Cell Genotype), monitor acute canteen groundnut/peanut allergy red flags, and log registered nurse (Matron) clinical encounters with instant emergency SMS broadcasts.
                </p>
              </div>

              <!-- Action button & Stats -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #065f46; text-transform: uppercase; font-weight: 700;">Health Profiles</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #047857;">1,420 Active</div>
                </div>
                <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #991b1b; text-transform: uppercase; font-weight: 700;">Canteen Allergy Alerts</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #b91c1c;">${totalAllergyAlerts} Red Flags</div>
                </div>
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #1e40af; text-transform: uppercase; font-weight: 700;">Sickbay Cots</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #1d4ed8;">6/8 Available</div>
                </div>

                <button id="btn-dash-log-sickbay" class="btn-pill" style="background: #047857; color: #ffffff; border: none; padding: 0.65rem 1.25rem; font-size: 0.85rem; font-weight: 800; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 10px rgba(4, 120, 87, 0.25);">
                  <span>+</span> Log Sickbay Visit
                </button>
              </div>
            </div>

            <!-- Two-column Grid: Canteen Allergies (Left) & Infirmary Encounters (Right) -->
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; margin-bottom: 1.5rem;">
              
              <!-- Column 1: Canteen Kitchen Dietary Safeguards & High-Risk Pupils -->
              <div style="background: var(--bg-main); border: 1.5px solid #fecaca; border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #b91c1c; text-transform: uppercase; display: flex; align-items: center; gap: 0.35rem;">
                      <span>⚠️</span> Canteen Dietary Alerts & Kitchen Red Flags
                    </div>
                    <span class="badge" style="background: #fee2e2; color: #991b1b; font-size: 0.7rem; font-weight: 800;">
                      Ghana Food Standards
                    </span>
                  </div>

                  <p style="font-size: 0.8rem; color: #7f1d1d; line-height: 1.4; margin: 0 0 1rem 0; background: #fff5f5; padding: 0.6rem 0.75rem; border-radius: 6px; border-left: 3px solid #ef4444;">
                    <strong>Campus Chef Directive:</strong> Severe groundnut / peanut cross-contamination protocol active. Nut-free trays must be dispatched first under supervision.
                  </p>

                  <!-- High Risk Student Records -->
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${medicalRecords.map(m => {
                      const allergyFormatted = (m.allergies || []).map(a => typeof a === 'object' ? `${a.allergen || ''} (${a.severity || ''})` : a).join(', ');
                      const mGrade = m.gradeLevel || m.grade || 'Primary Class';
                      const mDiet = m.dietaryRestrictions || m.dietaryPlan || m.canteenSpecialInstructions || 'Nut-free meal segregation required.';
                      return `
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
                          <div>
                            <div style="display: flex; align-items: center; gap: 0.45rem;">
                              <strong style="color: var(--primary-900); font-size: 0.92rem;">${m.studentName}</strong>
                              <span style="font-size: 0.75rem; color: #64748b;">(${mGrade})</span>
                              <span style="background: #fee2e2; color: #991b1b; font-size: 0.7rem; font-weight: 900; padding: 0.15rem 0.4rem; border-radius: 4px;">
                                ${m.bloodGroup} ${m.genotype}
                              </span>
                            </div>

                            <div style="font-size: 0.78rem; color: #b91c1c; font-weight: 700; margin-top: 0.25rem;">
                              🚨 ${allergyFormatted}
                            </div>

                            <div style="font-size: 0.75rem; color: #475569; margin-top: 0.2rem; line-height: 1.35;">
                              ${mDiet.slice(0, 95)}...
                            </div>
                          </div>

                          <button class="btn-pill btn-outline btn-dash-med-profile" data-studentid="${m.studentId}" style="font-size: 0.74rem; padding: 0.35rem 0.65rem; white-space: nowrap;">
                            Health Passport
                          </button>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div style="margin-top: 1rem; border-top: 1px solid #fecaca; padding-top: 0.75rem; font-size: 0.74rem; color: #991b1b; display: flex; align-items: center; justify-content: space-between;">
                  <span>🏥 Matron Grace Agyemang, SRN (Infirmary Lead)</span>
                  <span>Ext: 104</span>
                </div>
              </div>

              <!-- Column 2: Recent Sickbay Clinical Encounters & Nursing Triage -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #047857; text-transform: uppercase; display: flex; align-items: center; gap: 0.35rem;">
                      <span>📋</span> Infirmary Triage & Daily Clinical Encounter Log
                    </div>
                    <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 800;">
                      ${sickbayLogs.length} Records Logged
                    </span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${sickbayLogs.map(log => {
                      const sGrade = log.gradeLevel || log.grade || 'Primary Class';
                      const sComplaint = log.complaint || log.presentingComplaint || 'Clinical Consultation';
                      const sOutcome = log.outcome || log.outcomeCategory || 'Returned to Class';
                      const sDate = log.date || log.visitDate || 'Today';
                      const sTime = log.time || log.visitTime || '10:15 AM';
                      const sTreatment = log.treatment || log.treatmentGiven || 'Clinical observation & hydration';
                      const sMatron = log.matronName || log.treatingNurse || 'Matron Grace Agyemang, SRN';
                      const sTemp = log.vitals?.temp || log.vitals?.temperature || '36.8°C';
                      const sPulse = log.vitals?.pulse || '84 bpm';
                      const sSpo2 = log.vitals?.spo2 || log.vitals?.spO2 || '98%';

                      return `
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; display: flex; flex-direction: column; gap: 0.45rem;">
                          
                          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                              <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <strong style="color: var(--primary-900); font-size: 0.92rem;">${log.studentName}</strong>
                                <span style="font-size: 0.75rem; color: #64748b;">(${sGrade})</span>
                              </div>
                              <div style="font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-top: 0.15rem;">
                                ${sComplaint}
                              </div>
                            </div>

                            <div style="text-align: right;">
                              <span class="badge" style="background: #d1fae5; color: #065f46; font-size: 0.7rem; font-weight: 800;">
                                ${sOutcome}
                              </span>
                              <div style="font-size: 0.72rem; color: #64748b; margin-top: 0.15rem;">
                                ${sDate} • ${sTime}
                              </div>
                            </div>
                          </div>

                          <!-- Vitals Gauge Strip -->
                          <div style="background: #f8fafc; border-radius: 6px; padding: 0.4rem 0.65rem; display: flex; gap: 0.85rem; font-size: 0.74rem; color: #475569;">
                            <span>Temp: <strong style="color: #0f172a;">${sTemp}</strong></span>
                            <span>Pulse: <strong style="color: #0f172a;">${sPulse}</strong></span>
                            <span>SpO2: <strong style="color: #059669;">${sSpo2}</strong></span>
                          </div>

                          <div style="font-size: 0.78rem; color: #334155;">
                            <strong>Rx:</strong> ${sTreatment}
                          </div>

                          <div style="border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.2rem; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.72rem; color: #64748b;">${sMatron}</span>
                            <div style="display: flex; gap: 0.4rem;">
                              <button class="btn-pill btn-outline btn-dash-sickbay-details" data-logid="${log.id}" style="font-size: 0.72rem; padding: 0.3rem 0.6rem;">
                                Full Triage
                              </button>
                              <button class="btn-dash-emergency-sms" data-logid="${log.id}" data-studentname="${log.studentName}" data-complaint="${sComplaint}" style="background: #ea580c; color: #fff; border: none; border-radius: 6px; font-size: 0.72rem; padding: 0.3rem 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
                                <span>📲</span> Alert Parent SMS
                              </button>
                            </div>
                          </div>

                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div style="margin-top: 1rem; text-align: center; font-size: 0.75rem; color: #64748b;">
                  Full triage audit synchronized with Ghana MoE School Health Education Program (SHEP).
                </div>
              </div>

            </div>

          </div>

          <!-- FEATURE 14: Digital School Library & Textbook Lending Console -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2.5rem; box-shadow: var(--shadow-sm);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.25rem;">
              <div>
                <div style="font-size: 0.75rem; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.4rem;">
                  <span>📚</span> Academic Resource Center & Media Hub
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                  Digital School Library & Textbook Lending System
                </h3>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                  Manage curriculum textbook inventory (Aki-Ola, Cambridge IGCSE, African Literature), track active student checkouts, inspect barcodes, and dispatch automated overdue SMS notices.
                </p>
              </div>

              <!-- Action button & Stats -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #3730a3; text-transform: uppercase; font-weight: 700;">Catalog Copies</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #312e81;">${totalBooksCataloged} Books</div>
                </div>
                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #065f46; text-transform: uppercase; font-weight: 700;">Active Loans</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #047857;">${activeBorrowersCount} Issued</div>
                </div>
                <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 0.5rem 1rem; border-radius: 12px; text-align: center;">
                  <div style="font-size: 0.68rem; color: #991b1b; text-transform: uppercase; font-weight: 700;">Overdue Loans</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: #b91c1c;">${overdueLoansCount} Overdue</div>
                </div>

                <button id="btn-dash-issue-book" class="btn-pill" style="background: #312e81; color: #ffffff; border: none; padding: 0.65rem 1.25rem; font-size: 0.85rem; font-weight: 800; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 10px rgba(49, 46, 129, 0.25);">
                  <span>+</span> Issue Textbook
                </button>
              </div>
            </div>

            <!-- Two-column Grid: Catalog Inventory (Left) & Active Loans (Right) -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;">
              
              <!-- Column 1: Curriculum Catalog & Shelf Inventory -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                  <div style="font-size: 0.8rem; font-weight: 800; color: #312e81; text-transform: uppercase;">
                    📖 Curriculum Textbooks & Set Books (${libraryBooks.length})
                  </div>
                  <span class="badge" style="background: #e0e7ff; color: #3730a3; font-size: 0.7rem; font-weight: 800;">
                    WAEC & Cambridge CIE
                  </span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${libraryBooks.map(b => `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                          <span style="font-size: 1.2rem;">${b.coverIcon || '📖'}</span>
                          <strong style="color: var(--primary-900); font-size: 0.92rem;">${b.title}</strong>
                        </div>
                        <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.15rem;">
                          ${b.author} • ${b.curriculum} • ${b.gradeLevel}
                        </div>
                        <div style="font-size: 0.75rem; color: #4338ca; font-weight: 600; margin-top: 0.2rem;">
                          📍 ${b.shelfLocation} • <span style="color: ${b.availableCopies > 0 ? '#059669' : '#dc2626'}; font-weight: 800;">${b.availableCopies}/${b.totalCopies} Available</span>
                        </div>
                      </div>

                      <div style="display: flex; gap: 0.4rem;">
                        <button class="btn-pill btn-outline btn-dash-book-details" data-bookid="${b.id}" style="font-size: 0.74rem; padding: 0.35rem 0.65rem;">
                          Inspect
                        </button>
                        <button class="btn-pill btn-primary btn-dash-borrow-book" data-bookid="${b.id}" style="font-size: 0.74rem; padding: 0.35rem 0.75rem; font-weight: 800; background: #312e81;">
                          Issue
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Column 2: Active Student Loans & Overdue Registry -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                    <div style="font-size: 0.8rem; font-weight: 800; color: #047857; text-transform: uppercase;">
                      📋 Active Checkout Registry (${libraryLoans.length})
                    </div>
                    <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 800;">
                      14-Day Loans
                    </span>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${libraryLoans.map(loan => {
                      const isOverdue = loan.status === 'Overdue' || (loan.fineDueGHS && loan.fineDueGHS > 0);
                      return `
                        <div style="background: #ffffff; border: 1px solid ${isOverdue ? '#fca5a5' : '#e2e8f0'}; border-radius: 10px; padding: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem;">
                          
                          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                              <strong style="color: var(--primary-900); font-size: 0.9rem;">${loan.studentName}</strong>
                              <span style="font-size: 0.75rem; color: #64748b;">(${loan.gradeLevel})</span>
                              <div style="font-size: 0.8rem; color: #334155; font-weight: 700; margin-top: 0.1rem;">
                                ${loan.bookTitle}
                              </div>
                            </div>

                            <span class="badge" style="background: ${isOverdue ? '#fee2e2' : '#ecfdf5'}; color: ${isOverdue ? '#991b1b' : '#065f46'}; font-size: 0.7rem; font-weight: 800;">
                              ${loan.status}
                            </span>
                          </div>

                          <div style="background: #f8fafc; border-radius: 6px; padding: 0.4rem 0.65rem; font-size: 0.74rem; display: flex; justify-content: space-between; color: #475569;">
                            <span>Borrowed: <strong>${loan.borrowDate}</strong></span>
                            <span>Due: <strong style="color: ${isOverdue ? '#b91c1c' : '#312e81'};">${loan.dueDate}</strong></span>
                            <span>Fine: <strong style="color: ${isOverdue ? '#b91c1c' : '#059669'};">GH₵ ${(loan.fineDueGHS || 0).toFixed(2)}</strong></span>
                          </div>

                          <div style="border-top: 1px solid #f1f5f9; padding-top: 0.5rem; margin-top: 0.15rem; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-family: monospace; font-size: 0.72rem; color: #64748b;">${loan.barcode}</span>
                            <div style="display: flex; gap: 0.35rem;">
                              <button class="btn-pill btn-emerald btn-dash-return-loan" data-loanid="${loan.id}" style="font-size: 0.72rem; padding: 0.3rem 0.65rem; font-weight: 800;">
                                Check-In
                              </button>
                              ${isOverdue ? `
                                <button class="btn-dash-overdue-sms" data-loanid="${loan.id}" style="background: #b91c1c; color: #fff; border: none; border-radius: 6px; font-size: 0.72rem; padding: 0.3rem 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                                  <span>📲</span> Alert SMS
                                </button>
                              ` : ''}
                            </div>
                          </div>

                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <div style="margin-top: 1rem; text-align: center; font-size: 0.75rem; color: #64748b;">
                  Full physical textbook circulation synchronized with school bursary and academic lockers.
                </div>
              </div>

            </div>

          </div>

          <!-- FEATURE 16: DIGITAL STUDENT & STAFF ID BADGES WITH QR VERIFICATION HUB -->
          <div style="margin-bottom: 2.5rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; box-shadow: var(--shadow-sm);">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge" style="background: #e0f2fe; color: #0369a1; margin-bottom: 0.35rem;">
                  🪪 Student Security & Gate Biometrics
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.45rem; color: var(--primary-900); font-weight: 800; margin: 0 0 0.25rem 0;">
                  Digital Student ID Cards & Gate Access Badges
                </h3>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
                  Official verifiable digital credentials with cryptographic QR codes, live bus pass status, and infirmary emergency medical badges.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button type="button" id="btn-dash-open-gate-scanner" class="btn-pill btn-emerald" style="font-size: 0.82rem; font-weight: 700; padding: 0.55rem 1rem; cursor: pointer;">
                  🛡️ Open Gate Security Scanner
                </button>
                <button type="button" class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.82rem; padding: 0.55rem 1rem; cursor: pointer;">
                  🖨️ Batch Print ID Cards
                </button>
              </div>
            </div>

            <!-- Metric Summary Ribbon -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  Active Credentials Issued
                </div>
                <div style="font-size: 1.75rem; font-weight: 800; color: #0a1128; font-family: var(--font-heading);">
                  580
                </div>
                <div style="font-size: 0.72rem; color: #10b981; font-weight: 600;">
                  ● 100% Active in GES / NaSIA Base
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  Cryptographic QR Security
                </div>
                <div style="font-size: 1.75rem; font-weight: 800; color: #0284c7; font-family: var(--font-heading);">
                  Signed
                </div>
                <div style="font-size: 0.72rem; color: #0284c7; font-weight: 600;">
                  Tamper-resistant SHA hash
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  Active Bus Shuttle Passes
                </div>
                <div style="font-size: 1.75rem; font-weight: 800; color: #d97706; font-family: var(--font-heading);">
                  3 Passes
                </div>
                <div style="font-size: 0.72rem; color: #d97706; font-weight: 600;">
                  East Legon, Airport & Cantonments
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.25rem;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  Campus Gate Clearance Rate
                </div>
                <div style="font-size: 1.75rem; font-weight: 800; color: #059669; font-family: var(--font-heading);">
                  100%
                </div>
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">
                  0 Security Breaches Logged
                </div>
              </div>
            </div>

            <!-- Student ID Badges Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
              ${digitalIDs.map(id => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid #0a1128;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <div style="width: 48px; height: 58px; border-radius: 6px; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; flex-shrink: 0;">
                          <img src="${id.photoUrl}" alt="${id.studentName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>👨🏾‍🎓</text></svg>'" />
                        </div>
                        <div>
                          <div style="font-weight: 800; font-size: 1rem; color: #0a1128;">${id.studentName}</div>
                          <div style="font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #1e3a8a;">${id.indexNumber}</div>
                          <div style="font-size: 0.72rem; color: #64748b;">${id.gradeLevel} • ${id.house}</div>
                        </div>
                      </div>
                      <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.65rem; font-weight: 800;">
                        ● ${id.status}
                      </span>
                    </div>

                    <div style="background: #f8fafc; border-radius: 6px; padding: 0.5rem 0.65rem; font-size: 0.72rem; color: #334155; margin-bottom: 0.75rem;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Blood / Genotype:</span>
                        <strong style="color: #9f1239;">${id.bloodGroup} (${id.genotype})</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Bus Pass:</span>
                        <strong style="color: #047857;">${id.busPassRoute.split(':')[0]} (${id.busPassStatus})</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span>Security Hash:</span>
                        <code style="font-size: 0.65rem; color: #0284c7;">${id.verificationHash.slice(0, 16)}...</code>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 0.75rem;">
                    <button class="btn-pill btn-primary btn-dash-view-digital-id" data-studentid="${id.id}" style="flex: 1; font-size: 0.78rem; justify-content: center; padding: 0.45rem; cursor: pointer;">
                      🪪 View ID Badge
                    </button>
                    <button class="btn-pill btn-emerald btn-dash-scan-gate" data-index="${id.indexNumber}" style="flex: 1; font-size: 0.78rem; justify-content: center; padding: 0.45rem; font-weight: 700; cursor: pointer;">
                      🛡️ Gate Check
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>

          <!-- Quick Actions & Phase 2 Ecosystem Tools -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- Left: School Management Panel -->
            <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); margin-bottom: 1.25rem;">
                School Operations & Ecosystem Actions
              </h3>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                <!-- Post RFQ -->
                <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📦</div>
                    <h4 style="font-size: 1.05rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.25rem;">Procure Supplies</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                      Need desks, rice, or textbooks? Post a request to vetted Ghanaian suppliers.
                    </p>
                  </div>
                  <button id="btn-dash-post-rfq" class="btn-pill btn-primary" style="font-size: 0.85rem; justify-content: center;">
                    Post Procurement RFQ
                  </button>
                </div>

                <!-- Post Teaching Job -->
                <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">👨‍🏫</div>
                    <h4 style="font-size: 1.05rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.25rem;">Hire Teachers</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
                      Advertise subject vacancies to qualified educators across Accra & Kumasi.
                    </p>
                  </div>
                  <button id="btn-dash-post-job" class="btn-pill btn-gold" style="font-size: 0.85rem; justify-content: center;">
                    Post Teaching Vacancy
                  </button>
                </div>
              </div>

              <!-- Institutional Procurement & RFQ Management -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="badge" style="background: #fef3c7; color: #92400e;">📦 B2B Procurement Tenders</span>
                      <span class="badge badge-admissions">${schoolRfqs.length} Active Tenders</span>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                      Institutional Procurement & Received Supplier Bids
                    </h3>
                  </div>
                  <button id="btn-dash-panel-post-rfq" class="btn-pill btn-primary" style="font-size: 0.85rem;">
                    <span>➕</span> Post New Procurement RFQ
                  </button>
                </div>

                ${schoolRfqs.length === 0 ? `
                  <div style="text-align: center; padding: 2.5rem 1.5rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
                    <div style="font-size: 2.25rem; margin-bottom: 0.5rem;">📦</div>
                    <h4 style="font-size: 1.1rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.25rem;">No Procurement RFQs Posted Yet</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 1.25rem auto;">
                      Post your school's need for classroom desks, bulk rice & dining supplies, Cambridge/GES textbooks, or ICT gear to receive competitive bids from verified Ghanaian suppliers.
                    </p>
                    <button id="btn-dash-empty-post-rfq" class="btn-pill btn-gold" style="font-size: 0.85rem;">
                      Post First RFQ Now &rarr;
                    </button>
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                    ${schoolRfqs.map(rfq => `
                      <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                          <div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                              <span class="badge" style="background: var(--primary-50); color: var(--primary-700);">${rfq.category}</span>
                              <span class="badge ${rfq.status === 'Tender Awarded' ? 'badge-emerald' : 'badge-admissions'}">${rfq.status}</span>
                            </div>
                            <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--primary-900); margin: 0 0 0.25rem 0;">
                              ${rfq.title}
                            </h4>
                            <div style="font-size: 0.82rem; color: var(--text-muted);">
                              <strong>Quantity:</strong> ${rfq.quantity} &bull; 
                              <strong>Target Budget:</strong> <span style="font-weight: 700; color: var(--primary-800);">${rfq.budgetRange}</span> &bull; 
                              <strong>Deadline:</strong> ${rfq.deadline}
                            </div>
                          </div>
                          <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button class="btn-pill btn-outline btn-dash-view-quotes" data-rfq-id="${rfq.id}" style="font-size: 0.82rem; padding: 0.45rem 0.9rem;">
                              📋 Review Quotes (${rfq.quotesReceived || (rfq.quotes || []).length})
                            </button>
                            <button class="btn-pill btn-gold btn-dash-bid-rfq" data-rfq-id="${rfq.id}" style="font-size: 0.82rem; padding: 0.45rem 0.9rem;">
                              + Submit Bid
                            </button>
                          </div>
                        </div>

                        ${(rfq.quotes && rfq.quotes.length > 0) ? `
                          <div style="background: var(--bg-main); border-radius: var(--radius-md); padding: 1rem; margin-top: 0.75rem; border: 1px solid var(--border-light);">
                            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
                              Received Supplier Quotations (${rfq.quotes.length}):
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                              ${rfq.quotes.map(q => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.84rem; flex-wrap: wrap; gap: 0.5rem;">
                                  <div>
                                    <strong style="color: var(--primary-900);">${q.supplierName}</strong>
                                    <span style="color: var(--text-muted); font-size: 0.78rem; margin-left: 0.35rem;">(${q.deliveryDays} days lead time &bull; ${q.warrantyTerms || 'Warranty included'})</span>
                                  </div>
                                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <span style="font-weight: 800; color: var(--emerald-600);">${q.price}</span>
                                    <span class="badge ${q.status === 'Awarded' ? 'badge-emerald' : (q.status === 'Declined' ? 'badge-rose' : 'badge-admissions')}" style="font-size: 0.72rem;">${q.status}</span>
                                    ${q.status === 'Awarded' ? `
                                      <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                                        <span style="font-size: 0.75rem; color: var(--emerald-600); font-weight: 700;">🟢 Tender Awarded</span>
                                        <button class="btn-pill btn-gold btn-dash-view-lpo" data-quote-id="${q.id}" style="font-size: 0.72rem; padding: 0.2rem 0.55rem;">
                                          📄 View LPO
                                        </button>
                                      </div>
                                    ` : q.status === 'Declined' ? `
                                      <span style="font-size: 0.75rem; color: #dc2626; font-weight: 700;">🔴 Bid Declined</span>
                                    ` : `
                                      <div style="display: flex; gap: 0.35rem;">
                                        <button class="btn-pill btn-emerald btn-dash-award-quote" data-quote-id="${q.id}" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">
                                          ✓ Award
                                        </button>
                                        <button class="btn-pill btn-outline btn-dash-decline-quote" data-quote-id="${q.id}" style="font-size: 0.75rem; padding: 0.25rem 0.65rem; color: #dc2626; border-color: #fca5a5;">
                                          ✕ Decline
                                        </button>
                                      </div>
                                    `}
                                  </div>
                                </div>
                              `).join('')}
                            </div>
                          </div>
                        ` : `
                          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">
                            No quotes submitted yet for this tender. Vetted suppliers in Accra & Kumasi have been notified.
                          </div>
                        `}
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

              <!-- FEATURE 4: TEACHER APPLICATIONS & HIRING PIPELINE -->
              <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 1.75rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="badge" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;">🧑‍🏫 Academic Staffing &amp; Hiring Pipeline</span>
                      <span class="badge badge-admissions">${teacherApps.length} Candidates</span>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--primary-900); margin: 0.25rem 0 0 0;">
                      Educator Applications, NTC Licensure &amp; Hiring Pipeline
                    </h3>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-pill btn-emerald" onclick="App.navigate('teachers')" style="font-size: 0.85rem;">
                      <span>🔍</span> Search Teacher Talent Pool
                    </button>
                  </div>
                </div>

                <!-- Candidates List -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${teacherApps.map(app => `
                    <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                      <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: #e0e7ff; color: #3730a3; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
                          ${app.teacherName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <strong style="color: var(--primary-900); font-size: 1.05rem;">${app.teacherName}</strong>
                            <span class="badge ${app.ntcVerified ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.72rem;">
                              ${app.ntcVerified ? '🛡️ NTC Certified' : '⚠️ Unverified NTC'} (${app.licenseNumber})
                            </span>
                            <span class="badge" style="background: #f1f5f9; color: #475569; font-size: 0.72rem;">
                              ${app.status}
                            </span>
                          </div>
                          <div style="font-size: 0.85rem; color: var(--text-dark); margin-top: 0.2rem;">
                            Position: <strong style="color: var(--primary-800);">${app.jobTitle}</strong> &nbsp;|&nbsp; 
                            ${app.qualification} &nbsp;|&nbsp; 
                            <strong>${app.experienceYears} Years Exp</strong>
                          </div>
                          ${app.interviewDetails ? `
                            <div style="font-size: 0.78rem; color: #2563eb; margin-top: 0.35rem; background: #eff6ff; padding: 0.35rem 0.65rem; border-radius: 6px; display: inline-block;">
                              📅 Interview: <strong>${app.interviewDetails.date} at ${app.interviewDetails.time}</strong> (${app.interviewDetails.venue})
                            </div>
                          ` : ''}
                          ${app.contractDetails ? `
                            <div style="font-size: 0.78rem; color: #047857; margin-top: 0.35rem; background: #ecfdf5; padding: 0.35rem 0.65rem; border-radius: 6px; display: inline-block;">
                              🤝 Hired: <strong>${app.contractDetails.role}</strong> &bull; Remuneration: <strong>GH₵ ${app.contractDetails.salaryGHS.toLocaleString()}/mo</strong> &bull; Starts: ${app.contractDetails.commencementDate}
                            </div>
                          ` : ''}
                        </div>
                      </div>

                      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        ${!app.ntcVerified ? `
                          <button class="btn-pill btn-outline btn-dash-verify-ntc" data-app-id="${app.id}" data-app='${JSON.stringify(app).replace(/'/g, "&apos;")}' style="font-size: 0.78rem; color: #d97706; border-color: #f59e0b;">
                            <span>🛡️</span> Verify NTC
                          </button>
                        ` : ''}
                        ${app.status !== 'Hired / Contract Offered' ? `
                          <button class="btn-pill btn-primary btn-dash-interview" data-app-id="${app.id}" data-app='${JSON.stringify(app).replace(/'/g, "&apos;")}' style="font-size: 0.78rem;">
                            <span>📅</span> Schedule Interview
                          </button>
                          <button class="btn-pill btn-emerald btn-dash-hire" data-app-id="${app.id}" data-app='${JSON.stringify(app).replace(/'/g, "&apos;")}' style="font-size: 0.78rem;">
                            <span>🤝</span> Hire &amp; Issue Contract
                          </button>
                        ` : `
                          <span class="badge badge-emerald" style="font-size: 0.8rem; padding: 0.4rem 0.75rem;">
                            ✓ Contract Active
                          </span>
                        `}
                        <a href="https://wa.me/${app.teacherPhone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-pill btn-outline" style="font-size: 0.78rem; color: #25d366; border-color: #86efac; text-decoration: none;">
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Campus Profile Status -->
              <div style="border-top: 1px solid var(--border-light); padding-top: 1.5rem;">
                <h4 style="font-size: 1.05rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.75rem;">
                  Published Admissions Profile Information
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.88rem;">
                  <div>
                    <span style="color: var(--text-light); display: block;">Official WhatsApp:</span>
                    <strong>${school.whatsapp}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-light); display: block;">Admissions Line:</span>
                    <strong>${school.phone}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-light); display: block;">Curriculum:</span>
                    <strong>${Array.isArray(school.curriculum) ? school.curriculum.join(', ') : (school.curriculum || 'Ghana GES & Cambridge')}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-light); display: block;">Enrollment Status:</span>
                    <strong style="color: var(--emerald-600);">${school.admissionsStatus}</strong>
                  </div>
                </div>

                <div style="margin-top: 1.5rem;">
                  <button id="btn-dash-view-public" class="btn-pill btn-outline">
                    View Public Showcase Page &rarr;
                  </button>
                </div>
              </div>

              <!-- FEATURE 4: INSTITUTIONAL VERIFICATION & KYC/KYB VAULT -->
              <div class="doc-vault-card" style="margin-top: 2rem; border-top: 1px solid var(--border-light); padding-top: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                  <div>
                    <span class="badge" style="background: var(--emerald-50); color: var(--emerald-600); margin-bottom: 0.35rem;">
                      🛡️ Institutional Compliance
                    </span>
                    <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); font-weight: 700;">
                      Accreditation & Document Verification Vault
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                      Upload official Ghana Education Service (GES) registration or inspection documents to maintain the "Verified Campus" trust seal.
                    </p>
                  </div>
                  <span class="badge badge-verified" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
                    ✓ Active GES Seal
                  </span>
                </div>

                <!-- Document Upload Form -->
                <form id="form-upload-doc" style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                      <label class="form-label" style="font-size: 0.78rem;">Document Type *</label>
                      <select id="doc-type" class="form-select" required>
                        <option value="GES Registration Certificate">Ghana Education Service (GES) Registration Certificate</option>
                        <option value="Registrar General Business Certificate">Registrar General Department (RGD) Certificate</option>
                        <option value="Fire & Safety Clearance">Ghana National Fire Service Safety Clearance</option>
                        <option value="Head of School Authorization">Head of School Official Authorization Letter</option>
                      </select>
                    </div>
                    <div>
                      <label class="form-label" style="font-size: 0.78rem;">Document / License Number *</label>
                      <input type="text" id="doc-number" class="form-input" placeholder="e.g. GES/GAR/AMA/2024/098" required />
                    </div>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                      📁 Accepted formats: PDF, JPEG, PNG (Encrypted storage)
                    </div>
                    <button type="submit" class="btn-pill btn-primary" style="font-size: 0.85rem;">
                      Upload & Submit Document &rarr;
                    </button>
                  </div>
                </form>

                <!-- Uploaded Documents Vault List -->
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.75rem;">
                  Active Institutional Documents on File:
                </div>
                <div class="doc-list" id="vault-docs-list">
                  <div class="doc-item">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="font-size: 1.5rem;">📄</div>
                      <div>
                        <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">GES Accreditation & Inspection Certificate</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">Ref: GES/GAR/ACC-4091 • Verified Active</div>
                      </div>
                    </div>
                    <span class="badge badge-verified" style="font-size: 0.75rem;">🛡️ Verified</span>
                  </div>
                  <div class="doc-item">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="font-size: 1.5rem;">📄</div>
                      <div>
                        <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">Registrar General Business Registration</div>
                        <div style="font-weight: 400; font-size: 0.78rem; color: var(--text-muted);">Ref: CS-991048-2023 • Verified Active</div>
                      </div>
                    </div>
                    <span class="badge badge-verified" style="font-size: 0.75rem;">🛡️ Verified</span>
                  </div>
                </div>
              </div>

              <!-- FEATURE 2: PARENT REVIEWS & REPUTATION MANAGEMENT -->
              <div class="reviews-reputation-card" style="margin-top: 2rem; border-top: 1px solid var(--border-light); padding-top: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                  <div>
                    <span class="badge" style="background: var(--gold-100); color: var(--gold-700); margin-bottom: 0.35rem;">
                      ⭐ Feature #2: Community Feedback & Reputation
                    </span>
                    <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); font-weight: 700;">
                      Parent Reviews & Institutional Ratings
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                      Review family sentiment and post official management replies with institutional authority.
                    </p>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-family: var(--font-heading); font-size: 1.75rem; font-weight: 900; color: #f59e0b;">
                      ★ ${ratingSummary.averageOverall || '5.0'}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
                      ${ratingSummary.totalReviews} verified reviews
                    </div>
                  </div>
                </div>

                <!-- Reviews list for dashboard -->
                <div style="display: flex; flex-direction: column; gap: 1rem;" id="dash-reviews-list">
                  ${reviews.length === 0 ? `
                    <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.88rem; background: var(--bg-main); border-radius: var(--radius-md);">
                      No parent reviews have been published yet for this school.
                    </div>
                  ` : reviews.map(r => `
                    <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                          <strong style="color: var(--primary-900); font-size: 0.95rem;">${r.authorName}</strong>
                          <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.35rem;">(${r.affiliation} • ${r.wardGrade})</span>
                        </div>
                        <div style="color: #f59e0b; font-weight: 700; font-size: 0.9rem;">
                          ${'★'.repeat(Math.round(r.overallRating))} ${r.overallRating.toFixed(1)}
                        </div>
                      </div>

                      <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-800); margin-bottom: 0.35rem;">
                        "${r.title}"
                      </div>
                      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.75rem;">
                        ${r.content}
                      </p>

                      ${r.officialReply ? `
                        <div style="background: #ffffff; border-left: 3px solid var(--primary-600); border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin-bottom: 0.75rem; font-size: 0.82rem;">
                          <div style="font-weight: 700; color: var(--primary-900); margin-bottom: 0.2rem;">
                            ✓ Official Response (${r.officialReply.author} — ${r.officialReply.role}):
                          </div>
                          <div style="color: var(--text-main); line-height: 1.5;">${r.officialReply.message}</div>
                        </div>
                      ` : ''}

                      <div style="display: flex; justify-content: flex-end;">
                        <button class="btn-dash-reply-review btn-pill btn-outline" data-id="${r.id}" style="font-size: 0.78rem; padding: 0.35rem 0.85rem;">
                          <span>💬</span> ${r.officialReply ? 'Update Official Response' : 'Respond as Head of School'}
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Right: Subscription Package Tier -->
            <div>
              <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.75rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase; margin-bottom: 0.25rem;">
                  SUBSCRIPTION PACKAGE
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); font-weight: 800; margin-bottom: 0.75rem;">
                  ${school.packageTier} Partner
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Your school is featured at the top of search results in ${school.district}. Verified blue tick seal enabled.
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; margin-bottom: 1.5rem;">
                  <div>✓ Top of Search Placement</div>
                  <div>✓ Click-to-Reveal Lead Tracking</div>
                  <div>✓ Direct WhatsApp Chat Gateway</div>
                  <div>✓ Unlimited Photo Gallery & Videos</div>
                  <div>✓ Access to B2B Supplier RFQ Bidding</div>
                </div>

                <button id="btn-renew-package" class="btn-pill btn-gold" style="width: 100%; justify-content: center;">
                  Manage Subscription (Paystack/MoMo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents(schoolId) {
    // School Switcher
    const select = document.getElementById('dash-school-select');
    if (select) {
      select.onchange = (e) => {
        App.navigate('dashboard', e.target.value);
      };
    }

    // Post RFQ handlers (Header, Panel, Empty state)
    const openPostRFQForSchool = async () => {
      const school = await API.getSchoolById(schoolId);
      Modals.openPostRFQModal({ schoolId, schoolName: school.name });
    };
    document.getElementById('btn-dash-post-rfq')?.addEventListener('click', openPostRFQForSchool);
    document.getElementById('btn-dash-panel-post-rfq')?.addEventListener('click', openPostRFQForSchool);
    document.getElementById('btn-dash-empty-post-rfq')?.addEventListener('click', openPostRFQForSchool);

    // Review Quotes
    document.querySelectorAll('.btn-dash-view-quotes').forEach(btn => {
      btn.onclick = async () => {
        const rfqId = btn.dataset.rfqId;
        const rfqs = await API.getRFQs(schoolId);
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq) Modals.openRFQQuotesModal(rfq);
      };
    });

    // Submit Bid from dashboard
    document.querySelectorAll('.btn-dash-bid-rfq').forEach(btn => {
      btn.onclick = async () => {
        const rfqId = btn.dataset.rfqId;
        const rfqs = await API.getRFQs(schoolId);
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq) Modals.openSubmitQuoteModal(rfq);
      };
    });

    // Award Quote button in dashboard
    document.querySelectorAll('.btn-dash-award-quote').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        try {
          await API.updateQuoteStatus(quoteId, 'Awarded');
          State.showToast(`🎉 Tender awarded! The supplier and Super Admin have been notified.`, 'success');
          App.navigate('dashboard', schoolId);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // Decline Quote button in dashboard
    document.querySelectorAll('.btn-dash-decline-quote').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        const reason = prompt("Enter a brief reason for declining this bid (e.g. Exceeded budget, specs mismatch):", "Proposal did not meet current school procurement requirements");
        if (reason === null) return;
        try {
          await API.updateQuoteStatus(quoteId, 'Declined', reason);
          State.showToast(`Bid declined. The supplier and Super Admin have been notified.`, 'info');
          App.navigate('dashboard', schoolId);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // View Official LPO button in dashboard
    document.querySelectorAll('.btn-dash-view-lpo').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        try {
          const res = await API.generateLPO(quoteId);
          if (res && res.lpo) Modals.openLPOModal(res.lpo);
          else State.showToast('LPO not found', 'error');
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // Feature 4: Teacher NTC Verification & Hiring Actions
    document.querySelectorAll('.btn-dash-verify-ntc').forEach(btn => {
      btn.onclick = () => {
        try {
          const app = JSON.parse(btn.dataset.app);
          Modals.openVerifyNTCModal(app, () => App.refreshCurrentView());
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    document.querySelectorAll('.btn-dash-interview').forEach(btn => {
      btn.onclick = () => {
        try {
          const app = JSON.parse(btn.dataset.app);
          Modals.openScheduleInterviewModal(app, () => App.refreshCurrentView());
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    document.querySelectorAll('.btn-dash-hire').forEach(btn => {
      btn.onclick = () => {
        try {
          const app = JSON.parse(btn.dataset.app);
          Modals.openHireTeacherModal(app, () => App.refreshCurrentView());
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // Post Teaching Job
    document.getElementById('btn-dash-post-job')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      Modals.openPostJobModal({ schoolName: school.name });
    });

    // Export Leads CSV
    document.getElementById('btn-export-leads-csv')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      const analytics = await API.getSchoolAnalytics(schoolId);
      const csvContent = "data:text/csv;charset=utf-8," + 
        `SkoolFinder Ghana Admissions Lead Report\n` +
        `School Name,${school.name}\n` +
        `Region,${school.region}\n` +
        `Total Profile Views,${analytics.totalViews}\n` +
        `Total WhatsApp Inquiries,${analytics.whatsappReveals}\n` +
        `Total Phone Calls,${analytics.callClicks}\n` +
        `Generated On,${new Date().toISOString()}\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${school.slug}_leads_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      State.showToast(`Admissions lead report exported for ${school.name}!`, 'success');
    });

    // View Public
    document.getElementById('btn-dash-view-public')?.addEventListener('click', () => {
      App.navigate('school-detail', schoolId);
    });

    // Renew Package with Paystack MoMo Checkout
    document.getElementById('btn-renew-package')?.addEventListener('click', () => {
      Modals.openPaystackCheckoutModal({
        amount: 1200,
        purpose: 'school_premium',
        targetId: schoolId,
        targetTitle: `Verified Campus & Premium Listing (1 Year) - ${school.name}`,
        payerName: school.headOfSchool || 'School Administrator',
        payerPhone: school.phone || '0244123456',
        onSuccess: () => {
          State.showToast(`Verified Campus Package renewed for ${school.name}!`, 'success');
          App.navigate('dashboard', schoolId);
        }
      });
    });

    // FEATURE 4: Document Verification Form Submit
    const docForm = document.getElementById('form-upload-doc');
    if (docForm) {
      docForm.onsubmit = async (e) => {
        e.preventDefault();
        const docType = document.getElementById('doc-type').value;
        const docNumber = document.getElementById('doc-number').value.trim();

        try {
          const res = await API.uploadVerificationDoc({
            entityId: schoolId,
            entityType: 'school',
            docType,
            docNumber
          });

          // Prepend to list
          const vaultList = document.getElementById('vault-docs-list');
          if (vaultList) {
            const item = document.createElement('div');
            item.className = 'doc-item';
            item.innerHTML = `
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.5rem;">📄</div>
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-900);">${docType}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Ref: ${docNumber} • Verified Active</div>
                </div>
              </div>
              <span class="badge badge-verified" style="font-size: 0.75rem;">🛡️ Verified</span>
            `;
            vaultList.prepend(item);
          }

          docForm.reset();
          State.showToast("Document verified & added to institutional vault!", "success");
        } catch (err) {
          State.showToast(err.message, "error");
        }
      };
    }

    // FEATURE 1: Admissions Desk Pipeline Controller
    let currentApplications = [];
    let activeFilter = 'All';
    let searchQuery = '';

    const renderPipelineTable = (apps) => {
      const tbody = document.getElementById('pipeline-table-body');
      if (!tbody) return;

      if (!apps || apps.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📂</div>
              <div style="font-weight: 700; color: var(--primary-900);">No applications found</div>
              <div style="font-size: 0.82rem;">Try adjusting your search terms or filter tabs.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = apps.map(a => {
        let statusBadge = '';
        if (a.status === 'Received') statusBadge = '<span class="badge" style="background: #fefce8; color: #a16207; font-weight: 700;">🟡 Received</span>';
        else if (a.status === 'Exam Scheduled') statusBadge = '<span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 700;">🔵 Exam Scheduled</span>';
        else if (a.status === 'Admitted') statusBadge = '<span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700;">🟢 Admitted</span>';
        else if (a.status === 'Enrolled') statusBadge = '<span class="badge" style="background: #faf5ff; color: #9333ea; font-weight: 700;">🟣 Enrolled</span>';
        else if (a.status === 'Waitlisted') statusBadge = '<span class="badge" style="background: #fff7ed; color: #c2410c; font-weight: 700;">🟠 Waitlisted</span>';
        else statusBadge = `<span class="badge" style="background: #fef2f2; color: #dc2626; font-weight: 700;">🔴 ${a.status}</span>`;

        let examDateStr = '';
        if (a.entranceExamDate && a.entranceExamDate !== 'Pending Scheduling' && !isNaN(Date.parse(a.entranceExamDate))) {
          examDateStr = `<div style="font-size: 0.72rem; color: #2563eb; margin-top: 0.25rem;">📅 Exam: ${new Date(a.entranceExamDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>`;
        } else if (a.status === 'Exam Scheduled') {
          examDateStr = `<div style="font-size: 0.72rem; color: #2563eb; margin-top: 0.25rem;">📅 Exam date pending</div>`;
        }

        const canOffer = a.status === 'Admitted' || a.status === 'Enrolled';

        return `
          <tr style="border-bottom: 1px solid var(--border-light); transition: background 0.15s;">
            <td style="padding: 1rem;">
              <div style="font-family: monospace; font-weight: 800; color: var(--primary-900); font-size: 0.85rem;">${a.applicationNumber}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${new Date(a.createdAt).toLocaleDateString('en-GB')}</div>
            </td>
            <td style="padding: 1rem;">
              <div style="font-weight: 700; color: var(--primary-900);">${a.student?.fullName || 'N/A'}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${a.student?.gender || ''} • DOB: ${a.student?.dateOfBirth || 'N/A'}</div>
            </td>
            <td style="padding: 1rem;">
              <strong style="color: var(--primary-800);">${a.gradeApplying}</strong>
              <div style="font-size: 0.75rem; color: var(--text-light);">${a.curriculum || 'Standard'} • ${a.termApplied}</div>
            </td>
            <td style="padding: 1rem;">
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${a.parentGuardian?.primaryGuardianName || 'N/A'}</div>
              <div style="font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.15rem;">
                <a href="https://wa.me/${(a.parentGuardian?.whatsapp || '').replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--whatsapp-green); text-decoration: none; font-weight: 700;">💬 WA</a>
                <span style="color: var(--border-medium);">|</span>
                <span style="color: var(--text-muted);">${a.parentGuardian?.phone || ''}</span>
              </div>
            </td>
            <td style="padding: 1rem;">
              ${statusBadge}
              ${examDateStr}
            </td>
            <td style="padding: 1rem; text-align: right;">
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;">
                <button class="btn-action-dossier btn-pill btn-outline" data-id="${a.id}" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;" title="View Full Candidate Dossier">
                  📄 Dossier
                </button>
                <button class="btn-action-exam btn-pill btn-outline" data-id="${a.id}" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;" title="Schedule Entrance Assessment">
                  📅 Exam
                </button>
                ${canOffer ? `
                  <button class="btn-action-offer btn-pill" data-id="${a.id}" style="font-size: 0.75rem; padding: 0.3rem 0.7rem; background: var(--gradient-gold); color: #fff; font-weight: 700; border: none; cursor: pointer;" title="Generate Printable Offer Letter">
                    🖨️ Offer
                  </button>
                ` : ''}
                <select class="pipeline-status-dropdown form-select" data-id="${a.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; width: auto; height: auto;">
                  <option value="Received" ${a.status === 'Received' ? 'selected' : ''}>Received</option>
                  <option value="Exam Scheduled" ${a.status === 'Exam Scheduled' ? 'selected' : ''}>Exam Scheduled</option>
                  <option value="Admitted" ${a.status === 'Admitted' ? 'selected' : ''}>Admitted</option>
                  <option value="Enrolled" ${a.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
                  <option value="Waitlisted" ${a.status === 'Waitlisted' ? 'selected' : ''}>Waitlisted</option>
                  <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Wire row actions
      tbody.querySelectorAll('.btn-action-dossier').forEach(btn => {
        btn.onclick = async () => {
          const app = await API.getApplicationById(btn.dataset.id);
          Modals.openApplicationDossierModal(app);
        };
      });

      tbody.querySelectorAll('.btn-action-exam').forEach(btn => {
        btn.onclick = async () => {
          const app = await API.getApplicationById(btn.dataset.id);
          Modals.openScheduleExamModal(app, async () => {
            await reloadPipeline();
          });
        };
      });

      tbody.querySelectorAll('.btn-action-offer').forEach(btn => {
        btn.onclick = async () => {
          try {
            const offerData = await API.getAdmissionOfferLetter(btn.dataset.id);
            Modals.openAdmissionOfferLetterModal(offerData);
          } catch (err) {
            State.showToast(err.message, 'error');
          }
        };
      });

      tbody.querySelectorAll('.pipeline-status-dropdown').forEach(sel => {
        sel.onchange = async () => {
          const newStatus = sel.value;
          try {
            await API.updateApplicationStatus(sel.dataset.id, { status: newStatus });
            State.showToast(`Application marked as "${newStatus}"!`, 'success');
            await reloadPipeline();
          } catch (err) {
            State.showToast(err.message, 'error');
          }
        };
      });
    };

    const reloadPipeline = async () => {
      try {
        currentApplications = await API.getSchoolApplications(schoolId);

        // Update stats
        const total = currentApplications.length;
        const received = currentApplications.filter(a => a.status === 'Received').length;
        const exam = currentApplications.filter(a => a.status === 'Exam Scheduled').length;
        const admitted = currentApplications.filter(a => a.status === 'Admitted').length;
        const enrolled = currentApplications.filter(a => a.status === 'Enrolled').length;

        const statTotal = document.getElementById('stat-total-apps');
        const statReceived = document.getElementById('stat-received-apps');
        const statExam = document.getElementById('stat-exam-apps');
        const statAdmitted = document.getElementById('stat-admitted-apps');
        const statEnrolled = document.getElementById('stat-enrolled-apps');

        if (statTotal) statTotal.innerText = total;
        if (statReceived) statReceived.innerText = received;
        if (statExam) statExam.innerText = exam;
        if (statAdmitted) statAdmitted.innerText = admitted;
        if (statEnrolled) statEnrolled.innerText = enrolled;

        // Filter and search
        let filtered = currentApplications;
        if (activeFilter !== 'All') {
          filtered = filtered.filter(a => a.status === activeFilter);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(a => 
            (a.student?.fullName || '').toLowerCase().includes(q) ||
            (a.applicationNumber || '').toLowerCase().includes(q) ||
            (a.parentGuardian?.primaryGuardianName || '').toLowerCase().includes(q) ||
            (a.gradeApplying || '').toLowerCase().includes(q)
          );
        }

        renderPipelineTable(filtered);
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    };

    // Filter tabs click
    const filterTabs = document.querySelectorAll('.pipeline-tab');
    filterTabs.forEach(tab => {
      tab.onclick = () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'var(--bg-main)';
          t.style.color = 'var(--text-main)';
          t.style.fontWeight = '600';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--primary-900)';
        tab.style.color = '#fff';
        tab.style.fontWeight = '700';

        activeFilter = tab.dataset.status;
        reloadPipeline();
      };
    });

    // Stat cards click
    const statCards = document.querySelectorAll('.pipeline-stat-card');
    statCards.forEach(card => {
      card.onclick = () => {
        const filter = card.dataset.filter;
        const targetTab = document.querySelector(`.pipeline-tab[data-status="${filter}"]`);
        if (targetTab) targetTab.click();
      };
    });

    // Search input
    const searchInput = document.getElementById('pipeline-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        reloadPipeline();
      };
    }

    // New application entry from dashboard
    document.getElementById('btn-dash-new-application')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      Modals.openOnlineAdmissionModal(school);
    });

    // Export Pipeline CSV
    document.getElementById('btn-pipeline-export-csv')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      const apps = currentApplications.length > 0 ? currentApplications : await API.getSchoolApplications(schoolId);
      let csvContent = "data:text/csv;charset=utf-8," + 
        `SkoolFinder Ghana Admissions Roster - ${school.name}\n` +
        `Application Code,Candidate Name,Gender,DOB,Grade Applying,Curriculum,Parent Name,Parent Phone,Parent WhatsApp,Status,Exam Date,Submitted Date\n`;
      
      apps.forEach(a => {
        csvContent += `"${a.applicationNumber}","${a.student?.fullName || ''}","${a.student?.gender || ''}","${a.student?.dateOfBirth || ''}","${a.gradeApplying}","${a.curriculum || ''}","${a.parentGuardian?.primaryGuardianName || ''}","${a.parentGuardian?.phone || ''}","${a.parentGuardian?.whatsapp || ''}","${a.status}","${a.entranceExamDate || 'N/A'}","${a.createdAt}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${school.slug}_admission_roster.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      State.showToast(`Admissions roster exported (${apps.length} applicants)!`, 'success');
    });

    // Wire review official response buttons in dashboard
    document.querySelectorAll('.btn-dash-reply-review').forEach(btn => {
      btn.onclick = async () => {
        const reviewId = btn.dataset.id;
        const res = await API.getSchoolReviews(schoolId);
        const review = (res.reviews || []).find(r => r.id === reviewId);
        if (review) {
          Modals.openReplyReviewModal(review, () => {
            App.navigate('dashboard', schoolId);
          });
        }
      };
    });

    // FEATURE 3: Admissions Inquiries & Messaging Controller
    let currentInquiries = [];
    let inqActiveFilter = 'All';
    let inqSearchQuery = '';

    const renderInquiriesTable = (inqList) => {
      const tbody = document.getElementById('inquiries-table-body');
      if (!tbody) return;

      if (!inqList || inqList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📬</div>
              <div style="font-weight: 700; color: var(--primary-900);">No admissions inquiries found</div>
              <div style="font-size: 0.82rem;">Try adjusting your filter tabs or search terms.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = inqList.map(inq => {
        let statusBadge = '';
        if (inq.status === 'Unread') statusBadge = '<span class="badge" style="background: #fef2f2; color: #dc2626; font-weight: 700;">🔴 Unread</span>';
        else if (inq.status === 'Tour Scheduled') statusBadge = '<span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 700;">📅 Tour Scheduled</span>';
        else if (inq.status === 'Replied') statusBadge = '<span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700;">🟢 Replied</span>';
        else statusBadge = `<span class="badge" style="background: #faf5ff; color: #9333ea; font-weight: 700;">🟣 ${inq.status}</span>`;

        const tourBadge = inq.tourRequested ? `<div style="font-size: 0.72rem; color: #2563eb; font-weight: 700; margin-top: 0.2rem;">🏛️ Campus Tour Requested</div>` : '';

        return `
          <tr style="border-bottom: 1px solid var(--border-light); transition: background 0.15s;">
            <td style="padding: 1rem;">
              <div style="font-family: monospace; font-weight: 800; color: var(--primary-900); font-size: 0.85rem;">${inq.inquiryNumber}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${new Date(inq.createdAt).toLocaleDateString('en-GB')}</div>
            </td>
            <td style="padding: 1rem;">
              <div style="font-weight: 700; color: var(--primary-900);">${inq.parentName}</div>
              <div style="font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.15rem;">
                <a href="https://wa.me/${(inq.parentWhatsapp || inq.parentPhone).replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--whatsapp-green); text-decoration: none; font-weight: 700;">💬 WA</a>
                <span style="color: var(--border-medium);">|</span>
                <span style="color: var(--text-muted);">${inq.parentPhone}</span>
              </div>
            </td>
            <td style="padding: 1rem;">
              <strong style="color: var(--primary-800);">${inq.studentName || 'Child'}</strong>
              <div style="font-size: 0.75rem; color: var(--text-light);">${inq.gradeApplying}</div>
            </td>
            <td style="padding: 1rem; max-width: 280px;">
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${inq.subject}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
                Category: <strong>${inq.category}</strong>
              </div>
              ${tourBadge}
            </td>
            <td style="padding: 1rem;">
              ${statusBadge}
              ${inq.replies && inq.replies.length > 0 ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${inq.replies.length} replies logged</div>` : ''}
            </td>
            <td style="padding: 1rem; text-align: right;">
              <div style="display: inline-flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end;">
                <button class="btn-action-view-inquiry btn-pill btn-primary" data-id="${inq.id}" style="font-size: 0.75rem; padding: 0.35rem 0.8rem;" title="View Thread & Reply">
                  💬 Reply Thread
                </button>
                <select class="inquiry-status-dropdown form-select" data-id="${inq.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; width: auto; height: auto;">
                  <option value="Unread" ${inq.status === 'Unread' ? 'selected' : ''}>Unread</option>
                  <option value="Replied" ${inq.status === 'Replied' ? 'selected' : ''}>Replied</option>
                  <option value="Tour Scheduled" ${inq.status === 'Tour Scheduled' ? 'selected' : ''}>Tour Scheduled</option>
                  <option value="Resolved" ${inq.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-action-view-inquiry').forEach(btn => {
        btn.onclick = async () => {
          const inq = await API.getInquiryById(btn.dataset.id);
          const schoolObj = await API.getSchoolById(schoolId);
          Modals.openInquiryThreadModal(inq, schoolObj, async () => {
            await reloadInquiries();
          });
        };
      });

      tbody.querySelectorAll('.inquiry-status-dropdown').forEach(sel => {
        sel.onchange = async () => {
          const newStatus = sel.value;
          try {
            await API.updateInquiryStatus(sel.dataset.id, { status: newStatus });
            State.showToast(`Inquiry marked as "${newStatus}"!`, 'success');
            await reloadInquiries();
          } catch (err) {
            State.showToast(err.message, 'error');
          }
        };
      });
    };

    const reloadInquiries = async () => {
      try {
        currentInquiries = await API.getInquiries({ schoolId });
        const inqStats = await API.getInquiryStats(schoolId);

        // Update stats
        const statTotal = document.getElementById('stat-inq-total');
        const statUnread = document.getElementById('stat-inq-unread');
        const statTour = document.getElementById('stat-inq-tour');
        const statReplied = document.getElementById('stat-inq-replied');
        const statResolved = document.getElementById('stat-inq-resolved');

        if (statTotal) statTotal.innerText = inqStats.total;
        if (statUnread) statUnread.innerText = inqStats.unread;
        if (statTour) statTour.innerText = inqStats.tourRequests;
        if (statReplied) statReplied.innerText = inqStats.replied;
        if (statResolved) statResolved.innerText = inqStats.resolved;

        let filtered = currentInquiries;
        if (inqActiveFilter === 'Unread') {
          filtered = filtered.filter(i => i.status === 'Unread');
        } else if (inqActiveFilter === 'Tour Requested') {
          filtered = filtered.filter(i => i.tourRequested || (i.category && i.category.toLowerCase().includes('tour')));
        } else if (inqActiveFilter === 'Replied') {
          filtered = filtered.filter(i => i.status === 'Replied' || i.status === 'Tour Scheduled');
        } else if (inqActiveFilter === 'Resolved') {
          filtered = filtered.filter(i => i.status === 'Resolved');
        }

        if (inqSearchQuery.trim()) {
          const q = inqSearchQuery.toLowerCase().trim();
          filtered = filtered.filter(i =>
            (i.parentName || '').toLowerCase().includes(q) ||
            (i.inquiryNumber || '').toLowerCase().includes(q) ||
            (i.studentName || '').toLowerCase().includes(q) ||
            (i.subject || '').toLowerCase().includes(q) ||
            (i.gradeApplying || '').toLowerCase().includes(q)
          );
        }

        renderInquiriesTable(filtered);
      } catch (err) {
        console.error("Error loading inquiries:", err);
      }
    };

    // Filter tabs click
    const inqTabs = document.querySelectorAll('.inquiry-tab');
    inqTabs.forEach(tab => {
      tab.onclick = () => {
        inqTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'var(--bg-main)';
          t.style.color = 'var(--text-main)';
          t.style.fontWeight = '600';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--primary-900)';
        tab.style.color = '#fff';
        tab.style.fontWeight = '700';

        inqActiveFilter = tab.dataset.status;
        reloadInquiries();
      };
    });

    // Inquiries Search Input
    const inqSearchInput = document.getElementById('inquiries-search-input');
    if (inqSearchInput) {
      inqSearchInput.oninput = (e) => {
        inqSearchQuery = e.target.value;
        reloadInquiries();
      };
    }

    // New Inquiry button
    document.getElementById('btn-dash-new-inquiry')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openInquireAdmissionModal(schoolObj, async () => {
        await reloadInquiries();
      });
    });

    // Export Inquiries CSV
    document.getElementById('btn-inquiries-export-csv')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      const inqList = currentInquiries.length > 0 ? currentInquiries : await API.getInquiries({ schoolId });
      let csvContent = "data:text/csv;charset=utf-8," +
        `SkoolFinder Ghana Admissions Inquiries - ${schoolObj.name}\n` +
        `Reference Code,Parent Name,Phone,WhatsApp,Email,Student Candidate,Grade Applying,Category,Campus Tour Requested,Status,Logged Date\n`;
      
      inqList.forEach(i => {
        csvContent += `"${i.inquiryNumber}","${i.parentName}","${i.parentPhone}","${i.parentWhatsapp || ''}","${i.parentEmail || ''}","${i.studentName || ''}","${i.gradeApplying}","${i.category}","${i.tourRequested ? 'Yes' : 'No'}","${i.status}","${i.createdAt}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${schoolObj.slug}_inquiries_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      State.showToast(`Admissions inquiries exported (${inqList.length} threads)!`, 'success');
    });

    // Bursary Hub: Issue Student Fee Bill
    document.getElementById('btn-dash-issue-invoice')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openCreateInvoiceModal(schoolId, schoolObj.name, () => {
        App.refreshCurrentView();
      });
    });

    // Bursary Hub: Log Fee Payment
    document.querySelectorAll('.btn-dash-pay-fee').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const invId = e.currentTarget.dataset.invid;
        const inv = await API.getInvoiceById(invId);
        if (inv) {
          Modals.openFeePaymentModal(inv, () => {
            App.refreshCurrentView();
          });
        }
      });
    });

    // Bursary Hub: Send SMS Reminder
    document.querySelectorAll('.btn-dash-send-reminder').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = e.currentTarget.dataset.parent;
        const phone = e.currentTarget.dataset.phone;
        const bal = Number(e.currentTarget.dataset.balance).toLocaleString();
        const invNum = e.currentTarget.dataset.invnum;
        State.showToast(`📲 SMS Reminder Dispatched to ${phone} (${parent}): "Reminder: Term fee balance of GH₵ ${bal} for invoice ${invNum} is due. Settle via SkoolFinder MoMo."`, 'success');
      });
    });

    // Automated SMS Gateway: Send Targeted Parent SMS
    document.getElementById('btn-dash-open-send-sms')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openSendSMSModal(schoolId, schoolObj.name, {}, () => {
        App.refreshCurrentView();
      });
    });

    // Automated SMS Gateway: Broadcast to Parents
    document.getElementById('btn-dash-open-broadcast')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openBroadcastSMSModal(schoolId, schoolObj.name, () => {
        App.refreshCurrentView();
      });
    });

    // Academic Gradebook: View Stamped Report Card
    document.querySelectorAll('.btn-dash-view-rc').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const rcId = e.currentTarget.dataset.rcid;
        const rc = await API.getReportCardById(rcId);
        if (rc) {
          Modals.openReportCardModal(rc);
        }
      });
    });

    // Academic Gradebook: Edit Student Grades
    document.querySelectorAll('.btn-dash-edit-rc').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const rcId = e.currentTarget.dataset.rcid;
        const rc = await API.getReportCardById(rcId);
        if (rc) {
          Modals.openGradeEntryModal(schoolId, rc, () => {
            App.refreshCurrentView();
          });
        }
      });
    });

    // Academic Gradebook: Broadcast Reports Ready SMS to Parents
    document.getElementById('btn-dash-broadcast-reports-sms')?.addEventListener('click', async () => {
      try {
        await API.broadcastSMS(schoolId, {
          category: 'Academic Report Card',
          messageText: `GIS OFFICIAL NOTICE: Term 1 Continuous Assessment & Terminal Exam Report Cards for all classes have been certified. Parents can log in to view and download official stamped PDF report sheets: skoolfinder.gh/#/parent-portal`
        });
        State.showToast("📲 Broadcast SMS dispatched to all parents: 'Terminal Report Cards Available'!", "success");
      } catch (err) {
        State.showToast(err.message, "error");
      }
    });

    // Feature 10: Fleet Delay Alert Broadcaster Modal
    document.querySelectorAll('.btn-dash-broadcast-delay').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const routeId = e.currentTarget.dataset.routeid;
        try {
          const route = await API.getTransportRouteById(routeId);
          Modals.openBroadcastBusDelayModal(route, () => {
            App.refreshCurrentView();
          });
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 10: Fleet-wide Emergency Broadcaster
    document.getElementById('btn-dash-fleet-emergency-alert')?.addEventListener('click', async () => {
      try {
        const routes = await API.getTransportRoutes({ schoolId });
        if (routes && routes[0]) {
          Modals.openBroadcastBusDelayModal(routes[0], () => {
            App.refreshCurrentView();
          });
        }
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    });

    // Feature 10: Stop Tracker Modal
    document.querySelectorAll('.btn-dash-track-route').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const routeId = e.currentTarget.dataset.routeid;
        try {
          const route = await API.getTransportRouteById(routeId);
          Modals.openBusRouteTrackerModal(route);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 10: Advance Route Stop
    document.querySelectorAll('.btn-dash-advance-stop').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const routeId = e.currentTarget.dataset.routeid;
        const curIdx = parseInt(e.currentTarget.dataset.currentidx || '0', 10);
        try {
          const nextIdx = (curIdx + 1) % 5;
          await API.updateBusRouteStatus(routeId, {
            currentStopIndex: nextIdx,
            status: nextIdx === 4 ? 'Completed Run' : 'In Transit'
          });
          State.showToast(`Route advanced to next landmark! (Stop #${nextIdx + 1})`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 11: Dashboard Club Details / Roster Modal
    document.querySelectorAll('.btn-dash-club-details').forEach(btn => {
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

    // Feature 11: Dashboard Club Tournaments Modal
    document.querySelectorAll('.btn-dash-club-fixtures').forEach(btn => {
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

    // Feature 11: Award Student Merit Badge
    document.querySelectorAll('.btn-award-merit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const clubId = e.currentTarget.dataset.clubid;
        const studentId = e.currentTarget.dataset.studentid;
        const studentName = e.currentTarget.dataset.studentname;
        
        const badgeName = prompt(`Enter Merit Badge/Honor for ${studentName}:`, 'Outstanding Teamwork & Skill');
        if (!badgeName || !badgeName.trim()) return;

        try {
          await API.awardClubMerit(clubId, studentId, { badgeName: badgeName.trim() });
          State.showToast(`Awarded badge "${badgeName.trim()}" to ${studentName}!`, 'success');
          App.refreshCurrentView();
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 12: Dashboard Alumni Profile Modal
    document.querySelectorAll('.btn-dash-alumni-profile').forEach(btn => {
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

    // Feature 12: Dashboard Alumni Book Mentorship Modal
    document.querySelectorAll('.btn-dash-alumni-book').forEach(btn => {
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

    // Feature 13: Log Sickbay Visit Modal
    document.getElementById('btn-dash-log-sickbay')?.addEventListener('click', () => {
      Modals.openLogSickbayVisitModal(() => {
        App.refreshCurrentView();
      });
    });

    // Feature 13: View Student Medical Profile Modal
    document.querySelectorAll('.btn-dash-med-profile').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const studentId = e.currentTarget.dataset.studentid;
        try {
          const record = await API.getStudentMedicalRecord(studentId);
          Modals.openStudentMedicalProfileModal(record);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 13: View Sickbay Encounter Details Modal
    document.querySelectorAll('.btn-dash-sickbay-details').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const logId = e.currentTarget.dataset.logid;
        try {
          const logs = await API.getSickbayLogs({ schoolId });
          const log = (logs || []).find(l => l.id === logId) || logs[0];
          Modals.openSickbayVisitDetailsModal(log);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 13: Dispatch Emergency SMS to Parent
    document.querySelectorAll('.btn-dash-emergency-sms').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const logId = e.currentTarget.dataset.logid;
        const studentName = e.currentTarget.dataset.studentname;
        const complaint = e.currentTarget.dataset.complaint;
        try {
          await API.dispatchEmergencyMedicalSMS(logId, {
            parentPhone: '+233 24 431 8900',
            reason: `Infirmary update on ${studentName}: ${complaint}`
          });
          State.showToast(`Emergency medical alert SMS sent to parent (+233 24 431 8900) regarding ${studentName}!`, 'success');
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 16: View Digital ID Badge Modal
    document.querySelectorAll('.btn-dash-view-digital-id').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const studentId = e.currentTarget.dataset.studentid;
        try {
          const digitalId = await API.getStudentDigitalID(studentId);
          Modals.openDigitalIDCardModal(digitalId);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Feature 16: Gate Scan Button
    document.querySelectorAll('.btn-dash-scan-gate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indexNumber = e.currentTarget.dataset.index;
        Modals.openVerifyIDScannerModal(indexNumber);
      });
    });

    // Feature 16: Top Open Gate Scanner
    document.getElementById('btn-dash-open-gate-scanner')?.addEventListener('click', () => {
      Modals.openVerifyIDScannerModal('GIS-2026-0842');
    });

    // SaaS Subscription & Plan Upgrades Modal Trigger
    document.getElementById('btn-choose-plan')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openSaaSSubscriptionModal(schoolObj);
    });

    document.getElementById('btn-manage-subscription')?.addEventListener('click', async () => {
      const schoolObj = await API.getSchoolById(schoolId);
      Modals.openSaaSSubscriptionModal(schoolObj);
    });

    // Initial load
    reloadPipeline();
    reloadInquiries();
  }
};
