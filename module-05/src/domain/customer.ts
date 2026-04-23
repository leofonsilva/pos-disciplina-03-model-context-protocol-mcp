import z from "zod";

// Schema para validar um cliente individual
export const CustomerSchema = z.object({
  _id: z.string().optional(),      // ID gerado pelo MongoDB (opcional porque não existe na criação)
  name: z.string(),                // Nome completo do cliente
  phone: z.string(),               // Telefone do cliente
})
export type Customer = z.infer<typeof CustomerSchema>  // Tipo TypeScript inferido

// Schema para os critérios de busca de clientes (todos os campos são opcionais)
export const CustomerQuerySchema = z.object({
  _id: z.string().optional().describe("MongoDB ObjectId of the customer"),
  name: z.string().optional().describe('Full name of the customer'),
  phone: z.string().optional().describe('phone number of the customer')
})
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>

// Schema para atualização de cliente: o _id é obrigatório (precisa saber qual cliente atualizar)
export const CustomerUpdateSchema = CustomerQuerySchema.extend({
  _id: z.string().describe("MongoDB ObjectId of the customer"),  // _id agora é obrigatório
})

export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>

// Schema para a resposta das ferramentas MCP (o que será retornado para a IA)
export const CustomerMutationSchema = z.object({
  id: z.string().optional().describe("MongoDB ObjectId of the customer"),
  message: z.string().optional().describe('Confirmation message'),
  isError: z.boolean().optional().describe('Indicates if an error occurred'),
  customer: CustomerSchema.optional().describe("The found customer"),
  customers: z.array(CustomerSchema).optional().describe("List of customers"),
})

export type CustomerMutation = z.infer<typeof CustomerMutationSchema>
