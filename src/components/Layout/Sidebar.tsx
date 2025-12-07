import {
  LayoutDashboard,
  FileText,
  Calculator,
  Settings,
  Users,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import clsx from 'clsx'
import { SidebarItem } from './SidebarItem'
import { useSidebar } from '../../contexts/SidebarContext'

const mainNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quotes', icon: FileText, label: 'Quotes', badge: 3 },
  { to: '/pricing', icon: Calculator, label: 'Pricing' },
]

const managementNavItems = [
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/tables', icon: Truck, label: 'Freight Tables' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { isOpen, isCollapsed, isMobile, toggleCollapse, closeSidebar } = useSidebar()

  const sidebarClasses = clsx(
    'fixed lg:static inset-y-0 left-0 z-40',
    'bg-primary text-white flex flex-col',
    'transition-all duration-300 ease-in-out',
    // Width
    isCollapsed && !isMobile ? 'w-20' : 'w-64',
    // Mobile visibility
    isMobile && !isOpen && '-translate-x-full',
    isMobile && isOpen && 'translate-x-0 animate-slide-in'
  )

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClasses} aria-label="Sidebar navigation">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1
            className={clsx(
              'font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent',
              'transition-all duration-200',
              isCollapsed && !isMobile ? 'text-lg' : 'text-xl'
            )}
          >
            {isCollapsed && !isMobile ? 'VL' : 'Velvet Logistics'}
          </h1>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {mainNavItems.map(item => (
            <SidebarItem key={item.to} {...item} />
          ))}

          {/* Section divider */}
          <div className="pt-4 pb-2">
            <p
              className={clsx(
                'px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider',
                'transition-all duration-200',
                isCollapsed && !isMobile && 'text-center px-0'
              )}
            >
              {isCollapsed && !isMobile ? '•••' : 'Management'}
            </p>
          </div>

          {managementNavItems.map(item => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          {/* Collapse toggle - only on desktop */}
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 w-full',
                'text-gray-400 hover:text-white hover:bg-secondary',
                'rounded-lg transition-colors',
                isCollapsed && 'justify-center'
              )}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              {!isCollapsed && <span className="font-medium">Collapse</span>}
            </button>
          )}

          {/* Sign out button */}
          <button
            className={clsx(
              'flex items-center gap-3 px-4 py-3 w-full',
              'text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-400',
              'rounded-lg transition-colors',
              isCollapsed && !isMobile && 'justify-center'
            )}
            aria-label="Sign out"
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobile) && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
