import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CustomerService } from "../../application/customer-service.ts";
import { CustomerMutationSchema, CustomerUpdateSchema } from "../../domain/customer.ts";

// Registra a ferramenta de atualização de clientes no servidor MCP
export function registerUpdateCustomerTool(
  server: McpServer,
  service: CustomerService
): void {
  server.registerTool(
    "update_customer",                                    // Nome da ferramenta
    {
      description:
        "Update an existing customer's name and/or phone number by their _id",  // Descrição para a IA
      inputSchema: CustomerUpdateSchema.shape,           // Precisa de _id e pelo menos um campo para atualizar
      outputSchema: CustomerMutationSchema.shape,        // Retorna id, message e isError
    },
    async ({ _id, name, phone }) => {
      try {
        // Chama o serviço para atualizar o cliente
        const result = await service.updateCustomer(_id, { name, phone });
        return {
          content: [{ type: "text", text: result.message ?? "" }],  // Retorna a mensagem de confirmação
          structuredContent: result,                                // Retorno estruturado
        };
      } catch (err) {
        const message = `Failed to update customer. Error: ${err instanceof Error ? err.message : String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: { isError: true, message },
        };
      }
    }
  );
}
