# 📊 Dashboard Amministratore - Guida Completa

## 🎯 Panoramica

La **Dashboard Amministratore** è il centro di controllo della piattaforma, accessibile solo dall'IP autorizzato **93.44.201.21**. Permette di:

- ✅ Scrivere manualmente NAV e saldi totali
- ✅ Collegare conti bancari e wallet crypto
- ✅ Effettuare prelievi tra conti collegati
- ✅ Gestire tutte le operazioni della piattaforma
- ✅ Visualizzare storico completo delle operazioni

---

## 🔐 Accesso

**IP Autorizzato:** `93.44.201.21`

Solo questo IP può accedere alla Dashboard Amministratore. Tutti gli altri utenti vedono un messaggio di accesso negato.

---

## 📊 Funzionalità Principali

### 1. Dashboard Editabile

#### NAV Totale
- **Campo modificabile manualmente**
- Inserisci il NAV totale della piattaforma
- I dati vengono salvati automaticamente
- Timestamp automatico dell'ultimo aggiornamento

**Come usarlo:**
1. Clicca su **"✏️ Modifica Dashboard"**
2. Inserisci il valore NAV nel campo
3. Aggiungi note opzionali
4. Clicca **"💾 Salva Modifiche"**

#### Saldo Totale Conti
- **Campo modificabile manualmente**
- Inserisci il saldo totale di tutti i conti collegati
- Aggiornamento automatico
- Storico delle modifiche

**Come usarlo:**
1. Clicca su **"✏️ Modifica Dashboard"**
2. Inserisci il saldo totale
3. Salva le modifiche

#### Conti Collegati
- **Numero totale di conti e wallet collegati**
- Saldo aggregato automatico
- Gestione centralizzata

---

### 2. Gestione Conti e Wallet Collegati

#### Aggiungere un Conto/Wallet

**Passaggi:**
1. Clicca su **"+ Collega Conto"**
2. Inserisci il nome del conto/wallet
3. Scegli il tipo:
   - **OK** = Banca (UniCredit, Intesa, ecc.)
   - **Annulla** = Wallet Crypto (Ethereum, Bitcoin, ecc.)
4. Inserisci il saldo iniziale
5. Il conto viene aggiunto alla lista

**Esempio: Conto Bancario**
```
Nome: Conto UniCredit Principale
Tipo: Banca
Saldo: €50,000.00
```

**Esempio: Wallet Crypto**
```
Nome: Wallet Ethereum Personale
Tipo: Wallet Crypto
Saldo: 2.5 ETH (€8,940.00)
```

#### Rimuovere un Conto/Wallet
1. Trova il conto nella lista
2. Clicca sull'icona **🗑️**
3. Il conto viene rimosso

**Nota:** I conti con transazioni in corso non possono essere rimossi.

#### Visualizzazione Conti
Ogni conto mostra:
- Nome del conto
- Tipo (Banca/Wallet Crypto)
- Saldo attuale
- Icona identificativa

---

### 3. Sistema di Prelievo

#### Effettuare un Prelievo

**Passaggi:**
1. Clicca su **"💸 Prelievo"**
2. Seleziona il conto di origine (Da)
3. Seleziona il conto di destinazione (A)
4. Inserisci l'importo
5. Clicca **"💸 Preleva"**

**Esempio: Prelievo da Banca a Wallet Crypto**
```
Da: Conto UniCredit (€50,000.00)
A: Wallet Ethereum (2.5 ETH)
Importo: €1,000.00
```

**Cosa succede:**
- Il saldo del conto di origine diminuisce
- Il saldo del conto di destinazione aumenta
- Viene creata una transazione nello storico
- Timestamp automatico

#### Storico Prelievi

Ogni prelievo mostra:
- **Data e ora** dell'operazione
- **Conto di origine** e destinazione
- **Importo** trasferito
- **Stato** (Completato/In attesa/Fallito)
- **Riferimento** univoco (WDR-xxxxxxxxxx)

