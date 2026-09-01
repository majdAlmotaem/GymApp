// Navbar and Session Banner Components
import { store } from '../services/store.js';
import { ROLES } from '../data/initialData.js';

export function renderNavbar() {
  const currentRole = store.currentRole;

  return `
    <header class="top-navbar">
      <div class="nav-wrapper">
        <div class="brand-section">
          <div class="brand-logo-icon">🛡️</div>
          <div>
            <div class="brand-title">GYMSEC // IAM & PRIVACY</div>
            <div class="brand-subtitle">COMPLIANCE & ACCESS VAULT</div>
          </div>
        </div>

        <div class="role-switcher-container">
          <span class="role-switcher-label">Identität:</span>
          <div class="role-pills">
            ${Object.values(ROLES).map(r => `
              <button 
                class="role-pill-btn ${currentRole === r.id ? 'active' : ''}" 
                data-role="${r.id}"
                onclick="window.app.switchRole('${r.id}')"
                title="${r.description}"
              >
                <span>${r.icon}</span>
                <span>${r.title.split(' ')[0]}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="nav-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.app.openRBACMatrix()" title="RBAC Berechtigungs-Matrix">
            📋 Matrix
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.app.resetDemo()" title="Demo-Daten zurücksetzen">
            🔄 Reset Demo
          </button>
        </div>
      </div>
    </header>
  `;
}

export function renderSessionBanner() {
  const roleConfig = store.getRoleConfig();
  const permissionsCount = Object.values(roleConfig.permissions).filter(Boolean).length;
  const totalPermissions = Object.keys(roleConfig.permissions).length;

  return `
    <div class="session-bar">
      <div class="session-user-info">
        <div class="user-avatar">${roleConfig.icon}</div>
        <div>
          <div class="user-name">
            ${roleConfig.userProfile.name}
            <span class="badge ${roleConfig.badgeClass}">${roleConfig.title}</span>
          </div>
          <div class="user-meta">
            ID: <span class="code-hash">${roleConfig.userProfile.id}</span> • Abteilung: ${roleConfig.userProfile.department}
          </div>
        </div>
      </div>

      <div class="session-security-flags">
        <div class="stat-footer" style="gap: 0.5rem;">
          <span style="color: var(--text-muted);">Autorisierung:</span>
          <span class="badge badge-cyan">${permissionsCount} / ${totalPermissions} Policies aktiv</span>
        </div>
        <div class="stat-footer" style="gap: 0.5rem;">
          <span style="color: var(--text-muted);">Session-Status:</span>
          <span class="badge badge-emerald">● 2FA Verifiziert</span>
        </div>
      </div>
    </div>
  `;
}
