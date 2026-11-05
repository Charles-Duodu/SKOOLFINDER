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
                <div style="font-size: 0.85rem; font-weight: 800; color: #10B981; text-transform: uppercase; margin-bottom: 0.5rem;">Pro Educator</div>
                <div style="font-size: 2rem; font-weight: 900; color: #0A2046; margin-bottom: 0.5rem;">GH₵ 35 <span style="font-size: 0.9rem; font-weight: 600; color: #64748b;">/ month</span></div>
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

    // Free Registration
    const handleRegister = (e) => {
      e.preventDefault();
      if (typeof Auth !== 'undefined' && Auth.currentUser) {
        if (typeof App !== 'undefined' && App.navigate) {
          App.navigate('teacher-dashboard');
        } else {
          window.location.hash = '#/teacher-dashboard';
        }
      } else if (typeof Modals !== 'undefined' && Modals.showRegisterModal) {
        Modals.showRegisterModal('teacher');
      } else {
        window.location.hash = '#/register';
      }
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
