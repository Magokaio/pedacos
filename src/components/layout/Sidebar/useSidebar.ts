import { useContext } from 'react'
import { SidebarContext } from './SidebarContext'

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebar precisa ser usado dentro de um <SidebarProvider>')
  }

  return context
}
