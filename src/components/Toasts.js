// Toast Notifications Component
import { store } from '../services/store.js';

export function renderToasts() {
  const toasts = store.toasts;
  if (toasts.length === 0) return '';

  return `
    <div class="toast-container">
      ${toasts.map(t => `
        <div class="toast toast-${t.type}" onclick="window.app.removeToast(${t.id})">
          <span>${getToastIcon(t.type)}</span>
          <div style="flex: 1;">${t.message}</div>
          <button style="background: none; border: none; color: var(--text-muted); cursor: pointer;">✕</button>
        </div>
      `).join('')}
    </div>
  `;
}

function getToastIcon(type) {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'danger': return '🚨';
    default: return 'ℹ️';
  }
}
