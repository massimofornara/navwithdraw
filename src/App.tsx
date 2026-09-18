import { useState } from 'react'

type NavResult = {
  name: string
  nav: number
  currency: string
  date: string
  source: string
  url: string
}

type ExtractedData = {
  url: string
  timestamp: string
  results: NavResult[]
  rawHtml?: string
}

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useProxy, setUseProxy] = useState(true)
  const [history, setHistory] = useState<ExtractedData[]>([])

  const extractNAV = async () => {
    if (!url) {
      setError('Inserisci un URL valido')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Usa un proxy CORS per bypassare le restrizioni
      const proxyUrl = useProxy 
        ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
        : url

      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`)
      }

      const html = await response.text()
      
      // Parsa l'HTML per trovare i NAV
      const extractedData = parseNAVFromHTML(html, url)
      
      if (extractedData.results.length === 0) {
        throw new Error('Nessun NAV trovato nella pagina. Prova con un altro sito o verifica che la pagina contenga dati finanziari.')
      }

      setResults(extractedData)
      setHistory(prev => [extractedData, ...prev.slice(0, 9)]) // Mantieni ultimi 10
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const parseNAVFromHTML = (html: string, sourceUrl: string): ExtractedData => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const results: NavResult[] = []

    // Pattern per trovare NAV
    const navPatterns = [
      // Pattern 1: Cerca elementi con testo "NAV" o "Net Asset Value"
      {
        selector: '[class*="nav" i], [class*="price" i], [class*="value" i], [id*="nav" i]',
        extract: (el: Element) => {
          const text = el.textContent || ''
          const navMatch = text.match(/(?:NAV|Net Asset Value)[:\s]*[€$£]?\s*([\d.,]+)/i)
          if (navMatch) {
            return {
              nav: parseFloat(navMatch[1].replace(/\./g, '').replace(',', '.')),
              text: text.trim()
            }
          }
          return null
        }
      },
      // Pattern 2: Cerca in tabelle
      {
        selector: 'table tr',
        extract: (el: Element) => {
          const cells = el.querySelectorAll('td, th')
          for (let i = 0; i < cells.length; i++) {
            const cellText = cells[i].textContent || ''
            if (cellText.match(/NAV|Prezzo|Value/i)) {
              const nextCell = cells[i + 1]
              if (nextCell) {
                const valueText = nextCell.textContent || ''
                const numMatch = valueText.match(/([\d.,]+)/)
                if (numMatch) {
                  return {
                    nav: parseFloat(numMatch[1].replace(/\./g, '').replace(',', '.')),
                    text: `${cellText}: ${valueText}`
                  }
                }
              }
            }
          }
          return null
        }
      },
      // Pattern 3: Cerca meta tags
      {
        selector: 'meta[property*="price"], meta[name*="price"]',
        extract: (el: Element) => {
          const content = el.getAttribute('content') || ''
          const numMatch = content.match(/([\d.,]+)/)
          if (numMatch) {
            return {
              nav: parseFloat(numMatch[1].replace(/\./g, '').replace(',', '.')),
              text: content
            }
          }
          return null
        }
      },
      // Pattern 4: Cerca in elementi con prezzi evidenti
      {
        selector: 'h1, h2, h3, .price, .nav-value, [class*="fund-value"]',
        extract: (el: Element) => {
          const text = el.textContent || ''
          // Cerca pattern come "€ 125,43" o "125.43 EUR"
          const priceMatch = text.match(/[€$£]\s*([\d.,]+)|([\d.,]+)\s*(?:EUR|USD|GBP)/i)
          if (priceMatch) {
            const numStr = priceMatch[1] || priceMatch[2]
            const nav = parseFloat(numStr.replace(/\./g, '').replace(',', '.'))
            // Filtra solo valori ragionevoli per un NAV (tra 0.01 e 100000)
            if (nav > 0.01 && nav < 100000) {
              return {
                nav,
                text: text.trim()
              }
            }
          }
          return null
        }
      }
    ]

    // Applica tutti i pattern
    navPatterns.forEach(pattern => {
      const elements = doc.querySelectorAll(pattern.selector)
      elements.forEach(el => {
        const extracted = pattern.extract(el)
        if (extracted && !isNaN(extracted.nav)) {
          // Determina la valuta
          const currency = extracted.text.match(/EUR|€/) ? 'EUR' :
                          extracted.text.match(/USD|\$/) ? 'USD' :
                          extracted.text.match(/GBP|£/) ? 'GBP' : 'EUR'

          // Estrai il nome del fondo
          const titleEl = doc.querySelector('h1, title, [class*="name" i], [class*="fund-name" i]')
          const name = titleEl?.textContent?.trim() || 'Fondo non identificato'

          // Estrai la data
          const dateEl = doc.querySelector('[class*="date" i], [class*="time" i], time')
          const date = dateEl?.textContent?.trim() || new Date().toLocaleDateString('it-IT')

          // Evita duplicati
          const exists = results.some(r => Math.abs(r.nav - extracted.nav) < 0.01)
          if (!exists) {
            results.push({
              name: name.substring(0, 100),
              nav: extracted.nav,
              currency,
              date,
              source: new URL(sourceUrl).hostname,
              url: sourceUrl
            })
          }
        }
      })
    })

    return {
      url: sourceUrl,
      timestamp: new Date().toISOString(),
      results
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportToCSV = () => {
    if (!results) return

    const csv = [
      ['Nome', 'NAV', 'Valuta', 'Data', 'Fonte', 'URL'].join(','),
      ...results.results.map(r => [
        `"${r.name}"`,
        r.nav,
        r.currency,
        `"${r.date}"`,
        r.source,
        r.url
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nav_extraction_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportToJSON = () => {
    if (!results) return

    const json = JSON.stringify(results, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nav_extraction_${new Date().toISOString().split('T')[0]}.json`
    a.click()
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
              <h1 className="text-lg md:text-xl font-bold">NAV Extractor</h1>
              <p className="text-xs text-slate-400">Estrai NAV da qualsiasi sito • Funziona ovunque</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
              ✓ Vercel
            </span>
            <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
              ✓ Netlify
            </span>
            <span className="px-2 py-1 rounded-full bg-slate-500/20 text-slate-300 text-xs border border-slate-500/30">
              ✓ GitHub Pages
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Estrai il <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NAV</span> da qualsiasi sito
            </h2>
            <p className="text-slate-400 text-lg">
              Inserisci l'URL e ottieni automaticamente i valori patrimoniali netti
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL del sito con i dati NAV
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.morningstar.it/funds/..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500/50"
                  />
                  <span className="text-sm text-slate-300">Usa proxy CORS (necessario per molti siti)</span>
                </label>
              </div>

              <button
                onClick={extractNAV}
                disabled={loading || !url}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Estrazione in corso...
                  </span>
                ) : (
                  '🔍 Estrai NAV'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        {results && (
          <section className="mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  NAV Trovati ({results.results.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-600/50"
                  >
                    📊 CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-600/50"
                  >
                    📄 JSON
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {results.results.map((result, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{result.name}</h4>
                        <p className="text-xs text-slate-400">{result.source}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        className="px-2 py-1 rounded-md bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                        title="Copia dati"
                      >
                        📋
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">NAV</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          {result.currency === 'EUR' ? '€' : result.currency === 'USD' ? '$' : '£'}
                          {result.nav.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Valuta</p>
                        <p className="text-sm font-medium">{result.currency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Data</p>
                        <p className="text-sm font-medium">{result.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Fonte</p>
                        <p className="text-sm font-medium truncate">{result.source}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-500">
                  <strong>URL:</strong> {results.url}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Estratto il:</strong> {new Date(results.timestamp).toLocaleString('it-IT')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section className="mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">📜 Cronologia Estrazioni</h3>
              <div className="space-y-2">
                {history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setResults(item)}
                    className="w-full text-left p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.url}</p>
                        <p className="text-xs text-slate-400">
                          {item.results.length} NAV • {new Date(item.timestamp).toLocaleString('it-IT')}
                        </p>
                      </div>
                      <span className="text-emerald-400 text-sm ml-2">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">🌐</div>
            <h4 className="font-semibold mb-2">Funziona Ovunque</h4>
            <p className="text-sm text-slate-400">
              Deployabile su Vercel, Netlify, GitHub Pages o qualsiasi hosting statico.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold mb-2">Proxy CORS Integrato</h4>
            <p className="text-sm text-slate-400">
              Supera le restrizioni CORS per accedere a qualsiasi sito web.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold mb-2">Export Multiplo</h4>
            <p className="text-sm text-slate-400">
              Esporta i dati in CSV, JSON o copiali negli appunti.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section className="mt-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">💡 Siti di Esempio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Morningstar Italia', url: 'https://it.morningstar.com/it/funds/snapshot/snapshot.aspx?id=F0GBR04O1P' },
                { name: 'Borsa Italiana', url: 'https://www.borsaitaliana.it/borsa/etf/paniere.html?isin=IE00B4L5Y562' },
                { name: 'JustETF', url: 'https://www.justetf.com/it/etf-profile?isin=IE00B4L5Y562' },
                { name: 'iShares (BlackRock)', url: 'https://www.ishares.com/it/products/239563/ishares-msci-world-ucits-etf' }
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setUrl(example.url)}
                  className="text-left p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                >
                  <p className="font-medium text-sm">{example.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-1">{example.url}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Deploy Info */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">🚀 Come Deployare</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-emerald-300 mb-1">Vercel:</p>
                <code className="block bg-slate-900/50 px-3 py-2 rounded text-xs font-mono">
                  npm install -g vercel<br />
                  vercel
                </code>
              </div>
              <div>
                <p className="font-semibold text-purple-300 mb-1">Netlify:</p>
                <code className="block bg-slate-900/50 px-3 py-2 rounded text-xs font-mono">
                  npm run build<br />
                  # Trascina la cartella dist/ su netlify.com
                </code>
              </div>
              <div>
                <p className="font-semibold text-slate-300 mb-1">GitHub Pages:</p>
                <code className="block bg-slate-900/50 px-3 py-2 rounded text-xs font-mono">
                  npm run build<br />
                  # Carica la cartella dist/ su un repository GitHub<br />
                  # Abilita GitHub Pages nelle impostazioni
                </code>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          NAV Extractor • Funziona su qualsiasi hosting statico • Usa responsabilmente
        </div>
      </footer>
    </div>
  )
}

export default App
