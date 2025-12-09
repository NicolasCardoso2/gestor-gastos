/* =================(CONSTANTES E VARIÁVEIS GLOBAIS)================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);
const byId = (id) => document.getElementById(id);

const elements = {
  boletosTableBody: $('#boletos-table tbody'),
  boletosTotal: byId('boletos-total'),
  calendarScreen: byId('calendar-screen'),
  detailsScreen: byId('details-screen'),
  calendar: byId('calendar'),
  selectedDateEl: byId('selected-date'),
  backBtn: byId('back-btn'),
  form: byId('expense-form'),
  expenseList: byId('expense-list'),
  prevMonthBtn: byId('prev-month'),
  nextMonthBtn: byId('next-month'),
  calendarTitle: byId('calendar-title'),
  boletosModal: byId('boletos-modal'),
  closeModalBtn: byId('close-modal'),
  modalDate: byId('modal-date'),
  modalBoletosList: byId('modal-boletos-list'),
  addBoletoBtn: byId('add-boleto-btn'),
  editarBoletoBtn: byId('editar-boleto-btn'),
  deletarBoletoBtn: byId('deletar-boleto-btn'),
  addBoletoForm: byId('add-boleto-form'),
  modalBoletoType: byId('modal-boleto-type'),
  modalBoletoNome: byId('modal-boleto-nome'),
  modalBoletoValor: byId('modal-boleto-valor'),
  modalBoletoObs: byId('modal-boleto-obs'),
  modalBoletoRepeticao: byId('modal-boleto-repeticao'),
  modalBoletoMesesRow: byId('row-boleto-meses'),
  modalBoletoMeses: byId('modal-boleto-meses'),
  modalBoletoMesesPreview: byId('modal-boleto-meses-preview'),
  cancelEditBtn: byId('cancel-edit-btn'),
  btnToday: byId('btn-today'),

  // Elementos do relatório
  navCalendar: byId('nav-calendar'),
  navReport: byId('nav-report'),
  reportScreen: byId('report-screen'),
  reportMonth: byId('report-month'),
  reportYear: byId('report-year'),
  totalMonth: byId('total-month'),
  averageDaily: byId('average-daily'),
  maxDaily: byId('max-daily'),
  monthlyTable: $('#monthly-table tbody'),
  categoryChart: byId('category-chart'),
  chartLegend: byId('chart-legend'),

  // Elementos do relatório anual
  annualReportBtn: byId('annual-report-btn'),
  annualReportModal: byId('annual-report-modal'),
  closeAnnualModalBtn: byId('close-annual-modal'),
  highestMonth: byId('highest-month'),
  highestMonthValue: byId('highest-month-value'),
  yearTotal: byId('year-total'),
  annualYear: byId('annual-year'),

  // Elementos de configurações
  settingsBtn: byId('settings-btn'),
  restartBtn: byId('restart-btn'),
  settingsModal: byId('settings-modal'),
  closeSettingsModalBtn: byId('close-settings-modal'),
  createBackupBtn: byId('create-backup-btn'),
  importDataBtn: byId('import-data-btn'),
  exportDataBtn: byId('export-data-btn')
};

const config = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  dateFormat: 'MM/DD/YYYY'
};

const now = new Date();
let state = {
  selectedDate: null,
  selectedBoletoIndex: null,
  isEditing: false,
  currentMonth: now.getMonth(),
  currentYear: now.getFullYear(),
  expenses: JSON.parse(localStorage.getItem('expenses')) || {}
};

/* =================(UTILITÁRIOS)================= */
const utils = {
  formatDate: (date = new Date()) => {
    const pad2 = (n) => String(n).padStart(2, '0');
    return `${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}/${date.getFullYear()}`;
  },

  parseDate: (dateStr) => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return { month: month - 1, day, year };
  },

  normalizeString: (str) => (str ?? '').toString().trim().toLowerCase(),

  formatCurrency: (value) => `R$ ${parseFloat(value || 0).toFixed(2)}`,

  getDaysInMonth: (month, year) => new Date(year, month + 1, 0).getDate()
};

/* =================(GERENCIAMENTO DE ESTADO)================= */
const stateManager = {
  saveExpenses: () => localStorage.setItem('expenses', JSON.stringify(state.expenses)),

  updateExpenses: (date, newExpenses) => {
    if (!newExpenses.length) delete state.expenses[date];
    else state.expenses[date] = newExpenses;
    stateManager.saveExpenses();
  },

  addExpense: (date, expense) => {
    (state.expenses[date] ||= []).push(expense);
    stateManager.saveExpenses();
  },

  removeExpense: (date, index) => {
    const arr = state.expenses[date];
    if (!arr) return;
    arr.splice(index, 1);
    stateManager.updateExpenses(date, arr);
  }
};

