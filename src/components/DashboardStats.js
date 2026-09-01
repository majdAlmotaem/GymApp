// Overview Stats Component
import { store } from '../services/store.js';

export function renderDashboardStats() {
  const members = store.members;
  const activeCount = members.filter(m => m.status === 'ACTIVE').length;
  const anonymizedCount = members.filter(m => m.isAnonymized).length;
  const pendingGdpr = members.filter(m => m.status === 'CANCELLED_PENDING_GDPR').length;
  const auditLogsCount = store.auditLogs.length;

  const roleConfig = store.getRoleConfig();
  const canSeeFinance = roleConfig.permissions.viewFinancials;

  return `
    <div class="stats-grid">
      <div class="stat-card cyan">
        <div class="stat-header">
          <span class="stat-title">Aktive Mitglieder</span>
          <div class="stat-icon">👥</div>
        </div>
        <div class="stat-value">${activeCount}</div>
        <div class="stat-footer">
          <span style="color: var(--accent-emerald);">● ${members.length} Gesamt erfasst</span>
        </div>
      </div>

      <div class="stat-card emerald">
        <div class="stat-header">
          <span class="stat-title">Audit Chain Integrität</span>
          <div class="stat-icon">🔗</div>
        </div>
        <div class="stat-value">${auditLogsCount} Blöcke</div>
        <div class="stat-footer">
          <span style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.75rem;">
            SHA-256 Chained Log
          </span>
        </div>
      </div>

      <div class="stat-card amber">
        <div class="stat-header">
          <span class="stat-title">DSGVO Art. 17 Anonymisiert</span>
          <div class="stat-icon">⚖️</div>
        </div>
        <div class="stat-value">${anonymizedCount} <span style="font-size: 0.9rem; color: var(--text-muted);">(${pendingGdpr} offen)</span></div>
        <div class="stat-footer">
          <span style="color: var(--accent-amber);">Right to Erasure Compliance</span>
        </div>
      </div>

      <div class="stat-card purple">
        <div class="stat-header">
          <span class="stat-title">Finanz-Kennzahlen (MRR)</span>
          <div class="stat-icon">💳</div>
        </div>
        <div class="stat-value">
          ${canSeeFinance ? `${store.financials.mrr.toFixed(2)} €` : `<span class="pii-masked">•••••• [403 Gesperrt]</span>`}
        </div>
        <div class="stat-footer">
          <span>${canSeeFinance ? `${store.financials.activeContracts} Verträge in Abrechnung` : 'Nur für Management freigegeben'}</span>
        </div>
      </div>
    </div>
  `;
}
