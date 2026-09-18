import { useState } from 'react'

type Method = {
  id: string
  title: string
  icon: string
  difficulty: string
  speed: string
  description: string
  code: string
  pros: string[]
  cons: string[]
}

const methods: Method[] = [
  {
    id: 'api',
    title: 'API Ufficiali',
    icon: '🔌',
    difficulty: 'Facile',
    speed: '< 1 sec',
    description: 'Molti provider (Morningstar, Bloomberg, ecc.) offrono API REST per ottenere i NAV in tempo reale o con ritardo controllato.',
    code: `// Esempio con fetch API
async function getNAV(fundISIN: string) {
  const response = await fetch(
    \`https://api.provider.com/v1/funds/\${fundISIN}/nav\`,
    {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  return {
    nav: data.nav,
    date: data.date,
    currency: data.currency
  };
}

// Uso
const result = await getNAV('IE00B4L5Y562');
console.log(\`NAV: €\${result.nav} del \${result.date}\`);`,
    pros: ['Dati ufficiali e certificati', 'Formato strutturato (JSON)', 'Aggiornamenti in tempo reale', 'Nessun parsing necessario'],
    cons: ['Spesso a pagamento', 'Richiede registrazione', 'Limiti di rate']
  },
  {
    id: 'scraping',
    title: 'Web Scraping (Python)',
    icon: '🕷️',
    difficulty: 'Medio',
    speed: '2-5 sec',
    description: 'Usare BeautifulSoup o Selenium per estrarre i NAV direttamente dalle pagine HTML dei siti dei fondi.',
    code: `import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_nav(url: str) -> dict:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Esempio: estrarre da una tabella NAV
    table = soup.find('table', class_='nav-table')
    rows = table.find_all('tr')[1:]  # Skip header
    
    data = []
    for row in rows:
        cols = row.find_all('td')
        data.append({
            'date': cols[0].text.strip(),
            'nav': float(cols[1].text.strip().replace(',', '.')),
            'currency': cols[2].text.strip()
        })
    
    return pd.DataFrame(data)

# Uso
df = scrape_nav('https://www.fundsite.com/fund/NAV-history')
print(df.head())`,
    pros: ['Gratuito', 'Flessibile', 'Funziona con qualsiasi sito'],
    cons: ['Fragile (cambia con il layout)', 'Potrebbe violare i ToS', 'Lento per grandi volumi']
  },
  {
    id: 'selenium',
    title: 'Selenium (Siti Dinamici)',
    icon: '🤖',
    difficulty: 'Medio-Alto',
    speed: '5-10 sec',
    description: 'Per siti che caricano i NAV via JavaScript. Selenium simula un browser reale per ottenere i dati dopo il rendering.',
    code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def get_nav_dynamic(url: str) -> str:
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    
    driver = webdriver.Chrome(
        ChromeDriverManager().install(),
        options=options
    )
    
    driver.get(url)
    
    # Attendi che il NAV sia caricato
    nav_element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, '.nav-value')
        )
    )
    
    nav = nav_element.text
    driver.quit()
    return nav

# Uso
nav = get_nav_dynamic('https://fundsite.com/dynamic-page')
print(f"NAV attuale: {nav}")`,
    pros: ['Funziona con siti JavaScript', 'Simula comportamento utente', 'Può gestire login'],
    cons: ['Molto più lento', 'Richiede più risorse', 'Complesso da mantenere']
  },
  {
    id: 'rss',
    title: 'Feed RSS / XML',
    icon: '📡',
    difficulty: 'Facile',
    speed: '< 2 sec',
    description: 'Alcuni provider pubblicano i NAV tramite feed RSS o file XML. Metodo veloce e affidabile.',
    code: `import feedparser
import xml.etree.ElementTree as ET

# Metodo 1: RSS Feed
def get_nav_from_rss(feed_url: str):
    feed = feedparser.parse(feed_url)
    
    latest = feed.entries[0]
    return {
        'title': latest.title,
        'nav': latest.description,
        'published': latest.published
    }

