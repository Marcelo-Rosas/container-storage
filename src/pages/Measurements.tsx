import { Plus, Ruler, Box, Scale } from 'lucide-react'

const measurements = [
  { id: 1, container: 'CMAU3754293', date: '07/12/2024', length: 120, width: 80, height: 100, weight: 450, volume: 0.96 },
  { id: 2, container: 'MSKU8847621', date: '06/12/2024', length: 150, width: 100, height: 120, weight: 680, volume: 1.8 },
  { id: 3, container: 'TCKU9912345', date: '05/12/2024', length: 200, width: 120, height: 150, weight: 1200, volume: 3.6 },
  { id: 4, container: 'HLXU7789012', date: '04/12/2024', length: 80, width: 60, height: 50, weight: 120, volume: 0.24 },
]

export function Measurements() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Medições</h1>
          <p className="text-gray-500 mt-1">Registro de medições de produtos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          <span>Nova Medição</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {measurements.map(m => (
          <div key={m.id} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">{m.container}</span>
              <span className="text-sm text-gray-400">{m.date}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500">
                  <Ruler size={16} />
                  <span className="text-sm">Dimensões</span>
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
                <span className="text-sm font-semibold text-brand-700">{m.volume} m³</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
