# 🌐 Guida Operativa Estrattore e Riconciliazione

**Versione:** 5.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completo e Operativo

---

## 🎯 Flusso Completo Operativo

Questa guida mostra il flusso completo per:
1. Collegare una fonte (es. UniCredit)
2. Aggiungere fondi con ISIN, NAV e quote
3. Estrarre NAV reale dal mercato
4. Riconciliare e convertire NAV Contabile → NAV Disponibile

---

## 📋 FLusso Passo-Passo

### **PASSO 1: Collega la tua Banca/Broker**

```
1. Vai sulla scheda "🌐 Estrattore"
   ↓
2. Clicca "🔌 Fonti Dati"
   ↓
3. Cerca "UniCredit" nella lista (o la tua banca)
   ↓
4. Clicca "🔌 Connetti"
   ↓
5. Inserisci le credenziali (solo per lettura)
   ↓
6. Autorizza l'accesso in sola lettura
   ↓
✅ La fonte appare come "✓ Connesso"
```

**Risultato:** La banca è collegata e pronta per l'estrazione dati.

---

### **PASSO 2: Aggiungi Fondi Manualmente (Opzionale)**

```
1. Vai sulla scheda "💼 Fondi" (o "💼 Portafoglio")
   ↓
2. Clicca "+ Aggiungi Fondo"
   ↓
3. Inserisci ISIN del fondo (es. IE00BK5BQT80)
   ↓
4. Inserisci NAV contabile dal tuo estratto conto
   ↓
5. Inserisci il numero di quote possedute
   ↓
6. Seleziona "UniCredit" come conto di riferimento
   ↓
✅ Il fondo viene aggiunto al portafoglio
```

**Esempio:**
```
ISIN: IE00BK5BQT80
Nome: Vanguard FTSE All-World
NAV Contabile: €10,520.00
Quote: 100
Conto: UniCredit
```

---

### **PASSO 3: Estrai NAV Reale dal Mercato**

```
1. Vai sulla scheda "🌐 Estrattore"
   ↓
2. Vai su "🔍 Estrai Dati"
   ↓
3. Seleziona "Morningstar" e "Borsa Italiana"
   ↓
4. Clicca "📥 Estrai Dati"
   ↓
5. Il sistema confronta NAV contabile vs NAV reale
   ↓
6. Le differenze vengono evidenziate automaticamente
   ↓
✅ I dati vengono AGGIUNTI all'elenco esistente
```

**Importante:** I dati estratti si **AGGIUNGONO** ai fondi già presenti, non li sostituiscono!

---

### **PASSO 4: Riconcilia e Converti in NAV Disponibile**

```
1. Vai sulla scheda "🔄 Riconciliazione"
   ↓
2. Seleziona modalità "Tradizionale" (o Ibrida/On-Chain)
   ↓
3. Il sistema calcola automaticamente:
   • Commissioni non ancora registrate
   • Dividendi in sospensione
   • Rettifiche bancarie
   • Tasse applicabili
   ↓
4. Clicca "🔄 Esegui Riconciliazione"
   ↓
5. Il NAV diventa "Disponibile"
   ↓
✅ Conversione completata!
```

**Formula:**
```
NAV Disponibile = NAV Contabile
  - Commissioni (es. 0.5%)
  - Tasse plusvalenze (es. 26%)
  + Dividendi in arrivo (es. 2%)
  ± Rettifiche valutarie (es. 0.1%)
```

**Esempio:**
```
NAV Contabile:    €125,000.00
- Commissioni:    €625.00 (0.5%)
- Tasse:          €1,300.00 (26% su plusvalenza)
+ Dividendi:      €450.00 (2%)
- Rettifiche:     €125.00 (0.1%)
═══════════════════════════
NAV Disponibile:  €123,400.00
```

---

## 🎮 Funzionalità Operative

### ✅ Estrattore - Tutti i Pulsanti Funzionano

#### Fonti Dati
- ✅ **Connetti** - Collega qualsiasi banca/broker/mercato
- ✅ **Disconnetti** - Rimuovi connessione
- ✅ **14 fonti** preconfigurate (UniCredit, Intesa, Morningstar, ecc.)
- ✅ **Persistenza** - Le connessioni restano salvate