# Metodo 2: File XML diretto
def parse_nav_xml(xml_url: str):
    import requests
    response = requests.get(xml_url)
    root = ET.fromstring(response.content)
    
    funds = []
    for fund in root.findall('.//fund'):
        funds.append({
            'isin': fund.find('isin').text,
            'name': fund.find('name').text,
            'nav': float(fund.find('nav').text),
            'date': fund.find('date').text
        })
    return funds

# Uso
data = get_nav_from_rss('https://provider.com/nav-feed.xml')
print(data)`,
    pros: ['Molto veloce', 'Dati strutturati', 'Facile da parsare'],
    cons: ['Non tutti i siti lo offrono', 'Aggiornamenti meno frequenti', 'Formato variabile']
  },
  {
    id: 'puppeteer',
    title: 'Puppeteer (Node.js)',
    icon: '🎭',
    difficulty: 'Medio',
    speed: '3-7 sec',
    description: 'Alternativa moderna a Selenium per il browser headless in JavaScript/TypeScript. Ideale per integrazioni web.',
    code: `const puppeteer = require('puppeteer');

async function scrapeNAV(url: string) {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();
  
  // Imposta user agent realistico
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'
  );
  
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });
  
  // Estrai i NAV dalla pagina
  const navData = await page.evaluate(() => {
    const rows = document.querySelectorAll('.nav-row');
    return Array.from(rows).map(row => ({
      date: row.querySelector('.date')?.textContent,
      nav: parseFloat(
        row.querySelector('.value')?.textContent || '0'
      ),
      change: row.querySelector('.change')?.textContent
    }));
  });
  
  await browser.close();
  return navData;
}

// Uso
const data = await scrapeNAV('https://fundsite.com/nav');
console.table(data);`,
    pros: ['Eccellente per siti SPA', 'API moderna e pulita', 'Buona community'],
    cons: ['Richiede Chromium', 'Consuma memoria', 'Debug complesso']
  },
  {
    id: 'csv',
    title: 'Download CSV/Excel',
    icon: '📊',
    difficulty: 'Molto Facile',
    speed: '1-3 sec',
    description: 'Molti siti di fondi permettono di scaricare lo storico NAV in formato CSV o Excel. Automatizza il download.',
    code: `import requests
import pandas as pd
from io import StringIO

def download_nav_csv(url: str) -> pd.DataFrame:
    """Scarica e parsare un CSV di NAV"""
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    
    response = requests.get(url, headers=headers)
    response.encoding = 'utf-8'
    
    # Parsa il CSV
    df = pd.read_csv(
        StringIO(response.text),
        sep=';',  # o ',' a seconda del formato
        decimal=',',
        thousands='.',
        parse_dates=['Data'],
        dayfirst=True
    )
    
    # Pulisci i dati
    df = df.rename(columns={
        'Data': 'date',
        'NAV': 'nav',
        'Valuta': 'currency'
    })
    
    df['nav'] = pd.to_numeric(df['nav'], errors='coerce')
    df = df.dropna(subset=['nav'])
    
    return df.sort_values('date', ascending=False)

