/**
 * SkoolFinder Ghana - API Client Module
 */
const API = {
  baseUrl: '/api',

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
    const query = new URLSearchParams(filters);
    const res = await fetch(`${this.baseUrl}/teachers/bookings?${query.toString()}`);
    return res.json();
  },

  // PORTAL 5: SUPER ADMIN & REGULATORY DESK
  async getAdminOverview() {
    const res = await fetch(`${this.baseUrl}/admin/overview`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to load admin overview");
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
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/schools?${query.toString()}`);
    return res.json();
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
    const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${this.baseUrl}/suppliers${q}`);
    return res.json();
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
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/jobs?${query.toString()}`);
    return res.json();
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
    const query = new URLSearchParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] && filters[k] !== 'All') {
        query.append(k, filters[k]);
      }
    });
    const res = await fetch(`${this.baseUrl}/teachers?${query.toString()}`);
    return res.json();
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

  // Institutional Document Verification Vault (KYC/KYB)
  async uploadVerificationDoc(docData) {
    const res = await fetch(`${this.baseUrl}/verification/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
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

  // Authentication & Role-Based Security Engine (Feature 5)
  getAuthHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (typeof State !== 'undefined' && State.authToken) {
      headers['Authorization'] = `Bearer ${State.authToken}`;
    }
    return headers;
  },

  async login(login, password) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  async register(userData) {
    const res = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  async getCurrentUser() {
    const res = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  },

  async logout() {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
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
  }
};


