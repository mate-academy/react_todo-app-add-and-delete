import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  deleteId: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, deleteId }) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: isCompleted })}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={(event) => {
            setIsCompleted(event.target.checked);
          }}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => !isLoading && deleteId(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
