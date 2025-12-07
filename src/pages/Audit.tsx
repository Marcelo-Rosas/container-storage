import { FileText, User, Clock, Filter } from 'lucide-react'

const auditLogs = [
  { id: 1, action: 'Criou contêiner', user: 'Admin', target: 'CMAU3754293', date: '07/12/2024 09:30' },
  { id: 2, action: 'Registrou entrada', user: 'Admin', target: 'MSKU8847621', date: '07/12/2024 14:15' },
  { id: 3, action: 'Atualizou medição', user: 'Admin', target: 'TCKU9912345', date: '06/12/2024 11:00' },
  { id: 4, action: 'Gerou fatura', user: 'Sistema', target: 'FAT-2024-003', date: '06/12/2024 00:01' },
  { id: 5, action: 'Registrou saída', user: 'Admin', target: 'HLXU7789012', date: '05/12/2024 16:45' },
]

export function Audit() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Auditoria</h1>
          <p className="text-gray-500 mt-1">Histórico de ações do sistema</p>
        </div>
        <button className="btn btn-secondary">
          <Filter size={20} />
          <span>Filtrar</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Ação</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Usuário</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Alvo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-500">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-600">{log.target}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={16} className="text-gray-400" />
                      {log.date}
                    </div>
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
