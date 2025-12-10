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
- Navegação entre meses com setas
- Hover otimizado sem flicker

### **Relatório Mensal**
- Tabela com gastos diários do mês inteiro
- Resumo com total do mês, média diária e maior gasto
- Gráfico de pizza mostrando distribuição por categoria
- Seleção de mês/ano para análise histórica

### **Gestão de Boletos**
- Categorias: Água, Luz, Internet, Telefone, Aluguel, Cartão, **Imposto**, **Contadora**, Outros
- Repetição mensal automática
- Observações e alertas personalizados
- Interface modal intuitiva para cadastro

### **Sistema de Backup**
- Backup automático do banco de dados
- Importação de versões anteriores
- Proteção contra perda de dados

### **Interface Moderna**
- Dropdowns/selects com design arredondado e animações
- Cores consistentes e transições suaves
- Layout limpo e profissional
- Botão de reinicialização rápida
- Tipografia melhorada nos dias da semana

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

### Navegação no Calendário
1. Inicie o aplicativo (`npm start`)
2. Use as **setas ◀ ▶** para navegar entre os meses
3. Clique em qualquer dia para adicionar ou visualizar boletos
4. Dias com boletos aparecem destacados visualmente

### Acessar o Relatório Mensal
1. Na tela principal, clique na aba **"Relatório Mensal"**
2. Use os **dropdowns arredondados** de mês e ano para escolher o período
3. Visualize:
   - **Tabela diária**: gastos de cada dia do mês
   - **Resumo**: totais e médias
   - **Gráfico de pizza**: distribuição por categoria

### Gerenciar Boletos
1. Clique em um dia do calendário
2. Use o botão **"Adicionar"** para cadastrar novos boletos
3. Escolha entre as categorias disponíveis: **Imposto**, **Contadora**, etc.
4. Configure repetição mensal se necessário

### Sistema de Backup
1. Clique no botão de **configurações** (ícone de engrenagem)
2. Use as opções de backup, importação e exportação
3. Mantenha seus dados sempre seguros

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

- **Aplicativo desktop** exclusivo (não é versão web)
- Projeto simples e leve para controle pessoal de gastos
- Interface moderna com dropdowns arredondados e animações suaves
- Ideal para estudo de integração entre Electron + SQLite
- Código modular e fácil de adaptar para outras aplicações desktop
- Sistema completo de backup e recuperação de dados
- Layout otimizado sem botões desnecessários
