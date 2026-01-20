import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

export const USER_ID = 3825;

export const getTodos = (): Promise<Todo[]> => {
  return fetch(`${BASE_URL}/todos?userId=${USER_ID}`).then(async response => {
    if (!response.ok) {
      throw new Error('Failed to load todos');
    }

    return response.json();
  });
};

export const createTodo = (
  todo: Omit<Todo, 'id' | 'userId'> & { title: string; completed: boolean },
): Promise<Todo> => {
  // Always use hardcoded USER_ID
  const todoWithUser = { ...todo, userId: USER_ID };

  return fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify(todoWithUser),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }).then(async response => {
    if (!response.ok) {
      let errorMsg = 'Failed to create todo';

      try {
        const errorData = await response.json();

        errorMsg += ': ' + (errorData.message || JSON.stringify(errorData));
        // eslint-disable-next-line no-console
        console.error('API error:', errorData);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('API error (non-JSON):', e);
      }

      throw new Error(errorMsg);
    }

    const data = await response.json();

    // eslint-disable-next-line no-console
    console.log('API createTodo response:', data);

    return data;
  });
};

export const deleteTodo = (id: number): Promise<void> => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    // Mate API returns { message: ... }
    return;
  });
};

export const updateTodo = (
  id: number,
  data: Partial<Omit<Todo, 'id'>>,
): Promise<Todo> => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }).then(async response => {
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    return response.json();
  });
};
