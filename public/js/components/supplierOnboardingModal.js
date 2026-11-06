/**
 * SkoolFinder Ghana — Supplier Self-Service Onboarding Modal Component
 * Baseline: Master Blueprint v2.0 (SUP-01-02, SUP-02-01, SUP-05-01, SUP-07-03)
 */

const SupplierOnboardingModal = {
  currentStep: 1,
  accountType: 'business', // 'business' | 'individual'
  selectedCategory: 'cat-books',

  open(onSuccessCallback) {
    this.currentStep = 1;
    this.accountType = 'business';
    const existing = document.getElementById('supplier-onboarding-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', this.render());
    this.attachEvents(onSuccessCallback);
  },

  render() {
    return `
      <div id="supplier-onboarding-modal" class="modal-overlay" style="display: flex; position: fixed; inset: 0; background: rgba(10, 32, 70, 0.75); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(6px); padding: 1rem;">
        <div class="modal-card" style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 620px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #cbd5e1; padding: 2rem;">
          
          <!-- Modal Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #D5A63B; margin-bottom: 0.25rem;">
                SkoolFinder Procurement Ecosystem
              </div>
              <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: #0A2046; font-weight: 800; margin: 0;">
                Join the Verified Supplier Registry
              </h2>
            </div>
            <button type="button" id="btn-close-onboarding-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; line-height: 1;">&times;</button>
          </div>

          <!-- Step Progress Indicator -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; position: relative;">
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #e2e8f0; z-index: 1;"></div>
            <div class="step-bullet ${this.currentStep >= 1 ? 'active' : ''}" style="width: 32px; height: 32px; border-radius: 50%; background: ${this.currentStep >= 1 ? '#0A2046' : '#ffffff'}; color: ${this.currentStep >= 1 ? '#ffffff' : '#64748b'}; border: 2px solid #0A2046; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; z-index: 2;">1</div>
            <div class="step-bullet ${this.currentStep >= 2 ? 'active' : ''}" style="width: 32px; height: 32px; border-radius: 50%; background: ${this.currentStep >= 2 ? '#0A2046' : '#ffffff'}; color: ${this.currentStep >= 2 ? '#ffffff' : '#64748b'}; border: 2px solid ${this.currentStep >= 2 ? '#0A2046' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; z-index: 2;">2</div>
            <div class="step-bullet ${this.currentStep >= 3 ? 'active' : ''}" style="width: 32px; height: 32px; border-radius: 50%; background: ${this.currentStep >= 3 ? '#0A2046' : '#ffffff'}; color: ${this.currentStep >= 3 ? '#ffffff' : '#64748b'}; border: 2px solid ${this.currentStep >= 3 ? '#0A2046' : '#cbd5e1'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; z-index: 2;">3</div>
          </div>

          <!-- Step 1: Account Type & Legal Identity -->
          <div id="onboarding-step-1" style="display: ${this.currentStep === 1 ? 'block' : 'none'};">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #0A2046; margin-bottom: 1rem;">
              Step 1: Select Provider Account Type
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <div id="opt-type-business" style="border: 2px solid ${this.accountType === 'business' ? '#0A2046' : '#cbd5e1'}; background: ${this.accountType === 'business' ? '#f0fdf4' : '#ffffff'}; border-radius: 10px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🏢</div>
                <div style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">Registered Business</div>
                <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.25rem;">Companies, distributors & workshops with RGD / TIN</div>
              </div>
              <div id="opt-type-individual" style="border: 2px solid ${this.accountType === 'individual' ? '#0A2046' : '#cbd5e1'}; background: ${this.accountType === 'individual' ? '#f0fdf4' : '#ffffff'}; border-radius: 10px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">👤</div>
                <div style="font-weight: 800; color: #0A2046; font-size: 0.95rem;">Qualified Individual</div>
                <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.25rem;">Sole artisans, specialized consultants & technicians</div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                ${this.accountType === 'business' ? 'Company / Enterprise Legal Name *' : 'Full Legal Name (as on Ghana Card) *'}
              </label>
              <input type="text" id="ob-company-name" class="form-control" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;" placeholder="${this.accountType === 'business' ? 'e.g. Accra Smart Educational Supplies Ltd' : 'e.g. Kwabena Asante'}" required />
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                ${this.accountType === 'business' ? 'Registrar General Dept (RGD) or TIN Number *' : 'Ghana Card (NIA) Number *'}
              </label>
              <input type="text" id="ob-registration-number" class="form-control" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;" placeholder="${this.accountType === 'business' ? 'e.g. CS123452024 / C0001234567' : 'GHA-712345678-9'}" required />
            </div>

            <button type="button" id="btn-step1-next" class="btn-pill btn-primary" style="width: 100%; padding: 0.75rem; font-weight: 700;">
              Continue to Category & Coverage &rarr;
            </button>
          </div>

          <!-- Step 2: Category Taxonomy & Coverage -->
          <div id="onboarding-step-2" style="display: ${this.currentStep === 2 ? 'block' : 'none'};">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #0A2046; margin-bottom: 1rem;">
              Step 2: Supplier Category & Coverage Area
            </h3>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                Primary Supply / Service Category (Admin Governed Taxonomy) *
              </label>
              <select id="ob-category-select" class="form-control" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="Books, Curricula & Stationery">📚 Books, Curricula & Stationery</option>
                <option value="Science, STEM & Lab Equipment">🔬 Science, STEM & Lab Equipment</option>
                <option value="Classroom & Office Furniture">🪑 Classroom & Office Furniture</option>
                <option value="IT, Computers & EdTech Hardware">💻 IT, Computers & EdTech Hardware</option>
                <option value="School Uniforms & Sportswear">👕 School Uniforms & Sportswear</option>
                <option value="Food, Groceries & Canteen Supplies">🍲 Food, Groceries & Canteen Supplies (FDA High Risk)</option>
                <option value="Student Transport & Logistics">🚌 Student Transport & Logistics (DVLA High Risk)</option>
                <option value="Facilities, Cleaning & Maintenance">🧹 Facilities, Cleaning & Maintenance</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                Operational Region & Base Locality *
              </label>
              <input type="text" id="ob-region-locality" class="form-control" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;" placeholder="e.g. Greater Accra (Dansoman / Industrial Area)" required />
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                Delivery / Service Coverage
              </label>
              <select id="ob-service-area" class="form-control" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="Greater Accra Only">Greater Accra Only</option>
                <option value="Greater Accra & Central Region">Greater Accra & Central Region</option>
                <option value="Greater Accra & Ashanti">Greater Accra & Ashanti (Kumasi)</option>
                <option value="Nationwide Delivery">Nationwide Delivery (All 16 Regions)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                Business Brief / Capacity Summary *
              </label>
              <textarea id="ob-description" class="form-control" rows="3" style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 8px;" placeholder="Describe your product lines, stock capacity, workshop fabrication capabilities or delivery timelines." required></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" id="btn-step2-back" class="btn-pill btn-outline" style="width: 30%; padding: 0.75rem;">&larr; Back</button>
              <button type="button" id="btn-step2-next" class="btn-pill btn-primary" style="width: 70%; padding: 0.75rem; font-weight: 700;">Continue to Verification &rarr;</button>
            </div>
          </div>

          <!-- Step 3: Private Document Verification & Submit -->
          <div id="onboarding-step-3" style="display: ${this.currentStep === 3 ? 'block' : 'none'};">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #0A2046; margin-bottom: 0.5rem;">
              Step 3: Verification Evidence & Mandatory Trading Gate
            </h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.25rem;">
              Uploaded documents are securely stored in a private restricted vault (<code style="background: #f1f5f9; padding: 0.1rem 0.3rem;">private_evidence</code>) accessible only by authorized compliance auditors.
            </p>

            <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #92400e;">
              🔒 <strong>Ghana Compliance Mandate (SUP-02-01):</strong> Your supplier profile will be submitted in <strong>Pending Status</strong>. Super Admin compliance officers review credentials before public trading and quotation rights are activated.
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">
                Upload Business Registration / Ghana Card Document (PDF, PNG, JPG) *
              </label>
              <input type="file" id="ob-evidence-file" class="form-control" style="width: 100%; padding: 0.5rem;" accept=".pdf,.png,.jpg,.jpeg" />
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.82rem; color: #334155; cursor: pointer;">
                <input type="checkbox" id="ob-compliance-attestation" style="margin-top: 0.2rem;" required />
                <span>I attest under penalty of sanction that all submitted business credentials, addresses, and product representations are authentic and comply with Ghanaian trade and safety regulations.</span>
              </label>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" id="btn-step3-back" class="btn-pill btn-outline" style="width: 30%; padding: 0.75rem;">&larr; Back</button>
              <button type="button" id="btn-step3-submit" class="btn-pill btn-emerald" style="width: 70%; padding: 0.75rem; font-weight: 800;">Submit for Accreditation &rarr;</button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  attachEvents(onSuccessCallback) {
    const modal = document.getElementById('supplier-onboarding-modal');
    if (!modal) return;

    // Close button
    const closeBtn = document.getElementById('btn-close-onboarding-modal');
    if (closeBtn) {
      closeBtn.onclick = () => modal.remove();
    }

    // Toggle Account Type
    const optBiz = document.getElementById('opt-type-business');
    const optInd = document.getElementById('opt-type-individual');
    if (optBiz && optInd) {
      optBiz.onclick = () => {
        this.accountType = 'business';
        optBiz.style.borderColor = '#0A2046';
        optBiz.style.background = '#f0fdf4';
        optInd.style.borderColor = '#cbd5e1';
        optInd.style.background = '#ffffff';
      };
      optInd.onclick = () => {
        this.accountType = 'individual';
        optInd.style.borderColor = '#0A2046';
        optInd.style.background = '#f0fdf4';
        optBiz.style.borderColor = '#cbd5e1';
        optBiz.style.background = '#ffffff';
      };
    }

    // Navigation Step 1 -> 2
    const btnNext1 = document.getElementById('btn-step1-next');
    if (btnNext1) {
      btnNext1.onclick = () => {
        const name = document.getElementById('ob-company-name').value.trim();
        const reg = document.getElementById('ob-registration-number').value.trim();
        if (!name || !reg) {
          alert('Please enter your legal business name and registration or Ghana Card number.');
          return;
        }
        this.currentStep = 2;
        document.getElementById('onboarding-step-1').style.display = 'none';
        document.getElementById('onboarding-step-2').style.display = 'block';
      };
    }

    // Navigation Step 2 -> 1
    const btnBack2 = document.getElementById('btn-step2-back');
    if (btnBack2) {
      btnBack2.onclick = () => {
        this.currentStep = 1;
        document.getElementById('onboarding-step-2').style.display = 'none';
        document.getElementById('onboarding-step-1').style.display = 'block';
      };
    }

    // Navigation Step 2 -> 3
    const btnNext2 = document.getElementById('btn-step2-next');
    if (btnNext2) {
      btnNext2.onclick = () => {
        const desc = document.getElementById('ob-description').value.trim();
        if (!desc) {
          alert('Please provide a brief capacity summary of your business.');
          return;
        }
        this.currentStep = 3;
        document.getElementById('onboarding-step-2').style.display = 'none';
        document.getElementById('onboarding-step-3').style.display = 'block';
      };
    }

    // Navigation Step 3 -> 2
    const btnBack3 = document.getElementById('btn-step3-back');
    if (btnBack3) {
      btnBack3.onclick = () => {
        this.currentStep = 2;
        document.getElementById('onboarding-step-3').style.display = 'none';
        document.getElementById('onboarding-step-2').style.display = 'block';
      };
    }

    // Submit Registration
    const btnSubmit = document.getElementById('btn-step3-submit');
    if (btnSubmit) {
      btnSubmit.onclick = async () => {
        const attestation = document.getElementById('ob-compliance-attestation').checked;
        if (!attestation) {
          alert('Please confirm the statutory compliance attestation.');
          return;
        }

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Submitting Application...';

        const payload = {
          company_name: document.getElementById('ob-company-name').value.trim(),
          registration_number: document.getElementById('ob-registration-number').value.trim(),
          account_type: this.accountType,
          category: document.getElementById('ob-category-select').value,
          region: document.getElementById('ob-region-locality').value.trim() || 'Greater Accra',
          service_area: document.getElementById('ob-service-area').value,
          description: document.getElementById('ob-description').value.trim(),
          billing_cycle: 'annual'
        };

        try {
          const token = (typeof State !== 'undefined' && State.authToken) || 
                        localStorage.getItem('skoolfinder_token') || 
                        localStorage.getItem('auth_token') || 
                        sessionStorage.getItem('auth_token');

          if (!token) {
            alert('Authentication required: Please sign in or register before submitting your supplier accreditation application.');
            if (typeof Modals !== 'undefined' && Modals.openLoginModal) {
              modal.remove();
              Modals.openLoginModal();
            }
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Submit for Accreditation &rarr;';
            return;
          }

          const res = await fetch('/api/suppliers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok && data.success) {
            modal.remove();
            if (typeof Modals !== 'undefined' && Modals.showNotification) {
              Modals.showNotification(data.message || 'Supplier registration submitted for review!', 'success');
            } else {
              alert(data.message || 'Registration submitted for Super Admin review!');
            }
            if (onSuccessCallback) onSuccessCallback(data.supplier);
          } else {
            alert(data.error || 'Registration failed. Please sign in or check requirements.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Submit for Accreditation &rarr;';
          }
        } catch (err) {
          alert('Network error submitting registration: ' + err.message);
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = 'Submit for Accreditation &rarr;';
        }
      };
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupplierOnboardingModal;
}
