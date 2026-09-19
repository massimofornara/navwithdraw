# 💸 Sistema di Funding/Clearing On-Chain - Guida Completa

## ✅ Cosa È Stato Implementato

Un sistema di **riconciliazione con funding/clearing** che permette di allineare i saldi on-chain con i saldi contabili tramite trasferimenti reali da un wallet di tesoreria aziendale.

---

## 🎯 Concetto di Funding/Clearing

### Scenario Aziendale Tipico

```
Contesto:
- Azienda ha un wallet di tesoreria centrale con fondi reali
- Utenti hanno wallet individuali on-chain
- Sistema contabile interno registra i diritti degli utenti
- A volte il saldo on-chain di un utente è inferiore al saldo contabile

Problema:
  Saldo Contabile Utente: 1 ETH (diritto riconosciuto)
  Saldo On-Chain Utente:  0 ETH (fondo non ancora trasferito)
  Differenza:             1 ETH

Soluzione:
  Il sistema esegue un'operazione di FUNDING:
  1. Preleva 1 ETH dal wallet di tesoreria aziendale
  2. Lo trasferisce al wallet on-chain dell'utente
  3. I saldi ora sono allineati
```

### Flusso Operativo

```
┌─────────────────────────────────────────────────────────┐
│  1. VERIFICA SALDI                                       │
│     - Saldo Contabile: 1 ETH (dichiarato)               │
│     - Saldo On-Chain: 0 ETH (reale)                     │
│     - Discrepanza: 1 ETH                                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  2. CONTROLLO TESORERIA                                  │
│     - Wallet tesoreria ha fondi sufficienti?             │
│     - Balance tesoreria: 100 ETH                         │
│     - ✓ Fondi disponibili                                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  3. ESECUZIONE FUNDING                                   │
│     - Crea transazione: Tesoreria → Wallet Utente       │
│     - Importo: 1 ETH                                     │
│     - Firma con MetaMask (autorizzazione manuale)       │
│     - Invia alla blockchain                              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  4. CONFERMA ON-CHAIN                                    │
│     - Transazione confermata (12+ blocchi)              │
│     - Saldo utente on-chain: 1 ETH                       │
│     - Saldo tesoreria: 99 ETH                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  5. RICONCILIAZIONE COMPLETATA                           │
│     - Saldo Contabile: 1 ETH                             │
│     - Saldo On-Chain: 1 ETH                              │
│     - Status: ✓ RICONCILIATO                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Come Usare il Sistema

### Step 1: Collega il Wallet di Tesoreria

1. Vai sulla tab **"🏦 Tesoreria"**
2. Clicca **"🔗 Collega Tesoreria (MetaMask)"**
3. Approva la connessione in MetaMask
4. Seleziona il wallet di tesoreria aziendale
5. Il wallet viene collegato con il suo balance reale

**Requisiti:**
- ✅ Il wallet deve contenere fondi reali
- ✅ Devi avere la chiave privata (firma personale)
- ✅ MetaMask deve essere installato

**Esempio:**
```
Wallet Tesoreria: 0xAbC123...XyZ789
Blockchain: Ethereum
Balance: 100.000000 ETH
Status: ✓ Connesso
```

### Step 2: Aggiungi Wallet Utente

1. Vai sulla tab **"💼 Wallet"**
2. Clicca **"+ Aggiungi Wallet"**
3. Inserisci:
   - Blockchain (Ethereum, Polygon, ecc.)
   - Indirizzo pubblico del wallet utente
   - Saldo contabile (es. 1 ETH)
4. Clicca **"Aggiungi"**

**Esempio:**
```
Blockchain: Ethereum
Indirizzo: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Saldo Contabile: 1.000000 ETH
```

### Step 3: Verifica On-Chain

1. Nella lista wallet, clicca **"🔍 Verifica On-Chain"**
2. Il sistema verifica il saldo reale sulla blockchain
3. Viene mostrata la discrepanza (se esiste)

**Risultato:**
```
Saldo Contabile: 1.000000 ETH
Saldo On-Chain:  0.000000 ETH
Differenza:      +1.000000 ETH
Status:          ⚠️ Discrepanza
```

### Step 4: Esegui Funding

1. Vai sulla tab **"🔄 Riconciliazione"**
2. Trova il wallet con discrepanza
3. Clicca **"💸 Funding (1.000000 ETH)"**
4. MetaMask si apre per autorizzare la transazione
5. Verifica i dettagli:
   - Da: Wallet Tesoreria
   - A: Wallet Utente
   - Importo: 1 ETH
6. Firma la transazione
7. Attendi conferma sulla blockchain

**Risultato:**
```
✅ Funding avviato!
TxHash: 0x1234...
Importo: 1.000000 ETH

