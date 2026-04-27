import { createServer } from './server.ts';

// Inicializa o servidor Fastify
const app = await createServer();

// Inicia o servidor escutando na porta 3000, disponível para toda a rede (0.0.0.0)
await app.listen({ port: 3000, host: '0.0.0.0' });
console.log(`Server is running on http://0.0.0.0:3000`);

// Pergunta de teste que será enviada para a IA
const question = `
Crie 3 clientes de teste usando as tools de customer, depois guarde estes clientes em ./data/users.json, em seguida, liste os clientes cadastrados também pela tool de customers.`

// Envia uma requisição POST para o endpoint /chat com a pergunta de teste
app.inject({
  method: 'POST',
  url: '/chat',
  payload: {
    question,
  },
}).then(response => {
  console.log('Response from /chat:', response.statusCode)
  console.log(response.body);
  process.exit(0);
}).catch(error => {
  console.error('Error testing /chat endpoint:', error);
  process.exit(1);
});
