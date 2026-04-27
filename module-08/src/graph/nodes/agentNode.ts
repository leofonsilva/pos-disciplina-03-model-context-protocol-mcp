import { AIMessage } from '@langchain/core/messages';
import { getSystemPrompt } from '../../prompts/v1/agentNode.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';

// Cria um nó do grafo de IA responsável por gerar respostas usando o agente
export function agentNode(openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('Agent node processing...');

    try {
      // Pega a última mensagem do histórico (pergunta do usuário)
      const rawQuestion = state.messages.at(-1)!.text;

      // Obtém o prompt do sistema que define o comportamento do agente
      const systemPrompt = getSystemPrompt();

      // Chama a IA (via OpenRouter) para gerar uma resposta
      const result = await openRouterService.generateStructured(
        systemPrompt,
        rawQuestion,
      );

      const answer = result.data as string;

      // Retorna a resposta, limpa qualquer erro anterior, e adiciona a mensagem ao histórico
      return {
        answer,
        error: undefined,
        messages: [new AIMessage(answer)],
      };

    } catch (error) {
      console.error('Agent node error:', error);
      // Em caso de erro, retorna uma mensagem amigável e guarda o erro no estado
      return {
        messages: [new AIMessage('Sorry, I encountered an error while processing your request. Please try again.')],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
