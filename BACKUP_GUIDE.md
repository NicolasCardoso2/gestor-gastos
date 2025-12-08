# 🗂️ Guia de Backup e Transferência de Dados

## 📋 Sobre o Sistema de Backup

O **Gestor de Gastos** agora possui um sistema completo de backup que **previne a perda de dados** ao atualizar versões ou trocar de computador.

## 🚀 Funcionalidades Novas

### 🔍 **Detecção Automática na Inicialização**
Quando você abrir o aplicativo, ele automaticamente:
- ✅ Verifica se já existem dados salvos
- ❓ Pergunta o que você quer fazer com os dados existentes
- 🛡️ Oferece opções seguras para não perder informações

### ⚙️ **Botão de Configurações**
- Clique no botão **⚙️** (engrenagem) na barra de navegação
- Acesse todas as opções de backup e restauração
- Gerencie seus dados de forma fácil e segura

## 📖 Como Usar

### 🆕 **Primeira Instalação**
- O app criará automaticamente um banco de dados vazio
- Comece a cadastrar seus boletos normalmente

### 🔄 **Atualizando Versão (mesmo PC)**
Quando atualizar o app no mesmo computador:
1. O app detectará os dados existentes
2. Escolha **"Manter Dados Existentes"**
3. Seus dados serão preservados automaticamente

### 💻 **Transferindo para Outro PC**
Quando instalar em um PC novo:
1. **No PC antigo:**
   - Clique em ⚙️ → **"📤 Exportar Dados"**
   - Salve o arquivo em um local seguro (pen drive, nuvem, etc.)

2. **No PC novo:**
   - Instale o app normalmente
   - Clique em ⚙️ → **"📥 Importar Dados"**
   - Selecione o arquivo exportado do PC antigo
   - Todos seus dados serão restaurados!

## 🛠️ **Opções Disponíveis**

### 📦 **Criar Backup**
- Cria uma cópia de segurança dos seus dados
- Salva na mesma pasta do banco de dados
- Nome automático com data e hora

### 📥 **Importar Dados**
- Restaura dados de um arquivo de backup
- Substitui os dados atuais (faz backup automático antes)
- Suporta arquivos `.db`, `.sqlite`, `.sqlite3`

### 📤 **Exportar Dados**
- Cria uma cópia do banco atual
- Você escolhe onde salvar
- Ideal para transferir entre PCs

## 🎯 **Cenários de Uso**

### ✅ **Cenário 1: Atualização no Mesmo PC**
```
1. Baixar nova versão
2. Instalar (substitui a anterior)
3. Abrir app → Escolher "Manter Dados Existentes"
4. ✅ Pronto! Dados preservados
```

### ✅ **Cenário 2: PC Novo**
```
1. PC Antigo: ⚙️ → Exportar Dados → Salvar arquivo
2. PC Novo: Instalar app → ⚙️ → Importar Dados → Selecionar arquivo
3. ✅ Todos os dados transferidos!
```

### ✅ **Cenário 3: Backup Preventivo**
```
1. Regularmente: ⚙️ → Criar Backup
2. Dados salvos automaticamente
3. ✅ Proteção contra perda acidental
```

## 📍 **Localização dos Dados**

Os dados ficam salvos em:
```
C:\Users\[seu_usuário]\AppData\Roaming\Gestor de Gastos\database.db
```

## 💡 **Dicas Importantes**

- 🔄 **Faça backups regulares** - pelo menos uma vez por mês
- 💾 **Guarde backups em locais seguros** - nuvem, pen drive, etc.
- ⚠️ **Teste a restauração** - verifique se o backup funciona
- 📧 **Compartilhe** - você pode enviar o arquivo `.db` por email
- 🗓️ **Data nos nomes** - backups automáticos têm data/hora no nome

## ❓ **Resolução de Problemas**

### ❌ **"Erro ao importar dados"**
- Verifique se o arquivo não está corrompido
- Certifique-se de que é um arquivo de banco válido
- Tente criar um novo backup do arquivo original

### 🔄 **App não detecta dados existentes**
- Verifique se o arquivo `database.db` existe na pasta AppData
- Execute o app como administrador se necessário
- Reinstale se o problema persistir

### 📂 **Não encontro a pasta dos dados**
- Cole este caminho no Explorer: `%APPDATA%\Gestor de Gastos`
- Ou use ⚙️ → as informações mostram o local exato

---

## 🎉 **Agora você está protegido contra perda de dados!**

Com esse sistema, você pode:
- ✅ Atualizar o app sem medo
- ✅ Trocar de computador facilmente
- ✅ Ter backups de segurança
- ✅ Restaurar dados quando precisar

**Qualquer dúvida, use as opções do menu ⚙️ Configurações!**