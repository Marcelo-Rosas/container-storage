import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import {
  Dashboard,
  Containers,
  Events,
  Measurements,
  Billing,
  Reports,
  Settings,
  Audit,
  Help
} from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="containers" element={<Containers />} />
        <Route path="events" element={<Events />} />
        <Route path="measurements" element={<Measurements />} />
        <Route path="billing" element={<Billing />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="audit" element={<Audit />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  )
}

export default App
