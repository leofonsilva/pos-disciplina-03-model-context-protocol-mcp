// Configuração do servidor MCP para ferramentas do MongoDB
// Baseado no pacote oficial: https://github.com/mongodb-js/mongodb-mcp-server
// 
// IMPORTANTE: O MCP Server é apenas código normal (sem IA)
// Ele apenas EXPÕE ferramentas para o agente usar
export const getMongoDBTool = () => {
  return {
    "MongoDB": {
      // Usa stdio (entrada/saída padrão) - transporte padrão do MCP
      transport: 'stdio' as const,
      
      // Executa via npx (Node Package Executor) para baixar e rodar o servidor
      "command": "npx",
      
      "args": [
        "-y",                               // Aceita instalação automática
        "mongodb-mcp-server@latest",       // Pacote oficial do MongoDB
        
        // NÃO usar --readOnly! O agente precisa escrever (Step 3: Insert JSON)
        // O getSystemPrompt() do agente tem a etapa: "Insert JSON into MongoDB"
        
        // Recomendado: força uso de índices (evita queries lentas)
        "--indexCheck",
        
        // Opcional: limita número de documentos retornados (evita sobrecarga)
        // "--maxDocumentsPerQuery=100"
      ],
      
      // Variáveis de ambiente para configurar a conexão
      "env": {
        // String de conexão com o MongoDB local
        // O servidor NÃO inicia sem esta variável configurada
        "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/dataprocessing"
        
        // Opções adicionais (descomente se necessário):
        // "MDB_MCP_MAX_DOCUMENTS_PER_QUERY": "100",  // Limite de documentos por query
        // "MDB_MCP_LOG_PATH": "./logs",              // Diretório de logs
      }
    }
  }
}
