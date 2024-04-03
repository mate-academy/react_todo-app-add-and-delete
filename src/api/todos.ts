import { addTodo, deleteTodo, getTodos } from '../client/client';
import { Todo } from '../types/Todo';

export const USER_ID = 377;

export const getTodosByUserId = () => {
  return getTodos<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodoById = (todoId: number) => {
  return deleteTodo<Todo[]>(`/todos/${todoId}`);
};

export const addNewTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return addTodo<Todo>(`/todos`, { title, userId, completed });
};
