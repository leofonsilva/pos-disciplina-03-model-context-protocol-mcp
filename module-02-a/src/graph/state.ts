import { MessagesZodMeta } from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import type { BaseMessage } from '@langchain/core/messages';
import { z } from 'zod/v3';

// Define a estrutura dos dados que trafegam entre os nós do grafo (validação com Zod)
export const GraphAnnotation = z.object({
  // Histórico de mensagens da conversa (ex: pergunta do usuário, resposta da IA)
  messages: withLangGraph(
    z.custom<BaseMessage[]>(),
    MessagesZodMeta),      // Metadados especiais para o LangGraph gerenciar mensagens corretamente
  
  // Dados de tendência coletados pelo nó researcher (formato JSON em string)
  trendsData: z.string().optional(),
  
  // Pergunta original do usuário, salva para ser usada depois no nó responder
  question: z.string().optional(),
  
  // Palavras-chave extraídas da pergunta (ainda não usada, mas reservada para futuras melhorias)
  keywords: z.array(z.string()).optional(),
});

// Tipo TypeScript inferido a partir do esquema Zod, usado para garantir segurança nos nós do grafo
export type GraphState = z.infer<typeof GraphAnnotation>;
