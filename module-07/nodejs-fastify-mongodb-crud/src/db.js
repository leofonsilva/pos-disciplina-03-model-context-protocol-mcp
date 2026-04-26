import { MongoClient } from 'mongodb';
import config from './config.js';

// Conecta ao banco de dados e retorna a coleção de clientes
async function connect() {
  const dbClient = new MongoClient(config.dbURL);

  const db = dbClient.db(config.dbName);
  const dbUsers = db.collection(config.collection);

  console.log('Connected to the database');

  return { collections: { dbUsers }, dbClient };
}

// Função principal para obter a conexão com o banco
async function getDb() {
  // Tenta conectar ao banco de dados
  const { collections, dbClient } = await connect();

  return { collections, dbClient };
}

export {
  getDb
}
