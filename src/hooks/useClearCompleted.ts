import { useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import { useTodos } from '../utils/TodoContext';
import { deleteTodo as deleteTodoAPI } from '../api/todos';

export const useClearCompleted = () => {
  const { todos, setTodos, setClearCompletedError } = useTodos();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleClearCompleted = async () => {
    setIsDeleting(true);
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodoAPI(todo.id));

    const results = await Promise.allSettled(deletePromises);

    const successfulDeletes = results.filter(
      result => result.status === 'fulfilled',
    );
    const failedDeletes = results.filter(
      result => result.status === 'rejected',
    );

    if (successfulDeletes.length > 0) {
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    }

    if (failedDeletes.length > 0) {
      setClearCompletedError(ErrorType.UnableToDeleteTodo);
    }

    setIsDeleting(false);
  };

  return {
    handleClearCompleted,
    isDeleting,
  };
};
