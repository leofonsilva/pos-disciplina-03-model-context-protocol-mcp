# Pós Disciplina 03 – Model Context Protocol (MCP)

## Introdução
Este repositório contém todos os projetos desenvolvidos durante a disciplina **Model Context Protocol (MCP)**, abordando desde conceitos fundamentais do protocolo MCP até implementações avançadas em produção, integração com LLMs e técnicas de segurança e governança.

Cada módulo foi desenvolvido para demonstrar na prática como o Model Context Protocol revoluciona a forma como conectamos Large Language Models (LLMs) a APIs, bancos de dados e serviços internos. O repositório explora desde o uso de servidores MCP existentes até o desenvolvimento do zero, publicação de pacotes npm, e integração com frameworks como LangChain e LangGraph, utilizando TypeScript como linguagem principal.

## Módulos

### Módulo 01: Visão geral de MCP (Model Context Protocol)
- Sem projetos

### Módulo 02: Como usar MCP para conectar LLMs a APIs, bancos de dados e serviços internos
**Projeto:** [Multiple MCP Tools](module-02)

**Tecnologias utilizadas:**
- **Fastify** - Framework web rápido e de baixo overhead para Node.js
- **LangGraph** - Framework para construção de grafos de agentes com estado
- **@langchain/mcp-adapters** - Adaptador para integração com servidores MCP
- **@langchain/openai** - Cliente para acesso a modelos via OpenRouter
- **MongoDB MCP Server** - Servidor MCP para operações em banco de dados
- **Filesystem MCP Server** - Servidor MCP para manipulação de arquivos
- **TypeScript** - Linguagem tipada para desenvolvimento robusto

**Conceitos abordados:**
- Model Context Protocol (MCP) - Padrão para expor ferramentas e dados para LLMs
- MultiServerMCPClient - Gerenciamento de múltiplos servidores MCP
- Ferramentas MCP: MongoDB (consultas, inserções) e Filesystem (leitura/escrita)
- Ferramentas customizadas (csv_to_json) integradas ao agente
- LangGraph - Construção de pipelines de agentes com nós especializados
- Agentes com capacidade de usar ferramentas (tool calling)
- Configuração de modelos via OpenRouter (temperature, maxTokens, provider strategy)
- Separação de responsabilidades: servidor HTTP, lógica de negócio, ferramentas

**Aplicação prática:**
O projeto implementa um servidor HTTP Fastify que atua como gateway para um agente LangGraph capacitado a usar ferramentas MCP. O sistema inclui:
- Rota `/chat` que recebe perguntas contendo dados (ex: CSV)
- Agente que pode converter CSV para JSON, consultar/inserir no MongoDB e manipular arquivos
- Infraestrutura Docker com MongoDB e Mongo-Express
- Demonstração prática de como conectar LLMs a APIs, bancos de dados e serviços internos através do MCP, permitindo que o modelo execute ações no mundo real.

**Projeto:** [Transforming Services into Tools](module-02-a)

**Tecnologias utilizadas:**
- **Fastify** - Framework web rápido e de baixo overhead para Node.js
- **LangGraph** - Framework para construção de grafos de agentes com estado
- **@langchain/mcp-adapters** - Adaptador para integração com servidores MCP
- **@langchain/openai** - Cliente para acesso a modelos via OpenRouter
- **SerpAPI** - API para busca de dados do Google Trends
- **Filesystem MCP Server** - Servidor MCP para manipulação de arquivos
- **TypeScript** - Linguagem tipada para desenvolvimento robusto

**Conceitos abordados:**
- Model Context Protocol (MCP) - Padrão para expor ferramentas e dados para LLMs
- MultiServerMCPClient - Gerenciamento de servidores MCP (filesystem)
- Ferramentas MCP (filesystem) e customizadas (google_trends) integradas ao agente
- LangGraph com fluxo de pesquisador (researcher) e respondedor (responder)
- Agentes com capacidade de usar ferramentas (tool calling)
- Integração com APIs externas (SerpAPI Google Trends) via ferramenta customizada
- Configuração de modelos via OpenRouter (temperature, maxTokens, provider strategy)
- Separação de responsabilidades: servidor HTTP, lógica de negócio, ferramentas
- Cache de respostas para otimização de performance

