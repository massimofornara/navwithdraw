import { useState } from 'react'

type Fund = {
  id: string
  name: string
  isin: string
  navAccounting: number // NAV contabile
  navAvailable: number // NAV disponibile (dopo riconciliazione)
  bankBalance: number // Saldo bancario
  shares: number // Numero quote
  currency: string
  lastUpdate: string
  status: 'reconciled' | 'pending' | 'discrepancy'
}

type ReconciliationEntry = {
  id: string
  fundId: string
  date: string
  type: 'dividend' | 'fee' | 'adjustment' | 'transfer'
  description: string
  amount: number
  status: 'cleared' | 'pending' | 'discrepancy'
}

type ReconciliationReport = {
  fundId: string
  date: string
  navAccounting: number
  navAvailable: number
  bankBalance: number
  differences: {
    description: string
    amount: number
  }[]
  totalDifferences: number
  reconciled: boolean
}

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reconciliation' | 'conversion' | 'reports'>('dashboard')
  
  // Dati di esempio
  const [funds, setFunds] = useState<Fund[]>([
    {
      id: '1',
      name: 'Vanguard FTSE All-World',
      isin: 'IE00BK5BQT80',
      navAccounting: 125000.00,
      navAvailable: 124850.50,
      bankBalance: 124850.50,
      shares: 1000,
      currency: 'EUR',
      lastUpdate: '2024-01-15',
      status: 'reconciled'
    },
    {
      id: '2',
      name: 'iShares MSCI World',
      isin: 'IE00B4L5Y562',
      navAccounting: 89500.00,
      navAvailable: 89320.75,
      bankBalance: 89320.75,
      shares: 750,
      currency: 'EUR',
      lastUpdate: '2024-01-15',
      status: 'reconciled'
    },
    {
      id: '3',
      name: 'Amundi MSCI Emerging',
      isin: 'LU1681043599',
      navAccounting: 45000.00,
      navAvailable: 44875.25,
      bankBalance: 44750.00,
      shares: 500,
      currency: 'EUR',
      lastUpdate: '2024-01-14',
      status: 'discrepancy'
    }
  ])

  const [entries, setEntries] = useState<ReconciliationEntry[]>([
    {
      id: '1',
      fundId: '1',
      date: '2024-01-10',
      type: 'dividend',
      description: 'Dividendo trimestrale',
      amount: 150.00,
      status: 'cleared'
    },
    {
      id: '2',
      fundId: '1',
      date: '2024-01-12',
      type: 'fee',
      description: 'Commissioni gestione',
      amount: -5.50,
      status: 'cleared'
    },
    {
      id: '3',
      fundId: '3',
      date: '2024-01-13',
      type: 'adjustment',
      description: 'Rettifica valutaria',
      amount: -125.00,
      status: 'pending'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)

  const totalNAVAccounting = funds.reduce((sum, f) => sum + f.navAccounting, 0)
  const totalNAVAvailable = funds.reduce((sum, f) => sum + f.navAvailable, 0)
  const totalBankBalance = funds.reduce((sum, f) => sum + f.bankBalance, 0)
  const totalDifferences = totalNAVAccounting - totalBankBalance

  const reconcileFund = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId)
    if (!fund) return

    // Calcola le differenze
    const fundEntries = entries.filter(e => e.fundId === fundId)
    const totalAdjustments = fundEntries
      .filter(e => e.status === 'cleared')
      .reduce((sum, e) => sum + e.amount, 0)

    // Aggiorna il NAV disponibile
    const newNAVAvailable = fund.navAccounting + totalAdjustments

    setFunds(funds.map(f => 
      f.id === fundId 
        ? { ...f, navAvailable: newNAVAvailable, status: 'reconciled' as const }
        : f
    ))

    setShowModal(false)
  }

  const convertToAvailable = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId)
    if (!fund) return

    // Simula la conversione da contabile a disponibile
    setFunds(funds.map(f => 
      f.id === fundId 
        ? { ...f, navAvailable: f.navAccounting, status: 'reconciled' as const }
        : f
    ))
  }

  const generateReport = (fundId: string): ReconciliationReport => {
    const fund = funds.find(f => f.id === fundId)!
    const fundEntries = entries.filter(e => e.fundId === fundId)

    return {
      fundId,
      date: new Date().toISOString().split('T')[0],
      navAccounting: fund.navAccounting,
      navAvailable: fund.navAvailable,
      bankBalance: fund.bankBalance,
      differences: fundEntries.map(e => ({
        description: e.description,
        amount: e.amount
      })),
      totalDifferences: fund.navAccounting - fund.bankBalance,
      reconciled: fund.status === 'reconciled'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-700/50 backdrop-blur-md bg-slate-900/70 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/20">
                €
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold">NAV Reconciliation</h1>
                <p className="text-xs text-slate-400">Riconciliazione Bancaria e Gestione Fondi</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
                ✓ Contabile
              </span>
              <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">
                ✓ Disponibile
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50">
          {[
            { id: 'dashboard' as const, label: '📊 Dashboard' },
            { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
            { id: 'conversion' as const, label: '💱 Conversione' },
            { id: 'reports' as const, label: '📄 Report' }
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

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-5">
                <p className="text-sm text-blue-300 mb-1">NAV Contabile</p>
                <p className="text-2xl font-bold">€{totalNAVAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">{funds.length} fondi</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-5">
                <p className="text-sm text-emerald-300 mb-1">NAV Disponibile</p>
                <p className="text-2xl font-bold">€{totalNAVAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">Dopo riconciliazione</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-5">
                <p className="text-sm text-cyan-300 mb-1">Saldo Bancario</p>
                <p className="text-2xl font-bold">€{totalBankBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">Confermato dalla banca</p>
              </div>
              <div className={`bg-gradient-to-br ${totalDifferences === 0 ? 'from-green-600/20 to-green-800/20 border-green-500/30' : 'from-red-600/20 to-red-800/20 border-red-500/30'} border rounded-xl p-5`}>
                <p className={`text-sm ${totalDifferences === 0 ? 'text-green-300' : 'text-red-300'} mb-1`}>Differenze</p>
                <p className="text-2xl font-bold">€{totalDifferences.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">{totalDifferences === 0 ? '✓ Riconciliato' : '⚠ Da verificare'}</p>
              </div>
            </div>

            {/* Funds Table */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-xl font-bold">Portafoglio Fondi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-5 py-3">Fondo</th>
                      <th className="px-5 py-3">ISIN</th>
                      <th className="px-5 py-3">NAV Contabile</th>
                      <th className="px-5 py-3">NAV Disponibile</th>
                      <th className="px-5 py-3">Saldo Banca</th>
                      <th className="px-5 py-3">Quote</th>
                      <th className="px-5 py-3">Stato</th>
                      <th className="px-5 py-3">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funds.map((fund) => (
                      <tr key={fund.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                        <td className="px-5 py-4 font-medium">{fund.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-400 font-mono">{fund.isin}</td>
                        <td className="px-5 py-4">€{fund.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4 text-emerald-400">€{fund.navAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4 text-cyan-400">€{fund.bankBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4">{fund.shares.toLocaleString('it-IT')}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fund.status === 'reconciled' ? 'bg-emerald-500/20 text-emerald-300' :
                            fund.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {fund.status === 'reconciled' ? '✓ Riconciliato' :
                             fund.status === 'pending' ? '⏳ In attesa' : '⚠ Differenze'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => {
                              setSelectedFund(fund)
                              setShowModal(true)
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs text-emerald-300 transition-all"
                          >
                            Riconcilia
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reconciliation */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Processo di Riconciliazione</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Identifica le differenze</h4>
                    <p className="text-sm text-slate-400 mt-1">Confronta il NAV contabile con il saldo bancario effettivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Analizza le voci</h4>
                    <p className="text-sm text-slate-400 mt-1">Dividendi, commissioni, rettifiche valutarie, trasferimenti</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Registra le rettifiche</h4>
                    <p className="text-sm text-slate-400 mt-1">Aggiusta il NAV contabile per riflettere il valore reale</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Conferma la riconciliazione</h4>
                    <p className="text-sm text-slate-400 mt-1">NAV Disponibile = Saldo Bancario</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Entries Table */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-xl font-bold">Voci di Riconciliazione</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-5 py-3">Data</th>
                      <th className="px-5 py-3">Fondo</th>
                      <th className="px-5 py-3">Tipo</th>
                      <th className="px-5 py-3">Descrizione</th>
                      <th className="px-5 py-3">Importo</th>
                      <th className="px-5 py-3">Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => {
                      const fund = funds.find(f => f.id === entry.fundId)
                      return (
                        <tr key={entry.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                          <td className="px-5 py-4 text-sm">{entry.date}</td>
                          <td className="px-5 py-4 font-medium">{fund?.name}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              entry.type === 'dividend' ? 'bg-emerald-500/20 text-emerald-300' :
                              entry.type === 'fee' ? 'bg-red-500/20 text-red-300' :
                              entry.type === 'adjustment' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {entry.type === 'dividend' ? 'Dividendo' :
                               entry.type === 'fee' ? 'Commissione' :
                               entry.type === 'adjustment' ? 'Rettifica' : 'Trasferimento'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-300">{entry.description}</td>
                          <td className={`px-5 py-4 font-mono ${entry.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {entry.amount >= 0 ? '+' : ''}€{entry.amount.toFixed(2)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              entry.status === 'cleared' ? 'bg-emerald-500/20 text-emerald-300' :
                              entry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {entry.status === 'cleared' ? '✓ Confermato' :
                               entry.status === 'pending' ? '⏳ In attesa' : '⚠ Discrepanza'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Conversion */}
        {activeTab === 'conversion' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">Conversione NAV: Contabile → Disponibile</h3>
              <p className="text-slate-300 mb-4">
                La conversione trasforma il NAV da valore contabile teorico a valore liquido effettivamente disponibile,
                tenendo conto di commissioni, tasse, e rettifiche valutarie.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-blue-300 mb-2">NAV Contabile</h4>
                  <p className="text-2xl font-bold">€{totalNAVAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-slate-400 mt-2">Valore teorico basato sulle quotazioni</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="font-semibold text-emerald-300 mb-2">NAV Disponibile</h4>
                  <p className="text-2xl font-bold">€{totalNAVAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-slate-400 mt-2">Valore reale dopo riconciliazione</p>
                </div>
              </div>
            </div>

            {/* Conversion Actions */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Converti Fondi</h3>
              <div className="space-y-3">
                {funds.map((fund) => (
                  <div key={fund.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <div>
                      <p className="font-medium">{fund.name}</p>
                      <p className="text-sm text-slate-400">
                        Contabile: €{fund.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })} → 
                        Disponibile: €{fund.navAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button
                      onClick={() => convertToAvailable(fund.id)}
                      disabled={fund.status === 'reconciled'}
                      className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {fund.status === 'reconciled' ? '✓ Convertito' : 'Converti'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Report di Riconciliazione</h3>
              <div className="space-y-4">
                {funds.map((fund) => {
                  const report = generateReport(fund.id)
                  return (
                    <div key={fund.id} className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{fund.name}</h4>
                          <p className="text-sm text-slate-400">{fund.isin} • {report.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          report.reconciled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {report.reconciled ? '✓ Riconciliato' : '⚠ Non Riconciliato'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">NAV Contabile</p>
                          <p className="text-lg font-bold">€{report.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">NAV Disponibile</p>
                          <p className="text-lg font-bold text-emerald-400">€{report.navAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Saldo Bancario</p>
                          <p className="text-lg font-bold text-cyan-400">€{report.bankBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      {report.differences.length > 0 && (
                        <div className="border-t border-slate-700/50 pt-3">
                          <p className="text-xs text-slate-500 mb-2">Voci di riconciliazione:</p>
                          <div className="space-y-1">
                            {report.differences.map((diff, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-slate-300">{diff.description}</span>
                                <span className={`font-mono ${diff.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {diff.amount >= 0 ? '+' : ''}€{diff.amount.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && selectedFund && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Riconcilia {selectedFund.name}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">NAV Contabile:</span>
                <span className="font-bold">€{selectedFund.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saldo Bancario:</span>
                <span className="font-bold text-cyan-400">€{selectedFund.bankBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-3">
                <span className="text-slate-400">Differenza:</span>
                <span className={`font-bold ${(selectedFund.navAccounting - selectedFund.bankBalance) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  €{(selectedFund.navAccounting - selectedFund.bankBalance).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => reconcileFund(selectedFund.id)}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Riconcilia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          NAV Reconciliation System • Strumento professionale di contabilità finanziaria
        </div>
      </footer>
    </div>
  )
}

export default App
