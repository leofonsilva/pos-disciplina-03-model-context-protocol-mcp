import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { CustomerMutationSchema } from "../../domain/customer.ts";
import { z } from 'zod'

// Registra a ferramenta de exclusão de clientes no servidor MCP
export function registerDeleteCustomersTool(
  server: McpServer,
  service: CustomerService
) {

  server.registerTool(
    "delete_customer",                                    // Nome da ferramenta
    {
      description: "Delete a customer by their _id",      // Descrição para a IA

      inputSchema: {                                      // A IA precisa fornecer apenas o ID
        _id: z.string().describe('MongoDB ObjectID of the customer to delete')
      },
      outputSchema: CustomerMutationSchema.shape,        // Formato da resposta (id, message, isError)
    },
    async ({ _id }) => {
      try {
        const result = await service.deleteCustomer(_id)  // Chama o serviço para deletar
        return {
          content: [
            {
              type: "text",
              text: result.message ?? ""                  // Retorna a mensagem de confirmação
            }
          ],
          structuredContent: result                       // Retorno estruturado para validação
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
