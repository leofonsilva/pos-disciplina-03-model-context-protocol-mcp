import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import z from "zod";
import { CustomerSchema } from "../../domain/customer.ts";

// Registra a ferramenta de listagem de clientes no servidor MCP
export function registerListCustomersTool(
  server: McpServer,
  service: CustomerService
) {

  server.registerTool(
    "list_customers",                                     // Nome da ferramenta
    {
      description: "List all customers",                  // Descrição para a IA
      inputSchema: {},                                    // Não precisa de argumentos
      outputSchema: {
        customers: z.array(                               // Retorna um array de clientes
          CustomerSchema
        ).describe('Array of all customers')
      }
    },
    async () => {
      try {
        // Busca todos os clientes do serviço
        const customers = await service.listCustomers()
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(customers, null, 2)    // Formata o JSON com indentação
            }
          ],
          structuredContent: { customers }                // Retorno estruturado
        }
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to list customers. Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  )
}
