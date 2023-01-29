import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  deleteTodo,
  toggleTodo,
}) => {
  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleTodo(id)}
        />
      </label>
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
