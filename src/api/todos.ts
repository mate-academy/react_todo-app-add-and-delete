import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=10624 ctgdprzyb@gmail.com Kacper
// https://mate.academy/students-api/todos?userId=10625 c47g0d3@gmail.com catgode [LEAVE EMPTY]
