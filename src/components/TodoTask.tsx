import classNames from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
}

export const TodoTask: FC<Props> = ({
  todo,
  deleteTodo,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
