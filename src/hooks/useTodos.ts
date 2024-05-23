import { useState, useEffect, SetStateAction, Dispatch, useRef } from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';

export type UseTodos = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: (error: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  loadingIds: number[];
  setLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const useTodos = (): UseTodos => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setErrorMessage('');
        timeoutRef.current = null;
      }, 3000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      return;
    }
  }, [errorMessage]);

  return {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    loadingIds,
    setLoadingIds,
  };
};
