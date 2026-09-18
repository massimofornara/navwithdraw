# NAV Reconciliation System 🏦

Sistema professionale di **riconciliazione bancaria e gestione NAV** per trasformare il valore contabile in disponibilità liquide effettive.

![Vercel](https://img.shields.io/badge/Vercel-✓-black?style=flat-square&logo=vercel)
![Netlify](https://img.shields.io/badge/Netlify-✓-blue?style=flat-square&logo=netlify)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-✓-gray?style=flat-square&logo=github)

## ✨ Funzionalità

### 📊 Dashboard
- Overview completa del portafoglio fondi
- NAV contabile vs disponibile vs saldo bancario
- Rilevamento automatico delle differenze
- Stato di riconciliazione per ogni fondo

### 🔄 Riconciliazione Bancaria
- Processo guidato in 4 step
- Gestione voci di riconciliazione (dividendi, commissioni, rettifiche)
- Confronto NAV contabile con saldo bancario
- Conferma riconciliazione con un click

### 💱 Conversione NAV
- Trasformazione NAV da contabile a disponibile
- Gestione multi-fondo
- Calcolo automatico delle differenze
- Aggiornamento in tempo reale

### 📄 Report
- Report di riconciliazione dettagliati
- Storico delle operazioni
- Export dei dati
- Analisi delle discrepanze

## 🚀 Deploy Rapido

### Vercel (Consigliato)
```bash
npm install -g vercel
vercel
```

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
npm install
npm run dev
npm run build
```

## 📋 Processo di Riconciliazione

1. **Identifica le differenze** tra NAV contabile e saldo bancario
2. **Analizza le voci** (dividendi, commissioni, rettifiche valutarie)
3. **Registra le rettifiche** per allineare i valori
4. **Conferma la riconciliazione** quando NAV Disponibile = Saldo Bancario

## 🔧 Tecnologie

- **React** + **TypeScript**
- **Vite** per il build
- **Tailwind CSS** per lo stile
- Deployabile su qualsiasi hosting statico

## 📄 Licenza

MIT
