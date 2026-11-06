const { supabaseAdmin } = require('../config/supabase');

const inMemoryAuditLogs = [];

const AuditService = {
  /**
   * Logs administrative action to Supabase audit_events and in-memory cache
   */
  async log({ actorId = null, actorEmail = 'admin@skoolfinder.com.gh', actorRole = 'super_admin', action, targetType, targetId, oldState = null, newState = null, details = {}, ip = '127.0.0.1', userAgent = null }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      actor_email: actorEmail,
      actor_role: actorRole,
      action,
      target_type: targetType,
      target_id: String(targetId),
      old_state: oldState,
      new_state: newState,
      details,
      ip_address: ip,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    };

    inMemoryAuditLogs.unshift(entry);
    if (inMemoryAuditLogs.length > 200) inMemoryAuditLogs.pop();

    try {
      await supabaseAdmin
        .from('audit_events')
        .insert({
          actor_id: actorId,
          actor_email: actorEmail,
          actor_role: actorRole,
          action,
          target_type: targetType,
          target_id: String(targetId),
          old_state: oldState,
          new_state: newState,
          details,
          ip_address: ip,
          user_agent: userAgent
        });
    } catch (err) {
      console.warn('[AUDIT NOTICE] Failed to persist audit event to DB:', err.message);
    }

    console.log(`🛡️ [ADMIN AUDIT] Action: ${action} | Target: ${targetType}:${targetId} by ${actorEmail} (${actorRole})`);
    return entry;
  },

  getRecentLogs(limit = 50) {
    return inMemoryAuditLogs.slice(0, limit);
  },

  async logAction({ action, target, details = {}, actorUser = null }) {
    const parts = (target || 'general:item').split(':');
    const targetType = parts[0] || 'general';
    const targetId = parts.slice(1).join(':') || 'item';
    return this.log({
      actorId: actorUser?.id || null,
      actorEmail: actorUser?.email || 'admin@skoolfinder.com.gh',
      actorRole: actorUser?.role || 'super_admin',
      action,
      targetType,
      targetId,
      details
    });
  }
};

module.exports = AuditService;