**Aplicação prática:**
O projeto implementa um servidor HTTP Fastify que atua como gateway para um agente LangGraph com acesso a ferramentas MCP e externas. O sistema inclui:
- Rota `/chat` para perguntas sobre estratégia de conteúdo de vídeo
- Agente que pesquisa tendências do Google Trends e gera recomendações de títulos
- Acesso ao sistema de arquivos via MCP para leitura/escrita
- Transformação de serviços externos (SerpAPI) em ferramentas para LLMs
- Cache de respostas para reduzir chamadas de API
- Demonstração de como criar agentes autônomos que combinam múltiplas fontes de dados.

### Módulo 03: MCPs vs Tools tradicionais para ambiente de desenvolvimento
**Projeto:** [Entendendo Agents e Instructions](module-03)

**Tecnologias utilizadas:**
- **GitHub Copilot** - Assistente de IA para desenvolvimento
- **Copilot Agents** - Agentes especializados configuráveis
- **Playwright** - Framework de testes end-to-end

**Conceitos abordados:**
- Agentes especializados via arquivos de configuração `.agent.md`
- Integração de ferramentas MCP nos agentes
- Automação de desenvolvimento com TDD
- Geração e correção automática de testes
- Separação de responsabilidades por agente

**Aplicação prática:**
Este projeto demonstra como configurar agentes do GitHub Copilot para automatizar tarefas de desenvolvimento. Os agentes são definidos em arquivos `.agent.md` na pasta `.github/agents/` e podem ser invocados no VS Code com `@nome-do-agente`.
- Necessário apenas que a pasta .github/ esteja na raiz do projeto para que funcione corretamente.
- Sempre que quiser buscar um melhor padrão para alguma tecnologia use o prefixo 'Awesome' + tecnologia no GitHub. Vai encontrar os melhores padrões assim
- Playwright foi usado de exemplo, mas pode-se fazer o mesmo com qualquer outra ferramenta para extrair o máximo de benefícios dela.

**Agentes configurados (exemplos testados):**
- `@developer` — Implementa features seguindo TDD, SOLID e imutabilidade
- `@playwright-test-planner` — Mapeia fluxos da aplicação e gera planos de teste
- `@playwright-test-generator` — Transforma planos em código Playwright executável
- `@playwright-test-healer` — Debugga e corrige testes quebrados automaticamente

**Como usar:**
1. Copie os arquivos `.agent.md` para `.github/agents/` do seu repositório
2. No VS Code com GitHub Copilot ativado, use `@agent` para chamar um agente
3. Siga o fluxo: Planner → Generator → (Healer se necessário)
4. Adapte os agentes conforme sua stack e necessidades

**Personalização:**
Os agentes são totalmente customizáveis. Edite os arquivos `.agent.md` para ajustar:
- Descrição e escopo de atuação
- Ferramentas disponíveis (MCP servers, search, edit, etc.)
- Princípios e padrões de código
- Modelo LLM utilizado (ex: Claude Sonnet, GPT-4)

**Exemplo de invocação:**
```
@playwright-test-planner Crie plano de teste para checkout
@playwright-test-generator Gere testes a partir do plano
@playwright-test-healer Corrija falhas
@developer Implementa feature de filtros
```

**Projeto:** [Entendendo skills](module-03-a)

**Tecnologias utilizadas:**
- **GitHub Copilot Skills** - Pacotes modulares para estender agentes
- **Skills CLI** (`npx skills`) - Gerenciador de pacotes de skills
- **YAML/JSON** - Formato de configuração de skills

**Conceitos abordados:**
- Skills como unidades de capacidades reutilizáveis
- Descoberta e instalação de skills via Skills CLI
- Ecosistema skills.sh - repositório de skills comunitárias
- Customização de agentes através de skills compostas
- Versionamento e lockfile de dependências (skills-lock.json)

