import { useEffect, useState } from 'react'
import type { Invoice } from './types'

const STORAGE_KEY = 'pedacos:faturas'

function loadInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Invoice[]) : []
  } catch {
    return []
  }
}

/**
 * Guarda as faturas cadastradas manualmente (pelo InvoiceForm) no localStorage,
 * enquanto não existe uma fonte de dados real (API, planilha, banco etc.).
 * Quando essa fonte existir, troque este hook por um que busque os dados de lá
 * — o RevenueChart só espera receber um array de `Invoice`, então nada mais muda.
 */
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
  }, [invoices])

  function addInvoice(date: string, value: number) {
    setInvoices((current) => [...current, { id: crypto.randomUUID(), date, value }])
  }

  function removeInvoice(id: string) {
    setInvoices((current) => current.filter((invoice) => invoice.id !== id))
  }

  return { invoices, addInvoice, removeInvoice }
}
