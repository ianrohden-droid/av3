async function fetchProdutos() {
  try {
    const res = await fetch('/produtos');
    const produtos = await res.json();
    renderProdutos(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos', err);
  }
}

function renderProdutos(produtos) {
  const tbody = document.getElementById('produtosBody');
  tbody.innerHTML = '';
  produtos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nome}</td>
      <td>${formatPreco(p.preco)}</td>
      <td>${p.quantidade}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatPreco(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.getElementById('formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const preco = document.getElementById('preco').value;
  const quantidade = document.getElementById('quantidade').value;

  const produto = { nome, preco: Number(preco), quantidade: Number(quantidade) };

  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Erro ao cadastrar');
      return;
    }
    // Limpa campos
    document.getElementById('nome').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('quantidade').value = '';
    // Atualiza tabela
    fetchProdutos();
  } catch (err) {
    console.error('Erro ao enviar produto', err);
  }
});

// Carrega os produtos ao abrir a página
window.addEventListener('DOMContentLoaded', fetchProdutos);
