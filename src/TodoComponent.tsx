import React from 'react';
import clasnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
};

export const TodoComponent:React.FC<Props> = ({
  todo,
  loadingTodoId,
  onDelete,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  return (
    <div
      className={clasnames('todo', {
        completed: todo.completed,
      })}
    >
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
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={clasnames('modal overlay', {
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
