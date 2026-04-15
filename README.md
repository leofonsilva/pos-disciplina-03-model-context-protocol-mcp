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

## Resumo das Tecnologias
Pendente...
