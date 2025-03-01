# API de Consulta de CNPJs

API para consulta em lote de CNPJs através de arquivo CSV. A API processa o arquivo, valida cada CNPJ e retorna informações detalhadas de cada empresa, incluindo dados cadastrais e códigos CNAE.

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

### Endpoint de Consulta

`POST /api/consulta-cnpj`

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
curl -X POST -F "file=@cnpjs.csv" http://localhost:3000/api/consulta-cnpj
```

Usando JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('file', csvFile);

fetch('http://localhost:3000/api/consulta-cnpj', {
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

## Desenvolvimento

Para rodar a API em modo desenvolvimento com hot-reload:

```bash
npm run dev
```

## Licença

ISC
