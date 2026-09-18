import { useState } from 'react'

type Source = {
  id: string
  name: string
  url: string
  icon: string
  type: string
  difficulty: string
  description: string
  example: string
}

const sources: Source[] = [
  {
    id: 'morningstar',
    name: 'Morningstar',
    url: 'https://www.morningstar.it',
    icon: '⭐',
    type: 'Scraping',
    difficulty: 'Medio',
    description: 'Il sito più completo per dati sui fondi. NAV aggiornati quotidianamente per migliaia di fondi.',
    example: 'https://it.morningstar.com/it/funds/snapshot/snapshot.aspx?id=F0GBR04O1P'
  },
  {
    id: 'borsa-italiana',
    name: 'Borsa Italiana',
    url: 'https://www.borsaitaliana.it',
    icon: '🇮🇹',
    type: 'Scraping/CSV',
    difficulty: 'Facile',
    description: 'NAV degli ETF quotati in Italia. Dati ufficiali e aggiornati.',
    example: 'https://www.borsaitaliana.it/borsa/search/scheda.html?isin=IE00B4L5Y562'
  },
  {
    id: 'justetf',
    name: 'JustETF',
    url: 'https://www.justetf.com',
    icon: '📊',
    type: 'Scraping',
    difficulty: 'Facile',
    description: 'Ottimo per ETF europei. NAV, performance e dati storici.',
    example: 'https://www.justetf.com/it/etf-profile?isin=IE00B4L5Y562'
  },
  {
    id: 'sgr',
    name: 'Siti delle SGR',
    url: 'https://www.blackrock.com/it',
    icon: '🏦',
    type: 'CSV/PDF',
    difficulty: 'Molto Facile',
    description: 'Siti ufficiali delle società di gestione (BlackRock, Vanguard, Amundi, ecc.). Dati più affidabili.',
    example: 'https://www.ishares.com/it/products/239563/ishares-msci-world-ucits-etf'
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    icon: '💼',
    type: 'API',
    difficulty: 'Difficile',
    description: 'Dati professionali in tempo reale. Richiede abbonamento costoso.',
    example: 'API: https://api.bloomberg.com/ (richiede licenza)'
  },
  {
    id: 'yahoo',
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com',
    icon: '📈',
    type: 'API Gratuita',
    difficulty: 'Facile',
    description: 'API gratuite per ETF e fondi. Buona per dati storici e NAV.',
    example: 'https://query1.finance.yahoo.com/v8/finance/chart/SPY'
  }
]

type Method = {
  id: string
  title: string
  icon: string
  speed: string
  description: string
  code: string
  language: string
  pros: string[]
  cons: string[]
}

