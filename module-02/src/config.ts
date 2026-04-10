// Configuração dos modelos e provedor OpenRouter
export type ModelConfig = {
  apiKey: string;           // Chave de autenticação do OpenRouter
  httpReferer: string;      // Site de origem para identificação (opcional)
  xTitle: string;           // Nome do projeto (identificação nas estatísticas)

  provider: {
    sort: {
      by: string;           // Critério de ordenação: 'price' (mais barato) ou 'throughput' (mais rápido)
      partition: string;    // Particionamento dos resultados ('none' = sem restrição)
    };
  };

  models: string[];         // Lista de modelos disponíveis para roteamento
  temperature: number;      // Controle de criatividade (0 = preciso, 1 = criativo)
  maxTokens: number;        // Limite máximo de tokens na resposta
};

// Verifica se a chave da API está configurada nas variáveis de ambiente
console.assert(process.env.OPENROUTER_API_KEY, 'OPENROUTER_API_KEY is not set in environment variables');

export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,   // Chave vinda das variáveis de ambiente
  httpReferer: '',                           // Site de origem (vazio = não informado)
  xTitle: 'IA Devs - Transforming Services into Tools',  // Identificação do projeto
  
  // Modelos disponíveis (apenas um por enquanto, mas pode adicionar mais)
  models: [
    // 'arcee-ai/trinity-large-preview:free',  // Modelo gratuito (comentado)
    'stepfun/step-3.5-flash'                   // Modelo atual (bom custo-benefício)
  ],
  
  provider: {
    sort: {
      by: 'throughput',    // Prioriza o modelo mais rápido (menor latência)
      partition: 'none',   // Sem particionamento (todos os provedores disponíveis)
    },
  },
  
  temperature: 0.7,        // Criatividade moderada (equilíbrio entre precisão e variação)
  maxTokens: 2048,         // Limite de 2048 tokens (respostas mais longas, ~1500 palavras)
};
