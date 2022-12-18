import classNames from 'classnames';
import { memo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onDelete: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoInfo: React.FC<Props> = memo(({
  todo,
  onDelete,
  isLoading,
}) => {
  const {
    title,
    completed,
  } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
