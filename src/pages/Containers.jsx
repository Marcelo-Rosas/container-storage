import { useState } from 'react'
import { Plus, Upload, Search, Eye, Edit2, Trash2, Tag, Download, X } from 'lucide-react'
import { useData } from '../contexts/DataContext'

// Container Types
const containerTypes = ["Dry Box 20'", "Dry Box 40'", "Dry Box 40' HC"]

export function Containers() {
  const { containers, clients, addContainer, updateContainer, deleteContainer, processPackingListUpload } = useData()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingContainer, setEditingContainer] = useState(null)

  // Form state
  const [form, setForm] = useState({ code: '', type: "Dry Box 40' HC", bl: '', clientName: '', monthlyPrice: 3200 })

  const filtered = containers.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search && !c.code.toLowerCase().includes(search.toLowerCase()) && !c.clientName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const containerCapacity = { "Dry Box 20'": 33.2, "Dry Box 40'": 67.7, "Dry Box 40' HC": 76.3 }

    if (editingContainer) {
      updateContainer(editingContainer.id, form)
    } else {
      addContainer({
        ...form,
        status: 'active',
        clientId: '',
        occupation: 0,
        totalVolume: containerCapacity[form.type] || 67.7,
        usedVolume: 0,
        totalWeight: 0,
        since: new Date(),
      })
    }
    setShowModal(false)
    setEditingContainer(null)
    setForm({ code: '', type: "Dry Box 40' HC", bl: '', clientName: '', monthlyPrice: 3200 })
  }

  const openEdit = (container) => {
    setEditingContainer(container)
    setForm({
      code: container.code,
      type: container.type,
      bl: container.bl,
      clientName: container.clientName,
      monthlyPrice: container.monthlyPrice,
    })
    setShowModal(true)
  }

  const openNew = () => {
    setEditingContainer(null)
    setForm({ code: '', type: "Dry Box 40' HC", bl: '', clientName: '', monthlyPrice: 3200 })
    setShowModal(true)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Search size={14} color="#64748b" />
          <input
            type="text"
            placeholder="Buscar por codigo ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm"
            style={{ maxWidth: '250px' }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input input-sm" style={{ width: '120px' }}>
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="partial">Parciais</option>
          <option value="inactive">Inativos</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowUploadModal(true)}>
          <Upload size={14} /> Upload CSV
        </button>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <Plus size={14} /> Novo Container
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="label">Total</div>
          <div className="value">{containers.length}</div>
        </div>
        <div className="stat-box">
          <div className="label">Ativos</div>
          <div className="value">{containers.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="stat-box">
          <div className="label">Volume Total</div>
          <div className="value">{containers.reduce((s, c) => s + c.usedVolume, 0).toFixed(1)} m³</div>
        </div>
        <div className="stat-box">
          <div className="label">Receita Mensal</div>
          <div className="value success">R$ {containers.reduce((s, c) => s + c.monthlyPrice, 0).toLocaleString('pt-BR')}</div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table-erp">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>BL</th>
              <th>Ocupacao</th>
              <th>Volume</th>
              <th>Peso</th>
              <th>SKUs</th>
              <th>Valor/Mes</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                <td>{c.clientName}</td>
                <td>{c.type}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '10px' }}>{c.bl}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '40px', height: '5px', background: '#e2e8f0', borderRadius: '2px' }}>
                      <div style={{ width: `${c.occupation}%`, height: '100%', background: c.occupation > 80 ? '#22c55e' : c.occupation > 40 ? '#f59e0b' : '#ef4444', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '11px' }}>{c.occupation.toFixed(0)}%</span>
                  </div>
                </td>
                <td>{c.usedVolume.toFixed(1)} m³</td>
                <td>{(c.totalWeight / 1000).toFixed(1)}t</td>
                <td>{c.items.length}</td>
                <td style={{ fontWeight: 600, color: '#22c55e' }}>R$ {c.monthlyPrice.toLocaleString('pt-BR')}</td>
                <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button className="btn btn-sm btn-secondary" title="Ver Itens" onClick={() => { setSelectedContainer(c); setShowItemsModal(true); }}>
                      <Eye size={12} />
                    </button>
                    <button className="btn btn-sm btn-secondary" title="Editar" onClick={() => openEdit(c)}>
                      <Edit2 size={12} />
                    </button>
                    <button className="btn btn-sm btn-danger" title="Excluir" onClick={() => { if (confirm('Excluir container?')) deleteContainer(c.id) }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhum container encontrado</div>
        )}
      </div>

      {/* Modal - New/Edit Container */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '450px' }}>
            <div className="modal-header">{editingContainer ? 'Editar Container' : 'Novo Container'}</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Codigo *</label>
                  <input type="text" className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="Ex: CMAU3754293" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Tipo *</label>
                    <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      {containerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>BL *</label>
                    <input type="text" className="input" value={form.bl} onChange={e => setForm({ ...form, bl: e.target.value.toUpperCase() })} required />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Cliente *</label>
                  <select className="input" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })}>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Valor Mensal (R$)</label>
                  <input type="number" className="input" value={form.monthlyPrice} onChange={e => setForm({ ...form, monthlyPrice: Number(e.target.value) })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingContainer ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Items */}
      {showItemsModal && selectedContainer && (
        <div className="modal-overlay" onClick={() => setShowItemsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '800px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Itens do Container {selectedContainer.code}</span>
              <button onClick={() => setShowItemsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '400px', overflow: 'auto', padding: 0 }}>
              {selectedContainer.items.length > 0 ? (
                <table className="table-erp">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Descricao</th>
                      <th>Qtd</th>
                      <th>Disponivel</th>
                      <th>Peso</th>
                      <th>Volume</th>
                      <th>Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedContainer.items.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 500, color: '#3b82f6' }}>{item.sku}</td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td style={{ color: item.currentQuantity < item.quantity ? '#f59e0b' : '#22c55e', fontWeight: 500 }}>{item.currentQuantity}</td>
                        <td>{item.totalWeight} kg</td>
                        <td>{item.totalVolume?.toFixed(2)} m³</td>
                        <td>{item.location || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Nenhum item cadastrado</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal - Upload */}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} processUpload={processPackingListUpload} clients={clients} />}
    </div>
  )
}

