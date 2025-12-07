import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard, Quotes, Pricing, Clients, FreightTables, Settings } from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="clients" element={<Clients />} />
        <Route path="tables" element={<FreightTables />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
