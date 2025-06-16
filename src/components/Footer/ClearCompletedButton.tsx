import React from 'react';

type ClearCompletedButtonProps = {
  onClearCompleted: () => void;
  isDisabled: boolean;
};

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  onClearCompleted,
  isDisabled,
}) => {
  return (
    //this button should be disabled if there are no completed todos
    <button
      data-cy="ClearCompletedButton"
      className="clear-completed"
      onClick={onClearCompleted}
      disabled={isDisabled}
    >
      Clear completed
    </button>
  );
};
