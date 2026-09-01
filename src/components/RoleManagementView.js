// Role Management View (Tab 2 in Admin Dashboard)
import { store } from '../services/store.js';
import { PERMISSIONS } from '../data/initialData.js';

export function renderRoleManagementView() {
  if (!store.hasPermission('manage_roles')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>manage_roles</code> zur Verwaltung von Rollen und Rechten.
        </p>
      </div>
    `;
  }

  const roles = store.roles;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Rollenverwaltung & RBAC-Konfiguration</h3>
            <p class="card-description">
              Erstelle neue benutzerdefinierte Rollen und steuere granulare Zugriffsrechte für das gesamte System.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.app.openCreateRoleModal()">
            ➕ Neue Rolle erstellen
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rollenname</th>
                <th>Beschreibung</th>
                <th>Typ</th>
                <th>Aktive Berechtigungen</th>
                <th style="text-align: right;">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              ${roles.map(r => {
                const isSuperAdmin = r.id === 'role_admin';
                const count = isSuperAdmin ? PERMISSIONS.length : r.permissions.length;

                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="badge badge-${r.badgeColor}">${r.name}</span>
                      </div>
                      <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
                        ${r.id}
                      </div>
                    </td>

                    <td style="max-width: 280px; color: var(--text-secondary); font-size: 0.82rem;">
                      ${r.description}
                    </td>

                    <td>
                      <span class="badge ${r.isSystem ? 'badge-gray' : 'badge-purple'}">
                        ${r.isSystem ? 'System-Standard' : 'Benutzerdefiniert'}
                      </span>
                    </td>

                    <td>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; max-width: 340px;">
                        ${isSuperAdmin ? `
                          <span class="badge badge-purple">★ Alle Berechtigungen (Superadmin)</span>
                        ` : r.permissions.map(pKey => {
                          const pDef = PERMISSIONS.find(p => p.key === pKey);
                          return `
                            <span class="badge badge-gray" title="${pDef ? pDef.description : pKey}">
                              ${pDef ? pDef.label : pKey}
                            </span>
                          `;
                        }).join('')}
                      </div>
                    </td>

                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem;">
                        ${!r.isSystem ? `
                          <button 
                            class="btn btn-danger btn-sm"
                            onclick="window.app.deleteRole('${r.id}')"
                            title="Rolle löschen"
                          >
                            🗑️ Löschen
                          </button>
                        ` : `
                          <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
                            Geschützt
                          </span>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