Dopo conferma:
Saldo On-Chain Utente: 1.000000 ETH
Status: ✓ RICONCILIATO
```

### Step 5: Verifica Storico Funding

1. Vai sulla tab **"💸 Funding"**
2. Visualizza tutte le operazioni di funding eseguite
3. Ogni operazione mostra:
   - Hash transazione
   - Da (Tesoreria) → A (Wallet Utente)
   - Importo trasferito
   - Stato (Confermato/In attesa/Fallito)
   - Data e blocco

---

## 🔧 Dettagli Tecnici

### Architettura

```
┌──────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                         │
│  - Interfaccia utente                                     │
│  - Gestione stato                                         │
│  - Integrazione MetaMask                                  │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│  METAMASK (Wallet)                                        │
│  - Firma transazioni                                      │
│  - Autorizzazione utente                                  │
│  - Gestione chiavi private                                │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│  BLOCKCHAIN (Ethereum/Polygon/etc.)                       │
│  - Registro immutabile                                    │
│  - Transazioni reali                                      │
│  - Conferme blocchi                                       │
└──────────────────────────────────────────────────────────┘
```

### Funzioni Principali

#### 1. `connectTreasuryWallet(blockchain)`
```javascript
// Collega wallet di tesoreria via MetaMask
const connectTreasuryWallet = async (blockchain) => {
  // 1. Richiedi connessione MetaMask
  const accounts = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  })
  
  // 2. Ottieni indirizzo
  const address = accounts[0]
  
  // 3. Ottieni balance reale
  const balance = await getEvmBalance(address, blockchain)
  
  // 4. Salva stato
  setTreasuryWallet({ address, blockchain, balance, connected: true })
}
```

#### 2. `executeFunding(walletId)`
```javascript
// Esegui funding da tesoreria a wallet utente
const executeFunding = async (walletId) => {
  // 1. Calcola funding necessario
  const fundingNeeded = balanceAccounting - balanceOnChain
  
  // 2. Verifica fondi tesoreria
  if (treasuryWallet.balance < fundingNeeded) {
    throw new Error('Fondi insufficienti')
  }
  
  // 3. Crea transazione
  const tx = {
    from: treasuryWallet.address,
    to: userWallet.address,
    value: fundingNeededInWei,
    gas: 21000
  }
  
  // 4. Firma con MetaMask
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx]
  })
  
  // 5. Monitora conferma
  monitorFundingTransaction(txHash, walletId, fundingNeeded)
}
```

#### 3. `monitorFundingTransaction(txHash, walletId, amount)`
```javascript
// Monitora conferma transazione funding
const monitorFundingTransaction = async (txHash, walletId, amount) => {
  // Polling ogni 5 secondi
  for (let i = 0; i < 24; i++) {
    const receipt = await getTransactionReceipt(txHash)
    
    if (receipt) {
      if (receipt.status === '0x1') {
        // Aggiorna saldo on-chain utente
        updateWalletBalance(walletId, amount)
        
        // Aggiorna riconciliazione
        updateReconciliation(walletId)
        
        // Aggiorna balance tesoreria
        updateTreasuryBalance()
      }
      break
    }
    
    await sleep(5000)
  }
}
```

### Struttura Dati

#### TreasuryWallet
```typescript
{
  address: string           // Indirizzo wallet tesoreria
  blockchain: BlockchainType // Blockchain utilizzata
  balance: number           // Balance reale
  connected: boolean        // Stato connessione
}
```

#### FundingTransaction
```typescript
{
  id: string                // ID univoco
  fromTreasury: string      // Indirizzo tesoreria
  toUserWallet: string      // Indirizzo wallet utente
  amount: number            // Importo trasferito
  txHash: string            // Hash transazione
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string         // Timestamp esecuzione
  blockNumber?: number      // Numero blocco conferma
}
```

---

## 📊 Esempio Pratico Completo

### Scenario: Exchange Crypto

**Contesto:**
- Exchange ha wallet di tesoreria con 1000 ETH
- Utente "Mario" ha depositato 1 ETH via bonifico
- Sistema contabile accredita 1 ETH a Mario
- Wallet on-chain di Mario ha ancora 0 ETH

**Flusso:**

```
1. VERIFICA INIZIALE
   Wallet Mario:
   - Saldo Contabile: 1.000000 ETH
   - Saldo On-Chain:  0.000000 ETH
   - Discrepanza:     +1.000000 ETH

2. CONTROLLO TESORERIA
   Wallet Tesoreria:
   - Indirizzo: 0xAbC123...
   - Balance: 1000.000000 ETH
   - ✓ Fondi sufficienti

3. ESECUZIONE FUNDING
   Transazione:
   - Da: 0xAbC123... (Tesoreria)
   - A: 0x742d35... (Mario)
   - Importo: 1.000000 ETH
   - Gas: 21000
   - Firma: MetaMask

