/**
 * SkoolFinder - Navbar Component
 */
const Navbar = {
  isMobileMenuOpen: false,

  render() {
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

          <!-- Main Nav Links: Public Directory & 5 Dedicated Portals -->
          <ul class="nav-links">
            <!-- Public School Discovery -->
            <li>
              <a href="#" id="nav-link-directory" class="nav-link-direct ${State.currentView === 'directory' ? 'active' : ''}">
                <span>🏫</span> Find Schools
              </a>
            </li>

            <!-- The 5 Dedicated SaaS Portals -->
            <li class="nav-item-dropdown">
              <button class="nav-dropdown-trigger" id="dropdown-portals-btn" aria-haspopup="true">
                <span>Portals ▾</span>
              </button>
              <div class="nav-dropdown-panel" id="dropdown-portals-panel" style="min-width: 320px;">
                <a href="/parents" id="nav-link-parents" class="dropdown-item ${State.currentView === 'parents' || State.currentView === 'parent-portal' ? 'active' : ''}">
                  <div class="dropdown-icon-box" style="background: #eff6ff;">👨‍👩‍👧</div>
                  <div>
                    <div class="dropdown-item-title" style="display: flex; align-items: center; gap: 0.4rem;">
                      <span>Parents Portal</span>
                      <span class="badge badge-admissions" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">/parents</span>
                    </div>
                    <div class="dropdown-item-desc">School discovery, 4-way compare, decision board & admissions tracking</div>
                  </div>
                </a>

                <a href="/teachers" id="nav-link-teachers" class="dropdown-item ${State.currentView === 'teachers' || State.currentView === 'jobs' ? 'active' : ''}">
                  <div class="dropdown-icon-box" style="background: #ecfdf5;">🧑‍🏫</div>
                  <div>
                    <div class="dropdown-item-title" style="display: flex; align-items: center; gap: 0.4rem;">
                      <span>Teachers Portal</span>
                      <span class="badge badge-emerald" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">/teachers</span>
                    </div>
                    <div class="dropdown-item-desc">Tutor marketplace, NTC vetting & school vacancies</div>
                  </div>
                </a>

                <a href="/suppliers" id="nav-link-suppliers" class="dropdown-item ${State.currentView === 'suppliers' ? 'active' : ''}">
                  <div class="dropdown-icon-box" style="background: #fffbeb;">📦</div>
                  <div>
                    <div class="dropdown-item-title" style="display: flex; align-items: center; gap: 0.4rem;">
                      <span>Suppliers Portal</span>
                      <span class="badge badge-gold" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">/suppliers</span>
                    </div>
                    <div class="dropdown-item-desc">B2B procurement, school RFQ bidding & catalog</div>
                  </div>
                </a>

                <a href="/schools" id="nav-link-schools" class="dropdown-item ${State.currentView === 'schools' || State.currentView === 'dashboard' ? 'active' : ''}">
                  <div class="dropdown-icon-box" style="background: #f3e8ff;">🏫</div>
                  <div>
                    <div class="dropdown-item-title" style="display: flex; align-items: center; gap: 0.4rem;">
                      <span>Schools Portal</span>
                      <span class="badge" style="background: #8b5cf6; color: #fff; font-size: 0.65rem; padding: 0.1rem 0.4rem;">/schools</span>
                    </div>
                    <div class="dropdown-item-desc">School Management OS: Admissions, bursar & fleet</div>
                  </div>
                </a>

                <div style="border-top: 1px solid var(--border-light); margin: 0.25rem 0;"></div>

                <a href="/admin" id="nav-link-admin" class="dropdown-item ${State.currentView === 'admin' ? 'active' : ''}">
                  <div class="dropdown-icon-box" style="background: #0f172a; color: #fff;">🛡️</div>
                  <div>
                    <div class="dropdown-item-title" style="display: flex; align-items: center; gap: 0.4rem;">
                      <span>Admin Console</span>
                      <span class="badge" style="background: #0f172a; color: #93c5fd; font-size: 0.65rem; padding: 0.1rem 0.4rem;">/admin</span>
                    </div>
                    <div class="dropdown-item-desc">Platform control, NaSIA oversight & SaaS billing</div>
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
                <button id="btn-nav-my-portal" class="btn-pill ${State.currentUser.role === 'school_admin' ? 'btn-gold' : 'btn-primary'}" style="font-size: 0.8rem; padding: 0.38rem 0.85rem; font-weight: 700;" title="Open your role workspace">
                  <span>${State.currentUser.role === 'school_admin' ? '🏫 School OS' : (State.currentUser.role === 'teacher' ? '👨‍🏫 Tutor Desk' : (State.currentUser.role === 'supplier' ? '📦 Vendor Hub' : '👨‍👩‍👧 My Portal'))}</span>
                </button>
                <span class="badge ${State.currentUser.role === 'school_admin' ? 'badge-gold' : (State.currentUser.role === 'teacher' ? 'badge-cambridge' : 'badge-emerald')}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;" title="Logged in as ${State.currentUser.email || ''}">
                  ${State.currentUser.avatar || '👤'} ${(State.currentUser.name || State.currentUser.fullName || State.currentUser.email || 'User').split(' ')[0]}
                </span>
                <button id="btn-nav-logout" class="btn-pill btn-outline" style="padding: 0.38rem 0.7rem; font-size: 0.78rem;" title="Sign out of account" aria-label="Sign out of account">
                  <span>🚪</span>
                </button>
              </div>
            ` : `
              <button id="btn-nav-login" class="btn-pill btn-outline nav-action-desktop" style="font-size: 0.84rem; padding: 0.42rem 0.9rem; font-weight: 700;">
                <span>🔑</span> Sign In
              </button>
              <button id="btn-nav-admin-signup" class="btn-pill nav-action-desktop" style="font-size: 0.84rem; padding: 0.42rem 0.85rem; font-weight: 800; background: linear-gradient(135deg, #091e42 0%, #1e3a8a 100%); color: #ffffff; border: 1px solid #3b82f6; box-shadow: 0 4px 12px rgba(9,30,66,0.3);">
                <span>🛡️</span> Admin Sign Up
              </button>
            `}

            <!-- Theme Toggle Button -->
            <button id="btn-theme-toggle" class="theme-toggle-btn" title="Toggle Scholastic Midnight Dark Mode" aria-label="Toggle Scholastic Midnight Dark Mode">
              🌙
            </button>

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
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.5rem 0.75rem 0.5rem; border-bottom: 1px solid var(--border-light); margin-bottom: 0.75rem;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">Scholastic Theme</span>
              <button id="mob-btn-theme-toggle" class="theme-toggle-btn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">🌙</button>
            </div>

            <!-- Category 1: Public Discovery -->
            <div class="mob-category-card">
              <div class="mob-category-header">🔍 Public Discovery</div>
              <a href="#" id="mob-link-directory" class="mobile-nav-item ${State.currentView === 'directory' ? 'active' : ''}">
                <span>🏫</span> Find Schools
              </a>
              ${State.comparisonList.length > 0 ? `
                <a href="#" id="mob-link-compare" class="mobile-nav-item ${State.currentView === 'compare' ? 'active' : ''}">
                  <span>⚖️</span> Compare Schools (${State.comparisonList.length})
                </a>
              ` : ''}
            </div>

            <!-- Category 2: 5 Dedicated SaaS Portals -->
            <div class="mob-category-card" style="border: 2px solid #3b82f6;">
              <div class="mob-category-header" style="color: #1d4ed8; font-weight: 800;">🏛️ The 5 Portals</div>
              <a href="/parents" id="mob-link-parents" class="mobile-nav-item ${State.currentView === 'parents' || State.currentView === 'parent-portal' ? 'active' : ''}">
                <span>👨‍👩‍👧</span> Parents Portal (/parents)
              </a>
              <a href="/teachers" id="mob-link-teachers" class="mobile-nav-item ${State.currentView === 'teachers' || State.currentView === 'jobs' ? 'active' : ''}">
                <span>🧑‍🏫</span> Teachers Portal (/teachers)
              </a>
              <a href="/suppliers" id="mob-link-suppliers" class="mobile-nav-item ${State.currentView === 'suppliers' ? 'active' : ''}">
                <span>📦</span> Suppliers Portal (/suppliers)
              </a>
              <a href="/schools" id="mob-link-schools" class="mobile-nav-item ${State.currentView === 'schools' || State.currentView === 'dashboard' ? 'active' : ''}">
                <span>🏫</span> Schools Portal (/schools)
              </a>
              <a href="/admin" id="mob-link-admin" class="mobile-nav-item ${State.currentView === 'admin' ? 'active' : ''}">
                <span>🛡️</span> Admin Console (/admin)
              </a>
            </div>

            <!-- Bottom Guided Tour & Auth -->
            <div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <a href="#" id="mob-link-tour" class="btn-pill btn-outline" style="justify-content: center; border-color: #10b981; color: #047857; font-weight: 700;">
                <span>🧭</span> Take 30s Guided Role Tour
              </a>
              ${State.isAuthenticated() ? `
                <button id="mob-btn-logout" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.88rem;">
                  <span>🚪</span> Logout (${(State.currentUser.name || State.currentUser.fullName || State.currentUser.email || 'User').split(' ')[0]})
                </button>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                  <button id="mob-btn-login" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.9rem; padding: 0.6rem; font-weight: 700;">
                    <span>🔑</span> Sign In to Account
                  </button>
                  <button id="mob-btn-admin-signup" class="btn-pill" style="width: 100%; justify-content: center; font-size: 0.9rem; padding: 0.6rem; font-weight: 800; background: #091e42; color: #93c5fd; border: 1px solid #1e3a8a;">
                    <span>🛡️</span> Admin Sign Up
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

    // Desktop Nav Links
    document.getElementById('nav-link-directory')?.addEventListener('click', (e) => {
      e.preventDefault();
      State.filters = { search: '', region: 'All', suburb: 'All', level: 'All', curriculum: 'All', boarding: 'All', feeBand: 'All', facility: 'All' };
      App.navigate('directory');
    });



    // 5 DEDICATED PORTALS NAVIGATION
    const closeMobDrawer = () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
    };

    // Portal 1: Parents
    const handleParentsNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      App.navigate('parents');
    };
    document.getElementById('nav-link-parents')?.addEventListener('click', handleParentsNav);
            document.getElementById('nav-link-parent')?.addEventListener('click', handleParentsNav);
    document.getElementById('mob-link-parents')?.addEventListener('click', handleParentsNav);
    document.getElementById('mob-link-parent')?.addEventListener('click', handleParentsNav);

    // Portal 2: Teachers
    const handleTeachersNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      App.navigate('teachers');
    };
    document.getElementById('nav-link-teachers')?.addEventListener('click', handleTeachersNav);
    document.getElementById('mob-link-teachers')?.addEventListener('click', handleTeachersNav);

    // Portal 3: Suppliers
    const handleSuppliersNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      App.navigate('suppliers');
    };
    document.getElementById('nav-link-suppliers')?.addEventListener('click', handleSuppliersNav);
    document.getElementById('mob-link-suppliers')?.addEventListener('click', handleSuppliersNav);

    // Portal 4: Schools
    const handleSchoolsNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      App.navigate('schools', State.currentUser?.schoolId || 'sch-gis-accra');
    };
    document.getElementById('nav-link-schools')?.addEventListener('click', handleSchoolsNav);
    document.getElementById('nav-link-dashboard')?.addEventListener('click', handleSchoolsNav);
    document.getElementById('mob-link-schools')?.addEventListener('click', handleSchoolsNav);
    document.getElementById('mob-link-dashboard')?.addEventListener('click', handleSchoolsNav);

    // Portal 5: Super Admin
    const handleAdminNav = (e) => {
      e.preventDefault();
      closeMobDrawer();
      if (!State.isAuthenticated() || !State.isSuperAdmin()) {
        Modals.openAdminAuthModal({ initialMode: 'signin', redirectView: 'admin' });
      } else {
        App.navigate('admin');
      }
    };
    document.getElementById('nav-link-admin')?.addEventListener('click', handleAdminNav);
    document.getElementById('mob-link-admin')?.addEventListener('click', handleAdminNav);

    // Auth Action Buttons
    document.getElementById('btn-nav-login')?.addEventListener('click', () => {
      Modals.openParentAuthModal({ initialTab: 'signin' });
    });

    
    document.getElementById('btn-nav-admin-signup')?.addEventListener('click', () => {
      Modals.openAdminAuthModal({ initialMode: 'signup', redirectView: 'admin' });
    });

    document.getElementById('mob-btn-admin-signup')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openAdminAuthModal({ initialMode: 'signup', redirectView: 'admin' });
    });

    document.getElementById('btn-nav-my-portal')?.addEventListener('click', () => {
      const role = State.currentUser?.role;
      if (role === 'school_admin') {
        App.navigate('schools', State.currentUser?.schoolId || 'ghana-international-school');
      } else if (role === 'teacher') {
        App.navigate('teachers');
      } else if (role === 'supplier') {
        App.navigate('suppliers');
      } else if (role === 'super_admin') {
        App.navigate('admin');
      } else {
        App.navigate('parents');
      }
    });

    document.getElementById('btn-nav-logout')?.addEventListener('click', () => {
      State.logout();
    });

    document.getElementById('mob-btn-login')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openParentAuthModal({ initialTab: 'signin' });
    });

    document.getElementById('mob-btn-parent-signup')?.addEventListener('click', () => {
      this.isMobileMenuOpen = false;
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer) drawer.classList.remove('open');
      Modals.openParentAuthModal({ initialTab: 'signup' });
    });

    document.getElementById('mob-btn-logout')?.addEventListener('click', () => {
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

    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('mob-btn-theme-toggle')?.addEventListener('click', toggleTheme);

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
