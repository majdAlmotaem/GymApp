// Enterprise Login Page Component
import { DEFAULT_USERS } from '../data/initialData.js';

export function renderLoginPage() {
  return `
    <div class="login-screen-root">
      <div class="login-card">
        <div class="login-brand">
          <div class="sidebar-logo-icon" style="width: 36px; height: 36px; font-size: 1.25rem;">
            🛡️
          </div>
          <div>
            <h1 class="login-title">GymSec Enterprise</h1>
            <div class="login-subtitle">Identity & Access Management Vault</div>
          </div>
        </div>

        <form id="login-form" onsubmit="window.app.handleLoginSubmit(event)">
          <div class="form-group">
            <label class="form-label" for="login-email">E-Mail-Adresse</label>
            <input 
              type="email" 
              id="login-email" 
              class="input-text" 
              placeholder="name@gymsec.local" 
              required
              value="admin@gymsec.local"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Passwort</label>
            <input 
              type="password" 
              id="login-password" 
              class="input-text" 
              placeholder="••••••••" 
              required
              value="admin"
            />
          </div>

          <div id="login-error-msg" style="color: var(--accent-rose); font-size: 0.8rem; margin-bottom: 0.85rem; display: none;"></div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.65rem;">
            Anmelden
          </button>
        </form>

        <div style="margin-top: 1.5rem;">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
            ⚡ Quick-Login für Demonstration:
          </div>
          <div class="quick-login-grid">
            ${DEFAULT_USERS.map(u => `
              <button 
                type="button" 
                class="quick-login-btn"
                onclick="window.app.quickLogin('${u.email}', '${u.password}')"
              >
                <div style="font-weight: 600;">${u.name}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${u.email}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
