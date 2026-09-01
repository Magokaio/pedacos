interface SidebarBrandProps {
  collapsed?: boolean
}

/**
 * Área de marca/logo no topo da sidebar. Isolada em seu próprio componente
 * para ser fácil de trocar por uma logo real (imagem/SVG) mais tarde.
 */
export function SidebarBrand({ collapsed = false }: SidebarBrandProps) {
  return (
    <div className="flex h-16 items-center gap-2.5 border-b border-stone-200 px-4 dark:border-stone-800">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-700 text-sm font-semibold text-white dark:bg-amber-500 dark:text-stone-950">
        P
      </div>
      {!collapsed && (
        <span className="truncate text-sm font-semibold text-stone-900 dark:text-stone-50">
          Pedaços
        </span>
      )}
    </div>
  )
}
