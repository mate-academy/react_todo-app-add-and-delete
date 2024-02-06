import React, { useContext, useMemo } from 'react';
import { TodosContext } from '../context/TodosContext';
import { removeTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';

export const ClearButton: React.FC = () => {
  const {
    todos,
    setTodos,
    setDeletingTodos,
    setError,
  } = useContext(TodosContext);
  const areCompletedExist = todos.filter(todo => todo.completed).length > 0;

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = () => {
    completedTodos.forEach(({ id }) => {
      setDeletingTodos(prevDeleting => [...prevDeleting, id]);
      removeTodo(id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setError(ErrorType.Delete);
        })
        .finally(() => {
          setDeletingTodos(prevDeleting => (
            prevDeleting.filter(todo_id => todo_id !== id)));
        });
    });
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleClearCompleted}
      disabled={!areCompletedExist}
    >
      Clear completed
    </button>
  );
};
