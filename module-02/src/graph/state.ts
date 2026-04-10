import { MessagesZodMeta } from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import type { BaseMessage } from '@langchain/core/messages';
import { z } from 'zod/v3';

// Define a estrutura de estado do grafo de pipeline
export const GraphAnnotation = z.object({
  // Histórico de mensagens da conversa
  messages: withLangGraph(
    z.custom<BaseMessage[]>(),
    MessagesZodMeta),
  
  // Resposta final gerada pelo agente
  answer: z.string().optional(),
  
  // Intenção identificada (ex: "extract", "summarize", "ask")
  intent: z.string().optional(),
  
  // Conteúdo do arquivo extraído (texto, CSV, JSON, etc.)
  fileContent: z.string().optional(),
  
  // Nome do arquivo sendo processado
  fileName: z.string().optional(),

  // Mensagem de erro, se houver
  error: z.string().optional(),
});

export type GraphState = z.infer<typeof GraphAnnotation>;
