import { Link, useLocation } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useSidebar } from '../../contexts/SidebarContext'

interface SidebarItemProps {
  to: string
  icon: LucideIcon
  label: string
  collapsed?: boolean
  badge?: number
}

export function SidebarItem({ to, icon: Icon, label, collapsed, badge }: SidebarItemProps) {
  const location = useLocation()
  const { isMobile, closeSidebar } = useSidebar()
  const isActive = location.pathname === to

  const handleClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={clsx(
        'sidebar-item group relative',
        isActive ? 'sidebar-item-active' : 'sidebar-item-inactive',
        collapsed && 'justify-center px-0'
      )}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />

      {!collapsed && (
        <span className="truncate">{label}</span>
      )}

      {/* Badge */}
      {badge !== undefined && badge > 0 && !collapsed && (
        <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-brand-500 text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div
          className={clsx(
            'absolute left-full ml-3 px-3 py-2 rounded-lg',
            'bg-slate-900 text-white text-sm font-medium',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-150 whitespace-nowrap z-50',
            'shadow-lg pointer-events-none'
          )}
        >
          {label}
          {badge !== undefined && badge > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-brand-500 rounded-full">
              {badge}
            </span>
          )}
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
        </div>
      )}
    </Link>
  )
}
