/**
 * SkoolFinder Ghana - Blueprint v4.2 5-Tab Mobile Navigation Dock
 * Persistent bottom dock providing one-tap access to core parent journeys
 */
const MobileNav = {
  render() {
    const current = (typeof State !== 'undefined' && State.currentView) ? State.currentView : 'home';
    const compCount = (typeof State !== 'undefined' && Array.isArray(State.comparisonList)) ? State.comparisonList.length : 0;

    const isHome = current === 'home';
    const isDiscover = current === 'directory';
    const isCompare = current === 'compare';
    const isParents = current === 'parents' || current === 'parent-portal';
    const isSuppliers = current === 'suppliers' || current === 'supplier-dashboard';

    return `
      <nav class="mobile-nav-dock" aria-label="Mobile Navigation Dock" role="navigation">
        <!-- 1. Home Tab -->
        <button id="mob-nav-home" class="mobile-dock-btn ${isHome ? 'active' : ''}" aria-label="Home" aria-selected="${isHome}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span class="mobile-dock-label">Home</span>
        </button>

        <!-- 2. Discover Tab -->
        <button id="mob-nav-discover" class="mobile-dock-btn ${isDiscover ? 'active' : ''}" aria-label="Discover Schools" aria-selected="${isDiscover}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <span class="mobile-dock-label">Discover</span>
        </button>

        <!-- 3. Compare Tab (with Dynamic Badge) -->
        <button id="mob-nav-compare" class="mobile-dock-btn ${isCompare ? 'active' : ''}" aria-label="Compare Schools" aria-selected="${isCompare}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
              <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
              <path d="M7 21h10"></path>
              <path d="M12 3v18"></path>
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
            </svg>
            ${compCount > 0 ? `<span id="mob-dock-compare-badge" class="mobile-dock-badge">${compCount}</span>` : ''}
          </div>
          <span class="mobile-dock-label">Compare</span>
        </button>

        <!-- 4. Parents Tab (Family Cockpit) -->
        <button id="mob-nav-parents" class="mobile-dock-btn ${isParents ? 'active' : ''}" aria-label="Parents & Family Cockpit" aria-selected="${isParents}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span class="mobile-dock-label">Parents</span>
        </button>

        <!-- 5. Suppliers Tab (B2B Procurement) -->
        <button id="mob-nav-suppliers" class="mobile-dock-btn ${isSuppliers ? 'active' : ''}" aria-label="Suppliers & Services" aria-selected="${isSuppliers}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span class="mobile-dock-label">Suppliers</span>
        </button>
      </nav>
    `;
  },

  attachEvents() {
    const btnHome = document.getElementById('mob-nav-home');
    const btnDiscover = document.getElementById('mob-nav-discover');
    const btnCompare = document.getElementById('mob-nav-compare');
    const btnParents = document.getElementById('mob-nav-parents');
    const btnSuppliers = document.getElementById('mob-nav-suppliers');

    if (btnHome) {
      btnHome.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('home');
      };
    }

    if (btnDiscover) {
      btnDiscover.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('directory');
      };
    }

    if (btnCompare) {
      btnCompare.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('compare');
      };
    }

    if (btnParents) {
      btnParents.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('parents');
      };
    }

    if (btnSuppliers) {
      btnSuppliers.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('suppliers');
      };
    }
  },

  updateBadge() {
    const compCount = (typeof State !== 'undefined' && Array.isArray(State.comparisonList)) ? State.comparisonList.length : 0;
    const badgeWrap = document.querySelector('#mob-nav-compare .mobile-dock-icon-wrap');
    if (!badgeWrap) return;

    let badge = document.getElementById('mob-dock-compare-badge');
    if (compCount > 0) {
      if (badge) {
        badge.textContent = compCount;
      } else {
        badge = document.createElement('span');
        badge.id = 'mob-dock-compare-badge';
        badge.className = 'mobile-dock-badge';
        badge.textContent = compCount;
        badgeWrap.appendChild(badge);
      }
    } else {
      if (badge) badge.remove();
    }
  }
};

if (typeof window !== 'undefined') {
  window.MobileNav = MobileNav;
}

