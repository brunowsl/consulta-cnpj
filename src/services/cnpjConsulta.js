const axios = require('axios');

async function getCNAEDetails(cnae) {
    try {
        // API do IBGE para detalhes do CNAE
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v2/cnae/classes/${cnae}`);
        if (response.data && response.data.length > 0) {
            return {
                codigo: response.data[0].id,
                descricao: response.data[0].descricao,
                grupo: response.data[0].grupo.descricao,
                divisao: response.data[0].grupo.divisao.descricao,
                secao: response.data[0].grupo.divisao.secao.descricao
            };
        }
        return null;
    } catch (error) {
        console.error(`Erro ao consultar detalhes do CNAE ${cnae}:`, error.message);
        return null;
    }
}

async function consultarCNPJ(cnpj) {
    try {
        const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
        const data = response.data;

        // Obtém detalhes expandidos do CNAE principal e secundários
        const atividadePrincipalDetalhada = await Promise.all(
            data.atividade_principal.map(async (ativ) => {
                const cnaeCode = ativ.code.replace(/[^\d]/g, '');
                const detalhes = await getCNAEDetails(cnaeCode);
                return {
                    ...ativ,
                    detalhes
                };
            })
        );

        const atividadesSecundariasDetalhadas = await Promise.all(
            data.atividades_secundarias.map(async (ativ) => {
                const cnaeCode = ativ.code.replace(/[^\d]/g, '');
                const detalhes = await getCNAEDetails(cnaeCode);
                return {
                    ...ativ,
                    detalhes
                };
            })
        );

        return {
            ...data,
            atividade_principal: atividadePrincipalDetalhada,
            atividades_secundarias: atividadesSecundariasDetalhadas,
            observacao_sindicato: "Para obter a entidade sindical específica, consulte o Cadastro Nacional de Entidades Sindicais (CNES) em https://www3.mte.gov.br/cnes/ utilizando as informações do CNAE e localização da empresa"
        };
    } catch (error) {
        console.error(`Erro ao consultar CNPJ ${cnpj}:`, error.message);
        throw new Error('Erro ao consultar CNPJ');
    }
}

module.exports = { consultarCNPJ };
