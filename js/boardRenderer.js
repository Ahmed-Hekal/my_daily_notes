// Board rendering functions
import { state, setCurrentBoardId } from './state.js';
import { escapeHtml } from './utils.js';
import { renderTasks } from './taskRenderer.js';

export function renderBoards() {
  const boardsGrid = document.getElementById('boardsGrid');
  
  if (state.boards.length === 0) {
    boardsGrid.innerHTML = `
      <div class="empty-state">
        <p>No boards yet. Create your first board to get started!</p>
      </div>
    `;
    return;
  }

  boardsGrid.innerHTML = state.boards.map(board => `
    <div class="board-card" data-board-id="${board.id}">
      <h3>${escapeHtml(board.title)}</h3>
      <p class="task-count">${board.tasks.length} task${board.tasks.length !== 1 ? 's' : ''}</p>
    </div>
  `).join('');
}

export function showBoardsList() {
  document.getElementById('boardsList').style.display = 'block';
  document.getElementById('boardView').classList.remove('active');
  setCurrentBoardId(null);
  renderBoards();
}

export function openBoard(boardId) {
  setCurrentBoardId(boardId);
  const board = state.boards.find(b => b.id === boardId);
  
  if (board) {
    document.getElementById('currentBoardTitle').textContent = board.title;
    document.getElementById('boardsList').style.display = 'none';
    document.getElementById('boardView').classList.add('active');
    renderTasks();
  }
}
