# 🔗 Riconciliazione On-Chain - Documentazione

## Panoramica

Il sistema di **riconciliazione on-chain** permette di verificare e riconciliare i saldi crypto direttamente dalla blockchain, collegando il saldo contabile al disponibile reale.

## Funzionalità

### 💼 Gestione Wallet Multi-Chain

Supporto completo per le principali blockchain:

| Blockchain | Icona | Tipo | Fee Media |
|-----------|-------|------|-----------|
| **Bitcoin** | ₿ | L1 | sat/vB |
| **Ethereum** | Ξ | L1 | Gwei |
| **Polygon** | ⬡ | L2 | Gwei (bassi) |
| **Arbitrum** | 🔵 | L2 | Gwei (molto bassi) |
| **Optimism** | 🔴 | L2 | Gwei (molto bassi) |
| **Base** | 🔷 | L2 | Gwei (bassi) |

### 📜 Tracciamento Transazioni

Ogni transazione on-chain viene tracciata con:
- **Hash** univoco della transazione
- **Numero di blocco** di conferma
- **Timestamp** esatto
- **Indirizzi** mittente e destinatario
- **Valore** trasferito
- **Fee** pagata per la transazione
- **Stato** (confermata, pendente, fallita)
- **Numero di conferme** ricevute

### 🔄 Processo di Riconciliazione

Il processo di riconciliazione confronta:

```
Saldo Contabile (registrazioni interne)
         ↕
Saldo On-Chain (verificato su blockchain)
         ↕
Transazioni Pendenti (in attesa di conferma)
         ↕
Fee Totali (costi di transazione)
         ↕
Differenza = 0 → Riconciliato ✓
Differenza ≠ 0 → Discrepanza ⚠
```

### ⛽ Gas Prices in Tempo Reale

Monitoraggio dei costi di transazione per ogni blockchain:

- 🐢 **Slow** - Economia, ~5 min
- 🚶 **Standard** - Bilanciata, ~3 min
- 🚀 **Fast** - Urgente, ~30 sec

## API Blockchain Supportate

### Verifica Saldo
```typescript
// Ethereum e EVM-compatible
const balance = await fetch(
  `https://api.etherscan.io/api?module=account&action=balance&address=${address}`
);

// Bitcoin
const balance = await fetch(
  `https://blockchain.info/balance?active=${address}`
);

// Polygon
const balance = await fetch(
  `https://api.polygonscan.com/api?module=account&action=balance&address=${address}`
);
```

### Lista Transazioni
```typescript
// Ethereum
const txs = await fetch(
  `https://api.etherscan.io/api?module=account&action=txlist&address=${address}`
);

// Bitcoin
const txs = await fetch(
  `https://blockchain.info/rawaddr/${address}`
);
```

### Gas Prices
```typescript
// Ethereum
const gas = await fetch(
  `https://api.etherscan.io/api?module=gastracker&action=gasoracle`
);

// Polygon
const gas = await fetch(
  `https://api.polygonscan.com/api?module=gastracker&action=gasoracle`
);
```

## Processo di Riconciliazione

### Step 1: Verifica Wallet
1. Inserisci l'indirizzo del wallet
2. Il sistema verifica il saldo on-chain
3. Confronta con il saldo contabile
4. Identifica transazioni pendenti

### Step 2: Match Transazioni
1. Scarica tutte le transazioni on-chain
2. Matcha con le registrazioni contabili
3. Identifica transazioni non matchate
4. Calcola fee totali

### Step 3: Calcolo Differenze
```
Differenza = Saldo Contabile - Saldo On-Chain
           - TX Pendenti Incoming
           + TX Pendenti Outgoing
           + Fee Totali
