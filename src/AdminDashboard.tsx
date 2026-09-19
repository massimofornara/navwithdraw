import { useState, useEffect } from 'react'

type EditableDashboard = {
  totalNAV: number
  totalBalance: number
  lastUpdate: string
  notes: string
}

type WithdrawalRequest = {
  id: string
  date: string
  fromAccount: string
  toAccount: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  type: 'bank' | 'crypto'
  reference?: string
}

function AdminDashboard() {
  const [dashboard, setDashboard] = useState<EditableDashboard>({
    totalNAV: 0,
    totalBalance: 0,
    lastUpdate: new Date().toISOString(),
    notes: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditableDashboard>(dashboard)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [linkedAccounts, setLinkedAccounts] = useState<Array<{id: string, name: string, type: 'bank' | 'wallet', balance: number}>>([])

  // Carica dati dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_dashboard')
    if (saved) {
      setDashboard(JSON.parse(saved))
    }

    const savedAccounts = localStorage.getItem('linked_accounts')
    if (savedAccounts) {
      setLinkedAccounts(JSON.parse(savedAccounts))
    }

    const savedWithdrawals = localStorage.getItem('withdrawals')
    if (savedWithdrawals) {
      setWithdrawals(JSON.parse(savedWithdrawals))
    }
  }, [])

  // Salva dati nel localStorage
  useEffect(() => {
    localStorage.setItem('admin_dashboard', JSON.stringify(dashboard))
  }, [dashboard])

  useEffect(() => {
    localStorage.setItem('linked_accounts', JSON.stringify(linkedAccounts))
  }, [linkedAccounts])

  useEffect(() => {
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals))
  }, [withdrawals])

  const handleSaveDashboard = () => {
    setDashboard({
      ...editForm,
      lastUpdate: new Date().toISOString()
    })
    setIsEditing(false)
  }

  const handleWithdraw = (from: string, to: string, amount: number, currency: string, type: 'bank' | 'crypto') => {
    const newWithdrawal: WithdrawalRequest = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fromAccount: from,
      toAccount: to,
      amount,
      currency,
      status: 'completed',
      type,
      reference: `WDR-${Date.now()}`
    }

    setWithdrawals([newWithdrawal, ...withdrawals])

    // Aggiorna saldi
    const fromAccount = linkedAccounts.find(a => a.id === from)
    const toAccount = linkedAccounts.find(a => a.id === to)

    if (fromAccount && toAccount) {
      setLinkedAccounts(linkedAccounts.map(a => {
        if (a.id === from) return { ...a, balance: a.balance - amount }
        if (a.id === to) return { ...a, balance: a.balance + amount }
        return a
      }))
    }

    setShowWithdrawModal(false)
  }

  const addLinkedAccount = (name: string, type: 'bank' | 'wallet', balance: number) => {
    const newAccount = {
      id: Date.now().toString(),
      name,
      type,
      balance
    }
    setLinkedAccounts([...linkedAccounts, newAccount])
  }

  const removeLinkedAccount = (id: string) => {
    setLinkedAccounts(linkedAccounts.filter(a => a.id !== id))
  }

  const totalLinkedBalance = linkedAccounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 Dashboard Amministratore</h2>
            <p className="text-slate-300">
              Gestisci manualmente NAV, saldi totali e operazioni della piattaforma
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Ultimo aggiornamento:</div>
            <div className="font-mono text-emerald-400 text-sm">
              {new Date(dashboard.lastUpdate).toLocaleString('it-IT')}
            </div>
          </div>
        </div>

        {/* Editable Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">NAV Totale</p>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editForm.totalNAV}
                onChange={(e) => setEditForm({ ...editForm, totalNAV: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 text-xl font-bold"
              />
            ) : (
              <p className="text-2xl font-bold text-emerald-400">
                €{dashboard.totalNAV.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Saldo Totale Conti</p>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editForm.totalBalance}
                onChange={(e) => setEditForm({ ...editForm, totalBalance: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 text-xl font-bold"
              />
            ) : (
              <p className="text-2xl font-bold text-cyan-400">
                €{dashboard.totalBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Conti Collegati</p>
            <p className="text-2xl font-bold text-purple-400">{linkedAccounts.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              Saldo: €{totalLinkedBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Notes */}
        {isEditing && (
          <div className="mt-4">
            <label className="block text-sm text-slate-400 mb-1">Note</label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              rows={2}
              placeholder="Note opzionali..."
            />
          </div>
        )}

        {!isEditing && dashboard.notes && (
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Note:</p>
            <p className="text-sm text-slate-300">{dashboard.notes}</p>
          </div>
        )}

        {/* Edit Buttons */}
        <div className="mt-4 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveDashboard}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                💾 Salva Modifiche
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditForm(dashboard)
                }}
                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                ❌ Annulla
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true)
                setEditForm(dashboard)
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 transition-all"
            >
              ✏️ Modifica Dashboard
            </button>
          )}

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 transition-all"
          >
            💸 Prelievo
          </button>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🔗 Conti e Wallet Collegati</h3>
          <button
            onClick={() => {
              const name = prompt('Nome conto/wallet:')
              if (!name) return
              const type = confirm('OK = Banca, Annulla = Wallet Crypto') ? 'bank' : 'wallet'
              const balance = parseFloat(prompt('Saldo iniziale:') || '0')
              addLinkedAccount(name, type as 'bank' | 'wallet', balance)
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
          >
            + Collega Conto
          </button>
        </div>

        {linkedAccounts.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            Nessun conto collegato. Clicca "+ Collega Conto" per iniziare.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedAccounts.map(account => (
              <div key={account.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{account.name}</h4>
                    <p className="text-xs text-slate-400">
                      {account.type === 'bank' ? '🏦 Banca' : '💳 Wallet Crypto'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeLinkedAccount(account.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                <p className="text-xl font-bold text-emerald-400">
                  €{account.balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawals History */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">💸 Storico Prelievi</h3>

        {withdrawals.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            Nessun prelievo effettuato.
          </p>
        ) : (
          <div className="space-y-3">
            {withdrawals.map(w => {
              const from = linkedAccounts.find(a => a.id === w.fromAccount)
              const to = linkedAccounts.find(a => a.id === w.toAccount)

              return (
                <div key={w.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{w.type === 'bank' ? '🏦' : '💳'}</span>
                      <div>
                        <p className="font-semibold">
                          {from?.name || 'N/A'} → {to?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(w.date).toLocaleString('it-IT')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">
                        €{w.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        w.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {w.status === 'completed' ? '✓ Completato' :
                         w.status === 'pending' ? '⏳ In attesa' : '✗ Fallito'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Ref: {w.reference}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          accounts={linkedAccounts}
          onWithdraw={handleWithdraw}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  )
}

function WithdrawModal({ accounts, onWithdraw, onClose }: {
  accounts: Array<{id: string, name: string, type: 'bank' | 'wallet', balance: number}>
  onWithdraw: (from: string, to: string, amount: number, currency: string, type: 'bank' | 'crypto') => void
  onClose: () => void
}) {
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '')
  const [toAccount, setToAccount] = useState(accounts[1]?.id || '')
  const [amount, setAmount] = useState(0)

  const fromAcc = accounts.find(a => a.id === fromAccount)
  const toAcc = accounts.find(a => a.id === toAccount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromAccount || !toAccount || amount <= 0) {
      alert('Compila tutti i campi correttamente')
      return
    }
    if (fromAcc && amount > fromAcc.balance) {
      alert('Saldo insufficiente')
      return
    }
    onWithdraw(fromAccount, toAccount, amount, 'EUR', toAcc?.type === 'wallet' ? 'crypto' : 'bank')
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">💸 Effettua Prelievo</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Da</label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (€{acc.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">A</label>
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (€{acc.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Importo (€)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              required
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
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              💸 Preleva
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard
