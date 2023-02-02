import React from 'react';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';

export const TodosContext = React.createContext<{
  setErrorsArgument:(arg: Error | null) => void;
  setTodos:(todos: Todo[] | null) => void;
  todos: Todo[] | null;
  setTodosList: () => void;
} | null>(null);

type Props = {
  children: React.ReactNode;
  setErrorsArgument: (arg: Error | null) => void;
  setTodos: (todos: Todo[] | null) => void;
  todos: Todo[] | null,
  setTodosList: () => void,
};

export const TodosProvider: React.FC<Props> = ({
  children,
  setErrorsArgument,
  setTodos,
  todos,
  setTodosList,
}) => {
  const providerValue = {
    setErrorsArgument,
    setTodos,
    todos,
    setTodosList,
  };

  return (
    <TodosContext.Provider value={providerValue}>
      {children}
    </TodosContext.Provider>
  );
};
