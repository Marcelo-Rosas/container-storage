import { useState } from 'react'
import { Download, BarChart2, DollarSign, Package, TrendingUp } from 'lucide-react'
import { useData } from '../contexts/DataContext'

export function Reports() {
  const { containers, events, invoices } = useData()
  const [reportType, setReportType] = useState('occupation')

  const reports = {
    occupation: {
      title: 'Relatorio de Ocupacao',
      icon: Package,
      data: containers.map(c => ({
        container: c.code,
        cliente: c.clientName,
        tipo: c.type,
        volumeTotal: c.totalVolume.toFixed(1) + ' m³',
        volumeUsado: c.usedVolume.toFixed(1) + ' m³',
        ocupacao: c.occupation.toFixed(1) + '%',
        skus: c.items.length,
        peso: (c.totalWeight / 1000).toFixed(1) + ' t',
      })),
      headers: ['Container', 'Cliente', 'Tipo', 'Vol. Total', 'Vol. Usado', 'Ocupacao', 'SKUs', 'Peso'],
    },
    revenue: {
      title: 'Relatorio de Receita',
      icon: DollarSign,
      data: invoices.map(i => ({
        fatura: i.id,
        cliente: i.clientName,
        periodo: i.period,
        armazenagem: 'R$ ' + i.storageAmount.toLocaleString('pt-BR'),
        manuseio: 'R$ ' + i.handlingAmount.toLocaleString('pt-BR'),
        total: 'R$ ' + i.totalAmount.toLocaleString('pt-BR'),
        status: i.status === 'paid' ? 'Pago' : i.status === 'pending' ? 'Pendente' : 'Vencido',
      })),
      headers: ['Fatura', 'Cliente', 'Periodo', 'Armazenagem', 'Manuseio', 'Total', 'Status'],
    },
    movements: {
      title: 'Relatorio de Movimentacoes',
      icon: TrendingUp,
      data: events.map(e => ({
        data: new Date(e.date).toLocaleDateString('pt-BR'),
        tipo: e.type === 'entry' ? 'Entrada' : e.type === 'exit' ? 'Saida' : 'Medicao',
        container: e.containerCode,
        itens: e.items?.length || 0,
        usuario: e.createdBy,
        obs: e.notes || '-',
      })),
      headers: ['Data', 'Tipo', 'Container', 'Itens', 'Usuario', 'Obs'],
    },
    inventory: {
      title: 'Relatorio de Inventario',
      icon: Package,
      data: containers.flatMap(c => c.items.map(i => ({
        container: c.code,
        cliente: c.clientName,
        sku: i.sku,
        descricao: i.description,
        qtdOriginal: i.quantity,
        qtdAtual: i.currentQuantity,
        peso: i.totalWeight + ' kg',
        volume: (i.totalVolume || 0).toFixed(2) + ' m³',
        local: i.location || '-',
      }))),
      headers: ['Container', 'Cliente', 'SKU', 'Descricao', 'Qtd Orig.', 'Qtd Atual', 'Peso', 'Volume', 'Local'],
    },
  }

  const currentReport = reports[reportType]
  const Icon = currentReport.icon

  const exportCSV = () => {
    const headers = currentReport.headers.join(';')
    const rows = currentReport.data.map(row => Object.values(row).join(';'))
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '4px' }}>
          {Object.entries(reports).map(([key, r]) => {
            const RIcon = r.icon
            return (
              <button
                key={key}
                className={`btn btn-sm ${reportType === key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setReportType(key)}
              >
                <RIcon size={14} /> {r.title.replace('Relatorio de ', '')}
              </button>
            )
          })}
        </div>
        <button className="btn btn-success btn-sm" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
      </div>

      {/* Report Header */}
      <div className="card" style={{ marginBottom: '8px' }}>
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon size={20} color="#3b82f6" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{currentReport.title}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{currentReport.data.length} registros</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Gerado em: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
        <table className="table-erp">
          <thead>
            <tr>
              {currentReport.headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentReport.data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} style={{
                    fontFamily: j === 0 || currentReport.headers[j]?.includes('SKU') ? 'monospace' : 'inherit',
                    fontWeight: j === 0 ? 500 : 'normal',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {currentReport.data.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Nenhum dado para este relatorio</div>
        )}
      </div>
    </div>
  )
}
