import { Plus, Package, Scale, Box } from 'lucide-react'
import clsx from 'clsx'

type ContainerStatus = 'active' | 'partial' | 'inactive'

interface ContainerData {
  id: string
  code: string
  status: ContainerStatus
  client: string
  type: string
  bl: string
  occupation: number
  skus: number
  volume: number
  weight: number
  since: string
  price: number
}

const containers: ContainerData[] = [
  {
    id: '1',
    code: 'CMAU3754293',
    status: 'active',
    client: 'KONNEN COMERCIO DE FERRAMENTAS LTDA',
    type: "Dry Box 40' HC",
    bl: '06BRZ2311002',
    occupation: 45.5,
    skus: 8,
    volume: 34.7,
    weight: 6.2,
    since: '17/12/23',
    price: 3200,
  },
  {
    id: '2',
    code: 'MSKU8847621',
    status: 'partial',
    client: 'FITNESS IMPORTS BR LTDA',
    type: "Dry Box 40'",
    bl: '06BRZ2311015',
    occupation: 47.1,
    skus: 4,
    volume: 31.9,
    weight: 5.1,
    since: '21/11/23',
    price: 2800,
  },
  {
    id: '3',
    code: 'TCKU9912345',
    status: 'active',
    client: 'GYM EQUIPMENT BRASIL S.A.',
    type: "Dry Box 40' HC",
    bl: '06BRZ2311028',
    occupation: 20.5,
    skus: 3,
    volume: 15.7,
    weight: 5.2,
    since: '07/10/23',
    price: 3200,
  },
  {
    id: '4',
    code: 'HLXU7789012',
    status: 'active',
    client: 'ACADEMIA POWER LTDA',
    type: "Dry Box 20'",
    bl: '06BRZ2311035',
    occupation: 85.8,
    skus: 0,
    volume: 28.5,
    weight: 24.0,
    since: '02/12/23',
    price: 1800,
  },
]

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

function ContainerCard({ container }: { container: ContainerData }) {
  const status = statusConfig[container.status]
  const occupationColor = getOccupationColor(container.occupation)

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{container.code}</h3>
            <span className={clsx('badge', status.className)}>{status.label}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{container.client}</p>
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
          <span className="text-sm text-gray-600">Ocupação</span>
          <span className="text-sm font-semibold text-gray-900">{container.occupation}%</span>
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
          <span>{container.skus} SKUs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Box size={16} className="text-gray-400" />
          <span>{container.volume} m³</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Scale size={16} className="text-gray-400" />
          <span>{container.weight}t</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-400">Desde {container.since}</span>
        <span className="text-base font-semibold text-emerald-600">
          R$ {container.price.toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  )
}

export function Containers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contêineres</h1>
          <p className="text-gray-500 mt-1">Gerencie seus contêineres e ocupação</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          <span>Novo Contêiner</span>
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total de Contêineres</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">4</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Ocupação Média</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">49.7%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Volume Total</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">110.8 m³</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Receita Mensal</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">R$ 11.000</p>
        </div>
      </div>

      {/* Containers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {containers.map(container => (
          <ContainerCard key={container.id} container={container} />
        ))}
      </div>
    </div>
  )
}
