import { useState, useEffect } from 'react'
import { Printer, Tag, Package, Truck, RotateCcw, Eye, Copy, CheckCircle } from 'lucide-react'
import { Modal, ModalFooter } from '../Modal'
import { useData } from '../../contexts/DataContext'
import {
  createLabelData,
  generateZPL,
  generateShippingLabel,
  generateReturnLabel,
  openLabelPreview,
} from '../../utils/labelGenerator'
import clsx from 'clsx'

interface LabelModalProps {
  isOpen: boolean
  onClose: () => void
}

type LabelType = 'storage' | 'shipping' | 'return'

export function LabelModal({ isOpen, onClose }: LabelModalProps) {
  const { containers, settings } = useData()

  const [labelType, setLabelType] = useState<LabelType>('storage')
  const [containerId, setContainerId] = useState('')
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [copies, setCopies] = useState(1)

  // Dados para etiqueta de expedicao
  const [destination, setDestination] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    cep: '',
  })
  const [nf, setNf] = useState('')

  // Dados para etiqueta de devolucao
  const [returnAddress, setReturnAddress] = useState('')

  // Preview
  const [showPreview, setShowPreview] = useState(false)
  const [zplCode, setZplCode] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedContainer = containers.find(c => c.id === containerId)
  const availableItems = selectedContainer?.items || []
  const selectedItem = availableItems.find(i => i.id === itemId)

  useEffect(() => {
    if (!isOpen) {
      setContainerId('')
      setItemId('')
      setQuantity(1)
      setCopies(1)
      setLabelType('storage')
      setShowPreview(false)
      setZplCode('')
      setDestination({ name: '', address: '', city: '', state: '', cep: '' })
      setNf('')
      setReturnAddress('')
    }
  }, [isOpen])

  // Gerar preview
  const handleGeneratePreview = () => {
    if (!selectedContainer || !selectedItem) return

    const labelData = createLabelData(selectedItem, selectedContainer, quantity)
    let zpl = ''

    switch (labelType) {
      case 'storage':
        zpl = generateZPL(labelData, settings)
        break
      case 'shipping':
        zpl = generateShippingLabel(selectedItem, selectedContainer, destination, nf)
        break
      case 'return':
        zpl = generateReturnLabel(selectedItem, selectedContainer, returnAddress)
        break
    }

    // Repetir para copias
    if (copies > 1) {
      zpl = Array(copies).fill(zpl).join('\n')
    }

    setZplCode(zpl)
    setShowPreview(true)
  }

  // Abrir preview visual
  const handleVisualPreview = () => {
    if (!selectedContainer || !selectedItem) return
    const labelData = createLabelData(selectedItem, selectedContainer, quantity)
    openLabelPreview(labelData)
  }

  // Copiar ZPL
  const handleCopyZPL = async () => {
    await navigator.clipboard.writeText(zplCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Enviar para impressora
  const handlePrint = () => {
    // Abrir janela com instrucoes
    const printWindow = window.open('', '_blank', 'width=600,height=500')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Etiqueta SELBETI</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h2 { color: #1e40af; }
              .zpl-code { background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow-y: auto; }
              .instructions { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; }
              .btn:hover { background: #2563eb; }
              .btn-secondary { background: #6b7280; }
            </style>
          </head>
          <body>
            <h2>Etiqueta SELBETI - Comando ZPL</h2>
            <div class="instructions">
              <strong>Instrucoes de Impressao:</strong>
              <ol>
                <li>Copie o codigo ZPL abaixo</li>
                <li>Abra o software da impressora SELBETI ou Zebra</li>
                <li>Cole o codigo no campo de entrada</li>
                <li>Ou envie via TCP/IP para a porta 9100 da impressora</li>
              </ol>
              <p><strong>Configuracao:</strong> ${settings.labels.paperWidth}x${settings.labels.paperHeight}mm @ ${settings.labels.dpi}dpi</p>
            </div>
            <div class="zpl-code">${zplCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <div style="margin-top: 20px;">
              <button class="btn" onclick="navigator.clipboard.writeText(\`${zplCode.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`).then(() => alert('Codigo copiado!'))">
                Copiar Codigo ZPL
              </button>
              <button class="btn btn-secondary" onclick="window.print()">
                Imprimir Esta Pagina
              </button>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const labelTypeConfig = {
    storage: {
      label: 'Armazenagem',
      icon: Package,
      description: 'Etiqueta para identificacao no estoque',
    },
    shipping: {
      label: 'Expedicao',
      icon: Truck,
      description: 'Etiqueta com dados de destino',
    },
    return: {
      label: 'Devolucao',
      icon: RotateCcw,
      description: 'Etiqueta para devolucao de mercadoria',
    },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emitir Etiqueta"
      description="Gere etiquetas para impressora termica SELBETI"
      size="xl"
    >
      <div className="space-y-6">
        {!showPreview ? (
          <>
            {/* Label Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Etiqueta *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(labelTypeConfig) as [LabelType, typeof labelTypeConfig.storage][]).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLabelType(type)}
                      className={clsx(
                        'p-4 rounded-lg border-2 transition-all text-left',
                        labelType === type
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Icon size={24} className={labelType === type ? 'text-brand-600' : 'text-gray-400'} />
                      <p className="font-medium text-gray-900 mt-2">{config.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Container and Item Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteiner *
                </label>
                <select
                  value={containerId}
                  onChange={(e) => {
                    setContainerId(e.target.value)
                    setItemId('')
                  }}
                  className="input"
                >
                  <option value="">Selecione um conteiner</option>
                  {containers.filter(c => c.items.length > 0).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.clientName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item/SKU *
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="input"
                  disabled={!containerId}
                >
                  <option value="">Selecione um item</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.descriptionPt || item.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity and Copies */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade por etiqueta
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  min="1"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numero de copias
                </label>
                <input
                  type="number"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                  min="1"
                  max="50"
                  className="input"
                />
              </div>
            </div>

            {/* Shipping-specific fields */}
            {labelType === 'shipping' && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-700">Dados do Destinatario</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Nome/Empresa</label>
                    <input
                      type="text"
                      value={destination.name}
                      onChange={(e) => setDestination(prev => ({ ...prev, name: e.target.value }))}
                      className="input"
                      placeholder="Nome do destinatario"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Endereco</label>
                    <input
                      type="text"
                      value={destination.address}
                      onChange={(e) => setDestination(prev => ({ ...prev, address: e.target.value }))}
                      className="input"
                      placeholder="Rua, numero, complemento"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={destination.city}
                      onChange={(e) => setDestination(prev => ({ ...prev, city: e.target.value }))}
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">UF</label>
                      <input
                        type="text"
                        value={destination.state}
                        onChange={(e) => setDestination(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                        maxLength={2}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CEP</label>
                      <input
                        type="text"
                        value={destination.cep}
                        onChange={(e) => setDestination(prev => ({ ...prev, cep: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nota Fiscal</label>
                    <input
                      type="text"
                      value={nf}
                      onChange={(e) => setNf(e.target.value)}
                      className="input"
                      placeholder="Numero da NF"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Return-specific fields */}
            {labelType === 'return' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereco de Devolucao
                </label>
                <textarea
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Endereco completo para devolucao..."
                />
              </div>
            )}

            {/* Printer Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                <Printer size={18} />
                Configuracao da Impressora
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <span className="text-blue-600">Tipo:</span>
                  <span className="ml-2">{settings.labels.printerType}</span>
                </div>
                <div>
                  <span className="text-blue-600">Tamanho:</span>
                  <span className="ml-2">{settings.labels.paperWidth}x{settings.labels.paperHeight}mm</span>
                </div>
                <div>
                  <span className="text-blue-600">Resolucao:</span>
                  <span className="ml-2">{settings.labels.dpi} DPI</span>
                </div>
              </div>
            </div>

            <ModalFooter>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleVisualPreview}
                disabled={!containerId || !itemId}
                className={clsx(
                  'btn btn-secondary',
                  (!containerId || !itemId) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Eye size={18} />
                Preview Visual
              </button>
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={!containerId || !itemId}
                className={clsx(
                  'btn btn-primary',
                  (!containerId || !itemId) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Tag size={18} />
                Gerar Etiqueta
              </button>
            </ModalFooter>
          </>
        ) : (
          <>
            {/* ZPL Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Codigo ZPL Gerado</h4>
                <button
                  onClick={handleCopyZPL}
                  className={clsx(
                    'btn text-sm',
                    copied ? 'btn-primary' : 'btn-secondary'
                  )}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto whitespace-pre-wrap">
                {zplCode}
              </div>
            </div>

            {/* Summary */}
            {selectedItem && selectedContainer && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Resumo da Etiqueta:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">SKU:</span>
                    <span className="font-medium">{selectedItem.sku}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Conteiner:</span>
                    <span className="font-medium">{selectedContainer.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Quantidade:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Copias:</span>
                    <span className="font-medium">{copies}</span>
                  </div>
                </div>
              </div>
            )}

            <ModalFooter>
              <button type="button" onClick={() => setShowPreview(false)} className="btn btn-secondary">
                Voltar
              </button>
              <button type="button" onClick={handlePrint} className="btn btn-primary">
                <Printer size={18} />
                Imprimir
              </button>
            </ModalFooter>
          </>
        )}
      </div>
    </Modal>
  )
}
