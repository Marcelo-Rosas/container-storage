import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import clsx from 'clsx'
import { useSidebar } from '../../contexts/SidebarContext'
import { useTheme } from '../../contexts/ThemeContext'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/quotes': 'Quotes',
  '/pricing': 'Pricing',
  '/clients': 'Clients',
  '/tables': 'Freight Tables',
  '/settings': 'Settings',
}

const notifications = [
  { id: 1, title: 'New quote request', message: 'John Doe requested a quote', time: '5m ago', unread: true },
  { id: 2, title: 'Payment received', message: 'Invoice #1234 paid', time: '1h ago', unread: true },
  { id: 3, title: 'Shipment delivered', message: 'Order #5678 completed', time: '3h ago', unread: false },
]

export function Header() {
  const { isMobile, openSidebar } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const currentTitle = routeTitles[location.pathname] || 'Page'
  const unreadCount = notifications.filter(n => n.unread).length

  // Close dropdowns when clicking outside
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
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 transition-colors">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={openSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}

        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">Home</span>
          <ChevronRight size={16} className="text-gray-400 hidden sm:inline" />
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-600" />
          ) : (
            <Sun size={20} className="text-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={clsx(
                      'p-4 border-b border-gray-100 dark:border-gray-700 last:border-0',
                      'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer',
                      notification.unread && 'bg-blue-50/50 dark:bg-blue-900/20'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full text-center text-sm text-accent hover:text-accent-dark font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-gray-100">John Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">john@velvet.com</p>
              </div>
              <div className="py-2">
                <button className="dropdown-item w-full text-left">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button className="dropdown-item w-full text-left">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
              <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                <button className="dropdown-item w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
