# 📖 Guida Pratica: UniCredit + Wallet Crypto

Questa guida ti mostra **passo dopo passo** come utilizzare il sistema per convertire i fondi contabili in disponibili, collegando sia il tuo conto UniCredit che il tuo wallet crypto.

---

## 🎯 Obiettivo

Convertire il **NAV Contabile** (valore teorico) in **NAV Disponibile** (valore reale) per:
- ✅ Conto UniCredit (fondi, ETF, azioni)
- ✅ Wallet Crypto (ETH, BTC, MATIC, ecc.)
- ✅ Ottenere il patrimonio totale disponibile

---

## 📊 Come Funziona la Conversione

```
NAV Contabile → Riconciliazione → NAV Disponibile
     ↓                ↓                  ↓
  Valore         Commissioni,        Valore reale
  teorico        tasse, fee          liquidabile
```

### Esempio Pratico

**UniCredit (Tradizionale):**
- Fondo Vanguard FTSE AW: €125,000 (contabile)
- Commissioni (0.5%): -€625
- Tasse plusvalenze (26%): -€1,300
- Dividendi in arrivo: +€450
- **= NAV Disponibile: €123,525**

**Wallet Crypto (On-Chain):**
- 2.500 ETH (contabile): €9,100
- 2.456 ETH (verificato on-chain): €8,940
- Gas fees totali: -€22
- TX pendente (0.5 ETH): in attesa
- **= NAV Disponibile: €8,918**

**Patrimonio Totale Disponibile: €132,443**

---

## 🏦 Parte 1: UniCredit (Riconciliazione Tradizionale)

### Step 1: Scarica Estratto Conto UniCredit

