import type { Customer, CustomerMutation } from "../domain/customer.ts";
import { UnauthorizedError, ForbiddenError, RateLimitError } from "../domain/errors.ts";

// Cliente HTTP responsável por todas as chamadas à API de clientes (com autenticação)
export class CustomerHttpClient {
  private baseUrl: string;
  private authHeaders: Record<string, string>;

  constructor(baseUrl: string, serviceToken: string) {
    this.baseUrl = baseUrl;
    // Adiciona o token de serviço no cabeçalho de autorização
    this.authHeaders = { Authorization: `Bearer ${serviceToken}` };
  }

  // Verifica o status da resposta e lança erros específicos quando necessário
  async #assertOk(res: Response): Promise<void> {
    if (res.status === 401) throw new UnauthorizedError();   // Token inválido ou ausente
    if (res.status === 403) throw new ForbiddenError();      // Permissão insuficiente
    if (res.status === 429) throw new RateLimitError();      // Muitas requisições
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText} - ${await res.text()}`);
  }

  // Lista todos os clientes
  async listCustomers(): Promise<Customer[]> {
    const res = await fetch(`${this.baseUrl}/customers`, { headers: this.authHeaders });
    await this.#assertOk(res);
    return res.json() as Promise<Customer[]>;
  }

  // Busca um cliente pelo ID (retorna null se não encontrar)
  async getCustomerById(id: string): Promise<Customer | null> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`, { headers: this.authHeaders });
    // 404 = não encontrado, 400 = ID inválido - ambos retornam null
    if (res.status === 404 || res.status === 400) return null;
    await this.#assertOk(res);
    return res.json() as Promise<Customer>;
  }

  // Cria um novo cliente
  async createCustomer(data: Omit<Customer, '_id'>): Promise<CustomerMutation> {
    const res = await fetch(`${this.baseUrl}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.authHeaders },
      body: JSON.stringify(data),
    });
    await this.#assertOk(res);
    return res.json() as Promise<CustomerMutation>;
  }

  // Atualiza um cliente existente
  async updateCustomer(id: string, data: Partial<Omit<Customer, '_id'>>): Promise<CustomerMutation> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...this.authHeaders },
      body: JSON.stringify(data),
    });
    await this.#assertOk(res);
    return res.json() as Promise<CustomerMutation>;
  }

  // Remove um cliente pelo ID
  async deleteCustomer(id: string): Promise<CustomerMutation> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: "DELETE",
      headers: this.authHeaders,
    });
    await this.#assertOk(res);
    return res.json() as Promise<CustomerMutation>;
  }
}
