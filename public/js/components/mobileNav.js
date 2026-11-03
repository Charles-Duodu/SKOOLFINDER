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
    const isExplore = current === 'explore' || current === 'matchmaker';
    const isCompare = current === 'compare';
    const isMySpace = current === 'parents' || current === 'parent-portal';

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

        <!-- 3. Explore Tab (Curated Hubs) -->
        <button id="mob-nav-explore" class="mobile-dock-btn ${isExplore ? 'active' : ''}" aria-label="Explore Hubs" aria-selected="${isExplore}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <span class="mobile-dock-label">Explore</span>
        </button>

        <!-- 4. Compare Tab (with Dynamic Badge) -->
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

        <!-- 5. My Space Tab (Parent Command Centre) -->
        <button id="mob-nav-myspace" class="mobile-dock-btn ${isMySpace ? 'active' : ''}" aria-label="My Space Parent Portal" aria-selected="${isMySpace}">
          <div class="mobile-dock-icon-wrap">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="mobile-dock-label">My Space</span>
        </button>
      </nav>
    `;
  },

  attachEvents() {
    const btnHome = document.getElementById('mob-nav-home');
    const btnDiscover = document.getElementById('mob-nav-discover');
    const btnExplore = document.getElementById('mob-nav-explore');
    const btnCompare = document.getElementById('mob-nav-compare');
    const btnMySpace = document.getElementById('mob-nav-myspace');

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

    if (btnExplore) {
      btnExplore.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('matchmaker');
      };
    }

    if (btnCompare) {
      btnCompare.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('compare');
      };
    }

    if (btnMySpace) {
      btnMySpace.onclick = (e) => {
        e.preventDefault();
        if (typeof App !== 'undefined') App.navigate('parents');
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

