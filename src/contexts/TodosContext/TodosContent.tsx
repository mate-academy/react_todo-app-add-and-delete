import { createContext } from 'react';
import { Todo } from '../../types/Todo';

export const TodosContext = createContext<{
  todos: Todo[],
  waitingForResponseTodosId: number[];
  removeTodo:(todoId: number) => Promise<void>,
}>({
      todos: [],
      waitingForResponseTodosId: [],
      removeTodo: async () => {},
    });
