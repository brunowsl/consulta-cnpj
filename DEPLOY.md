# Deploy com Dokploy

Este projeto está configurado para deploy automático usando GitHub Actions e Dokploy.

## 🐳 Rodando Localmente com Docker

### Opção 1: Docker Compose (Recomendado)

```bash
# Construir e rodar a aplicação
docker-compose up --build

# Rodar em background
docker-compose up -d --build

# Parar a aplicação
docker-compose down
```

### Opção 2: Docker Direto

```bash
# Construir a imagem
docker build -t consulta-cnpj .

# Rodar o container
docker run -p 3000:3000 --name consulta-cnpj-app consulta-cnpj

# Rodar em background
docker run -d -p 3000:3000 --name consulta-cnpj-app consulta-cnpj

# Parar e remover o container
docker stop consulta-cnpj-app && docker rm consulta-cnpj-app
```

### Testando a Aplicação

Após rodar, a API estará disponível em:
- **URL**: `http://localhost:3000`
- **Endpoint principal**: `POST /api/consultar-cnpj`
- **Health check**: `GET /health` ou `GET /api/health`

### Exemplo de resposta do Health Check

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0"
}
```

### Logs

```bash
# Ver logs com docker-compose
docker-compose logs -f

# Ver logs com docker
docker logs -f consulta-cnpj-app
```

## Configuração Necessária

### 1. Secrets do GitHub

Configure os seguintes secrets no seu repositório GitHub (`Settings > Secrets and variables > Actions`):

- `DOKPLOY_TOKEN`: Token de acesso do Dokploy
- `DOKPLOY_PROJECT_ID`: ID do projeto no Dokploy

### 2. Configuração do Dokploy

1. Acesse o painel do Dokploy
2. Crie um novo projeto
3. Configure o domínio personalizado (opcional)
4. Copie o `PROJECT_ID` e `TOKEN` para os secrets do GitHub

### 3. Variáveis de Ambiente

Configure as seguintes variáveis no Dokploy:

```env
NODE_ENV=production
PORT=3000
```

## Processo de Deploy

### Deploy Automático

O deploy acontece automaticamente quando:

1. **Push para `main` ou `master`**: Deploy automático para produção
2. **Pull Request**: Build e teste da imagem Docker

### Deploy Manual

Para fazer deploy manual:

1. Vá para a aba `Actions` no GitHub
2. Selecione o workflow `Deploy to Dokploy`
3. Clique em `Run workflow`
4. Selecione a branch e clique em `Run workflow`

## Estrutura dos Arquivos

- `Dockerfile`: Configuração do container Docker
- `.dockerignore`: Arquivos ignorados no build
- `.github/workflows/deploy.yml`: Workflow do GitHub Actions
- `dokploy.yaml`: Configuração do Dokploy

## Monitoramento

O projeto inclui:

- Health checks automáticos
- Métricas de CPU e memória
- Logs centralizados
- Monitoramento de requisições HTTP

## Troubleshooting

### Problemas Comuns

1. **Build falha**: Verifique se o Dockerfile está correto
2. **Deploy falha**: Verifique os secrets do GitHub
3. **Aplicação não responde**: Verifique os logs no Dokploy

### Logs

Acesse os logs através do painel do Dokploy ou via CLI:

```bash
dokploy logs --project-id YOUR_PROJECT_ID
```

## Segurança

- Container roda como usuário não-root
- Imagem base Alpine Linux (menor superfície de ataque)
- Health checks para detectar falhas
- Variáveis de ambiente seguras 