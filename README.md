# GymSec IAM // Identity & Access Management Dashboard

Ein modernes, dynamisches **Identity & Access Management (IAM)** und **Datenschutz-Verwaltungssystem** für Fitnessstudio-Organisationen.

Entwickelt als **Fachinformatiker-Portfolioprojekt**, demonstriert diese Anwendung praxiserprobte Konzepte aus den Bereichen **Security by Design, rollenbasierte Zugriffskontrolle (RBAC), Datenschutz-Anonymisierung und Audit-Logging**.

---

## 🌟 Kern-Features

### 1. 🛡️ Dynamisches RBAC (Role-Based Access Control)
- **Vorgeschaltete Authentifizierung**: Sicheres Login per E-Mail & Passwort.
- **Laufzeit-Rechteauswertung**: Menüpunkte, Aktionsbuttons und vertrauliche Datenfelder werden dynamisch anhand der individuellen Berechtigungen der zugewiesenen Rolle gerendert.
- **Standard-Rollen**: *Administrator*, *Studioleiter*, *Fitness Trainer*, *Datenschutzbeauftragter*.

### 2. 👥 Admin-Dashboard: Benutzer- & Rollenverwaltung
- **Tab 1: Benutzerverwaltung**:
  - Übersicht aller Mitarbeiterkonten mit Name, E-Mail, Abteilung und Status.
  - **Direkte Rollenzuweisung per Dropdown**: Ändert Zugriffsrechte in Echtzeit und protokolliert den Vorgang im Audit-Log.
  - Modal zum Anlegen neuer Benutzerkonten.
- **Tab 2: Rollenverwaltung**:
  - Erstellen komplett **neuer, benutzerdefinierter Rollen**.
  - Zuweisung von Einzelrechten über eine übersichtliche Checkbox-Matrix (*Mitglieder einsehen/bearbeiten*, *Sensible Bankdaten*, *Datenbereinigung*, *Finanzen*, *Audit-Log*, *Benutzer/Rollen verwalten*).

### 3. 🔒 Mitgliederverwaltung & PII-Maskierung
- Maskierung geschützter Daten (z. B. IBAN, Adressen) nach dem *Need-to-Know-Prinzip*.
- Trainer sehen Fitness- und Trainingspläne, aber keine sensiblen Bankdaten.
- Berechtigte Entschlüsselung erfordert die Angabe eines dienstlichen Grundes und wird im Audit-Log vermerkt.

### 4. 🗑️ Datenbereinigung & Anonymisierung
- Übersicht aller beendeten oder gekündigten Mitgliedschaften.
- **1-Klick Anonymisierung**: Personenbezogene Daten (Name, E-Mail, Telefon, IBAN) werden datenschutzkonform bereinigt bei gleichzeitigem Erhalt historischer Trainings-Aggregatdaten für Studio-Statistiken.

### 5. 📋 Flaches Audit-Log (System-Protokoll)
- Lückenlose Aufzeichnung aller sicherheitsrelevanten Vorgänge (Anmeldungen, Rollenänderungen, PII-Entschlüsselung, Datenbereinigung).
- Übersichtliche, tabellarische Darstellung (*Zeitstempel*, *Benutzer*, *Aktion als Klartext*, *Details*).

### 6. 🎨 Classic Enterprise Design
- **Neutral Dark Mode**: Echtes Dunkelgrau und Anthrazit ohne störende Blaustiche.
- **Augenschonender Light Mode**: Sanfte Off-White- und Hellgrautöne für ermüdungsfreies Arbeiten.
- **Feste linke Sidebar** für ergonomische Navigation.

---

## 🔑 Demo-Zugangsdaten (Quick-Login)

Im Anmeldebildschirm stehen 1-Klick Quick-Login Buttons zur Verfügung:

| Rolle | E-Mail | Passwort | Berechtigungsumfang |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gymsec.local` | `admin` | Vollzugriff (inkl. Benutzer- & Rollenverwaltung) |
| **Studioleiter** | `manager@gymsec.local` | `manager` | Mitglieder, Finanzen & Datenbereinigung |
| **Trainer** | `trainer@gymsec.local` | `trainer` | Mitglieder & Trainingspläne (keine Finanzen/PII) |
| **Datenschutzbeauftragter** | `dpo@gymsec.local` | `dpo` | Mitglieder, Datenbereinigung & Audit-Log |

---

## 🚀 Installation & Lokaler Start

### Voraussetzungen
- [Node.js](https://nodejs.org/) (Version 18 oder neuer)
- npm

### 1. Repository klonen
```bash
git clone https://github.com/majdAlmotaem/GymApp.git
cd GymApp
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Entwicklungsserver starten
```bash
npm run dev
```
Die Anwendung ist anschließend unter **`http://localhost:5173/`** im Browser erreichbar.

### 4. Produktions-Build erstellen
```bash
npm run build
```

---

## 📁 Projekt-Dateistruktur

```
GymApp/
├── index.html                   # Haupt-Container
├── package.json                 # Projekt-Konfiguration (Vite)
├── README.md                    # Dokumentation
└── src/
    ├── main.js                  # App-Bootstrap, Auth-Guard & Router
    ├── styles/
    │   └── index.css            # Enterprise CSS-Designsystem (Dark & Light Mode)
    ├── data/
    │   └── initialData.js       # Berechtigungs-Katalog, Standard-Rollen, Benutzer & Mitglieder
    ├── services/
    │   ├── store.js             # Reaktiver State-Manager mit LocalStorage-Persistenz
    │   └── privacyService.js    # 1-Klick Anonymisierungs-Dienst
    └── components/
        ├── LoginPage.js         # Anmeldebildschirm mit Quick-Login Buttons
        ├── Sidebar.js           # Feste linke Sidebar mit dynamischem Menü & Theme-Toggle
        ├── Topbar.js            # Header mit Status & Breadcrumbs
        ├── UserManagementView.js# Tab 1: Benutzerverwaltung & Rollenzuweisung
        ├── RoleManagementView.js# Tab 2: Rollenverwaltung & Rechte-Konfigurator
        ├── MemberList.js        # Mitgliederübersicht mit PII-Maskierung
        ├── PrivacyCenter.js     # Datenbereinigung für beendete Verträge
        ├── FinanceView.js       # Finanz- & Umsatz-Ansicht
        ├── AuditLogView.js      # System- und Zugriffsprotokoll
        ├── Modals.js            # Dialoge (Neue Rolle, Neuer Benutzer, Details)
        └── Toasts.js            # Feedback-Benachrichtigungen
```

---

## 🛠️ Verwendete Technologien
- **Frontend Core**: Vanilla JavaScript (Modern ES Modules)
- **Styling**: Vanilla CSS3 (Custom Properties / Design Tokens)
- **Bundler & Tooling**: Vite
- **Persistenz**: Browser `localStorage` (inkl. Demo-Reset auf Knopfdruck)

---

## 📄 Lizenz
Dieses Projekt ist für Demonstrations- und Portfoliozwecke erstellt.
