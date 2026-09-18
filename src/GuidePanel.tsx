import { useState } from 'react'

type Step = {
  id: number
  title: string
  description: string
  details: string[]
  code?: string
  tip?: string
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

function GuidePanel() {
  const [activeGuide, setActiveGuide] = useState<'overview' | 'unicredit' | 'crypto' | 'hybrid' | 'export'>('overview')
  const [uniCreditStatus, setUniCreditStatus] = useState<ConnectionStatus>('disconnected')
  const [walletStatus, setWalletStatus] = useState<ConnectionStatus>('disconnected')
  const [walletAddress, setWalletAddress] = useState('')
  const [walletBlockchain, setWalletBlockchain] = useState('ethereum')
  const [step, setStep] = useState(1)

  const stepsUniCredit: Step[] = [
    {
      id: 1,
      title: 'Scarica estratto conto UniCredit',
      description: 'Accedi al tuo home banking UniCredit e scarica l\'estratto conto in formato CSV o PDF.',
      details: [
        '1. Accedi a https://www.unicredit.it/it/privati.html',
        '2. Vai su Conti → Estratto conto',
        '3. Seleziona il periodo desiderato',
        '4. Clicca "Scarica" → Scegli formato CSV',
        '5. Salva il file sul tuo computer'
      ],
      tip: 'UniCredit permette di scaricare estratti conto fino a 24 mesi indietro'
    },
    {
      id: 2,
      title: 'Collega UniCredit al sistema',
      description: 'Importa i dati dell\'estratto conto nel sistema di riconciliazione.',
      details: [
        '1. Vai sulla tab "🌐 Estrattore"',
        '2. Clicca "Fonti Dati"',
        '3. Cerca "UniCredit" nella lista',
        '4. Clicca "Connetti"',
        '5. Inserisci le credenziali (solo per lettura)',
        '6. Autorizza l\'accesso in sola lettura'
      ],
      tip: 'Il sistema usa connessione in SOLA LETTURA - non può effettuare operazioni'
    },
    {
      id: 3,
      title: 'Importa NAV fondi contabili',
      description: 'Inserisci i valori NAV dei tuoi fondi dal registro contabile UniCredit.',
      details: [
        '1. Vai sulla tab "💼 Fondi"',
        '2. Clicca "+ Aggiungi Fondo"',
        '3. Inserisci ISIN del fondo (es. IE00BK5BQT80)',
        '4. Inserisci NAV contabile dal tuo estratto conto',
        '5. Inserisci numero quote possedute',
        '6. Seleziona "UniCredit" come conto di riferimento'
      ],
      tip: 'Il NAV contabile è il valore che UniCredit assegna ai tuoi fondi nell\'estratto conto'
    },
    {
      id: 4,
      title: 'Estrai NAV reale dal mercato',
      description: 'Il sistema estrae automaticamente il NAV reale dai siti finanziari.',
      details: [
        '1. Vai sulla tab "🌐 Estrattore"',
        '2. Seleziona "Morningstar" e "Borsa Italiana"',
        '3. Clicca "📥 Estrai Dati"',
        '4. Il sistema confronta NAV contabile vs NAV reale',
        '5. Le differenze vengono evidenziate automaticamente'
      ],
      code: `// Il sistema fa automaticamente:
const navContabile = 125.43  // Da UniCredit
const navReale = 125.50      // Da Morningstar
const differenza = navReale - navContabile  // +0.07
// Questa differenza viene registrata come aggiustamento`
    },
    {
      id: 5,
      title: 'Riconciliazione Tradizionale',
      description: 'Il sistema riconcilia il NAV contabile con il saldo bancario effettivo.',
      details: [
        '1. Vai sulla tab "🔄 Riconciliazione"',
        '2. Seleziona modalità "Tradizionale"',
        '3. Il sistema calcola automaticamente:',
        '   • Commissioni non ancora registrate',
        '   • Dividendi in sospeso',
        '   • Rettifiche valutarie',
        '   • Tasse applicabili',
        '4. Clicca "Esegui Riconciliazione"',
        '5. Il NAV diventa "Disponibile"'
      ],
      code: `// Formula di conversione:
NAV Disponibile = NAV Contabile
  - Commissioni (es. 0.50%)
  - Tasse (es. 26% su plusvalenze)
  + Dividendi in arrivo
  ± Rettifiche valutarie
  
// Esempio:
NAV Contabile: €125,000.00
- Commissioni: €625.00
- Tasse: €1,300.00
+ Dividendi: €450.00
= NAV Disponibile: €123,525.00`
    }
  ]

  const stepsCrypto: Step[] = [
    {
      id: 1,
      title: 'Prepara il tuo wallet crypto',
      description: 'Identifica l\'indirizzo pubblico del tuo wallet crypto.',
      details: [
        '1. Apri il tuo wallet (Ledger, MetaMask, Trust Wallet, ecc.)',
        '2. Copia l\'indirizzo pubblico',
        '3. NON condividere mai la chiave privata!',
        '4. Nota quale blockchain usi (ETH, BTC, MATIC, ecc.)',
        '5. Verifica il saldo attuale sul tuo wallet'
      ],
      tip: '⚠️ Inserisci SOLO l\'indirizzo pubblico - mai la chiave privata o seed phrase!'
    },
    {
      id: 2,
      title: 'Collega wallet al sistema',
      description: 'Inserisci l\'indirizzo del wallet nel sistema per la verifica on-chain.',
      details: [
        '1. Vai sulla tab "🔗 On-Chain"',
        '2. Clicca "+ Aggiungi Wallet"',
        '3. Seleziona la blockchain (Ethereum, Bitcoin, ecc.)',
        '4. Incolla l\'indirizzo pubblico del wallet',
        '5. Inserisci il saldo contabile (quello che dichiari)',
        '6. Clicca "🔍 Verifica On-Chain"'
      ],
      code: `// Il sistema verifica automaticamente:
const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
const blockchain = "ethereum"

// Chiama Etherscan API
const onChainBalance = await etherscan.getBalance(walletAddress)
// Result: 2.456 ETH

// Converte in EUR
const balanceEUR = onChainBalance * ethPriceEUR
// Result: €8,920.50`
    },
    {
      id: 3,
      title: 'Verifica transazioni on-chain',
      description: 'Il sistema scarica e verifica tutte le transazioni dalla blockchain.',
      details: [
        '1. Il sistema interroga la blockchain (Etherscan, Blockchain.com, ecc.)',
        '2. Scarica tutte le transazioni del wallet',
        '3. Verifica lo stato di ogni transazione:',
        '   ✓ Confermata (12+ conferme)',
        '   ⏳ Pendente (in attesa)',
        '   ✗ Fallita',
        '4. Calcola le fee pagate per ogni transazione',
        '5. Identifica transazioni non ancora registrate'
      ],
      code: `// Transazioni trovate sulla blockchain:
[
  { hash: "0x1234...", value: 1.2, status: "confirmed", fee: 0.002 },
  { hash: "0x5678...", value: 0.5, status: "pending", fee: 0.001 },
  { hash: "0x9abc...", value: 0.8, status: "confirmed", fee: 0.003 }
]

// Totale: 2.5 ETH confermati + 0.5 ETH pendenti
// Fee totali: 0.006 ETH`
    },
    {
      id: 4,
      title: 'Riconciliazione On-Chain',
      description: 'Confronta il saldo contabile con il saldo reale on-chain.',
      details: [
        '1. Vai sulla tab "🔗 On-Chain" → "Riconciliazione"',
        '2. Il sistema confronta:',
        '   • Saldo contabile (dichiarato)',
        '   • Saldo on-chain (verificato blockchain)',
        '   • Transazioni pendenti',
        '   • Fee totali pagate',
        '3. Se c\'è differenza, il sistema la evidenzia',
        '4. Clicca "🔄 Riconcilia" per allineare i valori'
      ],
      code: `// Riconciliazione On-Chain:
Saldo Contabile:  2.500 ETH
Saldo On-Chain:   2.456 ETH
TX Pendenti Out:  0.500 ETH
Fee Totali:       0.006 ETH

// Calcolo:
Differenza = 2.500 - 2.456 = 0.044 ETH
→ C'è una discrepanza di 0.044 ETH
→ Probabilmente una TX non registrata

// Dopo riconciliazione:
NAV Disponibile = 2.456 ETH (saldo reale blockchain)`
    }
  ]

  const stepsHybrid: Step[] = [
    {
      id: 1,
      title: 'Collega entrambe le fonti',
      description: 'Connetti sia UniCredit che il wallet crypto al sistema.',
      details: [
        '1. Collega UniCredit (vedi guida UniCredit step 1-2)',
        '2. Collega wallet crypto (vedi guida Crypto step 1-2)',
        '3. Verifica che entrambi siano "✓ Connessi"',
        '4. Il sistema ora ha accesso a entrambi i saldi'
      ],
      tip: '💡 Puoi avere più wallet crypto e più conti bancari collegati'
    },
    {
      id: 2,
      title: 'Estrai dati da tutte le fonti',
      description: 'Il sistema estrae automaticamente i dati da UniCredit e blockchain.',
      details: [
        '1. Vai sulla tab "🌐 Estrattore"',
        '2. Seleziona sia "UniCredit" che "Etherscan" (o altra blockchain)',
        '3. Clicca "📥 Estrai Dati"',
        '4. Il sistema raccoglie:',
        '   • Saldo conto UniCredit',
        '   • NAV fondi UniCredit',
        '   • Saldo wallet crypto',
        '   • Transazioni on-chain',
        '   • Transazioni bancarie'
      ]
    },
    {
      id: 3,
      title: 'Riconciliazione Ibrida',
      description: 'Il sistema riconcilia tutto: tradizionale + on-chain.',
      details: [
        '1. Vai sulla tab "🔄 Riconciliazione"',
        '2. Seleziona modalità "Ibrida"',
        '3. Il sistema esegue:',
        '   ✓ Riconciliazione bancaria UniCredit',
        '   ✓ Riconciliazione on-chain wallet',
        '   ✓ Conversione crypto → EUR',
        '   ✓ Calcolo patrimonio totale',
        '4. Tutti i NAV diventano "Disponibili"',
        '5. Hai il quadro completo del tuo patrimonio'
      ],
      code: `// Patrimonio Totale = Tradizionale + Crypto

Tradizionale (UniCredit):
  Conto corrente:  €50,000.00
  Fondi (NAV disp): €123,525.00
  Totale trad:     €173,525.00

Crypto (Wallet ETH):
  ETH: 2.456 × €3,640 = €8,939.84
  BTC: 0.123 × €55,000 = €6,765.00
  Totale crypto:    €15,704.84

═══════════════════════════════════
PATRIMONIO TOTALE DISPONIBILE:
€189,229.84
═══════════════════════════════════`
    },
    {
      id: 4,
      title: 'Esporta il report completo',
      description: 'Scarica il report completo con tutti i dati riconciliati.',
      details: [
        '1. Vai sulla tab "📤 Export"',
        '2. Scegli il formato preferito:',
        '   📊 CSV → per Excel/Google Sheets',
        '   📈 Excel → report formattato',
        '   📕 PDF → report professionale',
        '   📄 JSON → per integrazioni',
        '   📋 XML → per sistemi enterprise',
        '   🗄️ SQL → per database',
        '3. Clicca sul formato desiderato',
        '4. Il file viene scaricato automaticamente'
      ],
      tip: '💡 Il PDF è ideale per il commercialista, il JSON per automazioni'
    }
  ]

  const currentSteps = activeGuide === 'unicredit' ? stepsUniCredit :
                       activeGuide === 'crypto' ? stepsCrypto :
                       activeGuide === 'hybrid' ? stepsHybrid : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-orange-600/20 border border-blue-500/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">📖 Guida Pratica</h2>
        <p className="text-slate-300">
          Come convertire i fondi contabili in disponibili collegando UniCredit e wallet crypto
        </p>
      </div>

      {/* Guide Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveGuide('overview')}
          className={`p-4 rounded-xl border transition-all text-left ${
            activeGuide === 'overview'
              ? 'bg-blue-600/20 border-blue-500/50'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-2xl mb-2">📋</div>
          <h4 className="font-semibold text-sm">Panoramica</h4>
          <p className="text-xs text-slate-400 mt-1">Come funziona il processo</p>
        </button>
        <button
          onClick={() => setActiveGuide('unicredit')}
          className={`p-4 rounded-xl border transition-all text-left ${
            activeGuide === 'unicredit'
              ? 'bg-blue-600/20 border-blue-500/50'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-2xl mb-2">🏦</div>
          <h4 className="font-semibold text-sm">UniCredit</h4>
          <p className="text-xs text-slate-400 mt-1">Riconciliazione tradizionale</p>
        </button>
        <button
          onClick={() => setActiveGuide('crypto')}
          className={`p-4 rounded-xl border transition-all text-left ${
            activeGuide === 'crypto'
              ? 'bg-purple-600/20 border-purple-500/50'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-2xl mb-2">🔗</div>
          <h4 className="font-semibold text-sm">Wallet Crypto</h4>
          <p className="text-xs text-slate-400 mt-1">Riconciliazione on-chain</p>
        </button>
        <button
          onClick={() => setActiveGuide('hybrid')}
          className={`p-4 rounded-xl border transition-all text-left ${
            activeGuide === 'hybrid'
              ? 'bg-violet-600/20 border-violet-500/50'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
          }`}
        >
          <div className="text-2xl mb-2">🔄</div>
          <h4 className="font-semibold text-sm">Entrambi</h4>
          <p className="text-xs text-slate-400 mt-1">Riconciliazione ibrida</p>
        </button>
      </div>

      {/* Overview */}
      {activeGuide === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">🎯 Come Funziona la Conversione</h3>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 mb-4">
              <p className="text-center text-lg font-mono">
                <span className="text-blue-400">NAV Contabile</span>
                <span className="text-slate-500"> → </span>
                <span className="text-yellow-400">Riconciliazione</span>
                <span className="text-slate-500"> → </span>
                <span className="text-emerald-400">NAV Disponibile</span>
              </p>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Il <strong className="text-blue-400">NAV Contabile</strong> è il valore che la banca o il broker assegna ai tuoi fondi.
              Il <strong className="text-emerald-400">NAV Disponibile</strong> è il valore reale che potresti ottenere vendendo tutto oggi,
              dopo aver sottratto commissioni, tasse e aggiunto dividendi in arrivo.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">📊 Esempio Completo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">🏦 UniCredit (Tradizionale)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                    <span>Fondo Vanguard FTSE AW</span>
                    <span className="font-mono">€125,000</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-500/10 rounded text-red-300">
                    <span>- Commissioni (0.5%)</span>
                    <span className="font-mono">-€625</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-500/10 rounded text-red-300">
                    <span>- Tasse plusvalenze (26%)</span>
                    <span className="font-mono">-€1,300</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-500/10 rounded text-emerald-300">
                    <span>+ Dividendi in arrivo</span>
                    <span className="font-mono">+€450</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-500/20 rounded font-bold">
                    <span>= NAV Disponibile</span>
                    <span className="font-mono">€123,525</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-3">🔗 Wallet Crypto (On-Chain)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                    <span>2.500 ETH (contabile)</span>
                    <span className="font-mono">€9,100</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                    <span>2.456 ETH (verificato on-chain)</span>
                    <span className="font-mono">€8,940</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-500/10 rounded text-red-300">
                    <span>- Gas fees totali</span>
                    <span className="font-mono">-€22</span>
                  </div>
                  <div className="flex justify-between p-2 bg-yellow-500/10 rounded text-yellow-300">
                    <span>⏳ TX pendente (0.5 ETH)</span>
                    <span className="font-mono">in attesa</span>
                  </div>
                  <div className="flex justify-between p-2 bg-emerald-500/20 rounded font-bold">
                    <span>= NAV Disponibile</span>
                    <span className="font-mono">€8,918</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-center">
                <span className="text-slate-400">Patrimonio Totale Disponibile: </span>
                <span className="text-2xl font-bold text-emerald-400">€132,443</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UniCredit Steps */}
      {activeGuide === 'unicredit' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold text-blue-300">🏦 Guida UniCredit - Riconciliazione Tradizionale</h3>
            <p className="text-sm text-slate-300 mt-1">Segui questi 5 passi per convertire i NAV contabili UniCredit in disponibili</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {stepsUniCredit.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i + 1)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          {currentSteps.filter(s => s.id === step).map(s => (
            <div key={s.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center font-bold text-blue-300">
                  {s.id}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-sm text-slate-400">{s.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {s.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <span className="text-blue-400 text-sm mt-0.5">→</span>
                    <span className="text-sm text-slate-300">{detail}</span>
                  </div>
                ))}
              </div>

              {s.code && (
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-700/50 mb-4">
                  <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">{s.code}</pre>
                </div>
              )}

              {s.tip && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-300">💡 {s.tip}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => setStep(Math.min(stepsUniCredit.length, step + 1))}
                  disabled={step === stepsUniCredit.length}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Avanti →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crypto Steps */}
      {activeGuide === 'crypto' && (
        <div className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold text-purple-300">🔗 Guida Wallet Crypto - Riconciliazione On-Chain</h3>
            <p className="text-sm text-slate-300 mt-1">Segui questi 4 passi per verificare e riconciliare il tuo wallet crypto</p>
          </div>

          {/* Wallet Connection Demo */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-4">
            <h4 className="font-semibold mb-4">🔗 Collega il tuo wallet (demo)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Blockchain</label>
                <select
                  value={walletBlockchain}
                  onChange={(e) => setWalletBlockchain(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white"
                >
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="polygon">Polygon (MATIC)</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="base">Base</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Indirizzo pubblico wallet</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 font-mono text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setWalletStatus('connecting')
                  setTimeout(() => setWalletStatus('connected'), 2000)
                }}
                disabled={!walletAddress || walletStatus === 'connected'}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {walletStatus === 'connecting' ? '⏳ Verifica in corso...' :
                 walletStatus === 'connected' ? '✓ Wallet Connesso' :
                 '🔍 Verifica On-Chain'}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {stepsCrypto.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i + 1)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          {currentSteps.filter(s => s.id === step).map(s => (
            <div key={s.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center font-bold text-purple-300">
                  {s.id}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-sm text-slate-400">{s.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {s.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <span className="text-purple-400 text-sm mt-0.5">→</span>
                    <span className="text-sm text-slate-300">{detail}</span>
                  </div>
                ))}
              </div>

              {s.code && (
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-700/50 mb-4">
                  <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">{s.code}</pre>
                </div>
              )}

              {s.tip && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-300">⚠️ {s.tip}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => setStep(Math.min(stepsCrypto.length, step + 1))}
                  disabled={step === stepsCrypto.length}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Avanti →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hybrid Steps */}
      {activeGuide === 'hybrid' && (
        <div className="space-y-4">
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold text-violet-300">🔄 Guida Completa - UniCredit + Wallet Crypto</h3>
            <p className="text-sm text-slate-300 mt-1">Collega entrambi e ottieni il patrimonio totale disponibile</p>
          </div>

          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={`bg-slate-800/40 border rounded-xl p-4 ${
              uniCreditStatus === 'connected' ? 'border-emerald-500/50' : 'border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">🏦 UniCredit</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  uniCreditStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                  uniCreditStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {uniCreditStatus === 'connected' ? '✓ Connesso' :
                   uniCreditStatus === 'connecting' ? '⏳ In connessione...' : '○ Disconnesso'}
                </span>
              </div>
              <button
                onClick={() => {
                  setUniCreditStatus('connecting')
                  setTimeout(() => setUniCreditStatus('connected'), 2000)
                }}
                disabled={uniCreditStatus === 'connected'}
                className="w-full px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-sm text-blue-300 transition-all disabled:opacity-50"
              >
                {uniCreditStatus === 'connected' ? '✓ Connesso' : '🔌 Connetti UniCredit'}
              </button>
            </div>

            <div className={`bg-slate-800/40 border rounded-xl p-4 ${
              walletStatus === 'connected' ? 'border-emerald-500/50' : 'border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">🔗 Wallet Crypto</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  walletStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-300' :
                  walletStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-slate-500/20 text-slate-300'
                }`}>
                  {walletStatus === 'connected' ? '✓ Connesso' :
                   walletStatus === 'connecting' ? '⏳ In connessione...' : '○ Disconnesso'}
                </span>
              </div>
              <button
                onClick={() => {
                  setWalletStatus('connecting')
                  setTimeout(() => setWalletStatus('connected'), 2000)
                }}
                disabled={walletStatus === 'connected'}
                className="w-full px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-sm text-purple-300 transition-all disabled:opacity-50"
              >
                {walletStatus === 'connected' ? '✓ Connesso' : '🔌 Connetti Wallet'}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {stepsHybrid.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i + 1)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-violet-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Current Step */}
          {currentSteps.filter(s => s.id === step).map(s => (
            <div key={s.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center font-bold text-violet-300">
                  {s.id}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{s.title}</h4>
                  <p className="text-sm text-slate-400">{s.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {s.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <span className="text-violet-400 text-sm mt-0.5">→</span>
                    <span className="text-sm text-slate-300">{detail}</span>
                  </div>
                ))}
              </div>

              {s.code && (
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-700/50 mb-4">
                  <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">{s.code}</pre>
                </div>
              )}

              {s.tip && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-sm text-emerald-300">💡 {s.tip}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                >
                  ← Indietro
                </button>
                <button
                  onClick={() => setStep(Math.min(stepsHybrid.length, step + 1))}
                  disabled={step === stepsHybrid.length}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Avanti →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GuidePanel
