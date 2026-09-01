import { useState } from 'react'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { SidebarBrand } from './SidebarBrand'
import { SidebarNavGroup } from './SidebarNavGroup'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarSection } from './SidebarSection'
import { sidebarNavItems } from './sidebar.config'
import { useSidebar } from './useSidebar'

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const [activeKey, setActiveKey] = useState(sidebarNavItems[0]?.key)

  return (
    <>
      {/* Fundo escurecido atrás da sidebar quando aberta em telas pequenas. */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={[
          // Base (telas pequenas): painel fixo que desliza por cima do conteúdo.
          'fixed inset-y-0 left-0 z-50 flex h-svh w-64 shrink-0 flex-col border-r border-stone-200 bg-stone-50 transition-transform duration-200 dark:border-stone-800 dark:bg-stone-900',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // A partir de `lg`: volta a fazer parte do layout normal, sempre visível.
          'lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
        ].join(' ')}
      >
        <div className="relative">
          <SidebarBrand collapsed={collapsed} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
            className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50 lg:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          <SidebarSection title="Principal" collapsed={collapsed}>
            {sidebarNavItems.map((item) =>
              item.items ? (
                <SidebarNavGroup
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  items={item.items}
                  collapsed={collapsed}
                  activeKey={activeKey}
                  onSelect={(key) => {
                    setActiveKey(key)
                    setMobileOpen(false)
                  }}
                />
              ) : (
                <SidebarNavItem
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  href={item.href ?? '#'}
                  collapsed={collapsed}
                  active={item.key === activeKey}
                  onSelect={() => {
                    setActiveKey(item.key)
                    setMobileOpen(false)
                  }}
                />
              ),
            )}
          </SidebarSection>

          {/* Novas seções/itens podem ser adicionados aqui do mesmo jeito,
              ou incluindo mais entradas em sidebar.config.ts. */}
        </nav>

        <div className="border-t border-stone-200 p-3 dark:border-stone-800">
          <button
            type="button"
            onClick={toggleCollapsed}
            className={[
              // O recolher para ícone-only só faz sentido em telas grandes.
              'hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50 lg:flex',
              collapsed ? 'justify-center' : '',
            ].join(' ')}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? (
              <ChevronsRight className="h-[18px] w-[18px] shrink-0" />
            ) : (
              <>
                <ChevronsLeft className="h-[18px] w-[18px] shrink-0" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
