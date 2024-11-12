import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1529;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (body: Omit<Todo, 'id'>) => {
  return client.post(`/todos`, body);
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};

interface UpdateTodoProps {
  id: Todo['id'];
  updatedFields: Partial<Omit<Todo, 'id' | 'userId'>>;
}

export const updateTodo = ({ id, updatedFields }: UpdateTodoProps) => {
  return client.patch(`/todos/${id}`, {
    ...updatedFields,
    userId: USER_ID,
  });
};
