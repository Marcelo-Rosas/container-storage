import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react'
import clsx from 'clsx'
import { useSidebar } from '../../contexts/SidebarContext'

const notifications = [
  { id: 1, title: 'Container CMAU3754293', message: 'Ocupação atingiu 90%', time: '5 min', unread: true },
  { id: 2, title: 'Novo cliente cadastrado', message: 'FITNESS IMPORTS BR LTDA', time: '1h', unread: true },
  { id: 3, title: 'Faturamento gerado', message: 'R$ 12.450,00 em cobranças', time: '3h', unread: false },
]

export function Header() {
  const { isMobile, openSidebar } = useSidebar()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={openSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        )}

        {/* Search bar */}
        <div className="relative flex-1 max-w-xl">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar contêineres, SKUs, clientes..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 lg:gap-2 ml-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={clsx(
                      'px-4 py-3 border-b border-gray-50 last:border-0',
                      'hover:bg-gray-50 transition-colors cursor-pointer',
                      notification.unread && 'bg-brand-50/50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {notification.title}
                        </p>
                        <p className="text-gray-500 text-sm mt-0.5 truncate">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button className="w-full text-center text-sm text-brand-600 hover:text-brand-700 font-medium">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu do usuário"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={20} className="text-emerald-600" />
            </div>
            <span className="hidden lg:block text-sm font-medium text-gray-700">
              Admin
            </span>
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">Administrador</p>
                <p className="text-sm text-gray-500">admin@vectra.com.br</p>
              </div>
              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={16} className="text-gray-400" />
                  <span>Meu Perfil</span>
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={16} className="text-gray-400" />
                  <span>Configurações</span>
                </button>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
