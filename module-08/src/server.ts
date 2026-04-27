import { HumanMessage } from '@langchain/core/messages';
import { buildGraph } from './graph/factory.ts';

import Fastify from 'fastify';

// Cria e configura o servidor HTTP com um endpoint para conversa com IA
export const createServer = async () => {
  // Constrói o grafo de processamento da IA (agente com ferramentas)
  const graph = await buildGraph();
  
  // Inicializa o servidor Fastify
  const app = Fastify();

  // Define o endpoint POST /chat que recebe perguntas do usuário
  app.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['question'],              // Campo obrigatório
        properties: {
          question: { type: 'string', minLength: 10 }, // Pergunta deve ter pelo menos 10 caracteres
        },
      }
    }
  }, async function (request, reply) {
    try {
      // Extrai a pergunta enviada pelo cliente
      const { question } = request.body as {
        question: string;
      };

      // Executa o grafo da IA (que tem acesso às ferramentas de customers e filesystem)
      const response = await graph.invoke({
        messages: [new HumanMessage(question)], // A pergunta entra como mensagem do usuário
      });

      // Retorna a resposta: tenta pegar response.answer primeiro, senão a última mensagem
      return reply.send(response.answer ?? response.messages.at(-1)?.text ?? 'No response generated.');

    } catch (error) {
      console.error('Error processing request:', error);
      // Em caso de erro, retorna status 500 com mensagem amigável
      return reply.status(500).send({
        error: 'An error occurred while processing your request.',
      });
    }
  });

  return app;
};
