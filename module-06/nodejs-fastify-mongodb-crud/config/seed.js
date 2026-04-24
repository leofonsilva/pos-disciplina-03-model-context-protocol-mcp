import { MongoClient } from 'mongodb'
import config from '../src/config.js';
import { users } from './users.js';

// Verifica se está rodando em ambiente de teste
const isTestEnv = process.env.NODE_ENV === 'test'

// Função de log silenciosa em ambiente de teste (evita poluir a saída dos testes)
const log = (...args) => {
  if (isTestEnv) return;
  console.log(...args)
}

// Popula o banco de dados com dados iniciais (seed)
async function runSeed() {
  const client = new MongoClient(config.dbURL);
  
  try {
    await client.connect();
    log(`Db connected successfully to ${config.dbName}!`);

    const db = client.db(config.dbName);
    const collection = db.collection(config.collection);

    // Remove todos os documentos existentes na coleção
    await collection.deleteMany({})
    
    // Insere os usuários iniciais
    await Promise.all(users.map(i => collection.insertOne({ ...i })))

    // Exibe todos os documentos inseridos (apenas para debug)
    log(await collection.find().toArray())

  } catch (err) {
    log(err.stack);
  } finally {
    // Fecha a conexão com o banco
    await client.close();
  }
}

// Executa o seed automaticamente apenas se NÃO for ambiente de teste
// Em ambiente de teste, o seed é chamado manualmente pelo beforeEach
if (!isTestEnv) runSeed();

export { runSeed }
