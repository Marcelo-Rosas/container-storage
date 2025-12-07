import {
  LayoutGrid,
  Container,
  Zap,
  Ruler,
  Receipt,
  BarChart3,
  Settings,
  FileText,
  HelpCircle,
  ChevronLeft,
  X
} from 'lucide-react'
import clsx from 'clsx'
import { SidebarItem } from './SidebarItem'
import { useSidebar } from '../../contexts/SidebarContext'

const mainNavItems = [
  { to: '/', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/containers', icon: Container, label: 'Contêineres' },
  { to: '/events', icon: Zap, label: 'Eventos' },
  { to: '/measurements', icon: Ruler, label: 'Medições' },
  { to: '/billing', icon: Receipt, label: 'Faturamento' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios' },
]

const systemNavItems = [
  { to: '/settings', icon: Settings, label: 'Configurações' },
  { to: '/audit', icon: FileText, label: 'Auditoria' },
  { to: '/help', icon: HelpCircle, label: 'Ajuda' },
]

export function Sidebar() {
  const { isOpen, isCollapsed, isMobile, toggleCollapse, closeSidebar } = useSidebar()

  const sidebarWidth = isCollapsed && !isMobile ? 'w-[72px]' : 'w-64'

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

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-40',
          'bg-sidebar text-white flex flex-col',
          'transition-all duration-200 ease-out',
          sidebarWidth,
          isMobile && !isOpen && '-translate-x-full',
          isMobile && isOpen && 'translate-x-0 animate-slide-in'
        )}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
              <Container size={20} className="text-white" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden">
                <h1 className="text-base font-semibold text-white truncate">Vectra</h1>
                <p className="text-xs text-sidebar-muted truncate">Storage Manager</p>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
              aria-label="Fechar menu"
            >
              <X size={20} className="text-sidebar-muted" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {mainNavItems.map(item => (
            <SidebarItem key={item.to} {...item} collapsed={isCollapsed && !isMobile} />
          ))}

          {/* Section divider */}
          <div className="pt-6 pb-2">
            {(!isCollapsed || isMobile) && (
              <p className="px-3 text-[11px] font-semibold text-sidebar-muted uppercase tracking-wider">
                Sistema
              </p>
            )}
            {isCollapsed && !isMobile && (
              <div className="h-px bg-sidebar-border mx-2" />
            )}
          </div>

          {systemNavItems.map(item => (
            <SidebarItem key={item.to} {...item} collapsed={isCollapsed && !isMobile} />
          ))}
        </nav>

        {/* Footer - Collapse toggle */}
        {!isMobile && (
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={toggleCollapse}
              className={clsx(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
                'text-sidebar-muted hover:text-white hover:bg-sidebar-hover',
                'transition-all duration-150',
                isCollapsed && 'justify-center'
              )}
              aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <ChevronLeft
                size={20}
                className={clsx(
                  'transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
              {!isCollapsed && <span className="text-sm font-medium">Recolher</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
