import { Todo } from '../types/Todo';

export function checkAllStatuses(todos: Todo[]) {
  const statusesIsSame = todos.every((todo) => todo.completed === true)
  || todos.every((todo) => todo.completed === false);

  return statusesIsSame;
}

export function returnStatus(todos: Todo[]) {
  const someTodo = todos.find(todo => todo.completed === true
      || todo.completed === false) as Todo;

  return someTodo.completed;
}
