import { useState, useEffect } from 'react'

type BlockchainType = 'ethereum' | 'bitcoin' | 'polygon' | 'arbitrum' | 'optimism' | 'base'

type WalletOnChain = {
  id: string
  address: string
  blockchain: BlockchainType
  balanceAccounting: number // Saldo contabile dichiarato
  balanceOnChain: number | null // Saldo verificato on-chain
  balanceFiat: number | null
  currency: string
  pendingTransactions: number
  lastSync: string
  verified: boolean
  transactions: OnChainTransaction[]
}

type TreasuryWallet = {
  address: string
  blockchain: BlockchainType
  balance: number
  connected: boolean
}

type FundingTransaction = {
  id: string
  fromTreasury: string
  toUserWallet: string
  amount: number
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  blockNumber?: number
}

type OnChainTransaction = {
  hash: string
  blockNumber: number
  timestamp: number
  from: string
  to: string
  value: number
  fee: number
  status: 'confirmed' | 'pending' | 'failed'
  confirmations: number
  type: 'incoming' | 'outgoing'
}

type ReconciliationResult = {
  walletId: string
  balanceAccounting: number
  balanceOnChain: number
  pendingIncoming: number
  pendingOutgoing: number
  totalFees: number
  difference: number
  status: 'reconciled' | 'discrepancy' | 'pending'
  lastCheck: string
  transactionsMatched: number
  transactionsUnmatched: number
}

// RPC Endpoints pubblici (gratuiti, no API key)
const RPC_ENDPOINTS: Record<BlockchainType, string> = {
  ethereum: 'https://eth.llamarpc.com',
  bitcoin: 'https://blockchain.info', // REST API
  polygon: 'https://polygon-rpc.com',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io',
  base: 'https://mainnet.base.org'
}

const BLOCK_EXPLORERS: Record<BlockchainType, string> = {
  ethereum: 'https://etherscan.io',
  bitcoin: 'https://blockchain.info',
  polygon: 'https://polygonscan.com',
  arbitrum: 'https://arbiscan.io',
  optimism: 'https://optimistic.etherscan.io',
  base: 'https://basescan.org'
}

const BLOCKCHAIN_INFO: Record<BlockchainType, { name: string, symbol: string, icon: string, decimals: number }> = {
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', decimals: 18 },
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', decimals: 8 },
  polygon: { name: 'Polygon', symbol: 'MATIC', icon: '⬡', decimals: 18 },
  arbitrum: { name: 'Arbitrum', symbol: 'ETH', icon: '🔵', decimals: 18 },
  optimism: { name: 'Optimism', symbol: 'ETH', icon: '🔴', decimals: 18 },
  base: { name: 'Base', symbol: 'ETH', icon: '🔷', decimals: 18 }
}

