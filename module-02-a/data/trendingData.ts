// Importa o tipo de dados que representa tendências de busca, vindo do serviço que consulta APIs como o Google Trends
import type { TrendingData } from '../src/services/serpApiService.ts';

// Dados simulados (fixture) de uma palavra-chave em alta - útil para testar algoritmos que detectam tendências ascendentes
export const risingTrendFixture: TrendingData = {
  keywords: [
    {
      keyword: 'TypeScript AI agents',            // Termo pesquisado
      searchVolume: 88,                           // Número estimado de buscas (escala 0-100)
      interestOverTime: 75,                       // Interesse relativo ao longo do tempo (0-100)
      trend: 'rising',                            // Indica que o interesse está aumentando
    },
  ],
  relatedQueries: [                               // Perguntas ou termos relacionados à busca principal
    { query: 'TypeScript LangChain tutorial', value: 100 },  // value = força da relação (0-100)
    { query: 'AI agent typescript', value: 82 },
  ],
  risingTopics: [                                 // Assuntos em alta relacionados
    { topic: 'LangGraph agents', growth: 350 },   // growth = porcentagem de aumento no interesse
    { topic: 'AI development tools', growth: 180 },
  ],
  timestamp: '2026-02-27T00:00:00.000Z',          // Data e hora da coleta desses dados
};

// Dados simulados de uma palavra-chave em declínio - útil para testar detecção de tendências negativas
export const decliningTrendFixture: TrendingData = {
  keywords: [
    {
      keyword: 'jQuery tutorial',
      searchVolume: 30,
      interestOverTime: 22,
      trend: 'declining',                          // Interesse está caindo ao longo do tempo
    },
  ],
  relatedQueries: [
    { query: 'jQuery vs React', value: 40 },
  ],
  risingTopics: [],                                // Nenhum tópico em alta associado
  timestamp: '2026-02-27T00:00:00.000Z',
};
