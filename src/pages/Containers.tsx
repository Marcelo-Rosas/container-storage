import { useState } from 'react'
import { Plus, Package, Scale, Box, Upload, Eye, Tag, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { useData } from '../contexts/DataContext'
import { ContainerModal } from '../components/Modals'
import { PackingListUploadModal } from '../components/PackingListUpload'
import { LabelModal } from '../components/Modals'
import { ConfirmModal } from '../components/Modal'
import type { Container, ContainerStatus } from '../types'

const statusConfig = {
  active: { label: 'Ativo', className: 'badge-active' },
  partial: { label: 'Parcial', className: 'badge-partial' },
  inactive: { label: 'Inativo', className: 'badge-inactive' },
}

function getOccupationColor(occupation: number): string {
  if (occupation >= 80) return 'bg-emerald-500'
  if (occupation >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

interface ContainerCardProps {
  container: Container
  onEdit: (container: Container) => void
  onDelete: (container: Container) => void
  onViewItems: (container: Container) => void
  onPrintLabel: (container: Container) => void
}

function ContainerCard({ container, onEdit, onDelete, onViewItems, onPrintLabel }: ContainerCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const status = statusConfig[container.status]
  const occupationColor = getOccupationColor(container.occupation)

  return (
    <div className="card p-5 relative">
      {/* Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical size={18} />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
              <button
                onClick={() => { onViewItems(container); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={16} />
                Ver Itens ({container.items.length})
              </button>
              <button
                onClick={() => { onPrintLabel(container); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Tag size={16} />
                Emitir Etiqueta
              </button>
              <button
                onClick={() => { onEdit(container); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button
                onClick={() => { onDelete(container); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 pr-8">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{container.code}</h3>
            <span className={clsx('badge', status.className)}>{status.label}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{container.clientName}</p>
        </div>
      </div>

      {/* Type and BL */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{container.type}</span>
        <span className="font-mono text-xs">BL: {container.bl}</span>
      </div>

      {/* Occupation */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-gray-600">Ocupacao</span>
          <span className="text-sm font-semibold text-gray-900">{container.occupation.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-500', occupationColor)}
            style={{ width: `${container.occupation}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1.5">
          <Package size={16} className="text-gray-400" />
          <span>{container.items.length} SKUs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Box size={16} className="text-gray-400" />
          <span>{container.usedVolume.toFixed(1)} m³</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Scale size={16} className="text-gray-400" />
          <span>{(container.totalWeight / 1000).toFixed(1)}t</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-400">
          Desde {container.since.toLocaleDateString('pt-BR')}
        </span>
        <span className="text-base font-semibold text-emerald-600">
          R$ {container.monthlyPrice.toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  )
}

// Modal de visualizacao de itens
interface ItemsModalProps {
  isOpen: boolean
  onClose: () => void
  container: Container | null
}

function ItemsModal({ isOpen, onClose, container }: ItemsModalProps) {
  if (!container) return null

  return (
    <div className={clsx(
      'fixed inset-0 z-50 overflow-y-auto',
      isOpen ? 'block' : 'hidden'
    )}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Itens do Conteiner {container.code}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {container.items.length} SKUs cadastrados
            </p>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {container.items.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-3 font-semibold text-gray-600">SKU</th>
                    <th className="text-left pb-3 font-semibold text-gray-600">Descricao</th>
                    <th className="text-right pb-3 font-semibold text-gray-600">Qtd</th>
                    <th className="text-right pb-3 font-semibold text-gray-600">Disponivel</th>
                    <th className="text-right pb-3 font-semibold text-gray-600">Peso</th>
                    <th className="text-right pb-3 font-semibold text-gray-600">Volume</th>
                    <th className="text-left pb-3 font-semibold text-gray-600">Local</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {container.items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 font-mono text-brand-600">{item.sku}</td>
                      <td className="py-3 text-gray-600 max-w-[200px] truncate">
                        {item.descriptionPt || item.description}
                      </td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">
                        <span className={clsx(
                          'font-medium',
                          item.currentQuantity < item.quantity ? 'text-orange-600' : 'text-emerald-600'
                        )}>
                          {item.currentQuantity}
                        </span>
                      </td>
                      <td className="py-3 text-right">{item.totalWeight} kg</td>
                      <td className="py-3 text-right">{item.totalVolume.toFixed(2)} m³</td>
                      <td className="py-3 text-gray-500">{item.location || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Package size={48} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum item cadastrado</p>
                <p className="text-sm mt-1">Use o upload de packing list para adicionar itens</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-100 flex justify-end">
            <button onClick={onClose} className="btn btn-secondary">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Containers() {
  const { containers, deleteContainer } = useData()

  const [showContainerModal, setShowContainerModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null)
  const [containerToDelete, setContainerToDelete] = useState<Container | null>(null)

  // Filtros
  const [statusFilter, setStatusFilter] = useState<ContainerStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar conteineres
  const filteredContainers = containers.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (searchTerm && !c.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !c.bl.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleEdit = (container: Container) => {
    setSelectedContainer(container)
    setShowContainerModal(true)
  }

  const handleDelete = (container: Container) => {
    setContainerToDelete(container)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (containerToDelete) {
      deleteContainer(containerToDelete.id)
      setContainerToDelete(null)
    }
  }

  const handleViewItems = (container: Container) => {
    setSelectedContainer(container)
    setShowItemsModal(true)
  }

  const handlePrintLabel = (container: Container) => {
    setSelectedContainer(container)
    setShowLabelModal(true)
  }

  // Stats calculados
  const totalContainers = containers.length
  const avgOccupation = containers.length > 0
    ? containers.reduce((sum, c) => sum + c.occupation, 0) / containers.length
    : 0
  const totalVolume = containers.reduce((sum, c) => sum + c.usedVolume, 0)
  const monthlyRevenue = containers.reduce((sum, c) => sum + c.monthlyPrice, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Conteineres</h1>
          <p className="text-gray-500 mt-1">Gerencie seus conteineres e ocupacao</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-secondary"
          >
            <Upload size={20} />
            <span>Upload Packing List</span>
          </button>
          <button
            onClick={() => {
              setSelectedContainer(null)
              setShowContainerModal(true)
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            <span>Novo Conteiner</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por codigo, cliente ou BL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input max-w-md"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContainerStatus | 'all')}
          className="input max-w-[180px]"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="partial">Parciais</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total de Conteineres</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{totalContainers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Ocupacao Media</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{avgOccupation.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Volume Total</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{totalVolume.toFixed(1)} m³</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Receita Mensal</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            R$ {monthlyRevenue.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Containers Grid */}
      {filteredContainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredContainers.map(container => (
            <ContainerCard
              key={container.id}
              container={container}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewItems={handleViewItems}
              onPrintLabel={handlePrintLabel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum conteiner encontrado</p>
          {searchTerm || statusFilter !== 'all' ? (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
            >
              Limpar filtros
            </button>
          ) : (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 btn btn-primary"
            >
              <Upload size={18} />
              Importar Packing List
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ContainerModal
        isOpen={showContainerModal}
        onClose={() => { setShowContainerModal(false); setSelectedContainer(null); }}
        container={selectedContainer}
      />

      <PackingListUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <LabelModal
        isOpen={showLabelModal}
        onClose={() => { setShowLabelModal(false); setSelectedContainer(null); }}
      />

      <ItemsModal
        isOpen={showItemsModal}
        onClose={() => { setShowItemsModal(false); setSelectedContainer(null); }}
        container={selectedContainer}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setContainerToDelete(null); }}
        onConfirm={confirmDelete}
        title="Excluir Conteiner"
        message={`Tem certeza que deseja excluir o conteiner ${containerToDelete?.code}? Esta acao nao pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
