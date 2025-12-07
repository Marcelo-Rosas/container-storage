import { Plus, Search, MoreVertical, Building2, Mail, Phone } from 'lucide-react'

const clients = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '+55 11 99999-0001', orders: 45, status: 'active' },
  { id: 2, name: 'Tech Solutions Ltd', email: 'info@techsol.com', phone: '+55 21 99999-0002', orders: 32, status: 'active' },
  { id: 3, name: 'Global Trade Inc', email: 'sales@globaltrade.com', phone: '+55 41 99999-0003', orders: 18, status: 'inactive' },
  { id: 4, name: 'Fast Logistics SA', email: 'ops@fastlog.com', phone: '+55 51 99999-0004', orders: 67, status: 'active' },
  { id: 5, name: 'Prime Shipping Co', email: 'hello@primeship.com', phone: '+55 31 99999-0005', orders: 23, status: 'active' },
  { id: 6, name: 'Metro Express', email: 'contact@metroexp.com', phone: '+55 71 99999-0006', orders: 8, status: 'inactive' },
]

export function Clients() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your client database</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors">
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map(client => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{client.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    client.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={16} />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone size={16} />
                <span>{client.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{client.orders}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
