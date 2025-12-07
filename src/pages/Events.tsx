import { useState } from 'react'
import { Plus, Calendar, ArrowRight, ArrowLeft, Ruler, Search } from 'lucide-react'
import clsx from 'clsx'
import { useData } from '../contexts/DataContext'
import { EventModal } from '../components/Modals'
import type { EventType } from '../types'

const eventTypeConfig = {
  entry: { label: 'Entrada', icon: ArrowRight, className: 'bg-emerald-50 text-emerald-700' },
  exit: { label: 'Saida', icon: ArrowLeft, className: 'bg-orange-50 text-orange-700' },
  measurement: { label: 'Medicao', icon: Ruler, className: 'bg-brand-50 text-brand-700' },
}

export function Events() {
  const { events } = useData()

  const [showEventModal, setShowEventModal] = useState(false)
  const [defaultEventType, setDefaultEventType] = useState<EventType>('entry')

  // Filtros
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    if (typeFilter !== 'all' && event.type !== typeFilter) return false
    if (searchTerm && !event.containerCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.clientName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (dateFilter) {
      const eventDate = event.date.toISOString().split('T')[0]
      if (eventDate !== dateFilter) return false
    }
    return true
  })

  const handleNewEvent = (type: EventType) => {
    setDefaultEventType(type)
    setShowEventModal(true)
  }

  // Stats
  const todayEvents = events.filter(e =>
    e.date.toDateString() === new Date().toDateString()
  ).length

  const entriesCount = events.filter(e => e.type === 'entry').length
  const exitsCount = events.filter(e => e.type === 'exit').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Eventos</h1>
          <p className="text-gray-500 mt-1">Historico de movimentacoes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleNewEvent('entry')}
            className="btn bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <ArrowRight size={20} />
            <span>Nova Entrada</span>
          </button>
          <button
            onClick={() => handleNewEvent('exit')}
            className="btn bg-orange-500 text-white hover:bg-orange-600"
          >
            <ArrowLeft size={20} />
            <span>Nova Saida</span>
          </button>
          <button
            onClick={() => handleNewEvent('measurement')}
            className="btn btn-primary"
          >
            <Plus size={20} />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Eventos Hoje</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{todayEvents}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total de Eventos</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{events.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Entradas</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{entriesCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Saidas</p>
          <p className="text-2xl font-semibold text-orange-600 mt-1">{exitsCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por conteiner ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}
          className="input max-w-[180px]"
        >
          <option value="all">Todos os tipos</option>
          <option value="entry">Entradas</option>
          <option value="exit">Saidas</option>
          <option value="measurement">Medicoes</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input max-w-[180px]"
        />
        {(typeFilter !== 'all' || searchTerm || dateFilter) && (
          <button
            onClick={() => { setTypeFilter('all'); setSearchTerm(''); setDateFilter(''); }}
            className="btn btn-secondary"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Conteiner</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Data</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Hora</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Itens</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Observacoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => {
                  const config = eventTypeConfig[event.type]
                  const Icon = config.icon
                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={clsx(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                          config.className
                        )}>
                          <Icon size={16} />
                          {config.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 font-mono">{event.containerCode}</td>
                      <td className="px-6 py-4 text-gray-500">{event.clientName}</td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {event.date.toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {event.items.length > 0 ? (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-sm">
                            {event.items.reduce((sum, i) => sum + i.quantity, 0)} un.
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                        {event.notes || '-'}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Nenhum evento encontrado</p>
                    {(typeFilter !== 'all' || searchTerm || dateFilter) && (
                      <button
                        onClick={() => { setTypeFilter('all'); setSearchTerm(''); setDateFilter(''); }}
                        className="mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        defaultType={defaultEventType}
      />
    </div>
  )
}
