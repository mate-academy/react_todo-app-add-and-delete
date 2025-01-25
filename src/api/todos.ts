import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = '2263';

type TodoId = {
  todoId: number;
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = () => {
  return client.post<Todo[]>(`/todos`);
};

export const deleteTodo = ({ todoId }: TodoId) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
