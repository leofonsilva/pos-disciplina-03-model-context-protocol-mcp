import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../application/customer-service.ts";
import { registerListCustomersTool } from "./tools/list-customers.ts";
import { registerGetCustomerTool } from "./tools/get-customer.ts";
import { registerCreateCustomerTool } from "./tools/create-customer.ts";
import { registerUpdateCustomerTool } from "./tools/update-customer.ts";
import { registerDeleteCustomerTool } from "./tools/delete-customer.ts";
import { registerApiInfoResource } from "./resources/api-info.ts";
import { registerFindCustomerPrompt } from "./prompts/findCustomer.ts";

// URL base da API de clientes (onde o servidor REST está rodando)
const BASE_URL = "http://localhost:9999/v1";

// Token de serviço para autenticação (deve ser definido nas variáveis de ambiente)
const SERVICE_TOKEN = process.env.SERVICE_TOKEN!

// Cria a instância do serviço que faz as operações de cliente
const service = new CustomerService(BASE_URL, SERVICE_TOKEN);

// Cria e configura o servidor MCP
export const server = new McpServer({
  name: "@leofonsilva/customers-mcp",  // Nome único do servidor
  version: "0.0.1",                    // Versão atual
});

// Registra todas as ferramentas (tools) que a IA poderá usar
registerListCustomersTool(server, service);    // Listar todos os clientes
registerGetCustomerTool(server, service);      // Buscar cliente por ID, nome ou telefone
registerCreateCustomerTool(server, service);   // Criar um novo cliente
registerUpdateCustomerTool(server, service);   // Atualizar cliente existente
registerDeleteCustomerTool(server, service);   // Remover cliente

// Registra um recurso informativo sobre a API (documentação)
registerApiInfoResource(server, BASE_URL);

// Registra um prompt (template de conversa) para ajudar a IA a buscar clientes
registerFindCustomerPrompt(server);
