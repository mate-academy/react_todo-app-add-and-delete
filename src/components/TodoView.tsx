import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export const TodoView: React.FC<Props> = ({ todo, onDelete, onEdit }) => (
  <>
    <span data-cy="TodoTitle" className="todo__title" onDoubleClick={onEdit}>
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>
  </>
);
