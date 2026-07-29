/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  onRemove: (todoId: number) => void;
  todo: Todo;
  isLoading?: boolean;
};

export const TodoItem = ({ onRemove, todo, isLoading }: Props) => {
  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onRemove(todo.id)}
        disabled={isLoading}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', isLoading && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
