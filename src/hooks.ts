import { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types';

export const useGetTodos = (USER_ID: number, tempTodo: Todo | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isTodoDeleted, setIsTodoDeleted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchTodos() {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch (error) {
        setErrorMessage('Unable to load a todo');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
    setIsTodoDeleted(false);
  }, [isTodoDeleted, tempTodo]);

  const todosNotCompleted = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos, isTodoDeleted]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleIsTodoDeleted = (value: boolean) => {
    setIsTodoDeleted(value);
  };

  return {
    isLoading,
    todos,
    errorMessage,
    todosNotCompleted,
    handleError,
    handleIsTodoDeleted,
  };
};
