import { StateGraph, START, END } from '@langchain/langgraph';
import { createResearcherNode } from './nodes/researcherNode.ts';
import { createResponderNode } from './nodes/responderNode.ts';
import { OpenRouterService } from '../services/openRouterService.ts';
import { GraphAnnotation } from './state.ts';

// Constrói o grafo de processamento que define o fluxo da IA: pesquisar tendências e depois responder
export function buildTrendsGraph(openRouterService: OpenRouterService) {
  return new StateGraph(GraphAnnotation)      // Cria um novo grafo com o formato de estado definido
    .addNode('researcher', createResearcherNode(openRouterService))  // Nó 1: coleta dados de tendência
    .addNode('responder', createResponderNode(openRouterService))    // Nó 2: gera a resposta ao usuário

    .addEdge(START, 'researcher')             // Início do fluxo: vai direto para o pesquisador
    .addEdge('researcher', 'responder')       // Após pesquisar, passa para o respondedor
    .addEdge('responder', END)                // Após responder, encerra o fluxo

    .compile();                               // Prepara o grafo para ser executado
}
