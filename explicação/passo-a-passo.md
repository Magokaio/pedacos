# Passo a passo: como refazer tudo isso sozinho

Este arquivo documenta, em ordem, tudo o que foi feito no projeto até agora — desde o Tailwind até a Sidebar, o Header e o tema claro/escuro. A ideia é você conseguir apagar tudo e reconstruir do zero, seguindo os passos.

Cada parte tem: o **comando** a rodar (quando houver) e o **código completo** de cada arquivo criado ou alterado.

---

## Parte 0 — Criando o projeto do zero (se for começar realmente do início)

Se você já tem o projeto (pasta `Pedaços`), pule para a Parte 1. Se for criar um projeto novo do zero:

```bash
npm create vite@latest nome-do-projeto -- --template react-ts
cd nome-do-projeto
npm install
```

Isso cria um projeto React + TypeScript usando Vite, com um `App.tsx` de exemplo (contador, logos etc.).

---

## Parte 1 — Instalar e configurar o Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

### `vite.config.ts`

Registre o plugin do Tailwind junto com o do React:

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### `src/index.css`

Troque todo o conteúdo do arquivo por:

```css
@import 'tailwindcss';
```

A partir daqui, você já pode usar classes do Tailwind (`flex`, `p-4`, `text-lg`...) direto no JSX.

---

## Parte 2 — Limpar o template padrão do Vite

Apague os arquivos de exemplo que não vamos usar:

```bash
rm src/App.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg public/icons.svg
```

E deixe o `src/App.tsx` mínimo, só pra confirmar que tudo está funcionando:

```tsx
function App() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <h1 className="text-2xl font-semibold">Pedaços</h1>
    </div>
  )
}

export default App
```

Rode `npm run dev` e confira que aparece "Pedaços" centralizado na tela.

---

## Parte 3 — Instalar os ícones (lucide-react)

Usamos a biblioteca [lucide-react](https://lucide.dev/) para os ícones (menu, busca, sol/lua, setas etc.):

```bash
npm install lucide-react
```

---

## Parte 4 — Sistema de tema claro/escuro

A ideia: guardar o tema (`'light'` ou `'dark'`) em um Context do React, aplicar/remover a classe `dark` na tag `<html>`, e salvar a escolha no `localStorage` para lembrar na próxima visita.

### 4.1 — Ativar o modo escuro por classe no Tailwind

O Tailwind v4, por padrão, só liga o modo escuro pela preferência do sistema operacional. Para controlar manualmente com um botão, é preciso avisar o Tailwind que o `dark:` deve reagir a uma classe `.dark` no `<html>`. Adicione ao final do `src/index.css`:

```css
@import 'tailwindcss';

/* Ativa o modo escuro via classe `.dark` na tag <html> (controlado pelo ThemeProvider),
   em vez de depender apenas da preferência do sistema operacional. */
@custom-variant dark (&:where(.dark, .dark *));
```

### 4.2 — Evitar o "flash" de tema errado

Como o React só roda depois que o HTML já apareceu na tela, sem isso a página nasceria sempre clara e "piscaria" para escura um instante depois. A solução é rodar um script pequeno **antes** do React, direto no `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>padacos</title>
    <script>
      // Aplica o tema salvo antes da primeira renderização, evitando o "flash" de tema errado.
      ;(function () {
        var stored = localStorage.getItem('theme')
        var theme =
          stored === 'light' || stored === 'dark'
            ? stored
            : window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
        document.documentElement.classList.toggle('dark', theme === 'dark')
      })()
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 4.3 — O Context de tema

Crie a pasta `src/theme/` com 4 arquivos:

**`src/theme/ThemeContext.ts`**

```ts
import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
```

**`src/theme/ThemeProvider.tsx`**

```tsx
import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

**`src/theme/useTheme.ts`**

```ts
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um <ThemeProvider>')
  }

  return context
}
```

**`src/theme/index.ts`** (barril — reúne os exports da pasta em um só lugar)

```ts
export { ThemeContext } from './ThemeContext'
export type { Theme, ThemeContextValue } from './ThemeContext'
export { ThemeProvider } from './ThemeProvider'
export { useTheme } from './useTheme'
```

### 4.4 — Envolver a aplicação com o `ThemeProvider`

**`src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

### 4.5 — O botão de alternar tema

**`src/components/ThemeToggle/ThemeToggle.tsx`**

```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}
```

**`src/components/ThemeToggle/index.ts`**

```ts
export { ThemeToggle } from './ThemeToggle'
```

Repare que o texto usa `stone-*` (bege) e não `neutral-*`/`slate-*` — veja o motivo na Parte 8, sobre a paleta de cores.

---

## Parte 5 — A Sidebar (menu lateral)

Tudo dentro de `src/components/layout/Sidebar/`. A ideia de separar em vários arquivos pequenos é poder adicionar itens, seções ou trocar a logo sem precisar mexer no resto.

### 5.1 — Lista de itens do menu (fácil de estender)

**`src/components/layout/Sidebar/sidebar.config.ts`**

```ts
import { LayoutDashboard, type LucideIcon } from 'lucide-react'

