/**
 * SkoolFinder - Navbar Component
 */
const Navbar = {
  isMobileMenuOpen: false,

  render() {
    return `
      <header class="site-header">
        <div class="container nav-wrapper">
          <!-- Brand Logo -->
          <a href="#" id="nav-brand-logo" class="brand-logo">
            <div class="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span>SkoolFinder</span>
          </a>

          <!-- Main Nav Links (Desktop) -->
          <ul class="nav-links">
            <li>
              <a href="#" id="nav-link-schools" class="nav-link ${State.currentView === 'directory' ? 'active' : ''}">
                Find Schools
              </a>
            </li>
            <li>
              <a href="#" id="nav-link-suppliers" class="nav-link ${State.currentView === 'suppliers' ? 'active' : ''}">
                Suppliers & RFQs
              </a>
            </li>
            <li>
              <a href="#" id="nav-link-jobs" class="nav-link ${State.currentView === 'jobs' ? 'active' : ''}">
                Find Tutors & Jobs
              </a>
            </li>
            <li>
              <a href="#" id="nav-link-cssps" class="nav-link ${State.currentView === 'cssps' ? 'active' : ''}">
                🎓 CSSPS Predictor
              </a>
            </li>
            <li>
              <a href="#" id="nav-link-resources" class="nav-link ${State.currentView === 'past-questions' ? 'active' : ''}">
                📚 Past Questions
              </a>
            </li>
            ${State.currentUser && State.currentUser.role === 'parent' ? `
              <li>
                <a href="#" id="nav-link-parent" class="nav-link ${State.currentView === 'parent-portal' ? 'active' : ''}" style="color: var(--primary-700); font-weight: 700;">
                  👨‍👩‍👧 My Admissions
                </a>
              </li>
            ` : ''}
            <li>
              <a href="#" id="nav-link-dashboard" class="nav-link ${State.currentView === 'dashboard' ? 'active' : ''}">
                ${State.isAuthenticated() && State.isSchoolAdmin() ? '🏫 School Portal' : '🔒 School Portal'}
              </a>
            </li>
          </ul>

          <!-- Nav Action Buttons -->
          <div class="nav-actions">
            <button id="btn-nav-akosua-ai" class="btn-pill nav-action-desktop" style="font-size: 0.8rem; padding: 0.45rem 0.85rem; background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 100%); color: #ffffff; border: 1.5px solid #f59e0b; box-shadow: 0 2px 6px rgba(245,158,11,0.25);" title="Ask Akosua AI Admissions Advisor">
              <span>👩🏾‍💼</span> Akosua AI
            </button>

            <button id="btn-nav-compare" class="btn-pill btn-outline nav-action-desktop" style="position: relative;">
              <span>⚖️</span>
              <span>Compare</span>
              ${State.comparisonList.length > 0 ? `
                <span class="comparison-counter-pill" style="font-size: 0.7rem; padding: 0.1rem 0.45rem;">
                  ${State.comparisonList.length}
                </span>
              ` : ''}
            </button>

            <button id="btn-nav-track" class="btn-pill btn-outline nav-action-desktop" style="font-size: 0.8rem; padding: 0.45rem 0.85rem;" title="Track Inquiries & Application Status">
              <span>🔍</span> Track Status
            </button>

            ${State.isAuthenticated() ? `
              <div class="nav-action-desktop" style="display: flex; align-items: center; gap: 0.4rem;">
                <span class="badge ${State.currentUser.role === 'school_admin' ? 'badge-gold' : (State.currentUser.role === 'teacher' ? 'badge-cambridge' : 'badge-emerald')}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;" title="Logged in as ${State.currentUser.email}">
                  ${State.currentUser.avatar || '👤'} ${State.currentUser.name.split(' ')[0]} (${State.currentUser.role === 'school_admin' ? 'Admin' : (State.currentUser.role === 'parent' ? 'Parent' : State.currentUser.role)})
                </span>
                <button id="btn-nav-logout" class="btn-pill btn-outline" style="padding: 0.4rem 0.7rem; font-size: 0.78rem;" title="Sign out of account">
                  <span>🚪</span> Logout
                </button>
              </div>
            ` : `
              <button id="btn-nav-login" class="btn-pill btn-primary nav-action-desktop" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                <span>🔑</span> Sign In
              </button>
              <button id="btn-nav-list-school" class="btn-pill btn-gold nav-action-desktop">
                <span>➕</span> List Your School
              </button>
            `}

            <!-- Mobile Hamburger Menu Button -->
            <button id="btn-mobile-menu-toggle" class="mobile-menu-btn ${this.isMobileMenuOpen ? 'active' : ''}" aria-label="Toggle Navigation Menu">
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Dropdown -->
        <div id="mobile-nav-drawer" class="mobile-nav-drawer ${this.isMobileMenuOpen ? 'open' : ''}">
          <div class="mobile-nav-links">
            ${State.isAuthenticated() ? `
              <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.75rem; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">${State.currentUser.name}</div>
                  <div style="font-size: 0.78rem; color: #64748b;">${State.currentUser.email} • <strong>${State.currentUser.role}</strong></div>
                </div>
                <button id="mob-btn-logout" class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Logout</button>
              </div>
            ` : `
              <div style="margin-bottom: 0.75rem;">
                <button id="mob-btn-login" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-size: 0.9rem; padding: 0.6rem;">
                  <span>🔑</span> Sign In to Account
                </button>
              </div>
            `}

            <a href="#" id="mob-link-schools" class="mobile-nav-item ${State.currentView === 'directory' ? 'active' : ''}">
              <span>🏫</span> Find Schools
            </a>
            <a href="#" id="mob-link-suppliers" class="mobile-nav-item ${State.currentView === 'suppliers' ? 'active' : ''}">
              <span>📦</span> Suppliers & RFQs
            </a>
            <a href="#" id="mob-link-jobs" class="mobile-nav-item ${State.currentView === 'jobs' ? 'active' : ''}">
              <span>👨‍🏫</span> Find Tutors & Jobs
            </a>
            <a href="#" id="mob-link-cssps" class="mobile-nav-item ${State.currentView === 'cssps' ? 'active' : ''}">
              <span>🎓</span> CSSPS Placement Predictor
            </a>
            <a href="#" id="mob-link-resources" class="mobile-nav-item ${State.currentView === 'past-questions' ? 'active' : ''}">
              <span>📚</span> Past Questions & Schemes
            </a>
            ${State.currentUser && State.currentUser.role === 'parent' ? `
              <a href="#" id="mob-link-parent" class="mobile-nav-item ${State.currentView === 'parent-portal' ? 'active' : ''}">
                <span>👨‍👩‍👧</span> My Admissions & Inquiries
              </a>
            ` : ''}
            <a href="#" id="mob-link-dashboard" class="mobile-nav-item ${State.currentView === 'dashboard' ? 'active' : ''}">
              <span>${State.isAuthenticated() && State.isSchoolAdmin() ? '🏫' : '🔒'}</span> School Admin Portal
            </a>
            <a href="#" id="mob-link-compare" class="mobile-nav-item ${State.currentView === 'compare' ? 'active' : ''}">
              <span>⚖️</span> Side-by-Side Compare ${State.comparisonList.length > 0 ? `(${State.comparisonList.length})` : ''}
            </a>
            <a href="#" id="mob-link-track" class="mobile-nav-item">
              <span>🔍</span> Track Inquiries & Admissions
            </a>
            <a href="#" id="mob-link-akosua-ai" class="mobile-nav-item" style="color: #1d4ed8; font-weight: 700; background: #eff6ff;">
              <span>👩🏾‍💼</span> Akosua AI Advisor (CSSPS & Admissions)
            </a>
            ${!State.isAuthenticated() ? `
              <div style="padding-top: 0.75rem; margin-top: 0.5rem; border-top: 1px solid var(--border-light);">
                <button id="mob-link-list-school" class="btn-pill btn-gold" style="width: 100%; justify-content: center;">
                  <span>➕</span> List Your School
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </header>
    `;
  },

  attachEvents() {
    // Brand Logo
    document.getElementById('nav-brand-logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isMobileMenuOpen = false;
      App.navigate('home');
    });

    // Desktop Nav Links
    document.getElementById('nav-link-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
      App.navigate('directory');
    });

    document.getElementById('nav-link-suppliers')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('suppliers');
    });

    document.getElementById('nav-link-jobs')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('jobs');
    });

    document.getElementById('nav-link-cssps')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('cssps');
    });

    document.getElementById('nav-link-resources')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('past-questions');
    });

    document.getElementById('nav-link-parent')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('parent-portal');
    });

    const handleDashboardClick = (e) => {
      e.preventDefault();
      if (!State.isAuthenticated()) {
        Modals.openLoginModal({
          notice: "🔒 Access Restricted: The School Administration Portal is protected. Please sign in with verified school administrator credentials.",
          onSuccess: (user) => {
            if (user.role === 'school_admin') {
              App.navigate('dashboard', user.schoolId || 'sch-gis-accra');
            } else if (user.role === 'parent') {
              App.navigate('parent-portal');
            } else {
              App.navigate('dashboard', 'sch-gis-accra');
            }
          }
        });
        return;
      }
      if (State.currentUser.role === 'parent') {
        State.showToast("Signed in as Parent — opening your Parent Admissions Portal", "info");
        App.navigate('parent-portal');
        return;
      }
      App.navigate('dashboard', (State.currentUser.role === 'school_admin' && State.currentUser.schoolId) ? State.currentUser.schoolId : 'sch-gis-accra');
    };

    document.getElementById('nav-link-dashboard')?.addEventListener('click', handleDashboardClick);

    // Auth Action Buttons
    document.getElementById('btn-nav-login')?.addEventListener('click', () => {
      Modals.openLoginModal();
    });

    document.getElementById('btn-nav-logout')?.addEventListener('click', () => {
      State.logout();
    });

    document.getElementById('mob-btn-login')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openLoginModal();
    });

    document.getElementById('mob-btn-logout')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      State.logout();
    });

    document.getElementById('btn-nav-akosua-ai')?.addEventListener('click', () => {
      if (typeof AIChatbot !== 'undefined') {
        AIChatbot.open();
      }
    });

    document.getElementById('mob-link-akosua-ai')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      if (typeof AIChatbot !== 'undefined') {
        AIChatbot.open();
      }
    });

    document.getElementById('btn-nav-compare')?.addEventListener('click', () => {
      App.navigate('compare');
    });

    document.getElementById('btn-nav-track')?.addEventListener('click', () => {
      Modals.openTrackInquiryModal();
    });

    document.getElementById('btn-nav-list-school')?.addEventListener('click', () => {
      Modals.openListSchoolModal();
    });

    // Mobile Hamburger Toggle
    const toggleBtn = document.getElementById('btn-mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (toggleBtn && drawer) {
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        drawer.classList.toggle('open', this.isMobileMenuOpen);
        toggleBtn.classList.toggle('active', this.isMobileMenuOpen);
      };
    }

    // Mobile Links
    const closeMobile = () => {
      this.isMobileMenuOpen = false;
      if (drawer) drawer.classList.remove('open');
      if (toggleBtn) toggleBtn.classList.remove('active');
    };

    document.getElementById('mob-link-schools')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
      App.navigate('directory');
    });

    document.getElementById('mob-link-suppliers')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('suppliers');
    });

    document.getElementById('mob-link-jobs')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('jobs');
    });

    document.getElementById('mob-link-cssps')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('cssps');
    });

    document.getElementById('mob-link-resources')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('past-questions');
    });

    document.getElementById('mob-link-parent')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('parent-portal');
    });

    document.getElementById('mob-link-dashboard')?.addEventListener('click', (e) => {
      closeMobile();
      handleDashboardClick(e);
    });

    document.getElementById('mob-link-compare')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('compare');
    });

    document.getElementById('mob-link-track')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      Modals.openTrackInquiryModal();
    });

    document.getElementById('mob-link-list-school')?.addEventListener('click', () => {
      closeMobile();
      Modals.openListSchoolModal();
    });
  }
};
