// Simplified Topbar Header Component
import { store } from '../services/store.js';

export function renderTopbar() {
  const activeTab = store.activeTab;

  const tabTitles = {
    members: 'Mitgliederübersicht',
    privacy: 'Datenbereinigung & Anonymisierung',
    finances: 'Finanzübersicht',
    audit: 'System-Audit-Log',
    user_mgmt: 'Benutzerverwaltung (Tab 1)',
    role_mgmt: 'Rollenverwaltung (Tab 2)'
  };

  const title = tabTitles[activeTab] || 'Dashboard';

  return `
    <header class="topbar">
      <div class="topbar-title">${title}</div>

      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-emerald);"></span>
          Online
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.app.resetDemo()" title="Standarddaten wiederherstellen">
          🔄 Reset
        </button>
      </div>
    </header>
  `;
}
