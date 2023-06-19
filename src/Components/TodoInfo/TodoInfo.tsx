import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo,
  onError: (isError: Error) => void,
  removeTodo: (todoId: number) => void,
  todoIdUpdate: number[],
  handleChange: (todoId: Todo) => Promise<void>
};

export const TodoInfo: React.FC<Props> = ({
  todo, onError, removeTodo, todoIdUpdate, handleChange,
}) => {
  const { id, title, completed } = todo;

  return (
    <li
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => handleChange(todo)}
          defaultChecked
        />
      </label>

      <span
        className="todo__title"
        onDoubleClick={() => onError(Error.UPDATE)}
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onError(Error.DELETE);
          removeTodo(id);
        }}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': todoIdUpdate.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader is-loading" />
      </div>
    </li>
  );
};
