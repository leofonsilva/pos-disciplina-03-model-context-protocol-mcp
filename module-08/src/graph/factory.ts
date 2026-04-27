import { buildGraphPipeline } from './graph.ts';
import { OpenRouterService } from '../services/openRouterService.ts';

// Função que cria e configura o grafo de IA para o agente de conversação
export async function buildGraph() {
  // Inicializa o serviço que conecta com o OpenRouter (acesso a LLMs)
  const llm = new OpenRouterService();

  // Constrói o grafo (fluxo de processamento) com o modelo de linguagem configurado
  return buildGraphPipeline(llm);
}

// Versão pronta do grafo para ser usada em outros arquivos (ex: API ou rota)
export const graph = async () => {
  return buildGraph();
};

export default graph;
