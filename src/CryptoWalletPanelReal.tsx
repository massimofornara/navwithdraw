import { useState, useEffect } from 'react'

type WalletConnection = {
  address: string
  chainId: number
  balance: string
  symbol: string
  connectedAt: string
}

type Transaction = {
  hash: string
  from: string
  to: string
  value: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  blockNumber?: number
}

function CryptoWalletPanelReal() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Controlla se MetaMask è installato
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // MetaMask è installato
      console.log('✅ MetaMask rilevato')
      
      // Controlla se già connesso
      checkConnection()
      
      // Ascolta cambiamenti di account
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWallet(null)
        } else {
          loadWalletData(accounts[0])
        }
      })
      
      // Ascolta cambiamenti di chain
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    } else {
      setError('MetaMask non installato. Scarica da https://metamask.io')
    }
  }, [])

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum!.request({ 
        method: 'eth_accounts' 
      })
      
      if (accounts.length > 0) {
        await loadWalletData(accounts[0])
      }
    } catch (err) {
      console.error('Errore controllo connessione:', err)
    }
  }

  const loadWalletData = async (address: string) => {
    try {
      // Ottieni chain ID
      const chainId = await window.ethereum!.request({ 
        method: 'eth_chainId' 
      })
      
      // Ottieni balance
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      
      // Converti da Wei a ETH
      const balanceETH = (parseInt(balance, 16) / 1e18).toFixed(4)
      
      setWallet({
        address,
        chainId: parseInt(chainId, 16),
        balance: balanceETH,
        symbol: 'ETH',
        connectedAt: new Date().toISOString()
      })
      
      setError(null)
    } catch (err) {
      console.error('Errore caricamento dati wallet:', err)
      setError('Errore nel caricamento dei dati del wallet')
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask non installato. Scarica da https://metamask.io')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Richiedi connessione a MetaMask
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts.length > 0) {
        await loadWalletData(accounts[0])
        alert('✅ Wallet connesso con successo!')
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Connessione rifiutata dall\'utente')
      } else {
        setError(`Errore di connessione: ${err.message}`)
      }
      console.error('Errore connessione:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setTransactions([])
  }

  const sendTransaction = async (toAddress: string, amount: string) => {
    if (!wallet) {
      setError('Wallet non connesso')
      return
    }

    setIsSending(true)
    setError(null)

    try {
      // Converti ETH in Wei
      const amountWei = BigInt(parseFloat(amount) * 1e18).toString(16)
      
      // Crea transazione
      const transactionParameters = {
        from: wallet.address,
        to: toAddress,
        value: `0x${amountWei}`,
        gas: '0x5208', // 21000 gas per transfer semplice
      }

      // Invia transazione a MetaMask per firma
      const txHash = await window.ethereum!.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      })

      // Salva transazione come pending
      const newTx: Transaction = {
        hash: txHash,
        from: wallet.address,
        to: toAddress,
        value: amount,
        status: 'pending',
        timestamp: new Date().toISOString()
      }

      setTransactions([newTx, ...transactions])
      setShowSendModal(false)

      alert(`✅ Transazione inviata!\n\nTxHash: ${txHash}\n\nAttendi la conferma sulla blockchain.`)

      // Monitora conferma della transazione
      monitorTransaction(txHash)

      // Aggiorna balance dopo 5 secondi
      setTimeout(() => {
        loadWalletData(wallet.address)
      }, 5000)

    } catch (err: any) {
      if (err.code === 4001) {
        setError('Transazione rifiutata dall\'utente')
      } else {
        setError(`Errore transazione: ${err.message}`)
      }
      console.error('Errore invio transazione:', err)
    } finally {
      setIsSending(false)
    }
  }

  const monitorTransaction = async (txHash: string) => {
    try {
      // Polling per verificare conferma transazione
      const checkConfirmation = async () => {
        const receipt = await window.ethereum!.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })

        if (receipt) {
          // Transazione confermata
          setTransactions(txs => txs.map(tx => 
            tx.hash === txHash 
              ? { 
                  ...tx, 
                  status: receipt.status === '0x1' ? 'confirmed' : 'failed',
                  blockNumber: parseInt(receipt.blockNumber, 16)
                }
              : tx
          ))
          
          if (receipt.status === '0x1') {
            alert(`✅ Transazione confermata!\n\nBlocco: #${parseInt(receipt.blockNumber, 16)}`)
          } else {
            alert(`❌ Transazione fallita!`)
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
      console.error('Errore monitoraggio transazione:', err)
    }
  }

  const switchToArbitrum = async () => {
    try {
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }], // Arbitrum One
      })
    } catch (err: any) {
      if (err.code === 4902) {
        // Chain non aggiunta, prova ad aggiungerla
        try {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa4b1',
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io']
            }]
          })
        } catch (addError) {
          console.error('Errore aggiunta chain:', addError)
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 border border-purple-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">🔗 Crypto Wallet - Integrazione MetaMask Reale</h2>
        <p className="text-slate-300 mb-4">
          Connessione diretta a MetaMask con firma personale delle transazioni
        </p>
        
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Indirizzo</p>
              <p className="text-sm font-mono text-emerald-400 truncate">
                {wallet.address}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Balance</p>
              <p className="text-xl font-bold text-emerald-400">
                {wallet.balance} {wallet.symbol}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Network</p>
              <p className="text-sm font-bold">
                Chain ID: {wallet.chainId}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300">❌ {error}</p>
        </div>
      )}

      {/* Connect/Disconnect */}
      {!wallet ? (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">🦊</div>
          <h3 className="text-xl font-bold mb-2">Connetti MetaMask</h3>
          <p className="text-slate-400 mb-6">
            Collega il tuo wallet MetaMask per inviare e ricevere crypto
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {isConnecting ? '⏳ Connessione...' : '🔌 Connetti MetaMask'}
          </button>
          <p className="text-xs text-slate-500 mt-4">
            Non hai MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Scaricalo qui</a>
          </p>
        </div>
      ) : (
        <>
          {/* Wallet Info */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">💼 Wallet Connesso</h3>
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-sm text-red-300 transition-all"
              >
                🔌 Disconnetti
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400">Indirizzo:</span>
                <span className="font-mono text-sm text-emerald-400">{wallet.address}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400">Balance:</span>
                <span className="text-lg font-bold text-emerald-400">{wallet.balance} {wallet.symbol}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400">Network:</span>
                <span className="text-sm">Chain ID {wallet.chainId}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-400">Connesso dal:</span>
                <span className="text-sm">{new Date(wallet.connectedAt).toLocaleString('it-IT')}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowSendModal(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 transition-all"
              >
                💸 Invia Crypto
              </button>
              <button
                onClick={switchToArbitrum}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 transition-all"
              >
                🔀 Passa ad Arbitrum
              </button>
            </div>
          </div>

          {/* Transactions */}
          {transactions.length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">📜 Storico Transazioni</h3>
              <div className="space-y-3">
                {transactions.map((tx, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {tx.status === 'confirmed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'} Transazione
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {tx.hash.substring(0, 20)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-400">
                          {tx.value} {wallet.symbol}
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
                      <p>Da: {tx.from.substring(0, 15)}...</p>
                      <p>A: {tx.to.substring(0, 15)}...</p>
                      {tx.blockNumber && <p>Blocco: #{tx.blockNumber}</p>}
                      <p>{new Date(tx.timestamp).toLocaleString('it-IT')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Send Modal */}
      {showSendModal && wallet && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">💸 Invia {wallet.symbol}</h3>
            
            <SendTransactionForm
              wallet={wallet}
              onSend={sendTransaction}
              onClose={() => setShowSendModal(false)}
              isSending={isSending}
            />
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-blue-300 mb-2">🔐 Sicurezza</h4>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Le chiavi private restano nel tuo wallet MetaMask</li>
          <li>Ogni transazione richiede la tua firma personale</li>
          <li>Nessun fondo viene custodito dal sistema</li>
          <li>Tu mantieni il controllo totale dei tuoi asset</li>
        </ul>
      </div>
    </div>
  )
}

function SendTransactionForm({ wallet, onSend, onClose, isSending }: {
  wallet: WalletConnection
  onSend: (to: string, amount: string) => void
  onClose: () => void
  isSending: boolean
}) {
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!toAddress || !amount || parseFloat(amount) <= 0) {
      alert('Compila tutti i campi correttamente')
      return
    }
    if (parseFloat(amount) > parseFloat(wallet.balance)) {
      alert('Balance insufficiente')
      return
    }
    onSend(toAddress, amount)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Da (il tuo wallet)
        </label>
        <div className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white font-mono text-sm">
          {wallet.address}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Balance disponibile: {wallet.balance} {wallet.symbol}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Indirizzo Destinatario
        </label>
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
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Importo ({wallet.symbol})
        </label>
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
          🔐 <strong>Importante:</strong> MetaMask si aprirà per farti confermare e firmare la transazione. 
          Verifica attentamente i dettagli prima di firmare.
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
          disabled={isSending}
          className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          {isSending ? '⏳ Firma in corso...' : '💸 Invia'}
        </button>
      </div>
    </form>
  )
}

export default CryptoWalletPanelReal
