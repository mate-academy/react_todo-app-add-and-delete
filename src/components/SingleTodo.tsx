import { FC } from 'react';
import { Todo } from '../types';

type Props = {
  todo: Todo,
};

export const SingleTodo: FC<Props> = ({ todo }) => (
  <>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    {/* Remove button appears only on hover */}
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
    >
      ×
    </button>

    {/* overlay will cover the todo while it is being updated */}
    <div data-cy="TodoLoader" className="modal overlay">
      <div
        className="modal-background has-background-white-ter"
      />
      <div className="loader" />
    </div>
  </>
);
