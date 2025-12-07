import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react'

const freightTables = [
  { id: 1, name: 'Southeast Express', origin: 'São Paulo', destinations: 45, baseRate: 'R$ 2.50/kg', lastUpdate: '2024-01-15' },
  { id: 2, name: 'South Premium', origin: 'Curitiba', destinations: 28, baseRate: 'R$ 3.00/kg', lastUpdate: '2024-01-10' },
  { id: 3, name: 'Northeast Standard', origin: 'Salvador', destinations: 32, baseRate: 'R$ 3.50/kg', lastUpdate: '2024-01-08' },
  { id: 4, name: 'Central Brazil', origin: 'Brasília', destinations: 18, baseRate: 'R$ 2.80/kg', lastUpdate: '2024-01-05' },
  { id: 5, name: 'North Region', origin: 'Manaus', destinations: 12, baseRate: 'R$ 4.50/kg', lastUpdate: '2024-01-02' },
]

export function FreightTables() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Freight Tables</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage pricing tables by region</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors">
          <Plus size={20} />
          <span>New Table</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search freight tables..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Tables List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Table Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destinations
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Base Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {freightTables.map(table => (
                <tr key={table.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <MapPin size={20} />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{table.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {table.origin}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {table.destinations} cities
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {table.baseRate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {table.lastUpdate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
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
