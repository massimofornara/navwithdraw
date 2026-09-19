# 📖 GUIDA COMPLETA DEFINITIVA - Universal Reconciliation System

**Versione:** 3.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completo con Dashboard Admin e Persistenza Dati

---

## 🎯 Panoramica Sistema

Il **Universal Reconciliation System** è la piattaforma più completa al mondo per la gestione e riconciliazione finanziaria, con due livelli di accesso:

### 👑 Amministratore (IP: 93.44.201.21)
- ✅ Controllo completo della piattaforma
- ✅ Dashboard editabile (NAV, saldi)
- ✅ Gestione conti e wallet collegati
- ✅ Sistema di prelievo
- ✅ Portfolio Manager completo
- ✅ Whitelist IP

### 👤 Utente Standard (Altri IP)
- ✅ Visualizzazione dashboard
- ✅ Consultazione dati
- ✅ Export report
- ✅ Guida e documentazione
- ❌ Nessuna modifica permessa

---

## 🔐 Sistema di Sicurezza

### IP Autorizzato Principale
```
93.44.201.21
```

### Cosa Può Fare l'Amministratore
- ✅ Modificare NAV e saldi totali
- ✅ Collegare conti bancari e wallet crypto
- ✅ Effettuare prelievi tra conti
- ✅ Gestire portfolio (titoli, azioni, NAV)
- ✅ Accedere alla Dashboard Amministratore
- ✅ Gestire whitelist IP
- ✅ Tutte le operazioni della piattaforma

### Cosa Possono Fare gli Utenti Standard
- ✅ Visualizzare la dashboard (solo lettura)
- ✅ Consultare i dati
- ✅ Esportare report
- ✅ Leggere la guida
- ❌ NON possono modificare dati
- ❌ NON possono accedere alla Dashboard Admin
- ❌ NON possono collegare conti
- ❌ NON possono effettuare prelievi

### Come Ottenere Accesso
Se il tuo IP non è autorizzato:
1. Contatta l'amministratore
2. Comunica il tuo indirizzo IP
3. L'amministratore lo aggiungerà dalla tab "🔐 Admin"

---

## 📊 Struttura del Sistema

### Tab Principali

| Tab | Funzione | Amministratore | Utente Standard |
|-----|----------|----------------|-----------------|
| 📊 **Dashboard** | Overview completa | ✅ Visualizza | ✅ Visualizza |
| 🏦 **Conti** | Gestione conti | ✅ Visualizza | ✅ Visualizza |
| 💼 **Fondi** | Gestione fondi | ✅ Visualizza | ✅ Visualizza |
| 🔄 **Riconciliazione** | Riconciliazione bancaria | ✅ Visualizza | ✅ Visualizza |
| 📥 **Importa** | Importazione dati | ✅ Visualizza | ✅ Visualizza |
| 📄 **Report** | Export dati | ✅ Export | ✅ Export |
| 🔗 **On-Chain** | Riconciliazione crypto | ✅ Visualizza | ✅ Visualizza |
| 🌐 **Estrattore** | Estrazione universale | ✅ Visualizza | ✅ Visualizza |
| 💼 **Portafoglio** | Gestione manuale | ✅ **COMPLETO** | ❌ Negato |
| 📊 **Dashboard Admin** | Dashboard editabile | ✅ **COMPLETO** | ❌ Negato |
| 🔐 **Admin** | Gestione whitelist | ✅ **COMPLETO** | ❌ Negato |
| 📖 **Guida** | Guida pratica | ✅ Visualizza | ✅ Visualizza |
| 🧪 **Test** | Suite test | ✅ Visualizza | ✅ Visualizza |

---

# 👑 GUIDA PER L'AMMINISTRATORE (IP: 93.44.201.21)

## PARTE 1: Dashboard Amministratore

### 1.1 Modificare NAV e Saldi Totali

**Passaggi:**
1. Vai sulla tab **"📊 Dashboard Admin"**
2. Clicca su **"✏️ Modifica Dashboard"**
3. Inserisci manualmente:
   - **NAV Totale**: Valore patrimoniale netto
   - **Saldo Totale Conti**: Somma di tutti i conti
   - **Note**: Annotazioni opzionali
4. Clicca **"💾 Salva Modifiche"**
5. I dati vengono salvati automaticamente

**Esempio:**
```
NAV Totale: €185,000.00
Saldo Totale Conti: €175,000.00
Note: Aggiornamento mensile Gennaio 2024
```

