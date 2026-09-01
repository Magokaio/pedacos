import { LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react'

export interface SidebarNavLeafConfig {
  /** Identificador único do sub-item — usado para saber qual está ativo. */
  key: string
  label: string
  href: string
}

export interface SidebarNavItemConfig {
  /** Identificador único do item — usado para saber qual está ativo. */
  key: string
  label: string
  icon: LucideIcon
  /**
   * Link de destino. Só é usado quando o item NÃO tem `items` (item simples).
   * Por enquanto é só um placeholder ("#"), já que o roteamento ainda não foi
   * adicionado ao projeto. Quando o React Router entrar (veja explicação/rotas.md),
   * troque por um `path` real e use <Link to={item.path}> dentro do SidebarNavItem.
   */
  href?: string
  /**
   * Quando presente, o item vira um grupo expansível: em vez de navegar direto,
   * ele abre/fecha uma lista de sub-itens ao ser clicado.
   */
  items?: SidebarNavLeafConfig[]
}

/**
 * Itens de navegação da sidebar. Para adicionar um novo item no futuro,
 * basta incluir um novo objeto neste array — nenhum outro arquivo precisa mudar.
 * A ordem aqui é a mesma ordem em que os itens aparecem no menu.
 */
export const sidebarNavItems: SidebarNavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '#',
  },
  {
    key: 'usuarios',
    label: 'Usuários',
    icon: Users,
    href: '#',
  },
  {
    key: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    items: [
      { key: 'perfil', label: 'Perfil', href: '#' },
      { key: 'notificacoes', label: 'Notificações', href: '#' },
    ],
  },
]
