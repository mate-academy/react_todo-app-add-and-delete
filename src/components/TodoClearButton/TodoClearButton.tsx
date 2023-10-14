import React from 'react';

type Props = {
  completed: boolean;
};

export const TodoClearButton: React.FC<Props> = ({ completed }) => {
  return (
    { completed } && (
      <button
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    )
  );
};
