import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 474;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getTodosActive = () => {
  return client
    .get<Todo[]>(`/todos?userId=${USER_ID}`)
    .then(todos => todos.filter(todo => !todo.completed));
};

export const getTodosCompleted = () => {
  return client
    .get<Todo[]>(`/todos?userId=${USER_ID}`)
    .then(todos => todos.filter(todo => todo.completed));
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (currentId: number) => {
  return client.delete(`/todos/${currentId}/?userId=${USER_ID}`);
};

export const updateTodoCompleted = ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  return client.patch<Todo>(`/todos/${id}/?userId=${USER_ID}`, { completed });
};

export const updateTodoTitle = ({
  id,
  title,
}: {
  id: number;
  title: string;
}) => {
  return client.patch<Todo>(`/todos/${id}/?userId=${USER_ID}`, { title });
};
