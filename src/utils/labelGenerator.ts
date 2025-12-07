import type { PackingItem, Container, Settings } from '../types'

// ============================================
// FORMATO ZPL PARA IMPRESSORAS TÉRMICAS
// SELBETI / ZEBRA COMPATÍVEL
// ============================================

export interface LabelData {
  sku: string
  description: string
  containerCode: string
  clientName: string
  location: string
  weight: number
  dimensions: string
  quantity: number
  barcode: string
  date: string
}

// ============================================
// GERADOR DE CÓDIGO DE BARRAS (CODE128)
// ============================================
function generateBarcode(text: string): string {
  // Código simplificado - em produção usar biblioteca como JsBarcode
  return text.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 20)
}

// ============================================
// GERAR LABEL DATA A PARTIR DE ITEM
// ============================================
export function createLabelData(
  item: PackingItem,
  container: Container,
  quantity: number = 1
): LabelData {
  return {
    sku: item.sku,
    description: item.descriptionPt || item.description,
    containerCode: container.code,
    clientName: container.clientName,
    location: item.location || 'A DEFINIR',
    weight: item.unitWeight,
    dimensions: `${item.length}x${item.width}x${item.height}cm`,
    quantity,
    barcode: generateBarcode(item.sku),
    date: new Date().toLocaleDateString('pt-BR'),
  }
}

// ============================================
// GERAR ZPL PARA SELBETI / ZEBRA
// ============================================
export function generateZPL(data: LabelData, settings: Settings): string {
  const { paperWidth, paperHeight, dpi } = settings.labels

  // Calcular unidades (dots) baseado no DPI
  const widthDots = Math.round((paperWidth / 25.4) * dpi)
  const heightDots = Math.round((paperHeight / 25.4) * dpi)

  // Template ZPL
  const zpl = `
^XA
^PW${widthDots}
^LL${heightDots}
^FO20,20^A0N,30,30^FD${data.clientName.substring(0, 25)}^FS
^FO20,60^A0N,45,45^FD${data.sku}^FS
^FO20,115^A0N,25,25^FD${data.description.substring(0, 35)}^FS
^FO20,150^BY2,2,60^BCN,60,Y,N,N^FD${data.barcode}^FS
^FO20,230^A0N,22,22^FDContainer: ${data.containerCode}^FS
^FO20,260^A0N,22,22^FDLocal: ${data.location}^FS
^FO20,290^A0N,22,22^FDPeso: ${data.weight}kg  |  ${data.dimensions}^FS
^FO20,320^A0N,22,22^FDQtd: ${data.quantity}  |  Data: ${data.date}^FS
^XZ
`.trim()

  return zpl
}

// ============================================
// GERAR LABEL HTML PARA VISUALIZAÇÃO
// ============================================
export function generateLabelHTML(data: LabelData): string {
  return `
    <div style="
      width: 100mm;
      height: 50mm;
      padding: 3mm;
      border: 1px solid #000;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      box-sizing: border-box;
    ">
      <div style="font-size: 8pt; color: #666; margin-bottom: 2mm;">
        ${data.clientName}
      </div>
      <div style="font-size: 14pt; font-weight: bold; margin-bottom: 2mm;">
        ${data.sku}
      </div>
      <div style="font-size: 9pt; margin-bottom: 3mm; max-height: 12mm; overflow: hidden;">
        ${data.description}
      </div>
      <div style="text-align: center; margin: 3mm 0; font-family: 'Libre Barcode 128', cursive; font-size: 36pt;">
        ${data.barcode}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 8pt;">
        <span>CTN: ${data.containerCode}</span>
        <span>LOC: ${data.location}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 8pt; margin-top: 1mm;">
        <span>${data.weight}kg | ${data.dimensions}</span>
        <span>QTD: ${data.quantity}</span>
      </div>
      <div style="font-size: 7pt; text-align: right; margin-top: 1mm; color: #666;">
        ${data.date}
      </div>
    </div>
  `
}

