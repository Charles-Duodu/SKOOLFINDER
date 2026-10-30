/**
 * SkoolFinder Ghana - Modals & Dialogs Component
 */
const Modals = {
  activeModal: null,

  close() {
    if (this._mockTimerInterval) {
      clearInterval(this._mockTimerInterval);
      this._mockTimerInterval = null;
    }
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) backdrop.remove();
    const activeModal = document.getElementById('active-modal');
    if (activeModal) activeModal.remove();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    this.activeModal = null;
  },

  openClaimSchoolModal(school) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Official Ownership Claim</div>
            <h3 class="modal-title">Claim ${school.name}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-claim-school" class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Please provide official contact details. Our team will verify your authority with the school administration before granting access.
          </p>
          <div class="form-group">
            <label class="form-label">Your Full Name *</label>
            <input type="text" id="claim-name" class="form-input" placeholder="e.g. Mrs. Vivian Arthur" required />
          </div>
          <div class="form-group">
            <label class="form-label">Official Role at School *</label>
            <select id="claim-role" class="form-select" required>
              <option value="Head of School / Principal">Head of School / Principal</option>
              <option value="Proprietor / Board Member">Proprietor / Board Member</option>
              <option value="Admissions Officer">Admissions Officer</option>
              <option value="School Administrator">School Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Official School Phone Number *</label>
            <input type="tel" id="claim-phone" class="form-input" placeholder="e.g. +233 24 000 0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Official Email Address</label>
            <input type="email" id="claim-email" class="form-input" placeholder="e.g. admin@school.edu.gh" />
          </div>
          <div class="form-group">
            <label class="form-label">Proof of Association / Notes</label>
            <textarea id="claim-notes" class="form-textarea" rows="2" placeholder="e.g. Registered with GES (Reg No. GH-10293)"></textarea>
          </div>
          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-claim">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Submit Claim Verification</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-claim').onclick = () => this.close();

    document.getElementById('form-claim-school').onsubmit = async (e) => {
      e.preventDefault();
      const claimantName = document.getElementById('claim-name').value;
      const claimantRole = document.getElementById('claim-role').value;
      const officialPhone = document.getElementById('claim-phone').value;
      const officialEmail = document.getElementById('claim-email').value;
      const notes = document.getElementById('claim-notes').value;

      try {
        await API.claimSchool(school.id, { claimantName, claimantRole, officialPhone, officialEmail, notes });
        this.close();
        State.showToast(`Claim submitted for ${school.name}! Our team will call within 24 hours.`, 'success');
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openPostRFQModal(preset = {}) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Institutional B2B Procurement</div>
            <h3 class="modal-title">Post Request for Quotation (RFQ)</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-post-rfq" class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
            Verified suppliers in Greater Accra and Kumasi will review your request and submit competing wholesale price quotations directly to your school administration.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">School Name *</label>
              <input type="text" id="rfq-school-name" class="form-input" value="${preset.schoolName || ''}" placeholder="e.g. Jack & Jill Basic School" required />
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select id="rfq-category" class="form-select" required>
                <option value="Furniture & Hardware">Furniture & Hardware (Desks, Tables, Bunks)</option>
                <option value="Food & Catering">Food & Catering (Bulk Rice, Cooking Oil, Produce)</option>
                <option value="Books & Stationery">Books & Stationery (Textbooks, Exercise Books)</option>
                <option value="IT / Software / Computers">IT / Software (Smartboards, PCs, SMS)</option>
                <option value="Science & Lab Equipment">Science & Lab (Microscopes, Chemicals, Kits)</option>
                <option value="Uniforms & Textiles">Uniforms & Textiles (Polos, Sportswear)</option>
                <option value="Cleaning & Security">Cleaning & Security (CCTV, Sanitation)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Procurement Title *</label>
            <input type="text" id="rfq-title" class="form-input" placeholder="e.g. Supply of 150 Dual Student Desks & 10 Teacher Tables" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Quantity & Unit Description *</label>
              <input type="text" id="rfq-quantity" class="form-input" placeholder="e.g. 150 dual desks + 10 teacher tables" required />
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Budget Range (GH₵)</label>
              <input type="text" id="rfq-budget" class="form-input" placeholder="e.g. GH₵ 30,000 - 45,000" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Delivery Region *</label>
              <select id="rfq-region" class="form-select" required>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti">Ashanti</option>
                <option value="Western">Western</option>
                <option value="Central">Central</option>
                <option value="Eastern">Eastern</option>
                <option value="Volta">Volta</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Delivery Deadline *</label>
              <input type="date" id="rfq-deadline" class="form-input" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specifications & Inspection Requirements</label>
            <textarea id="rfq-description" class="form-textarea" rows="3" placeholder="Specify materials (e.g. Odum hardwood, steel gauges), sample inspection terms, delivery location/suburb, and warranty expectations."></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-rfq">Cancel</button>
            <button type="submit" class="btn-pill btn-primary">Publish RFQ to Suppliers</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-rfq').onclick = () => this.close();

    // Set default deadline to 3 weeks ahead
    const dateInput = document.getElementById('rfq-deadline');
    if (dateInput) {
      const future = new Date();
      future.setDate(future.getDate() + 21);
      dateInput.value = future.toISOString().split('T')[0];
    }

    document.getElementById('form-post-rfq').onsubmit = async (e) => {
      e.preventDefault();
      const schoolName = document.getElementById('rfq-school-name').value.trim();
      const category = document.getElementById('rfq-category').value;
      const title = document.getElementById('rfq-title').value.trim();
      const quantity = document.getElementById('rfq-quantity').value.trim();
      const budgetRange = document.getElementById('rfq-budget').value.trim() || "Negotiable";
      const region = document.getElementById('rfq-region').value;
      const deadline = document.getElementById('rfq-deadline').value;
      const description = document.getElementById('rfq-description').value.trim();

      try {
        await API.createRFQ({
          schoolId: preset.schoolId || null,
          schoolName,
          category,
          title,
          quantity,
          budgetRange,
          region,
          deadline,
          description
        });
        this.close();
        State.showToast(`🎉 RFQ "${title}" published! Verified suppliers will submit bids.`, 'success');
        if (State.currentView === 'suppliers') App.navigate('suppliers');
        else if (State.currentView === 'dashboard') App.navigate('dashboard', preset.schoolId);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openSubmitQuoteModal(rfq) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Submit Supplier Bid</div>
            <h3 class="modal-title">${rfq.title}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-submit-quote" class="modal-body">
          <div style="background: var(--primary-50); border: 1px solid var(--primary-100); padding: 0.85rem 1.15rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <span style="font-size: 0.85rem; color: var(--primary-800); font-weight: 700;">🏫 School: ${rfq.schoolName}</span>
              <span class="badge badge-admissions">${rfq.status}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              <strong>Quantity:</strong> ${rfq.quantity} &bull; 
              <strong>Budget:</strong> ${rfq.budgetRange} &bull; 
              <strong>Deadline:</strong> ${rfq.deadline}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Supplier / Company Name *</label>
              <input type="text" id="quote-supplier" class="form-input" placeholder="e.g. Modern Class Furniture Ltd" required />
            </div>
            <div class="form-group">
              <label class="form-label">Contact Person *</label>
              <input type="text" id="quote-contact-person" class="form-input" placeholder="e.g. Samuel K. Mensah" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Phone Number (MoMo / WhatsApp) *</label>
              <input type="tel" id="quote-phone" class="form-input" placeholder="e.g. 0244123456" required />
            </div>
            <div class="form-group">
              <label class="form-label">Business Email</label>
              <input type="email" id="quote-email" class="form-input" placeholder="e.g. sales@modernclass.gh" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Total Quoted Price (GH₵) *</label>
              <input type="text" id="quote-price" class="form-input" placeholder="e.g. GH₵ 32,500" required />
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Delivery Time (Days) *</label>
              <input type="number" id="quote-days" class="form-input" placeholder="e.g. 10" min="1" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Warranty / Quality Terms</label>
              <input type="text" id="quote-warranty" class="form-input" placeholder="e.g. 12 Months free replacement warranty" />
            </div>
            <div class="form-group">
              <label class="form-label">Payment Terms</label>
              <input type="text" id="quote-payment-terms" class="form-input" placeholder="e.g. 50% mobilization, 50% on delivery" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Proposal Notes & Material Details</label>
            <textarea id="quote-notes" class="form-textarea" rows="3" placeholder="Mention sample availability, wood species / steel gauges, durability guarantee, and free installation."></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-quote">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Send Quotation to School Board</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-quote').onclick = () => this.close();

    document.getElementById('form-submit-quote').onsubmit = async (e) => {
      e.preventDefault();
      const supplierName = document.getElementById('quote-supplier').value.trim();
      const contactPerson = document.getElementById('quote-contact-person').value.trim();
      const phone = document.getElementById('quote-phone').value.trim();
      const email = document.getElementById('quote-email').value.trim();
      const price = document.getElementById('quote-price').value.trim();
      const deliveryDays = document.getElementById('quote-days').value.trim();
      const warrantyTerms = document.getElementById('quote-warranty').value.trim();
      const paymentTerms = document.getElementById('quote-payment-terms').value.trim();
      const notes = document.getElementById('quote-notes').value.trim();

      try {
        await API.submitQuote(rfq.id, {
          supplierName,
          contactPerson,
          phone,
          email,
          price,
          deliveryDays,
          warrantyTerms,
          paymentTerms,
          notes
        });
        this.close();
        State.showToast(`🎉 Quotation submitted to ${rfq.schoolName}! School head has been notified via Email & SMS.`, 'success');
        if (State.currentView === 'suppliers') App.navigate('suppliers');
        else if (State.currentView === 'dashboard') App.navigate('dashboard', rfq.schoolId);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openRFQQuotesModal(rfq) {
    this.close();
    const quotes = rfq.quotes || [];
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Procurement Bids Review</div>
            <h3 class="modal-title">${rfq.title}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--primary-50); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="font-size: 0.85rem; color: var(--primary-800); font-weight: 700;">School: ${rfq.schoolName}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              <strong>Quantity:</strong> ${rfq.quantity} &bull; 
              <strong>Budget:</strong> ${rfq.budgetRange} &bull; 
              <strong>Status:</strong> ${rfq.status}
            </div>
          </div>

          <h4 style="font-size: 1rem; color: var(--primary-900); font-weight: 700; margin-bottom: 1rem;">
            Received Quotations (${quotes.length})
          </h4>

          ${quotes.length === 0 ? `
            <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-main); border-radius: var(--radius-md); color: var(--text-muted); font-size: 0.9rem;">
              No supplier quotes submitted yet for this tender. Verified suppliers are reviewing the request.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${quotes.map(q => `
                <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <div style="font-weight: 700; font-size: 1.05rem; color: var(--primary-900);">
                        ${q.supplierName}
                        <span class="badge badge-verified" style="font-size: 0.72rem; margin-left: 0.35rem;">🛡️ Verified</span>
                      </div>
                      <div style="font-size: 0.82rem; color: var(--text-muted);">
                        Contact: ${q.contactPerson || 'Sales Desk'} &bull; 📞 ${q.phone || 'N/A'}
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 1.25rem; font-weight: 800; color: var(--emerald-600);">${q.price}</div>
                      <span class="badge ${q.status === 'Awarded' ? 'badge-emerald' : 'badge-admissions'}">${q.status}</span>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.84rem; background: var(--bg-main); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                    <div><strong>Delivery Time:</strong> ${q.deliveryDays} Business Days</div>
                    <div><strong>Warranty:</strong> ${q.warrantyTerms || 'Standard 6 Months'}</div>
                    ${q.paymentTerms ? `<div style="grid-column: span 2;"><strong>Payment Terms:</strong> ${q.paymentTerms}</div>` : ''}
                  </div>

                  ${q.notes ? `
                    <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                      "${q.notes}"
                    </p>
                  ` : ''}

                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="display: flex; gap: 0.5rem;">
                      ${q.phone ? `
                        <a href="https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(q.supplierName)},%20we%20reviewed%20your%20quote%20on%20SkoolFinder%20for%20${encodeURIComponent(rfq.title)}." target="_blank" class="btn-card-wa" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                          💬 WhatsApp
                        </a>
                        <a href="tel:${q.phone.replace(/[^0-9+]/g, '')}" class="btn-card-view" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                          📞 Call
                        </a>
                      ` : ''}
                    </div>

                    ${q.status === 'Awarded' ? `
                      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="font-size: 0.85rem; color: var(--emerald-600); font-weight: 700;">🟢 Tender Awarded</span>
                        <button class="btn-pill btn-gold btn-open-lpo-from-quote" data-quote-id="${q.id}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                          📄 Official LPO Voucher
                        </button>
                      </div>
                    ` : q.status === 'Declined' ? `
                      <span style="font-size: 0.85rem; color: #dc2626; font-weight: 700;">🔴 Bid Declined</span>
                    ` : `
                      <div style="display: flex; gap: 0.4rem;">
                        <button class="btn-pill btn-emerald btn-award-quote" data-quote-id="${q.id}" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">
                          ✓ Accept & Award
                        </button>
                        <button class="btn-pill btn-outline btn-decline-quote" data-quote-id="${q.id}" style="font-size: 0.82rem; padding: 0.4rem 0.85rem; color: #dc2626; border-color: #fca5a5;">
                          ✕ Decline Bid
                        </button>
                      </div>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-pill btn-outline" id="btn-close-quotes-modal">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-quotes-modal').onclick = () => this.close();

    // View LPO from quote
    document.querySelectorAll('.btn-open-lpo-from-quote').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        try {
          const res = await API.generateLPO(quoteId);
          if (res && res.lpo) {
            this.openLPOModal(res.lpo);
          } else {
            State.showToast('LPO not found', 'error');
          }
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // Award buttons
    document.querySelectorAll('.btn-award-quote').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        try {
          await API.updateQuoteStatus(quoteId, 'Awarded');
          State.showToast(`🎉 Tender awarded! Official LPO generated, supplier and Super Admin notified.`, 'success');
          this.close();
          if (State.currentView === 'dashboard') App.navigate('dashboard', rfq.schoolId);
          else if (State.currentView === 'suppliers') App.navigate('suppliers');
          else if (State.currentView === 'admin') App.navigate('admin');
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });

    // Decline buttons
    document.querySelectorAll('.btn-decline-quote').forEach(btn => {
      btn.onclick = async () => {
        const quoteId = btn.dataset.quoteId;
        const reason = prompt("Enter a brief reason for declining this bid (e.g. Budget exceeded, specs mismatch):", "Proposal did not meet current school budget or timeline parameters");
        if (reason === null) return;
        try {
          await API.updateQuoteStatus(quoteId, 'Declined', reason);
          State.showToast(`Bid declined. The supplier and Super Admin have been officially notified.`, 'info');
          this.close();
          if (State.currentView === 'dashboard') App.navigate('dashboard', rfq.schoolId);
          else if (State.currentView === 'suppliers') App.navigate('suppliers');
          else if (State.currentView === 'admin') App.navigate('admin');
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      };
    });
  },

  openLPOModal(lpo) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 780px;">
        <div class="modal-header" style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #fff;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em;">
              Republic of Ghana • Official Procurement Voucher
            </div>
            <h3 class="modal-title" style="color: #fff; margin: 0.2rem 0 0 0;">
              Local Purchase Order (LPO): ${lpo.lpoNumber}
            </h3>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #fff;">&times;</button>
        </div>

        <div class="modal-body" id="printable-lpo-area" style="padding: 1.75rem;">
          <!-- School & Accreditation Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.25rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">${lpo.schoolName}</div>
              <div style="font-size: 0.85rem; color: #475569;">📍 ${lpo.schoolAddress}</div>
              <div style="font-size: 0.82rem; color: #64748b;">📞 ${lpo.schoolPhone} • ✉️ ${lpo.schoolEmail}</div>
              <div style="margin-top: 0.4rem;">
                <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.75rem;">
                  🛡️ NaSIA Accreditation: ${lpo.nasiaLicense}
                </span>
              </div>
            </div>
            <div style="text-align: right; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 1rem;">
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">LPO Reference</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; font-family: monospace;">${lpo.lpoNumber}</div>
              <div style="font-size: 0.78rem; color: #64748b;">Date: ${new Date(lpo.createdAt).toLocaleDateString()}</div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #059669; margin-top: 0.2rem;">Status: ${lpo.paymentStatus}</div>
            </div>
          </div>

          <!-- Supplier & Delivery Meta -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; font-size: 0.86rem;">
            <div>
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem;">Awarded Vendor / Supplier</div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${lpo.supplierName}</div>
              <div style="color: #475569;">📞 ${lpo.supplierPhone}</div>
              <div style="color: #475569;">✉️ ${lpo.supplierEmail}</div>
              <div style="color: #64748b; font-size: 0.8rem;">📍 ${lpo.supplierAddress}</div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem;">Delivery & Contract Terms</div>
              <div><strong>Lead Time:</strong> ${lpo.deliveryLeadTime}</div>
              <div><strong>Target Deadline:</strong> ${lpo.deliveryDeadline}</div>
              <div><strong>Warranty Terms:</strong> ${lpo.warrantyTerms}</div>
              <div><strong>Issuing Authority:</strong> ${lpo.issuedBy}</div>
            </div>
          </div>

          <!-- Procurement Item Details -->
          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #1e3a8a; color: #fff; text-align: left;">
                <th style="padding: 0.75rem 1rem;">ITEM SPECIFICATION & SCOPE</th>
                <th style="padding: 0.75rem 1rem;">CATEGORY</th>
                <th style="padding: 0.75rem 1rem;">QUANTITY</th>
                <th style="padding: 0.75rem 1rem; text-align: right;">TOTAL VALUE</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: #fff; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 1rem;">
                  <div style="font-weight: 800; color: #0f172a;">${lpo.tenderTitle}</div>
                  <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">${lpo.specifications}</div>
                </td>
                <td style="padding: 1rem; color: #475569;">${lpo.category}</td>
                <td style="padding: 1rem; font-weight: 600; color: #0f172a;">${lpo.quantity}</td>
                <td style="padding: 1rem; text-align: right; font-weight: 800; font-size: 1.1rem; color: #059669;">
                  ${lpo.totalAmountFormatted}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Milestone Escrow Payment Schedule -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a;">
                🏦 Paystack MoMo Escrow Milestone Schedule
              </h4>
              <span class="badge" style="background: #f0fdf4; color: #166534; font-weight: 700; font-size: 0.75rem;">
                Protected Escrow
              </span>
            </div>
            <p style="font-size: 0.8rem; color: #64748b; margin: 0 0 1rem 0;">
              Funds are held securely and released in stages upon bursary authorization via MTN MoMo, Telecel Cash, or Bank Transfer.
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${lpo.milestones.map(m => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: ${m.status === 'Disbursed' ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${m.status === 'Disbursed' ? '#a7f3d0' : '#e2e8f0'}; border-radius: 8px; flex-wrap: wrap; gap: 0.75rem;">
                  <div>
                    <div style="font-weight: 700; color: #0f172a; font-size: 0.88rem;">
                      Milestone ${m.index}: ${m.name} (${m.percent}%)
                    </div>
                    <div style="font-size: 0.78rem; color: #64748b;">
                      ${m.status === 'Disbursed' ? `✓ Disbursed on ${new Date(m.disbursedAt).toLocaleDateString()} (Ref: ${m.transactionRef})` : 'Awaiting bursary authorization'}
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-weight: 800; color: ${m.status === 'Disbursed' ? '#059669' : '#0f172a'}; font-size: 1rem;">
                      ${m.amountFormatted}
                    </span>
                    ${m.status === 'Disbursed' ? `
                      <span class="badge badge-emerald" style="font-size: 0.75rem;">✓ Disbursed</span>
                    ` : `
                      <button class="btn-pill btn-gold btn-disburse-milestone" data-lpo-id="${lpo.id}" data-milestone-index="${m.index}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                        <span>💰</span> Disburse Advance via MoMo
                      </button>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Dual Legal Signature Blocks -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-top: 1px dashed #cbd5e1; padding-top: 1.25rem; font-size: 0.8rem; color: #475569;">
            <div>
              <div style="font-weight: 700; color: #1e3a8a; margin-bottom: 2rem;">FOR AND ON BEHALF OF SCHOOL:</div>
              <div style="border-bottom: 1px solid #94a3b8; width: 80%; margin-bottom: 0.3rem;"></div>
              <div>Authorized Signatory (Head of School / Bursar)</div>
              <div style="color: #94a3b8; font-size: 0.75rem;">Official School Seal Affixed</div>
            </div>
            <div>
              <div style="font-weight: 700; color: #059669; margin-bottom: 2rem;">ACCEPTED & CONFIRMED BY SUPPLIER:</div>
              <div style="border-bottom: 1px solid #94a3b8; width: 80%; margin-bottom: 0.3rem;"></div>
              <div>Managing Director / Operations Lead</div>
              <div style="color: #94a3b8; font-size: 0.75rem;">Verified Vendor Stamp Affixed</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-pill btn-outline" id="btn-print-lpo">
            <span>🖨️</span> Print / Save PDF
          </button>
          <button type="button" class="btn-pill btn-secondary" id="btn-close-lpo-modal">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-lpo-modal').onclick = () => this.close();
    document.getElementById('btn-print-lpo').onclick = () => window.print();

    // Disburse milestone buttons
    document.querySelectorAll('.btn-disburse-milestone').forEach(btn => {
      btn.onclick = async () => {
        const lpoId = btn.dataset.lpoId;
        const milestoneIndex = btn.dataset.milestoneIndex;
        if (!confirm(`Authorize Paystack Mobile Money release of Milestone ${milestoneIndex} to supplier?\n\nThis will trigger an SMS confirmation via Hubtel and official payment voucher via Resend.`)) return;

        btn.disabled = true;
        btn.innerText = 'Disbursing...';
        try {
          const res = await API.disburseLPOMilestone(lpoId, milestoneIndex, 'MTN Mobile Money');
          State.showToast(`✓ Milestone ${milestoneIndex} payment successfully released! SMS & Email voucher dispatched.`, 'success');
          this.openLPOModal(res.lpo);
        } catch (err) {
          btn.disabled = false;
          btn.innerText = '💰 Disburse Advance via MoMo';
          State.showToast(err.message, 'error');
        }
      };
    });
  },

  openApplyJobModal(job) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Teacher Application</div>
            <h3 class="modal-title">${job.title}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-apply-job" class="modal-body">
          <div style="background: var(--primary-50); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="font-size: 0.82rem; color: var(--primary-700); font-weight: 700;">${job.schoolName} • ${job.suburb}, ${job.region}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${job.curriculum} • Salary: ${job.salaryRange}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="app-name" class="form-input" placeholder="e.g. Kwabena Asante Mensah" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone & WhatsApp *</label>
            <input type="tel" id="app-phone" class="form-input" placeholder="+233 24 000 0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" id="app-email" class="form-input" placeholder="kwabena@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Highest Teaching Qualification *</label>
            <select id="app-qual" class="form-select" required>
              <option value="B.Ed (Education / Subject)">B.Ed (Education / Subject)</option>
              <option value="BSc / BA + Post-Graduate Diploma">BSc / BA + Post-Graduate Diploma in Education</option>
              <option value="Cambridge / International Certified">Cambridge / International Certified</option>
              <option value="Montessori Diploma (AMI/MCI)">Montessori Diploma (AMI/MCI)</option>
              <option value="Diploma in Basic Education (DBE)">Diploma in Basic Education (DBE)</option>
              <option value="Master of Education (M.Ed / M.Phil)">Master of Education (M.Ed / M.Phil)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Years of Classroom Experience *</label>
            <input type="number" id="app-exp" class="form-input" placeholder="e.g. 4" required />
          </div>
          <div class="form-group">
            <label class="form-label">Cover Summary & Subject Competencies</label>
            <textarea id="app-notes" class="form-textarea" rows="3" placeholder="Briefly describe your exam preparation record or early childhood methodologies."></textarea>
          </div>
          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-apply">Cancel</button>
            <button type="submit" class="btn-pill btn-primary">Submit Application</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-apply').onclick = () => this.close();

    document.getElementById('form-apply-job').onsubmit = async (e) => {
      e.preventDefault();
      const applicantName = document.getElementById('app-name').value;
      const phone = document.getElementById('app-phone').value;
      const email = document.getElementById('app-email').value;
      const qualification = document.getElementById('app-qual').value;
      const yearsExperience = document.getElementById('app-exp').value;
      const notes = document.getElementById('app-notes').value;

      try {
        await API.applyJob(job.id, { applicantName, phone, email, qualification, yearsExperience, notes });
        this.close();
        State.showToast(`Application successfully sent to ${job.schoolName}!`, 'success');
        if (State.currentView === 'jobs') App.navigate('jobs');
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openListSchoolModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">For School Administrators</div>
            <h3 class="modal-title">Register Your School</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-list-school" class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Join Ghana's verified school directory. Get discovered by thousands of parents in Accra & Kumasi.
          </p>
          <div class="form-group">
            <label class="form-label">School Name *</label>
            <input type="text" id="sch-name" class="form-input" placeholder="e.g. Jack & Jill International School" required />
          </div>
          <div class="form-group">
            <label class="form-label">Motto / Slogan</label>
            <input type="text" id="sch-motto" class="form-input" placeholder="e.g. Integrity & Academic Distinction" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Region *</label>
              <select id="sch-region" class="form-select" required>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti">Ashanti (Kumasi)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Suburb / Town *</label>
              <input type="text" id="sch-suburb" class="form-input" placeholder="e.g. East Legon / Ahodwo" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Curriculum Offered *</label>
            <select id="sch-curriculum" class="form-select" required>
              <option value="GES Standards-based">GES Standards-based</option>
              <option value="Cambridge (CIE)">Cambridge (CIE / IGCSE / A-Levels)</option>
              <option value="Montessori">Montessori Early Childhood</option>
              <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
              <option value="Dual (GES + Cambridge)">Dual (GES + Cambridge)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Boarding Option *</label>
              <select id="sch-boarding" class="form-select" required>
                <option value="Day Only">Day Only</option>
                <option value="Day & Boarding">Day & Boarding</option>
                <option value="Boarding Only">Boarding Only</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Fee Band *</label>
              <select id="sch-feeband" class="form-select" required>
                <option value="Budget (Under GH₵ 1,500)">Budget (Under GH₵ 1,500/term)</option>
                <option value="Moderate (GH₵ 1,500 - 4,000)">Moderate (GH₵ 1,500 - 4,000/term)</option>
                <option value="Premium (GH₵ 4,000 - 10,000)">Premium (GH₵ 4,000 - 10,000/term)</option>
                <option value="International / Elite (GH₵ 10,000+)">International / Elite (GH₵ 10,000+)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Admissions WhatsApp Number *</label>
            <input type="tel" id="sch-wa" class="form-input" placeholder="+233 24 000 0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Admissions Email *</label>
            <input type="email" id="sch-email" class="form-input" placeholder="admissions@school.edu.gh" required />
          </div>
          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-school">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Register & Submit for Verification</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-school').onclick = () => this.close();

    document.getElementById('form-list-school').onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('sch-name').value;
      const motto = document.getElementById('sch-motto').value;
      const region = document.getElementById('sch-region').value;
      const suburb = document.getElementById('sch-suburb').value;
      const curriculum = [document.getElementById('sch-curriculum').value];
      const boardingType = document.getElementById('sch-boarding').value;
      const feeBand = document.getElementById('sch-feeband').value;
      const whatsapp = document.getElementById('sch-wa').value;
      const email = document.getElementById('sch-email').value;

      try {
        const newSchool = await API.createSchool({
          name,
          motto,
          region,
          district: region === 'Greater Accra' ? 'Accra Metropolitan' : 'Kumasi Metropolitan',
          suburb,
          address: `${suburb}, ${region}, Ghana`,
          curriculum,
          boardingType,
          feeBand,
          whatsapp,
          phone: whatsapp,
          email,
          description: `${name} is dedicated to academic excellence and student character development located in ${suburb}, ${region}.`
        });
        this.close();
        State.showToast(`School listed successfully!`, 'success');
        App.navigate('school-detail', newSchool.id);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openTeacherSubscribeModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Teacher & Tutor Network</div>
            <h3 class="modal-title">Subscribe as an Educator</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-teacher-subscribe" class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Join Ghana's verified educator directory. Get discovered by parents seeking home tutors and schools hiring teachers in Accra & Kumasi.
          </p>

          <div class="form-group">
            <label class="form-label">Full Name & Title *</label>
            <input type="text" id="tch-name" class="form-input" placeholder="e.g. Mr. Samuel K. Appiah, M.Sc." required />
          </div>

          <div class="form-group">
            <label class="form-label">Professional Headline *</label>
            <input type="text" id="tch-headline" class="form-input" placeholder="e.g. Cambridge IGCSE & A-Level Pure Mathematics Specialist" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Primary Subject / Field *</label>
              <input type="text" id="tch-primary-subject" class="form-input" placeholder="e.g. Mathematics, French, Phonics, Robotics" required />
            </div>
            <div class="form-group">
              <label class="form-label">Other Subjects Handled</label>
              <input type="text" id="tch-other-subjects" class="form-input" placeholder="e.g. Further Maths, Physics" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Curriculum Expertise *</label>
              <select id="tch-curriculum" class="form-select" required>
                <option value="Cambridge (CIE)">Cambridge (CIE / IGCSE / A-Levels)</option>
                <option value="GES Standards-based">GES Standards-based (BECE / WASSCE)</option>
                <option value="Montessori">Montessori Early Childhood</option>
                <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
                <option value="STEM / Coding Curriculum">STEM / Coding Curriculum</option>
                <option value="Dual (GES + Cambridge)">Dual (GES + Cambridge)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Primary Grade Level Handled *</label>
              <select id="tch-level" class="form-select" required>
                <option value="SHS">Senior High School (SHS / A-Levels)</option>
                <option value="JHS">Junior High School (JHS / BECE)</option>
                <option value="Primary">Primary (Class 1-6)</option>
                <option value="Kindergarten">Nursery & Kindergarten</option>
                <option value="Crèche">Crèche / Toddler Care</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Region *</label>
              <select id="tch-region" class="form-select" required>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti">Ashanti (Kumasi)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Suburb / Enclave *</label>
              <input type="text" id="tch-suburb" class="form-input" placeholder="e.g. East Legon / Ahodwo" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Teaching Mode *</label>
              <select id="tch-mode" class="form-select" required>
                <option value="Home Tutoring">Home Tutoring (In-Person)</option>
                <option value="Online Lessons">Online Lessons</option>
                <option value="Full-time School Contract">Full-time School Contract</option>
                <option value="Home Tutoring & Online">Home Tutoring & Online</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Hourly Tutoring Rate or Salary</label>
              <input type="text" id="tch-rate" class="form-input" placeholder="e.g. GH₵ 100 / hour or Negotiable" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">WhatsApp Number *</label>
              <input type="tel" id="tch-wa" class="form-input" placeholder="+233 24 000 0000" required />
            </div>
            <div class="form-group">
              <label class="form-label">Phone Line</label>
              <input type="tel" id="tch-phone" class="form-input" placeholder="+233 24 000 0000" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Highest Qualification & NTC License (Optional)</label>
            <input type="text" id="tch-qual" class="form-input" placeholder="e.g. B.Ed Mathematics, UCC (NTC Reg: NTC-ED-449102)" />
          </div>

          <div class="form-group">
            <label class="form-label">Bio & Examination Track Record</label>
            <textarea id="tch-bio" class="form-textarea" rows="3" placeholder="Briefly describe your teaching philosophy, examination track record (e.g. BECE Grade 1s or IGCSE A*s), and teaching approach."></textarea>
          </div>

          <!-- Subscription Tier Selection -->
          <div style="background: var(--primary-50); border: 1.5px solid var(--primary-100); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem;">Select Your Educator Visibility Tier:</div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
              <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                <input type="radio" name="tch-tier" value="Featured Pro" checked style="margin-top: 0.2rem;" />
                <div>
                  <strong style="color: var(--gold-700);">Featured Pro Educator (Recommended)</strong>
                  <div style="color: var(--text-muted); font-size: 0.8rem;">Top of search placement, direct WhatsApp click-to-chat button for parents, and Verified Pro badge.</div>
                </div>
              </label>
              <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                <input type="radio" name="tch-tier" value="Standard" style="margin-top: 0.2rem;" />
                <div>
                  <strong>Standard Educator Profile (Free)</strong>
                  <div style="color: var(--text-muted); font-size: 0.8rem;">Listed in general search directory.</div>
                </div>
              </label>
            </div>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-tch">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Publish Educator Profile</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-tch').onclick = () => this.close();

    document.getElementById('form-teacher-subscribe').onsubmit = async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('tch-name').value;
      const headline = document.getElementById('tch-headline').value;
      const primarySubject = document.getElementById('tch-primary-subject').value.trim();
      const otherSubjects = document.getElementById('tch-other-subjects').value.trim();
      const subjects = [primarySubject];
      if (otherSubjects) {
        otherSubjects.split(',').forEach(s => {
          if (s.trim()) subjects.push(s.trim());
        });
      }

      const curriculum = document.getElementById('tch-curriculum').value;
      const level = document.getElementById('tch-level').value;
      const region = document.getElementById('tch-region').value;
      const suburb = document.getElementById('tch-suburb').value;
      const teachingMode = document.getElementById('tch-mode').value;
      const rate = document.getElementById('tch-rate').value || "Negotiable";
      const whatsapp = document.getElementById('tch-wa').value;
      const phone = document.getElementById('tch-phone').value || whatsapp;
      const qualification = document.getElementById('tch-qual').value;
      const bio = document.getElementById('tch-bio').value;
      const subscriptionTier = document.querySelector('input[name="tch-tier"]:checked').value;

      try {
        const newTeacher = await API.subscribeTeacher({
          fullName,
          headline,
          subjects,
          curricula: [curriculum],
          levels: [level],
          region,
          suburb,
          teachingModes: [teachingMode],
          rate,
          whatsapp,
          phone,
          qualification,
          bio,
          subscriptionTier
        });
        this.close();

        if (subscriptionTier === 'Featured Pro') {
          Modals.openPaystackCheckoutModal({
            amount: 350,
            purpose: 'teacher_subscription',
            targetId: newTeacher.id,
            targetTitle: `Featured Pro Educator Subscription - ${fullName}`,
            payerName: fullName,
            payerPhone: phone,
            onSuccess: () => {
              State.showToast(`Congratulations ${fullName}! Your Featured Pro badge is active.`, 'success');
              if (State.currentView === 'jobs') App.navigate('jobs');
            }
          });
        } else {
          State.showToast(`Profile published! You are now searchable as an educator on SkoolFinder.`, 'success');
          if (State.currentView === 'jobs') App.navigate('jobs');
        }
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openContactTeacherModal(teacher) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Hire Educator / Tutor</div>
            <h3 class="modal-title">Contact ${teacher.fullName}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--primary-50); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="font-weight: 700; color: var(--primary-900);">${teacher.headline}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              📍 ${teacher.suburb}, ${teacher.region} • Rate: <strong>${teacher.rate}</strong>
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Connect with ${teacher.fullName} directly via WhatsApp or phone to discuss home tutoring schedules, trial lessons, or school placement.
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button id="btn-modal-tch-wa" class="reveal-contact-btn btn-reveal-whatsapp" style="width: 100%;">
              <span>💬</span> Chat on WhatsApp (${teacher.whatsapp})
            </button>
            <a href="tel:${teacher.phone.replace(/[^0-9+]/g, '')}" id="btn-modal-tch-call" class="reveal-contact-btn btn-reveal-call" style="width: 100%;">
              <span>📞</span> Call Direct (${teacher.phone})
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();

    document.getElementById('btn-modal-tch-wa').onclick = async () => {
      await API.recordTeacherLead(teacher.id, 'whatsapp');
      const cleanWa = teacher.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanWa}?text=Hello%20${encodeURIComponent(teacher.fullName)},%20I%20found%20your%20educator%20profile%20on%20SkoolFinder%20Ghana.%20I%20am%20interested%20in%20discussing%20tutoring/teaching.`, '_blank');
      this.close();
      State.showToast("Connected to educator on WhatsApp!", "success");
    };
  },

  // Mobile Money & Card Paystack Checkout Engine (Feature 1)
  openPaystackCheckoutModal(options = {}) {
    this.close();
    const amount = Number(options.amount) || 350;
    const purpose = options.purpose || 'subscription';
    const targetTitle = options.targetTitle || 'SkoolFinder Premium Service';
    const payerName = options.payerName || '';
    const payerPhone = options.payerPhone || '';
    const targetId = options.targetId || null;

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog paystack-modal" style="max-width: 480px; padding: 0; overflow: hidden; border-radius: 16px; box-shadow: var(--shadow-xl); border: 1px solid rgba(255, 255, 255, 0.2);">
        
        <!-- Paystack Top Bar -->
        <div class="paystack-top-bar" style="background: #0a1128; color: #fff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--gold-500);">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="background: var(--gold-500); color: #0a1128; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem;">
              ⚡
            </div>
            <div>
              <div style="font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--gold-400); font-weight: 700;">Secured MoMo & Card Checkout</div>
              <div style="font-weight: 800; font-size: 1.05rem; font-family: var(--font-heading); color: #fff;">SkoolFinder Ghana</div>
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #94a3b8; font-size: 1.5rem; background: none; border: none; cursor: pointer;">&times;</button>
        </div>

        <!-- Checkout Body Container -->
        <div id="checkout-content-container" style="background: #ffffff; padding: 1.5rem;">
          
          <!-- Amount Header Box -->
          <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Payment For</div>
              <div style="font-weight: 700; color: var(--primary-900); font-size: 0.95rem;">${targetTitle}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Amount Due</div>
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--emerald-600); font-family: var(--font-heading);">
                GH₵ ${amount.toFixed(2)}
              </div>
            </div>
          </div>

          <!-- Payment Channel Tabs -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
            <button type="button" id="tab-momo" class="paystack-tab-btn active" style="flex: 1; padding: 0.6rem 0.5rem; font-size: 0.85rem; font-weight: 700; background: var(--primary-50); color: var(--primary-900); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; border: 1px solid var(--primary-600);">
              <span>📱</span> Mobile Money
            </button>
            <button type="button" id="tab-card" class="paystack-tab-btn" style="flex: 1; padding: 0.6rem 0.5rem; font-size: 0.85rem; font-weight: 700; background: #fff; color: var(--text-muted); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; border: 1px solid var(--border-light);">
              <span>💳</span> Visa / Card
            </button>
          </div>

          <!-- Channel View: Mobile Money Form -->
          <div id="channel-momo-view">
            <div style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem;">Select Mobile Network</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                <label id="net-btn-mtn" style="border: 2px solid var(--gold-500); background: var(--gold-50); border-radius: 8px; padding: 0.6rem 0.4rem; text-align: center; cursor: pointer; display: block; transition: var(--transition-fast);">
                  <input type="radio" name="momo-net" value="MTN MoMo" checked style="display: none;" />
                  <div style="font-size: 1.1rem;">🟡</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #78350f;">MTN MoMo</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">*170#</div>
                </label>
                <label id="net-btn-telecel" style="border: 1px solid var(--border-light); background: #fff; border-radius: 8px; padding: 0.6rem 0.4rem; text-align: center; cursor: pointer; display: block; transition: var(--transition-fast);">
                  <input type="radio" name="momo-net" value="Telecel Cash" style="display: none;" />
                  <div style="font-size: 1.1rem;">🔴</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #991b1b;">Telecel</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">*110#</div>
                </label>
                <label id="net-btn-at" style="border: 1px solid var(--border-light); background: #fff; border-radius: 8px; padding: 0.6rem 0.4rem; text-align: center; cursor: pointer; display: block; transition: var(--transition-fast);">
                  <input type="radio" name="momo-net" value="AT Money" style="display: none;" />
                  <div style="font-size: 1.1rem;">🔵</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #1e40af;">AT Money</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">*110#</div>
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0.9rem;">
              <label class="form-label" style="font-size: 0.8rem;">Mobile Money Phone Number *</label>
              <input type="tel" id="pay-momo-phone" class="form-input" placeholder="e.g. 024 400 0000" value="${payerPhone || '0244123456'}" required style="font-size: 1rem; font-weight: 600; letter-spacing: 0.05em;" />
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.8rem;">Subscriber Full Name *</label>
              <input type="text" id="pay-momo-name" class="form-input" placeholder="e.g. Kwame Mensah" value="${payerName || 'Kwame Mensah'}" required />
            </div>

            <button type="button" id="btn-submit-momo-pay" class="btn-pill" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 800; background: var(--emerald-600); color: #fff; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">
              <span>⚡</span> Authorize GH₵ ${amount.toFixed(2)} via MoMo
            </button>
          </div>

          <!-- Channel View: Card Form -->
          <div id="channel-card-view" style="display: none;">
            <div class="form-group" style="margin-bottom: 0.8rem;">
              <label class="form-label" style="font-size: 0.8rem;">Card Number</label>
              <input type="text" id="pay-card-num" class="form-input" placeholder="4123 •••• •••• 9012" value="4123 4567 8901 2345" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.8rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Expires</label>
                <input type="text" id="pay-card-exp" class="form-input" placeholder="MM/YY" value="09/28" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.8rem;">CVV</label>
                <input type="password" id="pay-card-cvv" class="form-input" placeholder="123" value="882" maxlength="3" />
              </div>
            </div>
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.8rem;">Cardholder Name</label>
              <input type="text" id="pay-card-name" class="form-input" placeholder="e.g. Vivian Mensah" value="${payerName || 'Kwame Mensah'}" />
            </div>
            <button type="button" id="btn-submit-card-pay" class="btn-pill" style="width: 100%; padding: 0.85rem; font-size: 1rem; font-weight: 800; background: var(--primary-900); color: #fff; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>🔒</span> Pay GH₵ ${amount.toFixed(2)} with Card
            </button>
          </div>

          <!-- Security Footnote -->
          <div style="margin-top: 1.25rem; font-size: 0.72rem; color: var(--text-light); text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            <span>🛡️</span> Bank of Ghana & GhIPSS Compliant. Encrypted 256-bit TLS Gateway.
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();

    // Tab switcher
    const tabMoMo = document.getElementById('tab-momo');
    const tabCard = document.getElementById('tab-card');
    const momoView = document.getElementById('channel-momo-view');
    const cardView = document.getElementById('channel-card-view');

    tabMoMo.onclick = () => {
      tabMoMo.style.background = 'var(--primary-50)';
      tabMoMo.style.borderColor = 'var(--primary-600)';
      tabMoMo.style.color = 'var(--primary-900)';
      tabCard.style.background = '#fff';
      tabCard.style.borderColor = 'var(--border-light)';
      tabCard.style.color = 'var(--text-muted)';
      momoView.style.display = 'block';
      cardView.style.display = 'none';
    };

    tabCard.onclick = () => {
      tabCard.style.background = 'var(--primary-50)';
      tabCard.style.borderColor = 'var(--primary-600)';
      tabCard.style.color = 'var(--primary-900)';
      tabMoMo.style.background = '#fff';
      tabMoMo.style.borderColor = 'var(--border-light)';
      tabMoMo.style.color = 'var(--text-muted)';
      cardView.style.display = 'block';
      momoView.style.display = 'none';
    };

    // Network selector UI feedback
    const netRadios = document.querySelectorAll('input[name="momo-net"]');
    netRadios.forEach(r => {
      r.onchange = () => {
        ['net-btn-mtn', 'net-btn-telecel', 'net-btn-at'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.border = '1px solid var(--border-light)';
            el.style.background = '#fff';
          }
        });
        const parent = r.closest('label');
        if (parent) {
          parent.style.border = '2px solid var(--gold-500)';
          parent.style.background = 'var(--gold-50)';
        }
      };
    });

    const triggerPaymentFlow = async (channelType) => {
      const container = document.getElementById('checkout-content-container');
      const network = channelType === 'card' ? 'Visa / Mastercard' : (document.querySelector('input[name="momo-net"]:checked')?.value || 'MTN MoMo');
      const phone = document.getElementById('pay-momo-phone')?.value || payerPhone || '0244000000';
      const name = document.getElementById('pay-momo-name')?.value || payerName || 'Valued Subscriber';

      // 1. Initialize Payment
      let initTx;
      try {
        const res = await API.initializePayment({
          amount,
          purpose,
          payerName: name,
          payerPhone: phone,
          network,
          targetId,
          targetTitle
        });
        initTx = res.transaction;
      } catch (err) {
        State.showToast("Failed to initiate payment: " + err.message, "error");
        return;
      }

      // 2. Render Prompt Simulation Screen
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 70px; height: 70px; margin: 0 auto 1.25rem; background: var(--gold-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; animation: pulse-dot 1.2s infinite;">
            📲
          </div>
          <h3 style="font-family: var(--font-heading); color: var(--primary-900); font-size: 1.25rem; margin-bottom: 0.5rem;">
            Authorizing with ${network}...
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; max-width: 360px; margin-left: auto; margin-right: auto;">
            A debit prompt of <strong style="color: var(--primary-900);">GH₵ ${amount.toFixed(2)}</strong> has been sent to <strong>${phone}</strong>.
            Please approve the prompt on your mobile phone or dial <strong>${network.includes('Telecel') ? '*110#' : '*170#'}</strong>.
          </p>
          <div style="background: #f1f5f9; border-radius: 9999px; height: 6px; width: 80%; margin: 0 auto 1rem; overflow: hidden;">
            <div style="background: var(--emerald-500); height: 100%; width: 100%; animation: shimmer 2s infinite linear;"></div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-light);">
            Reference: <span style="font-family: monospace; font-weight: 700;">${initTx.reference}</span>
          </div>
        </div>
      `;

      // 3. Simulate Prompt Confirmation after 2.5 seconds
      setTimeout(async () => {
        try {
          const verifyRes = await API.verifyPayment(initTx.reference, { network });
          const tx = verifyRes.transaction;

          // 4. Render SkoolFinder Official Electronic Receipt
          container.innerHTML = `
            <div class="official-receipt-card" style="padding: 1rem 0.5rem; text-align: center;">
              
              <div style="width: 60px; height: 60px; background: var(--emerald-100); color: var(--emerald-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem;">
                ✓
              </div>

              <div style="font-size: 0.75rem; font-weight: 800; color: var(--emerald-600); text-transform: uppercase; letter-spacing: 0.05em;">Payment Confirmed & Verified</div>
              <h3 style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--primary-900); margin-bottom: 0.25rem;">
                Official Electronic Receipt
              </h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                Receipt No: <strong style="color: var(--primary-800);">${tx.receiptNumber}</strong>
              </div>

              <!-- Receipt Box -->
              <div style="background: #f8fafc; border: 1px dashed var(--border-light); border-radius: 12px; padding: 1rem 1.25rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-muted);">Paid To:</span>
                  <strong style="color: var(--primary-900);">SkoolFinder Ghana</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-muted);">Purpose:</span>
                  <span style="font-weight: 600; color: var(--primary-900); text-align: right; max-width: 60%;">${tx.targetTitle}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-muted);">Payment Channel:</span>
                  <strong style="color: var(--primary-900);">${tx.network} (${tx.payerPhone || phone})</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-muted);">Date & Time:</span>
                  <span style="color: var(--text-muted);">${new Date(tx.completedAt || tx.timestamp).toLocaleString('en-GB')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-light); padding-top: 0.6rem; margin-top: 0.6rem;">
                  <span style="font-weight: 700; color: var(--primary-900);">Total Paid:</span>
                  <span style="font-size: 1.2rem; font-weight: 900; color: var(--emerald-600); font-family: var(--font-heading);">
                    GH₵ ${tx.amount.toFixed(2)}
                  </span>
                </div>
                ${tx.voucherCode ? `
                  <div style="background: var(--gold-50); border: 1px solid var(--gold-400); border-radius: 8px; padding: 0.6rem; margin-top: 0.75rem; text-align: center;">
                    <div style="font-size: 0.7rem; color: #78350f; font-weight: 700;">OFFICIAL APPLICATION VOUCHER CODE</div>
                    <div style="font-size: 1.15rem; font-weight: 900; letter-spacing: 0.1em; color: #92400e;">${tx.voucherCode}</div>
                  </div>
                ` : ''}
              </div>

              <!-- Actions -->
              <div style="display: flex; gap: 0.75rem;">
                <button type="button" class="btn-pill btn-outline" style="flex: 1;" onclick="window.print()">
                  🖨️ Print Receipt
                </button>
                <button type="button" class="btn-pill btn-emerald" id="btn-receipt-finish" style="flex: 1;">
                  Done & Continue
                </button>
              </div>

            </div>
          `;

          document.getElementById('btn-receipt-finish').onclick = () => {
            Modals.close();
            State.showToast(`Payment of GH₵ ${tx.amount} verified! ${tx.targetTitle} is now active.`, 'success');
            if (options.onSuccess) {
              options.onSuccess(tx);
            } else {
              App.refreshCurrentView();
            }
          };

        } catch (verifyErr) {
          container.innerHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
              <h3 style="color: var(--rose-600); font-family: var(--font-heading); margin-bottom: 0.5rem;">Payment Verification Issue</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem;">${verifyErr.message}</p>
              <button class="btn-pill btn-outline" onclick="Modals.close()">Close</button>
            </div>
          `;
        }
      }, 2400);
    };

    document.getElementById('btn-submit-momo-pay').onclick = () => triggerPaymentFlow('momo');
    document.getElementById('btn-submit-card-pay').onclick = () => triggerPaymentFlow('card');
  },

  // Post Teaching Vacancy Modal (For Schools & Principals)
  openPostJobModal(prefill = {}) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Teacher Recruitment</div>
            <h3 class="modal-title">Post Teaching Vacancy</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-post-job" class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Advertise your school's teaching vacancy to certified educators across Ghana.
          </p>

          <div class="form-group">
            <label class="form-label">School / Institution Name *</label>
            <input type="text" id="job-school" class="form-input" placeholder="e.g. Roman Ridge School" value="${prefill.schoolName || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Job Title / Vacancy *</label>
            <input type="text" id="job-title" class="form-input" placeholder="e.g. Cambridge IGCSE Physics & Maths Teacher" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Subject / Field *</label>
              <select id="job-subject" class="form-select" required>
                <option value="Mathematics">Mathematics</option>
                <option value="Integrated Science">Integrated Science / Physics / Chem</option>
                <option value="English Language & Literature">English Language & Literature</option>
                <option value="French">French Language</option>
                <option value="Computing & Robotics">Computing, ICT & Robotics</option>
                <option value="Early Childhood / Phonics">Early Childhood / Montessori</option>
                <option value="Special Needs (SEN)">Special Educational Needs (SEN)</option>
                <option value="Business Studies">Business Studies / Accounting</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Curriculum *</label>
              <select id="job-curriculum" class="form-select" required>
                <option value="Cambridge (CIE)">Cambridge (CIE / IGCSE)</option>
                <option value="GES Standards-based">GES Standards-based</option>
                <option value="Montessori">Montessori</option>
                <option value="International Baccalaureate (IB)">International Baccalaureate (IB)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Grade Level *</label>
              <select id="job-level" class="form-select" required>
                <option value="Primary">Primary School (Class 1-6)</option>
                <option value="JHS">Junior High School (JHS)</option>
                <option value="SHS">Senior High School (SHS / IGCSE)</option>
                <option value="Preschool">Preschool & Kindergarten</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Employment Type *</label>
              <select id="job-type" class="form-select" required>
                <option value="Full-Time Contract">Full-Time Contract</option>
                <option value="Part-Time / Visiting">Part-Time / Visiting</option>
                <option value="Term Contract">Term Contract</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Region *</label>
              <select id="job-region" class="form-select" required>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti">Ashanti (Kumasi)</option>
                <option value="Central">Central</option>
                <option value="Eastern">Eastern</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Campus Suburb *</label>
              <input type="text" id="job-suburb" class="form-input" placeholder="e.g. Cantonments, East Legon" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Monthly Salary Range</label>
              <input type="text" id="job-salary" class="form-input" placeholder="e.g. GH₵ 3,000 - 4,500 / month" value="Competitive / Negotiable" />
            </div>
            <div class="form-group">
              <label class="form-label">HR / Admissions WhatsApp</label>
              <input type="tel" id="job-wa" class="form-input" placeholder="e.g. +233 24 400 0000" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Requirements & Candidate Profile</label>
            <textarea id="job-desc" class="form-textarea" rows="3" placeholder="e.g. Bachelor in Mathematics/Education, minimum 3 years Cambridge IGCSE experience. NTC license preferred." required></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-post-job">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Publish Teaching Vacancy</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-post-job').onclick = () => this.close();

    document.getElementById('form-post-job').onsubmit = async (e) => {
      e.preventDefault();
      const schoolName = document.getElementById('job-school').value;
      const title = document.getElementById('job-title').value;
      const subject = document.getElementById('job-subject').value;
      const curriculum = document.getElementById('job-curriculum').value;
      const level = document.getElementById('job-level').value;
      const employmentType = document.getElementById('job-type').value;
      const region = document.getElementById('job-region').value;
      const suburb = document.getElementById('job-suburb').value;
      const salaryRange = document.getElementById('job-salary').value;
      const whatsapp = document.getElementById('job-wa').value;
      const description = document.getElementById('job-desc').value;

      try {
        await API.createJob({
          schoolName,
          title,
          subject,
          curriculum,
          level,
          employmentType,
          region,
          suburb,
          salaryRange,
          whatsapp,
          description,
          postedDate: "Just now"
        });
        this.close();
        State.showToast(`Teaching vacancy "${title}" successfully published!`, 'success');
        if (State.currentView === 'jobs') App.navigate('jobs');
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Register Supplier Modal (For B2B Vendors)
  openRegisterSupplierModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">B2B Marketplace</div>
            <h3 class="modal-title">Register as Certified School Supplier</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-register-supplier" class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            List your business in Ghana's school procurement directory and bid on verified institutional RFQs.
          </p>

          <div class="form-group">
            <label class="form-label">Business / Company Name *</label>
            <input type="text" id="sup-name" class="form-input" placeholder="e.g. Apex Educational Supplies Ghana Ltd" required />
          </div>

          <div class="form-group">
            <label class="form-label">Primary Supply Category *</label>
            <select id="sup-category" class="form-select" required>
              <option value="Books & Stationery">Books & Stationery (Textbooks, exercise books, art)</option>
              <option value="Furniture & Hardware">Furniture & Hardware (Dual desks, whiteboards, lockers)</option>
              <option value="Food & Catering">Food & Catering (Bulk rice, oil, canteen provisions)</option>
              <option value="IT / Software / Computers">IT / Software / Computers (Lab PCs, networking, tablets)</option>
              <option value="Uniforms & Textiles">Uniforms & Textiles (School uniforms, PE kits, badges)</option>
              <option value="Cleaning & Security">Cleaning & Security (Janitorial supplies, CCTV, safety)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Office / Warehouse Address in Ghana *</label>
            <input type="text" id="sup-address" class="form-input" placeholder="e.g. Plot 4B Spintex Road, Accra" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Official WhatsApp *</label>
              <input type="tel" id="sup-wa" class="form-input" placeholder="e.g. +233 24 100 0000" required />
            </div>
            <div class="form-group">
              <label class="form-label">Direct Phone Number</label>
              <input type="tel" id="sup-phone" class="form-input" placeholder="e.g. +233 30 200 0000" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Delivery Coverage Areas *</label>
            <select id="sup-coverage" class="form-select" required>
              <option value="Greater Accra, Ashanti">Greater Accra & Ashanti (Kumasi)</option>
              <option value="Greater Accra Only">Greater Accra Only</option>
              <option value="Ashanti Only">Ashanti (Kumasi) Only</option>
              <option value="Nationwide All 16 Regions">Nationwide (All 16 Regions)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Catalog Highlights / Wholesale Items</label>
            <input type="text" id="sup-catalog" class="form-input" placeholder="e.g. Dual desks, Teacher tables, Science lab stools" />
          </div>

          <div class="form-group">
            <label class="form-label">Company Overview</label>
            <textarea id="sup-desc" class="form-textarea" rows="2" placeholder="Describe your delivery speed, quality standards, and school supply experience." required></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-supplier">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Register Supplier Profile</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-supplier').onclick = () => this.close();

    document.getElementById('form-register-supplier').onsubmit = async (e) => {
      e.preventDefault();
      const companyName = document.getElementById('sup-name').value;
      const category = document.getElementById('sup-category').value;
      const address = document.getElementById('sup-address').value;
      const whatsapp = document.getElementById('sup-wa').value;
      const phone = document.getElementById('sup-phone').value || whatsapp;
      const coverage = [document.getElementById('sup-coverage').value];
      const rawCatalog = document.getElementById('sup-catalog').value;
      const catalogHighlights = rawCatalog ? rawCatalog.split(',').map(s => s.trim()) : ['Institutional Wholesale Supply'];
      const description = document.getElementById('sup-desc').value;

      try {
        await API.createSupplier({
          companyName,
          category,
          address,
          whatsapp,
          phone,
          coverage,
          catalogHighlights,
          description
        });
        this.close();
        State.showToast(`Supplier profile "${companyName}" registered in B2B directory!`, 'success');
        if (State.currentView === 'suppliers') App.navigate('suppliers');
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Inquire / Book Campus Tour Modal (For Parents)
  openInquireAdmissionModal(school) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Admissions Desk</div>
            <h3 class="modal-title">Inquire / Book Campus Tour</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <form id="form-inquire-admission" class="modal-body">
          <div style="background: var(--primary-50); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <div style="font-weight: 700; color: var(--primary-900);">${school.name}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">📍 ${school.suburb}, ${school.region} • ${school.admissionsStatus}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Parent / Guardian Full Name *</label>
            <input type="text" id="inq-parent-name" class="form-input" placeholder="e.g. Mr. Samuel Mensah" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">WhatsApp Number *</label>
              <input type="tel" id="inq-phone" class="form-input" placeholder="e.g. 024 400 0000" required />
            </div>
            <div class="form-group">
              <label class="form-label">Target Class / Grade *</label>
              <select id="inq-grade" class="form-select" required>
                <option value="Crèche / Nursery">Crèche / Nursery</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Primary (Class 1-6)" selected>Primary (Class 1-6)</option>
                <option value="JHS (Grade 7-9)">JHS (Grade 7-9)</option>
                <option value="SHS / IGCSE">Senior High (SHS / IGCSE)</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Target Entry Term</label>
              <select id="inq-term" class="form-select">
                <option value="Term 1 (September 2026)">Term 1 (September 2026)</option>
                <option value="Term 2 (January 2027)">Term 2 (January 2027)</option>
                <option value="Immediate Mid-Term">Immediate Mid-Term</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Campus Visit Date</label>
              <input type="date" id="inq-date" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specific Questions / Ward Needs</label>
            <textarea id="inq-notes" class="form-textarea" rows="2" placeholder="e.g. Inquiring about school bus pickup in East Legon and fee payment plans."></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-inquire">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Submit Official Inquiry</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-inquire').onclick = () => this.close();

    document.getElementById('form-inquire-admission').onsubmit = async (e) => {
      e.preventDefault();
      const parentName = document.getElementById('inq-parent-name').value;
      const phone = document.getElementById('inq-phone').value;
      const grade = document.getElementById('inq-grade').value;
      const term = document.getElementById('inq-term').value;
      const notes = document.getElementById('inq-notes').value;

      try {
        await API.recordLead(school.id, 'admission_inquiry');
        this.close();
        State.showToast(`Admissions inquiry sent to ${school.name}!`, 'success');
        
        // Connect to Admissions Desk on WhatsApp with prefilled message
        const cleanWa = school.whatsapp.replace(/[^0-9]/g, '');
        const msg = encodeURIComponent(`Hello ${school.name} Admissions, my name is ${parentName}. I just submitted an official admission inquiry on SkoolFinder Ghana regarding ${grade} (${term}). ${notes ? 'Note: ' + notes : ''}`);
        window.open(`https://wa.me/${cleanWa}?text=${msg}`, '_blank');
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openPricingModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 780px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Institutional Packages</div>
            <h3 class="modal-title">Transparent SkoolFinder Monetization & Pricing</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
            Elevate your institution’s visibility among thousands of parents and prospective students in Greater Accra and Kumasi. All paid plans include instant Mobile Money and Card checkout.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Free Tier -->
            <div style="background: var(--bg-main); border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge" style="background: #ffffff; color: var(--text-muted); margin-bottom: 0.5rem;">Standard</span>
                <h4 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-900); font-weight: 800; margin-bottom: 0.25rem;">Free Listing</h4>
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--primary-900); margin-bottom: 1rem;">GH₵ 0</div>
                <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem;">
                  <li>✓ Basic Campus Directory Entry</li>
                  <li>✓ Address & Suburb Location</li>
                  <li>✓ Standard Search Results</li>
                </ul>
              </div>
              <button class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.85rem;" id="btn-price-free">
                Current Active Tier
              </button>
            </div>

            <!-- Verified Campus Partner -->
            <div style="background: #ffffff; border: 2px solid var(--primary-600); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-md); position: relative;">
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary-600); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.75rem; border-radius: var(--radius-full); text-transform: uppercase;">
                Most Popular
              </div>
              <div>
                <span class="badge badge-verified" style="margin-bottom: 0.5rem;">🛡️ Verified Partner</span>
                <h4 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-900); font-weight: 800; margin-bottom: 0.25rem;">Verified Campus</h4>
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--primary-900); margin-bottom: 1rem;">GH₵ 1,200 <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">/ year</span></div>
                <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem;">
                  <li><strong style="color: var(--primary-900);">✓ GES Verified Trust Shield</strong></li>
                  <li><strong style="color: var(--primary-900);">✓ WhatsApp Click-to-Chat Leads</strong></li>
                  <li>✓ Real-Time Lead Analytics Dashboard</li>
                  <li>✓ Post Procurement RFQs to Suppliers</li>
                  <li>✓ Sell Digital Admission Vouchers</li>
                </ul>
              </div>
              <button class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-size: 0.85rem;" id="btn-price-verified">
                Upgrade with MoMo &rarr;
              </button>
            </div>

            <!-- Featured Spotlight -->
            <div style="background: var(--gold-50); border: 2px solid var(--gold-400); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span class="badge badge-gold" style="margin-bottom: 0.5rem;">⭐ Spotlight Tier</span>
                <h4 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-900); font-weight: 800; margin-bottom: 0.25rem;">Featured Leader</h4>
                <div style="font-size: 1.5rem; font-weight: 900; color: var(--primary-900); margin-bottom: 1rem;">GH₵ 2,500 <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-muted);">/ year</span></div>
                <ul style="font-size: 0.85rem; color: var(--text-muted); list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem;">
                  <li>✓ Top #1 Homepage Hero Showcase</li>
                  <li>✓ Priority Placement in Search</li>
                  <li>✓ Featured Badge on Directory Cards</li>
                  <li>✓ Priority Teacher Recruitment</li>
                  <li>✓ Dedicated Account Specialist</li>
                </ul>
              </div>
              <button class="btn-pill btn-gold" style="width: 100%; justify-content: center; font-size: 0.85rem;" id="btn-price-featured">
                Get Featured Spotlight &rarr;
              </button>
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1rem 1.25rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <strong>Are you a private tutor or subject teacher?</strong> Educator Pro placement is just <strong>GH₵ 150/year</strong>.
            </div>
            <button class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;" id="btn-price-educator">
              Subscribe as Educator
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-price-free').onclick = () => {
      this.close();
      App.navigate('directory');
    };

    document.getElementById('btn-price-verified').onclick = () => {
      this.close();
      this.openPaystackCheckoutModal({
        amount: 1200,
        purpose: 'school_premium',
        targetId: 'sch-gis-accra',
        targetTitle: 'Verified Campus Partner (Annual Subscription)',
        onSuccess: () => {
          State.showToast('Verified Campus upgrade active! Redirecting to dashboard...', 'success');
          App.navigate('dashboard', 'sch-gis-accra');
        }
      });
    };

    document.getElementById('btn-price-featured').onclick = () => {
      this.close();
      this.openPaystackCheckoutModal({
        amount: 2500,
        purpose: 'school_premium',
        targetId: 'sch-gis-accra',
        targetTitle: 'Featured Leader Spotlight Tier (Annual Subscription)',
        onSuccess: () => {
          State.showToast('Featured Leader status activated!', 'success');
          App.navigate('dashboard', 'sch-gis-accra');
        }
      });
    };

    document.getElementById('btn-price-educator').onclick = () => {
      this.close();
      this.openTeacherSubscribeModal();
    };
  },

  openSupportModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Admissions & Platform Desk</div>
            <h3 class="modal-title">SkoolFinder Client Support</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
            Need help claiming your school profile, registering as a supplier, or calculating CSSPS placement scores? Reach out to our team directly.
          </p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border-light);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">💬</div>
              <strong style="color: var(--primary-900); display: block; margin-bottom: 0.25rem;">WhatsApp Support</strong>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">+233 24 431 8900</div>
              <a href="https://wa.me/233244318900?text=Hello%20SkoolFinder%20Support,%20I%20need%20assistance%20with%20the%20platform." target="_blank" class="btn-pill btn-emerald" style="width: 100%; justify-content: center; font-size: 0.82rem;">
                Open WhatsApp
              </a>
            </div>

            <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border-light);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📞</div>
              <strong style="color: var(--primary-900); display: block; margin-bottom: 0.25rem;">Hotline Phone</strong>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">+233 30 277 7163</div>
              <a href="tel:+233302777163" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.82rem;">
                Call Admissions Desk
              </a>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-light); padding-top: 1.25rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem;">Working Hours:</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
              Monday – Friday: 8:00 AM – 5:30 PM GMT <br/>
              Saturday: 9:00 AM – 2:00 PM GMT (Admissions Emergency Desk)
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
  },

  openPolicyModal(type = 'privacy') {
    this.close();
    const titles = {
      privacy: 'Privacy & Data Protection Policy',
      terms: 'Terms of Institutional Verification',
      accreditation: 'Official Accreditation Guidelines'
    };

    const contents = {
      privacy: `
        <p><strong>Compliance with Ghana Data Protection Act, 2012 (Act 843):</strong></p>
        <p>SkoolFinder is committed to safeguarding the privacy and personal data of students, parents, school proprietors, and certified educators across Ghana.</p>
        <ul style="padding-left: 1.25rem; margin: 1rem 0; line-height: 1.6;">
          <li><strong>Parent Data:</strong> Information submitted via admission inquiries and campus tour bookings is shared exclusively with the verified admissions desk of the target school.</li>
          <li><strong>Payment Data:</strong> All Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Card transactions are processed through PCIDSS-compliant Paystack gateways. We do not store PINs or CVVs.</li>
          <li><strong>Educator Records:</strong> Teacher CVs and contact details are made discoverable strictly to accredited schools and verified parents seeking academic tutors.</li>
        </ul>
      `,
      terms: `
        <p><strong>Terms of School Verification & Directory Governance:</strong></p>
        <p>Institutions bearing the "🛡️ GES Verified" badge have completed institutional authentication:</p>
        <ul style="padding-left: 1.25rem; margin: 1rem 0; line-height: 1.6;">
          <li>Schools must provide an authentic Ghana Education Service (GES) Registration Certificate or Registrar General's Department incorporation document.</li>
          <li>Claimed profiles require direct verification with the Head of School, Proprietor, or Admissions Director.</li>
          <li>SkoolFinder reserves the right to suspend or remove any profile containing misleading fee disclosures, false accreditation claims, or expired licenses.</li>
        </ul>
      `,
      accreditation: `
        <p><strong>Accreditation Standards & Curriculum Frameworks:</strong></p>
        <p>All schools listed on SkoolFinder are classified according to approved Ghanaian and international examination councils:</p>
        <ul style="padding-left: 1.25rem; margin: 1rem 0; line-height: 1.6;">
          <li><strong>Cambridge International Education (CIE):</strong> Recognizes schools accredited for Cambridge Primary, Lower Secondary, IGCSE, and AS/A-Levels.</li>
          <li><strong>Ghana Education Service (GES):</strong> Evaluates standards-based curriculum compliance for BECE and WASSCE candidates.</li>
          <li><strong>International Baccalaureate (IB):</strong> Validates Primary Years (PYP), Middle Years (MYP), and Diploma Programme (DP) authorization.</li>
          <li><strong>Montessori:</strong> Verifies certified Montessori equipment and certified early childhood educators.</li>
        </ul>
      `
    };

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Legal & Compliance</div>
            <h3 class="modal-title">${titles[type] || 'Platform Guidelines'}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>
        <div class="modal-body" style="font-size: 0.92rem; color: var(--text-main); line-height: 1.6;">
          ${contents[type] || contents.privacy}
          <div style="margin-top: 1.5rem; text-align: right;">
            <button class="btn-pill btn-primary" id="btn-close-policy">Understood & Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-policy').onclick = () => this.close();
  },

  // FEATURE #1: Parent Online Student Admission Application Wizard
  openOnlineAdmissionModal(school = null) {
    this.close();
    let currentStep = 1;
    const targetSchool = school || { id: 'sch-gis-accra', name: 'Ghana International School (GIS)', whatsapp: '+233 24 412 3456' };

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 750px;">
        <!-- Modal Header -->
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
              Official Digital Admissions Portal
            </div>
            <h3 class="modal-title" id="app-modal-title">Student Admission Application — ${targetSchool.name}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <!-- Wizard Progress Steps -->
        <div style="background: var(--bg-main); padding: 0.9rem 1.5rem; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <div class="wizard-step-pill ${currentStep === 1 ? 'active' : ''}" id="step-pill-1" style="font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
            <span style="background: var(--primary-900); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">1</span>
            <span>Student Biodata</span>
          </div>
          <span style="color: var(--text-light);">➔</span>
          <div class="wizard-step-pill" id="step-pill-2" style="font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted);">
            <span style="background: var(--border-light); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">2</span>
            <span>Academic History</span>
          </div>
          <span style="color: var(--text-light);">➔</span>
          <div class="wizard-step-pill" id="step-pill-3" style="font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted);">
            <span style="background: var(--border-light); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">3</span>
            <span>Guardian & Contact</span>
          </div>
          <span style="color: var(--text-light);">➔</span>
          <div class="wizard-step-pill" id="step-pill-4" style="font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted);">
            <span style="background: var(--border-light); color: var(--text-muted); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">4</span>
            <span>Review & Submit</span>
          </div>
        </div>

        <form id="form-admission-application" class="modal-body" style="padding: 1.5rem 2rem;">
          
          <!-- STEP 1: Student Biodata & Health -->
          <div id="step-section-1">
            <h4 style="font-family: var(--font-heading); color: var(--primary-900); font-size: 1.15rem; margin-bottom: 0.5rem;">
              Child / Student Personal Details
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              Please provide the candidate's exact legal name as it appears on their birth certificate.
            </p>

            ${!school || !school.id ? `
            <div class="form-group" style="background: #f8fafc; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
              <label class="form-label" style="font-weight: 700; color: var(--primary-900);">Select Target School for Admission *</label>
              <select id="app-target-school-select" class="form-select" required>
                <option value="sch-gis-accra" selected>Ghana International School (GIS) - Cantonments, Accra</option>
                <option value="sch-sos-tema">SOS-Hermann Gmeiner International College - Tema</option>
                <option value="sch-morning-star-cantonments">Morning Star School - Cantonments, Accra</option>
                <option value="sch-achimota-accra">Achimota Basic & Senior High School - Achimota</option>
                <option value="sch-tema-intl">Tema International School (TIS) - Tema</option>
                <option value="sch-roman-ridge">The Roman Ridge School - Roman Ridge, Accra</option>
                <option value="sch-presby-boys-legon">Presbyterian Boys' Secondary School (PRESEC) - Legon</option>
                <option value="sch-alpha-beta-dansoman">Alpha Beta Education Centres - Dansoman</option>
              </select>
            </div>
            ` : ''}

            <div class="form-group">
              <label class="form-label">Student Full Name *</label>
              <input type="text" id="app-student-name" class="form-input" placeholder="e.g. Kwame Asante Mensah" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select id="app-gender" class="form-select" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth *</label>
                <input type="date" id="app-dob" class="form-input" required value="2018-05-15" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Nationality *</label>
                <input type="text" id="app-nationality" class="form-input" value="Ghanaian" required />
              </div>
              <div class="form-group">
                <label class="form-label">Blood Group</label>
                <select id="app-blood-group" class="form-select">
                  <option value="O+">O Positive (O+)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="Unknown">Unknown / To be tested</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Known Allergies / Chronic Medical Conditions</label>
              <input type="text" id="app-allergies" class="form-input" placeholder="e.g. Mild reaction to penicillin, asthma, peanut allergy (or None)" value="None declared" />
            </div>
          </div>

          <!-- STEP 2: Academic History & Grade Applying -->
          <div id="step-section-2" style="display: none;">
            <h4 style="font-family: var(--font-heading); color: var(--primary-900); font-size: 1.15rem; margin-bottom: 0.5rem;">
              Academic Placement & Previous Schooling
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              Specify the grade and academic term you are seeking enrollment for.
            </p>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Grade / Class Applying For *</label>
                <select id="app-grade" class="form-select" required>
                  <option value="Preschool / Crèche">Preschool / Crèche (Ages 1-3)</option>
                  <option value="Nursery / Kindergarten">Nursery / Kindergarten (Ages 3-5)</option>
                  <option value="Primary 1 (Class 1)" selected>Primary 1 (Class 1)</option>
                  <option value="Primary 2-6">Primary 2 to 6 (Class 2-6)</option>
                  <option value="Junior High 1 (JHS 1 / Grade 7)">Junior High 1 (JHS 1 / Grade 7)</option>
                  <option value="Junior High 2-3 (JHS 2-3)">Junior High 2 to 3 (BECE Prep)</option>
                  <option value="Senior High 1 (SHS 1 / IGCSE Year 10)">Senior High 1 (SHS 1 / IGCSE Year 10)</option>
                  <option value="Sixth Form / A-Levels">Sixth Form / A-Levels / IB DP</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Target Entry Term *</label>
                <select id="app-term" class="form-select" required>
                  <option value="Term 1 (September 2026)">Term 1 (September 2026)</option>
                  <option value="Term 2 (January 2027)">Term 2 (January 2027)</option>
                  <option value="Immediate Mid-Term">Immediate Mid-Term Admission</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Previous School Attended</label>
              <input type="text" id="app-previous-school" class="form-input" placeholder="e.g. Little Explorers Montessori Preschool" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Highest Class / Level Completed</label>
                <input type="text" id="app-last-class" class="form-input" placeholder="e.g. Kindergarten 2 or Class 6" />
              </div>
              <div class="form-group">
                <label class="form-label">Reason for Transfer</label>
                <input type="text" id="app-transfer-reason" class="form-input" placeholder="e.g. Relocation, advancing to primary, British curriculum" />
              </div>
            </div>
          </div>

          <!-- STEP 3: Parent / Guardian Information -->
          <div id="step-section-3" style="display: none;">
            <h4 style="font-family: var(--font-heading); color: var(--primary-900); font-size: 1.15rem; margin-bottom: 0.5rem;">
              Parent & Guardian Contact Information
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              All official admission notifications, entrance assessment scheduling, and offers will be sent here.
            </p>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Primary Guardian Full Name *</label>
                <input type="text" id="app-parent-name" class="form-input" placeholder="e.g. Dr. Kofi Asante Mensah" required />
              </div>
              <div class="form-group">
                <label class="form-label">Relationship to Student *</label>
                <select id="app-relationship" class="form-select" required>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Sponsor / Relative">Sponsor / Relative</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Primary Phone Number *</label>
                <input type="tel" id="app-parent-phone" class="form-input" placeholder="e.g. 024 411 2233" required />
              </div>
              <div class="form-group">
                <label class="form-label">Active WhatsApp Number *</label>
                <input type="tel" id="app-parent-wa" class="form-input" placeholder="e.g. 024 411 2233" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" id="app-parent-email" class="form-input" placeholder="e.g. parent@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">Occupation / Profession</label>
                <input type="text" id="app-occupation" class="form-input" placeholder="e.g. Consulting Civil Engineer" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Residential Address / Neighborhood *</label>
              <input type="text" id="app-address" class="form-input" placeholder="e.g. Plot 42, Ambassadorial Enclave, East Legon, Accra" required />
            </div>
          </div>

          <!-- STEP 4: Review, Documents & Declaration -->
          <div id="step-section-4" style="display: none;">
            <h4 style="font-family: var(--font-heading); color: var(--primary-900); font-size: 1.15rem; margin-bottom: 0.5rem;">
              Required Documents & Final Confirmation
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              Confirm the availability of required enrollment documents for physical or electronic verification.
            </p>

            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="font-weight: 700; color: var(--primary-900); font-size: 0.9rem; margin-bottom: 0.75rem;">
                Check the documents you have available for this application:
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.88rem;">
                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                  <input type="checkbox" id="check-doc-birth" checked style="width: 18px; height: 18px;" />
                  <span>📄 Official Birth Certificate (Registrar General / Births & Deaths Registry)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                  <input type="checkbox" id="check-doc-health" checked style="width: 18px; height: 18px;" />
                  <span>💉 Ghana Health Service Immunization / Child Health Record</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                  <input type="checkbox" id="check-doc-report" checked style="width: 18px; height: 18px;" />
                  <span>📊 Recent Terminal Academic Report / Transcripts from previous school</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Special Educational Needs / Dietary / Transport Requests</label>
              <textarea id="app-notes" class="form-textarea" rows="2" placeholder="e.g. Requesting East Legon school bus shuttle pickup; ward requires speech therapy support."></textarea>
            </div>

            <div style="background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
              <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.82rem; color: var(--primary-900); cursor: pointer;">
                <input type="checkbox" id="check-declare" required checked style="width: 18px; height: 18px; margin-top: 2px;" />
                <span>
                  I hereby declare that all information submitted in this application is accurate and complete. I understand that provisional admission is subject to physical verification of certificates and entrance assessment by <strong id="app-declaration-school-name">${targetSchool.name}</strong>.
                </span>
              </label>
            </div>
          </div>

          <!-- Wizard Footer Buttons -->
          <div class="modal-footer" style="padding: 1.25rem 0 0 0; background: none; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-pill btn-outline" id="btn-wizard-prev" style="visibility: hidden;">
              &larr; Back
            </button>
            <div style="display: flex; gap: 0.75rem;">
              <button type="button" class="btn-pill btn-outline" id="btn-cancel-application">
                Cancel
              </button>
              <button type="button" class="btn-pill btn-primary" id="btn-wizard-next">
                Continue &rarr;
              </button>
              <button type="submit" class="btn-pill btn-gold" id="btn-wizard-submit" style="display: none;">
                Submit Admission Application &rarr;
              </button>
            </div>
          </div>

        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-application').onclick = () => this.close();

    const updateStepUI = () => {
      [1, 2, 3, 4].forEach(step => {
        const sec = document.getElementById(`step-section-${step}`);
        const pill = document.getElementById(`step-pill-${step}`);
        if (sec) sec.style.display = step === currentStep ? 'block' : 'none';
        if (pill) {
          pill.style.color = step === currentStep ? 'var(--primary-900)' : (step < currentStep ? 'var(--emerald-600)' : 'var(--text-muted)');
          const badge = pill.querySelector('span:first-child');
          if (badge) {
            badge.style.background = step === currentStep ? 'var(--primary-900)' : (step < currentStep ? 'var(--emerald-600)' : 'var(--border-light)');
            badge.style.color = step <= currentStep ? '#fff' : 'var(--text-muted)';
            badge.innerText = step < currentStep ? '✓' : step;
          }
        }
      });

      const btnPrev = document.getElementById('btn-wizard-prev');
      const btnNext = document.getElementById('btn-wizard-next');
      const btnSubmit = document.getElementById('btn-wizard-submit');

      if (btnPrev) btnPrev.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
      if (btnNext) btnNext.style.display = currentStep < 4 ? 'inline-flex' : 'none';
      if (btnSubmit) btnSubmit.style.display = currentStep === 4 ? 'inline-flex' : 'none';
    };

    document.getElementById('btn-wizard-next').onclick = () => {
      if (currentStep === 1) {
        const name = document.getElementById('app-student-name').value.trim();
        if (!name) {
          State.showToast("Please enter the student's full name", "error");
          return;
        }
      } else if (currentStep === 3) {
        const pName = document.getElementById('app-parent-name').value.trim();
        const pPhone = document.getElementById('app-parent-phone').value.trim();
        if (!pName || !pPhone) {
          State.showToast("Please enter parent name and contact phone", "error");
          return;
        }
      }
      if (currentStep < 4) {
        currentStep++;
        updateStepUI();
      }
    };

    document.getElementById('btn-wizard-prev').onclick = () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    };

    // Form Submission
    document.getElementById('form-admission-application').onsubmit = async (e) => {
      e.preventDefault();
      const studentName = document.getElementById('app-student-name').value.trim();
      const gender = document.getElementById('app-gender').value;
      const dateOfBirth = document.getElementById('app-dob').value;
      const nationality = document.getElementById('app-nationality').value.trim();
      const bloodGroup = document.getElementById('app-blood-group').value;
      const allergies = document.getElementById('app-allergies').value.trim();

      const gradeApplying = document.getElementById('app-grade').value;
      const termApplied = document.getElementById('app-term').value;
      const previousSchool = document.getElementById('app-previous-school').value.trim();
      const lastClassPassed = document.getElementById('app-last-class').value.trim();
      const reasonForTransfer = document.getElementById('app-transfer-reason').value.trim();

      const parentName = document.getElementById('app-parent-name').value.trim();
      const relationship = document.getElementById('app-relationship').value;
      const parentPhone = document.getElementById('app-parent-phone').value.trim();
      const parentWhatsapp = document.getElementById('app-parent-wa').value.trim();
      const parentEmail = document.getElementById('app-parent-email').value.trim();
      const occupation = document.getElementById('app-occupation').value.trim();
      const residentialAddress = document.getElementById('app-address').value.trim();
      const specialNotes = document.getElementById('app-notes').value.trim();

      const docs = [];
      if (document.getElementById('check-doc-birth')?.checked) docs.push({ docType: "Birth Certificate", fileName: "birth_cert.pdf", verified: true });
      if (document.getElementById('check-doc-health')?.checked) docs.push({ docType: "Immunization Record", fileName: "child_health.pdf", verified: true });
      if (document.getElementById('check-doc-report')?.checked) docs.push({ docType: "Terminal Report", fileName: "previous_report.pdf", verified: true });

      try {
        const targetSchoolId = (school && school.id) ? school.id : (document.getElementById('app-target-school-select')?.value || 'sch-gis-accra');
        const res = await API.submitAdmissionApplication({
          schoolId: targetSchoolId,
          studentName,
          gender,
          dateOfBirth,
          nationality,
          bloodGroup,
          allergies,
          gradeApplying,
          termApplied,
          previousSchool,
          lastClassPassed,
          reasonForTransfer,
          parentName,
          relationship,
          parentPhone,
          parentWhatsapp,
          parentEmail,
          occupation,
          residentialAddress,
          specialNotes,
          documentsSubmitted: docs
        });

        const app = res.application;
        State.showToast(`Application ${app.applicationNumber} registered successfully!`, 'success');

        // Render Confirmation Slip View
        const dialog = div.querySelector('.modal-dialog');
        dialog.innerHTML = `
          <div class="modal-header" style="background: var(--gradient-navy); color: #fff; border-bottom: none;">
            <div>
              <span class="badge badge-emerald" style="margin-bottom: 0.35rem;">✓ Official Submission Confirmed</span>
              <h3 class="modal-title" style="color: #fff;">Application Slip Generated</h3>
            </div>
            <button class="modal-close-btn" id="modal-close-slip" style="color: #fff;">&times;</button>
          </div>
          <div class="modal-body" style="padding: 2rem;">
            <!-- Reference Box -->
            <div style="background: var(--gold-50); border: 2px solid var(--gold-400); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-700); text-transform: uppercase;">Official Tracking Number</div>
              <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 900; color: var(--primary-900); margin: 0.25rem 0;">
                ${app.applicationNumber}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                Present this reference code at the admissions office or during entrance assessment.
              </div>
            </div>

            <!-- Summary Table -->
            <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; font-size: 0.9rem;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
                <div><span style="color: var(--text-light);">Candidate:</span> <strong style="color: var(--primary-900);">${app.student.fullName}</strong></div>
                <div><span style="color: var(--text-light);">Grade Level:</span> <strong>${app.gradeApplying}</strong></div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
                <div><span style="color: var(--text-light);">Target School:</span> <strong>${app.schoolName}</strong></div>
                <div><span style="color: var(--text-light);">Entry Term:</span> <strong>${app.termApplied}</strong></div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div><span style="color: var(--text-light);">Primary Guardian:</span> <strong>${app.parentGuardian.primaryGuardianName}</strong></div>
                <div><span style="color: var(--text-light);">Admissions Status:</span> <span class="badge badge-admissions">${app.status}</span></div>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              The admissions board has received your dossier. An entrance assessment time slot will be assigned and updated directly in your admissions file.
            </p>

            <!-- Action buttons -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn-pill btn-primary" style="flex: 1; justify-content: center;" onclick="window.print()">
                <span>🖨️</span> Print Application Slip
              </button>
              <button class="btn-pill btn-emerald" style="flex: 1; justify-content: center;" id="btn-slip-wa">
                <span>💬</span> WhatsApp Admissions Desk
              </button>
            </div>
          </div>
        `;

        document.getElementById('modal-close-slip').onclick = () => this.close();
        document.getElementById('btn-slip-wa').onclick = () => {
          const cleanWa = (school?.whatsapp || '+233 24 412 3456').replace(/[^0-9]/g, '');
          const activeSchoolName = school?.name || app.schoolName || 'Admissions Office';
          const msg = encodeURIComponent(`Hello ${activeSchoolName} Admissions, I have submitted online application ${app.applicationNumber} for ${app.student.fullName} into ${app.gradeApplying}. I would like to confirm receipt.`);
          window.open(`https://wa.me/${cleanWa}?text=${msg}`, '_blank');
        };

      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Modal: Add Secondary Child / Ward to Parent Account
  openAddWardModal(onSuccess) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
              Parent Account Management
            </div>
            <h3 class="modal-title">👶 Add Another Child / Ward</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-add-ward" class="modal-body" style="padding: 1.5rem 2rem;">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
            Enroll an additional child or ward under your verified parent account. This immediately links their student profile, prepares admission dossiers, and tracks academic performance.
          </p>

          <div class="form-group">
            <label class="form-label">Child / Ward Legal Full Name *</label>
            <input type="text" id="ward-name" class="form-input" placeholder="e.g. Akosua Serwaa Mensah" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Gender *</label>
              <select id="ward-gender" class="form-select" required>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <input type="date" id="ward-dob" class="form-input" value="2018-09-12" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Current Academic Level *</label>
              <select id="ward-level" class="form-select" required>
                <option value="Kindergarten / Nursery">Kindergarten / Nursery</option>
                <option value="Primary (Class 1-6)" selected>Primary (Class 1-6)</option>
                <option value="Junior High (JHS 1-3 / BECE)">Junior High (JHS 1-3 / BECE)</option>
                <option value="Senior High (SHS 1-3 / WASSCE)">Senior High (SHS 1-3 / WASSCE)</option>
                <option value="Cambridge IGCSE / A-Levels">Cambridge IGCSE / A-Levels</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target School *</label>
              <select id="ward-school-id" class="form-select" required>
                <option value="sch-gis-accra" selected>Ghana International School (GIS)</option>
                <option value="sch-sos-tema">SOS-Hermann Gmeiner College</option>
                <option value="sch-morning-star-cantonments">Morning Star School</option>
                <option value="sch-achimota-accra">Achimota School</option>
                <option value="sch-tema-intl">Tema International School</option>
                <option value="sch-roman-ridge">The Roman Ridge School</option>
                <option value="sch-alpha-beta-dansoman">Alpha Beta Education</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Blood Group</label>
              <select id="ward-blood" class="form-select">
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Relationship to Student</label>
              <select id="ward-relationship" class="form-select">
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Legal Guardian">Legal Guardian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Medical & Allergy Notes (Optional)</label>
            <input type="text" id="ward-allergies" class="form-input" placeholder="e.g. Mild asthma inhaler user; allergic to peanuts" />
          </div>

          <div class="modal-footer" style="padding: 1.25rem 0 0 0; background: none; border-top: 1px solid var(--border-light); display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-ward">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">
              <span>➕</span> Register Ward & Create Dossier
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-ward').onclick = () => this.close();

    document.getElementById('form-add-ward').onsubmit = async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('ward-name').value.trim();
      const gender = document.getElementById('ward-gender').value;
      const dateOfBirth = document.getElementById('ward-dob').value;
      const level = document.getElementById('ward-level').value;
      const targetSchoolId = document.getElementById('ward-school-id').value;
      const bloodGroup = document.getElementById('ward-blood').value;
      const relationship = document.getElementById('ward-relationship').value;
      const allergies = document.getElementById('ward-allergies').value.trim();

      try {
        const res = await API.addParentWard({
          fullName,
          gender,
          dateOfBirth,
          level,
          targetSchoolId,
          bloodGroup,
          relationship,
          allergies
        });

        this.close();
        State.showToast(`Child / Ward "${fullName}" added successfully! Admission dossier created.`, 'success');
        if (typeof onSuccess === 'function') onSuccess(res);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // FEATURE #1: Application Dossier Modal for School Administration
  openApplicationDossierModal(app) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 720px;">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge ${app.status === 'Admitted' ? 'badge-verified' : (app.status === 'Entrance Exam Scheduled' ? 'badge-cambridge' : 'badge-admissions')}">
                ${app.status}
              </span>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600);">${app.applicationNumber}</span>
            </div>
            <h3 class="modal-title">Applicant Dossier — ${app.student.fullName}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem 2rem;">
          
          <!-- Candidate Bio Strip -->
          <div style="background: var(--bg-main); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.88rem;">
            <div>
              <span style="color: var(--text-light); display: block; font-size: 0.75rem; text-transform: uppercase;">Gender & DOB</span>
              <strong>${app.student.gender} • ${app.student.dateOfBirth}</strong>
            </div>
            <div>
              <span style="color: var(--text-light); display: block; font-size: 0.75rem; text-transform: uppercase;">Grade Seeking</span>
              <strong style="color: var(--primary-900);">${app.gradeApplying}</strong>
            </div>
            <div>
              <span style="color: var(--text-light); display: block; font-size: 0.75rem; text-transform: uppercase;">Blood Group & Health</span>
              <strong>${app.student.bloodGroup || 'O+'} (${app.student.allergies || 'None'})</strong>
            </div>
          </div>

          <!-- Section: Previous Academic Experience -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
              🏫 Academic Background
            </h4>
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; font-size: 0.88rem;">
              <div style="margin-bottom: 0.4rem;">
                <strong>Previous Institution:</strong> ${app.previousSchool.schoolName || 'None'}
              </div>
              <div style="margin-bottom: 0.4rem;">
                <strong>Last Level Passed:</strong> ${app.previousSchool.lastClassPassed || 'N/A'}
              </div>
              <div>
                <strong>Reason for Transfer:</strong> ${app.previousSchool.reasonForTransfer || 'Regular enrollment'}
              </div>
            </div>
          </div>

          <!-- Section: Parent & Guardian Contact -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
              👨‍👩‍👧 Parent / Guardian Dossier
            </h4>
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; font-size: 0.88rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div>
                <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Primary Guardian:</span>
                <strong>${app.parentGuardian.primaryGuardianName} (${app.parentGuardian.relationship})</strong>
              </div>
              <div>
                <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Occupation:</span>
                <strong>${app.parentGuardian.occupation || 'Professional'}</strong>
              </div>
              <div>
                <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Phone & WhatsApp:</span>
                <strong>${app.parentGuardian.phone}</strong>
              </div>
              <div>
                <span style="color: var(--text-light); display: block; font-size: 0.75rem;">Residential Enclave:</span>
                <strong>${app.parentGuardian.residentialAddress}</strong>
              </div>
            </div>
          </div>

          <!-- Section: Submitted Verification Documents -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
              📑 Verification Documents Attached
            </h4>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              ${app.documentsSubmitted.map(d => `
                <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.5rem 0.85rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span style="color: var(--emerald-600); font-weight: 800;">✓</span>
                  <span>${d.docType}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Assessment Date / Notes -->
          <div style="background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.88rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--primary-800); text-transform: uppercase; margin-bottom: 0.25rem;">
              Entrance Exam & Admissions Status
            </div>
            <div style="font-weight: 700; color: var(--primary-900); margin-bottom: 0.25rem;">
              ${app.entranceExamDate || 'Assessment Pending'}
            </div>
            <div style="color: var(--text-muted); font-size: 0.82rem;">
              ${app.adminNotes || 'No administrative notes appended.'}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
            <button type="button" class="btn-pill btn-outline" id="btn-dossier-close">Close Dossier</button>
            <a href="https://wa.me/${app.parentGuardian.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(app.parentGuardian.primaryGuardianName)},%20this%20is%20${encodeURIComponent(app.schoolName)}%20Admissions%20regarding%20the%20application%20for%20${encodeURIComponent(app.student.fullName)}%20(${app.applicationNumber})." target="_blank" class="btn-pill btn-emerald">
              💬 WhatsApp Parent
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-dossier-close').onclick = () => this.close();
  },

  // FEATURE #1: Schedule Entrance Assessment Modal
  openScheduleExamModal(app, onComplete) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 520px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Admissions Evaluation</div>
            <h3 class="modal-title">Schedule Entrance Exam</h3>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-schedule-exam" class="modal-body">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Assign an entrance assessment date and testing slot for candidate <strong>${app.student.fullName}</strong> (${app.gradeApplying}).
          </p>

          <div class="form-group">
            <label class="form-label">Assessment Date & Time *</label>
            <input type="text" id="exam-slot" class="form-input" placeholder="e.g. Saturday, 15th August 2026 at 9:00 AM" value="Saturday, 15th August 2026 at 9:00 AM" required />
          </div>

          <div class="form-group">
            <label class="form-label">Assessment Format *</label>
            <select id="exam-format" class="form-select" required>
              <option value="Cambridge Math & Literacy Entrance Assessment">Cambridge Math & Literacy Entrance Assessment</option>
              <option value="Primary Readiness & Reading Diagnostic Test">Primary Readiness & Reading Diagnostic Test</option>
              <option value="Junior High Checkpoint Diagnostic">Junior High Checkpoint Diagnostic</option>
              <option value="Oral Phonics & Developmental Interview">Oral Phonics & Developmental Interview (Preschool)</option>
              <option value="IGCSE / Senior High Placement Test">IGCSE / Senior High Placement Test</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Examination Venue / Room</label>
            <input type="text" id="exam-venue" class="form-input" value="Main Administration Block, Examination Room 2B" required />
          </div>

          <div class="form-group">
            <label class="form-label">Notes / Candidate Instructions</label>
            <textarea id="exam-notes" class="form-textarea" rows="2" placeholder="e.g. Candidate should arrive with pencil case, eraser, and birth certificate copy."></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-exam">Cancel</button>
            <button type="submit" class="btn-pill btn-gold">Confirm Exam Schedule & Notify</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-exam').onclick = () => this.close();

    document.getElementById('form-schedule-exam').onsubmit = async (e) => {
      e.preventDefault();
      const examSlot = document.getElementById('exam-slot').value.trim();
      const format = document.getElementById('exam-format').value;
      const venue = document.getElementById('exam-venue').value.trim();
      const notes = document.getElementById('exam-notes').value.trim();

      const combinedNotes = `${format} at ${venue}. ${notes}`;

      try {
        await API.updateApplicationStatus(app.id, {
          status: 'Entrance Exam Scheduled',
          entranceExamDate: examSlot,
          adminNotes: combinedNotes
        });
        this.close();
        State.showToast(`Entrance exam scheduled for ${app.student.fullName}!`, 'success');
        if (typeof onComplete === 'function') onComplete();
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // FEATURE #1: Official Admission Offer Letter Presentation Modal
  openAdmissionOfferLetterModal(offerData) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 760px; padding: 0; overflow: hidden; border-radius: var(--radius-xl);">
        <div style="background: var(--primary-900); color: #fff; padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase;">
            Ghana Education Service Registered Institution
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #fff;">&times;</button>
        </div>

        <!-- Official Letterhead Card -->
        <div class="letterhead-sheet" style="background: #ffffff; padding: 3rem 3.5rem; color: #0a1128; font-family: 'Times New Roman', serif;">
          
          <!-- Crest & School Details Header -->
          <div style="text-align: center; border-bottom: 2px solid #0a1128; padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <div style="font-size: 2.25rem; margin-bottom: 0.25rem;">🎓</div>
            <h1 style="font-size: 1.75rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; margin: 0; color: #0a1128;">
              ${offerData.schoolName}
            </h1>
            <div style="font-style: italic; font-size: 0.95rem; color: #475569; margin: 0.25rem 0;">
              "${offerData.schoolMotto}"
            </div>
            <div style="font-size: 0.85rem; color: #64748b; font-family: var(--font-body);">
              ${offerData.schoolAddress} • Tel: ${offerData.schoolPhone} • Email: ${offerData.schoolEmail}
            </div>
          </div>

          <!-- Metadata Strip -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; font-family: var(--font-body); font-size: 0.9rem;">
            <div>
              <strong>Ref:</strong> ${offerData.offerId}<br/>
              <strong>Date:</strong> ${offerData.issueDate}
            </div>
            <div style="text-align: right;">
              <strong>Application Code:</strong> ${offerData.applicationNumber}<br/>
              <span style="background: #dcfce7; color: #15803d; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.78rem;">OFFICIAL ADMISSION OFFER</span>
            </div>
          </div>

          <!-- Addressee -->
          <div style="font-family: var(--font-body); font-size: 0.92rem; margin-bottom: 1.75rem; line-height: 1.5;">
            To the Parents / Guardians of:<br/>
            <strong>Master/Miss ${offerData.studentName}</strong><br/>
            C/O ${offerData.parentName}<br/>
            ${offerData.parentAddress || 'Greater Accra, Ghana'}
          </div>

          <!-- Salutation & Body -->
          <div style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.75rem; text-align: justify;">
            <p style="margin-bottom: 1rem; font-weight: 700; text-decoration: underline; text-align: center; text-transform: uppercase;">
              OFFER OF PROVISIONAL ADMISSION FOR 2026/2027 ACADEMIC YEAR
            </p>
            <p style="margin-bottom: 1rem;">
              Dear ${offerData.parentName},
            </p>
            <p style="margin-bottom: 1rem;">
              Following the satisfactory performance of <strong>${offerData.studentName}</strong> in our institutional entrance evaluation and the subsequent recommendation of the Academic Admissions Board, the Board of Governors is pleased to offer your ward provisional admission into <strong>${offerData.gradeOffered}</strong> (${offerData.curriculum}) commencing in <strong>${offerData.termApplied}</strong>.
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>Key Academic & Enrollment Schedule:</strong>
            </p>
            <ul style="padding-left: 1.5rem; margin-bottom: 1.25rem;">
              <li><strong>New Student Orientation:</strong> ${offerData.orientationDate} at 9:00 AM.</li>
              <li><strong>Official Term 1 Resumption Date:</strong> ${offerData.reportingDate}.</li>
              <li><strong>Initial Tuition Commitment:</strong> GH₵ ${offerData.tuitionBase.toLocaleString()} (Termly Base).</li>
            </ul>
            <p style="margin-bottom: 1rem;">
              <strong>Provisional Conditions of Admission:</strong>
            </p>
            <ul style="padding-left: 1.5rem; margin-bottom: 1.5rem; font-size: 0.95rem;">
              ${offerData.provisionalConditions.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <p>
              Please accept our warmest congratulations on your ward’s admission to ${offerData.schoolName}. We look forward to a rewarding partnership in educational excellence.
            </p>
          </div>

          <!-- Signature Block -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #cbd5e1; font-family: var(--font-body);">
            <div>
              <div style="font-family: 'Brush Script MT', cursive; font-size: 1.75rem; color: #0a1128;">
                ${offerData.headOfSchool}
              </div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #0a1128;">${offerData.headOfSchool}</div>
              <div style="font-size: 0.8rem; color: #64748b;">Head of School / Director of Admissions</div>
            </div>
            <div style="text-align: center; border: 2px dashed #94a3b8; padding: 0.5rem 1rem; border-radius: 8px;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Official Institutional Seal</div>
              <div style="font-size: 1.1rem; color: #1e3a8a; font-weight: 800;">VERIFIED ACCREDITED</div>
            </div>
          </div>

        </div>

        <!-- Footer Control Strip -->
        <div style="background: var(--bg-main); padding: 1.25rem 2rem; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <button type="button" class="btn-pill btn-outline" id="btn-offer-close">Close</button>
          <button type="button" class="btn-pill btn-primary" onclick="window.print()" style="padding: 0.65rem 1.75rem;">
            <span>🖨️</span> Print Official Admission Offer Letter
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-offer-close').onclick = () => this.close();
  },

  // Feature 2: Write Parent Review Modal
  openWriteReviewModal(school, onComplete = null) {
    this.close();
    let currentOverall = 5;

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 650px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: var(--gold-100); color: var(--gold-700); font-weight: 700; margin-bottom: 0.35rem;">
              ⭐ Feature #2: Verified Parent Review
            </span>
            <h3 class="modal-title">Review ${school.name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Share your authentic family experience to help parents across Ghana make informed educational choices.
            </p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-write-review" class="modal-body" style="padding: 1.75rem;">
          <!-- Overall Star Rating Selector -->
          <div style="background: var(--bg-main); border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
              Overall Institutional Rating *
            </div>
            <div id="star-picker-container" style="display: flex; justify-content: center; gap: 0.5rem; font-size: 2.25rem; cursor: pointer; user-select: none;">
              <span class="star-btn" data-val="1" style="color: #f59e0b; transition: transform 0.15s;">★</span>
              <span class="star-btn" data-val="2" style="color: #f59e0b; transition: transform 0.15s;">★</span>
              <span class="star-btn" data-val="3" style="color: #f59e0b; transition: transform 0.15s;">★</span>
              <span class="star-btn" data-val="4" style="color: #f59e0b; transition: transform 0.15s;">★</span>
              <span class="star-btn" data-val="5" style="color: #f59e0b; transition: transform 0.15s;">★</span>
            </div>
            <div id="star-label-display" style="font-size: 0.95rem; font-weight: 800; color: var(--primary-900); margin-top: 0.35rem;">
              5.0 / 5.0 — Exceptional (Highest Recommendation)
            </div>
          </div>

          <!-- Dimension Breakdown Scores -->
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-900); text-transform: uppercase; margin-bottom: 0.75rem;">
              Rate Specific Dimensions (1 - 5 Stars)
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;">
              <div>
                <label class="form-label" style="font-size: 0.8rem;">📚 Academic Quality</label>
                <select id="rev-dim-academics" class="form-select">
                  <option value="5" selected>5 ★★★★★ (Exceptional)</option>
                  <option value="4">4 ★★★★☆ (Strong)</option>
                  <option value="3">3 ★★★☆☆ (Average)</option>
                  <option value="2">2 ★★☆☆☆ (Needs Work)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 0.8rem;">🏫 Campus Facilities</label>
                <select id="rev-dim-facilities" class="form-select">
                  <option value="5" selected>5 ★★★★★ (Modern / State-of-the-Art)</option>
                  <option value="4">4 ★★★★☆ (Well-equipped)</option>
                  <option value="3">3 ★★★☆☆ (Adequate)</option>
                  <option value="2">2 ★★☆☆☆ (Outdated)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 0.8rem;">⚖️ Discipline & Pastoral Care</label>
                <select id="rev-dim-discipline" class="form-select">
                  <option value="5" selected>5 ★★★★★ (Strict & Nurturing)</option>
                  <option value="4">4 ★★★★☆ (Good Order)</option>
                  <option value="3">3 ★★★☆☆ (Fair)</option>
                  <option value="2">2 ★★☆☆☆ (Lacking)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 0.8rem;">💰 Value for Money (Fees)</label>
                <select id="rev-dim-value" class="form-select">
                  <option value="5">5 ★★★★★ (Exceptional Value)</option>
                  <option value="4" selected>4 ★★★★☆ (Fair for Quality)</option>
                  <option value="3">3 ★★★☆☆ (Expensive)</option>
                  <option value="2">2 ★★☆☆☆ (Overpriced)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Reviewer Identity & Affiliation -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Your Name / Title *</label>
              <input type="text" id="rev-author" class="form-input" placeholder="e.g. Mrs. Cynthia Opoku-Ware" required />
            </div>
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Affiliation to School *</label>
              <select id="rev-affiliation" class="form-select" required>
                <option value="Verified Current Parent" selected>Verified Current Parent</option>
                <option value="Alumni / Old Student">Alumni / Old Student</option>
                <option value="Former Parent">Former Parent (Graduated / Transferred)</option>
                <option value="Community Member">Community / Educational Observer</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.8rem;">Ward's Grade Level / Class *</label>
            <input type="text" id="rev-ward-grade" class="form-input" placeholder="e.g. Primary Class 4 & Form 2 (JHS)" required />
          </div>

          <!-- Review Headline & Commentary -->
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.8rem;">Review Headline / Summary *</label>
            <input type="text" id="rev-title" class="form-input" placeholder="e.g. Inspiring Cambridge curriculum with caring, dedicated teachers" required />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.8rem;">Detailed Experience & Advice to Parents *</label>
            <textarea id="rev-content" class="form-textarea" rows="4" placeholder="Detail your experience with teachers, academic progress, boarding/day life, extracurricular clubs, security, and school communication..." required></textarea>
          </div>

          <!-- Key Highlights Tags Checklist -->
          <div style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.5rem; display: block;">
              Select Notable Highlights (Optional):
            </label>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;" id="review-highlights-container">
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Dedicated Faculty" checked /> Dedicated Faculty
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Cambridge Excellence" checked /> Cambridge / WASSCE Excellence
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="STEM & Robotics" /> STEM & Robotics
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Safe Bus Shuttle" /> Safe Bus Shuttle
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Strict Discipline" /> Strict Discipline & Morals
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Clean Canteen Meals" /> Clean Canteen Meals
              </label>
              <label class="pill-check" style="background: var(--bg-main); border: 1px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                <input type="checkbox" value="Small Class Sizes" /> Small Class Sizes
              </label>
            </div>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: 1px solid var(--border-light); display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-review">Cancel</button>
            <button type="submit" class="btn-pill btn-gold" style="padding: 0.65rem 1.75rem;">
              <span>⭐</span> Publish Verified Review
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);

    // Star picker interactive logic
    const starBtns = div.querySelectorAll('.star-btn');
    const labelDisplay = document.getElementById('star-label-display');
    const starLabels = {
      1: "1.0 / 5.0 — Poor (Significant Improvement Needed)",
      2: "2.0 / 5.0 — Fair (Below Expectations)",
      3: "3.0 / 5.0 — Good (Meets Basic Standard)",
      4: "4.0 / 5.0 — Very Good (Highly Recommended)",
      5: "5.0 / 5.0 — Exceptional (Highest Recommendation)"
    };

    const updateStars = (val) => {
      currentOverall = val;
      starBtns.forEach(b => {
        const starVal = parseInt(b.dataset.val, 10);
        if (starVal <= val) {
          b.style.color = '#f59e0b';
          b.innerText = '★';
        } else {
          b.style.color = '#cbd5e1';
          b.innerText = '☆';
        }
      });
      if (labelDisplay) labelDisplay.innerText = starLabels[val] || `${val}.0 / 5.0`;
    };

    starBtns.forEach(btn => {
      btn.onclick = () => updateStars(parseInt(btn.dataset.val, 10));
    });

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-review').onclick = () => this.close();

    // Form submission
    document.getElementById('form-write-review').onsubmit = async (e) => {
      e.preventDefault();
      const authorName = document.getElementById('rev-author').value.trim();
      const affiliation = document.getElementById('rev-affiliation').value;
      const wardGrade = document.getElementById('rev-ward-grade').value.trim();
      const title = document.getElementById('rev-title').value.trim();
      const content = document.getElementById('rev-content').value.trim();

      const academics = document.getElementById('rev-dim-academics').value;
      const facilities = document.getElementById('rev-dim-facilities').value;
      const discipline = document.getElementById('rev-dim-discipline').value;
      const valueForMoney = document.getElementById('rev-dim-value').value;

      const highlights = [];
      div.querySelectorAll('#review-highlights-container input[type="checkbox"]:checked').forEach(cb => {
        highlights.push(cb.value);
      });

      try {
        const res = await API.submitSchoolReview(school.id, {
          authorName,
          affiliation,
          wardGrade,
          overallRating: currentOverall,
          academics,
          facilities,
          discipline,
          valueForMoney,
          communication: 5,
          title,
          content,
          highlights
        });

        this.close();
        State.showToast(`Review published! Thank you for sharing your experience.`, 'success');
        if (onComplete) onComplete(res.review);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Feature 2: Official School Response Modal (For School Administration)
  openReplyReviewModal(review, onComplete = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-verified" style="margin-bottom: 0.35rem;">🛡️ Official Institutional Reply</span>
            <h3 class="modal-title">Respond to Parent Review</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Reviewer: <strong>${review.authorName}</strong> (${review.overallRating} ★)
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-reply-review" class="modal-body" style="padding: 1.75rem;">
          <!-- Review Quote -->
          <div style="background: var(--bg-main); border-left: 3px solid var(--gold-500); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
            "${review.content.slice(0, 160)}${review.content.length > 160 ? '...' : ''}"
          </div>

          <div class="form-group">
            <label class="form-label">Official Responding Officer *</label>
            <input type="text" id="reply-author" class="form-input" placeholder="e.g. Dr. Mary Ashun" required />
          </div>

          <div class="form-group">
            <label class="form-label">Institutional Designation / Role *</label>
            <input type="text" id="reply-role" class="form-input" value="Head of School / Administration" required />
          </div>

          <div class="form-group">
            <label class="form-label">Official Public Statement / Response *</label>
            <textarea id="reply-message" class="form-textarea" rows="4" placeholder="Express appreciation, provide updates on institutional developments, and address any points raised in the review..." required></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-reply">Cancel</button>
            <button type="submit" class="btn-pill btn-primary">Publish Official Response &rarr;</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-reply').onclick = () => this.close();

    document.getElementById('form-reply-review').onsubmit = async (e) => {
      e.preventDefault();
      const author = document.getElementById('reply-author').value.trim();
      const role = document.getElementById('reply-role').value.trim();
      const message = document.getElementById('reply-message').value.trim();

      try {
        const res = await API.replyToReview(review.id, { author, role, message });
        this.close();
        State.showToast(`Official management response published!`, 'success');
        if (onComplete) onComplete(res.review);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Feature 3: Direct Admissions Inquiries & School-to-Parent Messaging Center
  openInquireAdmissionModal(school, onComplete = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: #e0f2fe; color: #0284c7; font-weight: 700; margin-bottom: 0.35rem;">
              📬 Feature #3: Direct Admissions Desk Inquiry
            </span>
            <h3 class="modal-title">Inquire & Book Campus Tour</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Send a direct verified message to <strong>${school.name}</strong> (${school.suburb}, ${school.region}).
            </p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-inquire-school" class="modal-body" style="padding: 1.75rem;">
          <!-- Category Selector -->
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-weight: 700; color: var(--primary-900);">Inquiry Subject Category *</label>
            <select id="inq-category" class="form-select" required>
              <option value="Campus Tour & Inspection Booking">🏫 Campus Tour & Physical Inspection Booking</option>
              <option value="School Fees, Scholarships & Payment Plans">💵 School Fees, Scholarships & Payment Plans</option>
              <option value="Boarding Life, Hostels & Safety">🛌 Boarding Life, Hostels & Medical Care</option>
              <option value="Mid-Academic Year Student Transfer">🔄 Mid-Academic Year Student Transfer</option>
              <option value="Special Educational Needs (SEN)">🧠 Special Educational Needs (SEN) & Learning Support</option>
              <option value="General Admissions & Curriculum Requirements">📝 General Admissions & Curriculum Requirements</option>
            </select>
          </div>

          <!-- Tour Scheduling Specific Block -->
          <div id="inq-tour-box" style="background: var(--bg-main); border: 1.5px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-900);">
                📅 Schedule a Guided Campus Walkthrough
              </div>
              <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 600; color: var(--text-muted); cursor: pointer;">
                <input type="checkbox" id="inq-tour-requested" checked /> Request In-Person Tour
              </label>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="inq-tour-fields">
              <div>
                <label class="form-label" style="font-size: 0.8rem;">Preferred Visit Date</label>
                <input type="date" id="inq-tour-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div>
                <label class="form-label" style="font-size: 0.8rem;">Preferred Time Slot</label>
                <select id="inq-tour-time" class="form-select">
                  <option value="Morning Session (09:30 AM - 11:30 AM)">Morning Session (09:30 AM - 11:30 AM)</option>
                  <option value="Midday Session (11:30 AM - 01:30 PM)">Midday Session (11:30 AM - 01:30 PM)</option>
                  <option value="Afternoon Session (02:00 PM - 03:30 PM)">Afternoon Session (02:00 PM - 03:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Parent / Guardian Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Parent / Guardian Name *</label>
              <input type="text" id="inq-parent-name" class="form-input" placeholder="e.g. Mrs. Vivian Mensah" required />
            </div>
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Phone Number *</label>
              <input type="tel" id="inq-parent-phone" class="form-input" placeholder="e.g. +233 24 123 4567" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label class="form-label" style="font-size: 0.8rem;">WhatsApp Number (For Direct Replies) *</label>
              <input type="tel" id="inq-parent-wa" class="form-input" placeholder="e.g. +233 24 123 4567" required />
            </div>
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Email Address (Optional)</label>
              <input type="email" id="inq-parent-email" class="form-input" placeholder="e.g. vivian.mensah@gmail.com" />
            </div>
          </div>

          <!-- Student Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Candidate / Student Name</label>
              <input type="text" id="inq-student-name" class="form-input" placeholder="e.g. Michael Mensah" />
            </div>
            <div>
              <label class="form-label" style="font-size: 0.8rem;">Grade / Class Applying For *</label>
              <input type="text" id="inq-grade-applying" class="form-input" placeholder="e.g. Primary Class 3 / Form 1 (JHS)" required />
            </div>
          </div>

          <!-- Subject & Message -->
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.8rem;">Inquiry Title / Subject *</label>
            <input type="text" id="inq-subject" class="form-input" placeholder="e.g. Inquiry regarding science lab inspection and admissions entrance test" required />
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-size: 0.8rem;">Detailed Questions / Message *</label>
            <textarea id="inq-message" class="form-textarea" rows="4" placeholder="Detail your questions regarding curriculum transition, bus routes, dietary accommodations, hostel facilities, or fees..." required></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: 1px solid var(--border-light); display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-inquiry">Cancel</button>
            <button type="submit" class="btn-pill btn-primary" style="padding: 0.65rem 1.75rem;">
              <span>📤</span> Dispatch Inquiry to Admissions Desk
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);

    // Toggle tour fields on checkbox change
    const tourCb = document.getElementById('inq-tour-requested');
    const tourFields = document.getElementById('inq-tour-fields');
    const categorySelect = document.getElementById('inq-category');
    if (tourCb && tourFields) {
      tourCb.onchange = () => {
        tourFields.style.display = tourCb.checked ? 'grid' : 'none';
      };
      if (categorySelect) {
        categorySelect.onchange = () => {
          if (categorySelect.value.includes('Campus Tour')) {
            tourCb.checked = true;
            tourFields.style.display = 'grid';
          }
        };
      }
    }

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-inquiry').onclick = () => this.close();

    document.getElementById('form-inquire-school').onsubmit = async (e) => {
      e.preventDefault();
      const parentName = document.getElementById('inq-parent-name').value.trim();
      const parentPhone = document.getElementById('inq-parent-phone').value.trim();
      const parentWhatsapp = document.getElementById('inq-parent-wa').value.trim() || parentPhone;
      const parentEmail = document.getElementById('inq-parent-email').value.trim();
      const studentName = document.getElementById('inq-student-name').value.trim() || 'Prospective Student';
      const gradeApplying = document.getElementById('inq-grade-applying').value.trim();
      const category = document.getElementById('inq-category').value;
      const tourRequested = document.getElementById('inq-tour-requested')?.checked || false;
      const preferredTourDate = document.getElementById('inq-tour-date')?.value || null;
      const preferredTourTime = document.getElementById('inq-tour-time')?.value || null;
      const subject = document.getElementById('inq-subject').value.trim();
      const message = document.getElementById('inq-message').value.trim();

      try {
        const res = await API.submitInquiry({
          schoolId: school.id,
          parentName,
          parentPhone,
          parentWhatsapp,
          parentEmail,
          studentName,
          gradeApplying,
          category,
          tourRequested,
          preferredTourDate,
          preferredTourTime,
          subject,
          message
        });

        this.close();
        Modals.openInquiryConfirmationModal(res.inquiry, school);
        if (onComplete) onComplete(res.inquiry);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openInquiryConfirmationModal(inquiry, school = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 520px; text-align: center;">
        <div style="padding: 2.5rem 2rem 2rem;">
          <div style="width: 72px; height: 72px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.25rem; margin: 0 auto 1.5rem; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.2);">
            ✓
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin-bottom: 0.5rem;">
            Inquiry Successfully Dispatched!
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            Your inquiry has been logged directly into the verified Admissions Desk of <strong>${inquiry.schoolName}</strong>.
          </p>

          <div style="background: var(--bg-main); border: 1.5px dashed var(--primary-300); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">
              Your Official Inquiry Reference Code
            </div>
            <div style="font-family: monospace; font-size: 1.4rem; font-weight: 800; color: var(--primary-900); letter-spacing: 1px;" id="copy-ref-target">
              ${inquiry.inquiryNumber}
            </div>
            <button id="btn-copy-ref" class="btn-pill btn-outline" style="font-size: 0.75rem; padding: 0.3rem 0.85rem; margin-top: 0.65rem;">
              📋 Copy Reference
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="https://wa.me/${((school?.whatsapp || inquiry.parentWhatsapp) || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I submitted an official inquiry on SkoolFinder Ghana (Ref: ${inquiry.inquiryNumber}) for ${inquiry.studentName}.`)}" target="_blank" class="btn-pill" style="background: var(--whatsapp-green); color: #fff; font-weight: 700; text-decoration: none; justify-content: center; padding: 0.75rem 1rem;">
              <span>💬</span> Continue Direct via Admissions WhatsApp
            </a>
            <button type="button" class="btn-pill btn-outline" id="btn-inquiry-done" style="justify-content: center;">
              Return to Platform
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('btn-copy-ref')?.addEventListener('click', () => {
      navigator.clipboard.writeText(inquiry.inquiryNumber);
      State.showToast(`Reference ${inquiry.inquiryNumber} copied to clipboard!`, 'success');
    });

    document.getElementById('btn-inquiry-done').onclick = () => this.close();
  },

  openInquiryThreadModal(inquiry, school, onComplete = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    let statusBadge = '';
    if (inquiry.status === 'Unread') statusBadge = '<span class="badge" style="background: #fef2f2; color: #dc2626; font-weight: 700;">🔴 Unread</span>';
    else if (inquiry.status === 'Tour Scheduled') statusBadge = '<span class="badge" style="background: #eff6ff; color: #2563eb; font-weight: 700;">📅 Tour Scheduled</span>';
    else if (inquiry.status === 'Replied') statusBadge = '<span class="badge" style="background: #f0fdf4; color: #16a34a; font-weight: 700;">🟢 Replied</span>';
    else statusBadge = `<span class="badge" style="background: #faf5ff; color: #9333ea; font-weight: 700;">🟣 ${inquiry.status}</span>`;

    const repliesListHtml = (inquiry.replies || []).map(r => `
      <div style="margin-top: 1rem; padding: 1rem 1.25rem; background: ${r.sender === 'school' ? '#f0fdf4' : 'var(--bg-main)'}; border-left: 3px solid ${r.sender === 'school' ? 'var(--emerald-600)' : 'var(--primary-600)'}; border-radius: var(--radius-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-size: 0.82rem;">
          <strong style="color: var(--primary-900);">
            ${r.sender === 'school' ? '🏫 ' + r.senderName + ' (' + r.senderRole + ')' : '👤 ' + r.senderName}
          </strong>
          <span style="color: var(--text-muted); font-size: 0.75rem;">
            ${new Date(r.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div style="color: var(--text-main); font-size: 0.88rem; line-height: 1.6;">
          ${r.message}
        </div>
      </div>
    `).join('');

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 760px;">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span style="font-family: monospace; font-size: 0.95rem; font-weight: 800; color: var(--primary-900);">${inquiry.inquiryNumber}</span>
              ${statusBadge}
            </div>
            <h3 class="modal-title">${inquiry.subject}</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Inquirer: <strong>${inquiry.parentName}</strong> &bull; Candidate: <strong>${inquiry.studentName}</strong> (${inquiry.gradeApplying})
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem 1.75rem; max-height: 75vh; overflow-y: auto;">
          <!-- Parent & Candidate Dossier Banner -->
          <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.15rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="font-size: 0.85rem; line-height: 1.6;">
              <div><strong>Category:</strong> <span class="badge" style="background: var(--primary-50); color: var(--primary-900);">${inquiry.category}</span></div>
              <div><strong>Contact:</strong> 📞 ${inquiry.parentPhone} &nbsp;|&nbsp; ✉️ ${inquiry.parentEmail || 'Not specified'}</div>
              <div><strong>Logged:</strong> ${new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <a href="https://wa.me/${(inquiry.parentWhatsapp || inquiry.parentPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inquiry.parentName}, this is ${school?.name || 'SkoolFinder Admissions Desk'} responding to your inquiry ${inquiry.inquiryNumber}.`)}" target="_blank" class="btn-pill" style="background: var(--whatsapp-green); color: #fff; font-size: 0.8rem; padding: 0.45rem 1rem; text-decoration: none; font-weight: 700;">
                <span>💬</span> WhatsApp Parent
              </a>
            </div>
          </div>

          <!-- If Campus Tour Requested -->
          ${inquiry.tourRequested ? `
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
              <div style="font-weight: 700; color: #15803d; font-size: 0.9rem; margin-bottom: 0.25rem;">
                📅 In-Person Campus Walkthrough Requested
              </div>
              <div style="font-size: 0.85rem; color: #166534;">
                Requested Date: <strong>${inquiry.preferredTourDate || 'Flexible / Next Available'}</strong> &bull; Time Slot: <strong>${inquiry.preferredTourTime || 'Morning Session'}</strong>
              </div>
            </div>
          ` : ''}

          <!-- Original Inquiry Message -->
          <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-900);">
                👤 ${inquiry.parentName} wrote:
              </div>
              <span style="font-size: 0.75rem; color: var(--text-light);">${new Date(inquiry.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
            <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.65; margin: 0;">
              ${inquiry.message}
            </p>
          </div>

          <!-- Existing Conversation Thread History -->
          ${inquiry.replies && inquiry.replies.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
                Admissions Response History (${inquiry.replies.length})
              </div>
              ${repliesListHtml}
            </div>
          ` : ''}

          <!-- Official School Reply Composer -->
          <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-900); margin-bottom: 0.75rem;">
              ✍️ Send Official Admissions Desk Response
            </div>

            <!-- Quick Template Action Buttons -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
              <button type="button" class="btn-template-pill btn-pill btn-outline" id="btn-tpl-tour" style="font-size: 0.72rem; padding: 0.25rem 0.65rem; background: #fff;">
                + Confirm Campus Tour
              </button>
              <button type="button" class="btn-template-pill btn-pill btn-outline" id="btn-tpl-fees" style="font-size: 0.72rem; padding: 0.25rem 0.65rem; background: #fff;">
                + Fees & Payment Terms
              </button>
              <button type="button" class="btn-template-pill btn-pill btn-outline" id="btn-tpl-entry" style="font-size: 0.72rem; padding: 0.25rem 0.65rem; background: #fff;">
                + Entrance Assessment Details
              </button>
            </div>

            <form id="form-inquiry-reply">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 0.85rem;">
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Responding Officer *</label>
                  <input type="text" id="inq-reply-author" class="form-input" value="${school?.headOfSchool || 'Admissions Secretariat'}" required />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.78rem;">Designation / Title *</label>
                  <input type="text" id="inq-reply-role" class="form-input" value="Head of Admissions & Public Relations" required />
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-size: 0.78rem;">Official Public Statement / Response *</label>
                <textarea id="inq-reply-message" class="form-textarea" rows="4" placeholder="Type your response to the parent, confirm tour dates, or provide fee schedules..." required></textarea>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Update Thread Status:</span>
                  <select id="inq-reply-new-status" class="form-select" style="width: auto; font-size: 0.8rem; padding: 0.3rem 0.65rem;">
                    <option value="Replied" selected>🟢 Mark as Replied</option>
                    <option value="Tour Scheduled">📅 Mark as Tour Scheduled</option>
                    <option value="Resolved">🟣 Mark as Resolved</option>
                    <option value="Unread">🔴 Keep as Unread</option>
                  </select>
                </div>

                <button type="submit" class="btn-pill btn-primary" style="padding: 0.55rem 1.5rem; font-size: 0.85rem;">
                  <span>📨</span> Send Official Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();

    // Quick templates insertion
    const replyArea = document.getElementById('inq-reply-message');
    const statusSelect = document.getElementById('inq-reply-new-status');

    document.getElementById('btn-tpl-tour')?.addEventListener('click', () => {
      replyArea.value = `Dear ${inquiry.parentName},\n\nThank you for reaching out to ${school?.name || 'our institution'}. We are pleased to confirm your guided campus walkthrough for ${inquiry.preferredTourDate || 'Wednesday next week'} at ${inquiry.preferredTourTime || '10:00 AM'}.\n\nPlease check in at our Main Administration Block where our senior student ambassadors and admissions director will receive you.\n\nWarm regards,`;
      if (statusSelect) statusSelect.value = 'Tour Scheduled';
    });

    document.getElementById('btn-tpl-fees')?.addEventListener('click', () => {
      replyArea.value = `Dear ${inquiry.parentName},\n\nThank you for your interest in ${school?.name || 'our school'}. Our current tuition schedule for ${inquiry.gradeApplying} is structured into termly installments, with flexible bank transfer or Mobile Money payment plans.\n\nWe also offer merit-based scholarships for students demonstrating exceptional academic or STEM aptitude. Please find further details at our admissions office.\n\nWarm regards,`;
      if (statusSelect) statusSelect.value = 'Replied';
    });

    document.getElementById('btn-tpl-entry')?.addEventListener('click', () => {
      replyArea.value = `Dear ${inquiry.parentName},\n\nWe would love to welcome ${inquiry.studentName} for the upcoming term. Admission requires completing our online application voucher and sitting for our entrance diagnostic assessment in Mathematics and English.\n\nAssessments are conducted every Saturday morning at our campus testing center.\n\nWarm regards,`;
      if (statusSelect) statusSelect.value = 'Replied';
    });

    // Submit reply
    document.getElementById('form-inquiry-reply').onsubmit = async (e) => {
      e.preventDefault();
      const senderName = document.getElementById('inq-reply-author').value.trim();
      const senderRole = document.getElementById('inq-reply-role').value.trim();
      const message = document.getElementById('inq-reply-message').value.trim();
      const newStatus = document.getElementById('inq-reply-new-status').value;

      try {
        const res = await API.replyToInquiry(inquiry.id, {
          sender: 'school',
          senderName,
          senderRole,
          message,
          newStatus
        });

        this.close();
        State.showToast(`Official reply dispatched to ${inquiry.parentName}!`, 'success');
        if (onComplete) onComplete(res.inquiry);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openTrackInquiryModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 500px;">
        <div class="modal-header">
          <div>
            <span class="badge" style="background: var(--gold-100); color: var(--gold-700); font-weight: 700; margin-bottom: 0.35rem;">
              🔍 Parent Inquiry & Application Tracker
            </span>
            <h3 class="modal-title">Track Inquiry Status</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Enter your official Reference Code (e.g. INQ-GIS-2026-9182 or SD-ADM-...) to view school replies and tour updates.
            </p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-track-inquiry" class="modal-body" style="padding: 1.75rem;">
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" style="font-weight: 700;">Reference Code *</label>
            <input type="text" id="track-inq-code" class="form-input" placeholder="e.g. INQ-GIS-2026-9182" style="font-family: monospace; font-size: 1.05rem; letter-spacing: 1px;" required />
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-track">Cancel</button>
            <button type="submit" class="btn-pill btn-primary" style="padding: 0.65rem 1.75rem;">
              <span>🔍</span> Look Up Status &rarr;
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-track').onclick = () => this.close();

    document.getElementById('form-track-inquiry').onsubmit = async (e) => {
      e.preventDefault();
      const code = document.getElementById('track-inq-code').value.trim();
      try {
        if (code.toUpperCase().startsWith('INQ')) {
          const inq = await API.lookupInquiry(code);
          const school = await API.getSchoolById(inq.schoolId);
          Modals.openInquiryThreadModal(inq, school);
        } else if (code.toUpperCase().startsWith('SD-ADM')) {
          const app = await API.getApplicationById(code);
          Modals.openApplicationDossierModal(app);
        } else {
          // Attempt inquiry lookup first
          try {
            const inq = await API.lookupInquiry(code);
            const school = await API.getSchoolById(inq.schoolId);
            Modals.openInquiryThreadModal(inq, school);
          } catch {
            const app = await API.getApplicationById(code);
            Modals.openApplicationDossierModal(app);
          }
        }
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Feature 4: Interactive Academic Paper & Past Question Study Modal
  openInteractivePaperModal(resource) {
    this.close();
    // Trigger download count increment on open/study
    API.downloadAcademicResource(resource.id).catch(console.error);

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const getExamBadgeStyle = (exam) => {
      if (exam.includes('BECE')) return 'background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;';
      if (exam.includes('WASSCE')) return 'background: #fef3c7; color: #b45309; border: 1px solid #fde68a;';
      if (exam.includes('Cambridge')) return 'background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff;';
      return 'background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;';
    };

    const questions = resource.questions || [];

    const formatScheme = (q) => {
      if (Array.isArray(q.markingScheme) && q.markingScheme.length > 0) {
        return `
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${q.markingScheme.map((item, i) => `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; padding: 0.5rem 0.75rem; background: #ffffff; border-radius: 6px; border: 1px solid #e2e8f0;">
                <span style="flex: 1; color: #1e293b; font-size: 0.86rem; line-height: 1.5;"><strong>Step ${i + 1}:</strong> ${item.step}</span>
                <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 800; font-family: monospace; border: 1px solid #bae6fd; font-size: 0.78rem;">${item.mark || 'M1'}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
      if (typeof q.solution === 'string' && q.solution.trim()) {
        return `<div style="white-space: pre-line; color: #1e293b; font-size: 0.88rem; line-height: 1.6;">${q.solution}</div>`;
      }
      return '<div style="color: #64748b; font-size: 0.85rem;">Step-by-step model solution is guided by official syllabus criteria.</div>';
    };

    const getPitfall = (q) => q.examinerPitfall || q.pitfall || null;
    const getQNum = (q, idx) => q.questionNumber || (q.qNumber ? `Question ${q.qNumber}` : `Question ${idx + 1}`);

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 900px; width: 95vw; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; border-bottom: 2px solid var(--gold-500); padding: 1.25rem 1.5rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
              <span class="badge" style="${getExamBadgeStyle(resource.examType)} font-weight: 700; font-size: 0.75rem;">${resource.examType}</span>
              <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-family: monospace;">${resource.paperCode}</span>
              <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3);">⭐ ${resource.rating || 5.0} Rating</span>
              <span class="badge" style="background: rgba(255,255,255,0.1); color: #cbd5e1;">📥 ${resource.downloadsCount || 1} Downloads</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0 0 0.25rem 0;">${resource.title}</h2>
            <div style="font-size: 0.85rem; color: #94a3b8; display: flex; gap: 1.25rem; flex-wrap: wrap;">
              <span>📚 <strong>Subject:</strong> ${resource.subject}</span>
              <span>📅 <strong>Year:</strong> ${resource.year}</span>
              <span>⏱️ <strong>Duration:</strong> ${resource.duration || '2 Hours'}</span>
              <span>🎯 <strong>Marks:</strong> ${resource.totalMarks || 100}</span>
              <span>🏛️ <strong>Exam Body:</strong> ${resource.examBody || 'WAEC / Cambridge'}</span>
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #cbd5e1; font-size: 1.75rem;">&times;</button>
        </div>

        <!-- Action Bar & Controls -->
        <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="filter-pills" style="margin: 0;">
            <button class="filter-pill active" id="tab-questions" style="padding: 0.4rem 1rem; font-size: 0.85rem;">📄 Question Paper</button>
            <button class="filter-pill" id="tab-marking" style="padding: 0.4rem 1rem; font-size: 0.85rem;">📝 Official Marking Scheme</button>
            <button class="filter-pill" id="tab-pitfalls" style="padding: 0.4rem 1rem; font-size: 0.85rem;">⚠️ Chief Examiner Pitfalls</button>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn-pill btn-gold" id="btn-timed-mock-toggle" style="padding: 0.4rem 0.95rem; font-size: 0.82rem;">
              <span>⏱️</span> Start Timed Mock
            </button>
            <button class="btn-pill btn-outline" id="btn-download-modal-paper" style="padding: 0.4rem 0.9rem; font-size: 0.82rem; background: #fff;" title="Download complete paper with scheme for offline study">
              <span>📥</span> Download Pack
            </button>
            <button class="btn-pill btn-outline" id="btn-print-paper" style="padding: 0.4rem 0.9rem; font-size: 0.82rem; background: #fff;">
              <span>🖨️</span> Print Paper
            </button>
            <button class="btn-pill btn-outline" id="btn-tutor-paper" style="padding: 0.4rem 0.95rem; font-size: 0.82rem; background: #fff;">
              <span>👨‍🏫</span> Book Tutor
            </button>
          </div>
        </div>

        <!-- Timed Mock Countdown Bar (Shown when active) -->
        <div id="mock-timer-bar" style="display: none; background: linear-gradient(135deg, #091e42 0%, #172b4d 100%); color: #fff; padding: 0.75rem 1.5rem; border-bottom: 2px solid var(--gold-500); justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.4rem;">⏳</span>
            <div>
              <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Exam Condition: Timer Running</div>
              <div id="mock-timer-display" style="font-family: monospace; font-size: 1.35rem; font-weight: 900; color: #fbbf24;">
                02:00:00
              </div>
            </div>
          </div>
          <div style="font-size: 0.83rem; color: #cbd5e1; max-width: 420px; line-height: 1.4;">
            🔒 Solutions & marking schemes are locked to simulate real exam conditions. Complete your working on paper or the digital scratchpad!
          </div>
          <button class="btn-pill btn-gold" id="btn-end-mock-early" style="padding: 0.4rem 1rem; font-size: 0.82rem; font-weight: 800;">
            <span>⏹️</span> Finish & Unlock Marking Scheme &rarr;
          </button>
        </div>

        <!-- Topics pill list -->
        <div style="background: #ffffff; padding: 0.6rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Topics Covered:</span>
          ${(resource.topics || []).map(t => `<span class="badge" style="background: #f1f5f9; color: #334155; font-size: 0.75rem; border: 1px solid #e2e8f0;">${t}</span>`).join('')}
        </div>

        <!-- Modal Body / Tab Panes -->
        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;" id="paper-modal-content">
          <!-- Pane 1: Questions -->
          <div id="pane-questions">
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 0.85rem 1rem; border-radius: 6px; margin-bottom: 1.5rem; font-size: 0.85rem; color: #1e40af;">
              <strong>💡 Candidate Instructions:</strong> Answer all questions thoroughly. Show full working steps for computational questions. Mathematical tables and non-programmable scientific calculators may be used where appropriate.
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${questions.map((q, idx) => `
                <div class="card" style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">
                    <div>
                      <span class="badge" style="background: var(--gold-100); color: var(--gold-800); font-weight: 700;">${getQNum(q, idx)}</span>
                      <span style="margin-left: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #64748b;">${q.topic || resource.subject}</span>
                    </div>
                    <span class="badge" style="background: #f1f5f9; color: #475569; font-weight: 700;">[${q.marks || '10'} Marks]</span>
                  </div>

                  <div style="font-size: 0.95rem; color: #1e293b; line-height: 1.6; white-space: pre-line; margin-bottom: 1rem;">
                    ${q.questionText}
                  </div>

                  <!-- Candidate Scratchpad / Working Area -->
                  <div style="margin-top: 0.75rem; margin-bottom: 0.75rem;">
                    <details style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.5rem 0.75rem; background: #fafafa;">
                      <summary style="font-size: 0.8rem; font-weight: 600; color: #64748b; cursor: pointer;">
                        📝 Candidate Working Scratchpad (Type draft calculations / notes here)
                      </summary>
                      <textarea placeholder="Type your equations, formulas, or final values before revealing the official scheme..." style="width: 100%; min-height: 70px; margin-top: 0.5rem; font-family: monospace; font-size: 0.85rem; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; resize: vertical;"></textarea>
                    </details>
                  </div>

                  <!-- Quick Reveal Solution Toggle -->
                  <div class="solution-toggle-wrapper" style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed #e2e8f0;">
                    <button class="btn-pill btn-outline btn-toggle-answer" data-target="ans-${idx}" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
                      <span>👁️</span> Show Step-by-Step Working & Scheme
                    </button>
                    <div id="ans-${idx}" style="display: none; margin-top: 0.85rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem;">
                      <div style="font-weight: 700; color: var(--gold-700); font-size: 0.85rem; margin-bottom: 0.65rem; display: flex; align-items: center; justify-content: space-between;">
                        <span>📋 Model Solution & Marking Criteria:</span>
                        <span class="badge" style="background: #e2e8f0; color: #334155; font-size: 0.75rem;">Official Scheme</span>
                      </div>
                      ${formatScheme(q)}
                      ${getPitfall(q) ? `
                        <div style="margin-top: 0.75rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 0.65rem 0.85rem; font-size: 0.82rem; color: #9f1239;">
                          <strong>⚠️ Chief Examiner Alert:</strong> ${getPitfall(q)}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pane 2: Full Marking Scheme & Solutions -->
          <div id="pane-marking" style="display: none;">
            <!-- Rubric Guide Banner -->
            <div style="background: #fdf4ff; border: 1px solid #f5d0fe; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
              <h4 style="margin: 0 0 0.5rem 0; color: #86198f; font-size: 0.95rem;">Official WAEC & Cambridge Marking Rubric Guide:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-size: 0.82rem;">
                <div style="background: #fff; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #f5d0fe;">
                  <strong style="color: #c026d3;">M (Method Mark):</strong> Awarded for valid mathematical / scientific application regardless of calculation slips.
                </div>
                <div style="background: #fff; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #f5d0fe;">
                  <strong style="color: #16a34a;">A (Accuracy Mark):</strong> Awarded for numerically and algebraically correct answers following valid method.
                </div>
                <div style="background: #fff; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #f5d0fe;">
                  <strong style="color: #2563eb;">B (Independent Mark):</strong> Awarded unconditionally for standalone correct facts, definitions, or drawings.
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${questions.map((q, idx) => `
                <div class="card" style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9;">
                    <h4 style="margin: 0; color: var(--gold-700); font-size: 1rem;">${getQNum(q, idx)} Marking Breakdown</h4>
                    <span class="badge" style="background: #f8fafc; color: #334155; font-weight: 700;">Max: ${q.marks || 10} Marks</span>
                  </div>
                  <div style="padding: 0.5rem; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                    ${formatScheme(q)}
                  </div>
                  ${getPitfall(q) ? `
                    <div style="margin-top: 0.75rem; font-size: 0.85rem; color: #9a3412; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 0.65rem 0.85rem;">
                      <strong>⚠️ Candidate Pitfall:</strong> ${getPitfall(q)}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pane 3: Chief Examiner Pitfalls -->
          <div id="pane-pitfalls" style="display: none;">
            <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
              <h3 style="margin: 0 0 0.5rem 0; color: #c2410c; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚠️</span> WAEC / Cambridge Chief Examiner Official Report
              </h3>
              <p style="font-size: 0.9rem; color: #9a3412; line-height: 1.6; margin: 0;">
                "${resource.chiefExaminerRemarks || 'Candidates performed satisfactorily in standard recall questions but exhibited significant deficiencies in multi-step problem solving, formal proof structures, and accurate unit notation.'}"
              </p>
            </div>

            <h4 style="font-size: 1rem; font-weight: 700; color: #1e293b; margin: 1.25rem 0 0.75rem 0;">
              Specific Candidate Pitfalls & Recommended Remedial Actions:
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${questions.map((q, idx) => `
                <div class="card" style="padding: 1rem; border-radius: 8px; border: 1px solid #fed7aa; background: #fffaf5;">
                  <div style="font-weight: 700; color: #ea580c; font-size: 0.9rem; margin-bottom: 0.35rem;">
                    ${getQNum(q, idx)}: ${q.topic || 'General Problem'}
                  </div>
                  <p style="font-size: 0.85rem; color: #7c2d12; line-height: 1.5; margin: 0 0 0.5rem 0;">
                    ${getPitfall(q) || 'Candidates often rush through calculations without stating intermediary assumptions.'}
                  </p>
                  <div style="font-size: 0.8rem; color: #15803d; background: #f0fdf4; border: 1px solid #dcfce7; padding: 0.4rem 0.6rem; border-radius: 4px;">
                    ✅ <strong>Examiner Tip:</strong> Check answer reasonableness and underline final units clearly.
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Call to action: Hire Tutor -->
            <div style="margin-top: 2rem; background: linear-gradient(135deg, #1e3a8a, #1e40af); color: #fff; padding: 1.5rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h4 style="margin: 0 0 0.25rem 0; font-size: 1.15rem; color: #fff;">Need personalized tutoring for ${resource.subject}?</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #bfdbfe;">
                  Connect with verified Ghanaian examiners and top subject specialists for 1-on-1 exam prep.
                </p>
              </div>
              <button class="btn-pill btn-gold" id="btn-tutor-banner" style="padding: 0.6rem 1.5rem; font-weight: 700;">
                Find ${resource.subject} Tutor &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    // Event handlers
    document.getElementById('modal-close').onclick = () => this.close();

    // Tab switching logic
    const tabQuestions = document.getElementById('tab-questions');
    const tabMarking = document.getElementById('tab-marking');
    const tabPitfalls = document.getElementById('tab-pitfalls');
    const paneQuestions = document.getElementById('pane-questions');
    const paneMarking = document.getElementById('pane-marking');
    const panePitfalls = document.getElementById('pane-pitfalls');

    const setActiveTab = (tab, pane) => {
      [tabQuestions, tabMarking, tabPitfalls].forEach(t => t.classList.remove('active'));
      [paneQuestions, paneMarking, panePitfalls].forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      pane.style.display = 'block';
    };

    tabQuestions.onclick = () => setActiveTab(tabQuestions, paneQuestions);
    tabMarking.onclick = () => setActiveTab(tabMarking, paneMarking);
    tabPitfalls.onclick = () => setActiveTab(tabPitfalls, panePitfalls);

    // Answer toggles
    document.querySelectorAll('.btn-toggle-answer').forEach(btn => {
      btn.onclick = () => {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl.style.display === 'none') {
          targetEl.style.display = 'block';
          btn.innerHTML = '<span>🙈</span> Hide Model Solution';
        } else {
          targetEl.style.display = 'none';
          btn.innerHTML = '<span>👁️</span> Show Step-by-Step Working & Scheme';
        }
      };
    });

    // Tutor cross-sell triggers
    const triggerTutorBooking = () => {
      if (this._mockTimerInterval) {
        clearInterval(this._mockTimerInterval);
        this._mockTimerInterval = null;
      }
      this.close();
      if (typeof JobsView !== 'undefined') {
        JobsView.activeTab = 'teachers';
        JobsView.teacherFilters.search = resource.subject;
        JobsView.teacherFilters.subject = 'All';
      }
      App.navigate('jobs');
      setTimeout(() => {
        const searchEl = document.getElementById('tch-search-input');
        if (searchEl) {
          searchEl.value = resource.subject;
        }
        State.showToast(`Showing vetted tutors specializing in ${resource.subject} (${resource.examType})`, 'info');
      }, 150);
    };

    const btnTutorPaper = document.getElementById('btn-tutor-paper');
    if (btnTutorPaper) btnTutorPaper.onclick = triggerTutorBooking;

    const btnTutorBanner = document.getElementById('btn-tutor-banner');
    if (btnTutorBanner) btnTutorBanner.onclick = triggerTutorBooking;

    // Download Revision Pack trigger
    const btnDownloadModal = document.getElementById('btn-download-modal-paper');
    if (btnDownloadModal) {
      btnDownloadModal.onclick = () => {
        if (typeof ResourcesView !== 'undefined' && ResourcesView.downloadPaperDocument) {
          ResourcesView.downloadPaperDocument(resource);
        } else {
          API.downloadAcademicResource(resource.id).then(() => {
            State.showToast(`Downloaded revision pack for ${resource.paperCode}`, 'success');
          });
        }
      };
    }

    // Print paper trigger
    document.getElementById('btn-print-paper').onclick = () => {
      window.print();
    };

    // Timed Mock Exam Mode Logic
    let isMockActive = false;
    let remainingSeconds = 7200; // default 2 hours

    if (resource.duration) {
      const dLower = resource.duration.toLowerCase();
      let totalMins = 0;
      const hoursMatch = dLower.match(/(\d+)\s*(hour|hr)/);
      const minsMatch = dLower.match(/(\d+)\s*(min)/);
      if (hoursMatch) totalMins += parseInt(hoursMatch[1], 10) * 60;
      if (minsMatch) totalMins += parseInt(minsMatch[1], 10);
      if (totalMins > 0) remainingSeconds = totalMins * 60;
    }

    const mockTimerBar = document.getElementById('mock-timer-bar');
    const mockTimerDisplay = document.getElementById('mock-timer-display');
    const btnTimedMock = document.getElementById('btn-timed-mock-toggle');
    const btnEndMock = document.getElementById('btn-end-mock-early');

    const formatTimer = (sec) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const endMockMode = () => {
      if (this._mockTimerInterval) {
        clearInterval(this._mockTimerInterval);
        this._mockTimerInterval = null;
      }
      isMockActive = false;
      if (mockTimerBar) mockTimerBar.style.display = 'none';
      if (btnTimedMock) {
        btnTimedMock.innerHTML = '<span>⏱️</span> Start Timed Mock';
        btnTimedMock.className = 'btn-pill btn-gold';
      }
      // Re-enable solutions and tabs
      document.querySelectorAll('.solution-toggle-wrapper').forEach(w => {
        const lockMsg = w.querySelector('.mock-locked-notice');
        if (lockMsg) lockMsg.remove();
        const toggleBtn = w.querySelector('.btn-toggle-answer');
        if (toggleBtn) toggleBtn.style.display = 'inline-flex';
      });
      if (tabMarking) {
        tabMarking.style.opacity = '1';
        tabMarking.style.pointerEvents = 'auto';
        tabMarking.removeAttribute('title');
      }
      State.showToast('🎉 Mock Exam Finished! Official marking schemes and step-by-step rubrics are now unlocked. Grade yourself!', 'success');
    };

    const startMockMode = () => {
      isMockActive = true;
      if (mockTimerBar) mockTimerBar.style.display = 'flex';
      if (mockTimerDisplay) mockTimerDisplay.innerText = formatTimer(remainingSeconds);
      if (btnTimedMock) {
        btnTimedMock.innerHTML = '<span>⏹️</span> Exit Mock Mode';
        btnTimedMock.className = 'btn-pill btn-outline';
      }
      // Switch to questions tab
      setActiveTab(tabQuestions, paneQuestions);
      // Lock marking tab
      if (tabMarking) {
        tabMarking.style.opacity = '0.5';
        tabMarking.style.pointerEvents = 'none';
        tabMarking.title = 'Marking scheme is locked during Mock Exam';
      }
      // Lock answer toggle buttons
      document.querySelectorAll('.solution-toggle-wrapper').forEach(w => {
        const toggleBtn = w.querySelector('.btn-toggle-answer');
        if (toggleBtn) toggleBtn.style.display = 'none';
        const ansDiv = w.querySelector('[id^="ans-"]');
        if (ansDiv) ansDiv.style.display = 'none';
        if (!w.querySelector('.mock-locked-notice')) {
          const lock = document.createElement('div');
          lock.className = 'mock-locked-notice';
          lock.style.cssText = 'font-size: 0.8rem; color: #b45309; font-style: italic; background: #fffbeb; padding: 0.4rem 0.6rem; border-radius: 4px; display: inline-block;';
          lock.innerHTML = '🔒 Solutions locked in Mock Mode. Complete on scratchpad or paper first!';
          w.appendChild(lock);
        }
      });

      if (this._mockTimerInterval) clearInterval(this._mockTimerInterval);
      this._mockTimerInterval = setInterval(() => {
        remainingSeconds--;
        if (mockTimerDisplay) mockTimerDisplay.innerText = formatTimer(remainingSeconds);
        if (remainingSeconds <= 0) {
          endMockMode();
        }
      }, 1000);

      State.showToast(`⏱️ Timed Mock started: ${resource.duration || '2 Hours'}. Good luck!`, 'info');
    };

    if (btnTimedMock) {
      btnTimedMock.onclick = () => {
        if (!isMockActive) {
          startMockMode();
        } else {
          if (confirm('Are you sure you want to exit Timed Mock Mode and view marking schemes?')) {
            endMockMode();
          }
        }
      };
    }

    if (btnEndMock) {
      btnEndMock.onclick = () => {
        if (confirm('Finish exam and unlock official marking schemes for self-grading?')) {
          endMockMode();
        }
      };
    }
  },

  openUploadResourceModal(onComplete) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 650px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">
              Academic Contributor Network
            </div>
            <h3 class="modal-title">Upload Past Question Paper or Revision Pack</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Contribute verified WAEC, Cambridge, or GES mock examinations to support Ghanaian students and schools nationwide.
            </p>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-upload-resource" class="modal-body" style="padding: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Paper / Resource Title *</label>
            <input type="text" id="up-title" class="form-input" placeholder="e.g. 2024 WAEC BECE Social Studies Mock Series" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Exam Body & Level *</label>
              <select id="up-exam-type" class="form-select" required>
                <option value="BECE">WAEC BECE (JHS)</option>
                <option value="WASSCE">WAEC WASSCE (SHS)</option>
                <option value="Cambridge IGCSE">Cambridge IGCSE</option>
                <option value="Cambridge A-Levels">Cambridge A-Levels</option>
                <option value="GES National Assessment">GES National Assessment (NSAT)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Subject *</label>
              <input type="text" id="up-subject" class="form-input" placeholder="e.g. Integrated Science, Mathematics" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label class="form-label">Exam Year *</label>
              <input type="number" id="up-year" class="form-input" value="2024" min="2010" max="2027" required />
            </div>
            <div class="form-group">
              <label class="form-label">Duration</label>
              <input type="text" id="up-duration" class="form-input" value="2 Hours 30 Mins" />
            </div>
            <div class="form-group">
              <label class="form-label">Total Marks</label>
              <input type="number" id="up-marks" class="form-input" value="100" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Key Syllabus Topics Covered (comma separated)</label>
            <input type="text" id="up-topics" class="form-input" placeholder="e.g. Sets, Algebra, Coordinate Geometry, Circle Theorems" />
          </div>

          <div class="form-group">
            <label class="form-label">Chief Examiner Summary / Key Advice</label>
            <textarea id="up-remarks" class="form-textarea" rows="2" placeholder="e.g. Candidates must avoid protractor measurements when compass construction is explicitly instructed."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Sample Question 1 Text *</label>
            <textarea id="up-q1-text" class="form-textarea" rows="3" placeholder="Enter full question text..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Step-by-Step Marking Scheme & Solution *</label>
            <textarea id="up-q1-sol" class="form-textarea" rows="3" placeholder="Enter step-by-step method and mark allocations (M1, A1, B1)..." required></textarea>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-upload">Cancel</button>
            <button type="submit" class="btn-pill btn-primary" style="padding: 0.65rem 1.75rem;">
              <span>📤</span> Publish Academic Paper
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-upload').onclick = () => this.close();

    document.getElementById('form-upload-resource').onsubmit = async (e) => {
      e.preventDefault();
      const title = document.getElementById('up-title').value.trim();
      const examType = document.getElementById('up-exam-type').value;
      const subject = document.getElementById('up-subject').value.trim();
      const year = parseInt(document.getElementById('up-year').value, 10);
      const duration = document.getElementById('up-duration').value.trim();
      const totalMarks = parseInt(document.getElementById('up-marks').value, 10);
      const topicsRaw = document.getElementById('up-topics').value;
      const topics = topicsRaw ? topicsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['General Syllabus'];
      const chiefExaminerRemarks = document.getElementById('up-remarks').value.trim();
      const q1Text = document.getElementById('up-q1-text').value.trim();
      const q1Sol = document.getElementById('up-q1-sol').value.trim();

      const newResource = {
        title,
        examType,
        subject,
        year,
        duration,
        totalMarks,
        topics,
        chiefExaminerRemarks: chiefExaminerRemarks || "Ensure step-by-step working is demonstrated in accordance with official examination guidelines.",
        questions: [
          {
            qNumber: 1,
            topic: topics[0] || subject,
            marks: totalMarks,
            questionText: q1Text,
            solution: q1Sol,
            pitfall: chiefExaminerRemarks
          }
        ]
      };

      try {
        const created = await API.createAcademicResource(newResource);
        this.close();
        State.showToast(`Paper "${title}" published successfully to Resource Hub!`, 'success');
        if (onComplete) onComplete(created);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // Feature 5: Role-Based Authentication & Security Modals
  openLoginModal(options = {}) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const notice = options.notice || null;
    const initialTab = options.initialTab || (options.mode === 'register' || options.mode === 'signup' ? 'signup' : 'signin');

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 540px; border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        <!-- Modal Top Header Banner -->
        <div class="modal-header" style="background: linear-gradient(135deg, #091e42 0%, #0f172a 100%); color: #fff; padding: 1.25rem 1.5rem; border-bottom: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 0.76rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem;">
              <span>🛡️</span> Secure Authentication (Supabase Auth + Ghana SMS OTP)
            </div>
            <h3 class="modal-title" style="color: #fff; font-size: 1.35rem; margin-top: 0.25rem;" id="auth-modal-main-title">
              ${initialTab === 'signup' ? 'Create New Parent Account' : 'Sign In to SkoolFinder'}
            </h3>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #cbd5e1; font-size: 1.5rem;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.4rem 1.6rem; max-height: 80vh; overflow-y: auto;">
          ${notice ? `
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.15rem; font-size: 0.84rem; color: #1e40af; line-height: 1.5;">
              ${notice}
            </div>
          ` : ''}

          <!-- 3-Way Top Navigation Tabs: Sign In / Parent Sign Up / SMS OTP -->
          <div style="display: flex; gap: 0.35rem; margin-bottom: 1.25rem; background: #f1f5f9; padding: 0.3rem; border-radius: 12px; border: 1px solid #e2e8f0;">
            <button type="button" id="tab-auth-signin" style="flex: 1; border: none; padding: 0.65rem 0.5rem; font-size: 0.84rem; font-weight: 800; border-radius: 8px; cursor: pointer; background: ${initialTab === 'signin' ? '#0a1128' : 'transparent'}; color: ${initialTab === 'signin' ? '#ffffff' : '#475569'}; transition: all 0.2s;">
              🔑 Sign In
            </button>
            <button type="button" id="tab-auth-signup" style="flex: 1.2; border: none; padding: 0.65rem 0.5rem; font-size: 0.84rem; font-weight: 800; border-radius: 8px; cursor: pointer; background: ${initialTab === 'signup' ? '#0a1128' : 'transparent'}; color: ${initialTab === 'signup' ? '#ffffff' : '#475569'}; transition: all 0.2s;">
              ✨ New Parent Sign Up
            </button>
            <button type="button" id="tab-auth-otp" style="flex: 0.95; border: none; padding: 0.65rem 0.5rem; font-size: 0.84rem; font-weight: 800; border-radius: 8px; cursor: pointer; background: ${initialTab === 'otp' ? '#0a1128' : 'transparent'}; color: ${initialTab === 'otp' ? '#ffffff' : '#475569'}; transition: all 0.2s;">
              📱 SMS OTP
            </button>
          </div>

          <!-- ========================================================= -->
          <!-- PANE 1: Sign In for Existing Account Holders              -->
          <!-- ========================================================= -->
          <div id="auth-pane-signin" style="display: ${initialTab === 'signin' ? 'block' : 'none'};">

            <form id="form-auth-login">
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Email Address or Account Login *</label>
                <input type="text" id="auth-login-input" class="form-input" placeholder="e.g. parent@gmail.com or 024 412 3456" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.92rem;" />
              </div>

              <div class="form-group" style="margin-bottom: 1.15rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155; margin: 0;">Password *</label>
                  <button type="button" id="btn-toggle-pass-visibility" style="background: none; border: none; color: #0284c7; font-size: 0.78rem; cursor: pointer; font-weight: 700;">Show</button>
                </div>
                <input type="password" id="auth-password-input" class="form-input" placeholder="Enter your password" required style="width: 100%; padding: 0.75rem 0.9rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.92rem;" />
              </div>

              <!-- High Visibility Prominent Sign In Button -->
              <button type="submit" id="btn-submit-login" class="btn-pill btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 100%); color: #ffffff; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 14px rgba(10,17,40,0.3); display: flex; align-items: center; gap: 0.5rem;">
                <span>🔑</span> Sign In to SkoolFinder
              </button>
            </form>

            <div style="text-align: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b;">
              Don't have an account yet? 
              <button type="button" id="link-switch-to-signup" style="background: none; border: none; color: #d97706; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.85rem; padding: 0; margin-left: 0.25rem;">
                Create New Parent Account &rarr;
              </button>
            </div>
          </div>

          <!-- ========================================================= -->
          <!-- PANE 2: Create New Parent Account (Sign Up)               -->
          <!-- ========================================================= -->
          <div id="auth-pane-signup" style="display: ${initialTab === 'signup' ? 'block' : 'none'};">
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 0.75rem 0.9rem; margin-bottom: 1.15rem; font-size: 0.82rem; color: #1e40af; line-height: 1.45;">
              👨‍👩‍👧 <strong>New Parent Registration:</strong> Set up your parent account to submit admissions, monitor entrance exams, and settle term fees via MoMo.
            </div>

            <form id="form-modal-parent-register">
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Parent / Guardian Full Name *</label>
                <input type="text" id="mreg-parent-name" class="form-input" placeholder="e.g. Mrs. Vivian Arthur" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Ghana Mobile Phone *</label>
                  <input type="tel" id="mreg-parent-phone" class="form-input" placeholder="e.g. 024 412 3456" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" />
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Email Address *</label>
                  <input type="email" id="mreg-parent-email" class="form-input" placeholder="e.g. vivian@gmail.com" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" />
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Create Password (Min 6 characters) *</label>
                <input type="password" id="mreg-parent-password" class="form-input" placeholder="Create a secure password" required minlength="6" style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" />
              </div>

              <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Child / Ward Full Name *</label>
                  <input type="text" id="mreg-child-name" class="form-input" placeholder="e.g. Kwame Mensah" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem;" />
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Academic Level *</label>
                  <select id="mreg-child-level" class="form-select" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem;">
                    <option value="Primary (Class 1-6)" selected>Primary (Class 1-6)</option>
                    <option value="Kindergarten / Nursery">Kindergarten / Nursery</option>
                    <option value="Junior High (JHS 1-3 / BECE)">Junior High (JHS 1-3 / BECE)</option>
                    <option value="Senior High (SHS 1-3 / WASSCE)">Senior High (SHS 1-3 / WASSCE)</option>
                    <option value="Cambridge IGCSE / A-Levels">Cambridge IGCSE / A-Levels</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 1.15rem;">
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Target School for Admission *</label>
                <select id="mreg-target-school" class="form-select" required style="width: 100%; padding: 0.7rem 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.88rem;">
                  <option value="sch-gis-accra" selected>Ghana International School (GIS) - Cantonments, Accra</option>
                  <option value="sch-sos-tema">SOS-Hermann Gmeiner International College - Tema</option>
                  <option value="sch-morning-star-cantonments">Morning Star School - Cantonments, Accra</option>
                  <option value="sch-achimota-accra">Achimota Basic & Senior High School - Achimota</option>
                  <option value="sch-tema-intl">Tema International School (TIS) - Tema</option>
                  <option value="sch-roman-ridge">The Roman Ridge School - Roman Ridge, Accra</option>
                  <option value="sch-alpha-beta-dansoman">Alpha Beta Education Centres - Dansoman</option>
                </select>
              </div>

              <!-- High Visibility Prominent Sign Up Button -->
              <button type="submit" id="btn-submit-mreg-parent" class="btn-pill btn-gold" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1.05rem; font-weight: 800; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4); display: flex; align-items: center; gap: 0.5rem;">
                <span>✨</span> Create Parent Account & Register Ward &rarr;
              </button>
            </form>

            <div style="text-align: center; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b;">
              Already registered? 
              <button type="button" id="link-switch-to-signin" style="background: none; border: none; color: #1e40af; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.85rem; padding: 0; margin-left: 0.25rem;">
                Sign In to Existing Account &rarr;
              </button>
            </div>
          </div>

          <!-- ========================================================= -->
          <!-- PANE 3: Ghana Mobile Phone SMS OTP (Hubtel Failover)      -->
          <!-- ========================================================= -->
          <div id="auth-pane-otp" style="display: ${initialTab === 'otp' ? 'block' : 'none'};">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
              <div style="font-weight: 700; color: #166534; font-size: 0.85rem; margin-bottom: 0.25rem;">
                🇬🇭 Instant Ghana Phone Login
              </div>
              <p style="font-size: 0.8rem; color: #15803d; margin: 0; line-height: 1.4;">
                No password required. Enter your MTN, Telecel, or AT mobile number to receive a 6-digit verification code directly via SMS.
              </p>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Ghana Mobile Number *</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="tel" id="otp-phone-input" class="form-input" placeholder="e.g. 024 431 8900" style="flex: 1; padding: 0.75rem 0.9rem; border: 1.5px solid #cbd5e1; border-radius: 8px;" />
                <button type="button" id="btn-send-otp" class="btn-pill btn-outline" style="white-space: nowrap; font-size: 0.82rem; font-weight: 700; padding: 0.6rem 0.9rem;">
                  <span>📨</span> Send OTP
                </button>
              </div>
              <div id="otp-send-status" style="font-size: 0.78rem; color: #64748b; margin-top: 0.4rem; display: none;"></div>
            </div>

            <div id="otp-verify-section" style="display: none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" style="font-size: 0.82rem; font-weight: 700; color: #334155;">Enter 6-Digit SMS Code *</label>
                <input type="text" id="otp-code-input" class="form-input" placeholder="6-digit code" maxlength="6" style="font-size: 1.25rem; letter-spacing: 0.25em; text-align: center; font-weight: 800;" />
              </div>
              <button type="button" id="btn-verify-otp" class="btn-pill btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; font-size: 0.95rem; font-weight: 700;">
                <span>✅</span> Verify & Enter Parents Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();

    // Tab Switching Function
    const setModalTab = (tab) => {
      const tabSignin = document.getElementById('tab-auth-signin');
      const tabSignup = document.getElementById('tab-auth-signup');
      const tabOtp = document.getElementById('tab-auth-otp');
      const paneSignin = document.getElementById('auth-pane-signin');
      const paneSignup = document.getElementById('auth-pane-signup');
      const paneOtp = document.getElementById('auth-pane-otp');
      const mainTitle = document.getElementById('auth-modal-main-title');

      if (tabSignin) {
        tabSignin.style.background = tab === 'signin' ? '#0a1128' : 'transparent';
        tabSignin.style.color = tab === 'signin' ? '#ffffff' : '#475569';
      }
      if (tabSignup) {
        tabSignup.style.background = tab === 'signup' ? '#0a1128' : 'transparent';
        tabSignup.style.color = tab === 'signup' ? '#ffffff' : '#475569';
      }
      if (tabOtp) {
        tabOtp.style.background = tab === 'otp' ? '#0a1128' : 'transparent';
        tabOtp.style.color = tab === 'otp' ? '#ffffff' : '#475569';
      }

      if (paneSignin) paneSignin.style.display = tab === 'signin' ? 'block' : 'none';
      if (paneSignup) paneSignup.style.display = tab === 'signup' ? 'block' : 'none';
      if (paneOtp) paneOtp.style.display = tab === 'otp' ? 'block' : 'none';

      if (mainTitle) {
        mainTitle.innerText = tab === 'signup' 
          ? 'Create New Parent Account' 
          : (tab === 'otp' ? 'Ghana Phone SMS OTP Sign In' : 'Sign In to SkoolFinder');
      }
    };

    document.getElementById('tab-auth-signin').onclick = () => setModalTab('signin');
    document.getElementById('tab-auth-signup').onclick = () => setModalTab('signup');
    document.getElementById('tab-auth-otp').onclick = () => setModalTab('otp');
    document.getElementById('link-switch-to-signup')?.addEventListener('click', () => setModalTab('signup'));
    document.getElementById('link-switch-to-signin')?.addEventListener('click', () => setModalTab('signin'));

    // Toggle password visibility
    const passInput = document.getElementById('auth-password-input');
    const toggleBtn = document.getElementById('btn-toggle-pass-visibility');
    if (toggleBtn && passInput) {
      toggleBtn.onclick = () => {
        if (passInput.type === 'password') {
          passInput.type = 'text';
          toggleBtn.innerText = 'Hide';
        } else {
          passInput.type = 'password';
          toggleBtn.innerText = 'Show';
        }
      };
    }


    // Ghana Phone SMS OTP handlers
    const sendOtpBtn = document.getElementById('btn-send-otp');
    const phoneInput = document.getElementById('otp-phone-input');
    const otpStatus = document.getElementById('otp-send-status');
    const verifySection = document.getElementById('otp-verify-section');
    const verifyOtpBtn = document.getElementById('btn-verify-otp');
    const codeInput = document.getElementById('otp-code-input');

    sendOtpBtn.onclick = async () => {
      const phone = phoneInput.value.trim();
      if (!phone) {
        State.showToast('Please enter your Ghanaian mobile number', 'error');
        return;
      }
      sendOtpBtn.disabled = true;
      sendOtpBtn.innerText = 'Sending SMS...';

      try {
        const res = await API.sendOTP(phone);
        phoneInput.disabled = true;
        sendOtpBtn.innerText = 'Sent ✓';
        otpStatus.style.display = 'block';
        otpStatus.style.color = '#15803d';
        otpStatus.innerHTML = `✓ Code dispatched to <strong>${res.phone}</strong> (${res.network}). ${res.debugCode ? `<span style="background: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #854d0e;">Code: ${res.debugCode}</span>` : ''}`;
        verifySection.style.display = 'block';
        if (res.debugCode) codeInput.value = res.debugCode;
        codeInput.focus();
        State.showToast(`SMS OTP sent to ${res.phone}`, 'success');
      } catch (err) {
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerText = 'Send OTP';
        State.showToast(err.message, 'error');
      }
    };

    verifyOtpBtn.onclick = async () => {
      const phone = phoneInput.value.trim();
      const code = codeInput.value.trim();
      if (!code || code.length < 6) {
        State.showToast('Please enter the 6-digit code sent via SMS', 'error');
        return;
      }

      verifyOtpBtn.disabled = true;
      verifyOtpBtn.innerText = 'Verifying...';

      try {
        const res = await API.verifyOTP(phone, code);
        State.setCurrentUser(res.user, res.token);
        this.close();

        if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
          document.getElementById('header-root').innerHTML = Navbar.render();
          Navbar.attachEvents();
        }

        State.showToast(`Welcome back, ${res.user.name}! Verified via Ghana SMS OTP.`, 'success');
        if (options.onSuccess) {
          options.onSuccess(res.user);
        } else if (options.redirectView) {
          App.navigate(options.redirectView, options.redirectParam || null);
        } else {
          App.navigate(State.getUserPortal());
        }
      } catch (err) {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.innerText = 'Verify & Enter Parents Portal';
        State.showToast(err.message, 'error');
      }
    };

    // Form 1: Email & Password Sign In
    document.getElementById('form-auth-login').onsubmit = async (e) => {
      e.preventDefault();
      const login = document.getElementById('auth-login-input').value.trim();
      const password = document.getElementById('auth-password-input').value;
      const submitBtn = document.getElementById('btn-submit-login');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Verifying credentials...';

      try {
        const res = await API.login(login, password);
        State.setCurrentUser(res.user, res.token);
        this.close();

        if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
          document.getElementById('header-root').innerHTML = Navbar.render();
          Navbar.attachEvents();
        }

        State.showToast(`Welcome back, ${res.user.name}! Accessing ${res.user.role.toUpperCase()} workspace.`, 'success');

        if (options.onSuccess) {
          options.onSuccess(res.user);
        } else if (options.redirectView) {
          App.navigate(options.redirectView, options.redirectParam || null);
        } else {
          if (res.user.role === 'school_admin') {
            App.navigate('schools', res.user.schoolId || 'sch-gis-accra');
          } else if (res.user.role === 'parent') {
            App.navigate('parents');
          } else if (res.user.role === 'teacher') {
            App.navigate('teachers');
          } else if (res.user.role === 'supplier') {
            App.navigate('suppliers');
          } else if (res.user.role === 'super_admin') {
            App.navigate('admin');
          } else {
            App.refreshCurrentView();
          }
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🔑</span> Sign In to SkoolFinder';
        State.showToast(err.message, 'error');
      }
    };

    // Form 2: New Parent Registration (Sign Up)
    document.getElementById('form-modal-parent-register').onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('mreg-parent-name').value.trim();
      const phone = document.getElementById('mreg-parent-phone').value.trim();
      const email = document.getElementById('mreg-parent-email').value.trim();
      const password = document.getElementById('mreg-parent-password').value;
      const childName = document.getElementById('mreg-child-name').value.trim();
      const childLevel = document.getElementById('mreg-child-level').value;
      const targetSchoolId = document.getElementById('mreg-target-school').value;
      const submitBtn = document.getElementById('btn-submit-mreg-parent');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Creating Parent Account...';

      try {
        const res = await API.register({
          role: 'parent',
          name,
          phone,
          email,
          password,
          childName,
          childLevel,
          targetSchoolId,
          suburb: 'Ghana'
        });

        State.setCurrentUser(res.user, res.token);
        this.close();

        if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
          document.getElementById('header-root').innerHTML = Navbar.render();
          Navbar.attachEvents();
        }

        State.showToast(`🎉 Welcome, ${res.user.name}! Your parent account & admission tracking are active.`, 'success');

        if (options.onSuccess) {
          options.onSuccess(res.user);
        } else {
          App.navigate('parents');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>✨</span> Create Parent Account & Register Ward &rarr;';
        State.showToast(err.message, 'error');
      }
    };
  },

  // Backward compatibility alias: openRegisterModal delegates to openLoginModal on the sign up tab
  openRegisterModal(options = {}) {
    this.openLoginModal({ ...options, initialTab: 'signup' });
  },

  openFeePaymentModal(invoice, onPaidCallback = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const balance = Number(invoice.balanceDue) || 0;
    const initialPayerPhone = State.currentUser?.phone || invoice.parentPhone || '+233244987654';
    const initialPayerName = State.currentUser?.name || invoice.parentName || 'Parent / Guardian';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 620px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-900) 0%, #1e3a8a 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
              🇬🇭 GHANA INSTANT MOMO FEE SETTLEMENT
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; margin: 0.25rem 0 0.15rem 0; color: #ffffff;">
              Pay School Fees Online
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">
              ${invoice.schoolName} &nbsp;•&nbsp; Inv: <code style="color: var(--gold-300); font-weight: 700;">${invoice.invoiceNumber}</code>
            </div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <!-- Invoice Target Student Summary -->
          <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Student / Ward</div>
              <div style="font-weight: 800; color: var(--primary-900); font-size: 1.05rem;">${invoice.studentName}</div>
              <div style="font-size: 0.8rem; color: var(--text-dark);">${invoice.studentGrade} &nbsp;|&nbsp; ${invoice.term}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Outstanding Balance</div>
              <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--rose-600);">
                GH₵ ${balance.toLocaleString()}
              </div>
            </div>
          </div>

          <!-- Fee Line Items Breakdown -->
          <div style="margin-bottom: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
            <div style="background: #f1f5f9; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 800; color: var(--text-dark); text-transform: uppercase; display: flex; justify-content: space-between;">
              <span>Itemized Fee Schedule</span>
              <span>Amount (GH₵)</span>
            </div>
            <div style="max-height: 140px; overflow-y: auto;">
              ${(invoice.lineItems || []).map(item => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 1rem; font-size: 0.85rem; border-bottom: 1px solid #f1f5f9;">
                  <span style="color: var(--text-dark);">${item.description}</span>
                  <span style="font-weight: 600; color: var(--primary-900);">GH₵ ${Number(item.amount).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
            <div style="background: #fafafa; padding: 0.6rem 1rem; font-size: 0.85rem; display: flex; justify-content: space-between; border-top: 2px solid var(--border-color); font-weight: 700;">
              <span>Total Term Bill:</span>
              <span style="color: var(--primary-900);">GH₵ ${Number(invoice.totalAmount).toLocaleString()}</span>
            </div>
            <div style="background: #ffffff; padding: 0.4rem 1rem; font-size: 0.82rem; display: flex; justify-content: space-between; color: var(--emerald-600);">
              <span>Total Paid Prior:</span>
              <span>- GH₵ ${Number(invoice.amountPaid).toLocaleString()}</span>
            </div>
          </div>

          <form id="form-fee-payment">
            <!-- Payment Amount Selection -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Select Payment Type *</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem;">
                <label style="border: 2px solid var(--primary-600); background: var(--primary-50); border-radius: var(--radius-md); padding: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                  <input type="radio" name="payment-type" value="full" checked id="pay-type-full" />
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary-900);">Full Balance</div>
                    <div style="font-size: 0.8rem; color: var(--primary-700); font-weight: 700;">GH₵ ${balance.toLocaleString()}</div>
                  </div>
                </label>
                <label style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                  <input type="radio" name="payment-type" value="partial" id="pay-type-partial" />
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-dark);">Installment Deposit</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Custom GH₵ Amount</div>
                  </div>
                </label>
              </div>
              <div id="wrap-custom-amount" style="display: none; margin-top: 0.5rem;">
                <label class="form-label" style="font-size: 0.8rem;">Installment Amount (GH₵) *</label>
                <input type="number" id="input-payment-amount" class="form-input" min="100" max="${balance}" value="${Math.min(balance, 2500)}" />
              </div>
            </div>

            <!-- Ghana Mobile Money Network Selector -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Select Mobile Money / Card Provider *</label>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;" id="momo-network-selector">
                <button type="button" class="btn-momo-network active" data-network="MTN Mobile Money" style="border: 2px solid #eab308; background: #fefce8; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <div style="font-size: 1.25rem;">🟡</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #854d0e;">MTN MoMo</div>
                </button>
                <button type="button" class="btn-momo-network" data-network="Telecel Cash" style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <div style="font-size: 1.25rem;">🔴</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #991b1b;">Telecel</div>
                </button>
                <button type="button" class="btn-momo-network" data-network="AT Money" style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <div style="font-size: 1.25rem;">🔵</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: #1e40af;">AT Money</div>
                </button>
                <button type="button" class="btn-momo-network" data-network="Ghana Pay / Card" style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <div style="font-size: 1.25rem;">💳</div>
                  <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-dark);">Card/Bank</div>
                </button>
              </div>
            </div>

            <!-- MoMo Phone & Payer Name -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Mobile Money Wallet Number *</label>
                <input type="tel" id="pay-momo-phone" class="form-input" value="${initialPayerPhone}" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Payer Full Name *</label>
                <input type="text" id="pay-payer-name" class="form-input" value="${initialPayerName}" required />
              </div>
            </div>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">🔒</span>
              <div style="font-size: 0.78rem; color: #1e3a8a; line-height: 1.4;">
                <strong>Bank of Ghana & GhIPSS Compliant:</strong> Instant prompt approval sent straight to your phone. Zero processing surcharges for tuition collections.
              </div>
            </div>

            <button type="submit" id="btn-submit-momo-pay" class="btn-pill btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 1rem; font-weight: 800;">
              <span>📱</span> Authorize MoMo Payment (GH₵ <span id="lbl-pay-amount">${balance.toLocaleString()}</span>)
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();

    // Toggle full vs partial
    const fullRadio = document.getElementById('pay-type-full');
    const partialRadio = document.getElementById('pay-type-partial');
    const customWrap = document.getElementById('wrap-custom-amount');
    const customInput = document.getElementById('input-payment-amount');
    const lblAmount = document.getElementById('lbl-pay-amount');

    let currentAmount = balance;
    let selectedNetwork = "MTN Mobile Money";

    const updateAmountDisplay = () => {
      if (fullRadio.checked) {
        currentAmount = balance;
        customWrap.style.display = 'none';
      } else {
        currentAmount = Number(customInput.value) || 0;
        customWrap.style.display = 'block';
      }
      lblAmount.innerText = currentAmount.toLocaleString();
    };

    fullRadio.onchange = updateAmountDisplay;
    partialRadio.onchange = updateAmountDisplay;
    customInput.oninput = updateAmountDisplay;

    // Network selector
    document.querySelectorAll('.btn-momo-network').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.btn-momo-network').forEach(b => {
          b.style.border = '1px solid var(--border-color)';
          b.style.background = '#ffffff';
        });
        btn.style.border = '2px solid var(--primary-700)';
        btn.style.background = 'var(--primary-50)';
        selectedNetwork = btn.dataset.network;
      };
    });

    // Submit MoMo payment
    document.getElementById('form-fee-payment').onsubmit = async (e) => {
      e.preventDefault();
      const momoPhone = document.getElementById('pay-momo-phone').value.trim();
      const payerName = document.getElementById('pay-payer-name').value.trim();
      const submitBtn = document.getElementById('btn-submit-momo-pay');

      if (!currentAmount || currentAmount <= 0) {
        State.showToast("Please enter a valid payment amount", "error");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Sending USSD Prompt to ' + momoPhone + '...';

      try {
        // Realistic Ghana USSD prompt interaction delay
        await new Promise(r => setTimeout(r, 1400));
        submitBtn.innerHTML = '<span>📱</span> Prompt approved! Generating digital receipt...';
        await new Promise(r => setTimeout(r, 600));

        const res = await API.payInvoice(invoice.id, {
          amount: currentAmount,
          method: selectedNetwork,
          momoNumber: momoPhone,
          payerName
        });

        this.close();
        State.showToast(`Fee payment of GH₵ ${currentAmount.toLocaleString()} confirmed!`, 'success');

        // Show official receipt modal
        this.openFeeReceiptModal(res.invoice, res.payment);

        if (onPaidCallback) onPaidCallback(res);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📱</span> Authorize MoMo Payment (GH₵ ' + currentAmount.toLocaleString() + ')';
        State.showToast(err.message, 'error');
      }
    };
  },

  openFeeReceiptModal(invoice, payment) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const pDate = payment.date ? new Date(payment.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString();

    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <button id="modal-close" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        
        <div style="padding: 2.25rem 2rem 1.5rem;">
          <!-- Ghana Crest & Official Seal -->
          <div style="text-align: center; border-bottom: 2px dashed var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🇬🇭</div>
            <div style="font-size: 0.72rem; font-weight: 800; color: var(--gold-600); text-transform: uppercase; letter-spacing: 1.5px;">
              REPUBLIC OF GHANA • MINISTRY OF EDUCATION & GES
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0;">
              ${invoice.schoolName}
            </h2>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--emerald-700); text-transform: uppercase; letter-spacing: 0.5px;">
              OFFICIAL ELECTRONIC SCHOOL FEE RECEIPT
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
              Receipt No: <strong style="font-family: monospace; color: var(--primary-900);">${payment.receiptNumber || 'REC-2026-001'}</strong>
              &nbsp;|&nbsp; Ref: <code style="font-size: 0.75rem;">${payment.transactionRef}</code>
            </div>
          </div>

          <!-- Highlight Paid Amount -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; border-radius: var(--radius-lg); padding: 1.25rem; text-align: center; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
              AMOUNT RECEIVED VIA ${payment.method.toUpperCase()}
            </div>
            <div style="font-family: var(--font-heading); font-size: 2.4rem; font-weight: 800; color: #14532d; margin: 0.25rem 0;">
              GH₵ ${Number(payment.amount).toLocaleString()}.00
            </div>
            <div style="font-size: 0.8rem; color: #15803d; font-weight: 600;">
              ✓ Payment Verified & Cryptographically Signed
            </div>
          </div>

          <!-- Student & Payment Particulars -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; font-size: 0.85rem;">
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Student Details</div>
              <div style="font-weight: 800; color: var(--primary-900); font-size: 0.95rem;">${invoice.studentName}</div>
              <div style="color: var(--text-dark);">Class: ${invoice.studentGrade}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem;">${invoice.term}</div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Payer Particulars</div>
              <div style="font-weight: 800; color: var(--primary-900); font-size: 0.95rem;">${payment.payerName}</div>
              <div style="color: var(--text-dark);">Wallet: ${payment.momoNumber}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem;">Date: ${pDate}</div>
            </div>
          </div>

          <!-- Outstanding Status Banner -->
          <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Invoice Status</div>
              <div style="font-weight: 700; color: ${invoice.balanceDue <= 0 ? 'var(--emerald-600)' : 'var(--rose-600)'};">
                ${invoice.balanceDue <= 0 ? '✓ Term Fee Fully Cleared' : 'Partially Paid (Installment Logged)'}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Remaining Balance</div>
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary-900);">
                GH₵ ${Number(invoice.balanceDue).toLocaleString()}
              </div>
            </div>
          </div>

          <!-- Digital QR & Validation Stamp -->
          <div style="display: flex; align-items: center; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-bottom: 1.25rem;">
            <div style="width: 52px; height: 52px; background: #000; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; text-align: center; line-height: 1.1;">
              SD-QR<br>VERIFIED
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
              This receipt was generated by the SkoolFinder Ghana Unified Invoicing Gateway. Authentic digital proof of school fee settlement for accounting, tax, and visa clearance purposes.
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.85rem;">
              🖨️ Print / Save Receipt
            </button>
            <button class="btn-pill btn-primary" id="btn-done-receipt" style="font-size: 0.85rem;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-done-receipt').onclick = () => this.close();
  },

  openCreateInvoiceModal(schoolId, schoolName, onCreatedCallback = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 620px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: var(--gradient-navy); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">
              🏫 SCHOOL BURSARY & REVENUE MANAGEMENT
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">
              Issue Student Fee Invoice
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">${schoolName}</div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <form id="form-create-invoice">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Student Full Name *</label>
                <input type="text" id="inv-student-name" class="form-input" placeholder="e.g. Kwame Mensah" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Class / Grade Level *</label>
                <input type="text" id="inv-student-grade" class="form-input" placeholder="e.g. Primary (Class 5)" value="Primary (Class 5)" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Parent / Guardian Name *</label>
                <input type="text" id="inv-parent-name" class="form-input" placeholder="e.g. Mrs. Nana Aba Mensah" value="Mrs. Nana Aba Mensah" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Parent WhatsApp / Phone *</label>
                <input type="tel" id="inv-parent-phone" class="form-input" placeholder="e.g. +233 24 498 7654" value="+233244987654" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Academic Term *</label>
                <input type="text" id="inv-term" class="form-input" value="Term 1 - 2026/2027 Academic Year" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Payment Due Date *</label>
                <input type="date" id="inv-due-date" class="form-input" value="2026-11-25" required />
              </div>
            </div>

            <!-- Standard Line Items -->
            <div style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700; margin-bottom: 0.4rem;">Itemized Charges (GH₵)</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="invoice-items-container">
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="text" class="form-input item-desc" value="Tuition & Academic Instruction" style="flex: 2;" required />
                  <input type="number" class="form-input item-amt" value="8500" style="flex: 1;" required />
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="text" class="form-input item-desc" value="PTA Development & Campus Security Levy" style="flex: 2;" required />
                  <input type="number" class="form-input item-amt" value="350" style="flex: 1;" required />
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="text" class="form-input item-desc" value="ICT & Science Lab Consumables" style="flex: 2;" required />
                  <input type="number" class="form-input item-amt" value="600" style="flex: 1;" required />
                </div>
              </div>
            </div>

            <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <button type="button" class="btn-pill btn-outline" id="btn-cancel-inv">Cancel</button>
              <button type="submit" id="btn-submit-inv" class="btn-pill btn-primary">
                <span>📄</span> Issue & Send Digital Invoice via SMS
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-inv').onclick = () => this.close();

    document.getElementById('form-create-invoice').onsubmit = async (e) => {
      e.preventDefault();
      const studentName = document.getElementById('inv-student-name').value.trim();
      const studentGrade = document.getElementById('inv-student-grade').value.trim();
      const parentName = document.getElementById('inv-parent-name').value.trim();
      const parentPhone = document.getElementById('inv-parent-phone').value.trim();
      const term = document.getElementById('inv-term').value.trim();
      const dueDate = document.getElementById('inv-due-date').value;

      const descs = Array.from(document.querySelectorAll('.item-desc')).map(i => i.value.trim());
      const amts = Array.from(document.querySelectorAll('.item-amt')).map(i => Number(i.value) || 0);

      const lineItems = descs.map((desc, idx) => ({
        description: desc,
        amount: amts[idx] || 0
      })).filter(item => item.description && item.amount > 0);

      const submitBtn = document.getElementById('btn-submit-inv');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Generating Invoice...';

      try {
        const res = await API.createInvoice({
          schoolId,
          studentName,
          studentGrade,
          parentName,
          parentPhone,
          term,
          dueDate,
          lineItems
        });

        this.close();
        State.showToast(`Invoice ${res.invoice.invoiceNumber} created for ${studentName}!`, 'success');
        if (onCreatedCallback) onCreatedCallback(res.invoice);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📄</span> Issue & Send Digital Invoice';
        State.showToast(err.message, 'error');
      }
    };
  },
  // Automated SMS & WhatsApp Parent Communications (Feature 7)
  openSendSMSModal(schoolId, schoolName, prefill = {}, onSentCallback = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const recipientPhone = prefill.phone || '+233244987654';
    const recipientName = prefill.name || 'Mrs. Nana Aba Mensah';
    const defaultMsg = prefill.message || `Dear ${recipientName}, this is an official admissions notice from ${schoolName}. Your entrance assessment details and tracking slip are active on the unified portal.`;

    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">
              📲 GHANA SMS & WHATSAPP GATEWAY DISPATCHER
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">
              Send Targeted Parent Message
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">${schoolName} &nbsp;|&nbsp; Alpha Sender ID: <strong style="color: var(--gold-400);">GIS-ACCRA</strong></div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <!-- Quick Message Templates -->
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark);">
              ⚡ Quick Template Pre-sets (1-Click Fill)
            </label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn-sms-template btn-pill btn-outline" data-cat="Admissions" data-tpl="Dear [Parent], we are pleased to invite [Student] for the Cambridge entrance assessment on Saturday 15 Nov at 9:00 AM. Please arrive 30 mins early." style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                📝 Entrance Exam
              </button>
              <button type="button" class="btn-sms-template btn-pill btn-outline" data-cat="Fee Reminder" data-tpl="GIS BURSARY: Reminder that Term 1 tuition balance of GH₵ [Balance] is due. Pay seamlessly via MTN MoMo / Telecel Cash on your SkoolFinder portal." style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                💳 Fee Reminder
              </button>
              <button type="button" class="btn-sms-template btn-pill btn-outline" data-cat="Campus Tour" data-tpl="Hello [Parent], your scheduled campus tour and facility inspection at GIS is confirmed for Friday 31 Oct at 10:30 AM. Administration Gate B." style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                🚶 Tour Confirmation
              </button>
              <button type="button" class="btn-sms-template btn-pill btn-outline" data-cat="Admissions" data-tpl="Congratulations! An official Letter of Admission for [Student] has been issued by GIS. Log in to view your welcome pack." style="font-size: 0.75rem; padding: 0.35rem 0.75rem;">
                🎉 Admission Offer
              </button>
            </div>
          </div>

          <form id="form-send-sms">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Parent Recipient Name *</label>
                <input type="text" id="sms-parent-name" class="form-input" value="${recipientName}" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Mobile Phone Number (+233) *</label>
                <input type="tel" id="sms-parent-phone" class="form-input" value="${recipientPhone}" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Channel Gateway *</label>
                <select id="sms-channel" class="form-select">
                  <option value="SMS (Hubtel Ghana Gateway)">SMS (Hubtel Ghana Gateway)</option>
                  <option value="WhatsApp Business Gateway">WhatsApp Official Business</option>
                  <option value="SMS (Arkesel Ghana Gateway)">SMS (Arkesel Ghana Gateway)</option>
                </select>
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Notification Category *</label>
                <select id="sms-category" class="form-select">
                  <option value="Admissions">Admissions & Enrollment</option>
                  <option value="Fee Reminder">Fee Billing & MoMo Alert</option>
                  <option value="Campus Tour">Campus Visit & Tour</option>
                  <option value="School Notice">PTA / General Notice</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="form-label" style="font-size: 0.8rem; margin: 0;">Message Content *</label>
                <span id="sms-char-counter" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${defaultMsg.length} / 160 chars (1 SMS unit)</span>
              </div>
              <textarea id="sms-message-text" class="form-textarea" rows="4" style="font-family: inherit; font-size: 0.9rem;" required>${defaultMsg}</textarea>
            </div>

            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
              <div>
                <span style="color: var(--text-muted);">Gateway Status:</span> <strong style="color: var(--emerald-600);">🟢 Active (Hubtel/MTN/Telecel)</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Cost:</span> <strong style="color: var(--primary-900);">1 SMS Credit</strong>
              </div>
            </div>

            <div class="modal-footer" style="padding: 0; background: none; border-top: none; display: flex; justify-content: space-between;">
              <button type="button" class="btn-pill btn-outline" id="btn-cancel-sms">Cancel</button>
              <button type="submit" id="btn-submit-sms" class="btn-pill btn-primary">
                <span>🚀</span> Dispatch SMS to Recipient
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-sms').onclick = () => this.close();

    const msgInput = document.getElementById('sms-message-text');
    const counter = document.getElementById('sms-char-counter');
    const updateCount = () => {
      const len = msgInput.value.length;
      const units = Math.ceil(len / 160) || 1;
      counter.innerText = `${len} / 160 chars (${units} SMS unit${units > 1 ? 's' : ''})`;
    };
    msgInput.oninput = updateCount;

    // Template click fills
    document.querySelectorAll('.btn-sms-template').forEach(btn => {
      btn.onclick = () => {
        let text = btn.dataset.tpl;
        const pName = document.getElementById('sms-parent-name').value || 'Mrs. Mensah';
        text = text.replace('[Parent]', pName).replace('[Student]', 'Kwame').replace('[Balance]', '3,000');
        msgInput.value = text;
        updateCount();
        const cat = btn.dataset.cat;
        if (cat) document.getElementById('sms-category').value = cat;
      };
    });

    document.getElementById('form-send-sms').onsubmit = async (e) => {
      e.preventDefault();
      const parentName = document.getElementById('sms-parent-name').value.trim();
      const parentPhone = document.getElementById('sms-parent-phone').value.trim();
      const channel = document.getElementById('sms-channel').value;
      const category = document.getElementById('sms-category').value;
      const messageText = msgInput.value.trim();
      const submitBtn = document.getElementById('btn-submit-sms');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Connecting to Hubtel Gateway...';

      try {
        await new Promise(r => setTimeout(r, 800));
        submitBtn.innerHTML = '<span>📱</span> SMS Delivered to ' + parentPhone + '...';

        const res = await API.sendSMS({
          schoolId,
          recipientName: parentName,
          recipientPhone: parentPhone,
          channel,
          category,
          messageText
        });

        this.close();
        State.showToast(`📲 SMS Dispatched to ${parentPhone} via ${res.log.network}! Status: Delivered.`, 'success');
        if (onSentCallback) onSentCallback(res);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀</span> Dispatch SMS';
        State.showToast(err.message, 'error');
      }
    };
  },

  openBroadcastSMSModal(schoolId, schoolName, onSentCallback = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: linear-gradient(135deg, #831843 0%, #be123c 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: #fbcfe8; font-weight: 800; text-transform: uppercase;">
              📢 ARKESEL BULK PARENT BROADCAST
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">
              Blast Announcement to All Parents
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.9);">${schoolName} &nbsp;|&nbsp; High-Priority Delivery</div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <form id="form-broadcast-sms">
            <div style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem;">Select Target Parent Group *</label>
              <select id="bcast-target" class="form-select">
                <option value="All Prospective & Enrolled Parents">All Prospective & Enrolled Parents (180 Recipients)</option>
                <option value="Active Applicants (Cycle 2026/2027)">Active Applicants (Cycle 2026/2027) (45 Recipients)</option>
                <option value="Parents with Outstanding Fees">Parents with Outstanding Fees (32 Recipients)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.8rem;">Announcement Content *</label>
              <textarea id="bcast-message" class="form-textarea" rows="4" style="font-family: inherit; font-size: 0.9rem;" required placeholder="e.g. GIS NOTICE: Campus entrance assessments and orientation day details have been updated. Please inspect your unified parent portal record."></textarea>
            </div>

            <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #831843;">
              ⚠️ <strong>Carrier Regulations:</strong> Bulk announcements are broadcast instantly across MTN Ghana, Telecel, and AT networks with sender ID <code>GIS-ACCRA</code>.
            </div>

            <div class="modal-footer" style="padding: 0; background: none; border-top: none; display: flex; justify-content: space-between;">
              <button type="button" class="btn-pill btn-outline" id="btn-cancel-bcast">Cancel</button>
              <button type="submit" id="btn-submit-bcast" class="btn-pill btn-primary" style="background: #be123c;">
                <span>📢</span> Send Bulk Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-bcast').onclick = () => this.close();

    document.getElementById('form-broadcast-sms').onsubmit = async (e) => {
      e.preventDefault();
      const targetGroup = document.getElementById('bcast-target').value;
      const messageText = document.getElementById('bcast-message').value.trim();
      const submitBtn = document.getElementById('btn-submit-bcast');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Broadcasting across Ghana networks...';

      try {
        await new Promise(r => setTimeout(r, 1200));
        const res = await API.broadcastSMS(schoolId, {
          targetGroup,
          recipientCount: targetGroup.includes('45') ? 45 : (targetGroup.includes('32') ? 32 : 180),
          category: 'Broadcast Notice',
          messageText
        });

        this.close();
        State.showToast(`📢 Broadcast Sent! ${res.recipientsDelivered} SMS notifications delivered.`, 'success');
        if (onSentCallback) onSentCallback(res);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📢</span> Send Bulk Announcement';
        State.showToast(err.message, 'error');
      }
    };
  },

  // Virtual Campus Tour & Multimedia Showcase (Feature 8)
  openPanoramaModal(facility) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 850px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
              🔄 360° HIGH-RESOLUTION IMMERSION
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">
              ${facility.title}
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">
              📍 ${facility.schoolName || 'Campus'} &nbsp;•&nbsp; 
              <span style="color: var(--emerald-400); font-weight: 700;">✓ Verified Facility Audit 2026</span>
            </div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 82vh; overflow-y: auto;">
          <!-- 360 Pan/Zoom Interactive Viewport -->
          <div style="position: relative; height: 380px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem; border: 2px solid #0f172a; background: #000;">
            <img src="${facility.image}" alt="${facility.title}" style="width: 100%; height: 100%; object-fit: cover; animation: subtle-zoom 20s infinite alternate; transition: transform 0.5s ease;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%);"></div>
            
            <!-- 360 Compass & Gyro Badge -->
            <div style="position: absolute; top: 1rem; left: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; border: 1px solid rgba(255,255,255,0.2);">
              <span style="font-size: 1rem; animation: spin-slow 10s linear infinite;">🔄</span> 360° Panoramic Simulation Active
            </div>

            <!-- Hotspot Overlay Info -->
            <div style="position: absolute; bottom: 1.25rem; left: 1.25rem; right: 1.25rem; color: #ffffff;">
              <div style="font-size: 0.85rem; line-height: 1.5; color: rgba(255,255,255,0.95); background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 0.75rem 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--gold-400);">
                ${facility.description}
              </div>
            </div>
          </div>

          <!-- Equipment Inventory & Safety Checklist -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: var(--primary-900); text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>🛠️</span> CERTIFIED EQUIPMENT INVENTORY
              </div>
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-dark); line-height: 1.6;">
                ${(facility.equipment || [
                  'Full academic syllabus compliance',
                  'Individual student safety goggles & protective gear',
                  'Smart touch digital display with network feeds',
                  'Emergency eyewash & certified fire suppression'
                ]).map(eq => `<li>${eq}</li>`).join('')}
              </ul>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="font-size: 0.78rem; font-weight: 800; color: #166534; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>🛡️</span> SAFETY & ACCREDITATION STANDARDS
              </div>
              <div style="font-size: 0.82rem; color: #15803d; line-height: 1.5;">
                <div>✓ <strong>Accreditation:</strong> ${facility.accreditation || 'Cambridge CIE & Ghana National Inspectorate Board (NaSIA)'}</div>
                <div style="margin-top: 0.4rem;">✓ <strong>Capacity:</strong> ${facility.capacity || 'Up to 35 students per session'}</div>
                <div style="margin-top: 0.4rem;">✓ <strong>Staffing:</strong> Supervised by certified lab technicians and faculty leads</div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              💡 You can also inspect this facility in person during campus visiting hours.
            </span>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn-pill btn-outline" id="btn-done-pan" style="font-size: 0.85rem;">
                Close View
              </button>
              <button class="btn-pill btn-primary" id="btn-pan-book-tour" style="font-size: 0.85rem;">
                <span>📅</span> Book Campus Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-done-pan').onclick = () => this.close();
    document.getElementById('btn-pan-book-tour').onclick = () => {
      this.close();
      this.openInquireAdmissionModal({ id: facility.schoolId || 'sch-gis-accra', name: facility.schoolName || 'Ghana International School' });
    };
  },

  openVirtualTourBookingModal(school) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const initialPhone = State.currentUser?.phone || '+1 240 555 0199';
    const initialName = State.currentUser?.name || 'Diaspora Parent';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 620px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div>
            <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">
              🌍 DIASPORA & REMOTE FAMILIES VIRTUAL TOUR
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0.2rem 0; color: #ffffff;">
              Book Live Guided Virtual Campus Tour
            </h2>
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">${school.name} &nbsp;|&nbsp; 1-on-1 Video Walkthrough</div>
          </div>
          <button id="modal-close" class="modal-close-btn" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">💻</span>
            <div style="font-size: 0.8rem; color: #3730a3; line-height: 1.4;">
              <strong>Live 1-on-1 Admissions Walkthrough:</strong> Connect directly with the admissions director via Google Meet or Zoom to tour academic blocks, boarding hostels, and curriculum labs from abroad.
            </div>
          </div>

          <form id="form-book-virtual-tour">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Parent / Guardian Name *</label>
                <input type="text" id="vtour-parent-name" class="form-input" value="${initialName}" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">International WhatsApp / Mobile *</label>
                <input type="tel" id="vtour-parent-phone" class="form-input" value="${initialPhone}" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Email for Calendar Invite *</label>
                <input type="email" id="vtour-email" class="form-input" value="parent@gmail.com" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Your Primary Timezone *</label>
                <select id="vtour-timezone" class="form-select">
                  <option value="GMT">🇬🇭 Ghana Time (GMT / UTC+0)</option>
                  <option value="EST">🇺🇸 US Eastern (EST / New York, DC)</option>
                  <option value="BST">🇬🇧 UK Summer Time (BST / London)</option>
                  <option value="PST">🇨🇦 US/Canada Pacific (PST / California)</option>
                  <option value="CET">🇪🇺 Central Europe (CET / Frankfurt, Paris)</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Preferred Tour Date *</label>
                <input type="date" id="vtour-date" class="form-input" value="2026-11-06" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.8rem;">Preferred Time Slot *</label>
                <select id="vtour-time" class="form-select">
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM (Evening Diaspora Slot)">04:30 PM (Evening Diaspora Slot)</option>
                  <option value="06:00 PM (US Morning / GH Evening)">06:00 PM (US Morning / GH Evening)</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem;">Preferred Video Platform *</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                <label style="border: 2px solid var(--primary-600); background: var(--primary-50); border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="video-platform" value="Google Meet" checked />
                  <div style="font-weight: 700; font-size: 0.8rem; margin-top: 0.2rem;">Google Meet</div>
                </label>
                <label style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="video-platform" value="Zoom" />
                  <div style="font-weight: 700; font-size: 0.8rem; margin-top: 0.2rem;">Zoom HD</div>
                </label>
                <label style="border: 1px solid var(--border-color); background: #ffffff; border-radius: var(--radius-md); padding: 0.5rem; text-align: center; cursor: pointer;">
                  <input type="radio" name="video-platform" value="WhatsApp Video" />
                  <div style="font-weight: 700; font-size: 0.8rem; margin-top: 0.2rem;">WhatsApp Video</div>
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.8rem;">Facilities of Special Interest</label>
              <input type="text" id="vtour-interests" class="form-input" placeholder="e.g. Science laboratories, Boarding hostel, Sports arena, Robotics" value="Science labs, Robotics center, and Boarding hostel" />
            </div>

            <div class="modal-footer" style="padding: 0; background: none; border-top: none; display: flex; justify-content: space-between;">
              <button type="button" class="btn-pill btn-outline" id="btn-cancel-vtour">Cancel</button>
              <button type="submit" id="btn-submit-vtour" class="btn-pill btn-primary" style="background: #312e81;">
                <span>📅</span> Confirm Virtual Tour Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-vtour').onclick = () => this.close();

    document.getElementById('form-book-virtual-tour').onsubmit = async (e) => {
      e.preventDefault();
      const parentName = document.getElementById('vtour-parent-name').value.trim();
      const parentPhone = document.getElementById('vtour-parent-phone').value.trim();
      const parentEmail = document.getElementById('vtour-email').value.trim();
      const tz = document.getElementById('vtour-timezone').value;
      const date = document.getElementById('vtour-date').value;
      const time = document.getElementById('vtour-time').value;
      const platform = document.querySelector('input[name="video-platform"]:checked')?.value || 'Google Meet';
      const interests = document.getElementById('vtour-interests').value.trim();
      const submitBtn = document.getElementById('btn-submit-vtour');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> Scheduling video session with Admissions...';

      try {
        await new Promise(r => setTimeout(r, 1000));
        const meetingCode = 'meet.google.com/sd-gis-' + Math.random().toString(36).substring(2, 6);

        // Record inquiry
        await API.submitInquiry({
          schoolId: school.id,
          schoolName: school.name,
          parentName,
          parentPhone,
          parentEmail,
          category: 'Virtual Campus Tour',
          subject: `Virtual Tour Booking via ${platform} (${tz})`,
          message: `Scheduled for ${date} at ${time} (${tz}). Video Link: https://${meetingCode}. Focus: ${interests}`,
          tourRequested: true,
          tourDate: `${date} at ${time} (${tz})`
        });

        this.close();
        
        // Show confirmation popup
        this.showVirtualTourConfirmationModal(school, {
          parentName,
          date,
          time,
          tz,
          platform,
          meetingCode
        });

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>📅</span> Confirm Virtual Tour Booking';
        State.showToast(err.message, 'error');
      }
    };
  },

  showVirtualTourConfirmationModal(school, details) {
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 550px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff; text-align: center; padding: 2.5rem 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
        <div style="font-size: 0.75rem; font-weight: 800; color: var(--gold-600); text-transform: uppercase; letter-spacing: 1px;">
          APPOINTMENT CONFIRMED
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--primary-900); margin: 0.25rem 0 0.5rem 0;">
          Live Virtual Tour Scheduled!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          We are excited to welcome you, ${details.parentName}, for an exclusive walkthrough of ${school.name}.
        </p>

        <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.88rem; line-height: 1.6;">
          <div>📅 <strong>Date & Time:</strong> ${details.date} at ${details.time} (${details.tz})</div>
          <div>💻 <strong>Platform:</strong> ${details.platform}</div>
          <div style="margin-top: 0.5rem;">
            🔗 <strong>Direct Meeting URL:</strong><br>
            <a href="https://${details.meetingCode}" target="_blank" style="color: var(--primary-700); font-weight: 700; word-break: break-all;">
              https://${details.meetingCode}
            </a>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button class="btn-pill btn-outline" id="btn-done-vconf">
            Done
          </button>
          <a href="https://${details.meetingCode}" target="_blank" class="btn-pill btn-primary">
            Join Meeting Room &rarr;
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('btn-done-vconf').onclick = () => this.close();
  },

  // Feature 9: Terminal Report Cards & Digital Gradebook
  openReportCardModal(reportCard) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const subjectsHtml = (reportCard.subjects || []).map((s) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 0.88rem;">
        <td style="padding: 0.65rem 0.75rem; font-weight: 600; color: #1e293b;">
          ${s.name} <span style="font-size: 0.72rem; color: #64748b; font-weight: 400; display: block;">${s.code || ''}</span>
        </td>
        <td style="padding: 0.65rem 0.75rem; text-align: center; color: #334155;">${s.classworkScore}<span style="color:#94a3b8; font-size:0.75rem;">/30</span></td>
        <td style="padding: 0.65rem 0.75rem; text-align: center; color: #334155;">${s.examScore}<span style="color:#94a3b8; font-size:0.75rem;">/70</span></td>
        <td style="padding: 0.65rem 0.75rem; text-align: center; font-weight: 700; color: #0f172a;">${s.totalScore}<span style="color:#94a3b8; font-size:0.75rem;">/100</span></td>
        <td style="padding: 0.65rem 0.75rem; text-align: center;">
          <span style="display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 800; font-size: 0.8rem; background: ${s.totalScore >= 80 ? '#ecfdf5; color: #065f46;' : (s.totalScore >= 60 ? '#eff6ff; color: #1e40af;' : '#fef2f2; color: #991b1b;')}">
            ${s.grade}
          </span>
        </td>
        <td style="padding: 0.65rem 0.75rem; text-align: center; color: #64748b; font-size: 0.82rem;">${s.classAverage || 75.0}%</td>
        <td style="padding: 0.65rem 0.75rem; font-size: 0.82rem; color: #475569; line-height: 1.35;">
          ${s.teacherRemark || s.remark || 'Good effort.'}
          <div style="font-size: 0.72rem; color: #94a3b8; font-style: italic;">— ${s.teacherName || 'Subject Tutor'}</div>
        </td>
      </tr>
    `).join('');

    const conductHtml = (reportCard.conductTraits || []).map(t => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0.6rem; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.82rem;">
        <span style="color: #334155; font-weight: 600;">${t.trait}</span>
        <span style="font-weight: 700; color: #059669;">⭐ ${t.rating}</span>
      </div>
    `).join('');

    const isAuthorizedStaff = State.currentUser && (State.currentUser.role === 'school_admin' || State.currentUser.role === 'teacher' || State.currentUser.role === 'super_admin');

    div.innerHTML = `
      <div class="modal-card print-report-card" style="max-width: 900px; width: 100%; max-height: 94vh; overflow-y: auto; border-radius: var(--radius-xl); background: #ffffff; box-shadow: var(--shadow-xl); padding: 0;">
        <!-- Modal Toolbar (Hidden on print) -->
        <div class="no-print" style="background: #0f172a; color: #ffffff; padding: 0.85rem 1.5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 20;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.25rem;">📄</span>
            <span style="font-weight: 700; font-size: 0.95rem;">Certified Terminal Academic Report Card</span>
            <span class="badge" style="background: #059669; color: #ffffff; font-size: 0.7rem; padding: 0.2rem 0.6rem;">${reportCard.status}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${isAuthorizedStaff ? `
              <button id="btn-edit-grades-report" class="btn-pill" style="background: #334155; color: #fff; font-size: 0.8rem; padding: 0.35rem 0.85rem;">
                ✏️ Edit Gradebook
              </button>
            ` : ''}
            <button id="btn-print-report" class="btn-pill btn-gold" style="font-size: 0.8rem; padding: 0.35rem 0.9rem;">
              🖨️ Print / Download Certified PDF
            </button>
            <button id="btn-close-report" class="modal-close-btn" style="color: #ffffff; font-size: 1.5rem; margin-left: 0.5rem;">&times;</button>
          </div>
        </div>

        <!-- Printable Document Sheet -->
        <div id="printable-report-sheet" style="padding: 2.25rem 2.5rem; background: #ffffff; color: #0f172a; font-family: 'Inter', system-ui, sans-serif;">
          
          <!-- Official Stamped Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px double #0f172a; padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Ghana MoE Crest -->
            <div style="text-align: center; width: 100px;">
              <div style="font-size: 2.5rem; line-height: 1;">🇬🇭</div>
              <div style="font-size: 0.62rem; font-weight: 800; color: #475569; text-transform: uppercase; margin-top: 0.25rem; line-height: 1.2;">
                REPUBLIC OF GHANA<br>MINISTRY OF EDUCATION<br>NaSIA ACCREDITED
              </div>
            </div>

            <!-- School Identity & Document Title -->
            <div style="text-align: center; flex: 1; padding: 0 1rem;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1.5px;">
                OFFICIAL CONTINUOUS ASSESSMENT & TERMINAL REPORT SHEET
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 1.7rem; font-weight: 900; color: #0f172a; margin: 0.2rem 0; letter-spacing: -0.5px;">
                ${reportCard.schoolName}
              </h1>
              <div style="font-style: italic; font-size: 0.85rem; color: #64748b; margin-bottom: 0.35rem;">
                Motto: "${reportCard.schoolMotto || 'Knowledge and Integrity'}" • Accra, Ghana
              </div>
              <div style="display: inline-block; background: #f1f5f9; padding: 0.25rem 0.85rem; border-radius: 20px; font-weight: 700; font-size: 0.82rem; color: #1e293b;">
                ${reportCard.term} • Academic Year: ${reportCard.academicYear}
              </div>
            </div>

            <!-- School Seal / QR Verification -->
            <div style="text-align: center; width: 110px;">
              <div style="border: 2px dashed #059669; border-radius: 50%; width: 68px; height: 68px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ecfdf5;">
                <span style="font-size: 1.4rem;">🏛️</span>
                <span style="font-size: 0.55rem; font-weight: 800; color: #065f46; line-height: 1;">SEAL</span>
              </div>
              <div style="font-size: 0.62rem; font-weight: 700; color: #059669; margin-top: 0.25rem;">
                STAMPED & VERIFIED
              </div>
            </div>
          </div>

          <!-- Student Profile Particulars Grid -->
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem 1rem; font-size: 0.85rem;">
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Student Name</span>
              <strong style="color: #0f172a; font-size: 0.95rem;">${reportCard.studentName}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Student / Roll ID</span>
              <span style="font-family: monospace; font-weight: 700; color: #334155;">${reportCard.studentId}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Class / Form Stream</span>
              <strong style="color: #0f172a;">${reportCard.studentGrade}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Class Position</span>
              <span style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">
                ⭐ ${reportCard.positionInClass} <small style="font-weight: 600; font-size: 0.72rem;">(${reportCard.positionSuffix || 'in class'})</small>
              </span>
            </div>

            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Term Attendance</span>
              <span style="font-weight: 700; color: #0f172a;">
                ${reportCard.attendance?.timesPresent || 59} / ${reportCard.attendance?.timesSchoolOpened || 60} Days
                <small style="color: #059669; font-weight: 600;">(${Math.round(((reportCard.attendance?.timesPresent || 59) / (reportCard.attendance?.timesSchoolOpened || 60)) * 100)}%)</small>
              </span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Punctuality Rating</span>
              <span style="font-weight: 700; color: #0f172a;">${reportCard.attendance?.punctualityRating || 'Excellent'}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Class Size</span>
              <span style="font-weight: 700; color: #0f172a;">${reportCard.classSize || 28} Pupils</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Report Serial Number</span>
              <span style="font-family: monospace; font-size: 0.8rem; color: #64748b;">${reportCard.reportCardNumber}</span>
            </div>
          </div>

          <!-- Academic Performance Grade Table -->
          <div style="margin-bottom: 1.5rem; border: 1.5px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background: #0f172a; color: #ffffff; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px;">
                  <th style="padding: 0.75rem;">Subject / Course</th>
                  <th style="padding: 0.75rem; text-align: center; width: 100px;">Classwork (30%)</th>
                  <th style="padding: 0.75rem; text-align: center; width: 90px;">Exam (70%)</th>
                  <th style="padding: 0.75rem; text-align: center; width: 100px;">Total (100%)</th>
                  <th style="padding: 0.75rem; text-align: center; width: 70px;">Grade</th>
                  <th style="padding: 0.75rem; text-align: center; width: 85px;">Class Avg</th>
                  <th style="padding: 0.75rem;">Subject Teacher Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsHtml}
              </tbody>
              <tfoot>
                <tr style="background: #f8fafc; font-weight: 700; border-top: 2px solid #0f172a;">
                  <td style="padding: 0.85rem 0.75rem; font-size: 0.95rem; color: #0f172a;">
                    TERMINAL AGGREGATE SUMMARY:
                  </td>
                  <td colspan="2" style="padding: 0.85rem 0.75rem; text-align: center; font-size: 0.95rem; color: #1e293b;">
                    Total Marks: <span style="color: #059669; font-size: 1.05rem;">${reportCard.overallTotalMarks}</span> / ${reportCard.overallMaxMarks}
                  </td>
                  <td style="padding: 0.85rem 0.75rem; text-align: center; font-size: 1.15rem; color: #1e3a8a;">
                    ${reportCard.overallAverage}%
                  </td>
                  <td style="padding: 0.85rem 0.75rem; text-align: center; font-size: 1.1rem; color: #065f46;">
                    ${reportCard.overallGrade}
                  </td>
                  <td colspan="2" style="padding: 0.85rem 0.75rem; color: #b45309; font-size: 0.88rem;">
                    🏆 Classification: ${reportCard.overallClassification || 'First Class Honors'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Affective Domain / Conduct Traits & Grading Key -->
          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.25rem; margin-bottom: 1.5rem;">
            <!-- Conduct Traits -->
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem;">
              <div style="font-weight: 800; font-size: 0.82rem; text-transform: uppercase; color: #0f172a; margin-bottom: 0.75rem;">
                Behavioral & Character Assessment (Conduct Matrix)
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                ${conductHtml}
              </div>
            </div>

            <!-- Ghanaian / Cambridge Grading Key -->
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; background: #fafafa; font-size: 0.78rem;">
              <div style="font-weight: 800; font-size: 0.82rem; text-transform: uppercase; color: #0f172a; margin-bottom: 0.6rem;">
                Curriculum Grading Scale Standard
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem 0.75rem; color: #475569;">
                <div><strong>A* (90–100%):</strong> Distinction</div>
                <div><strong>A (80–89%):</strong> Excellent</div>
                <div><strong>B (70–79%):</strong> Very Good</div>
                <div><strong>C (60–69%):</strong> Good / Credit</div>
                <div><strong>D (50–59%):</strong> Pass</div>
                <div><strong>E/F (<50%):</strong> Needs Support</div>
              </div>
              <div style="margin-top: 0.6rem; font-size: 0.72rem; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 0.4rem;">
                * Continuous Assessment represents 30% of aggregate; Terminal Examination constitutes 70%.
              </div>
            </div>
          </div>

          <!-- Official Remarks & Signatures -->
          <div style="border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; background: #fdfdfd;">
            <!-- Class Teacher Remark -->
            <div style="margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #334155;">Class Teacher's Official Appraisal:</span>
                <span style="font-size: 0.78rem; color: #64748b;">Signature verified on ${reportCard.teacherSignatureDate || '18 Dec 2026'}</span>
              </div>
              <div style="background: #ffffff; border-left: 3px solid #3b82f6; padding: 0.65rem 0.85rem; font-style: italic; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
                "${reportCard.classTeacherRemark}"
              </div>
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                <span style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 1.2rem; color: #1e3a8a;">${reportCard.classTeacher}</span>
                <span style="font-size: 0.75rem; color: #64748b;">(Class Tutor)</span>
              </div>
            </div>

            <!-- Head of School Remark -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
                <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #334155;">Head of School / Principal's Endorsement:</span>
                <span style="font-size: 0.78rem; color: #64748b;">Certified on ${reportCard.headTeacherSignatureDate || '19 Dec 2026'}</span>
              </div>
              <div style="background: #ffffff; border-left: 3px solid #059669; padding: 0.65rem 0.85rem; font-style: italic; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">
                "${reportCard.headTeacherRemark}"
              </div>
              <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; margin-top: 0.4rem;">
                <span style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 1.2rem; color: #065f46;">${reportCard.headTeacher}</span>
                <span style="font-size: 0.75rem; color: #64748b;">(${reportCard.headTeacherRole || 'Principal'})</span>
              </div>
            </div>
          </div>

          <!-- Document Footer & Next Term Resumption Date -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #e2e8f0; padding-top: 1rem; font-size: 0.82rem; color: #64748b;">
            <div>
              <div style="color: #0f172a; font-weight: 700;">
                🔔 Next Academic Term Begins: <span style="color: #b45309; text-decoration: underline;">${reportCard.nextTermBegins}</span>
              </div>
              <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 0.2rem;">
                Cryptographic Audit Hash: <span style="font-family: monospace;">${reportCard.verificationHash}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; color: #94a3b8;">Generated via SkoolFinder Ghana Certified Engine</div>
              <div style="font-weight: 700; color: #059669;">Valid Without Alterations • Ghana NaSIA / GES Verified</div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('btn-close-report').onclick = () => this.close();

    document.getElementById('btn-print-report').onclick = () => {
      window.print();
    };

    const btnEdit = document.getElementById('btn-edit-grades-report');
    if (btnEdit) {
      btnEdit.onclick = () => {
        this.openGradeEntryModal(reportCard.schoolId, reportCard, (updatedReport) => {
          this.openReportCardModal(updatedReport);
        });
      };
    }
  },

  openGradeEntryModal(schoolId, reportCard, onSaved) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const subjectsRowsHtml = (reportCard.subjects || []).map((s, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 0.6rem; font-weight: 600; color: #1e293b;">
          ${s.name}
          <input type="hidden" name="subj_code_${idx}" value="${s.code || ''}">
          <input type="hidden" name="subj_name_${idx}" value="${s.name}">
        </td>
        <td style="padding: 0.6rem; text-align: center;">
          <input type="number" min="0" max="30" class="form-input subj-cw-input" data-index="${idx}" value="${s.classworkScore}" style="width: 75px; text-align: center; padding: 0.35rem;" required>
        </td>
        <td style="padding: 0.6rem; text-align: center;">
          <input type="number" min="0" max="70" class="form-input subj-ex-input" data-index="${idx}" value="${s.examScore}" style="width: 75px; text-align: center; padding: 0.35rem;" required>
        </td>
        <td style="padding: 0.6rem; text-align: center; font-weight: 700; font-size: 0.95rem;" class="subj-total-${idx}">
          ${s.totalScore}
        </td>
        <td style="padding: 0.6rem; text-align: center; font-weight: 800;" class="subj-grade-${idx}">
          <span class="badge" style="background: #ecfdf5; color: #065f46;">${s.grade}</span>
        </td>
        <td style="padding: 0.6rem;">
          <input type="text" class="form-input subj-remark-input" data-index="${idx}" value="${s.teacherRemark || s.remark || ''}" style="width: 100%; font-size: 0.8rem; padding: 0.35rem;">
        </td>
      </tr>
    `).join('');

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 850px;">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-600); text-transform: uppercase;">Teacher & Admin Digital Gradebook</div>
            <h3 class="modal-title">Record Terminal Grades: ${reportCard.studentName}</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${reportCard.studentGrade} • ${reportCard.term}</div>
          </div>
          <button class="modal-close-btn" id="modal-close">&times;</button>
        </div>

        <form id="form-edit-grades" class="modal-body">
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Student ID:</span>
              <strong style="margin-left: 0.3rem;">${reportCard.studentId}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Class Position:</span>
              <input type="text" id="grade-entry-rank" class="form-input" value="${reportCard.positionInClass}" style="width: 75px; display: inline-block; padding: 0.2rem 0.4rem; text-align: center; font-weight: 800; margin-left: 0.4rem;">
            </div>
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Live Average:</span>
              <strong id="live-avg-display" style="color: #059669; font-size: 1.1rem; margin-left: 0.3rem;">${reportCard.overallAverage}%</strong>
            </div>
          </div>

          <div style="max-height: 380px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead style="background: #0f172a; color: #ffffff; position: sticky; top: 0; z-index: 10;">
                <tr>
                  <th style="padding: 0.6rem;">Subject</th>
                  <th style="padding: 0.6rem; text-align: center;">Continuous (30)</th>
                  <th style="padding: 0.6rem; text-align: center;">Exam (70)</th>
                  <th style="padding: 0.6rem; text-align: center;">Total (100)</th>
                  <th style="padding: 0.6rem; text-align: center;">Grade</th>
                  <th style="padding: 0.6rem;">Subject Teacher Remark</th>
                </tr>
              </thead>
              <tbody>
                ${subjectsRowsHtml}
              </tbody>
            </table>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Class Teacher Appraisal & Remarks *</label>
              <textarea id="grade-entry-teacher-remark" class="form-textarea" rows="3" required style="font-size: 0.85rem;">${reportCard.classTeacherRemark}</textarea>
            </div>
            <div class="form-group" style="margin: 0;">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Principal / Head of School Endorsement *</label>
              <textarea id="grade-entry-head-remark" class="form-textarea" rows="3" required style="font-size: 0.85rem;">${reportCard.headTeacherRemark}</textarea>
            </div>
          </div>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem;">
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.85rem; color: #065f46; font-weight: 600;">
              <input type="checkbox" id="chk-notify-parent-sms" checked style="width: 18px; height: 18px;">
              <span>📲 Dispatch instant SMS notification to Parent (${reportCard.parentPhone || '+233 24 498 7654'}) upon saving</span>
            </label>
          </div>

          <div class="modal-footer" style="padding: 0; background: none; border-top: none; display: flex; justify-content: space-between;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-grade-entry">Cancel</button>
            <button type="submit" id="btn-submit-grades" class="btn-pill btn-gold">
              💾 Save & Publish Certified Grades
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-grade-entry').onclick = () => this.close();

    // Live grade calculation listeners
    const recalculateTotals = () => {
      let sum = 0;
      const count = reportCard.subjects.length;
      document.querySelectorAll('.subj-cw-input').forEach((cwInput, i) => {
        const exInput = document.querySelector(`.subj-ex-input[data-index="${i}"]`);
        const cw = Math.min(30, Math.max(0, parseFloat(cwInput.value) || 0));
        const ex = Math.min(70, Math.max(0, parseFloat(exInput.value) || 0));
        const tot = Math.round(cw + ex);
        sum += tot;

        const totCell = document.querySelector(`.subj-total-${i}`);
        const gradeCell = document.querySelector(`.subj-grade-${i}`);
        if (totCell) totCell.innerText = tot;

        let letter = "F";
        if (tot >= 90) letter = "A*";
        else if (tot >= 80) letter = "A";
        else if (tot >= 70) letter = "B";
        else if (tot >= 60) letter = "C";
        else if (tot >= 50) letter = "D";
        else if (tot >= 40) letter = "E";

        if (gradeCell) {
          gradeCell.innerHTML = `<span class="badge" style="background: ${tot >= 80 ? '#ecfdf5; color: #065f46;' : (tot >= 60 ? '#eff6ff; color: #1e40af;' : '#fef2f2; color: #991b1b;')}">${letter}</span>`;
        }
      });

      const avg = count > 0 ? (sum / count).toFixed(1) : 0;
      const disp = document.getElementById('live-avg-display');
      if (disp) disp.innerText = `${avg}%`;
    };

    document.querySelectorAll('.subj-cw-input, .subj-ex-input').forEach(input => {
      input.addEventListener('input', recalculateTotals);
    });

    document.getElementById('form-edit-grades').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-grades');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Saving and Certifying...';

      const updatedSubjects = reportCard.subjects.map((orig, i) => {
        const cw = Math.min(30, Math.max(0, parseFloat(document.querySelector(`.subj-cw-input[data-index="${i}"]`).value) || 0));
        const ex = Math.min(70, Math.max(0, parseFloat(document.querySelector(`.subj-ex-input[data-index="${i}"]`).value) || 0));
        const rem = document.querySelector(`.subj-remark-input[data-index="${i}"]`).value.trim();
        return {
          ...orig,
          classworkScore: cw,
          examScore: ex,
          teacherRemark: rem
        };
      });

      const teacherRemark = document.getElementById('grade-entry-teacher-remark').value.trim();
      const headRemark = document.getElementById('grade-entry-head-remark').value.trim();
      const positionInClass = document.getElementById('grade-entry-rank').value.trim();
      const notifySms = document.getElementById('chk-notify-parent-sms').checked;

      try {
        const result = await API.updateReportCardGrades(reportCard.id, {
          subjects: updatedSubjects,
          classTeacherRemark: teacherRemark,
          headTeacherRemark: headRemark,
          positionInClass
        });

        if (notifySms) {
          await API.publishReportCard(reportCard.id);
        }

        State.showToast(`Terminal report card for ${reportCard.studentName} updated & certified!`, 'success');
        this.close();

        if (onSaved) onSaved(result.reportCard || reportCard);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💾 Save & Publish Certified Grades';
        State.showToast(err.message, 'error');
      }
    };
  },

  // ========================================================
  // Feature 10: School Transport & Live Bus Tracking Hub Modals
  // ========================================================

  openStudentBusPassModal(busPass) {
    if (!busPass) {
      State.showToast("Bus pass data not found", "error");
      return;
    }
    this.close();

    const isLive = busPass.liveRoute?.status === 'In Transit' || busPass.liveRoute?.status === 'On Schedule';
    const isDelayed = (busPass.liveRoute?.status || '').includes('Delayed');

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card print-report-card" style="max-width: 680px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 92vh; display: flex; flex-direction: column;">
        
        <!-- Modal Top Bar -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(245, 158, 11, 0.4);">
              🚌
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; font-weight: 700;">
                Official Digital Boarding Credential
              </div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
                School Shuttle Boarding Pass
              </h2>
            </div>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- Boarding Pass Ticket Container -->
          <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 2px dashed #cbd5e1; border-radius: 16px; padding: 1.5rem; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Watermark / Security Tag -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
              <div>
                <span class="badge" style="background: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.65rem;">
                  ${busPass.schoolName}
                </span>
                <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-top: 0.35rem;">
                  ${busPass.studentName}
                </div>
                <div style="font-size: 0.82rem; color: #64748b; font-weight: 600;">
                  ${busPass.studentGrade} • ID: <span style="font-family: monospace; font-weight: 700; color: #0f172a;">${busPass.studentId}</span>
                </div>
              </div>
              
              <!-- Seat Badge -->
              <div style="text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 0.5rem 1rem; border-radius: 12px; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);">
                <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Assigned Seat</div>
                <div style="font-size: 1.6rem; font-weight: 900; line-height: 1;">#${busPass.seatNumber}</div>
              </div>
            </div>

            <!-- Route & Vehicle Specs Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div style="background: #f1f5f9; padding: 0.85rem; border-radius: 10px;">
                <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Shuttle Corridor</div>
                <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${busPass.routeNumber}: ${busPass.routeName}</div>
                <div style="font-size: 0.78rem; color: #475569; margin-top: 0.2rem;">Bus Plate: <strong>${busPass.busPlate}</strong> (${busPass.busModel})</div>
              </div>

              <div style="background: #f1f5f9; padding: 0.85rem; border-radius: 10px;">
                <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Transit Status</div>
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${isDelayed ? '#ef4444' : (isLive ? '#10b981' : '#64748b')}; box-shadow: 0 0 8px ${isDelayed ? '#ef4444' : (isLive ? '#10b981' : '#64748b')};"></span>
                  <strong style="color: ${isDelayed ? '#b91c1c' : (isLive ? '#047857' : '#334155')}; font-size: 0.92rem;">
                    ${busPass.liveRoute?.status || 'Scheduled'}
                  </strong>
                </div>
                <div style="font-size: 0.78rem; color: #475569; margin-top: 0.2rem;">
                  Now: ${busPass.liveRoute?.currentStopName || 'On Route'}
                </div>
              </div>
            </div>

            <!-- Designated Stop & Timetable -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #1e3a8a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>📍</span> Designated Stop & Landmark
              </div>
              <div style="font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.4rem;">
                ${busPass.pickupLandmark}
              </div>
              <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: #475569; flex-wrap: wrap;">
                <div>🌅 <strong>Morning Pickup:</strong> <span style="color: #047857; font-weight: 700;">${busPass.morningPickupTime}</span></div>
                <div>🌇 <strong>Afternoon Drop-off:</strong> <span style="color: #1e3a8a; font-weight: 700;">${busPass.afternoonDropoffTime}</span></div>
              </div>
            </div>

            <!-- Driver & Chaperone Verification Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              
              <!-- Driver Card -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; background: #ffffff;">
                <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Assigned Driver</div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-top: 0.35rem;">
                  <div style="font-size: 1.4rem;">👨🏿‍✈️</div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: #0f172a;">${busPass.driver?.name}</div>
                    <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">DVLA Class F Verified</div>
                  </div>
                </div>
                <div style="margin-top: 0.5rem; display: flex; gap: 0.4rem;">
                  <a href="tel:${busPass.driver?.phone}" class="btn-pill" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem; text-align: center; background: #f1f5f9; color: #0f172a; text-decoration: none; border: 1px solid #cbd5e1; border-radius: 6px;">
                    📞 Call
                  </a>
                  <a href="https://wa.me/${(busPass.driver?.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="btn-pill" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem; text-align: center; background: #ecfdf5; color: #065f46; text-decoration: none; border: 1px solid #a7f3d0; border-radius: 6px;">
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              <!-- Chaperone Card -->
              <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; background: #ffffff;">
                <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Bus Matron / Chaperone</div>
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-top: 0.35rem;">
                  <div style="font-size: 1.4rem;">👩🏿‍⚕️</div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.88rem; color: #0f172a;">${busPass.chaperone?.name}</div>
                    <div style="font-size: 0.72rem; color: #6366f1; font-weight: 600;">First Aider on Board</div>
                  </div>
                </div>
                <div style="margin-top: 0.5rem; display: flex; gap: 0.4rem;">
                  <a href="tel:${busPass.chaperone?.phone}" class="btn-pill" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem; text-align: center; background: #f1f5f9; color: #0f172a; text-decoration: none; border: 1px solid #cbd5e1; border-radius: 6px;">
                    📞 Call
                  </a>
                  <a href="https://wa.me/${(busPass.chaperone?.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="btn-pill" style="flex: 1; padding: 0.3rem 0.5rem; font-size: 0.75rem; text-align: center; background: #ecfdf5; color: #065f46; text-decoration: none; border: 1px solid #a7f3d0; border-radius: 6px;">
                    💬 WhatsApp
                  </a>
                </div>
              </div>

            </div>

            <!-- QR Security Token & Anti-Counterfeit Bar -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 1rem; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 58px; height: 58px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  🏁
                </div>
                <div>
                  <div style="font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Digital Boarding Token</div>
                  <div style="font-family: monospace; font-size: 0.78rem; font-weight: 800; color: #1e3a8a;">
                    ${busPass.qrToken}
                  </div>
                  <div style="font-size: 0.68rem; color: #059669; font-weight: 600;">
                    🛡️ Authenticated & Active for ${busPass.term}
                  </div>
                </div>
              </div>

              <div style="text-align: right;">
                <button type="button" id="btn-view-live-tracker" class="btn-pill btn-primary" style="padding: 0.55rem 1rem; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem;">
                  <span>📍</span> Live Route Timeline
                </button>
              </div>
            </div>

          </div>

          <!-- Safety Instructions Note -->
          <div style="margin-top: 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 0.75rem; font-size: 0.75rem; color: #92400e; display: flex; gap: 0.5rem; align-items: flex-start;">
            <span>⚠️</span>
            <div>
              <strong>Ghana School Bus Safety Policy:</strong> Students must remain seated with seatbelts fastened. Guardians must accompany junior pupils to the designated landmark at least 5 minutes prior to scheduled pickup time.
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-pill btn-outline" id="btn-print-bus-pass">
            🖨️ Print Boarding Pass
          </button>
          <button type="button" class="btn-pill btn-gold" id="btn-close-bus-pass">
            Done
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-bus-pass').onclick = () => this.close();
    document.getElementById('btn-print-bus-pass').onclick = () => window.print();

    document.getElementById('btn-view-live-tracker').onclick = async () => {
      try {
        const route = await API.getTransportRouteById(busPass.routeId || 'rte-gis-01');
        this.openBusRouteTrackerModal(route);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  openBusRouteTrackerModal(route) {
    if (!route) {
      State.showToast("Bus route not found", "error");
      return;
    }
    this.close();

    const isDelayed = (route.status || '').includes('Delayed');

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 650px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 90vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #f59e0b; font-weight: 700;">
              ${route.schoolName}
            </div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              ${route.routeNumber}: ${route.name}
            </h2>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- Route Specs Bar -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Vehicle & Capacity</div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${route.busPlate} • ${route.busModel}</div>
              <div style="font-size: 0.75rem; color: #475569;">Enrolled Pupils: <strong>${route.enrolledStudents || 28} / ${route.busCapacity || 30}</strong></div>
            </div>

            <div style="text-align: right;">
              <span class="badge" style="background: ${isDelayed ? '#fef2f2' : '#ecfdf5'}; color: ${isDelayed ? '#991b1b' : '#065f46'}; border: 1px solid ${isDelayed ? '#fecaca' : '#a7f3d0'}; font-size: 0.82rem; padding: 0.35rem 0.85rem; font-weight: 800;">
                ● ${route.status}
              </span>
              ${isDelayed ? `<div style="font-size: 0.72rem; color: #b91c1c; font-weight: 600; margin-top: 0.2rem;">Delay: ${route.delayReason}</div>` : ''}
            </div>
          </div>

          <!-- Stop-by-Stop Transit Timeline -->
          <div style="position: relative; padding-left: 2rem;">
            
            <!-- Continuous Track Line -->
            <div style="position: absolute; left: 18px; top: 12px; bottom: 24px; width: 4px; background: #cbd5e1; border-radius: 2px;"></div>

            ${route.stops.map((stop, idx) => {
              const isPast = stop.status === 'completed';
              const isCurrent = stop.status === 'in_transit';
              const dotBg = isPast ? '#059669' : (isCurrent ? '#2563eb' : '#94a3b8');
              const icon = isPast ? '✓' : (isCurrent ? '🚌' : (idx + 1));
              
              return `
                <div style="position: relative; margin-bottom: 1.75rem;">
                  
                  <!-- Timeline Node Dot -->
                  <div style="position: absolute; left: -2rem; top: 0; width: 28px; height: 28px; border-radius: 50%; background: ${dotBg}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; border: 3px solid #ffffff; box-shadow: 0 0 0 2px ${dotBg}; z-index: 2; ${isCurrent ? 'animation: pulse-beacon 1.5s infinite;' : ''}">
                    ${icon}
                  </div>

                  <!-- Stop Card -->
                  <div style="background: ${isCurrent ? '#eff6ff' : '#ffffff'}; border: 1px solid ${isCurrent ? '#bfdbfe' : '#e2e8f0'}; border-radius: 10px; padding: 0.85rem 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div>
                        <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: ${isCurrent ? '#1e40af' : '#64748b'};">
                          ${stop.type === 'Depot' ? 'Depot Departure' : (stop.type === 'Destination' ? 'Final Campus Arrival' : `Stop #${idx + 1}`)}
                        </div>
                        <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 0.1rem;">
                          ${stop.name}
                        </div>
                        <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">
                          📍 Landmark: ${stop.landmark}
                        </div>
                      </div>

                      <div style="text-align: right;">
                        <div style="font-size: 0.85rem; font-weight: 800; color: #0f172a;">
                          ${stop.scheduledTime}
                        </div>
                        <span class="badge" style="font-size: 0.68rem; padding: 0.15rem 0.45rem; background: ${isPast ? '#ecfdf5' : (isCurrent ? '#dbeafe' : '#f1f5f9')}; color: ${isPast ? '#065f46' : (isCurrent ? '#1e40af' : '#64748b')}; font-weight: 700;">
                          ${isPast ? 'Passed' : (isCurrent ? 'Now Boarding' : 'Scheduled')}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              `;
            }).join('')}

          </div>

          <!-- Driver Quick Handoff -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.4rem;">👨🏿‍✈️</span>
              <div>
                <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a;">Driver: ${route.driver?.name}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${route.driver?.phone}</div>
              </div>
            </div>
            <a href="tel:${route.driver?.phone}" class="btn-pill btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; text-decoration: none;">
              📞 Call Driver
            </a>
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-primary" id="btn-close-tracker">
            Done
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-tracker').onclick = () => this.close();
  },

  openBroadcastBusDelayModal(route, onSent) {
    if (!route) {
      State.showToast("Route not selected", "error");
      return;
    }
    this.close();

    const recipientCount = (route.students && route.students.length) || 28;

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light);">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">🚨</span>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #fecaca; font-weight: 700;">Fleet Operations Alert</div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">Broadcast Bus Delay Alert</h2>
            </div>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <form id="form-broadcast-delay">
          <div class="modal-body" style="padding: 1.5rem;">
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem; margin-bottom: 1.25rem;">
              <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Target Route</div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${route.routeNumber}: ${route.name} (${route.busPlate})</div>
              <div style="font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 0.2rem;">
                📲 ${recipientCount} Enrolled Pupil Parents will receive direct SMS
              </div>
            </div>

            <!-- Delay Minutes Selector -->
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 0.5rem; display: block;">
                Estimated Delay Duration:
              </label>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="delay-duration-pills">
                <button type="button" class="btn-pill delay-pill" data-mins="10" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: 700;">10 Mins</button>
                <button type="button" class="btn-pill delay-pill active" data-mins="15" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; background: #b91c1c; color: #fff; border: 1px solid #b91c1c; font-weight: 700;">15 Mins</button>
                <button type="button" class="btn-pill delay-pill" data-mins="25" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: 700;">25 Mins</button>
                <button type="button" class="btn-pill delay-pill" data-mins="35" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: 700;">35 Mins</button>
                <button type="button" class="btn-pill delay-pill" data-mins="45" style="padding: 0.4rem 0.85rem; font-size: 0.82rem; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: 700;">45 Mins</button>
              </div>
              <input type="hidden" id="input-delay-mins" value="15" />
            </div>

            <!-- Preset Reason Dropdown -->
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-weight: 700; font-size: 0.85rem; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Traffic / Delay Reason:
              </label>
              <select id="select-delay-reason" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; margin-bottom: 0.5rem;">
                <option value="Heavy traffic gridlock on main highway & bypass">Heavy traffic gridlock on main highway & bypass</option>
                <option value="Road construction bypass at Underbridge roundabout">Road construction bypass at Underbridge roundabout</option>
                <option value="Heavy morning rainstorm & slow road transit">Heavy morning rainstorm & slow road transit</option>
                <option value="Accident clear-up near Tetteh Quarshie Interchange">Accident clear-up near Tetteh Quarshie Interchange</option>
                <option value="Scheduled safety tire inspection & maintenance">Scheduled safety tire inspection & maintenance</option>
              </select>
            </div>

            <!-- SMS Message Live Preview -->
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.85rem; margin-bottom: 1rem;">
              <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 0.35rem;">
                📱 Live SMS Message Preview:
              </div>
              <div id="sms-preview-text" style="font-size: 0.82rem; color: #0f172a; font-family: monospace; line-height: 1.4; background: #ffffff; padding: 0.65rem; border-radius: 6px; border: 1px solid #e2e8f0;">
                GIS BUS ALERT: ${route.routeNumber} (${route.name}) is experiencing a 15-minute traffic delay due to Heavy traffic gridlock on main highway & bypass. Driver: ${route.driver?.name} (${route.driver?.phone}).
              </div>
            </div>

          </div>

          <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-delay">Cancel</button>
            <button type="submit" id="btn-submit-delay" class="btn-pill btn-primary" style="background: #b91c1c; border-color: #b91c1c; padding: 0.65rem 1.5rem; font-weight: 700;">
              🚨 Broadcast SMS to ${recipientCount} Parents
            </button>
          </div>
        </form>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-delay').onclick = () => this.close();

    const pills = div.querySelectorAll('.delay-pill');
    const minsInput = document.getElementById('input-delay-mins');
    const reasonSelect = document.getElementById('select-delay-reason');
    const preview = document.getElementById('sms-preview-text');

    const updatePreview = () => {
      const mins = minsInput.value;
      const reason = reasonSelect.value;
      preview.innerText = `GIS BUS ALERT: ${route.routeNumber} (${route.name}) is experiencing a ${mins}-minute traffic delay due to ${reason}. Driver: ${route.driver?.name} (${route.driver?.phone}).`;
    };

    pills.forEach(p => {
      p.onclick = () => {
        pills.forEach(other => {
          other.style.background = '#f1f5f9';
          other.style.color = '#0f172a';
          other.style.borderColor = '#cbd5e1';
        });
        p.style.background = '#b91c1c';
        p.style.color = '#fff';
        p.style.borderColor = '#b91c1c';
        minsInput.value = p.dataset.mins;
        updatePreview();
      };
    });

    reasonSelect.onchange = updatePreview;

    document.getElementById('form-broadcast-delay').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-delay');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Broadcasting SMS...';

      try {
        const result = await API.broadcastBusDelay(route.id, {
          delayMinutes: minsInput.value,
          delayReason: reasonSelect.value
        });
        State.showToast(`Emergency delay broadcast dispatched to ${result.recipientsAlerted || recipientCount} parents!`, 'success');
        this.close();
        if (onSent) onSent(result.route);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚨 Broadcast SMS Alert';
        State.showToast(err.message, 'error');
      }
    };
  },
  // ========================================================
  // Feature 11: Co-Curricular & After-School Clubs Modals
  // ========================================================

  openClubDetailsModal(club, isEnrolled = false, onEnrolled = null) {
    if (!club) {
      State.showToast("Club details not found", "error");
      return;
    }
    this.close();

    const studentMember = (club.roster || []).find(m =>
      m.studentName?.toLowerCase().includes('kwame') ||
      m.parentEmail?.toLowerCase() === 'parent@gmail.com'
    );

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 680px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 92vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; border: 1px solid rgba(245, 158, 11, 0.4);">
              ${club.icon || '🥋'}
            </div>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #f59e0b; font-weight: 700;">
                ${club.category} • ${club.schoolName}
              </div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
                ${club.name}
              </h2>
            </div>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- Tagline & Description -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: #0f172a; font-size: 0.95rem;">
              ${club.tagline}
            </p>
            <p style="margin: 0; color: #475569; font-size: 0.85rem; line-height: 1.5;">
              ${club.description}
            </p>
          </div>

          <!-- Key Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div style="background: #f1f5f9; padding: 0.85rem; border-radius: 10px;">
              <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Meeting Schedule</div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.9rem; margin-top: 0.2rem;">${club.meetingSchedule}</div>
              <div style="font-size: 0.75rem; color: #475569; margin-top: 0.2rem;">📍 ${club.venue}</div>
            </div>

            <div style="background: #f1f5f9; padding: 0.85rem; border-radius: 10px;">
              <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Termly Dues & Capacity</div>
              <div style="font-weight: 800; color: #059669; font-size: 1.1rem; margin-top: 0.2rem;">GH₵ ${club.termFeeGHS} <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">/ term</span></div>
              <div style="font-size: 0.75rem; color: #475569; margin-top: 0.2rem;">Capacity: <strong>${club.enrolledCount || 0} / ${club.capacity || 40} Pupils</strong></div>
            </div>
          </div>

          <!-- Lead Patron Card -->
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="font-size: 2rem;">${club.patron?.avatar || '👨🏿‍🏫'}</div>
              <div>
                <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #64748b;">Lead Patron & Coach</div>
                <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${club.patron?.name}</div>
                <div style="font-size: 0.75rem; color: #475569;">${club.patron?.title} • ${club.patron?.email}</div>
              </div>
            </div>
            <a href="tel:${club.patron?.phone}" class="btn-pill btn-outline" style="font-size: 0.78rem; padding: 0.4rem 0.85rem; text-decoration: none;">
              📞 Call Patron
            </a>
          </div>

          <!-- Kwame's Enrollment Status Box (if enrolled) -->
          ${studentMember ? `
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                  <span class="badge" style="background: #065f46; color: #ffffff; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.65rem;">
                    ✓ ENROLLED & ACTIVE MEMBER
                  </span>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #064e3b; margin-top: 0.35rem;">
                    ${studentMember.studentName} (${studentMember.grade})
                  </div>
                  <div style="font-size: 0.82rem; color: #047857; font-weight: 600;">
                    Designated Role: <strong>${studentMember.role}</strong>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.7rem; color: #065f46; font-weight: 700;">Term 1 Dues Settled</div>
                  <div style="font-family: monospace; font-size: 0.75rem; font-weight: 800; color: #047857;">${studentMember.duesReceipt || 'SD-MOMO-CLB-2026-PAID'}</div>
                </div>
              </div>

              <!-- Badges -->
              <div style="margin-top: 0.75rem;">
                <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #047857; margin-bottom: 0.35rem;">Awarded Skill Milestone Badges:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                  ${(studentMember.meritBadges || []).map(b => `
                    <span class="badge" style="background: #ffffff; color: #065f46; border: 1px solid #6ee7b7; font-weight: 700; font-size: 0.75rem; padding: 0.3rem 0.65rem;">
                      ${b}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Upcoming Competition Preview -->
          ${club.competitions && club.competitions.length > 0 ? `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #1e3a8a; display: flex; align-items: center; gap: 0.4rem;">
                  <span>🏆</span> Upcoming Inter-School Championship
                </div>
                <button type="button" id="btn-view-all-competitions" style="background: none; border: none; color: #2563eb; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  View All (${club.competitions.length}) &rarr;
                </button>
              </div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">
                ${club.competitions[0].title}
              </div>
              <div style="font-size: 0.78rem; color: #475569; margin-top: 0.25rem;">
                📅 <strong>${club.competitions[0].date}</strong> • 📍 ${club.competitions[0].venue}
              </div>
              <div style="font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 0.2rem;">
                Opponents: ${club.competitions[0].opponentSchools}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Footer Actions -->
        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-pill btn-outline" id="btn-close-club-details">
            Close
          </button>
          
          <div style="display: flex; gap: 0.5rem;">
            ${!studentMember ? `
              <button type="button" id="btn-open-club-enroll" class="btn-pill btn-gold" style="padding: 0.65rem 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
                <span>💳</span> Enroll & Pay Dues (MoMo GH₵ ${club.termFeeGHS})
              </button>
            ` : `
              <button type="button" id="btn-open-club-cert" class="btn-pill btn-primary" style="padding: 0.65rem 1.25rem; font-weight: 700;">
                🖨️ Member Certificate Pass
              </button>
            `}
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-club-details').onclick = () => this.close();

    const compBtn = document.getElementById('btn-view-all-competitions');
    if (compBtn) compBtn.onclick = () => this.openClubCompetitionModal(club);

    const enrollBtn = document.getElementById('btn-open-club-enroll');
    if (enrollBtn) {
      enrollBtn.onclick = () => {
        this.openClubEnrollmentModal(club, (updated) => {
          if (onEnrolled) onEnrolled(updated);
        });
      };
    }

    const certBtn = document.getElementById('btn-open-club-cert');
    if (certBtn) certBtn.onclick = () => window.print();
  },

  openClubEnrollmentModal(club, onCompleted) {
    if (!club) {
      State.showToast("Club details not found", "error");
      return;
    }
    this.close();

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light);">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="font-size: 1.75rem;">💳</div>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #fde68a; font-weight: 700;">
                Ghana Instant Mobile Money Gateway
              </div>
              <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
                Co-Curricular Club Enrollment & Dues
              </h2>
            </div>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <form id="form-enroll-club">
          <div class="modal-body" style="padding: 1.5rem;">
            
            <!-- Target Club Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Selected Academy Club</div>
                <div style="font-weight: 800; color: #0f172a; font-size: 1rem; margin-top: 0.15rem;">
                  ${club.icon} ${club.name}
                </div>
                <div style="font-size: 0.78rem; color: #475569;">Meetings: ${club.meetingSchedule}</div>
              </div>
              <div style="text-align: right; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 0.4rem 0.85rem; border-radius: 10px;">
                <div style="font-size: 0.65rem; text-transform: uppercase; color: #065f46; font-weight: 800;">Term Dues</div>
                <div style="font-size: 1.25rem; font-weight: 900; color: #047857;">GH₵ ${club.termFeeGHS}</div>
              </div>
            </div>

            <!-- Student Biodata Input -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                  Enrolling Student Name:
                </label>
                <input type="text" id="clb-student-name" class="form-control" value="Kwame Mensah" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 700;" />
              </div>

              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                  Class / Grade Level:
                </label>
                <input type="text" id="clb-student-grade" class="form-control" value="Primary Class 5" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem;" />
              </div>
            </div>

            <!-- Guardian & MoMo Channel Selection -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Select Mobile Money Wallet:
              </label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem;" id="momo-channel-options">
                <label style="border: 2px solid #f59e0b; background: #fffbeb; border-radius: 8px; padding: 0.5rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;">
                  <input type="radio" name="momo_channel" value="MTN Mobile Money (*170#)" checked style="accent-color: #f59e0b;" />
                  <span style="font-weight: 800; font-size: 0.8rem; color: #92400e;">MTN MoMo</span>
                  <span style="font-size: 0.65rem; color: #b45309;">*170#</span>
                </label>

                <label style="border: 1px solid #cbd5e1; background: #ffffff; border-radius: 8px; padding: 0.5rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;">
                  <input type="radio" name="momo_channel" value="Telecel Cash (*110#)" style="accent-color: #ef4444;" />
                  <span style="font-weight: 800; font-size: 0.8rem; color: #b91c1c;">Telecel Cash</span>
                  <span style="font-size: 0.65rem; color: #64748b;">*110#</span>
                </label>

                <label style="border: 1px solid #cbd5e1; background: #ffffff; border-radius: 8px; padding: 0.5rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;">
                  <input type="radio" name="momo_channel" value="AT Money (*110#)" style="accent-color: #2563eb;" />
                  <span style="font-weight: 800; font-size: 0.8rem; color: #1e40af;">AT Money</span>
                  <span style="font-size: 0.65rem; color: #64748b;">*110#</span>
                </label>
              </div>
            </div>

            <!-- MoMo Phone Number -->
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Guardian Mobile Money Phone Number:
              </label>
              <input type="tel" id="clb-momo-phone" class="form-control" value="0244318900" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; font-family: monospace; font-weight: 700;" />
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 0.25rem;">
                A simulated USSD prompt will be sent to this number to authorize GH₵ ${club.termFeeGHS}.00.
              </div>
            </div>

          </div>

          <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-enroll">Cancel</button>
            <button type="submit" id="btn-submit-enroll-momo" class="btn-pill btn-gold" style="padding: 0.65rem 1.75rem; font-weight: 800;">
              <span>📲</span> Pay GH₵ ${club.termFeeGHS} via MoMo
            </button>
          </div>
        </form>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-enroll').onclick = () => this.close();

    document.getElementById('form-enroll-club').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-enroll-momo');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Authorizing MoMo USSD (*170#)...';

      const studentName = document.getElementById('clb-student-name').value.trim();
      const grade = document.getElementById('clb-student-grade').value.trim();
      const parentPhone = document.getElementById('clb-momo-phone').value.trim();
      const selectedChannel = div.querySelector('input[name="momo_channel"]:checked')?.value || 'MTN Mobile Money (*170#)';

      try {
        await new Promise(r => setTimeout(r, 600)); // realistic telecom prompt simulation
        const result = await API.enrollStudentInClub(club.id, {
          studentName,
          grade,
          parentName: "Mrs. Nana Aba Mensah",
          parentPhone,
          parentEmail: "parent@gmail.com",
          paymentMethod: selectedChannel
        });

        State.showToast(`🎉 ${studentName} successfully enrolled in ${club.name}! Receipt: ${result.receiptNumber}`, 'success');
        this.close();
        if (onCompleted) onCompleted(result);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>📲</span> Pay GH₵ ${club.termFeeGHS} via MoMo`;
        State.showToast(err.message, 'error');
      }
    };
  },

  openClubCompetitionModal(club) {
    if (!club) return;
    this.close();

    const comps = club.competitions || [];

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 650px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 90vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #f59e0b; font-weight: 700;">
              ${club.name}
            </div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              🏆 Inter-School Championship & Fixture Calendar
            </h2>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          ${comps.map((c, i) => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; font-size: 0.75rem;">
                  ● ${c.status || 'Upcoming'}
                </span>
                <span style="font-size: 0.78rem; font-weight: 700; color: #2563eb;">
                  Fixture #${i + 1}
                </span>
              </div>

              <h4 style="margin: 0 0 0.35rem 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                ${c.title}
              </h4>

              <div style="font-size: 0.85rem; color: #475569; margin-bottom: 0.5rem;">
                <div>📅 Date: <strong>${c.date}</strong></div>
                <div>📍 Venue: <strong>${c.venue}</strong></div>
                <div>⚔️ Opponents: <strong>${c.opponentSchools}</strong></div>
                ${c.focus ? `<div>🎯 Event Focus: <em>${c.focus}</em></div>` : ''}
              </div>

              <div style="background: #f8fafc; border-radius: 8px; padding: 0.65rem; font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 0.4rem;">
                <span>ℹ️</span> Parents and guardians are invited to attend and support the team. Official school bus departure from Cantonments at 07:30 AM on competition day.
              </div>
            </div>
          `).join('')}
        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-primary" id="btn-close-comps">
            Done
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-comps').onclick = () => this.close();
  }
,

  // ========================================================
  // FEATURE 12: ALUMNI MENTORSHIP & CAREER GUIDANCE NETWORK
  // ========================================================

  openAlumniProfileModal(alumnus) {
    if (!alumnus) return;
    this.close();

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 680px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 92vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 2px solid rgba(245, 158, 11, 0.5);">
              ${alumnus.avatar || '🎓'}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fef3c7; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.72rem; font-weight: 700;">
                  ${alumnus.schoolName} • ${alumnus.classYear}
                </span>
                <span class="badge" style="background: #ecfdf5; color: #065f46; font-size: 0.7rem; font-weight: 700;">
                  ✓ Verified Alumni
                </span>
              </div>
              <h2 style="margin: 0.25rem 0 0 0; font-size: 1.35rem; font-weight: 800; color: #ffffff;">
                ${alumnus.name}
              </h2>
              <div style="font-size: 0.86rem; color: #cbd5e1; margin-top: 0.2rem;">
                💼 ${alumnus.currentRole} at <strong>${alumnus.company}</strong>
              </div>
            </div>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- Key Badges Strip -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.65rem; text-align: center;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Tertiary Degree</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-900); margin-top: 0.2rem;">${alumnus.tertiaryUniversity}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.65rem; text-align: center;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Industry Specialization</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #0284c7; margin-top: 0.2rem;">${alumnus.industry}</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.65rem; text-align: center;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Mentorship Rating</div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #d97706; margin-top: 0.2rem;">⭐ ${alumnus.rating || '4.9'} (${alumnus.sessionsCompleted || 0} Sessions)</div>
            </div>
          </div>

          <!-- Bio -->
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #475569; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              Career Journey & Background
            </div>
            <p style="font-size: 0.88rem; line-height: 1.55; color: #334155; margin: 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.95rem;">
              ${alumnus.bio}
            </p>
          </div>

          <!-- Mentorship Focus Areas -->
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #475569; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              1-on-1 Student Mentoring Topics
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${(alumnus.mentoringAreas || []).map(area => `
                <div style="display: flex; align-items: center; gap: 0.6rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.6rem 0.85rem; font-size: 0.84rem; font-weight: 700; color: #1e40af;">
                  <span style="font-size: 1rem;">🎯</span> ${area}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Availability & Mode -->
          <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 10px; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: #9d174d;">Mentorship Availability</div>
              <div style="font-size: 0.88rem; font-weight: 800; color: #831843;">${alumnus.mentoringAvailability}</div>
              <div style="font-size: 0.74rem; color: #64748b; margin-top: 0.15rem;">📍 Location: ${alumnus.location}</div>
            </div>
            <span class="badge" style="background: #f43f5e; color: #ffffff; font-weight: 800; font-size: 0.72rem; padding: 0.35rem 0.65rem;">
              Free for Enrolled Pupils
            </span>
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-pill btn-outline" id="btn-close-alumni-modal">Close</button>
          <button type="button" class="btn-pill btn-primary" id="btn-trigger-book-mentorship" style="font-weight: 800; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);">
            <span>📅</span> Book 1-on-1 Mentorship Session &rarr;
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-alumni-modal').onclick = () => this.close();
    document.getElementById('btn-trigger-book-mentorship').onclick = () => {
      this.openBookMentorshipModal(alumnus, () => {
        App.refreshCurrentView();
      });
    };
  },

  openBookMentorshipModal(alumnus, onCompleted = null) {
    if (!alumnus) return;
    this.close();

    const currentUser = State.currentUser || {};
    const defaultStudent = "Kwame Mensah";
    const defaultPhone = currentUser.phone || "0244318900";
    const defaultEmail = currentUser.email || "parent@gmail.com";

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 92vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b;">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #f59e0b; font-weight: 700;">
              Alumni Career Guidance Network
            </div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              Book Mentorship Session with ${alumnus.name}
            </h2>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <form id="form-book-mentorship" style="margin: 0; display: flex; flex-direction: column; flex: 1; overflow-y: auto;">
          <div class="modal-body" style="padding: 1.5rem; flex: 1;">

            <!-- Mentor Mini Summary -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2rem;">${alumnus.avatar || '🎓'}</span>
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-900);">${alumnus.name}</div>
                <div style="font-size: 0.78rem; color: #475569;">${alumnus.currentRole} • ${alumnus.company}</div>
                <div style="font-size: 0.72rem; color: #0284c7; font-weight: 700;">${alumnus.tertiaryUniversity}</div>
              </div>
            </div>

            <!-- Student Name -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Pupil / Candidate Name:
              </label>
              <input type="text" id="mentor-student-name" class="form-control" value="${defaultStudent}" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;" />
            </div>

            <!-- Current Grade Level -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Current Academic Grade Level:
              </label>
              <select id="mentor-grade-level" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
                <option value="Primary Class 5 (Robotics Enthusiast)" selected>Primary Class 5 (Robotics & STEM Track)</option>
                <option value="Class 6 (BECE Candidate)">Class 6 (BECE Transition Track)</option>
                <option value="JHS 1 / Form 1">JHS 1 / Form 1</option>
                <option value="JHS 2 / Form 2">JHS 2 / Form 2</option>
                <option value="JHS 3 (BECE / CSSPS Selection)">JHS 3 (BECE / CSSPS Selection)</option>
                <option value="SHS 1 / Cambridge IGCSE Year 10">SHS 1 / Cambridge IGCSE Year 10</option>
                <option value="SHS 2 / Cambridge IGCSE Year 11">SHS 2 / Cambridge IGCSE Year 11</option>
                <option value="SHS 3 / Cambridge A-Level / IB Diploma">SHS 3 / Cambridge A-Level / IB Diploma</option>
              </select>
            </div>

            <!-- Discussion Topic -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Select Guidance Topic / Career Track:
              </label>
              <select id="mentor-topic" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
                ${(alumnus.mentoringAreas || []).map((area, idx) => `
                  <option value="${area}" ${idx === 0 ? 'selected' : ''}>${area}</option>
                `).join('')}
                <option value="General Tertiary Scholarship & Career Advice">General Tertiary Scholarship & Career Advice</option>
              </select>
            </div>

            <!-- Date & Time Slots -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                  Preferred Session Date:
                </label>
                <select id="mentor-date" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;">
                  <option value="Saturday, 14 November 2026" selected>Saturday, 14 Nov 2026</option>
                  <option value="Saturday, 21 November 2026">Saturday, 21 Nov 2026</option>
                  <option value="Saturday, 28 November 2026">Saturday, 28 Nov 2026</option>
                  <option value="Saturday, 5 December 2026">Saturday, 5 Dec 2026</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                  Time Window (GMT):
                </label>
                <select id="mentor-time" class="form-control" style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;">
                  <option value="10:00 AM - 10:45 AM GMT" selected>10:00 AM - 10:45 AM GMT</option>
                  <option value="11:00 AM - 11:45 AM GMT">11:00 AM - 11:45 AM GMT</option>
                  <option value="02:00 PM - 02:45 PM GMT">02:00 PM - 02:45 PM GMT</option>
                  <option value="04:00 PM - 04:45 PM GMT">04:00 PM - 04:45 PM GMT</option>
                </select>
              </div>
            </div>

            <!-- Guardian Phone for SMS reminder -->
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Guardian Phone for Google Meet SMS Link:
              </label>
              <input type="tel" id="mentor-parent-phone" class="form-control" value="${defaultPhone}" required style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-family: monospace; font-weight: 700;" />
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.35rem; display: block;">
                Specific Questions / Focus for the Mentor:
              </label>
              <textarea id="mentor-notes" class="form-control" rows="2" placeholder="e.g. Preparing for Ashesi CS entrance exam and building Arduino robotics projects..." style="width: 100%; padding: 0.65rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; resize: vertical;"></textarea>
            </div>

          </div>

          <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-mentorship">Cancel</button>
            <button type="submit" id="btn-submit-mentorship" class="btn-pill btn-primary" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); font-weight: 800;">
              <span>✅</span> Confirm Free Mentorship Booking
            </button>
          </div>
        </form>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-mentorship').onclick = () => this.close();

    document.getElementById('form-book-mentorship').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-mentorship');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Scheduling Video Session...';

      const studentName = document.getElementById('mentor-student-name').value.trim();
      const gradeLevel = document.getElementById('mentor-grade-level').value;
      const topic = document.getElementById('mentor-topic').value;
      const scheduledDate = document.getElementById('mentor-date').value;
      const scheduledTime = document.getElementById('mentor-time').value;
      const parentPhone = document.getElementById('mentor-parent-phone').value.trim();
      const notes = document.getElementById('mentor-notes').value.trim();

      try {
        const result = await API.bookAlumniMentorship(alumnus.id, {
          studentName,
          gradeLevel,
          topic,
          scheduledDate,
          scheduledTime,
          parentPhone,
          parentEmail: defaultEmail,
          parentName: currentUser.name || "Mrs. Nana Aba Mensah",
          notes
        });

        State.showToast(`🎉 Mentorship session confirmed with ${alumnus.name}! Google Meet link sent via SMS.`, 'success');
        this.close();
        if (onCompleted) onCompleted(result);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>✅</span> Confirm Free Mentorship Booking';
        State.showToast(err.message, 'error');
      }
    };
  },

  openMentorshipSessionDetailsModal(booking) {
    if (!booking) return;
    this.close();

    const div = document.createElement('div');
    div.className = 'modal-backdrop';
    div.id = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 95%; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid var(--border-light); max-height: 92vh; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #064e3b 0%, #0f172a 100%); color: #ffffff; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981;">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6ee7b7; font-weight: 700;">
              Confirmed Mentorship Session • ${booking.id}
            </div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              Virtual Career Guidance Session
            </h2>
          </div>
          <button id="modal-close" class="btn-close" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; overflow-y: auto; flex: 1;">
          
          <!-- Mentor Banner -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 52px; height: 52px; background: #ecfdf5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 1px solid #a7f3d0;">
              ${booking.mentorAvatar || '🎓'}
            </div>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Assigned Alumni Mentor</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary-900);">${booking.mentorName}</div>
              <div style="font-size: 0.78rem; color: #065f46; font-weight: 700;">${booking.mentorRole}</div>
            </div>
          </div>

          <!-- Schedule & Topic -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Candidate:</span>
              <span style="font-weight: 800; color: var(--primary-900);">${booking.studentName} (${booking.gradeLevel})</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Scheduled Date:</span>
              <span style="font-weight: 800; color: #0284c7;">🗓️ ${booking.scheduledDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Time Window:</span>
              <span style="font-weight: 800; color: #0284c7;">⏰ ${booking.scheduledTime}</span>
            </div>
            <div style="border-top: 1px dashed #e2e8f0; padding-top: 0.5rem; margin-top: 0.2rem;">
              <span style="color: #64748b; display: block; margin-bottom: 0.2rem;">Discussion Focus:</span>
              <span style="font-weight: 700; color: #0f172a; line-height: 1.4;">🎯 ${booking.topic}</span>
            </div>
            ${booking.notes ? `
              <div style="background: #f8fafc; border-radius: 6px; padding: 0.5rem; font-size: 0.78rem; color: #475569;">
                <em>Notes: ${booking.notes}</em>
              </div>
            ` : ''}
          </div>

          <!-- Google Meet Link CTA -->
          <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 1.25rem; text-align: center; margin-bottom: 1rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #1e40af; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              🔒 Encrypted Virtual Mentoring Room
            </div>
            <div style="font-family: monospace; font-size: 0.88rem; font-weight: 700; color: #1e3a8a; background: #ffffff; border: 1px solid #bfdbfe; padding: 0.5rem; border-radius: 8px; margin-bottom: 0.85rem; word-break: break-all;">
              ${booking.meetingLink}
            </div>
            <a href="${booking.meetingLink}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 0.9rem; padding: 0.65rem 1.5rem; background: #2563eb;">
              <span>🎥</span> Launch Google Meet Room &rarr;
            </a>
          </div>

          <div style="font-size: 0.74rem; color: #64748b; line-height: 1.4; text-align: center;">
            SMS reminder sent to ${booking.parentPhone}. Please join 5 minutes early with notebook ready.
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: var(--bg-card); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-primary" id="btn-close-session-details">
            Done
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-session-details').onclick = () => this.close();
  },

  // 1. Student Medical Profile & Health Passport Modal
  openStudentMedicalProfileModal(raw) {
    this.close();
    if (!raw) return;

    const record = {
      studentName: raw.studentName || 'Kwame Mensah',
      gradeLevel: raw.gradeLevel || raw.grade || 'Grade 8 Gold',
      bloodGroup: raw.bloodGroup || 'O+',
      genotype: raw.genotype || 'AA',
      nhisNumber: raw.nhisNumber || 'GH-NHIS-2026-9021-O',
      lastPhysicalExam: raw.lastPhysicalExam || raw.lastPhysicalExamDate || 'September 2026',
      allergies: (raw.allergies || ['Severe Groundnut / Peanut Anaphylaxis']).map(a => typeof a === 'object' ? `${a.allergen} (${a.severity})` : a),
      dietaryRestrictions: raw.dietaryRestrictions || raw.dietaryPlan || raw.canteenSpecialInstructions || 'STRICT GROUNDNUT-FREE TRAY. No groundnut soup, peanut oil, or nkate cake.',
      chronicConditions: Array.isArray(raw.chronicConditions) ? raw.chronicConditions.join(', ') : (raw.chronicConditions || 'Mild Exercise-Induced Asthma'),
      prescriptions: raw.prescriptions || 'Ventolin (Salbutamol) Inhaler 100mcg — 2 puffs with spacer 15 minutes before PE or during acute wheezing.',
      medicationStorage: raw.medicationStorage || 'Sickbay Cabinet #4 (Nurse Custody)',
      emergencyContactName: raw.emergencyContactName || raw.emergencyContact?.primaryGuardian || 'Mrs. Nana Aba Mensah (Mother)',
      emergencyContactPhone: raw.emergencyContactPhone || raw.emergencyContact?.primaryPhone || '+233 24 431 8900',
      pediatricianName: raw.pediatricianName || raw.emergencyContact?.familyPediatrician || 'Dr. K. Boateng (Korle-Bu Pediatric OPD)',
      pediatricianPhone: raw.pediatricianPhone || '+233 24 499 1200',
      immunizationStatus: raw.immunizationStatus || (Array.isArray(raw.immunizations) ? `${raw.immunizations.length} Vaccines GHS Certified` : '100% GHS Compliant')
    };

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 680px; max-height: 90vh; overflow-y: auto;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #38bdf8; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
              <span>🩺</span> Ghana Health Service & NHIS Certified Pupil Passport
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              ${record.studentName} — Medical & Dietary Record
            </h3>
            <div style="font-size: 0.8rem; color: #94a3b8;">
              ${record.gradeLevel} • NHIS: ${record.nhisNumber || 'GHS-8839201-ACC'} • Last Reviewed: ${record.lastPhysicalExam || 'September 2026'}
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: #f8fafc;">
          
          <!-- Blood Group & Sickle Cell Genotype Badges -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #fee2e2; border: 1.5px solid #f87171; border-radius: 10px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #991b1b; text-transform: uppercase;">Blood Group</div>
              <div style="font-size: 1.4rem; font-weight: 900; color: #b91c1c; font-family: var(--font-heading);">
                ${record.bloodGroup || 'O+'}
              </div>
            </div>
            <div style="background: #fef3c7; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #92400e; text-transform: uppercase;">Genotype</div>
              <div style="font-size: 1.4rem; font-weight: 900; color: #b45309; font-family: var(--font-heading);">
                ${record.genotype || 'AA'}
              </div>
            </div>
            <div style="background: #e0f2fe; border: 1.5px solid #38bdf8; border-radius: 10px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #0369a1; text-transform: uppercase;">Vaccinations</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #0284c7; margin-top: 0.2rem;">
                ${record.immunizationStatus || '100% GHS Compliant'}
              </div>
            </div>
          </div>

          <!-- Acute Allergy & Canteen Safeguards Warning Box -->
          <div style="background: #fff; border: 2px solid #ef4444; border-radius: 12px; padding: 1.15rem; margin-bottom: 1.25rem; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-size: 0.85rem; font-weight: 900; color: #b91c1c; display: flex; align-items: center; gap: 0.4rem;">
                <span style="font-size: 1.1rem;">⚠️</span> ACUTE ALLERGY & CANTEEN DIETARY SAFEGUARDS
              </span>
              <span class="badge" style="background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 0.72rem;">RED FLAG FOR KITCHEN STAFF</span>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.65rem;">
              ${(record.allergies || ['Severe Groundnut / Peanut Anaphylaxis']).map(a => `
                <span style="background: #fecaca; color: #7f1d1d; font-weight: 800; font-size: 0.78rem; padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid #f87171;">
                  🚨 ${a}
                </span>
              `).join('')}
            </div>

            <div style="font-size: 0.82rem; color: #334155; line-height: 1.45; background: #fff5f5; padding: 0.6rem 0.75rem; border-radius: 6px; border-left: 3px solid #ef4444;">
              <strong>Kitchen & Dining Protocol:</strong> ${record.dietaryRestrictions || 'STRICT GROUNDNUT-FREE TRAY. No groundnut soup, nkate cake, or peanut oil. In case of accidental ingestion, notify Matron immediately for EpiPen administration.'}
            </div>
          </div>

          <!-- Chronic Conditions & Sickbay Medication Protocol -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>💊</span> Chronic Conditions & Daily Prescriptions
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.82rem; margin-bottom: 0.75rem;">
              <div style="background: #f8fafc; padding: 0.6rem; border-radius: 6px;">
                <div style="color: #64748b; font-size: 0.72rem; text-transform: uppercase;">Condition:</div>
                <div style="font-weight: 700; color: #0f172a;">${record.chronicConditions || 'Mild Exercise-Induced Asthma'}</div>
              </div>
              <div style="background: #f8fafc; padding: 0.6rem; border-radius: 6px;">
                <div style="color: #64748b; font-size: 0.72rem; text-transform: uppercase;">Location of Medication:</div>
                <div style="font-weight: 700; color: #0f172a;">${record.medicationStorage || 'Sickbay Cabinet #2 (Nurse Custody)'}</div>
              </div>
            </div>

            <div style="font-size: 0.82rem; color: #475569; line-height: 1.45;">
              <strong>Prescribed Protocol:</strong> ${record.prescriptions || 'Ventolin (Salbutamol) Inhaler 100mcg — 2 puffs with spacer 15 minutes before PE or during acute wheezing.'}
            </div>
          </div>

          <!-- Emergency Contacts & Pediatrician -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>🚨</span> Emergency Pediatric & Parent Contacts
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.82rem;">
              <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.65rem;">
                <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Primary Guardian</div>
                <div style="font-weight: 800; color: #0f172a;">${record.emergencyContactName || 'Vivian Mensah (Mother)'}</div>
                <div style="color: #0284c7; font-weight: 700; margin-top: 0.2rem;">📞 ${record.emergencyContactPhone || '+233 24 431 8900'}</div>
              </div>
              <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.65rem;">
                <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Attending Pediatrician</div>
                <div style="font-weight: 800; color: #0f172a;">${record.pediatricianName || 'Dr. Nana Osei (Korle-Bu Pediatric Clinic)'}</div>
                <div style="color: #0284c7; font-weight: 700; margin-top: 0.2rem;">📞 ${record.pediatricianPhone || '+233 24 411 9988'}</div>
              </div>
            </div>
          </div>

          <!-- GHS Immunization Schedule Snapshot -->
          <div style="background: #f1f5f9; border-radius: 10px; padding: 0.85rem; font-size: 0.8rem; color: #475569;">
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>💉</span> GHS Expanded Programme on Immunization (EPI) Record:
            </div>
            <div>Yellow Fever (✓ Verified) • MenAfriVac Meningitis A (✓ Verified) • Hepatitis B (✓ Booster Complete) • Tetanus Toxoid (✓ Up to date).</div>
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: #ffffff; display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-pill btn-outline" onclick="window.print()" style="font-size: 0.85rem;">
            🖨️ Print GHS Medical Card
          </button>
          <button type="button" class="btn-pill btn-primary" id="btn-close-med-profile" style="font-size: 0.85rem;">
            Close Passport
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-med-profile').onclick = () => this.close();
  },

  // 2. Log Sickbay Visit Modal (For School Matron / Registered Nurse)
  openLogSickbayVisitModal(onCompleted, prefill = {}) {
    this.close();

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 640px; max-height: 90vh; overflow-y: auto;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #a7f3d0; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
              <span>🏥</span> School Health Infirmary & Triage Log
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              Log Sickbay Clinic Visit
            </h3>
            <div style="font-size: 0.8rem; color: #d1fae5;">
              Record pupil vital signs, nursing intervention, and dispatch parental notifications.
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <form id="form-log-sickbay" class="modal-body" style="padding: 1.5rem;">
          
          <!-- Pupil Selector -->
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Pupil Name *</label>
              <input type="text" id="sb-student-name" class="form-input" placeholder="e.g. Kwame Mensah" value="${prefill.studentName || 'Kwame Mensah'}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Class / Grade *</label>
              <input type="text" id="sb-grade" class="form-input" placeholder="e.g. Grade 8 Gold" value="${prefill.gradeLevel || 'Grade 8 Gold'}" required />
            </div>
          </div>

          <!-- Triage Category & Time -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Chief Complaint / Category *</label>
              <select id="sb-category" class="form-select" required>
                <option value="Respiratory / Asthma Wheeze">Respiratory / Asthma Wheeze</option>
                <option value="Pyrexia / Fever Symptoms">Pyrexia / Fever / Suspected Malaria</option>
                <option value="Playground Injury / Laceration">Playground Injury / Abrasion / Sprain</option>
                <option value="Abdominal Pain / Colic">Abdominal Pain / Gastrointestinal</option>
                <option value="Acute Headache / Dehydration">Acute Headache / Dehydration</option>
                <option value="Allergic Reaction / Rash">Allergic Reaction / Urticaria</option>
                <option value="General Malaise / Other">General Malaise / Fatigue</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Time of Arrival</label>
              <input type="text" id="sb-time" class="form-input" value="${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}" />
            </div>
          </div>

          <!-- Vital Signs Grid -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>🩺</span> Objective Vital Signs
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
              <div>
                <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.25rem;">Temp (°C)</label>
                <input type="text" id="sb-temp" class="form-input" placeholder="e.g. 36.8°C" value="36.8°C" style="font-weight: 700;" />
              </div>
              <div>
                <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.25rem;">Pulse (bpm)</label>
                <input type="text" id="sb-pulse" class="form-input" placeholder="e.g. 84 bpm" value="84 bpm" style="font-weight: 700;" />
              </div>
              <div>
                <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 0.25rem;">SpO2 (%)</label>
                <input type="text" id="sb-spo2" class="form-input" placeholder="e.g. 98%" value="98%" style="font-weight: 700;" />
              </div>
            </div>
          </div>

          <!-- Treatment / Medication Dispensed -->
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Treatment & Medication Administered *</label>
            <input type="text" id="sb-treatment" class="form-input" placeholder="e.g. Ventolin Inhaler 2 puffs with spacer, 20 mins rest on cot" value="Ventolin Inhaler 2 puffs with spacer chamber, rested on cot" required />
          </div>

          <!-- Clinical Notes -->
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Matron Clinical Notes & Observations</label>
            <textarea id="sb-notes" class="form-textarea" rows="2" placeholder="e.g. Pupil arrived wheezing after 400m PE sprint. Wheeze subsided within 15 mins. Lungs clear upon auscultation."></textarea>
          </div>

          <!-- Outcome / Disposition -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Pupil Disposition *</label>
              <select id="sb-outcome" class="form-select" required>
                <option value="Returned to Class">Returned to Class (Fit)</option>
                <option value="Resting in Sickbay Cot">Resting in Sickbay Cot</option>
                <option value="Parent Pickup Requested">Parent Pickup Requested</option>
                <option value="Referred to Hospital / Ridge">Referred to Hospital</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Attending Matron / Nurse</label>
              <input type="text" id="sb-matron" class="form-input" value="Matron Grace Agyemang, SRN" />
            </div>
          </div>

          <!-- SMS Notification Checkbox -->
          <div style="background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 8px; padding: 0.85rem; display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 1rem;">
            <input type="checkbox" id="sb-sms-alert" checked style="margin-top: 0.2rem; transform: scale(1.2); cursor: pointer;" />
            <label for="sb-sms-alert" style="font-size: 0.83rem; color: #065f46; line-height: 1.4; cursor: pointer;">
              <strong>Dispatch Instant SMS Alert to Parent's Phone (+233 24 431 8900)</strong><br/>
              Sends automated Ghana SMS notification informing guardian of sickbay visit, vitals, and condition.
            </label>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-sickbay" style="flex: 1;">Cancel</button>
            <button type="submit" class="btn-pill btn-emerald" style="flex: 2; justify-content: center; font-weight: 800;">
              ✓ Save Triage & Update Log
            </button>
          </div>

        </form>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-sickbay').onclick = () => this.close();

    document.getElementById('form-log-sickbay').onsubmit = async (e) => {
      e.preventDefault();
      const studentName = document.getElementById('sb-student-name').value;
      const gradeLevel = document.getElementById('sb-grade').value;
      const category = document.getElementById('sb-category').value;
      const time = document.getElementById('sb-time').value;
      const temp = document.getElementById('sb-temp').value;
      const pulse = document.getElementById('sb-pulse').value;
      const spo2 = document.getElementById('sb-spo2').value;
      const treatment = document.getElementById('sb-treatment').value;
      const notes = document.getElementById('sb-notes').value || 'Pupil treated in infirmary. Vitals stabilized.';
      const outcome = document.getElementById('sb-outcome').value;
      const matron = document.getElementById('sb-matron').value;
      const sendSMS = document.getElementById('sb-sms-alert').checked;

      try {
        const res = await API.logSickbayVisit({
          studentName,
          gradeLevel,
          complaint: category,
          vitals: { temp, pulse, spo2 },
          treatment,
          outcome,
          notes,
          matronName: matron,
          sendSMSAlert: sendSMS
        });

        this.close();
        State.showToast(`Sickbay record created for ${studentName}. ${sendSMS ? 'Parent SMS dispatched!' : ''}`, 'success');
        if (onCompleted) onCompleted(res.log || res);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // 3. Sickbay Visit Details & Emergency SMS Broadcaster Modal
  openSickbayVisitDetailsModal(raw) {
    this.close();
    if (!raw) return;

    const log = {
      id: raw.id || 'sb-log-01',
      studentName: raw.studentName || 'Kwame Mensah',
      complaint: raw.complaint || raw.presentingComplaint || 'Infirmary Triage Checkup',
      treatment: raw.treatment || raw.treatmentGiven || 'Rest on cot & monitored vitals',
      outcome: raw.outcome || raw.outcomeCategory || 'Discharged to Class',
      notes: raw.notes || raw.notificationMessage || 'Vital signs within normal limits. Pupil stabilized under infirmary supervision.',
      date: raw.date || raw.visitDate || 'Today',
      time: raw.time || raw.visitTime || '10:15 AM',
      matronName: raw.matronName || raw.treatingNurse || 'Matron Grace Agyemang, SRN',
      vitals: {
        temp: raw.vitals?.temp || raw.vitals?.temperature || '36.8°C',
        pulse: raw.vitals?.pulse || '84 bpm',
        spo2: raw.vitals?.spo2 || raw.vitals?.spO2 || '98%'
      }
    };

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #047857 0%, #064e3b 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #a7f3d0; letter-spacing: 0.05em;">
              Infirmary Clinical Encounter Record
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              ${log.studentName} — ${log.complaint}
            </h3>
            <div style="font-size: 0.8rem; color: #d1fae5;">
              Date: ${log.date || 'Today'} • Time: ${log.time || '10:15 AM'} • Matron: ${log.matronName || 'Matron Grace Agyemang, SRN'}
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: #f8fafc;">
          
          <!-- Vitals Strip -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 800;">Temperature</div>
              <div style="font-size: 1.2rem; font-weight: 900; color: #0f172a; font-family: monospace;">
                ${log.vitals?.temp || '36.8°C'}
              </div>
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 800;">Pulse Rate</div>
              <div style="font-size: 1.2rem; font-weight: 900; color: #0f172a; font-family: monospace;">
                ${log.vitals?.pulse || '84 bpm'}
              </div>
            </div>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; text-align: center;">
              <div style="font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 800;">Oxygen SpO2</div>
              <div style="font-size: 1.2rem; font-weight: 900; color: #059669; font-family: monospace;">
                ${log.vitals?.spo2 || '98%'}
              </div>
            </div>
          </div>

          <!-- Clinical Assessment & Treatment -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem; font-size: 0.85rem;">
            <div style="margin-bottom: 0.75rem;">
              <div style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Chief Complaint & Triage:</div>
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem; margin-top: 0.15rem;">${log.complaint}</div>
            </div>
            <div style="margin-bottom: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
              <div style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Treatment Administered:</div>
              <div style="font-weight: 700; color: #047857; margin-top: 0.15rem;">${log.treatment}</div>
            </div>
            <div style="margin-bottom: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
              <div style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Matron Clinical Notes:</div>
              <div style="color: #334155; line-height: 1.45; margin-top: 0.15rem;">${log.notes || 'No adverse reactions noted. Pupil stabilized under supervision.'}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
              <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Current Disposition:</span>
              <span class="badge" style="background: #d1fae5; color: #065f46; font-weight: 800; font-size: 0.8rem;">
                ${log.outcome}
              </span>
            </div>
          </div>

          <!-- Emergency Medical Broadcaster Box -->
          <div style="background: #fff7ed; border: 2px solid #ea580c; border-radius: 12px; padding: 1.15rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-size: 0.85rem; font-weight: 900; color: #9a3412; display: flex; align-items: center; gap: 0.4rem;">
                <span>🚨</span> EMERGENCY PARENTAL SMS BROADCASTER
              </span>
              <span class="badge" style="background: #ffedd5; color: #c2410c; font-weight: 800; font-size: 0.7rem;">Ghana MoH Protocol</span>
            </div>
            <p style="font-size: 0.8rem; color: #7c2d12; line-height: 1.45; margin-bottom: 0.85rem;">
              Need immediate parent pickup or medical authorization? Triggering this sends an instant priority SMS alert to the registered parent contact (+233 24 431 8900).
            </p>
            <button type="button" id="btn-trigger-emergency-sms" class="btn-pill" style="width: 100%; background: #ea580c; color: #ffffff; border: none; padding: 0.75rem; font-weight: 800; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; border-radius: 8px;">
              <span>📲</span> Dispatch Emergency SMS to Parent Now
            </button>
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: #ffffff; display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-primary" id="btn-close-visit-details">
            Close Record
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-visit-details').onclick = () => this.close();

    const emergencyBtn = document.getElementById('btn-trigger-emergency-sms');
    if (emergencyBtn) {
      emergencyBtn.onclick = async () => {
        emergencyBtn.disabled = true;
        emergencyBtn.innerText = 'Transmitting SMS via Ghana SMS Gateway...';
        try {
          await API.dispatchEmergencyMedicalSMS(log.id || 'visit-01', {
            parentPhone: '+233 24 431 8900',
            reason: `Update on ${log.studentName} (${log.complaint})`
          });
          State.showToast(`Emergency SMS alert dispatched to +233 24 431 8900!`, 'success');
          emergencyBtn.innerText = '✓ SMS Successfully Transmitted';
          emergencyBtn.style.background = '#059669';
        } catch (err) {
          State.showToast(err.message, 'error');
          emergencyBtn.disabled = false;
          emergencyBtn.innerText = 'Retry Dispatching SMS';
        }
      };
    }
  },

  // 1. Digital Library Book Details Modal
  openBookDetailsModal(book) {
    this.close();
    if (!book) return;

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 640px; max-height: 90vh; overflow-y: auto;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #a5b4fc; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
              <span>📚</span> Ghana Educational Library & Media Catalog
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              ${book.title}
            </h3>
            <div style="font-size: 0.8rem; color: #c7d2fe;">
              By ${book.author} • ${book.publisher}
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: #f8fafc;">
          
          <!-- Key Badges Strip -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <span class="badge" style="background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 0.78rem;">
              🇬🇭 ${book.curriculum}
            </span>
            <span class="badge" style="background: #f1f5f9; color: #334155; font-weight: 700; font-size: 0.78rem;">
              📖 ${book.subject}
            </span>
            <span class="badge" style="background: #ecfdf5; color: #065f46; font-weight: 800; font-size: 0.78rem;">
              Target: ${book.gradeLevel}
            </span>
            <span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.78rem;">
              ⭐ ${book.rating || '4.9'} / 5.0
            </span>
          </div>

          <!-- Inventory & Shelf Card -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; margin-bottom: 0.75rem;">
              <div>
                <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">ISBN / Catalog Number</span>
                <div style="font-family: monospace; font-weight: 800; color: #0f172a; margin-top: 0.15rem;">${book.isbn}</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Physical Shelf Location</span>
                <div style="font-weight: 800; color: #4338ca; margin-top: 0.15rem;">📍 ${book.shelfLocation}</div>
              </div>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="color: #64748b; font-size: 0.75rem;">Circulation Inventory:</span>
                <div style="font-size: 1.15rem; font-weight: 900; color: ${book.availableCopies > 0 ? '#059669' : '#dc2626'};">
                  ${book.availableCopies} Copies Available <span style="font-size: 0.8rem; font-weight: 400; color: #64748b;">(out of ${book.totalCopies} total)</span>
                </div>
              </div>
              <span class="badge" style="background: ${book.availableCopies > 0 ? '#d1fae5' : '#fee2e2'}; color: ${book.availableCopies > 0 ? '#065f46' : '#991b1b'}; font-weight: 800; font-size: 0.75rem;">
                ${book.availableCopies > 0 ? '✓ Ready for Checkout' : 'All Borrowed'}
              </span>
            </div>
          </div>

          <!-- Curriculum Tags & Details -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.15rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 0.5rem;">
              WAEC & Cambridge Syllabus Coverage
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem;">
              ${(book.tags || []).map(t => `
                <span style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; color: #334155; font-weight: 600;">
                  🔖 ${t}
                </span>
              `).join('')}
            </div>
            <p style="margin: 0; font-size: 0.82rem; color: #475569; line-height: 1.45;">
              Official school-licensed textbook for continuous assessment projects, homework prep, and terminal WAEC / Cambridge mock revisions. Full standard 14-day checkout loan window applies.
            </p>
          </div>

          <!-- Digital PDF / E-Reader Snapshot -->
          <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 800; color: #166534; display: flex; align-items: center; gap: 0.35rem;">
                <span>📱</span> SkoolFinder Digital E-Library Excerpt Active
              </div>
              <div style="font-size: 0.75rem; color: #15803d; margin-top: 0.15rem;">
                Digital PDF reading companion available for registered pupils.
              </div>
            </div>
            <button class="btn-pill btn-outline" style="background: #ffffff; font-size: 0.78rem; padding: 0.35rem 0.85rem;" onclick="State.showToast('Opening verified digital reader preview...', 'info')">
              📖 Open Preview
            </button>
          </div>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: #ffffff; display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-pill btn-outline" id="btn-close-book-details">
            Close
          </button>
          ${book.availableCopies > 0 ? `
            <button type="button" class="btn-pill btn-primary" id="btn-checkout-book" style="background: #312e81; font-weight: 800; font-size: 0.85rem;">
              📖 Checkout / Issue This Book &rarr;
            </button>
          ` : `
            <button type="button" class="btn-pill" disabled style="background: #94a3b8; color: #fff; cursor: not-allowed; font-size: 0.85rem;">
              No Copies Available (Reserve Next)
            </button>
          `}
        </div>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-book-details').onclick = () => this.close();

    const checkoutBtn = document.getElementById('btn-checkout-book');
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        this.openBorrowBookModal(book, () => {
          App.refreshCurrentView();
        });
      };
    }
  },

  // 2. Borrow Book Checkout Modal
  openBorrowBookModal(book, onCompleted, prefill = {}) {
    this.close();
    if (!book) return;

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 580px;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #a5b4fc; letter-spacing: 0.05em;">
              Library Desk Checkout
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              Issue Book to Student
            </h3>
            <div style="font-size: 0.8rem; color: #c7d2fe;">
              ${book.title} (${book.isbn})
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <form id="form-borrow-book" class="modal-body" style="padding: 1.5rem;">
          
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Student Borrower Name *</label>
              <input type="text" id="lib-student-name" class="form-input" placeholder="e.g. Kwame Mensah" value="${prefill.studentName || 'Kwame Mensah'}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Class / Grade *</label>
              <input type="text" id="lib-grade" class="form-input" placeholder="e.g. Primary Class 5" value="${prefill.gradeLevel || 'Primary Class 5'}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Loan Duration</label>
              <input type="text" class="form-input" value="14 Days (Standard Loan)" readonly style="background: #f1f5f9;" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Return Due Date</label>
              <input type="text" class="form-input" value="${new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB')}" readonly style="font-weight: 800; color: #312e81; background: #eef2ff;" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Librarian on Duty</label>
            <input type="text" id="lib-librarian" class="form-input" value="Mr. Kofi Boadi, MLS (Chief Librarian)" />
          </div>

          <div style="background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 8px; padding: 0.85rem; display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 1rem;">
            <input type="checkbox" id="lib-sms-receipt" checked style="margin-top: 0.2rem; transform: scale(1.2); cursor: pointer;" />
            <label for="lib-sms-receipt" style="font-size: 0.83rem; color: #065f46; line-height: 1.4; cursor: pointer;">
              <strong>Dispatch Instant SMS Loan Receipt to Guardian (+233 24 431 8900)</strong><br/>
              Includes return due date reminder and textbook barcode tracking.
            </label>
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-borrow" style="flex: 1;">Cancel</button>
            <button type="submit" class="btn-pill btn-primary" style="flex: 2; justify-content: center; font-weight: 800; background: #312e81;">
              ✓ Confirm Loan & Issue Book
            </button>
          </div>

        </form>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-borrow').onclick = () => this.close();

    document.getElementById('form-borrow-book').onsubmit = async (e) => {
      e.preventDefault();
      const studentName = document.getElementById('lib-student-name').value;
      const gradeLevel = document.getElementById('lib-grade').value;
      const librarian = document.getElementById('lib-librarian').value;

      try {
        const res = await API.borrowBook({
          bookId: book.id,
          studentName,
          gradeLevel,
          librarian
        });

        this.close();
        State.showToast(`Book "${book.title}" successfully issued to ${studentName}! Due in 14 days.`, 'success');
        if (onCompleted) onCompleted(res.loan || res);
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // 3. Return Book Modal
  openReturnBookModal(loan, onCompleted) {
    this.close();
    if (!loan) return;

    const isOverdue = loan.status === 'Overdue' || (loan.fineDueGHS && loan.fineDueGHS > 0);

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 540px;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #a7f3d0; letter-spacing: 0.05em;">
              Library Desk Return
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              Check-In / Return Textbook
            </h3>
            <div style="font-size: 0.8rem; color: #d1fae5;">
              ${loan.bookTitle}
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <form id="form-return-book" class="modal-body" style="padding: 1.5rem;">
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: #64748b;">Borrower:</span>
              <strong style="color: var(--primary-900);">${loan.studentName} (${loan.gradeLevel})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: #64748b;">Date Borrowed:</span>
              <span>${loan.borrowDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
              <span style="color: #64748b;">Scheduled Due Date:</span>
              <span style="font-weight: 700; color: ${isOverdue ? '#b91c1c' : '#047857'};">${loan.dueDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 0.4rem; margin-top: 0.4rem;">
              <span style="color: #64748b;">Overdue Fine:</span>
              <strong style="color: ${isOverdue ? '#b91c1c' : '#059669'};">GH₵ ${(loan.fineDueGHS || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Physical Inspection & Notes</label>
            <input type="text" id="lib-return-notes" class="form-input" value="Spine intact, no missing pages. Cleared for shelf re-entry." required />
          </div>

          <div class="modal-footer" style="padding: 1rem 0 0 0; background: none; border-top: none; display: flex; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-return" style="flex: 1;">Cancel</button>
            <button type="submit" class="btn-pill btn-emerald" style="flex: 2; justify-content: center; font-weight: 800;">
              ✓ Confirm Return to Catalog
            </button>
          </div>

        </form>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-cancel-return').onclick = () => this.close();

    document.getElementById('form-return-book').onsubmit = async (e) => {
      e.preventDefault();
      const notes = document.getElementById('lib-return-notes').value;

      try {
        await API.returnBook(loan.id, notes);
        this.close();
        State.showToast(`Textbook "${loan.bookTitle}" returned to library shelf!`, 'success');
        if (onCompleted) onCompleted();
      } catch (err) {
        State.showToast(err.message, 'error');
      }
    };
  },

  // 4. Overdue Notice Modal & SMS Trigger
  openOverdueNoticeModal(loan) {
    this.close();
    if (!loan) return;

    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 520px;">
        
        <div class="modal-header" style="background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%); color: #ffffff; padding: 1.25rem 1.5rem;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #fecaca; letter-spacing: 0.05em;">
              Overdue Textbook Alert
            </div>
            <h3 class="modal-title" style="color: #ffffff; margin-top: 0.25rem; font-size: 1.35rem;">
              Send Return Reminder SMS
            </h3>
            <div style="font-size: 0.8rem; color: #fee2e2;">
              ${loan.studentName} — ${loan.bookTitle}
            </div>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #ffffff; opacity: 0.85;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem; background: #f8fafc;">
          
          <div style="background: #fee2e2; border: 1.5px solid #f87171; border-radius: 10px; padding: 1rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #991b1b; text-transform: uppercase; margin-bottom: 0.35rem;">
              ⚠️ Textbook Overdue Status
            </div>
            <div style="font-size: 0.88rem; color: #7f1d1d; line-height: 1.45;">
              Due Date: <strong>${loan.dueDate}</strong> (${loan.daysOverdue || 6} days overdue)<br/>
              Fine Accrued: <strong>GH₵ ${(loan.fineDueGHS || 12).toFixed(2)}</strong> (GH₵ 2.00 / day rate)
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem; font-size: 0.82rem; color: #334155; margin-bottom: 1.25rem;">
            <strong style="color: var(--primary-900); display: block; margin-bottom: 0.3rem;">SMS Preview to Parent:</strong>
            <em>"GIS LIBRARY NOTICE: The textbook \"${loan.bookTitle}\" issued to ${loan.studentName} was due on ${loan.dueDate}. Outstanding overdue fine: GH₵ ${loan.fineDueGHS || 12}. Please return book to library desk to avoid loan suspension."</em>
          </div>

          <button type="button" id="btn-dispatch-lib-sms" class="btn-pill" style="width: 100%; background: #b91c1c; color: #ffffff; border: none; padding: 0.85rem; font-weight: 800; font-size: 0.9rem; cursor: pointer; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📲</span> Send Overdue SMS to Parent (+233 24 431 8900)
          </button>

        </div>

        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-light); background: #ffffff; display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-outline" id="btn-close-overdue">
            Close
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-close-overdue').onclick = () => this.close();

    const dispatchBtn = document.getElementById('btn-dispatch-lib-sms');
    if (dispatchBtn) {
      dispatchBtn.onclick = async () => {
        dispatchBtn.disabled = true;
        dispatchBtn.innerText = 'Transmitting SMS via Hubtel...';
        try {
          await API.dispatchOverdueNoticeSMS(loan.id);
          State.showToast(`Overdue notice SMS dispatched to parent of ${loan.studentName}!`, 'success');
          dispatchBtn.innerText = '✓ SMS Transmitted';
          dispatchBtn.style.background = '#059669';
        } catch (err) {
          State.showToast(err.message, 'error');
          dispatchBtn.disabled = false;
          dispatchBtn.innerText = 'Retry Sending';
        }
      };
    }
  },

  // ========================================================
  // FEATURE 16: Digital Student & Staff ID Cards with QR Verification
  // ========================================================
  generateQRCodeSVG(text = "GH-GIS-SECURE-842-VERIFIED", size = 110) {
    const matrixSize = 25;
    const matrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));

    function drawFinder(startX, startY) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[startY + r][startX + c] = 1;
          } else {
            matrix[startY + r][startX + c] = 0;
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(matrixSize - 7, 0);
    drawFinder(0, matrixSize - 7);

    for (let i = 8; i < matrixSize - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        if (inTL || inTR || inBL || (r === 6) || (c === 6)) continue;

        const seed = Math.sin(r * 31 + c * 17 + hash) * 10000;
        matrix[r][c] = (seed - Math.floor(seed)) > 0.45 ? 1 : 0;
      }
    }

    const cellSize = size / matrixSize;
    let rects = '';
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (matrix[r][c] === 1) {
          rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#0a1128"/>`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="background: #ffffff; padding: 4px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: block;">${rects}</svg>`;
  },

  openDigitalIDCardModal(studentData = null) {
    this.close();

    const s = studentData || {
      id: "id-gis-kwame-mensah",
      studentName: "Kwame Mensah",
      indexNumber: "GIS-2026-0842",
      schoolName: "Ghana International School (GIS)",
      schoolMotto: "Understanding of Each Other",
      schoolCrest: "🎓",
      gradeLevel: "Grade 8 (JHS 2)",
      academicYear: "2025/2026 Academic Session",
      house: "Gold Coast House",
      dob: "18 Apr 2012",
      gender: "Male",
      bloodGroup: "O+",
      genotype: "AA",
      emergencyContactName: "Dr. Mensah (Father / Guardian)",
      emergencyContactPhone: "+233 24 431 8900",
      medicalAlert: "Mild Penicillin Allergy • Asthma Inhaler Registered",
      busPassRoute: "Route 1: East Legon / Adjiringanor Shuttle",
      busPassStatus: "Active",
      libraryCardNumber: "LIB-GIS-842",
      issueDate: "01/09/2025",
      expiryDate: "31/08/2026",
      barcodeNumber: "8420912026",
      verificationHash: "GH-GIS-SECURE-842-VERIFIED",
      status: "ACTIVE",
      accreditation: "NaSIA Accredited • Cambridge Assessment International (CIE)"
    };

    const qrSvg = this.generateQRCodeSVG(s.verificationHash || s.indexNumber, 105);

    const div = document.createElement('div');
    div.className = 'modal-backdrop active';
    div.id = 'active-modal';

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 500px; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 60px -12px rgba(10,17,40,0.45);">
        
        <!-- Modal Top Bar -->
        <div style="background: #0a1128; color: #ffffff; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f59e0b;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.95rem;">
            <span>🪪</span> Official Digital Student ID & Access Badge
          </div>
          <button type="button" class="btn-modal-close" id="modal-close" style="color: #ffffff; background: none; border: none; font-size: 1.25rem; cursor: pointer;">✕</button>
        </div>

        <div class="modal-body" style="padding: 1.25rem; background: #f1f5f9; text-align: center;">

          <!-- Card Flip Toggle Switch -->
          <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
            <div style="background: #e2e8f0; padding: 3px; border-radius: 9999px; display: inline-flex; gap: 4px;">
              <button type="button" id="btn-show-front" class="btn-pill" style="font-size: 0.78rem; padding: 0.35rem 0.85rem; background: #0a1128; color: #ffffff; border: none; border-radius: 9999px; font-weight: 700; cursor: pointer;">
                Front Badge
              </button>
              <button type="button" id="btn-show-back" class="btn-pill" style="font-size: 0.78rem; padding: 0.35rem 0.85rem; background: transparent; color: #475569; border: none; border-radius: 9999px; font-weight: 600; cursor: pointer;">
                Back / Terms
              </button>
            </div>
          </div>

          <!-- PVC ID CARD CONTAINER (CR80 Portrait Dimensions) -->
          <div id="id-card-render-container" style="perspective: 1000px; display: flex; justify-content: center;">

            <!-- FRONT OF CARD -->
            <div id="id-card-front" style="width: 370px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 14px 30px rgba(10,17,40,0.18), 0 0 0 1px rgba(0,0,0,0.06); text-align: left; border: 2px solid #e2e8f0; position: relative;">
              
              <!-- Hologram Sheen Top Ribbon -->
              <div style="background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 70%, #0a1128 100%); color: #ffffff; padding: 0.85rem 1rem 0.7rem 1rem; position: relative; border-bottom: 3px solid #f59e0b;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.6rem;">🎓</span>
                    <div>
                      <div style="font-size: 0.82rem; font-weight: 900; letter-spacing: -0.01em; text-transform: uppercase; color: #ffffff;">
                        ${s.schoolName}
                      </div>
                      <div style="font-size: 0.65rem; color: #cbd5e1; font-style: italic;">
                        "${s.schoolMotto || 'Understanding of Each Other'}"
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <span class="badge" style="background: rgba(245,158,11,0.25); color: #fef08a; font-size: 0.6rem; border: 1px solid rgba(245,158,11,0.5); padding: 2px 5px;">
                      STUDENT PASS
                    </span>
                  </div>
                </div>
              </div>

              <!-- Accreditation Stripe -->
              <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0.25rem 0.75rem; font-size: 0.62rem; color: #64748b; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
                <span>REPUBLIC OF GHANA • NaSIA ACCREDITED</span>
                <span style="color: #10b981;">● ${s.status || 'ACTIVE'}</span>
              </div>

              <!-- Main Card Body -->
              <div style="padding: 0.85rem 1rem;">
                <div style="display: flex; gap: 0.85rem;">
                  
                  <!-- Student Avatar Frame -->
                  <div style="flex-shrink: 0; text-align: center;">
                    <div style="width: 90px; height: 110px; border-radius: 8px; border: 2px solid #0a1128; background: #e2e8f0; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.12); position: relative;">
                      <img 
                        src="${s.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}" 
                        alt="${s.studentName}"
                        style="width: 100%; height: 100%; object-fit: cover;"
                        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23e2e8f0%22/><text y=%22.9em%22 font-size=%2280%22>👨🏾‍🎓</text></svg>'"
                      />
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(10,17,40,0.75); color: #ffffff; font-size: 0.55rem; font-weight: 700; text-align: center; padding: 2px 0;">
                        ${s.gender || 'Student'}
                      </div>
                    </div>
                    <div style="font-size: 0.65rem; color: #64748b; font-weight: 600; margin-top: 0.35rem;">
                      DOB: ${s.dob || '2012'}
                    </div>
                  </div>

                  <!-- Details Column -->
                  <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <div style="font-size: 1.15rem; font-weight: 900; color: #0a1128; letter-spacing: -0.02em; line-height: 1.2;">
                        ${s.studentName}
                      </div>
                      
                      <div style="font-family: monospace; font-size: 0.78rem; font-weight: 700; color: #1e3a8a; background: #eff6ff; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 0.25rem; border: 1px solid #bfdbfe;">
                        ID: ${s.indexNumber}
                      </div>

                      <div style="margin-top: 0.45rem; font-size: 0.75rem; color: #334155;">
                        <div><strong>Class:</strong> ${s.gradeLevel}</div>
                        <div><strong>House:</strong> ${s.house || 'Gold Coast'}</div>
                        <div><strong>Session:</strong> ${s.academicYear}</div>
                      </div>
                    </div>

                    <div style="font-size: 0.65rem; color: #64748b; margin-top: 0.4rem;">
                      Exp: <strong style="color: #b91c1c;">${s.expiryDate}</strong>
                    </div>
                  </div>

                </div>

                <!-- Emergency Health & Transit Strip -->
                <div style="margin-top: 0.75rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 0.45rem 0.65rem; font-size: 0.68rem; color: #9f1239;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>🩸 Blood Group: <strong>${s.bloodGroup || 'O+'}</strong> (${s.genotype || 'AA'})</span>
                    <span>ICE: <strong>${s.emergencyContactPhone}</strong></span>
                  </div>
                  <div style="font-size: 0.62rem; color: #be123c; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ⚠️ ${s.medicalAlert || 'No Known Drug Allergies (NKDA)'}
                  </div>
                </div>

                <!-- Bus Pass Status Ribbon -->
                <div style="margin-top: 0.45rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 0.35rem 0.65rem; font-size: 0.68rem; color: #065f46; display: flex; align-items: center; justify-content: space-between;">
                  <span>🚌 <strong>Bus Pass:</strong> ${s.busPassRoute}</span>
                  <span class="badge" style="background: #10b981; color: #ffffff; font-size: 0.55rem; padding: 1px 4px;">PASS ACTIVE</span>
                </div>

                <!-- QR Code & Security Strip -->
                <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                  <div style="flex-shrink: 0;">
                    ${qrSvg}
                  </div>
                  <div style="flex: 1; font-size: 0.62rem; color: #475569;">
                    <div style="font-weight: 800; color: #0a1128; font-size: 0.68rem; margin-bottom: 2px;">
                      CRYPTOGRAPHIC VERIFICATION
                    </div>
                    <div>Scan at school security gates, buses & infirmary triage desk for instant credential validity.</div>
                    <div style="font-family: monospace; color: #0284c7; font-size: 0.58rem; margin-top: 3px; word-break: break-all;">
                      ${s.verificationHash}
                    </div>
                  </div>
                </div>

                <!-- Barcode Graphics Stripe -->
                <div style="margin-top: 0.65rem; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 0.4rem;">
                  <div style="font-family: monospace; letter-spacing: 5px; font-weight: 900; font-size: 0.95rem; color: #0a1128;">
                    |||||| | |||||||| | |||| ||||| |||
                  </div>
                  <div style="font-size: 0.6rem; color: #94a3b8; font-family: monospace; letter-spacing: 1px;">
                    ${s.barcodeNumber || s.indexNumber}
                  </div>
                </div>

              </div>

            </div>

            <!-- BACK OF CARD (Hidden by default) -->
            <div id="id-card-back" style="display: none; width: 370px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 14px 30px rgba(10,17,40,0.18), 0 0 0 1px rgba(0,0,0,0.06); text-align: left; border: 2px solid #e2e8f0; padding: 1.25rem;">
              
              <div style="border-bottom: 2px solid #0a1128; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                <div style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #0a1128;">
                  INSTITUTIONAL REGULATIONS & POLICY
                </div>
                <div style="font-size: 0.65rem; color: #64748b;">
                  Ghana International School • Student Code of Conduct
                </div>
              </div>

              <div style="font-size: 0.72rem; line-height: 1.5; color: #334155; margin-bottom: 1rem;">
                <ol style="padding-left: 1.15rem; margin: 0 0 0.75rem 0;">
                  <li style="margin-bottom: 0.35rem;">This card remains the property of the issuing school and must be surrendered upon request or withdrawal.</li>
                  <li style="margin-bottom: 0.35rem;">Must be presented for morning gate entry, bus boarding, library book borrowing, and external WAEC/Cambridge sittings.</li>
                  <li style="margin-bottom: 0.35rem;">Loss of badge must be reported to Admissions & Security immediately. Replacement fee: GH₵ 60.</li>
                </ol>
              </div>

              <!-- Lost & Found Box -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.65rem; font-size: 0.68rem; color: #475569; margin-bottom: 1rem;">
                <strong style="color: #0a1128;">IF LOST AND FOUND, PLEASE RETURN TO:</strong><br>
                GIS Administration Desk, Second Circular Road, Cantonments, P.O. Box GP 2856, Accra, Ghana.<br>
                Admissions Tel: <strong>+233 30 277 7163</strong> | Emergency: <strong>+233 24 431 8900</strong>
              </div>

              <!-- Signature & Seal -->
              <div style="display: flex; align-items: flex-end; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 0.75rem;">
                <div>
                  <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 1.35rem; color: #1e3a8a; line-height: 1;">
                    Dr. Mary Ashun
                  </div>
                  <div style="font-size: 0.65rem; font-weight: 700; color: #0a1128; border-top: 1px solid #475569; margin-top: 3px; padding-top: 2px;">
                    Head of School (Principal)
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; border: 2px dashed #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; font-weight: 800; color: #b45309; text-transform: uppercase; background: #fffbeb;">
                    OFFICIAL<br>SEAL
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- Action Controls Toolbar -->
          <div style="margin-top: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
            <button type="button" id="btn-print-id-card" class="btn-pill" style="background: #0a1128; color: #ffffff; border: none; font-size: 0.8rem; padding: 0.5rem 0.95rem; font-weight: 700; cursor: pointer;">
              🖨️ Print Laminated PVC Pass
            </button>
            <button type="button" id="btn-scan-test-gate" class="btn-pill" style="background: #0284c7; color: #ffffff; border: none; font-size: 0.8rem; padding: 0.5rem 0.95rem; font-weight: 700; cursor: pointer;">
              🔍 Test Gate Scanner
            </button>
            <button type="button" id="btn-wallet-pass" class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.5rem 0.95rem; font-weight: 600; cursor: pointer;">
              📱 Add to Apple/Google Wallet
            </button>
          </div>

        </div>

        <div class="modal-footer" style="padding: 0.75rem 1.25rem; border-top: 1px solid var(--border-light); background: #ffffff; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.72rem; color: #64748b;">
            Index: <strong>${s.indexNumber}</strong> • Hash: <code style="font-size: 0.68rem;">${(s.verificationHash || '').slice(0, 16)}...</code>
          </span>
          <button type="button" class="btn-pill btn-outline" id="btn-modal-done">
            Close
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-modal-done').onclick = () => this.close();

    // Toggle Front / Back
    const frontEl = document.getElementById('id-card-front');
    const backEl = document.getElementById('id-card-back');
    const showFrontBtn = document.getElementById('btn-show-front');
    const showBackBtn = document.getElementById('btn-show-back');

    showFrontBtn.onclick = () => {
      frontEl.style.display = 'block';
      backEl.style.display = 'none';
      showFrontBtn.style.background = '#0a1128';
      showFrontBtn.style.color = '#ffffff';
      showBackBtn.style.background = 'transparent';
      showBackBtn.style.color = '#475569';
    };

    showBackBtn.onclick = () => {
      frontEl.style.display = 'none';
      backEl.style.display = 'block';
      showBackBtn.style.background = '#0a1128';
      showBackBtn.style.color = '#ffffff';
      showFrontBtn.style.background = 'transparent';
      showFrontBtn.style.color = '#475569';
    };

    // Print Button
    document.getElementById('btn-print-id-card').onclick = () => {
      window.print();
    };

    // Wallet Simulator Button
    document.getElementById('btn-wallet-pass').onclick = () => {
      State.showToast(`Pass for ${s.studentName} generated in Apple / Google Wallet format (.pkpass)`, 'success');
    };

    // Test Gate Scanner Button
    document.getElementById('btn-scan-test-gate').onclick = () => {
      this.openVerifyIDScannerModal(s.indexNumber);
    };
  },

  openVerifyIDScannerModal(initialQuery = 'GIS-2026-0842') {
    this.close();

    const div = document.createElement('div');
    div.className = 'modal-backdrop active';
    div.id = 'active-modal';

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 480px; border-radius: 18px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.4);">
        
        <div style="background: linear-gradient(135deg, #0a1128 0%, #1e3a8a 100%); color: #ffffff; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #10b981;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.95rem;">
            <span>🛡️</span> School Security & Gate Verification Scanner
          </div>
          <button type="button" class="btn-modal-close" id="modal-close" style="color: #ffffff; background: none; border: none; font-size: 1.25rem; cursor: pointer;">✕</button>
        </div>

        <div class="modal-body" style="padding: 1.25rem; background: #ffffff;">

          <div style="text-align: center; margin-bottom: 1rem;">
            <div style="width: 100%; height: 120px; background: #0a1128; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 2px solid #10b981;">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #10b981; box-shadow: 0 0 12px #10b981; animation: laserScan 2s infinite ease-in-out;"></div>
              <span style="font-size: 2.2rem;">📷</span>
              <span style="font-size: 0.72rem; color: #a7f3d0; font-weight: 700; letter-spacing: 0.05em; margin-top: 0.35rem;">
                OPTICAL BADGE SENSOR ACTIVE
              </span>
            </div>
          </div>

          <form id="verify-scan-form" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Student Index Number or Cryptographic Hash *</label>
            <div style="display: flex; gap: 0.5rem;">
              <input 
                type="text" 
                id="verify-scan-input" 
                class="form-input" 
                value="${initialQuery}" 
                placeholder="e.g. GIS-2026-0842 or GH-GIS-SECURE-842-VERIFIED" 
                required 
                style="font-family: monospace; font-size: 0.88rem; font-weight: 600;"
              />
              <button type="submit" class="btn-pill" style="background: #10b981; color: #ffffff; border: none; padding: 0.6rem 1rem; font-weight: 700; cursor: pointer; border-radius: 8px;">
                Verify
              </button>
            </div>
          </form>

          <!-- Result Mount -->
          <div id="verify-scan-result" style="display: none;"></div>

        </div>

        <div class="modal-footer" style="padding: 0.85rem 1.25rem; border-top: 1px solid var(--border-light); background: #f8fafc; display: flex; justify-content: flex-end;">
          <button type="button" class="btn-pill btn-outline" id="btn-modal-close-scanner">
            Close Scanner
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);
    document.getElementById('modal-close').onclick = () => this.close();
    document.getElementById('btn-modal-close-scanner').onclick = () => this.close();

    const form = document.getElementById('verify-scan-form');
    const input = document.getElementById('verify-scan-input');
    const resultBox = document.getElementById('verify-scan-result');

    const runVerification = async (val) => {
      if (!val) return;
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
          <span>⏳ Validating institutional credential with NaSIA & GIS Central Registry...</span>
        </div>
      `;

      try {
        const res = await API.verifyDigitalID(val);
        if (res && res.verified) {
          resultBox.innerHTML = `
            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 1rem; animation: sdFadeIn 0.25s ease;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; border-bottom: 1px solid #a7f3d0; padding-bottom: 0.4rem;">
                <span style="font-weight: 900; color: #065f46; font-size: 0.95rem; display: flex; align-items: center; gap: 0.35rem;">
                  ✅ VERIFIED ACTIVE STUDENT
                </span>
                <span class="badge" style="background: #10b981; color: #ffffff; font-size: 0.65rem;">
                  GATE CLEARANCE
                </span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.78rem; color: #1e293b;">
                <div><strong>Student:</strong> ${res.studentName}</div>
                <div><strong>Index:</strong> <code style="font-family: monospace;">${res.indexNumber}</code></div>
                <div><strong>Class:</strong> ${res.gradeLevel}</div>
                <div><strong>House:</strong> ${res.house}</div>
                <div><strong>Blood:</strong> ${res.bloodGroup} (${res.genotype})</div>
                <div><strong>Medical:</strong> <span style="color: #b91c1c;">${res.medicalAlert}</span></div>
                <div style="grid-column: span 2;"><strong>Bus Transit:</strong> <span style="color: #047857;">${res.busPassRoute} (${res.busPassStatus})</span></div>
              </div>
              <div style="margin-top: 0.75rem; background: #ffffff; border: 1px solid #a7f3d0; border-radius: 6px; padding: 0.5rem; font-size: 0.7rem; color: #065f46; text-align: center; font-weight: 700;">
                🟢 GATE PASS GRANTED • LOGGED AT ${new Date().toLocaleTimeString()}
              </div>
            </div>
          `;
        } else {
          resultBox.innerHTML = `
            <div style="background: #fff1f2; border: 2px solid #e11d48; border-radius: 12px; padding: 1rem;">
              <div style="font-weight: 900; color: #9f1239; font-size: 0.95rem; margin-bottom: 0.35rem;">
                ⛔ CREDENTIAL NOT VERIFIED
              </div>
              <div style="font-size: 0.78rem; color: #be123c;">
                ${res?.error || 'Invalid badge number or expired credential.'}
              </div>
            </div>
          `;
        }
      } catch (err) {
        resultBox.innerHTML = `
          <div style="background: #fff1f2; border: 1px solid #e11d48; border-radius: 8px; padding: 0.75rem; color: #9f1239; font-size: 0.8rem;">
            Error connecting to verification server: ${err.message}
          </div>
        `;
      }
    };

    form.onsubmit = (e) => {
      e.preventDefault();
      runVerification(input.value.trim());
    };

    // Auto-run if initial query provided
    if (initialQuery) {
      setTimeout(() => runVerification(initialQuery), 100);
    }
  },

  openRoleTourModal(initialRole = 'parent') {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const renderRoleContent = (role) => {
      if (role === 'parent') {
        return `
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.75rem;">👨‍👩‍👧</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; color: #065f46; font-weight: 800;">Parent & Student Journey</h4>
                  <div style="font-size: 0.8rem; color: #047857;">Discover schools, calculate BECE cut-offs, pay fees via MoMo & track your child's schooling.</div>
                </div>
              </div>
              <button type="button" id="btn-tour-parent-launch" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                <span>🚀</span> Launch Parent Portal
              </button>
            </div>
            <div style="font-size: 0.75rem; color: #047857; background: #d1fae5; padding: 0.4rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🔑</span> Demo Account: <strong>parent@gmail.com</strong> (Mrs. Nana Aba Mensah) • Password: <strong>ParentPass2026!</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <!-- Stop 1 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">Step 1 • Discovery</span>
                <span style="font-size: 1.1rem;">🏫</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Find & Filter Schools</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Filter schools across Greater Accra & Kumasi by curriculum (GES, Cambridge, IB), boarding, fees, and NaSIA accreditation.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="directory" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Browse School Directory &rarr;
              </button>
            </div>

            <!-- Stop 2 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #7c3aed; text-transform: uppercase;">Step 2 • Placement</span>
                <span style="font-size: 1.1rem;">🎓</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">CSSPS Placement Predictor</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Input student BECE aggregates (e.g. Aggregate 06-12) to calculate admission odds into Category A, B, and C Senior High Schools.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="cssps" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Open CSSPS Calculator &rarr;
              </button>
            </div>

            <!-- Stop 3 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">Step 3 • Daily Schooling</span>
                <span style="font-size: 1.1rem;">👨‍👩‍👧</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Unified Parent Portal</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Pay fees via MTN MoMo, view Terminal Report Cards, track school bus routes live, and check sickbay medical records.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="parent-portal" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Open Parent Portal &rarr;
              </button>
            </div>

            <!-- Stop 4 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #d97706; text-transform: uppercase;">Step 4 • Exam Prep</span>
                <span style="font-size: 1.1rem;">📚</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Past Questions & Schemes</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Download authentic WAEC BECE and WASSCE past exam papers, marking guides, and Chief Examiner reports.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="past-questions" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Download Past Papers &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (role === 'school') {
        return `
          <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.75rem;">🏫</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; color: #92400e; font-weight: 800;">School Administrator & Headteacher Journey</h4>
                  <div style="font-size: 0.8rem; color: #b45309;">Manage admissions, issue official offer letters, collect fees via MoMo, broadcast SMS & enter grades.</div>
                </div>
              </div>
              <button type="button" id="btn-tour-school-launch" class="btn-pill btn-gold" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                <span>🚀</span> Launch GIS Admin Portal
              </button>
            </div>
            <div style="font-size: 0.75rem; color: #92400e; background: #fef3c7; padding: 0.4rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🔑</span> Demo Account: <strong>admin@gis.edu.gh</strong> (Dr. Mary Ashun - GIS) • Password: <strong>AdminPass2026!</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <!-- Stop 1 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #d97706; text-transform: uppercase;">Feature 1 • Admissions</span>
                <span style="font-size: 1.1rem;">📄</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Admissions & Offer Letters</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Review student applications, accept candidates, and automatically generate printable official Admission Offer Letters.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="dashboard" data-param="sch-gis-accra" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Open Admissions Dashboard &rarr;
              </button>
            </div>

            <!-- Stop 2 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">Feature 2 • Payments</span>
                <span style="font-size: 1.1rem;">💳</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">School Fee Invoicing</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Create student invoices, view Paystack Mobile Money settlement timestamps, and reconcile fee payments in real-time.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="dashboard" data-param="sch-gis-accra" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                View Fee Invoices &rarr;
              </button>
            </div>

            <!-- Stop 3 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">Feature 3 • Hubtel SMS</span>
                <span style="font-size: 1.1rem;">📱</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Bulk Parent SMS Broadcasts</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Send automated SMS alerts, PTA meeting invites, and emergency notices to parents via Hubtel with live credit balance tracking.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="dashboard" data-param="sch-gis-accra" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Open SMS Dispatcher &rarr;
              </button>
            </div>

            <!-- Stop 4 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #dc2626; text-transform: uppercase;">Feature 4 • Security & QR</span>
                <span style="font-size: 1.1rem;">🛡️</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Digital Student IDs & Gate Pass</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Issue cryptographic QR student ID badges and scan credentials at school gates for real-time security verification.
              </p>
              <button type="button" class="btn-pill btn-outline" id="btn-tour-open-id-scanner" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Launch Gate Pass Scanner &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (role === 'supplier') {
        return `
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.75rem;">📦</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; color: #1e40af; font-weight: 800;">Educational Supplier & Procurement Journey</h4>
                  <div style="font-size: 0.8rem; color: #1d4ed8;">Bid on institutional RFQs, quote on uniforms, desks, and lab kits, and connect directly with schools.</div>
                </div>
              </div>
              <button type="button" id="btn-tour-supplier-launch" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                <span>🚀</span> Browse School Tenders (RFQs)
              </button>
            </div>
            <div style="font-size: 0.75rem; color: #1e40af; background: #dbeafe; padding: 0.4rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>💼</span> Open to all verified Ghanaian educational suppliers, bookshops, and fabricators.
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <!-- Stop 1 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase;">Opportunity 1 • Tenders</span>
                <span style="font-size: 1.1rem;">📑</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">School Requests for Quote (RFQs)</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Browse public procurement tenders posted by schools for science chemicals, student desks, dining hall supplies, and uniforms.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="suppliers" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                View Active School RFQs &rarr;
              </button>
            </div>

            <!-- Stop 2 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #059669; text-transform: uppercase;">Opportunity 2 • Quoting</span>
                <span style="font-size: 1.1rem;">💰</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Submit Instant Quotations</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Submit your competitive unit pricing in GH₵, delivery lead times, and product warranties directly to school procurement committees.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="suppliers" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Learn Quoting Process &rarr;
              </button>
            </div>

            <!-- Stop 3 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #d97706; text-transform: uppercase;">Opportunity 3 • Visibility</span>
                <span style="font-size: 1.1rem;">🏪</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">List Your Supply Business</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Register your enterprise in the national directory so schools can contact you directly for direct procurement.
              </p>
              <button type="button" class="btn-pill btn-outline" id="btn-tour-open-supplier-modal" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Register Supplier Profile &rarr;
              </button>
            </div>
          </div>
        `;
      } else if (role === 'teacher') {
        return `
          <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 1.5px solid #fbcfe8; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.75rem;">👨‍🏫</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; color: #9d174d; font-weight: 800;">Teacher & Private Tutor Journey</h4>
                  <div style="font-size: 0.8rem; color: #be185d;">Find teaching jobs, list as a verified private home/online tutor, and access WAEC lesson resources.</div>
                </div>
              </div>
              <button type="button" id="btn-tour-teacher-launch" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem; background: #be185d; border-color: #9d174d;">
                <span>🚀</span> Explore Teaching Hub
              </button>
            </div>
            <div style="font-size: 0.75rem; color: #9d174d; background: #fce7f3; padding: 0.4rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🔑</span> Demo Account: <strong>tutor@skoolfinder.com</strong> (Mr. Emmanuel Addo) • Password: <strong>TeacherPass2026!</strong>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <!-- Stop 1 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #be185d; text-transform: uppercase;">Step 1 • Vacancies</span>
                <span style="font-size: 1.1rem;">💼</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Find Teaching Jobs</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Filter openings by subject (Math, Physics, English, ICT), grade level, and curriculum (WASSCE, Cambridge, IB).
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="jobs" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Browse Teaching Openings &rarr;
              </button>
            </div>

            <!-- Stop 2 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #7c3aed; text-transform: uppercase;">Step 2 • Private Tutoring</span>
                <span style="font-size: 1.1rem;">🎓</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">Register as Private Tutor</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Set your hourly rate in GH₵, specify subjects, and receive direct WhatsApp/phone inquiries from interested parents.
              </p>
              <button type="button" class="btn-pill btn-outline" id="btn-tour-open-tutor-modal" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Create Tutor Profile &rarr;
              </button>
            </div>

            <!-- Stop 3 -->
            <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: 10px; padding: 1rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 800; color: #0284c7; text-transform: uppercase;">Step 3 • Curriculum</span>
                <span style="font-size: 1.1rem;">📖</span>
              </div>
              <h5 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 700;">WAEC Past Questions & Syllabus</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.75rem;">
                Prepare class lesson notes with syllabus guides, Chief Examiner reports, and past question papers with solutions.
              </p>
              <button type="button" class="btn-pill btn-outline btn-tour-jump" data-view="past-questions" style="font-size: 0.75rem; padding: 0.35rem 0.65rem; width: 100%; justify-content: center;">
                Access Past Papers &rarr;
              </button>
            </div>
          </div>
        `;
      }
    };

    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 820px; border-radius: var(--radius-xl); overflow: hidden;">
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, #091e42 0%, #0f172a 100%); color: #fff; padding: 1.5rem 1.75rem;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem;">
              <span>🇬🇭</span> SkoolFinder Interactive Navigation Tour
            </div>
            <h3 class="modal-title" style="color: #fff; font-size: 1.35rem; margin-top: 0.2rem;">Choose Your Perspective</h3>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #cbd5e1;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.5rem 1.75rem;">
          <!-- Role Navigation Tabs -->
          <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid var(--border-light); padding-bottom: 0.75rem; margin-bottom: 1.25rem; overflow-x: auto;">
            <button type="button" class="btn-pill role-tour-tab ${initialRole === 'parent' ? 'btn-primary' : 'btn-outline'}" data-role="parent" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <span>👨‍👩‍👧</span> Parent & Student
            </button>
            <button type="button" class="btn-pill role-tour-tab ${initialRole === 'school' ? 'btn-primary' : 'btn-outline'}" data-role="school" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <span>🏫</span> School & Headteacher
            </button>
            <button type="button" class="btn-pill role-tour-tab ${initialRole === 'supplier' ? 'btn-primary' : 'btn-outline'}" data-role="supplier" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <span>📦</span> Educational Supplier
            </button>
            <button type="button" class="btn-pill role-tour-tab ${initialRole === 'teacher' ? 'btn-primary' : 'btn-outline'}" data-role="teacher" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <span>👨‍🏫</span> Teacher & Tutor
            </button>
          </div>

          <!-- Dynamic Role Body Container -->
          <div id="role-tour-content-container">
            ${renderRoleContent(initialRole)}
          </div>

          <!-- Quick Jump Bar -->
          <div style="background: #f8fafc; border-top: 1px solid var(--border-light); padding: 0.85rem 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              Need advice on Ghanaian schools or BECE cut-offs?
            </div>
            <button type="button" id="btn-tour-ask-akosua" class="btn-pill" style="font-size: 0.78rem; padding: 0.4rem 0.85rem; background: #0a1128; color: #fbbf24; border: 1px solid #f59e0b;">
              <span>👩🏾‍💼</span> Chat with Akosua AI Advisor
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);

    document.getElementById('modal-close').onclick = () => this.close();

    const container = document.getElementById('role-tour-content-container');

    const attachRoleEvents = (currentRole) => {
      // 1. Jump buttons
      document.querySelectorAll('.btn-tour-jump').forEach(btn => {
        btn.onclick = () => {
          const view = btn.dataset.view;
          const param = btn.dataset.param || null;
          this.close();
          App.navigate(view, param);
        };
      });

      // 2. Akosua button
      document.getElementById('btn-tour-ask-akosua').onclick = () => {
        this.close();
        if (typeof AIChatbot !== 'undefined') {
          AIChatbot.open();
        }
      };

      // 3. Parent 1-click launch
      const parentLaunch = document.getElementById('btn-tour-parent-launch');
      if (parentLaunch) {
        parentLaunch.onclick = async () => {
          this.close();
          try {
            const res = await API.login('parent@gmail.com', 'ParentPass2026!');
            State.setCurrentUser(res.user, res.token);
            if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
              document.getElementById('header-root').innerHTML = Navbar.render();
              Navbar.attachEvents();
            }
            State.showToast("Logged in as Mrs. Nana Aba Mensah. Welcome to your Parent Portal!", "success");
            App.navigate('parent-portal');
          } catch (e) {
            App.navigate('parent-portal');
          }
        };
      }

      // 4. School 1-click launch
      const schoolLaunch = document.getElementById('btn-tour-school-launch');
      if (schoolLaunch) {
        schoolLaunch.onclick = async () => {
          this.close();
          try {
            const res = await API.login('admin@gis.edu.gh', 'AdminPass2026!');
            State.setCurrentUser(res.user, res.token);
            if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
              document.getElementById('header-root').innerHTML = Navbar.render();
              Navbar.attachEvents();
            }
            State.showToast("Logged in as Dr. Mary Ashun (GIS Head). Opening Management Dashboard!", "success");
            App.navigate('dashboard', 'sch-gis-accra');
          } catch (e) {
            App.navigate('dashboard', 'sch-gis-accra');
          }
        };
      }

      // 5. Supplier 1-click launch
      const supplierLaunch = document.getElementById('btn-tour-supplier-launch');
      if (supplierLaunch) {
        supplierLaunch.onclick = () => {
          this.close();
          App.navigate('suppliers');
        };
      }

      // 6. Teacher 1-click launch
      const teacherLaunch = document.getElementById('btn-tour-teacher-launch');
      if (teacherLaunch) {
        teacherLaunch.onclick = async () => {
          this.close();
          try {
            const res = await API.login('tutor@skoolfinder.com', 'TeacherPass2026!');
            State.setCurrentUser(res.user, res.token);
            if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
              document.getElementById('header-root').innerHTML = Navbar.render();
              Navbar.attachEvents();
            }
            State.showToast("Logged in as Mr. Emmanuel Addo. Welcome to Teaching Hub!", "success");
            App.navigate('jobs');
          } catch (e) {
            App.navigate('jobs');
          }
        };
      }

      // 7. Modals
      document.getElementById('btn-tour-open-id-scanner')?.addEventListener('click', () => {
        this.openDigitalIDVerificationModal();
      });

      document.getElementById('btn-tour-open-supplier-modal')?.addEventListener('click', () => {
        this.openAddSupplierModal();
      });

      document.getElementById('btn-tour-open-tutor-modal')?.addEventListener('click', () => {
        this.openAddTeacherModal();
      });
    };

    attachRoleEvents(initialRole);

    // Tab switching
    document.querySelectorAll('.role-tour-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.role-tour-tab').forEach(t => {
          t.className = 'btn-pill role-tour-tab btn-outline';
        });
        tab.className = 'btn-pill role-tour-tab btn-primary';
        const role = tab.dataset.role;
        container.innerHTML = renderRoleContent(role);
        attachRoleEvents(role);
      };
    });
  },

  openSaaSSubscriptionModal(school = {}) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    
    let currentCycle = 'monthly';
    let selectedTier = 'growth';
    const schoolName = school.name || 'Your School';
    const schoolEmail = school.email || 'admin@school.edu.gh';
    const schoolPhone = school.phone || '0244318900';

    const pricing = {
      starter: { name: 'SaaS Starter', monthly: 299, termly: 850, students: 'Up to 250 Students', seats: '1 Admin Seat', features: ['Admissions CRM & Lead Tracking', 'Digital Student IDs & Badges', 'Basic Directory Listing', 'Email Support'] },
      growth: { name: 'SaaS Growth', monthly: 699, termly: 1999, students: 'Up to 800 Students', seats: '5 Admin Seats', badge: '⭐ Most Popular', features: ['Everything in Starter +', 'Automated Paystack MoMo Fee Collection', 'Teacher Hiring & Vacancy Board', 'Hubtel Parent SMS Broadcasts', 'Fee Defaulter Auto-Reminders'] },
      enterprise: { name: 'SaaS Enterprise', monthly: 1499, termly: 4200, students: 'Unlimited Students', seats: 'Unlimited Seats', features: ['Everything in Growth +', 'NaSIA / GES Digital Report Cards', 'Dedicated Clerk Org Subdomain', 'Custom School MoMo Account Routing', '24/7 Dedicated Account Manager'] }
    };

    const renderModalContent = () => {
      const activePrice = pricing[selectedTier][currentCycle];
      return `
      <div class="modal-dialog" style="max-width: 780px; width: 95%; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header" style="background: var(--gradient-navy); color: #fff; padding: 1.5rem 1.75rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.5px;">Institutional SaaS Subscription</div>
            <h3 class="modal-title" style="color: #fff; margin: 0.25rem 0 0 0; font-size: 1.35rem;">Lock In Your SkoolFinder Tier for ${schoolName}</h3>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #fff; opacity: 0.8;">&times;</button>
        </div>

        <div class="modal-body" style="padding: 1.75rem;">
          <!-- Billing Cycle Switch -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1.75rem; background: var(--bg-surface); padding: 0.5rem; border-radius: var(--radius-pill); border: 1px solid var(--border-color); width: fit-content; margin-left: auto; margin-right: auto;">
            <button type="button" id="btn-cycle-monthly" class="btn-pill ${currentCycle === 'monthly' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.85rem; padding: 0.4rem 1.25rem; font-weight: 700;">
              Monthly Billing
            </button>
            <button type="button" id="btn-cycle-termly" class="btn-pill ${currentCycle === 'termly' ? 'btn-primary' : 'btn-outline'}" style="font-size: 0.85rem; padding: 0.4rem 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
              Termly (3 Months) <span style="background: #22c55e; color: #fff; font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">SAVE 15%</span>
            </button>
          </div>

          <!-- 3 Plan Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${Object.keys(pricing).map(tierKey => {
              const plan = pricing[tierKey];
              const isSelected = selectedTier === tierKey;
              return `
                <div class="tier-select-card" data-tier="${tierKey}" style="border: 2px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-color)'}; background: ${isSelected ? 'var(--primary-50)' : '#ffffff'}; border-radius: var(--radius-lg); padding: 1.25rem 1rem; cursor: pointer; transition: all 0.2s; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                  ${plan.badge ? `<div style="position: absolute; top: -10px; right: 12px; background: #f59e0b; color: #0a1128; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 999px; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);">${plan.badge}</div>` : ''}
                  <div>
                    <div style="font-weight: 800; font-size: 1.05rem; color: var(--primary-900);">${plan.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">${plan.students} • ${plan.seats}</div>
                    <div style="margin: 0.9rem 0; font-family: var(--font-heading);">
                      <span style="font-size: 1.6rem; font-weight: 800; color: ${isSelected ? 'var(--primary-700)' : '#0f172a'};">GH₵ ${plan[currentCycle]}</span>
                      <span style="font-size: 0.78rem; color: var(--text-muted);">/${currentCycle === 'monthly' ? 'mo' : 'term'}</span>
                    </div>
                    <ul style="padding-left: 1.1rem; margin: 0; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5;">
                      ${plan.features.map(f => `<li style="margin-bottom: 0.3rem;">${f}</li>`).join('')}
                    </ul>
                  </div>
                  <div style="margin-top: 1rem; text-align: center;">
                    <span style="display: inline-block; width: 100%; padding: 0.45rem; border-radius: var(--radius-pill); font-size: 0.8rem; font-weight: 700; ${isSelected ? 'background: var(--primary-600); color: #fff;' : 'border: 1px solid var(--border-color); color: var(--text-muted);'}">
                      ${isSelected ? '✓ Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Payment Options & Checkout -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-900); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
              <span>Paystack Mobile Money & Card Checkout</span>
              <span style="color: var(--primary-700); font-size: 0.82rem; font-weight: 600;">🔒 256-Bit SSL Encrypted</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">MoMo / Billing Phone *</label>
                <input type="tel" id="sub-phone" class="form-input" value="${schoolPhone}" placeholder="e.g. 024 431 8900" required />
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label" style="font-size: 0.82rem;">Receipt Delivery Email *</label>
                <input type="email" id="sub-email" class="form-input" value="${schoolEmail}" placeholder="admin@school.edu.gh" required />
              </div>
            </div>

            <!-- Network Badges -->
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
              <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">Supported Channels:</span>
              <span style="background: #fef08a; color: #854d0e; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px;">🟡 MTN Mobile Money</span>
              <span style="background: #fee2e2; color: #991b1b; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px;">🔴 Telecel Cash</span>
              <span style="background: #e0e7ff; color: #3730a3; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px;">🔵 AT Money</span>
              <span style="background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px;">💳 Visa / Mastercard</span>
            </div>

            <button id="btn-pay-subscription" class="btn-pill btn-gold" style="width: 100%; padding: 0.9rem; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);">
              <span>⚡</span> Confirm & Pay GH₵ ${activePrice} via Paystack
            </button>
          </div>
        </div>
      </div>
      `;
    };

    div.innerHTML = renderModalContent();
    document.body.appendChild(div);

    const bindEvents = () => {
      div.querySelector('#modal-close').onclick = () => this.close();
      
      div.querySelector('#btn-cycle-monthly').onclick = () => {
        currentCycle = 'monthly';
        div.innerHTML = renderModalContent();
        bindEvents();
      };

      div.querySelector('#btn-cycle-termly').onclick = () => {
        currentCycle = 'termly';
        div.innerHTML = renderModalContent();
        bindEvents();
      };

      div.querySelectorAll('.tier-select-card').forEach(card => {
        card.onclick = () => {
          selectedTier = card.dataset.tier;
          div.innerHTML = renderModalContent();
          bindEvents();
        };
      });

      div.querySelector('#btn-pay-subscription').onclick = async () => {
        const btn = div.querySelector('#btn-pay-subscription');
        const phone = div.querySelector('#sub-phone').value.trim();
        const email = div.querySelector('#sub-email').value.trim();

        if (!phone || !email) {
          State.showToast("Please enter both phone number and email", "error");
          return;
        }

        btn.disabled = true;
        btn.innerHTML = `<span>⏳</span> Connecting to Paystack MoMo Gateway...`;

        try {
          const initRes = await API.initializeSchoolSubscription(school.id, {
            planTier: selectedTier,
            billingCycle: currentCycle,
            phone,
            email
          });

          if (initRes.isSimulated) {
            btn.innerHTML = `<span>📲</span> USSD Prompt Sent: Please approve GH₵ ${initRes.amountGHS} on ${phone}...`;
            State.showToast(`MTN/Telecel Prompt Sent! Approving simulated payment...`, 'info');

            setTimeout(async () => {
              try {
                const verifyRes = await API.verifySchoolSubscription(school.id, {
                  reference: initRes.reference,
                  planTier: pricing[selectedTier].name,
                  billingCycle: currentCycle
                });

                this.close();
                State.showToast(`🎉 Subscription Activated! ${schoolName} is now on ${pricing[selectedTier].name}.`, 'success');
                if (window.DashboardView && typeof DashboardView.render === 'function') {
                  DashboardView.render();
                } else {
                  App.navigate('schools');
                }
              } catch (vErr) {
                State.showToast(vErr.message, 'error');
                btn.disabled = false;
                btn.innerHTML = `<span>⚡</span> Confirm & Pay GH₵ ${pricing[selectedTier][currentCycle]} via Paystack`;
              }
            }, 1800);
          } else if (initRes.authorizationUrl) {
            window.location.href = initRes.authorizationUrl;
          }
        } catch (err) {
          State.showToast(err.message, 'error');
          btn.disabled = false;
          btn.innerHTML = `<span>⚡</span> Confirm & Pay GH₵ ${pricing[selectedTier][currentCycle]} via Paystack`;
        }
      };
    };

    bindEvents();
  },

  openLinkStudentModal() {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';
    div.innerHTML = `
      <div class="modal-dialog" style="max-width: 540px; width: 95%;">
        <div class="modal-header" style="background: var(--gradient-navy); color: #fff; padding: 1.5rem 1.75rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase; letter-spacing: 0.5px;">Parent Portal Student Enrollment</div>
            <h3 class="modal-title" style="color: #fff; margin: 0.25rem 0 0 0; font-size: 1.35rem;">Link Your Ward to Parent Portal</h3>
          </div>
          <button class="modal-close-btn" id="modal-close" style="color: #fff; opacity: 0.8;">&times;</button>
        </div>

        <form id="form-link-student" class="modal-body" style="padding: 1.75rem;">
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5;">
            Enter the <strong>Student Index Number</strong> or <strong>Digital ID Code</strong> issued by your child's school. Once verified, academic terminal reports, MoMo fee bills, and bus transit passes will sync instantly to your portal.
          </p>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-weight: 700;">Student Index Number / Digital ID *</label>
            <input type="text" id="link-student-id" class="form-input" placeholder="e.g. GIS-2026-0842 or STU-2026-001" required style="font-family: monospace; font-size: 1rem; text-transform: uppercase;" />
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-weight: 700;">Child / Ward Full Name *</label>
            <input type="text" id="link-student-name" class="form-input" placeholder="e.g. Nana Kwame Mensah" required />
          </div>

          <!-- Quick Suggestions for Demo -->
          <div style="margin-bottom: 1.5rem; background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Quick Select Demo Student:</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn-pill btn-outline demo-student-chip" data-id="GIS-2026-0842" data-name="Nana Kwame Mensah" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;">
                Nana Kwame (GIS-0842)
              </button>
              <button type="button" class="btn-pill btn-outline demo-student-chip" data-id="SOS-2026-012" data-name="Ama Serwaa Osei" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;">
                Ama Serwaa (SOS-012)
              </button>
              <button type="button" class="btn-pill btn-outline demo-student-chip" data-id="STU-2026-001" data-name="Kofi Mensah" style="font-size: 0.78rem; padding: 0.3rem 0.65rem;">
                Kofi Mensah (STU-001)
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-link">Cancel</button>
            <button type="submit" class="btn-pill btn-gold" id="btn-submit-link" style="font-weight: 800;">
              <span>✓</span> Verify & Link Ward
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);

    div.querySelector('#modal-close').onclick = () => this.close();
    div.querySelector('#btn-cancel-link').onclick = () => this.close();

    div.querySelectorAll('.demo-student-chip').forEach(chip => {
      chip.onclick = () => {
        div.querySelector('#link-student-id').value = chip.dataset.id;
        div.querySelector('#link-student-name').value = chip.dataset.name;
      };
    });

    div.querySelector('#form-link-student').onsubmit = async (e) => {
      e.preventDefault();
      const studentIdOrCode = div.querySelector('#link-student-id').value.trim();
      const studentName = div.querySelector('#link-student-name').value.trim();
      const submitBtn = div.querySelector('#btn-submit-link');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Verifying credentials...`;

      try {
        const res = await API.linkStudent({ studentIdOrCode, studentName });
        this.close();
        State.showToast(res.message || `Ward ${studentName} successfully linked!`, 'success');
        if (window.App) {
          App.navigate('parents');
        }
      } catch (err) {
        State.showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>✓</span> Verify & Link Ward`;
      }
    };
  },

  // Feature 4: Teacher NTC Verification & School Hiring Pipeline Modals
  openVerifyNTCModal(app, onVerified = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const defaultNtc = app.licenseNumber || 'NTC-ED-449102';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 540px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            🇬🇭 NATIONAL TEACHING COUNCIL (NTC) VERIFICATION
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0.25rem 0 0.15rem 0; color: #ffffff;">
            Verify Educator Licensure
          </h2>
          <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">
            ${app.teacherName} &nbsp;•&nbsp; ${app.jobTitle}
          </div>
          <button id="modal-close" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <form id="form-verify-ntc" style="padding: 1.5rem;">
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>🛡️</span> Republic of Ghana Teacher Registry Check
            </div>
            <div style="font-size: 0.82rem; color: #15803d; line-height: 1.4;">
              Validates license format, subject specialization, and disciplinary standing against the GES &amp; Ministry of Education database.
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">NTC License / Registration Number *</label>
            <input type="text" id="input-ntc-number" class="form-input" value="${defaultNtc}" style="font-family: monospace; font-size: 1rem; font-weight: 700; text-transform: uppercase;" required />
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
              Format: <code>NTC-ED-XXXXXX</code> or <code>NTC/LIC/GH/XXXXXX</code>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; background: #f8fafc; padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem;">
            <div>
              <span style="color: var(--text-muted); display: block; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Qualification</span>
              <strong style="color: var(--primary-900);">${app.qualification || 'B.Ed. Education'}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block; font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Experience</span>
              <strong style="color: var(--primary-900);">${app.experienceYears || 5} Years Classroom</strong>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-ntc">Cancel</button>
            <button type="submit" class="btn-pill btn-emerald" id="btn-submit-ntc" style="font-weight: 800;">
              <span>✓</span> Authenticate &amp; Award Gold Badge
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    div.querySelector('#modal-close').onclick = () => this.close();
    div.querySelector('#btn-cancel-ntc').onclick = () => this.close();

    div.querySelector('#form-verify-ntc').onsubmit = async (e) => {
      e.preventDefault();
      const ntc = div.querySelector('#input-ntc-number').value.trim();
      const submitBtn = div.querySelector('#btn-submit-ntc');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Authenticating with NTC Registry...`;

      try {
        await new Promise(r => setTimeout(r, 600));
        const res = await API.verifyTeacherNTC(app.id, ntc);
        this.close();
        State.showToast(`NTC License ${ntc} authenticated! Gold Badge awarded.`, 'success');
        if (onVerified) onVerified(res);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>✓</span> Authenticate &amp; Award Gold Badge`;
        State.showToast(err.message, 'error');
      }
    };
  },

  openScheduleInterviewModal(app, onScheduled = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    const defaultDate = '2026-11-06';
    const defaultTime = '10:30 AM';
    const defaultLink = `https://meet.google.com/gis-recruitment-${Math.floor(100 + Math.random() * 900)}`;

    div.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div style="background: linear-gradient(135deg, var(--primary-900) 0%, #1e3a8a 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            📅 ACADEMIC STAFFING &amp; HIRING DESK
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0.25rem 0 0.15rem 0; color: #ffffff;">
            Schedule Educator Interview
          </h2>
          <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">
            Candidate: <strong>${app.teacherName}</strong> &nbsp;•&nbsp; ${app.jobTitle}
          </div>
          <button id="modal-close" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <form id="form-schedule-interview" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Interview Date *</label>
              <input type="date" id="int-date" class="form-input" value="${defaultDate}" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Interview Time *</label>
              <input type="text" id="int-time" class="form-input" value="${defaultTime}" placeholder="e.g. 10:30 AM" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Venue / Location *</label>
            <input type="text" id="int-venue" class="form-input" value="GIS Cantonments Campus (Executive Conference Room) &amp; Virtual Stream" required />
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Virtual Google Meet Stream Link</label>
            <input type="url" id="int-link" class="form-input" value="${defaultLink}" />
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Panel Interviewer / Department Head</label>
            <input type="text" id="int-lead" class="form-input" value="Dr. Mary Ashun (Head of School)" />
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Candidate Brief &amp; Micro-teaching Demo Requirements</label>
            <textarea id="int-notes" class="form-input" rows="2" style="resize: vertical;">Candidate to present a 15-minute micro-teaching demonstration on Cambridge Advanced syllabus.</textarea>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.8rem; color: #1e40af;">
            📲 <strong>Instant Hubtel SMS &amp; Resend Email Alert:</strong> Candidate will immediately receive the date, venue, and video call link on their phone (${app.teacherPhone}).
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-interview">Cancel</button>
            <button type="submit" class="btn-pill btn-primary" id="btn-submit-interview" style="font-weight: 800;">
              <span>📅</span> Confirm &amp; Dispatch Alerts
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    div.querySelector('#modal-close').onclick = () => this.close();
    div.querySelector('#btn-cancel-interview').onclick = () => this.close();

    div.querySelector('#form-schedule-interview').onsubmit = async (e) => {
      e.preventDefault();
      const date = div.querySelector('#int-date').value;
      const time = div.querySelector('#int-time').value.trim();
      const venue = div.querySelector('#int-venue').value.trim();
      const meetingLink = div.querySelector('#int-link').value.trim();
      const interviewer = div.querySelector('#int-lead').value.trim();
      const notes = div.querySelector('#int-notes').value.trim();
      const submitBtn = div.querySelector('#btn-submit-interview');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Dispatching SMS &amp; Email...`;

      try {
        const res = await API.scheduleTeacherInterview(app.id, {
          date,
          time,
          venue,
          meetingLink,
          interviewer,
          notes
        });
        this.close();
        State.showToast(`Interview scheduled for ${app.teacherName}! Hubtel SMS &amp; Resend email sent.`, 'success');
        if (onScheduled) onScheduled(res);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>📅</span> Confirm &amp; Dispatch Alerts`;
        State.showToast(err.message, 'error');
      }
    };
  },

  openHireTeacherModal(app, onHired = null) {
    this.close();
    const div = document.createElement('div');
    div.id = 'modal-backdrop';
    div.className = 'modal-backdrop';

    div.innerHTML = `
      <div class="modal-card" style="max-width: 600px; width: 100%; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl); background: #ffffff;">
        <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color: #ffffff; padding: 1.5rem; position: relative;">
          <div style="font-size: 0.75rem; color: #a7f3d0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            🤝 OFFICIAL LETTER OF APPOINTMENT
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; margin: 0.25rem 0 0.15rem 0; color: #ffffff;">
            Hire Educator &amp; Issue Contract
          </h2>
          <div style="font-size: 0.82rem; color: rgba(255,255,255,0.85);">
            ${app.schoolName} &nbsp;•&nbsp; Appointee: <strong>${app.teacherName}</strong>
          </div>
          <button id="modal-close" style="color: #ffffff; position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>

        <form id="form-hire-teacher" style="padding: 1.5rem; max-height: 80vh; overflow-y: auto;">
          <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Candidate Licensure</div>
              <div style="font-weight: 800; color: #047857; font-size: 0.95rem;">
                ${app.ntcVerified ? '🛡️ NTC Certified' : '⚠️ Registered NTC'} (${app.licenseNumber})
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Compliance</div>
              <div style="font-size: 0.82rem; color: var(--primary-900); font-weight: 700;">NaSIA &amp; GES Approved</div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Official Designation / Role *</label>
            <input type="text" id="hire-role" class="form-input" value="${app.jobTitle}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Gross Monthly Salary (GH₵) *</label>
              <input type="number" id="hire-salary" class="form-input" value="8500" min="2000" step="100" required />
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Commencement Date *</label>
              <input type="date" id="hire-date" class="form-input" value="2026-11-15" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Contract Type</label>
              <select id="hire-type" class="form-select">
                <option value="Full-Time Permanent">Full-Time Permanent</option>
                <option value="Fixed 2-Year Contract">Fixed 2-Year Contract</option>
                <option value="Part-Time Specialist">Part-Time Specialist</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.82rem; font-weight: 700;">Probation Period</label>
              <select id="hire-probation" class="form-select">
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="0">No Probation</option>
              </select>
            </div>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #166534;">
            📜 <strong>Formal Appointment Dispatch:</strong> Submitting will mark the applicant as <strong>Hired</strong> in your school registry and immediately dispatch the official appointment letter via email and Hubtel SMS to ${app.teacherPhone}.
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-pill btn-outline" id="btn-cancel-hire">Cancel</button>
            <button type="submit" class="btn-pill btn-emerald" id="btn-submit-hire" style="font-weight: 800;">
              <span>🤝</span> Issue Contract &amp; Offer Position
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    div.querySelector('#modal-close').onclick = () => this.close();
    div.querySelector('#btn-cancel-hire').onclick = () => this.close();

    div.querySelector('#form-hire-teacher').onsubmit = async (e) => {
      e.preventDefault();
      const role = div.querySelector('#hire-role').value.trim();
      const salaryGHS = Number(div.querySelector('#hire-salary').value);
      const commencementDate = div.querySelector('#hire-date').value;
      const contractType = div.querySelector('#hire-type').value;
      const probationMonths = div.querySelector('#hire-probation').value;
      const submitBtn = div.querySelector('#btn-submit-hire');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳</span> Generating Formal Appointment...`;

      try {
        const res = await API.hireTeacher(app.id, {
          role,
          salaryGHS,
          commencementDate,
          contractType,
          probationMonths
        });
        this.close();
        State.showToast(`Congratulations! Contract offer issued to ${app.teacherName} (GH₵ ${salaryGHS.toLocaleString()}/mo).`, 'success');
        if (onHired) onHired(res);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>🤝</span> Issue Contract &amp; Offer Position`;
        State.showToast(err.message, 'error');
      }
    };
  }
};

