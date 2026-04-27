import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { getCustomersTool } from '../tools/customersTool.ts';
import { getFSTool } from '../tools/fsTool.ts';

// Cria e retorna todas as ferramentas MCP disponíveis para a IA usar
export const getMCPTools = async () => {
  // Cria um cliente MCP que gerencia múltiplos servidores de ferramentas
  const client = new MultiServerMCPClient({
    // Configuração dos servidores MCP (clientes e sistema de arquivos)
    mcpServers: {
      ...getCustomersTool(),   // Ferramentas para operações de clientes (CRUD)
      ...getFSTool(),          // Ferramentas para sistema de arquivos (ler/salvar arquivos)
    },
    // Callback executado quando uma mensagem é recebida de qualquer servidor
    onMessage: (log, source) => {
      console.log(`[${source.server}] ${log.data}`);
    },
    // Callback executado quando um servidor MCP é inicializado com sucesso
    onInitialized: (source) => {
      console.log(`MCP server connected: ${source.server}`);
    },
    // Callback executado quando falha a conexão com um servidor MCP
    onConnectionError: (source, error) => {
      console.error(`MCP server failed to connect: ${source.serverName}`, error);
      process.exit(1);  // Encerra a aplicação se um servidor essencial falhar
    },
  })

  // Obtém todas as ferramentas dos servidores MCP conectados
  const mcpTools = await client.getTools();

  // Retorna as ferramentas combinadas (clientes + sistema de arquivos)
  return [...mcpTools];
};