4. CONFERMA ON-CHAIN
   TxHash: 0x1234...
   Blocco: #18500000
   Status: ✓ Confermato

5. AGGIORNAMENTO SALDI
   Wallet Mario:
   - Saldo Contabile: 1.000000 ETH
   - Saldo On-Chain:  1.000000 ETH
   - Status:          ✓ RICONCILIATO

   Wallet Tesoreria:
   - Balance precedente: 1000.000000 ETH
   - Balance attuale:    999.000000 ETH
```

---

## 🔒 Sicurezza

### Cosa il Sistema FA

- ✅ Trasferisce fondi REALI da tesoreria a wallet utente
- ✅ Richiede firma personale con MetaMask
- ✅ Verifica che la tesoreria abbia fondi sufficienti
- ✅ Monitora conferma transazione sulla blockchain
- ✅ Aggiorna saldi automaticamente dopo conferma

### Cosa il Sistema NON FA

- ❌ Non crea fondi dal nulla
- ❌ Non modifica saldi on-chain senza transazione reale
- ❌ Non accede a chiavi private
- ❌ Non esegue transazioni senza autorizzazione utente

### Best Practices

1. **Verifica sempre i fondi della tesoreria** prima di eseguire funding
2. **Firma personalmente** ogni transazione con MetaMask
3. **Monitora le conferme** sulla blockchain
4. **Tieni traccia** di tutte le operazioni di funding
5. **Mantieni backup** delle chiavi della tesoreria

---

## 💡 Casi d'Uso

### 1. Exchange Crypto
```
Utente deposita fiat → Sistema accredita crypto (contabile)
Funding automatico → Crypto trasferita on-chain
Risultato: Saldo contabile = Saldo on-chain
```

### 2. Piattaforma di Trading
```
Utente esegue trade → Profitto registrato (contabile)
Funding periodico → Profitto trasferito on-chain
Risultato: Utente può prelevare fondi reali
```

### 3. Servizio di Custodia
```
Cliente deposita crypto → Registro contabile
Wallet on-chain cliente → Funding automatico
Risultato: Cliente ha controllo reale dei fondi
```

### 4. Payroll Crypto
```
Dipendente ha salario (contabile)
Funding mensile → Crypto trasferita on-chain
Risultato: Dipendente riceve pagamento reale
```

---

## 🎯 Vantaggi

### Per l'Azienda

- ✅ **Automazione**: Funding eseguito automaticamente
- ✅ **Trasparenza**: Tutte le operazioni tracciate on-chain
- ✅ **Sicurezza**: Firma personale richiesta per ogni transazione
- ✅ **Conformità**: Saldo contabile = Saldo on-chain

### Per l'Utente

- ✅ **Controllo**: Fondi realmente disponibili on-chain
- ✅ **Trasparenza**: Può verificare su block explorer
- ✅ **Sicurezza**: Fondi sotto suo controllo
- ✅ **Portabilità**: Può trasferire fondi liberamente

---

## 📈 Metriche e Monitoraggio

### Dashboard Tesoreria

```
Wallet Tesoreria:
- Indirizzo: 0xAbC123...
- Balance: 999.000000 ETH
- Funding eseguiti: 1
- Ultimo funding: 2 min fa

Funding Recenti:
- 1.000000 ETH → Wallet Mario (✓ Confermato)
```

### Storico Funding

```
ID: funding-001
Da: 0xAbC123... (Tesoreria)
A: 0x742d35... (Mario)
Importo: 1.000000 ETH
TxHash: 0x1234...
Status: ✓ Confermato
Blocco: #18500000
Data: 2024-01-15 14:30:00
```

---

## 🚀 Prossimi Sviluppi

### Possibili Estensioni

1. **Funding Automatico**
   - Trigger automatico quando discrepanza > soglia
   - Nessun intervento manuale richiesto

2. **Multi-Tesoreria**
   - Supporto per più wallet di tesoreria
   - Load balancing tra tesorerie

3. **Funding Parziale**
   - Trasferimento parziale se tesoreria insufficiente
   - Coda di funding in attesa

4. **Alert e Notifiche**
   - Notifica quando discrepanza rilevata
   - Alert quando funding completato

5. **Report Automatici**
   - Report giornaliero funding eseguiti
   - Report mensile movimenti tesoreria

---

## 📚 Documentazione Correlata

- **[GUIDA_ONCHAIN_REALE.md](./GUIDA_ONCHAIN_REALE.md)** - Sistema on-chain base
- **[GUIDA_METAMASK_API.md](./GUIDA_METAMASK_API.md)** - Integrazione MetaMask
- **[GUIDA_COMPLETA_DEFINITIVA.md](./GUIDA_COMPLETA_DEFINITIVA.md)** - Guida completa sistema

---

**Versione:** 2.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completamente Funzionante con Funding/Clearing

**🚀 Il sistema di funding/clearing è ora operativo!**
