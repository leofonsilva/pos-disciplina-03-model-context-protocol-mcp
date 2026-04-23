import { describe, it, after, before } from 'node:test'
import assert from 'node:assert'
import { createTestClient } from '../helpers.ts'
import { Client } from '@modelcontextprotocol/sdk/client'

// Testes para os prompts do servidor MCP de clientes
describe('Customer Prompts', async () => {
  let client: Client

  // before: executa uma vez antes de todos os testes
  before(async () => {
    client = await createTestClient()  // Inicia o servidor e conecta o cliente
  })

  // after: executa uma vez depois que todos os testes terminarem
  after(async () => {
    await client.close()  // Fecha a conexão e encerra o servidor
  })

  // Testa se o prompt de busca de clientes está funcionando corretamente
  it('should return the find_customer_prompt', async () => {
    // Solicita o prompt com um argumento de busca (nome "John")
    const result = await client.getPrompt({
      name: 'find_customer_prompt',
      arguments: { name: 'John' },
    })
    
    // Pega o conteúdo da primeira mensagem
    const text = result.messages[0].content
    
    // Verifica se o prompt menciona a ferramenta get_customer
    assert.ok('text' in text && text.text.includes('get_customer'), 'Prompt should reference the get_customer tool')
    
    // Verifica se o prompt inclui o termo de busca "John"
    assert.ok('text' in text && text.text.includes('John'), 'Prompt should include the query')
  })
})
