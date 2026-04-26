# Customers MCP

MCP server que expõe um CRUD de clientes como ferramentas utilizáveis por agentes compatíveis com o **Model Context Protocol (MCP)**, como GitHub Copilot, ChatGPT e outros.

## Visão Geral

Este projeto permite que agentes interajam com uma API de clientes via ferramentas MCP, abstraindo chamadas HTTP e facilitando automações inteligentes.

Principais recursos:

* CRUD completo de clientes
* Integração com MCP (`@modelcontextprotocol/sdk`)
* Tipagem com Zod
* Suporte a execução local e via container
* Publicação em registry privado (Verdaccio) ou npm público

---

## Instalação

```bash
npm install
```

---

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

---

## Inspecionar MCP

```bash
npm run mcp:inspect
```

---

## Testes

```bash
npm test
```

Testes específicos:

```bash
npm run test:unit
npm run test:e2e
```

Modo watch/debug:

```bash
npm run test:dev
```

---

## Registry Privado (Verdaccio)

Subir o registry local:

```bash
npm run registry:start
```

Acessar: http://localhost:4873

### Criar usuário

```bash
npm run registry:adduser
```

### Login

```bash
npm run registry:login:private
```

### Publicar pacote

```bash
npm run release:private
```

Parar o registry:

```bash
npm run registry:stop
```

---

## Publicação no npm
O projeto usa o arquivo .npmrc para receber o Token

```bash
export NPM_TOKEN=your-token
npm run registry:login:public
npm run release:public
```

---

## Uso com MCP

Após rodar o servidor, ele pode ser conectado a qualquer cliente MCP apontando para:

```bash
node src/index.ts
```

As ferramentas expostas incluem operações como:

* Criar cliente
* Listar clientes
* Buscar por ID
* Atualizar cliente
* Remover cliente

---

## Requisitos

* Node.js `v24.14.0`
* Docker (para registry local opcional)

---

## Tecnologias

* Node.js (ESM)
* MCP SDK
* Zod
* TSX

---

## Observações

* O binário `customers-mcp` pode ser usado diretamente após publicação
* Projeto preparado para evolução com novos tools MCP
