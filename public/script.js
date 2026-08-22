async function fetchProdutos() {
  try {
    const res = await fetch('/produtos');
    if (!res.ok) throw new Error('Falha ao buscar produtos');
    renderProdutos(await res.json());
  } catch (err) {
    renderState('Nao foi possivel carregar os produtos.');
    showMessage('Verifique se o servidor esta em execucao.', 'error');
  }
}

function renderProdutos(produtos) {
  const tbody = document.getElementById('produtosBody');
  document.getElementById('productCount').textContent = produtos.length;
  tbody.innerHTML = '';
  if (produtos.length === 0) {
    renderState('Nenhum produto cadastrado ainda.');
    return;
  }

  produtos.forEach(produto => {
    const row = document.createElement('tr');
    [produto.id, produto.nome, formatPreco(produto.preco), produto.quantidade].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
}

function renderState(message) {
  const tbody = document.getElementById('produtosBody');
  tbody.innerHTML = '';
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 4;
  cell.className = 'table-state';
  cell.textContent = message;
  row.appendChild(cell);
  tbody.appendChild(row);
}

function formatPreco(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function showMessage(message, type = '') {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

document.getElementById('formProduto').addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = document.getElementById('submitButton');
  const produto = {
    nome: document.getElementById('nome').value,
    preco: Number(document.getElementById('preco').value),
    quantidade: Number(document.getElementById('quantidade').value)
  };

  submitButton.disabled = true;
  showMessage('Salvando produto...');
  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    if (!res.ok) {
      const error = await res.json();
      showMessage(error.error || 'Erro ao cadastrar.', 'error');
      return;
    }
    event.target.reset();
    showMessage('Produto cadastrado com sucesso.', 'success');
    await fetchProdutos();
  } catch (err) {
    showMessage('Nao foi possivel salvar o produto.', 'error');
  } finally {
    submitButton.disabled = false;
  }
});

window.addEventListener('DOMContentLoaded', fetchProdutos);
