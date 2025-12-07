import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Ruler, Plus, Trash2 } from 'lucide-react'
import { Modal, ModalFooter } from '../Modal'
import { useData } from '../../contexts/DataContext'
import type { EventType, EventItem } from '../../types'
import clsx from 'clsx'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  defaultType?: EventType
}

export function EventModal({ isOpen, onClose, defaultType = 'entry' }: EventModalProps) {
  const { containers, addEvent } = useData()

  const [eventType, setEventType] = useState<EventType>(defaultType)
  const [containerId, setContainerId] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedItems, setSelectedItems] = useState<EventItem[]>([])

  const selectedContainer = containers.find(c => c.id === containerId)
  const availableItems = selectedContainer?.items || []

  useEffect(() => {
    setEventType(defaultType)
  }, [defaultType])

  useEffect(() => {
    if (!isOpen) {
      setContainerId('')
      setNotes('')
      setSelectedItems([])
    }
  }, [isOpen])

  const handleContainerChange = (id: string) => {
    setContainerId(id)
    setSelectedItems([])
  }

  const handleAddItem = (itemId: string) => {
    const item = availableItems.find(i => i.id === itemId)
    if (!item) return

    if (selectedItems.some(si => si.packingItemId === itemId)) {
      return // Ja adicionado
    }

    setSelectedItems(prev => [...prev, {
      packingItemId: item.id,
      sku: item.sku,
      description: item.descriptionPt || item.description,
      quantity: 1,
    }])
  }

  const handleRemoveItem = (packingItemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.packingItemId !== packingItemId))
  }

  const handleQuantityChange = (packingItemId: string, quantity: number) => {
    setSelectedItems(prev => prev.map(i =>
      i.packingItemId === packingItemId ? { ...i, quantity: Math.max(1, quantity) } : i
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedContainer || (eventType !== 'measurement' && selectedItems.length === 0)) {
      return
    }

    addEvent({
      type: eventType,
      containerId: selectedContainer.id,
      containerCode: selectedContainer.code,
      clientName: selectedContainer.clientName,
      date: new Date(),
      items: selectedItems,
      notes,
      createdBy: 'Admin',
    })

    onClose()
  }

  const eventTypeConfig = {
    entry: {
      label: 'Entrada',
      icon: ArrowRight,
      color: 'bg-emerald-500',
      description: 'Registrar entrada de mercadorias',
    },
    exit: {
      label: 'Saida',
      icon: ArrowLeft,
      color: 'bg-orange-500',
      description: 'Registrar saida de mercadorias',
    },
    measurement: {
      label: 'Medicao',
      icon: Ruler,
      color: 'bg-brand-500',
      description: 'Registrar medicao mensal',
    },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Evento"
      description="Registre entradas, saidas ou medicoes"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Evento *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(eventTypeConfig) as [EventType, typeof eventTypeConfig.entry][]).map(([type, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={clsx(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    eventType === type
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-2', config.color)}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="font-medium text-gray-900">{config.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Container Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteiner *
          </label>
          <select
            value={containerId}
            onChange={(e) => handleContainerChange(e.target.value)}
            className="input"
            required
          >
            <option value="">Selecione um conteiner</option>
            {containers.filter(c => c.status !== 'inactive').map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.clientName}
              </option>
            ))}
          </select>
        </div>

        {/* Items Selection (for entry/exit) */}
        {eventType !== 'measurement' && selectedContainer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Itens *
            </label>

            {/* Add item dropdown */}
            <div className="flex gap-2 mb-4">
              <select
                className="input flex-1"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItem(e.target.value)
                    e.target.value = ''
                  }
                }}
              >
                <option value="">Adicionar item...</option>
                {availableItems
                  .filter(i => !selectedItems.some(si => si.packingItemId === i.id))
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.descriptionPt || item.description} (Disp: {item.currentQuantity})
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected items list */}
            {selectedItems.length > 0 ? (
              <div className="space-y-2">
                {selectedItems.map(item => {
                  const originalItem = availableItems.find(i => i.id === item.packingItemId)
                  return (
                    <div
                      key={item.packingItemId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.sku}</p>
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.packingItemId, Number(e.target.value))}
                          min="1"
                          max={eventType === 'exit' ? originalItem?.currentQuantity : undefined}
                          className="w-20 input text-center py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.packingItemId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <Plus size={24} className="mx-auto mb-2" />
                <p>Adicione itens ao evento</p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observacoes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Observacoes adicionais..."
            className="input resize-none"
          />
        </div>

        {/* Summary */}
        {selectedItems.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Resumo do evento:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="ml-2 font-medium">{eventTypeConfig[eventType].label}</span>
              </div>
              <div>
                <span className="text-gray-500">Itens:</span>
                <span className="ml-2 font-medium">{selectedItems.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Total unidades:</span>
                <span className="ml-2 font-medium">
                  {selectedItems.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        <ModalFooter>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!containerId || (eventType !== 'measurement' && selectedItems.length === 0)}
            className={clsx(
              'btn btn-primary',
              (!containerId || (eventType !== 'measurement' && selectedItems.length === 0)) && 'opacity-50 cursor-not-allowed'
            )}
          >
            Registrar {eventTypeConfig[eventType].label}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
