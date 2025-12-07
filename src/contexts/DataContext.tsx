import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type {
  Container,
  PackingItem,
  Event,
  Measurement,
  Invoice,
  AuditLog,
  Label,
  Client,
  Settings,
} from '../types'
import { initialContainers, initialEvents, initialMeasurements, initialInvoices, initialAuditLogs, initialClients } from '../data/mockData'

// ============================================
// TIPO DO CONTEXTO
// ============================================
interface DataContextType {
  // Estado
  containers: Container[]
  events: Event[]
  measurements: Measurement[]
  invoices: Invoice[]
  auditLogs: AuditLog[]
  labels: Label[]
  clients: Client[]
  settings: Settings

  // Contêineres
  addContainer: (container: Omit<Container, 'id' | 'items'>) => Container
  updateContainer: (id: string, updates: Partial<Container>) => void
  deleteContainer: (id: string) => void
  getContainerById: (id: string) => Container | undefined

  // Itens (Packing List)
  addItemsToContainer: (containerId: string, items: Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'>[]) => void
  updateItem: (itemId: string, updates: Partial<PackingItem>) => void
  removeItemFromContainer: (containerId: string, itemId: string) => void
  getItemsBySku: (sku: string) => PackingItem[]

  // Eventos
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Event
  getEventsByContainer: (containerId: string) => Event[]

  // Medições
  addMeasurement: (measurement: Omit<Measurement, 'id'>) => Measurement
  getMeasurementsByContainer: (containerId: string) => Measurement[]

  // Faturas
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Invoice
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  getInvoicesByClient: (clientId: string) => Invoice[]

  // Etiquetas
  generateLabel: (label: Omit<Label, 'id'>) => Label
  printLabel: (labelId: string) => void

  // Clientes
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client
  updateClient: (id: string, updates: Partial<Client>) => void

  // Auditoria
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void

  // Configurações
  updateSettings: (settings: Partial<Settings>) => void

  // Upload Packing List
  processPackingListUpload: (data: PackingListUploadData) => Container

  // Estatísticas
  getStats: () => DashboardStats
}

interface PackingListUploadData {
  containerCode: string
  containerType: string
  bl: string
  clientName: string
  items: Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'>[]
}

interface DashboardStats {
  activeContainers: number
  totalSkus: number
  totalVolume: number
  totalWeight: number
  monthlyRevenue: number
  pendingInvoices: number
  overdueInvoices: number
}

// ============================================
// CONFIGURAÇÕES PADRÃO
// ============================================
const defaultSettings: Settings = {
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
  },
  notifications: {
    emailOnEntry: true,
    emailOnExit: true,
    emailOnInvoice: true,
    measurementDay: 25,
  },
}

// ============================================
// CONTEXTO
// ============================================
const DataContext = createContext<DataContextType | undefined>(undefined)

