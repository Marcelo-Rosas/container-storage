import { Plus, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const invoices = [
  { id: 'FAT-2024-001', client: 'KONNEN COMERCIO', period: 'Nov/2024', amount: 3200, status: 'paid', dueDate: '25/11/2024' },
  { id: 'FAT-2024-002', client: 'FITNESS IMPORTS', period: 'Nov/2024', amount: 2800, status: 'paid', dueDate: '25/11/2024' },
  { id: 'FAT-2024-003', client: 'GYM EQUIPMENT', period: 'Dez/2024', amount: 3200, status: 'pending', dueDate: '25/12/2024' },
  { id: 'FAT-2024-004', client: 'ACADEMIA POWER', period: 'Dez/2024', amount: 1800, status: 'pending', dueDate: '25/12/2024' },
  { id: 'FAT-2024-005', client: 'KONNEN COMERCIO', period: 'Dez/2024', amount: 3200, status: 'overdue', dueDate: '05/12/2024' },
]

const statusConfig = {
  paid: { label: 'Pago', icon: CheckCircle, className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pendente', icon: Clock, className: 'bg-yellow-50 text-yellow-700' },
  overdue: { label: 'Vencido', icon: AlertCircle, className: 'bg-red-50 text-red-700' },
}

export function Billing() {
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Faturamento</h1>
          <p className="text-gray-500 mt-1">Gerencie faturas e cobranças</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          <span>Nova Fatura</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <p className="text-sm text-gray-500">Total do Mês</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            R$ {(totalPending + totalOverdue).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Fatura</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Período</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Vencimento</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Valor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(invoice => {
                const status = statusConfig[invoice.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{invoice.client}</td>
                    <td className="px-6 py-4 text-gray-500">{invoice.period}</td>
                    <td className="px-6 py-4 text-gray-500">{invoice.dueDate}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      R$ {invoice.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', status.className)}>
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
