// Simple Privacy & Anonymization Service
import { store } from './store.js';

/**
 * Anonymizes member data for ended contracts
 * @param {string} memberId
 */
export async function anonymizeMember(memberId) {
  const member = store.getMember(memberId);
  if (!member) throw new Error('Mitglied nicht gefunden.');
  if (member.isAnonymized) throw new Error('Mitglied ist bereits anonymisiert.');

  const updatedData = {
    firstName: 'Anonymisiert',
    lastName: '',
    email: 'geloescht@kunde.local',
    phone: '[Gelöscht]',
    birthDate: '1970-01-01',
    address: {
      street: '[Gelöscht]',
      city: member.address?.city || 'Unbekannt',
      zip: '[Gelöscht]'
    },
    iban: '[Gelöscht]',
    status: 'ANONYMIZED',
    isAnonymized: true,
    trainerNotes: '[Historische Daten archiviert]',
    trainingPlan: '[Archiviert]'
  };

  store.updateMember(memberId, updatedData);

  // Simple plain text audit log
  await store.logAudit({
    action: 'Mitglied anonymisiert',
    details: `Kundendaten und Bankverbindung für Mitglied ${member.firstName} ${member.lastName} (${memberId}) wurden unwiderruflich gelöscht.`
  });

  store.addToast(`Daten für ${memberId} wurden erfolgreich anonymisiert.`, 'success');
}
