const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const bancoPath = path.join(__dirname, 'bancoDeDadosFalso.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function lerProdutos() {
	const arquivo = await fs.readFile(bancoPath, 'utf8');
	const produtos = JSON.parse(arquivo || '[]');
	return Array.isArray(produtos) ? produtos : [];
}

async function salvarProdutos(produtos) {
	await fs.writeFile(bancoPath, JSON.stringify(produtos, null, 2), 'utf8');
}

app.get('/produtos', async (req, res) => {
	try {
		const produtos = await lerProdutos();
		res.json(produtos);
	} catch (erro) {
		res.status(500).json({ erro: 'Nao foi possivel ler o banco de dados.' });
	}
});

app.post('/produtos', async (req, res) => {
	const { nome, preco, quantidade } = req.body;
	const precoNumerico = Number(preco);
	const quantidadeNumerica = Number(quantidade);

	if (typeof nome !== 'string' || nome.trim() === '') {
		return res.status(400).json({ erro: 'Informe o nome do produto.' });
	}
	if (!Number.isFinite(precoNumerico) || precoNumerico <= 0) {
		return res.status(400).json({ erro: 'O preco deve ser maior que zero.' });
	}
	if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
		return res.status(400).json({ erro: 'A quantidade nao pode ser negativa.' });
	}

	try {
		const produtos = await lerProdutos();
		const ultimoId = produtos.reduce((maiorId, produto) => Math.max(maiorId, Number(produto.id) || 0), 0);
		const novoProduto = {
			id: ultimoId + 1,
			nome: nome.trim(),
			preco: precoNumerico,
			quantidade: quantidadeNumerica
		};

		produtos.push(novoProduto);
		await salvarProdutos(produtos);
		res.status(201).json(novoProduto);
	} catch (erro) {
		res.status(500).json({ erro: 'Nao foi possivel salvar o produto.' });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
