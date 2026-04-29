const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Database file location
const dbPath = path.join(app.getPath('userData'), 'taskboards.db');
let db = null;

// Initialize database
async function initDatabase() {
  const SQL = await initSqlJs();
  
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
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_board_id ON tasks(board_id);
  `);
  
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
  const result = db.exec('SELECT * FROM tasks WHERE board_id = ? ORDER BY created_at DESC', [boardId]);
  
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    id: row[0],
    title: row[2],
    priority: row[3],
    status: row[4],
    description: row[5]
  }));
}

function createTask(id, boardId, title, priority, status, description) {
  db.run(
    'INSERT INTO tasks (id, board_id, title, priority, status, description) VALUES (?, ?, ?, ?, ?, ?)',
    [id, boardId, title, priority, status, description]
  );
  saveDatabase();
  return { id, title, priority, status, description };
}

function deleteTask(id) {
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  saveDatabase();
}

module.exports = {
  initDatabase,
  getAllBoards,
  createBoard,
  deleteBoard,
  createTask,
  deleteTask
};
