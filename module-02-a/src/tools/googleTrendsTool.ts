import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { SerpAPIService } from '../services/serpApiService.ts';

// Cria uma ferramenta que a IA pode chamar para consultar o Google Trends
export function createGoogleTrendsTool(serpAPIService: SerpAPIService) {
  return tool(
    // Função executada quando a IA decide usar esta ferramenta
    async ({ keywords }) => {
      // Busca os dados de tendência para as palavras-chave fornecidas
      const data = await serpAPIService.getGoogleTrends(keywords);
      // Retorna os dados em formato texto (string) para a IA interpretar
      return JSON.stringify(data);
    },
    {
      name: 'google_trends',
      description: // Explica para a IA quando e como usar esta ferramenta
        'Get Google Trends data for a list of keywords. Use this to analyze if a video title or topic is trending, rising, or declining in popularity. Always call this when the user shares a video title idea.',
      schema: z.object({
        // Define o formato esperado dos argumentos: um array de palavras-chave
        keywords: z.array(z.string()).describe('Keywords extracted from the video title to analyze'),
      }),
    },
  );
}
