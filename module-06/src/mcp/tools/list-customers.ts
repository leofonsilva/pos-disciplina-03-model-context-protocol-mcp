import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CustomerService } from "../../application/customer-service.ts";
import { CustomerMutationSchema } from "../../domain/customer.ts";

// Registra a ferramenta de listagem de clientes no servidor MCP
export function registerListCustomersTool(
  server: McpServer,
  service: CustomerService
): void {
  server.registerTool(
    "list_customers",                                     // Nome da ferramenta
    {
      description: "List all customers",                  // Descrição para a IA
      inputSchema: {},                                    // Não precisa de argumentos
      outputSchema: CustomerMutationSchema.shape,         // Formato da resposta (customers ou isError)
    },
    async () => {
      try {
        // Busca todos os clientes do serviço
        const customers = await service.listCustomers();
        return {
          content: [{ type: "text", text: JSON.stringify(customers, null, 2) }],  // Formata o JSON com indentação
          structuredContent: { customers },                                       // Retorno estruturado
        };
      } catch (err) {
        const message = `Failed to list customers. Error: ${err instanceof Error ? err.message : String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: { isError: true, message },
        };
      }
    }
  );
}
