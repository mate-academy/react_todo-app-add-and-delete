import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`)
    .catch(() => {
      throw new Error('Unable to delete a todo');
    });
};
