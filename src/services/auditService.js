const { supabaseAdmin } = require('../config/supabase');

const inMemoryAuditLogs = [];

const AuditService = {
  /**
   * Logs administrative action to Supabase audit_events and in-memory cache
   */
  async log({ actorId = null, actorEmail = 'admin@skoolfinder.com.gh', action, targetType, targetId, details = {}, ip = '127.0.0.1' }) {
    const entry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      actor_email: actorEmail,
      action,
      target_type: targetType,
      target_id: String(targetId),
      details,
      ip_address: ip,
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
          action,
          target_type: targetType,
          target_id: String(targetId),
          details,
          ip_address: ip
        });
    } catch (err) {
      console.warn('[AUDIT NOTICE] Failed to persist audit event to DB:', err.message);
    }

    console.log(`🛡️ [ADMIN AUDIT] Action: ${action} | Target: ${targetType}:${targetId} by ${actorEmail}`);
    return entry;
  },

  getRecentLogs(limit = 50) {
    return inMemoryAuditLogs.slice(0, limit);
  }
};

module.exports = AuditService;

