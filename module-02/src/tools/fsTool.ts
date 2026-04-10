// Configuração do servidor MCP para ferramentas de sistema de arquivos
export const getFSTool = () => {
  return {
    "filesystem": {
      transport: 'stdio' as const,                  // Comunicação via entrada/saída padrão
      "command": "npx",                             // Executa via npx (Node Package Executor)
      "args": [
        "-y",                                       // Aceita instalação automaticamente
        "@modelcontextprotocol/server-filesystem",  // Servidor MCP para sistema de arquivos
        `${process.cwd()}/reports`,                 // Diretório onde o servidor terá acesso (./reports)
      ]
    }
  }
}