import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11528;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodos(userId: number) {
  return client.delete(`/todos/${userId}`);
}

export function addTodos({ title }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
}

export const updateTodo = ({
  id, title, completed, userId,
}: Todo) => {
  return client.patch(`/todos/${id}`, {
    title, completed, userId,
  });
};
