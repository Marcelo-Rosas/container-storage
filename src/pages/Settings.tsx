import { User, Building2, Bell, Shield, Save } from 'lucide-react'

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie suas preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl border border-gray-100 p-2 space-y-1">
            {[
              { icon: User, label: 'Perfil', active: true },
              { icon: Building2, label: 'Empresa', active: false },
              { icon: Bell, label: 'Notificações', active: false },
              { icon: Shield, label: 'Segurança', active: false },
            ].map(item => (
              <button
                key={item.label}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  item.active
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações do Perfil</h2>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                <User size={32} className="text-brand-600" />
              </div>
              <div>
                <button className="btn btn-primary text-sm">Alterar Foto</button>
                <p className="text-sm text-gray-400 mt-2">JPG, PNG. Máx 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input type="text" defaultValue="Administrador" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sobrenome</label>
                <input type="text" defaultValue="Sistema" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" defaultValue="admin@vectra.com.br" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input type="tel" defaultValue="+55 11 99999-9999" className="input" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn btn-primary">
              <Save size={20} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
