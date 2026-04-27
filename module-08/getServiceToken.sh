# Obtém token de serviço para o usuário ADMIN

# Faz uma requisição POST para o endpoint de service-token com as credenciais do admin
# O resultado é processado pelo jq para extrair apenas o campo serviceToken
SERVICE_TOKEN=$(
  curl --silent -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "leofonsilva", "password": "123123", "adminSuperSecret": "AM I THE BOSS?"}' \
  | jq -r '.serviceToken')

# Altera o SERVICE_TOKEN no .env
if grep -q "^SERVICE_TOKEN=" .env 2>/dev/null; then
  sed -i "s|^SERVICE_TOKEN=.*|SERVICE_TOKEN=$SERVICE_TOKEN|" .env
else
  echo "SERVICE_TOKEN=$SERVICE_TOKEN" >> .env
fi
