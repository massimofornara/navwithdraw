import { useState } from 'react'

type Method = {
  id: string
  title: string
  icon: string
  difficulty: string
  speed: string
  description: string
  code: string
  language: string
  pros: string[]
  cons: string[]
}

const methods: Method[] = [
  {
    id: 'console',
    title: 'Browser Console',
    icon: '💻',
    difficulty: 'Facile',
    speed: '5 secondi',
    description: 'Il metodo più veloce: apri DevTools (F12), vai nella Console e incolla il codice JavaScript. Estrae immediatamente tutti i link di navigazione.',
    language: 'javascript',
    code: `// 1. Apri DevTools (F12) → Console
// 2. Incolla questo codice e premi Invio

// === METODO COMPLETO ===
function extractAllNav() {
  const result = { navbars: [], allLinks: [] };
  
  // Trova tutti gli elementi di navigazione
  const navElements = document.querySelectorAll(
    'nav, [role="navigation"], .navbar, .nav, .menu, header'
  );
  
  navElements.forEach((nav, index) => {
    const links = [];
    nav.querySelectorAll('a[href]').forEach(a => {
      links.push({
        text: a.textContent.trim(),
        href: a.href,
        // Trova il sottomenu genitore
        parent: a.closest('li')?.parentElement?.closest('li')
          ?.querySelector('a')?.textContent?.trim() || null
      });
    });
    
    result.navbars.push({
      id: index,
      class: nav.className,
      linksCount: links.length,
      links: links
    });
  });
  
  // Tutti i link unici della pagina
  const allLinks = [...new Set(
    [...document.querySelectorAll('a[href]')].map(a => a.href)
  )];
  result.allLinks = allLinks;
  
  return result;
}

// Esegui e copia il risultato
const data = extractAllNav();
console.log(data);
copy(JSON.stringify(data, null, 2));
console.log('✅ Copiato negli appunti!');`,
    pros: ['Immediato, nessun setup', 'Funziona su qualsiasi sito', 'Risultato copiabile'],
    cons: ['Solo per uso manuale', 'Non automatizzabile', 'Una pagina alla volta']
  },
  {
    id: 'bookmarklet',
    title: 'Bookmarklet',
    icon: '🔖',
    difficulty: 'Facile',
    speed: '3 secondi',
    description: 'Crea un segnalibro con codice JavaScript. Cliccalo su qualsiasi pagina per estrarre istantaneamente tutta la navigazione.',
    language: 'javascript',
    code: `// Crea un nuovo segnalibro con questo URL:
// (tutto su una riga, senza spazi)

javascript:(function(){
  var nav=document.querySelectorAll('nav a, .navbar a, [role="navigation"] a, .menu a');
  var links=[];
  nav.forEach(function(a){
    if(a.href && a.textContent.trim()){
      links.push(a.textContent.trim()+' → '+a.href);
    }
  });
  
  // Mostra risultati in un popup
  var w=window.open('','_blank');
  w.document.write(
    '<h1>Navbar Links ('+links.length+')</h1>'+
    '<style>body{font-family:monospace;padding:20px}a{display:block;margin:5px 0;color:#0066cc}</style>'+
    '<p><strong>Totale link trovati:</strong> '+links.length+'</p>'+
    '<hr>'+
    links.map(function(l){
      var parts=l.split(' → ');
      return '<a href="'+parts[1]+'" target="_blank">'+parts[0]+'</a> <small>'+parts[1]+'</small>';
    }).join('<br>')
  );
})();

// === COME USARLO ===
// 1. Aggiungi un nuovo segnalibro nel browser
// 2. Nel campo URL incolla il codice sopra
// 3. Nomina il segnalibro "Estrai NAV"
// 4. Vai su qualsiasi sito e clicca il segnalibro
// 5. Si aprirà una nuova finestra con tutti i link!`,
    pros: ['Riutilizzabile su ogni sito', 'Un click e fatto', 'Nessun software da installare'],
    cons: ['Limitato alla pagina corrente', 'Non salva in file', 'Alcuni siti lo bloccano']
  },
  {
    id: 'python',
    title: 'Python + BeautifulSoup',
    icon: '🐍',
    difficulty: 'Medio',
    speed: '10-30 secondi',
    description: 'Script Python completo che scarica la pagina, estrae tutta la struttura di navigazione e la salva in JSON o CSV.',
    language: 'python',
    code: `import requests
from bs4 import BeautifulSoup
import json
import csv
from urllib.parse import urljoin

def extract_nav(url: str, output_format: str = 'json') -> dict:
    """
    Estrae TUTTA la navigazione da un sito web.
    
    Args:
        url: URL del sito da analizzare
        output_format: 'json' o 'csv'
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    result = {
        'url': url,
        'navbars': [],
        'all_nav_links': [],
        'structure': {}
    }
    
    # 1. Trova tutti i <nav>
    navs = soup.find_all('nav')
    for i, nav in enumerate(navs):
        nav_data = {
            'index': i,
            'class': nav.get('class', []),
            'id': nav.get('id', ''),
            'links': []
        }
        
        for a in nav.find_all('a', href=True):
            href = urljoin(url, a['href'])
            nav_data['links'].append({
                'text': a.get_text(strip=True),
                'href': href,
                'depth': len(a.find_parents('ul')),
                'has_submenu': bool(a.find_next('ul'))
            })
        
        result['navbars'].append(nav_data)
    
    # 2. Trova menu in header/footer
    for selector in ['header', 'footer', '[role="navigation"]', '.menu', '.navbar']:
        elements = soup.select(selector)
        for el in elements:
            links = el.find_all('a', href=True)
            if links:
                result['all_nav_links'].extend([
                    {
                        'text': a.get_text(strip=True),
                        'href': urljoin(url, a['href']),
                        'source': selector
                    }
                    for a in links if a.get_text(strip=True)
                ])
    
    # 3. Rimuovi duplicati
    seen = set()
    unique_links = []
    for link in result['all_nav_links']:
        if link['href'] not in seen:
            seen.add(link['href'])
            unique_links.append(link)
    result['all_nav_links'] = unique_links
    
    # 4. Salva il risultato
    if output_format == 'json':
        with open('navbar_data.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"✅ Salvato in navbar_data.json")
    
    elif output_format == 'csv':
        with open('navbar_links.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['text', 'href', 'source'])
            writer.writeheader()
            writer.writerows(result['all_nav_links'])
        print(f"✅ Salvato in navbar_links.csv")
    
    # Summary
    print(f"\\n📊 RIEPILOGO:")
    print(f"   Navbar trovate: {len(result['navbars'])}")
    print(f"   Link totali: {len(result['all_nav_links'])}")
    print(f"   Link unici: {len(seen)}")
    
    return result

# === USO ===
data = extract_nav('https://www.esempio.com', 'json')

# Per vedere la struttura ad albero:
for nav in data['navbars']:
    print(f"\\n🔹 Navbar #{nav['index']} ({nav['class']})")
    for link in nav['links']:
        indent = "  " * link['depth']
        print(f"   {indent}├─ {link['text']} → {link['href']}")`,
    pros: ['Estrazione completa', 'Salva in JSON/CSV', 'Automatizzabile', 'Gestisce URL relativi'],
    cons: ['Richiede Python installato', 'Non gestisce JS dinamico', 'Setup iniziale necessario']
  },
  {
    id: 'puppeteer',
    title: 'Puppeteer (Siti JS)',
    icon: '🎭',
    difficulty: 'Medio-Alto',
    speed: '15-45 secondi',
    description: 'Per siti che caricano la navigazione tramite JavaScript (React, Vue, Angular). Puppeteer aspetta il rendering completo prima di estrarre.',
    language: 'javascript',
    code: `const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractFullNavbar(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Imposta viewport desktop
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Naviga e attendi il caricamento completo
  await page.goto(url, {
    waitUntil: 'networkidle0',  // Aspetta che tutte le richieste finiscano
    timeout: 30000
  });
  
  // Attendi che la navbar sia visibile
  await page.waitForSelector('nav, .navbar, [role="navigation"]', {
    timeout: 10000
  }).catch(() => console.log('⚠️ Nessun elemento nav trovato'));
  
  // Estrai la struttura completa
  const navData = await page.evaluate(() => {
    function extractLinks(container) {
      const items = [];
      const links = container.querySelectorAll(':scope > li > a, :scope > a');
      
      links.forEach(link => {
        const item = {
          text: link.textContent.trim(),
          href: link.href,
          children: []
        };
        
        // Trova sottomenu
        const parentLi = link.closest('li');
        const subMenu = parentLi?.querySelector('ul, .submenu, .dropdown-menu');
        if (subMenu) {
          item.children = extractLinks(subMenu);
        }
        
        items.push(item);
      });
      
      return items;
    }
    
    // Raccogli tutte le navbar
    const navbars = document.querySelectorAll(
      'nav, [role="navigation"], .navbar, .main-menu, .site-navigation'
    );
    
    return Array.from(navbars).map((nav, i) => ({
      id: i,
      classes: nav.className,
      ariaLabel: nav.getAttribute('aria-label'),
      structure: extractLinks(nav),
      totalLinks: nav.querySelectorAll('a').length
    }));
  });
  
  // Intercepta anche le chiamate API per la nav
  const interceptedRequests = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('menu') || url.includes('nav') || url.includes('sitemap')) {
      try {
        const contentType = response.headers()['content-type'];
        if (contentType?.includes('json')) {
          const data = await response.json();
          interceptedRequests.push({ url, data });
        }
      } catch (e) {}
    }
  });
  
  await browser.close();
  
  // Salva risultato
  const result = {
    url,
    timestamp: new Date().toISOString(),
    navbars: navData,
    apiEndpoints: interceptedRequests
  };
  
  fs.writeFileSync('navbar_complete.json', JSON.stringify(result, null, 2));
  console.log('✅ Navbar completa salvata in navbar_complete.json');
  console.log(\`   Navbar trovate: \${navData.length}\`);
  console.log(\`   API endpoints: \${interceptedRequests.length}\`);
  
  return result;
}

// === USO ===
extractFullNavbar('https://www.sito-esempio.com');`,
    pros: ['Gestisce siti JavaScript', 'Cattura menu dinamici', 'Intercetta API della navbar', 'Struttura ad albero completa'],
    cons: ['Più lento', 'Richiede Chromium', 'Consuma più risorse']
  },
  {
    id: 'chrome-ext',
    title: 'Chrome Extension',
    icon: '🧩',
    difficulty: 'Medio',
    speed: '2 secondi',
    description: 'Crea una piccola estensione Chrome che con un click estrae la navigazione di qualsiasi sito e la esporta.',
    language: 'javascript',
    code: `// === FILE: manifest.json ===
{
  "manifest_version": 3,
  "name": "NAV Extractor",
  "version": "1.0",
  "permissions": ["activeTab", "downloads"],
  "action": {
    "default_popup": "popup.html"
  }
}

// === FILE: popup.html ===
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 15px; font-family: sans-serif; }
    button { width: 100%; padding: 10px; background: #4CAF50; color: white;
             border: none; border-radius: 5px; cursor: pointer; margin: 5px 0; }
    button:hover { background: #45a049; }
    #result { margin-top: 10px; font-size: 12px; max-height: 200px; overflow: auto; }
  </style>
</head>
<body>
  <h3>🔗 NAV Extractor</h3>
  <button id="extract">Estrai Navigazione</button>
  <button id="download">📥 Scarica JSON</button>
  <div id="result"></div>
  <script src="popup.js"></script>
</body>
</html>

// === FILE: popup.js ===
let extractedData = null;

document.getElementById('extract').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true });
  
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const navs = document.querySelectorAll(
        'nav, [role="navigation"], .navbar, .menu, header nav'
      );
      
      const data = Array.from(navs).map((nav, i) => {
        const links = Array.from(nav.querySelectorAll('a[href]')).map(a => ({
          text: a.textContent.trim(),
          href: a.href,
          level: a.closest('ul')?.closest('ul') ? 2 : 1
        }));
        
        return { id: i, links, total: links.length };
      });
      
      return { url: location.href, navs: data };
    }
  });
  
  extractedData = result.result;
  const total = extractedData.navs.reduce((sum, n) => sum + n.total, 0);
  document.getElementById('result').innerHTML = 
    \`<p>✅ <strong>\${total}</strong> link trovati in <strong>\${extractedData.navs.length}</strong> navbar</p>\`;
});

document.getElementById('download').addEventListener('click', () => {
  if (!extractedData) return alert('Prima estrai i dati!');
  
  const blob = new Blob([JSON.stringify(extractedData, null, 2)], 
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename: \`navbar_\${new Date().toISOString().slice(0,10)}.json\`
  });
});

// === INSTALLAZIONE ===
// 1. Crea una cartella con i 3 file sopra
// 2. Chrome → chrome://extensions → Modalità sviluppatore
// 3. "Carica estensione non pacchettizzata" → seleziona la cartella
// 4. Clicca l'icona dell'estensione su qualsiasi sito!`,
    pros: ['Sempre disponibile nel browser', 'Un click per estrarre', 'Esporta direttamente in JSON'],
    cons: ['Richiede setup iniziale', 'Solo Chrome/Edge', 'Limitato alla pagina attiva']
  },
  {
    id: 'sitemap',
    title: 'Sitemap + Crawl',
    icon: '🗺️',
    difficulty: 'Avanzato',
    speed: '1-5 minuti',
    description: 'Metodo completo: combina sitemap.xml, navigazione HTML e crawling per ottenere TUTTI i link del sito, non solo la navbar.',
    language: 'python',
    code: `import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
from collections import defaultdict
import xml.etree.ElementTree as ET

class CompleteNavExtractor:
    """Estrae la navigazione COMPLETA di un sito web"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.domain = urlparse(base_url).netloc
        self.all_links = set()
        self.nav_structure = defaultdict(list)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; NavBot/1.0)'
        }
    
    def extract_sitemap(self) -> list:
        """1. Estrai link dalla sitemap.xml"""
        sitemap_urls = [
            f'{self.base_url}/sitemap.xml',
            f'{self.base_url}/sitemap_index.xml',
        ]
        
        links = []
        for sitemap_url in sitemap_urls:
            try:
                r = requests.get(sitemap_url, headers=self.headers, timeout=10)
                if r.status_code == 200:
                    root = ET.fromstring(r.content)
                    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
                    
                    for url in root.findall('.//s:url/s:loc', ns):
                        links.append(url.text)
                    for url in root.findall('.//loc'):
                        if url.text:
                            links.append(url.text)
                    
                    print(f"✅ Sitemap: {len(links)} URL trovati")
            except:
                pass
        
        return links
    
    def extract_navbar(self, url: str) -> dict:
        """2. Estrai la struttura navbar da una pagina"""
        r = requests.get(url, headers=self.headers, timeout=10)
        soup = BeautifulSoup(r.text, 'html.parser')
        
        nav_data = {'navbars': [], 'links': []}
        
        # Cerca navbar
        for nav in soup.find_all(['nav', 'header']):
            links = []
            for a in nav.find_all('a', href=True):
                href = urljoin(url, a['href'])
                if self.domain in urlparse(href).netloc:
                    links.append({
                        'text': a.get_text(strip=True),
                        'href': href,
                        'depth': len(a.find_parents(['ul', 'div']))
                    })
                    self.all_links.add(href)
            
            if links:
                nav_data['navbars'].append({
                    'tag': nav.name,
                    'class': nav.get('class', []),
                    'links': links
                })
        
        return nav_data
    
    def crawl_links(self, max_pages: int = 50) -> set:
        """3. Crawla le pagine per trovare più link"""
        to_visit = {self.base_url}
        visited = set()
        
        while to_visit and len(visited) < max_pages:
            url = to_visit.pop()
            if url in visited:
                continue
            
            try:
                r = requests.get(url, headers=self.headers, timeout=10)
                soup = BeautifulSoup(r.text, 'html.parser')
                visited.add(url)
                
                for a in soup.find_all('a', href=True):
                    href = urljoin(url, a['href'])
                    parsed = urlparse(href)
                    
                    # Solo link interni
                    if parsed.netloc == self.domain and '#' not in href:
                        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
                        self.all_links.add(clean_url)
                        
                        if clean_url not in visited:
                            to_visit.add(clean_url)
                
            except Exception as e:
                print(f"⚠️ Errore su {url}: {e}")
        
        return self.all_links
    
    def run_full_extraction(self) -> dict:
        """Esecuzione completa"""
        print(f"🔍 Analisi completa di: {self.base_url}\\n")
        
        # Step 1: Sitemap
        print("📋 Step 1: Sitemap...")
        sitemap_links = self.extract_sitemap()
        self.all_links.update(sitemap_links)
        
        # Step 2: Navbar della homepage
        print("🧭 Step 2: Navbar principale...")
        nav_data = self.extract_navbar(self.base_url)
        
        # Step 3: Crawl
        print("🕷️ Step 3: Crawling pagine interne...")
        crawled = self.crawl_links(max_pages=30)
        
        # Risultato finale
        result = {
            'domain': self.domain,
            'total_unique_links': len(self.all_links),
            'navbar_structure': nav_data,
            'all_pages': sorted(list(self.all_links)),
            'source': {
                'sitemap': len(sitemap_links),
                'crawled': len(crawled)
            }
        }
        
        # Salva
        with open('full_navigation.json', 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"\\n✅ COMPLETATO!")
        print(f"   Link totali: {result['total_unique_links']}")
        print(f"   Salvato in: full_navigation.json")
        
        return result

# === USO ===
extractor = CompleteNavExtractor('https://www.esempio.com')
result = extractor.run_full_extraction()`,
    pros: ['Estrazione più completa possibile', 'Trova TUTTI i link del sito', 'Combina più fonti', 'Risultato strutturato'],
    cons: ['Più lento (minuti)', 'Può essere pesante sul server', 'Richiede configurazione']
  }
]

