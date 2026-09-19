import { useState, useEffect } from 'react'

type BankConnection = {
  id: string
  provider: 'tink' | 'truelayer' | 'plaid'
  bankName: string
  accountId: string
  status: 'connected' | 'disconnected' | 'pending'
  balance?: number
  currency: string
  lastSync: string
  accessToken?: string
}

type PaymentIntent = {
  id: string
  fromAccountId: string
  toIBAN: string
  toName: string
  amount: number
  currency: string
  description: string
  status: 'pending' | 'authorized' | 'executed' | 'failed'
  createdAt: string
  executedAt?: string
  reference?: string
}

function OpenBankingPanel() {
  const [connections, setConnections] = useState<BankConnection[]>([])
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'tink' | 'truelayer' | 'plaid'>('tink')
  const [payments, setPayments] = useState<PaymentIntent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carica connessioni dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem('open_banking_connections')
    if (saved) {
      setConnections(JSON.parse(saved))
    }

    const savedPayments = localStorage.getItem('open_banking_payments')
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments))
    }
  }, [])

  // Salva connessioni
  useEffect(() => {
    localStorage.setItem('open_banking_connections', JSON.stringify(connections))
  }, [connections])

  useEffect(() => {
    localStorage.setItem('open_banking_payments', JSON.stringify(payments))
  }, [payments])

  const initiateBankConnection = async (provider: 'tink' | 'truelayer' | 'plaid') => {
    setIsLoading(true)
    
    // Simula il flusso OAuth con il provider
    // In produzione, qui ci sarebbe il redirect al provider
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simula successo connessione
    const newConnection: BankConnection = {
      id: Date.now().toString(),
      provider,
      bankName: provider === 'tink' ? 'UniCredit' : provider === 'truelayer' ? 'Intesa Sanpaolo' : 'Fineco',
      accountId: `ACC-${Date.now()}`,
      status: 'connected',
      balance: Math.random() * 50000 + 10000,
      currency: 'EUR',
      lastSync: new Date().toISOString(),
      accessToken: `token_${Math.random().toString(36).substring(7)}`
    }
    
    setConnections([...connections, newConnection])
    setIsLoading(false)
    setShowConnectModal(false)
    
    alert(`✅ Connessione ${provider.toUpperCase()} stabilita con successo!`)
  }

  const initiatePayment = async (fromAccountId: string, toIBAN: string, toName: string, amount: number, description: string) => {
    setIsLoading(true)
    
    const connection = connections.find(c => c.id === fromAccountId)
    if (!connection) {
      alert('❌ Conto non trovato')
      setIsLoading(false)
      return
    }

    // Simula il flusso di pagamento PSD2
    // In produzione: 
    // 1. Crea payment intent con il provider
    // 2. Redirect utente alla banca per autorizzazione (SCA)
    // 3. Callback con esito
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const newPayment: PaymentIntent = {
      id: `PAY-${Date.now()}`,
      fromAccountId,
      toIBAN,
      toName,
      amount,
      currency: 'EUR',
      description,
      status: 'executed',
      createdAt: new Date().toISOString(),
      executedAt: new Date().toISOString(),
      reference: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`
    }
    
    setPayments([newPayment, ...payments])
    
    // Aggiorna saldo
    setConnections(connections.map(c => 
      c.id === fromAccountId 
        ? { ...c, balance: (c.balance || 0) - amount, lastSync: new Date().toISOString() }
        : c
    ))
    
    setIsLoading(false)
    setShowPaymentModal(false)
    
    alert(`✅ Pagamento eseguito con successo!\nRiferimento: ${newPayment.reference}`)
  }

  const disconnectBank = (connectionId: string) => {
    if (!confirm('Sei sicuro di voler disconnettere questo conto?')) return
    
    setConnections(connections.filter(c => c.id !== connectionId))
  }

  const syncBalance = async (connectionId: string) => {
    setIsLoading(true)
    
    // Simula sync con il provider
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setConnections(connections.map(c => 
      c.id === connectionId 
        ? { ...c, balance: Math.random() * 50000 + 10000, lastSync: new Date().toISOString() }
        : c
    ))
    
    setIsLoading(false)
    alert('✅ Saldo sincronizzato')
  }

  const totalBalance = connections.reduce((sum, c) => sum + (c.balance || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🏦 Open Banking (PSD2)</h2>
        <p className="text-slate-300 mb-4">
          Connessione sicura a conti bancari tramite provider autorizzati PSD2
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Conti Collegati</p>
            <p className="text-xl font-bold">{connections.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Saldo Totale</p>
            <p className="text-xl font-bold text-emerald-400">
              €{totalBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Pagamenti Eseguiti</p>
            <p className="text-xl font-bold">{payments.filter(p => p.status === 'executed').length}</p>
          </div>
        </div>
      </div>

      {/* Providers Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔌 Provider Supportati</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🇪🇺</span>
              <h4 className="font-semibold">Tink</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Provider europeo PSD2</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ 3,500+ banche EU</li>
              <li>✅ Pagamenti SEPA</li>
              <li>✅ Dati in tempo reale</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🇬🇧</span>
              <h4 className="font-semibold">TrueLayer</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Open Banking UK/EU</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ UK & EU banks</li>
              <li>✅ Payment Initiation</li>
              <li>✅ Data aggregation</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌍</span>
              <h4 className="font-semibold">Plaid</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Global banking API</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ 12,000+ institutions</li>
              <li>✅ US, UK, EU, CA</li>
              <li>✅ Transfers & payments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🔗 Conti Bancari Collegati</h3>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-sm text-blue-300 transition-all"
          >
            + Collega Conto
          </button>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Nessun conto collegato</p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Collega il tuo primo conto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map(conn => (
              <div key={conn.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">
                      🏦
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{conn.bankName}</h4>
                      <p className="text-xs text-slate-400">
                        {conn.provider.toUpperCase()} • Account: {conn.accountId}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    conn.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                    conn.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {conn.status === 'connected' ? '✓ Connesso' :
                     conn.status === 'pending' ? '⏳ In attesa' : '✗ Disconnesso'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Saldo</p>
                    <p className="text-xl font-bold text-emerald-400">
                      €{(conn.balance || 0).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Ultimo Sync</p>
                    <p className="text-sm text-slate-300">
                      {new Date(conn.lastSync).toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => syncBalance(conn.id)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-xs text-blue-300 transition-all disabled:opacity-50"
                  >
                    🔄 Sincronizza
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentModal(true)
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs text-emerald-300 transition-all"
                  >
                    💸 Paga
                  </button>
                  <button
                    onClick={() => disconnectBank(conn.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payments History */}
      {payments.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">💸 Storico Pagamenti</h3>
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{payment.toName}</p>
                    <p className="text-xs text-slate-400 font-mono">{payment.toIBAN}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      €{payment.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      payment.status === 'executed' ? 'bg-emerald-500/20 text-emerald-300' :
                      payment.status === 'authorized' ? 'bg-blue-500/20 text-blue-300' :
                      payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {payment.status === 'executed' ? '✓ Eseguito' :
                       payment.status === 'authorized' ? '✓ Autorizzato' :
                       payment.status === 'pending' ? '⏳ In attesa' : '✗ Fallito'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>{payment.description}</p>
                  <p className="font-mono">Ref: {payment.reference}</p>
                  <p>{new Date(payment.createdAt).toLocaleString('it-IT')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">🔌 Collega Conto Bancario</h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedProvider('tink')}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedProvider === 'tink'
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇪🇺</span>
                  <div>
                    <h4 className="font-semibold">Tink</h4>
                    <p className="text-xs text-slate-400">3,500+ banche europee</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedProvider('truelayer')}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedProvider === 'truelayer'
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <h4 className="font-semibold">TrueLayer</h4>
                    <p className="text-xs text-slate-400">UK & EU Open Banking</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedProvider('plaid')}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedProvider === 'plaid'
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h4 className="font-semibold">Plaid</h4>
                    <p className="text-xs text-slate-400">12,000+ istituzioni globali</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-300">
                🔒 <strong>Sicurezza PSD2:</strong> Verrai reindirizzato alla tua banca per l'autenticazione sicura (SCA). 
                Le tue credenziali non vengono mai memorizzate.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => initiateBankConnection(selectedProvider)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? '⏳ Connessione...' : '🔌 Connetti'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          connections={connections}
          onPayment={initiatePayment}
          onClose={() => setShowPaymentModal(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

function PaymentModal({ connections, onPayment, onClose, isLoading }: {
  connections: BankConnection[]
  onPayment: (fromAccountId: string, toIBAN: string, toName: string, amount: number, description: string) => void
  onClose: () => void
  isLoading: boolean
}) {
  const [fromAccount, setFromAccount] = useState(connections[0]?.id || '')
  const [toIBAN, setToIBAN] = useState('')
  const [toName, setToName] = useState('')
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')

  const fromConn = connections.find(c => c.id === fromAccount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromAccount || !toIBAN || !toName || amount <= 0) {
      alert('Compila tutti i campi')
      return
    }
    if (fromConn && amount > (fromConn.balance || 0)) {
      alert('Saldo insufficiente')
      return
    }
    onPayment(fromAccount, toIBAN, toName, amount, description)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">💸 Effettua Pagamento SEPA</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Da (Conto)</label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              {connections.map(conn => (
                <option key={conn.id} value={conn.id}>
                  {conn.bankName} (€{(conn.balance || 0).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">IBAN Destinatario</label>
            <input
              type="text"
              value={toIBAN}
              onChange={(e) => setToIBAN(e.target.value.toUpperCase())}
              placeholder="IT60X0000000000000000000000"
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome Destinatario</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="Mario Rossi"
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              required
            />
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Causale</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bonifico per..."
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              required
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-xs text-yellow-300">
              🔐 <strong>Autenticazione SCA:</strong> Dopo aver cliccato "Paga", verrai reindirizzato alla tua banca 
              per completare l'autenticazione forte (2FA/OTP).
            </p>
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
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? '⏳ Autorizzazione...' : '💸 Paga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OpenBankingPanel