**Aplicação prática:**
Skills são pacotes que adicionam novas capacidades aos agentes do GitHub Copilot. Cada skill define:
- Nome e descrição (usados pelo agente para auto-diagnose)
- Gatilhos de ativação (quando a skill deve ser usada)
- Guias de referência com exemplos práticos
- Configurações específicas da ferramenta

**Skills instaladas (exemplos testados):**
- `ffmpeg` — Processamento de vídeo e áudio (conversão, compressão, corte, extração)
- `find-skills` — Descobre e instala novas skills do ecossistema
- `neo4j-cypher-guide` — Guia moderno para consultas Cypher no Neo4j

**Como usar:**
1. Instale skills via CLI: `npx skills add <owner/repo>`
2. As skills são automaticamente disponibilizadas para os agentes
3. Os agentes decidem quando usar cada skill baseado nos gatilhos
4. Gerencie dependências com `skills-lock.json` para reprodutibilidade

**Fluxo de trabalho:**
```bash
# Buscar skills disponíveis
npx skills find video processing

# Instalar uma skill
npx skills add digitalsamba/claude-code-video-toolkit@ffmpeg

# Verificar atualizações
npx skills check

# Atualizar todas
npx skills update
```

**Criando sua própria skill:**
1. Crie uma estrutura com `SKILL.md` (descrição, gatilhos) e `reference.md` (exemplos)
2. Publique em um repositório GitHub
3. Outros podem instalar com `npx skills add seu-usuario/sua-skill`
4. Combine múltiplas skills para criar agentes especializados

**Exemplo de invocação:**
```
@agent Converta esse GIF para MP4 otimizado para web
# O agente usa a skill ffmpeg automaticamente
```

**Personalização:**
Edite os arquivos em `.agents/skills/` para customizar ou criar novas skills. O `skills-lock.json` garante que todos os desenvolvedores usem as mesmas versões.

### Módulo 04: CypherSuite MCP: Desenvolvendo MCPs do zero

**Projeto:** [MCP do Zero](module-04)

**Tecnologias utilizadas:**
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **Node.js Crypto** - Módulo nativo para criptografia (AES-256-CBC, scrypt)
- **TypeScript** - Linguagem tipada para desenvolvimento robusto
- **Zod** - Validação de schemas de entrada e saída
- **VS Code Copilot Chat** - Cliente MCP integrado ao editor

**Conceitos abordados:**
- Arquitetura de servidores MCP (Model Context Protocol)
- Três tipos de capacidades: Tools, Resources, Prompts
- Implementação de criptografia AES-256-CBC com derivação de chaves scrypt
- Comunicação via stdio (entrada/saída padrão)
- Validação de schemas com Zod
- Publicação de pacotes MCP para uso no VS Code
- MCP Inspector para testes interativos

**Aplicação prática:**
Este projeto demonstra como criar um servidor MCP completo "do zero" usando o SDK oficial. O servidor fornece capacidades de criptografia que podem ser usadas diretamente no VS Code Copilot Chat:

**Tools (ferramentas executáveis):**
- `encrypt_message` — Criptografa qualquer texto com uma senha (AES-256-CBC)
- `decrypt_message` — Descriptografa mensagens com a mesma senha

**Resources (recursos consultáveis):**
- `encryption://info` — Documentação técnica do algoritmo, derivação de chaves e formato de saída

**Prompts (templates de uso):**
- `encrypt_message_prompt` — Template pré-construído para pedir criptografia
- `decrypt_message_prompt` — Template pré-construído para pedir descriptografia

**Como usar:**
1. **No VS Code:** Adicione o servidor em `.vscode/mcp.json`:
   ```json
   {
     "servers": {
       "ciphersuite-mcp": {
         "command": "node",
         "args": ["--experimental-strip-types", "caminho/para/module-04/src/index.ts"]
       }
     }
   }
   ```
