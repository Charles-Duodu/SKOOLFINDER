/**
 * SkoolFinder Ghana — Supplier Dedicated Authenticated Workspace & Dashboard
 * Baseline: Master Blueprint v2.0 Section 3, Section 5, SUP-02-02, SUP-03-02, SUP-05-01
 */

const SupplierDashboardView = {
  activeTab: 'overview', // 'overview' | 'catalogue' | 'inquiries' | 'rfqs' | 'verification' | 'billing'
  supplierData: null,
  products: [],
  services: [],
  inquiries: [],

  async render() {
    let token = (typeof State !== 'undefined' && State.authToken) || 
                localStorage.getItem('skoolfinder_token') || 
                localStorage.getItem('auth_token') || 
                sessionStorage.getItem('auth_token');
    let supplier = null;

    try {
      if (token) {
        const res = await fetch('/api/suppliers/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.supplier) {
          supplier = data.supplier;
          this.supplierData = supplier;
        }
      }
    } catch (e) {
      console.warn('Could not fetch supplier profile:', e);
    }

    // Hydrate Inquiries (SUP-02-04, SUP-06-03)
    try {
      if (typeof API !== 'undefined' && API.getMySupplierInquiries) {
        const inqRes = await API.getMySupplierInquiries();
        this.inquiries = Array.isArray(inqRes.inquiries) ? inqRes.inquiries : [];
      }
    } catch (e) {
      this.inquiries = [];
    }
      console.warn('Could not fetch supplier profile:', e);
    }

    if (!supplier) {
      supplier = {
        companyName: 'Emerging Supplier',
        category: 'Educational Supplies',
        status: 'pending',
        verificationLevel: 'V0',
        activeTier: 'free',
        coverage: ['Greater Accra'],
        rating: 0.0
      };
    }

    // Status Banner Logic
    const isPending = supplier.status === 'pending';
    const vLevel = supplier.verificationLevel || 'V0';

    return `
      <section style="background: var(--bg-main); min-height: 90vh; padding: 2rem 0 5rem;">
        <div class="container">
          
          <!-- Top Breadcrumb & Status Ribbon -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: #D5A63B; letter-spacing: 0.05em; margin-bottom: 0.2rem;">
                📦 Supplier Management OS (/supplier-dashboard)
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 800; color: #0A2046; margin: 0;">
                ${supplier.companyName}
              </h1>
            </div>

            <!-- Verification & Tier Badges -->
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span class="badge" style="background: ${isPending ? '#fef3c7' : '#ecfdf5'}; color: ${isPending ? '#92400e' : '#065f46'}; border: 1px solid ${isPending ? '#fde68a' : '#a7f3d0'}; font-weight: 800; padding: 0.35rem 0.75rem;">
                ${isPending ? '⏳ Accreditation Pending Review' : '✅ Verified Trading Active'}
              </span>
              <span class="badge" style="background: #0A2046; color: #ffffff; font-weight: 800; padding: 0.35rem 0.75rem;">
                ${(supplier.activeTier || 'free').toUpperCase()} PLAN
              </span>
              <span class="badge" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 800; padding: 0.35rem 0.75rem;">
                ${supplier.verificationBadge || 'V0: Account Created'}
              </span>
            </div>
          </div>

          <!-- Pending Notice Banner (SUP-02-01) -->
          ${isPending ? `
            <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <strong style="color: #92400e; font-size: 0.95rem;">Mandatory Compliance Review in Progress</strong>
                <div style="font-size: 0.85rem; color: #78350f; margin-top: 0.2rem;">
                  Under Ghanaian pre-tertiary procurement regulations (SUP-02-01), public trading and direct quotation rights remain held until Super Admin compliance officers verify your submitted business credentials.
                </div>
              </div>
              <button id="btn-dash-view-verification" class="btn-pill btn-primary" style="font-size: 0.82rem; padding: 0.5rem 1rem;">
                Verification Center &rarr;
              </button>
            </div>
          ` : ''}

          <!-- Workspace Navigation Tabs -->
          <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-light); margin-bottom: 2rem; overflow-x: auto;">
            <button id="dash-tab-overview" class="nav-link ${this.activeTab === 'overview' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              📊 Overview & Activity
            </button>
            <button id="dash-tab-catalogue" class="nav-link ${this.activeTab === 'catalogue' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              🛍️ Catalogue (Products & Services)
            </button>
            <button id="dash-tab-inquiries" class="nav-link ${this.activeTab === 'inquiries' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              ✉️ Direct Inquiries (${this.inquiries.length})
            </button>
            <button id="dash-tab-rfqs" class="nav-link ${this.activeTab === 'rfqs' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              📢 RFQ Opportunities & Bids
            </button>
            <button id="dash-tab-verification" class="nav-link ${this.activeTab === 'verification' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              🛡️ Verification & Safeguards (V0-V4)
            </button>
            <button id="dash-tab-billing" class="nav-link ${this.activeTab === 'billing' ? 'active' : ''}" style="font-size: 0.95rem; padding: 0.75rem 0.5rem; font-weight: 700; white-space: nowrap;">
              💳 Commercial Plan & Quotas
            </button>
          </div>

          <!-- TAB 1: OVERVIEW -->
          <div id="dash-content-overview" style="display: ${this.activeTab === 'overview' ? 'block' : 'none'};">
            <!-- Metric KPI Tiles -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Active Listings</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #0A2046; margin: 0.3rem 0;">${this.products.length + this.services.length} / 5</div>
                <div style="font-size: 0.75rem; color: #10b981; font-weight: 600;">Free Tier Limit: 5 items</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Open RFQ Inquiries</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #D5A63B; margin: 0.3rem 0;">4</div>
                <div style="font-size: 0.75rem; color: #64748b;">Greater Accra Campuses</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Quotation Bids Submitted</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #2563eb; margin: 0.3rem 0;">2</div>
                <div style="font-size: 0.75rem; color: #64748b;">Direct School Sealed Offers</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; box-shadow: var(--shadow-sm);">
                <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Trust & Accreditation</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #059669; margin: 0.3rem 0;">${vLevel}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Ladder: V0 -> V4 Tiered</div>
              </div>
            </div>

            <!-- Quick Action Hub -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">Quick Commercial Actions</h3>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button id="btn-dash-add-product" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.65rem 1.25rem;">
                  <span>➕</span> Add Product Listing
                </button>
                <button id="btn-dash-add-service" class="btn-pill btn-emerald" style="font-size: 0.85rem; padding: 0.65rem 1.25rem;">
                  <span>🛠️</span> Add Service Offering
                </button>
                <button id="btn-dash-browse-rfqs" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.65rem 1.25rem;">
                  <span>📋</span> View School RFQs
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 2: CATALOGUE (PRODUCTS & SERVICES) -->
          <div id="dash-content-catalogue" style="display: ${this.activeTab === 'catalogue' ? 'block' : 'none'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">Published Catalogue Items</h3>
                <div style="font-size: 0.85rem; color: #64748b;">Manage physical equipment, textbooks, and professional institutional services.</div>
              </div>
              <div style="display: flex; gap: 0.75rem;">
                <button id="btn-open-add-product-modal" class="btn-pill btn-primary" style="font-size: 0.85rem;">+ Add Product</button>
                <button id="btn-open-add-service-modal" class="btn-pill btn-emerald" style="font-size: 0.85rem;">+ Add Service</button>
              </div>
            </div>

            <!-- Product Form Modal / Section -->
            <div id="section-product-form" style="display: none; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.75rem; margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">
                <h4 style="margin: 0; font-size: 1.1rem; color: #0A2046; font-weight: 800;">New Product Listing (Physical Item Template SUP-03-02)</h4>
                <button type="button" id="btn-cancel-product" style="background: none; border: none; font-size: 1.25rem; cursor: pointer;">&times;</button>
              </div>
              <form id="form-new-product">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Product Name *</label>
                    <input type="text" id="prod-name" class="form-control" placeholder="e.g. Cambridge IGCSE Physics Textbooks" required style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">SKU / Catalog Number</label>
                    <input type="text" id="prod-sku" class="form-control" placeholder="e.g. AKI-PHY-001" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Pricing Mode (SUP-03-03) *</label>
                    <select id="prod-pricing-mode" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;">
                      <option value="fixed">Fixed Price</option>
                      <option value="indicative">Indicative (Estimate)</option>
                      <option value="quote_only" selected>Quote Only (RFQ Request)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Price (GH₵)</label>
                    <input type="number" id="prod-price" class="form-control" placeholder="0.00" min="0" step="0.5" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Packaging Unit</label>
                    <select id="prod-unit" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;">
                      <option value="piece">Per Piece / Book</option>
                      <option value="carton">Per Carton</option>
                      <option value="set">Per Student Set</option>
                      <option value="bulk">Bulk Consignment</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Min Order Qty</label>
                    <input type="number" id="prod-moq" class="form-control" value="10" min="1" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Stock Availability</label>
                    <select id="prod-stock" class="form-control" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;">
                      <option value="in_stock">In Stock (Warehouse)</option>
                      <option value="made_to_order">Made to Order (Fabrication)</option>
                      <option value="out_of_stock">Temporarily Out of Stock</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Lead Time (Days)</label>
                    <input type="number" id="prod-delivery-days" class="form-control" value="3" min="1" style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                </div>

                <div class="form-group" style="margin-bottom: 1rem;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Specifications & Materials Description *</label>
                  <textarea id="prod-desc" class="form-control" rows="2" placeholder="List syllabus conformity (NaCCA/Cambridge), dimensions, paper grade, or material composition." required style="width: 100%; padding: 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px;"></textarea>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                  <button type="submit" class="btn-pill btn-primary" style="padding: 0.65rem 1.5rem; font-weight: 800;">Publish Product</button>
                  <button type="button" id="btn-cancel-product-2" class="btn-pill btn-outline">Cancel</button>
                </div>
              </form>
            </div>

            <!-- Existing Products List -->
            <div id="products-catalogue-container">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; color: #64748b;">
                📦 You currently have no products listed. Click <strong>+ Add Product</strong> above to publish your first offering.
              </div>
            </div>
          </div>

          <!-- TAB: DIRECT INQUIRIES & INVITATIONS (SUP-02-04, SUP-06-03) -->
          <div id="dash-content-inquiries" style="display: ${this.activeTab === 'inquiries' ? 'block' : 'none'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; margin: 0 0 0.25rem 0;">Direct School Inquiries & Direct Opportunities</h3>
                <p style="font-size: 0.85rem; color: #64748b; margin: 0;">Direct procurement requests received from accredited Ghanaian pre-tertiary school administrations.</p>
              </div>
            </div>

            ${this.inquiries.length === 0 ? `
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 3rem 1.5rem; text-align: center; color: #64748b;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📬</div>
                <h4 style="color: #0A2046; margin: 0 0 0.5rem 0; font-size: 1.15rem;">No Direct Inquiries Yet</h4>
                <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto;">Schools browsing the SkoolFinder directory can send direct procurement inquiries and RFQ invitations directly to your inbox. Direct responses are exempt from platform quotas (SUP-02-04).</p>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                ${this.inquiries.map(inq => {
                  const isDirect = !!inq.direct_invitation;
                  return `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-sm);">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <div>
                          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span class="badge" style="background: #0A2046; color: #ffffff; font-weight: 700;">${inq.inquiry_number || 'INQ-REF'}</span>
                            ${isDirect ? `
                              <span class="badge" style="background: #fef08a; color: #854d0e; font-weight: 700; border: 1px solid #eab308;" title="Direct School Invitation: Exempt from quota caps (SUP-02-04)">
                                ⭐ Direct School Invitation
                              </span>
                            ` : ''}
                            <span class="badge" style="background: #f1f5f9; color: #334155; font-weight: 700;">
                              Status: ${(inq.status || 'sent').toUpperCase()}
                            </span>
                          </div>
                          <h4 style="font-size: 1.15rem; color: #0A2046; margin: 0.5rem 0 0.2rem 0; font-weight: 800;">
                            ${inq.subject}
                          </h4>
                          <div style="font-size: 0.82rem; color: #64748b;">
                            School: <strong>${inq.school_name || 'Ghana Educational Institution'}</strong> • Contact: ${inq.sender_name} (${inq.sender_phone || inq.sender_email})
                          </div>
                        </div>
                        <div style="font-size: 0.78rem; color: #94a3b8;">
                          ${new Date(inq.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; font-size: 0.88rem; color: #334155; line-height: 1.5;">
                        ${inq.message}
                      </div>

                      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; font-size: 0.82rem; color: #64748b;">
                        <div>
                          <strong>Timeline:</strong> ${inq.target_timeline || 'Standard'} &nbsp;|&nbsp; 
                          <strong>Volume:</strong> ${inq.estimated_volume || 'Per Specification'}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                          <button class="btn-pill btn-outline btn-reply-inquiry" data-inquiry-id="${inq.id}" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                            💬 Reply to School
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- TAB 3: RFQS -->
          <div id="dash-content-rfqs" style="display: ${this.activeTab === 'rfqs' ? 'block' : 'none'};">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; margin-bottom: 1rem;">Open School Procurement RFQs</h3>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem;">
              <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge" style="background: #f0fdf4; color: #166534; font-weight: 800;">ACTIVE RFQ</span>
                  <span style="font-weight: 800; color: #0A2046;">GH₵ 45,000</span>
                </div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0.5rem 0;">Supply of 150 Robotics & STEM Starter Kits — Ghana International School</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin: 0;">Cantonments, Greater Accra • Deadline: Within 30 Days</p>
              </div>
              <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge" style="background: #f0fdf4; color: #166534; font-weight: 800;">ACTIVE RFQ</span>
                  <span style="font-weight: 800; color: #0A2046;">GH₵ 30,000</span>
                </div>
                <h4 style="font-size: 1.1rem; color: #0A2046; margin: 0.5rem 0;">Bulk Supply of Core Mathematics & Science Textbooks — Achimota School</h4>
                <p style="font-size: 0.85rem; color: #64748b; margin: 0;">Achimota, Greater Accra • Deadline: Within 14 Days</p>
              </div>
            </div>
          </div>

          <!-- TAB 4: VERIFICATION CENTER (V0 - V4 LADDER) -->
          <div id="dash-content-verification" style="display: ${this.activeTab === 'verification' ? 'block' : 'none'};">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
              Supplier Accreditation & Safeguarding Ladder (SUP-05-01)
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">
              SkoolFinder enforces a risk-based 5-stage verification ladder ensuring private schools only contract with authenticated, legally registered, and safeguarding-compliant suppliers.
            </p>

            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px;">
              <!-- V0: Account -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #10b981; border-radius: 8px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #0A2046; font-size: 0.95rem;">V0: Authenticated Account & Email Ownership</strong>
                  <span class="badge" style="background: #ecfdf5; color: #065f46;">COMPLETED</span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">Account owner contact authenticated via JWT and canonical identity.</div>
              </div>

              <!-- V1: Identity -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #3b82f6; border-radius: 8px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #0A2046; font-size: 0.95rem;">V1: Representative Ghana Card (NIA) Identification</strong>
                  <span class="badge" style="background: #eff6ff; color: #1e40af;">UNDER REVIEW</span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">Authorized representative or sole artisan identity verification against national ID records.</div>
              </div>

              <!-- V2: Business Registration -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #f59e0b; border-radius: 8px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #0A2046; font-size: 0.95rem;">V2: Registrar General (RGD) & GRA TIN Business Standing</strong>
                  <span class="badge" style="background: #fffbeb; color: #92400e;">PENDING REVIEW</span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">Certificate of Incorporation / Form 3 validating commercial registration and tax standing.</div>
              </div>

              <!-- V3: Category Specific -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #94a3b8; border-radius: 8px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #0A2046; font-size: 0.95rem;">V3: Sector Licensing & Manufacturer Distributorship</strong>
                  <span class="badge" style="background: #f1f5f9; color: #475569;">LOCKED UNTIL V2</span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">Publisher rights (NaCCA/Cambridge), authorized hardware warranty partnership.</div>
              </div>

              <!-- V4: Enhanced Safeguards -->
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 5px solid #94a3b8; border-radius: 8px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: #0A2046; font-size: 0.95rem;">V4: Enhanced Child-Facing, Food & Transport Safeguards</strong>
                  <span class="badge" style="background: #f1f5f9; color: #475569;">FOR HIGH RISK</span>
                </div>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.25rem;">Ghana FDA Food Hygiene, DVLA Roadworthiness, and Police CID background clearances for student contact.</div>
              </div>
            </div>
          </div>

          <!-- TAB 5: BILLING & QUOTAS -->
          <div id="dash-content-billing" style="display: ${this.activeTab === 'billing' ? 'block' : 'none'};">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0A2046; margin-bottom: 0.5rem;">
              Commercial Plan & Quota Management (SUP-04-01, SUP-04-03)
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">
              Manage your commercial subscription, seat licenses, and open-market quoting capacity.
            </p>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; max-width: 700px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1.25rem;">
                <div>
                  <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Current Subscription</div>
                  <div style="font-size: 1.5rem; font-weight: 800; color: #0A2046;">Free Vendor Plan</div>
                </div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #0A2046;">GH₵ 0 / mo</div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
                  <span>Active Listings Quota:</span>
                  <strong>${this.products.length} / 5</strong>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: ${Math.min(100, (this.products.length / 5) * 100)}%; height: 100%; background: #0A2046;"></div>
                </div>
              </div>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #475569;">
                💡 <strong>Protected Direct Invitations (SUP-04-03):</strong> When an accredited school directly invites your organization to quote on their procurement request, your response is <strong>never blocked</strong> by open-market quotas.
              </div>

              <button type="button" id="btn-dash-upgrade-plan" class="btn-pill btn-emerald" style="width: 100%; padding: 0.75rem; font-weight: 800;">
                Upgrade to Growth Plan (GH₵ 79/mo) &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>
    `;
  },

  attachEvents() {
    // Tab Switching
    const tabs = ['overview', 'catalogue', 'inquiries', 'rfqs', 'verification', 'billing'];
    const switchTab = (tabName) => {
      this.activeTab = tabName;
      tabs.forEach(t => {
        const btn = document.getElementById(`dash-tab-${t}`);
        const content = document.getElementById(`dash-content-${t}`);
        if (btn) btn.classList.toggle('active', t === tabName);
        if (content) content.style.display = t === tabName ? 'block' : 'none';
      });
    };

    tabs.forEach(t => {
      const btn = document.getElementById(`dash-tab-${t}`);
      if (btn) btn.onclick = () => switchTab(t);
    });

    // Inquiry Reply Handler (SUP-06-03)
    document.querySelectorAll('.btn-reply-inquiry').forEach(btn => {
      btn.onclick = async () => {
        const inqId = btn.dataset.inquiryId;
        const replyText = prompt('Enter your reply / quote clarification message to the school:');
        if (!replyText || !replyText.trim()) return;
        try {
          const res = await API.replyToSupplierInquiry(inqId, replyText.trim());
          if (res.success) {
            alert('Reply message delivered to school!');
            await App.refreshCurrentView();
          } else {
            alert(res.error || 'Failed to send reply');
          }
        } catch (e) {
          alert('Error: ' + e.message);
        }
      };
    });

    const btnViewVer = document.getElementById('btn-dash-view-verification');
    if (btnViewVer) btnViewVer.onclick = () => switchTab('verification');

    const btnBrowseRFQs = document.getElementById('btn-dash-browse-rfqs');
    if (btnBrowseRFQs) btnBrowseRFQs.onclick = () => switchTab('rfqs');

    // Product Form Toggle
    const btnOpenProd = document.getElementById('btn-open-add-product-modal');
    const btnDashProd = document.getElementById('btn-dash-add-product');
    const prodSection = document.getElementById('section-product-form');
    const openProdForm = () => {
      switchTab('catalogue');
      if (prodSection) prodSection.style.display = 'block';
    };
    if (btnOpenProd) btnOpenProd.onclick = openProdForm;
    if (btnDashProd) btnDashProd.onclick = openProdForm;

    const closeProdForm = () => { if (prodSection) prodSection.style.display = 'none'; };
    const btnCancel1 = document.getElementById('btn-cancel-product');
    const btnCancel2 = document.getElementById('btn-cancel-product-2');
    if (btnCancel1) btnCancel1.onclick = closeProdForm;
    if (btnCancel2) btnCancel2.onclick = closeProdForm;

    // Handle Product Form Submit
    const prodForm = document.getElementById('form-new-product');
    if (prodForm) {
      prodForm.onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('prod-name').value.trim(),
          sku: document.getElementById('prod-sku').value.trim(),
          pricing_mode: document.getElementById('prod-pricing-mode').value,
          price_ghs: parseFloat(document.getElementById('prod-price').value) || 0,
          unit: document.getElementById('prod-unit').value,
          minimum_order_qty: parseInt(document.getElementById('prod-moq').value) || 1,
          stock_availability: document.getElementById('prod-stock').value,
          delivery_days: parseInt(document.getElementById('prod-delivery-days').value) || 3,
          description: document.getElementById('prod-desc').value.trim()
        };

        const token = (typeof State !== 'undefined' && State.authToken) || 
                      localStorage.getItem('skoolfinder_token') || 
                      localStorage.getItem('auth_token') || 
                      sessionStorage.getItem('auth_token');
        try {
          const res = await fetch('/api/suppliers/me/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert('Product published successfully!');
            this.products.unshift(data.product);
            closeProdForm();
            prodForm.reset();
            // Re-render container
            const container = document.getElementById('products-catalogue-container');
            if (container) {
              container.innerHTML = `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h4 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; color: #0A2046;">${data.product.name}</h4>
                    <div style="font-size: 0.82rem; color: #64748b;">SKU: ${data.product.sku} • Unit: ${data.product.unit} • Pricing: ${data.product.pricing_mode.toUpperCase()}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 1.25rem; font-weight: 800; color: #0A2046;">GH₵ ${data.product.price_ghs}</div>
                    <span class="badge" style="background: #f0fdf4; color: #166534;">PUBLISHED</span>
                  </div>
                </div>
              `;
            }
          } else {
            alert(data.error || 'Failed to publish product');
          }
        } catch (err) {
          alert('Error: ' + err.message);
        }
      };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupplierDashboardView;
}
