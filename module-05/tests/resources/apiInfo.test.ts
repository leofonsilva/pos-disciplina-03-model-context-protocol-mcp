import { describe, it, after, before } from 'node:test'
import assert from 'node:assert'
import { createTestClient } from '../helpers.ts'
import { Client } from '@modelcontextprotocol/sdk/client'

// Testes para os recursos do servidor MCP de clientes
describe('Customer Resources', () => {
  let client: Client

  // before: executa uma vez antes de todos os testes
  before(async () => {
    client = await createTestClient()  // Inicia o servidor e conecta o cliente
  })

  // after: executa uma vez depois que todos os testes terminarem
  after(async () => {
    await client.close()  // Fecha a conexão e encerra o servidor
  })

  // Testa se o recurso de informações da API está disponível
  it('should list the customers://api-info resource', async () => {
    // Pede a lista de todos os recursos disponíveis
    const { resources } = await client.listResources()
    
    // Procura pelo recurso de informações da API
    const info = resources.find(r => r.uri === 'customers://api-info')
    
    // Verifica se o recurso existe
    assert.ok(
      info,
      'customers://api-info should exists'
    )

    // Verifica se a descrição do recurso está correta
    assert.deepStrictEqual(
      info.description,
      'describes the customers rest API that this MCP server wraps',
      "description should be correct"
    )
  })
})
