/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { UpdateTodo } from '../types/Updates';
import { FilterType } from '../enum/filterTypes';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  updateTodo: ({ id, newData }: UpdateTodo) => void;
  todoLoadingStates: { [key: number]: boolean };
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  updateTodo,
  todoLoadingStates,
}) => {
  const { id, completed, title } = todo;
  const { Completed } = FilterType;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const trimmedTitle = newTitle.trim();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = () => {
    if (trimmedTitle) {
      updateTodo({ id, newData: trimmedTitle, keyValue: 'title' });
    } else {
      onDelete(id);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            updateTodo({ id, newData: !completed, keyValue: Completed })
          }
        />
      </label>
      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
