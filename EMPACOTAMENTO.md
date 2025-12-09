# Empacotamento da Aplicação

## 📦 Como gerar o executável (.exe)

Para empacotar a aplicação em um arquivo executável, use o seguinte comando:

```bash
npm run package-exe
```

Este comando irá:
1. Gerar os ícones necessários a partir do PNG
2. Empacotar a aplicação usando electron-packager
3. Criar uma pasta `dist/Gestor de Gastos-win32-x64/` com todos os arquivos necessários

## 🚀 Como executar a aplicação empacotada

1. Navegue até a pasta: `dist/Gestor de Gastos-win32-x64/`
2. Execute o arquivo: `Gestor de Gastos.exe`

## 📁 Estrutura da aplicação empacotada

A pasta `dist/Gestor de Gastos-win32-x64/` contém:
- `Gestor de Gastos.exe` - O executável principal da aplicação
- Todas as dependências necessárias do Electron
- Recursos da aplicação (HTML, CSS, JS, banco de dados)

## 📋 Distribuição

Para distribuir a aplicação:

1. **Opção 1 - Pasta completa**: Comprima toda a pasta `Gestor de Gastos-win32-x64` em um arquivo ZIP e compartilhe
2. **Opção 2 - Instalador**: Use `npm run dist` (requer privilégios de administrador) para gerar um instalador NSIS

## 🔧 Requisitos do sistema

- Windows 7 ou superior
- Arquitetura x64 (64-bit)
- Não requer Node.js ou outras dependências no computador de destino

## ⚠️ Notas importantes

- A aplicação empacotada tem aproximadamente 150-200 MB
- O banco de dados SQLite é criado automaticamente na primeira execução
- Todos os dados ficam armazenados localmente na máquina do usuário

## 🐛 Solução de problemas

Se encontrar erros durante o empacotamento:

1. **Erro de privilégios**: Execute o terminal como administrador
2. **Erro de cache**: Remova a pasta `node_modules` e execute `npm install`
3. **Erro de ícones**: Verifique se existe o arquivo `assets/app-icon.png`

## 🔄 Scripts disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run package-exe` - Gera executável usando electron-packager (recomendado)
- `npm run dist` - Gera instalador usando electron-builder (requer admin)
- `npm run pack` - Gera apenas a pasta empacotada usando electron-builder
- `npm run icons` - Gera ícones .ico a partir do PNG