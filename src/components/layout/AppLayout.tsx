import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar, SidebarProvider } from './Sidebar'

interface AppLayoutProps {
  title?: ReactNode
  children?: ReactNode
}

/**
 * Estrutura geral da aplicação: sidebar (fixa em telas grandes, em painel
 * deslizante em telas pequenas) + header e conteúdo à direita. O dashboard em
 * si ainda não existe — `children` fica vazio até lá.
 */
export function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-svh bg-white dark:bg-stone-950">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header title={title} />

          <main className="flex-1 overflow-y-auto bg-white px-4 py-4 dark:bg-stone-950 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
