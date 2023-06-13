import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoInfoProps {
  todo: Todo,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  todo, deleteTodo, deleteTodoId,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className={`modal overlay ${(!id || deleteTodoId === id) && ('is-active')}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
