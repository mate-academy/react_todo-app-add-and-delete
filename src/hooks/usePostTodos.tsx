import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import { postTodos, USER_ID } from '../api/todos';
import { useTodos } from '../utils/TodoContext';

type UsePostTodosProps = {
  tempTodo: Todo | null;
  postTodo: (title: string) => Promise<boolean>;
  error: ErrorType | null;
  clearError: () => void;
  isSubmitting: boolean;
};

export const usePostTodos = (): UsePostTodosProps => {
  const { setTodos, tempTodo, setTempTodo } = useTodos();
  const [error, setError] = useState<ErrorType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
    }
  }, [error]);

  const postTodo = async (title: string): Promise<boolean> => {
    if (title.trim() === '') {
      setError(ErrorType.TitleShouldNotBeEmpty);

      return false;
    }

    setIsSubmitting(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await postTodos(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);
      setIsSubmitting(false);

      return true;
    } catch (thrownError) {
      setError(ErrorType.UnableToAddTodo);
      setTempTodo(null);
      setIsSubmitting(false);

      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    tempTodo,
    postTodo,
    error,
    clearError,
    isSubmitting,
  };
};
