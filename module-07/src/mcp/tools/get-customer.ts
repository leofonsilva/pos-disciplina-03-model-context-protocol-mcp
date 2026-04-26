import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CustomerService } from "../../application/customer-service.ts";
import { CustomerMutationSchema, CustomerQuerySchema } from "../../domain/customer.ts";

// Registra a ferramenta de busca de clientes no servidor MCP
export function registerGetCustomerTool(
  server: McpServer,
  service: CustomerService
): void {
  server.registerTool(
    "get_customer",                                       // Nome da ferramenta
    {
      description: "Find a customer by _id, name, or phone number",  // Explica para a IA como buscar
      inputSchema: CustomerQuerySchema,                   // Aceita _id, name ou phone (todos opcionais)
      outputSchema: CustomerMutationSchema.shape,         // Formato da resposta (customer ou isError)
    },
    async (query) => {
      try {
        // Busca o cliente no serviço usando os critérios fornecidos
        const customer = await service.findCustomer(query);
        return {
          content: [{ type: "text", text: JSON.stringify(customer, null, 2) }],  // Retorno formatado
          structuredContent: { customer },                                       // Retorno estruturado com o cliente encontrado
        };
      } catch (err) {
        const message = `Failed to find customer. Error: ${err instanceof Error ? err.message : String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: { isError: true, message },
        };
      }
    }
  );
}