/* =================(GERENCIAMENTO DO CALENDÁRIO)================= */
const calendarManager = {
  createCalendar: () => {
    const { currentMonth, currentYear } = state;
    const daysInMonth = utils.getDaysInMonth(currentMonth, currentYear);

    elements.calendar.innerHTML = '';
    elements.calendarTitle.textContent = `${config.monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const frag = document.createDocumentFragment();

    for (let i = 0; i < startOffset; i++) frag.appendChild(calendarManager.createDayElement('empty'));
    for (let day = 1; day <= daysInMonth; day++) frag.appendChild(calendarManager.createDayElement('normal', day));

    elements.calendar.appendChild(frag);
  },

  createDayElement: (type, day = null) => {
    const dayEl = document.createElement('div');
    dayEl.className = `day ${type}`;

    if (type !== 'normal') return dayEl;

    const dateStr = utils.formatDate(new Date(state.currentYear, state.currentMonth, day));
    dayEl.textContent = day;
    dayEl.addEventListener('click', () => modalManager.openDetails(day));

    // Otimizar hover para evitar flicker - só atualizar se data for diferente
    let lastHoveredDate = null;

    dayEl.addEventListener('mouseenter', () => {
      if (lastHoveredDate !== dateStr) {
        tableManager.updateBoletosTable(dateStr);
        lastHoveredDate = dateStr;
      }
    });

    dayEl.addEventListener('mouseleave', () => {
      setTimeout(() => {
        const currentDate = utils.formatDate();
        if (lastHoveredDate !== currentDate) {
          tableManager.updateBoletosTable();
          lastHoveredDate = currentDate;
        }
      }, 100);
    });

    if (dateStr === utils.formatDate()) dayEl.classList.add('today');

    const count = state.expenses[dateStr]?.length || 0;
    if (count > 0) {
      dayEl.classList.add('has-boletos');
      dayEl.title = `${count} boleto(s) cadastrado(s)`;
    }

    return dayEl;
  },

  navigateMonth: (direction) => {
    state.currentMonth += direction;

    if (state.currentMonth < 0) {
      state.currentMonth = 11;
      state.currentYear--;
    } else if (state.currentMonth > 11) {
      state.currentMonth = 0;
      state.currentYear++;
    }

    calendarManager.createCalendar();
  }
};

/* =================(GERENCIAMENTO DE TABELAS)================= */
const tableManager = {
  updateBoletosTable: (dateStr = null) => {
    const targetDate = dateStr || utils.formatDate();
    const expenses = state.expenses[targetDate] || [];
    let total = 0;

    elements.boletosTableBody.innerHTML = '';
    tableManager.updateDateIndicator(targetDate);

    if (!expenses.length) {
      elements.boletosTableBody.innerHTML = '<tr><td colspan="2">Nenhum boleto</td></tr>';
      elements.boletosTotal.textContent = utils.formatCurrency(0);
      return;
    }

    const frag = document.createDocumentFragment();
    for (const item of expenses) {
      total += parseFloat(item.valor || 0);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${item.nome || ''}</td><td>${utils.formatCurrency(item.valor)}</td>`;
      frag.appendChild(tr);
    }
    elements.boletosTableBody.appendChild(frag);
    elements.boletosTotal.textContent = utils.formatCurrency(total);
  },

  updateDateIndicator: (dateStr) => {
    const indicator = byId('current-date-indicator');
    if (!indicator) return;

    const [month, day, year] = dateStr.split('/');
    indicator.textContent = `${day}/${month}/${year}`;
    Object.assign(indicator.style, {
      fontSize: '0.9rem',
      color: '#666',
      textAlign: 'center',
      marginBottom: '8px'
    });
  }
};

