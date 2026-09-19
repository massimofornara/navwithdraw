import { useState, useEffect } from 'react'

type ImportedFund = {
  id: string
  name: string
  isin: string
  ticker?: string
  navAccounting: number
  navMarket?: number
  navAvailable?: number
  shares: number
  currency: string
  source: string
  accountId: string
  accountName: string
  importDate: string
  lastUpdate: string
  status: 'imported' | 'reconciled' | 'pending'
  notes?: string
}

type DataSource = {
  id: string
  name: string
  type: 'bank' | 'broker' | 'market' | 'crypto'
  icon: string
  url?: string
  connected: boolean
  lastSync?: string
}

function DataExtractor() {
  const [activeSection, setActiveSection] = useState<'sources' | 'import' | 'extract' | 'results'>('sources')
  const [importedFunds, setImportedFunds] = useState<ImportedFund[]>([])
  const [accounts, setAccounts] = useState<Array<{id: string, name: string, type: string}>>([])
  const [showImportModal, setShowImportModal] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractResults, setExtractResults] = useState<any[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  // Fonti dati disponibili
  const [dataSources, setDataSources] = useState<DataSource[]>([
    // Banche
    { id: 'unicredit', name: 'UniCredit', type: 'bank', icon: '🏦', url: 'https://www.unicredit.it', connected: false },
    { id: 'intesa', name: 'Intesa Sanpaolo', type: 'bank', icon: '🏦', url: 'https://www.intesasanpaolo.com', connected: false },
    { id: 'bpm', name: 'BPM', type: 'bank', icon: '🏦', url: 'https://www.bpm.it', connected: false },
    { id: 'bper', name: 'BPER Banca', type: 'bank', icon: '🏦', url: 'https://www.bper.it', connected: false },
    // Broker
    { id: 'directa', name: 'Directa SIM', type: 'broker', icon: '📈', url: 'https://www.directa.it', connected: false },
    { id: 'fineco', name: 'Fineco', type: 'broker', icon: '📈', url: 'https://www.fineco.it', connected: false },
    { id: 'degiro', name: 'Degiro', type: 'broker', icon: '📈', url: 'https://www.degiro.it', connected: false },
    // Mercati
    { id: 'morningstar', name: 'Morningstar', type: 'market', icon: '⭐', url: 'https://www.morningstar.it', connected: false },
    { id: 'borsa-italiana', name: 'Borsa Italiana', type: 'market', icon: '🇮🇹', url: 'https://www.borsaitaliana.it', connected: false },
    { id: 'yahoo', name: 'Yahoo Finance', type: 'market', icon: '📊', url: 'https://finance.yahoo.com', connected: false },
    { id: 'justetf', name: 'JustETF', type: 'market', icon: '📊', url: 'https://www.justetf.com', connected: false },
    // Crypto
    { id: 'binance', name: 'Binance', type: 'crypto', icon: '🔶', url: 'https://www.binance.com', connected: false },
    { id: 'coinbase', name: 'Coinbase', type: 'crypto', icon: '🔵', url: 'https://www.coinbase.com', connected: false },
    { id: 'kraken', name: 'Kraken', type: 'crypto', icon: '🐙', url: 'https://www.kraken.com', connected: false }
  ])

  // Carica dati dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem('extractor_imported_funds')
    if (saved) {
      setImportedFunds(JSON.parse(saved))
    }

    const savedAccounts = localStorage.getItem('extractor_accounts')
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    } else {
      // Conti di default
      const defaultAccounts = [
        { id: 'acc-1', name: 'Conto UniCredit', type: 'bank' },
        { id: 'acc-2', name: 'Conto Directa', type: 'broker' },
        { id: 'acc-3', name: 'Wallet Ethereum', type: 'crypto' }
      ]
      setAccounts(defaultAccounts)
      localStorage.setItem('extractor_accounts', JSON.stringify(defaultAccounts))
    }

    const savedSources = localStorage.getItem('extractor_sources')
    if (savedSources) {
      setDataSources(JSON.parse(savedSources))
    }
  }, [])

  // Salva dati
  useEffect(() => {
    localStorage.setItem('extractor_imported_funds', JSON.stringify(importedFunds))
  }, [importedFunds])

  useEffect(() => {
    localStorage.setItem('extractor_sources', JSON.stringify(dataSources))
  }, [dataSources])

  // Connessione a una fonte
  const connectSource = async (source: DataSource) => {
    setIsProcessing(true)
    setSelectedSource(source)
    
    // Simula connessione OAuth
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aggiorna stato fonte
    setDataSources(dataSources.map(s => 
      s.id === source.id 
        ? { ...s, connected: true, lastSync: new Date().toISOString() }
        : s
    ))
    
    setIsProcessing(false)
    setShowConnectModal(false)
    
    alert(`✅ ${source.name} connesso con successo!\n\nAccesso in sola lettura autorizzato.`)
  }

  // Disconnessione fonte
  const disconnectSource = (sourceId: string) => {
    if (!confirm('Sei sicuro di voler disconnettere questa fonte?')) return
    
    setDataSources(dataSources.map(s => 
      s.id === sourceId ? { ...s, connected: false, lastSync: undefined } : s
    ))
  }

  // Estrazione dati da fonti selezionate
  const extractFromSources = async () => {
    if (selectedSources.length === 0) {
      alert('Seleziona almeno una fonte da cui estrarre')
      return
    }

    setIsProcessing(true)
    const results: any[] = []

    for (const sourceId of selectedSources) {
      const source = dataSources.find(s => s.id === sourceId)
      if (!source || !source.connected) continue

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simula estrazione dati dalla fonte
      const extractedData = simulateExtraction(source)
      results.push(...extractedData)
    }

    setExtractResults(results)
    setIsProcessing(false)
    setActiveSection('results')

    alert(`✅ Estrazione completata!\n\n${results.length} fondi trovati.`)
  }

  // Simulazione estrazione dati
  const simulateExtraction = (source: DataSource): any[] => {
    const mockData: Record<string, any[]> = {
      'unicredit': [
        { name: 'Vanguard FTSE All-World', isin: 'IE00BK5BQT80', nav: 105.20, shares: 100, currency: 'EUR' },
        { name: 'iShares Core MSCI World', isin: 'IE00B4L5Y562', nav: 89.32, shares: 75, currency: 'EUR' },
        { name: 'Amundi MSCI Emerging', isin: 'LU1681043599', nav: 45.67, shares: 200, currency: 'EUR' }
      ],
      'intesa': [
        { name: 'SPDR S&P 500', isin: 'IE00B6YX5D40', nav: 412.50, shares: 25, currency: 'EUR' },
        { name: 'Xtrackers MSCI World', isin: 'LU0274208692', nav: 287.30, shares: 50, currency: 'EUR' }
      ],
      'directa': [
        { name: 'iShares MSCI Europe', isin: 'IE00B1YZSC51', nav: 32.45, shares: 500, currency: 'EUR' },
        { name: 'Vanguard S&P 500', isin: 'IE00B3XXRP09', nav: 98.76, shares: 150, currency: 'EUR' }
      ],
      'morningstar': [
        { name: 'Vanguard FTSE All-World', isin: 'IE00BK5BQT80', nav: 105.50, shares: 0, currency: 'EUR' },
        { name: 'iShares Core MSCI World', isin: 'IE00B4L5Y562', nav: 89.45, shares: 0, currency: 'EUR' },
        { name: 'Amundi MSCI Emerging', isin: 'LU1681043599', nav: 45.80, shares: 0, currency: 'EUR' }
      ],
      'borsa-italiana': [
        { name: 'Vanguard FTSE All-World', isin: 'IE00BK5BQT80', nav: 105.35, shares: 0, currency: 'EUR' },
        { name: 'iShares MSCI World', isin: 'IE00B4L5Y562', nav: 89.40, shares: 0, currency: 'EUR' }
      ],
      'yahoo': [
        { name: 'SPY S&P 500 ETF', isin: 'US78462F1030', nav: 450.20, shares: 0, currency: 'USD' },
        { name: 'QQQ Nasdaq 100', isin: 'US46090E1038', nav: 380.50, shares: 0, currency: 'USD' }
      ],
      'binance': [
        { name: 'Bitcoin', isin: 'CRYPTO-BTC', nav: 55000, shares: 0.5, currency: 'EUR' },
        { name: 'Ethereum', isin: 'CRYPTO-ETH', nav: 3000, shares: 5, currency: 'EUR' }
      ]
    }

    const data = mockData[source.id] || []
    return data.map((item, i) => ({
      ...item,
      id: `import-${Date.now()}-${i}`,
      source: source.name,
      accountId: accounts.find(a => a.type === source.type)?.id || 'acc-1',
      accountName: accounts.find(a => a.type === source.type)?.name || 'Conto Default',
      importDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      status: 'imported' as const,
      navAccounting: item.nav,
      navMarket: item.nav * (1 + (Math.random() * 0.02 - 0.01)), // NAV mercato con piccola variazione
      shares: item.shares || 0
    }))
  }

  // Importa dati estratti (si AGGIUNGONO ai fondi esistenti)
  const importExtractedData = () => {
    if (extractResults.length === 0) {
      alert('Nessun dato da importare')
      return
    }

    // Raggruppa per ISIN e unisci i dati
    const grouped: Record<string, ImportedFund> = {}
    
    extractResults.forEach(item => {
      if (!grouped[item.isin]) {
        grouped[item.isin] = {
          ...item,
          id: `fund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      } else {
        // Aggiorna NAV se viene da una fonte mercato
        const existing = grouped[item.isin]
        if (item.shares === 0 && item.nav > 0) {
          // È un dato di mercato, aggiorna NAV mercato
          existing.navMarket = item.nav
        } else if (item.shares > 0) {
          // È un dato di possesso, aggiorna NAV contabile e quote
          existing.navAccounting = item.nav
          existing.shares = item.shares
          existing.accountId = item.accountId
          existing.accountName = item.accountName
        }
      }
    })

    const newFunds = Object.values(grouped)
    
    // AGGIUNGI ai fondi esistenti (non sostituire!)
    setImportedFunds([...importedFunds, ...newFunds])
    
    alert(`✅ ${newFunds.length} fondi importati e aggiunti all'elenco!\n\nTotale fondi: ${importedFunds.length + newFunds.length}`)
    
    setExtractResults([])
    setActiveSection('results')
  }

  // Importazione CSV manuale
  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(l => l.trim())
        const headers = lines[0].split(',')
        
        const newFunds: ImportedFund[] = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          const fund: ImportedFund = {
            id: `csv-${Date.now()}-${i}`,
            name: values[0] || 'Fondo Sconosciuto',
            isin: values[1] || 'UNKNOWN',
            navAccounting: parseFloat(values[2]) || 0,
            navMarket: parseFloat(values[3]) || parseFloat(values[2]) || 0,
            shares: parseFloat(values[4]) || 0,
            currency: values[5] || 'EUR',
            source: 'CSV Import',
            accountId: 'acc-1',
            accountName: 'Conto da CSV',
            importDate: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            status: 'imported'
          }
          newFunds.push(fund)
        }

        // AGGIUNGI ai fondi esistenti
        setImportedFunds([...importedFunds, ...newFunds])
        alert(`✅ ${newFunds.length} fondi importati da CSV e aggiunti all'elenco!`)
      } catch (err) {
        alert('❌ Errore nel parsing del CSV')
      }
    }
    reader.readAsText(file)
  }

  // Rimuovi fondo importato
  const removeImportedFund = (fundId: string) => {
    if (!confirm('Sei sicuro di voler rimuovere questo fondo?')) return
    setImportedFunds(importedFunds.filter(f => f.id !== fundId))
  }

  // Toggle selezione fonte
  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const connectedSources = dataSources.filter(s => s.connected)
  const totalValue = importedFunds.reduce((sum, f) => sum + (f.navAccounting * f.shares), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 border border-violet-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🌐 Estrattore Dati Universale</h2>
        <p className="text-slate-300 mb-4">
          Importa dati da qualsiasi fonte e aggiungili al tuo portafoglio
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Fonti Connesse</p>
            <p className="text-xl font-bold">{connectedSources.length}/{dataSources.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Fondi Importati</p>
            <p className="text-xl font-bold text-emerald-400">{importedFunds.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Valore Totale</p>
            <p className="text-xl font-bold">€{totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Ultimo Import</p>
            <p className="text-sm font-bold">
              {importedFunds.length > 0 
                ? new Date(importedFunds[importedFunds.length - 1].importDate).toLocaleDateString('it-IT')
                : 'Mai'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50 overflow-x-auto">
        {[
          { id: 'sources' as const, label: '🔌 Fonti Dati' },
          { id: 'import' as const, label: '📥 Importa CSV' },
          { id: 'extract' as const, label: '🔍 Estrai Dati' },
          { id: 'results' as const, label: `📊 Fondi Importati (${importedFunds.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sources Section */}
      {activeSection === 'sources' && (
        <div className="space-y-4">
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <p className="text-sm text-violet-300">
              💡 <strong>Collega le fonti</strong> per poter estrarre dati. Clicca su una fonte e autorizza l'accesso in sola lettura.
            </p>
          </div>

          {/* Banche */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🏦</span> Banche ({dataSources.filter(s => s.type === 'bank').length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {dataSources.filter(s => s.type === 'bank').map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onConnect={() => {
                    setSelectedSource(source)
                    setShowConnectModal(true)
                  }}
                  onDisconnect={() => disconnectSource(source.id)}
                />
              ))}
            </div>
          </div>

          {/* Broker */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>📈</span> Broker ({dataSources.filter(s => s.type === 'broker').length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {dataSources.filter(s => s.type === 'broker').map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onConnect={() => {
                    setSelectedSource(source)
                    setShowConnectModal(true)
                  }}
                  onDisconnect={() => disconnectSource(source.id)}
                />
              ))}
            </div>
          </div>

          {/* Mercati */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>📊</span> Mercati Finanziari ({dataSources.filter(s => s.type === 'market').length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {dataSources.filter(s => s.type === 'market').map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onConnect={() => {
                    setSelectedSource(source)
                    setShowConnectModal(true)
                  }}
                  onDisconnect={() => disconnectSource(source.id)}
                />
              ))}
            </div>
          </div>

          {/* Crypto */}
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🪙</span> Exchange Crypto ({dataSources.filter(s => s.type === 'crypto').length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {dataSources.filter(s => s.type === 'crypto').map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onConnect={() => {
                    setSelectedSource(source)
                    setShowConnectModal(true)
                  }}
                  onDisconnect={() => disconnectSource(source.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Section */}
      {activeSection === 'import' && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📥 Importa da File CSV</h3>
            
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-violet-300 mb-2">
                💡 <strong>Formato CSV richiesto:</strong>
              </p>
              <code className="block text-xs text-slate-300 bg-slate-900/50 p-3 rounded font-mono">
                Nome,ISIN,NAV,NAV_Mercato,Quote,Valuta<br />
                Vanguard FTSE,IE00BK5BQT80,105.20,105.50,100,EUR<br />
                iShares World,IE00B4L5Y562,89.32,89.45,75,EUR
              </code>
            </div>

            <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-slate-300 mb-4">Trascina qui il file CSV o clicca per selezionarlo</p>
              <label className="inline-block px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer transition-colors">
                📂 Seleziona File CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={importCSV}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-3">
                I fondi importati verranno <strong className="text-emerald-400">AGGIUNTI</strong> all'elenco esistente
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📝 Esempio Flusso Completo</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold">Vai sulla scheda "🌐 Estrattore"</p>
                  <p className="text-sm text-slate-400">Apri la sezione Estrattore</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold">Clicca "Fonti Dati"</p>
                  <p className="text-sm text-slate-400">Visualizza tutte le fonti disponibili</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold">Cerca "UniCredit" nella lista</p>
                  <p className="text-sm text-slate-400">Trova la tua banca o broker</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold">Clicca "Connetti"</p>
                  <p className="text-sm text-slate-400">Avvia la procedura di connessione</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                <div>
                  <p className="font-semibold">Inserisci le credenziali (solo per lettura)</p>
                  <p className="text-sm text-slate-400">Autenticati con la tua banca</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">6</div>
                <div>
                  <p className="font-semibold">Autorizza l'accesso in sola lettura</p>
                  <p className="text-sm text-slate-400">Conferma l'accesso sicuro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extract Section */}
      {activeSection === 'extract' && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🔍 Estrai Dati da Fonti Connesse</h3>
            
            {connectedSources.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">Nessuna fonte connessa</p>
                <button
                  onClick={() => setActiveSection('sources')}
                  className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors"
                >
                  🔌 Collega una Fonte
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-4">
                  Seleziona le fonti da cui estrarre i dati. I dati verranno <strong className="text-emerald-400">AGGIUNTI</strong> ai fondi esistenti.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {connectedSources.map(source => (
                    <label
                      key={source.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedSources.includes(source.id)
                          ? 'bg-violet-600/20 border-violet-500/50'
                          : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => toggleSourceSelection(source.id)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-2xl">{source.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{source.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{source.type}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={extractFromSources}
                  disabled={isProcessing || selectedSources.length === 0}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Estrazione in corso...
                    </span>
                  ) : (
                    `📥 Estrai da ${selectedSources.length} fonte/i`
                  )}
                </button>
              </>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📋 Flusso Estrazione NAV</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold">Vai sulla scheda "🌐 Estrattore"</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold">Seleziona "Morningstar" e "Borsa Italiana"</p>
                  <p className="text-sm text-slate-400">Scegli le fonti mercato per NAV reali</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold">Clicca "📥 Estrai Dati"</p>
                  <p className="text-sm text-slate-400">Il sistema scarica i NAV aggiornati</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold">Il sistema confronta NAV contabile vs NAV reale</p>
                  <p className="text-sm text-slate-400">Le differenze vengono evidenziate automaticamente</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                <div>
                  <p className="font-semibold text-emerald-300">I dati vengono AGGIUNTI ai fondi esistenti</p>
                  <p className="text-sm text-slate-400">Nessuna sostituzione, solo aggiunta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {activeSection === 'results' && (
        <div className="space-y-4">
          {/* Extract Results */}
          {extractResults.length > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-emerald-300">✨ Dati Estratti - Pronti per Importare</h3>
              <p className="text-sm text-slate-300 mb-4">
                {extractResults.length} fondi trovati. Clicca "Importa" per <strong>AGGIUNGERLI</strong> all'elenco esistente.
              </p>
              
              <div className="bg-slate-900/50 rounded-lg overflow-hidden mb-4 max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 sticky top-0">
                    <tr className="text-left text-xs text-slate-400">
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">ISIN</th>
                      <th className="px-3 py-2">NAV</th>
                      <th className="px-3 py-2">Quote</th>
                      <th className="px-3 py-2">Fonte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractResults.map((item, i) => (
                      <tr key={i} className="border-t border-slate-700/30">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 font-mono text-xs">{item.isin}</td>
                        <td className="px-3 py-2 text-emerald-400">€{item.nav.toFixed(2)}</td>
                        <td className="px-3 py-2">{item.shares}</td>
                        <td className="px-3 py-2 text-xs text-slate-400">{item.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={importExtractedData}
                  className="flex-1 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  ✅ Importa e Aggiungi all'Elenco
                </button>
                <button
                  onClick={() => setExtractResults([])}
                  className="px-6 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  ❌ Annulla
                </button>
              </div>
            </div>
          )}

          {/* Imported Funds */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">📊 Fondi Importati ({importedFunds.length})</h3>
              <button
                onClick={() => {
                  if (confirm('Sei sicuro di voler cancellare TUTTI i fondi importati?')) {
                    setImportedFunds([])
                  }
                }}
                disabled={importedFunds.length === 0}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all disabled:opacity-50"
              >
                🗑️ Cancella Tutti
              </button>
            </div>

            {importedFunds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">Nessun fondo importato</p>
                <p className="text-sm text-slate-500">
                  Vai su "🔌 Fonti Dati" per collegare una fonte, oppure "📥 Importa CSV" per caricare un file
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/50 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 sticky top-0">
                    <tr className="text-left text-xs text-slate-400">
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">ISIN</th>
                      <th className="px-3 py-2">NAV Cont.</th>
                      <th className="px-3 py-2">NAV Merc.</th>
                      <th className="px-3 py-2">Quote</th>
                      <th className="px-3 py-2">Valore</th>
                      <th className="px-3 py-2">Fonte</th>
                      <th className="px-3 py-2">Conto</th>
                      <th className="px-3 py-2">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedFunds.map(fund => {
                      const value = fund.navAccounting * fund.shares
                      const diff = fund.navMarket && fund.navAccounting 
                        ? ((fund.navMarket - fund.navAccounting) / fund.navAccounting * 100)
                        : 0
                      
                      return (
                        <tr key={fund.id} className="border-t border-slate-700/30 hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-medium">{fund.name}</td>
                          <td className="px-3 py-2 font-mono text-xs">{fund.isin}</td>
                          <td className="px-3 py-2">€{fund.navAccounting.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            {fund.navMarket ? (
                              <span className={diff >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                €{fund.navMarket.toFixed(2)}
                                <span className="text-xs ml-1">({diff >= 0 ? '+' : ''}{diff.toFixed(2)}%)</span>
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-3 py-2">{fund.shares}</td>
                          <td className="px-3 py-2 font-semibold text-emerald-400">
                            €{value.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-400">{fund.source}</td>
                          <td className="px-3 py-2 text-xs">{fund.accountName}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => removeImportedFund(fund.id)}
                              className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && selectedSource && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">🔌 Connetti {selectedSource.name}</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300 mb-2">
                  🔒 <strong>Sicurezza:</strong> L'accesso è in <strong>sola lettura</strong>. 
                  Non possiamo effettuare operazioni sul tuo conto.
                </p>
                <p className="text-xs text-slate-400">
                  Verrai reindirizzato al sito di {selectedSource.name} per l'autenticazione sicura.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username / Codice Cliente
                </label>
                <input
                  type="text"
                  placeholder="Il tuo username"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="La tua password"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-300">
                  ⚠️ <strong>Nota:</strong> Le tue credenziali non vengono memorizzate. 
                  Servono solo per questa sessione di connessione.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => connectSource(selectedSource)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {isProcessing ? '⏳ Connessione...' : '🔌 Connetti'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SourceCard({ source, onConnect, onDisconnect }: {
  source: DataSource
  onConnect: () => void
  onDisconnect: () => void
}) {
  return (
    <div className={`bg-slate-900/50 border rounded-xl p-4 transition-all ${
      source.connected ? 'border-emerald-500/30' : 'border-slate-700/50 hover:border-slate-600'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{source.icon}</span>
          <div>
            <h4 className="font-semibold text-sm">{source.name}</h4>
            <p className="text-xs text-slate-400 capitalize">{source.type}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          source.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-300'
        }`}>
          {source.connected ? '✓ Connesso' : '○ Disconnesso'}
        </span>
      </div>
      
      {source.connected && source.lastSync && (
        <p className="text-xs text-slate-500 mb-2">
          Sync: {new Date(source.lastSync).toLocaleString('it-IT')}
        </p>
      )}

      {source.connected ? (
        <button
          onClick={onDisconnect}
          className="w-full px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all"
        >
          🔌 Disconnetti
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="w-full px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-xs text-violet-300 transition-all"
        >
          🔌 Connetti
        </button>
      )}
    </div>
  )
}

export default DataExtractor
