/* =================(VARIÁVEIS GLOBAIS)================= */
const tabelaBody = document.querySelector('#tabela tbody');
const addBtn = document.querySelector('#addBtn');
const editarBtn = document.querySelector('#editarBtn');
const form = document.querySelector('#expense-form');
let gastoSelecionado = null;

/* =================(ELEMENTOS DO FORMULÁRIO)================= */
const formFields = {
  data: () => document.querySelector('#data'),
  descricao: () => document.querySelector('#descricao'),
  valor: () => document.querySelector('#valor'),
  categoria: () => document.querySelector('#categoria'),
  pessoa: () => document.querySelector('#pessoa')
};

/* =================(CARREGAR GASTOS)================= */
// Busca e exibe todos os gastos na tabela
async function carregarGastos() {
  const gastos = await window.api.getGastos();
  tabelaBody.innerHTML = '';

  gastos.forEach(gasto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${gasto.data}</td>
      <td>${gasto.descricao}</td>
      <td>R$ ${gasto.valor.toFixed(2)}</td>
      <td>${gasto.categoria || ''}</td>
      <td>${gasto.pessoa || ''}</td>
    `;

    // Adiciona evento de seleção à linha
    tr.addEventListener('click', () => selecionarGasto(tr, gasto));
    tabelaBody.appendChild(tr);
  });
}

/* =================(SELECIONAR GASTO)================= */
// Gerencia a seleção de itens na tabela
function selecionarGasto(linha, gasto) {
  document.querySelectorAll('#tabela tr').forEach(row => row.classList.remove('selecionado'));
  linha.classList.add('selecionado');
  gastoSelecionado = gasto;
  editarBtn.disabled = false;
}

/* =================(EDITAR GASTO)================= */
// Preenche formulário com dados do gasto selecionado para edição
function editarGasto() {
  if (!gastoSelecionado) return;

  Object.keys(formFields).forEach(campo => {
    formFields[campo]().value = gastoSelecionado[campo] || '';
  });

  addBtn.textContent = 'Salvar Edição';
  addBtn.dataset.editId = gastoSelecionado.id;
}

/* =================(OBTER DADOS DO FORMULÁRIO)================= */
// Coleta e formata os dados do formulário
function obterDadosFormulario() {
  return {
    data: formFields.data().value,
    descricao: formFields.descricao().value,
    valor: parseFloat(formFields.valor().value),
    categoria: formFields.categoria().value,
    pessoa: formFields.pessoa().value
  };
}

/* =================(ADICIONAR/EDITAR GASTO)================= */
// Gerencia criação e atualização de gastos
async function salvarGasto() {
  const gasto = obterDadosFormulario();

  if (addBtn.dataset.editId) {
    gasto.id = addBtn.dataset.editId;
    await window.api.updateGasto(gasto);
    resetarFormulario();
  } else {
    await window.api.addGasto(gasto);
  }

  limparSelecao();
  carregarGastos();
}

/* =================(LIMPAR SELEÇÃO)================= */
// Remove seleção atual e reseta estado
function limparSelecao() {
  gastoSelecionado = null;
  editarBtn.disabled = true;
  document.querySelectorAll('#tabela tr').forEach(row => row.classList.remove('selecionado'));
}

/* =================(RESETAR FORMULÁRIO)================= */
// Restaura formulário e botão ao estado original
function resetarFormulario() {
  form.reset();
  addBtn.textContent = 'Adicionar';
  delete addBtn.dataset.editId;
}

/* =================(EVENT LISTENERS)================= */
// Configura eventos da interface
editarBtn.addEventListener('click', editarGasto);
addBtn.addEventListener('click', salvarGasto);

/* =================(INICIALIZAÇÃO)================= */
// Carrega dados ao iniciar a aplicação
carregarGastos();