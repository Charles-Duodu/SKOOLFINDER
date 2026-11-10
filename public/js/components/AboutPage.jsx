import React, { useState } from 'react';

/**
 * AboutPage - Official About SkoolFinder Ghana Component
 * Responsive React implementation of the approved Concept Blueprint.
 *
 * Preserves navigation, branding, and four portal routes:
 * - Parents: /parents
 * - Schools: /for-schools
 * - Teachers/Educators: /for-teachers
 * - Suppliers/Providers: /for-suppliers
 */
export default function AboutPage({ onNavigate = (route) => window.location.href = route }) {
  const [activeTab, setActiveTab] = useState('parents');

  const journeyData = {
    parents: {
      eyebrow: 'THE PARENT JOURNEY',
      title: 'From searching to finding the right fit.',
      subtitle: 'Helping families explore educational options and make better-informed decisions.',
      steps: [
        { num: '01', text: 'Discover schools that match your needs' },
        { num: '02', text: 'Compare useful school information' },
        { num: '03', text: 'Connect with admissions teams' }
      ],
      connectedWith: 'Schools & educational institutions',
      portalRoute: '/parents',
      portalLabel: 'Explore Parent Services →'
    },
    schools: {
      eyebrow: 'THE SCHOOL OWNER JOURNEY',
      title: 'From listing to thriving institution.',
      subtitle: 'Equipping school leadership with visibility, verified enrolments and institutional procurement.',
      steps: [
        { num: '01', text: 'Showcase curriculum, fees & campus' },
        { num: '02', text: 'Engage prospective families & admissions' },
        { num: '03', text: 'Source verified teachers & supplier RFQs' }
      ],
      connectedWith: 'Families, verified educators & accredited suppliers',
      portalRoute: '/for-schools',
      portalLabel: 'Explore School Solutions →'
    },
    teachers: {
      eyebrow: 'THE EDUCATOR JOURNEY',
      title: 'From searching to impactful teaching.',
      subtitle: 'Connecting qualified teachers and tutors with schools and families.',
      steps: [
        { num: '01', text: 'Verify NTC credentials & build profile' },
        { num: '02', text: 'Apply directly to accredited school vacancies' },
        { num: '03', text: 'Connect with parents for private tutoring' }
      ],
      connectedWith: 'Accredited schools & Ghanaian families',
      portalRoute: '/for-teachers',
      portalLabel: 'Explore Educator Opportunities →'
    },
    suppliers: {
      eyebrow: 'THE SUPPLIER JOURNEY',
      title: 'From catalog to fulfilled contracts.',
      subtitle: 'Bridging reputable suppliers with school procurement desks.',
      steps: [
        { num: '01', text: 'Register business & list supplies or services' },
        { num: '02', text: 'Review active school tenders & submit bids' },
        { num: '03', text: 'Deliver orders with protected MoMo escrow' }
      ],
      connectedWith: 'School administrators & procurement heads',
      portalRoute: '/for-suppliers',
      portalLabel: 'Explore Supplier Opportunities →'
    }
  };

  const currentJourney = journeyData[activeTab];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="about-page-wrapper">
      {/* 00. Hero Section */}
      <section id="about-hero" className="about-hero-section">
        <div className="about-hero-container">
          <div className="about-hero-text">
            <div className="about-hero-eyebrow">
              <span>✦</span> ABOUT SKOOLFINDER GHANA <span>✦</span>
            </div>
            <h1 className="about-hero-title">
              One platform.<br />
              Four communities.<br />
              <span className="title-gold">Better connections.</span>
            </h1>
            <p className="about-hero-desc">
              We're building a connected education ecosystem that brings families, schools, education professionals and service providers together — creating better ways to discover, connect and grow.
            </p>
            <div className="about-hero-ctas">
              <button
                type="button"
                onClick={() => scrollToSection('about-ecosystem')}
                className="btn-about-gold"
              >
                Explore Our Ecosystem <span>↗</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about-story')}
                className="btn-about-outline"
              >
                Our Story <span>↓</span>
              </button>
            </div>
          </div>

          {/* Central Distinctive Ecosystem Orbit Illustration */}
          <div className="about-orbit-wrapper" aria-label="SkoolFinder Connected Ecosystem Illustration">
            <svg className="about-orbit-svg-rings" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="240" cy="240" r="215" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="240" cy="240" r="150" stroke="rgba(18, 102, 196, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="120" y1="120" x2="200" y2="200" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="360" y1="120" x2="280" y2="200" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="120" y1="360" x2="200" y2="280" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="360" y1="360" x2="280" y2="280" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
            </svg>

            {/* Central Core */}
            <div className="about-orbit-center-hub">
              <div style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>🇬🇭</div>
              <div className="about-orbit-brand-title">SkoolFinder</div>
              <div className="about-orbit-brand-flag">GHANA</div>
            </div>

            {/* Node 1: Parents */}
            <button
              type="button"
              onClick={() => onNavigate('/parents')}
              className="about-orbit-node about-orbit-node-top-left"
              title="Go to Parents Portal"
            >
              <div className="about-orbit-node-icon" style={{ background: '#eff6ff', color: '#1266C4' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <div className="about-orbit-node-name">Parents</div>
                <div className="about-orbit-node-sub">Discover schools</div>
              </div>
            </button>

            {/* Node 2: Schools */}
            <button
              type="button"
              onClick={() => onNavigate('/for-schools')}
              className="about-orbit-node about-orbit-node-top-right"
              title="Go to Schools Portal"
            >
              <div className="about-orbit-node-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l7-4 7 4v14"></path>
                  <path d="M9 10h1"></path>
                  <path d="M9 14h1"></path>
                  <path d="M14 10h1"></path>
                  <path d="M14 14h1"></path>
                  <path d="M10 21v-4h4v4"></path>
                </svg>
              </div>
              <div>
                <div className="about-orbit-node-name">Schools</div>
                <div className="about-orbit-node-sub">Grow &amp; connect</div>
              </div>
            </button>

            {/* Node 3: Educators */}
            <button
              type="button"
              onClick={() => onNavigate('/for-teachers')}
              className="about-orbit-node about-orbit-node-bottom-left"
              title="Go to Educators Portal"
            >
              <div className="about-orbit-node-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div>
                <div className="about-orbit-node-name">Educators</div>
                <div className="about-orbit-node-sub">Find opportunities</div>
              </div>
            </button>

            {/* Node 4: Providers */}
            <button
              type="button"
              onClick={() => onNavigate('/for-suppliers')}
              className="about-orbit-node about-orbit-node-bottom-right"
              title="Go to Suppliers Portal"
            >
              <div className="about-orbit-node-icon" style={{ background: '#f1f5f9', color: '#0284c7' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <div className="about-orbit-node-name">Providers</div>
                <div className="about-orbit-node-sub">Serve education</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Assurance Banner */}
      <div className="about-assurance-strip">
        <div className="about-assurance-inner">
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>Built around Ghana's education community</span>
          </div>
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>Beginning in Greater Accra</span>
          </div>
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>Free public school discovery</span>
          </div>
        </div>
      </div>

      {/* 01. Our Story */}
      <section id="about-story" className="about-story-section">
        <div className="about-story-container">
          <div className="about-section-eyebrow">01 / OUR STORY</div>
          <h2 className="about-section-heading">Education works better when we're connected.</h2>
          <div className="about-story-grid">
            <div className="about-story-copy">
              <p>
                Choosing a school, growing an institution, finding a teaching opportunity or reaching schools as a supplier can all be challenging when information and opportunities are scattered.
              </p>
              <p>
                <strong>SkoolFinder Ghana was conceived to bring these journeys closer together.</strong> Our vision goes beyond a school directory: a more connected digital space where everyone supporting education can find their place.
              </p>
              <p>
                We're beginning in Greater Accra, with ambitions to expand access and opportunity across Ghana.
              </p>
              <div style={{ marginTop: '1.75rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src="/assets/images/campus_hero.webp" alt="Ghanaian School Campus" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                  📍 Verified Campus Community in Greater Accra
                </div>
              </div>
            </div>

            <div>
              <div className="about-quote-card">
                <div className="about-quote-mark">“</div>
                <p className="about-quote-text">
                  We believe better connections can help create better educational opportunities for everyone.
                </p>
                <div className="about-quote-tag">WHAT DRIVES SKOOLFINDER</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. The Ecosystem */}
      <section id="about-ecosystem" className="about-eco-section">
        <div className="about-eco-header">
          <div className="about-section-eyebrow">02 / THE ECOSYSTEM</div>
          <h2 className="about-section-heading">Four communities. One shared purpose.</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 auto' }}>
            Different needs. Shared opportunities. Discover how each community plays a part in the SkoolFinder ecosystem.
          </p>
        </div>

        <div className="about-eco-grid">
          {/* Parents */}
          <div className="about-community-card">
            <div className="about-card-top-visual" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
              <div className="about-card-badge-icon" style={{ background: '#ffffff', color: '#1266C4' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="about-card-photo-pill">
                <img src="/assets/images/portals/01_parents_guardians.webp" alt="Ghanaian Parents & Student" />
              </div>
            </div>
            <div className="about-card-body">
              <h3 className="about-card-title">Parents &amp; Guardians</h3>
              <p className="about-card-desc">
                Discover schools, explore educational choices and connect with institutions that suit your family.
              </p>
              <button type="button" onClick={() => onNavigate('/parents')} className="about-card-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Explore connections <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* School Owners */}
          <div className="about-community-card">
            <div className="about-card-top-visual" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
              <div className="about-card-badge-icon" style={{ background: '#ffffff', color: '#b45309' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l7-4 7 4v14"></path>
                  <path d="M9 10h1"></path>
                  <path d="M9 14h1"></path>
                  <path d="M14 10h1"></path>
                  <path d="M14 14h1"></path>
                  <path d="M10 21v-4h4v4"></path>
                </svg>
              </div>
              <div className="about-card-photo-pill">
                <img src="/assets/images/portals/02_school_owners.webp" alt="Ghanaian School Proprietor" />
              </div>
            </div>
            <div className="about-card-body">
              <h3 className="about-card-title">School Owners &amp; Proprietors</h3>
              <p className="about-card-desc">
                Build school visibility, reach families and connect with the people and services that support growth.
              </p>
              <button type="button" onClick={() => onNavigate('/for-schools')} className="about-card-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Explore connections <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Teachers */}
          <div className="about-community-card">
            <div className="about-card-top-visual" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%)' }}>
              <div className="about-card-badge-icon" style={{ background: '#ffffff', color: '#059669' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <div className="about-card-photo-pill">
                <img src="/assets/images/portals/03_teachers_professionals.webp" alt="Ghanaian Teacher in Classroom" />
              </div>
            </div>
            <div className="about-card-body">
              <h3 className="about-card-title">Teachers &amp; Education Professionals</h3>
              <p className="about-card-desc">
                Discover career, tutoring and specialist service opportunities in the education community.
              </p>
              <button type="button" onClick={() => onNavigate('/for-teachers')} className="about-card-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Explore connections <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Suppliers */}
          <div className="about-community-card">
            <div className="about-card-top-visual" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)' }}>
              <div className="about-card-badge-icon" style={{ background: '#ffffff', color: '#0284c7' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="about-card-photo-pill">
                <img src="/assets/images/portals/04_suppliers_service_providers.webp" alt="Ghanaian Education Supplier" />
              </div>
            </div>
            <div className="about-card-body">
              <h3 className="about-card-title">Suppliers &amp; Service Providers</h3>
              <p className="about-card-desc">
                Connect your products and professional services with the schools and institutions that need them.
              </p>
              <button type="button" onClick={() => onNavigate('/for-suppliers')} className="about-card-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Explore connections <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="about-eco-footer-divider">
          <span>One ecosystem designed to create meaningful connections</span>
        </div>
      </section>

      {/* 03. How We Connect */}
      <section id="about-connect" className="about-connect-section">
        <div className="about-connect-container">
          <div>
            <div className="about-section-eyebrow">03 / HOW WE CONNECT</div>
            <h2 className="about-section-heading">See how it all comes together.</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
              Select a community to explore the journey and the relationships that connect the ecosystem.
            </p>

            <div className="about-tabs-list" role="tablist">
              {[
                { key: 'parents', label: 'Parents & Guardians', icon: '👨‍👩‍👧' },
                { key: 'schools', label: 'School Owners', icon: '🏫' },
                { key: 'teachers', label: 'Education Professionals', icon: '🧑‍🏫' },
                { key: 'suppliers', label: 'Suppliers & Providers', icon: '📦' }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`about-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span className="about-tab-arrow">&rarr;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Journey Card */}
          <div className="about-journey-card">
            <div>
              <div className="about-journey-eyebrow">{currentJourney.eyebrow}</div>
              <h3 className="about-journey-title">{currentJourney.title}</h3>
              <p className="about-journey-subtitle">{currentJourney.subtitle}</p>

              <div className="about-journey-steps">
                {currentJourney.steps.map((s, idx) => (
                  <div key={idx} className="about-step-pill-card">
                    <div className="about-step-number">{s.num}</div>
                    <div className="about-step-text">{s.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-journey-footer">
              <span>Connected with:</span>
              <strong>{currentJourney.connectedWith}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Our Purpose */}
      <section id="about-purpose" className="about-purpose-section">
        <div className="about-purpose-container">
          <div className="about-purpose-header">
            <div className="about-section-eyebrow">04 / OUR PURPOSE</div>
            <h2 className="about-section-heading">Driven by purpose. Built for possibilities.</h2>
          </div>

          <div className="about-purpose-cards-grid">
            <div className="about-purpose-card">
              <div className="about-purpose-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <h3 className="about-purpose-title">Our Mission</h3>
              <p className="about-purpose-desc">
                To make education discovery, professional connections and institutional growth simpler and more accessible through one connected digital platform.
              </p>
            </div>

            <div className="about-purpose-card">
              <div className="about-purpose-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h3 className="about-purpose-title">Our Vision</h3>
              <p className="about-purpose-desc">
                To become a leading digital ecosystem connecting families, schools, education professionals and businesses across Ghana.
              </p>
            </div>
          </div>

          <div className="about-locality-banner">
            <span className="about-locality-pill">GREATER ACCRA — GHANA</span>
            <span className="about-locality-text">
              Our journey begins with communities in Greater Accra, with a longer-term vision of serving education across the country.
            </span>
          </div>
        </div>
      </section>

      {/* 05. Be Part of Our Story */}
      <section id="about-cta" className="about-cta-section">
        <div className="about-cta-container">
          <div className="about-cta-eyebrow">05 / BE PART OF OUR STORY</div>
          <h2 className="about-cta-title">There is a place for you in the SkoolFinder ecosystem.</h2>
          <p className="about-cta-desc">
            Whether you're exploring schools, running an institution, building your education career or offering valuable services, meaningful connections start here.
          </p>
          <div className="about-cta-btns">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="btn-about-gold"
            >
              Visit SkoolFinder <span>↗</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about-ecosystem')}
              className="btn-about-outline"
            >
              Explore the Four Communities <span>↑</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
