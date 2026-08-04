import classNames from 'classnames';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import type { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete?: (todoId: number) => void;
};

export const TodoItem: FC<Props> = ({ todo, isProcessing, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <div className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-label={`Todo status: ${todo.title}`}
        readOnly
      />
    </div>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      aria-label={`Delete ${todo.title}`}
      disabled={!onDelete}
      onClick={() => onDelete?.(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isProcessing,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
};
