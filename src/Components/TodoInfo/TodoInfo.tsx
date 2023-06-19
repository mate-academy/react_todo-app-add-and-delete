import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo,
  onError: (isError: Error) => void,
  removeTodo: (todoId: number) => void,
  todoIdUpdate: number[]
};

export const TodoInfo: React.FC<Props> = ({
  todo, onError, removeTodo, todoIdUpdate,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const { id, title } = todo;

  return (
    <li
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
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
        <div className="loader" />
      </div>
    </li>
  );
};
