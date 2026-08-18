async function fetchTarefas() {
  try {
    const res = await fetch('/tarefas');
    const tarefas = await res.json();
    window._tarefas = tarefas; // cache
    renderTarefas();
  } catch (err) {
    console.error('Erro ao buscar tarefas', err);
  }
}

function renderTarefas() {
  const list = document.getElementById('tarefasList');
  const filtroStatus = document.getElementById('filtroStatus').value;
  const filtroCategoria = document.getElementById('filtroCategoria').value;
  const tarefas = (window._tarefas || []).filter(t => {
    if (filtroStatus === 'Pendentes' && t.concluida) return false;
    if (filtroStatus === 'Concluídas' && !t.concluida) return false;
    if (filtroCategoria !== 'Todas' && filtroCategoria !== '' && t.categoria !== filtroCategoria) return false;
    return true;
  });

  list.innerHTML = '';
  tarefas.forEach(t => {
    const div = document.createElement('div');
    div.className = `tarefa prioridade-${t.prioridade}` + (t.concluida ? ' concluida' : '');
    div.innerHTML = `
      <div>
        <strong>${t.titulo}</strong>
        <div class="meta">${formatDate(t.data)} ${t.horario ? '- ' + t.horario : ''} &nbsp;|&nbsp; ${t.categoria} &nbsp;|&nbsp; ${t.prioridade}</div>
        <div class="meta">${t.descricao || ''}</div>
      </div>
      <div class="acoes">
        ${t.concluida ? '' : `<button data-id="${t.id}" class="concluir">Concluir</button>`}
        <button data-id="${t.id}" class="excluir">Excluir</button>
      </div>
    `;
    list.appendChild(div);
  });

  // attach handlers
  document.querySelectorAll('.concluir').forEach(b => b.addEventListener('click', concluirTarefa));
  document.querySelectorAll('.excluir').forEach(b => b.addEventListener('click', excluirTarefa));
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('pt-BR');
}

async function concluirTarefa(e) {
  const id = e.target.dataset.id;
  try {
    const res = await fetch(`/tarefas/${id}`, { method: 'PUT' });
    if (!res.ok) { const err = await res.json(); alert(err.error || 'Erro'); return; }
    fetchTarefas();
  } catch (err) { console.error(err); }
}

async function excluirTarefa(e) {
  const id = e.target.dataset.id;
  if (!confirm('Excluir esta tarefa?')) return;
  try {
    const res = await fetch(`/tarefas/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json(); alert(err.error || 'Erro'); return; }
    fetchTarefas();
  } catch (err) { console.error(err); }
}

document.getElementById('formTarefa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;
  const categoria = document.getElementById('categoria').value;
  const prioridade = document.getElementById('prioridade').value;

  const tarefa = { titulo, descricao, data, horario, categoria, prioridade };
  try {
    const res = await fetch('/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa)
    });
    if (!res.ok) { const err = await res.json(); alert(err.error || 'Erro ao adicionar'); return; }
    // limpar
    document.getElementById('formTarefa').reset();
    fetchTarefas();
  } catch (err) { console.error('Erro ao enviar', err); }
});

document.getElementById('filtroStatus').addEventListener('change', renderTarefas);
document.getElementById('filtroCategoria').addEventListener('change', renderTarefas);

window.addEventListener('DOMContentLoaded', fetchTarefas);
