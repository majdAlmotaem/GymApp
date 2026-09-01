// Main Application Entry Point & Router (Simplified)
import './styles/index.css';
import { store } from './services/store.js';
import { renderLoginPage } from './components/LoginPage.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderTopbar } from './components/Topbar.js';
import { renderMemberList, setMemberSearch, setMemberFilter } from './components/MemberList.js';
import { renderPrivacyCenter } from './components/PrivacyCenter.js';
import { renderFinanceView } from './components/FinanceView.js';
import { renderAuditLogView } from './components/AuditLogView.js';
import { renderUserManagementView } from './components/UserManagementView.js';
import { renderRoleManagementView } from './components/RoleManagementView.js';
import { renderModals } from './components/Modals.js';
import { renderToasts } from './components/Toasts.js';
import { anonymizeMember } from './services/privacyService.js';

function renderApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  // 1. If not authenticated, render Login Screen
  if (!store.currentUser) {
    appRoot.innerHTML = `
      ${renderLoginPage()}
      ${renderToasts()}
    `;
    return;
  }

  // 2. Render Main Workspace Layout
  const activeTab = store.activeTab;

  appRoot.innerHTML = `
    <div class="layout-root">
      ${renderSidebar()}
      
      <div class="main-wrapper">
        ${renderTopbar()}

        <main class="content-area">
          ${renderTabContent(activeTab)}
        </main>
      </div>
    </div>

    <!-- Modals & Toasts -->
    ${renderModals()}
    ${renderToasts()}
  `;
}

function renderTabContent(tab) {
  switch (tab) {
    case 'members':
      return renderMemberList();
    case 'privacy':
      return renderPrivacyCenter();
    case 'finances':
      return renderFinanceView();
    case 'audit':
      return renderAuditLogView();
    case 'user_mgmt':
      return renderUserManagementView();
    case 'role_mgmt':
      return renderRoleManagementView();
    default:
      return renderMemberList();
  }
}

// Global App Event Handlers
window.app = {
  // Authentication
  handleLoginSubmit: async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');

    try {
      await store.login(email, password);
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
      }
    }
  },

  quickLogin: async (email, password) => {
    try {
      await store.login(email, password);
    } catch (err) {
      console.error(err);
    }
  },

  logout: async () => {
    await store.logout();
  },

  // Theme Toggle
  toggleTheme: () => {
    store.toggleTheme();
  },

  // Navigation
  switchTab: (tabId) => {
    store.setActiveTab(tabId);
  },

  // Admin: Role Assignment (Tab 1)
  changeUserRole: async (userId, newRoleId) => {
    await store.updateUserRole(userId, newRoleId);
  },

  // Admin: Role Creation (Tab 2)
  openCreateRoleModal: () => {
    store.openModal('create_role');
  },

  handleCreateRoleSubmit: async (e) => {
    e.preventDefault();
    const name = document.getElementById('role-name').value;
    const description = document.getElementById('role-desc').value;
    const badgeColor = document.getElementById('role-color').value;

    const checkedBoxes = document.querySelectorAll('input[name="role_permission"]:checked');
    const permissions = Array.from(checkedBoxes).map(cb => cb.value);

    store.closeModal();
    await store.addRole({ name, description, badgeColor, permissions });
  },

  deleteRole: async (roleId) => {
    if (confirm('Möchten Sie diese benutzerdefinierte Rolle wirklich löschen?')) {
      await store.deleteRole(roleId);
    }
  },

  // Admin: User Creation (Tab 1)
  openAddUserModal: () => {
    store.openModal('add_user');
  },

  handleAddUserSubmit: async (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const department = document.getElementById('user-dept').value;
    const roleId = document.getElementById('user-role').value;
    const password = document.getElementById('user-pw').value;

    store.closeModal();
    await store.addUser({ name, email, department, roleId, password });
  },

  resetUserPassword: (userId) => {
    store.addToast('Temporäres Passwort auf "gymsec123" zurückgesetzt.', 'info');
  },

  // Member Management & PII
  openMemberDetail: (memberId) => {
    store.openModal('member_detail', memberId);
  },

  requestUnmaskPII: (memberId, field) => {
    store.openModal('unmask_reason', { memberId, field });
  },

  confirmUnmaskPII: async (memberId, field) => {
    const select = document.getElementById('unmask-reason-select');
    const reason = select ? select.value : 'Dienstliche Einsicht';
    store.closeModal();

    const member = store.getMember(memberId);
    await store.logAudit({
      action: 'PII-Einsicht',
      details: `Entschlüsselung von [${field}] für Mitglied ${member ? member.lastName : memberId}. Grund: "${reason}"`
    });

    store.addToast(`Entschlüsselung protokolliert: ${field} freigegeben.`, 'info');
  },

  // Direct 1-Click Anonymization
  anonymizeMemberDirect: async (memberId) => {
    if (confirm('Möchten Sie dieses Mitglied wirklich unwiderruflich anonymisieren und die Bankdaten löschen?')) {
      await anonymizeMember(memberId);
    }
  },

  // Search & Filter
  updateMemberSearch: (val) => {
    setMemberSearch(val);
    renderApp();
  },

  updateMemberFilter: (val) => {
    setMemberFilter(val);
    renderApp();
  },

  // General Controls
  resetDemo: async () => {
    await store.resetToDefaults();
  },

  closeModal: () => {
    store.closeModal();
  },

  removeToast: (id) => {
    store.removeToast(id);
  }
};

// Initialize Application
store.subscribe(() => {
  renderApp();
});

renderApp();
