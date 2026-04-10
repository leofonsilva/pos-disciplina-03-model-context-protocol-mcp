import { HumanMessage } from '@langchain/core/messages';
import { buildGraph } from './graph/factory.ts';

import Fastify from 'fastify';

// Cria e configura o servidor Fastify com rota para chat
export const createServer = async () => {
  // Constrói o grafo (inclui nós: intentParser e agent)
  const graph = await buildGraph();
  
  const app = Fastify();

  // Rota POST para processar perguntas com dados (CSV, JSON, etc.)
  app.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['question'],
        properties: {
          question: { type: 'string', minLength: 10 },  // Mínimo 10 caracteres
        },
      }
    }
  }, async function (request, reply) {
    try {
      // Extrai a pergunta do corpo da requisição
      const { question } = request.body as {
        question: string;
      };

      // Executa o grafo com a pergunta do usuário
      // O fluxo será: intentParser → agent → resposta
      const response = await graph.invoke({
        messages: [new HumanMessage(question)],
      });

      // Retorna a resposta (prioriza answer, fallback para última mensagem)
      return reply.send(response.answer ?? response.messages.at(-1)?.text ?? 'No response generated.');

    } catch (error) {
      console.error('Error processing request:', error);
      return reply.status(500).send({
        error: 'An error occurred while processing your request.',
      });
    }
  });

  return app;
};
