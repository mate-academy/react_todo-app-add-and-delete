import React, { useContext } from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const ClearButton: React.FC = () => {
  const { completedTodos, deleteTodo } = useContext(TodosContext);

  const clearCompletedTodos = () => {
    completedTodos.forEach(todo => deleteTodo && deleteTodo(todo.id));
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      style={{ visibility: completedTodos.length > 0 ? 'visible' : 'hidden' }}
      onClick={clearCompletedTodos}
    >
      Clear completed
    </button>
  );
};
