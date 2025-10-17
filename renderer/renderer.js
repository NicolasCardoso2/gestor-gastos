/* =================(CONSTANTES E VARIÁVEIS GLOBAIS)================= */
const elements = {
    boletosTableBody: document.querySelector('#boletos-table tbody'),
    boletosTotal: document.getElementById('boletos-total'),
    calendarScreen: document.getElementById('calendar-screen'),
    detailsScreen: document.getElementById('details-screen'),
    calendar: document.getElementById('calendar'),
    selectedDateEl: document.getElementById('selected-date'),
    backBtn: document.getElementById('back-btn'),
    form: document.getElementById('expense-form'),
    expenseList: document.getElementById('expense-list'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month'),
    calendarTitle: document.getElementById('calendar-title'),
    boletosModal: document.getElementById('boletos-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    modalDate: document.getElementById('modal-date'),
    modalBoletosList: document.getElementById('modal-boletos-list'),
    addBoletoBtn: document.getElementById('add-boleto-btn'),
    editarBoletoBtn: document.getElementById('editar-boleto-btn'),
    deletarBoletoBtn: document.getElementById('deletar-boleto-btn'),
    addBoletoForm: document.getElementById('add-boleto-form'),
    modalBoletoType: document.getElementById('modal-boleto-type'),
    modalBoletoNome: document.getElementById('modal-boleto-nome'),
    modalBoletoValor: document.getElementById('modal-boleto-valor'),
    modalBoletoObs: document.getElementById('modal-boleto-obs'),
    modalBoletoRepeticao: document.getElementById('modal-boleto-repeticao'),
    modalBoletoMesesRow: document.getElementById('row-boleto-meses'),
    modalBoletoMeses: document.getElementById('modal-boleto-meses'),
    modalBoletoMesesPreview: document.getElementById('modal-boleto-meses-preview'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    refreshBtn: document.getElementById('refresh-btn')
};

const config = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    dateFormat: 'MM/DD/YYYY'
};

let state = {
    selectedDate: null,
    selectedBoletoIndex: null,
    isEditing: false,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    expenses: JSON.parse(localStorage.getItem('expenses')) || {}
};

/* =================(UTILITÁRIOS)================= */
const utils = {
    formatDate: (date = new Date()) => {
        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
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
    saveExpenses: () => {
        localStorage.setItem('expenses', JSON.stringify(state.expenses));
    },

    updateExpenses: (date, newExpenses) => {
        if (newExpenses.length === 0) {
            delete state.expenses[date];
        } else {
            state.expenses[date] = newExpenses;
        }
        stateManager.saveExpenses();
    },

    addExpense: (date, expense) => {
        if (!state.expenses[date]) state.expenses[date] = [];
        state.expenses[date].push(expense);
        stateManager.saveExpenses();
    },

    removeExpense: (date, index) => {
        if (state.expenses[date]) {
            state.expenses[date].splice(index, 1);
            stateManager.updateExpenses(date, state.expenses[date]);
        }
    }
};

/* =================(GERENCIAMENTO DO CALENDÁRIO)================= */
const calendarManager = {
    createCalendar: () => {
        elements.calendar.innerHTML = '';
        const { currentMonth, currentYear } = state;
        const daysInMonth = utils.getDaysInMonth(currentMonth, currentYear);
        
        elements.calendarTitle.textContent = `${config.monthNames[currentMonth]} ${currentYear}`;
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        // Dias vazios no início
        for (let i = 0; i < startOffset; i++) {
            elements.calendar.appendChild(calendarManager.createDayElement('empty'));
        }

        // Dias do mês
        for (let i = 1; i <= daysInMonth; i++) {
            elements.calendar.appendChild(calendarManager.createDayElement('normal', i));
        }
    },

    createDayElement: (type, day = null) => {
        const dayEl = document.createElement('div');
        dayEl.className = `day ${type}`;
        
        if (type === 'normal') {
            const dateStr = utils.formatDate(new Date(state.currentYear, state.currentMonth, day));
            dayEl.textContent = day;
            dayEl.addEventListener('click', () => modalManager.openDetails(day));
            dayEl.addEventListener('mouseenter', () => tableManager.updateBoletosTable(dateStr));
            dayEl.addEventListener('mouseleave', () => tableManager.updateBoletosTable());
            
            if (dateStr === utils.formatDate()) dayEl.classList.add('today');
            if (state.expenses[dateStr]?.length > 0) {
                dayEl.classList.add('has-boletos');
                dayEl.title = `${state.expenses[dateStr].length} boleto(s) cadastrado(s)`;
            }
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
        elements.boletosTableBody.innerHTML = '';
        dateStr = dateStr || utils.formatDate();
        const expenses = state.expenses[dateStr] || [];
        let total = 0;

        tableManager.updateDateIndicator(dateStr);

        if (expenses.length === 0) {
            elements.boletosTableBody.innerHTML = '<tr><td colspan="2">Nenhum boleto</td></tr>';
        } else {
            expenses.forEach(item => {
                total += parseFloat(item.valor || 0);
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${item.nome || ''}</td><td>${utils.formatCurrency(item.valor)}</td>`;
                elements.boletosTableBody.appendChild(tr);
            });
        }
        
        elements.boletosTotal.textContent = utils.formatCurrency(total);
    },

    updateDateIndicator: (dateStr) => {
        const indicator = document.getElementById('current-date-indicator');
        if (!indicator) return;
        
        const [month, day, year] = dateStr.split('/');
        indicator.textContent = `${day}/${month}/${year}`;
        Object.assign(indicator.style, {
            fontSize: '0.9rem', color: '#666', textAlign: 'center', marginBottom: '8px'
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
        elements.addBoletoForm.style.display = 'none';
        formManager.resetFormState();
    },

    updateBoletosList: (dateStr) => {
        elements.modalBoletosList.innerHTML = '';
        const list = state.expenses[dateStr] || [];

        if (list.length === 0) {
            elements.modalBoletosList.innerHTML = '<li>Nenhum boleto cadastrado.</li>';
            elements.editarBoletoBtn.disabled = elements.deletarBoletoBtn.disabled = true;
        } else {
            list.forEach((item, idx) => {
                const li = modalManager.createBoletoListItem(item, idx);
                elements.modalBoletosList.appendChild(li);
            });
        }
    },

    createBoletoListItem: (item, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        
        const extraInfo = [];
        if (item.obs) extraInfo.push(item.obs);
        if (item.repeticao && item.repeticao !== 'unica') {
            extraInfo.push(item.repeticao === 'mensal' && item.meses ? 
                `(${item.meses} meses)` : `(${item.repeticao})`);
        }

        li.innerHTML = `
            <strong>${item.tipo || ''}</strong>${item.nome || ''} 
            <span>${utils.formatCurrency(item.valor)}</span>
            ${extraInfo.length > 0 ? `<small>${extraInfo.join(' • ')}</small>` : ''}
        `;

        li.addEventListener('click', () => modalManager.selectBoleto(li, index));
        return li;
    },

    selectBoleto: (element, index) => {
        document.querySelectorAll('#modal-boletos-list li').forEach(item => 
            item.classList.remove('selecionado'));
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
        elements.cancelEditBtn.style.display = 'none';
        elements.addBoletoForm.reset();
        
        elements.addBoletoForm.querySelectorAll('input, select').forEach(input => {
            input.disabled = false;
            input.style.color = '';
        });
        
        document.querySelectorAll('#modal-boletos-list li').forEach(item => 
            item.classList.remove('selecionado'));
    },

    openEditBoleto: () => {
        if (state.selectedBoletoIndex === null || !state.expenses[state.selectedDate]) return;

        const boleto = state.expenses[state.selectedDate][state.selectedBoletoIndex];
        state.isEditing = true;

        elements.modalBoletoType.value = boleto.tipo || '';
        elements.modalBoletoNome.value = boleto.nome || '';
        elements.modalBoletoValor.value = boleto.valor || '';
        elements.modalBoletoObs.value = boleto.obs || '';
        elements.modalBoletoRepeticao.value = boleto.repeticao || 'unica';
        
        formManager.toggleMesesField(boleto.repeticao === 'mensal', boleto.meses);
        
        elements.addBoletoForm.style.display = 'block';
        elements.cancelEditBtn.style.display = 'inline-block';
    },

    toggleMesesField: (show, meses = '') => {
        elements.modalBoletoMesesRow.style.display = show ? '' : 'none';
        if (show) {
            elements.modalBoletoMeses.value = meses;
            if (elements.modalBoletoMesesPreview) {
                elements.modalBoletoMesesPreview.textContent = meses ? `(${meses} meses)` : '';
            }
        }
    },

    handleFormSubmit: (e) => {
        e.preventDefault();
        
        const formData = {
            tipo: elements.modalBoletoType.value.trim(),
            nome: elements.modalBoletoNome.value.trim(),
            valor: parseFloat(elements.modalBoletoValor.value),
            obs: elements.modalBoletoObs.value.trim(),
            repeticao: elements.modalBoletoRepeticao.value,
            meses: elements.modalBoletoRepeticao.value === 'mensal' ? 
                parseInt(elements.modalBoletoMeses.value || '0', 10) : 0
        };

        if (!formManager.validateForm(formData)) return;

        if (state.isEditing && state.selectedBoletoIndex !== null) {
            state.expenses[state.selectedDate][state.selectedBoletoIndex] = formData;
        } else {
            stateManager.addExpense(state.selectedDate, formData);
            if (formData.repeticao === 'mensal') {
                repetitionManager.criarBoletosMensais(state.selectedDate, formData);
            }
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
        if (state.selectedBoletoIndex === null || !state.expenses[state.selectedDate]) return;

        const boleto = state.expenses[state.selectedDate][state.selectedBoletoIndex];
        
        if (confirm('Tem certeza que deseja deletar este boleto?')) {
            repetitionManager.deletarBoletosRepetidos(boleto);
            stateManager.removeExpense(state.selectedDate, state.selectedBoletoIndex);
            modalManager.updateBoletosList(state.selectedDate);
            tableManager.updateBoletosTable(state.selectedDate);
            calendarManager.createCalendar();
            formManager.resetFormState();
        }
    }
};

/* =================(GERENCIAMENTO DE REPETIÇÃO)================= */
const repetitionManager = {
    criarBoletosMensais: (dataInicial, boleto) => {
        const { month, day, year } = utils.parseDate(dataInicial);
        let mes = month + 1, ano = year;
        const totalMeses = Math.max(1, boleto.meses);

        for (let i = 1; i <= totalMeses; i++) {
            mes = mes > 12 ? 1 : mes + 1;
            ano = mes === 1 ? ano + 1 : ano;
            
            const novaData = utils.formatDate(new Date(ano, mes - 1, day));
            if (!state.expenses[novaData]) state.expenses[novaData] = [];
            
            const existeBoleto = state.expenses[novaData].some(b =>
                utils.normalizeString(b.tipo) === utils.normalizeString(boleto.tipo) &&
                utils.normalizeString(b.nome) === utils.normalizeString(boleto.nome) &&
                Number(b.valor) === Number(boleto.valor)
            );

            if (!existeBoleto) {
                state.expenses[novaData].push({ ...boleto, meses: totalMeses });
            }
        }
        stateManager.saveExpenses();
    },

    deletarBoletosRepetidos: (boletoOriginal) => {
        Object.keys(state.expenses).forEach(dateStr => {
            state.expenses[dateStr] = state.expenses[dateStr].filter(boleto => 
                !repetitionManager.isSameBoleto(boleto, boletoOriginal));
            stateManager.updateExpenses(dateStr, state.expenses[dateStr]);
        });
    },

    isSameBoleto: (boleto1, boleto2) => {
        return utils.normalizeString(boleto1.tipo) === utils.normalizeString(boleto2.tipo) &&
               utils.normalizeString(boleto1.nome) === utils.normalizeString(boleto2.nome) &&
               Number(boleto1.valor) === Number(boleto2.valor) &&
               utils.normalizeString(boleto1.obs) === utils.normalizeString(boleto2.obs) &&
               utils.normalizeString(boleto1.repeticao || 'unica') === utils.normalizeString(boleto2.repeticao || 'unica');
    }
};

/* =================(INICIALIZAÇÃO E EVENT LISTENERS)================= */
const init = {
    setupEventListeners: () => {
        // Navegação
        elements.backBtn.addEventListener('click', () => {
            elements.detailsScreen.classList.remove('active');
            elements.calendarScreen.classList.add('active');
        });

        elements.prevMonthBtn.addEventListener('click', () => calendarManager.navigateMonth(-1));
        elements.nextMonthBtn.addEventListener('click', () => calendarManager.navigateMonth(1));

        // Modal
        elements.closeModalBtn.addEventListener('click', modalManager.closeModal);
        elements.addBoletoBtn.addEventListener('click', () => {
            formManager.resetFormState();
            elements.addBoletoForm.style.display = 'block';
        });

        // Formulário
        elements.editarBoletoBtn.addEventListener('click', formManager.openEditBoleto);
        elements.deletarBoletoBtn.addEventListener('click', formManager.deletarBoleto);
        elements.cancelEditBtn.addEventListener('click', formManager.resetFormState);
        elements.addBoletoForm.addEventListener('submit', formManager.handleFormSubmit);

        // Repetição
        if (elements.modalBoletoRepeticao) {
            elements.modalBoletoRepeticao.addEventListener('change', () => {
                formManager.toggleMesesField(elements.modalBoletoRepeticao.value === 'mensal');
            });
        }

        // Preview de meses
        if (elements.modalBoletoMeses) {
            elements.modalBoletoMeses.addEventListener('input', () => {
                if (!elements.modalBoletoMesesPreview) return;
                const n = parseInt(elements.modalBoletoMeses.value || '');
                elements.modalBoletoMesesPreview.textContent = n > 0 ? `(${n} meses)` : '';
            });
        }

        // Atualizar página
        if (elements.refreshBtn) {
            elements.refreshBtn.addEventListener('click', () => {
                if (confirm('Deseja atualizar a página? Todos os dados não salvos serão perdidos.')) {
                    location.reload();
                }
            });
        }
    },

    initialize: () => {
        calendarManager.createCalendar();
        tableManager.updateBoletosTable();
        init.setupEventListeners();
    }
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init.initialize);