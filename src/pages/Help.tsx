import { HelpCircle, Book, MessageCircle, Mail } from 'lucide-react'

export function Help() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Ajuda</h1>
        <p className="text-gray-500 mt-1">Central de suporte e documentação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
            <Book size={24} className="text-brand-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Documentação</h3>
          <p className="text-sm text-gray-500 mt-1">Guias completos de uso do sistema</p>
        </div>

        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
            <MessageCircle size={24} className="text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Chat de Suporte</h3>
          <p className="text-sm text-gray-500 mt-1">Converse com nossa equipe</p>
        </div>

        <div className="card p-6 hover:border-brand-200 cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Mail size={24} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Email</h3>
          <p className="text-sm text-gray-500 mt-1">suporte@vectra.com.br</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {[
            { q: 'Como adicionar um novo contêiner?', a: 'Acesse o menu Contêineres e clique em "Novo Contêiner".' },
            { q: 'Como registrar uma entrada de mercadoria?', a: 'Na página de Eventos, clique em "Novo Evento" e selecione "Entrada".' },
            { q: 'Como gerar uma fatura?', a: 'O sistema gera faturas automaticamente no dia 25 de cada mês.' },
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{faq.q}</p>
                  <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
