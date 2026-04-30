// Modal management functions

export function showCreateBoardModal() {
  document.getElementById('createBoardModal').classList.add('active');
}

export function closeCreateBoardModal() {
  document.getElementById('createBoardModal').classList.remove('active');
  document.getElementById('boardTitle').value = '';
}

export function showCreateTaskModal() {
  document.getElementById('createTaskModal').classList.add('active');
}

export function closeCreateTaskModal() {
  document.getElementById('createTaskModal').classList.remove('active');
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskStatus').value = 'todo';
  document.getElementById('taskDescription').value = '';
}
