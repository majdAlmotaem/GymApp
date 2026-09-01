// User Management View (Tab 1 in Admin Dashboard)
import { store } from '../services/store.js';

export function renderUserManagementView() {
  if (!store.hasPermission('manage_users')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>manage_users</code> zur Verwaltung von Benutzerkonten.
        </p>
      </div>
    `;
  }

  const users = store.users;
  const roles = store.roles;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Benutzerverwaltung (Mitarbeiterkonten)</h3>
            <p class="card-description">
              Verwaltung aller registrierten Konten und dynamische Zuweisung von RBAC-Rollen.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.app.openAddUserModal()">
            ➕ Neuen Benutzer anlegen
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Benutzer & ID</th>
                <th>E-Mail</th>
                <th>Abteilung</th>
                <th>Zugewiesene Rolle</th>
                <th>Status</th>
                <th style="text-align: right;">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => {
                const isCurrentUser = store.currentUser && store.currentUser.id === u.id;

                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600;">
                        ${u.name} ${isCurrentUser ? '<span class="badge badge-emerald" style="font-size: 0.65rem;">DU</span>' : ''}
                      </div>
                      <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${u.id}</div>
                    </td>

                    <td>
                      <span style="font-family: var(--font-mono); font-size: 0.82rem;">${u.email}</span>
                    </td>

                    <td>
                      <span style="color: var(--text-secondary);">${u.department}</span>
                    </td>

                    <td>
                      <select 
                        class="select-control"
                        onchange="window.app.changeUserRole('${u.id}', this.value)"
                        style="min-width: 180px;"
                      >
                        ${roles.map(r => `
                          <option value="${r.id}" ${u.roleId === r.id ? 'selected' : ''}>
                            ${r.name}
                          </option>
                        `).join('')}
                      </select>
                    </td>

                    <td>
                      <span class="badge badge-emerald">● ${u.status}</span>
                    </td>

                    <td style="text-align: right;">
                      <button 
                        class="btn btn-secondary btn-sm"
                        onclick="window.app.resetUserPassword('${u.id}')"
                        title="Passwort temporär zurücksetzen"
                      >
                        🔑 Reset
                      </button>
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
