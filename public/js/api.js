/**
 * SkoolFinder Ghana - API Client Module
 */
const API = {
  baseUrl: '/api',

  getHeaders(customHeaders = {}) {
    const defaults = { 'Content-Type': 'application/json' };
    return this.getAuthHeaders({ ...defaults, ...customHeaders });
  },

  getAuthHeaders(customHeaders = {}) {
    const headers = { ...customHeaders };
    const token = typeof State !== 'undefined' && State.authToken ? State.authToken : localStorage.getItem('skoolfinder_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // PORTAL AUTHENTICATION
  async login(login, password) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Login failed");
    return result;
  },

  async register(userData) {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Registration failed");
    return result;
  },

  async logout() {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (e) {}
    return { success: true };
  },

  async getMe() {
    const res = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  async getCurrentUser() {
    try {
      const data = await this.getMe();
      return data.user || data;
    } catch {
      return null;
    }
  },

  // --- DUAL AUTH: GHANA PHONE SMS OTP (HUBTEL GATEWAY) ---
  async sendOTP(phone, purpose = 'login') {
    const res = await fetch(`${this.baseUrl}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to send SMS OTP");
    return result;
  },

  async verifyOTP(phone, code) {
    const res = await fetch(`${this.baseUrl}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Invalid OTP code");
    return result;
  },

  async linkStudent(data) {
    const res = await fetch(`${this.baseUrl}/parents/link-student`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to link student");
    return result;
  },

  // --- SCHOOL ONBOARDING & ADMIN VETTING PIPELINE ---
  async registerSchoolForVetting(data) {
    const res = await fetch(`${this.baseUrl}/schools/register-vetting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "School registration failed");
    return result;
  },

  async getVettingQueue() {
    const res = await fetch(`${this.baseUrl}/admin/vetting/schools`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load vetting queue");
    return res.json();
  },

  async approveSchoolVetting(schoolId, options = {}) {
    const res = await fetch(`${this.baseUrl}/admin/vetting/schools/${schoolId}/approve`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to approve school vetting");
    return result;
  },

  async rejectSchoolVetting(schoolId, options = {}) {
    const res = await fetch(`${this.baseUrl}/admin/vetting/schools/${schoolId}/reject`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to reject school");
    return result;
  },

  async getSaaSStatus() {
    const res = await fetch(`${this.baseUrl}/saas/status`);
    if (!res.ok) throw new Error("Failed to load SaaS telemetry");
    return res.json();
  },

  async initializeSchoolSubscription(schoolId, data = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/subscribe/initialize`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to initialize subscription checkout");
    return result;
  },

  async verifySchoolSubscription(schoolId, data = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/subscribe/verify`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to verify subscription payment");
    return result;
  },

  // PORTAL 2: TUTOR BOOKINGS
  async bookTutor(bookingData) {
    const res = await fetch(`${this.baseUrl}/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to book tutor");
    return result;
  },

  async getTutorBookings(filters = {}) {
    try {
      const query = new URLSearchParams(filters);
      const res = await fetch(`${this.baseUrl}/teachers/bookings?${query.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  // PORTAL 5: SUPER ADMIN & REGULATORY DESK
  async getAdminOverview() {
    const res = await fetch(`${this.baseUrl}/admin/overview`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load admin overview");
    return res.json();
  },

  async getAdminSchools(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/schools?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load schools list");
    return res.json();
  },

  async createSchool(schoolData) {
    const res = await fetch(`${this.baseUrl}/admin/schools`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(schoolData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create school");
    return result;
  },

  async updateSchool(schoolId, updates) {
    const res = await fetch(`${this.baseUrl}/admin/schools/${schoolId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updates)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update school");
    return result;
  },

  async archiveSchool(schoolId, reason) {
    const res = await fetch(`${this.baseUrl}/admin/schools/${schoolId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ reason })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to archive school");
    return result;
  },

  async restoreSchool(schoolId) {
    const res = await fetch(`${this.baseUrl}/admin/schools/${schoolId}/restore`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to restore school");
    return result;
  },

  async impersonateSchool(schoolId) {
    const res = await fetch(`${this.baseUrl}/admin/impersonate/school/${schoolId}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to initiate impersonation");
    return result;
  },

  async getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/users?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load user accounts");
    return res.json();
  },

  async updateUserRole(userId, role) {
    const res = await fetch(`${this.baseUrl}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update user role");
    return result;
  },

  async updateUserStatus(userId, status) {
    const res = await fetch(`${this.baseUrl}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update user status");
    return result;
  },

  async createAdminUser(userData) {
    const res = await fetch(`${this.baseUrl}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to create user account");
    return result;
  },

  async getAdminFinanceSummary() {
    const res = await fetch(`${this.baseUrl}/admin/finance/summary`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load financial telemetry");
    return res.json();
  },

  async getAdminTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/finance/transactions?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load transactions");
    return res.json();
  },

  async getAdminVouchers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/finance/vouchers?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load vouchers");
    return res.json();
  },

  async getAdminSubscriptions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/finance/subscriptions?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load subscriptions");
    return res.json();
  },

  async updateAdminSubscription(id, data) {
    const res = await fetch(`${this.baseUrl}/admin/finance/subscriptions/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update subscription");
    return result;
  },

  async reverifyAdminTransaction(reference) {
    const res = await fetch(`${this.baseUrl}/admin/finance/verify-transaction/${reference}`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to re-verify transaction");
    return result;
  },

  // Phase 7: Admissions, Teachers NTC & B2B Procurement Desk
  async getAdminAdmissions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/admissions?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load admissions");
    return res.json();
  },

  async updateAdminAdmissionStatus(id, status) {
    const res = await fetch(`${this.baseUrl}/admin/admissions/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update admission status");
    return result;
  },

  async getAdminTeachersList(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/teachers?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load teachers");
    return res.json();
  },

  async toggleAdminTeacherNTC(id, verified) {
    const res = await fetch(`${this.baseUrl}/admin/teachers/${id}/verify`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ verified })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update teacher NTC status");
    return result;
  },

  async getAdminProcurementRFQs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/procurement/rfqs?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load tenders");
    return res.json();
  },

  async createAdminProcurementRFQ(data) {
    const res = await fetch(`${this.baseUrl}/admin/procurement/rfqs`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to publish tender");
    return result;
  },

  async updateAdminProcurementRFQStatus(id, status) {
    const res = await fetch(`${this.baseUrl}/admin/procurement/rfqs/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update tender status");
    return result;
  },

  async getAdminProcurementSuppliers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/admin/procurement/suppliers?${query}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load suppliers");
    return res.json();
  },

  async toggleAdminSupplierAccreditation(id, verified) {
    const res = await fetch(`${this.baseUrl}/admin/procurement/suppliers/${id}/verify`, {
      method: 'PATCH',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ verified })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update vendor accreditation");
    return result;
  },

  async adminSearch(q) {
    const res = await fetch(`${this.baseUrl}/admin/search?q=${encodeURIComponent(q)}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) return { results: { schools: [], users: [], payments: [] } };
    return res.json();
  },

  async verifyEntity(entityId, entityType, verified) {
    const res = await fetch(`${this.baseUrl}/admin/verify`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ entityId, entityType, verified })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update verification");
    return result;
  },

  async getAdminSubscriptions() {
    const res = await fetch(`${this.baseUrl}/admin/subscriptions`, {
      headers: this.getAuthHeaders()
    });
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${this.baseUrl}/stats`);
    return res.json();
  },

  async getSchools(filters = {}) {
    try {
      const query = new URLSearchParams();
      Object.keys(filters).forEach(k => {
        if (filters[k] && filters[k] !== 'All') {
          query.append(k, filters[k]);
        }
      });
      const res = await fetch(`${this.baseUrl}/schools?${query.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('getSchools error:', e);
      return [];
    }
  },

  async getSchoolById(id) {
    const res = await fetch(`${this.baseUrl}/schools/${id}`);
    if (!res.ok) throw new Error("School not found");
    return res.json();
  },

  async createSchool(schoolData) {
    const res = await fetch(`${this.baseUrl}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schoolData)
    });
    return res.json();
  },

  async recordLead(schoolId, type) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    return res.json();
  },

  async getSchoolAnalytics(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/analytics`);
    return res.json();
  },

  async claimSchool(schoolId, claimData) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });
    return res.json();
  },

  // Suppliers & RFQ
  async getSuppliers(category = null) {
    try {
      const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      const res = await fetch(`${this.baseUrl}/suppliers${q}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('getSuppliers error:', e);
      return [];
    }
  },

  async createSupplier(data) {
    const res = await fetch(`${this.baseUrl}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getRFQs(schoolId = null) {
    const q = schoolId ? `?schoolId=${encodeURIComponent(schoolId)}` : '';
    const res = await fetch(`${this.baseUrl}/rfqs${q}`);
    return res.json();
  },

  async getRFQById(id) {
    const res = await fetch(`${this.baseUrl}/rfqs/${id}`);
    return res.json();
  },

  async getRFQQuotes(rfqId) {
    const res = await fetch(`${this.baseUrl}/rfqs/${rfqId}/quotes`);
    return res.json();
  },

  async createRFQ(rfqData) {
    const res = await fetch(`${this.baseUrl}/rfqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData)
    });
    return res.json();
  },

  async submitQuote(rfqId, quoteData) {
    const res = await fetch(`${this.baseUrl}/rfqs/${rfqId}/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    return res.json();
  },

  async updateQuoteStatus(quoteId, status, reason = '') {
    const res = await fetch(`${this.baseUrl}/quotes/${quoteId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    });
    return res.json();
  },

  async getProcurementLogs() {
    const res = await fetch(`${this.baseUrl}/admin/procurement/logs`);
    return res.json();
  },

  async generateLPO(quoteId) {
    const res = await fetch(`${this.baseUrl}/quotes/${quoteId}/lpo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  async getLPO(lpoIdOrQuoteId) {
    const res = await fetch(`${this.baseUrl}/lpos/${lpoIdOrQuoteId}`);
    return res.json();
  },

  async disburseLPOMilestone(lpoId, milestoneIndex, paymentMethod = 'Paystack MoMo Escrow') {
    const res = await fetch(`${this.baseUrl}/lpos/${lpoId}/disburse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneIndex, paymentMethod })
    });
    return res.json();
  },

  // Jobs
  async getJobs(filters = {}) {
    try {
      const query = new URLSearchParams();
      Object.keys(filters).forEach(k => {
        if (filters[k] && filters[k] !== 'All') {
          query.append(k, filters[k]);
        }
      });
      const res = await fetch(`${this.baseUrl}/jobs?${query.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  async createJob(jobData) {
    const res = await fetch(`${this.baseUrl}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    return res.json();
  },

  async applyJob(jobId, appData) {
    const res = await fetch(`${this.baseUrl}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    return res.json();
  },

  // Teachers & Tutors Directory & Subscription (Phase 2)
  async getTeachers(filters = {}) {
    try {
      const query = new URLSearchParams();
      Object.keys(filters).forEach(k => {
        if (filters[k] && filters[k] !== 'All') {
          query.append(k, filters[k]);
        }
      });
      const res = await fetch(`${this.baseUrl}/teachers?${query.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('getTeachers error:', e);
      return [];
    }
  },

  async getTeacherById(id) {
    const res = await fetch(`${this.baseUrl}/teachers/${id}`);
    if (!res.ok) throw new Error("Teacher profile not found");
    return res.json();
  },

  async subscribeTeacher(teacherData) {
    const res = await fetch(`${this.baseUrl}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    });
    return res.json();
  },

  async recordTeacherLead(teacherId, type) {
    const res = await fetch(`${this.baseUrl}/teachers/${teacherId}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    return res.json();
  },

  // File & Document Upload (Supabase Storage / CDN)
  async uploadFile(fileData, filename = 'upload.jpg', bucket = 'school-media') {
    const res = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileData, filename, bucket })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  // Institutional Document Verification Vault (KYC/KYB)
  async uploadVerificationDoc(docData) {
    const res = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: docData.filename || 'verification_doc.pdf',
        fileData: docData.fileData || docData.base64 || docData.documentUrl || 'demo-content',
        bucket: 'documents'
      })
    });
    return res.json();
  },

  async getVerificationDocs(entityId) {
    const q = entityId ? `?entityId=${encodeURIComponent(entityId)}` : '';
    const res = await fetch(`${this.baseUrl}/verification/docs${q}`);
    return res.json();
  },

  // Mobile Money & Card Payment Gateway (Feature 1)
  async initializePayment(paymentData) {
    const res = await fetch(`${this.baseUrl}/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return res.json();
  },

  async verifyPayment(reference, networkDetails = {}) {
    const res = await fetch(`${this.baseUrl}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, ...networkDetails })
    });
    return res.json();
  },

  async getPaymentReceipt(reference) {
    const res = await fetch(`${this.baseUrl}/payments/receipt/${reference}`);
    return res.json();
  },

  async getTransactions(targetId = null) {
    const q = targetId ? `?targetId=${encodeURIComponent(targetId)}` : '';
    const res = await fetch(`${this.baseUrl}/payments/transactions${q}`);
    return res.json();
  },

  // CSSPS Senior High School Directory & BECE Placement Predictor (Feature 2)
  async getCSSPSSchools(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/cssps/schools?${query.toString()}`);
    return res.json();
  },

  async calculateCSSPS(inputs) {
    const res = await fetch(`${this.baseUrl}/cssps/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    });
    return res.json();
  },

  // Digital Student Admissions & Enrollment Management (Feature #1)
  async submitAdmissionApplication(data) {
    const res = await fetch(`${this.baseUrl}/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit admission application");
    }
    return res.json();
  },

  async getSchoolApplications(schoolId = null, filters = {}) {
    const query = new URLSearchParams();
    if (schoolId) query.append('schoolId', schoolId);
    if (filters.status && filters.status !== 'All') query.append('status', filters.status);
    if (filters.search) query.append('search', filters.search);
    const res = await fetch(`${this.baseUrl}/admissions/applications?${query.toString()}`);
    return res.json();
  },

  async getApplicationById(id) {
    const res = await fetch(`${this.baseUrl}/admissions/applications/${id}`);
    if (!res.ok) throw new Error("Application record not found");
    return res.json();
  },

  async updateApplicationStatus(id, updateData) {
    const res = await fetch(`${this.baseUrl}/admissions/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update application status");
    }
    return res.json();
  },

  async getAdmissionOfferLetter(id) {
    const res = await fetch(`${this.baseUrl}/admissions/applications/${id}/offer-letter`);
    if (!res.ok) throw new Error("Offer letter data could not be generated");
    return res.json();
  },

  // Feature 2: Verified Parent Reviews & Community Feedback
  async getSchoolReviews(schoolId, filters = {}) {
    const query = new URLSearchParams();
    if (filters.rating && filters.rating !== 'All') query.append('rating', filters.rating);
    if (filters.verifiedOnly) query.append('verifiedOnly', 'true');
    if (filters.search) query.append('search', filters.search);
    if (filters.sort) query.append('sort', filters.sort);
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/reviews?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to load school reviews");
    return res.json();
  },

  async submitSchoolReview(schoolId, reviewData) {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit review");
    }
    return res.json();
  },

  async voteReviewHelpful(reviewId) {
    const res = await fetch(`${this.baseUrl}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error("Failed to vote review as helpful");
    return res.json();
  },

  async replyToReview(reviewId, replyData) {
    const res = await fetch(`${this.baseUrl}/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to post official response");
    }
    return res.json();
  },

  // Feature 3: Direct Admissions Inquiries & School-to-Parent Messaging Center
  async getInquiries(params = {}) {
    const query = new URLSearchParams();
    if (params.schoolId) query.append('schoolId', params.schoolId);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const res = await fetch(`${this.baseUrl}/inquiries?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to load admissions inquiries");
    return res.json();
  },

  async getInquiryById(id) {
    const res = await fetch(`${this.baseUrl}/inquiries/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Inquiry thread not found");
    return res.json();
  },

  async getInquiryStats(schoolId = null) {
    const q = schoolId ? `?schoolId=${encodeURIComponent(schoolId)}` : '';
    const res = await fetch(`${this.baseUrl}/inquiries/stats${q}`);
    if (!res.ok) throw new Error("Failed to load inquiry statistics");
    return res.json();
  },

  async submitInquiry(data) {
    const res = await fetch(`${this.baseUrl}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send inquiry to school");
    }
    return res.json();
  },

  async replyToInquiry(inquiryId, replyData) {
    const res = await fetch(`${this.baseUrl}/inquiries/${inquiryId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send response");
    }
    return res.json();
  },

  async updateInquiryStatus(inquiryId, updateData) {
    const res = await fetch(`${this.baseUrl}/inquiries/${inquiryId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update inquiry status");
    }
    return res.json();
  },

  async lookupInquiry(inquiryNumber) {
    const res = await fetch(`${this.baseUrl}/inquiries/lookup/${encodeURIComponent(inquiryNumber)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Inquiry reference not found");
    }
    return res.json();
  },

  // Feature 4: Academic Resources & Past Questions Hub
  async getAcademicResources(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/resources?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to load academic resources");
    return res.json();
  },

  async getAcademicResourceById(id) {
    const res = await fetch(`${this.baseUrl}/resources/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Failed to load academic resource details");
    return res.json();
  },

  async getAcademicResourceStats() {
    const res = await fetch(`${this.baseUrl}/resources/stats`);
    if (!res.ok) throw new Error("Failed to load resource statistics");
    return res.json();
  },

  async downloadAcademicResource(id) {
    const res = await fetch(`${this.baseUrl}/resources/${encodeURIComponent(id)}/download`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error("Failed to log resource download");
    return res.json();
  },

  async createAcademicResource(data) {
    const res = await fetch(`${this.baseUrl}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to upload academic resource");
    }
    return res.json();
  },

  async getParentOverview() {
    const res = await fetch(`${this.baseUrl}/parent/overview`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to load parent overview");
    }
    return res.json();
  },

  async addParentWard(wardData) {
    const res = await fetch(`${this.baseUrl}/parents/wards`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(wardData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to add ward");
    return result;
  },

  async toggleSchoolBookmark(schoolId) {
    const res = await fetch(`${this.baseUrl}/parent/bookmarks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ schoolId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to toggle bookmark");
    }
    return res.json();
  },

  async importGuestContext(data) {
    const res = await fetch(`${this.baseUrl}/parents/import-guest-context`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to import guest context");
    return result;
  },

  // Blueprint v4.2 Phase 4: 5-State Decision Board & Private Shortlists
  async getParentShortlists() {
    const res = await fetch(`${this.baseUrl}/parents/shortlists`, {
      headers: this.getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to load shortlists");
    return result;
  },

  async updateParentShortlist(schoolId, data = {}) {
    const res = await fetch(`${this.baseUrl}/parents/shortlists`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ schoolId, ...data })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update shortlist");
    return result;
  },

  async removeParentShortlist(schoolId) {
    const res = await fetch(`${this.baseUrl}/parents/shortlists/${schoolId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to remove from shortlist");
    return result;
  },

  // Blueprint v4.2 Phase 5: Direct School Admissions Messaging & Visit Replies
  async replyInquiry(id, replyData = {}) {
    const res = await fetch(`${this.baseUrl}/inquiries/${encodeURIComponent(id)}/reply`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(replyData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to send inquiry reply");
    return result;
  },

  // Digital School Fee Invoicing & MoMo Payment Collection (Feature 6)
  async getInvoices(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/invoices?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch fee invoices");
    return res.json();
  },

  async getInvoiceById(id) {
    const res = await fetch(`${this.baseUrl}/invoices/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load invoice details");
    return res.json();
  },

  async createInvoice(invoiceData) {
    const res = await fetch(`${this.baseUrl}/invoices`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(invoiceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create invoice");
    return data;
  },

  async payInvoice(invoiceId, paymentData) {
    const res = await fetch(`${this.baseUrl}/invoices/${invoiceId}/pay`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to process payment");
    return data;
  },

  // Feature 4: Teacher NTC Verification & School Hiring Pipeline
  async getTeacherApplications(schoolId = 'sch-gis-accra') {
    const res = await fetch(`${this.baseUrl}/schools/${schoolId}/teacher-applications`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load teacher applications");
    return res.json();
  },

  async verifyTeacherNTC(teacherId, licenseNumber) {
    const res = await fetch(`${this.baseUrl}/teachers/${teacherId}/verify-ntc`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ licenseNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to verify NTC credentials");
    return data;
  },

  async scheduleTeacherInterview(applicationId, interviewData) {
    const res = await fetch(`${this.baseUrl}/teacher-applications/${applicationId}/interview`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(interviewData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to schedule interview");
    return data;
  },

  async hireTeacher(applicationId, hireData) {
    const res = await fetch(`${this.baseUrl}/teacher-applications/${applicationId}/hire`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(hireData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to issue appointment contract");
    return data;
  },

  // Automated SMS & WhatsApp Parent Communications (Feature 7)
  async getSMSLogs(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/notifications/sms?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load SMS gateway logs");
    return res.json();
  },

  async getSMSCredits(schoolId = 'sch-gis-accra') {
    const res = await fetch(`${this.baseUrl}/notifications/credits/${schoolId}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) return { credits: 2500 };
    return res.json();
  },

  async sendSMS(data) {
    const res = await fetch(`${this.baseUrl}/notifications/sms/send`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to send SMS notification");
    return result;
  },

  async broadcastSMS(schoolId, broadcastData) {
    const res = await fetch(`${this.baseUrl}/notifications/sms/broadcast`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ schoolId, ...broadcastData })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to broadcast SMS");
    return result;
  },

  // Feature 9: Terminal Report Cards & Digital Gradebook
  async getReportCards(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/academics/report-cards?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load report cards");
    return res.json();
  },

  async getReportCardById(id) {
    const res = await fetch(`${this.baseUrl}/academics/report-cards/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load report card");
    return res.json();
  },

  async updateReportCardGrades(id, data) {
    const res = await fetch(`${this.baseUrl}/academics/report-cards/${id}/grades`, {
      method: 'PUT',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update grades");
    return result;
  },

  async publishReportCard(id) {
    const res = await fetch(`${this.baseUrl}/academics/report-cards/${id}/publish`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to publish report card");
    return result;
  },

  // Feature 10: School Transport & Live Bus Tracking Hub
  async getTransportRoutes(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/transport/routes?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load school bus routes");
    return res.json();
  },

  async getTransportRouteById(id) {
    const res = await fetch(`${this.baseUrl}/transport/routes/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load bus route details");
    return res.json();
  },

  async getStudentBusPass(studentId = 'std-kwame-2026') {
    const res = await fetch(`${this.baseUrl}/transport/bus-pass/${studentId}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load student bus pass");
    return res.json();
  },

  async updateBusRouteStatus(id, data) {
    const res = await fetch(`${this.baseUrl}/transport/routes/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update bus route status");
    return result;
  },

  async broadcastBusDelay(id, data) {
    const res = await fetch(`${this.baseUrl}/transport/routes/${id}/delay-alert`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to broadcast bus delay alert");
    return result;
  },

  // Feature 11: Co-Curricular & After-School Clubs Management
  async getClubs(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/clubs?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load co-curricular clubs");
    return res.json();
  },

  async getClubById(id) {
    const res = await fetch(`${this.baseUrl}/clubs/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load club details");
    return res.json();
  },

  async getStudentClubMemberships(studentId = 'std-kwame-2026') {
    const res = await fetch(`${this.baseUrl}/clubs/student/${studentId}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load student club memberships");
    return res.json();
  },

  async enrollStudentInClub(clubId, enrollmentData) {
    const res = await fetch(`${this.baseUrl}/clubs/${clubId}/enroll`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(enrollmentData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to enroll in club");
    return result;
  },

  async awardClubMerit(clubId, studentId, badgeName) {
    const res = await fetch(`${this.baseUrl}/clubs/${clubId}/roster/${studentId}/merit`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ badgeName })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to award merit badge");
    return result;
  },

  // Feature 12: Alumni Mentorship & Career Guidance Network
  async getAlumni(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/alumni?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load alumni directory");
    return res.json();
  },

  async getAlumnusById(id) {
    const res = await fetch(`${this.baseUrl}/alumni/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Alumni profile not found");
    return res.json();
  },

  async getAlumniBookings(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/alumni/bookings?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load alumni mentorship bookings");
    return res.json();
  },

  async bookAlumniMentorship(mentorId, bookingData) {
    const res = await fetch(`${this.baseUrl}/alumni/${mentorId}/book`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(bookingData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to book mentorship session");
    return result;
  },

  // Feature 13 / Module #4: Health Sickbay & Medical Records / Student Dietary Management
  async getMedicalRecords(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/health/medical-records?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load medical records");
    return res.json();
  },

  async getStudentMedicalRecord(studentId = 'std-kwame-2026') {
    const res = await fetch(`${this.baseUrl}/health/medical-records/${studentId}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Student medical record not found");
    return res.json();
  },

  async updateStudentMedicalRecord(studentId, data) {
    const res = await fetch(`${this.baseUrl}/health/medical-records/${studentId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update medical record");
    return result;
  },

  async getSickbayLogs(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/health/sickbay-logs?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load sickbay visit logs");
    return res.json();
  },

  async logSickbayVisit(data) {
    const res = await fetch(`${this.baseUrl}/health/sickbay-logs`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to record sickbay clinic visit");
    return result;
  },

  async dispatchEmergencyMedicalSMS(logId, data = {}) {
    const res = await fetch(`${this.baseUrl}/health/sickbay-logs/${logId}/emergency-alert`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to dispatch emergency medical SMS");
    return result;
  },

  // Feature 14: Digital School Library & Textbook Lending System
  async getLibraryBooks(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/library/books?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load library catalog");
    return res.json();
  },

  async getLibraryBookById(id) {
    const res = await fetch(`${this.baseUrl}/library/books/${encodeURIComponent(id)}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load book details");
    return res.json();
  },

  async getLibraryLoans(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/library/loans?${query.toString()}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load library loan records");
    return res.json();
  },

  async borrowBook(data) {
    const res = await fetch(`${this.baseUrl}/library/loans`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to checkout library book");
    return result;
  },

  async returnBook(loanId, notes = "") {
    const res = await fetch(`${this.baseUrl}/library/loans/${encodeURIComponent(loanId)}/return`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ notes })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to process book return");
    return result;
  },

  async dispatchOverdueNoticeSMS(loanId) {
    const res = await fetch(`${this.baseUrl}/library/loans/${encodeURIComponent(loanId)}/overdue-notice`, {
      method: 'POST',
      headers: this.getAuthHeaders({ 'Content-Type': 'application/json' })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to dispatch overdue notice SMS");
    return result;
  },

  // FEATURE 15: AI Admissions & CSSPS Guidance Chatbot
  async queryAIChat(message, history = [], context = {}) {
    const res = await fetch(`${this.baseUrl}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to communicate with Akosua AI");
    return result;
  },

  // FEATURE 16: Digital Student & Staff ID Cards with QR Verification Badge
  async getStudentDigitalIDs(schoolId = 'sch-gis-accra') {
    const res = await fetch(`${this.baseUrl}/students/digital-ids?schoolId=${encodeURIComponent(schoolId)}`);
    return res.json();
  },

  async getStudentDigitalID(id) {
    const res = await fetch(`${this.baseUrl}/students/${encodeURIComponent(id)}/digital-id`);
    if (!res.ok) throw new Error("Digital ID record not found");
    return res.json();
  },

  async verifyDigitalID(codeOrIndex) {
    const res = await fetch(`${this.baseUrl}/students/verify-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeOrIndex, indexNumber: codeOrIndex })
    });
    return res.json();
  },

  // ============================================================================
  // BLUEPRINT v2.0: SCHOOL OWNER & PROPRIETOR PORTAL API (PHASE 1: SCH-001 - SCH-010)
  // ============================================================================

  async lookupSchoolClaim(query) {
    const res = await fetch(`${this.baseUrl}/schools/lookup-claim`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async registerSchoolWizard(data) {
    const res = await fetch(`${this.baseUrl}/schools/register-wizard`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to complete school registration wizard');
    }
    return res.json();
  },

  async getProprietorSchoolMembership() {
    const res = await fetch(`${this.baseUrl}/schools/my-membership`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getSchoolWorkspace(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/workspace`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to load school workspace');
    }
    return res.json();
  },

  async submitSchoolVerificationDoc(schoolId, docData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/verification-docs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(docData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload verification document');
    }
    return res.json();
  },

  async getSchoolVerificationDocs(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/verification-docs`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getSchoolProfileRevisions(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/profile-revisions`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async saveSchoolProfileDraft(schoolId, profileData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/profile-draft`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save profile draft');
    }
    return res.json();
  },

  async publishSchoolProfile(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/profile-publish`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to publish profile revision');
    }
    return res.json();
  },

  async getSchoolStaff(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/staff`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async inviteSchoolStaff(schoolId, inviteData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/staff/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(inviteData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send staff invitation');
    }
    return res.json();
  },

  async revokeSchoolStaff(schoolId, membershipId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/staff/${encodeURIComponent(membershipId)}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to revoke staff membership');
    }
    return res.json();
  },

  async getAdminVerificationCases() {
    const res = await fetch(`${this.baseUrl}/admin/verification-cases`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async reviewAdminVerificationCase(caseId, reviewData) {
    const res = await fetch(`${this.baseUrl}/admin/verification-cases/${encodeURIComponent(caseId)}/review`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit verification review');
    }
    return res.json();
  },

  async adminOverrideSchoolTier(schoolId, tier, days = 30) {
    const res = await fetch(`${this.baseUrl}/admin/subscriptions/${encodeURIComponent(schoolId)}/tier`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ tier, days })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to override subscription tier');
    }
    return res.json();
  },

  async adminResolveEscrowDispute(tenderId, resolutionData) {
    const res = await fetch(`${this.baseUrl}/admin/marketplace/escrow/${encodeURIComponent(tenderId)}/resolve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(resolutionData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to resolve escrow dispute');
    }
    return res.json();
  },

  async getAdminMarketplaceAuditLogs(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${this.baseUrl}/admin/marketplace/audit-log?${query}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch marketplace audit logs');
    }
    return res.json();
  },

  async getAdminEscrowDisputes() {
    const res = await fetch(`${this.baseUrl}/admin/marketplace/escrow/disputes`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch escrow disputes');
    }
    return res.json();
  },

  // ==========================================================================
  // PHASE 2A: COMMERCIAL SUBSCRIPTIONS API
  // ==========================================================================
  async getSubscriptionPlans() {
    const res = await fetch(`${this.baseUrl}/schools/plans`, { headers: this.getHeaders() });
    return res.json();
  },

  async getSchoolSubscription(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/subscription`, { headers: this.getHeaders() });
    return res.json();
  },

  async initializeSubscriptionCheckout(schoolId, checkoutData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/subscribe/initialize`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(checkoutData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout initialization failed');
    }
    return res.json();
  },

  async verifySubscriptionPayment(schoolId, verifyData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/subscribe/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(verifyData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  },

  async downgradeSubscription(schoolId, targetTier) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/subscribe/downgrade`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ targetTier })
    });
    return res.json();
  },

  async getSchoolInvoices(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/invoices`, { headers: this.getHeaders() });
    return res.json();
  },

  // ==========================================================================
  // PHASE 2A: ENQUIRY CRM API
  // ==========================================================================
  async createGuestEnquiry(schoolId, enquiryData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit enquiry');
    }
    return res.json();
  },

  async getSchoolEnquiries(schoolId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries?${query}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getEnquiryAnalytics(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries/analytics`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getEnquiryThread(schoolId, enquiryId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries/${encodeURIComponent(enquiryId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async replyToEnquiry(schoolId, enquiryId, replyData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries/${encodeURIComponent(enquiryId)}/reply`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(replyData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit reply');
    }
    return res.json();
  },

  async assignEnquiryStaff(schoolId, enquiryId, assignData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries/${encodeURIComponent(enquiryId)}/assign`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(assignData)
    });
    return res.json();
  },

  async updateEnquiryStatus(schoolId, enquiryId, statusData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/enquiries/${encodeURIComponent(enquiryId)}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(statusData)
    });
    return res.json();
  },

  // ==========================================================================
  // PHASE 2A: ADMISSIONS LIFECYCLE API
  // ==========================================================================
  async getSchoolIntakes(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/intakes`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createSchoolIntake(schoolId, intakeData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/intakes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(intakeData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create academic intake');
    }
    return res.json();
  },

  async getSchoolAdmissionsForm(schoolId, intakeId = '') {
    const q = intakeId ? `?intakeId=${encodeURIComponent(intakeId)}` : '';
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/admissions/form${q}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async saveSchoolAdmissionsForm(schoolId, formData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/admissions/form`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(formData)
    });
    return res.json();
  },

  async getSchoolApplications(schoolId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/admissions/applications?${query}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getSchoolApplicationById(schoolId, appId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/admissions/applications/${encodeURIComponent(appId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async transitionApplicationStatus(schoolId, appId, transitionData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/admissions/applications/${encodeURIComponent(appId)}/transition`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(transitionData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to transition application status');
    }
    return res.json();
  },

  async getSchoolTourSlots(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tours/slots`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createSchoolTourSlot(schoolId, slotData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tours/slots`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(slotData)
    });
    return res.json();
  },

  async bookSchoolTourSlot(schoolId, slotId, bookingData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tours/slots/${encodeURIComponent(slotId)}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  async trackParentAdmission(trackingCode) {
    const res = await fetch(`${this.baseUrl}/admissions/track/${encodeURIComponent(trackingCode)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async respondToAdmissionOffer(trackingCode, decision) {
    const res = await fetch(`${this.baseUrl}/admissions/offers/${encodeURIComponent(trackingCode)}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision })
    });
    return res.json();
  },

  // ==========================================================================
  // PHASE 2B: INSTITUTIONAL MARKETPLACE (VACANCIES, TENDERS & ESCROW)
  // Baseline: Blueprint v2.0 Sections 6, 12, 13, 23, 25, 26.4
  // ==========================================================================

  // 1. Vacancies & Teacher Recruiting
  async getSchoolVacancies(schoolId, params = {}) {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies${q ? '?' + q : ''}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createSchoolVacancy(schoolId, vacancyData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vacancyData)
    });
    return res.json();
  },

  async purchaseVacancyAddonSlot(schoolId, paymentData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/add-on-slot`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData)
    });
    return res.json();
  },

  async updateVacancyStatus(schoolId, vacancyId, status) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/${encodeURIComponent(vacancyId)}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getVacancyApplicants(schoolId, vacancyId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/${encodeURIComponent(vacancyId)}/applicants`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async updateVacancyApplicantStatus(schoolId, applicationId, data) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/applicants/${encodeURIComponent(applicationId)}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 2. B2B Procurement Tenders
  async getSchoolTenders(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createSchoolTender(schoolId, tenderData) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(tenderData)
    });
    return res.json();
  },

  async purchaseTenderCredits(schoolId, data = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/buy-credits`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getTenderBids(schoolId, tenderId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/bids`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async awardTenderContract(schoolId, tenderId, bidId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/award`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ bidId })
    });
    return res.json();
  },

  // 3. Milestone MoMo Escrow
  async getTenderEscrow(schoolId, tenderId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/escrow`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async fundEscrowMilestone(schoolId, tenderId, paymentData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/escrow-milestone`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData)
    });
    return res.json();
  },

  async signOffTenderDelivery(schoolId, tenderId, signoffData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/delivery-signoff`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(signoffData)
    });
    return res.json();
  },

  async raiseTenderDispute(schoolId, tenderId, disputeData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/dispute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(disputeData)
    });
    return res.json();
  },

  async getMarketplaceAuditLog(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/marketplace/audit-log`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // ==========================================================================
  // PHASE 4: ADVANCED INSTITUTIONAL HR & B2B PROCUREMENT CONTRACTS (OPTION C)
  // ==========================================================================
  async getTenderLPO(schoolId, tenderId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/lpo`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async signTenderLPO(schoolId, tenderId, signatureData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/lpo/sign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(signatureData)
    });
    return res.json();
  },

  async rateSupplierFulfillment(schoolId, tenderId, ratingData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/tenders/${encodeURIComponent(tenderId)}/rate-supplier`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(ratingData)
    });
    return res.json();
  },

  async generateTeacherOffer(schoolId, vacancyId, applicationId, offerData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/${encodeURIComponent(vacancyId)}/applicants/${encodeURIComponent(applicationId)}/offer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(offerData)
    });
    return res.json();
  },

  async getTeacherOffer(schoolId, vacancyId, applicationId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/vacancies/${encodeURIComponent(vacancyId)}/applicants/${encodeURIComponent(applicationId)}/offer`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getCandidateOffer(applicationId) {
    const res = await fetch(`${this.baseUrl}/jobs/applications/${encodeURIComponent(applicationId)}/offer`);
    return res.json();
  },

  async respondCandidateOffer(applicationId, responseData = {}) {
    const res = await fetch(`${this.baseUrl}/jobs/applications/${encodeURIComponent(applicationId)}/offer-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData)
    });
    return res.json();
  }

,

  // ==========================================================================
  // PHASE 5: ADVANCED INTELLIGENCE & CAMPUS OPERATIONS
  // ==========================================================================

  async getPredictiveYield(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/analytics/predictive-yield`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getCohortRetention(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/analytics/cohort-retention`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getRevenueProjections(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/analytics/revenue-projections`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getCampusAssets(schoolId, category = '') {
    const url = category
      ? `${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/assets?category=${encodeURIComponent(category)}`
      : `${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/assets`;
    const res = await fetch(url, { headers: this.getHeaders() });
    return res.json();
  },

  async createCampusAsset(schoolId, assetData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/assets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(assetData)
    });
    return res.json();
  },

  async updateCampusAsset(schoolId, assetId, updates = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/assets/${encodeURIComponent(assetId)}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async getLibraryBooks(schoolId, query = '') {
    const url = query
      ? `${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/library/books?q=${encodeURIComponent(query)}`
      : `${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/library/books`;
    const res = await fetch(url, { headers: this.getHeaders() });
    return res.json();
  },

  async addLibraryBook(schoolId, bookData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/library/books`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookData)
    });
    return res.json();
  },

  async issueLibraryLoan(schoolId, loanData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/library/loans`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loanData)
    });
    return res.json();
  },

  async returnLibraryLoan(schoolId, loanId, returnData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/library/loans/${encodeURIComponent(loanId)}/return`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(returnData)
    });
    return res.json();
  },

  async getTransportFleet(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/transport/fleet`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async addTransportVehicle(schoolId, vehicleData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/transport/fleet`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vehicleData)
    });
    return res.json();
  },

  async getTransportRoutes(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/transport/routes`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async createTransportRoute(schoolId, routeData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/operations/transport/routes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(routeData)
    });
    return res.json();
  },

  async createSchoolGroup(groupData = {}) {
    const res = await fetch(`${this.baseUrl}/groups/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(groupData)
    });
    return res.json();
  },

  async linkSchoolToGroup(groupId, schoolData = {}) {
    const res = await fetch(`${this.baseUrl}/groups/${encodeURIComponent(groupId)}/link-school`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(schoolData)
    });
    return res.json();
  },

  async getSchoolGroupDashboard(groupId) {
    const res = await fetch(`${this.baseUrl}/groups/${encodeURIComponent(groupId)}/dashboard`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async dispatchSchoolSms(schoolId, smsData = {}) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/communications/sms/dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(smsData)
    });
    return res.json();
  },

  async getSchoolSmsLogs(schoolId) {
    const res = await fetch(`${this.baseUrl}/schools/${encodeURIComponent(schoolId)}/communications/sms/logs`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // ==========================================================================
  // NATIONAL ECOSYSTEM & EXTERNAL REGULATORY INTEGRATIONS
  // ==========================================================================

  async generateEmisCensus(censusData = {}) {
    const res = await fetch(`${this.baseUrl}/integrations/emis/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(censusData)
    });
    return res.json();
  },

  async validateEmisCensus(censusData = {}) {
    const res = await fetch(`${this.baseUrl}/integrations/emis/validate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ censusData })
    });
    return res.json();
  },

  async exportEmisPayload(censusId, format = 'json') {
    const res = await fetch(`${this.baseUrl}/integrations/emis/export/${encodeURIComponent(censusId)}?format=${encodeURIComponent(format)}`, {
      headers: this.getHeaders()
    });
    if (format === 'csv') {
      return res.text();
    }
    return res.json();
  },

  async getEmisSubmissions(schoolId) {
    const res = await fetch(`${this.baseUrl}/integrations/emis/submissions/${encodeURIComponent(schoolId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async verifyWaecCandidate(candidateData = {}) {
    const res = await fetch(`${this.baseUrl}/integrations/waec/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(candidateData)
    });
    return res.json();
  },

  async getSchoolWaecAnalytics(schoolId, year = '2025') {
    const res = await fetch(`${this.baseUrl}/integrations/waec/analytics/${encodeURIComponent(schoolId)}?year=${encodeURIComponent(year)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async dispatchIntegrationSms(smsData = {}) {
    const res = await fetch(`${this.baseUrl}/integrations/sms/dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(smsData)
    });
    return res.json();
  },

  async configureIntegrationSmsGateway(configData = {}) {
    const res = await fetch(`${this.baseUrl}/integrations/sms/configure`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(configData)
    });
    return res.json();
  },

  async getIntegrationSmsStats(schoolId = 'all') {
    const res = await fetch(`${this.baseUrl}/integrations/sms/stats/${encodeURIComponent(schoolId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // ==========================================================================
  // EXPANSION 1: SPONSORED PROMOTIONS & FEATURED ADS (MODULE 9)
  // ==========================================================================

  async getPromotionPackages() {
    const res = await fetch(`${this.baseUrl}/promotions/packages`);
    return res.json();
  },

  async getActivePromotions(placement = null) {
    const query = placement ? `?placement=${encodeURIComponent(placement)}` : '';
    const res = await fetch(`${this.baseUrl}/promotions/active${query}`);
    return res.json();
  },

  async createSchoolCampaign(schoolId, campaignData = {}) {
    const res = await fetch(`${this.baseUrl}/promotions/school/${encodeURIComponent(schoolId)}/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(campaignData)
    });
    return res.json();
  },

  async checkoutPromotionCampaign(schoolId, campaignId) {
    const res = await fetch(`${this.baseUrl}/promotions/school/${encodeURIComponent(schoolId)}/${encodeURIComponent(campaignId)}/checkout`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async verifyPromotionPayment(schoolId, campaignId, paymentInfo = {}) {
    const res = await fetch(`${this.baseUrl}/promotions/school/${encodeURIComponent(schoolId)}/${encodeURIComponent(campaignId)}/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentInfo)
    });
    return res.json();
  },

  async getSchoolCampaigns(schoolId) {
    const res = await fetch(`${this.baseUrl}/promotions/school/${encodeURIComponent(schoolId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getCampaignAnalytics(campaignId) {
    const res = await fetch(`${this.baseUrl}/promotions/${encodeURIComponent(campaignId)}/analytics`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async trackPromotionImpression(campaignId) {
    const res = await fetch(`${this.baseUrl}/promotions/${encodeURIComponent(campaignId)}/track-impression`, {
      method: 'POST'
    });
    return res.json();
  },

  async trackPromotionClick(campaignId) {
    const res = await fetch(`${this.baseUrl}/promotions/${encodeURIComponent(campaignId)}/track-click`, {
      method: 'POST'
    });
    return res.json();
  },

  // ==========================================================================
  // EXPANSION 2: EVENT WEBHOOKS & AUTOMATED NOTIFICATIONS (MODULE 15)
  // ==========================================================================

  async getSupportedWebhookEvents() {
    const res = await fetch(`${this.baseUrl}/webhooks/events`);
    return res.json();
  },

  async registerSchoolWebhook(schoolId, subscriptionData = {}) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(subscriptionData)
    });
    return res.json();
  },

  async getSchoolWebhooks(schoolId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async testDispatchWebhook(schoolId, eventName, data = {}) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/test-dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ eventName, data })
    });
    return res.json();
  },

  async getWebhookDeliveries(schoolId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/deliveries`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getSchoolNotificationPreferences(schoolId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/preferences`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async updateSchoolNotificationPreferences(schoolId, preferences = {}) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/preferences`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(preferences)
    });
    return res.json();
  },

  async previewWhatsAppNotification(phone, template, vars = {}) {
    const res = await fetch(`${this.baseUrl}/webhooks/whatsapp/preview`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ phone, template, vars })
    });
    return res.json();
  },

  async redeliverWebhook(schoolId, deliveryId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/deliveries/${encodeURIComponent(deliveryId)}/retry`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async resetWebhookCircuitBreaker(schoolId, subscriptionId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/subscriptions/${encodeURIComponent(subscriptionId)}/reset-circuit-breaker`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async processWebhookRetryQueue(schoolId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/process-queue`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getWebhookQueueStats(schoolId) {
    const res = await fetch(`${this.baseUrl}/webhooks/school/${encodeURIComponent(schoolId)}/queue-stats`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  // ==========================================================================
  // EXPANSION 3: MULTI-REGION DIRECTORY & CSSPS (ASHANTI, CENTRAL, WESTERN)
  // ==========================================================================

  async getRegions() {
    const res = await fetch(`${this.baseUrl}/regions`);
    return res.json();
  },

  async getRegionalOverview(regionId) {
    const res = await fetch(`${this.baseUrl}/regions/${encodeURIComponent(regionId)}`);
    return res.json();
  },

  async searchRegionalSchools(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${this.baseUrl}/regions/schools?${query}`);
    return res.json();
  },

  async getCsspsDirectory() {
    const res = await fetch(`${this.baseUrl}/regions/cssps-categories`);
    return res.json();
  },

  // ==========================================================================
  // SUPER ADMIN UNIVERSAL TELEMETRY & MULTI-CHANNEL WEBHOOKS (PATHWAY 3)
  // ==========================================================================

  async getAdminWebhookTelemetry() {
    const res = await fetch(`${this.baseUrl}/admin/webhooks/telemetry`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getAdminSmsBalance() {
    const res = await fetch(`${this.baseUrl}/admin/sms/balance`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async getAdminGlobalWebhookDeliveries() {
    const res = await fetch(`${this.baseUrl}/admin/webhooks/global-deliveries`, {
      headers: this.getHeaders()
    });
    return res.json();
  },

  async adminRedeliverWebhook(deliveryId) {
    const res = await fetch(`${this.baseUrl}/admin/webhooks/deliveries/${encodeURIComponent(deliveryId)}/redeliver`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  },

  async adminResetCircuitBreaker(subscriptionId) {
    const res = await fetch(`${this.baseUrl}/admin/webhooks/subscriptions/${encodeURIComponent(subscriptionId)}/reset`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return res.json();
  }

};

if (typeof window !== "undefined") {
  window.API = API;
}
