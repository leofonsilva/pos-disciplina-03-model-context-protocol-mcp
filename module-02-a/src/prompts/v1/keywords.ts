import { z } from 'zod/v3';

// Define o formato esperado que a IA deve retornar: um array com 2 palavras-chave
export const KeywordsSchema = z.object({
  keywords: z.array(z.string()).describe('The 2 most relevant search keywords extracted from the user question to query Google Trends.'),
});

export type KeywordsData = z.infer<typeof KeywordsSchema>;

// Instrução para a IA: extrair palavras-chave e chamar a ferramenta de busca de tendências
export const getKeywordsSystemPrompt = () =>
`
You are a research assistant for video content creators.
Given a user question about video topics, extract exactly 2 keywords and call google_trends ONCE with both keywords in a single array. Do not call the tool more than once.
Do not answer without calling the tool first.
`.trim();

// Código antigo comentado (mantido para referência):
// Este trecho abaixo permitiria que a IA fizesse múltiplas chamadas à ferramenta,
// mas a versão atual força apenas uma única chamada com as duas palavras juntas

// export const getKeywordsSystemPrompt = () =>
// `
// You are a research assistant for video content creators.
// Given a user question about video topics, extract the 2 most relevant search keywords and IMMEDIATELY call the google_trends tool with those keywords.
// Do not answer without calling the tool first.
// `.trim();
