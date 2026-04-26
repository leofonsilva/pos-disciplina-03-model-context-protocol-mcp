# Obtém token de serviço para o usuário ADMIN

# Faz uma requisição POST para o endpoint de service-token com as credenciais do admin
# O resultado é processado pelo jq para extrair apenas o campo serviceToken
SERVICE_TOKEN=$(
  curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "leofonsilva", "password": "123123", "adminSuperSecret": "AM I THE BOSS?"}' \
  | jq -r '.serviceToken')

# Exibe o token obtido para o usuário admin
echo "AdminService Token: $SERVICE_TOKEN"


# Obtém token de serviço para o usuário MEMBER

# Faz uma requisição POST com as credenciais do membro
SERVICE_TOKEN=$(curl --silent -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "tamyresende", "password": "1234", "adminSuperSecret": "AM I THE BOSS?"}' \
  | jq -r '.serviceToken')

echo "Member Service Token: $SERVICE_TOKEN"

# Testa a API autenticada com o token de serviço

# Lista todos os clientes usando o token no cabeçalho de autorização
curl http://localhost:9999/v1/customers \
  -H "Authorization: Bearer $SERVICE_TOKEN"
