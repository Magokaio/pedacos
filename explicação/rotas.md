# Rotas no React (React Router)

O React, sozinho, não sabe o que é uma "página" — ele só sabe renderizar componentes. Para ter várias páginas dentro de uma mesma aplicação (ex.: `/`, `/sobre`, `/produtos/123`) sem recarregar o navegador a cada clique, usamos uma biblioteca de rotas. A mais usada no ecossistema React é o **React Router** (`react-router-dom`).

Isso é o que chamamos de **SPA (Single Page Application)**: existe apenas um `index.html`, e o React troca o conteúdo da tela conforme a URL muda, sem recarregar a página inteira.

## Instalação

Dentro da pasta do projeto:

```bash
npm install react-router-dom
```

## Configuração básica

### 1. Envolver a aplicação com o `BrowserRouter`

No `src/main.tsx`, envolva o `<App />` com o `BrowserRouter` — ele é quem escuta a URL do navegador:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### 2. Definir as rotas

Dentro do `App.tsx` (ou de um arquivo dedicado, como `src/routes.tsx`), use `<Routes>` e `<Route>` para mapear cada caminho (`path`) a um componente (`element`):

```tsx
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import NaoEncontrado from './pages/NaoEncontrado'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="*" element={<NaoEncontrado />} /> {/* rota "coringa" para 404 */}
    </Routes>
  )
}

export default App
```

## Navegando entre páginas

### `Link` — para links clicáveis

Nunca use `<a href="/sobre">` para navegação interna: isso recarrega a página inteira. Use `<Link>`, que troca a rota sem reload:

```tsx
import { Link } from 'react-router-dom'

function Menu() {
  return (
    <nav>
      <Link to="/">Início</Link>
      <Link to="/sobre">Sobre</Link>
    </nav>
  )
}
```

### `useNavigate` — para navegar via código

Útil depois de uma ação, como enviar um formulário:

```tsx
import { useNavigate } from 'react-router-dom'

function FormularioLogin() {
  const navigate = useNavigate()

  function handleSubmit() {
    // ...lógica de login
    navigate('/dashboard')
  }

  return <button onClick={handleSubmit}>Entrar</button>
}
```

## Parâmetros de rota (rotas dinâmicas)

Para páginas como `/produtos/42`, onde `42` é dinâmico, use `:` na definição da rota e o hook `useParams` para lê-lo:

```tsx
<Route path="/produtos/:id" element={<Produto />} />
```

```tsx
import { useParams } from 'react-router-dom'

function Produto() {
  const { id } = useParams()
  return <p>Mostrando o produto de id {id}</p>
}
```

## Rotas aninhadas (layouts compartilhados)

Quando várias páginas compartilham um layout (ex.: um menu lateral), você aninha rotas e usa `<Outlet />` no componente pai para indicar onde a rota filha deve aparecer:

```tsx
<Routes>
  <Route path="/" element={<LayoutPrincipal />}>
    <Route index element={<Home />} />           {/* rota "/" */}
    <Route path="sobre" element={<Sobre />} />    {/* rota "/sobre" */}
  </Route>
</Routes>
```

```tsx
import { Outlet } from 'react-router-dom'

function LayoutPrincipal() {
  return (
    <div>
      <Menu />
      <main>
        <Outlet /> {/* aqui entra Home ou Sobre, dependendo da URL */}
      </main>
    </div>
  )
}
```

## Query strings (`?busca=algo`)

Para ler parâmetros depois do `?` na URL, use `useSearchParams`:

```tsx
import { useSearchParams } from 'react-router-dom'

function Busca() {
  const [searchParams] = useSearchParams()
  const termo = searchParams.get('busca')

  return <p>Buscando por: {termo}</p>
}
```

## Resumo rápido

| Ferramenta | Para que serve |
|---|---|
| `BrowserRouter` | Envolve a aplicação e ativa o roteamento |
| `Routes` + `Route` | Mapeiam URL → componente |
| `Link` | Navegação por clique, sem recarregar a página |
| `useNavigate` | Navegação via código (ex.: após um submit) |
| `useParams` | Lê parâmetros dinâmicos da URL (`/produtos/:id`) |
| `useSearchParams` | Lê query strings (`?busca=algo`) |
| `Outlet` | Marca onde as rotas filhas devem renderizar dentro de um layout |

## Onde ir depois

- Fundamentos do React: veja [`react.md`](./react.md)
- Documentação oficial: https://reactrouter.com/
