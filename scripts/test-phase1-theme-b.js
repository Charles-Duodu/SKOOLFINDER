/**
 * Phase 1 Verification Suite - Blueprint v4.2 Theme B Design Tokens & 5-Tab Mobile Dock
 */
const app = require('../server');

async function runTest() {
  console.log('🚀 Running Phase 1 Theme B & 5-Tab Mobile Navigation Verification Suite...\n');
  const server = app.listen(4899, '127.0.0.1', async () => {
    let passed = 0;
    let failed = 0;

    async function check(name, fn) {
      try {
        await fn();
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ❌ [FAIL] ${name}:`, err.message);
        failed++;
      }
    }

    try {
      // 1. Index loads successfully with mobile dock root
      await check('GET / returns 200 with #mobile-dock-root mount', async () => {
        const res = await fetch('http://127.0.0.1:4899/');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (!html.includes('id="mobile-dock-root"')) throw new Error('Missing #mobile-dock-root in index.html');
      });

      // 2. Google Fonts loads Theme B Inter + Plus Jakarta Sans
      await check('GET / loads Google Fonts with Inter & Plus Jakarta Sans', async () => {
        const res = await fetch('http://127.0.0.1:4899/');
        const html = await res.text();
        if (!html.includes('family=Inter') || !html.includes('Plus+Jakarta+Sans')) {
          throw new Error('Google Fonts link missing Inter or Plus Jakarta Sans');
        }
      });

      // 3. Theme B CSS tokens in style.css
      await check('GET /css/style.css contains Theme B tokens (#0A2046, #1266C4, #D5A63B)', async () => {
        const res = await fetch('http://127.0.0.1:4899/css/style.css');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const css = await res.text();
        if (!css.includes('#0A2046')) throw new Error('Missing Theme B Navy #0A2046');
        if (!css.includes('#1266C4')) throw new Error('Missing Theme B Action Blue #1266C4');
        if (!css.includes('#D5A63B')) throw new Error('Missing Theme B Gold Accent #D5A63B');
      });

      // 4. Mobile Nav Dock CSS classes in components.css
      await check('GET /css/components.css contains .mobile-nav-dock and responsive rules', async () => {
        const res = await fetch('http://127.0.0.1:4899/css/components.css');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const css = await res.text();
        if (!css.includes('.mobile-nav-dock')) throw new Error('Missing .mobile-nav-dock class');
        if (!css.includes('.mobile-dock-badge')) throw new Error('Missing .mobile-dock-badge class');
      });

      // 5. Mobile Nav JS component is served
      await check('GET /js/components/mobileNav.js serves MobileNav object', async () => {
        const res = await fetch('http://127.0.0.1:4899/js/components/mobileNav.js');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.text();
        if (!js.includes('MobileNav') || !js.includes('mob-nav-home')) {
          throw new Error('Invalid mobileNav.js component payload');
        }
      });

      // 6. Upgraded 4-School comparison limit in state.js
      await check('GET /js/state.js enforces 4-school comparison limit', async () => {
        const res = await fetch('http://127.0.0.1:4899/js/state.js');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.text();
        if (!js.includes('this.comparisonList.length >= 4')) {
          throw new Error('state.js not enforcing 4-school limit');
        }
        if (!js.includes('this.comparisonList.length} / 4')) {
          throw new Error('state.js comparison bar not displaying / 4');
        }
      });

      // 7. Non-fabrication fee safeguards in compareView.js and schoolDetailView.js
      await check('GET /js/views/compareView.js has non-fabrication fee fallback', async () => {
        const res = await fetch('http://127.0.0.1:4899/js/views/compareView.js');
        const js = await res.text();
        if (!js.includes('Official fee schedule not published')) {
          throw new Error('compareView.js missing official non-published disclaimer');
        }
      });

      console.log(`\n====================================================`);
      console.log(`📊 Phase 1 Verification Results: ${passed} Passed, ${failed} Failed`);
      console.log(`====================================================\n`);
    } catch (e) {
      console.error('Test execution error:', e);
    } finally {
      server.close();
      process.exit(failed > 0 ? 1 : 0);
    }
  });
}

runTest();
