# 🌐 Estrattore Dati Universale - Documentazione

## Panoramica

Il **Data Extractor** è un sistema completo per estrarre dati da qualsiasi sito web, applicazione o piattaforma finanziaria, supportando sia la finanza tradizionale che le criptovalute, con riconciliazione ibrida e export multiplo formato.

## Funzionalità Principali

### 🌐 Fonti Dati Supportate

#### Finanza Tradizionale
| Fonte | Tipo | Dati Estratti |
|-------|------|---------------|
| **Morningstar** | Fund | NAV, fondi, performance |
| **Yahoo Finance** | Fund | NAV, ETF, azioni |
| **Borsa Italiana** | Fund | NAV, ETF italiani |
| **Directa SIM** | Broker | Conti, transazioni, posizioni |
| **Fineco** | Broker | Conti, ordini, saldi |
| **Intesa Sanpaolo** | Bank | Conti, movimenti, estratti conto |

#### On-Chain / Crypto
| Fonte | Tipo | Dati Estratti |
|-------|------|---------------|
| **Etherscan** | Blockchain | Wallet ETH, transazioni, token |
| **Blockchain.com** | Blockchain | Wallet BTC, transazioni |
| **Polygonscan** | Blockchain | Wallet MATIC, transazioni |
| **Binance** | Exchange | Conti, ordini, trading |
| **Coinbase** | Exchange | Portfolio, transazioni |

#### Ibride
| Fonte | Tipo | Dati Estratti |
|-------|------|---------------|
| **JustETF** | Fund | ETF, NAV, performance |
| **Degiro** | Broker | Conti, ordini, posizioni |
| **Ledger Live** | Wallet | Portfolio crypto, transazioni |

## Modalità di Estrazione

### 1. Estrazione Completa
Estrae dati da **tutte le fonti connesse** contemporaneamente.

```typescript
// Estrai da tutte le fonti
await extractData('all')
```

### 2. Estrazione Selettiva
Estrae dati solo dalle **fonti selezionate** dall'utente.

```typescript
// Estrai solo da fonti specifiche
await extractData('selected', ['morningstar', 'etherscan'])
```

## Modalità di Riconciliazione

### 🏦 Tradizionale
Riconciliazione bancaria classica:
- Confronto con estratti conto
- Match transazioni
- Gestione commissioni e tasse
- Rettifiche valutarie

```typescript
reconcileData({
  mode: 'traditional',
  accountingBalance: 100000,
  bankStatement: [...],
  transactions: [...]
})
```

### 🔗 On-Chain
Verifica diretta dalla blockchain:
- Saldo reale on-chain
- Conferme transazioni
- Gas fees
- Pending transactions

```typescript
reconcileData({
  mode: 'onchain',
  walletAddress: '0x...',
  blockchain: 'ethereum',
  minConfirmations: 12
})
```

### 🔄 Ibrida
Combina tradizionale e on-chain:
- Massima accuratezza
- Cross-validation
- Gestione multi-asset
- Audit trail completo

```typescript
reconcileData({
  mode: 'hybrid',
  sources: ['traditional', 'onchain'],
  validationRules: {...}
})
```

## Formati di Export Supportati

### 📊 CSV
```csv
Source,Type,Category,Timestamp,Status
Morningstar,traditional,fund,2024-01-15T14:30:00,success
Etherscan,onchain,crypto,2024-01-15T14:25:00,success
```

**Uso:** Excel, Google Sheets, database import

### 📄 JSON
```json
{
  "extractedData": [
    {
      "sourceId": "morningstar",
      "timestamp": "2024-01-15T14:30:00Z",
      "data": {
        "funds": [...]
      },
      "status": "success"
    }
  ],
  "reconciliationMode": "hybrid",
  "exportDate": "2024-01-15T15:00:00Z"
}
```

**Uso:** API, automazioni, integrazioni

### 📈 Excel (.xlsx)
File Excel formattato con:
- Fogli multipli per tipo dato
- Formattazione professionale
- Grafici automatici
- Formule pre-impostate

**Uso:** Report aziendali, presentazioni

### 📕 PDF
Report professionale con:
- Header e footer
- Grafici e tabelle
- Firma digitale opzionale
- Watermark personalizzabile

**Uso:** Documentazione ufficiale, audit

### 📋 XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<reconciliation>
  <exportDate>2024-01-15T15:00:00Z</exportDate>
  <mode>hybrid</mode>
  <data>
    <entry>
      <sourceId>morningstar</sourceId>
      <timestamp>2024-01-15T14:30:00Z</timestamp>
      <status>success</status>
    </entry>
  </data>
</reconciliation>
```

**Uso:** Integrazioni enterprise, SOAP services

### 🗄️ SQL
```sql
-- Reconciliation Export
-- Generated: 2024-01-15T15:00:00Z
-- Mode: hybrid

