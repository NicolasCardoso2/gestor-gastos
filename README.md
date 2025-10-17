# Gestor de Gastos

Aplicativo desktop em Electron + SQLite para gestão de gastos e boletos.

## Requisitos
- Node.js 18+
- Windows 10/11

## Desenvolvimento
```powershell
npm install
npm run start
```

## Gerar ícones (dev)
```powershell
npm run icons
```

## Build do instalador (Windows)
```powershell
npm run dist
```
O instalador (.exe) será gerado em `dist/`.

## Estrutura
- `main.js`: processo principal do Electron
- `renderer/`: UI (HTML/CSS/JS)
- `preload.js`: bridge seguro entre main e renderer
- `scripts/generate-icons.js`: gera `build/icon.ico` a partir de `assets/app-icon.png`

## Observações
- O banco `database.db` é criado em `%APPDATA%/Gestor de Gastos` (pasta userData do Electron) quando o app roda.
- Artefatos de build (`dist/`, `build/`), `node_modules/` e `database.db` estão no `.gitignore`.
