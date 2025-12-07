import { Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useSidebar } from '../../contexts/SidebarContext'

export function Layout() {
  const { isCollapsed, isMobile } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          // Adjust for sidebar width on desktop
          !isMobile && (isCollapsed ? 'lg:ml-0' : 'lg:ml-0')
        )}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
