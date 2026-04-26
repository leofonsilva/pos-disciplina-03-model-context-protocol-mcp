import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import type { CustomerService } from "../../application/customer-service.ts";
import { CustomerMutationSchema } from "../../domain/customer.ts";

// Registra a ferramenta de criação de clientes no servidor MCP
export function registerCreateCustomerTool(
  server: McpServer,
  service: CustomerService
): void {
  server.registerTool(
    "create_customer",                                    // Nome da ferramenta
    {
      description: "Create a new customer",               // Descrição para a IA saber quando usar
      inputSchema: {                                      // O que a IA precisa fornecer
        name: z.string().describe("Full name of the customer"),
        phone: z.string().describe("Phone number of the customer"),
      },
      outputSchema: CustomerMutationSchema.shape,         // Formato da resposta (id, message, isError)
    },
    async ({ name, phone }) => {
      try {
        // Chama o serviço para criar o cliente
        const result = await service.createCustomer({ name, phone });
        return {
          content: [{ type: "text", text: result.message ?? "" }],  // Retorno em texto para a IA ler
          structuredContent: result,                                // Retorno estruturado
        };
      } catch (err) {
        const message = `Failed to create customer. Error: ${err instanceof Error ? err.message : String(err)}`;
        return {
          content: [{ type: "text", text: message }],
          structuredContent: { isError: true, message },   // Indica erro no retorno estruturado
        };
      }
    }
  );
}
