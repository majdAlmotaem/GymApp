// Access Denied (403 Forbidden) Shield Component
import { store } from '../services/store.js';

export function renderAccessDenied({ requiredRole, requiredPermission, featureTitle }) {
  const currentRoleConfig = store.getRoleConfig();

  return `
    <div class="access-denied-shield">
      <div class="shield-icon">🔒</div>
      <h2 class="shield-title">403 Forbidden – Zugriff verweigert</h2>
      <p class="shield-reason">
        Ihre aktuelle Identität <strong>${currentRoleConfig.title}</strong> (${currentRoleConfig.userProfile.id}) besitzt keine ausreichenden Berechtigungen für <strong>${featureTitle}</strong>.
      </p>
      
      <div class="shield-required-role">
        Erforderliche Richtlinie: ${requiredRole ? `Rolle [${requiredRole}]` : `Berechtigung [${requiredPermission}]`}
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
        <button class="btn btn-secondary" onclick="window.app.switchTab('members')">
          Zurück zur Mitgliederübersicht
        </button>
        <button class="btn btn-outline-cyan" onclick="window.app.openRBACMatrix()">
          📋 RBAC-Berechtigungsmatrix einsehen
        </button>
      </div>
    </div>
  `;
}
