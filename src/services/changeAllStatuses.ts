import { Todo } from '../types/Todo';

export function changeAllStatuses(todos: Todo[], setNewStatus: boolean) {
  const todosCompleted = todos.map(todo => {
    return { ...todo, completed: setNewStatus };
  });

  return todosCompleted;
}
