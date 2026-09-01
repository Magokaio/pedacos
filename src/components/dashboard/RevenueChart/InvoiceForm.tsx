import { Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { formatCurrency } from './format'
import type { Invoice } from './types'

interface InvoiceFormProps {
  invoices: Invoice[]
  onAdd: (date: string, value: number) => void
  onRemove: (id: string) => void
}

function todayIsoDate(): string {
  const now = new Date()
  const localMidnight = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localMidnight.toISOString().slice(0, 10)
}

const inputClassName =
  'rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/15 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-50 dark:focus:border-amber-500 dark:focus:bg-stone-900'

/**
 * Formulário TEMPORÁRIO para cadastrar faturas manualmente, enquanto não existe
 * uma fonte de dados real. O RevenueChart lê essas faturas (via useInvoices) e
 * se atualiza sozinho — quando a fonte real existir, é só remover este componente.
 */
export function InvoiceForm({ invoices, onAdd, onRemove }: InvoiceFormProps) {
  const [date, setDate] = useState(todayIsoDate)
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const numericValue = Number(value.replace(',', '.'))
    if (!date || !Number.isFinite(numericValue) || numericValue <= 0) return

    onAdd(date, numericValue)
    setValue('')
  }

  const sortedInvoices = [...invoices].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 dark:border-stone-700 dark:bg-stone-900 sm:p-6">
      <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">
        Adicionar fatura
      </h2>
      <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
        Campos temporários pra você testar o gráfico com dados reais — o gráfico
        acima se atualiza sozinho conforme você adiciona faturas aqui.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Data</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className={inputClassName}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Valor (R$)
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
            className={inputClassName}
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </form>

      {sortedInvoices.length > 0 && (
        <ul className="mt-4 flex max-h-56 flex-col gap-1 overflow-y-auto border-t border-stone-100 pt-3 dark:border-stone-800">
          {sortedInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-stone-50 dark:hover:bg-stone-800/60"
            >
              <span className="shrink-0 text-stone-500 dark:text-stone-400">
                {new Date(`${invoice.date}T00:00:00`).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex-1 truncate text-right font-medium text-stone-900 dark:text-stone-50">
                {formatCurrency(invoice.value)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(invoice.id)}
                aria-label="Remover fatura"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-stone-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
