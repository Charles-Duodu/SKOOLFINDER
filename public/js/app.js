/**
 * SkoolFinder Ghana - Core Application Controller & Router
 */
const App = {
  debounceTimer: null,

  debounce(func, delay = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, delay);
  },

  // SEO-03 & SEO-04: Dynamic Meta, Canonical, OpenGraph & Schema.org Rich Snippets Manager
  updateSEO({ title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, breadcrumbs, schema } = {}) {
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

    if (keywords) {
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', keywords);
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
    setMeta('property', 'og:site_name', 'SkoolFinder Ghana');
    setMeta('property', 'og:locale', 'en_GH');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalOgTitle);
    setMeta('name', 'twitter:description', finalOgDesc);
    setMeta('name', 'twitter:image', finalOgImage);
    setMeta('name', 'twitter:site', '@SkoolFinderGH');
    setMeta('name', 'twitter:creator', '@SkoolFinderGH');

    // BreadcrumbList Schema.org injection
    const oldBreadcrumb = document.getElementById('schema-dynamic-breadcrumbs');
    if (oldBreadcrumb) oldBreadcrumb.remove();

    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      try {
        const breadcrumbData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((b, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": b.name,
            "item": b.url.startsWith('http') ? b.url : `https://skoolfinder.vercel.app${b.url}`
          }))
        };
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'schema-dynamic-breadcrumbs';
        scriptTag.textContent = JSON.stringify(breadcrumbData, null, 2);
        document.head.appendChild(scriptTag);
      } catch (err) {
        console.warn('Breadcrumb schema injection notice:', err);
      }
    }

    // Dynamic Route Schema.org injection (FAQPage, Product, etc.)
    const oldDynamicSchema = document.getElementById('schema-dynamic-jsonld');
    if (oldDynamicSchema) oldDynamicSchema.remove();

    if (schema && typeof schema === 'object') {
      try {
        const scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'schema-dynamic-jsonld';
        scriptTag.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(scriptTag);
      } catch (err) {
        console.warn('Dynamic route schema injection notice:', err);
      }
    }
  },

  async navigate(viewName, param = null, updateUrl = true) {
    // Normalization & Aliases (Parent Portal Route Normalization)
    if (viewName === 'parent-portal') {
      viewName = 'parents';
    }

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
          if (err.message && (err.message.includes('429') || err.message.includes('Rate limit') || err.message.includes('Failed to fetch'))) {
            // Transient rate limit or network issue; preserve session
          } else {
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
    }

    State.currentView = viewName;
    if (param) State.currentSchoolId = param;

    if (updateUrl) {
      const isPathRoute = ['teachers', 'suppliers', 'schools', 'admin', 'directory', 'compare', 'matchmaker', 'cssps', 'resources', 'school-detail', 'for-schools', 'for-teachers', 'for-suppliers', 'supplier-dashboard'].includes(viewName);
      const targetPath = param ? `/${viewName}/${param}` : `/${viewName}`;
      const targetHash = param ? `#/${viewName}/${param}` : `#/${viewName}`;

      if (isPathRoute) {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view: viewName, param }, '', targetPath);
        }
      } else if (viewName === 'home') {
        if (window.location.pathname !== '/' || (window.location.hash && window.location.hash !== '')) {
          window.history.pushState({ view: 'home' }, '', '/');
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
        keywords: 'Ghana schools, schools in Accra, schools in Kumasi, Cambridge schools Ghana, Montessori Accra, GES basic schools, East Legon schools, Cantonments schools, school directory Ghana',
        canonicalUrl: 'https://skoolfinder.vercel.app/',
        breadcrumbs: [{ name: 'Home', url: '/' }]
      },
      'directory': {
        title: 'Accredited Schools Directory in Accra & Kumasi | SkoolFinder Ghana',
        description: 'Search and filter verified pre-schools, primary, JHS, and senior high schools in Ghana by curriculum, fees, boarding options, and facilities.',
        keywords: 'Accra school directory, Kumasi schools, primary schools Ghana, JHS schools Accra, SHS schools Ghana, international schools Accra',
        canonicalUrl: 'https://skoolfinder.vercel.app/directory',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Schools Directory', url: '/directory' }]
      },
      'compare': {
        title: 'Compare Schools in Ghana | SkoolFinder Academic Comparison Tool',
        description: 'Compare fees, curricula, class sizes, boarding, and facilities side-by-side between top schools in Accra, Tema, and Kumasi.',
        keywords: 'compare schools Ghana, school fee comparison Accra, Cambridge vs GES comparison, top schools compare',
        canonicalUrl: 'https://skoolfinder.vercel.app/compare',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Schools Directory', url: '/directory' }, { name: 'Compare Schools', url: '/compare' }]
      },
      'matchmaker': {
        title: "Child's Educational Fit Adviser & Matchmaker | SkoolFinder Ghana",
        description: 'Find the ideal school in Ghana for your child. Transparent 2-step matchmaker based on verified curriculum, location, boarding, and family priorities.',
        keywords: 'school matchmaker Ghana, school selector Accra, best school for my child Ghana',
        canonicalUrl: 'https://skoolfinder.vercel.app/matchmaker',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Schools Directory', url: '/directory' }, { name: 'Fit Matchmaker', url: '/matchmaker' }]
      },
      'parents': {
        title: 'Parent Admissions Hub | SkoolFinder Ghana',
        description: 'Book campus tours, apply for admission vouchers, save shortlist schools, and track application status for your children.',
        keywords: 'parent admissions Ghana, school tour booking, admissions vouchers MoMo, parent portal Accra',
        canonicalUrl: 'https://skoolfinder.vercel.app/parents',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Parents Portal', url: '/parents' }]
      },
      'teachers': {
        title: 'Teaching & Educational Vacancies in Ghana | SkoolFinder Careers',
        description: 'Browse verified teaching opportunities, subject specialist roles, and administrative positions at accredited schools across Ghana.',
        keywords: 'teaching jobs Ghana, education vacancies Accra, teacher recruitment Ghana, Cambridge teacher jobs',
        canonicalUrl: 'https://skoolfinder.vercel.app/teachers',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Teachers & Careers', url: '/teachers' }]
      },
      'suppliers': {
        title: 'Educational Procurement & B2B School Marketplace | SkoolFinder Ghana',
        description: 'Connect accredited schools with verified Ghanaian suppliers for uniforms, stationery, STEM equipment, catering, and bus transport.',
        keywords: 'school procurement Ghana, educational suppliers Accra, school uniforms bulk, school catering contracts',
        canonicalUrl: 'https://skoolfinder.vercel.app/suppliers',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Suppliers Marketplace', url: '/suppliers' }]
      },
      'schools': {
        title: 'School Proprietor & Administrator Portal | SkoolFinder Ghana',
        description: 'Manage your verified school listing, respond to parent enquiries, track profile analytics, and receive admission applications.',
        keywords: 'school management OS Ghana, proprietor dashboard, admissions CRM Ghana, school leads',
        canonicalUrl: 'https://skoolfinder.vercel.app/schools',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'School Management OS', url: '/schools' }]
      },
      'cssps': {
        title: 'CSSPS Placement Predictor & BECE Cut-Off Points | SkoolFinder Ghana',
        description: 'Predict senior high school placement eligibility in Ghana using your BECE aggregate and Category A, B, C school options.',
        keywords: 'CSSPS predictor Ghana, BECE aggregate calculator, category A schools cut off, SHS placement Ghana',
        canonicalUrl: 'https://skoolfinder.vercel.app/cssps',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'CSSPS Placement Predictor', url: '/cssps' }]
      },
      'resources': {
        title: 'Educational Resources & GES Academic Calendar | SkoolFinder Ghana',
        description: 'Download GES academic term schedules, BECE & WASSCE syllabi, past examination questions, and parenting guides.',
        keywords: 'GES calendar 2026, BECE past questions download, WASSCE syllabi, Ghana education resources',
        canonicalUrl: 'https://skoolfinder.vercel.app/resources',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Resource Centre', url: '/resources' }]
      },
      'parents': {
        title: 'Parent Admissions Cockpit & School Journey Tracker | SkoolFinder Ghana',
        description: 'Track school applications, campus tour bookings, 5-state decision board shortlists, and fee planning in one 100% free parent dashboard.',
        keywords: 'parents portal Ghana, school admissions tracker, school shortlist Accra, child education planning',
        canonicalUrl: 'https://skoolfinder.vercel.app/parents',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Parent Space', url: '/parents' }]
      },
      'pricing': {
        title: 'Platform Pricing & Plans | SkoolFinder Ghana',
        description: 'Transparent subscription pricing for Ghanaian schools, verified teachers, and private tutors. Approved Ghana Cedis plans with zero hidden fees.',
        keywords: 'SkoolFinder pricing, school subscription plans Ghana, teacher pro membership price',
        canonicalUrl: 'https://skoolfinder.vercel.app/pricing',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Pricing & Plans', url: '/pricing' }]
      },
      'admin': {
        title: 'SkoolFinder HQ | National School Directory Regulatory Console',
        description: 'Administrative management console for school verification, directory moderation, and platform governance.',
        canonicalUrl: 'https://skoolfinder.vercel.app/admin'
      },
      'for-schools': {
        title: 'For Schools & Proprietors | Accelerate Admissions & NaSIA Accreditation | SkoolFinder Ghana',
        description: 'Claim your school profile, cross-check NaSIA regulatory status, automate mobile money admission vouchers, and capture parent WhatsApp inquiries.',
        keywords: 'for schools Ghana, list school Accra, NaSIA accreditation check, claim school profile',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-schools',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'For Schools & Proprietors', url: '/for-schools' }]
      },
      'for-teachers': {
        title: 'For Teachers & Educators | Verified NTC Licensure & Direct Parent Tutoring | SkoolFinder Ghana',
        description: 'Apply directly to top accredited Ghanaian schools without agent commissions, showcase your NTC licensure badge, and unlock direct parent tutoring consultations.',
        keywords: 'for teachers Ghana, NTC teacher verification, home tutor jobs Accra, educator pro plan',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-teachers',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'For Teachers & Educators', url: '/for-teachers' }]
      },
      'for-suppliers': {
        title: 'For Educational Suppliers & Contractors | Guaranteed Milestone MoMo Escrow | SkoolFinder Ghana',
        description: 'Bid on verified school procurement tenders across Ghana. Receive official LPOs with guaranteed milestone mobile money and bank escrow.',
        keywords: 'school tenders Ghana, educational supplier registration, school procurement RFQ, MoMo escrow Ghana',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-suppliers',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'For Suppliers & Vendors', url: '/for-suppliers' }]
      },
      'supplier-dashboard': {
        title: 'Supplier Portal & Catalogue Workspace | SkoolFinder Ghana',
        description: 'Manage verified Ghanaian educational supply catalogues, products, services, quotes, and accreditation credentials.',
        keywords: 'supplier portal Ghana, educational supplies catalogue, school procurement bids',
        canonicalUrl: 'https://skoolfinder.vercel.app/supplier-dashboard',
        breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Suppliers Marketplace', url: '/suppliers' }, { name: 'Supplier Dashboard', url: '/supplier-dashboard' }]
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
        content = await CompareView.render();
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
      } else if (viewName === 'supplier-dashboard') {
        content = await SupplierDashboardView.render();
        mainRoot.innerHTML = content;
        SupplierDashboardView.attachEvents();
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

  async refreshCurrentView() {
    return await this.navigate(State.currentView, State.currentSchoolId, false);
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
        'for-suppliers': 'for-suppliers',
        'supplier-dashboard': 'supplier-dashboard'
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
      API.getMe().catch((err) => {
        // Only invalidate if the server explicitly rejected the token with 401 Unauthorized
        if (err && (err.message?.includes('401') || err.message?.includes('Unauthorized') || err.message?.includes('Invalid or expired'))) {
          console.warn("Session token expired or invalid; cleaning up stale session.");
          State.setCurrentUser(null, null);
          if (['schools', 'admin'].includes(State.currentView)) {
            App.navigate('home');
          } else if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
            document.getElementById('header-root').innerHTML = Navbar.render();
            Navbar.attachEvents();
          }
        } else {
          console.warn("Preserving session despite transient API notice:", err?.message);
        }
      });
    }

    // Blueprint v4.2: 5-Tab Persistent Mobile Navigation Dock Mount
    const mobileDockRoot = document.getElementById('mobile-dock-root');
    if (mobileDockRoot && typeof MobileNav !== 'undefined') {
      mobileDockRoot.innerHTML = MobileNav.render();
      MobileNav.attachEvents();
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
