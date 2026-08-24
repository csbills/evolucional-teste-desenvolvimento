# Painel de Produtos

Aplicação React para gerenciamento de produtos, desenvolvida como teste prático. O projeto permite listar, buscar, filtrar, visualizar, criar, editar e remover produtos.

## Tecnologias

- React 19 com TypeScript
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- Biome para lint e formatação
- JSON Server como API fake local

## Pré-requisitos

- Node.js 20.19 ou superior (ou 22.12 ou superior)
- npm

## Instalação

Dentro desta pasta, instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell, use:

```powershell
Copy-Item .env.example .env
```

A variável padrão aponta para a API local:

```env
VITE_API_URL=http://localhost:3001
```

## Executando o projeto

Em um terminal, inicie a API fake usando o arquivo `db.json`:

```bash
npx json-server@0.17.4 --watch db.json --port 3001
```

Em outro terminal, inicie a aplicação:

```bash
npm run dev
```

Depois, abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Rotas principais

- `/produtos` — listagem, busca, filtro por categoria e paginação
- `/produtos/novo` — cadastro de produto
- `/produtos/:id` — detalhes do produto
- `/produtos/:id/editar` — edição do produto

A busca possui debounce de 400 ms para evitar requisições a cada tecla digitada. Os filtros e a paginação são mantidos na URL, permitindo compartilhar ou recarregar o estado da listagem.

## Scripts disponíveis

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # verifica os tipos e gera a versão de produção
npm run lint     # executa as validações do Biome
npm test         # executa os testes automatizados
npm run format   # formata os arquivos do projeto
npm run preview  # serve a versão de produção localmente
```

Os testes de componentes usam React Testing Library, Vitest e jsdom.
