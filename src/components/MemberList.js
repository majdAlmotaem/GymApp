// Member List Component (Classic Table with PII Masking)
import { store } from '../services/store.js';

let searchQuery = '';
let statusFilter = 'ALL';

export function renderMemberList() {
  if (!store.hasPermission('view_members')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>view_members</code> zur Einsicht der Mitgliederdaten.
        </p>
      </div>
    `;
  }

  const members = store.members;
  const canViewPII = store.hasPermission('view_pii');
  const canViewFinances = store.hasPermission('view_finances');

  // Filtering
  const filtered = members.filter(m => {
    const matchesSearch = 
      m.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && m.status === 'ACTIVE') ||
      (statusFilter === 'ANONYMIZED' && m.isAnonymized) ||
      (statusFilter === 'CANCELLED' && m.status === 'CANCELLED');

    return matchesSearch && matchesStatus;
  });

  return `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Mitgliederverwaltung</h3>
          <p class="card-description">
            Tabellarische Übersicht mit rollenbasierter Datenmaskierung.
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
          <input 
            type="text" 
            class="input-text"
            placeholder="🔍 Suchen nach Name, ID, Mail..." 
            value="${searchQuery}"
            oninput="window.app.updateMemberSearch(this.value)"
            style="min-width: 200px;"
          />
          <select 
            class="select-control"
            onchange="window.app.updateMemberFilter(this.value)"
          >
            <option value="ALL" ${statusFilter === 'ALL' ? 'selected' : ''}>Alle Status (${members.length})</option>
            <option value="ACTIVE" ${statusFilter === 'ACTIVE' ? 'selected' : ''}>Aktiv (${members.filter(m => m.status === 'ACTIVE').length})</option>
            <option value="CANCELLED" ${statusFilter === 'CANCELLED' ? 'selected' : ''}>Gekündigt (${members.filter(m => m.status === 'CANCELLED').length})</option>
            <option value="ANONYMIZED" ${statusFilter === 'ANONYMIZED' ? 'selected' : ''}>Anonymisiert (${members.filter(m => m.isAnonymized).length})</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mitglied & ID</th>
              <th>Status</th>
              <th>Trainingsplan & Check-Ins</th>
              <th>Tarif & Beitrag</th>
              <th>Bankdaten (IBAN)</th>
              <th style="text-align: right;">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                  Keine Mitglieder für die aktuellen Filterkriterien gefunden.
                </td>
              </tr>
            ` : filtered.map(m => {
              return `
                <tr>
                  <td>
                    <div style="font-weight: 600;">
                      ${m.isAnonymized ? '<span style="color: var(--text-muted);">Anonymisiert</span>' : `${m.firstName} ${m.lastName}`}
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
                      ${m.id} • ${m.email}
                    </div>
                  </td>

                  <td>${getStatusBadge(m)}</td>

                  <td>
                    <div style="font-weight: 500; font-size: 0.8rem; color: var(--primary);">${m.trainingPlan}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">
                      ${m.totalCheckIns} Check-Ins • Zuletzt: ${m.lastCheckIn.split(' ')[0]}
                    </div>
                  </td>

                  <td>
                    <div style="font-weight: 500;">${m.membershipTier}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-emerald);">
                      ${canViewFinances ? `${m.monthlyFee.toFixed(2)} € / Monat` : '<span class="pii-masked">••• € (Gesperrt)</span>'}
                    </div>
                  </td>

                  <td>
                    ${renderIbanCell(m, canViewPII)}
                  </td>

                  <td style="text-align: right;">
                    <button 
                      class="btn btn-secondary btn-sm" 
                      onclick="window.app.openMemberDetail('${m.id}')"
                      title="Details öffnen"
                    >
                      👁️ Details
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getStatusBadge(m) {
  if (m.isAnonymized) {
    return '<span class="badge badge-gray">● Anonymisiert</span>';
  }
  if (m.status === 'CANCELLED') {
    return '<span class="badge badge-amber">● Gekündigt</span>';
  }
  return '<span class="badge badge-emerald">● Aktiv</span>';
}

function renderIbanCell(member, canViewPII) {
  if (member.isAnonymized) {
    return '<span class="pii-masked">[Gelöscht]</span>';
  }
  
  if (canViewPII) {
    return `<span class="code-hash">${member.iban}</span>`;
  }

  const maskedIban = member.iban.replace(/\s/g, '').replace(/(.{4})(.*)(.{4})/, '$1 •••• $3');
  return `
    <span class="pii-masked">
      ${maskedIban}
      <button 
        style="background: none; border: none; cursor: pointer; color: var(--primary); font-size: 0.82rem;"
        onclick="window.app.requestUnmaskPII('${member.id}', 'IBAN')"
        title="Dienstliche Einsicht (wird protokolliert)"
      >
        🔓
      </button>
    </span>
  `;
}

export function setMemberSearch(query) {
  searchQuery = query;
}

export function setMemberFilter(filter) {
  statusFilter = filter;
}