/* =================(GERENCIAMENTO DO MODAL)================= */
const modalManager = {
  openDetails: (day) => {
    state.selectedDate = utils.formatDate(new Date(state.currentYear, state.currentMonth, day));
    modalManager.showBoletosModal(state.selectedDate, day);
  },

  showBoletosModal: (dateStr, day) => {
    state.selectedDate = dateStr;
    elements.modalDate.textContent = `Dia ${day} de ${config.monthNames[state.currentMonth]} de ${state.currentYear}`;
    modalManager.updateBoletosList(dateStr);
    elements.boletosModal.style.display = 'flex';
    if (elements.addBoletoForm) elements.addBoletoForm.style.display = 'none';
    formManager.resetFormState();
  },

  updateBoletosList: (dateStr) => {
    const list = state.expenses[dateStr] || [];
    elements.modalBoletosList.innerHTML = '';

    if (!list.length) {
      elements.modalBoletosList.innerHTML = '<li>Nenhum boleto cadastrado.</li>';
      elements.editarBoletoBtn.disabled = elements.deletarBoletoBtn.disabled = true;
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach((item, idx) => frag.appendChild(modalManager.createBoletoListItem(item, idx)));
    elements.modalBoletosList.appendChild(frag);
  },

  createBoletoListItem: (item, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;

    const extraInfo = [];
    if (item.obs) extraInfo.push(item.obs);
    if (item.repeticao && item.repeticao !== 'unica') {
      extraInfo.push(item.repeticao === 'mensal' && item.meses ? `(${item.meses} meses)` : `(${item.repeticao})`);
    }

    li.innerHTML = `
            <strong>${item.tipo || ''}</strong>${item.nome || ''} 
            <span>${utils.formatCurrency(item.valor)}</span>
            ${extraInfo.length ? `<small>${extraInfo.join(' • ')}</small>` : ''}
        `;

    li.addEventListener('click', () => modalManager.selectBoleto(li, index));
    return li;
  },

  selectBoleto: (element, index) => {
    [...$$('#modal-boletos-list li')].forEach((item) => item.classList.remove('selecionado'));
    element.classList.add('selecionado');
    state.selectedBoletoIndex = index;
    elements.editarBoletoBtn.disabled = elements.deletarBoletoBtn.disabled = false;
  },

  closeModal: () => {
    elements.boletosModal.style.display = 'none';
    formManager.resetFormState();
  }
};

/* =================(GERENCIAMENTO DE FORMULÁRIOS)================= */
const formManager = {
  resetFormState: () => {
    state.isEditing = false;
    state.selectedBoletoIndex = null;

    elements.addBoletoBtn.textContent = 'Adicionar';
    elements.editarBoletoBtn.disabled = elements.deletarBoletoBtn.disabled = true;

    if (elements.cancelEditBtn) elements.cancelEditBtn.style.display = 'none';

    if (elements.addBoletoForm) {
      elements.addBoletoForm.reset();
      elements.addBoletoForm.style.display = 'none';
    }

    [...$$('#modal-boletos-list li')].forEach((item) => item.classList.remove('selecionado'));
  },

  openEditBoleto: () => {
    const { selectedBoletoIndex, selectedDate } = state;
    const list = state.expenses[selectedDate];
    if (selectedBoletoIndex === null || !list) return;

    const boleto = list[selectedBoletoIndex];
    state.isEditing = true;

    elements.modalBoletoType.value = boleto.tipo || '';
    elements.modalBoletoNome.value = boleto.nome || '';
    elements.modalBoletoValor.value = boleto.valor || '';
    elements.modalBoletoObs.value = boleto.obs || '';
    elements.modalBoletoRepeticao.value = boleto.repeticao || 'unica';

    formManager.toggleMesesField(boleto.repeticao === 'mensal', boleto.meses);

    if (elements.addBoletoForm) elements.addBoletoForm.style.display = 'block';
    if (elements.cancelEditBtn) elements.cancelEditBtn.style.display = 'inline-block';
  },

  toggleMesesField: (show, meses = '') => {
    elements.modalBoletoMesesRow.style.display = show ? '' : 'none';
    if (!show) return;

    elements.modalBoletoMeses.value = meses;
    if (elements.modalBoletoMesesPreview) {
      elements.modalBoletoMesesPreview.textContent = meses ? `(${meses} meses)` : '';
    }
  },

  handleFormSubmit: (e) => {
    e.preventDefault();

    const repeticao = elements.modalBoletoRepeticao.value;
    const formData = {
      tipo: elements.modalBoletoType.value.trim(),
      nome: elements.modalBoletoNome.value.trim(),
      valor: parseFloat(elements.modalBoletoValor.value),
      obs: elements.modalBoletoObs.value.trim(),
      repeticao,
      meses: repeticao === 'mensal' ? parseInt(elements.modalBoletoMeses.value || '0', 10) : 0
    };

    if (!formManager.validateForm(formData)) return;

    if (state.isEditing && state.selectedBoletoIndex !== null) {
      state.expenses[state.selectedDate][state.selectedBoletoIndex] = formData;
    } else {
      stateManager.addExpense(state.selectedDate, formData);
      if (formData.repeticao === 'mensal') repetitionManager.criarBoletosMensais(state.selectedDate, formData);
    }

    formManager.finalizeFormSubmission();
  },

  validateForm: ({ tipo, nome, valor, repeticao, meses }) => {
    if (!tipo || !nome || isNaN(valor) || valor <= 0) {
      alert('Preencha todos os campos obrigatórios corretamente!');
      return false;
    }
    if (repeticao === 'mensal' && (!meses || meses < 1)) {
      alert('Informe a quantidade de meses para repetir.');
      return false;
    }
    return true;
  },

  finalizeFormSubmission: () => {
    elements.addBoletoForm.reset();
    elements.addBoletoForm.style.display = 'none';
    stateManager.saveExpenses();
    modalManager.updateBoletosList(state.selectedDate);
    tableManager.updateBoletosTable(state.selectedDate);
    calendarManager.createCalendar();
    formManager.resetFormState();
  },

  deletarBoleto: () => {
    const { selectedBoletoIndex, selectedDate } = state;
    const list = state.expenses[selectedDate];
    if (selectedBoletoIndex === null || !list) return;

    const boleto = list[selectedBoletoIndex];

    if (confirm('Tem certeza que deseja deletar este boleto?')) {
      repetitionManager.deletarBoletosRepetidos(boleto);
      stateManager.removeExpense(selectedDate, selectedBoletoIndex);

      modalManager.updateBoletosList(selectedDate);
      tableManager.updateBoletosTable(selectedDate);
      calendarManager.createCalendar();

      formManager.resetFormState();
    }
  }
};

/* =================(GERENCIAMENTO DE REPETIÇÃO)================= */
const repetitionManager = {
  criarBoletosMensais: (dataInicial, boleto) => {
    const { month, day, year } = utils.parseDate(dataInicial);
    let mes = month + 1;
    let ano = year;
    const totalMeses = Math.max(1, boleto.meses);

    for (let i = 1; i <= totalMeses; i++) {
      mes = mes > 12 ? 1 : mes + 1;
      ano = mes === 1 ? ano + 1 : ano;

      const novaData = utils.formatDate(new Date(ano, mes - 1, day));
      if (!state.expenses[novaData]) state.expenses[novaData] = [];

      const existeBoleto = state.expenses[novaData].some(
        (b) =>
          utils.normalizeString(b.tipo) === utils.normalizeString(boleto.tipo) &&
          utils.normalizeString(b.nome) === utils.normalizeString(boleto.nome) &&
          Number(b.valor) === Number(boleto.valor)
      );

      if (!existeBoleto) state.expenses[novaData].push({ ...boleto, meses: totalMeses });
    }

    stateManager.saveExpenses();
  },

  deletarBoletosRepetidos: (boletoOriginal) => {
    Object.keys(state.expenses).forEach((dateStr) => {
      state.expenses[dateStr] = state.expenses[dateStr].filter(
        (boleto) => !repetitionManager.isSameBoleto(boleto, boletoOriginal)
      );
      stateManager.updateExpenses(dateStr, state.expenses[dateStr]);
    });
  },

  isSameBoleto: (boleto1, boleto2) =>
    utils.normalizeString(boleto1.tipo) === utils.normalizeString(boleto2.tipo) &&
    utils.normalizeString(boleto1.nome) === utils.normalizeString(boleto2.nome) &&
    Number(boleto1.valor) === Number(boleto2.valor) &&
    utils.normalizeString(boleto1.obs) === utils.normalizeString(boleto2.obs) &&
    utils.normalizeString(boleto1.repeticao || 'unica') === utils.normalizeString(boleto2.repeticao || 'unica')
};

/* =================(GERENCIAMENTO DO RELATÓRIO MENSAL)================= */
const reportManager = {
  currentChart: null,

  initializeReport: () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2025;

    elements.reportYear.innerHTML = '';
    for (let year = startYear; year <= currentYear + 8; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === currentYear) option.selected = true;
      elements.reportYear.appendChild(option);
    }

    elements.reportMonth.value = String(new Date().getMonth());
    reportManager.updateReport();
  },

  updateReport: () => {
    const selectedMonth = parseInt(elements.reportMonth.value);
    const selectedYear = parseInt(elements.reportYear.value);

    const monthlyData = reportManager.aggregateMonthlyData(selectedMonth, selectedYear);
    reportManager.updateTable(monthlyData);
    reportManager.updateSummary(monthlyData);
    reportManager.updateChart(monthlyData);
  },

  aggregateMonthlyData: (month, year) => {
    const daysInMonth = utils.getDaysInMonth(month, year);
    const dailyTotals = [];
    const categoryTotals = {};
    let totalMonth = 0;
    let maxDaily = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = utils.formatDate(new Date(year, month, day));
      const dayExpenses = state.expenses[dateStr] || [];

      let dayTotal = 0;
      for (const expense of dayExpenses) {
        const value = parseFloat(expense.valor || 0);
        dayTotal += value;

        const category = expense.tipo || 'Outros';
        categoryTotals[category] = (categoryTotals[category] || 0) + value;
      }

      dailyTotals.push({ day, total: dayTotal });
      totalMonth += dayTotal;
      if (dayTotal > maxDaily) maxDaily = dayTotal;
    }

    return {
      dailyTotals,
      categoryTotals,
      totalMonth,
      maxDaily,
      averageDaily: totalMonth / daysInMonth
    };
  },

  updateTable: ({ dailyTotals }) => {
    elements.monthlyTable.innerHTML = '';
    const frag = document.createDocumentFragment();

    dailyTotals.forEach(({ day, total }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
                <td>${String(day).padStart(2, '0')}</td>
                <td>${utils.formatCurrency(total)}</td>
            `;
      if (total > 0) tr.style.backgroundColor = '#f8f9ff';
      frag.appendChild(tr);
    });

    elements.monthlyTable.appendChild(frag);
  },

  updateSummary: (data) => {
    elements.totalMonth.textContent = utils.formatCurrency(data.totalMonth);
    elements.averageDaily.textContent = utils.formatCurrency(data.averageDaily);
    elements.maxDaily.textContent = utils.formatCurrency(data.maxDaily);
  },

  updateChart: (data) => {
    if (reportManager.currentChart) reportManager.currentChart.destroy();

    const categories = Object.keys(data.categoryTotals);
    const values = Object.values(data.categoryTotals);

    if (!categories.length) {
      elements.chartLegend.innerHTML = '<p>Nenhum dado para o período selecionado</p>';
      return;
    }

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];

    const ctx = elements.categoryChart.getContext('2d');
    reportManager.currentChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, categories.length),
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    reportManager.createLegend(categories, values, colors, data.totalMonth);
  },

  createLegend: (categories, values, colors, totalMonth) => {
    elements.chartLegend.innerHTML = '';

    categories.forEach((category, index) => {
      const percentage = ((values[index] / totalMonth) * 100).toFixed(1);

      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${colors[index]}"></div>
                <span>${category}: ${utils.formatCurrency(values[index])} (${percentage}%)</span>
            `;
      elements.chartLegend.appendChild(legendItem);
    });
  }
};