```

### Step 4: Riconciliazione
- Se Differenza = 0 → **Riconciliato** ✓
- Se Differenza ≠ 0 → **Discrepanza** ⚠
  - Verifica transazioni non matchate
  - Controlla fee mancanti
  - Aggiorna registrazioni

## Esempio Pratico

### Wallet Ethereum
```
Saldo Contabile: 2.456 ETH
Saldo On-Chain:  2.456 ETH
TX Pendenti Out: 0.5 ETH
Fee Totali:      0.0035 ETH
TX Matchate:     15
TX Non Matchate: 0
Differenza:      0 ETH
Stato:           ✓ Riconciliato
```

### Wallet con Discrepanza
```
Saldo Contabile: 5.500 ETH
Saldo On-Chain:  5.678 ETH
TX Pendenti:     0
Fee Totali:      0.015 ETH
TX Matchate:     20
TX Non Matchate: 2
Differenza:      -0.178 ETH
Stato:           ⚠ Discrepanza
```

## Integrazione con Sistemi Esterni

### Etherscan (Ethereum)
- API gratuita (5 chiamate/sec)
- Verifica saldi e transazioni
- Gas tracker in tempo reale

### Blockchain.com (Bitcoin)
- API gratuita
- Verifica saldi e transazioni
- Fee estimation

### Polygonscan (Polygon)
- API gratuita (5 chiamate/sec)
- Supporto ERC-20 tokens
- Gas tracker

### Arbiscan (Arbitrum)
- API gratuita
- Verifica L2 transactions
- Gas tracker ottimizzato

## Sicurezza

### Verifica Indirizzi
- Controllo formato indirizzo (checksum EIP-55 per ETH)
- Verifica esistenza on-chain
- Controllo transazioni sospette

### Protezione Dati
- Nessun dato sensibile salvato
- Solo indirizzi pubblici tracciati
- Chiavi private mai gestite

### Audit Trail
- Log di tutte le verifiche
- Timestamp di ogni operazione
- Storico riconciliazioni

## Best Practices

### Frequenza Verifica
- **Wallet attivi**: Ogni ora
- **Wallet operativi**: Ogni 15 minuti
- **Wallet HODL**: Giornalmente

### Soglie di Allerta
- Differenza > 0.01 ETH → Warning
- Differenza > 0.1 ETH → Alert
- TX pendenti > 24h → Critical

### Backup
- Export periodico dati on-chain
- Salvataggio hash transazioni
- Archivio storico riconciliazioni

## Limitazioni

### Rate Limits
- Etherscan: 5 chiamate/sec (free)
- Blockchain.com: 30 chiamate/min
- Polygonscan: 5 chiamate/sec

### Conferme Minime
- Bitcoin: 6 conferme (~60 min)
- Ethereum: 12 conferme (~3 min)
- L2 (Polygon, Arbitrum): 64 blocchi (~2 min)

### Costi API
- Free tier: Sufficiente per uso personale
- Pro tier: Necessario per uso business
- Enterprise: Per volumi elevati

## Troubleshooting

### Wallet Non Verificato
1. Controlla formato indirizzo
2. Verifica connessione internet
3. Controlla rate limit API
4. Riprova dopo qualche minuto

### Differenze Persistenti
1. Verifica transazioni pendenti
2. Controlla fee mancanti
3. Verifica transazioni non matchate
4. Aggiorna registrazioni contabili

### Transazioni Non Trovate
1. Attendi conferma on-chain
2. Verifica indirizzo corretto
3. Controlla blockchain selezionata
4. Verifica API key valida

## Roadmap

### Prossime Funzionalità
- [ ] Supporto Solana
- [ ] Supporto Avalanche
- [ ] Supporto BSC (Binance Smart Chain)
- [ ] NFT tracking
- [ ] DeFi positions
- [ ] Multi-sig wallets
- [ ] Smart contract interactions
- [ ] Cross-chain bridges

### Integrazioni Future
- [ ] MetaMask direct connection
- [ ] WalletConnect
- [ ] Ledger/Trezor integration
- [ ] DeFi protocols (Aave, Uniswap)
- [ ] DEX aggregators

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Produzione
