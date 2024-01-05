import React from 'react';

interface Props {
  hasCompletedTodos: boolean,
  clearCompletedTodos: () => void;
}

export const ClearCompleted: React.FC<Props> = ({
  hasCompletedTodos,
  clearCompletedTodos,
}) => {
  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={() => clearCompletedTodos()}
      style={{ visibility: hasCompletedTodos ? 'visible' : 'hidden' }}
    >
      Clear completed
    </button>
  );
};
