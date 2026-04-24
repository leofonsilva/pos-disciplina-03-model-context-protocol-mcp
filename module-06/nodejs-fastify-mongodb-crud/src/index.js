import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'

import { getDb } from './db.js'
import { ObjectId } from 'mongodb'
import { initAuthRoute, JWT_SECRET, rateLimitOptions, requireRole } from './auth.js';

// Verifica se está em ambiente de teste
const isTestEnv = process.env.NODE_ENV === 'test';

// Em ambiente de produção, verifica se o nome do banco foi informado
if (!isTestEnv && !process.env.DB_NAME) {
  console.error('[error*****]: please, pass DB_NAME env before running it!')
  process.exit(1)
}

// Cria a instância do servidor Fastify
const fastify = Fastify({})

// Registra os plugins de autenticação e rate limiting
await fastify.register(fastifyJwt, { secret: JWT_SECRET })
await fastify.register(fastifyRateLimit, rateLimitOptions)

// Inicializa as rotas de autenticação (login, service-token, e hook de validação)
initAuthRoute(fastify)

// Conecta ao banco de dados e obtém a coleção de clientes
const { dbClient, collections: { dbUsers } } = await getDb()

// Endpoint público de saúde da API
fastify.get('/v1/health', async (request, reply) => {
  reply.code(200).send({ app: 'customers', version: 'v1.0.1' })
})

// Lista todos os clientes (acessível a qualquer usuário autenticado)
fastify.get('/v1/customers', async (request, reply) => {
  const customers = await dbUsers
    .find({})
    .sort({ name: 1 })      // Ordena por nome crescente (A-Z)
    .toArray()

  return reply.code(200).send(customers)
})

// Busca um cliente específico pelo ID
fastify.get('/v1/customers/:id', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  const { id } = request.params
  
  // Valida se o ID tem o formato correto do MongoDB
  if (!ObjectId.isValid(id)) {
    return reply.code(400).send({ message: 'the id is invalid!', id })
  }

  const user = await dbUsers.findOne({ _id: ObjectId.createFromHexString(id) })

  if (!user) {
    return reply.code(404).send({ error: 'User not found' })
  }
  
  // Remove o _id e retorna os dados com o campo 'id' no lugar
  const { _id, ...remainingUserData } = user
  return reply.code(200).send({ ...remainingUserData, id })
})

// Cria um novo cliente (apenas administradores)
fastify.post('/v1/customers', {
  preHandler: [requireRole('admin')],     // Só admin pode criar
  schema: {
    body: {
      type: 'object',
      required: ['name', 'phone'],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  const user = request.body
  const result = await dbUsers.insertOne(user)
  return reply.code(201).send({ 
    message: `user ${user.name} created!`, 
    id: result.insertedId.toString() 
  })
})

// Atualiza um cliente existente (apenas administradores)
fastify.put('/v1/customers/:id', {
  preHandler: [requireRole('admin')],
  schema: {
    body: {
      type: 'object',
      required: ['name', 'phone'],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  const { id } = request.params
  const user = request.body
  
  if (!ObjectId.isValid(id)) {
    return reply.code(400).send({ message: 'the id is invalid!', id })
  }

  const result = await dbUsers.updateOne(
    { _id: ObjectId.createFromHexString(id) }, 
    { $set: user }      // $set = atualiza apenas os campos informados
  )

  if (!result.modifiedCount) {
    return reply.code(404).send({ message: 'User not found or no changes made', id })
  }

  return reply.code(200).send({ message: `User ${id} updated!`, id })
})

// Remove um cliente (apenas administradores)
fastify.delete('/v1/customers/:id', {
  preHandler: [requireRole('admin')],
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          id: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  const { id } = request.params
  
  if (!ObjectId.isValid(id)) {
    return reply.code(400).send({ message: 'the id is invalid!', id })
  }

  const result = await dbUsers.deleteOne({ _id: ObjectId.createFromHexString(id) })

  if (!result.deletedCount) {
    return reply.code(404)
  }

  return reply.code(200).send({ message: `User ${id} deleted!`, id })
})

// Fecha a conexão com o banco quando o servidor for encerrado
fastify.addHook('onClose', async () => {
  console.log('server closed!')
  return dbClient.close()
})

// Configuração de CORS para permitir requisições de outros domínios
fastify.addHook('preHandler', (req, res, done) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");

  // Responde imediatamente às requisições OPTIONS (preflight do CORS)
  const isPreflight = /options/i.test(req.method);
  if (isPreflight) {
    return res.send();
  }

  done();
})

// Se não estiver em ambiente de teste, inicia o servidor
if (!isTestEnv) {
  const serverInfo = await fastify.listen({
    port: process.env.PORT || 9999,
    host: '::',           // Escuta em IPv6 e IPv4
  })

  console.log(`server is running at ${serverInfo}`)
}

export const server = fastify


// Código de teste comentado (mantido para referência e teste rápido)

// Teste com login de usuário (JWT)
// import { authUsers } from './auth.js'

// const adminUser = authUsers.at(0)
// const memberUser = authUsers.at(1)
// const user = adminUser

// console.log(user)

// const authResponse = await fastify.inject({
//     method: 'POST',
//     url: `/v1/auth/login`,
//     payload: user,
// })

// const { token } = await authResponse.json()
// console.log(token)

// const createCustomerResponse = await fastify.inject({
//     method: 'POST',
//     url: `/v1/customers`,
//     headers: {
//         'Authorization': `bearer ${token}`
//     },
//     payload: { name: 'test', phone: 'test' },
// })

// console.log(' createCustomerResponse ', await createCustomerResponse.json())


// Teste com token de serviço (comunicação entre sistemas)
// import { authUsers, ADMIN_SUPER_SECRET } from './auth.js'

// const adminUser = authUsers.at(0)
// const memberUser = authUsers.at(1)
// const user = memberUser

// console.log(user)

// const authResponse = await fastify.inject({
//     method: 'POST',
//     url: `/v1/auth/service-token`,
//     payload: {
//         ...user,
//         adminSuperSecret: ADMIN_SUPER_SECRET,
//     },
// })

// const { role, serviceToken } = await authResponse.json()
// console.log(role, serviceToken)

// const createCustomerResponse = await fastify.inject({
//     method: 'POST',
//     url: `/v1/customers`,
//     headers: {
//         'Authorization': `bearer ${serviceToken}`
//     },
//     payload: { name: 'test', phone: 'test' },
// })

// console.log(' createCustomerResponse ', await createCustomerResponse.json())
