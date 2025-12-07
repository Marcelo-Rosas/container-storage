import { Container, Package, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className={clsx('p-2.5 rounded-lg', iconBg)}>
          <Icon size={22} className={iconColor} />
        </div>
        <div className={clsx(
          'flex items-center gap-0.5 text-sm font-medium',
          isPositive ? 'text-emerald-600' : 'text-red-500'
        )}>
          {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

const recentContainers = [
  { code: 'CMAU3754293', client: 'KONNEN COMERCIO', occupation: 45.5, status: 'entry' },
  { code: 'MSKU8847621', client: 'FITNESS IMPORTS', occupation: 47.1, status: 'exit' },
  { code: 'TCKU9912345', client: 'GYM EQUIPMENT', occupation: 20.5, status: 'entry' },
  { code: 'HLXU7789012', client: 'ACADEMIA POWER', occupation: 85.8, status: 'measurement' },
]

export function Dashboard() {
  const stats = [
    {
      title: 'Contêineres Ativos',
      value: '12',
      change: 8.2,
      icon: Container,
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-600'
    },
    {
      title: 'SKUs Armazenados',
      value: '1,247',
      change: 12.5,
      icon: Package,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Clientes Ativos',
      value: '34',
      change: 5.1,
      icon: Users,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.231',
      change: -2.4,
      icon: DollarSign,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu armazém</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupation Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Ocupação por Contêiner</h2>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <TrendingUp size={40} className="mx-auto mb-2 text-gray-300" />
              <p>Gráfico de ocupação</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Rápido</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Volume Total Ocupado</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">342.8 m³</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '68%' }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">68% da capacidade total</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Peso Total</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">89.4 toneladas</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Próximo Faturamento</p>
              <p className="text-xl font-semibold text-emerald-600 mt-1">R$ 32.450,00</p>
              <p className="text-xs text-gray-400 mt-1">Vencimento em 25/12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Movimentações Recentes</h2>
          <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Contêiner
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Cliente
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Ocupação
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentContainers.map((container) => (
                <tr key={container.code} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <span className="font-medium text-gray-900">{container.code}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{container.client}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            container.occupation >= 80 ? 'bg-emerald-500' :
                            container.occupation >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${container.occupation}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{container.occupation}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={clsx(
                      'badge',
                      container.status === 'entry' && 'badge-active',
                      container.status === 'exit' && 'badge-partial',
                      container.status === 'measurement' && 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20'
                    )}>
                      {container.status === 'entry' && 'Entrada'}
                      {container.status === 'exit' && 'Saída'}
                      {container.status === 'measurement' && 'Medição'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
