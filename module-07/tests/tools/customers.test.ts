import { describe, it, afterEach, beforeEach } from 'node:test'
import assert from 'node:assert'
import { createTestClient, getServiceToken } from '../helpers.ts'
import { Client } from '@modelcontextprotocol/sdk/client'
import type { Customer, CustomerMutation } from '../../src/domain/customer.ts'

// Tipos auxiliares para extrair o conteúdo estruturado das respostas
type CustomerResult = { structuredContent: { customer?: Customer | null, isError: boolean, message?: string } }
type CustomersResult = { structuredContent: { customers?: Customer[], isError: boolean, message?: string } }
type MutationToolResult = { structuredContent: CustomerMutation }

// Testes das ferramentas (tools) do servidor MCP de clientes
describe('Customer Tools', async () => {
  let client: Client
  let createdId: string   // Armazena o ID do cliente criado para usar nos testes seguintes

  // beforeEach: cria um novo cliente antes de cada teste
  beforeEach(async () => {
    const serviceToken = await getServiceToken()    // Obtém token de serviço para autenticação
    client = await createTestClient(serviceToken)   // Inicia o servidor e conecta o cliente
  })

  // afterEach: fecha a conexão depois de cada teste
  afterEach(async () => {
    await client.close()
  })

  // Teste 1: listar todos os clientes
  it('should list all customers', async () => {
    const result = await client.callTool({
      name: 'list_customers',
      arguments: {},
    }) as unknown as CustomersResult

    assert.ok(Array.isArray(result.structuredContent.customers), 'Should return an array of customers')
  })

  // Teste 2: criar um cliente
  it('should create a customer', async () => {
    const result = await client.callTool({
      name: 'create_customer',
      arguments: { name: 'Test MCP User', phone: '999-000-0001' },
    }) as unknown as MutationToolResult

    assert.ok(result.structuredContent.id, 'Should return the new customer id')
    assert.ok(result.structuredContent.message?.includes('Test MCP User'), 'Confirmation message should include customer name')
    createdId = result.structuredContent.id   // Salva o ID para os próximos testes
  })

  // Teste 3: buscar cliente por ID
  it('should get a customer by _id', async () => {
    const result = await client.callTool({
      name: 'get_customer',
      arguments: { _id: createdId },
    }) as unknown as CustomerResult

    assert.ok(result.structuredContent.customer, 'Should return a customer object')
    assert.strictEqual(result.structuredContent.customer!.name, 'Test MCP User')
  })

  // Teste 4: buscar cliente por nome
  it('should get a customer by name', async () => {
    const result = await client.callTool({
      name: 'get_customer',
      arguments: { name: 'Test MCP User' },
    }) as unknown as CustomerResult

    assert.ok(result.structuredContent.customer, 'Should return a customer matching the name')
    assert.strictEqual(result.structuredContent.customer!.phone, '999-000-0001')
  })

  // Teste 5: atualizar cliente
  it('should update a customer', async () => {
    const result = await client.callTool({
      name: 'update_customer',
      arguments: { _id: createdId, name: 'Test MCP User Updated', phone: '999-000-0002' },
    }) as unknown as MutationToolResult

    assert.ok(result.structuredContent.message, 'Should return a confirmation message')
    assert.strictEqual(result.structuredContent.id, createdId)
  })

  // Teste 6: verificar se a atualização foi aplicada
  it('should reflect the update when getting by id', async () => {
    const result = await client.callTool({
      name: 'get_customer',
      arguments: { _id: createdId },
    }) as unknown as CustomerResult

    assert.strictEqual(result.structuredContent.customer!.name, 'Test MCP User Updated')
    assert.strictEqual(result.structuredContent.customer!.phone, '999-000-0002')
  })

  // Teste 7: deletar cliente
  it('should delete a customer', async () => {
    const result = await client.callTool({
      name: 'delete_customer',
      arguments: { _id: createdId },
    }) as unknown as MutationToolResult

    assert.ok(result.structuredContent.message, 'Should return a confirmation message')
  })

  // Teste 8: verificar que cliente deletado não é mais encontrado
  it('should return null when getting a deleted customer by name', async () => {
    const result = await client.callTool({
      name: 'get_customer',
      arguments: { name: 'Test MCP User Updated' },
    }) as unknown as CustomerResult

    assert.ok(!result.structuredContent?.customer, 'Deleted customer should not be found')
  })

  // Teste 9: tentar deletar com ID inválido deve retornar erro
  it('should return isError when deleting with an invalid id', async () => {
    const result = await client.callTool({
      name: 'delete_customer',
      arguments: { _id: 'not-a-valid-id' },
    }) as unknown as CustomerResult

    assert.ok(result.structuredContent.isError, 'Should return isError: true for invalid id')
    assert.strictEqual(result.structuredContent.message, 'Failed to delete customer. Error: HTTP 400 - Bad Request - {"message":"the id is invalid!","id":"not-a-valid-id"}', 'Error message should indicate full error message')
  })

  // Teste 10: token de serviço inválido deve retornar erro de autenticação
  it('should return isError when service token is invalid (list_customers)', async () => {
    const client = await createTestClient('invalid-token-that-does-not-exist');
    try {
      const result = await client.callTool({
        name: 'list_customers',
        arguments: {},
      }) as unknown as CustomersResult;

      assert.strictEqual(result.structuredContent.isError, true, 'Should return isError: true for invalid token');
      assert.ok(
        result.structuredContent.message!.toLowerCase().includes('unauthorized'),
        `Error message should mention "unauthorized", got: ${result.structuredContent.message}`
      );
    } finally {
      await client.close();
    }
  });

  // Teste 11: verificar o rate limiting (limite de requisições)
  it('should reach rate limit', async () => {
    let result: CustomersResult = { structuredContent: { isError: false, message: '' } };
    const maxAttempts = 100;  // Tenta várias requisições até bater o limite
    
    for (let index = 0; index < maxAttempts; index++) {
      result = await client.callTool({
        name: 'list_customers',
        arguments: {},
      }) as unknown as CustomersResult

      if (result.structuredContent.isError) {
        break;  // Sai do loop quando atingir o rate limit
      }
    }

    assert.ok(result.structuredContent.isError, 'Should return isError: true for rate limit exceeded');
    assert.strictEqual(result.structuredContent.message, 'Failed to list customers. Error: Rate limit exceeded. Please try again later.', 'Error message should indicate full error message')
  })
})