**Esempio:**
```
💸 Conto UniCredit → Wallet Ethereum
15/01/2024 14:30:00
€1,000.00
✓ Completato
Ref: WDR-1705326600000
```

---

### 4. Persistenza Dati

#### Salvataggio Automatico
Tutti i dati vengono salvati automaticamente nel `localStorage` del browser:

- ✅ Dashboard (NAV, saldi, note)
- ✅ Conti e wallet collegati
- ✅ Storico prelievi
- ✅ Portafoglio (titoli, azioni, NAV manuali)

**Vantaggi:**
- I dati **non spariscono** dopo averli scritti
- Persistono anche dopo il refresh della pagina
- Disponibili anche offline
- Nessuna perdita dati

#### Reset Dati
Per resettare tutti i dati:
1. Apri la console del browser (F12)
2. Esegui: `localStorage.clear()`
3. Ricarica la pagina

---

## 🔄 Integrazione con Portfolio Manager

### Dati Condivisi
La Dashboard Amministratore e il Portfolio Manager condividono:

- ✅ Conti e wallet collegati
- ✅ Titoli e azioni
- ✅ NAV manuali
- ✅ Storico operazioni

### Flusso di Lavoro Completo

#### 1. Configurazione Iniziale
```
Dashboard Admin → Collega conti e wallet
Portfolio Manager → Aggiungi titoli e NAV
```

#### 2. Inserimento Dati
```
Web Scraping/CSV → Converti in fondi contabili
Portfolio Manager → Inserisci manualmente
Dashboard Admin → Aggiorna NAV totali
```

#### 3. Riconciliazione
```
Riconciliazione Tradizionale → Allinea saldi bancari
Riconciliazione On-Chain → Verifica wallet crypto
Dashboard Admin → Aggiorna saldi totali
```

#### 4. Prelievo
```
Dashboard Admin → Effettua prelievo
Conti collegati → Aggiorna saldi
Storico → Registra transazione
```

---

## 📋 Casi d'Uso Pratici

### Caso 1: Gestione Portafoglio Completo

**Scenario:** Amministratore gestisce portafoglio con multiple fonti

**Flusso:**
1. **Collega conti:**
   - Conto UniCredit (€50,000)
   - Conto Directa (€25,000)
   - Wallet Ethereum (2.5 ETH)

2. **Aggiungi titoli:**
   - Vanguard FTSE All-World (100 quote)
   - Apple Inc. (50 azioni)

3. **Inserisci NAV:**
   - NAV Contabile: €10,520
   - NAV Mercato: €10,550

4. **Aggiorna Dashboard:**
   - NAV Totale: €85,000
   - Saldo Totale: €75,000

5. **Effettua prelievo:**
   - Da: Conto UniCredit
   - A: Wallet Ethereum
   - Importo: €1,000

**Risultato:** Portafoglio completo con saldi aggiornati

### Caso 2: Importazione Dati da CSV

**Scenario:** Importazione dati da estratto conto bancario

**Flusso:**
1. **Importa CSV:**
   - Tab "🌐 Estrattore"
   - Carica file CSV
   - Sistema estrae dati

2. **Converti in fondi contabili:**
   - Tab "💼 Portafoglio"
   - Aggiungi titoli estratti
   - Dati salvati permanentemente

3. **Riconcilia:**
   - Tab "🔄 Riconciliazione"
   - Matcha transazioni
   - Allinea saldi

4. **Aggiorna Dashboard:**
   - Tab "📊 Dashboard Admin"
   - Modifica NAV totali
   - Salva modifiche

**Risultato:** Dati importati, riconciliati e aggiornati

### Caso 3: Prelievo verso Wallet Crypto

**Scenario:** Trasferimento fondi da banca a wallet crypto

**Flusso:**
1. **Verifica saldi:**
   - Conto UniCredit: €50,000
   - Wallet Ethereum: 2.5 ETH

2. **Effettua prelievo:**
   - Dashboard Admin → "💸 Prelievo"
   - Da: Conto UniCredit
   - A: Wallet Ethereum
   - Importo: €5,000

