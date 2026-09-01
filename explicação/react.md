# O que é o React

React é uma biblioteca JavaScript para construir interfaces de usuário (UI). Em vez de manipular o HTML da página diretamente (como se faz com `document.querySelector`, por exemplo), você descreve **como a interface deve parecer para cada estado dos dados**, e o React se encarrega de atualizar a tela quando esses dados mudam.

Foi criado pelo Facebook (Meta) e hoje é mantido pela comunidade e por várias empresas. É a base de frameworks maiores, como o Next.js.

## Ideias centrais

### 1. Componentes

Tudo em React é construído a partir de **componentes**: funções JavaScript que retornam a interface (usando uma sintaxe chamada JSX). Um componente pode ser tão pequeno quanto um botão ou tão grande quanto uma página inteira.

```tsx
function Ola() {
  return <h1>Olá, mundo!</h1>
}
```

Componentes podem ser combinados dentro de outros componentes, formando uma árvore — igual pastas dentro de pastas.

```tsx
function App() {
  return (
    <div>
      <Ola />
      <Ola />
    </div>
  )
}
```

### 2. JSX

JSX é a sintaxe que mistura HTML com JavaScript dentro do `.tsx`/`.jsx`. Não é HTML de verdade — é açúcar sintático que vira chamadas de função (`React.createElement`) por baixo dos panos.

```tsx
const nome = 'Maria'

function Saudacao() {
  return <p>Olá, {nome}!</p> // {} injeta uma expressão JS dentro do JSX
}
```

Diferenças importantes em relação ao HTML comum:
- `class` vira `className`
- `for` (de label) vira `htmlFor`
- Todo elemento precisa ser fechado (`<img />`, `<br />`)
- Um componente só pode retornar **um** elemento raiz (ou um fragmento `<> </>`)

### 3. Props

Props são os "parâmetros" de um componente — como você passa dados de um componente pai para um filho.

```tsx
function Botao({ texto }: { texto: string }) {
  return <button>{texto}</button>
}

function App() {
  return <Botao texto="Salvar" />
}
```

Props são somente leitura: o componente filho não deve alterá-las.

### 4. Estado (`useState`)

Estado é dado que muda ao longo do tempo e que, quando muda, faz a tela ser atualizada automaticamente. Para isso usamos o hook `useState`.

```tsx
import { useState } from 'react'

function Contador() {
  const [contagem, setContagem] = useState(0)

  return (
    <button onClick={() => setContagem(contagem + 1)}>
      Cliques: {contagem}
    </button>
  )
}
```

- `contagem` é o valor atual
- `setContagem` é a função usada para atualizá-lo
- Chamar `setContagem` faz o componente renderizar de novo com o novo valor

### 5. Eventos

Eventos em React são parecidos com os do HTML, mas em camelCase e recebendo uma função:

```tsx
<button onClick={() => alert('Clicou!')}>Clique aqui</button>
```

### 6. Hooks

Hooks são funções especiais (sempre começam com `use`) que dão superpoderes a componentes de função. Os mais usados:

| Hook | Para que serve |
|---|---|
| `useState` | Guardar e atualizar estado |
| `useEffect` | Rodar código em resposta a mudanças (ex.: buscar dados de uma API) |
| `useRef` | Guardar um valor que não causa re-render, ou referenciar um elemento do DOM |
| `useContext` | Compartilhar dados entre vários componentes sem passar props manualmente |

Exemplo de `useEffect` buscando dados quando o componente é montado:

```tsx
import { useEffect, useState } from 'react'

function ListaDeUsuarios() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch('/api/usuarios')
      .then((res) => res.json())
      .then((dados) => setUsuarios(dados))
  }, []) // array vazio = roda só uma vez, quando o componente monta

  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>{u.nome}</li>
      ))}
    </ul>
  )
}
```

> Regra de ouro dos hooks: só chame hooks no topo de componentes ou de outros hooks, nunca dentro de `if`, `for` ou funções aninhadas.

### 7. Renderização de listas

Usa-se `.map()` para transformar um array em elementos JSX. Cada item precisa de uma prop `key` única (geralmente um id) para o React saber identificar cada item entre renderizações.

```tsx
const frutas = ['maçã', 'banana', 'uva']

function Lista() {
  return (
    <ul>
      {frutas.map((fruta) => (
        <li key={fruta}>{fruta}</li>
      ))}
    </ul>
  )
}
```

### 8. Renderização condicional

```tsx
function Mensagem({ logado }: { logado: boolean }) {
  return <p>{logado ? 'Bem-vindo de volta!' : 'Faça login'}</p>
}
```

## Como usar o React no dia a dia (com Vite)

Este projeto já está configurado com [Vite](https://vite.dev/), a forma mais rápida de rodar React hoje em dia.

```bash
npm install       # instala as dependências
npm run dev       # inicia o servidor de desenvolvimento (com hot reload)
npm run build     # gera a versão de produção na pasta dist/
```

Fluxo típico de trabalho:

1. Crie um componente em `src/`, por exemplo `src/components/Cartao.tsx`.
2. Exporte-o com `export default function Cartao() { ... }`.
3. Importe e use dentro de outro componente: `import Cartao from './components/Cartao'`.
4. Salve o arquivo — o Vite atualiza a página automaticamente (HMR).

## Onde ir depois

- Rotas (navegação entre páginas): veja [`rotas.md`](./rotas.md)
- Documentação oficial: https://react.dev/
