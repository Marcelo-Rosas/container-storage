import { useState } from 'react'
import { Plus, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Billing() {
  const { invoices, containers, clients, addInvoice, updateInvoice } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ clientName: '', period: '', containers: [], storageAmount: 0, handlingAmount: 0, additionalAmount: 0, dueDate: '' })

  const filtered = invoices.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    if (search && !i.id.toLowerCase().includes(search.toLowerCase()) && !i.clientName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.totalAmount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0)

  const handleMarkAsPaid = (id) => updateInvoice(id, { status: 'paid', paidDate: new Date() })

  const handleDownload = (invoice) => {
    const content = `VECTRA STORAGE - FATURA\n${'='.repeat(40)}\nNumero: ${invoice.id}\nCliente: ${invoice.clientName}\nPeriodo: ${invoice.period}\nVencimento: ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}\n\nArmazenagem: R$ ${invoice.storageAmount.toFixed(2)}\nManuseio: R$ ${invoice.handlingAmount.toFixed(2)}\nAdicionais: R$ ${invoice.additionalAmount.toFixed(2)}\n\nTOTAL: R$ ${invoice.totalAmount.toFixed(2)}\n\nStatus: ${invoice.status === 'paid' ? 'PAGO' : invoice.status === 'pending' ? 'PENDENTE' : 'VENCIDO'}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.id}.txt`
    a.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const total = form.storageAmount + form.handlingAmount + form.additionalAmount
    addInvoice({
      clientId: '',
      clientName: form.clientName,
      period: form.period,
      dueDate: new Date(form.dueDate),
      status: 'pending',
      storageAmount: form.storageAmount,
      handlingAmount: form.handlingAmount,
      additionalAmount: form.additionalAmount,
      totalAmount: total,
      containers: form.containers,
    })
    setShowModal(false)
    setForm({ clientName: '', period: '', containers: [], storageAmount: 0, handlingAmount: 0, additionalAmount: 0, dueDate: '' })
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Search size={14} color="#64748b" />
          <input type="text" placeholder="Buscar fatura ou cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-sm" style={{ maxWidth: '200px' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input input-sm" style={{ width: '120px' }}>
          <option value="all">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagas</option>
          <option value="overdue">Vencidas</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Nova Fatura</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box"><div className="label">Total Faturas</div><div className="value">{invoices.length}</div></div>
        <div className="stat-box"><div className="label">Pendente</div><div className="value warning">R$ {totalPending.toLocaleString('pt-BR')}</div></div>
        <div className="stat-box"><div className="label">Vencido</div><div className="value danger">R$ {totalOverdue.toLocaleString('pt-BR')}</div></div>
        <div className="stat-box"><div className="label">Recebido</div><div className="value success">R$ {totalPaid.toLocaleString('pt-BR')}</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table-erp">
          <thead>
            <tr>
              <th>Fatura</th>
              <th>Cliente</th>
              <th>Periodo</th>
              <th>Vencimento</th>
              <th>Armazenagem</th>
              <th>Manuseio</th>
              <th>Adicional</th>
              <th>Total</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.id}</td>
                <td>{inv.clientName}</td>
                <td>{inv.period}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</td>
                <td>R$ {inv.storageAmount.toLocaleString('pt-BR')}</td>
                <td>R$ {inv.handlingAmount.toLocaleString('pt-BR')}</td>
                <td>R$ {inv.additionalAmount.toLocaleString('pt-BR')}</td>
                <td style={{ fontWeight: 700 }}>R$ {inv.totalAmount.toLocaleString('pt-BR')}</td>
                <td>
                  <span className={`badge badge-${inv.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {inv.status === 'paid' && <CheckCircle size={10} />}
                    {inv.status === 'pending' && <Clock size={10} />}
                    {inv.status === 'overdue' && <AlertCircle size={10} />}
                    {inv.status === 'paid' ? 'Pago' : inv.status === 'pending' ? 'Pendente' : 'Vencido'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {inv.status !== 'paid' && (
                      <button className="btn btn-sm btn-success" title="Marcar Pago" onClick={() => handleMarkAsPaid(inv.id)}><CheckCircle size={12} /></button>
                    )}
                    <button className="btn btn-sm btn-secondary" title="Download" onClick={() => handleDownload(inv)}><Download size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhuma fatura encontrada</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="modal-header">Nova Fatura</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Cliente *</label>
                  <select className="input" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} required>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Periodo *</label><input type="text" className="input" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="Nov/2024" required /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Vencimento *</label><input type="date" className="input" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Armazenagem</label><input type="number" className="input" value={form.storageAmount} onChange={e => setForm({ ...form, storageAmount: Number(e.target.value) })} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Manuseio</label><input type="number" className="input" value={form.handlingAmount} onChange={e => setForm({ ...form, handlingAmount: Number(e.target.value) })} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Adicional</label><input type="number" className="input" value={form.additionalAmount} onChange={e => setForm({ ...form, additionalAmount: Number(e.target.value) })} /></div>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '4px', textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Total: </span>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>R$ {(form.storageAmount + form.handlingAmount + form.additionalAmount).toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Criar Fatura</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
