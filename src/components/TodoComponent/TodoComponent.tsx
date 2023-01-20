/* eslint-disable jsx-a11y/no-autofocus */
import { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove?: (todoId: number) => void,
  isLoading?: boolean,
};

export const TodoComponent:FC<Props> = ({
  todo,
  onRemove,
  isLoading = false,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState(-1);
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="TodoComponent"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {id === selectedTodoId ? (
        <form>
          <input
            data-cy="TodoTitleField"
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onBlur={() => setSelectedTodoId(-1)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodoId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onRemove?.(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
