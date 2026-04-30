// Task editing functionality
import { getCurrentBoard, updateTaskInCurrentBoard } from './state.js';
import { updateTaskDescription } from './dataService.js';
import { renderTasks } from './taskRenderer.js';

export function enableEditMode(taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  
  // Disable dragging while editing
  card.setAttribute('draggable', 'false');
  card.classList.add('editing');
  
  // Hide description paragraph and show textarea
  const descriptionP = card.querySelector('.task-description');
  const descriptionTextarea = card.querySelector('.task-description-edit');
  descriptionP.style.display = 'none';
  descriptionTextarea.style.display = 'block';
  descriptionTextarea.focus();
  
  // Toggle buttons
  const editBtn = card.querySelector('.edit-task-btn');
  const saveBtn = card.querySelector('.save-task-btn');
  const cancelBtn = card.querySelector('.cancel-edit-btn');
  const deleteBtn = card.querySelector('.delete-task-btn');
  
  if (editBtn) editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-block';
  cancelBtn.style.display = 'inline-block';
  deleteBtn.style.display = 'none';
}

export async function saveTaskDescription(taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  
  const descriptionTextarea = card.querySelector('.task-description-edit');
  const newDescription = descriptionTextarea.value.trim();
  
  if (!newDescription) {
    alert('Description cannot be empty');
    return;
  }
  
  try {
    await updateTaskDescription(taskId, newDescription);
    
    // Update local data
    updateTaskInCurrentBoard(taskId, { description: newDescription });
    
    // Re-render tasks
    renderTasks();
  } catch (error) {
    console.error('Error updating task description:', error);
    alert('Failed to update task description');
  }
}

export function cancelEditMode(taskId) {
  const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (!card) return;
  
  // Get original description
  const board = getCurrentBoard();
  if (board) {
    const task = board.tasks.find(t => t.id === taskId);
    if (task) {
      const descriptionTextarea = card.querySelector('.task-description-edit');
      descriptionTextarea.value = task.description;
    }
  }
  
  // Enable dragging
  card.setAttribute('draggable', 'true');
  card.classList.remove('editing');
  
  // Hide textarea and show description paragraph
  const descriptionP = card.querySelector('.task-description');
  const descriptionTextarea = card.querySelector('.task-description-edit');
  descriptionP.style.display = 'block';
  descriptionTextarea.style.display = 'none';
  
  // Toggle buttons
  const editBtn = card.querySelector('.edit-task-btn');
  const saveBtn = card.querySelector('.save-task-btn');
  const cancelBtn = card.querySelector('.cancel-edit-btn');
  const deleteBtn = card.querySelector('.delete-task-btn');
  
  if (editBtn) editBtn.style.display = 'inline-block';
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
  deleteBtn.style.display = 'inline-block';
}
