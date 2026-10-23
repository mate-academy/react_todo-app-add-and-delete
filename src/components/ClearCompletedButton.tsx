import React from 'react';

interface ClearCompletedButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  disabled,
  onClick,
}) => (
  <button
    type="button"
    className="todoapp__clear-completed"
    data-cy="ClearCompletedButton"
    disabled={disabled}
    onClick={onClick}
  >
    Clear completed
  </button>
);
