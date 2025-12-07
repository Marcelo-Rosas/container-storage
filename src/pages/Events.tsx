import { Plus, Calendar, ArrowRight, ArrowLeft, Package } from 'lucide-react'
import clsx from 'clsx'

const events = [
  { id: 1, type: 'entry', container: 'CMAU3754293', client: 'KONNEN COMERCIO', date: '07/12/2024', time: '09:30', items: 12 },
  { id: 2, type: 'exit', container: 'MSKU8847621', client: 'FITNESS IMPORTS', date: '07/12/2024', time: '14:15', items: 5 },
  { id: 3, type: 'entry', container: 'TCKU9912345', client: 'GYM EQUIPMENT', date: '06/12/2024', time: '11:00', items: 8 },
  { id: 4, type: 'measurement', container: 'HLXU7789012', client: 'ACADEMIA POWER', date: '06/12/2024', time: '16:45', items: 0 },
  { id: 5, type: 'exit', container: 'CMAU3754293', client: 'KONNEN COMERCIO', date: '05/12/2024', time: '10:20', items: 3 },
]

export function Events() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Eventos</h1>
          <p className="text-gray-500 mt-1">Histórico de movimentações</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Contêiner</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Data</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Hora</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Itens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={clsx(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                      event.type === 'entry' && 'bg-emerald-50 text-emerald-700',
                      event.type === 'exit' && 'bg-orange-50 text-orange-700',
                      event.type === 'measurement' && 'bg-brand-50 text-brand-700'
                    )}>
                      {event.type === 'entry' && <ArrowRight size={16} />}
                      {event.type === 'exit' && <ArrowLeft size={16} />}
                      {event.type === 'measurement' && <Package size={16} />}
                      {event.type === 'entry' && 'Entrada'}
                      {event.type === 'exit' && 'Saída'}
                      {event.type === 'measurement' && 'Medição'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{event.container}</td>
                  <td className="px-6 py-4 text-gray-500">{event.client}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {event.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{event.time}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{event.items > 0 ? event.items : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
