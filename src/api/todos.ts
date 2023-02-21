import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// https://mate.academy/students-api/todos?userId=6383

// export const getCompleted = (userId: number) => {
//   return getTodos(userId)
//     .then(todos => todos.filter(todo => todo.completed));
// };

// export const getActive = (userId: number) => {
//   return getTodos(userId)
//     .then(todos => todos.filter(todo => !todo.completed));
// };

export const createTodo = (newTodo: unknown, userId: number): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
