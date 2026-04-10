# Pós Disciplina 03 – Model Context Protocol (MCP)

## Introdução
Pendente...

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

## Resumo das Tecnologias
Pendente...