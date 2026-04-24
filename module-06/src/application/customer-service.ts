import type { Customer, CustomerQuery, CustomerMutation } from "../domain/customer.ts";
import { CustomerHttpClient } from "../infrastructure/customer-http-client.ts";

// Serviço que orquestra as operações de cliente (camada de aplicação)
export class CustomerService {
  private readonly client: CustomerHttpClient;  // Cliente HTTP para fazer requisições à API

  constructor(baseUrl: string, serviceToken: string) {
    // Inicializa o cliente com a URL base e token de serviço (autenticação entre sistemas)
    this.client = new CustomerHttpClient(baseUrl, serviceToken);
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
  async updateCustomer(
    id: string,
    data: Partial<Omit<Customer, '_id'>>
  ): Promise<CustomerMutation> {
    return this.client.updateCustomer(id, data);
  }

  // Remove um cliente pelo ID
  async deleteCustomer(id: string): Promise<CustomerMutation> {
    return this.client.deleteCustomer(id);
  }
}
