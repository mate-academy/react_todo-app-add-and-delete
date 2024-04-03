import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 397;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function postTodo(title: string) {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

// export function updateTodo(title: string) {
//   return client.patch<Todo>('/todos', {
//     title,
//     completed: false,
//     userId: USER_ID,
//   });
// }

// Add more methods here
