/**
 * SkoolFinder Ghana - Educational Suppliers & RFQ B2B Hub
 * Baseline: Master Blueprint v2.0 (SUP-01-01, SUP-01-02, SUP-02-04, SUP-03-01, SUP-03-05, SUP-03-08, SUP-05-01, SUP-06-03)
 */
const SuppliersView = {
  activeTab: 'directory', // 'directory' | 'rfqs' | 'shortlist'
  activeCategory: 'All',
  selectedForCompare: new Set(),
  shortlistedIds: new Set(),
  cachedSuppliers: [],
  cachedCategories: null,

  getGuestSessionId() {
    let sid = localStorage.getItem('skoolfinder_guest_shortlist_session');
    if (!sid) {
      sid = 'gst-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('skoolfinder_guest_shortlist_session', sid);
    }
    return sid;
  },

  getVerificationBadge(s) {
    const level = s.verification_level || s.verificationLevel || 'V0';
    const badges = {
      'V4': { label: '🛡️ V4: Certified Public Contractor', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
      'V3': { label: '🛡️ V3: Institutional Vetted', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
      'V2': { label: '🛡️ V2: Verified Business (RGD/Tax)', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
      'V1': { label: '🛡️ V1: Verified Identity (Ghana Card)', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
      'V0': { label: '⏳ V0: Pending Verification', bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
    };
    const b = badges[level] || badges['V0'];
    return `<span class="badge" style="background: ${b.bg}; color: ${b.color}; border: 1px solid ${b.border}; font-weight: 700; font-size: 0.76rem; padding: 0.25rem 0.6rem; border-radius: 6px;" title="Verification Level ${level}">${b.label}</span>`;
  },

  async render() {
    let suppliers = [];
    let rfqs = [];
    let categories = this.cachedCategories;

    try {
      const supRes = await API.getSuppliers(this.activeCategory);
      suppliers = Array.isArray(supRes) ? supRes : [];
      this.cachedSuppliers = suppliers;
    } catch (e) {
      suppliers = [];
    }

    try {
      const rfqRes = await API.getRFQs();
      rfqs = Array.isArray(rfqRes) ? rfqRes : [];
    } catch (e) {
      rfqs = [];
    }

    // Hydrate Shortlist
    try {
      const sid = this.getGuestSessionId();
      const slRes = await API.getSupplierShortlist(sid);
      if (slRes && Array.isArray(slRes.suppliers)) {
        this.shortlistedIds = new Set(slRes.suppliers.map(s => s.id));
      }
    } catch (e) {}

    if (!categories) {
      try {
        const catRes = await API.getSupplierCategories();
        if (Array.isArray(catRes) && catRes.length > 0) {
          categories = catRes;
          this.cachedCategories = catRes;
        }
      } catch (e) {
        categories = null;
      }
    }

    const defaultCategories = [
      { name: 'Books, Curricula & Stationery', icon: '📚' },
      { name: 'Science, STEM & Lab Equipment', icon: '🔬' },
      { name: 'Classroom & Office Furniture', icon: '🪑' },
      { name: 'IT, Computers & EdTech Hardware', icon: '💻' },
      { name: 'School Uniforms & Sportswear', icon: '👕' },
      { name: 'Food, Groceries & Canteen Supplies', icon: '🍲' },
      { name: 'Student Transport & Logistics', icon: '🚌' },
      { name: 'Facilities, Cleaning & Maintenance', icon: '🧹' }
    ];

    const displayCategories = ['All', ...(categories ? categories.map(c => c.name || c) : defaultCategories.map(c => c.name))];
    const maxCompare = (typeof window !== 'undefined' && window.innerWidth < 768) ? 2 : 3;

    // Filter by shortlist if activeTab is 'shortlist'
    let displaySuppliers = suppliers;
    if (this.activeTab === 'shortlist') {
      displaySuppliers = suppliers.filter(s => this.shortlistedIds.has(s.id));
    }

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          
          <!-- Page Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #fef3c7; border: 1px solid #fde68a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 0.75rem;">
                <span>📦</span> SkoolFinder Market • B2B Educational Suppliers Directory & School RFQ Tenders
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.5rem 0;">
                Verified Educational Suppliers & Tenders
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 720px; margin: 0;">
                Ghana's trusted institutional directory connecting accredited pre-tertiary schools with vetted suppliers, furniture fabricators, STEM equipment providers, and catering services across Greater Accra and Kumasi.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-top-my-shortlist" class="btn-pill ${this.activeTab === 'shortlist' ? 'btn-gold' : 'btn-outline'}" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>⭐</span> My Shortlist (<span id="shortlist-count-badge">${this.shortlistedIds.size}</span>)
              </button>
              <button id="btn-top-register-supplier" class="btn-pill btn-emerald" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>🏢</span> Register as Supplier
              </button>
              <button id="btn-top-supplier-workspace" class="btn-pill btn-primary" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>📊</span> Supplier OS Dashboard
              </button>
              <button id="btn-top-post-rfq" class="btn-pill btn-gold" style="display: inline-flex; align-items: center; gap: 0.4rem;">
                <span>➕</span> Post School RFQ
              </button>
            </div>
          </div>

          <!-- Triple Tab Switcher -->
          <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-light); margin-bottom: 2rem; overflow-x: auto;">
            <button id="tab-btn-directory" class="nav-link ${this.activeTab === 'directory' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              🏢 Verified Suppliers Directory (${suppliers.length})
            </button>
            <button id="tab-btn-shortlist" class="nav-link ${this.activeTab === 'shortlist' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              ⭐ School Procurement Shortlist (${this.shortlistedIds.size})
            </button>
            <button id="tab-btn-rfqs" class="nav-link ${this.activeTab === 'rfqs' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              📢 Live School RFQs (${rfqs.length})
            </button>
            <button id="tab-btn-tenders" class="nav-link ${this.activeTab === 'tenders' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              🏛️ Institutional Tenders & Frameworks (2)
            </button>
          </div>

          <!-- Tab Content: Suppliers Directory / Shortlist -->
          ${this.activeTab === 'directory' || this.activeTab === 'shortlist' ? `
            <div>
              ${this.activeTab === 'shortlist' ? `
                <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div>
                    <strong style="color: #854d0e;">⭐ School Procurement Shortlist (SUP-03-08)</strong>
                    <div style="font-size: 0.85rem; color: #a16207; margin-top: 0.2rem;">
                      Your shortlisted vendors persist across your session. Sign in to link this list to your accredited school procurement account.
                    </div>
                  </div>
                  <button id="btn-clear-shortlist" class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
                    Clear Shortlist
                  </button>
                </div>
              ` : `
                <!-- Category Filter Taxonomy (SUP-03-01) -->
                <div class="supplier-category-pills" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
                  ${displayCategories.map(c => `
                    <button class="supplier-pill ${this.activeCategory === c ? 'active' : ''}" data-cat="${c}" style="padding: 0.45rem 0.95rem; font-size: 0.85rem; border-radius: 9999px; border: 1px solid var(--border-light); background: ${this.activeCategory === c ? '#0A2046' : '#ffffff'}; color: ${this.activeCategory === c ? '#ffffff' : '#334155'}; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                      ${c}
                    </button>
                  `).join('')}
                </div>
              `}

              ${displaySuppliers.length === 0 ? `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 3rem 1.5rem; text-align: center; color: #64748b;">
                  <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⭐</div>
                  <h3 style="color: #0A2046; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
                    ${this.activeTab === 'shortlist' ? 'Your Shortlist is Currently Empty' : 'No suppliers found in this category'}
                  </h3>
                  <p style="font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.5rem;">
                    ${this.activeTab === 'shortlist' 
                      ? 'Browse the Verified Suppliers Directory and click "⭐ Shortlist" on vendors you want to evaluate for school contracts.' 
                      : 'Explore other educational categories or post an open RFQ tender.'}
                  </p>
                  <button class="btn-pill btn-primary" onclick="SuppliersView.activeTab = 'directory'; SuppliersView.activeCategory = 'All'; App.navigate('suppliers');">
                    Browse All Suppliers &rarr;
                  </button>
                </div>
              ` : `
                <!-- Supplier Directory Grid -->
                <div class="schools-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
                  ${displaySuppliers.map(s => {
                    const isChecked = this.selectedForCompare.has(s.id);
                    const isShortlisted = this.shortlistedIds.has(s.id);
                    const isBiz = (s.account_type || s.accountType) === 'business';
                    return `
                      <div class="supplier-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative;">
                        
                        <!-- Card Header: Category + Badges + Shortlist Bookmark -->
                        <div>
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 0.5rem; flex-wrap: wrap;">
                            <span class="badge" style="background: #f1f5f9; color: #334155; font-size: 0.76rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 6px;">
                              ${s.category || 'General Supply'}
                            </span>
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                              ${this.getVerificationBadge(s)}
                              <button class="btn-toggle-shortlist" data-supplier-id="${s.id}" style="background: ${isShortlisted ? '#fef08a' : '#ffffff'}; border: 1px solid ${isShortlisted ? '#eab308' : '#cbd5e1'}; color: ${isShortlisted ? '#854d0e' : '#64748b'}; border-radius: 6px; padding: 0.2rem 0.45rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;" title="${isShortlisted ? 'Remove from shortlist' : 'Add to procurement shortlist'}">
                                ${isShortlisted ? '⭐ Saved' : '☆ Shortlist'}
                              </button>
                            </div>
                          </div>

                          <!-- Company / Provider Title -->
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
                            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #0A2046; margin: 0;">
                              ${s.companyName || s.company_name || 'Educational Supplier'}
                            </h3>
                          </div>

                          <!-- Account Type Pill -->
                          <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.15rem 0.45rem; border-radius: 4px;">
                              ${isBiz ? '🏢 Registered Business (RGD/TIN)' : '👤 Qualified Individual Consultant'}
                            </span>
                          </div>

                          <!-- Location & Coverage Area -->
                          <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.75rem; line-height: 1.4;">
                            <div>📍 <strong>Base:</strong> ${s.address || s.region || 'Greater Accra, Ghana'}</div>
                            <div>🚚 <strong>Coverage:</strong> ${(Array.isArray(s.coverage) ? s.coverage : [s.service_area || 'Greater Accra', 'Nationwide']).join(', ')}</div>
                          </div>

                          <!-- Business Description -->
                          <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin-bottom: 1rem;">
                            ${s.description || 'Verified Ghanaian educational wholesale vendor delivering institutional supplies to schools.'}
                          </p>

                          <!-- Catalogue Highlights -->
                          <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 0.75rem; margin-bottom: 1.25rem;">
                            <div style="font-size: 0.75rem; font-weight: 800; color: #0A2046; text-transform: uppercase; margin-bottom: 0.35rem; letter-spacing: 0.03em;">
                              Catalogue Highlights:
                            </div>
                            <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.82rem; color: #334155; line-height: 1.5;">
                              ${(Array.isArray(s.catalogHighlights) ? s.catalogHighlights : ['Educational Textbooks & Syllabi', 'Institutional Supply', 'Classroom Resources']).map(item => `
                                <li>${item}</li>
                              `).join('')}
                            </ul>
                          </div>
                        </div>

                        <!-- Card Footer: Compare Checkbox, Inquiry & Contact Actions -->
                        <div>
                          <!-- Compare Checkbox (SUP-03-05) -->
                          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; margin-bottom: 0.75rem;">
                            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 700; color: #0A2046; cursor: pointer;">
                              <input type="checkbox" class="cb-compare-supplier" data-supplier-id="${s.id}" ${isChecked ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: #0A2046;" />
                              <span>Select to Compare</span>
                            </label>
                            <span style="font-size: 0.75rem; color: #94a3b8;">(Max ${maxCompare})</span>
                          </div>

                          <!-- Contact Actions -->
                          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <a href="https://wa.me/${(s.whatsapp || s.phone || '+233302221888').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(s.companyName || s.company_name || 'Vendor')},%20I%20found%20your%20business%20on%20SkoolFinder%20Ghana.%20We%20need%20a%20supply%20quote." target="_blank" class="btn-card-wa" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: #22c55e; color: #ffffff; padding: 0.55rem; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 700;">
                              💬 WhatsApp
                            </a>
                            <a href="tel:${(s.phone || s.whatsapp || '+233302221888').replace(/[^0-9+]/g, '')}" class="btn-card-view" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; background: #f1f5f9; color: #0A2046; padding: 0.55rem; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 700; border: 1px solid #e2e8f0;">
                              📞 Call
                            </a>
                          </div>

                          <!-- Direct Inquiry & Invitation Button (SUP-02-04, SUP-06-03) -->
                          <button class="btn-card-inquire" data-supplier-id="${s.id}" style="width: 100%; background: #0A2046; color: #ffffff; padding: 0.55rem; border-radius: 8px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s;">
                            <span>✉️</span> Send Direct RFQ / Inquiry
                          </button>
                        </div>

                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          ` : this.activeTab === 'tenders' ? `
            <!-- Tab Content: Institutional Tenders & Framework Agreements (SUP-06-01, SUP-06-02, SUP-06-06) -->
            <div>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <strong style="color: #166534; font-size: 1rem;">Institutional Managed Tenders &amp; Framework Contracts (SUP-06-01)</strong>
                  <div style="font-size: 0.85rem; color: #475569; margin-top: 0.25rem;">
                    High-value school procurement contracts (> GH₵ 100,000) with cryptographic sealed bid vaults, technical weighting, and human-approved committee evaluation.
                  </div>
                </div>
                <div style="font-size: 0.82rem; font-weight: 700; color: #1e40af; background: #dbeafe; padding: 0.4rem 0.85rem; border-radius: 9999px;">
                  🔒 Sealed Bid Vault Governed (SUP-06-02)
                </div>
              </div>

              <!-- Vault Invariant Notice -->
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #0A2046; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.75rem; font-size: 0.85rem; color: #334155; line-height: 1.6;">
                <strong>🛡️ Sealed Bid Vault Invariant (SUP-06-02):</strong> All tender proposals are locked upon submission. Price quotes and technical documents remain encrypted and strictly inaccessible to competing bidders and school evaluators until the published submission deadline passes. Statutory Non-Collusion Attestations (SUP-06-07) are required for every submission.
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Tender 1 -->
                <div class="tender-card" style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 14px; padding: 1.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                        <span class="badge" style="background: #0A2046; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 6px;">TND-2026-88102</span>
                        <span class="badge" style="background: #dbeafe; color: #1e40af; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">HIGH-VALUE TENDER</span>
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; font-weight: 800; margin: 0 0 0.35rem 0;">
                        Supply &amp; Installation of Campus-Wide STEM Robotics &amp; AI Laboratories
                      </h3>
                      <div style="font-size: 0.88rem; font-weight: 700; color: #b45309;">
                        🏫 Ghana International School (Greater Accra)
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Estimated Budget</div>
                      <div style="font-size: 1.5rem; font-weight: 800; color: #0A2046;">GH₵ 350,000</div>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.82rem;">
                    <div><strong>Evaluation Weights:</strong> Technical 60% / Commercial 40%</div>
                    <div><strong>Tender Security Bond:</strong> GH₵ 7,000 (2%)</div>
                    <div><strong>Submission Deadline:</strong> in 10 days</div>
                    <div><strong>Bid Opening:</strong> Post-Deadline Unsealing</div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="font-size: 0.82rem; color: #64748b;">
                      📄 Spec Document: <a href="#" style="color: #2563eb; font-weight: 700; text-decoration: underline;">GIS-STEM-SPEC-2026.pdf</a>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn-pill btn-outline btn-tender-clarification" data-tender-id="tnd-sample-01" style="font-size: 0.82rem; padding: 0.5rem 0.85rem;">
                        💬 Clarification Inquiry
                      </button>
                      <button class="btn-pill btn-primary btn-submit-sealed-bid" data-tender-id="tnd-sample-01" style="font-size: 0.85rem; padding: 0.5rem 1.2rem; font-weight: 800;">
                        🔒 Submit Sealed Bid &rarr;
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Tender 2: Multi-Year Framework -->
                <div class="tender-card" style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 14px; padding: 1.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                        <span class="badge" style="background: #0A2046; color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 6px;">TND-2026-44019</span>
                        <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 6px;">3-YEAR FRAMEWORK AGREEMENT</span>
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; font-weight: 800; margin: 0 0 0.35rem 0;">
                        3-Year Multi-Campus Educational Stationery &amp; Examination Materials Framework (SUP-06-06)
                      </h3>
                      <div style="font-size: 0.88rem; font-weight: 700; color: #b45309;">
                        🏫 SOS-Hermann Gmeiner International College (Tema)
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Ceiling Value</div>
                      <div style="font-size: 1.5rem; font-weight: 800; color: #0A2046;">GH₵ 600,000</div>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.82rem;">
                    <div><strong>Agreement Term:</strong> 36 Months Call-Off</div>
                    <div><strong>Evaluation Weights:</strong> Technical 50% / Commercial 50%</div>
                    <div><strong>Submission Deadline:</strong> in 14 days</div>
                    <div><strong>Drawdowns:</strong> Periodic Purchase Orders</div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="font-size: 0.82rem; color: #64748b;">
                      📄 Spec Document: <a href="#" style="color: #2563eb; font-weight: 700; text-decoration: underline;">SOS-STATIONERY-FWC-2026.pdf</a>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn-pill btn-outline btn-tender-clarification" data-tender-id="tnd-sample-02" style="font-size: 0.82rem; padding: 0.5rem 0.85rem;">
                        💬 Clarification Inquiry
                      </button>
                      <button class="btn-pill btn-primary btn-submit-sealed-bid" data-tender-id="tnd-sample-02" style="font-size: 0.85rem; padding: 0.5rem 1.2rem; font-weight: 800;">
                        🔒 Submit Sealed Bid &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- Tab Content: RFQs (Live Bidding Board) -->
            <div>
              <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <strong style="color: #1e3a8a; font-size: 1rem;">Are you a verified Ghanaian educational supplier?</strong>
                  <div style="font-size: 0.85rem; color: #475569; margin-top: 0.25rem;">
                    Accredited schools post verified institutional procurement needs below. Submit quotation bids directly to school procurement boards.
                  </div>
                </div>
                <button id="btn-sub-post-rfq" class="btn-pill btn-primary" style="font-size: 0.85rem;">
                  School Admin: Post New RFQ &rarr;
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${rfqs.map(r => `
                  <div class="rfq-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div class="rfq-meta" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="badge" style="background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">${r.category}</span>
                        <span style="color: #cbd5e1;">•</span>
                        <span style="font-size: 0.85rem; color: #64748b;">📍 ${r.region}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="badge" style="background: #f0fdf4; color: #15803d; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px;">${r.status}</span>
                        <span style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">${r.budgetRange}</span>
                      </div>
                    </div>

                    <div>
                      <div style="font-size: 0.82rem; font-weight: 800; color: #d97706; text-transform: uppercase; margin-bottom: 0.25rem;">
                        SCHOOL: ${r.schoolName}
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: #0A2046; font-weight: 800; margin-bottom: 0.5rem;">
                        ${r.title}
                      </h3>
                      <p style="color: #475569; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
                        ${r.description}
                      </p>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 1rem;">
                      <div style="font-size: 0.85rem; color: #64748b;">
                        <strong>Quantity:</strong> ${r.quantity} &nbsp;|&nbsp; 
                        <strong>Deadline:</strong> ${r.deadline} &nbsp;|&nbsp; 
                        <span style="color: #15803d; font-weight: 800;">${r.quotesReceived || 0} quotes received</span>
                      </div>

                      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <span class="badge" style="background: rgba(10,32,70,0.06); color: #0A2046; font-size: 0.78rem; padding: 0.35rem 0.65rem; border-radius: 6px; font-weight: 700;">
                          🔒 Sealed Bids
                        </span>
                        <button class="btn-pill btn-outline btn-compare-rfq-bids" data-rfq-id="${r.id}" style="padding: 0.5rem 0.85rem; font-size: 0.82rem; font-weight: 700;">
                          📊 Compare Bids
                        </button>
                        <button class="btn-pill btn-gold btn-submit-bid" data-rfq-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 700;">
                          Submit Quotation Bid &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}

          <!-- Floating Compare Drawer (SUP-03-05) -->
          <div id="compare-floating-dock" style="display: ${this.selectedForCompare.size > 0 ? 'flex' : 'none'}; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #0A2046; color: #ffffff; padding: 0.85rem 1.5rem; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); z-index: 9999; align-items: center; gap: 1rem; border: 1px solid #D5A63B;">
            <div style="font-size: 0.9rem; font-weight: 700;">
              ⚖️ Compare Suppliers: <span id="compare-count-text" style="color: #D5A63B;">${this.selectedForCompare.size}</span> / ${maxCompare} selected
            </div>
            <button id="btn-trigger-compare-modal" class="btn-pill btn-gold" style="padding: 0.45rem 1rem; font-size: 0.82rem; font-weight: 800;" ${this.selectedForCompare.size < 2 ? 'disabled' : ''}>
              Compare Side-by-Side &rarr;
            </button>
            <button id="btn-clear-compare" style="background: none; border: none; color: #94a3b8; font-size: 0.82rem; cursor: pointer; text-decoration: underline;">
              Clear
            </button>
          </div>

        </div>
      </section>
    `;
  },

  attachEvents() {
    // Navigation / Tabs
    document.getElementById('tab-btn-directory')?.addEventListener('click', () => {
      this.activeTab = 'directory';
      App.navigate('suppliers');
    });
    document.getElementById('tab-btn-shortlist')?.addEventListener('click', () => {
      this.activeTab = 'shortlist';
      App.navigate('suppliers');
    });
    document.getElementById('tab-btn-rfqs')?.addEventListener('click', () => {
      this.activeTab = 'rfqs';
      App.navigate('suppliers');
    });
    document.getElementById('tab-btn-tenders')?.addEventListener('click', () => {
      this.activeTab = 'tenders';
      App.navigate('suppliers');
    });

    // Sealed Bid Submission Handler (SUP-06-02, SUP-06-07)
    document.querySelectorAll('.btn-submit-sealed-bid').forEach(btn => {
      btn.onclick = async () => {
        const tenderId = btn.dataset.tenderId;
        const bidAmountStr = prompt('Enter your Sealed Commercial Bid Amount (GH₵):');
        if (!bidAmountStr) return;
        const bidAmount = parseFloat(bidAmountStr.replace(/[^0-9.]/g, ''));
        if (isNaN(bidAmount) || bidAmount <= 0) {
          alert('Please enter a valid numeric bid amount');
          return;
        }

        const nonCollusionConfirmed = confirm(
          'STATUTORY NON-COLLUSION ATTESTATION (SUP-06-07):\n\n' +
          'I certify under penalty of procurement disqualification that this bid is made without prior understanding, agreement, or connection with any other bidder, and that all pricing has been independently determined without consultation, communication, or cartel agreement.\n\n' +
          'Do you accept this statutory attestation?'
        );

        if (!nonCollusionConfirmed) {
          alert('Submission canceled. Statutory non-collusion declaration is required to submit a tender bid (SUP-06-07).');
          return;
        }

        try {
          btn.disabled = true;
          btn.innerText = 'Encrypting & Vaulting Bid...';
          const res = await API.submitSealedBid(tenderId, {
            bid_amount_ghs: bidAmount,
            delivery_schedule_days: 30,
            warranty_months: 12,
            non_collusion_attestation: true
          });
          if (res.success) {
            alert(`🔒 Success! Your bid (${res.bid?.bid_number}) has been cryptographically vaulted. It remains sealed and tamper-evident until the deadline passes.`);
            App.navigate('suppliers');
          } else {
            alert(res.error || 'Failed to submit sealed bid');
          }
        } catch (e) {
          alert('Submission Error: ' + e.message);
        } finally {
          btn.disabled = false;
          btn.innerText = '🔒 Submit Sealed Bid →';
        }
      };
    });

    // Tender Clarification Handler (SUP-06-03)
    document.querySelectorAll('.btn-tender-clarification').forEach(btn => {
      btn.onclick = async () => {
        const tenderId = btn.dataset.tenderId;
        const qText = prompt('Enter your anonymous clarification inquiry for the school procurement desk:');
        if (!qText || !qText.trim()) return;
        try {
          const res = await API.submitTenderClarification(tenderId, qText.trim());
          if (res.success) {
            alert('Your clarification inquiry has been submitted anonymously. Official responses will be published as public Addenda to all participating bidders.');
          }
        } catch (e) {
          alert('Error: ' + e.message);
        }
      };
    });

    // Top Action Buttons
    document.getElementById('btn-top-my-shortlist')?.addEventListener('click', () => {
      this.activeTab = this.activeTab === 'shortlist' ? 'directory' : 'shortlist';
      App.navigate('suppliers');
    });

    document.getElementById('btn-top-register-supplier')?.addEventListener('click', () => {
      if (typeof SupplierOnboardingModal !== 'undefined' && SupplierOnboardingModal.open) {
        SupplierOnboardingModal.open((supplier) => {
          App.navigate('suppliers');
        });
      } else if (typeof Modals !== 'undefined') {
        Modals.openRegisterSupplierModal();
      }
    });

    document.getElementById('btn-top-supplier-workspace')?.addEventListener('click', () => {
      App.navigate('supplier-dashboard');
    });

    const openPostRFQ = () => Modals.openPostRFQModal();
    document.getElementById('btn-top-post-rfq')?.addEventListener('click', openPostRFQ);
    document.getElementById('btn-sub-post-rfq')?.addEventListener('click', openPostRFQ);

    // Category pills filter
    document.querySelectorAll('.supplier-pill').forEach(btn => {
      btn.onclick = () => {
        this.activeCategory = btn.dataset.cat;
        App.navigate('suppliers');
      };
    });

    // Submit Bid buttons on RFQ cards
    document.querySelectorAll('.btn-submit-bid').forEach(btn => {
      btn.onclick = async () => {
        const rfqId = btn.dataset.rfqId;
        const rfqs = await API.getRFQs();
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq && typeof Modals !== 'undefined') Modals.openSubmitQuoteModal(rfq);
      };
    });

    // Compare Bids button on RFQ cards (SUP-04-02)
    document.querySelectorAll('.btn-compare-rfq-bids').forEach(btn => {
      btn.onclick = () => {
        const rfqId = btn.dataset.rfqId;
        if (typeof Modals !== 'undefined' && Modals.openCompareQuotesModal) {
          Modals.openCompareQuotesModal(rfqId);
        }
      };
    });

    // Shortlist toggle on cards (SUP-03-08)
    const sid = this.getGuestSessionId();
    document.querySelectorAll('.btn-toggle-shortlist').forEach(btn => {
      btn.onclick = async () => {
        const supId = btn.dataset.supplierId;
        const isCurrently = this.shortlistedIds.has(supId);

        try {
          if (isCurrently) {
            await API.removeFromSupplierShortlist(supId, sid);
            this.shortlistedIds.delete(supId);
            btn.innerHTML = '☆ Shortlist';
            btn.style.background = '#ffffff';
            btn.style.borderColor = '#cbd5e1';
            btn.style.color = '#64748b';
            if (typeof State !== 'undefined' && State.showToast) {
              State.showToast('Supplier removed from your procurement shortlist', 'info');
            }
          } else {
            await API.addToSupplierShortlist(supId, sid);
            this.shortlistedIds.add(supId);
            btn.innerHTML = '⭐ Saved';
            btn.style.background = '#fef08a';
            btn.style.borderColor = '#eab308';
            btn.style.color = '#854d0e';
            if (typeof State !== 'undefined' && State.showToast) {
              State.showToast('Supplier added to your school procurement shortlist! ⭐', 'success');
            }
          }
          const badge = document.getElementById('shortlist-count-badge');
          if (badge) badge.textContent = this.shortlistedIds.size;
        } catch (err) {
          console.warn('Shortlist toggle error:', err);
        }
      };
    });

    // Clear Shortlist Button
    document.getElementById('btn-clear-shortlist')?.addEventListener('click', async () => {
      const ids = Array.from(this.shortlistedIds);
      for (const id of ids) {
        await API.removeFromSupplierShortlist(id, sid);
      }
      this.shortlistedIds.clear();
      App.navigate('suppliers');
    });

    // Direct Inquiry buttons on cards (SUP-02-04, SUP-06-03)
    document.querySelectorAll('.btn-card-inquire').forEach(btn => {
      btn.onclick = () => {
        const supId = btn.dataset.supplierId;
        const supplier = this.cachedSuppliers.find(s => s.id === supId) || { id: supId, company_name: 'Educational Supplier' };
        if (typeof SupplierInquiryModal !== 'undefined' && SupplierInquiryModal.open) {
          SupplierInquiryModal.open(supplier);
        } else if (typeof Modals !== 'undefined' && Modals.openSupplierInquiryModal) {
          Modals.openSupplierInquiryModal(supplier);
        }
      };
    });

    // Compare checkboxes (SUP-03-05 invariant max 3 desktop / 2 mobile)
    const maxCompare = (typeof window !== 'undefined' && window.innerWidth < 768) ? 2 : 3;
    document.querySelectorAll('.cb-compare-supplier').forEach(cb => {
      cb.onchange = (e) => {
        const supId = cb.dataset.supplierId;
        if (cb.checked) {
          if (this.selectedForCompare.size >= maxCompare) {
            alert(`Comparison limit reached: You can compare at most ${maxCompare} suppliers simultaneously (${maxCompare === 2 ? 'mobile view' : 'desktop view'}).`);
            cb.checked = false;
            return;
          }
          this.selectedForCompare.add(supId);
        } else {
          this.selectedForCompare.delete(supId);
        }
        this.updateCompareDock(maxCompare);
      };
    });

    // Clear comparison
    document.getElementById('btn-clear-compare')?.addEventListener('click', () => {
      this.selectedForCompare.clear();
      document.querySelectorAll('.cb-compare-supplier').forEach(cb => cb.checked = false);
      this.updateCompareDock(maxCompare);
    });

    // Launch Comparison Modal
    document.getElementById('btn-trigger-compare-modal')?.addEventListener('click', async () => {
      if (this.selectedForCompare.size < 2) {
        alert('Please select at least 2 suppliers to compare side-by-side.');
        return;
      }
      await this.openComparisonModal(Array.from(this.selectedForCompare));
    });
  },

  updateCompareDock(maxCompare) {
    const dock = document.getElementById('compare-floating-dock');
    const countText = document.getElementById('compare-count-text');
    const btnTrigger = document.getElementById('btn-trigger-compare-modal');

    if (!dock) return;
    const count = this.selectedForCompare.size;
    if (count > 0) {
      dock.style.display = 'flex';
      if (countText) countText.textContent = count;
      if (btnTrigger) {
        btnTrigger.disabled = count < 2;
        btnTrigger.textContent = count >= 2 ? `Compare Side-by-Side (${count}) \u2192` : `Select at least 2`;
      }
    } else {
      dock.style.display = 'none';
    }
  },

  async openComparisonModal(supplierIds) {
    let comparisonData = null;
    try {
      const res = await API.compareSuppliers(supplierIds);
      comparisonData = res.suppliers || [];
    } catch (e) {
      alert('Could not load comparison data: ' + e.message);
      return;
    }

    if (!comparisonData || comparisonData.length === 0) {
      alert('No comparison records available for selected suppliers.');
      return;
    }

    const modalId = 'supplier-compare-modal';
    const oldModal = document.getElementById(modalId);
    if (oldModal) oldModal.remove();

    const modalHtml = `
      <div id="${modalId}" style="position: fixed; inset: 0; background: rgba(10,32,70,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 1.5rem; backdrop-filter: blur(5px);">
        <div style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 960px; max-height: 90vh; overflow-y: auto; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid #cbd5e1;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #D5A63B; letter-spacing: 0.05em;">
                SkoolFinder Procurement Tool (SUP-03-05)
              </div>
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; font-weight: 800; margin: 0.2rem 0 0 0;">
                Side-by-Side Supplier Comparison Matrix
              </h2>
            </div>
            <button id="btn-close-compare-modal" style="background: none; border: none; font-size: 1.75rem; cursor: pointer; color: #64748b; line-height: 1;">&times;</button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead>
                <tr style="border-bottom: 2px solid #0A2046;">
                  <th style="padding: 0.75rem; width: 22%; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.75rem;">Criteria</th>
                  ${comparisonData.map(s => `
                    <th style="padding: 0.75rem; color: #0A2046; font-weight: 800; font-size: 1.05rem;">
                      ${s.company_name || s.companyName}
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Verification Level</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem;">
                      ${this.getVerificationBadge(s)}
                    </td>
                  `).join('')}
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Account Structure</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem; color: #475569;">
                      ${(s.account_type || s.accountType) === 'business' ? '🏢 Registered Business (RGD/TIN)' : '👤 Qualified Individual Specialist'}
                    </td>
                  `).join('')}
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Primary Category</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem; color: #0A2046; font-weight: 600;">
                      ${s.category || 'General'}
                    </td>
                  `).join('')}
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Base & Coverage</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem; color: #475569;">
                      📍 ${s.region || s.address || 'Greater Accra'}<br/>
                      <small style="color: #64748b;">${(Array.isArray(s.coverage) ? s.coverage : [s.service_area || 'Nationwide']).join(', ')}</small>
                    </td>
                  `).join('')}
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Capacity & Highlights</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem; color: #334155;">
                      <ul style="margin: 0; padding-left: 1rem; font-size: 0.8rem; line-height: 1.4;">
                        ${(Array.isArray(s.catalogHighlights) ? s.catalogHighlights : ['Textbooks', 'Classroom Gear']).map(h => `<li>${h}</li>`).join('')}
                      </ul>
                    </td>
                  `).join('')}
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                  <td style="padding: 0.75rem; font-weight: 700; color: #334155;">Direct Contact</td>
                  ${comparisonData.map(s => `
                    <td style="padding: 0.75rem;">
                      <a href="https://wa.me/${(s.whatsapp || s.phone || '+233302221888').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(s.company_name || s.companyName)},%20I%20am%20reviewing%20your%20profile%20on%20SkoolFinder%20Ghana%20comparison." target="_blank" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 0.4rem 0.75rem; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 0.8rem;">
                        💬 WhatsApp
                      </a>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 1.5rem; text-align: right;">
            <button id="btn-close-compare-modal-footer" class="btn-pill btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">
              Close Matrix
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const close = () => document.getElementById(modalId)?.remove();
    document.getElementById('btn-close-compare-modal')?.addEventListener('click', close);
    document.getElementById('btn-close-compare-modal-footer')?.addEventListener('click', close);
  }
};

if (typeof window !== 'undefined') {
  window.SuppliersView = SuppliersView;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SuppliersView;
}