const methods: Method[] = [
  {
    id: 'yahoo-api',
    title: 'Yahoo Finance API',
    icon: '📈',
    speed: '2-3 secondi',
    description: 'API gratuita e affidabile per ottenere NAV di ETF e fondi. Nessun setup necessario.',
    language: 'python',
    code: `import requests
import json
from datetime import datetime

def get_nav_yahoo(ticker: str) -> dict:
    """
    Ottieni il NAV da Yahoo Finance
    ticker: simbolo dell'ETF/fondo (es. 'SPY', 'VWCE.MI')
    """
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
    
    params = {
        'interval': '1d',
        'range': '5d'
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    
    # Estrai i dati
    result = data['chart']['result'][0]
    meta = result['meta']
    
    nav_info = {
        'ticker': ticker,
        'name': meta.get('shortName', 'N/A'),
        'nav': meta['regularMarketPrice'],
        'currency': meta['currency'],
        'exchange': meta['exchangeName'],
        'timestamp': datetime.fromtimestamp(meta['regularMarketTime']).strftime('%Y-%m-%d %H:%M:%S'),
        'previous_close': meta.get('chartPreviousClose'),
        'change': meta['regularMarketPrice'] - meta.get('chartPreviousClose', 0)
    }
    
    return nav_info

# === USO ===
# ETF Vanguard FTSE All-World (quotato a Milano)
nav = get_nav_yahoo('VWCE.MI')

print(f"📊 {nav['name']}")
print(f"💰 NAV: {nav['nav']:.2f} {nav['currency']}")
print(f"📅 Data: {nav['timestamp']}")
print(f"📈 Variazione: {nav['change']:+.2f}")

# Per più ETF contemporaneamente
etfs = ['VWCE.MI', 'SPY', 'QQQ', 'EIMI.MI']
for etf in etfs:
    try:
        data = get_nav_yahoo(etf)
        print(f"\\n{data['name']}: {data['nav']:.2f} {data['currency']}")
    except Exception as e:
        print(f"Errore con {etf}: {e}")`,
    pros: ['Gratuito', 'Nessuna registrazione', 'Dati in tempo reale', 'Facile da usare'],
    cons: ['Limiti di richieste', 'Non tutti i fondi disponibili', 'Solo ETF quotati']
  },
  {
    id: 'morningstar',
    title: 'Morningstar Scraping',
    icon: '⭐',
    speed: '5-10 secondi',
    description: 'Estrai il NAV da Morningstar usando BeautifulSoup. Funziona per migliaia di fondi.',
    language: 'python',
    code: `import requests
from bs4 import BeautifulSoup
import re

def get_nav_morningstar(fund_url: str) -> dict:
    """
    Estrai NAV da Morningstar
    fund_url: URL completo della pagina del fondo
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(fund_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Cerca il NAV nella pagina
    # Morningstar usa diverse strutture, proviamo vari selettori
    
    # Metodo 1: Cerca elementi con classe contenente "price" o "nav"
    nav_element = soup.find(class_=re.compile(r'(price|nav|value)', re.I))
    
    if nav_element:
        nav_text = nav_element.get_text(strip=True)
        # Estrai il numero (es. "€ 125,43" -> 125.43)
        nav_match = re.search(r'[\\d.,]+', nav_text.replace(' ', ''))
        if nav_match:
            nav_value = float(nav_match.group().replace(',', '.').replace('€', ''))
    
    # Metodo 2: Cerca in una tabella specifica
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all(['td', 'th'])
            for i, cell in enumerate(cells):
                if 'NAV' in cell.get_text() or 'Prezzo' in cell.get_text():
                    # Il valore è nella cella successiva
                    if i + 1 < len(cells):
                        nav_text = cells[i + 1].get_text(strip=True)
                        nav_value = float(re.search(r'[\\d.,]+', nav_text).group().replace(',', '.'))
                        break
    
    # Estrai altre informazioni
    name_element = soup.find('h1') or soup.find(class_=re.compile(r'name|title', re.I))
    fund_name = name_element.get_text(strip=True) if name_element else 'N/A'
    
    date_element = soup.find(class_=re.compile(r'date|time', re.I))
    date = date_element.get_text(strip=True) if date_element else 'N/A'
    
    return {
        'name': fund_name,
        'nav': nav_value,
        'date': date,
        'url': fund_url
    }

# === USO ===
url = 'https://it.morningstar.com/it/funds/snapshot/snapshot.aspx?id=F0GBR04O1P'
result = get_nav_morningstar(url)

print(f"📊 Fondo: {result['name']}")
print(f"💰 NAV: €{result['nav']:.2f}")
print(f"📅 Data: {result['date']}")`,
    pros: ['Migliaia di fondi disponibili', 'Dati completi', 'Aggiornamenti quotidiani'],
    cons: ['Struttura HTML può cambiare', 'Più lento', 'Richiede manutenzione']
  },
  {
    id: 'borsa-italiana',
    title: 'Borsa Italiana CSV',
    icon: '🇮🇹',
    speed: '3-5 secondi',
    description: 'Scarica i NAV degli ETF italiani direttamente da Borsa Italiana in formato CSV.',
    language: 'python',
    code: `import requests
import pandas as pd
from io import StringIO

def get_nav_borsa_italiana(isin: str) -> dict:
    """
    Ottieni NAV da Borsa Italiana
    isin: codice ISIN dell'ETF (es. 'IE00B4L5Y562')
    """
    # URL per scaricare i dati storici
    url = f"https://www.borsaitaliana.it/borsa/etf/paniere.html?isin={isin}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml'
    }
    
    response = requests.get(url, headers=headers)
    
    # Parsa la pagina per estrarre il NAV
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Cerca la tabella con i dati
    table = soup.find('table', class_=re.compile(r'table|data', re.I))
    
    if table:
        rows = table.find_all('tr')
        # Cerca la riga con il NAV
        for row in rows:
            cells = row.find_all(['td', 'th'])
            for cell in cells:
                if 'NAV' in cell.get_text() or 'Prezzo' in cell.get_text():
                    # Estrai il valore
                    nav_cell = cell.find_next_sibling()
                    if nav_cell:
                        nav_text = nav_cell.get_text(strip=True)
                        nav = float(nav_text.replace('.', '').replace(',', '.'))
                        break
    
    # Alternativa: cerca elementi specifici
    nav_elements = soup.find_all(class_=re.compile(r'price|nav|value', re.I))
    for elem in nav_elements:
        text = elem.get_text(strip=True)
        if re.match(r'^[\\d.,]+$', text.replace('€', '').strip()):
            nav = float(text.replace('€', '').replace('.', '').replace(',', '.'))
            break
    
    # Estrai nome ETF
    title = soup.find('h1') or soup.find('title')
    name = title.get_text(strip=True) if title else 'N/A'
    
    return {
        'isin': isin,
        'name': name,
        'nav': nav,
        'currency': 'EUR',
        'source': 'Borsa Italiana'
    }

# === USO ===
# iShares MSCI World UCITS ETF
result = get_nav_borsa_italiana('IE00B4L5Y562')

print(f"📊 {result['name']}")
print(f"💰 NAV: {result['nav']:.2f} {result['currency']}")
print(f"🔗 ISIN: {result['isin']}")

# Per più ETF
etfs = {
    'IE00B4L5Y562': 'iShares MSCI World',
    'IE00B3RBWM25': 'Vanguard FTSE All-World',
    'LU1681043599': 'Amundi MSCI Emerging Markets'
}

for isin, name in etfs.items():
    try:
        data = get_nav_borsa_italiana(isin)
        print(f"\\n{name}: {data['nav']:.2f} EUR")
    except Exception as e:
        print(f"Errore con {isin}: {e}")`,
    pros: ['Dati ufficiali italiani', 'Affidabile', 'Aggiornamenti in tempo reale'],
    cons: ['Solo ETF quotati in Italia', 'Struttura può cambiare', 'Limitato al mercato italiano']
  },
  {
    id: 'sgr-csv',
    title: 'Download CSV da SGR',
    icon: '🏦',
    speed: '10-30 secondi',
    description: 'Molte SGR (BlackRock, Vanguard, Amundi) permettono di scaricare lo storico NAV in CSV.',
    language: 'python',
    code: `import requests
import pandas as pd
from io import StringIO
import time

def download_nav_csv_sgr(isin: str, provider: str = 'ishares') -> pd.DataFrame:
    """
    Scarica storico NAV da SGR
    isin: codice ISIN
    provider: 'ishares', 'vanguard', 'amundi'
    """
    # URL diversi per ogni provider
    urls = {
        'ishares': f'https://www.ishares.com/it/products/239563/ishares-msci-world-ucits-etf/1467276766844.ajax?fileType=csv&sortBy=asOfDate&sortOrder=desc',
        'vanguard': f'https://www.vanguarditalia.it/portal/PdfServlet?isin={isin}&type=nav',
        'amundi': f'https://www.amundi.it/portal/PdfServlet?isin={isin}&type=nav'
    }
    
    url = urls.get(provider)
    if not url:
        raise ValueError(f"Provider {provider} non supportato")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/csv,application/csv'
    }
    
    response = requests.get(url, headers=headers)
    
    # Parsa il CSV
    df = pd.read_csv(
        StringIO(response.text),
        sep=';',  # o ',' a seconda del provider
        decimal=',',
        thousands='.',
        encoding='utf-8'
    )
    
    # Pulisci i dati
    df.columns = df.columns.str.strip()
    
    # Rinomina colonne comuni
    column_mapping = {
        'Data': 'date',
        'Date': 'date',
        'NAV': 'nav',
        'Prezzo': 'nav',
        'Valuta': 'currency',
        'Currency': 'currency'
    }
    
    df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})
    
    # Converti date
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], dayfirst=True)
    
    # Converti NAV a numerico
    if 'nav' in df.columns:
        df['nav'] = pd.to_numeric(df['nav'], errors='coerce')
        df = df.dropna(subset=['nav'])
    
    # Aggiungi metadati
    df['isin'] = isin
    df['provider'] = provider
    
    return df.sort_values('date', ascending=False)

# === USO ===
# iShares MSCI World
df = download_nav_csv_sgr('IE00B4L5Y562', 'ishares')

print(f"📊 Storico NAV scaricato: {len(df)} record")
print(f"\\nUltimi 5 NAV:")
print(df[['date', 'nav', 'currency']].head())

print(f"\\nNAV più recente: €{df.iloc[0]['nav']:.2f}")
print(f"NAV più vecchio: €{df.iloc[-1]['nav']:.2f}")

# Salva in Excel
df.to_excel(f'nav_history_{df.iloc[0]["isin"]}.xlsx', index=False)
print(f"\\n✅ Salvato in Excel")

# Per più ETF
etfs = ['IE00B4L5Y562', 'IE00B3RBWM25', 'LU1681043599']
all_data = []

for isin in etfs:
    try:
        df = download_nav_csv_sgr(isin, 'ishares')
        all_data.append(df)
        time.sleep(2)  # Rispetta i rate limits
    except Exception as e:
        print(f"Errore con {isin}: {e}")

# Combina tutti i dati
combined = pd.concat(all_data, ignore_index=True)
combined.to_excel('all_nav_history.xlsx', index=False)`,
    pros: ['Dati ufficiali e certificati', 'Storico completo', 'Formato strutturato'],
    cons: ['URL specifici per ogni SGR', 'Non sempre disponibile', 'Download manuale o semi-automatico']
  },
  {
    id: 'selenium',
    title: 'Selenium per Siti Dinamici',
    icon: '🤖',
    speed: '15-30 secondi',
    description: 'Per siti che caricano i NAV via JavaScript. Selenium simula un browser reale.',
    language: 'python',
    code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_nav_dynamic(url: str) -> dict:
    """
    Estrai NAV da siti con JavaScript dinamico
    """
    # Configura Chrome headless
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    
    # Avvia il browser
    driver = webdriver.Chrome(
        ChromeDriverManager().install(),
        options=options
    )
    
    try:
        # Naviga alla pagina
        driver.get(url)
        
        # Attendi che il contenuto sia caricato
        time.sleep(3)
        
        # Attendi elementi specifici del NAV
        # Adatta questi selettori al sito specifico
        
        # Esempio 1: Cerca elementi con classe "price" o "nav"
        try:
            nav_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((
                    By.CSS_SELECTOR, 
                    '[class*="price"], [class*="nav"], [class*="value"]'
                ))
            )
            nav_text = nav_element.text
        except:
            nav_text = None
        
        # Esempio 2: Cerca in una tabella
        if not nav_text:
            tables = driver.find_elements(By.TAG_NAME, 'table')
            for table in tables:
                rows = table.find_elements(By.TAG_NAME, 'tr')
                for row in rows:
                    if 'NAV' in row.text or 'Prezzo' in row.text:
                        cells = row.find_elements(By.TAG_NAME, 'td')
                        if len(cells) > 1:
                            nav_text = cells[1].text
                            break
        
        # Estrai altre informazioni
        title = driver.find_element(By.TAG_NAME, 'h1').text
        
        # Cerca la data
        try:
            date_element = driver.find_element(
                By.CSS_SELECTOR, 
                '[class*="date"], [class*="time"]'
            )
            date = date_element.text
        except:
            date = 'N/A'
        
        # Parsa il valore NAV
        import re
        nav_match = re.search(r'[\\d.,]+', nav_text.replace(' ', ''))
        if nav_match:
            nav_value = float(nav_match.group().replace(',', '.').replace('€', ''))
        
        return {
            'name': title,
            'nav': nav_value,
            'date': date,
            'url': url
        }
    
    finally:
        driver.quit()

# === USO ===
# Esempio con un sito dinamico
url = 'https://www.justetf.com/it/etf-profile?isin=IE00B4L5Y562'
result = get_nav_dynamic(url)

print(f"📊 {result['name']}")
print(f"💰 NAV: €{result['nav']:.2f}")
print(f"📅 Data: {result['date']}")

# Per più ETF
etfs = [
    'https://www.justetf.com/it/etf-profile?isin=IE00B4L5Y562',
    'https://www.justetf.com/it/etf-profile?isin=IE00B3RBWM25'
]

for url in etfs:
    try:
        data = get_nav_dynamic(url)
        print(f"\\n{data['name']}: €{data['nav']:.2f}")
        time.sleep(2)  # Delay tra le richieste
    except Exception as e:
        print(f"Errore: {e}")`,
    pros: ['Funziona con qualsiasi sito', 'Gestisce JavaScript', 'Simula browser reale'],
    cons: ['Molto più lento', 'Richiede Chrome/Chromium', 'Consuma più risorse']
  },
  {
    id: 'batch',
    title: 'Batch Processing Multi-Fonte',
    icon: '🚀',
    speed: '1-5 minuti',
    description: 'Script completo per estrarre NAV da multiple fonti e consolidare i dati.',
    language: 'python',
    code: `import requests
import pandas as pd
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
import re

class NAVExtractor:
    """Estrattore NAV multi-fonte"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.results = []
    
    def from_yahoo(self, ticker: str) -> dict:
        """Estrai da Yahoo Finance"""
        try:
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
            response = requests.get(url, headers=self.headers, timeout=10)
            data = response.json()
            
            result = data['chart']['result'][0]
            meta = result['meta']
            
            return {
                'source': 'Yahoo Finance',
                'ticker': ticker,
                'name': meta.get('shortName', 'N/A'),
                'nav': meta['regularMarketPrice'],
                'currency': meta['currency'],
                'date': datetime.fromtimestamp(meta['regularMarketTime']).strftime('%Y-%m-%d'),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {'error': str(e), 'ticker': ticker, 'source': 'Yahoo Finance'}
    
    def from_morningstar(self, fund_id: str) -> dict:
        """Estrai da Morningstar"""
        try:
            url = f"https://it.morningstar.com/it/funds/snapshot/snapshot.aspx?id={fund_id}"
            response = requests.get(url, headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Cerca il NAV
            nav_element = soup.find(class_=re.compile(r'price|nav', re.I))
            if nav_element:
                nav_text = nav_element.get_text(strip=True)
                nav_match = re.search(r'[\\d.,]+', nav_text)
                if nav_match:
                    nav = float(nav_match.group().replace(',', '.'))
                    
                    return {
                        'source': 'Morningstar',
                        'fund_id': fund_id,
                        'nav': nav,
                        'currency': 'EUR',
                        'date': datetime.now().strftime('%Y-%m-%d'),
                        'timestamp': datetime.now().isoformat()
                    }
        except Exception as e:
            return {'error': str(e), 'fund_id': fund_id, 'source': 'Morningstar'}
    
    def extract_all(self, funds: list) -> pd.DataFrame:
        """
        Estrai NAV da tutte le fonti per una lista di fondi
        
        funds: lista di dict con 'ticker', 'morningstar_id', 'isin'
        """
        all_results = []
        
        for fund in funds:
            print(f"\\n🔍 Elaborazione: {fund.get('name', 'N/A')}")
            
            # Prova Yahoo Finance
            if 'ticker' in fund:
                print(f"  📈 Yahoo Finance...")
                result = self.from_yahoo(fund['ticker'])
                all_results.append(result)
                time.sleep(1)
            
            # Prova Morningstar
            if 'morningstar_id' in fund:
                print(f"  ⭐ Morningstar...")
                result = self.from_morningstar(fund['morningstar_id'])
                all_results.append(result)
                time.sleep(1)
        
        # Converti in DataFrame
        df = pd.DataFrame(all_results)
        
        # Rimuovi errori
        df = df[~df['nav'].isna()]
        
        # Salva risultati
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        df.to_csv(f'nav_extraction_{timestamp}.csv', index=False)
        df.to_excel(f'nav_extraction_{timestamp}.xlsx', index=False)
        
        print(f"\\n✅ Completato! {len(df)} NAV estratti")
        print(f"📁 Salvato in: nav_extraction_{timestamp}.csv/xlsx")
        
        return df

# === USO ===
extractor = NAVExtractor()

# Lista fondi da estrarre
funds = [
    {
        'name': 'Vanguard FTSE All-World',
        'ticker': 'VWCE.MI',
        'isin': 'IE00BK5BQT80',
        'morningstar_id': 'F0GBR04O1P'
    },
    {
        'name': 'iShares MSCI World',
        'ticker': 'SWDA.MI',
        'isin': 'IE00B4L5Y562',
        'morningstar_id': 'F0GBR04M3J'
    },
    {
        'name': 'SPDR S&P 500',
        'ticker': 'SPY',
        'isin': 'US78462F1030'
    }
]

# Estrai tutti i NAV
df = extractor.extract_all(funds)

# Mostra risultati
print("\\n📊 RIEPILOGO:")
print(df[['name', 'nav', 'currency', 'source', 'date']].to_string(index=False))

# Statistiche
print(f"\\n📈 Statistiche:")
print(f"   Fondi analizzati: {len(df)}")
print(f"   Fonti utilizzate: {df['source'].nunique()}")
print(f"   NAV medio: €{df['nav'].mean():.2f}")`,
    pros: ['Estrae da multiple fonti', 'Confronta dati', 'Salva in CSV/Excel', 'Gestisce errori'],
    cons: ['Più complesso', 'Richiede più tempo', 'Dipende da tutte le fonti']
  }
]

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'methods'>('overview')
  const [selectedMethod, setSelectedMethod] = useState<string>('yahoo-api')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const currentMethod = methods.find(m => m.id === selectedMethod)!

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-700/50 backdrop-blur-md bg-slate-900/70 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/20">
              €
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">NAV Financial Extractor</h1>
              <p className="text-xs text-slate-400">Come estrarre il Net Asset Value da qualsiasi sito</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Guida Completa
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border border-emerald-500/20 rounded-2xl p-6 md:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Come prelevare il <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NAV finanziario</span>
                <br />da siti web in pochi secondi
              </h2>
              <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
                Il <strong>NAV (Net Asset Value)</strong> è il valore patrimoniale netto di un fondo/ETF, 
                ovvero la somma di tutti gli asset divisa per il numero di quote. 
                Ecco come estrarlo automaticamente da Morningstar, Borsa Italiana, Yahoo Finance e altri siti.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/30">
                  💰 Valore fondi/ETF
                </span>
                <span className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30">
                  📊 Dati in tempo reale
                </span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                  🏦 Multiple fonti
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                  ⚡ Codice pronto
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50">
          {[
            { id: 'overview' as const, label: '📖 Panoramica' },
            { id: 'sources' as const, label: '🌐 Fonti Dati' },
            { id: 'methods' as const, label: '🛠️ Metodi' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section className="space-y-6">
            {/* Cos'è il NAV */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">💡 Cos'è il NAV?</h3>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>
                  Il <strong className="text-emerald-400">NAV (Net Asset Value)</strong> è il valore patrimoniale netto di un fondo comune o ETF.
                </p>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-center text-lg font-mono">
                    NAV = <span className="text-cyan-400">(Totale Asset - Passività)</span> / <span className="text-purple-400">Numero Quote</span>
                  </p>
                </div>
                <p>
                  In parole semplici: è il <strong>prezzo di una singola quota</strong> del fondo. 
                  Se il NAV è €100 e tu possiedi 10 quote, il tuo investimento vale €1.000.
                </p>
              </div>
            </div>

            {/* Dove trovarlo */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">🌐 Dove trovare il NAV?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Morningstar', desc: 'Migliaia di fondi, dati completi', icon: '⭐' },
                  { name: 'Borsa Italiana', desc: 'ETF italiani, dati ufficiali', icon: '🇮🇹' },
                  { name: 'Yahoo Finance', desc: 'API gratuite, facile accesso', icon: '📈' },
                  { name: 'Siti SGR', desc: 'BlackRock, Vanguard, Amundi...', icon: '🏦' },
                  { name: 'JustETF', desc: 'ETF europei, dati storici', icon: '📊' },
                  { name: 'Bloomberg', desc: 'Dati professionali (a pagamento)', icon: '💼' }
                ].map((source, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">{source.icon}</div>
                    <h4 className="font-semibold text-emerald-300 mb-1">{source.name}</h4>
                    <p className="text-sm text-slate-400">{source.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">⚡ Metodo più veloce (30 secondi)</h3>
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-700/50">
                <pre className="text-sm text-slate-300 overflow-x-auto">
{`import requests

# Estrai NAV da Yahoo Finance in 3 righe
ticker = 'VWCE.MI'  # Vanguard FTSE All-World
url = f'https://query1.finance.yahoo.com/v8/finance/chart/{ticker}'
data = requests.get(url).json()

nav = data['chart']['result'][0]['meta']['regularMarketPrice']
print(f'NAV: €{nav:.2f}')`}
                </pre>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                💡 Questo è il metodo più semplice. Vai alla tab "Metodi" per opzioni più complete.
              </p>
            </div>

            {/* Best Practices */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">✅ Best Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Rispetta i Rate Limits', desc: 'Aggiungi delay (1-2 sec) tra le richieste per non sovraccaricare i server.' },
                  { title: 'Usa API ufficiali quando possibile', desc: 'Yahoo Finance, Bloomberg API sono più affidabili dello scraping.' },
                  { title: 'Verifica la fonte', desc: 'I dati ufficiali delle SGR sono più affidabili di aggregatori terzi.' },
                  { title: 'Cache i risultati', desc: 'I NAV cambiano 1 volta al giorno. Non servono richieste continue.' },
                  { title: 'Gestisci gli errori', desc: 'Implementa retry logic per gestire timeout e errori temporanei.' },
                  { title: 'Documenta le fonti', desc: 'Tieni traccia di dove hai preso i dati per audit e verifica.' }
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 text-xs text-emerald-400">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-emerald-300">{tip.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map((source) => (
                <div key={source.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{source.icon}</div>
                      <div>
                        <h4 className="font-bold text-lg">{source.name}</h4>
                        <p className="text-xs text-slate-400">{source.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      source.difficulty === 'Molto Facile' ? 'bg-emerald-500/20 text-emerald-300' :
                      source.difficulty === 'Facile' ? 'bg-cyan-500/20 text-cyan-300' :
                      source.difficulty === 'Medio' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {source.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{source.description}</p>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs text-slate-500 mb-1">Esempio URL:</p>
                    <code className="text-xs text-emerald-300 break-all">{source.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Methods Tab */}
        {activeTab === 'methods' && (
          <>
            {/* Method Selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedMethod === method.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="font-medium text-sm">{method.title}</div>
                  <div className="text-xs text-slate-400 mt-1">⏱ {method.speed}</div>
                </button>
              ))}
            </div>

            {/* Method Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info */}
              <div className="space-y-4">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="text-3xl mb-2">{currentMethod.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{currentMethod.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{currentMethod.description}</p>
                  <span className="px-2 py-1 rounded-md bg-slate-700/50 text-xs text-slate-300">
                    ⏱ {currentMethod.speed}
                  </span>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <h4 className="font-semibold text-emerald-400 text-xs uppercase mb-2">✅ Vantaggi</h4>
                  <ul className="space-y-1.5">
                    {currentMethod.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 text-xs">●</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <h4 className="font-semibold text-red-400 text-xs uppercase mb-2">⚠️ Svantaggi</h4>
                  <ul className="space-y-1.5">
                    {currentMethod.cons.map((con, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-red-400 text-xs">●</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code */}
              <div className="lg:col-span-2">
                <div className="bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden">
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs text-emerald-300 transition-all"
                    >
                      {copiedCode === currentMethod.id ? (
                        <><span className="text-emerald-400">✓</span> Copiato!</>
                      ) : (
                        <><span>📋</span> Copia</>
                      )}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-slate-300">
                        {currentMethod.code}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
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

export default App
