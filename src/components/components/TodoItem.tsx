import cn from 'classnames';
import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onDeleteTodo?: (id: number) => void
  isDelete?: boolean
};

export const TodoItem: FC<Props> = memo(({
  todo, onDeleteTodo, isDelete,
}) => {
  const { id, title, completed } = todo;

  const handleDeleteClick = () => {
    if (onDeleteTodo) {
      onDeleteTodo(id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isDelete || id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
