# Gestor de Gastos Desktop

> **Aplicativo desktop moderno para gestão de gastos e boletos**, desenvolvido com `Electron` + `SQLite`.

<div align="center">

![Electron Badge](https://img.shields.io/badge/Electron-^31.0-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![SQLite Badge](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Chart.js Badge](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Windows Badge](https://img.shields.io/badge/Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)

[![GitHub release](https://img.shields.io/github/release/NicolasCardoso2/gestor-gastos-desktop?style=for-the-badge)](https://github.com/NicolasCardoso2/gestor-gastos-desktop/releases)

</div>

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
- **Categorias**: Água, Luz, Internet, Telefone, Aluguel, Cartão, **Imposto**, **Contadora**, Outros
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

- **Node.js** `v18+` ou superior
- **Windows 10 ou 11** (64-bit)
- **4GB RAM** mínimo (recomendado: 8GB)
- **200MB** de espaço em disco

---

## Instalação e Desenvolvimento

### Instalação Rápida

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/NicolasCardoso2/gestor-gastos-desktop.git
   cd gestor-gastos-desktop
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o aplicativo:**

```bash
npm start
```

### Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm start` | Inicia o app em modo desenvolvimento |
| **Gerar Ícones** | `npm run icons` | Gera ícones para diferentes plataformas |
| **Build Produção** | `npm run dist` | Cria o instalador (.exe) na pasta `dist/` |
| **Limpeza** | `npm run clean` | Remove arquivos temporários |

### Estrutura do Projeto

```
gestor-gastos/
├──  assets/          # Recursos e ícones
├──  build/           # Arquivos de build
├──  renderer/        # Interface gráfica (HTML/CSS/JS)
│   ├── index.html      # Página principal
│   ├── renderer.js     # Lógica do renderer
│   └── styles.css      # Estilos da aplicação
├──  scripts/         # Scripts de build e utilitários
├──  main.js          # Processo principal do Electron
├──  preload.js       # Script de pré-carregamento
└──  package.json     # Configurações e dependências
```

---

## Como Usar

### Navegação no Calendário
1. **Inicie** o aplicativo (`npm start`)
2. **Navegue** entre meses usando as setas **◀ ▶**
3. **Clique** em qualquer dia para adicionar ou visualizar boletos
4. **Identifique** dias com boletos pelos destacos visuais

### Acessar o Relatório Mensal  
1. **Clique** na aba **"Relatório Mensal"**
2. **Selecione** o período com os dropdowns de mês e ano
3. **Analise** os dados:
   - **Tabela diária**: gastos de cada dia do mês
   - **Resumo**: totais e médias calculadas
   - **Gráfico de pizza**: distribuição por categoria

### Gerenciar Boletos
1. **Selecione** um dia no calendário
2. **Adicione** novos boletos com o botão "Adicionar"
3. **Categorize** entre: Imposto, Contadora, Água, Luz, etc.
4. **Configure** repetição mensal automática

### Sistema de Backup
1. **Acesse** as configurações ( ícone de engrenagem)
2. **Utilize** as opções de backup e importação
3. **Mantenha** seus dados sempre protegidos

---

## Banco de Dados

O banco de dados `database.db` é criado **automaticamente** em:

```bash
%APPDATA%/Gestor de Gastos/database.db
```

> **Nota:** Arquivos como `dist/`, `build/`, `node_modules/` e `database.db` estão no `.gitignore` para manter o repositório limpo.

---

## Tecnologias Utilizadas

| Tecnologia |  Função | Versão |
|---------------|-----------|-----------|
| **Electron** | Framework para apps desktop | `^31.0` |
| **SQLite** | Banco de dados local | `Latest` |
| **Chart.js** | Gráficos interativos | `Latest` |
| **Node.js** | Runtime JavaScript | `18+` |
| **HTML/CSS/JS** | Interface do usuário | `ES6+` |

---

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

---


## Observações

- **Aplicativo desktop** exclusivo (não é versão web)
- Projeto **simples e leve** para controle pessoal de gastos
- Interface **moderna** com animações suaves
- Ideal para **estudo** de integração Electron + SQLite
- Código **modular** e fácil de adaptar
- Sistema **completo** de backup e recuperação
- Layout **otimizado** e intuitivo

---

<div align="center">

**Se este projeto te ajudou, deixe uma estrela!**

[![GitHub stars](https://img.shields.io/github/stars/NicolasCardoso2/gestor-gastos-desktop?style=social)](https://github.com/NicolasCardoso2/gestor-gastos-desktop/stargazers)

</div>
