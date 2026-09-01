import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { SearchField } from '../../SearchField'
import { ThemeToggle } from '../../ThemeToggle'
import { useSidebar } from '../Sidebar'

interface HeaderProps {
  /** Título da página atual — fica vazio até as páginas serem criadas. */
  title?: ReactNode
}

/**
 * Header do topo. Usa o mesmo fundo (`bg-white` / `dark:bg-stone-950`) que a
 * futura área de conteúdo do dashboard e não tem nenhuma borda/linha separando
 * os dois, para que pareçam uma única superfície contínua — só a sidebar, ao
 * lado, tem uma cor diferente.
 */
export function Header({ title }: HeaderProps) {
  const { setMobileOpen } = useSidebar()

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 bg-white px-4 dark:bg-stone-950 sm:px-6">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50 lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {title && (
        <h1 className="hidden shrink-0 text-base font-semibold text-stone-900 dark:text-stone-50 lg:block">
          {title}
        </h1>
      )}

      <SearchField wrapperClassName="max-w-md flex-1" />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ThemeToggle />
        {/* Espaço reservado para itens futuros: notificações, avatar do usuário, etc. */}
      </div>
    </header>
  )
}
