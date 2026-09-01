# Entendendo o código, pedaço por pedaço

Este arquivo explica cada símbolo e palavra-chave que aparece no código React, para quem nunca programou em JavaScript/TypeScript. A ideia é pegar um trecho de código real e quebrar linha por linha.

Vamos usar este exemplo como referência (o `Contador` do arquivo [react.md](./react.md)):

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

Vamos destrinchar cada parte.

---

## `import { useState } from 'react'`

**Import** é como "pedir emprestado" um pedaço de código que já existe em outro arquivo ou biblioteca.

- `import` → palavra-chave que diz "eu quero usar algo de fora deste arquivo"
- `{ useState }` → o **nome específico** da coisa que eu quero pegar (aqui, a função `useState`). As chaves `{}` servem para pegar itens específicos de dentro do pacote — poderia ser `{ useState, useEffect }` para pegar mais de um
- `from 'react'` → de onde vem esse item. Aqui é do pacote `react`, instalado no `node_modules`

Pense assim: é como abrir uma caixa de ferramentas (`react`) e tirar de dentro só o martelo (`useState`), em vez de carregar a caixa inteira.

Também existe import "sem chaves", quando o pacote exporta só **uma coisa principal**:

```tsx
import React from 'react'
```

E existe import de arquivos seus, usando caminho relativo (`./`):

```tsx
import App from './App.tsx'
```

---

## `function Contador() { ... }`

Isso declara uma **função** — um bloco de código reutilizável que você pode "chamar" (executar) depois.

- `function` → palavra-chave que cria uma função
- `Contador` → o nome que você deu pra ela. Em React, componentes começam com **letra maiúscula** (é assim que o React diferencia "isso é um componente" de "isso é uma tag HTML normal")
- `()` → os **parênteses** guardam os parâmetros (as "entradas") da função. Aqui estão vazios porque esse componente não recebe nada. Se recebesse props, ficaria `function Contador(props) { ... }`
- `{ ... }` → as **chaves** delimitam o **corpo** da função: tudo que ela faz quando é chamada, fica entre esse `{` e esse `}`

Um componente React é, no fundo, só uma função normal que retorna JSX (a "aparência" da tela).

Existe também a forma **arrow function** (função seta), muito comum em React:

```tsx
const Contador = () => {
  // ...
}
```

Isso faz exatamente a mesma coisa que `function Contador() {}`, só que escrito de outro jeito. `() =>` significa "uma função que não recebe parâmetros e faz o que vem depois da seta".

---

## `const [contagem, setContagem] = useState(0)`

Essa linha tem vários conceitos juntos. Vamos por partes.

### `const`

`const` cria uma **variável** — uma "caixinha" com nome que guarda um valor.

- `const` → o valor **não pode ser reatribuído** depois (você não pode fazer `contagem = 5` mais tarde). É o mais usado em React
- `let` → o valor **pode** mudar depois (`let x = 1; x = 2` funciona)
- `var` → forma antiga, hoje em dia evitada

### `useState(0)`

`useState` é uma função do React (um **hook** — veja mais abaixo). Ela cria um "pedaço de estado": um valor que o React lembra entre uma renderização e outra, e que, quando muda, faz a tela atualizar sozinha.

- `useState(0)` → o `0` dentro dos parênteses é o **valor inicial** do estado (a contagem começa em zero)
- `useState` sempre **devolve** (retorna) uma lista com 2 itens: o valor atual, e uma função para atualizá-lo

### `[contagem, setContagem]`

Isso é chamado de **desestruturação de array**. `useState` devolve um array com 2 posições — `[valorAtual, funçãoParaMudar]` — e aqui a gente "abre" esse array e dá um nome a cada posição:

- `contagem` → posição 0: o valor atual do estado
- `setContagem` → posição 1: a função usada para mudar esse valor

Você poderia dar qualquer nome (`[a, b] = useState(0)`), mas por convenção sempre é `[algo, setAlgo]`.

Juntando tudo: **"crie uma variável de estado chamada `contagem`, começando em `0`, e me dê também uma função `setContagem` para atualizá-la."**

---

## `return ( ... )`

`return` é a palavra que diz **o que a função devolve** quando ela é chamada — ou seja, é o "resultado" dela.

No caso de um componente React, o `return` devolve o **JSX**: a descrição de como a tela deve ficar.

- Os parênteses `( )` depois do `return` são **opcionais** — servem só para poder quebrar o JSX em várias linhas sem erro de sintaxe. `return (\n <div />\n)` é igual a `return <div />`

Assim que o `return` é executado, o resto do código da função **não roda mais** (o `return` "sai" da função).

---

## `<button onClick={...}>Cliques: {contagem}</button>`

Isso é **JSX**: parece HTML, mas está dentro de um arquivo `.tsx`, então é interpretado como código.

### `onClick={() => setContagem(contagem + 1)}`

- `onClick` → um **evento**: "quando o usuário clicar neste botão, faça algo". Existem vários: `onChange`, `onSubmit`, `onMouseOver`, etc.
- `{ }` (chaves dentro do JSX) → sempre que você vê `{}` dentro de JSX, significa **"aqui dentro é JavaScript, não texto"**. É a forma de "escapar" do HTML e injetar uma expressão de código
- `() => setContagem(contagem + 1)` → uma **arrow function sem nome** (função anônima), criada na hora, que será executada só quando o clique acontecer. Ela chama `setContagem`, passando o valor atual de `contagem` mais 1

Por que não escrever só `onClick={setContagem(contagem + 1)}` (sem a função)? Porque isso executaria `setContagem` **imediatamente**, ao renderizar a página, e não apenas quando o usuário clicar. Envolver em `() => ...` "atrasa" a execução para o momento certo (o clique).

