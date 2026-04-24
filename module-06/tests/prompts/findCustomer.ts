import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerQuerySchema } from "../../src/domain/customer.ts";

// Registra um prompt no servidor MCP para ajudar a IA a buscar clientes
export function registerFindCustomerPrompt(server: McpServer) {
  server.registerPrompt(
    "find_customer_prompt",                    // Nome único do prompt
    {
      description: "Prompt to search a customer using any combination of _id, name or phone",
      argsSchema: CustomerQuerySchema.shape    // Define os argumentos aceitos (_id, name, phone - todos opcionais)
    },
    (query) => ({                              // Função que monta a mensagem do prompt
      messages: [
        {
          role: "user",                        // A mensagem vem como se fosse do usuário
          content: {
            type: "text",
            text: `Please find the customer matching the following query using the get_customer or list_customers tool.\nQuery: ${JSON.stringify(query)}`,
          }
        }
      ]
    })
  )
}
