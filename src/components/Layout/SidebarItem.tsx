import { Link, useLocation } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useSidebar } from '../../contexts/SidebarContext'

interface SidebarItemProps {
  to: string
  icon: LucideIcon
  label: string
  badge?: number
  onClick?: () => void
}

export function SidebarItem({ to, icon: Icon, label, badge, onClick }: SidebarItemProps) {
  const location = useLocation()
  const { isCollapsed, isMobile, closeSidebar } = useSidebar()
  const isActive = location.pathname === to

  const handleClick = () => {
    if (isMobile) {
      closeSidebar()
    }
    onClick?.()
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={clsx(
        'sidebar-item group relative',
        isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
      )}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={20} className="flex-shrink-0" />

      {/* Label - hidden when collapsed on desktop */}
      <span
        className={clsx(
          'font-medium transition-all duration-200',
          isCollapsed && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        )}
      >
        {label}
      </span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span
          className={clsx(
            'flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full',
            'bg-red-500 text-white',
            isCollapsed && !isMobile ? 'absolute -top-1 -right-1' : 'ml-auto'
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {/* Tooltip - shown when collapsed */}
      {isCollapsed && !isMobile && (
        <div
          className={clsx(
            'absolute left-full ml-2 px-3 py-2 rounded-lg',
            'bg-gray-900 text-white text-sm font-medium',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-200 whitespace-nowrap z-50',
            'shadow-lg'
          )}
        >
          {label}
          {badge !== undefined && badge > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 rounded-full">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
