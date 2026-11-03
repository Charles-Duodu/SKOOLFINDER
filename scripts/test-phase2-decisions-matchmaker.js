/**
 * Phase 2 Automated Verification Suite:
 * 4-Way Comparison Matrix & Explainable Fit Matchmaker (Blueprint v4.2 Sections 7.1 & 7.2)
 */
const app = require('../server');

async function runTest() {
  console.log('🚀 Running Phase 2 Decisions: 4-Way Compare & Matchmaker Verification Suite...\n');
  const server = app.listen(4898, '127.0.0.1', async () => {
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
      // 1. Script inclusions in index.html
      await check('GET / includes matchmakerView.js in client script tags', async () => {
        const res = await fetch('http://127.0.0.1:4898/');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (!html.includes('src="/js/views/matchmakerView.js')) {
          throw new Error('matchmakerView.js script tag missing in index.html');
        }
      });

      // 2. 4-School Compare Matrix Capabilities
      await check('GET /js/views/compareView.js implements 4-school matrix & mobile quick-swap', async () => {
        const res = await fetch('http://127.0.0.1:4898/js/views/compareView.js');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.text();
        if (!js.includes('State.comparisonList.slice(0, 4)')) {
          throw new Error('compareView.js not supporting up to 4 schools');
        }
        if (!js.includes('mobile-compare-toolbar') || !js.includes('select-mob-school-a')) {
          throw new Error('compareView.js missing mobile 2-school quick swap toolbar');
        }
        if (!js.includes('openSchoolPicker') || !js.includes('comp-picker-modal')) {
          throw new Error('compareView.js missing in-page school picker drawer');
        }
      });

      // 3. Compare View Non-Fabrication Rule
      await check('GET /js/views/compareView.js enforces factual fee transparency', async () => {
        const res = await fetch('http://127.0.0.1:4898/js/views/compareView.js');
        const js = await res.text();
        if (!js.includes('Official fee schedule not published &bull; Contact desk')) {
          throw new Error('compareView.js missing official non-published disclaimer');
        }
      });

      // 4. Matchmaker 2-Step Wizard Implementation
      await check('GET /js/views/matchmakerView.js implements 2-step progressive wizard', async () => {
        const res = await fetch('http://127.0.0.1:4898/js/views/matchmakerView.js');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.text();
        if (!js.includes('renderStep1') || !js.includes('renderStep2') || !js.includes('renderResults')) {
          throw new Error('matchmakerView.js missing multi-step rendering methods');
        }
        if (!js.includes('calculateFitMatches')) {
          throw new Error('matchmakerView.js missing calculateFitMatches algorithm');
        }
      });

      // 5. Matchmaker Explainable Evidence Rationale (AC-008 Non-Fabrication Rule)
      await check('GET /js/views/matchmakerView.js enforces transparent evidence bullets', async () => {
        const res = await fetch('http://127.0.0.1:4898/js/views/matchmakerView.js');
        const js = await res.text();
        if (!js.includes('Verified Fit Evidence:')) {
          throw new Error('matchmakerView.js missing Verified Fit Evidence section');
        }
        // Verify no fake percentage claims are coded into the fit adviser
        if (js.includes('% chance of admission') || js.includes('% likelihood')) {
          throw new Error('matchmakerView.js contains prohibited arbitrary admission percentage claims');
        }
      });

      // 6. App Router Matchmaker Registration
      await check('GET /js/app.js registers matchmaker route and SEO configs', async () => {
        const res = await fetch('http://127.0.0.1:4898/js/app.js');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.text();
        if (!js.includes("'matchmaker'") || !js.includes('MatchmakerView.render()')) {
          throw new Error('matchmaker route not properly mounted in app.js router');
        }
      });

      // 7. Homepage & Directory Matchmaker Discovery Links
      await check('Homepage & Directory views include Matchmaker entry points', async () => {
        const resHome = await fetch('http://127.0.0.1:4898/js/views/homeView.js');
        const jsHome = await resHome.text();
        if (!jsHome.includes('btn-hero-matchmaker')) {
          throw new Error('homeView.js missing btn-hero-matchmaker CTA');
        }

        const resDir = await fetch('http://127.0.0.1:4898/js/views/directoryView.js');
        const jsDir = await resDir.text();
        if (!jsDir.includes('btn-dir-launch-match')) {
          throw new Error('directoryView.js missing btn-dir-launch-match button');
        }
      });

      console.log(`\n====================================================`);
      console.log(`📊 Phase 2 Verification Results: ${passed} Passed, ${failed} Failed`);
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

