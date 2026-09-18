import { useState } from 'react'
import TestPanel from './TestPanel'
import OnChainReconciliationPanel from './OnChainReconciliation'
import DataExtractor from './DataExtractor'

type Account = {
  id: string
  name: string
  type: 'bank' | 'broker' | 'wallet' | 'other'
  balance: number
  currency: string
  institution: string
  lastSync: string
}

type Fund = {
  id: string
  name: string
  isin: string
  accountId: string
  navAccounting: number
  navAvailable: number
  shares: number
  currency: string
  lastUpdate: string
  status: 'reconciled' | 'pending' | 'discrepancy'
}

type Transaction = {
  id: string
  date: string
  accountId: string
  fundId?: string
  type: 'dividend' | 'fee' | 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'tax'
  description: string
  amount: number
  status: 'cleared' | 'pending' | 'discrepancy'
  reference?: string
}

type ReconciliationBatch = {
  id: string
  date: string
  accountId: string
  statements: {
    date: string
    balance: number
    transactions: number
  }[]
  matched: number
  unmatched: number
  discrepancies: number
  status: 'completed' | 'in-progress' | 'pending'
}

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'funds' | 'reconciliation' | 'import' | 'reports' | 'onchain' | 'extractor' | 'tests'>('dashboard')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importType, setImportType] = useState<'csv' | 'json' | 'api' | 'manual'>('csv')

  // Dati di esempio
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Conto Corrente Principale',
      type: 'bank',
      balance: 125000.00,
      currency: 'EUR',
      institution: 'Intesa Sanpaolo',
      lastSync: '2024-01-15'
    },
    {
      id: '2',
      name: 'Conto Trading',
      type: 'broker',
      balance: 89500.00,
      currency: 'EUR',
      institution: 'Directa SIM',
      lastSync: '2024-01-15'
    },
    {
      id: '3',
      name: 'Wallet Crypto',
      type: 'wallet',
      balance: 15000.00,
      currency: 'EUR',
      institution: 'Ledger',
      lastSync: '2024-01-14'
    }
  ])

  const [funds, setFunds] = useState<Fund[]>([
    {
      id: '1',
      name: 'Vanguard FTSE All-World',
      isin: 'IE00BK5BQT80',
      accountId: '2',
      navAccounting: 125000.00,
      navAvailable: 124850.50,
      shares: 1000,
      currency: 'EUR',
      lastUpdate: '2024-01-15',
      status: 'reconciled'
    },
    {
      id: '2',
      name: 'iShares MSCI World',
      isin: 'IE00B4L5Y562',
      accountId: '2',
      navAccounting: 89500.00,
      navAvailable: 89320.75,
      shares: 750,
      currency: 'EUR',
      lastUpdate: '2024-01-15',
      status: 'reconciled'
    },
    {
      id: '3',
      name: 'Bitcoin',
      isin: 'CRYPTO-BTC',
      accountId: '3',
      navAccounting: 15000.00,
      navAvailable: 14875.00,
      shares: 0.5,
      currency: 'EUR',
      lastUpdate: '2024-01-14',
      status: 'discrepancy'
    }
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2024-01-10',
      accountId: '2',
      fundId: '1',
      type: 'dividend',
      description: 'Dividendo trimestrale',
      amount: 150.00,
      status: 'cleared',
      reference: 'DIV-2024-001'
    },
    {
      id: '2',
      date: '2024-01-12',
      accountId: '2',
      fundId: '1',
      type: 'fee',
      description: 'Commissioni gestione',
      amount: -5.50,
      status: 'cleared',
      reference: 'FEE-2024-001'
    },
    {
      id: '3',
      date: '2024-01-13',
      accountId: '3',
      fundId: '3',
      type: 'adjustment',
      description: 'Rettifica valutaria',
      amount: -125.00,
      status: 'pending',
      reference: 'ADJ-2024-001'
    }
  ])

  const [batches, setBatches] = useState<ReconciliationBatch[]>([
    {
      id: '1',
      date: '2024-01-15',
      accountId: '1',
      statements: [
        { date: '2024-01-15', balance: 125000.00, transactions: 45 },
        { date: '2024-01-14', balance: 124500.00, transactions: 38 }
      ],
      matched: 43,
      unmatched: 2,
      discrepancies: 0,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-15',
      accountId: '2',
      statements: [
        { date: '2024-01-15', balance: 89500.00, transactions: 28 }
      ],
      matched: 25,
      unmatched: 3,
      discrepancies: 1,
      status: 'in-progress'
    }
  ])

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalNAVAccounting = funds.reduce((sum, f) => sum + f.navAccounting, 0)
  const totalNAVAvailable = funds.reduce((sum, f) => sum + f.navAvailable, 0)
  const totalDiscrepancies = funds.filter(f => f.status === 'discrepancy').length

  const handleImport = (data: any) => {
    // Logica di importazione universale
    console.log('Importing data:', data)
    setShowImportModal(false)
  }

  const exportData = (format: 'csv' | 'json' | 'excel') => {
    const exportObj = {
      accounts,
      funds,
      transactions,
      batches,
      exportDate: new Date().toISOString()
    }

    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'json') {
      content = JSON.stringify(exportObj, null, 2)
      filename = `reconciliation_export_${new Date().toISOString().split('T')[0]}.json`
      mimeType = 'application/json'
    } else if (format === 'csv') {
      const csv = [
        ['Accounts'],
        ['ID', 'Name', 'Type', 'Balance', 'Currency', 'Institution'],
        ...accounts.map(a => [a.id, a.name, a.type, a.balance, a.currency, a.institution]),
        [],
        ['Funds'],
        ['ID', 'Name', 'ISIN', 'NAV Accounting', 'NAV Available', 'Shares', 'Currency'],
        ...funds.map(f => [f.id, f.name, f.isin, f.navAccounting, f.navAvailable, f.shares, f.currency]),
        [],
        ['Transactions'],
        ['ID', 'Date', 'Account', 'Type', 'Description', 'Amount', 'Status'],
        ...transactions.map(t => [t.id, t.date, t.accountId, t.type, t.description, t.amount, t.status])
      ].map(row => row.join(',')).join('\n')
      
      content = csv
      filename = `reconciliation_export_${new Date().toISOString().split('T')[0]}.csv`
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
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
                <h1 className="text-lg md:text-xl font-bold">Universal Reconciliation</h1>
                <p className="text-xs text-slate-400">Qualsiasi sito • Qualsiasi piattaforma • Qualsiasi conto</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
              >
                📥 Importa
              </button>
              <button
                onClick={() => exportData('json')}
                className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-sm text-slate-300 transition-all"
              >
                📤 Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50 overflow-x-auto">
          {[
            { id: 'dashboard' as const, label: '📊 Dashboard' },
            { id: 'accounts' as const, label: '🏦 Conti' },
            { id: 'funds' as const, label: '💼 Fondi' },
            { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
            { id: 'import' as const, label: '📥 Importa' },
            { id: 'reports' as const, label: '📄 Report' },
            { id: 'onchain' as const, label: '🔗 On-Chain' },
            { id: 'extractor' as const, label: '🌐 Estrattore' },
            { id: 'tests' as const, label: '🧪 Test' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-5">
                <p className="text-sm text-blue-300 mb-1">Saldo Totale Conti</p>
                <p className="text-2xl font-bold">€{totalBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">{accounts.length} conti</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-5">
                <p className="text-sm text-emerald-300 mb-1">NAV Disponibile</p>
                <p className="text-2xl font-bold">€{totalNAVAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-400 mt-2">{funds.length} fondi</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-5">
                <p className="text-sm text-cyan-300 mb-1">Transazioni</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
                <p className="text-xs text-slate-400 mt-2">{transactions.filter(t => t.status === 'cleared').length} confermate</p>
              </div>
              <div className={`bg-gradient-to-br ${totalDiscrepancies === 0 ? 'from-green-600/20 to-green-800/20 border-green-500/30' : 'from-red-600/20 to-red-800/20 border-red-500/30'} border rounded-xl p-5`}>
                <p className={`text-sm ${totalDiscrepancies === 0 ? 'text-green-300' : 'text-red-300'} mb-1`}>Discrepanze</p>
                <p className="text-2xl font-bold">{totalDiscrepancies}</p>
                <p className="text-xs text-slate-400 mt-2">{totalDiscrepancies === 0 ? '✓ Tutto riconciliato' : '⚠ Da verificare'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('reconciliation')}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold mb-1">Riconcilia Conti</h4>
                <p className="text-sm text-slate-400">Confronta estratti conto con transazioni</p>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-2xl mb-2">📥</div>
                <h4 className="font-semibold mb-1">Importa Dati</h4>
                <p className="text-sm text-slate-400">Da qualsiasi fonte: CSV, JSON, API</p>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all text-left"
              >
                <div className="text-2xl mb-2">📄</div>
                <h4 className="font-semibold mb-1">Genera Report</h4>
                <p className="text-sm text-slate-400">Export in CSV, JSON, Excel</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Attività Recente</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => {
                  const account = accounts.find(a => a.id === tx.accountId)
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          tx.status === 'cleared' ? 'bg-emerald-400' :
                          tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-slate-400">{account?.name} • {tx.date}</p>
                        </div>
                      </div>
                      <span className={`font-mono ${tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.amount >= 0 ? '+' : ''}€{tx.amount.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Accounts */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Gestione Conti</h3>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
              >
                + Aggiungi Conto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div key={account.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{account.name}</h4>
                      <p className="text-sm text-slate-400">{account.institution}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      account.type === 'bank' ? 'bg-blue-500/20 text-blue-300' :
                      account.type === 'broker' ? 'bg-purple-500/20 text-purple-300' :
                      account.type === 'wallet' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {account.type === 'bank' ? '🏦 Banca' :
                       account.type === 'broker' ? '📈 Broker' :
                       account.type === 'wallet' ? '💳 Wallet' : '📋 Altro'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Saldo:</span>
                      <span className="font-bold text-lg">€{account.balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Valuta:</span>
                      <span className="text-sm">{account.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Ultimo sync:</span>
                      <span className="text-sm">{account.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Funds */}
        {activeTab === 'funds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Gestione Fondi e Asset</h3>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
              >
                + Aggiungi Fondo
              </button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-5 py-3">Fondo</th>
                      <th className="px-5 py-3">ISIN</th>
                      <th className="px-5 py-3">Conto</th>
                      <th className="px-5 py-3">NAV Contabile</th>
                      <th className="px-5 py-3">NAV Disponibile</th>
                      <th className="px-5 py-3">Quote</th>
                      <th className="px-5 py-3">Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funds.map((fund) => {
                      const account = accounts.find(a => a.id === fund.accountId)
                      return (
                        <tr key={fund.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                          <td className="px-5 py-4 font-medium">{fund.name}</td>
                          <td className="px-5 py-4 text-sm text-slate-400 font-mono">{fund.isin}</td>
                          <td className="px-5 py-4 text-sm">{account?.name}</td>
                          <td className="px-5 py-4">€{fund.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                          <td className="px-5 py-4 text-emerald-400">€{fund.navAvailable.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
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
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reconciliation */}
        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Batch di Riconciliazione</h3>
            
            <div className="space-y-4">
              {batches.map((batch) => {
                const account = accounts.find(a => a.id === batch.accountId)
                return (
                  <div key={batch.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{account?.name}</h4>
                        <p className="text-sm text-slate-400">{batch.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        batch.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        batch.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {batch.status === 'completed' ? '✓ Completato' :
                         batch.status === 'in-progress' ? '⏳ In corso' : '⏸ In attesa'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Estratti conto</p>
                        <p className="text-lg font-bold">{batch.statements.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Transazioni matchate</p>
                        <p className="text-lg font-bold text-emerald-400">{batch.matched}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Non matchate</p>
                        <p className="text-lg font-bold text-yellow-400">{batch.unmatched}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Discrepanze</p>
                        <p className={`text-lg font-bold ${batch.discrepancies === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {batch.discrepancies}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/50 pt-3">
                      <p className="text-xs text-slate-500 mb-2">Ultimi estratti conto:</p>
                      <div className="space-y-1">
                        {batch.statements.map((stmt, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-slate-300">{stmt.date}</span>
                            <span className="text-slate-400">{stmt.transactions} transazioni</span>
                            <span className="font-mono">€{stmt.balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Import */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Importazione Universale</h3>
              <p className="text-slate-300 mb-6">
                Importa dati da qualsiasi fonte: siti web, applicazioni, piattaforme di trading, wallet crypto, banche.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setImportType('csv')}
                  className={`p-5 rounded-xl border transition-all text-left ${
                    importType === 'csv'
                      ? 'bg-emerald-500/15 border-emerald-500/50'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-1">CSV / Excel</h4>
                  <p className="text-xs text-slate-400">Estratti conto, report broker</p>
                </button>

                <button
                  onClick={() => setImportType('json')}
                  className={`p-5 rounded-xl border transition-all text-left ${
                    importType === 'json'
                      ? 'bg-emerald-500/15 border-emerald-500/50'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">📄</div>
                  <h4 className="font-semibold mb-1">JSON / API</h4>
                  <p className="text-xs text-slate-400">API REST, webhook, dati strutturati</p>
                </button>

                <button
                  onClick={() => setImportType('api')}
                  className={`p-5 rounded-xl border transition-all text-left ${
                    importType === 'api'
                      ? 'bg-emerald-500/15 border-emerald-500/50'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🌐</div>
                  <h4 className="font-semibold mb-1">Web Scraping</h4>
                  <p className="text-xs text-slate-400">Estrai da qualsiasi sito web</p>
                </button>

                <button
                  onClick={() => setImportType('manual')}
                  className={`p-5 rounded-xl border transition-all text-left ${
                    importType === 'manual'
                      ? 'bg-emerald-500/15 border-emerald-500/50'
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">✍️</div>
                  <h4 className="font-semibold mb-1">Manuale</h4>
                  <p className="text-xs text-slate-400">Inserimento diretto dati</p>
                </button>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-semibold mb-2">Fonti supportate:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-300">
                  <div>✓ Morningstar</div>
                  <div>✓ Borsa Italiana</div>
                  <div>✓ Yahoo Finance</div>
                  <div>✓ Directa</div>
                  <div>✓ Fineco</div>
                  <div>✓ Degiro</div>
                  <div>✓ Interactive Brokers</div>
                  <div>✓ Binance</div>
                  <div>✓ Coinbase</div>
                  <div>✓ Ledger</div>
                  <div>✓ Intesa Sanpaolo</div>
                  <div>✓ Qualsiasi altro...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Export e Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => exportData('csv')}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold mb-1">Export CSV</h4>
                  <p className="text-xs text-slate-400">Compatibile con Excel, Google Sheets</p>
                </button>

                <button
                  onClick={() => exportData('json')}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="text-3xl mb-2">📄</div>
                  <h4 className="font-semibold mb-1">Export JSON</h4>
                  <p className="text-xs text-slate-400">Per integrazioni e automazioni</p>
                </button>

                <button
                  onClick={() => exportData('excel')}
                  className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="text-3xl mb-2">📈</div>
                  <h4 className="font-semibold mb-1">Report Completo</h4>
                  <p className="text-xs text-slate-400">Tutti i dati con analisi</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* On-Chain Reconciliation */}
        {activeTab === 'onchain' && (
          <OnChainReconciliationPanel />
        )}

        {/* Data Extractor */}
        {activeTab === 'extractor' && (
          <DataExtractor />
        )}

        {/* Tests */}
        {activeTab === 'tests' && (
          <TestPanel />
        )}
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Importa Dati</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo di importazione
                </label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="csv">CSV / Excel</option>
                  <option value="json">JSON / API</option>
                  <option value="api">Web Scraping</option>
                  <option value="manual">Manuale</option>
                </select>
              </div>

              {importType === 'csv' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Carica file CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Supporta estratti conto bancari, report broker, export wallet
                  </p>
                </div>
              )}

              {importType === 'json' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL API o file JSON
                  </label>
                  <input
                    type="text"
                    placeholder="https://api.example.com/data o carica file JSON"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                  />
                </div>
              )}

              {importType === 'api' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL del sito da cui estrarre
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.morningstar.it/..."
                    className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    L'estrazione automatica funziona con la maggior parte dei siti finanziari
                  </p>
                </div>
              )}

              {importType === 'manual' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nome fondo/asset
                    </label>
                    <input
                      type="text"
                      placeholder="es. Vanguard FTSE All-World"
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      NAV / Valore
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="125000.00"
                      className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => handleImport({})}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Importa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          Universal Reconciliation System • Funziona con qualsiasi sito, applicazione e piattaforma
        </div>
      </footer>
    </div>
  )
}

export default App
