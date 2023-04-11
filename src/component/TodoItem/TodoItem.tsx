import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);

  return (
    <div
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => setIsCompleted(prev => !prev)}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        x
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
