/**
 * Comprehensive Audit Script: Test Render AND AttachEvents for Every Platform View
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

async function testAllViewsAndEvents() {
  console.log('Auditing all views and their interactive event listeners...\n');

  const filesToLoad = [
    'public/js/api.js',
    'public/js/state.js',
    'public/js/components/modals.js',
    'public/js/components/navbar.js',
    'public/js/components/mobileNav.js',
    'public/js/components/footer.js',
    'public/js/components/chatbot.js',
    'public/js/views/homeView.js',
    'public/js/views/directoryView.js',
    'public/js/views/schoolDetailView.js',
    'public/js/views/compareView.js',
    'public/js/views/matchmakerView.js',
    'public/js/views/suppliersView.js',
    'public/js/views/jobsView.js',
    'public/js/views/dashboardView.js',
    'public/js/views/csspsView.js',
    'public/js/views/resourcesView.js',
    'public/js/views/parentPortalView.js',
    'public/js/views/teachersView.js',
    'public/js/views/adminView.js',
    'public/js/views/pricingView.js',
    'public/js/views/forSchoolsView.js',
    'public/js/views/forTeachersView.js',
    'public/js/views/forSuppliersView.js',
    'public/js/app.js'
  ];

  const fakeDOM = {
    headerRoot: { innerHTML: '' },
    mainRoot: { innerHTML: '' },
    footerRoot: { innerHTML: '' },
    mobileDockRoot: { innerHTML: '' }
  };

  const genericElement = {
    innerHTML: '',
    value: '',
    dataset: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    style: {},
    querySelector: () => genericElement,
    querySelectorAll: () => [],
    appendChild: () => {},
    remove: () => {},
    scrollIntoView: () => {}
  };

  const sandbox = {
    window: {
      location: {
        hash: '#/home',
        pathname: '/',
        search: '',
        hostname: 'localhost',
        href: 'http://localhost:3000/'
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
      open: () => {},
      innerWidth: 1024,
      localStorage: {
        getItem: (k) => null,
        setItem: (k, v) => {},
        removeItem: (k) => {}
      }
    },
    localStorage: {
      getItem: (k) => null,
      setItem: (k, v) => {},
      removeItem: (k) => {}
    },
    document: {
      documentElement: genericElement,
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementById: (id) => {
        if (id === 'header-root') return fakeDOM.headerRoot;
        if (id === 'main-root') return fakeDOM.mainRoot;
        if (id === 'footer-root') return fakeDOM.footerRoot;
        if (id === 'mobile-dock-root') return fakeDOM.mobileDockRoot;
        return genericElement;
      },
      querySelector: () => genericElement,
      querySelectorAll: () => [genericElement],
      createElement: () => ({ ...genericElement }),
      head: { appendChild: () => {} },
      body: {
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        appendChild: () => {}
      },
      title: ''
    },
    fetch: async (url) => {
      if (url.includes('/api/schools/compare')) {
        return { ok: true, json: async () => ({ schools: [] }) };
      }
      if (url.includes('/api/stats')) {
        return { ok: true, json: async () => ({ schoolsCount: 20, teachersCount: 12, suppliersCount: 8, verifiedEntities: 15 }) };
      }
      if (url.includes('/api/schools')) {
        return {
          ok: true,
          json: async () => ([{
            id: 'sch-gis-accra',
            name: 'GIS',
            curriculum: ['Cambridge'],
            facilities: ['Science Lab'],
            levels: ['Primary', 'JHS'],
            verified: true,
            is_verified: true,
            address: 'Cantonments, Accra'
          }])
        };
      }
      if (url.includes('/api/teachers')) {
        return { ok: true, json: async () => ([]) };
      }
      if (url.includes('/api/jobs')) {
        return { ok: true, json: async () => ([]) };
      }
      if (url.includes('/api/suppliers')) {
        return { ok: true, json: async () => ([]) };
      }
      if (url.includes('/api/rfqs')) {
        return { ok: true, json: async () => ([]) };
      }
      if (url.includes('/api/promotions')) {
        return { ok: true, json: async () => ({ success: true, promotions: [] }) };
      }
      return { ok: true, json: async () => ({ success: true, data: [] }), text: async () => '' };
    },
    console: console,
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    setInterval: () => 123,
    clearInterval: () => {},
    URLSearchParams: URLSearchParams
  };

  sandbox.window.document = sandbox.document;
  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);

  for (const f of filesToLoad) {
    try {
      let code = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
      code = code.replace(/^(const|let) ([A-Za-z0-9_]+) =/gm, (m, kw, id) => `var ${id} = window.${id} =`);
      vm.runInContext(code, sandbox);
    } catch (e) {
      console.error(`Error loading ${f}:`, e.message);
      return;
    }
  }

  const viewsToTest = [
    { name: 'home' },
    { name: 'directory' },
    { name: 'school-detail', param: 'sch-gis-accra' },
    { name: 'compare' },
    { name: 'matchmaker' },
    { name: 'parents' },
    { name: 'teachers' },
    { name: 'suppliers' },
    { name: 'schools', param: 'sch-gis-accra' },
    { name: 'admin' },
    { name: 'cssps' },
    { name: 'pricing', param: 'schools' },
    { name: 'pricing', param: 'professionals' },
    { name: 'past-questions' },
    { name: 'resources' },
    { name: 'for-schools' },
    { name: 'for-teachers' },
    { name: 'for-suppliers' },
    { name: 'jobs' }
  ];

  let failedCount = 0;
  const App = sandbox.window.App;

  for (const v of viewsToTest) {
    try {
      fakeDOM.mainRoot.innerHTML = '';
      await App.navigate(v.name, v.param, false);
      const renderedHtml = fakeDOM.mainRoot.innerHTML;
      if (typeof renderedHtml === 'string' && renderedHtml.includes('Oops! An error occurred')) {
        console.error(`❌ FAILED VIEW: ${v.name} -> Rendered "Oops! An error occurred"!`);
        failedCount++;
      } else {
        console.log(`✅ PASSED VIEW: ${v.name} (rendered HTML and attached all events without error)`);
      }
    } catch (err) {
      console.error(`❌ CRASHED VIEW: ${v.name} ->`, err.message);
      failedCount++;
    }
  }

  console.log(`\nFinal Audit Summary: ${viewsToTest.length - failedCount} / ${viewsToTest.length} views passed cleanly.`);
  if (failedCount > 0) process.exit(1);
}

testAllViewsAndEvents().catch(console.error);
