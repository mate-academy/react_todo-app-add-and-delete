import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
}

export const TempTodo: FC<Props> = (
  {
    todo,
  },
) => {
  const { id, completed, title } = todo;

  return (
    <div
      className={classNames('todo is-loading', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <div className={classNames('modal overlay', {
        'is-active': !id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