CREATE TABLE reconciliation_data (
  id VARCHAR(255) PRIMARY KEY,
  source_id VARCHAR(255),
  timestamp TIMESTAMP,
  status VARCHAR(50)
);

INSERT INTO reconciliation_data VALUES 
  ('1', 'morningstar', '2024-01-15T14:30:00Z', 'success');
```

**Uso:** Database import, data warehouse

## API di Integrazione

### Configurazione Fonti
```typescript
interface DataSource {
  id: string
  name: string
  type: 'traditional' | 'onchain' | 'hybrid'
  category: 'bank' | 'broker' | 'crypto' | 'fund' | 'custom'
  url?: string
  apiEndpoint?: string
  credentials?: {
    apiKey?: string
    username?: string
    password?: string
  }
}
```

### Estrazione Dati
```typescript
async function extractData(
  mode: 'all' | 'selected',
  sources?: string[]
): Promise<ExtractedData[]>
```

### Riconciliazione
```typescript
async function reconcileData(
  mode: 'traditional' | 'onchain' | 'hybrid',
  options?: ReconciliationOptions
): Promise<ReconciliationResult>
```

### Export
```typescript
function exportData(
  format: 'csv' | 'json' | 'excel' | 'pdf' | 'xml' | 'sql',
  data: any,
  options?: ExportOptions
): void
```

## Configurazione Avanzata

### Proxy CORS
Per siti che bloccano richieste cross-origin:
```typescript
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
```

### Rate Limiting
```typescript
const rateLimits = {
  morningstar: { requests: 5, perSeconds: 60 },
  yahoo: { requests: 2000, perDay: 1 },
  etherscan: { requests: 5, perSeconds: 1 }
}
```

### Cache
```typescript
const cacheConfig = {
  ttl: 3600, // 1 ora
  maxSize: 100, // 100 richieste
  strategy: 'lru'
}
```

## Sicurezza

### Autenticazione
- API keys crittate
- OAuth 2.0 support
- 2FA per exchange
- Wallet signature per crypto

### Protezione Dati
- Nessun dato sensibile salvato
- HTTPS only
- CORS headers sicuri
- Rate limiting anti-abuse

### Audit Trail
- Log di tutte le operazioni
- Timestamp UTC
- IP tracking opzionale
- Export log completo

## Best Practices

### Estrazione
1. **Inizia con poche fonti** - Testa con 2-3 fonti prima di estrarre da tutte
2. **Usa la cache** - Evita richieste ridondanti
3. **Rispetta rate limits** - Non sovraccaricare le API
4. **Valida i dati** - Controlla che i dati estratti siano coerenti

### Riconciliazione
1. **Scegli la modalità giusta** - Tradizionale per banche, on-chain per crypto, ibrida per tutto
2. **Definisci soglie** - Accetta piccole differenze (< 0.01%)
3. **Documenta discrepanze** - Tieni traccia di tutte le differenze
4. **Automatizza** - Usa script per riconciliazioni periodiche

### Export
1. **Scegli il formato giusto** - CSV per Excel, JSON per API, PDF per report
2. **Comprimi file grandi** - Usa gzip per file > 10MB
3. **Versiona gli export** - Aggiungi timestamp ai filename
4. **Backup regolare** - Salva export in cloud storage

## Troubleshooting

### Fonti Non Connesse
1. Verifica credenziali API
2. Controlla connessione internet
3. Verifica rate limits
4. Controlla logs errori

### Dati Incompleti
1. Verifica permessi API
2. Controlla timeout richieste
3. Verifica formato dati atteso
4. Controlla proxy CORS

### Riconciliazione Fallita
1. Verifica saldi iniziali
2. Controlla transazioni mancanti
3. Verifica fee e commissioni
4. Controlla differenze valutarie

### Export Errori
1. Verifica permessi scrittura
2. Controlla spazio disco
3. Verifica formato dati
4. Controlla encoding caratteri

## Roadmap

### Prossime Funzionalità
- [ ] Supporto additional exchanges (Kraken, KuCoin, Huobi)
- [ ] Integrazione DeFi protocols (Aave, Uniswap, Compound)
- [ ] Supporto NFT tracking
- [ ] Multi-currency real-time conversion
- [ ] Automated reconciliation scheduling
- [ ] Advanced analytics and reporting
- [ ] Mobile app companion
- [ ] API REST pubblica

### Integrazioni Future
- [ ] Plaid per banche USA
- [ ] Tink per banche EU
- [ ] Coinbase Prime
- [ ] Binance Institutional
- [ ] Interactive Brokers API
- [ ] Bloomberg Terminal integration

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Produzione
