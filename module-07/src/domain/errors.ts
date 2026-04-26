// Erro personalizado para quando o token de serviço está ausente ou inválido
export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized: service token is missing or invalid') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// Erro personalizado para quando o token não tem permissão suficiente (role inadequada)
export class ForbiddenError extends Error {
  constructor(message = 'Forbidden: token does not have sufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Erro personalizado para quando o limite de requisições por minuto é excedido
export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded. Please try again later.') {
    super(message);
    this.name = 'RateLimitError';
  }
}
