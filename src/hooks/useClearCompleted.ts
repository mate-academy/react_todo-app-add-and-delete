import { useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import { useTodos } from '../utils/TodoContext';
import { deleteTodo as deleteTodoAPI } from '../api/todos';

export const useClearCompleted = () => {
  const { todos, setTodos, setClearCompletedError, triggerFocus } = useTodos();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleClearCompleted = async () => {
    setIsDeleting(true);
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodoAPI(todo.id));

    const results = await Promise.allSettled(deletePromises);

    const successfulDeletes = results
      .map((result, index) =>
        result.status === 'fulfilled' ? completedTodos[index].id : null,
      )
      .filter(id => id !== null) as number[];

    const failedDeletes = results
      .filter(result => result.status === 'rejected')
      .map(result => (result as PromiseRejectedResult).reason);

    if (successfulDeletes.length > 0) {
      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulDeletes.includes(todo.id)),
      );
      triggerFocus();
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
