import React from 'react';

type Props = {
  onDelete: () => void;
};

export const TodoDeleteButton: React.FC<Props> = ({ onDelete }) => {
  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={onDelete}
    >
      ×
    </button>
  );
};
