export type PeriodKey = 'semana' | 'mes' | 'ano'

export interface RevenuePoint {
  /** Rótulo mostrado no eixo X (dia, semana do mês, ou mês do ano). */
  label: string
  /** Soma do faturamento naquele ponto, em reais. */
  value: number
}

export interface Invoice {
  id: string
  /** Data da fatura, no formato ISO (yyyy-mm-dd). */
  date: string
  /** Valor da fatura, em reais. */
  value: number
}
