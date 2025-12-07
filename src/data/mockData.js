// Mock Data - Vectra Storage Manager

export const initialClients = [
  { id: '1', name: 'IMPULSE FITNESS BRASIL', cnpj: '12.345.678/0001-90', email: 'contato@impulse.com.br', phone: '(11) 99999-1111' },
  { id: '2', name: 'TECH IMPORTS LTDA', cnpj: '98.765.432/0001-10', email: 'compras@techimports.com.br', phone: '(11) 99999-2222' },
  { id: '3', name: 'GLOBAL TRADE CO', cnpj: '11.222.333/0001-44', email: 'logistica@globaltrade.com.br', phone: '(11) 99999-3333' },
]

export const initialContainers = [
  {
    id: '1',
    code: 'CMAU3754293',
    status: 'active',
    clientId: '1',
    clientName: 'IMPULSE FITNESS BRASIL',
    type: "Dry Box 40' HC",
    bl: '06BRZ2411035',
    occupation: 78.5,
    totalVolume: 76.3,
    usedVolume: 59.9,
    totalWeight: 18500,
    since: new Date('2024-10-15'),
    monthlyPrice: 3200,
    items: [
      { id: '1', sku: 'IT9528', description: 'CROSSFIT RACK FULL CAGE', quantity: 2, currentQuantity: 2, unitWeight: 285, totalWeight: 570, length: 220, width: 180, height: 250, unitVolume: 9.9, totalVolume: 19.8, ncm: '9506.91.00', origin: 'CHINA', brand: 'IMPULSE', location: 'A1-01' },
      { id: '2', sku: 'IF2011', description: 'MULTI-FUNCTIONAL TRAINER', quantity: 3, currentQuantity: 3, unitWeight: 320, totalWeight: 960, length: 180, width: 120, height: 220, unitVolume: 4.75, totalVolume: 14.25, ncm: '9506.91.00', origin: 'CHINA', brand: 'IMPULSE', location: 'A1-02' },
      { id: '3', sku: 'IT7022', description: 'LEG PRESS 45 GRAUS', quantity: 4, currentQuantity: 4, unitWeight: 210, totalWeight: 840, length: 200, width: 130, height: 150, unitVolume: 3.9, totalVolume: 15.6, ncm: '9506.91.00', origin: 'CHINA', brand: 'IMPULSE', location: 'A2-01' },
    ]
  },
  {
    id: '2',
    code: 'TEMU8834521',
    status: 'partial',
    clientId: '2',
    clientName: 'TECH IMPORTS LTDA',
    type: "Dry Box 40' HC",
    bl: '07BRZ2411098',
    occupation: 45.2,
    totalVolume: 76.3,
    usedVolume: 34.5,
    totalWeight: 12000,
    since: new Date('2024-11-01'),
    monthlyPrice: 2800,
    items: [
      { id: '4', sku: 'ELEC001', description: 'MONITOR LED 27"', quantity: 50, currentQuantity: 30, unitWeight: 5.5, totalWeight: 275, length: 65, width: 45, height: 15, unitVolume: 0.044, totalVolume: 2.2, ncm: '8528.52.20', origin: 'CHINA', brand: 'GENERIC', location: 'B1-01' },
      { id: '5', sku: 'ELEC002', description: 'TECLADO MECANICO RGB', quantity: 200, currentQuantity: 150, unitWeight: 1.2, totalWeight: 240, length: 45, width: 15, height: 5, unitVolume: 0.0034, totalVolume: 0.68, ncm: '8471.60.52', origin: 'CHINA', brand: 'GENERIC', location: 'B1-02' },
    ]
  },
  {
    id: '3',
    code: 'MSKU9912345',
    status: 'active',
    clientId: '3',
    clientName: 'GLOBAL TRADE CO',
    type: "Dry Box 20'",
    bl: '08BRZ2411155',
    occupation: 92.1,
    totalVolume: 33.2,
    usedVolume: 30.6,
    totalWeight: 8500,
    since: new Date('2024-09-20'),
    monthlyPrice: 1800,
    items: []
  },
]

