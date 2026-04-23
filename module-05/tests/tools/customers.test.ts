import { describe, it, after, before } from 'node:test'
import assert from 'node:assert'
import { createTestClient } from '../helpers.ts'
import { Client } from '@modelcontextprotocol/sdk/client'
import { type CustomerUpdate, type Customer, type CustomerMutation } from '../../src/domain/customer.ts'

// Tipos auxiliares para extrair o conteúdo estruturado das respostas
type CustomersResult = { structuredContent: { customers: Customer[] } }
type CustomerResult = { structuredContent: { customer: Customer } }
type CustomerMutationResult = { structuredContent: CustomerMutation }

// Testes completos do servidor MCP de clientes (operações CRUD)
describe('Customer MCP Suite', () => {
  let client: Client

  // before: inicia o servidor antes de todos os testes
  before(async () => {
    client = await createTestClient()
  })

  // after: fecha a conexão depois que todos os testes terminarem
  after(async () => {
    await client.close()
  })

  // Teste 1: listar todos os clientes
  it('should list all customers', async () => {
    const result = await client.callTool({
      name: 'list_customers',
      arguments: {}
    }) as unknown as CustomersResult

    // Verifica se o retorno é um array de clientes
    assert.ok(
      Array.isArray(result.structuredContent.customers),
      'Should return an array of customers'
    )
  })

  // Teste 2: criar um novo cliente
  it('should create a customer', async () => {
    const customer = {
      name: 'Ana',
      phone: '999-000-111'
    }

    const result = await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CustomerMutationResult

    // Verifica se o ID foi retornado
    assert.ok(result.structuredContent.id, 'Should contain id')
    
    // Verifica se a mensagem de confirmação está correta
    assert.deepStrictEqual(
      result.structuredContent.message,
      `user ${customer.name} created!`,
    )
  })

  // Teste 3: atualizar um cliente existente
  it('should update a customer', async () => {
    const customer = {
      name: 'Xuxa da Silva',
      phone: '12331236'
    }

    // Primeiro cria um cliente para depois atualizar
    const { structuredContent: { id } } = await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CustomerMutationResult

    // Atualiza o nome do cliente (mantém o telefone)
    const result = await client.callTool({
      name: 'update_customer',
      arguments: {
        _id: id,
        name: 'Jozé da silva',
        phone: customer.phone,
      } as CustomerUpdate
    }) as unknown as CustomerMutationResult

    // Verifica se a mensagem de retorno existe
    assert.ok(result.structuredContent.message, 'Should contain message')

    // Verifica se o ID do cliente atualizado é o mesmo do criado
    assert.deepStrictEqual(
      result.structuredContent.id,
      id,
    )
  })

  // Teste 4: deletar um cliente
  it('should delete a customer', async () => {
    const customer = {
      name: 'Mariazina',
      phone: '654566456'
    }

    // Primeiro cria um cliente para depois deletar
    const { structuredContent: { id } } = await client.callTool({
      name: 'create_customer',
      arguments: customer
    }) as unknown as CustomerMutationResult

    // Deleta o cliente pelo ID
    const result = await client.callTool({
      name: 'delete_customer',
      arguments: {
        _id: id,
      } as CustomerUpdate
    }) as unknown as CustomerMutationResult

    // Verifica se a mensagem de deleção está correta
    assert.deepStrictEqual(
      result.structuredContent.message,
      `User ${id} deleted!`,
      'Should show deleted message'
    )

    // Verifica se o ID retornado é o mesmo do cliente deletado
    assert.deepStrictEqual(
      result.structuredContent.id,
      id,
    )
  })
})
