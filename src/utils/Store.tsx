import React, { createContext, useState, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { IsActiveError } from '../types/types';

interface Children {
  children: React.ReactNode;
}

interface TodosContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodosContext = createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
});

export const TodosProvider: React.FC<Children> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const value = useMemo(() => ({ todos, setTodos }), [todos]);

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

interface TempTodoContextType {
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const TempTodoContext = createContext<TempTodoContextType>({
  tempTodo: null,
  setTempTodo: () => {},
});

export const TempTodoProvider: React.FC<Children> = ({ children }) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const value = useMemo(() => {
    return { tempTodo, setTempTodo };
  }, [tempTodo]);

  return (
    <TempTodoContext.Provider value={value}>
      {children}
    </TempTodoContext.Provider>
  );
};

interface ErrorContextType {
  isError: IsActiveError;
  setIsError: React.Dispatch<React.SetStateAction<IsActiveError>>;
}

export const ErrorContext = createContext<ErrorContextType>({
  isError: IsActiveError.NoError,
  setIsError: () => {},
});

export const ErrorProvider: React.FC<Children> = ({ children }) => {
  const [isError, setIsError] = useState(IsActiveError.NoError);

  const value = useMemo(() => {
    return {
      isError,
      setIsError,
    };
  }, [isError]);

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

interface IsClearingContextType {
  isClearing: boolean;
  setIsClearing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const isClearingContext = createContext<IsClearingContextType>({
  isClearing: false,
  setIsClearing: () => {},
});

export const IsClearingProvider: React.FC<Children> = ({ children }) => {
  const [isClearing, setIsClearing] = useState(false);

  const value = React.useMemo(() => {
    return {
      isClearing,
      setIsClearing,
    };
  }, [isClearing]);

  return (
    <isClearingContext.Provider value={value}>
      {children}
    </isClearingContext.Provider>
  );
};

interface IsUpdatingContexType {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const isUpdatingContext = createContext<IsUpdatingContexType>({
  isUpdating: false,
  setIsUpdating: () => {},
});

export const IsUpdatingProvider: React.FC<Children> = ({ children }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const value = useMemo(() => {
    return {
      isUpdating,
      setIsUpdating,
    };
  }, [isUpdating, setIsUpdating]);

  return (
    <isUpdatingContext.Provider value={value}>
      {children}
    </isUpdatingContext.Provider>
  );
};
