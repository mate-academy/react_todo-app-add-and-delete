import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => (
  client.get<Todo[]>(`/todos?userId=${userId}`)
);

export const addTodo = (todo: Todo) => (
  client.post<Todo>('/todos', todo)
);
