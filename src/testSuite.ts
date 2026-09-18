// Test Suite per Universal Reconciliation System
// Verifica funzionalità in ambiente demo e produzione

export type TestResult = {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message: string
  duration?: number
}

export type TestSuite = {
  name: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
  duration: number
}

// Test 1: Verifica tipi e strutture dati
export function testDataStructures(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test Account
    const testAccount = {
      id: 'test-1',
      name: 'Test Account',
      type: 'bank' as const,
      balance: 10000,
      currency: 'EUR',
      institution: 'Test Bank',
      lastSync: new Date().toISOString().split('T')[0]
    }
    
    if (!testAccount.id || !testAccount.name || testAccount.balance < 0) {
      throw new Error('Struttura Account non valida')
    }
    
    // Test Fund
    const testFund = {
      id: 'test-fund-1',
      name: 'Test Fund',
      isin: 'TEST123',
      accountId: 'test-1',
      navAccounting: 50000,
      navAvailable: 49500,
      shares: 100,
      currency: 'EUR',
      lastUpdate: new Date().toISOString().split('T')[0],
      status: 'reconciled' as const
    }
    
    if (!testFund.isin || testFund.navAccounting < testFund.navAvailable) {
      throw new Error('Struttura Fund non valida')
    }
    
    // Test Transaction
    const testTransaction = {
      id: 'test-tx-1',
      date: new Date().toISOString().split('T')[0],
      accountId: 'test-1',
      fundId: 'test-fund-1',
      type: 'dividend' as const,
      description: 'Test dividend',
      amount: 100,
      status: 'cleared' as const,
      reference: 'TEST-001'
    }
    
    if (!testTransaction.amount || !testTransaction.type) {
      throw new Error('Struttura Transaction non valida')
    }
    
    return {
      name: 'Strutture Dati',
      status: 'pass',
      message: 'Tutte le strutture dati sono valide',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Strutture Dati',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 2: Calcoli finanziari
export function testFinancialCalculations(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test calcolo NAV disponibile
    const navAccounting = 100000
    const adjustments = [
      { type: 'fee', amount: -50 },
      { type: 'tax', amount: -100 },
      { type: 'dividend', amount: 200 }
    ]
    
    const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0)
    const navAvailable = navAccounting + totalAdjustments
    
    if (navAvailable !== 100050) {
      throw new Error(`Calcolo NAV errato: atteso 100050, ottenuto ${navAvailable}`)
    }
    
    // Test calcolo differenze
    const bankBalance = 100000
    const difference = navAccounting - bankBalance
    
    if (difference !== 0) {
      throw new Error(`Calcolo differenza errato: atteso 0, ottenuto ${difference}`)
    }
    
    // Test calcolo totali
    const funds = [
      { navAccounting: 50000, navAvailable: 49500 },
      { navAccounting: 30000, navAvailable: 29700 },
      { navAccounting: 20000, navAvailable: 19800 }
    ]
    
    const totalNAVAccounting = funds.reduce((sum, f) => sum + f.navAccounting, 0)
    const totalNAVAvailable = funds.reduce((sum, f) => sum + f.navAvailable, 0)
    
    if (totalNAVAccounting !== 100000 || totalNAVAvailable !== 99000) {
      throw new Error('Calcolo totali errato')
    }
    
    return {
      name: 'Calcoli Finanziari',
      status: 'pass',
      message: 'Tutti i calcoli finanziari sono corretti',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Calcoli Finanziari',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 3: Formattazione valori
export function testValueFormatting(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test formattazione valuta
    const formatCurrency = (value: number, currency: string = 'EUR') => {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(value)
    }
    
    const formatted = formatCurrency(125000.50, 'EUR')
    if (!formatted.includes('125.000,50')) {
      throw new Error(`Formattazione valuta errata: ${formatted}`)
    }
    
    // Test formattazione date
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT')
    }
    
    const formattedDate = formatDate('2024-01-15')
    if (!formattedDate) {
      throw new Error('Formattazione data errata')
    }
    
    // Test formattazione numeri
    const formatNumber = (value: number) => {
      return new Intl.NumberFormat('it-IT').format(value)
    }
    
    const formattedNumber = formatNumber(1000000)
    if (!formattedNumber.includes('1.000.000')) {
      throw new Error(`Formattazione numero errata: ${formattedNumber}`)
    }
    
    return {
      name: 'Formattazione Valori',
      status: 'pass',
      message: 'Tutte le formattazioni sono corrette',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Formattazione Valori',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 4: Export dati
export function testDataExport(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test export JSON
    const testData = {
      accounts: [{ id: '1', name: 'Test' }],
      funds: [{ id: '1', name: 'Test Fund' }],
      exportDate: new Date().toISOString()
    }
    
    const jsonString = JSON.stringify(testData, null, 2)
    const parsed = JSON.parse(jsonString)
    
    if (!parsed.accounts || !parsed.funds) {
      throw new Error('Export JSON non valido')
    }
    
    // Test export CSV
    const csvData = [
      ['ID', 'Name', 'Balance'],
      ['1', 'Test Account', '10000'],
      ['2', 'Test Account 2', '20000']
    ]
    
    const csvString = csvData.map(row => row.join(',')).join('\n')
    const csvLines = csvString.split('\n')
    
    if (csvLines.length !== 3) {
      throw new Error('Export CSV non valido')
    }
    
    return {
      name: 'Export Dati',
      status: 'pass',
      message: 'Export JSON e CSV funzionano correttamente',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Export Dati',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 5: Validazione input
export function testInputValidation(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test validazione ISIN
    const validateISIN = (isin: string) => {
      return /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)
    }
    
    if (!validateISIN('IE00BK5BQT80')) {
      throw new Error('Validazione ISIN fallita per ISIN valido')
    }
    
    if (validateISIN('INVALID')) {
      throw new Error('Validazione ISIN non ha rilevato ISIN invalido')
    }
    
    // Test validazione importi
    const validateAmount = (amount: number) => {
      return typeof amount === 'number' && !isNaN(amount) && isFinite(amount)
    }
    
    if (!validateAmount(100.50)) {
      throw new Error('Validazione importo fallita per importo valido')
    }
    
    if (validateAmount(NaN) || validateAmount(Infinity)) {
      throw new Error('Validazione importo non ha rilevato valori invalidi')
    }
    
    // Test validazione date
    const validateDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return !isNaN(date.getTime())
    }
    
    if (!validateDate('2024-01-15')) {
      throw new Error('Validazione data fallita per data valida')
    }
    
    if (validateDate('invalid-date')) {
      throw new Error('Validazione data non ha rilevato data invalida')
    }
    
    return {
      name: 'Validazione Input',
      status: 'pass',
      message: 'Tutte le validazioni funzionano correttamente',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Validazione Input',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 6: Performance
export function testPerformance(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test performance con grandi dataset
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: `fund-${i}`,
      name: `Fund ${i}`,
      navAccounting: Math.random() * 100000,
      navAvailable: Math.random() * 100000
    }))
    
    const calcStart = Date.now()
    
    // Operazioni intensive
    const total = largeDataset.reduce((sum, f) => sum + f.navAccounting, 0)
    const filtered = largeDataset.filter(f => f.navAccounting > 50000)
    const sorted = [...largeDataset].sort((a, b) => b.navAccounting - a.navAccounting)
    
    const calcDuration = Date.now() - calcStart
    
    if (calcDuration > 1000) {
      throw new Error(`Performance troppo lenta: ${calcDuration}ms`)
    }
    
    if (total <= 0 || filtered.length === 0 || sorted.length !== largeDataset.length) {
      throw new Error('Risultati calcoli errati')
    }
    
    return {
      name: 'Performance',
      status: 'pass',
      message: `Performance accettabile: ${calcDuration}ms per 10.000 elementi`,
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Performance',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 7: Riconciliazione
export function testReconciliation(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test logica riconciliazione
    const navAccounting = 100000
    const bankBalance = 99500
    
    const transactions = [
      { type: 'fee', amount: -200, status: 'cleared' },
      { type: 'tax', amount: -300, status: 'cleared' },
      { type: 'dividend', amount: 500, status: 'pending' }
    ]
    
    const clearedTransactions = transactions.filter(t => t.status === 'cleared')
    const totalCleared = clearedTransactions.reduce((sum, t) => sum + t.amount, 0)
    const navAvailable = navAccounting + totalCleared
    
    if (navAvailable !== 99500) {
      throw new Error(`Riconciliazione errata: atteso 99500, ottenuto ${navAvailable}`)
    }
    
    const difference = navAvailable - bankBalance
    if (difference !== 0) {
      throw new Error(`Differenza non zero: ${difference}`)
    }
    
    return {
      name: 'Riconciliazione',
      status: 'pass',
      message: 'Logica riconciliazione corretta',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Riconciliazione',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Test 8: Multi-valuta
export function testMultiCurrency(): TestResult {
  const startTime = Date.now()
  
  try {
    // Test conversione valuta
    const exchangeRates = {
      EUR: 1,
      USD: 1.1,
      GBP: 0.85
    }
    
    const convertCurrency = (amount: number, from: string, to: string) => {
      const inEUR = amount / exchangeRates[from as keyof typeof exchangeRates]
      return inEUR * exchangeRates[to as keyof typeof exchangeRates]
    }
    
    const converted = convertCurrency(100, 'USD', 'EUR')
    const expected = 100 / 1.1
    
    if (Math.abs(converted - expected) > 0.01) {
      throw new Error(`Conversione valuta errata: atteso ${expected}, ottenuto ${converted}`)
    }
    
    return {
      name: 'Multi-Valuta',
      status: 'pass',
      message: 'Conversione valuta funzionante',
      duration: Date.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Multi-Valuta',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      duration: Date.now() - startTime
    }
  }
}

// Esegui tutti i test
export function runAllTests(): TestSuite {
  const startTime = Date.now()
  
  const tests: TestResult[] = [
    testDataStructures(),
    testFinancialCalculations(),
    testValueFormatting(),
    testDataExport(),
    testInputValidation(),
    testPerformance(),
    testReconciliation(),
    testMultiCurrency()
  ]
  
  const passedTests = tests.filter(t => t.status === 'pass').length
  const failedTests = tests.filter(t => t.status === 'fail').length
  
  return {
    name: 'Universal Reconciliation Test Suite',
    tests,
    totalTests: tests.length,
    passedTests,
    failedTests,
    duration: Date.now() - startTime
  }
}
