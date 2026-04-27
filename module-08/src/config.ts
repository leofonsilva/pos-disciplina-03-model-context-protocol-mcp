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
};

// Verifica se a chave da API OpenRouter está definida no ambiente
console.assert(process.env.OPENROUTER_API_KEY, 'OPENROUTER_API_KEY is not set in environment variables');

// Configuração real usada pela aplicação
export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: '',
  xTitle: 'IA Devs - Transforming Services into Tools',
  models: [
    // 'arcee-ai/trinity-large-preview:free',
    'tencent/hy3-preview:free',
    // 'openai/gpt-oss-120b:free'
  ],
  provider: {
    sort: {
      by: 'throughput', // Roteia para o modelo com maior taxa de transferência (resposta mais rápida)
      partition: 'none',
    },
  },
  temperature: 0.7,        // Criatividade média
  maxTokens: 2048,         // Respostas de até ~1500 palavras
};