// ============================================
// PROVIDER
// ============================================
export function DataProvider({ children }: { children: ReactNode }) {
  const [containers, setContainers] = useState<Container[]>(initialContainers)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements)
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs)
  const [labels, setLabels] = useState<Label[]>([])
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Gerador de IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // ============================================
  // CONTÊINERES
  // ============================================
  const addContainer = useCallback((containerData: Omit<Container, 'id' | 'items'>): Container => {
    const newContainer: Container = {
      ...containerData,
      id: generateId(),
      items: [],
    }
    setContainers(prev => [...prev, newContainer])
    addAuditLog({
      action: 'Criou contêiner',
      entityType: 'container',
      entityId: newContainer.id,
      entityName: newContainer.code,
      user: 'Admin',
      details: { containerCode: newContainer.code, client: newContainer.clientName },
    })
    return newContainer
  }, [])

  const updateContainer = useCallback((id: string, updates: Partial<Container>) => {
    setContainers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    )
  }, [])

  const deleteContainer = useCallback((id: string) => {
    const container = containers.find(c => c.id === id)
    setContainers(prev => prev.filter(c => c.id !== id))
    if (container) {
      addAuditLog({
        action: 'Removeu contêiner',
        entityType: 'container',
        entityId: id,
        entityName: container.code,
        user: 'Admin',
        details: {},
      })
    }
  }, [containers])

  const getContainerById = useCallback((id: string) => {
    return containers.find(c => c.id === id)
  }, [containers])

  // ============================================
  // ITENS (PACKING LIST)
  // ============================================
  const addItemsToContainer = useCallback((
    containerId: string,
    items: Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'>[]
  ) => {
    const now = new Date()
    const newItems: PackingItem[] = items.map(item => ({
      ...item,
      id: generateId(),
      containerId,
      currentQuantity: item.quantity,
      createdAt: now,
      updatedAt: now,
    }))

    setContainers(prev =>
      prev.map(c => {
        if (c.id === containerId) {
          const allItems = [...c.items, ...newItems]
          const usedVolume = allItems.reduce((sum, i) => sum + i.totalVolume, 0)
          const totalWeight = allItems.reduce((sum, i) => sum + i.totalWeight, 0)
          const occupation = (usedVolume / c.totalVolume) * 100

          return {
            ...c,
            items: allItems,
            usedVolume,
            totalWeight,
            occupation: Math.min(occupation, 100),
          }
        }
        return c
      })
    )
  }, [])

  const updateItem = useCallback((itemId: string, updates: Partial<PackingItem>) => {
    setContainers(prev =>
      prev.map(c => ({
        ...c,
        items: c.items.map(i =>
          i.id === itemId ? { ...i, ...updates, updatedAt: new Date() } : i
        ),
      }))
    )
  }, [])

  const removeItemFromContainer = useCallback((containerId: string, itemId: string) => {
    setContainers(prev =>
      prev.map(c => {
        if (c.id === containerId) {
          const items = c.items.filter(i => i.id !== itemId)
          const usedVolume = items.reduce((sum, i) => sum + i.totalVolume, 0)
          const totalWeight = items.reduce((sum, i) => sum + i.totalWeight, 0)
          const occupation = c.totalVolume > 0 ? (usedVolume / c.totalVolume) * 100 : 0

          return {
            ...c,
            items,
            usedVolume,
            totalWeight,
            occupation: Math.min(occupation, 100),
          }
        }
        return c
      })
    )
  }, [])

  const getItemsBySku = useCallback((sku: string): PackingItem[] => {
    return containers.flatMap(c => c.items.filter(i => i.sku.includes(sku)))
  }, [containers])

  // ============================================
  // EVENTOS
  // ============================================
  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'>): Event => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      createdAt: new Date(),
    }
    setEvents(prev => [newEvent, ...prev])

    // Atualizar quantidades dos itens baseado no tipo de evento
    if (eventData.type === 'entry' || eventData.type === 'exit') {
      eventData.items.forEach(eventItem => {
        setContainers(prev =>
          prev.map(c => ({
            ...c,
            items: c.items.map(i => {
              if (i.id === eventItem.packingItemId) {
                const quantityChange = eventData.type === 'entry' ? eventItem.quantity : -eventItem.quantity
                return {
                  ...i,
                  currentQuantity: Math.max(0, i.currentQuantity + quantityChange),
                  updatedAt: new Date(),
                }
              }
              return i
            }),
          }))
        )
      })
    }

    addAuditLog({
      action: eventData.type === 'entry' ? 'Registrou entrada' : eventData.type === 'exit' ? 'Registrou saída' : 'Realizou medição',
      entityType: 'event',
      entityId: newEvent.id,
      entityName: eventData.containerCode,
      user: eventData.createdBy,
      details: { items: eventData.items.length },
    })

    return newEvent
  }, [])

  const getEventsByContainer = useCallback((containerId: string): Event[] => {
    return events.filter(e => e.containerId === containerId)
  }, [events])

  // ============================================
  // MEDIÇÕES
  // ============================================
  const addMeasurement = useCallback((measurementData: Omit<Measurement, 'id'>): Measurement => {
    const newMeasurement: Measurement = {
      ...measurementData,
      id: generateId(),
    }
    setMeasurements(prev => [newMeasurement, ...prev])

    addAuditLog({
      action: 'Registrou medição',
      entityType: 'measurement',
      entityId: newMeasurement.id,
      entityName: measurementData.sku,
      user: measurementData.measuredBy,
      details: {
        dimensions: `${measurementData.length}x${measurementData.width}x${measurementData.height}`,
        weight: measurementData.weight,
      },
    })

    return newMeasurement
  }, [])

  const getMeasurementsByContainer = useCallback((containerId: string): Measurement[] => {
    return measurements.filter(m => m.containerId === containerId)
  }, [measurements])

  // ============================================
  // FATURAS
  // ============================================
  const addInvoice = useCallback((invoiceData: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
    const invoiceNumber = `FAT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`
    const newInvoice: Invoice = {
      ...invoiceData,
      id: invoiceNumber,
      createdAt: new Date(),
    }
    setInvoices(prev => [newInvoice, ...prev])

    addAuditLog({
      action: 'Gerou fatura',
      entityType: 'invoice',
      entityId: newInvoice.id,
      entityName: newInvoice.id,
      user: 'Sistema',
      details: { amount: newInvoice.totalAmount, client: newInvoice.clientName },
    })

    return newInvoice
  }, [invoices.length])

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(i => (i.id === id ? { ...i, ...updates } : i))
    )
  }, [])

  const getInvoicesByClient = useCallback((clientId: string): Invoice[] => {
    return invoices.filter(i => i.clientId === clientId)
  }, [invoices])

  // ============================================
  // ETIQUETAS
  // ============================================
  const generateLabel = useCallback((labelData: Omit<Label, 'id'>): Label => {
    const newLabel: Label = {
      ...labelData,
      id: generateId(),
    }
    setLabels(prev => [...prev, newLabel])
    return newLabel
  }, [])

  const printLabel = useCallback((labelId: string) => {
    setLabels(prev =>
      prev.map(l =>
        l.id === labelId
          ? { ...l, printedAt: new Date(), printedBy: 'Admin' }
          : l
      )
    )

    addAuditLog({
      action: 'Imprimiu etiqueta',
      entityType: 'label',
      entityId: labelId,
      entityName: labels.find(l => l.id === labelId)?.sku || '',
      user: 'Admin',
      details: {},
    })
  }, [labels])

  // ============================================
  // CLIENTES
  // ============================================
  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      createdAt: new Date(),
    }
    setClients(prev => [...prev, newClient])

    addAuditLog({
      action: 'Cadastrou cliente',
      entityType: 'client',
      entityId: newClient.id,
      entityName: newClient.name,
      user: 'Admin',
      details: {},
    })

    return newClient
  }, [])

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    )
  }, [])

  // ============================================
  // AUDITORIA
  // ============================================
  const addAuditLog = useCallback((logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: generateId(),
      timestamp: new Date(),
    }
    setAuditLogs(prev => [newLog, ...prev])
  }, [])

  // ============================================
  // CONFIGURAÇÕES
  // ============================================
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // ============================================
  // UPLOAD PACKING LIST
  // ============================================
  const processPackingListUpload = useCallback((data: PackingListUploadData): Container => {
    // Verificar se o contêiner já existe
    let container = containers.find(c => c.code === data.containerCode)

    if (!container) {
      // Criar novo contêiner
      const containerCapacity: Record<string, number> = {
        "Dry Box 20'": 33.2,
        "Dry Box 40'": 67.7,
        "Dry Box 40' HC": 76.3,
      }

      container = addContainer({
        code: data.containerCode,
        status: 'active',
        clientId: '',
        clientName: data.clientName,
        type: data.containerType,
        bl: data.bl,
        occupation: 0,
        totalVolume: containerCapacity[data.containerType] || 67.7,
        usedVolume: 0,
        totalWeight: 0,
        since: new Date(),
        monthlyPrice: 3200,
      })
    }

    // Adicionar itens ao contêiner
    addItemsToContainer(container.id, data.items)

    return container
  }, [containers, addContainer, addItemsToContainer])

  // ============================================
  // ESTATÍSTICAS
  // ============================================
  const getStats = useCallback((): DashboardStats => {
    const activeContainers = containers.filter(c => c.status !== 'inactive').length
    const totalSkus = containers.reduce((sum, c) => sum + c.items.length, 0)
    const totalVolume = containers.reduce((sum, c) => sum + c.usedVolume, 0)
    const totalWeight = containers.reduce((sum, c) => sum + c.totalWeight, 0)
    const monthlyRevenue = containers.reduce((sum, c) => sum + c.monthlyPrice, 0)
    const pendingInvoices = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.totalAmount, 0)
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0)

    return {
      activeContainers,
      totalSkus,
      totalVolume,
      totalWeight,
      monthlyRevenue,
      pendingInvoices,
      overdueInvoices,
    }
  }, [containers, invoices])

  // ============================================
  // VALOR DO CONTEXTO
  // ============================================
  const value: DataContextType = {
    containers,
    events,
    measurements,
    invoices,
    auditLogs,
    labels,
    clients,
    settings,
    addContainer,
    updateContainer,
    deleteContainer,
    getContainerById,
    addItemsToContainer,
    updateItem,
    removeItemFromContainer,
    getItemsBySku,
    addEvent,
    getEventsByContainer,
    addMeasurement,
    getMeasurementsByContainer,
    addInvoice,
    updateInvoice,
    getInvoicesByClient,
    generateLabel,
    printLabel,
    addClient,
    updateClient,
    addAuditLog,
    updateSettings,
    processPackingListUpload,
    getStats,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// ============================================
// HOOK
// ============================================
export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
