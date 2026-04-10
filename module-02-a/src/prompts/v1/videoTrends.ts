import { z } from 'zod/v3';

// Define o formato da resposta da IA: uma análise textual sobre a tendência do título do vídeo
export const VideoTrendsSchema = z.object({
  answer: z.string().describe('A clear and concise analysis of the video title idea based on Google Trends data, including whether it is trending, stable, or declining, along with actionable recommendations.'),
});

export type VideoTrendsData = z.infer<typeof VideoTrendsSchema>;

// Instrução que define o comportamento da IA no papel de consultor de estratégia de conteúdo
export const getResponderSystemPrompt = () =>
`
You are a helpful content strategy assistant for video creators.
You will receive a user question and real Google Trends data.
Use the data to give a concrete, data-driven recommendation: confirm the title, suggest improvements, or propose rising alternatives.
Be specific and encouraging. Always respond in the same language the user wrote in, preferably in Brazilian Portuguese.
`.trim();

// Monta a mensagem do usuário combinando a pergunta original com os dados de tendência coletados
export const getResponderUserPrompt = (question: string, trendsData: string) =>
  `User question: ${question}\n\nGoogle Trends data:\n${trendsData}`;