# Uso
df = download_nav_csv(
    'https://fundsite.com/export/nav-history.csv'
)
print(f"Ultimo NAV: €{df.iloc[0]['nav']}")
print(f"Totale record: {len(df)}")`,
    pros: ['Semplicissimo', 'Dati completi', 'Facile da analizzare'],
    cons: ['Non in tempo reale', 'Download manuale o semi-automatico', 'Formato variabile']
  }
]

function App() {
  const [selectedMethod, setSelectedMethod] = useState<string>('api')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const currentMethod = methods.find(m => m.id === selectedMethod)!

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold">
              €
            </div>
            <div>
              <h1 className="text-xl font-bold">NAV Scraper Guide</h1>
              <p className="text-xs text-slate-400">Come prelevare i NAV in pochi secondi</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Guida Interattiva
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Intro Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Come prelevare i <span className="text-emerald-400">NAV</span> da un sito web
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              Il <strong>NAV (Net Asset Value)</strong> è il valore della quota di un fondo comune. 
              Ecco i 6 metodi più veloci per estrarlo automaticamente dai siti web, 
              ordinati dal più semplice al più complesso.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm">⚡ Veloce</span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm">🔒 Affidabile</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">💡 Esempi Pratici</span>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold mb-1">1. Identifica la Fonte</h3>
            <p className="text-sm text-slate-400">Trova dove il sito pubblica i NAV: API, pagina HTML, CSV o feed RSS.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="font-semibold mb-1">2. Scegli il Metodo</h3>
            <p className="text-sm text-slate-400">API se disponibile, altrimenti scraping. Usa DevTools del browser per analizzare.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold mb-1">3. Automatizza</h3>
            <p className="text-sm text-slate-400">Cron job, script schedulati o webhook per aggiornamenti automatici.</p>
          </div>
        </section>

        {/* Method Selector */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Scegli un metodo:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedMethod === method.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-medium text-sm">{method.title}</div>
                <div className="text-xs text-slate-400 mt-1">{method.speed}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Method Detail */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="text-3xl mb-3">{currentMethod.icon}</div>
              <h3 className="text-xl font-bold mb-2">{currentMethod.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {currentMethod.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300">
                  ⏱ {currentMethod.speed}
                </span>
                <span className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300">
                  📊 {currentMethod.difficulty}
                </span>
              </div>
            </div>

            {/* Pros */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <h4 className="font-semibold text-emerald-400 mb-3 text-sm uppercase tracking-wide">✅ Vantaggi</h4>
              <ul className="space-y-2">
                {currentMethod.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <h4 className="font-semibold text-red-400 mb-3 text-sm uppercase tracking-wide">⚠️ Svantaggi</h4>
              <ul className="space-y-2">
                {currentMethod.cons.map((con, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Panel */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  </div>
                  <span className="text-xs text-slate-400 ml-2">
                    {currentMethod.id === 'api' || currentMethod.id === 'puppeteer' ? 'javascript' : 'python'}
                  </span>
                </div>
                <button
                  onClick={() => copyCode(currentMethod.code, currentMethod.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  {copiedCode === currentMethod.id ? (
                    <>
                      <span className="text-emerald-400">✓</span> Copiato!
                    </>
                  ) : (
                    <>
                      <span>📋</span> Copia
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-slate-300">
                  {currentMethod.code.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-slate-600 select-none w-8 text-right mr-4 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className={getLineColor(line)}>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">💡 Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h4 className="font-semibold text-cyan-400 mb-2">🕐 Rispetta i Rate Limits</h4>
              <p className="text-sm text-slate-400">Aggiungi delay tra le richieste (minimo 1-2 secondi) per non sovraccaricare il server.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h4 className="font-semibold text-cyan-400 mb-2">📜 Leggi i Terms of Service</h4>
              <p className="text-sm text-slate-400">Verifica sempre che lo scraping sia consentito dal sito. Molti provider finanziari lo vietano.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h4 className="font-semibold text-cyan-400 mb-2">🔄 Implementa Retry Logic</h4>
              <p className="text-sm text-slate-400">Usa exponential backoff per gestire errori temporanei e timeout.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h4 className="font-semibold text-cyan-400 mb-2">💾 Cache i Risultati</h4>
              <p className="text-sm text-slate-400">I NAV cambiano 1 volta al giorno. Cache per 24h per ridurre richieste inutili.</p>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="mt-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-amber-300 mb-1">Nota Legale Importante</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Lo scraping di dati finanziari può violare i termini di servizio dei siti web e le normative sul copyright. 
                Per uso professionale, utilizza sempre le API ufficiali o accordi di licenza dati con i provider 
                (es. Morningstar, Bloomberg, Refinitiv). I dati NAV sono spesso protetti da diritti di proprietà intellettuale.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          Guida educativa • I codici sono esempi da adattare al caso specifico
        </div>
      </footer>
    </div>
  )
}

function getLineColor(line: string): string {
  if (line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return 'text-slate-500 italic'
  }
  if (line.includes('import') || line.includes('from') || line.includes('require') || line.includes('const') || line.includes('let') || line.includes('async') || line.includes('function') || line.includes('def ')) {
    return 'text-purple-300'
  }
  if (line.includes('return') || line.includes('await') || line.includes('print')) {
    return 'text-cyan-300'
  }
  if (line.includes("'") || line.includes('"') || line.includes('`')) {
    return 'text-emerald-300'
  }
  return 'text-slate-300'
}

export default App
