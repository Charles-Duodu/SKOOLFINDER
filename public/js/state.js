/**
 * SkoolFinder Ghana - Application State & UI Store
 */
const State = {
  currentView: 'home', // 'home' | 'directory' | 'school-detail' | 'compare' | 'suppliers' | 'jobs' | 'dashboard'
  currentSchoolId: null,
  
  filters: {
    search: '',
    region: 'All',
    suburb: 'All',
    level: 'All',
    curriculum: 'All',
    boarding: 'All',
    feeBand: 'All',
    facility: 'All'
  },

  comparisonList: [], // array of school objects (max 3)
  
  // Authentication & Session (Feature 5)
  currentUser: (() => {
    try {
      const stored = localStorage.getItem('skoolfinder_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })(),

  authToken: (() => {
    try {
      return localStorage.getItem('skoolfinder_token') || null;
    } catch (e) {
      return null;
    }
  })(),

  setCurrentUser(user, token) {
    this.currentUser = user;
    this.authToken = token;
    try {
      if (user && token) {
        localStorage.setItem('skoolfinder_user', JSON.stringify(user));
        localStorage.setItem('skoolfinder_token', token);
      } else {
        localStorage.removeItem('skoolfinder_user');
        localStorage.removeItem('skoolfinder_token');
      }
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  },

  logout() {
    if (typeof API !== 'undefined' && API.logout) {
      API.logout().catch(console.error);
    }
    this.setCurrentUser(null, null);
    this.showToast("Signed out successfully. You are now browsing as a guest.", "info");
    if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
      document.getElementById('header-root').innerHTML = Navbar.render();
      Navbar.attachEvents();
    }
    if (this.currentView === 'dashboard' || this.currentView === 'parent-portal') {
      if (typeof App !== 'undefined') App.navigate('home');
    }
  },

  isAuthenticated() {
    return !!(this.currentUser && this.authToken);
  },

  isSchoolAdmin(schoolId = null) {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'super_admin') return true;
    if (this.currentUser.role === 'school_admin') {
      if (!schoolId) return true;
      return this.currentUser.schoolId === schoolId;
    }
    return false;
  },

  isParent() {
    return !!(this.currentUser && this.currentUser.role === 'parent');
  },

  isTeacher() {
    return !!(this.currentUser && this.currentUser.role === 'teacher');
  },

  isSupplier() {
    return !!(this.currentUser && this.currentUser.role === 'supplier');
  },

  isSuperAdmin() {
    return !!(this.currentUser && this.currentUser.role === 'super_admin');
  },

  getUserPortal() {
    if (!this.currentUser) return 'home';
    switch (this.currentUser.role) {
      case 'parent': return 'parents';
      case 'teacher': return 'teachers';
      case 'supplier': return 'suppliers';
      case 'school_admin': return 'schools';
      case 'super_admin': return 'admin';
      default: return 'home';
    }
  },

  currentRole: 'parent', // 'parent' | 'school' | 'supplier' | 'teacher'

  // Comparison Management
  toggleCompare(school) {
    const idx = this.comparisonList.findIndex(s => s.id === school.id);
    if (idx > -1) {
      this.comparisonList.splice(idx, 1);
      this.showToast(`Removed ${school.name} from comparison.`);
    } else {
      if (this.comparisonList.length >= 3) {
        this.showToast(`You can compare up to 3 schools at a time.`, 'error');
        return false;
      }
      this.comparisonList.push(school);
      this.showToast(`Added ${school.name} to compare list.`, 'success');
    }
    this.renderComparisonBar();
    return true;
  },

  isInCompare(schoolId) {
    return this.comparisonList.some(s => s.id === schoolId);
  },

  clearCompare() {
    this.comparisonList = [];
    this.renderComparisonBar();
  },

  renderComparisonBar() {
    let bar = document.getElementById('comparison-floating-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'comparison-floating-bar';
      bar.className = 'comparison-floating-bar';
      document.body.appendChild(bar);
    }

    if (this.comparisonList.length === 0) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';
    bar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="comparison-counter-pill">${this.comparisonList.length} / 3</span>
        <span style="font-weight: 700; font-size: 0.95rem;">Schools Selected for Comparison</span>
      </div>
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <button id="btn-view-comparison" class="btn-pill btn-gold" style="padding: 0.4rem 1rem; font-size: 0.85rem;">
          Compare Now
        </button>
        <button id="btn-clear-comparison" style="color: rgba(255,255,255,0.7); font-size: 0.8rem; text-decoration: underline;">
          Clear
        </button>
      </div>
    `;

    document.getElementById('btn-view-comparison').onclick = () => {
      App.navigate('compare');
    };
    document.getElementById('btn-clear-comparison').onclick = () => {
      this.clearCompare();
      App.refreshCurrentView();
    };
  },

  // Toast System
  showToast(message, type = 'default') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
};
