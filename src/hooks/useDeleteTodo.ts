import { Dispatch, RefObject, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  filteredTodos: Todo[];
  inputRef: RefObject<HTMLInputElement>;

  onSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onSetError: (error: ErrorMessages) => void;
  onSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useDeleteTodos = ({
  filteredTodos,
  inputRef,

  onSetPreparedTodos,
  onSetError,
  onSetTodoIdLoading,
}: Props) => {
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const handleDeleteTodos = async (id: number) => {
    try {
      onSetTodoIdLoading([id]);
      await deleteTodos(id);
      onSetPreparedTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      onSetError(ErrorMessages.Delete);
      setTimeout(() => {
        onSetError(ErrorMessages.WithoutError);
      }, 3000);
    } finally {
      onSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    onSetTodoIdLoading(completedIds);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      onSetPreparedTodos(prev =>
        prev.filter(todo => !successfulIds.includes(todo.id)),
      );

      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        onSetError(ErrorMessages.Delete);
        setTimeout(() => onSetError(ErrorMessages.WithoutError), 3000);
      }
    } finally {
      onSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  return { handleDeleteTodos, handleDeleteAllCompletedTodos };
};
