// Task rendering functions
import { getCurrentBoard } from './state.js';
import { escapeHtml, formatStatus } from './utils.js';
import { attachDragDropListeners } from './dragDrop.js';

export function renderTasks() {
  const board = getCurrentBoard();
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

  tasksGrid.innerHTML = board.tasks.map(task => {
    const canEdit = task.status === 'todo' || task.status === 'in-progress';
    return `
      <div class="task-card priority-${task.priority}" draggable="true" data-task-id="${task.id}">
        <h4>${escapeHtml(task.title)}</h4>
        <div class="task-meta">
          <span class="task-badge priority-badge">Priority: ${task.priority}</span>
          <span class="task-badge status-badge status-${task.status}">
            ${formatStatus(task.status)}
          </span>
        </div>
        <div class="task-description-container">
          <p class="task-description" data-task-id="${task.id}">${escapeHtml(task.description)}</p>
          <textarea class="task-description-edit" data-task-id="${task.id}" style="display: none;">${escapeHtml(task.description)}</textarea>
        </div>
        <div class="task-actions">
          ${canEdit ? `<button class="btn btn-secondary btn-small edit-task-btn" data-task-id="${task.id}">Edit</button>` : ''}
          <button class="btn btn-success btn-small save-task-btn" data-task-id="${task.id}" style="display: none;">Save</button>
          <button class="btn btn-secondary btn-small cancel-edit-btn" data-task-id="${task.id}" style="display: none;">Cancel</button>
          <button class="btn btn-danger btn-small delete-task-btn" data-task-id="${task.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Attach drag and drop listeners
  attachDragDropListeners();
}
