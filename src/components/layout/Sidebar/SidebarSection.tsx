import type { ReactNode } from 'react'

interface SidebarSectionProps {
  /** Título opcional do grupo (ex.: "Principal", "Configurações"). */
  title?: string
  collapsed?: boolean
  children: ReactNode
}

/**
 * Agrupa itens da sidebar sob um título opcional. Útil no futuro para
 * separar, por exemplo, "Principal" de "Configurações" ou "Administração".
 */
export function SidebarSection({ title, collapsed = false, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && !collapsed && (
        <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          {title}
        </span>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}