**Importante:** I dati vengono salvati nel localStorage e **NON spariscono mai**, anche dopo il refresh della pagina.

### 1.2 Collegare Conti e Wallet

**Aggiungere un Conto Bancario:**
1. Clicca su **"+ Collega Conto"**
2. Inserisci nome: "Conto UniCredit Principale"
3. Conferma OK (tipo: Banca)
4. Inserisci saldo: 50000
5. Il conto viene aggiunto alla lista

**Aggiungere un Wallet Crypto:**
1. Clicca su **"+ Collega Conto"**
2. Inserisci nome: "Wallet Ethereum Personale"
3. Clicca Annulla (tipo: Wallet Crypto)
4. Inserisci saldo: 2.5 (ETH)
5. Il wallet viene aggiunto alla lista

**Gestione Conti:**
- ✅ Puoi collegare **infiniti** conti e wallet
- ✅ Ogni conto ha un saldo iniziale
- ✅ Puoi rimuovere conti quando necessario
- ✅ I dati restano salvati permanentemente

### 1.3 Effettuare Prelievi

**Prelievo da Banca a Wallet Crypto:**
1. Clicca su **"💸 Prelievo"**
2. Seleziona "Da": Conto UniCredit (€50,000)
3. Seleziona "A": Wallet Ethereum (2.5 ETH)
4. Inserisci importo: €1,000
5. Clicca **"💸 Preleva"**

**Cosa succede:**
- Saldo UniCredit: €50,000 → €49,000
- Wallet Ethereum: riceve €1,000
- Transazione registrata nello storico
- Timestamp: 15/01/2024 14:30:00
- Riferimento: WDR-1705326600000

**Storico Prelievi:**
- Visualizza tutti i prelievi effettuati
- Ogni transazione ha timestamp e riferimento
- Stato: Completato/In attesa/Fallito

---

## PARTE 2: Portfolio Manager

### 2.1 Aggiungere Titoli e Azioni

**Passaggi:**
1. Vai sulla tab **"💼 Portafoglio"**
2. Clicca su **"+ Aggiungi Titolo"**
3. Compila il form:

**Esempio: ETF**
```
Nome: Vanguard FTSE All-World
Tipo: ETF
ISIN: IE00BK5BQT80
Ticker: VWCE
Quantità: 100
Prezzo Acquisto: €95.50
Prezzo Attuale: €105.20
Valuta: EUR
Conto: Conto UniCredit
Data Acquisto: 2023-01-15
Note: ETF globale diversificato
```

**Esempio: Azione**
```
Nome: Apple Inc.
Tipo: Azione
Ticker: AAPL
Quantità: 50
Prezzo Acquisto: $150.00
Prezzo Attuale: $175.30
Valuta: USD
Conto: Conto Trading Directa
Data Acquisto: 2023-03-20
```

**Tipi supportati:**
- 📈 Azione (stock)
- 📊 ETF
- 💼 Fondo
- 📄 Obbligazione (bond)
- 🪙 Crypto
- 📋 Altro

**Importante:** I titoli vengono salvati **permanentemente** e non spariscono mai.

### 2.2 Aggiungere Conti nel Portfolio

**Passaggi:**
1. Vai su **"💼 Portafoglio"** → **"🏦 Conti & Wallet"**
2. Clicca **"+ Aggiungi Conto"**
3. Compila il form:

**Esempio: Banca**
```
Nome Conto: Conto UniCredit
Tipo: Banca
Istituto: UniCredit
Valuta: EUR
Saldo: €50,000.00
IBAN: IT60X0000000000000000000000
```

