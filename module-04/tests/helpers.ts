// Importa as classes necessárias para criar um cliente MCP
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Cria um cliente de teste para se comunicar com o servidor MCP
export async function createTestClient() {
  // Configura o transporte que vai rodar o servidor como um processo filho
  // Comunicação acontece via entrada/saída padrão (stdio)
  const transport = new StdioClientTransport({
    command: 'node',                      // Executa o Node.js
    args: [
      '--experimental-strip-types',      // Permite rodar TypeScript diretamente
      'src/index.ts'                     // Caminho do arquivo principal do servidor
    ]
  })

  // Cria o cliente MCP com um nome e versão para identificação
  const client = new Client({
    name: 'test-client',
    version: '1.0.1'
  }, {
    capabilities: {}                     // Nenhuma capacidade especial declarada
  })

  // Conecta o cliente ao transporte (inicia o servidor e estabelece comunicação)
  await client.connect(transport)
  
  return client                          // Retorna o cliente pronto para usar
}
