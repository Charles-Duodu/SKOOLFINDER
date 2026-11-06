/**
 * SkoolFinder Ghana — Dedicated Public Persona Landing: For Suppliers & Vendors
 * ==============================================================================
 * Route: #/for-suppliers or /for-suppliers
 * Blueprint & Master Guide v1.0 Section 4, 5, 6 (H14), 7, 9, 13
 *
 * Explains:
 * 1. Direct Institutional RFQs & School Procurement Tenders
 * 2. Sealed Competitor Quote Protection & Fraud Prevention
 * 3. Official Ghanaian Local Purchase Orders (LPO-GH-2026-XXXX)
 * 4. Milestone MoMo & Bank Escrow Releases (30% mobilization / 70% delivery)
 * 5. Approved Vendor Categories (Uniforms, Textbooks, Science Kits, IT, Canteen)
 * 6. Verified Supplier FAQs & Transparent Commercial Plans
 * ==============================================================================
 */

const ForSuppliersView = {
  async render() {
    return `
      <div class="for-suppliers-page" style="background: var(--bg-main); min-height: 100vh;">
        
        <!-- Hero Section -->
        <section style="background: linear-gradient(135deg, #0A2046 0%, #1e293b 50%, #B45309 100%); color: #ffffff; padding: 5rem 0 4.5rem; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -100px; right: -100px; width: 450px; height: 450px; border-radius: 50%; background: radial-gradient(circle, rgba(213, 166, 59, 0.2) 0%, transparent 70%); pointer-events: none;"></div>
          
          <div class="container" style="position: relative; z-index: 2;">
            <div style="max-width: 840px; margin: 0 auto; text-align: center;">
              
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(213, 166, 59, 0.4); padding: 0.4rem 1.1rem; border-radius: 9999px; margin-bottom: 1.5rem; backdrop-filter: blur(8px);">
                <span style="font-size: 1rem;">🇬🇭</span>
                <span style="font-size: 0.8rem; font-weight: 800; color: #fde68a; text-transform: uppercase; letter-spacing: 0.06em;">
                  National Pre-Tertiary Institutional Procurement Portal
                </span>
              </div>

              <h1 style="font-family: var(--font-heading); font-size: 2.75rem; font-weight: 900; line-height: 1.2; margin: 0 0 1.25rem 0; color: #ffffff;">
                Supply Accredited Schools Across Ghana with Verified B2B Procurement
              </h1>

              <p style="font-size: 1.15rem; line-height: 1.6; color: #cbd5e1; margin: 0 auto 2.25rem; max-width: 720px;">
                Connect directly with Bursars and Procurement Committees at top private and international campuses. Respond to verified school RFQs, showcase your product catalogue, and agree on direct commercial payment terms with zero middleman deductions.
              </p>

              <!-- Primary CTAs -->
              <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                <button type="button" id="btn-hero-supplier-register" class="btn-pill" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; background: #D5A63B; color: #0A2046; border: none; box-shadow: 0 4px 16px rgba(213, 166, 59, 0.4); display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <span>📦</span> Join Vetted Supplier Registry
                </button>
                <button type="button" id="btn-hero-browse-tenders" class="btn-pill" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.15); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <span>📋</span> Browse School RFQs
                </button>
                <button type="button" id="btn-hero-view-supplier-plans" class="btn-pill btn-outline" style="font-size: 0.95rem; font-weight: 700; padding: 0.85rem 1.5rem; color: #ffffff; border-color: rgba(255,255,255,0.4); cursor: pointer;">
                  <span>⭐</span> Supplier Plans from GH₵ 79/mo
                </button>
              </div>

              <!-- Trust Pillars Strip -->
              <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; font-size: 0.85rem; color: #cbd5e1;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #fde68a;">✓</span> Direct School-to-Supplier Settlement
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #fde68a;">✓</span> Sealed Competitor Quote Protection
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: #fde68a;">✓</span> Verified Institutional Buyers Only
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Quick Procurement Metrics -->
        <section style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 1.75rem 0; box-shadow: var(--shadow-sm);">
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; text-align: center;">
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #0A2046;">GH₵ 4.2M+</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Procurement RFQs Tendered</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #D5A63B;">620+</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Verified Vendors & Artisans</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #1266C4;">30% / 70%</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Escrow Mobilization Milestone</div>
              </div>
              <div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #10B981;">0%</div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">Payment Default Rate</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4 Core Value Pillars (Why Suppliers Partner with SkoolFinder) -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #D5A63B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Built For Ghanaian Suppliers & Contractors
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                Institutional Procurement Without Middlemen or Delayed Payments
              </h2>
              <p style="font-size: 1.05rem; color: #64748b; line-height: 1.6;">
                We solve the two biggest headaches facing Ghanaian educational suppliers: corrupt procurement gatekeeping and months of unpaid invoices.
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem;">
              
              <!-- Pillar 1: Direct Institutional RFQs -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(213, 166, 59, 0.1); color: #D5A63B; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  📜
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Direct School RFQs & Tenders
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Gain unfiltered access to tenders published directly by verified school proprietors, headmasters, and bursars across Greater Accra, Ashanti, Western, and Central regions.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  📢 Direct institutional demands published weekly.
                </div>
              </div>

              <!-- Pillar 2: Sealed Quote Confidentiality -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(18, 102, 196, 0.1); color: #1266C4; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  🔒
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Sealed Bid Quote Protection
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Never worry about competitors peeking at your price quote. All tender submissions are cryptographically sealed until the official deadline, ensuring fair, merit-based selection.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  🛡️ Eliminates illicit price-leaking and favoritism.
                </div>
              </div>

              <!-- Pillar 3: Official Ghanaian LPOs -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(16, 185, 129, 0.1); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  📄
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Official Ghanaian LPO Generation
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  Awarded tenders instantly generate an official Local Purchase Order (<code style="background: #e2e8f0; padding: 0.1rem 0.3rem; border-radius: 4px;">LPO-GH-2026-XXXX</code>) bearing the school's NaSIA registration number and digital bursar authorization stamp.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  🏛️ Legally binding purchase order protection.
                </div>
              </div>

              <!-- Pillar 4: Milestone MoMo Escrow -->
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
                <div style="width: 52px; height: 52px; border-radius: 10px; background: rgba(220, 38, 38, 0.1); color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.25rem;">
                  💰
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #0A2046; margin-bottom: 0.75rem;">
                  Milestone MoMo & Bank Escrow
                </h3>
                <p style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin-bottom: 1.25rem; flex: 1;">
                  The school deposits funds into safe escrow before you produce or ship goods. Receive a 30% mobilization advance, followed by 70% automatic release upon verified delivery inspection.
                </p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; font-size: 0.8rem; color: #475569; font-weight: 600;">
                  🔒 100% protection against uncollected supplier debt.
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Approved Supply Categories -->
        <section style="padding: 4.5rem 0; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3rem;">
              <h2 style="font-size: 2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Approved Institutional Supply Categories
              </h2>
              <p style="color: #64748b; font-size: 0.95rem;">
                SkoolFinder connects verified businesses across Ghana in six high-volume procurement sectors:
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1020px; margin: 0 auto;">
              
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">👕</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Uniforms & Sportswear</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">School crest embroidery, PE kits, house t-shirts, blazers, and fabric bulk sourcing.</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">📚</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Textbooks & Learning Aids</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">NaCCA-approved syllabi, Cambridge University Press, Oxford, and specialized workbooks.</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">🧪</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Science Labs & STEM Gear</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">Microscopes, glassware, chemistry reagents, Arduino kits, and robotics components.</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">💻</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">IT Hardware & Connectivity</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">Computer lab desktops, smart interactive projectors, campus Wi-Fi APs, and CCTV systems.</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">🍲</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Canteen Commodities & Food</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">Bulk local rice, cooking oil, grains, poultry supplies, and commercial kitchen appliances.</div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem;">
                <span style="font-size: 1.75rem;">🪑</span>
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem;">Campus Furniture & Facilities</h4>
                  <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">Ergonomic student desks, metal lockers, whiteboard systems, playground swings, and generators.</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 3-Step Supplier Onboarding Process -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container">
            <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #D5A63B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">
                Fast & Professional Onboarding
              </div>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.75rem;">
                How to Become an Accredited Vendor in 3 Steps
              </h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; max-width: 960px; margin: 0 auto;">
              
              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #D5A63B; color: #0A2046; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(213, 166, 59, 0.3);">
                  1
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Register Business Credentials
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Submit your Registrar General business registration, GRA Tax Identification Number (TIN), and bank / MoMo payout details.
                </p>
              </div>

              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #1266C4; color: #ffffff; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(18, 102, 196, 0.3);">
                  2
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Get Category Certified
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Our operations team reviews your catalog or workshop credentials within 24 hours to issue your Verified Vendor Badge.
                </p>
              </div>

              <div style="text-align: center; padding: 1.5rem;">
                <div style="width: 50px; height: 50px; border-radius: 50%; background: #10B981; color: #ffffff; font-weight: 900; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                  3
                </div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
                  Bid & Execute with Escrow
                </h3>
                <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6;">
                  Submit sealed bids on school tenders. When awarded, receive an official LPO and produce with guaranteed escrow funds.
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
                Supplier Membership Plans
              </h2>
              <p style="font-size: 1rem; color: #64748b; max-width: 650px; margin: 0 auto 1.5rem;">
                Official commercial tiers for educational suppliers and qualified service providers. Annual plans include <strong>2 months free</strong> (pay 10 months for 12 months of service).
              </p>
              
              <!-- Billing Interval Indicator -->
              <div style="display: inline-flex; align-items: center; gap: 0.75rem; background: #f1f5f9; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 2rem;">
                <span>📅 Annual Discount:</span>
                <span style="color: #059669; font-weight: 800;">12 Months for the Price of 10</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; max-width: 1140px; margin: 0 auto;">
              
              <!-- Free Plan (GH₵ 0) -->
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.75rem; display: flex; flex-direction: column;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.4rem;">Free Tier</div>
                <div style="font-size: 1.75rem; font-weight: 900; color: #0A2046; margin-bottom: 0.25rem;">GH₵ 0 <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">/ mo</span></div>
                <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 1.25rem;">GH₵ 0 / year (Basic Listing)</div>
                <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">For emerging suppliers and local workshops exploring school procurement.</p>
                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.82rem; color: #334155; display: flex; flex-direction: column; gap: 0.6rem;">
                  <li>✓ <strong>5 Active Product Listings</strong></li>
                  <li>✓ <strong>1 Team Seat</strong> (Owner)</li>
                  <li>✓ Receive direct school enquiries</li>
                  <li>✓ Standard Directory Profile</li>
                </ul>
                <button type="button" class="btn-pill btn-outline btn-register-free-supplier" style="margin-top: auto; width: 100%; font-weight: 700; padding: 0.65rem; font-size: 0.85rem;">
                  Register Free
                </button>
              </div>

              <!-- Growth Plan (GH₵ 79) -->
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.75rem; display: flex; flex-direction: column;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase; margin-bottom: 0.4rem;">Growth Tier</div>
                <div style="font-size: 1.75rem; font-weight: 900; color: #0A2046; margin-bottom: 0.25rem;">GH₵ 79 <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">/ mo</span></div>
                <div style="font-size: 0.78rem; color: #059669; font-weight: 700; margin-bottom: 1.25rem;">GH₵ 790 / year (Save GH₵ 158)</div>
                <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">For active vendors expanding their school catalogue and enquiry pipeline.</p>
                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.82rem; color: #334155; display: flex; flex-direction: column; gap: 0.6rem;">
                  <li>✓ <strong>25 Active Product Listings</strong></li>
                  <li>✓ <strong>3 Team Seats</strong></li>
                  <li>✓ Up to 15 Open RFQ responses/mo</li>
                  <li>✓ Verified Vendor Badge</li>
                </ul>
                <button type="button" class="btn-pill btn-primary btn-plan-growth" style="margin-top: auto; width: 100%; font-weight: 700; padding: 0.65rem; font-size: 0.85rem;">
                  Select Growth (GH₵ 79/mo)
                </button>
              </div>

              <!-- Professional Plan (GH₵ 199) -->
              <div style="background: #ffffff; border: 2px solid #D5A63B; border-radius: 12px; padding: 1.75rem; display: flex; flex-direction: column; position: relative; box-shadow: 0 6px 20px rgba(213, 166, 59, 0.2);">
                <div style="position: absolute; top: -11px; right: 16px; background: #D5A63B; color: #0A2046; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 9999px; text-transform: uppercase;">
                  POPULAR
                </div>
                <div style="font-size: 0.8rem; font-weight: 800; color: #B45309; text-transform: uppercase; margin-bottom: 0.4rem;">Professional Tier</div>
                <div style="font-size: 1.75rem; font-weight: 900; color: #0A2046; margin-bottom: 0.25rem;">GH₵ 199 <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">/ mo</span></div>
                <div style="font-size: 0.78rem; color: #059669; font-weight: 700; margin-bottom: 1.25rem;">GH₵ 1,990 / year (Save GH₵ 398)</div>
                <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">For high-volume suppliers seeking higher quoting capacity and analytics.</p>
                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.82rem; color: #334155; display: flex; flex-direction: column; gap: 0.6rem;">
                  <li>✓ <strong>100 Active Product Listings</strong></li>
                  <li>✓ <strong>8 Team Seats</strong></li>
                  <li>✓ Up to 60 Open RFQ responses/mo</li>
                  <li>✓ Verified Analytics Dashboard</li>
                  <li>✓ Priority Procurement Review</li>
                </ul>
                <button type="button" class="btn-pill btn-plan-pro" style="margin-top: auto; width: 100%; font-weight: 800; padding: 0.65rem; font-size: 0.85rem; background: #D5A63B; color: #0A2046; border: none; cursor: pointer;">
                  Select Professional (GH₵ 199/mo)
                </button>
              </div>

              <!-- Enterprise Plan (GH₵ 399) -->
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.75rem; display: flex; flex-direction: column;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #7c3aed; text-transform: uppercase; margin-bottom: 0.4rem;">Enterprise Tier</div>
                <div style="font-size: 1.75rem; font-weight: 900; color: #0A2046; margin-bottom: 0.25rem;">GH₵ 399 <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">/ mo</span></div>
                <div style="font-size: 0.78rem; color: #059669; font-weight: 700; margin-bottom: 1.25rem;">GH₵ 3,990 / year (Save GH₵ 798)</div>
                <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">For major educational distributors, publishers, and nationwide fleets.</p>
                <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem 0; font-size: 0.82rem; color: #334155; display: flex; flex-direction: column; gap: 0.6rem;">
                  <li>✓ <strong>500 Active Product Listings</strong></li>
                  <li>✓ <strong>20 Team Seats</strong></li>
                  <li>✓ 200 Open RFQ responses/mo</li>
                  <li>✓ Custom API & ERP Integration</li>
                  <li>✓ Dedicated Account Manager</li>
                </ul>
                <button type="button" class="btn-pill btn-outline btn-plan-enterprise" style="margin-top: auto; width: 100%; font-weight: 700; padding: 0.65rem; font-size: 0.85rem;">
                  Select Enterprise (GH₵ 399/mo)
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- Supplier FAQs -->
        <section style="padding: 5rem 0; background: #ffffff;">
          <div class="container" style="max-width: 800px;">
            <div style="text-align: center; margin-bottom: 3rem;">
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #0A2046; font-family: var(--font-heading); margin-bottom: 0.5rem;">
                Frequently Asked Questions for Suppliers
              </h2>
              <p style="color: #64748b; font-size: 0.95rem;">
                Clear, transparent answers about tender bidding, escrow security, and Ghanaian LPOs.
              </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              
              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  How does the SkoolFinder Escrow system guarantee I get paid?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  Before a school issues an official LPO, the contract value is locked in our secure regulatory escrow account via Mobile Money or commercial bank transfer. A 30% mobilization deposit is released to you immediately to start procurement, and the remaining 70% is disbursed directly to your account within 24 hours of the bursar signing the physical delivery inspection slip.
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  What documentation is required to register as a supplier?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  You must provide your business registration certificate from the Registrar General's Department (RGD) or Registrar of Companies (ORC), a valid Ghana Revenue Authority (GRA) Tax Identification Number (TIN), and an active business MoMo or corporate bank account matching the company name.
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  Can small local workshops or uniform seamstresses bid?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  Yes! SkoolFinder specifically caters to local Ghanaian artisans, uniform seamstresses, carpenters, and caterers. School tenders are categorized by volume so that small neighborhood workshops can compete effectively for smaller campus orders.
                </p>
              </div>

              <div class="card" style="padding: 1.25rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 1rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem;">
                  How are sealed bids kept confidential?
                </h4>
                <p style="font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.6;">
                  When you submit a bid, the pricing numbers and item schedules are encrypted on our platform. The school procurement committee and competing vendors cannot inspect any submitted quote until the public tender closing date and time expires.
                </p>
              </div>

            </div>
          </div>
        </section>

        <!-- Bottom CTA Strip -->
        <section style="background: linear-gradient(135deg, #0A2046 0%, #102a5c 100%); color: #ffffff; padding: 4.5rem 0; text-align: center;">
          <div class="container" style="max-width: 720px;">
            <h2 style="font-size: 2.25rem; font-weight: 900; color: #ffffff; font-family: var(--font-heading); margin-bottom: 1rem;">
              Unlock Institutional Procurement Contracts Today
            </h2>
            <p style="font-size: 1.05rem; color: #cbd5e1; margin-bottom: 2rem; line-height: 1.6;">
              Partner with hundreds of accredited schools across Ghana with guaranteed on-time payment.
            </p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button type="button" class="btn-pill btn-register-free-supplier" style="font-size: 1rem; font-weight: 800; padding: 0.85rem 2rem; background: #D5A63B; color: #0A2046; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(213, 166, 59, 0.4);">
                Join Vetted Supplier Registry &rarr;
              </button>
              <button type="button" class="btn-pill btn-browse-tenders" style="font-size: 1rem; font-weight: 700; padding: 0.85rem 1.75rem; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); cursor: pointer;">
                Browse Active Tenders
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
          App.navigate('supplier-dashboard');
        } else {
          window.location.hash = '#/supplier-dashboard';
        }
      } else if (typeof Modals !== 'undefined' && Modals.showRegisterModal) {
        Modals.showRegisterModal('supplier');
      } else {
        window.location.hash = '#/register';
      }
    };

    // Browse Tenders / RFQs
    const handleBrowseTenders = (e) => {
      e.preventDefault();
      if (typeof App !== 'undefined' && App.navigate) {
        App.navigate('tenders');
      } else {
        window.location.hash = '#/tenders';
      }
    };

    // View Plans / Upgrade
    const handleSelectPlan = (tierName, priceGhs) => (e) => {
      e.preventDefault();
      if (typeof Modals !== 'undefined' && Modals.showNotification) {
        Modals.showNotification(`${tierName} Supplier Plan (GH₵ ${priceGhs}/month) selected. Please register or sign in to complete onboarding.`, 'info');
      }
      handleRegister(e);
    };

    bindClick('btn-hero-supplier-register', handleRegister);
    bindClick('.btn-register-free-supplier', handleRegister);
    bindClick('btn-hero-browse-tenders', handleBrowseTenders);
    bindClick('.btn-browse-tenders', handleBrowseTenders);
    bindClick('btn-hero-view-supplier-plans', handleSelectPlan('Growth', 79));
    bindClick('.btn-plan-growth', handleSelectPlan('Growth', 79));
    bindClick('.btn-plan-pro', handleSelectPlan('Professional', 199));
    bindClick('.btn-plan-enterprise', handleSelectPlan('Enterprise', 399));
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForSuppliersView;
}

