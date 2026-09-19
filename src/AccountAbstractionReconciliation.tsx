import { useState, useEffect } from 'react'

type BlockchainType = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base'

type UserWallet = {
  id: string
  address: string
  blockchain: BlockchainType
  balanceAccounting: number
  balanceOnChain: number | null
  currency: string
  lastSync: string
  verified: boolean
}

type TreasuryWallet = {
  address: string
  blockchain: BlockchainType
  balance: number
  connected: boolean
}

type UserOperation = {
  id: string
  sender: string          // Smart Account dell'utente
  target: string          // Indirizzo destinatario
  value: string           // Valore in Wei
  gasLimit: string        // Gas limit
  maxFeePerGas: string    // Max fee per gas
  maxPriorityFeePerGas: string
  paymasterData: string   // Dati paymaster per gas sponsorship
  signature: string       // Firma (opzionale per meta-tx)
  status: 'pending' | 'submitted' | 'confirmed' | 'failed'
  userOpHash?: string
  txHash?: string
  timestamp: string
}

type ReconciliationResult = {
  walletId: string
  balanceAccounting: number
  balanceOnChain: number
  difference: number
  status: 'reconciled' | 'discrepancy' | 'auto_funding'
  lastCheck: string
  autoFundingExecuted: boolean
  userOpHash?: string
}

// Configurazione Account Abstraction (ERC-4337)
const AA_CONFIG = {
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // EntryPoint v0.6
  bundlerUrl: 'https://api.pimlico.io/v1/sepolia/rpc?apikey=YOUR_API_KEY',
  paymasterUrl: 'https://api.pimlico.io/v1/sepolia/rpc?apikey=YOUR_API_KEY',
  factory: '0x9406Cc6185a346906296840746125a0E44976454', // SimpleAccountFactory
}

// RPC Endpoints pubblici
const RPC_ENDPOINTS: Record<BlockchainType, string> = {
  ethereum: 'https://eth.llamarpc.com',
  polygon: 'https://polygon-rpc.com',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io',
  base: 'https://mainnet.base.org'
}

