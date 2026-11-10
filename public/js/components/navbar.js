/**
 * SkoolFinder - Navbar Component
 */
const Navbar = {
  isMobileMenuOpen: false,
  isSwitchingRole: false,
  lastView: null,

  getActivePortal() {
    const view = State.currentView;
    if (view === 'parents' || view === 'parent-portal') return 'parent';
    if (view === 'schools' || view === 'dashboard') return 'school';
    if (view === 'teachers' || view === 'jobs') return 'teacher';
    if (view === 'suppliers' || view === 'supplier-dashboard') return 'supplier';
    if (view === 'admin') return 'admin';
    return null;
  },

  render() {
    if (this.lastView !== State.currentView) {
      this.isSwitchingRole = false;
      this.lastView = State.currentView;
    }
    const activePortal = this.getActivePortal();
    const showOnlyActive = activePortal && !this.isSwitchingRole;
    const userFirstName = (typeof State !== 'undefined' && State.currentUser) ? (() => {
      const raw = (State.currentUser.name || State.currentUser.fullName || State.currentUser.email || 'User').split(' ')[0];
      return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    })() : '';
    if (typeof State !== 'undefined' && State.isWhitelabel) {
      return `
        <header class="site-header whitelabel-header" style="background: #0a1128; border-bottom: 2px solid var(--gold-500); padding: 0.75rem 0;">
          <div class="container nav-wrapper" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.6rem;">🎓</span>
              <div>
                <div style="font-weight: 800; font-size: 1.1rem; color: #ffffff; font-family: var(--font-heading); display: flex; align-items: center; gap: 0.5rem;">
                  Official Admissions Portal
                  <span class="badge badge-emerald" style="font-size: 0.65rem; padding: 0.15rem 0.45rem;">Verified Campus 🛡️</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--gold-400);">Admissions & Student Enrollment Gateway</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button class="btn-pill btn-emerald" onclick="document.getElementById('btn-apply-admission-online')?.click()" style="font-size: 0.82rem; padding: 0.45rem 0.95rem;">
                <span>📝</span> Apply Online
              </button>
              <button class="btn-pill btn-gold" onclick="document.getElementById('btn-inquire-tour')?.click()" style="font-size: 0.82rem; padding: 0.45rem 0.95rem;">
                <span>📅</span> Book Tour
              </button>
              <a href="/" class="btn-pill btn-outline" style="font-size: 0.78rem; padding: 0.4rem 0.85rem; color: #cbd5e1; border-color: rgba(255,255,255,0.2);">
                SkoolFinder &rarr;
              </a>
            </div>
          </div>
        </header>
      `;
    }
        const isImpersonating = typeof State !== 'undefined' && State.isImpersonating && State.isImpersonating();
    const impersonationBanner = isImpersonating ? `
      <div id="impersonation-alert-banner" style="background: linear-gradient(90deg, #92400e 0%, #b45309 100%); color: #ffffff; padding: 0.55rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 700; z-index: 1000; box-shadow: 0 2px 6px rgba(0,0,0,0.12);">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-size: 1.15rem;">🛡️</span>
          <span>SUPER ADMIN IMPERSONATION: Viewing <strong>${State.currentUser?.impersonatedSchoolName || 'School'}</strong> as Proprietor</span>
        </div>
        <button id="btn-navbar-exit-impersonate" class="btn-pill" style="background: #0f172a; color: #fff; border: 1px solid rgba(255,255,255,0.3); font-weight: 800; cursor: pointer; padding: 0.3rem 0.85rem; font-size: 0.76rem; border-radius: 999px;">
          🚪 Exit Back to Admin HQ
        </button>
      </div>
    ` : '';

    return `
      ${impersonationBanner}
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

          <!-- Main Nav Links -->
          <ul class="nav-links">
            <li>
              <a href="/" id="nav-link-home" class="nav-link-direct ${State.currentView === 'home' ? 'active' : ''}">
                <span>🏠</span> Home
              </a>
            </li>
            <li>
              <a href="/directory" id="nav-link-directory" class="nav-link-direct ${State.currentView === 'directory' ? 'active' : ''}">
                <span>🏫</span> Browse Schools
              </a>
            </li>
            <li class="nav-item-dropdown" style="position: relative;">
              <button type="button" id="nav-link-portals" class="nav-link-direct" style="background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700; color: #0A2046; font-size: 0.92rem;">
                <span>🌐</span> Explore Portals <span style="font-size: 0.65rem;">▼</span>
              </button>
              <div id="nav-portals-menu" class="nav-portals-dropdown" style="display: none; position: absolute; top: calc(100% + 8px); left: 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 30px rgba(10,32,70,0.12); padding: 0.5rem; min-width: 270px; z-index: 1000;">
                <a href="/parents" class="dropdown-item-portal" data-portal="parents" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.8rem; border-radius: 8px; text-decoration: none; color: #0A2046; font-size: 0.85rem; font-weight: 700; transition: background 0.15s;">
                  <span style="font-size: 1.2rem;">👨‍👩‍👧</span>
                  <div>
                    <div>Parents &amp; Guardians</div>
                    <div style="font-size: 0.72rem; color: #64748b; font-weight: 500;">Free discovery &amp; planning</div>
                  </div>
                </a>
                <a href="/for-schools" class="dropdown-item-portal" data-portal="for-schools" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.8rem; border-radius: 8px; text-decoration: none; color: #0A2046; font-size: 0.85rem; font-weight: 700; transition: background 0.15s;">
                  <span style="font-size: 1.2rem;">🏫</span>
                  <div>
                    <div>School Owners &amp; Proprietors</div>
                    <div style="font-size: 0.72rem; color: #64748b; font-weight: 500;">Admissions &amp; growth</div>
                  </div>
                </a>
                <a href="/for-teachers" class="dropdown-item-portal" data-portal="for-teachers" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.8rem; border-radius: 8px; text-decoration: none; color: #0A2046; font-size: 0.85rem; font-weight: 700; transition: background 0.15s;">
                  <span style="font-size: 1.2rem;">🧑‍🏫</span>
                  <div>
                    <div>Teachers &amp; Professionals</div>
                    <div style="font-size: 0.72rem; color: #64748b; font-weight: 500;">Careers &amp; tutoring</div>
                  </div>
                </a>
                <a href="/for-suppliers" class="dropdown-item-portal" data-portal="for-suppliers" style="display: flex; align-items: center; gap: 0.65rem; padding: 0.6rem 0.8rem; border-radius: 8px; text-decoration: none; color: #0A2046; font-size: 0.85rem; font-weight: 700; transition: background 0.15s;">
                  <span style="font-size: 1.2rem;">📦</span>
                  <div>
                    <div>Suppliers &amp; Providers</div>
                    <div style="font-size: 0.72rem; color: #64748b; font-weight: 500;">Procurement &amp; tenders</div>
                  </div>
                </a>
              </div>
            </li>
          </ul>

          <!-- Nav Action Buttons: Clean & Uncluttered -->
          <div class="nav-actions">
            ${State.comparisonList.length > 0 ? `
              <button id="btn-nav-compare" class="btn-pill btn-outline nav-action-desktop" title="Compare Selected Schools">
                <span>⚖️</span>
                <span>Compare</span>
                <span class="comparison-counter-pill" style="font-size: 0.7rem; padding: 0.1rem 0.45rem;">
                  ${State.comparisonList.length}
                </span>
              </button>
            ` : ''}

            ${State.isAuthenticated() ? `
              <div class="nav-action-desktop" style="display: flex; align-items: center; gap: 0.45rem;">
                ${State.currentUser.role !== 'super_admin' ? `
                  <button id="btn-nav-my-portal" class="btn-pill ${State.currentUser.activePersona === 'school_admin' ? 'btn-gold' : (State.currentUser.activePersona === 'teacher' ? 'btn-emerald' : 'btn-primary')}" style="font-size: 0.8rem; padding: 0.38rem 0.85rem; font-weight: 700;" title="Open your active workspace">
                    <span>${State.currentUser.activePersona === 'parent' ? '👨‍👩‍👧 Parent Space' : (State.currentUser.activePersona === 'school_admin' ? '🏫 School OS' : (State.currentUser.activePersona === 'teacher' ? '🧑‍🏫 Tutor Desk' : (State.currentUser.activePersona === 'supplier' ? '📦 Vendor Hub' : '👨‍👩‍👧 Parent Space')))}</span>
                  </button>
                ` : ''}
                <span class="badge ${State.currentUser.role === 'school_admin' ? 'badge-gold' : (State.currentUser.role === 'teacher' ? 'badge-cambridge' : 'badge-emerald')}" style="font-size: 0.8rem; padding: 0.38rem 0.75rem; text-transform: none; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;" title="Logged in as ${State.currentUser.email || ''}">
                  ${State.currentUser.avatar || '👤'} Welcome ${userFirstName}
                </span>
                <button id="btn-nav-logout" class="btn-pill" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.38rem 0.85rem; font-size: 0.8rem; font-weight: 700; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; cursor: pointer; border-radius: 9999px; transition: all 0.2s;" onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'" title="Sign out of account" aria-label="Sign out of account">
                  <span>🚪</span> Sign Out
                </button>
              </div>
            ` : `
              <button id="btn-nav-signin" class="btn-pill nav-action-desktop" style="font-size: 0.84rem; padding: 0.42rem 0.95rem; font-weight: 800; background: linear-gradient(135deg, #091e42 0%, #1e3a8a 100%); color: #ffffff; border: 1px solid #2563eb; box-shadow: 0 2px 8px rgba(9,30,66,0.25); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer;" title="Super Admin HQ & User Sign In">
                <span>🛡️</span> Sign In
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

        <!-- WHO ARE YOU: SUB-HEADER STRIP (Context-Aware Single Portal Isolation, Hidden on Clean Homepage) -->
        ${State.currentView !== 'home' ? `
        <div class="who-are-you-bar">
          <div class="container who-are-you-inner">
            <span class="who-label">
              <span>👤</span> ${showOnlyActive ? 'Current Portal:' : 'Who Are You:'}
            </span>
            <div class="who-roles-list">
              ${showOnlyActive ? `
                ${activePortal === 'parent' ? `
                  <a href="/parents" id="who-nav-parent" class="who-role-pill active">
                    <span>👨‍👩‍👧</span> Parent Space
                  </a>
                ` : ''}
                ${activePortal === 'school' ? `
                  <a href="/schools" id="who-nav-school" class="who-role-pill active">
                    <span>🏫</span> School Owner / Proprietor
                  </a>
                ` : ''}
                ${activePortal === 'teacher' ? `
                  <a href="/teachers" id="who-nav-teacher" class="who-role-pill active">
                    <span>🧑‍🏫</span> Teacher
                  </a>
                ` : ''}
                ${activePortal === 'supplier' ? `
                  <a href="/suppliers" id="who-nav-supplier" class="who-role-pill active">
                    <span>📦</span> Supplier
                  </a>
                ` : ''}
                ${activePortal === 'admin' ? `
                  <a href="/admin" id="who-nav-admin" class="who-role-pill active">
                    <span>🛡️</span> Super Administrator
                  </a>
                ` : ''}
                <button type="button" id="btn-switch-portal" class="who-switch-btn" title="Switch to another portal">
                  <span>⇄</span> Switch Role
                </button>
              ` : `
                <a href="/parents" id="who-nav-parent" class="who-role-pill ${activePortal === 'parent' ? 'active' : ''}">
                  <span>👨‍👩‍👧</span> Parent
                </a>
                <a href="/teachers" id="who-nav-teacher" class="who-role-pill ${activePortal === 'teacher' ? 'active' : ''}">
                  <span>🧑‍🏫</span> Teacher
                </a>
                <a href="/suppliers" id="who-nav-supplier" class="who-role-pill ${activePortal === 'supplier' ? 'active' : ''}">
                  <span>📦</span> Supplier
                </a>
                <a href="/schools" id="who-nav-school" class="who-role-pill ${activePortal === 'school' ? 'active' : ''}">
                  <span>🏫</span> School Owner / Proprietor
                </a>
                ${this.isSwitchingRole ? `
                  <button type="button" id="btn-cancel-switch-portal" class="who-switch-btn" title="Keep current portal">
                    <span>✕</span> Cancel
                  </button>
                ` : ''}
              `}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- Mobile Drawer Dropdown -->
        <div id="mobile-nav-drawer" class="mobile-nav-drawer ${this.isMobileMenuOpen ? 'open' : ''}">
          <div class="mobile-nav-links">

            <!-- Category 1: Public Discovery -->
            <div class="mob-category-card">
              <div class="mob-category-header">🔍 Public Discovery</div>
              <a href="/" id="mob-link-home" class="mobile-nav-item ${State.currentView === 'home' ? 'active' : ''}">
                <span>🏠</span> Home
              </a>
              <a href="/directory" id="mob-link-directory" class="mobile-nav-item ${State.currentView === 'directory' ? 'active' : ''}">
                <span>🏫</span> Browse Schools
              </a>
              ${State.comparisonList.length > 0 ? `
                <a href="#" id="mob-link-compare" class="mobile-nav-item ${State.currentView === 'compare' ? 'active' : ''}">
                  <span>⚖️</span> Compare Schools (${State.comparisonList.length})
                </a>
              ` : ''}
            </div>

            <!-- Category 2: Who Are You (Singular Roles) -->
            <div class="mob-category-card" style="border: 2px solid #1266C4;">
              <div class="mob-category-header" style="color: #0A2046; font-weight: 800; display: flex; justify-content: space-between; align-items: center;">
                <span>👤 ${showOnlyActive ? 'Current Portal' : 'Who Are You'}</span>
                ${showOnlyActive ? `
                  <button type="button" id="mob-btn-switch-portal" style="background: none; border: none; color: #1266C4; font-size: 0.75rem; font-weight: 700; cursor: pointer; text-decoration: underline;">Switch</button>
                ` : ''}
              </div>
              ${showOnlyActive ? `
                ${activePortal === 'parent' ? `
                  <a href="/parents" id="mob-who-parent" class="mobile-nav-item active">
                    <span>👨‍👩‍👧</span> Parent Space
                  </a>
                ` : ''}
                ${activePortal === 'school' ? `
                  <a href="/schools" id="mob-who-school" class="mobile-nav-item active">
                    <span>🏫</span> School Owner / Proprietor
                  </a>
                ` : ''}
                ${activePortal === 'teacher' ? `
                  <a href="/teachers" id="mob-who-teacher" class="mobile-nav-item active">
                    <span>🧑‍🏫</span> Teacher
                  </a>
                ` : ''}
                ${activePortal === 'supplier' ? `
                  <a href="/suppliers" id="mob-who-supplier" class="mobile-nav-item active">
                    <span>📦</span> Supplier
                  </a>
                ` : ''}
                ${activePortal === 'admin' ? `
                  <a href="/admin" id="mob-who-admin" class="mobile-nav-item active">
                    <span>🛡️</span> Super Administrator
                  </a>
                ` : ''}
              ` : `
                <a href="/parents" id="mob-who-parent" class="mobile-nav-item ${activePortal === 'parent' ? 'active' : ''}">
                  <span>👨‍👩‍👧</span> Parent
                </a>
                <a href="/teachers" id="mob-who-teacher" class="mobile-nav-item ${activePortal === 'teacher' ? 'active' : ''}">
                  <span>🧑‍🏫</span> Teacher
                </a>
                <a href="/suppliers" id="mob-who-supplier" class="mobile-nav-item ${activePortal === 'supplier' ? 'active' : ''}">
                  <span>📦</span> Supplier
                </a>
                <a href="/schools" id="mob-who-school" class="mobile-nav-item ${activePortal === 'school' ? 'active' : ''}">
                  <span>🏫</span> School Owner / Proprietor
                </a>
              `}
            </div>

            <!-- Bottom Guided Tour & Auth -->
            <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <a href="#" id="mob-link-tour" class="btn-pill btn-outline" style="justify-content: center; border-color: #10b981; color: #047857; font-weight: 700;">
                <span>🧭</span> Take 30s Guided Role Tour
              </a>
              ${State.isAuthenticated() ? `
                <div style="padding: 0.5rem 0.75rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; font-size: 0.84rem; font-weight: 700; color: #065f46; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                  <span>👤</span> Welcome ${userFirstName}
                </div>
                <button id="mob-btn-logout" class="btn-pill" style="width: 100%; justify-content: center; font-size: 0.88rem; font-weight: 700; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; padding: 0.6rem; display: flex; align-items: center; gap: 0.45rem; cursor: pointer;">
                  <span>🚪</span> Sign Out
                </button>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                  <button id="mob-btn-admin-signin" class="btn-pill" style="width: 100%; justify-content: center; font-size: 0.9rem; padding: 0.6rem; font-weight: 800; background: #091e42; color: #93c5fd; border: 1px solid #1e3a8a;">
                    <span>🛡️</span> Admin Sign In
                  </button>
                </div>
              `}
            </div>
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

    // Explore Portals Dropdown Events
    const portalsToggle = document.getElementById('nav-link-portals');
    const portalsMenu = document.getElementById('nav-portals-menu');
    if (portalsToggle && portalsMenu) {
      portalsToggle.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = portalsMenu.style.display === 'block';
        portalsMenu.style.display = isOpen ? 'none' : 'block';
      };

      document.addEventListener('click', (e) => {
        if (!portalsToggle.contains(e.target) && !portalsMenu.contains(e.target)) {
          portalsMenu.style.display = 'none';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') portalsMenu.style.display = 'none';
      });

      portalsMenu.querySelectorAll('.dropdown-item-portal').forEach(link => {
        link.onclick = (e) => {
          e.preventDefault();
          portalsMenu.style.display = 'none';
          const portal = link.dataset.portal;
          if (portal === 'parents') App.navigate('parents');
          else if (portal === 'for-schools') App.navigate('for-schools');
          else if (portal === 'for-teachers') App.navigate('for-teachers');
          else if (portal === 'for-suppliers') App.navigate('for-suppliers');
        };
      });
    }





    // Desktop Nav Links
    const handleHomeNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      App.navigate('home');
    };
    document.getElementById('nav-link-home')?.addEventListener('click', handleHomeNav);
    document.getElementById('mob-link-home')?.addEventListener('click', handleHomeNav);

    document.getElementById('nav-link-directory')?.addEventListener('click', (e) => {
      e.preventDefault();
      State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
      App.navigate('directory');
    });

    document.getElementById('nav-link-pricing')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('pricing');
    });



    // 5 DEDICATED PORTALS NAVIGATION
    const closeMobDrawer = () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
    };

    // Sub-header portal switch toggles
    document.getElementById('btn-switch-portal')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isSwitchingRole = true;
      document.getElementById('header-root').innerHTML = this.render();
      this.attachEvents();
    });

    document.getElementById('mob-btn-switch-portal')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isSwitchingRole = true;
      document.getElementById('header-root').innerHTML = this.render();
      this.attachEvents();
    });

    document.getElementById('btn-cancel-switch-portal')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      document.getElementById('header-root').innerHTML = this.render();
      this.attachEvents();
    });


    // Role 1: Parent
    const handleParentNav = (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      closeMobDrawer();
      App.navigate('parents');
    };
    document.getElementById('who-nav-parent')?.addEventListener('click', handleParentNav);
    document.getElementById('mob-who-parent')?.addEventListener('click', handleParentNav);

    // Role 2: Teacher
    const handleTeacherNav = (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      closeMobDrawer();
      App.navigate('teachers');
    };
    document.getElementById('who-nav-teacher')?.addEventListener('click', handleTeacherNav);
    document.getElementById('mob-who-teacher')?.addEventListener('click', handleTeacherNav);
    document.getElementById('nav-link-teachers')?.addEventListener('click', handleTeacherNav);
    document.getElementById('mob-link-teachers')?.addEventListener('click', handleTeacherNav);

    // Role 3: Supplier
    const handleSupplierNav = (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      closeMobDrawer();
      App.navigate('suppliers');
    };
    document.getElementById('who-nav-supplier')?.addEventListener('click', handleSupplierNav);
    document.getElementById('mob-who-supplier')?.addEventListener('click', handleSupplierNav);
    document.getElementById('nav-link-suppliers')?.addEventListener('click', handleSupplierNav);
    document.getElementById('mob-link-suppliers')?.addEventListener('click', handleSupplierNav);

    // Role 4: School Owner / Proprietor
    const handleSchoolNav = (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      closeMobDrawer();
      App.navigate('schools', State.currentUser?.schoolId || 'sch-gis-accra');
    };
    document.getElementById('who-nav-school')?.addEventListener('click', handleSchoolNav);
    document.getElementById('mob-who-school')?.addEventListener('click', handleSchoolNav);
    document.getElementById('nav-link-schools')?.addEventListener('click', handleSchoolNav);
    document.getElementById('mob-link-schools')?.addEventListener('click', handleSchoolNav);

    // Portal 5: Super Admin
    const handleAdminNav = (e) => {
      e.preventDefault();
      this.isSwitchingRole = false;
      closeMobDrawer();
      if (!State.isAuthenticated() || !State.isSuperAdmin()) {
        Modals.openAdminAuthModal({ initialMode: 'signin', redirectView: 'admin' });
      } else {
        App.navigate('admin');
      }
    };
    document.getElementById('nav-link-admin')?.addEventListener('click', handleAdminNav);
    document.getElementById('mob-link-admin')?.addEventListener('click', handleAdminNav);

    // Admin Sign In Action Handlers (Desktop & Mobile)
    const handleAdminSignInModal = () => {
      Modals.openAdminAuthModal({ initialMode: 'signin', redirectView: 'admin' });
    };

    document.getElementById('btn-nav-signin')?.addEventListener('click', () => {
      Modals.openAdminAuthModal({ initialMode: 'signin', redirectView: 'admin' });
    });
    document.getElementById('btn-nav-admin-signin')?.addEventListener('click', handleAdminSignInModal);
    document.getElementById('btn-nav-admin-signup')?.addEventListener('click', handleAdminSignInModal);

    const handleMobAdminSignInModal = () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openAdminAuthModal({ initialMode: 'signin', redirectView: 'admin' });
    };

    document.getElementById('mob-btn-admin-signin')?.addEventListener('click', handleMobAdminSignInModal);
    document.getElementById('mob-btn-admin-signup')?.addEventListener('click', handleMobAdminSignInModal);

    document.getElementById('select-active-persona')?.addEventListener('change', async (e) => {
      const targetPersona = e.target.value;
      if (targetPersona && targetPersona !== State.currentUser?.activePersona) {
        await State.switchPersona(targetPersona);
      }
    });

    document.getElementById('btn-nav-my-portal')?.addEventListener('click', () => {
      const activePersona = State.currentUser?.activePersona || State.currentUser?.role;
      if (activePersona === 'school_admin' || activePersona === 'primary_proprietor' || activePersona === 'school_owner') {
        App.navigate('schools', State.currentUser?.schoolId || 'ghana-international-school');
      } else if (activePersona === 'teacher' || activePersona === 'professional') {
        App.navigate('teachers');
      } else if (activePersona === 'supplier') {
        App.navigate('suppliers');
      } else if (activePersona === 'parent') {
        App.navigate('parents');
      } else if (activePersona === 'super_admin') {
        App.navigate('admin');
      } else {
        App.navigate('directory');
      }
    });

    document.getElementById('btn-nav-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      State.logout();
    });

    document.getElementById('mob-btn-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      State.logout();
    });

    document.getElementById('btn-nav-tour')?.addEventListener('click', () => {
      Modals.openRoleTourModal();
    });

    document.getElementById('mob-link-tour')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openRoleTourModal();
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

    // Theme Toggle Logic (Scholastic Midnight)
    const updateThemeUI = (theme) => {
      const isDark = theme === 'dark';
      const icon = isDark ? '☀️' : '🌙';
      const title = isDark ? 'Switch to Scholastic Ivory Light Mode' : 'Switch to Scholastic Midnight Dark Mode';
      const desktopBtn = document.getElementById('btn-theme-toggle');
      if (desktopBtn) {
        desktopBtn.innerText = icon;
        desktopBtn.title = title;
      }
      const mobBtn = document.getElementById('mob-btn-theme-toggle');
      if (mobBtn) {
        mobBtn.innerText = icon;
        mobBtn.title = title;
      }
    };

    const toggleTheme = () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('skoolfinder_theme', next);
      updateThemeUI(next);
      State.showToast(`Theme: ${next === 'dark' ? 'Scholastic Midnight (Dark)' : 'Scholastic Ivory (Light)'}`, 'info');
    };

        
    const activeTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('skoolfinder_theme') || 'light';
    updateThemeUI(activeTheme);

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

    document.getElementById('mob-link-directory')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
      App.navigate('directory');
    });

    document.getElementById('mob-link-pricing')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('pricing');
    });

        document.getElementById('btn-navbar-exit-impersonate')?.addEventListener('click', () => {
      if (typeof State !== 'undefined' && State.stopImpersonation) {
        State.stopImpersonation();
        State.showToast("Exited impersonation mode. Welcome back to Super Admin HQ.", "info");
        App.navigate('admin');
      }
    });

    document.getElementById('mob-link-compare')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobile();
      App.navigate('compare');
    });
  }
};
