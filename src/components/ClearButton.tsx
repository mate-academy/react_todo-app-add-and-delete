import React, { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const ClearButton: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const areCompletedExist = todos.filter(todo => todo.completed).length > 0;

  const handleClearCompleted = () => {
    const modifiedTodos = todos.filter(todo => !todo.completed);

    setTodos(modifiedTodos);
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
