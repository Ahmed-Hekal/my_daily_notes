// Task CRUD operations
import { addTaskToCurrentBoard, removeTaskFromCurrentBoard, getCurrentBoard } from './state.js';
import { createTask as dbCreateTask, deleteTask as dbDeleteTask } from './dataService.js';
import { renderTasks } from './taskRenderer.js';
import { closeCreateTaskModal } from './modals.js';
import { generateId } from './utils.js';

export async function createTask(event, currentBoardId) {
  event.preventDefault();
  
  const board = getCurrentBoard();
  if (!board) return;
  
  const title = document.getElementById('taskTitle').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const status = document.getElementById('taskStatus').value;
  const description = document.getElementById('taskDescription').value.trim();
  
  if (title && description) {
    const id = generateId();
    
    try {
      const newTask = await dbCreateTask(id, currentBoardId, title, priority, status, description);
      addTaskToCurrentBoard(newTask);
      renderTasks();
      closeCreateTaskModal();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  }
}

export async function deleteTask(taskId) {
  const board = getCurrentBoard();
  if (!board) return;
  
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await dbDeleteTask(taskId);
      removeTaskFromCurrentBoard(taskId);
      renderTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  }
}
