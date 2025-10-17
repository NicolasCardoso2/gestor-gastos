<h1 align="center">💰 Gestor de Gastos</h1>

<p align="center">
  Aplicativo desktop para <strong>gestão de gastos e boletos</strong>, desenvolvido com <code>Electron</code> + <code>SQLite</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-^28.0-blue?logo=electron" alt="Electron Badge" />
  <img src="https://img.shields.io/badge/SQLite-DB-lightblue?logo=sqlite" alt="SQLite Badge" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Platform-Windows%2010/11-blue?logo=windows" alt="Windows Badge" />
</p>

---

## 🧩 Requisitos

- **Node.js** `v18+`
- **Windows 10 ou 11`

---

## ⚙️ Desenvolvimento

npm install

npm run start

---

🎨 Gerar ícones (modo dev)

npm run icons

---

📦 Build do instalador (Windows)

npm run dist

📁 O instalador (.exe) será gerado na pasta dist/.

---

💾 Banco de Dados
O banco database.db é criado automaticamente em:

  %APPDATA%/Gestor de Gastos

Artefatos de build (dist/, build/), node_modules/ e database.db estão listados no .gitignore.

---

🚀 Tecnologias Utilizadas
| Tecnologia     | Função                        |
| -------------- | ----------------------------- |
| 🖥️ Electron   | Criação do app desktop        |
| 💾 SQLite      | Armazenamento local dos dados |
| ⚡ Node.js      | Execução e scripts de build   |
| 🎨 HTML/CSS/JS | Interface gráfica (renderer)  |

---

🧠 Observações

Projeto simples e leve para controle pessoal de gastos.

Ideal para estudo de integração entre Electron + SQLite.

Código modular e fácil de adaptar para outras aplicações desktop.