// ============================================
// GERAR LABEL DE DEVOLUÇÃO
// ============================================
export function generateReturnLabel(
  item: PackingItem,
  container: Container,
  returnAddress: string
): string {
  const data = createLabelData(item, container)

  return `
^XA
^PW812
^LL406
^FO20,20^A0N,25,25^FDDEVOLVER PARA:^FS
^FO20,50^A0N,30,30^FD${returnAddress.substring(0, 40)}^FS
^FO20,90^A0N,20,20^FD${'_'.repeat(40)}^FS
^FO20,120^A0N,40,40^FD${data.sku}^FS
^FO20,170^A0N,25,25^FD${data.description.substring(0, 35)}^FS
^FO20,210^BY2,2,60^BCN,60,Y,N,N^FD${data.barcode}^FS
^FO20,290^A0N,22,22^FDOrigem: ${data.containerCode}^FS
^FO20,320^A0N,22,22^FDCliente: ${data.clientName.substring(0, 30)}^FS
^FO20,350^A0N,20,20^FDData: ${data.date}^FS
^XZ
`.trim()
}

// ============================================
// GERAR LABEL DE EXPEDIÇÃO
// ============================================
export function generateShippingLabel(
  item: PackingItem,
  container: Container,
  destination: {
    name: string
    address: string
    city: string
    state: string
    cep: string
  },
  nf: string
): string {
  const data = createLabelData(item, container)

  return `
^XA
^PW812
^LL609
^FO20,20^A0N,35,35^FDEXPEDICAO^FS
^FO20,60^A0N,25,25^FDDESTINO:^FS
^FO20,90^A0N,28,28^FD${destination.name.substring(0, 35)}^FS
^FO20,125^A0N,22,22^FD${destination.address.substring(0, 40)}^FS
^FO20,155^A0N,22,22^FD${destination.city}/${destination.state} - CEP: ${destination.cep}^FS
^FO20,195^A0N,20,20^FD${'_'.repeat(45)}^FS
^FO20,225^A0N,40,40^FD${data.sku}^FS
^FO20,275^A0N,22,22^FD${data.description.substring(0, 40)}^FS
^FO20,310^BY2,2,70^BCN,70,Y,N,N^FD${data.barcode}^FS
^FO20,400^A0N,22,22^FDNF: ${nf}^FS
^FO300,400^A0N,22,22^FDPeso: ${data.weight}kg^FS
^FO20,435^A0N,20,20^FDOrigem: ${container.code} | ${data.date}^FS
^XZ
`.trim()
}

// ============================================
// IMPRIMIR ETIQUETA (SELBETI/ZEBRA)
// ============================================
export async function printLabel(zpl: string, printerIP?: string): Promise<boolean> {
  // Método 1: Enviar direto para impressora de rede
  if (printerIP) {
    try {
      const response = await fetch(`http://${printerIP}:9100`, {
        method: 'POST',
        body: zpl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.ok
    } catch {
      console.warn('Falha ao imprimir via rede, tentando método alternativo...')
    }
  }

  // Método 2: Abrir janela de impressão com visualização
  const printWindow = window.open('', '_blank', 'width=400,height=300')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Etiqueta</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
            }
            pre {
              background: #f5f5f5;
              padding: 10px;
              border-radius: 4px;
              font-size: 10px;
              overflow: auto;
            }
            .instructions {
              margin-top: 20px;
              padding: 10px;
              background: #e3f2fd;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <h3>Comando ZPL para Impressora</h3>
          <pre>${zpl}</pre>
          <div class="instructions">
            <strong>Instrucoes:</strong>
            <ol>
              <li>Copie o comando acima</li>
              <li>Cole no software da impressora SELBETI/Zebra</li>
              <li>Ou envie via TCP/IP para a porta 9100</li>
            </ol>
          </div>
          <button onclick="navigator.clipboard.writeText(\`${zpl.replace(/`/g, '\\`')}\`).then(() => alert('Copiado!'))">
            Copiar Comando
          </button>
        </body>
      </html>
    `)
    printWindow.document.close()
    return true
  }

  return false
}

// ============================================
// IMPRIMIR MÚLTIPLAS ETIQUETAS
// ============================================
export function generateBatchZPL(labels: LabelData[], settings: Settings): string {
  return labels.map(data => generateZPL(data, settings)).join('\n')
}

// ============================================
// PREVIEW HTML DE ETIQUETA
// ============================================
export function openLabelPreview(data: LabelData) {
  const previewWindow = window.open('', '_blank', 'width=450,height=250')
  if (previewWindow) {
    previewWindow.document.write(`
      <html>
        <head>
          <title>Preview Etiqueta - ${data.sku}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #f0f0f0;
              font-family: sans-serif;
            }
            .label-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            button {
              display: block;
              margin: 15px auto 0;
              padding: 8px 24px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
            }
            button:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            ${generateLabelHTML(data)}
            <button onclick="window.print()">Imprimir</button>
          </div>
        </body>
      </html>
    `)
    previewWindow.document.close()
  }
}
