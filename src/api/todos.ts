import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const updateTodo = (todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo)
    .catch(error => {
      throw error;
    });
};

export const createTodo = (newTodo: Partial<Todo>) => {
  return client.post<Todo>('/todos', newTodo)
    .catch(error => {
      throw error;
    });
};

export const deleteTodo = (url: string) => {
  return client.delete(url)
    .catch(error => {
      throw error;
    });
};

export const deleteAllCompleted = (todos: Todo[]): Promise<unknown[]> => {
  const promises = todos.reduce((prev, todo) => {
    if (todo.completed) {
      return [...prev, deleteTodo(`/todos/${todo.id}`)];
    }

    return prev;
  }, [] as Promise<unknown>[]);

  return Promise.all(promises);
};
