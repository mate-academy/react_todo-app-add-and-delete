import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  const todo = await client.get<Todo[]>(`/todos?userId=${userId}`);

  return todo || null;
};

type TodoData = Pick<Todo, 'userId' | 'title' | 'completed'>;

export const createTodos = async (
  {
    userId,
    title,
    completed,
  }: TodoData,
) => {
  return client.post<Todo[]>('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodos = async (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const UpdateTodo = async (todo:Todo, completed:boolean) => {
  return client.patch(`/todos/${todo.id}`, { completed });
};

export const EditTodo = async (todo:Todo, title:string) => {
  return client.patch(`/todos/${todo.id}`, { title });
};
// Add more methods here
