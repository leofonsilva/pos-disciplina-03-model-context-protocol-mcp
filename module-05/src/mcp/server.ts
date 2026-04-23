import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListCustomersTool } from "./tools/listCustomers.ts";
import { CustomerService } from "../application/customerService.ts";
import { registerApiInfoResource } from "./resources/apiInfo.ts";
import { registerCreateCustomersTool } from "./tools/createCustomer.ts";
import { registerGetCustomerTool } from "./tools/getCustomer.ts";
import { registerFindCustomerPrompt } from "./prompts/findCustomer.ts";
import { registerUpdateCustomersTool } from "./tools/updateCustomer.ts";
import { registerDeleteCustomersTool } from "./tools/deleteCustomer.ts";

// URL base da API de clientes (onde o servidor REST está rodando)
const BASE_URL = "http://localhost:9999/v1";

// Cria a instância do serviço que faz as operações de cliente
const service = new CustomerService(BASE_URL)

// Cria e configura o servidor MCP
export const server = new McpServer({
  name: "@leofonsilva/customers-mcp",  // Nome único do servidor
  version: "0.0.1",                       // Versão atual
});

// Registra todas as ferramentas (tools) que a IA poderá usar
registerListCustomersTool(server, service)      // Listar todos os clientes
registerGetCustomerTool(server, service)        // Buscar cliente por ID, nome ou telefone
registerCreateCustomersTool(server, service)    // Criar um novo cliente
registerUpdateCustomersTool(server, service)    // Atualizar cliente existente
registerDeleteCustomersTool(server, service)    // Remover cliente

// Registra um prompt (template de conversa) para ajudar a IA a buscar clientes
registerFindCustomerPrompt(server)

// Registra um recurso informativo sobre a API (documentação)
registerApiInfoResource(server, BASE_URL)
