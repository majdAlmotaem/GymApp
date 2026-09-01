// Simplified Permissions, Roles, Users and Initial Members

export const PERMISSIONS = [
  {
    key: 'view_members',
    label: 'Mitglieder einsehen',
    description: 'Zugriff auf die Mitgliederliste und Trainingsdaten.',
    category: 'Mitgliederverwaltung'
  },
  {
    key: 'edit_members',
    label: 'Mitglieder bearbeiten',
    description: 'Bearbeiten von Trainingsplänen und Notizen.',
    category: 'Mitgliederverwaltung'
  },
  {
    key: 'view_pii',
    label: 'Sensible Daten einsehen (IBAN / Adresse)',
    description: 'Entschlüsselung von Bankverbindung und Wohnadresse.',
    category: 'Datenschutz & Sicherheit'
  },
  {
    key: 'manage_privacy',
    label: 'Daten anonymisieren',
    description: 'Zugriff auf Datenbereinigung und Anonymisierung beendeter Verträge.',
    category: 'Datenschutz & Sicherheit'
  },
  {
    key: 'view_finances',
    label: 'Finanzen & Umsätze einsehen',
    description: 'Zugriff auf Monatsumsätze, Monatsbeiträge und Buchungen.',
    category: 'Finanzen & Management'
  },
  {
    key: 'view_audit_logs',
    label: 'Audit-Log einsehen',
    description: 'Einsicht in das System- und Zugriffsprotokoll.',
    category: 'Administration & Logging'
  },
  {
    key: 'manage_users',
    label: 'Benutzerkonten verwalten',
    description: 'Mitarbeiter verwalten und Rollen zuweisen.',
    category: 'Administration & Logging'
  },
  {
    key: 'manage_roles',
    label: 'Rollen & Rechte verwalten',
    description: 'Benutzerdefinierte Rollen erstellen und konfigurieren.',
    category: 'Administration & Logging'
  }
];

export const DEFAULT_ROLES = [
  {
    id: 'role_admin',
    name: 'Administrator',
    description: 'Volle Administrationsrechte für alle Module, Benutzer und Rollen.',
    badgeColor: 'purple',
    isSystem: true,
    permissions: [
      'view_members',
      'edit_members',
      'view_pii',
      'manage_privacy',
      'view_finances',
      'view_audit_logs',
      'manage_users',
      'manage_roles'
    ]
  },
  {
    id: 'role_manager',
    name: 'Studioleiter',
    description: 'Verwaltung von Mitgliedern, Finanzen und Datenbereinigung.',
    badgeColor: 'blue',
    isSystem: true,
    permissions: [
      'view_members',
      'view_pii',
      'manage_privacy',
      'view_finances'
    ]
  },
  {
    id: 'role_trainer',
    name: 'Fitness Trainer',
    description: 'Einsicht und Pflege von Trainingsplänen und Check-ins.',
    badgeColor: 'emerald',
    isSystem: true,
    permissions: [
      'view_members',
      'edit_members'
    ]
  },
  {
    id: 'role_dpo',
    name: 'Datenschutzbeauftragter',
    description: 'Zuständig für Datenbereinigung und Protokolleinsicht.',
    badgeColor: 'amber',
    isSystem: true,
    permissions: [
      'view_members',
      'view_pii',
      'manage_privacy',
      'view_audit_logs'
    ]
  }
];

export const DEFAULT_USERS = [
  {
    id: 'USR-001',
    name: 'Alexei Richter',
    email: 'admin@gymsec.local',
    password: 'admin',
    department: 'IT-Administration',
    roleId: 'role_admin',
    status: 'ACTIVE'
  },
  {
    id: 'USR-002',
    name: 'Dr. Sarah Vogel',
    email: 'manager@gymsec.local',
    password: 'manager',
    department: 'Studioleitung',
    roleId: 'role_manager',
    status: 'ACTIVE'
  },
  {
    id: 'USR-003',
    name: 'Maxime Keller',
    email: 'trainer@gymsec.local',
    password: 'trainer',
    department: 'Fitness & Coaching',
    roleId: 'role_trainer',
    status: 'ACTIVE'
  },
  {
    id: 'USR-004',
    name: 'Elena von Berg',
    email: 'dpo@gymsec.local',
    password: 'dpo',
    department: 'Datenschutz',
    roleId: 'role_dpo',
    status: 'ACTIVE'
  }
];

