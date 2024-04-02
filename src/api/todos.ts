import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 353;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const creatTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post(`/todos`, newTodo);
};

// export function updateTodoById = (todo: Todo) => {
//   return client.patch(`/todos/${todo.id}`)
// }

// Add more methods here
