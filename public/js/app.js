/**
 * SkoolFinder Ghana - Core Application Controller & Router
 */
const App = {
  debounceTimer: null,

  debounce(func, delay = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, delay);
  },

  async navigate(viewName, param = null, updateUrl = true) {
    // Normalization & Aliases for the 5 Portals
    if (viewName === 'parent-portal') viewName = 'parents';
    if (viewName === 'jobs') viewName = 'teachers';
    if (viewName === 'dashboard') viewName = 'schools';

    // Role-based Route Guarding
    if (viewName === 'schools') {
      if (State.isSchoolAdmin()) {
        if (!State.isSuperAdmin() && State.currentUser?.schoolId) {
          param = State.currentUser.schoolId;
        }
      }
      // Non-school admin or guest users will render the Proprietor Landing page inside DashboardView
    } else if (viewName === 'admin') {
      if (!State.isAuthenticated() || !State.isSuperAdmin()) {
        Modals.openLoginModal({
          notice: "🛡️ Access Restricted: SkoolFinder HQ & Regulatory Console requires Super Administrator credentials.",
          redirectView: 'admin'
        });
        if (State.currentView === 'home') return;
        viewName = 'home';
        param = null;
      }
    }

    State.currentView = viewName;
    if (param) State.currentSchoolId = param;

    if (updateUrl) {
      const isPortal = ['parents', 'teachers', 'suppliers', 'schools', 'admin'].includes(viewName);
      const targetPath = param ? `/${viewName}/${param}` : `/${viewName}`;
      const targetHash = param ? `#/${viewName}/${param}` : `#/${viewName}`;

      if (isPortal) {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view: viewName, param }, '', targetPath);
        }
      } else {
        if (window.location.hash !== targetHash) {
          window.history.pushState({ view: viewName, param }, '', targetHash);
        }
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render Navbar
    document.getElementById('header-root').innerHTML = Navbar.render();
    Navbar.attachEvents();

    // Render Main View
    const mainRoot = document.getElementById('main-root');
    mainRoot.innerHTML = `
      <div style="min-height: 50vh; display: flex; align-items: center; justify-content: center; padding: 4rem;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; animation: pulse-dot 1s infinite;">🇬🇭</div>
          <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600; margin-top: 0.5rem;">Loading SkoolFinder Portal...</div>
        </div>
      </div>
    `;

    try {
      let content = '';
      if (viewName === 'home') {
        content = await HomeView.render();
        mainRoot.innerHTML = content;
        HomeView.attachEvents();
      } else if (viewName === 'directory') {
        content = await DirectoryView.render();
        mainRoot.innerHTML = content;
        DirectoryView.attachEvents();
      } else if (viewName === 'school-detail') {
        content = await SchoolDetailView.render(State.currentSchoolId);
        mainRoot.innerHTML = content;
        SchoolDetailView.attachEvents(State.currentSchoolId);
      } else if (viewName === 'compare') {
        content = CompareView.render();
        mainRoot.innerHTML = content;
        CompareView.attachEvents();
      } else if (viewName === 'parents') {
        content = await ParentPortalView.render();
        mainRoot.innerHTML = content;
        ParentPortalView.attachEvents();
      } else if (viewName === 'teachers') {
        content = await TeachersView.render();
        mainRoot.innerHTML = content;
        TeachersView.attachEvents();
      } else if (viewName === 'suppliers') {
        content = await SuppliersView.render();
        mainRoot.innerHTML = content;
        SuppliersView.attachEvents();
      } else if (viewName === 'schools') {
        content = await DashboardView.render(State.currentSchoolId || 'sch-gis-accra');
        mainRoot.innerHTML = content;
        DashboardView.attachEvents(State.currentSchoolId || 'sch-gis-accra');
      } else if (viewName === 'admin') {
        content = await AdminView.render();
        mainRoot.innerHTML = content;
        AdminView.attachEvents();
      } else if (viewName === 'cssps') {
        content = await CSSPSView.render();
        mainRoot.innerHTML = content;
        CSSPSView.attachEvents();
      } else if (viewName === 'past-questions' || viewName === 'resources') {
        content = await ResourcesView.render();
        mainRoot.innerHTML = content;
        ResourcesView.attachEvents();
      }

      // Render Footer
      document.getElementById('footer-root').innerHTML = Footer.render();
      Footer.attachEvents();

      // Render Floating Comparison Bar if any schools in compare
      State.renderComparisonBar();

    } catch (err) {
      console.error("Routing error:", err);
      mainRoot.innerHTML = `
        <div class="container" style="padding: 4rem 1.5rem; text-align: center;">
          <h2 style="color: var(--rose-600); font-family: var(--font-heading); margin-bottom: 1rem;">Oops! An error occurred</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${err.message}</p>
          <button class="btn-pill btn-primary" onclick="App.navigate('home')">Return Home</button>
        </div>
      `;
    }
  },

  refreshCurrentView() {
    this.navigate(State.currentView, State.currentSchoolId, false);
  },

  init() {
    const resolveRoute = () => {
      // 1. Check path-based route (/parents, /teachers, /suppliers, /schools, /admin)
      const pathParts = window.location.pathname.replace(/^\//, '').split('/');
      const rootPath = pathParts[0];
      const portalParam = pathParts[1] || null;

      const portalMap = {
        'parents': 'parents',
        'teachers': 'teachers',
        'suppliers': 'suppliers',
        'schools': 'schools',
        'admin': 'admin',
        'parent-portal': 'parents',
        'jobs': 'teachers',
        'dashboard': 'schools'
      };

      if (portalMap[rootPath]) {
        this.navigate(portalMap[rootPath], portalParam, false);
        return;
      }

      // 2. Check hash-based route (#/directory, #/cssps, etc.)
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      if (rawHash) {
        const parts = rawHash.split('/');
        const view = parts[0];
        const param = parts[1] || null;
        if (portalMap[view]) {
          this.navigate(portalMap[view], param, false);
          return;
        }
        const validViews = ['home', 'directory', 'school-detail', 'compare', 'cssps', 'past-questions', 'resources'];
        if (validViews.includes(view)) {
          this.navigate(view, param, false);
          return;
        }
      }

      this.navigate('home', null, false);
    };

    window.addEventListener('popstate', () => resolveRoute());
    window.addEventListener('hashchange', () => resolveRoute());
    resolveRoute();

    // FEATURE 15: Initialize AI Admissions Chatbot
    if (typeof AIChatbot !== 'undefined') {
      AIChatbot.init();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
