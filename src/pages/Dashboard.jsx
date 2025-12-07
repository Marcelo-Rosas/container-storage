import { useNavigate } from 'react-router-dom'
import { Package, Box, DollarSign, AlertTriangle, ArrowRight, ArrowLeft, Clock } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Dashboard() {
  const navigate = useNavigate()
  const { containers, events, invoices, getStats } = useData()
  const stats = getStats()

  const recentEvents = events.slice(0, 8)
  const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue')

  return (
    <div>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Dashboard Operacional</h1>
        <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box" onClick={() => navigate('/containers')} style={{ cursor: 'pointer' }}>
          <div className="label">Conteineres Ativos</div>
          <div className="value">{stats.activeContainers}</div>
        </div>
        <div className="stat-box">
          <div className="label">Total SKUs</div>
          <div className="value">{stats.totalSkus}</div>
        </div>
        <div className="stat-box">
          <div className="label">Volume Ocupado</div>
          <div className="value">{stats.totalVolume.toFixed(1)} m³</div>
        </div>
        <div className="stat-box">
          <div className="label">Receita Mensal</div>
          <div className="value success">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</div>
        </div>
        <div className="stat-box" onClick={() => navigate('/billing')} style={{ cursor: 'pointer' }}>
          <div className="label">A Receber</div>
          <div className="value warning">R$ {stats.pendingInvoices.toLocaleString('pt-BR')}</div>
        </div>
        <div className="stat-box" onClick={() => navigate('/billing')} style={{ cursor: 'pointer' }}>
          <div className="label">Em Atraso</div>
          <div className="value danger">R$ {stats.overdueInvoices.toLocaleString('pt-BR')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Containers */}
        <div className="card">
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>Conteineres</span>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/containers')}>Ver todos</button>
          </div>
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            <table className="table-erp">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Cliente</th>
                  <th>Ocupacao</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {containers.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{c.code}</td>
                    <td>{c.clientName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '50px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                          <div style={{
                            width: `${c.occupation}%`,
                            height: '100%',
                            background: c.occupation > 80 ? '#22c55e' : c.occupation > 40 ? '#f59e0b' : '#ef4444',
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span>{c.occupation.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>Movimentacoes Recentes</span>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/events')}>Ver todas</button>
          </div>
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            <table className="table-erp">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Container</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(e => (
                  <tr key={e.id}>
                    <td>{new Date(e.date).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {e.type === 'entry' && <ArrowRight size={12} color="#22c55e" />}
                        {e.type === 'exit' && <ArrowLeft size={12} color="#ef4444" />}
                        {e.type === 'measurement' && <Clock size={12} color="#3b82f6" />}
                        {e.type === 'entry' ? 'Entrada' : e.type === 'exit' ? 'Saida' : 'Medicao'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{e.containerCode}</td>
                    <td>{e.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>
              <AlertTriangle size={14} style={{ marginRight: '6px', color: '#f59e0b' }} />
              Faturas Pendentes ({pendingInvoices.length})
            </span>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/billing')}>Ver todas</button>
          </div>
          {pendingInvoices.length > 0 ? (
            <table className="table-erp">
              <thead>
                <tr>
                  <th>Fatura</th>
                  <th>Cliente</th>
                  <th>Periodo</th>
                  <th>Vencimento</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 500 }}>{inv.id}</td>
                    <td>{inv.clientName}</td>
                    <td>{inv.period}</td>
                    <td>{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td style={{ fontWeight: 600 }}>R$ {inv.totalAmount.toLocaleString('pt-BR')}</td>
                    <td><span className={`badge badge-${inv.status}`}>{inv.status === 'pending' ? 'Pendente' : 'Vencido'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Nenhuma fatura pendente
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
