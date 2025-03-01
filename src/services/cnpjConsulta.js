const axios = require('axios');

async function consultarCNPJ(cnpj) {
    try {
        // Usando a API da ReceitaWS que retorna informações mais completas incluindo CNAE
        const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
        
        // Formatando a resposta para incluir especificamente as informações do CNAE
        const data = response.data;
        return {
            ...data,
            atividade_principal: data.atividade_principal.map(ativ => ({
                codigo: ativ.code, // código CNAE
                descricao: ativ.text // descrição da atividade
            })),
            atividades_secundarias: data.atividades_secundarias.map(ativ => ({
                codigo: ativ.code,
                descricao: ativ.text
            }))
        };
    } catch (error) {
        console.error(`Erro ao consultar CNPJ ${cnpj}:`, error.message);
        throw new Error('Erro ao consultar CNPJ');
    }
}

module.exports = { consultarCNPJ };