export interface SidebarNavItemConfig {
  /** Identificador único do item — usado para saber qual está ativo. */
  key: string
  label: string
  icon: LucideIcon
  /**
   * Por enquanto é só um placeholder ("#"), já que o roteamento ainda não foi
   * adicionado ao projeto. Quando o React Router entrar (veja explicação/rotas.md),
   * troque por um `path` real e use <Link to={item.path}> dentro do SidebarNavItem.
   */
  href: string
}

/**
 * Itens de navegação da sidebar. Para adicionar um novo item no futuro,
 * basta incluir um novo objeto neste array — nenhum outro arquivo precisa mudar.
 */
export const sidebarNavItems: SidebarNavItemConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '#',
  },
]
```

> Quer adicionar um item novo no futuro? Basta acrescentar outro objeto neste array, com um `icon` diferente importado do `lucide-react`.

### 5.2 — A marca/logo no topo

**`src/components/layout/Sidebar/SidebarBrand.tsx`**

```tsx
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
```

### 5.3 — Um item de menu

**`src/components/layout/Sidebar/SidebarNavItem.tsx`**

```tsx
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
```

### 5.4 — Agrupador de seções (ex.: "Principal", "Configurações")

**`src/components/layout/Sidebar/SidebarSection.tsx`**

```tsx
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
```

### 5.5 — Estado compartilhado da sidebar (recolhida / aberta no mobile)

O Header precisa "avisar" a Sidebar para abrir no celular, e o botão "Recolher" precisa avisar o resto da sidebar. Para isso, os dois compartilham um Context (igual fizemos com o tema).

**`src/components/layout/Sidebar/SidebarContext.ts`**

```ts
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
```

**`src/components/layout/Sidebar/SidebarProvider.tsx`**

```tsx
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
```

**`src/components/layout/Sidebar/useSidebar.ts`**

```ts
import { useContext } from 'react'
import { SidebarContext } from './SidebarContext'

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebar precisa ser usado dentro de um <SidebarProvider>')
  }

  return context
}
```

### 5.6 — Juntando tudo: o componente `Sidebar`

**`src/components/layout/Sidebar/Sidebar.tsx`**

```tsx
import { useState } from 'react'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import { SidebarBrand } from './SidebarBrand'
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
            {sidebarNavItems.map((item) => (
              <SidebarNavItem
                key={item.key}
                label={item.label}
                icon={item.icon}
                href={item.href}
                collapsed={collapsed}
                active={item.key === activeKey}
                onSelect={() => {
                  setActiveKey(item.key)
                  setMobileOpen(false)
                }}
              />
            ))}
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
```

### 5.7 — Barril de exports da Sidebar

**`src/components/layout/Sidebar/index.ts`**

```ts
export { Sidebar } from './Sidebar'
export { SidebarBrand } from './SidebarBrand'
export { SidebarNavItem } from './SidebarNavItem'
export { SidebarSection } from './SidebarSection'
export { sidebarNavItems } from './sidebar.config'
export type { SidebarNavItemConfig } from './sidebar.config'
export { SidebarProvider } from './SidebarProvider'
export { useSidebar } from './useSidebar'
export type { SidebarContextValue } from './SidebarContext'
```

---

## Parte 6 — Campo de busca (componente reutilizável)

Colocado fora da pasta `layout/`, em `src/components/SearchField/`, porque pode ser útil em outras telas além do Header.

**`src/components/SearchField/SearchField.tsx`**

```tsx
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
```

**`src/components/SearchField/index.ts`**

```ts
export { SearchField } from './SearchField'
```

---

## Parte 7 — O Header

Ele usa exatamente o mesmo fundo (`bg-white` / `dark:bg-stone-950`) que a área de conteúdo, **sem nenhuma borda** separando os dois — para os dois parecerem uma única superfície. Quem separa visualmente é só a sidebar, ao lado, com um tom diferente.

**`src/components/layout/Header/Header.tsx`**

```tsx
import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { SearchField } from '../../SearchField'
import { ThemeToggle } from '../../ThemeToggle'
import { useSidebar } from '../Sidebar'

interface HeaderProps {
  /** Título da página atual — fica vazio até as páginas serem criadas. */
  title?: ReactNode
}

