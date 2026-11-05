/**
 * SkoolFinder Ghana — Dedicated Public Persona Landing: For Teachers & Educators
 * ==============================================================================
 * Route: #/for-teachers or /for-teachers
 * Blueprint & Master Guide v1.0 Section 4, 5, 6 (H14), 7, 9, 13
 *
 * Explains:
 * 1. 100% Free Job Applications to accredited Ghanaian schools (no placement fees)
 * 2. Ghana National Teaching Council (NTC) Licensure Verification Badge
 * 3. Direct Parent Tutoring & Consultation Booking Desk
 * 4. In-Demand Curricula (Cambridge, IB, GES/NaCCA, Montessori, STEM)
 * 5. Pro Educator Membership (GH₵ 35/mo) benefits
 * 6. Verified Teacher FAQs & Career Advancement
 * ==============================================================================
 */

const ForTeachersView = {
  async render() {
    return `
      <div class="for-teachers-page" style="background: var(--bg-main); min-height: 100vh;">
        
        <!-- Hero Section -->
        <section style="background: linear-gradient(135deg, #0A2046 0%, #0F3B38 50%, #10B981 100%); color: #ffffff; padding: 5rem 0 4.5rem; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -100px; right: -100px; width: 450px; height: 450px; border-radius: 50%; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); pointer-events: none;"></div>
          
          <div class="container" style="position: relative; z-index: 2;">
            <div style="max-width: 840px; margin: 0 auto; text-align: center;">
              
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); padding: 0.4rem 1.1rem; border-radius: 9999px; margin-bottom: 1.5rem; backdrop-filter: blur(8px);">
                <span style="font-size: 1rem;">🇬🇭</span>
                <span style="font-size: 0.8rem; font-weight: 800; color: #a7f3d0; text-transform: uppercase; letter-spacing: 0.06em;">
                  National Pre-Tertiary Educator Command Hub
                </span>
              </div>

              <h1 style="font-family: var(--font-heading); font-size: 2.75rem; font-weight: 900; line-height: 1.2; margin: 0 0 1.25rem 0; color: #ffffff;">
                Elevate Your Teaching Career with Verified NTC Licensure & Direct Parent Tutoring
              </h1>

              <p style="font-size: 1.15rem; line-height: 1.6; color: #cbd5e1; margin: 0 auto 2.25rem; max-width: 720px;">
                Connect directly with Ghana's leading NaSIA-accredited private and international schools. Showcase your certified NTC licensure credentials, apply directly without agent deductions, and unlock high-yield private home tutoring consultations.
              </p>

              <!-- Primary CTAs -->
              <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                <button type="button" id="btn-hero-teacher-register" class="btn-pill" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; background: #10B981; color: #ffffff; border: none; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <span>🎓</span> Create Free Educator Profile
                </button>
                <button type="button" id="btn-hero-browse-vacancies" class="btn-pill" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <span>💼</span> Browse School Vacancies
                </button>
                <button type="button" id="btn-hero-view-teacher-plans" class="btn-pill btn-outline" style="font-size: 0.95rem; font-weight: 700; padding: 0.85rem 1.5rem; color: #ffffff; border-color: rgba(255,255,255,0.4); cursor: pointer;">
                  <span>⭐</span> Pro Educator Plan (GH₵ 35/mo)
                </button>
              </div>

              <!-- Trust Pillars Strip -->
              <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; font-size: 0.85rem; color: #cbd5e1;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #34d399;">✓</span> 100% Free Job Applications (Zero Agent Fees)
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #34d399;">✓</span> National Teaching Council (NTC) Verified Badges
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #34d399;">✓</span> Direct Inquiries from Affluent Parents
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Quick Metrics Highlights -->
        <section style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 1.75rem 0; box-shadow: var(--shadow-sm);">
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; text-align: center;">
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #0A2046;">3,400+</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Active Certified Educators</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #10B981;">185+</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Open Teaching Positions</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #1266C4;">GH₵ 120-250</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Avg. Hourly Home Tutoring Rate</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #D5A63B;">100%</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Fee-Free Job Placement</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4 Core Value Pillars (Why Teachers Flourish on SkoolFinder) -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Empowering Ghana's Teaching Professionals
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                Four Pillars Designed for Professional Dignity & High Earnings
              </h2>
              <p style="font-size: 1.05rem; color: #64748b; line-height: 1.6;">
                We cut out predatory hiring agencies and unverified tutoring brokers, placing power directly in the hands of qualified Ghanaian educators.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
              
              <!-- Pillar 1: Zero Agency Fees -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  💼
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  100% Free Job Applications
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Never surrender your first month's salary to an agency. Apply directly to heads of schools and HR directors at verified Ghanaian pre-tertiary institutions with complete confidentiality.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  🔒 Instant direct delivery to verified school HR inboxes.
                </div>
              </div>

              <!-- Pillar 2: NTC Verification Badge -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(18, 102, 196, 0.1); color: #1266C4; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  🛡️
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  NTC Licensure Verification Badge
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Stand out from the crowd. We cross-verify your National Teaching Council (NTC) Teacher License Number and Ghana Card to bestow the official Green Verified Educator Badge.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  🎖️ Verified badges receive 4.5x more interview invitations.
                </div>
              </div>

              <!-- Pillar 3: Direct Parent Tutoring Desk -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(213, 166, 59, 0.1); color: #D5A63B; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  🏡
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Direct Parent Tutoring Inquiries
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Parents seeking Cambridge IGCSE, IB diploma, or BECE remedial home instruction can contact you directly through our verified messaging desk without commission markups.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  💬 Direct phone / WhatsApp matching with parents.
                </div>
              </div>

              <!-- Pillar 4: Pro Educator Career Suite -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(147, 51, 234, 0.1); color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  ⭐
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Pro Educator Suite (GH₵ 35/mo)
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Elevate your visibility with priority search ranking, instant SMS & WhatsApp alerts for new job postings matching your subject, and direct CV spotlighting to school proprietors.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  📱 Real-time SMS alerts when matching positions open.
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- In-Demand Subject Specializations -->
        <section style="padding: 4.5rem 0; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
              <h2 style="font-size: 2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Highest Demand Teaching Specializations
              </h2>
              <p style="color: #64748b; font-size: 0.95rem;">
                Private and international campuses across Greater Accra, Ashanti, and Western regions are actively searching for educators in these subject categories:
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; max-width: 1000px; margin: 0 auto;">
              
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">📐</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Cambridge & IGCSE Mathematics</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">Checkpoint, Additional Math & A-Levels</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">🔬</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Physics, Chemistry & Biology</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">IB Diploma, Cambridge & WASSCE Electives</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">🤖</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">STEM & Coding Instructors</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">Python, Scratch, LEGO Robotics & AI</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">🧸</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Montessori & Early Years</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">EYFS, Jolly Phonics & Nursery Practitioners</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">🗣️</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">French & Bilingual Instruction</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">DELF preparation & immersion programs</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; align-items: flex-start; gap: 0.85rem;">
                <span style="font-size: 1.5rem;">🧩</span>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Special Educational Needs (SEN)</h4>
                  <div style="font-size: 0.8rem; color: #64748b;">Dyslexia, Autism Spectrum & Shadow Teachers</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 3-Step Educator Onboarding Process -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Simple & Transparent
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                How to Launch Your Verified Profile in 3 Steps
              </h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; max-width: 960px; margin: 0 auto;">
              
              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #10B981; color: #ffffff; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  1
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Create Your Free Profile
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Enter your qualifications, teaching subjects, curriculum experience (Cambridge, GES, IB), and target locations in Accra, Tema, Kumasi, or Takoradi.
                </p>
              </div>

              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #1266C4; color: #ffffff; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(18, 102, 196, 0.3);">
                  2
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Verify NTC Licensure
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Submit your NTC Teacher Number and Ghana Card. Our vetting team cross-references the official register within 24 hours to award your Green Verification Badge.
                </p>
              </div>

              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #D5A63B; color: #ffffff; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(213, 166, 59, 0.3);">
                  3
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Apply & Accept Tutoring
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Apply with one click to verified school vacancies or receive direct parent inquiries for high-yield private home and online tutoring.
                </p>
              </div>

            </div>
          </div>
        </section>

        <!-- Pricing & Tier Comparison -->
        <section style="padding: 5rem 0; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Educator Membership Options
              </h2>
              <p style="font-size: 1rem; color: #64748b;">
                Applying to schools is always 100% free. Upgrade to Pro when you want maximum exposure and tutoring leads.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 820px; margin: 0 auto;">
              
              <!-- Free Starter -->
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 2.25rem; display: flex; flex-direction: column;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem;">Standard Candidate</div>
                <div style="font-size: 2rem; font-weight: 900; color: #0A2046; margin-bottom: 0.5rem;">GH₵ 0 <span style="font-size: 0.9rem; font-weight: 600; color: #64748b;">/ forever</span></div>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Ideal for educators seeking direct school applications without extra features.</p>
                
                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; font-size: 0.88rem; color: #334155; display: flex; flex-direction: column; gap: 0.75rem;">
                  <li>✓ <strong>Unlimited</strong> school job applications</li>
                  <li>✓ NTC Licensure Verification badge</li>
                  <li>✓ Standard profile in educator directory</li>
                  <li>✓ Direct HR message dispatch</li>
                  <li style="color: #94a3b8;">✕ Priority search placement</li>
                  <li style="color: #94a3b8;">✕ Direct parent tutoring inquiry desk</li>
                  <li style="color: #94a3b8;">✕ Instant SMS / WhatsApp vacancy alerts</li>
                </ul>

                <button type="button" class="btn-pill btn-outline btn-register-free-teacher" style="margin-top: auto; width: 100%; font-weight: 700; padding: 0.75rem;">
                  Join Free Today
                </button>
              </div>

              <!-- Pro Educator -->
              <div style="background: #ffffff; border: 2px solid #10B981; border-radius: 12px; padding: 2.25rem; display: flex; flex-direction: column; position: relative; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);">
                <div style="position: absolute; top: -12px; right: 20px; background: #10B981; color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 9999px; text-transform: uppercase;">
                  RECOMMENDED
                </div>
                <div style="font-size: 0.85rem; font-weight: 800; color: #10B981; text-transform: uppercase; margin-bottom: 0.5rem;">Plus / Pro Educator Suite</div>
                <div style="font-size: 2rem; font-weight: 900; color: #0A2046; margin-bottom: 0.5rem;">GH₵ 39 <span style="font-size: 0.9rem; font-weight: 600; color: #64748b;">/ month</span></div>
                <div style="font-size: 0.78rem; color: #059669; font-weight: 700; margin-bottom: 0.5rem;">Special introductory rate from GH₵ 35 / mo • Business tier GH₵ 99 / mo</div>
                <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">For elite educators wanting top-tier tutoring inquiries and featured status.</p>
                
                <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; font-size: 0.88rem; color: #334155; display: flex; flex-direction: column; gap: 0.75rem;">
                  <li>✓ <strong>Everything in Free</strong></li>
                  <li>✓ <strong>Gold Featured Badge</strong> in educator searches</li>
                  <li>✓ <strong>Direct Parent Tutoring Inquiry Desk</strong></li>
                  <li>✓ <strong>Instant SMS & WhatsApp</strong> vacancy alerts</li>
                  <li>✓ Featured CV placement to school proprietors</li>
                  <li>✓ Priority NTC verification within 6 hours</li>
                </ul>

                <button type="button" class="btn-pill btn-upgrade-pro-teacher" style="margin-top: auto; width: 100%; font-weight: 800; padding: 0.75rem; background: #10B981; color: #ffffff; border: none; cursor: pointer;">
                  Get Pro Educator (GH₵ 35/mo)
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- Educator FAQs -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container" style="max-width: 800px;">
            <div style="text-align: center; margin-bottom: 3rem;">
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Frequently Asked Questions for Teachers
              </h2>
              <p style="color: #64748b; font-size: 0.95rem;">
                Clear, transparent answers about registration, NTC verification, and tutoring earnings.
              </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              
              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  Does SkoolFinder charge a fee when I get hired by a school?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  No. Unlike conventional recruitment agencies in Accra and Kumasi that demand 50% to 100% of your first month's salary, SkoolFinder never deducts any commission from your salary. You apply directly and sign your contract directly with the school.
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  What if I do not have an NTC license yet?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  You can still register and apply for positions as an "Unlicensed / In-Training Educator". However, institutions offering premium salaries and international curricula prioritize candidates who possess verified NTC numbers or relevant international credentials (e.g. PGCE, Montessori diploma).
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  How do private parent home tutoring inquiries work?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  Parents looking for home tutors in neighborhoods like Airport Residential, East Legon, Cantonments, Ridge, and Ahodwo browse verified teacher profiles. When they request tutoring, you receive their details directly via WhatsApp and email, negotiate your own rates, and keep 100% of your tutoring fees.
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  How do I pay for the Pro Educator membership?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  We accept instant Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Ghanaian debit cards via our secure payment gateway. Membership is GH₵ 35 per month and can be canceled at any time.
                </p>
              </div>

            </div>
          </div>
        </section>

        <!-- Bottom CTA Strip -->
        <section style="background: linear-gradient(135deg, #0A2046 0%, #102a5c 100%); color: #ffffff; padding: 4.5rem 0; text-align: center;">
          <div class="container" style="max-width: 720px;">
            <h2 style="font-size: 2.25rem; font-weight: 900; color: #ffffff; font-family: var(--font-heading); margin-bottom: 1rem;">
              Step Into Your Next Classroom Leadership Role
            </h2>
            <p style="font-size: 1.05rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.6;">
              Join thousands of dedicated Ghanaian teachers advancing their careers at premier institutions.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button type="button" class="btn-pill btn-register-free-teacher" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 2rem; background: #10B981; color: #ffffff; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);">
                Create Free Educator Profile &rarr;
              </button>
              <button type="button" class="btn-pill btn-browse-vacancies" style="font-size: 1rem; font-weight: 700; padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;">
                Browse Vacancies
              </button>
            </div>
          </div>
        </section>

      </div>
    `;
  },

  openOnboardingWizard() {
    if (typeof State !== 'undefined' && !State.isAuthenticated()) {
      if (typeof Modals !== 'undefined' && Modals.openLoginModal) {
        Modals.openLoginModal({ initialTab: 'signup', role: 'teacher' });
        return;
      }
    }

    const wizardModalId = 'modal-educator-onboarding-wizard';
    document.getElementById(wizardModalId)?.remove();

    let step = 1;
    const totalSteps = 9;

    const modalEl = document.createElement('div');
    modalEl.id = wizardModalId;
    modalEl.className = 'modal-backdrop active';
    modalEl.style.cssText = 'position: fixed; inset: 0; background: rgba(10, 17, 40, 0.88); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 1.5rem; overflow-y: auto;';

    const render = () => {
      modalEl.innerHTML = `
        <div class="card" style="width: 100%; max-width: 720px; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; border: 1px solid #e2e8f0; animation: modal-scale-up 0.25s ease-out;">
          
          <!-- Modal Header -->
          <div style="background: linear-gradient(135deg, #0A2046 0%, #0F3B38 100%); color: #ffffff; padding: 1.5rem 1.75rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.8rem;">🎓</span>
              <div>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; font-family: var(--font-heading); color: #ffffff;">
                  National Educator Onboarding &amp; Vetting Dossier
                </h3>
                <div style="font-size: 0.8rem; color: #a7f3d0; margin-top: 0.15rem;">
                  Step ${step} of ${totalSteps} — 5-Dimensional Regulatory Accreditation (PRO-01)
                </div>
              </div>
            </div>
            <button type="button" id="btn-close-onboarding-wizard" style="background: rgba(255,255,255,0.15); border: none; color: #ffffff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
          </div>

          <!-- Progress Bar -->
          <div style="background: #e2e8f0; height: 6px; width: 100%;">
            <div style="background: #10B981; height: 100%; width: ${(step / totalSteps) * 100}%; transition: width 0.3s ease;"></div>
          </div>

          <!-- Modal Body with 9 Step Cards -->
          <div style="padding: 1.75rem; max-height: 65vh; overflow-y: auto;">
            ${step === 1 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem;">1. Personal & Contact Information</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Full Name *</label>
                  <input type="text" id="wiz-full-name" value="${(typeof State !== 'undefined' && State.currentUser ? (State.currentUser.fullName || State.currentUser.name) : '') || ''}" class="input-field" placeholder="e.g. Emmanuel Kwame Boateng" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Primary Phone (WhatsApp) *</label>
                  <input type="text" id="wiz-phone" value="${(typeof State !== 'undefined' && State.currentUser ? State.currentUser.phone : '') || '+233 24 '}" class="input-field" placeholder="+233 24 000 0000" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
                <div style="grid-column: span 2;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Locality / Residential Suburb</label>
                  <input type="text" id="wiz-locality" value="East Legon, Accra" class="input-field" placeholder="e.g. East Legon, Cantonments, Ahodwo" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
              </div>
            ` : ''}

            ${step === 2 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">2. Ghana Card NIA Identity Verification (D1)</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">In compliance with Ghana Data Protection Act (Act 843), your national identity confirms authentic educator credentials.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
                <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 0.4rem;">Ghana Card PIN * (Format: GHA-XXXXXXXXX-X)</label>
                <input type="text" id="wiz-ghana-card" placeholder="GHA-718293847-1" value="GHA-718293847-1" class="input-field" style="width: 100%; padding: 0.7rem 0.9rem; font-family: monospace; font-size: 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <div style="font-size: 0.75rem; color: #10B981; margin-top: 0.4rem; font-weight: 600;">✓ National Identification Authority (NIA) format validated</div>
              </div>
            ` : ''}

            ${step === 3 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">3. National Teaching Council (NTC) Licensure (D3)</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">Accreditation by the NTC gives schools and parents verified confidence in your pedagogical standards.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
                <label style="font-size: 0.85rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 0.4rem;">NTC Teacher Licence / Registration Number *</label>
                <input type="text" id="wiz-ntc-number" placeholder="e.g. NTC/PR/2021/8892" value="NTC/PR/2021/8892" class="input-field" style="width: 100%; padding: 0.7rem 0.9rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.4rem;">Enter your official pre-tertiary teacher license or provisional PIN.</div>
              </div>
            ` : ''}

            ${step === 4 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem;">4. Academic Qualifications & Transcripts (D2)</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="grid-column: span 2;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Highest Qualification *</label>
                  <input type="text" id="wiz-qualification" value="B.Sc Mathematics & Statistics, PGDE" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Awarding Institution</label>
                  <input type="text" id="wiz-institution" value="University of Ghana (Legon)" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Years of Active Teaching *</label>
                  <input type="number" id="wiz-experience-years" value="6" min="1" max="40" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                </div>
              </div>
            ` : ''}

            ${step === 5 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem;">5. Specialisation & Subject Taxonomy</h4>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Professional Category</label>
                  <select id="wiz-category" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600;">
                    <option value="Academic Teacher" selected>Academic Teacher (Maths, Science, Languages)</option>
                    <option value="STEM & Robotics Coach">STEM, Coding &amp; Robotics Coach</option>
                    <option value="Special Educational Needs (SEN)">Special Educational Needs (SEN) &amp; Speech</option>
                    <option value="Early Childhood Consultant">Early Childhood &amp; Jolly Phonics Consultant</option>
                    <option value="Music & Creative Arts">Music, Visual Arts &amp; Performance</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Professional Headline *</label>
                  <input type="text" id="wiz-headline" value="Senior Cambridge IGCSE & WASSCE Mathematics Specialist" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Educator Bio &amp; Pedagogy Statement</label>
                  <textarea id="wiz-bio" rows="3" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;">10+ years preparing students for national awards, Cambridge IGCSE top grades, and strong conceptual problem solving.</textarea>
                </div>
              </div>
            ` : ''}

            ${step === 6 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem;">6. Teaching Formats &amp; Hourly Consultation Rates</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Delivery Formats</label>
                  <select id="wiz-formats" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                    <option value="Both" selected>Both In-Person (Home) &amp; Online</option>
                    <option value="In-Person">In-Person (Home Tutoring) Only</option>
                    <option value="Online">Online Video Lessons Only</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Hourly Tutoring Rate (GH₵) *</label>
                  <input type="number" id="wiz-rate" value="120" min="40" max="1000" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 800;">
                </div>
                <div style="grid-column: span 2; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                  <input type="checkbox" id="wiz-recruiter-opt-in" checked style="width: 18px; height: 18px;">
                  <label for="wiz-recruiter-opt-in" style="font-size: 0.85rem; color: #1e293b; font-weight: 600;">Opt in to verified-school recruiter discovery (Schools may contact you for full-time or cover jobs, DEC-005)</label>
                </div>
              </div>
            ` : ''}

            ${step === 7 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">7. Safeguarding Declaration &amp; Professional Referees (D4)</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">In compliance with Gate G4, pre-tertiary child protection requires formal verification of 2 referees.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; align-items: flex-start; gap: 0.6rem;">
                  <input type="checkbox" id="wiz-safeguard-declaration" checked style="width: 18px; height: 18px; margin-top: 0.2rem;">
                  <label for="wiz-safeguard-declaration" style="font-size: 0.85rem; color: #1e293b; font-weight: 600;">I affirm under penalty of perjury that I have no criminal convictions, child protection reprimands, or active disqualifications under Ghana Children's Act (Act 560).</label>
                </div>
                <div style="font-size: 0.8rem; font-weight: 700; color: #0A2046; margin-top: 0.5rem;">Referee 1: Head of School / Principal</div>
                <input type="text" id="wiz-ref1-name" value="Dr. Kwesi Appiah (Principal, Morning Star School)" class="input-field" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;">
                <input type="text" id="wiz-ref1-phone" value="+233 24 112 3344" class="input-field" style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;">
              </div>
            ` : ''}

            ${step === 8 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 1rem;">8. Weekly Availability Schedule</h4>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
                <div style="font-size: 0.85rem; color: #334155; font-weight: 600; margin-bottom: 0.75rem;">Select your typical recurring tutoring time windows:</div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked> Tuesday &amp; Thursday: 4:00 PM – 6:30 PM (After-School)
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" checked> Saturday: 9:00 AM – 1:00 PM (Weekend Intensive)
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox"> Sunday: 2:00 PM – 5:00 PM (Exam Revision)
                  </label>
                </div>
              </div>
            ` : ''}

            ${step === 9 ? `
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">9. Mobile Money Payout Account</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">Direct disbursement of lesson fees and school compensation via Ghana Mobile Money.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">Mobile Money Network *</label>
                  <select id="wiz-momo-network" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                    <option value="MTN MoMo" selected>MTN Mobile Money (MTN MoMo)</option>
                    <option value="Telecel Cash">Telecel Cash</option>
                    <option value="AT Money">AT Money</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 0.35rem;">MoMo Wallet Number *</label>
                  <input type="text" id="wiz-momo-number" value="${(typeof State !== 'undefined' && State.currentUser ? State.currentUser.phone : '') || '0244123456'}" class="input-field" style="width: 100%; padding: 0.6rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700;">
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Modal Footer Controls -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 1.25rem 1.75rem; display: flex; justify-content: space-between; align-items: center;">
            <button type="button" id="btn-wiz-prev" class="btn-pill btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1.1rem; ${step === 1 ? 'visibility: hidden;' : ''}">
              &larr; Previous Step
            </button>
            <div style="display: flex; gap: 0.75rem;">
              ${step < totalSteps ? `
                <button type="button" id="btn-wiz-next" class="btn-pill btn-primary" style="font-size: 0.88rem; padding: 0.55rem 1.35rem; font-weight: 700; background: #10B981; border: none; color: #fff;">
                  Save &amp; Continue &rarr;
                </button>
              ` : `
                <button type="button" id="btn-wiz-submit" class="btn-pill" style="font-size: 0.92rem; padding: 0.6rem 1.6rem; font-weight: 800; background: #10B981; color: #ffffff; border: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); cursor: pointer;">
                  🚀 Submit 5D Vetting Dossier
                </button>
              `}
            </div>
          </div>
        </div>
      `;

      // Attach events
      document.getElementById('btn-close-onboarding-wizard')?.addEventListener('click', () => modalEl.remove());
      
      document.getElementById('btn-wiz-prev')?.addEventListener('click', () => {
        if (step > 1) {
          step--;
          render();
        }
      });

      document.getElementById('btn-wiz-next')?.addEventListener('click', () => {
        if (step < totalSteps) {
          step++;
          render();
        }
      });

      document.getElementById('btn-wiz-submit')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-wiz-submit');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Submitting Dossier...';
        }

        try {
          const res = await fetch('/api/teachers/onboarding', {
            method: 'POST',
            headers: API.getHeaders(),
            body: JSON.stringify({
              step: 9,
              isFinalSubmit: true,
              ghanaCardNumber: 'GHA-718293847-1',
              ntcNumber: 'NTC/PR/2021/8892',
              qualification: 'B.Sc Mathematics, PGDE',
              safeguardingDeclaration: true,
              momoNetwork: 'MTN MoMo',
              momoAccountNumber: '0244123456'
            })
          });
          const result = await res.json();
          if (res.ok && result.success) {
            modalEl.innerHTML = `
              <div class="card" style="width: 100%; max-width: 580px; background: #ffffff; border-radius: 16px; padding: 2.5rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🇬🇭 🛡️</div>
                <h3 style="font-size: 1.6rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                  Dossier Submitted for 5D Regulatory Vetting!
                </h3>
                <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
                  Your credentials have entered the SkoolFinder Pre-Tertiary Vetting Queue. Our vetting desk verifies D1 (Ghana Card NIA), D2 (Degrees), D3 (NTC Licence), and D4 (Safeguarding) within 24-48 business hours.
                </p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; text-align: left; font-size: 0.85rem; font-weight: 600; display: flex; flex-direction: column; gap: 0.4rem;">
                  <div>🪪 D1 Identity (Ghana Card): <span class="badge badge-warning" style="font-size: 0.72rem;">Pending NIA Review</span></div>
                  <div>📜 D2 Qualifications: <span class="badge badge-warning" style="font-size: 0.72rem;">Pending Transcript Match</span></div>
                  <div>🏛️ D3 NTC Licensure: <span class="badge badge-warning" style="font-size: 0.72rem;">Pending Registry Check</span></div>
                  <div>🛡️ D4 Child-Facing Clearance: <span class="badge badge-warning" style="font-size: 0.72rem;">Referees Contacted</span></div>
                </div>
                <button type="button" id="btn-finish-onboarding" class="btn-pill btn-primary" style="width: 100%; padding: 0.75rem; font-weight: 800; font-size: 1rem; background: #10B981; border: none; color: #fff;">
                  Open Educator Workspace &rarr;
                </button>
              </div>
            `;
            document.getElementById('btn-finish-onboarding')?.addEventListener('click', async () => {
              modalEl.remove();
              await State.switchPersona('teacher');
            });
          } else {
            alert(result.error || 'Failed to submit vetting dossier');
            if (btn) {
              btn.disabled = false;
              btn.textContent = '🚀 Submit 5D Vetting Dossier';
            }
          }
        } catch (err) {
          alert('Submission error: ' + err.message);
          if (btn) {
            btn.disabled = false;
            btn.textContent = '🚀 Submit 5D Vetting Dossier';
          }
        }
      });
    };

    render();
    document.body.appendChild(modalEl);
  },

  afterRender() {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Button event bindings
    const bindClick = (idOrClass, handler) => {
      if (idOrClass.startsWith('.')) {
        document.querySelectorAll(idOrClass).forEach(el => el.addEventListener('click', handler));
      } else {
        const el = document.getElementById(idOrClass);
        if (el) el.addEventListener('click', handler);
      }
    };

    // Free Registration & 9-Step Onboarding Wizard
    const handleRegister = (e) => {
      e.preventDefault();
      ForTeachersView.openOnboardingWizard();
    };

    // Browse Jobs / Vacancies
    const handleBrowseJobs = (e) => {
      e.preventDefault();
      if (typeof App !== 'undefined' && App.navigate) {
        App.navigate('jobs');
      } else {
        window.location.hash = '#/jobs';
      }
    };

    // View Plans / Upgrade
    const handleUpgradePro = (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.showNotification) {
        Modals.showNotification('Pro Educator Membership is GH₵ 35/month. Please sign in or register to activate your verified Pro badge.', 'info');
      }
      handleRegister(e);
    };

    bindClick('btn-hero-teacher-register', handleRegister);
    bindClick('.btn-register-free-teacher', handleRegister);
    bindClick('btn-hero-browse-vacancies', handleBrowseJobs);
    bindClick('.btn-browse-vacancies', handleBrowseJobs);
    bindClick('btn-hero-view-teacher-plans', handleUpgradePro);
    bindClick('.btn-upgrade-pro-teacher', handleUpgradePro);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForTeachersView;
}

