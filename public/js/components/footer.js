/**
 * SkoolFinder Ghana - Footer Component
 */
const Footer = {
  render() {
    return `
      <footer class="sd-footer" style="background-color: #0a1128; color: #ffffff; padding: 4.5rem 0 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
        <div class="container" style="background-color: #0a1128;">
          <div class="footer-grid-responsive" style="background-color: #0a1128; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3.5rem;">
            <!-- Brand Column -->
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
                <div class="brand-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800;">SkoolFinder</span>
              </div>
              <p style="color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.6; max-width: 380px; margin-bottom: 1.5rem;">
                Ghana’s premier verified education directory and institutional procurement platform. Connecting parents with accredited schools and schools with certified suppliers and educators.
              </p>
              <div style="font-size: 0.85rem; color: var(--gold-400); font-weight: 600;">
                📍 Greater Accra & Kumasi (Ashanti)
              </div>
            </div>

            <!-- School Discovery Quick Links -->
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin-bottom: 1.25rem;">
                School Directory
              </h3>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.9rem; color: rgba(255,255,255,0.75);">
                <li><a href="#" class="footer-link-schools">Search Accra Schools</a></li>
                <li><a href="#" class="footer-link-kumasi">Search Kumasi Schools</a></li>
                <li><a href="#" class="footer-link-cambridge">Cambridge & IGCSE Schools</a></li>
                <li><a href="#" class="footer-link-montessori">Montessori & Pre-Schools</a></li>
                <li><a href="#" class="footer-link-boarding">Boarding Schools in Ghana</a></li>
              </ul>
            </div>

            <!-- Dedicated Institutional Portals -->
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin-bottom: 1.25rem;">
                Institutional Portals
              </h3>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.9rem; color: rgba(255,255,255,0.75);">
                <li><a href="/suppliers" class="footer-portal-link" data-portal="suppliers">📦 Suppliers & B2B Procurement</a></li>
                <li><a href="/for-suppliers" class="footer-persona-link" data-view="for-suppliers" style="color: #fde68a;">✦ Why Join: For Suppliers</a></li>
                <li><a href="/schools" class="footer-portal-link" data-portal="schools">🏫 School Management OS</a></li>
                <li><a href="/for-schools" class="footer-persona-link" data-view="for-schools" style="color: #6ee7b7;">✦ Why Join: For Schools</a></li>
                <li><a href="/teachers" class="footer-portal-link" data-portal="teachers">🧑‍🏫 Teachers & Professionals</a></li>
                <li><a href="/for-teachers" class="footer-persona-link" data-view="for-teachers" style="color: #a7f3d0;">✦ Why Join: For Teachers</a></li>
                <li><a href="#" class="footer-link-verification">🛡️ How We Verify Information</a></li>
              </ul>
            </div>

            <!-- School Proprietors -->
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin-bottom: 1.25rem;">
                For Schools
              </h3>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.9rem; color: rgba(255,255,255,0.75);">
                <li><a href="/for-schools" class="footer-persona-link" data-view="for-schools" style="color: #bfdbfe; font-weight: 700;">🏛️ Why Join: For Schools & Heads</a></li>
                <li><a href="#" class="footer-link-claim">Claim Your School Profile</a></li>
                <li><a href="#" class="footer-link-pricing">Pricing & Monetization Packages</a></li>
                <li><a href="#" class="footer-link-leads">Lead Generation Analytics</a></li>
                <li><a href="#" class="footer-link-support">Admissions Support Desk</a></li>
              </ul>
            </div>
          </div>

          <!-- Copyright Strip -->
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: rgba(255,255,255,0.6);">
            <div>
              &copy; 2026 SkoolFinder Ghana. All rights reserved.
            </div>
            <div style="display: flex; gap: 1.5rem;">
              <a href="#" class="footer-policy-link" data-policy="privacy">Privacy Policy</a>
              <a href="#" class="footer-policy-link" data-policy="terms">Terms of Verification</a>
              <a href="#" class="footer-policy-link" data-policy="accreditation">Accreditation Guidelines</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  attachEvents() {
    document.querySelectorAll('.footer-link-schools').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.filters.region = 'Greater Accra';
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-link-kumasi').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.filters.region = 'Ashanti';
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-link-cambridge').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.filters.curriculum = 'Cambridge';
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-link-montessori').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.filters.curriculum = 'Montessori';
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-link-boarding').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.filters.boarding = 'Boarding';
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-persona-link').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        const view = el.getAttribute('data-view');
        if (view && typeof App !== 'undefined' && App.navigate) {
          App.navigate(view);
        } else if (view) {
          window.location.hash = '#/' + view;
        }
      };
    });

    document.querySelectorAll('.footer-portal-link').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        const portal = el.getAttribute('data-portal');
        if (portal === 'schools') {
          App.navigate('schools', State.currentUser?.schoolId || 'sch-gis-accra');
        } else {
          App.navigate(portal);
        }
      };
    });

    document.querySelectorAll('.footer-link-verification').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        if (State.currentView !== 'home') {
          App.navigate('home');
          setTimeout(() => {
            window.scrollTo({ top: 500, behavior: 'smooth' });
          }, 200);
        } else {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }
      };
    });

    document.querySelectorAll('.footer-link-claim').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        State.showToast("Select your school from the directory and click 'Claim Profile'.", "default");
        App.navigate('directory');
      };
    });

    document.querySelectorAll('.footer-link-pricing').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        App.navigate('pricing', 'schools');
      };
    });

    document.querySelectorAll('.footer-link-leads').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        App.navigate('dashboard', 'sch-gis-accra');
      };
    });

    document.querySelectorAll('.footer-link-support').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        Modals.openSupportModal();
      };
    });

    document.querySelectorAll('.footer-policy-link').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        Modals.openPolicyModal(el.dataset.policy);
      };
    });
  }
};