function App() {
  const [selectedMethod, setSelectedMethod] = useState<string>('console')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'methods' | 'steps' | 'tips'>('methods')

  const currentMethod = methods.find(m => m.id === selectedMethod)!

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-md bg-slate-900/70 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-violet-500/20">
              ☰
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Navbar Extractor Guide</h1>
              <p className="text-xs text-slate-400">Come prelevare i menu di navigazione completi da qualsiasi sito</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="text-slate-500">6 metodi</span>
            <span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">Completo</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-6 md:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Come prelevare i <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">menu di navigazione</span>
                <br />completi da un sito web
              </h2>
              <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
                Guida completa per estrarre <strong>tutta la struttura di navigazione</strong> (navbar, menu, 
                sottomenu, footer links) da qualsiasi sito web. Dal metodo più veloce (5 secondi) 
                al crawling completo del sito.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30">
                  🧭 Navbar completa
                </span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">
                  🔗 Tutti i link
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                  📂 Esporta JSON/CSV
                </span>
                <span className="px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30">
                  ⚡ In pochi secondi
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50">
          {[
            { id: 'methods' as const, label: '🛠️ Metodi', },
            { id: 'steps' as const, label: '📋 Passaggi' },
            { id: 'tips' as const, label: '💡 Consigli' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Methods Tab */}
        {activeTab === 'methods' && (
          <>
            {/* Method Selector */}
            <section className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {methods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
                      selectedMethod === method.id
                        ? 'bg-violet-500/15 border-violet-500/50 shadow-lg shadow-violet-500/10 scale-[1.02]'
                        : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{method.icon}</div>
                    <div className="font-medium text-sm leading-tight">{method.title}</div>
                    <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {method.speed}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Method Detail */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="text-4xl mb-3">{currentMethod.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{currentMethod.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {currentMethod.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-700/60 text-xs text-slate-300 border border-slate-600/50">
                      ⏱ {currentMethod.speed}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-700/60 text-xs text-slate-300 border border-slate-600/50">
                      📊 {currentMethod.difficulty}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                  <h4 className="font-semibold text-emerald-400 mb-3 text-xs uppercase tracking-wider">✅ Vantaggi</h4>
                  <ul className="space-y-2">
                    {currentMethod.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5 text-xs">●</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <h4 className="font-semibold text-red-400 mb-3 text-xs uppercase tracking-wider">⚠️ Svantaggi</h4>
                  <ul className="space-y-2">
                    {currentMethod.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5 text-xs">●</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code */}
              <div className="lg:col-span-2">
                <div className="bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800/70 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{currentMethod.language}</span>
                    </div>
                    <button
                      onClick={() => copyCode(currentMethod.code, currentMethod.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-xs text-violet-300 transition-all"
                    >
                      {copiedCode === currentMethod.id ? (
                        <><span className="text-emerald-400">✓</span> Copiato!</>
                      ) : (
                        <><span>📋</span> Copia codice</>
                      )}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                    <pre className="text-sm leading-relaxed">
                      <code>
                        {currentMethod.code.split('\n').map((line, i) => (
                          <div key={i} className="flex hover:bg-slate-800/30 -mx-4 px-4">
                            <span className="text-slate-600 select-none w-10 text-right mr-4 flex-shrink-0 text-xs leading-relaxed">
                              {i + 1}
                            </span>
                            <span className={getLineColor(line, currentMethod.language)}>{highlightCode(line, currentMethod.language)}</span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <section>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6">📋 Passaggi universali per estrarre la navbar</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Apri il sito nel browser',
                    desc: 'Vai sul sito web da cui vuoi estrarre la navigazione.',
                    detail: 'Assicurati che la pagina sia completamente caricata, inclusi i menu.'
                  },
                  {
                    step: 2,
                    title: 'Apri DevTools (F12)',
                    desc: 'Premi F12 o Ctrl+Shift+I (Cmd+Opt+I su Mac).',
                    detail: 'Vai nella tab "Elements" per vedere il codice HTML della pagina.'
                  },
                  {
                    step: 3,
                    title: 'Identifica la navbar',
                    desc: 'Cerca i tag <nav>, <header>, o classi come .navbar, .menu, .navigation.',
                    detail: 'Usa Ctrl+F nella tab Elements per cercare "nav" o "menu".'
                  },
                  {
                    step: 4,
                    title: 'Analizza la struttura',
                    desc: 'Osserva come sono organizzati i link: liste <ul>/<li>, dropdown, mega menu.',
                    detail: 'I sottomenu sono solitamente <ul> annidati dentro <li> del menu principale.'
                  },
                  {
                    step: 5,
                    title: 'Estrai con il codice',
                    desc: 'Vai nella tab Console e usa uno dei metodi sopra per estrarre i dati.',
                    detail: 'Il metodo "Browser Console" è il più veloce per un\'estrazione immediata.'
                  },
                  {
                    step: 6,
                    title: 'Esporta i risultati',
                    desc: 'Copia il JSON risultante o scarica il file CSV per usarlo dove vuoi.',
                    detail: 'Puoi importare i dati in Excel, un database, o un altro strumento.'
                  }
                ].map(item => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center font-bold text-violet-300 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                      <p className="text-slate-500 text-xs mt-1 italic">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Example */}
            <div className="mt-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4">🔍 Cosa cercare nel codice HTML</h3>
              <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-700/50">
                <pre className="text-sm text-slate-300">
{`<nav class="main-navigation" role="navigation">
  <ul class="menu">
    <li class="menu-item">
      <a href="/">Home</a>
    </li>
    <li class="menu-item has-children">
      <a href="/servizi">Servizi</a>        ← Link principale
      <ul class="submenu">                   ← Sottomenu
        <li><a href="/servizi/web">Web Design</a></li>
        <li><a href="/servizi/seo">SEO</a></li>
        <li><a href="/servizi/marketing">Marketing</a></li>
      </ul>
    </li>
    <li class="menu-item">
      <a href="/contatti">Contatti</a>
    </li>
  </ul>
</nav>`}
                </pre>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                💡 La struttura tipica è: <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-violet-300">&lt;nav&gt;</code> → <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-violet-300">&lt;ul&gt;</code> → <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-violet-300">&lt;li&gt;</code> → <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-violet-300">&lt;a&gt;</code>. I sottomenu sono <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-violet-300">&lt;ul&gt;</code> annidati.
              </p>
            </div>
          </section>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-violet-300 mb-2">Selettori CSS più comuni</h4>
                <div className="space-y-1.5 text-sm font-mono">
                  <code className="block text-emerald-300">nav</code>
                  <code className="block text-emerald-300">.navbar, .main-nav, .site-nav</code>
                  <code className="block text-emerald-300">[role="navigation"]</code>
                  <code className="block text-emerald-300">.menu, .main-menu, .primary-menu</code>
                  <code className="block text-emerald-300">header nav, .header-navigation</code>
                  <code className="block text-emerald-300">.navigation, .top-bar</code>
                </div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold text-violet-300 mb-2">Strumenti utili</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">•</span> Chrome DevTools (F12)</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">•</span> Web Scraper (estensione Chrome)</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">•</span> Instant Data Scraper</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">•</span> ScrapingBee / Apify (cloud)</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">•</span> import.io (no-code)</li>
                </ul>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-violet-300 mb-2">Metodo più veloce in assoluto</h4>
                <p className="text-sm text-slate-400 mb-3">Se vuoi solo i link della navbar, fai così:</p>
                <div className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-slate-300 border border-slate-700/50">
                  <div className="text-slate-500">// Incolla nella Console (F12):</div>
                  <div className="text-cyan-300">copy(</div>
                  <div className="text-emerald-300 ml-4">[...document.querySelectorAll(<span className="text-amber-300">'nav a, .menu a'</span>)]</div>
                  <div className="text-emerald-300 ml-4">.map(a =&gt; a.textContent.trim() + <span className="text-amber-300">' | '</span> + a.href)</div>
                  <div className="text-emerald-300 ml-4">.join(<span className="text-amber-300">{'"\\n"'}'</span>)</div>
                  <div className="text-cyan-300">)</div>
                </div>
                <p className="text-xs text-slate-500 mt-2">→ I link vengono copiati negli appunti!</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-semibold text-violet-300 mb-2">Siti con menu dinamici (JS)</h4>
                <p className="text-sm text-slate-400">Se il menu si carica con JavaScript:</p>
                <ul className="space-y-2 text-sm text-slate-300 mt-2">
                  <li>1. Usa Puppeteer/Selenium (vedi metodo sopra)</li>
                  <li>2. Oppure: Network tab → cerca chiamate API con "menu" o "nav"</li>
                  <li>3. Oppure: aspetta il caricamento e poi usa la Console</li>
                </ul>
              </div>
            </div>

            {/* Quick reference table */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h4 className="font-semibold">📊 Confronto rapido dei metodi</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-slate-400">
                      <th className="text-left px-5 py-3">Metodo</th>
                      <th className="text-left px-5 py-3">Velocità</th>
                      <th className="text-left px-5 py-3">Completezza</th>
                      <th className="text-left px-5 py-3">JS dinamico</th>
                      <th className="text-left px-5 py-3">Automazione</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-5 py-3">💻 Console</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-yellow-400">⚡⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                      <td className="px-5 py-3 text-red-400">❌ No</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-5 py-3">🔖 Bookmarklet</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-yellow-400">⚡⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                      <td className="px-5 py-3 text-red-400">❌ No</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-5 py-3">🐍 Python</td>
                      <td className="px-5 py-3 text-yellow-400">⚡⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-red-400">❌ No</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-5 py-3">🎭 Puppeteer</td>
                      <td className="px-5 py-3 text-yellow-400">⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-5 py-3">🧩 Extension</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-yellow-400">⚡⚡⚡</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                      <td className="px-5 py-3 text-red-400">❌ No</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3">🗺️ Sitemap+Crawl</td>
                      <td className="px-5 py-3 text-red-400">⚡</td>
                      <td className="px-5 py-3 text-emerald-400">⚡⚡⚡⚡⚡</td>
                      <td className="px-5 py-3 text-yellow-400">⚠️ Parziale</td>
                      <td className="px-5 py-3 text-emerald-400">✅ Sì</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          Guida educativa • Adatta il codice al sito specifico che devi analizzare
        </div>
      </footer>
    </div>
  )
}

function getLineColor(line: string, lang: string): string {
  const trimmed = line.trim()
  if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) {
    return 'text-slate-500'
  }
  return ''
}

function highlightCode(line: string, lang: string): JSX.Element {
  // Simple syntax highlighting
  const parts: JSX.Element[] = []
  let remaining = line
  let key = 0

  // Comments
  if (remaining.trim().startsWith('//') || remaining.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>
  }

  // Keywords
  const keywords = lang === 'python' 
    ? ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'while', 'try', 'except', 'with', 'as', 'print', 'self', 'True', 'False', 'None', 'async', 'await']
    : ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'new', 'require', 'import', 'from', 'export', 'class', 'try', 'catch', 'throw']

  // Strings (simple)
  const stringRegex = /(["'`])(?:(?!\1|\\).|\\.)*?\1/g
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
  
  // Simple approach: just return with basic coloring
  let result = remaining
  
  // Color strings
  result = result.replace(/(["'`])(?:(?!\1|\\).|\\.)*?\1/g, '§STR§$&§END§')
  // Color keywords
  result = result.replace(keywordRegex, '§KW§$&§END§')
  
  // Split and render
  const segments = result.split(/§(STR|KW|END)§/)
  
  let currentClass = ''
  segments.forEach((seg, i) => {
    if (seg === 'STR') { currentClass = 'text-emerald-300'; return }
    if (seg === 'KW') { currentClass = 'text-purple-300'; return }
    if (seg === 'END') { currentClass = ''; return }
    if (seg) {
      parts.push(<span key={key++} className={currentClass}>{seg}</span>)
    }
  })

  return <>{parts}</>
}

export default App
