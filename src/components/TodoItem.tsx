import classNames from 'classnames';
import React from 'react';

interface Props {
  title: string;
  completed: boolean;
  id: number;
  isLoading: boolean,
  deleteTodos: (id: number) => void,
}

export const TodoItem: React.FC<Props> = ({
  title, completed, id, isLoading = false, deleteTodos,
}) => {
  const handleDelete = (todoId: number) => {
    deleteTodos(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          defaultChecked={completed}
        />
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      </label>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay',
          { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
