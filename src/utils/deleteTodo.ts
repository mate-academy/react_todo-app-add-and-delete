export async function deleteTodo(todoId: number) {
  try {
    await deleteTodos(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  } catch {
    setErrorMessage(Errors.deleteError);
  }
}

export function deleteAllTodos() {
  const completedTodosId: number[] = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  for (const todoId of completedTodosId) {
    deleteTodo(todoId);
  }
}