function AccountAbstractionReconciliation() {
  const [wallets, setWallets] = useState<UserWallet[]>([])
  const [treasuryWallet, setTreasuryWallet] = useState<TreasuryWallet | null>(null)
  const [userOperations, setUserOperations] = useState<UserOperation[]>([])
  const [reconciliations, setReconciliations] = useState<ReconciliationResult[]>([])
  const [isAutoReconciling, setIsAutoReconciling] = useState(false)
  const [activeSection, setActiveSection] = useState<'wallets' | 'treasury' | 'reconciliation' | 'userops'>('wallets')
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoReconcileEnabled, setAutoReconcileEnabled] = useState(true)

  // Carica da localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aa_wallets')
    if (saved) setWallets(JSON.parse(saved))
    
    const savedTreasury = localStorage.getItem('aa_treasury')
    if (savedTreasury) setTreasuryWallet(JSON.parse(savedTreasury))
    
    const savedUserOps = localStorage.getItem('aa_user_operations')
    if (savedUserOps) setUserOperations(JSON.parse(savedUserOps))
    
    const savedRecs = localStorage.getItem('aa_reconciliations')
    if (savedRecs) setReconciliations(JSON.parse(savedRecs))
  }, [])

  useEffect(() => { localStorage.setItem('aa_wallets', JSON.stringify(wallets)) }, [wallets])
  useEffect(() => { localStorage.setItem('aa_treasury', JSON.stringify(treasuryWallet)) }, [treasuryWallet])
  useEffect(() => { localStorage.setItem('aa_user_operations', JSON.stringify(userOperations)) }, [userOperations])
  useEffect(() => { localStorage.setItem('aa_reconciliations', JSON.stringify(reconciliations)) }, [reconciliations])

  // ==================== BLOCKCHAIN QUERIES ====================

  const evmRpcCall = async (blockchain: BlockchainType, method: string, params: any[]): Promise<any> => {
    const response = await fetch(RPC_ENDPOINTS[blockchain], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    return data.result
  }

  const getBalance = async (address: string, blockchain: BlockchainType): Promise<number> => {
    const balanceHex = await evmRpcCall(blockchain, 'eth_getBalance', [address, 'latest'])
    const balanceWei = parseInt(balanceHex, 16)
    return balanceWei / 1e18
  }

  // ==================== ACCOUNT ABSTRACTION (ERC-4337) ====================

  /**
   * Crea uno Smart Account per l'utente (deterministico)
   * In produzione: chiama il Factory contract per deployare lo Smart Account
   */
  const computeSmartAccountAddress = (ownerAddress: string, blockchain: BlockchainType): string => {
    // In produzione: calcola l'indirizzo usando CREATE2
    // Per demo: genera un indirizzo deterministico basato sull'owner
    const hash = ownerAddress.toLowerCase().replace('0x', '')
    return '0x' + hash.substring(0, 40)
  }

  /**
   * Crea una UserOperation per il funding
   * Questo è il cuore di ERC-4337: l'operazione viene firmata dal Paymaster, non dall'utente
   */
  const createUserOperation = (
    smartAccount: string,
    target: string,
    value: string,
    blockchain: BlockchainType
  ): UserOperation => {
    return {
      id: `userop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: smartAccount,
      target: target,
      value: value,
      gasLimit: '0x5208', // 21000
      maxFeePerGas: '0x3B9ACA00', // 1 Gwei
      maxPriorityFeePerGas: '0x3B9ACA00',
      paymasterData: '0x', // Dati paymaster per gas sponsorship
      signature: '0x', // Firma opzionale per meta-transactions
      status: 'pending',
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Simula l'invio della UserOperation al Bundler
   * In produzione: chiama eth_sendUserOperation via Bundler
   */
  const sendUserOperationToBundler = async (userOp: UserOperation): Promise<string> => {
    // Simula chiamata al Bundler
    // In produzione: POST to bundlerUrl con la UserOperation
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Genera userOpHash (simulato)
    const userOpHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    return userOpHash
  }

  /**
   * Esegue il funding automatico tramite Account Abstraction
   * ZERO interazione utente, ZERO costi per l'utente
   */
  const executeAutoFunding = async (walletId: string): Promise<void> => {
    const wallet = wallets.find(w => w.id === walletId)
    if (!wallet) throw new Error('Wallet non trovato')

    const reconciliation = reconciliations.find(r => r.walletId === walletId)
    if (!reconciliation) throw new Error('Riconciliazione non trovata')

    const fundingNeeded = reconciliation.balanceAccounting - reconciliation.balanceOnChain
    if (fundingNeeded <= 0) throw new Error('Funding non necessario')

    if (!treasuryWallet || !treasuryWallet.connected) {
      throw new Error('Wallet di tesoreria non collegato')
    }

    if (treasuryWallet.balance < fundingNeeded) {
      throw new Error('Fondi insufficienti nella tesoreria')
    }

    // 1. Calcola Smart Account dell'utente
    const smartAccount = computeSmartAccountAddress(wallet.address, wallet.blockchain)

    // 2. Crea UserOperation per il funding
    const valueInWei = (fundingNeeded * 1e18).toString(16)
    const userOp = createUserOperation(
      smartAccount,
      wallet.address,
      '0x' + valueInWei,
      wallet.blockchain
    )

    // 3. Invia UserOperation al Bundler (ZERO firma utente)
    const userOpHash = await sendUserOperationToBundler(userOp)
    userOp.userOpHash = userOpHash
    userOp.status = 'submitted'

    // 4. Salva UserOperation
    setUserOperations(prev => [userOp, ...prev])

    // 5. Aggiorna stato riconciliazione
    setReconciliations(prev => prev.map(r => 
      r.walletId === walletId 
        ? { ...r, status: 'auto_funding', autoFundingExecuted: true, userOpHash }
        : r
    ))

    // 6. Simula conferma (in produzione: monitora realmente)
    setTimeout(async () => {
      userOp.status = 'confirmed'
      userOp.txHash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')
      
      setUserOperations(prev => prev.map(op => 
        op.id === userOp.id ? { ...op, status: 'confirmed', txHash: userOp.txHash } : op
      ))

      // Aggiorna saldo on-chain
      const newBalanceOnChain = wallet.balanceOnChain! + fundingNeeded
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? { ...w, balanceOnChain: newBalanceOnChain, lastSync: new Date().toISOString() }
          : w
      ))

      // Aggiorna riconciliazione
      setReconciliations(prev => prev.map(r => 
        r.walletId === walletId 
          ? { 
              ...r, 
              balanceOnChain: newBalanceOnChain,
              difference: 0,
              status: 'reconciled',
              lastCheck: new Date().toISOString()
            }
          : r
      ))

      // Aggiorna balance tesoreria
      if (treasuryWallet) {
        const newTreasuryBalance = treasuryWallet.balance - fundingNeeded
        setTreasuryWallet({ ...treasuryWallet, balance: newTreasuryBalance })
      }
    }, 3000)
  }

  /**
   * Riconciliazione automatica: rileva discrepanze ed esegue funding
   * Trigger automatico in background
   */
  const autoReconcile = async () => {
    if (!autoReconcileEnabled) return
    if (!treasuryWallet || !treasuryWallet.connected) return

    setIsAutoReconciling(true)
    setError(null)

    try {
      // Trova wallet con discrepanze
      const walletsToReconcile = reconciliations.filter(r => 
        r.status === 'discrepancy' && r.difference > 0
      )

      for (const rec of walletsToReconcile) {
        await executeAutoFunding(rec.walletId)
        // Delay tra operazioni per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      if (walletsToReconcile.length > 0) {
        console.log(`✅ Riconciliazione automatica completata: ${walletsToReconcile.length} wallet`)
      }
    } catch (err: any) {
      setError(`Errore riconciliazione automatica: ${err.message}`)
    } finally {
      setIsAutoReconciling(false)
    }
  }

  // ==================== OPERAZIONI PRINCIPALI ====================

  const verifyWalletOnChain = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId)
    if (!wallet) return

    try {
      const balance = await getBalance(wallet.address, wallet.blockchain)
      
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? { ...w, balanceOnChain: balance, verified: true, lastSync: new Date().toISOString() }
          : w
      ))

      const difference = wallet.balanceAccounting - balance
      const reconciliation: ReconciliationResult = {
        walletId,
        balanceAccounting: wallet.balanceAccounting,
        balanceOnChain: balance,
        difference,
        status: Math.abs(difference) < 0.0001 ? 'reconciled' : 'discrepancy',
        lastCheck: new Date().toISOString(),
        autoFundingExecuted: false
      }

      setReconciliations(prev => {
        const filtered = prev.filter(r => r.walletId !== walletId)
        return [...filtered, reconciliation]
      })

      // Trigger auto-reconcile se abilitato
      if (autoReconcileEnabled && Math.abs(difference) > 0.0001) {
        setTimeout(() => autoReconcile(), 1000)
      }

    } catch (err: any) {
      setError(`Errore verifica: ${err.message}`)
    }
  }

  const connectTreasuryWallet = async (blockchain: BlockchainType) => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask non installato')
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length === 0) return

      const address = accounts[0]
      const balance = await getBalance(address, blockchain)
      
      setTreasuryWallet({ address, blockchain, balance, connected: true })
      setError(null)
    } catch (err: any) {
      setError(`Errore connessione tesoreria: ${err.message}`)
    }
  }

  const addWallet = (address: string, blockchain: BlockchainType, balanceAccounting: number) => {
    const newWallet: UserWallet = {
      id: Date.now().toString(),
      address,
      blockchain,
      balanceAccounting,
      balanceOnChain: null,
      currency: 'ETH',
      lastSync: new Date().toISOString(),
      verified: false
    }
    setWallets(prev => [...prev, newWallet])
    setShowAddWallet(false)
  }

  const removeWallet = (id: string) => {
    if (!confirm('Rimuovere questo wallet?')) return
    setWallets(prev => prev.filter(w => w.id !== id))
    setReconciliations(prev => prev.filter(r => r.walletId !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">⚙️ Riconciliazione con Account Abstraction (ERC-4337)</h2>
        <p className="text-slate-300 mb-4">
          Automazione totale: Zero interazione utente, Zero costi per gli utenti
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Wallet</p>
            <p className="text-xl font-bold">{wallets.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">UserOps Eseguiti</p>
            <p className="text-xl font-bold text-emerald-400">
              {userOperations.filter(op => op.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Auto-Reconcile</p>
            <p className="text-xl font-bold">
              <span className={autoReconcileEnabled ? 'text-emerald-400' : 'text-red-400'}>
                {autoReconcileEnabled ? '✓ Attivo' : '✗ Disattivo'}
              </span>
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Tesoreria</p>
            <p className="text-xl font-bold text-cyan-400">
              {treasuryWallet ? `${treasuryWallet.balance.toFixed(4)} ETH` : 'Non collegata'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setAutoReconcileEnabled(!autoReconcileEnabled)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              autoReconcileEnabled
                ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-400'
            }`}
          >
            {autoReconcileEnabled ? '✓ Auto-Reconcile Attivo' : '○ Auto-Reconcile Disattivo'}
          </button>
          <button
            onClick={autoReconcile}
            disabled={isAutoReconciling}
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 transition-all disabled:opacity-50"
          >
            {isAutoReconciling ? '⏳ Esecuzione...' : '🔄 Esegui Ora'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300">❌ {error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50 overflow-x-auto">
        {[
          { id: 'wallets' as const, label: '💼 Wallet' },
          { id: 'treasury' as const, label: '🏦 Tesoreria' },
          { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
          { id: 'userops' as const, label: '📜 User Operations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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
            <h3 className="text-xl font-bold">Wallet Utenti</h3>
            <button
              onClick={() => setShowAddWallet(true)}
              className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-sm text-purple-300 transition-all"
            >
              + Aggiungi Wallet
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-slate-400">Nessun wallet aggiunto</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map(wallet => {
                const rec = reconciliations.find(r => r.walletId === wallet.id)
                return (
                  <div key={wallet.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">Wallet Utente</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {wallet.address.substring(0, 15)}...
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        wallet.verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {wallet.verified ? '✓ Verificato' : '⏳ Da verificare'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Contabile:</span>
                        <span className="font-semibold text-cyan-400">
                          {wallet.balanceAccounting.toFixed(6)} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">On-Chain:</span>
                        <span className={`font-semibold ${
                          wallet.balanceOnChain !== null ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {wallet.balanceOnChain !== null 
                            ? `${wallet.balanceOnChain.toFixed(6)} ETH`
                            : 'Non verificato'}
                        </span>
                      </div>
                      {rec && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Status:</span>
                          <span className={`text-sm font-semibold ${
                            rec.status === 'reconciled' ? 'text-emerald-400' :
                            rec.status === 'auto_funding' ? 'text-purple-400' :
                            'text-red-400'
                          }`}>
                            {rec.status === 'reconciled' ? '✓ Riconciliato' :
                             rec.status === 'auto_funding' ? '⚙️ Funding in corso' :
                             '⚠️ Discrepanza'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyWalletOnChain(wallet.id)}
                        className="flex-1 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-xs text-purple-300 transition-all"
                      >
                        🔍 Verifica
                      </button>
                      <button
                        onClick={() => removeWallet(wallet.id)}
                        className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Treasury Section */}
      {activeSection === 'treasury' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">🏦 Wallet di Tesoreria</h3>
          
          {!treasuryWallet || !treasuryWallet.connected ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-slate-400 mb-4">Tesoreria non collegata</p>
              <button
                onClick={() => connectTreasuryWallet('ethereum')}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                🔗 Collega Tesoreria
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg">Tesoreria Collegata</h4>
                  <p className="text-xs text-slate-400 font-mono">{treasuryWallet.address}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                  ✓ Connessa
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Blockchain</p>
                  <p className="text-lg font-bold capitalize">{treasuryWallet.blockchain}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Balance Disponibile</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {treasuryWallet.balance.toFixed(6)} ETH
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h5 className="font-semibold text-blue-300 mb-2">⚙️ Account Abstraction (ERC-4337)</h5>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>EntryPoint: <code className="text-xs">{AA_CONFIG.entryPoint.substring(0, 20)}...</code></li>
                  <li>Bundler: Pimlico</li>
                  <li>Paymaster: Gas sponsorship attivo</li>
                  <li>Zero costi per utenti: ✓</li>
                  <li>Zero firma utente: ✓</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reconciliation Section */}
      {activeSection === 'reconciliation' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">🔄 Riconciliazione Automatica</h3>
          
          {reconciliations.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-slate-400">Nessuna riconciliazione eseguita</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reconciliations.map(rec => {
                const wallet = wallets.find(w => w.id === rec.walletId)
                if (!wallet) return null

                return (
                  <div key={rec.walletId} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Wallet: {wallet.address.substring(0, 15)}...</h4>
                        <p className="text-xs text-slate-400">{wallet.blockchain}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        rec.status === 'reconciled' ? 'bg-emerald-500/20 text-emerald-300' :
                        rec.status === 'auto_funding' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {rec.status === 'reconciled' ? '✓ Riconciliato' :
                         rec.status === 'auto_funding' ? '⚙️ Funding Automatico' :
                         '⚠️ Discrepanza'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Contabile</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {rec.balanceAccounting.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">On-Chain</p>
                        <p className="text-lg font-bold text-emerald-400">
                          {rec.balanceOnChain.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Differenza</p>
                        <p className={`text-lg font-bold ${
                          rec.difference === 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {rec.difference > 0 ? '+' : ''}{rec.difference.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {rec.autoFundingExecuted && rec.userOpHash && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <p className="text-xs text-purple-300">
                          ⚙️ <strong>Funding Automatico Eseguito</strong><br />
                          UserOp Hash: <code className="text-xs">{rec.userOpHash.substring(0, 20)}...</code><br />
                          Zero costi utente • Zero firma richiesta • Automazione completa
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 mt-2">
                      Ultimo check: {new Date(rec.lastCheck).toLocaleString('it-IT')}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* User Operations Section */}
      {activeSection === 'userops' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">📜 User Operations (ERC-4337)</h3>
          
          {userOperations.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-slate-400">Nessuna User Operation eseguita</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userOperations.map(op => (
                <div key={op.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">User Operation</p>
                      <p className="text-xs text-slate-400 font-mono">
                        {op.userOpHash?.substring(0, 20) || op.id}...
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      op.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      op.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-300' :
                      op.status === 'pending' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {op.status === 'confirmed' ? '✓ Confermato' :
                       op.status === 'submitted' ? '⏳ Inviato' :
                       op.status === 'pending' ? '⏸️ In coda' : '✗ Fallito'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Sender (Smart Account)</p>
                      <p className="text-sm font-mono text-slate-300">
                        {op.sender.substring(0, 15)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Target (Destinatario)</p>
                      <p className="text-sm font-mono text-slate-300">
                        {op.target.substring(0, 15)}...
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Valore:</span>
                      <span className="font-bold text-emerald-400">
                        {(parseInt(op.value, 16) / 1e18).toFixed(6)} ETH
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Gas Sponsorship:</span>
                      <span className="text-emerald-400">✓ Paymaster</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Firma Utente:</span>
                      <span className="text-emerald-400">✗ Non richiesta</span>
                    </div>
                  </div>

                  {op.txHash && (
                    <p className="text-xs text-slate-500">
                      Tx Hash: <code>{op.txHash.substring(0, 20)}...</code>
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Timestamp: {new Date(op.timestamp).toLocaleString('it-IT')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <AddWalletModal
          onAdd={addWallet}
          onClose={() => setShowAddWallet(false)}
        />
      )}
    </div>
  )
}

function AddWalletModal({ onAdd, onClose }: {
  onAdd: (address: string, blockchain: BlockchainType, balance: number) => void
  onClose: () => void
}) {
  const [blockchain, setBlockchain] = useState<BlockchainType>('ethereum')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return
    onAdd(address, blockchain, balance)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Aggiungi Wallet Utente</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Blockchain</label>
            <select
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value as BlockchainType)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="base">Base</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Indirizzo Wallet</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Saldo Contabile (ETH)</label>
            <input
              type="number"
              step="0.000001"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
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
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccountAbstractionReconciliation
