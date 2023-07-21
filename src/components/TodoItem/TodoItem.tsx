import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  onDeleteTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, completed, title },
  loading,
  onDeleteTodo,
}) => {
  const handleDeleteClick = () => {
    onDeleteTodo(id);
  };

  return (
    <li className={classNames('todo', { completed })}>
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
        onClick={handleDeleteClick}
        disabled={loading}
      >
        ×
      </button>

      {loading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
