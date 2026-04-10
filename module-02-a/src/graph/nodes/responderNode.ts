import { AIMessage } from '@langchain/core/messages';
import { OpenRouterService } from '../../services/openRouterService.ts';
import { getResponderSystemPrompt, getResponderUserPrompt } from '../../prompts/v1/videoTrends.ts';
import type { GraphState } from '../state.ts';

// Cria um nó do grafo de IA responsável por gerar a resposta final ao usuário com base nos dados de tendência
export function createResponderNode(openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('Responder processing...'); // Indica que o respondedor começou a gerar a resposta
    
    try {
      // Pega a pergunta original do usuário (que foi salva no estado pelo nó pesquisador)
      const userQuestion = state.question!;

      // Chama a IA para gerar uma resposta estruturada:
      // - System prompt define o papel da IA (ex: especialista em tendências de vídeo)
      // - User prompt monta a pergunta junto com os dados de tendência coletados
      const { data } = await openRouterService.generateStructured(
        getResponderSystemPrompt(),
        getResponderUserPrompt(userQuestion, state.trendsData ?? ''),
      );

      const content = data as string; // Converte o resultado para texto

      // Retorna a resposta no formato de mensagem para ser adicionada ao histórico do chat
      return { messages: [new AIMessage(content)] };

    } catch (error) {
      // Se falhar, retorna uma mensagem de erro amigável
      console.error('Responder error:', error);
      return { messages: [new AIMessage('Sorry, something went wrong while generating the response.')] };
    }
  }
}
