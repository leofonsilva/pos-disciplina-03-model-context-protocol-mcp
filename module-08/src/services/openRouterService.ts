import { ChatOpenAI } from '@langchain/openai';
import { config, type ModelConfig } from '../config.ts';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import type { ChatGeneration } from '@langchain/core/outputs';
import type { AIMessage } from '@langchain/core/messages';
import { createAgent, providerStrategy } from 'langchain';
import { getMCPTools } from './mcpService.ts';
import { z } from 'zod/v3';

// Serviço que conecta com o OpenRouter (acesso a múltiplos modelos de IA)
export class OpenRouterService {
  private config: ModelConfig;
  private llmClient: ChatOpenAI;
  private tools: any[];

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride ?? config;
    this.llmClient = this.#createChatModel(this.config.models[0]); // Usa o primeiro modelo da lista
    this.tools = [];
  }

  // Cria e configura o cliente de chat da OpenRouter (compatível com OpenAI)
  #createChatModel(modelName: string): ChatOpenAI {
    return new ChatOpenAI({
      apiKey: this.config.apiKey,
      modelName: modelName,
      temperature: this.config.temperature,     // Controla a criatividade
      maxTokens: this.config.maxTokens,         // Tamanho máximo da resposta
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': this.config.httpReferer,
          'X-Title': this.config.xTitle,
        },
      },
      modelKwargs: {
        models: this.config.models,    // Lista de modelos disponíveis
        provider: this.config.provider,
      },
    });
  }

  // Carrega as ferramentas MCP (customer + filesystem) apenas uma vez
  async #getTools() {
    if (!this.tools.length) {
      this.tools = await getMCPTools();
    }
    return this.tools;
  }

  // Gera uma resposta estruturada ou livre, podendo usar ferramentas (tools)
  async generateStructured<T>(
    systemPrompt: string,    // Instrução de comportamento da IA
    userPrompt: string,      // Pergunta ou comando do usuário
    schema?: z.ZodSchema<T>, // Opcional: formato esperado da resposta
  ): Promise<{ data?: T | string; }> {
    // Configura o agente: se houver schema, usa resposta estruturada; senão, libera uso de ferramentas
    const agentConfig = schema
      ? { responseFormat: providerStrategy(schema), tools: [] }
      : { tools: await this.#getTools() };

    const agent = createAgent({
      ...agentConfig,
      model: this.llmClient,
    });

    // Prepara a conversa com as mensagens de sistema e do usuário
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    // Executa o agente com callbacks para logging (mostra o que a IA está fazendo)
    const data = await agent.invoke({ messages }, {
      callbacks: [{
        // Quando a IA começa a pensar
        handleChatModelStart(_llm, promptMessages) {
          const lastMsg = promptMessages.at(-1)?.at(-1);
          console.log(`\nLLM thinking...`);
          console.log(` (last message: "${(lastMsg as any)?.content?.toString()}")`);
        },
        // Quando a IA termina de processar e decide chamar ferramentas
        handleLLMEnd(output) {
          const msg = (output.generations?.at(0)?.at(0) as ChatGeneration)?.message as AIMessage;
          const toolCalls = msg?.tool_calls;
          if (toolCalls?.length) {
            console.log(`Decided to call: ${toolCalls.map((t) => t.name).join(', ')}`);
          }
        },
        // Quando uma ferramenta começa a ser executada
        handleToolStart(_tool, input, _runId, _parentRunId, _tags, _metadata, runName) {
          console.log(`🔧 Tool called: ${runName} →`, input);
        },
        // Quando uma ferramenta termina a execução
        handleToolEnd(output, _runId, _parentRunId, runName) {
          console.log(`Tool done:   ${runName} →`, output);
        },
      }]
    });
    
    console.log('LLM Response:', JSON.stringify(data, null, 2));

    // Retorna os dados no formato correto:
    // - Se tem schema, retorna a resposta estruturada
    // - Se não, retorna o texto da última mensagem
    return {
      data: (schema ?
        ((data as any).structuredResponse as T) :
        data.messages.at(-1)?.text as string ?? ""
      ),
    };
  }
}
