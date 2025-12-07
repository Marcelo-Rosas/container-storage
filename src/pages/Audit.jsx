import { useState } from 'react'
import { Search, Download, User, Clock, FileText } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Audit() {
  const { auditLogs } = useData()
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')

  const filtered = auditLogs.filter(log => {
    if (entityFilter !== 'all' && log.entityType !== entityFilter) return false
    if (search && !log.entityName.toLowerCase().includes(search.toLowerCase()) && !log.action.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const exportCSV = () => {
    const headers = ['Data/Hora', 'Acao', 'Tipo', 'Entidade', 'Usuario']
    const rows = filtered.map(log => [
      new Date(log.timestamp).toLocaleString('pt-BR'),
      log.action,
      log.entityType,
      log.entityName,
      log.user,
    ].join(';'))
    const csv = [headers.join(';'), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const entityTypes = ['container', 'event', 'invoice', 'measurement', 'client', 'label']

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Search size={14} color="#64748b" />
          <input type="text" placeholder="Buscar por acao ou entidade..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-sm" style={{ maxWidth: '250px' }} />
        </div>
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="input input-sm" style={{ width: '140px' }}>
          <option value="all">Todos os tipos</option>
          {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-success btn-sm" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box"><div className="label">Total de Logs</div><div className="value">{auditLogs.length}</div></div>
        <div className="stat-box"><div className="label">Containers</div><div className="value">{auditLogs.filter(l => l.entityType === 'container').length}</div></div>
        <div className="stat-box"><div className="label">Eventos</div><div className="value">{auditLogs.filter(l => l.entityType === 'event').length}</div></div>
        <div className="stat-box"><div className="label">Faturas</div><div className="value">{auditLogs.filter(l => l.entityType === 'invoice').length}</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table-erp">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Acao</th>
              <th>Tipo</th>
              <th>Entidade</th>
              <th>Usuario</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="#64748b" />
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </td>
                <td>{log.action}</td>
                <td>
                  <span className="badge badge-pending" style={{ textTransform: 'capitalize' }}>
                    {log.entityType}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{log.entityName}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} color="#64748b" />
                    {log.user}
                  </span>
                </td>
                <td style={{ fontSize: '10px', color: '#64748b' }}>
                  {log.details ? JSON.stringify(log.details) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhum log encontrado</div>}
      </div>
    </div>
  )
}
