/**
 * SkoolFinder Ghana - Core Application Controller & Router
 */
const App = {
  debounceTimer: null,

  debounce(func, delay = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, delay);
  },

  // SEO-03: Dynamic Meta, Canonical & OpenGraph Tag Manager
  updateSEO({ title, description, ogTitle, ogDescription, ogImage, canonicalUrl } = {}) {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    const fullCanonical = canonicalUrl || (window.location.origin + window.location.pathname);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullCanonical);

    const setMeta = (attr, key, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    const finalOgTitle = ogTitle || title || 'SkoolFinder Ghana | Verified Education Directory & Network';
    const finalOgDesc = ogDescription || description || 'Explore accredited schools across Ghana.';
    let finalOgImage = ogImage || 'https://skoolfinder.vercel.app/assets/images/campus_hero.jpg';
    if (finalOgImage.startsWith('/')) {
      finalOgImage = 'https://skoolfinder.vercel.app' + finalOgImage;
    }

    setMeta('property', 'og:title', finalOgTitle);
    setMeta('property', 'og:description', finalOgDesc);
    setMeta('property', 'og:image', finalOgImage);
    setMeta('property', 'og:url', fullCanonical);

    setMeta('name', 'twitter:title', finalOgTitle);
    setMeta('name', 'twitter:description', finalOgDesc);
    setMeta('name', 'twitter:image', finalOgImage);
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
          if (!param) {
            param = State.currentSchoolId || State.currentUser?.schoolId || 'sch-gis-accra';
          }
          State.currentSchoolId = param;
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
      } else {
        // SEC-04: Validate administrative claims with backend before mounting Admin Console
        try {
          const authCheck = await API.getMe();
          const userRole = authCheck?.user?.role || authCheck?.role;
          if (userRole !== 'super_admin') {
            throw new Error("Invalid administrative claim");
          }
        } catch (err) {
          console.warn("Administrative session verification notice:", err.message);
          State.setCurrentUser(null, null);
          Modals.openLoginModal({
            notice: "🛡️ Administrative re-authentication required.",
            redirectView: 'admin'
          });
          viewName = 'home';
          param = null;
        }
      }
    }

    State.currentView = viewName;
    if (param) State.currentSchoolId = param;

    if (updateUrl) {
      const isPathRoute = ['parents', 'teachers', 'suppliers', 'schools', 'admin', 'directory', 'compare', 'matchmaker', 'pricing', 'cssps', 'resources', 'school-detail', 'for-schools', 'for-teachers', 'for-suppliers'].includes(viewName);
      const targetPath = param ? `/${viewName}/${param}` : `/${viewName}`;
      const targetHash = param ? `#/${viewName}/${param}` : `#/${viewName}`;

      if (isPathRoute) {
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

    // SEO-03: Set Baseline Meta Tags per View
    const SEO_CONFIGS = {
      'home': {
        title: 'SkoolFinder Ghana | Verified School Directory & Educational Procurement',
        description: 'Discover, compare, and connect with accredited pre-schools, basic schools, and senior high schools in Greater Accra and Kumasi. Access educational suppliers and teacher recruitment.',
        canonicalUrl: 'https://skoolfinder.vercel.app/'
      },
      'directory': {
        title: 'Accredited Schools Directory in Accra & Kumasi | SkoolFinder Ghana',
        description: 'Search and filter verified pre-schools, primary, JHS, and senior high schools in Ghana by curriculum, fees, boarding options, and facilities.',
        canonicalUrl: 'https://skoolfinder.vercel.app/directory'
      },
      'compare': {
        title: 'Compare Schools in Ghana | SkoolFinder Academic Comparison Tool',
        description: 'Compare fees, curricula, class sizes, boarding, and facilities side-by-side between top schools in Accra, Tema, and Kumasi.',
        canonicalUrl: 'https://skoolfinder.vercel.app/compare'
      },
      'matchmaker': {
        title: "Child's Educational Fit Adviser & Matchmaker | SkoolFinder Ghana",
        description: 'Find the ideal school in Ghana for your child. Transparent 2-step matchmaker based on verified curriculum, location, boarding, and family priorities.',
        canonicalUrl: 'https://skoolfinder.vercel.app/matchmaker'
      },
      'parents': {
        title: 'Parent Admissions Hub | SkoolFinder Ghana',
        description: 'Book campus tours, apply for admission vouchers, save shortlist schools, and track application status for your children.',
        canonicalUrl: 'https://skoolfinder.vercel.app/parents'
      },
      'teachers': {
        title: 'Teaching & Educational Vacancies in Ghana | SkoolFinder Careers',
        description: 'Browse verified teaching opportunities, subject specialist roles, and administrative positions at accredited schools across Ghana.',
        canonicalUrl: 'https://skoolfinder.vercel.app/teachers'
      },
      'suppliers': {
        title: 'Educational Procurement & B2B School Marketplace | SkoolFinder Ghana',
        description: 'Connect accredited schools with verified Ghanaian suppliers for uniforms, stationery, STEM equipment, catering, and bus transport.',
        canonicalUrl: 'https://skoolfinder.vercel.app/suppliers'
      },
      'schools': {
        title: 'School Proprietor & Administrator Portal | SkoolFinder Ghana',
        description: 'Manage your verified school listing, respond to parent enquiries, track profile analytics, and receive admission applications.',
        canonicalUrl: 'https://skoolfinder.vercel.app/schools'
      },
      'cssps': {
        title: 'CSSPS Placement Predictor & BECE Cut-Off Points | SkoolFinder Ghana',
        description: 'Predict senior high school placement eligibility in Ghana using your BECE aggregate and Category A, B, C school options.',
        canonicalUrl: 'https://skoolfinder.vercel.app/cssps'
      },
      'resources': {
        title: 'Educational Resources & GES Academic Calendar | SkoolFinder Ghana',
        description: 'Download GES academic term schedules, BECE & WASSCE syllabi, past examination questions, and parenting guides.',
        canonicalUrl: 'https://skoolfinder.vercel.app/resources'
      },
      'pricing': {
        title: 'Platform Pricing & Plans | SkoolFinder Ghana',
        description: 'Transparent subscription pricing for Ghanaian schools, verified teachers, and private tutors. Approved Ghana Cedis plans with zero hidden fees.',
        canonicalUrl: 'https://skoolfinder.vercel.app/pricing'
      },
      'admin': {
        title: 'SkoolFinder HQ | National School Directory Regulatory Console',
        description: 'Administrative management console for school verification, directory moderation, and platform governance.',
        canonicalUrl: 'https://skoolfinder.vercel.app/admin'
      },
      'for-schools': {
        title: 'For Schools & Proprietors | Accelerate Admissions & NaSIA Accreditation | SkoolFinder Ghana',
        description: 'Claim your school profile, cross-check NaSIA regulatory status, automate mobile money admission vouchers, and capture parent WhatsApp inquiries.',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-schools'
      },
      'for-teachers': {
        title: 'For Teachers & Educators | Verified NTC Licensure & Direct Parent Tutoring | SkoolFinder Ghana',
        description: 'Apply directly to top accredited Ghanaian schools without agent commissions, showcase your NTC licensure badge, and unlock direct parent tutoring consultations.',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-teachers'
      },
      'for-suppliers': {
        title: 'For Educational Suppliers & Contractors | Guaranteed Milestone MoMo Escrow | SkoolFinder Ghana',
        description: 'Bid on verified school procurement tenders across Ghana. Receive official LPOs with guaranteed milestone mobile money and bank escrow.',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-suppliers'
      }
    };

    if (viewName !== 'school-detail') {
      // Remove any lingering school-specific JSON-LD
      const oldSchema = document.getElementById('schema-school-jsonld');
      if (oldSchema) oldSchema.remove();

      if (SEO_CONFIGS[viewName]) {
        this.updateSEO(SEO_CONFIGS[viewName]);
      }
    }

    // Render Navbar
    document.getElementById('header-root').innerHTML = Navbar.render();
    Navbar.attachEvents();

    // Blueprint v4.2: 5-Tab Persistent Mobile Navigation Dock Mount
    const mobileDockRoot = document.getElementById('mobile-dock-root');
    if (mobileDockRoot && typeof MobileNav !== 'undefined') {
      mobileDockRoot.innerHTML = MobileNav.render();
      MobileNav.attachEvents();
    }

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
      } else if (viewName === 'matchmaker') {
        content = await MatchmakerView.render();
        mainRoot.innerHTML = content;
        MatchmakerView.attachEvents();
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
      } else if (viewName === 'pricing') {
        content = await PricingView.render(param || 'schools');
        mainRoot.innerHTML = content;
        PricingView.attachEvents(param || 'schools');
      } else if (viewName === 'past-questions' || viewName === 'resources') {
        content = await ResourcesView.render();
        mainRoot.innerHTML = content;
        ResourcesView.attachEvents();
      }
      } else if (viewName === 'for-schools') {
        content = await ForSchoolsView.render();
        mainRoot.innerHTML = content;
        if (ForSchoolsView.afterRender) ForSchoolsView.afterRender();
        else if (ForSchoolsView.attachEvents) ForSchoolsView.attachEvents();
      } else if (viewName === 'for-teachers') {
        content = await ForTeachersView.render();
        mainRoot.innerHTML = content;
        if (ForTeachersView.afterRender) ForTeachersView.afterRender();
        else if (ForTeachersView.attachEvents) ForTeachersView.attachEvents();
      } else if (viewName === 'for-suppliers') {
        content = await ForSuppliersView.render();
        mainRoot.innerHTML = content;
        if (ForSuppliersView.afterRender) ForSuppliersView.afterRender();
        else if (ForSuppliersView.attachEvents) ForSuppliersView.attachEvents();

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
    // Whitelabel School Admissions Portal Detection (Sprint 5)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const whitelabelParam = urlParams.get('whitelabel') || urlParams.get('school');
      const hostname = window.location.hostname;

      let whitelabelSchoolId = whitelabelParam;
      if (!whitelabelSchoolId && hostname && !hostname.startsWith('skoolfinder') && !hostname.startsWith('localhost') && !hostname.startsWith('127.')) {
        if (hostname.includes('gis')) whitelabelSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6';
        else if (hostname.includes('sos') || hostname.includes('hgic')) whitelabelSchoolId = '47508357-d2b3-4a6a-b6a9-21e037ef9dd2';
        else if (hostname.includes('achimota')) whitelabelSchoolId = 'sch-03';
        else if (hostname.includes('lincoln')) whitelabelSchoolId = 'sch-04';
        else if (hostname.includes('prempeh')) whitelabelSchoolId = 'sch-05';
      }

      if (whitelabelSchoolId) {
        State.isWhitelabel = true;
        State.whitelabelSchoolId = whitelabelSchoolId;
        document.body.classList.add('whitelabel-mode');
      }
    } catch (e) {
      console.warn("Whitelabel detection notice:", e);
    }

    const resolveRoute = () => {
      // 0. Whitelabel root resolution
      if (typeof State !== 'undefined' && State.isWhitelabel) {
        const checkPath = window.location.pathname.replace(/^\//, '');
        if (!checkPath || checkPath === 'home') {
          this.navigate('school-detail', State.whitelabelSchoolId, false);
          return;
        }
      }
      // 1. Check path-based route (/parents, /directory, /schools/sch-03, /school-detail/sch-03, etc.)
      const pathParts = window.location.pathname.replace(/^\//, '').split('/');
      const rootPath = pathParts[0];
      const param = pathParts[1] || null;

      // Direct school profile route: /schools/:id or /school/:id or /school-detail/:id
      if ((rootPath === 'schools' || rootPath === 'school' || rootPath === 'school-detail') && param) {
        this.navigate('school-detail', param, false);
        return;
      }

      const routeMap = {
        '': 'home',
        'home': 'home',
        'directory': 'directory',
        'school-detail': 'school-detail',
        'compare': 'compare',
        'pricing': 'pricing',
        'plans': 'pricing',
        'cssps': 'cssps',
        'past-questions': 'resources',
        'resources': 'resources',
        'parents': 'parents',
        'parent-portal': 'parents',
        'teachers': 'teachers',
        'jobs': 'teachers',
        'suppliers': 'suppliers',
        'schools': 'schools',
        'dashboard': 'schools',
        'admin': 'admin',
        'for-schools': 'for-schools',
        'for-teachers': 'for-teachers',
        'for-suppliers': 'for-suppliers'
      };

      if (rootPath && routeMap[rootPath]) {
        this.navigate(routeMap[rootPath], param, false);
        return;
      }

      // 2. Check hash-based route (#/directory, #/cssps, #/school-detail/sch-03, etc.)
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      if (rawHash) {
        const parts = rawHash.split('/');
        const hashView = parts[0];
        const hashParam = parts[1] || null;

        if ((hashView === 'schools' || hashView === 'school' || hashView === 'school-detail') && hashParam) {
          this.navigate('school-detail', hashParam, false);
          return;
        }

        if (routeMap[hashView]) {
          this.navigate(routeMap[hashView], hashParam, false);
          return;
        }
      }

      this.navigate('home', null, false);
    };

    window.addEventListener('popstate', () => resolveRoute());
    window.addEventListener('hashchange', () => resolveRoute());
    resolveRoute();

    // Silent Session Verification (FN-08): Clean up expired JWTs automatically
    if (State.isAuthenticated() && typeof API !== 'undefined' && API.getMe) {
      API.getMe().catch(() => {
        console.warn("Session token expired or invalid; cleaning up stale session.");
        State.setCurrentUser(null, null);
        if (['schools', 'admin'].includes(State.currentView)) {
          App.navigate('home');
        } else if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
          document.getElementById('header-root').innerHTML = Navbar.render();
          Navbar.attachEvents();

    // Blueprint v4.2: 5-Tab Persistent Mobile Navigation Dock Mount
    const mobileDockRoot = document.getElementById('mobile-dock-root');
    if (mobileDockRoot && typeof MobileNav !== 'undefined') {
      mobileDockRoot.innerHTML = MobileNav.render();
      MobileNav.attachEvents();
    }
        }
      });
    }

    // FEATURE 15: Initialize AI Admissions Chatbot
    if (typeof AIChatbot !== 'undefined') {
      AIChatbot.init();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
