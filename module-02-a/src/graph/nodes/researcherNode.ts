import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';
import { getKeywordsSystemPrompt } from '../../prompts/v1/keywords.ts';

// Cria um nó do grafo de IA responsável por pesquisar tendências com base na pergunta do usuário
export function createResearcherNode(openRouterService: OpenRouterService) {
  // Este nó recebe o estado atual do grafo e retorna as atualizações parciais
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('Researcher processing...'); // Indica no console que o pesquisador começou a trabalhar
    
    // Pega a última mensagem do histórico (que é a pergunta do usuário)
    const userQuestion = state.messages.at(-1)!.content as string;
    
    try {
      // Chama a IA (via OpenRouter) para gerar uma resposta estruturada:
      // - O system prompt define o comportamento (ex: como extrair palavras-chave)
      // - A pergunta do usuário é o conteúdo principal
      const result = await openRouterService.generateStructured(
        getKeywordsSystemPrompt(),
        userQuestion,
      );

      console.log('Trends data fetched via tool call'); // Confirma que os dados foram obtidos

      // Retorna os dados de tendência (convertidos em string formatada) e a pergunta original
      return {
        trendsData: JSON.stringify(result.data, null, 2),
        question: userQuestion,
      };

    } catch (error) {
      // Em caso de erro, retorna uma mensagem amigável e mantém a pergunta
      console.error('Researcher error:', error);
      return {
        trendsData: 'Sorry, something went wrong while fetching trends data.',
        question: userQuestion,
      };
    }
  };
}
