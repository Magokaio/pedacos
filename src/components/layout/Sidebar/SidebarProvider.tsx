import { useState, type ReactNode } from 'react'
import { SidebarContext } from './SidebarContext'

interface SidebarProviderProps {
  children: ReactNode
}

/**
 * Guarda o estado de "recolhida" (telas grandes) e "aberta" (telas pequenas)
 * da sidebar, compartilhado entre o Header (botão de abrir/fechar) e a
 * própria Sidebar.
 */
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleCollapsed() {
    setCollapsed((current) => !current)
  }

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
