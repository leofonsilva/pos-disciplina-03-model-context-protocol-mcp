import { tool } from "@langchain/core/tools";
import csvtojson from 'csvtojson'
import { z } from 'zod/v3'

// Cria uma ferramenta para converter CSV para JSON
export function getCSVToJSONTool() {
  return tool(
    // Função assíncrona que realiza a conversão
    async ({ csvText }) => {
      // Converte o texto CSV para array de objetos JSON
      const result = await csvtojson().fromString(csvText)
      
      // Log informativo com número de registros convertidos
      console.log('[getCSVToJSONTool] conversion result finished', result.length, 'records');

      // Retorna o JSON como string para o agente
      return JSON.stringify(result)
    },
    {
      // Nome da ferramenta (como será chamada pelo agente)
      name: 'csv_to_json',
      
      // Descrição para o modelo entender quando usar
      description: 'Convert CSV to JSON format',
      
      // Schema de entrada da ferramenta (validação Zod)
      schema: z.object({
        csvText: z.string().describe(
          'CSV data to be converted to JSON format'
        )
      })
    }
  )
}
