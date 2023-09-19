import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>('/todos?userId=11497');
};

export const setNewTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos?userId=11497', todo);
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=11497`);
};

export const deleteTodos = (todosId: number[]) => {
  return Promise
    .allSettled(
      [...todosId.map(todoId => client.delete(`/todos/${todoId}?userId=11497`))],
    );
};

// Add more methods here
