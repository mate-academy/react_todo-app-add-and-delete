import React from 'react';
import { Todo } from '../types/Todo';

interface TodoTitleProps {
  todo: Todo;
  onDelete: (id: number) => void;
}

export const TodoTitle: React.FC<TodoTitleProps> = ({ todo, onDelete }) => {
  return (
    <>
      <span data-cy="TodoTitle" className="todo__title">
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
};
