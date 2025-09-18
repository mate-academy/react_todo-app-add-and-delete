/* eslint-disable @typescript-eslint/no-shadow */
import { Todo } from '../types/Todo';

export const USER_ID = 3348;
const BASE_URL = 'https://mate.academy/students-api';
const API_URL = `${BASE_URL}/todos`;

export const getTodos = async (USER_ID: number): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}?userId=${USER_ID}`);

  if (!response.ok) {
    throw new Error('Failed to load todos');
  }

  return response.json();
};

export const addTodo = async (todoData: {
  userId: number;
  title: string;
  completed: boolean;
}): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  return response.json();
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${todoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const updateTodo = async (
  todoId: number,
  updateTodo: Omit<Todo, 'id'>,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateTodo),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return response.json();
};
