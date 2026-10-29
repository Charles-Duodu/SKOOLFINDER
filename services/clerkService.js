/**
 * SkoolFinder Ghana - Clerk Multi-Tenant Organization & Auth Service
 * 
 * Handles:
 * - Clerk Organizations (Each School = 1 Clerk Org)
 * - Role-Based Access Control (RBAC): SuperAdmin, SchoolAdmin, Parent, Teacher, Supplier
 * - Webhook processing (user.created, organization.created, organizationMembership.created)
 * 
 * Documentation: https://clerk.com/docs/reference/backend-api
 */

require('dotenv').config();

class ClerkService {
  constructor() {
    this.secretKey = process.env.CLERK_SECRET_KEY || '';
    this.publishableKey = process.env.CLERK_PUBLISHABLE_KEY || '';
    this.webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';
  }

  isConfigured() {
    return Boolean(this.secretKey) && !this.secretKey.includes('mock') && this.secretKey.startsWith('sk_');
  }

  getProductionStatus() {
    const isLive = this.isConfigured();
    return {
      service: 'Clerk Multi-Tenant RBAC & Auth',
      isLive,
      operational: true,
      mode: isLive ? 'live_production' : 'sandbox_simulation',
      publishableKeyPrefix: this.publishableKey ? this.publishableKey.slice(0, 8) + '...' : 'awaiting_live_key',
      secretKeyConfigured: Boolean(this.secretKey)
    };
  }

  /**
   * Provisions a new Clerk Organization for a verified School
   */
  async createSchoolOrganization({ schoolName, slug, adminUserId }) {
    if (this.isConfigured()) {
      try {
        const payload = { name: schoolName };
        if (slug) payload.slug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (adminUserId) payload.created_by = adminUserId;

        let response = await fetch('https://api.clerk.com/v1/organizations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        let data = await response.json();

        // If Clerk organization slugs are not enabled in dashboard, fallback to name-only
        if (!response.ok && (data.errors?.[0]?.message?.includes('slug') || data.errors?.[0]?.code === 'organization_slugs_disabled')) {
          delete payload.slug;
          response = await fetch('https://api.clerk.com/v1/organizations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.secretKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          data = await response.json();
        }

        if (response.ok) {
          return { success: true, isLive: true, orgId: data.id, organization: data };
        }
        return { success: false, isLive: true, error: data.errors?.[0]?.message || 'Clerk error' };
      } catch (err) {
        return { success: false, isLive: true, error: err.message };
      }
    }

    // Simulated sandbox mode
    return {
      success: true,
      isLive: false,
      isSimulated: true,
      orgId: `org_sim_${slug || 'school'}_${Date.now()}`,
      organization: {
        id: `org_sim_${slug || 'school'}_${Date.now()}`,
        name: schoolName,
        slug: slug || schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      },
      note: 'Processed via SkoolFinder Sandbox Clerk Simulator. Set CLERK_SECRET_KEY in .env for live Clerk cloud sync.'
    };
  }
}

module.exports = new ClerkService();
