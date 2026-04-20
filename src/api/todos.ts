import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const USER_ID = 3716;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const patchTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchAllTodos = (todos: Todo[]) => {
  const completedTodos = !todos.every(todo => todo.completed);
  const alteredTodos = Promise.all([
    ...todos.map(todo =>
      client.patch<Todo>(`/todos/${todo.id}`, {
        ...todo,
        completed: completedTodos,
      }),
    ),
  ]);

  return alteredTodos;
};

export const deleteCompletedTodos = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const deletedTodos = Promise.allSettled([
    ...completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
  ]);

  return deletedTodos;
};