/* =================(GERENCIAMENTO DE NAVEGAÇÃO)================= */
const navigationManager = {
  switchToCalendar: () => {
    elements.navCalendar.classList.add('active');
    elements.navReport.classList.remove('active');
    elements.calendarScreen.classList.add('active');
    elements.reportScreen.classList.remove('active');
  },

  switchToReport: () => {
    elements.navReport.classList.add('active');
    elements.navCalendar.classList.remove('active');
    elements.reportScreen.classList.add('active');
    elements.calendarScreen.classList.remove('active');
    reportManager.updateReport();
  }
};

/* =================(GERENCIAMENTO DE RELATÓRIO ANUAL)================= */
const annualReportManager = {
  currentHighestMonth: 0,
  currentHighestYear: new Date().getFullYear(),
  hasValidData: false,

  openModal: () => {
    elements.annualReportModal.style.display = 'block';
    annualReportManager.updateAnnualReport();
  },

  closeModal: () => {
    elements.annualReportModal.style.display = 'none';
  },

  navigateToMonth: () => {
    if (!annualReportManager.hasValidData) {
      console.log('Não há dados válidos para navegar');
      return;
    }

    annualReportManager.closeModal();

    state.currentMonth = annualReportManager.currentHighestMonth;
    state.currentYear = annualReportManager.currentHighestYear;

    console.log(`Navegando para: ${config.monthNames[state.currentMonth]} ${state.currentYear}`);

    navigationManager.switchToCalendar();

    calendarManager.updateCalendarDisplay();
    calendarManager.loadCalendarData();
  },

  initializeAnnualReport: () => {
    annualReportManager.populateYearSelector();
  },

  populateYearSelector: () => {
    const currentYear = new Date().getFullYear();
    elements.annualYear.innerHTML = '';

    for (let year = 2020; year <= currentYear + 1; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === currentYear) option.selected = true;
      elements.annualYear.appendChild(option);
    }
  },

  updateAnnualReport: async () => {
    console.log('=== INICIANDO RELATÓRIO ANUAL ===');
    const selectedYear = parseInt(elements.annualYear.value);
    console.log('DEBUG: Ano selecionado:', selectedYear);
    console.log('DEBUG: Data atual:', new Date().toISOString());

    const parseFlexibleDate = (dataStr) => {
      const s = String(dataStr ?? '');
      if (s.includes('-')) return new Date(s);
      if (s.includes('/')) {
        const parts = s.split('/');
        if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
      }
      return new Date(s);
    };

    try {
      const boletos = await window.api.boletos.get();
      console.log(`DEBUG: Encontrados ${boletos.length} boletos na base de dados`);

      let gastos = [];
      try {
        if (window.api.gastos && window.api.gastos.get) {
          gastos = await window.api.gastos.get();
          console.log(`DEBUG: Encontrados ${gastos.length} gastos na base de dados`);
        } else {
          console.log('DEBUG: API de gastos não disponível - usando apenas boletos');
        }
      } catch (gastoError) {
        console.log('DEBUG: Erro ao buscar gastos:', gastoError);
      }

      const yearBoletos = [];
      boletos.forEach((boleto) => {
        console.log('Processando boleto:', boleto);
        try {
          const boletoDate = parseFlexibleDate(boleto.data);
          const boletoYear = boletoDate.getFullYear();

          console.log(`Boleto: ${boleto.nome}, Data: ${boleto.data}, Ano: ${boletoYear}, Valor: ${boleto.valor}`);

          if (!isNaN(boletoYear) && boletoYear === selectedYear) yearBoletos.push(boleto);
        } catch (error) {
          console.error('Erro ao processar boleto:', boleto, error);
        }
      });

      const yearGastos = [];
      if (gastos && gastos.length > 0) {
        gastos.forEach((gasto) => {
          try {
            const gastoDate = parseFlexibleDate(gasto.data);
            const gastoYear = gastoDate.getFullYear();
            if (!isNaN(gastoYear) && gastoYear === selectedYear) yearGastos.push(gasto);
          } catch (error) {
            console.error('Erro ao processar gasto:', gasto, error);
          }
        });
      }

      console.log('Boletos filtrados do ano:', yearBoletos.length, yearBoletos);
      console.log('Gastos filtrados do ano:', yearGastos.length, yearGastos);

      const monthlyTotals = {};
      const monthNames = config.monthNames;

      for (let i = 0; i < 12; i++) monthlyTotals[i] = 0;

      yearBoletos.forEach((boleto) => {
        try {
          const boletoDate = parseFlexibleDate(boleto.data);
          const month = boletoDate.getMonth();
          const valor = parseFloat(boleto.valor) || 0;

          console.log(`Adicionando boleto ${boleto.nome}: R$ ${valor} ao mês ${month} (${monthNames[month]})`);

          if (!isNaN(month) && month >= 0 && month <= 11 && valor > 0) monthlyTotals[month] += valor;
        } catch (error) {
          console.error('Erro ao processar boleto para somatória:', boleto, error);
        }
      });

      yearGastos.forEach((gasto) => {
        try {
          const gastoDate = parseFlexibleDate(gasto.data);
          const month = gastoDate.getMonth();
          const valor = parseFloat(gasto.valor) || 0;

          console.log(
            `Adicionando gasto ${gasto.descricao || 'Sem descrição'}: R$ ${valor} ao mês ${month} (${monthNames[month]})`
          );

          if (!isNaN(month) && month >= 0 && month <= 11 && valor > 0) monthlyTotals[month] += valor;
        } catch (error) {
          console.error('Erro ao processar gasto para somatória:', gasto, error);
        }
      });

      console.log('DEBUG: Totais por mês:', monthlyTotals);

      const mesesComValor = Object.entries(monthlyTotals).filter(([, valor]) => valor > 0);
      console.log(
        `DEBUG: ${mesesComValor.length} meses com valores > 0:`,
        mesesComValor.map(([mes, valor]) => `${monthNames[mes]}: R$ ${valor.toFixed(2)}`)
      );

      let highestMonth = 0;
      let highestValue = 0;
      let yearTotal = 0;

      Object.entries(monthlyTotals).forEach(([month, value]) => {
        yearTotal += value;
        if (value > highestValue) {
          highestValue = value;
          highestMonth = parseInt(month);
        }
      });

      console.log('Mês com maior gasto:', highestMonth, monthNames[highestMonth], 'Valor:', highestValue);
      console.log('Total do ano:', yearTotal);

      annualReportManager.currentHighestMonth = highestMonth;
      annualReportManager.currentHighestYear = selectedYear;

      console.log(`RESULTADO: ${yearBoletos.length + yearGastos.length} registros processados para ${selectedYear}`);
      console.log(
        `RESULTADO: Mês com mais gastos - ${monthNames[highestMonth]}: R$ ${highestValue.toFixed(2)}`
      );
      console.log(`RESULTADO: Total do ano ${selectedYear}: R$ ${yearTotal.toFixed(2)}`);

      if (yearTotal > 0) {
        annualReportManager.hasValidData = true;
        elements.highestMonth.textContent = monthNames[highestMonth];
        elements.highestMonth.style.cursor = 'pointer';
        elements.highestMonth.style.textDecoration = 'underline';
        elements.highestMonth.title = 'Clique para ir ao calendário deste mês';
        elements.highestMonthValue.textContent = `R$ ${highestValue.toFixed(2).replace('.', ',')}`;
        elements.yearTotal.textContent = `R$ ${yearTotal.toFixed(2).replace('.', ',')}`;
      } else {
        annualReportManager.hasValidData = false;
        elements.highestMonth.textContent = 'Nenhum dado';
        elements.highestMonth.style.cursor = 'default';
        elements.highestMonth.style.textDecoration = 'none';
        elements.highestMonth.title = 'Não há dados para exibir';
        elements.highestMonthValue.textContent = 'R$ 0,00';
        elements.yearTotal.textContent = 'R$ 0,00';
      }
    } catch (error) {
      console.error('Erro ao carregar relatório anual:', error);
      elements.highestMonth.textContent = 'Erro ao carregar';
      elements.highestMonthValue.textContent = 'R$ 0,00';
      elements.yearTotal.textContent = 'R$ 0,00';
      elements.monthlyAverage.textContent = 'R$ 0,00';
    }
  }
};

