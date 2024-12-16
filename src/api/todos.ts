import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2088;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const deleteArrOfTodos = async (arr: Todo[]) => {
  const deletion = await Promise.allSettled(
    arr.map(todo => deleteTodo(todo.id)),
  );

  return deletion;
};

export const addPost = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};
