import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { ErrorType } from '../types/ErrorType';

export const useFetchTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorType.UnableToLoadTodos));
  }, []);

  return { todos, error, setError };
};
