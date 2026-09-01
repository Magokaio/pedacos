import { useState } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import type { SidebarNavLeafConfig } from './sidebar.config'

interface SidebarNavGroupProps {
  label: string
  icon: LucideIcon
  items: SidebarNavLeafConfig[]
  collapsed?: boolean
  activeKey?: string
  onSelect?: (key: string) => void
}

/**
 * Item da sidebar que expande/recolhe uma lista de sub-itens ao ser clicado,
 * em vez de navegar direto (ex.: "Configurações" > "Perfil", "Notificações").
 */
export function SidebarNavGroup({
  label,
  icon: Icon,
  items,
  collapsed = false,
  activeKey,
  onSelect,
}: SidebarNavGroupProps) {
  const [open, setOpen] = useState(false)

  if (collapsed) {
    // Sidebar reduzida a ícones: não há espaço para mostrar a lista.
    return (
      <div
        title={label}
        className="flex items-center justify-center rounded-lg px-3 py-2 text-stone-400 dark:text-stone-500"
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-1 border-l border-stone-200 pl-[27px] dark:border-stone-800">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={(event) => {
                if (item.href === '#') event.preventDefault()
                onSelect?.(item.key)
              }}
              aria-current={activeKey === item.key ? 'page' : undefined}
              className={[
                'truncate rounded-lg px-3 py-1.5 text-sm transition-colors',
                activeKey === item.key
                  ? 'bg-amber-700 text-white dark:bg-amber-500 dark:text-stone-950'
                  : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
