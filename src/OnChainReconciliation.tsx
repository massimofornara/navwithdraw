import { useState } from 'react'

type BlockchainTransaction = {
  id: string
  hash: string
  blockNumber: number
  timestamp: string
  from: string
  to: string
  value: number
  fee: number
  currency: string
  status: 'confirmed' | 'pending' | 'failed'
  confirmations: number
  type: 'incoming' | 'outgoing' | 'swap' | 'contract'
}

type WalletOnChain = {
  id: string
  address: string
  blockchain: 'bitcoin' | 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base'
  balance: number
  balanceFiat: number
  currency: string
  pendingTransactions: number
  lastSync: string
  verified: boolean
}

type OnChainReconciliation = {
  id: string
  walletId: string
  accountingBalance: number
  onChainBalance: number
  pendingIncoming: number
  pendingOutgoing: number
  totalFees: number
  difference: number
  status: 'reconciled' | 'discrepancy' | 'pending'
  lastCheck: string
  transactionsMatched: number
  transactionsUnmatched: number
}

type GasPrice = {
  blockchain: string
  slow: number
  standard: number
  fast: number
  timestamp: string
}

function OnChainReconciliationPanel() {
  const [activeSection, setActiveSection] = useState<'wallets' | 'transactions' | 'reconciliation' | 'gas'>('wallets')
  const [verifyingWallet, setVerifyingWallet] = useState<string | null>(null)
  const [showAddWallet, setShowAddWallet] = useState(false)

  // Wallet on-chain di esempio
  const [wallets, setWallets] = useState<WalletOnChain[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      blockchain: 'ethereum',
      balance: 2.456,
      balanceFiat: 8920.50,
      currency: 'ETH',
      pendingTransactions: 2,
      lastSync: '2024-01-15 14:30:00',
      verified: true
    },
    {
      id: '2',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      blockchain: 'bitcoin',
      balance: 0.1234,
      balanceFiat: 6780.25,
      currency: 'BTC',
      pendingTransactions: 0,
      lastSync: '2024-01-15 14:25:00',
      verified: true
    },
    {
      id: '3',
      address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
      blockchain: 'polygon',
      balance: 15000,
      balanceFiat: 15000.00,
      currency: 'USDC',
      pendingTransactions: 1,
      lastSync: '2024-01-15 14:20:00',
      verified: true
    },
    {
      id: '4',
      address: '0x9A8b7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0B',
      blockchain: 'arbitrum',
      balance: 5.678,
      balanceFiat: 20650.80,
      currency: 'ETH',
      pendingTransactions: 0,
      lastSync: '2024-01-15 14:15:00',
      verified: false
    }
  ])

  // Transazioni on-chain
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([
    {
      id: '1',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockNumber: 18923456,
      timestamp: '2024-01-15 14:30:00',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0xAbC123...XyZ789',
      value: 0.5,
      fee: 0.002,
      currency: 'ETH',
      status: 'confirmed',
      confirmations: 35,
      type: 'outgoing'
    },
    {
      id: '2',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 18923450,
      timestamp: '2024-01-15 14:15:00',
      from: '0xDeF456...AbC123',
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      value: 1.2,
      fee: 0.0015,
      currency: 'ETH',
      status: 'confirmed',
      confirmations: 41,
      type: 'incoming'
    },
    {
      id: '3',
      hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      blockNumber: 823456,
      timestamp: '2024-01-15 13:45:00',
      from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      value: 0.0234,
      fee: 0.0001,
      currency: 'BTC',
      status: 'confirmed',
      confirmations: 6,
      type: 'incoming'
    },
    {
      id: '4',
      hash: '0x555566667777888899990000aaabbbcccdddeeefff111222333444555666777',
      blockNumber: 54567890,
      timestamp: '2024-01-15 14:00:00',
      from: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0xContract...Address',
      value: 500,
      fee: 2.5,
      currency: 'USDC',
      status: 'pending',
      confirmations: 0,
      type: 'outgoing'
    }
  ])

  // Riconciliazioni on-chain
  const [reconciliations, setReconciliations] = useState<OnChainReconciliation[]>([
    {
      id: '1',
      walletId: '1',
      accountingBalance: 2.456,
      onChainBalance: 2.456,
      pendingIncoming: 0,
      pendingOutgoing: 0.5,
      totalFees: 0.0035,
      difference: 0,
      status: 'reconciled',
      lastCheck: '2024-01-15 14:30:00',
      transactionsMatched: 15,
      transactionsUnmatched: 0
    },
    {
      id: '2',
      walletId: '2',
      accountingBalance: 0.1234,
      onChainBalance: 0.1234,
      pendingIncoming: 0,
      pendingOutgoing: 0,
      totalFees: 0.0001,
      difference: 0,
      status: 'reconciled',
      lastCheck: '2024-01-15 14:25:00',
      transactionsMatched: 8,
      transactionsUnmatched: 0
    },
    {
      id: '3',
      walletId: '3',
      accountingBalance: 15500,
      onChainBalance: 15000,
      pendingIncoming: 0,
      pendingOutgoing: 500,
      totalFees: 2.5,
      difference: 500,
      status: 'pending',
      lastCheck: '2024-01-15 14:20:00',
      transactionsMatched: 12,
      transactionsUnmatched: 1
    },
    {
      id: '4',
      walletId: '4',
      accountingBalance: 5.5,
      onChainBalance: 5.678,
      pendingIncoming: 0,
      pendingOutgoing: 0,
      totalFees: 0.015,
      difference: -0.178,
      status: 'discrepancy',
      lastCheck: '2024-01-15 14:15:00',
      transactionsMatched: 20,
      transactionsUnmatched: 2
    }
  ])

  // Gas prices
  const [gasPrices, setGasPrices] = useState<GasPrice[]>([
    {
      blockchain: 'ethereum',
      slow: 15,
      standard: 25,
      fast: 35,
      timestamp: '2024-01-15 14:30:00'
    },
    {
      blockchain: 'polygon',
      slow: 30,
      standard: 50,
      fast: 80,
      timestamp: '2024-01-15 14:30:00'
    },
    {
      blockchain: 'arbitrum',
      slow: 0.1,
      standard: 0.15,
      fast: 0.2,
      timestamp: '2024-01-15 14:30:00'
    },
    {
      blockchain: 'optimism',
      slow: 0.05,
      standard: 0.08,
      fast: 0.12,
      timestamp: '2024-01-15 14:30:00'
    },
    {
      blockchain: 'base',
      slow: 0.03,
      standard: 0.05,
      fast: 0.08,
      timestamp: '2024-01-15 14:30:00'
    }
  ])

  const totalBalanceFiat = wallets.reduce((sum, w) => sum + w.balanceFiat, 0)
  const totalPending = wallets.reduce((sum, w) => sum + w.pendingTransactions, 0)
  const reconciledCount = reconciliations.filter(r => r.status === 'reconciled').length
  const discrepancyCount = reconciliations.filter(r => r.status === 'discrepancy').length

  const verifyWallet = async (walletId: string) => {
    setVerifyingWallet(walletId)
    
    // Simula verifica on-chain
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setWallets(wallets.map(w => 
      w.id === walletId 
        ? { ...w, verified: true, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19) }
        : w
    ))
    
    setVerifyingWallet(null)
  }

  const reconcileWallet = async (reconciliationId: string) => {
    const reconciliation = reconciliations.find(r => r.id === reconciliationId)
    if (!reconciliation) return

    // Simula riconciliazione
    await new Promise(resolve => setTimeout(resolve, 1500))

    setReconciliations(reconciliations.map(r =>
      r.id === reconciliationId
        ? { 
            ...r, 
            status: 'reconciled' as const,
            difference: 0,
            lastCheck: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        : r
    ))
  }

  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain) {
      case 'bitcoin': return '₿'
      case 'ethereum': return 'Ξ'
      case 'polygon': return '⬡'
      case 'arbitrum': return '🔵'
      case 'optimism': return '🔴'
      case 'base': return '🔷'
      default: return '⬡'
    }
  }

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'bitcoin': return 'from-orange-500/20 to-orange-700/20 border-orange-500/30'
      case 'ethereum': return 'from-blue-500/20 to-blue-700/20 border-blue-500/30'
      case 'polygon': return 'from-purple-500/20 to-purple-700/20 border-purple-500/30'
      case 'arbitrum': return 'from-cyan-500/20 to-cyan-700/20 border-cyan-500/30'
      case 'optimism': return 'from-red-500/20 to-red-700/20 border-red-500/30'
      case 'base': return 'from-indigo-500/20 to-indigo-700/20 border-indigo-500/30'
      default: return 'from-slate-500/20 to-slate-700/20 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🔗 Riconciliazione On-Chain</h2>
        <p className="text-slate-300">
          Verifica e riconcilia saldi crypto direttamente dalla blockchain
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Saldo Totale</p>
            <p className="text-xl font-bold">€{totalBalanceFiat.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Wallet Verificati</p>
            <p className="text-xl font-bold">{wallets.filter(w => w.verified).length}/{wallets.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">TX Pendenti</p>
            <p className="text-xl font-bold text-yellow-400">{totalPending}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Riconciliati</p>
            <p className="text-xl font-bold text-emerald-400">{reconciledCount}/{reconciliations.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50">
        {[
          { id: 'wallets' as const, label: '💼 Wallet' },
          { id: 'transactions' as const, label: '📜 Transazioni' },
          { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
          { id: 'gas' as const, label: '⛽ Gas Prices' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wallets Section */}
      {activeSection === 'wallets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Wallet On-Chain</h3>
            <button
              onClick={() => setShowAddWallet(true)}
              className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-sm text-purple-300 transition-all"
            >
              + Aggiungi Wallet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`bg-gradient-to-br ${getBlockchainColor(wallet.blockchain)} border rounded-xl p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getBlockchainIcon(wallet.blockchain)}</span>
                    <div>
                      <h4 className="font-semibold capitalize">{wallet.blockchain}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                      </p>
                    </div>
                  </div>
                  {wallet.verified ? (
                    <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                      ✓ Verificato
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                      ⏳ Da verificare
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Saldo:</span>
                    <span className="font-bold text-lg">
                      {wallet.balance.toFixed(4)} {wallet.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Valore Fiat:</span>
                    <span className="font-semibold">
                      €{wallet.balanceFiat.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">TX Pendenti:</span>
                    <span className={wallet.pendingTransactions > 0 ? 'text-yellow-400' : 'text-slate-300'}>
                      {wallet.pendingTransactions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Ultimo Sync:</span>
                    <span className="text-xs text-slate-400">{wallet.lastSync}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => verifyWallet(wallet.id)}
                    disabled={verifyingWallet === wallet.id || wallet.verified}
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-xs text-purple-300 transition-all disabled:opacity-50"
                  >
                    {verifyingWallet === wallet.id ? '⏳ Verifica...' : wallet.verified ? '✓ Verificato' : '🔍 Verifica On-Chain'}
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-xs text-slate-300 transition-all"
                    title="Visualizza su explorer"
                  >
                    🔗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Section */}
      {activeSection === 'transactions' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Transazioni On-Chain</h3>
          
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-5 py-3">Hash</th>
                    <th className="px-5 py-3">Blocco</th>
                    <th className="px-5 py-3">Da → A</th>
                    <th className="px-5 py-3">Valore</th>
                    <th className="px-5 py-3">Fee</th>
                    <th className="px-5 py-3">Conferme</th>
                    <th className="px-5 py-3">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-300">
                          {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">#{tx.blockNumber.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="text-xs">
                          <div className="font-mono text-slate-400">
                            {tx.from.substring(0, 8)}...
                          </div>
                          <div className="text-slate-500">↓</div>
                          <div className="font-mono text-slate-400">
                            {tx.to.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${
                          tx.type === 'incoming' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'incoming' ? '+' : '-'}{tx.value} {tx.currency}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {tx.fee} {tx.currency}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm ${
                          tx.confirmations > 12 ? 'text-emerald-400' :
                          tx.confirmations > 0 ? 'text-yellow-400' : 'text-slate-400'
                        }`}>
                          {tx.confirmations}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {tx.status === 'confirmed' ? '✓ Confermata' :
                           tx.status === 'pending' ? '⏳ Pendente' : '✗ Fallita'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation Section */}
      {activeSection === 'reconciliation' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Riconciliazione Contabile ↔ On-Chain</h3>
          
          <div className="space-y-3">
            {reconciliations.map((rec) => {
              const wallet = wallets.find(w => w.id === rec.walletId)
              if (!wallet) return null

              return (
                <div key={rec.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getBlockchainIcon(wallet.blockchain)}</span>
                      <div>
                        <h4 className="font-semibold capitalize">{wallet.blockchain} Wallet</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {wallet.address.substring(0, 15)}...
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      rec.status === 'reconciled' ? 'bg-emerald-500/20 text-emerald-300' :
                      rec.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {rec.status === 'reconciled' ? '✓ Riconciliato' :
                       rec.status === 'pending' ? '⏳ In attesa' : '⚠ Discrepanza'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Saldo Contabile</p>
                      <p className="text-lg font-bold">
                        {rec.accountingBalance.toFixed(4)} {wallet.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Saldo On-Chain</p>
                      <p className="text-lg font-bold text-purple-400">
                        {rec.onChainBalance.toFixed(4)} {wallet.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">TX Matchate</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {rec.transactionsMatched}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Differenza</p>
                      <p className={`text-lg font-bold ${
                        rec.difference === 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {rec.difference > 0 ? '+' : ''}{rec.difference.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-700/50 pt-3 mb-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">TX Pendenti In:</span>
                        <span className="ml-2 text-yellow-400">{rec.pendingIncoming}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">TX Pendenti Out:</span>
                        <span className="ml-2 text-yellow-400">{rec.pendingOutgoing}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Fee Totali:</span>
                        <span className="ml-2 text-slate-300">{rec.totalFees.toFixed(4)} {wallet.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Ultimo check: {rec.lastCheck}
                    </p>
                    {rec.status !== 'reconciled' && (
                      <button
                        onClick={() => reconcileWallet(rec.id)}
                        className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
                      >
                        🔄 Riconcilia
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gas Prices Section */}
      {activeSection === 'gas' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Gas Prices in Tempo Reale</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gasPrices.map((gas) => (
              <div key={gas.blockchain} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getBlockchainIcon(gas.blockchain)}</span>
                  <h4 className="font-semibold capitalize">{gas.blockchain}</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">🐢 Slow</p>
                      <p className="text-sm text-slate-300">~5 min</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">
                      {gas.slow} {gas.blockchain === 'bitcoin' ? 'sat/vB' : 'Gwei'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">🚶 Standard</p>
                      <p className="text-sm text-slate-300">~3 min</p>
                    </div>
                    <p className="text-lg font-bold text-yellow-400">
                      {gas.standard} {gas.blockchain === 'bitcoin' ? 'sat/vB' : 'Gwei'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-400">🚀 Fast</p>
                      <p className="text-sm text-slate-300">~30 sec</p>
                    </div>
                    <p className="text-lg font-bold text-red-400">
                      {gas.fast} {gas.blockchain === 'bitcoin' ? 'sat/vB' : 'Gwei'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 text-center">
                  Aggiornato: {gas.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Aggiungi Wallet On-Chain</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Blockchain
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white">
                  <option value="ethereum">Ethereum</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="optimism">Optimism</option>
                  <option value="base">Base</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Indirizzo Wallet
                </label>
                <input
                  type="text"
                  placeholder="0x... o bc1..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Saldo Contabile
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="0.0000"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddWallet(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => setShowAddWallet(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OnChainReconciliationPanel