3. **Conferma operazione:**
   - Saldo UniCredit: €45,000
   - Wallet Ethereum: 2.5 ETH + €5,000 (da convertire)

4. **Verifica storico:**
   - Transazione registrata
   - Timestamp: 15/01/2024 14:30:00
   - Ref: WDR-1705326600000

**Risultato:** Prelievo completato con storico

---

## 🔒 Sicurezza

### Protezione IP
- ✅ Solo IP **93.44.201.21** può accedere
- ✅ Verifica automatica ad ogni accesso
- ✅ Messaggio di accesso negato per altri IP

### Protezione Dati
- ✅ Dati salvati nel localStorage (client-side)
- ✅ Nessuna trasmissione a server esterni
- ✅ Accessibili solo dal browser dell'amministratore

### Best Practices
1. Non condividere mai le credenziali
2. Verifica sempre l'IP prima di operare
3. Esporta backup regolari
4. Controlla lo storico operazioni

---

## 📊 Statistiche Dashboard

### Metriche Disponibili
- **NAV Totale:** Valore patrimoniale netto
- **Saldo Totale Conti:** Somma di tutti i conti
- **Conti Collegati:** Numero di conti/wallet
- **Prelievi Effettuati:** Totale operazioni
- **Ultimo Aggiornamento:** Timestamp

### Esempio Dashboard
```
┌─────────────────────────────────────────┐
│  📊 Dashboard Amministratore            │
│  Ultimo aggiornamento: 15/01/2024 14:30 │
├─────────────────────────────────────────┤
│  NAV Totale:         €85,000.00         │
│  Saldo Totale Conti: €75,000.00         │
│  Conti Collegati:    3                  │
├─────────────────────────────────────────┤
│  [✏️ Modifica Dashboard] [💸 Prelievo]  │
└─────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Problema: Dati non salvati
**Causa:** localStorage disabilitato  
**Soluzione:**
1. Verifica impostazioni browser
2. Abilita localStorage
3. Ricarica la pagina

### Problema: Prelievo fallito
**Causa:** Saldo insufficiente  
**Soluzione:**
1. Verifica saldo conto di origine
2. Riduci importo prelievo
3. Riprova

### Problema: Conti non visibili
**Causa:** Dati corrotti nel localStorage  
**Soluzione:**
1. Apri console browser (F12)
2. Esegui: `localStorage.clear()`
3. Ricarica e riconfigura

### Problema: Accesso negato
**Causa:** IP non autorizzato  
**Soluzione:**
1. Verifica il tuo IP pubblico
2. Contatta l'amministratore
3. Richiedi aggiunta alla whitelist

---

## 📞 Supporto

### Documentazione Correlata
- **[GUIDA_COMPLETA_AGGIORNATA.md](./GUIDA_COMPLETA_AGGIORNATA.md)** - Guida principale
- **[SICUREZZA_IP.md](./SICUREZZA_IP.md)** - Sistema sicurezza IP
- **[GUIDA_PRATICA.md](./GUIDA_PRATICA.md)** - UniCredit + Crypto

### Contatti
- **GitHub Issues:** Per bug e feature requests
- **Email:** support@yourdomain.com

---

## 🎉 Conclusioni

La **Dashboard Amministratore** è il centro di controllo completo della piattaforma:

✅ **Dashboard editabile** - NAV e saldi modificabili manualmente  
✅ **Conti collegati** - Gestione centralizzata banche e wallet  
✅ **Prelievi** - Trasferimenti tra conti con storico completo  
✅ **Persistenza dati** - Salvataggio automatico, niente perdite  
✅ **Sicurezza IP** - Solo 93.44.201.21 può accedere  
✅ **Integrazione completa** - Funziona con tutte le funzionalità  

**La piattaforma è ora completamente gestibile dall'amministratore!** 🚀

---

**Versione:** 2.1.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completo e Pronto per Produzione
