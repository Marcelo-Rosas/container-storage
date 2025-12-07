import { useState, useRef } from 'react'
import { Upload, FileText, Download, AlertCircle, CheckCircle, Package } from 'lucide-react'
import { Modal, ModalFooter } from '../Modal'
import { parsePackingListFile, downloadCSVTemplate, type ParseResult } from '../../utils/packingListParser'
import { useData } from '../../contexts/DataContext'
import { containerTypes } from '../../types'
import clsx from 'clsx'

interface PackingListUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

type UploadStep = 'upload' | 'preview' | 'config' | 'success'

export function PackingListUploadModal({ isOpen, onClose }: PackingListUploadModalProps) {
  const { clients, processPackingListUpload } = useData()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<UploadStep>('upload')
  const [_file, setFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Dados do contêiner
  const [containerCode, setContainerCode] = useState('')
  const [containerType, setContainerType] = useState("Dry Box 40' HC")
  const [bl, setBl] = useState('')
  const [clientName, setClientName] = useState('')

  // Reset modal
  const resetModal = () => {
    setStep('upload')
    setFile(null)
    setParseResult(null)
    setContainerCode('')
    setContainerType("Dry Box 40' HC")
    setBl('')
    setClientName('')
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  // Handle file selection
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)

    try {
      const result = await parsePackingListFile(selectedFile)
      setParseResult(result)
      setStep('preview')
    } catch (error) {
      setParseResult({
        success: false,
        items: [],
        errors: [error instanceof Error ? error.message : 'Erro ao processar arquivo'],
        warnings: [],
        summary: { totalItems: 0, totalQuantity: 0, totalWeight: 0, totalVolume: 0 },
      })
      setStep('preview')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Process and save
  const handleProcess = () => {
    if (!parseResult || !parseResult.items.length) return

    try {
      processPackingListUpload({
        containerCode,
        containerType,
        bl,
        clientName,
        items: parseResult.items,
      })
      setStep('success')
    } catch (error) {
      alert('Erro ao processar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload de Packing List"
      description="Importe itens a partir de um arquivo CSV"
      size="xl"
    >
      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              'border-gray-200 hover:border-brand-400 hover:bg-brand-50/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <Upload size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium mb-1">
              Arraste o arquivo CSV aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-400">
              Formatos aceitos: .csv, .txt
            </p>
          </div>

          {/* Template download */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Template de Packing List</p>
                <p className="text-xs text-gray-500">Baixe o modelo CSV com as colunas corretas</p>
              </div>
            </div>
            <button
              onClick={downloadCSVTemplate}
              className="btn btn-secondary text-sm"
            >
              <Download size={16} />
              Baixar Template
            </button>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Colunas esperadas no arquivo:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
              <span>sku / codigo</span>
              <span>description / descricao</span>
              <span>quantity / quantidade</span>
              <span>unitWeight / peso</span>
              <span>length / comprimento</span>
              <span>width / largura</span>
              <span>height / altura</span>
              <span>ncm</span>
              <span>origin / origem</span>
              <span>brand / marca</span>
              <span>model / modelo</span>
              <span>unitPrice / preco</span>
            </div>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && parseResult && (
        <div className="space-y-6">
          {/* Status */}
          <div className={clsx(
            'p-4 rounded-lg flex items-start gap-3',
            parseResult.success ? 'bg-emerald-50' : 'bg-red-50'
          )}>
            {parseResult.success ? (
              <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={clsx(
                'font-medium',
                parseResult.success ? 'text-emerald-800' : 'text-red-800'
              )}>
                {parseResult.success
                  ? `${parseResult.items.length} itens encontrados`
                  : 'Erros encontrados no arquivo'}
              </p>
              {parseResult.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 space-y-1">
                  {parseResult.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                  {parseResult.errors.length > 5 && (
                    <li>... e mais {parseResult.errors.length - 5} erros</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Warnings */}
          {parseResult.warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-800 mb-2">Avisos:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {parseResult.warnings.slice(0, 3).map((warn, i) => (
                  <li key={i}>• {warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          {parseResult.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{parseResult.summary.totalItems}</p>
                  <p className="text-sm text-gray-500">SKUs</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{parseResult.summary.totalQuantity}</p>
                  <p className="text-sm text-gray-500">Unidades</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{parseResult.summary.totalWeight.toFixed(0)}</p>
                  <p className="text-sm text-gray-500">kg Total</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{parseResult.summary.totalVolume.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">m³ Total</p>
                </div>
              </div>

              {/* Items preview */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Preview dos itens:</h4>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-gray-600">SKU</th>
                        <th className="text-left px-4 py-2 font-medium text-gray-600">Descricao</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Qtd</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Peso</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Volume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {parseResult.items.slice(0, 10).map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-mono text-brand-600">{item.sku}</td>
                          <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">
                            {item.descriptionPt || item.description}
                          </td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{item.totalWeight}kg</td>
                          <td className="px-4 py-2 text-right">{item.totalVolume.toFixed(2)}m³</td>
                        </tr>
                      ))}
                      {parseResult.items.length > 10 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-2 text-center text-gray-400">
                            ... e mais {parseResult.items.length - 10} itens
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <ModalFooter>
            <button onClick={() => setStep('upload')} className="btn btn-secondary">
              Voltar
            </button>
            {parseResult.items.length > 0 && (
              <button onClick={() => setStep('config')} className="btn btn-primary">
                Continuar
              </button>
            )}
          </ModalFooter>
        </div>
      )}

      {/* Step: Config */}
      {step === 'config' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Codigo do Conteiner *
              </label>
              <input
                type="text"
                value={containerCode}
                onChange={(e) => setContainerCode(e.target.value.toUpperCase())}
                placeholder="Ex: CMAU3754293"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conteiner *
              </label>
              <select
                value={containerType}
                onChange={(e) => setContainerType(e.target.value)}
                className="input"
              >
                {containerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill of Lading (BL) *
              </label>
              <input
                type="text"
                value={bl}
                onChange={(e) => setBl(e.target.value.toUpperCase())}
                placeholder="Ex: 06BRZ2411035"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="input"
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.name}>{client.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Ou digite o nome do cliente manualmente abaixo
              </p>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome do cliente"
                className="input mt-2"
              />
            </div>
          </div>

          {/* Summary */}
          {parseResult && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Resumo da importacao:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">SKUs:</span>
                  <span className="ml-2 font-medium">{parseResult.summary.totalItems}</span>
                </div>
                <div>
                  <span className="text-gray-500">Unidades:</span>
                  <span className="ml-2 font-medium">{parseResult.summary.totalQuantity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Peso Total:</span>
                  <span className="ml-2 font-medium">{parseResult.summary.totalWeight.toFixed(0)} kg</span>
                </div>
                <div>
                  <span className="text-gray-500">Volume Total:</span>
                  <span className="ml-2 font-medium">{parseResult.summary.totalVolume.toFixed(1)} m³</span>
                </div>
              </div>
            </div>
          )}

          <ModalFooter>
            <button onClick={() => setStep('preview')} className="btn btn-secondary">
              Voltar
            </button>
            <button
              onClick={handleProcess}
              disabled={!containerCode || !bl || !clientName}
              className={clsx(
                'btn btn-primary',
                (!containerCode || !bl || !clientName) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Package size={18} />
              Importar Packing List
            </button>
          </ModalFooter>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Packing List Importado!
          </h3>
          <p className="text-gray-500 mb-6">
            {parseResult?.summary.totalItems} itens foram adicionados ao conteiner {containerCode}
          </p>
          <button onClick={handleClose} className="btn btn-primary">
            Fechar
          </button>
        </div>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processando arquivo...</p>
          </div>
        </div>
      )}
    </Modal>
  )
}
