import { createContext } from 'react'

export interface SidebarContextValue {
  /** Sidebar reduzida a apenas ícones — usada em telas grandes (`lg:`). */
  collapsed: boolean
  toggleCollapsed: () => void
  /** Sidebar aberta como painel sobre o conteúdo — usada em telas pequenas. */
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)
