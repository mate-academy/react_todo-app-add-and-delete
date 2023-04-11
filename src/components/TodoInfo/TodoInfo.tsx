import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onDelete: (id: number) => void
};

export const TodoInfo: React.FC<Props> = ({ todo, onDelete }) => {
  const { title, completed, id } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleChangeTodoStatus = () => {
    setIsCompleted((state) => !state);
  };

  return (
    <div className={
      classNames(
        'todo',
        { completed: isCompleted },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleChangeTodoStatus}
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
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
