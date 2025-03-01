const { parse } = require('csv-parse');
const { validateCNPJ } = require('../utils/cnpjValidator');
const { consultarCNPJ } = require('./cnpjConsulta');

async function processCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
        const results = [];
        const parser = parse({
            delimiter: ',',
            skip_empty_lines: true,
            trim: true
        });

        parser.on('readable', async function() {
            let record;
            while ((record = parser.read()) !== null) {
                const cnpj = record[0].replace(/[^\d]/g, '');
                results.push(cnpj);
            }
        });

        parser.on('error', function(err) {
            reject(err);
        });

        parser.on('end', async function() {
            try {
                const processedResults = await Promise.all(
                    results.map(async (cnpj) => {
                        const isValid = validateCNPJ(cnpj);
                        let data = {
                            cnpj,
                            valido: isValid,
                            dados: null,
                            error: null
                        };

                        if (isValid) {
                            try {
                                data.dados = await consultarCNPJ(cnpj);
                            } catch (error) {
                                data.error = 'Erro ao consultar CNPJ';
                            }
                        }

                        return data;
                    })
                );
                resolve(processedResults);
            } catch (error) {
                reject(error);
            }
        });

        parser.write(fileBuffer);
        parser.end();
    });
}

module.exports = { processCSV };
