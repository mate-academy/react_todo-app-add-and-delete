import { FC } from 'react';
import classNames from 'classnames';

type Props = {
  completed: boolean,
  title: string,
  id: number,
  onRemove: (id: number) => void,
};

export const TodoComponent: FC<Props> = ({
  completed,
  title,
  id,
  onRemove: handleRemoveTodo,
}) => {
  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': !id },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