### `Cliques: {contagem}`

Aqui, `{contagem}` insere o **valor atual** da variável `contagem` como texto na tela. Sempre que `setContagem` for chamado, o React roda a função `Contador` de novo, e esse `{contagem}` mostra o valor novo.

---

## `useEffect` — o que é e para que serve

`useEffect` é outro hook do React. Ele serve para rodar código **em resposta a alguma mudança**, geralmente coisas que "saem" do React: buscar dados numa API, mexer no `document`, criar um timer, etc. Chamamos isso de **efeito colateral**.

```tsx
import { useEffect, useState } from 'react'

function Relogio() {
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date())
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  return <p>{hora.toLocaleTimeString()}</p>
}
```

Quebrando o `useEffect`:

```tsx
useEffect(() => {
  // código que roda
}, [])
```

- `useEffect(` → chama o hook
- `() => { ... }` → **primeiro argumento**: uma função com o código que você quer executar
- `, []` → **segundo argumento**: um array de **dependências**. Ele controla **quando** o efeito roda de novo:
  - `[]` (vazio) → roda **uma única vez**, quando o componente aparece na tela pela primeira vez
  - `[contagem]` → roda de novo **toda vez que `contagem` mudar**
  - sem passar o array nenhum → roda depois de **toda** renderização (raramente é o que você quer)
- `return () => clearInterval(intervalo)` (dentro do efeito) → uma função de **limpeza**, opcional. Roda quando o componente sai da tela, ou antes do efeito rodar de novo — usada para "desfazer" o que o efeito fez (parar um timer, cancelar uma inscrição, etc.)

---

## Outros símbolos comuns

### `{ }` sozinhas (fora de JSX) — objetos

```tsx
const usuario = { nome: 'Ana', idade: 30 }
```

Isso é um **objeto**: uma coleção de pares `chave: valor`. Para acessar um valor: `usuario.nome`.

### `{ nome, idade }` — desestruturação de objeto

```tsx
function Perfil({ nome, idade }: { nome: string; idade: number }) {
  return <p>{nome} tem {idade} anos</p>
}
```

Em vez de receber um objeto `props` inteiro e escrever `props.nome`, `props.idade`, a gente "abre" o objeto direto nos parênteses e já pega `nome` e `idade` prontos para usar. É muito comum em componentes que recebem props.

### `: string`, `: number` — tipos (TypeScript)

```tsx
function saudacao(nome: string): string {
  return 'Olá, ' + nome
}
```

O `: string` depois de `nome` diz **"este parâmetro deve ser um texto"**. O `: string` depois dos parênteses diz **"esta função devolve um texto"**. Isso é TypeScript (um "JavaScript com tipos"), e serve para o editor avisar você **antes** de rodar o código, se algo estiver errado (ex.: passar um número onde era esperado um texto).

### `=>` — arrow function

Já vimos, mas resumindo: `(parametros) => resultado` é uma forma curta de escrever uma função.

```tsx
const dobro = (x) => x * 2       // forma curta: retorna x * 2 automaticamente
const dobro2 = (x) => { return x * 2 }  // mesma coisa, forma longa com chaves + return
```

- Sem chaves `{}` depois da seta → o que vem depois é **devolvido automaticamente** (sem precisar escrever `return`)
- Com chaves `{}` → vira um bloco normal, e aí **precisa** de `return` explícito se quiser devolver algo

### `.map()` — transformar listas

```tsx
const numeros = [1, 2, 3]
const dobrados = numeros.map((n) => n * 2) // [2, 4, 6]
```

`.map` pega cada item de um array, aplica a função que você deu, e devolve um **novo array** com os resultados. Em React, é usado para transformar uma lista de dados em uma lista de elementos JSX (veja exemplos em [react.md](./react.md)).

### `? :` — operador ternário

```tsx
const mensagem = logado ? 'Bem-vindo' : 'Faça login'
```

É um "if" resumido em uma linha: `condição ? valorSeVerdadeiro : valorSeFalso`. Muito usado dentro do JSX para mostrar coisas diferentes dependendo de uma condição.

### `!` depois de um valor (TypeScript)

```tsx
document.getElementById('root')!
```

O `!` aqui diz ao TypeScript: **"eu tenho certeza que isso não vai ser `null`, pode confiar em mim"**. Normalmente `getElementById` poderia devolver `null` (se o elemento não existisse), e o `!` só silencia o aviso do TypeScript sobre isso.

---

## Glossário rápido

| Símbolo / palavra | Significado resumido |
|---|---|
| `import` / `export` | trazer/entregar código entre arquivos |
| `function` | declara uma função |
| `()` depois de um nome | parâmetros (entradas) da função |
| `{}` depois de `function nome()` | corpo da função (o que ela faz) |
| `{}` dentro de JSX | "aqui entra código JS", não é texto puro |
| `{}` fora de JSX, com `chave: valor` | um objeto |
| `const` / `let` | cria uma variável (não muda / pode mudar) |
| `return` | devolve o resultado da função |
| `=>` | cria uma arrow function |
| `useState` | hook que cria e atualiza estado |
| `useEffect` | hook que roda código em resposta a mudanças |
| `.map()` | transforma cada item de um array |
| `? :` | if resumido (ternário) |
| `: tipo` | anotação de tipo (TypeScript) |
| `!` depois de um valor | "confia em mim, isso não é null" (TypeScript) |

## Onde ir depois

- Fundamentos do React: [react.md](./react.md)
- Rotas: [rotas.md](./rotas.md)