export const initialEvents = [
  { id: '1', type: 'entry', containerId: '1', containerCode: 'CMAU3754293', date: new Date('2024-10-15'), items: [{ sku: 'IT9528', quantity: 2 }], notes: 'Entrada inicial', createdBy: 'Admin' },
  { id: '2', type: 'entry', containerId: '1', containerCode: 'CMAU3754293', date: new Date('2024-10-16'), items: [{ sku: 'IF2011', quantity: 3 }], notes: '', createdBy: 'Admin' },
  { id: '3', type: 'exit', containerId: '2', containerCode: 'TEMU8834521', date: new Date('2024-11-20'), items: [{ sku: 'ELEC001', quantity: 20 }], notes: 'Saida para cliente SP', createdBy: 'Operador' },
  { id: '4', type: 'measurement', containerId: '1', containerCode: 'CMAU3754293', date: new Date('2024-11-25'), items: [], notes: 'Medicao mensal', createdBy: 'Admin' },
]

export const initialMeasurements = [
  { id: '1', containerId: '1', containerCode: 'CMAU3754293', sku: 'IT9528', date: new Date('2024-11-25'), length: 220, width: 180, height: 250, weight: 285, measuredBy: 'Admin', notes: '' },
  { id: '2', containerId: '1', containerCode: 'CMAU3754293', sku: 'IF2011', date: new Date('2024-11-25'), length: 180, width: 120, height: 220, weight: 320, measuredBy: 'Admin', notes: '' },
]

export const initialInvoices = [
  { id: 'FAT-2024-001', clientId: '1', clientName: 'IMPULSE FITNESS BRASIL', period: 'Out/2024', dueDate: new Date('2024-11-10'), status: 'paid', storageAmount: 2800, handlingAmount: 350, additionalAmount: 50, totalAmount: 3200, containers: ['CMAU3754293'], paidDate: new Date('2024-11-08') },
  { id: 'FAT-2024-002', clientId: '2', clientName: 'TECH IMPORTS LTDA', period: 'Out/2024', dueDate: new Date('2024-11-10'), status: 'paid', storageAmount: 2500, handlingAmount: 200, additionalAmount: 100, totalAmount: 2800, containers: ['TEMU8834521'], paidDate: new Date('2024-11-09') },
  { id: 'FAT-2024-003', clientId: '1', clientName: 'IMPULSE FITNESS BRASIL', period: 'Nov/2024', dueDate: new Date('2024-12-10'), status: 'pending', storageAmount: 2800, handlingAmount: 350, additionalAmount: 50, totalAmount: 3200, containers: ['CMAU3754293'] },
  { id: 'FAT-2024-004', clientId: '3', clientName: 'GLOBAL TRADE CO', period: 'Nov/2024', dueDate: new Date('2024-12-05'), status: 'overdue', storageAmount: 1600, handlingAmount: 150, additionalAmount: 50, totalAmount: 1800, containers: ['MSKU9912345'] },
]

export const initialAuditLogs = [
  { id: '1', timestamp: new Date('2024-11-25 14:30'), action: 'Criou container', entityType: 'container', entityId: '1', entityName: 'CMAU3754293', user: 'Admin', details: {} },
  { id: '2', timestamp: new Date('2024-11-25 14:35'), action: 'Upload packing list', entityType: 'container', entityId: '1', entityName: 'CMAU3754293', user: 'Admin', details: { items: 3 } },
  { id: '3', timestamp: new Date('2024-11-26 09:15'), action: 'Registrou saida', entityType: 'event', entityId: '3', entityName: 'TEMU8834521', user: 'Operador', details: { quantity: 20 } },
  { id: '4', timestamp: new Date('2024-11-26 10:00'), action: 'Gerou fatura', entityType: 'invoice', entityId: 'FAT-2024-003', entityName: 'FAT-2024-003', user: 'Sistema', details: { amount: 3200 } },
]

export const defaultSettings = {
  company: {
    name: 'Vectra Storage',
    cnpj: '00.000.000/0001-00',
    address: 'Rua do Porto, 123 - Santos/SP',
    phone: '+55 13 3333-3333',
    email: 'contato@vectra.com.br',
  },
  pricing: {
    storagePerM3: 85,
    handlingPerKg: 0.15,
    minMonthlyFee: 1500,
  },
  labels: {
    printerType: 'SELBETI',
    paperWidth: 100,
    paperHeight: 50,
    dpi: 203,
  }
}
