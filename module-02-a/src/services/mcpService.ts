import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { createGoogleTrendsTool } from '../tools/googleTrendsTool.ts';
import { SerpAPIService } from './serpApiService.ts';
import { config } from '../config.ts';

// Cria e retorna todas as ferramentas disponíveis para a IA usar (acesso a arquivos + busca de tendências)
export const getMCPTools = async () => {
  // Configura um cliente MCP que permite a IA acessar o sistema de arquivos do computador
  const mcpClient = new MultiServerMCPClient({
    filesystem: {
      transport: 'stdio',                 // Comunicação via entrada/saída padrão
      command: 'npx',                     // Comando para executar o servidor MCP
      args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()], // Permite acesso à pasta atual
    },
  });

  // Obtém as ferramentas MCP (ex: ler arquivos, listar diretórios)
  const mcpTools = await mcpClient.getTools();

  // Cria uma ferramenta personalizada para consultar o Google Trends via API
  const serpAPIService = new SerpAPIService(config.serpAPIConfig);
  const googleTrendsTool = createGoogleTrendsTool(serpAPIService);

  // Combina ambas as ferramentas para a IA ter acesso tanto ao sistema de arquivos quanto às tendências
  return [...mcpTools, googleTrendsTool];
};
