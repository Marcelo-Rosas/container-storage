import { useState } from 'react'
import { Plus, Search, ArrowRight, ArrowLeft, Clock, X } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Events() {
  const { events, containers, addEvent } = useData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [eventType, setEventType] = useState('entry')

  const [form, setForm] = useState({ containerId: '', notes: '', items: [{ sku: '', quantity: 1 }] })

  const filtered = events.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    if (search && !e.containerCode.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selectedContainer = containers.find(c => c.id === form.containerId)

  const handleSubmit = (e) => {
    e.preventDefault()
    const container = containers.find(c => c.id === form.containerId)
    if (!container) return

    addEvent({
      type: eventType,
      containerId: container.id,
      containerCode: container.code,
      date: new Date(),
      items: form.items.filter(i => i.sku),
      notes: form.notes,
      createdBy: 'Admin',
    })

    setShowModal(false)
    setForm({ containerId: '', notes: '', items: [{ sku: '', quantity: 1 }] })
  }

  const addItemRow = () => setForm({ ...form, items: [...form.items, { sku: '', quantity: 1 }] })
  const updateItem = (index, field, value) => {
    const items = [...form.items]
    items[index][field] = field === 'quantity' ? Number(value) : value
    setForm({ ...form, items })
  }
  const removeItem = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) })

  const openModal = (type) => {
    setEventType(type)
    setForm({ containerId: '', notes: '', items: [{ sku: '', quantity: 1 }] })
    setShowModal(true)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Search size={14} color="#64748b" />
          <input type="text" placeholder="Buscar por container..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-sm" style={{ maxWidth: '200px' }} />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input input-sm" style={{ width: '120px' }}>
          <option value="all">Todos</option>
          <option value="entry">Entradas</option>
          <option value="exit">Saidas</option>
          <option value="measurement">Medicoes</option>
        </select>
        <button className="btn btn-success btn-sm" onClick={() => openModal('entry')}><ArrowRight size={14} /> Entrada</button>
        <button className="btn btn-danger btn-sm" onClick={() => openModal('exit')}><ArrowLeft size={14} /> Saida</button>
        <button className="btn btn-primary btn-sm" onClick={() => openModal('measurement')}><Clock size={14} /> Medicao</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box"><div className="label">Total</div><div className="value">{events.length}</div></div>
        <div className="stat-box"><div className="label">Entradas</div><div className="value success">{events.filter(e => e.type === 'entry').length}</div></div>
        <div className="stat-box"><div className="label">Saidas</div><div className="value danger">{events.filter(e => e.type === 'exit').length}</div></div>
        <div className="stat-box"><div className="label">Medicoes</div><div className="value">{events.filter(e => e.type === 'measurement').length}</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table-erp">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Container</th>
              <th>Itens</th>
              <th>Observacoes</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>{new Date(e.date).toLocaleString('pt-BR')}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {e.type === 'entry' && <ArrowRight size={12} color="#22c55e" />}
                    {e.type === 'exit' && <ArrowLeft size={12} color="#ef4444" />}
                    {e.type === 'measurement' && <Clock size={12} color="#3b82f6" />}
                    <span className={`badge badge-${e.type === 'entry' ? 'active' : e.type === 'exit' ? 'inactive' : 'pending'}`}>
                      {e.type === 'entry' ? 'Entrada' : e.type === 'exit' ? 'Saida' : 'Medicao'}
                    </span>
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{e.containerCode}</td>
                <td>{e.items?.length || 0} item(s)</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.notes || '-'}</td>
                <td>{e.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhum evento encontrado</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '500px' }}>
            <div className="modal-header">
              Registrar {eventType === 'entry' ? 'Entrada' : eventType === 'exit' ? 'Saida' : 'Medicao'}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Container *</label>
                  <select className="input" value={form.containerId} onChange={e => setForm({ ...form, containerId: e.target.value })} required>
                    <option value="">Selecione...</option>
                    {containers.map(c => <option key={c.id} value={c.id}>{c.code} - {c.clientName}</option>)}
                  </select>
                </div>

                {eventType !== 'measurement' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Itens</label>
                    {form.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <select className="input input-sm" value={item.sku} onChange={e => updateItem(index, 'sku', e.target.value)} style={{ flex: 2 }}>
                          <option value="">SKU...</option>
                          {selectedContainer?.items.map(i => <option key={i.id} value={i.sku}>{i.sku} ({i.currentQuantity} disp.)</option>)}
                        </select>
                        <input type="number" className="input input-sm" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} min="1" style={{ width: '70px' }} />
                        {form.items.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(index)}><X size={12} /></button>}
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-secondary" onClick={addItemRow}><Plus size={12} /> Adicionar Item</button>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Observacoes</label>
                  <textarea className="input" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={`btn ${eventType === 'entry' ? 'btn-success' : eventType === 'exit' ? 'btn-danger' : 'btn-primary'}`}>
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
