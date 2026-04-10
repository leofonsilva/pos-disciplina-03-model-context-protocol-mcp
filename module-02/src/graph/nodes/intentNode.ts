import { AIMessage } from 'langchain';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';
import { getSystemPrompt, type IntentData, IntentSchema } from '../../prompts/v1/identifyIntent.ts';

// Cria um nó que identifica a intenção do usuário e extrai informações do arquivo
export function intentNode(openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('Intent node processing...');
    try {
      // Pega a última mensagem do usuário
      const rawQuestion = state.messages.at(-1)!.text as string;
      
      // Chama a IA para identificar a intenção e extrair dados estruturados
      const result = await openRouterService.generateStructured(
        getSystemPrompt(),  // Prompt de sistema (ex: "Você é um assistente que classifica intenções")
        rawQuestion,        // Mensagem do usuário
        IntentSchema        // Schema esperado: { intent, fileType, fileName, fileContent }
      )

      const parsed = result.data as IntentData
      
      // Valida se os campos obrigatórios foram extraídos
      if (!parsed.intent || !parsed.fileType) {
        console.log('Missing intent or fileType in parsed data:', parsed);
        throw new Error('Invalid intent data');
      }

      // Define nome padrão para o arquivo se não foi especificado
      parsed.fileName ??= `data.${parsed.fileType}`

      // Logs informativos
      console.log('Extracted intent:', parsed.intent);      // Ex: "extract", "summarize", "ask"
      console.log('File Type:', parsed.fileType);          // Ex: "csv", "json", "txt"
      console.log('File name:', parsed.fileName);

      // Retorna os dados extraídos para o estado do grafo
      return {
        intent: parsed.intent,
        fileContent: parsed.fileContent ?? "",  // Conteúdo do arquivo (se fornecido)
        fileName: parsed.fileName,
      };

    } catch (error) {
      console.error('Intent node error:', error);
      // Em caso de erro, retorna mensagem amigável
      return {
        messages: [new AIMessage('Sorry, I had trouble understanding the intent. Please rephrase your question or provide more details.')],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
