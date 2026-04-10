import { AIMessage } from 'langchain';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';
import { getSystemPrompt, getUserPrompt } from '../../prompts/v1/agentNode.ts';

// Cria um nó agente que processa intenções e arquivos usando IA
export function agentNode(openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('Agent node processing...');
    try {
      // Prepara o prompt do usuário com base na intenção identificada e no conteúdo do arquivo
      const userMessage = getUserPrompt({
        intent: state.intent!,            // Intenção detectada (ex: "extract", "summarize", "ask")
        fileName: state.fileName!,        // Nome do arquivo processado
        fileContent: state.fileContent!   // Conteúdo do arquivo (texto extraído)
      })
      
      // Gera resposta estruturada usando o modelo de IA
      const result = await openRouterService.generateStructured(
        getSystemPrompt(),  // Prompt de sistema (define o papel do agente)
        userMessage,        // Pergunta/contexto do usuário
      )

      // Retorna a resposta como mensagem da IA
      return {
        error: undefined,
        messages: [new AIMessage(result.data as string)]
      };

    } catch (error) {
      console.error('Agent error:', error);
      // Em caso de erro, retorna mensagem amigável e registra o erro
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        messages: [new AIMessage('Sorry, I had trouble processing the request.')],
      };
    }
  };
}
