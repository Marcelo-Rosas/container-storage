// ============================================
// VECTRA STORAGE MANAGER - TIPOS DE DADOS
// ============================================

// Status de Contêiner
export type ContainerStatus = 'active' | 'partial' | 'inactive'

// Tipos de Evento
export type EventType = 'entry' | 'exit' | 'measurement'

// Status de Fatura
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

// ============================================
// ENTIDADE: CLIENTE
// ============================================
export interface Client {
  id: string
  name: string
  cnpj: string
  email: string
  phone: string
  address: string
  createdAt: Date
}

// ============================================
// ENTIDADE: CONTÊINER
// ============================================
export interface Container {
  id: string
  code: string
  status: ContainerStatus
  clientId: string
  clientName: string
  type: string // "Dry Box 40' HC", "Dry Box 40'", "Dry Box 20'"
  bl: string // Bill of Lading
  occupation: number // 0-100%
  totalVolume: number // m³
  usedVolume: number // m³
  totalWeight: number // kg
  since: Date
  monthlyPrice: number
  items: PackingItem[]
}

// ============================================
// ENTIDADE: ITEM DO PACKING LIST
// ============================================
export interface PackingItem {
  id: string
  containerId: string
  sku: string
  description: string
  descriptionPt: string
  quantity: number
  currentQuantity: number // Quantidade atual em estoque
  unitWeight: number // kg
  totalWeight: number // kg
  length: number // cm
  width: number // cm
  height: number // cm
  unitVolume: number // m³
  totalVolume: number // m³
  ncm: string
  origin: string
  brand: string
  model: string
  unitPrice: number // USD
  totalPrice: number // USD
  location: string // Localização no armazém
  createdAt: Date
  updatedAt: Date
}

// ============================================
// ENTIDADE: EVENTO (MOVIMENTAÇÃO)
// ============================================
export interface Event {
  id: string
  type: EventType
  containerId: string
  containerCode: string
  clientName: string
  date: Date
  items: EventItem[]
  notes: string
  createdBy: string
  createdAt: Date
}

export interface EventItem {
  packingItemId: string
  sku: string
  description: string
  quantity: number
}

// ============================================
// ENTIDADE: MEDIÇÃO
// ============================================
export interface Measurement {
  id: string
  containerId: string
  containerCode: string
  date: Date
  itemId: string
  sku: string
  length: number // cm
  width: number // cm
  height: number // cm
  weight: number // kg
  volume: number // m³
  notes: string
  measuredBy: string
}

// ============================================
// ENTIDADE: FATURA
// ============================================
export interface Invoice {
  id: string
  clientId: string
  clientName: string
  period: string // "Nov/2024"
  containers: string[]
  storageAmount: number
  handlingAmount: number
  additionalAmount: number
  totalAmount: number
  status: InvoiceStatus
  dueDate: Date
  paidDate?: Date
  notes: string
  createdAt: Date
}

// ============================================
// ENTIDADE: ETIQUETA
// ============================================
export interface Label {
  id: string
  type: 'storage' | 'shipping' | 'return'
  itemId: string
  sku: string
  description: string
  containerCode: string
  clientName: string
  location: string
  barcode: string
  qrCode: string
  weight: number
  dimensions: string
  printedAt?: Date
  printedBy?: string
}

// ============================================
// ENTIDADE: LOG DE AUDITORIA
// ============================================
export interface AuditLog {
  id: string
  action: string
  entityType: 'container' | 'event' | 'measurement' | 'invoice' | 'item' | 'client' | 'label'
  entityId: string
  entityName: string
  user: string
  details: Record<string, unknown>
  timestamp: Date
}

// ============================================
// PACKING LIST (UPLOAD)
// ============================================
export interface PackingListUpload {
  containerId: string
  containerCode: string
  bl: string
  clientName: string
  origin: string
  vessel: string
  items: PackingItem[]
  uploadedAt: Date
  uploadedBy: string
}

// ============================================
// CONFIGURAÇÕES
// ============================================
export interface Settings {
  company: {
    name: string
    cnpj: string
    address: string
    phone: string
    email: string
    logo?: string
  }
  pricing: {
    storagePerM3: number
    handlingPerKg: number
    minMonthlyFee: number
  }
  labels: {
    printerType: 'SELBETI' | 'ZEBRA' | 'GENERIC'
    paperWidth: number // mm
    paperHeight: number // mm
    dpi: number
  }
  notifications: {
    emailOnEntry: boolean
    emailOnExit: boolean
    emailOnInvoice: boolean
    measurementDay: number // Dia do mês para medição
  }
}

// ============================================
// HELPERS / UTILITÁRIOS
// ============================================

// Status configs para UI
export const containerStatusConfig = {
  active: { label: 'Ativo', className: 'badge-active' },
  partial: { label: 'Parcial', className: 'badge-partial' },
  inactive: { label: 'Inativo', className: 'badge-inactive' },
}

export const eventTypeConfig = {
  entry: { label: 'Entrada', className: 'bg-emerald-50 text-emerald-700' },
  exit: { label: 'Saída', className: 'bg-orange-50 text-orange-700' },
  measurement: { label: 'Medição', className: 'bg-brand-50 text-brand-700' },
}

export const invoiceStatusConfig = {
  paid: { label: 'Pago', className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pendente', className: 'bg-yellow-50 text-yellow-700' },
  overdue: { label: 'Vencido', className: 'bg-red-50 text-red-700' },
}

// Container types
export const containerTypes = [
  "Dry Box 20'",
  "Dry Box 40'",
  "Dry Box 40' HC",
  "Reefer 20'",
  "Reefer 40'",
  "Reefer 40' HC",
]

// Capacidade dos contêineres
export const containerCapacity: Record<string, { volume: number; weight: number }> = {
  "Dry Box 20'": { volume: 33.2, weight: 28000 },
  "Dry Box 40'": { volume: 67.7, weight: 26500 },
  "Dry Box 40' HC": { volume: 76.3, weight: 26500 },
  "Reefer 20'": { volume: 28.3, weight: 27500 },
  "Reefer 40'": { volume: 59.3, weight: 26000 },
  "Reefer 40' HC": { volume: 67.8, weight: 26000 },
}
