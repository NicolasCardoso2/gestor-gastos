<div align="center">

# Gestor de Gastos Desktop

**Controle financeiro pessoal — calendário interativo, relatórios e backup automático.**

[![Electron](https://img.shields.io/badge/Electron_31-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white)](https://www.microsoft.com/windows)

> Aplicativo desktop para gestão de boletos e gastos mensais, com calendário interativo, relatórios visuais e sistema de backup — desenvolvido com Electron + SQLite.

<!-- 💡 Adicione um screenshot aqui: -->
<!-- ![Gestor de Gastos](./docs/screenshot.png) -->

</div>

---

## Funcionalidades

### 📅 Calendário Interativo
- Visualização mensal com destaque nos dias que têm boletos cadastrados
- Navegação por mês com setas
- Clique em qualquer dia para adicionar ou visualizar lançamentos

### 📊 Relatório Mensal
- Tabela com gastos diários do período selecionado
- Resumo: total do mês, média diária e maior gasto
- Gráfico de pizza com distribuição por categoria
- Filtro por mês e ano para análise histórica

### 🧾 Gestão de Boletos
- Categorias: Água, Luz, Internet, Telefone, Aluguel, Cartão, Imposto, Contadora, Outros
- Repetição mensal automática
- Observações e alertas personalizados por lançamento

### 💾 Backup e Segurança
- Backup automático do banco de dados SQLite
- Importação de versões anteriores
- Banco criado automaticamente em `%APPDATA%/Gestor de Gastos/database.db`

---

## Como rodar

**Pré-requisitos:** Node.js 18+

```bash
git clone https://github.com/NicolasCardoso2/gestor-gastos-desktop.git
cd gestor-gastos-desktop
npm install
npm start
```

| Script | Descrição |
|---|---|
| `npm start` | Inicia em modo desenvolvimento |
| `npm run dist` | Gera instalador `.exe` na pasta `dist/` |
| `npm run clean` | Remove arquivos temporários |

---

## Estrutura do projeto

```
gestor-gastos/
├── assets/          # Ícones e recursos
├── renderer/        # Interface (HTML + CSS + JS)
│   ├── index.html
│   ├── renderer.js
│   └── styles.css
├── main.js          # Processo principal Electron
├── preload.js       # Script de pré-carregamento
└── package.json
```

---

## Stack

| Tecnologia | Função |
|---|---|
| **Electron 31** | Framework desktop cross-platform |
| **SQLite** | Banco de dados local, sem servidor |
| **Chart.js** | Gráficos de relatório |
| **Node.js 18+** | Runtime |
| **HTML/CSS/JS** | Interface (ES6+) |

---

<div align="center">

Feito por [Nicolas Cardoso](https://github.com/NicolasCardoso2) · [LinkedIn](https://www.linkedin.com/in/nicolas-cardoso-vilha-do-lago-2483b1322/)

</div>
