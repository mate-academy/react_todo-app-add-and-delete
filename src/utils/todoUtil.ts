import { Todo, TodoStatus } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: TodoStatus) => {
  switch (filterBy) {
    case TodoStatus.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case TodoStatus.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
