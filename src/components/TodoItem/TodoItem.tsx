import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = (props) => {
  const { todo, onDelete } = props;
  const { id, title, completed } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);

  return (
    <div className={classNames(
      'todo',
      {
        completed,
      },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => setIsCompleted(prevStatus => !prevStatus)}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
