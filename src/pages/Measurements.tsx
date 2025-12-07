import { useState } from 'react'
import { Plus, Ruler, Box, Scale, Search } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { MeasurementModal } from '../components/Modals'

export function Measurements() {
  const { measurements } = useData()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar medicoes
  const filteredMeasurements = measurements.filter(m => {
    if (searchTerm && !m.containerCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.sku.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Stats
  const totalMeasurements = measurements.length
  const avgVolume = measurements.length > 0
    ? measurements.reduce((sum, m) => sum + m.volume, 0) / measurements.length
    : 0
  const avgWeight = measurements.length > 0
    ? measurements.reduce((sum, m) => sum + m.weight, 0) / measurements.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Medicoes</h1>
          <p className="text-gray-500 mt-1">Registro de medicoes de produtos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Nova Medicao</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total de Medicoes</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{totalMeasurements}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Volume Medio</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{avgVolume.toFixed(2)} m³</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Peso Medio</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{avgWeight.toFixed(0)} kg</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Este Mes</p>
          <p className="text-2xl font-semibold text-brand-600 mt-1">
            {measurements.filter(m => {
              const now = new Date()
              return m.date.getMonth() === now.getMonth() && m.date.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por conteiner ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Measurements Grid */}
      {filteredMeasurements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredMeasurements.map(m => (
            <div key={m.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 font-mono">{m.containerCode}</span>
                <span className="text-sm text-gray-400">{m.date.toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-sm text-brand-600 font-medium mb-4">{m.sku}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Ruler size={16} />
                    <span className="text-sm">Dimensoes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {m.length} x {m.width} x {m.height} cm
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Scale size={16} />
                    <span className="text-sm">Peso</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{m.weight} kg</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                  <div className="flex items-center gap-2 text-brand-600">
                    <Box size={16} />
                    <span className="text-sm">Volume</span>
                  </div>
                  <span className="text-sm font-semibold text-brand-700">{m.volume.toFixed(3)} m³</span>
                </div>
              </div>

              {m.notes && (
                <p className="mt-3 text-xs text-gray-400 truncate">{m.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Ruler size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhuma medicao encontrada</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <MeasurementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}
