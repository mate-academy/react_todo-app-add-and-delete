import { FilterStatus, Todo } from '../types/Todo';

export const filterTodo = (todos: Todo[], filterStatus: FilterStatus) => {
  switch (filterStatus) {
    case FilterStatus.COMPLETED:
      return todos.filter(todo => todo.completed);
    case FilterStatus.ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

export const findTodoById = (todos: Todo[], id: number) => {
  return todos.find(todo => todo.id === id);
};

export const normalizeTodosLoading = (todos: Todo[]) => {
  return todos.map(todo => ({ ...todo, loading: false }));
};
