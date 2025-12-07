import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SidebarProvider } from './contexts/SidebarContext'
import { DataProvider } from './contexts/DataContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
