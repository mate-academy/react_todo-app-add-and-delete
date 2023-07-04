import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loadingTodos,
  deleteTodo,
}) => {
  const {
    id, title, completed,
  } = todo;

  const handleDeleteButton = () => {
    deleteTodo(id);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteButton}
      >
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
