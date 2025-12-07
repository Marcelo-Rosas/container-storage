import { useState } from 'react'
import { Plus, Search, Ruler } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Measurements() {
  const { measurements, containers, addMeasurement } = useData()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ containerId: '', sku: '', length: '', width: '', height: '', weight: '', notes: '' })

  const filtered = measurements.filter(m => {
    if (search && !m.sku.toLowerCase().includes(search.toLowerCase()) && !m.containerCode.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selectedContainer = containers.find(c => c.id === form.containerId)

  const handleSubmit = (e) => {
    e.preventDefault()
    const container = containers.find(c => c.id === form.containerId)
    if (!container) return

    addMeasurement({
      containerId: container.id,
      containerCode: container.code,
      sku: form.sku,
      date: new Date(),
      length: Number(form.length),
      width: Number(form.width),
      height: Number(form.height),
      weight: Number(form.weight),
      measuredBy: 'Admin',
      notes: form.notes,
    })

    setShowModal(false)
    setForm({ containerId: '', sku: '', length: '', width: '', height: '', weight: '', notes: '' })
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Search size={14} color="#64748b" />
          <input type="text" placeholder="Buscar por SKU ou container..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-sm" style={{ maxWidth: '250px' }} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={14} /> Nova Medicao</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box"><div className="label">Total Medicoes</div><div className="value">{measurements.length}</div></div>
        <div className="stat-box"><div className="label">SKUs Medidos</div><div className="value">{new Set(measurements.map(m => m.sku)).size}</div></div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table-erp">
          <thead>
            <tr>
              <th>Data</th>
              <th>Container</th>
              <th>SKU</th>
              <th>Comprimento</th>
              <th>Largura</th>
              <th>Altura</th>
              <th>Volume</th>
              <th>Peso</th>
              <th>Medido Por</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const volume = ((m.length * m.width * m.height) / 1000000).toFixed(3)
              return (
                <tr key={m.id}>
                  <td>{new Date(m.date).toLocaleDateString('pt-BR')}</td>
                  <td style={{ fontFamily: 'monospace' }}>{m.containerCode}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 500, color: '#3b82f6' }}>{m.sku}</td>
                  <td>{m.length} cm</td>
                  <td>{m.width} cm</td>
                  <td>{m.height} cm</td>
                  <td>{volume} m³</td>
                  <td>{m.weight} kg</td>
                  <td>{m.measuredBy}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhuma medicao encontrada</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="modal-header">Nova Medicao</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Container *</label>
                  <select className="input" value={form.containerId} onChange={e => setForm({ ...form, containerId: e.target.value, sku: '' })} required>
                    <option value="">Selecione...</option>
                    {containers.filter(c => c.items.length > 0).map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Item/SKU *</label>
                  <select className="input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required disabled={!form.containerId}>
                    <option value="">Selecione...</option>
                    {selectedContainer?.items.map(i => <option key={i.id} value={i.sku}>{i.sku} - {i.description}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Compr. (cm)</label><input type="number" className="input" value={form.length} onChange={e => setForm({ ...form, length: e.target.value })} required /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Largura (cm)</label><input type="number" className="input" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} required /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Altura (cm)</label><input type="number" className="input" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required /></div>
                </div>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Peso (kg)</label><input type="number" className="input" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Observacoes</label><textarea className="input" rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
