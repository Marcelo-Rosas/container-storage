import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Package, Calendar, Ruler, FileText, BarChart2, History, Settings, HelpCircle, Home } from 'lucide-react'
import { Dashboard } from './pages/Dashboard'
import { Containers } from './pages/Containers'
import { Events } from './pages/Events'
import { Measurements } from './pages/Measurements'
import { Billing } from './pages/Billing'
import { Reports } from './pages/Reports'
import { Audit } from './pages/Audit'

const menuItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/containers', icon: Package, label: 'Conteineres' },
  { path: '/events', icon: Calendar, label: 'Movimentacoes' },
  { path: '/measurements', icon: Ruler, label: 'Medicoes' },
  { path: '/billing', icon: FileText, label: 'Faturamento' },
  { path: '/reports', icon: BarChart2, label: 'Relatorios' },
  { path: '/audit', icon: History, label: 'Auditoria' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside style={{
      width: '180px',
      background: '#1e293b',
      minHeight: '100vh',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '12px 8px', marginBottom: '8px', borderBottom: '1px solid #334155' }}>
        <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}>VECTRA</div>
        <div style={{ color: '#64748b', fontSize: '10px' }}>Storage Manager</div>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '4px',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? '#334155' : 'transparent',
                textDecoration: 'none',
                fontSize: '12px',
                marginBottom: '2px',
              }}
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div style={{ borderTop: '1px solid #334155', paddingTop: '8px', marginTop: '8px' }}>
        <div style={{ color: '#64748b', fontSize: '10px', padding: '8px' }}>
          v1.0.0 • {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    </aside>
  )
}

function Header() {
  return (
    <header style={{
      height: '40px',
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      <div style={{ fontSize: '12px', color: '#64748b' }}>
        Sistema de Gestao de Armazenagem
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Admin</span>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#3b82f6',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
        }}>
          A
        </div>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/containers" element={<Containers />} />
            <Route path="/events" element={<Events />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<Audit />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
