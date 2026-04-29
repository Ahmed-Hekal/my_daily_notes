// Renderer process script
// Task Board Manager

// In-memory data storage
let boards = [];
let currentBoardId = null;

// Load data from SQLite database
async function loadData() {
  try {
    boards = await window.db.getAllBoards();
  } catch (error) {
    console.error('Error loading data:', error);
    boards = [];
  }
}

// Initialize app
async function init() {
  await loadData();
  renderBoards();
  attachEventListeners();
}

// Attach all event listeners
function attachEventListeners() {
  // New Board button
  document.getElementById('newBoardBtn').addEventListener('click', showCreateBoardModal);
  
  // Back to boards button
  document.getElementById('backToBoardsBtn').addEventListener('click', showBoardsList);
  
  // New Task button
  document.getElementById('newTaskBtn').addEventListener('click', showCreateTaskModal);
  
  // Delete Board button
  document.getElementById('deleteBoardBtn').addEventListener('click', deleteCurrentBoard);
  
  // Modal close buttons
  document.getElementById('closeBoardModalBtn').addEventListener('click', closeCreateBoardModal);
  document.getElementById('closeTaskModalBtn').addEventListener('click', closeCreateTaskModal);
  
  // Form submissions
  document.getElementById('createBoardForm').addEventListener('submit', createBoard);
  document.getElementById('createTaskForm').addEventListener('submit', createTask);
  
  // Event delegation for dynamically created elements
  document.getElementById('boardsGrid').addEventListener('click', handleBoardClick);
  document.getElementById('tasksGrid').addEventListener('click', handleTaskClick);
}

// Handle board card clicks
function handleBoardClick(event) {
  const boardCard = event.target.closest('.board-card');
  if (boardCard) {
    const boardId = boardCard.dataset.boardId;
    openBoard(boardId);
  }
}

// Handle task action clicks
function handleTaskClick(event) {
  if (event.target.classList.contains('delete-task-btn')) {
    const taskId = event.target.dataset.taskId;
    deleteTask(taskId);
  }
}

// Render boards list
function renderBoards() {
  const boardsGrid = document.getElementById('boardsGrid');
  
  if (boards.length === 0) {
    boardsGrid.innerHTML = `
      <div class="empty-state">
        <p>No boards yet. Create your first board to get started!</p>
      </div>
    `;
    return;
  }

  boardsGrid.innerHTML = boards.map(board => `
    <div class="board-card" data-board-id="${board.id}">
      <h3>${escapeHtml(board.title)}</h3>
      <p class="task-count">${board.tasks.length} task${board.tasks.length !== 1 ? 's' : ''}</p>
    </div>
  `).join('');
}

// Render tasks for current board
function renderTasks() {
  const board = boards.find(b => b.id === currentBoardId);
  if (!board) return;

  const tasksGrid = document.getElementById('tasksGrid');
  
  if (board.tasks.length === 0) {
    tasksGrid.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet. Create your first task!</p>
      </div>
    `;
    return;
  }

  tasksGrid.innerHTML = board.tasks.map(task => `
    <div class="task-card priority-${task.priority}">
      <h4>${escapeHtml(task.title)}</h4>
      <div class="task-meta">
        <span class="task-badge priority-badge">Priority: ${task.priority}</span>
        <span class="task-badge status-badge status-${task.status}">
          ${formatStatus(task.status)}
        </span>
      </div>
      <p class="task-description">${escapeHtml(task.description)}</p>
      <button class="btn btn-danger btn-small delete-task-btn" data-task-id="${task.id}">Delete</button>
    </div>
  `).join('');
}

// Show boards list
function showBoardsList() {
  document.getElementById('boardsList').style.display = 'block';
  document.getElementById('boardView').classList.remove('active');
  currentBoardId = null;
  renderBoards();
}

// Open a specific board
function openBoard(boardId) {
  currentBoardId = boardId;
  const board = boards.find(b => b.id === boardId);
  
  if (board) {
    document.getElementById('currentBoardTitle').textContent = board.title;
    document.getElementById('boardsList').style.display = 'none';
    document.getElementById('boardView').classList.add('active');
    renderTasks();
  }
}

// Modal functions
function showCreateBoardModal() {
  document.getElementById('createBoardModal').classList.add('active');
}

function closeCreateBoardModal() {
  document.getElementById('createBoardModal').classList.remove('active');
  document.getElementById('boardTitle').value = '';
}

function showCreateTaskModal() {
  document.getElementById('createTaskModal').classList.add('active');
}

function closeCreateTaskModal() {
  document.getElementById('createTaskModal').classList.remove('active');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskStatus').value = 'todo';
  document.getElementById('taskDescription').value = '';
}

// Create new board
async function createBoard(event) {
  event.preventDefault();
  
  const title = document.getElementById('boardTitle').value.trim();
  
  if (title) {
    const id = generateId();
    
    try {
      const newBoard = await window.db.createBoard(id, title);
      boards.push(newBoard);
      renderBoards();
      closeCreateBoardModal();
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board');
    }
  }
}

// Create new task
async function createTask(event) {
  event.preventDefault();
  
  const board = boards.find(b => b.id === currentBoardId);
  if (!board) return;
  
  const title = document.getElementById('taskTitle').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const status = document.getElementById('taskStatus').value;
  const description = document.getElementById('taskDescription').value.trim();
  
  if (title && description) {
    const id = generateId();
    
    try {
      const newTask = await window.db.createTask(id, currentBoardId, title, priority, status, description);
      board.tasks.push(newTask);
      renderTasks();
      closeCreateTaskModal();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  }
}

// Delete task
async function deleteTask(taskId) {
  const board = boards.find(b => b.id === currentBoardId);
  if (!board) return;
  
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await window.db.deleteTask(taskId);
      board.tasks = board.tasks.filter(t => t.id !== taskId);
      renderTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  }
}

// Delete current board
async function deleteCurrentBoard() {
  if (confirm('Are you sure you want to delete this board and all its tasks?')) {
    try {
      await window.db.deleteBoard(currentBoardId);
      boards = boards.filter(b => b.id !== currentBoardId);
      showBoardsList();
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Failed to delete board');
    }
  }
}

// Utility functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatStatus(status) {
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
