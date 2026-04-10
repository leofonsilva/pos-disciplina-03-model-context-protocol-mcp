import { StateGraph, START, END } from '@langchain/langgraph';
import { intentNode } from './nodes/intentNode.ts';
import { agentNode } from './nodes/agentNode.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { GraphAnnotation, type GraphState } from './state.ts';

// Constrói o pipeline do grafo com dois nós: identificação de intenção e execução do agente
export function buildGraphPipeline(openRouterService: OpenRouterService) {
  return new StateGraph(GraphAnnotation)
    // Adiciona os nós do grafo
    .addNode('intentParser', intentNode(openRouterService))  // Identifica intenção e extrai dados
    .addNode('agent', agentNode(openRouterService))         // Executa ação baseada na intenção

    // Fluxo: começa pelo parser de intenção
    .addEdge(START, 'intentParser')
    
    // Roteamento condicional após o parser
    .addConditionalEdges('intentParser', (state: GraphState) =>
      state.error ? END : 'agent'  // Se erro, finaliza; senão, vai para o agente
    )
    
    // Após o agente, finaliza
    .addEdge('agent', END)

    // Compila o grafo para execução
    .compile();
}
