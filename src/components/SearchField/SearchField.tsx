import { Search } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  wrapperClassName?: string
}

export function SearchField({
  wrapperClassName = '',
  className = '',
  placeholder = 'Buscar...',
  ...props
}: SearchFieldProps) {
  return (
    <div className={`relative min-w-0 ${wrapperClassName}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
      <input
        type="search"
        placeholder={placeholder}
        className={`w-full rounded-lg border border-stone-200 bg-stone-100 py-2 pl-9 pr-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/15 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-50 dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:bg-stone-950 ${className}`}
        {...props}
      />
    </div>
  )
}
