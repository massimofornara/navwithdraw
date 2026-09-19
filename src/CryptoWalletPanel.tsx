import { useState, useEffect } from 'react'

type WalletConnection = {
  id: string
  type: 'metamask' | 'walletconnect' | 'ledger' | 'trezor'
  address: string
  chainId?: number
  balance?: string
  symbol: string
  status: 'connected' | 'disconnected'
  connectedAt: string
}

type CryptoTransaction = {
  id: string
  type: 'send' | 'receive' | 'swap'
  fromAddress: string
  toAddress: string
  amount: string
  symbol: string
  txHash?: string
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: string
  confirmedAt?: string
  gasUsed?: string
  blockNumber?: number
}

function CryptoWalletPanel() {
  const [wallets, setWallets] = useState<WalletConnection[]>([])
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([])
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Carica dati dal localStorage
  useEffect(() => {
    const savedWallets = localStorage.getItem('crypto_wallets')
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets))
    }

    const savedTxs = localStorage.getItem('crypto_transactions')
    if (savedTxs) {
      setTransactions(JSON.parse(savedTxs))
    }
  }, [])

  // Salva dati
  useEffect(() => {
    localStorage.setItem('crypto_wallets', JSON.stringify(wallets))
  }, [wallets])

  useEffect(() => {
    localStorage.setItem('crypto_transactions', JSON.stringify(transactions))
  }, [transactions])

  // Connessione MetaMask
  const connectMetaMask = async () => {
    setIsConnecting(true)
    
    try {
      // Verifica se MetaMask è installato
      if (typeof window.ethereum === 'undefined') {
        alert('❌ MetaMask non installato!\n\nScarica MetaMask da: https://metamask.io')
        setIsConnecting(false)
        return
      }

      // Richiedi connessione
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length === 0) {
        alert('❌ Connessione rifiutata')
        setIsConnecting(false)
        return
      }

      const address = accounts[0]
      
      // Ottieni chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      })

      // Ottieni balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })

      const balanceETH = (parseInt(balance, 16) / 1e18).toFixed(4)

      // Salva connessione
      const newWallet: WalletConnection = {
        id: `wallet_${Date.now()}`,
        type: 'metamask',
        address,
        chainId: parseInt(chainId, 16),
        balance: balanceETH,
        symbol: 'ETH',
        status: 'connected',
        connectedAt: new Date().toISOString()
      }

      setWallets([...wallets, newWallet])
      setIsConnecting(false)
      setShowConnectModal(false)
      
      alert(`✅ MetaMask connesso!\n\nIndirizzo: ${address}\nBalance: ${balanceETH} ETH`)

    } catch (error: any) {
      console.error('Errore connessione MetaMask:', error)
      alert(`❌ Errore: ${error.message}`)
      setIsConnecting(false)
    }
  }

  // Connessione WalletConnect (simulata)
  const connectWalletConnect = async () => {
    setIsConnecting(true)
    
    // Simula connessione WalletConnect
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockAddress = `0x${Math.random().toString(16).substring(2, 42)}`
    
    const newWallet: WalletConnection = {
      id: `wallet_${Date.now()}`,
      type: 'walletconnect',
      address: mockAddress,
      chainId: 1,
      balance: (Math.random() * 10).toFixed(4),
      symbol: 'ETH',
      status: 'connected',
      connectedAt: new Date().toISOString()
    }

    setWallets([...wallets, newWallet])
    setIsConnecting(false)
    setShowConnectModal(false)
    
    alert(`✅ WalletConnect connesso!\n\nIndirizzo: ${mockAddress}`)
  }

  // Invio crypto
  const sendCrypto = async (walletId: string, toAddress: string, amount: string) => {
    setIsSending(true)
    
    const wallet = wallets.find(w => w.id === walletId)
    if (!wallet) {
      alert('❌ Wallet non trovato')
      setIsSending(false)
      return
    }

    try {
      // Per MetaMask reale
      if (wallet.type === 'metamask' && typeof window.ethereum !== 'undefined') {
        // Converti amount in Wei
        const amountWei = BigInt(parseFloat(amount) * 1e18).toString(16)
        
        // Crea transazione
        const tx = {
          from: wallet.address,
          to: toAddress,
          value: `0x${amountWei}`,
          gas: '0x5208' // 21000 gas
        }

        // Invia transazione (l'utente deve confermare su MetaMask)
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx]
        })

        // Salva transazione
        const newTx: CryptoTransaction = {
          id: `tx_${Date.now()}`,
          type: 'send',
          fromAddress: wallet.address,
          toAddress,
          amount,
          symbol: wallet.symbol,
          txHash,
          status: 'pending',
          createdAt: new Date().toISOString()
        }

        setTransactions([newTx, ...transactions])
        
        // Aggiorna balance wallet
        setWallets(wallets.map(w => 
          w.id === walletId 
            ? { ...w, balance: (parseFloat(w.balance || '0') - parseFloat(amount)).toFixed(4) }
            : w
        ))

        setIsSending(false)
        setShowSendModal(false)
        
        alert(`✅ Transazione inviata!\n\nTxHash: ${txHash}\n\nAttendi la conferma sulla blockchain.`)

        // Monitora conferma (simulata)
        setTimeout(() => {
          setTransactions(txs => txs.map(t => 
            t.txHash === txHash 
              ? { ...t, status: 'confirmed', confirmedAt: new Date().toISOString(), blockNumber: Math.floor(Math.random() * 1000000) + 18000000 }
              : t
          ))
        }, 15000) // Simula conferma dopo 15 secondi

      } else {
        // Per altri wallet (simulazione)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`
        
        const newTx: CryptoTransaction = {
          id: `tx_${Date.now()}`,
          type: 'send',
          fromAddress: wallet.address,
          toAddress,
          amount,
          symbol: wallet.symbol,
          txHash: mockTxHash,
          status: 'pending',
          createdAt: new Date().toISOString()
        }

        setTransactions([newTx, ...transactions])
        
        setWallets(wallets.map(w => 
          w.id === walletId 
            ? { ...w, balance: (parseFloat(w.balance || '0') - parseFloat(amount)).toFixed(4) }
            : w
        ))

        setIsSending(false)
        setShowSendModal(false)
        
        alert(`✅ Transazione inviata!\n\nTxHash: ${mockTxHash}`)

        // Simula conferma
        setTimeout(() => {
          setTransactions(txs => txs.map(t => 
            t.txHash === mockTxHash 
              ? { ...t, status: 'confirmed', confirmedAt: new Date().toISOString(), blockNumber: Math.floor(Math.random() * 1000000) + 18000000 }
              : t
          ))
        }, 15000)
      }

    } catch (error: any) {
      console.error('Errore invio:', error)
      alert(`❌ Errore: ${error.message}`)
      setIsSending(false)
    }
  }

  // Disconnetti wallet
  const disconnectWallet = (walletId: string) => {
    if (!confirm('Sei sicuro di voler disconnettere questo wallet?')) return
    
    setWallets(wallets.filter(w => w.id !== walletId))
  }

  // Calcola totale
  const totalBalance = wallets.reduce((sum, w) => sum + parseFloat(w.balance || '0'), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🔗 Crypto Wallet Connect</h2>
        <p className="text-slate-300 mb-4">
          Connessione sicura a wallet crypto con firma personale dell'utente
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Wallet Collegati</p>
            <p className="text-xl font-bold">{wallets.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Balance Totale</p>
            <p className="text-xl font-bold text-emerald-400">
              {totalBalance.toFixed(4)} ETH
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Transazioni</p>
            <p className="text-xl font-bold">{transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Wallet Types Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔐 Wallet Supportati</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🦊</span>
              <h4 className="font-semibold">MetaMask</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Browser extension</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ Firma personale</li>
              <li>✅ Multi-chain</li>
              <li>✅ DApp browser</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📱</span>
              <h4 className="font-semibold">WalletConnect</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Mobile wallet</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ QR code</li>
              <li>✅ 200+ wallet</li>
              <li>✅ Secure protocol</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔒</span>
              <h4 className="font-semibold">Ledger</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Hardware wallet</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ Cold storage</li>
              <li>✅ Max security</li>
              <li>✅ Physical device</li>
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <h4 className="font-semibold">Trezor</h4>
            </div>
            <p className="text-xs text-slate-400 mb-2">Hardware wallet</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ Cold storage</li>
              <li>✅ Open source</li>
              <li>✅ Multi-coin</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Connected Wallets */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">💼 Wallet Collegati</h3>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-sm text-purple-300 transition-all"
          >
            + Collega Wallet
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Nessun wallet collegato</p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              Collega il tuo primo wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map(wallet => (
              <div key={wallet.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                      {wallet.type === 'metamask' ? '🦊' : 
                       wallet.type === 'walletconnect' ? '📱' : 
                       wallet.type === 'ledger' ? '🔒' : '💎'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg capitalize">{wallet.type}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    wallet.status === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {wallet.status === 'connected' ? '✓ Connesso' : '✗ Disconnesso'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Balance</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {wallet.balance} {wallet.symbol}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Chain ID</p>
                    <p className="text-sm text-slate-300">
                      {wallet.chainId || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedWallet(wallet.id)
                      setShowSendModal(true)
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs text-emerald-300 transition-all"
                  >
                    💸 Invia
                  </button>
                  <button
                    onClick={() => disconnectWallet(wallet.id)}
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

      {/* Transactions History */}
      {transactions.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">📜 Storico Transazioni</h3>
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold capitalize">
                      {tx.type === 'send' ? '💸 Invio' : tx.type === 'receive' ? '💰 Ricevuto' : '🔄 Swap'}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {tx.fromAddress.substring(0, 10)}... → {tx.toAddress.substring(0, 10)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      {tx.amount} {tx.symbol}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      tx.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {tx.status === 'confirmed' ? '✓ Confermato' :
                       tx.status === 'pending' ? '⏳ In attesa' : '✗ Fallito'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  {tx.txHash && (
                    <p className="font-mono truncate">
                      Tx: {tx.txHash.substring(0, 20)}...
                    </p>
                  )}
                  {tx.blockNumber && <p>Block: #{tx.blockNumber}</p>}
                  <p>{new Date(tx.createdAt).toLocaleString('it-IT')}</p>
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
            <h3 className="text-xl font-bold mb-4">🔗 Collega Wallet Crypto</h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="w-full p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 bg-slate-900/50 hover:bg-purple-500/10 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🦊</span>
                  <div>
                    <h4 className="font-semibold">MetaMask</h4>
                    <p className="text-xs text-slate-400">Browser extension - Firma personale</p>
                  </div>
                </div>
              </button>

              <button
                onClick={connectWalletConnect}
                disabled={isConnecting}
                className="w-full p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 bg-slate-900/50 hover:bg-purple-500/10 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h4 className="font-semibold">WalletConnect</h4>
                    <p className="text-xs text-slate-400">Mobile wallet - QR code</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => alert('🔒 Ledger: Richiede Ledger Live e USB connection')}
                className="w-full p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 bg-slate-900/50 hover:bg-purple-500/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <h4 className="font-semibold">Ledger</h4>
                    <p className="text-xs text-slate-400">Hardware wallet - Max security</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => alert('💎 Trezor: Richiede Trezor Suite e USB connection')}
                className="w-full p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/50 bg-slate-900/50 hover:bg-purple-500/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💎</span>
                  <div>
                    <h4 className="font-semibold">Trezor</h4>
                    <p className="text-xs text-slate-400">Hardware wallet - Open source</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-300">
                🔐 <strong>Sicurezza:</strong> Le transazioni crypto richiedono la firma personale sul tuo wallet. 
                Le chiavi private non lasciano mai il tuo dispositivo.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <SendCryptoModal
          wallet={wallets.find(w => w.id === selectedWallet)!}
          onSend={sendCrypto}
          onClose={() => setShowSendModal(false)}
          isLoading={isSending}
        />
      )}
    </div>
  )
}

function SendCryptoModal({ wallet, onSend, onClose, isLoading }: {
  wallet: WalletConnection
  onSend: (walletId: string, toAddress: string, amount: string) => void
  onClose: () => void
  isLoading: boolean
}) {
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!toAddress || !amount || parseFloat(amount) <= 0) {
      alert('Compila tutti i campi correttamente')
      return
    }
    if (parseFloat(amount) > parseFloat(wallet.balance || '0')) {
      alert('Balance insufficiente')
      return
    }
    onSend(wallet.id, toAddress, amount)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">💸 Invia {wallet.symbol}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Da</label>
            <div className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono text-sm">
              {wallet.address.substring(0, 15)}...{wallet.address.substring(wallet.address.length - 10)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Balance: {wallet.balance} {wallet.symbol}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Indirizzo Destinatario</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Importo ({wallet.symbol})</label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
              required
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-xs text-yellow-300">
              🔐 <strong>Firma Personale:</strong> Dopo aver cliccato "Invia", dovrai confermare la transazione 
              sul tuo wallet ({wallet.type}). Le chiavi private non lasciano mai il tuo dispositivo.
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
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? '⏳ Firma in corso...' : '💸 Invia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CryptoWalletPanel
