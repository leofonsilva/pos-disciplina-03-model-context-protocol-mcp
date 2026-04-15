import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // Importa o servidor MCP - permite criar ferramentas que IA pode usar
import { z } from 'zod/v3' // Validar os tipos de dados de entrada e saída
import { decrypt, encrypt } from "./service.ts";

// Cria e configura o servidor MCP com um nome e versão (identificação única)
export const server = new McpServer({
  name: '@leofonsilva/ciphersuite-mcp',   // Nome do servidor (formato de pacote npm)
  version: '0.0.1'                        // Versão atual
})

// FERRAMENTA 1: Criptografar mensagem
// Uma "tool" é uma função que a IA pode chamar para executar uma ação específica
server.registerTool(
  'encrypt_message',                      // Nome da ferramenta (como a IA se refere a ela)

  // Definições da ferramenta
  {
    description: 'Encrypt a message',     // Explica para a IA o que esta ferramenta faz    
    inputSchema: {                        // Define o que a IA precisa fornecer para usar a ferramenta
      message: z.string().describe("The message to encrypt"),
      encryptionKey: z.string().describe(
        "Any passphrase to use for encryption — the server derives a strong key from it automatically"
      )
    },    
    outputSchema: {                       // Define o formato do que a ferramenta retorna
      encryptedMessage: z.string().describe(
        "The encrypted message (format: iv:ciphertext)"
      )
    }
  },
  
  // Função que executa a criptografia de fato
  async ({ message, encryptionKey }) => {
    try {
      // Chama a função de criptografia do serviço
      const encryptedMessage = encrypt(message, encryptionKey)
      
      // Retorna o resultado em dois formatos:
      // - content: texto legível para a IA
      // - structuredContent: dados estruturados (usado quando a IA precisa de formato específico)
      return {
        content: [{ type: "text", text: encryptedMessage }],
        structuredContent: { encryptedMessage }
      }
    } catch (error) {
      // Se algo der errado, retorna um erro amigável
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `Failed to encrypt message! Check if the message and encryption key are correct. Error details: ${error instanceof Error ? error.message : String(error)}`
        }]
      }
    }
  }
)

// FERRAMENTA 2: Descriptografar mensagem
server.registerTool(
  'decrypt_message',
  {
    description: 'Decrypt a message that was encrypted with the encrypt_message tool',
    inputSchema: {
      encryptedMessage: z.string().describe("The encrypted message (format: iv:ciphertext)"),
      encryptionKey: z.string().describe("The same passphrase used during encryption")
    },
    outputSchema: {
      decryptedMessage: z.string().describe("The decrypted plain-text message")
    }
  },
  async ({ encryptedMessage, encryptionKey }) => {
    try {
      const decryptedMessage = decrypt(encryptedMessage, encryptionKey)
      return {
        content: [{ type: 'text', text: decryptedMessage }],
        structuredContent: { decryptedMessage }
      }
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Failed to decrypt message! Check if the encrypted message is correct and if the encryption key matches the one used for encryption. Error details: ${error instanceof Error ? error.message : String(error)}`,
          }
        ]
      }
    }
  }
)

// RECURSO: Informações técnicas sobre a criptografia
// Um "resource" é como um arquivo ou documento que a IA pode ler para obter informações
server.registerResource(
  'encryption://info',                    // Nome/identificador do recurso
  'encryption://info',                    // URI (endereço único) do recurso
  {
    description: 'Describes the encryption algorithm, key requirements, and output format used by this server',
  },
  // Função que retorna o conteúdo do recurso (como se fosse ler um arquivo)
  () => ({
    contents: [
      {
        uri: "encryption://info",
        mimeType: "text/plain",           // Tipo de conteúdo (texto simples)
        text: 
        `
          Algorithm : AES-256-CBC           // Algoritmo de criptografia (padrão governamental)
          Key derivation: scrypt (passphrase + fixed server salt → 32-byte key)  // Como a senha vira chave
          Output format: <16-byte IV in hex>:<ciphertext in hex>  (separated by ":")  // Formato do resultado
          Notes:
            - Users pass any passphrase — the server derives a strong 32-byte key automatically using scrypt.
            - A random IV is generated for every encryption — the same message encrypted twice will produce different output.
            - Use the exact same passphrase to decrypt.
            - Keep the full "iv:ciphertext" string to decrypt later.
        `.trim(),
      },
    ]
  })
)

// PROMPT: Template para a IA pedir criptografia
// Um "prompt" é um template de mensagem que ajuda a IA a usar as ferramentas corretamente
server.registerPrompt(
  "encrypt_message_prompt",
  {
    description: "Prompt to encrypt a plain-text message using the encrypt_message tool",
    argsSchema: {
      message: z.string().describe("The message to encrypt"),
      encryptionKey: z.string().describe(
        "Any passphrase to use for encryption — the server derives a strong key from it automatically"
      )
    }
  },
  // Função que monta a mensagem final para a IA
  ({ message, encryptionKey }) => ({
    messages: [
      {
        role: 'user',                     // Quem está falando (usuário)
        content: {
          type: "text",
          text: `Please encrypt the following message using the encrypt_message tool.\nMessage: ${message}\nEncryption key: ${encryptionKey}`,
        }
      }
    ]
  })
)