2. **Recarregue o VS Code** (Cmd+Shift+P → Developer: Reload Window)
3. **Use no Copilot Chat:**
   - "Encrypt the message 'Hello World' with passphrase 'secret'"
   - "Decrypt this message: a3f1...:ciphertext using key 'secret'"
   - "Show me the encryption://info resource"

**Testando com MCP Inspector:**
```bash
npm run mcp:inspect
```
Abre uma interface web para explorar todas as ferramentas, recursos e prompts interativamente.

**Publicação como pacote npm:**
```bash
npm publish --access public
```
Depois outros podem usar com:
```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "npx",
      "args": ["-y", "@leofonsilva/ciphersuite-mcp"]
    }
  }
}
```

### Módulo 05: Transformando sua empresa em um servidor MCP
**Projeto:** [Customers MCP](module-05)

**Tecnologias utilizadas:**
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **Fastify** - Framework web para API REST de clientes (no subprojeto)
- **TypeScript** - Linguagem tipada para desenvolvimento robusto
- **Zod** - Validação de schemas de entrada e saída
- **Node.js Fetch API** - Cliente HTTP para comunicação com API
- **VS Code Copilot Chat** - Cliente MCP integrado ao editor

**Conceitos abordados:**
- Arquitetura de servidores MCP com Tools, Resources e Prompts
- Padrão arquitetural Clean Architecture (Domain, Application, Infrastructure)
- Separação de responsabilidades: Serviços, Clientes HTTP, Entidades
- Validação de dados com Zod em múltiplas camadas
- Encapsulamento de APIs REST existentes como ferramentas MCP
- CRUD completo (Create, Read, Update, Delete) exposto ao LLM
- Busca flexível de clientes (por ID, nome ou telefone)
- Tratamento de erros e mensagens amigáveis para IA

**Aplicação prática:**
Este projeto demonstra como criar um servidor MCP que encapsula uma API REST de clientes, permitindo que um LLM gerencie registros de clientes através de comandos naturais.

**Tools (ferramentas executáveis):**
- `list_customers` — Retorna todos os clientes cadastrados
- `get_customer` — Busca um cliente por ID, nome ou telefone (busca flexível)
- `create_customer` — Cria um novo cliente (name, phone)
- `update_customer` — Atualiza nome e/ou telefone de um cliente existente
- `delete_customer` — Remove um cliente pelo ID

**Resources (recursos consultáveis):**
- `customers://api-info` — Documentação da API REST encapsulada (endpoints, formato de dados)

**Prompts (templates de uso):**
- `find_customer_prompt` — Template para buscar clientes usando critérios flexíveis

**Como usar:**
1. **Configure a API de clientes** (subprojeto `nodejs-fastify-mongodb-crud/`):
   ```bash
   cd module-05/nodejs-fastify-mongodb-crud
   npm install
   npm run docker:infra:up # Roda a API em um container docker para atender o MCP
   ```

2. **Inicie o servidor MCP:**
   ```bash
   cd module-05
   npm install
   npm run dev
   ```

3. **No VS Code:** Adicione em `.vscode/mcp.json`:
   ```json
   {
     "servers": {
       "customers-mcp": {
         "command": "node",
         "args": ["--experimental-strip-types", "module-05/src/index.ts"]
       }
     }
   }
   ```

4. **Use no Copilot Chat:**
   - "List all customers"
   - "Find customer with phone 555-0100"
   - "Create a new customer named John Doe with phone 555-1234"
   - "Update customer with id 'abc123' to change name to Jane Smith"
   - "Delete customer with id 'abc123'"

**Testando com MCP Inspector:**
```bash
npm run mcp:inspect
```
Explora interativamente todas as ferramentas, recursos e prompts no navegador.

### Módulo 06: Segurança e governança em MCPs
**Projeto:** [Customers MCP v2](module-06)

**Tecnologias utilizadas:**
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **Fastify** - Framework web para API REST de clientes (subprojeto)
- **TypeScript** - Linguagem tipada com tipos inferidos
- **Zod** - Validação de schemas em múltiplas camadas
- **Node.js Fetch API** - Cliente HTTP com interceptação de erros
- **VS Code Copilot Chat** - Cliente MCP integrado
- **JWT / Bearer Token** - Autenticação entre serviços

