import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1198;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export function deleteTodo(todoId: string) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { userId, title, completed });
}

export function filtering(todos: Todo[], filter: Filter) {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
