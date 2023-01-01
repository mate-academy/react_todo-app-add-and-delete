import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// export const postTodo = (data: Todo) => {
//   return client.post('/todos', data);
// };

export const postTodo = (userId: number, title: string) => {
  return client.post('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
