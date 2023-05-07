import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo
  deletedId: number | null
  onDelete: (todoId: number) => void
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete, deletedId }) => {
  return (
    <div
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={`modal overlay ${todo.id === 0 || deletedId === todo.id ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
