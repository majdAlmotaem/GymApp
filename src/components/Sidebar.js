// Simplified Sidebar Component
import { store } from '../services/store.js';

export function renderSidebar() {
  const user = store.currentUser;
  if (!user) return '';

  const role = store.getCurrentRole();
  const activeTab = store.activeTab;
  const isLight = store.theme === 'light';

  // Dynamic Permissions
  const canMembers = store.hasPermission('view_members');
  const canPrivacy = store.hasPermission('manage_privacy');
  const canFinance = store.hasPermission('view_finances');
  const canAudit = store.hasPermission('view_audit_logs');
  const canUsers = store.hasPermission('manage_users');
  const canRoles = store.hasPermission('manage_roles');

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-icon">🛡️</div>
        <div>
          <div class="sidebar-brand-title">GymSec IAM</div>
          <div class="sidebar-brand-sub">Zugriffsverwaltung</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-title">Hauptmodule</div>

        ${canMembers ? `
          <button 
            class="nav-item ${activeTab === 'members' ? 'active' : ''}" 
            onclick="window.app.switchTab('members')"
          >
            <span>👥</span>
            <span>Mitglieder</span>
          </button>
        ` : ''}

        ${canPrivacy ? `
          <button 
            class="nav-item ${activeTab === 'privacy' ? 'active' : ''}" 
            onclick="window.app.switchTab('privacy')"
          >
            <span>🗑️</span>
            <span>Datenbereinigung</span>
          </button>
        ` : ''}

        ${canFinance ? `
          <button 
            class="nav-item ${activeTab === 'finances' ? 'active' : ''}" 
            onclick="window.app.switchTab('finances')"
          >
            <span>💳</span>
            <span>Finanzen</span>
          </button>
        ` : ''}

        ${canAudit ? `
          <button 
            class="nav-item ${activeTab === 'audit' ? 'active' : ''}" 
            onclick="window.app.switchTab('audit')"
          >
            <span>📋</span>
            <span>Audit-Log</span>
          </button>
        ` : ''}

        ${(canUsers || canRoles) ? `
          <div class="sidebar-section-title" style="margin-top: 0.65rem;">Administration</div>
          
          ${canUsers ? `
            <button 
              class="nav-item ${activeTab === 'user_mgmt' ? 'active' : ''}" 
              onclick="window.app.switchTab('user_mgmt')"
            >
              <span>👤</span>
              <span>Benutzerverwaltung</span>
            </button>
          ` : ''}

          ${canRoles ? `
            <button 
              class="nav-item ${activeTab === 'role_mgmt' ? 'active' : ''}" 
              onclick="window.app.switchTab('role_mgmt')"
            >
              <span>🛡️</span>
              <span>Rollenverwaltung</span>
            </button>
          ` : ''}
        ` : ''}
      </nav>

      <div class="sidebar-footer">
        <button class="theme-switch-btn" onclick="window.app.toggleTheme()" title="Design-Schema umschalten">
          <span>${isLight ? '☀️ Hell' : '🌙 Dunkel'}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${isLight ? 'Zu Dunkel' : 'Zu Hell'}</span>
        </button>

        <div class="user-badge-container">
          <div class="user-avatar-circle">${initials}</div>
          <div class="user-info-text">
            <div class="user-name-text">${user.name}</div>
            <div class="user-role-text">
              <span class="badge badge-${role ? role.badgeColor : 'gray'}">${role ? role.name : 'Keine Rolle'}</span>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary btn-sm" onclick="window.app.logout()" style="width: 100%;">
          🚪 Abmelden
        </button>
      </div>
    </aside>
  `;
}
