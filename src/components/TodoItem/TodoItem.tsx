import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const [isHovered, setHover] = useState(false);

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {isHovered && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
