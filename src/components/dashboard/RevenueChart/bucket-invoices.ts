import type { Invoice, PeriodKey, RevenuePoint } from './types'

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export interface RevenueBucketResult {
  points: RevenuePoint[]
  /** Total do período imediatamente anterior, para calcular a variação (%). */
  previousTotal: number
}

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function addMonths(date: Date, months: number): Date {
  const copy = new Date(date)
  copy.setMonth(copy.getMonth() + months)
  return copy
}

function parseInvoiceDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`)
}

/** Soma o valor das faturas com data em [start, end). */
function sumInRange(invoices: Invoice[], start: Date, end: Date): number {
  return invoices.reduce((sum, invoice) => {
    const date = parseInvoiceDate(invoice.date)
    return date >= start && date < end ? sum + invoice.value : sum
  }, 0)
}

function bucketBySemana(invoices: Invoice[], today: Date): RevenueBucketResult {
  const end = addDays(startOfDay(today), 1)
  const start = addDays(end, -7)

  const points = Array.from({ length: 7 }, (_, index) => {
    const dayStart = addDays(start, index)
    const dayEnd = addDays(dayStart, 1)
    return {
      label: WEEKDAY_LABELS[dayStart.getDay()],
      value: sumInRange(invoices, dayStart, dayEnd),
    }
  })

  const previousStart = addDays(start, -7)
  return { points, previousTotal: sumInRange(invoices, previousStart, start) }
}

function bucketByMes(invoices: Invoice[], today: Date): RevenueBucketResult {
  const end = addDays(startOfDay(today), 1)
  const start = addDays(end, -28)

  const points = Array.from({ length: 4 }, (_, index) => {
    const weekStart = addDays(start, index * 7)
    const weekEnd = addDays(weekStart, 7)
    return {
      label: `Sem ${index + 1}`,
      value: sumInRange(invoices, weekStart, weekEnd),
    }
  })

  const previousStart = addDays(start, -28)
  return { points, previousTotal: sumInRange(invoices, previousStart, start) }
}

function bucketByAno(invoices: Invoice[], today: Date): RevenueBucketResult {
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const start = addMonths(currentMonthStart, -11)

  const points = Array.from({ length: 12 }, (_, index) => {
    const monthStart = addMonths(start, index)
    const monthEnd = addMonths(monthStart, 1)
    return {
      label: MONTH_LABELS[monthStart.getMonth()],
      value: sumInRange(invoices, monthStart, monthEnd),
    }
  })

  const previousStart = addMonths(start, -12)
  return { points, previousTotal: sumInRange(invoices, previousStart, start) }
}

/** Agrupa as faturas cadastradas nos "baldes" (dia/semana/mês) certos para o período escolhido. */
export function bucketInvoices(
  period: PeriodKey,
  invoices: Invoice[],
  today: Date = new Date(),
): RevenueBucketResult {
  if (period === 'semana') return bucketBySemana(invoices, today)
  if (period === 'mes') return bucketByMes(invoices, today)
  return bucketByAno(invoices, today)
}
