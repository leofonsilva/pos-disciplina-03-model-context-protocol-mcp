import { describe, it, after, before } from 'node:test'
import assert from 'node:assert'
import { createTestClient, getServiceToken } from '../helpers.ts'
import { Client } from '@modelcontextprotocol/sdk/client'

// Testes para os recursos do servidor MCP de clientes
describe('Customer Resources', async () => {
  let client: Client

  // before: executa uma vez antes de todos os testes
  before(async () => {
    const serviceToken = await getServiceToken()    // Obtém token de serviço para autenticação
    client = await createTestClient(serviceToken)   // Inicia o servidor e conecta o cliente
  })

  // after: executa uma vez depois que todos os testes terminarem
  after(async () => {
    await client.close()  // Fecha a conexão e encerra o servidor
  })

  // Testa se o recurso de informações da API está disponível na lista
  it('should list the customers://api-info resource', async () => {
    const { resources } = await client.listResources()                  // Pede a lista de todos os recursos
    const info = resources.find(r => r.uri === 'customers://api-info')  // Procura pelo recurso específico
    assert.ok(info, 'customers://api-info resource should be listed')
  })

  // Testa se o recurso pode ser lido e contém as informações esperadas
  it('should read the customers://api-info resource', async () => {
    const result = await client.readResource({ uri: 'customers://api-info' })  // Lê o conteúdo do recurso
    const content = result.contents[0]
    assert.ok(content, 'Resource should have content')
    assert.ok('text' in content && content.text.includes('/customers'), 'Resource should describe the API endpoints')
  })
})