1. Accedi a [UniCredit Home Banking](https://www.unicredit.it/it/privati.html)
2. Vai su **Conti → Estratto conto**
3. Seleziona il periodo desiderato (es. ultimo mese)
4. Clicca **"Scarica"** → Scegli formato **CSV**
5. Salva il file sul tuo computer

💡 **Tip:** UniCredit permette di scaricare estratti conto fino a 24 mesi indietro

### Step 2: Collega UniCredit al Sistema

1. Apri l'applicazione e vai sulla tab **"🌐 Estrattore"**
2. Clicca su **"Fonti Dati"**
3. Cerca **"UniCredit"** nella lista
4. Clicca **"Connetti"**
5. Inserisci le credenziali (solo per lettura)
6. Autorizza l'accesso in **sola lettura**

⚠️ **Sicurezza:** Il sistema usa connessione in SOLA LETTURA - non può effettuare operazioni sul tuo conto

### Step 3: Importa NAV Fondi Contabili

1. Vai sulla tab **"💼 Fondi"**
2. Clicca **"+ Aggiungi Fondo"**
3. Inserisci **ISIN del fondo** (es. IE00BK5BQT80 per Vanguard FTSE All-World)
4. Inserisci **NAV contabile** dal tuo estratto conto UniCredit
5. Inserisci **numero quote** possedute
6. Seleziona **"UniCredit"** come conto di riferimento
7. Clicca **"Salva"**

💡 **Dove trovare il NAV contabile:** Nell'estratto conto UniCredit, sezione "Patrimonio" o "Posizione titoli"

### Step 4: Estrai NAV Reale dal Mercato

1. Vai sulla tab **"🌐 Estrattore"**
2. Seleziona **"Morningstar"** e **"Borsa Italiana"**
3. Clicca **"📥 Estrai Dati"**
4. Il sistema confronta automaticamente:
   - NAV contabile (da UniCredit)
   - NAV reale (da Morningstar/Borsa Italiana)
5. Le differenze vengono evidenziate automaticamente

**Esempio:**
```
NAV Contabile: €125.43 (UniCredit)
NAV Reale:     €125.50 (Morningstar)
Differenza:    +€0.07
→ Questa differenza viene registrata come aggiustamento
```

### Step 5: Riconciliazione Tradizionale

1. Vai sulla tab **"🔄 Riconciliazione"**
2. Seleziona modalità **"Tradizionale"**
3. Il sistema calcola automaticamente:
   - ✅ Commissioni non ancora registrate
   - ✅ Dividendi in sospeso
   - ✅ Rettifiche valutarie
   - ✅ Tasse applicabili
4. Clicca **"Esegui Riconciliazione"**
5. Il NAV diventa **"Disponibile"**

**Formula:**
```
NAV Disponibile = NAV Contabile
  - Commissioni (es. 0.50%)
  - Tasse (es. 26% su plusvalenze)
  + Dividendi in arrivo
  ± Rettifiche valutarie
```

**Esempio:**
```
NAV Contabile:    €125,000.00
- Commissioni:    €625.00
- Tasse:          €1,300.00
+ Dividendi:      €450.00
═══════════════════════════
NAV Disponibile:  €123,525.00
```

---

## 🔗 Parte 2: Wallet Crypto (Riconciliazione On-Chain)

### Step 1: Prepara il Tuo Wallet Crypto

1. Apri il tuo wallet (Ledger, MetaMask, Trust Wallet, ecc.)
2. **Copia l'indirizzo pubblico** (NON la chiave privata!)
3. Nota quale blockchain usi:
   - Ethereum (ETH)
   - Bitcoin (BTC)
   - Polygon (MATIC)
   - Arbitrum
   - Base
4. Verifica il saldo attuale sul tuo wallet

⚠️ **IMPORTANTE:** Inserisci SOLO l'indirizzo pubblico - mai la chiave privata o seed phrase!

### Step 2: Collega Wallet al Sistema

1. Vai sulla tab **"🔗 On-Chain"**
2. Clicca **"+ Aggiungi Wallet"**
3. Seleziona la **blockchain** (Ethereum, Bitcoin, ecc.)
4. **Incolla l'indirizzo pubblico** del wallet
5. Inserisci il **saldo contabile** (quello che dichiari)
6. Clicca **"🔍 Verifica On-Chain"**

**Esempio:**
```javascript
// Il sistema verifica automaticamente:
const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
const blockchain = "ethereum"

// Chiama Etherscan API
const onChainBalance = await etherscan.getBalance(walletAddress)
// Result: 2.456 ETH

// Converte in EUR
const balanceEUR = onChainBalance * ethPriceEUR
// Result: €8,920.50
```

### Step 3: Verifica Transazioni On-Chain

1. Il sistema interroga la blockchain (Etherscan, Blockchain.com, ecc.)
2. Scarica tutte le transazioni del wallet
3. Verifica lo stato di ogni transazione:
   - ✅ **Confermata** (12+ conferme)
   - ⏳ **Pendente** (in attesa)
   - ✗ **Fallita**
4. Calcola le fee pagate per ogni transazione
5. Identifica transazioni non ancora registrate

**Esempio:**
```javascript
// Transazioni trovate sulla blockchain:
[
  { hash: "0x1234...", value: 1.2, status: "confirmed", fee: 0.002 },
  { hash: "0x5678...", value: 0.5, status: "pending", fee: 0.001 },
  { hash: "0x9abc...", value: 0.8, status: "confirmed", fee: 0.003 }
]

// Totale: 2.5 ETH confermati + 0.5 ETH pendenti
// Fee totali: 0.006 ETH
```

### Step 4: Riconciliazione On-Chain

1. Vai sulla tab **"🔗 On-Chain"** → **"Riconciliazione"**
2. Il sistema confronta:
   - Saldo contabile (dichiarato)
   - Saldo on-chain (verificato blockchain)
   - Transazioni pendenti
   - Fee totali pagate
3. Se c'è differenza, il sistema la evidenzia
4. Clicca **"🔄 Riconcilia"** per allineare i valori

**Esempio:**
```
Saldo Contabile:  2.500 ETH
Saldo On-Chain:   2.456 ETH
TX Pendenti Out:  0.500 ETH
Fee Totali:       0.006 ETH

// Calcolo:
Differenza = 2.500 - 2.456 = 0.044 ETH
→ C'è una discrepanza di 0.044 ETH
→ Probabilmente una TX non registrata

// Dopo riconciliazione:
NAV Disponibile = 2.456 ETH (saldo reale blockchain)
```

---

## 🔄 Parte 3: Riconciliazione Ibrida (UniCredit + Crypto)

### Step 1: Collega Entrambe le Fonti

1. **Collega UniCredit** (vedi Parte 1, Step 1-2)
2. **Collega wallet crypto** (vedi Parte 2, Step 1-2)
3. Verifica che entrambi siano **"✓ Connessi"**
4. Il sistema ora ha accesso a entrambi i saldi

💡 **Tip:** Puoi avere più wallet crypto e più conti bancari collegati

### Step 2: Estrai Dati da Tutte le Fonti

1. Vai sulla tab **"🌐 Estrattore"**
2. Seleziona sia **"UniCredit"** che **"Etherscan"** (o altra blockchain)
3. Clicca **"📥 Estrai Dati"**
4. Il sistema raccoglie:
   - ✅ Saldo conto UniCredit
   - ✅ NAV fondi UniCredit
   - ✅ Saldo wallet crypto
   - ✅ Transazioni on-chain
   - ✅ Transazioni bancarie

### Step 3: Riconciliazione Ibrida

1. Vai sulla tab **"🔄 Riconciliazione"**
2. Seleziona modalità **"Ibrida"**
3. Il sistema esegue:
   - ✅ Riconciliazione bancaria UniCredit
   - ✅ Riconciliazione on-chain wallet
   - ✅ Conversione crypto → EUR
   - ✅ Calcolo patrimonio totale
4. Tutti i NAV diventano **"Disponibili"**
5. Hai il quadro completo del tuo patrimonio

**Esempio Completo:**
```
═══════════════════════════════════════════════════
PATRIMONIO TOTALE DISPONIBILE
═══════════════════════════════════════════════════

Tradizionale (UniCredit):
  Conto corrente:     €50,000.00
  Fondi (NAV disp):   €123,525.00
  Totale trad:        €173,525.00

Crypto (Wallet ETH):
  ETH: 2.456 × €3,640 = €8,939.84
  BTC: 0.123 × €55,000 = €6,765.00
  Totale crypto:      €15,704.84

═══════════════════════════════════════════════════
PATRIMONIO TOTALE DISPONIBILE:
€189,229.84
═══════════════════════════════════════════════════
```

### Step 4: Esporta il Report Completo

1. Vai sulla tab **"📤 Export"**
2. Scegli il formato preferito:
   - 📊 **CSV** → per Excel/Google Sheets
   - 📈 **Excel** → report formattato
   - 📕 **PDF** → report professionale (ideale per commercialista)
   - 📄 **JSON** → per integrazioni
   - 📋 **XML** → per sistemi enterprise
   - 🗄️ **SQL** → per database
3. Clicca sul formato desiderato
4. Il file viene scaricato automaticamente

💡 **Tip:** Il PDF è ideale per il commercialista, il JSON per automazioni

---

## 🎯 Riepilogo Rapido

### Per UniCredit:
1. Scarica estratto conto CSV
2. Collega UniCredit al sistema
3. Importa NAV fondi contabili
4. Estrai NAV reale da Morningstar
5. Esegui riconciliazione tradizionale
6. **Risultato:** NAV Disponibile UniCredit

### Per Wallet Crypto:
1. Copia indirizzo pubblico wallet
2. Collega wallet al sistema
3. Verifica transazioni on-chain
4. Esegui riconciliazione on-chain
5. **Risultato:** NAV Disponibile Crypto

### Per Entrambi (Ibrido):
1. Collega UniCredit + Wallet
2. Estrai dati da tutte le fonti
3. Esegui riconciliazione ibrida
4. Esporta report completo
5. **Risultato:** Patrimonio Totale Disponibile

---

## 🔒 Sicurezza

### UniCredit
- ✅ Connessione in **sola lettura**
- ✅ Nessuna operazione possibile
- ✅ Credenziali crittate
- ✅ Puoi revocare accesso in qualsiasi momento

### Wallet Crypto
- ✅ Solo **indirizzo pubblico** richiesto
- ✅ **Mai** inserire chiave privata o seed phrase
- ✅ Verifica solo tramite API pubbliche (Etherscan, ecc.)
- ✅ Nessun accesso ai fondi

### Dati
- ✅ Tutti i dati rimangono nel tuo browser
- ✅ Nessun server esterno
- ✅ Puoi cancellare tutto in qualsiasi momento
- ✅ Export locale (nessun upload)

---

## ❓ Domande Frequenti

### D: Dove trovo il NAV contabile su UniCredit?
**R:** Nell'estratto conto, sezione "Patrimonio" o "Posizione titoli". È il valore assegnato dalla banca ai tuoi fondi.

### D: Il sistema può operare sul mio conto UniCredit?
**R:** No, assolutamente. Il sistema ha accesso in **sola lettura**. Non può effettuare operazioni.

### D: Devo inserire la chiave privata del wallet?
**R:** **MAI!** Inserisci solo l'indirizzo pubblico. La chiave privata non deve mai essere condivisa.

### D: Come calcolo le tasse sulle plusvalenze?
**R:** In Italia, le plusvalenze sono tassate al 26%. Il sistema calcola automaticamente l'importo basato sulla differenza tra prezzo di acquisto e NAV attuale.

### D: Posso usare il sistema per più wallet?
**R:** Sì, puoi collegare quanti wallet vuoi (ETH, BTC, MATIC, ecc.) e più conti bancari.

### D: I dati vengono salvati da qualche parte?
**R:** No, tutti i dati rimangono nel tuo browser. Puoi cancellarli in qualsiasi momento.

### D: Come esporto il report per il commercialista?
**R:** Vai su "📤 Export" e scegli formato **PDF**. È il più professionale e adatto per dichiarazioni fiscali.

---

## 🚀 Prossimi Passi

1. **Prova con UniCredit** - Segui la Parte 1
2. **Prova con wallet crypto** - Segui la Parte 2
3. **Collega entrambi** - Segui la Parte 3
4. **Esporta report** - Scegli il formato preferito
5. **Automatizza** - Imposta estrazioni periodiche

---

## 📞 Supporto

Se hai problemi:
1. Controlla la tab **"🧪 Test"** per verificare che tutto funzioni
2. Leggi la documentazione completa in `EXTRACTOR_DOCS.md` e `ONCHAIN_DOCS.md`
3. Verifica che le fonti siano connesse correttamente
4. Controlla i log nella console del browser (F12)

---

**Buona riconciliazione!** 🎉
