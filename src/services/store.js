// Simplified Reactive Store & State Manager
import { DEFAULT_ROLES, DEFAULT_USERS, INITIAL_MEMBERS, FINANCIAL_METRICS } from '../data/initialData.js';

const STORAGE_KEYS = {
  CURRENT_USER: 'gymsec_current_user',
  ROLES: 'gymsec_roles',
  USERS: 'gymsec_users',
  MEMBERS: 'gymsec_members',
  LOGS: 'gymsec_audit_logs',
  FINANCIALS: 'gymsec_financials',
  THEME: 'gymsec_theme'
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    this.roles = this.loadStoredRoles();
    this.users = this.loadStoredUsers();
    this.currentUser = this.loadStoredCurrentUser();
    this.members = this.loadStoredMembers();
    this.financials = this.loadStoredFinancials();
    this.auditLogs = this.loadStoredLogs();
    this.activeTab = 'members';
    this.activeModal = null;
    this.toasts = [];

    // Apply theme
    this.applyTheme(this.theme);
  }

  loadStoredLogs() {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse audit logs', e);
      }
    }
    return [
      {
        id: 'LOG-001',
        timestamp: '01.09.2026, 10:00:00',
        user: 'System-Dienst',
        action: 'Systemstart',
        details: 'GymSec System initialisiert und betriebsbereit.'
      },
      {
        id: 'LOG-002',
        timestamp: '01.09.2026, 10:15:30',
        user: 'Alexei Richter',
        action: 'Benutzer-Login',
        details: 'Erfolgreiche Anmeldung am Dashboard.'
      }
    ];
  }

  loadStoredRoles() {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse roles', e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_ROLES));
  }

  loadStoredUsers() {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_USERS));
  }

  loadStoredCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return this.users[0] || null;
  }

  loadStoredMembers() {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse members', e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_MEMBERS));
  }

  loadStoredFinancials() {
    const saved = localStorage.getItem(STORAGE_KEYS.FINANCIALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse financials', e);
      }
    }
    return JSON.parse(JSON.stringify(FINANCIAL_METRICS));
  }

  saveRoles() {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(this.roles));
  }

  saveUsers() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  saveMembers() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(this.members));
  }

  saveLogs() {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.auditLogs));
  }

  // Theme Management
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEYS.THEME, this.theme);
    this.applyTheme(this.theme);
    this.notify();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Authentication
  async login(email, password) {
    const user = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('Benutzerkonto nicht gefunden.');
    }
    if (user.password !== password) {
      throw new Error('Ungültiges Passwort.');
    }

    this.currentUser = user;
    this.saveCurrentUser();
    this.activeTab = 'members';

    await this.logAudit({
      action: 'Benutzer-Login',
      details: `Erfolgreiche Anmeldung von ${user.name} (${user.email}).`
    });

    this.addToast(`Willkommen zurück, ${user.name}!`, 'success');
    this.notify();
    return user;
  }

  async logout() {
    if (this.currentUser) {
      await this.logAudit({
        action: 'Benutzer-Logout',
        details: `Sitzung von ${this.currentUser.name} beendet.`
      });
    }

    this.currentUser = null;
    this.saveCurrentUser();
    this.activeTab = 'members';
    this.addToast('Erfolgreich abgemeldet.', 'info');
    this.notify();
  }

  // Permission Evaluation
  getCurrentRole() {
    if (!this.currentUser) return null;
    return this.getRole(this.currentUser.roleId);
  }

  getRole(roleId) {
    return this.roles.find(r => r.id === roleId) || null;
  }

  hasPermission(permissionKey) {
    if (!this.currentUser) return false;
    const role = this.getCurrentRole();
    if (!role) return false;
    if (role.id === 'role_admin') return true;
    return role.permissions.includes(permissionKey);
  }

  // Dynamic Roles
  async addRole({ name, description, badgeColor = 'blue', permissions = [] }) {
    const id = `role_custom_${Date.now()}`;
    const newRole = {
      id,
      name,
      description,
      badgeColor,
      isSystem: false,
      permissions
    };

    this.roles.push(newRole);
    this.saveRoles();

    await this.logAudit({
      action: 'Rolle erstellt',
      details: `Neue Rolle "${name}" mit ${permissions.length} Berechtigungen angelegt.`
    });

    this.addToast(`Rolle "${name}" erfolgreich angelegt!`, 'success');
    this.notify();
    return newRole;
  }

  async deleteRole(roleId) {
    const role = this.getRole(roleId);
    if (!role || role.isSystem) {
      throw new Error('System-Standardrollen können nicht gelöscht werden.');
    }

    this.users.forEach(u => {
      if (u.roleId === roleId) u.roleId = 'role_trainer';
    });
    this.saveUsers();

    this.roles = this.roles.filter(r => r.id !== roleId);
    this.saveRoles();

    await this.logAudit({
      action: 'Rolle gelöscht',
      details: `Rolle "${role.name}" entfernt.`
    });

    this.addToast(`Rolle "${role.name}" gelöscht.`, 'warning');
    this.notify();
  }

  // Dynamic Users
  async updateUserRole(userId, newRoleId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const oldRoleId = user.roleId;
    user.roleId = newRoleId;
    this.saveUsers();

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser.roleId = newRoleId;
      this.saveCurrentUser();
    }

    const newRole = this.getRole(newRoleId);
    await this.logAudit({
      action: 'Rolle zugewiesen',
      details: `Rolle für Benutzer ${user.name} auf "${newRole ? newRole.name : newRoleId}" geändert.`
    });

    this.addToast(`Rolle für ${user.name} aktualisiert.`, 'success');
    this.notify();
  }

  async addUser({ name, email, password, department, roleId }) {
    const id = `USR-${String(this.users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id,
      name,
      email,
      password: password || 'gymsec123',
      department: department || 'Allgemein',
      roleId: roleId || 'role_trainer',
      status: 'ACTIVE'
    };

    this.users.push(newUser);
    this.saveUsers();

    await this.logAudit({
      action: 'Benutzer angelegt',
      details: `Neues Konto für ${name} (${email}) erstellt.`
    });

    this.addToast(`Benutzer "${name}" erfolgreich erstellt.`, 'success');
    this.notify();
    return newUser;
  }

  // Flat Simple Audit Logging
  async logAudit({ action, details }) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('de-DE');
    const timestamp = `${dateStr}, ${timeStr}`;

    const userName = this.currentUser ? this.currentUser.name : 'System';
    const entryId = `LOG-${String(this.auditLogs.length + 1).padStart(3, '0')}`;

    const newEntry = {
      id: entryId,
      timestamp,
      user: userName,
      action,
      details
    };

    this.auditLogs.unshift(newEntry);
    this.saveLogs();
    this.notify();
    return newEntry;
  }

  // Members
  getMember(id) {
    return this.members.find(m => m.id === id);
  }

  updateMember(id, updates) {
    const idx = this.members.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.members[idx] = { ...this.members[idx], ...updates };
      this.saveMembers();
      this.notify();
    }
  }

  // Navigation & Modals
  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  }

  openModal(modalName, data = null) {
    this.activeModal = { name: modalName, data };
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.notify();
  }

  addToast(message, type = 'info', duration = 3500) {
    const id = Date.now() + Math.random();
    this.toasts.push({ id, message, type });
    this.notify();
    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  async resetToDefaults() {
    localStorage.clear();
    this.roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    this.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
    this.currentUser = this.users[0];
    this.members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
    this.financials = JSON.parse(JSON.stringify(FINANCIAL_METRICS));
    this.auditLogs = this.loadStoredLogs();
    this.activeTab = 'members';
    this.theme = 'dark';
    this.applyTheme('dark');
    this.addToast('Demo-Daten zurückgesetzt.', 'success');
    this.notify();
  }
}

export const store = new Store();
