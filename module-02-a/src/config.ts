// Definição dos tipos de configuração do sistema

export type ModelConfig = {
  apiKey: string;           // Chave da API do OpenRouter
  httpReferer: string;      // Identificador da aplicação para o provedor
  xTitle: string;           // Nome do projeto (aparece nos logs do OpenRouter)

  provider: {
    sort: {
      by: string;           // Critério para escolher o modelo (ex: 'throughput' = mais rápido)
      partition: string;    // Particionamento de provedores
    };
  };

  models: string[];         // Lista de modelos de IA disponíveis (o primeiro é usado)
  temperature: number;      // Criatividade da IA (0 = exato, 1 = criativo)
  maxTokens: number;        // Tamanho máximo da resposta em tokens
  serpAPIConfig: SerpAPIConfig; // Configuração da API de busca (Google Trends)
};

// Verifica se as chaves de API necessárias existem no ambiente
console.assert(process.env.OPENROUTER_API_KEY, 'OPENROUTER_API_KEY is not set in environment variables');
console.assert(process.env.SERPAPI_API_KEY, 'SERPAPI_API_KEY is not set in environment variables');

export type SerpAPIConfig = {
  apiKey: string;           // Chave da API SerpAPI
  cacheTTL?: number;        // Tempo de vida do cache em milissegundos (opcional)
  disabled?: boolean;       // Se true, retorna dados falsos (fixture) em vez de chamar a API real
};

// Configuração real usada pela aplicação
export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: '',
  xTitle: 'IA Devs - Transforming Services into Tools',
  models: [
    // Modelos comentados eram testes anteriores, mantidos para referência
    // 'openai/gpt-oss-120b:free',
    // 'arcee-ai/trinity-large-preview:free',
    // 'qwen/qwen3-next-80b-a3b-instruct:free',
    // 'mistralai/mistral-small-3.1-24b-instruct:free',
    // 'qwen/qwen3-coder-next',
    'stepfun/step-3.5-flash'                   // Modelo atual (bom custo-benefício)
  ],
  provider: {
    sort: {
      by: 'throughput', // Roteia para o modelo com maior taxa de transferência (resposta mais rápida)
      partition: 'none',
    },
  },
  temperature: 0.7,        // Criatividade média
  maxTokens: 2048,         // Respostas de até ~1500 palavras
  serpAPIConfig: {
    apiKey: process.env.SERPAPI_API_KEY!,
    cacheTTL: 3600000,     // 1 hora em milissegundos
    // disabled: false,
    disabled: true,        // Desabilitado: retorna dados fictícios em vez de chamar a API real
  },
};
