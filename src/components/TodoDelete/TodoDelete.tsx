import React from 'react';

interface TodoDeleteProps {
  onDelete: () => void;
}

export const TodoDelete: React.FC<TodoDeleteProps> = ({ onDelete }) => {
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
