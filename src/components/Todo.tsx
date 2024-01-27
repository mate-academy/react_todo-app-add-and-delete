import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoProps = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  loader?: boolean;
};

export const TodoItem: React.FC<TodoProps> = ({ todo, deleteTodo, loader }) => {
  const { title, completed, id: Id } = todo;
  const [isLoader, setIsLoader] = useState(loader);

  const onDelete = (id: number) => {
    setIsLoader(true);
    deleteTodo(id)
      .catch((error) => {
        setIsLoader(false);
        throw error;
      })
      .then(() => setIsLoader(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', completed && 'completed')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(Id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', isLoader && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