**Conceitos abordados:**
- Servidor MCP que **depende de uma API interna** para operações reais
- Autenticação service-to-service com tokens Bearer
- Tratamento de erros específicos (401, 403, 429) com classes customizadas
- Separação de responsabilidades mantida (Domain, Application, Infrastructure)
- Validação dupla: Zod nos schemas MCP + validação na API
- Logs de erro amigáveis para LLMs (sem vazar detalhes internos)
- Padrão Repository com cliente HTTP reutilizável
- Configuração via variáveis de ambiente (SERVICE_TOKEN obrigatório)

**Aplicação prática:**
Este projeto é uma evolução do module-05, adicionando **autenticação e tratamento de erros robusto**. O servidor MCP atua como **gateway seguro** para uma API REST de clientes, exigindo um token de serviço para operações.

**Tools (ferramentas MCP):**
- `list_customers` — Lista todos os clientes (requer token válido)
- `get_customer` — Busca por ID, nome ou telefone (flexível)
- `create_customer` — Cria novo cliente {name, phone}
- `update_customer` — Atualiza cliente por _id
- `delete_customer` — Remove cliente por _id

**Resources:**
- `customers://api-info` — Documentação da API REST (endpoints, formato)

**Prompts:**
- `find_customer_prompt` — Template para buscas flexíveis

**Como usar (passo a passo):**

**1. Configure a API de clientes** (subprojeto `nodejs-fastify-mongodb-crud/`):
```bash
cd module-06/nodejs-fastify-mongodb-crud
npm install
npm run docker:infra:up   # Sobe MongoDB + API em containers
# API rodará em http://localhost:9999/v1
```

**2. Gere um token de serviço** (ou use o script fornecido):
```bash
# Opção A: Use o script fornecido (se existir)
./getServiceToken.sh

# Opção B: Gere manualmente via API de auth (depende da implementação)
# Consulte a documentação da API para endpoint de token
```

**3. Configure a variável de ambiente:**
```bash
export SERVICE_TOKEN="seu-token-aqui"
# Ou crie um arquivo .env na raiz do module-06
```

**4. Inicie o servidor MCP:**
```bash
cd module-06
npm install
npm run dev
# Log: "Customers MCP Server running on stdio"
```

**5. Adicione no VS Code** (`.vscode/mcp.json`):
```json
{
  "servers": {
    "customers-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "./src/index.ts"],
      "env": {
        "SERVICE_TOKEN": "token-hash" // Gerado através do comando "sh getServiceToken.sh". Após, escolha qual role deseja usar
      },
    }
  }
}
```
**Importante:** O servidor NÃO inicia sem `SERVICE_TOKEN` definido (validação no index.ts).

**6. Use no Copilot Chat:**
```
List all customers
Find customer with phone 555-0100
Create customer named "John Doe" with phone 555-1234
Update customer with id "abc123" to name "Jane Smith"
Delete customer with id "abc123"
```

**Testando com MCP Inspector:**
```bash
npm run mcp:inspect
```
Abre UI web para explorar tools, resources e prompts.

**Tratamento de erros (o LLM vê):**
- **401 Unauthorized**: "Unauthorized: service token is missing or invalid"
- **403 Forbidden**: "Forbidden: token does not have sufficient permissions"
- **429 Rate Limit**: "Rate limit exceeded. Please try again later."
- **Outros**: "HTTP {status} - {statusText}" (sem stack trace)

**Fluxo de autenticação:**
```
LLM → MCP Server (module-06) → Bearer Token → API Fastify (module-06/nodejs-fastify-mongodb-crud) → MongoDB
         ↑                                                    ↑
    SERVICE_TOKEN required                          Validação JWT/role (se houver)
```

### Módulo 07: MCP em produção
**Projeto:** [Customers MCP v3](module-07)

