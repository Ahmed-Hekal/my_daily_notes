// Event handlers
import { state } from './state.js';
import { showCreateBoardModal, closeCreateBoardModal, showCreateTaskModal, closeCreateTaskModal } from './modals.js';
import { showBoardsList, openBoard } from './boardRenderer.js';
import { createBoard, deleteCurrentBoard } from './boardActions.js';
import { createTask, deleteTask } from './taskActions.js';
import { enableEditMode, saveTaskDescription, cancelEditMode } from './taskEditor.js';

export function attachEventListeners() {
  // New Board button
  document.getElementById('newBoardBtn').addEventListener('click', showCreateBoardModal);
  
  // Back to boards button
  document.getElementById('backToBoardsBtn').addEventListener('click', showBoardsList);
  
  // New Task button
  document.getElementById('newTaskBtn').addEventListener('click', showCreateTaskModal);
  
  // Delete Board button
  document.getElementById('deleteBoardBtn').addEventListener('click', () => {
    deleteCurrentBoard(state.currentBoardId);
  });
  
  // Modal close buttons
  document.getElementById('closeBoardModalBtn').addEventListener('click', closeCreateBoardModal);
  document.getElementById('closeTaskModalBtn').addEventListener('click', closeCreateTaskModal);
  
  // Form submissions
  document.getElementById('createBoardForm').addEventListener('submit', createBoard);
  document.getElementById('createTaskForm').addEventListener('submit', (e) => {
    createTask(e, state.currentBoardId);
  });
  
  // Event delegation for dynamically created elements
  document.getElementById('boardsGrid').addEventListener('click', handleBoardClick);
  document.getElementById('tasksGrid').addEventListener('click', handleTaskClick);
}

function handleBoardClick(event) {
  const boardCard = event.target.closest('.board-card');
  if (boardCard) {
    const boardId = boardCard.dataset.boardId;
    openBoard(boardId);
  }
}

function handleTaskClick(event) {
  if (event.target.classList.contains('delete-task-btn')) {
    const taskId = event.target.dataset.taskId;
    deleteTask(taskId);
  } else if (event.target.classList.contains('edit-task-btn')) {
    const taskId = event.target.dataset.taskId;
    enableEditMode(taskId);
  } else if (event.target.classList.contains('save-task-btn')) {
    const taskId = event.target.dataset.taskId;
    saveTaskDescription(taskId);
  } else if (event.target.classList.contains('cancel-edit-btn')) {
    const taskId = event.target.dataset.taskId;
    cancelEditMode(taskId);
  }
}
