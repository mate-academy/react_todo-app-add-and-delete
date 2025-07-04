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
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={onClearCompleted}
      disabled={isDisabled}
    >
      Clear completed
    </button>
  );
};
