/**
 * SkoolFinder Ghana - Phase 2: Educational Suppliers & RFQ B2B Hub
 */
const SuppliersView = {
  activeTab: 'rfqs', // 'rfqs' | 'directory'
  activeCategory: 'All',

  async render() {
    let suppliers = [];
    let rfqs = [];
    try {
      const supRes = await API.getSuppliers(this.activeCategory);
      suppliers = Array.isArray(supRes) ? supRes : [];
    } catch (e) {
      suppliers = [];
    }
    try {
      const rfqRes = await API.getRFQs();
      rfqs = Array.isArray(rfqRes) ? rfqRes : [];
    } catch (e) {
      rfqs = [];
    }

    return `
      <section style="background: var(--bg-main); min-height: 80vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Page Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #fef3c7; border: 1px solid #fde68a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 0.75rem;">
                <span>📦</span> SkoolFinder Market • B2B Procurement Portal (/suppliers)
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.5rem 0;">
                Educational Suppliers & School RFQ Tenders
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 680px; margin: 0;">
                Connecting schools in Greater Accra and Kumasi with verified bulk food suppliers, furniture fabricators, textbook publishers (Aki-Ola, Cambridge), and EdTech partners.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-top-register-supplier" class="btn-pill btn-emerald">
                <span>🏢</span> Register as Supplier
              </button>
              <button id="btn-top-post-rfq" class="btn-pill btn-gold">
                <span>➕</span> Post a School RFQ
              </button>
            </div>
          </div>

          <!-- Dual Tab Switcher -->
          <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-light); margin-bottom: 2rem;">
            <button id="tab-btn-rfqs" class="nav-link ${this.activeTab === 'rfqs' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              📢 Live School RFQs (${rfqs.length})
            </button>
            <button id="tab-btn-directory" class="nav-link ${this.activeTab === 'directory' ? 'active' : ''}" style="font-size: 1.05rem; padding: 0.75rem 0.5rem; font-weight: 700;">
              🏢 Verified Suppliers Directory (${suppliers.length})
            </button>
          </div>

          <!-- Tab Content: RFQs (Live Bidding Board) -->
          ${this.activeTab === 'rfqs' ? `
            <div>
              <div style="background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <strong style="color: var(--primary-900);">Are you a supplier or manufacturer in Ghana?</strong>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Schools post verified procurement needs below. Click "Submit Quotation Bid" to send your price proposal directly to the school board.
                  </div>
                </div>
                <button id="btn-sub-post-rfq" class="btn-pill btn-primary" style="font-size: 0.85rem;">
                  School Admin: Post New RFQ
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${rfqs.map(r => `
                  <div class="rfq-card">
                    <div class="rfq-meta">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="badge" style="background: var(--primary-50); color: var(--primary-700);">${r.category}</span>
                        <span style="color: var(--text-light);">•</span>
                        <span>📍 ${r.region}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="badge badge-admissions">${r.status}</span>
                        <span class="rfq-budget-tag">${r.budgetRange}</span>
                      </div>
                    </div>

                    <div>
                      <div style="font-size: 0.82rem; font-weight: 700; color: var(--gold-600); margin-bottom: 0.2rem;">
                        SCHOOL: ${r.schoolName}
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); font-weight: 700; margin-bottom: 0.5rem;">
                        ${r.title}
                      </h3>
                      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
                        ${r.description}
                      </p>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-light); flex-wrap: wrap; gap: 1rem;">
                      <div style="font-size: 0.85rem; color: var(--text-muted);">
                        <strong>Quantity:</strong> ${r.quantity} &nbsp;|&nbsp; 
                        <strong>Deadline:</strong> ${r.deadline} &nbsp;|&nbsp; 
                        <span style="color: var(--emerald-600); font-weight: 700;">${r.quotesReceived || 0} quotes received</span>
                      </div>

                      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <button class="btn-pill btn-outline btn-view-quotes" data-rfq-id="${r.id}" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                          📋 View Quotes (${r.quotesReceived || 0})
                        </button>
                        <button class="btn-pill btn-gold btn-submit-bid" data-rfq-id="${r.id}">
                          Submit Quotation Bid &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <!-- Tab Content: Suppliers Directory -->
            <div>
              <!-- Category Filter Pills -->
              <div class="supplier-category-pills">
                ${['All', 'Books & Stationery', 'Furniture & Hardware', 'Food & Catering', 'IT / Software / Computers', 'Uniforms & Textiles', 'Cleaning & Security'].map(c => `
                  <button class="supplier-pill ${this.activeCategory === c ? 'active' : ''}" data-cat="${c}">
                    ${c}
                  </button>
                `).join('')}
              </div>

              <div class="schools-grid">
                ${suppliers.map(s => `
                  <div class="supplier-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <span class="badge" style="background: var(--primary-50); color: var(--primary-700);">${s.category || 'General'}</span>
                      <span class="badge badge-verified">🛡️ ${s.ratingBadge || 'Verified'}</span>
                    </div>

                    <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.4rem;">
                      ${s.companyName || s.company_name || 'Educational Supplier'}
                    </h3>

                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                      📍 ${s.address || s.service_area || s.region || 'Greater Accra, Ghana'} <br/>
                      <span style="font-weight: 600; color: var(--text-main);">Coverage:</span> ${(Array.isArray(s.coverage) ? s.coverage : [s.service_area || 'Greater Accra', 'Nationwide']).join(', ')}
                    </div>

                    <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; flex-grow: 1;">
                      ${s.description || 'Verified educational goods and institutional supplies in Ghana.'}
                    </p>

                    <div style="background: var(--bg-main); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
                      <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary-900); text-transform: uppercase; margin-bottom: 0.4rem;">
                        Catalog Highlights:
                      </div>
                      <ul class="supplier-catalog-list" style="margin: 0;">
                        ${(Array.isArray(s.catalogHighlights) ? s.catalogHighlights : ['Textbooks & Learning Materials', 'Classroom Equipment', 'Institutional Supply']).map(item => `
                          <li class="supplier-catalog-item">
                            <span style="color: var(--gold-600); font-weight: 800;">•</span> ${item}
                          </li>
                        `).join('')}
                      </ul>
                    </div>

                    <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border-light); padding-top: 1rem;">
                      <a href="https://wa.me/${(s.whatsapp || s.phone || '+233302221888').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(s.companyName || s.company_name || 'Vendor')},%20I%20found%20your%20business%20on%20SkoolFinder%20Ghana.%20We%20need%20a%20supply%20quote." target="_blank" class="btn-card-wa" style="flex: 1; justify-content: center;">
                        💬 WhatsApp
                      </a>
                      <a href="tel:${(s.phone || s.whatsapp || '+233302221888').replace(/[^0-9+]/g, '')}" class="btn-card-view" style="flex: 1; text-align: center;">
                        📞 Call Vendor
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </div>
      </section>
    `;
  },

  attachEvents() {
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Tab buttons
    document.getElementById('tab-btn-rfqs')?.addEventListener('click', () => {
      this.activeTab = 'rfqs';
      App.navigate('suppliers');
    });
    document.getElementById('tab-btn-directory')?.addEventListener('click', () => {
      this.activeTab = 'directory';
      App.navigate('suppliers');
    });

    // Post RFQ
    const openPostRFQ = () => Modals.openPostRFQModal();
    document.getElementById('btn-top-post-rfq')?.addEventListener('click', openPostRFQ);
    document.getElementById('btn-sub-post-rfq')?.addEventListener('click', openPostRFQ);

    // Register Supplier
    document.getElementById('btn-top-register-supplier')?.addEventListener('click', () => {
      Modals.openRegisterSupplierModal();
    });

    // Submit Bid buttons
    document.querySelectorAll('.btn-submit-bid').forEach(btn => {
      btn.onclick = async () => {
        const rfqId = btn.dataset.rfqId;
        const rfqs = await API.getRFQs();
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq) Modals.openSubmitQuoteModal(rfq);
      };
    });

    // View Quotes buttons
    document.querySelectorAll('.btn-view-quotes').forEach(btn => {
      btn.onclick = async () => {
        const rfqId = btn.dataset.rfqId;
        const rfqs = await API.getRFQs();
        const rfq = rfqs.find(r => r.id === rfqId);
        if (rfq) Modals.openRFQQuotesModal(rfq);
      };
    });

    // Category pills for directory
    document.querySelectorAll('.supplier-pill').forEach(btn => {
      btn.onclick = () => {
        this.activeCategory = btn.dataset.cat;
        App.navigate('suppliers');
      };
    });
  }
};
