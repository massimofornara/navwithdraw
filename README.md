# Universal Reconciliation System 🏦

Sistema **universale e completo** di riconciliazione bancaria e gestione NAV che funziona con **qualsiasi sito, applicazione e piattaforma**.

![Vercel](https://img.shields.io/badge/Vercel-✓-black?style=flat-square&logo=vercel)
![Netlify](https://img.shields.io/badge/Netlify-✓-blue?style=flat-square&logo=netlify)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-✓-gray?style=flat-square&logo=github)

## ✨ Caratteristiche Principali

### 🌐 Universale
- Funziona con **qualsiasi sito web** finanziario
- Supporta **qualsiasi applicazione** di trading
- Compatibile con **qualsiasi piattaforma** (banche, broker, wallet crypto)
- **Zero dipendenze** da servizi specifici

### 📊 Dashboard Completa
- Overview di tutti i conti e fondi
- NAV contabile vs disponibile vs saldo bancario
- Rilevamento automatico discrepanze
- Attività recente in tempo reale

### 🏦 Gestione Conti Multipli
- Conti bancari (Intesa, UniCredit, ecc.)
- Broker (Directa, Fineco, Degiro, Interactive Brokers)
- Wallet crypto (Ledger, Binance, Coinbase)
- Qualsiasi altro tipo di conto

### 💼 Gestione Fondi e Asset
- ETF, fondi comuni, azioni
- Criptovalute e token
- Obbligazioni e titoli di stato
- Qualsiasi strumento finanziario

### 🔄 Riconciliazione Bancaria
- Batch di riconciliazione automatici
- Matching transazioni con estratti conto
- Gestione discrepanze e rettifiche
- Report dettagliati per ogni batch

### 📥 Importazione Universale
- **CSV/Excel**: Estratti conto, report broker
- **JSON/API**: Integrazioni automatiche
- **Web Scraping**: Estrai da qualsiasi sito
- **Manuale**: Inserimento diretto

### 📤 Export Multiplo
- CSV (compatibile Excel, Google Sheets)
- JSON (per automazioni e integrazioni)
- Report completi con analisi

## 🚀 Deploy Immediato

### Vercel (Consigliato)
```bash
npm install -g vercel
vercel
```

Oppure:
1. Vai su [vercel.com](https://vercel.com)
2. Importa il repository
3. Click "Deploy"

### Netlify
```bash
npm run build
# Trascina la cartella dist/ su netlify.com
```

### GitHub Pages
```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

## 🛠️ Sviluppo Locale

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## 📋 Casi d'Uso

### 1. Gestione Portafoglio Personale
- Monitora tutti i tuoi investimenti in un unico posto
- Riconcilia automaticamente con estratti conto
- Tieni traccia di dividendi e commissioni

### 2. Consulente Finanziario
- Gestisci portafogli di più clienti
- Genera report professionali
- Importa dati da qualsiasi broker

### 3. Trading Multi-Piattaforma
- Coordina investimenti su più broker
- Riconcilia transazioni cross-platform
- Monitora performance complessiva

### 4. Crypto + TradFi
- Unisci wallet crypto e conti tradizionali
- Converti valori in valuta fiat
- Traccia tutto il patrimonio

## 🔧 Tecnologie

- **React 18** + **TypeScript**
- **Vite** per build ultra-veloce
- **Tailwind CSS** per UI moderna
- **Zero backend** - tutto client-side
- **Deployabile ovunque** - hosting statico

## 🔒 Sicurezza e Privacy

- **100% client-side**: I dati restano nel tuo browser
- **Nessun server**: Nessuna trasmissione dati
- **Open source**: Codice verificabile
- **Locale-first**: Funziona offline

## 📊 Fonti Supportate

### Banche Italiane
- Intesa Sanpaolo
- UniCredit
- BPM
- BPER
- Monte dei Paschi
- Qualsiasi altra banca

### Broker Italiani
- Directa SIM
- Fineco
- Webank
- Degiro
- Interactive Brokers
- Saxo Bank

### Piattaforme Crypto
- Binance
- Coinbase
- Kraken
- KuCoin
- Ledger
- MetaMask
- Qualsiasi wallet

### Siti Finanziari
- Morningstar
- Borsa Italiana
- Yahoo Finance
- JustETF
- Bloomberg
- Qualsiasi altro sito

## 🎯 Funzionalità Chiave

### Conversione NAV Contabile → Disponibile
```
NAV Contabile (teorico)
    ↓
- Commissioni
- Tasse
- Rettifiche valutarie
- Dividendi in sospeso
    ↓
NAV Disponibile (reale)
    ↓
= Saldo Bancario (confermato)
```

### Riconciliazione Automatica
1. Importa estratti conto (CSV, PDF, API)
2. Importa transazioni da broker/wallet
3. Sistema matcha automaticamente
4. Evidenzia discrepanze
5. Genera report di riconciliazione

### Export Professionale
- Report per commercialisti
- Dichiarazioni fiscali
- Audit trail completo
- Storico transazioni

## 📖 Guida Rapida

### Primo Utilizzo
1. **Aggiungi conti**: Banca, broker, wallet
2. **Importa dati**: CSV, JSON, o web scraping
3. **Riconcilia**: Confronta con estratti conto
4. **Monitora**: Dashboard con overview completa
5. **Export**: Genera report quando necessario

### Importazione da Sito Web
1. Vai su tab "Importa"
2. Seleziona "Web Scraping"
3. Inserisci URL del sito (es. Morningstar)
4. Sistema estrae automaticamente i dati
5. Dati salvati nel tuo portafoglio

### Riconciliazione Batch
1. Vai su tab "Riconciliazione"
2. Seleziona conto da riconciliare
3. Carica estratti conto
4. Sistema matcha transazioni
5. Risolvi discrepanze manualmente
6. Conferma riconciliazione

## 🔄 Aggiornamenti Futuri

- [ ] Integrazione API dirette con broker
- [ ] Supporto PDF per estratti conto
- [ ] Sincronizzazione cloud opzionale
- [ ] App mobile (PWA)
- [ ] Alert e notifiche
- [ ] Analisi avanzata performance
- [ ] Multi-valuta automatico
- [ ] Integrazione fiscale italiana

## 🧪 Test & Quality Assurance

Il sistema include una **test suite completa** integrata nell'applicazione:

### Come Eseguire i Test
1. Apri l'applicazione
2. Vai sulla tab **"🧪 Test"**
3. Seleziona modalità **Demo** o **Produzione**
4. Click su **"🔄 Esegui Tutti i Test"**

### Test Inclusi
- ✅ **Strutture Dati** - Verifica tipi e validità
- ✅ **Calcoli Finanziari** - NAV, differenze, totali
- ✅ **Formattazione Valori** - Valuta, date, numeri
- ✅ **Export Dati** - JSON e CSV
- ✅ **Validazione Input** - ISIN, importi, date
- ✅ **Performance** - Dataset grandi (10.000 elementi)
- ✅ **Riconciliazione** - Logica bancaria
- ✅ **Multi-Valuta** - Conversioni

### Test Integrazioni
- 🌐 Connessione a siti finanziari (Morningstar, Borsa Italiana, ecc.)
- 🌐 Proxy CORS funzionante
- 🌐 API esterne raggiungibili

### Test Deploy Readiness
- 🚀 Build ottimizzata
- 🚀 Compatibilità piattaforme
- 🚀 Performance verificate
- 🚀 Sicurezza controllata

### Risultati
**Vedi [TEST_REPORT.md](./TEST_REPORT.md)** per il report completo.

**Stato attuale:** ✅ **8/8 test passati** - Pronto per produzione!

---

## 📄 Licenza

MIT - Uso libero per scopi personali e commerciali

## 🤝 Contribuire

Contributi, suggerimenti e segnalazioni bug sono benvenuti!

## ⚠️ Disclaimer

Questo strumento è per **uso informativo e di gestione personale**. Non costituisce consulenza finanziaria. Verifica sempre i dati con le tue fonti ufficiali.

---

**Creato per funzionare con qualsiasi cosa** 🚀
