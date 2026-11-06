/**
 * SkoolFinder Ghana - Global Utilities & Application State
 */
const Utils = {
  trackLead(schoolId, leadData = {}) {
    return Utils.trackLead(schoolId, leadData);
  },

  buildWhatsAppInquiryUrl(school, context = {}) {
    return Utils.buildWhatsAppInquiryUrl(school, context);
  },

  formatGhanaWhatsApp(phone) {
    if (!phone) return '233302777163';
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '233' + clean.substring(1);
    } else if (!clean.startsWith('233') && clean.length === 9) {
      clean = '233' + clean;
    }
    return clean || '233302777163';
  },

  buildWhatsAppInquiryUrl(school, context = {}) {
    if (!school) return 'https://wa.me/233302777163';
    const phone = this.formatGhanaWhatsApp(school.whatsapp || school.phone);
    const schoolName = school.name || 'Admissions Desk';
    let text = `Hello ${schoolName}, I found your school on SkoolFinder Ghana and would like to inquire about admissions.`;
    
    if (context.source === 'matchmaker') {
      text = `Hello ${schoolName}, your campus came up as a top recommended match for my child on the SkoolFinder Ghana Fit Adviser (${context.level || 'Admissions'}). Could you please share enrollment details?`;
    } else if (context.source === 'compare') {
      text = `Hello ${schoolName}, I am comparing accredited schools on SkoolFinder Ghana and shortlisted your campus. Could you share your latest verified fee schedule and admissions guidelines?`;
    } else if (context.level) {
      text = `Hello ${schoolName}, I found your campus on SkoolFinder Ghana and would like to inquire about admissions for ${context.level}.`;
    }
    
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  },

  trackLead(schoolId, leadData = {}) {
    if (typeof API !== 'undefined' && API.recordLead) {
      API.recordLead(schoolId, leadData).catch(() => {});
    }
  },

  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }
};
if (typeof window !== 'undefined') window.Utils = Utils;

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
    facility: 'All',
    facilities: []
  },

  formatGhanaWhatsApp(phone) {
    return Utils.formatGhanaWhatsApp(phone);
  },

  escapeHTML(str) {
    return Utils.escapeHTML(str);
  },

  comparisonList: (() => {
    try {
      const stored = localStorage.getItem('skoolfinder_compare_list');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch {
      return [];
    }
  })(),
  
  // Bookmarks & Shortlisted Schools
  bookmarkedSchoolIds: (() => {
    try {
      const stored = localStorage.getItem('skoolfinder_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),

  isBookmarked(schoolId) {
    return Array.isArray(this.bookmarkedSchoolIds) && this.bookmarkedSchoolIds.includes(schoolId);
  },

  async toggleBookmark(schoolId, schoolName = 'School') {
    const isSaved = this.isBookmarked(schoolId);
    if (isSaved) {
      this.bookmarkedSchoolIds = this.bookmarkedSchoolIds.filter(id => id !== schoolId);
      this.showToast(`Removed ${schoolName} from saved bookmarks.`, 'info');
    } else {
      this.bookmarkedSchoolIds.push(schoolId);
      this.showToast(`Saved ${schoolName} to bookmarks!`, 'success');
    }
    try {
      localStorage.setItem('skoolfinder_bookmarks', JSON.stringify(this.bookmarkedSchoolIds));
    } catch (e) {
      console.warn("Bookmark local storage write:", e);
    }

    if (this.isAuthenticated() && typeof API !== 'undefined' && API.toggleSchoolBookmark) {
      try {
        await API.toggleSchoolBookmark(schoolId);
      } catch (err) {
        console.warn("Backend bookmark sync:", err.message);
      }
    }
    return !isSaved;
  },
  
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

        // SUP-03-08: Guest shortlist persistent transfer upon authentication
        const guestSid = localStorage.getItem('skoolfinder_guest_shortlist_session');
        if (guestSid && typeof API !== 'undefined' && API.transferSupplierShortlist) {
          API.transferSupplierShortlist(guestSid).then(res => {
            if (res && res.transferredCount > 0) {
              this.showToast(`Transferred ${res.transferredCount} shortlisted supplier(s) to your school procurement account!`, 'success');
            }
          }).catch(e => console.warn('Guest shortlist transfer notice:', e));
        }
      } else {
        localStorage.removeItem('skoolfinder_user');
        localStorage.removeItem('skoolfinder_token');
      }
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  },

  // Multi-Campus Proprietor Management (Sprint 5)
  getManagedCampuses() {
    if (!this.currentUser) return [];
    if (Array.isArray(this.currentUser.managedCampuses) && this.currentUser.managedCampuses.length > 0) {
      return this.currentUser.managedCampuses;
    }
    return [this.currentUser.schoolId || 'sch-gis-accra'];
  },

  async switchPersona(persona) {
    if (!this.isAuthenticated()) {
      this.showToast('Please sign in to switch roles.', 'warning');
      return;
    }
    try {
      const res = await API.switchPersona(persona);
      if (res && res.success) {
        if (this.currentUser) {
          this.currentUser.activePersona = res.activePersona;
          this.currentUser.role = res.activePersona;
        }
        if (res.token) {
          this.setCurrentUser(this.currentUser, res.token);
        }
        this.showToast(`Switched active workspace to ${res.activePersona.replace('_', ' ').toUpperCase()}`, 'success');
        if (typeof Navbar !== 'undefined' && Navbar.render) {
          document.getElementById('header-root').innerHTML = Navbar.render();
          Navbar.attachEvents && Navbar.attachEvents();
        }
        
        // Auto-navigate to the persona workspace
        if (typeof App !== 'undefined' && App.navigate) {
          if (res.activePersona === 'parent') {
            App.navigate('parents');
          } else if (res.activePersona === 'teacher') {
            App.navigate('teachers');
          } else if (res.activePersona === 'school_admin') {
            App.navigate('schools');
          } else if (res.activePersona === 'super_admin') {
            App.navigate('admin');
          } else if (res.activePersona === 'supplier') {
            App.navigate('suppliers');
          }
        }
        return res;
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to switch workspace', 'error');
      throw err;
    }
  },

  switchCampus(schoolId) {
    this.currentSchoolId = schoolId;
    if (this.currentUser) {
      this.currentUser.activeSchoolId = schoolId;
      try {
        localStorage.setItem('skoolfinder_user', JSON.stringify(this.currentUser));
      } catch (e) {}
    }
  },

  // Super Admin Impersonation Engine (Phase 4)
  startImpersonation(token, school) {
    if (!this.authToken) return;
    try {
      localStorage.setItem('skoolfinder_admin_backup_token', this.authToken);
      localStorage.setItem('skoolfinder_admin_backup_user', JSON.stringify(this.currentUser));

      const impersonatedUser = {
        id: this.currentUser ? this.currentUser.id : '00000000-0000-0000-0000-000000000001',
        name: school.name,
        email: this.currentUser?.email || 'admin@skoolfinder.com.gh',
        role: 'school_admin',
        schoolId: school.slug || school.id || 'sch-gis-accra',
        activeSchoolId: school.slug || school.id || 'sch-gis-accra',
        isImpersonating: true,
        impersonatedSchoolName: school.name,
        impersonatedSchoolId: school.id
      };

      this.setCurrentUser(impersonatedUser, token);
    } catch (e) {
      console.warn("Impersonation storage error:", e);
    }
  },

  stopImpersonation() {
    try {
      const backupToken = localStorage.getItem('skoolfinder_admin_backup_token');
      const backupUserStr = localStorage.getItem('skoolfinder_admin_backup_user');

      if (backupToken && backupUserStr) {
        const backupUser = JSON.parse(backupUserStr);
        localStorage.removeItem('skoolfinder_admin_backup_token');
        localStorage.removeItem('skoolfinder_admin_backup_user');
        this.setCurrentUser(backupUser, backupToken);
        return true;
      }
    } catch (e) {
      console.warn("Stop impersonation error:", e);
    }
    return false;
  },

  isImpersonating() {
    try {
      return Boolean(localStorage.getItem('skoolfinder_admin_backup_token')) || Boolean(this.currentUser?.isImpersonating);
    } catch {
      return false;
    }
  },

  logout() {
    if (typeof API !== 'undefined' && API.logout) {
      API.logout().catch(console.error);
    }
    this.setCurrentUser(null, null);
    this.showToast("Signed out successfully. Returning to Home.", "info");
    if (typeof Navbar !== 'undefined' && document.getElementById('header-root')) {
      document.getElementById('header-root').innerHTML = Navbar.render();
      Navbar.attachEvents();
    }
    if (typeof App !== 'undefined' && App.navigate) {
      App.navigate('home');
    } else {
      window.location.hash = '';
      window.location.href = '/';
    }
  },

  isAuthenticated() {
    return !!(this.currentUser && this.authToken);
  },

  isSchoolAdmin(schoolId = null) {
    if (!this.currentUser) return false;
    if (this.currentUser.role === 'super_admin') return true;
    if (['school_admin', 'primary_proprietor', 'school_owner'].includes(this.currentUser.role)) {
      if (!schoolId) return true;
      return (this.currentUser.schoolId === schoolId || this.currentUser.school_id === schoolId);
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
      if (this.comparisonList.length >= 4) {
        this.showToast(`You can compare up to 4 schools at a time.`, "error");
        return false;
      }
      this.comparisonList.push(school);
      this.showToast(`Added ${school.name} to compare list.`, "success");
    }
    this.saveComparisonToStorage();
    this.renderComparisonBar();
    return true;
  },

  addMultipleToCompare(schools = []) {
    if (!Array.isArray(schools) || schools.length === 0) return 0;
    let addedCount = 0;
    for (const sch of schools) {
      if (!sch || !sch.id) continue;
      if (this.comparisonList.length >= 4) break;
      if (!this.comparisonList.some(s => s.id === sch.id)) {
        this.comparisonList.push(sch);
        addedCount++;
      }
    }
    this.saveComparisonToStorage();
    this.renderComparisonBar();
    if (addedCount > 0) {
      this.showToast(`Added ${addedCount} school${addedCount > 1 ? "s" : ""} to compare tray!`, "success");
    }
    return addedCount;
  },

  saveComparisonToStorage() {
    try {
      localStorage.setItem("skoolfinder_compare_list", JSON.stringify(this.comparisonList));
    } catch (e) {
      console.warn("Compare list local storage write:", e);
    }
  },

  isInCompare(schoolId) {
    return this.comparisonList.some(s => s.id === schoolId);
  },

  clearCompare() {
    this.comparisonList = [];
    try {
      localStorage.removeItem("skoolfinder_compare_list");
    } catch (e) {}
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

    if (typeof MobileNav !== 'undefined') MobileNav.updateBadge();
    const navPill = document.querySelector('#btn-nav-compare .comparison-counter-pill');
    if (navPill) navPill.textContent = this.comparisonList.length;

    if (this.comparisonList.length === 0) {
      bar.style.display = 'none';
      if (typeof document !== 'undefined') document.body.classList.remove('has-comparison-dock');
      return;
    }

    if (typeof document !== 'undefined') document.body.classList.add('has-comparison-dock');
    bar.style.display = 'flex';
    bar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="comparison-counter-pill">${this.comparisonList.length} / 4</span>
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

if (typeof window !== 'undefined') {
  window.State = State;
}
