import { useState } from 'react'
import { Plus, FileText, Download, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react'
import clsx from 'clsx'
import { useData } from '../contexts/DataContext'
import { InvoiceModal } from '../components/Modals'
import type { InvoiceStatus } from '../types'

const statusConfig = {
  paid: { label: 'Pago', icon: CheckCircle, className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pendente', icon: Clock, className: 'bg-yellow-50 text-yellow-700' },
  overdue: { label: 'Vencido', icon: AlertCircle, className: 'bg-red-50 text-red-700' },
}

export function Billing() {
  const { invoices, updateInvoice } = useData()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')

  // Filtrar faturas
  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false
    if (searchTerm && !invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Stats
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.totalAmount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.totalAmount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.totalAmount, 0)

  // Marcar como pago
  const handleMarkAsPaid = (invoiceId: string) => {
    updateInvoice(invoiceId, { status: 'paid', paidDate: new Date() })
  }

  // Download fatura (simulated)
  const handleDownload = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId)
    if (!invoice) return

    // Gerar conteudo da fatura
    const content = `
VECTRA STORAGE - FATURA
===============================
Numero: ${invoice.id}
Cliente: ${invoice.clientName}
Periodo: ${invoice.period}
===============================

Conteineres: ${invoice.containers.join(', ')}

VALORES:
- Armazenagem: R$ ${invoice.storageAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Manuseio: R$ ${invoice.handlingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Adicionais: R$ ${invoice.additionalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

TOTAL: R$ ${invoice.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Vencimento: ${invoice.dueDate.toLocaleDateString('pt-BR')}
Status: ${statusConfig[invoice.status].label}

${invoice.notes ? `Observacoes: ${invoice.notes}` : ''}

===============================
Vectra Storage Manager
www.vectra.com.br
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Faturamento</h1>
          <p className="text-gray-500 mt-1">Gerencie faturas e cobrancas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} />
          <span>Nova Fatura</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total de Faturas</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">A Receber (Pendente)</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            R$ {totalPending.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Em Atraso</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            R$ {totalOverdue.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Recebido</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            R$ {totalPaid.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por fatura ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
          className="input max-w-[180px]"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagas</option>
          <option value="overdue">Vencidas</option>
        </select>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Fatura</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Periodo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Vencimento</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Valor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => {
                  const status = statusConfig[invoice.status]
                  const StatusIcon = status.icon
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{invoice.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{invoice.clientName}</td>
                      <td className="px-6 py-4 text-gray-500">{invoice.period}</td>
                      <td className="px-6 py-4 text-gray-500">{invoice.dueDate.toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        R$ {invoice.totalAmount.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', status.className)}>
                          <StatusIcon size={14} />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {invoice.status !== 'paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Marcar como pago"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(invoice.id)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Baixar fatura"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Nenhuma fatura encontrada</p>
                    {(statusFilter !== 'all' || searchTerm) && (
                      <button
                        onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
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

      {/* Modal */}
      <InvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}
