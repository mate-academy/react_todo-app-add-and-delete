import { useEffect, useState } from 'react';
import { TodoType } from '../types/Todo';
import { getTodos } from '../api/todos';

export const useTodos = (userId?: number) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState('');

  const showError = (errorMsg: string) => {
    setError(errorMsg);

    setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then(data => setTodos(data))
        .catch(() => showError('Unable to load todos'));
    }
  }, [userId]);

  return {
    todos,
    error,
    showError,
  };
};
