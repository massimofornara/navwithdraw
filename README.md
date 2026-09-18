# NAV Extractor 🏦

Estrai il **NAV (Net Asset Value)** da qualsiasi sito web finanziario. Applicazione universale deployabile su qualsiasi piattaforma di hosting statico.

![Vercel](https://img.shields.io/badge/Vercel-✓-black?style=flat-square&logo=vercel)
![Netlify](https://img.shields.io/badge/Netlify-✓-blue?style=flat-square&logo=netlify)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-✓-gray?style=flat-square&logo=github)

## ✨ Funzionalità

- 🔍 **Estrazione automatica** dei NAV da qualsiasi sito web
- 🌐 **Proxy CORS integrato** per superare le restrizioni
- 📊 **Export multiplo** (CSV, JSON, copia negli appunti)
- 📜 **Cronologia** delle estrazioni
- 📱 **Responsive** - funziona su desktop e mobile
- 🚀 **Deploy ovunque** - Vercel, Netlify, GitHub Pages

## 🚀 Deploy Rapido

### Vercel (Consigliato)

```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Oppure:
1. Vai su [vercel.com](https://vercel.com)
2. Importa il repository GitHub
3. Click "Deploy" - fatto!

### Netlify

```bash
# Build
npm run build

# Deploy con Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Oppure:
1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella `dist/` nella dashboard
3. Fatto!

### GitHub Pages

```bash
# Build
npm run build

# Crea un branch gh-pages
git subtree push --prefix dist origin gh-pages
```

Oppure:
1. Vai su Settings → Pages del tuo repository
2. Seleziona il branch `gh-pages`
3. Il sito sarà disponibile su `https://username.github.io/repo-name`

## 🛠️ Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview della build
npm run preview
```

## 📋 Come Usare

1. Inserisci l'URL del sito con i dati NAV (es. Morningstar, Borsa Italiana)
2. Attiva il proxy CORS se necessario
3. Click "Estrai NAV"
4. I risultati vengono mostrati con nome, valore, valuta e data
5. Esporta in CSV/JSON o copia negli appunti

## 🔧 Tecnologie

- **React** + **TypeScript**
- **Vite** per il build
- **Tailwind CSS** per lo stile
- **DOMParser** per il parsing HTML
- **Proxy CORS** (allorigins.win) per bypassare restrizioni

## ⚠️ Note

- Il proxy CORS pubblico potrebbe avere limiti di utilizzo
- Alcuni siti potrebbero bloccare l'accesso anche con il proxy
- Per uso professionale, considera API ufficiali (Morningstar, Bloomberg)
- Rispetta sempre i Terms of Service dei siti che analizzi

## 📄 Licenza

MIT
