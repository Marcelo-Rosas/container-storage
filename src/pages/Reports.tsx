import { useState } from 'react'
import { BarChart3, TrendingUp, Download, Calendar, Package } from 'lucide-react'
import clsx from 'clsx'
import { useData } from '../contexts/DataContext'

type ReportType = 'occupation' | 'revenue' | 'movements' | 'inventory'

export function Reports() {
  const { containers, events, invoices } = useData()
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateRange, setDateRange] = useState('30')

  // Gerar relatorio de ocupacao
  const generateOccupationReport = () => {
    const lines = [
      'RELATORIO DE OCUPACAO POR CONTEINER',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      'CODIGO;CLIENTE;TIPO;OCUPACAO;VOLUME_USADO;VOLUME_TOTAL;PESO;ITENS',
    ]
    containers.forEach(c => {
      lines.push(`${c.code};${c.clientName};${c.type};${c.occupation.toFixed(1)}%;${c.usedVolume.toFixed(2)}m3;${c.totalVolume.toFixed(2)}m3;${c.totalWeight}kg;${c.items.length}`)
    })
    lines.push('')
    lines.push(`Total de conteineres: ${containers.length}`)
    lines.push(`Ocupacao media: ${(containers.reduce((s, c) => s + c.occupation, 0) / containers.length || 0).toFixed(1)}%`)
    return lines.join('\n')
  }

  // Gerar relatorio de receita
  const generateRevenueReport = () => {
    const lines = [
      'RELATORIO DE RECEITA',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      'FATURA;CLIENTE;PERIODO;ARMAZENAGEM;MANUSEIO;ADICIONAL;TOTAL;STATUS',
    ]
    invoices.forEach(inv => {
      lines.push(`${inv.id};${inv.clientName};${inv.period};R$${inv.storageAmount};R$${inv.handlingAmount};R$${inv.additionalAmount};R$${inv.totalAmount};${inv.status}`)
    })
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0)
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.totalAmount, 0)
    lines.push('')
    lines.push(`Total recebido: R$ ${totalPaid.toLocaleString('pt-BR')}`)
    lines.push(`Total pendente: R$ ${totalPending.toLocaleString('pt-BR')}`)
    return lines.join('\n')
  }

  // Gerar relatorio de movimentacoes
  const generateMovementsReport = () => {
    const lines = [
      'RELATORIO DE MOVIMENTACOES',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      'DATA;HORA;TIPO;CONTEINER;CLIENTE;ITENS;OBSERVACOES',
    ]
    events.forEach(evt => {
      const tipoLabel = evt.type === 'entry' ? 'ENTRADA' : evt.type === 'exit' ? 'SAIDA' : 'MEDICAO'
      const itemsCount = evt.items.reduce((s, i) => s + i.quantity, 0)
      lines.push(`${evt.date.toLocaleDateString('pt-BR')};${evt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })};${tipoLabel};${evt.containerCode};${evt.clientName};${itemsCount};${evt.notes || ''}`)
    })
    return lines.join('\n')
  }

  // Gerar relatorio de inventario
  const generateInventoryReport = () => {
    const lines = [
      'RELATORIO DE INVENTARIO',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      'CONTEINER;SKU;DESCRICAO;QTD_ORIGINAL;QTD_ATUAL;PESO;VOLUME;LOCALIZACAO',
    ]
    containers.forEach(c => {
      c.items.forEach(item => {
        lines.push(`${c.code};${item.sku};${item.descriptionPt || item.description};${item.quantity};${item.currentQuantity};${item.totalWeight}kg;${item.totalVolume.toFixed(3)}m3;${item.location || 'N/D'}`)
      })
    })
    return lines.join('\n')
  }

  const handleExport = (type: ReportType) => {
    let content = ''
    let filename = ''
    switch (type) {
      case 'occupation':
        content = generateOccupationReport()
        filename = `relatorio_ocupacao_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'revenue':
        content = generateRevenueReport()
        filename = `relatorio_receita_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'movements':
        content = generateMovementsReport()
        filename = `relatorio_movimentacoes_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'inventory':
        content = generateInventoryReport()
        filename = `relatorio_inventario_${new Date().toISOString().split('T')[0]}.csv`
        break
    }
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const reportTypes = [
    { id: 'occupation' as ReportType, title: 'Ocupacao por Periodo', description: 'Analise de ocupacao dos conteineres', icon: BarChart3, color: 'brand' },
    { id: 'revenue' as ReportType, title: 'Receita Mensal', description: 'Evolucao da receita e projecoes', icon: TrendingUp, color: 'emerald' },
    { id: 'movements' as ReportType, title: 'Movimentacoes', description: 'Historico de entradas e saidas', icon: Calendar, color: 'purple' },
    { id: 'inventory' as ReportType, title: 'Inventario Completo', description: 'Lista de todos os itens em estoque', icon: Package, color: 'orange' },
  ]

  const colorClasses = {
    brand: { bg: 'bg-brand-50', hover: 'group-hover:bg-brand-100', text: 'text-brand-600' },
    emerald: { bg: 'bg-emerald-50', hover: 'group-hover:bg-emerald-100', text: 'text-emerald-600' },
    purple: { bg: 'bg-purple-50', hover: 'group-hover:bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', hover: 'group-hover:bg-orange-100', text: 'text-orange-600' },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Relatorios</h1>
          <p className="text-gray-500 mt-1">Analises e exportacoes de dados</p>
        </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input max-w-[180px]">
          <option value="7">Ultimos 7 dias</option>
          <option value="30">Ultimos 30 dias</option>
          <option value="90">Ultimos 90 dias</option>
          <option value="365">Este ano</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map(report => {
          const Icon = report.icon
          const colors = colorClasses[report.color as keyof typeof colorClasses]
          const isSelected = selectedReport === report.id
          return (
            <div key={report.id} onClick={() => setSelectedReport(report.id)} className={clsx('card p-6 cursor-pointer group transition-all', isSelected && 'ring-2 ring-brand-500')}>
              <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors', colors.bg, colors.hover)}>
                <Icon size={24} className={colors.text} />
              </div>
              <h3 className="font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              <button onClick={(e) => { e.stopPropagation(); handleExport(report.id); }} className="mt-4 btn btn-secondary text-sm w-full">
                <Download size={16} />
                Exportar CSV
              </button>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{selectedReport ? reportTypes.find(r => r.id === selectedReport)?.title : 'Selecione um relatorio'}</h2>
          {selectedReport && <button onClick={() => handleExport(selectedReport)} className="btn btn-primary"><Download size={18} />Exportar</button>}
        </div>
        {selectedReport ? (
          <div className="overflow-x-auto">
            {selectedReport === 'occupation' && (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left pb-3 font-semibold text-gray-600">Conteiner</th><th className="text-left pb-3 font-semibold text-gray-600">Cliente</th><th className="text-right pb-3 font-semibold text-gray-600">Ocupacao</th><th className="text-right pb-3 font-semibold text-gray-600">Volume</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{containers.map(c => (<tr key={c.id}><td className="py-2 font-mono">{c.code}</td><td className="py-2 text-gray-500">{c.clientName}</td><td className="py-2 text-right font-semibold">{c.occupation.toFixed(1)}%</td><td className="py-2 text-right">{c.usedVolume.toFixed(1)} m³</td></tr>))}</tbody>
              </table>
            )}
            {selectedReport === 'revenue' && (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left pb-3 font-semibold text-gray-600">Fatura</th><th className="text-left pb-3 font-semibold text-gray-600">Cliente</th><th className="text-right pb-3 font-semibold text-gray-600">Valor</th><th className="text-left pb-3 font-semibold text-gray-600">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{invoices.map(inv => (<tr key={inv.id}><td className="py-2 font-mono">{inv.id}</td><td className="py-2 text-gray-500">{inv.clientName}</td><td className="py-2 text-right font-semibold">R$ {inv.totalAmount.toLocaleString('pt-BR')}</td><td className="py-2"><span className={clsx('badge', inv.status === 'paid' && 'badge-active', inv.status === 'pending' && 'bg-yellow-50 text-yellow-700', inv.status === 'overdue' && 'bg-red-50 text-red-700')}>{inv.status === 'paid' ? 'Pago' : inv.status === 'pending' ? 'Pendente' : 'Vencido'}</span></td></tr>))}</tbody>
              </table>
            )}
            {selectedReport === 'movements' && (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left pb-3 font-semibold text-gray-600">Data</th><th className="text-left pb-3 font-semibold text-gray-600">Tipo</th><th className="text-left pb-3 font-semibold text-gray-600">Conteiner</th><th className="text-right pb-3 font-semibold text-gray-600">Itens</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{events.slice(0, 10).map(evt => (<tr key={evt.id}><td className="py-2">{evt.date.toLocaleDateString('pt-BR')}</td><td className="py-2"><span className={clsx('badge', evt.type === 'entry' && 'badge-active', evt.type === 'exit' && 'badge-partial', evt.type === 'measurement' && 'bg-brand-50 text-brand-700')}>{evt.type === 'entry' ? 'Entrada' : evt.type === 'exit' ? 'Saida' : 'Medicao'}</span></td><td className="py-2 font-mono">{evt.containerCode}</td><td className="py-2 text-right">{evt.items.reduce((s, i) => s + i.quantity, 0)}</td></tr>))}</tbody>
              </table>
            )}
            {selectedReport === 'inventory' && (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100"><th className="text-left pb-3 font-semibold text-gray-600">SKU</th><th className="text-left pb-3 font-semibold text-gray-600">Descricao</th><th className="text-left pb-3 font-semibold text-gray-600">Conteiner</th><th className="text-right pb-3 font-semibold text-gray-600">Qtd</th></tr></thead>
                <tbody className="divide-y divide-gray-50">{containers.flatMap(c => c.items.map(item => (<tr key={`${c.id}-${item.id}`}><td className="py-2 font-mono text-brand-600">{item.sku}</td><td className="py-2 text-gray-500 max-w-[200px] truncate">{item.descriptionPt || item.description}</td><td className="py-2 font-mono">{c.code}</td><td className="py-2 text-right">{item.currentQuantity}</td></tr>))).slice(0, 15)}</tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center"><BarChart3 size={48} className="mx-auto mb-3 text-gray-300" /><p className="text-gray-500">Selecione um relatorio para visualizar</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
