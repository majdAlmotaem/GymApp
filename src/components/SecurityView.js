// IT-Security & IAM Architecture View (IT-Admin Feature)
import { store } from '../services/store.js';
import { ROLES } from '../data/initialData.js';
import { renderAccessDenied } from './AccessDenied.js';

export function renderSecurityView() {
  const roleConfig = store.getRoleConfig();

  // RBAC Guard
  if (!roleConfig.permissions.manageRoles) {
    return renderAccessDenied({
      requiredRole: 'IT-Security & System Admin',
      requiredPermission: 'manageRoles',
      featureTitle: 'IAM Policy Engine & Security Center'
    });
  }

  const permissionsList = [
    { key: 'viewTrainingData', label: 'Trainingspläne einsehen' },
    { key: 'viewCheckIns', label: 'Check-In Verlauf ansehen' },
    { key: 'editTrainingPlan', label: 'Trainingspläne bearbeiten' },
    { key: 'viewBasicPII', label: 'Basis-PII (Name, Mail)' },
    { key: 'viewFullPII', label: 'Vollständige PII (IBAN, Geburtsdatum)' },
    { key: 'viewFinancials', label: 'Finanzdaten & Umsätze' },
    { key: 'viewAuditLogs', label: 'Kryptografische System-Logs' },
    { key: 'manageGDPR', label: 'DSGVO Art. 17 / 20 Steuerung' },
    { key: 'manageRoles', label: 'IAM Rollen & Policies' },
  ];

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Security Header -->
      <div class="card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(17, 24, 39, 0.8)); border-color: rgba(139, 92, 246, 0.25);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="stat-icon" style="background: rgba(139, 92, 246, 0.2); color: #C084FC; width: 48px; height: 48px; font-size: 1.5rem;">🛡️</div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #C084FC;">IAM Governance & RBAC-Matrix</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 650px;">
                Architektur zur Durchsetzung des <strong>Least-Privilege-Prinzips</strong>, rollenbasierten Zugriffsberechtigungen (RBAC) und Zero-Trust Richtlinien.
              </p>
            </div>
          </div>
          <button class="btn btn-outline-cyan" onclick="window.app.switchTab('audit')">
            🔗 Audit-Log Chain prüfen
          </button>
        </div>
      </div>

      <!-- Live RBAC Matrix Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div class="stat-icon" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan);">📐</div>
            <div>
              <h3 class="card-title">Rollen- & Berechtigungsmatrix (Policy Map)</h3>
              <p class="card-description">Aktive ACL-Konfiguration nach BSI IT-Grundschutz & DSGVO</p>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>System-Berechtigung (Permission Key)</th>
                <th style="text-align: center;">🏋️ Trainer</th>
                <th style="text-align: center;">👔 Studioleiter</th>
                <th style="text-align: center;">🛡️ IT-Admin</th>
                <th style="text-align: center;">⚖️ DPO</th>
              </tr>
            </thead>
            <tbody>
              ${permissionsList.map(p => `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${p.label}</div>
                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${p.key}</div>
                  </td>
                  <td style="text-align: center;">${renderPermCheck(ROLES.TRAINER.permissions[p.key])}</td>
                  <td style="text-align: center;">${renderPermCheck(ROLES.MANAGER.permissions[p.key])}</td>
                  <td style="text-align: center;">${renderPermCheck(ROLES.IT_ADMIN.permissions[p.key])}</td>
                  <td style="text-align: center;">${renderPermCheck(ROLES.DPO.permissions[p.key])}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Threat & Security Radar -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div class="stat-icon" style="background: rgba(239, 68, 68, 0.15); color: var(--accent-rose);">📡</div>
            <div>
              <h3 class="card-title">Security & Threat Monitor</h3>
              <p class="card-description">Live-Überwachung von Anmeldeversuchen, Token-Status und Anomalien</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">2FA Hardware-Enforcement</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #34D399; margin-top: 0.25rem;">100% Konform (FIDO2/WebAuthn)</div>
          </div>

          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">API Rate Limiting & WAF</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan); margin-top: 0.25rem;">Aktiv (120 req/min/IP)</div>
          </div>

          <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.8rem; color: var(--text-muted);">PII Encryption at Rest</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: #C084FC; margin-top: 0.25rem;">AES-256-GCM Hardware Vault</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPermCheck(hasPerm) {
  if (hasPerm) {
    return '<span style="color: #34D399; font-weight: bold; font-size: 1.1rem;">✓</span>';
  }
  return '<span style="color: #64748B; font-size: 1rem;">✕</span>';
}
