import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Filter } from '../types/Filter';

export const USER_ID = 6657;
export const links = ['All', 'Active', 'Completed'];

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todo: {}) => {
  return client.post(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}`);

  // eslint-disable-next-line no-console
  console.log(userId);
};

export const filterTodos = (
  todos: Todo[],
  filterParam: Filter,
) => {
  const visibleTodos = filterParam !== Filter.All
    ? todos.filter(todo => {
      if (filterParam === Filter.Active) {
        return !todo.completed;
      }

      return todo.completed;
    })
    : todos;

  return visibleTodos;
};

export const countActiveTodos = (todos: Todo[]): number => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return activeTodos.length;
};

export const checkCompletedTodos = (todos: Todo[]): boolean => {
  return todos.some(todo => todo.completed);
};

export const deleteCompletedTodos = (todos: Todo[]): void => {
  for (let i = 0; i < todos.length; i += 1) {
    if (todos[i].completed) {
      deleteTodo(1, todos[i].id);
    }
  }
};
