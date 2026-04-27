import { randomUUID } from 'node:crypto'

// Gera um nome aleatório de 4 caracteres para o banco de dados de teste
const randomName = randomUUID().slice(0, 4)

// Configurações do banco de dados com valores padrão (podem ser sobrescritas por variáveis de ambiente)
const dbUser = process.env.DB_USER || 'root'
const dbPassword = process.env.DB_PASSWORD || 'example'
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || '27017'

// Nome do banco: usa variável de ambiente ou gera um nome aleatório (útil para testes paralelos)
const dbName = process.env.DB_NAME || `${randomName}-test`

// Configuração centralizada da aplicação
const config = {
  dbName,                           // Nome do banco de dados
  collection: 'customers',          // Nome da coleção onde os clientes serão armazenados
  dbURL: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}`  // URL de conexão com o MongoDB
}

// Limite de requisições por minuto para o rate limiting
export const REQUESTS_PER_MINUTE = 90

export default config
