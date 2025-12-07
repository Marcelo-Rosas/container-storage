import { createContext, useContext, useState, useCallback } from 'react'
import { initialContainers, initialEvents, initialMeasurements, initialInvoices, initialAuditLogs, initialClients, defaultSettings } from '../data/mockData'

const DataContext = createContext(undefined)

export function DataProvider({ children }) {
  const [containers, setContainers] = useState(initialContainers)
  const [events, setEvents] = useState(initialEvents)
  const [measurements, setMeasurements] = useState(initialMeasurements)
  const [invoices, setInvoices] = useState(initialInvoices)
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs)
  const [clients, setClients] = useState(initialClients)
  const [settings, setSettings] = useState(defaultSettings)

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Containers
  const addContainer = useCallback((data) => {
    const newContainer = { ...data, id: generateId(), items: [] }
    setContainers(prev => [...prev, newContainer])
    addAuditLog({ action: 'Criou container', entityType: 'container', entityId: newContainer.id, entityName: newContainer.code, user: 'Admin', details: {} })
    return newContainer
  }, [])

  const updateContainer = useCallback((id, updates) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const deleteContainer = useCallback((id) => {
    const container = containers.find(c => c.id === id)
    setContainers(prev => prev.filter(c => c.id !== id))
    if (container) {
      addAuditLog({ action: 'Removeu container', entityType: 'container', entityId: id, entityName: container.code, user: 'Admin', details: {} })
    }
  }, [containers])

  // Items
  const addItemsToContainer = useCallback((containerId, items) => {
    const now = new Date()
    const newItems = items.map(item => ({
      ...item,
      id: generateId(),
      containerId,
      currentQuantity: item.quantity,
      createdAt: now,
      updatedAt: now,
    }))

    setContainers(prev => prev.map(c => {
      if (c.id === containerId) {
        const allItems = [...c.items, ...newItems]
        const usedVolume = allItems.reduce((sum, i) => sum + (i.totalVolume || 0), 0)
        const totalWeight = allItems.reduce((sum, i) => sum + (i.totalWeight || 0), 0)
        const occupation = (usedVolume / c.totalVolume) * 100
        return { ...c, items: allItems, usedVolume, totalWeight, occupation: Math.min(occupation, 100) }
      }
      return c
    }))
  }, [])

  // Events
  const addEvent = useCallback((data) => {
    const newEvent = { ...data, id: generateId(), createdAt: new Date() }
    setEvents(prev => [newEvent, ...prev])

    if (data.type === 'entry' || data.type === 'exit') {
      data.items.forEach(eventItem => {
        setContainers(prev => prev.map(c => ({
          ...c,
          items: c.items.map(i => {
            if (i.sku === eventItem.sku) {
              const change = data.type === 'entry' ? eventItem.quantity : -eventItem.quantity
              return { ...i, currentQuantity: Math.max(0, i.currentQuantity + change) }
            }
            return i
          })
        })))
      })
    }

    addAuditLog({
      action: data.type === 'entry' ? 'Registrou entrada' : data.type === 'exit' ? 'Registrou saida' : 'Realizou medicao',
      entityType: 'event', entityId: newEvent.id, entityName: data.containerCode, user: data.createdBy, details: { items: data.items.length }
    })
    return newEvent
  }, [])

  // Measurements
  const addMeasurement = useCallback((data) => {
    const newMeasurement = { ...data, id: generateId() }
    setMeasurements(prev => [newMeasurement, ...prev])
    addAuditLog({ action: 'Registrou medicao', entityType: 'measurement', entityId: newMeasurement.id, entityName: data.sku, user: data.measuredBy, details: {} })
    return newMeasurement
  }, [])

  // Invoices
  const addInvoice = useCallback((data) => {
    const invoiceNumber = `FAT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`
    const newInvoice = { ...data, id: invoiceNumber, createdAt: new Date() }
    setInvoices(prev => [newInvoice, ...prev])
    addAuditLog({ action: 'Gerou fatura', entityType: 'invoice', entityId: invoiceNumber, entityName: invoiceNumber, user: 'Sistema', details: { amount: data.totalAmount } })
    return newInvoice
  }, [invoices.length])

  const updateInvoice = useCallback((id, updates) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }, [])

  // Audit
  const addAuditLog = useCallback((data) => {
    const newLog = { ...data, id: generateId(), timestamp: new Date() }
    setAuditLogs(prev => [newLog, ...prev])
  }, [])

  // Packing List Upload
  const processPackingListUpload = useCallback((data) => {
    let container = containers.find(c => c.code === data.containerCode)

    if (!container) {
      const containerCapacity = { "Dry Box 20'": 33.2, "Dry Box 40'": 67.7, "Dry Box 40' HC": 76.3 }
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

    addItemsToContainer(container.id, data.items)
    return container
  }, [containers, addContainer, addItemsToContainer])

  // Stats
  const getStats = useCallback(() => {
    const activeContainers = containers.filter(c => c.status !== 'inactive').length
    const totalSkus = containers.reduce((sum, c) => sum + c.items.length, 0)
    const totalVolume = containers.reduce((sum, c) => sum + c.usedVolume, 0)
    const totalWeight = containers.reduce((sum, c) => sum + c.totalWeight, 0)
    const monthlyRevenue = containers.reduce((sum, c) => sum + c.monthlyPrice, 0)
    const pendingInvoices = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.totalAmount, 0)
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0)
    return { activeContainers, totalSkus, totalVolume, totalWeight, monthlyRevenue, pendingInvoices, overdueInvoices }
  }, [containers, invoices])

  const value = {
    containers, events, measurements, invoices, auditLogs, clients, settings,
    addContainer, updateContainer, deleteContainer,
    addItemsToContainer,
    addEvent,
    addMeasurement,
    addInvoice, updateInvoice,
    addAuditLog,
    processPackingListUpload,
    getStats,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
