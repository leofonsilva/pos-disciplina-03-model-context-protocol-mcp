import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getMongoDBTool } from "../tools/mongodbTool.ts";
import { getCSVToJSONTool } from "../tools/csvToJSONTool.ts";
import { getFSTool } from "../tools/fsTool.ts";

// Obtém todas as ferramentas MCP (Model Context Protocol) disponíveis para o agente
export const getMCPTools = async () => {
  // Cria um cliente MCP que gerencia múltiplos servidores
  const client = new MultiServerMCPClient({
    // Servidores MCP configurados
    mcpServers: {
      ...getMongoDBTool(),  // Ferramentas para interagir com MongoDB (inserir, consultar)
      ...getFSTool(),       // Ferramentas para sistema de arquivos (ler, escrever)
    },
    // Log de mensagens dos servidores MCP
    onMessage: (log, source) => {
      console.log(`[${source.server}] ${log.data}`)
    }
  })

  // Obtém as ferramentas dos servidores MCP
  const mcpTools = await client.getTools()

  // Retorna ferramentas MCP + ferramenta local CSV para JSON
  return [
    ...mcpTools,           // Ferramentas: MongoDB, filesystem
    getCSVToJSONTool()     // Ferramenta adicional: converter CSV para JSON
  ];
};
