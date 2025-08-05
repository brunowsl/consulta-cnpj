# API de Consulta de CNPJs

API para consulta em lote de CNPJs através de arquivo CSV. A API processa o arquivo, valida cada CNPJ e retorna informações detalhadas de cada empresa, incluindo dados cadastrais e códigos CNAE.

## 🚀 Status do Projeto

- ✅ **Docker**: Configurado e pronto para uso
- ✅ **Health Check**: Endpoints de monitoramento implementados
- ✅ **CI/CD**: Configurado para deploy automático com Dokploy
- ✅ **Documentação**: Completa e atualizada

## 🐳 Deploy e Execução

### Rodando com Docker (Recomendado)

```bash
# Construir e rodar a aplicação
docker build -t consulta-cnpj .
docker run -p 3000:3000 consulta-cnpj

# Ou usando docker-compose
docker-compose up --build
```

### Rodando Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start
```

## Requisitos

- Node.js 14.x ou superior
- npm 6.x ou superior

## Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd consulta-cnpj

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
```

## Uso da API

### Endpoints Disponíveis

#### 1. Health Check
- `GET /health` - Status da aplicação
- `GET /api/health` - Status da aplicação (alternativo)

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development",
  "version": "1.0.0"
}
```

#### 2. Endpoint de Consulta

`POST /api/consultar-cnpj`

Este endpoint recebe um arquivo CSV contendo CNPJs e retorna as informações de cada empresa.

#### Requisição

- Método: `POST`
- Content-Type: `multipart/form-data`
- Campo do arquivo: `file`

O arquivo CSV deve:
- Conter um CNPJ por linha
- Os CNPJs podem estar formatados (XX.XXX.XXX/XXXX-XX) ou apenas números

Exemplo de arquivo CSV:
```csv
60.746.948/0001-12
33000167000101
60.701.190/0001-04
```

#### Resposta

A API retorna um array JSON onde cada elemento contém:

```json
{
    "cnpj": "string",
    "valido": boolean,
    "dados": {
        // Dados da empresa se o CNPJ for válido
    },
    "error": "string | null"
}
```

#### Códigos de Resposta

- `200 OK`: Requisição processada com sucesso
- `400 Bad Request`: Arquivo não enviado ou formato inválido
- `500 Internal Server Error`: Erro ao processar a requisição

#### Exemplo de Uso

Usando curl:
```bash
# Testar health check
curl http://localhost:3000/health

# Consultar CNPJs
curl -X POST -F "file=@cnpjs.csv" http://localhost:3000/api/consultar-cnpj
```

Usando JavaScript/Fetch:
```javascript
// Testar health check
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log('Health:', data));

// Consultar CNPJs
const formData = new FormData();
formData.append('file', csvFile);

fetch('http://localhost:3000/api/consultar-cnpj', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Exemplo de Resposta

```json
[
    {
        "cnpj": "60746948000112",
        "valido": true,
        "dados": {
            "razao_social": "BANCO BRADESCO S.A.",
            "nome_fantasia": "BRADESCO",
            "situacao_cadastral": "ATIVA",
            "atividade_principal": [
                {
                    "code": "6422-1/00",
                    "text": "Bancos múltiplos, com carteira comercial",
                    "detalhes": {
                        "codigo": "6422100",
                        "descricao": "Bancos múltiplos, com carteira comercial",
                        "grupo": "Intermediação monetária - depósitos à vista",
                        "divisao": "Atividades de serviços financeiros",
                        "secao": "Atividades financeiras, de seguros e serviços relacionados"
                    }
                }
            ],
            "atividades_secundarias": [
                {
                    "code": "6435-2/03",
                    "text": "Companhias hipotecárias",
                    "detalhes": {
                        "codigo": "6435203",
                        "descricao": "Companhias hipotecárias",
                        "grupo": "Outras atividades de serviços financeiros",
                        "divisao": "Atividades de serviços financeiros",
                        "secao": "Atividades financeiras, de seguros e serviços relacionados"
                    }
                }
            ],
            "observacao_sindicato": "Para obter a entidade sindical específica, consulte o Cadastro Nacional de Entidades Sindicais (CNES) em https://www3.mte.gov.br/cnes/ utilizando as informações do CNAE e localização da empresa",
            // ... outros dados da empresa
        },
        "error": null
    },
    {
        "cnpj": "00000000000000",
        "valido": false,
        "dados": null,
        "error": "CNPJ inválido"
    }
]
```

## Informações sobre CNAE e Sindicatos

A API agora fornece informações detalhadas sobre os CNAEs da empresa, incluindo:

- Código e descrição do CNAE
- Grupo econômico
- Divisão
- Seção

Para identificar a entidade sindical correspondente, utilize estas informações em conjunto com:

1. Base territorial da empresa (município/estado)
2. Categoria econômica principal
3. Consulta ao Cadastro Nacional de Entidades Sindicais (CNES)

O link para consulta ao CNES é fornecido na resposta da API através do campo `observacao_sindicato`.

## Limitações

- A API utiliza o serviço ReceitaWS para consultas, que possui limites de requisições
- O arquivo CSV deve ter tamanho máximo de 10MB
- Recomenda-se não enviar mais de 100 CNPJs por vez para evitar sobrecarga
- A API da ReceitaWS tem um limite de 3 consultas por minuto na versão gratuita

## 🏗️ Estrutura do Projeto

```
consulta-cnpj/
├── src/
│   ├── app.js              # Aplicação principal
│   ├── services/
│   │   ├── cnpjConsulta.js # Serviço de consulta CNPJ
│   │   └── csvProcessor.js # Processamento de CSV
│   └── utils/
│       └── cnpjValidator.js # Validação de CNPJ
├── Dockerfile              # Configuração Docker
├── .dockerignore           # Arquivos ignorados no Docker
├── .github/workflows/      # CI/CD GitHub Actions
├── dokploy.yaml           # Configuração Dokploy
└── DEPLOY.md              # Documentação de deploy
```

## 🔧 Desenvolvimento

Para rodar a API em modo desenvolvimento com hot-reload:

```bash
npm run dev
```

## 🚀 Deploy Automático

O projeto está configurado para deploy automático usando:
- **GitHub Actions**: Build e push da imagem Docker
- **Dokploy**: Deploy automático em produção
- **Health Checks**: Monitoramento automático

Veja o arquivo `DEPLOY.md` para instruções detalhadas.

## 📊 Monitoramento

- **Health Check**: `/health` e `/api/health`
- **Logs**: Centralizados via Docker
- **Métricas**: CPU, memória e requisições HTTP
- **Status**: Monitoramento automático via Docker health checks

## Licença

ISC
