const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { processCSV } = require('./services/csvProcessor');
const { validateCNPJ } = require('./utils/cnpjValidator');

require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post('/api/consulta-cnpj', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
        }

        const fileBuffer = req.file.buffer;
        const results = await processCSV(fileBuffer);
        
        res.json(results);
    } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        res.status(500).json({ error: 'Erro ao processar arquivo' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
