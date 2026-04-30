// Database service wrapper
import { setBoards } from './state.js';

export async function loadData() {
  try {
    const boards = await window.db.getAllBoards();
    setBoards(boards);
    return boards;
  } catch (error) {
    console.error('Error loading data:', error);
    setBoards([]);
    return [];
  }
}

export async function createBoard(id, title) {
  return await window.db.createBoard(id, title);
}

export async function deleteBoard(id) {
  await window.db.deleteBoard(id);
}

export async function createTask(id, boardId, title, priority, status, description) {
  return await window.db.createTask(id, boardId, title, priority, status, description);
}

export async function deleteTask(id) {
  await window.db.deleteTask(id);
}

export async function updateTaskPositions(taskPositions) {
  await window.db.updateTaskPositions(taskPositions);
}

export async function updateTaskDescription(taskId, description) {
  await window.db.updateTaskDescription(taskId, description);
}
