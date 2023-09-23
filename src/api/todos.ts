import { TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=11524
