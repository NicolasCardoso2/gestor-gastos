# Gestor de Gastos

**Aplicativo desktop para gestão de gastos e boletos**, desenvolvido com `Electron` + `SQLite`.

![Electron Badge](https://img.shields.io/badge/Electron-^31.0-blue?logo=electron)
![SQLite Badge](https://img.shields.io/badge/SQLite-DB-lightblue?logo=sqlite)
![Chart.js Badge](https://img.shields.io/badge/Chart.js-Gráficos-orange?logo=chart.js)
![Node.js Badge](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js)
![Windows Badge](https://img.shields.io/badge/Platform-Windows%2010/11-blue?logo=windows)

---

## Funcionalidades

### **Calendário Interativo**
- Visualização mensal de gastos
- Indicação visual de dias com boletos cadastrados
- Navegação entre meses
- Hover otimizado sem flicker

### **Relatório Mensal**
- Tabela com gastos diários do mês inteiro
- Resumo com total do mês, média diária e maior gasto
- Gráfico de pizza mostrando distribuição por categoria
- Seleção de mês/ano para análise histórica

### **Relatório Anual**
- Visualização do mês com maiores gastos
- Total anual de gastos
- Navegação rápida para mês específico

### **Gestão de Boletos**
- Categorias: Água, Luz, Internet, Telefone, Aluguel, Cartão, **Imposto**, **Contadora**, Outros
- Repetição mensal automática
- Observações e alertas personalizados

### **Sistema de Backup**
- Backup automático do banco de dados
- Importação de versões anteriores
- Proteção contra perda de dados

### **Melhorias Técnicas**
- Interface responsiva sem layout shift
- Hover suave sem problemas de flicker
- Agregação inteligente de dados mensais
- Visualizações interativas com Chart.js

---

## Requisitos

- **Node.js** `v18+`
- **Windows 10 ou 11**

---

## Desenvolvimento

```bash
npm install
npm run start
```

---

**Gerar ícones (modo dev)**

```bash
npm run icons
```

---

**Build do instalador (Windows)**

```bash
npm run dist
```

O instalador (.exe) será gerado na pasta `dist/`.

---

## Como Usar

### Acessar o Relatório Mensal
1. Inicie o aplicativo (`npm start`)
2. Na tela principal, clique na aba **"Relatório Mensal"**
3. Use os seletores de mês e ano para escolher o período
4. Visualize:
   - **Tabela diária**: gastos de cada dia do mês
   - **Resumo**: totais e médias
   - **Gráfico de pizza**: distribuição por categoria

### Acessar o Relatório Anual
1. Clique no botão **"Relatório Anual"** (canto superior direito)
2. Selecione o ano desejado
3. Visualize o mês com maiores gastos e total anual
4. Clique no nome do mês para navegar diretamente

### Adicionar Novas Categorias
As novas categorias **"Imposto"** e **"Contadora"** estão disponíveis em todos os formulários de cadastro de boletos e são incluídas automaticamente nos relatórios e gráficos.

---

## Banco de Dados

O banco `database.db` é criado automaticamente em:

```
%APPDATA%/Gestor de Gastos
```

Artefatos de build (dist/, build/), node_modules/ e database.db estão listados no .gitignore.

---

## Tecnologias Utilizadas

| Tecnologia  | Função                        |
| ----------- | ----------------------------- |
| Electron    | Criação do app desktop        |
| SQLite      | Armazenamento local dos dados |
| Chart.js    | Gráficos de pizza interativos |
| Node.js     | Execução e scripts de build   |
| HTML/CSS/JS | Interface gráfica (renderer)  |

---

## Observações

- Projeto simples e leve para controle pessoal de gastos
- Ideal para estudo de integração entre Electron + SQLite
- Código modular e fácil de adaptar para outras aplicações desktop
- Sistema completo de backup e recuperação de dados
