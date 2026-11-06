/**
 * SkoolFinder Ghana — Supplier Structured Inquiry & Direct Invitation Modal
 * Baseline: Master Blueprint v2.0 (SUP-02-04, SUP-03-08, SUP-06-03)
 */

const SupplierInquiryModal = {
  supplier: null,

  open(supplier, onSuccessCallback) {
    this.supplier = supplier;
    const existing = document.getElementById('supplier-inquiry-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', this.render());
    this.attachEvents(onSuccessCallback);
  },

  render() {
    const s = this.supplier || {};
    const companyName = s.company_name || s.companyName || 'Educational Supplier';
    const category = s.category || 'General Procurement';
    const currentUser = (typeof State !== 'undefined' && State.currentUser) ? State.currentUser : {};

    return `
      <div id="supplier-inquiry-modal" class="modal-overlay" style="display: flex; position: fixed; inset: 0; background: rgba(10, 32, 70, 0.75); z-index: 10005; align-items: center; justify-content: center; backdrop-filter: blur(6px); padding: 1rem;">
        <div class="modal-card" style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #cbd5e1; padding: 2rem;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #D5A63B; margin-bottom: 0.25rem;">
                Official School Procurement Inquiry
              </div>
              <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #0A2046; font-weight: 800; margin: 0;">
                Inquire with ${companyName}
              </h2>
              <div style="font-size: 0.82rem; color: #64748b; margin-top: 0.2rem;">
                Category: <strong>${category}</strong> • 🔒 End-to-End Scoped & Logged
              </div>
            </div>
            <button type="button" id="btn-close-inquiry-modal" style="background: none; border: none; font-size: 1.6rem; cursor: pointer; color: #64748b; line-height: 1;">&times;</button>
          </div>

          <!-- Direct Invitation Notice (SUP-02-04) -->
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #1e3a8a;">
            <strong>Direct School Engagement (SUP-02-04):</strong> Inquiries sent directly from schools to this vendor create an unblocked direct negotiation channel protected from open-market subscription caps.
          </div>

          <!-- Form Body -->
          <form id="form-supplier-inquiry">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  Your Name / School Officer *
                </label>
                <input type="text" id="inq-sender-name" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" value="${currentUser.full_name || currentUser.name || ''}" placeholder="e.g. Mrs. Mary Owusu" required />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  Official Email Address *
                </label>
                <input type="email" id="inq-sender-email" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" value="${currentUser.email || ''}" placeholder="e.g. bursar@school.edu.gh" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  School / Institution Name
                </label>
                <input type="text" id="inq-school-name" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" placeholder="e.g. Achimota Basic School" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  Phone / WhatsApp *
                </label>
                <input type="tel" id="inq-sender-phone" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" value="${currentUser.phone || ''}" placeholder="+233 24 000 0000" required />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0.85rem;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                Subject / Scope of Requirement *
              </label>
              <input type="text" id="inq-subject" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" placeholder="e.g. Request for Quotation: 150 Dual Desks for Academic Term 2" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  Target Delivery Timeline
                </label>
                <select id="inq-timeline" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;">
                  <option value="Urgent (Within 7 days)">Urgent (Within 7 days)</option>
                  <option value="Standard (Within 2 - 3 weeks)" selected>Standard (Within 2 - 3 weeks)</option>
                  <option value="Next Academic Term">Next Academic Term</option>
                  <option value="Flexible / Exploring Suppliers">Flexible / Exploring Suppliers</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                  Estimated Volume / Quantity
                </label>
                <input type="text" id="inq-volume" class="form-control" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" placeholder="e.g. 50 - 100 units / Bulk" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 0.3rem;">
                Procurement Details & Specification Notes *
              </label>
              <textarea id="inq-message" class="form-control" rows="4" style="width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; line-height: 1.4;" placeholder="Describe required dimensions, syllabus editions, delivery location in Accra/Kumasi, and whether an official Proforma Invoice / LPO is required." required></textarea>
            </div>

            <!-- Direct Invitation Toggle -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.65rem 0.85rem; margin-bottom: 1.25rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #334155; cursor: pointer;">
                <input type="checkbox" id="inq-direct-invitation" checked style="accent-color: #0A2046;" />
                <span><strong>Issue as Direct School Procurement Invitation (SUP-02-04)</strong> — Prioritizes response and protects supplier quotation from quota restrictions.</span>
              </label>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" id="btn-cancel-inquiry" class="btn-pill btn-outline" style="width: 35%; padding: 0.65rem; font-size: 0.85rem;">Cancel</button>
              <button type="submit" id="btn-submit-inquiry" class="btn-pill btn-emerald" style="width: 65%; padding: 0.65rem; font-weight: 800; font-size: 0.88rem;">Send Private Inquiry &rarr;</button>
            </div>

          </form>

        </div>
      </div>
    `;
  },

  attachEvents(onSuccessCallback) {
    const modal = document.getElementById('supplier-inquiry-modal');
    if (!modal) return;

    const close = () => modal.remove();
    document.getElementById('btn-close-inquiry-modal')?.addEventListener('click', close);
    document.getElementById('btn-cancel-inquiry')?.addEventListener('click', close);

    const form = document.getElementById('form-supplier-inquiry');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-submit-inquiry');
        btn.disabled = true;
        btn.textContent = 'Transmitting Inquiry...';

        const payload = {
          sender_name: document.getElementById('inq-sender-name').value.trim(),
          sender_email: document.getElementById('inq-sender-email').value.trim(),
          sender_phone: document.getElementById('inq-sender-phone').value.trim(),
          school_name: document.getElementById('inq-school-name').value.trim(),
          subject: document.getElementById('inq-subject').value.trim(),
          target_timeline: document.getElementById('inq-timeline').value,
          estimated_volume: document.getElementById('inq-volume').value.trim(),
          message: document.getElementById('inq-message').value.trim(),
          direct_invitation: document.getElementById('inq-direct-invitation').checked
        };

        try {
          const res = await API.sendSupplierInquiry(this.supplier.id, payload);
          if (res.success) {
            close();
            if (typeof State !== 'undefined' && State.showToast) {
              State.showToast(`Inquiry [${res.inquiryNumber}] delivered to ${this.supplier.company_name || this.supplier.companyName}!`, 'success');
            } else {
              alert(`Inquiry [${res.inquiryNumber}] successfully sent to supplier!`);
            }
            if (onSuccessCallback) onSuccessCallback(res);
          } else {
            alert(res.error || 'Failed to submit inquiry');
            btn.disabled = false;
            btn.textContent = 'Send Private Inquiry →';
          }
        } catch (err) {
          alert('Network error: ' + err.message);
          btn.disabled = false;
          btn.textContent = 'Send Private Inquiry →';
        }
      };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupplierInquiryModal;
}

