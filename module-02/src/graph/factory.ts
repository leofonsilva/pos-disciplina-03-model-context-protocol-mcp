import { buildGraphPipeline } from './graph.ts';
import { OpenRouterService } from '../services/openRouterService.ts';

// Constrói o grafo do pipeline com todas as dependências
export async function buildGraph() {
  // Cria o cliente OpenRouter para chamadas de IA
  const llm = new OpenRouterService();
  
  // Constrói o pipeline do grafo (intenção → agente)
  return buildGraphPipeline(llm);
}

// Versão simplificada da função (retorna Promise do grafo)
export const graph = async () => {
  return buildGraph();
};

// Exportação padrão para compatibilidade com diferentes padrões de importação
export default graph;