export function Header({ title }: HeaderProps) {
  const { setMobileOpen } = useSidebar()

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 bg-white px-4 dark:bg-stone-950 sm:px-6">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50 lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {title && (
        <h1 className="hidden shrink-0 text-base font-semibold text-stone-900 dark:text-stone-50 lg:block">
          {title}
        </h1>
      )}

      <SearchField wrapperClassName="max-w-md flex-1" />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ThemeToggle />
        {/* Espaço reservado para itens futuros: notificações, avatar do usuário, etc. */}
      </div>
    </header>
  )
}
```

**`src/components/layout/Header/index.ts`**

```ts
export { Header } from './Header'
```

---

## Parte 8 — Juntando tudo no `AppLayout`

**`src/components/layout/AppLayout.tsx`**

```tsx
import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar, SidebarProvider } from './Sidebar'

interface AppLayoutProps {
  title?: ReactNode
  children?: ReactNode
}

/**
 * Estrutura geral da aplicação: sidebar (fixa em telas grandes, em painel
 * deslizante em telas pequenas) + header e conteúdo à direita. O dashboard em
 * si ainda não existe — `children` fica vazio até lá.
 */
export function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-svh bg-white dark:bg-stone-950">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header title={title} />

          <main className="flex-1 overflow-y-auto bg-white px-4 py-4 dark:bg-stone-950 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

**`src/components/layout/index.ts`** (barril de tudo o que é do layout)

```ts
export { AppLayout } from './AppLayout'
export { Header } from './Header'
export {
  Sidebar,
  SidebarBrand,
  SidebarNavItem,
  SidebarSection,
  SidebarProvider,
  sidebarNavItems,
  useSidebar,
} from './Sidebar'
export type { SidebarNavItemConfig, SidebarContextValue } from './Sidebar'
```

E, por fim, o `App.tsx` usa o `AppLayout`:

```tsx
import { AppLayout } from './components/layout'

function App() {
  return (
    <AppLayout>
      {/* O conteúdo do dashboard ainda não foi criado — este é só o "casco" da aplicação. */}
    </AppLayout>
  )
}

export default App
```

---

## Parte 9 — Como funciona a responsividade

O projeto usa o breakpoint `lg` do Tailwind (1024px) como divisor entre "celular/tablet" e "desktop":

- **Abaixo de `lg`**: a `<Sidebar>` vira um painel `fixed` que fica fora da tela (`-translate-x-full`) até o usuário clicar no ícone de menu (☰) no Header, que chama `setMobileOpen(true)`. Quando aberta, aparece um fundo escurecido (`bg-black/40`) atrás dela, que fecha o menu ao ser clicado.
- **A partir de `lg`**: a classe `lg:static` tira a sidebar do modo "flutuante" e ela volta a ocupar espaço normalmente na tela, sempre visível (`lg:translate-x-0`), com a opção de recolher para só ícones (`lg:w-[72px]`) através do botão "Recolher" — que só aparece em telas grandes (`lg:flex` no botão, escondido por padrão com `hidden`).
- O botão de abrir o menu no Header (ícone ☰) também só aparece em telas pequenas: `lg:hidden`.

Essa é a receita geral para deixar qualquer componente novo responsivo: pensar primeiro no celular (classes "base", sem prefixo) e usar `sm:`, `lg:` etc. para ajustar em telas maiores.

---

## Parte 10 — A paleta de cores

A paleta usa dois grupos de cor do Tailwind:

- **`stone`** para os tons neutros (fundos, bordas, textos) — é a cor "cinza" do Tailwind com uma leve tonalidade bege/quente, em vez do cinza puro de `neutral`/`slate`.
- **`amber`** como cor de destaque (accent) — usada nos itens ativos do menu, na marca da sidebar e no foco do campo de busca. `amber-700` no tema claro (mais escuro, bom contraste com texto branco) e `amber-500` no tema escuro (mais claro, mas com texto escuro em cima — `dark:text-stone-950` — para manter um bom contraste).

Se quiser trocar a cor de destaque no futuro, é só trocar `amber` por outra cor do Tailwind (`emerald`, `rose`, `teal`...) nos arquivos `SidebarBrand.tsx`, `SidebarNavItem.tsx` e `SearchField.tsx` — são os três únicos lugares onde ela aparece.

---

## Resumo dos comandos, em ordem

```bash
npm create vite@latest nome-do-projeto -- --template react-ts
cd nome-do-projeto
npm install
npm install tailwindcss @tailwindcss/vite
npm install lucide-react
# ... criar/editar os arquivos conforme as partes 1 a 10 acima ...
npm run dev
```
