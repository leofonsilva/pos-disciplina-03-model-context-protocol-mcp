import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../../application/customerService.ts";
import { type CustomerQuery, CustomerQuerySchema, CustomerSchema } from "../../domain/customer.ts";

// Registra a ferramenta de busca de clientes no servidor MCP
export function registerGetCustomerTool(
  server: McpServer,
  service: CustomerService
) {

  server.registerTool(
    "get_customer",                                       // Nome da ferramenta
    {
      description: "Find a customer by _id, name, or phone number",  // Explica para a IA como buscar
      inputSchema: CustomerQuerySchema,                   // Aceita _id, name ou phone (todos opcionais)
      outputSchema: {
        customer: CustomerSchema.nullable()               // Retorna o cliente ou null se não encontrar
          .describe('Customer details if found, otherwise null!'),
      }
    },
    async (query: CustomerQuery) => {
      try {
        // Busca o cliente no serviço usando os critérios fornecidos
        const customer = await service.findCustomer(query)
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(customer)              // Retorno em texto para a IA ler
            }
          ],
          structuredContent: { customer }                 // Retorno estruturado com o cliente encontrado
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
