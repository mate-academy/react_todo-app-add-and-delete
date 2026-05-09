import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onRemove: (id: number) => void;
  loading?: boolean;
};

export const RemoveTodo: React.FC<Props> = ({ todo, onRemove }) => {
  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onRemove(todo.id)}
      disabled={todo.loading}
    >
      ×
    </button>
  );
};
