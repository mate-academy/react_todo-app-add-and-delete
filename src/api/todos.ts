import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Filter } from '../types/Filter';

export const USER_ID = 6657;
export const links = ['All', 'Active', 'Completed'];

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: Omit<Todo, 'id'>) => {
  return client.post(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const filterTodos = (
  todos: Todo[],
  filterParam: Filter,
) => {
  const visibleTodos = [...todos];

  switch (filterParam) {
    case Filter.Active:
      return visibleTodos.filter(todo => !todo.completed);
    case Filter.Completed:
      return visibleTodos.filter(todo => todo.completed);
    case Filter.All:
    default:
      return visibleTodos;
  }
};

export const countActiveTodos = (todos: Todo[]): number => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return activeTodos.length;
};

export const checkCompletedTodos = (todos: Todo[]): boolean => {
  return todos.some(todo => todo.completed);
};
