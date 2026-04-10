import { ChatOpenAI } from '@langchain/openai';
import { config, type ModelConfig } from '../config.ts';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { createAgent, providerStrategy } from 'langchain';
import { getMCPTools } from './mcpService.ts';
import { z } from 'zod/v3';
import { type ChatGeneration } from '@langchain/core/outputs';

// Serviço para integração com OpenRouter, suportando tanto respostas estruturadas quanto uso de ferramentas
export class OpenRouterService {
  private config: ModelConfig;
  private llmClient: ChatOpenAI;
  private tools: any[];  // Cache das ferramentas MCP

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride ?? config;
    this.llmClient = this.#createChatModel(this.config.models[0]);
    this.tools = [];
  }

  // Cria cliente ChatOpenAI configurado para OpenRouter
  #createChatModel(modelName: string): ChatOpenAI {
    return new ChatOpenAI({
      apiKey: this.config.apiKey,
      modelName: modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': this.config.httpReferer,
          'X-Title': this.config.xTitle,
        },
      },
      modelKwargs: {
        models: this.config.models,
        provider: this.config.provider,
      },
    });
  }

  // Carrega ferramentas MCP (lazy loading, com cache)
  async #getTools() {
    if (!this.tools.length) {
      this.tools = await getMCPTools();  // Ferramentas: MongoDB, filesystem, CSV converter
    }
    return this.tools;
  }

  // Gera respostas: com schema (estruturado) ou com ferramentas (agente autônomo)
  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema?: z.ZodSchema<T>,
  ): Promise<{ data?: T | string; }> {
    // Configura o agente baseado na presença ou não de schema
    const agentConfig = schema
      ? { responseFormat: providerStrategy(schema), tools: [] }  // Modo estruturado (sem ferramentas)
      : { tools: await this.#getTools() };                       // Modo agente (com ferramentas)

    const agent = createAgent({
      ...agentConfig,
      model: this.llmClient,
    });

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    // Executa o agente com callbacks para logging detalhado
    const data = await agent.invoke(
      { messages },
      {
        callbacks: [{
          // Log quando o modelo começa a processar
          handleChatModelStart(_llm, promptMessages) {
            const lastMsg = promptMessages.at(-1)?.at(-1);
            console.log(`\nLLM thinking...`);
            console.log(` (last message: "${lastMsg?.content?.toString()}")`);
          },
          // Log quando o modelo termina (mostra ferramentas chamadas)
          handleLLMEnd(output) {
            const msg = (output.generations?.at(0)?.at(0) as ChatGeneration)?.message as AIMessage;
            const toolCalls = msg?.tool_calls;
            if (toolCalls?.length) {
              console.log(`Decided to call: ${toolCalls.map((t) => t.name).join(', ')}`);
            }
          },
          // Log quando uma ferramenta começa a executar
          handleToolStart(_tool, input, _runId, _parentRunId, _tags, _metadata, runName) {
            console.log(`Tool called: ${runName} →`, input);
          },
          // Log quando uma ferramenta termina
          handleToolEnd(output, _runId, _parentRunId, runName) {
            console.log(`Tool done:   ${runName} →`, output);
          },
        }]
      });
      
    console.log('LLM Response:', JSON.stringify(data, null, 2));

    // Retorna no formato apropriado (estruturado ou texto puro)
    return {
      data: (schema ?
        ((data as any).structuredResponse as T) :   // Modo estruturado: retorna objeto validado
        data.messages.at(-1)?.text as string ?? ""   // Modo agente: retorna texto da resposta
      ),
    };
  }
}
