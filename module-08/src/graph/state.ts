import { MessagesZodMeta } from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import type { BaseMessage } from '@langchain/core/messages';
import { z } from 'zod/v3';

// Define a estrutura dos dados que trafegam entre os nós do grafo (validação com Zod)
export const GraphAnnotation = z.object({
  messages: withLangGraph(
    z.custom<BaseMessage[]>(),
    MessagesZodMeta), // Metadados especiais para o LangGraph gerenciar mensagens corretamente
  answer: z.string().optional(),
  intent: z.string().optional(),
  fileType: z.string().optional(),
  fileContent: z.string().optional(),
  fileName: z.string().optional(),

  error: z.string().optional(),
});

export type GraphState = z.infer<typeof GraphAnnotation>;
