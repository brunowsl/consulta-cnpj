const axios = require('axios');

async function consultarCNPJ(cnpj) {
    try {
        // Using a public API for CNPJ consultation
        const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao consultar CNPJ ${cnpj}:`, error.message);
        throw new Error('Erro ao consultar CNPJ');
    }
}

module.exports = { consultarCNPJ };