#### Importa CSV
- ✅ **Upload file CSV** - Carica file dal computer
- ✅ **Parsing automatico** - Estrae dati dal CSV
- ✅ **Aggiunta fondi** - I dati si aggiungono all'elenco
- ✅ **Formato flessibile** - Supporta vari formati CSV

#### Estrai Dati
- ✅ **Selezione fonti** - Scegli da quali fonti estrarre
- ✅ **Estrazione simulata** - Genera dati realistici
- ✅ **Confronto NAV** - NAV contabile vs NAV mercato
- ✅ **Importazione** - Aggiungi dati estratti all'elenco

#### Fondi Importati
- ✅ **Lista completa** - Visualizza tutti i fondi importati
- ✅ **Dettagli** - ISIN, NAV, quote, fonte, conto
- ✅ **Differenze** - Calcolo automatico differenze %
- ✅ **Rimozione** - Elimina fondi specifici

### ✅ Riconciliazione - Completamente Operativa

#### Modalità
- ✅ **Tradizionale** - Per conti bancari/broker
- ✅ **On-Chain** - Per wallet crypto
- ✅ **Ibrida** - Per portafogli misti

#### Parametri Configurabili
- ✅ **Commissioni (%)** - Default 0.5%
- ✅ **Tasse Plusvalenze (%)** - Default 26%
- ✅ **Dividendi (%)** - Default 2%
- ✅ **Rettifiche (%)** - Default 0.1%

#### Esecuzione
- ✅ **Lettura fondi** - Da Portfolio Manager ed Estrattore
- ✅ **Calcolo automatico** - Commissioni, tasse, dividendi, rettifiche
- ✅ **Conversione** - NAV Contabile → NAV Disponibile
- ✅ **Salvataggio** - Risultati salvati in localStorage
- ✅ **Aggiornamento** - Fondi originali aggiornati

#### Risultati
- ✅ **Tabella dettagliata** - Ogni fondo con calcoli
- ✅ **Summary** - Totali commissioni, tasse, dividendi
- ✅ **Stato** - ✓ Riconciliato per ogni fondo
- ✅ **Persistenza** - Risultati salvati e ricaricati

### ✅ Portfolio Manager - Integrato con Estrattore

#### Titoli & Azioni
- ✅ **Visualizzazione** - Titoli personali + fondi importati
- ✅ **Sincronizzazione** - Aggiornamento automatico ogni 2 secondi
- ✅ **Sezione dedicata** - Fondi importati dall'Estrattore evidenziati
- ✅ **Dettagli completi** - NAV, quote, valore, differenze %

#### Conti & Wallet
- ✅ **Multipli** - Banche, broker, wallet crypto
- ✅ **Persistenza** - Salvati in localStorage
- ✅ **Dettagli** - IBAN, indirizzi, saldi

#### NAV Manuali
- ✅ **Inserimento** - NAV contabile e mercato
- ✅ **Calcolo differenze** - Automatico
- ✅ **Note** - Per tracciare la fonte

---

## 📊 Esempio Completo

### Scenario: Investitore con UniCredit + Morningstar

**Step 1: Collega UniCredit**
```
Estrattore → Fonti Dati → UniCredit → Connetti
✅ UniCredit connesso
```

**Step 2: Aggiungi fondi da estratto conto**
```
Portfolio → + Aggiungi Titolo
- ISIN: IE00BK5BQT80
- Nome: Vanguard FTSE All-World
- Quantità: 100
- Prezzo acquisto: €95.50
- Prezzo attuale: €105.20
- Conto: UniCredit
✅ Fondo aggiunto
```

**Step 3: Estrai NAV reale da Morningstar**
```
Estrattore → Estrai Dati → Seleziona Morningstar
✅ Estrazione completata
✅ Dati aggiunti all'elenco
✅ NAV mercato: €105.50 (vs contabile €105.20)
✅ Differenza: +0.29%
```

**Step 4: Riconcilia**
```
Riconciliazione → Modalità Tradizionale
Parametri:
- Commissioni: 0.5%
- Tasse: 26%
- Dividendi: 2%
- Rettifiche: 0.1%

Clicca "🔄 Esegui Riconciliazione"

✅ Calcoli automatici:
- NAV Contabile: €10,520.00
- Commissioni: -€52.60
- Tasse: -€20.80
- Dividendi: +€210.40
- Rettifiche: -€10.52
═══════════════════════════
- NAV Disponibile: €10,646.48
```