**Tecnologias utilizadas:**
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **Fastify** - Framework web para API REST de clientes (subprojeto)
- **TypeScript** - Linguagem tipada com suporte a shebang executável
- **Zod** - Validação de schemas em múltiplas camadas
- **Node.js Fetch API** - Cliente HTTP com autenticação Bearer
- **VS Code Copilot Chat** - Cliente MCP integrado
- **Verdaccio** - Registry npm privado para testes de publicação
- **npm** - Gerenciador de pacotes e distribuição
- **tsx** - Executor TypeScript com shebang support

**Conceitos abordados:**
- Publicação de pacotes MCP no npm (registry público e privado)
- Automação de versionamento e release com npm scripts
- Configuração de registry privado (Verdaccio) para testes
- Shebang executável (`#!/usr/bin/env tsx`) para CLI tools
- Gerenciamento de tokens de autenticação (NPM_TOKEN)
- Versionamento semântico (`npm version patch/minor/major`)
- Distribuição de ferramentas MCP como pacotes reutilizáveis
- Boas práticas para pacotes CLI (bin field, files array)
- Separação de ambientes (development vs production)

**Aplicação prática:**
Este módulo é uma evolução do module-06, com foco em **publicação e distribuição** do servidor MCP como pacote npm. O projeto demonstra como transformar um servidor MCP em uma ferramenta CLI instalável globalmente, com suporte a registry privado para testes.

**Scripts de publicação disponíveis:**

```bash
# Registry privado (Verdaccio)
npm run registry:start              # Sobe registry em http://localhost:4873
npm run registry:adduser.private    # Cria usuário no registry privado
npm run registry:login:private      # Login no registry privado
npm run release:private             # Versiona e publica no registry privado

# Registry público (npmjs.org)
npm run registry:login:public       # Login no npmjs (usa NPM_TOKEN)
npm run release:public              # Versiona e publica no npm público
```

**Fluxo de trabalho completo:**

**1. Desenvolvimento local:**
```bash
cd module-07
npm install
npm run dev                         # Testa o servidor MCP localmente
npm test                            # Roda testes
npm run mcp:inspect                 # Inspeciona ferramentas
```

**2. Teste de publicação (registry privado):**
```bash
# Sobre Verdaccio (registry local)
npm run registry:start              # Docker sobe Verdaccio em localhost:4873

# Configura autenticação
npm run registry:adduser.private    # Cria usuário (ex: leofonsilva)
npm run registry:login:private      # Login interativo

# Publica no registry privado
npm run release:private             # npm version patch && npm publish --registry http://localhost:4873
```

**3. Publicação em produção (npmjs):**
```bash
# Configura token de acesso ao npmjs (uma vez apenas)
# No CI/CD ou local: export NPM_TOKEN="seu-token-aqui"
# .npmrc já está configurado para usar ${NPM_TOKEN}

# Login (se necessário)
npm run registry:login:public       # Usa NPM_TOKEN do .npmrc

# Release
npm run release:public              # npm version patch && npm publish --access public
```

**4. Uso como pacote global:**
```bash
# Instalação global (após publicação no npmjs)
npm install -g @leofonsilva/customers-mcp

# Execução direta (binário customers-mcp)
customers-mcp                       # Inicia servidor MCP (requer SERVICE_TOKEN)

# Ou via npx (sem instalação global)
npx @leofonsilva/customers-mcp
```

**Configuração necessária no ambiente do usuário:**
```bash
# Variável de ambiente para autenticação na API interna
export SERVICE_TOKEN="token-da-sua-api"

# Token npm para publicação (CI/CD ou local)
export NPM_TOKEN="token-do-npmjs"
```

**Como usar (após instalação):**

**No VS Code** (`.vscode/mcp.json`):
```json
{
  "servers": {
    "customers-mcp": {
      "command": "customers-mcp",
      "args": [],
      "env": {
        "SERVICE_TOKEN": "token-da-api-interna"
      }
    }
  }
}
```

