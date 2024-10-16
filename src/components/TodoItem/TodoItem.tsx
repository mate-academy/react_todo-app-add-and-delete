/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onTodoDelete?: (todoId: number) => void;
}

export const TodoItem: FC<Props> = ({ todo, isLoading, onTodoDelete }) => {
  const [isEdited /*setIsEdited*/] = useState(false);
  const { id, title, completed } = todo;

  const handleTodoDelete = (todoId: number) => {
    if (onTodoDelete) {
      onTodoDelete(todoId);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {!isEdited ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(id)}
          >
            x
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