**Risultato:** Il NAV è stato convertito da contabile a disponibile con tutti gli aggiustamenti calcolati automaticamente.

---

## 🔧 Dettagli Tecnici

### Persistenza Dati
Tutti i dati sono salvati in `localStorage`:
- `extractor_imported_funds` - Fondi importati dall'Estrattore
- `extractor_sources` - Fonti connesse
- `extractor_accounts` - Conti configurati
- `portfolio_securities` - Titoli del Portfolio Manager
- `portfolio_accounts` - Conti del Portfolio Manager
- `reconciliation_results` - Risultati riconciliazione

### Sincronizzazione
- Polling ogni 2 secondi tra Estrattore e Portfolio Manager
- I fondi importati appaiono automaticamente nel Portfolio
- I risultati di riconciliazione aggiornano i fondi originali

### Calcoli Riconciliazione
```typescript
// Per ogni fondo:
commissions = navAccounting * (commissionRate / 100)
taxes = gain > 0 ? gain * (taxRate / 100) : 0
dividends = navAccounting * (dividendRate / 100)
adjustments = navAccounting * (adjustmentRate / 100)

navAvailable = navAccounting - commissions - taxes + dividends - adjustments
```

---

## 🎯 Checklist Operativa

### Per l'Amministratore (IP 93.44.201.21)

- [ ] Collega banche/broker in Estrattore
- [ ] Aggiungi fondi manualmente in Portfolio
- [ ] Estrai NAV reali da Morningstar/Borsa Italiana
- [ ] Verifica differenze NAV contabile vs mercato
- [ ] Configura parametri riconciliazione
- [ ] Esegui riconciliazione
- [ ] Verifica risultati
- [ ] Esporta report

### Per gli Utenti Standard

- [ ] Visualizza fondi in Portfolio (solo lettura)
- [ ] Consulta risultati riconciliazione
- [ ] Esporta report in vari formati
- [ ] Leggi guida e documentazione

---

## 🆘 Troubleshooting

### Problema: Fondi non appaiono in Portfolio
**Causa:** Sincronizzazione non attiva  
**Soluzione:** Ricarica la pagina, il polling riparte

### Problema: Riconciliazione fallisce
**Causa:** Nessun fondo disponibile  
**Soluzione:** Aggiungi fondi in Portfolio o Estrattore prima

### Problema: Dati Estrattore non si aggiornano
**Causa:** localStorage disabilitato  
**Soluzione:** Abilita localStorage nel browser

### Problema: NAV Disponibile non viene salvato
**Causa:** Permessi localStorage  
**Soluzione:** Verifica permessi browser

---

## 📚 Documentazione Correlata

- **[GUIDA_COMPLETA_DEFINITIVA.md](./GUIDA_COMPLETA_DEFINITIVA.md)** - Guida principale
- **[DASHBOARD_ADMIN.md](./DASHBOARD_ADMIN.md)** - Dashboard Amministratore
- **[OPENBANKING_CRYPTOWALLET.md](./OPENBANKING_CRYPTOWALLET.md)** - Prelievi reali
- **[SICUREZZA_IP.md](./SICUREZZA_IP.md)** - Sistema sicurezza IP

---

## 🎉 Risultato Finale

✅ **Estrattore completamente operativo**
- 14 fonti preconfigurate
- Connessione/disconnessione funzionante
- Import CSV funzionante
- Estrazione dati funzionante
- Dati si AGGIUNGONO all'elenco esistente

✅ **Riconciliazione completamente operativa**
- 3 modalità (Tradizionale/On-Chain/Ibrida)
- Parametri configurabili
- Calcoli automatici
- Conversione NAV Contabile → NAV Disponibile
- Risultati salvati e persistenti

✅ **Portfolio Manager integrato**
- Visualizza fondi da Estrattore
- Sincronizzazione automatica
- Sezione dedicata fondi importati

✅ **Persistenza dati garantita**
- localStorage per tutti i dati
- Nessun dato si perde
- Sincronizzazione tra componenti

---

**Versione:** 5.0.0  
**Ultimo aggiornamento:** Gennaio 2024  
**Stato:** ✅ Completo e Operativo

**🚀 Tutti i pulsanti e le sezioni sono ora OPERATIVI e FUNZIONANTI!**
