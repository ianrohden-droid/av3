const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'tarefas.json');

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

app.get('/tarefas', async (req, res) => {
  try {
    const tarefas = await readDB();
    // ordenar por data + horario
    tarefas.sort((a, b) => {
      const da = new Date(a.data + 'T' + (a.horario || '00:00'));
      const db = new Date(b.data + 'T' + (b.horario || '00:00'));
      return da - db;
    });
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler tarefas.' });
  }
});

app.post('/tarefas', async (req, res) => {
  try {
    const { titulo, descricao, data, horario, categoria, prioridade } = req.body;
    const categorias = ['Estudo', 'Trabalho', 'Pessoal', 'Evento', 'Outro'];
    const prioridades = ['Baixa', 'Média', 'Alta'];

    // validações
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({ error: 'Título é obrigatório.' });
    }
    if (!data) return res.status(400).json({ error: 'Data é obrigatória.' });
    if (!categoria || !categorias.includes(categoria)) return res.status(400).json({ error: 'Categoria inválida.' });
    if (!prioridade || !prioridades.includes(prioridade)) return res.status(400).json({ error: 'Prioridade inválida.' });

    const tarefas = await readDB();
    const nextId = tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 1;
    const tarefa = {
      id: nextId,
      titulo: titulo.trim(),
      descricao: descricao || '',
      data,
      horario: horario || '',
      categoria,
      prioridade,
      concluida: false
    };
    tarefas.push(tarefa);
    await writeDB(tarefas);
    res.status(201).json(tarefa);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar tarefa.' });
  }
});

app.put('/tarefas/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefas = await readDB();
    const idx = tarefas.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    tarefas[idx].concluida = true;
    await writeDB(tarefas);
    res.json(tarefas[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
});

app.delete('/tarefas/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    let tarefas = await readDB();
    const exists = tarefas.some(t => t.id === id);
    if (!exists) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    tarefas = tarefas.filter(t => t.id !== id);
    await writeDB(tarefas);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
});

app.listen(PORT, () => console.log(`Servidor tarefas rodando em http://localhost:${PORT}`));