export const INITIAL_MEMBERS = [
  {
    id: 'MEM-1049',
    firstName: 'Leon',
    lastName: 'Bauer',
    email: 'leon.bauer@techmail.de',
    phone: '+49 171 4928172',
    birthDate: '1994-06-14',
    address: { street: 'Hafenstraße 24', city: 'Hamburg', zip: '20359' },
    iban: 'DE89 2004 0000 0192 8472 11',
    membershipTier: 'Black Premium VIP',
    monthlyFee: 79.99,
    status: 'ACTIVE',
    isAnonymized: false,
    joinedDate: '2022-03-15',
    lastCheckIn: '2026-08-31 18:45',
    totalCheckIns: 248,
    trainerNotes: 'Ziel: Hypertrophie Oberkörper.',
    trainingPlan: '4er Split Kraftaufbau'
  },
  {
    id: 'MEM-1050',
    firstName: 'Julia',
    lastName: 'Schneider',
    email: 'j.schneider@artdesign.io',
    phone: '+49 176 8392019',
    birthDate: '1998-11-03',
    address: { street: 'Kastanienallee 8', city: 'Berlin', zip: '10435' },
    iban: 'DE44 1005 0000 0829 1048 55',
    membershipTier: 'Standard All-Inclusive',
    monthlyFee: 49.99,
    status: 'ACTIVE',
    isAnonymized: false,
    joinedDate: '2023-01-10',
    lastCheckIn: '2026-09-01 07:15',
    totalCheckIns: 184,
    trainerNotes: 'Ziel: Marathon-Vorbereitung & Core-Stabilität.',
    trainingPlan: 'Ausdauer & Functional'
  },
  {
    id: 'MEM-1051',
    firstName: 'Markus',
    lastName: 'Weber',
    email: 'markus.weber@fintech-gmbh.com',
    phone: '+49 160 5551234',
    birthDate: '1987-04-22',
    address: { street: 'Königsallee 102', city: 'Düsseldorf', zip: '40212' },
    iban: 'DE33 3002 0000 0019 4820 90',
    membershipTier: 'Daytime Saver',
    monthlyFee: 34.99,
    status: 'CANCELLED',
    isAnonymized: false,
    joinedDate: '2021-08-01',
    cancelledDate: '2026-06-30',
    lastCheckIn: '2026-06-20 12:30',
    totalCheckIns: 92,
    trainerNotes: 'Rückenreha nach Bandscheibenvorfall.',
    trainingPlan: 'Rücken-Prävention'
  },
  {
    id: 'MEM-1052',
    firstName: 'Amira',
    lastName: 'Kassani',
    email: 'amira.kassani@health-edu.de',
    phone: '+49 172 9012384',
    birthDate: '1995-09-18',
    address: { street: 'Ludwigstraße 15', city: 'München', zip: '80539' },
    iban: 'DE66 7001 0000 0984 1029 33',
    membershipTier: 'Black Premium VIP',
    monthlyFee: 79.99,
    status: 'ACTIVE',
    isAnonymized: false,
    joinedDate: '2024-02-14',
    lastCheckIn: '2026-09-01 19:10',
    totalCheckIns: 110,
    trainerNotes: 'Ziel: Hyrox Wettkampfvorbereitung.',
    trainingPlan: 'Hyrox Performance Mix'
  },
  {
    id: 'MEM-1053',
    firstName: 'Anonymisiert',
    lastName: '',
    email: 'geloescht@kunde.local',
    phone: '[Gelöscht]',
    birthDate: '1970-01-01',
    address: { street: '[Gelöscht]', city: 'Stuttgart', zip: '[Gelöscht]' },
    iban: '[Gelöscht]',
    membershipTier: 'Standard All-Inclusive',
    monthlyFee: 49.99,
    status: 'ANONYMIZED',
    isAnonymized: true,
    joinedDate: '2020-05-10',
    cancelledDate: '2025-11-01',
    lastCheckIn: '2025-11-04 17:00',
    totalCheckIns: 312,
    trainerNotes: '[Historische Daten]',
    trainingPlan: '[Archiviert]'
  }
];

export const FINANCIAL_METRICS = {
  activeContracts: 4,
  mrr: 214.96,
  annualRunRate: 2579.52,
  averageLifetimeMonths: 28.4,
  recentTransactions: [
    { id: 'TX-901', memberId: 'MEM-1049', name: 'Leon Bauer', amount: 79.99, date: '2026-09-01', method: 'SEPA Lastschrift', status: 'ERFOLGREICH' },
    { id: 'TX-902', memberId: 'MEM-1050', name: 'Julia Schneider', amount: 49.99, date: '2026-09-01', method: 'SEPA Lastschrift', status: 'ERFOLGREICH' },
    { id: 'TX-903', memberId: 'MEM-1052', name: 'Amira Kassani', amount: 79.99, date: '2026-09-01', method: 'Kreditkarte', status: 'ERFOLGREICH' },
    { id: 'TX-904', memberId: 'MEM-1051', name: 'Markus Weber', amount: 34.99, date: '2026-08-01', method: 'SEPA Lastschrift', status: 'BEZAHLT' }
  ]
};
