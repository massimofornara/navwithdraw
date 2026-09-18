# 🔐 Sistema di Sicurezza IP - Documentazione

## Panoramica

Il sistema implementa un controllo di accesso basato sull'indirizzo IP per proteggere le funzionalità sensibili della piattaforma. Solo gli utenti con IP autorizzati possono:

- ✅ Generare e scrivere manualmente i NAV
- ✅ Gestire il portafoglio (aggiungere titoli, azioni, conti)
- ✅ Accedere al pannello amministratore
- ✅ Modificare la whitelist degli IP autorizzati

---

## 🎯 IP Autorizzato Principale

```
93.44.201.21
```

Questo è l'IP dell'amministratore principale e **non può essere rimosso** dalla whitelist.

---

## 🔒 Come Funziona

### 1. Verifica IP
Ad ogni accesso alle funzionalità protette, il sistema:
1. Interroga un servizio esterno (ipify.org) per ottenere l'IP pubblico dell'utente
2. Confronta l'IP con la whitelist degli IP autorizzati
3. Se l'IP è autorizzato → mostra il contenuto
4. Se l'IP non è autorizzato → mostra messaggio di accesso negato

### 2. Componenti Protetti
- **PortfolioManager** - Gestione titoli, conti, NAV manuali
- **AdminPanel** - Gestione whitelist IP

### 3. Whitelist
La whitelist è salvata nel `localStorage` del browser e può essere:
- Visualizzata
- Modificata (aggiunta/rimozione IP)
- Esportata in JSON
- Importata da JSON

---

## 🛠️ Componenti

### IPGuard
Componente wrapper che protegge qualsiasi contenuto:

```tsx
<IPGuard authorizedIPs={['93.44.201.21']}>
  <ContenutoProtetto />
</IPGuard>
```

**Props:**
- `authorizedIPs`: Array di IP autorizzati (default: `['93.44.201.21']`)
- `fallback`: Contenuto alternativo per utenti non autorizzati
- `children`: Contenuto da proteggere

### AdminPanel
Pannello amministratore per gestire la whitelist:
- Visualizza IP corrente
- Lista IP autorizzati
- Aggiungi/rimuovi IP
- Esporta/importa whitelist
- Log accessi

---

## 📋 Funzionalità Protette

### 💼 Portafoglio (Tab "💼 Portafoglio")
Solo IP autorizzati possono:
- Aggiungere titoli, azioni, ETF, fondi
- Creare conti bancari, broker, wallet crypto
- Inserire NAV manualmente
- Modificare dati esistenti

### 🔐 Admin (Tab "🔐 Admin")
Solo IP autorizzati possono:
- Vedere la whitelist completa
- Aggiungere nuovi IP
- Rimuovere IP (tranne il principale)
- Esportare/importare whitelist
- Visualizzare log accessi

---

## 🚀 Utilizzo

### Per Utenti Autorizzati (IP: 93.44.201.21)
1. Accedi alla piattaforma
2. Vai sulla tab **"💼 Portafoglio"**
3. Inserisci titoli, conti, NAV manualmente
4. Vai sulla tab **"🔐 Admin"** per gestire altri IP

### Per Utenti Non Autorizzati
1. Accedi alla piattaforma
2. Le funzionalità protette mostrano un messaggio di accesso negato
3. Contatta l'amministratore per richiedere l'accesso

---

## 🔧 Configurazione

### Modificare IP Principale
Per cambiare l'IP principale (93.44.201.21), modifica:

**File: `src/IPGuard.tsx`**
```typescript
const DEFAULT_AUTHORIZED_IPS = [
  '93.44.201.21' // ← Cambia qui
]
```

**File: `src/App.tsx`**
```typescript
<IPGuard authorizedIPs={['93.44.201.21']}> // ← Cambia qui
```

**File: `src/AdminPanel.tsx`**
```typescript
const DEFAULT_AUTHORIZED_IPS = ['93.44.201.21'] // ← Cambia qui
```

### Aggiungere IP dalla UI
1. Vai sulla tab **"🔐 Admin"**
2. Clicca **"+ Aggiungi IP"**
3. Inserisci l'IP (formato IPv4)
4. Clicca **"Aggiungi"**

---

## 📊 Esempio di Flusso

### Scenario 1: Utente Autorizzato
```
1. Utente accede da IP 93.44.201.21
2. Sistema verifica IP → ✓ Autorizzato
3. Utente vede tutte le funzionalità
4. Utente può inserire NAV manualmente
```

### Scenario 2: Utente Non Autorizzato
```
1. Utente accede da IP 192.168.1.100
2. Sistema verifica IP → ✗ Non autorizzato
3. Utente vede messaggio di accesso negato
4. Utente non può inserire NAV
```

---

## 🔒 Sicurezza

### Limitazioni Client-Side
⚠️ **Importante:** Questo sistema di sicurezza è implementato lato client (browser). Per una sicurezza production-ready:

1. **Implementa un backend** con autenticazione server-side
2. **Usa un database** per la whitelist persistente
3. **Aggiungi autenticazione** con username/password
4. **Implementa rate limiting** per prevenire brute force
5. **Usa HTTPS** per proteggere le comunicazioni
6. **Aggiungi logging** server-side degli accessi

### Protezione Attuale
- ✅ Verifica IP pubblico
- ✅ Whitelist configurabile
- ✅ Messaggi di accesso negato
- ✅ Log accessi (client-side)
- ⚠️ Salvato nel localStorage (modificabile dall'utente)
- ⚠️ Verifica lato client (bypassabile)

---

## 📝 Log Accessi

Il sistema tiene traccia di:
- IP rilevato
- Stato autorizzazione
- Operazioni eseguite
- Timestamp

I log sono visibili nel pannello Admin.

---

## 🔄 Esportazione/Importazione Whitelist

### Esportare
1. Vai su **"🔐 Admin"**
2. Clicca **"📤 Esporta"**
3. Scarica file JSON con whitelist

### Importare
1. Vai su **"🔐 Admin"**
2. Clicca **"📥 Importa"**
3. Seleziona file JSON
4. Whitelist aggiornata

---

## 🎨 UI/UX

### Schermata Accesso Negato
Mostra:
- IP dell'utente
- IP autorizzati
- Stato (non autorizzato)
- Istruzioni per ottenere accesso
- Pulsante "Riprova"

### Pannello Admin
Mostra:
- IP corrente
- Lista whitelist
- Form per aggiungere IP
- Pulsanti esporta/importa
- Log accessi
- Informazioni sicurezza

---

## 🐛 Troubleshooting

### IP non rilevato correttamente
- Verifica connessione internet
- Il servizio ipify.org potrebbe essere temporaneamente non disponibile
- Riprova più tardi

### Whitelist non salvata
- Il localStorage potrebbe essere disabilitato
- Verifica impostazioni browser
- Prova in modalità incognito per testare

### Accesso negato anche con IP corretto
- Verifica che l'IP sia esattamente nella whitelist
- Controlla spazi o caratteri extra
- Ricarica la pagina

---

## 📞 Supporto

Per problemi con il sistema di sicurezza:
1. Controlla i log nel pannello Admin
2. Verifica la whitelist
3. Contatta l'amministratore di sistema

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Attivo
