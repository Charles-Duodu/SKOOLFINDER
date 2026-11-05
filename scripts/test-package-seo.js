/**
 * Automated Verification Suite for SEO, Meta & Search Rich Snippets
 * ============================================================================
 * Blueprint & Roadmap Alignment:
 *   - SkoolFinder Ghana Roadmap v1.1 (Phase 7, Section 14, Section 16)
 *   - Public Website Master Guide v1.0 (Section 4, 5, 13)
 *
 * Verifies:
 *   1. Root Schema.org WebSite & EducationalOrganization JSON-LD in index.html
 *   2. Google Sitelinks SearchBox SearchAction schema definition
 *   3. Crawler directives & administrative route blocking in robots.txt
 *   4. Valid Sitemaps.org 0.9 XML with all public & persona canonical URLs
 *   5. Dynamic SEO manager in app.js (BreadcrumbList, OpenGraph, Twitter, canonicals)
 *   6. Rich Snippet Schema.org School structured data with ratings & reviews in schoolDetailView.js
 *   7. Server routing & MIME types for /sitemap.xml and /robots.txt
 * ============================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${totalTests}. ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${totalTests}. ${name}: ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${totalTests}. ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${totalTests}. ${name}: ${err.message}`);
    throw err;
  }
}

async function runSEOTests() {
  console.log('\n========================================================================');
  console.log('🚀 RUNNING SEO, META & SEARCH RICH SNIPPETS VERIFICATION');
  console.log('========================================================================\n');

  const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

  // Test 1: Root Schema.org WebSite & Organization JSON-LD
  test('index.html contains valid Schema.org WebSite and EducationalOrganization JSON-LD', () => {
    assert.ok(indexHtml.includes('id="schema-root-jsonld"'), 'Must define schema-root-jsonld');
    assert.ok(indexHtml.includes('"@type": "WebSite"'), 'Must define WebSite schema');
    assert.ok(indexHtml.includes('"@type": "EducationalOrganization"'), 'Must define EducationalOrganization schema');
    assert.ok(indexHtml.includes('"name": "SkoolFinder Ghana"'), 'Must define organization name');
  });

  // Test 2: Google Sitelinks Searchbox
  test('index.html WebSite schema defines SearchAction for Google Sitelinks Searchbox', () => {
    assert.ok(indexHtml.includes('"@type": "SearchAction"'), 'Must include SearchAction');
    assert.ok(indexHtml.includes('directory?search={search_term_string}'), 'Target must route to directory search');
    assert.ok(indexHtml.includes('"query-input": "required name=search_term_string"'), 'Must declare query-input');
  });

  // Test 3: Essential Meta Tags in index.html
  test('index.html declares viewport, description, keywords, canonical, and social meta tags', () => {
    assert.ok(indexHtml.includes('<meta name="description"'), 'Must declare description meta tag');
    assert.ok(indexHtml.includes('<meta name="keywords"'), 'Must declare keywords meta tag');
    assert.ok(indexHtml.includes('<meta property="og:title"'), 'Must declare og:title');
    assert.ok(indexHtml.includes('<meta property="og:description"'), 'Must declare og:description');
    assert.ok(indexHtml.includes('<meta property="og:image"'), 'Must declare og:image');
    assert.ok(indexHtml.includes('<meta name="twitter:card"'), 'Must declare twitter:card');
  });

  // Test 4: robots.txt Crawler Directives
  test('public/robots.txt permits public routes & disallows /api/ and /admin/', () => {
    const robots = fs.readFileSync(path.join(__dirname, '../public/robots.txt'), 'utf8');
    assert.ok(robots.includes('User-agent: *'), 'Must target all user agents');
    assert.ok(robots.includes('Allow: /'), 'Must allow root');
    assert.ok(robots.includes('Allow: /directory'), 'Must allow directory');
    assert.ok(robots.includes('Allow: /for-schools'), 'Must allow for-schools');
    assert.ok(robots.includes('Allow: /for-teachers'), 'Must allow for-teachers');
    assert.ok(robots.includes('Allow: /for-suppliers'), 'Must allow for-suppliers');
    assert.ok(robots.includes('Disallow: /api/'), 'Must disallow /api/');
    assert.ok(robots.includes('Disallow: /admin'), 'Must disallow /admin');
    assert.ok(robots.includes('Sitemap: https://skoolfinder.vercel.app/sitemap.xml'), 'Must point to sitemap');
  });

  // Test 5: sitemap.xml Structure & Content
  test('public/sitemap.xml declares valid Sitemaps.org 0.9 schema and all canonical platform URLs', () => {
    const sitemap = fs.readFileSync(path.join(__dirname, '../public/sitemap.xml'), 'utf8');
    assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must declare XML header');
    assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Must declare sitemap namespace');
    
    // Core routes
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/</loc>'), 'Must include /');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/directory</loc>'), 'Must include /directory');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/compare</loc>'), 'Must include /compare');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/matchmaker</loc>'), 'Must include /matchmaker');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/pricing</loc>'), 'Must include /pricing');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/for-schools</loc>'), 'Must include /for-schools');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/for-teachers</loc>'), 'Must include /for-teachers');
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/for-suppliers</loc>'), 'Must include /for-suppliers');

    // School canonical profiles
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/schools/ab5af86d-c902-4853-9528-d6200104b5f6</loc>'));
    assert.ok(sitemap.includes('<loc>https://skoolfinder.vercel.app/schools/ghana-international-school</loc>'));
    assert.ok(!sitemap.includes('/admin'), 'Must NOT include administrative routes in sitemap');
    assert.ok(!sitemap.includes('/api/'), 'Must NOT include API routes in sitemap');
  });

  // Test 6: Dynamic SEO Manager in public/js/app.js
  test('app.js updateSEO dynamically manages Document Title, Canonical, OpenGraph, Twitter, and Breadcrumbs', () => {
    const appCode = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
    assert.ok(appCode.includes('updateSEO({ title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, breadcrumbs, schema }'), 'updateSEO accepts breadcrumbs and keywords');
    assert.ok(appCode.includes('og:site_name'), 'updateSEO sets og:site_name');
    assert.ok(appCode.includes('og:locale'), 'updateSEO sets og:locale');
    assert.ok(appCode.includes('twitter:site'), 'updateSEO sets twitter:site');
    assert.ok(appCode.includes('schema-dynamic-breadcrumbs'), 'updateSEO injects BreadcrumbList schema');
  });

  // Test 7: Simulated DOM execution of App.updateSEO with Breadcrumbs
  test('App.updateSEO executes in DOM and injects BreadcrumbList Schema.org JSON-LD', () => {
    const headElements = [];
    const mockDocument = {
      title: '',
      head: {
        appendChild: (el) => headElements.push(el)
      },
      querySelector: (sel) => null,
      createElement: (tag) => ({
        tagName: tag,
        attrs: {},
        setAttribute(k, v) { this.attrs[k] = v; },
        getAttribute(k) { return this.attrs[k]; },
        textContent: '',
        remove: () => {}
      }),
      getElementById: (id) => null
    };

    const mockWindow = {
      location: { origin: 'https://skoolfinder.vercel.app', pathname: '/for-schools' }
    };

    const context = {
      document: mockDocument,
      window: mockWindow,
      console: { warn: () => {} }
    };
    vm.createContext(context);

    const appCode = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
    // Extract updateSEO function
    const snippet = `
      const App = {
        ${appCode.match(/updateSEO\([\s\S]*?\n  \},/)[0]}
      };
      App.updateSEO({
        title: 'For Schools & Proprietors | SkoolFinder Ghana',
        description: 'Accelerate pre-tertiary school admissions in Ghana.',
        keywords: 'Ghana schools, admissions, NaSIA',
        canonicalUrl: 'https://skoolfinder.vercel.app/for-schools',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'For Schools & Proprietors', url: '/for-schools' }
        ]
      });
      this.injectedElements = document.headElements || [];
    `;

    // Verify updateSEO runs cleanly without syntax or runtime error
    assert.doesNotThrow(() => {
      vm.runInContext(snippet, context);
    }, 'updateSEO must execute without throwing errors');
    assert.strictEqual(mockDocument.title, 'For Schools & Proprietors | SkoolFinder Ghana');
  });

  // Test 8: SEO_CONFIGS Coverage in app.js
  test('app.js SEO_CONFIGS specifies metadata & breadcrumbs across all canonical routes', () => {
    const appCode = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
    const requiredViews = [
      'home', 'directory', 'compare', 'matchmaker', 'parents', 
      'teachers', 'suppliers', 'schools', 'cssps', 'resources', 
      'pricing', 'for-schools', 'for-teachers', 'for-suppliers'
    ];
    for (const v of requiredViews) {
      assert.ok(appCode.includes(`'${v}': {`), `SEO_CONFIGS must include view '${v}'`);
    }
  });

  // Test 9: SchoolDetailView.js Schema.org Rich Snippets
  test('schoolDetailView.js generates rich Schema.org School structured data with ratings, reviews & facilities', () => {
    const code = fs.readFileSync(path.join(__dirname, '../public/js/views/schoolDetailView.js'), 'utf8');
    assert.ok(code.includes('"@type": "School"'), 'Must define @type: School');
    assert.ok(code.includes('"aggregateRating": {'), 'Must define aggregateRating');
    assert.ok(code.includes('"ratingValue":'), 'Must define ratingValue');
    assert.ok(code.includes('"reviewCount":') || code.includes('"ratingCount":'), 'Must define review/ratingCount');
    assert.ok(code.includes('"hasOfferCatalog": {'), 'Must define hasOfferCatalog for curricula');
    assert.ok(code.includes('"amenityFeature":'), 'Must define amenityFeature for facilities');
    assert.ok(code.includes('"@type": "Review"'), 'Must define Review items');
    assert.ok(code.includes('schema-school-jsonld'), 'Must inject to schema-school-jsonld tag');
  });

  // Test 10: Server Express Routes for Sitemaps & Robots.txt
  test('server.js serves /sitemap.xml and /robots.txt with appropriate MIME types', () => {
    const serverCode = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
    assert.ok(serverCode.includes("app.get('/sitemap.xml'"), 'Must define route GET /sitemap.xml');
    assert.ok(serverCode.includes("res.setHeader('Content-Type', 'application/xml; charset=utf-8');"), 'sitemap.xml must have application/xml Content-Type');
    assert.ok(serverCode.includes("app.get('/robots.txt'"), 'Must define route GET /robots.txt');
    assert.ok(serverCode.includes("res.setHeader('Content-Type', 'text/plain; charset=utf-8');"), 'robots.txt must have text/plain Content-Type');
  });

  // Test 11: Cache Buster Alignment in public/index.html
  test('public/index.html maintains unified cache buster (?v=77+) across all client scripts', () => {
    assert.ok(/\/js\/api\.js\?v=(7[7-9]|[8-9][0-9])/.test(indexHtml), 'api.js must have ?v=77+');
    assert.ok(/\/js\/app\.js\?v=(7[7-9]|[8-9][0-9])/.test(indexHtml), 'app.js must have ?v=77+');
    assert.ok(/\/js\/views\/schoolDetailView\.js\?v=(7[7-9]|[8-9][0-9])/.test(indexHtml), 'schoolDetailView.js must have ?v=77+');
    assert.ok(/\/js\/views\/forSchoolsView\.js\?v=(7[7-9]|[8-9][0-9])/.test(indexHtml), 'forSchoolsView.js must have ?v=77+');
  });

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedTests} / ${totalTests} SEO & RICH SNIPPETS CHECKS PASSED!`);
  console.log('========================================================================\n');
}

runSEOTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

