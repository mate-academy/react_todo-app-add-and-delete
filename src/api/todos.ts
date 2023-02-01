import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoData = Pick<Todo, 'title' | 'userId' | 'completed'>;

const addTodo = ({ title, userId, completed }: TodoData) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

const deleteTodo = (id: number) => {
  return client.delete<number>(`/todos/${id}`)
    .then(Boolean);
};

export const todoApi = {
  getTodos,
  addTodo,
  deleteTodo,
};
