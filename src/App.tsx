import { InvoiceForm, RevenueChart, useInvoices } from './components/dashboard/RevenueChart'
import { AppLayout } from './components/layout'

function App() {
  const { invoices, addInvoice, removeInvoice } = useInvoices()

  return (
    <AppLayout title="Dashboard">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <RevenueChart invoices={invoices} />
        <InvoiceForm invoices={invoices} onAdd={addInvoice} onRemove={removeInvoice} />
      </div>
    </AppLayout>
  )
}

export default App
