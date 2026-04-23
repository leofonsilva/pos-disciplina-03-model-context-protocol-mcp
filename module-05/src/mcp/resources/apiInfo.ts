import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Registra um recurso informativo sobre a API de clientes que o servidor MCP encapsula
export function registerApiInfoResource(
  server: McpServer,
  baseUrl: string
) {
  server.registerResource(
    "customers://api-info",                    // Nome do recurso
    "customers://api-info",                    // URI (endereço único do recurso)
    {
      description: "describes the customers rest API that this MCP server wraps"  // Explica o conteúdo para a IA
    },
    () => ({                                   // Função que retorna o conteúdo do recurso
      contents: [
        {
          uri: "customers://api-info",
          mimeType: "text/plain",              // Tipo do conteúdo (texto simples)
          text: `
Customers API

  Base URL : ${baseUrl}
  Endpoints:
    GET    /customers          — list all customers
    GET    /customers/:id      — get customer by id
    POST   /customers          — create customer  { name, phone }
    PUT    /customers/:id      — update customer  { name, phone }
    DELETE /customers/:id      — delete customer

  Customer shape: { _id: string, name: string, phone: string }
`
        }
      ]
    })
  )
}