/* =================(GERENCIAMENTO DE CONFIGURAÇÕES)================= */
const settingsManager = {
  openModal: () => {
    elements.settingsModal.style.display = 'block';
  },

  closeModal: () => {
    elements.settingsModal.style.display = 'none';
  },

  showToast: (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#e74c3c'};
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);

    if (!byId('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }
  },

  createBackup: async () => {
    try {
      elements.createBackupBtn.disabled = true;
      elements.createBackupBtn.textContent = 'Criando...';

      const result = await window.api.backup.create();

      if (result.success) settingsManager.showToast('Backup criado com sucesso!');
      else settingsManager.showToast('Erro ao criar backup', 'error');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      settingsManager.showToast('Erro inesperado ao criar backup', 'error');
    } finally {
      elements.createBackupBtn.disabled = false;
      elements.createBackupBtn.textContent = 'Criar Backup';
    }
  },

  importData: async () => {
    try {
      elements.importDataBtn.disabled = true;
      elements.importDataBtn.textContent = 'Importando...';

      const result = await window.api.backup.import();

      if (result.success) {
        settingsManager.showToast('Dados importados com sucesso!');
        settingsManager.closeModal();

        setTimeout(() => {
          tableManager.updateBoletosTable();
          calendarManager.loadCalendarData();
          reportManager.updateReport();
        }, 500);
      } else if (!result.cancelled) {
        settingsManager.showToast('Erro ao importar dados', 'error');
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      settingsManager.showToast('Erro inesperado ao importar dados', 'error');
    } finally {
      elements.importDataBtn.disabled = false;
      elements.importDataBtn.textContent = 'Importar Dados';
    }
  },

  exportData: async () => {
    try {
      elements.exportDataBtn.disabled = true;
      elements.exportDataBtn.textContent = 'Exportando...';

      const result = await window.api.backup.export();

      if (result.success) settingsManager.showToast('Dados exportados com sucesso!');
      else if (!result.cancelled) settingsManager.showToast('Erro ao exportar dados', 'error');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      settingsManager.showToast('Erro inesperado ao exportar dados', 'error');
    } finally {
      elements.exportDataBtn.disabled = false;
      elements.exportDataBtn.textContent = 'Exportar Dados';
    }
  },

  restartPage: () => {
    if (confirm('Tem certeza que deseja recarregar a página?\n\nTodos os dados são salvos automaticamente.')) {
      settingsManager.showToast('Recarregando página...', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  }
};

/* =================(INICIALIZAÇÃO E EVENT LISTENERS)================= */
const init = {
  setupEventListeners: () => {
    elements.backBtn.addEventListener('click', () => {
      elements.detailsScreen.classList.remove('active');
      elements.calendarScreen.classList.add('active');
    });

    elements.prevMonthBtn.addEventListener('click', () => calendarManager.navigateMonth(-1));
    elements.nextMonthBtn.addEventListener('click', () => calendarManager.navigateMonth(1));

    elements.closeModalBtn.addEventListener('click', modalManager.closeModal);

    elements.addBoletoBtn.addEventListener('click', () => {
      formManager.resetFormState();

      elements.addBoletoForm.style.display = 'block';
      elements.addBoletoForm.reset();

      if (elements.modalBoletoType) elements.modalBoletoType.value = '';
      if (elements.modalBoletoNome) elements.modalBoletoNome.value = '';
      if (elements.modalBoletoValor) elements.modalBoletoValor.value = '';
      if (elements.modalBoletoObs) elements.modalBoletoObs.value = '';

      if (elements.modalBoletoRepeticao) {
        elements.modalBoletoRepeticao.value = 'unica';
        formManager.toggleMesesField(false);
      }

      setTimeout(() => elements.modalBoletoType && elements.modalBoletoType.focus(), 50);
    });

    elements.editarBoletoBtn.addEventListener('click', formManager.openEditBoleto);
    elements.deletarBoletoBtn.addEventListener('click', formManager.deletarBoleto);
    elements.cancelEditBtn.addEventListener('click', formManager.resetFormState);
    elements.addBoletoForm.addEventListener('submit', formManager.handleFormSubmit);

    if (elements.modalBoletoRepeticao) {
      elements.modalBoletoRepeticao.addEventListener('change', () => {
        formManager.toggleMesesField(elements.modalBoletoRepeticao.value === 'mensal');
      });
    }

    if (elements.modalBoletoMeses) {
      elements.modalBoletoMeses.addEventListener('input', () => {
        if (!elements.modalBoletoMesesPreview) return;
        const n = parseInt(elements.modalBoletoMeses.value || '');
        elements.modalBoletoMesesPreview.textContent = n > 0 ? `(${n} meses)` : '';
      });
    }

    if (elements.btnToday) {
      elements.btnToday.addEventListener('click', () => {
        const today = new Date();
        state.currentMonth = today.getMonth();
        state.currentYear = today.getFullYear();

        calendar.updateCalendarDisplay();
        calendar.loadCalendarData();

        setTimeout(() => {
          const todayElement = document.querySelector(`[data-day="${today.getDate()}"]`);
          if (todayElement) {
            todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            todayElement.style.animation = 'highlight 1s ease-in-out';
          }
        }, 100);
      });
    }

    elements.navCalendar.addEventListener('click', navigationManager.switchToCalendar);
    elements.navReport.addEventListener('click', navigationManager.switchToReport);

    elements.reportMonth.addEventListener('change', reportManager.updateReport);
    elements.reportYear.addEventListener('change', reportManager.updateReport);

    elements.annualReportBtn.addEventListener('click', annualReportManager.openModal);
    elements.closeAnnualModalBtn.addEventListener('click', annualReportManager.closeModal);
    elements.annualYear.addEventListener('change', annualReportManager.updateAnnualReport);

    elements.highestMonth.addEventListener('click', (e) => {
      if (annualReportManager.hasValidData) annualReportManager.navigateToMonth();
      else {
        console.log('Clique ignorado - não há dados válidos');
        e.preventDefault();
      }
    });

    elements.annualReportModal.addEventListener('click', (e) => {
      if (e.target === elements.annualReportModal) annualReportManager.closeModal();
    });

    elements.settingsBtn.addEventListener('click', settingsManager.openModal);
    elements.restartBtn.addEventListener('click', settingsManager.restartPage);
    elements.closeSettingsModalBtn.addEventListener('click', settingsManager.closeModal);
    elements.createBackupBtn.addEventListener('click', settingsManager.createBackup);
    elements.importDataBtn.addEventListener('click', settingsManager.importData);
    elements.exportDataBtn.addEventListener('click', settingsManager.exportData);

    elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === elements.settingsModal) settingsManager.closeModal();
    });
  },

  initialize: () => {
    calendarManager.createCalendar();
    tableManager.updateBoletosTable();
    reportManager.initializeReport();
    annualReportManager.initializeAnnualReport();
    init.setupEventListeners();
  }
};

document.addEventListener('DOMContentLoaded', init.initialize);
