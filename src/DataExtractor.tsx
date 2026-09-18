import { useState } from 'react'

type DataSource = {
  id: string
  name: string
  type: 'traditional' | 'onchain' | 'hybrid'
  category: 'bank' | 'broker' | 'crypto' | 'fund' | 'custom'
  url?: string
  apiEndpoint?: string
  icon: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
}

type ExtractedData = {
  id: string
  sourceId: string
  timestamp: string
  data: {
    accounts?: any[]
    funds?: any[]
    transactions?: any[]
    wallets?: any[]
    navs?: any[]
  }
  status: 'success' | 'partial' | 'error'
  error?: string
}

type ReconciliationMode = 'traditional' | 'onchain' | 'hybrid'

type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf' | 'xml' | 'sql'

function DataExtractor() {
  const [activeSection, setActiveSection] = useState<'sources' | 'extraction' | 'reconciliation' | 'export'>('sources')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [extractionMode, setExtractionMode] = useState<'all' | 'selected'>('all')
  const [reconciliationMode, setReconciliationMode] = useState<ReconciliationMode>('hybrid')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>('csv')

  // Fonti dati disponibili
  const [dataSources, setDataSources] = useState<DataSource[]>([
    // Traditional Finance
    {
      id: 'morningstar',
      name: 'Morningstar',
      type: 'traditional',
      category: 'fund',
      url: 'https://www.morningstar.it',
      icon: '⭐',
      status: 'connected',
      lastSync: '2024-01-15 14:30:00'
    },
    {
      id: 'yahoo-finance',
      name: 'Yahoo Finance',
      type: 'traditional',
      category: 'fund',
      apiEndpoint: 'https://query1.finance.yahoo.com/v8/finance/chart/',
      icon: '📈',
      status: 'connected',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      id: 'borsa-italiana',
      name: 'Borsa Italiana',
      type: 'traditional',
      category: 'fund',
      url: 'https://www.borsaitaliana.it',
      icon: '🇮🇹',
      status: 'connected',
      lastSync: '2024-01-15 14:20:00'
    },
    {
      id: 'directa',
      name: 'Directa SIM',
      type: 'traditional',
      category: 'broker',
      url: 'https://www.directa.it',
      icon: '🏦',
      status: 'connected',
      lastSync: '2024-01-15 14:15:00'
    },
    {
      id: 'fineco',
      name: 'Fineco',
      type: 'traditional',
      category: 'broker',
      url: 'https://www.fineco.it',
      icon: '🏦',
      status: 'disconnected',
      lastSync: '2024-01-14 10:00:00'
    },
    {
      id: 'intesa',
      name: 'Intesa Sanpaolo',
      type: 'traditional',
      category: 'bank',
      url: 'https://www.intesasanpaolo.com',
      icon: '🏦',
      status: 'connected',
      lastSync: '2024-01-15 14:10:00'
    },
    // On-Chain
    {
      id: 'etherscan',
      name: 'Etherscan',
      type: 'onchain',
      category: 'crypto',
      apiEndpoint: 'https://api.etherscan.io/api',
      icon: 'Ξ',
      status: 'connected',
      lastSync: '2024-01-15 14:30:00'
    },
    {
      id: 'blockchain-com',
      name: 'Blockchain.com',
      type: 'onchain',
      category: 'crypto',
      apiEndpoint: 'https://blockchain.info',
      icon: '₿',
      status: 'connected',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      id: 'polygonscan',
      name: 'Polygonscan',
      type: 'onchain',
      category: 'crypto',
      apiEndpoint: 'https://api.polygonscan.com/api',
      icon: '⬡',
      status: 'connected',
      lastSync: '2024-01-15 14:20:00'
    },
    {
      id: 'binance',
      name: 'Binance',
      type: 'onchain',
      category: 'crypto',
      apiEndpoint: 'https://api.binance.com/api/v3',
      icon: '🔶',
      status: 'connected',
      lastSync: '2024-01-15 14:15:00'
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      type: 'onchain',
      category: 'crypto',
      apiEndpoint: 'https://api.coinbase.com/v2',
      icon: '🔵',
      status: 'disconnected',
      lastSync: '2024-01-14 12:00:00'
    },
    // Hybrid
    {
      id: 'justetf',
      name: 'JustETF',
      type: 'hybrid',
      category: 'fund',
      url: 'https://www.justetf.com',
      icon: '📊',
      status: 'connected',
      lastSync: '2024-01-15 14:30:00'
    },
    {
      id: 'degiro',
      name: 'Degiro',
      type: 'hybrid',
      category: 'broker',
      url: 'https://www.degiro.it',
      icon: '🏦',
      status: 'connected',
      lastSync: '2024-01-15 14:25:00'
    },
    {
      id: 'ledger',
      name: 'Ledger Live',
      type: 'hybrid',
      category: 'crypto',
      url: 'https://ledger.com',
      icon: '💼',
      status: 'connected',
      lastSync: '2024-01-15 14:20:00'
    }
  ])

  const extractData = async () => {
    setIsExtracting(true)
    setExtractedData([])

    const sourcesToExtract = extractionMode === 'all' 
      ? dataSources.filter(s => s.status === 'connected')
      : dataSources.filter(s => selectedSources.includes(s.id) && s.status === 'connected')

    for (const source of sourcesToExtract) {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simula estrazione

      const extracted: ExtractedData = {
        id: `${source.id}-${Date.now()}`,
        sourceId: source.id,
        timestamp: new Date().toISOString(),
        data: generateMockData(source),
        status: 'success'
      }

      setExtractedData(prev => [...prev, extracted])
    }

    setIsExtracting(false)
  }

  const generateMockData = (source: DataSource) => {
    if (source.type === 'traditional') {
      return {
        funds: [
          { isin: 'IE00BK5BQT80', name: 'Vanguard FTSE All-World', nav: 125.43, currency: 'EUR', date: '2024-01-15' },
          { isin: 'IE00B4L5Y562', name: 'iShares MSCI World', nav: 89.32, currency: 'EUR', date: '2024-01-15' }
        ],
        accounts: [
          { id: 'acc-1', name: 'Conto Trading', balance: 89500.00, currency: 'EUR' }
        ]
      }
    } else if (source.type === 'onchain') {
      return {
        wallets: [
          { address: '0x742d35Cc...', blockchain: 'ethereum', balance: 2.456, currency: 'ETH', balanceFiat: 8920.50 },
          { address: 'bc1qxy2kgd...', blockchain: 'bitcoin', balance: 0.1234, currency: 'BTC', balanceFiat: 6780.25 }
        ],
        transactions: [
          { hash: '0x1234...', type: 'incoming', value: 1.2, currency: 'ETH', status: 'confirmed' }
        ]
      }
    } else {
      return {
        funds: [
          { isin: 'IE00BK5BQT80', name: 'Vanguard FTSE All-World', nav: 125.43, currency: 'EUR' }
        ],
        wallets: [
          { address: '0x742d35Cc...', blockchain: 'ethereum', balance: 2.456, currency: 'ETH' }
        ],
        accounts: [
          { id: 'acc-1', name: 'Conto Ibrido', balance: 150000.00, currency: 'EUR' }
        ]
      }
    }
  }

  const reconcileData = async () => {
    // Simula riconciliazione
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert(`Riconciliazione ${reconciliationMode} completata!`)
  }

  const exportData = (format: ExportFormat) => {
    let content = ''
    let filename = ''
    let mimeType = ''

    const exportObj = {
      extractedData,
      reconciliationMode,
      exportDate: new Date().toISOString(),
      sources: dataSources.filter(s => s.status === 'connected')
    }

    switch (format) {
      case 'csv':
        const csvRows = [
          ['Source', 'Type', 'Category', 'Timestamp', 'Status'],
          ...extractedData.map(d => {
            const source = dataSources.find(s => s.id === d.sourceId)
            return [source?.name, source?.type, source?.category, d.timestamp, d.status]
          })
        ]
        content = csvRows.map(row => row.join(',')).join('\n')
        filename = `reconciliation_export_${Date.now()}.csv`
        mimeType = 'text/csv'
        break

      case 'json':
        content = JSON.stringify(exportObj, null, 2)
        filename = `reconciliation_export_${Date.now()}.json`
        mimeType = 'application/json'
        break

      case 'excel':
        // Simula export Excel (in produzione useresti una libreria come xlsx)
        content = JSON.stringify(exportObj)
        filename = `reconciliation_export_${Date.now()}.xlsx`
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break

      case 'pdf':
        // Simula export PDF
        content = JSON.stringify(exportObj)
        filename = `reconciliation_export_${Date.now()}.pdf`
        mimeType = 'application/pdf'
        break

      case 'xml':
        content = `<?xml version="1.0" encoding="UTF-8"?>
<reconciliation>
  <exportDate>${exportObj.exportDate}</exportDate>
  <mode>${exportObj.reconciliationMode}</mode>
  <data>
    ${exportObj.extractedData.map(d => `
    <entry>
      <sourceId>${d.sourceId}</sourceId>
      <timestamp>${d.timestamp}</timestamp>
      <status>${d.status}</status>
    </entry>`).join('')}
  </data>
</reconciliation>`
        filename = `reconciliation_export_${Date.now()}.xml`
        mimeType = 'application/xml'
        break

      case 'sql':
        content = `-- Reconciliation Export
-- Generated: ${exportObj.exportDate}
-- Mode: ${exportObj.reconciliationMode}

CREATE TABLE reconciliation_data (
  id VARCHAR(255) PRIMARY KEY,
  source_id VARCHAR(255),
  timestamp TIMESTAMP,
  status VARCHAR(50)
);

${exportObj.extractedData.map(d => 
  `INSERT INTO reconciliation_data VALUES ('${d.id}', '${d.sourceId}', '${d.timestamp}', '${d.status}');`
).join('\n')}`
        filename = `reconciliation_export_${Date.now()}.sql`
        mimeType = 'application/sql'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    setShowExportModal(false)
  }

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const connectedSources = dataSources.filter(s => s.status === 'connected')
  const traditionalSources = dataSources.filter(s => s.type === 'traditional')
  const onchainSources = dataSources.filter(s => s.type === 'onchain')
  const hybridSources = dataSources.filter(s => s.type === 'hybrid')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 border border-violet-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🌐 Estrazione Dati Universale</h2>
        <p className="text-slate-300 mb-4">
          Estrai dati da qualsiasi sito, applicazione o piattaforma e riconcilia on-chain o tradizionalmente
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Fonti Connesse</p>
            <p className="text-xl font-bold">{connectedSources.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Dati Estratti</p>
            <p className="text-xl font-bold">{extractedData.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Modalità Riconciliazione</p>
            <p className="text-xl font-bold capitalize">{reconciliationMode}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Formati Export</p>
            <p className="text-xl font-bold">6</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50 overflow-x-auto">
        {[
          { id: 'sources' as const, label: '🌐 Fonti Dati' },
          { id: 'extraction' as const, label: '📥 Estrazione' },
          { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
          { id: 'export' as const, label: '📤 Export' }
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
        <div className="space-y-6">
          {/* Traditional Finance */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🏦</span> Finanza Tradizionale ({traditionalSources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {traditionalSources.map(source => (
                <div
                  key={source.id}
                  className={`bg-slate-800/40 border rounded-xl p-4 transition-all ${
                    selectedSources.includes(source.id)
                      ? 'border-violet-500/50 bg-violet-500/10'
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <h4 className="font-semibold">{source.name}</h4>
                        <p className="text-xs text-slate-400 capitalize">{source.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      source.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                      source.status === 'disconnected' ? 'bg-slate-500/20 text-slate-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {source.status === 'connected' ? '✓' : source.status === 'disconnected' ? '○' : '✗'}
                    </span>
                  </div>
                  {source.url && (
                    <p className="text-xs text-slate-500 truncate mb-2">{source.url}</p>
                  )}
                  {source.lastSync && (
                    <p className="text-xs text-slate-500">Ultimo sync: {source.lastSync}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* On-Chain */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🔗</span> On-Chain / Crypto ({onchainSources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {onchainSources.map(source => (
                <div
                  key={source.id}
                  className={`bg-slate-800/40 border rounded-xl p-4 transition-all ${
                    selectedSources.includes(source.id)
                      ? 'border-violet-500/50 bg-violet-500/10'
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <h4 className="font-semibold">{source.name}</h4>
                        <p className="text-xs text-slate-400 capitalize">{source.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      source.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                      source.status === 'disconnected' ? 'bg-slate-500/20 text-slate-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {source.status === 'connected' ? '✓' : source.status === 'disconnected' ? '○' : '✗'}
                    </span>
                  </div>
                  {source.apiEndpoint && (
                    <p className="text-xs text-slate-500 truncate mb-2">{source.apiEndpoint}</p>
                  )}
                  {source.lastSync && (
                    <p className="text-xs text-slate-500">Ultimo sync: {source.lastSync}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hybrid */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🔄</span> Ibride ({hybridSources.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hybridSources.map(source => (
                <div
                  key={source.id}
                  className={`bg-slate-800/40 border rounded-xl p-4 transition-all ${
                    selectedSources.includes(source.id)
                      ? 'border-violet-500/50 bg-violet-500/10'
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <h4 className="font-semibold">{source.name}</h4>
                        <p className="text-xs text-slate-400 capitalize">{source.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      source.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                      source.status === 'disconnected' ? 'bg-slate-500/20 text-slate-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {source.status === 'connected' ? '✓' : source.status === 'disconnected' ? '○' : '✗'}
                    </span>
                  </div>
                  {source.url && (
                    <p className="text-xs text-slate-500 truncate mb-2">{source.url}</p>
                  )}
                  {source.lastSync && (
                    <p className="text-xs text-slate-500">Ultimo sync: {source.lastSync}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Extraction Section */}
      {activeSection === 'extraction' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Configura Estrazione</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Modalità estrazione
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setExtractionMode('all')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      extractionMode === 'all'
                        ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-400'
                    }`}
                  >
                    🌐 Tutte le fonti connesse ({connectedSources.length})
                  </button>
                  <button
                    onClick={() => setExtractionMode('selected')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                      extractionMode === 'selected'
                        ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-400'
                    }`}
                  >
                    🎯 Fonti selezionate ({selectedSources.length})
                  </button>
                </div>
              </div>

              <button
                onClick={extractData}
                disabled={isExtracting || (extractionMode === 'selected' && selectedSources.length === 0)}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isExtracting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Estrazione in corso...
                  </span>
                ) : (
                  '📥 Estrai Dati'
                )}
              </button>
            </div>
          </div>

          {/* Extracted Data */}
          {extractedData.length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Dati Estratti ({extractedData.length})</h3>
              <div className="space-y-3">
                {extractedData.map(data => {
                  const source = dataSources.find(s => s.id === data.sourceId)
                  return (
                    <div key={data.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{source?.icon}</span>
                          <div>
                            <h4 className="font-semibold">{source?.name}</h4>
                            <p className="text-xs text-slate-400">{new Date(data.timestamp).toLocaleString('it-IT')}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          data.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                          data.status === 'partial' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {data.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {data.data.funds && <span className="text-slate-400">Fondi: {data.data.funds.length}</span>}
                        {data.data.wallets && <span className="text-slate-400">Wallet: {data.data.wallets.length}</span>}
                        {data.data.accounts && <span className="text-slate-400">Conti: {data.data.accounts.length}</span>}
                        {data.data.transactions && <span className="text-slate-400">TX: {data.data.transactions.length}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reconciliation Section */}
      {activeSection === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Modalità Riconciliazione</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setReconciliationMode('traditional')}
                className={`p-5 rounded-xl border transition-all text-left ${
                  reconciliationMode === 'traditional'
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">🏦</div>
                <h4 className="font-semibold mb-1">Tradizionale</h4>
                <p className="text-xs text-slate-400">Riconciliazione bancaria classica con estratti conto</p>
              </button>

              <button
                onClick={() => setReconciliationMode('onchain')}
                className={`p-5 rounded-xl border transition-all text-left ${
                  reconciliationMode === 'onchain'
                    ? 'bg-purple-600/20 border-purple-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">🔗</div>
                <h4 className="font-semibold mb-1">On-Chain</h4>
                <p className="text-xs text-slate-400">Verifica diretta dalla blockchain con conferme</p>
              </button>

              <button
                onClick={() => setReconciliationMode('hybrid')}
                className={`p-5 rounded-xl border transition-all text-left ${
                  reconciliationMode === 'hybrid'
                    ? 'bg-violet-600/20 border-violet-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">🔄</div>
                <h4 className="font-semibold mb-1">Ibrida</h4>
                <p className="text-xs text-slate-400">Combina tradizionale e on-chain per massima accuratezza</p>
              </button>
            </div>

            <button
              onClick={reconcileData}
              disabled={extractedData.length === 0}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              🔄 Esegui Riconciliazione {reconciliationMode}
            </button>
          </div>
        </div>
      )}

      {/* Export Section */}
      {activeSection === 'export' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Esporta Dati</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => exportData('csv')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold mb-1">CSV</h4>
                <p className="text-xs text-slate-400">Excel, Google Sheets</p>
              </button>

              <button
                onClick={() => exportData('json')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">📄</div>
                <h4 className="font-semibold mb-1">JSON</h4>
                <p className="text-xs text-slate-400">API, automazioni</p>
              </button>

              <button
                onClick={() => exportData('excel')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">📈</div>
                <h4 className="font-semibold mb-1">Excel</h4>
                <p className="text-xs text-slate-400">.xlsx formattato</p>
              </button>

              <button
                onClick={() => exportData('pdf')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">📕</div>
                <h4 className="font-semibold mb-1">PDF</h4>
                <p className="text-xs text-slate-400">Report professionale</p>
              </button>

              <button
                onClick={() => exportData('xml')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">📋</div>
                <h4 className="font-semibold mb-1">XML</h4>
                <p className="text-xs text-slate-400">Integrazioni enterprise</p>
              </button>

              <button
                onClick={() => exportData('sql')}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-3xl mb-2">🗄️</div>
                <h4 className="font-semibold mb-1">SQL</h4>
                <p className="text-xs text-slate-400">Database queries</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataExtractor
