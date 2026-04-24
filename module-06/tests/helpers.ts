import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

// URL base da API de clientes (pode ser sobrescrita por variável de ambiente)
const API_URL = process.env.CUSTOMERS_API_URL ?? 'http://localhost:9999/v1'

// Obtém um token de serviço para autenticação entre sistemas
export async function getServiceToken(): Promise<string> {
  // Faz requisição para o endpoint de service-token com credenciais fixas (teste)
  const res = await fetch(`${API_URL}/auth/service-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'leofonsilva',
      password: '123123',
      adminSuperSecret: 'AM I THE BOSS?',
    }),
  })
  
  if (!res.ok) throw new Error(`Failed to get service token: ${res.status}`)
  const { serviceToken } = await res.json() as { serviceToken: string }
  return serviceToken
}

// Cria um cliente de teste para se comunicar com o servidor MCP (passando o token de serviço)
export async function createTestClient(serviceToken: string) {
  // Configura o transporte que vai rodar o servidor como um processo filho
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['--experimental-strip-types', 'src/index.ts'],
    env: { ...process.env, SERVICE_TOKEN: serviceToken },  // Injeta o token no ambiente do servidor
  })

  // Cria o cliente MCP com nome e versão para identificação
  const client = new Client({
    name: 'test-client',
    version: '1.0.0'
  }, {
    capabilities: {}
  })

  // Conecta o cliente ao transporte (inicia o servidor e estabelece comunicação)
  await client.connect(transport)
  
  return client  // Retorna o cliente pronto para usar
}
