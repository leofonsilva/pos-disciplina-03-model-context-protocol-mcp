import z from "zod";

// Schema para validar um cliente individual
export const CustomerSchema = z.object({
  _id: z.string().optional().describe("MongoDB ObjectId of the customer"),  // Opcional porque não existe na criação
  name: z.string(),
  phone: z.string(),
})
export type Customer = z.infer<typeof CustomerSchema>

// Schema para os critérios de busca de clientes (extende CustomerSchema)
export const CustomerQuerySchema = CustomerSchema.extend({
  name: z.string().optional().describe('Full name of the customer'),
  phone: z.string().optional().describe('phone number of the customer')
})
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>

// Schema para atualização de cliente: o _id é obrigatório (precisa saber qual cliente atualizar)
export const CustomerUpdateSchema = CustomerQuerySchema.extend({
  _id: z.string().describe("MongoDB ObjectId of the customer"),
})
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>

// Schema para a resposta das operações da API
export const CustomerMutationSchema = z.object({
  id: z.string().optional().describe("MongoDB ObjectId of the deleted customer"),
  message: z.string().optional().describe("Confirmation message"),
  isError: z.boolean().optional().describe("Indicates if an error occurred"),
  customer: CustomerSchema.optional().describe("The found customer"),
  customers: z.array(CustomerSchema).optional().describe("List of customers"),
})
export type CustomerMutation = z.infer<typeof CustomerMutationSchema>
