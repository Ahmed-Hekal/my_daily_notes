// Board CRUD operations
import { addBoard, removeBoard } from './state.js';
import { createBoard as dbCreateBoard, deleteBoard as dbDeleteBoard } from './dataService.js';
import { renderBoards, showBoardsList } from './boardRenderer.js';
import { closeCreateBoardModal } from './modals.js';
import { generateId } from './utils.js';

export async function createBoard(event) {
  event.preventDefault();
  
  const title = document.getElementById('boardTitle').value.trim();
  
  if (title) {
    const id = generateId();
    
    try {
      const newBoard = await dbCreateBoard(id, title);
      addBoard(newBoard);
      renderBoards();
      closeCreateBoardModal();
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board');
    }
  }
}

export async function deleteCurrentBoard(currentBoardId) {
  if (confirm('Are you sure you want to delete this board and all its tasks?')) {
    try {
      await dbDeleteBoard(currentBoardId);
      removeBoard(currentBoardId);
      showBoardsList();
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Failed to delete board');
    }
  }
}
