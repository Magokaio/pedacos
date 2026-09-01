# Como colocar esse projeto no seu notebook

O código está no GitHub, no repositório `MAGOKAIO/pedacos`. Aqui vai o passo a passo pra rodar ele em outro computador (ex.: seu notebook).

## 1. Instalar os pré-requisitos (só na primeira vez)

No notebook, você precisa ter instalado:

- **Git** — https://git-scm.com/downloads
- **Node.js** (versão 20 ou mais recente) — https://nodejs.org/ (o `npm` já vem junto)

Pra conferir se já tem os dois instalados, abra um terminal (PowerShell, no Windows) e rode:

```bash
git --version
node --version
npm --version
```

Se algum comando der erro de "não reconhecido", é porque falta instalar aquele programa.

## 2. Clonar o repositório

Escolha uma pasta onde você quer guardar o projeto (ex.: `Documentos`) e rode:

```bash
git clone https://github.com/MAGOKAIO/pedacos.git
cd pedacos
```

Isso baixa uma cópia completa do projeto (com todo o histórico) para o seu notebook.

> Como o repositório é **privado**, o Git vai pedir pra você fazer login na sua conta do GitHub (`MAGOKAIO`) na primeira vez — geralmente abre uma janela do navegador pra você autorizar.

## 3. Instalar as dependências

Dentro da pasta do projeto:

```bash
npm install
```

Isso lê o `package.json` e baixa tudo que o projeto precisa (React, Tailwind, Vite etc.) para a pasta `node_modules/` — que **não** vem no repositório (por isso o `npm install` é necessário sempre que você clona o projeto em uma máquina nova).

## 4. Rodar o projeto

```bash
npm run dev
```

O terminal vai mostrar um endereço, algo como:

```
Local:   http://localhost:5173/
```

Abra esse endereço no navegador e o projeto vai estar rodando. Enquanto o `npm run dev` estiver ligado, qualquer alteração que você fizer no código atualiza a página sozinha.

Pra parar o servidor, é só apertar `Ctrl + C` no terminal.

## 5. Trazer atualizações futuras

Se você (ou eu) fizer mudanças no projeto em outro computador e mandar (`git push`) pro GitHub, pra trazer essas mudanças pro notebook depois é só rodar, dentro da pasta do projeto:

```bash
git pull
npm install
```

O `npm install` de novo é só por garantia, caso alguma dependência nova tenha sido adicionada — se nada mudou nas dependências, ele não faz nada de diferente.

## Resumo dos comandos (primeira vez)

```bash
git clone https://github.com/MAGOKAIO/pedacos.git
cd pedacos
npm install
npm run dev
```
