import { getJson } from 'serpapi';
import type { SerpAPIConfig } from '../config.ts';
import { risingTrendFixture } from '../../data/trendingData.ts';

// Estrutura de dados para uma palavra-chave e sua tendência
export type KeywordTrend = {
  keyword: string;
  searchVolume: number;        // Pico de buscas no período
  interestOverTime: number;    // Média de interesse (0-100)
  trend: 'rising' | 'stable' | 'declining';
};

// Consulta relacionada ao termo principal
export type RelatedQuery = {
  query: string;
  value: number;               // Força da relação com o termo principal
};

// Tópico que está crescendo em popularidade
export type RisingTopic = {
  topic: string;
  growth: number;              // Percentual de crescimento
};

// Dados completos de tendências retornados pela API
export type TrendingData = {
  keywords: KeywordTrend[];
  relatedQueries: RelatedQuery[];
  risingTopics: RisingTopic[];
  timestamp: string;           // Momento da coleta
};

// Serviço que consulta o Google Trends via API SerpAPI
export class SerpAPIService {
  private config: SerpAPIConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map(); // Reservado para futura implementação de cache

  constructor(config: SerpAPIConfig) {
    this.config = {
      ...config,
    };
  }

  // Busca dados de tendência para uma ou mais palavras-chave
  async getGoogleTrends(keywords: string[]): Promise<TrendingData> {
    console.log('🔍 Fetching Google Trends data for keywords:', keywords);
    
    // Se o serviço estiver desabilitado, retorna dados de exemplo (fixture) para testes
    if (this.config.disabled) {
      console.warn('SerpAPIService is disabled. Returning fixture data.');
      return risingTrendFixture;
    }

    const keywordTrends: KeywordTrend[] = [];
    const relatedQueriesSet = new Set<RelatedQuery>();  // Usa Set para evitar duplicatas
    const risingTopicsSet = new Set<RisingTopic>();

    // Busca dados para cada palavra-chave individualmente
    for (const keyword of keywords) {
      try {
        console.log(`Fetching data for "${keyword}"...`);
        const trendsData = await this.fetchTrendsData(keyword);
        console.log(`Fetched trends for "${keyword}":`, trendsData);

        // Extrai a tendência da palavra-chave principal
        const keywordTrend = this.parseKeywordTrend(keyword, trendsData);
        if (keywordTrend) {
          keywordTrends.push(keywordTrend);
        }

        // Extrai consultas relacionadas
        const relatedQueries = this.parseRelatedQueries(trendsData);
        relatedQueries.forEach(q => relatedQueriesSet.add(q));

        // Extrai tópicos em alta
        const risingTopics = this.parseRisingTopics(trendsData);
        risingTopics.forEach(t => risingTopicsSet.add(t));
      } catch (error: any) {
        console.warn(`Failed to fetch trends for "${keyword}":`, error.message);
      }
    }

    // Organiza os resultados: ordena e limita a quantidade
    return {
      keywords: keywordTrends.sort((a, b) => b.interestOverTime - a.interestOverTime), // Do maior interesse para o menor
      relatedQueries: Array.from(relatedQueriesSet).sort((a, b) => b.value - a.value).slice(0, 10), // Top 10
      risingTopics: Array.from(risingTopicsSet).sort((a, b) => b.growth - a.growth).slice(0, 5),    // Top 5
      timestamp: new Date().toISOString(),
    };
  }

  // Faz a chamada real para a API SerpAPI (Google Trends)
  private async fetchTrendsData(keyword: string): Promise<any> {
    return getJson({
      engine: 'google_trends',
      q: keyword,
      api_key: this.config.apiKey,
      date: 'now 7-d',           // Últimos 7 dias
      data_type: 'TIMESERIES',   // Dados ao longo do tempo
    });
  }

  // Analisa os dados brutos e calcula a tendência (subindo, estável ou caindo)
  private parseKeywordTrend(keyword: string, data: any): KeywordTrend | null {
    if (!data?.interest_over_time?.timeline_data) {
      return null;
    }

    const timelineData = data.interest_over_time.timeline_data;
    const values = timelineData.map((item: any) => item.values?.[0]?.extracted_value || 0);

    if (values.length === 0) {
      return null;
    }

    // Calcula média geral do período
    const avgInterest = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
    
    // Compara os 3 dias mais recentes com os 3 primeiros dias
    const recentValues = values.slice(-3);
    const earlyValues = values.slice(0, 3);
    const recentAvg = recentValues.reduce((sum: number, val: number) => sum + val, 0) / recentValues.length;
    const earlyAvg = earlyValues.reduce((sum: number, val: number) => sum + val, 0) / earlyValues.length;

    // Regra simples para classificar tendência:
    // - Aumento >20% = rising
    // - Queda >20% = declining
    // - Caso contrário = stable
    let trend: 'rising' | 'stable' | 'declining' = 'stable';
    if (recentAvg > earlyAvg * 1.2) {
      trend = 'rising';
    } else if (recentAvg < earlyAvg * 0.8) {
      trend = 'declining';
    }

    return {
      keyword,
      searchVolume: Math.max(...values),      // Pico de interesse no período
      interestOverTime: Math.round(avgInterest),
      trend,
    };
  }

  // Extrai consultas relacionadas (tanto "top" quanto "rising") dos dados brutos
  private parseRelatedQueries(data: any): RelatedQuery[] {
    const queries: RelatedQuery[] = [];

    if (data?.related_queries?.top) {
      data.related_queries.top.forEach((item: any) => {
        if (item.query && item.value) {
          queries.push({
            query: item.query,
            value: item.value,
          });
        }
      });
    }

    if (data?.related_queries?.rising) {
      data.related_queries.rising.forEach((item: any) => {
        if (item.query && item.value) {
          queries.push({
            query: item.query,
            value: item.value,
          });
        }
      });
    }

    return queries;
  }

  // Extrai tópicos em alta (rising topics) dos dados brutos
  private parseRisingTopics(data: any): RisingTopic[] {
    const topics: RisingTopic[] = [];

    if (data?.related_topics?.rising) {
      data.related_topics.rising.forEach((item: any) => {
        if (item.topic && item.value) {
          topics.push({
            topic: item.topic.title || item.topic,
            // Converte string como "+850%" para número 850
            growth: typeof item.value === 'string' && item.value.includes('+')
              ? parseInt(item.value.replace(/\D/g, ''))
              : item.value,
          });
        }
      });
    }

    return topics;
  }
}
