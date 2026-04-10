import { ChatOpenAI } from '@langchain/openai';
import { config, type ModelConfig } from '../config.ts';
import { SystemMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import { createAgent, providerStrategy } from 'langchain';
import { getMCPTools } from './mcpService.ts';
import { z } from 'zod/v3';

// Serviço que conecta com o OpenRouter (acesso a múltiplos modelos de IA como GPT, Claude, etc.)
export class OpenRouterService {
  private config: ModelConfig;      // Configurações da API (chave, modelo, temperatura, etc.)
  private llmClient: ChatOpenAI;    // Cliente para comunicação com a IA
  private tools: any[];             // Ferramentas que a IA pode usar (ex: buscar tendências, ler arquivos)

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride ?? config;
    this.llmClient = this.#createChatModel(this.config.models[0]); // Inicia com o primeiro modelo da lista
    this.tools = [];
  }

  // Cria e configura o cliente de chat da OpenRouter (compatível com OpenAI)
  #createChatModel(modelName: string): ChatOpenAI {
    return new ChatOpenAI({
      apiKey: this.config.apiKey,
      modelName: modelName,
      temperature: this.config.temperature,     // Controla a criatividade (0 = exato, 1 = criativo)
      maxTokens: this.config.maxTokens,         // Tamanho máximo da resposta
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1', // Endereço da API da OpenRouter
        defaultHeaders: {
          'HTTP-Referer': this.config.httpReferer,
          'X-Title': this.config.xTitle,
        },
      },
      modelKwargs: {
        models: this.config.models,    // Lista de modelos disponíveis
        provider: this.config.provider, // Provedor de preferência (ex: OpenRouter)
      },
    });
  }

  // Gera uma resposta estruturada ou livre, podendo usar ferramentas (tools) e schema de validação
  async generateStructured<T>(
    systemPrompt: string,    // Instrução de comportamento da IA
    userPrompt: string,      // Pergunta ou comando do usuário
    schema?: z.ZodSchema<T>, // Opcional: formato esperado da resposta (validação Zod)
  ): Promise<{ data?: T | string; }> {
    // Carrega as ferramentas (MCP + Google Trends) apenas uma vez
    if (!this.tools.length) {
      this.tools = await getMCPTools();
    }

    // Configura o agente: se houver schema, usa resposta estruturada; senão, libera uso de ferramentas
    const agentConfig = schema ?
      {
        responseFormat: providerStrategy(schema), // Força a resposta a seguir o schema
        tools: []                                 // Quando usa schema, não permite ferramentas
      }
      : { tools: this.tools };                    // Sem schema, a IA pode chamar ferramentas

    const agent = createAgent({
      ...agentConfig,
      model: this.llmClient,
    });

    // Prepara a conversa com as mensagens de sistema e do usuário
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    // Executa o agente e obtém a resposta
    const data = await agent.invoke({ messages });
    console.log('LLM Response:', JSON.stringify(data, null, 2));

    // Retorna os dados no formato correto:
    // - Se tem schema, retorna a resposta estruturada
    // - Se não, retorna o texto da última mensagem
    return {
      data: (schema ?
        ((data as any).structuredResponse as T) :
        data.messages.at(-1)?.text
      ),
    };
  }
}
