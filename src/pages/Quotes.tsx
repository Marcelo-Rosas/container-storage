import { Plus, Search, Filter, MoreVertical } from 'lucide-react'

const quotes = [
  { id: 'QT-001', client: 'Acme Corp', origin: 'São Paulo', destination: 'Rio de Janeiro', value: 'R$ 2,500', status: 'pending' },
  { id: 'QT-002', client: 'Tech Solutions', origin: 'Curitiba', destination: 'Florianópolis', value: 'R$ 1,800', status: 'approved' },
  { id: 'QT-003', client: 'Global Trade', origin: 'Porto Alegre', destination: 'Belo Horizonte', value: 'R$ 4,200', status: 'rejected' },
  { id: 'QT-004', client: 'Fast Logistics', origin: 'Salvador', destination: 'Recife', value: 'R$ 3,100', status: 'pending' },
  { id: 'QT-005', client: 'Prime Shipping', origin: 'Brasília', destination: 'Goiânia', value: 'R$ 950', status: 'approved' },
]

const statusStyles = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  approved: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
}

export function Quotes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quotes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your freight quotes</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors">
          <Plus size={20} />
          <span>New Quote</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotes..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quote ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-accent">
                    {quote.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100">
                    {quote.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {quote.origin} → {quote.destination}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {quote.value}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyles[quote.status as keyof typeof statusStyles]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
