import { Todo } from '../types/TodoProps';
import { client } from '../utils/fetchClient';

export const USER_ID = 3128;
export const getUser = USER_ID;

const TODOS_ENDPOINT = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_ENDPOINT}?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id' | 'userId'>) =>
  client.post<Todo>(TODOS_ENDPOINT, { ...todo, userId: USER_ID });

export const updateTodo = (todo: Todo) =>
  client.patch<Todo>(`${TODOS_ENDPOINT}/${todo.id}`, {
    ...todo,
    userId: USER_ID,
  });

export const deleteTodo = (id: number) =>
  client.delete(`${TODOS_ENDPOINT}/${id}`);

export const toggleAllTodos = (todos: Todo[], completed: boolean) =>
  Promise.all(
    todos.map(todo =>
      client.patch(`${TODOS_ENDPOINT}/${todo.id}`, {
        ...todo,
        completed,
        userId: USER_ID,
      }),
    ),
  );

export const clearCompletedTodos = (todos: Todo[]) =>
  Promise.all(
    todos
      .filter(todo => todo.completed)
      .map(todo => client.delete(`${TODOS_ENDPOINT}/${todo.id}`)),
  );
