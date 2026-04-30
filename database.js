const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Database file location
const dbPath = path.join(app.getPath('userData'), 'taskboards.db');
let db = null;

// Initialize database
async function initDatabase() {
  // Handle both development and production environments
  let wasmPath;
  
  // Check if we're in packaged app (production) or development
  if (app.isPackaged) {
    // In production, use process.resourcesPath
    wasmPath = path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/sql.js/dist/sql-wasm.wasm');
  } else {
    // In development
    wasmPath = path.join(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');
  }
  
  const wasmBinary = fs.readFileSync(wasmPath);
  
  const SQL = await initSqlJs({
    wasmBinary
  });
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      board_id TEXT NOT NULL,
      title TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
  `);
  
  // Add position column if it doesn't exist (for existing databases)
  try {
    const checkColumn = db.exec("PRAGMA table_info(tasks)");
    if (checkColumn.length > 0) {
      const columns = checkColumn[0].values.map(row => row[1]);
      if (!columns.includes('position')) {
        db.run('ALTER TABLE tasks ADD COLUMN position INTEGER DEFAULT 0');
      }
    }
  } catch (error) {
    console.log('Position column check/add error (might already exist):', error.message);
  }
  
  saveDatabase();
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Board operations
function getAllBoards() {
  const result = db.exec('SELECT * FROM boards ORDER BY created_at DESC');
  
  if (result.length === 0) return [];
  
  const boards = result[0].values.map(row => ({
    id: row[0],
    title: row[1]
  }));
  
  // Get tasks for each board
  return boards.map(board => ({
    id: board.id,
    title: board.title,
    tasks: getTasksByBoardId(board.id)
  }));
}

function createBoard(id, title) {
  db.run('INSERT INTO boards (id, title) VALUES (?, ?)', [id, title]);
  saveDatabase();
  return { id, title, tasks: [] };
}

function deleteBoard(id) {
  // Delete tasks first
  db.run('DELETE FROM tasks WHERE board_id = ?', [id]);
  db.run('DELETE FROM boards WHERE id = ?', [id]);
  saveDatabase();
}

// Task operations
function getTasksByBoardId(boardId) {
  const result = db.exec('SELECT * FROM tasks WHERE board_id = ? ORDER BY position ASC, created_at DESC', [boardId]);
  
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0],
    title: row[2],
    priority: row[3],
    status: row[4],
    description: row[5],
    position: row[6] || 0
  }));
}

function createTask(id, boardId, title, priority, status, description) {
  // Get the highest position for this board
  const posResult = db.exec('SELECT MAX(position) FROM tasks WHERE board_id = ?', [boardId]);
  const maxPosition = (posResult.length > 0 && posResult[0].values.length > 0 && posResult[0].values[0][0]) 
    ? posResult[0].values[0][0] : 0;
  const newPosition = maxPosition + 1;
  
  db.run(
    'INSERT INTO tasks (id, board_id, title, priority, status, description, position) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, boardId, title, priority, status, description, newPosition]
  );
  saveDatabase();
  return { id, title, priority, status, description, position: newPosition };
}

function deleteTask(id) {
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  saveDatabase();
}

function updateTaskPositions(taskPositions) {
  // taskPositions is an array of {id, position}
  taskPositions.forEach(({ id, position }) => {
    db.run('UPDATE tasks SET position = ? WHERE id = ?', [position, id]);
  });
  saveDatabase();
}

function updateTaskDescription(taskId, description) {
  db.run('UPDATE tasks SET description = ? WHERE id = ?', [description, taskId]);
  saveDatabase();
}

module.exports = {
  initDatabase,
  getAllBoards,
  createBoard,
  deleteBoard,
  createTask,
  deleteTask,
  updateTaskPositions,
  updateTaskDescription
};
