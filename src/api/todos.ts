import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post('/todos', todo);

  return newTodo;
};

export const removeTodo = async (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = async (todoId: number, isChecked: boolean) => {
  const updatedTodo = await client.patch(`/todos/${todoId}`, { completed: isChecked });

  return updatedTodo;
};
