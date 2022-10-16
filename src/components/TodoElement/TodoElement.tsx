import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleUpdate: () => void;
}

export const TodoElement: FC<Props> = ({
  todo,
  handleDelete,
  handleUpdate,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const {
    title, completed, id,
  } = todo;

  const deleteClick = () => setIsClicked(true);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleUpdate}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { title }
      </span>
      <button
        type="button"
        value={id}
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={(event) => {
          handleDelete(event);
          deleteClick();
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': id === 0 || isClicked },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
