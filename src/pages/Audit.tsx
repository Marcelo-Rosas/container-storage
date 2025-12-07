import { useState } from 'react'
import { FileText, User, Clock, Search, Download } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Audit() {
  const { auditLogs } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('all')

  // Filtrar logs
  const filteredLogs = auditLogs.filter(log => {
    if (entityFilter !== 'all' && log.entityType !== entityFilter) return false
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.user.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Exportar logs
  const handleExport = () => {
    const lines = [
      'LOGS DE AUDITORIA',
      `Exportado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      'DATA;HORA;ACAO;USUARIO;ENTIDADE;ALVO',
    ]
    filteredLogs.forEach(log => {
      lines.push(`${log.timestamp.toLocaleDateString('pt-BR')};${log.timestamp.toLocaleTimeString('pt-BR')};${log.action};${log.user};${log.entityType};${log.entityName}`)
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Auditoria</h1>
          <p className="text-gray-500 mt-1">Historico de acoes do sistema</p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download size={20} />
          <span>Exportar</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por acao, usuario ou alvo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="input max-w-[180px]"
        >
          <option value="all">Todas as entidades</option>
          <option value="container">Conteineres</option>
          <option value="event">Eventos</option>
          <option value="measurement">Medicoes</option>
          <option value="invoice">Faturas</option>
          <option value="item">Itens</option>
          <option value="client">Clientes</option>
          <option value="label">Etiquetas</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total de Logs</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{auditLogs.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {auditLogs.filter(l => l.timestamp.toDateString() === new Date().toDateString()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Usuarios Ativos</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {new Set(auditLogs.map(l => l.user)).size}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Filtrados</p>
          <p className="text-2xl font-semibold text-brand-600 mt-1">{filteredLogs.length}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Acao</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Usuario</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Alvo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
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
                    <td className="px-6 py-4">
                      <span className="badge bg-gray-100 text-gray-600">{log.entityType}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-600 font-mono">{log.entityName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} className="text-gray-400" />
                        {log.timestamp.toLocaleDateString('pt-BR')} {log.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Nenhum log encontrado</p>
                    {(entityFilter !== 'all' || searchTerm) && (
                      <button
                        onClick={() => { setEntityFilter('all'); setSearchTerm(''); }}
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
    </div>
  )
}
