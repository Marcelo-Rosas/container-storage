import { useState, useEffect } from 'react'
import { Ruler, Box, Scale } from 'lucide-react'
import { Modal, ModalFooter } from '../Modal'
import { useData } from '../../contexts/DataContext'
import clsx from 'clsx'

interface MeasurementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MeasurementModal({ isOpen, onClose }: MeasurementModalProps) {
  const { containers, addMeasurement } = useData()

  const [containerId, setContainerId] = useState('')
  const [itemId, setItemId] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  const selectedContainer = containers.find(c => c.id === containerId)
  const availableItems = selectedContainer?.items || []
  const selectedItem = availableItems.find(i => i.id === itemId)

  // Calcular volume
  const volume = (Number(length) * Number(width) * Number(height)) / 1000000 // cm³ para m³

  useEffect(() => {
    if (!isOpen) {
      setContainerId('')
      setItemId('')
      setLength('')
      setWidth('')
      setHeight('')
      setWeight('')
      setNotes('')
    }
  }, [isOpen])

  // Auto-fill com dados do item selecionado
  useEffect(() => {
    if (selectedItem) {
      setLength(String(selectedItem.length))
      setWidth(String(selectedItem.width))
      setHeight(String(selectedItem.height))
      setWeight(String(selectedItem.unitWeight))
    }
  }, [selectedItem])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedContainer || !selectedItem) return

    addMeasurement({
      containerId: selectedContainer.id,
      containerCode: selectedContainer.code,
      date: new Date(),
      itemId: selectedItem.id,
      sku: selectedItem.sku,
      length: Number(length),
      width: Number(width),
      height: Number(height),
      weight: Number(weight),
      volume,
      notes,
      measuredBy: 'Admin',
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Medicao"
      description="Registre as dimensoes e peso de um item"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Container Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteiner *
            </label>
            <select
              value={containerId}
              onChange={(e) => {
                setContainerId(e.target.value)
                setItemId('')
              }}
              className="input"
              required
            >
              <option value="">Selecione um conteiner</option>
              {containers.filter(c => c.items.length > 0).map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.clientName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item/SKU *
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="input"
              required
              disabled={!containerId}
            >
              <option value="">Selecione um item</option>
              {availableItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.sku} - {item.descriptionPt || item.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-gray-400" />
              Dimensoes (em cm) *
            </div>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Comprimento</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="cm"
                min="0"
                step="0.1"
                className="input text-center"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Largura</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="cm"
                min="0"
                step="0.1"
                className="input text-center"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Altura</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="cm"
                min="0"
                step="0.1"
                className="input text-center"
                required
              />
            </div>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-gray-400" />
              Peso (kg) *
            </div>
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
            min="0"
            step="0.1"
            className="input max-w-xs"
            required
          />
        </div>

        {/* Calculated volume */}
        {Number(length) > 0 && Number(width) > 0 && Number(height) > 0 && (
          <div className="p-4 bg-brand-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Box size={24} className="text-brand-600" />
              <div>
                <p className="text-sm text-brand-600">Volume calculado</p>
                <p className="text-2xl font-bold text-brand-700">{volume.toFixed(3)} m³</p>
              </div>
            </div>
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
            rows={2}
            placeholder="Observacoes sobre a medicao..."
            className="input resize-none"
          />
        </div>

        {/* Comparison with original */}
        {selectedItem && (Number(length) > 0 || Number(weight) > 0) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Comparacao com dados originais:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Dimensoes orig.:</span>
                <span className="font-medium">
                  {selectedItem.length}x{selectedItem.width}x{selectedItem.height} cm
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Dimensoes med.:</span>
                <span className={clsx(
                  'font-medium',
                  (Number(length) !== selectedItem.length || Number(width) !== selectedItem.width || Number(height) !== selectedItem.height)
                    ? 'text-orange-600'
                    : 'text-emerald-600'
                )}>
                  {length}x{width}x{height} cm
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Peso orig.:</span>
                <span className="font-medium">{selectedItem.unitWeight} kg</span>
              </div>
              <div>
                <span className="text-gray-500 block">Peso med.:</span>
                <span className={clsx(
                  'font-medium',
                  Number(weight) !== selectedItem.unitWeight
                    ? 'text-orange-600'
                    : 'text-emerald-600'
                )}>
                  {weight} kg
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
            disabled={!containerId || !itemId || !length || !width || !height || !weight}
            className={clsx(
              'btn btn-primary',
              (!containerId || !itemId || !length || !width || !height || !weight) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Ruler size={18} />
            Registrar Medicao
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
