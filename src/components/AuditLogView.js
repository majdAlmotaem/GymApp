// Simple Audit Log View (Flat Clean Table)
import { store } from '../services/store.js';

export function renderAuditLogView() {
  if (!store.hasPermission('view_audit_logs')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>view_audit_logs</code> zur Einsicht der System-Audit-Logs.
        </p>
      </div>
    `;
  }

  const logs = store.auditLogs;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Audit-Log (System- & Zugriffsprotokoll)</h3>
            <p class="card-description">
              Chronologische Übersicht aller sicherheitsrelevanten Aktionen im System.
            </p>
          </div>
          <span class="badge badge-gray">${logs.length} Einträge</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 170px;">Zeitstempel</th>
                <th style="width: 160px;">Benutzer</th>
                <th style="width: 180px;">Aktion</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(entry => `
                <tr>
                  <td>
                    <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
                      ${entry.timestamp}
                    </span>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${entry.user}</div>
                  </td>
                  <td>
                    <span class="badge ${getActionBadge(entry.action)}">
                      ${entry.action}
                    </span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); line-height: 1.35;">
                      ${entry.details}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function getActionBadge(action) {
  if (action.includes('anonymisiert') || action.includes('gelöscht')) return 'badge-amber';
  if (action.includes('Rolle') || action.includes('Benutzer')) return 'badge-purple';
  if (action.includes('Login') || action.includes('Logout')) return 'badge-blue';
  if (action.includes('Entschlüsselung') || action.includes('Einsicht')) return 'badge-rose';
  return 'badge-gray';
}
