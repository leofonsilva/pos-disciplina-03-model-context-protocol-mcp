// Configuração do servidor MCP para operações com sistema de arquivos
export const getFSTool = () => {
  return {
    filesystem: {
      transport: 'stdio' as const,                      // Comunicação via entrada/saída padrão
      command: 'npx',                                   // Executa via npx (Node Package Runner)
      args: ['-y', '@modelcontextprotocol/server-filesystem', `${process.cwd()}/data`],  // Acesso apenas à pasta data
    },
  }
}
