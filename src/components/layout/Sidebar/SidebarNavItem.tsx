import type { LucideIcon } from 'lucide-react'

interface SidebarNavItemProps {
  label: string
  icon: LucideIcon
  href: string
  active?: boolean
  collapsed?: boolean
  onSelect?: () => void
}

export function SidebarNavItem({
  label,
  icon: Icon,
  href,
  active = false,
  collapsed = false,
  onSelect,
}: SidebarNavItemProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (href === '#') event.preventDefault()
        onSelect?.()
      }}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center' : '',
        active
          ? 'bg-amber-700 text-white dark:bg-amber-500 dark:text-stone-950'
          : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50',
      ].join(' ')}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </a>
  )
}
