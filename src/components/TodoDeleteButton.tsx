import React from 'react';

interface Props {
  onDelete: () => void;
  isLoading?: boolean;
}

export const TodoDeleteButton: React.FC<Props> = ({ onDelete, isLoading }) => {
  const className = `todo__remove${isLoading ? ' is-loading' : ''}`;

  return (
    <button
      aria-label="Delete todo"
      className={className}
      data-cy="TodoDelete"
      onClick={onDelete}
      type="button"
    >
      ×
    </button>
  );
};