**Esempio: Wallet Crypto**
```
Nome Conto: Wallet Ethereum
Tipo: Wallet Crypto
Blockchain: Ethereum
Valuta: ETH
Saldo: 2.5
Indirizzo: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 2.3 Inserire NAV Manualmente

**Passaggi:**
1. Vai su **"💼 Portafoglio"** → **"💰 NAV Manuali"**
2. Clicca **"+ Aggiungi NAV"**
3. Compila il form:

**Esempio:**
```
Data: 2024-01-15
Titolo: Vanguard FTSE All-World
NAV Contabile: €10,520.00 (da estratto conto)
NAV Mercato: €10,550.00 (da Morningstar)
Note: NAV aggiornato da Morningstar.it
```

**Cosa succede:**
- Il sistema calcola automaticamente la differenza
- I dati vengono salvati permanentemente
- Puoi aggiungere note per tracciare la fonte

---

## PARTE 3: Importazione Dati

### 3.1 Web Scraping

**Passaggi:**
1. Vai sulla tab **"🌐 Estrattore"**
2. Seleziona la fonte (es. Morningstar)
3. Inserisci URL del sito
4. Clicca **"📥 Estrai Dati"**
5. Il sistema estrae automaticamente i dati

**Fonti supportate:**
- ⭐ Morningstar
- 📈 Yahoo Finance
- 🇮🇹 Borsa Italiana
- 🏦 Directa, Fineco, Intesa
- Ξ Etherscan (Ethereum)
- ₿ Blockchain.com (Bitcoin)
- 🔶 Binance
- E molte altre (13+ fonti)

### 3.2 Importazione CSV

**Passaggi:**
1. Vai sulla tab **"📥 Importa"**
2. Seleziona **"CSV / Excel"**
3. Carica il file CSV
4. Il sistema importa i dati
5. I dati vengono convertiti in fondi contabili

**Formati supportati:**
- ✅ CSV (comma-separated)
- ✅ Excel (.xlsx, .xls)
- ✅ JSON
- ✅ XML

### 3.3 Conversione in Fondi Contabili

**Flusso:**
```
Web Scraping/CSV → Dati grezzi
    ↓
Portfolio Manager → Converti in fondi contabili
    ↓
Dashboard Admin → Aggiorna NAV totali
    ↓
Riconciliazione → Allinea saldi
    ↓
Fondi Disponibili → Pronti per prelievo
```

---

## PARTE 4: Riconciliazione

### 4.1 Riconciliazione Tradizionale

**Quando usarla:** Conti bancari, broker, fondi tradizionali

**Passaggi:**
1. Vai sulla tab **"🔄 Riconciliazione"**
2. Seleziona modalità **"Tradizionale"**
3. Carica estratto conto
4. Il sistema matcha le transazioni
5. Clicca **"Esegui Riconciliazione"**

**Formula:**
```
NAV Disponibile = NAV Contabile
  - Commissioni
  - Tasse
  + Dividendi
  ± Rettifiche
```

### 4.2 Riconciliazione On-Chain

**Quando usarla:** Wallet crypto, blockchain

**Passaggi:**
1. Vai sulla tab **"🔗 On-Chain"**
2. Aggiungi wallet (indirizzo pubblico)
3. Clicca **"🔍 Verifica On-Chain"**
4. Il sistema verifica saldo sulla blockchain
5. Clicca **"🔄 Riconcilia"**

### 4.3 Riconciliazione Ibrida

**Quando usarla:** Portafogli misti (tradizionale + crypto)

**Passaggi:**
1. Collega sia conti bancari che wallet crypto
2. Vai sulla tab **"🌐 Estrattore"**
3. Estrai dati da tutte le fonti
4. Vai su **"🔄 Riconciliazione"**
5. Seleziona modalità **"Ibrida"**
6. Clicca **"Esegui Riconciliazione"**

---

## PARTE 5: Prelievo e Accredito

### 5.1 Prelievo tra Conti

**Esempio: Da Banca a Wallet Crypto**
```
1. Dashboard Admin → "💸 Prelievo"
2. Da: Conto UniCredit (€50,000)
3. A: Wallet Ethereum (2.5 ETH)
4. Importo: €5,000
5. Conferma
```

**Risultato:**
- Conto UniCredit: €45,000
- Wallet Ethereum: riceve €5,000
- Storico: Transazione registrata

### 5.2 Accredito su Conti Collegati

**Flusso:**
```
Fondi Contabili (da web scraping/CSV)
    ↓
Riconciliazione (tradizionale/on-chain/ibrida)
    ↓
Fondi Disponibili
    ↓
