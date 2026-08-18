const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'bancoDeDadosFalso.json');

app.use(express.json());
app.use(express.static('public'));

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeDB(arr) {
  await fs.writeFile(DB_PATH, JSON.stringify(arr, null, 2), 'utf8');
}

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await readDB();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler banco de dados.' });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;

    // Validações simples
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome inválido.' });
    }
    const precoNum = Number(preco);
    const quantidadeNum = Number(quantidade);
    if (isNaN(precoNum) || precoNum <= 0) {
      return res.status(400).json({ error: 'Preço deve ser maior que zero.' });
    }
    if (!Number.isInteger(quantidadeNum) || quantidadeNum < 0) {
      return res.status(400).json({ error: 'Quantidade inválida.' });
    }

    const produtos = await readDB();
    const nextId = produtos.length ? produtos[produtos.length - 1].id + 1 : 1;
    const novo = { id: nextId, nome: nome.trim(), preco: precoNum, quantidade: quantidadeNum };
    produtos.push(novo);
    await writeDB(produtos);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar produto.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
