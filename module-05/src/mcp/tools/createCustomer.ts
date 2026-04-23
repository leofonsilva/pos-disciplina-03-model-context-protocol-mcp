import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import z from "zod";

// Registra a ferramenta de criação de clientes no servidor MCP
export function registerCreateCustomersTool(
  server: McpServer,
  service: CustomerService
) {

  server.registerTool(
    "create_customer",                                    // Nome da ferramenta
    {
      description: "Create a customers",                  // Descrição para a IA saber quando usar
      inputSchema: {                                      // O que a IA precisa fornecer
        name: z.string().describe('Full name of the customer'),
        phone: z.string().describe('phone number of the customer')
      },
      outputSchema: {                                     // O que a ferramenta retorna
        id: z.string().describe('MongoDB ObjectID of newerly created customer'),
        message: z.string().describe('Confirmation message')
      }
    },
    async ({ name, phone }) => {
      try {
        // Chama o serviço para criar o cliente
        const customers = await service.createCustomer({ name, phone })
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(customers)              // Retorno em texto para a IA ler
            }
          ],
          structuredContent: customers                     // Retorno estruturado (validação do schema)
        }
      } catch (error) {
        return {
          isError: true,                                   // Indica que ocorreu um erro
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
