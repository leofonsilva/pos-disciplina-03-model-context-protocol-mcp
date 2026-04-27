import { randomUUID } from 'node:crypto'
import { REQUESTS_PER_MINUTE } from './config.js'

// Lista de usuários autorizados com suas credenciais e papéis
export const authUsers = [{
  username: 'leofonsilva',
  password: '123123',
  role: 'admin',        // Administrador tem acesso total
},
{
  username: 'tamyresende',
  password: '1234',
  role: 'member'        // Membro tem acesso limitado
}]

// Chave secreta para assinar os tokens JWT
export const JWT_SECRET = 'supersecret'

// Chave secreta para gerar tokens de serviço (acesso entre sistemas)
export const ADMIN_SUPER_SECRET = 'AM I THE BOSS?'

// Armazena tokens de serviço emitidos (memória temporária)
const issuedServiceTokens = new Map()

// Configuração de limite de requisições (rate limiting)
export const rateLimitOptions = {
  max: REQUESTS_PER_MINUTE,              // Número máximo de requisições por minuto
  timeWindow: '1 minute',                // Janela de tempo
  keyGenerator: (request) => request.headers?.authorization?.replace(/bearer /i, '') ?? request.ip,  // Identifica o cliente pelo token ou IP
}

// Registra as rotas de autenticação e o hook de verificação de token
export function initAuthRoute(fastify) {
  // Hook executado antes de cada requisição para validar o token
  fastify.addHook('onRequest', async (request, reply) => {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
      '/v1/health',
      '/v1/auth/login',
      '/v1/auth/service-token'
    ]
    if (publicRoutes.includes(request.originalUrl)) return

    // Extrai o token do cabeçalho Authorization
    const token = request.headers?.authorization?.replace(/bearer /i, '')

    // Verifica se é um token de serviço (válido para comunicação entre sistemas)
    const serviceUser = issuedServiceTokens.get(token)
    if (serviceUser) {
      request.user = serviceUser
      return
    }

    // Tenta validar o token JWT padrão
    try {
      await request.jwtVerify()
    } catch (error) {
      console.error('[onRequest]', error)
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  })

  // Rota de login: usuário envia credenciais e recebe um token JWT
  fastify.post('/v1/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      }
    },
    async (request, reply) => {
      const { username, password } = request.body

      // Busca o usuário pelo nome e senha (case insensitive)
      const user = authUsers.find(
        user =>
          user.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
          user.password === password
      )

      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' })
      }

      // Gera um token JWT contendo username e role
      const token = fastify.jwt.sign({ username, role: user.role })

      return reply.send({ token })
    })

  // Rota para gerar token de serviço (requer adminSuperSecret)
  fastify.post('/v1/auth/service-token',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password', 'adminSuperSecret'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            adminSuperSecret: { type: 'string' },
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              role: { type: 'string' },
              serviceToken: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      }
    },
    async (request, reply) => {
      const { username, password, adminSuperSecret } = request.body

      // Verifica o segredo de administrador
      if (adminSuperSecret !== ADMIN_SUPER_SECRET) {
        return reply.code(401).send({ message: 'Invalid adminSuperSecret' })
      }

      // Valida as credenciais do usuário
      const user = authUsers.find(
        user =>
          user.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
          user.password === password
      )

      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' })
      }

      // Gera um token de serviço único e armazena na memória
      const serviceToken = randomUUID()
      issuedServiceTokens.set(serviceToken, { username: user.username, role: user.role })

      return reply.send({ serviceToken, role: user.role })
    })
}

// Middleware para verificar se o usuário tem a role necessária
export function requireRole(role) {
  return async function (request, reply) {
    if (request.user.role === role) return  // Usuário tem permissão
    return reply.code(403).send({
      message: 'Forbidden: insufficient permissions'
    })
  }
}
