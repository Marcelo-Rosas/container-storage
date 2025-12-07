import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../Modal'
import { useData } from '../../contexts/DataContext'
import { containerTypes, containerCapacity, type Container } from '../../types'
import clsx from 'clsx'

interface ContainerModalProps {
  isOpen: boolean
  onClose: () => void
  container?: Container | null
}

export function ContainerModal({ isOpen, onClose, container }: ContainerModalProps) {
  const { addContainer, updateContainer, clients } = useData()

  const [formData, setFormData] = useState({
    code: '',
    type: "Dry Box 40' HC" as string,
    bl: '',
    clientName: '',
    clientId: '',
    monthlyPrice: 3200,
    status: 'active' as 'active' | 'partial' | 'inactive',
  })

  useEffect(() => {
    if (container) {
      setFormData({
        code: container.code,
        type: container.type,
        bl: container.bl,
        clientName: container.clientName,
        clientId: container.clientId,
        monthlyPrice: container.monthlyPrice,
        status: container.status,
      })
    } else {
      setFormData({
        code: '',
        type: "Dry Box 40' HC",
        bl: '',
        clientName: '',
        clientId: '',
        monthlyPrice: 3200,
        status: 'active',
      })
    }
  }, [container, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const capacity = containerCapacity[formData.type] || { volume: 67.7, weight: 26500 }

    if (container) {
      updateContainer(container.id, {
        code: formData.code,
        type: formData.type,
        bl: formData.bl,
        clientName: formData.clientName,
        clientId: formData.clientId,
        monthlyPrice: formData.monthlyPrice,
        status: formData.status,
      })
    } else {
      addContainer({
        code: formData.code,
        status: formData.status,
        clientId: formData.clientId,
        clientName: formData.clientName,
        type: formData.type,
        bl: formData.bl,
        occupation: 0,
        totalVolume: capacity.volume,
        usedVolume: 0,
        totalWeight: 0,
        since: new Date(),
        monthlyPrice: formData.monthlyPrice,
      })
    }

    onClose()
  }

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    setFormData(prev => ({
      ...prev,
      clientId,
      clientName: client?.name || '',
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={container ? 'Editar Conteiner' : 'Novo Conteiner'}
      description={container ? `Editando ${container.code}` : 'Cadastre um novo conteiner no sistema'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Codigo do Conteiner *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="Ex: CMAU3754293"
              className="input font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conteiner *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="input"
              required
            >
              {containerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill of Lading (BL) *
            </label>
            <input
              type="text"
              value={formData.bl}
              onChange={(e) => setFormData(prev => ({ ...prev, bl: e.target.value.toUpperCase() }))}
              placeholder="Ex: 06BRZ2411035"
              className="input font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as typeof formData.status }))}
              className="input"
            >
              <option value="active">Ativo</option>
              <option value="partial">Parcial</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              className="input"
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.monthlyPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyPrice: Number(e.target.value) }))}
              min="0"
              step="100"
              className="input"
            />
          </div>
        </div>

        {/* Capacity info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Capacidade do conteiner selecionado:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Volume:</span>
              <span className="ml-2 font-medium">
                {containerCapacity[formData.type]?.volume || 67.7} m³
              </span>
            </div>
            <div>
              <span className="text-gray-500">Peso maximo:</span>
              <span className="ml-2 font-medium">
                {((containerCapacity[formData.type]?.weight || 26500) / 1000).toFixed(1)} ton
              </span>
            </div>
          </div>
        </div>

        <ModalFooter>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!formData.code || !formData.bl}
            className={clsx(
              'btn btn-primary',
              (!formData.code || !formData.bl) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {container ? 'Salvar Alteracoes' : 'Criar Conteiner'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
