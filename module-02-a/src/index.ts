import { createServer } from './server.ts';

// Inicializa o servidor Fastify
const app = await createServer();

// Inicia o servidor escutando na porta 3000, disponível para toda a rede (0.0.0.0)
await app.listen({ port: 3000, host: '0.0.0.0' });
console.log(`Server is running on http://0.0.0.0:3000`);

// Teste automático ao iniciar: envia uma requisição POST para o endpoint /chat
app.inject({
  method: 'POST',
  url: '/chat',
  payload: { question: "Estou pensando em criar um video sobre Web AI, quais titulos você me recomendaria sobre?" },
}).then(response => {
  console.log('Response from /chat:', response.statusCode)  // Exibe o código HTTP (200 = sucesso)
  console.log(response.body);                               // Exibe a resposta da IA
}).catch(error => {
  console.error('Error testing /chat endpoint:', error);
});

// Exemplo de como chamar o endpoint manualmente via terminal:
// curl -X POST -H 'Content-type: application/json' --data '{"question": "upper"}' localhost:3000/chat