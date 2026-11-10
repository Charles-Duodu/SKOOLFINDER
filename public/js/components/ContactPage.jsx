import React, { useState } from 'react';

/**
 * ContactPage - Official Contact SkoolFinder Ghana Component
 * Responsive React implementation of the approved Concept Blueprint.
 *
 * Uses official SkoolFinder blue (#1266C4, #0A2046) and yellow/gold (#D5A63B, #F59E0B, #FEF3C7).
 */
export default function ContactPage({ onNavigate = (route) => window.location.href = route }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    type: '',
    organization: '',
    message: ''
  });

  const [openFaq, setOpenFaq] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      category: '',
      type: '',
      organization: '',
      message: ''
    });
    setSubmitted(false);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQuickSelect = (category, type) => {
    setFormData(prev => ({ ...prev, category, type }));
    scrollTo('contact-enquiry-section');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.category || !formData.type || !formData.message) {
      alert('Please complete all required fields.');
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsPreviewOpen(false);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Do parents need to register to explore schools?',
      a: 'No! Public school discovery is 100% free and open to everyone without registration. Parents can freely search, filter, and compare schools across Greater Accra. Creating a free parent account simply unlocks saved favourites, child profiles, and direct admissions tracking.'
    },
    {
      q: 'How can I register my school on SkoolFinder?',
      a: 'School proprietors can claim or register their institution through the School Owners portal (/for-schools). Once basic details are submitted, our accreditation desk verifies NaSIA / GES licensing credentials before activating full admissions tools.'
    },
    {
      q: 'Can teachers and specialist educators join SkoolFinder?',
      a: 'Yes! Certified educators and subject specialists can register via the Teachers portal (/for-teachers). Showcase your verified NTC license badge, apply directly to accredited school vacancies, and offer private tutoring consultations to families.'
    },
    {
      q: 'Can businesses offer services to schools?',
      a: 'Absolutely. Educational suppliers, uniform tailors, IT providers, and contractors can join via the Suppliers portal (/for-suppliers) to list their products, respond to verified school RFQ tenders, and transact securely through milestone MoMo escrow.'
    },
    {
      q: 'How can I report incorrect school information or a privacy concern?',
      a: "We take data accuracy and child safeguarding very seriously under the Children's Act (Act 560) and Data Protection Act (Act 843). You can submit a correction directly using the enquiry form above by choosing 'General Feedback' or email compliance@skoolfinder.org."
    }
  ];

  return (
    <div className="contact-page-wrapper">
      {/* 00. Hero Section */}
      <section id="contact-hero" className="contact-hero-section">
        <div className="contact-hero-container">
          <div className="contact-hero-text">
            <div className="contact-hero-eyebrow">
              <span>✦</span> CONTACT SKOOLFINDER GHANA <span>✦</span>
            </div>
            <h1 className="contact-hero-title">
              Let's connect.<br />
              <span className="title-gold">We're here to help.</span>
            </h1>
            <p className="contact-hero-desc">
              Have a question, need assistance or want to explore an opportunity? Whether you're a parent, school owner, education professional or service provider, we'd love to hear from you.
            </p>
            <div className="contact-hero-ctas">
              <button type="button" onClick={() => scrollTo('contact-enquiry-section')} className="btn-about-gold">
                Send an Enquiry <span>↓</span>
              </button>
              <button type="button" onClick={() => scrollTo('contact-paths-section')} className="btn-about-outline">
                Find Your Support Path <span>↗</span>
              </button>
            </div>
          </div>

          {/* Contact Orbit */}
          <div className="contact-orbit-wrapper" aria-label="SkoolFinder Contact Support Hub">
            <svg className="about-orbit-svg-rings" viewBox="0 0 440 440" fill="none">
              <circle cx="220" cy="220" r="190" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="220" cy="220" r="130" stroke="rgba(18, 102, 196, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="110" y1="110" x2="180" y2="180" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="330" y1="110" x2="260" y2="180" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="110" y1="330" x2="180" y2="260" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
              <line x1="330" y1="330" x2="260" y2="260" stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="2 3" />
            </svg>

            <div className="contact-orbit-center-hub">
              <div style={{ fontSize: '1.5rem', color: '#1266C4', marginBottom: '0.2rem' }}>✉</div>
              <div className="contact-orbit-talk-text">LET'S TALK</div>
            </div>

            <button type="button" onClick={() => onNavigate('/parents')} className="about-orbit-node about-orbit-node-top-left" style={{ minWidth: 125 }}>
              <span style={{ fontSize: '1.15rem' }}>👨‍👩‍👧</span>
              <div className="about-orbit-node-name">Parents</div>
            </button>

            <button type="button" onClick={() => onNavigate('/for-schools')} className="about-orbit-node about-orbit-node-top-right" style={{ minWidth: 125 }}>
              <span style={{ fontSize: '1.15rem' }}>🏫</span>
              <div className="about-orbit-node-name">Schools</div>
            </button>

            <button type="button" onClick={() => onNavigate('/for-teachers')} className="about-orbit-node about-orbit-node-bottom-left" style={{ minWidth: 125 }}>
              <span style={{ fontSize: '1.15rem' }}>🧑‍🏫</span>
              <div className="about-orbit-node-name">Educators</div>
            </button>

            <button type="button" onClick={() => onNavigate('/for-suppliers')} className="about-orbit-node about-orbit-node-bottom-right" style={{ minWidth: 125 }}>
              <span style={{ fontSize: '1.15rem' }}>📦</span>
              <div className="about-orbit-node-name">Providers</div>
            </button>
          </div>
        </div>
      </section>

      {/* Assurance Banner */}
      <div className="contact-assurance-strip">
        <div className="contact-assurance-inner">
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>One platform, four communities</span>
          </div>
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>Greater Accra focus</span>
          </div>
          <div className="about-assurance-item">
            <span className="about-assurance-check">✓</span>
            <span>Enquiries across the ecosystem</span>
          </div>
        </div>
      </div>

      {/* 01. Support Paths */}
      <section id="contact-paths-section" className="contact-paths-section">
        <div className="contact-paths-container">
          <div className="contact-paths-header">
            <div className="about-section-eyebrow">FIND YOUR SUPPORT PATH</div>
            <h2 className="about-section-heading">How can we help you today?</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Choose the community that best describes you, and we'll help you direct your enquiry to the right area.
            </p>
          </div>

          <div className="contact-paths-grid">
            <div className="contact-path-card">
              <div className="contact-path-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="contact-path-title">Parents &amp; Guardians</h3>
              <p className="contact-path-desc">
                Questions about finding schools, school information, comparisons or your parent account.
              </p>
              <button
                type="button"
                onClick={() => handleQuickSelect('Parent / Guardian', 'School Admissions & Discovery')}
                className="contact-path-link"
              >
                Ask a Question <span>&rarr;</span>
              </button>
            </div>

            <div className="contact-path-card">
              <div className="contact-path-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="contact-path-title">School Owners &amp; Proprietors</h3>
              <p className="contact-path-desc">
                School registration, listing management, admissions enquiries or institutional support.
              </p>
              <button
                type="button"
                onClick={() => handleQuickSelect('School Owner / Proprietor', 'School Listing & Verification')}
                className="contact-path-link"
              >
                Contact School Support <span>&rarr;</span>
              </button>
            </div>

            <div className="contact-path-card">
              <div className="contact-path-icon-box" style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="contact-path-title">Teachers &amp; Education Professionals</h3>
              <p className="contact-path-desc">
                Professional registration, vacancies, tutoring services and account assistance.
              </p>
              <button
                type="button"
                onClick={() => handleQuickSelect('Teacher / Educator', 'Teacher Jobs & Tutoring')}
                className="contact-path-link"
              >
                Professional Enquiries <span>&rarr;</span>
              </button>
            </div>

            <div className="contact-path-card">
              <div className="contact-path-icon-box" style={{ background: '#F0F9FF', color: '#0284C7', borderColor: '#BAE6FD' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3 className="contact-path-title">Suppliers &amp; Service Providers</h3>
              <p className="contact-path-desc">
                Supplier registration, school procurement, business listings and tender-related questions.
              </p>
              <button
                type="button"
                onClick={() => handleQuickSelect('Supplier / Service Provider', 'Tenders & School Procurement')}
                className="contact-path-link"
              >
                Business Enquiries <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Send an Enquiry */}
      <section id="contact-enquiry-section" className="contact-enquiry-section">
        <div className="contact-enquiry-container">
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="about-section-eyebrow">SEND AN ENQUIRY</div>
              <h2 className="about-section-heading" style={{ marginBottom: '0.5rem' }}>Tell us how we can help.</h2>
              <p style={{ color: '#64748b', fontSize: '0.98rem', margin: 0 }}>
                Complete the form below and review your enquiry details.
              </p>
            </div>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: 16, padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ color: '#065f46', fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>Enquiry Received!</h3>
                <p style={{ color: '#047857', fontSize: '0.95rem', margin: '0 0 1.5rem' }}>
                  Thank you, {formData.name}. Our team has received your enquiry and will respond to {formData.email} promptly.
                </p>
                <button type="button" onClick={handleClear} className="btn-contact-submit" style={{ display: 'inline-block' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label">Full Name <span className="req-star">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="contact-input"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-form-label">Email Address <span className="req-star">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="contact-input"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label">I Am a... <span className="req-star">*</span></label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="contact-select"
                      required
                    >
                      <option value="">Select your category</option>
                      <option value="Parent / Guardian">Parent / Guardian</option>
                      <option value="School Owner / Proprietor">School Owner / Proprietor</option>
                      <option value="Teacher / Educator">Teacher / Educator</option>
                      <option value="Supplier / Service Provider">Supplier / Service Provider</option>
                      <option value="Other / General Public">Other / General Public</option>
                    </select>
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-form-label">Enquiry Type <span className="req-star">*</span></label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="contact-select"
                      required
                    >
                      <option value="">Select enquiry type</option>
                      <option value="School Admissions & Discovery">School Admissions & Discovery</option>
                      <option value="School Listing & Verification">School Listing & Verification</option>
                      <option value="Teacher Jobs & Tutoring">Teacher Jobs & Tutoring</option>
                      <option value="Tenders & School Procurement">Tenders & School Procurement</option>
                      <option value="Technical Support / Account">Technical Support / Account</option>
                      <option value="Partnerships & Press">Partnerships & Press</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">School or Organisation <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Optional)</span></label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="contact-input"
                    placeholder="Name of your school, company or organisation"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Your Message <span className="req-star">*</span></label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="contact-textarea"
                    placeholder="Please briefly describe your enquiry. Avoid sharing children's personal details, passwords or payment information."
                    required
                  ></textarea>
                </div>

                <div className="contact-form-actions">
                  <button type="submit" className="btn-contact-submit">
                    Preview Enquiry <span>↗</span>
                  </button>
                  <button type="button" onClick={handleClear} className="btn-contact-clear">
                    Clear Form
                  </button>
                </div>

                <div className="contact-disclaimer-text">
                  This is an interactive design preview. The form is not connected to SkoolFinder support, so previewing does not send a message.
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar Stack */}
          <div className="contact-sidebar-stack">
            <div className="contact-ecosystem-card">
              <div className="contact-eco-icon-badge">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 className="contact-eco-card-title">One ecosystem.<br />Here to connect.</h3>
              <p className="contact-eco-card-desc">
                SkoolFinder is designed to make it easier to connect with the people, institutions and opportunities that matter across Ghana's education sector.
              </p>
              <div className="contact-eco-info-block">
                <div className="contact-eco-info-label">General enquiries</div>
                <div className="contact-eco-info-val">Questions, feedback and platform suggestions.</div>
              </div>
              <div className="contact-eco-info-block">
                <div className="contact-eco-info-label">Partnerships</div>
                <div className="contact-eco-info-val">Ideas for collaborating with SkoolFinder and supporting education.</div>
              </div>
              <div className="contact-eco-info-block">
                <div className="contact-eco-info-label">Our starting focus</div>
                <div className="contact-eco-info-val">Greater Accra, Ghana — with a wider national vision.</div>
              </div>
            </div>

            <div className="contact-guidelines-card">
              <h4 className="contact-guidelines-title">Before you get in touch</h4>
              <p className="contact-guidelines-sub">
                Help us understand your question by choosing the right category and providing a short, clear description.
              </p>
              <div className="contact-guidelines-callout">
                <div className="contact-callout-heading">Privacy &amp; safety:</div>
                <div className="contact-callout-body">
                  Please don't include children's sensitive information, identity documents, passwords or financial details in this general form.
                </div>
              </div>
              <div className="contact-guidelines-callout">
                <div className="contact-callout-heading">Urgent safety concerns:</div>
                <div className="contact-callout-body">
                  If someone is in immediate danger, contact the appropriate emergency services. A general contact form is not an emergency channel.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. FAQs */}
      <section id="contact-faq" className="contact-faq-section">
        <div className="contact-faq-container">
          <div className="contact-faq-header">
            <div className="about-section-eyebrow">HELPFUL ANSWERS</div>
            <h2 className="about-section-heading">Frequently asked questions.</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Here are answers to some common questions about the SkoolFinder ecosystem.
            </p>
          </div>

          <div className="contact-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`contact-faq-item ${openFaq === i ? 'active' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="contact-faq-trigger"
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <span className="contact-faq-icon">+</span>
                </button>
                {openFaq === i && (
                  <div className="contact-faq-answer" style={{ display: 'block' }}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. CTA */}
      <section id="contact-cta" className="about-cta-section">
        <div className="about-cta-container">
          <div className="about-cta-eyebrow">DISCOVER MORE</div>
          <h2 className="about-cta-title">Explore the SkoolFinder ecosystem.</h2>
          <p className="about-cta-desc">
            Find schools, discover career opportunities and explore the communities connecting Ghana's education sector.
          </p>
          <div className="about-cta-btns">
            <button type="button" onClick={() => onNavigate('/')} className="btn-about-gold">
              Visit SkoolFinder Ghana <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="contact-preview-modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="contact-preview-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ENQUIRY PREVIEW</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: '#0A2046', margin: '0.2rem 0 0' }}>Review Your Enquiry Details</h3>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              <div><strong style={{ color: '#0A2046' }}>Name:</strong> <span style={{ color: '#475569' }}>{formData.name}</span></div>
              <div><strong style={{ color: '#0A2046' }}>Email:</strong> <span style={{ color: '#475569' }}>{formData.email}</span></div>
              <div><strong style={{ color: '#0A2046' }}>Category:</strong> <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 9999 }}>{formData.category}</span></div>
              <div><strong style={{ color: '#0A2046' }}>Enquiry Type:</strong> <span style={{ color: '#475569' }}>{formData.type}</span></div>
              {formData.organization && <div><strong style={{ color: '#0A2046' }}>Organisation:</strong> <span style={{ color: '#475569' }}>{formData.organization}</span></div>}
              <div>
                <strong style={{ color: '#0A2046' }}>Message:</strong>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.85rem', marginTop: '0.35rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{formData.message}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="btn-pill btn-outline" style={{ padding: '0.6rem 1.25rem' }}>Edit Details</button>
              <button type="button" onClick={handleConfirmSubmit} className="btn-pill" style={{ background: '#0A2046', color: '#ffffff', padding: '0.6rem 1.5rem', fontWeight: 800 }}>Confirm &amp; Send &rarr;</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

