import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { CustomerMutationSchema, CustomerUpdateSchema } from "../../domain/customer.ts";

// Registra a ferramenta de atualização de clientes no servidor MCP
export function registerUpdateCustomersTool(
  server: McpServer,
  service: CustomerService
) {

  server.registerTool(
    "update_customer",                                    // Nome da ferramenta
    {
      description:
        "Update an existing customer's name and/or phone number by their _id",  // Descrição para a IA

      inputSchema: CustomerUpdateSchema.shape,            // Precisa de _id e pelo menos um campo para atualizar
      outputSchema: CustomerMutationSchema.shape,        // Retorna id, message e isError
    },
    async (customer) => {
      try {
        // Chama o serviço para atualizar o cliente
        const result = await service.updateCustomer(customer)
        return {
          content: [
            {
              type: "text",
              text: result.message ?? ""                  // Retorna a mensagem de confirmação
            }
          ],
          structuredContent: result                       // Retorno estruturado
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
