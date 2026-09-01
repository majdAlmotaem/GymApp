// Simple Privacy & Anonymization View (Clean List of Ended Contracts)
import { store } from '../services/store.js';

export function renderPrivacyCenter() {
  if (!store.hasPermission('manage_privacy')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>manage_privacy</code> zur Datenanonymisierung.
        </p>
      </div>
    `;
  }

  // Show cancelled contracts or already anonymized contracts
  const endedMembers = store.members.filter(m => m.status === 'CANCELLED' || m.isAnonymized);

  return `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Beendete Verträge & Datenanonymisierung</h3>
            <p class="card-description">
              Übersicht aller gekündigten oder beendeten Mitgliedschaften zur datenschutzkonformen Bereinigung.
            </p>
          </div>
          <span class="badge badge-gray">${endedMembers.length} Einträge</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mitglied</th>
                <th>Kündigungsdatum</th>
                <th>Status</th>
                <th>Bankdaten (IBAN)</th>
                <th style="text-align: right;">Aktion</th>
              </tr>
            </thead>
            <tbody>
              ${endedMembers.length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    Aktuell liegen keine beendeten Verträge zur Bearbeitung vor.
                  </td>
                </tr>
              ` : endedMembers.map(m => `
                <tr>
                  <td>
                    <div style="font-weight: 600;">
                      ${m.isAnonymized ? '<span style="color: var(--text-muted);">Anonymisiert</span>' : `${m.firstName} ${m.lastName}`}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                      ${m.id} • ${m.email}
                    </div>
                  </td>

                  <td>
                    <span style="color: var(--text-secondary);">${m.cancelledDate || 'Beendet'}</span>
                  </td>

                  <td>
                    ${m.isAnonymized 
                      ? '<span class="badge badge-gray">● Anonymisiert</span>' 
                      : '<span class="badge badge-amber">● Gekündigt</span>'
                    }
                  </td>

                  <td>
                    <span class="pii-masked">
                      ${m.isAnonymized ? '[Gelöscht]' : (m.iban ? m.iban.replace(/\s/g, '').replace(/(.{4})(.*)(.{4})/, '$1 •••• $3') : '[Gelöscht]')}
                    </span>
                  </td>

                  <td style="text-align: right;">
                    ${!m.isAnonymized ? `
                      <button 
                        class="btn btn-danger btn-sm"
                        onclick="window.app.anonymizeMemberDirect('${m.id}')"
                        title="Name anonymisieren und Bankdaten entfernen"
                      >
                        🗑️ Daten anonymisieren
                      </button>
                    ` : `
                      <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
                        Bereits bereinigt
                      </span>
                    `}
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