function OnChainReconciliationReal() {
  const [wallets, setWallets] = useState<WalletOnChain[]>([])
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [verifyingWallet, setVerifyingWallet] = useState<string | null>(null)
  const [reconcilingWallet, setReconcilingWallet] = useState<string | null>(null)
  const [reconciliations, setReconciliations] = useState<ReconciliationResult[]>([])
  const [activeSection, setActiveSection] = useState<'wallets' | 'transactions' | 'reconciliation' | 'treasury' | 'funding'>('wallets')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Treasury Wallet (per funding/clearing)
  const [treasuryWallet, setTreasuryWallet] = useState<TreasuryWallet | null>(null)
  const [fundingTransactions, setFundingTransactions] = useState<FundingTransaction[]>([])
  const [isFunding, setIsFunding] = useState(false)

  // Carica da localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onchain_wallets_real')
    if (saved) {
      setWallets(JSON.parse(saved))
    }
    const savedRec = localStorage.getItem('onchain_reconciliations_real')
    if (savedRec) {
      setReconciliations(JSON.parse(savedRec))
    }
    const savedTreasury = localStorage.getItem('treasury_wallet')
    if (savedTreasury) {
      setTreasuryWallet(JSON.parse(savedTreasury))
    }
    const savedFundingTxs = localStorage.getItem('funding_transactions')
    if (savedFundingTxs) {
      setFundingTransactions(JSON.parse(savedFundingTxs))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('onchain_wallets_real', JSON.stringify(wallets))
  }, [wallets])

  useEffect(() => {
    localStorage.setItem('onchain_reconciliations_real', JSON.stringify(reconciliations))
  }, [reconciliations])

  useEffect(() => {
    localStorage.setItem('funding_transactions', JSON.stringify(fundingTransactions))
  }, [fundingTransactions])

  // ==================== FUNZIONI BLOCKCHAIN REALI ====================

  // EVM RPC Call
  const evmRpcCall = async (blockchain: BlockchainType, method: string, params: any[]): Promise<any> => {
    const response = await fetch(RPC_ENDPOINTS[blockchain], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    return data.result
  }

  // Verifica balance reale su EVM chain
  const getEvmBalance = async (address: string, blockchain: BlockchainType): Promise<number> => {
    const balanceHex = await evmRpcCall(blockchain, 'eth_getBalance', [address, 'latest'])
    const balanceWei = parseInt(balanceHex, 16)
    return balanceWei / Math.pow(10, BLOCKCHAIN_INFO[blockchain].decimals)
  }

  // Verifica balance reale su Bitcoin
  const getBtcBalance = async (address: string): Promise<number> => {
    const response = await fetch(`${RPC_ENDPOINTS.bitcoin}/rawaddr/${address}?limit=50`)
    const data = await response.json()
    return data.final_balance / 1e8 // Satoshi to BTC
  }

  // Ottieni transazioni reali da EVM chain
  const getEvmTransactions = async (address: string, blockchain: BlockchainType): Promise<OnChainTransaction[]> => {
    // Usa Blockscout o simili API pubbliche per ottenere transazioni
    // In alternativa, usa logs/events per tracciare transfer
    const currentBlock = await evmRpcCall(blockchain, 'eth_blockNumber', [])
    const currentBlockNum = parseInt(currentBlock, 16)
    
    // Per demo: cerca negli ultimi 1000 blocchi
    const fromBlock = (currentBlockNum - 1000).toString(16)
    
    try {
      // Cerca transfer events (ERC20) e transazioni native
      const logs = await evmRpcCall(blockchain, 'eth_getLogs', [{
        fromBlock,
        toBlock: 'latest',
        address: address,
        topics: []
      }])
      
      // Per semplicità, restituiamo struttura base
      // In produzione useresti un indexer come The Graph o Etherscan API
      return []
    } catch (e) {
      console.log('Transazioni non disponibili via RPC diretto, uso API alternativa')
      return []
    }
  }

  // Ottieni transazioni Bitcoin reali
  const getBtcTransactions = async (address: string): Promise<OnChainTransaction[]> => {
    try {
      const response = await fetch(`${RPC_ENDPOINTS.bitcoin}/rawaddr/${address}?limit=50`)
      const data = await response.json()
      
      const currentBlock = data.txIndexes?.[0]?.block_height || 0
      
      return (data.txs || []).map((tx: any) => {
        const inputs = tx.inputs || []
        const outputs = tx.outputs || []
        
        const isIncoming = outputs.some((o: any) => o.addr === address)
        const value = isIncoming 
          ? outputs.filter((o: any) => o.addr === address).reduce((sum: number, o: any) => sum + o.value, 0)
          : inputs.filter((i: any) => i.prev_out?.addr === address).reduce((sum: number, i: any) => sum + i.prev_out.value, 0)
        
        const fee = tx.fee ? tx.fee / 1e8 : 0
        const confirmations = tx.block_height ? currentBlock - tx.block_height + 1 : 0
        
        return {
          hash: tx.hash,
          blockNumber: tx.block_height || 0,
          timestamp: tx.time * 1000,
          from: isIncoming ? (inputs[0]?.prev_out?.addr || 'unknown') : address,
          to: isIncoming ? address : (outputs[0]?.addr || 'unknown'),
          value: value / 1e8,
          fee,
          status: confirmations >= 12 ? 'confirmed' as const : confirmations > 0 ? 'pending' as const : 'pending' as const,
          confirmations,
          type: isIncoming ? 'incoming' as const : 'outgoing' as const
        }
      })
    } catch (e) {
      console.error('Errore fetch transazioni Bitcoin:', e)
      return []
    }
  }

  // Ottieni block corrente per calcolare conferme
  const getCurrentBlock = async (blockchain: BlockchainType): Promise<number> => {
    if (blockchain === 'bitcoin') {
      const response = await fetch(`${RPC_ENDPOINTS.bitcoin}/latestblock`)
      const data = await response.json()
      return data.height
    } else {
      const blockHex = await evmRpcCall(blockchain, 'eth_blockNumber', [])
      return parseInt(blockHex, 16)
    }
  }

  // ==================== FUNZIONI TREASURY & FUNDING ====================

  // Collega wallet di tesoreria via MetaMask
  const connectTreasuryWallet = async (blockchain: BlockchainType) => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask non installato. Scarica da https://metamask.io')
      return
    }

    try {
      // Richiedi connessione
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length === 0) {
        setError('Nessun account selezionato')
        return
      }

      const address = accounts[0]
      
      // Ottieni balance della tesoreria
      const balance = await getEvmBalance(address, blockchain)
      
      setTreasuryWallet({
        address,
        blockchain,
        balance,
        connected: true
      })

      // Salva in localStorage
      localStorage.setItem('treasury_wallet', JSON.stringify({
        address,
        blockchain,
        balance,
        connected: true
      }))

      setError(null)
      alert(`✅ Wallet di tesoreria collegato!\n\nIndirizzo: ${address}\nBalance: ${balance.toFixed(6)} ${BLOCKCHAIN_INFO[blockchain].symbol}`)
      
    } catch (err: any) {
      setError(`Errore connessione tesoreria: ${err.message}`)
    }
  }

  // Esegui funding: trasferisci da tesoreria a wallet utente
  const executeFunding = async (walletId: string) => {
    if (!treasuryWallet || !treasuryWallet.connected) {
      setError('Wallet di tesoreria non collegato')
      return
    }

    const userWallet = wallets.find(w => w.id === walletId)
    if (!userWallet) {
      setError('Wallet utente non trovato')
      return
    }

    const reconciliation = reconciliations.find(r => r.walletId === walletId)
    if (!reconciliation) {
      setError('Nessuna riconciliazione trovata per questo wallet')
      return
    }

    // Calcola quanto funding serve
    const fundingNeeded = reconciliation.balanceAccounting - reconciliation.balanceOnChain
    
    if (fundingNeeded <= 0) {
      setError('Non serve funding: il saldo on-chain è già sufficiente')
      return
    }

    // Verifica che la tesoreria abbia fondi sufficienti
    if (treasuryWallet.balance < fundingNeeded) {
      setError(`Fondi insufficienti nella tesoreria. Serve: ${fundingNeeded.toFixed(6)} ${userWallet.currency}, disponibile: ${treasuryWallet.balance.toFixed(6)} ${userWallet.currency}`)
      return
    }

    setIsFunding(true)
    setError(null)

    try {
      // Converti amount in Wei
      const amountWei = BigInt(fundingNeeded * 1e18).toString(16)
      
      // Crea transazione
      const transactionParameters = {
        from: treasuryWallet.address,
        to: userWallet.address,
        value: `0x${amountWei}`,
        gas: '0x5208', // 21000 gas
      }

      // Invia transazione a MetaMask per firma
      const txHash = await window.ethereum!.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      })

      // Salva funding transaction
      const fundingTx: FundingTransaction = {
        id: Date.now().toString(),
        fromTreasury: treasuryWallet.address,
        toUserWallet: userWallet.address,
        amount: fundingNeeded,
        txHash,
        status: 'pending',
        timestamp: new Date().toISOString()
      }

      setFundingTransactions([fundingTx, ...fundingTransactions])

      // Salva in localStorage
      const savedTxs = JSON.parse(localStorage.getItem('funding_transactions') || '[]')
      localStorage.setItem('funding_transactions', JSON.stringify([fundingTx, ...savedTxs]))

      alert(`✅ Funding avviato!\n\nDa: Tesoreria (${treasuryWallet.address.substring(0, 10)}...)\nA: Wallet utente (${userWallet.address.substring(0, 10)}...)\nImporto: ${fundingNeeded.toFixed(6)} ${userWallet.currency}\nTxHash: ${txHash}\n\nAttendi la conferma sulla blockchain.`)

      // Monitora conferma
      monitorFundingTransaction(txHash, walletId, fundingNeeded)

      // Aggiorna balance tesoreria dopo 5 secondi
      setTimeout(async () => {
        if (treasuryWallet) {
          const newBalance = await getEvmBalance(treasuryWallet.address, treasuryWallet.blockchain)
          setTreasuryWallet({ ...treasuryWallet, balance: newBalance })
          localStorage.setItem('treasury_wallet', JSON.stringify({ ...treasuryWallet, balance: newBalance }))
        }
      }, 5000)

    } catch (err: any) {
      if (err.code === 4001) {
        setError('Transazione rifiutata dall\'utente')
      } else {
        setError(`Errore funding: ${err.message}`)
      }
    } finally {
      setIsFunding(false)
    }
  }

  // Monitora conferma transazione di funding
  const monitorFundingTransaction = async (txHash: string, walletId: string, amount: number) => {
    try {
      const checkConfirmation = async () => {
        const receipt = await window.ethereum!.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })

        if (receipt) {
          // Aggiorna stato funding transaction
          setFundingTransactions(txs => txs.map(tx => 
            tx.txHash === txHash 
              ? { 
                  ...tx, 
                  status: receipt.status === '0x1' ? 'confirmed' as const : 'failed' as const,
                  blockNumber: parseInt(receipt.blockNumber, 16)
                }
              : tx
          ))

          if (receipt.status === '0x1') {
            // Aggiorna saldo on-chain del wallet utente
            const wallet = wallets.find(w => w.id === walletId)
            if (wallet) {
              const newBalanceOnChain = (wallet.balanceOnChain || 0) + amount
              setWallets(wallets.map(w => 
                w.id === walletId 
                  ? { ...w, balanceOnChain: newBalanceOnChain, lastSync: new Date().toISOString() }
                  : w
              ))

              // Aggiorna riconciliazione
              setReconciliations(recs => recs.map(r => 
                r.walletId === walletId 
                  ? { 
                      ...r, 
                      balanceOnChain: newBalanceOnChain,
                      difference: r.balanceAccounting - newBalanceOnChain,
                      status: Math.abs(r.balanceAccounting - newBalanceOnChain) < 0.0001 ? 'reconciled' as const : 'discrepancy' as const,
                      lastCheck: new Date().toISOString()
                    }
                  : r
              ))

              alert(`✅ Funding confermato!\n\nBlocco: #${parseInt(receipt.blockNumber, 16)}\nSaldo on-chain aggiornato: ${newBalanceOnChain.toFixed(6)}`)
            }
          } else {
            alert(`❌ Funding fallito!`)
          }
          
          return true
        }
        
        return false
      }

      // Controlla ogni 5 secondi per max 2 minuti
      for (let i = 0; i < 24; i++) {
        const confirmed = await checkConfirmation()
        if (confirmed) break
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

    } catch (err) {
      console.error('Errore monitoraggio funding:', err)
    }
  }

  // ==================== FUNZIONI PRINCIPALI ====================

  const verifyWalletOnChain = async (walletId: string) => {
    setVerifyingWallet(walletId)
    setError(null)
    
    const wallet = wallets.find(w => w.id === walletId)
    if (!wallet) {
      setError('Wallet non trovato')
      setVerifyingWallet(null)
      return
    }

    try {
      let balance = 0
      let transactions: OnChainTransaction[] = []

      if (wallet.blockchain === 'bitcoin') {
        // Bitcoin: usa API REST
        balance = await getBtcBalance(wallet.address)
        transactions = await getBtcTransactions(wallet.address)
      } else {
        // EVM chains: usa JSON-RPC
        balance = await getEvmBalance(wallet.address, wallet.blockchain)
        // Per transazioni EVM, servirebbe un indexer
        // Per ora usiamo balance reale
      }

      // Aggiorna wallet con dati reali
      setWallets(wallets.map(w => 
        w.id === walletId 
          ? { 
              ...w, 
              balanceOnChain: balance,
              verified: true,
              lastSync: new Date().toISOString(),
              transactions,
              pendingTransactions: transactions.filter(t => t.status === 'pending').length
            }
          : w
      ))

      // Crea risultato riconciliazione
      const pendingIncoming = transactions
        .filter(t => t.type === 'incoming' && t.status === 'pending')
        .reduce((sum, t) => sum + t.value, 0)
      
      const pendingOutgoing = transactions
        .filter(t => t.type === 'outgoing' && t.status === 'pending')
        .reduce((sum, t) => sum + t.value, 0)
      
      const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0)
      
      const reconciliation: ReconciliationResult = {
        walletId,
        balanceAccounting: wallet.balanceAccounting,
        balanceOnChain: balance,
        pendingIncoming,
        pendingOutgoing,
        totalFees,
        difference: wallet.balanceAccounting - balance,
        status: Math.abs(wallet.balanceAccounting - balance) < 0.0001 ? 'reconciled' : 'discrepancy',
        lastCheck: new Date().toISOString(),
        transactionsMatched: transactions.filter(t => t.status === 'confirmed').length,
        transactionsUnmatched: transactions.filter(t => t.status !== 'confirmed').length
      }

      setReconciliations(prev => {
        const filtered = prev.filter(r => r.walletId !== walletId)
        return [...filtered, reconciliation]
      })

    } catch (err: any) {
      console.error('Errore verifica on-chain:', err)
      setError(`Errore verifica: ${err.message}`)
    } finally {
      setVerifyingWallet(null)
    }
  }

  const reconcileWallet = async (walletId: string) => {
    setReconcilingWallet(walletId)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setReconciliations(prev => prev.map(r => 
      r.walletId === walletId 
        ? { 
            ...r, 
            status: 'reconciled' as const,
            difference: 0,
            lastCheck: new Date().toISOString()
          }
        : r
    ))
    
    setReconcilingWallet(null)
  }

  const addWallet = (address: string, blockchain: BlockchainType, balanceAccounting: number) => {
    const info = BLOCKCHAIN_INFO[blockchain]
    const newWallet: WalletOnChain = {
      id: Date.now().toString(),
      address,
      blockchain,
      balanceAccounting,
      balanceOnChain: null,
      balanceFiat: null,
      currency: info.symbol,
      pendingTransactions: 0,
      lastSync: new Date().toISOString(),
      verified: false,
      transactions: []
    }
    setWallets([...wallets, newWallet])
    setShowAddWallet(false)
  }

  const removeWallet = (id: string) => {
    if (!confirm('Rimuovere questo wallet?')) return
    setWallets(wallets.filter(w => w.id !== id))
    setReconciliations(reconciliations.filter(r => r.walletId !== id))
  }

  const totalBalanceOnChain = wallets.reduce((sum, w) => sum + (w.balanceOnChain || 0), 0)
  const totalBalanceAccounting = wallets.reduce((sum, w) => sum + w.balanceAccounting, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🔗 Riconciliazione On-Chain Reale</h2>
        <p className="text-slate-300 mb-4">
          Verifica saldi direttamente dalla blockchain tramite RPC pubblici gratuiti
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Wallet</p>
            <p className="text-xl font-bold">{wallets.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Saldo On-Chain</p>
            <p className="text-xl font-bold text-emerald-400">
              {totalBalanceOnChain.toFixed(6)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Saldo Contabile</p>
            <p className="text-xl font-bold text-cyan-400">
              {totalBalanceAccounting.toFixed(6)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Verificati</p>
            <p className="text-xl font-bold text-purple-400">
              {wallets.filter(w => w.verified).length}/{wallets.length}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300">❌ {error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700/50">
        {[
          { id: 'wallets' as const, label: '💼 Wallet' },
          { id: 'transactions' as const, label: '📜 Transazioni' },
          { id: 'reconciliation' as const, label: '🔄 Riconciliazione' },
          { id: 'treasury' as const, label: '🏦 Tesoreria' },
          { id: 'funding' as const, label: '💸 Funding' }
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

      {/* Wallets */}
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

          {wallets.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-slate-400 mb-4">Nessun wallet aggiunto</p>
              <button
                onClick={() => setShowAddWallet(true)}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
              >
                Aggiungi il tuo primo wallet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map(wallet => {
                const info = BLOCKCHAIN_INFO[wallet.blockchain]
                const reconciliation = reconciliations.find(r => r.walletId === wallet.id)
                
                return (
                  <div key={wallet.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h4 className="font-semibold">{info.name}</h4>
                          <p className="text-xs text-slate-400 font-mono">
                            {wallet.address.substring(0, 12)}...{wallet.address.substring(wallet.address.length - 8)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        wallet.verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {wallet.verified ? '✓ Verificato' : '⏳ Da verificare'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Saldo Contabile:</span>
                        <span className="font-semibold text-cyan-400">
                          {wallet.balanceAccounting.toFixed(6)} {wallet.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Saldo On-Chain:</span>
                        <span className={`font-semibold ${
                          wallet.balanceOnChain !== null ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {wallet.balanceOnChain !== null 
                            ? `${wallet.balanceOnChain.toFixed(6)} ${wallet.currency}`
                            : 'Non verificato'}
                        </span>
                      </div>
                      {wallet.balanceOnChain !== null && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-400">Differenza:</span>
                          <span className={`font-semibold ${
                            Math.abs(wallet.balanceAccounting - wallet.balanceOnChain) < 0.0001
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}>
                            {(wallet.balanceAccounting - wallet.balanceOnChain).toFixed(6)} {wallet.currency}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">TX Pendenti:</span>
                        <span className={wallet.pendingTransactions > 0 ? 'text-yellow-400' : 'text-slate-300'}>
                          {wallet.pendingTransactions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-400">Transazioni:</span>
                        <span className="text-slate-300">{wallet.transactions.length}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyWalletOnChain(wallet.id)}
                        disabled={verifyingWallet === wallet.id}
                        className="flex-1 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-xs text-purple-300 transition-all disabled:opacity-50"
                      >
                        {verifyingWallet === wallet.id ? '⏳ Verifica...' : '🔍 Verifica On-Chain'}
                      </button>
                      <a
                        href={`${BLOCK_EXPLORERS[wallet.blockchain]}/address/${wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-xs text-slate-300 transition-all"
                        title="Apri su Block Explorer"
                      >
                        🔗
                      </a>
                      <button
                        onClick={() => removeWallet(wallet.id)}
                        className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-xs text-red-300 transition-all"
                      >
                        🗑️
                      </button>
                    </div>

                    {wallet.lastSync && (
                      <p className="text-xs text-slate-500 mt-2">
                        Ultimo sync: {new Date(wallet.lastSync).toLocaleString('it-IT')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Transactions */}
      {activeSection === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Transazioni On-Chain</h3>
            <select
              value={selectedWallet || ''}
              onChange={(e) => setSelectedWallet(e.target.value || null)}
              className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white text-sm"
            >
              <option value="">Tutti i wallet</option>
              {wallets.map(w => (
                <option key={w.id} value={w.id}>
                  {BLOCKCHAIN_INFO[w.blockchain].name}: {w.address.substring(0, 10)}...
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const allTxs = selectedWallet
              ? wallets.find(w => w.id === selectedWallet)?.transactions || []
              : wallets.flatMap(w => w.transactions)
            
            if (allTxs.length === 0) {
              return (
                <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                  <p className="text-slate-400">Nessuna transazione trovata</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Le transazioni vengono caricate durante la verifica on-chain
                  </p>
                </div>
              )
            }

            return (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50">
                      <tr className="text-left text-sm text-slate-400">
                        <th className="px-5 py-3">Hash</th>
                        <th className="px-5 py-3">Tipo</th>
                        <th className="px-5 py-3">Da → A</th>
                        <th className="px-5 py-3">Valore</th>
                        <th className="px-5 py-3">Fee</th>
                        <th className="px-5 py-3">Conferme</th>
                        <th className="px-5 py-3">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTxs.map((tx, i) => (
                        <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                          <td className="px-5 py-4 font-mono text-xs text-slate-300">
                            {tx.hash.substring(0, 12)}...
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              tx.type === 'incoming' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {tx.type === 'incoming' ? '↓ In' : '↑ Out'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-xs font-mono">
                              <div className="text-slate-400">{tx.from.substring(0, 8)}...</div>
                              <div className="text-slate-500">↓</div>
                              <div className="text-slate-400">{tx.to.substring(0, 8)}...</div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={tx.type === 'incoming' ? 'text-emerald-400' : 'text-red-400'}>
                              {tx.type === 'incoming' ? '+' : '-'}{tx.value.toFixed(6)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-400">
                            {tx.fee.toFixed(6)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-sm ${
                              tx.confirmations >= 12 ? 'text-emerald-400' :
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
            )
          })()}
        </div>
      )}

      {/* Reconciliation */}
      {activeSection === 'reconciliation' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Riconciliazione Contabile ↔ On-Chain</h3>
          
          {reconciliations.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-slate-400">Nessuna riconciliazione eseguita</p>
              <p className="text-xs text-slate-500 mt-2">
                Verifica prima i wallet per generare dati di riconciliazione
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reconciliations.map(rec => {
                const wallet = wallets.find(w => w.id === rec.walletId)
                if (!wallet) return null
                const info = BLOCKCHAIN_INFO[wallet.blockchain]

                return (
                  <div key={rec.walletId} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <h4 className="font-semibold">{info.name} Wallet</h4>
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
                        <p className="text-lg font-bold text-cyan-400">
                          {rec.balanceAccounting.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Saldo On-Chain</p>
                        <p className="text-lg font-bold text-emerald-400">
                          {rec.balanceOnChain.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Fee Totali</p>
                        <p className="text-lg font-bold text-slate-300">
                          {rec.totalFees.toFixed(6)}
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

                    <div className="grid grid-cols-3 gap-4 text-sm mb-4 p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <span className="text-slate-400">TX Pendenti In:</span>
                        <span className="ml-2 text-yellow-400">{rec.pendingIncoming.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">TX Pendenti Out:</span>
                        <span className="ml-2 text-yellow-400">{rec.pendingOutgoing.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">TX Matchate:</span>
                        <span className="ml-2 text-emerald-400">{rec.transactionsMatched}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        Ultimo check: {new Date(rec.lastCheck).toLocaleString('it-IT')}
                      </p>
                      {rec.status !== 'reconciled' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => reconcileWallet(rec.walletId)}
                            disabled={reconcilingWallet === rec.walletId}
                            className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all disabled:opacity-50"
                          >
                            {reconcilingWallet === rec.walletId ? '⏳...' : '🔄 Riconcilia (Allinea Contabile)'}
                          </button>
                          {treasuryWallet && treasuryWallet.connected && rec.difference > 0 && (
                            <button
                              onClick={() => executeFunding(rec.walletId)}
                              disabled={isFunding}
                              className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-sm text-blue-300 transition-all disabled:opacity-50"
                            >
                              {isFunding ? '⏳...' : `💸 Funding (${rec.difference.toFixed(4)} ${wallet.currency})`}
                            </button>
                          )}
                        </div>
                      )}
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
          <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">🏦 Wallet di Tesoreria</h3>
            <p className="text-slate-300 text-sm mb-4">
              Collega il wallet di tesoreria aziendale per eseguire operazioni di funding/clearing
            </p>

            {!treasuryWallet || !treasuryWallet.connected ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏦</div>
                <p className="text-slate-400 mb-4">Nessun wallet di tesoreria collegato</p>
                <button
                  onClick={() => connectTreasuryWallet('ethereum')}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  🔗 Collega Tesoreria (MetaMask)
                </button>
                <p className="text-xs text-slate-500 mt-4">
                  Questo wallet deve contenere i fondi reali per eseguire il funding
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Wallet Tesoreria Collegato</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      {treasuryWallet.address}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                    ✓ Connesso
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
                      {treasuryWallet.balance.toFixed(6)} {BLOCKCHAIN_INFO[treasuryWallet.blockchain].symbol}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-300">
                    💡 <strong>Funding/Clearing:</strong> Quando un wallet utente ha un saldo contabile superiore al saldo on-chain, 
                    il sistema può trasferire fondi da questa tesoreria per allineare i saldi.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    const newBalance = await getEvmBalance(treasuryWallet.address, treasuryWallet.blockchain)
                    setTreasuryWallet({ ...treasuryWallet, balance: newBalance })
                    localStorage.setItem('treasury_wallet', JSON.stringify({ ...treasuryWallet, balance: newBalance }))
                    alert('✅ Balance tesoreria aggiornato')
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 transition-all"
                >
                  🔄 Aggiorna Balance
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h4 className="font-semibold mb-3">📋 Come Funziona il Funding</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold">Collega wallet di tesoreria</p>
                  <p className="text-xs text-slate-400">Il wallet deve contenere fondi reali</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold">Verifica wallet utente</p>
                  <p className="text-xs text-slate-400">Il sistema rileva discrepanza tra contabile e on-chain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold">Esegui funding</p>
                  <p className="text-xs text-slate-400">Trasferimento automatico da tesoreria a wallet utente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold text-emerald-300">Saldo on-chain allineato</p>
                  <p className="text-xs text-slate-400">Il wallet utente ora ha il saldo corretto sulla blockchain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funding Section */}
      {activeSection === 'funding' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">💸 Storico Funding/Clearing</h3>

          {fundingTransactions.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <div className="text-6xl mb-4">💸</div>
              <p className="text-slate-400 mb-2">Nessuna operazione di funding eseguita</p>
              <p className="text-xs text-slate-500">
                Le operazioni di funding appariranno qui dopo l'esecuzione
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fundingTransactions.map((tx, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">Funding da Tesoreria</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        {tx.txHash.substring(0, 20)}...
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      tx.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {tx.status === 'confirmed' ? '✓ Confermato' :
                       tx.status === 'pending' ? '⏳ In attesa' : '✗ Fallito'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Da (Tesoreria)</p>
                      <p className="text-sm font-mono text-slate-300">
                        {tx.fromTreasury.substring(0, 15)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">A (Wallet Utente)</p>
                      <p className="text-sm font-mono text-slate-300">
                        {tx.toUserWallet.substring(0, 15)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg mb-3">
                    <span className="text-sm text-slate-400">Importo Trasferito:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {tx.amount.toFixed(6)} ETH
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <p>Data: {new Date(tx.timestamp).toLocaleString('it-IT')}</p>
                    {tx.blockNumber && <p>Blocco: #{tx.blockNumber}</p>}
                  </div>
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
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address) {
      setError('Inserisci un indirizzo')
      return
    }
    
    // Validazione base indirizzo
    if (blockchain === 'bitcoin') {
      if (!address.startsWith('1') && !address.startsWith('3') && !address.startsWith('bc1')) {
        setError('Indirizzo Bitcoin non valido')
        return
      }
    } else {
      if (!address.startsWith('0x') || address.length !== 42) {
        setError('Indirizzo EVM non valido (deve iniziare con 0x e avere 42 caratteri)')
        return
      }
    }
    
    onAdd(address, blockchain, balance)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">🔗 Aggiungi Wallet On-Chain</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Blockchain</label>
            <select
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value as BlockchainType)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
            >
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="polygon">Polygon (MATIC)</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
              <option value="base">Base</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Indirizzo Pubblico Wallet
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setError('') }}
              placeholder={blockchain === 'bitcoin' ? 'bc1q...' : '0x...'}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              ⚠️ Inserisci SOLO l'indirizzo pubblico. Mai la chiave privata!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Saldo Contabile ({BLOCKCHAIN_INFO[blockchain].symbol})
            </label>
            <input
              type="number"
              step="0.000001"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              placeholder="0.000000"
            />
            <p className="text-xs text-slate-500 mt-1">
              Il saldo che dichiari (verrà confrontato con quello reale on-chain)
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-300">❌ {error}</p>
            </div>
          )}

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-purple-300">
              🔍 <strong>Cosa succede dopo:</strong> Il sistema interrogherà la blockchain reale 
              tramite RPC pubblici gratuiti per verificare il saldo effettivo e scaricare le transazioni.
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

export default OnChainReconciliationReal
