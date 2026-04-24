import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp/server.ts";

// Função principal que inicia o servidor MCP de clientes
async function main() {
  // Obtém o token de serviço das variáveis de ambiente
  const SERVICE_TOKEN = process.env.SERVICE_TOKEN ?? "";

  // Verifica se o token foi fornecido (obrigatório para autenticação)
  if (!SERVICE_TOKEN) {
    console.error('[error]: SERVICE_TOKEN env var is required');
    process.exit(1);
  }

  // Cria um transporte que comunica via entrada/saída padrão (stdio)
  const transport = new StdioServerTransport();
  
  // Conecta o servidor MCP ao transporte, tornando-o ativo
  await server.connect(transport);
  
  // Mensagem de log (vai para stderr para não interferir na comunicação stdio)
  console.error("Customers MCP Server running on stdio");
}

// Executa o servidor e captura erros fatais
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);  // Encerra o processo com código de erro
});
