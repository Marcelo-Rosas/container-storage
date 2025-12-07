import type { PackingItem } from '../types'

// ============================================
// TIPOS DE COLUNAS ESPERADAS NO CSV/EXCEL
// ============================================
interface PackingListRow {
  sku?: string
  codigo?: string
  code?: string
  description?: string
  descricao?: string
  descriptionPt?: string
  descricao_pt?: string
  quantity?: number | string
  quantidade?: number | string
  qty?: number | string
  weight?: number | string
  peso?: number | string
  unitWeight?: number | string
  peso_unitario?: number | string
  length?: number | string
  comprimento?: number | string
  width?: number | string
  largura?: number | string
  height?: number | string
  altura?: number | string
  ncm?: string
  origin?: string
  origem?: string
  brand?: string
  marca?: string
  model?: string
  modelo?: string
  unitPrice?: number | string
  preco_unitario?: number | string
  price?: number | string
  location?: string
  localizacao?: string
  [key: string]: unknown
}

// ============================================
// RESULTADO DO PARSE
// ============================================
export interface ParseResult {
  success: boolean
  items: Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'>[]
  errors: string[]
  warnings: string[]
  summary: {
    totalItems: number
    totalQuantity: number
    totalWeight: number
    totalVolume: number
  }
}

// ============================================
// PARSER CSV
// ============================================
export function parseCSV(csvContent: string): ParseResult {
  const errors: string[] = []
  const warnings: string[] = []
  const items: Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'>[] = []

  try {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      return {
        success: false,
        items: [],
        errors: ['Arquivo CSV vazio ou sem dados'],
        warnings: [],
        summary: { totalItems: 0, totalQuantity: 0, totalWeight: 0, totalVolume: 0 },
      }
    }

    // Detectar separador (vírgula ou ponto-e-vírgula)
    const headerLine = lines[0]
    const separator = headerLine.includes(';') ? ';' : ','

    // Parse header
    const headers = headerLine.split(separator).map(h =>
      h.trim().toLowerCase().replace(/['"]/g, '').replace(/\s+/g, '_')
    )

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line, separator)
      const row: PackingListRow = {}

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim().replace(/['"]/g, '') || ''
      })

      const item = parseRow(row, i + 1, errors, warnings)
      if (item) {
        items.push(item)
      }
    }

    // Calcular sumário
    const summary = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
      totalWeight: items.reduce((sum, i) => sum + i.totalWeight, 0),
      totalVolume: items.reduce((sum, i) => sum + i.totalVolume, 0),
    }

    return {
      success: errors.length === 0,
      items,
      errors,
      warnings,
      summary,
    }
  } catch (error) {
    return {
      success: false,
      items: [],
      errors: [`Erro ao processar CSV: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
      warnings: [],
      summary: { totalItems: 0, totalQuantity: 0, totalWeight: 0, totalVolume: 0 },
    }
  }
}

// ============================================
// PARSE LINHA CSV (COM SUPORTE A ASPAS)
// ============================================
function parseCSVLine(line: string, separator: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === separator && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

// ============================================
// PARSE ROW PARA ITEM
// ============================================
function parseRow(
  row: PackingListRow,
  lineNumber: number,
  errors: string[],
  warnings: string[]
): Omit<PackingItem, 'id' | 'containerId' | 'createdAt' | 'updatedAt'> | null {
  // SKU (obrigatório)
  const sku = row.sku || row.codigo || row.code || ''
  if (!sku) {
    errors.push(`Linha ${lineNumber}: SKU não informado`)
    return null
  }

  // Descrição
  const description = row.description || row.descricao || sku
  const descriptionPt = row.descriptionPt || row.descricao_pt || row.descricao || description

  // Quantidade
  const quantity = parseNumber(row.quantity || row.quantidade || row.qty || '1')
  if (quantity <= 0) {
    warnings.push(`Linha ${lineNumber}: Quantidade inválida, assumindo 1`)
  }
  const finalQuantity = quantity > 0 ? quantity : 1

  // Peso
  const unitWeight = parseNumber(row.unitWeight || row.peso_unitario || row.weight || row.peso || '0')
  const totalWeight = unitWeight * finalQuantity

  // Dimensões (em cm)
  const length = parseNumber(row.length || row.comprimento || '0')
  const width = parseNumber(row.width || row.largura || '0')
  const height = parseNumber(row.height || row.altura || '0')

  // Volume (m³)
  const unitVolume = (length * width * height) / 1000000 // cm³ para m³
  const totalVolume = unitVolume * finalQuantity

  // Preço
  const unitPrice = parseNumber(row.unitPrice || row.preco_unitario || row.price || '0')
  const totalPrice = unitPrice * finalQuantity

  // Outros campos
  const ncm = (row.ncm || '').toString()
  const origin = row.origin || row.origem || 'CHINA'
  const brand = row.brand || row.marca || ''
  const model = row.model || row.modelo || ''
  const location = row.location || row.localizacao || ''

  return {
    sku,
    description,
    descriptionPt,
    quantity: finalQuantity,
    currentQuantity: finalQuantity,
    unitWeight,
    totalWeight,
    length,
    width,
    height,
    unitVolume,
    totalVolume,
    ncm,
    origin,
    brand,
    model,
    unitPrice,
    totalPrice,
    location,
  }
}

// ============================================
// PARSE EXCEL (XLSX)
// ============================================
export async function parseExcel(_file: File): Promise<ParseResult> {
  // Para suporte completo a Excel, seria necessário usar uma biblioteca como xlsx
  // Por enquanto, retornamos erro indicando para usar CSV
  return {
    success: false,
    items: [],
    errors: ['Arquivos Excel (.xlsx) requerem conversão para CSV. Por favor, exporte o arquivo como CSV.'],
    warnings: [],
    summary: { totalItems: 0, totalQuantity: 0, totalWeight: 0, totalVolume: 0 },
  }
}

// ============================================
// PARSE ARQUIVO
// ============================================
export async function parsePackingListFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv' || extension === 'txt') {
    const content = await file.text()
    return parseCSV(content)
  }

  if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file)
  }

  return {
    success: false,
    items: [],
    errors: [`Formato de arquivo não suportado: .${extension}. Use .csv`],
    warnings: [],
    summary: { totalItems: 0, totalQuantity: 0, totalWeight: 0, totalVolume: 0 },
  }
}

// ============================================
// UTILITÁRIO: PARSE NÚMERO
// ============================================
function parseNumber(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (!value) return 0

  // Remover caracteres não numéricos exceto ponto e vírgula
  const cleaned = value.toString()
    .replace(/[^\d.,\-]/g, '')
    .replace(',', '.')

  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

// ============================================
// TEMPLATE CSV
// ============================================
export function generateCSVTemplate(): string {
  const headers = [
    'sku',
    'description',
    'descriptionPt',
    'quantity',
    'unitWeight',
    'length',
    'width',
    'height',
    'ncm',
    'origin',
    'brand',
    'model',
    'unitPrice',
    'location',
  ]

  const exampleRow = [
    'IT9528',
    'IMPULSE SERIES CROSSFIT RACK FULL CAGE',
    'RACK CROSSFIT GAIOLA COMPLETA',
    '2',
    '285',
    '220',
    '180',
    '250',
    '9506.91.00',
    'CHINA',
    'IMPULSE',
    'IT9528',
    '2850',
    'A1-01',
  ]

  return `${headers.join(';')}\n${exampleRow.join(';')}`
}

// ============================================
// DOWNLOAD TEMPLATE
// ============================================
export function downloadCSVTemplate() {
  const csv = generateCSVTemplate()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'packing_list_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
