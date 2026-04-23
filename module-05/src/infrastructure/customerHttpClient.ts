import { type CustomerMutation, type Customer, type CustomerUpdate } from "../domain/customer.ts"

// Cliente HTTP responsável por todas as chamadas à API de clientes
export class CustomerHttpClient {
  private baseUrl: string  // URL base da API (ex: http://localhost:3000)
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // Busca todos os clientes cadastrados
  async listCustomers(): Promise<Customer[]> {
    const res = await fetch(`${this.baseUrl}/customers`)
    return res.json() as Promise<Customer[]>
  }

  // Cria um novo cliente no servidor
  async createCustomer(customer: Customer) {
    const res = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),  // Converte o objeto para JSON
    })
    return res.json() as Promise<CustomerMutation>
  }

  // Busca um cliente específico pelo ID
  async getCustomerById(id: string): Promise<Customer | null> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`)
    if (res.status === 404) return null  // Retorna null se o cliente não existir

    return res.json() as Promise<Customer>
  }

  // Atualiza os dados de um cliente existente
  async updateCustomer(customer: CustomerUpdate) {
    // Separa o _id do resto dos dados (o ID vai na URL, não no corpo da requisição)
    const { _id, ...remaining } = customer
    const res = await fetch(`${this.baseUrl}/customers/${_id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(remaining),  // Envia apenas os campos a serem atualizados
    })

    return res.json() as Promise<CustomerMutation>
  }

  // Remove um cliente pelo ID
  async deleteCustomer(id: string): Promise<CustomerMutation> {
    const response = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: "DELETE"
    })

    return response.json() as Promise<CustomerMutation>
  }
}
