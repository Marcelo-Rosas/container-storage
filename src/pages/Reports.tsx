import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-1">Análises e exportações de dados</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input max-w-[180px]">
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Este ano</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
            <BarChart3 size={24} className="text-brand-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Ocupação por Período</h3>
          <p className="text-sm text-gray-500 mt-1">Análise de ocupação dos contêineres ao longo do tempo</p>
        </div>

        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
            <TrendingUp size={24} className="text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Receita Mensal</h3>
          <p className="text-sm text-gray-500 mt-1">Evolução da receita e projeções</p>
        </div>

        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Movimentações</h3>
          <p className="text-sm text-gray-500 mt-1">Histórico de entradas e saídas por cliente</p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Visão Geral</h2>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Selecione um relatório para visualizar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
