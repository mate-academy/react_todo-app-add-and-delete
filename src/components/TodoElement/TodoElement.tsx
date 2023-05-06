import classNames from 'classnames';
import React from 'react';
import '../../styles/animation.scss';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleRemove: (id: number) => void;
  processedIds: number[];
}

export const TodoElement: React.FC<Props> = ({
  todo,
  handleRemove,
  processedIds,
}) => {
  const { completed, title, id } = todo;

  return (
    <li
      className={
        classNames('todo', { completed })
      }
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemove(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': id === 0 || processedIds.includes(id),
      })}
      >

        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
