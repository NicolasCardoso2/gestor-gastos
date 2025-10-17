const { app, BrowserWindow, ipcMain, Menu, nativeImage } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

/* =================(CONFIGURAÇÕES GLOBAIS)================= */
// Banco agora fica na pasta userData para funcionar no app empacotado (gravável)
// Ex.: C:\Users\\<usuario>\\AppData\\Roaming\\Gestor de Gastos
const DB_PATH = path.join(app.getPath('userData'), 'database.db');
let db = null;

/* =================(INICIALIZAÇÃO DO BANCO)================= */
function initializeDatabase() {
    try {
        db = new Database(DB_PATH);
        console.log('Conexão com banco de dados estabelecida.');
        
        // Criação das tabelas
        const tables = [
            `CREATE TABLE IF NOT EXISTS boletos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                nome TEXT NOT NULL,
                valor REAL NOT NULL,
                data TEXT NOT NULL,
                obs TEXT,
                repeticao TEXT DEFAULT 'unica',
                alerta INTEGER,
                status TEXT DEFAULT 'Pendente'
            )`,
            `CREATE TABLE IF NOT EXISTS gastos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL,
                descricao TEXT,
                valor REAL NOT NULL,
                categoria TEXT,
                pessoa TEXT
            )`
        ];
        
        tables.forEach(sql => db.exec(sql));
        console.log('Tabelas verificadas/criadas com sucesso.');
        return true;
    } catch (error) {
        console.error('Erro crítico ao inicializar banco:', error);
        return false;
    }
}

/* =================(GERENCIAMENTO DE JANELA)================= */
function createWindow() {
    // Remove o menu padrão do Electron (File/Edit/View/Window/Help)
    Menu.setApplicationMenu(null);

    // Define ícone da janela (usa .ico no Windows, com fallback para .png)
    const icoPath = path.join(__dirname, 'assets', 'app-icon.ico');
    const pngPath = path.join(__dirname, 'assets', 'app-icon.png');
    const winIcon = nativeImage.createFromPath(icoPath).isEmpty()
        ? nativeImage.createFromPath(pngPath)
        : nativeImage.createFromPath(icoPath);

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: winIcon,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Garante que o menu não re-apareça com ALT
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

/* =================(UTILITÁRIOS DE BANCO)================= */
const dbHandler = (operation, sql, params = []) => {
    try {
        const stmt = db.prepare(sql);
        return operation === 'get' ? stmt.all(...params) : stmt.run(...params);
    } catch (error) {
        console.error(`Erro na operação ${operation}:`, error);
        return operation === 'get' ? [] : { success: false, error: error.message };
    }
};

/* =================(HANDLERS IPC - GASTOS)================= */
const gastosHandlers = {
    'get-gastos': () => dbHandler('get', 'SELECT * FROM gastos ORDER BY data DESC'),
    
    'add-gasto': (event, gasto) => {
        const result = dbHandler('run', 
            'INSERT INTO gastos (data, descricao, valor, categoria, pessoa) VALUES (?, ?, ?, ?, ?)',
            [gasto.data, gasto.descricao, gasto.valor, gasto.categoria, gasto.pessoa]
        );
        return result.success === false ? result : { success: true, id: result.lastInsertRowid };
    },
    
    'update-gasto': (event, gasto) => {
        const result = dbHandler('run',
            'UPDATE gastos SET data=?, descricao=?, valor=?, categoria=?, pessoa=? WHERE id=?',
            [gasto.data, gasto.descricao, gasto.valor, gasto.categoria, gasto.pessoa, gasto.id]
        );
        return result.success === false ? result : { success: true, changes: result.changes };
    }
};

/* =================(HANDLERS IPC - BOLETOS)================= */
const boletosHandlers = {
    'get-boletos': () => dbHandler('get', 'SELECT * FROM boletos ORDER BY data DESC'),
    
    'add-boleto': (event, boleto) => {
        const { tipo, nome, valor, data, obs = '', repeticao = 'unica', alerta = null, status = 'Pendente' } = boleto;
        const result = dbHandler('run',
            'INSERT INTO boletos (tipo, nome, valor, data, obs, repeticao, alerta, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tipo, nome, valor, data, obs, repeticao, alerta, status]
        );
        return result.success === false ? result : { success: true, id: result.lastInsertRowid };
    },
    
    'update-boleto': (event, boleto) => {
        const { tipo, nome, valor, data, obs = '', repeticao = 'unica', alerta = null, status = 'Pendente', id } = boleto;
        const result = dbHandler('run',
            'UPDATE boletos SET tipo=?, nome=?, valor=?, data=?, obs=?, repeticao=?, alerta=?, status=? WHERE id=?',
            [tipo, nome, valor, data, obs, repeticao, alerta, status, id]
        );
        return result.success === false ? result : { success: true, changes: result.changes };
    },
    
    'delete-boleto': (event, id) => {
        const result = dbHandler('run', 'DELETE FROM boletos WHERE id = ?', [id]);
        return result.success === false ? result : { success: true, changes: result.changes };
    }
};

/* =================(REGISTRO DE HANDLERS IPC)================= */
function registerIpcHandlers() {
    // Registra todos os handlers de gastos
    Object.entries(gastosHandlers).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler);
    });
    
    // Registra todos os handlers de boletos
    Object.entries(boletosHandlers).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler);
    });
}

/* =================(INICIALIZAÇÃO DO APP)================= */
app.whenReady().then(() => {
    // Define App User Model ID no Windows para fixar ícone na barra de tarefas
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.gestorgastos.app');
    }

    if (!initializeDatabase()) {
        console.error('Não foi possível inicializar o banco de dados.');
        process.exit(1);
    }
    
    registerIpcHandlers();
    createWindow();
});

/* =================(EVENTOS DO APP)================= */
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db?.close();
        app.quit();
    }
});

app.on('before-quit', () => {
    db?.close();
});