Prelievo → Accredito su conto/wallet collegato
```

---

## PARTE 6: Gestione Whitelist IP

### 6.1 Aggiungere IP

**Passaggi:**
1. Vai sulla tab **"🔐 Admin"**
2. Clicca **"+ Aggiungi IP"**
3. Inserisci IP (es. 192.168.1.100)
4. Clicca **"Aggiungi"**
5. L'IP viene aggiunto alla whitelist

### 6.2 Rimuovere IP

**Passaggi:**
1. Vai sulla tab **"🔐 Admin"**
2. Trova l'IP nella lista
3. Clicca **"🗑️ Rimuovi"**
4. Conferma

**Nota:** L'IP 93.44.201.21 non può essere rimosso.

### 6.3 Esportare/Importare Whitelist

**Esportare:**
1. Clicca **"📤 Esporta"**
2. Scarica file JSON

**Importare:**
1. Clicca **"📥 Importa"**
2. Seleziona file JSON
3. Whitelist aggiornata

---

# 👤 GUIDA PER GLI UTENTI STANDARD

## Cosa Puoi Fare

### 1. Visualizzare la Dashboard
- ✅ Vedi NAV totale
- ✅ Vedi saldo totale conti
- ✅ Vedi conti collegati
- ❌ NON puoi modificare

### 2. Consultare i Dati
- ✅ Vedi titoli e azioni
- ✅ Vedi conti e wallet
- ✅ Vedi NAV manuali
- ✅ Vedi riepilogo portafoglio
- ❌ NON puoi aggiungere/modificare

### 3. Esportare Report
- ✅ Export CSV
- ✅ Export JSON
- ✅ Export Excel
- ✅ Export PDF
- ✅ Export XML
- ✅ Export SQL

### 4. Leggere la Guida
- ✅ Guida completa
- ✅ Guide specifiche
- ✅ Documentazione tecnica
- ✅ Troubleshooting

### 5. Visualizzare Test
- ✅ Suite test
- ✅ Risultati test
- ✅ Performance

## Cosa NON Puoi Fare

- ❌ Modificare NAV e saldi
- ❌ Collegare conti e wallet
- ❌ Effettuare prelievi
- ❌ Aggiungere titoli e azioni
- ❌ Inserire NAV manuali
- ❌ Accedere alla Dashboard Admin
- ❌ Gestire whitelist IP
- ❌ Qualsiasi operazione di modifica

## Come Ottenere Accesso Completo

Se hai bisogno di accesso completo:
1. Contatta l'amministratore
2. Comunica il tuo indirizzo IP
3. L'amministratore lo aggiungerà alla whitelist
4. Avrai accesso completo

---

# 📋 ESEMPI PRATICI COMPLETI

## Esempio 1: Amministratore - Gestione Completa

**Scenario:** Amministratore gestisce portafoglio completo

### Step 1: Configurazione Iniziale
```
Dashboard Admin:
- NAV Totale: €185,000
- Saldo Totale: €175,000

