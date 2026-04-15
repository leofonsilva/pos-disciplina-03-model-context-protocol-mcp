// Importa os módulos de teste nativos do Node.js
import { describe, it, after, before } from 'node:test'
import assert from 'node:assert'
// Importa o cliente MCP e a função auxiliar para criar um cliente de teste
import { Client } from '@modelcontextprotocol/sdk/client'
import { createTestClient } from './helpers.ts'

// Função auxiliar para chamar a ferramenta de criptografia do servidor MCP
async function encryptMessage(client: Client, message: string, encryptionKey: string) {
  // callTool é o método que invoca uma ferramenta registrada no servidor
  const result = await client.callTool({
    name: 'encrypt_message',           // Nome da ferramenta definida no servidor
    arguments: {
      message,
      encryptionKey
    }
  }) as unknown as { structuredContent: { encryptedMessage: string } }

  return result
}

// Função auxiliar para chamar a ferramenta de descriptografia do servidor MCP
async function decryptMessage(client: Client, encryptedMessage: string, encryptionKey: string) {
  const result = await client.callTool({
    name: 'decrypt_message',
    arguments: {
      encryptedMessage,
      encryptionKey
    }
  }) as unknown as { structuredContent: { decryptedMessage: string } }

  return result
}

// Agrupa todos os testes relacionados ao servidor MCP
describe('MCP Tool Tests', () => {
  let client: Client
  let encryptionKey = 'my-super-passphrase'  // Chave fixa para os testes

  // before: executa uma vez antes de todos os testes
  before(async () => {
    client = await createTestClient()        // Inicia o servidor e conecta o cliente
  })

  // after: executa uma vez depois que todos os testes terminarem
  after(async () => {
    await client.close()                     // Fecha a conexão e encerra o servidor
  })

  // Teste 1: verifica se a criptografia funciona e gera uma saída válida
  it('should encrypt a message', async () => {
    const message = 'Hello world'
    const result = await encryptMessage(
      client,
      message,
      encryptionKey,
    )

    // Verifica se a mensagem criptografada tem pelo menos 60 caracteres
    // (formato iv:encrypted = 32 chars do iv + 1 dois pontos + pelo menos 27 chars do texto)
    assert.ok(
      result.structuredContent?.encryptedMessage.length > 60,
      'Encrypted message should not be empty'
    )
  })

  // Teste 2: verifica se uma mensagem criptografada pode ser descriptografada corretamente
  it('should decrypt a message', async () => {
    const message = 'Heyyyyy'
    const key = 'my-super-key'
    
    // Primeiro criptografa a mensagem
    const { structuredContent: { encryptedMessage } } = await encryptMessage(
      client,
      message,
      key,
    )

    // Depois descriptografa com a mesma chave
    const result = await decryptMessage(client, encryptedMessage, key)

    // Confirma que o texto descriptografado é igual ao original
    assert.deepStrictEqual(
      result.structuredContent.decryptedMessage,
      message,
      'Decrypted message should match original'
    )
  })

  // Teste 3: verifica se o recurso de informações está disponível
  it('should list the encryption://info resource', async () => {
    const { resources } = await client.listResources()  // Pede lista de todos os recursos
    const info = resources.find(item => item.uri === 'encryption://info')  // Procura pelo recurso específico

    assert.ok(info, 'encryption://info resource should be listed!')
  })

  // Teste 4: verifica se o prompt de criptografia retorna no formato esperado
  it('should return the encrypt_message_prompt', async () => {
    // Solicita o prompt com os argumentos fornecidos
    const result = await client.getPrompt({
      name: 'encrypt_message_prompt',
      arguments: {
        message: 'Secret text',
        encryptionKey,
      }
    })

    // Pega a primeira mensagem do prompt e extrai o texto
    const item = result.messages.at(0)?.content as unknown as { text: string }
    const expected = `Please encrypt the following message using the encrypt_message tool.\nMessage: Secret text\nEncryption key: my-super-passphrase`

    // Verifica se o texto gerado pelo prompt está correto
    assert.deepStrictEqual(
      item.text,
      expected,
      'Prompt should be in the correct format'
    )
  })
})
