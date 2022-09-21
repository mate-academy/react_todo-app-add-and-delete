import { Dispatch, SetStateAction } from 'react';
import { IsProcessedMethod, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoStatus } from '../types/TodoStatus';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (todoId: number, data: {}) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const getFilteredTodos = (todosList: Todo[], todoFilter: string) => {
  return todosList.filter(todo => {
    switch (todoFilter) {
      case TodoStatus.ACTIVE:
        return !todo.completed;

      case TodoStatus.COMPLETED:
        return todo.completed;

      default:
      case TodoStatus.ALL:
        return todo;
    }
  });
};

export const handleIsProcessed = (
  method: IsProcessedMethod,
  todoId: number,
  setIsProcessed: Dispatch<SetStateAction<number[]>>,
) => {
  switch (method) {
    case 'ADD':
      setIsProcessed(current => [...current, todoId]);
      break;

    case 'DELETE':
      setIsProcessed(
        current => current.filter(id => id !== todoId),
      );
      break;

    default:
      break;
  }
};
