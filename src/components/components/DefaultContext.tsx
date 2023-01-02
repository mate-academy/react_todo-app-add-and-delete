import React, {
  useCallback, useContext, useMemo, useState,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { ErrorContext } from './ErrorNotification/ErrorContext';

interface DefaultContextType {
  todosFromServer: Todo[],
  setTodosFromServer: (todo: Todo[]) => void,

  removedTodosIds: number[],
  setRemovedTodosIds: (id: number[]) => void,

  removeTodo: (id: number) => void,
  clearCompletedTodos: () => void,
}

export const DefaultContext = React.createContext<DefaultContextType>({
  todosFromServer: [],
  setTodosFromServer: () => {},

  removedTodosIds: [],
  setRemovedTodosIds: () => {},

  removeTodo: () => {},
  clearCompletedTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const DefaultProvider = ({ children }: Props) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [removedTodosIds, setRemovedTodosIds] = useState<number[]>([]);

  const { setError } = useContext(ErrorContext);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setRemovedTodosIds([todoId]);
      await deleteTodo(todoId);

      setTodosFromServer([
        ...todosFromServer.filter(toDo => toDo.id !== todoId),
      ]);
    } catch {
      setError(Errors.DELETE);
    } finally {
      setRemovedTodosIds([]);
    }
  }, [todosFromServer]);

  const clearCompletedTodos = useCallback(
    async () => {
      try {
        const completedTodosIds = todosFromServer
          .filter(todo => todo.completed)
          .map(todo => todo.id);

        setRemovedTodosIds(completedTodosIds);

        await Promise.all(completedTodosIds.map(id => deleteTodo(id)));

        setTodosFromServer(todosFromServer.filter(todo => !todo.completed));
      } catch {
        setError(Errors.DELETE_COMPLETED);
      } finally {
        setRemovedTodosIds([]);
      }
    }, [todosFromServer],
  );

  const contextValues = useMemo(() => (
    {
      todosFromServer,
      setTodosFromServer,
      removedTodosIds,
      setRemovedTodosIds,
      removeTodo,
      clearCompletedTodos,
    }
  ), [removedTodosIds, todosFromServer]);

  return (
    <DefaultContext.Provider value={contextValues}>
      {children}
    </DefaultContext.Provider>
  );
};
