// Configuração do servidor MCP para operações com clientes (CRUD)
export const getCustomersTool = () => {
  // Obtém o token de serviço das variáveis de ambiente
  const serviceToken = process.env.SERVICE_TOKEN;
  
  // Valida se o token foi fornecido (obrigatório para autenticação)
  if (!serviceToken) {
    throw new Error('SERVICE_TOKEN environment variable is required for customers-mcp tool');
  }

  return {
    'customers-mcp': {
      transport: 'stdio' as const,              // Comunicação via entrada/saída padrão
      command: 'npx',                           // Executa via npx (Node Package Runner)
      // Versão comentada com registry local (útil para testes com npm local)
      // "args": ["-y", "--registry", "http://localhost:4873", "@leofonsilva/customers-mcp@latest"],
      "args": ["-y", "@leofonsilva/customers-mcp@latest"],  // Executa a última versão do pacote do npm
      env: {
        SERVICE_TOKEN: process.env.SERVICE_TOKEN as string,  // Injeta o token no ambiente do servidor
      }
    },
  }
}