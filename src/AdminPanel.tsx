import { useState, useEffect } from 'react'

const AUTHORIZED_IPS_KEY = 'authorized_ips'
const DEFAULT_AUTHORIZED_IPS = ['93.44.201.21']

function AdminPanel() {
  const [currentIP, setCurrentIP] = useState<string | null>(null)
  const [authorizedIPs, setAuthorizedIPs] = useState<string[]>(DEFAULT_AUTHORIZED_IPS)
  const [newIP, setNewIP] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    // Carica IP autorizzati dal localStorage
    const stored = localStorage.getItem(AUTHORIZED_IPS_KEY)
    if (stored) {
      setAuthorizedIPs(JSON.parse(stored))
    }

    // Verifica IP corrente
    checkIP()
  }, [])

  const checkIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      const userIP = data.ip
      
      setCurrentIP(userIP)
      setIsAuthorized(authorizedIPs.includes(userIP))
      
      addLog(`IP rilevato: ${userIP}`)
      addLog(`Autorizzato: ${authorizedIPs.includes(userIP) ? 'SÌ' : 'NO'}`)
      
    } catch (err) {
      addLog(`Errore nel rilevamento IP: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('it-IT')
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)])
  }

  const addIP = () => {
    if (!newIP || !isValidIP(newIP)) {
      alert('Inserisci un indirizzo IP valido')
      return
    }

    if (authorizedIPs.includes(newIP)) {
      alert('Questo IP è già nella whitelist')
      return
    }

    const updatedIPs = [...authorizedIPs, newIP]
    setAuthorizedIPs(updatedIPs)
    localStorage.setItem(AUTHORIZED_IPS_KEY, JSON.stringify(updatedIPs))
    
    addLog(`✅ IP aggiunto: ${newIP}`)
    setNewIP('')
    setShowAddForm(false)
  }

  const removeIP = (ip: string) => {
    if (ip === '93.44.201.21') {
      alert('Non puoi rimuovere l\'IP principale')
      return
    }

    if (!confirm(`Sei sicuro di voler rimuovere ${ip} dalla whitelist?`)) {
      return
    }

    const updatedIPs = authorizedIPs.filter(i => i !== ip)
    setAuthorizedIPs(updatedIPs)
    localStorage.setItem(AUTHORIZED_IPS_KEY, JSON.stringify(updatedIPs))
    
    addLog(`🗑️ IP rimosso: ${ip}`)
  }

  const isValidIP = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipv4Regex.test(ip)) return false
    
    const parts = ip.split('.')
    return parts.every(part => {
      const num = parseInt(part)
      return num >= 0 && num <= 255
    })
  }

  const exportWhitelist = () => {
    const data = {
      authorizedIPs,
      exportDate: new Date().toISOString(),
      exportedBy: currentIP
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whitelist_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    addLog('📤 Whitelist esportata')
  }

  const importWhitelist = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.authorizedIPs && Array.isArray(data.authorizedIPs)) {
          setAuthorizedIPs(data.authorizedIPs)
          localStorage.setItem(AUTHORIZED_IPS_KEY, JSON.stringify(data.authorizedIPs))
          addLog('📥 Whitelist importata')
        } else {
          alert('File non valido')
        }
      } catch (err) {
        alert('Errore nel parsing del file')
      }
    }
    reader.readAsText(file)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-300 text-lg">Caricamento pannello admin...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-8 max-w-2xl backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">Accesso Negato</h2>
            <p className="text-slate-300 text-lg">
              Solo gli amministratori possono accedere a questo pannello
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Il tuo IP:</span>
              <span className="font-mono text-red-400">{currentIP}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              ← Torna alla Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🔐 Pannello Amministratore</h2>
            <p className="text-slate-300">
              Gestisci la whitelist degli IP autorizzati per l'inserimento manuale dei NAV
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Il tuo IP:</div>
            <div className="font-mono text-emerald-400 text-lg">{currentIP}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">IP Autorizzati</p>
          <p className="text-2xl font-bold text-emerald-400">{authorizedIPs.length}</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Stato</p>
          <p className="text-2xl font-bold text-emerald-400">✓ Attivo</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Accessi Loggati</p>
          <p className="text-2xl font-bold">{logs.length}</p>
        </div>
      </div>

      {/* Whitelist Management */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">📋 Whitelist IP Autorizzati</h3>
          <div className="flex gap-2">
            <button
              onClick={exportWhitelist}
              className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
            >
              📤 Esporta
            </button>
            <label className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-slate-300 transition-colors cursor-pointer">
              📥 Importa
              <input
                type="file"
                accept=".json"
                onChange={importWhitelist}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-sm text-emerald-300 transition-all"
            >
              + Aggiungi IP
            </button>
          </div>
        </div>

        {/* Add IP Form */}
        {showAddForm && (
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="es. 192.168.1.1"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-mono"
              />
              <button
                onClick={addIP}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Aggiungi
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Formato: IPv4 (es. 192.168.1.1, 93.44.201.21)
            </p>
          </div>
        )}

        {/* IP List */}
        <div className="space-y-2">
          {authorizedIPs.map((ip, index) => (
            <div
              key={ip}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {index + 1}
                </div>
                <div>
                  <code className="font-mono text-emerald-400">{ip}</code>
                  {ip === '93.44.201.21' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                      Principale
                    </span>
                  )}
                  {ip === currentIP && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                      Tu
                    </span>
                  )}
                </div>
              </div>
              {ip !== '93.44.201.21' && (
                <button
                  onClick={() => removeIP(ip)}
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm transition-colors"
                >
                  🗑️ Rimuovi
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">🔒 Informazioni Sicurezza</h3>
        
        <div className="space-y-3">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="font-semibold text-emerald-400 mb-2">✅ Come Funziona</h4>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>Il sistema verifica l'IP pubblico dell'utente ad ogni accesso</li>
              <li>Solo gli IP nella whitelist possono inserire manualmente i NAV</li>
              <li>Gli altri utenti vedono un messaggio di accesso negato</li>
              <li>La whitelist è salvata nel browser (localStorage)</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <h4 className="font-semibold text-blue-400 mb-2">🌐 IP Principale</h4>
            <p className="text-sm text-slate-300">
              L'IP <code className="font-mono text-emerald-400">93.44.201.21</code> è configurato come 
              amministratore principale e non può essere rimosso.
            </p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Nota Importante</h4>
            <p className="text-sm text-slate-300">
              La whitelist è salvata nel localStorage del browser. Per una sicurezza 
              production-ready, considera di implementare un backend con autenticazione 
              server-side e database persistente.
            </p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">📜 Log Accessi</h3>
        
        <div className="bg-slate-950 rounded-lg p-4 max-h-80 overflow-y-auto border border-slate-700/50">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-sm">Nessun log disponibile</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-xs text-slate-300 font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
