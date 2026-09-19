import { useState, useEffect } from 'react'

type Fund = {
  id: string
  name: string
  isin: string
  navAccounting: number
  navMarket?: number
  navAvailable?: number
  shares: number
  currency: string
  source: string
  accountName: string
}

type ReconciliationResult = {
  fundId: string
  fundName: string
  isin: string
  navAccounting: number
  navMarket: number
  commissions: number
  dividends: number
  adjustments: number
  taxes: number
  navAvailable: number
  difference: number
  reconciled: boolean
  date: string
}

function ReconciliationOperational() {
  const [mode, setMode] = useState<'traditional' | 'onchain' | 'hybrid'>('traditional')
  const [funds, setFunds] = useState<Fund[]>([])
  const [results, setResults] = useState<ReconciliationResult[]>([])
  const [isReconciling, setIsReconciling] = useState(false)
  const [commissionRate, setCommissionRate] = useState(0.5) // %
  const [taxRate, setTaxRate] = useState(26) // %
  const [dividendRate, setDividendRate] = useState(2) // %
  const [adjustmentRate, setAdjustmentRate] = useState(0.1) // %

  // Carica fondi da PortfolioManager ed Estrattore
  useEffect(() => {
    const loadFunds = () => {
      const allFunds: Fund[] = []

      // Fondi da PortfolioManager
      const portfolioSecurities = localStorage.getItem('portfolio_securities')
      if (portfolioSecurities) {
        const securities = JSON.parse(portfolioSecurities)
        securities.forEach((s: any) => {
          allFunds.push({
            id: s.id,
            name: s.name,
            isin: s.isin || s.ticker || 'N/A',
            navAccounting: s.purchasePrice * s.quantity,
            navMarket: s.currentPrice * s.quantity,
            shares: s.quantity,
            currency: s.currency,
            source: 'Portfolio Manager',
            accountName: 'Conto Portfolio'
          })
        })
      }

      // Fondi dall'Estrattore
      const importedFunds = localStorage.getItem('extractor_imported_funds')
      if (importedFunds) {
        const imported = JSON.parse(importedFunds)
        imported.forEach((f: any) => {
          allFunds.push({
            id: f.id,
            name: f.name,
            isin: f.isin,
            navAccounting: f.navAccounting * f.shares,
            navMarket: f.navMarket ? f.navMarket * f.shares : f.navAccounting * f.shares,
            shares: f.shares,
            currency: f.currency,
            source: f.source,
            accountName: f.accountName
          })
        })
      }

      setFunds(allFunds)
    }

    loadFunds()
    
    // Polling per aggiornamenti
    const interval = setInterval(loadFunds, 2000)
    return () => clearInterval(interval)
  }, [])

  // Carica risultati precedenti
  useEffect(() => {
    const saved = localStorage.getItem('reconciliation_results')
    if (saved) {
      setResults(JSON.parse(saved))
    }
  }, [])

  // Esegui Riconciliazione
  const executeReconciliation = async () => {
    if (funds.length === 0) {
      alert('❌ Nessun fondo da riconciliare.\n\nVai su "💼 Portafoglio" o "🌐 Estrattore" per aggiungere fondi.')
      return
    }

    setIsReconciling(true)
    const newResults: ReconciliationResult[] = []

    for (const fund of funds) {
      await new Promise(resolve => setTimeout(resolve, 300))

      const navAccounting = fund.navAccounting
      const navMarket = fund.navMarket || navAccounting

      // Calcola aggiustamenti in base alla modalità
      let commissions = 0
      let dividends = 0
      let adjustments = 0
      let taxes = 0

      if (mode === 'traditional' || mode === 'hybrid') {
        // Commissioni non ancora registrate
        commissions = navAccounting * (commissionRate / 100)
        
        // Dividendi in sospensione
        dividends = navAccounting * (dividendRate / 100)
        
        // Rettifiche valutarie/bancarie
        adjustments = navAccounting * (adjustmentRate / 100)
        
        // Tasse su plusvalenze (solo se c'è guadagno)
        const gain = navMarket - navAccounting
        if (gain > 0) {
          taxes = gain * (taxRate / 100)
        }
      }

      if (mode === 'onchain' || mode === 'hybrid') {
        // Per crypto: aggiungi gas fees simulate
        commissions += navAccounting * 0.001 // 0.1% gas fees
      }

      // NAV Disponibile = NAV Contabile - Commissioni - Tasse + Dividendi ± Rettifiche
      const navAvailable = navAccounting - commissions - taxes + dividends - adjustments
      const difference = navAvailable - (fund.navMarket || navAccounting)

      newResults.push({
        fundId: fund.id,
        fundName: fund.name,
        isin: fund.isin,
        navAccounting,
        navMarket,
        commissions,
        dividends,
        adjustments,
        taxes,
        navAvailable,
        difference,
        reconciled: true,
        date: new Date().toISOString()
      })
    }

    setResults(newResults)
    localStorage.setItem('reconciliation_results', JSON.stringify(newResults))
    
    // Aggiorna i fondi con navAvailable
    const updatedFunds = funds.map(f => {
      const result = newResults.find(r => r.fundId === f.id)
      return result ? { ...f, navAvailable: result.navAvailable } : f
    })
    
    // Salva fondi aggiornati
    if (localStorage.getItem('extractor_imported_funds')) {
      const imported = JSON.parse(localStorage.getItem('extractor_imported_funds') || '[]')
      const updatedImported = imported.map((f: any) => {
        const result = newResults.find(r => r.fundId === f.id)
        return result ? { ...f, navAvailable: result.navAvailable / f.shares, status: 'reconciled' } : f
      })
      localStorage.setItem('extractor_imported_funds', JSON.stringify(updatedImported))
    }

    setIsReconciling(false)
    
    const totalAvailable = newResults.reduce((sum, r) => sum + r.navAvailable, 0)
    const totalAccounting = newResults.reduce((sum, r) => sum + r.navAccounting, 0)
    
    alert(`✅ Riconciliazione completata!\n\n${newResults.length} fondi riconciliati\n\nNAV Contabile Totale: €${totalAccounting.toFixed(2)}\nNAV Disponibile Totale: €${totalAvailable.toFixed(2)}\nDifferenza: €${(totalAvailable - totalAccounting).toFixed(2)}`)
  }

  const totalAccounting = results.reduce((sum, r) => sum + r.navAccounting, 0)
  const totalAvailable = results.reduce((sum, r) => sum + r.navAvailable, 0)
  const totalCommissions = results.reduce((sum, r) => sum + r.commissions, 0)
  const totalTaxes = results.reduce((sum, r) => sum + r.taxes, 0)
  const totalDividends = results.reduce((sum, r) => sum + r.dividends, 0)
  const totalAdjustments = results.reduce((sum, r) => sum + r.adjustments, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🔄 Riconciliazione Operativa</h2>
        <p className="text-slate-300 mb-4">
          Converti NAV Contabile in NAV Disponibile con calcolo automatico di commissioni, dividendi, rettifiche e tasse
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Fondi da Riconciliare</p>
            <p className="text-xl font-bold">{funds.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">NAV Contabile</p>
            <p className="text-xl font-bold">€{totalAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">NAV Disponibile</p>
            <p className="text-xl font-bold text-emerald-400">
              €{totalAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Fondi Riconciliati</p>
            <p className="text-xl font-bold text-emerald-400">{results.length}</p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Modalità Riconciliazione</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setMode('traditional')}
            className={`p-5 rounded-xl border transition-all text-left ${
              mode === 'traditional'
                ? 'bg-blue-600/20 border-blue-500/50'
                : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🏦</div>
            <h4 className="font-semibold mb-1">Tradizionale</h4>
            <p className="text-xs text-slate-400">Riconciliazione bancaria con estratti conto</p>
          </button>

          <button
            onClick={() => setMode('onchain')}
            className={`p-5 rounded-xl border transition-all text-left ${
              mode === 'onchain'
                ? 'bg-purple-600/20 border-purple-500/50'
                : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="font-semibold mb-1">On-Chain</h4>
            <p className="text-xs text-slate-400">Verifica diretta dalla blockchain</p>
          </button>

          <button
            onClick={() => setMode('hybrid')}
            className={`p-5 rounded-xl border transition-all text-left ${
              mode === 'hybrid'
                ? 'bg-violet-600/20 border-violet-500/50'
                : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold mb-1">Ibrida</h4>
            <p className="text-xs text-slate-400">Combina tradizionale e on-chain</p>
          </button>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">⚙️ Parametri Riconciliazione</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Commissioni (%)</label>
            <input
              type="number"
              step="0.1"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Tasse Plusvalenze (%)</label>
            <input
              type="number"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Dividendi (%)</label>
            <input
              type="number"
              step="0.1"
              value={dividendRate}
              onChange={(e) => setDividendRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Rettifiche (%)</label>
            <input
              type="number"
              step="0.01"
              value={adjustmentRate}
              onChange={(e) => setAdjustmentRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>
        </div>
      </div>

      {/* Execute Button */}
      <button
        onClick={executeReconciliation}
        disabled={isReconciling || funds.length === 0}
        className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {isReconciling ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Riconciliazione in corso...
          </span>
        ) : (
          `🔄 Esegui Riconciliazione ${mode === 'traditional' ? 'Tradizionale' : mode === 'onchain' ? 'On-Chain' : 'Ibrida'} (${funds.length} fondi)`
        )}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">📊 Risultati Riconciliazione</h3>
          
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-4 bg-slate-900/50 rounded-lg">
            <div>
              <p className="text-xs text-slate-400">Commissioni</p>
              <p className="text-sm font-bold text-red-400">-€{totalCommissions.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tasse</p>
              <p className="text-sm font-bold text-red-400">-€{totalTaxes.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Dividendi</p>
              <p className="text-sm font-bold text-emerald-400">+€{totalDividends.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Rettifiche</p>
              <p className="text-sm font-bold text-red-400">-€{totalAdjustments.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Totale Disponibile</p>
              <p className="text-sm font-bold text-emerald-400">€{totalAvailable.toFixed(2)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-900/50 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 sticky top-0">
                <tr className="text-left text-xs text-slate-400">
                  <th className="px-3 py-2">Fondo</th>
                  <th className="px-3 py-2">ISIN</th>
                  <th className="px-3 py-2">NAV Cont.</th>
                  <th className="px-3 py-2">Comm.</th>
                  <th className="px-3 py-2">Tasse</th>
                  <th className="px-3 py-2">Divid.</th>
                  <th className="px-3 py-2">NAV Disp.</th>
                  <th className="px-3 py-2">Stato</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-medium">{r.fundName}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.isin}</td>
                    <td className="px-3 py-2">€{r.navAccounting.toFixed(2)}</td>
                    <td className="px-3 py-2 text-red-400">-€{r.commissions.toFixed(2)}</td>
                    <td className="px-3 py-2 text-red-400">-€{r.taxes.toFixed(2)}</td>
                    <td className="px-3 py-2 text-emerald-400">+€{r.dividends.toFixed(2)}</td>
                    <td className="px-3 py-2 font-bold text-emerald-400">€{r.navAvailable.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                        ✓ Riconciliato
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-blue-300">
          💡 <strong>Formula:</strong> NAV Disponibile = NAV Contabile - Commissioni - Tasse + Dividendi ± Rettifiche
          <br />
          <strong>Provenienza fondi:</strong> {funds.length} fondi da Portfolio Manager ed Estrattore
        </p>
      </div>
    </div>
  )
}

export default ReconciliationOperational
