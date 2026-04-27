import { StateGraph, START, END } from '@langchain/langgraph';
import { agentNode } from './nodes/agentNode.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { GraphAnnotation, type GraphState } from './state.ts';

// Constrói o grafo de processamento do agente de IA
export function buildGraphPipeline(openRouterService: OpenRouterService) {
  return new StateGraph(GraphAnnotation)                    // Cria um novo grafo com o estado definido
    .addNode('agent', agentNode(openRouterService))         // Adiciona o nó do agente

    .addEdge(START, 'agent')                                // Início do fluxo: vai direto para o agente
    .addConditionalEdges('agent', (state: GraphState) =>    // Após o agente, decide o próximo passo
      state.error ? 'agent' : END                           // Se houve erro, repete o nó; senão, encerra
    )
    .compile();                                             // Prepara o grafo para ser executado
}
