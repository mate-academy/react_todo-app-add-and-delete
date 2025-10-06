import { Todo } from './types/Todo';

const BASE_URL = 'https://mate.academy/students-api/todos';

export const getTodos = async (userId: number): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Unable to load todos');
  }

  return response.json();
};

export const createTodo = async (
  title: string,
  userId: number,
): Promise<Todo> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, userId, completed: false }),
  });

  if (!response.ok) {
    throw new Error('Unable to add a todo');
  }

  return response.json();
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${todoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete a todo');
  }
};

export const updateTodo = async (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Unable to update a todo');
  }

  return response.json();
};
