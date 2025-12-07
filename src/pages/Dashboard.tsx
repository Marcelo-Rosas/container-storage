import { useNavigate } from 'react-router-dom'
import { Container, Package, Users, DollarSign, ArrowUpRight, ArrowDownRight, ArrowRight, ArrowLeft, Ruler, Upload } from 'lucide-react'
import clsx from 'clsx'
import { useData } from '../contexts/DataContext'

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  onClick?: () => void
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor, onClick }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-100 p-5',
        onClick && 'cursor-pointer hover:border-brand-200 transition-colors'
      )}
      onClick={onClick}
    >
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

export function Dashboard() {
  const navigate = useNavigate()
  const { containers, events, getStats, clients } = useData()
  const stats = getStats()

  // Calcular variacoes (simuladas)
  const statsData = [
    {
      title: 'Conteineres Ativos',
      value: String(stats.activeContainers),
      change: 8.2,
      icon: Container,
      iconBg: 'bg-brand-50',
      iconColor: 'text-brand-600',
      onClick: () => navigate('/containers'),
    },
    {
      title: 'SKUs Armazenados',
      value: stats.totalSkus.toLocaleString('pt-BR'),
      change: 12.5,
      icon: Package,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/containers'),
    },
    {
      title: 'Clientes Ativos',
      value: String(clients.length),
      change: 5.1,
      icon: Users,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}`,
      change: stats.monthlyRevenue > 10000 ? 2.4 : -2.4,
      icon: DollarSign,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      onClick: () => navigate('/billing'),
    },
  ]

  // Ultimos 5 eventos
  const recentEvents = events.slice(0, 5)

  // Ultimos conteineres
  const recentContainers = containers.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Visao geral do seu armazem</p>
        </div>
        <button
          onClick={() => navigate('/containers')}
          className="btn btn-primary"
        >
          <Upload size={20} />
          Upload Packing List
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupation Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Ocupacao por Conteiner</h2>
          </div>
          <div className="space-y-4">
            {recentContainers.map(container => (
              <div key={container.id} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <span className="font-mono text-sm text-gray-900">{container.code}</span>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all',
                        container.occupation >= 80 ? 'bg-emerald-500' :
                        container.occupation >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      )}
                      style={{ width: `${container.occupation}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-gray-900">{container.occupation.toFixed(1)}%</span>
                </div>
              </div>
            ))}
            {recentContainers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Container size={32} className="mx-auto mb-2 opacity-50" />
                <p>Nenhum conteiner cadastrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Rapido</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Volume Total Ocupado</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">{stats.totalVolume.toFixed(1)} m³</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${Math.min((stats.totalVolume / 300) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {((stats.totalVolume / 300) * 100).toFixed(0)}% da capacidade estimada
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Peso Total</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {(stats.totalWeight / 1000).toFixed(1)} toneladas
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Proximo Faturamento</p>
              <p className="text-xl font-semibold text-emerald-600 mt-1">
                R$ {stats.pendingInvoices.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400 mt-1">Vencimento em 25/12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Movimentacoes Recentes</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Tipo
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Conteiner
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Cliente
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Data
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                  Itens
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className={clsx(
                        'badge inline-flex items-center gap-1',
                        event.type === 'entry' && 'badge-active',
                        event.type === 'exit' && 'badge-partial',
                        event.type === 'measurement' && 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20'
                      )}>
                        {event.type === 'entry' && <ArrowRight size={12} />}
                        {event.type === 'exit' && <ArrowLeft size={12} />}
                        {event.type === 'measurement' && <Ruler size={12} />}
                        {event.type === 'entry' && 'Entrada'}
                        {event.type === 'exit' && 'Saida'}
                        {event.type === 'measurement' && 'Medicao'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-gray-900 font-mono">{event.containerCode}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{event.clientName}</td>
                    <td className="py-3 text-sm text-gray-500">
                      {event.date.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {event.items.length > 0 ? `${event.items.reduce((sum, i) => sum + i.quantity, 0)} un.` : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Nenhuma movimentacao registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
