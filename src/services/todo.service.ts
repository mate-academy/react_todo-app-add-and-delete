import { Todo, TodoListFilterStatus } from '../types/Todo';

interface IOptions {
  filterStatus: TodoListFilterStatus,
}

export interface ITodosStatistics {
  totalTodos: number,
  activeTodos: number,
  completedTodos: number,
}

export const getFilteredTodos = (todos: Todo[], options: IOptions) => {
  return todos.filter(todo => {
    switch (options.filterStatus) {
      case TodoListFilterStatus.Active:
        return !todo.completed;

      case TodoListFilterStatus.Completed:
        return todo.completed;

      case TodoListFilterStatus.All:
      default:
        return true;
    }
  });
};

export const getTodosStatistics = (todos: Todo[]) => {
  const totalTodos = todos.length;
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return {
    totalTodos,
    activeTodos,
    completedTodos,
  };
};
