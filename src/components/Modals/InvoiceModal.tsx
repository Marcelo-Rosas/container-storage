import { useState, useEffect } from 'react'
import { Receipt, Calculator } from 'lucide-react'
import { Modal, ModalFooter } from '../Modal'
import { useData } from '../../contexts/DataContext'
import type { InvoiceStatus } from '../../types'
import clsx from 'clsx'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InvoiceModal({ isOpen, onClose }: InvoiceModalProps) {
  const { clients, containers, addInvoice, settings } = useData()

  const [clientId, setClientId] = useState('')
  const [period, setPeriod] = useState('')
  const [selectedContainers, setSelectedContainers] = useState<string[]>([])
  const [storageAmount, setStorageAmount] = useState(0)
  const [handlingAmount, setHandlingAmount] = useState(0)
  const [additionalAmount, setAdditionalAmount] = useState(0)
  const [status, setStatus] = useState<InvoiceStatus>('pending')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')

  // Filtrar conteineres do cliente selecionado
  const clientContainers = containers.filter(c => c.clientId === clientId || c.clientName === clients.find(cl => cl.id === clientId)?.name)
  const selectedClient = clients.find(c => c.id === clientId)

  // Calcular total
  const totalAmount = storageAmount + handlingAmount + additionalAmount

  // Definir periodo padrao (mes atual)
  useEffect(() => {
    const now = new Date()
    const month = now.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
    const year = now.getFullYear()
    setPeriod(`${month.charAt(0).toUpperCase() + month.slice(1)}/${year}`)

    // Data de vencimento padrao: dia 25 do mes
    const dueDay = new Date(year, now.getMonth(), 25)
    setDueDate(dueDay.toISOString().split('T')[0])
  }, [isOpen])

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setClientId('')
      setSelectedContainers([])
      setStorageAmount(0)
      setHandlingAmount(0)
      setAdditionalAmount(0)
      setStatus('pending')
      setNotes('')
    }
  }, [isOpen])

  // Calcular valores automaticamente baseado nos conteineres selecionados
  const calculateAmounts = () => {
    const selected = containers.filter(c => selectedContainers.includes(c.id))

    // Armazenagem: volume ocupado * preco por m³
    const storage = selected.reduce((sum, c) => {
      return sum + (c.usedVolume * settings.pricing.storagePerM3)
    }, 0)

    // Manuseio: peso total * preco por kg
    const handling = selected.reduce((sum, c) => {
      return sum + (c.totalWeight * settings.pricing.handlingPerKg)
    }, 0)

    // Aplicar minimo
    const finalStorage = Math.max(storage, settings.pricing.minMonthlyFee)

    setStorageAmount(Math.round(finalStorage))
    setHandlingAmount(Math.round(handling))
  }

  const handleContainerToggle = (containerId: string) => {
    setSelectedContainers(prev =>
      prev.includes(containerId)
        ? prev.filter(id => id !== containerId)
        : [...prev, containerId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!clientId || selectedContainers.length === 0) return

    addInvoice({
      clientId,
      clientName: selectedClient?.name || '',
      period,
      containers: selectedContainers.map(id => containers.find(c => c.id === id)?.code || ''),
      storageAmount,
      handlingAmount,
      additionalAmount,
      totalAmount,
      status,
      dueDate: new Date(dueDate),
      notes,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Fatura"
      description="Gere uma nova fatura de armazenagem"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client and Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value)
                setSelectedContainers([])
              }}
              className="input"
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo *
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Ex: Dez/2024"
              className="input"
              required
            />
          </div>
        </div>

        {/* Container Selection */}
        {clientId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteineres *
            </label>
            {clientContainers.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {clientContainers.map(container => (
                  <label
                    key={container.id}
                    className={clsx(
                      'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                      selectedContainers.includes(container.id)
                        ? 'bg-brand-50 border border-brand-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedContainers.includes(container.id)}
                      onChange={() => handleContainerToggle(container.id)}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{container.code}</span>
                      <span className="ml-2 text-sm text-gray-500">({container.type})</span>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">
                      R$ {container.monthlyPrice.toLocaleString('pt-BR')}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                Este cliente nao possui conteineres ativos.
              </p>
            )}
          </div>
        )}

        {/* Calculate button */}
        {selectedContainers.length > 0 && (
          <button
            type="button"
            onClick={calculateAmounts}
            className="btn btn-secondary w-full"
          >
            <Calculator size={18} />
            Calcular Valores Automaticamente
          </button>
        )}

        {/* Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Armazenagem (R$) *
            </label>
            <input
              type="number"
              value={storageAmount}
              onChange={(e) => setStorageAmount(Number(e.target.value))}
              min="0"
              step="0.01"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manuseio (R$)
            </label>
            <input
              type="number"
              value={handlingAmount}
              onChange={(e) => setHandlingAmount(Number(e.target.value))}
              min="0"
              step="0.01"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adicionais (R$)
            </label>
            <input
              type="number"
              value={additionalAmount}
              onChange={(e) => setAdditionalAmount(Number(e.target.value))}
              min="0"
              step="0.01"
              className="input"
            />
          </div>
        </div>

        {/* Due date and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vencimento *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className="input"
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Vencido</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observacoes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Observacoes da fatura..."
            className="input resize-none"
          />
        </div>

        {/* Total */}
        <div className="p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-emerald-600" />
              <span className="text-lg font-medium text-emerald-800">Total da Fatura</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <ModalFooter>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!clientId || selectedContainers.length === 0 || totalAmount <= 0}
            className={clsx(
              'btn btn-primary',
              (!clientId || selectedContainers.length === 0 || totalAmount <= 0) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Receipt size={18} />
            Gerar Fatura
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
