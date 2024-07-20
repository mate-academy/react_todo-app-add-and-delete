import { useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import { deleteTodo as deleteTodoAPI } from '../api/todos';
import { useTodos } from '../utils/TodoContext';
import { useInputFocus } from './useInputFocus';

type UseDeleteTodoProps = {
  deleteTodo: (id: number) => Promise<boolean>;
  error: ErrorType | null;
  isDeleting: boolean;
};

export const useDeleteTodo = (): UseDeleteTodoProps => {
  const { setTodos } = useTodos();
  const [error, setError] = useState<ErrorType | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { triggerFocus } = useInputFocus();

  const deleteTodoById = async (id: number): Promise<boolean> => {
    setIsDeleting(true);

    try {
      await deleteTodoAPI(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setIsDeleting(false);
      triggerFocus();

      return true;
    } catch (thrownError) {
      setError(ErrorType.UnableToDeleteTodo);
      setIsDeleting(false);
      triggerFocus();

      return false;
    }
  };

  return {
    deleteTodo: deleteTodoById,
    error,
    isDeleting,
  };
};
