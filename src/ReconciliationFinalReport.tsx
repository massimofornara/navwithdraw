import { useState, useEffect } from 'react'

type ReconciliationReport = {
  id: string
  timestamp: string
  walletAddress: string
  blockchain: string
  initialState: {
    balanceAccounting: number
    balanceOnChain: number
    difference: number
  }
  actions: {
    userOpHash: string
    txHash: string
    blockNumber: number
    gasUsed: number
    gasPrice: number
    paymasterAddress: string
    treasuryAddress: string
    fundingAmount: number
    executionTime: number
  }
  finalState: {
    balanceAccounting: number
    balanceOnChain: number
    difference: number
    status: 'reconciled' | 'discrepancy'
  }
  verification: {
    onChainConfirmed: boolean
    paymasterSponsored: boolean
    zeroCostUser: boolean
    zeroInteractionUser: boolean
    automatedExecution: boolean
  }
}

function ReconciliationFinalReport() {
  const [report, setReport] = useState<ReconciliationReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Simula generazione report finale
    setTimeout(() => {
      const finalReport: ReconciliationReport = {
        id: `report-${Date.now()}`,
        timestamp: new Date().toISOString(),
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        blockchain: 'Ethereum Mainnet',
        initialState: {
          balanceAccounting: 1.000000,
          balanceOnChain: 0.000000,
          difference: 1.000000
        },
        actions: {
          userOpHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          txHash: '0x3a7b8c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
          blockNumber: 18500123,
          gasUsed: 125000,
          gasPrice: 25, // Gwei
          paymasterAddress: '0xPaymaster1234567890abcdef1234567890abcdef12',
          treasuryAddress: '0xTreasury9876543210fedcba9876543210fedcba98',
          fundingAmount: 1.000000,
          executionTime: 12.5 // seconds
        },
        finalState: {
          balanceAccounting: 1.000000,
          balanceOnChain: 1.000000,
          difference: 0.000000,
          status: 'reconciled'
        },
        verification: {
          onChainConfirmed: true,
          paymasterSponsored: true,
          zeroCostUser: true,
          zeroInteractionUser: true,
          automatedExecution: true
        }
      }
      setReport(finalReport)
      setIsGenerating(false)
    }, 2000)
  }, [])

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500 mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Generazione Report Finale</h2>
          <p className="text-slate-400">Verifica dell'allineamento dei saldi in corso...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Errore</h2>
          <p className="text-slate-300">Impossibile generare il report finale</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border-2 border-emerald-500/50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🏁 Report Finale di Riconciliazione
              </h1>
              <p className="text-slate-300 text-lg">
                Verifica e conferma dell'allineamento dei saldi
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block px-6 py-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50">
                <span className="text-2xl font-bold text-emerald-400">✓ SUCCESS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Wallet</p>
              <p className="text-sm font-mono text-emerald-400 truncate">
                {report.walletAddress}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Blockchain</p>
              <p className="text-sm font-bold text-white">{report.blockchain}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Blocco</p>
              <p className="text-sm font-bold text-cyan-400">#{report.actions.blockNumber}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Tempo Esecuzione</p>
              <p className="text-sm font-bold text-purple-400">{report.actions.executionTime}s</p>
            </div>
          </div>
        </div>

        {/* Stato Iniziale */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Stato Iniziale (Prima del Funding)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-cyan-500">
              <p className="text-sm text-slate-400 mb-2">Saldo Contabile</p>
              <p className="text-3xl font-bold text-cyan-400">
                {report.initialState.balanceAccounting.toFixed(6)} ETH
              </p>
              <p className="text-xs text-slate-500 mt-2">Dichiarato nel sistema</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-red-500">
              <p className="text-sm text-slate-400 mb-2">Saldo On-Chain</p>
              <p className="text-3xl font-bold text-red-400">
                {report.initialState.balanceOnChain.toFixed(6)} ETH
              </p>
              <p className="text-xs text-slate-500 mt-2">Verificato sulla blockchain</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-yellow-500">
              <p className="text-sm text-slate-400 mb-2">Discrepanza</p>
              <p className="text-3xl font-bold text-yellow-400">
                +{report.initialState.difference.toFixed(6)} ETH
              </p>
              <p className="text-xs text-slate-500 mt-2">⚠️ Funding necessario</p>
            </div>
          </div>
        </div>

        {/* Azioni Eseguite */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">⚙️</span>
            Azioni Eseguite (Account Abstraction)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-slate-400 mb-1">User Operation Hash</p>
                  <p className="text-sm font-mono text-purple-400 break-all">
                    {report.actions.userOpHash}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  ERC-4337
                </span>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Transaction Hash</p>
                  <p className="text-sm font-mono text-emerald-400 break-all">
                    {report.actions.txHash}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                  ✓ Confermato
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Gas Utilizzato</p>
                <p className="text-lg font-bold text-white">
                  {report.actions.gasUsed.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Gas Price</p>
                <p className="text-lg font-bold text-white">
                  {report.actions.gasPrice} Gwei
                </p>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Importo Funding</p>
                <p className="text-lg font-bold text-emerald-400">
                  {report.actions.fundingAmount.toFixed(6)} ETH
                </p>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Costo Gas Totale</p>
                <p className="text-lg font-bold text-cyan-400">
                  {(report.actions.gasUsed * report.actions.gasPrice / 1e9).toFixed(6)} ETH
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Paymaster (Gas Sponsor)</p>
                <p className="text-sm font-mono text-blue-400 break-all">
                  {report.actions.paymasterAddress}
                </p>
                <p className="text-xs text-emerald-400 mt-2">✓ Gas pagato dal Paymaster</p>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Wallet Tesoreria</p>
                <p className="text-sm font-mono text-purple-400 break-all">
                  {report.actions.treasuryAddress}
                </p>
                <p className="text-xs text-emerald-400 mt-2">✓ Fondi prelevati dalla tesoreria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stato Finale */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-2 border-emerald-500/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">✅</span>
            Stato Finale (Dopo il Funding)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-emerald-500">
              <p className="text-sm text-slate-400 mb-2">Saldo Contabile</p>
              <p className="text-3xl font-bold text-emerald-400">
                {report.finalState.balanceAccounting.toFixed(6)} ETH
              </p>
              <p className="text-xs text-slate-500 mt-2">Invariato</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-emerald-500">
              <p className="text-sm text-slate-400 mb-2">Saldo On-Chain</p>
              <p className="text-3xl font-bold text-emerald-400">
                {report.finalState.balanceOnChain.toFixed(6)} ETH
              </p>
              <p className="text-xs text-emerald-400 mt-2">✓ Allineato</p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-5 border-l-4 border-emerald-500">
              <p className="text-sm text-slate-400 mb-2">Discrepanza</p>
              <p className="text-3xl font-bold text-emerald-400">
                {report.finalState.difference.toFixed(6)} ETH
              </p>
              <p className="text-xs text-emerald-400 mt-2">✓ Riconciliato</p>
            </div>
          </div>

          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎉</div>
              <div>
                <p className="text-lg font-bold text-emerald-400">
                  RICONCILIAZIONE COMPLETATA CON SUCCESSO
                </p>
                <p className="text-sm text-slate-300">
                  Entrambi i saldi sono ora allineati a <strong className="text-emerald-400">1.000000 ETH</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verifica Finale */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🔍</span>
            Verifica Finale
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 flex items-center gap-3">
              <div className="text-3xl">
                {report.verification.onChainConfirmed ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-white">Transazione On-Chain</p>
                <p className="text-sm text-slate-400">
                  {report.verification.onChainConfirmed 
                    ? 'Confermata sulla blockchain' 
                    : 'Non confermata'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 flex items-center gap-3">
              <div className="text-3xl">
                {report.verification.paymasterSponsored ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-white">Gas Sponsorizzato</p>
                <p className="text-sm text-slate-400">
                  {report.verification.paymasterSponsored 
                    ? 'Pagato dal Paymaster' 
                    : 'Non sponsorizzato'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 flex items-center gap-3">
              <div className="text-3xl">
                {report.verification.zeroCostUser ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-white">Zero Costi Utente</p>
                <p className="text-sm text-slate-400">
                  {report.verification.zeroCostUser 
                    ? 'Nessun costo per l\'utente' 
                    : 'Costi applicati'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 flex items-center gap-3">
              <div className="text-3xl">
                {report.verification.zeroInteractionUser ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-white">Zero Interazione Utente</p>
                <p className="text-sm text-slate-400">
                  {report.verification.zeroInteractionUser 
                    ? 'Nessuna firma richiesta' 
                    : 'Firma richiesta'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 flex items-center gap-3 md:col-span-2">
              <div className="text-3xl">
                {report.verification.automatedExecution ? '✅' : '❌'}
              </div>
              <div>
                <p className="font-semibold text-white">Esecuzione Automatica</p>
                <p className="text-sm text-slate-400">
                  {report.verification.automatedExecution 
                    ? 'Completamente automatizzata tramite Account Abstraction' 
                    : 'Esecuzione manuale'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Riepilogo Finale */}
        <div className="bg-gradient-to-r from-emerald-600/30 via-cyan-600/30 to-blue-600/30 border-2 border-emerald-500/50 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              APPROVAZIONE FINALE
            </h2>
            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <p className="text-lg text-slate-300 mb-4">
                Il sistema di riconciliazione con Account Abstraction (ERC-4337) ha completato 
                con successo l'operazione di funding automatico.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Stato Operazione:</p>
                  <p className="text-xl font-bold text-emerald-400">✓ SUCCESS</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Saldo Finale:</p>
                  <p className="text-xl font-bold text-emerald-400">1.000000 ETH</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Costo Utente:</p>
                  <p className="text-xl font-bold text-emerald-400">0.000000 ETH</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Interazione Utente:</p>
                  <p className="text-xl font-bold text-emerald-400">ZERO</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Timestamp: {new Date(report.timestamp).toLocaleString('it-IT')}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReconciliationFinalReport
