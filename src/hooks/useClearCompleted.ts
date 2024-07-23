import { useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import { useTodos } from '../utils/TodoContext';
import { deleteTodo as deleteTodoAPI } from '../api/todos';

export const useClearCompleted = () => {
  const { todos, setTodos, triggerFocus } = useTodos();
  const [error, setError] = useState<ErrorType | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleClearCompleted = async () => {
    setIsDeleting(true);
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodoAPI(todo.id));

    const results = await Promise.allSettled(deletePromises);

    const successfulDeletes = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    const failedDeletes = results.filter(
      result => result.status === 'rejected',
    );

    if (successfulDeletes.length > 0) {
      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulDeletes.includes(todo.id)),
      );
      triggerFocus();
    }

    if (failedDeletes.length > 0) {
      setError(ErrorType.UnableToDeleteTodo);
    }

    setIsDeleting(false);
  };

  return {
    handleClearCompleted,
    error,
    isDeleting,
  };
};