**No Copilot Chat:**
```
List all customers
Create customer "John Doe" with phone "555-1234"
Find customer with phone "555-1234"
Update customer id "abc123" to name "Jane Smith"
Delete customer id "abc123"
```

**Testando antes de publicar:**
```bash
# 1. Sobe registry privado
npm run registry:start

# 2. Publica no registry local
npm run release:private

# 3. Em outro terminal, instala a partir do registry local
npm install --registry http://localhost:4873 @leofonsilva/customers-mcp

# 4. Testa a instalação
customers-mcp --help  # Se implementado
```

**Versionamento semântico automático:**
```bash
# Aumenta patch (0.0.1 → 0.0.2)
npm run release:private  # executa: npm version patch && npm publish

# Aumenta minor (0.0.2 → 0.1.0)
npm version minor && npm publish

# Aumenta major (0.1.0 → 1.0.0)
npm version major && npm publish
```

**Publicação em CI/CD (exemplo GitHub Actions):**
```yaml
- name: Publish to npm
  run: |
    npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_TOKEN }}
    npm version patch -m "chore: release v%s"
    npm publish --access public
```
Bearer Token → API Fastify (module-06/nodejs-fastify-mongodb-crud) → MongoDB
         ↑                                                    ↑
    SERVICE_TOKEN required                          Validação JWT/role (se houver)
```

**Publicação como pacote npm:**
```bash
npm publish --access public
```
Uso por outros:
```json
{
  "servers": {
    "customers-mcp": {
      "command": "npx",
      "args": ["-y", "@leofonsilva/customers-mcp"],
      "env": {
        "SERVICE_TOKEN": "token-hash"
      },
    }
  }
}
```
**Aviso:** O pacote requer `SERVICE_TOKEN` configurado no ambiente do usuário.

### Módulo 08: Usando nosso MCP com Langchain.js
**Projeto:** [Multiple MCP Tools](module-08)

**Tecnologias utilizadas:**
- **Fastify** - Framework web rápido e de baixo overhead para Node.js
- **LangGraph** - Framework para construção de grafos de agentes com estado
- **@langchain/mcp-adapters** - Adaptador para integração com servidores MCP
- **@langchain/openai** - Cliente para acesso a modelos via OpenRouter
- **LangChain** - Framework para integração de LLMs com ferramentas e agentes
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **MultiServerMCPClient** - Gerenciamento de múltiplos servidores MCP
- **TypeScript** - Linguagem tipada para desenvolvimento robusto
- **Zod** - Validação de schemas (usado nos servidores MCP)

**Conceitos abordados:**
- Integração de servidores MCP customizados com LangChain
- Uso de pacotes MCP publicados no npm em agentes LangChain
- MultiServerMCPClient para gerenciar múltiplos servidores MCP simultaneamente
- Tool calling em LangChain com ferramentas MCP (customers CRUD + filesystem)
- LangGraph para orquestração de agentes com estado e tratamento de erros
- Comunicação stdio entre LangChain e servidores MCP
- Autenticação service-to-service via tokens de ambiente
- Callbacks e logging para monitoramento de execução de ferramentas
- Separação de responsabilidades: servidor HTTP, agente LangGraph, serviços MCP

**Aplicação prática:**
Este projeto demonstra como integrar servidores MCP customizados (desenvolvidos em módulos anteriores) com o framework LangChain para criar agentes inteligentes capazes de executar operações complexas. O sistema implementa um servidor HTTP Fastify que expõe um endpoint `/chat` para interações com um agente LangGraph, que tem acesso a ferramentas MCP para gerenciamento de clientes (CRUD) e operações no sistema de arquivos.

O agente pode:
- Criar, listar, atualizar e deletar clientes via ferramentas MCP
- Salvar dados em arquivos JSON no sistema de arquivos
- Responder perguntas gerais e executar tarefas autônomas
- Usar pacotes MCP publicados no npm (customers-mcp) e servidores oficiais (@modelcontextprotocol/server-filesystem)

**Como usar:**
1. **Configure a API de clientes** (subprojeto `nodejs-fastify-mongodb-crud/`):
   ```bash
   cd module-08/nodejs-fastify-mongodb-crud
   npm install
   npm run docker:infra:up   # Sobe MongoDB + API em containers
   ```

2. **Configure variáveis de ambiente:**
   ```bash
   export SERVICE_TOKEN="token-da-api-interna"  # Para autenticação no customers-mcp
   export OPENROUTER_API_KEY="sua-chave-openrouter"
   ```

3. **Inicie o servidor:**
   ```bash
   cd module-08
   npm install
   npm run dev
   ```

4. **Teste o endpoint /chat:**
   ```bash
   curl -X POST http://localhost:3000/chat \
     -H "Content-Type: application/json" \
     -d '{"question": "Crie 3 clientes de teste e salve em ./data/users.json"}'
   ```

**Exemplo de uso no Copilot Chat (VS Code):**
Após configurar os servidores MCP no `.vscode/mcp.json`, você pode usar comandos naturais:
```
Create 5 test customers and save them to a JSON file
List all customers and update the first one
Delete customers with phone starting with 555
```

**Arquitetura:**
```
Usuário → Fastify (/chat) → LangGraph Agent → LangChain Tools → MCP Servers
                                      ↓
                            MultiServerMCPClient (customers-mcp + filesystem)
