import { useState } from 'react'

type Security = {
  id: string
  name: string
  type: 'stock' | 'etf' | 'fund' | 'bond' | 'crypto' | 'other'
  isin?: string
  ticker?: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  currency: string
  accountId: string
  purchaseDate: string
  notes?: string
}

type CustomAccount = {
  id: string
  name: string
  type: 'bank' | 'broker' | 'wallet' | 'cash' | 'other'
  institution?: string
  currency: string
  balance: number
  iban?: string
  address?: string
  blockchain?: string
}

type ManualNAVEntry = {
  id: string
  date: string
  securityId: string
  navAccounting: number
  navMarket: number
  notes?: string
}

function PortfolioManager() {
  const [activeSection, setActiveSection] = useState<'securities' | 'accounts' | 'manual-nav' | 'summary'>('securities')
  const [showAddSecurity, setShowAddSecurity] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddNAV, setShowAddNAV] = useState(false)

  const [securities, setSecurities] = useState<Security[]>([
    {
      id: '1',
      name: 'Vanguard FTSE All-World',
      type: 'etf',
      isin: 'IE00BK5BQT80',
      ticker: 'VWCE',
      quantity: 100,
      purchasePrice: 95.50,
      currentPrice: 105.20,
      currency: 'EUR',
      accountId: '1',
      purchaseDate: '2023-01-15',
      notes: 'ETF globale'
    },
    {
      id: '2',
      name: 'Apple Inc.',
      type: 'stock',
      ticker: 'AAPL',
      quantity: 50,
      purchasePrice: 150.00,
      currentPrice: 175.30,
      currency: 'USD',
      accountId: '2',
      purchaseDate: '2023-03-20'
    }
  ])

  const [accounts, setAccounts] = useState<CustomAccount[]>([
    {
      id: '1',
      name: 'Conto UniCredit',
      type: 'bank',
      institution: 'UniCredit',
      currency: 'EUR',
      balance: 50000,
      iban: 'IT60X0000000000000000000000'
    },
    {
      id: '2',
      name: 'Conto Trading Directa',
      type: 'broker',
      institution: 'Directa SIM',
      currency: 'EUR',
      balance: 25000
    },
    {
      id: '3',
      name: 'Wallet Ethereum',
      type: 'wallet',
      currency: 'ETH',
      balance: 2.5,
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      blockchain: 'ethereum'
    }
  ])

  const [manualNAVs, setManualNAVs] = useState<ManualNAVEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      securityId: '1',
      navAccounting: 10520,
      navMarket: 10550,
      notes: 'NAV aggiornato da Morningstar'
    }
  ])

  const addSecurity = (security: Omit<Security, 'id'>) => {
    const newSecurity = {
      ...security,
      id: Date.now().toString()
    }
    setSecurities([...securities, newSecurity])
    setShowAddSecurity(false)
  }

  const addAccount = (account: Omit<CustomAccount, 'id'>) => {
    const newAccount = {
      ...account,
      id: Date.now().toString()
    }
    setAccounts([...accounts, newAccount])
    setShowAddAccount(false)
  }

  const addManualNAV = (entry: Omit<ManualNAVEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    }
    setManualNAVs([...manualNAVs, newEntry])
    setShowAddNAV(false)
  }

  const deleteSecurity = (id: string) => {
    setSecurities(securities.filter(s => s.id !== id))
  }

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id))
  }

  const calculatePortfolioValue = () => {
    let totalValue = 0
    let totalCost = 0

    securities.forEach(security => {
      const value = security.quantity * security.currentPrice
      const cost = security.quantity * security.purchasePrice
      totalValue += value
      totalCost += cost
    })

    return {
      totalValue,
      totalCost,
      gain: totalValue - totalCost,
      gainPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
    }
  }

  const portfolioStats = calculatePortfolioValue()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">💼 Gestione Portafoglio Personalizzata</h2>
        <p className="text-slate-300">
          Aggiungi manualmente titoli, azioni, conti e NAV - controllo totale sul tuo portafoglio
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Titoli</p>
            <p className="text-xl font-bold">{securities.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Conti</p>
            <p className="text-xl font-bold">{accounts.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Valore Totale</p>
            <p className="text-xl font-bold text-emerald-400">
              €{portfolioStats.totalValue.toLocaleString('it-IT', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Plusvalenza</p>
            <p className={`text-xl font-bold ${portfolioStats.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolioStats.gain >= 0 ? '+' : ''}{portfolioStats.gainPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50 overflow-x-auto">
        {[
          { id: 'securities' as const, label: '📈 Titoli & Azioni' },
          { id: 'accounts' as const, label: '🏦 Conti & Wallet' },
          { id: 'manual-nav' as const, label: '💰 NAV Manuali' },
          { id: 'summary' as const, label: '📊 Riepilogo' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Securities Section */}
      {activeSection === 'securities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Titoli, Azioni e Fondi</h3>
            <button
              onClick={() => setShowAddSecurity(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-sm text-indigo-300 transition-all"
            >
              + Aggiungi Titolo
            </button>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-5 py-3">Nome</th>
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3">ISIN/Ticker</th>
                    <th className="px-5 py-3">Quantità</th>
                    <th className="px-5 py-3">Prezzo Acquisto</th>
                    <th className="px-5 py-3">Prezzo Attuale</th>
                    <th className="px-5 py-3">Valore</th>
                    <th className="px-5 py-3">+/-</th>
                    <th className="px-5 py-3">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {securities.map((security) => {
                    const value = security.quantity * security.currentPrice
                    const cost = security.quantity * security.purchasePrice
                    const gain = value - cost
                    const gainPercent = cost > 0 ? (gain / cost) * 100 : 0

                    return (
                      <tr key={security.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                        <td className="px-5 py-4 font-medium">{security.name}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            security.type === 'stock' ? 'bg-blue-500/20 text-blue-300' :
                            security.type === 'etf' ? 'bg-purple-500/20 text-purple-300' :
                            security.type === 'fund' ? 'bg-cyan-500/20 text-cyan-300' :
                            security.type === 'bond' ? 'bg-green-500/20 text-green-300' :
                            security.type === 'crypto' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-slate-500/20 text-slate-300'
                          }`}>
                            {security.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-mono text-slate-400">
                          {security.isin || security.ticker}
                        </td>
                        <td className="px-5 py-4">{security.quantity}</td>
                        <td className="px-5 py-4">
                          {security.purchasePrice.toFixed(2)} {security.currency}
                        </td>
                        <td className="px-5 py-4">
                          {security.currentPrice.toFixed(2)} {security.currency}
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {value.toLocaleString('it-IT', { maximumFractionDigits: 2 })} {security.currency}
                        </td>
                        <td className="px-5 py-4">
                          <span className={gain >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {gain >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => deleteSecurity(security.id)}
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
          </div>
        </div>
      )}

      {/* Accounts Section */}
      {activeSection === 'accounts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Conti Bancari, Broker e Wallet</h3>
            <button
              onClick={() => setShowAddAccount(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-sm text-indigo-300 transition-all"
            >
              + Aggiungi Conto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{account.name}</h4>
                    <p className="text-sm text-slate-400">{account.institution || account.blockchain || 'Personal'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    account.type === 'bank' ? 'bg-blue-500/20 text-blue-300' :
                    account.type === 'broker' ? 'bg-purple-500/20 text-purple-300' :
                    account.type === 'wallet' ? 'bg-orange-500/20 text-orange-300' :
                    account.type === 'cash' ? 'bg-green-500/20 text-green-300' :
                    'bg-slate-500/20 text-slate-300'
                  }`}>
                    {account.type.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Saldo:</span>
                    <span className="font-bold text-lg">
                      {account.balance.toLocaleString('it-IT', { maximumFractionDigits: 6 })} {account.currency}
                    </span>
                  </div>
                  {account.iban && (
                    <div className="text-xs text-slate-500 font-mono truncate">
                      IBAN: {account.iban}
                    </div>
                  )}
                  {account.address && (
                    <div className="text-xs text-slate-500 font-mono truncate">
                      {account.address.substring(0, 20)}...
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteAccount(account.id)}
                  className="w-full px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all"
                >
                  🗑️ Elimina Conto
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual NAV Section */}
      {activeSection === 'manual-nav' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">NAV Inseriti Manualmente</h3>
            <button
              onClick={() => setShowAddNAV(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-sm text-indigo-300 transition-all"
            >
              + Aggiungi NAV
            </button>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
            <p className="text-sm text-indigo-300">
              💡 <strong>Consiglio:</strong> Inserisci manualmente i NAV dai tuoi estratti conto, siti finanziari o app di trading. 
              Il sistema li userà per la riconciliazione.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3">Titolo</th>
                    <th className="px-5 py-3">NAV Contabile</th>
                    <th className="px-5 py-3">NAV Mercato</th>
                    <th className="px-5 py-3">Differenza</th>
                    <th className="px-5 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {manualNAVs.map((entry) => {
                    const security = securities.find(s => s.id === entry.securityId)
                    const difference = entry.navMarket - entry.navAccounting

                    return (
                      <tr key={entry.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                        <td className="px-5 py-4 text-sm">{entry.date}</td>
                        <td className="px-5 py-4 font-medium">{security?.name || 'N/A'}</td>
                        <td className="px-5 py-4">€{entry.navAccounting.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4 text-emerald-400">€{entry.navMarket.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4">
                          <span className={difference >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {difference >= 0 ? '+' : ''}€{difference.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">{entry.notes}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {activeSection === 'summary' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Riepilogo Portafoglio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">📈 Titoli</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Valore di mercato:</span>
                    <span className="font-bold text-emerald-400">
                      €{portfolioStats.totalValue.toLocaleString('it-IT', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Costo totale:</span>
                    <span className="font-bold">
                      €{portfolioStats.totalCost.toLocaleString('it-IT', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-400">Plusvalenza/Perdita:</span>
                    <span className={`font-bold ${portfolioStats.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {portfolioStats.gain >= 0 ? '+' : ''}€{portfolioStats.gain.toLocaleString('it-IT', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">🏦 Conti</h4>
                <div className="space-y-2">
                  {accounts.map(account => (
                    <div key={account.id} className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-400">{account.name}:</span>
                      <span className="font-bold">
                        {account.balance.toLocaleString('it-IT', { maximumFractionDigits: 2 })} {account.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Security Modal */}
      {showAddSecurity && (
        <AddSecurityModal
          accounts={accounts}
          onAdd={addSecurity}
          onClose={() => setShowAddSecurity(false)}
        />
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <AddAccountModal
          onAdd={addAccount}
          onClose={() => setShowAddAccount(false)}
        />
      )}

      {/* Add NAV Modal */}
      {showAddNAV && (
        <AddNAVModal
          securities={securities}
          onAdd={addManualNAV}
          onClose={() => setShowAddNAV(false)}
        />
      )}
    </div>
  )
}

// Modal Components
function AddSecurityModal({ accounts, onAdd, onClose }: {
  accounts: CustomAccount[]
  onAdd: (security: Omit<Security, 'id'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock' as Security['type'],
    isin: '',
    ticker: '',
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    currency: 'EUR',
    accountId: accounts[0]?.id || '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Aggiungi Titolo/Azione/Fondo</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              placeholder="es. Vanguard FTSE All-World"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Security['type'] })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                <option value="stock">Azione</option>
                <option value="etf">ETF</option>
                <option value="fund">Fondo</option>
                <option value="bond">Obbligazione</option>
                <option value="crypto">Crypto</option>
                <option value="other">Altro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Valuta</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ISIN</label>
              <input
                type="text"
                value={formData.isin}
                onChange={(e) => setFormData({ ...formData, isin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                placeholder="es. IE00BK5BQT80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ticker</label>
              <input
                type="text"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                placeholder="es. VWCE"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Quantità</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prezzo Acquisto</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prezzo Attuale</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Conto</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Data Acquisto</label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              rows={3}
              placeholder="Note opzionali..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddAccountModal({ onAdd, onClose }: {
  onAdd: (account: Omit<CustomAccount, 'id'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as CustomAccount['type'],
    institution: '',
    currency: 'EUR',
    balance: 0,
    iban: '',
    address: '',
    blockchain: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Aggiungi Conto/Wallet</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome Conto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              placeholder="es. Conto UniCredit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomAccount['type'] })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                <option value="bank">Banca</option>
                <option value="broker">Broker</option>
                <option value="wallet">Wallet Crypto</option>
                <option value="cash">Contanti</option>
                <option value="other">Altro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Valuta</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {formData.type === 'wallet' ? 'Blockchain' : 'Istituto'}
            </label>
            {formData.type === 'wallet' ? (
              <select
                value={formData.blockchain}
                onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              >
                <option value="">Seleziona blockchain</option>
                <option value="ethereum">Ethereum</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="base">Base</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                placeholder="es. UniCredit, Directa, ecc."
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Saldo</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>

          {formData.type === 'bank' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">IBAN</label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                placeholder="IT60X0000000000000000000000"
              />
            </div>
          )}

          {formData.type === 'wallet' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Indirizzo Wallet</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                placeholder="0x... o bc1..."
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddNAVModal({ securities, onAdd, onClose }: {
  securities: Security[]
  onAdd: (entry: Omit<ManualNAVEntry, 'id'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    securityId: securities[0]?.id || '',
    navAccounting: 0,
    navMarket: 0,
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Aggiungi NAV Manuale</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Data</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Titolo</label>
            <select
              value={formData.securityId}
              onChange={(e) => setFormData({ ...formData, securityId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              {securities.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NAV Contabile (€)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.navAccounting}
              onChange={(e) => setFormData({ ...formData, navAccounting: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NAV Mercato (€)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.navMarket}
              onChange={(e) => setFormData({ ...formData, navMarket: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              rows={3}
              placeholder="Fonte del NAV, note, ecc."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PortfolioManager
