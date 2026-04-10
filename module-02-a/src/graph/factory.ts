import { buildTrendsGraph } from './graph.ts';
import { OpenRouterService } from '../services/openRouterService.ts';

// Função que cria e configura o grafo de IA para análise de tendências
export async function buildGraph() {
  // Inicializa o serviço que conecta com o OpenRouter (acesso a LLMs como GPT, Claude, etc.)
  const llm = new OpenRouterService();
  
  // Constrói o grafo (fluxo de processamento) com o modelo de linguagem configurado
  return buildTrendsGraph(llm);
}

// Versão pronta do grafo para ser usada em outros arquivos (ex: API ou rota)
export const graph = async () => {
  return buildGraph();
};

export default graph; // Exporta o grafo como padrão para facilitar a importação