```

## Resumo das Tecnologias

### Frameworks e Desenvolvimento Web
- **Fastify** - Framework web rápido e de baixo overhead para Node.js
- **TypeScript** - Linguagem tipada para desenvolvimento robusto
- **Docker** - Containerização para infraestrutura (MongoDB, APIs)

### IA e LLMs
- **LangChain** - Framework para construção de aplicações com LLMs
- **LangGraph** - Framework para construção de grafos de agentes com estado
- **@langchain/openai** - Cliente para acesso a modelos via OpenRouter
- **@langchain/mcp-adapters** - Adaptador para integração com servidores MCP
- **OpenRouter** - Plataforma para acesso unificado a múltiplos modelos de IA
- **Model Context Protocol (MCP)** - Protocolo para conexão de LLMs com ferramentas externas
- **MultiServerMCPClient** - Gerenciamento de múltiplos servidores MCP

### MCP SDK e Servidores
- **@modelcontextprotocol/sdk** - SDK oficial para criação de servidores MCP
- **MongoDB MCP Server** - Servidor MCP para operações em banco de dados MongoDB
- **Filesystem MCP Server** - Servidor MCP para manipulação de arquivos
- **MCP Inspector** - Ferramenta para testes interativos de servidores MCP

### Bancos de Dados
- **MongoDB** - Banco de dados NoSQL para persistência de dados
- **Mongo-Express** - Interface web para administração do MongoDB

### Validação e Tipagem
- **Zod** - Validação de schemas TypeScript-first

### Segurança e Autenticação
- **JWT / Bearer Token** - Autenticação entre serviços (service-to-service)
- **Node.js Crypto** - Módulo nativo para criptografia (AES-256-CBC, scrypt)

### Ferramentas de Desenvolvimento e Testes
- **GitHub Copilot** - Assistente de IA para desenvolvimento
- **Copilot Agents** - Agentes especializados configuráveis via arquivos `.agent.md`
- **Playwright** - Framework de testes end-to-end
- **VS Code Copilot Chat** - Cliente MCP integrado ao editor

### Gerenciamento de Pacotes e Distribuição
- **npm** - Gerenciador de pacotes e distribuição
- **Verdaccio** - Registry npm privado para testes de publicação
- **tsx** - Executor TypeScript com suporte a shebang executável
- **Skills CLI** (`npx skills`) - Gerenciador de pacotes de skills para Copilot

### APIs e Integrações
- **SerpAPI** - API para busca de dados do Google Trends
- **Node.js Fetch API** - Cliente HTTP para comunicação com APIs REST

### Arquitetura e Padrões
- **Clean Architecture** - Padrão arquitetural com separação em Domain, Application e Infrastructure
- **YAML/JSON** - Formatos de configuração para agents, skills e MCP servers