// Upload Modal Component
function UploadModal({ onClose, processUpload, clients }) {
  const [step, setStep] = useState('upload')
  const [parseResult, setParseResult] = useState(null)
  const [form, setForm] = useState({ containerCode: '', containerType: "Dry Box 40' HC", bl: '', clientName: '' })

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < 2) {
      alert('Arquivo vazio ou sem dados')
      return
    }

    const separator = lines[0].includes(';') ? ';' : ','
    const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
    const items = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(separator)
      const row = {}
      headers.forEach((h, idx) => row[h] = values[idx]?.trim().replace(/['"]/g, '') || '')

      const sku = row.sku || row.codigo || ''
      if (!sku) continue

      const quantity = parseInt(row.quantity || row.quantidade || '1') || 1
      const unitWeight = parseFloat(row.unitweight || row.peso || '0') || 0
      const length = parseFloat(row.length || row.comprimento || '0') || 0
      const width = parseFloat(row.width || row.largura || '0') || 0
      const height = parseFloat(row.height || row.altura || '0') || 0
      const unitVolume = (length * width * height) / 1000000

      items.push({
        sku,
        description: row.description || row.descricao || sku,
        quantity,
        unitWeight,
        totalWeight: unitWeight * quantity,
        length, width, height,
        unitVolume,
        totalVolume: unitVolume * quantity,
        ncm: row.ncm || '',
        origin: row.origin || row.origem || 'CHINA',
        brand: row.brand || row.marca || '',
        location: row.location || row.localizacao || '',
      })
    }

    setParseResult({ items, summary: {
      totalItems: items.length,
      totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
      totalWeight: items.reduce((s, i) => s + i.totalWeight, 0),
      totalVolume: items.reduce((s, i) => s + i.totalVolume, 0),
    }})
    setStep('preview')
  }

  const handleProcess = () => {
    if (!form.containerCode || !form.bl || !form.clientName) {
      alert('Preencha todos os campos obrigatorios')
      return
    }
    processUpload({ ...form, items: parseResult.items })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: '600px' }}>
        <div className="modal-header">Upload de Packing List</div>

        {step === 'upload' && (
          <div className="modal-body" style={{ textAlign: 'center', padding: '32px' }}>
            <input type="file" accept=".csv,.txt" onChange={handleFileSelect} style={{ display: 'none' }} id="file-input" />
            <label htmlFor="file-input" style={{ display: 'inline-block', padding: '24px 48px', border: '2px dashed #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
              <Upload size={32} color="#64748b" />
              <div style={{ marginTop: '8px', color: '#64748b' }}>Clique para selecionar arquivo CSV</div>
            </label>
            <div style={{ marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                const csv = 'sku;description;quantity;unitWeight;length;width;height;ncm;origin;brand;location\nIT9528;CROSSFIT RACK;2;285;220;180;250;9506.91.00;CHINA;IMPULSE;A1-01'
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'template.csv'
                a.click()
              }}>
                <Download size={14} /> Baixar Template
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && parseResult && (
          <>
            <div className="modal-body" style={{ padding: '12px' }}>
              <div className="stats-row" style={{ marginBottom: '12px' }}>
                <div className="stat-box"><div className="label">SKUs</div><div className="value">{parseResult.summary.totalItems}</div></div>
                <div className="stat-box"><div className="label">Unidades</div><div className="value">{parseResult.summary.totalQuantity}</div></div>
                <div className="stat-box"><div className="label">Peso</div><div className="value">{parseResult.summary.totalWeight.toFixed(0)} kg</div></div>
                <div className="stat-box"><div className="label">Volume</div><div className="value">{parseResult.summary.totalVolume.toFixed(1)} m³</div></div>
              </div>
              <div style={{ maxHeight: '150px', overflow: 'auto', marginBottom: '12px' }}>
                <table className="table-erp">
                  <thead><tr><th>SKU</th><th>Descricao</th><th>Qtd</th><th>Peso</th></tr></thead>
                  <tbody>
                    {parseResult.items.slice(0, 5).map((item, i) => (
                      <tr key={i}><td style={{ fontFamily: 'monospace' }}>{item.sku}</td><td>{item.description}</td><td>{item.quantity}</td><td>{item.totalWeight} kg</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Codigo Container *</label><input type="text" className="input" value={form.containerCode} onChange={e => setForm({ ...form, containerCode: e.target.value.toUpperCase() })} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Tipo</label><select className="input" value={form.containerType} onChange={e => setForm({ ...form, containerType: e.target.value })}>{containerTypes.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>BL *</label><input type="text" className="input" value={form.bl} onChange={e => setForm({ ...form, bl: e.target.value.toUpperCase() })} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>Cliente *</label><select className="input" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })}><option value="">Selecione...</option>{clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep('upload')}>Voltar</button>
              <button className="btn btn-primary" onClick={handleProcess}>Importar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
