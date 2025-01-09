import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2050;

const BASE_URL = 'https://mate.academy/students-api';

export const getTodos = async () => {
  const response = await fetch(`${BASE_URL}/todos?userId=${USER_ID}`);

  if (!response.ok) {
    throw new Error('Unable to fetch todos');
  }

  return response.json();
};

// Add more methods here
