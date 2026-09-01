// Simplified Enterprise Modals
import { store } from '../services/store.js';
import { PERMISSIONS } from '../data/initialData.js';

export function renderModals() {
  const modal = store.activeModal;
  if (!modal) return '';

  switch (modal.name) {
    case 'create_role':
      return renderCreateRoleModal();
    case 'add_user':
      return renderAddUserModal();
    case 'member_detail':
      return renderMemberDetailModal(modal.data);
    case 'unmask_reason':
      return renderUnmaskReasonModal(modal.data);
    default:
      return '';
  }
}

function renderCreateRoleModal() {
  const categories = {};
  PERMISSIONS.forEach(p => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closeModal()">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3 class="card-title">Neue Rolle anlegen</h3>
          <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">✕</button>
        </div>

        <form onsubmit="window.app.handleCreateRoleSubmit(event)">
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.95rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="role-name">Rollenname *</label>
              <input 
                type="text" 
                id="role-name" 
                class="input-text" 
                placeholder="z.B. Kursleiter / Praktikant" 
                required
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="role-desc">Beschreibung</label>
              <input 
                type="text" 
                id="role-desc" 
                class="input-text" 
                placeholder="Kurzbeschreibung der Aufgaben" 
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="role-color">Badge-Farbe</label>
              <select id="role-color" class="select-control">
                <option value="blue" selected>Blau</option>
                <option value="emerald">Grün</option>
                <option value="purple">Lila</option>
                <option value="amber">Bernstein</option>
                <option value="rose">Rot</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="display: block; margin-bottom: 0.4rem;">
                Berechtigungen zuweisen:
              </label>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 250px; overflow-y: auto; padding-right: 0.35rem;">
                ${Object.keys(categories).map(catName => `
                  <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.65rem;">
                    <div style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">
                      ${catName}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                      ${categories[catName].map(p => `
                        <label style="display: flex; align-items: flex-start; gap: 0.45rem; font-size: 0.8rem; cursor: pointer;">
                          <input 
                            type="checkbox" 
                            name="role_permission" 
                            value="${p.key}" 
                            style="margin-top: 2px;"
                          />
                          <div>
                            <div style="font-weight: 600; color: var(--text-primary);">${p.label}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted);">${p.description}</div>
                          </div>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Abbrechen</button>
            <button type="submit" class="btn btn-primary">Rolle erstellen</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddUserModal() {
  const roles = store.roles;

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closeModal()">
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <h3 class="card-title">Neues Benutzerkonto anlegen</h3>
          <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">✕</button>
        </div>

        <form onsubmit="window.app.handleAddUserSubmit(event)">
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="user-name">Vollständiger Name *</label>
              <input type="text" id="user-name" class="input-text" placeholder="z.B. Jonas Meyer" required />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="user-email">E-Mail-Adresse *</label>
              <input type="email" id="user-email" class="input-text" placeholder="name@gymsec.local" required />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="user-dept">Abteilung</label>
              <input type="text" id="user-dept" class="input-text" placeholder="z.B. Training & Service" />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="user-role">Rolle zuweisen</label>
              <select id="user-role" class="select-control">
                ${roles.map(r => `
                  <option value="${r.id}">${r.name}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="user-pw">Passwort</label>
              <input type="password" id="user-pw" class="input-text" value="gymsec123" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeModal()">Abbrechen</button>
            <button type="submit" class="btn btn-primary">Benutzer anlegen</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderMemberDetailModal(memberId) {
  const member = store.getMember(memberId);
  if (!member) return '';

  const canViewPII = store.hasPermission('view_pii');
  const canViewFinances = store.hasPermission('view_finances');

  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closeModal()">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h3 class="card-title">${member.isAnonymized ? 'Mitglied: [Anonymisiert]' : `Mitglied: ${member.firstName} ${member.lastName}`}</h3>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${member.id}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">✕</button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.35rem;">
              1. Kontaktdaten
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem; font-size: 0.82rem;">
              <div>
                <span style="color: var(--text-muted);">E-Mail:</span><br>
                <strong>${member.email}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Telefon:</span><br>
                <strong>${member.phone}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Geburtsdatum:</span><br>
                <strong>${canViewPII ? member.birthDate : '<span class="pii-masked">••••-••-••</span>'}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Adresse:</span><br>
                <strong>${canViewPII ? `${member.address?.street}, ${member.address?.zip} ${member.address?.city}` : `${member.address?.city} (Straße maskiert)`}</strong>
              </div>
            </div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase; margin-bottom: 0.35rem;">
              2. Trainingsdaten
            </div>
            <div style="font-size: 0.82rem; display: flex; flex-direction: column; gap: 0.35rem;">
              <div>
                <span style="color: var(--text-muted);">Trainingsplan:</span><br>
                <strong>${member.trainingPlan}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Trainer-Notizen:</span><br>
                <div style="background: var(--bg-surface); padding: 0.35rem; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 2px;">
                  ${member.trainerNotes}
                </div>
              </div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">
                Gesamt Check-Ins: <strong>${member.totalCheckIns}</strong> • Zuletzt: <strong>${member.lastCheckIn}</strong>
              </div>
            </div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; margin-bottom: 0.35rem;">
              3. Vertrags- & Bankdaten
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.45rem; font-size: 0.82rem;">
              <div>
                <span style="color: var(--text-muted);">Tarif:</span><br>
                <strong>${member.membershipTier}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted);">Beitrag:</span><br>
                <strong>${canViewFinances ? `${member.monthlyFee.toFixed(2)} €` : '<span class="pii-masked">••• € (Gesperrt)</span>'}</strong>
              </div>
              <div style="grid-column: span 2;">
                <span style="color: var(--text-muted);">IBAN:</span><br>
                <strong>${canViewPII ? `<span class="code-hash">${member.iban}</span>` : '<span class="pii-masked">DE•• •••• •••• [Maskiert]</span>'}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Schließen</button>
        </div>
      </div>
    </div>
  `;
}

function renderUnmaskReasonModal({ memberId, field }) {
  return `
    <div class="modal-overlay" onclick="if(event.target === this) window.app.closeModal()">
      <div class="modal-content" style="max-width: 440px;">
        <div class="modal-header">
          <h3 class="card-title">Dienstliche Einsicht anfordern</h3>
          <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">✕</button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-size: 0.8rem; color: var(--text-secondary);">
            Die Entschlüsselung von geschützten Daten (${field}) wird im Audit-Log protokolliert.
          </p>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="unmask-reason-select">Grund der Einsicht</label>
            <select id="unmask-reason-select" class="select-control">
              <option value="Abrechnungsprüfung / SEPA Rücklastschrift">Abrechnungsprüfung / SEPA Rücklastschrift</option>
              <option value="Vertragsanpassung auf Kundenwunsch">Vertragsanpassung auf Kundenwunsch</option>
              <option value="Identitätsabgleich am Studio-Empfang">Identitätsabgleich am Studio-Empfang</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.app.closeModal()">Abbrechen</button>
          <button 
            class="btn btn-primary"
            onclick="window.app.confirmUnmaskPII('${memberId}', '${field}')"
          >
            Entschlüsseln & Protokollieren
          </button>
        </div>
      </div>
    </div>
  `;
}
