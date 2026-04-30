// Drag and Drop functionality
import { state, getCurrentBoard } from './state.js';
import { updateTaskPositions } from './dataService.js';
import { renderTasks } from './taskRenderer.js';
import { loadData } from './dataService.js';

let draggedElement = null;

export function attachDragDropListeners() {
  const taskCards = document.querySelectorAll('.task-card');
  
  taskCards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  
  // Remove all drag-over classes
  document.querySelectorAll('.task-card').forEach(card => {
    card.classList.remove('drag-over');
  });
  
  draggedElement = null;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = 'move';
  
  if (this !== draggedElement) {
    this.classList.add('drag-over');
  }
  
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

async function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedElement !== this) {
    // Get the board
    const board = getCurrentBoard();
    if (!board) return;
    
    // Get the IDs
    const draggedId = draggedElement.dataset.taskId;
    const targetId = this.dataset.taskId;
    
    // Find indices
    const draggedIndex = board.tasks.findIndex(t => t.id === draggedId);
    const targetIndex = board.tasks.findIndex(t => t.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Reorder the tasks array
      const [removed] = board.tasks.splice(draggedIndex, 1);
      board.tasks.splice(targetIndex, 0, removed);
      
      // Update positions in database
      const taskPositions = board.tasks.map((task, index) => ({
        id: task.id,
        position: index
      }));
      
      try {
        await updateTaskPositions(taskPositions);
        renderTasks();
      } catch (error) {
        console.error('Error updating task positions:', error);
        // Reload data on error
        await loadData();
        renderTasks();
      }
    }
  }
  
  this.classList.remove('drag-over');
  return false;
}
