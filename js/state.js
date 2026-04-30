// Application state management
export const state = {
  boards: [],
  currentBoardId: null
};

export function setBoards(boards) {
  state.boards = boards;
}

export function setCurrentBoardId(id) {
  state.currentBoardId = id;
}

export function getCurrentBoard() {
  return state.boards.find(b => b.id === state.currentBoardId);
}

export function getBoardById(id) {
  return state.boards.find(b => b.id === id);
}

export function addBoard(board) {
  state.boards.push(board);
}

export function removeBoard(id) {
  state.boards = state.boards.filter(b => b.id !== id);
}

export function addTaskToCurrentBoard(task) {
  const board = getCurrentBoard();
  if (board) {
    board.tasks.push(task);
  }
}

export function removeTaskFromCurrentBoard(taskId) {
  const board = getCurrentBoard();
  if (board) {
    board.tasks = board.tasks.filter(t => t.id !== taskId);
  }
}

export function updateTaskInCurrentBoard(taskId, updates) {
  const board = getCurrentBoard();
  if (board) {
    const task = board.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
    }
  }
}
