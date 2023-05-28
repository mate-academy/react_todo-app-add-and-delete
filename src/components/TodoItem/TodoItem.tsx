import React, { useContext } from 'react';
import classNames from 'classnames';
import { LoadingContext } from '../../context/LoadingContext';

type Props = {
  id: number,
  title: string,
  completed: boolean,
  deleteCurrentTodo?: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  deleteCurrentTodo,
}) => {
  const { isTodoLoading } = useContext(LoadingContext);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteCurrentTodo && deleteCurrentTodo(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay', {
            'is-active': isTodoLoading(id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
