// Finance & Revenue Management View (Enterprise Style)
import { store } from '../services/store.js';

export function renderFinanceView() {
  if (!store.hasPermission('view_finances')) {
    return `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <h3 style="color: var(--accent-rose); margin-bottom: 0.5rem;">403 Forbidden – Zugriff verweigert</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">
          Sie verfügen nicht über die Berechtigung <code>view_finances</code> zur Einsicht der Finanzkennzahlen.
        </p>
      </div>
    `;
  }

  const financials = store.financials;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        <div class="card" style="margin-bottom: 0;">
          <div class="card-body">
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
              Monthly Recurring Revenue (MRR)
            </div>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0;">
              ${financials.mrr.toFixed(2)} €
            </div>
            <div style="font-size: 0.75rem; color: var(--accent-emerald);">
              ● +8.4% im Vergleich zum Vormonat
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div class="card-body">
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
              Annual Run Rate (ARR)
            </div>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0;">
              ${financials.annualRunRate.toFixed(2)} €
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Hochrechnung auf Basis aktiver Verträge
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div class="card-body">
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
              Durchschnittliche Mitgliedsdauer
            </div>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0;">
              ${financials.averageLifetimeMonths} Monate
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Niedrige Kündigungsquote (Churn Rate < 2%)
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Letzte SEPA- & Bezahltransaktionen</h3>
            <p class="card-description">Laufende Abbuchungen und Status der Mitgliedsbeiträge.</p>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaktions-ID</th>
                <th>Mitglied</th>
                <th>Betrag</th>
                <th>Datum</th>
                <th>Zahlungsmethode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${financials.recentTransactions.map(tx => `
                <tr>
                  <td><span class="code-hash">${tx.id}</span></td>
                  <td style="font-weight: 600;">${tx.name} (${tx.memberId})</td>
                  <td style="font-weight: 700; color: var(--accent-emerald);">${tx.amount.toFixed(2)} €</td>
                  <td>${tx.date}</td>
                  <td>${tx.method}</td>
                  <td><span class="badge badge-emerald">● ${tx.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
