// Importa os tipos de domínio e o cliente HTTP para comunicação com a API
import { type CustomerQuery, type Customer, type CustomerUpdate } from "../domain/customer.ts";
import { CustomerHttpClient } from "../infrastructure/customerHttpClient.ts";

// Serviço que orquestra as operações de cliente (camada de aplicação)
export class CustomerService {
  private readonly client: CustomerHttpClient  // Cliente HTTP para fazer requisições à API
  
  constructor(baseUrl: string) {
    this.client = new CustomerHttpClient(baseUrl)  // Inicializa o cliente com a URL base da API
  }

  // Retorna a lista completa de clientes
  async listCustomers(): Promise<Customer[]> {
    return this.client.listCustomers()
  }

  // Cria um novo cliente (sem o _id, que é gerado pelo servidor)
  async createCustomer(customer: Omit<Customer, '_id'>) {
    return this.client.createCustomer(customer)
  }

  // Busca um cliente por ID ou por outros campos (busca flexível)
  async findCustomer(query: CustomerQuery): Promise<Customer | null> {
    // Se a busca for por ID, usa o endpoint específico (mais eficiente)
    if (query._id) return this.client.getCustomerById(query._id)

    // Caso contrário, busca todos os clientes e filtra localmente
    const customers = await this.client.listCustomers()
    return (
      customers.find(customer => {
        // Converte o objeto de busca em um array de [campo, valor]
        const entries = Object.entries(query) as [keyof Customer, string][]

        // Verifica se o cliente corresponde a TODOS os campos da busca
        return entries.every(([key, value]) => {
          const customerValue = customer[key]
          // Verifica se o valor do cliente contém o valor buscado (busca parcial)
          return customerValue?.includes(value)
        })
      })
    ) ?? null  // Retorna null se nenhum cliente for encontrado
  }

  // Atualiza os dados de um cliente existente
  async updateCustomer(customer: CustomerUpdate) {
    return this.client.updateCustomer(customer)
  }

  // Remove um cliente pelo ID
  async deleteCustomer(id: string) {
    return this.client.deleteCustomer(id)
  }
}
