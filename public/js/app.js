/**
 * SkoolFinder Ghana - Core Application Controller & Router
 */
const App = {
  debounceTimer: null,

  debounce(func, delay = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, delay);
  },

  async navigate(viewName, param = null, updateHash = true) {
    // Role-based Route Guarding
    if (viewName === 'dashboard') {
      if (!State.isAuthenticated()) {
        Modals.openLoginModal({
          notice: "🔒 Please sign in with your School Administrator credentials to access the confidential management portal.",
          redirectView: 'dashboard',
          redirectParam: param || 'sch-gis-accra'
        });
        if (State.currentView === 'home') return;
        viewName = 'home';
        param = null;
      } else if (State.isParent()) {
        State.showToast("Redirected: Parent accounts access the Unified Parent Portal", "info");
        viewName = 'parent-portal';
        param = null;
      } else if (State.isSchoolAdmin()) {
        // Enforce assigned school if regular school admin
        if (!State.isSuperAdmin() && State.currentUser.schoolId) {
          param = State.currentUser.schoolId;
        }
      }
    } else if (viewName === 'parent-portal') {
      if (!State.isAuthenticated()) {
        Modals.openLoginModal({
          notice: "👨‍👩‍👧 Please sign in to view your parent admission applications, tour bookings, and tracking passes.",
          redirectView: 'parent-portal'
        });
        if (State.currentView === 'home') return;
        viewName = 'home';
        param = null;
      }
    }

    State.currentView = viewName;
    if (param) State.currentSchoolId = param;

    if (updateHash) {
      const targetHash = param ? `#/${viewName}/${param}` : `#/${viewName}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
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
          <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600; margin-top: 0.5rem;">Loading SkoolFinder...</div>
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
      } else if (viewName === 'suppliers') {
        content = await SuppliersView.render();
        mainRoot.innerHTML = content;
        SuppliersView.attachEvents();
      } else if (viewName === 'jobs') {
        content = await JobsView.render();
        mainRoot.innerHTML = content;
        JobsView.attachEvents();
      } else if (viewName === 'dashboard') {
        content = await DashboardView.render(State.currentSchoolId || 'sch-gis-accra');
        mainRoot.innerHTML = content;
        DashboardView.attachEvents(State.currentSchoolId || 'sch-gis-accra');
      } else if (viewName === 'cssps') {
        content = await CSSPSView.render();
        mainRoot.innerHTML = content;
        CSSPSView.attachEvents();
      } else if (viewName === 'past-questions' || viewName === 'resources') {
        content = await ResourcesView.render();
        mainRoot.innerHTML = content;
        ResourcesView.attachEvents();
      } else if (viewName === 'parent-portal') {
        content = await ParentPortalView.render();
        mainRoot.innerHTML = content;
        ParentPortalView.attachEvents();
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
    this.navigate(State.currentView, State.currentSchoolId);
  },

  init() {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      if (rawHash) {
        const parts = rawHash.split('/');
        const view = parts[0];
        const param = parts[1] || null;
        const validViews = ['home', 'directory', 'school-detail', 'compare', 'suppliers', 'jobs', 'dashboard', 'cssps', 'past-questions', 'resources', 'parent-portal'];
        if (validViews.includes(view)) {
          this.navigate(view, param, false);
          return;
        }
      }
      this.navigate('home', null, false);
    };

    window.addEventListener('hashchange', () => handleHash());
    handleHash();

    // FEATURE 15: Initialize AI Admissions Chatbot
    if (typeof AIChatbot !== 'undefined') {
      AIChatbot.init();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