Conti Collegati:
- Conto UniCredit: €50,000
- Conto Directa: €25,000
- Wallet Ethereum: 2.5 ETH (€8,940)
```

### Step 2: Aggiunta Titoli
```
Portfolio Manager:
- Vanguard FTSE All-World: 100 quote × €105.20 = €10,520
- Apple Inc.: 50 azioni × $175.30 = $8,765
- Bitcoin: 0.5 BTC × €55,000 = €27,500
```

### Step 3: Inserimento NAV
```
NAV Manuali:
- Vanguard: Contabile €10,520, Mercato €10,550
- Apple: Contabile $8,765, Mercato $8,800
- Bitcoin: Contabile €27,500, Mercato €27,600
```

### Step 4: Riconciliazione
```
Riconciliazione Ibrida:
- Tradizionale: Allinea saldi bancari
- On-Chain: Verifica wallet crypto
- Risultato: Tutti i saldi riconciliati
```

### Step 5: Prelievo
```
Prelievo:
- Da: Conto UniCredit (€50,000)
- A: Wallet Ethereum (2.5 ETH)
- Importo: €5,000
- Risultato: UniCredit €45,000, ETH riceve €5,000
```

### Risultato Finale
```
Patrimonio Totale: €185,000
- Tradizionale: €150,000
- Crypto: €35,000
Conti Collegati: 3
Prelievi Effettuati: 1
```

---

## Esempio 2: Utente Standard - Consultazione

**Scenario:** Utente standard consulta i dati

### Step 1: Accesso
```
1. Apri l'applicazione
2. Il sistema verifica il tuo IP
3. Se non autorizzato → accesso limitato
```

### Step 2: Visualizzazione Dashboard
```
Dashboard:
- NAV Totale: €185,000 (solo lettura)
- Saldo Totale: €175,000 (solo lettura)
- Conti Collegati: 3 (solo lettura)
```

### Step 3: Consultazione Portafoglio
```
❌ Accesso negato alla tab "💼 Portafoglio"
Messaggio: "Solo gli utenti autorizzati possono gestire il portafoglio"
```

### Step 4: Export Report
```
1. Vai su "📄 Report"
2. Scegli formato: PDF
3. Clicca "📕 PDF"
4. File scaricato: report_2024-01-15.pdf
```

### Risultato
```
Utente standard può:
✅ Vedere tutti i dati
✅ Esportare report
❌ NON può modificare nulla
```

---

## Esempio 3: Importazione e Conversione

**Scenario:** Amministratore importa dati da CSV e converte in fondi

### Step 1: Importazione CSV
```
1. Tab "📥 Importa"
2. Seleziona "CSV / Excel"
3. Carica file: estratto_conto_unicredit.csv
4. Sistema importa dati
```

### Step 2: Conversione in Fondi Contabili
```
1. Tab "💼 Portafoglio"
2. Aggiungi titoli dal CSV
3. Dati salvati permanentemente
```

### Step 3: Aggiornamento Dashboard
```
1. Tab "📊 Dashboard Admin"
2. Modifica NAV totali
3. Salva modifiche
```

### Step 4: Riconciliazione
```
1. Tab "🔄 Riconciliazione"
2. Seleziona "Tradizionale"
3. Esegui riconciliazione
4. Fondi diventano disponibili
```

### Risultato
```
Dati importati da CSV
Convertiti in fondi contabili
Riconciliati con saldi bancari
Pronti per prelievo
```

---

# 🔒 SICUREZZA E PRIVACY

## Protezione Dati
- ✅ **100% client-side**: Dati nel tuo browser
- ✅ **Nessun server**: Nessuna trasmissione
- ✅ **Open source**: Codice verificabile
- ✅ **Locale-first**: Funziona offline
- ✅ **Persistenza**: Dati salvati nel localStorage

## Sicurezza IP
- ✅ **Whitelist**: Solo IP autorizzati
- ✅ **Verifica automatica**: Controllo ad ogni accesso
- ✅ **Log accessi**: Tracciamento completo
- ✅ **IP principale protetto**: Non rimovibile

## Best Practices
1. Non condividere mai chiavi private
2. Usa solo indirizzi pubblici per wallet
3. Verifica sempre gli IP autorizzati
4. Esporta backup regolari
5. Aggiorna regolarmente il sistema

---

# 📚 DOCUMENTAZIONE COMPLETA

## Guide Principali
1. **[GUIDA_COMPLETA_DEFINITIVA.md](./GUIDA_COMPLETA_DEFINITIVA.md)** - Questa guida
2. **[DASHBOARD_ADMIN.md](./DASHBOARD_ADMIN.md)** - Dashboard Amministratore
3. **[GUIDA_PRATICA.md](./GUIDA_PRATICA.md)** - UniCredit + Crypto step-by-step
4. **[SICUREZZA_IP.md](./SICUREZZA_IP.md)** - Sistema sicurezza IP

## Guide Tecniche
5. **[DEPLOY_GLOBALE.md](./DEPLOY_GLOBALE.md)** - Deploy su tutte le piattaforme
6. **[EXTRACTOR_DOCS.md](./EXTRACTOR_DOCS.md)** - Estrattore universale
7. **[ONCHAIN_DOCS.md](./ONCHAIN_DOCS.md)** - Riconciliazione on-chain
8. **[TEST_REPORT.md](./TEST_REPORT.md)** - Report test

---

# 🆘 TROUBLESHOOTING

## Problema: Accesso Negato
**Causa:** IP non autorizzato  
**Soluzione:** Contatta l'amministratore

## Problema: Dati non salvati
**Causa:** localStorage disabilitato  
**Soluzione:** Abilita localStorage nel browser

## Problema: Prelievo fallito
**Causa:** Saldo insufficiente  
**Soluzione:** Verifica saldo conto di origine

## Problema: Conti non visibili
**Causa:** Dati corrotti  
**Soluzione:** `localStorage.clear()` e ricarica

---

# 🎉 CONCLUSIONI

## Per l'Amministratore
✅ **Controllo completo** della piattaforma  
✅ **Dashboard editabile** con NAV e saldi  
✅ **Conti illimitati** collegabili  
✅ **Prelievi** tra conti con storico  
✅ **Persistenza dati** garantita  
✅ **Sicurezza IP** attiva  

## Per gli Utenti Standard
✅ **Visualizzazione** dati completa  
✅ **Export report** in 6 formati  
✅ **Guida completa** disponibile  
✅ **Consultazione** portafoglio  

## Il Sistema è Completo
✅ **37 moduli** trasformati  
✅ **11+ componenti** React  
✅ **6 formati** export  
✅ **10+ piattaforme** deploy  
✅ **13+ fonti** dati  
✅ **Persistenza** dati garantita  
✅ **Sicurezza** IP attiva  

---

**Versione:** 3.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completo e Pronto per Produzione

**🚀 Il sistema è pronto per l'uso!**
