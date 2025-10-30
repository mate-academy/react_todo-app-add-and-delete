import { Todo, TodoBase } from '../model/types';
import { client } from '../../../shared/api/fetchClient';

export const USER_ID = 777;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTodo: TodoBase) => {
  return client.post<Todo>(`/todos`, {
    ...newTodo,
  });
};

export const renameTodo = (id: number, newName: string) => {
  return client.patch(`/todos/${id}`, { title: newName });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed: !completed });
};

export const toggleAll = (todos: Todo[]) => {
  const allCompleted = todos.every(todo => todo.completed);

  return Promise.all(
    todos.map(todo => {
      return client.patch(`/todos/${todo.id}`, { completed: !allCompleted });
    }),
  );
};

export const deleteCompleted = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return Promise.all(
    completedTodos.map(todo => client.delete(`/todos/${todo.id}`)),
  );
};
