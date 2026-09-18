import { useState, useEffect } from 'react'

type IPGuardProps = {
  children: React.ReactNode
  authorizedIPs?: string[]
  fallback?: React.ReactNode
}

const DEFAULT_AUTHORIZED_IPS = [
  '93.44.201.21' // IP autorizzato principale
]

function IPGuard({ children, authorizedIPs = DEFAULT_AUTHORIZED_IPS, fallback }: IPGuardProps) {
  const [currentIP, setCurrentIP] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkIP = async () => {
      try {
        // Usa un servizio esterno per ottenere l'IP pubblico
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        const userIP = data.ip
        
        setCurrentIP(userIP)
        
        // Verifica se l'IP è nella lista degli autorizzati
        const authorized = authorizedIPs.includes(userIP)
        setIsAuthorized(authorized)
        
        console.log(`🔐 IP rilevato: ${userIP}`)
        console.log(`🔐 Autorizzato: ${authorized ? 'SÌ' : 'NO'}`)
        
      } catch (err) {
        console.error('Errore nel rilevamento IP:', err)
        setError('Impossibile verificare l\'indirizzo IP')
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkIP()
  }, [authorizedIPs])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-300 text-lg">Verifica sicurezza in corso...</p>
          <p className="text-slate-500 text-sm mt-2">Controllo indirizzo IP</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Errore di Sicurezza</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-sm text-slate-500">Impossibile verificare l'indirizzo IP. Riprova più tardi.</p>
        </div>
      </div>
    )
  }

  // Authorized - show content
  if (isAuthorized) {
    return <>{children}</>
  }

  // Unauthorized - show fallback or default message
  if (fallback) {
    return <>{fallback}</>
  }

  // Default unauthorized message
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-8 max-w-2xl backdrop-blur-sm">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-red-400 mb-2">Accesso Negato</h2>
          <p className="text-slate-300 text-lg">
            Solo gli utenti autorizzati possono accedere a questa funzionalità
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-slate-300 mb-3">📋 Dettagli Sicurezza</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Il tuo IP:</span>
              <span className="font-mono text-red-400">{currentIP}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">IP autorizzati:</span>
              <div className="text-right">
                {authorizedIPs.map((ip, i) => (
                  <div key={i} className="font-mono text-emerald-400">{ip}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-slate-400">Stato:</span>
              <span className="font-semibold text-red-400">❌ Non autorizzato</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h4 className="font-semibold text-blue-300 mb-2">ℹ️ Come ottenere l'accesso</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            Questa funzionalità è riservata agli amministratori del sistema. 
            Se ritieni di dover avere accesso, contatta l'amministratore per aggiungere 
            il tuo indirizzo IP alla whitelist.
          </p>
          <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Il tuo indirizzo IP da comunicare:</p>
            <code className="text-sm text-emerald-400 font-mono">{currentIP}</code>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    </div>
  )
}

export default IPGuard
