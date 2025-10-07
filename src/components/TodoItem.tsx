/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../types/Todo';

type PropsItem = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  selectedIds: number[];
  isTemp?: boolean;
};

export const TodoItem: React.FC<PropsItem> = ({
  todo,
  onDelete,
  selectedIds,
  isTemp = false,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
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

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': selectedIds.includes(todo.id) || isTemp,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
