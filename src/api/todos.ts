import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1807;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const clearCompletedTodos = async () => {
  const todos = await getTodos();

  return todos.filter(todo => !todo.completed);
};

export const addTodo = async (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = async (id: number): Promise<void> => {
  await client.delete(`/todos/${id}`);
};
