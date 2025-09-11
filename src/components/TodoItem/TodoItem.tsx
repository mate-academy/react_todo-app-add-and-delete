import { FC } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { memo } from 'react';

type Props = {
  todo: Todo;
  onDeleteTodo?: (id: number) => void;
  isTodoTemp?: boolean;
  isLoadingTodo: boolean;
};

const TodoItem: FC<Props> = ({
  todo,
  isTodoTemp,
  onDeleteTodo,
  isLoadingTodo,
}) => {
  const { title, completed } = todo;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            //eslint-disable-next-line no-console
            console.log('toggle todo status');
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {!isTodoTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodo?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoTemp || isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default memo(TodoItem);
