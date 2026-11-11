/**
 * SkoolFinder Ghana - Contact View
 * Official Contact SkoolFinder Ghana Page Blueprint
 * Let's Connect. We're Here to Help.
 */
const ContactView = {
  async render() {
    return `
      <div class="contact-page-wrapper">

        <!-- ========================================================
             00. CONTACT HERO SECTION
             ======================================================== -->
        <section id="contact-hero" class="contact-hero-section">
          <!-- Ambient Glow Blobs -->
          <div style="position: absolute; top: -120px; right: -80px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(213, 166, 59, 0.16) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
          <div style="position: absolute; bottom: -80px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(18, 102, 196, 0.22) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>

          <div class="contact-hero-container">
            <!-- Left Text Content -->
            <div class="contact-hero-text">
              <div class="contact-hero-eyebrow">
                <span>✦</span> CONTACT SKOOLFINDER GHANA <span>✦</span>
              </div>
              <h1 class="contact-hero-title">
                Let's connect.<br>
                <span class="title-gold">We're here to help.</span>
              </h1>
              <p class="contact-hero-desc">
                Have a question, need assistance or want to explore an opportunity? Whether you're a parent, school owner, education professional or service provider, we'd love to hear from you.
              </p>
              <div class="contact-hero-ctas">
                <a href="#contact-enquiry-section" id="btn-hero-send-enquiry" class="btn-about-gold">
                  Send an Enquiry <span>↓</span>
                </a>
                <a href="#contact-paths-section" id="btn-hero-support-path" class="btn-about-outline">
                  Find Your Support Path <span>↗</span>
                </a>
              </div>
            </div>

            <!-- Right: Interactive Contact Ecosystem Orbit Widget -->
            <div class="contact-orbit-wrapper" aria-label="SkoolFinder Contact Support Hub">
              <svg class="about-orbit-svg-rings" viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="220" cy="220" r="190" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" stroke-dasharray="6 6" />
                <circle cx="220" cy="220" r="130" stroke="rgba(18, 102, 196, 0.35)" stroke-width="1.5" stroke-dasharray="4 4" />
                <line x1="110" y1="110" x2="180" y2="180" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="330" y1="110" x2="260" y2="180" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="110" y1="330" x2="180" y2="260" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
                <line x1="330" y1="330" x2="260" y2="260" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 3" />
              </svg>

              <!-- Central Core Hub -->
              <div class="contact-orbit-center-hub">
                <div style="font-size: 1.5rem; color: #1266C4; margin-bottom: 0.2rem;">✉</div>
                <div class="contact-orbit-talk-text">LET'S TALK</div>
              </div>

              <!-- Node: Parents (Top-Left) -->
              <a href="/parents" class="about-orbit-node about-orbit-node-top-left" style="min-width: 125px;" title="Parents Portal">
                <span style="font-size: 1.15rem;">👨‍👩‍👧</span>
                <div>
                  <div class="about-orbit-node-name">Parents</div>
                </div>
              </a>

              <!-- Node: Schools (Top-Right) -->
              <a href="/for-schools" class="about-orbit-node about-orbit-node-top-right" style="min-width: 125px;" title="Schools Portal">
                <span style="font-size: 1.15rem;">🏫</span>
                <div>
                  <div class="about-orbit-node-name">Schools</div>
                </div>
              </a>

              <!-- Node: Educators (Bottom-Left) -->
              <a href="/for-teachers" class="about-orbit-node about-orbit-node-bottom-left" style="min-width: 125px;" title="Educators Portal">
                <span style="font-size: 1.15rem;">🧑‍🏫</span>
                <div>
                  <div class="about-orbit-node-name">Educators</div>
                </div>
              </a>

              <!-- Node: Providers (Bottom-Right) -->
              <a href="/for-suppliers" class="about-orbit-node about-orbit-node-bottom-right" style="min-width: 125px;" title="Suppliers Portal">
                <span style="font-size: 1.15rem;">📦</span>
                <div>
                  <div class="about-orbit-node-name">Providers</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- Sub-hero Assurance Banner -->
        <div class="contact-assurance-strip">
          <div class="contact-assurance-inner">
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>One platform, four communities</span>
            </div>
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>Greater Accra focus</span>
            </div>
            <div class="about-assurance-item">
              <span class="about-assurance-check">✓</span>
              <span>Enquiries across the ecosystem</span>
            </div>
          </div>
        </div>

        <!-- ========================================================
             01. FIND YOUR SUPPORT PATH
             ======================================================== -->
        <section id="contact-paths-section" class="contact-paths-section">
          <div class="contact-paths-container">
            <div class="contact-paths-header">
              <div class="about-section-eyebrow">FIND YOUR SUPPORT PATH</div>
              <h2 class="about-section-heading">How can we help you today?</h2>
              <p style="color: #64748b; font-size: 1.05rem; line-height: 1.6; margin: 0;">
                Choose the community that best describes you, and we'll help you direct your enquiry to the right area.
              </p>
            </div>

            <div class="contact-paths-grid">
              <!-- Card 1: Parents & Guardians -->
              <div class="contact-path-card">
                <div class="contact-path-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 class="contact-path-title">Parents &amp; Guardians</h3>
                <p class="contact-path-desc">
                  Questions about finding schools, school information, comparisons or your parent account.
                </p>
                <button type="button" class="contact-path-link" data-select-category="Parent / Guardian" data-select-type="School Admissions & Discovery">
                  Ask a Question <span>&rarr;</span>
                </button>
              </div>

              <!-- Card 2: School Owners & Proprietors -->
              <div class="contact-path-card">
                <div class="contact-path-icon-box" style="background: #FEF3C7; color: #B45309;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <h3 class="contact-path-title">School Owners &amp; Proprietors</h3>
                <p class="contact-path-desc">
                  School registration, listing management, admissions enquiries or institutional support.
                </p>
                <button type="button" class="contact-path-link" data-select-category="School Owner / Proprietor" data-select-type="School Listing & Verification">
                  Contact School Support <span>&rarr;</span>
                </button>
              </div>

              <!-- Card 3: Teachers & Education Professionals -->
              <div class="contact-path-card">
                <div class="contact-path-icon-box" style="background: #ECFDF5; color: #059669; border-color: #A7F3D0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 class="contact-path-title">Teachers &amp; Education Professionals</h3>
                <p class="contact-path-desc">
                  Professional registration, vacancies, tutoring services and account assistance.
                </p>
                <button type="button" class="contact-path-link" data-select-category="Teacher / Educator" data-select-type="Teacher Jobs & Tutoring">
                  Professional Enquiries <span>&rarr;</span>
                </button>
              </div>

              <!-- Card 4: Suppliers & Service Providers -->
              <div class="contact-path-card">
                <div class="contact-path-icon-box" style="background: #F0F9FF; color: #0284C7; border-color: #BAE6FD;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h3 class="contact-path-title">Suppliers &amp; Service Providers</h3>
                <p class="contact-path-desc">
                  Supplier registration, school procurement, business listings and tender-related questions.
                </p>
                <button type="button" class="contact-path-link" data-select-category="Supplier / Service Provider" data-select-type="Tenders & School Procurement">
                  Business Enquiries <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================
             02. SEND AN ENQUIRY (Form & Sidebar Stack)
             ======================================================== -->
        <section id="contact-enquiry-section" class="contact-enquiry-section">
          <div class="contact-enquiry-container">
            
            <!-- Left: Enquiry Form Card -->
            <div class="contact-form-card">
              <div class="contact-form-header">
                <div class="about-section-eyebrow">SEND AN ENQUIRY</div>
                <h2 class="about-section-heading" style="margin-bottom: 0.5rem;">Tell us how we can help.</h2>
                <p style="color: #64748b; font-size: 0.98rem; margin: 0;">
                  Complete the form below and review your enquiry details.
                </p>
              </div>

              <form id="contact-enquiry-form" novalidate>
                <!-- Row 1: Name & Email -->
                <div class="contact-form-row">
                  <div class="contact-form-group">
                    <label for="contact-name" class="contact-form-label">Full Name <span class="req-star">*</span></label>
                    <input type="text" id="contact-name" name="name" class="contact-input" placeholder="Your full name" required />
                  </div>
                  <div class="contact-form-group">
                    <label for="contact-email" class="contact-form-label">Email Address <span class="req-star">*</span></label>
                    <input type="email" id="contact-email" name="email" class="contact-input" placeholder="you@example.com" required />
                  </div>
                </div>

                <!-- Row 2: Category & Enquiry Type -->
                <div class="contact-form-row">
                  <div class="contact-form-group">
                    <label for="contact-category" class="contact-form-label">I Am a... <span class="req-star">*</span></label>
                    <select id="contact-category" name="category" class="contact-select" required>
                      <option value="">Select your category</option>
                      <option value="Parent / Guardian">Parent / Guardian</option>
                      <option value="School Owner / Proprietor">School Owner / Proprietor</option>
                      <option value="Teacher / Educator">Teacher / Educator</option>
                      <option value="Supplier / Service Provider">Supplier / Service Provider</option>
                      <option value="Other / General Public">Other / General Public</option>
                    </select>
                  </div>
                  <div class="contact-form-group">
                    <label for="contact-type" class="contact-form-label">Enquiry Type <span class="req-star">*</span></label>
                    <select id="contact-type" name="type" class="contact-select" required>
                      <option value="">Select enquiry type</option>
                      <option value="School Admissions & Discovery">School Admissions &amp; Discovery</option>
                      <option value="School Listing & Verification">School Listing &amp; Verification</option>
                      <option value="Teacher Jobs & Tutoring">Teacher Jobs &amp; Tutoring</option>
                      <option value="Tenders & School Procurement">Tenders &amp; School Procurement</option>
                      <option value="Technical Support / Account">Technical Support / Account</option>
                      <option value="Partnerships & Press">Partnerships &amp; Press</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                <!-- Row 3: School or Organisation (Optional) -->
                <div class="contact-form-group">
                  <label for="contact-org" class="contact-form-label">School or Organisation <span style="color: #94a3b8; font-weight: 500;">(Optional)</span></label>
                  <input type="text" id="contact-org" name="organization" class="contact-input" placeholder="Name of your school, company or organisation" />
                </div>

                <!-- Row 4: Your Message -->
                <div class="contact-form-group">
                  <label for="contact-message" class="contact-form-label">Your Message <span class="req-star">*</span></label>
                  <textarea id="contact-message" name="message" class="contact-textarea" placeholder="Please briefly describe your enquiry. Avoid sharing children's personal details, passwords or payment information." required></textarea>
                </div>

                <!-- Form Buttons -->
                <div class="contact-form-actions">
                  <button type="submit" id="btn-preview-enquiry" class="btn-contact-submit">
                    Preview Enquiry <span>↗</span>
                  </button>
                  <button type="button" id="btn-clear-enquiry" class="btn-contact-clear">
                    Clear Form
                  </button>
                </div>

                <div id="contact-submit-receipt" style="display: none; margin-top: 1rem; padding: 1rem 1.25rem; background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 12px; color: #065f46; font-size: 0.92rem; line-height: 1.5;"></div>

                <div class="contact-disclaimer-text">
                  Your enquiry is submitted securely to SkoolFinder Ghana Support, with an automated confirmation sent to your email address.
                </div>
              </form>
            </div>

            <!-- Right: Sidebar Information Stack -->
            <div class="contact-sidebar-stack">
              <!-- Top Navy Card -->
              <div class="contact-ecosystem-card">
                <div class="contact-eco-icon-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h3 class="contact-eco-card-title">One ecosystem.<br>Here to connect.</h3>
                <p class="contact-eco-card-desc">
                  SkoolFinder is designed to make it easier to connect with the people, institutions and opportunities that matter across Ghana's education sector.
                </p>

                <div class="contact-eco-info-block">
                  <div class="contact-eco-info-label">General enquiries</div>
                  <div class="contact-eco-info-val">Questions, feedback and platform suggestions.</div>
                </div>

                <div class="contact-eco-info-block">
                  <div class="contact-eco-info-label">Partnerships</div>
                  <div class="contact-eco-info-val">Ideas for collaborating with SkoolFinder and supporting education.</div>
                </div>

                <div class="contact-eco-info-block">
                  <div class="contact-eco-info-label">Our starting focus</div>
                  <div class="contact-eco-info-val">Greater Accra, Ghana &mdash; with a wider national vision.</div>
                </div>
              </div>

              <!-- Bottom Guidelines Card -->
              <div class="contact-guidelines-card">
                <h4 class="contact-guidelines-title">Before you get in touch</h4>
                <p class="contact-guidelines-sub">
                  Help us understand your question by choosing the right category and providing a short, clear description.
                </p>

                <div class="contact-guidelines-callout">
                  <div class="contact-callout-heading">Privacy &amp; safety:</div>
                  <div class="contact-callout-body">
                    Please don't include children's sensitive information, identity documents, passwords or financial details in this general form.
                  </div>
                </div>

                <div class="contact-guidelines-callout">
                  <div class="contact-callout-heading">Urgent safety concerns:</div>
                  <div class="contact-callout-body">
                    If someone is in immediate danger, contact the appropriate emergency services. A general contact form is not an emergency channel.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ========================================================
             03. FREQUENTLY ASKED QUESTIONS
             ======================================================== -->
        <section id="contact-faq" class="contact-faq-section">
          <div class="contact-faq-container">
            <div class="contact-faq-header">
              <div class="about-section-eyebrow">HELPFUL ANSWERS</div>
              <h2 class="about-section-heading">Frequently asked questions.</h2>
              <p style="color: #64748b; font-size: 1.05rem; line-height: 1.6; margin: 0;">
                Here are answers to some common questions about the SkoolFinder ecosystem.
              </p>
            </div>

            <div class="contact-faq-list">
              <!-- FAQ 1 -->
              <div class="contact-faq-item">
                <button type="button" class="contact-faq-trigger" aria-expanded="false">
                  <span>Do parents need to register to explore schools?</span>
                  <span class="contact-faq-icon">+</span>
                </button>
                <div class="contact-faq-answer">
                  <p>
                    No! Public school discovery is 100% free and open to everyone without registration. Parents can freely search, filter, and compare schools across Greater Accra. Creating a free parent account simply unlocks saved favourites, child profiles, and direct admissions tracking.
                  </p>
                </div>
              </div>

              <!-- FAQ 2 -->
              <div class="contact-faq-item">
                <button type="button" class="contact-faq-trigger" aria-expanded="false">
                  <span>How can I register my school on SkoolFinder?</span>
                  <span class="contact-faq-icon">+</span>
                </button>
                <div class="contact-faq-answer">
                  <p>
                    School proprietors can claim or register their institution through the School Owners portal (/for-schools). Once basic details are submitted, our accreditation desk verifies NaSIA / GES licensing credentials before activating full admissions tools.
                  </p>
                </div>
              </div>

              <!-- FAQ 3 -->
              <div class="contact-faq-item">
                <button type="button" class="contact-faq-trigger" aria-expanded="false">
                  <span>Can teachers and specialist educators join SkoolFinder?</span>
                  <span class="contact-faq-icon">+</span>
                </button>
                <div class="contact-faq-answer">
                  <p>
                    Yes! Certified educators and subject specialists can register via the Teachers portal (/for-teachers). Showcase your verified NTC license badge, apply directly to accredited school vacancies, and offer private tutoring consultations to families.
                  </p>
                </div>
              </div>

              <!-- FAQ 4 -->
              <div class="contact-faq-item">
                <button type="button" class="contact-faq-trigger" aria-expanded="false">
                  <span>Can businesses offer services to schools?</span>
                  <span class="contact-faq-icon">+</span>
                </button>
                <div class="contact-faq-answer">
                  <p>
                    Absolutely. Educational suppliers, uniform tailors, IT providers, and contractors can join via the Suppliers portal (/for-suppliers) to list their products, respond to verified school RFQ tenders, and transact securely through milestone MoMo escrow.
                  </p>
                </div>
              </div>

              <!-- FAQ 5 -->
              <div class="contact-faq-item">
                <button type="button" class="contact-faq-trigger" aria-expanded="false">
                  <span>How can I report incorrect school information or a privacy concern?</span>
                  <span class="contact-faq-icon">+</span>
                </button>
                <div class="contact-faq-answer">
                  <p>
                    We take data accuracy and child safeguarding very seriously under the Children's Act (Act 560) and Data Protection Act (Act 843). You can submit a correction directly using the enquiry form above by choosing "General Feedback" or email compliance@skoolfinder.org.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================
             04. DISCOVER MORE (CTA BANNER)
             ======================================================== -->
        <section id="contact-cta" class="about-cta-section">
          <div class="about-cta-container">
            <div class="about-cta-eyebrow">DISCOVER MORE</div>
            <h2 class="about-cta-title">Explore the SkoolFinder ecosystem.</h2>
            <p class="about-cta-desc">
              Find schools, discover career opportunities and explore the communities connecting Ghana's education sector.
            </p>
            <div class="about-cta-btns">
              <button type="button" id="btn-contact-visit-home" class="btn-about-gold">
                Visit SkoolFinder Ghana <span>↗</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Interactive Preview Modal Mount -->
        <div id="contact-modal-root"></div>

      </div>
    `;
  },

  openPreviewModal(formData) {
    const root = document.getElementById('contact-modal-root');
    if (!root) return;

    root.innerHTML = `
      <div class="contact-preview-modal-overlay" id="contact-modal-backdrop">
        <div class="contact-preview-modal">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.85rem;">
            <div>
              <div style="color: #F59E0B; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">ENQUIRY PREVIEW</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; margin: 0.2rem 0 0 0;">Review Your Enquiry Details</h3>
            </div>
            <button type="button" id="btn-close-modal" style="background: none; border: none; font-size: 1.5rem; color: #64748b; cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.92rem; margin-bottom: 1.5rem;">
            <div><strong style="color: #0A2046;">Name:</strong> <span style="color: #475569;">${this.escapeHtml(formData.name)}</span></div>
            <div><strong style="color: #0A2046;">Email:</strong> <span style="color: #475569;">${this.escapeHtml(formData.email)}</span></div>
            <div><strong style="color: #0A2046;">Category:</strong> <span class="badge" style="background: #FEF3C7; color: #92400E; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 9999px;">${this.escapeHtml(formData.category)}</span></div>
            <div><strong style="color: #0A2046;">Enquiry Type:</strong> <span style="color: #475569;">${this.escapeHtml(formData.type)}</span></div>
            ${formData.organization ? `<div><strong style="color: #0A2046;">Organisation:</strong> <span style="color: #475569;">${this.escapeHtml(formData.organization)}</span></div>` : ''}
            <div>
              <strong style="color: #0A2046;">Message:</strong>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; margin-top: 0.35rem; color: #334155; line-height: 1.5; white-space: pre-wrap;">${this.escapeHtml(formData.message)}</div>
            </div>
          </div>

          <div id="contact-modal-error" style="display: none; margin-bottom: 1rem; padding: 0.75rem 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; color: #b91c1c; font-size: 0.88rem; font-weight: 600;"></div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
            <button type="button" id="btn-modal-edit" class="btn-pill btn-outline" style="padding: 0.6rem 1.25rem;">Edit Details</button>
            <button type="button" id="btn-modal-confirm" class="btn-pill" style="background: #0A2046; color: #ffffff; padding: 0.6rem 1.5rem; font-weight: 800;">Confirm &amp; Send Enquiry &rarr;</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closePreviewModal());
    document.getElementById('btn-modal-edit')?.addEventListener('click', () => this.closePreviewModal());
    document.getElementById('contact-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'contact-modal-backdrop') this.closePreviewModal();
    });

    const confirmBtn = document.getElementById('btn-modal-confirm');
    const editBtn = document.getElementById('btn-modal-edit');
    const errorBox = document.getElementById('contact-modal-error');

    confirmBtn?.addEventListener('click', async () => {
      if (confirmBtn.disabled) return;
      if (errorBox) {
        errorBox.style.display = 'none';
        errorBox.textContent = '';
      }

      const originalLabel = confirmBtn.innerHTML;
      confirmBtn.disabled = true;
      if (editBtn) editBtn.disabled = true;
      confirmBtn.textContent = 'Sending Enquiry...';

      try {
        const response = await fetch('/api/inquiries/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Unable to send your enquiry right now. Please try again.');
        }

        const refCode = data.referenceCode || '';
        this.closePreviewModal();

        const receiptEl = document.getElementById('contact-submit-receipt');
        if (receiptEl) {
          receiptEl.innerHTML = `
            <div style="font-weight: 800; color: #064e3b; margin-bottom: 0.25rem;">Enquiry Sent Successfully${refCode ? ` (Ref: ${this.escapeHtml(refCode)})` : ''}</div>
            <div>Thank you, <strong>${this.escapeHtml(formData.name)}</strong>. A confirmation has been queued for <strong>${this.escapeHtml(formData.email)}</strong> and our SkoolFinder Ghana support desk has been notified.</div>
          `;
          receiptEl.style.display = 'block';
        }

        if (typeof State !== 'undefined' && State.showToast) {
          State.showToast(`✅ Enquiry sent${refCode ? ` (${refCode})` : ''}! Confirmation queued for ${formData.email}.`, 'success');
        } else {
          alert(`Thank you! Your enquiry${refCode ? ` (${refCode})` : ''} has been received.`);
        }
        document.getElementById('contact-enquiry-form')?.reset();
      } catch (err) {
        if (errorBox) {
          errorBox.textContent = err.message || 'Network error while sending your enquiry.';
          errorBox.style.display = 'block';
        }
        if (typeof State !== 'undefined' && State.showToast) {
          State.showToast(err.message || 'Failed to send enquiry.', 'error');
        }
        confirmBtn.disabled = false;
        if (editBtn) editBtn.disabled = false;
        confirmBtn.innerHTML = originalLabel;
      }
    });
  },

  closePreviewModal() {
    const root = document.getElementById('contact-modal-root');
    if (root) root.innerHTML = '';
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  attachEvents() {
    // Smooth scroll from Hero CTAs
    document.getElementById('btn-hero-send-enquiry')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#contact-enquiry-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btn-hero-support-path')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#contact-paths-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('btn-contact-visit-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Support Path Cards quick-select buttons
    document.querySelectorAll('[data-select-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.getAttribute('data-select-category');
        const typ = btn.getAttribute('data-select-type');

        const catSelect = document.getElementById('contact-category');
        const typSelect = document.getElementById('contact-type');

        if (catSelect && cat) catSelect.value = cat;
        if (typSelect && typ) typSelect.value = typ;

        document.querySelector('#contact-enquiry-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          document.getElementById('contact-name')?.focus();
        }, 300);
      });
    });

    // Form Submission & Validation
    const form = document.getElementById('contact-enquiry-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const category = document.getElementById('contact-category')?.value;
      const type = document.getElementById('contact-type')?.value;
      const organization = document.getElementById('contact-org')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !category || !type || !message) {
        if (typeof State !== 'undefined' && State.showToast) {
          State.showToast('Please fill in all required fields (Name, Email, Category, Enquiry Type, and Message).', 'error');
        } else {
          alert('Please fill in all required fields.');
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (typeof State !== 'undefined' && State.showToast) {
          State.showToast('Please enter a valid email address so we can send your confirmation.', 'error');
        } else {
          alert('Please enter a valid email address.');
        }
        return;
      }

      const receiptEl = document.getElementById('contact-submit-receipt');
      if (receiptEl) receiptEl.style.display = 'none';

      this.openPreviewModal({ name, email, category, type, organization, message });
    });

    // Clear Form button
    document.getElementById('btn-clear-enquiry')?.addEventListener('click', () => {
      form?.reset();
    });

    // FAQ Accordion Toggle
    document.querySelectorAll('.contact-faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.contact-faq-item');
        const isActive = item.classList.contains('active');

        // Close other items
        document.querySelectorAll('.contact-faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.contact-faq-trigger')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
};

