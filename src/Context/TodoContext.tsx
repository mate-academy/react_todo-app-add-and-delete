import React, { useState, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface PropsTodoContext {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((todos:Todo[]) => Todo[])) => void;
  errorType: Errors | '';
  setErrorType: (error: Errors) => void;
  hasError: boolean;
  setHasError : (logic: boolean) => void
  loadingCompleted: boolean;
  setLoadingCompleted : (logic: boolean) => void,
  loadId: number[],
  setLoadId: (logic:number[]) => void
  tempTodo: Todo | null,
  setTempTodo: (todo:Todo | null) => void,
}

export const TodoContext = React.createContext<PropsTodoContext>({
  todos: [],
  setTodos: () => {},
  errorType: '',
  setErrorType: () => {},
  hasError: false,
  setHasError: () => {},
  loadingCompleted: false,
  setLoadingCompleted: () => {},
  loadId: [],
  setLoadId: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<Errors | ''>('');
  const [hasError, setHasError] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [loadId, setLoadId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const val = useMemo(() => ({
    todos,
    setTodos,
    errorType,
    setErrorType,
    hasError,
    setHasError,
    loadingCompleted,
    setLoadingCompleted,
    loadId,
    setLoadId,
    tempTodo,
    setTempTodo,
  }), [todos, errorType, hasError, loadingCompleted, loadId, tempTodo]);

  return (
    <TodoContext.Provider value={val}>
      {children}
    </TodoContext.Provider>
  );
};
