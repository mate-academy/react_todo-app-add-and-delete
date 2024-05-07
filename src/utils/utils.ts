import { Filters } from '../types/Filters';
import { TodoType } from '../types/TodoType';

export const getFilteredTodos = (
  initialTodos: TodoType[],
  status: string,
): TodoType[] => {
  switch (status) {
    case Filters.All: {
      return initialTodos;
    }

    case Filters.Active: {
      return initialTodos.filter((todo: TodoType) => !todo.completed);
    }

    case Filters.Completed: {
      return initialTodos.filter((todo: TodoType) => todo.completed);
    }
  }

  return initialTodos;
};

export const normalizeTodoCount = (todosCount: number): string => {
  return todosCount <= 1 ? 'item' : 'items';
};
