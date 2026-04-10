import { readFileSync } from 'fs';
import { createServer } from './server.ts';

// Cria uma instância do servidor Fastify
const app = await createServer();

// Inicia o servidor na porta 3000, disponível em todas as interfaces de rede
await app.listen({ port: 3000, host: '0.0.0.0' });
console.log(`Server is running on http://0.0.0.0:3000`);

// Lê o arquivo CSV com dados de vendas (versão menor para teste)
const salesData = readFileSync('./data/sales.csv', 'utf-8');
// Para testar com dados completos, descomente a linha abaixo:
// const salesData = readFileSync('./data/sales-complete.csv', 'utf-8');

// Exemplo de pergunta alternativa (ranking de produtos mais vendidos)
// const question = `
// Rank the top 5 most sold products:

// ${salesData}
// `

// Pergunta atual: cálculo de receita total a partir dos dados CSV
const question = `
Here is a CSV file called sales.csv.
What's the total revenue from this sales data?.

${salesData}
`

// Faz uma requisição de teste para o endpoint /chat
app.inject({
  method: 'POST',
  url: '/chat',
  payload: {
    question,  // Envia a pergunta junto com os dados CSV
  },
}).then(response => {
  console.log('Response from /chat:', response.statusCode)
  console.log(response.body);
  process.exit(0);  // Encerra o processo com sucesso
}).catch(error => {
  console.error('Error testing /chat endpoint:', error);
  process.exit(1);  // Encerra o processo com erro
});
