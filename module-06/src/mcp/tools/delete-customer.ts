import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import type { CustomerService } from "../../application/customer-service.ts";
import { CustomerMutationSchema } from "../../domain/customer.ts";

// Registra a ferramenta de exclusão de clientes no servidor MCP
export function registerDeleteCustomerTool(
  server: McpServer,
  service: CustomerService
): void {
  server.registerTool(
    "delete_customer",                                    // Nome da ferramenta
    {
      description: "Delete a customer by their _id",      // Descrição para a IA
      inputSchema: {                                      // A IA precisa fornecer apenas o ID
        _id: z
          .string()
          .describe("MongoDB ObjectId of the customer to delete"),
      },
      outputSchema: CustomerMutationSchema.shape,        // Formato da resposta (id, message, isError)
    },
    async ({ _id }) => {
      try {
        // Chama o serviço para deletar o cliente
        const result = await service.deleteCustomer(_id);
        return {
          content: [{ type: "text", text: result.message ?? "" }],  // Retorna a mensagem de confirmação
          structuredContent: result,                                // Retorno estruturado
        };
      } catch (err) {
        const message = `Failed to delete customer. Error: ${err instanceof Error ? err.message : String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: { isError: true, message },   // Indica erro no retorno estruturado
        };
      }
    }
  );
}
